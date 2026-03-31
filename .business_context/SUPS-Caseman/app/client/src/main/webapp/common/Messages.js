/** 
 * @fileoverview CaseMan Message Constants - Contains a list of constants to be 
 * used in JavaScript alert and confirm boxes.
 *
 * @author Chris Vincent
 * @version 1.0
 * 
 * Change History:
 * 25/08/2006 - Chris Vincent, updated message for CONFIRM_DELETE_NONWORKINGDAY by placing a
 * 				hyphen between 'non' and 'working'.  Defect 4709.
 * 22/01/2007 - Chris Vincent, added message CONFIRM_CASES_DATEOFSERVICE_MESSAGE for Temp_CaseMan
 * 				Defect 292, now CaseMan defect 6012.
 * 16/01/2007 - Chris Vincent, updated the message Messages.CO_TRANSFERREDCO_MESSAGE for Temp_CaseMan
 * 				defect 417.
 * 03/07/2007 - Chris Vincent, added new Run Order Printing Messages.  CaseMan Defect 6213.
 * 08/08/2007 - Chris Vincent, added invalid fee costs value (CCBC Specific) confirm message.  UCT_Group2 Defect 1474.
 * 14/07/2007 - Mark Groen added new Judgment message for ccbc and a case status of STAYED.  ccbc gp 2 Defect 1526.
 * 16-07-2008 - Struan Kerr-Liddell - Added message when Insolvency Number is not found
 * 18-08-2008 - Sandeep Mullangi: Added the message INSOLVENCY_NUMBER_EXISTS
 * 27-01-2009 - sandeep Mullangi - Changing the INSOLVENCY_NUMBER_REQUIRED message.
 * 09/08/2010 - Chris Vincent - Added WARRANT_UPDATED_SUCCESSFULLY for Trac 2848.
 * 08/11/2011 - Chris Vincent - Added SAVE_BEFORE_PROCEED_MESSAGE for Trac 4591.
 * 01/12/2011 - Chris Vincent - Added PTHROUGH_CO_MONEY_IN_COURT_MESSAGE for Trac 4587
 * 11/06/2012 - Chris Vincent - Added two TRANSFER_PENDING messages for Trac 4692.
 * 28/01/2013 - Chris Vincent - Change to DEL_OO_MESSAGE to mention parameterisation.  Trac 4767.
 * 14/10/2016 - Chris Vincent (Trac 5880). Added warning when party on case has requested confidentiality.
 */

/**
 * @constructor
 */
function Messages()
{
}

/**
 * Class method
 * @return A formatted message string
 * For example if your message is "Hello {0}. This is my test message. Hello {1}."
 * and your array is ["one", "two"]
 * then the method will return the following formatted message:
 * "Hello one. This is my test message. Hello two."
 *
 * If any message index specified in the message does not exist in the message argument array
 * then the text 'undefined' will be substituted for that argument.
 *
 * @param message The message that contains arguments to substitute
 * @param messageArgs An array of arguments to substitute into the message
 */
Messages.format = function(message, messageArgs)
{
  var errorText = "Error parsing the message string: the brackets do not match.\n";
  var paramIndex = ""; // The index specified in each substitution parameter eg {0}
  var parsedMessage = new Array(); // Array of characters that consists of the original message without the substitution parameters
  var braceCount = 0; // Used to keep track of braces

  for (var i = 0; i < message.length; i ++)
  {
    var ch = message.charAt(i);
    if (ch == "{")
    {
      braceCount ++;
      if (braceCount != 1)
      {
        throw new Error(errorText + message);
      }
    }
    else if (ch == "}")
    {
      braceCount --;
      if (braceCount != 0)
      {
        throw new Error(errorText + message);
      }     

      // Look up and store the substituted text
      var substitutedText = messageArgs[new Number(paramIndex)];

      // Handle if the index has been incorrectly specified
      if (substitutedText == undefined) {substitutedText = "undefined";}

      paramIndex = "";      
      
      // Substitute the parameter
      for (var j = 0; j < substitutedText.length; j ++)
      {
        parsedMessage[parsedMessage.length] = substitutedText.charAt(j)
      }
    }
    else if (braceCount == 1)
    {
      // We are in a brace so deal with the index defined there
      paramIndex = paramIndex + ch;
    }
    else
    {
      parsedMessage[parsedMessage.length] = ch;
    }
  }
  if (braceCount != 0)
  {
    // We have processed the message but the brackets do not match up so error
    throw new Error(errorText + message);
  } 

  // Construct the message to return from the character array 
  var rtnMsg = "";
  for (var i = 0; i < parsedMessage.length; i ++)
  {
    rtnMsg = rtnMsg + parsedMessage[i];
  } 
  return rtnMsg;
}

/**
 * Maintain User To Court Section used in alert
 */
Messages.MUS_MESSAGE_NOALLOCATION ="No allocations to save"
/**
 * Maintain User To Court Section used in alert
 */
Messages.MUS_MESSAGE_CURALLOCATION = "This allocation is the current user and section allocation";
/**
 * Maintain User To Court Section used in alert
 */
Messages.MUS_MESSAGE_DUPALLOCATION = "This allocation already exists";
/**
 * Maintain User To Court Section used in alert
 */
Messages.MUS_MESSAGE_DUPALLOCATION = "This allocation already exists";
/**
 * Maintain Court Section used in alert
 */
Messages.MCS_MESSAGE_DUPSECTION = "This section already exists";
/**
 * Maintain Court Section used in alert
 */
Messages.MCS_MESSAGE_NOSECTION = "Please enter a new section name";
/**
 * Maintain Court Section , used in confirm box
 */
