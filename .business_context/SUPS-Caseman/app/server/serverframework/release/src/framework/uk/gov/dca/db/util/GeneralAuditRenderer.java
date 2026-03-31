/*
 * Created on Apr 28, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util;

/**
 * @author Imran
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class GeneralAuditRenderer implements SUPSLogRenderer {
	
	public static final String SOURCE_SYSTEM = "SOURCE_SYSTEM";
	public static final String SOURCE_DETAILS = "SOURCE_DETAILS";
	public static final String AUDIT_TYPE = "AUDIT_TYPE";
	public static final String USER_ID = "USER_ID";
	public static final String EVENT_STATUS = "EVENT_STATUS";
	public static final String STATUS_DETAILS = "STATUS_DETAILS";
	public static final String SEPARATOR = " | ";
	public static final String EQUALS = " = ";

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.util.SUPSLogRenderer#doRender()
	 */
	public String doRender(SUPSLogEvent event) {
		StringBuffer logMessage = new StringBuffer();
		
		logMessage.append(SOURCE_SYSTEM);
		logMessage.append(EQUALS);
		logMessage.append(event.getSourceSystem());		
		logMessage.append(SEPARATOR);
		logMessage.append(SOURCE_DETAILS);
		logMessage.append(EQUALS);
		logMessage.append(event.getSourceDetails());
		logMessage.append(SEPARATOR);
		logMessage.append(AUDIT_TYPE);
		logMessage.append(EQUALS);
		logMessage.append(event.getAuditType());
		logMessage.append(SEPARATOR);
		logMessage.append(USER_ID);
		logMessage.append(EQUALS);
		logMessage.append(event.getUserId());
		logMessage.append(SEPARATOR);
		logMessage.append(EVENT_STATUS);
		logMessage.append(EQUALS);
		logMessage.append(event.getEventStatus());
		logMessage.append(SEPARATOR);
		logMessage.append(STATUS_DETAILS);
		logMessage.append(EQUALS);
		logMessage.append(event.getStatusDetails());
		logMessage.append(SEPARATOR);
		
		return logMessage.toString();
	}

}
