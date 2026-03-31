/** 
 * @fileoverview CreateHomeWarrants.js:
 * This file contains the configurations for the UC029 - Create Home Warrants screen
 *
 * @author Tim Connor
 *
 * Changes:
 * 30/05/2006 - Chris Vincent, added JavaDoc comments and changed Global Variables to
 *              Static variables.
 * 02/06/2006 - Chris Vincent, changed logic around setting the Live flag for warrants
 *				as the previous logic was incorrect.
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 16/06/2006 - Fixed defect 3628 - non-live warrants incorrectly marked live. DJWright
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 * 16/08/2006 - Chris Vincent, changed Date Request Received logic to ensure the date is not
 * 				blank otherwise found that the screen was crashing.  Defect 4327.
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 04/09/2006 - Paul Robinson, defect 4489 - ensure no preselected parties if more than one party in grids
 * 20/09/2006 - Paul Robinson, defect 5213 - amount of Fee cannot be zero
 * 05/10/2006 - Chris Vincent, fixed defect 5543 so if warrant type is EXECUTION, the Parties Against grid
 * 				should be initially blank if multiple Parties For exist on the case.  Also changed the logic
 * 				for the ClaimantsGrid (Parties For) so if deselected, the Parties Against Grid is blanked.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 21/03/2007 - Chris Vincent, change to setDefendants() so check if the PayDate node is empty before using it
 * 				as it is in rare scenarios which can cause a crash.  CaseMan Defect 6151.
 * 23/04/2007 - Chris Vincent, set the CCBCWarrant node to null if the issuing court code is not CCBC (was
 * 				previously 'N').  CaseMan Defect 6170.
 * 29/08/2007 - Chris Vincent, set the default values when load a warrant to include the Creditor Code which is
 * 				subsequently sent to the server side to determine if an MCOL_DATA row is written away.  Group2 Defect 5316.
 * 13/12/2011 - Chris Vincent, changes to allow POSSESSION and COMMITTAL Warrants to be created on Insolvency Cases.  Trac 4590.
 *				includes changes to Header_CaseNumber.onSuccess() when load case details, and Header_WarrantType.validate()
 *				for insolvency case type validation.  Also changed Header_WarrantType.logic() to populate the Party For and
 *				Party Against grids with the correct parties.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.
 * 11/12/2013 - Chris Vincent (Trac 5025), TCE changes mean EXECUTION warrants replaced with CONTROL warrants instead.
 */

/**
 * XPath Constants
 * @author fzj0yl
 * 
 */
function XPathConstants() {};
XPathConstants.ROOT_XPATH = "/ds";
XPathConstants.VAR_FORM_XPATH = XPathConstants.ROOT_XPATH + "/var/form";
XPathConstants.VAR_PAGE_XPATH = XPathConstants.ROOT_XPATH + "/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.WARRANT_BASE = XPathConstants.ROOT_XPATH + "/Warrant";  // The path for the details of the new warrant
XPathConstants.WARRANTS_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/Warrants"; // The path for any existing warrants for the selected case
XPathConstants.CASE_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/ManageCase";
XPathConstants.JUDGMENT_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/Judgments";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='WARRANT_FEE']/ItemValue";
XPathConstants.SOLICITOR_COSTS_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='SOLICITOR_COSTS']/ItemValue";
XPathConstants.CASENUMBER_VALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/CaseNumberValid";
XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/CaseNumberInvalidCaseType";
XPathConstants.AE_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/AEData/Results";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ActionAfterSave";

/**
 * Actions After Saving
 * @author fzj0yl
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_NAVIGATE = "NAVIGATE";
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";

/******************************* FUNCTIONS *****************************************/

/**
 * Function handles the clearing of the screen, asking the user to confirm before
 * clearing and setting focus back in the Case Number field.
 * @author fzj0yl
 * 
 */
function handleClearScreen()
{
	if ( confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE) )
	{
		// Clear out the case number, this will cause the form to be reset
		Services.setValue(Header_CaseNumber.dataBinding, "");
		Services.setFocus("Header_CaseNumber");
	}
}

/***********************************************************************************/

/**
 * Function clears the necessary parts of the DOM when the Case Number field
 * is set to blank.
 * @author fzj0yl
 * 
 */
