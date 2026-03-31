/*
 * Created on 24-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

/**
 * Enumeration representing the action to be taken if an attempt is made to insert a record that already exists
 * 
 * @author JamesB
 */
public class ExistsAction {

	/**
	 * Constructor
	 * 
	 * @param actionId an int representing a unique id for the action
	 */
	public ExistsAction(int actionId) {
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
	 * Indicates that the record should be skipped if it already exists
	 */
	public static final ExistsAction SKIP = new ExistsAction(3);
	
	/**
	 * Indicates that the update service should fail if the record already exists
	 */
	public static final ExistsAction FAIL = new ExistsAction(1);
	
	/**
	 * Indicates that the record should be updated with the specified values if it already exists
	 */
	public static final ExistsAction UPDATE = new ExistsAction(2);

	/**
	 * Indicates that the record should be added with the specified values
	 */
	public static final ExistsAction ADD = new ExistsAction(5);
	
	/**
	 * Indicates that the record should be deleted if it already exists
	 */
	public static final ExistsAction DELETE = new ExistsAction(4);

	private int actionId;
}