Messages.GEN_EXIT_UNSAVED = "Do you wish to exit without saving changes";
/**
 * Used in Maintain Judgments top confirm that there are no judgment orders to reprint
 */
Messages.PJO_MESSAGE_NOPO = "No judgment orders to reprint for this case"
/**
 * Maintain Window for Trial Message B, used in confirm box
 */
Messages.WFT_MESSAGE_B = "Do you wish to enter Window for Trial details?";

/**
 * Maintain Window for Trial Message C, used in confirm box
 */
Messages.WFT_MESSAGE_C = "Do you wish to maintain Window for Trial details?";

/**
 * Maintain Obligations Message, used in confirm box
 */
Messages.OBL_MESSAGE = "Maintain Obligations?"

/**
 * No Active Obligations Exist Message, used in confirm box
 */
Messages.NO_OBL_MESSAGE = "Warning - no active obligations exist.  Do you wish to continue?";

/**
 * No Obligations have ever existed for the Case message, used in alert box
 */
Messages.OBL_DONOTEXIST_MESSAGE = "No obligations have ever existed for this case.";

/**
 * The Obligation Associated with an Event already exists Message, used in alert box
 */
Messages.EVENTOBL_EXISTS_MESSAGE = "The obligation associated with this event already exists.";

/**
 * Is a Hearing Required Message, used in confirm box
 */
Messages.HRG_MESSAGE = "Is a hearing required?";

/**
 * Unsaved Changes, details lost Message, used in confirm box
 */
Messages.DETSLOST_MESSAGE = "There are unsaved changes.  Click OK to save or click Cancel to discard changes and continue.";

/**
 * Different Owning Court to User Warning Message for Case records, used in alert box
 */
Messages.OWNING_COURT_MESSAGE = "Warning - The case you have retrieved is owned by a court other than your own.";

/**
 * Different Owning Court to User Warning Message for CO records, used in alert box
 */
Messages.CO_OWNING_COURT_MESSAGE = "Warning - The consolidated order you have retrieved is owned by a court other than your own.";

/**
 * Date Over 1 Month in Past Entered Warning Message, used in alert box
 */
Messages.DATEOVER1MONTH_MESSAGE = "Warning - This date is more than one month in the past.";

/**
 * Write/Write Conflict Message, used in confirm box
 */
Messages.WRITE_WRITE_CONFLICT_MSG = "Another user has made changes to this record. Your changes have not been saved. Click OK to retrieve the record details again.";

/**
 * New Obligation - missing Notes Message, used in alert box
 */
Messages.NEW_OBL_ENTERNOTES_MESSAGE = "Please click LOV to enter a value for notes before saving.";

/**
 * Non Working Day Warning Message, used in confirm box
 */
Messages.NONWORKINGDAY_MESSAGE = "The expiry date {0} is not a working day, are you sure?\n\nClick Ok to use the non-working day\nClick Cancel to use the first working day";
/**
 * Exit Application Message, used in confirm box
 */
Messages.EXITAPPLICATION_MESSAGE = "Are you sure you want to exit?";
/**
 * Exit Application Message, used in confirm box
 */
Messages.EXIT_NOSAVE_APPLICATION_MESSAGE = "Exit without saving changes?"
/**
 * Select a valid party type message, used in alert box
 */
Messages.VALIDPARTYTYPE_MESSAGE = "Please select a valid party type";

/**
 * Cannot remove solicitor message, used in alert box
 */
Messages.REMOVESOLICITOR_MESSAGE = "Sorry, you cannot remove that solicitor.\nThe solicitor represents the following parties: ";

/**
 * Update Payment Payee Details warning message, used in alert box
 */
Messages.UPDATE_PAYMENTPAYEE_MESSAGE = "Warning - Payment PAYEE details may need to be updated.";

/**
 * Failed save message #1, used in alert box
 */
Messages.FAILEDSAVE_MESSAGE = "There was a problem with the save. Changes have not been saved.  Returning to the calling screen";

/**
 * Failed saved message #2, used in confirm box
 */
Messages.UNABLESAVEDATA_MESSAGE = "Unable to save changes made. Do you want to re load the data and start again?";

/**
 * Unable to load data message, used in alert box
 */
Messages.UNABLELOADDATA_MESSAGE = "Unable to load case, returning to original screen";

/**
 * Failed to load case data message, used in confirm box
 */
Messages.FAILEDCASEDATALOAD_MESSAGE = "Unable to load case data. Do you want to retry or start again?";

/**
 * Failed to load reference data message, used in confirm box
 */
Messages.FAILEDREFDATALOAD_MESSAGE = "Unable to load the reference data for the selected court. Do you want to retry or start again?";

/**
 * Failed to load party data message, used in confirm box
 */
Messages.FAILEDPARTYDATALOAD_MESSAGE = "Unable to load the Parties details. Do you want to retry or start again?";

/**
 * Failed to load solicitor data message, used in confirm box
 */
Messages.FAILEDSOLDATALOAD_MESSAGE = "Unable to load the Solicitors details. Do you want to retry or start again?";

/**
 * Confirm clear screen details message, used in confirm box
 */
Messages.CONFIRM_CLEARSCREEN_MESSAGE = "Are you sure you want to clear all data?";

/**
 * Duplicate party code message, used in alert box
 */
Messages.DUPLICATE_PARTYCODE_MESSAGE = "That party is already assigned to the case.  Please select another.";

/**
 * Missing Debtor party type message, used in alert box
 */
Messages.MISSING_DEBTOR_MESSAGE = "Please enter a Debtor.";

/**
 * Missing Company party type message, used in alert box
 */
Messages.MISSING_COMPANY_MESSAGE = "Please enter a Company.";

