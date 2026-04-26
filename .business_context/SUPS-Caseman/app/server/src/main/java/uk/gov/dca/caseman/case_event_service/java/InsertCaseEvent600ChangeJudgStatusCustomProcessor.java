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
 * 19/04/2007 Mark Groen - TD Caseman 6004: New App To set Aside result of In Error added
 * 20/04/2007 Mark Groen - TD Caseman 6037: If Judgment entered and set aside on the same day.
 * The rtl data file included a row for both, but it should not include
 * any rows to remain consistant with legacy.
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the
 * Judgment court code.
 * 
 * @author szt44s
 */
public class InsertCaseEvent600ChangeJudgStatusCustomProcessor extends AbstractCustomProcessor
{
    /**
     * The case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_TO_REG_ROW_METHOD = "insertCaseEventToRegisterRowLocal";
    /**
     * The check event is register today method name.
     */
    public static final String REGISTRATION_EVENT_CHECK_METHOD = "registrationEventCheckLocal";
    /**
     * The update case event register flag method name.
     */
    public static final String UPDATE_CASE_EVENT_REGISTER_FLAG_METHOD = "updateCaseEventRegisterFlagLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent600ChangeJudgStatusCustomProcessor ()
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
        Element JudgmentStatusElement = null;
        Element insertJudgmentStatusRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            JudgmentStatusElement = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (JudgmentStatusElement, "/ds/MaintainJudgment/CaseNumber"))
                    .getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (JudgmentStatusElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 600 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (Judgment);

                if (eventElement != null)
                {

                    final String registeredEventId = mCheckForRegistrationEvents (Judgment);
                    String register = "Y";
                    if (registeredEventId != null && registeredEventId != "")
                    {
                        register = "N";
                        // update the actual event as it means th ejusgmebnt was craeted 'today' and don't want to send
                        // any record to RTL
                        mUpdateCaseEventForRegister (registeredEventId);
                    }

                    final Element caseEventParamsElement =
                            mBuildChangeJudgmentStatus (Judgment, caseNumber, userName, register);
                    insertJudgmentStatusRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertJudgmentStatusRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (JudgmentStatusElement);
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
     * Defect 6037
     * Update the case events table with th ecorrect setting fo rthe Register Flag.
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
     * Defect 6037
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
     * Create the params element for use when inserting a change judgment status event.
     *
     * @param pJudgmentStatusElement the judgment status element
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @param pRegister the register
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildChangeJudgmentStatus (final Element pJudgmentStatusElement, final String pCaseNumber,
                                                final String pUserName, final String pRegister)
        throws JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String judgmentSequence = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String status = null;

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        status = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "Status")).getText ();

        if (status.equals ("SET ASIDE"))
        {
            // Caseman 6004 - added - - - or Result = 'IN ERROR'
            receiptDate = ((Element) XPath.selectSingleNode (pJudgmentStatusElement,
                    "./ApplicationsToSetAside/Application[Result = 'GRANTED' or Result = 'IN ERROR']/DateResult"))
                            .getText ();
        }
        else
        {
            receiptDate = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "NotificationDate")).getText ();
        }

        judgmentSequence = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "JudgmentId")).getText ();
        /* amended re defect 6475
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pJudgmentStatusElement,
         * "VenueCode"))).getText(); */
        courtCode = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "CourtCode")).getText ();
        partyRoleCode = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "PartyRoleCode")).getText ();
        casePartyNumber = ((Element) XPath.selectSingleNode (pJudgmentStatusElement, "CasePartyNumber")).getText ();
        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"600", /* String subjectCasePartyNumber */casePartyNumber,
                /* String subjectPartyRoleCode */partyRoleCode, /* String applicant */"", /* String eventDetails */"",
                /* String eventDate */eventDate, /* String result */"", /* String warrantId */"",
                /* String judgmentSeq */judgmentSequence, /* String varySeq */"", /* String hrgSeq */"",
                /* String deletedFlag */"", /* String userName */pUserName, /* String receiptDate */receiptDate,
                /* String task */"", /* String statsModule */"", /* String ageCategory */"",
                /* String courtCode */courtCode, /* String resultDate */"", /* String dateToRtl */"",
                /* String caseFlag */"", /* String laitingType */"");

        // Defect 6037
        caseEventXMLBuilder.setRegisterJudgment (pRegister);
        caseEventElement = caseEventXMLBuilder.getXMLElementForEventToRegister ("CaseEvent");
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert a change judgment status event record.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertJudgmentStatusRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertJudgmentStatusRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_TO_REG_ROW_METHOD, sXmlParams).getRootElement ();

        return insertJudgmentStatusRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check to see if a change judgment status event has occurred.
     *
     * @param pJudgmentStatusElement the judgment status element
     * @return the element
     */
    private Element mCheckIfEventOccurred (final Element pJudgmentStatusElement)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pJudgmentStatusElement.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("600"))
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
