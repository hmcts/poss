/** 
 * @fileoverview function MaintainCOFunctions.js:
 * This files defines a class to represent all common functions used by the 
 * MaintainCO.js file.
 *
 * @author MGG
 * @version 1.0
 *
 * Amended:
 * Mark Groen - defect 4479.  			Event detail to include debtor name and CO number.  Format is <CONumber> : <Debtor Name>
 *
 * Mark Groen - defect 5167.   			When adding a debt and selecting the creditor and payee from a case,
 *							   			If the creditor and payee were coded parties they used the same party Id.
 *										I.e. The client code was setting the creditor and payee with the same code - now it doesn't. 
 *										Updated the addCreditorAndPayeeDetailTabFields() FUNCTION
 *
 * Mark Groen - defect 4479.    		Updated 26/09/06. Serverside code now sets the Event detail to append the CO number.  Format is <CONumber> : <Debtor Name
 * Mark Groen - defect 5535.    		Updated 02/10/06. Event 777 - when debt set to deleted in create mode the coNumber is null
 * Mark Groen - defect 5329.    		Updated 03/10/06. Not clearing Workplace address when clear employer address in creat mode.
 * Mark Groen - defect temp_caseman 389	Updated 20/12/06. Not setting Schedule Two total correcxtl when have passthroughs on them.  The passthrough is 
 *												 		  counted against normal debts and not the scxhedule two ones.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 
 * 21/01/2008 - Mark Groen, defect CASEMAN 6474 - Defect states - - In some cases the outstanding balance field has a 
 * 				red border around it due to the amount being to long. To the user the value looks correct, but 
 * 				javascript produces a number with a large amount of decimal places and therefore the appication 
 * 				believes it to be invalid.
 * 15/02/2011 - Chris Vincent, updated setEventsReTransfer() to remove the loop which processes the Debts and sends out 777 Case Events and CO Case Events.
 *				Trac 4215.
 * 19/09/2011 - Chris Vincent, Change to function MaintainCOFunctions.isNonCPCNationalCodedParty to use new generic CaseManUtils function.  Trac 4553.
 */

/**
 * @constructor
 * @author rzhh8k
 * 
 */
function MaintainCOFunctions()
{
}

/**
 * This function converts the value in the DOM to be the correct currency character
 *
 * @param pCurrency the currency to be converted
 * @return Converted currency symbol
 * @author rzhh8k
 */
MaintainCOFunctions.transformToDisplayCurrency = function(pCurrency)
{
	// Get the current currency from the DOM.  This is the currency at the present time - - e.g. £ or €
	// This is retrieved to return as a default value if pCurrency is null
	return CaseManUtils.transformCurrencySymbolToDisplay(pCurrency, MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/**
 * This function sets the screen mode
 * @rparam pMode 
 * @param pMode
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setScreenMode = function(pMode)
{
	if(null != pMode && pMode != ""){
		Services.setValue(ManageCOParams.MODE, pMode);	
	}
}

/**
 * This function calculates if teh screen mode is create or not
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.isScreenModeCreate = function()
{
	var isCreate = false;
	var mode = Services.getValue(ManageCOParams.MODE);	
	if(null != mode && mode == ManageCOParamsConstants.CREATE_MODE){
		isCreate = true;
	}
	return isCreate;
}

/**
 * This function calculates if the screen mode is maintain or not
 * 
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.isScreenModeMaintain = function()
{
	var isMaintain = false;
	var mode = Services.getValue(ManageCOParams.MODE);	
	if(null != mode && mode == ManageCOParamsConstants.MAINTAIN_MODE){
		isMaintain = true;
	}
	return isMaintain;
}

/**
 * This function calculates if the screen mode is initial or not
 * 
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.isScreenModeInitial = function()
{
	var isInitial = false;
	var mode = Services.getValue(ManageCOParams.MODE);	
	if(null == mode || mode == "" || mode == ManageCOParamsConstants.INITIAL_MODE){
		isInitial = true;
	}
	return isInitial;
}

/**
 * This function calculates if the screen mode is read only or not
 * 
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.isScreenModeReadOnly = function()
{
	var isRO = false;
	var mode = Services.getValue(ManageCOParams.MODE);	
	if(null != mode && mode == ManageCOParamsConstants.READONLY_MODE){
		isRO = true;
	}
	return isRO;	
}


/**
 * This function calculates if the field should be enabled
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.isFieldEnabled = function()
{
	var enabled = true;	
	var initialMode = this.isScreenModeInitial();
	if(initialMode == true){
		enabled = false;
	}
	return enabled;
}

/**
 * Checks whether date is in the future.  It returns an error if it is!
 * pDate the date to validate
 * pTestNotinFuture boolean representing whether to throw error if in future or error if in past
 * @return error Code, null if not in future, otherwise exception and is in future
 * @param pDate
 * @param pTestNotinFuture
 * @author rzhh8k
 */
MaintainCOFunctions.validateDateInFuture = function(pDate, pTestNotinFuture) 
{
   	var errCode = null;
    if(pDate != null && pDate != ""){
    	var today = CaseManUtils.createDate(this.getTodaysDate());
    	var compare = CaseManUtils.compareDates(today, CaseManUtils.createDate(pDate));    	
    	if(compare > 0 && pTestNotinFuture == true){
    		errCode = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
    	}
    	else if(compare < 1 && pTestNotinFuture == false){
    		// date is not in future
    		errCode = ErrorCode.getErrorCode("Caseman_dateMustbeInFuture_Msg");
    	}   	
    }
	
	return errCode;
}


/**
 * Returns the current system date, based on the getSystemDate server call.
 * The returned date is in the format YYYY-MM-DD
 * @author rzhh8k
 * @return date  
 */
MaintainCOFunctions.getTodaysDate = function() 
{
	var date = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/SystemDate");	
	if(date == null){
		date = CaseManUtils.convertDateToPattern(new Date(),"YYYY-MM-DD");
	}	
	return date;
}

/**
 * This function checks to see if the given date precedes the Order Date
 * @param pDate
 * @return error code if date is after the order date
 * @author rzhh8k
 */
MaintainCOFunctions.validateDateNotAfterOrderDate = function(pDate)
{
	var errCode = null;
	var orderDate = Services.getValue(CODetails_OrderDate.dataBinding);
	if(orderDate != null && orderDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(orderDate), CaseManUtils.createDate(pDate));
		if(compare > 0){
			errCode = ErrorCode.getErrorCode("Caseman_dateMustPreceedOrderDate_Msg");
		}
	}	
	return errCode;
}

/**
 * This function checks to see if the given date is before the Order Date
 * @param pDate
 * @return error code if date is before the order date
 * @author rzhh8k
 */
MaintainCOFunctions.validateDateNotBeforeOrderDate = function(pDate)
{
	var errCode = null;
	var orderDate = Services.getValue(CODetails_OrderDate.dataBinding);
	if(orderDate != null && orderDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), CaseManUtils.createDate(orderDate));

		if(compare > 0){
			errCode = ErrorCode.getErrorCode("Caseman_dateMustNotPreceedOrderDate_Msg");
		}
	}	
	return errCode;
}

/**
 * This function checks to see if the given date is after the Order Date
 * @param pDate
 * @return error code if date is before the order date
 * @author rzhh8k
 */
MaintainCOFunctions.validateDateNotBeforeOrderDate = function(pDate)
{
	var errCode = null;
	var orderDate = Services.getValue(CODetails_OrderDate.dataBinding);
	if(orderDate != null && orderDate != "" && pDate != null && pDate != ""){
		var compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), CaseManUtils.createDate(orderDate));
		if(compare > 0){
			errCode = ErrorCode.getErrorCode("Caseman_dateMustNotPreceedOrderDate_Msg");
		}
	}	
	return errCode;
}


/**
 * This function sets default values for create mode
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setCreateCODefaultData = function()
{
	// Clear the co
	Services.removeNode(MaintainCOVariables.CO_XPATH);	
	
	// load the xml in for a new debt
	// Set new part of DOM
	var newCO = Services.loadDOMFromURL("NewCO.xml");
	var coNodeXP = "/ds";
	Services.addNode(newCO, coNodeXP);
	
	var today = this.getTodaysDate();
	Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.CREATE_MODE);
	Services.setValue(Header_Status.dataBinding, MaintainCOVariables.STATUS_APPLN);
	Services.setValue(CODetails_AppDate.dataBinding, today);
	Services.setValue(CODetails_FeeRate.dataBinding, "10");
	Services.setValue(CO_ContactDetails_Address_CommMethod.dataBinding, "LE");
	
	// set the court to the users home court. 
	var courtNo = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var xpathName = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[Code = '" + courtNo + "']/Name";		
	var courtName = Services.getValue(xpathName);
	if(courtNo != null && courtNo != "" && courtName != null && courtName != ""){
		// it's a valid court so set it.
		Services.setValue(Header_OwningCourtCode.dataBinding, courtNo);
		Services.setValue(Header_OwningCourtName.dataBinding, courtName);
	}
	
	// Set the deafult financial values
	Services.setValue(CO_Money_TotalAllowed.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalPaidOut.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalDue.dataBinding, "0.00");
	Services.setValue(CO_Money_MoniesInCourt.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalFee.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalFeesPaid.dataBinding, "0.00");
	Services.setValue(CO_Money_ScheduleTwoFee.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalPassthroughs.dataBinding, "0.00");
	Services.setValue(CO_Money_ScheduleTwoTotal.dataBinding, "0.00");
	Services.setValue(CO_Money_TotalOutstanding.dataBinding, "0.00");
	Services.setValue(CO_Money_BalanceDue.dataBinding, "0.00");
	
	//set currency fields
	var defaultCurrency = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	Services.setValue(CODetails_TargetAmountCurrency.dataBinding, defaultCurrency);
	Services.setValue(CODetails_InstlAmountCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_EmploymentDetailsPERCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalAllowedCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalPaidOutCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_MoniesInCourtCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalFeeCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalFeesPaidCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_ScheduleTwoFeeCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalDueCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalPassthroughsCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_ScheduleTwoTotalCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_TotalOutstandingCurrency.dataBinding, defaultCurrency);
	Services.setValue(CO_Money_BalanceDueCurrency.dataBinding, defaultCurrency);
	
	// ensure flags have been reset
	Services.setValue(MaintainCOVariables.ORIGINAL_DEBTOR_NAME, "");
	
	//1473 - need to set th edate of birth field
	Services.setValue("/ds/MaintainCO/Debtor/DateOfBirth", "");
	
}

/**
 * This function checks to see if the status allows a field to be updated
 * Used in Maintain CO and Maintain Debts
 * @author rzhh8k
 * @return updateable  
 */
MaintainCOFunctions.statusAllowsUpdate = function()
{
	var updateable = false;
	var status = Services.getValue("/ds/MaintainCO/COStatus");
	if(null != status && status != ""){
		if(status == MaintainCOVariables.STATUS_APPLN || status == MaintainCOVariables.STATUS_LIVE ||
			status == MaintainCOVariables.STATUS_SUSPENDED || status == MaintainCOVariables.STATUS_SETASIDE ||
				status == MaintainCOVariables.STATUS_DEBTORPAYING){
			
		 	updateable = true;
		 }	
	}
	return updateable;
}

/**
 * This function checks to see if the composition fields should be read only
 * @return boolean
 * @author rzhh8k
 */
MaintainCOFunctions.isCompositionFieldReadOnly = function()
{
	var readonly = false;
	
	if(this.isScreenModeMaintain() == true){
		// need to check if any dividends been made, if yes read only
		var div = Services.getValue(CO_Money_TotalPaidOut.dataBinding);
		var pass = Services.getValue(CO_Money_TotalPassthroughs.dataBinding);
		if(div != null && div != "" && parseFloat(div) > 0){
			readonly = true;
		}
		else if(pass != null && pass != "" && parseFloat(pass) > 0){
			readonly = true;
		}
		
		if(readonly == false){
			// Check that the CO is not an 'CAEO'
			var coType = Services.getValue(Header_Type.dataBinding);
			if(coType != null && coType != "" && coType == MaintainCOVariables.COTypeCAEO){
				readonly = true;
			}
		}
	}
	else if(this.isScreenModeCreate() == true){
		readonly = true;
	}	
	return readonly;
}

