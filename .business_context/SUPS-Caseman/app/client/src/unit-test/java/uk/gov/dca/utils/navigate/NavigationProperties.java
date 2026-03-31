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
package uk.gov.dca.utils.navigate;

/**
 * Created by Chris Vincent 09-Jun-2009
 * Interface containing navigation constants for navigating the CaseMan main menu. All
 * menus and screens are in the order displayed in the CaseMan main menu so if that changes,
 * this class will need amending.
 */
public interface NavigationProperties
{
    
    /** The Constant MAINMENU_RESET. */
    // First item in the grid, couble clicking returns the grid to main menus (no sub menus displayed)
    public static final int MAINMENU_RESET = 1;

    /** The Constant MAINMENU_MAINTAIN_USER_PATH. */
    // Maintain User Screen
    public static final int MAINMENU_MAINTAIN_USER_PATH = 2;

    /** The Constant MAINMENU_CREATE_CASE_PATH. */
    // Case Maintenance Menu
    public static final int[] MAINMENU_CREATE_CASE_PATH = {3, 4};
    
    /** The Constant MAINMENU_CASE_EVENTS_PATH. */
    public static final int[] MAINMENU_CASE_EVENTS_PATH = {3, 5};
    
    /** The Constant MAINMENU_RUN_ORDER_PRINTING_PATH. */
    public static final int[] MAINMENU_RUN_ORDER_PRINTING_PATH = {3, 6};
    
    /** The Constant MAINMENU_DJ_PRINTOUT_PATH. */
    public static final int[] MAINMENU_DJ_PRINTOUT_PATH = {3, 7};

    /** The Constant MAINMENU_HOME_WARRANTS_PATH. */
    // Warrant Maintenance Menu
    public static final int[] MAINMENU_HOME_WARRANTS_PATH = {4, 5};
    
    /** The Constant MAINMENU_FOREIGN_WARRANTS_PATH. */
    public static final int[] MAINMENU_FOREIGN_WARRANTS_PATH = {4, 6};
    
    /** The Constant MAINMENU_MAINTAIN_WARRANTS_PATH. */
    public static final int[] MAINMENU_MAINTAIN_WARRANTS_PATH = {4, 7};
    
    /** The Constant MAINMENU_REISSUE_WARRANTS_PATH. */
    public static final int[] MAINMENU_REISSUE_WARRANTS_PATH = {4, 8};
    
    /** The Constant MAINMENU_WARRANT_RETURNS_PATH. */
    public static final int[] MAINMENU_WARRANT_RETURNS_PATH = {4, 9};
    
    /** The Constant MAINMENU_WARRANT_RET_CODES_PATH. */
    public static final int[] MAINMENU_WARRANT_RET_CODES_PATH = {4, 10};

    /** The Constant MAINMENU_WARRANT_DAILY_FEE_SHEET_PATH. */
    // Warrant Maintenance Menu > Warrant Reports > Warrant Creation Reports Menu
    public static final int[] MAINMENU_WARRANT_DAILY_FEE_SHEET_PATH = {4, 11, 12, 13};
    
    /** The Constant MAINMENU_PRINT_WARRANTS_EXECUTION_PATH. */
    public static final int[] MAINMENU_PRINT_WARRANTS_EXECUTION_PATH = {4, 11, 12, 14};
    
    /** The Constant MAINMENU_N326_PATH. */
    public static final int[] MAINMENU_N326_PATH = {4, 11, 12, 15};
    
    /** The Constant MAINMENU_NOTICE_ISSUE_CLAIMANT_PATH. */
    public static final int[] MAINMENU_NOTICE_ISSUE_CLAIMANT_PATH = {4, 11, 12, 16};
    
    /** The Constant MAINMENU_NOTICE_REISSUE_CLAIMANT_PATH. */
    public static final int[] MAINMENU_NOTICE_REISSUE_CLAIMANT_PATH = {4, 11, 12, 17};
    