function clearScreen() 
{
    Services.startTransaction();
    // Load an empty warrant structure
	var newWarrant = Services.loadDOMFromURL("Warrant.xml");
	Services.replaceNode("/ds/Warrant", newWarrant);
	Services.setValue(XPathConstants.WARRANT_BASE + "/IssueDate", CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	Services.setValue(XPathConstants.WARRANT_BASE + "/CreatedBy", Services.getCurrentUser() );
	Services.setValue(ClaimantsGrid.dataBinding, "");
	Services.setValue(DefendantsGrid.dataBinding, "");
	Services.removeNode(XPathConstants.CASE_BASE);
	Services.removeNode(XPathConstants.JUDGMENT_BASE);
	Services.removeNode(HomeWarrantsParams.PARENT);
	Services.endTransaction();
	Services.setFocus("Header_CaseNumber");
}

/***********************************************************************************/

/**
 * Function adds a party to the 'Select Party For' Grid (unless is already in the grid).
 *
 * @param [Integer] number The role number of the party
 * @param [String] typeCode The role code of the party
 * @author fzj0yl
 * 
 */
function addClaimant(number, typeCode) 
{
    var existing = Services.countNodes(ClaimantsGrid.srcData + "/LitigiousParty[./Number='" + number + "' and ./TypeCode='" + typeCode + "']");
    if ( existing == 0 ) 
    {
        // Only add the party to the list of they have not already been added
        var partyNode = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[./Number='" + number + "' and ./TypeCode='" + typeCode + "']");
        Services.addNode(partyNode.cloneNode(true), ClaimantsGrid.srcData);	            
    }    
}

/***********************************************************************************/

/**
 * Function populates the Party For fields based upon the Party For selected
 * in the Select Party For grid.
 *
 * @param [DOM] claimantNode The party for node to display in the party for fields
 * @author fzj0yl
 * 
 */
function setClaimant(claimantNode) 
{
	if ( null != claimantNode )
	{
		Services.setValue(Claimant_Name.dataBinding, XML.getNodeTextContent(claimantNode.selectSingleNode("Name")));
		
		var solicitorSurrogateId = null;
		var node = claimantNode.selectSingleNode("SolicitorSurrogateId");
		if ( null != node )
		{
			solicitorSurrogateId = XML.getNodeTextContent(node);
		}
		var solicitorNode = claimantNode;
		if(!CaseManUtils.isBlank(solicitorSurrogateId)) 
		{
			var solicitorXPath = XPathConstants.CASE_BASE + "/Parties/Solicitor[SurrogateId='" + solicitorSurrogateId + "']";
			solicitorNode = Services.getNode(solicitorXPath);	
			Services.setValue(Solicitor_Reference.dataBinding, XML.getNodeTextContent(claimantNode.selectSingleNode("SolicitorReference")));
		} 
		else 
		{
			Services.setValue(Solicitor_Reference.dataBinding, XML.getNodeTextContent(claimantNode.selectSingleNode("Reference")));
		}
		
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Code", 			XML.getNodeTextContent(claimantNode.selectSingleNode("Code")));
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Number", 		XML.getNodeTextContent(claimantNode.selectSingleNode("Number")));
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/PartyType",		XML.getNodeTextContent(claimantNode.selectSingleNode("TypeCode")));
		Services.setValue(Solicitor_Name.dataBinding, 				XML.getNodeTextContent(solicitorNode.selectSingleNode("Name")));
		Services.setValue(Solicitor_Address_Line1.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/Line[1]")));
		Services.setValue(Solicitor_Address_Line2.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/Line[2]")));
		Services.setValue(Solicitor_Address_Line3.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/Line[3]")));
		Services.setValue(Solicitor_Address_Line4.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/Line[4]")));
		Services.setValue(Solicitor_Address_Line5.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/Line[5]")));
		Services.setValue(Solicitor_Address_PostCode.dataBinding,	XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/Address/PostCode")));
		Services.setValue(Solicitor_DX.dataBinding, 				XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/DX")));
		Services.setValue(Solicitor_TelephoneNumber.dataBinding, 	XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/TelephoneNumber")));
		Services.setValue(Solicitor_FaxNumber.dataBinding, 			XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/FaxNumber")));
		Services.setValue(Solicitor_EmailAddress.dataBinding, 		XML.getNodeTextContent(solicitorNode.selectSingleNode("ContactDetails/EmailAddress")));
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/Code", 		XML.getNodeTextContent(solicitorNode.selectSingleNode("Code")));
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/Number", 	XML.getNodeTextContent(solicitorNode.selectSingleNode("Number")));
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/PartyType",	XML.getNodeTextContent(solicitorNode.selectSingleNode("TypeCode")));
	} 
	else 
	{
		Services.setValue(Claimant_Name.dataBinding,				"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Code", 			"");		
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Number",		"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/PartyType",		"");
		Services.setValue(Solicitor_Name.dataBinding,				"");
		Services.setValue(Solicitor_Address_Line1.dataBinding,		"");
		Services.setValue(Solicitor_Address_Line2.dataBinding,		"");
		Services.setValue(Solicitor_Address_Line3.dataBinding,		"");
		Services.setValue(Solicitor_Address_Line4.dataBinding,		"");
		Services.setValue(Solicitor_Address_Line5.dataBinding,		"");
		Services.setValue(Solicitor_Address_PostCode.dataBinding,	"");
		Services.setValue(Solicitor_DX.dataBinding,					"");
		Services.setValue(Solicitor_TelephoneNumber.dataBinding,	"");
		Services.setValue(Solicitor_FaxNumber.dataBinding,			"");
		Services.setValue(Solicitor_EmailAddress.dataBinding,		"");
		Services.setValue(Solicitor_Reference.dataBinding,			"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/Code", "");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/Number", "");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Claimant/Representative/PartyType", "");
	}	
}

/***********************************************************************************/

/**
 * Function adds a party to the 'Select Parties Against' Grid (unless is already in the grid).
 *
 * @param [Integer] number The role number of the party
 * @param [String] typeCode The role code of the party
 * @param [Integer] judgmentID The identifier of the Judgment which is recorded against the party
 * @author fzj0yl
 * 
 */
function addDefendant(number, typeCode, judgmentID) 
{
    var existing = Services.countNodes(DefendantsGrid.srcData + "/LitigiousParty[./Number='"+number+"' and ./TypeCode='"+typeCode+"']");
    if ( existing == 0 ) 
    {
        // Only add the party to the list of they have not already been added
        var partyNode = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[./Number='"+number+"' and ./TypeCode='"+typeCode+"']").cloneNode(true);
        
        var judgmentIDNode = XML.createElement(partyNode, "JudgmentID");
        partyNode.appendChild(judgmentIDNode);
        XML.replaceNodeTextContent(judgmentIDNode, judgmentID);
        Services.addNode(partyNode, DefendantsGrid.srcData);	            
    }    
}

/***********************************************************************************/

/**
 * Function populates the Party Against fields based upon the Parties Against selected
 * in the Select Parties Against grid.
 *
 * @param [DOM] defendant1 The first party against node to display
 * @param [DOM] defendant2 The second party against node to display
 * @author fzj0yl
 * @return null 
 */
function setDefendants(defendant1, defendant2) 
{
	// Set Defendant #1 Details
    if( null != defendant1 ) 
    {
		var currentName = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant1/Name");
		var name = XML.getNodeTextContent(defendant1.selectSingleNode("Name"));
		
		if (currentName != name) 
		{
		    var number = XML.getNodeTextContent(defendant1.selectSingleNode("Number"));
		    var typeCode = XML.getNodeTextContent(defendant1.selectSingleNode("TypeCode"));

		    // If the warrant type is POSSESSION or DELIVERY and there is already a live POSSESSION or DELIVERY
		    // warrant against the defendant, show error CaseMan_existingPossessionWarrant_Msg
		    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
		    if ( warrantType == "POSSESSION" || warrantType == "DELIVERY" ) 
		    {
			    var xpath = XPathConstants.WARRANTS_BASE + "/Warrant[./WarrantType = 'POSSESSION' or ./WarrantType = 'DELIVERY']"
			    	+ "[count(./FinalReturnCodes/FinalReturn/Code) = 0]"
			    	+ "[(./Defendant1/Number = '" + number + "' and ./Defendant1/PartyType = '" + typeCode + "') or (./Defendant2/Number = '" + number + "' and ./Defendant2/PartyType = '" + typeCode + "')]";
			    if (Services.countNodes(xpath) > 0) 
			    {
			        alert(ErrorCode.getErrorCode("CaseMan_existingPossessionWarrant_Msg").getMessage());
			        Services.removeNode(DefendantsGrid.dataBinding);
			        return;
			    }
		    }		    
		    
            // If there are any live judgments against the defendant with a future
            // first payment date, show error CaseMan_paymentDateNotElapsed_Msg
            var xpath = XPathConstants.JUDGMENT_BASE + "/Judgment[./Status = '' or ./Status = 'VARIED']"
            		  + "[./CasePartyNumber = '" + number + "' and ./PartyRoleCode = '" + typeCode + "']";            
            var liveJudgments = Services.getNodes(xpath);
			for ( var i=0, l=liveJudgments.length; i<l; i++ ) 
			{
                var firstPaymentDate = XML.getNodeTextContent(liveJudgments[i].selectSingleNode("FirstPayDate"));
                if ( !CaseManUtils.isBlank(firstPaymentDate) ) 
                {
    	            var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
    	        	var date = CaseManUtils.createDate(firstPaymentDate);
    	        	var compare = CaseManUtils.compareDates(today, date);
    	        	if (compare > 0) 
    	        	{
    	        	    // The judgments first payment date has not yet elapsed
    	        	    var partyName = XML.getNodeTextContent(liveJudgments[i].selectSingleNode("PartyAgainstName"));
    	        	    var message = ErrorCode.getErrorCode("CaseMan_paymentDateNotElapsed_Msg").getMessage();
    	                alert(message.replace(/XXX/, partyName));
    	                Services.removeNode(DefendantsGrid.dataBinding);
    	                return;    	        	    
    	        	}
                }
			}
		    
			Services.setValue(Defendant1_Name.dataBinding, 				name);
			Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/Number",		number);
			Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/PartyType",	typeCode);
			Services.setValue(Defendant1_Address_Line1.dataBinding, 	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/Line[1]")));
			Services.setValue(Defendant1_Address_Line2.dataBinding, 	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/Line[2]")));
			Services.setValue(Defendant1_Address_Line3.dataBinding, 	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/Line[3]")));
			Services.setValue(Defendant1_Address_Line4.dataBinding, 	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/Line[4]")));
			Services.setValue(Defendant1_Address_Line5.dataBinding, 	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/Line[5]")));
			Services.setValue(Defendant1_Address_PostCode.dataBinding,	XML.getNodeTextContent(defendant1.selectSingleNode("ContactDetails/Address/PostCode")));
			
			if ( Services.getValue(Header_WarrantType.dataBinding) == "CONTROL" ) 
			{
			    Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/JudgmentID",	XML.getNodeTextContent(defendant1.selectSingleNode("JudgmentID")));
			    
			    // Check for an outstanding "Application to set aside"
			    var count = Services.countNodes(XPathConstants.JUDGMENT_BASE + "/Judgment[./CasePartyNumber='" + number + "' and ./PartyRoleCode='" + typeCode + "']/ApplicationsToSetAside/Application[./Result = '']");
			    if( count > 0 ) 
			    {
			        alert(Messages.PENDING_SET_ASIDE_APPLICATION.replace(/XXX/, name));
			    }			    

			    // Check for an outstanding "Application to vary"
			    var found = false;
			    var applications = Services.getNodes(XPathConstants.JUDGMENT_BASE + "/Judgment[./CasePartyNumber='" + number + "' and ./PartyRoleCode='" + typeCode + "']/ApplicationsToVary/Variation");
			    for( var i=0, l=applications.length; i<l; i++ ) 
			    {
			        var result = XML.getNodeTextContent(applications[i].selectSingleNode("Result"));
			        if ( CaseManUtils.isBlank(result) || result == "REFERRED TO JUDGE" ) 
			        {
			            // Application has no result
			            found = true;
			        }
			        else 
			        {
			        	// CaseMan defect 6151, in some scenarios the PayDate node is empty
			        	var payDateNode = applications[i].selectSingleNode("PayDate");
			        	if ( null != payDateNode && !CaseManUtils.isBlank(XML.getNodeTextContent(payDateNode)) )
			        	{
				            var payDate = XML.getNodeTextContent(payDateNode);
				            var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
				        	var date = CaseManUtils.createDate(payDate);
				        	var compare = CaseManUtils.compareDates(today, date);
				    		if ( compare > 0 ) 
				    		{
				    		    // Application has a future payment date
				    		    found = true;
				    		}
			        	}
			        }
			    }
			    if(found) 
			    {
			        alert(Messages.PENDING_VARY_APPLICATION.replace(/XXX/, name));
			    }
			}
		}
	} 
	else 
	{
		// Defendant #1 is null, blank fields
		Services.setValue(Defendant1_Name.dataBinding,					"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/Number",			"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/PartyType",		"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant1/JudgmentID",		"");
		Services.setValue(Defendant1_Address_Line1.dataBinding, 		"");
		Services.setValue(Defendant1_Address_Line2.dataBinding, 		"");
		Services.setValue(Defendant1_Address_Line3.dataBinding, 		"");
		Services.setValue(Defendant1_Address_Line4.dataBinding, 		"");
		Services.setValue(Defendant1_Address_Line5.dataBinding, 		"");
		Services.setValue(Defendant1_Address_PostCode.dataBinding,		"");
	}	

	// Set Defendant #2 Details
	if ( null != defendant2 ) 
	{
		var currentName = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant2/Name");
		var name = XML.getNodeTextContent(defendant2.selectSingleNode("Name"));
		
		if ( currentName != name ) 
		{
		    var number = XML.getNodeTextContent(defendant2.selectSingleNode("Number"));
		    var typeCode = XML.getNodeTextContent(defendant2.selectSingleNode("TypeCode"));

		    // If the warrant type is POSSESSION or DELIVERY and there is already a live POSSESSION or DELIVERY
		    // warrant against the defendant, show error CaseMan_existingPossessionWarrant_Msg
		    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
		    if ( warrantType == "POSSESSION" || warrantType == "DELIVERY" ) 
		    {
			    var xpath = XPathConstants.WARRANTS_BASE + "/Warrant[./WarrantType = 'POSSESSION' or ./WarrantType = 'DELIVERY']"
			    	+ "[count(./FinalReturnCodes/FinalReturn/Code) = 0]"
			    	+ "[(./Defendant1/Number = '" + number + "' and ./Defendant1/PartyType = '" + typeCode + "') or (./Defendant2/Number = '" + number + "' and ./Defendant2/PartyType = '" + typeCode + "')]";
			    if ( Services.countNodes(xpath) > 0 ) 
			    {
			        alert(ErrorCode.getErrorCode("CaseMan_existingPossessionWarrant_Msg").getMessage());
			        Services.removeNode(DefendantsGrid.dataBinding);
			        return;
			    }
		    }		    
		    
            // If there are any live judgments against the defendant with a future
            // first payment date, show error CaseMan_paymentDateNotElapsed_Msg
            var xpath = XPathConstants.JUDGMENT_BASE + "/Judgment[./Status = '' or ./Status = 'VARIED']"
            		  + "[./CasePartyNumber = '" + number + "' and ./PartyRoleCode = '" + typeCode + "']";            
            var liveJudgments = Services.getNodes(xpath);
			for ( var i=0, l=liveJudgments.length; i<l; i++ ) 
			{
                var firstPaymentDate = XML.getNodeTextContent(liveJudgments[i].selectSingleNode("FirstPayDate"));
                if ( !CaseManUtils.isBlank(firstPaymentDate) ) 
                {
    	            var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
    	        	var date = CaseManUtils.createDate(firstPaymentDate);
    	        	var compare = CaseManUtils.compareDates(today, date);
    	        	if ( compare > 0 ) 
    	        	{
    	        	    // The judgments first payment date has not yet elapsed
    	        	    var partyName = XML.getNodeTextContent(liveJudgments[i].selectSingleNode("PartyAgainstName"));
    	        	    var message = ErrorCode.getErrorCode("CaseMan_paymentDateNotElapsed_Msg").getMessage();
    	                alert(message.replace(/XXX/, partyName));
    	                Services.removeNode(DefendantsGrid.dataBinding);
    	                return;    	        	    
    	        	}
                }
			}
		    
		    Services.setValue(Defendant2_Name.dataBinding, 				name);
			Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/Number",		number);
			Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/PartyType",	typeCode);
			Services.setValue(Defendant2_Address_Line1.dataBinding, 	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/Line[1]")));
			Services.setValue(Defendant2_Address_Line2.dataBinding, 	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/Line[2]")));
			Services.setValue(Defendant2_Address_Line3.dataBinding, 	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/Line[3]")));
			Services.setValue(Defendant2_Address_Line4.dataBinding, 	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/Line[4]")));
			Services.setValue(Defendant2_Address_Line5.dataBinding, 	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/Line[5]")));
			Services.setValue(Defendant2_Address_PostCode.dataBinding,	XML.getNodeTextContent(defendant2.selectSingleNode("ContactDetails/Address/PostCode")));

			if ( Services.getValue(Header_WarrantType.dataBinding) == "CONTROL" ) 
			{
			    Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/JudgmentID",	XML.getNodeTextContent(defendant2.selectSingleNode("JudgmentID")));
			    
			    // Check for an outstanding "Application to set aside"
			    var count = Services.countNodes(XPathConstants.JUDGMENT_BASE + "/Judgment[./CasePartyNumber='" + number + "' and ./PartyRoleCode='" + typeCode + "']/ApplicationsToSetAside/Application[./Result = '']");
			    if ( count > 0 ) 
			    {
			        alert(Messages.PENDING_SET_ASIDE_APPLICATION.replace(/XXX/, name));
			    }
			    
			    // Check for an outstanding "Application to vary"
			    var found = false;
			    var applications = Services.getNodes(XPathConstants.JUDGMENT_BASE + "/Judgment[./CasePartyNumber='" + number + "' and ./PartyRoleCode='" + typeCode + "']/ApplicationsToVary/Variation");
			    for ( var i=0, l=applications.length; i<l; i++ ) 
			    {
			        var result = XML.getNodeTextContent(applications[i].selectSingleNode("Result"));
			        if ( CaseManUtils.isBlank(result) ) 
			        {
			            // Application has no result
			            found = true;
			        } 
			        else 
			        {
			        	// CaseMan defect 6151, in some scenarios the PayDate node is empty
			        	var payDateNode = applications[i].selectSingleNode("PayDate");
			        	if ( null != payDateNode && !CaseManUtils.isBlank(XML.getNodeTextContent(payDateNode)) )
			        	{
				            var payDate = XML.getNodeTextContent(payDateNode);
				            var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
				        	var date = CaseManUtils.createDate(payDate);
				        	var compare = CaseManUtils.compareDates(today, date);
				    		if ( compare > 0 ) 
				    		{
				    		    // Application has a future payment date
				    		    found = true;
				    		}
			        	}
			        }
			    }
			    if ( found ) 
			    {
			        alert(Messages.PENDING_VARY_APPLICATION.replace(/XXX/, name));
			    }
			}		
		}
	} 
	else 
	{
		// Defendant #2 is null, blank fields
		Services.setValue(Defendant2_Name.dataBinding,					"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/Number",			"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/PartyType",		"");
		Services.setValue(XPathConstants.WARRANT_BASE + "/Defendant2/JudgmentID",		"");
		Services.setValue(Defendant2_Address_Line1.dataBinding, 		"");
		Services.setValue(Defendant2_Address_Line2.dataBinding, 		"");
		Services.setValue(Defendant2_Address_Line3.dataBinding, 		"");
		Services.setValue(Defendant2_Address_Line4.dataBinding, 		"");
		Services.setValue(Defendant2_Address_Line5.dataBinding, 		"");
		Services.setValue(Defendant2_Address_PostCode.dataBinding,		"");
	}	
}

/***********************************************************************************/

/**
 * Function adds all the parties for on a Judgment specified into the 'Select Party For' grid
 * and the party against on same Judgment into the 'Select Parties Against' grid.
 *
 * @param [DOM] judgmentNode The Judgment node to extract the parties for and party against
 * @author fzj0yl
 * 
 */
function selectJudgment(judgmentNode) 
{
    var forNodes = judgmentNode.selectNodes("InFavourOf/Parties/Party");
    for ( var j=0, l=forNodes.length; j<l; j++ ) 
    {
        var number = XML.getNodeTextContent(forNodes[j].selectSingleNode("CasePartyNumber"));
        var typeCode = XML.getNodeTextContent(forNodes[j].selectSingleNode("PartyRoleCode"));
        var partyNode = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[./Number='"+number+"' and ./TypeCode='"+typeCode+"']");
        Services.addNode(partyNode.cloneNode(true), ClaimantsGrid.srcData);
    }
    
    var againstNodes = judgmentNode.selectNodes("Against/Parties/Party");
    for ( var j=0, l=againstNodes.length; j<l; j++ ) 
    {
        var number = XML.getNodeTextContent(againstNodes[j].selectSingleNode("CasePartyNumber"));
        var typeCode = XML.getNodeTextContent(againstNodes[j].selectSingleNode("PartyRoleCode"));
        var partyNode = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[./Number='"+number+"' and ./TypeCode='"+typeCode+"']");
        Services.addNode(partyNode.cloneNode(true), DefendantsGrid.srcData);
    }    
}

/***********************************************************************************/

/**
 * Function converts a currency code into the appropriate currency symbol for display.
 *
 * @param [String] value The currency code to be converted
 * @return [String] The appropriate currency symbol for the code passed in
 * @author fzj0yl
 */
function transformCurrencyToDisplay(value) 
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/***********************************************************************************/

/**
 * Function converts a currency symbol into the appropriate currency code for the DOM.
 *
 * @param [String] value The currency symbol to be converted
 * @return [String] The appropriate currency code for the symbol passed in
 * @author fzj0yl
 */
function transformCurrencyToModel(value) 
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/***********************************************************************************/

/**
 * Function converts a string to upper case.
 *
 * @param [String] value The string to be converted to upper case
 * @return [String] The string passed in converted to upper case
 * @author fzj0yl
 */
function toUpperCase(value) 
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
 * @author fzj0yl
 */
function convertToUpperStripped(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/***********************************************************************************/

/**
 * Function indicates whether or not the header fields (Case Number, Warrant Type and 
 * Date Request Received) are complete and valid.
 *
 * @return [Boolean] True if the header fields have been entered and are all valid, else False
 * @author fzj0yl
 */
function areHeaderFieldsEntered() 
{
	var blnValid = true;
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    var dateRequestReceived = Services.getValue(Header_DateRequestReceived.dataBinding);
    
    if( CaseManUtils.isBlank(caseNumber) || !Services.getAdaptorById("Header_CaseNumber").getValid()) 
    {
        blnValid = false;
    }
    else if ( CaseManUtils.isBlank(warrantType) || !Services.getAdaptorById("Header_WarrantType").getValid() ) 
    {
        blnValid = false;
    }
    else if(CaseManUtils.isBlank(dateRequestReceived) || !Services.getAdaptorById("Header_DateRequestReceived").getValid()) 
    {
        blnValid = false;
    }
    
    return blnValid;
}

/*********************************************************************************/

/**
 * Function validates a date entered by checking if is a non working day.
 *
 * @param [String] date The date to be validated in the format YYYY-MM-DD
 * @return [Boolean] True if the date is NOT a non working day (valid), else False (invalid)
 * @author fzj0yl
 */
function validateNonWorkingDate(date) 
{
 	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") ) 
 	{
 		return false;
 	}
 	return true;
}

/*********************************************************************************/

/**
 * Function ensures that a check for unsaved changes is made before exiting
 * @author fzj0yl
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function indicates whether or not there are unsaved changes on the screen.
 * @return [Boolean] True if unsaved changes exist, else False
 * @author fzj0yl
 */
function changesMade()
{
	// If the case number is not blank then changes have been made
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	return !CaseManUtils.isBlank(caseNumber)
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen
 * @author fzj0yl
 * 
 */
function exitScreen()
{
	Services.removeNode(HomeWarrantsParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/******************************* FORM ELEMENT ***************************************/

function createHomeWarrants() {}

// Load the reference data from the xml into the model
createHomeWarrants.refDataServices = [
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourts", serviceParams:[]},
	{name:"CaseTypeRules", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"../../CaseTypeRules.xml"},
	{name:"WarrantTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getWarrantTypes", serviceParams:[]},
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"SystemData", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData", serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/**
 * @author fzj0yl
 * 
 */
createHomeWarrants.initialise = function() 
{
	// Load an empty warrant structure
	var newWarrant = Services.loadDOMFromURL("Warrant.xml");
	
	Services.startTransaction();
	Services.replaceNode("/ds/Warrant", newWarrant);
	Services.setValue(XPathConstants.WARRANT_BASE + "/IssueDate", CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	Services.setValue(XPathConstants.WARRANT_BASE + "/CreatedBy", Services.getCurrentUser() );
	Services.endTransaction();
	
	// Load Case Number from previous screen
	var extCaseNumber = Services.getValue(HomeWarrantsParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank(extCaseNumber) )
	{
		// Set the Case Number
	    Services.setValue(Header_CaseNumber.dataBinding, extCaseNumber);
	}
}

/*******************************  FIELDS *************************************/

function Header_CaseNumber() {};
Header_CaseNumber.dataBinding = XPathConstants.WARRANT_BASE + "/CaseNumber";
Header_CaseNumber.tabIndex = 1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isReadOnly = function() { return false; }
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.validateOn = [XPathConstants.CASENUMBER_VALID_XPATH, XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH];
Header_CaseNumber.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) ) 
	{
		// Validate the Case Number pattern
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);
		
		var valid_ind = Services.getValue(XPathConstants.CASENUMBER_VALID_XPATH);
		if ( null == ec && !CaseManUtils.isBlank(valid_ind) )
		{
			// The Case Number cannot be used to create a warrant
			ec = ErrorCode.getErrorCode(valid_ind);

			var invalidCaseType = Services.getValue(XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH);
			if ( !CaseManUtils.isBlank(invalidCaseType) )
			{
				// Dynamic Error Message
				ec.m_message = ec.m_message.replace(/XXX/, invalidCaseType);
			}
		}
	}
	return ec;
}
Header_CaseNumber.logicOn = [Header_CaseNumber.dataBinding];
Header_CaseNumber.logic = function(event) 
{
	if( event.getXPath() != Header_CaseNumber.dataBinding ) 
	{
		return;
	}
	
	var valid_ind = Services.getValue(XPathConstants.CASENUMBER_VALID_XPATH);
	if ( !this.getValid() && CaseManUtils.isBlank(valid_ind) ) 
	{
		return;
	}

	// Copy across the existing Case Number
	var caseNumber = Services.getValue(this.dataBinding);	
	if ( CaseManUtils.isBlank(caseNumber) ) 
	{
		clearScreen();
		return;
	}

	// Retrieve any existing warrants for the case
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber.toUpperCase());
	params.addSimpleParameter("localNumber", "");
	params.addSimpleParameter("warrantNumber", "");
	Services.callService("searchWarrants", params, Header_CaseNumber, true);			
}

/**
 * @param newDom
 * @param serviceName
 * @author fzj0yl
 * @return null, AgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]") , AgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]") , AgainstD2 ) 
 */
Header_CaseNumber.onSuccess = function(newDom, serviceName)
{
	if ( null == newDom ) 
	{
	    return;
	}

	if ( serviceName == "searchWarrants" ) 
	{
		
        // Process the results of the searchWarrants call
	    Services.replaceNode(XPathConstants.WARRANTS_BASE, newDom.selectSingleNode("/ds/Warrants"));
	    
	    /*
        var warrants = Services.getNodes(XPathConstants.WARRANTS_BASE + "/Warrant");
        for(var i = 0 ; i < warrants.length ; i++) 
        {
            var finalReturn = warrants[i].selectSingleNode("/FinalReturnCodes/Code[1]");
            if(finalReturn == null) 
            {
                var warrantID = XML.getNodeTextContent(warrants[i].selectSingleNode("/WarrantID"));
                Services.setValue(XPathConstants.WARRANTS_BASE + "/Warrant[./WarrantID='" + warrantID + "']/Live", "Y");
            }
        }
        */
        
        // Set the live flag for each warrant
        var count = Services.countNodes(XPathConstants.WARRANTS_BASE + "/Warrant");
        for ( var i=0; i<count; i++ )
        {
        	// Set the root xpath for the current warrant in the loop
        	var warrantXPath = XPathConstants.WARRANTS_BASE + "/Warrant[" + (i+1) + "]";
        	var isWarrantLive = "Y";
        	
        	// Warrant is live if there are no final warrant returns
        	var countFinalReturns = Services.countNodes(warrantXPath + "/FinalReturnCodes/FinalReturn");
        	if ( countFinalReturns > 0 )
        	{
	        	// Determine if there are two parties against, or just one
	        	var def2Name = Services.getValue(warrantXPath + "/Defendant2/Name");
	        	var twoDefendants = CaseManUtils.isBlank(def2Name) ? false : true;
	        	
	        	if ( twoDefendants )
	        	{
	        		// Two parties against, so is not live if a final return exists against
	        		// both parties, else live.
	        		var returnAgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]");
	        		var returnAgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]");
					if ( returnAgainstD1 && returnAgainstD2 )
					{
						isWarrantLive = "N";
					}
	        	}
	        	else
	        	{
	        		// One party against so if any final returns exist, is not live
	        		isWarrantLive = "N";
	        	}
            }
            Services.setValue(warrantXPath + "/Live", isWarrantLive);
        }
	    
	    // Alert the user if there are any existing warrants for the case
		var countLiveWarrants = Services.countNodes(XPathConstants.WARRANTS_BASE + "/Warrant[./Live='Y']");
		if( countLiveWarrants > 0 ) 
		{
		    alert(Messages.WARRANTS_EXIST_FOR_CASE);
		}

    	// Retrieve the details of the case.
        var caseNumber = Services.getValue(this.dataBinding);
    	var params = new ServiceParams();
    	params.addSimpleParameter("caseNumber", caseNumber.toUpperCase());
    	Services.callService("getCase", params, Header_CaseNumber, true);        	    
	} 
	else 
	{
	    // Process the results of the getCase call
		var caseData = newDom.selectSingleNode("/ds/ManageCase");
		if( null == caseData ) 
		{
			// The case does not exist
			Services.setValue(XPathConstants.CASENUMBER_VALID_XPATH, "CaseMan_caseDoesNotExist_Msg");
			Services.setFocus("Header_CaseNumber");
			//alert(ErrorCode.getErrorCode("CaseMan_caseDoesNotExist_Msg").getMessage());
			return;
		}
		
		// Check if warrants can be created for the current case type
		var caseType = XML.getNodeTextContent(caseData.selectSingleNode("CaseType"));
		var caseGrouping = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type='" + caseType + "']/Grouping");
		if ( caseGrouping == "MAGS_ORDER" ) 
		{
		    // Cannot create warrants for  mags order cases
			Services.setValue(XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH, caseType);
			Services.setValue(XPathConstants.CASENUMBER_VALID_XPATH, "CaseMan_warrantInvalidCaseType_Msg");
			Services.setFocus("Header_CaseNumber");
			return;		    
		}
		
		// Check if the case has been transferred
		var caseStatus = XML.getNodeTextContent(caseData.selectSingleNode("CaseStatus"));
		if ( caseStatus == "TRANSFERRED" ) 
		{
			//alert(ErrorCode.getErrorCode("CaseMan_caseTransferred_Msg").getMessage());
			Services.setValue(XPathConstants.CASENUMBER_VALID_XPATH, "CaseMan_caseTransferred_Msg");
			Services.setFocus("Header_CaseNumber");
			return;		    
		}
		
		// Blank the error indicators
		Services.setValue(XPathConstants.CASENUMBER_VALID_XPATH, "");
		Services.setValue(XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH, "");
		
		// Check if the case has any outstanding hearings
		var hearingNode = caseData.selectSingleNode("HearingDetails/Date");
		if ( hearingNode != null ) 
		{
			var hearingDate = XML.getNodeTextContent(hearingNode);
	        var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	    	var date = CaseManUtils.createDate(hearingDate);
			if ( CaseManUtils.compareDates(today, date) > 0 ) 
			{
			    // Hearing has a future date, so is outstanding
			    var venue = XML.getNodeTextContent(caseData.selectSingleNode("HearingDetails/VenueName"));
		        var message = Messages.PENDING_HEARING.replace(/XXX/, CaseManUtils.convertDateToDisplay(hearingDate));
		        message = message.replace(/YYY/, venue);
			    alert(message);
			}		    
		}
		
		Services.startTransaction();

		// Add the Manage Case data to the dom for reference later
		Services.replaceNode(XPathConstants.CASE_BASE, caseData);
		// Remove any judgment data that may have been 
		Services.removeNode(XPathConstants.JUDGMENT_BASE);
		
		var owningCourtCode = Services.getValue(XPathConstants.CASE_BASE + "/OwningCourtCode");
		var creditorCode = Services.getValue(XPathConstants.CASE_BASE + "/CreditorCode");
		
		// Set default values based on the case data
		Services.setValue(XPathConstants.WARRANT_BASE + "/IssuedBy", owningCourtCode);
		Services.setValue(XPathConstants.WARRANT_BASE + "/OwnedBy", owningCourtCode);
		Services.setValue(ExecutingCourtCode.dataBinding, owningCourtCode);
		Services.setValue(Header_DateRequestReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
		Services.setValue(XPathConstants.WARRANT_BASE + "/CreditorCode", creditorCode);
		
		// If the owning court code is CCBC, set the CCBCWarrant flag
		if ( owningCourtCode == CaseManUtils.CCBC_COURT_CODE ) 
		{
		    Services.setValue(XPathConstants.WARRANT_BASE + "/CCBCWarrant", "Y");
		}
		else 
		{
		    Services.setValue(XPathConstants.WARRANT_BASE + "/CCBCWarrant", "");
		}
		
		var caseStatus = Services.getValue(XPathConstants.CASE_BASE + "/CaseStatus");
		if ( "PAID" == caseStatus ) 
		{
		    // Only COMMITTAL warrants can be created for PAID cases, so default to committal
		    Services.setValue(Header_WarrantType.dataBinding, "COMMITTAL");    
		} 
		else 
		{
		    // Set the warrant type to the default for this case type
		    var warrantType = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type='" + caseType + "']/DefaultWarrantType")
		    // Need to blank first otherwise Header_WarrantType.logic will not be fired 
		    // in scenarios where the newly retrieved warrant type matches the previous one
		    Services.setValue(Header_WarrantType.dataBinding, "");
		    Services.setValue(Header_WarrantType.dataBinding, warrantType);
		}
		
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);

		// Set the external Case Number
		Services.setValue( HomeWarrantsParams.CASE_NUMBER, caseNumber );
	
		// Check that the cases owning court is the same as the users admin crown court
		if ( owningCourtCode != Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) ) 
		{
		    alert(Messages.CASE_OWNED_BY_OTHER_COURT);
		}
		Services.endTransaction();
    }
}

Header_CaseNumber.transformToDisplay = toUpperCase;
Header_CaseNumber.transformToModel = toUpperCase;

/***********************************************************************************/

function Header_WarrantType() {};
Header_WarrantType.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantType";
Header_WarrantType.tabIndex = 2;
Header_WarrantType.componentName = "Warrant Type";
Header_WarrantType.helpText = "Enter the type of warrant issued (eg Control, Possession)";
Header_WarrantType.isMandatory = function() { return true; }
Header_WarrantType.srcData = XPathConstants.REF_DATA_XPATH + "/WarrantTypes";
Header_WarrantType.rowXPath = "WarrantType";
Header_WarrantType.keyXPath = "Type";
Header_WarrantType.displayXPath = "Type";
Header_WarrantType.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASENUMBER_VALID_XPATH, XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH];
Header_WarrantType.isEnabled = function() 
{
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    var caseNumberObj = Services.getAdaptorById("Header_CaseNumber");
    if ( CaseManUtils.isBlank(caseNumber) || !caseNumberObj.getValid() ) 
    {
        return false;
    }
    return true;
}

Header_WarrantType.validate = function() 
{
    var ec = null;
	var value = Services.getValue(this.dataBinding);
	var caseStatus = Services.getValue(XPathConstants.CASE_BASE + "/CaseStatus");
	var caseType = Services.getValue(XPathConstants.CASE_BASE + "/CaseType");
	var caseGrouping = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type='" + caseType + "']/Grouping");
	
	if ( "PAID" == caseStatus && value != "COMMITTAL" ) 
	{
	    // Can only add Committal Warrants if the Case Status is PAID
		ec = ErrorCode.getErrorCode("CaseMan_onlyCommittalAllowed_Msg");
	}
	else if ( caseGrouping == "INSOLVENCY" && ( value != "COMMITTAL" && value != "POSSESSION" ) )
	{
		// Only COMMITTAL or POSSESSION Warrants can be created on Insolvency Cases
		ec = ErrorCode.getErrorCode("CaseMan_invalidWarrantType_Msg");
	}
	return ec;
}

Header_WarrantType.logicOn = [Header_WarrantType.dataBinding];
Header_WarrantType.logic = function() {
    if(!this.getValid()) {
        return;
    }
    
	Services.startTransaction();
	Services.removeNode(ClaimantsGrid.dataBinding);					// Clear out any selection in the Claimants Grid
	Services.removeNode(DefendantsGrid.dataBinding);				// Clear out any selection in the Defendants Grid
	Services.removeNode(ClaimantsGrid.srcData + "/LitigiousParty");	// Clear out the Claimants Grid srcData
	Services.removeNode(DefendantsGrid.srcData + "/LitigiousParty");// Clear out the Defendants Grid srcData
	Services.removeNode(XPathConstants.JUDGMENT_BASE);

	    
	var value = Services.getValue(Header_WarrantType.dataBinding);
	var defaultValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type=" + XPathConstants.CASE_BASE + "/CaseType]/DefaultWarrantType")
	if(!CaseManUtils.isBlank(value) && value != defaultValue) {
	    // The user has selected a warrant type which is not standard for this case type.
	    var caseStatus = Services.getValue(XPathConstants.CASE_BASE + "/CaseStatus");
	    if(caseStatus != "PAID" || value != "COMMITTAL") {
	        alert(Messages.WRONG_WARRANT_TYPE);
	    }
	}
	
	if(value == "POSSESSION" || value == "DELIVERY") {
		// Populate the party select lists for a POSSESSION warrant.  For POSSESSION,
		// the "party for" can be any of the claimants, and the "parties against" can be any of
		// the defendants (maximum of 2).
		
		var claimants = Services.getNodes(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[TypeCode='CLAIMANT' or TypeCode='CREDITOR' or TypeCode='OFF REC' or TypeCode='INS PRAC' or TypeCode='PETITIONER' or TypeCode='TRUSTEE']");
		for(var i = 0 ; i < claimants.length ; i++) {
			Services.addNode(claimants[i].cloneNode(true), ClaimantsGrid.srcData);
		}
		
		// Retrieve the defendants details
		var defendants = Services.getNodes(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[TypeCode='DEFENDANT' or TypeCode='DEBTOR' or TypeCode='COMPANY' or TypeCode='TRUSTEE']");
		for(var i = 0 ; i < defendants.length ; i++) {
			Services.addNode(defendants[i].cloneNode(true), DefendantsGrid.srcData);
		}
	} else if(value == "COMMITTAL") {
		// Populate the party select lists for a COMMITTAL warrant.  For COMMITTAL,
		// the claimant and the defendant can be any party, but there can only be 1
		// of each.		
		var claimants = Services.getNodes(XPathConstants.CASE_BASE + "/Parties/LitigiousParty");
		for(var i = 0 ; i < claimants.length ; i++) {
			Services.addNode(claimants[i].cloneNode(true), ClaimantsGrid.srcData);
		}

		
		// Retrieve the defendants details
		var defendants = Services.getNodes(XPathConstants.CASE_BASE + "/Parties/LitigiousParty");
		for(var i = 0 ; i < defendants.length ; i++) {
			Services.addNode(defendants[i].cloneNode(true), DefendantsGrid.srcData);
		}
	} 
	else if(value == "CONTROL") 
	{
	    // The warrant is a CONTROL warrant, so we need to grab the list of current
	    // outstanding judgments for the case.  For CONTROL warrants, the claimant
	    // and defendants must be linked to a judgment.
	    // Also need a list of AEs
	    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber", caseNumber);
		params.addSimpleParameter("caseNumber", caseNumber);
		Services.callService("getJudgment", params, Header_WarrantType, true);
		Services.callService("warrantsearchAe", params, Header_WarrantType, true);
	}

	Services.endTransaction();
}

/**
 * @param newDom
 * @param serviceName
 * @author fzj0yl
 * @return null 
 */
Header_WarrantType.onSuccess = function(newDom, serviceName) 
{
	if ( serviceName == "getJudgment" )
	{
		// Handle the Judgment Data
	    var judgmentData = newDom.selectSingleNode("/ds/MaintainJudgment/Judgments");
	
		// Add the Judgments data to the dom for reference later
		Services.replaceNode(XPathConstants.JUDGMENT_BASE, judgmentData);
		
		var countJudgments = Services.countNodes(XPathConstants.JUDGMENT_BASE + "/Judgment");
		for ( var i=0; i<countJudgments; i++ )
		{
			var rootXPath = XPathConstants.JUDGMENT_BASE + "/Judgment[" + (i+1) + "]";
			var judgmentStatus = Services.getValue(rootXPath + "/Status");
			var warrantId = Services.getValue(rootXPath + "/WarrantId");
			
			if (false == ( judgmentStatus == "" || judgmentStatus == null || judgmentStatus == "VARIED" ))
			{
				// Remove any judgments that are not in the correct status
				Services.setValue(rootXPath + "/MarkForDelete", "true");
			} 
			// this part should now be superfluous as the Warrants.getJudgments method doesn't return Judgments
			// that have a live Warrant associated with them
			else if ( !CaseManUtils.isBlank(warrantId) )
			{
				var warrantLive = Services.getValue(XPathConstants.WARRANTS_BASE + "/Warrant[./WarrantID = '" + warrantId + "']/Live");
				if ( warrantLive == "Y" )
				{
					// Remove any judgments that already have live warrant associated with them
					Services.setValue(rootXPath + "/MarkForDelete", "true");
				}
			}
		}
		
		// Remove any invalid Judgments
		Services.removeNode(XPathConstants.JUDGMENT_BASE + "/Judgment[./MarkForDelete = 'true']");
		var count = Services.countNodes(XPathConstants.JUDGMENT_BASE + "/Judgment");
		if ( count == 0 ) 
		{
			// There are no valid judgments for this case
			alert(ErrorCode.getErrorCode("CaseMan_validJudgmentMustExist_Msg").getMessage());
			return;
		}
		
		// Clear out the claimants list
		Services.removeNode(ClaimantsGrid.srcData + "/LitigiousParty");	
		
		var parties = Services.getNodes(XPathConstants.JUDGMENT_BASE + "/Judgment/InFavourParties/Party");
		for(var i = 0 ; i < parties.length ; i++) {
	        var n = XML.getNodeTextContent(parties[i].selectSingleNode("CasePartyNumber"));
	        var t = XML.getNodeTextContent(parties[i].selectSingleNode("PartyRoleCode"));
	        addClaimant(n, t);
		}
		
		// Defect 5543 - for CONTROL warrants, the Party Against grid was being incorrectly
		// populated if multiple Parties For existed.  Code below added to clear the Party Against
		// grid if multiple Parties For exist when select CONTROL from Warrant Type list.
		var countPartiesFor = Services.countNodes(ClaimantsGrid.srcData + "/LitigiousParty");
		if ( countPartiesFor > 1 )
		{
			Services.removeNode(DefendantsGrid.srcData + "/LitigiousParty");
		}
	}
	else if ( serviceName == "warrantsearchAe" )
	{
		// Handle the AE Data (set the Live flag for each AE)
		Services.startTransaction();
		Services.replaceNode(XPathConstants.AE_BASE, newDom);
		var countAEs = Services.countNodes(XPathConstants.AE_BASE + "/AERecord");		
		for ( var i=0; i<countAEs; i++ )
		{
			var aeRootXPath = XPathConstants.AE_BASE + "/AERecord[" + (i + 1) + "]";
			var countEvents = Services.countNodes(aeRootXPath + "/AEEvents/Event");
			var liveStatus = "Y";
			if ( countEvents > 0 )
			{
				var latestEventId = Services.getValue(aeRootXPath + "/AEEvents/Event[1]/EventId");
				liveStatus = ( latestEventId == "900" ) ? "Y" : "N";
			}
			Services.setValue(aeRootXPath + "/Live", liveStatus);
		}
		Services.endTransaction();
		
		var countLiveAes = Services.countNodes(XPathConstants.AE_BASE + "/AERecord[./Live = 'Y']");
		if ( countLiveAes > 0 )
		{
			// Live Aes exist on the case, display warning
			alert(Messages.LIVE_AEORDER_MESSAGE);
		}
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Header_WarrantType.onBusinessException = function(exception) {
	alert("Unable to load judgment details.");
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Header_WarrantType.onSystemException = function(exception) 
{
    alert("Unable to load judgment details.");
}

function Header_WarrantTypeLOVButton() {};
Header_WarrantTypeLOVButton.tabIndex = 3;
Header_WarrantTypeLOVButton.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASENUMBER_VALID_XPATH, XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH];
Header_WarrantTypeLOVButton.isEnabled = function() 
{
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    var caseNumberObj = Services.getAdaptorById("Header_CaseNumber");
    if ( CaseManUtils.isBlank(caseNumber) || !caseNumberObj.getValid() ) 
    {
        return false;
    }
    return true;
}

/***********************************************************************************/

function Header_DateRequestReceived() {};
Header_DateRequestReceived.dataBinding = XPathConstants.WARRANT_BASE + "/DateRequestReceived";
Header_DateRequestReceived.tabIndex = 4;
Header_DateRequestReceived.componentName = "Date Request Received";
Header_DateRequestReceived.helpText = "Date the request to issue was received at the court.";
Header_DateRequestReceived.weekends = false;
Header_DateRequestReceived.isMandatory = function() { return true; }
Header_DateRequestReceived.updateMode = "clickCellMode"
Header_DateRequestReceived.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASENUMBER_VALID_XPATH, XPathConstants.CASENUMBER_VALID_CASETYPE_XPATH, Header_WarrantType.dataBinding];
Header_DateRequestReceived.isEnabled = function() 
{
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    var caseNumberObj = Services.getAdaptorById("Header_CaseNumber");
    if ( CaseManUtils.isBlank(caseNumber) || !caseNumberObj.getValid() ) 
    {
        return false;
    }
    return true;
}
Header_DateRequestReceived.logicOn = [Header_DateRequestReceived.dataBinding];
Header_DateRequestReceived.logic = function(event) 
{
    if ( event.getXPath() != Header_DateRequestReceived.dataBinding || !this.getValid() ) 
    {
        return;
    }
    
	var value = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		// Check for a future date
		var date = CaseManUtils.createDate(value);
		if ( null != date ) 
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate") );	    
			var oneMonthAgo = CaseManUtils.oneMonthEarlier(today);
			compare = CaseManUtils.compareDates(date, oneMonthAgo);
			if ( compare > 0 ) 
			{
		    	alert(Messages.DATEOVER1MONTH_MESSAGE);
			}
		}
	}   
}
Header_DateRequestReceived.validateOn = [Header_DateRequestReceived.dataBinding];
Header_DateRequestReceived.validate = function() 
{
	var value = Services.getValue(this.dataBinding);

	if (CaseManUtils.convertDateToDisplay(value) == null) {
		return ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');		
	}
	
	if(!validateNonWorkingDate(value)) {
	    return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
	}

	var date = CaseManUtils.createDate(value);

	// Check for a future date
	if (null != date) {
	    var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
		var compare = CaseManUtils.compareDates(today, date);
		if(compare > 0) {
		    return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
	}
}

/***********************************************************************************/

function Header_IssuedByCourtCode() {};
Header_IssuedByCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/IssuedBy";
Header_IssuedByCourtCode.tabIndex = 5;
Header_IssuedByCourtCode.maxLength = 3;
Header_IssuedByCourtCode.componentName = "Issued By";
Header_IssuedByCourtCode.helpText = "The code of the court who originally issued the warrant.";
Header_IssuedByCourtCode.isReadOnly = function() { return true; }
Header_IssuedByCourtCode.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding];
Header_IssuedByCourtCode.isEnabled = function() {
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    if(CaseManUtils.isBlank(caseNumber)) {
        return false;
    }
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(CaseManUtils.isBlank(warrantType)) {
        return false;
    }
    return true;
}

/***********************************************************************************/

function Header_IssuedByCourtName() {};
Header_IssuedByCourtName.dataBinding = XPathConstants.WARRANT_BASE + "/IssuedBy";
Header_IssuedByCourtName.tabIndex = 6;
Header_IssuedByCourtName.componentName = "Issued By Name";
Header_IssuedByCourtName.helpText = "The name of the court who originally issued the warrant.";
Header_IssuedByCourtName.isReadOnly = function() { return true; }
Header_IssuedByCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_IssuedByCourtName.rowXPath = "Court";
Header_IssuedByCourtName.keyXPath = "Code";
Header_IssuedByCourtName.displayXPath = "Name";
Header_IssuedByCourtName.strictValidation = true;
Header_IssuedByCourtName.transformToDisplay = toUpperCase;
Header_IssuedByCourtName.transformToModel = toUpperCase;
Header_IssuedByCourtName.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding];
Header_IssuedByCourtName.isEnabled = function() {
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    if(CaseManUtils.isBlank(caseNumber)) {
        return false;
    }
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(CaseManUtils.isBlank(warrantType)) {
        return false;
    }
    return true;
}


/******************************* CLAIMANT FIELDS **********************************/

function ClaimantsGrid() {};
ClaimantsGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedClaimant";
ClaimantsGrid.tabIndex = 10;
ClaimantsGrid.srcData = "/ds/var/page/ClaimantsList";
ClaimantsGrid.rowXPath = "*";
ClaimantsGrid.keyXPath = "PartyId";
ClaimantsGrid.columns = [
	{xpath: "Number"},
	{xpath: "Type", defaultSort:"true"},
	{xpath: "Name"}	
];
ClaimantsGrid.multipleSelection = true;
ClaimantsGrid.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
ClaimantsGrid.isEnabled = areHeaderFieldsEntered;
ClaimantsGrid.logicOn = [ClaimantsGrid.dataBinding, ClaimantsGrid.dataBinding + "/PartyId"];
ClaimantsGrid.logic = function(event) {
	if(event.getXPath() == "/") {
		return;
	}
	
	Services.startTransaction();

	var claimantNodes = Services.getNodes(ClaimantsGrid.dataBinding + "/PartyId");
	var selectedParty = null;
	if(claimantNodes.length == 0) {
		setClaimant(null);
	} else if(claimantNodes.length == 1) {
		var partyId = XML.getNodeTextContent(claimantNodes[0]);
		selectedParty = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[PartyId=" + partyId + "]");
		
		// Check that the selected party is not already a defendant
	    var number = XML.getNodeTextContent(selectedParty.selectSingleNode("Number"));
	    var typeCode = XML.getNodeTextContent(selectedParty.selectSingleNode("TypeCode"));
		var defendant1Number = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant1/Number");
		var defendant1TypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant1/PartyType");
		var defendant2Number = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant2/Number");
		var defendant2TypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant2/PartyType");
	    if((number == defendant1Number && typeCode == defendant1TypeCode) || (number == defendant2Number && typeCode == defendant2TypeCode)) {
	        // Trying to pick the same claimant as one of the defendants
	        Services.removeNode(ClaimantsGrid.dataBinding + "/PartyId");
	        Services.endTransaction();
	        return;
	    } else {
	        setClaimant(selectedParty);    
	    }
	} else {
	    // A claimant is already selected, and the user is picking a different one, and as the grid is a
	    // multi select, there will now be two rows selected.  Use the second as its the one that has just
	    // been selected in the grid.  The first must be removed.
		var partyId = XML.getNodeTextContent(claimantNodes[1]);
		selectedParty = Services.getNode(XPathConstants.CASE_BASE + "/Parties/LitigiousParty[PartyId=" + partyId + "]");

		// Check that the selected party is not already a defendant
	    var number = XML.getNodeTextContent(selectedParty.selectSingleNode("Number"));
	    var typeCode = XML.getNodeTextContent(selectedParty.selectSingleNode("TypeCode"));
		var defendant1Number = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant1/Number");
		var defendant1TypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant1/PartyType");
		var defendant2Number = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant2/Number");
		var defendant2TypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Defendant2/PartyType");
	    if((number == defendant1Number && typeCode == defendant1TypeCode) || (number == defendant2Number && typeCode == defendant2TypeCode)) {
	        // Trying to pick the same claimant as one of the defendants.  Clear the new selection, leaving
	        // the original selected
	        Services.removeNode(ClaimantsGrid.dataBinding + "/PartyId[2]");
	        Services.endTransaction();
	        return;
	    } else {
	        setClaimant(selectedParty);
	        // Clear out the original selection
	        Services.removeNode(ClaimantsGrid.dataBinding + "/PartyId[1]");
	    }
	}
	
	var warrantType = Services.getValue(Header_WarrantType.dataBinding);
	if ( selectedParty != null && warrantType == "CONTROL" ) 
	{
	    // The warrant is CONTROL, so set up the list of defendants
	    Services.removeNode(DefendantsGrid.srcData + "/LitigiousParty");
	    
        var number = XML.getNodeTextContent(selectedParty.selectSingleNode("Number"));
        var typeCode = XML.getNodeTextContent(selectedParty.selectSingleNode("TypeCode"));

		var judgments = Services.getNodes(XPathConstants.JUDGMENT_BASE + "/Judgment");
		for(var i = 0 ; i < judgments.length ; i++) {
		    var match = judgments[i].selectNodes("InFavourParties/Party[./CasePartyNumber='"+number+"' and ./PartyRoleCode='"+typeCode+"']");
		    if(match != null && match.length > 0) {
		        var judgmentID = XML.getNodeTextContent(judgments[i].selectSingleNode("JudgmentId"));
		        // This judgment is in favour of the selected claimant, so add the "party against" to the defendants grid
	            var n = XML.getNodeTextContent(judgments[i].selectSingleNode("CasePartyNumber"));
	            var t = XML.getNodeTextContent(judgments[i].selectSingleNode("PartyRoleCode"));
	            addDefendant(n, t, judgmentID);
		    }
		}
	}
	else if ( selectedParty == null && warrantType == "CONTROL" )
	{
		// Defect 5543: No party for selected, clear the parties against on CONTROL Warrants
		Services.removeNode(DefendantsGrid.srcData + "/LitigiousParty");
	}

	Services.endTransaction();
}
ClaimantsGrid.retrieveOn = [ClaimantsGrid.dataBinding, ClaimantsGrid.dataBinding + "/PartyId"];

/***********************************************************************************/

function Claimant_Name() {};
Claimant_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Name";
Claimant_Name.tabIndex = -1;
Claimant_Name.componentName = "Party For Name";
Claimant_Name.helpText = "Name of party";
Claimant_Name.isMandatory = function() { return true; }
Claimant_Name.isReadOnly = function() { return true; }
Claimant_Name.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Claimant_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Name() {};
Solicitor_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Name";
Solicitor_Name.tabIndex = -1;
Solicitor_Name.componentName = "Representative Name";
Solicitor_Name.helpText = "Name of party's representative";
Solicitor_Name.isReadOnly = function() { return true; }
Solicitor_Name.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_Line1() {};
Solicitor_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[1]";
Solicitor_Address_Line1.isReadOnly = function() { return true; }
Solicitor_Address_Line1.tabIndex = -1;
Solicitor_Address_Line1.componentName = "Address Line 1";
Solicitor_Address_Line1.helpText = "First line of party's address";
Solicitor_Address_Line1.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_Line1.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_Line2() {};
Solicitor_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[2]";
Solicitor_Address_Line2.isReadOnly = function() { return true; }
Solicitor_Address_Line2.tabIndex = -1;
Solicitor_Address_Line2.componentName = "Address Line 2";
Solicitor_Address_Line2.helpText = "Second line of party's address";
Solicitor_Address_Line2.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_Line2.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_Line3() {};
Solicitor_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[3]";
Solicitor_Address_Line3.isReadOnly = function() { return true; }
Solicitor_Address_Line3.tabIndex = -1;
Solicitor_Address_Line3.componentName = "Address Line 3";
Solicitor_Address_Line3.helpText = "Third line of party's address";
Solicitor_Address_Line3.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_Line3.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_Line4() {};
Solicitor_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[4]";
Solicitor_Address_Line4.isReadOnly = function() { return true; }
Solicitor_Address_Line4.tabIndex = -1;
Solicitor_Address_Line4.componentName = "Address Line 4";
Solicitor_Address_Line4.helpText = "Fourth line of party's address";
Solicitor_Address_Line4.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_Line4.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_Line5() {};
Solicitor_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[5]";
Solicitor_Address_Line5.isReadOnly = function() { return true; }
Solicitor_Address_Line5.tabIndex = -1;
Solicitor_Address_Line5.componentName = "Address Line 5";
Solicitor_Address_Line5.helpText = "Fifth line of party's address";
Solicitor_Address_Line5.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_Line5.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Address_PostCode() {};
Solicitor_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/PostCode";
Solicitor_Address_PostCode.isReadOnly = function() { return true; }
Solicitor_Address_PostCode.tabIndex = -1;
Solicitor_Address_PostCode.componentName = "Postcode";
Solicitor_Address_PostCode.helpText = "Party's postcode";
Solicitor_Address_PostCode.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Address_PostCode.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_DX() {};
Solicitor_DX.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/DX";
Solicitor_DX.isReadOnly = function() { return true; }
Solicitor_DX.tabIndex = -1; 
Solicitor_DX.componentName = "DX Number";
Solicitor_DX.helpText = "Party's document exchange reference number";
Solicitor_DX.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_DX.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_TelephoneNumber() {};
Solicitor_TelephoneNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/TelephoneNumber";
Solicitor_TelephoneNumber.isReadOnly = function() { return true; }
Solicitor_TelephoneNumber.tabIndex = -1;
Solicitor_TelephoneNumber.componentName = "Telephone Number";
Solicitor_TelephoneNumber.helpText = "The telephone number of the party";
Solicitor_TelephoneNumber.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_TelephoneNumber.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_FaxNumber() {};
Solicitor_FaxNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/FaxNumber";
Solicitor_FaxNumber.isReadOnly = function() { return true; }
Solicitor_FaxNumber.tabIndex = -1;
Solicitor_FaxNumber.componentName = "Fax Number";
Solicitor_FaxNumber.helpText = "The fax number of the party";
Solicitor_FaxNumber.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_FaxNumber.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_EmailAddress() {};
Solicitor_EmailAddress.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/EmailAddress";
Solicitor_EmailAddress.isReadOnly = function() { return true; }
Solicitor_EmailAddress.tabIndex = -1;
Solicitor_EmailAddress.componentName = "Email Address";
Solicitor_EmailAddress.helpText = "The email address of the party";
Solicitor_EmailAddress.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_EmailAddress.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Reference() {};
Solicitor_Reference.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Reference";
Solicitor_Reference.isReadOnly = function() { return true; }
Solicitor_Reference.tabIndex = -1;
Solicitor_Reference.componentName = "Reference";
Solicitor_Reference.helpText = "Reference used by the party";
Solicitor_Reference.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Solicitor_Reference.isEnabled = areHeaderFieldsEntered;

/******************************* DEFENDANT FIELDS **********************************/

function DefendantsGrid() {};
DefendantsGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedDefendant";
DefendantsGrid.tabIndex = 40;
DefendantsGrid.srcData = "/ds/var/page/DefendantsList";
DefendantsGrid.rowXPath = "*";
DefendantsGrid.keyXPath = "PartyId";
DefendantsGrid.columns = [
	{xpath: "Number"},
	{xpath: "Type", defaultSort:"true"},
	{xpath: "Name"}	
];
DefendantsGrid.multipleSelection = true;
DefendantsGrid.logicOn = [DefendantsGrid.dataBinding, DefendantsGrid.dataBinding + "/PartyId"];
DefendantsGrid.logic = function(event) {
	if(event.getXPath() == "/") {
		return;
	}	
	Services.startTransaction();
	
	var defendantNodes = Services.getNodes(DefendantsGrid.dataBinding + "/PartyId");
	if(defendantNodes.length == 0) {
		setDefendants(null, null);
	} else if(defendantNodes.length == 1) {
		var partyId1 = XML.getNodeTextContent(defendantNodes[0]);
		var defendant1 = Services.getNode(DefendantsGrid.srcData + "/LitigiousParty[PartyId=" + partyId1 + "]");
		
	    var number = XML.getNodeTextContent(defendant1.selectSingleNode("Number"));
	    var typeCode = XML.getNodeTextContent(defendant1.selectSingleNode("TypeCode"));

		var claimantNumber = Services.getValue(XPathConstants.WARRANT_BASE + "/Claimant/Number");
		var claimantTypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Claimant/PartyType");	    
	    if(claimantNumber == number && claimantTypeCode == typeCode) {
	        // Trying to pick the same defendant as claimant
	        Services.removeNode(DefendantsGrid.dataBinding + "/PartyId");
	    } else {
	        setDefendants(defendant1, null);    
	    }
	} else if(defendantNodes.length == 2) {
		var partyId1 = XML.getNodeTextContent(defendantNodes[0]);
		var defendant1 = Services.getNode(DefendantsGrid.srcData + "/LitigiousParty[PartyId=" + partyId1 + "]");

		var partyId2 = XML.getNodeTextContent(defendantNodes[1]);
		var defendant2 = Services.getNode(DefendantsGrid.srcData + "/LitigiousParty[PartyId=" + partyId2 + "]");

	    var number = XML.getNodeTextContent(defendant2.selectSingleNode("Number"));
	    var typeCode = XML.getNodeTextContent(defendant2.selectSingleNode("TypeCode"));

		var claimantNumber = Services.getValue(XPathConstants.WARRANT_BASE + "/Claimant/Number");
		var claimantTypeCode = Services.getValue(XPathConstants.WARRANT_BASE + "/Claimant/PartyType");	    
	    if(claimantNumber == number && claimantTypeCode == typeCode) {
	        // Trying to pick the same defendant as claimant
	        Services.removeNode(DefendantsGrid.dataBinding + "/PartyId[2]");
	    } else {
			setDefendants(defendant1, defendant2);    
	    }
	} else {
	    // The user is trying to pick more than 2 parties, so remove and ignore the third
	    Services.removeNode(DefendantsGrid.dataBinding + "/PartyId[3]");
	}
	
	Services.endTransaction();	
}
DefendantsGrid.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
DefendantsGrid.isEnabled = areHeaderFieldsEntered;
DefendantsGrid.retrieveOn = [DefendantsGrid.dataBinding, DefendantsGrid.dataBinding + "/PartyId"];

/***********************************************************************************/

function Defendant1_Name() {};
Defendant1_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Name";
Defendant1_Name.tabIndex = -1;
Defendant1_Name.componentName = "First Party Against Name";
Defendant1_Name.helpText = "Name of party";
Defendant1_Name.isReadOnly = function() { return true; }
Defendant1_Name.isMandatory = function() { return true; }
Defendant1_Name.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line1() {};
Defendant1_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[1]";
Defendant1_Address_Line1.isMandatory = function() { return true; }
Defendant1_Address_Line1.transformToDisplay = toUpperCase;
Defendant1_Address_Line1.transformToModel = convertToUpperStripped;
Defendant1_Address_Line1.tabIndex = 42;
Defendant1_Address_Line1.maxLength = 35;
Defendant1_Address_Line1.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_Line1.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_Line1.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line1.isEnabled = areHeaderFieldsEntered;
Defendant1_Address_Line1.componentName = "Address Line 1";
Defendant1_Address_Line1.helpText = "First line of party's address";
Defendant1_Address_Line1.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line1.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line2() {};
Defendant1_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[2]";
Defendant1_Address_Line2.isMandatory = function() { return true; }
Defendant1_Address_Line2.transformToDisplay = toUpperCase;
Defendant1_Address_Line2.transformToModel = convertToUpperStripped;
Defendant1_Address_Line2.tabIndex = 43;
Defendant1_Address_Line2.maxLength = 35;
Defendant1_Address_Line2.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_Line2.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_Line2.componentName = "Address Line 2";
Defendant1_Address_Line2.helpText = "Second line of party's address";
Defendant1_Address_Line2.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line2.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line3() {};
Defendant1_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[3]";
Defendant1_Address_Line3.transformToDisplay = toUpperCase;
Defendant1_Address_Line3.transformToModel = convertToUpperStripped;
Defendant1_Address_Line3.tabIndex = 44;
Defendant1_Address_Line3.maxLength = 35;
Defendant1_Address_Line3.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_Line3.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_Line3.componentName = "Address Line 3";
Defendant1_Address_Line3.helpText = "Third line of party's address";
Defendant1_Address_Line3.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line3.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line4() {};
Defendant1_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[4]";
Defendant1_Address_Line4.transformToDisplay = toUpperCase;
Defendant1_Address_Line4.transformToModel = convertToUpperStripped;
Defendant1_Address_Line4.tabIndex = 45;
Defendant1_Address_Line4.maxLength = 35;
Defendant1_Address_Line4.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_Line4.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_Line4.componentName = "Address Line 4";
Defendant1_Address_Line4.helpText = "Fourth line of party's address";
Defendant1_Address_Line4.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line4.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line5() {};
Defendant1_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[5]";
Defendant1_Address_Line5.transformToDisplay = toUpperCase;
Defendant1_Address_Line5.transformToModel = convertToUpperStripped;
Defendant1_Address_Line5.tabIndex = 46;
Defendant1_Address_Line5.maxLength = 35;
Defendant1_Address_Line5.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_Line5.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_Line5.componentName = "Address Line 5";
Defendant1_Address_Line5.helpText = "Fifth line of party's address";
Defendant1_Address_Line5.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_Line5.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_PostCode() {};
Defendant1_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/PostCode";
Defendant1_Address_PostCode.transformToDisplay = toUpperCase;
Defendant1_Address_PostCode.transformToModel = toUpperCase;
Defendant1_Address_PostCode.tabIndex = 47;
Defendant1_Address_PostCode.maxLength = 8;
Defendant1_Address_PostCode.readOnlyOn = [Defendant1_Name.dataBinding];
Defendant1_Address_PostCode.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_PostCode.componentName = "Postcode";
Defendant1_Address_PostCode.helpText = "Party's postcode";
Defendant1_Address_PostCode.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant1_Address_PostCode.isEnabled = areHeaderFieldsEntered;
Defendant1_Address_PostCode.validate = function() {
	if(!CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding))) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
}

/***********************************************************************************/

function Defendant2_Name() {};
Defendant2_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Name";
Defendant2_Name.tabIndex = -1;
Defendant2_Name.componentName = "Second Party Against Name";
Defendant2_Name.helpText = "Name of party";
Defendant2_Name.isReadOnly = function() { return true; }
Defendant2_Name.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_Line1() {};
Defendant2_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[1]";
Defendant2_Address_Line1.transformToDisplay = toUpperCase;
Defendant2_Address_Line1.transformToModel = convertToUpperStripped;
Defendant2_Address_Line1.mandatoryOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line1.isMandatory = function() {
    if(CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding))) {
        return false;
    }
    return true;
}
Defendant2_Address_Line1.tabIndex = 49;
Defendant2_Address_Line1.maxLength = 35;
Defendant2_Address_Line1.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line1.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_Line1.componentName = "Address Line 1";
Defendant2_Address_Line1.helpText = "First line of party's address";
Defendant2_Address_Line1.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_Line1.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_Line2() {};
Defendant2_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[2]";
Defendant2_Address_Line2.transformToDisplay = toUpperCase;
Defendant2_Address_Line2.transformToModel = convertToUpperStripped;
Defendant2_Address_Line2.mandatoryOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line2.isMandatory = function() {
    if(CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding))) {
        return false;
    }
    return true;
}
Defendant2_Address_Line2.tabIndex = 50;
Defendant2_Address_Line2.maxLength = 35;
Defendant2_Address_Line2.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line2.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_Line2.componentName = "Address Line 2";
Defendant2_Address_Line2.helpText = "Second line of party's address";
Defendant2_Address_Line2.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_Line2.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_Line3() {};
Defendant2_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[3]";
Defendant2_Address_Line3.transformToDisplay = toUpperCase;
Defendant2_Address_Line3.transformToModel = convertToUpperStripped;
Defendant2_Address_Line3.tabIndex = 51;
Defendant2_Address_Line3.maxLength = 35;
Defendant2_Address_Line3.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line3.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_Line3.componentName = "Address Line 3";
Defendant2_Address_Line3.helpText = "Third line of party's address";
Defendant2_Address_Line3.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_Line3.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_Line4() {};
Defendant2_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[4]";
Defendant2_Address_Line4.transformToDisplay = toUpperCase;
Defendant2_Address_Line4.transformToModel = convertToUpperStripped;
Defendant2_Address_Line4.tabIndex = 52;
Defendant2_Address_Line4.maxLength = 35;
Defendant2_Address_Line4.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line4.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_Line4.componentName = "Address Line 4";
Defendant2_Address_Line4.helpText = "Fourth line of party's address";
Defendant2_Address_Line4.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_Line4.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_Line5() {};
Defendant2_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[5]";
Defendant2_Address_Line5.transformToDisplay = toUpperCase;
Defendant2_Address_Line5.transformToModel = convertToUpperStripped;
Defendant2_Address_Line5.tabIndex = 53;
Defendant2_Address_Line5.maxLength = 35;
Defendant2_Address_Line5.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line5.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_Line5.componentName = "Address Line 5";
Defendant2_Address_Line5.helpText = "Fifth line of party's address";
Defendant2_Address_Line5.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_Line5.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant2_Address_PostCode() {};
Defendant2_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/PostCode";
Defendant2_Address_PostCode.transformToDisplay = toUpperCase;
Defendant2_Address_PostCode.transformToModel = toUpperCase;
Defendant2_Address_PostCode.tabIndex = 54;
Defendant2_Address_PostCode.maxLength = 8;
Defendant2_Address_PostCode.readOnlyOn = [Defendant2_Name.dataBinding];
Defendant2_Address_PostCode.isReadOnly = function() {
    return CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_PostCode.componentName = "Postcode";
Defendant2_Address_PostCode.helpText = "Party's postcode";
Defendant2_Address_PostCode.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Defendant2_Address_PostCode.isEnabled = areHeaderFieldsEntered;
Defendant2_Address_PostCode.validate = function() {
	if(!CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding))) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
}

/******************************* OTHER WARRANT DETAILS FIELDS *******************************/

function ExecutingCourtCode() {};
ExecutingCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/ExecutingCourtCode";
ExecutingCourtCode.tabIndex = 70;
ExecutingCourtCode.maxLength = 3;
ExecutingCourtCode.componentName = "Executing Court Code";
ExecutingCourtCode.helpText = "The code of the court who is to execute the warrant.";
ExecutingCourtCode.isMandatory = function() { return true; }
ExecutingCourtCode.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
ExecutingCourtCode.isEnabled = areHeaderFieldsEntered;
ExecutingCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName == null || Services.getValue(this.dataBinding) == CaseManUtils.CCBC_COURT_CODE ) {
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	
	return ec;	
}
ExecutingCourtCode.logicOn = [ExecutingCourtCode.dataBinding];
ExecutingCourtCode.logic = function()
{
	Services.startTransaction();
	var value = Services.getValue(this.dataBinding);
	
	if(this.getValid()) {
		Services.setValue(ExecutingCourtName.dataBinding, value);
		
		// The code is valid, check if it is the same as the court code for the case.
		var owningCourtCode = Services.getValue(XPathConstants.CASE_BASE + "/OwningCourtCode");
		if(value != owningCourtCode) {
			Services.setValue(BailiffAreaNo.dataBinding, "99");
		}
	}
	Services.endTransaction();
}

/***********************************************************************************/

function ExecutingCourtName() {};
ExecutingCourtName.dataBinding = "/ds/var/page/tmp/ExecutingCourtNameAutocomplete";
ExecutingCourtName.tabIndex = 71;
ExecutingCourtName.componentName = "Executing Court Name";
ExecutingCourtName.helpText = "The name of the court who is to execute the warrant";
ExecutingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
ExecutingCourtName.isMandatory = function() { return true; }
ExecutingCourtName.rowXPath = "Court";
ExecutingCourtName.keyXPath = "Code";
ExecutingCourtName.displayXPath = "Name";
ExecutingCourtName.strictValidation = true;
ExecutingCourtName.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
ExecutingCourtName.isEnabled = areHeaderFieldsEntered;
ExecutingCourtName.logicOn = [ExecutingCourtName.dataBinding];
ExecutingCourtName.logic = function()
{
	Services.startTransaction();
	
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName != null) {
		// The entered value must be valid
		Services.setValue(ExecutingCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.WARRANT_BASE + "/ExecutingCourtName", courtName);
	}
	
	Services.endTransaction();
}
ExecutingCourtName.transformToDisplay = toUpperCase;
ExecutingCourtName.transformToModel = toUpperCase;

/***********************************************************************************/

function ExecutingCourtLOVButton() {};
ExecutingCourtLOVButton.tabIndex = 72;
ExecutingCourtLOVButton.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
ExecutingCourtLOVButton.isEnabled = areHeaderFieldsEntered;
/**
 * @author fzj0yl
 * @return "ExecutingCourtCode"  
 */
ExecutingCourtLOVButton.nextFocusedAdaptorId = function() {
	return "ExecutingCourtCode";
}

/***********************************************************************************/

function BailiffAreaNo() {};
BailiffAreaNo.dataBinding = XPathConstants.WARRANT_BASE + "/BailiffAreaNo";
BailiffAreaNo.tabIndex = 73;
BailiffAreaNo.componentName = "Bailiff Area Number";
BailiffAreaNo.helpText = "Enter the Bailiff's area number";
BailiffAreaNo.maxLength = 2;
BailiffAreaNo.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
BailiffAreaNo.isEnabled = areHeaderFieldsEntered;
BailiffAreaNo.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if(!CaseManValidationHelper.validateNumber(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidBailiffAreaNo_Msg");
	}
	return null;
}

/***********************************************************************************/

function Additional_Notes() {};
Additional_Notes.dataBinding = XPathConstants.WARRANT_BASE + "/AdditionalNotes";
Additional_Notes.tabIndex = 74;
Additional_Notes.maxLength = 120;
Additional_Notes.componentName = "Additional Notes";
Additional_Notes.helpText = "Enter any further information regarding the execution of this warrant";
Additional_Notes.transformToDisplay = toUpperCase;
Additional_Notes.transformToModel = toUpperCase;
Additional_Notes.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Additional_Notes.isEnabled = areHeaderFieldsEntered;

/******************************* WARRANT DETAILS FIELDS *************************************/

function WarrantDetails_BalanceOfDebt() {};
WarrantDetails_BalanceOfDebt.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebt";
WarrantDetails_BalanceOfDebt.tabIndex = 101;
WarrantDetails_BalanceOfDebt.maxLength = 12;
WarrantDetails_BalanceOfDebt.componentName = "Balance of Debt";
WarrantDetails_BalanceOfDebt.helpText = "Enter the outstanding balance of the judgment debt.";
WarrantDetails_BalanceOfDebt.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_BalanceOfDebt.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "CONTROL") {
        return true;
    }
    return false;
}
WarrantDetails_BalanceOfDebt.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");

	    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
	    if(errCode == null && value == 0 && warrantType == "CONTROL") {
	        errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 1000000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange11_Msg");
		}
	}
	return errCode;
}