/**
 * Missing Applicant party type message, used in alert box
 */
Messages.MISSING_APPLICANT_MESSAGE = "Please enter an Applicant.";

/**
 * Missing Claimant and Defendant party types message, used in alert box
 */
Messages.MISSING_PARTIES_MESSAGE = "Please enter at least one Claimant and one Defendant.";

/**
 * No results returned message, used in alert box
 */
Messages.NO_RESULTS_MESSAGE = "No results were found for the given search criteria.";

/**
 * Error retrieving Hearings message, used in alert box
 */
Messages.ERR_RET_HRGS_MESSAGE = "There was a problem retrieving the list of Hearings for the specified case.";

/**
 * Error retrieving Judgments message, used in alert box
 */
Messages.ERR_RET_JUDGMENTS_MESSAGE = "There was a problem retrieving the list of Judgments for the specified case.";

/**
 * Error when clicking the print judgment orders button, used in status bar
 */
Messages.ERR_JUDGMENT_SET_ASIDE_MESSAGE = "This Judgment has been set aside.";

/**
 * Error retrieving Judgment order outputs message, used in alert box
 */
Messages.ERR_RET_JUDGMENT_ORDER_OUTPUTS_MESSAGE = "There was a problem retrieving the Judgment Order outputs.";

/**
 * Error when clicking the print judgment orders button, used in status bar
 */
Messages.ERR_NO_JUDGMENT_EVENT_MESSAGE = "No Judgment Order event can be found.";

/**
 * No Hearings to save message, used in alert box
 */
Messages.NOHEARINGS_MESSAGE = "There are no Hearings to save";

/**
 * Saved Successfully message, used in alert box
 */
Messages.SAVEDSUCESSFULLY_MESSAGE = "Saved Successfully";

/**
 * Ensure Hearing details are correct message, used in alert box
 */
Messages.HRGDETS_CORRECT_MESSAGE = "Please ensure all new Hearing Details are correct";

/**
 * Ensure you have completed venue details message, used in alert box
 */
Messages.VENUEDETS_MESSAGE = "Please ensure you have entered Venue Details.";

/**
 * No matching cases with outstanding output message, used in alert box
 */
Messages.NO_MATCHING_CASES_MESSAGE = "There are no matching cases with outstanding output";

/**
 * Enter search criteria message, used in alert box
 */
Messages.ENTER_SEARCH_CRITERIA_MESSAGE = "Please enter search criteria.";

/**
 * Admin crown court not set for user message, used in alert box
 */
Messages.ADMIN_CROWN_COURT_MESSAGE = "Warning: Admin crown court for user has not been set.";

/**
 * Cannot delete National Coded Parties message, used in alert box
 */
Messages.INVALID_DELNATIONALCODE_MESSAGE = "National Coded Parties may not be deleted.";

/**
 * Cannot update National Coded Parties message, used in alert box
 */
Messages.INVALID_UPDNATIONALCODE_MESSAGE = "National Coded Parties can only be maintained by Helpdesk.";

/**
 * Confirm removal of local coded party message, used in confirm box
 */
Messages.DELETE_LOCALCODE_MESSAGE = "Are you sure you want to remove the code";

/**
 * Delete all overdue obligations message, used in confirm box
 */
Messages.DEL_OO_MESSAGE = "Delete All Overdue Obligations matching search criteria?";

/**
 * No judgment details found message, used in alert box
 */
Messages.NO_JUD_MESSAGE = "Unable To Find Judgment Details - No Case Number Found.";

/**
 * Date in future warning message, used in alert box
 */
Messages.DATE_IN_FUTURE_MESSAGE = "Warning - This date is in the future.";

/**
 * Instalment amount field empty warning message, used in alert box
 */
Messages.INSTALMENT_AMOUNT_EMPTY_MESSAGE = "Warning - The instalment amount is empty. Period must therefore be FW.";

/**
 * Application to Set Aside - result transferred warning message, used in alert box
 */
Messages.APPSETASIDE_RESULT_TRANSFERRED_MESSAGE = "Warning - Select the Transfer Screen from the navigation bar and transfer the case out.";

/**
 * Application to Set Aside - result granted warning message, used in alert box
 */
Messages.APPSETASIDE_RESULT_GRANTED_MESSAGE = "Warning - There is a live Attachment of Earnings order on this case.";

/**
 * Confirm cancel hearing message, used in confirm box
 */
Messages.CANCEL_HEARING_MESSAGE = "Warning - The Hearing details entered will not be saved.\nThe Hearing check box will be set to NO on the Application To Vary popup.\n Click OK to not add the Hearing or click Cancel to return to the Hearing screen.";

/**
 * Generic cancel message, used in confirm box
 */
Messages.CANCEL_MESSAGE = "There are unsaved changes.  Cancelling will lose all changes and return you to the calling screen. Are you sure?";

/**
 * Save judgment changes message, used in alert box
 */
Messages.SAVE_JUDGMENT_MESSAGE = "Changes have been made on the selected Judgment.\nPlease save these changes before continuing.";

/**
 * Message for CCBC and stayed cases
 */
Messages.CCBC_STAYED_CASE_MESSAGE = "The case status is STAYED.\nChanges are not allowed for this status type.";
/**
 * Maximum number of parties have been exceeded message, used in alert box
 */
Messages.MAX_PARTIES_EXCEEDED_MESSAGE = "You can only have a maximum of XXX of this party type";

/**
 * Reset Case Status message, used in confirm box
 */
Messages.RESET_CASESTATUS_MESSAGE = "Are you sure you want to reset the case status?";

/**
 * Defendant does not have a date of service message, used in alert box
 */
