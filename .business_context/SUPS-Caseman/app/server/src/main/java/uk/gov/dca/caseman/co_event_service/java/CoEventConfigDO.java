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
 * Class: CoEventConfigDO.java
 * 
 * @author Chris Hutt (EDS)
 *         Created: 12 July-2005
 *         Description:
 *         COEvent Configuration Data Object.
 * 
 *         Change history
 *         4 jan 2006 chris hutt
 *         defect temp_caseman 392: PreConditionEventMustExistDependsOnCoType added
 */
public class CoEventConfigDO implements ICoEventConfigDO
{

    /** The Standard event id. */
    private int StandardEventId;
    
    /** The BMS task required. */
    private boolean BMSTaskRequired;
    
    /** The Service type. */
    private String ServiceType;
    
    /** The Issue stage. */
    private boolean IssueStage;
    
    /** The Creditor field enabled. */
    private boolean CreditorFieldEnabled;
    
    /** The Employer details required. */
    private boolean EmployerDetailsRequired;
    
    /** The Employers named person required. */
    private boolean EmployersNamedPersonRequired;
    
    /** The PER details required. */
    private boolean PERDetailsRequired;
    
    /** The Details LOV domain. */
    private String DetailsLOVDomain;
    
    /** The Details LOV mandatory. */
    private boolean DetailsLOVMandatory;
    
    /** The Pre condition hearing date check. */
    private boolean PreConditionHearingDateCheck;
    
    /** The Pre condition previous order served check. */
    private boolean PreConditionPreviousOrderServedCheck;
    
    /** The Pre condition event must exist. */
    private boolean PreConditionEventMustExist;
    
    /** The Pre condition response filed check. */
    private boolean PreConditionResponseFiledCheck;
    
    /** The Pre condition previous order response time check. */
    private boolean PreConditionPreviousOrderResponseTimeCheck;
    
    /** The Pre condition warrant exists check. */
    private String PreConditionWarrantExistsCheck;
    
    /** The Pre condition payment details exist check. */
    private boolean PreConditionPaymentDetailsExistCheck;
    
    /** The Pre condition money in court check. */
    private boolean PreConditionMoneyInCourtCheck;
    
    /** The Pre condition discharged date set check. */
    private boolean PreConditionDischargedDateSetCheck;
    
    /** The Pre condition dividends declared check. */
    private boolean PreConditionDividendsDeclaredCheck;
    
    /** The Pre condition releasable money check. */
    private boolean PreConditionReleasableMoneyCheck;
    
    /** The Pre condition debts must exist check. */
    private boolean PreConditionDebtsMustExistCheck;
    
    /** The Pre condition valid CO status check. */
    private boolean PreConditionValidCOStatusCheck;
    
    /** The Pre condition valid debt status check. */
    private boolean PreConditionValidDebtStatusCheck;
    
    /** The Word processing call. */
    private boolean WordProcessingCall;
    
    /** The Oracle report call. */
    private boolean OracleReportCall;
    
    /** The Create hearing. */
    private boolean CreateHearing;
    
    /** The Warrant created. */
    private boolean WarrantCreated;
    
    /** The Service not served action. */
    private boolean ServiceNotServedAction;
    
    /** The Action on update event error. */
    private boolean ActionOnUpdateEventError;
    
    /** The Set attachment lapsed date on commit. */
    private boolean SetAttachmentLapsedDateOnCommit;
    
    /** The Set attachment arrears date on commit. */
    private boolean SetAttachmentArrearsDateOnCommit;
    
    /** The Set revoked discharged date on commit. */
    private boolean SetRevokedDischargedDateOnCommit;
    
    /** The Set AON 60 date on commit. */
    private boolean SetAON60DateOnCommit;
    
    /** The Set order date on commit. */
    private boolean SetOrderDateOnCommit;
    
    /** The Set status on commit. */
    private String SetStatusOnCommit;
    
    /** The Set attachment lapsed date to null on commit. */
    private boolean SetAttachmentLapsedDateToNullOnCommit;
    
    /** The Set attachment lapsed date to null on error. */
    private boolean SetAttachmentLapsedDateToNullOnError;
    
