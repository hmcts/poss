/** 
 * @fileoverview NAVIGATION CONTROLLER API - Helper class which implements utility 
 * The Navigation Controller is used as a generic JavaScript class to create a call
 * stack in a reserved section of the DOM and interrogate it accordingly to make it
 * easy for screens to navigate from one to the other.
 *
 * @author Chris Vincent
 * @version 1.0 
 */

/**
 * @constructor
 * @author rzxd7g
 * 
 */
function NavigationController() {};

/**
 * Constant defining the root XPath used by the Navigation Controller
 */
NavigationController.NAVIGATION_XPATH = "/ds/var/app/Navigation";

/**
 * Constant defining the XPath of the Navigation Call Stack
 */
NavigationController.STACK_XPATH = NavigationController.NAVIGATION_XPATH + "/Stack";

/**
 * Constant defining the XPath of the Navigation Stack Index
 */
NavigationController.STACKINDEX_XPATH = NavigationController.NAVIGATION_XPATH + "/StackIndex";

/**
 * Constant holding the form name of the Main Screen
 */
NavigationController.MAIN_MENU = "MainMenu";

/**
 * Constant holding the form name of the Query By Party (Case) Screen
 */
NavigationController.QUERYBYPARTYCASE_FORM = "QueryByPartyCase";

/**
 * Constant holding the form name of the Query By Party (AE) Screen
 */
NavigationController.QUERYBYPARTYAE_FORM = "QueryByPartyAE";

/**
 * Constant holding the form name of the Query By Party (CO) Screen
 */
NavigationController.QUERYBYPARTYCO_FORM = "QueryByPartyCO";

/**
 * Constant holding the form name of the Query By Party (Warrant) Screen
 */
NavigationController.QUERYBYPARTYWARRANT_FORM = "QueryByPartyWarrant";

/**
 * Constant holding the form name of the Run Order Printing Screen
 */
NavigationController.RUNORDERPRINTING_FORM = "RunOrderPrinting";

/**
 * Constant holding the form name of the Manage Events Screen
 */
NavigationController.EVENTS_FORM = "ManageEvents";

/**
 * Constant holding the form name of the Create & Update Case Details Screen
 */
NavigationController.CASES_FORM = "CreateUpdateCase";

/**
 * Constant holding the form name of the Create & Update Hearing Screen
 */
NavigationController.HEARING_FORM = "CreateUpdateHearing";

/**
 * Constant holding the form name of the Maintain Hearing CO Screen
 */
NavigationController.HEARINGCO_FORM = "HearingCO";

/**
 * Constant holding the form name of the Window For Trial Screen
 */
NavigationController.WFT_FORM = "WindowForTrial";

/**
 * Constant holding the indicator that the user must navigate to Word Processing
 */
NavigationController.WP_FORM = "WordProcessing";

/**
 * Constant holding the indicator that the user must navigate to Oracle Report Parameter Form
 */
NavigationController.OR_FORM = "OracleReport";

/**
 * Constant holding the form name of the Maintain Obligations Screen
 */
NavigationController.OBLIGATIONS_FORM = "MaintainObligations";

/**
 * Constant holding the form name of the Maintain Judgment Screen
 */
NavigationController.JUDGMENT_FORM = "MaintainJudgment";

/**
 * Constant holding the form name of the Bar/Unbar Judgment Screen
 */
NavigationController.BARJUDGMENT_FORM = "BarUnbarJudgment";

/**
 * Constant holding the form name of the DMS Report Screen
 */
NavigationController.DMSREPORT_FORM = "Display DMS Daily Report";

/**
 * Constant holding the form name of the Warrant Maintenance Screen
 */
NavigationController.WARRANT_FORM = "MaintainWarrants";

/**
 * Constant holding the form name of the Create Home Warrants Screen
 */
NavigationController.HOME_WARRANT_FORM = "CreateHomeWarrants";

/**
 * Constant holding the form name of the Re-issue Warrant Screen
 */
NavigationController.REISSUE_WARRANT_FORM = "ReissueWarrants";

/**
 * Constant holding the form name of the Warrant Refunds/Fees Screen
 */
NavigationController.WARRANT_REFUNDS_FEES_FORM = "MaintainWarrantRefundsFees";

/**
 * Constant holding the form name of the Warrant Returns Screen
 */
NavigationController.WARRANT_RETURNS_FORM = "MaintainWarrantReturns";

/**
 * Constant holding the form name of the Transfer Case Screen
 */
NavigationController.TRANSFER_CASE_FORM = "TransferCase";

/**
 * Constant holding the form name of the Human Rights Act Screen
 */
NavigationController.HUMAN_RIGHTS_FORM = "HumanRightsAct";

/**
 * Constant holding the form name of the Create Payment Screen
 */
