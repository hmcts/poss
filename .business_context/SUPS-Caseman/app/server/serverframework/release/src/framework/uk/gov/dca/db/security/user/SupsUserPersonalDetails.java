/*
 * Created on 08-Jun-2005
 *
 */
package uk.gov.dca.db.security.user;

/**
 * Representing common user's personal details (maps to DCA_USER table)
 * 
 * @author GrantM
 */
public class SupsUserPersonalDetails extends UserPersonalDetails {

	/**
	 * Default Constructor
	 */
	public SupsUserPersonalDetails() {
		super();
	}

	
	public void setTitle(String title){
		this.title = title;
	}
	
	public String getTitle(){
		return title;
	}
	
	/**
	 * @return Returns the extension.
	 */
	public String getExtension() {
		return extension;
	}
	
	/**
	 * @param extension The extension to set.
	 */
	public void setExtension(String extension) {
		this.extension = extension;
	}
	
	/**
	 * @return Returns the jobTitle.
	 */
	public String getJobTitle() {
		return jobTitle;
	}
	
	/**
	 * @param jobTitle The jobTitle to set.
	 */
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	
	/**
	 * @return Returns the userShortName.
	 */
	public String getUserShortName() {
		return userShortName;
	}
	
	/**
	 * @param userShortName The userShortName to set.
	 */
	public void setUserShortName(String userShortName) {
		this.userShortName = userShortName;
	}

	/**
	 * @return Returns the activeUserFlag.
	 */
	public String getActiveUserFlag() {
		return activeUserFlag;
	}
	
	/**
	 * @param activeUserFlag The activeUserFlag to set.
	 */
	public void setActiveUserFlag(String activeUserFlag) {
		this.activeUserFlag = activeUserFlag;
	}

	/**
	 * @return Returns the userDefaultPrinter.
	 */
	public String getUserDefaultPrinter() {
		return styleProfile;
	}
	
	/**
	 * @param userDefaultPrinter The userDefaultPrinter to set.
	 */
	public void setUserDefaultPrinter(String userDefaultPrinter) {
		this.userDefaultPrinter = userDefaultPrinter;
	}
	
	/**
	 * @return Returns the styleProfile.
	 */
	public String getUserStyleProfile() {
		return styleProfile;
	}
	
	/**
	 * @param styleProfile The styleProfile to set.
	 */
	public void setUserStyleProfile(String styleProfile) {
		this.styleProfile = styleProfile;
	}
	
	protected void outputPropertiesAsXML(StringBuffer buff) 
	{
		super.outputPropertiesAsXML(buff);

		writeElement(buff, "Title", title);
		writeElement(buff, "UserShortName", userShortName);
		writeElement(buff, "JobTitle", jobTitle);
		writeElement(buff, "Extension", extension);
		writeElement(buff, "IsActive",activeUserFlag);
		writeElement(buff, "StyleProfile",styleProfile);
		writeElement(buff, "DefaultPrinter",userDefaultPrinter);
	}
	
	private String activeUserFlag = "";
	private String styleProfile = "";
	private String userDefaultPrinter = "";
	private String title = "";
	private String userShortName = "";
	private String jobTitle = "";
	private String extension = "";
}
