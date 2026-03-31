/** 
 * @fileoverview MaintainCourtDataHelperFunctions.js:
 * This file contains the helper functions for UC120 - Maintain Court Data screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, fixed syntax error in postSaveHandler() which meant loading
 *				a new court after saving wouldn't work properly.
 */



/**
 * Function indicates whether or not a court record has been loaded
 *
 * @return boolean True if a court record has been loaded, else false
 * @author rzxd7g
 */
function isCourtRecordLoaded()
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	return formState == FormStates.STATE_MODIFY;
}

/*********************************************************************************/

/**
 * Function indicates whether or not a court can be updated based upon the in service
 * and SUPS Court indicators
 *
 * @return boolean True if a court is read only, else false
 * @author rzxd7g
 */
function isCourtReadOnly()
{
	var inservice = Services.getValue(Query_SUPSCourt.dataBinding);
	var supsCourt = Services.getValue(CourtData_InService.dataBinding);
	
	if ( supsCourt == "N" || inservice == "N" )
	{
		return true;
	}
	return false;
}

/*********************************************************************************/

/**
 * Function calls the retrieval service to load the details of a court into the screen
 *
 * @param integer courtCode The court code required as a parameter for the service
 * @author rzxd7g
 * 
 */
function loadCourtDetails(courtCode)
{
	var params = new ServiceParams();
	params.addSimpleParameter("courtCode", courtCode);
	Services.callService("getCourtMaintain", params, QueryPopup_OkButton, true);
}

/*********************************************************************************/

/**
 * Function calls the service to determine if the court is a Grouping Court or not
 *
 * @author rzxd7g
 * 
 */
function isGroupingCourt()
{
	var courtCode = Services.getValue(Query_Court_Code.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("courtCode", courtCode);
	Services.callService("isGroupingCourt", params, CourtData_GroupingCourtCode, true);
}

/*********************************************************************************/

/**
 * Function validates a time field
 *
 * @param string xp The xpath of the 'field in error' indicator
 * @param integer value The time to be validated in seconds past midnight
 * @return ErrorCode Error message if the time is invalid else null
 * @author rzxd7g
 */
function localValidateTime(xp, value)
{
	var ec = null;
	
	// If we already know the value is bad, throw the error straight away
	if( Services.getValue(xp) == "N" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
	}

	if ( null == ec && !CaseManUtils.isBlank(value) )
	{
		// The value put in the dom is supposed to be a number, so first check if it is numeric
		ec = CaseManValidationHelper.validatePattern(value, /^\d+$/, "CaseMan_invalidTime_Msg");
		if( null == ec )
		{
			// If it is numeric, check that it is within a valid range
			if( value < 0 || value > 86400 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
			}
		}	
	}
	return ec;
}

/*********************************************************************************/

/**
 * Function transforms the number of seconds into a time in the format hh:mm
 *
 * @param string xp The xpath of the 'field in error' indicator
 * @param integer value The time in seconds past midnight
 * @return string The transformed time
 * @author rzxd7g
 */
function localTransformTimeToDisplay(xp, value)
{
	if( Services.getValue(xp) == "N" )
	{
		return value;
	}
	
	if( null != value && !isNaN(value) )
	{
		var convertedTime = CaseManUtils.convertSecondsToTime(value);
		if( null != convertedTime )
		{
			if( CaseManValidationHelper.validateTime(convertedTime) )
			{
				return convertedTime;
			}
		}
	}
	return value;
}

/*********************************************************************************/

/**
 * Function transforms a time into seconds past midnight
 *
 * @param string xp The xpath of the 'field in error' indicator
 * @param string value The time to be validated in the format hh:mm
 * @return integer The transformed time in seconds past midnight
 * @author rzxd7g
 */
function localTransformTimeToModel(xp, value)
{
	var convertedTime = null;
	if( null != value )
	{
		if(CaseManValidationHelper.validateTime(value))
		{
			Services.setValue(xp, "Y");
			return CaseManUtils.convertTimeToSeconds(value);
		}
	}
	
	Services.setValue(xp, "N");
	return value;
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form
 * @author rzxd7g
 * 
 */
function setDirtyFlag()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	if ( dirtyFlag != "true" )
	{
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "true");
	}
}

/*********************************************************************************/

/**
 * Function returns the state of the data i.e. dirty or not
 *
 * @returns Boolean true if data is dirty, else false
 * @author rzxd7g
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	return (dirtyFlag == "true") ? true : false;
}

/*********************************************************************************/

