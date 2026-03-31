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

/**
 * Class: AeEventConfigDO.java
 * 
 * @author Chris Hutt (EDS)
 *         Created: 21-June-2005
 *         Description:
 *         AE Event Configuration Data Object.
 * 
 *         Change History
 * 
 *         25 may 2006 chris hutt
 *         defect UCT273: PreConditionAeHearingCheck added
 * 
 *         20july2006 chris hutt
 *         defect 4030: PreConditionAEOutstandingBalanceCheck mispelling
 *
 *         09 Nov 2006 chris hutt
 *         buildz etc issue 173: HearingCreated added
 *
 *         20 Dec 2006 chris hutt
 *         temp_caseman defect 356: EmployerNamedPersonRequired added
 */
// public class AeEventConfigDO implements IAeEventConfigDO {
public class AeEventConfigDO implements IAeEventConfigDO
{

    /** The Standard event id. */
    private int StandardEventId;
    
    /** The Pre condition event must exist. */
    private boolean PreConditionEventMustExist;
    
    /** The Service type. */
    private String ServiceType;
    
    /** The Issue stage. */
    private boolean IssueStage;
    
    /** The PER details required. */
    private boolean PERDetailsRequired;
    
    /** The Employer details required. */
    private boolean EmployerDetailsRequired;
    
    /** The Employer named person required. */
    private boolean EmployerNamedPersonRequired;
    
    /** The Word processing call. */
    private boolean WordProcessingCall;
    
    /** The Obligations call. */
    private boolean ObligationsCall;
    
    /** The Obligations prompt. */
    private boolean ObligationsPrompt;
    
    /** The Details LOV domain. */
    private String DetailsLOVDomain;
    
    /** The Details LOV mandatory. */
    private boolean DetailsLOVMandatory;
    
    /** The Delete report map. */
    private boolean DeleteReportMap;
    
    /** The Pre condition previous order check. */
    private boolean PreConditionPreviousOrderCheck;
    
    /** The Pre condition future ae hearing check. */
    private boolean PreConditionFutureAeHearingCheck;
    
    /** The Pre condition past ae hearing check. */
    private boolean PreConditionPastAeHearingCheck;
    
    /** The Create warrant type. */
    private String CreateWarrantType;
    
    /** The Valid AE types. */
    private boolean ValidAETypes;
    
    /** The Pre condition AE outstanding balance check. */
    private boolean PreConditionAEOutstandingBalanceCheck;
    
    /** The Mark for CAPS transfer. */
    private boolean MarkForCAPSTransfer;
    
    /** The Create hearing type. */
    private String CreateHearingType;
    
    /** The Pre condition later response event check. */
    private boolean PreConditionLaterResponseEventCheck;
    
    /** The Pre condition service date check. */
    private boolean PreConditionServiceDateCheck;
    
    /** The Oracle report call. */
    private boolean OracleReportCall;
    
    /** The Obligations call on error. */
    private boolean ObligationsCallOnError;
    
    /** The Obligations prompt on error. */
    private boolean ObligationsPromptOnError;
    
    /** The Pre condition ae hearing check. */
    private boolean PreConditionAeHearingCheck;
    
    /** The Hearing created. */
    private boolean HearingCreated;

    /**
     * Constructor.
     */
    public AeEventConfigDO ()
    {
    }

    /**
     * {@inheritDoc}
     */
    public String getCreateHearingType ()
    {
        return CreateHearingType;
    }