Messages.NO_DATEOFSERVICE_MESSAGE = "There is no date of service for this defendant.";

/**
 * Live Attachment of Earnings Order on Case, used in alert box
 */
Messages.LIVE_AEORDER_MESSAGE = "There is a live Attachment of Earnings order on this case.";

/**
 * Payments do not exist for the Case message, used in alert box
 */
Messages.PAYMENTS_DONOTEXIST_MESSAGE = "Payments do not exist for this Case.";

/**
 * Confidentiality warning message, used in alert box
 */
Messages.CONFIDENTIALITY_MESSAGE = "Warning - a party on this case has requested confidentiality.";

/**
 * Query By Party called with a call stack present message, used in confirm box
 */
Messages.QBP_RESET_CALLSTACK_MESSAGE = "Are you sure you wish to search for another case? \nLinks to previous calling screens will be severed.";

/**
 * Used Coded Party cannot be deleted message, used in alert box
 */
Messages.DEL_USED_CODEDPARTY_MESSAGE = "Cannot delete CODED_PARTIES while CASES exist.";

/**
 * In maintain obligations this message appears when the obligation already exists for the event and
 *( the obligation's multi-use flag is "N"
 */
Messages.MULTI_USE_MESSAGE = "Sorry can't have multiple instances of that obligation type.";

/**
 * New Judgment invalid relationship between Against and Infavour parties
 */
Messages.AGAINST_INFAVOUR_RELATION_MESSAGE = "The 'Against' to 'In Favour Of' relationship is incorrect.  Please change to a valid relationship.\n\n1. Defendant to Claimants\n2. Defendant to Defendants (Can not be the same Defendant)\n3. Claimant to Defendants";

/**
 * New Judgment invalid relationship between Against and Infavour parties
 */
Messages.INVALID_MESSAGE = "There is invalid data.  Please ensure all data is valid.";

/**
 * Used in validating whether can add new application to a Judgment 
 */
Messages.STATUS_SET_MESSAGE = "Cannot create a new Application when the Judgment Status is set.";

/**
 * Used in validating whether can add new application to a Judgment 
 */
Messages.APP_OUTSTANDING_MESSAGE = "Cannot enter an Application whilst there are others outstanding.";

/**
 * Message informing user that they cannot select a Subject of CASE because at least one of the 
 * parties is invalid.  Used in alert box on Manage Events
 */
Messages.CANNOT_SELECT_SUBJECTCASEFLAG_MESSAGE = "Cannot select Case as the Subject, at least one party is invalid.";

/**
 * Generic message for a service failure, used in an alert box
 */
Messages.SERVICE_CALL_FAILURE_MESSAGE = "There was a problem with the service call, returning to the previous screen.";


/**
 * warning message 
 */
Messages.CLAIMANT_RESPONSE_MESSAGE = "Response not valid if the applicant is the claimant.";

/**
 * validation message 
 */
Messages.INVALID_APP_MESSAGE = "Please ensure all Applications are valid before adding a new one";

/**
 * validation message 
 */
Messages.INVALIDPARTYAGAINST_MESSAGE = "The selected Party already has an Active Judgment against\nthem for the same In Favour Party(ies).\nPlease select another Party via the LOV button";
/**
 * info message 
 */
Messages.BAR_NOFIND_MESSAGE = "No defendants for this case";

/**
 * info message 
 */
Messages.OBL_NOFIND_MESSAGE = "There are no overdue obligations for this court";

/**
 * VALIDATION MESSAGE FOR JUDGMENT APPLICATIONS
 */
Messages.MORE_THAN_ONE_APP_NO_RESULT_MESSAGE = "Can not have more than one Application with no result.";

/**
 * VALIDATION MESSAGE FOR JUDGMENT SET ASIDE APP
 */
Messages.STATUS_CANNOT_BE_SETASIDE_MESSAGE  = "Can not set an Application to Set Aside to GRANTED, if one already exists with no result.";
            
/**
 * Inform User cannot have add multi apps without saving
 */
Messages.APP_ADDED_PREVIOUSLY_MESSAGE  = "Can not add multiple Applications without saving.\nPlease select the save button on the main screen.";

/**
 * Error Returning Coded Party Message, used in alert
 */
Messages.ERROR_RETURNING_CODEDPARTY_MESSAGE  = "Error returning coded party from database.";

/**
 * Data on popup invalid or incomplete message, used in alert
 */
Messages.POPUP_INVALID_MESSAGE  = "There are invalid or incomplete fields on the popup.";

/**
 * Data on popup invalid or incomplete message, used in alert
 */
Messages.MULTISELECT_INSTIGATOR_MESSAGE  = "Sorry, only one party may be selected for this event.  Please de-select all but one selected party.";


/**
 * There is a pending application to set aside judgment for a given party.
 */
Messages.PENDING_SET_ASIDE_APPLICATION = "Pending application to set aside judgment exists for party XXX."; // The XXX gets replaced by the parties name

/**
 * There is a pending application to vary for a given party.
 */
Messages.PENDING_VARY_APPLICATION = "Application to vary/1st payment date pending for party XXX."; // The XXX gets replaced by the parties name

/**
 * There is a pending hearing for a given case.
 */
Messages.PENDING_HEARING = "There is a pending hearing on XXX at YYY." // The XXX gets replaced by the hearing date, and the YYY gets replaced by the hearing court
    
/**
 * One or more warrants already exist for a given case.
 */
Messages.WARRANTS_EXIST_FOR_CASE = "Warrants already exist for this case.";

/**
 * The selected case is owned by a court other than the users home court.
 */
Messages.CASE_OWNED_BY_OTHER_COURT = "This case is owned by a different court.";

/**
 * The user has seleced a warrant type that is not the default for the current case type.
 */
