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
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.co_event_service.java.ICoEventConfigDO;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Reports Method: runCoStartOfDayReports
 * Class: CoStartOfDayReportsCustomProcessor.java
 * 
 * @author Kevin Gichohi
 *         Created: 25-Oct-2005
 * 
 *         Description: Runs the CO Start of Day Reports (Consolidated Orders Menu/Run Start Of Day Reports)
 * 
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 
 *         30-May-2006 Chris Hutt (EDS): Add BMS task allocation. Defect 3395
 */
public class CoStartOfDayReportsCustomProcessor extends AbstractCasemanCustomProcessor
{
    /**
     * Reports service name.
     */
    public static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    /**
     * Request report method name.
     */
    public static final String REQUEST_REPORT = "runReportLocal";
    /**
     * Start of day service name.
     */
    public static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";
    /**
     * Get co event details method name.
     */
    public static final String GET_CO_EVENT_DETAILS = "getCoEventDetailsLocal";
    /**
     * Create co documents method name.
     */
    public static final String CREATE_CO_DOCUMENTS = "createCoDocumentsLocal";
    /**
     * Update co event details methos name.
     */
    public static final String UPDATE_CO_EVENT_DETAILS = "updateCoEventDetailsLocal";
    /**
     * Co event service name.
     */
    public static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";
    /**
     * Update co event bms method name.
     */
    public static final String UPDATE_CO_EVENT_BMS = "updateCoEventBmsLocal";

    /** The Constant CaseMan_No_N449_Msg. */
    // some private constants
    private static final String CaseMan_No_N449_Msg = "No outstanding N449s to be printed";
    
    /** The Constant CaseMan_No_EX223_Msg. */
    private static final String CaseMan_No_EX223_Msg = "No outstanding EX223s to be printed";
    
    /** The Constant CaseMan_No_AO_Paid_Notices_Msg. */
    private static final String CaseMan_No_AO_Paid_Notices_Msg = "No outstanding AO Paid Notices to be printed";
    
    /** The Constant CaseMan_No_N339_Msg. */
    private static final String CaseMan_No_N339_Msg = "No outstanding N339s to be printed";
    
    /** The Constant CaseMan_No_N61_Msg. */
    private static final String CaseMan_No_N61_Msg = "No outstanding N61s to be printed";
    
    /** The Constant CaseMan_No_TCO_DJ_Msg. */
    private static final String CaseMan_No_TCO_DJ_Msg = "No outstanding TCOs for judge to be printed";
    // Global variables

    /** The event id. */
    // event Id array declaration
    String[] eventId;

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

        String userId = null;
        String courtId = null;

        Element eventsElement = null;
        List<Element> eventIdsList = null;

        Element eventIdsElement = null;
        // String eventId = null;
        eventId = new String[6];

        Element dsElement = null;

        // Helper validation elements
        Element CoEventDetailsElement = null;

        List<Element> CoEventDetailsList = null;

        Element CoEventDetails = null;
        Element CoEventDetail = null;

        Element CoOrderTypeId = null;
        Element CoEventSeq = null; // Holds the event Id Sequence number element

        final String printNow = "Y"; // Holds the print now constant, always Y
        // String dailyReports = null; // Holds the daily report variable. For event ID 174, it's is "T", for all other
        // cases it is "Y"

        final Element CoErrorMsgs = new Element ("CoErrorMsgs"); // Holds the error message element
        final String CoErrorMsg = "CoErrorMsg"; // Holds the error message

        final Element ds = new Element ("ds"); // Parent element of the error messages
        final Document docErrorMsgs = new Document (); // Document to hold the parent element of the error messages

        ReportBMSHelper reportBmsHelper = null;

