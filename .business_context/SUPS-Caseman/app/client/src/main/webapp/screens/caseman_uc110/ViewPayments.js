/** 
 * @fileoverview ViewPayments.js:
 * This file contains the form and field configurations for the UC110 - View Payments 
 * screen.
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 05/06/2006 - Chris Vincent, changed global variables to static variables.
 */

/****************************** MAIN FORM *****************************************/

function ViewPayments() {};

/**
 * @author fzj0yl
 * 
 */
ViewPayments.initialise = function()
{
    // Retrieve the parameters from the calling screen
	var enforcementNumber = Services.getValue(ViewPaymentsParams.ENFORCEMENT_NUMBER);
	var enforcementType = Services.getValue(ViewPaymentsParams.ENFORCEMENT_TYPE);
	var issuingCourt = Services.getValue(ViewPaymentsParams.ISSUING_COURT);
	var currentlyOwnedByCourt = Services.getValue(ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT);
	
	if ( !CaseManUtils.isBlank(enforcementNumber) && !CaseManUtils.isBlank(enforcementType) )
	{
		// Set the parameters needed by either the relevant searchPayments or getEnforcement service
	    var params = new ServiceParams();
	    params.addSimpleParameter("courtCode", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
	    params.addSimpleParameter("enforcementNumber", enforcementNumber);
	    params.addSimpleParameter("enforcementType", enforcementType);
	    
	    var searchPaymentsService = null;
	    switch ( enforcementType )
	    {
	    	case ViewPaymentsParamsConstants.HOMEWARRANT:
	    		// Issuing court required by getEnforcement and searchHomeWarrantPayments
		    	params.addSimpleParameter("issuingCourt", issuingCourt);
		    	searchPaymentsService = "searchHomeWarrantPayments"
	    		break;
	    	case ViewPaymentsParamsConstants.FOREIGNWARRANT:
		    	// Issuing court required by getEnforcement and Currently Owned by is required by searchForeignWarrantPayments
		    	params.addSimpleParameter("issuingCourt", issuingCourt);
		    	params.addSimpleParameter("currentlyOwnedBy", currentlyOwnedByCourt);
		    	params.addSimpleParameter("owningCourt", currentlyOwnedByCourt);
		    	searchPaymentsService = "searchForeignWarrantPayments"
	    		break;
	    	case ViewPaymentsParamsConstants.CASE:
	    		// Case enforcement type requires a specific searchCasePayments service
	    		searchPaymentsService = "searchCasePayments"
	    		break;
	    	default:
	    		// AE and CO Enforcement Type use the normal searchPayments service
	    		searchPaymentsService = "searchPayments";
	    }
	    
	    // Retrieve the details of the enforcement
	    Services.callService("getEnforcement", params, ViewPayments, true);
		
		// Retrieve the details of the payments for the enforcement
		Services.callService(searchPaymentsService, params, ViewPayments, true);
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * @return null 
 */
ViewPayments.onSuccess = function(dom, serviceName) 
{
    switch (serviceName)
    {
    	case "getEnforcement" :
			if ( null == dom.selectSingleNode("/Enforcement") )
			{
				// No enforcement details have been returned
				return;
			}

			// Set the enforcement data
			Services.replaceNode(XPathConstants.ENFORCEMENT_XPATH, dom);
    	    break;

        default:
            // Set up the list of payments
            Services.replaceNode(XPathConstants.PAYMENTS_XPATH, dom);
            break;
    }
}

ViewPayments.refDataServices = [
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] }
];

/********************************* SUBFORMS ***************************************/

function viewPaymentDetails_subform() {};
viewPaymentDetails_subform.subformName = "ViewPaymentDetailsSubform";
viewPaymentDetails_subform.raise = {
	eventBinding: {
		doubleClicks: [ {element: "Master_PaymentsGrid"} ],
		singleClicks: [ {element: "Master_ViewPaymentDetailsButton"} ]
	}
}

/********************************** GRIDS *****************************************/

function Header_PartyTypeGrid() {};
Header_PartyTypeGrid.tabIndex = -1;
Header_PartyTypeGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Header_PartyTypeGrid.srcData = XPathConstants.PARTIES_XPATH;
Header_PartyTypeGrid.rowXPath = "Party";
Header_PartyTypeGrid.keyXPath = "Name";
Header_PartyTypeGrid.columns = [
	{xpath: "Role"},
	{xpath: "Number", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

/***********************************************************************************/

function Master_PaymentsGrid() {};
Master_PaymentsGrid.tabIndex = 1;
Master_PaymentsGrid.dataBinding = XPathConstants.TRANSACTION_NO_XPATH;
Master_PaymentsGrid.srcData = XPathConstants.PAYMENTS_XPATH;
Master_PaymentsGrid.rowXPath = "Payment";
Master_PaymentsGrid.keyXPath = "Id";
Master_PaymentsGrid.columns = [
	{xpath: "EnforcementNumber"},
	{xpath: "EnforcementType"},
	{xpath: "TransactionNumber", sort: "numerical" },
	{xpath: "PaymentDate", sort: CaseManUtils.sortGridDatesDsc, additionalSortColumns: [ { columnNumber: 2, orderOnAsc: "descending", orderOnDesc: "ascending" } ], defaultSort:"true", transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Amount", transformToDisplay: transformAmountToDisplay},
	{xpath: "PaymentType"},
	{xpath: "RetentionType"},
	{xpath: "Id", transformToDisplay: getPaidInBy },
	{xpath: "Error", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; } }
];

/**
 * For payments that are in error, display the grid row in a particular colour
 * @param rowId
 * @author fzj0yl
 * @return classList  
 */
Master_PaymentsGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
      	var error = Services.getValue(XPathConstants.PAYMENTS_XPATH + "/Payment[./Id=" + rowId + "]/Error");
      	if( error == "Y" )
      	{
          	classList = "errorClass";
      	}
	}
    return classList;
}

/********************************* FIELDS ******************************************/

function Header_EnforcementNumber() {};
Header_EnforcementNumber.dataBinding = XPathConstants.ENFORCEMENT_XPATH + "/Number";
Header_EnforcementNumber.transformToDisplay = toUpperCase;
Header_EnforcementNumber.isReadOnly = function() { return true; }
Header_EnforcementNumber.helpText = "Enforcement number (case number, AE number, AO/CAEO number, home or foreign warrant number).";
Header_EnforcementNumber.tabIndex = -1;

/***********************************************************************************/

function Header_EnforcementType() {};
Header_EnforcementType.dataBinding = XPathConstants.ENFORCEMENT_XPATH + "/Type";
Header_EnforcementType.isReadOnly = function() { return true; }
Header_EnforcementType.helpText = "Enforcement type (CASE, AE, CO, HOME WARRANT or FOREIGN WARRANT)";
Header_EnforcementType.tabIndex = -1;

/***********************************************************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.dataBinding = XPathConstants.ENFORCEMENT_XPATH + "/CourtCode";
Header_OwningCourtCode.isReadOnly = function() { return true; }
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.tabIndex = -1;

/***********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.dataBinding = XPathConstants.ENFORCEMENT_XPATH + "/CourtName";
Header_OwningCourtName.transformToDisplay = toUpperCase;
Header_OwningCourtName.isReadOnly = function() { return true; }
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.tabIndex = -1;

/******************************** BUTTONS *****************************************/

function Master_ViewPaymentDetailsButton() {};
Master_ViewPaymentDetailsButton.tabIndex = 2;
Master_ViewPaymentDetailsButton.enableOn = [Master_PaymentsGrid.dataBinding];
Master_ViewPaymentDetailsButton.isEnabled = function() 
{
    // Only enable the button if a payment is selected
    var transactionNo = Services.getValue(Master_PaymentsGrid.dataBinding);
    return ( CaseManUtils.isBlank(transactionNo) ) ? false : true;
}

/***********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 10;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ViewPayments" } ]
	}
};
