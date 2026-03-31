/*
 * Created on Jul 28, 2005
 *
 */
package uk.gov.dca.db.reports;

import java.util.Iterator;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.async.QueueHandler;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.report.Report;
import uk.gov.dca.db.report.ReportConstants;
import uk.gov.dca.db.report.ReportFactory;
import uk.gov.dca.db.report.ReportManager;
import uk.gov.dca.db.report.serialize.reference.ReportReferenceSerializer;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.XML;

/**
 * Queues report requests
 * 
 * @author GrantM
 *
 */
public class ReportInvoker {

    private final static String REPORT_REFERENCE = "./ReportReference";
    private final static String LIST_REQUEST_ELEMENT = "ListReportRequest";
    private final static String PRINT_ELEMENT = "./Print";
    private final static String SEND_ELEMENT = "./Send";
	
    private final Log log = SUPSLogFactory.getLogger(ReportInvoker.class);
    private final Log auditLog = SUPSLogFactory.getAuditLogger(ReportInvoker.class);
    private final static XPath REF_XPATH;
    private final static XPath PRINT_XPATH;
    private final static XPath SEND_XPATH;
	
	private ReportManager m_reportManager = null;
	
    static 
    {
        REF_XPATH = XML.initPath(REPORT_REFERENCE);
        PRINT_XPATH = XML.initPath(PRINT_ELEMENT);
        SEND_XPATH = XML.initPath(SEND_ELEMENT);
    }
    
	public ReportInvoker(DataSource reportQueueRepository) {
		m_reportManager = new ReportManager(reportQueueRepository);
	}
	
	/**
	 * Queues the passed report request
	 * 
	 * @param reportRequestXML
	 * @param queueHandler
	 * @return
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public String queueReportRequest(Element reportRequestXML, QueueHandler queueHandler, String project, String userId, String courtId)
		throws BusinessException, SystemException
	{
		String requestReferenceXML = null;
        Report report = null;
		
        try {
            
            // NOTE: list reports are always new - never resubmit
            if ( LIST_REQUEST_ELEMENT.compareTo(reportRequestXML.getName()) != 0 &&
            		REF_XPATH.selectNodes(reportRequestXML).size() > 0) {
                report = m_reportManager.getLoader().loadFromRequest(reportRequestXML);
            }
            else {
                report = ReportFactory.createReport(reportRequestXML, m_reportManager);
            }
            
            boolean isPrint = PRINT_XPATH.selectSingleNode(reportRequestXML) != null; 
            boolean isSend = SEND_XPATH.selectSingleNode(reportRequestXML) != null; 
            
            setReportValues(report, isPrint, isSend, userId, courtId);
            
            if (report.getIsParent())
            {
                for (Iterator i = report.getChildren().iterator(); i.hasNext();)
                {
                    Report child = (Report) i.next();
                    setReportValues(child, isPrint, isSend, userId, courtId);
                }
            }
            
            m_reportManager.save(report);
            
            // now queue the request
            requestReferenceXML = ReportReferenceSerializer.serializeReport(report, false);
            Properties p = new Properties();
            p.setProperty(ReportConstants.PROJECT_PROPERTY, project);
            log.info("Queuing report, project: " + project + ", request: " + reportRequestXML);
            queueHandler.send( requestReferenceXML, p, QueueHandler.TEXT_MESSAGE );
            logReport(auditLog, report, userId, true, "Report Queued");
            
            return requestReferenceXML;
        }
        catch (JDOMException e) 
        {
            logReport(auditLog, report, userId, false, e.getMessage());
            throw new SystemException(e.getMessage(), e);
        }
        catch (SystemException e) 
        {
            logReport(auditLog, report, userId, false, e.getMessage());
            throw new SystemException(e.getMessage(), e);
        }
        catch (BusinessException e) 
        {
            logReport(auditLog, report, userId, false, e.getMessage());
            throw new BusinessException(e.getMessage(), e);
        }

	}
    
    /**
     * Convenience method that sets some values post the creation of the report
     * objects (printStatus, sendStatus, userId, courtId).
     * 
     * @param report
     * @param isPrint
     * @param isSend
     * @param userId
     * @param courtId
     */
    private void setReportValues(Report report, boolean isPrint, boolean isSend, String userId, String courtId)
    {
        // Reset the print & send status fields if required.
        if (isPrint)
        {
            report.setPrintStatus(Report.Status.QUEUED);
        }
        if (isSend)
        {
            report.setSendStatus(Report.Status.QUEUED);
        }
        
        report.setUserId(userId);
        report.setCourtId(courtId);
    }
    
    private void logReport(Log aLog, Report report, String userId, boolean success, String message) throws SystemException
    {
        if (report != null && report.getIsParent())
        {
            for (Iterator i = report.getChildren().iterator(); i.hasNext();)
            {
                Report child = (Report) i.next();
                logReport(aLog, child, userId, success, message);
            }
        }
        else
        {
            String successStr = success ? "Success" : "Failure";
            String reportName = (report == null || report.getReportName() == null) ? "Unknown" : report.getReportName();
            SUPSLogEvent event = new SUPSLogEvent("Report Service", reportName, "REPORT", userId, successStr, message);
            auditLog.info(event);
        }
    }

}