/***********************************************************************************/

function WarrantDetails_BalanceOfDebtCurrency() {};
WarrantDetails_BalanceOfDebtCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebtCurrency";
WarrantDetails_BalanceOfDebtCurrency.tabIndex = -1;
WarrantDetails_BalanceOfDebtCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceOfDebtCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceOfDebtCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_AmountOfWarrant() {};
WarrantDetails_AmountOfWarrant.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrant";
WarrantDetails_AmountOfWarrant.tabIndex = 103;
WarrantDetails_AmountOfWarrant.maxLength = 12;
WarrantDetails_AmountOfWarrant.componentName = "Amount of Warrant";
WarrantDetails_AmountOfWarrant.helpText = "Enter the amount the warrant is issued for";
WarrantDetails_AmountOfWarrant.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_AmountOfWarrant.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "CONTROL") {
        return true;
    }
    return false;
}
WarrantDetails_AmountOfWarrant.validateOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_AmountOfWarrant.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");

		if(errCode == null) {
		    value = parseFloat(value);
		}
		
	    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
	    if(errCode == null && value == 0 && warrantType == "CONTROL") {
	        errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 1000000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange11_Msg");
		}
		
		var balanceOfDebt = Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding);
		if(errCode == null && balanceOfDebt != null && !isNaN(balanceOfDebt)&& value > parseFloat(balanceOfDebt)) {
	        errCode = ErrorCode.getErrorCode("CaseMan_invalidAmountOfWarrant_Msg");
		}
		
	}
	return errCode;
}