/**
 * This function resets the CO workplace 
 * 
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.resetWorkplaceAddress = function()
{
	// just clear addresses
	Services.setValue(CO_WorkplaceDetails_Address_Line1.dataBinding, "");
	Services.setValue(CO_WorkplaceDetails_Address_Line2.dataBinding, "");
	Services.setValue(CO_WorkplaceDetails_Address_Line3.dataBinding, "");
	Services.setValue(CO_WorkplaceDetails_Address_Line4.dataBinding, "");
	Services.setValue(CO_WorkplaceDetails_Address_Line5.dataBinding, "");
	Services.setValue(CO_WorkplaceDetails_Address_Postcode.dataBinding, "");
	
	// clear other database fields and set status to new
	Services.setValue("/ds/MaintainCO/Workplace/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
	Services.setValue("/ds/MaintainCO/Workplace/Address/AddressSurrogateId", this.getNextSurrogateKey());
	Services.setValue("/ds/MaintainCO/Workplace/Address/AddressId", "");
	Services.setValue("/ds/MaintainCO/Workplace/Address/ValidFrom", "");
	Services.setValue("/ds/MaintainCO/Workplace/Address/ValidTo", "");
	Services.setValue("/ds/MaintainCO/Workplace/Address/CreatedBy", "");
	Services.setValue("/ds/MaintainCO/Workplace/Address/SCN", "");
}


/**
 * This function resets the CO workplace (if applicable) and Employer address
 * pWorkPlaceAdd1 Used to determine if a workplace exists - to clear
 * 
 * @param pWorkPlaceAdd1
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.resetEmployerAndWorkplaceAddress = function(pWorkPlaceAdd1)
{
	// just clear addresses
	Services.setValue(CO_EmploymentDetails_Address_NamedPerson.dataBinding, "");
	Services.setValue(CO_EmploymentDetailsOccupation.dataBinding, "");
	Services.setValue(CO_EmploymentDetailsPayRef.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Employer.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Line1.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Line2.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Line3.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Line4.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Line5.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Postcode.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_CreatedBy.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_DXNo.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_TelNo.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_FaxNo.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Email.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_CommMethod.dataBinding, "");
	Services.setValue(CO_EmploymentDetails_Address_Welsh.dataBinding, "N");
	
	
	// clear other database fields and set status to new
	Services.setValue("/ds/MaintainCO/Employer/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
	Services.setValue("/ds/MaintainCO/Employer/Address/AddressSurrogateId", this.getNextSurrogateKey());
	Services.setValue("/ds/MaintainCO/Employer/Address/AddressId", "");
	Services.setValue("/ds/MaintainCO/Employer/Address/ValidFrom", "");
	Services.setValue("/ds/MaintainCO/Employer/Address/ValidTo", "");
	Services.setValue("/ds/MaintainCO/Employer/Address/CreatedBy", "");
	Services.setValue("/ds/MaintainCO/Employer/Address/SCN", "");	
	
	if(pWorkPlaceAdd1 != null && pWorkPlaceAdd1 != ""){
		this.resetWorkplaceAddress();
	}
}

/**
 * This function clears the CO workplace (if applicable) and Employer address
 * If pCreateMode is true the addresses are set to blank, other wise they are 
 * reset and placed in the history.
 *
 * @param pCreateMode is create mode
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.clearEmployerAndWorkplaceAddress = function(pCreateMode)
{	
	//defect 5329 - moved line below to be outside the if statement as used outside.
	var workAddExists = Services.getValue(CO_WorkplaceDetails_Address_Line1.dataBinding);
	if(pCreateMode == false){
		// will need to change the valid to date to today.
		var today = this.getTodaysDate();
		
		// if status is "new" do not enter into history as not required.
		var employStatus = Services.getValue("/ds/MaintainCO/Employer/Address/Status");
		if(employStatus != null && employStatus != MaintainCOVariables.STATUS_FLAG_NEW){
			Services.setValue("/ds/MaintainCO/Employer/Address/ValidTo", today);
			Services.setValue("/ds/MaintainCO/Employer/Address/Status", MaintainCOVariables.STATUS_FLAG_MODIFIED);

			var empNode = Services.getNode("/ds/MaintainCO/Employer/Address");
			Services.addNode(empNode, "/ds/MaintainCO/Employer/AddressHistory");
					
					
			if(workAddExists != null && workAddExists != ""){
				// now check workplace address
				this.clearWorkplaceAddress(pCreateMode);
			}// if(workAddExists != null && workAddExists != ""){
		}//if(employStatus != null && employStatus != Ma...
	}
	this.resetEmployerAndWorkplaceAddress(workAddExists);	
}

/**
 * This function clears the CO workplace address
 * If pCreateMode is true the address is set to blank, other wise
 * reset and placed in the history.
 *
 * @param pCreateMode is create mode
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.clearWorkplaceAddress = function(pCreateMode)
{
	if(pCreateMode == false){
		// if status is "new" do not enter into history as not required (not saved yet).
		var workStatus = Services.getValue("/ds/MaintainCO/Workplace/Address/Status");
		if(workStatus != null && workStatus != MaintainCOVariables.STATUS_FLAG_NEW){
			var today = this.getTodaysDate();
			// need to change the valid to date to today
			Services.setValue("/ds/MaintainCO/Workplace/Address/ValidTo", today);
			Services.setValue("/ds/MaintainCO/Workplace/Address/Status", MaintainCOVariables.STATUS_FLAG_MODIFIED);
			var wkplaceNode = Services.getNode("/ds/MaintainCO/Workplace/Address");
			Services.addNode(wkplaceNode, "/ds/MaintainCO/Workplace/AddressHistory");
		}
	}
	this.resetWorkplaceAddress();	
}

/**
 * This function adds the new validated address to the DOM - used maintainCO.js
 * @param pAddressType. Address type - debtor, employer of workplace
 * @param pSurrogateID. Surrogate id of new address
 * @param pAddDateToHistory boolean representing whether need to add a current address to the history
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addAddress = function(pAddressType, pSurrogateID, pAddDateToHistory)
{
	var today = this.getTodaysDate();
	
	// do we need to move a current date to the history?
	var addressLine1 = Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[1]")
	if(pAddDateToHistory == true && null != addressLine1 && addressLine1 != ""){
				
		var domStatus = Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Status");
		var currentStatus = "";
		if(domStatus == null || domStatus == ""){
			currentStatus = MaintainCOVariables.STATUS_FLAG_NEW;
		}
		else if(domStatus == MaintainCOVariables.STATUS_FLAG_EXISTING){
			currentStatus = MaintainCOVariables.STATUS_FLAG_MODIFIED;
		}
		else{
			currentStatus = domStatus;
		}
		
		// don't add history if address has not been previously saved.
		if(currentStatus != MaintainCOVariables.STATUS_FLAG_NEW){
			var root = "/Address";	
			// Set new part of DOM
			var newAddress = Services.loadDOMFromURL("NewAddress.xml");
			
			// Set up data
			newAddress.selectSingleNode(root + "/SCN").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/SCN"))));
			newAddress.selectSingleNode(root + "/Status").appendChild(
				newAddress.createTextNode(currentStatus));
			newAddress.selectSingleNode(root + "/AddressId").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressId"))));
			newAddress.selectSingleNode(root + "/AddressSurrogateId").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressSurrogateId"))));
			newAddress.selectSingleNode(root + "/Line[1]").appendChild(
				newAddress.createTextNode(addressLine1));
			newAddress.selectSingleNode(root + "/Line[2]").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[2]"))));
			newAddress.selectSingleNode(root + "/Line[3]").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[3]"))));
			newAddress.selectSingleNode(root + "/Line[4]").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[4]"))));
			newAddress.selectSingleNode(root + "/Line[5]").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[5]"))));
			newAddress.selectSingleNode(root + "/PostCode").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/PostCode"))));
			newAddress.selectSingleNode(root + "/CreatedBy").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/CreatedBy"))));
			newAddress.selectSingleNode(root + "/ValidFrom").appendChild(
				newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/ValidFrom"))));
			newAddress.selectSingleNode(root + "/ValidTo").appendChild(
				newAddress.createTextNode(today));
			
			var addressNode = MaintainCOVariables.CO_XPATH + pAddressType + "/AddressHistory";
			Services.addNode(newAddress, addressNode);
			
			if(pAddressType == MaintainCOVariables.DEBTOR_ADDRESS_XP){
				Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_EXISTS, MaintainCOVariables.YES);
			}
			else if(pAddressType == MaintainCOVariables.EMPLOYMENT_ADDRESS_XP){
				Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_EXISTS, MaintainCOVariables.YES);
			}
			else if(pAddressType == MaintainCOVariables.WORKPLACE_ADDRESS_XP){
				Services.setValue(MaintainCOVariables.WORKPLACE_HISTORY_EXISTS, MaintainCOVariables.YES);
			}
			
		}
	}// end if(pAddDateToHistory == true){
	
	
	// Set new part Address
	var add1 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[1]");
	var add2 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[2]");
	var add3 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[3]");
	var add4 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[4]");
	var add5 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[5]");
	var postcode = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/PostCode");
	
	// if previous address did not exist copy the scn and status flag, other wise creating a new address
	if(pAddDateToHistory == true && null != addressLine1 && addressLine1 != ""){
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/SCN", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressId", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressSurrogateId", pSurrogateID);
	}
	else if(pAddDateToHistory == true){
		// scn, id and surrogate id do not change
		// status becomes modified - - NB ONLY IF IT IS NOT ALREADY EXISTING
		if(currentStatus != MaintainCOVariables.STATUS_FLAG_NEW){
			Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_MODIFIED);
		}
	}
	else{
		// creating
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressId", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/AddressSurrogateId", pSurrogateID);
	}

	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[1]", add1);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[2]", add2);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[3]", add3);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[4]", add4);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/Line[5]", add5);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/PostCode", postcode);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/CreatedBy", Services.getCurrentUser()); 
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/ValidFrom", today);
	Services.setValue(MaintainCOVariables.CO_XPATH + pAddressType + "/Address/ValidTo", "");
	
	// Clear out the temp data
	this.resetTempAddress();	
}

/**
 * This function adds the new validated address to the DOM - used maintainDebt.js
 * @param pAddressType. Address type - debtor, employer of workplace
 * @param pSurrogateID. Surrogate id of new address
 * @param pAddToHistory. Boolean representing whether should add to history
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addAddressMaintainDebt = function(pAddressType, pSurrogateID, pAddToHistory)
{
	var today = this.getTodaysDate();
	var address1 = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[1]")
	if(pAddToHistory == true){
		// only add to history if address line 1 there as otherwise it's a blank address
		this.addAddressToHistory(today, pAddressType);
	}
	var currentStatus = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status");
		
	// Set new part Address
	var add1 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[1]");
	var add2 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[2]");
	var add3 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[3]");
	var add4 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[4]");
	var add5 = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[5]");
	var postcode = Services.getValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/PostCode");	
	
	// if previous address did exist copy the scn and status flag, other wise creating a new address
	if(pAddToHistory == true && null != address1 && address1 != ""){
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/SCN", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressId", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressSurrogateId", pSurrogateID);
	}
	else if(pAddToHistory == true){
		// scn, id and surrogate id do not change
		// status becomes modified - - NB ONLY IF IT IS NOT ALREADY EXISTING
		if(currentStatus != MaintainCOVariables.STATUS_FLAG_NEW){
			Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_MODIFIED);
		}
	}
	else if(currentStatus != MaintainCOVariables.STATUS_FLAG_NEW){
		// Address is empty and we need to update this address with th enew details
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_MODIFIED);
	}
	else{
		// creating
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressId", "");
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressSurrogateId", pSurrogateID);
	}
	
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[1]", add1);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[2]", add2);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[3]", add3);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[4]", add4);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[5]", add5);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/PostCode", postcode);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/CreatedBy", Services.getCurrentUser());
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/ValidFrom", today);
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/ValidTo", "");
	
	// Clear out the temp data
	this.resetTempAddress();	
}

/**
 * This function adds an address to history for maintain debts Creditor and Payee
 * @param pToday - todays date
 * @param pAddressType. Address type - CREDITOR OR PAYEE
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addAddressToHistory = function(pToday, pAddressType)
{
	var domStatus = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status");
	var currentStatus = "";
	if(domStatus == null || domStatus == ""){
		domStatus = MaintainCOVariables.STATUS_FLAG_NEW;
	}	
	else if(domStatus == MaintainCOVariables.STATUS_FLAG_EXISTING){
		currentStatus = MaintainCOVariables.STATUS_FLAG_MODIFIED;
	}
	else{
		currentStatus = domStatus;
	}
	
	if(currentStatus != MaintainCOVariables.STATUS_FLAG_NEW){	
		// if the address is a local party then need to add it as a new address to the history
		var addType = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressTypeCode");
		var addId = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressId");	
		var surrAddId = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressSurrogateId");	
				
		if(addType != null && addType == MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY){
			currentStatus = MaintainCOVariables.STATUS_FLAG_NEW;
			addId = "";	
			surrAddId = this.getNextSurrogateKey();
		}
				
		var root = "/Address";
		//move a current date to the history		
		// Set new part of DOM
		var newAddress = Services.loadDOMFromURL("NewAddress.xml");
	
		// Set up data
		newAddress.selectSingleNode(root + "/SCN").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/SCN"))));
		newAddress.selectSingleNode(root + "/Status").appendChild(
			newAddress.createTextNode(currentStatus));
		newAddress.selectSingleNode(root + "/AddressId").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(addId)));
		newAddress.selectSingleNode(root + "/AddressSurrogateId").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(surrAddId)));
		newAddress.selectSingleNode(root + "/Line[1]").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[1]"))));
		newAddress.selectSingleNode(root + "/Line[2]").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[2]"))));
		newAddress.selectSingleNode(root + "/Line[3]").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[3]"))));
		newAddress.selectSingleNode(root + "/Line[4]").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[4]"))));
		newAddress.selectSingleNode(root + "/Line[5]").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[5]"))));
		newAddress.selectSingleNode(root + "/PostCode").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/PostCode"))));
		newAddress.selectSingleNode(root + "/CreatedBy").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/CreatedBy"))));
		newAddress.selectSingleNode(root + "/ValidFrom").appendChild(
			newAddress.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/ValidFrom"))));
		newAddress.selectSingleNode(root + "/ValidTo").appendChild(
			newAddress.createTextNode(pToday));
		
		var addressNode = MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/AddressHistory";
		Services.addNode(newAddress, addressNode);		
	}	
}

/**
 * This function clears the provided tab on Maintain Debts
 * @param pAddressType. Address type - creditor (CREDITOR_ADDRESS_XP) or payee (PAYEE_ADDRESS_XP)
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.clearMaintainDebtTab = function(pAddressType)
{
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Status", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressId", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/AddressSurrogateId", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[1]", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[2]", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[3]", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[4]", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/Line[5]", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/PostCode", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/CreatedBy", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/ValidFrom", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Address/ValidTo", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Name", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/DX", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/TelNo", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/FaxNo", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Email", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/CommMethod", "");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/TranslationToWelsh", "N");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/AddressUnknown", "N");
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/Reference", "");
	
	// need to reset the party id and cpCode to ""
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/PartyId", "");	
	Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]" + pAddressType + "/CPCode", "");	
	
	if(pAddressType == MaintainCOVariables.CREDITOR_ADDRESS_XP){
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/AddressUnknown", "N");
		Services.setValue("/ds/var/tmp/MaintainDebtCreditorCodedParty", "");	
	}
	else{
		Services.setValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtPayeeIndicator", "N");
		Services.setValue("/ds/var/tmp/MaintainDebtPayeeCodedParty", "");
	}
}

/**
 * This function clears the temp add address area
 * @param pAddressType. Address type - debtor, employer of workplace
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.resetTempAddress = function()
{
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[1]", "");
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[2]", "");
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[3]", "");
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[4]", "");
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[5]", "");
	Services.setValue(MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/PostCode", "");
}

/**
 * Is cancel message to be displayed or not
 *
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.displayCancelMessage = function()
{
	var valueStored = Services.getValue(MaintainCOVariables.DISPLAY_CANCEL_MESSAGE);
	var display = false;
	if(valueStored != null && valueStored == MaintainCOVariables.YES){
		display = true;
	}
	return display;
}

/**
 * Sets the flag to the value of the param passed in 
 * The flag is used to determined whether 
 * the cancel message should be displayed - i.e. is there any need for the cancel message.
 *
 * @param pValue Either Y or N
 * @param pFieldValue the value of the filed that has been set.
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setCancelMessage = function(pFlagValue, pFieldValue)
{
	if(pFieldValue != null && pFieldValue != ""){
		Services.setValue(MaintainCOVariables.DISPLAY_CANCEL_MESSAGE, pFlagValue);
	}
	else if(pFlagValue == MaintainCOVariables.NO){
		Services.setValue(MaintainCOVariables.DISPLAY_CANCEL_MESSAGE, pFlagValue);
	}
}


/**
 * If there are no debts attached to the CO return false else true
 * @return boolean representing whether debt exists
 * @author rzhh8k
 */
