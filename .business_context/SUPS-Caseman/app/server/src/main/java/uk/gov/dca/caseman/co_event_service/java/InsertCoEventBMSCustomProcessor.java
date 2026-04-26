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
package uk.gov.dca.caseman.co_event_service.java;

import java.text.ParseException;
import java.util.Calendar;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;

import uk.gov.dca.caseman.bms_service.java.BMSHelper;
import uk.gov.dca.caseman.case_event_service.java.BMSRuleParamsXMLBuilder;
import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.user_court_service.java.UserCourtDefs;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 27 july 2005
 *
 * Change History:
 * 
 * v1.0 12/7/05 Chris Hurr
 * v1.1 14/11/05 Chris Hutt - issue stage needs to be passed to BMS engine. Defct 1677 (and others)
 * V1.2 20/12/05 Chris Hutt: add CreatingCourt and CreatingSection (BMS enhancement)
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author chris hutt
 */
public class InsertCoEventBMSCustomProcessor extends AbstractCasemanCustomProcessor
{
    /**
     * System date service name.
     */
    public static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    /**
     * BMS service name.
     */
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";

    /** The Constant DETERMINE_BMS_RULE_METHOD. */
    // Methods.
    private static final String DETERMINE_BMS_RULE_METHOD = "determineBmsRuleLocal";
    /**
     * Get system date method name.
     */
    public static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    
    /** The Constant CO_EVENT_XPATH. */
    // XPaths.
    private static final String CO_EVENT_XPATH = "/params/param/COEvent";

    /**
     * Constructor.
     */
    public InsertCoEventBMSCustomProcessor ()
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
        Element paramsElement = null;
        ICoEventConfigDO coEventConfigDO = null;

        String caseNumber = null;
        String standardEventId = null;
        String caseType = null;
        String eventTypeFlag = null;
        String bmsTaskNumber = null;
        String statsModule = null;
        String systemDate = null;
        String issueStage = null;
        String userCourt = "";
        String userSection = "";
        String userId = "";
        Element userDetailsElement = null;
        Element userCourtElement = null;

        try
        {
            paramsElement = pDocParams.getRootElement ();

            // Update the process date
            systemDate = mGetSystemDate ();
            XMLBuilder.setXPathValue (paramsElement, CO_EVENT_XPATH + "/ProcessDate", systemDate);

            coEventConfigDO = mGetCoEventConfig (paramsElement);
            if (coEventConfigDO.isBMSTaskRequired ())
            {
                // Construct the parameters required for retrieving
                // BMS Task Number and Stats Module values.
                caseNumber = "";
                caseType = "ALL";
                eventTypeFlag = "C";

                standardEventId = XMLBuilder.getXPathValue (paramsElement, CO_EVENT_XPATH + "/StandardEventId");

                // IssueStage
                issueStage = XMLBuilder.getXPathValue (paramsElement, CO_EVENT_XPATH + "/IssueStage");

                // User
                userId = XMLBuilder.getXPathValue (paramsElement, CO_EVENT_XPATH + "/UserName");

                // Retrieve the values themselves.
                bmsTaskNumber = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "B",
                        "BMSTaskDescription", eventTypeFlag, issueStage);
                statsModule = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "S",
                        "StatsModDescription", eventTypeFlag, issueStage);

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

                // Place the retrieved values into input XML document.
                XMLBuilder.setXPathValue (paramsElement, CO_EVENT_XPATH + "/BMSTask", bmsTaskNumber);
                XMLBuilder.setXPathValue (paramsElement, CO_EVENT_XPATH + "/StatsModule", statsModule);

