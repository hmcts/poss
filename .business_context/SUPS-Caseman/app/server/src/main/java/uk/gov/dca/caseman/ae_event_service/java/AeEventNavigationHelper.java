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
package uk.gov.dca.caseman.ae_event_service.java;

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
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 26 september 2005.
 *
 * @author gzyysf
 * 
 *         Change History:
 *         25/11/2015 - Chris Vincent, adding methods to determine if the AE employer has requested translation
 *         to Welsh. Trac 5725.
 *         12/10/2016 Chris Vincent: bulk printing chanegs to ensure outputs on Family Enforcement cases are not
 *         bulk printed. Trac 5883
 */
public class AeEventNavigationHelper
{

    /**
     * Obligation service name.
     */
    public static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * Determine obligation rule local method name.
     */
    public static final String DETERMINE_OBLIGATION_RULE_METHOD = "determineObligationRuleLocal";

    /**
     * Case service name.
     */
    public static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    /**
     * Get case local method name.
     */
    public static final String GET_CASE_SUMMARY = "getCaseLocal";
    /**
     * Ae service name.
     */
    public static final String AE_SERVICE = "ejb/AeServiceLocal";
    /**
     * Get ae details local method name.
     */
    public static final String GET_AE_DETAILS = "getAeDetailsLocal";
    /**
     * Get ae app types local method name.
     */
    public static final String GET_AE_APP_TYPES = "getAeAppTypesLocal";

    /** The Constant GET_CASE_WELSH_TRANSLATION. */
    public static final String GET_CASE_WELSH_TRANSLATION = "getCaseWelshTranslationLocal";

    /** The Constant GET_AE_EMP_WELSH_TRANSLATION. */
    public static final String GET_AE_EMP_WELSH_TRANSLATION = "getAeEmpWelshTranslationLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (AeEventNavigationHelper.class);

