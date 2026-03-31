/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine;

import uk.gov.dca.db.queryengine.syntax.Constraint;
import uk.gov.dca.db.queryengine.syntax.ExistenceCheck;
import uk.gov.dca.db.queryengine.syntax.Field;
import uk.gov.dca.db.queryengine.syntax.Join;
import uk.gov.dca.db.queryengine.syntax.OrderBy;
import uk.gov.dca.db.queryengine.syntax.Query;
import uk.gov.dca.db.queryengine.syntax.QueryExtension;
import uk.gov.dca.db.queryengine.syntax.QueryHandle;
import uk.gov.dca.db.queryengine.syntax.Table;

/**
 * Defines a common interface for visitors of SyntaxElement objects.  Implementations of this interface define behaviour to be applied to
 * SyntaxElements in an abstract syntax tree.  Each concrete SyntaxElement will have a corresponding method in SyntaxElementVisitors which
 * it will call to invoke the visitor's behaviour defined for it e.g. a Table syntax element in an abstract syntax tree when passed a visitor
 * would call the visitTable method, passing a reference to itself as a parameter.
 * 
 * @author Imran Patel
 */
public interface SyntaxElementVisitor {

	/**
	 * This method is called when the visitor reaches a query element in the abstract syntax tree
	 * 
	 * @param query the query to visit
	 */
	void visitQuery(Query query);

	/**
	 * This method is called when the visitor reaches a table element in the abstract syntax tree
	 * 
	 * @param table the table to visit
	 */
	void visitTable(Table table);

	/**
	 * This method is called when the visitor reaches a join element in the abstract syntax tree
	 * 
	 * @param join the join to visit
	 */
	void visitJoin(Join join);

	/**
	 * This method is called when the visitor reaches an order by element in the abstract syntax tree
	 * 
	 * @param orderBy the OrderBy to visit
	 */
	void visitOrderBy(OrderBy orderBy);

	/**
	 * This method is called when the visitor reaches a field element in the abstract syntax tree 
	 * 
	 * @param field the field to visit
	 */
	void visitField(Field field);

	/**
	 * This method is called when the visitor reaches an existence check element in the abstract syntax tree
	 * 
	 * @param check the existence check element to visit
	 */
	void visitExistenceCheck(ExistenceCheck check);

	/**
	 * This method is called when the visitor reaches a constraint element in the abstract syntax tree
	 * 
	 * @param constraint the constraint to visit
	 */
	void visitConstraint(Constraint constraint);

	/**
	 * This method is called when the visitor reaches a query extension in the abstract syntax tree
	 * 
	 * @param extension the query extension to visit
	 */
	void visitQueryExtension(QueryExtension extension);

	/**
	 * This method is called when the visitor reaches a query handle in the abstract syntax tree
	 * 
	 * @param handle the query handle to visit
	 */
	void visitQueryHandle(QueryHandle handle);

}
