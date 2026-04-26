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

/**
 * Class: CaseEventConfigDO.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 15-Feb-2005
 *         Description:
 *         A Case Event Configuration Data Object.
 * @author nzwq68
 * 
 *         Change History
 *         30 nov 2006 Chris Hutt
 *         defect UCT790: Part20PartiesRequired added
 * 
 *         4 jan 2006 Chris Hutt
 *         defect temp_caseman 313 : NoWordProcessingOutputByDefault added
 *         09-Jan-2006 Phil Haferer (EDS) - Added MCOLWriteOLSDataCheckCreditorCode.
 *         A number of events had been using MCOLWriteOLSData in combination with a
 *         check on the Creditor Code to determine the path execution. However there is a
 *         requirement to only check the Creditor Code for some events, whilst doing the MCOL
 *         update unconditionally for others. This item specifies when the Creditor Code
 *         precondition check should be performed.
 *         (TD Group2 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 
 *         19 Mar 2007 Chris Hutt
 *         defect temp_caseman 310 : PreConditionCaseStatusNotStayed changed to PreConditionNotCaseStatusCheck
 * 
 *         04/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskRequired added to facilitate BMS lookup for CCBC and MCOL
 *         04/04/2007 Chris Hutt: TD6160 - CCBCSubjectType added
 *         13/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskSubjectSpecific added to facilitate BMS lookup for CCBC and MCOL
 *         23/04/2007 Chris Hutt: TD6165 - CCBCSetJudgmentBarForNewEvent added
 *         01/05/2007 Chris Hutt: TD1369 - CCBCSpecificEvent added (for events that only enterable in CCBC).
 *         24/04/2007 Chris Hutt: TD6058 - UpdateDeterminationJudgment added
 *         02/05/2007 Chris Hutt: CCBCWpOutputImmediate added
 *         31/05/2007 Chris Hutt: TD6171, UCTGroup2 1290 - <CCBCSetCaseStatusIfCaseOr1Def> added
 *         07/12/2012 Chris Vincent: Trac 4761 (Bulk Printing) - add DeleteReportMapRowOnError
 *         28/01/2013 Chris Vincent: Trac 4763 (RFS3719) - added isPreConditionTrackMustBeSet
 */
public class CaseEventConfigDO implements ICaseEventConfigDO
{

    /** The BMS task required. */
    private boolean BMSTaskRequired;
    
    /** The CCBCBMS task required. */
    private boolean CCBCBMSTaskRequired;
    
    /** The CCBCBMS task subject specific. */
    private boolean CCBCBMSTaskSubjectSpecific;
    
    /** The BMS task not required for auto. */
    private boolean BMSTaskNotRequiredForAuto;
    
    /** The Details LOV domain. */
    private String DetailsLOVDomain;
    
    /** The Details LOV mandatory. */
    private boolean DetailsLOVMandatory;
    
    /** The Display claim details. */
    private boolean DisplayClaimDetails;
    
    /** The Instigator type. */
    private String InstigatorType;
    
    /** The Instigator multi select. */
    private boolean InstigatorMultiSelect;
    
    /** The BMS task LOV domain. */
    private String BMSTaskLOVDomain;
    
    /** The Stats mod LOV domain. */
    private String StatsModLOVDomain;
    
    /** The Pre condition active judgment. */
    private String PreConditionActiveJudgment;
    
    /** The Pre condition bar on judgment not set. */
    private boolean PreConditionBarOnJudgmentNotSet;
    
    /** The Pre condition date of service check. */
    private boolean PreConditionDateOfServiceCheck;
    
    /** The Pre condition event must exist. */
    private boolean PreConditionEventMustExist;
    
    /** The Reset case status on update event error yes. */
    private boolean ResetCaseStatusOnUpdateEventErrorYes;
    
    /** The Set case status new event. */
    private boolean SetCaseStatusNewEvent;
    
    /** The Set case status to last value on update event error yes. */
    private boolean SetCaseStatusToLastValueOnUpdateEventErrorYes;
    
    /** The Set date of service for new event. */
    private boolean SetDateOfServiceForNewEvent;
    
    /** The Set judgment bar for new event. */
    private String SetJudgmentBarForNewEvent;
    
    /** The CCBC set judgment bar for new event. */
    private String CCBCSetJudgmentBarForNewEvent;
    
    /** The Set judgment bar on all defendants for new event. */
    private String SetJudgmentBarOnAllDefendantsForNewEvent;
    
