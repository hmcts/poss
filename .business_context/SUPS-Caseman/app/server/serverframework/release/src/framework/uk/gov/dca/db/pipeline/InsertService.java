package uk.gov.dca.db.pipeline;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.ExistenceCheckException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.UpdateLockedException;
import uk.gov.dca.db.pipeline.query.sql.SQLStatement;
import uk.gov.dca.db.pipeline.query.sql.StatementType;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Inserts an XML construct into the database given a template describing the
 * XML-&gt;RDBMS mapping.
 * 
 * @author Howard Henson
 */
public class InsertService extends DBService {

	private static final Log log = SUPSLogFactory.getLogger(InsertService.class);
    private final static Log sqllog = SUPSLogFactory.getLogger(SupsConstants.SQL_LOG);
    private static final String CREATE_SURROGATE_SCN = "create_surrogate_scn";
    private static final String CREATE_REAL_SCN = "create_real_scn";
    private static final String FETCH_REAL_SCN = "fetch_real_scn";
    
    private String m_modifySource;
    private String m_surrogateSCN = null;
    private Map m_surrogateSCNToRealSCN = new TreeMap();
    
    // used so that deletes are processed in the opposite order to inserts/updates.
    // has the scope of ALL queries resulting from a single invocation of the component:
    private LinkedList m_deleteStack = new LinkedList();
    
