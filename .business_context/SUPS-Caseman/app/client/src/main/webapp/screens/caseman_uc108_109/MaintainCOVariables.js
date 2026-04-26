/** 
 * @fileoverview function MaintainCOVariables.js:
 * This files defines a class to represent all common variables used in
 * MaintainCO.js file.
 * Done this way to improve performance.
 *
 * @author MGG
 * @version 1.0
 *
 * Change History
 * 13/06/2006 - Chris Vincent: Added MaintainCOVariables.ACTION_AFTER_SAVE_XPATH and the constants to go with it
 *				(ACTION_NAVIGATE, ACTION_CLEARFORM, ACTION_EXIT) which are used in the mechanism for performing
 *				actions after saving.
 * 24/01/2007 - Chris Vincent, Removed the Currency symbols to use CaseManUtils constants.  Temp_CaseMan Defect 309.
 * 15/02/2011 - Chris Vincent, Added new constant MaintainCOVariables.CO_TRANSFERRED.  Trac 4215
 */

/**
 * @constructor
 * @author rzhh8k
 * 
 */
function MaintainCOVariables()
{
}

/**
 * RefDataXpath
 */
MaintainCOVariables.REF_DATA_XPATH = "/ds/var/app/ReferenceData";

/**
 * co path
 */
MaintainCOVariables.CO_XPATH = "/ds/MaintainCO";

MaintainCOVariables.SUBFORM_DEBT_XPATH = "/ds/Debt";
MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH = "/ds/Address";

MaintainCOVariables.CO_EVENTS_XPATH = "/ds/MaintainCO/COEvents";
MaintainCOVariables.CO_CASE_EVENTS_XPATH = "/ds/MaintainCO/CoCaseEvents";

/**
 *FormDataXpath
 */
MaintainCOVariables.VAR_FORM_XPATH = "/ds/var/form";
/**
 * New Address tmp path
 */
MaintainCOVariables.NEW_ADDRESS_TMP_PATH = "/ds/var/page/Tmp/Address";

/**
 * Tmp debt status path
 */
MaintainCOVariables.DEBT_STATUS_LIST_TMP_PATH = "/ds/var/form/Tmp/DebtStatus";
/**
 * store flag re which lov selected
 */
MaintainCOVariables.WHICH_LOV_MAINTAIN_DEBT_CODED_PARTY_CODE = "/ds/var/app/COFlags/flagMaintainLOVSelected";
/**
 * store flag re whether need to validate court code on add debt subform
 */
MaintainCOVariables.VALIDATE_CRED_MAINTAIN_DEBT_CODED_PARTY_CODE = "/ds/var/app/COFlags/ValidateCreditorCourtCodeMaintainDebt";
/**
 * store flag re whether need to validate court code on add debt subform
 */
MaintainCOVariables.VALIDATE_PAYEE_MAINTAIN_DEBT_CODED_PARTY_CODE = "/ds/var/app/COFlags/ValidatePayeeCourtCodeMaintainDebt";
/**
 * store flag re whether need to validate court code on add debt subform
 */
MaintainCOVariables.VALIDATE_CRED_ADD_DEBT_CODED_PARTY_CODE = "/ds/var/app/COFlags/ValidateCreditorCourtCodeAddDebt";
/**
 * store flag re whether need to validate court code on add debt subform
 */
MaintainCOVariables.VALIDATE_PAYEE_ADD_DEBT_CODED_PARTY_CODE = "/ds/var/app/COFlags/ValidatePayeeCourtCodeAddDebt";
/**
 * Tmp debt status path - for add debt
 */
MaintainCOVariables.ADD_DEBT_STATUS_LIST_TMP_PATH = MaintainCOVariables.REF_DATA_XPATH + "/AddDebt/DebtStatus";
/**
 * New Debt tmp path
 */
MaintainCOVariables.NEW_DEBT_TMP_PATH = "/ds/var/page/Tmp/Debt";
/**
 * Path for the data area for passing information between the main form and the Add Debt Subform
 */
MaintainCOVariables.ADD_DEBT_SUBFORM_PATH = MaintainCOVariables.VAR_FORM_XPATH + "/Subforms/addDebtSubform";

/**
 * Path for the data area for passing information between the main form and the Add Debt Subform
 */
MaintainCOVariables.ADD_CREDITOR_ADDRESS_SUBFORM_PATH = MaintainCOVariables.VAR_FORM_XPATH + "/Subforms/AddAddressSubform";
/**
 * dom tmp path
 */
MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH = "/ds/var/page/Tmp/CreditorAndPayee";
/**
 * creditor list
 */
MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH = "/ds/var/page/Tmp/PartiesForCaseList";
/**
 * FLAG USED TO STOP LOOPING WHEN CALL ONsUCCESS AND RE SET VALUE
 */
MaintainCOVariables.SERVICE_CALLED = "/ds/var/page/Tmp/ServiceCalled";
/**
 * Tab Page selected for DEbtor/ employer and workplace address
 */
MaintainCOVariables.CURRENT_TAB_PAGE_MAIN = "/ds/var/app/COFlags/CurrentTabPage";
/**
 * surrogate id used between manintain co and maintain debts
 */
MaintainCOVariables.SHARED_SURROGATE_ID = "/ds/var/app/COFlags/SurrogateID";
/**
 * FLAG TO DETERMINE WHICH ADDRESS HAS BEEN ADDED ON MAINTAIN DENT FOR SUBFORM PROCESSING
 */
MaintainCOVariables.ADDING_CREDITOR_ADDRESS = "/ds/var/app/COFlags/AddCreditorAddress";
/**
 * FLAG TO DETERMINE WHICH ADDRESS HAS BEEN ADDED ON MAINTAIN DENT FOR SUBFORM PROCESSING
 */
MaintainCOVariables.ADDING_ADDRESS_TYPE = "/ds/var/app/COFlags/AddingMainCoAddress";
/**
 * Used to validate the CO number and whether exist when trying to retreive from database
 * stored as either MaintainCOVariables.YES or MaintainCOVariables.NO
 */
MaintainCOVariables.CO_EXISTS_IN_DATABASE = "/ds/var/app/COFlags/COExistsOnDatabase";
/**
 * Used to validate the old CO number and whether exist
 * stored as either MaintainCOVariables.YES or MaintainCOVariables.NO
 */
MaintainCOVariables.OLD_CO_EXISTS_IN_DATABASE = "/ds/var/app/COFlags/OldCOExistsOnDatabase";
/**
 * Tab Page selected for Maintain Debts creditor and payee
 */
MaintainCOVariables.CURRENT_TAB_PAGE_DEBT = "/ds/var/app/COFlags/DebtCurrentTabPage";

/**
 * Tab Page selected for Maintain Debts creditor and payee
 */
MaintainCOVariables.CURRENT_TAB_PAGE_ADD_DEBT = "/ds/var/app/COFlags/AddDebtCurrentTabPage";

/**
 * Flag to determine whther the user has maintained debts
 */
MaintainCOVariables.VISITED_MAINTAIN_DEBTS = "/ds/var/app/COFlags/MaintainDebts";

/**
 * used to decide if cancel message should be displayed
 */
MaintainCOVariables.DATA_STORE = "/ds/var/app/coData";

/**
 * Event Flag for a 984 
 */
MaintainCOVariables.EVENT984_CHANGE_DEBTOR_NAME = "/ds/var/app/COFlags/Event984";
/**
 * Event Flag for a 984 
 */
MaintainCOVariables.EVENT984_CHANGE_DEBTOR_ADDRESS = "/ds/var/app/COFlags/AddressEvent984";
/**
 * Event Flag for a 986
 */
MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS = "/ds/var/app/COFlags/Event986";
/**
 * Event Flag for a 705
 */
MaintainCOVariables.EVENT705_IN_FORCE = "/ds/var/app/COFlags/Event705";
/**
 * Event Flag for a 706 
 */
MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED = "/ds/var/app/COFlags/NoEvent706";
/**
 * Event Flag for a 706
 */
MaintainCOVariables.EVENT706_CHANGE_TO_REVOKED = "/ds/var/app/COFlags/Event706";

/**
 * Used to store the debt seq number of any debts that have been modified for event 985
 */
MaintainCOVariables.TMP_DEBT_SEQ_AMENDED = "/ds/var/app/COFlags/tmp/DebtsAmendedTemp";
/**
 * Used to store the debt seq number of any debts that have been modified for event 985
 */
MaintainCOVariables.DEBT_SEQ_AMENDED = "/ds/var/app/COFlags/DebtsAmended";
/**
 * used to decide if event 984 should be fired
 */
MaintainCOVariables.ORIGINAL_DEBTOR_NAME = "/ds/var/app/COFlags/tmpData/DebtorOriginalName";
/**
 * used to decide if event 984 should be fired
 */
