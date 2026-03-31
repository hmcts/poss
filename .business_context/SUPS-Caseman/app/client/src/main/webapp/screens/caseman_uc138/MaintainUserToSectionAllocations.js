//Created by David Turner March 2005
/****************************************************************************************************************
                                        CURRENT ISSUES
****************************************************************************************************************/
/**
 * remove this
 * @author qz8rkl
 * 
 */
function Navigation()
{ 
  var navArray = new Array();
  navArray[0] = NavigationController.MAIN_MENU;
  NavigationController.createCallStack( navArray );
}
/*****************************************************************************************************************
                                        FUNCTION CLASSES
*****************************************************************************************************************/
/**
 * form
 * @author qz8rkl
 * 
 */
function MaintainUTSAlloc () {};

/**
 * @author qz8rkl
 * 
 */
MaintainUTSAlloc.initialise = function()
{
  loadData();
  finishedLoading = true;
}

function Header_UserIDTxt () {};
function Header_SectionTxt () {};

function Header_SectionResultsGrid () {};
function Header_UsersResultsGrid () {};
function UserIDLOV () {};
function SectionLOV () {}
function Status_CloseBtn () {};
function Header_UserIDLOVBtn () {};
function Header_SectionLOVBtn () {};
function PUUserIDLOVBtn () {};
function Popup_SectionLOVBtn () {};
function Hidden_UserID () {};
function Hidden_Section () {};
function Header_AllocateBtn () {};
function Master_UserIdTxt () {};
function Master_UserNameTxt () {};
function Master_UserExtensionTxt () {};
function Master_AllocationsHistoryResultsGrid () {};
function Popup_UserIDTxt () {};
function Popup_SectionTxt () {};
function Popup_AddBtn () {};
function Popup_CloseBtn () {};
function Popup_AllocationResultsGrid () {};
function Popup_SaveBtn () {};

var finishedLoading = false;
/**
 * @author qz8rkl
 * 
 */
