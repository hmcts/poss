/*
 * Created on Aug 25, 2005
 *
 */
package uk.gov.dca.db.security.user;


/**
 * Class to hold user court details for Crest.
 * 
 * @author GrantM
 *
 */
public class CrestUserCourtDetails extends UserCourtDetails {

	private int crestStaffId = 0;
	private String crestUserId = "";
	
	public CrestUserCourtDetails()
	{
		super();
	}
	
	public void setStaffId(int crestStaffId)
	{
		this.crestStaffId = crestStaffId;
	}
	
	public void setCrestUserId(String crestUserId)
	{
		this.crestUserId = crestUserId;
	}
	
	protected void outputPropertiesAsXML(StringBuffer buff) 
	{
		super.outputPropertiesAsXML(buff);
		
		writeElement(buff, "StaffId", Integer.toString(crestStaffId));
		writeElement(buff, "CrestUserId", crestUserId);
	}
}
