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
import java.text.DateFormat;
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
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the
 * Judgment court code.
 * 
 * @author szt44s
 */
public class InsertCaseEvent200ApplicationToVaryHearingCustomProcessor extends AbstractCustomProcessor
{
    /**
     * The case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent200ApplicationToVaryHearingCustomProcessor ()
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
        Element ApplicationToVaryHearingElement = null;
        Element insertApplicationToVaryHearingRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            ApplicationToVaryHearingElement = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (ApplicationToVaryHearingElement,
                    "/ds/MaintainJudgment/CaseNumber")).getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (ApplicationToVaryHearingElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 200 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (Judgment);

                if (eventElement != null)
                {

                    final Element caseEventParamsElement =
                            mBuildApplicationToVaryHearing (Judgment, caseNumber, userName);
                    insertApplicationToVaryHearingRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertApplicationToVaryHearingRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (ApplicationToVaryHearingElement);
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
     * Create a params element for inserting an application to vary hearing case event.
     *
     * @param pApplicationToVaryHearing the application to vary hearing
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildApplicationToVaryHearing (final Element pApplicationToVaryHearing, final String pCaseNumber,
                                                    final String pUserName)
        throws SystemException, JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String judgmentSequence = null;
        String hearingSequence = null;
        String courtCode = null;
        String hearingType = null;
        String hearingDate = null;
        String hearingTime = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String eventDetails = null;
        Element hearingElement = null;
        List<Element> hearingList = null;
        Element hearing = null;
        Element hearingIdElement = null;
        String elementText = null;

        hearingElement = pApplicationToVaryHearing.getChild ("JudgmentHearing");

        hearingList = hearingElement.getChildren ();

        for (Iterator<Element> i = hearingList.iterator (); i.hasNext ();)
        {
            hearing = (Element) i.next ();
            hearingIdElement = hearing.getChild ("NewHearing");

            if (hearingIdElement != null)
            {
                elementText = hearingIdElement.getText ();

                // There should always be a Y as this method would not
                // be called unless a new 200 event (AppToVaryHearing) is present in the DOM

                if (elementText != null && elementText != "" && elementText.equals ("Y"))
                {
                    // new Hearing found

                    eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                    receiptDate = ((Element) XPath.selectSingleNode (pApplicationToVaryHearing,
                            "./ApplicationsToVary/Variation[Hearing = 'Y' and PreviousHearing != 'Y']/AppDate"))
                                    .getText ();
                    judgmentSequence =
                            ((Element) XPath.selectSingleNode (pApplicationToVaryHearing, "JudgmentId")).getText ();
                    hearingSequence = ((Element) XPath.selectSingleNode (hearing, "HearingSequence")).getText ();
                    /* amended re defect 6475
                     * courtCode = ((Element)(XPath.selectSingleNode(
                     * pApplicationToVaryHearing,
                     * "VenueCode"))).getText(); */
                    courtCode =
                            ((Element) XPath.selectSingleNode (pApplicationToVaryHearing, "CourtCode")).getText ();
                    /* partyRoleCode = ((Element)(XPath.selectSingleNode(
                     * pApplicationToVaryHearing,
                     * "PartyRoleCode"))).getText();
                     * casePartyNumber = ((Element)(XPath.selectSingleNode(
                     * pApplicationToVaryHearing,
                     * "CasePartyNumber"))).getText(); Defect 831 Removes */
                    hearingType = ((Element) XPath.selectSingleNode (hearing, "TypeOfHearingCode")).getText ();
                    hearingDate = ((Element) XPath.selectSingleNode (hearing, "Date")).getText ();
                    hearingTime = ((Element) XPath.selectSingleNode (hearing, "Time")).getText ();

                    eventDetails = formatDetails (hearingType, hearingDate, hearingTime);

                    caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"",
                            /* String caseNumber */pCaseNumber, /* String standardEventId */"200",
                            /* String subjectCasePartyNumber */"", /* String subjectPartyRoleCode */"",
                            /* String applicant */"", /* String eventDetails */eventDetails,
                            /* String eventDate */eventDate, /* String result */"", /* String warrantId */"",
                            /* String judgmentSeq */judgmentSequence, /* String varySeq */"",
                            /* String hrgSeq */hearingSequence, /* String deletedFlag */"",
                            /* String userName */pUserName, /* String receiptDate */receiptDate, /* String task */"",
                            /* String statsModule */"", /* String ageCategory */"", /* String courtCode */courtCode,
                            /* String resultDate */"", /* String dateToRtl */"", /* String caseFlag */"",
                            /* String listingType */"");

                    caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

                    paramsElement = XMLBuilder.getNewParamsElement ();
                    XMLBuilder.addParam (paramsElement, caseEventElement);

                    break;
                }
            }
        }

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert an application to vary hearing case event.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertApplicationToVaryHearingRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertApplicationToVaryHearingRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_ROW_METHOD, sXmlParams).getRootElement ();

        return insertApplicationToVaryHearingRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check to see if an application to vary result event has occurred.
     *
     * @param pApplicationToVaryHearing the application to vary hearing
     * @return the element
     */
    private Element mCheckIfEventOccurred (final Element pApplicationToVaryHearing)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pApplicationToVaryHearing.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("200"))
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
     * (non-Javadoc)
     * Format the hearing type date ant time for use on the client.
     *
     * @param pHearingType the hearing type
     * @param pDateString the date string
     * @param pSecsString the secs string
     * @return the string
     * @throws SystemException the system exception
     */
    private String formatDetails (final String pHearingType, final String pDateString, final String pSecsString)
        throws SystemException
    {
        // Convert the hearingType, Date and Time info sent by client to a
        // String in the format 'hearingType: DD-MM-YYYY at HH:MM'

        String outputDateString = null;

        try
        {
            final DateFormat inputDateFormat = new SimpleDateFormat ("yyyy-MM-dd");
            final Date inputDate = inputDateFormat.parse (pDateString);
            final Calendar cal = new GregorianCalendar ();
            cal.setTime (inputDate);
            long mSecs = cal.getTimeInMillis ();
            mSecs = mSecs + Long.parseLong (pSecsString) * 1000;
            cal.setTimeInMillis (mSecs);

            final DateFormat outDateFormat = new SimpleDateFormat ("dd-MMM-yyyy 'AT' HH:mm");
            outputDateString = pHearingType + ": " + outDateFormat.format (cal.getTime ()).toUpperCase ();
        }
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }

        return outputDateString;
    }

} // class InsertCaseEventRow
