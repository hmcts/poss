/*
 * Created on 28-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Handle for query objects.  This class can be used to implement a form of indirect addressing of query objects.  This means that 
 * queries can be dynamically extended at runtime (by wrapping them with a new QueryExtension object) without needing to update references 
 * to the query held by other objects. 
 * 
 * @author JamesB
 */
public class QueryHandle implements SyntaxElement {

	/**
	 * Constructor for QueryHandle objects.
	 * 
	 * @param query The query that the handle should point to.
	 */
	public QueryHandle(Query query) {
		super();
		
		this.query = query;
	}

	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitQueryHandle(this);
	}

	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		List list = new ArrayList();
		list.add(query);
		return list;
	}
	
	/**
	 * This method returns the query object that the handle points to.
	 * 
	 * @return The query object that the handle points to.
	 */
	public Query getQuery() {
		return query;
	}
	
	/**
	 * This method extends the query object that the handle points to.  If the query has already been extended, any extensions 
	 * to the basic query definition will be lost.
	 */
	public void extendQuery(QueryExtension extension) {
		// ensure it is a valid extension
		if ( extension != null && query != null &&
				query.getPivotNode().compareTo(extension.getPivotNode()) == 0) {
			query = extension;
		}
	}
	
	/**
	 * Returns query to initial state so can query with no extensions.
	 *
	 */
	public void unextendQuery()
	{
		if(query != null && query instanceof QueryExtension) {
			// unwrap the basic query definition from the current query extension
			query = ((QueryExtension) query).getBase();
		}
	}
	
	private Query query = null;
}
