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
import java.text.ParseException;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Service: CaseEvent
 * Method: addCaseEvent
 * Class: RemoveOldCaseEventWordProcessingRows.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 29-Mar-2005
 *         Description:
 *         Where multiple WP_OUTPUT rows exist for given CASE_EVENTS row, the CASE_EVENTS row will be repeated in the
 *         XML result set. Therefore, this must iterate through result set, removing unwanted rows, leaving only those
 *         with the most recent word processing state.
 * 
 *         In addition, event description may have had a different value in the past.
 *         The previous descriptions are stored in the CHANGED_EVENTS table, together with a date range.
 *         When the Events relating to a Case are displayed on the client, the current Standard Event
 *         description may need to be substituted for the description which was in place at the time
 *         that Case Event was created.
 *         Whilst this list is being stripped of unwanted rows, event descriptions may also substituted.
 *
 *         Change History :
 *         25-May-2005 Phil Haferer: Work around for Word Processing problem.
 *         04-Jul-2005 Phil Haferer: Added substitution of descriptions from CHANGED_EVENTS.
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * @author Phil Haferer
 */
public class RemoveOldCaseEventWordProcessingRowsCustomProcessor implements ICustomProcessor
{
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public RemoveOldCaseEventWordProcessingRowsCustomProcessor ()
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
        Element rootElement = null;
        Element manangeCaseEventsElement = null;
        Element caseEventsElement = null;
        List<Element> caseEventElementList = null;
        Element changedEventListElement = null;
        Element caseEventElement = null;
        Element caseEventSeqElement = null;
        int caseEventSeq = 0;
        int lastCaseEventSeq = 0;
        XMLOutputter xmlOutputter = null;
        String sXml = null;
        int listSize = 0;

        try
        {
            // Locate the list of CaseEvent elements.
            rootElement = pDocParams.getRootElement ();
            if (null != rootElement)
            {
                manangeCaseEventsElement = rootElement.getChild ("ManageCaseEvents");
                if (null != manangeCaseEventsElement)
                {
                    caseEventsElement = manangeCaseEventsElement.getChild ("CaseEvents");
                    if (null != caseEventsElement)
                    {
                        caseEventElementList = caseEventsElement.getChildren ();

                        // Get the substitute event descriptions.
                        changedEventListElement = mGetChangedEventList (manangeCaseEventsElement);

                        // Iterate through the list and discard those rows related to
                        // old word processing details.
                        listSize = caseEventElementList.size ();
                        for (int idx = 0; idx < listSize;)
                        {
                            caseEventElement = (Element) caseEventElementList.get (idx);
                            caseEventSeqElement = caseEventElement.getChild ("CaseEventSeq");
                            caseEventSeq = Integer.parseInt (caseEventSeqElement.getText ());
                            if (caseEventSeq == lastCaseEventSeq)
                            {
                                caseEventElement.detach ();
                                listSize--;
                            }
                            else
                            {
                                lastCaseEventSeq = caseEventSeq;
                                idx++;

                                mProcessWordProcessingOutputFinal (caseEventElement);
                                mSubstituteChangedEventDescriptions (caseEventElement, changedEventListElement);
                            }
                        }
                    } // if (null != caseEventsElement)
                } // if (null != manangeCaseEventsElement)
            } // if (null != rootElement)

            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (rootElement);
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
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }

