/*
 * Created on 08-Jun-2005
 *
 */
package uk.gov.dca.db.security.user;

/**
 * Represents the user's personal details that are common to both Active Directory and
 * SUPS (in DCA_USER table)
 * 
 * @author JamesB
 */
public abstract class UserPersonalDetails {

	/**
	 * Default Constructor
	 */
	public UserPersonalDetails() {
		super();
	}
		
	/**
	 * @return Returns the forenames.
	 */
	public String getForenames() {
		return forenames;
	}
	
	/**
	 * @param forenames The forenames to set.
	 */
	public void setForenames(String forenames) {
		this.forenames = forenames;
	}
	
	/**
	 * @return Returns the surname.
	 */
	public String getSurname() {
		return surname;
	}
	
	/**
	 * @param surname The surname to set.
	 */
	public void setSurname(String surname) {
		this.surname = surname;
	}
	
	/**
	 * @return Returns the userId.
	 */
	public String getUserId() {
		return userId;
	}
	
	/**
	 * @param userId The userId to set.
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	
	/**
	 * Objects serializes itself to the buffer.
	 * Home court can optional be included as a convenience.
	 * @param buff
	 */
	public void outputAsXML(boolean includeHomeCourt, String homeCourt, StringBuffer buff)
	{
		buff.append("<");
		buff.append(USER_PERSONAL_DETAILS_ELEMENT);
		buff.append(">");
		
		if (includeHomeCourt)
		{
			writeElement(buff, "HomeCourt", homeCourt);
		}
		
		outputPropertiesAsXML(buff);
		
		buff.append("</");
		buff.append(USER_PERSONAL_DETAILS_ELEMENT);
		buff.append(">");
	}
	
	/**
	 * Outputs properties of this class as XML. Subclasses should write their own version to output
	 * additional properties and call this base version.
	 * 
	 * @param buff
	 */
	protected void outputPropertiesAsXML(StringBuffer buff) 
	{
		writeElement(buff, "UserId", userId);
		writeElement(buff, "Forenames", forenames);
		writeElement(buff, "Surname", surname);
	}
	
	protected static void writeElement(StringBuffer buff, String elementName, String value)
	{
		buff.append("<");
		buff.append(elementName);
		buff.append(">");
		buff.append(value);
		buff.append("</");
		buff.append(elementName);
		buff.append(">");
	}
	

	private final static String USER_PERSONAL_DETAILS_ELEMENT = "UserPersonalDetails";
	
	private String userId = "";
	private String forenames = "";
	private String surname = "";
}
