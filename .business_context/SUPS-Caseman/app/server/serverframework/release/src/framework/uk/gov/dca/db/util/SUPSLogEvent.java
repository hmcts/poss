/*
 * @PROJECT    SUPS
 *
 * @SYSTEM     Server-side Framework
 *
 * @PACKAGE    uk.gov.dca.pipeline
 *
 * @AUTHOR     Imran Patel
 * @VERSION    $Revision: 1.1 $
 * @DATE       $Date: 2005/04/29 10:43:12 $
 *
 * @COMPANY 
 *
 *-----------------------------------------------------------------------------
 *
 * (c) Copyright 
 *
 ******************************************************************************
 *
 * @REVISIONS $Log: SUPSLogEvent.java,v $
 * @REVISIONS Revision 1.1  2005/04/29 10:43:12  ipatel
 * @REVISIONS Added for the enhancment of framework to provide Audit and logging functionality.
 * @REVISIONS
 */
package uk.gov.dca.db.util;

/**
 * @author Imran
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SUPSLogEvent {
	
	private String sourceSystem;
	private String sourceService;
	private String sourceDetails;
	//AuditType
	private String auditType;
	private String userId;
	private String eventStatus;
	private String statusDetails;
	private SUPSLogRenderer renderer = new GeneralAuditRenderer();
	
	public SUPSLogEvent() {
		
	}
	
	public SUPSLogEvent(String sourceService, String sourceDetails, String auditType, 
			String userId, String eventStatus, String statusDetails) {		
		this.sourceSystem = FrameworkConfigParam.APPLICATION_NAME.getValue();
		this.sourceDetails = sourceDetails;
		this.auditType = auditType;
		this.userId = userId;
		this.eventStatus = eventStatus;
		this.statusDetails = statusDetails;
	}
	
	public String toString() {
		return renderer.doRender(this);
	}
	
	public void setRenederer(SUPSLogRenderer renderer) {
		this.renderer = renderer;
	}
	
	public String getSourceSystem() {
		return sourceSystem;
	}
	
	public String getSourceDetails() {
		return sourceDetails;
	}
	
	public String getAuditType() {
		return auditType;
	}
	
	public String getEventStatus() {
		return eventStatus;
	}
	
	public String getStatusDetails() {
		return statusDetails;
	}
	
	public String getUserId() {
		return userId;
	}
	
	public void setSourceSystem(String sourceSystem) {
		this.sourceSystem = sourceSystem;
	}
	
	public void setSourceDetails(String sourceDetails) {
		this.sourceDetails = sourceDetails;
	}
	
	public void setAuditType(String auditType) {
		this.auditType = auditType;
	}
	
	public void setEventStatus(String eventStatus) {
		this.eventStatus = eventStatus;
	}
	
	public void setStatusDetails(String statusDetails) {
		this.statusDetails = statusDetails;
	}
	
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getSourceService() {
		return sourceService;
	}

	public void setSourceService(String sourceService) {
		this.sourceService = sourceService;
	}
}