Messages.WRONG_WARRANT_TYPE = "The warrant type is not normally associated with this case type.";

/**
 * A home warrant was created successfully with a given warrant number, and is being executed by the current court.
 */
Messages.WARRANT_CREATED_SUCCESSFULLY_HOME = "Warrant created successfully.  Warrant number is XXX.  Warrant must be printed and passed to the Bailiff."; // The XXX gets replaced by the new warrant number.

/**
 * A home warrant was created successfully with a given warrant number, and is being executed by a different court.
 */
Messages.WARRANT_CREATED_SUCCESSFULLY_FOREIGN = "Warrant created successfully.  Warrant number is XXX.  Warrant must be printed and sent to foreign court."; // The XXX gets replaced by the new warrant number.

/**
 * A home warrant was created successfully with a given warrant number, and is being transferred automatically to another court.
 */
Messages.WARRANT_CREATED_SUCCESSFULLY_TRANSFERRED = "Warrant created successfully.  Warrant number is XXX.  Warrant sent to foreign court."; // The XXX gets replaced by the new warrant number.

/**
 * A warrant has been updated successfully, and the executing court has changed, and has already been printed.
 */
Messages.WARRANT_UPDATED_SUCCESSFULLY_PRINTED = "Warrant saved successfully.  Warrant already printed and should be sent to foreign court.";
    
/**
 * A warrant has been updated successfully, and the executing court has changed, and the warrant has been sent to the foreign court
 */
Messages.WARRANT_UPDATED_SUCCESSFULLY_TRANSFERRED = "Warrant saved successfully.  Warrant sent to foreign court.";

/**
 * A manually entered foreign warrant has been updated successfully, and the executing court has changed
 */
Messages.WARRANT_UPDATED_SUCCESSFULLY_FOREIGN = "Manually entered foreign warrant should be sent to foreign court.";

/**
 * A warrant has been updated successfully, and the executing court has changed, but is a reissued Warrant so no transfer
 */
Messages.WARRANT_UPDATED_SUCCESSFULLY = "Warrant saved successfully.";

/**
 * A foreign warrant was created successfully with a given warrant number.
 */
Messages.FOREIGN_WARRANT_CREATED_SUCCESSFULLY = "Warrant created successfully.  Local Warrant number is XXX."; // The XXX gets replaced by the new warrant number.

/**
 * A home warrant was re-issued successfully with a given warrant number.
 */
Messages.WARRANT_REISSUED_SUCCESSFULLY = "Warrant re-issued successfully.  Re-issued warrant number is XXX."; // The XXX gets replaced by the new warrant number.

/**
 * Message displayed when user attempts to reissue a foreign warrant
 */
Messages.REISSUE_FOREIGN_WARRANT_MESSAGE = "Foreign warrants cannot be reissued.";

/**
 * The issue date of a warrant is more than 1 year in the past 
 */
Messages.ISSUE_DATE_1_YEAR_AGO = "Issue date is more than 1 year in the past.";

/**
 * The selected warrant is owned by a court other than the users home court
 */
Messages.WRONG_WARRANT_COURT = "This warrant does not belong to your court.";

/**
 * Warning message used when the user tries to change the issue date to a value more than 11 months in the past
 */
Messages.WARRANT_11_MONTHS_OLD = "Warrant now more than 11 months old.";

/**
 * Confirm message used to confirm the automatic transfer of a case
 */
Messages.CONFIRM_AUTOMATICTRANSFER_MESSAGE = "Case details will be transferred automatically. \nClick Ok to confirm the transfer or Cancel to abort.";

/**
 * Confirm message used to confirm the cancel of a pending transfer
 */
Messages.CONFIRM_CANCELTRANSFER_MESSAGE = "Are you sure you want to cancel the case transfer?";

/**
 * Warning message notifying users they cannnot change a Transfer To Court whilst the case is pending transfer
 */
Messages.WARNING_TRANSFERPENDING_MESSAGE = "You cannot change Transfer To Court while case is pending transfer.";

/**
 * Existing PER Details have already been set warning message
 */
Messages.AE_PERDETAILSALREADYSET_MESSAGE = "Warning - PER Details have already been set.";

/**
 * Totals Fees exceeded for an AE Amount
 */
Messages.AE_TOTALFEESEXCEEDED_MESSAGE = "Fee entered is not the standard issue fee for an AE application.";

/**
 * Save indicator for AE update.
 */
Messages.AE_SAVED_MESSAGE = "AE application successfully saved.";

/**
 * Save indicator for AE update.
 */
Messages.AE_CREATED_MESSAGE = "AE number {0} saved successfully";

/**
 * No N55 has been served on the AE Record
 */
Messages.AE_NON55SERVED_MESSAGE = "No N55 served.";

/**
 * An event with the same receipt date, same event id and same issue stage as an existing event has been created
 * warning message.
 */
Messages.AE_NOTICEALREADYISSUED_MESSAGE = "A notice of this type has already been issued - check issue stage.";

/**
 * Response has been filed message
 */
Messages.RESPONSEHASBEENFILED_MESSAGE = "Warning - a response has already been filed for this event.";

/**
 * The service must be 5 days prior to hearing date
 */
Messages.AE_SERVICE5DAYSPRIORTOHRG_MESSAGE = "Service should be at least 5 days prior to hearing date.";

/**
 * Hearing Date has not passed - HRG_TYPE is the hearing type and DD-MON-YYYY is the date of the Hearing
 */
Messages.HRGDATENOTPASSED_MESSAGE = "{0} hearing scheduled for {1}.";

/**
 * A previous order has not been served
 */
