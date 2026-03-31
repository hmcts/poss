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
package uk.gov.dca.caseman.case_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Created on 08-Mar-2005
 *
 * Change History:
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 09/05/2007 Chris Vincent: changed case flag to 'Y' so will allow setting bar on Judgment for all defendants
 * 08/08/2007 - Mark Groen, GROUP 2 DEFECT 1488 - For ccbc... EVENT 79 always produced when judgment paid in full. The
 * case status is set to PAID when all judgments on the case set to PAID. Also the event's subject, is
 * party specific rather than case. I.e. for CCBC party specific for each 79 event, for normal caseman, it is CASE
 * specific when all jugments have been paid and therefore the event 79 has been raised.
 * 18/10/2007 - Mark Groen, GROUP 2 DEFECT 1506 - For ccbc... If deregister event on same day as register date - set
 * flags to N
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the
 * Judgment court code.
 * 006/04/2009 - Mark Groen - LOGICA DEFECT 19 - - EVENT 79 always produced when judgment paid in full. The
 * case status is set to PAID when all judgments on the case set to PAID. Also the event's subject, is
 * party specific rather than case. I.e. for CCBC party specific for each 79 event, for normal caseman, it is CASE
 * specific when all jugments have been paid and therefore the event 79 has been raised. This was fixed as part of
 * defect 1488, but a change else where
 * undid it.
 * 
 * @author szt44s
 */
public class InsertCaseEvent79FinalPaymentEnteredCustomProcessor extends AbstractCustomProcessor
{
    /**
     * The case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";
    /**
     * The check event is register today method name.
     */
    public static final String REGISTRATION_EVENT_CHECK_METHOD = "registrationEventCheckLocal";
    /**
     * The insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_TO_REG_ROW_METHOD = "insertCaseEventToRegisterRowLocal";
    /**
     * The update case event register flag method name.
     */
    public static final String UPDATE_CASE_EVENT_REGISTER_FLAG_METHOD = "updateCaseEventRegisterFlagLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent79FinalPaymentEnteredCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element FinalPaymentElement = null;
        Element insertFinalPaymentRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        String owningCourtCode = null;
        Element eventSequenceElement = null;

