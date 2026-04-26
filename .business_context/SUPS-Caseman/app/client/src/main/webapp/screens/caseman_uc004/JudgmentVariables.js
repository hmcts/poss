/** 
 * @fileoverview function JudgmentVariables.js:
* This files defines a class to represent all common variables used in
* Judgment.js file.
* Done this way to improve performance.
 *
 * @author Mark Groen
 * @version 1.0
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, Removed the CCBC court constant as is a duplicate
 *              of the global CaseManUtils constant which is globally used.
 * 11/10/2006 - Frederik Vandendriessche, Mark Groen, UCT 498
 * 27/11/2006 - Mark Groen, UCT 745 - only print N246, when variation applicant is 'Party Against'
 * 12/01/2007 - Mark Groen, tmp caseman 352 - variables added for check re response on variation
 * 23/01/2007 - Chris Vincent, removed the currency constants as have been replaced by CaseManUtils
 * 				constants.  Temp_CaseMan Defect 309.
 * 18/04/2007 - Mark Groen, caseman 6004 - Added set aside result of IN ERROR 
 * 09/07/2007 - Chris Vincent, CaseMan Defect 6263 - introduced JudgmentVariables.WPO31251
 * 09/07/2007 - Mark Groen, Group 2 Defect 1488 - introduced JudgmentVariables.PAYMENT_MADE_CCBC
 * 03/09/2007 - Chris Vincent, added JudgmentVariables.OUTSTANDING_PAYMENTS_PATH required for CaseMan Defect 6420.
 * 14/02/2008 - Mark Groen, UCT GROUP2 1543 - When an application to vary has a result of refused.  The 140 event 
 * 				result should be set to REFUSED
 * 18/04/2013 - Chris Vincent, Trac #4997 - added UPDATE_EVENT_160_RESULT_REFUSED for CCBC SDT
 */


/**
 * @constructor
 * @author rzhh8k
 * 
 */
function JudgmentVariables()
{
}
/**
 * Used mainly to show the dom
 */
JudgmentVariables.DEBUG_FLAG = true;
/**
 * Service Integration Test Flag
 */
JudgmentVariables.SERVICE_INTEGRATION = true;

/**
 * RefDataXpath
 */
JudgmentVariables.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
/**
 * Judgment xpath
 */
JudgmentVariables.JUDGMENT_PATH = "/ds/MaintainJudgment/Judgments/Judgment";
/**
 * Judgment xpath
 */
JudgmentVariables.SUBFORM_JUDGMENT_PATH = "/ds/var/form/subformcopy/MaintainJudgment/Judgments/Judgment";
/**
 * live AE xpath
 */
JudgmentVariables.LIVE_AE_PATH = "/ds/MaintainJudgment/LiveAE";
/**
 * temp new Judgment xpath
 */
JudgmentVariables.NEW_JUDGMENT_TMP_PATH = "/ds/var/page/Tmp/Judgment";
/**
 * temp new Judgment subform xpath
 */
JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH = "/ds/Judgment";
/**
 * temp new Judgment subform xpath
 */
JudgmentVariables.SUBFORM_PARTIES_XPATH = "/ds/var/form/subformcopy/MaintainJudgment";
/**
 * temp new Judgment subform xpath
 */
JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH = "/ds/var/form/subformcopy";
/**
 * used to know if updating
 */
JudgmentVariables.NEW_JUDGMENT_CREATED = "/ds/var/page/Tmp/NewJudgmentCreated";
/**
 * used to initialise screen
 */
JudgmentVariables.INITIALISE_SCREEN = "/ds/var/page/Tmp/Init";
/**
 * used for event handling
 */
JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED = "/ds/var/page/Tmp/RegDateEnteredAfterCreation";
/**
 * used for event handling
 */
JudgmentVariables.APP_TO_VARY_MADE = "/ds/var/page/Tmp/AppVaryMade";
/**
 * used for event handling
 */
JudgmentVariables.APP_TO_VARY_DETERMINED = "/ds/var/page/Tmp/AppVaryDetermined";
/**
 * used for event handling
 */
JudgmentVariables.APP_TO_VARY_GRANTED = "/ds/var/page/Tmp/AppVaryGranted";
/**
 * used for event handling
 */
JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED = "/ds/var/page/Tmp/AppVaryObjectorEntered";
/**
 * used for event handling
 */
JudgmentVariables.FINAL_PAYMENT_MADE = "/ds/var/page/Tmp/FinalPaymentMade";
/**
 * used for event handling  - DEFECT GRP2 1488
 */
JudgmentVariables.PAYMENT_MADE_CCBC = "/ds/var/page/Tmp/PaymentMadeCCBC";
/**
 * temp new Hearing xpath
 */
JudgmentVariables.NEW_HEARING_TMP_PATH = "/ds/var/page/Tmp/NewHearing/Hearing";
/**
 * temp edit Judgment
 */
