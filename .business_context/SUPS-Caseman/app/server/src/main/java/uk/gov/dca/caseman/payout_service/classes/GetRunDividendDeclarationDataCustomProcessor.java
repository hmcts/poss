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
package uk.gov.dca.caseman.payout_service.classes;

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
 * Service: Payout Method: getRunDividendDeclaration
 * Class: GetRunDividendDeclarationDataCustomProcessor.java @author Chris Vincent
 * Created: 09-Feb-2006
 * 
 * Description:
 * 
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 05-Sep-2006 Mark Groen (EDS): Date in wrong format and therefore never retrieves anything from database . Defect 4971
 * 
 */
public class GetRunDividendDeclarationDataCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Payout service name.
     */
    public static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";
    /**
     * Start of day service name.
     */
    public static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";
    /**
     * Suitors cash start of day service name.
     */
    public static final String SUITORS_CASH_START_OF_DAY_SERVICE = "ejb/SuitorsCashStartOfDayServiceLocal";
    /**
     * Dividends service name.
     */
    public static final String DIVIDENDS_SERVICE = "ejb/CoDividendServiceLocal";
    /**
     * Court service name.
     */
    public static final String COURT_SERVICE = "ejb/CourtServiceLocal";

    /**
     * Start of day status method name.
     */
    public static final String START_OF_DAY_STATUS = "getRunStartOfDayStatusLocal";
    /**
     * Get dividends declared method name.
     */
    public static final String GET_DIVIDENDS_DECLARED = "getDividendsDeclaredLocal";
    /**
     * Get latest item date method name.
     */
    public static final String GET_LATEST_ITEM_DATE = "getLatestItemDateLocal";
    /**
     * Get payment summary method name.
     */
    public static final String GET_PAYMENT_SUMMARY = "getPaymentSummaryLocal";
    /**
     * Get payout running status method name.
     */
    public static final String GET_PAYOUT_RUNNING_STATUS = "getPayoutRunningStatusLocal";
    /**
     * Get payable order header method name.
     */
    public static final String GET_PAYABLE_ORDER_HEADER = "getPayableOrderHeaderLocal";
    /**
     * Get payable order count method name.
     */
    public static final String GET_PAYABLE_ORDER_COUNT = "getPayableOrderCountLocal";
    /**
     * Insert report data method name.
     */
    public static final String INSERT_REPORT_DATA = "insertReportDataLocal";
    /**
     * Get court data method name.
     */
    public static final String GET_COURT_DATA = "getCourtDetailsLocal";

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
        final Document dom = new Document ();
        final Element dsNode = new Element ("ds");
        final Element validationNode = new Element ("ValidationData");
        final Element courtDataNode = new Element ("CourtData");
        String adminCourtCode = null;
        String courtName = null;
        String runDate = null;
        String systemDate = null;
        boolean blnContinue = true;

        try
        {
            adminCourtCode = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();
            runDate = ((Element) XPath.selectSingleNode (params, "params/param[@name='runDate'")).getText ();
            systemDate = ((Element) XPath.selectSingleNode (params, "params/param[@name='systemDate'")).getText ();
            courtName = mGetCourtName (adminCourtCode);

            // Setup the court data nodes
            final Element courtCodeNode = new Element ("CourtCode");
            courtCodeNode.setText (adminCourtCode);
            final Element courtNameNode = new Element ("CourtName");
            courtNameNode.setText (courtName);
            courtDataNode.addContent (courtCodeNode);
            courtDataNode.addContent (courtNameNode);

            final Element startOfDayRunNode = new Element ("StartOfDayRun");
            if (mGetStartOfDayStatus (adminCourtCode, runDate, systemDate))
            {
                // Start of Day has already been run, can continue calling services
                startOfDayRunNode.setText ("true");
            }
            else
            {
                // Start of Day has not yet been run, do not continue as screen will have to navigate
                // to the Start of Day screen
                blnContinue = false;
                startOfDayRunNode.setText ("false");
            }

            final Element endOfDayRunNode = new Element ("EndOfDayRun");
            if (blnContinue && !mEndOfDayProcessing (systemDate, adminCourtCode))
            {
                // End of Day has not been run and Start of Day has been run, continue calling services
                endOfDayRunNode.setText ("false");
            }
            else
            {
                // End of Day has already been run, do not continue
                blnContinue = false;
                endOfDayRunNode.setText ("true");
            }

            final Element payoutRunNode = new Element ("PayoutRun");
            if (blnContinue)
            {
                final String payoutRunningStatus = mPayoutRunning (adminCourtCode);
                if (payoutRunningStatus == "NONE")
                {
                    // Neither the Payout or Dividend Payout has run or is being run
                    if (mPayableOrderHeader (adminCourtCode))
                    {
                        // The weekly payout is the latest
                        if ( !mPayableOrderCount (adminCourtCode))
                        {
                            // The data is not historical data, set the lock
                            mCreateLock (params);
                            payoutRunNode.setText (payoutRunningStatus);
                        }
                        else
                        {
                            blnContinue = false;
                            payoutRunNode.setText ("HIST");
                        }
                    }
                    else
                    {
                        // Payout was for a dividend run.
                        mCreateLock (params);
                        payoutRunNode.setText (payoutRunningStatus);
                    }
                }
                else
                {
                    // Either the Payout/Dividend Payout has run or is being run, do not continue
                    blnContinue = false;
                    payoutRunNode.setText (payoutRunningStatus);
                }
            }
            else
            {
                payoutRunNode.setText ("false");
            }

            validationNode.addContent (startOfDayRunNode);
            validationNode.addContent (endOfDayRunNode);
            validationNode.addContent (payoutRunNode);
            dsNode.addContent (courtDataNode);
            dsNode.addContent (validationNode);

            if (blnContinue)
            {
                // Validation passed, call the get Dividends Declared Service
                final Element dividendsNode = mGetDividendsDeclared (params);
                dsNode.addContent (dividendsNode);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        dom.setRootElement (dsNode);
        return dom;
    }

    /**
     * (non-Javadoc)
     * Get the start of day status.
     *
     * @param adminCourtCode the admin court code
     * @param runDate the run date
     * @param systemDate the system date
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mGetStartOfDayStatus (final String adminCourtCode, final String runDate, final String systemDate)
        throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);
            XMLBuilder.addParam (paramsElement, "runDate", runDate);
            XMLBuilder.addParam (paramsElement, "systemDate", systemDate);

            // Call the get start of day status
            psElement = invokeLocalServiceProxy (START_OF_DAY_SERVICE, START_OF_DAY_STATUS, inputDoc).getRootElement ();
        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String value = XMLBuilder.getXPathValue (psElement, "/ds/StartOfDay");
        return null == value ? false : true;
    }

    /**
     * M end of day payment summary. Given todays date, check against the Payment Summary table
     * that the End Of Day process has been run.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayPaymentSummary (String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDaySummary = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {

            // defect 4971 - date in wrong format and therefore never retrieves anything from database
            // Left date as is until here as might be used else where in this format - in fact it is in checking
            // startOfDay
            // Copied this code from SuitorsCashEndOfDayReportCustomProcessor
            final SimpleDateFormat sdf = new SimpleDateFormat ("dd-MM-yyyy");
            today = sdf.format (new java.util.Date ());

            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "date", today);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            // Call the service with a date parameters.
            psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_PAYMENT_SUMMARY, inputDoc)
                    .getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

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
     * M end of day dcs. Check against the DCS table.
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

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_LATEST_ITEM_DATE, inputDoc)
                    .getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/ItemDate";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (null == value)
        {
            endOfDayDcs = true;
        }

        return endOfDayDcs;
    }

    /**
     * M end of day processing. Check to ensure that End Of Day Processing has or has not run.
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
     * M payout running.
     *
     * @param adminCourtCode the admin court code
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mPayoutRunning (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        String mPayoutRunning = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            // Call the service with a date parameters.
            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYOUT_RUNNING_STATUS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PayoutRunning/reportType";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ("PAY".equals (value))
        {
            // The Payout report has already been run or is being run
            mPayoutRunning = "PAYOUT";
        }
        else if ("DIV".equals (value))
        {
            // The Dividend Payout report has already been run or is being run
            mPayoutRunning = "DIV";
        }
        else
        {
            // Neither the Payout or the Dividend Payout have been run or are being run
            mPayoutRunning = "NONE";
        }

        return mPayoutRunning;
    }

    /**
     * M payable order header.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPayableOrderHeader (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean weeklyPayout = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_HEADER, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PayableOrderHeader/reportId";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ( !"DIV".equals (value))
        {
            weeklyPayout = true;
        }

        return weeklyPayout;
    }

    /**
     * M payable order count.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPayableOrderCount (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean historic = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_COUNT, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/payableOrders/payableOrders";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        if (Integer.valueOf (value).intValue () > 0)
        {
            historic = true;
        }

        return historic;
    }

    /**
     * M create lock.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCreateLock (final Document params) throws SystemException, BusinessException
    {
        Element psElement = null;
        try
        {
            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, INSERT_REPORT_DATA, params).getRootElement ();

        }
        finally
        {
        }
    }

    /**
     * M get dividends declared.
     *
     * @param params the params
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetDividendsDeclared (final Document params) throws SystemException, BusinessException
    {
        Element psElement = null;
        try
        {
            psElement = invokeLocalServiceProxy (DIVIDENDS_SERVICE, GET_DIVIDENDS_DECLARED, params).getRootElement ();

            psElement.detach ();
        }
        finally
        {
        }
        return psElement;
    }

    /**
     * M get court name.
     *
     * @param adminCourtCode the admin court code
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetCourtName (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "courtId", adminCourtCode);

            psElement = invokeLocalServiceProxy (COURT_SERVICE, GET_COURT_DATA, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/Court/CourtDetails/Name";
        String courtName = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (null == courtName)
        {
            courtName = "";
        }
        return courtName;
    }
}