NavigationController.CREATE_POSTAL_PAYMENT_FORM = "CreatePostalPayment";
NavigationController.CREATE_BAILIFF_PAYMENT_FORM = "CreateBailiffPayment";
NavigationController.CREATE_COUNTER_PAYMENT_FORM = "CreateCounterPayment";
NavigationController.CREATE_UPDATE_PASSTHROUGH_FORM = "CreateUpdatePassthrough";

/**
 * Constant holding the form name of the Maintain Payments Screen
 */
NavigationController.MAINTAIN_PAYMENT_FORM = "MaintainPayment";

/**
 * Constant holding the form name of the Resolve Overpayments Screen
 */
NavigationController.RESOLVE_OVERPAYMENTS_FORM = "ResolveOverpayments";

/**
 * Constant holding the form name of the Record Adhoc Payout Screen
 */
NavigationController.RECORD_ADHOC_PAYOUT_FORM = "AdhocPayouts";

/**
 * Constant holding the form name of the Manage AE Screen
 */
NavigationController.MANAGE_AE_FORM = "ManageAE";

/**
 * Constant holding the form name of the AE Events Screen
 */
NavigationController.AE_EVENTS_FORM = "ManageAEEvents";

/**
 * Constant holding the form name of the AE Amounts Screen
 */
NavigationController.AE_AMOUNTS_FORM = "MaintainAEAmounts";

/**
 * Constant holding the form name of the AE PER Calculator Screen
 */
NavigationController.AE_PER_FORM = "AECalculatePER";

/**
 * Constant holding the form name of the CO Events Screen
 */
NavigationController.CO_EVENTS_FORM = "ManageCOEvents";

/**
 * Constant holding the form name of the Create/Maintain CO Screen
 */
NavigationController.MAINTAINCO_FORM = "MaintainCO";

/**
 * Constant holding the form name of the Create/Maintain Debt Screen
 */
NavigationController.MAINTAINDEBT_FORM = "MaintainDebt";

/**
 * Constant holding the form name of the CO PER Calculator Screen
 */
NavigationController.CO_PER_FORM = "COCalculatePER";

/**
 * Constant holding the form name of the Determination of Means Calculator Screen
 */
NavigationController.DOM_CALC_FORM = "DeterminationOfMeans";

/**
 * Constant holding the form name of the View Payments Screen
 */
NavigationController.VIEW_PAYMENTS_FORM = "ViewPayments";

/**
 * Constant holding the form name of the View Dividends Screen
 */
NavigationController.VIEW_DIVIDENDS_FORM = "ViewCODividends";

/**
 * Constant holding the form name of the Suitors' Cash Start Of Day Screen
 */
NavigationController.SUITORS_STARTOFDAY_FORM = "SuitorsCashStartOfDay";

/**
 * Constant holding the form name of the UC075 Run Dividend Declaration Screen
 */
NavigationController.RUN_DIVIDEND_DECLARATION_FORM = "RunDividendDeclaration";

/**
 * Constant holding the form name of the UC074 Print Payout Reports Screen
 */
NavigationController.PRINT_PAYOUT_REPORTS_FORM = "PrintPayoutReports";


/**
 * Checks if an active call stack exists
 *
 * @returns True if an active call stack exists
 * @author rzxd7g
 */
NavigationController.callStackExists = function()
{
	if (Services.exists(NavigationController.STACK_XPATH))
	{
		// Check call stack is valid
		var index = NavigationController._getCurrentIndex();
		var size = NavigationController._getStackSize();
		return index <= size;
	}
	return false;
}


/**
 * Creates a new call stack using the array of forms passed in.  The order of
 * the screens is important and unless the screen does not intend to return to
 * the initial screen, the initial calling form should be the last array item.
 *
 * @param {Array} formArray The array of forms in the order of navigation
 * @param {Boolean} cleanStack If set to true, will create a new stack afresh else will addToStack if exists
 * @returns True if the call stack was successfully created, else false.
 * @author rzxd7g
 */
NavigationController.createCallStack = function(formArray, cleanStack)
{
	var l = formArray.length;
	if ( formArray == null || l == 0 )
	{
		return false;	
	}
	
	if ( NavigationController.callStackExists() && cleanStack != true )
	{
		NavigationController.addToStack(formArray);
	}
	else
	{
		NavigationController.resetCallStack();
		for (var i=0; i<l; i++)
		{
			Services.setValue(NavigationController.STACK_XPATH + "/Form[" + i+1 + "]", formArray[i]);
		}
		Services.setValue(NavigationController.STACKINDEX_XPATH, 1);
	}
	return true;
}


/**
 * Amends a call stack by adding some more forms to the stack i.e. allows the
 * user to branch off and still return to the correct screen.
 *
 * @param {Array} formArray The branched array of forms in the order of navigation
 * @returns True if the call stack was successfully amended, else false.
 * @author rzxd7g
 */
