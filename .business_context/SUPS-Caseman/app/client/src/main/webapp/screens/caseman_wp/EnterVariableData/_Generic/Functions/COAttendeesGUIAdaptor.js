/**
   Class for adapting hearing attendess gui component as implemented in    
 **/
function COAttendeesGUIAdaptor(){ }

COAttendeesGUIAdaptor.m_logger = new Category("COAttendeesGUIAdaptor");

COAttendeesGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
COAttendeesGUIAdaptor.prototype.constructor = COAttendeesGUIAdaptor;

GUIAdaptor._setUpProtocols('COAttendeesGUIAdaptor'); 

GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'FocusProtocol'); 
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'FocusProtocolHTMLImpl');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'HelpProtocol');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'HelpProtocolHTMLImpl');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'InitialiseProtocol');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'MandatoryProtocol');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'NameProtocol');
GUIAdaptor._addProtocol('COAttendeesGUIAdaptor', 'MouseWheelBindingProtocol');

COAttendeesGUIAdaptor.prototype._dispose = function() {   
	this.m_renderer.dispose();
	this.m_renderer = null; }

COAttendeesGUIAdaptor.create = function(e) {
	var a = new COAttendeesGUIAdaptor();
	a._initCOAttendeesGUIAdaptor(e);
	return a; }

COAttendeesGUIAdaptor.prototype._initCOAttendeesGUIAdaptor = function(e) {
	this.m_element = e;
    if(null != e.__renderer) {
		this.m_renderer = e.__renderer;
		this.m_element.__renderer = null; } }

COAttendeesGUIAdaptor.prototype.noOfParties = 0;
COAttendeesGUIAdaptor.prototype.lastButtonId = null;
COAttendeesGUIAdaptor.prototype.firstButtonId = "A00";

COAttendeesGUIAdaptor.prototype.initialise = function() {
    var elem = this.m_renderer;		
	var parties = this._getCOHearingParties();	
	this.noOfParties = parties.length;
	var party = null;
	var partyName = "";
	var partyType = null;
	var partyNumber = null;
	var dom = null;
	for (var i=0; i < this.noOfParties; i++) {
		party = parties[i];
		partyName = XML.getNodeTextContent(party.selectSingleNode("Name")) ;
		partyType = XML.getNodeTextContent(party.selectSingleNode("TypeCode")) ;
		partyNumber = XML.getNodeTextContent(party.selectSingleNode("Number")) ;	
		if(partyName!=null) {
			if(i==0) {
				elem.addRow(partyName, i, partyType, partyNumber );	}
			else {
				prevparty = parties[i-1];
				prevPN = XML.getNodeTextContent(prevparty.selectSingleNode("Name")) ;
				if(partyName != prevPN) {
					elem.addRow(partyName, i, partyType, partyNumber );	} }	}
		dom = XML.createDOM();
		dom.loadXML("<attendee><type>"+partyType+"</type><number>"+partyNumber+"</number><attendance>0</attendance><other></other></attendee>");
		Services.addNode(dom, this.dataBinding); } }

COAttendeesGUIAdaptor.prototype._getCOHearingParties = function() {
	return WPU.getCOHearingParties(); }

COAttendeesGUIAdaptor.prototype._configure = function(cs) {}

COAttendeesGUIAdaptor.prototype.renderState = function() {	
	var hasFoc = this.hasFocus();   	   	 
	if(hasFoc) {
	   this._handleRadFocus(); } }

COAttendeesGUIAdaptor._handleTextFieldBlur = function(adaptorId, txtOther, partyType, partyNumber) {	
	Services.getAdaptorById(adaptorId)._handleTextFieldBlur(txtOther, partyType, partyNumber);	}

COAttendeesGUIAdaptor.prototype._handleTextFieldBlur = function( txtOther, partyType, partyNumber) { 
	var val = txtOther.srcElement.getAttribute("value");
	if( null != val && "" != val) {
		var xp = this.dataBinding + "/attendee[type = '"+partyType+"' and number = "+partyNumber+" ]/other";
		Services.setValue(xp, val); } }

COAttendeesGUIAdaptor._handleClick = function(adaptorId, input, partyType, partyNumber) { 
	Services.getAdaptorById(adaptorId)._handleClick(input, partyType, partyNumber); }

COAttendeesGUIAdaptor.prototype._handleClick = function(input, partyType, partyNumber) {
	var rb = input.srcElement;
	var id = rb.getAttribute("id");
	var oneoff = id.length - 1;
	var idPfx = id.substring( 0, oneoff );
	var btnNo = parseInt( id.substring( oneoff ), 10);
	var gRad = null;
	var txtOther = document.getElementById( idPfx+COAttendeesRenderer.COL_COUNT_INT );	
	this.lastButtonId = id;	
	rb.setAttribute("checked", true);	
	for(var i=0; i < COAttendeesRenderer.COL_COUNT_INT; i++) {
		gRad = document.getElementById(idPfx+i);
		if((idPfx+i) != id) {
			gRad.setAttribute("checked", false); } }
	var xp = this.dataBinding + "/attendee[type = '"+partyType+"' and number = "+partyNumber+" ]";
	Services.setValue( xp+"/attendance", id.substring(id.length - 1));
	Services.setValue( xp+"/other", "");
	if( btnNo < (COAttendeesRenderer.COL_COUNT_INT - 1)) {	    	    	
    	txtOther.setAttribute("class" , "COAttendeesDisabled ");
    	txtOther.setAttribute("value", "");
    	txtOther.setAttribute("disabled", true); }
    else {	    	
    	txtOther.setAttribute("disabled", false);
    	txtOther.removeAttribute("class"); } }