    /** The Set attachment lapsed date on error. */
    private boolean SetAttachmentLapsedDateOnError;
    
    /** The Set attachment lapsed date to null on status not served. */
    private boolean SetAttachmentLapsedDateToNullOnStatusNotServed;
    
    /** The Set AON 60 date to null on commit. */
    private boolean SetAON60DateToNullOnCommit;
    
    /** The Set AON 60 date to null on error. */
    private boolean SetAON60DateToNullOnError;
    
    /** The Set AON 60 date on error. */
    private boolean SetAON60DateOnError;
    
    /** The Set order date to null on error. */
    private boolean SetOrderDateToNullOnError;
    
    /** The Set order date to null on status not served. */
    private boolean SetOrderDateToNullOnStatusNotServed;
    
    /** The Re set status to live. */
    private boolean ReSetStatusToLive;
    
    /** The Set attachment arrears date on error. */
    private boolean SetAttachmentArrearsDateOnError;
    
    /** The Status LOV. */
    private String StatusLOV;
    
    /** The Set debt status from pending to live. */
    private boolean SetDebtStatusFromPendingToLive;
    
    /** The Register judgment. */
    private boolean RegisterJudgment;
    
    /** The Pre condition event must exist warning. */
    private boolean PreConditionEventMustExistWarning;
    
    /** The Pre condition event must exist depends on co type. */
    private String PreConditionEventMustExistDependsOnCoType;

    /**
     * Constructor.
     */
    public CoEventConfigDO ()
    {
    }

    /**
     * {@inheritDoc}
     */
    public boolean isActionOnUpdateEventError ()
    {
        return ActionOnUpdateEventError;
    }