MaintainCOVariables.ORIGINAL_REVOKED_DATE = "/ds/var/app/COFlags/tmpData/RevokeDateOriginal";
/**
 * used to decide if event 986 should be fired
 */
MaintainCOVariables.ORIGINAL_EMPLOYER_NAME = "/ds/var/app/COFlags/tmpData/EmployerOriginalName";

/**
 * used to decide if event 986 should be fired
 */
MaintainCOVariables.EMPLOYMENT_ADDRESS_CHANGED = "/ds/var/app/COFlags/tmpData/AddedEmplomentAddress";

/**
 * used to decide if need to retrieve the list of coded parties
 */
MaintainCOVariables.ADMIN_COURT_CHANGED = "/ds/var/app/COFlags/AdminCourtChanged";

/**
 * used to decide if need to retrieve the list of coded parties
 */
MaintainCOVariables.CODED_PARTY_LIST_RETRIEVED = "/ds/var/app/COFlags/PartyListRetrieved";
/**
 * used to decide if cancel message should be displayed
 */
MaintainCOVariables.DISPLAY_CANCEL_MESSAGE = "/ds/var/app/COFlags/DisplayCancelMessage";
/**
 * used to decide if cancel message should be displayed
 */
MaintainCOVariables.DISPLAYED_OWNING_COURT_MESSAGE = "/ds/var/app/COFlags/DisplayedOwningCourtMessage";
/**
 * used to decide if save required when select the close button
 */
MaintainCOVariables.SAVE_REQUIRED_MESSAGE = "/ds/var/app/COFlags/SaveRequired";
/**
 * has history been previously retrieved
 */
MaintainCOVariables.DEBTOR_HISTORY_RETRIEVED = "/ds/var/app/COFlags/DebtorHistoryRetrieved";
/**
 * history exists?
 */
MaintainCOVariables.DEBTOR_HISTORY_EXISTS = "/ds/var/app/COFlags/DebtorHistoryExists";
/**
  * has history been previously retrieved
 */
MaintainCOVariables.EMPLOYER_HISTORY_RETRIEVED = "/ds/var/app/COFlags/EmployerHistoryRetrieved";
/**
 * history exists?
 */
MaintainCOVariables.EMPLOYER_HISTORY_EXISTS = "/ds/var/app/COFlags/EmployerHistoryExists";
/**
 * has history been previously retrieved
 */
MaintainCOVariables.WORKPLACE_HISTORY_RETRIEVED = "/ds/var/app/COFlags/WorkplaceHistoryRetrieved";
/**
 * history exists?
 */
MaintainCOVariables.WORKPLACE_HISTORY_EXISTS = "/ds/var/app/COFlags/WorkplaceHistoryExists";
/**
 * has history been previously retrieved
 */
MaintainCOVariables.CREDITOR_HISTORY_RETRIEVED = "/ds/var/app/COFlags/CreditorHistoryRetrieved";
/**
 * has history been previously retrieved
 */
MaintainCOVariables.PAYEE_HISTORY_RETRIEVED = "/ds/var/app/COFlags/PayeeHistoryRetrieved";

/**
 * used to decide if creditor/ payee details are read only in add debt.
 * Also used to determine if debtor needs adding to the debt
 */
MaintainCOVariables.VALID_CASE = "/ds/var/app/COFlags/ValidCase";

/**
 * Indicates if the CO is being transferred.  This is placed in the main business model as needs to be
 * passed to the server side code.  Should be set to 'true' when being transferred.
 */
MaintainCOVariables.CO_TRANSFERRED = "/ds/MaintainCO/TransferCOFlag";

/**
 * debt id xpath
 */
MaintainCOVariables.DEBT_SURROGATE_ID_XPATH = "ds/MaintainCO/Debts/Debt/DebtSurrogateId";

/**
 * debt seq id xpath
 */
MaintainCOVariables.DEBT_ID_XPATH = "ds/MaintainCO/Debts/Debt/DebtSeq";

/**
 * passthrough xpath
 */
MaintainCOVariables.PASSTHROUGH_XPATH = "ds/MaintainCO/Debts/Debt/Passthroughs";

/**
 * dividend xpath
 */
MaintainCOVariables.DEBT_DIVIDEND_XPATH = "ds/MaintainCO/Debts/Debt/Dividends";