MaintainCOFunctions.debtsExistsOnCO = function()
{
	var debtsExists = true;
	var gridBinding = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	if(CaseManUtils.isBlank(gridBinding) == true){
		debtsExists = false;
	}
	return debtsExists;	
}

/**
 * works out if field on Maintain Debt screen should be RO
 * @return boolean representing whether Read only or not
 * @author rzhh8k
 */
MaintainCOFunctions.readOnlyMaintainDebtField = function()
{
	var readOnly = this.isScreenModeReadOnly();
	
	if(readOnly == false){
		var updateable = this.statusAllowsUpdate();
		if(updateable == false){
			readOnly = true;
		}
		else{
			// can also be read only if individal debt status is set to paid
			var debtStatus = Services.getValue(MaintainDebt_Status.dataBinding);
			if(null != debtStatus && debtStatus == MaintainCOVariables.STATUS_PAID){
				readOnly = true;
			}
		}
	}
	
	return readOnly;
}
	
/**
 * This function validates the new address being added
 * It looks at all relevant fields and checks their state
 * @param pAdd1Id adaptor Id to test against
 * @param pAdd2Id adaptor Id to test against
 *
 * @return boolean 
 * @author rzhh8k
 */
MaintainCOFunctions.validateAddAddress = function(pAdd1Id, pAdd2Id, pPostcode)
{
	 var isValid = true;
	 
	 // get Adaptors
	 var add1 = Services.getAdaptorById(pAdd1Id);
	 var add2 = Services.getAdaptorById(pAdd2Id);
	 var pcode = Services.getAdaptorById(pPostcode);
	 
	 // check 
	 if(add1.getMandatory() || add2.getMandatory()){
	 	isValid = false;
	 }
	 else if(!pcode.getValid()){
	 	isValid = false;
	 }
	 return isValid;	 
}

/**
 * Retrives the CO from the database
 * @param pCONumber - the Consolidation Order to retreive
 * @param pInitialising boolean representing whether loading the screen via dataload or the co number 
 *						so call correct onSuccess function
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.getCO = function(pCONumber, pInitialising)
{
	if(pCONumber != null && pCONumber != ""){
		// Make call to service to retrieve the CO details
		var params = new ServiceParams();
		params.addSimpleParameter("coNumber", pCONumber.toUpperCase());
		if(pInitialising){
			Services.callService("getCo", params, loadData, true);
		}
		else{
			Services.setValue(ManageCOParams.CO_NUMBER, pCONumber);
			Services.callService("getCo", params, Header_CONumber, true);
		}
	} // end if(pCONumber != null && pCONumber != ""){		
}

/**
 * Retrives the CO Debts from the database
 * @param pCONumber - the Consolidation Order whoose debts retrieving
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.getCOForMaintainDebtsOnly = function(pCONumber)
{
	if(pCONumber != null && pCONumber != ""){
		// Make call to service to retrieve the CO details
		var params = new ServiceParams();
		params.addSimpleParameter("coNumber", pCONumber.toUpperCase());
		Services.callService("getCoHeader", params, loadData, true);		
	} // end if(pCONumber != null && pCONumber != ""){		
}

/**
 * Resets all the CO data.  Used when clear and Save buttons are selected
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.reSetCO = function()
{	
	// reset the mode
	this.setScreenMode(ManageCOParamsConstants.INITIAL_MODE);
	Services.removeNode(MaintainCOVariables.CO_XPATH);	
	Services.removeNode("/ds/var/app/COFlags");
	// BECAUSE OF STUPID EVENTS BEING FIRED HAD TO CALL IT AGAIN!!!!!
	//Services.removeNode(MaintainCOVariables.CO_XPATH);
	
	MaintainCOFunctions.setCancelMessage(MaintainCOVariables.NO);
	// reset the co number as clearing
	Services.setValue(ManageCOParams.CO_NUMBER, "");
	if(this.isScreenModeReadOnly() == false){	
		// Set the correct tab to be displayed
		Services.setValue(COTabSelector.dataBinding, "TabDebtorAddress");
	}
}

/**
 * Resets all the CO data.  Used when clear and Save buttons are selected
 *@deprecated 08/02/06
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.reSetFlagsAfterSave = function()
{	
	MaintainCOFunctions.setCancelMessage(MaintainCOVariables.NO);
	// set message re save required
	Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.VISITED_MAINTAIN_DEBTS, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_NAME, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_ADDRESS, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EVENT705_IN_FORCE, MaintainCOVariables.NO);	
	Services.setValue(MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EVENT706_CHANGE_TO_REVOKED, MaintainCOVariables.NO);
	Services.removeNode(MaintainCOVariables.TMP_DEBT_SEQ_AMENDED);
	Services.removeNode(MaintainCOVariables.DEBT_SEQ_AMENDED);
	Services.setValue(MaintainCOVariables.EMPLOYMENT_ADDRESS_CHANGED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.ADMIN_COURT_CHANGED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.DISPLAY_CANCEL_MESSAGE, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_RETRIEVED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_EXISTS, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_RETRIEVED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_EXISTS, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.WORKPLACE_HISTORY_RETRIEVED, MaintainCOVariables.NO);
	Services.setValue(MaintainCOVariables.WORKPLACE_HISTORY_EXISTS, MaintainCOVariables.NO);
	
	Services.removeNode(MaintainCOVariables.CREDITOR_HISTORY_RETRIEVED);
	Services.removeNode(MaintainCOVariables.PAYEE_HISTORY_RETRIEVED);
	
	Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);

}

/**
 * is a dividend in progress?
 * @return boolean representing whether payment div in progress
 * @author rzhh8k
 */
MaintainCOFunctions.isPaymentDividendInProgress = function()
{
	var inProg = false
	//  The serverside dooes - Need to check payable_orders and  debt_dividends tables for this consolidated Order, 
	// if any are found that do not have dividends created yet then order_date is read only.
	var paymentInProgress = Services.getValue(MaintainCOVariables.PAYMENT_DIV_IN_PROGRESS);
	if(paymentInProgress != null && paymentInProgress == MaintainCOVariables.YES){
		inProg = true;
	}
	
	return inProg;
	
}

/**
 * Are monies in court and are not yet available for dividend declaration?
 * @return boolean representing whether monies in court
 * @author rzhh8k
 */
MaintainCOFunctions.isMoneyInCourtAndNoDivDeclared = function()
{
	var isMonies = false
	var divCourtMoniesUnavailable = Services.getValue(MaintainCOVariables.DIVIDEND_MONIES_UNAVAILABLE);
	if(divCourtMoniesUnavailable != null && divCourtMoniesUnavailable == MaintainCOVariables.YES){
		isMonies = true;
	}
	
	return isMonies;
	
}

/**
 * Do Overpayment exists which must be resolved.
 * @return boolean representing whether overpayments exist
 * @author rzhh8k
 */
MaintainCOFunctions.isUnresolvedOverpayment = function()
{
	var overPayment = false
	var unresOverPayment = Services.getValue(MaintainCOVariables.UNRESOLVED_OVERPAYMENT);
	if(unresOverPayment != null && unresOverPayment == MaintainCOVariables.YES){
		overPayment = true;
	}
	
	return overPayment;	
}

/**
 * pre payout list already run?
 * @return boolean representing whether LIST ALREADY RUN
 * @author rzhh8k
 */
MaintainCOFunctions.hasPayoutListRan = function()
{
	var ran = false
	var payoutRan = Services.getValue(MaintainCOVariables.PRE_PAYOUTLIST_RUN);
	if(payoutRan != null && payoutRan == MaintainCOVariables.YES){
		ran = true;
	}
	
	return ran;	
}

/**
 * Event 920 exists today? I.e. N94 issued - you cannot create another debtor address today.
 * @return boolean representing whether event exists
 * @author rzhh8k
 */
MaintainCOFunctions.event920ExistsForToday = function()
{
	var exists = false
	var existsToday = Services.getValue(MaintainCOVariables.EVENT920_PRODUCED_TODAY);
	if(existsToday != null && existsToday == MaintainCOVariables.YES){
		exists = true;
	}	
	return exists;	
}

/**
 * Function to determine if the user is returning from the maintain Debts screen
 * @return boolean representing whether user has been maintaining debts
 * @author rzhh8k
 */
MaintainCOFunctions.maintainedDebts = function()
{
	var isMaintDebts = false
	var maintained = Services.getValue(MaintainCOVariables.VISITED_MAINTAIN_DEBTS);
	if(maintained != null && maintained == MaintainCOVariables.YES){
		isMaintDebts = true;
		Services.setValue(MaintainCOVariables.VISITED_MAINTAIN_DEBTS, MaintainCOVariables.NO);
	}	
	return isMaintDebts;	
}

/**
 * Function to copy data from/to the dom
 * @param pCopyToAppFlags boolean - whether copying from ds/mainatinCO to app flags.  Else copy the other way
 * @param pRemoveOrigNode boolean - whether delete appropriate node
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.copyData = function(pCopyToAppFlags, pRemoveOrigNode)
{
	if(pCopyToAppFlags == true){
		var codata = Services.getNode(MaintainCOVariables.CO_XPATH);
		Services.replaceNode(MaintainCOVariables.DATA_STORE + "/MaintainCO", codata);
		if(pRemoveOrigNode == true){
			// now remove the node	
			Services.removeNode(MaintainCOVariables.CO_XPATH);		
		}
		
	}
	else{
		var codata = Services.getNode(MaintainCOVariables.DATA_STORE + "/MaintainCO");
		Services.replaceNode("/ds/MaintainCO", codata);
		if(pRemoveOrigNode == true){
			// now remove the node	
			Services.removeNode(MaintainCOVariables.DATA_STORE + "/MaintainCO");
		}
	}
}

/**
 * Calculates all the CO Totals
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.calculateCOTotals = function()
{
	// calculate total allowed
	// get all the Total Allowed
	var totalAllowed = this.getTotalAmount(	MaintainCOVariables.DEBT_AMOUNT_ALLOWED_XPATH,
											false);//pScheduleTwo
	// set the value
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/AmountAllowed", CaseManUtils.transformAmountToTwoDP(totalAllowed, null));
	
	// total passthroughs
	var totalPassthroughs = this.getTotalPassthroughs(false);//pSchedTwo

	// total schedule 2	 - need for fee calculation - doesn't include fee in total at this moment
	var totalScheduleTwo = this.getTotalAmount(	MaintainCOVariables.DEBT_AMOUNT_ALLOWED_XPATH,
												true);//pScheduleTwo
	
	// Get the total passthroughs for schedule 2 debts, if there are schedule two debts
	// MGG 20/12/06 - ensure passthrough amounts set correctly
	// Total schedule 2 passthroughs
	if(totalScheduleTwo != null && totalScheduleTwo != ""){
		var totalSchedTwoPassthroughs = this.getTotalPassthroughs(true);//pSchedTwo
		// only need extra calculations if schedule two passthroughs exists
		if(null != totalSchedTwoPassthroughs && totalSchedTwoPassthroughs != ""){
			totalScheduleTwo = parseFloat(totalScheduleTwo) - parseFloat(totalSchedTwoPassthroughs);
		}		
	}
	
	// set the value
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/TotalPassthroughs", CaseManUtils.transformAmountToTwoDP(totalPassthroughs, null));
		
	// calculate fees 
	var feeRate = Services.getValue("/ds/MaintainCO/FeeRate");
	this.setFees(	feeRate, //pFeeRate
					totalAllowed,//pTotalAllowed
					totalPassthroughs,//pTotalPassthrough
					totalScheduleTwo);//pTotalSchedule2
	// set total due
	var feeTotal = Services.getValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen"); 
	this.setTotalDue(	totalAllowed,//pTotalAllowed, 
						feeTotal); //pFee						
	
	// now can set the schedule 2 total
	// Legacy includes fees in this total - therefore so do we
	var schedTwoFee = Services.getValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee");
	totalScheduleTwo = parseFloat(totalScheduleTwo) + parseFloat(schedTwoFee);
	// set the value
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/ScheduleTwoTotal", CaseManUtils.transformAmountToTwoDP(totalScheduleTwo, null));
		
	// total paid out
	// this is total dividends - calcluated from the individual debts
	var totalPaidOut = this.getTotal(MaintainCOVariables.DEBT_DIVIDEND_XPATH);
	// set the value
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/TotalPaidOut", CaseManUtils.transformAmountToTwoDP(totalPaidOut, null));
	
	// total fees paid 
	var totalFeesPaid = Services.getValue("/ds/MaintainCO/DebtSummary/TotalFeesPaid");
	if(totalFeesPaid == null || totalFeesPaid == ""){
		// set the value accordingly
		Services.setValue("/ds/MaintainCO/DebtSummary/TotalFeesPaid", "0.00");
	}	
	
	// total outstanding
	this.setTotalOutstanding();
	
	// total monies in court
	var moneyInCourt = Services.getValue("/ds/MaintainCO/DebtSummary/MoniesInCourt");
	if(moneyInCourt == null || moneyInCourt == ""){
		// set the value
		Services.setValue("/ds/MaintainCO/DebtSummary/MoniesInCourt", "0.00");
	}	
		
	// total due from debtor
	this.setTotalDueFromDebtor();
}

/**
 * Returns the total for either the total amount allowed on all debts with a status of LIVE or PAID or the total scedule 2 debts.
 * @param pTotalFor String - the name of the tag to be added from all debts on the CO
 * @param pScheduleTwo boolean - is this for schedule 2?
 * @author rzhh8k
 * @return total  
 */
