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

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: CaseEvent
 * Method: addCaseEvent
 * Class: AddCaseEvent.java
 * Created: Phil Haferer (EDS) 07-Feb-2005
 * Description:
 * Java class to organise the various components required to implement the
 * addition of a Case Event from the "Manage Case Events" screen.
 *
 * Consists of 3 main components:-
 * - Validate that it is legal for the Case Event to be added.
 * - Insert the Case Event (which also handles the update of related data).
 * - Identify which Nagivation actions the client should take following the
 * addition of the Case Event.
 *
 * Change History:
 * 26/05/2005 Phil Haferer - UCT Defect 52: Return the new sequence number to enable the
 * the client-side to move the focus to new item in the list.
 * 01/07/2005 Phil Haferer - Amended mDetermineObligationRule(), adding an 'eventType' to support
 * the change to Obligations for the addition of Attachment of Earnings (AE) type events.
 * 15/11/2005 Chris Hutt - CCBC option to navigate into Transfer Case screen
 * 16/11/2005 Phil Haferer - Performance Related: Moved the calls to mGetCaseType(), to remove repeated calls.
 * 17/03/2006 Chris Hutt - defect 2590 - CCBC needs option to exclude obligation navigation on certain events
 * 04/04/2006 Chris Hutt - defect UCT458 - exclude WP navigation if user has not taken WP option
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 12/06/2006 Chris Hutt - defect UCT365: implement specific rule covering WP navigation for CCBC
 * 24/08/2006 Chris Hutt - defect 4666 - CCBC Transfer Case navigation rules should only apply to court 335
 * 11/04/2007 Chris Hutt - defect UCT_Group2. Window For Trial navigation excluded for CCBC
 * 24 Apr 2007 Chris Hutt - defect 6058 - Add JudgmentId to Wordprocessing navigation node where
 * UpdateDeterminationJudgment set to true
 * 02/05/2007 Chris Hutt - isCCBCWpOutputImmediate dependency added for CCBC
 * 10/07/2007 Chris Hutt - defect UCTGroup2 1477: auto obligations being wrongly created for CCBC. This was is
 * because mDetermineObligationRule will create an auto obligation
 * as well as merely determining if obligations apply.
 * 15-Nov-2012 Chris Vincent - Change to mAddExtraWordProcessingData to include WelshTranslation node
 * which included creating new method mGetCaseWelshTranslation. Trac 4761.
 * 28-Jan-2013 Chris Vincent - change to mDetermineObligationRule so for case event 196, the event id is appended with
 * the first letter of the case track. Also added Track node to mAddExtraWordProcessingData. Trac 4763.
 * 12/10/2016 Chris Vincent: bulk printing changes to ensure outputs on Family Enforcement cases are not
 * bulk printed. Trac 5883
 * 
 * @author Phil Haferer
 */
public class AddCaseEventCustomProcessor extends AbstractCasemanCustomProcessor
{
    /**
     * Obligation service name.
     */
    public static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * Determine obligation rule method name.
     */
    public static final String DETERMINE_OBLIGATION_RULE_METHOD = "determineObligationRuleLocal";

    /**
     * Window for trial service name.
     */
    public static final String WINDOW_FOR_TRAIL_SERVICE = "ejb/WindowForTrialServiceLocal";
    /**
     * Get wft navigation data method name.
     */
    public static final String GET_WFT_NAVIGATION_DATA_METHOD = "getWftNavigationDataLocal";

    /**
     * Case service name.
     */
    public static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    /**
     * Get case summary method name.
     */
    public static final String GET_CASE_SUMMARY = "getCaseLocal";

    /**
     * CCBC court code.
     */
    public static final String CCBC_COURT_CODE = "335";