    /**
     * Validates the method configuration XML.
     */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadMap) 
    	throws SystemException
	{
    	Element eDataSource = processingInstructions.getChild("DataSource");
    	if ( eDataSource == null ) {
    		handler.raiseError("'DataSource' element needs to be specified for '"+getName()+"' [InsertService]");
    	}
    	else {
    		Attribute xpathAttr = eDataSource.getAttribute("xpath");
    		if ( xpathAttr == null ) {
    			handler.raiseError("'xpath' attribute needed by 'DataSource' element for '"+getName()+"' [InsertService]");
    		}
    		else {
    			String value = xpathAttr.getValue();
    			if ( value == null || value.length() == 0) {
    				handler.raiseError("Value needed by 'xpath' attribute for 'DataSource' element of '"+getName()+"' [InsertService]");
    			}
    		}
    	}
    	
    	super.validate(methodId,handler,processingInstructions,preloadMap);
	}
	
    /*
     * (non-Javadoc)
     * 
     * @see uk.gov.dca.db.impl.DBService#loadTemplate(org.jdom.Document)
     */
    public void prepare(Element config, Map preloadCache) throws SystemException 
    {
        super.prepare(config, preloadCache);
        
        Iterator queryExtensions = null;
        try {
        	queryExtensions = XPath.selectNodes(config, "./QueryExtension").iterator();
        }
        catch ( JDOMException e ) {
        	throw new SystemException("Failed to evaluate './QueryExtension' for '"+this.getName()+"': "+e.getMessage(),e); 
        }
        
        while (queryExtensions.hasNext()) {
            Element queryExtension = (Element) queryExtensions.next();
            Query query = (Query) m_queryDefinitions.m_queries.get(queryExtension.getAttributeValue("pivotNode"));

            query.extractModify(queryExtension);
        }
       
       	m_queryDefinitions.satisfyDependentQueryProperties();
  
        Element dataSource = null;
     
        try {
        	dataSource = (Element) XPath.selectSingleNode(config, "./DataSource");
        }
    	catch ( JDOMException e ) {
    		throw new SystemException("Failed to evaluate './DataSource' for '"+this.getName()+"': "+e.getMessage(),e); 
    	}
        m_modifySource = dataSource.getAttributeValue("xpath");
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see uk.gov.dca.db.impl.DBService#processTemplate(org.jdom.Document)
     */
    protected void processTemplate(Document parameters) throws BusinessException, SystemException 
	{
        populateApplicationContext(m_connection);
    	Element modifySource = null; 
    	
    	if ( m_modifySource != null ) {
    		try {
    			modifySource = (Element) XPath.selectSingleNode(parameters.getRootElement(), m_modifySource);
    		}
            catch ( JDOMException e ) {
            	throw new SystemException("Failed to evaluate '"+m_modifySource+"' against input for '"+this.getName()+"': "+e.getMessage(),e); 
            }
    	}

		if (modifySource == null) {
    		throw new BusinessException("Failed to find element '"+ m_modifySource + "' in input for '"+this.getName()+"'");
    	}
    	
    	// get first child (also only child)
		List children = modifySource.getChildren();
		if ( children.size() > 0 ) {
			Element dataRoot = (Element)children.get(0);
			// reparent child onto a document. Allows absolute xpaths to work ok.
    	
			Document dataDoc = new Document();
			dataRoot.detach();
			dataDoc.addContent(dataRoot);
		
	    	// get top level queries (can theoretically be >1 root query)
	    	Iterator rootQueries = m_queryDefinitions.getTopQueries().iterator();
	    	
	    	processQueries(rootQueries, null, dataDoc, parameters);
	    
	        // do deletion
	        performDeletes();
	        
	    	// now output result. In case of update this will be same as input (minus 'params' tags). In case of
	    	// add it will have sequence numbers filled in.

	    	this.m_outputData.setData(dataDoc, Document.class);
		}
		else {
			throw new BusinessException("No input provided to '"+this.getName()+"'");
		}
		
    }

    /**
     * Loops over all occurances of each pivot node, taking care to scope the processing of each
     * pivot element.
     * 
     * @param queries
     * @param parentContext
     * @param dataSrc
     * @param parameters
     * @throws BusinessException
     * @throws SystemException
     */
    private void processQueries(Iterator queries, ContextVariables parentContext, Object dataSrc, Document parameters)
    	throws BusinessException, SystemException
    {	
    	// loop over all pivots, performing inserts and updates. Deletes have to occur in reverse
    	// order so are put on a stack for processing later.
        while ( queries.hasNext() ) {
    		Query query = (Query)queries.next();
    		
    		if (query.isModifiable()) {
                Iterator elements = null;
            	String context = "";
            	String pivot = query.getPivotNode();
            	if ( parentContext != null) {
            		context = parentContext.getContext();
            	}	
            	String searchString = pivot.substring(context.length(), pivot.length());
            	if ( searchString.startsWith("/") ) {
            		searchString = searchString.substring(1);
            	}
            	
                try {	
                	elements = XPath.selectNodes(dataSrc, searchString).iterator();
        		}
                catch ( JDOMException e ) {
                	throw new SystemException("Failed to evaluate '" + query.getPivotNode() +"' for '"+this.getName()+"' input: "+e.getMessage(),e);
                }
                
                // Process each occurance of the pivot node, ensuring each runs in it's own context.
                while (elements.hasNext()) {
                	ContextVariables contextVariables = null;
                	if ( parentContext != null ) {
                		// create a child context
                		contextVariables = new ContextVariables(parentContext, query.getPivotNode());
                	}
                	else {
                		// create a root context
                		contextVariables = new ContextVariables(query.getPivotNode());
                        Iterator i = getProperties();
                        while (i.hasNext()) {
                            String propertyName = (String) i.next();
                            String xpath = getXPathForProperty(propertyName);
                            Object result = null;
                            try {
                            	result = XPath.selectSingleNode(parameters, xpath);
                    		}
                            catch ( JDOMException e ) {
                            	throw new SystemException("Unable to evaluate '"+ xpath +"' for '"+this.getName()+"' parameters:"+e.getMessage(),e);
                            }
                            String value = null;
                            //TODO: Handle multiple data types?
                            if (result instanceof Attribute) {
                                value = ((Attribute) result).getValue();
                            } else if (result instanceof Element) {
                                value = ((Element) result).getTextNormalize();
                            }
                            contextVariables.addVariable(propertyName, value);
                        }
                	}
                    
                    Element element = (Element) elements.next();
                    processQuery(contextVariables, query, element);
                    processQueries(query.getSubQueries().iterator(), contextVariables, element, parameters);
                }
                if(log.isDebugEnabled()){
                    log.debug("Processed query: [" + query.getPivotNode() + "]");
                }

            }
    	}
    }
    
    /**
     * Does deleting.
     * @throws SystemException
     * @throws BusinessException
     */
    private void performDeletes()
    	throws SystemException, BusinessException
    {
    	Iterator it = m_deleteStack.iterator();
    	DeleteSpec spec = null;
    	
    	while( it.hasNext() ) {
    		spec = (DeleteSpec)it.next();
    		processDelete(spec);
    	}
    }
    
    /**
     * Processes a Query from the Query def file. Can result in many actual database queries being
     * executed.
     * @param contextVariables
     * @param query
     * @param element
     * @throws SystemException
     */
    private void processQuery(ContextVariables contextVariables, Query query, Element element) 
    	throws SystemException, BusinessException 
	{
		Iterator tables = query.getModifyTableList();
		String alias = null;
    	
    	while (tables.hasNext()) {
    		Table table = (Table) tables.next();
    		alias = table.getAlias();
    		//determine if we are adding / updating / testing
    		if (query.hasExistanceCheck(alias))
    		{	
    			// first evaluate any xpath based pre-condition - this determines whether the database
    			// based existence check will be executed.
    			Query.ExistanceCheck existenceCheck = query.getExistanceCheck(alias);
    			if ( existenceCheck != null ) {
    				ICondition condition = existenceCheck.getPreCondition();
    				//there may not be a condition
    				if ( condition != null ) 
    				{
	    				// now see what action is required
    					boolean bConditionValue = condition.evaluate(element);

						if (log.isDebugEnabled() ) {
							log.debug("Existence check pre-condition evaluated for table '"+alias+"': "+ bConditionValue);
						}
						
	    				int actionId = existenceCheck.getPreConditionAction( bConditionValue );
	    				switch (actionId) {
	    					case Query.ExistanceCheck.FAIL:
	    						throw new ExistenceCheckException("Existence check failure pre-condition satisfied: (" + alias + ") [" + query.getPivotNode() + "]");
	    					case Query.ExistanceCheck.SKIP:
	    						//no query but make sure context params updated
	    						Iterator parameters = existenceCheck.getUniqueCheckParamters();
	    						while (parameters.hasNext()) {
	    			            	String parameter = (String) parameters.next();
	    			            	Object value = query.getParameterValue(contextVariables, alias, element, parameter);
	    			            	if(log.isDebugEnabled()){
                                        log.debug("Variable: " + parameter + " value: [" + value + "]");
                                    }

	    						}
	    						break;
	    					case Query.ExistanceCheck.CONTINUE:
	    						performExistenceCheck(contextVariables, query, alias, element);
	    						break;
	    					default:
	    						throw new ConfigurationException("Unable to process existence check pre-condition. Unknown action: "+actionId);
	    				}
    				}
    				else
    					performExistenceCheck(contextVariables, query, alias, element);
    			}
    		}
    		else if ( query.getModifySQLStatement(alias, StatementType.EXISTENCE_CHECK) != null ) {
    			performExistenceCheck(contextVariables, query, alias, element);
    		}
    	}
    }

    /**
     * Performs a database existence check for the given query and table alias. There are situations where the 
     * existence check is not performed as it is unnecessary. In the case that no value is provided for a parameter 
     * with an associated sequence table, the existence check is not performed as an INSERT is assumed.
     * 
     * If a value is missing for any parameter with no associated sequence table, a SystemException is generated
     * as this is assumed to be an error. 
     * 
     * @param contextVariables
     * @param query
     * @param tableAlias
     * @param dataSrc
     * @throws SystemException
     * @throws BusinessException
     */
    private void performExistenceCheck(ContextVariables contextVariables, Query query, String tableAlias, Element dataSrc)
    	throws SystemException, BusinessException
    {
    	String queryName = query.getPivotNode() + "_" + tableAlias + "_chk";
		if(log.isDebugEnabled()){
            log.debug("Performing existance check: " + queryName);
        }

		int onExistsAction = Query.ExistanceCheck.UPDATE;
		int onNotExistsAction = Query.ExistanceCheck.ADD;
		
		ResultSet rs = null;
		PreparedStatement ps = null;
		
		boolean performExistenceCheck = true;
		try {
			if(query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK) == null) {
				//perform existence check
				PreparedQuery pq = getStatement(queryName); 
                ps = pq.getPreparedStatement(m_connection);
				
				Iterator parameters = null;
				
				Query.ExistanceCheck existanceCheck = query.getExistanceCheck(tableAlias);
				if(existanceCheck == null) {
					throw new ConfigurationException("Assertion failure: No Existence check element or SQL statement specified for '" + query.getPivotNode()+"'"); 
				}
					
				onExistsAction = existanceCheck.getOnExistsAction().getValue(dataSrc);
				onNotExistsAction = existanceCheck.getOnNotExistsAction().getValue(dataSrc);
				parameters = existanceCheck.getUniqueCheckParamters();

				// check for any parameters that have no supplied value
				while (parameters!=null && parameters.hasNext()){
					String parameter = (String)parameters.next();
					Object value = query.getParameterValue(contextVariables, tableAlias, dataSrc, parameter);
					if (value == null || value.equals("")){
						String sequence = query.getSequenceFor(parameter);
						if (sequence!=null){
							// don't perform the existence check if the empty parameter has an associated sequence
							performExistenceCheck = false;
						}
						else {
							// missing parameter value
							throw new SystemException("Existence check failure for query: " + queryName 
									+ ": No value specified for parameter: " + parameter);
						}
						break;
					}
				}
				
				if (performExistenceCheck){
					if(sqllog.isInfoEnabled()){
		        		DBUtil.logSql(sqllog, query.getPivotNode(), pq.getSQLString());  
	                }
					parameters = existanceCheck.getUniqueCheckParamters();
					populatePreparedStatement(contextVariables, query, dataSrc, tableAlias, ps, parameters, false);
				}
			}
			else {
				SQLStatement existenceCheckSQL = query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK);
				ps = existenceCheckSQL.prepare(m_connection, contextVariables, dataSrc, tableAlias);
				if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), existenceCheckSQL.getSQL());  
                }
			}
			
			boolean exists = false;
			if (performExistenceCheck) {
				try {
					rs = ps.executeQuery();
				} catch (SQLException e) {
					throw new SystemException(
							"Failed to execute existence check '" + queryName
									+ "': " + e.getMessage(), e);
				}
				try {
					exists = rs.next();
				} catch (SQLException e) {
					throw new SystemException(
							"Failed to retrieve result of existence check '"
									+ queryName + "': " + e.getMessage(), e);
				}
				if (log.isDebugEnabled()) {
					log.debug("[" + queryName + "] "
							+ (exists ? "exists" : "does not exist"));
				}
			}			
			String action = null;
			
			if (exists)
				action = processExistanceAction(onExistsAction, query, contextVariables, tableAlias, dataSrc);
			else
				action = processExistanceAction(onNotExistsAction, query, contextVariables, tableAlias, dataSrc);
    	}
    	finally	{
    		DBUtil.quietClose(rs);
	    	//if(query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK) != null && ps != null) {
	    	DBUtil.quietClose(ps);
	    	//}	
    	}
    }
    
    /**
     * Performs processing, switching upon the passed action type.
     * @param existanceCheckAction
     * @param query
     * @param contextVariables
     * @param alias
     * @param element
     * @throws BusinessException
     * @throws SystemException
     */
    private String processExistanceAction( int existanceCheckAction, Query query, ContextVariables contextVariables,
    		String alias, Element element)
    	throws BusinessException, SystemException
    {
    	String action = null;
    	switch (existanceCheckAction) {
			case Query.ExistanceCheck.FAIL:
				throw new ExistenceCheckException("Existence check failure condition satisfied: (" + alias + ") [" + query.getPivotNode() + "]");
			case Query.ExistanceCheck.ADD:
				processAdd(contextVariables, query, alias, element);
				// could be an old scn not used thus far if reuse XML fragments from other commit operations
				removeOldSCN(element, alias); 
				insertSurrogateSCN(element, alias);
				action = "insert";
				break;
			case Query.ExistanceCheck.UPDATE:
				processUpdate(contextVariables, query, alias, element);
				removeOldSCN(element, alias);
				insertSurrogateSCN(element, alias);
				action = "update";
				break;
			case Query.ExistanceCheck.SKIP:
				break;
			case Query.ExistanceCheck.DELETE:
				registerDelete(contextVariables, query, alias, element);
				action = "delete";
				break;
			default:
				throw new ConfigurationException("Unable to process existence check. Unknown action: "+existanceCheckAction);
		}
    	
    	return action;
    }
    