    /**
     * {@inheritDoc}
     */
    public void setCreateHearingType (final String createHearingType)
    {
        CreateHearingType = createHearingType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCreateWarrantType ()
    {
        return CreateWarrantType;
    }

    /**
     * {@inheritDoc}
     */
    public void setCreateWarrantType (final String createWarrantType)
    {
        CreateWarrantType = createWarrantType;
    }

    /**
     * {@inheritDoc}
     */
    public String getDetailsLOVDomain ()
    {
        return DetailsLOVDomain;
    }

    /**
     * {@inheritDoc}
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
     * {@inheritDoc}
     */
    public void setDetailsLOVMandatory (final boolean detailsLOVMandatory)
    {
        DetailsLOVMandatory = detailsLOVMandatory;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isDeleteReportMapOnError ()
    {
        return DeleteReportMap;
    }

    /**
     * {@inheritDoc}
     */
    public void setDeleteReportMapOnError (final boolean deleteReportMap)
    {
        DeleteReportMap = deleteReportMap;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isEmployerDetailsRequired ()
    {
        return EmployerDetailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public void setEmployerDetailsRequired (final boolean employerDetailsRequired)
    {
        EmployerDetailsRequired = employerDetailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isEmployerNamedPersonRequired ()
    {
        return EmployerNamedPersonRequired;
    }

    /**
     * {@inheritDoc}
     */
    public void setEmployerNamedPersonRequired (final boolean employerNamedPersonRequired)
    {
        EmployerNamedPersonRequired = employerNamedPersonRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isIssueStage ()
    {
        return IssueStage;
    }

    /**
     * {@inheritDoc}
     */
    public void setIssueStage (final boolean issueStage)
    {
        IssueStage = issueStage;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isMarkForCAPSTransfer ()
    {
        return MarkForCAPSTransfer;
    }

    /**
     * {@inheritDoc}
     */
    public void setMarkForCAPSTransfer (final boolean markForCAPSTransfer)
    {
        MarkForCAPSTransfer = markForCAPSTransfer;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isObligationsCall ()
    {
        return ObligationsCall;
    }

    /**
     * {@inheritDoc}
     */
    public void setObligationsCall (final boolean obligationsCall)
    {
        ObligationsCall = obligationsCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isObligationsPrompt ()
    {
        return ObligationsPrompt;
    }

    /**
     * {@inheritDoc}
     */
    public void setObligationsPrompt (final boolean obligationsPrompt)
    {
        ObligationsPrompt = obligationsPrompt;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPERDetailsRequired ()
    {
        return PERDetailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public void setPERDetailsRequired (final boolean detailsRequired)
    {
        PERDetailsRequired = detailsRequired;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionAEOutstandingBalanceCheck ()
    {
        return PreConditionAEOutstandingBalanceCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionAEOutstandingBalanceCheck (final boolean preConditionAEOutstandingBalanceCheck)
    {
        PreConditionAEOutstandingBalanceCheck = preConditionAEOutstandingBalanceCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionEventMustExist ()
    {
        return PreConditionEventMustExist;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionEventMustExist (final boolean preConditionEventMustExist)
    {
        PreConditionEventMustExist = preConditionEventMustExist;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionFutureAeHearingCheck ()
    {
        return PreConditionFutureAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionFutureAeHearingCheck (final boolean preConditionFutureAeHearingCheck)
    {
        PreConditionFutureAeHearingCheck = preConditionFutureAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionLaterResponseEventCheck ()
    {
        return PreConditionLaterResponseEventCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionLaterResponseEventCheck (final boolean preConditionLaterResponseEventCheck)
    {
        PreConditionLaterResponseEventCheck = preConditionLaterResponseEventCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionPreviousOrderCheck ()
    {
        return PreConditionPreviousOrderCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionPreviousOrderCheck (final boolean preConditionPreviousOrderCheck)
    {
        PreConditionPreviousOrderCheck = preConditionPreviousOrderCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionServiceDateCheck ()
    {
        return PreConditionServiceDateCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionServiceDateCheck (final boolean preConditionServiceDateCheck)
    {
        PreConditionServiceDateCheck = preConditionServiceDateCheck;
    }

    /**
     * {@inheritDoc}
     */
    public String getServiceType ()
    {
        return ServiceType;
    }

    /**
     * {@inheritDoc}
     */
    public void setServiceType (final String serviceType)
    {
        ServiceType = serviceType;
    }

    /**
     * {@inheritDoc}
     */
    public int getStandardEventId ()
    {
        return StandardEventId;
    }

    /**
     * {@inheritDoc}
     */
    public void setStandardEventId (final int standardEventId)
    {
        StandardEventId = standardEventId;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isValidAETypes ()
    {
        return ValidAETypes;
    }

    /**
     * {@inheritDoc}
     */
    public void setValidAETypes (final boolean validAETypes)
    {
        ValidAETypes = validAETypes;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isWordProcessingCall ()
    {
        return WordProcessingCall;
    }

    /**
     * {@inheritDoc}
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
     * {@inheritDoc}
     */
    public void setOracleReportCall (final boolean oracleReportCall)
    {
        OracleReportCall = oracleReportCall;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionPastAeHearingCheck ()
    {
        return PreConditionPastAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionPastAeHearingCheck (final boolean preConditionPastAeHearingCheck)
    {
        PreConditionPastAeHearingCheck = preConditionPastAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isObligationsCallOnError ()
    {
        return ObligationsCallOnError;
    }

    /**
     * {@inheritDoc}
     */
    public void setObligationsCallOnError (final boolean obligationsCallOnError)
    {
        ObligationsCallOnError = obligationsCallOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isObligationsPromptOnError ()
    {
        return ObligationsPromptOnError;
    }

    /**
     * {@inheritDoc}
     */
    public void setObligationsPromptOnError (final boolean obligationsPromptOnError)
    {
        ObligationsPromptOnError = obligationsPromptOnError;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isPreConditionAeHearingCheck ()
    {
        return PreConditionAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public void setPreConditionAeHearingCheck (final boolean preConditionAeHearingCheck)
    {
        PreConditionAeHearingCheck = preConditionAeHearingCheck;
    }

    /**
     * {@inheritDoc}
     */
    public boolean isHearingCreated ()
    {
        return HearingCreated;
    }

    /**
     * {@inheritDoc}
     */
    public void setHearingCreated (final boolean hearingCreated)
    {
        HearingCreated = hearingCreated;
    }

} // class AeEventConfigDO