function loadData()
{
  var params = new ServiceParams();
  params.addSimpleParameter("AdminCourtCode",  Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
  //Services.callService("getUserToSectionAllocations", params, loadData, true);
  
  var qbpModel = Services.loadDOMFromURL("MaintainUserToSectionAllocations.xml");
  loadData.onSuccess(qbpModel); 
}

/**
 * @param resultDom
 * @author qz8rkl
 * @return ed from the search service, null")  
 */
loadData.onSuccess = function (resultDom)
{
  if (resultDom == null) 
	{
		Logging.info("loadData.onSuccess()\n dom returned from the search service: null");	
	}
	else
	{
	    var results = resultDom.selectSingleNode("/ds/Users");
	    if(results != null || results.getElementsByTagName("User").length != 0)
	    {
		  Services.addNode(results,"/ds");
	      results = resultDom.selectSingleNode("/ds/Sections");
	      var numberOfResults = results.getElementsByTagName("Section").length 
	      if(results != null && numberOfResults != 0)
	      {
			Services.addNode(results,"/ds");
			if(numberOfResults > 1)
			{
			    var newDOM = XML.createDOM(null, null, null);	
	            var aNode = newDOM.createTextNode("All Sections");
	            var allNode = XML.createElement(newDOM, "SectionName");
	            allNode.appendChild(aNode);		
			    Services.addNode(allNode , "/ds/Sections/Section[position()=numberOfResults+1]") 
			}
	      }
	      else
	      {
	        alert("No sections for this court");
	      }
	    }
	}
}
/*****************************************************************************************************************
                                        DATABINDING
*****************************************************************************************************************/
Hidden_UserID.dataBinding							="/ds/var/page/UserID";
Hidden_Section.dataBinding							="/ds/var/page/Section";
UserIDLOV.dataBinding								="/ds/var/page/SelectedGridRow/UserLOV";
Header_UserIDTxt.dataBinding						= Hidden_UserID.dataBinding;

SectionLOV.dataBinding								="/ds/var/page/SelectedGridRow/SectionLOV";
Header_SectionTxt.dataBinding						= Hidden_Section.dataBinding;

Header_SectionResultsGrid.dataBinding 				="/ds/var/page/SelectedGridRow/SelectedSection";
Header_UsersResultsGrid.dataBinding 				="/ds/var/page/SelectedGridRow/SelectedUserId";

Master_UserIdTxt.dataBinding 						="/ds/Users/User[./ID="+ Header_UsersResultsGrid.dataBinding +"]/ID";
Master_UserNameTxt.dataBinding 						="/ds/Users/User[./ID="+ Header_UsersResultsGrid.dataBinding +"]/Name";
Master_UserExtensionTxt.dataBinding 				="/ds/Users/User[./ID="+ Header_UsersResultsGrid.dataBinding +"]/Extension";
Master_AllocationsHistoryResultsGrid.dataBinding 	="/ds/var/page/SelectedGridRow/SelectedUserHistoryFromDate";

Popup_UserIDTxt.dataBinding 						= UserIDLOV.dataBinding;
Popup_SectionTxt.dataBinding 						= SectionLOV.dataBinding;

Popup_AllocationResultsGrid.dataBinding				="/ds/var/page/SelectedGridRow/SelectedPopUpAllocation";
/*****************************************************************************************************************
                                        FUNCTION DEFINITIONS
*****************************************************************************************************************/
Header_UserIDTxt.isReadOnly = function  (){return true;}
Header_SectionTxt.isReadOnly = function  (){return true;}

UserIDLOV.logicOn = [UserIDLOV.dataBinding];
UserIDLOV.logic = function ()
{
  if(finishedLoading == true)
  {
    var theID = Services.getValue(UserIDLOV.dataBinding);
    Services.setValue(Hidden_UserID.dataBinding,theID);
    Services.setValue("/ds/allSection", "false");
    Services.setValue(Hidden_Section.dataBinding,Services.getValue("/ds/Users/User[./ID="+UserIDLOV.dataBinding+"]/Sections/Section[./ToDate='']/SectionName"));
    Services.setValue(Header_UsersResultsGrid.dataBinding,theID)
  }
}

SectionLOV.logicOn = [SectionLOV.dataBinding];
SectionLOV.logic = function ()
{
  if(finishedLoading == true)
  {
    var selectedSection = Services.getValue(SectionLOV.dataBinding);
    if(selectedSection != null)
    {
	    if(selectedSection == "All Sections")
	    {
	    	Services.setValue("/ds/allSection", "true");
	        Services.setValue(Hidden_Section.dataBinding,"")
	    }
	    else
	    {
	      Services.setValue("/ds/allSection", "false");
 	      Services.setValue(Hidden_Section.dataBinding,selectedSection)
	    }
	}
	else
	{
    	Services.setValue(Hidden_Section.dataBinding,"No Section");
    }
    Services.setValue(Hidden_UserID.dataBinding,"");
  }
  
}

Master_UserIdTxt.isReadOnly = function  (){return true;}
Master_UserNameTxt.isReadOnly = function  (){return true;}
Master_UserExtensionTxt.isReadOnly = function  (){return true;}
Master_UserIdTxt.retrieveOn = [Header_UsersResultsGrid.dataBinding];
Master_UserNameTxt.retrieveOn = [Header_UsersResultsGrid.dataBinding];
Master_UserExtensionTxt.retrieveOn = [Header_UsersResultsGrid.dataBinding];

Popup_UserIDTxt.isReadOnly = function  (){return true;}
Popup_SectionTxt.isReadOnly = function  (){return true;}
/*****************************************************************************************************************
                                        GRID DEFINITIONS
*****************************************************************************************************************/
UserIDLOV.srcData = "/ds/Users";	
UserIDLOV.rowXPath = "User";					
UserIDLOV.keyXPath = "ID";                    		
UserIDLOV.columns = [										
	{xpath: "ID"},
	{xpath: "Name"},
	{xpath: "Sections/Section[./ToDate='']/SectionName"}
];
/*****************************************************************************************************************/
SectionLOV.srcData = "/ds/Sections";	
SectionLOV.rowXPath = "Section";					
SectionLOV.keyXPath = "SectionName";                    		
SectionLOV.columns = [										
	{xpath: "SectionName"}
];
/*****************************************************************************************************************/
Header_SectionResultsGrid.srcDataOn = [Hidden_Section.dataBinding];
Header_SectionResultsGrid.srcData = "/ds/Sections";	
Header_SectionResultsGrid.rowXPath = "Section[./SectionName="+Hidden_Section.dataBinding+" or (/ds/allSection = 'true' and ./SectionName!='All Sections')]";
Header_SectionResultsGrid.keyXPath = "SectionName";                    		
Header_SectionResultsGrid.columns = [										
	{xpath: "SectionName"}
];
/*****************************************************************************************************************/
Header_UsersResultsGrid.srcDataOn= [Header_SectionResultsGrid.dataBinding];
Header_UsersResultsGrid.srcData = "/ds/Users";	
Header_UsersResultsGrid.rowXPath = "User[./Sections/Section[./ToDate='']/SectionName="+Header_SectionResultsGrid.dataBinding+"]";
Header_UsersResultsGrid.keyXPath = "ID";                    		
Header_UsersResultsGrid.columns = [										
	{xpath: "ID"},
	{xpath: "Name"},
	{xpath: "Sections/Section[./ToDate='']/SectionName"}
];
/*****************************************************************************************************************/
Master_AllocationsHistoryResultsGrid.srcDataOn = [Header_UsersResultsGrid.dataBinding];
Master_AllocationsHistoryResultsGrid.srcData = "/ds/Users/User[./ID="+ Header_UsersResultsGrid.dataBinding +"]/Sections";	
Master_AllocationsHistoryResultsGrid.rowXPath = "Section";					
Master_AllocationsHistoryResultsGrid.keyXPath = "FromDate";                    		
Master_AllocationsHistoryResultsGrid.columns = [										
	{xpath: "FromDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ToDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "SectionName"}
];
/*****************************************************************************************************************/
Popup_AllocationResultsGrid.srcDataOn = ["/ds/var/page/NewAllocations/Allocation"];
Popup_AllocationResultsGrid.srcData = "/ds/var/page/NewAllocations";	
Popup_AllocationResultsGrid.rowXPath = "Allocation";					
Popup_AllocationResultsGrid.keyXPath = "AllocationID";                    		
Popup_AllocationResultsGrid.columns = [										
	{xpath: "UserID"},
	{xpath: "Section"}
];

/*****************************************************************************************************************
                                        BUTTON DEFINITIONS
*****************************************************************************************************************/
Status_CloseBtn.tabIndex = 50;

Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainUTSAlloc" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
Status_CloseBtn.actionBinding = function()
{
    exitScreen();
};
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
Header_UserIDLOVBtn.actionBinding = function()
{
    Services.dispatchEvent("UserIDLOV", PopupGUIAdaptor.EVENT_RAISE);
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
Header_SectionLOVBtn.actionBinding = function()
{
    Services.dispatchEvent("SectionLOV", PopupGUIAdaptor.EVENT_RAISE);
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
Header_AllocateBtn.actionBinding = function()
{
    Services.dispatchEvent("AlterUserToSection_Popup", PopupGUIAdaptor.EVENT_RAISE);
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
Popup_CloseBtn.actionBinding = function()
{
  if(Services.getValue("/ds/var/page/NewAllocations/Allocation/AllocationID")!=null)
  {
    Services.removeNode("/ds/var/page/NewAllocations");
  }
  Services.dispatchEvent("AlterUserToSection_Popup", PopupGUIAdaptor.EVENT_LOWER);
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
PUUserIDLOVBtn.actionBinding = function()
{
    Services.dispatchEvent("UserIDLOV", PopupGUIAdaptor.EVENT_RAISE);
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * 
 */
Popup_SectionLOVBtn.actionBinding = function()
{
    Services.dispatchEvent("SectionLOV", PopupGUIAdaptor.EVENT_RAISE);    
}
/**
 * @author qz8rkl
 * 
 */
Popup_SaveBtn.actionBinding = function()
{  
  if(Services.getValue(Popup_AllocationResultsGrid.dataBinding) != null)
  {
    addNewAllocations();
  }
  else
  {
    alert(Messages.MUS_MESSAGE_NOALLOCATION);
  }
}
/*****************************************************************************************************************/
/**
 * @author qz8rkl
 * @return null 
 */
Popup_AddBtn.actionBinding = function()
{
  var theUser = Services.getValue(Popup_UserIDTxt.dataBinding);
  if (theUser == null)
  {
    return;
  }
  var theSection = Services.getValue(Popup_SectionTxt.dataBinding);
  if (theSection == null)
  {
    return;
  }
  var checkNodes = Services.getValue("/ds/var/page/NewAllocations/Allocation[./UserID="+theUser+"]/UserID");
  if(checkNodes != null)
  {
    alert(Messages.MUS_MESSAGE_DUPALLOCATION);
  }
  else
  {
    var aNodes = Services.getValue("/ds/Users/User[./ID='"+theUser+"']/Sections/Section[./SectionName='"+theSection+"'][./ToDate='']/SectionName");
    if(aNodes != null)
    {
      alert(Messages.MUS_MESSAGE_CURALLOCATION);
    }
    else
    {
      var theXMLDom = XML.createDOM(null, null, null);	
      var newUserTextNode = theXMLDom.createTextNode(theUser);
      var newUserNode = theXMLDom.createElement("UserID");
      newUserNode.appendChild(newUserTextNode);
      var newSectionTextNode = theXMLDom.createTextNode(theSection);
      var newSectionNode = theXMLDom.createElement("Section");
      newSectionNode.appendChild(newSectionTextNode);
      var newAllocationNode = theXMLDom.createElement("Allocation");
      newAllocationNode.appendChild(newUserNode);
      newAllocationNode.appendChild(newSectionNode);
      Services.addNode(newAllocationNode,"/ds/var/page/NewAllocations");  
    }  
  }
}
/*****************************************************************************************************************
                                        HELPER FUNCTION DEFINITIONS
//*****************************************************************************************************************/

/**
 * @author qz8rkl
 * 
 */
function exitScreen()
{
    Navigation();
    NavigationController.nextScreen();
}

/**
 * @author qz8rkl
 * 
 */
function addNewAllocations()
{
  var theUserID = null;
  var theNewCurrentSection;
  var newCurrentSectionNode;
  var newCurrentSectionTextNode;
  var count = 1;
  var theDom = XML.createDOM(null, null, null);
 //create a todate node for the new section
  var toDateNode = theDom.createElement("ToDate");
  toDateNode.appendChild(theDom.createTextNode(""));
  //create a from date using today's date
  var todayNode = theDom.createElement("FromDate");
  var defaultDate = CaseManUtils.convertDateToPattern(new Date(), "YYYY-mm-DD").toUpperCase();
  todayNode.appendChild(theDom.createTextNode(defaultDate));
  while((theUserID = Services.getValue("/ds/var/page/NewAllocations/Allocation[position()="+count+"]/UserID"))!= null)
  {
    theNewCurrentSection = Services.getValue("/ds/var/page/NewAllocations/Allocation[position()="+count+"]/Section");
    //replace the section node date
    Services.setValue("/ds/Users/User[./ID="+theUserID+"]/Sections/Section[./ToDate='']/ToDate", defaultDate);
    //create a new section node
    var sectionNode = theDom.createElement("Section")
    sectionNode.appendChild(todayNode);
    sectionNode.appendChild(toDateNode);
    var sectionNameNode = theDom.createElement("SectionName");
    var sectionNameTextNode = theDom.createTextNode(theNewCurrentSection);
    sectionNameNode.appendChild(sectionNameTextNode);
    sectionNode.appendChild(sectionNameNode);
    Services.addNode(sectionNode,"/ds/Users/User[./ID="+theUserID+"]/Sections[position()=first]");
    count++;
  }
}
