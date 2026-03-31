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
package uk.gov.dca.caseman.hearing_service.java;

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

import uk.gov.dca.caseman.co_event_service.java.CoEventXMLBuilder;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * The Class InsertCoEvent200CreateHearingCustomProcessor.
 *
 * @author gzyysf
 *         Created on 15-Aug-2005
 * 
 *         Change History :-
 *         19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         27/07/2005 Phil Haferer - TD 3959: MAINTAIN CO HEARING - UC008: The CO Hearing Event 200 is not updated in
 *         line
 *         with a revised hearing date/time.
 */
public class InsertCoEvent200CreateHearingCustomProcessor implements ICustomProcessor
{
    
    /** The hearings X path. */
    private final XPath hearingsXPath;

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The out. */
    private final XMLOutputter out;

    /**
     * Hearing service name.
     */
    public static final String HEARING_SERVICE = "ejb/HearingServiceLocal";
    /**
     * Update Case Event Details method name.
     */
    public static final String UPDATE_CO_EVENT_DETAILS_METHOD = "updateCoEventDetailsLocal";
    /**
     * CO Event service name.
     */
    public static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";
    /**
     * Add CO Event 200 method name.
     */
    public static final String ADD_CO_EVENT_200 = "addCoEvent200Local";

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public InsertCoEvent200CreateHearingCustomProcessor () throws JDOMException
    {
        localServiceProxy = new SupsLocalServiceProxy ();

        hearingsXPath = XPath.newInstance ("//ds/MaintainHearing/Hearings/Hearing");

        out = new XMLOutputter (Format.getPrettyFormat ());
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
        Element maintainHearingsElement = null;
        Element hearingElement = null;
        List<Element> hearingList = null;
        Iterator<Element> it = null;
        String coNumber = null;

        try
        {
            maintainHearingsElement = pDocParams.getRootElement ();

            // caseNumber = ((Element)(XPath.selectSingleNode(maintainHearingsElement,
            // "/ds/MaintainHearing/CaseNumber"))).getText();
            coNumber = ((Element) XPath.selectSingleNode (maintainHearingsElement, "/ds/MaintainHearing/CONumber"))
                    .getText ();

            // Get all Hearing elements
            hearingList = hearingsXPath.selectNodes (pDocParams);

            it = hearingList.iterator ();
            while (it.hasNext ())
            {
                hearingElement = (Element) it.next ();

                // is this an add hearing?
                if (mCheckIfAnAddHearing (hearingElement) == true)
                {

                    // construct a DOM for the insert case event service
                    final Element coEventParamsElement = mBuildAddHearingCoEvent (hearingElement, coNumber);

                    // call the insert case event service
                    mInsertCoEventRow (coEventParamsElement);
                }
                else
                {
                    // When updating rather adding a Hearing, there may be a need to update the CO Event.
                    // Has the Date/Time of the Hearing changed?
                    final String hearingDateAndTimeChanged = hearingElement.getChildText ("HearingDateAndTimeChanged");
                    if (null != hearingDateAndTimeChanged && hearingDateAndTimeChanged.equals ("Y"))
                    {
                        final String details = formatDetails (
                                /* String pHearingType */hearingElement.getChildText ("TypeOfHearingCode"),
                                /* String pDateString */hearingElement.getChildText ("Date"),
                                /* String pSecsString */hearingElement.getChildText ("Time"));
                        mUpdateCoEventDetails (/* String pDetails */details, /* String pCoNumber */coNumber,
                                /* String pHrgSeq */hearingElement.getChildText ("HearingID"));
                    }
                }
            }

            /* Output the original XML. */
            final String sXml;
            sXml = out.outputString (maintainHearingsElement);

            pWriter.write (sXml);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }

        return;
    }

