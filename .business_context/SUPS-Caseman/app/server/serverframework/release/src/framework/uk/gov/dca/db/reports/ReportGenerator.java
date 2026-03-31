/*
 * Created on 12-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.reports;


/**
 * This interface should not be directly implemented but rather one of the interfaces that inherits from it; SynchronousReportGenerator and AsynchronousReportGenerator
 *
 * @author JamesB
 */
public interface ReportGenerator {
	
	/**
	 * This method will generate and store the report based upon the parameters it receives.
	 * 
	 * @param templateId the name of the report template that should be used to generate the report
	 * @param params the params sent from the client
	 * @param outputType the format the output should be stored as.  Acceptable values are PDF, ASCII PCL, HTML, XHTML and PS
	 * @param reportId the id of the report within the system.  This may be used by some report generators as an output filename so they can
	 * reference the report  
	 * @throws ReportGenerationException if an exception occured whilst processing the report
	 */
	public void generateReport(String templateId, String params, String outputType, String reportId) throws ReportGenerationException;
}