/***********************************************************************************/

function WarrantDetails_AmountOfWarrantCurrency() {};
WarrantDetails_AmountOfWarrantCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrantCurrency";
WarrantDetails_AmountOfWarrantCurrency.tabIndex = -1;
WarrantDetails_AmountOfWarrantCurrency.isReadOnly = function() { return true; }
WarrantDetails_AmountOfWarrantCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_AmountOfWarrantCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_Fee() {};
WarrantDetails_Fee.dataBinding = XPathConstants.WARRANT_BASE + "/Fee";
WarrantDetails_Fee.tabIndex = 105;
WarrantDetails_Fee.maxLength = 11;
WarrantDetails_Fee.componentName = "Warrant Fee";
WarrantDetails_Fee.helpText = "The fee for issuing the warrant";
WarrantDetails_Fee.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_Fee.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_Fee.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	var maximum = parseFloat(Services.getValue(XPathConstants.MAX_FEE_XPATH));
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} 
		else if (errCode == null && parseFloat(value) > maximum) 
		{
			var currencyCode = Services.getValue(WarrantDetails_FeeCurrency.dataBinding);
			var currencySymbol = CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
			
			errCode = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg");
			errCode.m_message = errCode.m_message.replace(/XXX/, currencySymbol + parseFloat(maximum).toFixed(2));
		}
	}
	return errCode;
}

