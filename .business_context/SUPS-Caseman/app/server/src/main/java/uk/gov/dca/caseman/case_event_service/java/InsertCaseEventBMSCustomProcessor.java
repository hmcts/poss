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

import java.text.ParseException;
import java.util.Calendar;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.bms_service.java.BMSHelper;
import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.user_court_service.java.UserCourtDefs;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 16-Feb-2005
 *
 * Change History:
 * 13/05/2005 Phil Haferer: Defect 790 - Maintain Judgment - App to Vary - wrong bms for applicant=claimant
 * Had been setting the ApplicantType to the type of event's subject, when it should have been the requester.
 *
 * 8/12/2005 Chris Hutt: defect 1916 - some events should not have BMS when run in auto mode
 * 20/12/05 Chris Hutt: add CreatingCourt and CreatingSection (BMS enhancement)
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 27/11/2006 Phil Haferer: Added code to skip looking up the User Court and Section if these have been
 * provided by the input XML document.
 * (UCT_CASEMAN 726: BMS on SUPS to SUPS transfer).
 * 03/04/2007 Chris Hutt: TD6159 - EventTypeFlag to facilitate BMS lookup for CCBC and MCOL
 * 14/05/2007 Chris Hutt: TD6159 - Testing of this defect established that if a CCBC case, then non-CCBC BMS should not
 * be used.
 * (confirmed by Kishan Madhar)
 */
