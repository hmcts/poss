/**
   Class for adapting hearing attendess gui component as implemented in
 **/
function HearingAttendeesGUIAdaptor() {}

HearingAttendeesGUIAdaptor.m_logger = new Category("HearingAttendeesGUIAdaptor");

HearingAttendeesGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
HearingAttendeesGUIAdaptor.prototype.constructor = HearingAttendeesGUIAdaptor;

GUIAdaptor._setUpProtocols('HearingAttendeesGUIAdaptor'); 

GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'MandatoryProtocol');            // Supports mandatory
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'MouseWheelBindingProtocol');			// Supports mouse wheel scrolling
GUIAdaptor._addProtocol('HearingAttendeesGUIAdaptor', 'EnablementProtocol');			// Supports enablement


HearingAttendeesGUIAdaptor.prototype._dispose = function() {   
	this.m_renderer.dispose();
	this.m_renderer = null; }

HearingAttendeesGUIAdaptor.create = function(e) {   
	var a = new HearingAttendeesGUIAdaptor();
	a._initHearingAttendeesGUIAdaptor(e);
	return a; }

HearingAttendeesGUIAdaptor.prototype._initHearingAttendeesGUIAdaptor = function(e) {   
	this.m_element = e;
    if(null != e.__renderer) {
		this.m_renderer = e.__renderer;
		this.m_element.__renderer = null; } }

HearingAttendeesGUIAdaptor.prototype.noOfParties = 0;
HearingAttendeesGUIAdaptor.prototype.lastButtonId = null;
HearingAttendeesGUIAdaptor.prototype.firstButtonId = "A00";
HearingAttendeesGUIAdaptor.prototype.lastitem = false;
HearingAttendeesGUIAdaptor.prototype.firstitem = true;
HearingAttendeesGUIAdaptor.prototype.lastButton = null;
HearingAttendeesGUIAdaptor.prototype._row = null;
HearingAttendeesGUIAdaptor.prototype._col = null;

HearingAttendeesGUIAdaptor.prototype.initialise = function() {  			
	var output = WP.GetScreenProcess().getOutput().getCJRReference();
	var aePartyIds = null;
	if ('CJR065' == output || 'CJR065C' == output) {	
		var aeEventCase = Services.getValue("/ds/var/app/ManageAEEvents/CaseNumber");										
		if (null != aeEventCase) {	
			aePartyIds = WPU.getAEAttendees( aeEventCase, Services.getValue("/ds/var/app/ManageAEEvents/AENumber")); } }
	var elem = this.m_renderer;
    var dom = null;
    if('CJR065_DO' == output) {
		WPU.loadWarrantData(["WarrantNumber", "LocalNumber", "AmountOfWarrant", "WarrantID", "Claimant", "Fee", "SolicitorsCosts", "LandRegistryFee", "Fees", "Payments ", "Defendant1", "Defendant2"], "/ds/EnterVariableData/Warrant");
		var partyAgainstNumber = WPU.getValue("/params/param/WarrantReturn/PartyAgainstNumber");
		var type = "Party Against " +  partyAgainstNumber;
		var partyAgainst = Services.getNode("/ds/var/form/ReferenceData/Parties/*[Type = '"+type+"']");
    	var partyFor = Services.getNode("/ds/var/form/ReferenceData/Parties/*[Type = 'Party For']");   	
    	dom = XML.createDOM(null,null,null);
    	dom.loadXML("<Parties></Parties>");
    	dom.documentElement.appendChild(partyAgainst);
		dom.documentElement.appendChild(partyFor);  
		dom = dom.documentElement; }    
    else {
   		dom = Services.getNode("/ds/ManageCase/Parties"); }   	
	if (null != dom) {
		var parties = dom.selectNodes("LitigiousParty");
		this.noOfParties = parties.length;	
		var party = null;
		var partyName = "";
		var partyType = null;
		var partyNumber = null;
		var pid = null;
		var dom = null;
		var include = true;
		for (var i=0; i < this.noOfParties; i++) {				
			party = parties[i];						
			if (null != aePartyIds) {
				pid = XML.getNodeTextContent( party.selectSingleNode("PartyId") );
				include = (aePartyIds[pid] == true); }						
			if (include) {
				partyName = XML.getNodeTextContent(party.selectSingleNode("Name")) ;
				partyType = XML.getNodeTextContent(party.selectSingleNode("TypeCode")) ;
				partyNumber = XML.getNodeTextContent(party.selectSingleNode("Number")) ;					
				if('OTHER' != partyName) {
					elem.addRow(partyName, i, partyType, partyNumber );
					dom = XML.createDOM();
					dom.loadXML("<attendee><type>"+partyType+"</type><number>"+partyNumber+"</number><attendance>0</attendance></attendee>");
					Services.addNode(dom, this.dataBinding); } } } } }

HearingAttendeesGUIAdaptor.prototype._configure = function(cs) {}

HearingAttendeesGUIAdaptor.prototype.renderState = function() {	
	var isEnabled = this.m_enabled
 	var hasFoc = this.hasFocus(); 
 	var tabHead = document.getElementById("HearingAttendeesHead");
 	var tabBody = document.getElementById("HearingAttendees");
 	if (isEnabled)	{	
		tabHead.className = "HearingAttendeesHead";
		tabBody.className = "HearingAttendees";
		if(hasFoc) {  
		   this._handleRadFocus(); } }		
	else {	
		tabHead.className = "HearingAttendeesHeadDisabled" ;
		tabBody.className = "HearingAttendeesDisabled";
		var dom = Services.getNode("/ds/ManageCase/Parties");
		if( null != dom) {
			var parties = dom.selectNodes("LitigiousParty");		
			var rBut = null;
			var partyType = null;
			var partyNo = null;
			var party = null;
			for( var i =0; i < parties.length; i++ ) {	
				party = parties[i];	
				partyType = XML.getNodeTextContent( party.selectSingleNode( "TypeCode" ) ) ;
				partyNo = XML.getNodeTextContent( party.selectSingleNode( "Number" ) ) ;						
				this.m_enabled = true;
				this._setRadioButtons( "A"+i+"0", partyType, partyNo );
				this.m_enabled = false;	} } } }