    /**
     * M update co event details.
     *
     * @param pDetails The formatted event details to be written into the DETAILS column.
     * @param pCoNumber The CO Number of the CO Event to be updated.
     * @param pHrgSeq The Hearing Sequence number of the CO Event to be updated.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCoEventDetails (final String pDetails, final String pCoNumber, final String pHrgSeq)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "details", pDetails);
        XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
        XMLBuilder.addParam (paramsElement, "hrgSeq", pHrgSeq);

        final String sXmlParams = out.outputString (paramsElement);

        localServiceProxy.getJDOM (HEARING_SERVICE, UPDATE_CO_EVENT_DETAILS_METHOD, sXmlParams);
    } // mUpdateCoEventDetails()

    /**
     * (non-Javadoc)
     * Create a params element holding the co event details.
     *
     * @param pHearingElement the hearing element
     * @param pCoNumber the co number
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildAddHearingCoEvent (final Element pHearingElement, final String pCoNumber)
        throws SystemException, JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String hearingType = null;
        String hearingDate = null;
        String hearingTime = null;
        String eventDetails = null;
        String hearingId = null;
        String userName = null;

        CoEventXMLBuilder coEventXMLBuilder = null;
        Element coEventElement = null;
        Element paramsElement = null;

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        receiptDate = ((Element) XPath.selectSingleNode (pHearingElement, "DateOfRequestToList")).getText ();

        hearingType = ((Element) XPath.selectSingleNode (pHearingElement, "TypeOfHearingCode")).getText ();

        hearingDate = ((Element) XPath.selectSingleNode (pHearingElement, "Date")).getText ();

        hearingTime = ((Element) XPath.selectSingleNode (pHearingElement, "Time")).getText ();

        hearingId = ((Element) XPath.selectSingleNode (pHearingElement, "HearingID")).getText ();

        userName = ((Element) XPath.selectSingleNode (pHearingElement, "CreatedBy")).getText ();

        eventDetails = formatDetails (hearingType, hearingDate, hearingTime);

        coEventXMLBuilder = new CoEventXMLBuilder (/* String coEventSeq */"", /* String coNumber */pCoNumber,
                /* String standardEventId */"200", /* String eventDetails */eventDetails,
                /* String eventDate */eventDate, /* String userName */userName, /* String receiptDate */receiptDate,
                /* String IssueStage */"", /* String serviceStatus */"", /* String bailiffId */"",
                /* String serviceDate */"", /* String errorInd */"N", /* String bmsTask */"",
                /* String statsModule */"", /* String ageCategory */"", /* String warrantNumber */"",
                /* String processDate */"", /* String hrgSeq */hearingId, /* String aldDebtSeq */"");

        coEventElement = coEventXMLBuilder.getXMLElement ("COEvent");

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coEvent", coEventElement);

        return paramsElement;
    } // mBuildAddHearingCoEvent()

    /**
     * (non-Javadoc)
     * Call a service to insert a co event.
     *
     * @param pCoEventParamsElement the co event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCoEventRow (final Element pCoEventParamsElement) throws SystemException, BusinessException
    {
        Element insertCoEventRowElement = null;

        final String sXmlParams = out.outputString (pCoEventParamsElement);

        insertCoEventRowElement =
                localServiceProxy.getJDOM (CO_EVENT_SERVICE, ADD_CO_EVENT_200, sXmlParams).getRootElement ();

        return insertCoEventRowElement;
    } // mInsertCoEventRow()

    /**
     * (non-Javadoc)
     * Check to see if the hearing has been added.
     *
     * @param pHearingElement the hearing element
     * @return true, if successful
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckIfAnAddHearing (final Element pHearingElement) throws JDOMException
    {
        /* An add hearing is detected when the hearingId != surrogateId
         * since the getHearing service will populate both tags with the same value */
        boolean addEvent;
        String hearingId = null;
        String surrogateId = null;

        hearingId = ((Element) XPath.selectSingleNode (pHearingElement, "HearingID")).getText ();

        surrogateId = ((Element) XPath.selectSingleNode (pHearingElement, "SurrogateId")).getText ();

        addEvent = false;
        if (isEmpty (hearingId) || isEmpty (surrogateId) || !hearingId.equals (surrogateId))
        {
            addEvent = true;
        }

        return addEvent;
    }

    /**
     * (non-Javadoc)
     * Format hearing date and details.
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

            // DateFormat outDateFormat = new SimpleDateFormat("dd-MMM-yyyy 'AT' HH:mm:ss");
            final DateFormat outDateFormat = new SimpleDateFormat ("dd-MMM-yyyy 'AT' HH:mm");
            outputDateString = pHearingType + ": " + outDateFormat.format (cal.getTime ()).toUpperCase ();
        }
        catch (final ParseException pe)
        {
            throw new SystemException (pe);
        }

        return outputDateString;

    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
} // class InsertCaseEventRow