        try
        {

            eventsElement = (Element) XPath.selectSingleNode (params, "/params/param/Events");

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

            // Helper class for BMS
            reportBmsHelper = new ReportBMSHelper ();

            // Moved to CoInitialStartOfDayReportsCustomProcessor
            // mRunReport("CM_CO_R8.rdf", requestReportBuilder);
            // CoInitialStartOfDayReportsCustomProcessor
            // mRunReport("CM_CO_R1.rdf", requestReportBuilder);

            // Loop through event ids.
            eventIdsList = eventsElement.getChildren ("EventIds");

            // Initialise the count of the event id
            int count = 0;

            final Iterator<Element> it = eventIdsList.iterator ();
            while (it.hasNext ())
            {
                // Go to the event ids element
                eventIdsElement = (Element) it.next ();

                // Now we have the event id.
                eventId[count] = eventIdsElement.getChildText ("EventId");
                // if (eventId[count].equals("852")) //debug code!
                // {

                // Then retrive data from CO_EVENTS table for each of the events that satisfy the appropriate conditions
                // .
                // XPATH is ds/CoEventDetails/CoEventSeq and ds/CoEventDetails/CoOrderTypeId

                dsElement = mGetCoEventDetails (eventId[count], courtId);

                // Since more than one sequence number may be returned for the same event Id,

                // Get all the children called "CoEventDetails" and assign them to a list.
                CoEventDetailsList = dsElement.getChildren ("CoEventDetails");

                // If there are children, i.e. the event id was found with the appropriate conditions
                if (CoEventDetailsList.size () > 0)
                {
                    // Create the parent element
                    CoEventDetails = new Element ("CoEventDetails");

                    // Iterate through the elements
                    final Iterator<Element> iterator = CoEventDetailsList.iterator ();

                    while (iterator.hasNext ())
                    {
                        CoEventDetailsElement = (Element) iterator.next ();

                        // Add BMS details to the CO Event
                        mAddBMS (userId, reportBmsHelper, CoEventDetailsElement);

                        // Get the event order type ID element
                        CoOrderTypeId = CoEventDetailsElement.getChild ("CoOrderTypeId");

                        // Get the event ID sequence element
                        CoEventSeq = CoEventDetailsElement.getChild ("CoEventSeq");

                        // detach them from the parent.
                        CoOrderTypeId.detach ();
                        CoEventSeq.detach ();

                        // create an new element object
                        CoEventDetail = new Element ("CoEventDetail");

                        // add each child to a parent element
                        CoEventDetail.addContent (CoOrderTypeId);
                        CoEventDetail.addContent (CoEventSeq);

                        // Add the children to the parent
                        CoEventDetails.addContent (CoEventDetail);

                    } // End while (iterator.hasNext())

                    // Call the another service to generate the outputs.
                    mCreateCoDocuments (CoEventDetails, printNow, userId, courtId);

                    // null the elements.
                    CoEventDetails = null;
                    CoEventDetail = null;
                }
                else
                {
                    // pass an error here

                    switch (count)
                    {
                        case 0: // 1st event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_N449_Msg);

                            break;
                        case 1: // 2nd event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_EX223_Msg);

                            break;
                        case 2: // 3rd event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_AO_Paid_Notices_Msg);

                            break;
                        case 3: // 4th event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_N339_Msg);

                            break;
                        case 4: // 5th event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_N61_Msg);

                            break;
                        case 5: // 6th event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (CoErrorMsgs, CoErrorMsg, CaseMan_No_TCO_DJ_Msg);

                            break;
                        default:
                            break;
                    }

                } // End if (CoEventDetailsList.size() < 1)

                // increment the counter
                count++;

                // } // end if (eventId[count].equals("852"))

            } // End while (it.hasNext())

            // If there is at least one error message
            if (CoErrorMsgs.getChildren ().size () > 0)
            {
                // Add it/them to the parent
                ds.addContent (CoErrorMsgs);
            }
            // Add the parent to the document
            docErrorMsgs.setRootElement (ds);

            // For each of the event IDs, set the process_stage column to 'REP' where it is 'AUTO'
            mUpdateCoEventDetails (courtId);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final ParseException pe)
        {
            throw new SystemException (pe);
        }
        /* Return the error messages if any */
        return docErrorMsgs;

    }

    /**
     * M run report.
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
    } // End mRunReport()

    /**
     * M get co event details. Gets the row of the entered CO Event.
     *
     * @param pEventId the event id
     * @param pCourtId the court id
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetCoEventDetails (final String pEventId, final String pCourtId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "eventId", pEventId);
            XMLBuilder.addParam (paramsElement, "courtId", pCourtId);

            // Call the service.
            dsElement =
                    invokeLocalServiceProxy (START_OF_DAY_SERVICE, GET_CO_EVENT_DETAILS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;

        }

        return dsElement;
    } // End mGetCoEventDetails()

    /**
     * M add BMS. Add BMS details to the CO Event.
     *
     * @param pUserId the user id
     * @param reportBMSHelper the report BMS helper
     * @param pCoEventDetailsElement the co event details element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void mAddBMS (final String pUserId, final ReportBMSHelper reportBMSHelper,
                          final Element pCoEventDetailsElement)
        throws BusinessException, SystemException, JDOMException, ParseException
    {
        final String coEventSeq = pCoEventDetailsElement.getChildText ("CoEventSeq");
        final String standardEventId = pCoEventDetailsElement.getChildText ("StandardEventId");
        final String receiptDate = pCoEventDetailsElement.getChildText ("ReceiptDate");
        final String eventDate = pCoEventDetailsElement.getChildText ("EventDate");

        String caseNumber = null;
        String caseType = null;
        String eventTypeFlag = null;
        String bmsTaskNumber = null;
        String statsModule = null;
        final String sXml = null;
        final String systemDate = null;
        String issueStage = null;
        String userCourt = "";
        String userSection = "";
        Element userDetailsElement = null;
        final Element dsElement = null;
        Element userCourtElement = null;
        String ageCategory = null;
        ICoEventConfigDO coEventConfigDO = null;
        Document inputDoc = null;
        Element paramsElement = null;

        coEventConfigDO = reportBMSHelper.getCoEventConfig (standardEventId);
        if (coEventConfigDO.isBMSTaskRequired ())
        {

            // Construct the parameters required for retrieving
            // BMS Task Number and Stats Module values.
            caseNumber = "";
            caseType = "ALL";
            eventTypeFlag = "C";
            issueStage = "ISS";

            // Retrieve the values themselves.
            bmsTaskNumber = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "B",
                    "BMSTaskDescription", eventTypeFlag, issueStage);
            statsModule = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "S",
                    "StatsModDescription", eventTypeFlag, issueStage);

            // Retrieve the user court and section details
            userDetailsElement = reportBMSHelper.getSectionDetail (pUserId);
            if (null != userDetailsElement)
            {
                userCourtElement = userDetailsElement.getChild ("UserCourt");
                if (null != userCourtElement)
                {
                    userCourt = userCourtElement.getChildText ("CourtCode");
                    userSection = userCourtElement.getChildText ("SectionName");
                }
            }

            ageCategory = reportBMSHelper.determineTaskAge (receiptDate, eventDate);

            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "cOEventSeq", coEventSeq);
            XMLBuilder.addParam (paramsElement, "bmsTask", bmsTaskNumber);
            XMLBuilder.addParam (paramsElement, "statsModule", statsModule);
            XMLBuilder.addParam (paramsElement, "ageCategory", ageCategory);
            XMLBuilder.addParam (paramsElement, "creatingCourt", userCourt);
            XMLBuilder.addParam (paramsElement, "creatingSection", userSection);

            // Call the request report service via a proxy
            invokeLocalServiceProxy (CO_EVENT_SERVICE, UPDATE_CO_EVENT_BMS, inputDoc).getRootElement ();

        }
    }

    /**
     * M create co documents. Create and Send the required documents.
     *
     * @param pCoEventDetails the co event details
     * @param pPrintNow the print now
     * @param pUserId the user id
     * @param pCourtId the court id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCreateCoDocuments (Element pCoEventDetails, final String pPrintNow, final String pUserId,
                                     final String pCourtId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "coEventDetails", pCoEventDetails);
            XMLBuilder.addParam (paramsElement, "printNow", pPrintNow);
            XMLBuilder.addParam (paramsElement, "userId", pUserId);
            XMLBuilder.addParam (paramsElement, "courtId", pCourtId);

            // Call the service.
            invokeLocalServiceProxy (START_OF_DAY_SERVICE, CREATE_CO_DOCUMENTS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
            pCoEventDetails = null;

        }

    } // End mCreateDocuments()

    /**
     * M update co event details. Update the row of the entered CO Event.
     *
     * @param pCourtId the court id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCoEventDetails (final String pCourtId) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {

            // Build the params document
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);

            // Position of the event ID in the array
            String eventIdPosition = "0";
            for (int i = Integer.parseInt (eventIdPosition); i < eventId.length; i++)
            {
                // increment the event id position
                eventIdPosition = Integer.toString (i + 1);
                // insert the param into the the params document
                XMLBuilder.addParam (paramsElement, "eventId" + eventIdPosition, eventId[i]);

            }
            // add the courtId
            XMLBuilder.addParam (paramsElement, "courtId", pCourtId);

            // Call the service.
            invokeLocalServiceProxy (START_OF_DAY_SERVICE, UPDATE_CO_EVENT_DETAILS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;

        }

    } // End mUpdateCoEventDetails{}
}