MaintainCOFunctions.getTotalAmount = function(pTotalFor, pScheduleTwo)
{
	var total = 0.00;
	var id = null;
	var status  = null;
	var tmpValue = null;
	var passthrough = null;
	// get list of debts
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);

	// now loop through each 
	// and if so, is it for the Party we are looking for.
	if(debtIdList != null && debtIdList.length != 0){
		// Loop through the list and ...
		for(var i = 0;i < debtIdList.length; i++){
			id = debtIdList[i].text;
			if(id != null && id != "" && id != 0){
				// need to get the status and type of the debt
				status = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtStatus");
				if(status != null && status != "" ){
					if(status.toUpperCase() == MaintainCOVariables.STATUS_LIVE || status.toUpperCase() == MaintainCOVariables.STATUS_PAID){
								// || status.toUpperCase() == MaintainCOVariables.STATUS_PENDING){
						if(pScheduleTwo == false){
							// need to include this debt in total
							tmpValue = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']" + pTotalFor);
												
							if(tmpValue != null && tmpValue != ""){							
								// add to total
								total = total + parseFloat(tmpValue);
							}
						}// end if(pScheduleTwo == false){
					}
					else if(status.toUpperCase() == MaintainCOVariables.STATUS_SCHEDULE2 && pScheduleTwo == true){
						// need to include this debt in total
						tmpValue = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']" + pTotalFor);												
						if(tmpValue != null && tmpValue != ""){							
							// add to total
							total = total + parseFloat(tmpValue);
						}					
					}// if else
				}// end if(status !== null && stat...
			}// end if(id != null && id !	
		}// end for
	} // end if(debtIdList != null && debtIdList.length != 0){
	return total;
}

/**
 * Function works out if there are any debts with no case numbers.  Used when chnaging type to CAEO
 * as not allowed debts with no case in that scenario
 * @return boolean - true if there is a debt with no case.
 * @author rzhh8k
 */
MaintainCOFunctions.debtWithNoCase = function()
{
	var debtNoCase = false;
	var id = null;
	var caseNumber  = null;

	// get list of debts
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);

	// now loop through each 
	// and if so, is it for the Party we are looking for.
	if(debtIdList != null && debtIdList.length != 0){
		// Loop through the list and ...
		for(var i = 0;i < debtIdList.length; i++){
			id = debtIdList[i].text;
			if(id != null && id != "" && id != 0){
				// need to get the status and type of the debt
				caseNumber = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtCaseNumber");
				if(null == caseNumber || caseNumber == ""){
					debtNoCase = true;
					break;
				}
			}// end if(id != null && id !	
		}// end for
	} // end if(debtIdList != null && debtIdList.length != 0){
	return debtNoCase;
}

/**
 * Sets pending debts to live.  Thsii si done normaly when the Co status becomes live
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setPendingDebtsToLive = function()
{
	var id = null;
	var status  = null;
	// get list of debts
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);

	// now loop through each 
	// and if so, is it for the Party we are looking for.
	if(debtIdList != null && debtIdList.length != 0){
		// Loop through the list and ...
		for(var i = 0;i < debtIdList.length; i++){
			id = debtIdList[i].text;
			if(id != null && id != "" && id != 0){
				// need to get the status
				status = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtStatus");
				if(status != null && status != "" ){
					if(status.toUpperCase() == MaintainCOVariables.STATUS_PENDING){
						Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtStatus", MaintainCOVariables.STATUS_LIVE);						
					}// end if(status.toUpperCase() == MaintainCOVariables....
				}// if(status != null && status != "" ){
			}// if(id != null && id !
		}//for	
	}//if(debtIdList != null && debtIdList.length != 0){
}

/**
 * Sets the total due.
 * The formula for the total due is total allowed + total fee amount.
 * @param pTotalAllowed String - the total allowed for all debts on the CO
 * @param pFee - the fee - not including schedule fees
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setTotalDue = function(pTotalAllowed, pFee)
{
	// set the fee amount if total due has an entry
	if(pTotalAllowed != null && pTotalAllowed != "" && parseFloat(pTotalAllowed) != 0){			
		if(null == pFee){
			pFee = "0.00";		
		}
		
		// set total due
		// defect caseman 6474 - ensure 2dp
		var due = parseFloat(pTotalAllowed) + parseFloat(pFee);
		var totalDue = due.toFixed(2);
		Services.setValue("/ds/MaintainCO/DebtSummary/TotalDue", CaseManUtils.transformAmountToTwoDP(totalDue, null));
		
	}// end if(pTotalAllowed != null && pTotalAllowed != "" && pTotalAllowed
	else{
		// no total allowed so must be 0 total due and no fee
		Services.setValue("/ds/MaintainCO/DebtSummary/TotalDue", "0.00");
	}
}

/**
 * sets the fees for allowed and schedule2 debts
 * @param pFeeRate
 * @param pTotalAllowed
 * @param pTotalPassthrough
 * @param pTotalSchedule2
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setFees = function(pFeeRate, pTotalAllowed, pTotalPassthrough, pTotalSchedule2)
{
	var totalFee = null;
	var individualTotal = null;
	var schedTwoFee = null;
	
	// set the fee amount if total due has an entry
	if(pTotalAllowed != null && parseFloat(pTotalAllowed) != 0 && pFeeRate != null && pFeeRate != 0){
		// ensure values are floats
		var feeRate = parseFloat(pFeeRate);
		var totalAllowed = parseFloat(pTotalAllowed);

		// set total fee
		var tmpTotal = null;
		// ensure the values are numbers
		if(pTotalPassthrough != null && pTotalPassthrough != 0){
			tmpTotal = totalAllowed - parseFloat(pTotalPassthrough);
		}
		else{
			tmpTotal = totalAllowed;
		}
		var tmpFeeAmount = Math.ceil(tmpTotal)/100 * feeRate;
		
		
		var grandTotal = null; // the total of allowed and schedule 2 debts
		if(pTotalSchedule2 != null && pTotalSchedule2 != "" && parseFloat(pTotalSchedule2) != 0.00){
			// calculate and set the rates
			schedTwoFee = Math.ceil(parseFloat(pTotalSchedule2))/100 * feeRate;
			grandTotal = parseFloat(tmpTotal) + parseFloat(pTotalSchedule2);			
		}
		
		if(schedTwoFee != null){
			totalFee = Math.ceil(grandTotal)/100 * feeRate;
			individualTotal = schedTwoFee + tmpFeeAmount;
			// Values need to be to 2 dp. 
			var individualTotalToTwoDP = individualTotal.toFixed(2);
			var totalFeeToTwoDP = totalFee.toFixed(2);			
			//if(individualTotal > totalFee){
			if(individualTotalToTwoDP > totalFeeToTwoDP){
				// need to reduce fee by .05p.  This is due to rounding errors
				schedTwoFee = schedTwoFee - 0.05;
				tmpFeeAmount = tmpFeeAmount - 0.05;
			}
		}
		else{
			schedTwoFee = 0.00;
		}
		
		var fee = tmpFeeAmount.toFixed(2);
		var schedFee = schedTwoFee.toFixed(2);
		// defect caseman 6474 - ensure 2dp
		Services.setValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen", CaseManUtils.transformAmountToTwoDP(fee, null));
		Services.setValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee", CaseManUtils.transformAmountToTwoDP(schedFee, null));
		
	}// end if(pTotalAllowed != null && pTotalAllowed != "" && pTotalAllowed
	else if(pTotalSchedule2 != null && parseFloat(pTotalSchedule2) != 0.00 && pFeeRate != null && pFeeRate != 0){
		// ensure values are floats
		var feeRate2 = parseFloat(pFeeRate);
		var totalSched2 = parseFloat(pTotalSchedule2);
		// calculate and set the rates - only need to worry about schedule 2 as no other
		var schedTwoFeeOnly = Math.ceil(totalSched2)/100 * feeRate2;
				
		var schedFeeOnly = schedTwoFeeOnly.toFixed(2);
		Services.setValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen", "0.00");
		// defect caseman 6474 - ensure 2dp
		Services.setValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee", CaseManUtils.transformAmountToTwoDP(schedTwoFeeOnly, null));
	}
	if(pFeeRate == null || pFeeRate == ""){
		// no fee allowed so must be 0 total fee
		Services.setValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen", "0.00");
		Services.setValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee", "0.00");

	}
	// ensure value restet if any totals are empty
	if(pTotalAllowed == null || pTotalAllowed == "" || parseFloat(pTotalAllowed) == 0.00){
		Services.setValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen", "0.00");		
	}
	if(pTotalSchedule2 == null || pTotalSchedule2 == "" || parseFloat(pTotalSchedule2) == 0.00){
		Services.setValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee", "0.00");
	}
}

/**
 * Defect 3275 - The database field for fees needs to contain fees for all debt (except deleted).
 * Adds the fees for allowed and schedule2 debts - as save in same database field but display seperatley
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setTotalFeesForSave = function()
{
	var coFee = Services.getValue("/ds/MaintainCO/DebtSummary/FeeAmountForScreen");
 	var sched2Fee = Services.getValue("/ds/MaintainCO/DebtSummary/ScheduleTwoFee");

 	if(null == coFee || coFee == ""){
 		coFee = "0.00"
 	}
 	if(null == sched2Fee || sched2Fee == ""){
 		sched2Fee = "0.00"
 	}
 	
 	// now add together
	var totalFee = parseFloat(coFee) + parseFloat(sched2Fee);
	
	// total to save to database
	Services.setValue("/ds/MaintainCO/DebtSummary/FeeAmount", totalFee);
}
/**
 * Returns the total for the provided field.  E.g. calculates the total of all the Total Allowed on the debts.
 * @param pTotalFor String - the xpath of the tag to be added from all debts on the CO
 * @author rzhh8k
 * @return totalValue  
 */
MaintainCOFunctions.getTotal = function(pTotalFor)
{
	var totalValue = 0.00;
		
	// get list of debts
	var debtList = Services.getNodes(pTotalFor);

	// now loop through each 
	if(debtList != null && debtList.length != 0){
		// Loop through the list and ...
		for(var i = 0;i < debtList.length; i++){
			var value = debtList[i].text;
			if(value != null && value != "" && value!= 0){
				totalValue = totalValue + parseFloat(value);
			}
		}			
	}
	return totalValue;
}

/**
 * Returns the total passthroughs for schedule two debts.
 * pSchedTwo boolean representing wHether retrieving for schedule2 debts
 * @author rzhh8k
 * @return totalValue 
 */
MaintainCOFunctions.getTotalPassthroughs = function(pSchedTwo)
{
	var totalValue = 0.00;

	// get list of debt ids
	var debtSurrIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);
	// now loop through each 
	if(debtSurrIdList != null && debtSurrIdList.length != 0){
		var debtSeqId = "";
		var debtStatus = null;
		var passthrough = null;
		for(var i = 0;i < debtSurrIdList.length; i++){
			debtSurrId = debtSurrIdList[i].text;
			if(debtSurrId != null && debtSurrId != ""){
				// see if status is schedule 2 and then if there are any passthroughs.
				debtStatus = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + debtSurrId + "']/DebtStatus");
				passthrough = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + debtSurrId + "']/Passthroughs");
				if(debtStatus != null && debtStatus == MaintainCOVariables.STATUS_SCHEDULE2 && pSchedTwo == true){
					if(passthrough != null && passthrough != "" && passthrough != 0){
						totalValue = totalValue + parseFloat(passthrough);
					}
				}
				else if(debtStatus != null && pSchedTwo == false){
					if(debtStatus == MaintainCOVariables.STATUS_LIVE || debtStatus == MaintainCOVariables.STATUS_PAID){
						if(passthrough != null && passthrough != "" && passthrough != 0){
							totalValue = totalValue + parseFloat(passthrough);
						}
					}
				}//if/else(debtStatus = null && debtStatus == MaintainCOVariables.STATUS_SCHEDULE2){
			}//if(debtSurrId != null && debtSurrId != ""){
		} //for(var i = 0;i < debtSurrIdList.length; i++){
	}//if(debtSurrIdList != null && debtSurrIdList.length != 0){
	
	return totalValue;
}

/**
 * sets the total outstanding
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setTotalOutstanding = function()
{
	var totalDue = Services.getValue("/ds/MaintainCO/DebtSummary/TotalDue");
	var totalPaidOut = Services.getValue("/ds/MaintainCO/DebtSummary/TotalPaidOut");
	var totalFeesPaid = Services.getValue("/ds/MaintainCO/DebtSummary/TotalFeesPaid");
	var totalPassthroughs = Services.getValue("/ds/MaintainCO/DebtSummary/TotalPassthroughs");
	if(totalDue == null || totalDue == ""){
		totalDue = "0.00";
	}
	if(totalPaidOut == null || totalPaidOut == ""){
		totalPaidOut = "0.00";
	}
	if(totalFeesPaid == null || totalFeesPaid == ""){
		totalFeesPaid = "0.00";
	}
	if(totalPassthroughs == null || totalPassthroughs == ""){
		totalPassthroughs = "0.00";
	}
	
	var totalToSubtract = parseFloat(totalPaidOut) + parseFloat(totalFeesPaid)+ parseFloat(totalPassthroughs);
	var totalOutstanding = parseFloat(totalDue) - totalToSubtract;
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/TotalOutstanding", CaseManUtils.transformAmountToTwoDP(totalOutstanding, null));

}

/**
 * sets the total due from the debtor
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setTotalDueFromDebtor = function()
{
	var totalOutstanding = Services.getValue("/ds/MaintainCO/DebtSummary/TotalOutstanding");
	var totalScheduleTwo = Services.getValue("/ds/MaintainCO/DebtSummary/ScheduleTwoTotal");
	var moneyInCourt = Services.getValue("/ds/MaintainCO/DebtSummary/MoniesInCourt");

	if(totalOutstanding == null || totalOutstanding == ""){
		totalOutstanding = "0.00";
	}
	if(totalScheduleTwo == null || totalScheduleTwo == ""){
		totalScheduleTwo = "0.00";
	}
	if(moneyInCourt == null || moneyInCourt == ""){
		moneyInCourt = "0.00";
	}
	
	var subTotal = parseFloat(totalOutstanding) + parseFloat(totalScheduleTwo);
	var totalDueFromDebtor = subTotal - parseFloat(moneyInCourt);
	// defect caseman 6474 - ensure 2dp
	Services.setValue("/ds/MaintainCO/DebtSummary/BalanceDueFromDebtor", CaseManUtils.transformAmountToTwoDP(totalDueFromDebtor, null));

}


/**
 * Has a valid Case Number been entered. I.e. Should creditor/payee details be read only in either add or maintain debt.
 * Also should the user be forced to add a debtor to the debt - add debt only.
 * @param pAddDebt boolean re whether adding a  debt or not
 * @return boolean re whether valid case.
 * @author rzhh8k
 */
