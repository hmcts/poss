/**  
   COAttendeesRenderer.js - Implementation of a Grid GUI object
**/

COAttendeesRenderer.COL1="Party Represented By";
COAttendeesRenderer.COL2="None";
COAttendeesRenderer.COL3="Counsel";
COAttendeesRenderer.COL4="Solicitor";
COAttendeesRenderer.COL5="In Person";
COAttendeesRenderer.COL6="Letter";
COAttendeesRenderer.COl_STYLE_1="COAttendeesCol1";
COAttendeesRenderer.COl_STYLE_2="COAttendeesCol2";
COAttendeesRenderer.COl_STYLE_3="COAttendeesCol3";
COAttendeesRenderer.COl_STYLE_4="COAttendeesCol4";
COAttendeesRenderer.COl_STYLE_5="COAttendeesCol5";
COAttendeesRenderer.COl_STYLE_6="COAttendeesCol6";
COAttendeesRenderer.COl_STYLE_7="COAttendeesCol7";
COAttendeesRenderer.COL_COUNT_INT = 6;

function COAttendeesRenderer() {  
	this.eventKeys = new Array(); }

COAttendeesRenderer.createInline = function(id  ) {
   	if(null == id) {
		throw new ConfigurationException("Must supply id to COAttendeesRenderer.createInline"); }
	var d = document;
	d.write("<div id=\"COAttendeesHead\"><table><tbody><tr>");
	d.write("<th id=\"COAttendeesCol1\">Party Represented By</th>");
	d.write("<th id=\"COAttendeesCol2\">None</th>");
	d.write("<th id=\"COAttendeesCol3\">Counsel</th>");
	d.write("<th id=\"COAttendeesCol4\">Solicitor</th>");
	d.write("<th id=\"COAttendeesCol5\">In Person</th>");
	d.write("<th id=\"COAttendeesCol6\">Letter</th>");
	d.write("<th id=\"COAttendeesCol7\">Other</th>");
	d.write("</tr></tbody></table></div>");		
	d.write("<div id='" + id + "' class='"+id+"'></div>");		
	var ele = d.getElementById(id);
	ele.__renderer = COAttendeesRenderer._create(ele); }

COAttendeesRenderer._createHeader = function(element) {
	var table = document.createElement("TABLE");
	table.setAttribute("id", "COAttendeesHead");
	element.appendChild(table);
	var tbody = document.createElement("TBODY");
	table.appendChild(tbody);
	var t= document.createElement("TR");
	tbody.appendChild(t);
	t.appendChild(this._addCol(this.COL1, this.COl_STYLE_1));
	t.appendChild(this._addCol(this.COL2, this.COl_STYLE_2));
	t.appendChild(this._addCol(this.COL3, this.COl_STYLE_3));
	t.appendChild(this._addCol(this.COL4, this.COl_STYLE_4));
	t.appendChild(this._addCol(this.COL5, this.COl_STYLE_5));
	t.appendChild(this._addCol(this.COL6, this.COl_STYLE_6));
	t.appendChild(this._addCol(this.COL7, this.COl_STYLE_7)); }

COAttendeesRenderer._create = function (element) {
	var haRen = new COAttendeesRenderer();
	haRen.m_element = element;
	var table = document.createElement("TABLE");
	var tbody = document.createElement("TBODY");
	table.appendChild(tbody);	
	element.appendChild(table);
	element.__renderer = haRen;
	return haRen; }

COAttendeesRenderer._addCol = function (colName, style) {
	var h = document.createElement("th");
	var col = document.createTextNode(colName);
	if(null != style) { h.setAttribute("id", style); }
	h.appendChild(col);
	return h; }

COAttendeesRenderer.prototype.addRow = function (partyName, row, partyType, partyNumber) {
	var tr = document.createElement("tr");
	var col1 = document.createElement("td");
	col1.setAttribute("id", "COAttendeesCol1");
	col1.setAttribute("align", "left");
	var lab = document.createTextNode(partyName);
	var body = this.m_element.firstChild.firstChild;	
	var td = null;
	var input = null;
	var ident = null;
	col1.appendChild(lab);	
	tr.appendChild(col1);
	body.appendChild(tr);
	for(var i = 0; i < COAttendeesRenderer.COL_COUNT_INT; i++) {
		td = document.createElement("TD");		
		td.setAttribute("align","CENTER");
		td.setAttribute("id", "COAttendeesCol"+(i+2));
		input = document.createElement("INPUT");
		ident = "A"+row;		
		input.setAttribute("name", ident);		
		input.setAttribute("value",i); 
		input.setAttribute("type","RADIO");
		input.setAttribute("id", ident+i);		
		var key = SUPSEvent.addEventHandler(input, "click", function(input){ return COAttendeesGUIAdaptor._handleClick("COAttendees", input, partyType, partyNumber)});
		this.eventKeys.push(key);
		td.appendChild(input);
		tr.appendChild(td);	}
	var txtOther = document.createElement("INPUT");
	txtOther.setAttribute("name", "A"+row+"Other");
	txtOther.setAttribute("type", "TEXT");
	txtOther.setAttribute("id", ident + COAttendeesRenderer.COL_COUNT_INT );		
	txtOther.setAttribute("class", "COAttendeesDisabled ");
	txtOther.setAttribute("disabled", true);
	var txtkey = SUPSEvent.addEventHandler(txtOther, "blur", function(txtOther){ return COAttendeesGUIAdaptor._handleTextFieldBlur("COAttendees", txtOther, partyType, partyNumber)});
	this.eventKeys.push(txtkey)
	td.appendChild(txtOther);
	var rBut = document.getElementById("A"+row+"0");
	rBut.setAttribute("checked", true); }

COAttendeesRenderer.prototype.dispose = function() {
	var key = this.eventKeys.pop();
	while (null != key) {
		SUPSEvent.removeEventHandlerKey(key); 
		key = this.eventKeys.pop(); } }