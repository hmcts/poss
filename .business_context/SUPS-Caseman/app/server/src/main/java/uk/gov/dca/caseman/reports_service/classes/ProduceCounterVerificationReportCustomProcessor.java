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
 * Service: Reports Method: runStartOfDayReports
 * Class: ProduceCounterVerificationReportCustomProcessor.java
 * 
 * @author Mark Hallam
 *         Created: 18-01-2006
 * 
 *         Description: run the counter verification report for a given user,
 *         clear the report data and update the DCS final flag.
 * 
 *
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class ProduceCounterVerificationReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    // Services.

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";

    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";
    
    /** The Constant DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID. */
    private static final String DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID = "deleteReportDataItemsByTypeUseridLocal";

    /** The Constant COUNTER_VERIFICATIONS_SERVICE. */
    private static final String COUNTER_VERIFICATIONS_SERVICE = "ejb/CounterVerificationServiceLocal";
    
    /** The Constant UPDATE_DCS_FINAL_FLAG. */
    private static final String UPDATE_DCS_FINAL_FLAG = "updateDcsFinalFlagLocal";
    
    /** The Constant GET_REPORT_DATA. */
    private static final String GET_REPORT_DATA = "getReportDataLocal";
    
    /** The Constant GET_COUNTER_VERIFICATION_STATUS. */
    private static final String GET_COUNTER_VERIFICATION_STATUS = "getCounterVerificationStatusLocal";

    /** The court id. */
    private static String courtId;
    
    /** The user id. */
    private static String userId;

    /**
     * Process.
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
        final Element paramsElement = null;

        String cverUserId = null;
        String reportId = null;

        try
        {

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();
            cverUserId = ((Element) XPath.selectSingleNode (params, "params/param[@name='inputBy'")).getText ();

            if (mCheckReportsToPrint (cverUserId))
            {
                // Create to requestReportBuilder (a object holding params which can be easily
                // converted into XML for submission to report service) and load with common properties
                requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                        "", // String pPrintJobId
                        "", // String pJobId
                        courtId, // String pCourtCode
                        userId // String pCourtUser
                );

                // Generate the Outstanding Counter Verifications Report
                requestReportBuilder.addSpecificParameter ("P_INPUT_BY", cverUserId);
                mRunReport ("CM_CVER.rdf", requestReportBuilder);

                reportId = mGetReportId (cverUserId);

                // delete REPORT_DATA entries for REPORT_TYPE = 'CVER' and inputBy are deleted.
                mDeleteCVEREntries (cverUserId);

                // The FINAL flag on the DCS table is set to 'Y' for the report Identified by the reportId
                mUpdateDCSFinalFlag (reportId);
            }
            else
            {
                throw new BusinessException ("There are no counter payments to report on");
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
     * Delete all the REPORT_DATA records for the REPORT_TYPE = 'CVER' and USERID.
     *
     * @param cverUserId the cver user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteCVEREntries (final String cverUserId) throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String reportType = "CVER";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportType", reportType);
        XMLBuilder.addParam (paramsElement, "userId", cverUserId);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (REPORTS_SERVICE, DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID, inputDoc)
                .getRootElement ();
    }

    /**
     * Update the FINAL field on the DCS table with the value of 'Y'
     * matching on ReportID and AdminCourtCode.
     *
     * @param reportId the report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateDCSFinalFlag (final String reportId) throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String finalFlag = "Y";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "finalFlag", finalFlag);
        XMLBuilder.addParam (paramsElement, "reportId", reportId);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (COUNTER_VERIFICATIONS_SERVICE, UPDATE_DCS_FINAL_FLAG, inputDoc)
                .getRootElement ();
    }

    /**
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
     * Gets report id from counter verifications service.
     *
     * @param inputBy the input by
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetReportId (final String inputBy) throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "inputBy", inputBy);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement =
                invokeLocalServiceProxy (COUNTER_VERIFICATIONS_SERVICE, GET_REPORT_DATA, inputDoc).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/ReportData/reportId";
        return XMLBuilder.getXPathValue (psElement, returnValueXPath);
    }

    /**
     * M check reports to print.
     *
     * @param inputBy the input by
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckReportsToPrint (final String inputBy) throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        boolean reportsToPrint = false;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "inputBy", inputBy);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (COUNTER_VERIFICATIONS_SERVICE, GET_COUNTER_VERIFICATION_STATUS, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/CounterPayments/noOfCounterPaymments";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);

        if (value == null)
        {
            value = "0";
        }
        if (Integer.valueOf (value).intValue () > 0)
        {
            reportsToPrint = true;
        }

        return reportsToPrint;

    }
}