    /** The Constant MAINMENU_ACCUMULATIVE_WARRANT_FEES_PATH. */
    public static final int[] MAINMENU_ACCUMULATIVE_WARRANT_FEES_PATH = {4, 11, 12, 18};
    
    /** The Constant MAINMENU_REPRINT_WARRANTS_EXECUTION_PATH. */
    public static final int[] MAINMENU_REPRINT_WARRANTS_EXECUTION_PATH = {4, 11, 12, 19};
    
    /** The Constant MAINMENU_BAILIFF_BOOK_REPORT_PATH. */
    public static final int[] MAINMENU_BAILIFF_BOOK_REPORT_PATH = {4, 11, 12, 20};
    
    /** The Constant MAINMENU_UNALLOCATED_WARRANT_REPORT_PATH. */
    public static final int[] MAINMENU_UNALLOCATED_WARRANT_REPORT_PATH = {4, 11, 12, 21};

    /** The Constant MAINMENU_OUTSTANDING_WARRANT_LIST_PATH. */
    // Warrant Maintenance Menu > Warrant Reports > Warrant Maintenance Reports Menu
    public static final int[] MAINMENU_OUTSTANDING_WARRANT_LIST_PATH = {4, 11, 13, 14};
    
    /** The Constant MAINMENU_LIST_REPRINTED_WARRANTS_PATH. */
    public static final int[] MAINMENU_LIST_REPRINTED_WARRANTS_PATH = {4, 11, 13, 15};
    
    /** The Constant MAINMENU_AMENDED_ISSUE_DATE_REPORT_PATH. */
    public static final int[] MAINMENU_AMENDED_ISSUE_DATE_REPORT_PATH = {4, 11, 13, 16};

    /** The Constant MAINMENU_NON_EXECUTION_OF_WARRANT_PATH. */
    // Warrant Maintenance Menu > Warrant Reports > Warrant Returns Reports Menu
    public static final int[] MAINMENU_NON_EXECUTION_OF_WARRANT_PATH = {4, 11, 14, 15};
    
    /** The Constant MAINMENU_INTERIM_REPORT_ON_WARRANT_PATH. */
    public static final int[] MAINMENU_INTERIM_REPORT_ON_WARRANT_PATH = {4, 11, 14, 16};
    
    /** The Constant MAINMENU_RETURN_CODE_LIST_PATH. */
    public static final int[] MAINMENU_RETURN_CODE_LIST_PATH = {4, 11, 14, 17};
    
    /** The Constant MAINMENU_LIST_RETURNS_BY_CODE_PATH. */
    public static final int[] MAINMENU_LIST_RETURNS_BY_CODE_PATH = {4, 11, 14, 18};
    
    /** The Constant MAINMENU_RETURNS_VERIFIED_BY_BAILIFF_PATH. */
    public static final int[] MAINMENU_RETURNS_VERIFIED_BY_BAILIFF_PATH = {4, 11, 14, 19};
    
    /** The Constant MAINMENU_WARRANTS_HELD_BY_HCE_PATH. */
    public static final int[] MAINMENU_WARRANTS_HELD_BY_HCE_PATH = {4, 11, 14, 20};

    /** The Constant MAINMENU_BAILIFF_EFFECTIVENESS_PATH. */
    // Warrant Maintenance Menu > Warrant Reports > Warrant Management Reports Menu
    public static final int[] MAINMENU_BAILIFF_EFFECTIVENESS_PATH = {4, 11, 15, 17};
    
    /** The Constant MAINMENU_SUMMARY_BAILIFF_EFFECTIVENESS_PATH. */
    public static final int[] MAINMENU_SUMMARY_BAILIFF_EFFECTIVENESS_PATH = {4, 11, 15, 18};
    
    /** The Constant MAINMENU_STATISTICS_MODULE_REPORT_PATH. */
    public static final int[] MAINMENU_STATISTICS_MODULE_REPORT_PATH = {4, 11, 15, 19};
    
