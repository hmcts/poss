package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Matcher;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Holds the information describing the query template.
 * 
 * @author Howard Henson
 */
public class QueryDefinitions {
	
    private static final Log log = SUPSLogFactory.getLogger(QueryDefinitions.class);

    protected Element m_templateElement;
    protected Map m_tables;
    protected Map m_aliases;
    protected Map m_queries;
    protected DataSource m_dataSource;
    protected Map m_topQueries = null; // these are the root queries
	protected List m_topQueriesOrdered = null;
	
    public QueryDefinitions() {}
    
    // Copy constructor
    public QueryDefinitions( QueryDefinitions queryDefns )
    {
    	// some things are not altered so shallow copy these:
    	m_templateElement = queryDefns.m_templateElement;
    	m_aliases = queryDefns.m_aliases;
    	m_dataSource = queryDefns.m_dataSource;
    	
    	// copy the tables
    	m_tables = new TreeMap();
    	Iterator tableIterator = queryDefns.m_tables.entrySet().iterator();
    	while(tableIterator.hasNext()) {
    		Map.Entry entry = (Map.Entry) tableIterator.next();
    		m_tables.put(entry.getKey(), new Table((Table) entry.getValue()));
    	}
    	
    	//make copies of the queries
    	m_queries = new TreeMap();
    	
    	Iterator it = queryDefns.m_queries.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_queries.put( new String((String)entry.getKey()), new Query((Query)entry.getValue(), this) );
    	}
    	
    	m_topQueries = new TreeMap();
    	it = queryDefns.m_topQueries.keySet().iterator();
    	while( it.hasNext() ) {
    		String pivotNode = (String)it.next();
    		m_topQueries.put( new String(pivotNode), m_queries.get(pivotNode) );
    	}
    	
    	m_topQueriesOrdered = new LinkedList();
    	it = queryDefns.m_topQueriesOrdered.iterator();
    	while( it.hasNext() ) {
    		String pivotNode = ((Query)it.next()).getPivotNode();
    		m_topQueriesOrdered.add( m_queries.get(pivotNode) );
    	}
    	
