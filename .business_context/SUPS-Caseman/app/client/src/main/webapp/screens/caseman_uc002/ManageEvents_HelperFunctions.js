/** 
 * @fileoverview ManageEvents_HelperFunctions.js:
 * This file contains the helper functions for UC002 - Manage Case Events screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 20/06/2006 - Chris Vincent, added runCCBCCaseDetailsReport() to handle calling the CCBC Case
 *				Details Report.
 * 13/07/2006 - Chris Vincent, made changes to retrieveCaseEvents() to include paging parameters.
 * 28/07/2006 - Chris Vincent, added isEventGridEmpty() function to determine if the grid is empty.
 * 03/08/2006 - Chris Vincent, added constant for automatic event subject type (as event 600 is auto
 * 				for CaseMan but can be manually added in CaseMan).  Events with this subject type are
 * 				treated the same as no subject so changes made throughout wherever no subject constant
 * 				is referenced. 
 * 22/08/2006 - Chris Vincent, fixed defect 4566 where when a new event is added and the event description field
 * 				is invalid, the invalid value is not filtered through to the add popup.
 * 04/01/2007 - Chris Vincent, changed configureAddEventPopup() to cover events where the Produce Output
 * 				checkbox should be unchecked by default.
 * 08/01/2007 - Chris Vincent, added report parameter P_USER to runCCBCCaseDetailsReport() (Group2 Defect 3988) 
 * 31/01/2007 - Chris Vincent, updated exitScreen() to only return to the Main Menu if there is no other screen 
 * 				to navigate to, filtering out calls to the Events screens.  CaseMan Defect 5944.
 * 18/04/2007 - Chris Vincent, new requirement for CCBC, added the subject type SubjectTypeCodes.CASEDEF which caters
 * 				for all defendants or CASE (similar to CPARTY_T6).
 * 01/05/2007 - Chris Vincent, update to validateSubject() to include the param ccbcJudgmentAgainstCheck for new
 * 				Judgment validation.  Group2 Defect 1368.
 * 09/08/2007 - Chris Vincent, changes to handleNewEventPopup() and introduced checkCCBCValidEvent() to perform
 * 				special CCBC validation (If case status is STAYED, only events 999 and 756 may be entered).
 * 				UCT_Group2 Defect 1526.
 * 03/09/2007 - Chris Vincent, added checkOutstandingPaymentsExist() to replace the existing outstanding payments
 * 				validation in the MenuBarCode.  CaseMan Defect 6420.
 * 05/10/2007 - Chris Vincent, updated runCCBCCaseDetailsReport() so won't navigate back to previous screen
 * 				after calling the CCBC Case Details Report.  UCT_Group2 Defect 1558.
 * 15/10/2007 - Chris Vincent, updated caseExists to include a check on whether the case number is valid.
 * 				UCT_Group2 Defect 1555.
 * 02/11/2007 - Chris Vincent, updated resetForm() so reset the main grid's sort order when the screen is
 * 				cleared.  PPE issue #8
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in resetForm() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 14/07/2008 - Sandeep Mullangi (Logica) Adding Insolvency Number changes. RFC486
 * 11-08-2008	Sandeep Mullangi - resetForm() value INSOLVENCY_NO_CONJOINED reset
 * 13-11-2008	Sandeep Mullangi - Insolvency Number Changing the tabbing order and pre-populating owning court
 * 17-06-2009	Mark Groen - When returning to this screen the court code does not always get updated. Pre populating the
 *              court code (insolvency change) was incorrect. TRAC Ticket 716.
 * 29-07-2009	Chris Vincent - Remove checkOutstandingPaymentsExist()  and associated onSuccess function as validation
 *		    	check no longer required.  See TRAC Ticket 1155.
 * 29/01/2013 - Chris Vincent, added new fields Track and Amount Claimed (Trac 4763), Preferred Court (Trac 4764) and Judge (Trac 4768)
 */

/**
* Function creates the DOM node required for the 3 subforms (Reset Case Status, Reset Case Type and 
* Obsolete Case Type and transfers it over to the xpath specified.
 *
 * @param [String] xp 
 * @author rzxd7g
 * 
 */
function prepareSubFormData(xp)
{
	// Create neccessary DOM structure for the update
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var UpdateCaseDOM = Services.loadDOMFromURL("UpdateCaseDOM.xml");
	UpdateCaseDOM.selectSingleNode("/Case/CaseNumber").appendChild( UpdateCaseDOM.createTextNode( caseNumber ) );
								
	// Add the SCN Nodes for the update
	var scnNodes = Services.countNodes(XPathConstants.DATA_XPATH + "/SCN");
	for (var i=0; i<scnNodes; i++)
	{
		UpdateCaseDOM.selectSingleNode("/Case").appendChild( Services.getNode(XPathConstants.DATA_XPATH + "/SCN[" + (i + 1) + "]") );
	}
	Services.replaceNode(xp, UpdateCaseDOM);
}

/*********************************************************************************/

/**
 * Prepares the data related to the case that needs to be updated when the user clicks the Save button
 */
