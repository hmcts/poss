//==================================================================
//
// FramedFieldRenderer.js
//
// Implementation of FramedField rendering class. This is a base
// class for components which consist of a text field and some other
// user interface components that are all enclosed by a frame.
// Examples are buttonfields (which in turn are used as the basis
// for dropdown fields and subsequently for datepickers
// and autocompletes, and also zoomable text fields) that are a
// fields with an associated button.
// The frame and the input field are used to represent the state of
// the field. e.g. The frame is rendered red when the field is
// invalid or the background of the input field is rendered purple
// when the field is mandatory.
//
//==================================================================


/**
 * Constructor for the FramedFieldRenderer - use FramedFieldRenderer.create
 * to create actual instances.
 *
 * @constructor
 * @private
 */ 
function FramedFieldRenderer()
{
}

/**
 * The Logging Category for the FramedFieldRenderer
 *
 * @type Category
 * @private
 */
FramedFieldRenderer.m_logger = new Category("FramedFieldRenderer");


/**
 * The CSS Class names for the elements that represents the framed field
 *
 * @type String
 */
FramedFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME = "framedfield_table_border"
FramedFieldRenderer.LAYOUT_TABLE_CSS_CLASS_NAME = "framedfield_container"


/**
 * Flag to indicate whether or not the field should be rendered as disabled
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_disabled = false;


/**
 * Flag to indicate whether or not the field should be rendered as focussed
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_focussed = false;


/**
 * Flag to indicate whether or not the field should be rendered as mandatory
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_mandatory = false;


/**
 * Flag to indicate whether or not the field should be rendered as invalid
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_invalid = false;
FramedFieldRenderer.prototype.m_serverInvalid = false;


/**
 * Flag to indicate whether or not the field should be rendered as readonly
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_readonly = false;


/**
 * Flag to indicate whether or not the field should be rendered as inactive
 *
 * @type Boolean
 */
FramedFieldRenderer.prototype.m_inactive = false;




/**
 * Create the framed field as a child of another element
 *
 * @param p the parent element to create the child under
 * @param className the outer div element's class name
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 * @return a new ButtonFieldRenderer instance
 * @type ButtonFieldRenderer
 */
FramedFieldRenderer.createAsChild = function(p, className, multiline)
{
	// Create the outer div element
	var e = document.createElement("div");
	  
	// Append the framed field to it's parent element
	p.appendChild(e);
	
	// Create the rest of the dropdown field
	return FramedFieldRenderer._create(e, className, multiline);
}


/**
 * Create the framed field.
 *
 * The html (with additional whitespace for clarity) for a dropdown is:
 *
 *  <div class="cN">
 *   <div>
 *    <table class="buttonfield_table" cellspacing="0px" cellpadding="0px">
 *      <tbody>
 *        <tr>
 *          <td class="buttonfield_field_container">
 *            <input class="buttonfield_field" />
 *          </td>
 *          <td class="buttonfield_button_container">
 *            <div class="button"></div>
 *          </td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </div>
 *  </div>
 *
 * The additional whitespace must not be included! Styling is
 * provided by the associated ButtonField.css
 *
 * @param p the parent element to which the framed field will be added.
 * @param className the outer div element's class name
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 */
FramedFieldRenderer._create = function(e, cN, multiline)
{
	var f = new FramedFieldRenderer();

	// Set the className of the outer element
	e.className = cN;

	// Keep the class name
	f.m_className = cN;

	// Keep reference to the outer element
	f.m_element = e;

	// D695 - Table borders in IE cause problems when subforms are closed.
	// Use a div surrounding the table as a border
	f.m_borderDiv = document.createElement("div");
	f.m_borderDiv.className = FramedFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME;
	f.m_element.appendChild(f.m_borderDiv);

	var table = document.createElement("table");
	table.className = FramedFieldRenderer.LAYOUT_TABLE_CSS_CLASS_NAME;

	// Ideally these attributes could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");
	
	// Add the table to the container.
	f.m_borderDiv.appendChild(table);
	
	// Create table body
	var tBody = document.createElement("tbody");
	table.appendChild(tBody);
	
	// Create table row
	f.m_row = document.createElement("tr");
	tBody.appendChild(f.m_row);
	
	// Create table cell which will contain the input field
	var inputCell = document.createElement("td");
	inputCell.className = "framedfield_field_container";
	f.m_row.appendChild(inputCell);

	if(multiline) {
		// Create input field as a single row text area
		f.m_inputField = document.createElement("textarea");
		f.m_inputField.setAttribute("rows", 1);
		// Field width is 100% in style sheet, this amount of characters fills
		// the input field's default width
		f.m_inputField.setAttribute("cols", 19);
		f.m_inputField.setAttribute("wrap", "soft");
	}
	else {
		// Create input field as a text input box
		f.m_inputField = document.createElement("input");
		f.m_inputField.setAttribute("type", "text");
	}

	f.m_inputField.className = "framedfield_field";

	inputCell.appendChild(f.m_inputField);

	// Make a cache for the offsetWidth of the parent node
	// This is a workaround for an IE bug which causes the screen to
	// flash under some circumstances when the offsetWidth is read.
	f.m_offsetWidth = 0;

	return f;
}


/**
 * Perform any required cleanup
 */
FramedFieldRenderer.prototype.dispose = function()
{
	// Remove reference to adaptor
	this.m_guiAdaptor = null;
}


/**
 * Get the input text field element
 *
 * @return the reference the fields text input element 
 * @type HTMLInputElement
 */
FramedFieldRenderer.prototype._getInputFieldElement = function()
{	
	return this.m_inputField;
}


