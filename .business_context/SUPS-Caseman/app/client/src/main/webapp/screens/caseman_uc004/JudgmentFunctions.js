/** 
 * @fileoverview function JudgmentFunctions.js:
* This files defines a class to represent all common functions used by the 
* Judgment.js file.
* Done this way to improve performance.
 *
 * @author Mark Groen
 * @version 1.0
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, Updated isCCBCCourt() to use the CaseManUtils
 *              CCBC Court constant instead of the JudgmentVariables constant
 *				has has since been removed.
 * 20/06/2006 - Chris Vincent, Added JudgmentFunctions.allJudgmentsPaidInFull to fix defect
 *				3634 which states that event 79 should only be fired when ALL Judgments have
 *				a date in the Paid In Full field.
 * 02/08/2006 - Mark Groen, Defect 4124 -  - stop multi loads of Services.loadDOMFromURL("TempEditJudgment.xml")
 *				Now only loaded if node have not been set up previously.
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 04/10/2006 - Mark Groen, fixed defect 5580 - Ensure can handle calling screens not providing case number
 * 11/10/2006 - Frederik Vandendriessche, Mark Groen, UCT 498
 * 27/11/2006 - Mark Groen uct 744, allow part 20 defendants and part 20 claimants to be added to a Judgment
 * 18/01/2007 - Mark Groen tmp_caseman 318 (in part), ensure that navigate from screen correctly when closing.
 * 23/01/2007 - Chris Vincent, updated the JudgmentFunctions.transformToDisplayCurrency() function so uses the
 * 				global CaseManUtils function to transform currency fields.  Temp_CaseMan defect 309.
 * 04/05/2007 - Mark Groen - CCBC DEFECT 1337. Extra validation re Judgment costs. 
 *				Added following functions:-
 *				JudgmentFunctions.isCCBCCourtForAddJudgment
 *				JudgmentFunctions.isJudgmentCostValid
 *				Amended:
 *				JudgmentFunctions.loadJudgmentReferenceData
 * 05/07/2007 - Chris Vincent, UCT_Group2 Defect 1367.  Change to JudgmentFunctions.calculateStatus() as for CCBC Cases
 * 				the judgment status should not be changed to PAID.
 * 09/07/2007 - Chris Vincent, CaseMan Defect 6263 - changes to setWordProcessingFlags() and setupWordProcessingXML() to make
 * 				use of JudgmentVariables.WPO31251.  This ensures for CCBC, an output is produced for CCBC.
 * 03/09/2007 - Chris Vincent, added checkOutstandingPaymentsExist() to replace the existing outstanding payments
 * 				validation in the MenuBarCode.  CaseMan Defect 6420.
 * 16/10/2007 - Mark Groen, Amended JudgmentFunctions.allJudgmentsPaidInFull to fix defect ccbc grp2 1602
 * 				which states that the case status should only be updated when all judgments have been paid and all defendants have had 
 * 				judgment against them.
 * 07/11/2007 - Mark Groen, Amended JudgmentFunctions.isAddApplicationAllowed to fix defect ccbc grp2 1549 (maintenaince release),
 * 				which states that for ccbc cases, the user should be allowed to still make the judgment 'set aside', when the judgment
 * 				had a status of CANCELLED and SATISFIED
 * 
 * 05/03/2008 - Mark Groen - DEFECT 6510. Added JudgmentFunctions.oneMonthInFutureForStatusCalc, to calculate the judg status coorrectly.
 *
 * 29-07-2009 Chris Vincent - Remove checkOutstandingPaymentsExist()  and associated onSuccess function as validation
 *		    check no longer required.  See TRAC Ticket 1155.
 */

/**
 * @constructor
 * @author rzhh8k
 * 
 */
function JudgmentFunctions()
{
}

/**
 * Sets the current row selected in the grid. Stored so can revert to when saving changes
 * @param pJudgment
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setJudgmentToSave = function(pJudgment)
{
	Services.setValue(JudgmentVariables.JUDGMENT_TO_SAVE, pJudgment);
}
/**
 * Sets the add judgment flag
 * @param pAdding - Y or N
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setAddJudgment = function(pAdding)
{
	Services.setValue(JudgmentVariables.ADDING_JUDGMENT_PATH, pAdding);
}
/**
 * Sets the save new Judgment flag.  Used to determine which service to call
 * @param pAdding - Y or N
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setSaveNewJudgment = function(pAdding)
{
	Services.setValue(JudgmentVariables.SAVING_NEW_JUDGMENT_PATH, pAdding);
}
/**
 * Sets the flag
 * @param pAdding - Y or N
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setSaveMsgDisplayedPath = function(pDisplayed)
{
	Services.setValue(JudgmentVariables.SAVE_MSG_PATH, pDisplayed);
}
/**
 * Sets the has status changed flag. Stored so can ceate the correct event when saving.
 * @param pChanged
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setJudgmentStatusChanged = function(pChanged)
{
	Services.setValue(JudgmentVariables.STATUS_CHANGED_PATH, pChanged);
}

/**
 * Sets the 'has status changed' flag. Stored so can ceate the correct event when saving.
 * @return boolean representing if changed
 * @author rzhh8k
 */
JudgmentFunctions.hasJudgmentStatusChanged = function()
{
	var changed = Services.getValue(JudgmentVariables.STATUS_CHANGED_PATH);
	if(changed != null && changed == JudgmentVariables.YES){
		changed = true;
	}
	return changed;
}
/**
 * Gets the flag that defines whether adding or not
 * @return Y or N
 * @author rzhh8k
 */
JudgmentFunctions.getAddJudgment = function()
{
	var adding = Services.getValue(JudgmentVariables.ADDING_JUDGMENT_PATH);
	return adding;
}
/**
 * Gets the flag that defines whether just saved a new Judgment
 * @return Y or N
 * @author rzhh8k
 */
JudgmentFunctions.getSaveNewJudgment = function()
{
	var newJudg = Services.getValue(JudgmentVariables.SAVING_NEW_JUDGMENT_PATH);
	return newJudg;
}
/**
 * Gets the current row selected in the grid. Required when saving changes
 * @author rzhh8k
 * @return row  
 */
JudgmentFunctions.getJudgmentToSave = function()
{
	var row = Services.getValue(JudgmentVariables.JUDGMENT_TO_SAVE);
	return row;
}
/**
 * Works out if the message has already been displayed to the user
 * @param pPath the xpath of the flag representing whether the msg  has been shown
 * @return boolean
 * @author rzhh8k
 */
JudgmentFunctions.hasMsgBeenShown = function(pPath)
{
	var shown = false;
	var shownValue = Services.getValue(pPath);
	if(shownValue != null && shownValue == JudgmentVariables.YES){
		shown = true;
	}
	return shown;
}

/**
 * Resets the all flags when saving
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetFlags = function()
{
	Services.startTransaction();
	JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_VARY_TMP_PATH, false);
	// need to reset event 55
	Services.setValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED, JudgmentVariables.NO);
	// need to RESET  event 79 flag
	Services.setValue(JudgmentVariables.FINAL_PAYMENT_MADE, JudgmentVariables.NO);
	// need to RESET  event 140 flag
	Services.setValue(JudgmentVariables.APP_TO_VARY_MADE, JudgmentVariables.NO);
	// need to reset event 150
	Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.NO);
	// need to reset event 155
	Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.NO);	
	// need to RESET  event 160 flag
	Services.setValue(JudgmentVariables.SET_ASIDE_ADDED_PATH, JudgmentVariables.NO);
	// need to RESET  event 170 flag
	Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.NO);
	// set the Hearing flag to N
	Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.NO);	
	// need to RESET  event 200 flag
	Services.setValue(JudgmentVariables.HEARING_EVENT_REQUIRED_PATH, JudgmentVariables.NO);
	// need to RESET  event 375 flag
	Services.setValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED, JudgmentVariables.NO);
	
	JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.NO);
	
	Services.removeNode("/ds/MaintainJudgment");
	Services.removeNode("/ds/var/page/Tmp");
	Services.removeNode(JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH);
	Services.endTransaction();
}

/**
 * Sets the flag to the value of the param passed in 
 * The flag is used to determined whether 
 * the cancel message should be displayed - i.e. is there any need for the cancel message.
 * Have any changes been made.
 *
 * @param pValue Either Y or N
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setCancelMessage = function(pValue)
{
	Services.setValue(JudgmentVariables.DISPLAY_CANCEL_MESSAGE, pValue);
}
/**
 * Is cancel message to be displayed or not
 *
 * @return boolean 
 * @author rzhh8k
 */
JudgmentFunctions.displayCancelMessage = function()
{
	var valueStored = Services.getValue(JudgmentVariables.DISPLAY_CANCEL_MESSAGE);
	var display = false;
	if(valueStored != null && valueStored == JudgmentVariables.YES){
		display = true;
	}
	return display;
}
/**
 * Sets the SaveRequired flag to the value of the param passed in 
 * The flag is used to determined whether 
 * a Judgment should be saved before the user continues
 *
 * @param pValue Either Y or N
 * @param pArea the area saving - judgment, aside or vary
 * @param pSaveBtnPopupSelected - if an add button has been selected, need to set
 *					             the flag that tells us a permanent save is required
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setSaveRequired = function(pValue, pArea, pSaveBtnPopupSelected)
{	
	if(pArea == JudgmentVariables.APP_TO_VARY){		
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_VARY_PATH, pValue);
	}
	else if(pArea == JudgmentVariables.APP_TO_SET_ASIDE){
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_SET_ASIDE_PATH, pValue);
	}
	else if(pArea == JudgmentVariables.EDIT_JUDGMENT){
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_PATH, pValue);
	}
	else{
		// set all to value
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_VARY_PATH, pValue);
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_SET_ASIDE_PATH, pValue);
		Services.setValue(JudgmentVariables.SAVE_REQUIRED_PATH, pValue);
	}
	if(pSaveBtnPopupSelected == true){
		Services.setValue(JudgmentVariables.POPUP_SAVE_REQUIRED_PATH, pValue);
	}
} 
/**
 * Checks the SaveRequired flag for set aside applications
 * The flag is used to determined whether there is a need to show a message when canceling
 * and whether need for a save on the main Judgment screen
 * returns boolean representing whether save required or not
 * @author rzhh8k
 * @return saveRequired  
 */
JudgmentFunctions.isSaveRequiredSetAside = function()
{
	var saveRequired = false;
	var setAside = Services.getValue(JudgmentVariables.SAVE_REQUIRED_SET_ASIDE_PATH);
	if(setAside != null && setAside == JudgmentVariables.YES){		
		saveRequired = true;
	} // end if(value != null ...
	return saveRequired;
}

/**
 * Checks the SaveRequired flag for vary applications
 * The flag is used to determined whether there is a need to show a message when canceling
 * and whether need for a save on the main Judgment screen
 *
 * returns boolean representing whether save required or not
 * @author rzhh8k
 * @return saveRequired  
 */
JudgmentFunctions.isSaveRequiredVary = function()
{
	var saveRequired = false;
	var vary = Services.getValue(JudgmentVariables.SAVE_REQUIRED_VARY_PATH);
	if(vary != null && vary == JudgmentVariables.YES){
		saveRequired = true;
	} // end if(value != null ||...
	return saveRequired;
}
/**
 * Checks the SaveRequired flag
 * The flag is used to determined whether 
 * a Judgment should be saved before the user continues
 *
 * returns boolean representing whether save required or not
 * @author rzhh8k
 * @return saveRequired  
 */
JudgmentFunctions.isSaveRequired = function()
{
	var saveRequired = false;
	var edit = Services.getValue(JudgmentVariables.SAVE_REQUIRED_PATH);	
	if(edit != null && edit == JudgmentVariables.YES){
		saveRequired = true;
	} // end if(value != null || value != ""){
	
	if(saveRequired ==  false){
		// check if need to save because of set aside changes 
		saveRequired = this.isSaveRequiredSetAside();
	}
	
	if(saveRequired ==  false){
		// check if need to save because of variation changes 
		saveRequired = this.isSaveRequiredVary();
	}
	
	if(saveRequired ==  false){
		var popupSave = Services.getValue(JudgmentVariables.POPUP_SAVE_REQUIRED_PATH);
		// check if need to save because a save btn on popup selected - vary and set aside
		if(popupSave != null && popupSave == JudgmentVariables.YES){
			saveRequired = true;
		}		
	}	
	
	return saveRequired;
}

/**
 * This function ensures a date is transformed so that it can be validated correctly.
 * If it is not valid it returns the original value so it is displayed correctly to 
 * the user. I.e. They can see what they entered was incorrect
 *
 * @param pDate the date to convert
 * @return Converted correctly or, if not, returns the original value passed in
 * @author rzhh8k
 */