    /**
     * Instantiates a new ae event navigation helper.
     */
    public AeEventNavigationHelper ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * Builds navigation xml element.
     *
     * @param pInsertAeEventRowElement The ae event row element
     * @return Navigation element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public Element mBuildNavigationXMLElement (final Element pInsertAeEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element aeEventNavigationListElement = null;
        Element navigateToElement = null;
        Element paramsElement = null;
        IAeEventConfigDO aeEventConfigDO = null;
        String actionFlow = null;
        String sValue = null;

        try
        {
            // Retrieve the configuration associated with the current event.
            aeEventConfigDO = mGetAeEventConfigDO (pInsertAeEventRowElement);

            // Initialise the XML to be returned.
            aeEventNavigationListElement = mInitAeEventNavigationListXMLElement ();

            // Add the Sequence Number of the newly inserted Ae Event to the returned XML.
            sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AEEventSeq");
            XMLBuilder.add (aeEventNavigationListElement, "AEEventSeq", sValue);

            // Construct the Obligations part of the XML.
            paramsElement = mDetermineObligationRule (pInsertAeEventRowElement);
            navigateToElement = new Element ("Obligations");
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
            mAddToAeEventNavigationListXMLElement (aeEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Word Processing part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("WordProcessing");
            if (aeEventConfigDO.isWordProcessingCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("WordProcessing");
                paramsElement = mAddExtraWordProcessingData (pInsertAeEventRowElement, paramsElement);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddToAeEventNavigationListXMLElement (aeEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Oracle Report part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("OracleReport");
            if (aeEventConfigDO.isOracleReportCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("WordProcessing");
                paramsElement = mAddExtraOracleReportData (pInsertAeEventRowElement, paramsElement);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddToAeEventNavigationListXMLElement (aeEventNavigationListElement, navigateToElement, paramsElement);

        }
        finally
        {
            navigateToElement = null;
            paramsElement = null;
            aeEventConfigDO = null;
            actionFlow = null;
            sValue = null;
        }

        return aeEventNavigationListElement;
    } // mBuildNavigationXMLElement()

    /**
     * (non-Javadoc)
     * Creates and returns a navigation element.
     *
     * @return the element
     */
    private Element mInitAeEventNavigationListXMLElement ()
    {
        final Document document = new Document ();
        Element rootElement = null;

        rootElement = new Element ("AeEventNavigationList");
        document.setRootElement (rootElement);
        XMLBuilder.add (rootElement, "NavigateTo");
        XMLBuilder.add (rootElement, "Params");

        return rootElement;
    }

    /**
     * (non-Javadoc)
     * Adds an element to an ae event navigation list.
     *
     * @param pAeEventNavigationListElement the ae event navigation list element
     * @param pNavigateToElement the navigate to element
     * @param pParamsElement the params element
     * @throws JDOMException the JDOM exception
     */
    private void mAddToAeEventNavigationListXMLElement (final Element pAeEventNavigationListElement,
                                                        final Element pNavigateToElement, final Element pParamsElement)
        throws JDOMException
    {
        Element insertParentElement = null;

        insertParentElement =
                (Element) XPath.selectSingleNode (pAeEventNavigationListElement, "/AeEventNavigationList/NavigateTo");

        insertParentElement.addContent (((Element) pNavigateToElement.clone ()).detach ());

        if (null != pParamsElement)
        {
            insertParentElement =
                    (Element) XPath.selectSingleNode (pAeEventNavigationListElement, "/AeEventNavigationList/Params");
            insertParentElement.addContent (((Element) pParamsElement.clone ()).detach ());
        }
    } // mAddToAeEventNavigationListXMLElement()

    /**
     * (non-Javadoc)
     * Builds parameters element for passing to obligation rule service.
     *
     * @param pInsertAeEventRowElement the insert ae event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineObligationRule (final Element pInsertAeEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element obligationElement = null;
        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the Determine Obligation Rule service.
        paramsElement = XMLBuilder.getNewParamsElement ();

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/CaseNumber");
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/StandardEventId");
        XMLBuilder.addParam (paramsElement, "eventID", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/UserName");
        XMLBuilder.addParam (paramsElement, "lastUpdateUser", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AEEventSeq");
        XMLBuilder.addParam (paramsElement, "eventSeq", sValue);

        XMLBuilder.addParam (paramsElement, "eventType", "A"); // Event Type = AEEvents

        // Turn the XML into a string, and call the service.
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        obligationElement = localServiceProxy.getJDOM (OBLIGATION_SERVICE, DETERMINE_OBLIGATION_RULE_METHOD, sXmlParams)
                .getRootElement ();

        return obligationElement;
    } // mDetermineObligationRule()

    /**
     * (non-Javadoc)
     * Adds word processing data to an event element.
     *
     * @param pInsertAeEventRowElement the insert ae event row element
     * @param pWordProcessingElement the word processing element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraWordProcessingData (final Element pInsertAeEventRowElement,
                                                 final Element pWordProcessingElement)
        throws BusinessException, SystemException, JDOMException
    {
        String sValue = null;
        Element aeElement = null;
        Element eventElement = null;
        String caseNumber = null;
        String welshTranslation = null;
        String aeNumber = null;
        String welshEmp = null;
        String jurisdiction = null;

        aeElement = mGetCaseType (pInsertAeEventRowElement);
        caseNumber = XMLBuilder.getXPathValue (aeElement, "/Case/CaseNumber");
        aeNumber = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AENumber");
        welshTranslation = mGetCaseWelshTranslation (caseNumber);
        welshEmp = mGetAeEmpWelshTranslation (aeNumber);
        if (welshEmp.equals ("Y"))
        {
            welshTranslation = "Y";
        }
        XMLBuilder.add (aeElement, "WelshTranslation", welshTranslation);

        jurisdiction = mGetCaseTypeJurisdiction (caseNumber);
        XMLBuilder.add (aeElement, "Jurisdiction", jurisdiction);

        pWordProcessingElement.addContent (((Element) aeElement.clone ()).detach ());

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/CaseEventSeq");
        XMLBuilder.add (eventElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        return pWordProcessingElement;
    } // mAddExtraWordProcessingData()

    /**
     * (non-Javadoc)
     * Adds oracle reports data to an event element.
     *
     * @param pInsertAeEventRowElement the insert ae event row element
     * @param pWordProcessingElement the word processing element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraOracleReportData (final Element pInsertAeEventRowElement,
                                               final Element pWordProcessingElement)
        throws BusinessException, SystemException, JDOMException
    {
        XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        String sValue = null;
        String caseNumber = null;
        String aeNumber = null;
        String welshTranslation = null;
        String welshEmp = null;
        Element aeElement = null;
        Element eventElement = null;
        String jurisdiction = null;

        aeElement = mGetCaseType (pInsertAeEventRowElement);
        caseNumber = XMLBuilder.getXPathValue (aeElement, "/Case/CaseNumber");
        aeNumber = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AENumber");
        welshTranslation = mGetCaseWelshTranslation (caseNumber);
        welshEmp = mGetAeEmpWelshTranslation (aeNumber);
        if (welshEmp.equals ("Y"))
        {
            welshTranslation = "Y";
        }
        XMLBuilder.add (aeElement, "WelshTranslation", welshTranslation);

        jurisdiction = mGetCaseTypeJurisdiction (caseNumber);
        XMLBuilder.add (aeElement, "Jurisdiction", jurisdiction);
        pWordProcessingElement.addContent (((Element) aeElement.clone ()).detach ());

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AEEventSeq");
        XMLBuilder.add (eventElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/EventDetails");
        XMLBuilder.add (eventElement, "CompleteEventDetails", sValue);

        if (sValue != null && sValue.length () > 0)
        {
            sValue = sValue.substring (0, sValue.indexOf (":") == -1 ? sValue.length () : sValue.indexOf (":"));
            XMLBuilder.add (eventElement, "EventDetails", sValue);
        }

        final String stage = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/Stage");
        XMLBuilder.add (eventElement, "IssueStage", stage);

        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/AENumber");
        XMLBuilder.add (eventElement, "AENumber", sValue);

        caseNumber = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/CaseNumber");
        final String caseParams = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";
        final Element casexml =
                localServiceProxy.getJDOM (CASE_SERVICE, GET_CASE_SUMMARY, caseParams).getRootElement ();

        xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final Element manageCase = (Element) XPath.selectSingleNode (casexml, "/ds/ManageCase");
        pWordProcessingElement.addContent (((Element) manageCase.clone ()).detach ());

        final Element aexml = localServiceProxy.getJDOM (AE_SERVICE, GET_AE_DETAILS, caseParams).getRootElement ();

        // xmlOutputter = new XMLOutputter(Format.getPrettyFormat());
        Element aeDetails = (Element) XPath.selectSingleNode (aexml,
                "/AEApplications/AEApplication[AENumber = '" + aeNumber + "']");
        aeDetails = (Element) aeDetails.detach ();
        final String aeType = XMLBuilder.getXPathValue (aeDetails, "AEType");

        final Element paramsElement = XMLBuilder.getNewParamsElement ();

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        final Element aeTypesxml =
                localServiceProxy.getJDOM (AE_SERVICE, GET_AE_APP_TYPES, sXmlParams).getRootElement ();
        Element aeTypeDetail =
                (Element) XPath.selectSingleNode (aeTypesxml, "/AEAppTypes/AEAppType[Id = '" + aeType + "']");

        aeTypeDetail = (Element) aeTypeDetail.detach ();

        String aeDescriptionType = null;
        aeDescriptionType = XMLBuilder.getXPathValue (aeTypeDetail, "Name");

        XMLBuilder.add (eventElement, "AEType", aeDescriptionType);

        log.trace ("AeEventNavigationHelper.mAddExtraOracleReportData: Processed Oracle Call Parameters");
        return pWordProcessingElement;
    }

    /**
     * (non-Javadoc)
     * Returns event config data object.
     *
     * @param pSourceElement the source element
     * @return the i ae event config DO
     * @throws SystemException the system exception
     */
    private IAeEventConfigDO mGetAeEventConfigDO (final Element pSourceElement) throws SystemException
    {
        IAeEventConfigDO aeEventConfigDO = null;

        // Extract the Standard Event Id from XML Document.
        final String sStandardEventId = pSourceElement.getChildText ("StandardEventId");
        /* Element standardEventIdElement = (Element)(XPath.selectSingleNode(
         * pSourceElement, "/AEEvent/StandardEventId"));
         * String sStandardEventId = standardEventIdElement.getText(); */

        final int standardEventId = Integer.parseInt (sStandardEventId);

        // Retrieve the configuration data object associated with the standard Event id.
        final AeEventConfigManager aeEventConfigManager = AeEventConfigManager.getInstance ();
        aeEventConfigDO = aeEventConfigManager.getAeEventConfigDO (standardEventId);

        return aeEventConfigDO;
    } // mGetAeEventConfigDO()

    /**
     * (non-Javadoc)
     * Calls method in case service to get the case type.
     *
     * @param pInsertAeEventRowElement the insert ae event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCaseType (final Element pInsertAeEventRowElement)
        throws SystemException, BusinessException, JDOMException
    {
        Element caseElement = null;

        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the service.
        sValue = XMLBuilder.getXPathValue (pInsertAeEventRowElement, "/AEEvent/CaseNumber");
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        // Turn the XML into a string, and call the service.
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        caseElement = localServiceProxy.getJDOM (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_TYPE_METHOD, sXmlParams)
                .getRootElement ();

        return caseElement;
    } // mGetCaseType()

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
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            // Turn the XML into a string, and call the service.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            jurisdictionElement = localServiceProxy
                    .getJDOM (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_JURISDICTION, sXmlParams).getRootElement ();

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

            // Turn the XML into a string, and call the service.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            welshTranslationElement =
                    localServiceProxy.getJDOM (CASE_SERVICE, GET_CASE_WELSH_TRANSLATION, sXmlParams).getRootElement ();

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
     * Call a service to determine whether the AE employer has requested outputs translated to Welsh.
     *
     * @param pAeNumber The AE number to be checked
     * @return String indicator of whether the AE Employer wants Welsh translation.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetAeEmpWelshTranslation (final String pAeNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element welshTranslationElement = null;
        String welshTranslation = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "aeNumber", pAeNumber);

            // Turn the XML into a string, and call the service.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            welshTranslationElement =
                    localServiceProxy.getJDOM (AE_SERVICE, GET_AE_EMP_WELSH_TRANSLATION, sXmlParams).getRootElement ();

            if (null != welshTranslationElement)
            {
                welshTranslation = XMLBuilder.getXPathValue (welshTranslationElement, "/ds/Ae/WelshTranslation");
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
     * M insert wp output row.
     *
     * @param aeEventNavigationListElement the ae event navigation list element
     * @param userId the user id
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void mInsertWpOutputRow (final Element aeEventNavigationListElement, final String userId)
        throws JDOMException, SQLException, NamingException, SystemException, BusinessException
    {
        final Element NavigatetoWPElement = (Element) XPath.selectSingleNode (aeEventNavigationListElement,
                "/AeEventNavigationList/NavigateTo/WordProcessing");

        if (null != NavigatetoWPElement)
        {

            if (NavigatetoWPElement.getText ().equals ("true"))
            {

                final String eventPK =
                        XMLBuilder.getXPathValue (aeEventNavigationListElement, "/AeEventNavigationList/AEEventSeq");

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
                                ps.setObject (4, null);
                                ps.setObject (5, eventPK);
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

} // class AeEventNavigationHelper