/**
 * Add a container to the right of the input field, to which
 * content may be added
 *
 * @return an HTMLElement to which content may be added
 * @type HTMLElement
 */
FramedFieldRenderer.prototype.addCellAfterField = function()
{
	var c = document.createElement("td");
	this.m_row.appendChild(c);
	return c;
}


/**
 * Render the FramedField according to it's state
 *
 * @param disabled true if the field is to be rendered as disabled
 * @param focussed true if the field is to be rendered as focussed
 * @param mandatory true if the field is to be rendered as mandatory
 * @param invalid true if the field is to be rendered as invalid
 * @param readonly true if the field is to be rendered as readonly
 * @param inactive true if the field is to be rendered as inactive
 * @param isServerValidationActive true if the field is to be rendered as server validation active
 */
FramedFieldRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive)
{
	this.m_disabled = disabled;
	this.m_focussed = focussed;
	this.m_mandatory = mandatory;
	this.m_invalid = invalid;
	this.m_serverInvalid = serverInvalid;
	this.m_readonly = readonly;
	this.m_inactive = inactive;
	this.m_isServerValidationActive = isServerValidationActive;
	
	this._render();
}


/**
 * Determine the classname of the external div based on the state of the
 * frame field.
 *
 * @return the CSS className of the field to set on the external div
 * @type String
 */
FramedFieldRenderer.prototype._getClassName = function()
{
	var className = this.m_className;

	if(this.m_disabled || this.m_inactive)
	{
		className += " framedfield_disabled";
	}
	else
	{
		if(this.m_focussed)
		{
			className += " framedfield_focus";
		}
			
		if(this.m_guiAdaptor.hasValue())
		{
			if(this.m_invalid)
			{
				if(this.m_serverInvalid)
				{
					// If server validation in process colour text area orange. If
					// server invalid and process complete colour text area red.
					if(this.m_isServerValidationActive)
					{
						className += " framedfield_server_invalid";
					}
					else
					{
						className += " framedfield_invalid";
					}
				}
				else
				{
					className += " framedfield_invalid";
				}
			}
		}
		else
		{
			if(this.m_mandatory)
			{
				className += " framedfield_mandatory";
			}
		}
		
		if(this.m_readonly)
		{
			className += " framedfield_readonly";
		}	
	}
	
	return className;
}


FramedFieldRenderer.prototype._render = function()
{
	// This fix is only required on IE which appears to have problems
	// correctly interpretting width: 100% CSS styles on input fields...
	//
	// Dirty hack to fix the "framedfield resizing problem". The symptoms
	// of the problems are that when text wider than the input field is 
	// entered into framed field, the field resizes so that it is wide enough
	// to accomodate its contained text. This means that the width of the
	// parents is entirely ignored, causing layout problems for the whole
	// form. 
	// The field only resizes when it's layout is recalculated, and IE interprets
	// width="100%" as 100% of content. The layout is recalulated when the
	// CSS classes of its parents are changed (as happens below).
	// The workaround is to explicitly set the the width of the input field
	// so override the class style of "width: 100%". This is done immediately
	// below. The same fix is applied in the drop down code. The dropdown code
	// needs to be re-implemented to make use of the Framed Field.

	if(this.m_offsetWidth == 0 
	   && this.m_inputField.parentNode.offsetWidth > 0)
	{
		var borderStyle = getCalculatedStyle(this.m_borderDiv);
	
		var borderLeftWidth = borderStyle.borderLeftWidth.slice(0, -2);
		// If stylesheet hasn't loaded then this will be "medium", if so default to 2px
		borderLeftWidth = isNaN(borderLeftWidth) ? 2 : Number(borderLeftWidth);
	
		var borderRightWidth = borderStyle.borderRightWidth.slice(0, -2);
		// If stylesheet hasn't loaded then this will be "medium", if so default to 2px
		borderRightWidth = isNaN(borderRightWidth) ? 2 : Number(borderRightWidth);
	
		var elementStyle = getCalculatedStyle(this.m_guiAdaptor.getElement());
		var elementWidth = elementStyle.width.slice(0, -2);
		// If stylesheet hasn't loaded then this will be "auto", if so default to 160px
		elementWidth = isNaN(elementWidth) ? 160 : Number(elementWidth);

		var buttonElement = this.m_guiAdaptor._getPopupButton().m_element;
		var buttonCellWidth = buttonElement.parentNode.offsetWidth;
		// If stylesheet hasn't loaded then button width won't be set, if so default to 18px
		buttonCellWidth = isNaN(buttonCellWidth) ? 18 : Number(buttonCellWidth);
		
		// Input field width is overall width minus the border and button widths
		var inputFieldWidth = elementWidth - borderLeftWidth - buttonCellWidth - borderRightWidth;
		// Subtract left and right 1px padding for two table cells
		inputFieldWidth -= 4;

		// Set input field and offset width cache widths
		this.m_inputField.style.width = inputFieldWidth + "px";
		this.m_offsetWidth = this.m_inputField.style.width; 
	}
	else
	{
		this.m_inputField.style.width = this.m_offsetWidth;
	}

	this.m_inputField.disabled = this.m_disabled || this.m_inactive;
	this.m_inputField.readOnly = this.m_readonly;

	if(this.m_disabled || this.m_inactive)
	{
		// Disable adaptor help text
		if (this.m_guiAdaptor.getHelpText() != null) {
			this.m_guiAdaptor.unbindHelp();
		}
	}
	else
	{
		// Enable adaptor help text
		if (this.m_guiAdaptor.getHelpText() != null) {
			this.m_guiAdaptor.bindHelp();
		}
	}

	// Set the Element's CSS class so that it is rendered appropriately
	this.m_element.className = this._getClassName();
}


