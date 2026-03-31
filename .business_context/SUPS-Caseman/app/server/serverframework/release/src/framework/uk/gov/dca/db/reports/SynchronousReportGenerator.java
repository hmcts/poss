/*
 * Created on 13-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.reports;

/**
 * This interface should be implemented by report generator implementations that generate reports synchronously.  If a report generator implements this interface
 * then the status of the report request is updated automatically by the framework when the generateReport method finishes.  This means that the report generator 
 * implementation does not need to worry about calling either the notifySuccess or notifyFailure methods of the ReportGenerationObserver EJB.
 * 
 * @author JamesB
 */
public interface SynchronousReportGenerator extends ReportGenerator{

}
