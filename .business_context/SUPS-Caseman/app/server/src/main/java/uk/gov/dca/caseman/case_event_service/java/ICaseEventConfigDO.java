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
 * Created on 18-Apr-2006
 *
 * Change History:
 * 19-May-2006 Phil Haferer (EDS): TD 3074: "ICaseEventConfigDO.java (701c) - why?"
 * Removal of "set" methods from the interface.
 * 
 * 30 nov 2006 Chris Hutt
 * Defect UCT790 : Part20PartiesRequired added
 * 
 * 4 jan 2006 Chris Hutt
 * defect temp_caseman 313 : NoWordProcessingOutputByDefault added
 * 09-Jan-2006 Phil Haferer (EDS) - Added MCOLWriteOLSDataCheckCreditorCode.
 * (TD Group2 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 
 * 19 Mar 2007 Chris Hutt
 * defect temp_caseman 310 : PreConditionCaseStatusNotStayed changed to PreConditionNotCaseStatusCheck
 * 
 * 04/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskRequired added to facilitate BMS lookup for CCBC and MCOL
 * 04/04/2007 Chris Hutt: TD6160 - CCBCSubjectType added
 * 13/04/2007 Chris Hutt: TD6159 - CCBCBMSTaskSubjectSpecific added to facilitate BMS lookup for CCBC and MCOL
 * 23/04/2007 Chris Hutt: TD6165 - CCBCSetJudgmentBarForNewEvent added
 * 01/05/2007 Chris Hutt: TD1369 - CCBCSpecificEvent added (for events that only enterable in CCBC).
 * 24 Apr 2007 Chris Hutt
 * defect 6058 - UpdateDeterminationJudgment added
 * 02/05/2007 Chris Hutt: CCBCWpOutputImmediate added
 * 31/05/2007 Chris Hutt: TD6171, UCTGroup2 1290 - <CCBCSetCaseStatusIfCaseOr1Def> added
 * 07/12/2012 Chris Vincent: Trac 4761 (Bulk Printing) - added isDeleteReportMapRowOnError
 * 28/01/2013 Chris Vincent: Trac 4763 (RFS3719) - added isPreConditionTrackMustBeSet
 *
 * @author gzyysf
 */
public interface ICaseEventConfigDO
{
    
    /**
     * Checks if is BMS task required.
     *
     * @return true, if is BMS task required
     */
    public abstract boolean isBMSTaskRequired ();

    /**
     * Checks if is CCBCBMS task required.
     *
     * @return true, if is CCBCBMS task required
     */
    public abstract boolean isCCBCBMSTaskRequired ();

    /**
     * Checks if is CCBCBMS task subject specific.
     *
     * @return true, if is CCBCBMS task subject specific
     */
    public abstract boolean isCCBCBMSTaskSubjectSpecific ();

    /**
     * Checks if is BMS task not required for auto.
     *
     * @return true, if is BMS task not required for auto
     */
    public abstract boolean isBMSTaskNotRequiredForAuto ();

    /**
     * Checks if is display claim details.
     *
     * @return true, if is display claim details
     */
    public abstract boolean isDisplayClaimDetails ();

    /**
     * Gets the details LOV domain.
     *
     * @return the details LOV domain
     */
    public abstract String getDetailsLOVDomain ();

    /**
     * Checks if is details LOV mandatory.
     *
     * @return true, if is details LOV mandatory
     */
    public abstract boolean isDetailsLOVMandatory ();

    /**
     * Gets the instigator type.
     *
     * @return the instigator type
     */
    public abstract String getInstigatorType ();

    /**
     * Checks if is instigator multi select.
     *
     * @return true, if is instigator multi select
     */
    public abstract boolean isInstigatorMultiSelect ();

    /**
     * Checks if is pre condition bar on judgment not set.
     *
     * @return true, if is pre condition bar on judgment not set
     */
    public abstract boolean isPreConditionBarOnJudgmentNotSet ();

    /**
     * Checks if is pre condition date of service check.
     *
     * @return true, if is pre condition date of service check
     */
    public abstract boolean isPreConditionDateOfServiceCheck ();

    /**
     * Gets the pre condition event must exist.
     *
     * @return the pre condition event must exist
     */
    public abstract boolean getPreConditionEventMustExist ();

    /**
     * Gets the pre condition active judgment.
     *
     * @return the pre condition active judgment
     */
    public abstract String getPreConditionActiveJudgment ();

    /**
     * Checks if is reset case status on update event error yes.
     *
     * @return true, if is reset case status on update event error yes
     */
    public abstract boolean isResetCaseStatusOnUpdateEventErrorYes ();

    /**
     * Checks if is sets the case status new event.
     *
     * @return true, if is sets the case status new event
     */
    public abstract boolean isSetCaseStatusNewEvent ();

    /**
     * Gets the sets the judgment bar for new event.
     *
     * @return the sets the judgment bar for new event
     */
    public abstract String getSetJudgmentBarForNewEvent ();

    /**
     * Gets the CCBC set judgment bar for new event.
     *
     * @return the CCBC set judgment bar for new event
     */
    public abstract String getCCBCSetJudgmentBarForNewEvent ();

    /**
     * Gets the sets the judgment bar on all defendants for new event.
     *
     * @return the sets the judgment bar on all defendants for new event
     */
    public abstract String getSetJudgmentBarOnAllDefendantsForNewEvent ();

    /**
     * Checks if is sets the judgment bar to no for update event on error yes.
     *
     * @return true, if is sets the judgment bar to no for update event on error yes
     */
    public abstract boolean isSetJudgmentBarToNoForUpdateEventOnErrorYes ();

    /**
     * Checks if is sets the judgment bar to yes for update event on error no.
     *
     * @return true, if is sets the judgment bar to yes for update event on error no
     */
    public abstract boolean isSetJudgmentBarToYesForUpdateEventOnErrorNo ();

    /**
     * Gets the standard event id.
     *
     * @return the standard event id
     */
    public abstract int getStandardEventId ();

    /**
     * Gets the subject type.
     *
     * @return the subject type
     */
    public abstract String getSubjectType ();

    /**
     * Gets the CCBC subject type.
     *
     * @return the CCBC subject type
     */
    public abstract String getCCBCSubjectType ();

    /**
     * Checks if is window for trial call.
     *
     * @return true, if is window for trial call
     */
    public abstract boolean isWindowForTrialCall ();

    /**
     * Gets the window for trial prompt.
     *
     * @return the window for trial prompt
     */
    public abstract String getWindowForTrialPrompt ();

    /**
     * Checks if is word processing call.
     *
     * @return true, if is word processing call
     */
    public abstract boolean isWordProcessingCall ();

    /**
     * Checks if is oracle report call.
     *
     * @return true, if is oracle report call
     */
    public abstract boolean isOracleReportCall ();

    /**
     * Checks if is hearing call.
     *
     * @return true, if is hearing call
     */
    public abstract boolean isHearingCall ();

    /**
     * Checks if is sets the case status to last value on update event error yes.
     *
     * @return true, if is sets the case status to last value on update event error yes
     */
    public abstract boolean isSetCaseStatusToLastValueOnUpdateEventErrorYes ();

    /**
     * Checks if is sets the date of service for new event.
     *
     * @return true, if is sets the date of service for new event
     */
    public abstract boolean isSetDateOfServiceForNewEvent ();

    /**
     * Gets the BMS task LOV domain.
     *
     * @return the BMS task LOV domain
     */
    public abstract String getBMSTaskLOVDomain ();

    /**
     * Gets the stats mod LOV domain.
     *
     * @return the stats mod LOV domain
     */
    public abstract String getStatsModLOVDomain ();

    /**
     * Checks if is judgment call.
     *
     * @return true, if is judgment call
     */
    public abstract boolean isJudgmentCall ();

    /**
     * Checks if is pre condition judgment for redetermination must exist.
     *
     * @return true, if is pre condition judgment for redetermination must exist
     */
    public abstract boolean isPreConditionJudgmentForRedeterminationMustExist ();

    /**
     * Checks if is CCBC create order lifting stay if status stayed.
     *
     * @return true, if is CCBC create order lifting stay if status stayed
     */
    public abstract boolean isCCBCCreateOrderLiftingStayIfStatusStayed ();

    /**
     * Checks if is CCBC pre condition warrant must exist against subject.
     *
     * @return true, if is CCBC pre condition warrant must exist against subject
     */
    public abstract boolean isCCBCPreConditionWarrantMustExistAgainstSubject ();

    /**
     * Checks if is CCBC transfer case call.
     *
     * @return true, if is CCBC transfer case call
     */
    public abstract boolean isCCBCTransferCaseCall ();

    /**
     * Checks if is MCOL write OLS data.
     *
     * @return true, if is MCOL write OLS data
     */
    public abstract boolean isMCOLWriteOLSData ();

    /**
     * Checks if is MCOL write OLS data check creditor code.
     *
     * @return true, if is MCOL write OLS data check creditor code
     */
    public abstract boolean isMCOLWriteOLSDataCheckCreditorCode ();

    /**
     * Checks if is pre condition not case status check.
     *
     * @return true, if is pre condition not case status check
     */
    public abstract boolean isPreConditionNotCaseStatusCheck ();

    /**
     * Checks if is precondition case status stayed.
     *
     * @return true, if is precondition case status stayed
     */
    public abstract boolean isPreconditionCaseStatusStayed ();

    /**
     * Checks if is pre condition judgment suitable for admission or defence.
     *
     * @return true, if is pre condition judgment suitable for admission or defence
     */
    public abstract boolean isPreConditionJudgmentSuitableForAdmissionOrDefence ();

    /**
     * Checks if is sets the final return code on warrants.
     *
     * @return true, if is sets the final return code on warrants
     */
    public abstract boolean isSetFinalReturnCodeOnWarrants ();

    /**
     * Checks if is sets the judgment bar to no when result.
     *
     * @return true, if is sets the judgment bar to no when result
     */
    public abstract boolean isSetJudgmentBarToNoWhenResult ();

    /**
     * Checks if is sets the judgment bar to yes when no result.
     *
     * @return true, if is sets the judgment bar to yes when no result
     */
    public abstract boolean isSetJudgmentBarToYesWhenNoResult ();

    /**
     * Gets the pre condition event must not exist.
     *
     * @return the pre condition event must not exist
     */
    public abstract String getPreConditionEventMustNotExist ();

    /**
     * Gets the pre condition party must exist.
     *
     * @return the pre condition party must exist
     */
    public abstract String getPreConditionPartyMustExist ();

    /**
     * Checks if is ae existence check.
     *
     * @return true, if is ae existence check
     */
    public abstract boolean isAeExistenceCheck ();

    /**
     * Checks if is CCBC create cert of satisfaction.
     *
     * @return true, if is CCBC create cert of satisfaction
     */
    public abstract boolean isCCBCCreateCertOfSatisfaction ();

    /**
     * Checks if is CCBC create variation order.
     *
     * @return true, if is CCBC create variation order
     */
    public abstract boolean isCCBCCreateVariationOrder ();

    /**
     * Checks if is CCBC obligations excluded.
     *
     * @return true, if is CCBC obligations excluded
     */
    public abstract boolean isCCBCObligationsExcluded ();

    /**
     * Checks if is instigator can be subject.
     *
     * @return true, if is instigator can be subject
     */
    public abstract boolean isInstigatorCanBeSubject ();

    /**
     * Gets the CCBC instigator type.
     *
     * @return the CCBC instigator type
     */
    public abstract String getCCBCInstigatorType ();

    /**
     * Checks if is CCBC word processing call.
     *
     * @return true, if is CCBC word processing call
     */
    public abstract boolean isCCBCWordProcessingCall ();

    /**
     * Gets the part 20 parties required.
     *
     * @return the part 20 parties required
     */
    public abstract String getPart20PartiesRequired ();

    /**
     * Checks if is no word processing output by default.
     *
     * @return true, if is no word processing output by default
     */
    public abstract boolean isNoWordProcessingOutputByDefault ();

    /**
     * Checks if is CCBC specific event.
     *
     * @return true, if is CCBC specific event
     */
    public abstract boolean isCCBCSpecificEvent ();

    /**
     * Checks if is update determination judgment.
     *
     * @return true, if is update determination judgment
     */
    public abstract boolean isUpdateDeterminationJudgment ();

    /**
     * Checks if is CCBC wp output immediate.
     *
     * @return true, if is CCBC wp output immediate
     */
    public abstract boolean isCCBCWpOutputImmediate ();

    /**
     * Checks if is CCBC set case status if case or 1 def.
     *
     * @return true, if is CCBC set case status if case or 1 def
     */
    public abstract boolean isCCBCSetCaseStatusIfCaseOr1Def ();

    /**
     * Checks if is delete report map row on error.
     *
     * @return true, if is delete report map row on error
     */
    public abstract boolean isDeleteReportMapRowOnError ();

    /**
     * Checks if is pre condition track must be set.
     *
     * @return true, if is pre condition track must be set
     */
    public abstract boolean isPreConditionTrackMustBeSet ();

    /**
     * Checks if is pre condition family enforcement only.
     *
     * @return true, if is pre condition family enforcement only
     */
    public abstract boolean isPreConditionFamilyEnforcementOnly ();

}