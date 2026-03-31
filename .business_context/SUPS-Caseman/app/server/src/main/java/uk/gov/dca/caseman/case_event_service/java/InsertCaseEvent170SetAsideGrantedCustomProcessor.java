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
import uk.gov.dca.caseman.judgment_service.java.JudgmentHelper;
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * The Class InsertCaseEvent170SetAsideGrantedCustomProcessor.
 *
 * @author szt44s
 *         Created on 08-Mar-2005
 * 
 *         Change History
 *         07/04/2006 PartyAgainst Address added (Performance issue)
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 *         21-Aug-2006 Phil Haferer (EDS): Modified mInsertWarrantReturnRow().
 *         The relationship between Judgments and Warrants was changed in response to earlier defect,
 *         and this has not been reflected here. Introduced call to new method "getOutstandingWarrantForJudgment",
 *         and also means of determining the Defendant Id.
 *         (TD CASEMAN 4323: UC004 Maintain Judgments - Set aside after warrant issued should cause warrant
 *         returns).
 *         19/04/2007 Mark Groen - TD Caseman 6004: New App To set Aside reSult of In Error added.
 *         18/10/2007 - Mark Groen, GROUP 2 DEFECT 1506 - For ccbc... If deregister event on same day as register date -
 *         set flags to N
 *         25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and
 *         not the
 *         Judgment court code.
 */
