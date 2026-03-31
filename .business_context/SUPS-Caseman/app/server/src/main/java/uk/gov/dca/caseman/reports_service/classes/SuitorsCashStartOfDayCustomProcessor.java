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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ExistenceCheckException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Reports Method: runStartOfDayReports
 * Class: SuitorsCashStartOfDayCustomProcessor.java
 * 
 * @author Anthony Bonnar
 *         Created: 15-11-2005
 * 
 *         Description: Start Of Day can only be run once per day by a single user, it is
 *         the first 'thing' that happens on any given working day.
 * 
 *         Change History:
 *         05-Apr-2006 Phil Haferer: TD 2688 "The printStackTrace() function of Exceptions is being called".
 *         Replaced a call to printStackTrace() in the process() method (in the catch() for the
 *         mReleaseConcurrentLock() call) with a call to log.error().
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 */
public class SuitorsCashStartOfDayCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";

    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";
    
    /** The Constant DELETE_REPORT_ITEMS. */
    private static final String DELETE_REPORT_ITEMS = "deleteReportDataItemsLocal";
    
    /** The Constant DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID. */
    private static final String DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID = "deleteReportDataItemsByTypeUseridLocal";

    /** The Constant SUITORS_CASH_START_OF_DAY_SERVICE. */
    private static final String SUITORS_CASH_START_OF_DAY_SERVICE = "ejb/SuitorsCashStartOfDayServiceLocal";
    
    /** The Constant GET_LATEST_ITEM_DATE. */
    private static final String GET_LATEST_ITEM_DATE = "getLatestItemDateLocal";
    
    /** The Constant GET_PAYMENT_SUMMARY. */
    private static final String GET_PAYMENT_SUMMARY = "getPaymentSummaryLocal";
    
    /** The Constant INCREMENT_SYSTEM_DATA. */
    private static final String INCREMENT_SYSTEM_DATA = "incrementSystemDataLocal";
    
    /** The Constant UPDATE_DCS_FINAL_FLAG. */
    private static final String UPDATE_DCS_FINAL_FLAG = "updateDcsFinalFlagLocal";
    
    /** The Constant GET_OUTSTANDING_COUNTER_VERIFICATIONS. */
    private static final String GET_OUTSTANDING_COUNTER_VERIFICATIONS = "getOutstandingCounterVerificationsLocal";
    
    /** The Constant INSERT_DCS_RECORD. */
    private static final String INSERT_DCS_RECORD = "insertDcsRecordLocal";

    /** The Constant SYSTEM_DATA_SERVICE. */
    private static final String SYSTEM_DATA_SERVICE = "ejb/SystemDataServiceLocal";
    
    /** The Constant GET_SYSTEM_DATA_ITEM. */
    private static final String GET_SYSTEM_DATA_ITEM = "getSystemDataItemLocal";

    /** The Constant START_OF_DAY_SERVICE. */
    private static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";

    /** The Constant UPDATE_START_OF_DAY_STATUS. */
    // Start Of Day Status - only allow Start Of Day to run once per day
    private static final String UPDATE_START_OF_DAY_STATUS = "insertSystemDataLocal";
    
    /** The Constant CHECK_START_OF_DAY_STATUS. */
    private static final String CHECK_START_OF_DAY_STATUS = "checkStartOfDayStatusLocal";

    /** The Constant GET_CONCURRENT_LOCK_STATUS. */
    // Start Of Day Concurrent Users - only single user to run the process at any one time
    private static final String GET_CONCURRENT_LOCK_STATUS = "getLockStatusLocal";
    
    /** The Constant CREATE_CONCURRENT_LOCK. */
    private static final String CREATE_CONCURRENT_LOCK = "insertReportDataLocal";
    
    /** The Constant RELEASE_CONCURRENT_LOCK. */
    private static final String RELEASE_CONCURRENT_LOCK = "deleteReportDataLocal";

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

        String userId = null;
        String cverUserId = null;
        String reportId = null;
        List<Element> OutstandingVerificationUserList = null;
        Element OutstandingVerificationtDetailsElement = null;
        Element OutstandingCounterVerificationDetails = null;
        Element dsElement = null;
        String cfoItemValue = null;
        final Element ds = new Element ("ds");
        final Document dom = new Document ();
        boolean sodRunning = false;

        try
        {
            // Issue a lock to indicate we are runnong the StartOfDay Process, we do not
            // want concurrent users running the process
            mCreateConcurrentLock (params);
        }
        catch (final ExistenceCheckException e)
        {
            // StartOfDay is currently running.
            final Element sodIsRunning = new Element ("SodIsRunning");
            ds.addContent (sodIsRunning);
            sodRunning = true;
        }

        if ( !sodRunning)
        {
            try
            {

                userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
                courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

                // Has StartOfDay already been run today ?
                if ( !mCheckStartOfDayStatus (courtId))
                {

                    final String yesterday = getYesterdaysDate ();

                    // Check for End Of Day processing.
                    if ( !mEndOfDayProcessing (courtId))
                    { // End Of Day processing for yesterday
                      // has not been run.

                        // All report entries for REPORT_TYPE = 'DSUM' are deleted
                        mDeleteDSUMEntries ();

                        // Get all outstanding Counter Verifications
                        dsElement = mGetOutstandingCounterVerifications ();

                        // Get all the children called "OutstandingVerificationUserList" and assign them to a list.
                        OutstandingVerificationUserList =
                                dsElement.getChildren ("OutstandingCounterVerificationDetails");

                        // If there are children, i.e. the Oustanding CVERs were found with the appropriate conditions
                        if (OutstandingVerificationUserList.size () > 0)
                        {
                            // Create the parent element
                            OutstandingCounterVerificationDetails =
                                    new Element ("OutstandingCounterVerificationDetails");

                            // Iterate through the elements
                            final Iterator<Element> iterator = OutstandingVerificationUserList.iterator ();

                            while (iterator.hasNext ())
                            {

                                // Create to requestReportBuilder (a object holding params which can be easily
                                // converted into XML for submission to report service) and load with common properties
                                requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                                        "", // String pPrintJobId
                                        "", // String pJobId
                                        courtId, // String pCourtCode
                                        userId // String pCourtUser
                                );

                                OutstandingVerificationtDetailsElement = (Element) iterator.next ();

                                // Get the UserId ID element
                                cverUserId = OutstandingVerificationtDetailsElement.getChild ("userId").getText ();
                                reportId = OutstandingVerificationtDetailsElement.getChild ("reportId").getText ();

                                // Generate the Outstanding Counter Verifications Report
                                requestReportBuilder.addSpecificParameter ("P_INPUT_BY", cverUserId);

                                mRunReport ("CM_CVER.rdf", requestReportBuilder);

                                // delete REPORT_DATA entries for REPORT_TYPE = 'CVER' and userID are deleted.
                                mDeleteCVEREntries (cverUserId);

                                // The FINAL flag on the DCS table is set to 'Y' for the report Identified by the
                                // reportId
                                mUpdateDCSFinalFlag (reportId);

                            } // end while
                        } // end if

                        // Create to requestReportBuilder (a object holding params which can be easily
                        // converted into XML for submission to report service) and load with common properties
                        requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                                "", // String pPrintJobId
                                "", // String pJobId
                                courtId, // String pCourtCode
                                userId // String pCourtUser
                        );
                        // Generate the previous days Daily Control Sheet
                        final String dateTime = mGetDateTime (courtId);
                        requestReportBuilder.addSpecificParameter ("D_DATE_TIME", dateTime);
                        mRunReport ("CM_DCS.rdf", requestReportBuilder);

                        // Create to requestReportBuilder (a object holding params which can be easily
                        // converted into XML for submission to report service) and load with common properties
                        requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                                "", // String pPrintJobId
                                "", // String pJobId
                                courtId, // String pCourtCode
                                userId // String pCourtUser
                        );
                        // Generate the previous days End of Day report
                        mRunReport ("CM_DSUM.rdf", requestReportBuilder);
                    }

                    // retrieve the latest item_value from system_Data where item ='CFO'
                    cfoItemValue = mGetSystemDataItemValue ();

                    // The SYSTEM_DATA record is incremented where ITEM='CFO'
                    mIncrementSystemDataForCFO ();

                    // Insert record into the DCS table for the report
                    mInsertDCSReportDetails (cfoItemValue, userId);

                    // Lock the d/b to ensure that the StartOfDay Process can only be run once per day.
                    mUpdateStartOfDayStatus (params);
                }
                else
                {

                    // Start Of Day has already run today.
                    final Element sodHasRun = new Element ("StartOfDayHasRun");
                    ds.addContent (sodHasRun);
                }
            }
            catch (final JDOMException e)
            {
                throw new SystemException (e);
            }
            catch (final ParseException e)
            {
                throw new SystemException (e);
            }
            finally
            {
                // Release the lock that ensure that only one user can run the StartOfDay Process, we do not
                // want concurrent users running the process
                mReleaseConcurrentLock ();
            }
        } // end isSodRunning

        /* Framework dictates that something must be returned to the client */
        dom.setRootElement (ds);
        return dom;
    }

    /**
     * (non-Javadoc)
     * Given date, check against the Payment Summary table
     * that the End Of Day process has been run.
     *
     * @param date the date
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayPaymentSummary (final String date, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDaySummary = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "date", date);
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
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mEndOfDayDcs (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
    {

        String endOfDayDcs = null;

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
        // Date is returned in format yyyy-mm-dd, we really want dd/mm/yyyy
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null || value.length () <= 0)
        {
            endOfDayDcs = null;
        }
        else
        {
            // bit of a fudge, but the date return from the d/b is not how we want it.
            final String day = value.substring (8);
            final String month = value.substring (5, 7);
            final String year = value.substring (0, 4);
            final String date = day + '/' + month + '/' + year;

            endOfDayDcs = date;
        }

        return endOfDayDcs;
    }

    /**
     * (non-Javadoc)
     * Delete all the REPORT_DATA records for the REPORT_TYPE = 'DSUM'.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteDSUMEntries () throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String reportType = "DSUM";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportType", reportType);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (REPORTS_SERVICE, DELETE_REPORT_ITEMS, inputDoc).getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Delete all the REPORT_DATA records for the REPORT_TYPE = 'CVER' and USERID.
     *
     * @param userId the user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteCVEREntries (final String userId) throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String reportType = "CVER";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportType", reportType);
        XMLBuilder.addParam (paramsElement, "userId", userId);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (REPORTS_SERVICE, DELETE_REPORT_ITEMS_BY_TYPE_AND_USERID, inputDoc)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Increment the ITEM field on the SYSTEM_DATA for ITEM = 'CFO'.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mIncrementSystemDataForCFO () throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String item = "CFO";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "item", item);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, INCREMENT_SYSTEM_DATA, inputDoc)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Update the FINAL field on the DCS table with the value of 'Y'
     * matching on ReportID and AdminCourtCode.
     *
     * @param cfoItemValue the cfo item value
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateDCSFinalFlag (final String cfoItemValue) throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String finalFlag = "Y";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "finalFlag", finalFlag);
        XMLBuilder.addParam (paramsElement, "reportId", cfoItemValue);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, UPDATE_DCS_FINAL_FLAG, inputDoc)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Insert a record ontothe DCS table with the values of
     * 
     * todaysDate, reportId, '0' 'D' 'Y' userId
     * matching on ReportID and AdminCourtCode.
     *
     * @param cfoItemValue the cfo item value
     * @param userId the user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertDCSReportDetails (final String cfoItemValue, final String userId)
        throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String reportId = "CFO " + cfoItemValue; // make the reportId in the format of 'CFO nnn'

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportId", reportId);
        XMLBuilder.addParam (paramsElement, "userId", userId);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);
        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, INSERT_DCS_RECORD, inputDoc)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Gets the outstanding Counter Verifications.
     *
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetOutstandingCounterVerifications () throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;

        final String reportType = "CVER";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportType", reportType);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        // Call the service.
        dsElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_OUTSTANDING_COUNTER_VERIFICATIONS,
                inputDoc).getRootElement ();

        return dsElement;
    } // End mGetOutstandingCounterVerifications()

    /**
     * (non-Javadoc)
     * Get details for system_data item.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetSystemDataItemValue () throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;
        Element valueElement = null;
        String itemValue = "0";
        final String pItem = "CFO";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "courtCode", courtId);
        XMLBuilder.addParam (paramsElement, "item", pItem);

        // Call the service.
        dsElement = invokeLocalServiceProxy (SYSTEM_DATA_SERVICE, GET_SYSTEM_DATA_ITEM, inputDoc).getRootElement ();

        valueElement = (Element) XPath.selectSingleNode (dsElement, "/ds/SystemData/ItemValue");
        if (null != valueElement)
        {
            itemValue = ((Element) XPath.selectSingleNode (dsElement, "/ds/SystemData/ItemValue")).getText ();
            ;
        }

        return itemValue;
    } // End mGetSystemDataItemValue()

    /**
     * (non-Javadoc)
     * Check to ensure that End Of Day Processing has or has not run.
     * 
     * - If the DCS table has no date record then it is safe to assume that
     * the End Of Month processing has run
     * - If the PaymentSummary table has an entry for 'Date' then the
     * 'end-of-day' has run.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayProcessing (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {
        boolean endOfDayProcessing = false;
        String date = null;

        date = mEndOfDayDcs (adminCourtCode);

        if (date == null)
        {
            endOfDayProcessing = true;
        }
        else
        {
            if (mEndOfDayPaymentSummary (date, adminCourtCode))
            {
                endOfDayProcessing = true;
            }
        }

        return endOfDayProcessing;
    }

    /**
     * Gets the yesterdays date.
     *
     * @return the yesterdays date
     */
    private String getYesterdaysDate ()
    {
        final SimpleDateFormat sdf = new SimpleDateFormat ("dd-MM-yyyy");

        final Calendar cal = new GregorianCalendar ();
        cal.add (Calendar.DATE, -1);
        final Date date = cal.getTime ();

        return sdf.format (date);
    }

    /**
     * Gets the todays date.
     *
     * @return the todays date
     */
    private String getTodaysDate ()
    {
        final SimpleDateFormat sdf = new SimpleDateFormat ("yyyy-MM-dd");

        final Calendar cal = new GregorianCalendar ();
        final Date date = cal.getTime ();

        final String newDate = sdf.format (date);

        return newDate.replaceAll ("-", "");
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
     * Release the lock on the d/b to indicate that the StartOfDay process has finished.
     * We dont want concurrent users to be running the process at the same time.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mReleaseConcurrentLock () throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        final String reportType = "SOD";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "reportType", reportType);
        XMLBuilder.addParam (paramsElement, "courtId", courtId);

        invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, RELEASE_CONCURRENT_LOCK, inputDoc)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Seems to be unused.
     * Place for a StartOfDay lock on the d/b to so we can determine if the process
     * is currently being run (or not).
     * We dont want concurrent users to be running the process at the same time.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckConcurrentLock (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        // Call the service with a date parameters.
        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_CONCURRENT_LOCK_STATUS, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/SodRunning/reportType";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ("SOD".equals (value))
        {
            throw new BusinessException ("Start of Day currently being run by another user.");
        }

        return false;
    }

    /**
     * (non-Javadoc)
     * Place a lock on the d/b to indicate that the StartOfDay process is currently being run.
     * We dont want concurrent users to be running the process at the same time.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCreateConcurrentLock (final Document params) throws SystemException, BusinessException
    {

        Element psElement = null;

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, CREATE_CONCURRENT_LOCK, params)
                .getRootElement ();

    }

    /**
     * (non-Javadoc)
     * Place a lock on the d/b to ensure that the StartOfDay process
     * can only be run ONCE per day.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateStartOfDayStatus (final Document params) throws SystemException, BusinessException
    {

        Element psElement = null;

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, UPDATE_START_OF_DAY_STATUS, params)
                .getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Check start of day status.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckStartOfDayStatus (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        Element psElement = null;
        Element paramsElement = null;
        Document inputDoc = null;
        String todaysDate = null;
        boolean retValue = false;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);

        todaysDate = getTodaysDate ();
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);
        XMLBuilder.addParam (paramsElement, "todaysDate", todaysDate);

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, CHECK_START_OF_DAY_STATUS, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/SodRun/status";
        String status = XMLBuilder.getXPathValue (psElement, returnValueXPath);

        if (status == null)
        {
            status = "0";
        }

        if (Integer.valueOf (status).intValue () > 0)
        {
            retValue = true;
        }

        return retValue;
    }

    /**
     * (non-Javadoc)
     * Get current date/time.
     *
     * @param adminCourtCode the admin court code
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private String mGetDateTime (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException, ParseException
    {

        String dateString = mEndOfDayDcs (adminCourtCode);

        final SimpleDateFormat sdf = new SimpleDateFormat ("dd/MM/yy");
        final SimpleDateFormat sdf1 = new SimpleDateFormat ("dd-MMM-yyyy");

        if (dateString == null)
        {
            // get todays date
            dateString = sdf.format (new java.util.Date ());
        }

        // format date into dd-MMM-yyyy (ie 01-Jan-2006)
        final Date date = sdf.parse (dateString);
        dateString = sdf1.format (date);

        return dateString;
    }

}
