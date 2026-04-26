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
package uk.gov.dca.caseman.co_service.java;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Co
 * Method: updateCoDebtList()
 * Class: UpdateCoCaseEventsCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 22 September 2005
 *         Description:
 *         Create/Update CO_CASE_EVENTS and CASE_EVENTS rows following client-side events.
 *         If the events related to a local Case, CASE_EVENTS rows are created.
 *         If the events related to a Case on foreign Court, CO_CASE_EVENTS rows are created/updated.
 *         If the event is flagged as deleted, the last instance event must flagged as deleted.
 *
 *         Change History:
 *         17-Nov-2005 Phil Haferer: Added call to UpdateCoCaseEventsCustomProcessor in response to
 *         TD 1803: MAINTAIN CO: No automatic Case Event 705 created for selected Case/Creditor during CO creation.
 *         09-Jan-2006 Phil Haferer: Added update of the EventDetails for CASE_EVENTS in mProcessCaseEvent().
 *         01-Mar-2006 Phil Haferer: Assigned the EventDate to TransferDate in mProcessCoCaseEvent() in response to
 *         TD 2351: UC108 Maintain CO - Transfer Date not set on CO_CASE_EVENTS.
 *         06/03/2005 Chris Hutt
 *         TD 1916: no BMS should be generated for any case event
 *         16-Mar-2006 Phil Haferer: Added a prefix of CO Number to Event Details of CO Case Events, in response to
 *         TD 2572: Co Case events - event detail.
 *         04-Apr-2006 Phil Haferer: Modified mProcessCaseEvent(), to update the UserName on a Case Event.
 *         TD 2945: UC105 Created by User ID not printed on the report.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         25-Sep-2006 Phil Haferer (EDS): Amended mProcessCaseEvent() - now prefixes the EventDetails by the CO Number
 *         (previously done by client-side - though it didn't know the value of CO Number).
 *         Amended mProcessCoCaseEvent() - now includes a colon separate between CO Number and additional text.
 *         (TD CASEMAN 4479: OO - UC105 Case Events Report - Event Detail Text taken from CE 705 differs to Legacy).
 *         29-Nov-2006 Phil Haferer (EDS): Modified mProcessCoCaseEvent() to handle events that have been flagged as
 *         deleted.
 *         (TD UCT_CASEMAN 783: CO event transfer from SUPS to legacy).
 */
public class UpdateCoCaseEventsCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant CASE_SERVICE. */
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant GET_CASE_EXISTS_METHOD. */
    private static final String GET_CASE_EXISTS_METHOD = "getCaseExistsLocal";

    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant UPDATE_CO_CASE_EVENT_METHOD. */
    private static final String UPDATE_CO_CASE_EVENT_METHOD = "updateCoCaseEventLocal";
    
    /** The Constant GET_CO_CASE_EVENT_METHOD. */
    private static final String GET_CO_CASE_EVENT_METHOD = "getCoCaseEventLocal";

    /** The Constant PAYOUT_SERVICE. */
    private static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";
    
    /** The Constant DELETE_CO_CASE_EVENT_METHOD. */
    private static final String DELETE_CO_CASE_EVENT_METHOD = "deleteCoCaseEventLocal";

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        Element paramsElement = null;
        Element coCaseEventsElement = null;
        List<Element> coCaseEventsElementList = null;
        Element coCaseEventElement = null;
        String caseNumber = null;

        try
        {
            paramsElement = pDocParams.getRootElement ();
            coCaseEventsElement = (Element) XPath.selectSingleNode (pDocParams, "//CoCaseEvents");

            if (null != coCaseEventsElement)
            {
                coCaseEventsElementList = coCaseEventsElement.getChildren ();

                // Iterate through the list, create CaseEvents for each node.
                for (Iterator<Element> i = coCaseEventsElementList.iterator (); i.hasNext ();)
                {
                    coCaseEventElement = (Element) i.next ();
                    caseNumber = coCaseEventElement.getChild ("CaseNumber").getText ();
                    if (mCaseExists (caseNumber))
                    {
                        mProcessCaseEvent (paramsElement, coCaseEventElement);
                    }
                    else
                    {
                        mProcessCoCaseEvent (paramsElement, coCaseEventElement);
                    }
                } // for(Iterator i = ...
            } // if (null != coCaseEventsElement)
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to see if a case exists.
     *
     * @param pCaseNumber the case number
     * @return caseExists
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean mCaseExists (final String pCaseNumber) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        boolean caseExists = false;
        Element paramsElement = null;
        Element dsElement = null;
        Element caseElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            // Call the service.
            dsElement = invokeLocalServiceProxy (CASE_SERVICE, GET_CASE_EXISTS_METHOD, inputDoc).getRootElement ();
            if (dsElement != null)
            {
                caseElement = dsElement.getChild ("Case");
                if (caseElement != null)
                {
                    caseExists = true;
                }
            }
        }
        finally
        {
            paramsElement = null;
            dsElement = null;
            caseElement = null;
        }

        return caseExists;
    } // mCaseExists()

    /**
     * (non-Javadoc)
     * Process a case event and insert it into the database.
     *
     * @param pParamsElement the params element
     * @param pCoCaseEventElement the co case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mProcessCaseEvent (final Element pParamsElement, final Element pCoCaseEventElement)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        String deletedFlag = null;
        String debtSurrogateId = null;
        Element debtElement = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;

        // Retrieve the related Debt, in order to access the 'subject' party details.
        debtSurrogateId = pCoCaseEventElement.getChild ("DebtSurrogateId").getText ();
        debtElement = (Element) XPath.selectSingleNode (pParamsElement,
                "/ds/MaintainCO/Debts/Debt[DebtSurrogateId = '" + debtSurrogateId + "']");

        deletedFlag = pCoCaseEventElement.getChild ("DeletedFlag").getText ();
        if (deletedFlag.equals ("N"))
        {
            // When the event is not being deleted, simply insert a new event.
            caseEventXMLBuilder = new CaseEventXMLBuilder (
                    /* String caseNumber */pCoCaseEventElement.getChild ("CaseNumber").getText (),
                    /* String standardEventId */pCoCaseEventElement.getChild ("StdEventId").getText (),
                    /* String eventDate */pCoCaseEventElement.getChild ("EventDate").getText (),
                    /* String receiptDate */pCoCaseEventElement.getChild ("ReceiptDate").getText (),
                    /* String courtCode */pCoCaseEventElement.getChild ("AdminCourtCode").getText ());

            caseEventXMLBuilder.setSubjectPartyRoleCode (debtElement.getChild ("PartyRoleCode").getText ());
            caseEventXMLBuilder.setSubjectCasePartyNumber (debtElement.getChild ("CasePartyNumber").getText ());
            caseEventXMLBuilder.setSource ("AUTO");
            caseEventXMLBuilder.setUserName (pCoCaseEventElement.getChild ("UserName").getText ());

            // Prefix the Event Details by the CO Number.
            final String coNumber = XMLBuilder.getXPathValue (pParamsElement, "/ds/MaintainCO/CONumber");

            final StringBuffer eventDetails = new StringBuffer ();
            eventDetails.append (coNumber);
            eventDetails.append (" : ");
            eventDetails.append (pCoCaseEventElement.getChildText ("EventDetails"));
            caseEventXMLBuilder.setEventDetails (eventDetails.toString ());

            // Generate a new XML 'document' from the 'CaseEvent' object.
            caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Call the service.
            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD,
                    inputDoc);

        }
        else
        { // of if (deletedFlag.equals("N"))
            // When an event is being deleted, mark the last instance of that event as deleted.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCoCaseEventElement.getChild ("CaseNumber").getText ());
            XMLBuilder.addParam (paramsElement, "partyRoleCode", debtElement.getChild ("PartyRoleCode").getText ());
            XMLBuilder.addParam (paramsElement, "casePartyNumber", debtElement.getChild ("CasePartyNumber").getText ());
            XMLBuilder.addParam (paramsElement, "stdEventId", pCoCaseEventElement.getChild ("StdEventId").getText ());

            // Call the service.
            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.MARK_LAST_CASE_EVENT_DELETED_METHOD, inputDoc);
        }

    } // mProcessCaseEvent()

    /**
     * (non-Javadoc)
     * Process a co case event and update the database record.
     *
     * @param pParamsElement the params element
     * @param pCoCaseEventElement the co case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mProcessCoCaseEvent (final Element pParamsElement, final Element pCoCaseEventElement)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        String debtSurrogateId = null;
        String aldDebtSeq = null;
        String coNumber = null;
        String stdEventId = null;
        String deletedFlag = null;
        String lastStdEventId = null;
        String lastTransferStatus = null;
        StringBuffer eventDetails = null;
        CoCaseEventXMLBuilder coCaseEventXMLBuilder = null;
        Element dsElement = null;
        Element coCaseEventElement = null;
        Element paramsElement = null;
        boolean updateCoCaseEvent = true;

        try
        {
            // Look up the Debt Sequence Number using the Surrogate Id.
            debtSurrogateId = pCoCaseEventElement.getChild ("DebtSurrogateId").getText ();
            aldDebtSeq = XMLBuilder.getXPathValue (pParamsElement,
                    "/ds/MaintainCO/Debts/Debt[DebtSurrogateId = '" + debtSurrogateId + "']/DebtSeq");
            coNumber = XMLBuilder.getXPathValue (pParamsElement, "/ds/MaintainCO/CONumber");

            // Prefix the Event Details by the CO Number.
            eventDetails = new StringBuffer ();
            eventDetails.append (coNumber);
            eventDetails.append (" : ");
            eventDetails.append (pCoCaseEventElement.getChild ("EventDetails").getText ());

            stdEventId = pCoCaseEventElement.getChildText ("StdEventId");
            coCaseEventXMLBuilder = new CoCaseEventXMLBuilder (/* String aldDebtSeq */aldDebtSeq,
                    /* String adminCourtCode */pCoCaseEventElement.getChild ("AdminCourtCode").getText (),
                    /* String coNumber */coNumber, /* String stdEventId */stdEventId,
                    /* String eventDate */pCoCaseEventElement.getChild ("EventDate").getText (),
                    /* String eventDetails */eventDetails.toString (), /* String transferStatus */"1",
                    /* String transferDate */pCoCaseEventElement.getChild ("EventDate").getText (),
                    /* String caseNumber */pCoCaseEventElement.getChild ("CaseNumber").getText (),
                    /* String receiptDate */pCoCaseEventElement.getChild ("ReceiptDate").getText ());

            deletedFlag = pCoCaseEventElement.getChildText ("DeletedFlag");
            if (stdEventId.equals ("706") && deletedFlag.equals ("Y"))
            {
                // If client has requested the deletion of an event 706 (AO/CAEO REVOKED),
                // we need to determine whether the last event has been transmitted or not.
                coCaseEventElement = mGetCoCaseEvent (aldDebtSeq);
                if (coCaseEventElement != null)
                {
                    lastStdEventId = coCaseEventElement.getChildText ("StdEventId");
                    lastTransferStatus = coCaseEventElement.getChildText ("TransferStatus");

                    // If the last event was a 706 (AO/CAEO REVOKED) but it has not been sent
                    // yet - simply delete the row, so the "Revoked" event is never sent.
                    if (lastStdEventId.equals ("706") && !lastTransferStatus.equals ("2"))
                    {
                        // Event still not transmitted - so delete the awaiting event.
                        mDeleteCoCaseEvent (aldDebtSeq);
                        updateCoCaseEvent = false;
                    }
                    else
                    {
                        // Otherwise, send an event 777 to indicate that a previously sent
                        // 706 (AO/CAEO REVOKED) should be ignored.
                        coCaseEventXMLBuilder.setStdEventId ("777");

                        final String debtorName =
                                XMLBuilder.getXPathValue (pParamsElement, "/ds/MaintainCO/DebtorName");

                        eventDetails = new StringBuffer ();
                        eventDetails.append (coNumber);
                        eventDetails.append (" : ");
                        eventDetails.append (debtorName);
                        eventDetails.append (" - CO NO LONGER REVOKED/DISCHARGED (ERROR)");
                        coCaseEventXMLBuilder.setEventDetails (eventDetails.toString ());
                    }
                }
            }

            if (updateCoCaseEvent)
            {
                // Generate a new XML 'document' from the 'CoCaseEvent' object.
                dsElement = new Element ("ds");
                coCaseEventElement = coCaseEventXMLBuilder.getXMLElement ("CoCaseEvent");
                dsElement.addContent (coCaseEventElement);

                // Wrap the 'CaseEvent' XML in the 'params/param' structure.
                inputDoc = new Document ();
                paramsElement = XMLBuilder.getNewParamsElement ();
                inputDoc.setRootElement (paramsElement);
                XMLBuilder.addParam (paramsElement, "coCaseEvent", dsElement);

                // Call the service.
                invokeLocalServiceProxy (CO_SERVICE, UPDATE_CO_CASE_EVENT_METHOD, inputDoc);
            }
        }
        finally
        {
            inputDoc = null;
            debtSurrogateId = null;
            aldDebtSeq = null;
            coNumber = null;
            eventDetails = null;
            coCaseEventXMLBuilder = null;
            paramsElement = null;
        }

    } // mProcessCoCaseEvent()

    /**
     * (non-Javadoc)
     * Gets CO case event.
     *
     * @param sequenceNumber the sequence number
     * @return CoCaseEvent Element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCoCaseEvent (final String sequenceNumber)
        throws SystemException, BusinessException, JDOMException
    {
        Element coCaseEventsElement = null;

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "sequenceNumber", sequenceNumber);

        final Element dsElement =
                invokeLocalServiceProxy (CO_SERVICE, GET_CO_CASE_EVENT_METHOD, inputDoc).getRootElement ();
        if (null != dsElement)
        {
            coCaseEventsElement = dsElement.getChild ("CoCaseEvents");
        }

        return coCaseEventsElement;
    } // mGetCoCaseEvent()

    /**
     * (non-Javadoc)
     * Deletes a CO case event.
     *
     * @param debtSequenceNo the debt sequence no
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteCoCaseEvent (final String debtSequenceNo) throws SystemException, BusinessException
    {
        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "debtSequenceNo", debtSequenceNo);

        invokeLocalServiceProxy (PAYOUT_SERVICE, DELETE_CO_CASE_EVENT_METHOD, inputDoc);
    } // mDeleteCoCaseEvent()

} // class UpdateCoCaseEventsCustomProcessor
