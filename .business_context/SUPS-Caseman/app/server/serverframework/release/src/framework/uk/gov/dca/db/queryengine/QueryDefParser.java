/*
 * Created on 22-Sep-2004
 *
 */
package uk.gov.dca.db.queryengine;

import java.io.IOException;
import java.util.Iterator;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Set;
import java.util.TreeSet;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

import org.jdom.Attribute;
import org.jdom.CDATA;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Text;
import org.jdom.filter.ContentFilter;
import org.jdom.filter.Filter;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.queryengine.syntax.*;

/**
 * A validating parser for instantiating a QueryDefinitions object. 
 * The behaviour when a validation rule is broken is defined by the error handler
 * currently set on the parser.
 * 
 * @author Grant Miller
 *
 */
public class QueryDefParser {

	// The error handler is called when a validation rule fails.
	private QueryEngineErrorHandler m_errorHandler = null;
	
    protected static final Pattern s_tableFieldPattern = Pattern.compile("\\b(\\w+)\\.(\\w+)\\b");
    protected static final Pattern s_variablePattern = Pattern.compile("\\$\\{([^}]+)\\}");
    protected static final Pattern s_xpathPredicatePattern = Pattern.compile("\\[[^\\]]+\\]");
    
    private static final Filter s_mappingContentFilter = 
    	new ContentFilter(ContentFilter.CDATA | ContentFilter.ELEMENT | ContentFilter.TEXT);
     
    private static final String s_true = "true";
    private static final String s_false = "false";
    
    /** A mapping of pivot xpath to the config xml for the query. Used for 2 stage query parsing.
     * First, the queries are created. Later, after other validation has been done, 
     * the query config can finally be applied and validated.
     */
    Map m_queriesConfig = null;
    
    /**
     * This provides preloaded items from the project config file. These may be needed for 
     * validation. Eg. the database connection is fetched from this cache.
     */
    Map m_preloadCache = null;
    
	/**
	 * Constructor
	 */
	public QueryDefParser() {
		super();
	}

	/**
	 * Sets the error handler to be used while parsing.
	 * 
	 * @param handler
	 */
	public void setErrorHandler( QueryEngineErrorHandler handler ) {
		m_errorHandler = handler;
	}
	
	/**
	 * Parses and validates the specified query definitions file and creates a query definitions object.
	 * 
	 * @param queryDefURI
	 * @return
	 * @throws QueryEngineException
	 */
	public QueryDefinitions parse( String queryDefURI, Map preloadCache )
		throws QueryEngineException, ConfigurationException
	{
		if ( m_errorHandler == null ) {
			throw new QueryEngineException("QueryDefParser requires a QueryEngineErrorHandler");
		}
		m_errorHandler.raiseMessage("Parsing query definitions...");
		
		m_preloadCache = preloadCache;
		m_queriesConfig = new TreeMap();
		
		// first parse and validate the XML
		Document queryDefsDoc = parseQueryDefinitionsXML( queryDefURI );
		   
		// now create the query definitions object
		QueryDefinitions queryDefinitions = new QueryDefinitions();
		Element docRoot = queryDefsDoc.getRootElement();
		
		parseDataSource(queryDefinitions, docRoot);
		parseTables(queryDefinitions, docRoot);
		extractMapping(queryDefinitions, docRoot);
		
				
		/* The following parsing is done in this order to assist validation. Namely:
		 * - create the query objects and organise as trees of pivot nodes.
		 * - extract the variables from the map and add as fields to the appropriate query.
		 * - parse the query contents ( checkExists, fields etc )
		 */
		createQueries(queryDefinitions, docRoot);
		
		parseMapping(queryDefinitions);
		
		createQueriesContents(queryDefinitions);
	
		// now validate any query dependencies
		satisfyDependentQueries(queryDefinitions);
		
		// Finally validate the tables and fields against database metadata
		try {
			validateAgainstDatabase(queryDefinitions);
		}
        catch (SQLException e) {
        	throw new QueryEngineException("Failed to validate against database: "+e.getMessage(),e);
        }
        
        return queryDefinitions;
	}
	
	/**
	 * Loads and parses the query defs XML file
	 * TODO: Ideally XML Schema validation of the XML will be done here too. Therefore
	 * current code does not try to detect all mistakes that XML Schema could detect for us. 
	 * @param queryDefURI
	 * @return
	 * @throws QueryEngineException
	 */
	private Document parseQueryDefinitionsXML( String queryDefURI ) 
		throws QueryEngineException, ConfigurationException
	{	
		Document queryDefDoc = null;
		InputSource inQueryDef = null;
		try {
			inQueryDef = Util.getInputSource(queryDefURI, this);
    	}
    	catch (SystemException e){
        	m_errorHandler.raiseError("File does not exist: " + queryDefURI);  	
    	}
    	
        SAXBuilder saxBuilder = new SAXBuilder();
        
        try {
        	queryDefDoc = saxBuilder.build(inQueryDef);
        }
        catch(IOException e) {
        	throw new QueryEngineException("Failed to read query definitions file: "+queryDefURI,e);
        }
        catch(JDOMException e) {
        	throw new ConfigurationException("Failed to build JDOM for: "+queryDefURI,e);
        }
        
        // try to load the specified map file
        Element queryDefRoot = queryDefDoc.getRootElement();
        Element dBMapDef = null;
        try {
        	dBMapDef = (Element) XPath.selectSingleNode(queryDefRoot, "DBMapDef");
        }
        catch( JDOMException e ) {
        	m_errorHandler.raiseCriticalError("No mapping file defined in "+queryDefURI );
        }
        if ( dBMapDef == null ) {
        	m_errorHandler.raiseCriticalError("No mapping file defined in "+queryDefURI );
        }
        
	    Attribute mappingLocation = dBMapDef.getAttribute("location");
	    if ( mappingLocation == null ) {
        	m_errorHandler.raiseCriticalError("No mapping file defined in "+queryDefURI );
        }
	    
	    InputSource inMapping = null;
	    try {
	    	inMapping = Util.getInputSource(mappingLocation.getValue(), this);
    	}
    	catch (SystemException e){
        	m_errorHandler.raiseCriticalError("Mapping file does not exist: '" + mappingLocation.getValue() +"'");  	
    	}
    	if ( inMapping == null) {
        	m_errorHandler.raiseCriticalError("Mapping file does not exist: '" + mappingLocation.getValue() +"'");
        }
    	
		Document mappingDoc = null;
		try {
			mappingDoc = saxBuilder.build(inMapping);
		}
		catch(IOException e) {
        	throw new QueryEngineException("Failed to read mapping file: '"+mappingLocation.getValue() +"'",e);
        }
		catch( JDOMException e) {
			throw new QueryEngineException("Failed to build JDOM for: '"+mappingLocation.getValue() +"'",e);
		}

		Element mappingRoot = mappingDoc.getRootElement();
        Element mapDefParent = (Element) dBMapDef.getParent();
	    dBMapDef.detach();
	    mappingRoot.detach();
	    mapDefParent.addContent(mappingRoot); 	    
	  	
	    return queryDefDoc;
	}
	
	/**
	 * Extracts and adds the datasource to the query defs object
	 * 
	 * @param queryDefinitions
	 * @param docRoot
	 * @throws QueryEngineException
	 */
	private void parseDataSource(QueryDefinitions queryDefinitions, Element docRoot)
		throws QueryEngineException, ConfigurationException
	{
		Element eDataSource = null;
		try {
			eDataSource = (Element)XPath.selectSingleNode(docRoot, "DBMapDef/DataSource");
		}
		catch( JDOMException e ) {
			m_errorHandler.raiseError("Missing 'DataSource' element on mapping");
			return;
		}
    	if ( eDataSource == null ) {
    		m_errorHandler.raiseError("Missing 'DataSource' element on mapping");
    	}
    	else {
    		String sLookupId = eDataSource.getAttributeValue("id");
		
    		if ( sLookupId == null || sLookupId.length() == 0 ) {
    			m_errorHandler.raiseError("Missing DataSource lookup 'id' on mapping");
    		}
		
    		queryDefinitions.setDataSourceLookupId( sLookupId );
    	}
	}
	
	/**
	 * Extracts and adds the mapping to the query defs object
	 * 
	 * @param queryDefinitions
	 * @param docRoot
	 * @throws QueryEngineException
	 */
	private void extractMapping(QueryDefinitions queryDefinitions, Element docRoot)
		throws QueryEngineException, ConfigurationException
	{
		Element eMapping = null;
		
		try {
			eMapping = (Element)XPath.selectSingleNode(docRoot, "DBMapDef/Mapping");
		}
		catch( JDOMException e ) {
			m_errorHandler.raiseCriticalError("No mapping defined");
			return;
		}
		
		List lChildren = eMapping.getChildren();
		
		// there should only be one child of the mapping element
		int numChildren = lChildren.size();
		if( numChildren == 0 ) {
			m_errorHandler.raiseCriticalError("No mapping defined");
			return;
		}
		if ( numChildren > 1 ) {
			m_errorHandler.raiseError("More than 1 top level child under DBMapDef/Mapping");
			return;
		}
		
		// mapping needs to be in it's own doc (this aids xpath evaluation)
		Document mappingDoc = new Document();
		Element mappingRoot = (Element)lChildren.get(0);
		mappingRoot.detach();
		mappingDoc.addContent(mappingRoot);
		queryDefinitions.setMapping( mappingDoc );
	}
	
