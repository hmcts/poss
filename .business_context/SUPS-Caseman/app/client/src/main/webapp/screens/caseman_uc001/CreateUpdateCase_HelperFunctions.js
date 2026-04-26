/** 
 * @fileoverview CreateUpdateCase_HelperFunctions.js:
 * This file contains the helper functions for UC001 - Create & Update Case Details screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 11/07/2006 - Chris Vincent, getCodedParty() and solicitorReadOnlyFields() functions changed
 * 				so no longer reference the coded party data in the DOM (as its not there).
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 27/11/2006 - Ian Stainer. Fixed defect 5843 to do with printing duplicate notice of issue.
 *				The problem was that for outputs that are based on whether or not a hearing
 *				was present at case creation time (CJR179/CJR187) the code that was dealing
 *				with this scenario was just checking for the existence of a hearing not whether
 *				one was present at the time of case creation. This is now fixed with the introduction
 *				of a </HearingPresentAtCreation> node, which is now used.
 * 16/01/2007 - Chris Vincent, added clearing of Header_MCOLCaseFlag.dataBinding to resetForm() for
 * 				UCT_Group2 Defect 1125.
 * 21/06/2007 - Chris Vincent, change to isNationalCodedParty() to exclude MCOL cases from normal CCBC
 * 				coded party validation.  UCT_Group2 Defect 1371.
 * 10/07/2007 - Chris Vincent, changes to isNationalCodedParty() to allow existing national coded parties
 * 				on non CCBC cases (solicitors only) to allow a transferred CCBC case to be updated.
 * 				UCT_Group2 Defect 1478.
 * 16/10/2007 - Chris Vincent, updated CaseEventSequenceHandler.onSuccess() so won't fall over when call
 * 				duplicate notice with no case event 1 on case.  UCT_Group2 Defect 1606.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in handleClearForm() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 16-07-2008	Struan Kerr-Liddell - Changes to search by insolvency number & year
 * 18-08-2008	Sandeep Mullangi - Adding checkInsolvencyCaseExists methods
 * 13-11-2008	Sandeep Mullangi - Insolvency Number Changing the tabbing order and pre-populating owning court 
 * 01/12/2010 - Mark Groen, TRAC 4063 - In CM-CCBC (DOM1), the tester enters a case number and tabs out.
 *  			A window with "Web Page Dialogue" is displayed (not expected). right).  Amended the pause function to double check if IE7 or not
 * 13/12/2010 - Chris Vincent, TRAC 4104, removed the waitForReferenceData and pause functions and any reference to them
 *				together with references to REF_DATA_LOADING_FLAG_XPATH.  This flag was previously set only when getCourtFeeDataLists service
 *				called, but now that is called in screen refdataservices, is no longer required.
 * 19/09/2011 - Chris Vincent, changes to functions isNationalCodedParty, isNonCPCNationalCodedParty, solicitorReadOnlyFields to use
 *				a new generic CaseManUtils function for determining if coded party code is a CCBC National Coded Party code or not.
 *				Trac 4553.
 * 29/01/2013 - Chris Vincent, added Preferred Court Code (Trac 4764) and Track (Trac 4763) fields as part of RFS 3719.
 * 04/07/2013 - Chris Vincent (Trac 4908). Added function isNewNumberingSystemActive() as part of case numbering changes.
 */

/**
 * Function calls the getCase service to retrieve data about the Case Number specified.  The
 * Reference Data required by the form is also loaded.
 *
 * @param [String] caseNumber The Case Number to be queried
 * @author rzxd7g
 * 
 */
function loadCaseData(caseNumber)
{
	// Load the reference data required by the screen in add/update mode
	loadReferenceData();

	// Query the Case Number
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber );
	Services.callService("getCase", params, Header_CaseNumber, true);
}

function getCaseFromInsolvancy()
{
	var insolvencyNumber  = Services.getValue(XPathConstants.INSOLVENCY_NO_AND_YEAR);
	var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	
	var params = new ServiceParams();
	params.addSimpleParameter("insolvencyNumber", insolvencyNumber );
	params.addSimpleParameter("owningCourt", owningCourt );
	Services.callService("getCaseByInsolvencyNo", params, Header_InsolvYear, true);
}
/*********************************************************************************/