/***********************************************************************************/

function WarrantDetails_FeeCurrency() {};
WarrantDetails_FeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/FeeCurrency";
WarrantDetails_FeeCurrency.tabIndex = -1;
WarrantDetails_FeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_FeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_FeeCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_SolicitorsCosts() {};
WarrantDetails_SolicitorsCosts.dataBinding = XPathConstants.WARRANT_BASE + "/SolicitorsCosts";
WarrantDetails_SolicitorsCosts.tabIndex = 107;
WarrantDetails_SolicitorsCosts.maxLength = 11;
WarrantDetails_SolicitorsCosts.componentName = "Solicitors Costs";
WarrantDetails_SolicitorsCosts.helpText = "Enter the fixed costs claimed on warrant issue where a solicitor is acting";
WarrantDetails_SolicitorsCosts.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_SolicitorsCosts.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_SolicitorsCosts.readOnlyOn = [WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_SolicitorsCosts.isReadOnly = function() {
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    if(CaseManUtils.isBlank(amountOfWarrant) || isNaN(amountOfWarrant) || amountOfWarrant <= 25) {
        Services.setValue(this.dataBinding, "");
        return true;
    }
    return false;
}
WarrantDetails_SolicitorsCosts.logicOn = [WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_SolicitorsCosts.logic = function() {
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    if(CaseManUtils.isBlank(amountOfWarrant) || isNaN(amountOfWarrant) || amountOfWarrant <= 25) {
        Services.setValue(this.dataBinding, "");
    } else if(CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
        var warrantType = Services.getValue(Header_WarrantType.dataBinding);
        if(warrantType == "CONTROL") {
	        // If the claimant is represented, default the solicitors costs to the SYSTEM_DATA value
	        var claimantName = Services.getValue(Claimant_Name.dataBinding);
	        var solicitorName = Services.getValue(Solicitor_Name.dataBinding);
	        if(claimantName != solicitorName) {
	            Services.setValue(this.dataBinding, Services.getValue(XPathConstants.SOLICITOR_COSTS_XPATH));    
	        }
        }
    }
}
WarrantDetails_SolicitorsCosts.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 100000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange10_Msg");
		}
	}
	return errCode;
}
/***********************************************************************************/