HearingAttendeesGUIAdaptor.prototype._setRadioButtons = function( radBtnId, partyType, partyNo) {  
	var radBtn = document.getElementById( radBtnId );
	if (null != radBtn) {	
		var idPfx = radBtnId.substring(0, radBtnId.length - 1 );
		var gRad = null;
		this.lastButtonId = radBtnId;	
		radBtn.setAttribute("checked", true);
		for(var i=0; i < HearingAttendeesRenderer.INPUT_COLS; i++) {
			gRad = document.getElementById(idPfx+i);
			if((idPfx+i) != radBtnId) {
				gRad.setAttribute("checked", false); } }
		var xp = this.dataBinding + "/attendee[type = '"+partyType+"' and number = "+partyNo+" ]/attendance";
	Services.setValue( xp, radBtnId.substring(radBtnId.length - 1)); } }

HearingAttendeesGUIAdaptor._handleClick = function(adaptorId, input, partyType, partyNumber) { 
	Services.getAdaptorById(adaptorId)._handleClick(input, partyType, partyNumber); }

HearingAttendeesGUIAdaptor.prototype._handleClick = function(input, partyType, partyNumber) {   
	if(this.m_enabled) 	{
		var rb = input.srcElement;
		var id = rb.getAttribute("id");		
		this._setRadioButtons( id, partyType, partyNumber ); } }

HearingAttendeesGUIAdaptor.prototype.onFocus = function() {}

var tabForward = true;
HearingAttendeesGUIAdaptor.prototype.moveFocus = function(forward) { 
   tabForward = forward;
   if (true == forward) {   
   		this.firstitem = false;   		
   		var col = 4;
   		var _row = (this.noOfParties - 1);
   		this._A14 = "A" + (this.noOfParties - 1) + 4;
   		if(this.lastButtonId == this._A14) {
   			this.lastitem = true; }	
       if (false == this.lastitem) {    
       		return "HearingAttendees"; }
       this.lastitem = false; }
   else if( null == forward) { 	
       return "HearingAttendees"; }
   else if (false == forward) {  
   		if (false == this.firstitem) { 	
   			return "HearingAttendees";  } }  
   return null; }

HearingAttendeesGUIAdaptor.prototype._handleRadFocus = function(){   
	var col = 0;
	var row = 0;
	var nextButtonId = null;
	if (this.lastButtonId == null) {
	 	this.lastButtonId = this.firstButtonId;
		nextButtonId = this.firstButtonId; }
	else {	
		col=this.lastButtonId.substring(2);
	   	row=this.lastButtonId.substring(1,2);
	   	if(tabForward) {
	   		if( col < 4 ) {
		   		col++; }
			else {
		   		row++;
		   	 	col = 0; } }   
		else /** tabbing backwards **/ {	
	  		if (col > 0) {
	   			col--; }
	   		else {
				row--;
	   			col = 4;
	   			this.lastitem = false; } }	 
	   nextButtonId = "A"+row+col;
	   this.lastButtonId = nextButtonId; }	 
	if (parseInt(row,10) + 1 > this.noOfParties || (parseInt(row,10) + 1 == this.noOfParties && col == 4)) { 	
		this.lastitem = true;  }				
	if ((row) == 0 && col  == 0) { 
		 this.firstitem = true; }
	
	if (this.lastitem)	{   
		this.lastButtonId = nextButtonId;	
	    var focuson = document.getElementById(nextButtonId);
		if(null != focuson) { 	
			focuson.focus(); } }
	else if( this.firstitem ) {	
		tabForward = true;	
		var focuson = document.getElementById(this.firstButtonId)
		if (null != focuson) focuson.focus();	 }
	else {  
	    var nb = document.getElementById(nextButtonId); 
	    if( null != nb){ nb.focus();	}					
		this.moveFocus(null); } }

HearingAttendeesGUIAdaptor.prototype.onBlur = function() {		
    if( this.hasFocus()) {	
 		this._handleRadFocus();	 }
    else {    
	  	col=this.lastButtonId.substring(2);
		row=this.lastButtonId.substring(1,2);
      	if (parseInt(row,10) + 1 > this.noOfParties || (parseInt(row,10) + 1 == this.noOfParties && col == 4)) { 	
			/**WAS lastitem - scroll to next Question **/ } 
		else {
    		this.lastButtonId = null; } } }

HearingAttendeesGUIAdaptor.prototype.setFocus = function(focus, wasClick) {  
	if(!focus )	{	
	    this.m_focus = false;
		this.m_focusChanged = false; }
	else if( true == wasClick ) {
		this.m_focus = focus;
		this.m_focusChanged = false; }
	else { 	  	 
	  if(this.m_focus == focus) {
	  	this.m_focusChanged = false; }
	  else {
	    this.m_focusChanged = true;	  }
	  this.m_focus = true; }		
	return this.m_focusChanged; }

/**
 * Temp Caseman 390 To enable the F3 key binding (Save Button) to work this function needs to be overriden.
 */
HearingAttendeesGUIAdaptor.prototype._getValueFromView = function() {}