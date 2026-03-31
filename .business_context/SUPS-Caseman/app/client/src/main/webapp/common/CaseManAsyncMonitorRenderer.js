//==================================================
//
// CaseManAsyncMonitorRenderer.js
//
// Renders the HTML for the AsyncMonitor
//
//==================================================


function CaseManAsyncMonitorRenderer(){};

/**
 * CaseManAsyncMonitorRenderer is a sub class of Renderer
 */
CaseManAsyncMonitorRenderer.prototype = new Renderer();
CaseManAsyncMonitorRenderer.prototype.constructor = CaseManAsyncMonitorRenderer;

CaseManAsyncMonitorRenderer.m_logger = new Category("CaseManAsyncMonitorRenderer");
CaseManAsyncMonitorRenderer.CSS_CLASS_NAME = "asyncMonitor";

/**
 * Create an asyncmonitor at the current location in the document while document
 * is parsing. This could be in a form or inside of a popup.
 *
 * @param id the id of the asyncmonitor being created
 * @param isHideable flag for Hide button. If true button is created
 * @author rzmb1g
 * @return CaseManAsyncMonitorRenderer._create(e, isHideable)  
 */
CaseManAsyncMonitorRenderer.createInline = function(id, isHideable)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the asyncmonitor being created
		false		// The asyncmonitor has an internal input element which can accept focus, so the div should not accept focus
	);

	return CaseManAsyncMonitorRenderer._create(e, isHideable);
}

/**
 * Create an asyncmonitor in the document relative to the supplied element.
 * This could be in a form or inside of a popup.
 *
 * @param refElement the element relative to which the asyncmonitor should be rendered
 * @param relativePos the relative position of the asyncmonitor to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the asyncmonitor being created
 * @param isHideable flag for Hide button. If true button is created
 * @author rzmb1g
 * @return CaseManAsyncMonitorRenderer._create(e, isHideable)  
 */
CaseManAsyncMonitorRenderer.createAsInnerHTML = function(refElement, relativePos, id, isHideable)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the asyncmonitor being created
		false			// The asyncmonitor has an internal input element which can accept focus, so the div should not accept focus
	);

	return CaseManAsyncMonitorRenderer._create(e, isHideable);
}

/**
 * Create an asyncmonitor as a child of another element
 *
 * @param afterElement the element after which the asyncmonitor should be rendered
 * @param id the id of the asyncmonitor being created
 * @param isHideable flag for Hide button. If true button is created
 * @author rzmb1g
 * @return CaseManAsyncMonitorRenderer._create(e, isHideable)  
 */
CaseManAsyncMonitorRenderer.createAsChild = function(p, id, isHideable)
{
	var e = Renderer.createAsChild(id);

	// Append the asyncmonitor's outer div to it's parent element
	p.appendChild(e);	
	
	return CaseManAsyncMonitorRenderer._create(e, isHideable);
}

