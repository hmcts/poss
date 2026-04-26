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

import java.io.IOException;
import java.io.Writer;
import java.text.ParseException;
import java.util.Calendar;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.bms_service.java.BMSHelper;
import uk.gov.dca.caseman.case_event_service.java.BMSRuleParamsXMLBuilder;
import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.user_court_service.java.UserCourtDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 14 nov 2005
 * Lookup the BMStask/ StatsModuke associated with an AE event and add it to the AeEventXml.
 * This will be added to the associated CaseEvent XML
 * 
 * Change History:
 * 
 * 14/11/2005 Chris Hutt
 * 20/12/2005 Chris Hutt: add CreatingCourt and CreatingSection (BMS enhancement)
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 11/07/2006 Chris Hutt TD3870: no case event if ae is a mags order type, so no BMS info needed
 * 
 * @author chris hutt
 */
public class InsertAeEventBMSCustomProcessor implements ICustomProcessor
{
    /**
     * System date service name.
     */
    public static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant BMS_SERVICE. */
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";
    
    /** The Constant CASE_SERVICE. */
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant DETERMINE_BMS_RULE_METHOD. */
    private static final String DETERMINE_BMS_RULE_METHOD = "determineBmsRuleLocal";
    
    /** The Constant GET_CASE_JURISDICTION. */
    private static final String GET_CASE_JURISDICTION = "getCaseJurisdictionLocal";

    /**
     * Get system date method name.
     */
    public static final String GET_SYSTEM_DATE = "getSystemDateLocal";

    /** The Constant AE_EVENT_XPATH. */
    // XPaths.
    private static final String AE_EVENT_XPATH = "/params/param/AEEvent";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertAeEventBMSCustomProcessor ()
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
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;

        String caseNumber = null;
        String standardEventId = null;
        String caseType = null;
        String bmsTaskNumber = null;
        String statsModule = null;
        String sXml = null;
        String issueStage = null;
        String ageCategory = null;

        XPath aeEventPath = null;
        Element aeEventElement = null;

        String userCourt = "";
        String userSection = "";
        String userId = "";
        String jurisdiction = "";
        Element userDetailsElement = null;
        Element userCourtElement = null;

        try
        {
            aeEventPath = XPath.newInstance ("/params/param/AEEvent");

            paramsElement = pDocParams.getRootElement ();

            // No need to bother with BMS if it's a MAGS ORDER
            final String aeType = XMLBuilder.getXPathValue (paramsElement, AE_EVENT_XPATH + "/AEType");

            if (aeType != "MG")
            {

                // Construct the parameters required for retrieving
                // BMS Task Number and Stats Module values.
                caseType = "ALL";

                caseNumber = XMLBuilder.getXPathValue (paramsElement, AE_EVENT_XPATH + "/CaseNumber");

                // Check for Family Enforcement Cases
                jurisdiction = mGetCaseTypeForAE (caseNumber);
                if (jurisdiction.equals ("F"))
                {
                    caseType = "FE";
                }

                standardEventId = XMLBuilder.getXPathValue (paramsElement, AE_EVENT_XPATH + "/StandardEventId");

                issueStage = XMLBuilder.getXPathValue (paramsElement, AE_EVENT_XPATH + "/Stage");

                userId = XMLBuilder.getXPathValue (paramsElement, AE_EVENT_XPATH + "/UserName");

                // Retrieve the values themselves.
                bmsTaskNumber = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "B",
                        "BMSTaskDescription", issueStage);
                statsModule = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "S",
                        "StatsModDescription", issueStage);

                // add the retrieved values into input XML document.
                aeEventElement = (Element) aeEventPath.selectSingleNode (pDocParams.getRootElement ());
                XMLBuilder.add (aeEventElement, "BMSTask", bmsTaskNumber);
                XMLBuilder.add (aeEventElement, "StatsModule", statsModule);

                // Determine a value for the "Age Category" and add it to XML DOM.
                ageCategory = mDetermineTaskAge (paramsElement);

                XMLBuilder.add (aeEventElement, "AgeCategory", ageCategory);

                // Retrieve the user court and section details
                userDetailsElement = mGetSectionDetail (userId);
                if (null != userDetailsElement)
                {
                    userCourtElement = userDetailsElement.getChild ("UserCourt");
                    if (null != userCourtElement)
                    {
                        userCourt = userCourtElement.getChildText ("CourtCode");
                        userSection = userCourtElement.getChildText ("SectionName");
                    }
                }
                XMLBuilder.add (aeEventElement, "CreatingCourt", userCourt);