	/**
	 * Extracts and adds the tables to the query defs object.
	 * 
	 * @param queryDefinitions
	 * @param docRoot
	 * @throws QueryEngineException
	 */
	private void parseTables(QueryDefinitions queryDefinitions, Element docRoot)
		throws QueryEngineException, ConfigurationException
	{
		List tables = null;
		Iterator tablesIterator = null;
		
		//first add tables from mappping. There must be at least 1 of these in order to make
		//it possible for any queries to be done.
		try {
			tables = XPath.selectNodes(docRoot, "DBMapDef/Tables/Table");
		}
		catch( JDOMException e ) {
			m_errorHandler.raiseError("Unable to retrieve any tables from 'DBMapDef/Tables/Table'");
			return;
		}
		
		if ( tables == null || tables.size() == 0) {
			m_errorHandler.raiseError("Unable to retrieve any tables from 'DBMapDef/Tables/Table'");
		}
		else {
			addTables( queryDefinitions, tables.iterator() );
		}
		
		//now add tables from query defs (it is ok if there are none)
		try {
			tables = XPath.selectNodes(docRoot, "Tables/Table");
		}
		catch( JDOMException e ) {
			m_errorHandler.raiseWarning("Unable to retrieve any tables from query definitions 'Tables/Table'");
			return;
		}
		
		if ( tables == null || tables.size() == 0) {
			m_errorHandler.raiseWarning("Unable to retrieve any tables from query definitions 'Tables/Table'");
		}
		else {
			addTables( queryDefinitions, tables.iterator() );
		}
	}
	
	/**
	 * Helper method for adding tables by iterating over a collection of tables
	 * 
	 * @param tablesIterator
	 */
	private void addTables( QueryDefinitions queryDefinitions, Iterator tablesIterator )
		throws QueryEngineException
	{
		if ( tablesIterator == null ) {
			throw new QueryEngineException("Null iterator passed to addTables");
		}
		
		while (tablesIterator.hasNext()) {
			Element table = (Element) tablesIterator.next();
			String name = table.getAttributeValue("name");
			String alias = table.getAttributeValue("alias");
			
			Table newTable = new Table();
			newTable.setAlias( alias.toUpperCase() );
			newTable.setName( name.toUpperCase() );
			
			// add table to query definitions
			queryDefinitions.addTable( newTable );
		}
	}
	
	/**
	 * Extracts and adds the queries to the query defs object but
	 * does NOT, at this point, parse and validate the join or modify config.
	 * 
	 * @param queryDefinitions
	 * @param docRoot
	 * @throws QueryEngineException
	 */
	private void createQueries(QueryDefinitions queryDefinitions, Element docRoot)
		throws QueryEngineException, ConfigurationException
	{
		List lQueries = null;
		
		try {
			lQueries = XPath.selectNodes(docRoot, "Query");
		}
		catch( JDOMException e ) {
			m_errorHandler.raiseError("No queries defined");
			return;
		}
		
		if ( lQueries == null || lQueries.size() == 0 ) 
		{
			m_errorHandler.raiseError("No queries defined");
		}
		else
		{
			Iterator queries = lQueries.iterator();
			while (queries.hasNext()) {
				createQuery( queryDefinitions, (Element) queries.next() );
			}
		}
	}
	
	/**
	 * Creates single query from the passed element
	 * 
	 * @param queryDefinitions
	 * @param eQuery
	 * @throws QueryEngineException
	 */
	private void createQuery(QueryDefinitions queryDefinitions, Element eQuery )
		throws QueryEngineException, ConfigurationException
	{
		Query newQuery = new Query();
		
		// set the pivot node
		setPivotNode(queryDefinitions, newQuery, eQuery);
		String pivotNode = newQuery.getPivotNode();
		
		// set select distinct
		setSelectDistinct(newQuery, eQuery);
		
		// set page controller (for paged queries)
		setPageController(newQuery, eQuery);
		
		// create the tables
        createQueryTables( queryDefinitions, newQuery, eQuery);
        
		// extract the SELECT join clause (this does not always need to be specified)
		String sJoin = eQuery.getChildTextNormalize("Join");
		validateJoin( queryDefinitions, newQuery, sJoin );

		Join newJoin = new Join();
		newJoin.setJoinClause(sJoin);
		newQuery.setJoin(newJoin);
        
		// extract the SELECT 'order by' clause (this does not always need to be specified)
		String sOrderBy = eQuery.getChildTextNormalize("OrderBy");
		if ( sOrderBy != null && sOrderBy.length() > 0 ) {
			OrderBy newOrderBy = new OrderBy();
			newOrderBy.setOrderByClause(sOrderBy);
			newQuery.setOrderBy(newOrderBy);
		}
		
		// now check to see whether there (probably) ought to be a join.
		// If a child pivot node does not have a join then that is an error but postpone
		// validation of that until all pivots have been processed.
		if ( ( sJoin == null || sJoin.length() == 0) && newQuery.getTables().size() > 1 ) {
			m_errorHandler.raiseWarning("A join may be needed by Query for pivot '"+pivotNode+"' because the query uses more than 1 table");
		}
		
        // add the query
		if ( pivotNode != null && pivotNode.length() > 0) {
	        if ( queryDefinitions.getQuery(pivotNode, true) != null )
	        	m_errorHandler.raiseError("More than one query defined for pivot '"+pivotNode+"'");
	        else {
	        	boolean isChild = queryDefinitions.addQuery(new QueryHandle(newQuery));
	        	m_queriesConfig.put(pivotNode, eQuery);
	        	
	        	// a child query should normally have a join
	        	if ( isChild == true && newQuery.getJoin() == null ) {
	        		m_errorHandler.raiseWarning("Query for pivot '"+pivotNode+"' has a parent query and may therefore require a Join");
	        	}
	        }
		}
	}
        
	/**
	 * Parses and validates the contents of all query tags (i.e. join and modify)
	 * 
	 * @param queryDefinitions
	 * @throws QueryEngineException
	 */
	private void createQueriesContents(QueryDefinitions queryDefinitions)
		throws QueryEngineException, ConfigurationException
	{
		Iterator queryConfigs = m_queriesConfig.entrySet().iterator();
		while ( queryConfigs.hasNext() )
		{
			Map.Entry entry = (Map.Entry)queryConfigs.next();
			String pivotNode = (String)entry.getKey();
			Element eQuery = (Element)entry.getValue();
			QueryHandle query = queryDefinitions.getQuery(pivotNode, true);
			if ( pivotNode == null || eQuery == null || query == null) {
				throw new QueryEngineException("A previously cached item has become null");
			}
			
			// create the modify related objects (i.e. for INSERT, UPDATE and DELETE)
	    	Element modifyElement = null;
	        try {
	        	modifyElement = (Element) XPath.selectSingleNode(eQuery, "Modify");
	        }
	        catch(JDOMException e) {
	        	m_errorHandler.raiseWarning("Query for pivot '"+pivotNode+"' has no 'Modify' element. If it is not modifiable then use <Modify notModifiable=\"true\"/>" );
	        }
	        
	        createModify( queryDefinitions, query.getQuery(), modifyElement );
		}
	}

	/**
	 * Helper method to handle extraction, validation and setting of Query objects' pivot node.
	 * 
	 * @param queryDefinitions
	 * @param newQuery
	 * @param eQuery
	 * @throws QueryEngineException
	 */
	private void setPivotNode(QueryDefinitions queryDefinitions, Query newQuery, Element eQuery)
		throws QueryEngineException, ConfigurationException
	{
		// get the pivot node configuration
		String pivotNode = eQuery.getAttributeValue("pivotNode");
		
		if ( pivotNode == null || pivotNode.length() == 0 ) {
			m_errorHandler.raiseError("No pivot node specified for Query");
			return;
		}
		
		Collection errors = new Vector();
		Object ePivot = validateNodeXPath(queryDefinitions.getMapping().getRootElement(), pivotNode, true, false, errors);
		
		if ( errors.size() > 0 ) {
			// output any errors
			Iterator errorsIterator = errors.iterator();
			String sMsg = "Query pivot node '"+pivotNode+"' has the following errors:";
			while ( errorsIterator.hasNext() ) {
				sMsg += "\r\n-->" + errorsIterator.next();
			}
			
			m_errorHandler.raiseError(sMsg);
		}
		
		// store the xpath. Note: it may seem like a good idea to store the node's resolved xpath
		// rather than the xpath used to find it. This would mean that a query and query extension
		// would match so long as they resolved to the same element even if the xpath was different.
		// However, we would lose any xpath predicates in [] brackets, meaning a unique match
		// may become non-unique. 
		// eg. pivot could be defined in query def as: /Case/Party[@type='claimant']/Contact[position()=1]
		// resolving uniquely. But the resolved path would not be unique: /Case/Party/Contact
		newQuery.setPivotNode(pivotNode);
	}

