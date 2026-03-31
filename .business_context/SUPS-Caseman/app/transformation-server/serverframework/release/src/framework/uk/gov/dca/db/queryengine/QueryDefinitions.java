/*
 * Created on 22-Sep-2004
 *
 */
package uk.gov.dca.db.queryengine;

import uk.gov.dca.db.queryengine.syntax.*;
import org.jdom.Document;
import java.util.Map;
import java.util.TreeMap;
import java.util.Iterator;
import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;

/**
 * @author Grant Miller
 *
 */
public class QueryDefinitions {

	// The lookup id used to retrieve a java DataSource (refers to an item in 'project_config.xml':
	protected String m_dataSourceLookupId = null;
	// The mapping XML:
	protected Document m_mapping = null;
	// The tables extracted from config in map file and query def file.
	// Also used to store all referenced db fields and their metadata type.
	protected Map m_tables = new TreeMap();
	// The queries from the query def file:
	protected Map m_queries = new TreeMap();
	// The top level queries i.e. tree roots:
	protected Map m_topQueries = new TreeMap();
	// A list of the currently extended pivot nodes
	protected Set m_extendedPivots = null;
	
	/**
	 * Constructor
	 */
	public QueryDefinitions() {
		super();
	}

	/**
	 * Sets the mapping XML. Passed element is the one containing the mapping,
	 * not the first element of the mapping.
	 * 
	 * @param mapping
	 */
	public void setMapping( Document mapping )
	{
		m_mapping = mapping;
	}
	
	/**
	 * Returns the mapping XML.
	 * 
	 * @return
	 */
	public Document getMapping()
	{
		return m_mapping;
	}
	
	/**
	 * Sets the DataSource lookup id.
	 * 
	 * @param sId
	 */
	public void setDataSourceLookupId( String sId )
	{
		m_dataSourceLookupId = sId;
	}
	
	/**
	 * Gets the DataSource lookup id.
	 * 
	 * @param sId
	 */
	public String getDataSourceLookupId()
	{
		return m_dataSourceLookupId;
	}
	
	/**
	 * returns an iterator to the queries
	 * 
	 * @return
	 */
	public Iterator getTopQueries()
	{
		return m_topQueries.values().iterator();
	}

	/**
	 * Adds a new query to the map of queries. The mapping is pivot node xpath to query object.
	 * It is up to 'addQuery' to set up any parent/child relationship between the queries.
	 * Note: there may be more than 1 top level pivot i.e. multiple query trees.
	 * 
	 * @param query
	 * @return whether or not this is a child query
	 */
	public boolean addQuery( QueryHandle newQuery )
	{
		boolean isChild = false;
		
		String newPivot = newQuery.getQuery().getPivotNode();
		
		// determine whether this is a child of an existing Query.
		// This assumes that the pivot will be on an element rather than an attribute.		
		Iterator topEntries = m_topQueries.values().iterator();
		QueryHandle parent = findParentQuery(newPivot, topEntries );
		
		// having found the parent we now need to see whether the new pivot will act as a
		// parent to any existing child queries. If so, adopt them.
		Iterator possibleChildren = null;
		if ( parent == null )
			possibleChildren = m_topQueries.values().iterator(); 
		else {
			possibleChildren = parent.getQuery().getSubQueries().iterator();
			isChild = true;
		}
		
		adoptChildren(newQuery.getQuery(), possibleChildren);
		
		//add the query to the map
		m_queries.put( newPivot, newQuery);
		
		if ( parent == null )
			m_topQueries.put( newPivot, newQuery);
		else
			parent.getQuery().addSubQuery( newQuery );
		
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
	private QueryHandle findParentQuery(String searchXPath, Iterator existingQueries )
	{
		QueryHandle parent = null;
		
		boolean bFoundParent = false;
		while (existingQueries.hasNext() && bFoundParent != true )
		{
			QueryHandle exisitingQuery = (QueryHandle)existingQueries.next();
			String existingPivotXPath = exisitingQuery.getQuery().getPivotNode();

			if ( searchXPath.startsWith(existingPivotXPath) )
			{
				// this means there is definitely a parent
				bFoundParent = true;
			
				// but a child query may provide a more specific parent
				Collection existingChildren = exisitingQuery.getQuery().getSubQueries();
				Iterator childrenIterator = existingChildren.iterator();
				
				QueryHandle moreSpecificParent = findParentQuery(searchXPath, childrenIterator);
				
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
			QueryHandle child = (QueryHandle)possibleChildren.next();
			String childPivot = child.getQuery().getPivotNode();
			
			if ( childPivot.startsWith(pivot) ) 
			{
				newParent.addSubQuery(child);
				possibleChildren.remove();
			}
		}
	}
	
	/**
	 * Returns the pivot node which can satisfy the xpath.
	 * This means that pivot /A/B could be returned by /A/B/C.
	 * 
	 * @param pivotNode
	 * @param exactMatch - 'true' if passed xpath should be exact xpath to a pivot node.
	 *                     'false' if want to find the query which is the parent for the given xpath. 
	 * @return
	 */
	public QueryHandle getQuery( String nodeXPath, boolean exactMatch )
	{
		if ( nodeXPath == null || nodeXPath.length() == 0 ) return null;
		
		QueryHandle query = null;
		
		if ( exactMatch == true )
		{
			query = (QueryHandle) m_queries.get( nodeXPath );
		}
		else
		{
			query = findParentQuery(nodeXPath, m_queries.values().iterator() );
		}
		
		return query;
	}
	
	/**
	 * Adds a table to the collection of tables.
	 * 
	 * @param table
	 */
	public void addTable( Table table )
	{
		if ( table != null) {
			m_tables.put( table.getAlias().toUpperCase(), table);
		}
	}
	
	/**
	 * Returns a table from the collection of tables.
	 * 
	 * @param alias
	 * @return
	 */
	public Table getTable( String alias )
	{
		Table table = null;
		
		if ( alias != null && alias.length() > 0) {
			table = (Table)m_tables.get( alias.toUpperCase() );
		}
		
		return table;
	}
	
	/**
	 * Uses the passed extended queries to update the current queries.
	 * 
	 * @param extendedQueries
	 */
	public void extend( Collection extendedQueries )
	{
		if ( extendedQueries != null ) {
			Iterator extensions = extendedQueries.iterator();
			while( extensions.hasNext() ) {
				QueryExtension extension = (QueryExtension)extensions.next();
				extend( extension );
			}
		}
	}
	
	/**
	 * Extends the specified query.
	 * 
	 * @param extension
	 */
	public void extend( QueryExtension extension )
	{
		if ( m_extendedPivots == null ) {
			m_extendedPivots = new TreeSet();
		}
		
		QueryHandle queryHandle = (QueryHandle)m_queries.get(extension.getPivotNode());
		if ( queryHandle != null ) {
			if ( !m_extendedPivots.contains(extension.getPivotNode()) ) {
				m_extendedPivots.add(extension.getPivotNode());
			}
			
			queryHandle.extendQuery(extension);
		}
	}
	
	/**
	 * Returns the queries to their original, unextended state.
	 *
	 */
	public void unextend()
	{
		if ( m_extendedPivots != null ) {
			Iterator extensions = m_extendedPivots.iterator();
			while(extensions.hasNext()) {
				String extensionPivot = (String)extensions.next();
				QueryHandle queryHandle = (QueryHandle)m_queries.get(extensionPivot);
				
				queryHandle.unextendQuery();
			}
			
			m_extendedPivots = null;
		}
	}
}