MaintainCOFunctions.validCaseNoEntered = function(pAddDebt)
{
	var caseValid = false;
	
	if(pAddDebt == true){
		var caseEntered = Services.getValue(MaintainCOVariables.VALID_CASE);
		if(caseEntered != null && caseEntered == MaintainCOVariables.YES){
			caseValid = true;
		}	
	}
	else{
		var caseNumber = Services.getValue(MaintainDebt_CaseNumber.dataBinding);
		if(caseNumber != null && caseNumber != ""){
			caseValid = true;
		}
	}	
	
	return caseValid;
}

/**
 * Functions determines if releasbale payments exist.
 * @return boolean re whether payments exists
 * @author rzhh8k
 */
MaintainCOFunctions.releasablePaymentsExist = function()
{
	var relPaymentsExist = false;
	var moneyInCourt = Services.getValue("/ds/MaintainCO/DebtSummary/MoniesInCourt");
	var releasableFlag = Services.getValue("/ds/MaintainCO/ReleasableMoniesInCourt");
	if(null != moneyInCourt && moneyInCourt != "" && parseFloat(moneyInCourt) > 0){	
		if(releasableFlag != null && releasableFlag == MaintainCOVariables.YES){
			relPaymentsExist = true;
		}
	}
	return relPaymentsExist;
}

/**
 * Functions determines if non releasbale payments exist.
 * Only returns true if there are no releasable monies in court and monies in court exist
 * @return boolean re whether payments exists
 * @author rzhh8k
 */
MaintainCOFunctions.nonReleasablePaymentsExist = function()
{
	var nonRelPaymentsExist = false;
	var moneyInCourt = Services.getValue("/ds/MaintainCO/DebtSummary/MoniesInCourt");
	var releasableFlag = Services.getValue("/ds/MaintainCO/ReleasableMoniesInCourt");
	if(null != moneyInCourt && moneyInCourt != "" && parseFloat(moneyInCourt) > 0){	
		if(releasableFlag != null && releasableFlag == MaintainCOVariables.NO){
			nonRelPaymentsExist = true;
		}
	}
	return nonRelPaymentsExist;
}

/**
 * Functions determines if take given amount from the co total will it be negative?
 * @return boolean re whether -ve or not - true if -ve, false if +ve
 * @param pAmountToReduce
 * @author rzhh8k
 */
MaintainCOFunctions.makeCONegative = function(pAmountToReduce)
{
	var negative = false;
	
	if(pAmountToReduce != null && pAmountToReduce != "" && parseFloat(pAmountToReduce) > 0){
		// need to recalc totals as might have added more than one since last update.
		this.calculateCOTotals();
		var totalDue = Services.getValue("/ds/MaintainCO/DebtSummary/BalanceDueFromDebtor");
		if(totalDue == null || totalDue == ""){
			totalDue == "0.00";	
		}
		var newTotalWillBe = parseFloat(totalDue);
		if(newTotalWillBe < 0){
			negative = true;
		}
	}	

	return negative;	
}

/**
 * Functions determines if maintain debt is valid - does this by ensuring the debt grid is valid
 * @return true if valid or false if not
 * @author rzhh8k
 */
MaintainCOFunctions.isValidMaintainDebt = function()
{
	var isValid = false;

	var gridAdaptor = Services.getAdaptorById("MaintainDebt_DebtGrid");
	var aggState = gridAdaptor.getAggregateState();
	var sub = aggState.isSubmissible();
	
	if(sub == true){
		isValid = true;
	}
	
	return isValid;	
}


/**
 * Functions determines if new debt is valid
 * @return null if valid or a component if not (the adaptor that is invalid)
 * @deprecated 06/12/05.  No longer required - now subform vaidation
 * @author rzhh8k
 */
MaintainCOFunctions.isValidAddDebt = function()
{
	var adaptor = null;

	// get Adaptors
	 var amountAllowed = Services.getAdaptorById("AddDebt_AmountAllowed");
	 var caseNumber = Services.getAdaptorById("AddDebt_CaseNumber");
	 var party = Services.getAdaptorById("AddDebt_CaseParty");
	 var courtcode = Services.getAdaptorById("AddDebt_CourtCode");
	 var status = Services.getAdaptorById("AddDebt_Status");
	 var creditorCode = Services.getAdaptorById("AddDebt_CreditorCode");
	 var creditorName = Services.getAdaptorById("AddDebt_CreditorName");
	 var creditorAdd1 = Services.getAdaptorById("AddDebt_Creditor_Address_Line1");
	 var creditorAdd2 = Services.getAdaptorById("AddDebt_Creditor_Address_Line2");
	 var credEmail = Services.getAdaptorById("AddDebt_Creditor_Address_Email");
	 var credPostcode = Services.getAdaptorById("AddDebt_Creditor_Address_Postcode");
	 var payeeCode = Services.getAdaptorById("AddDebt_PayeeCode");
	 var payeeName = Services.getAdaptorById("AddDebt_PayeeName");
	 var payeeAdd1 = Services.getAdaptorById("AddDebt_Payee_Address_Line1");
	 var payeeAdd2 = Services.getAdaptorById("AddDebt_Payee_Address_Line2");
	 var payEmail = Services.getAdaptorById("AddDebt_Payee_Address_Email");
	 var payPostcode = Services.getAdaptorById("AddDebt_Payee_Address_Postcode");
	 
	 if(amountAllowed.getMandatory() || !amountAllowed.getValid()){
	 	adaptor = amountAllowed;
	 }
	 else if(caseNumber.getMandatory() || !caseNumber.getValid()){
	 	adaptor = caseNumber;
	 }
	 else if(party.getMandatory()){
	 	adaptor = party;
	 }
	 else if(courtcode.getMandatory() || !courtcode.getValid()){
	 	adaptor = courtcode;
	 }
	 else if(status.getMandatory() || !status.getValid()){
	 	adaptor = status;
	 }
	 else if(!creditorCode.getValid()){
	 	adaptor = creditorCode;
	 }	 
	 else if(creditorName.getMandatory()){
	 	adaptor = creditorName;
	 }
	 else if(creditorAdd1.getMandatory()){
	 	adaptor = creditorAdd1;
	 }
	 else if(creditorAdd2.getMandatory()){
	 	adaptor = creditorAdd2;
	 }
	 else if(!credEmail.getValid()){
	 	adaptor = credEmail;
	 }
	 else if(!credPostcode.getValid()){
	 	adaptor = credPostcode;
	 }
	 else if(!payeeCode.getValid()){
	 	adaptor = payeeCode;
	 }
	 else if(payeeName.getMandatory()){
	 	adaptor = payeeName;
	 }
	 else if(payeeAdd1.getMandatory()){
	 	adaptor = payeeAdd1;
	 }
	 else if(payeeAdd2.getMandatory()){
	 	adaptor = payeeAdd2;
	 }
	 else if(!payEmail.getValid()){
	 	adaptor = payEmail;
	 }
	 else if(!payPostcode.getValid()){
	 	adaptor = payPostcode;
	 }
	
	return adaptor;
}