    	// now make sure the copied queries can find their children
    	it = m_queries.values().iterator();
    	while( it.hasNext() ){
    		Query query = (Query)it.next();
    		query.resolveSubQueries();
    	}
    }
    
    /**
     * Creates the query definitions using the specified XML file.
     * 
     * @param sFileLocation
     * @throws BusinessException
     */
    public void initialise(String sFileLocation, Map preloadCache) throws SystemException
    {
        if (sFileLocation != null) 
        {
            // Load the QueryDefs file into a JDOM
            InputSource in = Util.getInputSource(sFileLocation, this);
            Document tDoc = null;
            SAXBuilder saxBuilder = new SAXBuilder();
            
            try {
                tDoc = saxBuilder.build(in);
            }
            catch(IOException e) {
                throw new SystemException("Failed to process query definition file '"+sFileLocation+"': "+e.getMessage(),e);
            }
            catch(JDOMException e) {
                throw new ConfigurationException("Failed to build JDOM for query definition file '"+sFileLocation+"': "+e.getMessage(),e);
            }
            
            Element queryDefElement = tDoc.getRootElement();
            if (!"QueryDef".equals(queryDefElement.getName())) {
                throw new ConfigurationException("Query Definition file '" + sFileLocation + "' does not have root element 'QueryDef'");
            }
            
            m_templateElement = queryDefElement;
            
            // Add the contents of the specified MapDef file to the QueryDefs JDOM
            loadDBMapDef();
            
            // Create DB connection
            Element eDataSource = null;
            try {
                eDataSource = (Element)XPath.selectSingleNode(m_templateElement, "./DBMapDef/DataSource");
            }
            catch (JDOMException e) {
                throw new SystemException("Failed to find node './DBMapDef/DataSource' in query definition file '"+sFileLocation+"': "+e.getMessage(),e);
            }
            
            String sLookupId = eDataSource.getAttributeValue("id");
            if ( sLookupId == null ) {
                throw new ConfigurationException("No './DBMapDef/DataSource' value in query definition file '"+sFileLocation+"'");
            }
            
            m_dataSource = (DataSource)preloadCache.get(sLookupId);
            
            if ( m_dataSource == null ) {
                throw new SystemException("Failed to find data source with lookup id='"+sLookupId+"' as referenced in file '"+sFileLocation+"'");
            }
        }
    }
    
    public void extract(Connection connection) throws SystemException {
        
        // Create the queries specified by the QueryDefs
        extractTables();
        extractQueries();
       
    }
    
    /**
     * Loads and inserts the contents of the MapDef file into the QueryDefs JDOM.
     * 
     * @throws BusinessException
     */
    private void loadDBMapDef() throws SystemException
	{
        Element dBMapDef = null;
        try {
        	dBMapDef = (Element) XPath.selectSingleNode(m_templateElement, "DBMapDef");
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to find 'DBMapDef' element in query definitions file: "+e.getMessage(),e);
        }
        
        Attribute location = dBMapDef.getAttribute("location");
        if (location != null) {
        	String mapFilename = location.getValue();
            InputSource in = Util.getInputSource(mapFilename, this);
            SAXBuilder saxBuilder = new SAXBuilder();
	        
            Document doc = null;
            try {
            	doc = saxBuilder.build(in);
            }
            catch(IOException e) {
            	throw new SystemException("Unable to load map file '"+mapFilename+"': "+e.getMessage(),e);
            }
            catch(JDOMException e) {
            	throw new ConfigurationException("Unable to process map file '"+mapFilename+"': "+e.getMessage(),e);
            }
            
            Element element = doc.getRootElement();
            if (!"DBMapDef".equals(element.getName())) {
                throw new ConfigurationException("Unable to find root element 'DBMapDef' in map file '"+mapFilename+"'");
            }
            Element parent = (Element) dBMapDef.getParent();
            dBMapDef.detach();
            element.detach();
            parent.addContent(element);
        }
    }
    

    /**
     * Creates the queries specified in the QueryDefs XML configuration.
     * 
     * @throws SystemException
     */
    private void extractQueries() throws SystemException
	{
        m_queries = new TreeMap();
        m_topQueries = new TreeMap();
        m_topQueriesOrdered = new LinkedList();
        
        Iterator queries = null;
        try {
        	queries = XPath.selectNodes(m_templateElement, "Query").iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to find element 'Query' in query definition file: "+e.getMessage(),e);
        }
        
        List queryList = new ArrayList(10);
        while (queries.hasNext()) {
            Query query = new Query((Element) queries.next(), this);
            queryList.add(query);
            addQuery(query);
        }
//        buildQueryTree(queryList);
    }
