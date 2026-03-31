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

/**
 * Created on 04-May-2006
 *
 * Change History:
 * 19-May-2006 Phil Haferer (EDS): TD 3074: "ICaseEventConfigDO.java (701c) - why?"
 * Removal of "set" methods from the interface.
 * 
 * 4 jan 2006 chris hutt
 * defect temp_caseman 392: PreConditionEventMustExistDependsOnCoType added
 * 
 * @author gzyysf
 */
public interface ICoEventConfigDO
{
    
    /**
     * Checks if is action on update event error.
     *
     * @return true, if is action on update event error
     */
    public abstract boolean isActionOnUpdateEventError ();

    /**
     * Checks if is BMS task required.
     *
     * @return true, if is BMS task required
     */
    public abstract boolean isBMSTaskRequired ();

    /**
     * Checks if is creates the hearing.
     *
     * @return true, if is creates the hearing
     */
    public abstract boolean isCreateHearing ();

    /**
     * Checks if is creditor field enabled.
     *
     * @return true, if is creditor field enabled
     */
    public abstract boolean isCreditorFieldEnabled ();

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
     * Checks if is employer details required.
     *
     * @return true, if is employer details required
     */
    public abstract boolean isEmployerDetailsRequired ();

    /**
     * Checks if is employers named person required.
     *
     * @return true, if is employers named person required
     */
    public abstract boolean isEmployersNamedPersonRequired ();

    /**
     * Checks if is issue stage.
     *
     * @return true, if is issue stage
     */
    public abstract boolean isIssueStage ();

    /**
     * Checks if is PER details required.
     *
     * @return true, if is PER details required
     */
    public abstract boolean isPERDetailsRequired ();

    /**
     * Checks if is pre condition debts must exist check.
     *
     * @return true, if is pre condition debts must exist check
     */
    public abstract boolean isPreConditionDebtsMustExistCheck ();

    /**
     * Checks if is pre condition discharged date set check.
     *
     * @return true, if is pre condition discharged date set check
     */
    public abstract boolean isPreConditionDischargedDateSetCheck ();

    /**
     * Checks if is pre condition dividends declared check.
     *
     * @return true, if is pre condition dividends declared check
     */
    public abstract boolean isPreConditionDividendsDeclaredCheck ();

    /**
     * Checks if is pre condition event must exist.
     *
     * @return true, if is pre condition event must exist
     */
    public abstract boolean isPreConditionEventMustExist ();

    /**
     * Checks if is pre condition hearing date check.
     *
     * @return true, if is pre condition hearing date check
     */
    public abstract boolean isPreConditionHearingDateCheck ();

    /**
     * Checks if is pre condition money in court check.
     *
     * @return true, if is pre condition money in court check
     */
    public abstract boolean isPreConditionMoneyInCourtCheck ();

    /**
     * Checks if is pre condition payment details exist check.
     *
     * @return true, if is pre condition payment details exist check
     */
    public abstract boolean isPreConditionPaymentDetailsExistCheck ();

    /**
     * Checks if is pre condition previous order response time check.
     *
     * @return true, if is pre condition previous order response time check
     */
    public abstract boolean isPreConditionPreviousOrderResponseTimeCheck ();

    /**
     * Checks if is pre condition previous order served check.
     *
     * @return true, if is pre condition previous order served check
     */
    public abstract boolean isPreConditionPreviousOrderServedCheck ();

    /**
     * Checks if is pre condition releasable money check.
     *
     * @return true, if is pre condition releasable money check
     */
    public abstract boolean isPreConditionReleasableMoneyCheck ();

    /**
     * Checks if is pre condition response filed check.
     *
     * @return true, if is pre condition response filed check
     */
    public abstract boolean isPreConditionResponseFiledCheck ();

    /**
     * Checks if is pre condition valid CO status check.
     *
     * @return true, if is pre condition valid CO status check
     */
    public abstract boolean isPreConditionValidCOStatusCheck ();

    /**
     * Checks if is pre condition valid debt status check.
     *
     * @return true, if is pre condition valid debt status check
     */
    public abstract boolean isPreConditionValidDebtStatusCheck ();

    /**
     * Gets the pre condition warrant exists check.
     *
     * @return the pre condition warrant exists check
     */
    public abstract String getPreConditionWarrantExistsCheck ();

    /**
     * Checks if is service not served action.
     *
     * @return true, if is service not served action
     */
    public abstract boolean isServiceNotServedAction ();

    /**
     * Gets the service type.
     *
     * @return the service type
     */
    public abstract String getServiceType ();

