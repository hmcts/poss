/*
 * Created on Aug 24, 2005
 *
 */
package uk.gov.dca.db.security.user;

import uk.gov.dca.db.exception.BusinessException;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.text.ParseException;

/**
 * A placeholder for info about the user details to be updated. 
 * Only for data stored in SUPS db. i.e. DCA_USER table, not Active Directory.
 * 
 * @author GrantM
 *
 **/
public class UpdateUserCourtDetails {

	private boolean setDateFrom = false;
	private boolean setDateTo = false;
	private boolean setCrestStaffId = false;
	private boolean setCrestUserId = false;
	private Date dateFrom = null;
	private Date dateTo = null;
	private long crestStaffId = 0;
	private String crestUserId = null;
	
	public UpdateUserCourtDetails(boolean setDateFrom, boolean setDateTo, 
			boolean setCrestStaffId, boolean setCrestUserId,
			String dateFrom, String dateTo, String crestStaffId, String crestUserId)
		throws BusinessException
	{
		this.setDateFrom=setDateFrom;
		this.setDateTo=setDateTo;
		this.setCrestStaffId=setCrestStaffId;
		this.setCrestUserId=setCrestUserId;
		
		this.crestUserId=crestUserId;
	
		if (setCrestStaffId) 
		{
			try {
				this.crestStaffId = Long.parseLong(crestStaffId);
			}
			catch(Exception e) {
				throw new BusinessException("Invalid staff id '"+crestStaffId+"'. Must be a number.");
			}
		}
		
		// assume standard SUPS date format
		if (setDateFrom)
		{	
			try {
				this.dateFrom = parseDate(dateFrom);
			}
			catch(ParseException e) {
				throw new BusinessException("Invalid dateFrom parameter '"+dateFrom+"'. Cannot convert to a date.");
			}
		}
		
		if (setDateTo)
		{	
			try {
				this.dateTo = parseDate(dateTo);
			}
			catch(ParseException e) {
				throw new BusinessException("Invalid dateTo parameter '"+dateTo+"'. Cannot convert to a date.");
			}
		}
	}

	public boolean getSetDateFrom() {
		return setDateFrom;
	}
	
	public boolean getSetDateTo() {
		return setDateTo;
	}
	
	public boolean getSetCrestStaffId() {
		return setCrestStaffId;
	}

	public boolean getSetCrestUserId() {
		return setCrestUserId;
	}

	public Date getDateFrom() {
		return dateFrom;
	}
	
	public Date getDateTo() {
		return dateTo;
	}

	public long getCrestStaffId() {
		return crestStaffId;
	}

	public String getCrestUserId() {
		return crestUserId;
	}
	
	private Date parseDate(String dateString)
		throws ParseException
	{
		Date parsedDate = null;
		
		if (dateString != null && dateString.length() > 0) 
		{
			SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
		    dateFormat.applyPattern("yyyy-MM-dd");
		    
		    parsedDate = dateFormat.parse(dateString);
	    }
	   
	    return parsedDate;
	}
}
