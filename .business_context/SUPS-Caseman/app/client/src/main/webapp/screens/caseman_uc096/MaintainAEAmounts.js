/** 
 * @fileoverview ManageAEAmounts.js:
 * This file contains the form and field configurations for the UC096 - Maintain 
 * AE Refunds and Fees screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 15/06/2006 - Chris Vincent, Changed global variables to static variables.
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 * 18/09/2006 - Chris Vincent, where the function calculateTotalFees() is used to return the total
 * 				amount and that total variable is used in another calculation e.g. Amount logics and
 * 				Amount validation fields, the calculateTotalFees() call must be wrapped in a parseFloat()
 * 				otherwise a string interpretation of the total amount will be used instead.  TD defects
 * 				5209 & 5210.
 * 01/12/2006 - Chris Vincent, made changes to the Save Button actionbinding to update AE_APPLICATIONS.AE_FEE
 * 				and Create an AE Event 890 under certain circumstances.  UCT Defects 838 & 839.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 11/11/2009 - Chris Vincent, change to hint text for Header_OwningCourtCode and Header_OwningCourtName as both
 *			now refer to AE Issuing Court Code instead of Case Owning Court.  Trac 1667.
 */
 
/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.DEFAULTCURRENCY_XPATH = XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol";
XPathConstants.DATA_XPATH = "/ds/MaintainAEAmounts";
XPathConstants.SELECTEDAMOUNT_XPATH = XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount[./SurrogateId = /ds/var/page/SelectedGridRow/AEAmount]";
XPathConstants.NEWAMOUNTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NewAmountData";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item = 'MAX_AE_FEE']/ItemValue";
XPathConstants.DATA_CHANGED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DataChanged";
XPathConstants.AE_EVENT_ROOT_XPATH = XPathConstants.DATA_XPATH + "/AEEvents";
XPathConstants.AE_FEE_XPATH = XPathConstants.DATA_XPATH + "/Fee";

/**
 * Amount Type Constants
 * @author rzxd7g
 * 
 */
function AmountTypes() {};
AmountTypes.AMOUNTTYPE_FEE = "FEE";
AmountTypes.AMOUNTTYPE_REFUND = "REFUND";

/**
 * Amount Status Constants
 * @author rzxd7g
 * 
 */
function AmountStatuses() {};
AmountStatuses.STATUS_NEW = "NEW";
AmountStatuses.STATUS_UPDATED = "UPDATED";
AmountStatuses.STATUS_DELETED = "DELETE";

/****************************** MAIN FORM *****************************************/

function maintainAEAmounts() {}

/**
 * @author rzxd7g
 * 
 */
maintainAEAmounts.initialise = function()
{
	var caseNumber = Services.getValue(MaintainAEAmountParams.CASE_NUMBER);
	var aeNumber = Services.getValue(MaintainAEAmountParams.AE_NUMBER);
	if ( !CaseManUtils.isBlank(caseNumber) && !CaseManUtils.isBlank(aeNumber) )
	{
		// Case Number passed in, call retrieval service
		retrieveCaseData();
	}
	else
	{
		// Exit screen if no case number passed in
		exitScreen();
	}
}