/**
 * Flag returned in dom to determine whether - - -
 * Check payable_orders and  debt_dividends tables for this consolidated Order, 
 * if any are found that do not have dividends created then Read Only - update not 
 * allowed since payout/dividend declaration is in progress.
 */
MaintainCOVariables.PAYMENT_DIV_IN_PROGRESS = "/ds/MaintainCO/PaymentDividendInProgress";

/**
 * Flag returned in dom to determine whether - - -
 * Update prevented if monies in court are not yet available for dividend declaration.
 */
MaintainCOVariables.DIVIDEND_MONIES_UNAVAILABLE = "/ds/MaintainCO/DividendCourtMoniesUnavailable";

/**
 * Flag returned in dom to determine whether - - -
 *  Update prevented if Overpayment exists which must be resolved.
 */
MaintainCOVariables.UNRESOLVED_OVERPAYMENT = "/ds/MaintainCO/UnresolvedOverpayment";

/**
 * Flag returned in dom to determine whether - - -
 *  Update prevented if Overpayment exist which must be resolved.
 */
MaintainCOVariables.PRE_PAYOUTLIST_RUN = "/ds/MaintainCO/PrePayoutListRun";

/**
 * Flag returned in dom to determine whether - - -
 * Check that there are no existing co event records of code 920 with todays date 
 * if there are cannot create another debtor address today.
 */
MaintainCOVariables.EVENT920_PRODUCED_TODAY = "/ds/MaintainCO/Event920ProducedToday";

/**
 * Flag used to ensure creditor/payee details get set correctly because the framework cannot handle it
 */
MaintainCOVariables.ADDING_DETAILS_FROM_CASE = "/ds/var/page/Tmp/StupidUnnecessaryFlagToStopSillyEvents";

/**
 * Xpath of the node indicating the action to perform after saving (e.g. navigating)
 */
MaintainCOVariables.ACTION_AFTER_SAVE_XPATH = "/ds/var/page/Tmp/ActionAfterSave";

/**
 * Constant used in various functions re setting flags
 */
MaintainCOVariables.YES = "Y";
/**
 * Constant used in various functions re setting flags
 */
MaintainCOVariables.NO = "N";

/**
 * Constant used re retrieving refdata
 */
MaintainCOVariables.MAINTAIN_DEBT_REFDATA = "MAINTING_DEBT_SCREEN";
/**
 * Constant used re retrieving refdata
 */
MaintainCOVariables.MAINTAIN_CO_REFDATA = "MAINTING_CO_SCREEN";
/**
 * Constant used re retrieving refdata
 */
MaintainCOVariables.ADD_DEBT_REFDATA = "ADD_DEBT_SCREEN";
/**
 * Constant used re setting screen mode
 */
MaintainCOVariables.SCREENMODE_CREATE = "C";

/**
 * Constant used re setting screen mode
 */
MaintainCOVariables.SCREENMODE_MAINTAIN = "M";

/**
 * Constant used re validating CO Type 
 */
MaintainCOVariables.COTypeAO = "AO";

/**
 * Constant used re validating CO Type
 */
MaintainCOVariables.COTypeCAEO = "CAEO";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_APPLN = "APPLN";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_REVOKED = "REVOKED";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_DISCHARGED = "DISCHARGED";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_LIVE = "LIVE";
/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_TRANSFERRED = "TRANSFERRED";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_SUSPENDED = "SUSPENDED";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_SETASIDE = "SET ASIDE";

/**
 * Constant used to define CO Status
 */
MaintainCOVariables.STATUS_DEBTORPAYING = "DEBTR PAYNG";

/**
 * Constant used to define individual maintain debt Status
 */
MaintainCOVariables.STATUS_PAID = "PAID";

/**
 * Constant used to define individual maintain debt Status
 */
MaintainCOVariables.STATUS_PENDING = "PENDING";

/**
 * Constant used to define individual maintain debt Status
 */
MaintainCOVariables.STATUS_DELETED = "DELETED";

/**
 * Constant used to define individual maintain debt Status
 */
MaintainCOVariables.STATUS_SCHEDULE2 = "SCHEDULE2"; 
/**
 * Constant used to define type of address history
 */
MaintainCOVariables.ADDRESS_HISTORY_CREDITOR = "CO CRED";
/**
 * Constant used to define type of address history
 */
MaintainCOVariables.ADDRESS_HISTORY_PAYEE = "CO PAYEE";
/**
 * Constant used to define type of address history
 */