    /** The Constant MAINMENU_EXECUTED_WARRANTS_REPORT_PATH. */
    public static final int[] MAINMENU_EXECUTED_WARRANTS_REPORT_PATH = {4, 11, 15, 20};

    /** The Constant MAINMENU_VIEW_COURT_DATA_PATH. */
    // Management Menu
    public static final int[] MAINMENU_VIEW_COURT_DATA_PATH = {5, 6};
    
    /** The Constant MAINMENU_LOCAL_CODED_PARTIES_PATH. */
    public static final int[] MAINMENU_LOCAL_CODED_PARTIES_PATH = {5, 7};
    
    /** The Constant MAINMENU_DMS_REPORT_PATH. */
    public static final int[] MAINMENU_DMS_REPORT_PATH = {5, 9};
    
    /** The Constant MAINMENU_HRA_PATH. */
    public static final int[] MAINMENU_HRA_PATH = {5, 10};
    
    /** The Constant MAINMENU_COURT_SECTIONS_PATH. */
    public static final int[] MAINMENU_COURT_SECTIONS_PATH = {5, 11};

    /** The Constant MAINMENU_BMS_COURT_REPORT_PATH. */
    // Management Menu > Statistics Menu
    public static final int[] MAINMENU_BMS_COURT_REPORT_PATH = {5, 8, 9};
    
    /** The Constant MAINMENU_BMS_SECTION_REPORT_PATH. */
    public static final int[] MAINMENU_BMS_SECTION_REPORT_PATH = {5, 8, 10};
    
    /** The Constant MAINMENU_DAILY_MONITORING_REPORT_PATH. */
    public static final int[] MAINMENU_DAILY_MONITORING_REPORT_PATH = {5, 8, 11};
    
    /** The Constant MAINMENU_MEDIATION_STATS_REPORT_PATH. */
    public static final int[] MAINMENU_MEDIATION_STATS_REPORT_PATH = {5, 8, 12};
    
    /** The Constant MAINMENU_MISC_999_REPORT_PATH. */
    public static final int[] MAINMENU_MISC_999_REPORT_PATH = {5, 8, 13};
    
    /** The Constant MAINMENU_POSSESSION_STATS_REPORT_PATH. */
    public static final int[] MAINMENU_POSSESSION_STATS_REPORT_PATH = {5, 8, 14};
    
    /** The Constant MAINMENU_FULL_STATS_MOD_REPORT_PATH. */
    public static final int[] MAINMENU_FULL_STATS_MOD_REPORT_PATH = {5, 8, 15};
    
    /** The Constant MAINMENU_SMALL_CLAIMS_STATS_REPORT_PATH. */
    public static final int[] MAINMENU_SMALL_CLAIMS_STATS_REPORT_PATH = {5, 8, 16};
    
    /** The Constant MAINMENU_FAST_MULTI_TRACK_STATS_REPORT_PATH. */
    public static final int[] MAINMENU_FAST_MULTI_TRACK_STATS_REPORT_PATH = {5, 8, 17};

    /** The Constant MAINMENU_INITIAL_ENQUIRY_PATH. */
    // Data Protection Menu
    public static final int[] MAINMENU_INITIAL_ENQUIRY_PATH = {6, 7};
    
    /** The Constant MAINMENU_FULL_ENQ_CASE_PATH. */
    public static final int[] MAINMENU_FULL_ENQ_CASE_PATH = {6, 8};
    
    /** The Constant MAINMENU_FULL_ENQ_FW_PATH. */
    public static final int[] MAINMENU_FULL_ENQ_FW_PATH = {6, 9};
    
    /** The Constant MAINMENU_FULL_ENQ_CO_PATH. */
    public static final int[] MAINMENU_FULL_ENQ_CO_PATH = {6, 10};

    // Suitors Cash Menu
    /** The Constant MAINMENU_POSTAL_PAYMENTS_PATH. */
    // Suitors Cash Menu > Payment Creation
    public static final int[] MAINMENU_POSTAL_PAYMENTS_PATH = {7, 8, 9};
    