/**
 * Sets all the default screen values
 */
function setDefaultScreenData(){
		
	// Set the owning court defaulted to be the users home court, 
	// which will be required while searching for insolvency cases.
	// This is not used while searching for case using casenumber  
	var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(Header_OwningCourtCode.dataBinding, userOwningCourt);
		
}

/*********************************************************************************/
/**
 * Resets the data on the form so a new case can be entered.
 * NOTE - Case Number should not be removed so cannot Services.removeNode(XPathConstants.DATA_XPATH)
 * @author rzxd7g
 * 
 */
function resetForm()
{
	Services.startTransaction();

	// Clear the header data
	Services.setValue(Header_CaseType.dataBinding, "");
	Services.setValue(Header_CaseStatus.dataBinding, "");
	Services.setValue(Header_OwningCourtCode.dataBinding, "");
	Services.setValue(Header_PreferredCourtCode.dataBinding, "");
	Services.setValue(Header_CaseDetails.dataBinding, "");
	Services.setValue(Header_CaseAllocatedTo.dataBinding, "");
	
	Services.setValue(Header_MCOLCaseFlag.dataBinding, "");
	Services.setValue(ParticularsOfClaim_Details.dataBinding, "");
	Services.setValue(Master_PartyType.dataBinding,"");
	Services.setValue(XPathConstants.DATA_XPATH + "/ParticularsOfClaimPresent", "false");
	Services.setValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent", "false");
	Services.setValue(XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent", "false");
	Services.setValue(XPathConstants.DATA_XPATH + "/HearingDetailsPresent", "false");
	Services.setValue(XPathConstants.CASE_STATUS, "");
	Services.setValue(Header_InsolvNo.dataBinding, "");
	Services.setValue(Header_InsolvYear.dataBinding,"");
	Services.setValue(XPathConstants.INSOLVENCY_NO_AND_YEAR, "");			

	// Clear all other branches of data
	Services.removeNode(XPathConstants.DATA_XPATH + "/DetailsOfClaim");
	Services.removeNode(XPathConstants.DATA_XPATH + "/HearingDetails");
	Services.removeNode(XPathConstants.DATA_XPATH + "/OtherPossessionAddress");
	Services.removeNode(XPathConstants.DATA_XPATH + "/Parties/Solicitor");
	Services.removeNode(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty");
	Services.removeNode(XPathConstants.DATA_XPATH + "/CaseEvents");

	// Remove any SCN Nodes	
	removeSCNNodes(XPathConstants.DATA_XPATH);

	// Clear the var sections of the DOM
	Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	Services.removeNode(XPathConstants.VAR_APP_XPATH + "/CaseData");
	Services.removeNode(CreateCaseParams.PARENT);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	
	Services.endTransaction();
	
	setDefaultScreenData();
}

/*********************************************************************************/

/**
 * Checks for dirty data on the form and if found will ask the user if the want to
 * save the changes before exiting, else will just exit the screen.
 * @author rzxd7g
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_EXIT;
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function hnadles the exiting from the screen either to the menu or a previous screen.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.removeNode(CreateCaseParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		// Clear any persisted sections of the dom and exit to the menu
		Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**********************************************************************************/

/**
 * Function removes any SCN nodes under the parent node specified.
 *
 * @param [String] parentNode Xpath of the node under which to look for SCN nodes
 * @author rzxd7g
 * 
 */
function removeSCNNodes(parentNode)
{
	var scnNodes = Services.countNodes(parentNode + "/SCN");
	for ( var i=0; i<scnNodes; i++ )
	{
		Services.removeNode(parentNode + "/SCN[" + (i + 1) + "]");
	}
}

/**********************************************************************************/

/**
 * Function returns the next temporary surrogate key to be used for new parties and 
 * addresses.
 *
 * @return [String] The next surrogate key in the sequence
 * @author rzxd7g
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/**********************************************************************************/

/**
 * Function returns the party type code of the currently party in the master grid.
 *
 * @return [String] The party type code of the currently selected party
 * @author rzxd7g
 */
function getCurrentlySelectedPartyTypeCode()
{
	var selectedItemIdentifier = Services.getValue(masterGrid.dataBinding);
	var xpath = masterGrid.srcData + "/*[SurrogateId =  '" + selectedItemIdentifier + "']/TypeCode";
	var partyType = Services.getValue(xpath);
	return partyType;
}

/**********************************************************************************/

/**
 * Function returns the next party number for the party type provided.
 *
 * @param [String] partyType The party type code to get the next number for
 * @return [Integer] The xext party number for the party type specified
 * @author rzxd7g
 */
function getNextPartyNumber(partyType)
{
	var dom = Services.getNode("/");
	var partyNodes = Services.getNodes(XPathConstants.DATA_XPATH + "/Parties/*[./TypeCode='" + partyType + "']/Number"); /**/
	var n = 0;
	var nodeValue;
	for ( var i=0; i<partyNodes.length; i++ )
	{
		nodeValue = parseInt(XML.getNodeTextContent(partyNodes[i]));
		if ( nodeValue > n )
		{
			n = nodeValue;
		}
	}
	return (n + 1);
}

/**********************************************************************************/

/**
 * Function returns the party type description for the party type code specified.
 *
 * @param [String] The party type code
 * @return [String] The party type description for the code specified
 * @author rzxd7g
 */
function getPartyTypeDescription(code)
{
	var xpath = XPathConstants.REF_DATA_XPATH + "/PartyRoles/PartyRole[Code = '" + code + "']/Description";
	var description = Services.getValue(xpath);
	return description;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case has an insolvency case type.
 *
 * @return [Boolean] True if the case type is insolvency else false
 * @author rzxd7g
 */
function isInsolvencyCase()
{
	var caseType = Services.getValue(Header_CaseType.dataBinding);
	return CaseManUtils.isInsolvencyCase(caseType);
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case is MAGS ORDER (i.e. has a case number
 * in the format LL/NNNNN or a case type of MAGS ORDER).
 *
 * @return [Boolean] True if the case is MAGS ORDER else false
 * @author rzxd7g
 */
function isMagsOrder()
{
	return ( Services.getValue(Header_CaseType.dataBinding) == FormConstants.MAGS_ORDER );
}

/**********************************************************************************/

/**
 * Function indicates whether or not the current case is a CCBC Case (court 335)
 *
 * @return [Boolean] True if the case is CCBC, else false
 * @author rzxd7g
 */
function isCCBCCase()
{
	// Case is CCBC if court is 335
	var court = Services.getValue(Header_OwningCourtCode.dataBinding);
	return ( court == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case is existing or new.
 *
 * @return [Boolean] True if the case is existing else false
 * @author rzxd7g
 */
function isExistingCase()
{
	return (Services.getValue(XPathConstants.CASE_STATUS) == FormConstants.STATUS_EXISTING);
}

/**********************************************************************************/

/**
 * Function indicates whether or not the currently selected party is an existing party
 * (i.e. has previously been committed to the database).
 *
 * @return [Boolean] True if the party is an existing party, else false
 * @author rzxd7g
 */
function isExistingParty()
{
	var status = Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
	return status != FormConstants.STATUS_NEW;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case has any coded parties
 *
 * @return [Boolean] True if coded parties exist on the case else false
 * @author rzxd7g
 */
function codedPartiesExist()
{
	var countParties = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*");/**/
	if (countParties > 0)
	{
		var countCParties = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*[Code != '']"); /**/
		return countCParties > 0;
	}
	return false;
}

/**********************************************************************************/

/**
 * Function validates a coded party code to determine whether or not the code
 * is that of a National Coded Party (ranges 1500-1999 & 7000-9999).
 *
 * @param [Integer] code The coded party code to be tested
 * @param [Boolean] isCalledFromSolCodeField True if called from the solicitor code field, else false.
 * @return [ErrorCode] The appropriate error code if the code is a national coded party, else null
 * @author rzxd7g
 */
function isNationalCodedParty(code, isCalledFromSolCodeField)
{
	var ec = null;
	
	// Determine if the code is a CCBC National Coded Party code
	var isccbcncp = CaseManUtils.isCCBCNationalCodedParty(code);

	var currentCreditorCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
	if ( isCCBCCase() && currentCreditorCode != CaseManUtils.MCOL_CRED_CODE )
	{
		var currentPartyType = getCurrentlySelectedPartyTypeCode();
		if ( currentPartyType == PartyTypeCodesEnum.SOLICITOR )
		{
			// Determine whether or not the solicitor represents claimants
			var solicitorId = Services.getValue(masterGrid.dataBinding);
			var blnUsedByClaimant = Services.exists( XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.CLAIMANT + "' and ./SolicitorSurrogateId = '" + solicitorId + "']" );
			if ( blnUsedByClaimant && !isccbcncp )
			{
				// For a CCBC Case, the Claimant's solicitor must be a national coded party
				ec = ErrorCode.getErrorCode("Caseman_invalidNationalPartyCodeRange_Msg");
			}
			else if ( !blnUsedByClaimant && isccbcncp )
			{
				// For a CCBC Case, the a non-claimant solicitor must be a local coded party
				ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
			}
		}
		else
		{
			// Non solicitor party
			if ( currentPartyType == PartyTypeCodesEnum.CLAIMANT && !isccbcncp )
			{
				// Claimants must have a national coded party
				ec = ErrorCode.getErrorCode("Caseman_invalidNationalPartyCodeRange_Msg");
			}
			else if ( currentPartyType != PartyTypeCodesEnum.CLAIMANT && isccbcncp )
			{
				// All other parties must have a local coded party
				ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
			}
		}
	}
	else
	{
		if ( isccbcncp )
		{
			if ( !isCalledFromSolCodeField )
			{
				// Non Solicitor parties cannot be national coded parties
				ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
			}
			else if ( currentCreditorCode == CaseManUtils.MCOL_CRED_CODE )
			{
				// Solicitor party on an MCOL case cannot be a national coded party
				ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
			}
			else
			{
				// Called from Solicitor Code field, if existing party (not newly added), is allowed to be national coded party.
				var partyStatus = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/Status");
				if ( partyStatus != FormConstants.STATUS_EXISTING )
				{
					ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
				}
			}
		}
	}
	return ec;
}

/**********************************************************************************/

/**
 * Function indicates whether or not a coded party code belongs to the Non CPC
 * National Coded Party Range (7000 - 9999).  Note that some CCBC National Coded
 * Party ranges exist in the 7000-9999 range.
 *
 * @param [Integer] The Coded Party Code
 * @return [Boolean] True if the code falls in the range 7000-9999 else false
 * @author rzxd7g
 */
function isNonCPCNationalCodedParty(code)
{
	var blnNonCPC = false;
	if ( code >= 7000 && code <= 9999 )
	{
		// Code in Non CPC Range, test if a CCBC National Coded Party
		blnNonCPC = CaseManUtils.isCCBCNationalCodedParty(code) ? false : true;
	}
	return blnNonCPC;
}

/**********************************************************************************/

/**
 * Function adds a new Case Event to the DOM so the server can create the Events accordingly
 *
 * @param [Integer] eventId The Event Id to be created, e.g. 1 (Case Created)
 * @param [String] receiptDate Optional - the receipt date for the event in dom format (YYYY-MM-DD)
 * @param [String] partyKey Optional - the party key for the event which will be the subject
 * @author rzxd7g
 * 
 */
function addNewCaseEvent(eventId, receiptDate, partyKey)
{
	var rDate = receiptDate;
	if ( null == rDate )
	{
		// Use today's date if no receipt date specified
		rDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	}
	
	var partyNumber = "";
	var partyCode = "";
	// Check if there is a subject
	if ( null != partyKey )
	{
		// Get the party number and party code from the party key
		partyNumber = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/*[./PartyId='" + partyKey + "']/Number");/**/
		partyCode = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/*[./PartyId='" + partyKey + "']/TypeCode");/**/
	}
	
	// Create the new Case Event node
	var newCaseEvent = Services.loadDOMFromURL("NewCaseEvent.xml");
	newCaseEvent.selectSingleNode("/CaseEvent/ReceiptDate").appendChild( newCaseEvent.createTextNode( rDate ) );
	newCaseEvent.selectSingleNode("/CaseEvent/StandardEventId").appendChild( newCaseEvent.createTextNode( eventId ) );
	newCaseEvent.selectSingleNode("/CaseEvent/SubjectCasePartyNumber").appendChild( newCaseEvent.createTextNode( partyNumber ) );
	newCaseEvent.selectSingleNode("/CaseEvent/SubjectPartyRoleCode").appendChild( newCaseEvent.createTextNode( partyCode ) );
	
	// Add the new Case Event node to the dom
	Services.addNode(newCaseEvent, XPathConstants.DATA_XPATH + "/CaseEvents");
}

/**********************************************************************************/

/**
 * Function indicates whether or not a specified footer button (Details of Claim, 
 * Hearing Details or Other Possession Address) should be enabled or not.
 *
 * @param [String] Identifier of the button to check enablement
 * @return [Boolean] True if the specified button should be enabled else false
 * @author rzxd7g
 */
function enableButton(buttonId)
{
	var xpath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/FooterButtons";
	switch(buttonId)
	{
		case "Footer_DetailsOfClaimButton":
			if(Services.getValue(xpath + "/DetailsOfClaim") == "true") 
			{
				return true;
			}
			FormVariables.DETAILSOFCLAIM_FIELDS_TEMPORARY = true;
			break;
		case "Footer_HearingDetailsButton":
			if(Services.getValue(xpath + "/HearingDetails") == "true") 
			{
				return true;
			}
			break;
		case "Footer_OtherPossessionAddressButton":
			if(Services.getValue(xpath + "/OtherPossessionAddress") == "true") 
			{
				return true;
			}
			break;
	}
	return false;
}

/**********************************************************************************/

/**
 * Indicates whether or not the party fields should be enabled.  Fields should
 * only be enabled if the Case Number, Case Type and Owning Court have a value.
 *
 * @return [Boolean] True if the fields can be enabled else false
 * @author rzxd7g
 */
function isPartyFieldEnabled()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if ( CaseManUtils.isBlank( Services.getValue(masterGrid.dataBinding) ) )
	{
		return false;
	}
	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*") == 0 )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

/**
 * Indicates whether or not the currently selected party is a coded party
 *
 * @return [Boolean] True if the currently selected party is a coded party else false
 * @author rzxd7g
 */
function isCodedParty()
{
	var code = null;
	var validXPath = null;
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		code = Services.getValue(SolicitorParty_Code.dataBinding);
		validXPath = XPathConstants.SOL_CODE_VALID_XPATH;
	}
	else
	{
		code = Services.getValue(LitigiousParty_Code.dataBinding);
		validXPath = XPathConstants.LP_CODE_VALID_XPATH;
	}

	if ( !CaseManUtils.isBlank(code) )
	{
		// different xp for lp/sol
		if ( "false" != Services.getValue(validXPath) )
		{
			return true;
		}
	}
	return false;
}

/*********************************************************************************/

/**
 * Generic validation method for dates to ensure the date entered does not fall on
 * a bank holiday (non working day)
 *
 * @param [String] date The date to be tested in the model format (YYYY-MM-DD)
 * @return [ErrorCode] Error code if the date is a non working day else null
 * @author rzxd7g
 */
function validateNonWorkingDate(date) 
{
 	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") )
 	{
 		return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
 	}
 	return null;
}
 
/*********************************************************************************/

/**
 * Function indicates whether or not changes have been made.
 *
 * @return [Boolean] True if changes have been made, else false
 * @author rzxd7g
 */
function changesMade()
{
	return ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" || Services.getValue(XPathConstants.CASE_STATUS) == FormConstants.STATUS_NEW )
}

/*********************************************************************************/

/**
 * Sets the dirty flag to indicate changes have been made
 * @author rzxd7g
 * 
 */
function setChangesMade()
{
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "Y")
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
	}
}

/*********************************************************************************/

/**
 * If an existing claimant on an existing case (with payments) is updated and the 
 * claimant's solicitor payee flag is 'N', a warning message must be displayed on
 * update.  This function sets the flag indicating changes have been made to such
 * a claimant.
 * @author rzxd7g
 * 
 */
function setClaimantChangesMade()
{
	if ( isExistingParty() && 
		 getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.CLAIMANT && 
		 isExistingCase() )
	{
		var payeeFlag = Services.getValue(SolicitorParty_Payee.dataBinding);
		if ( payeeFlag == "N" )
		{
			// Changes made on a claimant that meets the criteria, set flag
			if ( Services.getValue(XPathConstants.CLAIMANT_CHANGES_MADE_XPATH) != "Y" )
			{
				Services.setValue(XPathConstants.CLAIMANT_CHANGES_MADE_XPATH, "Y");
			}
		}
	}
}

/*********************************************************************************/

/**
 * Function reorders the new parties in the DOM to ensure there are no gaps in the
 * numbering.
 *
 * @param [String] xp The base xpath of the parties to be renumbered
 * @author rzxd7g
 * 
 */
function reorderNewParties(xp)
{
	// Clear out the old numbering
	var numParties = Services.countNodes(xp);
	for ( var i=1; i<=numParties; i++ )
	{
		var status = Services.getValue(xp + "[" + i + "]/Status");
		if ( status == FormConstants.STATUS_NEW )
		{
			Services.setValue(xp + "[" + i + "]/Number", 0);
		}
	}
	
	// Now add the new numbering
	for ( var i=1; i<=numParties; i++ )
	{
		var status = Services.getValue(xp + "[" + i + "]/Status");
		if ( status == FormConstants.STATUS_NEW )
		{
			var typeCode = Services.getValue(xp + "[" + i + "]/TypeCode");
			var newNumber = getNextPartyNumber(typeCode);
			Services.setValue(xp + "[" + i + "]/Number", newNumber);
		}
	}
}

/*********************************************************************************/

/**
 * Function adds a IsCodedParty flag to each party to help identify
 * coded parties easier.
 *
 * @param [String] xp The base xpath of the parties to be processed
 * @author rzxd7g
 * 
 */
function addIsCodedPartyFlags(xp)
{
	var numParties = Services.countNodes(xp);
	for ( var i=1; i<=numParties; i++ )
	{
		var code = Services.getValue(xp + "[" + i + "]/Code");
		var isCodedParty = ( CaseManUtils.isBlank(code) ) ? "false" : "true";
		Services.setValue(xp + "[" + i + "]/IsCodedParty", isCodedParty);
	}
}

/*********************************************************************************/

/**
 * Calculates the maximum court fee based upon system data boundaries and the amount claimed
 * 
 * @return [Float] The maximum court fee
 * @author rzxd7g
 */
function calculateMaximumCourtFee()
{
	var maximum = 0;

	maximum = Services.getValue(XPathConstants.CONSTANTS_XPATH + "/MaxCourtFee");
	var amountClaimed = Services.getValue(DetailsOfClaim_AmountClaimed.dataBinding);
	var numBounds = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/CourtFeeData/BandList/Band");
	for ( var i=numBounds; i>0; i-- )
	{
		var boundary = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CourtFeeData/BandList/Band[" + i + "]/Boundary");
		if ( parseFloat(amountClaimed) > parseFloat(boundary) )
		{
			maximum = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CourtFeeData/BandList/Band[" + i + "]/Limit");
			break;
		}
	}
	return parseFloat(maximum);
}

/*********************************************************************************/

/**
 * Function handles the clearing of the Create & Update Case Details form data
 * @author rzxd7g
 * 
 */
function handleClearForm()
{
	if ( confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE) )
	{
		//If the case number is blank then we need to clear out the insolvency number
		if (CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)))
		{
			Services.setValue(Header_InsolvNo.dataBinding,"");
			Services.setValue(Header_InsolvYear.dataBinding,"");
		}
		// Clear out the case number, this will cause the form to be reset
		Services.setValue(Header_CaseNumber.dataBinding, "");
		
		Services.setFocus("Header_CaseNumber");
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
		
		// Reset the navigation links
		CaseManUtils.clearNavigationLinks();
	}
}

/*********************************************************************************/

/**
 * Function handles the action to perform following a save.  For Create Case, this 
 * can be navigation, clearing the form and exiting back to the menu.
 * @author rzxd7g
 * 
 */
function postSaveHandler()
{
	var temp = PostSaveActions.ACTION_AFTER_SAVE;
	PostSaveActions.ACTION_AFTER_SAVE = "";
	switch (temp)
	{
		case PostSaveActions.ACTION_NAVIGATE:
			NavigationController.nextScreen();
			break;
		case PostSaveActions.ACTION_CLEARFORM:
			handleClearForm();
			break;
		case PostSaveActions.ACTION_EXIT:
			exitScreen();
			break;
		case PostSaveActions.ACTION_DUPNOTICE:
			createDuplicateNotice();
			break;
	}
}

/*********************************************************************************/

/**
 * Function converts a string to upper case 
 *
 * @param [String] The string to be converted to upper case
 * @return [String] The converted string
 * @author rzxd7g
 */
function convertToUpper(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Function converts a string to upper case and strips out trailing and leading spaces.
 * Used for mandatory fields.
 *
 * @param [String] The string to be converted to upper case
 * @return [String] The converted string
 * @author rzxd7g
 */
function convertToUpperStripped(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Function indicates whether or not the solicitor fields are read only 
 *
 * @return [Boolean] True if the solicitor fields should be read only
 * @author rzxd7g
 */
function solicitorReadOnlyFields()
{
	// If a solicitor is selected in the master grid then the fields are not readonly
	// except if the value in the code field is invalid 
	if ( getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR ) 	
	{
		// A solicitor is not selected in the master grid so we are viewing
		// the solicitor associated with a litigious party so the fields are readonly
		return true; 
	}
	else
	{
		// A solicitor is selected in the master grid.
		// Check the solicitor's code to see if it is valid

		var code = Services.getValue(SolicitorParty_Code.dataBinding);
		var partyStatus = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
		if ( !isCCBCCase() && partyStatus == FormConstants.STATUS_EXISTING && CaseManUtils.isCCBCNationalCodedParty(code) )
		{
			// Read Only for an existing National Coded Party on a non CCBC case
			return true;
		}

		// If the code is valid e.g. it equates to a solicitor then we have a coded solicitor and so the 
		// fields are readonly because you cannot edit a coded solicitor
		return isCodedParty() ? true : false;
	}
}

/*********************************************************************************/

/**
 * Function to call the reference data required when a Case record is loaded
 * @author rzxd7g
 * 
 */
function loadReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypes") )
	{
		Services.callService("getCaseTypes", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/PartyRoles") )
	{
		Services.callService("getPartyRoles", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays") )
	{
		Services.callService("getNonWorkingDays", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/SystemDate") )
	{
		Services.callService("getSystemDate", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods") )
	{
		Services.callService("getPrefCommMethodList", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/TrackList") )
	{
		Services.callService("getTrackList", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules") )
	{
		var caseTypeRules = Services.loadDOMFromURL("../../CaseTypeRules.xml");
		Services.addNode(caseTypeRules, XPathConstants.REF_DATA_XPATH);
	}
}

/*********************************************************************************/

/**
 * Indicates whether or not the new case numbering system is active or not
 * @return [Boolean] true if active, else false
 */
function isNewNumberingSystemActive()
{
	var isActive = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseNumbering/NewNumbering/IsActive");
	return (isActive == "true") ? true : false;
}

/*********************************************************************************/

/**
 * Function creates a duplicate notice of issue for the case via calling Word Processing
 * @author rzxd7g
 * 
 */
function createDuplicateNotice()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	
	// Get CaseEventSequence for this case and StandardEvent ID = 1 
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getCaseEventSeq", params, CaseEventSequenceHandler, true);
}

/**
 * @author rzxd7g
 * 
 */
function CaseEventSequenceHandler()
{
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
CaseEventSequenceHandler.onSuccess = function(dom)
{
	var caseEventSeq = dom.selectSingleNode("/CaseEventSeq/CaseEventSeqElement/CaseEventSeq").text;
	if ( CaseManUtils.isBlank(caseEventSeq) )
	{
		// UCT_Group2 Defect 1606 - produce error message if no case event 1
		ec = ErrorCode.getErrorCode("CaseMan_noNoticeOfIssueForCase_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
	}
	else
	{
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var caseType = Services.getValue(Header_CaseType.dataBinding);
		
		var wpDom = Services.loadDOMFromURL("WPDOM.xml");	
		wpDom.selectSingleNode("/WordProcessing/Case/CaseNumber").appendChild( wpDom.createTextNode( caseNumber ) );
		wpDom.selectSingleNode("/WordProcessing/Case/CaseType").appendChild( wpDom.createTextNode( caseType ) );
		wpDom.selectSingleNode("/WordProcessing/Event/CaseEventSeq").appendChild( wpDom.createTextNode( caseEventSeq ) );
		wpDom.selectSingleNode("/WordProcessing/Event/StandardEventId").appendChild( wpDom.createTextNode( "1" ) );
		
		// We need to let word processing know that a duplicate output will be created
		var duplicateElement = wpDom.createElement("Duplicate");
		duplicateElement.appendChild(wpDom.createTextNode("true"));
		wpDom.selectSingleNode("/WordProcessing/Event").appendChild(duplicateElement);	
					
		// Check the value in the HearingPresentAtCreation element. If the value = true then
		// a hearing was present at case creation time so set HearingCreated element in wpDom to true
		var hearingCreated = Services.getValue(XPathConstants.DATA_XPATH + "/HearingPresentAtCreation");
		if ( "true" == hearingCreated )
		{
			var hearingCreatedElement = wpDom.createElement("HearingCreated");
			hearingCreatedElement.appendChild(wpDom.createTextNode("true"));
			wpDom.selectSingleNode("/WordProcessing").appendChild(hearingCreatedElement);	
		}	
		
		WP.ProcessWP(FormController.getInstance(), wpDom, NavigationController.CASES_FORM, false);
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
CaseEventSequenceHandler.onError = function(exception)
{
	alert(exception.message);
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
CaseEventSequenceHandler.onAuthorizationException = function(exception)
{
	alert(exception.message);
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
CaseEventSequenceHandler.onBusinessException = function(exception)
{
	alert(exception.message);
}


/*******************************************************************************************/
function CheckInsolvencyCaseExistsHandler(){}

function checkInsolvencyCaseExists(){
	var insolvencyNumber  = Services.getValue(XPathConstants.INSOLVENCY_NO_AND_YEAR);
	var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	
	var params = new ServiceParams();
	params.addSimpleParameter("insolvencyNumber", insolvencyNumber );
	params.addSimpleParameter("owningCourt", owningCourt );
	Services.callService("getCaseNoFromInsolvencyNo", params, CheckInsolvencyCaseExistsHandler, true);
}

CheckInsolvencyCaseExistsHandler.onSuccess = function(dom){
	//debugger;
	var caseNum = dom.selectSingleNode("/InsolvencyNumber/Case/CASENUMBER");
	if ( caseNum != null)
	{
		var insolvancy = Services.getValue(Header_InsolvNo.dataBinding) + ' of ' + Services.getValue(Header_InsolvYear.dataBinding);
		var courtNum = Services.getValue(Header_OwningCourtCode.dataBinding); 
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + courtNum + "]/Name");
		Services.showDialog(StandardDialogTypes.OK,function(){},Messages.format(Messages.INSOLVENCY_NUMBER_EXISTS,
		      [insolvancy,courtName]),'Insolvency Case Exists');
		//resetting insolvency number and sequence number
		Services.startTransaction();
		  Services.setValue(Header_InsolvNo.dataBinding, "");
		  Services.setValue(XPathConstants.INSOLVENCY_NO_AND_YEAR, "");
		Services.endTransaction();
		
		Services.setFocus('Header_InsolvNo');
	}
}

CheckInsolvencyCaseExistsHandler.onError = function(){
	alert(exception.message);
}
