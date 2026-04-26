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
 * The Interface IAeEventConfigDO.
 */
public interface IAeEventConfigDO
{

    /**
     * Gets the creates the hearing type.
     *
     * @return the creates the hearing type
     */

    public abstract String getCreateHearingType ();

    /**
     * Sets the creates the hearing type.
     *
     * @param createHearingType the new creates the hearing type
     */

    public abstract void setCreateHearingType (String createHearingType);

    /**
     * Gets the creates the warrant type.
     *
     * @return the creates the warrant type
     */

    public abstract String getCreateWarrantType ();

    /**
     * Sets the creates the warrant type.
     *
     * @param createWarrantType the new creates the warrant type
     */

    public abstract void setCreateWarrantType (String createWarrantType);

    /**
     * Gets the details LOV domain.
     *
     * @return the details LOV domain
     */

    public abstract String getDetailsLOVDomain ();

    /**
     * Sets the details LOV domain.
     *
     * @param detailsLOVDomain the new details LOV domain
     */

    public abstract void setDetailsLOVDomain (String detailsLOVDomain);

    /**
     * Checks if is details LOV mandatory.
     *
     * @return true, if is details LOV mandatory
     */

    public abstract boolean isDetailsLOVMandatory ();

    /**
     * Sets the details LOV mandatory.
     *
     * @param detailsLOVMandatory the new details LOV mandatory
     */

    public abstract void setDetailsLOVMandatory (boolean detailsLOVMandatory);

    /**
     * Checks if is delete report map on error.
     *
     * @return true, if is delete report map on error
     */

    public abstract boolean isDeleteReportMapOnError ();

    /**
     * Sets the delete report map on error.
     *
     * @param deleteReportMap the new delete report map on error
     */

    public abstract void setDeleteReportMapOnError (boolean deleteReportMap);

    /**
     * Checks if is employer details required.
     *
     * @return true, if is employer details required
     */

    public abstract boolean isEmployerDetailsRequired ();

    /**
     * Sets the employer details required.
     *
     * @param employerDetailsRequired the new employer details required
     */

    public abstract void setEmployerDetailsRequired (boolean employerDetailsRequired);

    /**
     * Checks if is employer named person required.
     *
     * @return true, if is employer named person required
     */
    public abstract boolean isEmployerNamedPersonRequired ();

    /**
     * Sets the employer named person required.
     *
     * @param employerNamedPersonRequired the new employer named person required
     */
    public abstract void setEmployerNamedPersonRequired (boolean employerNamedPersonRequired);

    /**
     * Checks if is issue stage.
     *
     * @return true, if is issue stage
     */

    public abstract boolean isIssueStage ();

    /**
     * Sets the issue stage.
     *
     * @param issueStage the new issue stage
     */

    public abstract void setIssueStage (boolean issueStage);

    /**
     * Checks if is mark for CAPS transfer.
     *
     * @return true, if is mark for CAPS transfer
     */

    public abstract boolean isMarkForCAPSTransfer ();

    /**
     * Sets the mark for CAPS transfer.
     *
     * @param markForCAPSTransfer the new mark for CAPS transfer
     */

    public abstract void setMarkForCAPSTransfer (boolean markForCAPSTransfer);

    /**
     * Checks if is obligations call.
     *
     * @return true, if is obligations call
     */

    public abstract boolean isObligationsCall ();

    /**
     * Sets the obligations call.
     *
     * @param obligationsCall the new obligations call
     */

    public abstract void setObligationsCall (boolean obligationsCall);

    /**
     * Checks if is obligations prompt.
     *
     * @return true, if is obligations prompt
     */

    public abstract boolean isObligationsPrompt ();

    /**
     * Sets the obligations prompt.
     *
     * @param obligationsPrompt the new obligations prompt
     */

    public abstract void setObligationsPrompt (boolean obligationsPrompt);

    /**
     * Checks if is PER details required.
     *
     * @return true, if is PER details required
     */

    public abstract boolean isPERDetailsRequired ();

    /**
     * Sets the PER details required.
     *
     * @param detailsRequired the new PER details required
     */

    public abstract void setPERDetailsRequired (boolean detailsRequired);

    /**
     * Checks if is pre condition AE outstanding balance check.
     *
     * @return true, if is pre condition AE outstanding balance check
     */

    public abstract boolean isPreConditionAEOutstandingBalanceCheck ();

    /**
     * Sets the pre condition AE outstanding balance check.
     *
     * @param preConditionAEOutstandingBalanceCheck the new pre condition AE outstanding balance check
     */

    public abstract void setPreConditionAEOutstandingBalanceCheck (boolean preConditionAEOutstandingBalanceCheck);

    /**
     * Checks if is pre condition event must exist.
     *
     * @return true, if is pre condition event must exist
     */

    public abstract boolean isPreConditionEventMustExist ();

    /**
     * Sets the pre condition event must exist.
     *
     * @param preConditionEventMustExist the new pre condition event must exist
     */

    public abstract void setPreConditionEventMustExist (boolean preConditionEventMustExist);