//    private void processAuditInformation(Date date, String action, Query query, ContextVariables contextVariables, Table table, Element element) throws SystemException, BusinessException {
//    	//TODO:
//    	
//    	String queryName = query.getPivotNode() + "_" + table.getAlias() + "_audit";
//    	Iterator parameters = null;
//    	PreparedStatement ps = null;
//    	
//		Query.ExistanceCheck existanceCheck = query.getExistanceCheck(table.getAlias());
//		if(existanceCheck == null) {
//			throw new ConfigurationException("Assertion failure: No Existence check element or SQL statement specified for '" + query.getPivotNode()+"'"); 
//		}
//    	try
//		{
//    		PreparedQuery pq = getStatement(queryName); 
//			ps = pq.getPreparedStatement(m_connection);
//			
//    		if(sqllog.isInfoEnabled()){
//        		DBUtil.logSql(sqllog, query.getPivotNode(), pq.getSQLString());  
//            }
//    		
//    		String userId = (String) m_context.getSystemItem(IComponentContext.USER_ID_KEY);
//    		String courtId = (String) m_context.getSystemItem(IComponentContext.COURT_ID_KEY);
//    		String businessProcessId = (String) m_context.getSystemItem(IComponentContext.BUSINESS_PROCESS_ID_KEY);
//    		
//    		// TODO: This must be removed for release 7.1 when the court_id will be passed as part of security functionality
//    		if(courtId == null) {
//    			courtId = "N/A";
//    		}
//    		
//    		if(businessProcessId == null) {
//    			businessProcessId = "N/A";
//    		}
//    		
//    		//ps.setDate(2, date);
//    		ps.setTimestamp(2, new Timestamp(date.getTime()));
//    		ps.setString(5, businessProcessId);
//    		ps.setString(4, action);
//    		ps.setString(3, userId);
//    		ps.setString(1, courtId);
//			parameters = existanceCheck.getUniqueCheckParamters();
//			populatePreparedStatement(contextVariables, query, element, table.getAlias(), ps, parameters, false, 6);
//    		
//    		ps.execute();
//		    ps.clearParameters();
//		    ps = null;
//		}
//    	catch(SQLException e) {
//    		if (log.isErrorEnabled() ) {
//    			log.error("Failed to add Audit record for data change: "+e.getMessage(), e);
//    		}
//	    	throw new SystemException("Failed to add Audit record for data change: "+e.getMessage(), e);
//	    }
//		finally {
//            DBUtil.quietClose(ps);
////    		try {
////	    		if (ps != null) ps.clearParameters();
////    		}
////			catch(SQLException e) {
////				log.error("processAuditInformation : Failed to tidy up after Audit record.");
////			}
//		}	
//    }
    
    /**
     * Creates a new SurrogateSCN element in the output dom
     * @param pivotNode
     * @param tableAlias
     */
    protected void insertSurrogateSCN(Element pivotNode, String tableAlias) 
    	throws SystemException
    {
    	// insert surrogate SCN into output doc
		Element newElement = new Element("SurrogateSCN");
		newElement.setAttribute("table", tableAlias);
		newElement.setText( getSurrogateSCN() );
		pivotNode.addContent(newElement);
    }
    
    /**
     * Removes any old SCN or SurrogateSCN (for the specified table) 
     * from the output dom.
     * @param pivotNode
     * @param tableAlias
     * @throws SystemException
     */
    protected void removeOldSCN(Element pivotNode, String tableAlias) 
    	throws SystemException
    {
    	String sSCNXPath = "./SCN[@table='" + tableAlias + "']";
		Object scnElement = null;
		try {
			scnElement = XPath.selectSingleNode( pivotNode, sSCNXPath);
		}
		catch(JDOMException e) {
			throw new SystemException("Failed to evaluate '"+sSCNXPath+"' for '"+pivotNode.getName()+"': "+e.getMessage(),e);
		}
		
		boolean bRemovedSCN = false;
		if ( scnElement != null ) {
			pivotNode.removeContent( (Element)scnElement );
			bRemovedSCN = true;
		}
		
		if (!bRemovedSCN) {
			sSCNXPath = "./SurrogateSCN[@table='" + tableAlias + "']";
			try {
				scnElement = XPath.selectSingleNode( pivotNode, sSCNXPath);
			}
			catch(JDOMException e) {
				throw new SystemException("Failed to evaluate '"+sSCNXPath+"' for '"+pivotNode.getName()+"': "+e.getMessage(),e);
			}
			if ( scnElement != null ) {
				pivotNode.removeContent( (Element)scnElement );
			}
		}
    }
    
    /**
     * Adds a delete spec to the delete stack.
     * Have to make sure that context is populated so that queries associated with child pivots
     * work correctly.
     * @param contextVariables
     * @param query
     * @param alias
     * @param element
     * @throws BusinessException
     * @throws SystemException
     */
    private void registerDelete(ContextVariables contextVariables, Query query, String alias, Element element) 
		throws BusinessException, SystemException
	{
	    SQLStatement deleteSQL = deleteSQL = query.getModifySQLStatement(alias, StatementType.DELETE);
	    
	    if(deleteSQL != null) {
	    	// make sure context vars are populated in the case of a dynamic SQL delete
	      	deleteSQL.populateContext(contextVariables, element, alias);
	    }
	        
	    // NOTE: a standard delete uses the same params as the existence check,
	    // therefore context will have been populated by that query.
	    
	    // add delete to delete stack
	    DeleteSpec spec = new DeleteSpec(contextVariables, query, alias, element);
	    m_deleteStack.addFirst(spec);
	    
	    if ( log.isDebugEnabled() ) {
	    	log.debug("Registered delete for: "+query.getPivotNode());
	    }
	}
	
    /**
     * Performs a delete given a delete spec.
     * @param spec
     * @throws BusinessException
     * @throws SystemException
     */
    private void processDelete(DeleteSpec spec) 
    	throws BusinessException, SystemException
	{
    	ContextVariables contextVariables = spec.getContext();
		Query query = spec.getQuery();
		String alias = spec.getTableAlias();
		Element element = spec.getDataElement();
		
        Table table = query.getTableFor(alias);

        PreparedStatement ps = null;
        SQLStatement deleteSQL = null;
        
        try {
        	deleteSQL = query.getModifySQLStatement(alias, StatementType.DELETE);
	        if(deleteSQL != null) {
	        	// a dynamic or custom sql statement
	        	ps = deleteSQL.prepare(m_connection, contextVariables, element, alias);
	       		if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), deleteSQL.getSQL());  
                }
	        }
	        else {
	        	// a framework generated, static statement
	        	String queryName = query.getPivotNode() + "_" + table.getAlias() + "_delete";
	        	PreparedQuery pq = getStatement(queryName);
	        	ps = pq.getPreparedStatement(m_connection);
	        	
	        	Query.ExistanceCheck existanceCheck = query.getExistanceCheck(alias);
	        	
                if(sqllog.isInfoEnabled()){
                    DBUtil.logSql(sqllog, query.getPivotNode(), pq.getSQLString());  
                }
	        	populatePreparedStatement(contextVariables, query, element, alias, ps, 
	        			existanceCheck.getUniqueCheckParamters(), existanceCheck.useOptimisticLock());
	        }
	        int updates = 0;
	        try {
	        	updates = ps.executeUpdate();
	        }
    		catch(SQLException e){
    			throw new SystemException("Failed to delete from database table '"+table.getName()+"': "+e.getMessage(),e);
    		}
	        //detect write/write conflict here so can uniquely identify that the update failed
	        //because of the SCN number. If do on check exists then may end up adding duplicate
	        //primary keys.
	        if ( updates == 0 ) {
	        	throw new UpdateLockedException("Write/write conflict occurred '"+table.getName()+"'");
	        }
        }
        finally {
    		//if(deleteSQL != null && ps != null) {
        	DBUtil.quietClose(ps);
        	//}
        }
    }

    private void populatePreparedStatement(ContextVariables contextVariables,
            Query query, Element element, String alias, PreparedStatement ps,
            Iterator parameters, boolean bUseSCN)
    	throws SystemException, BusinessException
	{
    	populatePreparedStatement(contextVariables,
                query, element, alias, ps,
                parameters, bUseSCN, 1);
	}
    
    /**
     * @param contextVariables
     * @param query
     * @param element
     * @param alias
     * @param ps
     * @param parameters
     * @throws SystemException
     * @throws BusinessException
     */
    private void populatePreparedStatement(ContextVariables contextVariables,
            Query query, Element element, String alias, PreparedStatement ps,
            Iterator parameters, boolean bUseSCN, int count)
    	throws SystemException, BusinessException
	{
        
        while (parameters.hasNext()) {
            String parameter = (String) parameters.next();
            Object value = query.getParameterValue(contextVariables, alias, element, parameter);
            if(log.isDebugEnabled()){
                log.debug("Variable: " + parameter + " value: [" + value + "]");
            }
            
            try {
	         if (value == null){
	                ps.setString(count++, null);
	            }
	            else{
	            	ps.setObject(count++, value);
	            }
            }
            catch(SQLException e) {
               	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
            }
        }
        
        // if updating then make sure the SCN is populated
        if ( bUseSCN == true) {
        	String sSCN = null;
        	
        	if (log.isDebugEnabled() ) {
        		log.debug("Getting SCN value for " + element.getName() + ":" + alias);
        	}
        	
        	String sXPath = "./SCN[@table='" + alias + "']";
        	Element scnElement = null;
        	try {
        		scnElement = (Element)XPath.selectSingleNode( element, sXPath);
        	}
        	catch(JDOMException e) {
        		throw new SystemException("Failed to evaluate '"+sXPath+"' for element '"+element.getName()+"': "+e.getMessage(),e);
        	}
        	
        	if ( scnElement != null ) {
        		if (log.isDebugEnabled() ) {
        			log.debug("Got SCN value for " + element.getName() + ":" + alias);
        		}
        		sSCN = scnElement.getText();
        	}
        	else {
        		if (log.isDebugEnabled() ) {
        			log.debug("Getting SurrogateSCN value for " + element.getName() + ":" + alias);
        		}
        		// if there is no SCN there may be a SurrogateSCN
        		String surrXPath = "./SurrogateSCN[@table='" + alias + "']";
            	Element surrScnElement = null;
            	try {
            		surrScnElement = (Element)XPath.selectSingleNode( element, surrXPath);
            	}
            	catch(JDOMException e) {
            		throw new SystemException("Failed to evaluate '"+surrXPath+"' for element '"+element.getName()+"': "+e.getMessage(),e);
            	}
            	
            	if ( surrScnElement != null ) {
            		String surrogateSCN = surrScnElement.getText();
            		sSCN = getRealSCN(surrogateSCN);
            	}
        	}
        	if ( sSCN != null && sSCN.length() != 0 ) {
        		
        		if (log.isDebugEnabled() ) {
        			log.debug("Table '"+alias+"' SCN=" + sSCN );
        		}
        		
        		try {
        			ps.setObject(count++, sSCN);
        		}
        		catch(SQLException e) {
        			throw new SystemException("Failed to set query SCN parameter: "+e.getMessage(),e);
        		}
        	}
        	else {
        		throw new BusinessException("Element '"+element.getName()+"' requires an SCN transaction child element in order to update");
        	}
        }
    }

    private void setProperty(ContextVariables contextVariables, Query query,
            String parameter, Element element, Object value)
    	throws BusinessException,SystemException
	{
        String xpath = query.getXPathFor(parameter);
        Object node = null;
        try {
        	node = XPath.selectSingleNode(element, xpath);
        }
        catch(JDOMException e) {
        	throw new SystemException("Failed to find value for parameter '"+parameter+"' using '"+xpath+"': "+e.getMessage(),e);
        }
        
        if (node != null) {
            if (node instanceof Element) {
                ((Element) node).setText(value.toString());
            } else if (value instanceof Attribute) {
                ((Attribute) node).setValue(value.toString());
            } else {
                throw new SystemException("XPath result not understood: " + node.toString());
            }
        }
        // update all properties which use the same xpath. Note: only reliable in the
        // case that the xpath evaluates to 1 node (would not reach this code if that 
        // was not true).
        Vector identicalProperties = query.getParamsFor(xpath);
        Iterator it = identicalProperties.iterator();
        while(it.hasNext()) {
        	contextVariables.addVariable((String)it.next(), value);
        }
    }

    /**
     * Updates a row in the database
     * @param contextVariables
     * @param query
     * @param alias
     * @param element
     * @throws SystemException
     * @throws BusinessException
     */
    private void processUpdate(ContextVariables contextVariables, Query query,
            String alias, Element element) 
    	throws SystemException, BusinessException 
	{
    	Table table = query.getTableFor(alias);

    	PreparedStatement ps = null;
    	Iterator parameters = null;
    	SQLStatement updateSQL = null;
    	try {
    		boolean useOptimisticLock = false;
	    	updateSQL = query.getModifySQLStatement(alias, StatementType.UPDATE);
	    		
	    	if(updateSQL != null) {
	    		// a dynamic or custom sql statement
	    		ps = updateSQL.prepare(m_connection, contextVariables, element, alias);
	    		if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), updateSQL.getSQL());  
                }
	    	}
	    	else {
	    		// a framework generated, static statement
	    		parameters = prepareModifyParameters(query, alias, true).iterator();
	    		useOptimisticLock = query.getExistanceCheck(alias).useOptimisticLock();
	    		String queryName = query.getPivotNode() + "_" + alias + "_update";
	    		
	    		PreparedQuery pq = getStatement(queryName); 
				ps = pq.getPreparedStatement(m_connection);
			
	    		if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), pq.getSQLString());  
                }
	    		
	    		populatePreparedStatement(contextVariables, query, element, alias, ps, parameters, useOptimisticLock);
	    	}
	    	  
	        int updates = 0;
	        try {
	        	updates = ps.executeUpdate();
	        }
    		catch(SQLException e){
    			throw new SystemException("Failed to update database table '"+table.getName()+"': "+e.getMessage(),e);
    		}
	        //detect write/write conflict here so can uniquely identify that the update failed
	        //because of the SCN number. If do on check exists then may end up adding duplicate
	        //primary keys.
	        if ( updates == 0 ) {
	        	throw new UpdateLockedException("Write/write conflict occurred on table '"+table.getName()+"'");
	        }
    	}
    	finally {
//    		if(updateSQL != null && ps != null) {
  			DBUtil.quietClose(ps);
//    		}
    	}
    }

    
    private List prepareModifyParameters(Query query, String alias, boolean select) 
    {
        List rVal = new LinkedList();
        Iterator parameters = query.getModifyParameters(alias);
        Query.ExistanceCheck existanceCheck = query.getExistanceCheck(alias);
        
        while (parameters.hasNext()) {
            String parameter = alias + "." + (String) parameters.next();
            rVal.add(parameter);
        }
        if (select) {
            parameters = existanceCheck.getUniqueCheckParamters();
            while (parameters.hasNext()) {
                String parameter = (String) parameters.next();
                rVal.add(parameter);
            }
        }
        return rVal;
    }

    /**
     * Inserts data into the database
     * @param contextVariables
     * @param query
     * @param alias
     * @param element
     * @throws SystemException
     * @throws BusinessException
     */
    private void processAdd(ContextVariables contextVariables, Query query, String alias, Element element) 
    	throws SystemException,BusinessException
	{
    	List pList = null;
    	PreparedStatement ps = null;
		ResultSet rs = null;
    	
		try {
            
	    	if(query.getModifySQLStatement(alias, StatementType.INSERT) == null) {
                
                pList = prepareModifyParameters(query, alias, false);
                for (Iterator parameters = pList.iterator(); parameters.hasNext();) {
                    String varName = (String) parameters.next();
                    if (query.hasSequenceFor(varName)) {
                        String sequence = query.getSequenceFor(varName);
                        try {
                            String seqVal = String.valueOf(DBUtil.getNextSequenceValue(m_connection, sequence));
                            query.addContextParameter(contextVariables, varName, seqVal);
                            setProperty(contextVariables, query, varName, element, seqVal);
                        }
                        catch (SQLException e) {
                            throw new SystemException("Unable to get sequence value for: " + sequence, e);
                        }
                    }
                }
                
                List unbound = query.getUnboundProperties();
                for (Iterator iUnBound = unbound.iterator(); iUnBound.hasNext();) {
                    String property = (String) iUnBound.next();
                    if ( query.hasSequenceFor(property) ) {
                        Object objVal = contextVariables.getValue(property);
                        if ( objVal != null && objVal.toString().length() == 0) {
                            String sequence = query.getPivotNode() + "_sequenceVal_${" + property.toUpperCase() + "}";
                            try {
                                String seqVal = String.valueOf(DBUtil.getNextSequenceValue(m_connection, sequence));
                                query.addContextParameter(contextVariables, property, seqVal);
                            }
                            catch (SQLException e) {
                                throw new SystemException("Unable to get sequence value for: " + sequence, e);
                            }
                        }
                    }
                }
		        Iterator parameters = pList.iterator();
				// now do the add
	        	String queryName = query.getPivotNode() + "_" + alias + "_add";
	        	
	        	PreparedQuery pq = getStatement(queryName); 
				ps = pq.getPreparedStatement(m_connection);
	        	
	        	if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), pq.getSQLString());  
                }
		        populatePreparedStatement(contextVariables, query, element, alias, ps, parameters, false);
			}
			else {
			
                // For custom SQL just add the sequence values for any undefined context variables.
                for (Iterator parameters = contextVariables.getVariableNames(); parameters.hasNext();) {
                    String varName = (String) parameters.next();
                    Object o = contextVariables.getValue(varName);
                    if (query.hasSequenceFor(varName) && (o == null || o.toString().length() == 0)) {
                        String sequence = query.getSequenceFor(varName);
                        try {
                            String seqVal = String.valueOf(DBUtil.getNextSequenceValue(m_connection, sequence));
                            query.addContextParameter(contextVariables, varName, seqVal);
                            setProperty(contextVariables, query, varName, element, seqVal);
                        }
                        catch (SQLException e) {
                            throw new SystemException("Unable to get sequence value for: " + sequence, e);
                        }
                    }
                }
                
				// a dynamic or custom sql statement
				SQLStatement insertSQL = query.getModifySQLStatement(alias, StatementType.INSERT);
				ps = insertSQL.prepare(m_connection, contextVariables, element, alias);
				if(sqllog.isInfoEnabled()){
	        		DBUtil.logSql(sqllog, query.getPivotNode(), insertSQL.getSQL());  
                }
			}
	
		    try {
		        ps.execute();
		    } 
		    catch (SQLException e) {
		        throw new SystemException("Failed to execute query '"+query.getPivotNode() + "_" + alias + "_add': "+e.getMessage(),e);
		    }
		}
		finally {
    		DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
//    		if(query.getModifySQLStatement(alias, StatementType.INSERT) != null && ps != null) {
//	    		DBUtil.quietClose(ps);
//	    	}
//			else {
//				try {
//					if ( ps != null ) ps.clearParameters();
//				}
//				catch(SQLException e) {
//					throw new SystemException("Failed to clear statement parameters: "+e.getMessage(),e);
//				}
//    		}
		}
        if(log.isDebugEnabled()){
            log.debug("Add for table: " + alias + " complete");
        }

    }

    /*
     * (non-Javadoc)
     * 
     * @see uk.gov.dca.db.impl.DBService#prepareQueries()
     */
    protected void prepareQueries() throws SystemException {
        resetStatements();
        Iterator queries = m_queryDefinitions.getQueries();
        StringBuffer buff = new StringBuffer(256);
        
        prepareSCNQueries();
        
        while (queries.hasNext()) {
            Query query = (Query) queries.next();
            if (query.isModifiable()) {
                Iterator tables = query.getSelectTables();
                while (tables.hasNext()) {
                    Table table = (Table) tables.next();
                    if(query.hasExistanceCheck(table.getAlias())) {
                        prepareExistanceCheck(query, table, buff);
                        
                        if(query.getModifySQLStatement(table.getAlias(), StatementType.EXISTENCE_CHECK) == null) {
   	                        // only prepare queries we will need to use.
	                        // Note: Queries are only executed for tables with an existance check
	                        Query.ExistanceCheck existanceCheck = query.getExistanceCheck(table.getAlias());
	                        if ( existanceCheck != null ) {
	                        	Query.ExistanceCheck.ExistenceCheckAction onExistsAction = existanceCheck.getOnExistsAction();
	                        	Query.ExistanceCheck.ExistenceCheckAction onNotExistsAction = existanceCheck.getOnNotExistsAction();
	                        	
	                        	int onExistsActionTrue = onExistsAction.getTrueAction();
	                        	int onExistsActionFalse = onExistsAction.getFalseAction();
	                        	int onNotExistsActionTrue = onNotExistsAction.getTrueAction();
	                        	int onNotExistsActionFalse = onNotExistsAction.getFalseAction();
	                        	
	                        	if (onExistsActionTrue == Query.ExistanceCheck.UPDATE || onExistsActionFalse == Query.ExistanceCheck.UPDATE) {
			                    	prepareUpdate(query, table, buff);
	                        	}
	                        	if (onExistsActionTrue == Query.ExistanceCheck.DELETE || onExistsActionFalse == Query.ExistanceCheck.DELETE) {
			                    	prepareDelete(query, table, buff);
	                        	}
	                        	if (onNotExistsActionTrue == Query.ExistanceCheck.ADD || onNotExistsActionFalse == Query.ExistanceCheck.ADD) {
	                        		prepareInsert(query, table, buff);
	                        	}
	                        }
                        }
                    }
                }
            }
        }
    }

    /**
     * Prepares the existance check query
     * @param query
     * @param table
     * @param buff
     * @throws SQLException
     */
    protected void prepareExistanceCheck(Query query, Table table, StringBuffer buff)
    	throws SystemException 
	{
        /* Reset the buffer */
        buff.setLength(0);
        
        /* Begin SQL INSERT statement */
	    buff.append("SELECT 'EXISTS' FROM ");
	    /* adds the table definitions to select from here */
	    buff.append(table.toString());
	    /* adds the query join constraints */
	    Query.ExistanceCheck existanceCheck = query.getExistanceCheck(table.getAlias());
	        
	    if (existanceCheck.getUniqueQueryClause() != null
	            && !"".equals(existanceCheck.getUniqueQueryClause())) {
	        buff.append(" WHERE ");
	        buff.append(existanceCheck.getUniqueQueryClause());
	    }
        if(log.isDebugEnabled()){
            log.debug("Query [" + query.getPivotNode() + "] : " + buff.toString());
        }

        
        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_chk";
        addStatement(queryName,	buff.toString());	
    }

    
    protected void prepareAudit(Query query, Table table, StringBuffer buff) throws SystemException
	{
    	StringBuffer valuesBuff = new StringBuffer();
    	buff.setLength(0);
    	buff.append("INSERT INTO ");
    	buff.append(table.getShadowSchema());
    	buff.append(".");
    	buff.append(table.getName());
    	buff.append(" ( ");
	    Iterator parameters = query.getModifyParameters(table.getAlias());
	    
	    Iterator columns = table.getColumns().iterator();
	    /* Adds the selection parameters to the Select statement here */
	    //TODO: Court to be added after security
	    while (columns.hasNext()) {
	        String column = (String) columns.next();
	        buff.append(column);
	        valuesBuff.append(column);
	        if (columns.hasNext()) {
	            buff.append(", ");
	            valuesBuff.append(", ");
	        }
	    }
	    
	    buff.append(", UPDATE_COURT_ID, UPDATE_DATE, UPDATE_USERID, OPERATION, UPDATE_PROCESS_ID) ( SELECT ");
	    buff.append(valuesBuff);
	    buff.append(", ? AS UPDATE_COURT_ID, ? AS UPDATE_DATE, ? AS UPDATE_USERID, ? AS OPERATION, ? AS UPDATE_PROCESS_ID");
	    buff.append(" FROM ");
	    buff.append(table.getName());
	    buff.append(" ");
	    buff.append(table.getAlias());

	    Query.ExistanceCheck existanceCheck = query.getExistanceCheck(table.getAlias());
        
	    if (existanceCheck.getUniqueQueryClause() != null
	            && !"".equals(existanceCheck.getUniqueQueryClause())) {
	        buff.append(" WHERE ");
	        buff.append(existanceCheck.getUniqueQueryClause());
	    }
	    buff.append(")");
	    
	    String queryName = query.getPivotNode() + "_" + table.getAlias() + "_audit";
        addStatement(queryName, buff.toString());
	}
    
    /**
     * Prepares the insert query
     * @param query
     * @param table
     * @param buff
     * @throws SystemException
     */
    protected void prepareInsert(Query query, Table table, StringBuffer buff)
            throws SystemException {
        /* Reset the buffer */
        buff.setLength(0);
        
        /* Begin SQL INSERT statement */
	    buff.append("INSERT INTO ");
	    buff.append(table.toString());
	    buff.append(" ( ");
	    Iterator parameters = query.getModifyParameters(table.getAlias());
	    /* Adds the selection parameters to the Select statement here */
	    while (parameters.hasNext()) {
	        String parameter = (String) parameters.next();
	        buff.append(parameter);
	        if (parameters.hasNext()) {
	            buff.append(", ");
	        } else {
	            buff.append(" ) ");
	        }
	    }
	    buff.append(" VALUES ( ");
	    parameters = query.getModifyParameters(table.getAlias());
	    while (parameters.hasNext()) {
            parameters.next();
            buff.append("?");
	        if (parameters.hasNext()) {
	            buff.append(", ");
	        }
	    }
	    buff.append(" )");
	    if(log.isDebugEnabled()){
            log.debug("Query [" + query.getPivotNode() + "] : " + buff.toString());
        }

        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_add";
        addStatement(queryName, buff.toString()); 
    }

    /**
     * Prepares the update query
     * @param query
     * @param table
     * @param buff
     * @throws SystemException
     */
    protected void prepareUpdate(Query query, Table table, StringBuffer buff)
            throws SystemException 
	{
    	/* Reset the buffer */
        buff.setLength(0);

        /* Begin SQL Update statement */
		buff.append("UPDATE ");
		buff.append(table.toString());
		buff.append(" SET ");
		Iterator parameters = query.getModifyParameters(table.getAlias());
		// Add the modify parameters here
		while (parameters.hasNext()) {
		     String parameter = (String) parameters.next();
		     buff.append(parameter);
		     if (parameters.hasNext()) {
		          buff.append(" = ?, ");
		     } else {
		          buff.append(" = ? ");
		     }
		}
		        
		buff.append("WHERE ");
		        
		// add the query join constraints
		boolean bAddedJoin = false;
		Query.ExistanceCheck existanceCheck = query.getExistanceCheck(table.getAlias());
		if ( existanceCheck != null && existanceCheck.getUniqueQueryClause() != null
		 			&& !"".equals(existanceCheck.getUniqueQueryClause())) 
		{
			buff.append(existanceCheck.getUniqueQueryClause());
		   	bAddedJoin = true;
		}
		        
		// all updates should provide an SCN to ensure no write/write conflicts
		if ( existanceCheck.useOptimisticLock() == true ) {
		    	if ( bAddedJoin ) buff.append(" AND ");
		           buff.append("ORA_ROWSCN = ?");
		}
		
        // now add to statements:
        if(log.isDebugEnabled()){
            log.debug("Query [" + query.getPivotNode() + "] : " + buff.toString());
        }

        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_update";
        addStatement(queryName, buff.toString());
    }
    
    /**
     * Prepares the delete query
     * @param query
     * @param table
     * @param buff
     * @throws SystemException
     */
    protected void prepareDelete(Query query, Table table, StringBuffer buff)
            throws SystemException 
	{
    	/* Reset the buffer */
        buff.setLength(0);
        
        String alias = table.getAlias();
        
    	// a framework generated, static statement
    	Query.ExistanceCheck existanceCheck = query.getExistanceCheck(alias);
    	buff.append("DELETE FROM ");
    	buff.append(table);
    	buff.append(" WHERE ");
    	buff.append(existanceCheck.getUniqueQueryClause());
    	
    	if(existanceCheck.useOptimisticLock()) {
    		buff.append(" AND ORA_ROWSCN = ?");
    	}

    	String queryName = query.getPivotNode() + "_" + table.getAlias() + "_delete";
    	addStatement(queryName, buff.toString());
	}
    
    /**
     * Prepares a query used to fetch the rowscn given a surrogate scn
     * @param buff
     * @throws SystemException
     */
    protected void prepareSCNQueries()
    	throws SystemException
    {
    	// query for creating new surrogate SCN
        String queryName = null;
        
    	String query = "SELECT SCN_INDEX_SEQUENCE.NEXTVAL FROM DUAL";   
    	queryName = CREATE_SURROGATE_SCN;
        addStatement(queryName, query);
        
        // query for assigning a real SCN to the surrogate SCN
        query = "INSERT INTO TRANSACTION_LIST (TRANSACTION_ID) VALUES (?)";  
    	queryName = CREATE_REAL_SCN;
        addStatement(queryName, query);

        // query for getting real SCN from surrogate SCN
        query = "SELECT ORA_ROWSCN FROM TRANSACTION_LIST WHERE TRANSACTION_ID=?";  
    	queryName = FETCH_REAL_SCN;
        addStatement(queryName, query);
    }
    
    /**
     * Gets the surrogate SCN for this transaction.
     * @return
     */
    protected String getSurrogateSCN() 
    	throws SystemException
	{
    	if ( log.isDebugEnabled() ) {
    		log.debug("getting surrogate. Current="+m_surrogateSCN);
    	}
    	
    	if ( m_surrogateSCN == null ) {
    		PreparedStatement ps = null;
    		ResultSet rs = null;

        	PreparedQuery pq = getStatement(CREATE_SURROGATE_SCN); 
			ps = pq.getPreparedStatement(m_connection);

			if(sqllog.isInfoEnabled()){
        		DBUtil.logSql(sqllog, pq.getSQLString());  
            }
			
    		try {      	
    			rs = ps.executeQuery();
 
	    		if ( rs != null ) {
	    			rs.next();
	    			Object oNextval = rs.getObject(1);
	    			String sNextval = oNextval.toString();
	    			
	    			m_surrogateSCN = sNextval;
	    			if (log.isDebugEnabled()) {
	    				log.debug("got surrogate. New="+m_surrogateSCN);
	    			}
	    			
	    			// now create new db entry which will provide us with the SCN.
	    			// Note: do not get SCN now because SCN it is only generated on commit.
	    			pq = getStatement(CREATE_REAL_SCN);
	    			ps = pq.getPreparedStatement(m_connection);
	    			
	    			if(sqllog.isInfoEnabled()){
	            		DBUtil.logSql(sqllog, pq.getSQLString());  
	                }
	    			
	    			ps.setString(1,m_surrogateSCN);
	        		ps.execute();
	    		}
    		}
    		catch(SQLException e) {
    			throw new SystemException("Failed to query for value of surrogate SCN: "+e.getMessage(),e);
    		}
    		finally {
                DBUtil.quietClose(rs);
                DBUtil.quietClose(ps);
//				try {
//					if ( ps != null ) ps.clearParameters();
//				}
//				catch(SQLException e) {
//					throw new SystemException("Failed to clear statement parameters: "+e.getMessage(),e);
//				}
    		}
    	}
    	
    	return m_surrogateSCN;
    }

    /**
     * Gets the real SCN for a transaction, given the surrogate SCN.
     * Only works if transaction has been committed.
     * @param surrogateSCN
     * @return
     * @throws SystemException
     */
    protected String getRealSCN(String surrogateSCN) 
    	throws SystemException
	{
    	String realSCN = null;
    	Object oExistingRealSCN = m_surrogateSCNToRealSCN.get(surrogateSCN);
    	
    	if ( oExistingRealSCN == null ) {
    		PreparedStatement ps = null;
    		ResultSet rs = null;
    		
    		PreparedQuery pq = getStatement(FETCH_REAL_SCN); 
			ps = pq.getPreparedStatement(m_connection);

    		if( sqllog.isInfoEnabled() ){
        		DBUtil.logSql(sqllog, pq.getSQLString());  
            }
    		
    		try {
	    		ps.setString(1,surrogateSCN);
	    		
	    		if ( log.isDebugEnabled() ) {
	    			log.debug("Getting real SCN for "+surrogateSCN);
	    		}
	    		
	    		rs = ps.executeQuery();
	    		if ( rs != null ) {
	    			rs.next();
	    			Object oRealSCN = rs.getObject(1);
	    			realSCN = oRealSCN.toString();
	    			
	    			if ( log.isDebugEnabled() ) {
		    			log.debug("Returned real SCN value "+realSCN);
	    			}
	    			
	    			m_surrogateSCNToRealSCN.put(surrogateSCN, realSCN);
	    		}
    		}
    		catch(SQLException e) {
    			throw new SystemException("Failed to fetch real SCN for surrogate SCN '"+surrogateSCN+"': "+e.getMessage(),e);
    		}
    		finally {
    			DBUtil.quietClose(rs);
    			DBUtil.quietClose(ps);
//				try {
//					if ( ps != null ) ps.clearParameters();
//				}
//				catch(SQLException e) {
//					throw new SystemException("Failed to clear statement parameters: "+e.getMessage(),e);
//				}
    		}
    	}
    	else {
    		realSCN = (String)oExistingRealSCN;
    	}
    	
    	return realSCN;
    }
    
    /**
     * Utility class used to store info required to perform a single delete statement.
     * @author GrantM
     *
     */ 
    private class DeleteSpec {
    	private ContextVariables context;
    	private Query query;
    	private String tableAlias;
    	private Element dataElement; 
    	
    	/**
    	 * Constructor.
    	 * 
    	 * @param context
    	 * @param query
    	 * @param tableAlias
    	 * @param dataElement - used purely for SCN number. By the time the delete is exected
    	 * 		the context has been pre-loaded with any other data needed.
    	 */
    	public DeleteSpec(ContextVariables context, 
    			Query query, String tableAlias, Element dataElement) 
    	{
    		this.context = context;
    		this.query = query;
    		this.tableAlias = tableAlias;
    		this.dataElement = dataElement;
    	}
    	
    	public ContextVariables getContext() {
    		return this.context;
    	}
    	
    	public Query getQuery() {
    		return this.query;
    	}
    	
    	public String getTableAlias() {
    		return this.tableAlias;
    	}
    	
    	public Element getDataElement() {
    		return this.dataElement;
    	}
    	
    }
	
}