/**
 * Function handles the clearing of the form's data
 * @author rzxd7g
 * 
 */
function clearFormData()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK);
	Services.endTransaction();
	Services.setFocus("Query_Court_Code");
}

/*********************************************************************************/

/**
 * Function handles the clearing of the subform data
 * @author rzxd7g
 * 
 */
function clearSubformData()
{
	Services.startTransaction();
	Services.setValue(AddNewCourt_CourtName.dataBinding, "");
	Services.setValue(AddNewCourt_CourtId.dataBinding, "");
	Services.setValue(AddNewCourt_DistrictRegistry.dataBinding, "");
	Services.setValue(AddNewCourt_InService.dataBinding, "");
	Services.setValue(AddNewCourt_GroupingCourtCode.dataBinding, "");
	Services.setValue(AddNewCourt_GroupingCourtName.dataBinding, "");
	Services.setValue(AddNewCourt_DMCourtCode.dataBinding, "");
	Services.setValue(AddNewCourt_DMCourtName.dataBinding, "");
	Services.setValue(AddNewCourt_DX.dataBinding, "");
	Services.setValue(AddNewCourt_TelephoneNumber.dataBinding, "");
	Services.setValue(AddNewCourt_FaxNumber.dataBinding, "");
	Services.setValue(AddNewCourt_Court_OpenFrom.dataBinding, "");
	Services.setValue(AddNewCourt_Court_OpenTo.dataBinding, "");
	Services.setValue(AddNewCourt_Court_AccountType.dataBinding, "");
	Services.setValue(AddNewCourt_Court_AccountingCode.dataBinding, "");
	Services.setValue(AddNewCourt_Bailiff_OpenFrom.dataBinding, "");
	Services.setValue(AddNewCourt_Bailiff_OpenTo.dataBinding, "");
	Services.setValue(AddNewCourt_Bailiff_TelephoneNumber.dataBinding, "");
	Services.setValue(AddNewCourt_Bailiff_FaxNumber.dataBinding, "");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Indicates whether or not the new courts fields should be enabled.  The rule
 * being the fields should be disabled if the cour field is blank or invalid.
 *
 * @return boolean True if the court fields should be enabled, else false
 * @author rzxd7g
 */
function newCourtFieldsEnabled()
{
	var adaptor = Services.getAdaptorById("AddNewCourt_CourtCode");
	var value = Services.getValue(AddNewCourt_CourtCode.dataBinding);
	
	if ( CaseManUtils.isBlank(value) || !adaptor.getValid() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

/**
 * Function generates the next unique surrogate key for the address surrogate id node
 *
 * @return string The next unique surrogate id
 * @author rzxd7g
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/*********************************************************************************/

/**
 * Indicates whether or not the court addresses grid is empty
 *
 * @return boolean True if the address grid is empty else false
 * @author rzxd7g
 */
function isAddressGridEmpty()
{
	var gridDB = Services.getValue(Master_CourtAddressGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? true : false;
}

/*********************************************************************************/

/**
 * Handles the exit from the screen back to the main menu
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Transformation method for the Address Type fields
 *
 * @param string addressTypeValue The address type value
 * @return string The address type description
 * @author rzxd7g
 */
function transformAddressTypeToDisplay(addressTypeValue)
{
	var xp = XPathConstants.REF_DATA_XPATH + "/AddressTypes/AddressType[./Value = '" + addressTypeValue + "']/Description";
	return Services.getValue(xp);
}

/*********************************************************************************/

/**
 * Function handles the action to be performed following a save
 * @author rzxd7g
 * 
 */
function postSaveHandler()
{
	var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
	
	switch (tempAction)
	{
		case ActionAfterSave.ACTION_CLEARFORM:
			// User wishes to clear the form following a save
			clearFormData();
			break;
			
		case ActionAfterSave.ACTION_EXIT:
			// User wishes to exit the screen following a save
			exitScreen();
			break;
		
		case ActionAfterSave.ACTION_LOADNEWCOURT:
			// User loading a new record from query popup following a save
			var newCourtCode = Services.getValue(QueryPopup_CourtResultsGrid.dataBinding);
			loadCourtDetails(newCourtCode);
			break;
			
		default:
			// No actions, retrieve the details of the new court
			var courtCode = Services.getValue(Query_Court_Code.dataBinding);
			loadCourtDetails(courtCode);
	}
}