    /** The Set judgment bar to yes for update event on error no. */
    private boolean SetJudgmentBarToYesForUpdateEventOnErrorNo;
    
    /** The Set judgment bar to no for update event on error yes. */
    private boolean SetJudgmentBarToNoForUpdateEventOnErrorYes;
    
    /** The Standard event id. */
    private int StandardEventId;
    
    /** The Subject type. */
    private String SubjectType;
    
    /** The CCBC subject type. */
    private String CCBCSubjectType;
    
    /** The Window for trial call. */
    private boolean WindowForTrialCall;
    
    /** The Window for trial prompt. */
    private String WindowForTrialPrompt;
    
    /** The Word processing call. */
    private boolean WordProcessingCall;
    
    /** The Oracle report call. */
    private boolean OracleReportCall;
    
    /** The Hearing call. */
    private boolean HearingCall;
    
    /** The Judgment call. */
    private boolean JudgmentCall;
    
    /** The Pre condition judgment for redetermination must exist. */
    private boolean PreConditionJudgmentForRedeterminationMustExist;
    
    /** The Pre condition judgment suitable for admission or defence. */
    private boolean PreConditionJudgmentSuitableForAdmissionOrDefence;
    
    /** The MCOL write OLS data. */
    private boolean MCOLWriteOLSData;
    
    /** The MCOL write OLS data check creditor code. */
    private boolean MCOLWriteOLSDataCheckCreditorCode;
    
    /** The Precondition case status stayed. */
    private boolean PreconditionCaseStatusStayed;
    
    /** The Set judgment bar to no when result. */
    private boolean SetJudgmentBarToNoWhenResult;
    
    /** The CCBC transfer case call. */
    private boolean CCBCTransferCaseCall;
    
    /** The CCBC create order lifting stay if status stayed. */
    private boolean CCBCCreateOrderLiftingStayIfStatusStayed;
    
    /** The CCBC pre condition warrant must exist against subject. */
    private boolean CCBCPreConditionWarrantMustExistAgainstSubject;
    
    /** The Pre condition not case status check. */
    private boolean PreConditionNotCaseStatusCheck;
    
    /** The Set final return code on warrants. */
    private boolean SetFinalReturnCodeOnWarrants;
    
    /** The Set judgment bar to yes when no result. */
    private boolean SetJudgmentBarToYesWhenNoResult;
    
    /** The Ae existence check. */
    private boolean AeExistenceCheck;
    
    /** The Pre condition event must not exist. */
    private String PreConditionEventMustNotExist;
    
    /** The Pre condition party must exist. */
    private String PreConditionPartyMustExist;
    
    /** The CCBC create variation order. */
    private boolean CCBCCreateVariationOrder;
    
    /** The CCBC create cert of satisfaction. */
    private boolean CCBCCreateCertOfSatisfaction;
    
    /** The CCBC obligations excluded. */
    private boolean CCBCObligationsExcluded;
    
    /** The Instigator can be subject. */
    private boolean InstigatorCanBeSubject;
    
    /** The CCBC word processing call. */
    private boolean CCBCWordProcessingCall;
    
    /** The CCBC instigator type. */
    private String CCBCInstigatorType;
    
    /** The Part 20 parties required. */
    private String Part20PartiesRequired;
    
    /** The No word processing output by default. */
    private boolean NoWordProcessingOutputByDefault;
    
    /** The CCBC specific event. */
    private boolean CCBCSpecificEvent;
    
    /** The Update determination judgment. */
    private boolean UpdateDeterminationJudgment;
    
    /** The CCBC wp output immediate. */
    private boolean CCBCWpOutputImmediate;
    
    /** The CCBC set case status if case or 1 def. */
    private boolean CCBCSetCaseStatusIfCaseOr1Def;
    
    /** The Delete report map row on error. */
    private boolean DeleteReportMapRowOnError;
    
    /** The Pre condition track must be set. */
    private boolean PreConditionTrackMustBeSet;
    
    /** The Pre condition family enforcement only. */
    private boolean PreConditionFamilyEnforcementOnly;

    /**
     * Constructor.
     */
    public CaseEventConfigDO ()
    {
    }

    /**
     * {@inheritDoc}
     */
    public boolean isBMSTaskRequired ()
    {
        return BMSTaskRequired;
    }

