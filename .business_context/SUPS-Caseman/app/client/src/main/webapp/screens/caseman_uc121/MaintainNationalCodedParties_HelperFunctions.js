/** 
 * @fileoverview MaintainNationalCodedParties_HelperFunctions.js:
 * This file contains the helper functions for UC121 - Maintain National Coded
 * Parties screen
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
 * 19/09/2011 - Chris Vincent, change to functions isNationalCodedParty() and isNonCPCCodedParty to use
 *				a new generic CaseManUtils function.  Trac 4553.
 */

/**
 * Function exits the screen and returns to the main menu
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function indicates if a code passed in is a CCBC National Coded Party (code is in 
 * range 1500 - 1999 or other ranges in 7000-9999).  See CaseManUtils.isCCBCNationalCodedParty
 * for full CCBC National Coded Party ranges.
 *
 * @param Integer code The code to check
 * @return boolean True if the code passed in is a National Coded Party, else false
 * @author rzxd7g
 */
function isNationalCodedParty(code)
{
	return CaseManUtils.isCCBCNationalCodedParty(code);
}

/*********************************************************************************/

/**
 * Function indicates if a code passed in is a new Non CPC National Coded Party 
 * (code is in range 7000 - 9999).  These coded parties were introduced as part
 * of RFC 1297.  Note - there are some CCBC National Coded Parties in this range
 * which are filtered out.
 *
 * @param Integer code The code to check
 * @return boolean True if the code passed in is a Non CPC National Coded Party, else false
 * @author rzxd7g
 */
function isNonCPCCodedParty(code)
{
	var blnNonCPC = false;
	if ( code >= 7000 && code <= 9999 )
	{
		// Code in Non CPC Range, test if a CCBC National Coded Party
		blnNonCPC = CaseManUtils.isCCBCNationalCodedParty(code) ? false : true;
	}
	return blnNonCPC;
}

/*********************************************************************************/

/**
 * Function retrieves the national coded parties that match the criteria entered
 * by the user in the query panel
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
	params.addSimpleParameter("address1", addressLine1Var);
	params.addSimpleParameter("address2", addressLine2Var);
	params.addSimpleParameter("postCode", addressPostcodeVar);
	params.addSimpleParameter("pageNumber", pageNumber );
	params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
    
	// Use a different onSuccess handler for the Next button	
	if ( blnNextButton )
	{
		Services.callService("getNatCodedPartiesFilter", params, Results_NextButton, true);
	}
	else
	{
    	Services.callService("getNatCodedPartiesFilter", params, Header_Search, true);
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