//    
//    /**
//     * Build the tree of Query parent/child relationships.
//     * All queries are added to m_queries, and queries without a parent
//     * are also added to m_topQueries and m_topQueriesOrdered in document order.
//     * 
//     * @param queries the list of queries in document order
//     */
//    private void buildQueryTree(List queries) {
//        // The Query s can be in any order in the querydef document,
//        // and this is their order in queries arg.
//        // m_topQueriesOrdered is in document order.
//        // On the other hand the parent/child relationships are
//        // determined by their pivotNodes, not by the document ordering.
//        // To enable this we first sort the queries by ascending pivot node length
//        // - that guarantees that children follow their parent
//        
//        int queriesCount = queries.size();
//        Query[] orderedQueries = new Query[queriesCount];
//        String[] orderedPivotNodes = new String[queriesCount];
//        for (int i = 0; i < queriesCount; i++) {
//            Query q = (Query)queries.get(i);
//            String pivotNode = q.getPivotNode();
//            
//            // sort into correct place according to pivot node length:
//            int j = i;
//            for (; j > 0 && pivotNode.length() < orderedPivotNodes[j-1].length(); j--) {
//                orderedQueries[j] = orderedQueries[j-1];
//                orderedPivotNodes[j] = orderedPivotNodes[j-1];
//            }
//            orderedQueries[j] = q;
//            // prevent match on partial tag names:
//            if (pivotNode.charAt(pivotNode.length()-1) != '/') {
//                pivotNode += "/";
//            }
//            orderedPivotNodes[j] = pivotNode;
//        }
//        
//        // now find the parent of each query, by walking back through the
//        // pivot nodes to find first match.
//        // Do this in queries (document) order so that topQueriesOrdered is in the right order
//        for (int i = 0; i < queries.size(); i++) {
//            Query q = (Query)queries.get(i);
//            String pivotNode = q.getPivotNode();
//            
//            // add to the instance query map:
//            m_queries.put(pivotNode, q);
//            Query parent = null;
//            for (int j = queriesCount - 1; j >= 0; j--) {
//                if (pivotNode.startsWith(orderedPivotNodes[j]) && orderedQueries[j] != q) {
//                    // first match is the best match:
//                    parent = orderedQueries[j];
//                    break;
//                }
//            }
//            if (parent != null) {
//                // add to parent:
//                parent.addSubQuery(q);
//                if (log.isDebugEnabled()) {
//                    log.debug("Query:" + pivotNode
//                        + "\nParent:" + parent.getPivotNode());
//                }
//            }
//            else {
//                // no parent so its a top query:
//                m_topQueries.put( pivotNode, q);
//                m_topQueriesOrdered.add(q);
//                if (log.isDebugEnabled()) {
//                    log.debug("Top query:" + pivotNode);
//                }
//            }
//        }
//    }

    /**
     * Creates tables from the XML configuration..
     * 
     * @throws SystemException
     */
    private void extractTables() throws SystemException {
        m_tables = new HashMap();
        m_aliases = new HashMap();
        //Extract all tables
        Iterator tables = null;
        try {
        	tables = XPath.selectNodes(m_templateElement, "//Table").iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to find any 'Table' elements in querying configuration: "+e.getMessage(),e);
        }
        
        while (tables.hasNext()) {
            Element table = (Element) tables.next();
            addTable(table);
        }
    }
    
    public void addTable(Element table) {
    	String name = table.getAttributeValue("name");
        String alias = table.getAttributeValue("alias");

        m_tables.put(alias, new Table(name.toUpperCase(), alias.toUpperCase()));
        m_aliases.put(table, alias);
    }

    /**
     * Identifies parent child relationships within queries and ensures that a
     * parent queries contain sufficient information in order to statify query
     * dependencies identified in the query.
     * 
     * @throws SystemException
     */
    protected void satisfyDependentQueryProperties() throws SystemException
	{
    	List queries = new ArrayList(m_queries.keySet() );
        if (queries.size() == 0) {
            log.debug("No queries detected!");
            return;
        }
        Iterator i = queries.iterator();
        while (i.hasNext()) {
            Query query = (Query) m_queries.get(i.next());
            query.prepareParameters();
        }
        satisfyDependentQueryProperties(queries);
	}
    
    private void satisfyDependentQueryProperties(List queries) throws SystemException
	{    
        UnsatisfiedQueries unsatisfiedQueries = new UnsatisfiedQueries();
        String currentPivot = (String) queries.remove(queries.size() - 1);
        unsatisfiedQueries.extractUnstatisfiedQueries(currentPivot);
        boolean mustRemove = true;
        for (int c = queries.size() - 1; c >= 0; c--) {
            String pivotNode = (String) queries.get(c);
            if(log.isDebugEnabled()) {
            	log.debug("Processing: " + currentPivot + " against " + pivotNode
            			+ " with dependencies " + unsatisfiedQueries.toString());
            }
            if (currentPivot.startsWith(pivotNode)) {
                //pivotNode must be a parent
                Query query = (Query) m_queries.get(pivotNode);
	            Iterator i = unsatisfiedQueries.getUnstatisfiedAliases();
	            while (i.hasNext()) {
	            	String alias = (String) i.next();
	                if (query.hasTable(alias)) {
	                	if(query.getSelectStatement() == null) {
	                		// if the query uses a generated select statement, then add the dependent variables to the select list
	                    	Iterator parms = unsatisfiedQueries.getUnsatisfiedPropertiesForAlias(alias);
	                    	while (parms.hasNext()) {
	                    		String parameter = (String) parms.next();
	                    		query.addSelectParameter(alias + "." + parameter);
	                    		if(log.isDebugEnabled()) {
	                    			log.debug("Adding " + alias + "." + parameter + " to query: " + query.getPivotNode());
	                    		}
	                    	}
	                    }
	                    i.remove();
	                    if(log.isDebugEnabled()) {
		                    log.debug("Satisfied aliases: " + alias);
		                    log.debug("Outstanding unsatisfied aliases: " + unsatisfiedQueries.toString());
	                    }
	                }
	            }
                currentPivot = pivotNode;
                unsatisfiedQueries.extractUnstatisfiedQueries(pivotNode);
            } 
            else {
                mustRemove = false;
            }
            if (mustRemove) {
                if(log.isDebugEnabled()){
                    log.debug("Removing element: " + pivotNode);
                }

                queries.remove(c);
            }
        }
        if (unsatisfiedQueries.hasUnsatisfiedProperties()) {
            log.error("Unsatisfied properties in query: " + currentPivot + " " + unsatisfiedQueries.toString());
            throw new ConfigurationException("Unsatisfied properties in query: " + currentPivot + " " + unsatisfiedQueries.toString());
        }
        if (!queries.isEmpty()) {
            satisfyDependentQueryProperties(queries);
        }
    }

    private class UnsatisfiedQueries {
        Map m_unsatisfied = new HashMap();

        public void extractUnstatisfiedQueries(String pivotNode) {
            Query query = (Query) m_queries.get(pivotNode);
            Iterator i = query.getDependentProperties();
            while (i.hasNext()) {
                String property = (String) i.next();
                Matcher pMatch = Query.s_varContentPattern.matcher(property);
                while (pMatch.find()) {
                    Set pSet = (Set) m_unsatisfied.get(pMatch.group(1));
                    if (pSet == null) {
                        pSet = new HashSet();
                        m_unsatisfied.put(pMatch.group(1), pSet);
                    }
                    pSet.add(pMatch.group(2));
                }
            }
        }

        public Iterator getUnstatisfiedAliases() {
            return m_unsatisfied.keySet().iterator();
        }

        public Iterator getUnsatisfiedPropertiesForAlias(String alias) {
            Set set = (Set) m_unsatisfied.get(alias);
            if (set == null) {
                return new HashSet().iterator();
            } else {
                return set.iterator();
            }
        }

        public void removeAlias(String alias) {
            m_unsatisfied.remove(alias);
        }

        public boolean hasUnsatisfiedProperties() {
            return !m_unsatisfied.isEmpty();
        }

        public String toString() {
            return m_unsatisfied.toString();
        }
    }
    
    /*
     * End of Initialisation methods 
     * 
     */
    
    /**
     * Prepares the queries using information from the passed connection.
     * 
     * @param connection
     * @throws SystemException
     */
    public void prepare(Connection connection) throws SystemException
    {
    	Iterator queriesItr = m_queries.values().iterator();
        while (queriesItr.hasNext()) {
            Query query = (Query) queriesItr.next();          
            query.prepareTypes(connection);
        }
    }

    public Table getTableForAlias(String alias) {
        return (Table) m_tables.get(alias);
    }

    public String getAliasForTableName(String table) {
        return (String) m_aliases.get(table);
    }


    /**
     * Provides an iterator of queries elements that are defined within this
     * query definition object.
     * 
     * @return
     */
    public Iterator getQueries() {
        return m_queries.values().iterator();
    }

    public DataSource getConnectionPool()
    {
    	return m_dataSource;
    }
    
    /**
     * Return the queries in processing order (which is the order they appeared in 
     * in the query def file.
     * 
     * @return
     */
    public Collection getTopQueries()
    {
    	// get the top queries in querying order
    	return m_topQueriesOrdered;
    }
    
    /**
     * Adds a top query
     * @param newQuery
     */
    private void addTopQuery(Query newQuery)
    {
    	m_topQueries.put( newQuery.getPivotNode(), newQuery);
        m_topQueriesOrdered.add(newQuery);
    }
    
	/**
	 * Adds a new query to the map of queries. The mapping is pivot node xpath to query object.
	 * It is up to 'addQuery' to set up any parent/child relationship between the queries.
	 * Note: there may be more than 1 top level pivot i.e. multiple query trees.
	 * 
	 * @param query
	 * @return whether or not this is a child query
	 */
	private boolean addQuery( Query newQuery )
	{
		boolean isChild = false;
		
		String newPivot = newQuery.getPivotNode();
		
		// determine whether this is a child of an existing Query.
		// This assumes that the pivot will be on an element rather than an attribute.		
		Iterator topEntries = m_topQueries.values().iterator();
		Query parent = findParentQuery(newPivot, topEntries );
		
		// having found the parent we now need to see whether the new pivot will act as a
		// parent to any existing child queries. If so, adopt them.
		Iterator possibleChildren = null;
		if ( parent == null )
			possibleChildren = m_topQueries.values().iterator(); 
		else {
			possibleChildren = parent.getSubQueries().iterator();
			isChild = true;
		}
		
		adoptChildren(newQuery, possibleChildren);
		
		//add the query to the map
		m_queries.put( newPivot, newQuery);
		
		if ( parent == null ) {
			addTopQuery(newQuery);
		}
		else {
			parent.addSubQuery( newQuery );
		}
		
		return isChild;
	}
	
	/**
	 * Helper method which recursively searches queries to see whether the passed xpath
	 * identifies an existing pivot node.
	 * 
	 * @param searchXPath
	 * @param existingQueries
	 * @return
	 */
	private Query findParentQuery(String searchXPath, Iterator existingQueries )
	{
		Query parent = null;
		
		boolean bFoundParent = false;
		while (existingQueries.hasNext() && bFoundParent != true )
		{
			Query exisitingQuery = (Query)existingQueries.next();
			String existingPivotXPath = exisitingQuery.getPivotNode();

			if ( searchXPath.startsWith(existingPivotXPath) )
			{
				// this means there is definitely a parent
				bFoundParent = true;
			
				// but a child query may provide a more specific parent
				Collection existingChildren = exisitingQuery.getSubQueries();
				Iterator childrenIterator = existingChildren.iterator();
				
				Query moreSpecificParent = findParentQuery(searchXPath, childrenIterator);
				
				if ( moreSpecificParent == null )
					parent = exisitingQuery;
				else
					parent = moreSpecificParent;
			}
		}
		
		return parent;
	}
	
	/**
	 * Helper method to make a new query adopt the children of any pre-existing child queries.
	 * 
	 * @param newParent
	 * @param children
	 */
	private void adoptChildren(Query newParent, Iterator possibleChildren)
	{
		String pivot = newParent.getPivotNode();
		while ( possibleChildren.hasNext() )
		{
			Query child = (Query)possibleChildren.next();
			String childPivot = child.getPivotNode();
			
			if ( childPivot.startsWith(pivot) ) 
			{
				newParent.addSubQuery(child);
				possibleChildren.remove();
			}
		}
	}
}