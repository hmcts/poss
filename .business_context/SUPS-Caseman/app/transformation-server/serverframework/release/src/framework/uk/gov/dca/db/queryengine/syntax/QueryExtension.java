/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

/*import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
*/
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Allows extra tables, joins and constraints to be added to the query without modifying the basic query definition.  This class
 * decorates a query object with the extra elements.  Using this class, queries may be dynamically extended at run-time.
 * 
 * @author JamesB
 */
public class QueryExtension extends Query {

	/**
	 * Default constructor
	 * 
	 * @deprecated please use uk.gov.dca.db.queryengine.syntax.QueryExtension#QueryExtension(uk.gov.dca.db.queryengine.syntax.Query) instead
	 */
	public QueryExtension() {
		super();
	}
	
	/**
	 * Constructor to create a QueryExtension by wrapping a query
	 * 
	 * @param base the query to be extended
	 */
	public QueryExtension(Query base) {
		super(base);
		this.base = base;
	}

	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitQueryExtension(this);
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	/*public Collection getChildElements() {
		List list = new ArrayList(super.getChildElements());
		list.addAll(base.getChildElements());
		
		return list;
	}
	*/	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getConstraints()
	 */
/*	public Collection getConstraints() {
		List compositeConstraints = new ArrayList(super.getConstraints());
		compositeConstraints.addAll(base.getConstraints());
		
		return compositeConstraints;
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getTables()
	 */
	/*public Collection getTables() {
		List compositeTables = new ArrayList(super.getTables());
		compositeTables.addAll(base.getTables());
		
		return compositeTables;
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#isModifiable()
	 */
	/*public boolean isModifiable() {
		return base.isModifiable();
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#setModifiable(boolean)
	 */
	/*
	public void setModifiable(boolean modifiable) {
		base.setModifiable(modifiable);
	}
		*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getPivotNode()
	 */
	/*public String getPivotNode() {
		return base.getPivotNode();
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#setPivotNode(java.lang.String)
	 */
	/*public void setPivotNode(String pivotNode) {
		base.setPivotNode(pivotNode);
	}*/
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#addSubQuery(uk.gov.dca.db.queryengine.syntax.Query)
	 */
	/*public void addSubQuery(QueryHandle query) {
		base.addSubQuery(query);
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getSubQueries()
	 */
/*	public Collection getSubQueries() {
		return base.getSubQueries();
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getUndefinedFields()
	 */
/*	public Collection getUndefinedFields() {
		List compositeUndefinedFields = new LinkedList(base.getUndefinedFields());
		
		// remove from the list any undefined fields from the base query that have been defined as parameters in the query extension 
		compositeUndefinedFields.removeAll(super.getParameters());
		
		// add the undefined fields for the query extension
		compositeUndefinedFields.addAll(super.getUndefinedFields());
		
		return compositeUndefinedFields;
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#addParameter(java.lang.String)
	 */
/*	public void addParameter(String parameterName) {
		super.addParameter(parameterName);
	}
	*/
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getJoin()
	 */
	/*public Join getJoin() {
		
		Join extensionJoin = super.getJoin();
		if(extensionJoin == null) {
			extensionJoin = base.getJoin();
		}
		
		return extensionJoin;
	}
	*/
	/**
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getParameters()
	 */
/*	public Collection getParameters() {
		List compositeParameters = new ArrayList(super.getParameters());
		compositeParameters.addAll(base.getParameters());
		return compositeParameters;
	}
	*/
	/**
	 * @see uk.gov.dca.db.queryengine.syntax.Query#getTable(java.lang.String)
	 */
	/*public Table getTable(String alias) {
		Table match = base.getTable(alias);
		if(match == null) {
			match = super.getTable(alias);
		}
		
		return match;
	}
	*/
	/**
	 * Returns the basic query definition that this object extends
	 * 
	 * @return Returns the basic query definition.
	 */
	public Query getBase() {
		return base;
	}
	
	/**
	 * Sets the basic query definition that this object should extend
	 * 
	 * @param base The basic query definition to be extended.
	 */
	/*public void setBase(Query base) {
		this.base = base;
	}*/
	
	private Query base = null;
}
