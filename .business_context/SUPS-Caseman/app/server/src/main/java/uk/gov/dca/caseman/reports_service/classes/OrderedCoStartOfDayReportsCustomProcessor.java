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
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Class to create CO start of day reports in an ordered batch.
 * 
 * @author Paul Roberts
 *
 */
public class OrderedCoStartOfDayReportsCustomProcessor extends AbstractOrderedBatchReportBase
{
    
    /**
     * Instantiates a new ordered co start of day reports custom processor.
     *
     * @throws JDOMException the JDOM exception
     */
    public OrderedCoStartOfDayReportsCustomProcessor () throws JDOMException
    {
        mReportModuleGroup = "CO";
    }

    /** The Constant CO_EVENT_SERVICE. */
    // Services
    private static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";

    /** The Constant GET_CO_EVENT_DETAILS. */
    private static final String GET_CO_EVENT_DETAILS = "getCoEventDetailsLocal";
    
    /** The Constant UPDATE_CO_EVENT_DETAILS. */
    private static final String UPDATE_CO_EVENT_DETAILS = "updateCoEventDetailsLocal";
    
    /** The Constant UPDATE_CO_EVENT_BMS. */
    private static final String UPDATE_CO_EVENT_BMS = "updateCoEventBmsLocal";

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
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (OrderedCoStartOfDayReportsCustomProcessor.class);