function prepareCaseDataForUpdate()
{
	// Create neccessary DOM structure for the update
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var track = Services.getValue(Header_CaseAllocatedTo.dataBinding);
	var judge = Services.getValue(Header_DefaultJudge.dataBinding);
	var UpdateCaseDOM = Services.loadDOMFromURL("UpdateCaseDOM.xml");
	UpdateCaseDOM.selectSingleNode("/Case/CaseNumber").appendChild( UpdateCaseDOM.createTextNode( caseNumber ) );
								
	// Add the SCN Nodes for the update
	var scnNodes = Services.countNodes(XPathConstants.DATA_XPATH + "/SCN");
	for (var i=0; i<scnNodes; i++)
	{
		UpdateCaseDOM.selectSingleNode("/Case").appendChild( Services.getNode(XPathConstants.DATA_XPATH + "/SCN[" + (i + 1) + "]") );
	}
	Services.replaceNode(XPathConstants.VAR_PAGE_XPATH + "/CaseUpdate/Case", UpdateCaseDOM);
	
	Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/CaseUpdate/Case/Track", track);
	Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/CaseUpdate/Case/Judge",judge);
}

/*********************************************************************************/

/**
 * Function resets the data on the form so a new case can be entered.
 * Keep the VAR_FORM_XPATH which contains Reference Data.
 * @author rzxd7g
 * 
 */
function resetForm()
{
	// Reset the grid sort order
	CaseManUtils.resetGridSortOrder("Master_EventGrid");
	
	Services.startTransaction();
	clearAppParameters(false, true, true);
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.setValue(XPathConstants.CASE_EXISTS_XPATH, "");
	Services.setValue(XPathConstants.INSOLVENCY_NO_CONJOINED, "");
	if ( !NavigationController.callStackExists() )
	{
		// Remove CaseData if not navigating back anywhere
		Services.removeNode(XPathConstants.VAR_APP_XPATH + "/CaseData");
	}
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	Services.endTransaction();
	// Set the owning court defaulted to be the users home court, 
    // which will be required while searching for insolvency cases.
    // This is not used while searching for case using casenumber
	var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(Header_OwningCourtCode.dataBinding, userOwningCourt);
	Services.setFocus("Header_CaseNumber");
}

/*********************************************************************************/

/**
 * Function clears form parameters stored in /ds/var/app
 *
 * @param [Boolean] clearNav True if the navigation call stack is to be reset, else false
 * @param [Boolean] clearQBP True if the query by party (case) data should be cleared, else false
 * @param [Boolean] clearCase True if the Manage Case Events data should be cleared, else false
 * @author rzxd7g
 * 
 */
