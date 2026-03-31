/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.ArrayList;
import java.util.Collection;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;
import uk.gov.dca.db.pipeline.ISQLGenerator;

/**
 * Represents a constraint in the abstract syntax.  A constraint is a clause that can be used to limit the records to which a query is
 * applied.  It could be used to limit the records returned from a select query or to limit the records updated or deleted.
 * 
 * @author Imran Patel
 */
public class Constraint implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public Constraint() {
		// empty
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitConstraint(this);
	}

	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return new ArrayList();
	}

	/**
	 * @return Returns the string representation of the constraint
	 */
	public String getConstraintClause() {
		return constraintClause;
	}
	
	/**
	 * @param constraintClause The string representation of the constraint
	 */
	public void setConstraintClause(String constraintClause) {
		this.constraintClause = constraintClause;
	}
	
	/**
	 * @param sqlGenerator The generator object to use to create the constraint.
	 */
	public void	setSQLGenerator(ISQLGenerator sqlGenerator) {
		this.sqlGenerator = sqlGenerator;
	}
	
	private String constraintClause = null;
	private ISQLGenerator sqlGenerator = null;
}