JudgmentFunctions.transformToModelDate = function(pDate)
{
	var convertedDate = pDate;
	if(null != pDate && pDate.search(CaseManValidationHelper.DDMMMYYYY_DATE_PATTERN) != -1){
		convertedDate = CaseManUtils.convertDateToModel(pDate);
		if(convertedDate == null){
			// problem converting date so save value entered by the user
			convertedDate = pDate;
		}
	}
	return convertedDate;
}

/**
 * This function ensures a date is transformed so that it can be stored in the DOM correctly.
 * If it is not valid it returns the original value so it is displayed correctly to 
 * the user. I.e. They can see what they entered was incorrect
 *
 * @param pDate the date to convert
 * @return Converted correctly or, if not, returns the original value passed in
 * @author rzhh8k
 */
JudgmentFunctions.transformToDisplayDate = function(pDate)
{
	var returnDate = pDate;
	if(pDate != null && pDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1){		
		returnDate = CaseManUtils.convertDateToDisplay(pDate);
		if(returnDate == null){
			returnDate = pDate;
		}
	}
	return returnDate;
}

/**
 * This function converts the value in the DOM to be the correct currency character
 *
 * @param pCurrency the currency to be converted
 * @return Converted currency symbol
 * @author rzhh8k
 */
JudgmentFunctions.transformToDisplayCurrency = function(pCurrency)
{
	// Use the global CaseManUtils transform function
	return CaseManUtils.transformCurrencySymbolToDisplay(pCurrency, JudgmentVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/**
 * This function checks a given flag and sets it if necessary 
 *
 * @param pFlag the xpath of where the 'is changed flag' is stored
 * @param pEvent used to see what databinding called the function
 * @param pDataBinding The databinding of the field
 * @return boolean representing
 * @author rzhh8k
 */
JudgmentFunctions.fieldChangedBefore = function(pFlag, pEvent, pDataBinding)
{
	var changedBefore = true;
	var changeFlag = Services.getValue(pFlag);
	if(changeFlag == null || changeFlag == JudgmentVariables.NO){
		// if the flag is not set to changed - set the changed flag if we are  
		// tabbing/changing focus from the field.
		if(pEvent.getXPath()== pDataBinding){
			Services.setValue(pFlag, JudgmentVariables.YES);
			changedBefore = false;
		}
	}
}

/**
 * This function copies all the Application To Vary Data into a temporary area when editing.
 * This is required for setting the read only attributtes correctly and also resetting the 
 * DOM if the user selectes to cancel any changes.
 *
 * @param pJudgment The selected Judgments suurrogate id
 * @param pEventused to see what the databinding called the function
 * @param pDataBinding The databinding of the field
 * @author rzhh8k
 * 
 */
JudgmentFunctions.createTmpAppToVary = function(pJudgment)
{
 	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + pJudgment + "]/ApplicationsToVary";
 	// get a list of all the variations
	var idList = Services.getNodes(applicationsXP + "/Variation/VarySurrogateId");
	if(idList != null && idList.length != 0){
		// Loop through the list and call the copySingleVariation to add the variation to temp part of dom
		for(var i = 0; i < idList.length; i++){
			id = idList[i].text;	
			this.copySingleVariation(applicationsXP, id);
 		}// for
 	}// if(idList != null && idList.length != 0){
}

/**
 * This function copies all the Application To Set Aside Data into a temporary area when editing.
 * This is required for setting the read only attributtes correctly and also resetting the 
 * DOM if the user selectes to cancel any changes.
 *
 * @param pJudgment The selected Judgments suurrogate id
 * @param pEventused to see what the databinding called the function
 * @param pDataBinding The databinding of the field
 * @author rzhh8k
 * 
 */
JudgmentFunctions.createTmpAppSetAside = function(pJudgment)
{
 	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + pJudgment + "]/ApplicationsToSetAside";
 	// get a list of all the applications
	var idList = Services.getNodes(applicationsXP + "/Application/AsideSurrogateId");
	
	if(idList != null && idList.length != 0){
		// Loop through the list and call the copySingleVariation to add the variation to temp part of dom
		for(var i = 0; i < idList.length; i++){
			id = idList[i].text;
			this.copySingleSetAside(applicationsXP, id);
 		}// for
 	}// if(idList != null && idList.length != 0){
}


/**
 * This function copies the Application To Vary Data from the main part of the DOM
 * into the temporary area when editing.
 * This is required for setting the read only attributtes correctly and also resetting the 
 * DOM if the user selectes to cancel any changes.
 *
 * @param pXP the xpath to the applications to vary on the judgment
 * @param pID the id of the variation
 * @author rzhh8k
 * 
 */
JudgmentFunctions.copySingleVariation = function(pXP, pID)
{
	// First ensure not already there
	var idThere = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = '" + pID + "']/VarySurrogateId");
	if(idThere == null || idThere == ""){
		// not there so carry on.

		// Take a copy of the node and pass it to the temporary area of the DOM
		var newApp = CaseManUtils.getValidNodeValue(Services.getValue(pXP + "/Variation[./VarySurrogateId = '" + pID + "']/NewApp"));
		Services.setValue(pXP + "/Variation[./VarySurrogateId = '" + pID + "']/NewApp", newApp);
		var tmpVariation = Services.getNode(pXP + "/Variation[./VarySurrogateId = '" + pID + "']");
		Services.addNode(tmpVariation, JudgmentVariables.APP_TO_VARY_TMP_PATH);
		
	}// end of if(idThere != null && idThere != ""){
}

/**
 * This function copies the Application To Set aside Data from the main part of the DOM
 * into the temporary area when editing.
 * This is required for setting the read only attributtes correctly and also resetting the 
 * DOM if the user selectes to cancel any changes.
 *
 * @param pXP the xpath to the applications to set aside on the judgment
 * @param pID the id of the application
 * @author rzhh8k
 * 
 */
JudgmentFunctions.copySingleSetAside = function(pXP, pID)
{
	// First ensure not already there	
	var idThere = Services.getValue(JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH + "/Application[./AsideSurrogateId = '" + pID + "']/AsideSurrogateId");
	if(idThere == null || idThere == ""){
		// not there so carry on.

		// Get a copy of the Application to Set Aside to place in the temporary area
		var tmpApplication = Services.getNode(pXP + "/Application[./AsideSurrogateId = '" + pID + "']");
		
		// now add it to the tmp area
		// Add the entire Appication branch to the tmp node
		Services.addNode(tmpApplication, JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH);
	}// end of if(idThere != null && idThere != ""){
}

/**
 * This function copies the Editable Data from the main part of the DOM
 * into the temporary area when editing.
 * This is required for setting the read only attributtes correctly. 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.copyEditFields = function()
{	
	// defect 4124 - stop multi loads of  Services.loadDOMFromURL("TempEditJudgment.xml")
	// No need to reset edit fields as now up date as part of defect 4124
	//this.resetEditFields();
	var root = "/EditJudgment";	
		
	// Set up data in the Tmp part of DOM
	var dateRTL = CaseManUtils.getValidNodeValue(Services.getValue(JudgmentDetails_DateToRTL.dataBinding));
	var paidInFull = CaseManUtils.getValidNodeValue(Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding));
	var notDate = CaseManUtils.getValidNodeValue(Services.getValue(JudgmentDetails_NotReceiptDate.dataBinding));
	var status = CaseManUtils.getValidNodeValue(Services.getValue(JudgmentDetails_Status.dataBinding));
	
	// Is there any data already there - - check required for defect 4124
	if(Services.exists("/ds/var/page/Tmp/EditJudgment") == false){	
		// Set new part of DOM
		var tmpEditJudgment = Services.loadDOMFromURL("TempEditJudgment.xml");
		
		tmpEditJudgment.selectSingleNode(root + "/DateRTL").appendChild(
			tmpEditJudgment.createTextNode(dateRTL));
		tmpEditJudgment.selectSingleNode(root + "/DatePaidInFull").appendChild(
			tmpEditJudgment.createTextNode(paidInFull));
		tmpEditJudgment.selectSingleNode(root + "/NotReceiptDate").appendChild(
			tmpEditJudgment.createTextNode(notDate));
		tmpEditJudgment.selectSingleNode(root + "/Status").appendChild(
			tmpEditJudgment.createTextNode(status));		
			
		// now add it to the tmp area
		// Add the entire Appication branch to the tmp node
		Services.addNode(tmpEditJudgment, "/ds/var/page/Tmp");
	}
	else{
		// defect 4124 - stop multi loads of  Services.loadDOMFromURL("TempEditJudgment.xml")
		Services.setValue("/ds/var/page/Tmp" + root + "/DateRTL", dateRTL);
		Services.setValue("/ds/var/page/Tmp" + root + "/DatePaidInFull", paidInFull);
		Services.setValue("/ds/var/page/Tmp" + root + "/NotReceiptDate", notDate);
		Services.setValue("/ds/var/page/Tmp" + root + "/Status", status);
	}

}

/**
 * This function clears the Editable Data from the tmp part of the DOM
 * This is required for setting the read only attributtes correctly and also resetting the 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetEditFields = function()
{
	Services.removeNode(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH);	
}

/**
 * This function checks whether an App To Vary field 
 * should be read only or not.  It does this by looking to see if a field 
 * has alreday been entered on a previous visit to the screen, in this 
 * session or in a previous one.
 *
 * @param pField The name of the fields corresponding value in the tmp area of the dom
 * 				 E.g. ClaimResp, Objector
 * @param pCheckresult Boolean representing whether need to check the result field. 
 * 					   I.e. if result entered no need to do processing.
 * @param pGridDataBinding The grids databinding for building the xpath
 * @return boolean representing if field should be read only or not
 * @author rzhh8k
 */
JudgmentFunctions.isReadOnlyAppToVaryField = function(pField, pCheckresult, pGridDataBinding)
{
	var fieldTmpXp = JudgmentVariables.APP_TO_VARY_TMP_PATH + 
											"/Variation[./VarySurrogateId = " + pGridDataBinding + "]/" + pField;
	var readOnly = false;
	var tmp = Services.getValue(fieldTmpXp);	
	
  	if(pCheckresult == true){
  		var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + pGridDataBinding + "]/Result");  		
  		if((tmp != null && tmp != "") || (tmpResult != null && tmpResult != "")){
			readOnly = true;
		}
		
  	}// if(pCheckresult == true){
  	else{  	
  		if(tmp != null && tmp != ""){
			readOnly = true;
		}		
  	}//else{
  	 	
	return readOnly;
}
/**
 * This function checks whether an Editable field 
 * should be read only or not.  It does this by looking to see if a field 
 * has alreday been entered on a previous visit to the screen, in this 
 * session or in a previous one.
 *
 * @param pField The name of the field corresponding value in the tmp area of the dom
 * @return boolean representing if field should be read only or not
 * @author rzhh8k
 */
JudgmentFunctions.isReadOnlyEditField = function(pField)
{
	var fieldTmpXp = JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/" + pField;
	var readOnly = false;
	var tmp = Services.getValue(fieldTmpXp);
	
  	if(tmp != null && tmp != ""){
		readOnly = true;
	}
	
	return readOnly;
}

/**
 * This function checks whether an App To Set aside field 
 * should be read only or not.  It does this by looking to see if a field 
 * has alreday been entered on a previous visit to the screen, in this 
 * session or in a previous one.
 *
 * @param pField The name of the fields corresponding value in the tmp area of the dom
 * 				 E.g. Result
 * @param pGridDataBinding The grids databinding for building the xpath
 * @return boolean representing if field should be read only or not
 * @author rzhh8k
 */
JudgmentFunctions.isReadOnlyAppToSetAsideField = function(pField, pGridDataBinding)
{
	var fieldTmpXp = JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH + 
											"/Application[./AsideSurrogateId = " + pGridDataBinding + "]/" + pField;
	var readOnly = false;
	var tmp = Services.getValue(fieldTmpXp);
	
  	if(tmp != null && tmp != ""){
			readOnly = true;
  	}
  	
  	return readOnly;
}


/**
 * This function ensures that a currency is in the correct format. e.g. nnn.nn
 *
 * @param pValue the value to display
 * @param pLength The max length of the field transforming
 * @return value for display
 * @author rzhh8k
 */