function WarrantDetails_SolicitorsCostsCurrency() {};
WarrantDetails_SolicitorsCostsCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/SolicitorsCostsCurrency";
WarrantDetails_SolicitorsCostsCurrency.tabIndex = -1;
WarrantDetails_SolicitorsCostsCurrency.isReadOnly = function() { return true; }
WarrantDetails_SolicitorsCostsCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_SolicitorsCostsCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_LandRegistryFee() {};
WarrantDetails_LandRegistryFee.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFee";
WarrantDetails_LandRegistryFee.tabIndex = 109;
WarrantDetails_LandRegistryFee.maxLength = 11;
WarrantDetails_LandRegistryFee.componentName = "Land Registry Fee";
WarrantDetails_LandRegistryFee.helpText = "Enter the fee paid for a search under the Agricultural Credits Act 1928";
WarrantDetails_LandRegistryFee.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_LandRegistryFee.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_LandRegistryFee.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 100000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange10_Msg");
		}
	}
	return errCode;
}

/***********************************************************************************/

function WarrantDetails_LandRegistryFeeCurrency() {};
WarrantDetails_LandRegistryFeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFeeCurrency";
WarrantDetails_LandRegistryFeeCurrency.tabIndex = -1;
WarrantDetails_LandRegistryFeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_LandRegistryFeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_LandRegistryFeeCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_Total() {};
WarrantDetails_Total.dataBinding = XPathConstants.WARRANT_BASE + "/Total";
WarrantDetails_Total.isReadOnly = function() { return true; }
WarrantDetails_Total.tabIndex = -1;
WarrantDetails_Total.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
WarrantDetails_Total.logicOn = [WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
WarrantDetails_Total.logic = function(event) {
    var value = 0;
	for (var i=0; i<WarrantDetails_Total.logicOn.length; i++)
	{
		var temp = Services.getValue(WarrantDetails_Total.logicOn[i]);
		if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) )
		{
			value = value + parseFloat(temp);
		}
	}
	Services.setValue(WarrantDetails_Total.dataBinding, value);
}