    /** The Constant MAINMENU_BAILIFF_PAYMENTS_PATH. */
    public static final int[] MAINMENU_BAILIFF_PAYMENTS_PATH = {7, 8, 10};
    
    /** The Constant MAINMENU_COUNTER_PAYMENTS_PATH. */
    public static final int[] MAINMENU_COUNTER_PAYMENTS_PATH = {7, 8, 11};
    
    /** The Constant MAINMENU_PASSTHROUGH_PAYMENTS_PATH. */
    public static final int[] MAINMENU_PASSTHROUGH_PAYMENTS_PATH = {7, 8, 12};
    
    /** The Constant MAINMENU_COUNTER_VERIFICATION_REP_PATH. */
    public static final int[] MAINMENU_COUNTER_VERIFICATION_REP_PATH = {7, 8, 13};
    
    /** The Constant MAINMENU_POSTAL_PAYMENT_RECEIPTS_PATH. */
    public static final int[] MAINMENU_POSTAL_PAYMENT_RECEIPTS_PATH = {7, 8, 14};
    
    /** The Constant MAINMENU_PRINT_N335_PATH. */
    public static final int[] MAINMENU_PRINT_N335_PATH = {7, 8, 15};
    
    /** The Constant MAINMENU_PAYMENT_NOTICES_PATH. */
    public static final int[] MAINMENU_PAYMENT_NOTICES_PATH = {7, 8, 16};

    /** The Constant MAINMENU_MAINTAIN_PAYMENTS_PATH. */
    // Suitors Cash Menu > Payment Maintenance
    public static final int[] MAINMENU_MAINTAIN_PAYMENTS_PATH = {7, 9, 10};
    
    /** The Constant MAINMENU_RESOLVE_OVERPAYMENTS_PATH. */
    public static final int[] MAINMENU_RESOLVE_OVERPAYMENTS_PATH = {7, 9, 11};

    /** The Constant MAINMENU_RETENTION_SUMMARY_REP_PATH. */
    // Suitors Cash Menu > Payout
    public static final int[] MAINMENU_RETENTION_SUMMARY_REP_PATH = {7, 10, 11};
    
    /** The Constant MAINMENU_ADHOC_PAYOUT_PATH. */
    public static final int[] MAINMENU_ADHOC_PAYOUT_PATH = {7, 10, 12};
    
    /** The Constant MAINMENU_DIVIDEND_DECLARATION_PATH. */
    public static final int[] MAINMENU_DIVIDEND_DECLARATION_PATH = {7, 10, 13};
    
    /** The Constant MAINMENU_PRE_PAYOUT_LIST_PATH. */
    public static final int[] MAINMENU_PRE_PAYOUT_LIST_PATH = {7, 10, 14};
    
    /** The Constant MAINMENU_PRINT_PAYOUT_PATH. */
    public static final int[] MAINMENU_PRINT_PAYOUT_PATH = {7, 10, 15};

    /** The Constant MAINMENU_RUN_END_OF_DAY_PATH. */
    // Suitors Cash Menu > Suitors Cash Management Menu
    public static final int[] MAINMENU_RUN_END_OF_DAY_PATH = {7, 11, 13};
    
    /** The Constant MAINMENU_DELETE_END_OF_DAY_PATH. */
    public static final int[] MAINMENU_DELETE_END_OF_DAY_PATH = {7, 11, 14};
    
    /** The Constant MAINMENU_DAILY_CONTROL_SHEET_PATH. */
    public static final int[] MAINMENU_DAILY_CONTROL_SHEET_PATH = {7, 11, 15};
    
    /** The Constant MAINMENU_PAYMENT_SUMMARY_REP_PATH. */
    public static final int[] MAINMENU_PAYMENT_SUMMARY_REP_PATH = {7, 11, 16};
    
