/*
 * Created on 27-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine;

import java.util.Collection;
import java.util.Iterator;

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
 * Abstract base class for SyntaxElementVisitors defining common functionality
 *  
 * @author Imran Patel
 */
public abstract class SyntaxElementVisitorImpl implements SyntaxElementVisitor {

	/**
	 * default constructor
	 */
	public SyntaxElementVisitorImpl() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQuery(uk.gov.dca.db.queryengine.syntax.Query)
	 */
	public abstract void visitQuery(Query query);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitTable(uk.gov.dca.db.queryengine.syntax.Table)
	 */
	public abstract void visitTable(Table table);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitJoin(uk.gov.dca.db.queryengine.syntax.Join)
	 */
	public abstract void visitJoin(Join join);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitJoin(uk.gov.dca.db.queryengine.syntax.Join)
	 */
	public abstract void visitOrderBy(OrderBy orderBy);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitField(uk.gov.dca.db.queryengine.syntax.Field)
	 */
	public abstract void visitField(Field field); 

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitExistenceCheck(uk.gov.dca.db.queryengine.syntax.ExistenceCheck)
	 */
	public abstract void visitExistenceCheck(ExistenceCheck check);

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitConstraint(uk.gov.dca.db.queryengine.syntax.Constraint)
	 */
	public abstract void visitConstraint(Constraint constraint);

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQueryExtension(uk.gov.dca.db.queryengine.syntax.QueryExtension)
	 */
	public abstract void visitQueryExtension(QueryExtension extension);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQueryHandle(uk.gov.dca.db.queryengine.syntax.QueryHandle)
	 */
	public void visitQueryHandle(QueryHandle handle) {
		Query query = handle.getQuery();
		
		query.accept(this);
	}

	/**
	 * Passes the visitor to all of the child nodes of the specified syntax element.  This method is used by the visitor to traverse 
	 * the abstract syntax tree
	 * 
	 * @param node the SyntaxElement whose children the visitor should visit
	 */
	protected void visitChildElements(SyntaxElement node) {
		// retrieve the children elements of this node in the abstract syntax tree
		Collection children = node.getChildElements();
		Iterator childIterator = children.iterator();
		
		// iterate through all of the child elements and pass the visitor to them
		while(childIterator.hasNext()) {
			SyntaxElement child = (SyntaxElement) childIterator.next();
			child.accept(this);
		}
	}
}