JudgmentFunctions.transformCurrency = function(pValue)
{
	var returnValue = pValue;
	
	if(returnValue != null && returnValue != "" && !isNaN(returnValue)){
		var fVal = parseFloat(pValue).toFixed(2);		
		if(!isNaN(fVal)){
			returnValue = CaseManUtils.isBlank(pValue) ? "" : fVal;
		}		
		var errCode = this.validateAmount(  returnValue, 
											JudgmentVariables.CURRENCY_MAX_11_PATTERN, // the largest pattern to cover all
											false);// pCheckAmount		
		if(errCode != null){
			returnValue = pValue;
		}
	}
	
	return returnValue;
}


/**
 * This function calculates the sub total for a judgment
 *
 * @param pAmount the amount of the judgment
 * @param pCosts the costs associated with the judgment
 * @return value for display.  return 0 if no values to calc
 * @author rzhh8k
 */
JudgmentFunctions.getSubTotal = function(pAmount, pCosts)
{	
	var subTotal = 0;
	var amount = this.transformCurrency(pAmount);
	var costs = this.transformCurrency(pCosts);
	if(amount != null && amount != "" && amount.search(JudgmentVariables.CURRENCY_MAX_10_PATTERN) != -1){
		subTotal = pAmount;
	}
	
	if(costs != null && costs != "" && costs.search(JudgmentVariables.CURRENCY_MAX_10_PATTERN) != -1){
		if(amount != null && subTotal == pAmount){
			subTotal = parseFloat(amount) + parseFloat(costs);
		}
		else{
			subTotal = costs;
		}
	}
	
	var subTotalToFormat = parseFloat(subTotal).toFixed(2);
	
	if(subTotalToFormat == null || subTotalToFormat == "" || isNaN(subTotalToFormat)){
		subTotalToFormat = 0.00;
	}
	
	var subTotalCorrectFormat = this.transformCurrency(subTotalToFormat);
	
	return subTotalCorrectFormat;
}
/**
 * This function calculates the total for a judgment
 *
 * @param pAmount the amount of the judgment
 * @param pCosts the costs associated with the judgment
 * @param pPaidBefore the amount already paid
 * @return value for display.  return 0 if no values to calc
 * @author rzhh8k
 */
JudgmentFunctions.getTotal = function(pAmount, pCosts, pPaidBefore)
{
	// Add Amount and costs together for sub total	
	var subTotal = this.getSubTotal(pAmount, pCosts);
	var total = 0;
	var totalCorrectFormat;
	
	if(pPaidBefore != null && pPaidBefore != "" && pPaidBefore.search(JudgmentVariables.CURRENCY_MAX_10_PATTERN) != -1){
		total = parseFloat(subTotal) - parseFloat(pPaidBefore);
		var totalToFormat = parseFloat(total).toFixed(2);
		totalCorrectFormat = this.transformCurrency(totalToFormat);
	}
	else{
		// invalid paid before so set to sub total
		totalCorrectFormat = subTotal;
	}
	
	return totalCorrectFormat;
}

/**
 * This function sets up the Parties in Favour of List correctly
 *
 * @param pListXpath The xpath where the list of InFAvourParties can be retreived from
 * @param pParentNode the node in the DOM where they are to be placed under
 * 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setInFavourOf = function(pListXpath, pParentNode)
{
	// Retrieve the list of Ids.
	var idList = Services.getNodes(pListXpath);
	
	if(idList != null && idList.length != 0){
		var idListLength = idList.length;
		// Loop through the list and call relevant validate functions.
		for(var i = 0;i < idListLength; i++){			
			var id = idList[i].text;
			// Get values from DOM
			var root = "/Party";

			// Set new part of DOM
			var tmpParty = Services.loadDOMFromURL("InFavourOfParty.xml");
			
			// Set up data in the Tmp part of DOM
			tmpParty.selectSingleNode(root + "/PartyKey").appendChild(
				tmpParty.createTextNode(id));
			tmpParty.selectSingleNode(root + "/PartyRoleCode").appendChild(
				tmpParty.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/PartyRoleCode"))));
			tmpParty.selectSingleNode(root + "/CasePartyNumber").appendChild(
				tmpParty.createTextNode(CaseManUtils.getValidNodeValue( Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/CasePartyNumber"))));
			tmpParty.selectSingleNode(root + "/Name").appendChild(
				tmpParty.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/Name"))));
		
			// now add it to the tmp area
			Services.addNode(tmpParty, pParentNode);			
		}// end of for
	}//end of if	
}

/**
 * This function resets the infavour of list
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetInFavourOf = function()
{
	var parentNode = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties";
	// Clear the current list
	Services.removeNode(parentNode);
}

/**
 * This function searches through the list of Judgments on the case,
 * to ensure the selected Party Against does not have a current judgment against them where the status is 
 * not SET ASIDE, for a same in favour of party as for the new Judgment
 * 
 * @param pPartyKey - the party selected to be against a new Judgment
 * @return return VALID_AGAINST if valid, return INVALID_AGAINST if already have judgment defined for similar scenario.
 * @author rzhh8k
 */
JudgmentFunctions.isValidAgainstParty = function(pPartyKey)
{
	var valid = true;
	var id = null; // used in for loop
		
	var baseXpath = JudgmentVariables.SUBFORM_JUDGMENT_PATH + "[./SurrogateId = '";
	// Firstly get the list of Judgments 
	var idList = Services.getNodes(JudgmentVariables.SUBFORM_JUDGMENT_PATH + "/SurrogateId");
	// get list of list of parties on the new Judhgment
	var inFavourListNewJudgment = Services.getNodes(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties/Party/PartyKey");
	if(inFavourListNewJudgment != null && inFavourListNewJudgment.length != 0){
		// now loop through each checking whether their is an outstanding Judgment
		// and if so, is it for the Party we are looking for.
		if(idList != null && idList.length != 0){
			// Loop through the list and check if party is on another Judgment - defined as Against
			for(var i = 0;i < idList.length; i++){
			
				if(valid == false){
					break;
				}
				// get judgment id
				id = idList[i].text;
				// get partyKey of the Party Against the  old Judgment
				var partyKey = Services.getValue(baseXpath + id + "']/PartyKey");
				
				if(partyKey != null && partyKey == pPartyKey){
					// found judgment for this party, now check status of judgment
					if(this.isStatusSetAside(id) == false){
						var inFavourId = null; // used in for loop
						var inFavourIdNewJudg = null; // used in for loop
						// Check the party in favour of list on 'old' judgment
						var inFavourList = Services.getNodes(JudgmentVariables.SUBFORM_JUDGMENT_PATH + "[./SurrogateId = '" + id + "']/InFavourParties/Party/PartyKey");
						
						// loop through this list and check if any of the in favour parties on the new judgment,					
						// are in favour of the party on this judgment.
						for(var j = 0;j < inFavourList.length; j++){
							if(valid == false){
								break;
							}
							
							inFavourId = inFavourList[j].text;
							
							for(var k = 0;k < inFavourListNewJudgment.length; k++){
								inFavourIdNewJudg = inFavourListNewJudgment[k].text;
								if(inFavourId == inFavourIdNewJudg){
									valid = false;
									break;
								}							
							} //end for(var k						
						} //end for(var j					
					}// end if(this.isStatusSetAside(id) == false){
				}// end of if(partyKey != null &...	
			}// end for(var i = 
		}// end if(idList != null &...
	}// if(inFavourListNewJudgment != null && inFavourListNewJudgment.length != 0){
	return valid;
}

/**
 * This function checks to see if the judgment is set aside
 * 
 * @param pJudgmentId - the judgment to check whether set aside
 * @return boolean representing whether the judgment is set aside.
 * @author rzhh8k
 */
JudgmentFunctions.isStatusSetAside = function(pJudgmentId)
{	
	var setAside = false;
	var xpath = JudgmentVariables.SUBFORM_JUDGMENT_PATH + "[./SurrogateId = '" + pJudgmentId + "']/Status";
	var status = Services.getValue(xpath);
	
	if(status != null && status == JudgmentVariables.STATUS_SET_ASIDE){
		setAside = true;
	}
	
	return setAside;
}

/**
 * This function sets any new events in the correct path for the services
 * @param pEvent - the new judgment status
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setEvent = function(pEvent)
{	
	// Get values from DOM   
	var root = "/Event";

	// Set new part of DOM
	var tmpEvent = Services.loadDOMFromURL("NewEvent.xml");
	
	// Set up data in the Tmp part of DOM
	tmpEvent.selectSingleNode(root + "/EventID").appendChild(
		tmpEvent.createTextNode(pEvent));
	var parentXpath = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/JudgmentEvents";
	
	// now add it to the tmp area
	Services.addNode(tmpEvent, parentXpath);		
}

/**
 * This function sets the status on the the Judgment.
 * @param pStatus - the new judgment status
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setStatus = function(pStatus)
{	
	var xpath = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Status";
	Services.setValue(xpath, pStatus);
}

/**
 * This function works out if we can update the judgment
 * @return boolean representing whether can update the Judgment
 * @author rzhh8k
 */
JudgmentFunctions.isJudgmentInUpdateState = function()
{	
	var update = true;
	var status =  Services.getValue(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/Status");
	
	if(status  != null && status != "" ){
		if(status  == JudgmentVariables.STATUS_VARIED){
			update = true;
		}
		else{
			update = false;
		}
	}// if(status  != null ...
	
	return update;
}

/**
 * This function sets the court code and name to the dataBindings Provided
 *
 * @param pCodeBinding
 * @param pNameBinding
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setUpDefaultOwningCourt = function(pCodeBinding, pNameBinding)
{
	var owningCode = Services.getValue("/ds/var/app/currentCourt");	
	Services.setValue(pCodeBinding, owningCode);
}


/**
 * Returns the current system date, based on the getSystemDate server call.
 * The returned date is in the format YYYY-MM-DD
 * @author rzhh8k
 * @return date  
 */
JudgmentFunctions.getTodaysDate = function() 
{
	var date = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/SystemDate");
	
	if(date == null) {
		date = CaseManUtils.convertDateToPattern(new Date(),"YYYY-MM-DD");
	}
	
	return date;
}

/**
 * Checks whether date is in the future
 * pDate the date to validate
 * @return error Code, null if not in future, otherwise exceptiuon and is in future
 * @param pDate
 * @author rzhh8k
 */
JudgmentFunctions.validateDateInFuture = function(pDate) 
{
   	var errCode = null;
   	
    if(pDate != null && pDate != ""){
    	var today = CaseManUtils.createDate(this.getTodaysDate());
    	var compare = CaseManUtils.compareDates(today, CaseManUtils.createDate(pDate));
    	
    	if(compare > 0){
    		errCode = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
    	}    	
    }
	
	return errCode;
}

/**
 * Validates a date is in the format yyyymmdd
 * @param pDate the date to validate
 * @return error code - null if valid
 * @author rzhh8k
 */
JudgmentFunctions.validateDate = function(pDate) 
{
	var errorCode = null;
	
	if(pDate != null){
		pDate = CaseManUtils.stripSpaces(pDate);
		var valid = pDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN);	 
		
		if(pDate.length > 0 && valid < 0){
			errorCode = ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');
		}
	}
	else{
		errorCode = ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');
	}
		
	return errorCode;
}

/**
 * Validates the amount entered is in the correct format
 * @param pAmount the amount validating is correct
 * @param pPattern the pattern to check against
 * @param pCheckAmount check amount is greater than 0?
 * @return ErrorCode. If null valid
 * @author rzhh8k
 */
JudgmentFunctions.validateAmount = function(pAmount, pPattern, pCheckAmount) 
{
	var errorCode = null;
	
	if(pAmount != null && pAmount != ""){
		pAmount = CaseManUtils.stripSpaces(pAmount);
		var valid = pAmount.search(pPattern);	 
		
		if(valid < 0){
			// incorrect format now display correct msg
			if(pPattern == JudgmentVariables.CURRENCY_MAX_7_PATTERN){
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat7_Msg');
			}
			else if(pPattern == JudgmentVariables.CURRENCY_MAX_10_PATTERN){
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat10_Msg');
			}
			else{
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat11_Msg');
			}			
		}// if(valid < 0){
		else if(pAmount < 0.01 && pCheckAmount){
			// incorrect format now display correct msg
			if(pPattern == JudgmentVariables.CURRENCY_MAX_7_PATTERN){
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectRange7_Msg');
			}
			else if(pPattern == JudgmentVariables.CURRENCY_MAX_10_PATTERN){
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectRange10_Msg');
			}
			else{
				errorCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectRange11_Msg');
			}
		}// else if(pAmount < 0.01 && pCheckAmount){
	}
		
	return errorCode;
}
/**
 * This function validates the releationship between the Against Party and the
 * In Favour Of Parties
 *  
 * uct 744 - rules
 * Against - Defendant, 20_Defendant, 20_Claimant
 * For (can have more than one) - Claimant, 20_Claimant or 20_Defendant
 *
 * Against - Claimant
 * For (can have more than one) - 20_Claimant, Defendant or 20_Defendant
 *
 * @param pAmount the amount of the judgment
 * @param pCosts the costs associated with the judgment
 * @return boolean 
 * @author rzhh8k
 */
JudgmentFunctions.validRelationshipAddJudgment = function()
{
	var isValid = true;
	// get the PartyAgainstType
	var against = Services.getValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyRoleCode");
	// now get the list of In Favour of Party types
	var idList = Services.getNodes(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties/Party/PartyRoleCode");
	
	if(idList != null && idList.length != 0 && against != null && against != ""){
		var defendantFound = false;
		var claimantFound = false;
		var id = null;
		
		// Loop through the list
		for(var i = 0; i < idList.length; i++){
			if(isValid == false){
				break;
			}
			
			id = idList[i].text;	
			
			if(against == JudgmentVariables.DEFENDANT || against == PartyTypeCodesEnum.PART_20_DEFENDANT || 
						against == PartyTypeCodesEnum.PART_20_CLAIMANT){
				// the values can not be mixed
				if(id == JudgmentVariables.CLAIMANT && defendantFound == true){
					isValid = false;
					break;
				}
				else if(id == JudgmentVariables.CLAIMANT && defendantFound == false){
					claimantFound = true;
				}
				else if(id == JudgmentVariables.DEFENDANT && claimantFound == true){
					isValid = false;
					break;
				}
				else if(id == JudgmentVariables.DEFENDANT || id == PartyTypeCodesEnum.PART_20_DEFENDANT 
					|| id == PartyTypeCodesEnum.PART_20_CLAIMANT){
					// need to ensure not selected the same Against and Infavour Party e.g. defendant 1 as against and infavour
					var againstKey = Services.getValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyKey");
					var inFavourPartyKeyList= Services.getNodes(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties/Party/PartyKey");
					var partyKey = null;
					
					for(var j = 0; j < inFavourPartyKeyList.length; j++){						
						partyKey = inFavourPartyKeyList[j].text;
						if(againstKey == partyKey){
							// oops same party selected
							isValid = false;							
							break;
						}
					}// end for
					
					if(isValid != false){
						if(id != PartyTypeCodesEnum.PART_20_DEFENDANT && id != PartyTypeCodesEnum.PART_20_CLAIMANT){
							defendantFound = true;
						}
						
					}					
				}// else if (id == JudgmentVariables.DEFENDANT){
			} // if(against == JudgmentVariables.DEFENDANT){
			else{
				// they are a claimant and in favour is claimant
				if(id == JudgmentVariables.CLAIMANT){
					isValid = false;
					break;
				}
			}
 		}// end of for
 	}// end of 	if(idList != null && idList.lengt... 

	 return isValid;
}
/**
 * This function validates the new Judgment is in a valid state.
 * It looks at all relevant fields and checks their state
 *
 * NB Against and In Favour fields are validated seperately
 *
 * @return boolean 
 * @author rzhh8k
 */
JudgmentFunctions.validateAddJudgment = function()
{
	 var isValid = true;
	 
	 // get Adaptors
	 var courtCodeAdaptor = Services.getAdaptorById("AddJudgment_CourtCode");
	 var typeAdaptor = Services.getAdaptorById("AddJudgment_Type");
	 var dateAdaptor = Services.getAdaptorById("AddJudgment_Date");
	 var regDateAdaptor = Services.getAdaptorById("AddJudgment_RegDate");
	 var amountAdaptor = Services.getAdaptorById("AddJudgment_JudgmentAmount");
	 var costsAdaptor = Services.getAdaptorById("AddJudgment_JudgmentCosts");
	 var paidBeforeAdaptor = Services.getAdaptorById("AddJudgment_PaidBefore");
	 var instalAdaptor = Services.getAdaptorById("AddJudgment_InstalAmount");
	 var periodAdaptor = Services.getAdaptorById("AddJudgment_PeriodCode");
	 var firstPayAdaptor = Services.getAdaptorById("AddJudgment_FirstPayDate");
	 
	 // check 
	 if(courtCodeAdaptor.getMandatory() || !courtCodeAdaptor.getValid() || typeAdaptor.getMandatory() || 
	 		dateAdaptor.getMandatory() || !dateAdaptor.getValid() || regDateAdaptor.getMandatory() || !regDateAdaptor.getValid() ||
	 			amountAdaptor.getMandatory() || !amountAdaptor.getValid() || costsAdaptor.getMandatory() || !costsAdaptor.getValid() ||	
	 				paidBeforeAdaptor.getMandatory() || !paidBeforeAdaptor.getValid() || instalAdaptor.getMandatory() || !instalAdaptor.getValid() ||
	 					periodAdaptor.getMandatory() || firstPayAdaptor.getMandatory() || !firstPayAdaptor.getValid()){
	 	isValid = false;
	 }
	 return isValid;	 
 }

/**
 * This function checks to see if the given date precedes the Judgment date
 * @param pDate
 * @param pAddJudgment boolean representing whether in add judgment mode
 * @return error code
 * @author rzhh8k
 */
JudgmentFunctions.validateDatePreceedsJudgDate = function(pDate, pAddJudgment)
{
	var errCode = null;
	var judgmentDate = null;
	
	if(pAddJudgment == true){
		judgmentDate = Services.getValue(AddJudgment_Date.dataBinding);
	}
	else{
		judgmentDate = Services.getValue(JudgmentDetails_Date.dataBinding);
	}
	
	if(judgmentDate != null && judgmentDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), CaseManUtils.createDate(judgmentDate));
		
		if(compare > 0){
			errCode = ErrorCode.getErrorCode("CaseMan_dateProceedsJudgmentDate_Msg");
		}
	}
	
	return errCode;
}

/**
 * This function checks to see if the given date precedes the relevant application date
 * @param pDate
 * @param pType String representing whether Vary or Aside
 * @return error code
 * @author rzhh8k
 */
JudgmentFunctions.validateDatePreceedsApplicationDate = function(pDate, pType)
{
	var errCode = null;
	var appDate = null;
	
	if(pType == JudgmentVariables.APP_TO_VARY){
		appDate = Services.getValue(AppToVary_Date.dataBinding);
	}
	else{
		appDate = Services.getValue(AppToSetAside_Date.dataBinding);
	}
	
	if(appDate != null && appDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), CaseManUtils.createDate(appDate));		
		if(compare > 0){
			errCode = ErrorCode.getErrorCode("CaseMan_datePreceedsApplicationDate_Msg");
		}
	}
	
	return errCode;
}

