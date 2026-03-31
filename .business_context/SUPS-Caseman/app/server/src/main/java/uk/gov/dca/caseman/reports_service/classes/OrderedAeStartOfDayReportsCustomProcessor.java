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

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Creates all ae start of day reports for the court on todays date and prints them in a specific order.
 * 
 * @author Paul Roberts
 *
 *         Change History:
 *         25/11/2015 - Chris Vincent: Added checks to see if Welsh translation has been requested. Trac 5725
 *         12/10/2016 Chris Vincent: bulk printing chanegs to ensure outputs on Family Enforcement cases are not
 *         bulk printed. Trac 5883
 */
public class OrderedAeStartOfDayReportsCustomProcessor extends AbstractOrderedBatchReportBase
{
    
    /**
     * Instantiates a new ordered ae start of day reports custom processor.
     *
     * @throws JDOMException the JDOM exception
     */
    public OrderedAeStartOfDayReportsCustomProcessor () throws JDOMException
    {
        mReportModuleGroup = "AE";
    }

    /** The Constant CASE_EVENT_SERVICE. */
    // Services.
    private static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    
    /** The Constant CASE_SERVICE. */
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant AE_SERVICE. */
    private static final String AE_SERVICE = "ejb/AeServiceLocal";

    /** The Constant GET_AE_EVENT_DETAILS. */
    private static final String GET_AE_EVENT_DETAILS = "getAeEventDetailsLocal";
    
    /** The Constant IS_EVENT_FOR_AE_ON_DATE. */
    private static final String IS_EVENT_FOR_AE_ON_DATE = "isEventForAeOnDateLocal";
    
    /** The Constant UPDATE_AE_EVENT_DETAILS. */
    private static final String UPDATE_AE_EVENT_DETAILS = "updateAeEventDetailsLocal";
    
    /** The Constant GET_AE_EVENT_OUTPUTS. */
    private static final String GET_AE_EVENT_OUTPUTS = "getAeEventOutputsLocal";
    
    /** The Constant UPDATE_CASE_EVENT_BMS. */
    private static final String UPDATE_CASE_EVENT_BMS = "updateCaseEventBmsLocal";
    
    /** The Constant GET_AUTH_LST_REPORT_ID. */
    private static final String GET_AUTH_LST_REPORT_ID = "getAuthLstReportIdLocal";
    
    /** The Constant GET_CASE_WELSH_TRANSLATION. */
    private static final String GET_CASE_WELSH_TRANSLATION = "getCaseWelshTranslationLocal";
    
    /** The Constant GET_AE_EMP_WELSH_TRANSLATION. */
    private static final String GET_AE_EMP_WELSH_TRANSLATION = "getAeEmpWelshTranslationLocal";
    
    /** The Constant GET_CASE_JURISDICTION. */
    private static final String GET_CASE_JURISDICTION = "getCaseJurisdictionLocal";

    /** The Constant CaseMan_No_N61_Msg. */
    // Messages
    private static final String CaseMan_No_N61_Msg = "No outstanding N61s to be printed";
    
    /** The Constant CaseMan_No_N338_Msg. */
    private static final String CaseMan_No_N338_Msg = "No outstanding N338s to be printed";
    
    /** The Constant CaseMan_No_DJ_Referral_Msg. */
    private static final String CaseMan_No_DJ_Referral_Msg = "No process for referral to District Judge";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (OrderedAeStartOfDayReportsCustomProcessor.class);

