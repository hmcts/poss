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
 * Represents a join clause in the abstract syntax.  Joins can be used to join tables used in a query and to join the query with 
 * a parent query.
 * 
 * @author JamesB
 */
public class Join implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public Join() {
		// empty
	}
	
	/**
	 * Copy constructor
	 */
	public Join(Join join) {
		this.joinClause = join.joinClause;
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitJoin(this);
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return new ArrayList();
	}
		
	/**
	 * @return Returns the joinClause.
	 */
	public String getJoinClause() {
		return joinClause;
	}
	/**
	 * @param joinClause The joinClause to set.
	 */
	public void setJoinClause(String joinClause) {
		this.joinClause = joinClause;
	}
	
	public String toString() {
		return joinClause;
	}
	
	private String joinClause = null;
}