/**
 * This function checks to see if the given date precedes the Result date
 * @param pDate
 * @return error code
 * @author rzhh8k
 */
JudgmentFunctions.validateDatePreceedsResultDate = function(pDate)
{
	var errCode = null;
	var resultDate = Services.getValue(AppToVary_ResultDate.dataBinding);

	if(resultDate != null && resultDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), CaseManUtils.createDate(resultDate));
		
		if(compare > 0){
			errCode = ErrorCode.getErrorCode("CaseMan_datePreceedsResultDate_Msg");
		}
	}
	
	return errCode;
}

/**
 * This function adds the new validated Judgment to the DOM
 * @param pSurrogateID. The new Judgment ID.
 * @author rzhh8k
 * 
 */
JudgmentFunctions.addNewJudgment = function(pSurrogateID)
{
	var root = "/Judgment";
	var defaultCurrency = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");

	// Set new part of DOM
	var newJudgment = Services.loadDOMFromURL("NewJudgment.xml");
	
	// Set up data in  New  DOM from the Tmp binding part of DOM
	newJudgment.selectSingleNode(root + "/PartyRoleCode").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PartyRoleCode"))));
	newJudgment.selectSingleNode(root + "/PartyAgainstName").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PartyAgainstName"))));
	newJudgment.selectSingleNode(root + "/CasePartyNumber").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/CasePartyNumber"))));
	newJudgment.selectSingleNode(root + "/PartyKey").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PartyKey"))));
	newJudgment.selectSingleNode(root + "/SurrogateId").appendChild(
		newJudgment.createTextNode(pSurrogateID));
	newJudgment.selectSingleNode(root + "/VenueCode").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/VenueCode"))));
	newJudgment.selectSingleNode(root + "/VenueName").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/VenueName"))));
	newJudgment.selectSingleNode(root + "/Type").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Type"))));
	newJudgment.selectSingleNode(root + "/Date").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Date"))));
	newJudgment.selectSingleNode(root + "/DateRTL").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/DateRTL"))));
	
	// Need to ensure there is a value there for joint judgment, if not set to 'N'
	var jj = Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/JointJudgment");
	if(jj == null || jj == ""){
		jj = 'N';
	}
	newJudgment.selectSingleNode(root + "/JointJudgment").appendChild(
				newJudgment.createTextNode(jj));
			
	newJudgment.selectSingleNode(root + "/Amount").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Amount"))));
	newJudgment.selectSingleNode(root + "/AmountCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));
	newJudgment.selectSingleNode(root + "/TotalCosts").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/TotalCosts"))));
	newJudgment.selectSingleNode(root + "/TotalCostsCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));	
	newJudgment.selectSingleNode(root + "/SubTotal").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/SubTotal"))));
	newJudgment.selectSingleNode(root + "/SubTotalCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));
	newJudgment.selectSingleNode(root + "/PaidBefore").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PaidBefore"))));
	newJudgment.selectSingleNode(root + "/PaidBeforeCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));
	newJudgment.selectSingleNode(root + "/Total").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Total"))));
	newJudgment.selectSingleNode(root + "/TotalCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));
	newJudgment.selectSingleNode(root + "/InstallAmount").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/InstallAmount"))));
	newJudgment.selectSingleNode(root + "/InstallAmountCurrency").appendChild(
				newJudgment.createTextNode(defaultCurrency));
	
	var perCode = CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PeriodCode"));
	newJudgment.selectSingleNode(root + "/PeriodCode").appendChild(
				newJudgment.createTextNode(perCode));
	// need to get the Period description and set accordingly
	var perDesc = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods/Period[./Value = '" + perCode + "']/Description");
	newJudgment.selectSingleNode(root + "/PeriodDesc").appendChild(
				newJudgment.createTextNode(perDesc));	
	newJudgment.selectSingleNode(root + "/FirstPayDate").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/FirstPayDate"))));
	newJudgment.selectSingleNode(root + "/PaidInFullDate").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PaidInFullDate"))));
	newJudgment.selectSingleNode(root + "/NotificationDate").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/NotificationDate"))));
	newJudgment.selectSingleNode(root + "/Status").appendChild(
				newJudgment.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Status"))));
	
	// Add the entire Judgment branch to the Judgments node
	var judgmentNode = "/ds/MaintainJudgment/Judgments";
	Services.addNode(newJudgment, judgmentNode);
	
	// Add the payee fields
	var payeeNode = Services.getNode(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/Payee");
	Services.replaceNode(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + pSurrogateID + "']/Payee", payeeNode);
	
	// setup the in favour parties now the Judgment in the correct place
	//var parentNode = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + pSurrogateID + "']/InFavourParties";
	var parentNode = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + pSurrogateID + "']";
	var inFavourNode = Services.getNode(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/InFavourParties");
	Services.removeNode(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + pSurrogateID + "']/InFavourParties");
	Services.addNode(inFavourNode, parentNode);
		
	//Defect  UCT defect #71 
	// Only set bar if defendant
	var partyRoleCode = Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PartyRoleCode");
	if(partyRoleCode != null && partyRoleCode == JudgmentVariables.APPLICANT_DEFENDANT){	
		var key = Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/PartyKey");	
		var xpathBar = "/ds/MaintainJudgment/Parties/Party[./PartyKey = '" + key + "']/Bar";
		Services.setValue(xpathBar, "Y");
	}
	
	// RFC 1473 - send to rtl?
	var sendRTL = Services.getValue(JudgmentVariables.NEW_JUDGMENT_TMP_PATH + "/SendToRTL")
	if(null != sendRTL && sendRTL == JudgmentVariables.YES){
		// need to set flag to create an event 236
		Services.setValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED, JudgmentVariables.YES);
	}
	
	// Clear out the temp data
	this.resetNewJudgment();
	
	// Force the master grid to select the newly added Judgment
	Services.setValue(Master_AgainstGrid.dataBinding, pSurrogateID);
}
/**
 * This function adds the new validated Application to set aside to the DOM
 * @param pSurrogateID. The new set Aside Id.
 * @author rzhh8k
 * 
 */
JudgmentFunctions.addNewSetAside = function(pSurrogateID)
{
	var root = "/Application";	

	// Set new part of DOM
	var newSetAside = Services.loadDOMFromURL("TempAppToSetASide.xml");
	
	// Set up data
	newSetAside.selectSingleNode(root + "/AsideSurrogateId").appendChild(
		newSetAside.createTextNode(pSurrogateID));
	newSetAside.selectSingleNode(root + "/AppDate").appendChild(
		newSetAside.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_SETASIDE_TMP_PATH + "/AppDate"))));
	newSetAside.selectSingleNode(root + "/Applicant").appendChild(
		newSetAside.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_SETASIDE_TMP_PATH + "/Applicant"))));
	
	var asideNode = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside";
	Services.addNode(newSetAside, asideNode);
	
	// set the flag so know need to create the correct event
	Services.setValue(JudgmentVariables.SET_ASIDE_ADDED_PATH, JudgmentVariables.YES);
	
	// Clear out the temp data
	this.resetNewSetAside();	
	// Force the master grid to select the newly added Application
	Services.setValue(AppToSetAside_Grid.dataBinding, pSurrogateID);
}

/**
 * This function adds the new validated Application to Vary to the DOM
 * @param pSurrogateID. The new vary Id.
 * @author rzhh8k
 * 
 */
JudgmentFunctions.addNewVary = function(pSurrogateID)
{
	var root = "/Variation";
	var defaultCurrency = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");

	// Set new part of DOM
	var newVary = Services.loadDOMFromURL("TempAppToVary.xml");
	
	// Set up data 
	newVary.selectSingleNode(root + "/VarySurrogateId").appendChild(
		newVary.createTextNode(pSurrogateID));
	newVary.selectSingleNode(root + "/AppDate").appendChild(
		// newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AppDate"))));
		newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(AddVary_Date.dataBinding))));
	newVary.selectSingleNode(root + "/Applicant").appendChild(
		newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/Applicant"))));
	newVary.selectSingleNode(root + "/AmountOffered").appendChild(
		newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AmountOffered"))));
	newVary.selectSingleNode(root + "/AmountOfferedCurrency").appendChild(
		newVary.createTextNode(defaultCurrency));
	newVary.selectSingleNode(root + "/AmountOfferedPer").appendChild(
		newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AmountOfferedPer"))));
	var perID = Services.getValue(AddVary_PerID.dataBinding);
	newVary.selectSingleNode(root + "/AmountOfferedPerId").appendChild(
		newVary.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(AddVary_PerID.dataBinding))));
	newVary.selectSingleNode(root + "/NewApp").appendChild(
			newVary.createTextNode("Y")); 
	
	
	var varyNode = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary";
	Services.addNode(newVary, varyNode);	

	// Clear out the temp data
	this.resetNewVary();	
	// Force the master grid to select the newly added Application
	Services.setValue(AppToVary_Grid.dataBinding, pSurrogateID);
}

