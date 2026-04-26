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
 * Created on 8 March 2005
 * 
 * Phil Haferer
 * 
 * Constants associated with Case Events
 * 
 * Change History
 * --------------
 * 
 * 06/06/2006 Chris Hutt TD3445: updateCaseEventWithWarrantIdForAeEvent added
 * 
 * 19 Mar 2007 Chris Hutt
 * defect temp_caseman 310 : getPreReqNotCaseStatusList added
 * 
 * 05 Jul 2007 Chris Hutt : UCT Group2 1455
 * GET_DISTINCT_PARTIES_WITH_STD_CASE_EVENT_LIST added.
 *
 * @author Phil Haferer
 */
public class CaseEventDefs
{

    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";

    /**
     * Get applicant response method name.
     */
    public static final String GET_APPLICANT_RESPONSE_METHOD = "getApplicantResponseLocal";
    /**
     * Get case event method name.
     */
    public static final String GET_CASE_EVENT_METHOD = "getCaseEventLocal";
    /**
     * Get case event method name.
     */
    public static final String GET_CASE_EVENTS_METHOD = "getCaseEventsLocal";
    /**
     * Get hearing type method.
     */
    public static final String GET_HEARING_TYPE_METHOD = "getHearingTypeLocal";
    /**
     * Get hearing type method.
     */
    public static final String GET_EVENT_RETURN_CODE_METHOD = "getEventWarrantReturnCodeLocal";
    /**
     * Get variation method name.
     */
    public static final String GET_VARIATION_METHOD = "getVariationLocal";
    /**
     * Get changed event list method name.
     */
    public static final String GET_CHANGED_EVENT_LIST_METHOD = "getChangedEventListLocal";
    /**
     * Insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";
    /**
     * Insert case event row on ae event insert method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_ON_AE_EVENT_INSERT = "insertCaseEventRowOnAeEventInsertLocal";
    /**
     * Is coded party method name.
     */
    public static final String IS_CODED_PARTY_METHOD = "isCodedPartyLocal";
    /**
     * Set case party role date of service method name.
     */
    public static final String SET_CASE_PARTY_ROLE_DATE_OF_SERVICE_METHOD = "setCasePartyRoleDateOfServiceLocal";
    /**
     * Update case party role bar judgement method name.
     */
    public static final String UPDATE_CASE_PARTY_ROLE_BAR_JUDGMENT_METHOD = "updateCasePartyRoleBarJudgmentLocal";
    /**
     * Update case party role bar judgement for all defendants method name.
     */
    public static final String UPDATE_CASE_PARTY_ROLE_BAR_JUDGMENT_FOR_ALL_DEFENDANTS_METHOD =
            "updateCasePartyRoleBarJudgmentForAllDefendantsLocal";
    /**
     * Update case event details method name.
     */
    public static final String UPDATE_CASE_STATUS_METHOD = "updateCaseStatusLocal";
    /**
     * Update case event details method name.
     */
    public static final String UPDATE_CASE_EVENT_DETAILS_METHOD = "updateCaseEventDetailsLocal";
    /**
     * Update case event row method.
     */
    public static final String UPDATE_CASE_EVENT_ROW_METHOD = "updateCaseEventRowLocal";
    /**
     * Update case event row no lock method.
     */
    public static final String UPDATE_CASE_EVENT_ROW_NO_LOCK_METHOD = "updateCaseEventRowNoLockLocal";

    /**
     * Get defs date of service method name.
     */
    public static final String GET_DEFS_DATE_OF_SERVICE = "getDefsDateOfServiceAndAckLocal";
    /**
     * Get detail lov method name.
     */
    public static final String GET_DETAIL_LOV = "getCaseEventDetailsListLocal";
    /**
     * Get bms task lov method name.
     */
    public static final String GET_BMSTASK_LOV = "getCaseEventOnCommitListLocal";
    /**
     * Get defs with event method name.
     */
    public static final String GET_DEFS_WITH_EVENT = "getPartiesWithStdCaseEventLocal";
    /**
     * Is event for case method name.
     */
    public static final String IS_EVENT_FOR_CASE = "isEventForCaseLocal";
    /**
     * Get case event case type details list method name.
     */
    public static final String GET_CASE_EVENT_CASE_TYPE_DETAILS_LIST = "getCaseEventCaseTypeDetailsListLocal";
    /**
     * Get pre req event list method name.
     */
    public static final String GET_PRE_REQ_EVENT_LIST = "getPreReqEventListLocal";
    /**
     * Get standard event method name.
     */
    public static final String GET_STANDARD_EVENT = "getStandardEventLocal";
    /**
     * Mark last case event deleted method name.
     */
    public static final String MARK_LAST_CASE_EVENT_DELETED_METHOD = "markLastCaseEventDeletedLocal";
    /**
     * Get case event instigators method name.
     */
    public static final String GET_CASE_EVENT_INSTIGATORS = "getCaseEventInstigatorsLocal";
    /**
     * Update case event with warrant id for ae event method name.
     */
    public static final String UPDATE_CASE_EVENT_WITH_WARRANT_ID_FOR_AE_EVENT =
            "updateCaseEventWithWarrantIdForAeEventLocal";
    /**
     * Get list of case statuses excluded for specified event.
     */
    public static final String GET_PRE_REQ_NOT_CASE_STATUS_LIST = "getPreReqNotCaseStatusListLocal";

    /** Get a list of case parties with standard event already recorded against them. */
    public static final String GET_DISTINCT_PARTIES_WITH_STD_EVENT_LIST = "getDistinctPartiesWithStdEventListLocal";

} // class CaseEventDefs