NavigationController.addToStack = function(formArray)
{
	if ( formArray == null || formArray.length == 0 )
	{
		return false;	
	}
	// Check if call stack exists
	if ( !NavigationController.callStackExists() )
	{
		return false;
	}
	
	// Reconstruct formArray
	var newArray = new Array();
	var sIndex = NavigationController._getCurrentIndex();
	var stackSize = NavigationController._getStackSize();
	for (var i=1; i<=stackSize; i++)
	{
		if (i == sIndex)
		{
			for (var j=0; j<formArray.length; j++)
			{
				newArray.push(formArray[j]);
			}
		}
		newArray.push(NavigationController._getScreenByIndex(i));	
	}
	
	// Remove existing call stack (keep index the same)	
	Services.removeNode(NavigationController.STACK_XPATH);

	// Create new call stack (keep index the same)
	for (var k=0, l=newArray.length; k<l; k++)
	{
		Services.setValue(NavigationController.STACK_XPATH + "/Form[" + k+1 + "]", newArray[k]);
	}
	return true;
}


/**
 * Resets the call stack and the stack index to 0
 * @author rzxd7g
 * 
 */
NavigationController.resetCallStack = function()
{
	if (Services.countNodes(NavigationController.STACK_XPATH + "/Form") != 0)
	{
		Services.removeNode(NavigationController.STACK_XPATH);
	}
	Services.setValue(NavigationController.STACKINDEX_XPATH, 0);
}


/**
 * Takes the user to the next screen in the call stack
 *
 * @returns False if the navigation was unsuccessful
 * @author rzxd7g
 */
NavigationController.nextScreen = function()
{
	if (NavigationController._getCurrentIndex == 0)
	{
		return false;
	}

	NavigationController._incrementIndex();
	var nextScreen = NavigationController._getScreenByIndex(NavigationController._getCurrentIndex() - 1);
	if (null != nextScreen)
	{
		Services.navigate(nextScreen);
	}
	else
	{
		// next screen called when no more screens exist, reset call stack
		NavigationController.resetCallStack();
	}
	return false;
}


/**
 * Takes the user to the last screen in the call stack (should be the calling screen).
 *
 * @returns False if call stack does exist
 * @author rzxd7g
 */
NavigationController.lastScreen = function()
{
	if (NavigationController._getCurrentIndex == 0)
	{
		return false;
	}

	Services.navigate( NavigationController.getCallingScreen() );
	return true;
}


/**
 * Skips a screen in the call stack.  If the next screen is optional and the
 * user chooses not to navigate to the next screen, this function can increment
 * the stack index.
 * @author rzxd7g
 * 
 */
NavigationController.skipScreen = function()
{
	NavigationController._incrementIndex();
}


/**
 * Returns the next screen's form name which the user may want to know
 *
 * @returns The form name of the next screen in the call stack, else null
 * @author rzxd7g
 */
NavigationController.getNextScreen = function()
{
	var index = parseInt(NavigationController._getCurrentIndex());
	if (index == 0 || CaseManUtils.isBlank(index))
	{
		return null;
	}
	return Services.getValue(NavigationController.STACK_XPATH + "/Form[" + index + "]");
}


/**
 * Returns the form name of the original calling screen which should always be the
 * final item in the stack.
 *
 * @returns The form name of the last screen in the call stack
 * @author rzxd7g
 */
NavigationController.getCallingScreen = function()
{
	return 	NavigationController._getScreenByIndex( NavigationController._getStackSize() );
}


/**
 * Indicates the current stack index
 *
 * @private
 * @returns The current stack index
 * @author rzxd7g
 */
NavigationController._getCurrentIndex = function()
{
	return Services.getValue(NavigationController.STACKINDEX_XPATH);
}


/**
 * Increments the stack index
 * @private
 * @author rzxd7g
 * 
 */
NavigationController._incrementIndex = function()
{
	var index = parseInt(NavigationController._getCurrentIndex()) + 1;
	Services.setValue(NavigationController.STACKINDEX_XPATH, index);
}


/**
 * Indicates the size of the current stack
 *
 * @private
 * @returns The number of screens in the call stack
 * @author rzxd7g
 */
NavigationController._getStackSize = function()
{
	return Services.countNodes(NavigationController.STACK_XPATH + "/Form");
}


/**
 * Returns the form name of the stack index specified
 *
 * @private
 * @param {int} index The index of the stack element to be returned
 * @returns The form name of the screen in specified position in the call stack, else null
 * @author rzxd7g
 */
NavigationController._getScreenByIndex = function(index)
{
	if ( CaseManUtils.isBlank(index) || index <= 0 || index > NavigationController._getStackSize() )
	{
		return null;
	}
	return Services.getValue(NavigationController.STACK_XPATH + "/Form[" + index + "]");
}
