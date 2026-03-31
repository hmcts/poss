/** 
 * @fileoverview ManageWarrantAmounts.js:
 * This file contains the form and field configurations for the UC040 - Maintain 
 * AE Refunds and Fees screen.
 *
 * @author Tun Shwe, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 01/06/2006 - Chris Vincent, Changed global variables to static variables.
 * 06/06/2006 - Chris Vincent, moved constants to this file from separate constants file
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 * 15/08/2006 - Chris Vincent, changed validation on the amount field so the test if the value
 * 				results in a negative total does not just apply to refunds.  Defect 4301.
 * 22/08/2006 - Chris Vincent, change to Status_SaveButton.onSuccess() so when check for updatedWarrantFee 
 * 				the xpath search also looks for a deleted node with a value of 'N' otherwise can get
 * 				multiple results causing an error.  Defect 4274.
 * 18/09/2006 - Chris Vincent, where the function calculateTotalFees() is used to return the total
 * 				amount and that total variable is used in another calculation e.g. Amount logics and
 * 				Amount validation fields, the calculateTotalFees() call must be wrapped in a parseFloat()
 * 				otherwise a string interpretation of the total amount will be used instead.  TD defects
 * 				5209 & 5210.
 * 24/10/2006 - Chris Vincent, updated the AmountPopup_Amount.maxLength from 8 to 10 to match the non popup
 * 				field.  Defect 5654.
 * 29/11/2006 - Chris Vincent, updated Status_SaveButton.onSuccess() so if the fee created on the same day as
 * 				the warrant was issued is deleted, the fee on the warrants table is set to 0.00.  UCT Defect 808
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 */
 
/**
 * XPath Constants
 * @author sz0sb5
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.NEWAMOUNTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NewAmountData";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.DEFAULTCURRENCY_XPATH = XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol";
XPathConstants.DATA_XPATH = "/ds/MaintainWarrantAmounts";
XPathConstants.DATA_CHANGED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DataChanged";
XPathConstants.SELECTEDAMOUNT_XPATH = XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant[./SurrogateId = /ds/var/page/SelectedGridRow/WarrantAmount]";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='WARRANT_FEE']/ItemValue";

/**
 * Amount Type Constants
 * @author sz0sb5
 * 
 */
function AmountTypes() {};
AmountTypes.AMOUNTTYPE_FEE = "FEE";
AmountTypes.AMOUNTTYPE_REFUND = "REFUND";

/**
 * Amount Status Constants
 * @author sz0sb5
 * 
 */
function AmountStatuses() {};
AmountStatuses.STATUS_NEW = "NEW";
AmountStatuses.STATUS_UPNEW = "UPNEW";
AmountStatuses.STATUS_UPDATED = "UPDATED";
 
/****************************** MAIN FORM *****************************************/

function maintainWarrantRefundsFees() {};

/**
 * @author sz0sb5
 * 
 */
maintainWarrantRefundsFees.initialise = function()
{
	retrieveWarrantData();
}

/**
 * @param resultDom
 * @param serviceName
 * @author sz0sb5
 * 
 */
maintainWarrantRefundsFees.onSuccess = function(resultDom, serviceName)
{
	if ( serviceName == "getWarrantSummary" )
	{
		var dataNode = resultDom.selectSingleNode("/ds/Warrant");
		if ( null != dataNode )
		{
			Services.replaceNode(XPathConstants.DATA_XPATH + "/Warrant", dataNode);
		}
		
		// Call amounts service
		var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
		var issCourtCode = Services.getValue(Header_CourtCode.dataBinding);
		var warrantID = Services.getValue(MaintainWarrantAmountParams.WARRANT_ID);
		var params = new ServiceParams();
		params.addSimpleParameter("WarrantId", warrantID);
		params.addSimpleParameter("ProcessNumber", warrantNumber);
		params.addSimpleParameter("ProcessType", "W");
		params.addSimpleParameter("IssuingCourtCode", issCourtCode);
		Services.callService("getAmountDetailsLock", params, maintainWarrantRefundsFees, true);
	}
	else if ( serviceName == "getAmountDetailsLock" )
	{
		// Second service call to retrieve the warrant amounts
		var dataNode = resultDom.selectSingleNode("/ds/WarrantAmounts");
		if ( null != dataNode )
		{
			Services.replaceNode(XPathConstants.DATA_XPATH + "/WarrantAmounts", dataNode);
			Services.setValue( Header_TotalFees.dataBinding, calculateTotalFees() );
			Services.setValue(XPathConstants.DATA_CHANGED_XPATH, "false");
		}
		dataNode = resultDom.selectSingleNode("/ds/WarrantData");
		if ( null != dataNode )
		{
			Services.replaceNode("/ds/WarrantData", dataNode);
		}
	}
}