COAttendeesGUIAdaptor.prototype.onFocus = function() { }

var tabForward = true;

COAttendeesGUIAdaptor.prototype.moveFocus = function(forward) {  
	tabForward = forward;
   	if (true == forward) {   
   	   this.firstitem = false;
       if (false == this.lastitem) {   
       		return "COAttendees"; }
       else {
       		/**check that the last item has not just been enabled.**/
       		var nextButId = this.lastButtonId.substring(0, this.lastButtonId.length - 1);
       		nextButId += COAttendeesRenderer.COL_COUNT_INT;
       		if (nextButId != this.lastButtonId) {
	       		var nextbut = document.getElementById( nextButId );
		   		if( null != nextbut && !nextbut.getAttribute("disabled")) {	
		   			this.lastitem = false;
		   			 return "COAttendees"; }  } }
       this.lastitem = false; }
   else if (null == forward) {
       	return "COAttendees"; }
   else if (false == forward) {    
   		if (false == this.firstitem) { 
   			return "COAttendees"; } }
   return null; }

COAttendeesGUIAdaptor.prototype.lastitem = false;
COAttendeesGUIAdaptor.prototype.firstitem = true;
COAttendeesGUIAdaptor.prototype.lastButton = null;

COAttendeesGUIAdaptor.prototype._handleRadFocus = function() {   
	var col = 0;
	var row = 0;
	var nextButtonId = null;
	if (this.lastButtonId == null) {
	 	this.lastButtonId = this.firstButtonId;
		nextButtonId = this.firstButtonId; }			
	else {	
	   col=this.lastButtonId.substring(2);
	   row=this.lastButtonId.substring(1,2);	  	   
	   var rowColVals = this._tab( tabForward, col, row );
	   col = rowColVals['col'];
	   row = rowColVals['row'];	   
	   nextButtonId = "A"+row+col;
	   this.lastButtonId = nextButtonId; }	 
	if (parseInt(row,10) + 1 == this.noOfParties) { 	
		if (col == COAttendeesRenderer.COL_COUNT_INT) {
			this.lastitem = true; }		
		else if (col == (COAttendeesRenderer.COL_COUNT_INT -1)) {	
			var currentButId = nextButtonId;		
			var tmpCol = parseInt( col, 10)  + 1;
			var tmpRow = row;
			var testNBid = "A"+tmpRow+tmpCol;							   		
	   		var nextbut = document.getElementById(testNBid);	   		
	   		if( null != nextbut && nextbut.getAttribute("disabled")) {
	   			document.getElementById( currentButId ).focus();	   			
	   			this.lastitem = true; } } }
	if ((row) == 0 && col == 0) { 
		this.firstitem = true;  }
	/**running off end of radio button list**/
	if (this.lastitem) {  
	   /** this.lastButtonId = null;**/
	    this.lastButtonId = nextButtonId;		    	
		var butelem = document.getElementById(nextButtonId);		
		if (null != butelem) {	
			if (!butelem.getAttribute("disabled")) {
				butelem.focus(); } } }	
	/**running off start of radio button list**/
	else if (this.firstitem) {	
		tabForward = true;			
		document.getElementById(this.firstButtonId).focus(); }
	else {  
	   	var nb = document.getElementById(nextButtonId); 	    
	    if (null != nb && !nb.getAttribute('disabled')) {
	  		nb.focus();	}		  		
		this.moveFocus(null); } }

COAttendeesGUIAdaptor.prototype._tab = function (isForward, col, row) {  
	var op = new Array();
	if (tabForward) {
		if (col < COAttendeesRenderer.COL_COUNT_INT)  {
			if (col == COAttendeesRenderer.COL_COUNT_INT - 1) {
		   		var tmpRow = row;
		   		var tmpCol = parseInt(col,10) + 1;
				var tmpnbid = "A"+tmpRow+tmpCol;
		   		if (document.getElementById(tmpnbid).getAttribute("disabled")) {
					row++;
		   			col = 0; }	
		   		else {
		   			col++; } }
		   	else {
				col++; } }
		else {
			row++;
			col = 0; } }	
	else /**tabbing backwards **/ {	
		if (col > 0) {
	   		col--; }
		else { 
			row--;
	   		col = COAttendeesRenderer.COL_COUNT_INT;  
	   		this.lastitem = false; } }
	op['row'] = row;
	op['col'] = col;	   	   
	return op; }

COAttendeesGUIAdaptor.prototype.onBlur = function() {
	if( this.hasFocus()) {	
    	this._handleRadFocus(); }
    else {      	
    	//col=this.lastButtonId.substring(2);
		//row=this.lastButtonId.substring(1,2);
      	//if (parseInt(row,10) + 1 > this.noOfParties || (parseInt(row,10) + 1 == this.noOfParties && col == COAttendeesRenderer.COL_COUNT_INT - 1)) { 	
			/**WAS lastitem - scroll to next Question **/ 
			//} 
//		else {
  //
    		this.lastButtonId = null; } }
    		// }
  
COAttendeesGUIAdaptor.prototype.setFocus = function(focus, wasClick) {  
	if (!focus) {	
	    this.m_focus = false;
		this.m_focusChanged = false; }
	else if (true == wasClick) {	
		this.m_focus = focus;
		this.m_focusChanged = false; }
	else { 	  	 
	  if(this.m_focus == focus) {
	  	this.m_focusChanged = false; }
	  else {
	  	this.m_focusChanged = true; }
	  
	  this.m_focus = true; 	}
	return this.m_focusChanged; }

/**
 * Temp Caseman 390 To enable the F3 key binding (Save Button) to work this function needs to be overriden.
 */
COAttendeesGUIAdaptor.prototype._getValueFromView = function() {}