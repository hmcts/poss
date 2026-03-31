/*
 * Created on 24-Sep-2004
 *
 */
package uk.gov.dca.db.queryengine.syntax;

/**
 * Enumeration representing the action to be taken as a result of evaluating an existence check
 * pre-condition.
 * 
 * @author GrantM
 */
public class ExistsConditionAction {

	/**
	 * Constructor
	 * 
	 * @param actionId an int representing a unique id for the action
	 */
	public ExistsConditionAction(int actionId) {
		super();
		
		this.actionId = actionId;
	}
	
	/**
	 * Retrieves the id of the action
	 * 
	 * @return Returns the actionId.
	 */
	public int getActionId() {
		return actionId;
	}

	/**
	 * Sets the id of the action
	 * 
	 * @param actionId The actionId to set.
	 */
	public void setActionId(int actionId) {
		this.actionId = actionId;
	}
	
	/**
	 * Indicates that the db existence check should be skipped
	 */
	public static final ExistsConditionAction SKIP = new ExistsConditionAction(0);
	
	/**
	 * Indicates that the update service should fail
	 */
	public static final ExistsConditionAction FAIL = new ExistsConditionAction(1);
	
	/**
	 * Indicates that the db existence check should be executed
	 */
	public static final ExistsConditionAction CONTINUE = new ExistsConditionAction(2);


	private int actionId;
}