// Load the reference data from the xml into the model 
maintainAEAmounts.refDataServices = [
	{ name:"AmountTypes",     dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getAmountTypeList",  serviceParams:[] },
	{ name:"SystemDate",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{ name:"SystemData",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData",      serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/********************************** POPUPS *****************************************/

function NewAmountPopup() {}
/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
NewAmountPopup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/********************************** GRIDS *****************************************/

function Master_AEAmountsGrid() {}
Master_AEAmountsGrid.componentName = "AE Amounts Grid";
Master_AEAmountsGrid.tabIndex = 1;
Master_AEAmountsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/AEAmount";
Master_AEAmountsGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount/Deleted"];
Master_AEAmountsGrid.srcData = XPathConstants.DATA_XPATH + "/AEAmounts";
Master_AEAmountsGrid.rowXPath = "AEAmount[./Deleted != 'Y']";
Master_AEAmountsGrid.keyXPath = "SurrogateId";
Master_AEAmountsGrid.columns = [
	{xpath: "DateCreated", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "AmountCurrency", sort: "disabled", transformToDisplay: transformCurrencyToDisplay },
	{xpath: "Amount", sort: "numerical", transformToDisplay: transformFeeForGrid },
	{xpath: "UserName"}
];

/*********************************************************************************/

function AmountPopup_NewAmountsGrid() {}
AmountPopup_NewAmountsGrid.componentName = "New AE Amounts Grid";
AmountPopup_NewAmountsGrid.tabIndex = 34;
AmountPopup_NewAmountsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/NewAEAmount";
AmountPopup_NewAmountsGrid.srcData = XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts";
AmountPopup_NewAmountsGrid.rowXPath = "AEAmount";
AmountPopup_NewAmountsGrid.keyXPath = "SurrogateId";
AmountPopup_NewAmountsGrid.columns = [
	{xpath: "DateCreated", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "AmountCurrency", sort: "disabled", transformToDisplay: transformCurrencyToDisplay },
	{xpath: "Amount", sort: "numerical", transformToDisplay: transformFeeForGrid },
	{xpath: "UserName"}
];

AmountPopup_NewAmountsGrid.isEnabled = function()
{
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount");
	return ( countNewAmounts == 0 ) ? false : true;
}

/***************************** DATA BINDINGS **************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_AENumber.dataBinding = XPathConstants.DATA_XPATH + "/AENumber";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtName";
Header_ApplicationType.dataBinding = XPathConstants.DATA_XPATH + "/ApplicationTypeDescription";
Header_JudgmentCreditor.dataBinding = XPathConstants.DATA_XPATH + "/JudgmentCreditor/PartyName";
Header_JudgmentDebtor.dataBinding = XPathConstants.DATA_XPATH + "/JudgmentDebtor/PartyName";
Header_TotalFeesCurrency.dataBinding = XPathConstants.DATA_XPATH + "/TotalFees/Currency";
Header_TotalFees.dataBinding = XPathConstants.DATA_XPATH + "/TotalFees/Amount";
AmountDetails_AmountCurrency.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/AmountCurrency";
AmountDetails_Amount.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/Amount";
AmountDetails_CreatedBy.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/UserName";
AmountPopup_AmountType.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/AmountType";
AmountPopup_AmountCurrency.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/AmountCurrency";
AmountPopup_Amount.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/Amount";

/********************************* FIELDS ******************************************/

function Header_CaseNumber() {}

Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isTemporary = function() { return true; }
Header_CaseNumber.isReadOnly = function() { return true; }
/**
 * @param dom
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.DATA_XPATH, dom);
}

/*********************************************************************************/

function Header_AENumber() {}
Header_AENumber.tabIndex = -1;
Header_AENumber.maxLength = 8;
Header_AENumber.helpText = "Attachment of Earnings application number";
Header_AENumber.isTemporary = function() { return true; }
Header_AENumber.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "AE issuing court code";
Header_OwningCourtCode.isTemporary = function() { return true; }
Header_OwningCourtCode.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "AE issuing court name";
Header_OwningCourtName.isTemporary = function() { return true; }
Header_OwningCourtName.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_ApplicationType() {}
Header_ApplicationType.tabIndex = -1;
Header_ApplicationType.maxLength = 70;
Header_ApplicationType.helpText = "Application type";
Header_ApplicationType.isTemporary = function() { return true; }
Header_ApplicationType.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_JudgmentCreditor() {}
Header_JudgmentCreditor.tabIndex = -1;
Header_JudgmentCreditor.maxLength = 70;
Header_JudgmentCreditor.helpText = "Name of the Judgment Creditor";
Header_JudgmentCreditor.isTemporary = function() { return true; }
Header_JudgmentCreditor.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_JudgmentDebtor() {}
Header_JudgmentDebtor.tabIndex = -1;
Header_JudgmentDebtor.maxLength = 70;
Header_JudgmentDebtor.helpText = "Name of the Judgment Debtor";
Header_JudgmentDebtor.isTemporary = function() { return true; }
Header_JudgmentDebtor.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_TotalFeesCurrency() {}
Header_TotalFeesCurrency.tabIndex = -1;
Header_TotalFeesCurrency.isTemporary = function() { return true; }
Header_TotalFeesCurrency.isReadOnly = function() { return true; }
Header_TotalFeesCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Header_TotalFees() {}
Header_TotalFees.tabIndex = -1;
Header_TotalFees.maxLength = 8;
Header_TotalFees.helpText = "Total fees paid for this Attachment of Earnings";
Header_TotalFees.isTemporary = function() { return true; }
Header_TotalFees.isReadOnly = function() { return true; }
Header_TotalFees.transformToDisplay = function(value)
{
	if ( CaseManUtils.isBlank(value) )
	{
		// Displays 0 if no value exists when entering the screen.
		value = 0;
	}
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function AmountDetails_AmountCurrency() {}
AmountDetails_AmountCurrency.retrieveOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_AmountCurrency.tabIndex = 10;
AmountDetails_AmountCurrency.isMandatory = function() { return true; }
AmountDetails_AmountCurrency.isReadOnly = function() { return true; }
AmountDetails_AmountCurrency.enableOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_AmountCurrency.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_AEAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

AmountDetails_AmountCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, null, "");
}

/*********************************************************************************/

function AmountDetails_Amount() {}
AmountDetails_Amount.retrieveOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_Amount.tabIndex = 11;
AmountDetails_Amount.maxLength = 8;
AmountDetails_Amount.helpText = "Amount";
AmountDetails_Amount.componentName = "Amount";
AmountDetails_Amount.isMandatory = function() { return true; }
AmountDetails_Amount.enableOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_Amount.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_AEAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

AmountDetails_Amount.readOnlyOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_Amount.isReadOnly = function()
{
	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/DateCreated");
	if ( !CaseManUtils.isBlank( dateCreated ) )
	{
		dateCreated = CaseManUtils.createDate( dateCreated );
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		if ( CaseManUtils.compareDates(today, dateCreated) != 0 )
		{
			// Currently selected amount was not created today, prevent update by making read only
			return true;
		}
	}
	return false;
}

AmountDetails_Amount.validateOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_Amount.validate = function()
{
	var ec = null;

	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/DateCreated");
	dateCreated = CaseManUtils.createDate( dateCreated );
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	if ( CaseManUtils.compareDates(today, dateCreated) != 0 )
	{
		// Do not perform validation if the amount has not been created today
		return ec;
	}

	var amount = Services.getValue(AmountDetails_Amount.dataBinding);
	var total = parseFloat( calculateTotalFees() );
	
	if ( !CaseManUtils.isBlank(amount) )
	{
		ec = CaseManValidationHelper.validatePattern(amount, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		amount = parseFloat(amount);
		
		if ( null == ec && amount == 0 )
		{
			// The amount cannot be 0.00
			ec = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
		}
		else if ( null == ec && total < 0 )
		{
			// The recalculated total fee cannot be less than 0.00
			ec = ErrorCode.getErrorCode("CaseMan_negativeTotalFee_Msg");
		}
		else if ( null == ec && amount >= 100000)
		{
			ec = ErrorCode.getErrorCode("CaseMan_maximumAmountXExceded_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, 99999.99);
		}
	}
	return ec;
}

AmountDetails_Amount.transformToModel = function(value)
{
	if ( null == CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
	{
		// Handles the removal or addition of a minus (-) sign
		var amountType = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Type");
		value = evaluateValueSign(value, amountType);
		return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
	}
	return value;
}

AmountDetails_Amount.transformToDisplay = function(value)
{
	if ( null == CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
	{
		// Handles the removal or addition of a minus (-) sign
		var amountType = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Type");
		value = evaluateValueSign(value, amountType);
		return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
	}
	return value;
}

AmountDetails_Amount.logicOn = [AmountDetails_Amount.dataBinding];
AmountDetails_Amount.logic = function(event)
{
	if ( event.getXPath() != AmountDetails_Amount.dataBinding )
	{
		return;
	}
	
	if ( Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status") != AmountStatuses.STATUS_NEW )
	{
		// Set the status and dirty flags
		setDirtyFlag();
		Services.setValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status", AmountStatuses.STATUS_UPDATED);
	}
	
	if ( this.getValid() )
	{
		// Recalculate total fees if amount is valid
		Services.setValue( Header_TotalFees.dataBinding, calculateTotalFees() );
	}
	else
	{
		return;
	}
	
	// Display alert message if recalculated total fees exceeds maximum (applies to fees only)
	var total = parseFloat( Services.getValue(Header_TotalFees.dataBinding) );
	var maxFee = parseFloat( Services.getValue(XPathConstants.MAX_FEE_XPATH) );
	var amount = Services.getValue(AmountDetails_Amount.dataBinding);
	if ( amount > 0 && total > maxFee )
	{
		alert(Messages.AE_TOTALFEESEXCEEDED_MESSAGE);
	}
	
	// Update the Created By field with current user name
	Services.setValue(AmountDetails_CreatedBy.dataBinding, Services.getCurrentUser());
}

/*********************************************************************************/

function AmountDetails_CreatedBy() {}
AmountDetails_CreatedBy.retrieveOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_CreatedBy.tabIndex = 12;
AmountDetails_CreatedBy.maxLength = 30;
AmountDetails_CreatedBy.helpText = "Username that created the amount";
AmountDetails_CreatedBy.isMandatory = function() { return true; }
AmountDetails_CreatedBy.isReadOnly = function() { return true; }
AmountDetails_CreatedBy.enableOn = [Master_AEAmountsGrid.dataBinding];
AmountDetails_CreatedBy.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_AEAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

/*********************************************************************************/

function AmountPopup_AmountType() {}
AmountPopup_AmountType.srcData = XPathConstants.REF_DATA_XPATH + "/AmountTypes";
AmountPopup_AmountType.rowXPath = "/AmountType";
AmountPopup_AmountType.keyXPath = "/Value";
AmountPopup_AmountType.displayXPath = "/Value";
AmountPopup_AmountType.tabIndex = 30;
AmountPopup_AmountType.helpText = "Refund or Fee";
AmountPopup_AmountType.isTemporary = function() { return true; }
AmountPopup_AmountType.isMandatory = function() { return true; }
AmountPopup_AmountType.enableOn = [Master_AEAmountsGrid.dataBinding, AmountPopup_NewAmountsGrid.dataBinding];
AmountPopup_AmountType.isEnabled = function()
{
	var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
	var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
	
	if ( ( newFeeExists || feeCreatedToday() ) && ( newRefundExists || refundCreatedToday() ) )
	{
		// In one way or another, a new fee and a new refund have been created today, prevent
		// further additions.
		return false;
	}
	return true;
}

AmountPopup_AmountType.validate = function()
{
	var ec = null;

	var type = Services.getValue(AmountPopup_AmountType.dataBinding);
	if ( !CaseManUtils.isBlank(type) )
	{
		if ( type == AmountTypes.AMOUNTTYPE_FEE )
		{
			var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
			if ( newFeeExists || feeCreatedToday() )
			{
				// A new fee has already been created today
				ec = ErrorCode.getErrorCode("CaseMan_feeAlreadyAdded_Msg");
			}
		}
		else if ( type == AmountTypes.AMOUNTTYPE_REFUND )
		{
			var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
			if ( newRefundExists || refundCreatedToday() )
			{
				// A new refund has already been created today
				ec = ErrorCode.getErrorCode("CaseMan_refundAlreadyAdded_Msg");
			}
		}
	}
	return ec;
}

AmountPopup_AmountType.logicOn = [AmountPopup_AmountType.dataBinding];
AmountPopup_AmountType.logic = function(event)
{
	if ( event.getXPath() != AmountPopup_AmountType.dataBinding )
	{
		return;
	}

	// Set the default values of the amount fields
	Services.startTransaction();	
	var type = Services.getValue(AmountPopup_AmountType.dataBinding);
	if ( CaseManUtils.isBlank(type) || !this.getValid() )
	{
		Services.setValue(AmountPopup_AmountCurrency.dataBinding, "");
	}
	else
	{
		var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
		Services.setValue(AmountPopup_AmountCurrency.dataBinding, defaultCurrency);
	}
	Services.setValue(AmountPopup_Amount.dataBinding, "");
	Services.endTransaction();
}

/*********************************************************************************/

function AmountPopup_AmountCurrency() {}
AmountPopup_AmountCurrency.tabIndex = 31;
AmountPopup_AmountCurrency.isTemporary = function() { return true; }
AmountPopup_AmountCurrency.isMandatory = function() { return true; }
AmountPopup_AmountCurrency.isReadOnly = function() { return true; }
AmountPopup_AmountCurrency.enableOn = [AmountPopup_AmountType.dataBinding];
AmountPopup_AmountCurrency.isEnabled = function()
{
	var type = Services.getValue(AmountPopup_AmountType.dataBinding);
	var typeValid = Services.getAdaptorById("AmountPopup_AmountType").getValid();
	if ( CaseManUtils.isBlank(type) || !typeValid )
	{
		// Disabled if type is blank or invalid
		return false;
	}
	return true;
}

AmountPopup_AmountCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, null, "");
}

/*********************************************************************************/

function AmountPopup_Amount() {}
AmountPopup_Amount.tabIndex = 32;
AmountPopup_Amount.maxLength = 8;
AmountPopup_Amount.helpText = "Amount";
AmountPopup_Amount.isTemporary = function() { return true; }
AmountPopup_Amount.isMandatory = function() { return true; }
AmountPopup_Amount.enableOn = [AmountPopup_AmountType.dataBinding];
AmountPopup_Amount.isEnabled = function()
{
	var type = Services.getValue(AmountPopup_AmountType.dataBinding);
	var typeValid = Services.getAdaptorById("AmountPopup_AmountType").getValid();
	if ( CaseManUtils.isBlank(type) || !typeValid )
	{
		// Disabled if type is blank or invalid
		return false;
	}
	return true;
}

AmountPopup_Amount.validate = function()
{
	var ec = null;
	var amount = Services.getValue(AmountPopup_Amount.dataBinding);
	var total = parseFloat( calculateTotalFees() );
	
	if ( !CaseManUtils.isBlank(amount) )
	{
		ec = CaseManValidationHelper.validatePattern(amount, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		amount = parseFloat(amount);
		if ( null == ec && amount == 0 )
		{
			// The amount cannot be 0.00
			ec = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
		}
		else if ( null == ec && (total + amount) < 0 && amount < 0 )
		{
			// The recalculated total fee cannot be less than 0.00 (applies to refunds only)
			ec = ErrorCode.getErrorCode("CaseMan_negativeTotalFee_Msg");
		}
		else if ( null == ec && amount >= 100000)
		{
			ec = ErrorCode.getErrorCode("CaseMan_maximumAmountXExceded_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, 99999.99);
		}
	}
	return ec;
}

AmountPopup_Amount.transformToModel = function(value)
{
	if ( null == CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
	{	
		// Handles the removal or addition of a minus (-) sign
		var amountType = Services.getValue(AmountPopup_AmountType.dataBinding);
		value = evaluateValueSign(value, amountType);
		return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
	}
	return value;
}

AmountPopup_Amount.logicOn = [AmountPopup_Amount.dataBinding];
AmountPopup_Amount.logic = function(event)
{
	if ( event.getXPath() != AmountPopup_Amount.dataBinding )
	{
		return;
	}
	
	if ( !this.getValid() )
	{
		return;
	}
	
	// Display alert message if recalculated total fees exceeds maximum (only applies to fees)
	var amount = parseFloat( Services.getValue(AmountPopup_Amount.dataBinding) );
	var total = parseFloat( calculateTotalFees() );
	var maxFee = parseFloat( Services.getValue(XPathConstants.MAX_FEE_XPATH) );
	if ( amount > 0 && (amount + total) > maxFee )
	{
		alert(Messages.AE_TOTALFEESEXCEEDED_MESSAGE);
	}
}

/******************************** BUTTONS *****************************************/

function Master_AddAmountButton() {}
Master_AddAmountButton.tabIndex = 2;
Master_AddAmountButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "maintainAEAmounts" } ]
	}
};

Master_AddAmountButton.enableOn = [XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount", XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount/Deleted"];
Master_AddAmountButton.isEnabled = function()
{
	if ( feeCreatedToday() && refundCreatedToday() )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Master_AddAmountButton.actionBinding = function()
{
	// Set default value for amount type
	var defaultType = ""
	if ( feeCreatedToday() )
	{
		defaultType = AmountTypes.AMOUNTTYPE_REFUND;
	}
	else if ( refundCreatedToday() )
	{
		defaultType = AmountTypes.AMOUNTTYPE_FEE;
	}
	else
	{
		var totalFees = Services.getValue(Header_TotalFees.dataBinding);
		if ( CaseManUtils.isBlank(totalFees) || parseInt(totalFees) == 0 )
		{
			// If total fees is 0, then default to FEE
			defaultType = AmountTypes.AMOUNTTYPE_FEE;
		}
	}
	Services.setValue(AmountPopup_AmountType.dataBinding, defaultType);
	Services.dispatchEvent("NewAmountPopup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/**********************************************************************************/

function Master_RemoveAmountButton() {}
Master_RemoveAmountButton.tabIndex = 3;
Master_RemoveAmountButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainAEAmounts", alt: true } ]
	}
};

Master_RemoveAmountButton.enableOn = [Master_AEAmountsGrid.dataBinding];
Master_RemoveAmountButton.isEnabled = function()
{
	var gridDB = Services.getValue(Master_AEAmountsGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		// Disabled if the amounts grid is empty
		return false;
	}
	
	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/DateCreated");
	if ( !CaseManUtils.isBlank(dateCreated) )
	{
		var dateCreated = CaseManUtils.createDate( dateCreated );
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		if ( CaseManUtils.compareDates(today, dateCreated) != 0 )
		{
			// Currently selected amount was not created today, prevent removal by disabling button
			return false;
		}
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Master_RemoveAmountButton.actionBinding = function()
{
	var amount = Services.getValue(AmountDetails_Amount.dataBinding);
	var total = parseFloat(Services.getValue(Header_TotalFees.dataBinding));
	
	// This stops users from updating an amount with an invalid amount and then removing it to get a total less than 0
	var reCalc = 0;
	if ( null != CaseManValidationHelper.validatePattern(amount, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
	{
		reCalc = total;
	}
	
	amount = parseFloat(amount);
	if ( (total - amount) < 0 || reCalc < 0 )
	{
		// Removing amount would set the total fees to less than zero, raise error
		var ec = ErrorCode.getErrorCode("CaseMan_totalFeeCannotBeNegativeOnRemoval_Msg");
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
	else
	{
		// Remove the selected amount
		Services.startTransaction();
		var currentStatus = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status");
		if ( currentStatus == AmountStatuses.STATUS_NEW )
		{
			Services.removeNode(XPathConstants.SELECTEDAMOUNT_XPATH);
		}
		else
		{
			Services.setValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Deleted", "Y");
			Services.setValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status", AmountStatuses.STATUS_UPDATED);
		}
		Services.setValue( Header_TotalFees.dataBinding, calculateTotalFees() );
		setDirtyFlag();
		Services.endTransaction();
	}
};

/**********************************************************************************/

function Status_SaveButton() {}
Status_SaveButton.tabIndex = 20;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainAEAmounts" } ]
	}
};

/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	if ( isDataDirty() )
	{
		// Validate the form
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if ( 0 != invalidFields.length )
		{
			// Form invalid
			return;
		}
		else
		{
			// If total if 0.00 and a refund exists created today, create AE Event 890.  UCT Defect 839
			var totalAmount = Services.getValue(Header_TotalFees.dataBinding);
			if ( totalAmount == 0 && refundCreatedToday() )
			{
				// Create AE Event 890
				var newEvent = Services.loadDOMFromURL("NewAEEvent.xml");
				newEvent.selectSingleNode("/AEEvent/CaseNumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_CaseNumber.dataBinding) ) ) );
				newEvent.selectSingleNode("/AEEvent/OwningCourtCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_OwningCourtCode.dataBinding) ) ) );
				newEvent.selectSingleNode("/AEEvent/AENumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_AENumber.dataBinding) ) ) );
				newEvent.selectSingleNode("/AEEvent/StandardEventId").appendChild( newEvent.createTextNode( "890" ) );
				newEvent.selectSingleNode("/AEEvent/EventDate").appendChild( newEvent.createTextNode( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ) );
				newEvent.selectSingleNode("/AEEvent/UserName").appendChild( newEvent.createTextNode( Services.getCurrentUser() ) );
				newEvent.selectSingleNode("/AEEvent/ReceiptDate").appendChild( newEvent.createTextNode( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ) );
				Services.addNode(newEvent, XPathConstants.AE_EVENT_ROOT_XPATH);
			}
			
			// If fee updated/ removed which has the same creation date of ae creation date
			// then need to update A.AE_FEE.  UCT Defect 838
			var aeCreationDate = Services.getValue(XPathConstants.DATA_XPATH + "/DateCreated");
			var today = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
			if ( aeCreationDate == today )
			{
				var activeFeeExists = feeCreatedToday();
				var deletedFeeExists = Services.exists(XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount[./Type = 'FEE' and ./DateCreated = '" + today + "' and ./Deleted = 'Y']");
				if ( activeFeeExists )
				{
					var fee = Services.getValue(XPathConstants.DATA_XPATH + "/AEAmounts/AEAmount[./Type = 'FEE' and ./DateCreated = '" + today + "' and ./Deleted != 'Y']/Amount");
					// Update AE_APPLICATIONS.AE_FEE with Fee Amount created today
					Services.setValue(XPathConstants.AE_FEE_XPATH, fee);
				}
				else if ( deletedFeeExists )
				{
					// Update AE_APPLICATIONS.AE_FEE with 0.00 as fee that previously existed now removed
					Services.setValue(XPathConstants.AE_FEE_XPATH, "0.00");
				}
			}
			
			var dataNode = XML.createDOM(null, null, null);
			dataNode.appendChild( Services.getNode(XPathConstants.DATA_XPATH) );
	
			var params = new ServiceParams();
			params.addDOMParameter("aeAmounts", dataNode);
			Services.callService("updateAeAmounts", params, Status_SaveButton, true);
		}
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	// After successful save, exit screen
	exitScreen();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		retrieveCaseData();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.tabIndex = 21;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainAEAmounts" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
};

/**********************************************************************************/

function AmountPopup_AddButton() {}
AmountPopup_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "NewAmountPopup" } ]
	}
};
AmountPopup_AddButton.tabIndex = 33;
AmountPopup_AddButton.enableOn = [AmountPopup_Amount.dataBinding, AmountPopup_AmountType.dataBinding];
AmountPopup_AddButton.isEnabled = function()
{
	var amount = Services.getValue(AmountPopup_Amount.dataBinding);
	amountValid = Services.getAdaptorById("AmountPopup_Amount").getValid();
	typeValid = Services.getAdaptorById("AmountPopup_AmountType").getValid();

	if ( CaseManUtils.isBlank(amount) || !amountValid || !typeValid )
	{
		// Disable button if amount is blank or invalid
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
AmountPopup_AddButton.actionBinding = function()
{
	var newAmount = Services.loadDOMFromURL("NewAmount.xml");
	newAmount.selectSingleNode("/AEAmount/SurrogateId").appendChild( newAmount.createTextNode( generateNextSurrogateId() ) );
	newAmount.selectSingleNode("/AEAmount/DateCreated").appendChild( newAmount.createTextNode( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ) );
	newAmount.selectSingleNode("/AEAmount/Type").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_AmountType.dataBinding) ) ) );
	newAmount.selectSingleNode("/AEAmount/AmountCurrency").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_AmountCurrency.dataBinding) ) ) );
	newAmount.selectSingleNode("/AEAmount/Amount").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_Amount.dataBinding) ) ) );
	newAmount.selectSingleNode("/AEAmount/UserName").appendChild( newAmount.createTextNode( Services.getCurrentUser() ) );
	newAmount.selectSingleNode("/AEAmount/Status").appendChild( newAmount.createTextNode( AmountStatuses.STATUS_NEW ) );
	newAmount.selectSingleNode("/AEAmount/ProcessType").appendChild( newAmount.createTextNode( "A" ) );
	newAmount.selectSingleNode("/AEAmount/Deleted").appendChild( newAmount.createTextNode( "N" ) );
	Services.addNode(newAmount, AmountPopup_NewAmountsGrid.srcData);

	// Reset default value for amount type
	var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
	var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
	if ( ( newFeeExists || feeCreatedToday() ) && ( newRefundExists || refundCreatedToday() ) )
	{
		// Cannot add any more, clear field
		Services.setValue(AmountPopup_AmountType.dataBinding, "");
		Services.setFocus("AmountPopup_OkButton");
	}
	else if ( newFeeExists || feeCreatedToday() )
	{
		// A new fee has been added today, set to 'REFUND'
		Services.setValue(AmountPopup_AmountType.dataBinding, AmountTypes.AMOUNTTYPE_REFUND);
		Services.setFocus("AmountPopup_Amount");
	}
	else
	{
		// A new refund has been added today, set to 'FEE'
		Services.setValue(AmountPopup_AmountType.dataBinding, AmountTypes.AMOUNTTYPE_FEE);
		Services.setFocus("AmountPopup_Amount");
	}
};