        try
        {
            FinalPaymentElement = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (FinalPaymentElement, "/ds/MaintainJudgment/CaseNumber"))
                    .getText ();
            // UCT Group2 1506 - don't register for rtl if cancel on same day.
            owningCourtCode =
                    ((Element) XPath.selectSingleNode (FinalPaymentElement, "/ds/MaintainJudgment/OwningCourtCode"))
                            .getText ();
            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (FinalPaymentElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 79 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (Judgment);

                if (eventElement != null)
                {

                    String register = "Y";
                    if (owningCourtCode != null && owningCourtCode.equals ("335"))
                    {
                        // UCT Group2 1506 - don't register for rtl if cancel on same day. Only for ccbc. Normal caseman
                        // uses event 600
                        final String registeredEventId = mCheckForRegistrationEvents (Judgment);
                        if (registeredEventId != null && registeredEventId != "")
                        {
                            register = "N";
                            // update the actual event as it means the judgment was created 'today' and don't want to
                            // send any record to RTL
                            mUpdateCaseEventForRegister (registeredEventId);
                        }
                    }
                    else
                    {
                        register = "N";
                    }

                    final Element caseEventParamsElement =
                            mBuildFinalPaymentEntered (Judgment, caseNumber, userName, register);
                    insertFinalPaymentRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertFinalPaymentRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (FinalPaymentElement);
            pWriter.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return;
    }

    /**
     * (non-Javadoc)
     * Defect ccbc grp2 1506
     * Update the case events table with th ecorrect setting for the Register Flag.
     *
     * @param pEventSeq the event seq
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCaseEventForRegister (final String pEventSeq)
        throws JDOMException, SystemException, BusinessException
    {
        final Document inputDoc = new Document ();

        final Element paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "eventSeq", pEventSeq);

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        localServiceProxy.getJDOM (CASE_EVENT_SERVICE, UPDATE_CASE_EVENT_REGISTER_FLAG_METHOD, sXmlParams)
                .getRootElement ();

    } // mUpdateCaseEventForRegister()

    /**
     * (non-Javadoc)
     * Defect ccbc grp2 1506
     * Search the database for a registration case event - one of 230, 233, 240, 250, 251, 254, 375.
     *
     * @param pJudgmentStatusElement the judgment status element
     * @return String
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mCheckForRegistrationEvents (final Element pJudgmentStatusElement)
        throws JDOMException, SystemException, BusinessException
    {
        final Document inputDoc = new Document ();
        String judgmentSequence = null;
        String eventSequence = null;
        Element dsElement = null;
        Element caseEventsElement = null;
        final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        judgmentSequence = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "JudgmentId")).getText ();

        final Element paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "judgmentSequence", judgmentSequence);
        XMLBuilder.addParam (paramsElement, "systemDate", todaysDate);

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        dsElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, REGISTRATION_EVENT_CHECK_METHOD, sXmlParams)
                .getRootElement ();

        caseEventsElement = dsElement.getChild ("CaseEvents");
        if (caseEventsElement != null)
        {
            eventSequence = caseEventsElement.getChildText ("EventSeq");
        }

        return eventSequence;
    } // mCheckForRegistrationEvents()

    /**
     * (non-Javadoc)
     * Create the xml params element used to insert a final payment entered event record.
     *
     * @param pFinalPaymentElement the final payment element
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @param pRegister the register
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildFinalPaymentEntered (final Element pFinalPaymentElement, final String pCaseNumber,
                                               final String pUserName, final String pRegister)
        throws JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String judgmentSequence = null;
        String courtCode = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String ccbcUpdateCaseStatus = "N";
        String ccbcCaseCourtCode = "";
        String partyRoleCode = "";
        String casePartyNumber = "";
        String caseFlag = "";

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        receiptDate = ((Element) XPath.selectSingleNode (pFinalPaymentElement, "NotificationDate")).getText ();
        judgmentSequence = ((Element) XPath.selectSingleNode (pFinalPaymentElement, "JudgmentId")).getText ();
        /* remove defect 6475 - get anyway now
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pFinalPaymentElement,
         * "VenueCode"))).getText(); */
        // added as part of defect 6475 - use court code not judgment court code

        courtCode = ((Element) XPath.selectSingleNode (pFinalPaymentElement, "CourtCode")).getText ();

        // defect 1488
        final Element ccbcSetCaseStatusElement =
                (Element) XPath.selectSingleNode (pFinalPaymentElement, "CCBCSetCaseStatus");

        if (null != ccbcSetCaseStatusElement)
        {
            ccbcUpdateCaseStatus = ccbcSetCaseStatusElement.getText ();
        }

        /* remove defect 6475 - get anyway now
         * if (null != ccbcCaseCourtCodeElement){
         * ccbcCaseCourtCode = ccbcCaseCourtCodeElement.getText();
         * } */

        // If this is a ccbc court - set the party details rather than 'case' for the event
        if (courtCode.equals ("335") && ccbcUpdateCaseStatus.equals ("N"))
        {
            partyRoleCode = ((Element) XPath.selectSingleNode (pFinalPaymentElement, "PartyRoleCode")).getText ();
            casePartyNumber = ((Element) XPath.selectSingleNode (pFinalPaymentElement, "CasePartyNumber")).getText ();
            caseFlag = "N";
        }
        else
        {
            caseFlag = "Y";
        }

        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"79", /* String subjectCasePartyNumber */casePartyNumber, // Defect No. 643
                                                                                                      // & 1488 (ccbc)
                /* String subjectPartyRoleCode */partyRoleCode, // Defect No. 643 & 1488 (ccbc)
                /* String applicant */"", /* String eventDetails */"", /* String eventDate */eventDate,
                /* String result */"", /* String warrantId */"", /* String judgmentSeq */judgmentSequence,
                /* String varySeq */"", /* String hrgSeq */"", /* String deletedFlag */"",
                /* String userName */pUserName, /* String receiptDate */receiptDate, /* String task */"",
                /* String statsModule */"", /* String ageCategory */"", /* String courtCode */courtCode,
                /* String resultDate */"", /* String dateToRtl */"", /* String caseFlag */caseFlag,
                /* String listingType */"");

        // Defect uct grp2 1506
        caseEventXMLBuilder.setRegisterJudgment (pRegister);
        caseEventElement = caseEventXMLBuilder.getXMLElementForEventToRegister ("CaseEvent");
        // Logica DEFECT 19 - set the court code, as required later in the process to determine if ccbc or not.
        ccbcCaseCourtCode = courtCode;
        XMLBuilder.add (caseEventElement, "CCBCSetCaseStatus", ccbcUpdateCaseStatus);
        XMLBuilder.add (caseEventElement, "CCBCCaseCourtCode", ccbcCaseCourtCode);

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert a final parment entered event record.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertFinalPaymentRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertFinalPaymentRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_TO_REG_ROW_METHOD, sXmlParams).getRootElement ();

        return insertFinalPaymentRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check to see if a final payment entered event has occurred.
     * PJR
     *
     * @param pFinalPaymentElement the final payment element
     * @return the element
     */
    private Element mCheckIfEventOccurred (final Element pFinalPaymentElement)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pFinalPaymentElement.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("79"))
                {
                    // exists = true; RETURN object
                    insertedEventElement = event;
                    break;
                }
            }
        }
        return insertedEventElement;

    } // mCheckIfEventOccurred()

} // class InsertCaseEventRow