	/**
	 * Validates a given (normalized) xpath.
	 * 
	 * @param evaluationElement - the element to evaluate the xpath against
	 * @param xpath
	 * @param bIsElement
	 * @param bIsAttribute
	 * @param bIsUnique
	 * @return error messages
	 */
	private Object validateNodeXPath(Element evaluationElement, String xpath, boolean bCanBeElement, boolean bCanBeAttribute, Collection errors)
	{
		Object node = null;
		
		if ( !bCanBeElement && !bCanBeAttribute ) return node;
		
		if ( xpath.length() == 0 ) {
			errors.add( "XPath does not identify a node" );
			return node;
		}
		
		// make sure we do not match on a wildcard because this will lead to unpredictable behaviour
		if ( xpath.indexOf('*') != -1 ) {
			errors.add("XPath '"+xpath+"' should not use a wildcard");
			return node;
		}
			
		// to make life simple, we will not include any predicates in the validation because
		// they may be looking for runtime node values. But we can validate the structure they expect.
		String sSearchXPath = xpath.replaceAll(s_xpathPredicatePattern.pattern(), "");
	
		// for now we do not validate nested references to property/fields which make up the
		// structure of the xpath (rather than references used in predicates):
		String sSearchXPathNoVars = sSearchXPath.replaceAll(s_variablePattern.pattern(), "");
		if ( sSearchXPathNoVars.compareTo(sSearchXPath) != 0 ) return node; 
		
		// now try to find the node. There must be only 1 match
		try {
			List lNodes = XPath.selectNodes(evaluationElement, sSearchXPath);
			if ( lNodes.size() == 0 ) { 
				errors.add("Node identified by XPath '"+xpath+"' does not exist in map");
			}
			else if ( lNodes.size() > 1 ) {
				errors.add("XPath '"+xpath+"' identifies more than 1 node" );
			}
			else {
				// see if the node is of the right type
				node = lNodes.get(0);

				if (node == null) {
					errors.add("XPath '"+xpath+"' does not exist in map" );
				}
				else {
					boolean bEvalutesToElement = true;
					boolean bEvalutesToAttribute = true;
					
					if ( bCanBeElement ) {
						try {
							Element element = (Element)node;
						}
						catch (ClassCastException e) {
							bEvalutesToElement = false;
						}
					}
					
					if ( bCanBeAttribute && !(bCanBeElement && bEvalutesToElement) ) {
						try {
							Attribute attribute = (Attribute)node;
						}
						catch (ClassCastException e) {
							bEvalutesToAttribute = false;
						}
					}
					
					if ( bCanBeElement && !bEvalutesToElement && !bCanBeAttribute ) {
						errors.add("XPath '"+xpath+"' needs to specify an Element" );
						node = null;
					}
					else if ( !bCanBeElement && bCanBeAttribute && !bEvalutesToAttribute) {
						errors.add("XPath '"+xpath+"' needs to specify an Attribute" );
						node = null;
					}
					else if ( !bEvalutesToElement && !bEvalutesToAttribute ) {
						errors.add("XPath '"+xpath+"' needs to specify an Attribute or Element" );
						node = null;
					}
				}
			}
		}
		catch (JDOMException e) {
			errors.add("Node identified by XPath '"+xpath+"' does not exist in map" );
		}
		catch(Throwable e) {
			// catches any remaining invalid xpath expressions or, at least, ones JDOM xpath cannot evaluate
			errors.add("Node identified by XPath '"+xpath+"' does not exist in map" );
		}
		
		return node;
	}
	
	/**
	 * Sets a query's select distinct property
	 * @param newQuery
	 * @param eQuery
	 * @throws QueryEngineException
	 * @throws ConfigurationException
	 */
	private void setSelectDistinct(Query newQuery, Element eQuery)
		throws QueryEngineException, ConfigurationException
	{
		Attribute attrSelectDistinct = eQuery.getAttribute("selectDistinct");
		if ( attrSelectDistinct != null ) {
			String sSelectDistinct = attrSelectDistinct.getValue();
	        if ( s_true.compareToIgnoreCase(sSelectDistinct) == 0 ) {
	        	newQuery.setSelectDistinct(true);
	        }
	        else {
	        	if ( s_false.compareToIgnoreCase(sSelectDistinct) == 0 ) {
	            	newQuery.setSelectDistinct(false);
	        	}
	        	else {
	        		m_errorHandler.raiseError("Query '"+newQuery.getPivotNode()+"' has invalid selectDistinct value '"+sSelectDistinct+"'");
	        	}
	        }
		}
	}
	
	/**
	 * creates and sets the page controller (used to store info about paged queries)
	 * for the query. May not be one.
	 * @param eParent
	 */
	private void setPageController(Query newQuery, Element eParent) 
			throws QueryEngineException, ConfigurationException
	{
    	if (eParent == null) return;
    	Element ePaged = eParent.getChild("Paged");
    	if (ePaged == null) return;
    		
    	String pageSizeAttr = ePaged.getAttributeValue("pageSize");
    	String pageNumberAttr = ePaged.getAttributeValue("pageNumber");
    	
    	if ( pageSizeAttr != null && pageSizeAttr.length() > 0 &&
    			pageNumberAttr != null && pageNumberAttr.length() > 0 ) 
    	{
    		Query.PageController newController = newQuery.new PageController();

    		int pageSize = 0;
    		int pageNumber = 0;
    		String pageSizeParameter = null;
    		String pageNumberParameter = null;
    		
    		//see if parameterised:
			Matcher vars = s_variablePattern.matcher(pageSizeAttr);
            if (vars.find()) {
            	pageSizeParameter = vars.group(1);
            	Matcher paramMatcher = s_tableFieldPattern.matcher(pageSizeParameter);
            	
            	String paramGroup = null;
            	String paramName = null;
            	
            	if ( paramMatcher != null && paramMatcher.find()) { 
            		try{ 
            			paramGroup = paramMatcher.group(1);
                		paramName = paramMatcher.group(2);
            		}
            		catch(Exception e) {}
            	}
            	
	            if ( paramGroup != null && paramGroup.length() > 0 &&
	            		paramName != null && paramName.length() > 0 ) 
	            {
	            	newController.setPageSizeParameter(pageSizeParameter);
	            }
	            else {
	            	m_errorHandler.raiseError("Invalid page size parameter '"+pageSizeAttr+"'. Should be of form <param group>.<param name>");
	            }
            }
            else {
            	try {
            		pageSize = Integer.parseInt(pageSizeAttr);
                	newController.setPageSize(pageSize);
            	}
            	catch(Exception e) {
            		m_errorHandler.raiseError("Invalid page size '"+pageSizeAttr+"'");
            	}
            }
            
            //do page number
			vars = s_variablePattern.matcher(pageNumberAttr);
            if (vars.find()) {
            	pageNumberParameter = vars.group(1);
            	Matcher paramMatcher = null;
            	
            	paramMatcher = s_tableFieldPattern.matcher(pageNumberParameter);
            	
            	String paramGroup = null;
            	String paramName = null;
            	
            	if ( paramMatcher != null && paramMatcher.find()) { 
            		try {
            			paramGroup = paramMatcher.group(1);
            			paramName = paramMatcher.group(2);
            		}
                	catch(Exception e) {}
            	}
            	
            	if ( paramGroup != null && paramGroup.length() > 0 &&
	            		paramName != null && paramName.length() > 0 ) 
	            {
	            	newController.setPageNumberParameter(pageNumberParameter);
	            }
	            else {
	            	m_errorHandler.raiseError("Invalid page number parameter '"+pageNumberAttr+"'. Should be of form <param group>.<param name>");
	            }
            }
            else {
            	try {
            		pageNumber = Integer.parseInt(pageNumberAttr);
            		newController.setPageNumber(pageNumber);
        		}
        		catch(Exception e) {
        			m_errorHandler.raiseError("Invalid page number '"+pageNumberAttr+"'");
        		}
            }
                 
            newQuery.setPageController( newController );
    	}	
    }
	/**
	 * Helper method to add tables to the new Query object.
	 * 
	 * @param queryDefinitions
	 * @param query
	 * @param eQuery
	 * @throws QueryEngineException
	 */
	private void createQueryTables(QueryDefinitions queryDefinitions, Query query, Element eQuery)
		throws QueryEngineException, ConfigurationException
	{
		String queryPivot = query.getPivotNode();
		
		String tables = eQuery.getAttributeValue("tables");
        if ( tables == null || tables.length() == 0 ) {
        	m_errorHandler.raiseError("Query for pivot '"+queryPivot+"' does not specify any tables");
        }
        String[] arrTables = tables.split(" ");
       
        for ( int i = 0 ; i < arrTables.length; i++ ) {
            Table table = queryDefinitions.getTable(arrTables[i]);
            if ( table == null ) {
            	m_errorHandler.raiseError("Query for pivot '"+queryPivot+"' refers to undefined table: "+arrTables[i]);
            }
            else {
            	Table newTable = new Table();
            	newTable.setAlias( table.getAlias() );
            	newTable.setName( table.getName() );
            	query.addTable( newTable );
            }
        }
	}
	
	/**
	 * Helper method to validate a SELECT join string.
	 * 
	 * @param query
	 * @param sJoin
	 * @throws QueryEngineException
	 */
	private void validateJoin( QueryDefinitions queryDefinitions, Query query, String sJoin )
		throws QueryEngineException, ConfigurationException
	{
		String queryPivot = query.getPivotNode();
		if ( sJoin != null && sJoin.length() > 0) 
		{	
			// Note: we do NOT try to parse the SQL.
			// Validation is limited to checking any variable parameters embeded in the join.
			Matcher matcher = s_variablePattern.matcher(sJoin);
	        while (matcher.find()) {
	            boolean bMatched = false;
	            
	            String fieldName = matcher.group(1);
	            bMatched = validateJoinVariable(queryDefinitions, query, fieldName, false);
	            
	            if ( bMatched == false ) {
	            	m_errorHandler.raiseError("Join '"+sJoin+"' for pivot '"+queryPivot+"' uses variable '"+fieldName+"' which should be of the form '<table name>.<field name>'");
	            }
	        }
		}
	}
	
