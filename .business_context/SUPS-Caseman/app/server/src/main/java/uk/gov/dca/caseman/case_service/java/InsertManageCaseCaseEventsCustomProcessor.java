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
package uk.gov.dca.caseman.case_service.java;

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
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.ccbc_service.java.CCBCHelper;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Service: Case
 * Method: addCase/updateCase
 * Class: InsertManageCaseCaseEventsCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 30-Mar-2005
 *         Description:
 * 
 * 
 *         Update History
 *         --------------
 *         v1.0 30/03/2006 Phil Haferer
 * 
 *         v1.1 15/04/2005 Chris Hutt
 *         defect 585: event 200 updates EventDetails
 *         defect 602: events should include courtCode and userName (at time of coding this is DEFAULT pending security
 *         solution)
 * 
 *         v1.2 18/01/2006 Chris Hutt
 *         Opportunity taken to perform CCBC related processing (via call to CCBCHelper class) for Court 335
 * 
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * @author Phil Haferer
 */
public class InsertManageCaseCaseEventsCustomProcessor extends AbstractCasemanCustomProcessor
{
    
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
        String caseNumber = null;
        String todaysDate = null;
        String courtCode = null;
        Element caseEventsElement = null;
        List<Element> caseEventElementList = null;
        Element caseEventElement = null;

        try
        {
            // Retrieve some common values used by all events.
            caseNumber = ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/CaseNumber")).getText ();
            todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

            // Locate the list of CaseEvent elements.
            caseEventsElement = (Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/CaseEvents");

            if (null != caseEventsElement)
            {
                caseEventElementList = caseEventsElement.getChildren ();

                // Iterate through the list, create CaseEvents for each node.
                for (Iterator<Element> i = caseEventElementList.iterator (); i.hasNext ();)
                {
                    caseEventElement = (Element) i.next ();
                    mProcessCaseEvent (pDocParams, caseNumber, todaysDate, caseEventElement);
                }
            }

            // If a CCBC case then do any associated processing
            courtCode = ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/OwningCourtCode")).getText ();

            if (courtCode.equals ("335"))
            {
                mCCBCProcessing (pDocParams);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * M CCBC processing.
     *
     * @param pDocParams the doc params
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mCCBCProcessing (final Document pDocParams) throws SystemException, JDOMException, BusinessException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.postUpdateCaseProcessing (pDocParams);
    }

    /**
     * (non-Javadoc)
     * Collect parameters for inserting the case event and then call a service to insert it.
     *
     * @param pDocParams the doc params
     * @param pCaseNumber the case number
     * @param pEventDate the event date
     * @param pCaseEventElement the case event element
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mProcessCaseEvent (final Document pDocParams, final String pCaseNumber, final String pEventDate,
                                    final Element pCaseEventElement)
        throws JDOMException, SystemException, BusinessException
    {
        final int EVENT_200_HEARING = 200;

        Document inputDoc = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        int standardEventId = 0;
        String hrgSeq = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String owningCourt = null;
        String userName = null;
        String hearingType = null;
        String eventDetails = null;
        String hearingDate = null;
        String hearingTime = null;

        try
        {
            // Collect the values for the columns of the CASE_EVENTS row.
            caseEventXMLBuilder = new CaseEventXMLBuilder (pCaseEventElement);
            caseEventXMLBuilder.setCaseNumber (pCaseNumber);
            caseEventXMLBuilder.setEventDate (pEventDate);

            owningCourt =
                    ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/OwningCourtCode")).getText ();
            caseEventXMLBuilder.setCourtCode (owningCourt);

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);
            caseEventXMLBuilder.setUserName (userName);

            // Collect any event specific values.
            standardEventId = Integer.parseInt (caseEventXMLBuilder.getStandardEventId ());
            switch (standardEventId)
            {

                case EVENT_200_HEARING:

                    hrgSeq = ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/HearingDetails/Id"))
                            .getText ();
                    caseEventXMLBuilder.setHrgSeq (hrgSeq);

                    hearingType = ((Element) XPath.selectSingleNode (pDocParams,
                            "/ds/ManageCase/HearingDetails/TypeOfHearing")).getText ();

                    hearingDate =
                            ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/HearingDetails/Date"))
                                    .getText ();

                    hearingTime =
                            ((Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/HearingDetails/Time"))
                                    .getText ();

                    eventDetails = mFormatEvent200Details (hearingType, hearingDate, hearingTime);
                    caseEventXMLBuilder.setEventDetails (eventDetails);

                    break;

            }

            // Generate a new XML 'document' from the 'CaseEvent' object.
            // (This will contain all the element nodes required for 'InsertCaseEventRow()'.
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
        finally
        {
            caseEventXMLBuilder = null;
            standardEventId = 0;
            hrgSeq = null;
            caseEventElement = null;
            paramsElement = null;
        }

    } // mProcessCaseEvent()

    /**
     * (non-Javadoc)
     * Formats event details, such as date.
     *
     * @param pHearingType the hearing type
     * @param pHearingDate the hearing date
     * @param pHearingTime the hearing time
     * @return the string
     * @throws SystemException the system exception
     */
    private String mFormatEvent200Details (final String pHearingType, final String pHearingDate,
                                           final String pHearingTime)
        throws SystemException
    {
        // This routine converts date from yyyy-MM-dd
        // prior to formatiing the event details string

        String outputDateString = null;

        try
        {
            final DateFormat inputDateFormat = new SimpleDateFormat ("yyyy-MM-dd");
            final Date inputDate = inputDateFormat.parse (pHearingDate);
            final Calendar cal = new GregorianCalendar ();
            cal.setTime (inputDate);
            long mSecs = cal.getTimeInMillis ();
            mSecs = mSecs + Long.parseLong (pHearingTime) * 1000;
            cal.setTimeInMillis (mSecs);

            final DateFormat outDateFormat = new SimpleDateFormat ("dd-MMM-yyyy 'AT' HH:mm");
            outputDateString = pHearingType + ": " + outDateFormat.format (cal.getTime ()).toUpperCase ();
        }
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }

        return outputDateString;
    } // mFormatEvent200Details

} // class InsertManageCaseCaseEventsCustomProcessor