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
 * Created on 21 June 2005.
 *
 * @author Chris Hutt
 * 
 *         Constants associated with AE Events
 * 
 *         Change History
 *         --------------
 * 
 *         05/06/2006 Chris Hutt TD3445: updateAeEventWarrantId added
 * 
 *         02/08/2006 Chris Hutt getAeEventIssueDetail added. Needed as a consequnce of implementing pagination.
 */
public class AeEventDefs
{

    /**
     * AE event service name.
     */
    public static final String AE_EVENT_SERVICE = "ejb/AeEventServiceLocal";

    /**
     * Is event for ae local method name.
     */
    public static final String IS_EVENT_FOR_AE = "isEventForAeLocal";
    /**
     * Get pre req event for ae local method name.
     */
    public static final String GET_PRE_REQ_EVENT_FOR_AE = "getPreReqEventForAeLocal";
    /**
     * Get pre req ae event local method name.
     */
    public static final String GET_PRE_REQ_AE_EVENT = "getPreReqAeEventLocal";
    /**
     * Get hearings local method name.
     */
    public static final String GET_HEARINGS = "getHearingsLocal";
    /**
     * Is previous order local method name.
     */
    public static final String IS_PREVIOUS_ORDER = "isPreviousOrderLocal";
    /**
     * Get ae event lov list local method name.
     */
    public static final String GET_AE_EVENT_LOV_LIST = "getAeEventLovListLocal";
    /**
     * Get ae event ae type list local method name.
     */
    public static final String GET_AE_EVENT_AE_TYPE_LIST = "getAeEventAeTypeListLocal";
    /**
     * Update ae event row local method name.
     */
    public static final String UPD_AE_EVENT_ROW = "updateAeEventRowLocal";
    /**
     * Is obsolete event local method name.
     */
    public static final String IS_OBSOLETE_EVENT = "isObsoleteEventLocal";
    /**
     * Insert ae event row auto local method name.
     */
    public static final String INSERT_AE_EVENT_ROW_AUTO = "insertAeEventRowAutoLocal";
    /**
     * Get ae event bms local method name.
     */
    public static final String GET_AE_EVENT_BMS = "getAeEventBMSLocal";
    /**
     * Get changed ae event list local method name.
     */
    public static final String GET_CHANGED_AE_EVENT_LIST_METHOD = "getChangedAeEventListLocal";
    /**
     * Update ae event warrant id local method name.
     */
    public static final String UPDATE_AE_EVENT_WARRANT_ID = "updateAeEventWarrantIdLocal";
    /**
     * get Issue details for Ae Events.
     */
    public static final String GET_AE_EVENT_ISSUE_DETAIL = "getAeEventIssueDetailLocal";

}