/**
 * This function clears the temporary data for new set aside.
 * Sets each tag to "" as when removed the node strange things happened
 * 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetNewSetAside = function()
{
	Services.setValue(AddSetAside_Date.dataBinding, "");
	Services.setValue(AddSetAside_Applicant.dataBinding, "");
}

/**
 * This function clears the temporary data for new variations.
 * Sets each tag to "" as when removed the node strange things happened
 * 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetNewVary = function()
{
	Services.setValue(AddVary_Date.dataBinding, "");
	Services.setValue(AddVary_Applicant.dataBinding, "");
	Services.setValue(AddVary_InstAmount.dataBinding, "");
	Services.setValue(AddVary_InstAmountCurrency.dataBinding, Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode"));
	Services.setValue(AddVary_Per.dataBinding, "");	
	Services.setValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + "/AmountOfferedPerId", "");
}

/**
 * This function clears the temporary data for new Judgment.
 * Sets each tag to "" as when removed the node strange things happened
 * 
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetNewJudgment = function()
{

	Services.removeNode(JudgmentVariables.NEW_JUDGMENT_TMP_PATH);
	// reset the column databinding
	Services.removeNode("/ds/var/page/filters/grid");
		
	// reset the grids
	this.resetInFavourOf();
	
	// reset the add pop up - on the edit in favour of - add Judgment
	Services.removeNode("/ds/var/page/SelectedGridRow/AddInFavourOfPopupGrid");
}

/**
 * This function vaidates that a grid is in  valid state
 * @param pGridId - the grids id e.g AppToSetAside_Grid
 * @return boolean
 * 
 * @author rzhh8k
 */
JudgmentFunctions.validateGrid = function(pGridID)
{
	var isValid = false;

	var gridAdaptor = Services.getAdaptorById(pGridID);
	var aggState = gridAdaptor.getAggregateState();
	var sub = aggState.isSubmissible();
	
	if(sub == true){
		isValid = true;
	}
	
	return isValid;	 
}

/**
 * This function vaidates that all new set aside data is valid
 * @return boolean
 * 
 * @author rzhh8k
 */
JudgmentFunctions.validateNewAppSetAside = function()
{
	var isValid = true;
	// get Adaptors
 	var dateAdaptor = Services.getAdaptorById("AddSetAside_Date");
 	var applicantAdaptor = Services.getAdaptorById("AddSetAside_Applicant");

 	if(dateAdaptor.getMandatory() == true || dateAdaptor.getValid() == false || applicantAdaptor.getMandatory() == true){
 		isValid = false;
 	}
 	
	return isValid;	 
}

/**
 * This funvaltion vaidates that all new vary data is valid
 * @return boolean
 * 
 * @author rzhh8k
 */
JudgmentFunctions.validateNewAppVary = function()
{
	var isValid = true;
	// get Adaptors
 	var dateAdaptor = Services.getAdaptorById("AddVary_Date");
 	var applicantAdaptor = Services.getAdaptorById("AddVary_Applicant");
 	var installAdaptor = Services.getAdaptorById("AddVary_InstAmount");
 	var perAdaptor = Services.getAdaptorById("AddVary_Per");

 	if(dateAdaptor.getMandatory() == true || dateAdaptor.getValid() == false|| applicantAdaptor.getMandatory() == true ||
 			installAdaptor.getMandatory() == true || installAdaptor.getValid() == false || perAdaptor.getMandatory() == true){
 		isValid = false;
 	}
 	
	return isValid;	 
}

/**
 * Utility function which calculates whether a date is 
 * within a month in the past.
 * Based on CaseManValidationHelper emthod tat was not working coprrectly.
 * Didn't change as may have had effect on where it was being used.
 *
 * @param pDate.  the valid date to check valid date
 * @return Return errorcode if invalid, null if ok
 * @author rzhh8k
 */
JudgmentFunctions.validateDateLessThanOneMonthInPast = function(pDate)
{
	var errCode = null;
	
	// check date is valid	
	if(pDate != null){
		if(pDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1){
			var oneMonthAgo = CaseManUtils.oneMonthEarlier(CaseManUtils.createDate(this.getTodaysDate()));
			if(oneMonthAgo != null && oneMonthAgo != ""){
				compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), oneMonthAgo);
				if(compare > 0){
					errCode = ErrorCode.getErrorCode("CaseMan_dateMoreThanOneMonthInPast_Msg");
				}
			}
		}// end if(pDate.search(CaseManValidat...
	}// end if(pDate != null){
	
	return errCode;
} 

/**
 * function which validates the Application to Set Aside result field
 *
 * @param pResult.  the valid date to check valid date
 * @return Return message to be displayed, null if no message
 * @author rzhh8k
 */
JudgmentFunctions.validateAppToSetAsideResult = function(pResult)
{
	var message = null;	
	
	// check value there
	if(pResult != null && pResult != ""){
		if(pResult == JudgmentVariables.RESULT_TRANSFERRED){
			message = Messages.APPSETASIDE_RESULT_TRANSFERRED_MESSAGE;
		}
		else if(pResult == JudgmentVariables.RESULT_GRANTED){
			// Is there a live Attachment Of Earnings?
			var ae = Services.getValue(JudgmentVariables.LIVE_AE_PATH);
			if(ae != null && ae != "" && ae != JudgmentVariables.NO){
				// Live AE exists so set message appropriately
				message = Messages.APPSETASIDE_RESULT_GRANTED_MESSAGE;
			}			
		}
	}// end if(pDate != null){
	
	return message;
} 

/**
 * Function checks whether allowed to add an application
 * (Vary or Set Aside) to the Judgment
 *
 * @param pAppType. Are we checking for Vary of Set Aside
 * @return Return message to be displayed, null if no message
 * @author rzhh8k
 */
JudgmentFunctions.isAddApplicationAllowed = function(pAppType)
{
	var message = null;
	// first check what status the Judgment is at
	var status = Services.getValue(JudgmentDetails_Status.dataBinding);
	// ccbc grp2 1549 - logic changed
	if(pAppType == JudgmentVariables.APP_TO_SET_ASIDE){
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& status != JudgmentVariables.STATUS_CANCELLED && status != JudgmentVariables.STATUS_SATISFIED
				&& JudgmentFunctions.isCCBCCourt() == true){
			// The status of the Judgment does not allow Additional Applications to be added
			message = Messages.STATUS_SET_MESSAGE;
		}
		else if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& JudgmentFunctions.isCCBCCourt() == false){
			// The status of the Judgment does not allow Additional Applications to be added
			message = Messages.STATUS_SET_MESSAGE;
		}
		else{
			// need to ensure there are no outstanding Applications to set Aside or any that are defined as 'Granted'
			// Get the list
			var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside";
		 	// get a list of all the applications to set aside
			var idList = Services.getNodes(applicationsXP + "/Application/AsideSurrogateId");
			var tmpId = null;
			var result = null;
			
			if(idList != null && idList.length != 0){
				for(var i = 0; i < idList.length; i++){
					tmpId = idList[i].text;
					
					if(tmpId != 0){
						result = Services.getValue(applicationsXP + "/Application[./AsideSurrogateId = '" + tmpId + "']/Result");
						
						if(result == null || result == ""){
							message = Messages.APP_OUTSTANDING_MESSAGE;
							break;
						}
						else if(result == JudgmentVariables.RESULT_GRANTED){
							message = Messages.STATUS_SET_MESSAGE;
							break;
						}
						
					}// end if(tmpId != 0){
					
				}// end for
			}// end if(idList != null && idList.length != 0){
		}//if/else		
	} // end else if(pAppType == JudgmentVariables.APP_TO_...
	else{
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			// The status of the Judgment does not allow Additional Applications to be added
			message = Messages.STATUS_SET_MESSAGE;
		}
		else{
			//App to Vary 
			// need to ensure there are no outstanding Applications to set Vary or any that are defined as 'Granted'
			// Get the list
			var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary";
		 	// get a list of all the applications to set aside
			var idList = Services.getNodes(applicationsXP + "/Variation/VarySurrogateId");
			var tmpId = null;
			var result = null;
			
			if(idList != null && idList.length != 0){
				for(var i = 0; i < idList.length; i++){
					tmpId = idList[i].text;
					
					if(tmpId != 0){
						result = Services.getValue(applicationsXP + "/Variation[./VarySurrogateId = '" + tmpId + "']/Result");
						
						if(result == null || result == ""){
							message = Messages.APP_OUTSTANDING_MESSAGE;
							break;
						}
						
					}// end if(tmpId != 0){
					
				}// end for
			}// end if(idList != null && idList.length != 0){
		}	
	}
	return message;
}

/**
 * This function returns the system date plus extra weeks/months
 * @param pPeriod The length of time to get date in future.  e.g. SysDate + 2 weeks
 * @author rzhh8k
 * @return date  
 */
JudgmentFunctions.getSysDatePlus = function(pPeriod)
{
	var resultDate = Services.getValue(AppToVary_ResultDate.dataBinding);
	var date = null;
	
	if(resultDate != null && resultDate != ""){
		date = resultDate;
	}
	else{
		date = this.getTodaysDate();
	}
	
	var dateAsDateObject = CaseManUtils.createDate(date);	
	var dateObj = null;

	if(pPeriod != null && pPeriod != ""){
		if(pPeriod == JudgmentVariables.PLUS_1WEEK){
		 	dateObj = CaseManUtils.daysInFuture(dateAsDateObject,
		 										7,//days
		 										true); //weekend
		 	date = CaseManUtils.convertDateToPattern(dateObj, "YYYY-MM-DD");
		}
		else if(pPeriod == JudgmentVariables.PLUS_2WEEK){
			dateObj = CaseManUtils.daysInFuture(dateAsDateObject,
		 										14,//days
		 										true); //weekend
		 	date = CaseManUtils.convertDateToPattern(dateObj, "YYYY-MM-DD");
		
		}
		else if(pPeriod == JudgmentVariables.PLUS_1MTH){
			dateObj = this.oneMonthInFuture(dateAsDateObject,
											true); //weekend
		 	date = CaseManUtils.convertDateToPattern(dateObj, "YYYY-MM-DD");
		}
	}//if(pPeriod != null && pPeriod != ""){
	
	return date;
}
/**
 * This function works out if there are any JUdgments on a case
 * @return boolean representing whether exists (true) or not (false)
 * @author rzhh8k
 */
