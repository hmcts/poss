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
package uk.gov.dca.utils.common;

/**
 * Created by Chris Vincent 10-Jun-2009
 * Interface to ensure all global arguments are available across the test universe.
 */
public interface ITestProperties
{
    
    /** The Constant SHOW_KEYS. */
    // Menu dropdown options
    public static final int SHOW_KEYS = 1;
    
    /** The Constant LOGOUT. */
    public static final int LOGOUT = 2;
    
    /** The Constant EXIT. */
    public static final int EXIT = 3;

    /** The Constant AUDIT_OPTION_MENU. */
    // Audit constants
    public static final String AUDIT_OPTION_MENU = "NavBar_AuditButton";
    
    /** The Constant AUDIT_PANEL. */
    public static final String AUDIT_PANEL = "Audit_PanelSelector";
    
    /** The Constant AUDIT_CLOSE_BUTTON. */
    public static final String AUDIT_CLOSE_BUTTON = "AuditPopup_CloseButton";

    /** The Constant HOMEPAGE. */
    // CaseMan Home Page
    public static final String HOMEPAGE =
            "/caseman/screens/caseman_menu/index.html?logging=0&wpPRTwp=true&wpDBGwp=false&wpPRTora=true";

    /** The Constant STANDARD_DIALOG_POPUP. */
    // Standard Framework Dialog constants
    public static final String STANDARD_DIALOG_POPUP = "fw_standard_dialog_0";
    
    /** The Constant STANDARD_DIALOG_POPUP_0. */
    public static final String STANDARD_DIALOG_POPUP_0 = "fw_standard_dialog_0_popup";
    
    /** The Constant STANDARD_DIALOG_POPUP_OPTIONS. */
    public static final String STANDARD_DIALOG_POPUP_OPTIONS = "Popup_Options";

    /** The Constant FRAMEWORK_LOV_SUBFORM_GRID. */
    // Identifier of the filtered grid in an LOV Subform popup
    public static final String FRAMEWORK_LOV_SUBFORM_GRID = "frameworkLOVSubFormGrid";

    /** The Constant LOV_SUBMIT_BUTTON. */
    // Identifier of the submit button in the LOV Subform popup
    public static final String LOV_SUBMIT_BUTTON = "submit_button";

    /** The Constant STATUS_BAR_NO_MATCHES_FOUND. */
    // Common status bar constants
    public static final String STATUS_BAR_NO_MATCHES_FOUND = "No matches found";
    
    /** The Constant STATUS_BAR_OK. */
    public static final String STATUS_BAR_OK = "OK";

    /** The Constant WARNING_SCREEN_TITLE. */
    // Login process constants
    public static final String WARNING_SCREEN_TITLE = "WARNING";
    
    /** The Constant WARNING_SCREEN_CONTINUE. */
    public static final String WARNING_SCREEN_CONTINUE = "Status_ContinueButton";
    
    /** The Constant MAIN_MENU_TITLE. */
    public static final String MAIN_MENU_TITLE = "Welcome to CaseMan";

    /** The Constant VARIABLE_DATA_SAVE_BUTTON. */
    // Word Processing constants
    public static final String VARIABLE_DATA_SAVE_BUTTON = "Status_SaveButton";
    
    /** The Constant FCK_EDITOR_TITLE. */
    public static final String FCK_EDITOR_TITLE = "CaseMan Word Processor";
    
    /** The Constant FCK_EDITOR_OUTPUT_FINAL. */
    public static final String FCK_EDITOR_OUTPUT_FINAL = "OutputFinal";
    
    /** The Constant FCK_EDITOR_OK_BUTTON. */
    public static final String FCK_EDITOR_OK_BUTTON = "Status_OKBtn";
    
    /** The Constant FCK_EDITOR_CANCEL_BUTTON. */
    public static final String FCK_EDITOR_CANCEL_BUTTON = "Status_CancelBtn";

    /** The Constant BMS_TASK_AGE_5. */
    // BMS Task Age constants
    public static final String BMS_TASK_AGE_5 = "0-5 Days";
    
    /** The Constant BMS_TASK_AGE_6. */
    public static final String BMS_TASK_AGE_6 = "6-10 Days";
    
    /** The Constant BMS_TASK_AGE_10. */
    public static final String BMS_TASK_AGE_10 = ">10 Days";

    /** The Constant FIELD_STATUS_READONLY. */
    // Field status constants
    public static final int FIELD_STATUS_READONLY = 0;
    
    /** The Constant FIELD_STATUS_ENABLED. */
    public static final int FIELD_STATUS_ENABLED = 1;
    
    /** The Constant FIELD_STATUS_MANDATORY. */
    public static final int FIELD_STATUS_MANDATORY = 2;
    
    /** The Constant FIELD_STATUS_VALID. */
    public static final int FIELD_STATUS_VALID = 3;
}
