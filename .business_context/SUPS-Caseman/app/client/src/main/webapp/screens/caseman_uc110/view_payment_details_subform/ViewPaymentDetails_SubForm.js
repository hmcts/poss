/** 
 * @fileoverview ViewPaymentDetails_SubForm.js:
 * This file contains the configurations for the View Payment Details Subform
 *
 * @author Chris Vincent, Tim Connor
 * 
 * 04/12/2006 - Chris Vincent, fixed defect 5884 by displaying a blank Amount to Payee if the
 * 				the payment is referred to drawer.
 */

/************************** FORM CONFIGURATIONS *************************************/

function viewPaymentDetailsSubform() {}

/**
 * @author rzxd7g
 * 
 */
viewPaymentDetailsSubform.initialise = function()
{
    // Check to see if the details of this payment have been retrieved yet.  If they have not, retrieve them.
    if( CaseManUtils.isBlank( Services.getValue(XPathConstants.PAYMENT_XPATH + "/FULL_DETAILS") ) ) 
    {
	    var transactionNumber = Services.getValue(XPathConstants.PAYMENT_XPATH + "/TransactionNumber");
    	var adminCourtCode = Services.getValue(XPathConstants.PAYMENT_XPATH + "/AdminCourt");
    
    	// Retrieve the details of the currently selected payment
    	var params = new ServiceParams();
    	params.addSimpleParameter("transactionNumber", transactionNumber);
    	params.addSimpleParameter("courtCode", adminCourtCode);
    	Services.callService("getPayment", params, viewPaymentDetailsSubform, true);        	    		        
    }
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
viewPaymentDetailsSubform.onSuccess = function(dom) 
{
    Services.startTransaction();
    
    var transactionNumber = Services.getValue(XPathConstants.PAYMENT_XPATH + "/TransactionNumber");
   	var adminCourtCode = Services.getValue(XPathConstants.PAYMENT_XPATH + "/AdminCourt");
   	var id = Services.getValue(XPathConstants.TRANSACTION_NO_XPATH);

    // Replace the payment record from the searchPayments call with the full payment details
    Services.replaceNode( XPathConstants.PAYMENT_XPATH, dom );
    
    Services.setValue(XPathConstants.PAYMENTS_XPATH + "/Payment[./TransactionNumber='" + transactionNumber + "' and ./AdminCourt='" + adminCourtCode + "']/Id", id);
    
    // Set an indicator in the payment record to show that the full details for this payment have been retrieved
    // so that they will not be retrieved again if the user views the same payment for a second time.
    Services.setValue(XPathConstants.PAYMENT_XPATH + "/FULL_DETAILS", "Y");
    Services.endTransaction();
    
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
viewPaymentDetailsSubform.onBusinessException = function(exception) {
	alert("Unable to load payment details.");
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
viewPaymentDetailsSubform.onSystemException = function(exception) {
    alert("Unable to load payment details.");
}

viewPaymentDetailsSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "viewPaymentDetailsSubform" } ],
					singleClicks: [ {element: "PaymentDetails_CloseButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/******************************* INPUT FIELDS **************************************/

function PaymentDetails_TransactionNumber() {};
PaymentDetails_TransactionNumber.tabIndex = -1;
PaymentDetails_TransactionNumber.helpText = "Payment transaction number";
PaymentDetails_TransactionNumber.dataBinding = XPathConstants.PAYMENT_XPATH + "/TransactionNumber";
PaymentDetails_TransactionNumber.isReadOnly = function() { return true; }
PaymentDetails_TransactionNumber.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_EnforcementNumber() {};
PaymentDetails_EnforcementNumber.tabIndex = -1;
PaymentDetails_EnforcementNumber.helpText = "Payment enforcement number";
PaymentDetails_EnforcementNumber.dataBinding = XPathConstants.PAYMENT_XPATH + "/EnforcementNumber";
PaymentDetails_EnforcementNumber.isReadOnly = function() { return true; }
PaymentDetails_EnforcementNumber.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_OwningCourtCode() {};
PaymentDetails_OwningCourtCode.tabIndex = -1;
PaymentDetails_OwningCourtCode.helpText = "Payment court code";
PaymentDetails_OwningCourtCode.dataBinding = XPathConstants.PAYMENT_XPATH + "/IssuingCourt";
PaymentDetails_OwningCourtCode.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_OwningCourtName() {};
PaymentDetails_OwningCourtName.tabIndex = -1;
PaymentDetails_OwningCourtName.helpText = "Payment court name";
PaymentDetails_OwningCourtName.dataBinding = XPathConstants.PAYMENT_XPATH + "/IssuingCourtName";
PaymentDetails_OwningCourtName.isReadOnly = function() { return true; }
PaymentDetails_OwningCourtName.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_PaymentType() {};
PaymentDetails_PaymentType.tabIndex = -1;
PaymentDetails_PaymentType.helpText = "Payment type";
PaymentDetails_PaymentType.dataBinding = XPathConstants.PAYMENT_XPATH + "/PaymentType";
PaymentDetails_PaymentType.isReadOnly = function() { return true; }
PaymentDetails_PaymentType.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Passthrough() {};
PaymentDetails_Passthrough.tabIndex = -1;
PaymentDetails_Passthrough.helpText = "Indicates whether the payment is a passthrough payment or not";
PaymentDetails_Passthrough.dataBinding = XPathConstants.PAYMENT_XPATH + "/Passthrough";
PaymentDetails_Passthrough.isReadOnly = function() { return true; }
PaymentDetails_Passthrough.modelValue = {checked: "Y", unchecked: "N"};

/***********************************************************************************/

function PaymentDetails_DateEntered() {};
PaymentDetails_DateEntered.tabIndex = -1;
PaymentDetails_DateEntered.helpText = "Date the payment was entered";
PaymentDetails_DateEntered.dataBinding = XPathConstants.PAYMENT_XPATH + "/PaymentDate";
PaymentDetails_DateEntered.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_EnforcementType() {};
PaymentDetails_EnforcementType.tabIndex = -1;
PaymentDetails_EnforcementType.helpText = "Payment enforcement type";
PaymentDetails_EnforcementType.dataBinding = XPathConstants.PAYMENT_XPATH + "/EnforcementType";
PaymentDetails_EnforcementType.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_RetentionType() {};
PaymentDetails_RetentionType.tabIndex = -1;
PaymentDetails_RetentionType.helpText = "Payment retention type";
PaymentDetails_RetentionType.dataBinding = XPathConstants.PAYMENT_XPATH + "/RetentionType";
PaymentDetails_RetentionType.isReadOnly = function() { return true; }
PaymentDetails_RetentionType.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Error() {};
PaymentDetails_Error.tabIndex = -1;
PaymentDetails_Error.helpText = "Indicates if the passthrough is in error";
PaymentDetails_Error.dataBinding = XPathConstants.PAYMENT_XPATH + "/Error";
PaymentDetails_Error.isReadOnly = function() { return true; }
PaymentDetails_Error.modelValue = {checked: "Y", unchecked: "N"};
PaymentDetails_Error.isEnabled = function()
{
	// Enabled if payment is a passthrough or error indicator is 'Y' else disabled
	var passthrough = Services.getValue(PaymentDetails_Passthrough.dataBinding);
	var errorInd = Services.getValue(PaymentDetails_Error.dataBinding);
	return ( passthrough == "Y" || errorInd == "Y" ) ? true : false;
}

/***********************************************************************************/

function PaymentDetails_AmountCurrency() {};
PaymentDetails_AmountCurrency.tabIndex = -1;
PaymentDetails_AmountCurrency.helpText = "Indicates the currency of the payment amount";
PaymentDetails_AmountCurrency.dataBinding = XPathConstants.PAYMENT_XPATH + "/AmountCurrency";
PaymentDetails_AmountCurrency.isReadOnly = function() { return true; }
PaymentDetails_AmountCurrency.transformToDisplay = transformCurrencyToDisplay;

/***********************************************************************************/

function PaymentDetails_Amount() {};
PaymentDetails_Amount.tabIndex = -1;
PaymentDetails_Amount.helpText = "The payment amount";
PaymentDetails_Amount.dataBinding = XPathConstants.PAYMENT_XPATH + "/Amount";
PaymentDetails_Amount.isReadOnly = function() { return true; }
PaymentDetails_Amount.transformToDisplay = transformAmountToDisplay;

/***********************************************************************************/

function PaymentDetails_RDDate() {};
PaymentDetails_RDDate.tabIndex = -1;
PaymentDetails_RDDate.helpText = "Date payment was Referred to Drawer";
PaymentDetails_RDDate.dataBinding = XPathConstants.PAYMENT_XPATH + "/RDDate";
PaymentDetails_RDDate.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_ReleaseDate() {};
PaymentDetails_ReleaseDate.tabIndex = -1;
PaymentDetails_ReleaseDate.helpText = "Payment release date";
PaymentDetails_ReleaseDate.dataBinding = XPathConstants.PAYMENT_XPATH + "/ReleaseDate";
PaymentDetails_ReleaseDate.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_PayoutDate() {};
PaymentDetails_PayoutDate.tabIndex = -1;
PaymentDetails_PayoutDate.helpText = "Payment payout date";
PaymentDetails_PayoutDate.dataBinding = XPathConstants.PAYMENT_XPATH + "/PayoutDate";
PaymentDetails_PayoutDate.isReadOnly = function() { return true; }

/***********************************************************************************/

function PaymentDetails_Notes() {};
PaymentDetails_Notes.tabIndex = -1;
PaymentDetails_Notes.helpText = "Payment notes";
PaymentDetails_Notes.dataBinding = XPathConstants.PAYMENT_XPATH + "/Notes";
PaymentDetails_Notes.isReadOnly = function() { return true; }
PaymentDetails_Notes.isEnabled = function() 
{ 
	var notes = Services.getValue(PaymentDetails_Notes.dataBinding);
	return displayNotes(notes);
}

PaymentDetails_Notes.transformToDisplay = function(value) 
{
    if ( displayNotes(value) )
    {
    	return toUpperCase(value);
    }
    return "";
}

/***********************************************************************************/

function PaymentDetails_PONumber1() {};
PaymentDetails_PONumber1.tabIndex = -1;
PaymentDetails_PONumber1.helpText = "First payable order number ";
PaymentDetails_PONumber1.dataBinding = XPathConstants.PAYMENT_XPATH + "/PONumber1";
PaymentDetails_PONumber1.isReadOnly = function() { return true; }
PaymentDetails_PONumber1.isEnabled = function() { return isPaymentValid(); }
PaymentDetails_PONumber1.transformToDisplay = function(value) 
{
    if( isPaymentValid() ) 
    {
        return value;
    }
    return "";
}

/***********************************************************************************/

function PaymentDetails_PONumber2() {};
PaymentDetails_PONumber2.tabIndex = -1;
PaymentDetails_PONumber2.helpText = "Second payable order number ";
PaymentDetails_PONumber2.dataBinding = XPathConstants.PAYMENT_XPATH + "/PONumber2";
PaymentDetails_PONumber2.isReadOnly = function() { return true; }
PaymentDetails_PONumber2.isEnabled = function() { return isPaymentValid(); }
PaymentDetails_PONumber2.transformToDisplay = function(value) 
{
    if( isPaymentValid() ) 
    {
        return value;
    }
    return "";
}

/***********************************************************************************/

function PaymentDetails_TotalPOCurrency() {};
PaymentDetails_TotalPOCurrency.tabIndex = -1;
PaymentDetails_TotalPOCurrency.helpText = "Indicates the currency of the total amount of payable orders";
PaymentDetails_TotalPOCurrency.dataBinding = XPathConstants.PAYMENT_XPATH + "/POTotalCurrency";
PaymentDetails_TotalPOCurrency.isReadOnly = function() { return true; }
PaymentDetails_TotalPOCurrency.transformToDisplay = transformCurrencyToDisplay;

/***********************************************************************************/

function PaymentDetails_TotalPO() {};
PaymentDetails_TotalPO.tabIndex = -1;
PaymentDetails_TotalPO.helpText = "Total of payable orders";
PaymentDetails_TotalPO.dataBinding = XPathConstants.PAYMENT_XPATH + "/POTotal";
PaymentDetails_TotalPO.isReadOnly = function() { return true; }
PaymentDetails_TotalPO.transformToDisplay = transformAmountToDisplay;

/***********************************************************************************/

function PaymentDetails_AmountToPayeeCurrency() {};
PaymentDetails_AmountToPayeeCurrency.tabIndex = -1;
PaymentDetails_AmountToPayeeCurrency.helpText = "Indicates the currency of the amount to pay out";
PaymentDetails_AmountToPayeeCurrency.dataBinding = XPathConstants.PAYMENT_XPATH + "/AmountCurrency";
PaymentDetails_AmountToPayeeCurrency.isReadOnly = function() { return true; }
PaymentDetails_AmountToPayeeCurrency.isEnabled = function() { return isPaymentValid(); }
PaymentDetails_AmountToPayeeCurrency.transformToDisplay = function(value) 
{
	// Defect 5884 - display blank Amount to Payee if payment is referred to drawer
	var rdDate = Services.getValue(PaymentDetails_RDDate.dataBinding);
    if( isPaymentValid() && CaseManUtils.isBlank(rdDate) ) 
    {
    	// Valid payment, not referred to drawer
        return transformCurrencyToDisplay(value);
    }
    return "";
}

/***********************************************************************************/

function PaymentDetails_AmountToPayee() {};
PaymentDetails_AmountToPayee.tabIndex = -1;
PaymentDetails_AmountToPayee.helpText = "Total to pay out";
PaymentDetails_AmountToPayee.dataBinding = XPathConstants.PAYMENT_XPATH + "/AmountNowDue";
PaymentDetails_AmountToPayee.isReadOnly = function() { return true; }
PaymentDetails_AmountToPayee.isEnabled = function() { return isPaymentValid(); }
PaymentDetails_AmountToPayee.transformToDisplay = function(value) 
{
	// Defect 5884 - display blank Amount to Payee if payment is referred to drawer
	var rdDate = Services.getValue(PaymentDetails_RDDate.dataBinding);
    if( isPaymentValid() && CaseManUtils.isBlank(rdDate) ) 
    {
    	// Valid payment, not referred to drawer
        return transformAmountToDisplay(value);
    }
    return "";
}

/***********************************************************************************/

function PaymentDetails_AmountToOverpayeeCurrency() {};
PaymentDetails_AmountToOverpayeeCurrency.tabIndex = -1;
PaymentDetails_AmountToOverpayeeCurrency.helpText = "Indicates the currency of the overpayment amount";
PaymentDetails_AmountToOverpayeeCurrency.dataBinding = XPathConstants.PAYMENT_XPATH + "/OverpaymentAmountCurrency";
PaymentDetails_AmountToOverpayeeCurrency.isReadOnly = function() { return true; }
PaymentDetails_AmountToOverpayeeCurrency.transformToDisplay = transformCurrencyToDisplay;

/***********************************************************************************/

function PaymentDetails_AmountToOverpayee() {};
PaymentDetails_AmountToOverpayee.tabIndex = -1;
PaymentDetails_AmountToOverpayee.helpText = "Amount of overpayment";
PaymentDetails_AmountToOverpayee.dataBinding = XPathConstants.PAYMENT_XPATH + "/OverpaymentAmount";
PaymentDetails_AmountToOverpayee.isReadOnly = function() { return true; }
PaymentDetails_AmountToOverpayee.transformToDisplay = transformAmountToDisplay;

/***********************************************************************************/

function PaymentDetails_Payee_Code() {};
PaymentDetails_Payee_Code.tabIndex = -1;
PaymentDetails_Payee_Code.helpText = "Payee code";
PaymentDetails_Payee_Code.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Code";
PaymentDetails_Payee_Code.isReadOnly = function() { return true; }
PaymentDetails_Payee_Code.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Code.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return value;
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Name() {};
PaymentDetails_Payee_Name.tabIndex = -1;
PaymentDetails_Payee_Name.helpText = "Payee name";
PaymentDetails_Payee_Name.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Name";
PaymentDetails_Payee_Name.isReadOnly = function() { return true; }
PaymentDetails_Payee_Name.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Name.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_Line1() {};
PaymentDetails_Payee_Address_Line1.tabIndex = -1;
PaymentDetails_Payee_Address_Line1.helpText = "First line of payee's address";
PaymentDetails_Payee_Address_Line1.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/Line[1]";
PaymentDetails_Payee_Address_Line1.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_Line1.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_Line1.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_Line2() {};
PaymentDetails_Payee_Address_Line2.tabIndex = -1;
PaymentDetails_Payee_Address_Line2.helpText = "Second line of payee's address";
PaymentDetails_Payee_Address_Line2.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/Line[2]";
PaymentDetails_Payee_Address_Line2.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_Line2.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_Line2.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_Line3() {};
PaymentDetails_Payee_Address_Line3.tabIndex = -1;
PaymentDetails_Payee_Address_Line3.helpText = "Third line of payee's address";
PaymentDetails_Payee_Address_Line3.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/Line[3]";
PaymentDetails_Payee_Address_Line3.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_Line3.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_Line3.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_Line4() {};
PaymentDetails_Payee_Address_Line4.tabIndex = -1;
PaymentDetails_Payee_Address_Line4.helpText = "Fourth line of payee's address";
PaymentDetails_Payee_Address_Line4.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/Line[4]";
PaymentDetails_Payee_Address_Line4.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_Line4.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_Line4.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_Line5() {};
PaymentDetails_Payee_Address_Line5.tabIndex = -1;
PaymentDetails_Payee_Address_Line5.helpText = "Fifth line of payee's address";
PaymentDetails_Payee_Address_Line5.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/Line[5]";
PaymentDetails_Payee_Address_Line5.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_Line5.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_Line5.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Payee_Address_PostCode() {};
PaymentDetails_Payee_Address_PostCode.tabIndex = -1;
PaymentDetails_Payee_Address_PostCode.helpText = "Payee's postal code";
PaymentDetails_Payee_Address_PostCode.dataBinding = XPathConstants.PAYMENT_XPATH + "/Payee/Address/PostCode";
PaymentDetails_Payee_Address_PostCode.isReadOnly = function() { return true; }
PaymentDetails_Payee_Address_PostCode.isEnabled = function() { return showPayeeDetails(); }
PaymentDetails_Payee_Address_PostCode.transformToDisplay = function(value) 
{
    if( showPayeeDetails() ) 
    {
        return toUpperCase(value);
    }
    return null;
}

/***********************************************************************************/

function PaymentDetails_Overpayee_Name() {};
PaymentDetails_Overpayee_Name.tabIndex = -1;
PaymentDetails_Overpayee_Name.helpText = "Overpayee name";
PaymentDetails_Overpayee_Name.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Name";
PaymentDetails_Overpayee_Name.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Name.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_Line1() {};
PaymentDetails_Overpayee_Address_Line1.tabIndex = -1;
PaymentDetails_Overpayee_Address_Line1.helpText = "First line of overpayee's address";
PaymentDetails_Overpayee_Address_Line1.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/Line[1]";
PaymentDetails_Overpayee_Address_Line1.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_Line1.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_Line2() {};
PaymentDetails_Overpayee_Address_Line2.tabIndex = -1;
PaymentDetails_Overpayee_Address_Line2.helpText = "Second line of overpayee's address";
PaymentDetails_Overpayee_Address_Line2.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/Line[2]";
PaymentDetails_Overpayee_Address_Line2.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_Line2.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_Line3() {};
PaymentDetails_Overpayee_Address_Line3.tabIndex = -1;
PaymentDetails_Overpayee_Address_Line3.helpText = "Third line of overpayee's address";
PaymentDetails_Overpayee_Address_Line3.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/Line[3]";
PaymentDetails_Overpayee_Address_Line3.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_Line3.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_Line4() {};
PaymentDetails_Overpayee_Address_Line4.tabIndex = -1;
PaymentDetails_Overpayee_Address_Line4.helpText = "Fouth line of overpayee's address";
PaymentDetails_Overpayee_Address_Line4.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/Line[4]";
PaymentDetails_Overpayee_Address_Line4.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_Line4.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_Line5() {};
PaymentDetails_Overpayee_Address_Line5.tabIndex = -1;
PaymentDetails_Overpayee_Address_Line5.helpText = "Fifth line of overpayee's address";
PaymentDetails_Overpayee_Address_Line5.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/Line[5]";
PaymentDetails_Overpayee_Address_Line5.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_Line5.transformToDisplay = toUpperCase;

/***********************************************************************************/

function PaymentDetails_Overpayee_Address_PostCode() {};
PaymentDetails_Overpayee_Address_PostCode.tabIndex = -1;
PaymentDetails_Overpayee_Address_PostCode.helpText = "Overpayee's postal code";
PaymentDetails_Overpayee_Address_PostCode.dataBinding = XPathConstants.PAYMENT_XPATH + "/Overpayee/Address/PostCode";
PaymentDetails_Overpayee_Address_PostCode.isReadOnly = function() { return true; }
PaymentDetails_Overpayee_Address_PostCode.transformToDisplay = toUpperCase;

/****************************** BUTTON FIELDS **************************************/

function PaymentDetails_CloseButton() {};
PaymentDetails_CloseButton.tabIndex = 1;