public class InsertCaseEventBMSCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant BMS_SERVICE. */
    // Service.
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";
    
    /** The Constant DETERMINE_BMS_PARAMS_METHOD. */
    // Methods.
    private static final String DETERMINE_BMS_PARAMS_METHOD = "determineBmsParamsLocal";
    
    /** The Constant DETERMINE_BMS_RULE_METHOD. */
    private static final String DETERMINE_BMS_RULE_METHOD = "determineBmsRuleLocal";
    
    /** The Constant CCBC_COURT. */
    // CCBC
    private static final String CCBC_COURT = "335";
    
    /** The Constant MCOL_CREDITOR. */
    private static final String MCOL_CREDITOR = "1999";

    /** The Constant CASE_EVENT_XPATH. */
    // XPaths.
    private static final String CASE_EVENT_XPATH = "/params/param/CaseEvent";

    // Cached Parameter values (to avoid repeated retrieval when determining
    /** The cached case has coded party claimants. */
    // the two BMS values - BMS Task Number, and Stats Module).
    private String cachedCaseHasCodedPartyClaimants;
    
    /** The cached hearing type. */
    private String cachedHearingType;

    /**
     * Constructor.
     */
    public InsertCaseEventBMSCustomProcessor ()
    {
        super ();
    }

    /**
     * Modifies the input parameters.
     *
     * @param pDocParams The parameters document.
     * @param pLog The log object.
     * @return The processed parameters document.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException, BusinessException
    {
        Element paramsElement = pDocParams.getRootElement ();
        ICaseEventConfigDO caseEventConfigDO = null;
        String caseNumber = null;
        String source = null;
        String standardEventId = null;
        String caseType = null;
        String bmsTaskNumber = null;
        String statsModule = null;
        String userCourt = "";
        String userSection = "";
        String userId = "";
        Element caseEventElement = null;
        Element creatingCourtElement = null;
        Element creatingSelectionElement = null;
        Element userDetailsElement = null;
        Element userCourtElement = null;
        Element caseElement = null;
        String adminCourtCode = null;
        String creditorCode = null;
        String insolvencyNumber = null;
        String eventTypeFlag = null;
        String caseTypeCategory = null;

        boolean bmsTaskrequired = false;
        boolean ccbcBmsTaskrequired = false;
        boolean bmsLookup = false;

        try
        {
            paramsElement = pDocParams.getRootElement ();

            // Determine if a BMS task required.
            caseEventConfigDO = mGetCaseEventConfig (paramsElement);
            if (caseEventConfigDO.isBMSTaskRequired ())
            {
                bmsTaskrequired = true;

                // For some events this BMS only apply when entered manually
                source = XMLBuilder.getXPathValue (paramsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_SOURCE);

                if (source != null && source.equals ("AUTO"))
                {
                    if (caseEventConfigDO.isBMSTaskNotRequiredForAuto ())
                    {
                        bmsTaskrequired = false;
                    }
                }
            }
            if (caseEventConfigDO.isCCBCBMSTaskRequired ())
            {
                ccbcBmsTaskrequired = true;
            }

            // Case event 610 (Interim Return on Warrant) should not record BMS for certain
            // Interim returns
            final String sStandardEventId = XMLBuilder.getXPathValue (paramsElement,
                    CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_STANDARDEVENTID);
            if (sStandardEventId.equals ("610"))
            {
                final String warrantReturnId = XMLBuilder.getXPathValue (paramsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_WARRANTRETURNID);
                final String warrantReturnCode = mGetWarrantReturnCode (warrantReturnId);

                if (warrantReturnCode.equals ("LC") || warrantReturnCode.equals ("LD") ||
                        warrantReturnCode.equals ("AX") || warrantReturnCode.equals ("AY") ||
                        warrantReturnCode.equals ("FN") || warrantReturnCode.equals ("NP") ||
                        warrantReturnCode.equals ("NV"))
                {
                    bmsTaskrequired = false;
                    ccbcBmsTaskrequired = false;
                }
            }

            if (bmsTaskrequired || ccbcBmsTaskrequired)
            {

                // Extract the basic parameters required for retrieving
                // BMS Task Number and Stats Module values.
                caseNumber = XMLBuilder.getXPathValue (paramsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_CASENUMBER);
                standardEventId = XMLBuilder.getXPathValue (paramsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_STANDARDEVENTID);
                caseElement = mGetCaseForBMS (caseNumber);
                if (null != caseElement)
                {
                    caseType = XMLBuilder.getXPathValue (caseElement, "/Case/CaseType");
                    adminCourtCode = XMLBuilder.getXPathValue (caseElement, "/Case/OwningCourtCode");
                    creditorCode = XMLBuilder.getXPathValue (caseElement, "/Case/CreditorCode");
                    insolvencyNumber = XMLBuilder.getXPathValue (caseElement, "/Case/InsolvencyNumber");
                }

                // set up eventTypeFlag (only needed to look up CCBC and MCOL specific BMS)
                eventTypeFlag = "";
                if (adminCourtCode.equals (CCBC_COURT))
                {
                    bmsTaskrequired = false; // if a CCBC case, then non-CCBC BMS should not be used.
                    if (ccbcBmsTaskrequired)
                    {
                        if (creditorCode.equals (MCOL_CREDITOR))
                        {
                            eventTypeFlag = "MCOL_CASE";
                        }
                        else
                        {
                            eventTypeFlag = "CCBC_CASE";
                        }
                        bmsLookup = true;
                    }
                }
                else
                {
                    if (bmsTaskrequired)
                    {
                        bmsLookup = true;
                    }
                }

                // Seprate parameter for Insolvency Cases
                caseTypeCategory = "";
                if (insolvencyNumber != null && !insolvencyNumber.equals (""))
                {
                    caseTypeCategory = "INSOLVENCY";
                }

                // Now passed through all the CCBC / non-CCBC rules.
                if (bmsLookup)
                {
                    userId = XMLBuilder.getXPathValue (paramsElement,
                            CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_USERNAME);

                    // Retrieve the values themselves.
                    bmsTaskNumber = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "B",
                            CaseEventXMLBuilder.TAG_BMSTASKDESCRIPTION, eventTypeFlag, caseTypeCategory);
                    statsModule = mGetBMSValue (paramsElement, caseNumber, standardEventId, caseType, "S",
                            CaseEventXMLBuilder.TAG_STATSMODDESCRIPTION, eventTypeFlag, caseTypeCategory);

                    // Are Creating user court and section present in the input document?
                    caseEventElement = (Element) XPath.selectSingleNode (paramsElement, CASE_EVENT_XPATH);
                    creatingCourtElement = caseEventElement.getChild (CaseEventXMLBuilder.TAG_CREATINGCOURT);
                    if (null != creatingCourtElement)
                    {
                        userCourt = creatingCourtElement.getText ();
                    }
                    creatingSelectionElement = caseEventElement.getChild (CaseEventXMLBuilder.TAG_CREATINGSECTION);
                    if (null != creatingSelectionElement)
                    {
                        userSection = creatingSelectionElement.getText ();
                    }

                    // If not, retrieve the user court and section details for the given user id.
                    if (userCourt.equals ("") || userSection.equals (""))
                    {
                        userDetailsElement = mGetSectionDetail (userId);
                        if (null != userDetailsElement)
                        {
                            userCourtElement = userDetailsElement.getChild ("UserCourt");
                            if (null != userCourtElement)
                            {
                                if (userCourt.equals (""))
                                {
                                    userCourt = userCourtElement.getChildText ("CourtCode");
                                }
                                if (userSection.equals (""))
                                {
                                    userSection = userCourtElement.getChildText ("SectionName");
                                }
                            }
                        }
                    }

                    // Place the retrieved values into input XML document.
                    XMLBuilder.setXPathValue (paramsElement, CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_BMSTASK,
                            bmsTaskNumber);
                    XMLBuilder.setXPathValue (paramsElement,
                            CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_STATSMODULE, statsModule);
                    XMLBuilder.setXPathValue (paramsElement,
                            CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_CREATINGCOURT, userCourt);
                    XMLBuilder.setXPathValue (paramsElement,
                            CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_CREATINGSECTION, userSection);
                } // if (bmsLookup){
            } // if (caseEventConfigDO.isBMSTaskRequired())

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

        sReceiptDate =
                XMLBuilder.getXPathValue (pParamsElement, CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_RECEIPTDATE);
        receiptDate = CalendarHelper.toCalendar (sReceiptDate);

        sProcessingDate =
                XMLBuilder.getXPathValue (pParamsElement, CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_EVENTDATE);
        processingDate = CalendarHelper.toCalendar (sProcessingDate);

        ageCategory = BMSHelper.determineTaskAge (receiptDate, processingDate);

        XMLBuilder.setXPathValue (pParamsElement, CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_AGECATEGORY,
                ageCategory);

    } // mDetermineTaskAge()

    /**
     * (non-Javadoc)
     * Get a case event config data object.
     *
     * @param pCaseEventElement the case event element
     * @return the i case event config DO
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private ICaseEventConfigDO mGetCaseEventConfig (final Element pCaseEventElement)
        throws SystemException, JDOMException
    {
        ICaseEventConfigDO caseEventConfigDO = null;
        String sStandardEventId = null;
        CaseEventConfigManager caseEventConfigManager = null;

        try
        {
            // Extract the Standard Event Id from XML Document.
            sStandardEventId = XMLBuilder.getXPathValue (pCaseEventElement,
                    CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_STANDARDEVENTID);
            final int standardEventId = Integer.parseInt (sStandardEventId);

            // Retrieve the configuration data object associated with the standard Event id.
            caseEventConfigManager = CaseEventConfigManager.getInstance ();
            caseEventConfigDO = caseEventConfigManager.getCaseEventConfigDO (standardEventId);
        }
        finally
        {
            sStandardEventId = null;
            caseEventConfigManager = null;
        }

        return caseEventConfigDO;
    } // mGetCaseEventConfig()

    /**
     * (non-Javadoc)
     * Call a service to get the case type for the case number.
     *
     * @param pCaseNumber the case number
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCaseForBMS (final String pCaseNumber) throws SystemException, BusinessException, JDOMException
    {
        Element paramsElement = null;
        Element caseElement = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

        caseElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_FOR_BMS_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return caseElement;
    } // mGetCaseForBMS()

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
     * @param pCaseTypeCategory the case type category
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetBMSValue (final Element pParamsElement, final String pCaseNumber, final String pStandardEventId,
                                 final String pCaseType, final String pBMSValueType, final String pEventTypeXPath,
                                 final String pEventTypeFlag, final String pCaseTypeCategory)
        throws SystemException, BusinessException, JDOMException
    {
        String bmsValue = null;
        Element bmsElement = null;
        BMSOptionalParameterDO optional = null;
        BMSRuleParamsXMLBuilder bmsRuleParams = null;
        String sValue = null;
        Element bmsRuleParamsElement = null;
        Element bmsRuleElement = null;
        Element variationElement = null;

        try
        {
            // Retrieve which optional parameters are required.
            bmsElement = mDetermineBMSParams (pStandardEventId, pCaseType, pBMSValueType);
            optional = new BMSOptionalParameterDO (bmsElement);

            bmsRuleParams = new BMSRuleParamsXMLBuilder ();

            // Add the Mandatory parameters.
            bmsRuleParams.setCaseNumber (pCaseNumber);
            bmsRuleParams.setEventId (pStandardEventId);
            bmsRuleParams.setCaseType (pCaseType);
            bmsRuleParams.setTaskType (pBMSValueType);

            // Add eventFlag (if supplied)
            if ( !pEventTypeFlag.equals (""))
            {
                bmsRuleParams.setEventTypeFlag (pEventTypeFlag);
            }

            // Add Case Type Category (if supplied)
            if ( !pCaseTypeCategory.equals (""))
            {
                bmsRuleParams.setCaseTypeCategory (pCaseTypeCategory);
            }

            // Add the Optional parameters.
            if (optional.isApplicantTypeRequired ())
            {
                sValue = XMLBuilder.getXPathValue (pParamsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_APPLICANT);
                bmsRuleParams.setApplicantType (sValue);
            }
            if (optional.isHearingTypeRequired ())
            {
                if (null == cachedHearingType)
                {
                    cachedHearingType = mGetHearingType (pParamsElement);
                }
                bmsRuleParams.setHearingType (cachedHearingType);
            }

            // Retrieve a 'Variation' row if required.
            if (optional.isHearingFlagRequired () || optional.isApplicantResponseRequired ())
            {
                sValue = XMLBuilder.getXPathValue (pParamsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_VARYSEQ);
                variationElement = mGetVariation (sValue);
            }

            if (optional.isHearingFlagRequired ())
            {
                sValue = XMLBuilder.getXPathValue (variationElement, "/ds/Variation/HearingReqd");
                if (sValue.equals (""))
                {
                    sValue = "N";
                }
                else
                {
                    sValue = "Y";
                }
                bmsRuleParams.setHearingFlag (sValue);
            }
            if (optional.isIssueRequired ())
            {
                // &&& Not used in Release 2.
                bmsRuleParams.setIssue ("");
            }
            if (optional.isApplicantResponseRequired ())
            {
                sValue = XMLBuilder.getXPathValue (variationElement, "/ds/Variation/PlaintiffResponse");
                bmsRuleParams.setApplicantResponse (sValue);
            }
            if (optional.isAEEventIdRequired ())
            {
                // &&& Not used in Release 2.
                bmsRuleParams.setAEEventId ("");
            }
            if (optional.isEventTypeRequired ())
            {
                sValue = XMLBuilder.getXPathValue (pParamsElement, CASE_EVENT_XPATH + "/" + pEventTypeXPath);
                // Alternatively a selected value will be passed via the Details field.
                if (null == sValue || sValue.equals (""))
                {
                    sValue = XMLBuilder.getXPathValue (pParamsElement,
                            CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_EVENTDETAILS);
                }
                bmsRuleParams.setEventType (sValue);
            }
            if (optional.isListingTypeRequired ())
            {
                sValue = XMLBuilder.getXPathValue (pParamsElement,
                        CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_LISTINGTYPE);
                bmsRuleParams.setListingType (sValue);
            }
            if (optional.isCodedPartyRequired ())
            {
                if (null == cachedCaseHasCodedPartyClaimants)
                {
                    cachedCaseHasCodedPartyClaimants = mGetCaseHasCodedPartyClaimants (pCaseNumber);
                }
                bmsRuleParams.setCodedParty (cachedCaseHasCodedPartyClaimants);
            }

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
     * Call a service to get variation data for the variation sequence passed in.
     *
     * @param pVarySeq the vary seq
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetVariation (final String pVarySeq) throws SystemException, BusinessException
    {
        Element dsElement = null;
        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "varySeq", pVarySeq);

        dsElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.GET_VARIATION_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return dsElement;
    } // mGetVariation()

    /**
     * (non-Javadoc)
     * Call a service to retrieve the bms params for the event, case and task.
     *
     * @param pStandardEventId the standard event id
     * @param pCaseType the case type
     * @param pTaskType the task type
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineBMSParams (final String pStandardEventId, final String pCaseType, final String pTaskType)
        throws SystemException, BusinessException
    {
        Element bmsElement = null;
        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "eventID", pStandardEventId);
        XMLBuilder.addParam (paramsElement, "caseType", pCaseType);
        XMLBuilder.addParam (paramsElement, "taskType", pTaskType);

        bmsElement = invokeLocalServiceProxy (BMS_SERVICE, DETERMINE_BMS_PARAMS_METHOD, paramsElement.getDocument ())
                .getRootElement ();

        return bmsElement;
    } // mDetermineBMSParams()

    /**
     * (non-Javadoc)
     * Call a service to retrieve user details for the user id passed in.
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

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "userId", pUserId);

        userCourtElement = invokeLocalServiceProxy (UserCourtDefs.USER_COURT_SERVICE, UserCourtDefs.GET_USER_DETAILS,
                paramsElement.getDocument ()).getRootElement ();

        return userCourtElement;
    } // mDetermineBMSParams()

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

        bmsElement = invokeLocalServiceProxy (BMS_SERVICE, DETERMINE_BMS_RULE_METHOD, pParamsElement.getDocument ())
                .getRootElement ();

        return bmsElement;
    } // mDetermineBMSRule()

    /**
     * (non-Javadoc)
     * Call a service to determine if the case has coded parties.
     *
     * @param pCaseNumber the case number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetCaseHasCodedPartyClaimants (final String pCaseNumber)
        throws SystemException, BusinessException, JDOMException
    {
        String hasCodedPartyClaimants = null;
        Element paramsElement = null;
        Element caseHasCodedPartyClaimantsElement = null;

        try
        {
            // Build the XML parameter block to pass to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            caseHasCodedPartyClaimantsElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                    CaseDefs.GET_CASE_HAS_CODED_PARTY_CLAIMANTS_METHOD, paramsElement.getDocument ()).getRootElement ();

            hasCodedPartyClaimants =
                    XMLBuilder.getXPathValue (caseHasCodedPartyClaimantsElement, "/CaseHasCodedPartyClaimants");
        }
        finally
        {
            caseHasCodedPartyClaimantsElement = null;
        }

        return hasCodedPartyClaimants;
    } // mGetCaseHasCodedPartyClaimants()

    /**
     * (non-Javadoc)
     * Call a service to get the case hearing type.
     *
     * @param pParamsElement the params element
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetHearingType (final Element pParamsElement)
        throws SystemException, BusinessException, JDOMException
    {
        String hearingType = null;
        Element paramsElement = null;
        String sValue = null;
        Element hearingTypeElement = null;

        try
        {
            // Build the XML parameter block to pass to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            sValue = XMLBuilder.getXPathValue (pParamsElement, CASE_EVENT_XPATH + "/" + CaseEventXMLBuilder.TAG_HRGSEQ);
            XMLBuilder.addParam (paramsElement, "hrgSeq", sValue);

            hearingTypeElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.GET_HEARING_TYPE_METHOD, paramsElement.getDocument ()).getRootElement ();

            hearingType = XMLBuilder.getXPathValue (hearingTypeElement, "/HearingType");
        }
        finally
        {
            sValue = null;
            hearingTypeElement = null;
        }

        return hearingType;
    } // mGetHearingType()

    /**
     * (non-Javadoc)
     * Call a service to get the event warrant return code.
     *
     * @param pWarrantReturnId the warrant return id
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetWarrantReturnCode (final String pWarrantReturnId)
        throws SystemException, BusinessException, JDOMException
    {
        String returnCode = null;
        Element paramsElement = null;
        Element warrantReturnElement = null;

        try
        {
            // Build the XML parameter block to pass to the service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "warrantReturnId", pWarrantReturnId);

            warrantReturnElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.GET_EVENT_RETURN_CODE_METHOD, paramsElement.getDocument ()).getRootElement ();

            returnCode = XMLBuilder.getXPathValue (warrantReturnElement, "/ds/WarrantReturn/ReturnCode");
        }
        finally
        {
            warrantReturnElement = null;
        }

        return returnCode;
    } // mGetWarrantReturnCode()

} // class InsertCaseEventRow