    /**
     * {@inheritDoc}
     */
    public Document process (final Document params, final Log pLog) throws BusinessException, SystemException
    {

        final Element aeErrorMsgs = new Element ("AeErrorMsgs"); // Holds the error message element
        final String aeErrorMsg = "AeErrorMsg"; // Holds the error message
        final Document docErrorMsgs = new Document (); // Document to hold the parent element of the error messages -
                                                       // returned.

        try
        {

            final Element eventsElement = (Element) XPath.selectSingleNode (params, "/params/param/Events");
            mUserId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            mCourtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            // Create to requestReportBuilder (a object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            final RequestReportXMLBuilder requestReportBuilder = new RequestReportXMLBuilder ("", // String
                                                                                                  // pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    mCourtId, // String pCourtCode
                    mUserId // String pCourtUser
            );
            // Helper class for BMS
            final ReportBMSHelper reportBmsHelper = new ReportBMSHelper ();

            final Document fwDom = new Document ();
            addRequestElement (fwDom);

            // Generate the first report ON ITS OWN!!!
            // This report also may create events and so needs to be run outside of the batch
            // of ae reports created after.
            runIndividualReport ("CM_AUTH_LST.rdf", requestReportBuilder);

            // Loop through event ids.
            final List<Element> eventIdsList = eventsElement.getChildren ("EventIds");

            // Initialise the count of the event id
            int count = 0;

            final Iterator<Element> it = eventIdsList.iterator ();
            final String[] eventId = new String[3];
            while (it.hasNext ())
            {
                // Go to the event ids element
                final Element eventIdsElement = (Element) it.next ();

                // Now we have the event id.
                eventId[count] = eventIdsElement.getChildText ("EventId");

                String dailyReports = "Y"; // Holds the daily report variable. For event ID 174, it's is "T", for all
                                           // other cases it is "Y"
                if (count == 2)
                {
                    // 3rd event id passed in
                    dailyReports = "T";
                }

                // Then retrive data from AE_EVENTS table for each of the events that satisfy the appropriate conditions
                // .
                // XPATH is ds/AeEventDetails/AeEventSeq
                final Element dsElement = getAeEventDetails (eventId[count]);

                // Since more than one sequence number may be returned for the same event Id,
                // Get all the children called "AeEventDetails" and assign them to a list.
                final List<Element> aeEventDetailsList = dsElement.getChildren ("AeEventDetails");

                // If there are children, i.e. the event id was found with the appropriate conditions
                if (aeEventDetailsList.size () > 0)
                {
                    // create an new element object
                    Element AeEventSequences = new Element ("AeEventSequences");

                    // Iterate through the elements
                    final Iterator<Element> iterator = aeEventDetailsList.iterator ();

                    while (iterator.hasNext ())
                    {
                        final Element aeEventDetailsElement = (Element) iterator.next ();

                        // Get the event ID squence element
                        final Element aeEventSeq = aeEventDetailsElement.getChild ("AeEventSeq");

                        // detach it from the parent.
                        aeEventSeq.detach ();

                        // add each child to a parent element
                        AeEventSequences.addContent (aeEventSeq);

                        // Add BMS details to the AE Event
                        addBMS (mUserId, reportBmsHelper, aeEventDetailsElement);

                    } // End while (iterator.hasNext())

                    // Add ae reports to output document
                    createAeDocuments (AeEventSequences, dailyReports, fwDom);

                    // null the element.
                    AeEventSequences = null;
                }
                else
                {
                    // pass an error here

                    switch (count)
                    {
                        case 0: // 1st event id passed in
                            // Build the error msg to pass to the client
                            XMLBuilder.add (aeErrorMsgs, aeErrorMsg, CaseMan_No_N61_Msg);

                            break;
                        case 1: // 2nd event id passed in
                            // Build the error msg to pass to the client
                            if ( !mCourtId.equals ("390") && !mCourtId.equals ("391"))
                            {
                                XMLBuilder.add (aeErrorMsgs, aeErrorMsg, CaseMan_No_N338_Msg);
                            }

                            break;
                        case 2: // 3rd event id passed in
                            // Build the error msg to pass to the client
                            if ( !mCourtId.equals ("390") && !mCourtId.equals ("391"))
                            {
                                XMLBuilder.add (aeErrorMsgs, aeErrorMsg, CaseMan_No_DJ_Referral_Msg);
                            }

                            break;
                        default:
                            break;
                    }

                } // End if (AeEventDetailsList.size() < 1)

                count++;

            } // End while (it.hasNext())

            final Element ds = new Element ("ds"); // Parent element of the error messages
            // If there is at least one error message
            if (aeErrorMsgs.getChildren ().size () > 0)
            {
                // Add it/them to the parent
                ds.addContent (aeErrorMsgs);
            }
            // Add the parent to the document
            docErrorMsgs.setRootElement (ds);

            // Generate the last report
            addReportToRequest ("CM_CAPS_LST.rdf", requestReportBuilder, fwDom);

            // Send the report batch to the framework.
            final Document fwResponseDom = invokeReport (fwDom);

            // For each of the event IDs, set the process_stage column to 'REP' where it is 'AUTO'
            final String authLstId = getAuthListReportId (mUserId);
            updateAeEventDetails (eventId, authLstId);

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
     * Create the ae documents for each event.
     *
     * @param aeEventSeqsElement the ae event seqs element
     * @param dailyReports the daily reports
     * @param fwDom the fw dom
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void createAeDocuments (final Element aeEventSeqsElement, final String dailyReports, final Document fwDom)
        throws SystemException, BusinessException, JDOMException
    {
        String aeEventSeq = null;
        boolean tickBox = false;

        final String tickBoxValue = systemDataItemValue ("TICK BOX");
        if (tickBoxValue.equals ("1"))
        {
            tickBox = true;
        }
        else
        {
            tickBox = false;
        }

        /* loop through the events */
        final List<Element> aeEventList = aeEventSeqsElement.getChildren ("AeEventSeq");
        final Iterator<Element> it = aeEventList.iterator ();
        while (it.hasNext ())
        {
            /* Now we have the AeEventSeq. */
            final Element aeEventSeqElement = (Element) it.next ();
            aeEventSeq = aeEventSeqElement.getText ();

            log.debug ("aeEventSeq: " + aeEventSeq);

            /* Produce Documents associated with this event */
            generateDocsForEvent (aeEventSeq, dailyReports, tickBox, fwDom);
        }

    } // End createAeDocuments()

    /**
     * Update the event details for the processed event.
     *
     * @param eventId the event id
     * @param parentId the parent id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void updateAeEventDetails (final String[] eventId, final String parentId)
        throws SystemException, BusinessException, JDOMException
    {
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
        // add the courtId and parent Id
        XMLBuilder.addParam (paramsElement, "courtId", mCourtId);
        XMLBuilder.addParam (paramsElement, "parentId", parentId);

        // Call the service.
        invokeLocalServiceProxy (START_OF_DAY_SERVICE, UPDATE_AE_EVENT_DETAILS, inputDoc).getRootElement ();

    } // End updateAeEventDetails{}

    /**
     * Gets the details of the event.
     *
     * @param pEventId the event id
     * @return the ae event details
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element getAeEventDetails (final String pEventId) throws SystemException, BusinessException, JDOMException
    {

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "eventId", pEventId);
        // add the courtId
        XMLBuilder.addParam (paramsElement, "courtId", mCourtId);

        // Call the service.
        final Element dsElement =
                invokeLocalServiceProxy (START_OF_DAY_SERVICE, GET_AE_EVENT_DETAILS, inputDoc).getRootElement ();

        return dsElement;
    } // End getAeEventDetails()

    /**
     * See if event exists on a day.
     *
     * @param pAeEventId the ae event id
     * @param pAeNumber the ae number
     * @param pAeEventDate the ae event date
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String eventExists (final String pAeEventId, final String pAeNumber, final String pAeEventDate)
        throws BusinessException, SystemException
    {

        String rtnElementText = null;

        try
        {
            final Element existParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (existParamsElement, "eventId", pAeEventId);
            XMLBuilder.addParam (existParamsElement, "eventDate", pAeEventDate);
            XMLBuilder.addParam (existParamsElement, "aeNumber", pAeNumber);

            final Element resultElement = mProxy.getJDOM (START_OF_DAY_SERVICE, IS_EVENT_FOR_AE_ON_DATE,
                    mOutputter.outputString (existParamsElement)).getRootElement ();

            final Element rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/AeEvent/AeEventExists");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return rtnElementText;
    }// End eventExists()

    /**
     * Retrieves the report id of the Authorisation List Report.
     *
     * @param pUserId the user id
     * @return the auth list report id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String getAuthListReportId (final String pUserId) throws BusinessException, SystemException
    {

        String rtnElementText = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "userId", pUserId);

            final Element resultElement = mProxy
                    .getJDOM (START_OF_DAY_SERVICE, GET_AUTH_LST_REPORT_ID, mOutputter.outputString (paramsElement))
                    .getRootElement ();

            final Element rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/StartOfDay/ReportId");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return rtnElementText;
    }// End eventExists()

    /**
     * Get output definitions associated with the event.
     *
     * @param pAeEventSeq the ae event seq
     * @return the event outputs
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element getEventOutputs (final String pAeEventSeq) throws BusinessException, SystemException
    {
        Element aeEventOutputsElement = null;
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element aeEventOuputsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (aeEventOuputsParamsElement, "aeEventSeq", pAeEventSeq);

            final Element resultElement = mProxy.getJDOM (START_OF_DAY_SERVICE, GET_AE_EVENT_OUTPUTS,
                    mOutputter.outputString (aeEventOuputsParamsElement)).getRootElement ();

            aeEventOutputsElement = (Element) XPath.selectSingleNode (resultElement, "/AeEventOutputs");
            aeEventOutputsElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeEventOutputsElement;
    }// End getEventOutputs()

    /**
     * Indicates if there parties on the case who have requested translation to Welsh.
     *
     * @param pCaseNumber Identifier of the Case to check
     * @return Y if Welsh Translation requested else N
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String getCaseWelshTranslation (final String pCaseNumber) throws BusinessException, SystemException
    {

        String rtnElementText = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            final Element resultElement =
                    mProxy.getJDOM (CASE_SERVICE, GET_CASE_WELSH_TRANSLATION, mOutputter.outputString (paramsElement))
                            .getRootElement ();

            final Element rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/WelshTranslation");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return rtnElementText;
    }// End eventExists()

    /**
     * Indicates if the AE Employer has requested translation to Welsh.
     *
     * @param pAeNumber Identifier of the AE to check
     * @return Y if Welsh Translation requested else N
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String getAeEmpWelshTranslation (final String pAeNumber) throws BusinessException, SystemException
    {

        String rtnElementText = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "aeNumber", pAeNumber);

            final Element resultElement =
                    mProxy.getJDOM (AE_SERVICE, GET_AE_EMP_WELSH_TRANSLATION, mOutputter.outputString (paramsElement))
                            .getRootElement ();

            final Element rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Ae/WelshTranslation");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return rtnElementText;
    }// End eventExists()

    /**
     * Generate all the documents associated with the event.
     *
     * @param pAeEventSeq the ae event seq
     * @param pDailyReports the daily reports
     * @param pTickBox the tick box
     * @param fwDom the fw dom
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void generateDocsForEvent (final String pAeEventSeq, final String pDailyReports, final boolean pTickBox,
                                       final Document fwDom)
        throws BusinessException, SystemException
    {
        Element aeEventOutputElement = null; // The returned element.
        boolean runReport = false;
        String welshIndicator = null;
        String welshEmployer = null;
        String jurisdiction = null;
        String caseNumber = null;
        String aeNumber = null;

        RequestReportXMLBuilder requestReportBuilder = null;

        /* get output definitions associated with this AeEvent */
        final Element aeEventOutputsElement = getEventOutputs (pAeEventSeq);

        /* loop through the output definitions for this event */
        final List<Element> aeEventOutputList = aeEventOutputsElement.getChildren ("AeEventOutput");
        final Iterator<Element> it = aeEventOutputList.iterator ();
        while (it.hasNext ())
        {
            // Moved creation of a new object into the while loop so that a
            // fresh object is always created
            requestReportBuilder = new RequestReportXMLBuilder ("", // String
                    // pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    mCourtId, // String pCourtCode
                    mUserId // String pCourtUser
            );
            /* Now we have the output definition. */
            aeEventOutputElement = (Element) it.next ();

            runReport = true;

            // Obtain the Welsh Indicator for the outputs on this event
            if (welshIndicator == null)
            {
                caseNumber = aeEventOutputElement.getChildText ("CaseNumber");
                aeNumber = aeEventOutputElement.getChildText ("AeNumber");
                welshIndicator = getCaseWelshTranslation (caseNumber);
                welshEmployer = getAeEmpWelshTranslation (aeNumber);
                if (welshEmployer.equals ("Y"))
                {
                    welshIndicator = "Y";
                }
            }

            // Obtain the Jurisdiction for the outputs on this event
            if (jurisdiction == null)
            {
                caseNumber = aeEventOutputElement.getChildText ("CaseNumber");
                jurisdiction = mGetCaseTypeForAE (caseNumber);
            }

            String orderType = null;
            if (pDailyReports.equals ("U")) // This will never happen as
            // pDailyReports will always be Y or
            // T
            {
                orderType = "P_NS"; // Hence this is not required for SUPS
            }
            else if (pDailyReports.equals ("T")) // For tickbox forms (event
            // ID 174.)
            {
                orderType = aeEventOutputElement.getChildText ("ReportValue1");
                // orderType = aeEventOutputElement.getChildText("OrderType");
                // // TD388 Revert back to reportValue1 and if it is null or
                // empty, do not print any report.

                if (null == orderType || "".equals (orderType))
                {
                    continue;
                }
            }
            else
            {
                orderType = aeEventOutputElement.getChildText ("OrderType");
            }

            log.debug ("Standard Event:" + aeEventOutputElement.getChildText ("StandardEventId"));
            log.debug ("Process Stage:" + aeEventOutputElement.getChildText ("ProcessStage"));

            if (aeEventOutputElement.getChildText ("StandardEventId").equals ("852") &&
                    aeEventOutputElement.getChildText ("ProcessStage").equals ("AUTO") && orderType.startsWith ("P852"))
            {

                /* if processing event 852 and an 871 exists for same Ae and on
                 * same day then suppress production of the P852 */

                if (eventExists ("871", aeEventOutputElement.getChildText ("AeNumber"),
                        aeEventOutputElement.getChildText ("EventDate")).equals ("true"))
                {
                    runReport = false;

                }
            }
            else if (aeEventOutputElement.getChildText ("StandardEventId").equals ("871") &&
                    aeEventOutputElement.getChildText ("ProcessStage").equals ("AUTO") && orderType.startsWith ("P871"))
            {

                /* if processing an 871 and an 852 exists for same Ae and on
                 * same day then produce a P871-X rather than a P871 */
                if (eventExists ("852", aeEventOutputElement.getChildText ("AeNumber"),
                        aeEventOutputElement.getChildText ("EventDate")).equals ("true"))
                {
                    orderType = "P871-X";

                }
            }
            log.debug ("Order Type: " + orderType);

            if (runReport)
            {
                final Element orderTypesDetailElement = mGetOrderTypeDetails (orderType);
                if (null != orderTypesDetailElement)
                {

                    // Should be a test in here about tick box!
                    final String documentType = orderTypesDetailElement.getChildText ("DocumentType");
                    log.debug ("Document Type = " + documentType);
                    if (documentType.equals ("T") && pTickBox || !documentType.equals ("T"))
                    {
                        log.debug ("Report Type = " + orderTypesDetailElement.getChildText ("ReportType"));
                        if (orderTypesDetailElement.getChildText ("ReportType").equals ("R25"))
                        {
                            // addSpecificParameter
                            requestReportBuilder.addSpecificParameter ("P_DOCUMENT_ID", orderType);
                            requestReportBuilder.addSpecificParameter ("P_EVENT_SEQ", pAeEventSeq);
                            requestReportBuilder.addSpecificParameter ("P_PRINT_NOW", "Y");
                            requestReportBuilder.addSpecificParameter ("WELSH_TRANS", welshIndicator);
                            requestReportBuilder.addSpecificParameter ("JURISDICTION", jurisdiction);
                            requestReportBuilder.setReportModuleGroup (mReportModuleGroup);

                            addReportToRequest (orderTypesDetailElement.getChildText ("ModuleName"),
                                    requestReportBuilder, fwDom);
                            log.debug ("About to run report :" + orderTypesDetailElement.getChildText ("ModuleName"));

                        }
                    }
                }
            }

            // TD388 if report type is T or U, then break out of the while loop
            // after printing one report instead of 12.
            if (pDailyReports.equals ("T") || pDailyReports.equals ("U"))
            {
                break;
            }
        } // end while.
    }// End generateDocsForEvent()