    /**
     * Constructor.
     */
    public AddCaseEventCustomProcessor ()
    {
        super ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException, BusinessException
    {
        Element insertCaseEventRowElement = null;
        Element caseEventNavigationListElement = null;
        String courtCode = null;

        try
        {
            // Insert a CASE_EVENTS row.
            insertCaseEventRowElement = mInsertCaseEventRow (pDocParams);

            // Build a Navigation XML Document for the Client.
            caseEventNavigationListElement = mBuildNavigationXMLElement (insertCaseEventRowElement);

            // Insert the WP_OUTPUT record if appropriate
            // If CCBC court this is conditional upon CCBCWpOutputImmediate.
            courtCode = insertCaseEventRowElement.getChildText ("CourtCode");
            final ICaseEventConfigDO caseEventConfigDO = mGetCaseEventConfigDO (insertCaseEventRowElement);
            if (!courtCode.equals (CCBC_COURT_CODE) ||
                    courtCode.equals (CCBC_COURT_CODE) && caseEventConfigDO.isCCBCWpOutputImmediate ())
            {

                final Element userIdElement =
                        (Element) XPath.selectSingleNode (pDocParams, "params/param[@name='userId'");
                if (null != userIdElement)
                {
                    final String userId = userIdElement.getText ();
                    mInsertWpOutputRow (caseEventNavigationListElement, userId);
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final SQLException e)
        {
            throw new SystemException (e);
        }
        catch (final NamingException e)
        {
            throw new SystemException (e);
        }

        return caseEventNavigationListElement.getDocument ();
    }

    /**
     * (non-Javadoc)
     * Construct the XML required for navigation, including wordprocessing data.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mBuildNavigationXMLElement (final Element pInsertCaseEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element caseEventNavigationListElement = null;
        Element navigationListElement = null;
        Element navigateToElement = null;
        Element paramsElement = null;
        ICaseEventConfigDO caseEventConfigDO = null;
        String actionFlow = null;
        String sValue = null;
        Element caseElement = null;
        String courtCode = null;
        Element NavigatetoWPElement = null;
        boolean navigateToWP = false;
        boolean judgmentIdReqdForWp = false;

        try
        {

            // Retrieve court code (for CCBC tests)
            courtCode = pInsertCaseEventRowElement.getChildText ("CourtCode");

            // Retrieve the configuration associated with the current event.
            caseEventConfigDO = mGetCaseEventConfigDO (pInsertCaseEventRowElement);

            // Initialise the XML to be returned.
            caseEventNavigationListElement = mInitCaseEventNavigationListXMLElement ();

            // Add the Sequence Number of the newly inserted Case Event to the returned XML.
            sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
            XMLBuilder.add (caseEventNavigationListElement, "CaseEventSeq", sValue);

            // Construct the Obligations part of the XML.
            navigateToElement = new Element ("Obligations");
            if (courtCode.equals (CCBC_COURT_CODE) && caseEventConfigDO.isCCBCObligationsExcluded ())
            {
                // here get get CCBC events where obligations are excluded out of the way
                navigateToElement.addContent ("false");
            }
            else
            {

                paramsElement = mDetermineObligationRule (pInsertCaseEventRowElement);

                // Construct the "NavigateTo" Element.
                actionFlow = XMLBuilder.getXPathValue (paramsElement, "/Obligation/ActionFlow");
                if (actionFlow.equals ("N"))
                {
                    // No obligation found or no flow required.
                    navigateToElement.addContent ("false");
                }
                else
                {
                    navigateToElement.addContent ("true");
                }
            }

            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Word Processing part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("WordProcessing");
            if (caseEventConfigDO.isWordProcessingCall () && !courtCode.equals (CCBC_COURT_CODE) ||
                    caseEventConfigDO.isCCBCWordProcessingCall () && courtCode.equals (CCBC_COURT_CODE))
            {

                NavigatetoWPElement =
                        (Element) XPath.selectSingleNode (pInsertCaseEventRowElement, "/CaseEvent/NavigateToWP");

                if (null != NavigatetoWPElement)
                {

                    if (NavigatetoWPElement.getText ().equals ("true"))
                    {
                        paramsElement = new Element ("WordProcessing");

                        if (caseElement == null)
                        {
                            caseElement = mGetCaseType (pInsertCaseEventRowElement);
                        }

                        // Establish whether JudgmentId required for word processing
                        judgmentIdReqdForWp = false; // default option
                        if (caseEventConfigDO.isUpdateDeterminationJudgment ())
                        {
                            judgmentIdReqdForWp = true;
                        }

                        paramsElement = mAddExtraWordProcessingData (pInsertCaseEventRowElement, paramsElement,
                                caseElement, judgmentIdReqdForWp);
                        navigateToWP = true;
                    }
                }
            }

            if (navigateToWP)
            {
                navigateToElement.addContent ("true");
            }
            else
            {
                navigateToElement.addContent ("false");
            }

            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Transfer case part of the XML.
            navigateToElement = new Element ("TransferCase");
            if (courtCode.equals (CCBC_COURT_CODE))
            {
                if (caseEventConfigDO.isCCBCTransferCaseCall ())
                {
                    navigateToElement.addContent ("true");
                }
                else
                {
                    navigateToElement.addContent ("false");
                }
            }
            else
            {
                navigateToElement.addContent ("false");
            }

            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Oracle Report part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("OracleReport");
            if (caseEventConfigDO.isOracleReportCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("WordProcessing");
                if (caseElement == null)
                {
                    caseElement = mGetCaseType (pInsertCaseEventRowElement);
                }
                paramsElement = mAddExtraOracleReportData (pInsertCaseEventRowElement, paramsElement, caseElement);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);
            // Construct the Window For Trail part of the XML (provided not a CCBC case)
            paramsElement = null;
            navigateToElement = null;
            if ( !courtCode.equals (CCBC_COURT_CODE) && caseEventConfigDO.isWindowForTrialCall ())
            {
                navigationListElement = mGetWftNavigationData (pInsertCaseEventRowElement);
                paramsElement = (Element) XPath.selectSingleNode (navigationListElement,
                        "/WindowForTrialNavigationData/Params/WindowForTrial");
                paramsElement = mAddExtraWindowForTrialData (pInsertCaseEventRowElement, paramsElement);
                navigateToElement = (Element) XPath.selectSingleNode (navigationListElement,
                        "/WindowForTrialNavigationData/NavigationTo/WindowForTrial");
            }
            else
            {
                navigateToElement = new Element ("WindowForTrial");
                navigateToElement.addContent ("false");
            }
            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Hearing part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("Hearing");
            if (caseEventConfigDO.isHearingCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("Hearing");
                sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
                XMLBuilder.add (paramsElement, "CaseNumber", sValue);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Judgment part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("Judgment");
            if (caseEventConfigDO.isJudgmentCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("Judgment");
                sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
                XMLBuilder.add (paramsElement, "CaseNumber", sValue);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddToCaseEventNavigationListXMLElement (caseEventNavigationListElement, navigateToElement, paramsElement);

        }
        finally
        {
            navigateToElement = null;
            navigationListElement = null;
            paramsElement = null;
            caseEventConfigDO = null;
            actionFlow = null;
            sValue = null;
            caseElement = null;
            courtCode = null;
            NavigatetoWPElement = null;
        }

        return caseEventNavigationListElement;
    } // mBuildNavigationXMLElement()

    /**
     * (non-Javadoc)
     * Add navigation params to a document and return the root element.
     *
     * @return the element
     */
    private Element mInitCaseEventNavigationListXMLElement ()
    {
        final Document document = new Document ();
        Element rootElement = null;

        rootElement = new Element ("CaseEventNavigationList");
        document.setRootElement (rootElement);
        XMLBuilder.add (rootElement, "NavigateTo");
        XMLBuilder.add (rootElement, "Params");

        return rootElement;
    }

    /**
     * (non-Javadoc)
     * Add params and navigate to elements to a navigation list XML element.
     *
     * @param pCaseEventNavigationListElement the case event navigation list element
     * @param pNavigateToElement the navigate to element
     * @param pParamsElement the params element
     * @throws JDOMException the JDOM exception
     */
    private void mAddToCaseEventNavigationListXMLElement (final Element pCaseEventNavigationListElement,
                                                          final Element pNavigateToElement,
                                                          final Element pParamsElement)
        throws JDOMException
    {
        Element insertParentElement = null;

        insertParentElement = (Element) XPath.selectSingleNode (pCaseEventNavigationListElement,
                "/CaseEventNavigationList/NavigateTo");

        insertParentElement.addContent (((Element) pNavigateToElement.clone ()).detach ());

        if (null != pParamsElement)
        {
            insertParentElement = (Element) XPath.selectSingleNode (pCaseEventNavigationListElement,
                    "/CaseEventNavigationList/Params");
            insertParentElement.addContent (((Element) pParamsElement.clone ()).detach ());
        }
    } // mAddToCaseEventNavigationListXMLElement()

    /**
     * (non-Javadoc)
     * Create the required parameters XML and call a service to insert a case event.
     *
     * @param pDocParams the doc params
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mInsertCaseEventRow (final Document pDocParams)
        throws SystemException, BusinessException, JDOMException
    {
        Element insertCaseEventRowElement = null;
        Element caseEventElement = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element paramsElement = null;

        try
        {
            // Populate a 'CaseEvent' object from the input XML document.
            caseEventElement =
                    (Element) XPath.selectSingleNode (pDocParams.getRootElement (), "/params/param/CaseEvent");
            caseEventXMLBuilder = new CaseEventXMLBuilder (caseEventElement);

            // Generate a new XML 'document' from the 'CaseEvent object.
            // (This will contain all the element nodes required for 'InsertCaseEventRow()'.
            caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Call the service.
            insertCaseEventRowElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD, paramsElement.getDocument ()).getRootElement ();
        }
        finally
        {
            caseEventElement = null;
            caseEventXMLBuilder = null;
        }

        return insertCaseEventRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Build the params XML and call the obligation rule service with it.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineObligationRule (final Element pInsertCaseEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element obligationElement = null;
        Element paramsElement = null;
        String sValue = null;
        String sTrack = null;

        // Build the Parameter XML for passing to the Determine Obligation Rule service.
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/StandardEventId");
        if (sValue.equals ("196"))
        {
            // Special rule for case event 196, the obligation rules depend upon the Track of the case event
            sTrack = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/Track");
            sValue = sValue + sTrack.substring (0, 1);
        }
        XMLBuilder.addParam (paramsElement, "eventID", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/UserName");
        XMLBuilder.addParam (paramsElement, "lastUpdateUser", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
        XMLBuilder.addParam (paramsElement, "eventSeq", sValue);

        XMLBuilder.addParam (paramsElement, "eventType", "C"); // Event Type = 'Case Events'

        obligationElement = invokeLocalServiceProxy (OBLIGATION_SERVICE, DETERMINE_OBLIGATION_RULE_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return obligationElement;
    } // mDetermineObligationRule()

    /**
     * (non-Javadoc)
     * Get and return the window for trial navigation data for a specific case and event.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetWftNavigationData (final Element pInsertCaseEventRowElement)
        throws SystemException, BusinessException, JDOMException
    {
        Element navigationListElement = null;

        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the service.
        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/StandardEventId");
        XMLBuilder.addParam (paramsElement, "eventId", sValue);

        navigationListElement = invokeLocalServiceProxy (WINDOW_FOR_TRAIL_SERVICE, GET_WFT_NAVIGATION_DATA_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return navigationListElement;
    } // mGetWftNavigationData()

    /**
     * (non-Javadoc)
     * Get window for trial data from case insertion data and append it to a window for trial element.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @param pWindowForTrialElement the window for trial element
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraWindowForTrialData (final Element pInsertCaseEventRowElement,
                                                 final Element pWindowForTrialElement)
        throws JDOMException
    {
        String sValue = null;

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
        XMLBuilder.add (pWindowForTrialElement, "CaseNumber", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
        XMLBuilder.add (pWindowForTrialElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/EventDetails");
        XMLBuilder.add (pWindowForTrialElement, "Details", sValue);

        return pWindowForTrialElement;
    } // mAddExtraWindowForTrialData()

    /**
     * (non-Javadoc)
     * Add a populated Event element to a word processing element.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @param pWordProcessingElement the word processing element
     * @param pCaseElement the case element
     * @param pJudgmentIdReqdForWp the judgment id reqd for wp
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mAddExtraWordProcessingData (final Element pInsertCaseEventRowElement,
                                                 final Element pWordProcessingElement, final Element pCaseElement,
                                                 final boolean pJudgmentIdReqdForWp)
        throws SystemException, JDOMException, BusinessException
    {
        String sValue = null;
        String caseNumber = null;
        String welshTranslation = null;
        String jurisdiction = null;
        String caseTrack = null;
        Element eventElement = null;
        Element judgmentElement = null;

        caseNumber = XMLBuilder.getXPathValue (pCaseElement, "/Case/CaseNumber");
        welshTranslation = mGetCaseWelshTranslation (caseNumber);
        XMLBuilder.add (pCaseElement, "WelshTranslation", welshTranslation);

        jurisdiction = mGetCaseTypeJurisdiction (caseNumber);
        XMLBuilder.add (pCaseElement, "Jurisdiction", jurisdiction);

        caseTrack = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/Track");
        XMLBuilder.add (pCaseElement, "Track", caseTrack);

        pWordProcessingElement.addContent (((Element) pCaseElement.clone ()).detach ());

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
        XMLBuilder.add (eventElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        if (pJudgmentIdReqdForWp)
        {
            // When judgment used by WP then the JugmentId needs to be passed.
            judgmentElement = new Element ("Judgment");
            pWordProcessingElement.addContent (judgmentElement);

            sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/JudgmentId");
            XMLBuilder.add (judgmentElement, "JudgmentId", sValue);
        }

        return pWordProcessingElement;
    } // mAddExtraWordProcessingData()

    /**
     * (non-Javadoc)
     * Call a service to determine whether a case has any parties who wish for outputs translated to Welsh.
     *
     * @param pCaseNumber The case number to be checked
     * @return String indicator of whether any parties on the case want Welsh translation.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseWelshTranslation (final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element welshTranslationElement = null;
        String welshTranslation = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            welshTranslationElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                    CaseDefs.GET_CASE_WELSH_TRANSLATION, paramsElement.getDocument ()).getRootElement ();

            if (null != welshTranslationElement)
            {
                welshTranslation = XMLBuilder.getXPathValue (welshTranslationElement, "/ds/Case/WelshTranslation");
            }
        }
        finally
        {
            paramsElement = null;
            welshTranslationElement = null;
        }

        return welshTranslation;
    } // mGetCaseWelshTranslation()

    /**
     * (non-Javadoc)
     * Call a service to determine the jurisdiction of the case in question.
     *
     * @param pCaseNumber The case number to be checked
     * @return String indicator of the case jurisdiction
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseTypeJurisdiction (final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element jurisdictionElement = null;
        String jurisdiction = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            jurisdictionElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_JURISDICTION,
                    paramsElement.getDocument ()).getRootElement ();

            if (null != jurisdictionElement)
            {
                jurisdiction = XMLBuilder.getXPathValue (jurisdictionElement, "/ds/Case/Jurisdiction");
            }
        }
        finally
        {
            paramsElement = null;
            jurisdictionElement = null;
        }

        return jurisdiction;
    } // mGetCaseWelshTranslation()

    /**
     * (non-Javadoc)
     * Add a populated Event element (with oracle reports data) to a word processing element.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @param pWordProcessingElement the word processing element
     * @param pCaseElement the case element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraOracleReportData (final Element pInsertCaseEventRowElement,
                                               final Element pWordProcessingElement, final Element pCaseElement)
        throws BusinessException, SystemException, JDOMException
    {
        String sValue = null;
        Element eventElement = null;
        pWordProcessingElement.addContent (((Element) pCaseElement.clone ()).detach ());

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
        XMLBuilder.add (eventElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/EventDetails");

        if (sValue != null && sValue.length () > 0)
        {
            sValue = sValue.substring (0, sValue.indexOf (":") == -1 ? sValue.length () : sValue.indexOf (":"));
            XMLBuilder.add (eventElement, "EventDetails", sValue);
        }

        final String caseNumber = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
        final String caseParams = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";

        final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
        final Element casexml =
                localServiceProxy.getJDOM (CASE_SERVICE, GET_CASE_SUMMARY, caseParams).getRootElement ();

        final Element manageCase = (Element) XPath.selectSingleNode (casexml, "/ds/ManageCase");
        pWordProcessingElement.addContent (((Element) manageCase.clone ()).detach ());

        return pWordProcessingElement;
    }

    /**
     * (non-Javadoc)
     * Retrieve the configuration data object associated with the standard Event id.
     *
     * @param pSourceElement the source element
     * @return the i case event config DO
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     */
    private ICaseEventConfigDO mGetCaseEventConfigDO (final Element pSourceElement)
        throws JDOMException, SystemException
    {
        ICaseEventConfigDO caseEventConfigDO = null;

        // Extract the Standard Event Id from XML Document.
        final Element standardEventIdElement =
                (Element) XPath.selectSingleNode (pSourceElement, "/CaseEvent/StandardEventId");
        final String sStandardEventId = standardEventIdElement.getText ();
        final int standardEventId = Integer.parseInt (sStandardEventId);

        // Retrieve the configuration data object associated with the standard Event id.
        final CaseEventConfigManager caseEventConfigManager = CaseEventConfigManager.getInstance ();
        caseEventConfigDO = caseEventConfigManager.getCaseEventConfigDO (standardEventId);

        return caseEventConfigDO;
    } // mGetCaseEventConfigDO()

    /**
     * (non-Javadoc)
     * Call the case service to get the case type from the case number.
     *
     * @param pInsertCaseEventRowElement the insert case event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCaseType (final Element pInsertCaseEventRowElement)
        throws SystemException, BusinessException, JDOMException
    {
        Element caseElement = null;

        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the service.
        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseNumber");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        caseElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_TYPE_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return caseElement;
    } // mGetCaseType()

    /**
     * M insert wp output row.
     *
     * @param caseEventNavigationListElement the case event navigation list element
     * @param userId the user id
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertWpOutputRow (final Element caseEventNavigationListElement, final String userId)
        throws JDOMException, SQLException, NamingException, SystemException, BusinessException
    {
        final Element NavigatetoWPElement = (Element) XPath.selectSingleNode (caseEventNavigationListElement,
                "/CaseEventNavigationList/NavigateTo/WordProcessing");

        if (null != NavigatetoWPElement)
        {

            if (NavigatetoWPElement.getText ().equals ("true"))
            {

                final String eventPK = XMLBuilder.getXPathValue (caseEventNavigationListElement,
                        "/CaseEventNavigationList/Params/WordProcessing/Event/CaseEventSeq");

                Connection conn = null;
                PreparedStatement stmt = null;
                PreparedStatement ps = null;
                ResultSet rs = null;

                try
                {
                    final Context ctx = new InitialContext ();
                    if (ctx == null)
                    {
                        throw new SystemException ("Could not retrieve Context.");
                    }
                    final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
                    if (ds != null)
                    {
                        conn = ds.getConnection ();
                        if (conn != null)
                        {
                            int key = 0;
                            stmt = conn.prepareStatement ("SELECT WP_OUTPUT_SEQUENCE.NEXTVAL FROM DUAL");
                            rs = stmt.executeQuery ();
                            if (rs.next ())
                            {
                                key = rs.getInt (1);
                                ps = conn.prepareStatement (
                                        "INSERT INTO WP_OUTPUT (OUTPUT_ID, PDF_SOURCE, DATE_CREATED, PRINTED, CO_EVENT_SEQ, EVENT_SEQ, AE_EVENT_SEQ, FINAL_IND, XMLSOURCE, USER_ID ) values ( ? , empty_blob() , SYSDATE, ?, ?, ? , ?, ? , ?, ?)");
                                ps.setInt (1, key);
                                ps.setString (2, "N");
                                ps.setObject (3, null);
                                ps.setObject (4, eventPK);
                                ps.setObject (5, null);
                                ps.setString (6, "N");
                                ps.setString (7, null);
                                ps.setString (8, userId);
                                ps.executeUpdate ();
                            }
                        }
                    }
                }
                finally
                {
                    if (rs != null)
                    {
                        rs.close ();
                    }
                    if (ps != null)
                    {
                        ps.close ();
                    }
                    if (stmt != null)
                    {
                        stmt.close ();
                    }
                    if (null != conn && !conn.isClosed ())
                    {
                        conn.close ();
                    }
                }
            }
        }
    } // mInsertWpOutputRow

} // class AddCaseEvent