    /** The Constant MAINMENU_END_ACCOUNTING_PERIOD_PATH. */
    public static final int[] MAINMENU_END_ACCOUNTING_PERIOD_PATH = {7, 11, 17};
    
    /** The Constant MAINMENU_PRINT_RD_CHEQUES_PATH. */
    public static final int[] MAINMENU_PRINT_RD_CHEQUES_PATH = {7, 11, 18};
    
    /** The Constant MAINMENU_REMOVE_PAYMENT_LOCK_PATH. */
    public static final int[] MAINMENU_REMOVE_PAYMENT_LOCK_PATH = {7, 11, 19};

    /** The Constant MAINMENU_COUNTER_VERIFICATION_BY_USER_PATH. */
    // Suitors Cash Menu > Suitors Cash Management Menu > Print and Reprint Cash Reports Menu
    public static final int[] MAINMENU_COUNTER_VERIFICATION_BY_USER_PATH = {7, 11, 12, 13};
    
    /** The Constant MAINMENU_PRINT_RECEIPTS_BY_USER_PATH. */
    public static final int[] MAINMENU_PRINT_RECEIPTS_BY_USER_PATH = {7, 11, 12, 14};
    
    /** The Constant MAINMENU_REPRINT_REPORTS_PATH. */
    public static final int[] MAINMENU_REPRINT_REPORTS_PATH = {7, 11, 12, 15};

    /** The Constant MAINMENU_CREATE_AE_PATH. */
    // Attachment of Earnings Menu
    public static final int[] MAINMENU_CREATE_AE_PATH = {8, 9};
    
    /** The Constant MAINMENU_AE_EVENTS_PATH. */
    public static final int[] MAINMENU_AE_EVENTS_PATH = {8, 10};
    
    /** The Constant MAINMENU_AE_SOD_PATH. */
    public static final int[] MAINMENU_AE_SOD_PATH = {8, 12};
    
    /** The Constant MAINMENU_AE_OUTSTANDING_BAILIFF_PATH. */
    public static final int[] MAINMENU_AE_OUTSTANDING_BAILIFF_PATH = {8, 13};

    /** The Constant MAINMENU_AE_DAILY_FEE_SHEET_PATH. */
    // Attachment of Earnings Menu > AE Fees Reports Menu
    public static final int[] MAINMENU_AE_DAILY_FEE_SHEET_PATH = {8, 11, 12};
    
    /** The Constant MAINMENU_ACCUMULATIVE_AE_FEES_PATH. */
    public static final int[] MAINMENU_ACCUMULATIVE_AE_FEES_PATH = {8, 11, 13};

    /** The Constant MAINMENU_CREATE_CO_PATH. */
    // Consolidated Orders Menu
    public static final int[] MAINMENU_CREATE_CO_PATH = {9, 10};
    
    /** The Constant MAINMENU_CO_EVENTS_PATH. */
    public static final int[] MAINMENU_CO_EVENTS_PATH = {9, 11};
    
    /** The Constant MAINMENU_CO_DJ_PRINTOUT_PATH. */
    public static final int[] MAINMENU_CO_DJ_PRINTOUT_PATH = {9, 12};
    
    /** The Constant MAINMENU_CO_SOD_PATH. */
    public static final int[] MAINMENU_CO_SOD_PATH = {9, 13};

    /** The Constant MAINMENU_MAINTAIN_COURT_PATH. */
    // Help Desk Menu
    public static final int[] MAINMENU_MAINTAIN_COURT_PATH = {10, 11};
    
    /** The Constant MAINMENU_MAINTAIN_PER_PATH. */
    public static final int[] MAINMENU_MAINTAIN_PER_PATH = {10, 12};
    
    /** The Constant MAINMENU_MAINTAIN_SYS_DATA_PATH. */
    public static final int[] MAINMENU_MAINTAIN_SYS_DATA_PATH = {10, 13};
    
    /** The Constant MAINMENU_MAINTAIN_NWD_PATH. */
    public static final int[] MAINMENU_MAINTAIN_NWD_PATH = {10, 14};
    