JudgmentFunctions.judgmentsExist = function()
{
	//If there are no Judgments associated with a case then need to disable the field
	var gridBinding = Services.getValue(Master_AgainstGrid.dataBinding);
	var enableMe = false;
	
	if(gridBinding != null && gridBinding != "" && gridBinding != 0){
		enableMe = true;
	
	}
	
	return enableMe;
}
/**
 * This function works out if there are any Apps To Set Aside on a judgment
 * @return boolean representing whether exists (true) or not (false)
 * @author rzhh8k
 */
JudgmentFunctions.AppSetAsideExist = function()
{
	var enableMe = false;
	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside";
 	// get a list of all the applications to set aside
	var idList = Services.getNodes(applicationsXP + "/Application/AsideSurrogateId");
	
	if(idList != null && idList.length != 0){
		// Loop through the list to see if an id is there
		for(var i = 0; i < idList.length; i++){
			var id = idList[i].text;
			
			if(id != null && id != ""){
				enableMe = true;
				break
			}
			
		}	
	}

	return enableMe;
}

/**
 * This function works out if there are any Apps To Vary on a judgment
 * @return boolean representing whether exists (true) or not (false)
 * @author rzhh8k
 */
JudgmentFunctions.appVaryExist = function()
{
	var enableMe = false;
	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation/VarySurrogateId";
	// get a list of all the applications to vary
	var idList = Services.getNodes(applicationsXP);
	
	if(idList != null && idList.length != 0){
		// Loop through the list to see if an id is there
		for(var i = 0; i < idList.length; i++){
			var id = idList[i].text;
			
			if(id != null && id != ""){
				enableMe = true;
				break
			}
			
		}
	
	}
	
	return enableMe;
}

/**
 * This function ensures a time is transformed so that it can be validated correctly.
 * If the pTime param is not a valid time then the method stores the incorrect value to tye DOM
 * A CONSTANT is placed at the end of a value as a quick fix re validating whether the user has entered
 * an invalid time in number format e.g. 66, 456, 45678.  This means that the incorrect value will 
 * not get transformed into a display time when transforming from seconds after midnight to hh:mm
 * @return the converted time
 * @param pTime
 * @author rzhh8k
 */
JudgmentFunctions.transformToModelTime = function(pTime)
{
	var convertedTime = null;
	
	if(pTime != null){
		pTime = CaseManUtils.stripSpaces(pTime);
		
		if(CaseManUtils.isBlank(pTime)){
			return null;
		}
		
		if(CaseManValidationHelper.validateTime(pTime)){
			convertedTime = CaseManUtils.convertTimeToSeconds(pTime);
		}
		
		if(convertedTime == null){
			// if the validate method fails nothing is writen to the DOM and 
			// therefore validate does not work. So need to write value to DOM.
			// Only need to ensure correct only when press the save button. So can 
			// write an invalid time here. 
			convertedTime = pTime + JudgmentVariables.INVALIDTIME;	
		}
	}
	
	return convertedTime;	
}	
	
 
/**
 * This method ensures a time is transformed from the DOM to display correctly.
 * Even if invalid must be displayed as the user entered.
 * @return the converted time
 * @param pTime
 * @author rzhh8k
 */
JudgmentFunctions.transformToDisplayTime = function(pTime)
{
	var convertedTime = null;
	
	if(pTime != null){
		// remove the invalid time string - if there is one
		var posOfInvalidString = pTime.indexOf(JudgmentVariables.INVALIDTIME);
		
		if(posOfInvalidString > -1){
			pTime = pTime.slice(0, posOfInvalidString);
			convertedTime = pTime;
		}
		else{
			var convertedTime = CaseManUtils.convertSecondsToTime(pTime);
			if(convertedTime != null){
				if(!CaseManValidationHelper.validateTime(convertedTime))
				{			
					// need to return something so the user can see that they have 
					// entered invalid value.
					convertedTime = pTime;
				} // end if(errCode == null ){	
			}// end if(convertedTime == null)
			else{
				convertedTime = pTime;
			}
		}
	}// end of if(pTime != null){
	
	return convertedTime;
}// end of transformToDisplayTime(pTime)

/**
 * This function ensures a date is not specified as a non working day
 * @return error code - null if ok
 * @param pDate
 * @author rzhh8k
 */
JudgmentFunctions.validateNonWorkingDate = function(pDate)
{
 	var xpath = JudgmentVariables.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay/Date";
 	var nodes = Services.getNodes(xpath);
 	var errCode = null;
 	
 	for(var i = 0 ; i < nodes.length ; i++) {
 		var nonWorkDate = XML.getNodeTextContent(nodes[i]); 		
 		if(pDate == nonWorkDate){
 			errCode = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg"); 
 			break;
 		} 		
 	}
 	
 	return errCode;
}

/**
 * This function calculates whether the supplied party is barred from having a Judgment made against them
 * @param pPartyKey The key of the party selected to be checked against bar
 * 
 * @author rzhh8k
 * @return errCode  
 */
JudgmentFunctions.isBar = function(pPartyKey)
{
	var errCode = null;
	var id = Services.getValue(selectAddJudgment_Against_LOV.dataBinding);
	
	if(pPartyKey != null){
		// Lookup whether the selected party is barred
		var xpathBar = JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH + "/MaintainJudgment/Parties/Party[./PartyKey = '" + pPartyKey + "']/Bar";
		var bar = Services.getValue(xpathBar);
		
		if(bar != null && bar == JudgmentVariables.YES){
			errCode = ErrorCode.getErrorCode('CaseMan_judgmentEnforcementBarIsSet1_Msg');
		}		
	}
	
	return errCode;
}

/**
 * This function calculates the status when a new paid in full date has been entered.
 * @param pPaidInFullDate The date the Judgment Amount was paid in full.
 * @return The status as a string.
 * @author rzhh8k
 */