/**
 * @param e
 * @param isHideable
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorRenderer._create = function(e, isHideable)
{
	e.className = CaseManAsyncMonitorRenderer.CSS_CLASS_NAME;
	
	var am = new CaseManAsyncMonitorRenderer();
	
	// Initialise sets main element and the reference to the renderer in the dom
	am._initRenderer(e);

	var id = e.id;
	var statusId = id + "_state";
	var remainingId = id + "_remaining";
	var viewId = id + "_view";
	var hideId = id + "_hide";
	var cancelId = id + "_cancel";

	//document.write("<table><tbody>");
	var amTable = document.createElement("table");
	e.appendChild(amTable);
	
	var amTBody = document.createElement("tbody");
	amTable.appendChild(amTBody);
	
	//document.write("<tr><td><table><tbody><tr><td>");
	var amNorthTr = document.createElement("tr");
	amTBody.appendChild(amNorthTr);
		
	var amNorthTd = document.createElement("td");
	amNorthTr.appendChild(amNorthTd);
	
	var amNorthTable = document.createElement("table");
	amNorthTd.appendChild(amNorthTable);
	
	var amNorthTBody = document.createElement("tbody");
	amNorthTable.appendChild(amNorthTBody);
	
	var amStateTr = document.createElement("tr");
	amNorthTBody.appendChild(amStateTr);
	
	var amStateLabelTd = document.createElement("td");
	amStateTr.appendChild(amStateLabelTd);
	
	//document.write("<label for='" + id + "_status'>State</label>");
	var amStateLabel = document.createElement("label");
	amStateLabel.setAttribute("for", statusId);
	amStateLabel.innerHTML = "Status";
	amStateLabelTd.appendChild(amStateLabel);
	
	//document.write("<td>");
	var amStateInputTd = document.createElement("td");
	amStateTr.appendChild(amStateInputTd);
	
	//document.write("<input id='" + id + "_status' type='text' size='10'/>");
	var amStateInput = document.createElement("input");
	amStateInput.setAttribute("id", statusId);
	amStateInput.setAttribute("type", "text");
	amStateInput.setAttribute("size", "10");
	amStateInputTd.appendChild(amStateInput);
/*	
	//document.write("<tr><td>");
	var amRemainingTr = document.createElement("tr");
	amNorthTBody.appendChild(amRemainingTr);
	
	var amRemainingLabelTd = document.createElement("td");
	amRemainingTr.appendChild(amRemainingLabelTd);
	
	//document.write("<label for='" + id + "async_remaining'>Time Remaining</label>");
	var amRemainingLabel = document.createElement("label");
	amRemainingLabel.setAttribute("for", remainingId);
	amRemainingLabel.innerHTML = "Time Remaining";
	amRemainingLabelTd.appendChild(amRemainingLabel);
	
	//document.write("<td>");
	var amRemainingInputTd = document.createElement("td");
	amRemainingTr.appendChild(amRemainingInputTd);
	
	//document.write("<input id='" + id + "_remaining' type='text' size='10'></input>");
	var amRemainingInput = document.createElement("input");
	amRemainingInput.setAttribute("id", remainingId);
	amRemainingInput.setAttribute("type", "text");
	amRemainingInput.setAttribute("size", "10");
	amRemainingInputTd.appendChild(amRemainingInput);
*/	
	
	//document.write("<tr><td><table><tbody><tr><td>");
	var amSouthTr = document.createElement("tr");
	amTBody.appendChild(amSouthTr);
	
	var amSouthTd = document.createElement("td");
	amSouthTd.align = "center";
	amSouthTr.appendChild(amSouthTd);
	
	var amSouthTable = document.createElement("table");
	amSouthTd.appendChild(amSouthTable);
	
	var amSouthTBody = document.createElement("tbody");
	amSouthTable.appendChild(amSouthTBody);
	
	var amButtonTr = document.createElement("tr");
	amSouthTBody.appendChild(amButtonTr);
	
	//var amViewButtonTd = document.createElement("td");
	//amButtonTr.appendChild(amViewButtonTd);
	
	//document.write("<input type='button' id='" + id + "_view' value='View'></input>");
	//var amViewButton = document.createElement("input");
	//amViewButton.setAttribute("id", viewId);
	//amViewButton.setAttribute("type", "button");
	//amViewButton.setAttribute("value", "View");
	//amViewButtonTd.appendChild(amViewButton);
	
	//if (isHideable)
	//{
		//document.write("<td>");
		//var amHideButtonTd = document.createElement("td");
		//amButtonTr.appendChild(amHideButtonTd);
		
		//document.write("<input type='button' id='" + id + "_hide' value='Hide'></input>");
		//var amHideButton = document.createElement("button");
		//amHideButton.setAttribute("id", hideId);
		//amHideButton.setAttribute("type", "button");
		//amHideButton.setAttribute("value", "Hide");
		//amHideButtonTd.appendChild(amHideButton);
	//}
	
	//document.write("<td>");
	var amCancelButtonTd = document.createElement("td");
	amCancelButtonTd.align = "center";
	amButtonTr.appendChild(amCancelButtonTd);
	
	//document.write("<input type='button' id='" + id + "_cancel' value='Cancel'></input>");
	var amCancelButton = document.createElement("input");
	amCancelButton.setAttribute("id", cancelId);
	amCancelButton.setAttribute("type", "button");
	amCancelButton.setAttribute("value", "Cancel");
	amCancelButtonTd.appendChild(amCancelButton);
}
