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
package uk.gov.dca.utils.perf;

/**
 * Created by David Turner. User: Administrator Date: 04-Feb-2009 Time: 14:22:43 SLA Times
 */
public interface ISLA
{
    
    /** The Constant LOGIN. */
    public static final int LOGIN = 6; // CSF 25 Logon
    
    /** The Constant NAV_TO_MENU_SCREEN. */
    public static final int NAV_TO_MENU_SCREEN = 6; // CSF 25 Logon
    
    /** The Constant MAINTAIN_CASE_LOAD_EMPTY_MAINTAIN_CASE_SCREEN. */
    public static final int MAINTAIN_CASE_LOAD_EMPTY_MAINTAIN_CASE_SCREEN = 6; // CSF 25 Logon

    /** The Constant MAINTAIN_CASE_PLING_CREATE_NEW_PRIVATE_CASE. */
    public static final int MAINTAIN_CASE_PLING_CREATE_NEW_PRIVATE_CASE = 6; // CSF 19 Create Case enter P!
    
    /** The Constant MAINTAIN_CASE_INFO_POPUP_ACKNOWLEDGE. */
    public static final int MAINTAIN_CASE_INFO_POPUP_ACKNOWLEDGE = 6; // CSF 19 Create Case
    
    /** The Constant MAINTAIN_CASE_DISPLAY_APP_TYPE_LOV. */
    public static final int MAINTAIN_CASE_DISPLAY_APP_TYPE_LOV = 6; // CSF 19 Create Case
    
    /** The Constant MAINTAIN_CASE_SELECT_APP_TYPE. */
    public static final int MAINTAIN_CASE_SELECT_APP_TYPE = 6; // CSF 19 Create Case
    
    /** The Constant MAINTAIN_CASE_RAISE_CASE_DETAILS_DYNAMIC_PANEL. */
    public static final int MAINTAIN_CASE_RAISE_CASE_DETAILS_DYNAMIC_PANEL = 6; // CSF 19 Create Case
    
    /** The Constant MAINTAIN_CASE_PERSIST_NEW_CASE_TO_MAINTAIN_OUTPUTS. */
    public static final int MAINTAIN_CASE_PERSIST_NEW_CASE_TO_MAINTAIN_OUTPUTS = 12; // CSF 19 Create Case
    
    /** The Constant MAINTAIN_CASE_PRE_PERSIST_CASE_SAVE_PROCESS. */
    public static final int MAINTAIN_CASE_PRE_PERSIST_CASE_SAVE_PROCESS = 10; // CSF 19 Create Case - when you click
                                                                              // save and a pop up appears with auto
                                                                              /** The Constant MAINTAIN_OUTPUTS_NAV_MAINTAIN_CASE. */
                                                                              // event options etc..
    public static final int MAINTAIN_OUTPUTS_NAV_MAINTAIN_CASE = 12; // CSF 19 Create Case

    /** The Constant MAINTAIN_CASE_ADD_ROLE_TYPE. */
    public static final int MAINTAIN_CASE_ADD_ROLE_TYPE = 6; // CSF 20 Create Role
    
    /** The Constant MAINTAIN_CASE_RAISE_ROLE_DETAILS_DYNAMIC_PANEL. */
    public static final int MAINTAIN_CASE_RAISE_ROLE_DETAILS_DYNAMIC_PANEL = 6; // CSF 20 Create Role
    
    /** The Constant MAINTAIN_CASE_RELATIONSHIP_TO_CHILD_LOV. */
    public static final int MAINTAIN_CASE_RELATIONSHIP_TO_CHILD_LOV = 6; // CSF 20 Create Role
    
    /** The Constant MAINTAIN_CASE_ROLE_DETAILS_CONFIRM. */
    public static final int MAINTAIN_CASE_ROLE_DETAILS_CONFIRM = 6; // CSF 20 Create Role
    
    /** The Constant MAINTAIN_CASE_CHILD_RESIDING_WITH_LOV. */
    public static final int MAINTAIN_CASE_CHILD_RESIDING_WITH_LOV = 6; // CSF 20 Create Role

    /** The Constant MANAGE_OUTPUTS_RAISE_FCKEDITOR. */
    public static final int MANAGE_OUTPUTS_RAISE_FCKEDITOR = 20; // CSF 8 Manage Outputs
    
    /** The Constant MANAGE_OUTPUTS_PREVIEW_PDF. */
    public static final int MANAGE_OUTPUTS_PREVIEW_PDF = 20; // CSF 8 Manage Outputs
    
    /** The Constant MANAGE_OUTPUTS_CLOSE_PDF. */
    public static final int MANAGE_OUTPUTS_CLOSE_PDF = 6; // CSF 8 Manage Outputs
    
    /** The Constant MANAGE_OUTPUTS_CLOSE_FCKEDITOR. */
    public static final int MANAGE_OUTPUTS_CLOSE_FCKEDITOR = 10; // CSF 8 Manage Outputs

    /** The Constant MAINTAIN_OBLIGATIONS_LOAD_SCREEN. */
    public static final int MAINTAIN_OBLIGATIONS_LOAD_SCREEN = 10; // CSF 7 Maintain Obligations

