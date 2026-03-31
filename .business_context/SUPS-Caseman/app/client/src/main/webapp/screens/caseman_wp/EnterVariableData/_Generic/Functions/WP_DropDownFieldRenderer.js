//==================================================================
//
// DropDownFieldRenderer.js
//
// Implementation of DropDownField rendering class. This is a base
// class for components which consist of a text field and an
// associated button which displays some sort of drop down.
//
//==================================================================



/**
 * @author nz5zpz
 * 
 */
function WP_DropDownFieldRenderer()
{
}

WP_DropDownFieldRenderer.prototype = new DropDownFieldRenderer();
WP_DatePickerRenderer.prototype.constructor = WP_DropDownFieldRenderer
WP_DropDownFieldRenderer.m_logger = new Category("WP_DropDownFieldRenderer");


/**
 * CSS class for the dropdown container
 *
 * @type String
 */

WP_DropDownFieldRenderer.WP_DROPDOWN_HIDE_CSS = "wphidecaldropdown ";



/**
 * Create the drop down field as a child of another element
 *
 * @param p the parent element to create the child under
 * @return a new WP_DropDownFieldRenderer instance
 * @type WP_DropDownFieldRenderer
 * @author nz5zpz
 */
WP_DropDownFieldRenderer.createAsChild = function(p)
{
	// Create the outer button element
	var e = document.createElement("div");
	  
	// Append the dropdown field to it's parent element
	p.appendChild(e);

	// Create the rest of the dropdown field
	return WP_DropDownFieldRenderer._create(e);
}


/**
 * Create the dropdown field.
 *
 * The html (with additional whitespace for clarity) for a dropdown is:
 *
 *  <div class="dropdown_container">
 *   <div>
 *    <table class="dropdown_table" cellspacing="0px" cellpadding="0px">
 *      <tbody>
 *        <tr>
 *          <td class="dropdown_field_container">
 *            <input class="dropdown_field" />
 *          </td>
 *          <td class="dropdown_button_container">
 *            <div class="button" onclick="showDropDown('dropdown2')"></div>
 *          </td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </div>
 *   <div class="dropdown"></div>
 *  </div>
 *
 * The additional whitespace must not be included! Styling is
 * provided by the associated DropDownField.css
 * @param e
 * @author nz5zpz
 * @return f  
 */
WP_DropDownFieldRenderer._create = function(e)
{
	var f = new WP_DropDownFieldRenderer();

	// Keep hold of the div element
	f.m_element = e;
	f.m_element.className = DropDownFieldRenderer.CSS_CLASS_NAME;

	// D695 - Table borders in IE cause problems when subforms are closed.
	// Use a div surrounding the table as a border
	f.m_borderDiv = document.createElement("div");
	f.m_borderDiv.className = DropDownFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME;
	f.m_element.appendChild(f.m_borderDiv);

	var table = document.createElement("table");
	table.className = "dropdown_table";
	
	// Ideally these attributes could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");
	
	// Add the table to the container.
	f.m_borderDiv.appendChild(table);
	
	// Create table body
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	
	// Create table row
	var tr = document.createElement("tr");
	tbody.appendChild(tr);
	
	// Create table cell which will contain the input field
	var inputFieldCell = document.createElement("td");
	inputFieldCell.className = "dropdown_field_container";
	tr.appendChild(inputFieldCell);
	
	// Create table cell which will contain the button
	var buttonCell = document.createElement("td");
	buttonCell.className = "dropdown_button_container";
	tr.appendChild(buttonCell);
	
	// Create input text field for drop down
	f.m_inputField = document.createElement("input");
	f.m_inputField.setAttribute("type", "text");
	f.m_inputField.className = "dropdown_field";

	var parentId = e.parentNode.id;
	if(null != parentId && "" != parentId)
	{
		f.m_inputField.id = parentId + "_input";
	}

	inputFieldCell.appendChild(f.m_inputField);
	
	// Create button to trigger drop down
	f.m_button = Button.createAsChild(buttonCell, null, "dropdown_button");

	// Attach the click callback
	f.m_button.addClickListener(function() {f._handleButtonClick();});

	// Create the div containing the drop down
	f.m_dropdown = document.createElement("div");
	f.m_dropdown.className = WP_DropDownFieldRenderer.WP_DROPDOWN_HIDE_CSS;
	f.m_element.appendChild(f.m_dropdown);
	
	// Allow other components to be notified when the dropdown is raised or lowered
	f.m_showHideListeners = new CallbackList();

	// Start event handlers
	f.startDropDownEventHandlers();
	
	// Make a cache for the offsetSide of the parent node
	// This is a workaround for an IE bug which causes the screen to
	// flash under some circumstances when the offsetWidth is read.
	f.m_offsetWidth = 0;
	
	// Create the popuplayer used to show and hide the drop down
	f.m_popupLayer = PopupLayer.create(f.m_dropdown);
	
	return f;
}