/**
 * This function adds the new validated Debt to the DOM
 * @param pSurrogateID. The new Judgment ID.
 * @param pSurrogateIdCreditorAddress. 
 * @param pSurrogateIdPayeeAddress+	. Can be empty
 * @deprecated 06/12/05.  No longer required as handles in sub form
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addNewDebt = function(pSurrogateID, pSurrogateIdCreditorAddress, pSurrogateIdPayeeAddress)
{	
	var root = "/Debt";
	var defaultCurrency = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	var today = this.getTodaysDate();
	var caseNumber = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtCaseNumber")
	if(null == caseNumber){
		caseNumber = "";
	}
	// Set new part of DOM
	var newDebt = Services.loadDOMFromURL("NewDebt.xml");
	
	// Set up data in  New  DOM from the Tmp binding part of DOM	
	newDebt.selectSingleNode(root + "/DebtSurrogateId").appendChild(
		newDebt.createTextNode(pSurrogateID));
	newDebt.selectSingleNode(root + "/DebtAmountAllowed").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtAmountAllowed"))));
	newDebt.selectSingleNode(root + "/DebtAmountAllowedCurrency").appendChild(
		newDebt.createTextNode(defaultCurrency));
	newDebt.selectSingleNode(root + "/DebtAmountOriginal").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtAmountAllowed"))));
	newDebt.selectSingleNode(root + "/DebtAmountOriginalCurrency").appendChild(
		newDebt.createTextNode(defaultCurrency));				
	newDebt.selectSingleNode(root + "/DebtStatus").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Status"))));
	newDebt.selectSingleNode(root + "/Passthroughs").appendChild(
		newDebt.createTextNode("0.00"));
	newDebt.selectSingleNode(root + "/PassthroughsCurrency").appendChild(
		newDebt.createTextNode(defaultCurrency));	
	newDebt.selectSingleNode(root + "/Dividends").appendChild(
		newDebt.createTextNode("0.00"));
	newDebt.selectSingleNode(root + "/DividendsCurrency").appendChild(
		newDebt.createTextNode(defaultCurrency));
	newDebt.selectSingleNode(root + "/Balance").appendChild(
		newDebt.createTextNode("0.00"));
	newDebt.selectSingleNode(root + "/BalanceCurrency").appendChild(
		newDebt.createTextNode(defaultCurrency));	
	newDebt.selectSingleNode(root + "/DebtCaseNumber").appendChild(
		newDebt.createTextNode(caseNumber));
	newDebt.selectSingleNode(root + "/PartyRoleCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/PartyRoleCode"))));
	newDebt.selectSingleNode(root + "/CasePartyNumber").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/CasePartyNumber"))));
	newDebt.selectSingleNode(root + "/PartyKey").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/PartyKey"))));	
	newDebt.selectSingleNode(root + "/DebtAdminCourtCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtAdminCourtCode"))));	
	newDebt.selectSingleNode(root + "/DebtAdminCourtName").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtAdminCourtName"))));	
	newDebt.selectSingleNode(root + "/CasemanDebt").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/CasemanDebt"))));	
	newDebt.selectSingleNode(root + "/Creditor/Name").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Name"))));	
	
	// need to bring accross what was there for server side
	var partyId = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/PartyId");
	if(null == partyId){
		partyId = "";
	}
	newDebt.selectSingleNode(root + "/Creditor/PartyId").appendChild(
		newDebt.createTextNode(partyId));
		
	newDebt.selectSingleNode(root + "/Creditor/CPCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/CPCode"))));	
	newDebt.selectSingleNode(root + "/Creditor/DX").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/DX"))));	
	newDebt.selectSingleNode(root + "/Creditor/TelNo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/TelNo"))));	
	newDebt.selectSingleNode(root + "/Creditor/Email").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Email"))));	
	newDebt.selectSingleNode(root + "/Creditor/FaxNo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/FaxNo"))));
	newDebt.selectSingleNode(root + "/Creditor/CommMethod").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/CommMethod"))));	
	var transWelsh = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/TranslationToWelsh")
	if(null == transWelsh || transWelsh ==""){
		transWelsh = "N";
	}
	newDebt.selectSingleNode(root + "/Creditor/TranslationToWelsh").appendChild(
		newDebt.createTextNode(transWelsh));	
	newDebt.selectSingleNode(root + "/Creditor/Reference").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Reference"))));	

	var addStatus = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Status");
	var credCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/CPCode");
	if(null == addStatus || addStatus == ""){
		if(null == credCode || credCode == ""){
			addStatus = MaintainCOVariables.STATUS_FLAG_NEW;;
		}
		else{
			addStatus = MaintainCOVariables.STATUS_FLAG_EXISTING;;
		}
		
	}
	newDebt.selectSingleNode(root + "/Creditor/Address/Status").appendChild(
		newDebt.createTextNode(addStatus));
	
	newDebt.selectSingleNode(root + "/Creditor/Address/AddressSurrogateId").appendChild(
		newDebt.createTextNode(pSurrogateIdCreditorAddress));	
	newDebt.selectSingleNode(root + "/Creditor/Address/AddressId").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/AddressId"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/AddressTypeCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/AddressTypeCode"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/Line[1]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Line[1]"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/Line[2]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Line[2]"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/Line[3]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Line[3]"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/Line[4]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Line[4]"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/Line[5]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Line[5]"))));	
	newDebt.selectSingleNode(root + "/Creditor/Address/PostCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/PostCode"))));	
	
	// if brought the address in copy, if not need to set correctly
	var createdBy = null;
	var validFrom = null;
	var validCase = this.validCaseNoEntered(true);//pAddDebt
	var credCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/CPCode");
	if((validCase != null && validCase == MaintainCOVariables.YES) || (credCode != null && credCode != "")){
		createdBy = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/CreatedBy");
		validFrom = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/ValidFrom");
	}
	else{
		createdBy = Services.getCurrentUser();
		validFrom = today;
	}	
	newDebt.selectSingleNode(root + "/Creditor/Address/CreatedBy").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(createdBy)));	
	newDebt.selectSingleNode(root + "/Creditor/Address/ValidFrom").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(validFrom)));	
	newDebt.selectSingleNode(root + "/Creditor/Address/ValidTo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/ValidTo"))));	
	
	newDebt.selectSingleNode(root + "/Payee/Name").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Name"))));	
	
	// need to bring accross what was there for server side
	var partyId = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/PartyId");
	if(null == partyId){
		partyId = "";
	}
	newDebt.selectSingleNode(root + "/Payee/PartyId").appendChild(
		newDebt.createTextNode(partyId));
		
	newDebt.selectSingleNode(root + "/Payee/CPCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/CPCode"))));	
	newDebt.selectSingleNode(root + "/Payee/DX").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/DX"))));	
	newDebt.selectSingleNode(root + "/Payee/TelNo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/TelNo"))));	
	newDebt.selectSingleNode(root + "/Payee/Email").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Email"))));
	newDebt.selectSingleNode(root + "/Payee/FaxNo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/FaxNo"))));	
	newDebt.selectSingleNode(root + "/Payee/CommMethod").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/CommMethod"))));	
	
	transWelsh = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/TranslationToWelsh")
	if(null == transWelsh || transWelsh ==""){
		transWelsh = "N";
	}
	newDebt.selectSingleNode(root + "/Payee/TranslationToWelsh").appendChild(
		newDebt.createTextNode(transWelsh));	
	newDebt.selectSingleNode(root + "/Payee/Reference").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Reference"))));	

	addStatus = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Status");
	var payCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/CPCode");
	if(null == addStatus || addStatus == ""){
		if(null == payCode || payCode == ""){
			addStatus = MaintainCOVariables.STATUS_FLAG_NEW;;
		}
		else{
			addStatus = MaintainCOVariables.STATUS_FLAG_EXISTING;;
		}
		
	}
	newDebt.selectSingleNode(root + "/Payee/Address/Status").appendChild(
		newDebt.createTextNode(addStatus));
	
	newDebt.selectSingleNode(root + "/Payee/Address/AddressSurrogateId").appendChild(
		newDebt.createTextNode(pSurrogateIdPayeeAddress));	
	newDebt.selectSingleNode(root + "/Payee/Address/AddressId").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/AddressId"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/AddressTypeCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/AddressTypeCode"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/Line[1]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Line[1]"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/Line[2]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Line[2]"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/Line[3]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Line[3]"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/Line[4]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Line[4]"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/Line[5]").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Line[5]"))));	
	newDebt.selectSingleNode(root + "/Payee/Address/PostCode").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/PostCode"))));	
	
	// if brought the address in copy, if not need to set correctly
	createdBy = null;
	validFrom = null;
	var payeeCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/CPCode");
	if((validCase != null && validCase == MaintainCOVariables.YES) || (payeeCode != null && payeeCode != "")){
		createdBy = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/CreatedBy");
		validFrom = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/ValidFrom");
	}
	else{
		createdBy = Services.getCurrentUser();
		validFrom = today;
	}	
	newDebt.selectSingleNode(root + "/Payee/Address/CreatedBy").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(createdBy)));	
	newDebt.selectSingleNode(root + "/Payee/Address/ValidFrom").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(validFrom)));	
	newDebt.selectSingleNode(root + "/Payee/Address/ValidTo").appendChild(
		newDebt.createTextNode(CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/ValidTo"))));	
	
	var payeeIndicator = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtPayeeIndicator")
	if(null == payeeIndicator || payeeIndicator ==""){
		payeeIndicator = "N";
	}	
	newDebt.selectSingleNode(root + "/DebtPayeeIndicator").appendChild(
		newDebt.createTextNode(payeeIndicator));
	
	// Check if require a event 705 to be fired?
	// Do this if a case number has been entered
	if(caseNumber != ""){
		Services.setValue(MaintainCOVariables.EVENT705_IN_FORCE, MaintainCOVariables.YES);
	}	
	
	// Add the entire Debt branch to the Debts node
	var debtNode = "/ds/MaintainCO/Debts";
	Services.addNode(newDebt, debtNode);
	
	// Clear out the temp data
	this.resetNewDebt();
	
	// Force the master grid to select the newly added Judgment
	Services.setValue(MaintainDebt_DebtGrid.dataBinding, pSurrogateID);
}


/**
 * Function used to add debt creditor or payee details
 * @param pCredAddSurrID
 * @param pPayeeAddSurrID
 * @param pLocalCourt boolean representing whether a local court case. If this is false, any local coded parties are copied in as new addresses
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addCreditorAndPayeeDetailTabFields = function(pCredAddSurrID, pPayeeAddSurrID, pLocalCourt)
{
	var today = this.getTodaysDate();
	// get creditor details from dom
	var credName = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Name"));	
	var credCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/CPCode"));
	var credPartyId = "";
	if(credCode != null && credCode != "" && pLocalCourt == true){
		// coded party selected so need the party id ( as long as it is local to this court).
		credPartyId = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/PartyId"));
	}	
	var credDx = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/DX"));
	var credTelNo = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/TelNo"));
	var credFaxNo = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/FaxNo"));
	var credEmail = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Email"));
	var credCommMethod = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/CommMethod"));
	var credTransToWelsh = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/TranslationToWelsh"));
	if(credTransToWelsh == null || credTransToWelsh == ""){
		credTransToWelsh = "N";		
	}
	var credRef = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Reference"));
	var credAddId = "";
	var credAddSurrId = pCredAddSurrID;
	if(credCode != null && credCode != "" && pLocalCourt == true){
		credAddId = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/AddressId"));
		credAddSurrId = credAddId;
	}
	var credAdd1 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/Line[1]"));
	var credAdd2 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/Line[2]"));
	var credAdd3 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/Line[3]"));
	var credAdd4 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/Line[4]"));
	var credAdd5 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/Line[5]"));
	var credPostCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/PostCode"));
	var credAddTypeCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/AddressTypeCode"));
	var credCreatedBy = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/CreatedBy"));
	var credValidFrom = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Creditor/Address/ValidFrom"));
	if(credValidFrom == null || credValidFrom == ""){
		credValidFrom = today;
	}
	var credValidTo = "";	
	
	var payeeName = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Name"));	
	var payeeCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/CPCode"));
	var payeePartyId = "";
	if(payeeCode != null && payeeCode != "" && pLocalCourt == true){
		// coded party selected so need the party id ( as long as it is local to this court).
		payeePartyId = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/PartyId"));
	}	
	var payeeDx = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/DX"));
	var payeeTelNo = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/TelNo"));
	var payeeFaxNo = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/FaxNo"));
	var payeeEmail = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Email"));
	var payeeCommMethod = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/CommMethod"));
	var payeeTransToWelsh = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/TranslationToWelsh"));
	if(payeeTransToWelsh == null || payeeTransToWelsh == ""){
		payeeTransToWelsh = "N";
	}
	
	var payeeRef = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Reference"));
	var payeeAddId = "";
	var payeeAddSurrId = pPayeeAddSurrID;
	if(payeeCode != null && payeeCode != "" && pLocalCourt == true){
		payeeAddId = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/AddressId"));
		payeeAddSurrId = payeeAddId;
	}
	var payeeAdd1 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/Line[1]"));
	var payeeAdd2 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/Line[2]"));
	var payeeAdd3 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/Line[3]"));
	var payeeAdd4 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/Line[4]"));
	var payeeAdd5 = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/Line[5]"));
	var payeePostCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/PostCode"));
	var payeeAddTypeCode = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/AddressTypeCode"));
	var payeeCreatedBy = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/CreatedBy"));
	var payeeValidFrom = CaseManUtils.getValidNodeValue(Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/Payee/Address/ValidFrom"));
	if(payeeAdd1 != null && payeeAdd1 != ""){
		if(payeeValidFrom == null || payeeValidFrom == ""){
			payeeValidFrom = today;
		}
	}
	var payeeValidTo = "";
	var isPayee = MaintainCOVariables.NO;
	if(payeeAdd1 != null && payeeAdd1 != ""){
		isPayee = MaintainCOVariables.YES;
	}
	
	// if not a local court cannot have local coded parties - therefore remove the code
	if(pLocalCourt == false){
		credCode = "";
		payeeCode = "";
	}
	
	Services.setValue(AddDebt_CreditorCode.dataBinding, credCode);
	Services.setValue(AddDebt_CreditorName.dataBinding, credName);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/PartyId", credPartyId);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/AddressSurrogateId", credAddSurrId);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/AddressId", credAddId);
	Services.setValue(AddDebt_Creditor_Address_Line1.dataBinding, credAdd1);
	Services.setValue(AddDebt_Creditor_Address_Line2.dataBinding, credAdd2);
	Services.setValue(AddDebt_Creditor_Address_Line3.dataBinding, credAdd3);
	Services.setValue(AddDebt_Creditor_Address_Line4.dataBinding, credAdd4);
	Services.setValue(AddDebt_Creditor_Address_Line5.dataBinding, credAdd5);
	Services.setValue(AddDebt_Creditor_Address_Postcode.dataBinding, credPostCode);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/AddressTypeCode", credAddTypeCode);
	Services.setValue(AddDebt_Creditor_Address_DXNo.dataBinding, credDx);
	Services.setValue(AddDebt_Creditor_Address_TelNo.dataBinding, credTelNo);
	Services.setValue(AddDebt_Creditor_Address_FaxNo.dataBinding,credFaxNo);
	Services.setValue(AddDebt_Creditor_Address_Email.dataBinding, credEmail);
	Services.setValue(AddDebt_Creditor_Address_CommMethod.dataBinding, credCommMethod);
	Services.setValue(AddDebt_Creditor_Address_Welsh.dataBinding, credTransToWelsh);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/CreatedBy", credCreatedBy);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/ValidFrom", credValidFrom);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/ValidTo", credValidTo);
	Services.setValue(AddDebt_CreditorReference.dataBinding, credRef);
	
	Services.setValue(AddDebt_PayeeCode.dataBinding, payeeCode);
	Services.setValue(AddDebt_PayeeName.dataBinding, payeeName);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/PartyId", payeePartyId);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/AddressSurrogateId", payeeAddSurrId);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/AddressId", payeeAddId);
	Services.setValue(AddDebt_Payee_Address_Line1.dataBinding, payeeAdd1);
	Services.setValue(AddDebt_Payee_Address_Line2.dataBinding, payeeAdd2);
	Services.setValue(AddDebt_Payee_Address_Line3.dataBinding, payeeAdd3);
	Services.setValue(AddDebt_Payee_Address_Line4.dataBinding, payeeAdd4);
	Services.setValue(AddDebt_Payee_Address_Line5.dataBinding, payeeAdd5);
	Services.setValue(AddDebt_Payee_Address_Postcode.dataBinding, payeePostCode);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/AddressTypeCode", payeeAddTypeCode);
	Services.setValue(AddDebt_Payee_Address_DXNo.dataBinding, payeeDx);
	Services.setValue(AddDebt_Payee_Address_TelNo.dataBinding, payeeTelNo);
	Services.setValue(AddDebt_Payee_Address_FaxNo.dataBinding, payeeFaxNo);
	Services.setValue(AddDebt_Payee_Address_Email.dataBinding, payeeEmail);
	Services.setValue(AddDebt_Payee_Address_CommMethod.dataBinding, payeeCommMethod);
	Services.setValue(AddDebt_Payee_Address_Welsh.dataBinding, payeeTransToWelsh);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/CreatedBy", payeeCreatedBy);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/ValidFrom", payeeValidFrom);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/ValidTo", payeeValidTo);
	Services.setValue(AddDebt_Payee.dataBinding, isPayee);
	Services.setValue(AddDebt_PayeeReference.dataBinding, payeeRef);
}

/**
 * Function used to clear add debt creditor or payee details
 * @param pTabToClear the tab we are resetting
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.clearAddDebtTab = function(pTabToClear)
{
	if(pTabToClear != null && pTabToClear != ""){
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Name", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/PartyId", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/CPCode", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/DX", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/TelNo", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/FaxNo", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Email", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/CommMethod", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/TranslationToWelsh", "N");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Reference", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Status", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/AddressId", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/AddressSurrogateId", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Line[1]", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Line[2]", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Line[3]", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Line[4]", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/Line[5]", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/PostCode", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/CreatedBy", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/ValidFrom", "");
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + pTabToClear + "/Address/ValidTo", "");
	}
}

/**
 * This function sets any new events in the correct path for the services
 * @param pEvent - the event id
 * @param pDebtId - the event id
 * @param pEventDetails - added as part of defect uct 618. String containing text to place in Event Detail tag
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setCOEvent = function(pEvent, pDebtId, pEventDetails)
{	
	var today = this.getTodaysDate();
	var user = Services.getCurrentUser();
	// defect 3920. no longer required var appDate = Services.getValue(CODetails_AppDate.dataBinding);
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	var debtId = "";
	if(pDebtId != null){
		debtId = pDebtId;
	}
	
	// uct 618
	if(pEventDetails == null){
		pEventDetails = "";
	}
	
	// Get values from DOM   
	var root = "/COEvent";
	// Set new part of DOM
	var tmpEvent = Services.loadDOMFromURL("NewEvent.xml");
	
	// Set up data in the Tmp part of DOM
	tmpEvent.selectSingleNode(root + "/CONumber").appendChild(
		tmpEvent.createTextNode(coNumber));
	tmpEvent.selectSingleNode(root + "/StandardEventId").appendChild(
		tmpEvent.createTextNode(pEvent));
	tmpEvent.selectSingleNode(root + "/EventDetails").appendChild(
		tmpEvent.createTextNode(pEventDetails));
	tmpEvent.selectSingleNode(root + "/EventDate").appendChild(
		tmpEvent.createTextNode(today));
	tmpEvent.selectSingleNode(root + "/UserName").appendChild(
		tmpEvent.createTextNode(user));
	tmpEvent.selectSingleNode(root + "/ReceiptDate").appendChild(
		tmpEvent.createTextNode(today));// defect 3920 changed from app date to 'today' date
	tmpEvent.selectSingleNode(root + "/DebtSeqNumber").appendChild(
		tmpEvent.createTextNode(debtId));
	tmpEvent.selectSingleNode(root + "/OwningCourtCode").appendChild(
		tmpEvent.createTextNode(courtCode));
	
	// now add it to the tmp area
	Services.addNode(tmpEvent, MaintainCOVariables.CO_EVENTS_XPATH);		
}

/**
 * This function sets any newCO Case events in the correct path for the services
 * Used for events 706 & 705
 * @param pEvent - the event id
 * @param pDeleteFlag - boolean re whether setting event in error or not
 * @param pNewDebtsOnly - boolean re whether only creating events for new debts
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setCOCaseEvent = function(pEvent, pDeleteFlag, pNewDebtsOnly)
{	
	// get list of debt ids and then see if they have a case associated with them set the event id in the dom if yes
	var debtSurrIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);
	// now loop through each 
	if(debtSurrIdList != null && debtSurrIdList.length != 0){
		// Loop through the list and ...
		var debtSurrId = null;
		var caseNumber = null;
		var courtCode = null;
		var today = this.getTodaysDate();
		var user = Services.getCurrentUser();
		var debtorName = Services.getValue(Header_Debtor.dataBinding);
		var coNumber = Services.getValue(Header_CONumber.dataBinding);
		if(coNumber == null){
			coNumber = "";
		}
		var debtSeqId = "";
		// set eror flag correctly
		var deletedFlag = "N";
		if(pDeleteFlag == true){
			deletedFlag = "Y";
		}
		var createEvent = false;
		for(var i = 0;i < debtSurrIdList.length; i++){
			debtSurrId = debtSurrIdList[i].text;
			if(debtSurrId != null && debtSurrId != ""){
				// is there a case associtaed
				caseNumber = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + debtSurrId + "']/DebtCaseNumber");
				courtCode = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + debtSurrId + "']/DebtAdminCourtCode");
				
				// defect 4479 - taken debtSeqId = Services.getValue("... out of the if(pNewDebtsOnly == true){...	statement
				// If yes need to see if this is a new debt or not - i.e. does it have a seq number
				debtSeqId = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + debtSurrId + "']/DebtSeq");
				
				// are we only doing for new debts
				if(pNewDebtsOnly == true){					
					if(debtSeqId == null || debtSeqId == ""){
						debtSeqId = "";
						// set flag to say create an event
						createEvent = true;
					}
					else{
						createEvent = false;
					}
				}
				else{
					// defect 4479 - added else so set the events at the correct time - 
					// i.e. when creating we set 705s, but in maintain we might be doing 706s
					// set flag to say create an event
					createEvent = true;
				}
				// defect 4479 - update the event detail as agreed with Phil Hardy
				// old line pre defect 4479...if(null != caseNumber && caseNumber != "" && debtSeqId == ""){
				if(null != caseNumber && caseNumber != "" && createEvent == true){
					// add event for this debt
					// Get values from DOM   
					var root = "/CoCaseEvent";
					// Set new part of DOM
					var tmpEvent = Services.loadDOMFromURL("NewCOCaseEvent.xml");
					
					// Set up data in the Tmp part of DOM
					tmpEvent.selectSingleNode(root + "/DebtSurrogateId").appendChild(
						tmpEvent.createTextNode(debtSurrId));
					tmpEvent.selectSingleNode(root + "/AdminCourtCode").appendChild(
						tmpEvent.createTextNode(courtCode));
					tmpEvent.selectSingleNode(root + "/CoNumber").appendChild(
						tmpEvent.createTextNode(coNumber));
					tmpEvent.selectSingleNode(root + "/StdEventId").appendChild(
						tmpEvent.createTextNode(pEvent));
					tmpEvent.selectSingleNode(root + "/EventDate").appendChild(
						tmpEvent.createTextNode(today));
					tmpEvent.selectSingleNode(root + "/EventDetails").appendChild(
						tmpEvent.createTextNode(debtorName));
					tmpEvent.selectSingleNode(root + "/CaseNumber").appendChild(
						tmpEvent.createTextNode(caseNumber));
					tmpEvent.selectSingleNode(root + "/ReceiptDate").appendChild(
						tmpEvent.createTextNode(today));
					tmpEvent.selectSingleNode(root + "/DeletedFlag").appendChild(
						tmpEvent.createTextNode(deletedFlag));
					// added tag defect 2945
					tmpEvent.selectSingleNode(root + "/UserName").appendChild(
						tmpEvent.createTextNode(user));					
					// now add it to the tmp area
					Services.addNode(tmpEvent, MaintainCOVariables.CO_CASE_EVENTS_XPATH);
				}// end if(null != caseNumber && caseNumber != ""){	
			} // end if(debtSurrId != null && debtSurrId != ""){
		}// end for
	}// end if(debtIdList != null && debtIdList.length != 0){
}


/**
 * This function sets details for a 777
 * Used for events 777 only
 * @param pEventType - constant so know why event 777 raised - e.g. debt deleted
 * @param pDebtSurrID - the debt id
 * @param pDebtorName - The debtor name is now passed in as called from MaintainDebt.js and as part of a CO Transfer
 *						from MaintainCO.js (using MaintainCOFunctions.setEventsReTransfer())
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setSevenSevenSevenCOCaseEvent = function(pEventType, pDebtSurrID, pDebtorName)
{
	// is there a case associataed
	var caseNumber = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + pDebtSurrID + "']/DebtCaseNumber");
	
	if(null != caseNumber && caseNumber != ""){
		var courtCode = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + pDebtSurrID + "']/DebtAdminCourtCode");
		var coNumber = Services.getValue("/ds/MaintainCO/CONumber");		
		// defect 5535 - in create mode co number is null
		if(null == coNumber){
			coNumber = "";
		}
		var today = this.getTodaysDate();
		var user = Services.getCurrentUser();
		// defect uct596 var debtorName = Services.getValue(MaintainDebt_Header_Debtor.dataBinding);
		var deletedFlag = "N";
		var eventText = null;
		if(pEventType == MaintainCOVariables.DEBT_DELETED){
			eventText = MaintainCOVariables.EVENT777_DEBT_DELETED;
		}
		else if(pEventType == MaintainCOVariables.DEBT_TRANSFERRED){
			eventText = MaintainCOVariables.EVENT777_DEBT_TRANSFERRED;
		}
		// add event for this debt
		var root = "/CoCaseEvent";
		// Set new part of DOM
		var tmpEvent = Services.loadDOMFromURL("NewCOCaseEvent.xml");
		
		
		// Set up data in the Tmp part of DOM
		tmpEvent.selectSingleNode(root + "/DebtSurrogateId").appendChild(
			tmpEvent.createTextNode(pDebtSurrID));
		tmpEvent.selectSingleNode(root + "/AdminCourtCode").appendChild(
			tmpEvent.createTextNode(courtCode));
		tmpEvent.selectSingleNode(root + "/CoNumber").appendChild(
			tmpEvent.createTextNode(coNumber));
		tmpEvent.selectSingleNode(root + "/StdEventId").appendChild(
			tmpEvent.createTextNode(MaintainCOVariables.EVENT_777_ID));
		tmpEvent.selectSingleNode(root + "/EventDate").appendChild(
			tmpEvent.createTextNode(today));
		tmpEvent.selectSingleNode(root + "/EventDetails").appendChild(
			tmpEvent.createTextNode(eventText + " " + pDebtorName));
		tmpEvent.selectSingleNode(root + "/CaseNumber").appendChild(
			tmpEvent.createTextNode(caseNumber));
		tmpEvent.selectSingleNode(root + "/ReceiptDate").appendChild(
			tmpEvent.createTextNode(today));
		tmpEvent.selectSingleNode(root + "/DeletedFlag").appendChild(
			tmpEvent.createTextNode(deletedFlag));
		// added tag defect 2945
		tmpEvent.selectSingleNode(root + "/UserName").appendChild(
			tmpEvent.createTextNode(user));
		// now add it to the tmp area
		Services.addNode(tmpEvent, MaintainCOVariables.CO_CASE_EVENTS_XPATH);
	}// end if(null != caseNumber && caseNumber != ""){	
}

/**
 * This function unsets details for a 777, e.g. set debt to delete then remove event from dom if it exists.
 * Used for events 707
 * @param pDebtId The  Delete we have unset from deleted.
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.unsetSevenSevenSevenCOCaseEvent = function(pDebtId)
{
	var caseNo = Services.getValue(MaintainCOVariables.CO_CASE_EVENTS_XPATH + "/CoCaseEvent[./DebtSurrogateId = '" + pDebtId + "']/CaseNumber");
	if(caseNo != null && caseNo != ""){
		Services.removeNode(MaintainCOVariables.CO_CASE_EVENTS_XPATH + "/CoCaseEvent[./DebtSurrogateId = '" + pDebtId + "']");
	}
}
/**
 * Functions determines if coded party id entered
 * @param pDataBinding The  databinding for the coded party code
 * @return boolean has code been entered
 * @author rzhh8k
 */