	/**
	 * Checks that the variable refers to a valid db table.
	 * 
	 * @param queryDefinitions
	 * @param query
	 * @param sJoin
	 * @throws QueryEngineException
	 */
	private boolean validateJoinVariable( QueryDefinitions queryDefinitions, Query query, String sJoinVar, boolean bIsConstraint )
		throws QueryEngineException, ConfigurationException
	{
		boolean bMatched = false;
		
		String queryPivot = query.getPivotNode();
		
		String fieldName = sJoinVar.toUpperCase();
        Matcher fieldNameParts = s_tableFieldPattern.matcher(fieldName);
        
        while (fieldNameParts.find()) {
        	bMatched = true;
        	
        	String tableAlias = fieldNameParts.group(1);
            String property = fieldNameParts.group(2);
            
            if ( queryDefinitions.getTable( tableAlias ) == null ) {
            	if ( bIsConstraint == false)
            		m_errorHandler.raiseError("Join variable '"+sJoinVar+"' for pivot '"+queryPivot+"' uses undefined table '"+tableAlias+"'");
            	else
            		m_errorHandler.raiseError("Constraint variable '"+sJoinVar+"' for pivot '"+queryPivot+"' uses undefined table '"+tableAlias+"'");
            }
            else {
            	addFieldToAllTablesFields(queryDefinitions,tableAlias,fieldName);
            }
        }
        
        return bMatched;
	}
	
	/**
	 * Adds the 'modify' related objects to the query.
	 * 
	 * @param newQuery
	 * @param modifyElement
	 * @throws QueryEngineException
	 */
    private void createModify( QueryDefinitions queryDefinitions, Query newQuery, Element modifyElement )
      	throws QueryEngineException, ConfigurationException
    {
    	String queryPivot = newQuery.getPivotNode();
       	if ( modifyElement == null)
        {
       		m_errorHandler.raiseWarning("Query for pivot '"+queryPivot+"' has no 'Modify' element. If it is not modifiable then use <Modify notModifiable=\"true\"/>");
        }
        else
        {
        	// handle the modifiable flag
          	Attribute attrNotModifiable = modifyElement.getAttribute("notModifiable");
          	if ( attrNotModifiable == null )
           		newQuery.setModifiable(true);
           	else 
           	{
           		String sModifiable = attrNotModifiable.getValue();
           		if ( sModifiable.compareToIgnoreCase("true") == 0 )
           			newQuery.setModifiable(true);
           		else
           			newQuery.setModifiable(false);
           	}
          	

          	// create fields. This must be before the existence checks are parse.
          	// this is because the fields are needed to parse the checks.
    		List lFields = null;
          	try {
          		lFields = XPath.selectNodes(modifyElement, "Field");
          	}
          	catch( JDOMException e ) {
          		if ( newQuery.isModifiable() == true ) {
          			m_errorHandler.raiseWarning("Modify for pivot '"+queryPivot+"' has no 'Field' elements" );
          		}
          	}
          	if ( !newQuery.isModifiable() && lFields.size() > 0 ) {
          		m_errorHandler.raiseWarning("Non-modifiable pivot '"+queryPivot+"' has 'Field' elements");
          	}
          	
          	createFields( lFields, queryDefinitions, newQuery, modifyElement);
          	
          	// create existence checks
        	List lExistenceChecks = null;
          	try {
          		lExistenceChecks = XPath.selectNodes(modifyElement, "CheckExists");
          	}
          	catch( JDOMException e ) {
               	if ( newQuery.isModifiable() == true ) {
               		m_errorHandler.raiseWarning("Modify for pivot '"+queryPivot+"' has no 'CheckExists' elements" );
               	}
          	}
          	if ( !newQuery.isModifiable() && lExistenceChecks.size() > 0 ) {
          		m_errorHandler.raiseWarning("Non-modifiable pivot '"+queryPivot+"' has 'CheckExists' elements");
          	}
          	
          	createExistenceChecks( lExistenceChecks, newQuery, modifyElement);
          	
        }
    }
    	

    /**
     * Extracts and adds existence check objects to the query.
     * 
     * @param newQuery
     * @param modifyElement
     * @throws QueryEngineException
     */
    private void createExistenceChecks( List lExistenceChecks, Query newQuery, Element modifyElement)
		throws QueryEngineException, ConfigurationException
  	{
    	String queryPivot = newQuery.getPivotNode();
    	Set existenceChecks = new TreeSet(); // local store of existence checks defined so far by this list
    	
      	Iterator checksIterator = lExistenceChecks.iterator();
      	while ( checksIterator.hasNext() )
      	{
      		Element eCheck = (Element) checksIterator.next();
            ExistenceCheck newCheck = new ExistenceCheck();
            
            // validate the table to check against
            String alias = eCheck.getAttributeValue("table").toUpperCase();
            Table table = newQuery.getTable(alias);
            if ( table == null ) {
            	m_errorHandler.raiseError("'CheckExists' for pivot '"+queryPivot+"' refers to Table '"+alias+"' which is undefined for the Query");
            }
          	
            // make sure actions are valid
            String onExistAction = eCheck.getAttributeValue("onExist");
            String onNotExistAction = eCheck.getAttributeValue("onNotExist");
            
            // NOTE: while conditional actions are validated they are not currently set on the
            // ExistenceCheck object.
            
            if ( onExistAction != null && onExistAction.length() > 0 ) {
            	try {
                	// first see if it is a conditional check
            		if ( conditionalExistenceCheck(onExistAction) ) {
            			validateConditionalExistenceCheck(onExistAction,true);
            		}
            		else {
            			ExistsAction newAction = validCheckOnExistsAction(onExistAction);
            			newCheck.setExistsAction(newAction);
            		}
            	}
            	catch( QueryEngineException e) {
            		m_errorHandler.raiseError("Pivot '"+queryPivot+"' CheckExists has invalid onExist '"+onExistAction+"'. Should be fail, skip, update or delete");
            	}
            }
            if ( onNotExistAction != null && onNotExistAction.length() > 0  ) {
            	try {
            		// first see if it is a conditional check
            		if ( conditionalExistenceCheck(onNotExistAction) ) {
            			validateConditionalExistenceCheck(onNotExistAction,false);
            		}
            		else {
            			ExistsAction newAction = validCheckNotExistsAction(onNotExistAction);
            			newCheck.setNotExistsAction(newAction);
            		}
            	}
            	catch( QueryEngineException e) {
            		m_errorHandler.raiseError("Pivot '"+queryPivot+"' CheckExists has invalid onNotExist '"+onNotExistAction+"'. Should be fail, skip or add");
                }
            }
            
            // validate the 'useOptimisticLock' attribute
            boolean bUseOptimisticLock = true; // default value
            Attribute attrOptimisticLock = eCheck.getAttribute("useOptimisticLock");
            if (attrOptimisticLock != null) {
            	String useLock = attrOptimisticLock.getValue();
            	if ( s_false.compareToIgnoreCase(useLock) == 0 ) {
            		bUseOptimisticLock = false;
            	}
            	else if (s_true.compareToIgnoreCase(useLock) != 0){
            		m_errorHandler.raiseError("Pivot '"+queryPivot+"' CheckExists has invalid attribute value for useOptimisticLock '"+useLock+"'. Should be true or false");
            	}
            }
            
            newCheck.setUseOptimisticLock(bUseOptimisticLock);
            
            // validate any condition and associated actions
            Attribute attrCondition = eCheck.getAttribute("condition");
            
            if ( attrCondition != null ) {
            	String conditionClause = attrCondition.getValue();
                
            	if (conditionClause.length() == 0) {
            		m_errorHandler.raiseError("CheckExists for table alias '"+alias+"', Pivot '"+queryPivot+"', has zero length condition");
            	}
            	else {
            		newCheck.setConditionClause(conditionClause);
            		
            		ExistsConditionAction conditionTrueAction = ExistsConditionAction.CONTINUE;
            		ExistsConditionAction conditionFalseAction = ExistsConditionAction.SKIP;
            		
            		Attribute attrConditionTrue = eCheck.getAttribute("onConditionTrue");
            		Attribute attrConditionFalse = eCheck.getAttribute("onConditionFalse");
            		
            		if ( attrConditionTrue != null ) {
            			conditionTrueAction = validCheckExistsConditionAction(attrConditionTrue.getValue()); 
            		}
            		if ( attrConditionFalse != null ) {
            			conditionFalseAction = validCheckExistsConditionAction(attrConditionFalse.getValue()); 
            		}
            	}
            }
            
            // validate the fields
            String fields = eCheck.getAttributeValue("fields");
            if ( fields == null || fields.length() == 0 ) {
            	m_errorHandler.raiseError("CheckExists for table alias '"+alias+"', Pivot '"+queryPivot+"', has no fields specified");
            }
            else {
            	if ( table != null ) {
	            	String[] fieldsArray = fields.split(" ");
	            	for ( int i = 0; i < fieldsArray.length ; i++) {
	            		String fullName = alias + "." + fieldsArray[i].toUpperCase();
	            		Field existingField = table.getField(fullName);
	 
	            		if ( existingField == null ) {
	            			m_errorHandler.raiseError("CheckExists for table alias '"+alias+"', Pivot '"+queryPivot+"', uses undefined field '"+fullName+"'" );
	            		}
	            		else {
	            			newCheck.addField(existingField);
	            		}
	            	}
            	}
            }
            
            // finally, add the check to the table
            if ( table != null ) {
            	// see if the check is already defined by the current check list:
            	if ( existenceChecks.contains(alias))
            		m_errorHandler.raiseError("CheckExists for table alias '"+alias+"' for pivot '"+queryPivot+"' is defined more than once" );
            	else {
            		existenceChecks.add(alias);
            		
	            	if ( table.getExistenceCheck() != null ) {
	            		m_errorHandler.raiseWarning("Overriding CheckExists for table alias '"+alias+"' for pivot '"+queryPivot+"'" );	
	                }
	            	table.setExistenceCheck(newCheck);
            	}
            }
      	}
    }
    
