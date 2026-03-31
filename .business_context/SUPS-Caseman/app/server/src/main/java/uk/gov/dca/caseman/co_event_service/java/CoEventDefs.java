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
 * Created on 12 July 2005
 * 
 * Chris Hutt
 * 
 * Constants associated with CO Events
 * 
 * Change History
 * --------------
 * 
 * 12/06/2006 Chris Hutt TD3466: updateCoEventWarrantId added
 * 
 * 02/08/2006 Chris Hutt getCoEventIssueDetail added. Needed as a consequnce of implementing pagination.
 * 
 * @author gzyysf
 */
public class CoEventDefs
{

    /**
     * CO event service name.
     */
    public static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";
    /**
     * Is event for co local method name.
     */
    public static final String IS_EVENT_FOR_CO = "isEventForCoLocal";
    /**
     * Is previous order served local method name.
     */
    public static final String IS_PREVIOUS_ORDER_SERVED = "isPreviousOrderServedLocal";
    /**
     * Update co event row local method name.
     */
    public static final String UPDATE_CO_EVENT = "updateCoEventRowLocal";
    /**
     * Is response filed method name.
     */
    public static final String IS_RESPONSE_FILED = "isResponseFiledLocal";
    /**
     * Get pre req co event local method name.
     */
    public static final String GET_PRE_REQ_CO_EVENT = "getPreReqCoEventLocal";
    /**
     * Is dividend declared method name.
     */
    public static final String IS_DIVIDEND_DECLARED = "isDividendDeclaredLocal";
    /**
     * Is money in court method name.
     */
    public static final String IS_MONEY_IN_COURT = "isMoneyInCourtLocal";
    /**
     * Get money in court method name.
     */
    public static final String GET_MONEY_IN_COURT = "getMoneyInCourtLocal";
    /**
     * Get co event lov list method name.
     */
    public static final String GET_CO_EVENT_LOV_LIST = "getCoEventLovListLocal";
    /**
     * Get valid co status list method name.
     */
    public static final String GET_VALID_CO_STATUS_LIST = "getValidCoStatusListLocal";
    /**
     * Get valid debt status list method name.
     */
    public static final String GET_VALID_DEBT_STATUS_LIST = "getValidDebtStatusListLocal";
    /**
     * Get pre req event list method name.
     */
    public static final String GET_PRE_REQ_EVENT_LIST = "getPreReqEventListLocal";
    /**
     * Insert co event method name.
     */
    public static final String INSERT_CO_EVENT = "addCoEventLocal";
    /**
     * Insert co event auto method name.
     */
    public static final String INSERT_CO_EVENT_AUTO = "insertCoEventAutoLocal";
    /**
     * Update co debt status method name.
     */
    public static final String UPDATE_CO_DEBT_STATUS = "updateCoDebtStatusLocal";
    /**
     * Get changed co event list method name.
     */
    public static final String GET_CHANGED_CO_EVENT_LIST_METHOD = "getChangedCoEventListLocal";
    /**
     * Update co event warrant id method name.
     */
    public static final String UPDATE_CO_EVENT_WARRANT_ID = "updateCoEventWarrantIdLocal";

    /**
     * get Issue details for Co Events.
     */
    public static final String GET_CO_EVENT_ISSUE_DETAIL = "getCoEventIssueDetailLocal";

    /**
     * No update constant.
     */
    public static final int NO_EDIT = 0; // no update
    /**
     * Updates present constant.
     */
    public static final int UPDATES = 1; // updates
    /**
     * Marked as being in error constant.
     */
    public static final int MARKED_IN_ERROR = 2; // marked as being in error
    /**
     * Error flag removed constant.
     */
    public static final int UNMARKED_IN_ERROR = 4; // error flag removed
    /**
     * Status change constant.
     */
    public static final int STATUS_CHANGE = 8; // service status cahnged to not served
} // class CoEventDefs