    /** The Constant MAINMENU_FAILED_TRANSFERS_PATH. */
    public static final int[] MAINMENU_FAILED_TRANSFERS_PATH = {10, 15};
    
    /** The Constant MAINMENU_MAINTAIN_DICT_PATH. */
    public static final int[] MAINMENU_MAINTAIN_DICT_PATH = {10, 16};
    
    /** The Constant MAINMENU_MAINTAIN_ADMINS_PATH. */
    public static final int[] MAINMENU_MAINTAIN_ADMINS_PATH = {10, 17};

    /** The Constant MAINMENU_NATIONAL_CODED_PARTIES_PATH. */
    // CCBC Main Menu
    public static final int[] MAINMENU_NATIONAL_CODED_PARTIES_PATH = {11, 15};

    /** The Constant MAINMENU_REJECTED_CASES_PATH. */
    // CCBC Main Menu > Rejected Records Menu
    public static final int[] MAINMENU_REJECTED_CASES_PATH = {11, 12, 13};
    
    /** The Constant MAINMENU_REJECTED_JUDGMENTS_PATH. */
    public static final int[] MAINMENU_REJECTED_JUDGMENTS_PATH = {11, 12, 14};
    
    /** The Constant MAINMENU_REJECTED_WARRANTS_PATH. */
    public static final int[] MAINMENU_REJECTED_WARRANTS_PATH = {11, 12, 15};
    
    /** The Constant MAINMENU_REJECTED_PAID_PATH. */
    public static final int[] MAINMENU_REJECTED_PAID_PATH = {11, 12, 16};

    /** The Constant MAINMENU_LOG_RECEIVED_TAPES_PATH. */
    // CCBC Main Menu > Tape Log Menu
    public static final int[] MAINMENU_LOG_RECEIVED_TAPES_PATH = {11, 13, 14};
    
    /** The Constant MAINMENU_LOG_RETURNED_TAPES_PATH. */
    public static final int[] MAINMENU_LOG_RETURNED_TAPES_PATH = {11, 13, 15};

    /** The Constant MAINMENU_CUSTOMER_FILE_REPORTS_PATH. */
    // CCBC Main Menu > CCBC Reports
    public static final int[] MAINMENU_CUSTOMER_FILE_REPORTS_PATH = {11, 14, 15};
    
    /** The Constant MAINMENU_PRINT_OUTPUT_STATISTICS_PATH. */
    public static final int[] MAINMENU_PRINT_OUTPUT_STATISTICS_PATH = {11, 14, 16};

    /** The Constant MAINMENU_LOGOUT. */
    // Logout & Exit
    public static final int MAINMENU_LOGOUT = 12;
    
    /** The Constant MAINMENU_EXIT. */
    public static final int MAINMENU_EXIT = 13;

    /** The Constant KEY_F1. */
    // Key codes constants used with Navigator.pressKey()
    public static final String KEY_F1 = "p";
    
    /** The Constant KEY_F2. */
    public static final String KEY_F2 = "q";
    
    /** The Constant KEY_F3. */
    public static final String KEY_F3 = "r";
    
    /** The Constant KEY_F4. */
    public static final String KEY_F4 = "s";
    
    /** The Constant KEY_F5. */
    public static final String KEY_F5 = "t";
    
    /** The Constant KEY_F6. */
    public static final String KEY_F6 = "u";
    
    /** The Constant KEY_F7. */
    public static final String KEY_F7 = "v";
    
    /** The Constant KEY_F8. */
    public static final String KEY_F8 = "w";
    
    /** The Constant KEY_F9. */
    public static final String KEY_F9 = "x";
    
    /** The Constant KEY_F10. */
    public static final String KEY_F10 = "y";
    
    /** The Constant KEY_F11. */
    public static final String KEY_F11 = "z";
    
    /** The Constant KEY_F12. */
    public static final String KEY_F12 = "{";
}