JudgmentFunctions.calculateStatus = function(pPaidInFullDate)
{
	var status = "";
	
	if(pPaidInFullDate != null && pPaidInFullDate != ""){
		// get the Judgment date
		var judgDate = Services.getValue(JudgmentDetails_Date.dataBinding);
		var judgRegDate = Services.getValue(JudgmentDetails_DateToRTL.dataBinding);
		
		// get dates as DATE objects as a date object
		var judgDateObj = CaseManUtils.createDate(judgDate);
		var paidDateObj = CaseManUtils.createDate(pPaidInFullDate);
		
		// now work out how far ahead the date paid in full is of the Judgment date
		var dateOneMonthAheadOfJudgDate = this.oneMonthInFutureForStatusCalc(judgDateObj, true);
		var compare = CaseManUtils.compareDates(dateOneMonthAheadOfJudgDate, paidDateObj);
		
		if ( JudgmentFunctions.isCCBCCourt() )
		{
			// For CCBC Cases, the Status cannot be set to PAID (UCT_Group2 Defect 1367)
			if ( compare > 0 )
			{
				// Paid in full date after 1 month of judgment date
				status = JudgmentVariables.STATUS_SATISFIED;	
			}
			else
			{
				// Paid in full date within 1 month of judgment date
				status = JudgmentVariables.STATUS_CANCELLED;
			}
		}
		else
		{
			if ( judgRegDate == null || judgRegDate == "" )
			{
				// Non CCBC Cases set the status to PAID if the Registration Date is blank regardless of the
				// Paid in Full Date and Judgment Date comparison.
				status = JudgmentVariables.STATUS_PAID;
			}
			else
			{
				if ( compare > 0 )
				{
					// Paid in full date after 1 month of judgment date
					status = JudgmentVariables.STATUS_SATISFIED;	
				}
				else
				{
					// Paid in full date within 1 month of judgment date
					status = JudgmentVariables.STATUS_CANCELLED;
				}
			}
		}

	}// end if(pPaidInFullDate != n...
	
	if(status == ""){
		// set to original value
		status = Services.getValue(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/Status");
	}
	
	return status;
}

/**
 * Return a date of date supplied plus 1 month
 * @param {Date} date The Date object to start from
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzhh8k
 */
JudgmentFunctions.oneMonthInFuture = function(date, weekend)
{
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var day = date.getDate();

	if(month > 11){
		month = (month - 12);
		year++;
	}
	
	var newDate = new Date(year, month, day);

	// Handle fields that cannot be a weekend
	if(!weekend){
		// Use the friday before if weekend
		while(newDate.getDay() == 0 || newDate.getDay() == 6){
			newDate.setDate(day--);
		}
	}
	
	return newDate;
}

/**
 * Return a date of date supplied plus 1 month - taking into account rules re judgment status 
 * 
 * Added as part of defect 6510 - did not change oneMonthInFuture as wp uses.
 * @param {Date} date The Date object to start from - the judgment date
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzhh8k
 */
JudgmentFunctions.oneMonthInFutureForStatusCalc = function(date, weekend)
{
	var month = date.getMonth() + 1; 
	var year = date.getFullYear(); 
	var day = date.getDate();
	var leap = false;
	
	
	if(month > 11){
		month = (month - 12);
		year++;
	}
	
	
	// Validation leap-year / february / day */
    if ((year % 4 == 0) || (year % 100 == 0) || (year % 400 == 0)) {
    	leap = true;
    }
    //ensure monthly value is correct
    if ((month == 1) && (leap == true) && (day > 29)) {
    	day = 29;
    }
    else if ((month == 1) && (leap == false) && (day > 28)) {
    	day = 28;
    }
    // Validation of other months 
    if ((day > 31) && ((month == 0) || (month == 2) || (month == 4) || (month == 6) || (month == 7) || (month == 9) || (month == 11))) {
    	day = 31;
    }
    if ((day > 30) && ((month == 3) || (month == 5) || (month == 8) || (month == 10))) {
    	day = 30;
    }
	
	// need to set day part to be the last day of the previous month if the previous month has more days than the paid month
	// I.e. the status will only be Satisfied on the first of the next month.
	
	if(month == 2 && leap == true && day > 27){
		//Mar
		day = 31;	
	}
	else if(month == 2 && leap == false && day > 27){
		// Mar
		day = 31;	
	}
	else if(month == 4 && day > 29){
		// May
		day = 31;	
	}
	else if(month == 6 && day > 29){
		// July
		day = 31;
	}
	else if(month == 9 && day > 29){
		// Nov
		day = 31;
	}
	else if(month == 11 && day > 29){
		// Dec
		day = 31;
	}
	
	
	var newDate = new Date(year, month, day);

	// Handle fields that cannot be a weekend
	if(!weekend){
		// Use the friday before if weekend
		while(newDate.getDay() == 0 || newDate.getDay() == 6){
			newDate.setDate(day--);
		}
	}
	
	return newDate;
}

/**
 * Sets the list of all parties on the Judgment - 
 * i.e. all against and in favour of parties.
 * Displayed as DEFENDANT 1 JOHN SMITH, stored as party key
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setPartyJudgmentList = function()
{
	// remove any previous data
	this.removePartyJudgmentList();
	
	var root = "/Party";
	var id = null;
	
	// First set Against Party
	var againstName = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PartyAgainstName");
	var againstKey = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PartyKey");
	var display = againstName + " - " +  againstKey;
	
	// Set new part of DOM
	var blankJudgmentPartyNode = Services.loadDOMFromURL("JudgmentParty.xml");
	var tmpAgainstParty = blankJudgmentPartyNode.cloneNode(true);
	
	tmpAgainstParty.selectSingleNode(root + "/DisplayName").appendChild(
		tmpAgainstParty.createTextNode(display));
	tmpAgainstParty.selectSingleNode(root + "/CasePartyKey").appendChild(
		tmpAgainstParty.createTextNode(againstKey));
	// now add it to the tmp area
	Services.addNode(tmpAgainstParty, JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH);	
	
	// now add the infavour parties
	var idList = Services.getNodes(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/InFavourParties/Party/PartyKey");
	if(idList != null && idList.length != 0){
	
		// Loop through the list and call the copySingleVariation to add the variation to temp part of dom
		for(var i = 0; i < idList.length; i++){
			id = idList[i].text;
			// Set new part of DOM
			var tmpInFavourParty = blankJudgmentPartyNode.cloneNode(true);
			var name =  Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/InFavourParties/Party[./PartyKey = '" + id + "']/Name");
			var display = name + " - " +  id;
			tmpInFavourParty.selectSingleNode(root + "/DisplayName").appendChild(
				tmpInFavourParty.createTextNode(display));
			tmpInFavourParty.selectSingleNode(root + "/CasePartyKey").appendChild(
				tmpInFavourParty.createTextNode(id));
			// now add it to the tmp area
			Services.addNode(tmpInFavourParty, JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH);					
 		}// end for
 		
 	}//end if(idList != null && idL...	
}

/**
 * Retrives the judgments from the database
 *@param pFirstLoad - boolean.  Are we loading screen initialy or is this a reget
 * @param pFirstLoad
 * @author rzhh8k
 * 
 */
JudgmentFunctions.getJudgments = function(pFirstLoad)
{
	// get case number
	var caseNumber = Services.getValue(JudgmentParams.CASE_NUMBER);
	if(pFirstLoad == false){
		// need to reset all
		JudgmentFunctions.resetFlags();
	}
	// defect 5580 - ensure can handle no case number supplied.
	if(caseNumber != null && caseNumber != ""){
		// Make call to service to retrieve the judgment details for the case
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber", caseNumber.toUpperCase()); 
		Services.callService("getJudgment", params, loadData, true);
	}	
}

/**
 * Removes the list of parties
 * @author rzhh8k
 * 
 */
JudgmentFunctions.removePartyJudgmentList = function()
{	
	var idList = Services.getNodes(JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH + "/Party/CasePartyKey");
	var id = null;
	
	if(idList != null && idList.length != 0){
		// Loop through the list
		for(var i = 0; i < idList.length; i++){
			id = idList[i].text;
			Services.removeNode(JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH + "/Party[./CasePartyKey = '" + id + "']");
		}
	}
}

/**
 * Sets flags in DOM so know whether need to call the Word Processing area
 * @param pCreateN441A boolean
 * @param pCreateN35A boolean
 * @param pCreateN35 boolean
 * @param pCreateN246 boolean
 * @param pCreateO31251 boolean
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setWordProcessingFlags = function(pCreateN441A, pCreateN35A, pCreateN35, pCreateN246, pCreateO31251)
{	
	if(pCreateN441A == true){
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, JudgmentVariables.WPN441A);
	}
	else if(pCreateN246 == true){ // defect uct 498
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, JudgmentVariables.WPN246);
	}
	else if(pCreateN35A == true){
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, JudgmentVariables.WPN35A);
	}
	else if(pCreateN35 == true){
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, JudgmentVariables.WPN35);
	}
	else if (pCreateO31251 == true){
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, JudgmentVariables.WPO31251);
	}
	else{
		//set to empty
		Services.setValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR, "");
	}
}
/**
 * This sets up the word processing xml that needs to be passed to the word processor controller.
 * @param pDom the dom returned from the sewrvice call - contains the event ids Nb do not want to have to load into data model as loads of evnts will fire
 * @param pWPDoc the wordProcessing document required
 * @return XML
 * @author rzhh8k
 */
JudgmentFunctions.setupWordProcessingXML = function(pDom, pWPDoc)
{
	var event = "";
	if(pWPDoc == JudgmentVariables.WPN441A){
		event = JudgmentVariables.EVENT600;
	}
	else if(pWPDoc == JudgmentVariables.WPN246){ // uct defect 498
		event = JudgmentVariables.EVENT140;
	}
	else if(pWPDoc == JudgmentVariables.WPN35A){
		event = JudgmentVariables.EVENT155;
	}
	else if (pWPDoc == JudgmentVariables.WPO31251){ // CaseMan Defect 6263
		event = JudgmentVariables.EVENT170;
	}
	else{
		// N35
		event = JudgmentVariables.EVENT150;
	}
	
	var root = "/WordProcessing";	
	var wpXML = Services.loadDOMFromURL("WordProcessingXML.xml");
	
	// get the list of Judgments
	var judgmentList = pDom.selectNodes(JudgmentVariables.JUDGMENT_PATH + "/JudgmentId");
	var judgId = null;
	var eventSeqId = null;
	var eventID = null;
	var found = false;
	var eventsSeqIdList = null;
	
	if(judgmentList != null && judgmentList.length != 0){
		for(var i = 0; i < judgmentList.length; i++){
		
			if(found == true){
				break;
			}
			judgId = judgmentList[i].text;
			// get list of event seq ids
			eventsSeqIdList = pDom.selectNodes(JudgmentVariables.JUDGMENT_PATH + "[./JudgmentId = '" + judgId + "']/JudgmentEvents/Event/EventSequence");
			if(eventsSeqIdList != null && eventsSeqIdList.length != 0){
			
				/** td tmp 352 **/
				var findApplicantXPath = JudgmentVariables.JUDGMENT_PATH + "[./JudgmentId = '" + judgId + "']/ApplicationsToVary/Variation[NewApp = 'Y']/Applicant";
				var applicant = pDom.selectSingleNode(findApplicantXPath);
				if (null != applicant) {
					wpXML.selectSingleNode(root + "/Judgment").appendChild(applicant.cloneNode(true));									
				}						
			
				// found our list - should only be one with a value in - but...
				for(var j = 0; j < eventsSeqIdList.length; j++){
					if(found == true){
						break;
					}
					
					eventSeqId = eventsSeqIdList[j].text;
					var eventNumberInDom = null;
					
					if(eventSeqId != null && eventSeqId != ""){
						// found event - check it's for the event we require
						eventNumberInDom = pDom.selectSingleNode(JudgmentVariables.JUDGMENT_PATH + "[./JudgmentId = '" + judgId + "']/JudgmentEvents/Event[./EventSequence = '" + eventSeqId +"']/EventID").text;
						
						if(eventNumberInDom != null && eventNumberInDom == event){
							found = true;
							break;
						}
					}// if(eventSeqId != null && eventSeqId != ""){				
				}// end for(var j = 0; j < idLis...
			}// end if(eventsSeqIdList != null && ...
		}// end for(var i = 0; i...	
	}// if(judgmentList != null && judgmentList.length != 0){
	
	// now set up the data
	// Add to the wp XML
	var caseNo = pDom.selectSingleNode("/ds/MaintainJudgment/CaseNumber").text;
	var caseType = pDom.selectSingleNode("/ds/MaintainJudgment/CaseType").text;

	wpXML.selectSingleNode(root + "/Case/CaseNumber").appendChild(
				wpXML.createTextNode(caseNo));
	wpXML.selectSingleNode(root + "/Case/CaseType").appendChild(
				wpXML.createTextNode(caseType));
	wpXML.selectSingleNode(root + "/Event/CaseEventSeq").appendChild(
				wpXML.createTextNode(eventSeqId));
	wpXML.selectSingleNode(root + "/Event/StandardEventId").appendChild(
				wpXML.createTextNode(event));
	wpXML.selectSingleNode(root + "/Judgment/JudgSeq").appendChild(
				wpXML.createTextNode(judgId));
				
	return wpXML;
}


/**
 * Retrives the event sequence from the dom
 * @param pDom the dom returned from the sewrvice call - contains the event ids Nb do not want to have to load into data model as loads of events will fire
 * pEvent pEventNumber 
 * @return String the event sequence
 * @author rzhh8k
 */
JudgmentFunctions.getEventSequence = function(pDom, pEventNumber)
{
	// get the list of Judgments
	var judgmentList = pDom.selectNodes(JudgmentVariables.JUDGMENT_PATH + "/JudgmentId");
	var judgId = null;
	var eventSeqId = null;
	var found = false;
	
	if(judgmentList != null && judgmentList.length != 0){
		for(var i = 0; i < judgmentList.length; i++){
			if(found == true){
				break;
			}
			
			judgId = judgmentList[i].text;
			// get list of event seq ids
			eventsSeqIdList = pDom.selectNodes(JudgmentVariables.JUDGMENT_PATH + "[./JudgmentId = '" + judgId + "']/JudgmentEvents/Event/EventSequence");
			
			if(eventsSeqIdList != null && eventsSeqIdList.length != 0){
				// found our list - should only be one with a value in - but...
				for(var j = 0; j < eventsSeqIdList.length; j++){
					eventSeqId = eventsSeqIdList[j].text;
					var eventNumberInDom = null;
					
					if(eventSeqId != null && eventSeqId != ""){
						// found event - check it's for the event we require
						eventNumberInDom = pDom.selectSingleNode(JudgmentVariables.JUDGMENT_PATH + "[./JudgmentId = '" + judgId + "']/JudgmentEvents/Event[./EventSequence = '" + eventSeqId +"']/EventID").text;
						
						if(eventNumberInDom != null){
							if(eventNumberInDom == pEventNumber){
								found = true;
								break;
							}
						}
					}// if(eventSeqId != null && eventSeqId != ""){	
								
				}// end for(var j = 0; j < idLis...
			}// end if(eventsSeqIdList != null && ...
		}// end for(var i = 0; i...	
	}	
	return eventSeqId;
}

/**
 * Function to ensure not allowing more than one Application To Vary to exist with no result
 * @return boolean - valid or not
 * @author rzhh8k
 */
JudgmentFunctions.isMultiAppToVaryWithNoResult = function()
{
	var valid = true;
	// get all apps
	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation/VarySurrogateId";
 	// get a list of all the variation results
	var varList = Services.getNodes(applicationsXP);
	
	if(varList != null && varList.length != 0){
		var counter = 0;
		var result = null;
		var varID = null
		
		// Loop through the list and call the copySingleVariation to add the variation to temp part of dom
		for(var i = 0; i < varList.length; i++){
			varId = varList[i].text;
			// get the result
			result = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = '" + varId + "']/Result");
			
			if(result == null || result == ""){
				counter++;
				if(counter > 1){
					valid = false;
					break;
				}
			}			
 		}// end for
 	}// end if(varList != null...
 	
	return valid;
}

/**
 * Function to ensure not allowing more than one Application To set Aside to exist with no result
 * @return boolean - valid or not
 * @author rzhh8k
 */
JudgmentFunctions.isMultiAppToSetAsideWithNoResult = function()
{
	var valid = true;
	// get all apps
	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application/AsideSurrogateId";
 	// get a list of all the variation results
	var appList = Services.getNodes(applicationsXP);
	
	if(appList != null && appList.length != 0){
		var counter = 0;
		var result = null;
		var appID = null
		
		// Loop through the list and call the copySingleVariation to add the variation to temp part of dom
		for(var i = 0; i < appList.length; i++){
			appId = appList[i].text;
			
			// get the result
			result = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = '" + appId + "']/Result");
			if(result == null || result == ""){
				counter++;
				if(counter > 1){
					valid = false;
					break;
				}
			}				
 		}// end for 		
 	}// appList != null &&...
	
	return valid;
}

/**
 * Function to ensure not allowing a set aside to be granted when another is still open.
 * @return boolean - valid or not
 * @author rzhh8k
 */
JudgmentFunctions.areAppSetAsidesCorrect = function()
{
	var valid = true;
	// get all apps
	var applicationsXP = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application/AsideSurrogateId";
 	
 	// get a list of all the variation results
	var appList = Services.getNodes(applicationsXP);
	if(appList != null && appList.length != 0){
		var result = null;
		var appID = null;
		
		// Loop through the list and check the results
		for(var i = 0; i < appList.length; i++){
			appId = appList[i].text;
			// get the result
			result = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = '" + appId + "']/Result");
			if(result == null || result == ""){				
				valid = false;
				break;
			}			
 		}// end for
 		
 	}// appList != null &&...	
	
	return valid;
}

/**
 * Function to set the screen navigation flags before a save so know where to go after
 * @param pObligationNoChoice
 * @param pObligationChoice
 * @param pWindowsForTrialChoice
 * @return boolean - valid or not
 * @author rzhh8k
 */
JudgmentFunctions.setNavigationFlags = function(pObligationNoChoice, pObligationChoice, pWindowsForTrialChoice)
{
	if(pObligationNoChoice == true){
		Services.setValue(JudgmentVariables.OBLIGATIONS_NO_MSG_NAVIGATION, JudgmentVariables.YES);
	}
	else if(pObligationChoice == true){
		Services.setValue(JudgmentVariables.OBLIGATIONS_MSG_NAVIGATION, JudgmentVariables.YES);
	}
	if(pWindowsForTrialChoice == true){
		Services.setValue(JudgmentVariables.WINDOW_FOR_TRIAL_NAVIGATION, JudgmentVariables.YES);
	}
}
/**
 * Navigate away from screen
 * @author rzhh8k
 * 
 */