JudgmentVariables.EDIT_JUDGMENT_TMP_PATH = "/ds/var/page/Tmp/EditJudgment";
/**
 * temp variation
 */
JudgmentVariables.APP_TO_VARY_TMP_PATH = "/ds/var/page/Tmp/ApplicationsToVary";
/**
 * temp new variation
 */
JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH = "/ds/var/page/Tmp/NewAppToVary";
/**
 * temp set aside
 */
JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH = "/ds/var/page/Tmp/ApplicationsToSetAside";
/**
 * temp new set aside
 */
JudgmentVariables.ADD_APP_TO_SETASIDE_TMP_PATH = "/ds/var/page/Tmp/NewAppToSetAside";
/**
 * temp new set aside
 */
JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH = "/ds/var/page/Tmp/JudgmentParties";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR = "/ds/var/page/Tmp/WordProcessingDocument";
/**
 * used to see if seta saide applicant is a proper officer
 */
JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER = "/ds/var/page/Tmp/SetAsideProperOfficer";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.WORD_PROCESSING_EVENTS = "/ds/var/page/Tmp/WordProcessingEvents";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.WINDOW_FOR_TRIAL_NAVIGATION = "/ds/var/page/Tmp/WFTNavigation";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.OBLIGATIONS_NO_MSG_NAVIGATION = "/ds/var/page/Tmp/OBligationNoMsg";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.OBLIGATIONS_MSG_NAVIGATION = "/ds/var/page/Tmp/OBligationMsg";
/**
 * used to see if require word processing. Store the name of the document required
 */
JudgmentVariables.EXIT_SCREEN = "/ds/var/page/Tmp/ExitScreen";
/**
 * Constant used to identify whether a save is required before
 * allowing the User to go on with something else
 */
JudgmentVariables.SAVE_REQUIRED_PATH = "/ds/var/page/Flags/SaveRequired"; 
/**
 * Constant used to identify whether a save is required before
 * allowing the User to go on with something else.  Looks specificaly at the set aside area
 */
JudgmentVariables.SAVE_REQUIRED_SET_ASIDE_PATH = "/ds/var/page/Flags/SetAsideSaveRequired";
/**
 * Constant used to identify whether to display cancel message
 * allowing the User to go on with something else.  Looks specificaly at the set aside area
 */
JudgmentVariables.DISPLAY_CANCEL_MESSAGE = "/ds/var/page/Flags/DisplayCancelMessage";
/**
 * Constant used to identify whether a save is required before
 * allowing the User to go on with something else.  Looks specificaly at the variation area
 */
JudgmentVariables.SAVE_REQUIRED_VARY_PATH = "/ds/var/page/Flags/VarySaveRequired";
/**
 * Constant used to identify whether a save is required.  Set once a save btn selected on vary or set aside popup
 */
JudgmentVariables.POPUP_SAVE_REQUIRED_PATH = "/ds/var/page/Flags/PopupSaveRequired";
/**
 * Constant used to identify whether to display the save msg.
 * Used as events get fired and cause a loop
 */
JudgmentVariables.SAVE_MSG_PATH = "/ds/var/page/Flags/MsgDisplayed";
/**
 * Constant used to identify whether the status has been updated
 * Used as events get fired and cause a loop
 */
JudgmentVariables.STATUS_CHANGED_PATH = "/ds/var/page/Flags/StatusChanged";
/**
 * Constant used to identify whether a new set aside has been created
 * Used as events get fired and cause a loop
 */
JudgmentVariables.SET_ASIDE_ADDED_PATH = "/ds/var/page/Flags/SetAsideAdded";
/**
 * Constant used to identify whether a new set aside has been created
 * Used as events get fired and cause a loop
 */
JudgmentVariables.SET_ASIDE_GRANTED_PATH = "/ds/var/page/Flags/SetAsideGranted";
/**
 * Constant used to identify whether adding a Judgment.
 * Used to stop loop when validating whether save required.
 */
JudgmentVariables.ADDING_JUDGMENT_PATH = "/ds/var/page/Flags/AddingJudgment"; 
/**
 * Constant used to identify whether adding a new Judgment.
 * Used to call correct service
 */
JudgmentVariables.SAVING_NEW_JUDGMENT_PATH = "/ds/var/page/Flags/SaveNewJudgment"; 
/**
 * Constant used to identify whether need to display the Hearing popup
 */
JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH = "/ds/var/page/Flags/AppVaryHearing";
/**
 * Constant used to identify whether an event 200 is required
 */
JudgmentVariables.HEARING_EVENT_REQUIRED_PATH = "/ds/var/page/Flags/HearingEvent";
/**
 * RFC 1473
 * Constant used to identify whether an event 236 is required
 */