function clearAppParameters(clearNav, clearQBP, clearCase)
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_APP_XPATH + "/EventData");
	
	// Clear optional parameters
	if (clearNav)
	{
		NavigationController.resetCallStack();
	}
	if (clearQBP)
	{
		Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	}
	if (clearCase)
	{
		Services.removeNode(ManageCaseEventsParams.PARENT);
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function clears the add new case event field values
 * @author rzxd7g
 * 
 */
function clearAddEventFields()
{
	Services.startTransaction();
	clearPartySubjects();
	clearPartyInstigators();
	Services.removeNode(XPathConstants.NEWEVENT_XPATH);
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function clears the subject data on the add newe case event popup. 
 * @author rzxd7g
 * 
 */
function clearPartySubjects()
{
	// Reset the subject flags in the parties node
	Services.startTransaction();
	for (var i=1, l=Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party"); i<=l; i++)
	{
		Services.setValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/SubjectForEvent", "false");
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function clears the instigator data on the add newe case event popup. 
 * @author rzxd7g
 * 
 */
function clearPartyInstigators()
{
	// Reset the instigator flags in the parties node
	Services.startTransaction();
	for (var i=1; i<=Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party"); i++)
	{
		Services.removeNode(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/InstigatorForEvent");
	}
	// Clear previously selected instigators
	for (var i=1; i<=Services.countNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey"); i++)
	{
		Services.removeNode(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey[" + i + "]");
	}	
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets the current case number value in the xpath specified for use on another
 * screen.
 *
 * @param [String] xp The xpath which will have the case number written to it
 * @author rzxd7g
 * 
 */
function setAppCaseNumberParameter(xp)
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	Services.setValue(xp, caseNumber);
}

/*********************************************************************************/

/**
 * Function Ensures that the user is notified of unsaved changes before exiting the screen
 * @author rzxd7g
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
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
 * Function handles the exit from the screen and goes back to the main menu or to a previous
 * screen if the user did not enter the screen from the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	if ( NavigationController.callStackExists() && NavigationController.getNextScreen() != NavigationController.EVENTS_FORM )
	{
		// Call stack exists, go to the next screen
		clearAppParameters(false, true, true);
		NavigationController.nextScreen();
	}
	else
	{
		// CaseMan defect 5944 - if the next screen is the Events screen, skip until the next
		// legitimate screen, or navigate to main menu if none.
		var nextScreen = NavigationController.MAIN_MENU;
		var tempNextScreen = null;
		while ( NavigationController.callStackExists() )
		{
			tempNextScreen = NavigationController.getNextScreen();
			if ( tempNextScreen == NavigationController.EVENTS_FORM )
			{
				NavigationController.skipScreen();
			}
			else
			{
				// Set the next screen and skip one screen as are NOT calling nextScreen()
				nextScreen = tempNextScreen;
				NavigationController.skipScreen();
				break;
			}
		}
		
		// Clear data and return to the Menu screen
		clearAppParameters(true, true, true);
		Services.removeNode(XPathConstants.VAR_APP_XPATH + "/CaseData");
		Services.navigate(nextScreen);
	}
}

/*********************************************************************************/

/**
 * Function calls the getCaseEvents service to load/refresh the screen details
 *
 * @param [String] caseNumber The case number to retrieve case event details for
 * @author rzxd7g
 * 
 */
function retrieveCaseEvents(caseNumber)
{
	var pageNumber = Services.getValue(XPathConstants.CE_PAGENUMBER_XPATH);
	if ( CaseManUtils.isBlank(pageNumber) )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.CE_PAGENUMBER_XPATH, pageNumber);
	}
	
	// Call get Service
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	params.addSimpleParameter("pageSize", CaseEventConstants.PAGE_SIZE);
	params.addSimpleParameter("pageNumber", pageNumber);
	Services.callService("getCaseEvents", params, Header_CaseNumber, true);
}

/*********************************************************************************/

/**
 * Function calls the getInsolvencycaseEvents service to load/refresh the screen details
 *
 * @author Sandeep Mullangi
 * 
 */
function retrieveCaseEventsFromInsolvency()
{
	
	var pageNumber = Services.getValue(XPathConstants.CE_PAGENUMBER_XPATH);
	var insolvencyNumber  = Services.getValue(XPathConstants.INSOLVENCY_NO_CONJOINED);
	var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	
	if ( CaseManUtils.isBlank(pageNumber) )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.CE_PAGENUMBER_XPATH, pageNumber);
	}
	
	// Call get Service
	var params = new ServiceParams();
	params.addSimpleParameter("insolvencyNumber", insolvencyNumber );
	params.addSimpleParameter("owningCourt", owningCourt );

	params.addSimpleParameter("pageSize", CaseEventConstants.PAGE_SIZE);
	params.addSimpleParameter("pageNumber", pageNumber);
	Services.callService("getInsolvencycaseEvents", params, Header_InsolvYear, true);
}

/*********************************************************************************/

/**
 * Function indicates if changes to the case event data have been made (i.e. data is dirty)
 *
 * @return [Boolean] True if the data is dirty, else false
 * @author rzxd7g
 */
function changesMade()
{
	return Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "true"
}

/*********************************************************************************/

/**
 * Function indicates if changes to the case data have been made (i.e. data is dirty)
 *
 * @return [Boolean] True if the data is dirty, else false
 * @author rzxd7g
 */
function caseChangesMade()
{
	return Services.getValue(XPathConstants.CASE_CHANGES_MADE_XPATH) == "true"
}

/*********************************************************************************/

/**
 * Function handles navigation away from the screen to another (non menu screen). 
 * Checks for unsaved data are made.
 *
 * @param [Array] navArray Array of form names in the order they are to be added to the call stack.
 * @author rzxd7g
 * 
 */
function verifyNavigation(navArray)
{
	if ( null == navArray || navArray.length != 0 )
	{
		NavigationController.createCallStack( navArray );
	}
	
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
		Status_SaveButton.actionBinding();
	}
	else
	{
		NavigationController.nextScreen();
	}
}

/*********************************************************************************/

/**
 * Function indicates if a valid case is loaded.
 *
 * @return [Boolean] True if a valid case has been loaded, else false
 * @author rzxd7g
 */
function caseExists()
{
	var blnOk = true;
	
	if ( CaseManUtils.isBlank( Services.getValue(Header_CaseNumber.dataBinding) ) )
	{
		// Return false if case number is blank
		blnOk = false;
	}
	else if ( Header_CaseNumber.validate() != null )
	{
		// Return false if case number is invalid
		blnOk = false;
	}
	else if ( Services.getValue(XPathConstants.CASE_EXISTS_XPATH) != "true" )
	{
		// Return false if a valid case has not been loaded
		blnOk = false;
	}
	
	return blnOk;
}

/*********************************************************************************/

/**
 * Function indicates if the current case type is obsolete.
 *
 * @return [Boolean] True if the current case type is obsolete else false
 * @author rzxd7g
 */
function obsoleteCaseType()
{
	var caseType = Services.getValue(XPathConstants.DATA_XPATH + "/ObsoleteCaseTypeFlag");
	return caseType == "true";
}

/*********************************************************************************/

/**
 * Function indicates if the currently selected Case Event in the master grid
 * should enable the Subject fields.  The fields should be disabled if there is
 * no subject or the subject case flag is 'Y' (indicating the case is the subject).
 *
 * @return [Boolean] True if the subject fields should be enabled, else false
 * @author rzxd7g
 */
function subjectEnabled()
{
	var subject = Services.getValue(XPathConstants.EVENTS_XPATH + "/SubjectPartyKey")
	var flag = Services.getValue(XPathConstants.EVENTS_XPATH + "/CaseFlag");
	
	if ( CaseManUtils.isBlank(subject) || flag == "Y" )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

/**
 * Function sets a flag for each party on the case indicating if they can be used in an Event as
 * the subject.  It also converts each partyId into a Subject text field.  Whether a party can
 * be a subject or not depends upon the case event being created.
 *
 * @param [String] type The new case event's subject type 
 * @author rzxd7g
 * @return null 
 */
function setSubjectsForEvent(type)
{
	if ( type == SubjectTypeCodes.NONE || type == SubjectTypeCodes.AUTO || type == SubjectTypeCodes.CASEONLY )
	{
		// Subject Types 1 & 7 do not allow the user to use the LOV
		return;
	}

	var partyTypeCode;
	var partyType;
	var partyNumber;
	var partyName;
	var blnSubject;
	Services.startTransaction();
	for ( var i=1, l=Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party"); i<=l; i++ )
	{
		blnSubject = "false";
		partyTypeCode = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/PartyRoleCode");
		
		switch (type)
		{
			case SubjectTypeCodes.DEFENDANTS:
			case SubjectTypeCodes.CASEDEF:
				// Only Defendants can be the Subject
				if ( partyTypeCode == PartyTypeCodesEnum.DEFENDANT )
				{
					blnSubject = "true";
				}
				break;
				
			case SubjectTypeCodes.ALLPARTIES:
			case SubjectTypeCodes.CASE:
				// All parties can be the Subject (filter out any solicitors)
				if ( partyTypeCode != PartyTypeCodesEnum.SOLICITOR )
				{
					blnSubject = "true";
				}
				break;
				
			case SubjectTypeCodes.DEBTCOMPANY:
				// Subject must be a Debtor or a Company party
				if ( partyTypeCode == PartyTypeCodesEnum.DEBTOR || partyTypeCode == PartyTypeCodesEnum.THE_COMPANY )
				{
					blnSubject = "true";
				}
				break;
				
			case SubjectTypeCodes.APPLICANT:
				// Subject must be an Applicant party
				if ( partyTypeCode == PartyTypeCodesEnum.APPLICANT )
				{
					blnSubject = "true";
				}
				break;
				
			case SubjectTypeCodes.DEBTCOMTRUST:
				// Subject must be a Debtor, Trustee or a Company party
				if ( partyTypeCode == PartyTypeCodesEnum.DEBTOR || partyTypeCode == PartyTypeCodesEnum.THE_COMPANY || partyTypeCode == PartyTypeCodesEnum.TRUSTEE)
				{
					blnSubject = "true";
				}
				break;
		}

		// Set the subject flag for the party
		Services.setValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/SubjectForEvent", blnSubject);
		
		// Set transformed Subject Value for the party
		partyType = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/PartyRoleDescription");
		partyNumber = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/CasePartyNumber");
		partyName = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/PartyName");
		Services.setValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/SubjectValue", partyType + " " + partyNumber + " - " + partyName);		
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets a flag for each party on the case indicating if they can be used in an Event as
 * an instigator.  Whether a party can be an instigator or not depends upon the case event being created.
 *
 * @param [String] type The new case event's instigator type
 * @author rzxd7g
 * @return null 
 */
function setInstigatorsForEvent(type)
{
	if ( type == InstigatorTypeCodes.NONE )
	{
		// Instigator Types 1, 2 and 5 do not allow the user to select an instigator
		return;
	}
	
	var partyTypeCode = null;
	var partyKey = null;
	var blnInstigator = null;
	var subject = Services.getValue(AddEvent_Subject.dataBinding);
	var subjectCanBeInstigator = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorCanBeSubject");
	var countInstigators = 0;
	var defaultInstigator = null;
	
	Services.startTransaction();
	clearPartyInstigators();
	for ( var i=1, l=Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party"); i<=l; i++ )
	{
		blnInstigator = "false";
		partyTypeCode = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/PartyRoleCode");
		partyKey = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/PartyKey");

		// Ensure the Instigator cannot be the Subject unless specified in event config
		if ( subjectCanBeInstigator == "true" || ( subjectCanBeInstigator == "false" && partyKey != subject ) )
		{
			switch ( type )
			{
				case InstigatorTypeCodes.ALLPARTIES:
					// Instigator is any party (filter out any solicitors)
					if ( partyTypeCode != PartyTypeCodesEnum.SOLICITOR )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.CLAIMANTS:
					// Instigator is any Claimant (Type 4)
					if ( partyTypeCode == PartyTypeCodesEnum.CLAIMANT )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.NOTOFFREC:
					// Any party excluding Official Receiver (Type 6)
					if ( partyTypeCode != PartyTypeCodesEnum.OFFICIAL_RECEIVER )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.CRED659:
					// Any Creditor excluding any instigators on event 659 (Type 7)
					if ( partyTypeCode == PartyTypeCodesEnum.CREDITOR )
					{
						var isPartyInstigatorOn659 = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/Event659Instigators/Parties/Party[./SubjectPartyKey = '" + partyKey + "']");
						if ( !isPartyInstigatorOn659 )
						{
							// Party is not an instigator on case event 659
							blnInstigator = "true";
						}
					}
					break;
				case InstigatorTypeCodes.CREDITOR:
					// Any Creditor (Type 8)
					if ( partyTypeCode == PartyTypeCodesEnum.CREDITOR )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.INSPRACT:
					// Any Insolvency Practitioner (Type 9)
					if ( partyTypeCode == PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.PET_T10:
					// Any Petitioner (Type 10)
					if ( partyTypeCode == PartyTypeCodesEnum.PETITIONER )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.DEFENDANTS:
					// Any Defendant (Type 11)
					if ( partyTypeCode == PartyTypeCodesEnum.DEFENDANT )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.CREDITORTRST:
					// Any Creditor or Trustee (Type 12)
					if ( partyTypeCode == PartyTypeCodesEnum.CREDITOR || partyTypeCode == PartyTypeCodesEnum.TRUSTEE )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.INSPRACTTRST:
					// Any Insolvency Practitioner or Trustee (Type 13)
					if ( partyTypeCode == PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER || partyTypeCode == PartyTypeCodesEnum.TRUSTEE )
					{
						blnInstigator = "true";
					}
					break;
				case InstigatorTypeCodes.PETTRST:
					// Any Petitioner or Trustee (Type 14)
					if ( partyTypeCode == PartyTypeCodesEnum.PETITIONER || partyTypeCode == PartyTypeCodesEnum.TRUSTEE )
					{
						blnInstigator = "true";
					}
					break;
			}
			
			if ( blnInstigator == "true" )
			{
				countInstigators++;
				defaultInstigator = partyKey;
			}
		}
			
		Services.setValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + i + "]/InstigatorForEvent", blnInstigator);
	}
	
	// Set default instigator value
	if ( countInstigators == 1 )
	{
		Services.setValue(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey", defaultInstigator);
	}
	
	Services.endTransaction();
}

/**********************************************************************************/

/**
 * Function sets up the default values on the Add New Case Event Popup
 * @author rzxd7g
 * 
 */
function configureAddEventPopup()
{
	Services.startTransaction();
	// Set all the party flags for Subject selection
	var subjectType = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	setSubjectsForEvent(subjectType);

	// Set default Subject data for the popup
	var countPossibleSubjects = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./SubjectForEvent = 'true']");
	if ( countPossibleSubjects == 1 )
	{
		// If only one Subject, set as default
		var partyKey = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./SubjectForEvent = 'true']/PartyKey");
		Services.setValue(AddEvent_Subject.dataBinding, partyKey);
	}
	else
	{
		Services.setValue(AddEvent_Subject.dataBinding, "");
	}
	
	if ( subjectType == SubjectTypeCodes.CASEONLY )
	{
		Services.setValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, "Y");
	}
	else
	{
		Services.setValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, "");
	}
	
	// Set Instigator Label
	var instigatorLabel = CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorLabel") );
	Services.setValue(AddEvent_InstigatorLabel.dataBinding, instigatorLabel);
	
	// Set Instigators for events where no Subject but there is an Instigator
	var instigatorType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType");
	if ( (subjectType == SubjectTypeCodes.NONE || subjectType == SubjectTypeCodes.AUTO) && instigatorType != InstigatorTypeCodes.NONE)
	{
		// Get Instigator type and set the parties for Instigator selection
		setInstigatorsForEvent(instigatorType);	
	}
	
	// Set the Word Processing Call checkbox
	var wpCallInd = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/WordProcessingCall");
	if ( wpCallInd == "true" )
	{
		var notCheckedByDefault = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/NoWordProcessingOutputByDefault");
		if ( notCheckedByDefault == "true" )
		{
			// Event should not have the Produce Output checked by default
			Services.setValue(AddEvent_WPCall.dataBinding, "false");
		}
		else
		{
			Services.setValue(AddEvent_WPCall.dataBinding, wpCallInd);
		}
	}
	
	// Set popup data with default data
	Services.setValue(AddEvent_DateReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.setValue(AddEvent_Details.dataBinding, "");
	Services.setValue(AddEvent_Date.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.setValue(AddEvent_EventId.dataBinding, Services.getValue(Master_EventId.dataBinding) );
	var eventDescription = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_EventId.dataBinding + "]/StandardEventDescription");
	Services.setValue(AddEvent_EventDescription.dataBinding, eventDescription );
	Services.endTransaction();
}

/**********************************************************************************/

/**
 * Function transforms an amount to 2 decimal places e.g. 2 returns 2.00
 *
 * @param [Integer] value The amount to be converted to 2 decimal places
 * @param [Integer] maxLength The maximum length of the amount so adding 3 characters won't cause an error
 * @return [Float] The amount passed in to 2 decimal places or blank if invalid.
 * @author rzxd7g
 */
function transformAmountToTwoDP(value, maxLength)
{
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}

/**********************************************************************************/

/**
 * Function validates a specified subject for a new case event.
 *
 * @param [String] subjectKey Unique party identifier for the subject to be validated.
 * @param [String] dateOfService 'true' if Date of Service validation needs to be performed, else 'false'.
 * @param [String] activeJdg Indicates if Active Judgment validation needs to be performed.  Valid values include:
 * 		NOT_REQUIRED indicates an active judgment should NOT exist against the subject.
 * 		REQUIRED indicates an active judgment should exist against the subject.
 * 		CREATED indicates an active judgment should NOT exist against the subject and for the instigator(s).
 * 		A blank node indicates no active judgment validation.
 * @param [String] jdgForRedetermination 'true' if Judgments for Redetermination validation needs to be performed, else 'false'.
 * @param [String] barOnJdg 'true' if Bar on Judgment validation needs to be performed, else 'false'.
 * @param [Integer] eventPreReqCount A count of pre-requisite events which MUST exist against the subject.
 * @param [String] judgmentStatusCheck 'true' if Judgment Status validation needs to be performed, else 'false'.
 * @param [String] warrantAgainstCheck 'true' if Warrant validation needs to be performed against the subject, else 'false'.
 * @param [String] ccbcJudgmentStatusCheck 'true' if CCBC Judgment status validation needs to occur, else 'false'.
 * @return [ErrorCode] The error code if the subject is invalid, else null
 * @author rzxd7g
 */
function validateSubject(subjectKey, dateOfService, activeJdg, jdgForRedetermination, barOnJdg, eventPreReqCount, judgmentStatusCheck, warrantAgainstCheck, ccbcJudgmentStatusCheck)
{
	var ec = null;

	// Handle Date of Service Validation
	var subDateOfService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/DateOfServiceCheck/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']/DateOfService");
	if ( dateOfService == "true" && !CaseManUtils.isBlank( subDateOfService ) )
	{
		// Get date objects
		var fifteenDaysAgo = CaseManUtils.daysInPast( CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ), 15, true);
		var twentynineDaysAgo = CaseManUtils.daysInPast( CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ), 29, true);
		var dos = CaseManUtils.createDate(subDateOfService);
	
		var event38Exists = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/DateOfServiceCheck/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']/AcknowledgementExists");

		// Date of service exists, and a valid event 38 exists on the case, and the date of service is less than 29 days in the past.
		if ( event38Exists == "true" && CaseManUtils.compareDates(twentynineDaysAgo, dos) == 1 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_judgmentLessThanTwentyNineDaysAfterService_Msg");
		}
		// Date of service exists, and a valid event 38 does not exist on the case, and the date of service is less than 15 days in the past.
		else if ( event38Exists != "true" && CaseManUtils.compareDates(fifteenDaysAgo, dos) == 1 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_judgmentLessThanFifteenDaysAfterService_Msg");
		}
	}	
	
	// Handle No Active Judgment Validation
	if ( null == ec && !CaseManUtils.isBlank(activeJdg) )
	{
		// Get the number of Active Judgments against the subject
		var numJudgmentsAgainstSubject = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/ActiveJudgments/Judgments/Judgment[./Against/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']]");

		// List of Judgments with status of NULL or VARIED returned
		if ( activeJdg == "NOT_REQUIRED" )
		{
			// An Active Judgment with a status of NULL or VARIED should NOT exist against the subject
			if ( numJudgmentsAgainstSubject > 0 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_judgmentAlreadyExistsForDefendant_Msg");
			}
		}
		else if ( activeJdg == "REQUIRED" )
		{
			// An Active Judgment with a status of NULL or VARIED should exist against the subject
			if ( numJudgmentsAgainstSubject == 0 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_validJudgmentMustExist_Msg");
			}
		}
		else if ( activeJdg == "CREATED" )
		{
			if ( numJudgmentsAgainstSubject > 0 )
			{
				// Test the combination of Judgment against subject in favour of any of the instigators selected
				// does not already exist
				var countInstigators = Services.countNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey");
				for (var i=1; i<=countInstigators; i++)
				{
					var instigatorKey = Services.getValue(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey[" + i + "]");
					var xpath = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/ActiveJudgments/Judgments/Judgment[./Against/Parties/Party[./SubjectPartyKey = '" + subjectKey + "'] and ./InFavour/Parties/Party[./SubjectPartyKey = '" + instigatorKey + "'] ]";
					if ( Services.countNodes(xpath) > 0 )
					{
						ec = ErrorCode.getErrorCode("CaseMan_judgmentExistsAgainstSubjectForInstigator_Msg");
						Services.setFocus("AddEvent_Subject");
					}
				}
			}
		}
	}
	
	// Handle Judgments for Redetermination Validation
	if ( null == ec && jdgForRedetermination == "true" )
	{
		var exists = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/JudgmentsForRedetermination/Judgment[./Against/Parties/Party/SubjectPartyKey = '" + subjectKey + "']");
		if ( !exists )
		{
			// Subject does not an unregistered Judgment of type 'DETERMINATION' against them.
			ec = ErrorCode.getErrorCode("CaseMan_judgmentForRedetermination_Msg");
		}
	}
	
	// Handle Bar on Judgment Validation
	// Get the party type (only defendants or part 20 defendants should be validated)
	var partyType = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = '" + subjectKey + "']/PartyRoleCode");
	if ( null == ec && barOnJdg == "true" && ( partyType == PartyTypeCodesEnum.DEFENDANT || partyType == PartyTypeCodesEnum.PART_20_DEFENDANT ) )
	{
		// BarOnJudgment provides for list of Defendants/Part 20 Defendants and their bar values
		var bar = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/BarOnJudgmentNotSet/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']/Bar");
		if ( bar == "Y" )
		{
			// Error message depends upon case status
			var caseStatus = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/Case/Status");
			if ( CaseManUtils.isBlank(caseStatus) )
			{		
				ec = ErrorCode.getErrorCode("CaseMan_judgmentEnforcementBarIsSet1_Msg");	
			}
			else
			{
				ec = ErrorCode.getErrorCode("CaseMan_judgmentEnforcementBarIsSet2_Msg");
			}
		}
	}
	
	// Handles Event Pre-requisite Validation
	if ( null == ec && eventPreReqCount > 0 )
	{
		// Get a list of pre-requisite events that need exist against the subject
		var eventList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustExist/Event[./PartyDependant != 'NO']/EventId");
		var errorText = null;
		for ( var i=0, l=eventList.length; i<l; i++ )
		{
			var eventId = XML.getNodeTextContent( eventList[i] );
			// Check if the subject appears in the list of parties who have this event recorded against them
			if ( !Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustExist/Event[./EventId = " + eventId + "]/RecordedAgainst/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']") )
			{
				// Event does not exist against the subject, append errorText
				if ( i == 0 )
				{
					// For the first event, assign the errorText the event id
					errorText = eventId;
				}
				else if ( i == (l-1) )
				{
					// For the final event, add an 'or' between the events
					errorText = errorText + " or " + eventId;
				}
				else
				{
					// For any events in between, add a comma ',' between the events
					errorText = errorText + ", " + eventId;
				}
			}
			else
			{
				// Event does exist against the subject, exit the loop
				errorText = null;
				break;
			}
		}
		
		if ( null != errorText )
		{
			// Build the error message for the subject
			ec = ErrorCode.getErrorCode("CaseMan_noEventXForSubject_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, errorText);
		}		
	}
	
	// Handles Judgment Suitable for Admission Defence validation
	if ( null == ec && judgmentStatusCheck == "true" )
	{
		var judgmentExistsAgainstParty = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/JudgmentsSuitableForAdmissionDefence/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']");
		if ( judgmentExistsAgainstParty )
		{
			ec = ErrorCode.getErrorCode("CaseMan_caseEvent_judgmentMustExistAgainstSubject_Msg");
		}
	}

	// Handles Subject must have a warrant against them validation
	if ( null == ec && warrantAgainstCheck == "true" )
	{
		var warrantExistsAgainstParty = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/WarrantAgainst/Parties/Party[./PartyKey = '" + subjectKey + "']");
		if ( !warrantExistsAgainstParty )
		{
			ec = ErrorCode.getErrorCode("CaseMan_caseEvent_warrantMustExistAgainstSubject_Msg");
		}
	}
	
	// Handles CCBC Judgment status against the subject validation
	if ( null == ec && ccbcJudgmentStatusCheck == "true" )
	{
		// CCBC Validation - subject must have a Judgment of type Satisfied or Cancelled against them
		var ccbcJudgmentAgainstPartyCount = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/CCBCProduceCertOfSatisfaction/Judgments/Judgment[./Against/Parties/Party/PartyKey = '" + subjectKey + "']");
		if ( ccbcJudgmentAgainstPartyCount == 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_caseEvent_noCCBCJudgmentAgainstSubject_Msg");
		}
	}

	return ec;
}

/*********************************************************************************/

/**
 * Function handles the opening of the Add New Case Event popup
 * @author rzxd7g
 * 
 */
function handleNewEventPopup()
{
	var eventId = Services.getValue(Master_EventId.dataBinding);
	// Test for CCBC Specific Validation (UCT_Group2 Defect 1526)
	if ( checkCCBCValidEvent(eventId) )
	{
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var owningCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
		
		// Clear out old data
		Services.startTransaction();
		Services.removeNode(XPathConstants.EVENTNAVIGATION_XPATH);
		Services.removeNode(XPathConstants.EVENTVALIDATION_XPATH);
		clearAddEventFields();
		Services.endTransaction();
	
		var params = new ServiceParams();
		params.addSimpleParameter("eventId", eventId);
		params.addSimpleParameter("caseNumber", caseNumber);
		params.addSimpleParameter("caseCourtCode", owningCourtCode);
		Services.callService("getCaseEventValidationData", params, Master_AddEventButton, true);
	}
	else
	{
		// Cannot enter this particular event on a CCBC case with a status of STAYED
		var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_ccbcInvalidEventForStay_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
	}
}

/*********************************************************************************/

/**
 * Function handles actions after saving e.g. navigation, opening popups etc.
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
			// Navigating to another screen
			NavigationController.nextScreen();
			break;
		case PostSaveActions.ACTION_RESETCASESTATUS:
			// Raise the Reset Case Status Subform
			Services.dispatchEvent("resetCaseStatus_subform", BusinessLifeCycleEvents.EVENT_RAISE);
			break;
		case PostSaveActions.ACTION_RESETCASETYPE:
			// Raise the Reset Case Type Subform
			Services.dispatchEvent("changeCaseType_subform", BusinessLifeCycleEvents.EVENT_RAISE);
			break;
		case PostSaveActions.ACTION_CREATENEWEVENT:
			// Raise the Add New Case Event popup
			handleNewEventPopup();
			break;
		case PostSaveActions.ACTION_CLEARFORM:
			// Clear the form
			resetForm();
			break;
		case PostSaveActions.ACTION_EXIT:
			// Exit the screen
			exitScreen();
			break;
		case PostSaveActions.ACTION_CASEDETAILSREPORT:
			// Run the Case Details Report
			runCCBCCaseDetailsReport();
			break;
	}
}

/*********************************************************************************/

/**
 * Function handles actions after saving e.g. navigation, opening popups etc.
 * 
 * @param [String] value The string to be converted to upper case
 * @return [String] the converted string or null if no value passed in.
 * @author rzxd7g
 */
function convertToUpperCase(value)
{
	return ( null != value ) ? value.toUpperCase() : null;
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
 * Function to call the reference data required when a Case record is loaded
 * @author rzxd7g
 *
 * TRAC Ticket 716 Change so service call for 'getCourtShort', so it returns to use the manageEvents onSuccess method
 * and not the Header_OwningCourtCode.onSuccess.
 */
function loadCaseRelatedReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts") )
    {
      Services.callService("getCourtsShort", params, manageEvents, true);
    }
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents") )
	{
		Services.callService("getStandardEvents", params, manageEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency") )
	{
		Services.callService("getCurrentCurrency", params, manageEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/SystemDate") )
	{
		Services.callService("getSystemDate", params, manageEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/TrackList") )
	{
		Services.callService("getTrackList", params, manageEvents, true);
	}
}

/*********************************************************************************/

/**
 * Function handles the call to the CCBC Case Details Report
 * @author rzxd7g
 */
function runCCBCCaseDetailsReport()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var dom = Reports.createReportDom("BC_TC_R3.rdf");
	Reports.setValue(dom, "CASENO", caseNumber );
	Reports.setValue(dom, "PATH", "" );
	Reports.setValue(dom, "P_FILE", "" );
	Reports.setValue(dom, "P_LAST_VAL", "" );
	Reports.setValue(dom, "USERNAME", Services.getCurrentUser() );
	Reports.setValue(dom, "P_USER", Services.getCurrentUser() );
	Reports.runReport(dom, false);	
}

/*********************************************************************************/

/**
 * Indicates whether or not any case events exist on the Case record
 * 
 * @returns boolean true if the master events grid is empty
 * @author rzxd7g
 */
function isEventGridEmpty()
{
	var countEvents = Services.countNodes(Master_EventGrid.srcData + "/" + Master_EventGrid.rowXPath);
	return (countEvents == 0) ? true : false;
}

/*********************************************************************************/

/**
 * This method strips out embedded ampersands from the string passed as a parameter and
 * replaces the ampersands with the XML compatible version, which is returned to the caller.
 */
function getXMLCompatibleString(str)
{
	var AMPERSAND = "&";
	var XML_AMPERSAND = "&amp;";
	if (str != null)
	{
		var ampIndex = str.indexOf(AMPERSAND);
		while (ampIndex > -1)
		{
			// Replace the ampersand with xml compatible version
			str = str.substring(0, ampIndex) + XML_AMPERSAND + str.substring(ampIndex + 1, str.length);
			// Continue looking for more from the first char after the xml compatible ampersand
			ampIndex = str.indexOf(AMPERSAND, ampIndex + XML_AMPERSAND.length);
		}
	}
	return str;
}

/*********************************************************************************/

/**
 * This method determines if the event is valid for creation on a stayed case (status of STAYED)
 * This is CCBC specific validation.
 * 
 * @param [Integer] pEvent The event id of the event to be tested
 * @return [Boolean] True if the event is valid, else false
 * @author Chris Vincent
 */
function checkCCBCValidEvent(pEvent)
{
	var blnValidEvent = false;
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	var caseStatus = Services.getValue(XPathConstants.DATA_XPATH + "/CaseStatus");
	if ( courtCode == CaseManUtils.CCBC_COURT_CODE && caseStatus == CaseEventConstants.STATUS_STAYED )
	{
		// A CCBC Case with a status of STAYED, test if the event is valid for this scenario
		for (var i=0, l=CaseEventConstants.CCBC_VALID_EVENTS_FOR_STAYED.length; i<l; i++)
		{
			if ( CaseEventConstants.CCBC_VALID_EVENTS_FOR_STAYED[i] == pEvent )
			{
				// Valid event, set return value to true
				blnValidEvent = true;
				break;
			}
		}
	}
	else
	{
		// Does not fall under special function validation criteria, set to valid
		blnValidEvent = true;
	}
	return blnValidEvent;
}