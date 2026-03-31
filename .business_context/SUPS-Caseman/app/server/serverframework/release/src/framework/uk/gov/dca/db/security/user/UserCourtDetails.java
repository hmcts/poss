/*
 * Created on Aug 25, 2005
 *
 */
package uk.gov.dca.db.security.user;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Holds generic user court details, common to all Sups projects.
 * 
 * @author GrantM
 *
 */
public class UserCourtDetails {
	
	private Date fromDate = null;
	private Date toDate = null;
	private String courtCode = "";
	private String homeFlag = "";
	
	public UserCourtDetails()
	{
		super();
	}
	
	public void setFromDate(Date fromDate) 
	{
		this.fromDate = fromDate;
	}
	
	public void setToDate(Date toDate) 
	{
		this.toDate = toDate;
	}

	public void setCourtCode(String courtCode) 
	{
		this.courtCode = courtCode;
	}

	public void setHomeFlag(String homeFlag) 
	{
		this.homeFlag = homeFlag;
	}
	
	/**
	 * Objects serializes itself to the buffer.
	 * @param buff
	 */
	public void outputAsXML(StringBuffer buff)
	{
		buff.append("<");
		buff.append(USER_COURT_DETAILS_ELEMENT);
		buff.append(">");
		
		outputPropertiesAsXML(buff);
		
		buff.append("</");
		buff.append(USER_COURT_DETAILS_ELEMENT);
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
		SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
		dateFormat.applyPattern("yyyy-MM-dd");
	
		writeElement(buff, "CourtCode", courtCode);
		writeElement(buff, "FromDate", dateFormat.format(fromDate));
		writeElement(buff, "ToDate", dateFormat.format(toDate));
		writeElement(buff, "HomeFlag", homeFlag);
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
	
	private final static String USER_COURT_DETAILS_ELEMENT = "UserCourt";
	
}