JudgmentVariables.EVENT236_REQUIRED_PATH = "/ds/var/page/Flags/Event236";
/**
 * RFC 1473
 * Constant used to force readonly field
 */
JudgmentVariables.AMEND_JUDGMENT = "/ds/var/page/Flags/AmendJudgment";
/**
 * RFC 1473
 * Used to store temporary Amount Allowed Field.
 * Used to check if event needs to be created in field logic()
 */
JudgmentVariables.AMOUNT_ALLOWED_TMP_PATH = "/ds/var/page/Tmp/TmpAmountAllowed";
/**
 * RFC 1473
 * Used to store temporary Costs Field.
 * Used to check if event needs to be created in field logic()
 */
JudgmentVariables.COSTS_TMP_PATH = "/ds/var/page/Tmp/TmpCosts";
/**
 * CaseMan 6420
 * Used to store whether Case has any outstanding payments.
 * Before changing node, note must match node in service checkOutstandingPaymentsExist()
 */
JudgmentVariables.OUTSTANDING_PAYMENTS_PATH = "/ds/var/page/Tmp/OutstandingPaymentsExist";
/**
 * Constant used to identify if need to show the cancel button on add popups
 */
JudgmentVariables.JUDGMENT_TO_SAVE = "/ds/var/page/Flags/JudgmentToSave";
/**
 * Constant used to identify if can add additional application
 */
JudgmentVariables.ADDED_ASIDE_APPLICATION = "/ds/var/page/Flags/AddedAsideApp";
/**
 * Constant used to identify if can add additional application
 */
JudgmentVariables.ADDED_VARY_APPLICATION = "/ds/var/page/Flags/AddedVaryApp";
/**
 * Constant used to identify if need to reset ADD_APPLICATION flag when the cancel button selected
 */
JudgmentVariables.ADD_APPLICATION_SET_PREVIOUSLY = "/ds/var/page/Flags/AddAppPreviouslySet";
/**
 * Constant used to identify if need to update an event 140
 * Group2 defect 1543
 */
JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED = "/ds/var/page/Flags/UpdateEvent140ResultRefused";
/**
 * Constant used to identify if need to update an event 160
 */
JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED = "/ds/var/page/Flags/UpdateEvent160ResultRefused";
/**
 * UCT 745
 * Constant used to identify if need to print N246
 */
JudgmentVariables.PRINT_N246 = "/ds/var/page/Flags/PrintN246";
/**
 * Constant used to identify whether a time is invalid
 */
JudgmentVariables.INVALIDTIME = "[]INVALID[]"; // Tag for an invalid time. Used when store invalid time in DOM.
/**
 * Constant used in various functions re setting flags
 */
JudgmentVariables.YES = "Y";
/**
 * Constant used in various functions re setting flags
 */
JudgmentVariables.NO = "N";
/**
 * pattern for currency where max length is 7
 * format 99999.99
 */
JudgmentVariables.CURRENCY_MAX_7_PATTERN = /^\d{0,5}(\.\d{2})?$/; 
/**
 * pattern for currency where max length is 8
 * format 999999.99
 */
JudgmentVariables.CURRENCY_MAX_8_PATTERN = /^\d{0,6}(\.\d{2})?$/; 
/**
 * attern for currency where max length is 10
 * format 999999.99
 */
JudgmentVariables.CURRENCY_MAX_10_PATTERN = /^\d{0,8}(\.\d{2})?$/;
/**
 * attern for currency where max length is 10
 * format 999999.99
 */
JudgmentVariables.CURRENCY_MAX_11_PATTERN = /^\d{0,9}(\.\d{2})?$/; 

/**
 * Constant used for checking whether retrieved refdata
 */
JudgmentVariables.ADD_JUDGMENT_SUBFORM = "ADD_JUDGMENT";
/**
 * Constant used for checking whether retrieved refdata
 */
JudgmentVariables.HEARING_JUDGMENT_POPUP = "HEARING_JUDGMENT";
/**
 * Constant used for checking whether retrieved refdata
 */
JudgmentVariables.SETASIDE_JUDGMENT_POPUP = "SETASIDE_JUDGMENT";
/**
 * Constant used for checking whether retrieved refdata
 */
JudgmentVariables.VARY_JUDGMENT_POPUP = "VARY_JUDGMENT";
/**
 * Constant used for checking whether retrieved refdata
 */
JudgmentVariables.GET_COSTS_FOR_CCBC = "CCBC_COSTS"; //GROUP2 1337
/**
 * Constant used for checking status of case
 */
JudgmentVariables.CASE_STATUS_STAYED = "STAYED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.STATUS_SET_ASIDE = "SET ASIDE";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.STATUS_VARIED = "VARIED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.STATUS_CANCELLED = "CANCELLED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.STATUS_PAID = "PAID";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.STATUS_SATISFIED = "SATISFIED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_TRANSFERRED = "TRANSFERRED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_SET_ASIDE = "SET ASIDE";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_REFUSED = "REFUSED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_GRANTED = "GRANTED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_IN_ERROR = "IN ERROR";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_DETERMINED = "DETERMINED";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.RESULT_REFERRED_TO_JUDGDE = "REFERRED TO JUDGE";
/**
 * Constant used for validation
 */