    /**
     * Add BMS details for event.
     *
     * @param pUserId the user id
     * @param reportBMSHelper the report BMS helper
     * @param pAeEventDetailsElement the ae event details element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void addBMS (final String pUserId, final ReportBMSHelper reportBMSHelper,
                         final Element pAeEventDetailsElement)
        throws BusinessException, SystemException, JDOMException, ParseException
    {
        final String standardEventId = pAeEventDetailsElement.getChildText ("StandardEventId");
        final String dateEntered = pAeEventDetailsElement.getChildText ("DateEntered");
        final String eventDate = pAeEventDetailsElement.getChildText ("EventDate");
        final String caseNumber = pAeEventDetailsElement.getChildText ("CaseNumber");
        final String caseEventSeq = pAeEventDetailsElement.getChildText ("CaseEventSeq");
        String caseType = "ALL";
        String eventTypeFlag = "C";
        final String issueStage = "ISS";
        String userCourt = "";
        String userSection = "";
        String jurisdiction = "";

        // Construct the parameters required for retrieving
        // BMS Task Number and Stats Module values.

        // Check for Family Enforcement Cases
        jurisdiction = mGetCaseTypeForAE (caseNumber);
        if (jurisdiction.equals ("F"))
        {
            caseType = "FE";
            eventTypeFlag = "";
        }

        // Retrieve the values themselves.
        final String bmsTaskNumber = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "B",
                "BMSTaskDescription", eventTypeFlag, issueStage);
        final String statsModule = reportBMSHelper.getBMSValue (caseNumber, standardEventId, caseType, "S",
                "StatsModDescription", eventTypeFlag, issueStage);

        // Retrieve the user court and section details
        final Element userDetailsElement = reportBMSHelper.getSectionDetail (pUserId);
        if (null != userDetailsElement)
        {
            final Element userCourtElement = userDetailsElement.getChild ("UserCourt");
            if (null != userCourtElement)
            {
                userCourt = userCourtElement.getChildText ("CourtCode");
                userSection = userCourtElement.getChildText ("SectionName");
            }
        }

        final String ageCategory = reportBMSHelper.determineTaskAge (dateEntered, eventDate);

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "caseEventSeq", caseEventSeq);
        XMLBuilder.addParam (paramsElement, "bmsTask", bmsTaskNumber);
        XMLBuilder.addParam (paramsElement, "statsModule", statsModule);
        XMLBuilder.addParam (paramsElement, "ageCategory", ageCategory);
        XMLBuilder.addParam (paramsElement, "creatingCourt", userCourt);
        XMLBuilder.addParam (paramsElement, "creatingSection", userSection);

        // Call the request report service via a proxy
        invokeLocalServiceProxy (CASE_EVENT_SERVICE, UPDATE_CASE_EVENT_BMS, inputDoc).getRootElement ();

    }// End addBMS

    /**
     * (non-Javadoc)
     * Call service to get case type specific data.
     *
     * @param pCaseNumber the case number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseTypeForAE (final String pCaseNumber) throws SystemException, BusinessException
    {
        String rtnElementText = "ALL";

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            final Element resultElement =
                    mProxy.getJDOM (CASE_SERVICE, GET_CASE_JURISDICTION, mOutputter.outputString (paramsElement))
                            .getRootElement ();

            final Element rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/Jurisdiction");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final Exception e)
        {
            rtnElementText = "ALL";
        }

        return rtnElementText;
    } // mGetCaseTypeForAE()
}