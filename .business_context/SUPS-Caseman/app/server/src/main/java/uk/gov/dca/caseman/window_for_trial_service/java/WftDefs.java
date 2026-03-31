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
package uk.gov.dca.caseman.window_for_trial_service.java;

/**
 * Created on 02-Mar-2005.
 *
 * @author gzyysf
 */
public final class WftDefs
{

    /**
     * Window for trial service name.
     */
    public static final String WFT_SERVICE = "ejb/WindowForTrialServiceLocal";
    /**
     * Get case wfts method name.
     */
    public static final String GET_CASE_WFTS = "getCaseWftsLocal";
    /**
     * Get wft status method name.
     */
    public static final String GET_WFT_STATUS = "getWftStatusLocal";
    /**
     * Add wft method name.
     */
    public static final String ADD_WFT = "addWftLocalMethodLocal";
    /**
     * Update wft local method name.
     */
    public static final String UPD_WFT = "updateWftLocalMethodLocal";
    /**
     * Get wft method name.
     */
    public static final String GET_WFT = "getWftLocal";
    /**
     * Maintain wft method name.
     */
    public static final String MAINTAIN_WFT = "maintainWftLocalMethodLocal";
    /**
     * Get max wft method name.
     */
    public static final String GET_MAX_WFT = "getMaxCaseWftIdLocal";
    /**
     * Get wft hearing types method name.
     */
    public static final String GET_WFT_HEARING_TYPES = "getWftHearingTypeListLocal";
    /**
     * Delete wft exclusions method name.
     */
    public static final String DELETE_WFT_EXCLUSIONS_METHOD = "deleteWftExclusionsLocal";
    /**
     * Insert wft exclusion method name.
     */
    public static final String INSERT_WFT_EXCLUSION_METHOD = "insertWftExclusionLocal";
    /**
     * Case number parameter xpath.
     */
    public static final String CASE_NUMBER_PARAM_XPATH = "params/param[@name='caseNumber']";
    /**
     * Windows for trial xpath.
     */
    public static final String WFT_XPATH = "//WindowsForTrial/WindowForTrial";
    /**
     * Wft date excluded xpath.
     */
    public static final String WFT_DATE_EXCLUDED_XPATH = "//WindowsForTrial/WindowForTrial/Dates/Date";
    /**
     * Event id parameter xpath.
     */
    public static final String EVENT_ID_PARAM_XPATH = "params/param[@name='eventId']";
    /**
     * Wft case number xpath.
     */
    public static final String WFT_CASE_NUMBER_XPATH = "/WindowsForTrial/WindowForTrial/CaseNumber";
    /**
     * Wft max wft id xpath.
     */
    public static final String WFT_MAXWFTID_XPATH = "/Case/MaxWftId";
    /**
     * Wft case event id xpath.
     */
    public static final String WFT_CASEEVENTID_XPATH = "//CaseEvent/EventId";
    /**
     * Wft case event seq xpath.
     */
    public static final String WFT_CASEEVENTSEQ_XPATH = "//CaseEvent/CaseEventSeq";
    /**
     * Wft case event xpath.
     */
    public static final String WFT_CASEEVENT_XPATH = "//CaseEvent";
    /**
     * Boolean TRUE string.
     */
    public static final String TRUE = "true";
    /**
     * Boolean FALSE string.
     */
    public static final String FALSE = "false";

    /**
     * Prevent object construction outside of this class.
     */
    private WftDefs ()
    {
        // empty
    }

}
