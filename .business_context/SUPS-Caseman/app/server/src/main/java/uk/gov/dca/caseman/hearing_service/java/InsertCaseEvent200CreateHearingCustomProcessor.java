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

import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.window_for_trial_service.java.WftDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 24-Mar-2005
 *
 * Change History :-
 * 11/05/2005 Phil Haferer - Defect 718: Set Case Event Receipt Date to entered value.
 * 16/05/2005 Chris Hutt - defect 809: event details to include HearingTypeCode (instead on hearing type descrip)
 * 01/07/2005 Phil Haferer - Amended mDetermineObligationRule(), adding an 'eventType' to support
 * the change to Obligations for the addition of Attachment of Earnings (AE) type events.
 * 06/09/2005 Chris Hutt - navigation rules not returned consistently. Suspect related to use of XPATH on an
 * element. Changed to use GetChild.. in mGetHearingNavigation
 * 29/09/2005 Chris Hutt - CaseEvent details added to output where no navigation rules returned to client
 * (needed for word processing)
 * 27/10/2005 Chris Hutt - Adding HearingID (HRG_SEQ) to navigation returns
 * 19/05/2006 Dave Wright - Refactor of exception handling. Defect 2689.
 * 27/07/2006 Phil Haferer - TD 3959: MAINTAIN CO HEARING - UC008: The CO Hearing Event 200 is not updated in line
 * with a revised hearing date/time.
 * 11/08/2006 Chris Hutt - TD 3959: the date / time of associated AE event also needs to be updated
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 24/01/2007 Chris Hutt - temp_caseman defect 423: CASE_EVENT.CRT_CODE should be derived from CASES.ADMIN_CRT_CODE
 * and not HEARINGS.CRT_CODE (which is the venue)
 *
 * @author gzyysf
 */
public class InsertCaseEvent200CreateHearingCustomProcessor implements ICustomProcessor
{
    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * Insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";
    /**
     * Obligation service name.
     */
    public static final String OBLIG_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * Determin active obligations local method name.
     */
    public static final String CHK_IF_ACTIVE_OBLIGS = "determineActiveObligationsLocal";
    /**
     * Determine obligation rule local method name.
     */
    public static final String GET_OBLIG_RULE = "determineObligationRuleLocal";
    /**
     * Hearing service name.
     */
    public static final String HEARING_SERVICE = "ejb/HearingServiceLocal";
    /**
     * Update Case Event Details method name.
     */
    public static final String UPDATE_CASE_EVENT_DETAILS_METHOD = "updateCaseEventDetailsLocal";

    /**
     * Update Ae Event Details method name.
     */
    public static final String UPDATE_AE_EVENT_DETAILS_METHOD = "updateAeEventDetailsLocal";

    /** The Constant CASE_EVENT_TYPE. */
    private static final String CASE_EVENT_TYPE = "C";
    
    /** The hearings X path. */
    private final XPath hearingsXPath;

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The out. */
    private final XMLOutputter out;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public InsertCaseEvent200CreateHearingCustomProcessor () throws JDOMException
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
        Element insertCaseEventRowElement = null;
        Element wftHearingTypeListElement = null;
        Element hearingNavigationElement = null;
        List<Element> hearingList = null;
        Iterator<Element> it = null;
        String caseNumber = null;
        boolean wftNavListRetrieved = false;
        boolean hearingNavigationFlagged = false;
        String adminCourtCode = null;

