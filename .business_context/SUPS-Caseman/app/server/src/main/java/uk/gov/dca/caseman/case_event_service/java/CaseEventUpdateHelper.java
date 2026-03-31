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

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.ccbc_service.java.CCBCHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Class: CaseEventUpdateHelper.java
 * 
 * @author Phil Haferer
 *         Created: 25/02/2005
 *         Description: Helper class for case event updates
 * 
 *         v1.0 25/02/2005 Phil Haferer
 * 
 *         v1.1 22/12/2005 Chris Hutt
 *         new update rules introduced as part of CCBC take-on:
 *         1. SetJudgmentBarToNoWhenResult
 *         2. SetJudgmentBarToYesWhenNoResult
 *         v1.2 6/1/2006 Chris Hutt
 *         MCOLWriteOLSData update rules introduced as part of CCBC take-on
 * 
 *         v1.3 17/1/06 Chris Hutt
 *         Test for CreditorCode 1999 to establish that an MCOL case
 *
 *         v1.4 31/1/2006 Chris Hutt
 *         TMP_REP insert introduced as part of CCBC take-on:
 *         1.CCBCCreateVariationOrder
 *         2.CCBCCreateCertOfSatisfaction
 * 
 *         v1.5 06/9/2006 Mark Groen
 *         Defect 5136 - Should only set the bar for the selected Defendant - i.e. the one who the party is against.
 *         Previously calling mUpdateCasePartyRoleBarJudgementForAllDefendants(... - i.e. updating all defendants
 *
 *         v1.6 27/11/2006 Chris Hutt
 *         Defects UCT786,787,788.
 *         Events 74, 75 and 78 should set the bar on judgment for all defendants when
 *         a subject type of 'CASE' selected. Whilst fixing this I also noticed that event 76 was wrong
 * 
 *         v1.6a 30/11/2006 Force a zero content change to get over clearcase baseline issue
 * 
 *         v1.7 09/01/2007 Phil Haferer
 *         Modified PostInsertProcessing() to now check the extra configuration item
 *         "MCOLWriteOLSDataCheckCreditorCode" before calling mCCBCInserts().
 *         (TD Group2 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 
 *         v1.8 23/04/2007 Chris Hutt
 *         TD6165 - CCBCSetJudgmentBarForNewEvent added
 * 
 *         v1.9 23/04/2007
 *         TD6171 - CCBC case status update special rule where SubjectType = 'CDFE_T10'.
 *         In such circumstances the cased status should only be updated where event is recorded
 *         against the 'case'
 * 
 * 
 *         02/05/07 Chris Hutt : Defect UCT_Group2 1368 -
 *         1. Add facility to delete TMP_REP row. Will be invoked
 *         when a Certificate of Satisfaction Event is put into error as via PostDeleteFlagUpdateProcessing
 *         2. Only insert a TMP_REP row if Wordprocessing not being called.
 * 
 *         31/05/2007 Chris Hutt TD6171, UCTGroup2 1290 - CCBCSetCaseStatus added.
 * 
 *         v1.10 14/08/2007 Mark Groen UCTGroup2 1488 - Ensure that event 79 and CCBC working correctly. CCBC raise an
 *         event 79 for each judgment
 *         caseman raises an event 79 only on final payment - i.e. all judgments have been paid.
 * 
 *         v1.11 23/08/2007 Chris Hutt As part of CCBC testing it was found that the UCTGroup2 1488 fix caused a problem
 *         whenever
 *         PostInsertProcessing called on creation of events 73,74,75 and 76 - the case status was updated for CCBC
 *         cases
 *         even though not all parties with judgments against them had same event recorded against them
 * 
 *         v1.12 28/08/2007 Chris Hutt TD : Group2 5316:
 *         PostDeleteFlagUpdateProcessing updated to call CCBCHelper when event requires MCOL update. This is to
 *         support the MCOL_DATA entry being deleted.
 *
 *         v1.13 05/12/2012 Chris Vincent : Bulk Printing (Trac 4761)
 *         Added the method mDeleteReportMapRows which is invoked from PostDeleteFlagUpdateProcessing when the case
 *         event is
 *         marked in error.
 */

public class CaseEventUpdateHelper
{

    /** The Constant WP_OUTPUT_SERVICE. */
    private static final String WP_OUTPUT_SERVICE = "ejb/WpOutputServiceLocal";
    
    /** The Constant DELETE_REPORT_MAP_ROW_METHOD. */
    private static final String DELETE_REPORT_MAP_ROW_METHOD = "deleteReportMapRowLocal";

    /** The m context. */
    protected IComponentContext m_context = null;

    /**
     * Constructor.
     * 
     * @param context The component context.
     */
    public CaseEventUpdateHelper (final IComponentContext context)
    {
        m_context = context;
    }

    /**
     * Invokes a local service.
     * PJR
     *
     * @param pJndiName the jndi name
     * @param pMethodName the method name
     * @param pInputDoc the input doc
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected Document invokeLocalServiceProxy (final String pJndiName, final String pMethodName,
                                                final Document pInputDoc)
        throws BusinessException, SystemException
    {
        Document outputDoc = null;
        ComponentInput inputHolder = null;
        ComponentInput outputHolder = null;
        SupsLocalServiceProxy2 localServiceProxy = null;

        inputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());
        inputHolder.setData (pInputDoc, Document.class);
        outputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());

        localServiceProxy = new SupsLocalServiceProxy2 ();
        localServiceProxy.invoke (pJndiName, pMethodName + "2", this.m_context, inputHolder, outputHolder);

        outputDoc = (Document) outputHolder.getData (Document.class);

        return outputDoc;
    } // invokeLocalServiceProxy()

    /**
     * Post insert processing.
     *
     * @param pInsertCaseEventElement The case event element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void PostInsertProcessing (final Element pInsertCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        ICaseEventConfigDO caseEventConfigDO = null;
        String setJudgmentBarForNewEvent = null;
        String setCaseStatusNewEvent = null;
        String setJudgmentBarOnAllDefendantsForNewEvent = null;
        String result = null;
        String courtCode = null;
        String creditorCode = null;
        Element caseFlagElement = null;
        String caseFlag = null;
        boolean updateCaseStatus = false;
        Element navigateToWpElement = null;
        final String navigateToWp = null;
        String caseCourtCode = null;
        String ccbcSetCaseStatus = null;

        try
        {
            caseEventConfigDO = mGetCaseEventConfig (pInsertCaseEventElement);

            // Extract the court code (required for CCBC tests)
            courtCode = pInsertCaseEventElement.getChildText ("CourtCode");
            // Extract the case court code (required for CCBC tests) - defect group 2 1488
            caseCourtCode = pInsertCaseEventElement.getChildText ("CCBCCaseCourtCode");
            if (caseCourtCode == null)
            {
                caseCourtCode = courtCode; // Without this CCBC events may be updated as if non CCBC court
                                           // because 335 test will fail
            }
            // Perform the required update operations.
            if (caseEventConfigDO.isSetDateOfServiceForNewEvent ())
            {
                mSetCasePartyRoleDateOfService (pInsertCaseEventElement, /* String pDateOfService */"");
            }

            // Set the judgment bar?
            if (courtCode.equals ("335"))
            {
                // specific rule for CCBC
                setJudgmentBarForNewEvent = caseEventConfigDO.getCCBCSetJudgmentBarForNewEvent ();
            }
            else
            {
                // default rule
                setJudgmentBarForNewEvent = caseEventConfigDO.getSetJudgmentBarForNewEvent ();
            }
            if (null != setJudgmentBarForNewEvent && !setJudgmentBarForNewEvent.equals (""))
            {

                // if subject type of CASE selected then bar all defendants
                boolean updateAllDefendants = false;
                caseFlagElement = pInsertCaseEventElement.getChild ("CaseFlag");
                if (null != caseFlagElement)
                {
                    caseFlag = caseFlagElement.getText ();
                    if (caseFlag.equals ("Y"))
                    {
                        updateAllDefendants = true;
                    }
                }
                if (updateAllDefendants)
                {
                    mUpdateCasePartyRoleBarJudgementForAllDefendants (pInsertCaseEventElement,
                            /* pBarJudgment= */setJudgmentBarForNewEvent);
                }
                else
                {
                    mUpdateCasePartyRoleBarJudgement (pInsertCaseEventElement,
                            /* pBarJudgment= */setJudgmentBarForNewEvent);
                }
            }

            setJudgmentBarOnAllDefendantsForNewEvent = caseEventConfigDO.getSetJudgmentBarOnAllDefendantsForNewEvent ();
            if (null != setJudgmentBarOnAllDefendantsForNewEvent &&
                    !setJudgmentBarOnAllDefendantsForNewEvent.equals (""))
            {
                mUpdateCasePartyRoleBarJudgementForAllDefendants (pInsertCaseEventElement,
                        /* pBarJudgment= */setJudgmentBarOnAllDefendantsForNewEvent);
            }
            // CHANGES LOGIC 1488
            if (caseEventConfigDO.isSetCaseStatusNewEvent ())
            {
                // Here there will be a CCBC specific rule in circumstances where the subject type is
                // 'CDEF_T10' (case or defendant). Status update will be conditional upon the 'case' option
                // being taken (ie the event applies to all defendants on the case)
                updateCaseStatus = false;
                if (caseCourtCode.equals ("335") && caseEventConfigDO.getCCBCSubjectType ().equals ("CDEF_T10"))
                {

                    caseFlagElement = pInsertCaseEventElement.getChild ("CCBCSetCaseStatus");
                    if (null != caseFlagElement)
                    {
                        ccbcSetCaseStatus = caseFlagElement.getText ();
                        if (ccbcSetCaseStatus.equals ("Y"))
                        {
                            updateCaseStatus = true;
                        }
                    }
                }
                else
                {
                    updateCaseStatus = true;
                }

                if (updateCaseStatus)
                {
                    setCaseStatusNewEvent = mGetCaseStatusSettingForCaseEvent (pInsertCaseEventElement);
                    mUpdateCaseStatus (pInsertCaseEventElement, /* pStatus= */setCaseStatusNewEvent);
                }

            }

            if (caseEventConfigDO.isSetJudgmentBarToNoWhenResult ())
            {
                result = pInsertCaseEventElement.getChildText ("Result");
                if (result != null && !result.equals (""))
                {
                    // Defect 5136 - Should only set the bar for the selected Defendant - i.e. the one who the party is
                    // against
                    // Previously calling mUpdateCasePartyRoleBarJudgementForAllDefendants(...
                    mUpdateCasePartyRoleBarJudgement (pInsertCaseEventElement, /* pBarJudgment= */"N");
                }
            }

            if (caseEventConfigDO.isSetJudgmentBarToYesWhenNoResult ())
            {
                result = pInsertCaseEventElement.getChildText ("Result");
                if (result == null || result.equals (""))
                {
                    // Defect 5136 - Should only set the bar for the selected Defendant - i.e. the one who the party is
                    // against
                    // Previously calling mUpdateCasePartyRoleBarJudgementForAllDefendants(...
                    mUpdateCasePartyRoleBarJudgement (pInsertCaseEventElement, /* pBarJudgment= */"Y");

                }
            }

            // Remaining CCBC specifics
            if (courtCode.equals ("335"))
            {
                boolean bCCBCInsert = false;

                if (caseEventConfigDO.isCCBCCreateVariationOrder ())
                {
                    bCCBCInsert = true;
                }

                if (caseEventConfigDO.isCCBCCreateCertOfSatisfaction ())
                {
                    navigateToWpElement = pInsertCaseEventElement.getChild ("NavigateToWP");
                    if (navigateToWpElement == null || navigateToWpElement.getText ().equals ("false"))
                    {
                        bCCBCInsert = true;
                    }
                }

                if (caseEventConfigDO.isMCOLWriteOLSData ())
                {
                    if ( !caseEventConfigDO.isMCOLWriteOLSDataCheckCreditorCode ())
                    {
                        bCCBCInsert = true;
                    }
                    else
                    {
                        creditorCode = pInsertCaseEventElement.getChildText ("CreditorCode");
                        if (creditorCode.equals ("1999"))
                        {
                            bCCBCInsert = true;
                        }
                    }
                }

                if (bCCBCInsert)
                {
                    mCCBCInserts (pInsertCaseEventElement);
                }
            }

        }
        finally
        {
            caseEventConfigDO = null;
            creditorCode = null;
            courtCode = null;
            caseFlagElement = null;
            caseFlag = null;
        }
    } // PostInsertProcessing()

    /**
     * Post delete flag update processing.
     *
     * @param pUpdateCaseEventElement The update case event event element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void PostDeleteFlagUpdateProcessing (final Element pUpdateCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element caseEventElement = null;
        ICaseEventConfigDO caseEventConfigDO = null;
        String sDeletedFlag = null;
        String courtCode = null;

        try
        {
            // Retrieve the Case Event involved.
            caseEventElement = GetCaseEvent (pUpdateCaseEventElement);

            // Extract the court code (required for CCBC tests)
            courtCode = caseEventElement.getChildText ("CourtCode");

            caseEventConfigDO = mGetCaseEventConfig (caseEventElement);

            // Perform the required update operations.
            sDeletedFlag = XMLBuilder.getXPathValue (caseEventElement, "/CaseEvent/DeletedFlag");
            if (sDeletedFlag.equals ("Y"))
            {
                if (caseEventConfigDO.isSetJudgmentBarToNoForUpdateEventOnErrorYes ())
                {
                    mUpdateCasePartyRoleBarJudgement (caseEventElement, /* pBarJudgment= */"N");
                }

                if (caseEventConfigDO.isResetCaseStatusOnUpdateEventErrorYes ())
                {
                    mUpdateCaseStatus (caseEventElement, /* pStatus= */"");
                }

                if (caseEventConfigDO.isSetCaseStatusToLastValueOnUpdateEventErrorYes ())
                {
                    mSetCaseStatusToLastValue (caseEventElement);
                }

                if (caseEventConfigDO.isDeleteReportMapRowOnError ())
                {
                    // Delete any REPORT_MAP rows
                    mDeleteReportMapRows (caseEventElement);
                }

                // Remaining CCBC specifics
                if (courtCode.equals ("335"))
                {

                    if (caseEventConfigDO.isCCBCCreateCertOfSatisfaction () || caseEventConfigDO.isMCOLWriteOLSData ())
                    {
                        mCCBCUpdates (caseEventElement);
                    }
                }
            }
            else
            {
                if (caseEventConfigDO.isSetJudgmentBarToYesForUpdateEventOnErrorNo ())
                {
                    mUpdateCasePartyRoleBarJudgement (caseEventElement, /* pBarJudgment= */"Y");
                }
            }
        }
        finally
        {
            caseEventElement = null;
            caseEventConfigDO = null;
            sDeletedFlag = null;
            courtCode = null;
        }
    } // PostDeleteFlagUpdateProcessing()

    /**
     * (non-Javadoc)
     * Create a CCBCHelper and run post insert case event processing.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mCCBCInserts (final Element pCaseEventElement) throws SystemException, JDOMException, BusinessException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.postInsertCaseEventProcessing (pCaseEventElement);

    }

    /**
     * (non-Javadoc)
     * Create a CCBCHelper and run post update case event processing.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mCCBCUpdates (final Element pCaseEventElement) throws SystemException, JDOMException, BusinessException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.postUpdateCaseEventProcessing (pCaseEventElement);
    }

    /**
     * (non-Javadoc)
     * Get case event config details for a specific standard event ID.
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
            sStandardEventId = XMLBuilder.getXPathValue (pCaseEventElement, "/CaseEvent/StandardEventId");
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
     * mSetCaseStatusToLastValue says it all!.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mSetCaseStatusToLastValue (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        String lastCaseStatus = null;

        try
        {
            lastCaseStatus = mGetLastCaseStatus (pCaseEventElement);
            mUpdateCaseStatus (pCaseEventElement, lastCaseStatus);
        }
        finally
        {
            lastCaseStatus = null;
        }
    } // mSetCaseStatusToLastValue()

    /**
     * (non-Javadoc)
     * Call a service to get the last case status.
     *
     * @param pCaseEventElement the case event element
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetLastCaseStatus (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element getLastCaseStatusParamsElement = null;
        Element lastCaseStatusElement = null;
        String lastCaseStatus = null;

        try
        {
            getLastCaseStatusParamsElement = mBuildGetLastCaseStatusParams (pCaseEventElement);

            lastCaseStatusElement =
                    invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_LAST_CASE_STATUS_METHOD,
                            getLastCaseStatusParamsElement.getDocument ()).getRootElement ();

            if (null != lastCaseStatusElement)
            {
                lastCaseStatus = XMLBuilder.getXPathValue (lastCaseStatusElement, "/ds/Case/Status");
            }
        }
        finally
        {
            getLastCaseStatusParamsElement = null;
            lastCaseStatusElement = null;
        }

        return lastCaseStatus;
    } // mGetLastCaseStatus()

    /**
     * (non-Javadoc)
     * Build a params element for passing to a service to get the previous case status.
     *
     * @param pInputDocElement the input doc element
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildGetLastCaseStatusParams (final Element pInputDocElement) throws JDOMException
    {
        Element paramsElement = null;
        String sValue = null;

        sValue = XMLBuilder.getXPathValue (pInputDocElement, "/CaseEvent/CaseNumber");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);

        return paramsElement;
    } // mBuildGetLastCaseStatusParams()

    /**
     * (non-Javadoc)
     * Call a service to update the case party role bar judgement.
     *
     * @param pInputDocElement the input doc element
     * @param pBarJudgment the bar judgment
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCasePartyRoleBarJudgement (final Element pInputDocElement, final String pBarJudgment)
        throws SystemException, JDOMException, BusinessException
    {
        Element updateCasePartyRoleBarJudgementParamsElement = null;

        try
        {
            updateCasePartyRoleBarJudgementParamsElement =
                    mBuildUpdateCasePartyRoleBarJudgementParams (pInputDocElement, pBarJudgment);

            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.UPDATE_CASE_PARTY_ROLE_BAR_JUDGMENT_METHOD,
                    updateCasePartyRoleBarJudgementParamsElement.getDocument ());
        }
        finally
        {
            updateCasePartyRoleBarJudgementParamsElement = null;
        }
    } // mUpdateCasePartyRoleBarJudgement()

    /**
     * (non-Javadoc)
     * Build a params element for use when calling the update case party role bar judgement service.
     *
     * @param pInputDocElement the input doc element
     * @param pBarJudgment the bar judgment
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildUpdateCasePartyRoleBarJudgementParams (final Element pInputDocElement,
                                                                 final String pBarJudgment)
        throws JDOMException
    {
        /* <CasePartyRole>
         * <CaseNumber>PHA40207</CaseNumber>
         * <PartyRoleCode>DEFENDANT</PartyRoleCode>
         * <CasePartyNumber>1</CasePartyNumber>
         * <BarJudgment>Y</BarJudgment>
         * </CasePartyRole> */

        Element paramsElement = null;
        Element parentElement = null;
        Element childElement = null;
        Element sourceElement = null;
        String sSourceText = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        parentElement = paramsElement;

        childElement = new Element ("param");
        parentElement.addContent (childElement);
        parentElement = childElement;

        childElement = new Element ("CasePartyRole");
        parentElement.addContent (childElement);
        parentElement = childElement;

        childElement = new Element ("CaseNumber");
        parentElement.addContent (childElement);
        sourceElement = (Element) XPath.selectSingleNode (pInputDocElement, "/CaseEvent/CaseNumber");
        sSourceText = sourceElement.getText ();
        childElement.addContent (sSourceText);

        childElement = new Element ("PartyRoleCode");
        parentElement.addContent (childElement);
        sourceElement = (Element) XPath.selectSingleNode (pInputDocElement, "/CaseEvent/SubjectPartyRoleCode");
        sSourceText = sourceElement.getText ();
        childElement.addContent (sSourceText);

        childElement = new Element ("CasePartyNumber");
        parentElement.addContent (childElement);
        sourceElement = (Element) XPath.selectSingleNode (pInputDocElement, "/CaseEvent/SubjectCasePartyNumber");
        sSourceText = sourceElement.getText ();
        childElement.addContent (sSourceText);

        childElement = new Element ("BarJudgment");
        parentElement.addContent (childElement);
        childElement.addContent (pBarJudgment);

        return paramsElement;
    } // mBuildUpdateCasePartyRoleParams()

    /**
     * (non-Javadoc)
     * Call a service to update the case party role judgement for all defecndants.
     *
     * @param pInputDocElement the input doc element
     * @param pBarJudgment the bar judgment
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCasePartyRoleBarJudgementForAllDefendants (final Element pInputDocElement,
                                                                   final String pBarJudgment)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;

        paramsElement = mBuildUpdateCasePartyRoleBarJudgementForAllDefendantsParams (pInputDocElement, pBarJudgment);

        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                CaseEventDefs.UPDATE_CASE_PARTY_ROLE_BAR_JUDGMENT_FOR_ALL_DEFENDANTS_METHOD,
                paramsElement.getDocument ());
    } // mUpdateCasePartyRoleBarJudgementForAllDefendants()

    /**
     * (non-Javadoc)
     * Build a params element for use in calling a service to update the case party role judgment for all defendants.
     *
     * @param pInputDocElement the input doc element
     * @param pBarJudgment the bar judgment
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildUpdateCasePartyRoleBarJudgementForAllDefendantsParams (final Element pInputDocElement,
                                                                                 final String pBarJudgment)
        throws JDOMException
    {
        /* <params>
         * <param name='casePartyRole'>
         * <CasePartyRole>
         * <CaseNumber>PHO50228</CaseNumber>
         * <PartyRoleCode>DEFENDANT</PartyRoleCode>
         * <CasePartyNumber></CasePartyNumber>
         * <BarJudgment>Y</BarJudgment>
         * </CasePartyRole>
         * </param>
         * </params> */
        Element paramsElement = null;
        Element casePartyRoleElement = null;
        String sValue = null;

        try
        {
            casePartyRoleElement = new Element ("CasePartyRole");

            sValue = XMLBuilder.getXPathValue (pInputDocElement, "/CaseEvent/CaseNumber");
            XMLBuilder.add (casePartyRoleElement, "CaseNumber", sValue);
            XMLBuilder.add (casePartyRoleElement, "PartyRoleCode", "DEFENDANT");
            XMLBuilder.add (casePartyRoleElement, "BarJudgment", pBarJudgment);

            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "casePartyRole", casePartyRoleElement);
        }
        finally
        {
            casePartyRoleElement = null;
            sValue = null;
        }

        return paramsElement;
    } // mBuildUpdateCasePartyRoleBarJudgementForAllDefendantsParams()

    /**
     * (non-Javadoc)
     * Call a service to set the case party role date of service.
     *
     * @param pInputDocElement the input doc element
     * @param pDateOfService the date of service
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mSetCasePartyRoleDateOfService (final Element pInputDocElement, final String pDateOfService)
        throws SystemException, JDOMException, BusinessException
    {
        Element setCasePartyRoleDateOfServiceParamsElement = null;

        setCasePartyRoleDateOfServiceParamsElement =
                mBuildSetCasePartyRoleDateOfServiceParams (pInputDocElement, pDateOfService);

        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                CaseEventDefs.SET_CASE_PARTY_ROLE_DATE_OF_SERVICE_METHOD,
                setCasePartyRoleDateOfServiceParamsElement.getDocument ());
    } // mSetCasePartyRoleDateOfService()

    /**
     * (non-Javadoc)
     * Build the params element required by the service to set the case party role date of service.
     *
     * @param pInputDocElement the input doc element
     * @param pDateOfService the date of service
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildSetCasePartyRoleDateOfServiceParams (final Element pInputDocElement,
                                                               final String pDateOfService)
        throws JDOMException
    {
        /* <CasePartyRole>
         * <CaseNumber/>
         * <PartyRoleCode/>
         * <CasePartyNumber/>
         * <DeftDateOfService/>
         * </CasePartyRole> */

        Element paramsElement = null;
        Element casePartyRoleElement = null;
        String sValue = null;

        try
        {
            casePartyRoleElement = new Element ("CasePartyRole");

            sValue = XMLBuilder.getXPathValue (pInputDocElement, "/CaseEvent/CaseNumber");
            XMLBuilder.add (casePartyRoleElement, "CaseNumber", sValue);

            sValue = XMLBuilder.getXPathValue (pInputDocElement, "/CaseEvent/SubjectPartyRoleCode");
            XMLBuilder.add (casePartyRoleElement, "PartyRoleCode", sValue);

            sValue = XMLBuilder.getXPathValue (pInputDocElement, "/CaseEvent/SubjectCasePartyNumber");
            XMLBuilder.add (casePartyRoleElement, "CasePartyNumber", sValue);

            XMLBuilder.add (casePartyRoleElement, "DeftDateOfService", pDateOfService);

            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, casePartyRoleElement);
        }
        finally
        {
            casePartyRoleElement = null;
            sValue = null;
        }

        return paramsElement;
    } // mBuildSetCasePartyRoleDateOfServiceParams()

    /**
     * (non-Javadoc)
     * Call a service to update the case statue.
     *
     * @param pInputDocElement the input doc element
     * @param pStatus the status
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCaseStatus (final Element pInputDocElement, final String pStatus)
        throws SystemException, JDOMException, BusinessException
    {
        Element updateCaseStatusParamsElement = null;

        updateCaseStatusParamsElement = mBuildUpdateCaseStatusParams (pInputDocElement, pStatus);

        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.UPDATE_CASE_STATUS_METHOD,
                updateCaseStatusParamsElement.getDocument ());
    } // mUpdateCaseStatus()

    /**
     * (non-Javadoc)
     * Return the params element required by the update case status method.
     *
     * @param pInputDocElement the input doc element
     * @param pStatus the status
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildUpdateCaseStatusParams (final Element pInputDocElement, final String pStatus)
        throws JDOMException
    {
        /* <Case>
         * <CaseNumber>PHA40207</CaseNumber>
         * <Status>PHIL</Status>
         * </Case> */

        Element paramsElement = null;
        Element parentElement = null;
        Element childElement = null;
        Element sourceElement = null;
        String sSourceText = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        parentElement = paramsElement;

        childElement = new Element ("param");
        parentElement.addContent (childElement);
        parentElement = childElement;

        childElement = new Element ("Case");
        parentElement.addContent (childElement);
        parentElement = childElement;

        childElement = new Element ("CaseNumber");
        parentElement.addContent (childElement);
        sourceElement = (Element) XPath.selectSingleNode (pInputDocElement, "/CaseEvent/CaseNumber");
        sSourceText = sourceElement.getText ();
        childElement.addContent (sSourceText);

        childElement = new Element ("Status");
        parentElement.addContent (childElement);
        childElement.addContent (pStatus);

        return paramsElement;
    } // mBuildUpdateCaseStatusParams()

    /**
     * Returns case event element.
     *
     * @param pCaseEventElement The case event element parameters.
     * @return The case event element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public Element GetCaseEvent (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element getCaseEventElement = null;
        Element getCaseEventParamsElement = null;

        getCaseEventParamsElement = mBuildGetCaseEventParams (pCaseEventElement);

        getCaseEventElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                CaseEventDefs.GET_CASE_EVENT_METHOD, getCaseEventParamsElement.getDocument ()).getRootElement ();

        return getCaseEventElement;
    } // GetCaseEvent()

    /**
     * Deletes any REPORT_MAP (bulk printing) rows associated with the case event.
     *
     * @param pCaseEventElement The case event element parameters.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mDeleteReportMapRows (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element deleteReportMapParamsElement = null;

        // Calls getCaseEvent params builder method, but parameters are the same for the delete method
        deleteReportMapParamsElement = mBuildGetCaseEventParams (pCaseEventElement);

        invokeLocalServiceProxy (WP_OUTPUT_SERVICE, DELETE_REPORT_MAP_ROW_METHOD,
                deleteReportMapParamsElement.getDocument ()).getRootElement ();
    } // mDeleteReportMapRows()

    /**
     * (non-Javadoc)
     * Returns the params element required by the get case event method.
     *
     * @param pCaseEventElement the case event element
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildGetCaseEventParams (final Element pCaseEventElement) throws JDOMException
    {
        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the Determine Obligation Rule service.
        sValue = XMLBuilder.getXPathValue (pCaseEventElement, "/CaseEvent/CaseEventSeq");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseEventSeq", sValue);

        return paramsElement;
    } // mBuildUpdateCasePartyRoleParams()

    /**
     * Returns the case status setting for the case event.
     *
     * @param pCaseEventElement The case event element parameters.
     * @return Thecase status element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public String mGetCaseStatusSettingForCaseEvent (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        String setCaseStatusNewEvent = null;
        Element paramsElement = null;
        String sValue = null;
        Element caseStatusSettingCaseEventListElement = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            sValue = XMLBuilder.getXPathValue (pCaseEventElement, "/CaseEvent/StandardEventId");
            XMLBuilder.addParam (paramsElement, "standardEventId", sValue);

            caseStatusSettingCaseEventListElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                    CaseDefs.GET_CASE_STATUS_SETTING_FOR_CASE_EVENT_METHOD, paramsElement.getDocument ())
                            .getRootElement ();

            setCaseStatusNewEvent = XMLBuilder.getXPathValue (caseStatusSettingCaseEventListElement,
                    "/CaseEventSettingCaseStatusList/CaseEvent/CaseStatus");
        }
        finally
        {
            paramsElement = null;
            sValue = null;
            caseStatusSettingCaseEventListElement = null;
        }

        return setCaseStatusNewEvent;
    } // mGetCaseStatusSettingForCaseEvent()

} // class CaseEventUpdateHelper