MaintainCOVariables.ADDRESS_HISTORY_DEBTOR = "CO DEBTOR";
/**
 * Constant used to define type of address history
 */
MaintainCOVariables.ADDRESS_HISTORY_EMPLOYER = "CO EMPLOYER";
/**
 * Constant used to define type of address history
 */
MaintainCOVariables.ADDRESS_HISTORY_WORKPLACE = "CO WORKPLACE";
/**
 * Constant used to define COMPOSTION TYPE
 */
MaintainCOVariables.COMPOSITION_ALLOWED_DEBT = "A";
/**
 * Constant used to define COMPOSTION TYPE
 */
MaintainCOVariables.COMPOSITION_ORIGINAL_DEBT = "O";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_705_ID = "705";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_706_ID = "706";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_777_ID = "777";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_980_ID = "980";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_984_ID = "984";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_985_ID = "985";
/**
 * Constant used to define event
 */
MaintainCOVariables.EVENT_986_ID = "986";

/**
 * Constant used to set STATUS flag in don re wheher new, existing or modified
 */
MaintainCOVariables.STATUS_FLAG_NEW = "NEW";

/**
 * Constant used to set STATUS flag in don re wheher new, existing or modified
 */
MaintainCOVariables.STATUS_FLAG_EXISTING = "EXISTING";

/**
 * Constant used to set STATUS flag in don re wheher new, existing or modified
 */
MaintainCOVariables.STATUS_FLAG_MODIFIED = "MODIFIED";

/**
 * Constant used to set STATUS flag in don re wheher new, existing or modified
 */
MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY = "CODED PARTY";

/**
 * Used to define type of addres for xp
 */
MaintainCOVariables.DEBTOR_ADDRESS_XP = "/Debtor";

/**
 * Used to define type of addres for xp
 */
MaintainCOVariables.CREDITOR_ADDRESS_XP = "/Creditor"; 

/**
 * Used to define type of addres for xp
 */
MaintainCOVariables.PAYEE_ADDRESS_XP = "/Payee"; 

/**
 * Used to define type of addres for xp
 */
MaintainCOVariables.EMPLOYMENT_ADDRESS_XP = "/Employer"; 

/**
 * Used to define type of addres for xp
 */
MaintainCOVariables.WORKPLACE_ADDRESS_XP = "/Workplace"; 

/**
 * Used to define type of addres for subform
 */
MaintainCOVariables.ADD_DEBTOR_ADDRESS_TYPE = "Debtor"; 

/**
 * Used to define type of addres for subform
 */
MaintainCOVariables.ADD_EMPLOYER_ADDRESS_TYPE = "Employer"; 

/**
 * Used to define type of addres for subform
 */
MaintainCOVariables.ADD_WORKPLACE_ADDRESS_TYPE = "Workplace"; 

/**
 * Used to retrieve amount allowed from individual debt
 */
MaintainCOVariables.DEBT_AMOUNT_ALLOWED_XPATH = "/DebtAmountAllowed";

/**
 * Used to set event corretcly
 */
MaintainCOVariables.DEBT_TRANSFERRED = "T";
/**
 * Used to set event corretcly
 */
MaintainCOVariables.DEBT_DELETED = "D";
/**
 * Used to set event corretcly
 */
MaintainCOVariables.EVENT777_DEBT_TRANSFERRED = "CO Marked as Transfered.";

/**
 * Used to set event corretcly
 */
MaintainCOVariables.EVENT777_DEBT_DELETED = "CO Debt deleted.";

/**
 * Pattern for currency where max length is 10
 * format 9999999.99
 */
MaintainCOVariables.CURRENCY_MAX_10_PATTERN = /^\d{0,8}(\.\d{2})?$/;

/**
 * Contant for the MaintainCOVariables.ACTION_AFTER_SAVE_XPATH representing a
 * need to navigate after saving.
 */
MaintainCOVariables.ACTION_NAVIGATE = "NAVIGATE";

/**
 * Contant for the MaintainCOVariables.ACTION_AFTER_SAVE_XPATH representing a
 * need to clear the form after saving.
 */
MaintainCOVariables.ACTION_CLEARFORM = "CLEAR_FORM";

/**
 * Contant for the MaintainCOVariables.ACTION_AFTER_SAVE_XPATH representing a
 * need to exit the screen after saving.
 */
MaintainCOVariables.ACTION_EXIT = "EXIT_SCREEN";
