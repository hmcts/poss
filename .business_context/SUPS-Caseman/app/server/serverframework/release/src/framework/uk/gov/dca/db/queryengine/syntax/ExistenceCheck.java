/*
 * Created on 22-Sep-2004
 *
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.Collection;
import java.util.ArrayList;
import java.util.List;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Represents an existence check in the abstract syntax.  An existence check is carried out when attempting to create a new record 
 * to determine whether it already exists and dictates what action should be taken if it does exist and does not exist.
 * 
 * @author Imran Patel
 */
public class ExistenceCheck implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public ExistenceCheck() {
		// empty
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitExistenceCheck(this);
	}

	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return fields;
	}
	
	/**
	 * @return Returns the fields used in the existence check.
	 */
	public Collection getFields() {
		return fields;
	}
	
	/**
	 * @param field The field to add to the existence check
	 */
	public void addField(Field field) {
		fields.add(field);
	}
	
	/**
	 * @return Returns the action that should be carried out if the record already exists.
	 */
	public ExistsAction getExistsAction() {
		return onExistsAction;
	}
	
	/**
	 * @param action The action that should be carried out if the record already exists.
	 */
	public void setExistsAction(ExistsAction action) {
		this.onExistsAction = action;
	}
	
	/**
	 * @return Returns the action that should be carried out if the record does not exist.
	 */
	public ExistsAction getNotExistsAction() {
		return onNotExistsAction;
	}
	
	/**
	 * @param action The action that should be carried out if the record does not exist.
	 */
	public void setNotExistsAction(ExistsAction action) {
		this.onNotExistsAction = action;
	}
	
	/**
	 * Retrieves the optimistic lock flag
	 * 
	 * @return Returns useOptimisticLock.
	 */
	public boolean getUseOptimisticLock() {
		return useOptimisticLock;
	}
	
	/**
	 * Sets the optimistic lock flag
	 * 
	 * @param useOptimisticLock
	 */
	public void setUseOptimisticLock(boolean useOptimisticLock) {
		this.useOptimisticLock = useOptimisticLock;
	}
	
	/**
	 * Returns the action for when the existence check pre-condition evaluates to true.
	 * 
	 * @return
	 */
	public ExistsConditionAction getConditionTrueAction() {
		return onConditionTrueAction;
	}

	/**
	 * Sets the action for when the existence check pre-condition evaluates to true.
	 * 
	 * @return
	 */
	public void setConditionTrueAction(ExistsConditionAction action) {
		onConditionTrueAction = action;
	}

	/**
	 * Returns the action for when the existence check pre-condition evaluates to false.
	 * 
	 * @return
	 */
	public ExistsConditionAction getConditionFalseAction() {
		return onConditionFalseAction;
	}

	/**
	 * Sets the action for when the existence check pre-condition evaluates to false.
	 * 
	 * @return
	 */
	public void setConditionFalseAction(ExistsConditionAction action) {
		onConditionFalseAction = action;
	}
	
	/**
	 * Returns the pre-condition clause.
	 * 
	 * @return
	 */
	public String getConditionClause() {
		return conditionClause;
	}
	
	/**
	 * Sets the pre-condition clause.
	 * 
	 * @param clause
	 */
	public void setConditionClause(String clause) {
		conditionClause = clause;
	}
	
	private List fields = new ArrayList();
	private ExistsAction onExistsAction = null;
	private ExistsAction onNotExistsAction = null;
	private boolean useOptimisticLock = true;
	private String conditionClause = null;
	private ExistsConditionAction onConditionTrueAction = null;
	private ExistsConditionAction onConditionFalseAction = null;
}