    /**
     * {@inheritDoc}
     */
    public Document process (final Document params, final Log pLog) throws BusinessException, SystemException
    {
        final Element CoErrorMsgs = new Element ("CoErrorMsgs"); // Holds the error message element
        final String CoErrorMsg = "CoErrorMsg"; // Holds the error message
        final Element ds = new Element ("ds"); // Parent element of the error messages
        final Document docErrorMsgs = new Document (); // Document to hold the parent element of the error messages

        ReportBMSHelper reportBmsHelper = null;

        try
        {
            final Element eventsElement = (Element) XPath.selectSingleNode (params, "/params/param/Events");
            mUserId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            mCourtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            // Helper class for BMS
            reportBmsHelper = new ReportBMSHelper ();

            final Document fwDom = new Document (); // Used to store the report request parameter dom.
            addRequestElement (fwDom);

            // Initialise the count of the event id
            int count = 0;
            // Loop through event ids.
            final List<Element> eventIdsList = eventsElement.getChildren ("EventIds");
            final Iterator<Element> it = eventIdsList.iterator (); // Global variables
            final String[] eventId = new String[6];
            while (it.hasNext ())
            {
                // Go to the event ids element
                final Element eventIdsElement = (Element) it.next ();

                // Now we have the event id.

                eventId[count] = eventIdsElement.getChildText ("EventId");

                // Then retrive data from CO_EVENTS table for each of the events that satisfy the appropriate conditions
                // .
                // XPATH is ds/CoEventDetails/CoEventSeq and ds/CoEventDetails/CoOrderTypeId

                final Element dsElement = getCoEventDetails (eventId[count]);

                // Since more than one sequence number may be returned for the same event Id,

                // Get all the children called "CoEventDetails" and assign them to a list.
                final List<Element> CoEventDetailsList = dsElement.getChildren ("CoEventDetails");

                // If there are children, i.e. the event id was found with the appropriate conditions
                if (CoEventDetailsList.size () > 0)
                {
                    // Create the parent element
                    final Element CoEventDetails = new Element ("CoEventDetails");

                    // Iterate through the elements
                    final Iterator<Element> iterator = CoEventDetailsList.iterator ();

                    while (iterator.hasNext ())
                    {
                        final Element CoEventDetailsElement = (Element) iterator.next ();

                        // Add BMS details to the CO Event
                        addBMS (reportBmsHelper, CoEventDetailsElement);

                        // Get the event order type ID element
                        final Element CoOrderTypeId = CoEventDetailsElement.getChild ("CoOrderTypeId");

                        // Get the event ID sequence element
                        final Element CoEventSeq = CoEventDetailsElement.getChild ("CoEventSeq");

                        // detach them from the parent.
                        CoOrderTypeId.detach ();
                        CoEventSeq.detach ();

                        // create an new element object
                        final Element CoEventDetail = new Element ("CoEventDetail");

                        // add each child to a parent element
                        CoEventDetail.addContent (CoOrderTypeId);
                        CoEventDetail.addContent (CoEventSeq);

                        // Add the children to the parent
                        CoEventDetails.addContent (CoEventDetail);

                    } // End while (iterator.hasNext())

                    // Generate the outputs.
                    createCoDocuments (CoEventDetails, fwDom);
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

            } // End while (it.hasNext())

            // If there is at least one error message
            if (CoErrorMsgs.getChildren ().size () > 0)
            {
                // Add it/them to the parent
                ds.addContent (CoErrorMsgs);
            }
            // Add the parent to the document
            docErrorMsgs.setRootElement (ds);

            // Send the request to the framework.
            invokeReport (fwDom);

            // For each of the event IDs, set the process_stage column to 'REP' where it is 'AUTO'
            updateCoEventDetails (eventId);

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

    }// End process()

    /**
     * Gets the Event details for a CO event.
     *
     * @param pEventId the event id
     * @return dsElement
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getCoEventDetails (final String pEventId) throws SystemException, BusinessException
    {
        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "eventId", pEventId);
        XMLBuilder.addParam (paramsElement, "courtId", mCourtId);

        // Call the service.
        final Element dsElement =
                invokeLocalServiceProxy (START_OF_DAY_SERVICE, GET_CO_EVENT_DETAILS, inputDoc).getRootElement ();
        return dsElement;
    } // End getCoEventDetails()

    /**
     * Adds BMS details to an event.
     *
     * @param reportBMSHelper the report BMS helper
     * @param pCoEventDetailsElement the co event details element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void addBMS (final ReportBMSHelper reportBMSHelper, final Element pCoEventDetailsElement)
        throws BusinessException, SystemException, JDOMException, ParseException
    {
        final String coEventSeq = pCoEventDetailsElement.getChildText ("CoEventSeq");
        final String standardEventId = pCoEventDetailsElement.getChildText ("StandardEventId");
        final String receiptDate = pCoEventDetailsElement.getChildText ("ReceiptDate");
        final String eventDate = pCoEventDetailsElement.getChildText ("EventDate");
        final String caseNumber = "";
        final String caseType = "ALL";
        final String eventTypeFlag = "C";
        final String issueStage = "ISS";
        String userCourt = "";
        String userSection = "";

        final ICoEventConfigDO coEventConfigDO = reportBMSHelper.getCoEventConfig (standardEventId);
        if (coEventConfigDO.isBMSTaskRequired ())
        {

            // Construct the parameters required for retrieving
            // BMS Task Number and Stats Module values &
            // retrieve the values themselves.
            final String bmsTaskNumber = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "B",
                    "BMSTaskDescription", eventTypeFlag, issueStage);
            final String statsModule = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "S",
                    "StatsModDescription", eventTypeFlag, issueStage);

            // Retrieve the user court and section details
            final Element userDetailsElement = reportBMSHelper.getSectionDetail (mUserId);
            if (null != userDetailsElement)
            {
                final Element userCourtElement = userDetailsElement.getChild ("UserCourt");
                if (null != userCourtElement)
                {
                    userCourt = userCourtElement.getChildText ("CourtCode");
                    userSection = userCourtElement.getChildText ("SectionName");
                }
            }

            final String ageCategory = reportBMSHelper.determineTaskAge (receiptDate, eventDate);

            final Document inputDoc = new Document ();
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
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
    }// End addBMS()

    /**
     * Creates all the start of day CO documents.
     *
     * @param pCoEventDetails the co event details
     * @param fwDom the fw dom
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void createCoDocuments (final Element pCoEventDetails, final Document fwDom)
        throws SystemException, BusinessException
    {

        /* loop through the events */
        final List<Element> coEventDetailsList = pCoEventDetails.getChildren ("CoEventDetail");
        final Iterator<Element> it = coEventDetailsList.iterator ();
        while (it.hasNext ())
        {
            /* Now we have the CoEventDetails. */
            final Element coEventDetailElement = (Element) it.next ();
            final String coEventSeq = coEventDetailElement.getChildText ("CoEventSeq");
            final String coOrderTypeId = coEventDetailElement.getChildText ("CoOrderTypeId");

            log.debug ("coEventSeq: " + coEventSeq);
            log.debug ("coOrderTypeId: " + coOrderTypeId);

            // Create to requestReportBuilder (an object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            final RequestReportXMLBuilder requestReportBuilder = new RequestReportXMLBuilder ("", // String
                                                                                                  // pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    mCourtId, mUserId);

            final Element orderTypesDetailElement = mGetOrderTypeDetails (coOrderTypeId);
            if (null != orderTypesDetailElement)
            {
                requestReportBuilder.addSpecificParameter ("P_DOCUMENT_ID", coOrderTypeId);
                requestReportBuilder.addSpecificParameter ("P_EVENT_SEQ", coEventSeq);
                requestReportBuilder.addSpecificParameter ("P_PRINT_NOW", "Y");
                requestReportBuilder.setReportModuleGroup ("CO");
                addReportToRequest (orderTypesDetailElement.getChildText ("ModuleName"), requestReportBuilder, fwDom);
                log.debug ("About to run report :" + orderTypesDetailElement.getChildText ("ModuleName"));
            }
        }
    } // End createCoDocuments()

    /**
     * Updates the CO event details.
     *
     * @param eventId the event id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void updateCoEventDetails (final String[] eventId) throws SystemException, BusinessException
    {
        log.trace ("Updating CO evants");

        // Build the params document
        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
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
        XMLBuilder.addParam (paramsElement, "courtId", mCourtId);

        // Call the service.
        invokeLocalServiceProxy (START_OF_DAY_SERVICE, UPDATE_CO_EVENT_DETAILS, inputDoc).getRootElement ();

    } // End updateCoEventDetails{}
}