    /**
     * Returns true if a conditional action
     * 
     * @param onExistAction
     * @return
     */
    private boolean conditionalExistenceCheck(String action)
    {
    	boolean bConditional = false;
    	
		int conditionLen = -1;
		
		if ( action != null ) {
			conditionLen = action.indexOf('?');
		}
		
		if ( conditionLen != -1 ) bConditional = true;
		
		return bConditional;
    }
    
    private void validateConditionalExistenceCheck(String actionSpec, boolean exists)
    	throws ConfigurationException, QueryEngineException
    {
    	boolean bValid = false;
    	
    	// parse the string to see whether it specifies a dynamic or static action
		int conditionLen = -1;
		
		if ( actionSpec != null ) {
			conditionLen = actionSpec.indexOf('?');
		}
		
		if ( conditionLen != -1 )
		{
			// it is a dynamic action
			int actionsDividerPos = actionSpec.indexOf(':', conditionLen+1);
			if ( actionsDividerPos != -1 ) {
				String trueActionString = actionSpec.substring(conditionLen+1, actionsDividerPos);
				trueActionString = trueActionString.trim();

				String falseActionString = actionSpec.substring(actionsDividerPos+1);
				falseActionString = falseActionString.trim();
				
				if ( exists ) {
					validCheckOnExistsAction(trueActionString);
					validCheckOnExistsAction(falseActionString);
				}
				else {
					validCheckNotExistsAction(trueActionString);
					validCheckNotExistsAction(falseActionString);
				}
				bValid=true;
			}
			
			if ( bValid == false ) {
				m_errorHandler.raiseError("Invalid conditional action '"+ actionSpec +"'");
			}
		}
		
    }
    
    /**
     * Converts passed string into a valid ExistsAction object for 'onExist' action
     * 
     * @param action
     * @return
     * @throws QueryEngineException
     */
    private ExistsAction validCheckOnExistsAction(String action)
    	throws QueryEngineException, ConfigurationException
    { 
    	ExistsAction newAction = null;
    	
    	if ( "fail".compareToIgnoreCase(action) == 0 )
    		newAction = ExistsAction.FAIL;
    	if ( "update".compareToIgnoreCase(action) == 0 )
    		newAction = ExistsAction.UPDATE;
		if ( "skip".compareToIgnoreCase(action) == 0 )
			newAction = ExistsAction.SKIP;
		if ( "delete".compareToIgnoreCase(action) == 0 )
			newAction = ExistsAction.DELETE;   

		if ( newAction == null) {
			m_errorHandler.raiseError("Invalid action '"+ action +"'");
		}
		return newAction;
    }
    
    /**
     * Converts passed string into a valid ExistsAction object for 'onNotExist' action
     * 
     * @param action
     * @return
     * @throws QueryEngineException
     */
    private ExistsAction validCheckNotExistsAction(String action)
    	throws QueryEngineException, ConfigurationException
    { 
    	ExistsAction newAction = null;
    	
    	if ( "fail".compareToIgnoreCase(action) == 0 )
    		newAction = ExistsAction.FAIL;
		if ( "add".compareToIgnoreCase(action) == 0 )
			newAction = ExistsAction.ADD;   
		if ( "skip".compareToIgnoreCase(action) == 0 )
			newAction = ExistsAction.SKIP;

		if ( newAction == null) {
			m_errorHandler.raiseError("Invalid action '"+ action +"'");
		}
		return newAction;
    }
    
    /**
     * Converts passed string into a valid ExistsConditionAction object for existence check
     * pre-condition
     * 
     * @param action
     * @return
     * @throws QueryEngineException
     */
    private ExistsConditionAction validCheckExistsConditionAction(String action)
    	throws QueryEngineException, ConfigurationException
    { 
    	ExistsConditionAction newAction = null;
    	
    	if ( "fail".compareToIgnoreCase(action) == 0 )
    		newAction = ExistsConditionAction.FAIL;
		if ( "skip".compareToIgnoreCase(action) == 0 )
			newAction = ExistsConditionAction.SKIP;
    	if ( "continue".compareToIgnoreCase(action) == 0 )
    		newAction = ExistsConditionAction.CONTINUE;

		if ( newAction == null) {
			m_errorHandler.raiseError("Invalid condition action '"+ action +"'");
		}
		return newAction;
    }
    /**
     * Extracts and adds field objects to the query.
     * 
     * @param newQuery
     * @param modifyElement
     * @throws QueryEngineException
     */
	private void createFields( List lFields, QueryDefinitions queryDefinitions, Query newQuery, Element modifyElement)
		throws QueryEngineException, ConfigurationException
	{
		String queryPivot = newQuery.getPivotNode();
		Set fieldNames = new TreeSet(); // local store of field names from this fields list
		
		Iterator fieldsIterator = lFields.iterator();
      	while (fieldsIterator.hasNext()) {
      		// create the field
            Element eField = (Element) fieldsIterator.next();
            Field newField = new Field();
            newField.setModifiable(true);
            newField.setSelectable(false);
            
            //validate the name
            String name = eField.getAttributeValue("name");
            Table owningTable = validFieldName( newQuery, name);
            newField.setName(name.toUpperCase());
            
            // see if the field is already defined by the current field list:
        	if ( fieldNames.contains(newField.getName()) )
        		m_errorHandler.raiseError("Field '"+newField.getName()+"' for pivot '"+queryPivot+"' is defined more than once" );
        	else
        		fieldNames.add(newField.getName());
        	
            // handle the way in which the field gets it's value
            if ( parseFieldAttributes(queryDefinitions,queryPivot,newField,eField) == true &&
            		owningTable != null)
            {
            	// now see if it is an existing field. It could come from the map or, if an extension,
            	// a base query (which would include fields from base joins).
            	Field existingField = owningTable.getField(newField.getName());
            	
            	if ( existingField == null ) {
            		owningTable.addField(newField);
            		addFieldToAllTablesFields(queryDefinitions,owningTable.getAlias(),newField.getName());
            	}
            	else {
            		// this means we are updating an existing field
            		existingField.setModifiable(true);
            		existingField.setProperty(newField.getProperty());
					existingField.setSequence(newField.getSequence());
					existingField.setValue(newField.getValue());
					
					// the xpath is special because it can be used for both select and modify, therefore make sure it
					// is preserved unless we are updating with new value:
					String xpath = newField.getXpath();
					if ( xpath != null && xpath.length() > 0 ) {
						String sWarning = "Updating XPath of existing Field '"+newField.getName()+"' for pivot '"+queryPivot+"':\r\n";
	            		sWarning += "Old properties: " + existingField.toString() + "\r\n";
						
	            		existingField.setXpath(newField.getXpath());
	            		
	            		sWarning += "New properties: " + existingField.toString();
						m_errorHandler.raiseWarning( sWarning );	
					}
            	}
            }
        }
	}	
	
	/**
	 * Helper method which parses and validates the value resolving atrributes for a given field.
	 * 
	 * @param queryPivot
	 * @param owner
	 * @param newField
	 * @param eField
	 * @return
	 * @throws QueryEngineException
	 */
	private boolean parseFieldAttributes(QueryDefinitions queryDefinitions, String queryPivot, 
			Field newField, Element eField)
		throws QueryEngineException, ConfigurationException
	{
		boolean valid = false;
		
		String name = newField.getName();
		
		Attribute sequenceTableAttr = eField.getAttribute("sequenceTable");
        Attribute propertyAttr = eField.getAttribute("property");
        Attribute valueAttr = eField.getAttribute("value");
        Attribute xpathAttr = eField.getAttribute("xpath");
        
        if ( sequenceTableAttr == null && propertyAttr == null 
        		&& valueAttr == null && xpathAttr == null) {
        	m_errorHandler.raiseError("'Field' with name '"+name+"' for pivot '"+queryPivot+"' has no value");
        }
        else {
            if ( sequenceTableAttr != null ) {
            	String value = sequenceTableAttr.getValue();
            	if ( value == null || value.length() == 0 )
            		m_errorHandler.raiseError("'Field' with name '"+name+"' for pivot '"+queryPivot+"' has undefined 'sequenceTable'");
            	else
            		newField.setSequence(value);
            }
            if ( propertyAttr != null ) {
            	String value = propertyAttr.getValue();
            	if ( value == null || value.length() == 0 )
            		m_errorHandler.raiseError("'Field' with name '"+name+"' for pivot '"+queryPivot+"' has undefined 'property'");
            	else
            		newField.setProperty(value);
            }
            if ( valueAttr != null ) {
            	String value = valueAttr.getValue();
            	if ( value == null || value.length() == 0 )
            		m_errorHandler.raiseError("'Field' with name '"+name+"' for pivot '"+queryPivot+"' has undefined 'value'");
            	else
            		newField.setValue(value);
            }
            if ( xpathAttr != null ) {
            	String value = xpathAttr.getValue();
            	if ( value == null || value.length() == 0 )
            		m_errorHandler.raiseError("'Field' with name '"+name+"' for pivot '"+queryPivot+"' has undefined 'xpath'");
            	else {
            		// validate if possible (may be an invalid pivot)
            		Element rootNode = queryDefinitions.getMapping().getRootElement();
            		Element pivotNode = null;
            		boolean bValidPivot = true;
            		try {
            			pivotNode = (Element)XPath.selectSingleNode(rootNode, queryPivot);
            		}
            		catch (JDOMException e) { bValidPivot=false; }
            		catch (ClassCastException e ) { bValidPivot=false; }
            		
            		setFieldXpath(pivotNode,queryPivot,newField,value);
            	}
            }
            
            valid = true;
        }
        
		return valid;
	}
	