public class InsertCaseEvent170SetAsideGrantedCustomProcessor extends AbstractCustomProcessor
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
     * Judgment service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";
    /**
     * Get outstanding warrant for judgment method name.
     */
    public static final String GET_OUTSTANDING_WARRANT_FOR_JUDGMENT_METHOD = "getOutstandingWarrantForJudgmentLocal";

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
    public InsertCaseEvent170SetAsideGrantedCustomProcessor ()
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
        Element SetAsideGrantedElement = null;
        Element insertSetAsideGrantedRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String owningCourtCode = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            SetAsideGrantedElement = pDocParams.getRootElement ();

            caseNumber =
                    ((Element) XPath.selectSingleNode (SetAsideGrantedElement, "/ds/MaintainJudgment/CaseNumber"))
                            .getText ();
            // UCT Group2 1506 - don't register for rtl if cancel on same day.
            owningCourtCode = ((Element) XPath.selectSingleNode (SetAsideGrantedElement,
                    "/ds/MaintainJudgment/OwningCourtCode")).getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (SetAsideGrantedElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 170 is in the DOM, if not no action necessary */
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
                            mBuildSetAsideGranted (Judgment, caseNumber, userName, register);
                    insertSetAsideGrantedRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertSetAsideGrantedRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);

                    // add the address of the PartyAgainst at the time of judgment
                    final JudgmentHelper judgmentHelper = new JudgmentHelper ();
                    judgmentHelper.addJudgmentPartyAgainstAddress (Judgment, caseNumber);

                    // If the judgment has an associated execution warrant, the warrant needs a
                    // final return generated against it.
                    final String owningCourt = ((Element) XPath.selectSingleNode (SetAsideGrantedElement,
                            "/ds/MaintainJudgment/OwningCourtCode")).getText ();
                    mInsertWarrantReturnRow (Judgment, caseNumber, owningCourt, userName);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (SetAsideGrantedElement);
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
     * Create a params element to be used when inserting a set aside granted case event record.
     *
     * @param pSetAsideGranted the set aside granted
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @param pRegister the register
     * @return Case Event Element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildSetAsideGranted (final Element pSetAsideGranted, final String pCaseNumber,
                                           final String pUserName, final String pRegister)
        throws JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String applicant = null;
        String result = null;
        String resultDate = null;
        String judgmentSequence = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;

        // Caseman 6004 - added - - - or Result = 'IN ERROR'
        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        receiptDate = ((Element) XPath.selectSingleNode (pSetAsideGranted,
                "./ApplicationsToSetAside/Application[Result = 'GRANTED' or Result = 'IN ERROR']/DateResult"))
                        .getText ();
        applicant = ((Element) XPath.selectSingleNode (pSetAsideGranted,
                "./ApplicationsToSetAside/Application[Result = 'GRANTED' or Result = 'IN ERROR']/Applicant"))
                        .getText ();
        result = ((Element) XPath.selectSingleNode (pSetAsideGranted,
                "./ApplicationsToSetAside/Application[Result = 'GRANTED' or Result = 'IN ERROR']/Result")).getText ();
        resultDate = ((Element) XPath.selectSingleNode (pSetAsideGranted,
                "./ApplicationsToSetAside/Application[Result = 'GRANTED' or Result = 'IN ERROR']/DateResult"))
                        .getText ();
        judgmentSequence = ((Element) XPath.selectSingleNode (pSetAsideGranted, "JudgmentId")).getText ();
        /* amended re defect 6475
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pSetAsideGranted,
         * "VenueCode"))).getText(); */
        courtCode = ((Element) XPath.selectSingleNode (pSetAsideGranted, "CourtCode")).getText ();
        partyRoleCode = ((Element) XPath.selectSingleNode (pSetAsideGranted, "PartyRoleCode")).getText ();
        casePartyNumber = ((Element) XPath.selectSingleNode (pSetAsideGranted, "CasePartyNumber")).getText ();

        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"170", /* String subjectCasePartyNumber */casePartyNumber,
                /* String subjectPartyRoleCode */partyRoleCode, /* String applicant */applicant,
                /* String eventDetails */"", /* String eventDate */eventDate, /* String result */result,
                /* String warrantId */"", /* String judgmentSeq */judgmentSequence, /* String varySeq */"",
                /* String hrgSeq */"", /* String deletedFlag */"", /* String userName */pUserName,
                /* String receiptDate */receiptDate, /* String task */"", /* String statsModule */"",
                /* String ageCategory */"", /* String courtCode */courtCode, /* String resultDate */resultDate,
                /* String dateToRtl */"", /* String caseFlag */"", /* String listingType */"");

        // Defect uct grp2 1506
        caseEventXMLBuilder.setRegisterJudgment (pRegister);

        caseEventElement = caseEventXMLBuilder.getXMLElementForEventToRegister ("CaseEvent");
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert a set aside granted case event record.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return Stored Case Event Element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertSetAsideGrantedRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertSetAsideGrantedRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_TO_REG_ROW_METHOD, sXmlParams).getRootElement ();

        return insertSetAsideGrantedRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check if a set aside granted event has occurred.
     *
     * @param pSetAsideGranted the set aside granted
     * @return Event Element.
     */
    private Element mCheckIfEventOccurred (final Element pSetAsideGranted)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pSetAsideGranted.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("170"))
                {
                    // exists = true; RETURN object
                    insertedEventElement = event;
                    break;
                }
            }
        }
        return insertedEventElement;

    } // mCheckIfEventOccurred()

    /**
     * Checks for an execution warrant based on the judgment, and if one exists,
     * creates a final warrant return (142) against the warrant.
     *
     * @param judgmentElement The judgment to check
     * @param caseNumber The case number.
     * @param owningCourtCode The owning court.
     * @param userName The user name.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertWarrantReturnRow (final Element judgmentElement, final String caseNumber,
                                          final String owningCourtCode, final String userName)
        throws SystemException, BusinessException
    {
        // Extract the Party Against for this Judgment.
        final String JudgmentAgainstPartyRoleCode = judgmentElement.getChildText ("PartyRoleCode");
        final String JudgmentAgainstCasePartyNo = judgmentElement.getChildText ("CasePartyNumber");

        // Is there an Outstanding Warrant for this Judgment?
        final Element dsElement = mGetOutstandingWarrantsForJudgment (/* String pCaseNumber */caseNumber,
                /* String pAgainstPartyRoleCode */JudgmentAgainstPartyRoleCode,
                /* String pAgainstCasePartyNo */JudgmentAgainstCasePartyNo,
                /* String pJudgSeq */judgmentElement.getChildText ("JudgmentId"));
        Element warrantElement = null;
        if (dsElement != null)
        {
            for (Iterator<Element> i = dsElement.getChildren ().iterator (); i.hasNext ();)
            {
                warrantElement = (Element) i.next ();
            }
        }

        if (warrantElement != null)
        {
            // There is an associated warrant, so create return for it
            final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
            final WarrantReturnsXMLBuilder builder =
                    new WarrantReturnsXMLBuilder (warrantElement.getChildText ("WarrantId"), "142", todaysDate);
            builder.setCourtCode ("0"); // 158 is a National return code, so set to '0'
            builder.setExecutedBy (owningCourtCode);
            builder.setReceiptDate (todaysDate);
            builder.setDefendantID (mGetWarrantReturnDefendantId (JudgmentAgainstPartyRoleCode,
                    JudgmentAgainstCasePartyNo, warrantElement.getChildText ("Def1PartyRoleCode"),
                    warrantElement.getChildText ("Def1CasePartyNo"), warrantElement.getChildText ("Def2PartyRoleCode"),
                    warrantElement.getChildText ("Def2CasePartyNo")));
            builder.setCaseNumber (caseNumber);
            builder.setCreatedBy (userName);
            final Element warrantReturnsElement = builder.getXMLElement ();

            // Wrap the 'WarrantReturn' XML in the 'params/param' structure.
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

            // Translate to string.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal", sXmlParams);
        }
    }

    /**
     * Determine a value for the Defendant Id.
     * If the Judgment's Party Against matches the first Defendent on the Warrant the Defendant Id is "1".
     * If it matches the second Defendant on the warrant the Defendant Id is "2".
     * Otherwise the Defendant Id is "0".
     * 
     * @param pJudgmentAgainstPartyRoleCode The Role of the Judgment's Party Against.
     * @param pJudgmentAgainstCasePartyNo The Number of the Judgment's Party Against.
     * @param pWarrantDef1PartyRoleCode The Role of the first Defendant on the Warrant.
     * @param pWarrantDef1CasePartyNo The Number of the first Defendant on the Warrant.
     * @param pWarrantDef2PartyRoleCode The Role of the second Defendant on the Warrant.
     * @param pWarrantDef2CasePartyNo The Number of the second Defendant on the Warrant.
     * @return The Defendant Id.
     */
    private String
            mGetWarrantReturnDefendantId (final String pJudgmentAgainstPartyRoleCode,
                                          final String pJudgmentAgainstCasePartyNo,
                                          final String pWarrantDef1PartyRoleCode, final String pWarrantDef1CasePartyNo,
                                          final String pWarrantDef2PartyRoleCode, final String pWarrantDef2CasePartyNo)
    {
        String defendantId = null;

        if (pJudgmentAgainstPartyRoleCode.equals (pWarrantDef1PartyRoleCode) &&
                pJudgmentAgainstCasePartyNo.equals (pWarrantDef1CasePartyNo))
        {
            defendantId = "1";
        }
        else if (pJudgmentAgainstPartyRoleCode.equals (pWarrantDef2PartyRoleCode) &&
                pJudgmentAgainstCasePartyNo.equals (pWarrantDef2CasePartyNo))
        {
            defendantId = "2";
        }
        else
        {
            defendantId = "0";
        }

        return defendantId;
    } // mGetWarrantReturnDefendantId()

    /**
     * Get any Outstanding Warrants relating to the given Judgment - there should only be one live
     * Warrant at one time.
     *
     * @param pCaseNumber The Case Number that Judgment belongs to.
     * @param pAgainstPartyRoleCode The Role of the Judgment's Party Against.
     * @param pAgainstCasePartyNo The Number of the Judgment's Party Against.
     * @param pJudgSeq The Judgment Sequence Number.
     * @return The root Element of document that may contain the Outstanding Warrant.
     * @exception SystemException the system exception
     * @exception BusinessException the business exception
     */
    private Element mGetOutstandingWarrantsForJudgment (final String pCaseNumber, final String pAgainstPartyRoleCode,
                                                        final String pAgainstCasePartyNo, final String pJudgSeq)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "againstPartyRoleCode", pAgainstPartyRoleCode);
        XMLBuilder.addParam (paramsElement, "againstCasePartyNo", pAgainstCasePartyNo);
        XMLBuilder.addParam (paramsElement, "judgSeq", pJudgSeq);

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        final Element dsElement = localServiceProxy
                .getJDOM (JUDGMENT_SERVICE, GET_OUTSTANDING_WARRANT_FOR_JUDGMENT_METHOD, sXmlParams).getRootElement ();

        return dsElement;
    } // mGetOutstandingWarrantsForJudgment()

} // class InsertCaseEventRow