Messages.PREVORDERNOTSERVED_MESSAGE = "A previous order has not yet been successfully served.";

/**
 * User to confirm to proceed as no admin order event exists
 */
Messages.CO_NOADMINORDEREVENT_MESSAGE = "No administration order event - do you really wish to proceed?";

/**
 * Dividends should be declared where money is in court ({0} is the amount of money held in court)
 */
Messages.CO_MONEYFORDIVIDEND_MESSAGE = "{0} in court - dividend should be declared before creating order.";

/**
 * No hearings exist for the CO Record
 */
Messages.CO_NOHEARINGSFORCO_MESSAGE = "No hearings exist for this CO record.";

/**
 * The CO record has been transferred
 */
Messages.CO_TRANSFERREDCO_MESSAGE = "This CO has been transferred.  Please ensure that you are updating the correct CO record.";

/**
 * Used in the PER calculator screens (AE & CO) when the user changes the calculated period
 * and all allowances need to be recalculated
 */
Messages.PER_CALCULATED_PERIOD_CHANGED_MESSAGE = "Existing calculations will be recalculated based on the new selected period.\n Do you wish to continue?"

/**
 * Used in the PER calculator screens (AE & CO) when all the liabilities have been selected
 * and no more can be added to the grid
 */
Messages.PER_ALL_LIABILITIES_SELECTED_MESSAGE = "Sorry you cannot add any more liabilities.\n You have selected all the available ones."

/**
 * Used in the PER calculator screens (AE & CO) when the user saves changes and the new total has changed.
 */
Messages.PER_TOTAL_CHANGED_MESSAGE = "Protected Earnings Rate has changed.\nDo you wish to update the previous Protected Earnings Rate?\nClick OK to update."

/**
 * Used in the CO screens
 */
Messages.STATUS_NOT_ALLOW_UPDATE = "No details can be amended or added for this CO Status."

/**
 * Used in the CO screens
 */
Messages.EVENT920_EXISTS_TODAY = "N94 issued - cannot create another debtor address today."

/**
 * Used in the CO screens
 */
Messages.NO_ADDRESS_HISTORY = "No address history exists."

/**
 * Used in the CO screens
 */
Messages.CLEAR_ADDRESS = "Are you sure you wish to clear the address?"

/**
 * Used in the CO screens
 */
Messages.NO_ADDRESS_TO_CLEAR = "There is no address to clear."

/**
 * Used in the CO screens
 */
Messages.ENTER_EMPLOYER_DETAILS = "Please enter employer address details before adding workplace details."

/**
 * Used in the CO screens
 */
Messages.NON_RELEASABLE_MONEY_IN_COURT_MSG = "Warning -  Money is held in court that is not yet releaseable."

/**
 * Used in the CO screens
 */
Messages.RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG = "Releasable money in court. Declare a dividend before adding a debt."

/**
 * Used in the CO screens
 */
Messages.READ_ONLY_CANNOT_ADD = "The screen is in read only mode.  Cannot add details."

/**
 * Used in the CO screens
 */
Messages.NON_RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG = "Warning - Adding a debt ?  Money is held in court that is not yet releaseable. Continue?"
/**
 * Used in the CO screens
 */
Messages.CANNOT_ADD_PARTY = "You need to enter a Case Number, that resides on the system, to be able to add a party."
/**
 * Used in the CO screens
 */
Messages.ERR_RET_CO_MESSAGE = "There was a problem retrieving XXX details.";
/**
 * Used in the CO screens. Failed to load CO data message, used in confirm box
 */
Messages.FAILEDCASEDATALOAD_MESSAGE = "Unable to load data. Do you want to retry or start again?";
/**
 * Used in the CO screens. 
 */
Messages.CLEAR_CONUMBER = "Please clear the CO Number before creating.";
/**
 * Used in the CO screens. 
 */
Messages.PAYMENT_DIVIDEND_IN_PROGRESS = "Payout/dividend declaration in progress for this Consolidation Order.";
/**
 * Used in the CO screens. 
 */
Messages.PREPAYOUT_LIST_RUN = "Warning - Pre-payout List (PPL) already run: to include CO run the PPL.  Payout will reset.";
/**
 * Used in the CO screens. 
 */
Messages.CO_CREATED_SUCCESSFULLY = "CO created successfully.  CO Number is XXX."; // The XXX gets replaced by the new co number.
/**
 * Used in the CO screens. 
 */
Messages.CASE_NOT_FOUND_MESSAGE = "Warning - the system could not find the case on the system.  Please ensure the correct case number was entered.";
/**
 * Used when the user attempts to perform an operation on a service but does not have the required roles
 */
Messages.AUTHORIZATION_FAILED_MESSAGE = "Sorry you do not have the required roles to perform this operation";
/**
 * Used when the user attempts to perform an operation on a service but does not have the required roles
 */
Messages.INVALID_ADD_DEBT_MESSAGE = "Invalid data.  Please ensure the XXX field is correct.";
/**
 * Used in the CO screens. 
 */
Messages.NEED_VALID_COURT_MESSAGE = "Please ensure a valid court has been selected for the CO, before trying to add coded parties";
/**
 * Used in the CO screens. 
 */
Messages.PROBLEM_SAVING_NEW_CO_MESSAGE = "There was a problem saving the new CO.";
/**
 * Used in the CO screens. 
 */
Messages.CHANGES_MADE_MESSAGE = "Changes will be lost. Continue?";
/**
 * Used in the CO screens. 
 */
Messages.NEW_COMPOSITION_MESSAGE = "Warning - new Composition Rate has been applied.  Please check debt amounts before continuing.";
/**
 * Used in the CO screens. 
 */