MaintainCOFunctions.codedPartyCodeEntered = function(pDataBinding)
{
	var codedPartyIdExists = false;
	
	if(pDataBinding != null && pDataBinding != ""){
		var id = Services.getValue(pDataBinding);
		if(id != null && id != ""){
			codedPartyIdExists = true;
		}
	}	

	return codedPartyIdExists;	
}

/**
 * Functions determines if payee adddress file should be mandatory
 * @return boolean is it mandatory?
 * @param pBindingString
 * @author rzhh8k
 */
MaintainCOFunctions.payeeAddressFieldMandatory = function(pBindingString)
{
	var mandatory = false;
	
	var code = Services.getValue(pBindingString + "/Payee/CPCode");
	var name = Services.getValue(pBindingString + "/Payee/Name");
	var address1 = Services.getValue(pBindingString + "/Payee/Address/Line[1]");
	var address2 = Services.getValue(pBindingString + "/Payee/Address/Line[2]");
	var address3 = Services.getValue(pBindingString + "/Payee/Address/Line[3]");
	var address4 = Services.getValue(pBindingString + "/Payee/Address/Line[4]");
	var address5 = Services.getValue(pBindingString + "/Payee/Address/Line[5]");
	var postcode = Services.getValue(pBindingString + "/Payee/Address/PostCode");
	var telNo = Services.getValue(pBindingString + "/Payee/TelNo");
	var faxNo = Services.getValue(pBindingString + "/Payee/FaxNo");
	var dxNo = Services.getValue(pBindingString + "/Payee/DX");
	var email = Services.getValue(pBindingString + "/Payee/Email");
	var commMethod = Services.getValue(pBindingString + "/Payee/CommMethod");
	var welsh = Services.getValue(pBindingString + "/Payee/TranslationToWelsh");
	var payee = Services.getValue(pBindingString + "/DebtPayeeIndicator");
	var payeeRef = Services.getValue(pBindingString + "/Payee/Reference");


	if((code != null && code != "") || (name != null && name != "") || (address1 != null && address1 != "") || (address2 != null && address2 != "") || 
			(address3 != null && address3 != "") || (address4 != null && address4 != "") || (address5 != null && address5 != "") || 
				(postcode != null && postcode != "") || (telNo != null && telNo != "") || (faxNo != null && faxNo != "") ||
					(dxNo != null && dxNo != "") || (email != null && email != "") || (commMethod != null && commMethod != "") ||
						(welsh != null && welsh != "" && welsh == MaintainCOVariables.YES) || (payee != null && payee != "" && payee == MaintainCOVariables.YES) || (payeeRef != null && payeeRef != "")){

			mandatory = true;
	}	

	return mandatory;	
}

/**
 * Functions resets the new debt area
 * @param pDataBinding The  databinding for the coded party code
 * @return boolean has code been entered
 * @deprecated 06/12/05.  No longer required due to use of sub form
 * @author rzhh8k
 */
MaintainCOFunctions.resetNewDebt = function()
{
	Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);	
	
	Services.setValue(AddDebt_AmountAllowedCurrency.dataBinding, "");
	Services.setValue(AddDebt_AmountAllowed.dataBinding, "");
	Services.setValue(AddDebt_CourtCode.dataBinding, "");
	Services.setValue(AddDebt_CourtName.dataBinding, "");
	Services.setValue(AddDebt_CaseNumber.dataBinding, "");
	Services.setValue(AddDebt_CaseParty.dataBinding, "");
	Services.setValue(AddDebt_Status.dataBinding, "");
	Services.setValue(AddDebt_CreditorCode.dataBinding, "");
	Services.setValue(AddDebt_CreditorName.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Line1.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Line2.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Line3.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Line4.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Line5.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Postcode.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_DXNo.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_TelNo.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_FaxNo.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Email.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_CommMethod.dataBinding, "");
	Services.setValue(AddDebt_Creditor_Address_Welsh.dataBinding, "N");
	Services.setValue(AddDebt_CreditorReference.dataBinding, "");
	Services.setValue(AddDebt_PayeeCode.dataBinding, "");
	Services.setValue(AddDebt_PayeeName.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Line1.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Line2.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Line3.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Line4.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Line5.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Postcode.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_DXNo.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_TelNo.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_FaxNo.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Email.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_CommMethod.dataBinding, "");
	Services.setValue(AddDebt_Payee_Address_Welsh.dataBinding, "N");
	Services.setValue(AddDebt_Payee.dataBinding, "N");
	Services.setValue(AddDebt_PayeeReference.dataBinding, "");	
	
	MaintainCOFunctions.setCancelMessage(MaintainCOVariables.NO);
	
	// Set the correct tab to be displayed next time come in
	Services.setValue(COAddDebtTabSelector.dataBinding, "TabAddDebtCreditor");
}

/**
 * SETS EVENT 777 AFTER A TRANSFER
 * SETS EVENT 980 AFTER A TRANSFER
 * @param pDebtorName the name of the debtor
 * @param pEventDetail980 event detail for an event 980 -0 contains court transfering to.
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setEventsReTransfer = function(pDebtorName, pEventDetail980)
{
	/**
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);
	
	// Now loop through each 
	if(debtIdList != null && debtIdList.length != 0){
		//Loop through the list and ...
		var id = null;
		for(var i = 0;i < debtIdList.length; i++){
			id = debtIdList[i].text;
			if(id != null && id != ""){
				// set event 777 if applicable
				this.setSevenSevenSevenCOCaseEvent(MaintainCOVariables.DEBT_TRANSFERRED, id, pDebtorName); //pEventType, pDebtSurrID, pDebtorName)
			}//if(id != null && id != ""){			
		}//for	
	}//if(debtIdList != null && debtIdList.length != 0){**/
	
	// Defect 618 Transfer CO - require event detail to include Transferred to Court.
	//Defect 3415 - Need to create an event 980 as well.
	this.setCOEvent(MaintainCOVariables.EVENT_980_ID, "", pEventDetail980); //pEvent, pDebtId, pEventDetail
}

/**
 * do debts exist on the co?
 * @return boolean representing whether debts exist on the co
 * @author rzhh8k
 */
MaintainCOFunctions.debtsExist = function()
{
	var debtExists = false;
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);
	
	if(debtIdList != null && debtIdList.length != 0){
		debtExists = true;
	}
	return debtExists;
}