    /**
     * Sets the BMS task required.
     *
     * @param taskRequired the new BMS task required
     */
    public void setBMSTaskRequired (final boolean taskRequired)
    {
        BMSTaskRequired = taskRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isBMSTaskNotRequiredForAuto ()
    {
        return BMSTaskNotRequiredForAuto;
    }

    /**
     * Sets the BMS task not required for auto.
     *
     * @param taskNotRequiredForAuto the new BMS task not required for auto
     */
    public void setBMSTaskNotRequiredForAuto (final boolean taskNotRequiredForAuto)
    {
        BMSTaskNotRequiredForAuto = taskNotRequiredForAuto;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isDisplayClaimDetails ()
    {
        return DisplayClaimDetails;
    }

    /**
     * Sets the display claim details.
     *
     * @param displayClaimDetails the new display claim details
     */
    public void setDisplayClaimDetails (final boolean displayClaimDetails)
    {
        DisplayClaimDetails = displayClaimDetails;
    }

    /**
     * {@inheritDoc}
     */
    public String getDetailsLOVDomain ()
    {
        return DetailsLOVDomain;
    }

    /**
     * Sets the details LOV domain.
     *
     * @param detailsLOVDomain the new details LOV domain
     */
    public void setDetailsLOVDomain (final String detailsLOVDomain)
    {
        DetailsLOVDomain = detailsLOVDomain;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isDetailsLOVMandatory ()
    {
        return DetailsLOVMandatory;
    }

    /**
     * Sets the details LOV mandatory.
     *
     * @param detailsLOVMandatory the new details LOV mandatory
     */
    public void setDetailsLOVMandatory (final boolean detailsLOVMandatory)
    {
        DetailsLOVMandatory = detailsLOVMandatory;
    }

    /**
     * {@inheritDoc}
     */
    public String getInstigatorType ()
    {
        return InstigatorType;
    }

    /**
     * Sets the instigator type.
     *
     * @param instigatorType the new instigator type
     */
    public void setInstigatorType (final String instigatorType)
    {
        InstigatorType = instigatorType;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isInstigatorMultiSelect ()
    {
        return InstigatorMultiSelect;
    }

    /**
     * Sets the instigator multi select.
     *
     * @param instigatorMultiSelect the new instigator multi select
     */
    public void setInstigatorMultiSelect (final boolean instigatorMultiSelect)
    {
        InstigatorMultiSelect = instigatorMultiSelect;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionBarOnJudgmentNotSet ()
    {
        return PreConditionBarOnJudgmentNotSet;
    }

    /**
     * Sets the pre condition bar on judgment not set.
     *
     * @param preConditionBarOnJudgmentNotSet the new pre condition bar on judgment not set
     */
    public void setPreConditionBarOnJudgmentNotSet (final boolean preConditionBarOnJudgmentNotSet)
    {
        PreConditionBarOnJudgmentNotSet = preConditionBarOnJudgmentNotSet;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionDateOfServiceCheck ()
    {
        return PreConditionDateOfServiceCheck;
    }

    /**
     * Sets the pre condition date of service check.
     *
     * @param preConditionDateOfServiceCheck the new pre condition date of service check
     */
    public void setPreConditionDateOfServiceCheck (final boolean preConditionDateOfServiceCheck)
    {
        PreConditionDateOfServiceCheck = preConditionDateOfServiceCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean getPreConditionEventMustExist ()
    {
        return PreConditionEventMustExist;
    }

    /**
     * Sets the pre condition event must exist.
     *
     * @param preConditionEventMustExist the new pre condition event must exist
     */
    public void setPreConditionEventMustExist (final boolean preConditionEventMustExist)
    {
        PreConditionEventMustExist = preConditionEventMustExist;
    }

    /**
     * {@inheritDoc}
     */
    public String getPreConditionActiveJudgment ()
    {
        return PreConditionActiveJudgment;
    }

    /**
     * Sets the pre condition active judgment.
     *
     * @param preConditionActiveJudgment the new pre condition active judgment
     */
    public void setPreConditionActiveJudgment (final String preConditionActiveJudgment)
    {
        PreConditionActiveJudgment = preConditionActiveJudgment;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isResetCaseStatusOnUpdateEventErrorYes ()
    {
        return ResetCaseStatusOnUpdateEventErrorYes;
    }

    /**
     * Sets the reset case status on update event error yes.
     *
     * @param resetCaseStatusOnUpdateEventErrorYes the new reset case status on update event error yes
     */
    public void setResetCaseStatusOnUpdateEventErrorYes (final boolean resetCaseStatusOnUpdateEventErrorYes)
    {
        ResetCaseStatusOnUpdateEventErrorYes = resetCaseStatusOnUpdateEventErrorYes;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetCaseStatusNewEvent ()
    {
        return SetCaseStatusNewEvent;
    }

    /**
     * Sets the sets the case status new event.
     *
     * @param setCaseStatusNewEvent the new sets the case status new event
     */
    public void setSetCaseStatusNewEvent (final boolean setCaseStatusNewEvent)
    {
        SetCaseStatusNewEvent = setCaseStatusNewEvent;
    }

    /**
     * {@inheritDoc}
     */
    public String getSetJudgmentBarForNewEvent ()
    {
        return SetJudgmentBarForNewEvent;
    }

    /**
     * Sets the sets the judgment bar for new event.
     *
     * @param setJudgmentBarForNewEvent the new sets the judgment bar for new event
     */
    public void setSetJudgmentBarForNewEvent (final String setJudgmentBarForNewEvent)
    {
        SetJudgmentBarForNewEvent = setJudgmentBarForNewEvent;
    }

    /**
     * {@inheritDoc}
     */
    public String getSetJudgmentBarOnAllDefendantsForNewEvent ()
    {
        return SetJudgmentBarOnAllDefendantsForNewEvent;
    }

    /**
     * Sets the sets the judgment bar on all defendants for new event.
     *
     * @param setJudgmentBarOnAllDefendantsForNewEvent the new sets the judgment bar on all defendants for new event
     */
    public void setSetJudgmentBarOnAllDefendantsForNewEvent (final String setJudgmentBarOnAllDefendantsForNewEvent)
    {
        SetJudgmentBarOnAllDefendantsForNewEvent = setJudgmentBarOnAllDefendantsForNewEvent;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetJudgmentBarToNoForUpdateEventOnErrorYes ()
    {
        return SetJudgmentBarToNoForUpdateEventOnErrorYes;
    }

    /**
     * Sets the sets the judgment bar to no for update event on error yes.
     *
     * @param setJudgmentBarToNoForUpdateEventOnErrorYes the new sets the judgment bar to no for update event on error
     *            yes
     */
    public void setSetJudgmentBarToNoForUpdateEventOnErrorYes (final boolean setJudgmentBarToNoForUpdateEventOnErrorYes)
    {
        SetJudgmentBarToNoForUpdateEventOnErrorYes = setJudgmentBarToNoForUpdateEventOnErrorYes;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetJudgmentBarToYesForUpdateEventOnErrorNo ()
    {
        return SetJudgmentBarToYesForUpdateEventOnErrorNo;
    }

    /**
     * Sets the sets the judgment bar to yes for update event on error no.
     *
     * @param setJudgmentBarToYesForUpdateEventOnErrorNo the new sets the judgment bar to yes for update event on error
     *            no
     */
    public void setSetJudgmentBarToYesForUpdateEventOnErrorNo (final boolean setJudgmentBarToYesForUpdateEventOnErrorNo)
    {
        SetJudgmentBarToYesForUpdateEventOnErrorNo = setJudgmentBarToYesForUpdateEventOnErrorNo;
    }

    /**
     * {@inheritDoc}
     */
    public int getStandardEventId ()
    {
        return StandardEventId;
    }

    /**
     * Sets the standard event id.
     *
     * @param standardEventId the new standard event id
     */
    public void setStandardEventId (final int standardEventId)
    {
        StandardEventId = standardEventId;
    }

    /**
     * {@inheritDoc}
     */
    public String getSubjectType ()
    {
        return SubjectType;
    }

    /**
     * Sets the subject type.
     *
     * @param subjectType the new subject type
     */
    public void setSubjectType (final String subjectType)
    {
        SubjectType = subjectType;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isWindowForTrialCall ()
    {
        return WindowForTrialCall;
    }

    /**
     * Sets the window for trial call.
     *
     * @param windowForTrialCall the new window for trial call
     */
    public void setWindowForTrialCall (final boolean windowForTrialCall)
    {
        WindowForTrialCall = windowForTrialCall;
    }

    /**
     * {@inheritDoc}
     */
    public String getWindowForTrialPrompt ()
    {
        return WindowForTrialPrompt;
    }

    /**
     * Sets the window for trial prompt.
     *
     * @param windowForTrialPrompt the new window for trial prompt
     */
    public void setWindowForTrialPrompt (final String windowForTrialPrompt)
    {
        WindowForTrialPrompt = windowForTrialPrompt;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isWordProcessingCall ()
    {
        return WordProcessingCall;
    }

    /**
     * Sets the word processing call.
     *
     * @param wordProcessingCall the new word processing call
     */
    public void setWordProcessingCall (final boolean wordProcessingCall)
    {
        WordProcessingCall = wordProcessingCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isOracleReportCall ()
    {
        return OracleReportCall;
    }

    /**
     * Sets the oracle report call.
     *
     * @param oracleReportCall the new oracle report call
     */
    public void setOracleReportCall (final boolean oracleReportCall)
    {
        OracleReportCall = oracleReportCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isHearingCall ()
    {
        return HearingCall;
    }

    /**
     * Sets the hearing call.
     *
     * @param hearingCall the new hearing call
     */
    public void setHearingCall (final boolean hearingCall)
    {
        HearingCall = hearingCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetCaseStatusToLastValueOnUpdateEventErrorYes ()
    {
        return SetCaseStatusToLastValueOnUpdateEventErrorYes;
    }

    /**
     * Sets the sets the case status to last value on update event error yes.
     *
     * @param setCaseStatusToLastValueOnUpdateEventErrorYes the new sets the case status to last value on update event
     *            error yes
     */
    public void
            setSetCaseStatusToLastValueOnUpdateEventErrorYes (final boolean setCaseStatusToLastValueOnUpdateEventErrorYes)
    {
        SetCaseStatusToLastValueOnUpdateEventErrorYes = setCaseStatusToLastValueOnUpdateEventErrorYes;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetDateOfServiceForNewEvent ()
    {
        return SetDateOfServiceForNewEvent;
    }

    /**
     * Sets the sets the date of service for new event.
     *
     * @param setDateOfServiceForNewEvent the new sets the date of service for new event
     */
    public void setSetDateOfServiceForNewEvent (final boolean setDateOfServiceForNewEvent)
    {
        SetDateOfServiceForNewEvent = setDateOfServiceForNewEvent;
    }

    /**
     * {@inheritDoc}
     */
    public String getBMSTaskLOVDomain ()
    {
        return BMSTaskLOVDomain;
    }

    /**
     * Sets the BMS task LOV domain.
     *
     * @param bmsTaskLOVDomain the new BMS task LOV domain
     */
    public void setBMSTaskLOVDomain (final String bmsTaskLOVDomain)
    {
        BMSTaskLOVDomain = bmsTaskLOVDomain;
    }

    /**
     * {@inheritDoc}
     */
    public String getStatsModLOVDomain ()
    {
        return StatsModLOVDomain;
    }

    /**
     * Sets the stats mod LOV domain.
     *
     * @param statsModLOVDomain the new stats mod LOV domain
     */
    public void setStatsModLOVDomain (final String statsModLOVDomain)
    {
        StatsModLOVDomain = statsModLOVDomain;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isJudgmentCall ()
    {
        return JudgmentCall;
    }

    /**
     * Sets the judgment call.
     *
     * @param judgmentCall the new judgment call
     */
    public void setJudgmentCall (final boolean judgmentCall)
    {
        JudgmentCall = judgmentCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionJudgmentForRedeterminationMustExist ()
    {
        return PreConditionJudgmentForRedeterminationMustExist;
    }

    /**
     * Sets the pre condition judgment for redetermination must exist.
     *
     * @param preConditionJudgmentForRedeterminationMustExist the new pre condition judgment for redetermination must
     *            exist
     */
    public void
            setPreConditionJudgmentForRedeterminationMustExist (final boolean preConditionJudgmentForRedeterminationMustExist)
    {
        PreConditionJudgmentForRedeterminationMustExist = preConditionJudgmentForRedeterminationMustExist;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCCreateOrderLiftingStayIfStatusStayed ()
    {
        return CCBCCreateOrderLiftingStayIfStatusStayed;
    }

    /**
     * Sets the CCBC create order lifting stay if status stayed.
     *
     * @param createOrderLiftingStayIfStatusStayed the new CCBC create order lifting stay if status stayed
     */
    public void setCCBCCreateOrderLiftingStayIfStatusStayed (final boolean createOrderLiftingStayIfStatusStayed)
    {
        CCBCCreateOrderLiftingStayIfStatusStayed = createOrderLiftingStayIfStatusStayed;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCPreConditionWarrantMustExistAgainstSubject ()
    {
        return CCBCPreConditionWarrantMustExistAgainstSubject;
    }

    /**
     * Sets the CCBC pre condition warrant must exist against subject.
     *
     * @param preConditionWarrantMustExistAgainstSubject the new CCBC pre condition warrant must exist against subject
     */
    public void
            setCCBCPreConditionWarrantMustExistAgainstSubject (final boolean preConditionWarrantMustExistAgainstSubject)
    {
        CCBCPreConditionWarrantMustExistAgainstSubject = preConditionWarrantMustExistAgainstSubject;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCTransferCaseCall ()
    {
        return CCBCTransferCaseCall;
    }

    /**
     * Sets the CCBC transfer case call.
     *
     * @param transferCaseCall the new CCBC transfer case call
     */
    public void setCCBCTransferCaseCall (final boolean transferCaseCall)
    {
        CCBCTransferCaseCall = transferCaseCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isMCOLWriteOLSData ()
    {
        return MCOLWriteOLSData;
    }

    /**
     * Sets the MCOL write OLS data.
     *
     * @param writeOLSData the new MCOL write OLS data
     */
    public void setMCOLWriteOLSData (final boolean writeOLSData)
    {
        MCOLWriteOLSData = writeOLSData;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isMCOLWriteOLSDataCheckCreditorCode ()
    {
        return MCOLWriteOLSDataCheckCreditorCode;
    }

    /**
     * Sets the MCOL write OLS data check creditor code.
     *
     * @param writeOLSDataCheckCreditorCode the new MCOL write OLS data check creditor code
     */
    public void setMCOLWriteOLSDataCheckCreditorCode (final boolean writeOLSDataCheckCreditorCode)
    {
        MCOLWriteOLSDataCheckCreditorCode = writeOLSDataCheckCreditorCode;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionNotCaseStatusCheck ()
    {
        return PreConditionNotCaseStatusCheck;
    }

    /**
     * Sets the pre condition not case status check.
     *
     * @param preConditionNotCaseStatusCheck the new pre condition not case status check
     */
    public void setPreConditionNotCaseStatusCheck (final boolean preConditionNotCaseStatusCheck)
    {
        PreConditionNotCaseStatusCheck = preConditionNotCaseStatusCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreconditionCaseStatusStayed ()
    {
        return PreconditionCaseStatusStayed;
    }

    /**
     * Sets the precondition case status stayed.
     *
     * @param preconditionCaseStatusStayed the new precondition case status stayed
     */
    public void setPreconditionCaseStatusStayed (final boolean preconditionCaseStatusStayed)
    {
        PreconditionCaseStatusStayed = preconditionCaseStatusStayed;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionJudgmentSuitableForAdmissionOrDefence ()
    {
        return PreConditionJudgmentSuitableForAdmissionOrDefence;
    }

    /**
     * Sets the pre condition judgment suitable for admission or defence.
     *
     * @param preConditionJudgmentSuitableForAdmissionOrDefence the new pre condition judgment suitable for admission or
     *            defence
     */
    public void
            setPreConditionJudgmentSuitableForAdmissionOrDefence (final boolean preConditionJudgmentSuitableForAdmissionOrDefence)
    {
        PreConditionJudgmentSuitableForAdmissionOrDefence = preConditionJudgmentSuitableForAdmissionOrDefence;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetFinalReturnCodeOnWarrants ()
    {
        return SetFinalReturnCodeOnWarrants;
    }

    /**
     * Sets the sets the final return code on warrants.
     *
     * @param setFinalReturnCodeOnWarrants the new sets the final return code on warrants
     */
    public void setSetFinalReturnCodeOnWarrants (final boolean setFinalReturnCodeOnWarrants)
    {
        SetFinalReturnCodeOnWarrants = setFinalReturnCodeOnWarrants;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetJudgmentBarToNoWhenResult ()
    {
        return SetJudgmentBarToNoWhenResult;
    }

    /**
     * Sets the sets the judgment bar to no when result.
     *
     * @param setJudgmentBarToNoWhenResult the new sets the judgment bar to no when result
     */
    public void setSetJudgmentBarToNoWhenResult (final boolean setJudgmentBarToNoWhenResult)
    {
        SetJudgmentBarToNoWhenResult = setJudgmentBarToNoWhenResult;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetJudgmentBarToYesWhenNoResult ()
    {
        return SetJudgmentBarToYesWhenNoResult;
    }

    /**
     * Sets the sets the judgment bar to yes when no result.
     *
     * @param setJudgmentBarToYesWhenNoResult the new sets the judgment bar to yes when no result
     */
    public void setSetJudgmentBarToYesWhenNoResult (final boolean setJudgmentBarToYesWhenNoResult)
    {
        SetJudgmentBarToYesWhenNoResult = setJudgmentBarToYesWhenNoResult;
    }

    /**
     * {@inheritDoc}
     */
    public String getPreConditionEventMustNotExist ()
    {
        return PreConditionEventMustNotExist;
    }

    /**
     * Sets the pre condition event must not exist.
     *
     * @param preConditionEventMustNotExist the new pre condition event must not exist
     */
    public void setPreConditionEventMustNotExist (final String preConditionEventMustNotExist)
    {
        PreConditionEventMustNotExist = preConditionEventMustNotExist;
    }

    /**
     * {@inheritDoc}
     */
    public String getPreConditionPartyMustExist ()
    {
        return PreConditionPartyMustExist;
    }

    /**
     * Sets the pre condition party must exist.
     *
     * @param preConditionPartyMustExist the new pre condition party must exist
     */
    public void setPreConditionPartyMustExist (final String preConditionPartyMustExist)
    {
        PreConditionPartyMustExist = preConditionPartyMustExist;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isAeExistenceCheck ()
    {
        return AeExistenceCheck;
    }

    /**
     * Sets the ae existence check.
     *
     * @param aeExistenceCheck the new ae existence check
     */
    public void setAeExistenceCheck (final boolean aeExistenceCheck)
    {
        AeExistenceCheck = aeExistenceCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCCreateCertOfSatisfaction ()
    {
        return CCBCCreateCertOfSatisfaction;
    }

    /**
     * Sets the CCBC create cert of satisfaction.
     *
     * @param createCertOfSatisfaction the new CCBC create cert of satisfaction
     */
    public void setCCBCCreateCertOfSatisfaction (final boolean createCertOfSatisfaction)
    {
        CCBCCreateCertOfSatisfaction = createCertOfSatisfaction;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCCreateVariationOrder ()
    {
        return CCBCCreateVariationOrder;
    }

    /**
     * Sets the CCBC create variation order.
     *
     * @param createVariationOrder the new CCBC create variation order
     */
    public void setCCBCCreateVariationOrder (final boolean createVariationOrder)
    {
        CCBCCreateVariationOrder = createVariationOrder;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCObligationsExcluded ()
    {
        return CCBCObligationsExcluded;
    }

    /**
     * Sets the CCBC obligations excluded.
     *
     * @param obligationsExcluded the new CCBC obligations excluded
     */
    public void setCCBCObligationsExcluded (final boolean obligationsExcluded)
    {
        CCBCObligationsExcluded = obligationsExcluded;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isInstigatorCanBeSubject ()
    {
        return InstigatorCanBeSubject;
    }

    /**
     * Sets the instigator can be subject.
     *
     * @param instigatorCanBeSubject the new instigator can be subject
     */
    public void setInstigatorCanBeSubject (final boolean instigatorCanBeSubject)
    {
        InstigatorCanBeSubject = instigatorCanBeSubject;
    }

    /**
     * {@inheritDoc}
     */
    public String getCCBCInstigatorType ()
    {
        return CCBCInstigatorType;
    }

    /**
     * Sets the CCBC instigator type.
     *
     * @param instigatorType the new CCBC instigator type
     */
    public void setCCBCInstigatorType (final String instigatorType)
    {
        CCBCInstigatorType = instigatorType;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCWordProcessingCall ()
    {
        return CCBCWordProcessingCall;
    }

    /**
     * Sets the CCBC word processing call.
     *
     * @param wordProcessingCall the new CCBC word processing call
     */
    public void setCCBCWordProcessingCall (final boolean wordProcessingCall)
    {
        CCBCWordProcessingCall = wordProcessingCall;
    }

    /**
     * {@inheritDoc}
     */
    public String getPart20PartiesRequired ()
    {
        return Part20PartiesRequired;
    }

    /**
     * Sets the part 20 parties required.
     *
     * @param part20PartiesRequired the new part 20 parties required
     */
    public void setPart20PartiesRequired (final String part20PartiesRequired)
    {
        Part20PartiesRequired = part20PartiesRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isNoWordProcessingOutputByDefault ()
    {
        return NoWordProcessingOutputByDefault;
    }

    /**
     * Sets the no word processing output by default.
     *
     * @param noWordProcessingOutputByDefault the new no word processing output by default
     */
    public void setNoWordProcessingOutputByDefault (final boolean noWordProcessingOutputByDefault)
    {
        NoWordProcessingOutputByDefault = noWordProcessingOutputByDefault;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCBMSTaskRequired ()
    {
        return CCBCBMSTaskRequired;
    }

    /**
     * Sets the CCBCBMS task required.
     *
     * @param taskRequired the new CCBCBMS task required
     */
    public void setCCBCBMSTaskRequired (final boolean taskRequired)
    {
        CCBCBMSTaskRequired = taskRequired;
    }

    /**
     * {@inheritDoc}
     */
    public String getCCBCSubjectType ()
    {
        return CCBCSubjectType;
    }

    /**
     * Sets the CCBC subject type.
     *
     * @param subjectType the new CCBC subject type
     */
    public void setCCBCSubjectType (final String subjectType)
    {
        CCBCSubjectType = subjectType;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCBMSTaskSubjectSpecific ()
    {
        return CCBCBMSTaskSubjectSpecific;
    }

    /**
     * Sets the CCBCBMS task subject specific.
     *
     * @param taskSubjectSpecific the new CCBCBMS task subject specific
     */
    public void setCCBCBMSTaskSubjectSpecific (final boolean taskSubjectSpecific)
    {
        CCBCBMSTaskSubjectSpecific = taskSubjectSpecific;
    }

    /**
     * {@inheritDoc}
     */
    public String getCCBCSetJudgmentBarForNewEvent ()
    {
        return CCBCSetJudgmentBarForNewEvent;
    }

    /**
     * Sets the CCBC set judgment bar for new event.
     *
     * @param setJudgmentBarForNewEvent the new CCBC set judgment bar for new event
     */
    public void setCCBCSetJudgmentBarForNewEvent (final String setJudgmentBarForNewEvent)
    {
        CCBCSetJudgmentBarForNewEvent = setJudgmentBarForNewEvent;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCSpecificEvent ()
    {
        return CCBCSpecificEvent;
    }

    /**
     * Sets the CCBC specific event.
     *
     * @param specificEvent the new CCBC specific event
     */
    public void setCCBCSpecificEvent (final boolean specificEvent)
    {
        CCBCSpecificEvent = specificEvent;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isUpdateDeterminationJudgment ()
    {
        return UpdateDeterminationJudgment;
    }

    /**
     * Sets the update determination judgment.
     *
     * @param updateDeterminationJudgment the new update determination judgment
     */
    public void setUpdateDeterminationJudgment (final boolean updateDeterminationJudgment)
    {
        UpdateDeterminationJudgment = updateDeterminationJudgment;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCWpOutputImmediate ()
    {
        return CCBCWpOutputImmediate;
    }

    /**
     * Sets the CCBC wp output immediate.
     *
     * @param wpOutputImmediate the new CCBC wp output immediate
     */
    public void setCCBCWpOutputImmediate (final boolean wpOutputImmediate)
    {
        CCBCWpOutputImmediate = wpOutputImmediate;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCCBCSetCaseStatusIfCaseOr1Def ()
    {
        return CCBCSetCaseStatusIfCaseOr1Def;
    }

    /**
     * Sets the CCBC set case status if case or 1 def.
     *
     * @param setCaseStatusIfCaseOr1Def the new CCBC set case status if case or 1 def
     */
    public void setCCBCSetCaseStatusIfCaseOr1Def (final boolean setCaseStatusIfCaseOr1Def)
    {
        CCBCSetCaseStatusIfCaseOr1Def = setCaseStatusIfCaseOr1Def;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isDeleteReportMapRowOnError ()
    {
        return DeleteReportMapRowOnError;
    }

    /**
     * Sets the delete report map row on error.
     *
     * @param setDeleteReportMapRowOnError the new delete report map row on error
     */
    public void setDeleteReportMapRowOnError (final boolean setDeleteReportMapRowOnError)
    {
        DeleteReportMapRowOnError = setDeleteReportMapRowOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionTrackMustBeSet ()
    {
        return PreConditionTrackMustBeSet;
    }

    /**
     * Sets the pre condition track must be set.
     *
     * @param setPreConditionTrackMustBeSet the new pre condition track must be set
     */
    public void setPreConditionTrackMustBeSet (final boolean setPreConditionTrackMustBeSet)
    {
        PreConditionTrackMustBeSet = setPreConditionTrackMustBeSet;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionFamilyEnforcementOnly ()
    {
        return PreConditionFamilyEnforcementOnly;
    }

    /**
     * Sets the pre condition family enforcement only.
     *
     * @param setPreConditionFamilyEnforcementOnly the new pre condition family enforcement only
     */
    public void setPreConditionFamilyEnforcementOnly (final boolean setPreConditionFamilyEnforcementOnly)
    {
        PreConditionFamilyEnforcementOnly = setPreConditionFamilyEnforcementOnly;
    }

} // class CaseEventConfigDO