Messages.CODED_PARTY_SELECTED_NO_ADD_ADDR_MESSAGE = "Can not add a new address when a local coded party has been selected.";
/**
 * Used in the CO screens. 
 */
Messages.CANNOT_NAVIGATE_SAVE_REQUIRED_MESSAGE = "Can not navigate away from the screen when changes have been made. Please save first.";
/**
 * Used in the CO screens. 
 */
Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE = "Can not navigate away from the screen if creating or no CO number exists.";
/**
 * Used in the CO screens. 
 */
Messages.CANNOT_NAVIGATE_CO_MONIESINCOURT_MESSAGE = "Cannot transfer CO if Monies In Court exist.";
/**
 * Used in the CO screens. 
 */
Messages.CANNOT_NAVIGATE_CAEO_MESSAGE = "Can not use the Determination Of Means calculator for CAEO Type Consolidation Orders.";
/**
 * Used in the PER screens. 
 */
Messages.PER_MAX_TOTAL_EXCEEDED_MESSAGE = "Sorry, you cannot save because the total is bigger than the maximum allowed. The maximum size is 99999.99";
Messages.CO_STATUS_DIS = "CO status set to DISMISSED";
Messages.CO_STATUS_STRUCK = "CO status set to STRUCK OUT";

/**
 * Used in the Suitors Cash screens. 
 */
Messages.NO_ENFORCEMENTS_FOUND = "No enforcements found matching input criteria.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.ERROR_SAVING_PAYMENT = "Error - Cannot save payment.\nPayment has not been saved.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.ERROR_PERFORMING_SEARCH = "Error performing search.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CHEQUE_AGAINST_AO_WARNING = "Warning - Payment by cheque against AO/CAEO.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.PLAINTIFF_AS_PAYEE_WARNING = "Warning - Claimant selected as payer.\nCheck payee details are correct.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.DETAILS_SENT_TO_CAPS = "Error - Order details have already been sent to CAPS.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CO_IN_FORCE_WARNING = "Warning - There is an AO/CAEO in force.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CO_NOT_LIVE_ERROR = "Error - The status of the CO is not live.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.ENFORCEMENT_NOT_SELECTED = "A Case/Enforcement No must be selected first.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.NAVIGATION_CASE_NOT_ALLOWED = "Cannot navigate to Case for enforcement type 'CO'.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.NAVIGATION_CASE_EVENTS_NOT_ALLOWED = "Cannot navigate to Case Events for enforcement type 'CO'.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.MUST_SELECT_WARRANT = "A Home/Foreign Warrant must be selected first.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.ENFORCEMENT_MUST_BE_WARRANT = "Case/Enforcement type must be Home/Foreign Warrant.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_NAVIGATE_AE = "Cannot navigate to AE for enforcement type 'CO'.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_NAVIGATE_CO = "Can only navigate to CO for enforcement type 'CO'.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.MUST_BE_IN_QUERY_MODE = "Must be in query/search mode.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.NO_PAYMENTS_FOUND = "No payments found matching input criteria.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.OVERPAYMENT_CLEARED_WARNING = "Warning - Overpayment no longer exists.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.OTHER_OVERPAYMENTS_EXIST_WARNING = "Warning - There are other overpayment(s) to\nbe resolved on this enforcement.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.NO_FURTHER_AMENDMENTS_POSSIBLE = "Please note - No further amendments may be\nmade once this change has been commited.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.OVERPAYMENTS_EXIST_WARNING = "Please note - there are overpayment(s) to\nbe resolved on this enforcement.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.PAID_OR_TRANSFERRED_WARNING = "Warning - This case is either paid or transferred.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_GET_OVERPAYMENTS_WARNING = "Warning - Cannot retrieve overpayment information.\nAdditional overpayments may exist on this enforcement.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_SAVE_OVERPAYMENT_ERROR = "Error - Cannot save overpayment.\nChanges may not be saved.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.NO_OVERPAYMENTS_FOUND = "No overpayments found matching input criteria.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.PRE_MAINTAIN_CHECKS_ERROR = "Error - Unable to perform pre-update system checks.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CALL_CASE_NOT_ALLOWED = "Call to Case not allowed for this enforcement type.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.PAYOUT_BEFORE_RELEASE_DATE_WARNING = "Warning - System date is prior to release date.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.OVERPAYMENT_EXISTS = "An overpayment exists on this transaction.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.MUST_BE_PAID_IN_ERROR = "This is a CO payment – reason for\npayout can only be PAID IN ERROR.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_LOAD_PAYMENT_ERROR = "Error - Cannot load payment.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_SAVE_PAYOUT_ERROR = "Error - Cannot save payout.\nPayout may not be saved.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.UPDATE_PAYEE_DETAILS_WARNING = "Warning - Relevant CASE or WARRANT payee\ndetails may need to be updated.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.SCUSER_LOGGED_ON_ERROR = "Error - A user with this ID is currently accessing this screen.\nScreen will now exit.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.REPORT_DATA_CREATE_ERROR = "Error - Cannot read/populate REPORT_DATA table.\nScreen will now exit.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.REPORT_DATA_UPDATE_ERROR = "Error - Cannot update REPORT_DATA table.\nPayment has not been saved.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.REPORT_DATA_DELETE_ERROR = "Error - Cannot update REPORT_DATA table.\nPlease try to exit again.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.START_OF_DAY_CHECK_ERROR = "Error - Cannot check if Start of Day has ran.\nScreen will now exit.";
/**
 * Used in the Suitors Cash screens. 
 */
 Messages.END_OF_DAY_RAN_ERROR = "Today's End of Day has been run.\nScreen will now exit.";