	/**
	 * Helper to validate and set the xpath for a field.
	 *  
	 * @param queryDefinitions
	 * @param queryPivot
	 * @param newField
	 * @param xpath
	 * @throws QueryEngineException
	 */
	private void setFieldXpath(Element pivotNode, String queryPivot, Field newField, String xpath)
		throws QueryEngineException, ConfigurationException
	{
		// allow the xpath to be specified relative to the query's pivot node
		Collection errors = new Vector();
		Object node = validateNodeXPath(pivotNode, xpath, true, true, errors);
		
		if ( errors.size() > 0 ) {
			// output any errors
			Iterator errorsIterator = errors.iterator();
			String sMsg = "XPath of Field '"+newField.getName()+"' for pivot '"+queryPivot+"' has the following errors:";
			while ( errorsIterator.hasNext() ) {
				sMsg += "\r\n-->" + errorsIterator.next();
			}
			
			m_errorHandler.raiseError(sMsg);
		}
		else if ( node != null ){
			newField.setXpath(xpath);
		}
	}
	
	/**
	 * Helper method to check whether the field name is valid.
	 * 
	 * @param newQuery
	 * @param fieldName
	 * @throws QueryEngineException
	 */
	private Table validFieldName( Query newQuery, String fieldName )
		throws QueryEngineException, ConfigurationException
	{
		Table table = null;
		String queryPivot = newQuery.getPivotNode();
		
		// validate the name
		if ( fieldName == null || fieldName.length() == 0 ) {
			m_errorHandler.raiseError("Pivot '"+queryPivot+"' has field with no name");
		}
		else
		{
			fieldName = fieldName.toUpperCase();
	        Matcher fieldNameParts = s_tableFieldPattern.matcher(fieldName);
	        boolean bMatched = false;
	        
	        while (fieldNameParts.find()) {
	        	bMatched = true;
	            String tableAlias = fieldNameParts.group(1);
	            String property = fieldNameParts.group(2);
	            table = newQuery.getTable(tableAlias);
	            
	        	if ( table == null ) {
	            	m_errorHandler.raiseError("Field '"+fieldName+"' for pivot '"+queryPivot+"' uses table '"+tableAlias+"' which is undefined for the Query");
	        	}
	        }
	        
	        if ( bMatched == false ) {
	        	m_errorHandler.raiseError("Field '"+fieldName+"' for pivot '"+queryPivot+"' should be of the form '<table name>.<field name>'");
	        }
		}
		
        return table;
	}
	
	/**
	 * Traverses the mapping XML in order to set up 'select' and additional 'modify' fields 
	 * for the queries, validating any fields it finds.
	 * It also ouputs a list of any variables which fall outside the scope of any pivot nodes.
	 * 
	 * @param queryDefinitions
	 * @throws QueryEngineException
	 */
	private void parseMapping( QueryDefinitions queryDefinitions )
		throws QueryEngineException, ConfigurationException
	{
		Document mapping = queryDefinitions.getMapping();
		
		// create a mapping of xpath to variable
		Map variables = new TreeMap();
		Element mappingRoot = (Element)mapping.getRootElement();
		
		// This builds up a mapping of xpath to a vector of variable names.
		// Variables refer to table fields and should be of the form <table name>.<field name>.
		// A vector is used because more than one element with a given xpath 
		// can appear at the same place in a document.
		extractMapVariables( variables, "/" + mappingRoot.getName(), mappingRoot);
		
		// now add variables as selectable fields to appropriate Query objects.
		Iterator itVariables = variables.entrySet().iterator();		
		while ( itVariables.hasNext() ) {
			Map.Entry variable = (Map.Entry)itVariables.next();
			String varXPath = (String)variable.getKey();
			QueryHandle query = queryDefinitions.getQuery( varXPath, false);
			if ( query != null ) {
				Vector variableNames = (Vector)variable.getValue();
				addMapVariable(queryDefinitions, query.getQuery(), varXPath, variableNames);
				
				// remove variable(s) from list since there is a pivot for them
				itVariables.remove();
			}
		}
		
		// That is all the object creation done.
		// Now now see if any variables are not covered by a pivot node.
		if ( variables.size() > 0 ) {
			String sMsg = "Map contains variables which are not contained by any pivot node:";
			itVariables = variables.entrySet().iterator();
			while ( itVariables.hasNext() ) {
				Map.Entry variable = (Map.Entry)itVariables.next();
				String sVarMsg = "\r\n-->"+(String)variable.getKey() + ": ";
				Vector variableNames = (Vector)variable.getValue();
				Iterator itVariableNames = variableNames.iterator();
				boolean bFirst = true;
				while ( itVariableNames.hasNext() ) {
					String name = (String)itVariableNames.next();
					if (bFirst == false) {
						sVarMsg += ", ";
					}
					sVarMsg += name;
				}
				
				sMsg += sVarMsg;
			}
			m_errorHandler.raiseError(sMsg);	
		}
	}
	
	/**
	 * Helper method to add mapping based variables with a given XPath to a query.
	 *  
	 * @param query
	 * @param varXPath
	 * @param variableNames
	 * @return
	 * @throws QueryEngineException
	 */
	private boolean addMapVariable( QueryDefinitions queryDefinitions, Query query, String varXPath, Vector variableNames )
		throws QueryEngineException, ConfigurationException
	{
		boolean bAdded = false;
		//create fields for the variables and add to the query
		Iterator itVariableNames = variableNames.iterator();
		
		while ( itVariableNames.hasNext() ) {
			String name = (String)itVariableNames.next();
			name= name.toUpperCase();
			
			// validate variable name
			Matcher fieldNameParts = s_tableFieldPattern.matcher(name);
			boolean bMatched = false;
			while (fieldNameParts.find()) {
				bMatched = true;
				String tableAlias = fieldNameParts.group(1);
				String property = fieldNameParts.group(2);
                
				Table table = query.getTable( tableAlias );
				if ( table == null ) {
					m_errorHandler.raiseError("Map variable '${"+name+"}' means that pivot node '"+query.getPivotNode()+"' needs to use table '"+tableAlias+"'");
				}
				else {
			        // create the field
					Field newField = new Field();
					newField.setName(name);
					newField.setXpath(varXPath);
					newField.setModifiable(true);
					newField.setSelectable(true);
					
					table.addField(newField);
					bAdded = true;
					
					// and add to local list of all table fields
                	addFieldToAllTablesFields(queryDefinitions, tableAlias,newField.getName());
				}
			}
        
			if ( bMatched == false ) {
				m_errorHandler.raiseError("Map defines variable '${"+name+"}' which should be of the form <table name>.<field name>");
			}
		}
		
		return bAdded;
	}
	/**
	 * Recurses over the mapping XML and populates a map with any variables found.
	 * The mapping is variable xpath to a list of variables which have that xpath.
	 * 
	 * @param variables
	 * @param currentXPath
	 * @param mapNode
	 * @throws QueryEngineException
	 */
	private void extractMapVariables( Map variables, String currentXPath, Object mapNode )
		throws QueryEngineException
	{
		if ( mapNode == null ) return;

		if (mapNode instanceof CDATA) {
			extractMapVariable(variables, currentXPath, ((CDATA) mapNode).getText());
        } 
		else if (mapNode instanceof Text) {
			extractMapVariable(variables, currentXPath, ((Text) mapNode).getText());
        } 
		else if (mapNode instanceof Element) {
            Iterator attributes = ((Element) mapNode).getAttributes().iterator();
            while (attributes.hasNext()) {
                Attribute attribute = (Attribute) attributes.next();
                extractMapVariable(variables, currentXPath + "/@" + attribute.getName(), attribute.getValue());
            }
            List tList = ((Element) mapNode).getContent(s_mappingContentFilter);
            Iterator i = tList.iterator();
            while (i.hasNext()) {
                String newPath = currentXPath;
                Object next = i.next();
                if (next instanceof Element) {
                    newPath += "/" + ((Element) next).getName();
                }
                
                extractMapVariables(variables, newPath, next);
            }
        }
    }

	/**
	 * Detects whether the given piece of text extracted from the mapping is a variable for
	 * use in querying. If so it adds it to the varaible mapping being built up.
	 * 
	 * @param variables
	 * @param path
	 * @param text
	 */
    private void extractMapVariable(Map variables, String path, String text) {
        Matcher matcher = s_variablePattern.matcher(text);
        while (matcher.find()) {
            String varName = matcher.group(1).toUpperCase();
            
            if ( variables.containsKey(path) == true ) {
            	Vector existingVariables = (Vector)variables.get(path);
            	existingVariables.add( varName );
            }
            else {
            	Vector newVariables = new Vector();
            	newVariables.add(varName);
            	variables.put( path, newVariables );
            }
        }
    }
    
    /**
     * Adds a new field to the list of all tables with all their fields.
     * 
     * @param sFieldId
     */
    private void addFieldToAllTablesFields(QueryDefinitions queryDefinitions, String tableAlias, String fieldName)
    {
    	// should have validated by now so just get on with it
    	Table table = queryDefinitions.getTable(tableAlias);
    	if ( table != null && table.getField(fieldName) == null ) 
    	{
    		Field newField = new Field();
        	newField.setName(fieldName);
        	table.addField(newField);
    	}
    }
    
