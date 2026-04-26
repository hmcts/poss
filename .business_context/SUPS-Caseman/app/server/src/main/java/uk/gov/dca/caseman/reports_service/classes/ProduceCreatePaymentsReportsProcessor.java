/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.caseman.reports_service.classes;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Reports Method: produceCreatePaymentsReportsProcessor
 * Class: ProduceCreatePaymentsReportsProcessor.java
 * 
 * @author Kevin Gichohi
 *         Created: 21-Dec-2005
 * 
 *         Description:
 *         Runs report CM_PREC, CM_PVER, CM_CTR_RCPT
 *         Deletes data from reportData
 *
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         19-June-2006 Kevin Gichohi (EDS): Removed the call to mDeleteReportData as this is duplicated on the client
 *         side.
 *         06-July-2006 Steve Blair: Added a call to mDeleteReportData for PVER as this is not handled on client side.
 *         07-July-2006 Steve Blair: Added a call to mDeleteReportData for PREC & BVER for consistency (client side
 *         handling removed).
 */
public class ProduceCreatePaymentsReportsProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant PAYMENT_SERVICE. */
    // Services.
    private static final String PAYMENT_SERVICE = "ejb/PaymentsServiceLocal";
    
    /** The Constant DELETE_REPORT_DATA. */
    private static final String DELETE_REPORT_DATA = "deleteReportDataLocal";

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws BusinessException, SystemException
    {
        RequestReportXMLBuilder requestReportBuilder = null;
        final Element RequestReportElement = null;

        String reportType = null;
        String reportNumber = null;

        String enforcementCourt = null;
        String reportDate = null;

        String tranNo = null;

        String courtId = null;
        String userId = null;

        try
        {

            reportType = ((Element) XPath.selectSingleNode (params,
                    "params/param[@name='reportData']/ReportData/ReportType")).getText ();
            reportNumber = ((Element) XPath.selectSingleNode (params,
                    "params/param[@name='reportData']/ReportData/ReportNumber")).getText ();

            enforcementCourt = ((Element) XPath.selectSingleNode (params,
                    "params/param[@name='reportData']/ReportData/EnforcementCourtCode")).getText ();

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            // Create to requestReportBuilder (a object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    courtId, // String pCourtCode
                    userId // String pCourtUser
            );

            // test for report type then run the appropriate report
            if ("PREC".equals (reportType))
            {
                // add receipt required and report number parameters
                requestReportBuilder.addSpecificParameter ("P_RECEIPT_REQ", "Y");
                requestReportBuilder.addSpecificParameter ("P_REPORT_NO", reportType + reportNumber);

                // run PREC (Postal Reconciliation Report) from the CM_PREC module
                mRunReport ("CM_PREC.rdf", requestReportBuilder);

                mDeleteReportData (params);
            }
            else if ("BVER".equals (reportType))
            {
                // add receipt required and report number parameters
                requestReportBuilder.addSpecificParameter ("P_RECEIPT_REQ", "N");
                requestReportBuilder.addSpecificParameter ("P_REPORT_NO", reportType + reportNumber);

                // run BVER (Bailiff Verification Report) from the CM_PREC module but with different parameters.
                mRunReport ("CM_PREC.rdf", requestReportBuilder);

                mDeleteReportData (params);
            }

            else if ("CVER".equals (reportType))
            {
                tranNo = ((Element) XPath.selectSingleNode (params,
                        "params/param[@name='reportData']/ReportData/TransactionNumber")).getText ();

                // add parameters
                requestReportBuilder.addSpecificParameter ("P_COUNTER_PAYMENT", "Y");
                requestReportBuilder.addSpecificParameter ("P_TRAN_NO", tranNo);
                // requestReportBuilder.addSpecificParameter("BLANKPAGES", "Y"); // This cannot be used in Report Server
                // environment.

                // run CTR_RCPT (Counter Receipts) from the CM_CTR_RCPT module
                mRunReport ("CM_CTR_RCPT.rdf", requestReportBuilder);
            }
            else if ("PVER".equals (reportType))
            {
                reportDate = ((Element) XPath.selectSingleNode (params,
                        "params/param[@name='reportData']/ReportData/ReportDate")).getText ();

                // add receipt required and report number parameters
                requestReportBuilder.addSpecificParameter ("P_REPORT_ID", reportType + reportNumber);

                // run PVER (Passthrough Verification Report) from the CM_PVER module.
                mRunReport ("CM_PVER.rdf", requestReportBuilder);

                mDeleteReportData (params);
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return params;
    }

    /**
     * (non-Javadoc)
     * Runs Report.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mRunReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {

        Element RequestReportElement = null;
        Element paramsElement = null;
        Document reportParams = null;

        reportParams = new Document ();
        pRequestReportXMLBuilder.setReportModule (pReport);
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        paramsElement = XMLBuilder.getNewParamsElement (reportParams);
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        // Call the request report service via a proxy
        invokeLocalServiceProxy (REPORTS_SERVICE, REQUEST_REPORT, reportParams).getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Calls service to delete report data.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteReportData (final Document params) throws SystemException, BusinessException
    {

        Element psElement = null;

        psElement = invokeLocalServiceProxy (PAYMENT_SERVICE, DELETE_REPORT_DATA, params).getRootElement ();
    }

}
