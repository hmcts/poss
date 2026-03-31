/*
 * Created on 08-Jun-2005
 *
 */
package uk.gov.dca.db.security.user;

/**
 * Represents a user's personal details in Family Man
 * ( they have an extra column in DCA_USER table ).
 * 
 * @author GrantM
 */
public class FamilyManUserPersonalDetails extends SupsUserPersonalDetails {

	/**
	 * Default Constructor
	 */
	public FamilyManUserPersonalDetails() {
		super();
	}

	/**
	 * @return Returns the accessSecurityLevel.
	 */
	public int getAccessSecurityLevel() {
		return accessSecurityLevel;
	}
	
	/**
	 * @param accessSecurityLevel The accessSecurityLevel to set.
	 */
	public void setAccessSecurityLevel(String accessSecurityLevel) {
		this.accessSecurityLevel = Integer.parseInt(accessSecurityLevel);
	}

	public void setAccessSecurityLevel(int accessSecurityLevel) {
		this.accessSecurityLevel = accessSecurityLevel;
	}
	
	protected void outputPropertiesAsXML(StringBuffer buff) 
	{
		super.outputPropertiesAsXML(buff);
		writeElement(buff,"AccessSecurityLevel", Integer.toString(accessSecurityLevel));
	}
	
	private int accessSecurityLevel = 0;
}
