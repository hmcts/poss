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

import java.text.SimpleDateFormat;

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
 * Service: Reports Method: runEndOfDayReports
 * Class: EndOfDayReportsCustomProcessor.java
 * 
 * @author Mark Hallam
 *         Created: 16-Nov-2005
 * 
 *         Description:
 * 
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class SuitorsCashEndOfDayReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    // Services.

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";

    /** The Constant SUITORS_CASH_START_OF_DAY_SERVICE. */
    private static final String SUITORS_CASH_START_OF_DAY_SERVICE = "ejb/SuitorsCashStartOfDayServiceLocal";
    
    /** The Constant GET_LATEST_ITEM_DATE. */
    private static final String GET_LATEST_ITEM_DATE = "getLatestItemDateLocal";
    
    /** The Constant GET_PAYMENT_SUMMARY. */
    private static final String GET_PAYMENT_SUMMARY = "getPaymentSummaryLocal";
    
    /** The Constant DELETE_REPORT_ITEMS. */
    private static final String DELETE_REPORT_ITEMS = "deleteReportDataItemsLocal";
    
    /** The Constant GET_TOTAL_DCS. */
    private static final String GET_TOTAL_DCS = "getTotalDcsLocal";
    
    /** The Constant GET_FINAL_DCS. */
    private static final String GET_FINAL_DCS = "getFinalDcsLocal";

    /** The Constant REPORTS_STILL_TO_BE_PRINTED_MESSAGE. */
    private static final String REPORTS_STILL_TO_BE_PRINTED_MESSAGE =
            "There are still verification/reconciliation reports to be printed";
    
    /** The Constant END_OF_DAY_ALERADY_RUN_MESSAGE. */
    private static final String END_OF_DAY_ALERADY_RUN_MESSAGE = "End of Day Report has alerady been run today";

    /** The court id. */
    private static String courtId = null;

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
        final Element paramsElement = null;
        Document responseDoc = null;

        String userId = null;

        try
        {

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            // Check for End Of Day processing.
            final SimpleDateFormat sdf = new SimpleDateFormat ("dd-MM-yyyy");
            final String today = sdf.format (new java.util.Date ());

            if ( !mEndOfDayProcessing (today, courtId))
            { // End Of Day processing has not been run.

                // Check verification/reconcilation reports to be printed
                if ( !mReportsToBePrinted (today, courtId))
                {

                    // Create to requestReportBuilder (a object holding params which can be easily
                    // converted into XML for submission to report service) and load with common properties
                    requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                            "", // String pPrintJobId
                            "", // String pJobId
                            courtId, // String pCourtCode
                            userId // String pCourtUser
                    );

                    // Generate the previous days End of Day report
                    responseDoc = mRunReport ("CM_DSUM.rdf", requestReportBuilder);

                }
                else
                {
                    throw new BusinessException (REPORTS_STILL_TO_BE_PRINTED_MESSAGE);
                }

            }
            else
            {
                throw new BusinessException (END_OF_DAY_ALERADY_RUN_MESSAGE);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return responseDoc;
    }

    /**
     * (non-Javadoc)
     * Runs report.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document mRunReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {

        Element RequestReportElement = null;
        Element paramsElement = null;
        Document reportParams = null;
        Document response = null;

        reportParams = new Document ();
        pRequestReportXMLBuilder.setReportModule (pReport);
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        paramsElement = XMLBuilder.getNewParamsElement (reportParams);
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        // Call the request report service via a proxy
        response = invokeLocalServiceProxy (REPORTS_SERVICE, REQUEST_REPORT, reportParams);

        return response;

    }

    /**
     * (non-Javadoc)
     * Given todays date, check against the Payment Summary table
     * that the End Of Day process has been run.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayPaymentSummary (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDaySummary = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "date", today);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);
        // Call the service with a date parameters.
        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_PAYMENT_SUMMARY, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/Total";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        if (Integer.valueOf (value).intValue () > 0)
        {
            endOfDaySummary = true;
        }

        return endOfDaySummary;
    }

    /**
     * (non-Javadoc)
     * Check against the DCS table.
     * If the DCS table has no date record then it is safe to assume
     * that the End Of Month processing has run
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayDcs (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDayDcs = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_LATEST_ITEM_DATE, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/ItemDate";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {

            endOfDayDcs = true;
        }

        return endOfDayDcs;
    }

    /**
     * (non-Javadoc)
     * Check to ensure that End Of Day Processing has or has not run.
     * 
     * - If the DCS table has no date record then it is safe to assume that
     * the End Of Month processing has run
     * - If the PaymentSummary table has an entry for 'todaysDate' then the
     * 'end-of-day' has run.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayProcessing (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {
        boolean endOfDayProcessing = false;
        if (mEndOfDayDcs (adminCourtCode))
        {
            endOfDayProcessing = true;
        }
        else
        {
            if (mEndOfDayPaymentSummary (today, adminCourtCode))
            {
                endOfDayProcessing = true;
            }
        }

        return endOfDayProcessing;
    }

    /**
     * (non-Javadoc)
     * Check if any verification or receonciliatoin Reports are still to be printed.
     * 
     * - if count of dcs table where item_date = today is zero (total_dcs)
     * - If count of dcs table where item_date = today and final = 'y' (final_dcs) = total_dcs
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mReportsToBePrinted (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {
        return mGetFinalDcs (today, adminCourtCode) != 0;
    }

    /**
     * (non-Javadoc)
     * Get the number of records from dcs where item_date = today and final = 'Y'.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return the int
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private int mGetFinalDcs (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        int finalDcs = 0;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "date", today);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        // Call the service with a date parameters.
        psElement =
                invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_FINAL_DCS, inputDoc).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/FinalDcs";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        finalDcs = Integer.valueOf (value).intValue ();

        return finalDcs;
    }

}
