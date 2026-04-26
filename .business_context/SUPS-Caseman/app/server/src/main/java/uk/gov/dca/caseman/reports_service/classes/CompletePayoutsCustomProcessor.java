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
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Reports Method: runCompletePayoutReports
 * Class: CompletePayoutCustomProcessor.java
 * 
 * @author Anthony Bonnar
 *         Created: 22-11-2005
 * 
 *         Description:
 * 
 *         Change History:
 *         17-Jan-2005 Phil Haferer & Paul Robinson: Added the method mPayoutUpdate() to implement
 *         "Use Case 74: Complete Payout", together with its' supporting methods that call other services.
 *         27-Jan-2005 Phil Haferer: Restructured the functionality in mPayoutUpdate() so that it can have its' own
 *         transasction, and so commit its' changes before calling the reports.
 *         28-mar-2006 Chris Hutt
 *         defect 2640: BMS params wrong, so no BMS count
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         02-Jul-2006 Steve Blair:
 *         Added ability to override default code code and user name as these need not necessarily
 *         be the same as the user's when called from Remove Payments Lock screen.
 */
public class CompletePayoutsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public CompletePayoutsCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * Reports service name.
     */
    public static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    /**
     * Request report method name.
     */
    public static final String REQUEST_REPORT = "requestReportLocal";

    /** The Constant PAYOUT_SERVICE. */
    private static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";
    
    /** The Constant TRANSACTIONAL_COMPLETE_PAYOUTS_METHOD. */
    private static final String TRANSACTIONAL_COMPLETE_PAYOUTS_METHOD = "transactionalCompletePayoutsLocal";
    
    /** The Constant START_OF_DAY_SERVICE. */
    private static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";
    
    /** The Constant COMPLETE_PAYOUT_LOCK. */
    private static final String COMPLETE_PAYOUT_LOCK = "insertUpdateRunStartOfDayStatusLocal";
    /**
     * Get payable orders printed count method name.
     */
    public static final String GET_PAYABLE_ORDERS_PRINTED_COUNT = "getPayableOrdersPrintedCountLocal";

    /** The Constant CANCEL_COMPLETE_PAYOUT_METHOD. */
    private static final String CANCEL_COMPLETE_PAYOUT_METHOD = "cancelCompletePayoutLocal";
    
    /** The Constant CANCEL_DIVIDEND_PAYOUT_METHOD. */
    private static final String CANCEL_DIVIDEND_PAYOUT_METHOD = "cancelDividendPayoutLocal";

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
        Element paramsElement = null;

        String userId = null;
        String courtId = null;

        String xButtonState = null;
        String runDivIndicator = null;
        String endOfDayRunIndicator = null;
        String payoutLockIndicator = null;

        try
        {
            // Use default user ID if not specifically provided.
            final Element userElement =
                    (Element) XPath.selectSingleNode (params, "params/param[@name='reportData']/ReportData/UserID");
            if (userElement != null)
            {
                userId = userElement.getText ();
            }
            else
            {
                userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId']")).getText ();
            }

            // Use default user court code if court not specifically provided.
            final Element courtElement =
                    (Element) XPath.selectSingleNode (params, "params/param[@name='reportData']/ReportData/CourtCode");
            if (courtElement != null)
            {
                courtId = courtElement.getText ();
            }
            else
            {
                courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId']")).getText ();
            }

            // Find out whether the application has been closed by clicking the X button
            xButtonState =
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='xButtonClicked']")).getText ();

            // Find out if we have come from the dividend ot payout screens
            runDivIndicator =
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='runDivIndicator']")).getText ();

            // Find out if end of day has run and whether we have locked the payout screen
            endOfDayRunIndicator =
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='endOfDayRunIndicator']"))
                            .getText ();
            payoutLockIndicator =
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='payoutLockIndicator']")).getText ();

            // Create to requestReportBuilder (a object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    courtId, // String pCourtCode
                    userId // String pCourtUser
            );

            // Place a lock so that the Complete Payout Option can only be run once a day
            mCompletePayoutLock (params);

            // Generate the CO Dividend Fee List Report - UC071
            mRunReport ("CM_CO_R2.rdf", requestReportBuilder);

            // Generate the Payable Order Schedule Report - UC072
            mRunReport ("CM_PYNOT.rdf", requestReportBuilder);

            // Generate the Payable Order Schedule Report - UC073
            mRunReport ("CM_PYSCH.rdf", requestReportBuilder);

            // Generate the Address Unknown Report - UC070
            requestReportBuilder.addSpecificParameter ("P_SUBMITTED_BY", userId);
            mRunReport ("CM_CO_R5.rdf", requestReportBuilder);

            final String payableOrdersCount = mPayableOrdersPrintedCount (courtId);

            // Complete the Payout.
            mPayoutUpdate (courtId, userId);

            // Create parameters for the BMS creation service (BMS.P_LOG_ACTION)
            paramsElement = XMLBuilder.getNewParamsElement ();

            XMLBuilder.addParam (paramsElement, "section", "PAYOUT");
            XMLBuilder.addParam (paramsElement, "courtCode", courtId);
            XMLBuilder.addParam (paramsElement, "count", payableOrdersCount);
            XMLBuilder.addParam (paramsElement, "taskType", "B");
            XMLBuilder.addParam (paramsElement, "payoutType", "PAYOUT");
            XMLBuilder.addParam (paramsElement, "userId", userId);

            // Translate to string
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            localServiceProxy.getJDOM ("ejb/BmsServiceLocal", "addBmsRuleNonEventLocal", sXmlParams);

            // if the browser has been closed using the 'X' button; Call cancelPrintPayouts to cancel any locks that
            // have been made
            if (xButtonState.equals ("true"))
            {
                cancelPrintPayouts (courtId, runDivIndicator, endOfDayRunIndicator, payoutLockIndicator);
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
     * Completes payouts.
     *
     * @param pCourtId the court id
     * @param pUserId the user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mPayoutUpdate (final String pCourtId, final String pUserId) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "courtId", pCourtId);
            XMLBuilder.addParam (paramsElement, "userId", pUserId);

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, TRANSACTIONAL_COMPLETE_PAYOUTS_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mPayoutUpdate

    /**
     * (non-Javadoc)
     * Place a lock on the d/b so that no users can run the
     * CompletePayout process more than once a day.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCompletePayoutLock (final Document params) throws SystemException, BusinessException
    {

        Element psElement = null;

        try
        {
            psElement = invokeLocalServiceProxy (START_OF_DAY_SERVICE, COMPLETE_PAYOUT_LOCK, params).getRootElement ();

        }
        finally
        {

        }

    } // mCompletePayoutLock

    /**
     * (non-Javadoc)
     * Gets payable orders printed count.
     *
     * @param adminCourtCode the admin court code
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mPayableOrdersPrintedCount (final String adminCourtCode)
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

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDERS_PRINTED_COUNT, inputDoc)
                    .getRootElement ();

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

        return value;
    }

    /**
     * (non-Javadoc)
     * Cancels dividend payouts.
     *
     * @param adminCourtCode the admin court code
     * @param runDivIndicator the run div indicator
     * @param endOfDayRunIndicator the end of day run indicator
     * @param payoutLockIndicator the payout lock indicator
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void cancelPrintPayouts (final String adminCourtCode, final String runDivIndicator,
                                     final String endOfDayRunIndicator, final String payoutLockIndicator)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);

            // add the admin court code
            XMLBuilder.addParam (paramsElement, "courtId", adminCourtCode);

            if (runDivIndicator.equals ("true")) // We have come from the RunDividend Screen, so we need to release the
                                                 // DividendPayout Lock (DIV)
            {
                invokeLocalServiceProxy (PAYOUT_SERVICE, CANCEL_DIVIDEND_PAYOUT_METHOD, inputDoc).getRootElement ();

            }
            else // we have come from complete payout screen
            {
                if (endOfDayRunIndicator.equals ("true") || payoutLockIndicator.equals ("true"))

                {
                    invokeLocalServiceProxy (PAYOUT_SERVICE, CANCEL_COMPLETE_PAYOUT_METHOD, inputDoc).getRootElement ();
                }
            }

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

    } // end cancelPrintPayouts()

}
