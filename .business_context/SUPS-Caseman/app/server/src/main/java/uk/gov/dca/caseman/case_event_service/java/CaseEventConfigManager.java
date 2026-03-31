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

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Class: CaseEventConfigManager.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 04-Mar-2005
 *         Description:
 *         This class reads the Case Event configuration XML Document, caches it in memory,
 *         and then returns a Data Object to clients that request the configuration for
 *         a particular Case Event.
 * 
 *         Change History:
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         19-May-2006 Phil Haferer (EDS): TD 3074: "ICaseEventConfigDO.java (701c) - why?"
 *         Removal of "set" methods from the interface.
 *         20-Nov-2006 Chris Hutt
 *         Defect UCT790: Part20PartiesRequired added
 * 
 *         4 jan 2006 Chris Hutt
 *         defect temp_caseman 313 : NoWordProcessingOutputByDefault added
 * 
 *         19 Mar 2007 Chris Hutt
 *         defect temp_caseman 310 : PreConditionCaseStatusNotStayed changed to PreConditionNotCaseStatusCheck
 * 
 *         09-Jan-2006 Phil Haferer (EDS) - Added processing for new item "MCOLWriteOLSDataCheckCreditorCode"
 *         to processCaseEventConfigDO().
 *         (TD Group2 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 
 *         04/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskRequired added to facilitate BMS lookup for CCBC and MCOL
 *         04/04/2007 Chris Hutt: TD6160 - CCBCSubjectType added
 *         13/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskSubjectSpecific added to facilitate BMS lookup for CCBC and MCOL
 *         23/04/2007 Chris Hutt: TD6165 - CCBCSetJudgmentBarForNewEvent added
 *         01/05/2007 Chris Hutt: TD1369 - CCBCSpecificEvent added (for events that only enterable in CCBC).
 *         24 Apr 2007 Chris Hutt
 *         defect 6058 - UpdateDeterminationJudgment added
 *         02/05/2007 Chris Hutt: isCCBCWpOutputImmediate added
 *         31/05/2007 Chris Hutt: TD6171, UCTGroup2 1290 - <CCBCSetCaseStatusIfCaseOr1Def> added
 *         07/12/2012 Chris Vincent: Trac 4761 (Bulk Printing) - added handler for new <DeleteReportMapRowsOnError> node
 *         28/01/2013 Chris Vincent: Trac 4763 (RFS 3719), added handler for setPreConditionTrackMustBeSet validation
 *         check.
 */
public class CaseEventConfigManager
{
    
    /** The construction system exception. */
    private SystemException constructionSystemException;
    
    /** The m case event config manager instance. */
    private static CaseEventConfigManager mCaseEventConfigManagerInstance = new CaseEventConfigManager ();
    
    /** The Constant CASE_EVENT_CONFIG_DOCUMENT. */
    private static final String CASE_EVENT_CONFIG_DOCUMENT =
            "uk/gov/dca/caseman/case_event_service/xml/CaseEventConfig.xml";
    
    /** The m case event config DO list. */
    private HashMap<Integer, CaseEventConfigDO> mCaseEventConfigDOList = null;

    /**
     * Constructor.
     *
     */
    protected CaseEventConfigManager ()
    {
        try
        {
            mInitialise ();
        }
        catch (final SystemException e)
        {
            constructionSystemException = e;
        }
    } // CaseEventConfigManager()

    /**
     * (non-Javadoc)
     * Throws any error raised in initialisation
     * PJR.
     *
     * @throws SystemException the system exception
     */
    private void throwAnyConstructionException () throws SystemException
    {
        if (constructionSystemException != null)
        {
            throw constructionSystemException;
        }
    } // throwAnyConstructionException()

    /**
     * Gets the single instance of CaseEventConfigManager.
     *
     * @return single instance of CaseEventConfigManager
     * @throws SystemException the system exception
     */
    public static CaseEventConfigManager getInstance () throws SystemException
    {
        mCaseEventConfigManagerInstance.throwAnyConstructionException ();
        return mCaseEventConfigManagerInstance;
    } // getInstance()

    /**
     * Returns case event config data object.
     *
     * @param pStandardEventId the standard event id
     * @return The config data object
     * @throws SystemException the system exception
     */
    public ICaseEventConfigDO getCaseEventConfigDO (final int pStandardEventId) throws SystemException
    {
        final ICaseEventConfigDO caseEventConfigDO =
                (ICaseEventConfigDO) mCaseEventConfigDOList.get (new Integer (pStandardEventId));
        if (null == caseEventConfigDO)
        {
            throw new SystemException (
                    "CaseEventConfig: StandardEventId = [" + Integer.toString (pStandardEventId) + "] not found!");
        }

        return caseEventConfigDO;
    } // getCaseEventConfigDO()

    /**
     * (non-Javadoc)
     * Initialise. Load case event config data.
     *
     * @throws SystemException the system exception
     */
    private void mInitialise () throws SystemException
    {
        SAXBuilder builder = null;
        Document document = null;

        try
        {
            mCaseEventConfigDOList = new HashMap<Integer, CaseEventConfigDO>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (CASE_EVENT_CONFIG_DOCUMENT, this));
            mProcessCaseEventConfigList (document.getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading Case Event Configuration Data. " + CASE_EVENT_CONFIG_DOCUMENT, e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading Case Event Configuration Data. " + CASE_EVENT_CONFIG_DOCUMENT, e);
        }

    } // mInitialise()

    /**
     * (non-Javadoc)
     * Iterates through config list processing each item.
     *
     * @param pCaseEventConfigListElement the case event config list element
     * @throws SystemException the system exception
     */
    private void mProcessCaseEventConfigList (final Element pCaseEventConfigListElement) throws SystemException
    {
        List<Element> elementList = null;
        Element caseEventConfigElement = null;
        String elementName = null;

        elementList = pCaseEventConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            caseEventConfigElement = (Element) i.next ();
            elementName = caseEventConfigElement.getName ();

            if (elementName.equals ("CaseEventConfig"))
            {
                processCaseEventConfigDO (caseEventConfigElement);
            }
        }

    } // mProcessCaseEventConfigElement()

    /**
     * (non-Javadoc)
     * Converts string to boolean. 'true' = true, otherwise false.
     *
     * @param pValue the value
     * @return true, if successful
     */
    private boolean mGetBoolean (final String pValue)
    {
        boolean bResult = false;

        if (null != pValue)
        {
            if (pValue.equalsIgnoreCase ("true"))
            {
                bResult = true;
            }
        }

        return bResult;
    } // mGetBoolean()

    /**
     * (non-Javadoc)
     * Set data in case event config DO based upon the case event config element passed in.
     *
     * @param pCaseEventConfigElement the case event config element
     * @throws SystemException the system exception
     */
    private void processCaseEventConfigDO (final Element pCaseEventConfigElement) throws SystemException
    {
        CaseEventConfigDO caseEventConfigDO = null;
        List<Element> elementList = null;
        Element currentElement = null;
        String elementName = null;
        String elementText = null;

        try
        {
            caseEventConfigDO = new CaseEventConfigDO ();
            elementList = pCaseEventConfigElement.getChildren ();

            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                currentElement = (Element) i.next ();
                elementName = currentElement.getName ();
                elementText = currentElement.getText ().trim ();
                // CCBCBMSTaskSubjectSpecific

                if (elementName.equals ("BMSTaskRequired"))
                {
                    caseEventConfigDO.setBMSTaskRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCBMSTaskRequired"))
                {
                    caseEventConfigDO.setCCBCBMSTaskRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCBMSTaskSubjectSpecific"))
                {
                    caseEventConfigDO.setCCBCBMSTaskSubjectSpecific (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsLOVDomain"))
                {
                    caseEventConfigDO.setDetailsLOVDomain (elementText);
                }
                else if (elementName.equals ("DisplayClaimDetails"))
                {
                    caseEventConfigDO.setDisplayClaimDetails (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsLOVMandatory"))
                {
                    caseEventConfigDO.setDetailsLOVMandatory (mGetBoolean (elementText));
                }
                else if (elementName.equals ("InstigatorType"))
                {
                    caseEventConfigDO.setInstigatorType (elementText);
                }
                else if (elementName.equals ("InstigatorMultiSelect"))
                {
                    caseEventConfigDO.setInstigatorMultiSelect (mGetBoolean (elementText));
                }
                else if (elementName.equals ("BMSTaskLOVDomain"))
                {
                    caseEventConfigDO.setBMSTaskLOVDomain (elementText);
                }
                else if (elementName.equals ("StatsModLOVDomain"))
                {
                    caseEventConfigDO.setStatsModLOVDomain (elementText);
                }
                else if (elementName.equals ("PreConditionActiveJudgment"))
                {
                    caseEventConfigDO.setPreConditionActiveJudgment (elementText);
                }
                else if (elementName.equals ("PreConditionBarOnJudgmentNotSet"))
                {
                    caseEventConfigDO.setPreConditionBarOnJudgmentNotSet (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionDateOfServiceCheck"))
                {
                    caseEventConfigDO.setPreConditionDateOfServiceCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionEventMustExist"))
                {
                    caseEventConfigDO.setPreConditionEventMustExist (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ResetCaseStatusOnUpdateEventErrorYes"))
                {
                    caseEventConfigDO.setResetCaseStatusOnUpdateEventErrorYes (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetCaseStatusNewEvent"))
                {
                    caseEventConfigDO.setSetCaseStatusNewEvent (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetCaseStatusToLastValueOnUpdateEventErrorYes"))
                {
                    caseEventConfigDO.setSetCaseStatusToLastValueOnUpdateEventErrorYes (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DeleteReportMapRowsOnError"))
                {
                    caseEventConfigDO.setDeleteReportMapRowOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetDateOfServiceForNewEvent"))
                {
                    caseEventConfigDO.setSetDateOfServiceForNewEvent (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetJudgmentBarForNewEvent"))
                {
                    caseEventConfigDO.setSetJudgmentBarForNewEvent (elementText);
                }
                else if (elementName.equals ("CCBCSetJudgmentBarForNewEvent"))
                {
                    caseEventConfigDO.setCCBCSetJudgmentBarForNewEvent (elementText);
                }
                else if (elementName.equals ("SetJudgmentBarOnAllDefendantsForNewEvent"))
                {
                    caseEventConfigDO.setSetJudgmentBarOnAllDefendantsForNewEvent (elementText);
                }
                else if (elementName.equals ("SetJudgmentBarToYesForUpdateEventOnErrorNo"))
                {
                    caseEventConfigDO.setSetJudgmentBarToYesForUpdateEventOnErrorNo (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetJudgmentBarToNoForUpdateEventOnErrorYes"))
                {
                    caseEventConfigDO.setSetJudgmentBarToNoForUpdateEventOnErrorYes (mGetBoolean (elementText));
                }
                else if (elementName.equals ("StandardEventId"))
                {
                    caseEventConfigDO.setStandardEventId (Integer.parseInt (elementText));
                }
                else if (elementName.equals ("SubjectType"))
                {
                    caseEventConfigDO.setSubjectType (elementText);
                }
                else if (elementName.equals ("CCBCSubjectType"))
                {
                    caseEventConfigDO.setCCBCSubjectType (elementText);
                }
                else if (elementName.equals ("WindowForTrialCall"))
                {
                    caseEventConfigDO.setWindowForTrialCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("WindowForTrialPrompt"))
                {
                    caseEventConfigDO.setWindowForTrialPrompt (elementText);
                }
                else if (elementName.equals ("WordProcessingCall"))
                {
                    caseEventConfigDO.setWordProcessingCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("OracleReportCall"))
                {
                    caseEventConfigDO.setOracleReportCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("HearingCall"))
                {
                    caseEventConfigDO.setHearingCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("JudgmentCall"))
                {
                    caseEventConfigDO.setJudgmentCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionJudgmentForRedeterminationMustExist"))
                {
                    caseEventConfigDO.setPreConditionJudgmentForRedeterminationMustExist (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionJudgmentSuitableForAdmissionOrDefence"))
                {
                    caseEventConfigDO.setPreConditionJudgmentSuitableForAdmissionOrDefence (mGetBoolean (elementText));
                }
                else if (elementName.equals ("MCOLWriteOLSData"))
                {
                    caseEventConfigDO.setMCOLWriteOLSData (mGetBoolean (elementText));
                }
                else if (elementName.equals ("MCOLWriteOLSDataCheckCreditorCode"))
                {
                    caseEventConfigDO.setMCOLWriteOLSDataCheckCreditorCode (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreconditionCaseStatusStayed"))
                {
                    caseEventConfigDO.setPreconditionCaseStatusStayed (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetJudgmentBarToNoWhenResult"))
                {
                    caseEventConfigDO.setSetJudgmentBarToNoWhenResult (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCTransferCaseCall"))
                {
                    caseEventConfigDO.setCCBCTransferCaseCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCCreateOrderLiftingStayIfStatusStayed"))
                {
                    caseEventConfigDO.setCCBCCreateOrderLiftingStayIfStatusStayed (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCPreConditionWarrantMustExistAgainstSubject"))
                {
                    caseEventConfigDO.setCCBCPreConditionWarrantMustExistAgainstSubject (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionNotCaseStatusCheck"))
                {
                    caseEventConfigDO.setPreConditionNotCaseStatusCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetFinalReturnCodeOnWarrants"))
                {
                    caseEventConfigDO.setSetFinalReturnCodeOnWarrants (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetJudgmentBarToYesWhenNoResult"))
                {
                    caseEventConfigDO.setSetJudgmentBarToYesWhenNoResult (mGetBoolean (elementText));
                }
                else if (elementName.equals ("BMSTaskNotRequiredForAuto"))
                {
                    caseEventConfigDO.setBMSTaskNotRequiredForAuto (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionEventMustNotExist"))
                {
                    caseEventConfigDO.setPreConditionEventMustNotExist (elementText);
                }
                else if (elementName.equals ("PreConditionPartyMustExist"))
                {
                    caseEventConfigDO.setPreConditionPartyMustExist (elementText);
                }
                else if (elementName.equals ("AeExistenceCheck"))
                {
                    caseEventConfigDO.setAeExistenceCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCCreateVariationOrder"))
                {
                    caseEventConfigDO.setCCBCCreateVariationOrder (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCCreateCertOfSatisfaction"))
                {
                    caseEventConfigDO.setCCBCCreateCertOfSatisfaction (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCObligationsExcluded"))
                {
                    caseEventConfigDO.setCCBCObligationsExcluded (mGetBoolean (elementText));
                }
                else if (elementName.equals ("InstigatorCanBeSubject"))
                {
                    caseEventConfigDO.setInstigatorCanBeSubject (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCWordProcessingCall"))
                {
                    caseEventConfigDO.setCCBCWordProcessingCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCInstigatorType"))
                {
                    caseEventConfigDO.setCCBCInstigatorType (elementText);
                }
                else if (elementName.equals ("Part20PartiesRequired"))
                {
                    caseEventConfigDO.setPart20PartiesRequired (elementText);
                }
                else if (elementName.equals ("NoWordProcessingOutputByDefault"))
                {
                    caseEventConfigDO.setNoWordProcessingOutputByDefault (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCSpecificEvent"))
                {
                    caseEventConfigDO.setCCBCSpecificEvent (mGetBoolean (elementText));
                }
                else if (elementName.equals ("UpdateDeterminationJudgment"))
                {
                    caseEventConfigDO.setUpdateDeterminationJudgment (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCWpOutputImmediate"))
                {
                    caseEventConfigDO.setCCBCWpOutputImmediate (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCSetCaseStatusIfCaseOr1Def"))
                {
                    caseEventConfigDO.setCCBCSetCaseStatusIfCaseOr1Def (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionTrackMustBeSet"))
                {
                    caseEventConfigDO.setPreConditionTrackMustBeSet (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionFamilyEnforcementOnly"))
                {
                    caseEventConfigDO.setPreConditionFamilyEnforcementOnly (mGetBoolean (elementText));
                }

            }
            mCaseEventConfigDOList.put (new Integer (caseEventConfigDO.getStandardEventId ()), caseEventConfigDO);
        }
        catch (final Exception e)
        {
            throw new SystemException (
                    "processCaseEventConfigDO(): Name = [" + elementName + "], Content = [" + elementText + "]", e);
        }
    } // processCaseEventConfigDO()

} // class CaseEventConfigManager