/**
 * @author nz5zpz
 * @return boolean 
 */
WP_DropDownFieldRenderer.prototype.showDropDown = function()
{
	if(null == this.m_dropDownPosition)
	{
		var dropdown = this.m_dropdown;
		var container = this.m_element;
		
		// Get the document relative position of the container
		var containerPos = getAbsolutePosition(container);
	
		// Get the <html> tag for the document in which this DropDownField exists
		var docEl = container.ownerDocument.documentElement;
		
		var dropdownHeight = dropdown.offsetHeight;
		
		// Document relative position of the top of the drop down,
		// if it were positioned above the container
		var topOfDropdownAbove = containerPos.top - dropdownHeight;
		
		// Document relative position of the top of the drop down,
		// if it were positioned above the container
		var bottomOfDropdownBelow = containerPos.top + container.offsetHeight + dropdownHeight;
		  
	    // Calculate the gap between the top of the frame/window and the top of the 
	    // drop down, it it were positioned above the container
		var gapAbove = topOfDropdownAbove - docEl.scrollTop;
	
	    // Calculate the gap between the bottom of the frame/window and the bottom of the 
	    // drop down, it it were positioned below the container
		var gapBelow = (docEl.scrollTop + docEl.clientHeight) - bottomOfDropdownBelow;
	
	/*
		alert(
			"Dropdown height: " + dropdown.offsetHeight +
			"\nDocument relative top of drop down if positioned above container: " + topOfDropdownAbove +
			"\nDocument relative bottom of drop down if positioned below container: " + bottomOfDropdownBelow +
			"\nGap above drop down if positioned above container: " + gapAbove +
			"\nGap below drop down if positioned below container: " + gapBelow
		);
	*/
		
		// Default to showing the popup below the container
		var above = gapAbove > gapBelow;
		
		// If the dropdown is going to be clipped by the frame
		// when displayed below the container, check to see if
		// positioning it above the container will show more
		// of the dropdown
		if(gapBelow < 0)
		{
			if(gapAbove < 0)
			{
				// If the dropdown will be clipped above as well,
				// the choose the position which will result in the
				// least clipping of the dropdown
				above = (gapAbove > gapBelow);
			}
			else
			{
				// Not clipped when positioned above, so lets do that.
				above = true;
			}
		}
	
		// Keep this value - it is used during _render()
		this.m_dropDownPosition = above;
		
		// Set the drop down class appropriately so that it is positioned
		// with the least amount of clipping
		dropdown.className = "dropdown " + (above ? "above" : "below");
	
	
		var dd = this;
		// Add event capturing event handlers. This is browser dependant
		if(container.attachEvent)
		{
			// This is Internet Explorer so do appropriate event capture
			container.setCapture(false);
			this.m_clickEventKey = SUPSEvent.addEventHandler(container, "click", function() { dd._handleClickIE(); }, false);
			container.onlosecapture = function() { dd._captureLostIE(container); return false };
			
			this.m_hasMouseCapture = true;
		}
		else if(container.addEventListener)
		{
			// This is a W3C browser so do the appropriate event capture.
			// Click events are handled during the propogation phase 
			this.m_clickEventKey = SUPSEvent.addEventHandler(window, "click", function(evt) { dd._handleClickMoz(evt); }, true);
		}
		else
		{
			alert("Unsupported browser");
		}
		
		
		// Set the focus on the input field
		this._focusInputField();
		
		// Render the dropdown
		this._render();
		
		// hide any selects that may be showing through our drop down
		this.m_popupLayer.show();
		
		// Invoke any listeners that are interested in the dropdown being shown.
		this.m_showHideListeners.invoke(true);
	}
}


/**
 * @param disabled
 * @param focussed
 * @param mandatory
 * @param invalid
 * @param serverInvalid
 * @param readonly
 * @param inactive
 * @param isSubmissible
 * @author nz5zpz
 * 
 */
WP_DropDownFieldRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isSubmissible)
{
	this.m_disabled = disabled;
	this.m_focussed = focussed;
	this.m_mandatory = mandatory;
	this.m_invalid = invalid;
	this.m_serverInvalid = serverInvalid;
	this.m_readonly = readonly;
	this.m_inactive = inactive;
	this.m_isSubmissible = isSubmissible;
	
	this._render();
}