    /** The Constant MAINTAIN_OBLIGATIONS_RAISE_OBLIGATION_TYPE_LOV. */
    public static final int MAINTAIN_OBLIGATIONS_RAISE_OBLIGATION_TYPE_LOV = 6; // CSF 11 Maintain Obligations
    
    /** The Constant MAINTAIN_OBLIGATIONS_SELECT_FROM_OBTYPE_LOV. */
    public static final int MAINTAIN_OBLIGATIONS_SELECT_FROM_OBTYPE_LOV = 6; // CSF 11 Maintain Obligations
    
    /** The Constant MAINTAIN_OBLIGATIONS_ADD_OBLIGATION. */
    public static final int MAINTAIN_OBLIGATIONS_ADD_OBLIGATION = 6; // CSF 11 Maintain Obligations
    
    /** The Constant MAINTAIN_OBLIGATIONS_SAVE_SCREEN. */
    public static final int MAINTAIN_OBLIGATIONS_SAVE_SCREEN = 6; // CSF 11 Maintain Obligations

    /** The Constant MAINTAIN_OBLIGATIONS_MODIFY_SAVE_OBLIGATION. */
    public static final int MAINTAIN_OBLIGATIONS_MODIFY_SAVE_OBLIGATION = 10; // CSF 14 Maintain Obligations

    /** The Constant MAINTAIN_OBLIGATIONS_REMOVE_OBLIGATION. */
    public static final int MAINTAIN_OBLIGATIONS_REMOVE_OBLIGATION = 6; // CSF 10 Maintain Obligations
    
    /** The Constant MAINTAIN_OBLIGATIONS_SAVE_REMOVAL. */
    public static final int MAINTAIN_OBLIGATIONS_SAVE_REMOVAL = 6; // CSF 10 Maintain Obligations
    
    /** The Constant MAINTAIN_OBLIGATIONS_CLOSE_SCREEN. */
    public static final int MAINTAIN_OBLIGATIONS_CLOSE_SCREEN = 10; // CSF 10 Maintain Obligations

    /** The Constant MAINTAIN_CASE_RETRIEVE_CASE_FULL_CASE_NUMBER. */
    public static final int MAINTAIN_CASE_RETRIEVE_CASE_FULL_CASE_NUMBER = 6; // CSF 1 Manage Case
    
    /** The Constant MAINTAIN_CASE_RETRIEVE_CASE_PARTIAL_CASE_NUMBER. */
    public static final int MAINTAIN_CASE_RETRIEVE_CASE_PARTIAL_CASE_NUMBER = 10; // CSF 1 Manage Case

    /** The Constant MAINTAIN_CASE_MODIFY_SAVE. */
    public static final int MAINTAIN_CASE_MODIFY_SAVE = 10; // CSF 17 Manage Case

    /** The Constant MAINTAIN_CASE_REMOVE_ROLE. */
    public static final int MAINTAIN_CASE_REMOVE_ROLE = 6; // CSF 24 Manage Case
    
    /** The Constant MAINTAIN_CASE_CONFIRM_ROLE_REMOVAL. */
    public static final int MAINTAIN_CASE_CONFIRM_ROLE_REMOVAL = 6; // CSF 24 Manage Case
    
    /** The Constant MAINTAIN_CASE_PERSIST_ROLE_REMOVAL. */
    public static final int MAINTAIN_CASE_PERSIST_ROLE_REMOVAL = 10; // CSF 24 Manage Case
    
    /** The Constant MAINTAIN_CASE_AUDIT. */
    public static final int MAINTAIN_CASE_AUDIT = 6; // CSF 24 Manage Case

    /** The Constant MAINTAIN_EVENTS_BY_CASE_LOAD_SCREEN_MAIN_MENU. */
    public static final int MAINTAIN_EVENTS_BY_CASE_LOAD_SCREEN_MAIN_MENU = 6; // CSF 5 Manage Events By Case
    
    /** The Constant MAINTAIN_EVENTS_BY_CASE_LOAD_SCREEN_WITH_CASE. */
    public static final int MAINTAIN_EVENTS_BY_CASE_LOAD_SCREEN_WITH_CASE = 10; // CSF 5 Manage Events By Case
    
    /** The Constant MAINTAIN_EVENTS_BY_CASE_CLOSE_SCREEN. */
    public static final int MAINTAIN_EVENTS_BY_CASE_CLOSE_SCREEN = 6; // CSF 5 Manage Events By Case

    /** The Constant MAINTAIN_EVENTS_BY_CASE_RAISE_BLANK_EVENT_DETAIL. */
    public static final int MAINTAIN_EVENTS_BY_CASE_RAISE_BLANK_EVENT_DETAIL = 10; // CSF 2 Manage Events By Case
    
    /** The Constant EVENT_SAVE_NON_OUTPUT_EVENT. */
    public static final int EVENT_SAVE_NON_OUTPUT_EVENT = 6; // CSF 2 Events

