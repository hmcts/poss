//==================================================================
//
// FocusProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support focussing. When an adaptor has the focus it needs to
// render itself approriately and also accept keyboard events (if
// appropriate).
//
// This protocol will have considerable interaction with the
// TabManager when it is implemented and the more details on the
// precise useage of this protocol will be provided then.
//
//==================================================================


/*
 * FocusProtocol constructor
 *
 * @constructor
 */
function FocusProtocol()
{
}

FocusProtocol.m_logger = new Category("FocusProtocol");

/**
 * Configuration property that determines the position of the
 * GUI Element within the form's tabbing order
 *
 * @type Integer
 * @configuration
 */
FocusProtocol.prototype.tabIndex = null;


/**
 * Property to keep track of whether we have focus or not.
 */
FocusProtocol.prototype.m_focus = false;


/**
 * Property to keep track of whether or not focus has changed since last
 * refresh
 */
FocusProtocol.prototype.m_focusChanged = false;


/**
 * Configuration function that allows the application to override
 * the default tabbing order by returning the id of the field to
 * move to next. The function accepts a single boolwean parameter
 * which indicates whether the user is tabbing forward (true) or
 * backwards (false) and should return the id of the next field to
 * move to, or null if the default tabbing order should be used.
 *
 * @type Function(boolean): String
 * @configuration
 */
FocusProtocol.prototype.moveFocus = null;


/**
 * Initialisation method for Focus protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
FocusProtocol.prototype.configFocusProtocol = function(cs)
{
	// Look for first tabIndex configuration
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		if(null != cs[i].tabIndex)
		{
			// If there is tabIndex then just set this Adaptor's
			// tabIndex configuration to it - there is no chaining
			if(this.tabIndex == null) this.tabIndex = cs[i].tabIndex;
		}

		if(null != cs[i].moveFocus)
		{
			// If there is moveFocus then just set this Adaptor's
			// moveFocus configuration to it - there is no chaining
			if(this.moveFocus == null) this.moveFocus = cs[i].moveFocus;
		}
	}
}


/**
 * Perform cleanup required by the FocusProtocol before
 * it is destroyed
 */
FocusProtocol.prototype.disposeFocusProtocol = function()
{
}


/**
 * Get the tabIndex for this adaptor
 *
 * @return the tabIndex for this adaptor
 * @type Integer
 */
FocusProtocol.prototype.getTabIndex = function()
{
	// Default to unordered
	var index = 0;
	
	if(this.tabIndex != null)
	{
		var indexPosition = parseInt(this.tabIndex);
		if(indexPosition > 0 || indexPosition < 0)
		{
			// indexPosition is positive - in the sorted list
			// or indexPosition is negative - excluded from tabbing order
			index = indexPosition;
		}
		else
		{
			// Anything else return 0 - not in ordered tabIndex
		}
	}

	return index;
}


FocusProtocol.prototype.invokeMoveFocus = function(forwards)
{
	// If there is no moveFocus configuration, simply return null so the default
	// tabbing order is used instead, otherwise invoke the configured moveFocus
	// method.
	var targetAdaptorId = null;
	if(null != this.moveFocus)
	{
		targetAdaptorId = this.moveFocus.call(this, forwards);
	}
	return targetAdaptorId;
}


/**
 * Change the elements focus state
 *
 * @param f if true render the component as focussed, if false render the
 *   component as unfocussed.
 * @param wasClick Specifies whether focus was achieved by user clicking 
 *        on component (true) or moving onto component using tab key (false).
 *        To many components this value will not be of importance. However,
 *        in certain cases the TabSelectorGUIAdaptor has to implement
 *        different behaviours depending on how focus was achieved. This
 *        value is used only when focus is set not lost.
 * @return true if the GUI component's focus changed, or false otherwise
 * @type boolean
 */
FocusProtocol.prototype.setFocus = function(f,wasClick)
{
	if(FocusProtocol.m_logger.isDebug()) FocusProtocol.m_logger.debug("FocusProtocol.setFocus() adaptor " + this.getId() + ", focus = " + f);
	var r = false;
	if(f != this.m_focus)
	{
		this.m_focus = f;
		
		// Toggle focus change flag
		//this.m_focusChanged = !this.m_focusChanged;
		this.m_focusChanged = true;
		
		r = true;
	}
	else
	{
		this.m_focusChanged = false;
	}
	return r;
}


/**
 * Get whether the GUI Element is rendered as focussed or not
 *
 * @return true if the Element is rendered as focussed or false if
 *    it isn't
 * @type boolean
 */
FocusProtocol.prototype.hasFocus = function()
{
	return this.m_focus;
}


/**
 * Method which can be overridden by a component to which allows it to
 * reject accepting the focus. By default always returns true.
 *
 * @return true if the component can accept the focus or false to refuse it
 * @type boolean 
 */
FocusProtocol.prototype.acceptFocus = function()
{
	return true;
}

FocusProtocol.prototype.onFocus = null;

FocusProtocol.prototype.onBlur = null;