    /**
     * Checks if is sets the AON 60 date on commit.
     *
     * @return true, if is sets the AON 60 date on commit
     */
    public abstract boolean isSetAON60DateOnCommit ();

    /**
     * Checks if is sets the attachment arrears date on commit.
     *
     * @return true, if is sets the attachment arrears date on commit
     */
    public abstract boolean isSetAttachmentArrearsDateOnCommit ();

    /**
     * Checks if is sets the attachment lapsed date on commit.
     *
     * @return true, if is sets the attachment lapsed date on commit
     */
    public abstract boolean isSetAttachmentLapsedDateOnCommit ();

    /**
     * Checks if is sets the order date on commit.
     *
     * @return true, if is sets the order date on commit
     */
    public abstract boolean isSetOrderDateOnCommit ();

    /**
     * Checks if is sets the revoked discharged date on commit.
     *
     * @return true, if is sets the revoked discharged date on commit
     */
    public abstract boolean isSetRevokedDischargedDateOnCommit ();

    /**
     * Gets the standard event id.
     *
     * @return the standard event id
     */
    public abstract int getStandardEventId ();

    /**
     * Checks if is warrant created.
     *
     * @return true, if is warrant created
     */
    public abstract boolean isWarrantCreated ();

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
     * Checks if is re set status to live.
     *
     * @return true, if is re set status to live
     */
    public abstract boolean isReSetStatusToLive ();

    /**
     * Checks if is sets the AON 60 date on error.
     *
     * @return true, if is sets the AON 60 date on error
     */
    public abstract boolean isSetAON60DateOnError ();

    /**
     * Checks if is sets the AON 60 date to null on commit.
     *
     * @return true, if is sets the AON 60 date to null on commit
     */
    public abstract boolean isSetAON60DateToNullOnCommit ();

    /**
     * Checks if is sets the AON 60 date to null on error.
     *
     * @return true, if is sets the AON 60 date to null on error
     */
    public abstract boolean isSetAON60DateToNullOnError ();

    /**
     * Checks if is sets the attachment arrears date on error.
     *
     * @return true, if is sets the attachment arrears date on error
     */
    public abstract boolean isSetAttachmentArrearsDateOnError ();

    /**
     * Checks if is sets the attachment lapsed date on error.
     *
     * @return true, if is sets the attachment lapsed date on error
     */
    public abstract boolean isSetAttachmentLapsedDateOnError ();

    /**
     * Checks if is sets the attachment lapsed date to null on commit.
     *
     * @return true, if is sets the attachment lapsed date to null on commit
     */
    public abstract boolean isSetAttachmentLapsedDateToNullOnCommit ();

    /**
     * Checks if is sets the attachment lapsed date to null on error.
     *
     * @return true, if is sets the attachment lapsed date to null on error
     */
    public abstract boolean isSetAttachmentLapsedDateToNullOnError ();

    /**
     * Checks if is sets the attachment lapsed date to null on status not served.
     *
     * @return true, if is sets the attachment lapsed date to null on status not served
     */
    public abstract boolean isSetAttachmentLapsedDateToNullOnStatusNotServed ();

    /**
     * Checks if is sets the order date to null on error.
     *
     * @return true, if is sets the order date to null on error
     */
    public abstract boolean isSetOrderDateToNullOnError ();

    /**
     * Checks if is sets the order date to null on status not served.
     *
     * @return true, if is sets the order date to null on status not served
     */
    public abstract boolean isSetOrderDateToNullOnStatusNotServed ();

    /**
     * Gets the sets the status on commit.
     *
     * @return the sets the status on commit
     */
    public abstract String getSetStatusOnCommit ();

    /**
     * Gets the status LOV.
     *
     * @return the status LOV
     */
    public abstract String getStatusLOV ();

    /**
     * Checks if is sets the debt status from pending to live.
     *
     * @return true, if is sets the debt status from pending to live
     */
    public abstract boolean isSetDebtStatusFromPendingToLive ();

    /**
     * Checks if is pre condition event must exist warning.
     *
     * @return true, if is pre condition event must exist warning
     */
    public abstract boolean isPreConditionEventMustExistWarning ();

    /**
     * Checks if is register judgment.
     *
     * @return true, if is register judgment
     */
    public abstract boolean isRegisterJudgment ();

    /**
     * Gets the pre condition event must exist depends on co type.
     *
     * @return the pre condition event must exist depends on co type
     */
    public abstract String getPreConditionEventMustExistDependsOnCoType ();

}