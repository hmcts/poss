package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.Writer;
import java.io.StringWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Text;
import org.jdom.filter.ContentFilter;
import org.jdom.filter.Filter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.query.sql.SQLStatement;
import uk.gov.dca.db.pipeline.query.sql.SQLStatementFactory;
import uk.gov.dca.db.pipeline.query.sql.StatementType;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.XMLUtil;


/**
 * Provides the ability to perform 'SELECT' queries.
 * 
 * @author Howard Henson
 */
public class SelectService extends DBService {

    private static final Log log = SUPSLogFactory.getLogger(SelectService.class);

    private static final Filter s_elementFilter = new ContentFilter(ContentFilter.ELEMENT);
    private static final Filter s_textFilter = new ContentFilter(ContentFilter.TEXT);
    private boolean m_outputFirstElement = true;
    
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadMap) 
		throws SystemException
	{
    	super.validate(methodId,handler,processingInstructions,preloadMap);
	}
    /**
     * @throws BusinessException
     * @throws SystemException
     * @see uk.gov.dca.db.impl.DBService#loadTemplate(org.jdom.Document)
     */
    public void prepare(Element config, Map preloadCache) throws SystemException 
	{
    	super.prepare(config, preloadCache);
        
        Iterator tables = null;
        
    	try {
    		// select the table elements if any have been specified
    		tables = XPath.selectNodes(config, "./Table").iterator();
    	}
    	catch(JDOMException e) {
    		log.debug("prepare(Element, Map): no Table element found", e);
    		throw new SystemException("Failed to evaluate './Table' for pipeline component '"+this.getName()+"': "+e.getMessage(),e);
    		// ...gulp!
    	}
    	
    	if(tables != null) {
		    while(tables.hasNext()) {
		       	// add each table specified to the query definitions
		       	Element table = (Element) tables.next();
		      	m_queryDefinitions.addTable(table);
		    }
    	}
    	
    	Iterator queryExtensions = null;
        try {
        	queryExtensions = XPath.selectNodes(config, "./QueryExtension").iterator();
        }
        catch ( JDOMException e ) {
        	throw new SystemException("QueryExtension not specified for '"+this.getName()+"': "+e.getMessage(),e); 
        }
        
        while (queryExtensions.hasNext()) {
            Element queryExtensionElement = (Element) queryExtensions.next();
            String pivotNode = queryExtensionElement.getAttributeValue("pivotNode");
            Query query = (Query) m_queryDefinitions.m_queries.get(pivotNode);
            if ( query == null ) {
            	throw new ConfigurationException("Could not find query for pivot node: "+pivotNode);
            }
            
            SQLStatement sqlStatement = query.getSelectStatement();
            if(sqlStatement == null) {
	            String queryTables = queryExtensionElement.getAttributeValue("tables");
	            if(queryTables != null) {
	            	query.addTables(queryTables);
	            }
            }
                        
            Iterator parms = queryExtensionElement.getChildren("Param").iterator();
            while(parms.hasNext()){
                Element paramElement = (Element)parms.next();
                String pName = paramElement.getAttributeValue("name");
                String pXPath = paramElement.getAttributeValue("xpath");
                query.addParameter(pName);
                addProperty(pName, pXPath);
            }
            
            if(sqlStatement == null) {
            	query.setSelectDistinct(queryExtensionElement);
            	
	            // add join over ride if specified
	            Element eJoin = queryExtensionElement.getChild("Join");
	            if (eJoin != null) {
	            	query.setJoinString(eJoin.getValue());
	            }
	            
	            // add 'order by' over ride if specified
	            Element eOrderBy = queryExtensionElement.getChild("OrderBy");
	            if (eOrderBy != null) {
	            	query.setOrderByClause(eOrderBy.getValue());
	            }
	            
	            //	Make this handle multiple constraint parameters.
	            List constraints = queryExtensionElement.getChildren("Constraint");
	            Iterator itConstraints = constraints.iterator();
	            while ( itConstraints.hasNext() ) {
	            	query.addConstraint( (Element)itConstraints.next() );
	            }
	            
	            query.setPageController(queryExtensionElement.getChild("Paged"));
            }
            
            Element sql = queryExtensionElement.getChild(Query.SQL_ELEMENT_NAME);
            if(sql != null) {            
	            String statementTypeName = sql.getAttributeValue("type");
	        	StatementType statementType = StatementType.getInstance(statementTypeName);
	        	
	        	if(statementTypeName != null && !statementType.equals(StatementType.SELECT)) {
	        		throw new ConfigurationException("Assertion failure whilst processing query extension: [" + query.getPivotNode() 
	        				+ "].  Only 'select' SQL statments may be specified at this level within a query element");
	        	}
	        	
	        	SQLStatementFactory factory = new SQLStatementFactory();
	        	query.setSelectStatement(factory.createSQLStatement(sql, query));
	        }
            
        }
 
        m_queryDefinitions.satisfyDependentQueryProperties();
    }

    /**
     * Ensures all query statements are prepared for use. This ultimately would
     * work with caches of prepared statements. For simplicity's sake we will
     * prepare the statements here on demand.
     * 
     * @throws SystemException
     * @throws BusinessException
     */
    protected void prepareQueries() throws SystemException, BusinessException {
        resetStatements();
        Iterator queries = m_queryDefinitions.getQueries();
        StringBuffer buff = new StringBuffer(256);
        String sqlStatement = null;
        
        while (queries.hasNext()) {

            Query query = (Query) queries.next();
            
			SQLStatement selectStatement = query.getSelectStatement();
			if(selectStatement == null) {
				// we cannot prepare a dynamic query in advance because it is created at runtime
				if ( query.hasDynamicSelect() == false) {
					prepareQuery( query, buff, null, null, null ); 
					
					addStatement(query.getPivotNode(), buff.toString());
				}
			}
        }
    }

    /**
     * Creates a query string in the provided buffer.
     * The last 2 parameters are optional and are only needed when creating a query which uses
     * conditional constraints.
     * @param query
     * @param buff
     * @param inputParameters
     * @param activeConstraints
     * @throws SystemException
     * @throws BusinessException
     */
    protected void prepareQuery(Query query, StringBuffer buff, Document inputParameters, List activeConstraints, IQueryContextReader context) 
    	throws SystemException, BusinessException
    {
    	Query.PageController pageController = query.getPageController();
    	String orderByString = query.getOrderByClause();
    	
    	/* Reset the buffer */
        buff.setLength(0);
        
        /* Begin SQL Select statement */
        if ( pageController != null ){
        	// if doing paged resultsets then form a special query:
        	
        	buff.append("SELECT ");
        	/* Adds the selection parameters to the Select statement here in order
        	 * to avoid returning the row number column - which would mess up 
        	 * 'select distinct' because row number will make every row distinct */
        	Iterator parameters = query.getSelectParameters();
            
        	String parameter = null;
        	int dotIndex = -1;
        	
            while (parameters.hasNext()) {
                parameter = (String) parameters.next();
                dotIndex = parameter.indexOf(".");
                
                if (dotIndex >= 0) {
                	buff.append( parameter.substring( dotIndex+1 ) );

                    if (parameters.hasNext()) {
                        buff.append(", ");
                    }
                }
            }
            
            Iterator tables = null;
            if ( query.isModifiable() == true ) {
            	if ( query.getSelectParameters().hasNext() == true ) {
            		buff.append(", ");
            	}
            	tables = query.getSelectTables();
    	        while (tables.hasNext()) {
    	        	Table table = (Table) tables.next();
    	            buff.append(table.getAlias() + "_ORA_ROWSCN");
    	            if (tables.hasNext()) {
    	                buff.append(", ");
    	            }
    	        }
            }
            
            buff.append(" FROM (");
        }
        
        buff.append("SELECT ");
        
        if ( query.isSelectDistinct() ) {
        	buff.append("DISTINCT ");
        }
        
        if ( pageController != null ){
        	String orderByFields = "rownum";
        	if ( orderByString != null && orderByString.length() > 0 ){
        		orderByFields = orderByString.toUpperCase(); 
            }
        	
        	buff.append("ROW_NUMBER() OVER (ORDER BY "+orderByFields+") AS R, ");
        }
        
        Iterator parameters = query.getSelectParameters();
        
        /* Adds the selection parameters to the Select statement here */
        while (parameters.hasNext()) {
            String parameter = (String) parameters.next();
            buff.append(parameter);

            if (parameters.hasNext()) {
                buff.append(", ");
            }
        }
        
        // adds the SCNs to select here (SCN = transaction id for most recent row update)
        // 1 SCN per table selected from. If the data is read only (i.e. not modifiable)
        // then SCNs are not selected.
        Iterator tables = null;
        if ( query.isModifiable() == true ) {
        	if ( query.getSelectParameters().hasNext() == true ) {
        		buff.append(", ");
        	}
        	tables = query.getSelectTables();
	        while (tables.hasNext()) {
	        	Table table = (Table) tables.next();
	            buff.append(table.getAlias() + ".ORA_ROWSCN AS " + table.getAlias() + "_ORA_ROWSCN");
	            if (tables.hasNext()) {
	                buff.append(", ");
	            }
	        }
        }

        buff.append(" ");
        
        // do the 'from' clause
        tables = query.getSelectTables();
        buff.append("FROM ");
        while (tables.hasNext()) {
            Table table = (Table) tables.next();
            buff.append(table.toString());
            if (tables.hasNext()) {
                buff.append(", ");
            } else {
                buff.append(" ");
            }
        }
        
        // add the where clause
        String whereClause = null;
        
        whereClause = query.getWhereClause(inputParameters, context, activeConstraints); 
        
        if ( whereClause != null && "".compareTo(whereClause) != 0 ) 
		{
			buff.append("WHERE ");
    		buff.append(whereClause);
		}

        /*
         * add order by 
         */
        if ( pageController == null && orderByString != null && orderByString.length() > 0 ){
        	buff.append(" ORDER BY ");
        	buff.append(orderByString.toUpperCase()); 
        }
        
        if ( pageController != null ){
        	buff.append(") WHERE R>? AND R<?");
        }
        if(log.isDebugEnabled()){
            log.debug("Query [" + query.getPivotNode() + "] : " + buff.toString());
        }

    }
    
    
    /*
     * (non-Javadoc)
     * 
     * @see uk.gov.dca.db.impl.DBService#processTemplate()
     */
    protected void processTemplate(Document parameters) throws BusinessException, SystemException 
	{
        log.warn("***** This service in now deprecated.  Please use: " + uk.gov.dca.db.pipeline.mapping.SelectService.class.getName() + " *****");
        Writer out = new StringWriter();
        
        //There should only be one root node within Mapping, so we
        //can safely use the * to get the element we are looking for
        Element element = null;
        try {
        	element = (Element) XPath.selectSingleNode(
                m_queryDefinitions.m_templateElement, "DBMapDef/Mapping/*");
        }
        catch(JDOMException e) {
        	throw new SystemException("Failed to evaluate 'DBMapDef/Mapping/*': "+e.getMessage(),e);
        }
        
        ContextVariables contextVariables = new ContextVariables();
        Iterator i = getProperties();
        while(i.hasNext()){
            String propertyName = (String) i.next();
            String xpath = getXPathForProperty(propertyName);
            Object result = null;
            try {
            	result = XPath.selectSingleNode(parameters, xpath);
            }
            catch(JDOMException e) {
            	throw new SystemException("Unable to evaluate '"+ xpath +"' for '"+this.getName()+"' parameters:"+e.getMessage(),e);
            }
            String value = null;
            //TODO: Handle multiple data types?
            if(result instanceof Attribute){
                value = ((Attribute)result).getValue();
            } else if (result instanceof Element){
                value = ((Element)result).getTextNormalize();
            }
            contextVariables.addVariable(propertyName, value);
        }
             
        processNode(contextVariables, 0, "/" + element.getName(), element, out);	
        
        //set the output
    	this.m_outputData.setData(out, Writer.class);
    }

    private void processNode(ContextVariables contextVariables, int level, String currentPath, 
    		Element element, Writer out) 
    	throws SystemException, BusinessException
	{
        /*
         * For simplicity sake we assume the xpath statements do not include any
         * information other than / seperated node names. It should be possible
         * to add [] references as well, however that would require a little
         * more work to make efficient.
         */
    	log.debug("processNode(): Entry");
    	ResultSet rs = null;
    	Query query = (Query) m_queryDefinitions.m_queries.get(currentPath);
    	log.debug("processNode(): " + currentPath + " query retrieved " + query);
        SQLStatement sqlStatement = null;
        PreparedStatement ps = null;
        
        boolean bIsDynamic = false;
        
        if(query != null) {
        	sqlStatement = query.getSelectStatement();
        }
        
    	try {
    		if (m_queryDefinitions.m_queries.containsKey(currentPath) || sqlStatement != null) {
    			if(sqlStatement != null) {
    				bIsDynamic = true;
    				ps = sqlStatement.prepare(m_connection, contextVariables, m_parameters.getRootElement(), null);
    			}
    			else {
    				int c = 1;
    				
	    			if ( query.hasDynamicSelect() ) {
	    				bIsDynamic = true;
	    				
	    				log.debug("processNode(): query " + currentPath + "has a dynamic select");
	    				// create the conditional query and populate it's parameters
	    		        StringBuffer buff = new StringBuffer(256);
	    		        List activeConstraints = new LinkedList();
	    		        log.debug("processNode(): preparing query");
	    				prepareQuery( query, buff, m_parameters, activeConstraints, contextVariables );
	    				log.debug("processNode(): preparing statement");
	    				
	    				try {
	    					ps = m_connection.prepareStatement(buff.toString());
	    				}
	    				catch(SQLException e){
	    					throw new SystemException("Failed to prepare statement: "+e.getMessage(),e);
	    				}
	    				
    					//add dependent variables from join
	    	            Iterator dependents = query.getJoinOrderDependentProperties();
	    	            
	    	            while (dependents.hasNext()) {
	    	                String var = (String) dependents.next();
	    	                log.debug("processNode(): dependent - " + var);
	    	                Object value = contextVariables.getValue(var);
	    	                log.debug("processNode(): " + var + " = " + value);
	    	                
	    	                try {
	    	                	if (value == null)
	    	                		ps.setString(c++, null);
	    	                	else
	    	                		ps.setObject(c++, value);
	    	                }
	    	                catch(SQLException e) {
	    	                	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
	    	                }
	    	            }
	    	            //add dependent variables from constraints
	    	            dependents = activeConstraints.iterator();
		            	while (dependents.hasNext()) {
		            		Query.Constraint constraint = (Query.Constraint)dependents.next();
		            		Iterator itParams = constraint.getParameters().iterator();
	    	                while(itParams.hasNext()) {
			            		String var = (String)itParams.next();
		    	                Object value = contextVariables.getValue(var);
		    	                
		    	                try {
		    	                	if (value == null)
		    	                		ps.setString(c++, null);
		    	                	else
		    	                		ps.setObject(c++, value);
		    	                }
		    	                catch(SQLException e) {
		    	                	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
		    	                }
	    	                }
	    	            }
	    			}
	    			else {
	    				log.debug("processNode(): getting statment");
	    				PreparedQuery pq = getStatement(currentPath);
	    				ps = pq.getPreparedStatement(m_connection);
	    				
	    				log.debug("processNode(): getting dependant properties");
	    				
	    				//add dependent variables
	    	            Iterator dependents = query.getWhereOrderDependentProperties();
	    	           
	    	            while (dependents.hasNext()) {
	    	                String var = (String) dependents.next();
	    	                log.debug("processNode(): dependant - " + var);
	    	                Object value = contextVariables.getValue(var);
	    	                log.debug("processNode(): " + var + " = " + value);
	    	                
	    	                try {
	    	                	if (value == null)
	    	                		ps.setString(c++, null);
	    	                	else
	    	                		ps.setObject(c++, value);
	    	                }
	    	                catch(SQLException e) {
	    	                	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
	    	                }
	    	            }
	    			}
	    			
	    			// if a paged query then add in page parameters
	    			Query.PageController pageController = query.getPageController();
	    	    	if ( pageController != null ) {
	    	    		int pageNum = 0;
	    	    		int pageSize = 0;
	    	    		
	    	    		if ( pageController.hasPageNumberParameter() ) {
	    	    			String variableValue = (String)contextVariables.getValue(pageController.getPageNumberParameter());
	    	    			pageNum = Integer.parseInt(variableValue);
	    	    		}
	    	    		else
	    	    			pageNum = pageController.getPageNumber();
	    	    			
	    	    		if ( pageController.hasSizeParameter()) {
	    	    			String variableValue = (String)contextVariables.getValue(pageController.getPageSizeParameter());
	    	    			pageSize = Integer.parseInt(variableValue);
	    	    		}
	    	    		else
	    	    			pageSize = pageController.getPageSize();
	    	    		
	    	        	int firstRow = (pageNum-1) * pageSize;
	    	        	int secondRow = pageNum * pageSize +1;
	    	        	
	    	        	try { 
	    	        		ps.setInt(c++, firstRow);
	    	        		ps.setInt(c++, secondRow);
	    	        	}
    	                catch(SQLException e) {
    	                	throw new SystemException("Failed to set parameter value on query: "+e.getMessage(),e);
    	                }
	    	    	}
    			}
    			log.debug("processNode(): executing query");
    			try {
    				rs = ps.executeQuery();
    			}
    			catch(SQLException e) {
                	throw new SystemException("Failed to execute query: "+e.getMessage(),e);
                }
	            log.debug("processNode(): examining result set");
	           
	            try {
		            while (rs.next()) {   	   	
		                //extract variables
		            	log.debug("processNode(): creating context variables");
		                ContextVariables newContextVariables = new ContextVariables(contextVariables, rs, query);
		                log.debug("processNode(): writing element");
		                writeElement(newContextVariables, level, currentPath, element, rs, query, out);
		            }
	            }
	            catch(SQLException e) {
	            	throw new SystemException("Failed to retrieve rowset: "+e.getMessage(),e);
	            }
	        } 
    		else {
	            log.debug("processNode(): No query found for pivotnode " + currentPath);
	            writeElement(contextVariables, level, currentPath, element, rs, query,out);
	        }
    	}
    	finally {
            DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
//    		try {
//    			if ( rs != null ) rs.close();
//    			
//    			// Note: only close the statement here if using a dynamic query. Otherwise
//    			// the cached prepared statement is kept for reuse - if it is closed
//    			// here an exception is thrown the next time it is used!
//    			if( bIsDynamic && ps != null) {
//    				ps.close();
//    			}
//    		
//    			/* USEFUL FOR DEBUGGING OPEN CONNECTIONS
//    			Statement s = m_connection.createStatement();
//    			if ( s != null ) {
//    				ResultSet rsOpenCursors = s.executeQuery("select a.value as \"CURSORS\", b.name from v$mystat a, v$statname b where a.statistic# = b.statistic# and a.statistic# = 3");
//	    			
//	    			if ( rsOpenCursors != null ) {
//	    				rsOpenCursors.next();
//	    				int numOpenCursors = rsOpenCursors.getInt("CURSORS");
//	    				log.debug("OPEN CURSORS AT LEVEL "+level+"="+numOpenCursors);
//	    				rsOpenCursors.close();
//	    			}
//	    			
//	    			s.close();
//    			}
//    			*/
//    		}
//    		catch(SQLException e) {
//    			throw new SystemException("Failed to clean up after querying: "+e.getMessage(),e);
//    		}
    	}
    }

    private void writeElement(ContextVariables contextVariables, int level,
            String currentPath, Element element, ResultSet rs, Query query,
			Writer out) 
    	throws SystemException, BusinessException
	{
    	try {
    		if (m_outputFirstElement==true) {
    			out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
    			m_outputFirstElement=false;
    		}
	        writeIndent(level, out);
	        out.write("<");
	        out.write(element.getName());
	        Iterator attributes = element.getAttributes().iterator();
	        while (attributes.hasNext()) {
	            Attribute attribute = (Attribute) attributes.next();
	            out.write(" ");
	            out.write(attribute.getName());
	            out.write("=\"");
	            writeParameters(contextVariables, query, attribute.getValue(), true, out);
	            out.write("\"");
	        }
	        out.write(">");
	
	        // output scn numbers but only if we are processing a pivot node and it is modfiable
	        if ( query != null && query.isModifiable() == true ) {
		    	Iterator it = query.getSelectTables();
		    	while( it.hasNext() ) {
		    		Table table = (Table)it.next();
		    		Object oSCN = null;
		    		try {
		    			oSCN = rs.getObject(table.getAlias() + "_ORA_ROWSCN");
		    		}
		    		catch(SQLException e) {
		    			throw new SystemException("Failed to retrieve '"+table.getAlias() + "_ORA_ROWSCN"+"': "+e.getMessage(),e);
		    		}
		    		// we allow null SCNs (i.e. don't throw an exception) because it may be a valid result if 
		    		// doing an outer join - however, don't output the SCN tag in this case
		    		if ( oSCN != null ) {
		    			String sSCN = oSCN.toString();
	
		    			out.write("\r\n");
						writeIndent(level+1, out);
						out.write("<SCN table=\"" + table.getAlias() + "\">" + sSCN + "</SCN>");
		    		}			
		    	} 
	        }
	        
	        //Write content
	        boolean hasElements = false;
	        List list = element.getContent(s_elementFilter);
	        if (!list.isEmpty()) {
	            hasElements = true;
	        }
	        if (hasElements) {
	        	out.write("\r\n");
	            Iterator i = list.iterator();
	            while (i.hasNext()) {
	                Element newElement = (Element) i.next();
	                processNode(contextVariables, level + 1, currentPath + "/" + newElement.getName(), newElement,out);
	            }
	        } else {
	            Iterator text = element.getContent(s_textFilter).iterator();
	            while (text.hasNext()) {
	                writeParameters(contextVariables, query, ((Text) text.next()).getText(), false, out);
	            }
	        }
	        if (hasElements) {
	            writeIndent(level,out);
	        }
	        out.write("</");
	        out.write(element.getName());
	        out.write(">\r\n");
	    }
        catch(IOException e) {
        	throw new SystemException("Failed to write to pipeline component output: "+e.getMessage(),e);
        }
    }

    private void writeParameters(ContextVariables contextVariables, Query query, String text, boolean isAttribute, Writer out)
    	throws SystemException
	{
        Matcher vars = Query.s_variablePattern.matcher(text);
        int lastEnd = 0;
        try {
	        while (vars.find()) {
	            if (lastEnd != vars.start()) {
	                out.write(text.substring(lastEnd, vars.start()));
	            }
	            lastEnd = vars.end() + 1;
	            String variable = vars.group(1).toUpperCase();
	            Object result = contextVariables.getValue(variable);
	            String sResult = "";
	            if ( result != null) {
	            	// encode text for XML (escape & < and > characters)
	            	sResult = XMLUtil.encode(result.toString());
	            }
	      
	            out.write( sResult );
	        }
        }
        catch(IOException e){
        	throw new SystemException("Failed to write to pipeline component output: "+e.getMessage(),e);
        }
    }

    private void writeIndent(int level, Writer out) throws IOException {
        //TODO: allow on and off of indent mode
        for (int i = 0; i < level; i++) {
        	out.write("  ");
        }
    }
}