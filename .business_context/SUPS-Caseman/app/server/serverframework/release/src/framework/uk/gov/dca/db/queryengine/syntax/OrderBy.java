/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.Collection;
import java.util.ArrayList;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Represents a SQL 'order by' clause in the abstract syntax. 
 * 
 * @author Imran Patel
 */
public class OrderBy implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public OrderBy() {
		// empty
	}
	
	/**
	 * Copy constructor
	 */
	public OrderBy(OrderBy orderBy) {
		this.orderByClause = orderBy.orderByClause;
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitOrderBy(this);
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return new ArrayList();
	}
		
	/**
	 * @return Returns the orderByClause.
	 */
	public String getOrderByClause() {
		return orderByClause;
	}
	/**
	 * @param orderByClause The orderByClause to set.
	 */
	public void setOrderByClause(String orderByClause) {
		this.orderByClause = orderByClause;
	}
	
	public String toString() {
		return orderByClause;
	}
	
	private String orderByClause = null;
}
