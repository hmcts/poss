package uk.gov.dca.db.pipeline;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.query.sql.SQLStatement;
import uk.gov.dca.db.pipeline.query.sql.StatementType;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import java.io.IOException;

/**
 * Inserts an XML construct into the database given a template describing the
 * XML-&gt;RDBMS mapping.
 * 
 * @author Howard Henson
 */
public class InsertService extends DBService {

    private static final Log log = LogFactory.getLog(InsertService.class);

    private String m_modifySource;
    private String m_surrogateSCN = null;
    private Map m_surrogateSCNToRealSCN = new TreeMap();
    
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
	    	
	    	// now output result. In case of update this will be same as input (minus 'params' tags). In case of
	    	// add it will have sequence numbers filled in.
	    	XMLOutputter outputter = new XMLOutputter();
	    	try {
	    		outputter.output(dataDoc, m_dataSink);
	    	}
	    	catch(IOException e) {
	    		throw new SystemException("Failed to output from '"+this.getName()+"': "+e.getMessage(),e); 
	    	}
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
                log.info("Processed query: [" + query.getPivotNode() + "]");
            }
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

						log.debug("Existence check pre-condition evaluated for table '"+alias+"': "+ bConditionValue);
						
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
	    			            	log.info("Variable: " + parameter + " value: [" + value + "]");
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
     * Performs a database existence check for the given query and table alias.
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
		log.info("Performing existance check: " + queryName);
		
		int onExistsAction = Query.ExistanceCheck.UPDATE;
		int onNotExistsAction = Query.ExistanceCheck.ADD;
		
		ResultSet rs = null;
		PreparedStatement ps = null;
		
		try {
			if(query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK) == null) {
				//perform existance check
				ps = getStatement(queryName);
				Iterator parameters = null;
				
				Query.ExistanceCheck existanceCheck = query.getExistanceCheck(tableAlias);
				if(existanceCheck == null) {
					throw new ConfigurationException("Assertion failure: No Existence check element or SQL statement specified for '" + query.getPivotNode()+"'"); 
				}
					
				onExistsAction = existanceCheck.getOnExistsAction();
				onNotExistsAction = existanceCheck.getOnNotExistsAction();
				parameters = existanceCheck.getUniqueCheckParamters();
				
				//TODO: Possibly here we could see if unique check parameters
				// are null before trying to execute query
				populatePreparedStatement(contextVariables, query, dataSrc, tableAlias, ps, parameters, false);
			}
			else {
				SQLStatement existenceCheckSQL = query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK);
				ps = existenceCheckSQL.prepare(m_connection, contextVariables, dataSrc, tableAlias);
			}
			
			try {
				rs = ps.executeQuery();
			}
			catch(SQLException e) {
				throw new SystemException("Failed to execute existence check '"+queryName+"': "+e.getMessage(),e);
			}
			
			boolean exists = false;
			try {
				exists = rs.next();
			}
			catch(SQLException e) {
				throw new SystemException("Failed to retrieve result of existence check '"+queryName+"': "+e.getMessage(),e);
			}
			log.info("[" + queryName + "] " + (exists ? "exists" : "does not exist"));
			
			if (exists)
				processExistanceAction(onExistsAction, query, contextVariables, tableAlias, dataSrc);
			else
				processExistanceAction(onNotExistsAction, query, contextVariables, tableAlias, dataSrc);
			
			try {
				rs.close();
			}
			catch(SQLException e) {
				throw new SystemException("Failed to close database connection: "+e.getMessage(),e);
			}
			rs = null;
    	}
    	finally	{
    		try {
	    		if ( rs != null ) rs.close();
	    		if(query.getModifySQLStatement(tableAlias, StatementType.EXISTENCE_CHECK) != null && ps != null) {
	    			ps.close();
	    		}
    		}
			catch(SQLException e) {
				throw new SystemException("Failed to clean up after querying: "+e.getMessage(),e);
			}
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
    private void processExistanceAction( int existanceCheckAction, Query query, ContextVariables contextVariables,
    		String alias, Element element)
    	throws BusinessException, SystemException
    {
    	switch (existanceCheckAction) {
			case Query.ExistanceCheck.FAIL:
				throw new ExistenceCheckException("Existence check failure condition satisfied: (" + alias + ") [" + query.getPivotNode() + "]");
			case Query.ExistanceCheck.ADD:
				processAdd(contextVariables, query, alias, element);
				// could be an old scn not used thus far if reuse XML fragments from other commit operations
				removeOldSCN(element, alias); 
				insertSurrogateSCN(element, alias);
				break;
			case Query.ExistanceCheck.UPDATE:
				processUpdate(contextVariables, query, alias, element);
				removeOldSCN(element, alias);
				insertSurrogateSCN(element, alias);
				break;
			case Query.ExistanceCheck.SKIP:
				break;
			case Query.ExistanceCheck.DELETE:
				processDelete(contextVariables, query, alias, element);
				break;
			default:
				throw new ConfigurationException("Unable to process existence check. Unknown action: "+existanceCheckAction);
		}
    }
    
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
     * Deletes a row from the database
     * @param contextVariables
     * @param query
     * @param alias
     * @param element
     * @throws BusinessException
     * @throws SystemException
     */
    private void processDelete(ContextVariables contextVariables, Query query, String alias, Element element) 
    	throws BusinessException, SystemException
	{
        Table table = query.getTableFor(alias);

        Iterator parameters = null;
        boolean useOptimisticLock = false;
        PreparedStatement ps = null;
        SQLStatement deleteSQL = null;
        
        try {
	        deleteSQL = query.getModifySQLStatement(alias, StatementType.DELETE);
	        if(deleteSQL != null) {
	       		ps = deleteSQL.prepare(m_connection, contextVariables, element, alias);
	        }
	        else {
	        	Query.ExistanceCheck existanceCheck = query.getExistanceCheck(alias);
	        	StringBuffer buffer = new StringBuffer("DELETE FROM ");
	        	buffer.append(table);
	        	buffer.append(" WHERE ");
	        	buffer.append(existanceCheck.getUniqueQueryClause());
	        	
	        	if(existanceCheck.useOptimisticLock()) {
	        		buffer.append(" AND ORA_ROWSCN = ?");
	        	}
	        	
	        	String deleteString = buffer.toString();
	        	parameters = existanceCheck.getUniqueCheckParamters();
	        	useOptimisticLock = existanceCheck.useOptimisticLock();
	
	        	log.info(deleteString);
	        	try {
	        		ps = m_connection.prepareStatement(deleteString);
        		}
        		catch(SQLException e){
        			throw new SystemException("Failed to prepare delete for database table '"+table.getName()+"': "+e.getMessage(),e);
        		}
	
	        	populatePreparedStatement(contextVariables, query, element, alias, ps, parameters, useOptimisticLock);
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
        	if(deleteSQL != null && ps != null) {
        		try {
        			ps.close();
        		}
        		catch(SQLException e){
        			throw new SystemException("Failed to close database connection: "+e.getMessage(),e);
        		}
        	}
        }
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
            Iterator parameters, boolean bUseSCN)
    	throws SystemException, BusinessException
	{
        int count = 1;
        while (parameters.hasNext()) {
            String parameter = (String) parameters.next();
            Object value = query.getParameterValue(contextVariables, alias, element, parameter);
            log.info("Variable: " + parameter + " value: [" + value + "]");
            
            try {
	            if (value == null)
	                ps.setString(count++, null);
	            else
	                ps.setObject(count++, value);
            }
            catch(SQLException e) {
               	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
            }
        }
        
        // if updating then make sure the SCN is populated
        if ( bUseSCN == true) {
        	String sSCN = null;
        	
        	log.debug("Getting SCN value for " + element.getName() + ":" + alias);
        	String sXPath = "./SCN[@table='" + alias + "']";
        	Element scnElement = null;
        	try {
        		scnElement = (Element)XPath.selectSingleNode( element, sXPath);
        	}
        	catch(JDOMException e) {
        		throw new SystemException("Failed to evaluate '"+sXPath+"' for element '"+element.getName()+"': "+e.getMessage(),e);
        	}
        	
        	if ( scnElement != null ) {
        		log.debug("Got SCN value for " + element.getName() + ":" + alias);
        		sSCN = scnElement.getText();
        	}
        	else {
        		log.debug("Getting SurrogateSCN value for " + element.getName() + ":" + alias);
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
        		log.debug("Table '"+alias+"' SCN=" + sSCN );
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
	    		ps = updateSQL.prepare(m_connection, contextVariables, element, alias);
	    	}
	    	else {
	    		parameters = prepareModifyParameters(query, alias, true).iterator();
	    		useOptimisticLock = query.getExistanceCheck(alias).useOptimisticLock();
	    		ps = getStatement(query.getPivotNode() + "_" + alias + "_update");

	    		populatePreparedStatement(contextVariables, query, element, alias, ps, parameters, useOptimisticLock);
	    	}
	    	
	    	log.debug("Executing update: " + query.getPivotNode() + "_" + alias + "_update");
	        
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
    		if(updateSQL != null && ps != null) {
    			try {
        			ps.close();
        		}
        		catch(SQLException e){
        			throw new SystemException("Failed to close database connection: "+e.getMessage(),e);
        		}
    		}
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
		List sequenceList = new LinkedList();
    	
		try {
	    	if(query.getModifySQLStatement(alias, StatementType.INSERT) == null) {
	    		pList = prepareModifyParameters(query, alias, false);
		        Iterator parameters = pList.iterator();
		        sequenceList = new LinkedList();
		        while (parameters.hasNext()) {
		            String param = (String) parameters.next();
		            if (query.hasSequenceFor(param)) {
		                sequenceList.add(param);
		                parameters.remove();
		            }
		        }
		        parameters = pList.iterator();
	    	
				// there may be sequences needed which are not associated with any table directly
				// i.e. from a 'property' element. Check these have been evaluated for the Query.
				// Only done upon an 'add'.
				List unboundProperties = query.getUnboundProperties();
	            Iterator it = unboundProperties.iterator();
	            while ( it.hasNext() ) {
	             	String property = (String)it.next();
	             	if ( query.hasSequenceFor(property) ) {
	             		Object objVal = contextVariables.getValue(property);
	             		if ( objVal != null && objVal.toString().length() == 0) {
	             			String sequenceName = query.getPivotNode() + "_sequenceVal_${" + property.toUpperCase() + "}";
	             			ps = getStatement(sequenceName);
	             			try {
	             				rs = ps.executeQuery();
	             			}
	             			catch(SQLException e) {
	             				throw new SystemException("Failed to query for value of sequence '"+sequenceName+"': "+e.getMessage(),e);
	             			}
	             			Object nextval = null;
	             			try {
	             				rs.next();
	             				nextval = rs.getObject(1);
	             			}
	             			catch(SQLException e) {
	             				throw new SystemException("Failed to retrieve value of sequence '"+sequenceName+"': "+e.getMessage(),e);
	             			}
	             			
	    	                query.addContextParameter(contextVariables, property, nextval);
	    	                log.info("Sequence number for [" + property + "] is (" + nextval + ")");
	    	                try {
	    	                	rs.close();
	    	                }
	             			catch(SQLException e) {
	             				throw new SystemException("Failed to close database connection: "+e.getMessage(),e);
	             			}
	    	                rs = null;
	             		}
	             	}
	            }
				// now do the add
	        	ps = getStatement(query.getPivotNode() + "_" + alias + "_add");
	
		        populatePreparedStatement(contextVariables, query, element, alias, ps, parameters, false);
			}
			else {
				SQLStatement existenceCheckSQL = query.getModifySQLStatement(alias, StatementType.INSERT);
				ps = existenceCheckSQL.prepare(m_connection, contextVariables, element, alias);
			}

	     	log.debug("Executing add: " + query.getPivotNode() + "_" + alias + "_add");
	     	
		    try {
		        ps.execute();
		    } 
		    catch (SQLException e) {
		        throw new SystemException("Failed to execute query '"+query.getPivotNode() + "_" + alias + "_add': "+e.getMessage(),e);
		    }
		    
		    if(query.getModifySQLStatement(alias, StatementType.INSERT) == null) {    
		        //check for any sequence hits
		        Iterator i = sequenceList.iterator();
		        while (i.hasNext()) {
		            String parameter = (String) i.next();
		            if (query.hasSequenceFor(parameter)) {
		            	String sequenceName = query.getPivotNode() + "_" + alias + "_sequenceVal_${" + parameter + "}";
             			ps = getStatement(sequenceName);
		                try {
		                	rs = ps.executeQuery();
		            	}
         				catch(SQLException e) {
         					throw new SystemException("Failed to query for value of sequence '"+sequenceName+"': "+e.getMessage(),e);
         				}
         				Object property = null;
         				try {
         					rs.next();
         					property = rs.getObject(1);
         				}
             			catch(SQLException e) {
             				throw new SystemException("Failed to retrieve value of sequence '"+sequenceName+"': "+e.getMessage(),e);
             			}
		                setProperty(contextVariables, query, parameter, element, property);
		                log.info("Sequence number for [" + parameter + "] is (" + property + ")");
		                try {
    	                	rs.close();
    	                }
             			catch(SQLException e) {
             				throw new SystemException("Failed to close database connection: "+e.getMessage(),e);
             			}
		                rs = null; 
		            }
		        }
		    }
		    // statement may be reused (since pivot nodes may be repeated), 
		    // so do not close it until all querying is finished:
		    try {
		    	ps.clearParameters();
		    }
		    catch(SQLException e) {
		    	throw new SystemException("Failed to clear query parameters: "+e.getMessage(), e);
		    }
		    ps = null;
		}
		finally {
    		try {
	    		if ( rs != null ) rs.close();
	    		if(query.getModifySQLStatement(alias, StatementType.INSERT) != null && ps != null) {
	    			ps.close();
	    		}
				else if (ps != null) ps.clearParameters();
    		}
			catch(SQLException e) {
				throw new SystemException("Failed to clean up after querying: "+e.getMessage(),e);
			}
		}
        log.info("Add for table: " + alias + " complete");
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
	                        	int onExistsAction = existanceCheck.getOnExistsAction();
	                        	int onNotExistsAction = existanceCheck.getOnNotExistsAction();
	                        	
	                        	if (onExistsAction == Query.ExistanceCheck.UPDATE) {
			                    	prepareUpdate(query, table, buff);
	                        	}
	                        	if (onNotExistsAction == Query.ExistanceCheck.ADD) {
	                        		prepareInsert(query, table, buff);
	                        	}
	                        	
			                    // there may also be 'property' elements defined for this query which invoke sequences.
			                    // therefore create any queries needed by those
			                    List unboundProperties = query.getUnboundProperties();
			                    Iterator it = unboundProperties.iterator();
			                    while ( it.hasNext() ) {
			                    	String property = (String)it.next();
			                    	if ( query.hasSequenceFor(property) ) {
			                    		String sequenceSelect = "SELECT " + query.getSequenceFor(property) + ".NEXTVAL FROM DUAL";
			                    		String queryName =query.getPivotNode() + "_sequenceVal_${" + property.toUpperCase() + "}";
			                    		
			                    		try {
			                    			addStatement(queryName, m_connection.prepareStatement(sequenceSelect));
			                    		}
			                            catch(SQLException e) {
			                            	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
			                            }
			                    		log.info("Query [" + query.getPivotNode() + "] : " + sequenceSelect);
			                    	}
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
        
        log.info("Query [" + query.getPivotNode() + "] : " + buff.toString());
        
        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_chk";
        try {
        	addStatement(queryName,	m_connection.prepareStatement(buff.toString()));
		}
        catch(SQLException e) {
        	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
        }
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
	        String parameter = (String) parameters.next();
	        //TODO: check for sequence parameters as they need special
	        // handling
	        if (query.hasSequenceFor(table.getAlias() + "." + parameter)) {
	            buff.append(query.getSequenceFor(table.getAlias() + "."
	                    + parameter));
	            buff.append(".NEXTVAL");
	            String sequenceSelect = "SELECT " + query.getSequenceFor(table.getAlias() + "."
	                + parameter) + ".CURRVAL FROM DUAL";
	            
	            String queryName = query.getPivotNode() + "_" + table.getAlias()
                	+ "_sequenceVal_${" + table.getAlias().toUpperCase()
					+ "." + parameter.toUpperCase() + "}";
	            
	            try {
	            	addStatement(queryName, m_connection.prepareStatement(sequenceSelect));
	            }
	            catch(SQLException e) {
	            	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
	            }
	            
	            log.info("Query [" + query.getPivotNode() + "] : " + sequenceSelect);
	        } else {
	            buff.append("?");
	        }
	        if (parameters.hasNext()) {
	            buff.append(", ");
	        }
	    }
	    buff.append(" )");
	    log.info("Query [" + query.getPivotNode() + "] : " + buff.toString());
        
        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_add";
        try {
        	addStatement(queryName, m_connection.prepareStatement(buff.toString()));
        }
        catch(SQLException e) {
        	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
        }
        
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
        log.info("Query [" + query.getPivotNode() + "] : " + buff.toString());
        
        String queryName = query.getPivotNode() + "_" + table.getAlias() + "_update";
        try {
        	addStatement(queryName, m_connection.prepareStatement(buff.toString()));
        }
        catch(SQLException e) {
        	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
        }
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
        try {
        	String query = "SELECT SCN_INDEX_SEQUENCE.NEXTVAL FROM DUAL";   
        	queryName = "create_surrogate_scn";
	        addStatement(queryName, m_connection.prepareStatement(query));
	        
	        // query for assigning a real SCN to the surrogate SCN
	        query = "INSERT INTO TRANSACTION_LIST (TRANSACTION_ID) VALUES (?)";  
        	queryName = "create_real_scn";
	        addStatement(queryName, m_connection.prepareStatement(query));
	
	        // query for getting real SCN from surrogate SCN
	        query = "SELECT ORA_ROWSCN FROM TRANSACTION_LIST WHERE TRANSACTION_ID=?";  
        	queryName = "fetch_real_scn";
	        addStatement(queryName, m_connection.prepareStatement(query));
        }
        catch(SQLException e){
        	throw new SystemException("Failed to prepare query '"+queryName+"': "+e.getMessage(),e);
        }
    }
    
    /**
     * Gets the surrogate SCN for this transaction.
     * @return
     */
    protected String getSurrogateSCN() 
    	throws SystemException
	{
    	log.debug("getting surrogate. Current="+m_surrogateSCN);
    	if ( m_surrogateSCN == null ) {
    		PreparedStatement ps = getStatement("create_surrogate_scn");
    		try {
    			ResultSet rs = ps.executeQuery();
 
	    		if ( rs != null ) {
	    			rs.next();
	    			Object oNextval = rs.getObject(1);
	    			String sNextval = oNextval.toString();
	    			
	    			m_surrogateSCN = sNextval;
	    			log.debug("got surrogate. New="+m_surrogateSCN);
	    	    		
	    			// now create new db entry which will provide us with the SCN.
	    			// Note: do not get SCN now because SCN it is only generated on commit.
	    			ps = getStatement("create_real_scn");
	    			ps.setString(1,m_surrogateSCN);
	        		rs = ps.executeQuery();
	    		}
    		}
    		catch(SQLException e) {
    			throw new SystemException("Failed to query for value of surrogate SCN: "+e.getMessage(),e);
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
    		try {
	    		PreparedStatement ps = getStatement("fetch_real_scn");
	    		ps.setString(1,surrogateSCN);
	    		log.debug("Getting real SCN for "+surrogateSCN);
	    		ResultSet rs = ps.executeQuery();
	    		if ( rs != null ) {
	    			rs.next();
	    			Object oRealSCN = rs.getObject(1);
	    			realSCN = oRealSCN.toString();
	    			log.debug("Returned real SCN value "+realSCN);
	    			
	    			m_surrogateSCNToRealSCN.put(surrogateSCN, realSCN);
	    		}
    		}
    		catch(SQLException e) {
    			throw new SystemException("Failed to fetch real SCN for surrogate SCN '"+surrogateSCN+"': "+e.getMessage(),e);
    		}
    	}
    	else {
    		realSCN = (String)oExistingRealSCN;
    	}
    	
    	return realSCN;
    }
}