JudgmentVariables.CLAIM_RESPONSE_REFUSE = "REFUSES TERMS";
/**
 * Constant used for validation on variation
 */
JudgmentVariables.CLAIM_RESPONSE_ACCEPTS = "ACCEPTS";
/**
 * Constant used for validation
 */
JudgmentVariables.APPLICANT_DEFENDANT = "DEFENDANT";
/**
 * Constant used for checking period on a add judgment
 */
JudgmentVariables.FORTHWITH_CODE = "FW";
/**
 * Constant used for checking period on a add judgment
 */
JudgmentVariables.IN_FULL = "FUL";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.DEFENDANT = "DEFENDANT";
/**
 * Constant used for checking status of judgment
 */
JudgmentVariables.CLAIMANT = "CLAIMANT";
/**
 * Constant used for checking area to remove/save
 */
JudgmentVariables.APP_TO_VARY = "VARY";
/**
 * Constant used for checking area to remove/save
 */
JudgmentVariables.APP_TO_SET_ASIDE = "ASIDE";
/**
 * Constant used for checking area to remove/save
 */
JudgmentVariables.EDIT_JUDGMENT = "EDIT";
/**
 * Constant used for checking area to remove/save
 */
JudgmentVariables.CLEAR_ALL = "ALL";
/**
 * Period code for weekly
 */
JudgmentVariables.PERIOD_WK = "WK";
/**
 * Period code for fortnightly
 */
JudgmentVariables.PERIOD_FOR = "FOR";
/**
 * Period code for forthwith
 */
JudgmentVariables.PERIOD_FW = "FW";
/**
 * Period code for monthly
 */
JudgmentVariables.PERIOD_MTH = "MTH";
/**
 * Used for calculating pay date
 */
JudgmentVariables.PLUS_1WEEK = "1WEEK";
/**
 * Used for calculating pay date
 */
JudgmentVariables.PLUS_2WEEK = "2WEEK";
/**
 * Used for calculating pay date
 */
JudgmentVariables.PLUS_1MTH = "1MTH";
/**
 * Hearing code
 */
JudgmentVariables.HEARING_TYPE_CODE = "VARIATION";
/**
 * hearing description
 */
JudgmentVariables.HEARING_TYPE_DESC = "APPLICATION TO VARY JUDGMENT";
/**
 * Used for calculating pay date
 */
JudgmentVariables.SYSTEM_DATE = "SYSDATE";
/**
 * UCT 745
 * Used for calculating value of applicant for variation
 */
JudgmentVariables.PARTY_AGAINST = "PARTY AGAINST";
/**
 * TEMP_CASEMAN 352
 * Used for calculating value of applicant for variation
 */
JudgmentVariables.PARTY_FOR = "PARTY FOR";
/**
 * TEMP_CASEMAN 352
 * Used for calculating value of applicant for variation
 */
JudgmentVariables.BY_CONSENT = "BY CONSENT";
/**
 * ccbc uct grp 2 1550
 */
JudgmentVariables.PROPER_OFFICER = "PROPER OFFICER";
/**
 * Event
 */
JudgmentVariables.EVENT600 = "600";
/**
 * Event
 */
JudgmentVariables.EVENT79 = "79";
/**
 * Event
 */
JudgmentVariables.EVENT160 = "160";
/**
 * Event
 */
JudgmentVariables.EVENT170 = "170";
/**
 * Event
 */
JudgmentVariables.EVENT200 = "200";
/**
 * Event
 */
JudgmentVariables.EVENT375 = "375";
/**
 * Event
 */
JudgmentVariables.EVENT79 = "79";
/**
 * Event
 */
JudgmentVariables.EVENT140 = "140";
/**
 * Event
 */
JudgmentVariables.EVENT155 = "155";
/**
 * Event
 */
JudgmentVariables.EVENT150 = "150";
/**
 * Event
 */
JudgmentVariables.EVENT55 = "55";
/**
 * RFC 1473
 * Event
 */
JudgmentVariables.EVENT236 = "236";
/**
 * Reports
 */
JudgmentVariables.WPN441A = "N441A";
/**
 * Reports
 */
JudgmentVariables.WPN35 = "N35";
/**
 * Reports
 */
JudgmentVariables.WPN35A = "N35A";
/**
 * Reports
 * UCT defect 498
 */
JudgmentVariables.WPN246 = "N246";
/**
 * WP
 * CaseMan Defect 6263
 */
JudgmentVariables.WPO31251 = "O_3_1_2_5_1";