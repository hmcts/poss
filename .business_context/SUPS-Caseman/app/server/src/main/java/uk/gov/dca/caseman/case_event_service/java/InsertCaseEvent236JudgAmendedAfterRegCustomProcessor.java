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

import java.text.SimpleDateFormat;
import java.util.Date;
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
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Created on 03/05/06
 *
 * RFC 1473 - save new event from Judgment
 *
 * Change History:
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the
 * Judgment court code.
 * 
 * @author rzhh8k
 */
public class InsertCaseEvent236JudgAmendedAfterRegCustomProcessor extends AbstractCasemanCustomProcessor
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
     * Constructor.
     */
    public InsertCaseEvent236JudgAmendedAfterRegCustomProcessor ()
    {

    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return The processed document.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException, BusinessException
    {
        Element ds = null;
        Element insertJudgRecEventRowElement = null;
        List<Element> judgmentElementList = null;
        Element judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            ds = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (ds, "/ds/MaintainJudgment/CaseNumber")).getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            judgmentElementList = XPath.selectNodes (ds, "//Judgment");

            for (Iterator<Element> x = judgmentElementList.iterator (); x.hasNext ();)
            {
                judgment = (Element) x.next ();

                /* Check to see if the Event 236 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (judgment);

                if (eventElement != null)
                {

                    final Element caseEventParamsElement =
                            mBuildJudgRecForAmendJudgEvent (judgment, caseNumber, userName);

                    insertJudgRecEventRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertJudgRecEventRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    }

    /**
     * Build the xml to pass to the mBuildJudgRecForAmendJudgEvent() method.
     *
     * @param pJudgment the judgment
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @return The xml element.
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildJudgRecForAmendJudgEvent (final Element pJudgment, final String pCaseNumber,
                                                    final String pUserName)
        throws JDOMException
    {
        // database fields
        String eventDate = null;
        String judgmentSequence = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;

        // temp variables
        Element caseEventElement = null;
        Element paramsElement = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        judgmentSequence = ((Element) XPath.selectSingleNode (pJudgment, "JudgmentId")).getText ();
        /* amended re defect 6475
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pJudgment,
         * "VenueCode"))).getText(); */
        courtCode = ((Element) XPath.selectSingleNode (pJudgment, "CourtCode")).getText ();
        partyRoleCode = ((Element) XPath.selectSingleNode (pJudgment, "PartyRoleCode")).getText ();
        casePartyNumber = ((Element) XPath.selectSingleNode (pJudgment, "CasePartyNumber")).getText ();
        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"236", /* String subjectCasePartyNumber */casePartyNumber,
                /* String subjectPartyRoleCode */partyRoleCode, /* String applicant */"", /* String eventDetails */"",
                /* String eventDate */eventDate, /* String result */"", /* String warrantId */"",
                /* String judgmentSeq */judgmentSequence, /* String varySeq */"", /* String hrgSeq */"",
                /* String deletedFlag */"", /* String userName */pUserName, /* String receiptDate */eventDate,
                /* String task */"", /* String statsModule */"", /* String ageCategory */"",
                /* String courtCode */courtCode, /* String resultDate */"", /* String dateToRtl */"",
                /* String caseFlag */"", /* String liistingType */"");

        caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

        return paramsElement;
    } // mBuildJudgRecForAmendJudgEvent()

    /**
     * Inserts the case on to the database.
     *
     * @param pCaseEventParamsElement The case event parameters element.
     * @return The updated case event element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        // create a document to pass to invokeLocalServiceProxy()
        final Document inputDoc = new Document ();
        inputDoc.setRootElement (pCaseEventParamsElement);

        final Element insertJudgRecEventElement = invokeLocalServiceProxy (CASE_EVENT_SERVICE, // pJndiName
                INSERT_CASE_EVENT_ROW_METHOD, // pMethodName
                inputDoc).getRootElement (); // Document pInputDoc

        return insertJudgRecEventElement;
    } // mInsertCaseEventRow()

    /**
     * Is there an event 236 for the judgment.
     *
     * @param pJudgmentElement the judgment element
     * @return The event element.
     */
    private Element mCheckIfEventOccurred (final Element pJudgmentElement)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pJudgmentElement.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("236"))
                {
                    // exists = true; RETURN object
                    insertedEventElement = event;
                    break;
                }
            }
        }
        return insertedEventElement;

    } // mCheckIfEventOccurred()

} // class