JudgmentFunctions.exitScreen = function()
{
	// clear data
	//this.resetFlags();
	//Services.removeNode(JudgmentVariables.REF_DATA_XPATH);
	Services.removeNode(JudgmentParams.PARENT);
	
	if ( NavigationController.callStackExists() )
	{
		// tmp_caseman 318
		// Call stack exists, go to the next screen
		for(var i=0; i < NavigationController._getStackSize(); i++){
			var screen = NavigationController.getNextScreen();
			if(null != screen && screen == NavigationController.JUDGMENT_FORM){
				NavigationController.skipScreen();
			}
			else{
				break;
			}			
		}
		NavigationController.nextScreen();
	}
	else
	{
		// No call stack, return to the main menu
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**
 * Sets the Case Number in the xPath provided for another screen
 * @param pXP
 * @param pEvent
 * @author rzhh8k
 * 
 */
JudgmentFunctions.setAppCaseNumberParameter = function(pXP, pEvent)
{
	var caseNumber = Services.getValue(JudgmentParams.CASE_NUMBER);
	Services.setValue(pXP, caseNumber);
}
/**
 * resets the Hearing address details when no venue/court defined
 * @author rzhh8k
 * 
 */
JudgmentFunctions.resetHearingAddressDetails = function()
{
	Services.setValue(HearingDetails_ContactDetails_Address_Line1.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_Address_Line2.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_Address_Line3.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_Address_Line4.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_Address_Line5.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_Address_Postcode.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_DX.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_TelephoneNumber.dataBinding, "");
	Services.setValue(HearingDetails_ContactDetails_FaxNumber.dataBinding, "");
}
/**
 * HAS AN APPLICATION ALREADY BEEN ADDED SINCE SAVING THE JUDGMENT 
 * i.e. Has an application been added on a previous vist to the popup
 * Used to identify whether should clear the ADDED_APPLICATION flag
 * when the cancel buton has been selected.
 * @author rzhh8k
 * @return added  
 */
JudgmentFunctions.hasApplicationAddedPreviously = function()
{
	var added = false;
	var addedFlag = Services.getValue(JudgmentVariables.ADD_APPLICATION_SET_PREVIOUSLY);
	
	if(addedFlag != null && addedFlag == JudgmentVariables.YES){
		added = true;
	}
	
	return added;
}
/**
 * Has an aside application been added.
 * @author rzhh8k
 * @return added  
 */
JudgmentFunctions.asideApplicationAdded = function()
{
	var added = false;
	var addedFlag = Services.getValue(JudgmentVariables.ADDED_ASIDE_APPLICATION);
	
	if(addedFlag != null && addedFlag == JudgmentVariables.YES){
		added = true;
	}
	
	return added;
}

/**
 * copy the parties over for subform use
 *@deprecated &&&
 * @author rzhh8k
 * 
 */
JudgmentFunctions.copyPartiesForSubform = function()
{
	// first remove any that might be there
	Services.removeNode(JudgmentVariables.SUBFORM_PARTIES_XPATH);
	var partiesNode = Services.getNode("/ds/MaintainJudgment/Parties");
	Services.addNode(partiesNode, JudgmentVariables.SUBFORM_PARTIES_XPATH);
}

/**
 * copy the MaintainJudgment node over for subform use
 * @author rzhh8k
 * 
 */
JudgmentFunctions.copyMaintainJudgmentForSubform = function()
{
	// first remove any that might be there
	Services.removeNode(JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH);
	var partiesNode = Services.getNode("/ds/MaintainJudgment");
	Services.addNode(partiesNode, JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH);
}

/**
 * This function calculates whether any changes have been made to the judgment since the 'Amend Judgment' button
 * has been selected.
 *
 * @param pAmount the amount of the judgment
 * @param pCosts the costs associated with the judgment
 * @param pPaidBefore the amount already paid
 * @return boolean. True if changes made, false if not
 * @author rzhh8k
 */
JudgmentFunctions.amendJudgmentChangesMade = function()
{
	var changesMade = true;
	var newAmtAllowed  = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);
	var originalAmtAllowed = Services.getValue(JudgmentVariables.AMOUNT_ALLOWED_TMP_PATH);
	var newCosts  = Services.getValue(JudgmentDetails_JudgmentCosts.dataBinding);
	var originalCosts = Services.getValue(JudgmentVariables.COSTS_TMP_PATH);
	
	// need amount values in correct format - if amount changed is always to 2 decimal places, 
	// where as old maounts won't be
	var newAmountAllowedFormated = this.transformCurrency(newAmtAllowed);
	var originalAmtAllowedFormated = this.transformCurrency(originalAmtAllowed);
	var newCostsFormated = this.transformCurrency(newCosts);
	var originalCostsFormated = this.transformCurrency(originalCosts);
	if(originalAmtAllowedFormated == newAmountAllowedFormated &&
		originalCostsFormated == newCostsFormated){
		changesMade = false;
	}
	
	return changesMade;
}


/**
 * loads relevant ref data for popup/subform if necessary
 * @param pRefDataSetToAdd string representing which set of ref data we want to load
 * this depends which popup/subform is being loaded.
 *
 * GROUP 2 DEFECT 1337. Added call to add ccbc case and adding or amending
 * @author rzhh8k
 * 
 */
JudgmentFunctions.loadJudgmentReferenceData = function(pRefDataSetToAdd)
{
	var params = new ServiceParams();
	
	if(pRefDataSetToAdd == JudgmentVariables.SETASIDE_JUDGMENT_POPUP){
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsAside")){
			Services.callService("getJudgmentResultsetaside", params, MaintainJudgment, true);			
		}
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/Applicants")){
			Services.callService("getJudgmentApplicant", params, MaintainJudgment, true);
		}
	}
	else if(pRefDataSetToAdd == JudgmentVariables.VARY_JUDGMENT_POPUP){
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsVary")){
			Services.callService("getJudgmentResultvarying", params, MaintainJudgment, true);			
		}
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/Applicants")){
			Services.callService("getJudgmentApplicant", params, MaintainJudgment, true);
		}
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/JudgmentClaimResponses")){
			Services.callService("getJudgmentResponses", params, MaintainJudgment, true);
		}
	}
	else if(pRefDataSetToAdd == JudgmentVariables.GET_COSTS_FOR_CCBC){
		if(!Services.exists(JudgmentVariables.REF_DATA_XPATH + "/Costs")){
			Services.callService("getCostsForJudgmentList", params, MaintainJudgment, true);			
		}

	}
}

/**
 * Has a vary application been added.
 * @author rzhh8k
 * @return added  
 */
JudgmentFunctions.varyApplicationAdded = function()
{
	var added = false;
	var addedFlag = Services.getValue(JudgmentVariables.ADDED_VARY_APPLICATION);
	
	if(addedFlag != null && addedFlag == JudgmentVariables.YES){
		added = true;
	}
	
	return added;
}

/**
 * This function works out if the costs are correct on the judgment
 * Used for CCBC cases only
 * Part of GROUP 2 defect 1337
 * @return boolean representing whether valid (true) or not (false)
 * @author rzhh8k
 */
JudgmentFunctions.isJudgmentCostValid = function(pJudgmentCosts, pJudgmentDate, pJudgmentAmount, pJudgmentType, pAdding)
{
	var validCosts = true; // returned
	
	var caseCourtFee = null;
	var caseSolicitorCosts = null;
	if(pAdding == true){
		caseCourtFee = Services.getValue("/ds/var/form/subformcopy/MaintainJudgment/CourtFee");
		caseSolicitorCosts = Services.getValue("/ds/var/form/subformcopy/MaintainJudgment/SolicitorsCosts");
	}
	else{
		caseCourtFee = Services.getValue("/ds/MaintainJudgment/CourtFee");
		caseSolicitorCosts = Services.getValue("/ds/MaintainJudgment/SolicitorsCosts");
	}
	if(caseCourtFee == null || caseCourtFee == ""){
		caseCourtFee = "0.00";
	}

	if(caseSolicitorCosts == null || caseSolicitorCosts == ""){
		caseSolicitorCosts = "0.00";
	}
	
 	// get a list of all the costs
	var costList = Services.getNodes(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost/UniqueId");
	// variables for use in for loop
	var id = null;
	var effectiveDate = null;
	var rangeTo = null;
	var rangeFrom = null;
	var process = null; // name on database for judgment type
	var compare = null;
	var judgDateObj = null;
	var effectiveDateObj = null;

	if(costList != null && costList.length != 0){
		// Loop through the list to see if an id is there
		for(var i = 0; i < costList.length; i++){
			id = costList[i].text;			
			if(id != null && id != ""){
				process = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost[./UniqueId = " + id + "]/Process");
				
				if(process != null && process == pJudgmentType){
					effectiveDate = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost[./UniqueId = " + id + "]/EffectiveDate");	
					judgDateObj	= CaseManUtils.createDate(pJudgmentDate);
					effectiveDateObj = CaseManUtils.createDate(effectiveDate);
					if(judgDateObj != null && effectiveDateObj != null){								
						compare = CaseManUtils.compareDates(judgDateObj, effectiveDateObj);		
						if(compare < 1){ // if judgement date >= effective date
							rangeTo = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost[./UniqueId = " + id + "]/To");
							rangeFrom = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost[./UniqueId = " + id + "]/From");
							if((parseFloat(pJudgmentAmount) >= parseFloat(rangeFrom)) && 
										(parseFloat(pJudgmentAmount) <= parseFloat(rangeTo))){ // if judgment amount in range
								
								var costs = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/Costs/Cost[./UniqueId = " + id + "]/Costs");
								var sum = parseFloat(caseCourtFee) + parseFloat(caseSolicitorCosts) + parseFloat(costs);
								if(parseFloat(pJudgmentCosts) > sum){
									validCosts = false;								
								}
								break;
								
							}//if((parseFloat(pJudgmentAmount) >= parseFloat(rangeFrom)) && ..			
						}//if(compare < 1){
					}//if(judgDateObj != null && effectiveDateObj != null){
				}//if(process != null && process == pJudgmentType){
			}//if(id != null && id != ""){			
		}// for	
	}//if(costList != null && costList.length != 0){

	return validCosts;
}


/**
 * Indicates whether or not the current court is a CCBC Court.
 * @author rzhh8k
 * @return boolean 
 */
JudgmentFunctions.isCCBCCourt = function()
{
	var currentCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	return ( currentCourt == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}


/**
 * Indicates whether or not the current court is a CCBC Court.
 * Defect 1337
 * @author rzhh8k
 * @return boolean 
 */
JudgmentFunctions.isCCBCCourtForAddJudgment = function()
{
	var currentCourt = Services.getValue(JudgmentVariables.SUBFORM_MAINTAIN_JUDGMENT_XPATH + "/MaintainJudgment/OwningCourtCode");
	return ( currentCourt == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}
/**
 * Indicates whether or not all Judgments have been paid in full (required for firing of
 * event 79).
 *
 * Amended ccbc grp 2 1602. Only set if all defendants have a judgment against them and they 
 * 							all have a value in date paid in full.
 * @return [Boolean] True if all Judgments have been paid in full, else false.
 * @author rzhh8k
 */
JudgmentFunctions.allJudgmentsPaidInFull = function()
{
	var isPaidInFull = false;
	
	// get number of judgments with defendant as party against and not set aside
	var countJudgments = Services.countNodes(JudgmentVariables.JUDGMENT_PATH + "[./PartyRoleCode = 'DEFENDANT' and ./Status != 'SET ASIDE']");
	// get number of defendants
	var countDefendants = Services.countNodes("/ds/MaintainJudgment/Parties/Party" + "[./PartyRoleCode = 'DEFENDANT']");
	// get number of judgments with paid in full date and defendant as party against
	var countPaidInFullJudgments = Services.countNodes(JudgmentVariables.JUDGMENT_PATH + "[./PaidInFullDate != '' and ./PartyRoleCode = 'DEFENDANT']");
	
	// if the number of judgments with a party against of DEFENDANT, equals the number of judgments with a party against of DEFENDANT
	// and a paid in full date AND all the defendants have had judgment against
	if(countJudgments == countPaidInFullJudgments && countDefendants == countJudgments){
		// set the case status
		isPaidInFull = true;
	}
	
	return isPaidInFull;
	
	// old stuff
	//var countJudgments = Services.countNodes(JudgmentVariables.JUDGMENT_PATH);
	//var countPaidInFullJudgments = Services.countNodes(JudgmentVariables.JUDGMENT_PATH + "[./PaidInFullDate != '']");
	//return ( countJudgments == countPaidInFullJudgments ) ? true : false;
}