                XMLBuilder.add (aeEventElement, "CreatingSection", userSection);

            }

            // Output the resulting XML.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (paramsElement);
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
     * Determine age of BMS task.
     *
     * @param pParamsElement the params element
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     * @throws JDOMException the JDOM exception
     */
    private String mDetermineTaskAge (final Element pParamsElement)
        throws SystemException, BusinessException, ParseException, JDOMException
    {
        String ageCategory = null;
        String sReceiptDate = null;
        Calendar receiptDate = null;
        String sProcessingDate = null;
        Calendar processingDate = null;

        sReceiptDate = XMLBuilder.getXPathValue (pParamsElement, AE_EVENT_XPATH + "/ReceiptDate");
        receiptDate = CalendarHelper.toCalendar (sReceiptDate);

        sProcessingDate = XMLBuilder.getXPathValue (pParamsElement, AE_EVENT_XPATH + "/EventDate");
        processingDate = CalendarHelper.toCalendar (sProcessingDate);

        ageCategory = BMSHelper.determineTaskAge (receiptDate, processingDate);

        return ageCategory;

    } // mDetermineTaskAge()

    /**
     * (non-Javadoc)
     * Get BMS value!.
     *
     * @param pParamsElement the params element
     * @param pCaseNumber the case number
     * @param pStandardEventId the standard event id
     * @param pCaseType the case type
     * @param pBMSValueType the BMS value type
     * @param pEventTypeXPath the event type X path
     * @param pIssueStage the issue stage
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetBMSValue (final Element pParamsElement, final String pCaseNumber, final String pStandardEventId,
                                 final String pCaseType, final String pBMSValueType, final String pEventTypeXPath,
                                 final String pIssueStage)
        throws SystemException, BusinessException, JDOMException
    {

        Element bmsRuleParamsElement = null;
        Element bmsRuleElement = null;
        BMSRuleParamsXMLBuilder bmsRuleParams = null;

        String bmsValue = null;

        bmsRuleParams = new BMSRuleParamsXMLBuilder ();

        // Add the Mandatory parameters.
        bmsRuleParams.setCaseNumber (pCaseNumber);
        bmsRuleParams.setEventId (pStandardEventId);
        bmsRuleParams.setCaseType (pCaseType);
        bmsRuleParams.setTaskType (pBMSValueType);
        bmsRuleParams.setIssue (pIssueStage);

        // Get the actual BMS Value.
        bmsRuleParamsElement = bmsRuleParams.getXMLElement ();
        bmsRuleElement = mDetermineBMSRule (bmsRuleParamsElement);
        bmsValue = XMLBuilder.getXPathValue (bmsRuleElement, "/BMS/Task");

        return bmsValue;
    } // mGetBMSValue()

    /**
     * (non-Javadoc)
     * Call service to determine BMS rule.
     *
     * @param pParamsElement the params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineBMSRule (final Element pParamsElement) throws SystemException, BusinessException
    {
        Element bmsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (pParamsElement);

        bmsElement = localServiceProxy.getJDOM (BMS_SERVICE, DETERMINE_BMS_RULE_METHOD, sXmlParams).getRootElement ();

        return bmsElement;
    } // mDetermineBMSRule()

    /**
     * (non-Javadoc)
     * Call service to get user specific data.
     *
     * @param pUserId the user id
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetSectionDetail (final String pUserId) throws SystemException, BusinessException
    {
        Element userCourtElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "userId", pUserId);

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        userCourtElement =
                localServiceProxy.getJDOM (UserCourtDefs.USER_COURT_SERVICE, UserCourtDefs.GET_USER_DETAILS, sXmlParams)
                        .getRootElement ();

        return userCourtElement;
    } // mGetSectionDetail()

    /**
     * (non-Javadoc)
     * Call service to get case type specific data.
     *
     * @param pCaseNumber the case number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseTypeForAE (final String pCaseNumber) throws SystemException, BusinessException
    {
        Element resultElement = null;
        Element caseElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String caseType = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            resultElement =
                    localServiceProxy.getJDOM (CASE_SERVICE, GET_CASE_JURISDICTION, sXmlParams).getRootElement ();

            if (null != resultElement)
            {
                caseElement = resultElement.getChild ("Case");

                if (null != caseElement)
                {
                    caseType = caseElement.getChildText ("Jurisdiction");
                }
            }
        }
        catch (final Exception e)
        {
            caseType = "ALL";
        }

        return caseType;
    } // mGetCaseTypeForAE()

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
} // class InsertCaseEventRow
