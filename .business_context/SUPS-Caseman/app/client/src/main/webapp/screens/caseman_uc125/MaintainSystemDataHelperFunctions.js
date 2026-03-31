/** 
 * @fileoverview MaintainSystemDataHelperFunctions.js:
 * This file contains the helper functions for UC125 - Maintain System Data screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 */

/**
 * Function calls the service to retrieve the global system data
 * @author rzxd7g
 * 
 */
function loadGlobalCourts()
{
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", CaseManUtils.GLOBAL_COURT_CODE);
	Services.callService("getSystemDataMaintain", params, maintainSystemData, true);
}

/*********************************************************************************/

/**
 * Function calls the service to retrieve the PER specific system data
 * @author rzxd7g
 * 
 */
function loadPERSpecificData()
{
	var detailCode = Services.getValue(PERDetails_DetailCode.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("weeklyCode", detailCode + "_W");
	params.addSimpleParameter("monthlyCode", detailCode + "_M");
	Services.callService("getSystemDataPer", params, PERDetails_SearchButton, true);
}

/*********************************************************************************/

/**
 * Function calls the service to retrieve the court specific system data
 * @author rzxd7g
 * 
 */
function loadCourtSpecificData()
{
	var courtCode = Services.getValue(CourtSpecific_CourtCode.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getSystemDataMaintain", params, CourtSpecific_SearchButton, true);
}

/*********************************************************************************/

/**
 * Function indicates if a court has been selected
 * 
 * @returns [Boolean] True if a court has been selected
 * @author rzxd7g
 */
function isCourtSelected()
{
	var courtSelected = Services.getValue(XPathConstants.COURTSELECTED_XPATH);
	return ( courtSelected == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function indciates if a PER Detail has been selected
 * 
 * @returns [Boolean] True if a PER Detail has been selected
 * @author rzxd7g
 */
function isPERSelected()
{
	var perSelected = Services.getValue(XPathConstants.PERSELECTED_XPATH);
	return ( perSelected == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Indicates whether or not the subform fields should be enabled
 * 
 * @returns [Boolean] True if the fields can be enabled
 * @author rzxd7g
 */
function enableSubformFields()
{
	var adaptor = Services.getAdaptorById("MaintainSystemDataSubform_Item");
	var value = Services.getValue(MaintainSystemDataSubform_Item.dataBinding);
	
	if ( CaseManUtils.isBlank(value) || !adaptor.getValid() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

/**
 * Function converts a fee to 2 decimal places for use in a grid
 *
 * @param [Integer] value Amount to be converted
 * @returns [Float] Amount to two decimal places
 * @author rzxd7g
 */
function transformAmountToDisplay(value) 
{
	if ( CaseManUtils.isBlank(value) )
	{
		return "";
	}

    var fVal = parseFloat(value).toFixed(2);
    return ( isNaN(fVal) ) ? value : fVal;
}

/*********************************************************************************/

/**
 * Function converts a currency identifier e.g. GBP to a currency symbol (£)
 *
 * @param [String] value Currency identifier to be converted to a symbol
 * @returns [String] Currency symbol to display on screen
 * @author rzxd7g
 */
function transformCurrencyToDisplay(value) 
{
    return CaseManUtils.transformCurrencySymbolToDisplay(value, null, "");
}