/**
 * Calculates the new totals when composition has been applied
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.recalculateDueToComposition = function()
{
	// get the values from the screen
	var compType = Services.getValue(CODetails_CompType.dataBinding);
	var compRate = Services.getValue(CODetails_CompRate.dataBinding);
	
	// can only recalculate if both fields have been entered
	this.adjustDebtTotalsForComposition(compType, compRate);
	// set the totals
	this.calculateCOTotals();	
}

/**
 * Readjusts the total on the debts when composition applied
 * @param pType compostion type
 * @param pRate composition rate
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.adjustDebtTotalsForComposition = function(pType, pRate)
{
	//Get list of debts
	var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SURROGATE_ID_XPATH);

	//Now loop through each 
	if(debtIdList != null && debtIdList.length != 0){
		//Loop through the list and ...
		var id = null;
		var status = null;
		var total = null;
		var tmpAmount = null;
		for(var i = 0;i < debtIdList.length; i++){
			id = debtIdList[i].text;
			if(id != null && id != ""){
				//Need to get the status
				status = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtStatus");
				if(status != null && status != "" ){
					if(status.toUpperCase() == MaintainCOVariables.STATUS_LIVE || status.toUpperCase() == MaintainCOVariables.STATUS_PENDING){
						if(pType == null || pType == ""){
							if(pRate == null || pRate == ""){
								// if comp fields empty need to reset to original amount
								total = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountOriginal");
								Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountAllowed", total);
							}
						}
						else if(pType == MaintainCOVariables.COMPOSITION_ALLOWED_DEBT){
							// Type is allowed
							total = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountAllowed");
							tmpAmount = this.calculateRate(total, pRate);
							Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountAllowed", tmpAmount);
						}
						else if(pType == MaintainCOVariables.COMPOSITION_ORIGINAL_DEBT){
							//Type is original
							total = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountOriginal");
							tmpAmount = this.calculateRate(total, pRate);
							Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + id + "']/DebtAmountAllowed", tmpAmount);
						}// end if else(pType == MaintainCOVariables.COMPOSITION_ALLOWED_DEBT){
						
					}// end if(status.toUpperCase() == MaintainCOVariables.STATUS_LIVE){
				}// end if(status !== null && status != "" ){
			}// end if(id != null && id != ""){
		}// end for(var i = 0;i < debtIdList.length; i++){
	}// end if(debtIdList != null && debtIdList.length...
}

/**
 * calculates the new total  - reduced by the supplied rate
 * @return new total
 * @param pValue
 * @param pRate
 * @author rzhh8k
 */
MaintainCOFunctions.calculateRate = function(pValue, pRate)
{
	var newAmount = null;
	var returnAmount = pValue;
	if(pRate != null && pRate != ""){
		newAmount = parseFloat(pValue)/100 * parseFloat(pRate);
		returnAmount = newAmount.toFixed(2);
	}
	return returnAmount;
}

/**
 * is save required
 * @return boolean representing whether need to savew or not
 * @author rzhh8k
 */
MaintainCOFunctions.isSaveRequired = function()
{
	var saveReq = false;
	var save = Services.getValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE);
	if(save != null && save == MaintainCOVariables.YES){
		saveReq = true;
	}
	return saveReq;
}

/**
 * are court name and code manadtory when adding a Debt
 * @return boolean representing if mandatory or not
 * @author rzhh8k
 */
MaintainCOFunctions.isCourtMandatory = function()
{
	var isMandatory = false;
	var caseNumber = Services.getValue(AddDebt_CaseNumber.dataBinding);
	if(caseNumber != null && caseNumber != ""){
		isMandatory = true;
	}
	return isMandatory;
}

/**
 * Adds a debt seq id for the event 985 creation
 * Stored in tempary area until the user selects OK
 * @param pDebtId - the id to be stored
 * @param pTemp - boolean - store to tempo or not?
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.addDebtIdForEvent = function(pDebtId,pTemp)
{
	if(pDebtId != null && pDebtId != ""){
		var seqID = null;
		if(pTemp == true){
			// need to store actual id not surrogate
			seqID = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = '" + pDebtId + "']/DebtSeq");
		}
		else{
			// already set correctly
			seqID = pDebtId;
		} // end if/else ..(pTemp == false){
		if(seqID != null && seqID != ""){
			var root = "/IdForEvent";		
			// Set new part of DOM
			var newId = Services.loadDOMFromURL("DebtSeqNumberForEvent.xml");
			
			// Set up data
			newId.selectSingleNode("/DebtSeqNumber").appendChild(
				newId.createTextNode(seqID));
			
			if(pTemp == true){
				Services.addNode(newId, MaintainCOVariables.TMP_DEBT_SEQ_AMENDED);	
			}
			else{
				Services.addNode(newId, MaintainCOVariables.DEBT_SEQ_AMENDED);	
			} // end if/else
		} // end of if(seqID != null && seqID != ""){
	}// end if(pDebtId != null && pDebtId != ""){	
}

/**
 * Checks whether the debt creditor details have already been changed
 * Stored in tempary area until the user selects OK
 * @param pDebtId - the id to be checked
 * @return Boolean representing wether the debt creitor details have already been amended
 * @author rzhh8k
 */
MaintainCOFunctions.hasDebtBeenChangedReCreditorChangedEvent = function(pDebtId)
{
	var changed = false;
	if(pDebtId != null && pDebtId != ""){	
		// get the list - there are two lists to check
		// get list of debts
		var debtIdTempList = Services.getNodes(MaintainCOVariables.TMP_DEBT_SEQ_AMENDED + "/DebtSeqNumber");
		// now loop through each 
		// and if so, is it for the Party we are looking for.
		if(debtIdTempList != null && debtIdTempList.length != 0){
			// Loop through the list and ...
			var id = null;
			for(var i = 0;i < debtIdTempList.length; i++){
				id = debtIdTempList[i].text;
				if(id != null && id != "" && id != 0){
					if(id == pDebtId){
						changed = true;
					}// end
				}
			}
		}
		if(changed == false){
			var debtIdList = Services.getNodes(MaintainCOVariables.DEBT_SEQ_AMENDED + "/DebtSeqNumber");
			if(debtIdList != null && debtIdList.length != 0){
				// Loop through the list and ...
				var debtId = null;
				for(var i = 0;i < debtIdList.length; i++){
					debtId = debtIdList[i].text;
					if(debtId != null && debtId != 0){
						if(debtId == pDebtId){
							changed = true;
						}
					}
				}
			}
		}			
	}
	return changed;
}

/**
 * loads relevant ref data for popup/subform if necessary
 * @param pRefDataSetToAdd string representing which set of ref data we want to load
 * this depends which popup/subform is being loaded.
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.loadCOReferenceData = function(pRefDataSetToAdd)
{
	var params = new ServiceParams();
	
	if(pRefDataSetToAdd == MaintainCOVariables.MAINTAIN_DEBT_REFDATA){		
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus")){
			Services.callService("getDebtStatusList", params, MaintainDebt, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods")){
			Services.callService("getPrefCommMethodList", params, MaintainDebt, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency")){
			Services.callService("getCurrentCurrency", params, MaintainDebt, true);
		}			
	}
	else if(pRefDataSetToAdd == MaintainCOVariables.MAINTAIN_CO_REFDATA){	
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/Courts")){
			Services.callService("getCourtsShort", params, MaintainCO, true);			
		}	
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/COCompTypes")){
			Services.callService("getCoCompositionTypeList", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/COFrequency")){
			Services.callService("getCoFrequencyList", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/COTypes")){
			Services.callService("getCoTypeList", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/FeeRates")){
			Services.callService("getFeeRateList", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods")){
			Services.callService("getPrefCommMethodList", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency")){
			Services.callService("getCurrentCurrency", params, MaintainCO, true);
		}
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/SystemDate")){
			Services.callService("getSystemDate", params, MaintainCO, true);
		}
	}
	else if(pRefDataSetToAdd == MaintainCOVariables.ADD_DEBT_REFDATA){		
		if(!Services.exists(MaintainCOVariables.REF_DATA_XPATH + "/Courts")){
			Services.callService("getCourtsShort", params, MaintainCO, true);			
		}
	}
}

/**
 * Navigate away from screen
 * pExit boolean representing whether navigate
 * @param pExit
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.exitScreen = function(pExit)
{
	// clear data
	this.reSetCO();	
	Services.removeNode(MaintainCOVariables.REF_DATA_XPATH);
	Services.removeNode(MaintainCOVariables.CO_XPATH);
	if(pExit == true){
		NavigationController.nextScreen();
	}	
}

/**
 * have we alreay retrieved history - maintain co only
 * @param pHistoryType
 * @return boolean representing whether retrieved history
 * @author rzhh8k
 */
MaintainCOFunctions.historyRetrieved = function(pHistoryType)
{
	var retrieved = false;
	var retrievedFlag = null;
	
	if(pHistoryType == MaintainCOVariables.ADDRESS_HISTORY_DEBTOR){
		retrievedFlag = Services.getValue(MaintainCOVariables.DEBTOR_HISTORY_RETRIEVED);
		if(retrievedFlag != null && retrievedFlag == MaintainCOVariables.YES ){
			retrieved = true;
		}
	}
	else if(pHistoryType == MaintainCOVariables.ADDRESS_HISTORY_EMPLOYER){
		retrievedFlag = Services.getValue(MaintainCOVariables.EMPLOYER_HISTORY_RETRIEVED);
		if(retrievedFlag != null && retrievedFlag == MaintainCOVariables.YES ){
			retrieved = true;
		}
	}
	else if(pHistoryType == MaintainCOVariables.ADDRESS_HISTORY_WORKPLACE){
		retrievedFlag = Services.getValue(MaintainCOVariables.WORKPLACE_HISTORY_RETRIEVED);
		if(retrievedFlag != null && retrievedFlag == MaintainCOVariables.YES ){
			retrieved = true;
		}
	}
	
	return retrieved;
}

/**
 * Call this function to get the next generated surrogate key
 * @return next unique key
 * @author rzhh8k
 */
MaintainCOFunctions.getNextSurrogateKey = function()
{
	var surrID = Services.getValue(MaintainCOVariables.SHARED_SURROGATE_ID);
	if(surrID == null || surrID ==""){
		surrID = 0;
	}
	var nextID = parseInt(surrID) + 1;
	Services.setValue(MaintainCOVariables.SHARED_SURROGATE_ID, nextID);
	nextID = "S" + nextID;
	return nextID;
}

/**
 * Call this function to set up add debt status correctly.  Cannot set a new debt to PAID or DEleted
 * @param pSelectedDebtStatus - the status of the selected debt
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setUpTempAddDebtStatusList = function()
{
	// add full list
	var statusListNode = Services.getNode(MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus");
	Services.replaceNode(MaintainCOVariables.ADD_DEBT_STATUS_LIST_TMP_PATH, statusListNode);
	// remove 'PAID' and 'DELETED' status from list - not required for add debt
	Services.removeNode(MaintainCOVariables.ADD_DEBT_STATUS_LIST_TMP_PATH + "/Status[Value = '" + "PAID" + "']");
	Services.removeNode(MaintainCOVariables.ADD_DEBT_STATUS_LIST_TMP_PATH + "/Status[Value = '" + "DELETED" + "']");	
}

/**
 * Call this function to set up debt status correctly.  If the debt has a status of PAID, then the value stays in the droplist.
 * If not remove the value. This is due to not being able to select a status of PAID. This can only be derived.
 * @param pSelectedDebtStatus - the status of the selected debt
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setUpTempDebtStatusList = function(pSelectedDebtStatus)
{	
	// add full list
	var statusListNode = Services.getNode(MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus");
	Services.replaceNode(MaintainCOVariables.DEBT_STATUS_LIST_TMP_PATH, statusListNode);
	
	if(pSelectedDebtStatus != null && pSelectedDebtStatus != MaintainCOVariables.STATUS_PAID){
		// remove 'PAID'status from list
		Services.removeNode(MaintainCOVariables.DEBT_STATUS_LIST_TMP_PATH + "/Status[Value = '" + "PAID" + "']");		
	}	
}


/**
 * Checks to see if a payee exists on the selected debt
 * @param pDebtID - the debt selected
 * @return boolean - exists true
 * @author rzhh8k
 */
MaintainCOFunctions.payeeExistsOnDebt = function(pDebtID)
{
	var payeeExists = false;
	
	if(pDebtID != null && pDebtID != ""){
		var payeeName = Services.getValue(MaintainCOVariables.CO_XPATH + "/Debts/Debt[./DebtSurrogateId = '" + pDebtID + "']/Payee/Name");
		if(payeeName != null && payeeName != ""){
			// exists
			payeeExists = true;
		}
	}
	
	return payeeExists;
}

/**
 * Function sets the debtor on add debt if there is only one left in the list
 * @author rzhh8k
 * 
 */
MaintainCOFunctions.setDebtor = function()
{
	// get list of parties on case
	var caseIdList = Services.getNodes(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party/PartyKey");

	// now loop through each 
	// and if so, is it for the Party we are looking for.
	if(caseIdList != null && caseIdList.length == 1){
		var id = caseIdList[0].text;
		//set the details
		if (id != null && id != ""){
			// Lookup the court details in ref data from the code that is stored in value				
			var xpathPartyRoleCode = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[PartyKey = '" + id + "']/PartyRoleCode";
			var xpathcasePartyNumber = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[PartyKey = '" + id + "']/CasePartyNumber";
			
			var partyRole = Services.getValue(xpathPartyRoleCode);
			var partyNumber = Services.getValue(xpathcasePartyNumber);
			// MGG - - Missed by developer who created subform. Important functionality not being brought back to the maintain debt screen!!!!****
			//Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/PartyRoleCode", partyRole);
			//Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/CasePartyNumber", partyNumber);
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PartyRoleCode", partyRole);
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasePartyNumber", partyNumber);
			Services.setValue(AddDebt_CaseParty.dataBinding, id);
		}	
	}
}

/**
 * Call this function to get the next generated surrogate key
 * @return boolean - do we load ref data
 * @author rzhh8k
 */
MaintainCOFunctions.loadRefDataForReadOnly = function()
{
	var getData = false;
	// Get the screen mode
	var mode = Services.getValue(ManageCOParams.MODE);
	// check we have a co number
	var coNumber = Services.getValue(ManageCOParams.CO_NUMBER);	
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		if(coNumber != null && coNumber != ""){
			getData = true;
		}
	}
	return getData;
}

/**
 * Function indicates whether or not a coded party code belongs to the Non CPC
 * National Coded Party Range (7000 - 9999).  Note some CCBC National Coded Parties
 * exist in the 7000-9999 range.
 *
 * @param [Integer] The Coded Party Code
 * @return [Boolean] True if the code falls in the range 7000-9999 else false
 * @author rzhh8k
 */
 MaintainCOFunctions.isNonCPCNationalCodedParty = function(pCode)
{
	var isNonCPCNational = false;
	if(pCode != null){
		if ( pCode >= 7000 && !CaseManUtils.isCCBCNationalCodedParty(pCode) )
		{
			// Code in 7000 and above range and not a CCBC National Coded Party
			isNonCPCNational = true;
		}
	}
	
	return isNonCPCNational;
}
