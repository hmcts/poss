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
package uk.gov.dca.caseman.reports_service.classes;

import java.text.ParseException;
import java.util.Calendar;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.ae_event_service.java.AeEventConfigManager;
import uk.gov.dca.caseman.ae_event_service.java.IAeEventConfigDO;
import uk.gov.dca.caseman.bms_service.java.BMSHelper;
import uk.gov.dca.caseman.case_event_service.java.BMSOptionalParameterDO;
import uk.gov.dca.caseman.case_event_service.java.BMSRuleParamsXMLBuilder;
import uk.gov.dca.caseman.co_event_service.java.CoEventConfigManager;
import uk.gov.dca.caseman.co_event_service.java.ICoEventConfigDO;
import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.user_court_service.java.UserCourtDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: ReportBMSHelper.java
 * 
 * @author Chris Hutt
 *         Created: 29 may 2006
 *         Description: Helper class for BMS work associated with events created via reports
 * 
 *         Change History:
 */
public class ReportBMSHelper
{

    /** The Constant SYSTEM_DATE_SERVICE. */
    // Service.
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant BMS_SERVICE. */
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";

    /** The Constant DETERMINE_BMS_PARAMS_METHOD. */
    // Methods.
    private static final String DETERMINE_BMS_PARAMS_METHOD = "determineBmsParamsLocal";
    
    /** The Constant DETERMINE_BMS_RULE_METHOD. */
    private static final String DETERMINE_BMS_RULE_METHOD = "determineBmsRuleLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public ReportBMSHelper ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * Returns a co event config data object.
     *
     * @param pStandardEventId The standard event id.
     * @return The config datab object.
     * @throws SystemException the system exception
     */
    public ICoEventConfigDO getCoEventConfig (final String pStandardEventId) throws SystemException
    {
        ICoEventConfigDO coEventConfigDO = null;
        CoEventConfigManager coEventConfigManager = null;

        try
        {

            final int standardEventId = Integer.parseInt (pStandardEventId);

            // Retrieve the configuration data object associated with the standard Event id.
            coEventConfigManager = CoEventConfigManager.getInstance ();
            coEventConfigDO = coEventConfigManager.getCoEventConfigDO (standardEventId);
        }
        finally
        {
            coEventConfigManager = null;
        }

        return coEventConfigDO;
    } // mGetCoEventConfig()

    /**
     * Returns an ae event config data object.
     *
     * @param pStandardEventId The standard event id.
     * @return The config data object.
     * @throws SystemException the system exception
     */
    public IAeEventConfigDO getAeEventConfig (final String pStandardEventId) throws SystemException
    {
        IAeEventConfigDO aeEventConfigDO = null;
        String sStandardEventId = null;
        AeEventConfigManager aeEventConfigManager = null;

        try
        {

            final int standardEventId = Integer.parseInt (sStandardEventId);

            // Retrieve the configuration data object associated with the standard Event id.
            aeEventConfigManager = AeEventConfigManager.getInstance ();
            aeEventConfigDO = aeEventConfigManager.getAeEventConfigDO (standardEventId);
        }
        finally
        {
            sStandardEventId = null;
            aeEventConfigManager = null;
        }

        return aeEventConfigDO;
    } // mGetAeEventConfig()

    /**
     * Returns the bms value.
     *
     * @param pCaseNumber The case number.
     * @param pStandardEventId The standard event id.
     * @param pCaseType The case type.
     * @param pBMSValueType The bms value type.
     * @param pEventTypeXPath The event type xpath.
     * @param pEventTypeFlag The event type flag.
     * @param pIssueStage The issue stage.
     * @return The bms value.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public String getBMSValue (final String pCaseNumber, final String pStandardEventId, final String pCaseType,
                               final String pBMSValueType, final String pEventTypeXPath, final String pEventTypeFlag,
                               final String pIssueStage)
        throws SystemException, BusinessException, JDOMException
    {

        Element bmsElement = null;
        Element bmsRuleParamsElement = null;
        Element bmsRuleElement = null;
        Element variationElement = null;

        BMSOptionalParameterDO optional = null;
        BMSRuleParamsXMLBuilder bmsRuleParams = null;

        String sValue = null;
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
            bmsElement = null;
            optional = null;
            sValue = null;
            bmsRuleParams = null;
            bmsRuleParamsElement = null;
            variationElement = null;
        }

        return bmsValue;
    } // mGetBMSValue()

    /**
     * (non-Javadoc)
     * Determines BMS rule.
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

        try
        {
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (pParamsElement);

            bmsElement =
                    localServiceProxy.getJDOM (BMS_SERVICE, DETERMINE_BMS_RULE_METHOD, sXmlParams).getRootElement ();
        }
        finally
        {
            xmlOutputter = null;
            sXmlParams = null;
        }

        return bmsElement;
    } // mDetermineBMSRule()

    /**
     * (non-Javadoc)
     * Currently unused.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetSystemDate () throws SystemException, BusinessException
    {
        Element getSystemDateElement = null;
        Element getDateParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String systemDate = null;

        try
        {
            getDateParamsElement = mGetSystemDateParams ();
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (getDateParamsElement);

            getSystemDateElement =
                    localServiceProxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, sXmlParams).getRootElement ();

            systemDate = getSystemDateElement.getText ();

        }
        finally
        {
            getSystemDateElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return systemDate;
    } // mGetSystemDate()

    /**
     * (non-Javadoc)
     * Currently called from unused function getSystemDate.
     *
     * @return the element
     */
    private Element mGetSystemDateParams ()
    {
        Element paramsElement = null;
        final String sValue = null;

        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "date", "");

        return paramsElement;
    } // mGetSystemDateParams()

    /**
     * Returns the section detail.
     *
     * @param pUserId The user id.
     * @return The section detail.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public Element getSectionDetail (final String pUserId) throws SystemException, BusinessException
    {
        Element userCourtElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "userId", pUserId);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            userCourtElement = localServiceProxy
                    .getJDOM (UserCourtDefs.USER_COURT_SERVICE, UserCourtDefs.GET_USER_DETAILS, sXmlParams)
                    .getRootElement ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return userCourtElement;
    } // mGetSectionDetail()

    /**
     * Determines the task age.
     *
     * @param pReceiptDate The receipt date.
     * @param pProcessingDate The processing date.
     * @return The task age.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     * @throws JDOMException the JDOM exception
     */
    public String determineTaskAge (final String pReceiptDate, final String pProcessingDate)
        throws SystemException, BusinessException, ParseException, JDOMException
    {
        String ageCategory = null;
        final String sReceiptDate = null;
        Calendar receiptDate = null;
        final String sProcessingDate = null;
        Calendar processingDate = null;

        receiptDate = CalendarHelper.toCalendar (pReceiptDate);

        processingDate = CalendarHelper.toCalendar (pProcessingDate);

        ageCategory = BMSHelper.determineTaskAge (receiptDate, processingDate);

        return ageCategory;

    } // mDetermineTaskAge()

}