                XMLBuilder.setXPathValue (paramsElement, CO_EVENT_XPATH + "/CreatingCourt", userCourt);
                XMLBuilder.setXPathValue (paramsElement, CO_EVENT_XPATH + "/CreatingSection", userSection);
            } // if (coEventConfigDO.isBMSTaskRequired())

            // Determine a value for the "Age Category" and add it to XML DOM.
            mDetermineTaskAge (paramsElement);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Determine the BMS task age.
     *
     * @param pParamsElement the params element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     * @throws JDOMException the JDOM exception
     */
    private void mDetermineTaskAge (final Element pParamsElement)
        throws SystemException, BusinessException, ParseException, JDOMException
    {
        String ageCategory = null;
        String sReceiptDate = null;
        Calendar receiptDate = null;
        String sProcessingDate = null;
        Calendar processingDate = null;

        sReceiptDate = XMLBuilder.getXPathValue (pParamsElement, CO_EVENT_XPATH + "/ReceiptDate");
        receiptDate = CalendarHelper.toCalendar (sReceiptDate);

        sProcessingDate = XMLBuilder.getXPathValue (pParamsElement, CO_EVENT_XPATH + "/ProcessDate");
        processingDate = CalendarHelper.toCalendar (sProcessingDate);

        ageCategory = BMSHelper.determineTaskAge (receiptDate, processingDate);

        XMLBuilder.setXPathValue (pParamsElement, CO_EVENT_XPATH + "/AgeCategory", ageCategory);

    } // mDetermineTaskAge()

    /**
     * (non-Javadoc)
     * Get co evnet config data for a standard event id.
     *
     * @param pCaseEventElement the case event element
     * @return the i co event config DO
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private ICoEventConfigDO mGetCoEventConfig (final Element pCaseEventElement) throws SystemException, JDOMException
    {
        ICoEventConfigDO coEventConfigDO = null;
        String sStandardEventId = null;
        CoEventConfigManager coEventConfigManager = null;

        try
        {
            // Extract the Standard Event Id from XML Document.
            sStandardEventId = XMLBuilder.getXPathValue (pCaseEventElement, CO_EVENT_XPATH + "/StandardEventId");
            final int standardEventId = Integer.parseInt (sStandardEventId);

            // Retrieve the configuration data object associated with the standard Event id.
            coEventConfigManager = CoEventConfigManager.getInstance ();
            coEventConfigDO = coEventConfigManager.getCoEventConfigDO (standardEventId);
        }
        finally
        {
            sStandardEventId = null;
            coEventConfigManager = null;
        }

        return coEventConfigDO;
    } // mGetCoEventConfig()

    /**
     * (non-Javadoc)
     * Get the BMS value.
     *
     * @param pParamsElement the params element
     * @param pCaseNumber the case number
     * @param pStandardEventId the standard event id
     * @param pCaseType the case type
     * @param pBMSValueType the BMS value type
     * @param pEventTypeXPath the event type X path
     * @param pEventTypeFlag the event type flag
     * @param pIssueStage the issue stage
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetBMSValue (final Element pParamsElement, final String pCaseNumber, final String pStandardEventId,
                                 final String pCaseType, final String pBMSValueType, final String pEventTypeXPath,
                                 final String pEventTypeFlag, final String pIssueStage)
        throws SystemException, BusinessException, JDOMException
    {

        Element bmsRuleParamsElement = null;
        Element bmsRuleElement = null;
        BMSRuleParamsXMLBuilder bmsRuleParams = null;

        String bmsValue = null;

        try
        {

            bmsRuleParams = new BMSRuleParamsXMLBuilder ();

            // Add the Mandatory parameters.
            bmsRuleParams.setCaseNumber (pCaseNumber);
            bmsRuleParams.setEventId (pStandardEventId);
            bmsRuleParams.setCaseType (pCaseType);
            bmsRuleParams.setTaskType (pBMSValueType);
            bmsRuleParams.setEventTypeFlag (pEventTypeFlag);
            bmsRuleParams.setIssue (pIssueStage);

            // Get the actual BMS Value.
            bmsRuleParamsElement = bmsRuleParams.getXMLElement ();
            bmsRuleElement = mDetermineBMSRule (bmsRuleParamsElement);
            bmsValue = XMLBuilder.getXPathValue (bmsRuleElement, "/BMS/Task");
        }
        finally
        {
            bmsRuleParams = null;
            bmsRuleParamsElement = null;
        }

        return bmsValue;
    } // mGetBMSValue()

    /**
     * (non-Javadoc)
     * Call a service to determine the BMS rule.
     *
     * @param pParamsElement the params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineBMSRule (final Element pParamsElement) throws SystemException, BusinessException
    {
        Element bmsElement = null;

        bmsElement =
                this.invokeLocalServiceProxy (BMS_SERVICE, DETERMINE_BMS_RULE_METHOD, pParamsElement.getDocument ())
                        .getRootElement ();

        return bmsElement;
    } // mDetermineBMSRule()

    /**
     * (non-Javadoc)
     * Call a service to get the database server date/time.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetSystemDate () throws SystemException, BusinessException
    {
        final Element getDateParamsElement = mGetSystemDateParams ();

        final Element getSystemDateElement =
                this.invokeLocalServiceProxy (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, getDateParamsElement.getDocument ())
                        .getRootElement ();

        final String systemDate = getSystemDateElement.getText ();

        return systemDate;
    } // mGetSystemDate()

    /**
     * (non-Javadoc)
     * Call a service to get user details.
     *
     * @param pUserId the user id
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetSectionDetail (final String pUserId) throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "userId", pUserId);

        final Element userCourtElement = this.invokeLocalServiceProxy (UserCourtDefs.USER_COURT_SERVICE,
                UserCourtDefs.GET_USER_DETAILS, paramsElement.getDocument ()).getRootElement ();

        return userCourtElement;
    } // mGetSectionDetail()

    /**
     * (non-Javadoc)
     * Create a params element to be used when retrieving the system date.
     *
     * @return the element
     */
    private Element mGetSystemDateParams ()
    {
        Element paramsElement = null;

        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "date", "");

        return paramsElement;
    } // mGetSystemDateParams()

} // class InsertCaseEventRow