    /**
     * Validates the tables and fields against database metadata.
     * 
     * @param queryDefinitions
     * @throws QueryEngineException
     */
    private void validateAgainstDatabase(QueryDefinitions queryDefinitions)
    	throws QueryEngineException, SQLException, ConfigurationException
	{
    	if (m_preloadCache == null) {
    		m_errorHandler.raiseWarning("Unable to validate against database because no project preload cache provided");
    		return;
    	}
    	
    	if ( queryDefinitions.getDataSourceLookupId() == null ) {
    		m_errorHandler.raiseWarning("Unable to validate against database because no DataSource provided");
    		return;
    	}
    	
    	DataSource dataSource = (DataSource)m_preloadCache.get(queryDefinitions.getDataSourceLookupId());
    	if (dataSource == null) {
    		m_errorHandler.raiseWarning("Unable to validate against database because preload cache does not contain item '"+queryDefinitions.getDataSourceLookupId()+"'");
    		return;
    	}
    	
    	// Get schema from project level config info.
    	String validationSchemakey = "validation:schema";
    	String schema=(String)m_preloadCache.get(validationSchemakey);
    	if (schema == null || schema.length() == 0) {
    		m_errorHandler.raiseWarning("Unable to validate against database because preload cache does not contain item '"+validationSchemakey+"'");
    		return;
    	}
    	  
        // get database metadata
        String[] tableTypes = new String[1];
        tableTypes[0] = "TABLE";
        
        Connection conn = null;
        ResultSet resultSetDatabaseMetaDataTables = null;
        ResultSet resultSetDatabaseMetaDataColumns = null;
        
        m_errorHandler.raiseMessage("Validating against database schema '"+schema+"'");
        
        try {
        	conn = dataSource.getConnection();	
        	DatabaseMetaData metadata = conn.getMetaData();
        	
        	// look for the tables we want
        	Iterator tablesIterator = queryDefinitions.m_tables.values().iterator();
        	while( tablesIterator.hasNext() )
        	{
        		Table table = (Table)tablesIterator.next();
	        	resultSetDatabaseMetaDataTables = metadata.getTables(null,schema,table.getName(),tableTypes);
	        	
	        	if (resultSetDatabaseMetaDataTables.next() != false) {
	        		// now look for the columns we use. Only get the metadata if not already fetched
	        		// (relevant when running this method having just applied new query extensions)
	        		Iterator fieldsIterator = table.getFields().values().iterator();
	        		while( fieldsIterator.hasNext() )
	        		{
	        			Field field = (Field)fieldsIterator.next();
	        			if ( field.getMetadataType() == Field.UNKNOWN_TYPE ) {
		        			String fullFieldName = field.getName();
		        			
		        			// Field name is of form <table alias>.<field name>
		        			// Previous validation code has ensured this is the case.
		        			String[] nameParts = fullFieldName.split("\\.");
		        			String fieldName = nameParts[1];
	
		        			resultSetDatabaseMetaDataColumns = metadata.getColumns(null, schema, table.getName(), fieldName);
		        			
		        			if ( resultSetDatabaseMetaDataColumns.next() == false ) {
		        				m_errorHandler.raiseError("The database table '"+table.getName()+"' in the schema '"+schema+"' does not have the required column: "+fieldName);
		        			}
		        			else {
		        				// store the metadata info against the field
		        				field.setMetadataType(resultSetDatabaseMetaDataColumns.getInt(5));
		        			}
							resultSetDatabaseMetaDataColumns.close();
	        			}
					}
	        	}
	        	else {
	        		m_errorHandler.raiseError("The following required table does not exist in the database schema '"+schema+"': "+table.getName());
	        	}
	        	
	        	resultSetDatabaseMetaDataTables.close();
        	}
        	conn.close();
        }
        finally {
        	if ( resultSetDatabaseMetaDataTables != null ) resultSetDatabaseMetaDataTables.close();
        	if ( resultSetDatabaseMetaDataColumns != null ) resultSetDatabaseMetaDataColumns.close();
        	if ( conn != null ) conn.close();
        }
	}

    /**
     * Makes sure that all properties (<table>.<field>) needed by a query will be available from
     * preceeding pivot nodes.
     * 
     * @param queryDefinitions
     */
    private void satisfyDependentQueries(QueryDefinitions queryDefinitions)
    	throws QueryEngineException, ConfigurationException
    {
        Iterator queries = queryDefinitions.getTopQueries();
        while ( queries.hasNext() ) {
        	QueryHandle handle = (QueryHandle)queries.next();
        	Query query = handle.getQuery();
        	
        	SatisfyDependentQueriesVisitor visitor = new SatisfyDependentQueriesVisitor(queryDefinitions);
    		query.accept(visitor);
    		
    		if ( visitor.hasUndefinedFields() ) {
    			Map undefinedFields = visitor.getUndefinedFields();
    			
    			Set entries = undefinedFields.entrySet();
    			Iterator itEntries = entries.iterator();
    			while (itEntries.hasNext()) {
    				Map.Entry entry = (Map.Entry)itEntries.next();
    				String tableAlias = (String)entry.getKey();
    				boolean bFirst = true;
    				Iterator fields = ((Set)entry.getValue()).iterator();
    				while (fields.hasNext()) {
    					SatisfyDependentQueriesVisitor.UndefinedField field = 
    						(SatisfyDependentQueriesVisitor.UndefinedField)fields.next();
							
    					String pivotNode = field.getSource().getPivotNode();
    					String queryType = "Query";
    					String fullFieldName = tableAlias + "." + field.getName();
						if ( field.getSource() instanceof QueryExtension) {
							queryType = "QueryExtension";
						}
						
    					m_errorHandler.raiseError( "Field '" + fullFieldName + "' is unsatisfied for "+queryType+" with pivot '"+pivotNode+"'");
    				}
    			}
    		}
    	}
    }
    

    /**
     * Uses the passed XML elements to create and return a list of valid query extensions.
     * These are Query objects holding the extension info.
     * Note: This does not have to be called after a QueryDefParser.parse call. It should
     * work independently.
     * 
     * @param queryExtensionElements
     * @return
     */
    public void extendQueryDefinitions(List queryExtensionElements, List tableElements, QueryDefinitions queryDefinitions, Map preloadCache )
    	throws QueryEngineException, ConfigurationException
    {
		if ( m_errorHandler == null ) {
			throw new QueryEngineException("QueryDefParser requires a QueryEngineErrorHandler");
		}
		m_errorHandler.raiseMessage("Parsing query extensions...");
		m_preloadCache = preloadCache;
			
    	// a map of pivot node to extended query:
    	Map queryExtensions = new TreeMap();
    	
    	// create a local copy of all tables in the query definitions  - this is then 
    	// manipulated in order to achieve validation
    	/*m_tablesAllFields = new TreeMap();
    	Iterator tablesIterator = queryDefinitions.m_tables.values().iterator();
    	while( tablesIterator.hasNext() ) { 
			Table table = (Table)tablesIterator.next();
			Table copy = new Table();
			copy.setAlias(table.getAlias());
			copy.setName(table.getName());
			m_tablesAllFields.put(copy.getAlias(), copy);
    	}
    	*/
    	
    	//extract tables into local variables and pass them to parseQueryExtension method
    	Map newTables = new TreeMap();
    	if(tableElements != null) {
	    	Iterator tablesIterator = tableElements.iterator();
	    	while(tablesIterator.hasNext()) {
	    		Element table = (Element) tablesIterator.next();
	    		if(table != null) {
	    			String name = table.getAttributeValue("name");
	    			String alias = table.getAttributeValue("alias");
	    			
	    			Table newTable = new Table();
	    			newTable.setAlias(alias.toUpperCase());
	    			newTable.setName(name.toUpperCase());
	    			newTables.put(newTable.getAlias(), newTable);
	    		}
	    	}
    	}
    	
    	// loop over all extensions
    	Iterator extensionsIterator = queryExtensionElements.iterator();
    	while( extensionsIterator.hasNext() )
    	{
    		Element eQuery = (Element)extensionsIterator.next();
    		if ( eQuery != null ){
    			// parse and validate the extension
    			QueryExtension extension = parseQueryExtension(eQuery, queryDefinitions, newTables);
    				
    			// check that we have not already extended the pivot.
    			if ( extension != null ) {
    				if ( queryExtensions.containsKey(extension.getPivotNode()) ) {
    					m_errorHandler.raiseError("The query for pivot node '"+extension.getPivotNode()+"' has already been extended");
    				}
    				else {
    					// finally add the new valid extension to the map of extensions
    					queryExtensions.put(extension.getPivotNode(), extension);
    				}
    			}
    		}
    	}
    	
    	// now extend the query defs and look for unsatisfied dependent variables
    	queryDefinitions.extend(queryExtensions.values());
    	satisfyDependentQueries(queryDefinitions);
		
		// Finally validate the tables and fields against database metadata
		try {
			validateAgainstDatabase(queryDefinitions);
		}
        catch (SQLException e) {
        	throw new QueryEngineException(e);
        }
    }
    