/***********************************************************************************/

function WarrantDetails_TotalCurrency() {};
WarrantDetails_TotalCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/TotalCurrency";
WarrantDetails_TotalCurrency.tabIndex = -1;
WarrantDetails_TotalCurrency.isReadOnly = function() { return true; }
WarrantDetails_TotalCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_TotalCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaid() {};
WarrantDetails_BalanceAfterPaid.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaid";
WarrantDetails_BalanceAfterPaid.tabIndex = -1;
WarrantDetails_BalanceAfterPaid.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaid.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
WarrantDetails_BalanceAfterPaid.logicOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_BalanceAfterPaid.logic = function(event) {
    var balanceOfDebt = Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding);
    
    var value = 0;
    if(!CaseManUtils.isBlank(balanceOfDebt) && !isNaN(balanceOfDebt)) {
        var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
        if(!CaseManUtils.isBlank(amountOfWarrant) && !isNaN(amountOfWarrant)) {
            value = balanceOfDebt - amountOfWarrant;
            
        }
    }
    Services.setValue(WarrantDetails_BalanceAfterPaid.dataBinding, value);
}

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaidCurrency() {};
WarrantDetails_BalanceAfterPaidCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaidCurrency";
WarrantDetails_BalanceAfterPaidCurrency.tabIndex = -1;
WarrantDetails_BalanceAfterPaidCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaidCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceAfterPaidCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_OkButton() {};
WarrantDetails_OkButton.tabIndex = 114;
/**
 * @author fzj0yl
 * 
 */
