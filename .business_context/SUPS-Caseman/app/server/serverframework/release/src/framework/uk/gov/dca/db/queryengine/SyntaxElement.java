/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine;

import java.util.Collection;

/**
 * Defines a common interface for all elements of the abstract syntax
 * 
 * @author Imran Patel
 */
public interface SyntaxElement {
	
	/**
	 * Accepts a vistor object that defines behaviour to be applied to an element of the abstract syntax.
	 * 
	 * @param visitor The visitor object defining behaviour to be applied an element of the abstract syntax
	 */
	public void accept(SyntaxElementVisitor visitor);
	
	/**
	 * Retrieves a collection of all of the child nodes of this node of the abstract syntax tree
	 * 
	 * @return a collection containing the child nodes of the current node
	 */
	public Collection getChildElements();
}
