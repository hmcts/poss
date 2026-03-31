/****************************************************************************************************************
						Run CM_N335S Summary of Baliff Credit Notes report
****************************************************************************************************************/

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/
var reportModuleGroup = ""
var __tabIdx = 300;
			
			
// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
/**
 * Form element
 * @author bz6s80
 * 
 */
function OracleReportForm() {}
		
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

// Header Fields and Save Button for WP Parameter form

// Form Keybindings
OracleReportForm.keyBindings = [
/**
 * @author bz6s80
 * 
 */
	{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
	{ key: Key.F4, action: exitScreen }
];			
			

/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
function OwningCourt_Name() {}
function OwningCourt_Code() {}
function PaymentDate() {}

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
PaymentDate.dataBinding = "/ds/var/page/OracleReportForm/PaymentDate";
		
/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/

OwningCourt_Code.isReadOnly = function() { return true;}
OwningCourt_Name.isReadOnly = function() { return true;}
			
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
OracleReportForm.initialise = function()
{
	//debugger;
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);

    // Set the payment date as the previous working date
	var previousWorkingDate = CaseManUtils.getPreviousWorkingDate(REF_DATA_XPATH + "/SystemDate");
	Services.setValue(PaymentDate.dataBinding, previousWorkingDate);

	StartOfDayUtils.checkSuitorsCashStartOfDay("SummaryOfBailiffCreditNotesReport");
}			
			
/*****************************************************************************************************************
                                         REQUEST REPORT
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function requestReport()
{
	var params = new ServiceParams();
	var paymentDateXSD = CaseManUtils.createDate( Services.getValue(PaymentDate.dataBinding) );
	params.addSimpleParameter("P_PAYMENT_DATE", CaseManUtils.convertDateToPattern(paymentDateXSD, "DD-MMM-YYYY"));
	Services.callService("produceBailiffCreditNoteSummaryReport", params, requestReport, true);
}	

/**
 * @author bz6s80
 * 
 */
requestReport.onSuccess = function()
{
	//Services.setTransientStatusBarMessage("OK")
	exitScreen();
}
/**
 * @author bz6s80
 * 
 */
requestReport.onError = function()
{
	alert("Error - REPORTs did not run.");
	Services.setTransientStatusBarMessage("Error - REPORT did not run.")
}

/*****************************************************************************************************************
                                         FIELD CODE
*****************************************************************************************************************/
PaymentDate.tabIndex = __tabIdx++;
PaymentDate.componentName = "Payment Date";		
PaymentDate.srcData = null;
PaymentDate.rowXPath = null;
PaymentDate.keyXPath = null;
PaymentDate.displayXPath = null;
PaymentDate.helpText = "Enter Payment Date";
PaymentDate.isMandatory = function() { return true;}
PaymentDate.validateOn = [ PaymentDate.dataBinding ];
PaymentDate.validate = function(value)
	{
	    var paymentDate = Services.getValue(PaymentDate.dataBinding);
	    var paymentDateObj = CaseManUtils.isBlank(paymentDate) ? null : CaseManUtils.createDate(paymentDate);
	    var ec = null;
	    if(paymentDateObj != null) 
	    	{
			    ec = validateDate(paymentDateObj);     
			}
		return ec;		
	}
/**
 * @author bz6s80
 * 
 */
PaymentDate.setDefault = function()
	{
		Services.setValue(PaymentDate.dataBinding, getTodaysDate());
	}

Status_RunReportButton.validationList = ["PaymentDate"];

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/

/**
 * @param dateObj
 * @author bz6s80
 * @return null , faildedValidation (ec)  
 */
function validateDate(dateObj)
	{    
	  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
	  if(CaseManUtils.compareDates(dateObj, todayDateObj) == 1 ) {
	      return null;
	  } else {
	      ec = ErrorCode.getErrorCode("CaseMan_dateCanOnlyBeInThePast_Msg");
		  return faildedValidation (ec);
	  }      
	  return null;   
	}			
			
/**
 * @author bz6s80
 * @return date  
 */
function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	//alert(date);
	return date;
}
	
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * @author bz6s80
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		requestReport();
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author bz6s80
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

			
/**
 * @param ec
 * @author bz6s80
 * @return ec  
 */
function faildedValidation (ec)
{
  if(ec != null)
  {
    Services.setTransientStatusBarMessage(ec.getMessage());
  }
  return ec;
}		

/**
 * @author bz6s80
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
	