/**********************************************************************************/

function AmountPopup_OkButton() {}
AmountPopup_OkButton.tabIndex = 35;
AmountPopup_OkButton.enableOn = [AmountPopup_AmountType.dataBinding];
AmountPopup_OkButton.isEnabled = function()
{
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount");
	return ( countNewAmounts == 0 ) ? false : true;
}

/**
 * @author rzxd7g
 * 
 */
AmountPopup_OkButton.actionBinding = function()
{
	Services.dispatchEvent("NewAmountPopup", BusinessLifeCycleEvents.EVENT_LOWER);

	// Add all new amounts to the main grid	
	Services.startTransaction();
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount");
	for (var i=0; i<countNewAmounts; i++)
	{
		var newNode = Services.getNode(XPathConstants.NEWAMOUNTS_XPATH + "/AEAmounts/AEAmount[" + (i+1) + "]");
		Services.addNode(newNode, Master_AEAmountsGrid.srcData);
	}
	
	// Clear the temporary add amount node
	Services.removeNode(XPathConstants.NEWAMOUNTS_XPATH);
	Services.setValue( Header_TotalFees.dataBinding, calculateTotalFees() );
	setDirtyFlag();
	Services.endTransaction();
};

/**********************************************************************************/

function AmountPopup_CancelButton() {}
AmountPopup_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "NewAmountPopup" } ]
	}
};
AmountPopup_CancelButton.tabIndex = 36;
/**
 * @author rzxd7g
 * 
 */
AmountPopup_CancelButton.actionBinding = function()
{
	Services.dispatchEvent("NewAmountPopup", BusinessLifeCycleEvents.EVENT_LOWER);
	
	// Clear the temporary add amount node
	Services.removeNode(XPathConstants.NEWAMOUNTS_XPATH);
};