    /** The Constant MAINTAIN_EVENTS_BY_CASE_RAISE_EVENT_LOV. */
    public static final int MAINTAIN_EVENTS_BY_CASE_RAISE_EVENT_LOV = 6; // CSF 4 Manage Events By Case
    
    /** The Constant MAINTAIN_EVENTS_BY_CASE_SELECT_EVENT_FROM_LOV. */
    public static final int MAINTAIN_EVENTS_BY_CASE_SELECT_EVENT_FROM_LOV = 6; // CSF 4 Manage Events By Case
    
    /** The Constant EVENT_SAVE_OUTPUT_EVENT. */
    public static final int EVENT_SAVE_OUTPUT_EVENT = 12; // CSF 4 Event

    /** The Constant MAINTAIN_EVENTS_BY_CASE_RAISE_SECONDARY_SEARCH. */
    public static final int MAINTAIN_EVENTS_BY_CASE_RAISE_SECONDARY_SEARCH = 10; // CSF 12 Manage Outputs
    
    /** The Constant MAINTAIN_EVENTS_BY_CASE_SECONDARY_SEARCH_PARTIAL_NAME. */
    public static final int MAINTAIN_EVENTS_BY_CASE_SECONDARY_SEARCH_PARTIAL_NAME = 10; // CSF 12 Manage Outputs
    
    /** The Constant MAINTAIN_EVENTS_BY_CASE_LOAD_CASE_FROM_SECONDARY_SEARCH. */
    public static final int MAINTAIN_EVENTS_BY_CASE_LOAD_CASE_FROM_SECONDARY_SEARCH = 10; // CSF 12 Manage Outputs

    /** The Constant MAINTAIN_EVENTS_BY_EVENT_LOAD_SCREEN. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_LOAD_SCREEN = 6; // CSF 16 Manage Events By Event
    
    /** The Constant MAINTAIN_EVENTS_BY_EVENT_SEARCH_EVENT. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_SEARCH_EVENT = 10; // CSF 16 Manage Events By Event
    
    /** The Constant MAINTAIN_EVENTS_BY_EVENT_PAGINATED_SELECTION. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_PAGINATED_SELECTION = 6; // CSF 16 Manage Events By Event
    
    /** The Constant MAINTAIN_EVENTS_BY_EVENT_RAISE_FILTER_POPUP. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_RAISE_FILTER_POPUP = 6; // CSF 16 Manage Events By Event
    
    /** The Constant MAINTAIN_EVENTS_BY_EVENT_APPLY_FILTER_POPUP. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_APPLY_FILTER_POPUP = 10; // CSF 16 Manage Events By Event
    
    /** The Constant MAINTAIN_EVENTS_BY_EVENT_CLOSE. */
    public static final int MAINTAIN_EVENTS_BY_EVENT_CLOSE = 6; // CSF 16 Manage Events By Event

    /** The Constant PRODUCE_GENERAL_REPORTS_OPEN_SCREEN_MAIN_MENU. */
    public static final int PRODUCE_GENERAL_REPORTS_OPEN_SCREEN_MAIN_MENU = 6; // CSF 17/23 Produce General Reports
    
    /** The Constant PRODUCE_GENERAL_REPORTS_CLICK_BMS_TAB. */
    public static final int PRODUCE_GENERAL_REPORTS_CLICK_BMS_TAB = 6; // CSF 17/23 Produce General Reports
    
    /** The Constant PRODUCE_GENERAL_REPORTS_GENERATE_BMS_REPORT. */
    public static final int PRODUCE_GENERAL_REPORTS_GENERATE_BMS_REPORT = 900; // CSF 17/23 Produce General Reports

    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_EVENTS_BY_CASE. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_EVENTS_BY_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_PARTY. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_PARTY = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_LINKS. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_MAINTAIN_LINKS = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_WFT. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_WFT = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_HEARINGS. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_CASE_TO_HEARINGS = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_PARTY_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_PARTY_TO_MAINTAIN_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_LINKS. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_LINKS = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_PARTIES. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_PARTIES = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_WFT. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_EVENTS_BY_CASE_TO_WFT = 10; // Navigation
    
    /** The Constant NAVIGATE_WITH_CASE_MAINTAIN_LINKS_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_WITH_CASE_MAINTAIN_LINKS_TO_MAINTAIN_CASE = 10; // Navigation

    /** The Constant NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_EVENTS_BY_CASE. */
    public static final int NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_EVENTS_BY_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_PARTY. */
    public static final int NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_PARTY = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_PARTY_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_MAINTAIN_PARTY_TO_MAINTAIN_CASE = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_LINKS. */
    public static final int NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_LINKS = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_PARTIES. */
    public static final int NAVIGATE_MAINTAIN_EVENTS_BY_CASE_TO_MAINTAIN_PARTIES = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_LINKS. */
    public static final int NAVIGATE_MAINTAIN_CASE_TO_MAINTAIN_LINKS = 10; // Navigation
    
    /** The Constant NAVIGATE_MAINTAIN_LINKS_TO_MAINTAIN_CASE. */
    public static final int NAVIGATE_MAINTAIN_LINKS_TO_MAINTAIN_CASE = 10; // Navigation
}