WarrantDetails_OkButton.actionBinding = function() {
    Services.dispatchEvent("Warrant_Details_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}
WarrantDetails_OkButton.validationList = ["WarrantDetails_BalanceOfDebt", "WarrantDetails_AmountOfWarrant", "WarrantDetails_Fee", "WarrantDetails_SolicitorsCosts", "WarrantDetails_LandRegistryFee"];
WarrantDetails_OkButton.enableOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
WarrantDetails_OkButton.isEnabled = function() {
	var validFields = CaseManValidationHelper.validateFields(WarrantDetails_OkButton.validationList);
	return validFields;    
}

/***********************************************************************************/

function WarrantDetails_CancelButton() {};
WarrantDetails_CancelButton.tabIndex = 115;
WarrantDetails_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Warrant_Details_Popup" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
WarrantDetails_CancelButton.actionBinding = function() {
    Services.startTransaction();
    Services.dispatchEvent("Warrant_Details_Popup", BusinessLifeCycleEvents.EVENT_LOWER);	
    Services.setValue(WarrantDetails_BalanceOfDebt.dataBinding,   Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/BalanceOfDebt"));
    Services.setValue(WarrantDetails_AmountOfWarrant.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/AmountOfWarrant"));
    Services.setValue(WarrantDetails_Fee.dataBinding,			  Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/Fee"));
    Services.setValue(WarrantDetails_SolicitorsCosts.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/SolicitorsCosts"));
    Services.setValue(WarrantDetails_LandRegistryFee.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/LandRegistryFee"));
    Services.endTransaction();
}

/******************************* FOOTER FIELDS ********************************************/

function Footer_DetailsOfWarrantButton() {};
Footer_DetailsOfWarrantButton.tabIndex = 80;
Footer_DetailsOfWarrantButton.enableOn = [Header_CaseNumber.dataBinding, Header_WarrantType.dataBinding, Header_DateRequestReceived.dataBinding];
Footer_DetailsOfWarrantButton.isEnabled = areHeaderFieldsEntered;

/******************************* STATUS BAR FIELDS *****************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "createHomeWarrants" } ]
	}
};

Status_CloseButton.tabIndex = 92;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;

/***********************************************************************************/

function Status_ClearButton() {}

Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "createHomeWarrants", alt: true } ]
	}
};

Status_ClearButton.tabIndex = 91;
/**
 * @author fzj0yl
 * 
 */
Status_ClearButton.actionBinding = function() 
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// Check for unsaved changes
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CLEARFORM);
		Status_SaveButton.actionBinding();
	}
	else
	{
		handleClearScreen();
	}	
}

/***********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "createHomeWarrants" } ]
	}
};

Status_SaveButton.tabIndex = 90;
/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	var invalidFields = FormController.getInstance().validateForm(true);
	if ( 0 == invalidFields.length )
	{
		var warrantNode = Services.getNode(XPathConstants.WARRANT_BASE).cloneNode(true);

		// Save the details
		var newDOM = XML.createDOM(null, null, null);
		var dsNode = XML.createElement(newDOM, "ds");
		dsNode.appendChild(warrantNode);
		newDOM.appendChild(dsNode);
		var params = new ServiceParams();
		params.addDOMParameter("warrantDetails", newDOM);
		Services.callService("addWarrant", params, Status_SaveButton, true);
	}
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName) {
	if (dom != null) {
		var warrantNumber = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/WarrantNumber"));
		
		var issuingCourt = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/IssuedBy"));
		var executingCourt = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/ExecutingCourtCode"));
		
		if(issuingCourt == executingCourt) {
		    alert(Messages.WARRANT_CREATED_SUCCESSFULLY_HOME.replace(/XXX/, warrantNumber));    
		} else {
		    var warrantType = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/WarrantType"));
		    if(warrantType == "CONTROL") {
		        alert(Messages.WARRANT_CREATED_SUCCESSFULLY_TRANSFERRED.replace(/XXX/, warrantNumber)); 
		    } else {
		        alert(Messages.WARRANT_CREATED_SUCCESSFULLY_FOREIGN.replace(/XXX/, warrantNumber));
		    }
		}

		var temp = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		switch (temp)
		{
			case ActionAfterSave.ACTION_NAVIGATE:
				NavigationController.nextScreen();
				break;
			case ActionAfterSave.ACTION_CLEARFORM:
				// Clear out the case number, this will cause the form to be reset
				handleClearScreen();
				break;
			case ActionAfterSave.ACTION_EXIT:
				exitScreen();
				break;
			default:
				// Clear out the case number, this will cause the form to be reset
				Services.setValue(Header_CaseNumber.dataBinding, "");
				Services.setFocus("Header_CaseNumber");
				break;
		}
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG))
	{
		// Reload the court code field so that all data gets reloaded
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		Services.setValue(Header_CaseNumber.dataBinding, "");
		Services.setValue(Header_CaseNumber.dataBinding, caseNumber);
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/*********************************** LOV GRIDS *********************************************/

function WarrantTypeLOVGrid() {};
WarrantTypeLOVGrid.dataBinding = Header_WarrantType.dataBinding;
WarrantTypeLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/WarrantTypes";
WarrantTypeLOVGrid.rowXPath = "WarrantType";
WarrantTypeLOVGrid.keyXPath = "Type";
WarrantTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];
WarrantTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_WarrantTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "Header_WarrantType" } ]
	}
};
/**
 * @author fzj0yl
 * @return "Header_WarrantType"  
 */
WarrantTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "Header_WarrantType";
}

/***********************************************************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedCourt";
CourtsLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "ExecutingCourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "ExecutingCourtCode" }, { key: Key.F6, element: "ExecutingCourtName" } ]
	}
};

/**
 * @author fzj0yl
 * @return "ExecutingCourtCode"  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() {
	return "ExecutingCourtCode";
}

CourtsLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtsLOVGrid.destroyOnClose = false;
CourtsLOVGrid.logicOn = [CourtsLOVGrid.dataBinding];
CourtsLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(CourtsLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var courtCode = Services.getValue(CourtsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(ExecutingCourtCode.dataBinding, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/******************************** POPUPS ******************************************/

function Warrant_Details_Popup() {};

/**
 * @author fzj0yl
 * 
 */
Warrant_Details_Popup.prePopupPrepare = function()
{
    Services.startTransaction();
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/BalanceOfDebt",   Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/AmountOfWarrant", Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/Fee", 			  Services.getValue(WarrantDetails_Fee.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/SolicitorsCosts", Services.getValue(WarrantDetails_SolicitorsCosts.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/LandRegistryFee", Services.getValue(WarrantDetails_LandRegistryFee.dataBinding));
    Services.endTransaction();
}

Warrant_Details_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "Footer_DetailsOfWarrantButton"} ]
	}
};

/**
 * @author fzj0yl
 * @return "Status_SaveButton"  
 */
Warrant_Details_Popup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/**********************************************************************************/

/**
 * Logic to default the claimant if there is only one party in the claimants grid
 * @author fzj0yl
 * 
 */
function defaultClaimantLogic() {}
defaultClaimantLogic.logicOn = [ClaimantsGrid.srcData, ClaimantsGrid.srcData + "/LitigiousParty"];
defaultClaimantLogic.logic = function(event) {
    var count = Services.countNodes(ClaimantsGrid.srcData + "/LitigiousParty");
    if(count == 1) {
        // There is a single party in the claimants list, so default to that party.
        var partyId = Services.getValue(ClaimantsGrid.srcData + "/LitigiousParty/PartyId");
        Services.setValue(ClaimantsGrid.dataBinding + "/PartyId", partyId);
    } else if (count > 1) {
    	// Remove the selected party
    	Services.removeNode(ClaimantsGrid.dataBinding + "/PartyId");
    	Services.removeNode(DefendantsGrid.dataBinding + "/PartyId");
    }
}

/**********************************************************************************/

/**
 * Logic to default defendant1 if there is only one party in the defendants grid
 * If there is no Claimant selected, we don't want to select any defendant
 * @author fzj0yl
 * 
 */
function defaultDefendantLogic() {}

defaultDefendantLogic.logicOn = [DefendantsGrid.srcData, DefendantsGrid.srcData + "/LitigiousParty"];
defaultDefendantLogic.logic = function(event) {
  var claimantSelectedCount = Services.countNodes(ClaimantsGrid.dataBinding + "/PartyId");
  if (claimantSelectedCount != 0) {
    // remove the previously selected node
    Services.removeNode(DefendantsGrid.dataBinding + "/PartyId");
	var count = Services.countNodes(DefendantsGrid.srcData + "/LitigiousParty");
	if(count == 1) {
	  // There is a single party in the defendants list, so default to that party.
	  var partyId = Services.getValue(DefendantsGrid.srcData + "/LitigiousParty/PartyId");
	  Services.setValue(DefendantsGrid.dataBinding + "/PartyId", partyId);
	}
  } else {
    // remove the selected node
    Services.removeNode(DefendantsGrid.dataBinding + "/PartyId");
  }
} 