    /**
     * Parses the XML for a single query extension and returns an extension object if valid.
     * 
     * @param eQuery
     * @param queryDefinitions
     * @return
     */
    private QueryExtension parseQueryExtension(Element eExtension, QueryDefinitions queryDefinitions, Map tables)
    	throws QueryEngineException, ConfigurationException
    {
    	QueryExtension extension = null;
    	
    	// first check that a pivot is provided
		String pivotNode = eExtension.getAttributeValue("pivotNode");
		
		if ( pivotNode == null || pivotNode.length() == 0 ) {
			m_errorHandler.raiseError("'pivotNode' attribute required by QueryExtension element");
		}
		else {
			if ( pivotNode.length() == 0 ) {
				m_errorHandler.raiseError("'pivotNode' required by QueryExtension element");
			}
			
			// check that the pivot being extended does exist in query def
			QueryHandle baseQueryHandle = queryDefinitions.getQuery(pivotNode, true);
			if ( baseQueryHandle == null ) {
				m_errorHandler.raiseError("QueryExtension for pivot '"+pivotNode+"' does not extend an existing Query");
			}
			else {
				// it is simplest to create a copy of the base query because all of the following can 
				// be updated by an extension (also makes it easier to reuse existing validation code):
				// - Join
				// - Constraints
				// - Parameters for constraints
				// - New and updated fields
				// - CheckExists, new and references to (updated) fields.
				
				Query base = baseQueryHandle.getQuery();
				extension = new QueryExtension(base);
				
				setSelectDistinct(extension, eExtension);
				setPageController(extension, eExtension);
				parseQueryExtensionTables(eExtension, queryDefinitions, extension, tables);
				parseQueryExtensionJoin(eExtension, queryDefinitions, extension);
				parseQueryExtensionParameters(eExtension, extension);
				parseQueryExtensionConstraints(eExtension, queryDefinitions, extension);
				parseQueryExtensionFields(queryDefinitions, eExtension, extension);
				parseQueryExtensionExistenceChecks(queryDefinitions, eExtension, extension);
			}
		}
    	return extension;
    }
    
    /**
     * Parses and validates tables added to the query through a query extension.
     * 
     * @param eExtension
     * @param queryDefinitions
     * @param query
     * @param tables
     * @throws QueryEngineException
     */
    private void parseQueryExtensionTables(Element eExtension, QueryDefinitions queryDefinitions, Query query, Map tables) 
    	throws QueryEngineException, ConfigurationException 
	{
    	String tablesString = eExtension.getAttributeValue("tables");
    	if(tablesString != null) {
    		String[] arrTables = tablesString.split(" ");
    	       
    		for ( int i = 0 ; i < arrTables.length; i++ ) {
    			Table table = queryDefinitions.getTable(arrTables[i]);
    	        if(table == null) {
    	        	table = (Table) tables.get(arrTables[i].toUpperCase());
    	        	if(table == null) {
    	        		m_errorHandler.raiseError("Query extension for pivot '" + query.getPivotNode() + "' refers to undefined table: " + arrTables[i]);
    	        	}
    	        }
    	        else {
    	        	Table newTable = new Table(table);
    	           	query.addTable(newTable);
    	        }
    		}
    	}
    }
    
    /**
     * Parses and validates the QueryExtension override Join.
     * 
     * @param eExtension
     * @param queryDefinitions
     * @param extension
     * @throws QueryEngineException
     */
    private void parseQueryExtensionJoin(Element eExtension, QueryDefinitions queryDefinitions, Query extension)
    	throws QueryEngineException, ConfigurationException
    {
    	String pivotNode = extension.getPivotNode();
    	
    	List lJoins = eExtension.getChildren("Join");
		if ( lJoins.size() > 0 ) {
			if ( lJoins.size() > 1 )
				m_errorHandler.raiseError("QueryExtension for pivot '"+pivotNode+"' has more than one 'Join' override");
			else {
				String sJoin = ((Element)lJoins.get(0)).getValue();
				validateJoin(queryDefinitions, extension, sJoin);
				Join newJoin = new Join();
				newJoin.setJoinClause(sJoin);
				extension.setJoin(newJoin);
				
				// see if there probably ought to be a join	
				if ( ( sJoin == null || sJoin.length() == 0) && extension.getTables().size() > 1 ) {
					m_errorHandler.raiseWarning("A join may be needed by QueryExtension for pivot '"+pivotNode+"' because the base Query uses more than 1 table");
				}
			}
		}
    }
    
    /**
     * Parses and validates input parameters for use by constraints.
     * 
     * @param eExtension
     */
    private void parseQueryExtensionParameters(Element eExtension, Query extension)
    	throws QueryEngineException, ConfigurationException
	{
    	String pivotNode = extension.getPivotNode();
    	
    	List lParams = eExtension.getChildren("Param");
    	Iterator paramsIterator = lParams.iterator();
    	while( paramsIterator.hasNext() ) {
    		Element eParam = (Element)paramsIterator.next();
    		Attribute nameAttr = eParam.getAttribute("name");
    		Attribute xpathAttr = eParam.getAttribute("xpath");
    		String name = null;
    		String xpath = null;
    		boolean bValidName = false;
    		boolean bValidXpath = false;
    		
    		// validate the name
    		if ( nameAttr == null )
    			m_errorHandler.raiseError("'Param' element for QueryExtension on pivot '"+pivotNode+"' needs a 'name' attribute");
    		else {
    			name = nameAttr.getValue();
    			if ( name == null || name.length() == 0) {
    				m_errorHandler.raiseError("Attribute 'name' on 'Param' element for QueryExtension '"+pivotNode+"' needs a value");
    			}
    			else {
    				bValidName = true;
    			}
    		}
    		
    		// validate the xpath
    		if ( xpathAttr == null)
    			m_errorHandler.raiseError("'Param' element for QueryExtension on pivot '"+pivotNode+"' needs an 'xpath' attribute");
    		else {
    			xpath = xpathAttr.getValue();
    			if ( xpath == null || xpath.length() == 0) {
    				m_errorHandler.raiseError("Attribute 'xpath' on 'Param' element for QueryExtension '"+pivotNode+"' needs a value");
    			}
    			else
    				bValidXpath = true;
    		}
    		
    		// only create the param if both name and attribute are valid
    		if ( bValidName && bValidXpath) {
    			// TODO is param a field? Or something else? (Need to store xpath but also need to make sure
    			// satisfy dependent queries will work).
    			extension.addParameter(name);
    		}
    	}
	}
    
    /**
     * Parses and validates any constraints.
     * 
     * @param eExtension
     * @param queryDefinitions
     * @param extension
     */
    private void parseQueryExtensionConstraints(Element eExtension, QueryDefinitions queryDefinitions, Query extension)
    	throws QueryEngineException, ConfigurationException
    {
    	String pivotNode = extension.getPivotNode();
    	
    	// an extension constraint must refer to a db field or a previously defined param
    	List lConstraints = eExtension.getChildren("Constraint");
    	Iterator constraintsIterator = lConstraints.iterator();
    	while ( constraintsIterator.hasNext() ) {
    		Element eConstraint = (Element)constraintsIterator.next();

    		// first see if a dynaimc sql generator is specified
    		boolean bHasGenerator = false;
    		String generatorClass = eConstraint.getAttributeValue("generator");
    		if (generatorClass != null && generatorClass.length() > 0) {
    			bHasGenerator = true;
    		}
    			
			// if not, then look for a clause
			if ( bHasGenerator == false ) {
				String constraint = eConstraint.getValue();
	    		if ( constraint == null || constraint.length() == 0 ) {
	    			m_errorHandler.raiseError("'Constraint' element for pivot '"+pivotNode+"' needs a value");
	    		}
	    		else {
	    			// validate the value
	    			Matcher matcher = s_variablePattern.matcher(constraint);
	    	        while (matcher.find()) {
	    	            String varName = matcher.group(1);
	    	            
	    	            if ( !extension.getParameters().contains(varName) ) {
	    	            	// it is not a parameter, so see if it is a db field
	    	            	boolean bMatched = validateJoinVariable(queryDefinitions, extension, varName, true);
	    	            	if ( bMatched == false ) {
	    	            		m_errorHandler.raiseError("'Constraint' for QueryExtension '"+pivotNode+"' uses a variable which refers to neither a parameter or table");
	    	            	}
	    	            }
	    	        }
	    	        
	    	        Constraint newConstraint = new Constraint();
	    	        newConstraint.setConstraintClause(constraint);
	    	        extension.addConstraint(newConstraint);
	    		}
			}

    	}
    }
    
    /**
     * Parses and validates modify fields for query extension.
     * 
     * @param queryDefinitions
     * @param eExtension
     * @param extension
     * @throws QueryEngineException
     */
    private void parseQueryExtensionFields(QueryDefinitions queryDefinitions, Element eExtension, Query extension)
    	throws QueryEngineException, ConfigurationException
    {
    	String pivotNode = extension.getPivotNode();
    	
    	List lFields = eExtension.getChildren("Field");
    	if ( lFields.size() > 0 && extension.isModifiable() == false) {
    		m_errorHandler.raiseWarning("Query for pivot '"+pivotNode+"' is not modifiable. 'Field' elements on QueryExtension will be ignored");
    	}
    	else {
    		createFields(lFields, queryDefinitions, extension, eExtension);
    	}
    }
    
    /**
     * Parses and validates modify existence checks for query extension.
     * 
     * @param queryDefinitions
     * @param eExtension
     * @param base
     * @param extension
     * @throws QueryEngineException
     */
    private void parseQueryExtensionExistenceChecks(QueryDefinitions queryDefinitions, Element eExtension, Query extension)
		throws QueryEngineException, ConfigurationException
	{
    	String pivotNode = extension.getPivotNode();
    	
    	List lExistenceChecks = eExtension.getChildren("CheckExists");
    	if ( lExistenceChecks.size() > 0 && extension.isModifiable() == false) {
    		m_errorHandler.raiseWarning("Query for pivot '"+pivotNode+"' is not modifiable. 'CheckExists' elements on QueryExtension will be ignored");
    	}
    	else {
    		createExistenceChecks(lExistenceChecks, extension, eExtension);
    	}
	}
	
}