        return;
    } // process()

    /**
     * (non-Javadoc)
     * Work-around for Word Processing problem...
     * If a WP_OUTPUT row exists, but the FINAL_IND is not set, set it to "N".
     *
     * @param pCaseEventElement the case event element
     */
    private void mProcessWordProcessingOutputFinal (final Element pCaseEventElement)
    {
        Element wordProcessingOutputIdElement = null;
        String wordProcessingOutputId = null;
        Element wordProcessingOutputFinalElement = null;
        String wordProcessingOutputFinal = null;

        try
        {
            wordProcessingOutputIdElement = pCaseEventElement.getChild ("WordProcessingOutputId");
            wordProcessingOutputId = wordProcessingOutputIdElement.getText ();
            if ( !wordProcessingOutputId.equals (""))
            {
                wordProcessingOutputFinalElement = pCaseEventElement.getChild ("WordProcessingOutputFinal");
                wordProcessingOutputFinal = wordProcessingOutputFinalElement.getText ();
                if (wordProcessingOutputFinal.equals (""))
                {
                    wordProcessingOutputFinalElement.setText ("N");
                }
            }
        }
        finally
        {
            wordProcessingOutputIdElement = null;
            wordProcessingOutputId = null;
            wordProcessingOutputFinalElement = null;
            wordProcessingOutputFinal = null;
        }

    } // processWordProcessingOutputFinal()

    /**
     * (non-Javadoc)
     * Search for a changed event description and apply it if found.
     *
     * @param pCaseEventElement the case event element
     * @param pChangedEventListElement the changed event list element
     * @throws ParseException the parse exception
     */
    private void mSubstituteChangedEventDescriptions (final Element pCaseEventElement,
                                                      final Element pChangedEventListElement)
        throws ParseException
    {
        Element caseEventStandardEventIdElement = null;
        int caseEventStandardEventId = 0;
        int listSize = 0;
        int idx = 0;
        boolean searching = false;
        boolean found = false;
        List<Element> changedEventElementList = null;
        Element changedEventElement = null;
        Element standardEventIdElement = null;
        int standardEventId = 0;
        Element caseEventEventDateElement = null;
        Calendar caseEventEventDate = null;
        Element releaseDateElement = null;
        Calendar releaseDate = null;
        Element finalDateElement = null;
        Calendar finalDate = null;
        Element caseEventStandardEventDescriptionElement = null;
        Element changedEventDescriptionElement = null;

        try
        {
            if (null != pChangedEventListElement)
            {
                // Get the Event Id that we are to search for...
                caseEventStandardEventIdElement = pCaseEventElement.getChild ("StandardEventId");
                caseEventStandardEventId = Integer.parseInt (caseEventStandardEventIdElement.getText ());

                // Get the Date of the Case Event row...
                caseEventEventDateElement = pCaseEventElement.getChild ("EventDate");
                caseEventEventDate = CalendarHelper.toCalendar (caseEventEventDateElement.getText ());

                // Initialise the iteration over the list 'Changed Events' Descriptions.
                changedEventElementList = pChangedEventListElement.getChildren ();
                if (null != changedEventElementList)
                {
                    listSize = changedEventElementList.size ();
                    idx = 0;

                    searching = true;
                    do
                    {
                        searching = false;
                        if (idx < listSize)
                        {
                            // Get the next Changed Event row...
                            changedEventElement = (Element) changedEventElementList.get (idx);
                            found = false;

                            // Is it one for the current Event Id?
                            standardEventIdElement = changedEventElement.getChild ("StandardEventId");
                            standardEventId = Integer.parseInt (standardEventIdElement.getText ());
                            if (standardEventId == caseEventStandardEventId)
                            {
                                // Is it within the date range?
                                releaseDateElement = changedEventElement.getChild ("ReleaseDate");
                                releaseDate = CalendarHelper.toCalendar (releaseDateElement.getText ());
                                if (caseEventEventDate.equals (releaseDate))
                                {
                                    found = true;
                                }
                                else if (caseEventEventDate.after (releaseDate))
                                {
                                    finalDateElement = changedEventElement.getChild ("FinalDate");
                                    finalDate = CalendarHelper.toCalendar (finalDateElement.getText ());
                                    if (caseEventEventDate.before (finalDate))
                                    {
                                        found = true;
                                    }
                                    else if (caseEventEventDate.equals (finalDate))
                                    {
                                        found = true;
                                    }
                                }
                                if (found)
                                {
                                    // Substitute the Description.
                                    changedEventDescriptionElement = changedEventElement.getChild ("EventDescription");
                                    caseEventStandardEventDescriptionElement =
                                            pCaseEventElement.getChild ("StandardEventDescription");
                                    caseEventStandardEventDescriptionElement
                                            .setText (changedEventDescriptionElement.getText ());
                                }
                            }

                            if ( !found)
                            {
                                searching = true;
                                idx++;
                            }
                        } // if (idx < listSize)
                    }
                    while (searching);
                } // if (null != changedEventListElementList)
            }
        }
        finally
        {
            caseEventStandardEventIdElement = null;
            changedEventElementList = null;
            changedEventElementList = null;
            changedEventElement = null;
            standardEventIdElement = null;
            caseEventEventDateElement = null;
            caseEventEventDate = null;
            releaseDateElement = null;
            releaseDate = null;
            finalDateElement = null;
            finalDate = null;
            caseEventStandardEventDescriptionElement = null;
            changedEventDescriptionElement = null;
        }
    } // mSubstituteChangedEventDescriptions()

    /**
     * (non-Javadoc)
     * Via a service call get a list of changed events.
     *
     * @param pManangeCaseEventsElement the manange case events element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetChangedEventList (final Element pManangeCaseEventsElement)
        throws BusinessException, SystemException, JDOMException
    {
        Element changedEventListElement = null;
        Element paramsElement = null;
        String sValue = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();

            sValue = XMLBuilder.getXPathValue (pManangeCaseEventsElement, "/ds/ManageCaseEvents/CaseNumber");
            XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            changedEventListElement = localServiceProxy
                    .getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.GET_CHANGED_EVENT_LIST_METHOD, sXmlParams)
                    .getRootElement ();
        }
        finally
        {
            paramsElement = null;
            sValue = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return changedEventListElement;
    } // mGetChangedEventList(

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
} // class RemoveOldCaseEventWordProcessingRowsCustomProcessor
