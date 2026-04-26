/** 
   HearingAttendeesRenderer Implementation of a Grid GUI object.
 **/
HearingAttendeesRenderer.COL1="Party Represented By";
HearingAttendeesRenderer.COL2="None";
HearingAttendeesRenderer.COL3="Counsel";
HearingAttendeesRenderer.COL4="Solicitor";
HearingAttendeesRenderer.COL5="In Person";
HearingAttendeesRenderer.COL6="Letter";
HearingAttendeesRenderer.COl_STYLE_1="HearingAttendeesCol1";
HearingAttendeesRenderer.COl_STYLE_2="HearingAttendeesCol2";
HearingAttendeesRenderer.COl_STYLE_3="HearingAttendeesCol3";
HearingAttendeesRenderer.COl_STYLE_4="HearingAttendeesCol4";
HearingAttendeesRenderer.COl_STYLE_5="HearingAttendeesCol5";
HearingAttendeesRenderer.COl_STYLE_6="HearingAttendeesCol6";
HearingAttendeesRenderer.INPUT_COLS = 5;

function HearingAttendeesRenderer() {
	this.eventKeys = new Array(); }

HearingAttendeesRenderer.createInline = function(id) {  
   	if(null == id) {
		throw new ConfigurationException("Must supply id to HearingAttendeesRenderer.createInline"); }
	var d = document;
	d.write("<div id=\"HearingAttendeesHead\" class=\"HearingAttendeesHead\">");
	d.write("<table><tbody><tr>");
	d.write("<th id=\"HearingAttendeesCol1\">Party Represented By</th>");
	d.write("<th id=\"HearingAttendeesCol2\">None</th>");
	d.write("<th id=\"HearingAttendeesCol3\">Counsel</th>");
	d.write("<th id=\"HearingAttendeesCol4\">Solicitor</th>");
	d.write("<th id=\"HearingAttendeesCol5\">In Person</th>");
	d.write("<th id=\"HearingAttendeesCol6\">Letter</th>");
	d.write("</tr></tbody></table></div>");		
	d.write("<div id='" + id + "' class='"+id+"'></div>");		
	var ele = d.getElementById(id);
	ele.__renderer = HearingAttendeesRenderer._create(ele); }

HearingAttendeesRenderer._createHeader = function(element) {
	var table = document.createElement("TABLE");	
	element.appendChild(table);
	var tbody = document.createElement("TBODY");
	table.appendChild(tbody);
	var t = document.createElement("TR");
	tbody.appendChild(t);
	t.appendChild(this._addCol(this.COL1, this.COl_STYLE_1));
	t.appendChild(this._addCol(this.COL2, this.COl_STYLE_2));
	t.appendChild(this._addCol(this.COL3, this.COl_STYLE_3));
	t.appendChild(this._addCol(this.COL4, this.COl_STYLE_4));
	t.appendChild(this._addCol(this.COL5, this.COl_STYLE_5));
	t.appendChild(this._addCol(this.COL6, this.COl_STYLE_6)); }

HearingAttendeesRenderer._create = function(element) {	
	var haRen = new HearingAttendeesRenderer();
	haRen.m_element = element;
	var table = document.createElement("TABLE");	
	var tbody = document.createElement("TBODY");
	table.appendChild(tbody);	
	element.appendChild(table);
	element.__renderer = haRen;
	return haRen; }

HearingAttendeesRenderer._addCol = function( colName, style) {
	var h = document.createElement("th");
	var col = document.createTextNode(colName);
	if(null != style) {
		h.setAttribute("id", style); }
	h.appendChild(col);
	return h; }

HearingAttendeesRenderer.prototype.addRow = function (partyName, row, partyType, partyNumber) {	
	var tr = document.createElement("tr");
	var col1 = document.createElement("td");
	col1.setAttribute("id", "HearingAttendeesCol1");
	col1.setAttribute("align", "left");
	var lab = document.createTextNode(partyName);
	var body = this.m_element.firstChild.firstChild;	
	var td = null;
	var inp = null;
	var ident = null;
	col1.appendChild(lab);	
	tr.appendChild(col1);
	body.appendChild(tr);
	for(var i = 0; i < 5; i++) {
		td = document.createElement("TD");		
		td.setAttribute("align","CENTER");
		td.setAttribute("id", "HearingAttendeesCol"+(i+2));
		inp = document.createElement("INPUT");						
		ident = "A"+row;		
		inp.setAttribute("name", ident);		
		inp.setAttribute("value",i); 
		inp.setAttribute("type","RADIO");
		inp.setAttribute("id", ident+i);		
		var key = SUPSEvent.addEventHandler(inp, "click", function(inp){ return HearingAttendeesGUIAdaptor._handleClick("HearingAttendees", inp, partyType, partyNumber)});
		this.eventKeys.push(key);
		td.appendChild(inp);
		tr.appendChild(td);	}	
	var rBut = document.getElementById("A"+row+"0");
	rBut.setAttribute("checked", true); }

HearingAttendeesRenderer.prototype.dispose = function() {  
	var key = this.eventKeys.pop();
	while (null != key) {
		SUPSEvent.removeEventHandlerKey(key); 
		key = this.eventKeys.pop(); } }