// Load the reference data from the xml into the model
maintainWarrantRefundsFees.refDataServices = [ 
	{ name:"AmountTypes",     dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getAmountTypeList",  serviceParams:[] },
	{ name:"SystemDate",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{ name:"SystemData",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData",      serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/********************************** POPUPS *****************************************/

function NewAmountPopup() {}

/**
 * @author sz0sb5
 * @return "Status_SaveButton"  
 */
NewAmountPopup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/********************************** GRIDS *****************************************/

function Master_WarrantAmountsGrid() {};
Master_WarrantAmountsGrid.tabIndex = 1;
Master_WarrantAmountsGrid.componentName = "Amounts Grid";
Master_WarrantAmountsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/WarrantAmount";
Master_WarrantAmountsGrid.srcData = XPathConstants.DATA_XPATH + "/WarrantAmounts";
Master_WarrantAmountsGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant/Deleted"];
Master_WarrantAmountsGrid.rowXPath = "Warrant[./Deleted != 'Y']";
Master_WarrantAmountsGrid.keyXPath = "SurrogateId";
Master_WarrantAmountsGrid.columns = [
	{xpath: "AllocationDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "AmountCurrency", sort: "disabled", transformToDisplay: transformCurrencyToDisplay },
	{xpath: "Amount", sort: "numerical", transformToDisplay: transformFeeForGrid },
	{xpath: "UserId"}
];

/*********************************************************************************/

function AmountPopup_NewAmountsGrid() {}
AmountPopup_NewAmountsGrid.componentName = "New Warrant Amounts Grid";
AmountPopup_NewAmountsGrid.tabIndex = 34;
AmountPopup_NewAmountsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/NewWarrantAmount";
AmountPopup_NewAmountsGrid.srcData = XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts";
AmountPopup_NewAmountsGrid.rowXPath = "Warrant";
AmountPopup_NewAmountsGrid.keyXPath = "SurrogateId";
AmountPopup_NewAmountsGrid.columns = [
	{xpath: "AllocationDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "AmountCurrency", sort: "disabled", transformToDisplay: transformCurrencyToDisplay },
	{xpath: "Amount", sort: "numerical", transformToDisplay: transformFeeForGrid },
	{xpath: "UserId"}
];

AmountPopup_NewAmountsGrid.isEnabled = function()
{
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant");
	return ( countNewAmounts == 0 ) ? false : true;
}

/***************************** DATA BINDINGS **************************************/

Header_WarrantNumber.dataBinding = XPathConstants.DATA_XPATH + "/Warrant/WarrantNumber";
Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/Warrant/CaseNumber";
Header_WarrantType.dataBinding = XPathConstants.DATA_XPATH + "/Warrant/WarrantType";
Header_CourtCode.dataBinding = XPathConstants.DATA_XPATH + "/Warrant/IssuedBy";
Header_CourtName.dataBinding = XPathConstants.DATA_XPATH + "/Warrant/IssuedByName";
Header_TotalFeesCurrency.dataBinding = XPathConstants.DATA_XPATH + "/TotalFeesCurrency";
Header_TotalFees.dataBinding = XPathConstants.DATA_XPATH + "/TotalFees";

AmountDetails_AmountCurrency.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/AmountCurrency";
AmountDetails_Amount.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/Amount";
AmountDetails_CreatedBy.dataBinding = XPathConstants.SELECTEDAMOUNT_XPATH + "/UserId";

AmountPopup_AmountType.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/AmountType";
AmountPopup_AmountCurrency.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/AmountCurrency";
AmountPopup_Amount.dataBinding = XPathConstants.NEWAMOUNTS_XPATH + "/Amount";

/********************************* FIELDS ******************************************/

function Header_WarrantNumber() {};
Header_WarrantNumber.tabIndex = -1;
Header_WarrantNumber.maxLength = 8;
Header_WarrantNumber.componentName = "Warrant Number";
Header_WarrantNumber.helpText = "The number allocated to the warrant";
Header_WarrantNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_CaseNumber() {};
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Number of the case on which this warrant exists";
Header_CaseNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_WarrantType() {};
Header_WarrantType.tabIndex = -1;
Header_WarrantType.componentName = "Type";
Header_WarrantType.helpText = "The type of the warrant";
Header_WarrantType.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_CourtCode() {};
Header_CourtCode.tabIndex = -1;
Header_CourtCode.componentName = "Issuing Court ID";
Header_CourtCode.helpText = "The court code of the court that issued the warrant";
Header_CourtCode.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_CourtName() {};
Header_CourtName.tabIndex = -1;
Header_CourtName.componentName = "Issuing Court Name";
Header_CourtName.helpText = "The court name of the court that issued the warrant";
Header_CourtName.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_TotalFeesCurrency() {};
Header_TotalFeesCurrency.tabIndex = -1;
Header_TotalFeesCurrency.maxLength = 3;
Header_TotalFeesCurrency.componentName = "Total Fees Currency";
Header_TotalFeesCurrency.helpText = "Currency of total fees paid for this warrant";
Header_TotalFeesCurrency.transformToDisplay = transformCurrencyToDisplay;
Header_TotalFeesCurrency.isReadOnly = function() { return true; }

/**********************************************************************************/

function Header_TotalFees() {};
Header_TotalFees.tabIndex = -1;
Header_TotalFees.maxLength = 10;
Header_TotalFees.componentName = "Total Fees";
Header_TotalFees.helpText = "Total fees paid for this warrant";
Header_TotalFees.transformToDisplay = transformFeeForGrid;
Header_TotalFees.isReadOnly = function() { return true; }

/**********************************************************************************/

function AmountDetails_AmountCurrency() {};
AmountDetails_AmountCurrency.retrieveOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_AmountCurrency.tabIndex = -1;
AmountDetails_AmountCurrency.maxLength = 3;
AmountDetails_AmountCurrency.componentName = "Amount Currency";
AmountDetails_AmountCurrency.helpText = "Currency of the additional warrant fee or warrant amount to be refunded";
AmountDetails_AmountCurrency.transformToDisplay = function(value)
{
	var currency = CaseManUtils.transformCurrencySymbolToDisplay(value, null, "");
	var amount = Services.getValue(AmountDetails_Amount.dataBinding);
	if ( currency == "" && !CaseManUtils.isBlank(amount) )
	{
		// Use default currency if amount has no currency and amount is not blank
		currency = Services.getValue(XPathConstants.DEFAULTCURRENCY_XPATH);
	}
	
	return currency
}
AmountDetails_AmountCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

AmountDetails_AmountCurrency.isReadOnly = function() { return true; }
AmountDetails_AmountCurrency.enableOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_AmountCurrency.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_WarrantAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

/**********************************************************************************/

function AmountDetails_Amount() {};
AmountDetails_Amount.tabIndex = 12;
AmountDetails_Amount.maxLength = 10;
AmountDetails_Amount.componentName = "Amount";
AmountDetails_Amount.helpText = "The additional warrant fee or warrant amount to be refunded";
AmountDetails_Amount.transformToDisplay = transformFeeForGrid;
AmountDetails_Amount.isMandatory = function() { return true; }
AmountDetails_Amount.retrieveOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_Amount.enableOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_Amount.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_WarrantAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

AmountDetails_Amount.readOnlyOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_Amount.isReadOnly = function()
{
	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/AllocationDate");
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

AmountDetails_Amount.validateOn = [Master_WarrantAmountsGrid.dataBinding, XPathConstants.SELECTEDAMOUNT_XPATH + "/Status"];
AmountDetails_Amount.validate = function()
{
	var ec = null;

	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/AllocationDate");
	dateCreated = CaseManUtils.createDate( dateCreated );
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	if ( CaseManUtils.compareDates(today, dateCreated) != 0 )
	{
		// Do not perform validation if the amount has not been created today
		return ec;
	}

	var amount = Services.getValue(AmountDetails_Amount.dataBinding);
	var total = parseFloat( calculateTotalFees() );
	var maxFee = parseFloat( Services.getValue(XPathConstants.MAX_FEE_XPATH) );
	
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
		else if ( null == ec && ( amount > 0 && total > maxFee ) )
		{
			// Amount has been updated and the total now exceeds the maximum amount
			var currentStatus = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status");
			if ( currentStatus == AmountStatuses.STATUS_UPNEW || currentStatus == AmountStatuses.STATUS_UPDATED )
			{
				var amountCurrency = Services.getValue(AmountDetails_AmountCurrency.dataBinding);
				var currencySymbol = transformCurrencyToDisplay(amountCurrency);
				ec = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg");
				ec.m_message = ec.getMessage().replace(/XXX/, currencySymbol + parseFloat(maxFee).toFixed(2));
			}
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
	else
	{
		Services.setValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/Status", AmountStatuses.STATUS_UPNEW);
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
	
	// Update the Created By field with current user name
	Services.setValue(AmountDetails_CreatedBy.dataBinding, Services.getCurrentUser() );
}

/**********************************************************************************/

function AmountDetails_CreatedBy() {};
AmountDetails_CreatedBy.tabIndex = -1;
AmountDetails_CreatedBy.maxLength = 30;
AmountDetails_CreatedBy.componentName = "Created By";
AmountDetails_CreatedBy.helpText = "Username that created the additional fee or refund";
AmountDetails_CreatedBy.isReadOnly = function() { return true; }
AmountDetails_CreatedBy.retrieveOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_CreatedBy.enableOn = [Master_WarrantAmountsGrid.dataBinding];
AmountDetails_CreatedBy.isEnabled = function()
{
	// Disabled if the amounts grid is empty
	var gridDB = Services.getValue(Master_WarrantAmountsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

/*********************************************************************************/

function AmountPopup_AmountType() {}
AmountPopup_AmountType.isTemporary = function() { return true; }
AmountPopup_AmountType.srcData = XPathConstants.REF_DATA_XPATH + "/AmountTypes";
AmountPopup_AmountType.rowXPath = "/AmountType";
AmountPopup_AmountType.keyXPath = "/Value";
AmountPopup_AmountType.displayXPath = "/Value";
AmountPopup_AmountType.tabIndex = 30;
AmountPopup_AmountType.helpText = "Refund or Fee";

AmountPopup_AmountType.enableOn = [Master_WarrantAmountsGrid.dataBinding, AmountPopup_NewAmountsGrid.dataBinding];
AmountPopup_AmountType.isEnabled = function()
{
	var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
	var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
	
	if ( ( newFeeExists || feeCreatedToday() ) && ( newRefundExists || refundCreatedToday() ) )
	{
		// In one way or another, a new fee and a new refund have been created today, prevent
		// further additions.
		return false;
	}
	return true;
}

AmountPopup_AmountType.isMandatory = function()
{
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
			var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
			if ( newFeeExists || feeCreatedToday() )
			{
				// A new fee has already been created today
				ec = ErrorCode.getErrorCode("CaseMan_feeAlreadyAdded_Msg");
			}
		}
		else if ( type == AmountTypes.AMOUNTTYPE_REFUND )
		{
			var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
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
AmountPopup_AmountCurrency.helpText = "Currency of the additional warrant fee or warrant amount to be refunded";
AmountPopup_AmountCurrency.isTemporary = function() { return true; }
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
AmountPopup_AmountCurrency.isMandatory = function() { return true; }
AmountPopup_AmountCurrency.isReadOnly = function() { return true; }
AmountPopup_AmountCurrency.transformToDisplay = function(value) 
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, null, "");
}

/*********************************************************************************/

function AmountPopup_Amount() {}
AmountPopup_Amount.tabIndex = 32;
AmountPopup_Amount.maxLength = 10;
AmountPopup_Amount.helpText = "The additional warrant fee or warrant amount to be refunded";
AmountPopup_Amount.isTemporary = function() { return true; }
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
AmountPopup_Amount.isMandatory = function() { return true; }
AmountPopup_Amount.validate = function()
{
	var ec = null;
	var amount = Services.getValue(AmountPopup_Amount.dataBinding);
	var total = parseFloat( calculateTotalFees() );
	var maxFee = parseFloat( Services.getValue(XPathConstants.MAX_FEE_XPATH) );
	
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
		else if ( null == ec && ( amount > 0 && ( total + amount ) > maxFee ) )
		{
			var amountCurrency = Services.getValue(AmountDetails_AmountCurrency.dataBinding);
			var currencySymbol = transformCurrencyToDisplay(amountCurrency);
			ec = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg");
			ec.m_message = ec.getMessage().replace(/XXX/, currencySymbol + parseFloat(maxFee).toFixed(2));
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

/******************************** BUTTONS *****************************************/

function Master_AddAmountButton() {};
Master_AddAmountButton.tabIndex = 2;

Master_AddAmountButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "maintainWarrantRefundsFees" } ]
	}
};

Master_AddAmountButton.enableOn = [XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant", XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant/Deleted"];
Master_AddAmountButton.isEnabled = function()
{
	if ( feeCreatedToday() && refundCreatedToday() )
	{
		return false;
	}
	return true;
}

/**
 * @author sz0sb5
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

function Master_RemoveAmountButton() {};
Master_RemoveAmountButton.tabIndex = 3;

Master_RemoveAmountButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainWarrantRefundsFees", alt: true } ]
	}
};

Master_RemoveAmountButton.enableOn = [Master_WarrantAmountsGrid.dataBinding];
Master_RemoveAmountButton.isEnabled = function()
{
	var gridDB = Services.getValue(Master_WarrantAmountsGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		// Disabled if the amounts grid is empty
		return false;
	}
	
	var dateCreated = Services.getValue(XPathConstants.SELECTEDAMOUNT_XPATH + "/AllocationDate");
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
 * @author sz0sb5
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
		if ( currentStatus == AmountStatuses.STATUS_NEW || currentStatus == AmountStatuses.STATUS_UPNEW )
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

function Status_SaveButton() {};
Status_SaveButton.tabIndex = 20;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainWarrantRefundsFees" } ]
	}
};

/**
 * @author sz0sb5
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	if ( isDataDirty() )
	{
		// Validate the form
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if (0 != invalidFields.length)
		{
			return;
		}
		else
		{
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			var warrantId = Services.getValue(MaintainWarrantAmountParams.WARRANT_ID);
			var issCourtCode = Services.getValue(Header_CourtCode.dataBinding);
			Services.setValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/CaseNumber", caseNumber);
			Services.setValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/WarrantID", warrantId);
			Services.setValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/UserId", Services.getCurrentUser());
			Services.setValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/IssuingCourtCode", issCourtCode);
			
			var dataNode = XML.createDOM(null, null, null);
			var dsNode = XML.createElement(dataNode, "ds");
			dsNode.appendChild( Services.getNode(Master_WarrantAmountsGrid.srcData) );
			dsNode.appendChild( Services.getNode("/ds/WarrantData") );
			dataNode.appendChild( dsNode );
			var params = new ServiceParams();
			params.addDOMParameter("WarrantAmounts", dataNode);
			Services.callService("updateAmountDetailsLock", params, Status_SaveButton, true);
		}
	}
}

/**
 * @param dom
 * @param serviceName
 * @author sz0sb5
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "updateAmountDetailsLock" )
	{
		var updatedWarrantFee = "";
		var issueDate = Services.getValue(XPathConstants.DATA_XPATH + "/Warrant/IssueDate");
		if ( Services.exists(Master_WarrantAmountsGrid.srcData + "/Warrant[./DateCreated='" + issueDate + "' and ./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']") )
		{
	    	// If initial warrant fee exists in Amounts grid (i.e. FEES_PAID table), update WARRANTS table
	    	var updatedWarrantFee = Services.getValue(Master_WarrantAmountsGrid.srcData + "/Warrant[./DateCreated='" + issueDate + "' and ./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "' and ./Deleted = 'N']/Amount");
	    	if ( CaseManUtils.isBlank(updatedWarrantFee) )
	    	{
	    		// UCT Defect 808 - Fee exists on same day warrant was created but has been removed.  
	    		// Set the warrant fee to 0.00
	    		updatedWarrantFee = "0.00";
	    	}
		}
	  	Services.setValue(XPathConstants.DATA_XPATH + "/Warrant/WarrantFee", updatedWarrantFee);

		var dataNode = XML.createDOM(null, null, null);
		var dsNode = XML.createElement(dataNode, "ds");
		var amountsNode = XML.createElement(dataNode, "WarrantAmounts");
		amountsNode.appendChild( Services.getNode(XPathConstants.DATA_XPATH + "/Warrant") );
		dsNode.appendChild(amountsNode);
		dataNode.appendChild( dsNode );
		var params = new ServiceParams();
		params.addDOMParameter("WarrantFeeDetails", dataNode);
		Services.callService("updateWarrantFee", params, Status_SaveButton, true);
	}
	else
	{
		// Exit the screen
		exitScreen();
	}
}

/**
 * @param exception
 * @author sz0sb5
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		retrieveWarrantData();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author sz0sb5
 * 
 */
Status_SaveButton.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 21;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainWarrantRefundsFees" } ]
	}
};
/**
 * @author sz0sb5
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
}

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
 * @author sz0sb5
 * 
 */
AmountPopup_AddButton.actionBinding = function()
{
	var newAmount = Services.loadDOMFromURL("NewWarrantAmount.xml");
	newAmount.selectSingleNode("/Warrant/SurrogateId").appendChild( newAmount.createTextNode( generateNextSurrogateId() ) );
	newAmount.selectSingleNode("/Warrant/AllocationDate").appendChild( newAmount.createTextNode( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ) );
	newAmount.selectSingleNode("/Warrant/DateCreated").appendChild( newAmount.createTextNode( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ) );
	newAmount.selectSingleNode("/Warrant/Type").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_AmountType.dataBinding) ) ) );
	newAmount.selectSingleNode("/Warrant/AmountCurrency").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_AmountCurrency.dataBinding) ) ) );
	newAmount.selectSingleNode("/Warrant/Amount").appendChild( newAmount.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AmountPopup_Amount.dataBinding) ) ) );
	newAmount.selectSingleNode("/Warrant/UserId").appendChild( newAmount.createTextNode( Services.getCurrentUser() ) );
	newAmount.selectSingleNode("/Warrant/Status").appendChild( newAmount.createTextNode( AmountStatuses.STATUS_NEW ) );
	newAmount.selectSingleNode("/Warrant/ProcessNumber").appendChild( newAmount.createTextNode( Services.getValue(Header_WarrantNumber.dataBinding) ) );
	newAmount.selectSingleNode("/Warrant/ProcessType").appendChild( newAmount.createTextNode( "W" ) );
	newAmount.selectSingleNode("/Warrant/Deleted").appendChild( newAmount.createTextNode( "N" ) );
	newAmount.selectSingleNode("/Warrant/IssuingCourtCode").appendChild( newAmount.createTextNode( Services.getValue(Header_CourtCode.dataBinding) ) );
	Services.addNode(newAmount, AmountPopup_NewAmountsGrid.srcData);

	// Reset default value for amount type
	var newFeeExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_FEE + "']");
	var newRefundExists = Services.exists(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[./Type = '" + AmountTypes.AMOUNTTYPE_REFUND + "']");
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
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant");
	return ( countNewAmounts == 0 ) ? false : true;
}

/**
 * @author sz0sb5
 * 
 */
AmountPopup_OkButton.actionBinding = function()
{
	Services.dispatchEvent("NewAmountPopup", BusinessLifeCycleEvents.EVENT_LOWER);

	// Add all new amounts to the main grid	
	Services.startTransaction();
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant");
	for (var i=0; i<countNewAmounts; i++)
	{
		var newNode = Services.getNode(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[" + (i+1) + "]");
		Services.addNode(newNode, Master_WarrantAmountsGrid.srcData);
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
 * @author sz0sb5
 * 
 */
AmountPopup_CancelButton.actionBinding = function()
{
	Services.dispatchEvent("NewAmountPopup", BusinessLifeCycleEvents.EVENT_LOWER);
	
	// Clear the temporary add amount node
	Services.removeNode(XPathConstants.NEWAMOUNTS_XPATH);
};