/**
 * Used in the Suitors Cash screens. 
 */
 Messages.END_OF_DAY_CHECK_ERROR = "Error - Cannot check if End of Day has been run.\nScreen will now exit.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.EXIT_CREATE_UPDATES_ERROR = "Error - Cannot perform pre-exit table updates.\nPlease try to exit again.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CAP_INPUT_PRODUCED = "A CAPS input form has been produced for this AE";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CASE_PAID_TRANFERRED = "This case is either paid or transferred";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CANNOT_GET_VER_REP_ID_ERROR = "Error - Cannot retrieve verification report ID.\nPayment has not been saved.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.CO_OWNING_COURT_ERROR = "Error - Payments on Consolidated Orders can only be taken on those owned by your court.";
/**
 * Used in the Suitors Cash screens. 
 */
Messages.OTHER_TRANSACTIONS_ERROR = "Error - This payment has been amended by another user. Please reload the payment and try again.";
/**
 * Confirm message for changing the local coded party details. 
 */
Messages.CONFIRM_REPLACE_CODEDPARTY_MESSAGE = "Please confirm you wish to replace the details of party {0} with the details of party {1}.";
/**
 * Used in confirm box on the Maintain Court Data screen. 
 */
Messages.CONFIRM_DELETE_COURT_ADDRESS = "Are you sure you want to delete the currently selected court address?";
/**
 * Used in confirm box on the Maintain Non Working Days screen. 
 */
Messages.CONFIRM_DELETE_NONWORKINGDAY = "Are you sure you want to remove this non-working day?";
/**
 * Maintain user profiles message, used when creating the user record in the Caseman database from an existing AD user
 */
Messages.CONFIRM_CREATE_NEW_USER_MESSAGE = "User {0} exists in link but has not been created in the database. Would you like to create this user in the database?";
/**
 * Maintain user profiles message, used when reactivating a user in the Caseman database
 */
Messages.CONFIRM_REACTIVATE_USER_MESSAGE = "Are you sure that you want to reactivate the user profile for user {0} ?";
/**
 * Maintain user profiles message, used when deactivating a user in the Caseman database
 */
Messages.CONFIRM_DEACTIVATE_USER_MESSAGE = "Are you sure you want to deactivate this user ?";

/**
 * Warning message informing the user the case they wish to transfer has a non sups 
 * party linked to an AE and must be transferred manually.
 */
Messages.MANUAL_TRANSFERCASE_AE_MESSAGE = "Cannot transfer case as it has an AE linked to a party which cannot be accepted by a non SUPS court.  Case must be transferred manually.";

/**
 * Delete End of Day Record message, used to confirm Delete
 */
Messages.DELETE_ENDOFDAY_CONFIRM_MESSAGE = "Click Ok to confirm delete.";

/**
 * Save before proceeding message
 */
Messages.SAVE_BEFORE_PROCEED_MESSAGE = "Please save changes before proceeding.";

/**
 * Save before proceeding message
 */
Messages.PTHROUGH_CO_MONEY_IN_COURT_MESSAGE = "You cannot create or maintain passthrough payments on this Consolidated Order as there is money in court.";

/**
 * For updating judgments of determination, subject and instigator must match party against & party for on judgment message
 */
Messages.INVALID_SUBJECT_INSTIGATOR_COMB_MESSAGE = "The combination of parties for and party against does not match a valid judgment of type DETERMINATION";

Messages.AE_CASESTATUSPAID_MESSAGE = "Case has been paid.";
Messages.AE_CASESTATUSSETTLED_MESSAGE = "Case has been settled/withdrawn.";
Messages.AE_CASESTATUSTRANSFERRED_MESSAGE = "Case has been transferred.";

Messages.CONFIRM_CASES_DATEOFSERVICE_MESSAGE = "Date of Service is less than 2 days after the Date of Issue. Are you sure?";

Messages.ROP_SINGLEDOCUMENTPRINTED_MESSAGE = "Document Printed";
Messages.ROP_MULTIPLEDOCUMENTSPRINTED_MESSAGE = "All Documents Printed";
Messages.ROP_NOPRINTERSET_MESSAGE = "Cannot print.  User does not have a default printer allocated.";

Messages.QA_CONFIRM_INVALIDFEES_MESSAGE = "Total Costs exceed Issue Fee plus Issue Costs plus Judgment Fixed Costs.\nClick Ok to re-enter amounts or Cancel to error the event and return to the Events screen.";

Messages.INSOLVENCY_NUMBER_NOT_FOUND = "Case with insolvency number\n\n{0}\n\nNot Found in {1}";
Messages.INSOLVENCY_NUMBER_EXISTS = "Insolvency Number {0} already exists in {1}";
Messages.INSOLVENCY_NUMBER_REQUIRED = "Insolvency Number required to be added by {0} court - This case needs an Insolvency Number before proceeding";

/**
 * Pending Transfer messages (Trac 4692)
 */
Messages.TRANSFER_PENDING_ALERT = "This case is currently pending transfer. Please use the Transfer Cases screen to complete or cancel the transfer.";
Messages.TRANSFER_PENDING_CONFIRM = "Case is currently pending transfer. Click Ok to complete the transfer or click Cancel to reset the transfer and start again.";

/*************************** CCBC MESSAGES **********************************/

Messages.EXITAPPLICATION_MESSAGE = "Are you sure you want to exit?";
Messages.INVALID_CASE_NUMBER_MESSAGE = "Case Number must consist of alphabetic and numeric characters only. Query not issued.";
Messages.INVALID_FILE_SEQ_NO_MESSAGE = "File Sequence Number must be numeric. Query not issued.";
Messages.INVALID_CREDITOR_CODE_MESSAGE = "Creditor Code must consist of 4 digits. Query not issued.";
