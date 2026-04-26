/** 
 * @fileoverview MaintainLocalCodedPartiesHelperFunctions.js:
 * This file contains the helper functions for UC0172 - Maintain Local Coded Parties screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, toUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 01/09/2006 - Chris Vincent, updated retrieveSearchResults so the code field is wildcarded
 * 				before sent to the server.  Defect 4954.
 * 19/09/2011 - Chris Vincent, change to function isNationalCodedParty to use new generic 
 *				CaseManUtils function.  Trac 4553.
 */

/**
 * Function exits the screen and returns to the menu
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function indicates whether or not a code passed in is a National Coded Party
 *
 * @param Integer code The coded party code to be tested
 * @returns boolean true if the code provided is a national coded party code, else false.
 * @author rzxd7g
 */
function isNationalCodedParty(code)
{
	if ( CaseManUtils.isCCBCNationalCodedParty(code) )
	{
		// National Coded Party
		return true;
	}
	if ( code >= 7000 && code <= 9999 )
	{
		// Non CPC National Coded Party
		return true;
	}

	// The code is a valid local coded party
	return false;
}

/*********************************************************************************/

/**
 * @param blnNextButton
 * @author rzxd7g
 * @return null 
 */
function retrieveSearchResults(blnNextButton)
{
	if( !Services.getAdaptorById("Header_PartyCode").getValid() )
	{
		return;
	}

	// Get the service parameters from the temporary area
	var codeVar = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/PartyCode");
	var partyNameVar = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/PartyName");
	var addressLine1Var = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/AddressLine1");
	var addressLine2Var = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/AddressLine2");
	var addressPostcodeVar = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/Postcode");
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var pageNumber = Services.getValue(XPathConstants.SEARCH_PAGENUMBER_XPATH);
	if ( pageNumber == 0 )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 1);
	}
	
	// Add wildcard characters to the parameters
	codeVar = CaseManUtils.isBlank(codeVar) ? "%" : "%" + codeVar + "%";
	partyNameVar = CaseManUtils.isBlank(partyNameVar) ? "%" : "%" + partyNameVar + "%";
	addressLine1Var = CaseManUtils.isBlank(addressLine1Var) ? "%" : "%" + addressLine1Var + "%";
	addressLine2Var = CaseManUtils.isBlank(addressLine2Var) ? "%" : "%" + addressLine2Var + "%";
	addressPostcodeVar = CaseManUtils.isBlank(addressPostcodeVar) ? "" : "%" + addressPostcodeVar + "%";

	var params = new ServiceParams();
    params.addSimpleParameter("code", codeVar);
	params.addSimpleParameter("partyName", partyNameVar);
	params.addSimpleParameter("owningCourtCode", courtCode);
	params.addSimpleParameter("address1", addressLine1Var);
	params.addSimpleParameter("address2", addressLine2Var);
	params.addSimpleParameter("postCode", addressPostcodeVar);
	params.addSimpleParameter("pageNumber", pageNumber );
	params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );

	// Use a different onSuccess handler for the Next button	
	if ( blnNextButton )
	{
		Services.callService("getCodedPartiesFilter", params, Results_NextButton, true);
	}
	else
	{
    	Services.callService("getCodedPartiesFilter", params, Header_Search, true);
    }
}

/*********************************************************************************/

/**
 * Function transforms a string to upper case
 *
 * @param String text The string to be converted
 * @return String The string passed in in upper case, or null if invalid string
 * @author rzxd7g
 */
function toUpper(text)
{
	return (null != text) ? text.toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Function converts a string to upper case and strips out trailing and leading spaces.
 * Used for mandatory fields.
 *
 * @param String text The string to be converted
 * @return String The string passed in in upper case, or null if invalid string
 * @author rzxd7g
 */
function toUpperStripped(text)
{
	return (null != text) ? CaseManUtils.stripSpaces(text).toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Returns an indication of whether or not the results grid is empty
 *
 * @return Boolean True if the grid is empty else false
 * @author rzxd7g
 */
function isResultsGridEmpty()
{
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? true : false;
}
