/*
 * Created on 08-Jun-2005
 *
 */
package uk.gov.dca.db.security.user;

/**
 * Represents a user's personal details in Active Directory
 * 
 * @author GrantM
 */
public class ADUserPersonalDetails extends UserPersonalDetails {

	/**
	 * Default Constructor
	 */
	public ADUserPersonalDetails() {
		super();
	}
	
	/**
	 * @return Returns the homeCourt.
	 */
	public String getDeedPak() {
		return deedPak;
	}
	
	/**
	 * @param homeCourt The homeCourt to set.
	 */
	public void setDeedPak(String homeCourt) {
		this.deedPak = homeCourt;
	}

	protected void outputPropertiesAsXML(StringBuffer buff) 
	{
		super.outputPropertiesAsXML(buff);
		writeElement(buff,"DeedPak",deedPak);
	}
	
	private String deedPak = "";
}