        try
        {
            maintainHearingsElement = pDocParams.getRootElement ();

            caseNumber =
                    ((Element) XPath.selectSingleNode (maintainHearingsElement, "/ds/MaintainHearing/CaseNumber"))
                            .getText ();
            adminCourtCode = ((Element) XPath.selectSingleNode (maintainHearingsElement,
                    "/ds/MaintainHearing/OwningCourtCode")).getText ();

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
                    final Element caseEventParamsElement =
                            mBuildAddHearingCaseEvent (hearingElement, caseNumber, adminCourtCode);

                    // call the insert case event service
                    insertCaseEventRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    // get the list of hearingTypes Linked to Wfts
                    if ( !wftNavListRetrieved)
                    {
                        wftHearingTypeListElement = mGetWftHearingTypeList ();
                        wftNavListRetrieved = true;
                    }

                    // work out the navigation rules for this hearing
                    hearingNavigationElement = mGetHearingNavigation (insertCaseEventRowElement, hearingElement,
                            wftHearingTypeListElement, caseNumber);

                    if (null == hearingNavigationElement)
                    {
                        // No navigation involved. Add the CaseEvent element to the original XML
                        // (Required for Word Processing)
                        hearingElement.addContent (
                                ((Element) insertCaseEventRowElement.getChild ("CaseEventSeq").clone ()).detach ());
                    }
                    else
                    {
                        // Navigation involved, will need to substitute original XML
                        // with navigation api for return to client.
                        hearingNavigationFlagged = true;
                    }
                }
                else
                {
                    // When updating rather adding a Hearing, there may be a need to update the Case Event.
                    // Has the Date/Time of the Hearing changed?
                    final String hearingDateAndTimeChanged = hearingElement.getChildText ("HearingDateAndTimeChanged");
                    if (null != hearingDateAndTimeChanged && hearingDateAndTimeChanged.equals ("Y"))
                    {
                        final String details = formatDetails (
                                /* String pHearingType */hearingElement.getChildText ("TypeOfHearingCode"),
                                /* String pDateString */hearingElement.getChildText ("Date"),
                                /* String pSecsString */hearingElement.getChildText ("Time"));
                        mUpdateCaseEventDetails (/* String pDetails */details, /* String pCaseNumber */caseNumber,
                                /* String pHrgSeq */hearingElement.getChildText ("HearingID"));

                        // now update AE event (if there is one)
                        final String aeDetails = formatAeEventDetails (details);
                        mUpdateAeEventDetails (/* String pDetails */aeDetails,
                                /* String pHrgSeq */hearingElement.getChildText ("HearingID"));
                    }
                }
            }

            /* Output the original XML. */
            final String sXml;
            if (hearingNavigationFlagged)
            {
                sXml = out.outputString (hearingNavigationElement);
            }
            else
            {
                sXml = out.outputString (maintainHearingsElement);
            }

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
     * M update case event details.
     *
     * @param pDetails the details
     * @param pCaseNumber the case number
     * @param pHrgSeq the hrg seq
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCaseEventDetails (final String pDetails, final String pCaseNumber, final String pHrgSeq)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "details", pDetails);
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "hrgSeq", pHrgSeq);

        final String sXmlParams = out.outputString (paramsElement);

        localServiceProxy.getJDOM (HEARING_SERVICE, UPDATE_CASE_EVENT_DETAILS_METHOD, sXmlParams);
    } // mUpdateCaseEventDetails()

    /**
     * M update ae event details.
     *
     * @param pDetails the details
     * @param pHrgSeq the hrg seq
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateAeEventDetails (final String pDetails, final String pHrgSeq)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "details", pDetails);
        XMLBuilder.addParam (paramsElement, "hrgSeq", pHrgSeq);

        final String sXmlParams = out.outputString (paramsElement);

        localServiceProxy.getJDOM (HEARING_SERVICE, UPDATE_AE_EVENT_DETAILS_METHOD, sXmlParams);
    } // mUpdateAeEventDetails()

    /**
     * (non-Javadoc)
     * Calls a service to get the WFT hearing types.
     *
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetWftHearingTypeList () throws BusinessException, SystemException
    {

        // get the list of hearingTypes Linked to Wfts

        Element wftHearingTypeListElement = null;

        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.add (paramsElement, "param");
        final String sXmlParams = out.outputString (paramsElement);

        wftHearingTypeListElement = localServiceProxy
                .getJDOM (WftDefs.WFT_SERVICE, WftDefs.GET_WFT_HEARING_TYPES, sXmlParams).getRootElement ();

        return wftHearingTypeListElement;

    }

    /**
     * (non-Javadoc)
     * Gets hearing navigation data.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @param pHearingElement the hearing element
     * @param pWftHearingTypeListElement the wft hearing type list element
     * @param pCaseNumber the case number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetHearingNavigation (final Element pInsertCaseEventRowElement, final Element pHearingElement,
                                           final Element pWftHearingTypeListElement, final String pCaseNumber)
        throws BusinessException, SystemException, JDOMException
    {

        Element hearingNavigationElement = null;
        String wftNavString = "false";
        String obligationNavString = "false";
        String hearingType = null;
        Element wftHearingTypeElement = null;
        Element obligationsElement = null;
        Element navParamsElement = null;
        Element hearingNavigationListElement = null;

        List<Element> wftlist = null;
        Iterator<Element> it = null;

        hearingType = pHearingElement.getChildText ("TypeOfHearingCode");

        wftlist = XPath.newInstance ("//HearingType/Value").selectNodes (pWftHearingTypeListElement);
        it = wftlist.iterator ();

        wftNavString = "false";
        String wftVal = null;

        while (it.hasNext ())
        {
            wftHearingTypeElement = (Element) it.next ();
            wftVal = wftHearingTypeElement.getText ();
            if (wftVal.equals (hearingType))
            {
                wftNavString = "true";
                break;
            }
        }

        // are there any associated obligations?
        obligationsElement = mGetObligations (pCaseNumber);

        obligationNavString = "false";

        obligationsElement = (Element) XPath.selectSingleNode (obligationsElement, "/Obligations/Type");
        if (obligationsElement != null)
        {
            final String obVal = obligationsElement.getValue ();
            if (obVal.equals ("A"))
            {
                obligationNavString = "true";
            }
        }

        // build the navigation element
        hearingNavigationElement = mHearingNavigationXMLBuilder (wftNavString, obligationNavString);

        // construct the return element
        if (wftNavString.equals ("true") || obligationNavString.equals ("true"))
        {
            // if ((hearingFound.booleanValue() == true)|| (activeObligations.booleanValue() == true)){

            hearingNavigationListElement = new Element ("HearingsNavigationList");
            hearingNavigationListElement
                    .addContent (((Element) pHearingElement.getChild ("HearingID").clone ()).detach ());
            hearingNavigationListElement.addContent (((Element) hearingNavigationElement.clone ()).detach ());

            // construct params associated with navigation
            navParamsElement = mBuildNavParams (pInsertCaseEventRowElement, wftNavString, obligationNavString);
            hearingNavigationListElement.addContent (((Element) navParamsElement.clone ()).detach ());

        }

        return hearingNavigationListElement;
    }

    /**
     * (non-Javadoc)
     * Calls a sefvice to get obligation rule data and returns a nav params element.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @param pWftNavString the wft nav string
     * @param pObligationNavString the obligation nav string
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mBuildNavParams (final Element pInsertCaseEventRowElement, final String pWftNavString,
                                     final String pObligationNavString)
        throws BusinessException, SystemException
    {

        final Element navParamsElement = new Element ("Params");
        final String caseNumber = pInsertCaseEventRowElement.getChildText ("CaseNumber");

        if (pWftNavString.equals ("true"))
        {

            final Element wftElement = new Element ("WindowForTrial");
            XMLBuilder.add (wftElement, "CaseNumber", caseNumber);
            navParamsElement.addContent (((Element) wftElement.clone ()).detach ());
        }

        if (pObligationNavString.equals ("true"))
        {

            Element obligationsRulesElement = null;

            final String eventID = pInsertCaseEventRowElement.getChildText ("StandardEventId");
            final String lastUpdateUser = pInsertCaseEventRowElement.getChildText ("UserName");
            final String eventSeq = pInsertCaseEventRowElement.getChildText ("CaseEventSeq");

            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
            XMLBuilder.addParam (paramsElement, "eventID", eventID);
            XMLBuilder.addParam (paramsElement, "lastUpdateUser", lastUpdateUser);
            XMLBuilder.addParam (paramsElement, "eventSeq", eventSeq);
            XMLBuilder.addParam (paramsElement, "eventType", "C"); // Event Type = 'Case Events'

            final String sXmlParams = out.outputString (paramsElement);

            obligationsRulesElement =
                    localServiceProxy.getJDOM (OBLIG_SERVICE, GET_OBLIG_RULE, sXmlParams).getRootElement ();

            navParamsElement.addContent (((Element) obligationsRulesElement.clone ()).detach ());
        }

        return navParamsElement;

    }

    /**
     * (non-Javadoc)
     * establish whether there are Obligations associated with the case.
     *
     * @param pCaseNumber the case number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetObligations (final String pCaseNumber) throws BusinessException, SystemException
    {

        Element obligationsElement = null;

        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "eventType", CASE_EVENT_TYPE);

        final String sXmlParams = out.outputString (paramsElement);

        obligationsElement =
                localServiceProxy.getJDOM (OBLIG_SERVICE, CHK_IF_ACTIVE_OBLIGS, sXmlParams).getRootElement ();

        return obligationsElement;

    }

    /**
     * (non-Javadoc)
     * Return an element containing the obligations and window for trial data.
     *
     * @param pWftNav the wft nav
     * @param pObligationNav the obligation nav
     * @return the element
     */
    private Element mHearingNavigationXMLBuilder (final String pWftNav, final String pObligationNav)
    {

        // Element navListElement = new Element("HearingsNavigationList");
        final Element navElement = new Element ("NavigateTo");

        XMLBuilder.add (navElement, "Obligations", pObligationNav);
        XMLBuilder.add (navElement, "WindowForTrial", pWftNav);

        // navListElement.addContent(((Element)navElement.clone()).detach());
        // navListElement.addContent("Params");

        return navElement;
    }

    /**
     * (non-Javadoc)
     * Create a params element containing case event details.
     *
     * @param pHearingElement the hearing element
     * @param pCaseNumber the case number
     * @param pAdminCourtCode the admin court code
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildAddHearingCaseEvent (final Element pHearingElement, final String pCaseNumber,
                                               final String pAdminCourtCode)
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
        String listingType = null;

        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        Element listTypeElement = null;

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        receiptDate = ((Element) XPath.selectSingleNode (pHearingElement, "DateOfRequestToList")).getText ();

        hearingType = ((Element) XPath.selectSingleNode (pHearingElement, "TypeOfHearingCode")).getText ();

        hearingDate = ((Element) XPath.selectSingleNode (pHearingElement, "Date")).getText ();

        hearingTime = ((Element) XPath.selectSingleNode (pHearingElement, "Time")).getText ();

        hearingId = ((Element) XPath.selectSingleNode (pHearingElement, "HearingID")).getText ();

        userName = ((Element) XPath.selectSingleNode (pHearingElement, "CreatedBy")).getText ();

        listTypeElement = (Element) XPath.selectSingleNode (pHearingElement, "ListingType");

        if (null != listTypeElement)
        {
            listingType = pHearingElement.getText ();

            listingType = ((Element) XPath.selectSingleNode (pHearingElement, "ListingType")).getText ();

            if (listingType.equals ("LST"))
            {
                listingType = "LISTING";
            }
            else if (listingType.equals ("RELST"))
            {
                listingType = "RE-LISTING";
            }

        }
        else
        {
            listingType = "";
        }

        eventDetails = formatDetails (hearingType, hearingDate, hearingTime);

        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"200", /* String subjectCasePartyNumber */"",
                /* String subjectPartyRoleCode */"", /* String applicant */"", /* String eventDetails */eventDetails,
                /* String eventDate */eventDate, /* String result */"", /* String warrantId */"",
                /* String judgmentSeq */"", /* String varySeq */"", /* String hrgSeq */hearingId,
                /* String deletedFlag */"", /* String userName */userName, /* String receiptDate */receiptDate,
                /* String task */"", /* String statsModule */"", /* String ageCategory */"",
                /* String courtCode */pAdminCourtCode, /* String resultDate */"", /* String dateToRtl */"",
                /* String caseFlag */"", /* String listingType */listingType);

        caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildAddHearingCaseEvent()

    /**
     * (non-Javadoc)
     * Call a service to insert a case event.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertCaseEventRowElement = null;

        final String sXmlParams = out.outputString (pCaseEventParamsElement);

        insertCaseEventRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_ROW_METHOD, sXmlParams).getRootElement ();

        return insertCaseEventRowElement;
    } // mInsertCaseEventRow()

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
     * (non-Javadoc)
     * Format hearing date and details.
     *
     * @param pDetails the details
     * @return the string
     * @throws SystemException the system exception
     */
    private String formatAeEventDetails (final String pDetails) throws SystemException
    {

        // substitute hearing type used for Cae Event update with 'HRG'

        int idx = 0;
        idx = pDetails.indexOf (":");
        final String newDetails = "HRG" + pDetails.substring (idx);

        return newDetails;

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