    /**
     * Sets the action on update event error.
     *
     * @param actionOnUpdateEventError the new action on update event error
     */
    public void setActionOnUpdateEventError (final boolean actionOnUpdateEventError)
    {
        ActionOnUpdateEventError = actionOnUpdateEventError;
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
    public boolean isCreateHearing ()
    {
        return CreateHearing;
    }

    /**
     * Sets the creates the hearing.
     *
     * @param createHearing the new creates the hearing
     */
    public void setCreateHearing (final boolean createHearing)
    {
        CreateHearing = createHearing;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isCreditorFieldEnabled ()
    {
        return CreditorFieldEnabled;
    }

    /**
     * Sets the creditor field enabled.
     *
     * @param creditorFieldEnabled the new creditor field enabled
     */
    public void setCreditorFieldEnabled (final boolean creditorFieldEnabled)
    {
        CreditorFieldEnabled = creditorFieldEnabled;
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
    public boolean isEmployerDetailsRequired ()
    {
        return EmployerDetailsRequired;
    }

    /**
     * Sets the employer details required.
     *
     * @param employerDetailsRequired the new employer details required
     */
    public void setEmployerDetailsRequired (final boolean employerDetailsRequired)
    {
        EmployerDetailsRequired = employerDetailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isEmployersNamedPersonRequired ()
    {
        return EmployersNamedPersonRequired;
    }

    /**
     * Sets the employers named person required.
     *
     * @param employersNamedPersonRequired the new employers named person required
     */
    public void setEmployersNamedPersonRequired (final boolean employersNamedPersonRequired)
    {
        EmployersNamedPersonRequired = employersNamedPersonRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isIssueStage ()
    {
        return IssueStage;
    }

    /**
     * Sets the issue stage.
     *
     * @param issueStage the new issue stage
     */
    public void setIssueStage (final boolean issueStage)
    {
        IssueStage = issueStage;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPERDetailsRequired ()
    {
        return PERDetailsRequired;
    }

    /**
     * Sets the PER details required.
     *
     * @param detailsRequired the new PER details required
     */
    public void setPERDetailsRequired (final boolean detailsRequired)
    {
        PERDetailsRequired = detailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionDebtsMustExistCheck ()
    {
        return PreConditionDebtsMustExistCheck;
    }

    /**
     * Sets the pre condition debts must exist check.
     *
     * @param preConditionDebtsMustExistCheck the new pre condition debts must exist check
     */
    public void setPreConditionDebtsMustExistCheck (final boolean preConditionDebtsMustExistCheck)
    {
        PreConditionDebtsMustExistCheck = preConditionDebtsMustExistCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionDischargedDateSetCheck ()
    {
        return PreConditionDischargedDateSetCheck;
    }

    /**
     * Sets the pre condition discharged date set check.
     *
     * @param preConditionDischargedDateSetCheck the new pre condition discharged date set check
     */
    public void setPreConditionDischargedDateSetCheck (final boolean preConditionDischargedDateSetCheck)
    {
        PreConditionDischargedDateSetCheck = preConditionDischargedDateSetCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionDividendsDeclaredCheck ()
    {
        return PreConditionDividendsDeclaredCheck;
    }

    /**
     * Sets the pre condition dividends declared check.
     *
     * @param preConditionDividendsDeclaredCheck the new pre condition dividends declared check
     */
    public void setPreConditionDividendsDeclaredCheck (final boolean preConditionDividendsDeclaredCheck)
    {
        PreConditionDividendsDeclaredCheck = preConditionDividendsDeclaredCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionEventMustExist ()
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
    public boolean isPreConditionHearingDateCheck ()
    {
        return PreConditionHearingDateCheck;
    }

    /**
     * Sets the pre condition hearing date check.
     *
     * @param preConditionHearingDateCheck the new pre condition hearing date check
     */
    public void setPreConditionHearingDateCheck (final boolean preConditionHearingDateCheck)
    {
        PreConditionHearingDateCheck = preConditionHearingDateCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionMoneyInCourtCheck ()
    {
        return PreConditionMoneyInCourtCheck;
    }

    /**
     * Sets the pre condition money in court check.
     *
     * @param preConditionMoneyInCourtCheck the new pre condition money in court check
     */
    public void setPreConditionMoneyInCourtCheck (final boolean preConditionMoneyInCourtCheck)
    {
        PreConditionMoneyInCourtCheck = preConditionMoneyInCourtCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionPaymentDetailsExistCheck ()
    {
        return PreConditionPaymentDetailsExistCheck;
    }

    /**
     * Sets the pre condition payment details exist check.
     *
     * @param preConditionPaymentDetailsExistCheck the new pre condition payment details exist check
     */
    public void setPreConditionPaymentDetailsExistCheck (final boolean preConditionPaymentDetailsExistCheck)
    {
        PreConditionPaymentDetailsExistCheck = preConditionPaymentDetailsExistCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionPreviousOrderResponseTimeCheck ()
    {
        return PreConditionPreviousOrderResponseTimeCheck;
    }

    /**
     * Sets the pre condition previous order response time check.
     *
     * @param preConditionPreviousOrderResponseTimeCheck the new pre condition previous order response time check
     */
    public void setPreConditionPreviousOrderResponseTimeCheck (final boolean preConditionPreviousOrderResponseTimeCheck)
    {
        PreConditionPreviousOrderResponseTimeCheck = preConditionPreviousOrderResponseTimeCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionPreviousOrderServedCheck ()
    {
        return PreConditionPreviousOrderServedCheck;
    }

    /**
     * Sets the pre condition previous order served check.
     *
     * @param preConditionPreviousOrderServedCheck the new pre condition previous order served check
     */
    public void setPreConditionPreviousOrderServedCheck (final boolean preConditionPreviousOrderServedCheck)
    {
        PreConditionPreviousOrderServedCheck = preConditionPreviousOrderServedCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionReleasableMoneyCheck ()
    {
        return PreConditionReleasableMoneyCheck;
    }

    /**
     * Sets the pre condition releasable money check.
     *
     * @param preConditionReleasableMoneyCheck the new pre condition releasable money check
     */
    public void setPreConditionReleasableMoneyCheck (final boolean preConditionReleasableMoneyCheck)
    {
        PreConditionReleasableMoneyCheck = preConditionReleasableMoneyCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionResponseFiledCheck ()
    {
        return PreConditionResponseFiledCheck;
    }

    /**
     * Sets the pre condition response filed check.
     *
     * @param preConditionResponseFiledCheck the new pre condition response filed check
     */
    public void setPreConditionResponseFiledCheck (final boolean preConditionResponseFiledCheck)
    {
        PreConditionResponseFiledCheck = preConditionResponseFiledCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionValidCOStatusCheck ()
    {
        return PreConditionValidCOStatusCheck;
    }

    /**
     * Sets the pre condition valid CO status check.
     *
     * @param preConditionValidCOStatusCheck the new pre condition valid CO status check
     */
    public void setPreConditionValidCOStatusCheck (final boolean preConditionValidCOStatusCheck)
    {
        PreConditionValidCOStatusCheck = preConditionValidCOStatusCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionValidDebtStatusCheck ()
    {
        return PreConditionValidDebtStatusCheck;
    }

    /**
     * Sets the pre condition valid debt status check.
     *
     * @param preConditionValidDebtStatusCheck the new pre condition valid debt status check
     */
    public void setPreConditionValidDebtStatusCheck (final boolean preConditionValidDebtStatusCheck)
    {
        PreConditionValidDebtStatusCheck = preConditionValidDebtStatusCheck;
    }

    /**
     * {@inheritDoc}
     */
    public String getPreConditionWarrantExistsCheck ()
    {
        return PreConditionWarrantExistsCheck;
    }

    /**
     * Sets the pre condition warrant exists check.
     *
     * @param preConditionWarrantExistsCheck the new pre condition warrant exists check
     */
    public void setPreConditionWarrantExistsCheck (final String preConditionWarrantExistsCheck)
    {
        PreConditionWarrantExistsCheck = preConditionWarrantExistsCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isServiceNotServedAction ()
    {
        return ServiceNotServedAction;
    }

    /**
     * Sets the service not served action.
     *
     * @param serviceNotServedAction the new service not served action
     */
    public void setServiceNotServedAction (final boolean serviceNotServedAction)
    {
        ServiceNotServedAction = serviceNotServedAction;
    }

    /**
     * {@inheritDoc}
     */
    public String getServiceType ()
    {
        return ServiceType;
    }

    /**
     * Sets the service type.
     *
     * @param serviceType the new service type
     */
    public void setServiceType (final String serviceType)
    {
        ServiceType = serviceType;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAON60DateOnCommit ()
    {
        return SetAON60DateOnCommit;
    }

    /**
     * Sets the sets the AON 60 date on commit.
     *
     * @param setAON60DateOnCommit the new sets the AON 60 date on commit
     */
    public void setSetAON60DateOnCommit (final boolean setAON60DateOnCommit)
    {
        SetAON60DateOnCommit = setAON60DateOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentArrearsDateOnCommit ()
    {
        return SetAttachmentArrearsDateOnCommit;
    }

    /**
     * Sets the sets the attachment arrears date on commit.
     *
     * @param setAttachmentArrearsDateOnCommit the new sets the attachment arrears date on commit
     */
    public void setSetAttachmentArrearsDateOnCommit (final boolean setAttachmentArrearsDateOnCommit)
    {
        SetAttachmentArrearsDateOnCommit = setAttachmentArrearsDateOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentLapsedDateOnCommit ()
    {
        return SetAttachmentLapsedDateOnCommit;
    }

    /**
     * Sets the sets the attachment lapsed date on commit.
     *
     * @param setAttachmentLapsedDateOnCommit the new sets the attachment lapsed date on commit
     */
    public void setSetAttachmentLapsedDateOnCommit (final boolean setAttachmentLapsedDateOnCommit)
    {
        SetAttachmentLapsedDateOnCommit = setAttachmentLapsedDateOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetOrderDateOnCommit ()
    {
        return SetOrderDateOnCommit;
    }

    /**
     * Sets the sets the order date on commit.
     *
     * @param setOrderDateOnCommit the new sets the order date on commit
     */
    public void setSetOrderDateOnCommit (final boolean setOrderDateOnCommit)
    {
        SetOrderDateOnCommit = setOrderDateOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetRevokedDischargedDateOnCommit ()
    {
        return SetRevokedDischargedDateOnCommit;
    }

    /**
     * Sets the sets the revoked discharged date on commit.
     *
     * @param setRevokedDischargedDateOnCommit the new sets the revoked discharged date on commit
     */
    public void setSetRevokedDischargedDateOnCommit (final boolean setRevokedDischargedDateOnCommit)
    {
        SetRevokedDischargedDateOnCommit = setRevokedDischargedDateOnCommit;
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
    public boolean isWarrantCreated ()
    {
        return WarrantCreated;
    }

    /**
     * Sets the warrant created.
     *
     * @param warrantCreated the new warrant created
     */
    public void setWarrantCreated (final boolean warrantCreated)
    {
        WarrantCreated = warrantCreated;
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
    public boolean isReSetStatusToLive ()
    {
        return ReSetStatusToLive;
    }

    /**
     * Sets the re set status to live.
     *
     * @param reSetStatusToLive the new re set status to live
     */
    public void setReSetStatusToLive (final boolean reSetStatusToLive)
    {
        ReSetStatusToLive = reSetStatusToLive;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAON60DateOnError ()
    {
        return SetAON60DateOnError;
    }

    /**
     * Sets the sets the AON 60 date on error.
     *
     * @param setAON60DateOnError the new sets the AON 60 date on error
     */
    public void setSetAON60DateOnError (final boolean setAON60DateOnError)
    {
        SetAON60DateOnError = setAON60DateOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAON60DateToNullOnCommit ()
    {
        return SetAON60DateToNullOnCommit;
    }

    /**
     * Sets the sets the AON 60 date to null on commit.
     *
     * @param setAON60DateToNullOnCommit the new sets the AON 60 date to null on commit
     */
    public void setSetAON60DateToNullOnCommit (final boolean setAON60DateToNullOnCommit)
    {
        SetAON60DateToNullOnCommit = setAON60DateToNullOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAON60DateToNullOnError ()
    {
        return SetAON60DateToNullOnError;
    }

    /**
     * Sets the sets the AON 60 date to null on error.
     *
     * @param setAON60DateToNullOnError the new sets the AON 60 date to null on error
     */
    public void setSetAON60DateToNullOnError (final boolean setAON60DateToNullOnError)
    {
        SetAON60DateToNullOnError = setAON60DateToNullOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentArrearsDateOnError ()
    {
        return SetAttachmentArrearsDateOnError;
    }

    /**
     * Sets the sets the attachment arrears date on error.
     *
     * @param setAttachmentArrearsDateOnError the new sets the attachment arrears date on error
     */
    public void setSetAttachmentArrearsDateOnError (final boolean setAttachmentArrearsDateOnError)
    {
        SetAttachmentArrearsDateOnError = setAttachmentArrearsDateOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentLapsedDateOnError ()
    {
        return SetAttachmentLapsedDateOnError;
    }

    /**
     * Sets the sets the attachment lapsed date on error.
     *
     * @param setAttachmentLapsedDateOnError the new sets the attachment lapsed date on error
     */
    public void setSetAttachmentLapsedDateOnError (final boolean setAttachmentLapsedDateOnError)
    {
        SetAttachmentLapsedDateOnError = setAttachmentLapsedDateOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentLapsedDateToNullOnCommit ()
    {
        return SetAttachmentLapsedDateToNullOnCommit;
    }

    /**
     * Sets the sets the attachment lapsed date to null on commit.
     *
     * @param setAttachmentLapsedDateToNullOnCommit the new sets the attachment lapsed date to null on commit
     */
    public void setSetAttachmentLapsedDateToNullOnCommit (final boolean setAttachmentLapsedDateToNullOnCommit)
    {
        SetAttachmentLapsedDateToNullOnCommit = setAttachmentLapsedDateToNullOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentLapsedDateToNullOnError ()
    {
        return SetAttachmentLapsedDateToNullOnError;
    }

    /**
     * Sets the sets the attachment lapsed date to null on error.
     *
     * @param setAttachmentLapsedDateToNullOnError the new sets the attachment lapsed date to null on error
     */
    public void setSetAttachmentLapsedDateToNullOnError (final boolean setAttachmentLapsedDateToNullOnError)
    {
        SetAttachmentLapsedDateToNullOnError = setAttachmentLapsedDateToNullOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetAttachmentLapsedDateToNullOnStatusNotServed ()
    {
        return SetAttachmentLapsedDateToNullOnStatusNotServed;
    }

    /**
     * Sets the sets the attachment lapsed date to null on status not served.
     *
     * @param setAttachmentLapsedDateToNullOnStatusNotServed the new sets the attachment lapsed date to null on status
     *            not served
     */
    public void
            setSetAttachmentLapsedDateToNullOnStatusNotServed (final boolean setAttachmentLapsedDateToNullOnStatusNotServed)
    {
        SetAttachmentLapsedDateToNullOnStatusNotServed = setAttachmentLapsedDateToNullOnStatusNotServed;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetOrderDateToNullOnError ()
    {
        return SetOrderDateToNullOnError;
    }

    /**
     * Sets the sets the order date to null on error.
     *
     * @param setOrderDateToNullOnError the new sets the order date to null on error
     */
    public void setSetOrderDateToNullOnError (final boolean setOrderDateToNullOnError)
    {
        SetOrderDateToNullOnError = setOrderDateToNullOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetOrderDateToNullOnStatusNotServed ()
    {
        return SetOrderDateToNullOnStatusNotServed;
    }

    /**
     * Sets the sets the order date to null on status not served.
     *
     * @param setOrderDateToNullOnStatusNotServed the new sets the order date to null on status not served
     */
    public void setSetOrderDateToNullOnStatusNotServed (final boolean setOrderDateToNullOnStatusNotServed)
    {
        SetOrderDateToNullOnStatusNotServed = setOrderDateToNullOnStatusNotServed;
    }

    /**
     * {@inheritDoc}
     */
    public String getSetStatusOnCommit ()
    {
        return SetStatusOnCommit;
    }

    /**
     * Sets the sets the status on commit.
     *
     * @param setStatusOnCommit the new sets the status on commit
     */
    public void setSetStatusOnCommit (final String setStatusOnCommit)
    {
        SetStatusOnCommit = setStatusOnCommit;
    }

    /**
     * {@inheritDoc}
     */
    public String getStatusLOV ()
    {
        return StatusLOV;
    }

    /**
     * Sets the status LOV.
     *
     * @param statusLOV the new status LOV
     */
    public void setStatusLOV (final String statusLOV)
    {
        StatusLOV = statusLOV;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isSetDebtStatusFromPendingToLive ()
    {
        return SetDebtStatusFromPendingToLive;
    }

    /**
     * Sets the sets the debt status from pending to live.
     *
     * @param setDebtStatusFromPendingToLive the new sets the debt status from pending to live
     */
    public void setSetDebtStatusFromPendingToLive (final boolean setDebtStatusFromPendingToLive)
    {
        SetDebtStatusFromPendingToLive = setDebtStatusFromPendingToLive;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionEventMustExistWarning ()
    {
        return PreConditionEventMustExistWarning;
    }

    /**
     * Sets the pre condition event must exist warning.
     *
     * @param preConditionEventMustExistWarning the new pre condition event must exist warning
     */
    public void setPreConditionEventMustExistWarning (final boolean preConditionEventMustExistWarning)
    {
        PreConditionEventMustExistWarning = preConditionEventMustExistWarning;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isRegisterJudgment ()
    {
        return RegisterJudgment;
    }

    /**
     * Sets the register judgment.
     *
     * @param registerJudgment the new register judgment
     */
    public void setRegisterJudgment (final boolean registerJudgment)
    {
        RegisterJudgment = registerJudgment;
    }

    /**
     * {@inheritDoc}
     */
    public String getPreConditionEventMustExistDependsOnCoType ()
    {
        return PreConditionEventMustExistDependsOnCoType;
    }

    /**
     * Sets the pre condition event must exist depends on co type.
     *
     * @param preConditionEventMustExistDependsOnCoType the new pre condition event must exist depends on co type
     */
    public void setPreConditionEventMustExistDependsOnCoType (final String preConditionEventMustExistDependsOnCoType)
    {
        PreConditionEventMustExistDependsOnCoType = preConditionEventMustExistDependsOnCoType;
    }

} // class CoEventConfigDO