    /**
     * Checks if is pre condition future ae hearing check.
     *
     * @return true, if is pre condition future ae hearing check
     */

    public abstract boolean isPreConditionFutureAeHearingCheck ();

    /**
     * Sets the pre condition future ae hearing check.
     *
     * @param preConditionFutureAeHearingCheck the new pre condition future ae hearing check
     */

    public abstract void setPreConditionFutureAeHearingCheck (boolean preConditionFutureAeHearingCheck);

    /**
     * Checks if is pre condition later response event check.
     *
     * @return true, if is pre condition later response event check
     */

    public abstract boolean isPreConditionLaterResponseEventCheck ();

    /**
     * Sets the pre condition later response event check.
     *
     * @param preConditionLaterResponseEventCheck the new pre condition later response event check
     */

    public abstract void setPreConditionLaterResponseEventCheck (boolean preConditionLaterResponseEventCheck);

    /**
     * Checks if is pre condition previous order check.
     *
     * @return true, if is pre condition previous order check
     */

    public abstract boolean isPreConditionPreviousOrderCheck ();

    /**
     * Sets the pre condition previous order check.
     *
     * @param preConditionPreviousOrderCheck the new pre condition previous order check
     */

    public abstract void setPreConditionPreviousOrderCheck (boolean preConditionPreviousOrderCheck);

    /**
     * Checks if is pre condition service date check.
     *
     * @return true, if is pre condition service date check
     */

    public abstract boolean isPreConditionServiceDateCheck ();

    /**
     * Sets the pre condition service date check.
     *
     * @param preConditionServiceDateCheck the new pre condition service date check
     */

    public abstract void setPreConditionServiceDateCheck (boolean preConditionServiceDateCheck);

    /**
     * Gets the service type.
     *
     * @return the service type
     */

    public abstract String getServiceType ();

    /**
     * Sets the service type.
     *
     * @param serviceType the new service type
     */

    public abstract void setServiceType (String serviceType);

    /**
     * Gets the standard event id.
     *
     * @return the standard event id
     */

    public abstract int getStandardEventId ();

    /**
     * Sets the standard event id.
     *
     * @param standardEventId the new standard event id
     */

    public abstract void setStandardEventId (int standardEventId);

    /**
     * Checks if is valid AE types.
     *
     * @return true, if is valid AE types
     */

    public abstract boolean isValidAETypes ();

    /**
     * Sets the valid AE types.
     *
     * @param validAETypes the new valid AE types
     */

    public abstract void setValidAETypes (boolean validAETypes);

    /**
     * Checks if is word processing call.
     *
     * @return true, if is word processing call
     */

    public abstract boolean isWordProcessingCall ();

    /**
     * Sets the word processing call.
     *
     * @param wordProcessingCall the new word processing call
     */

    public abstract void setWordProcessingCall (boolean wordProcessingCall);

    /**
     * Checks if is oracle report call.
     *
     * @return true, if is oracle report call
     */

    public abstract boolean isOracleReportCall ();

    /**
     * Sets the oracle report call.
     *
     * @param oracleReportCall the new oracle report call
     */

    public abstract void setOracleReportCall (boolean oracleReportCall);

    /**
     * Checks if is pre condition past ae hearing check.
     *
     * @return true, if is pre condition past ae hearing check
     */

    public abstract boolean isPreConditionPastAeHearingCheck ();

    /**
     * Sets the pre condition past ae hearing check.
     *
     * @param preConditionPastAeHearingCheck the new pre condition past ae hearing check
     */

    public abstract void setPreConditionPastAeHearingCheck (boolean preConditionPastAeHearingCheck);

    /**
     * Checks if is obligations call on error.
     *
     * @return true, if is obligations call on error
     */

    public abstract boolean isObligationsCallOnError ();

    /**
     * Sets the obligations call on error.
     *
     * @param obligationsCallOnError the new obligations call on error
     */

    public abstract void setObligationsCallOnError (boolean obligationsCallOnError);

    /**
     * Checks if is obligations prompt on error.
     *
     * @return true, if is obligations prompt on error
     */

    public abstract boolean isObligationsPromptOnError ();

    /**
     * Sets the obligations prompt on error.
     *
     * @param obligationsPromptOnError the new obligations prompt on error
     */

    public abstract void setObligationsPromptOnError (boolean obligationsPromptOnError);

    /**
     * Checks if is pre condition ae hearing check.
     *
     * @return true, if is pre condition ae hearing check
     */

    public abstract boolean isPreConditionAeHearingCheck ();

    /**
     * Sets the pre condition ae hearing check.
     *
     * @param preConditionAeHearingCheck the new pre condition ae hearing check
     */

    public abstract void setPreConditionAeHearingCheck (boolean preConditionAeHearingCheck);

    /**
     * Checks if is hearing created.
     *
     * @return true, if is hearing created
     */

    public abstract boolean isHearingCreated ();

    /**
     * Sets the hearing created.
     *
     * @param hearingCreated the new hearing created
     */

    public abstract void setHearingCreated (boolean hearingCreated);

}