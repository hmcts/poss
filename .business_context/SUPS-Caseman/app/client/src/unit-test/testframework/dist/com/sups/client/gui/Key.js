

/**
 * Class to handle key events on an HTML Element
 *
 * @param a the GUIAdaptor to add key bindings to
 */
function ElementKeyBindings(a)
{
	// Hang on to the element we are bound too.
	this.m_adaptor = a;
	
	// Map that maps keycodes to action to be called when a key is pressed
	this.m_keys = new Array();

	// Qualifier keys map for keycodes
	this.m_qualifiers = new Array();

	// Stop propagation flag map for keycodes
	this.m_stopPropagation = new Array();
	
	// Add an event handler to the element
	var thisObj = this;
	var evtToHdle = ElementKeyBindings.isIE ? "keydown" : "keypress";
	// Binding element for form is 'BODY' not 'FORM'
	var bindingElement = this.getKeyBindingElement(this.m_adaptor);
	
	this.evtHdle = SUPSEvent.addEventHandler(bindingElement, evtToHdle, function(evt) { thisObj.handleKeyEvent(evt); });
}

ElementKeyBindings.m_logger = new Category("ElementKeyBindings");

// Qualifier keys bit masks
ElementKeyBindings.CTRL_KEY_MASK = 1;
ElementKeyBindings.ALT_KEY_MASK = 2;
ElementKeyBindings.SHIFT_KEY_MASK = 4;

// Qualifier keys string suffixes. Allows the same key to be bound to the same
// adaptor with no/different qualifiers. E.g. F1, Ctrl+F1, Alt+F1 and Shift+F1
ElementKeyBindings.CTRL_KEY_SUFFIX = "_ctrl";
ElementKeyBindings.ALT_KEY_SUFFIX = "_alt";
ElementKeyBindings.SHIFT_KEY_SUFFIX = "_shift";

ElementKeyBindings.prototype.dispose = function() 
{
	if(this.evtHdle != null)
	{
		SUPSEvent.removeEventHandlerKey(this.evtHdle);
		this.evtHdle = null;
	}
	this.m_adaptor = null;
	this.m_keys = null;
	this.m_qualifiers = null;
	this.m_stopPropagation = null;
}

ElementKeyBindings.prototype.handleKeyEvent = function(evt)
{ 
  // If IE then use the global event object.
  if(null == evt) evt = window.event;
  
  // Set return value
  var ret = true;
  
  // Before handling event check that the progress bar is not currently raised.
  var progressBarVisible = false;
  
  var ac = Services.getAppController();
          
  if(null != ac)
  {
      progressBarVisible = ac.isProgressBarVisible();
  }
  
  if(!progressBarVisible)
  {

      // Get the keycode from the event (If function key is pressed in W3C use 'keyCode' property otherwise 'which')
      var kc = (ElementKeyBindings.isIE || Key.isFunctionKey(evt.keyCode)) ? evt.keyCode : evt.which;
      var keyCodeString = '' + kc;
    
      if(ElementKeyBindings.m_logger.isDebug()) ElementKeyBindings.m_logger.debug('Handling key event. Adaptor ID: ' + this.m_adaptor.getId() + ' KeyCode: ' + kc);
 
      // Get the qualifier keys from the event
      var qualifiers = 0;
      if(evt.ctrlKey)
      {
  	      qualifiers |= ElementKeyBindings.CTRL_KEY_MASK;
  	      keyCodeString += ElementKeyBindings.CTRL_KEY_SUFFIX;
      }
      if(evt.altKey)
      {
  	      qualifiers |= ElementKeyBindings.ALT_KEY_MASK;
  	      keyCodeString += ElementKeyBindings.ALT_KEY_SUFFIX;
      }
      if(evt.shiftKey)
      {
  	      qualifiers |= ElementKeyBindings.SHIFT_KEY_MASK;
  	      keyCodeString += ElementKeyBindings.SHIFT_KEY_SUFFIX;
      }

      if(ElementKeyBindings.m_logger.isDebug()) ElementKeyBindings.m_logger.debug("Qualifiers - Ctrl: " + (qualifiers & ElementKeyBindings.CTRL_KEY_MASK) + " Alt: " + (qualifiers & ElementKeyBindings.ALT_KEY_MASK) + " Shift: " + (qualifiers & ElementKeyBindings.SHIFT_KEY_MASK));

      var handled = this._handleKey(kc, qualifiers);
 
      if(handled)
      {
          if(this.m_stopPropagation[keyCodeString])
          {
              // If the event was handled and 'propgate' configuration is false,
              // then stop the event propagating up to its parent elements
              ret = ElementKeyBindings.cancelKeyEvent(evt);
          
          }
          else
          {   
              if(null == window.document.framework_expando_progressBarVisible)
              {
                  window.document.framework_expando_progressBarVisible = progressBarVisible;
              }
          }
          
      }
      else
      {
          if(null == window.document.framework_expando_progressBarVisible)
          {
              window.document.framework_expando_progressBarVisible = progressBarVisible;
          }
      }
  
  }
  else
  {
      // Progress bar visible. Check for document expando property as
      // this may have been set by an event lower down in the event bubbling
      var docExpando = window.document.framework_expando_progressBarVisible;
      
      if(docExpando != false)
      {
          ret = ElementKeyBindings.cancelKeyEvent(evt);
      }
      
  }

  return ret;
}

ElementKeyBindings.determineBrowser = function()
{
    switch(navigator.appName)
    {
	    case "Netscape":
	    {
		    ElementKeyBindings.isIE = false;
		    ElementKeyBindings.isMoz = true;
		    break;
	    }
	    case "Microsoft Internet Explorer":
	    {
		    ElementKeyBindings.isIE = true;
		    ElementKeyBindings.isMoz = false;
		    break;
	    }
	    default:
	    {
		    alert("Unknown browser type");
		    break;
	    }
    }
    return null;
}

ElementKeyBindings.forceDetermineBrowser = ElementKeyBindings.determineBrowser();

/**
 * Bind a key to this html element
 *
 * @param key the key to bind to this element
 * @param action the function to call when the key is pressed on this element
 * @param qualifiers key qualifiers pressed
 * @param propagate the flag that determines whether or not to propagate the event
 */
ElementKeyBindings.prototype.bindKey = function(key, action, qualifiers, propagate)
{
  var keyCodeString = '' + key.m_keyCode;

  // If required add the qualifiers suffix to the key code string
  if(qualifiers != null)
  {
	keyCodeString += ElementKeyBindings.getQualifiersSuffix(qualifiers);
  }
  
  if(this.m_keys[keyCodeString] != null)
  {
   	// Key already bound so log a warning
   	if(ElementKeyBindings.m_logger.isWarn()) ElementKeyBindings.m_logger.warn('Key with keyCode "' + keyCodeString + '" already bound to HTML element with id: ' + this.m_adaptor.getId());
  }
  
  // Bind the key
  this.m_keys[keyCodeString] = action;

  // Bind any key qualifiers
  this.m_qualifiers[keyCodeString] = 0;
  if (qualifiers != null)
  {
	if (qualifiers.ctrl) this.m_qualifiers[keyCodeString] |= ElementKeyBindings.CTRL_KEY_MASK;
	if (qualifiers.alt) this.m_qualifiers[keyCodeString] |= ElementKeyBindings.ALT_KEY_MASK;
	if (qualifiers.shift) this.m_qualifiers[keyCodeString] |= ElementKeyBindings.SHIFT_KEY_MASK;
  }
  
  // Bind the stop event propagation flag
  this.m_stopPropagation[keyCodeString] = !propagate;
}


/**
 * Handle a key event on this element, calling the appropriate action function
 * for a key if it is bound to this element.
 *
 * @param keyCode the key code of the key pressed
 * @param qualifiers key qualifiers pressed bit pattern
 * @private
 */
ElementKeyBindings.prototype._handleKey = function(keyCode, qualifiers)
{
	var keyCodeString = '' + keyCode;

	// If required add the qualifiers suffix to the key code string
	if(qualifiers != 0)
	{
		if (qualifiers & ElementKeyBindings.CTRL_KEY_MASK) keyCodeString += ElementKeyBindings.CTRL_KEY_SUFFIX;
		if (qualifiers & ElementKeyBindings.ALT_KEY_MASK) keyCodeString += ElementKeyBindings.ALT_KEY_SUFFIX;
		if (qualifiers & ElementKeyBindings.SHIFT_KEY_MASK) keyCodeString += ElementKeyBindings.SHIFT_KEY_SUFFIX;
	}
	
	// Lookup the action using the keycode
	var action = this.m_keys[keyCodeString];

	// If we have an action for this key (and if any required qualifier key is pressed) then call it.
	if(action != null && this._canAdaptorAcceptKey(this.m_adaptor) && this.m_qualifiers[keyCodeString] == qualifiers)
	{
		if(ElementKeyBindings.m_logger.isDebug()) ElementKeyBindings.m_logger.debug("Calling action for key: " + keyCode);

		// Force an update because otherwise when hitting a keybinding on an adaptor
		// the latest data will not be in the DOM
		
		// Update the adaptor that the key is bound to
		if(this.m_adaptor.update)
		{
			this.m_adaptor.update();
		}
		
		// We may have to update the currently focussed adaptor if it is not the adaptor that the key is
		// bound to
		var currentFocussedAdaptor = FormController.getInstance().getTabbingManager().m_currentFocussedAdaptor;
		if(currentFocussedAdaptor != null && currentFocussedAdaptor.update)
		{
			if(currentFocussedAdaptor.getId() != this.m_adaptor.getId())
				currentFocussedAdaptor.update();
		}

		action.call(this.m_adaptor);
		return true;
	}
	else
	{
		return false;
	}
}


/**
 * Determine whether or not an adaptor is able to accept the key
 * and thus call the action for the key binding.
 *
 * @param a an adaptor
 * @returns true if adaptor is enabled and active. Otherwise false.
 * @private
 */
ElementKeyBindings.prototype._canAdaptorAcceptKey = function(a)
{
	// If enabled protocol is not supported then adaptor is enabled
	var enabled = true;
	// If active protocol is not supported then adaptor is active
	var active = true;

	if(a.supportsProtocol("EnablementProtocol"))
	{
		enabled = a.getEnabled();
	}

	if(a.supportsProtocol("ActiveProtocol"))
	{
		active = a.isActive();
	}

	return (enabled && active);
}

/**
 * Method getKeyBindingElement. In most cases an adaptor's key
 * binding element is the element referenced to by the adaptor's
 * instance variable m_element. However, the behaviour of form
 * level key bindings is a little flakey when keys are bound to
 * the form element. This is because in some cases the source
 * element for key presses appears to be the document body rather
 * than the form. Therefore, in the case of form adaptors we will
 * bind the key handler to the document's body instead of the form.
 *
 * @param adaptor The adaptor for which a binding element must be defined
*/
ElementKeyBindings.prototype.getKeyBindingElement = function(adaptor)
{
    var bindingElement = adaptor.getElement();
    
    if(bindingElement.tagName == 'FORM')
    {
        // Replace form element with parent body if possible
        var parent = bindingElement.parentNode;
        
        while(null != parent)
        {
            if(parent.tagName == 'BODY')
            {
                bindingElement = parent;
                break;
            }
            
            parent = parent.parentNode;
        }
        
    }
    
    return bindingElement;
}

/**
 * Builds a string dependendent on the which qualifier key(s) - Ctrl, Alt and
 * Shift - is set.
 *
 * @param qualifiers object
 * @returns a string
 */
ElementKeyBindings.getQualifiersSuffix = function(qualifiers)
{
	var suffix = "";
	
	if(qualifiers.ctrl == true) suffix += ElementKeyBindings.CTRL_KEY_SUFFIX;
	if(qualifiers.alt == true) suffix += ElementKeyBindings.ALT_KEY_SUFFIX;
	if(qualifiers.shift == true) suffix += ElementKeyBindings.SHIFT_KEY_SUFFIX;
	
	return suffix;
}

/**
 * Method cancelKeyEvent stops a key event from propagating and prevents
 * the default event action occurring.
 *
 * @param evt The event to be cancelled
 * @return    Returns "false", the value to be returned by the event handler
 *
*/
ElementKeyBindings.cancelKeyEvent = function(evt)
{
    SUPSEvent.stopPropagation(evt);
    SUPSEvent.preventDefault(evt);

	// More stuff to prevent default actions in IE...
	// Wrapped in try/catch block as this causes exceptions in other browsers
    try
    {
          if(ElementKeyBindings.isMoz != true)
      	  {
              evt.keyCode = 0;
          }
      }
      catch(e)
      {
      }
          
      return false;
}


/**
 * Abstraction of keys and their codes
 *
 * @param keyCode the key code of the key.
 */
function Key(keyCode)
{
  this.m_keyCode = keyCode;
}

// Return Key or Enter Key on numeric keypad
Key.Return = new Key(13);
Key.Backspace = new Key(8);
Key.Space = new Key(32);

// Miscellaneous Keys
Key.ESC = new Key(27);
Key.Insert = new Key(45);
Key.Delete = new Key(46);
Key.Home = new Key(36);
Key.End = new Key(35);
Key.PageUp = new Key(33);
Key.PageDown = new Key(34);
Key.Tab = new Key(9);
Key.ScrollLock = new Key(145);
Key.PrintScreen = new Key(44);
Key.NumLock = new Key(144);
Key.Menu = new Key(93);
Key.Windows = new Key(91);

// Arrow keys
Key.ArrowLeft = new Key(37);
Key.ArrowUp = new Key(38);
Key.ArrowRight = new Key(39);
Key.ArrowDown = new Key(40);

// Keys on the numeric keypad
Key.NP0 = new Key(96);
Key.NP1 = new Key(97);
Key.NP2 = new Key(98);
Key.NP3 = new Key(99);
Key.NP4 = new Key(100);
Key.NP5 = new Key(101);
Key.NP6 = new Key(102);
Key.NP7 = new Key(103);
Key.NP8 = new Key(104);
Key.NP9 = new Key(105);

// Function keys
Key.F1 = new Key(112);
Key.F2 = new Key(113);
Key.F3 = new Key(114);
Key.F4 = new Key(115);
Key.F5 = new Key(116);
Key.F6 = new Key(117);
Key.F7 = new Key(118);
Key.F8 = new Key(119);
Key.F9 = new Key(120);
Key.F10 = new Key(121);
Key.F11 = new Key(122);
Key.F12 = new Key(123);

// Alpha keys

// Upper case
Key.CHAR_A = new Key(65);
Key.CHAR_B = new Key(66);
Key.CHAR_C = new Key(67);
Key.CHAR_D = new Key(68);
Key.CHAR_E = new Key(69);
Key.CHAR_F = new Key(70);
Key.CHAR_G = new Key(71);
Key.CHAR_H = new Key(72);
Key.CHAR_I = new Key(73);
Key.CHAR_J = new Key(74);
Key.CHAR_K = new Key(75);
Key.CHAR_L = new Key(76);
Key.CHAR_M = new Key(77);
Key.CHAR_N = new Key(78);
Key.CHAR_O = new Key(79);
Key.CHAR_P = new Key(80);
Key.CHAR_Q = new Key(81);
Key.CHAR_R = new Key(82);
Key.CHAR_S = new Key(83);
Key.CHAR_T = new Key(84);
Key.CHAR_U = new Key(85);
Key.CHAR_V = new Key(86);
Key.CHAR_W = new Key(87);
Key.CHAR_X = new Key(88);
Key.CHAR_Y = new Key(89);
Key.CHAR_Z = new Key(90);

// Lower case
Key.CHAR_a = new Key(97);
Key.CHAR_b = new Key(98);
Key.CHAR_c = new Key(99);
Key.CHAR_d = new Key(100);
Key.CHAR_e = new Key(101);
Key.CHAR_f = new Key(102);
Key.CHAR_g = new Key(103);
Key.CHAR_h = new Key(104);
Key.CHAR_i = new Key(105);
Key.CHAR_j = new Key(106);
Key.CHAR_k = new Key(107);
Key.CHAR_l = new Key(108);
Key.CHAR_m = new Key(109);
Key.CHAR_n = new Key(110);
Key.CHAR_o = new Key(111);
Key.CHAR_p = new Key(112);
Key.CHAR_q = new Key(113);
Key.CHAR_r = new Key(114);
Key.CHAR_s = new Key(115);
Key.CHAR_t = new Key(116);
Key.CHAR_u = new Key(117);
Key.CHAR_v = new Key(118);
Key.CHAR_w = new Key(119);
Key.CHAR_x = new Key(120);
Key.CHAR_y = new Key(121);
Key.CHAR_z = new Key(122);

/**
 * Test to see a key code represents a function key or not
 * 
 * @param keyCode the keyCode to test
 */
Key.isFunctionKey = function(keyCode)
{
	return (keyCode >= Key.F1.m_keyCode && keyCode <= Key.F12.m_keyCode) ||
		   (keyCode >= Key.ArrowLeft.m_keyCode && keyCode <= Key.ArrowDown.m_keyCode)
		   ? true: false;
}

/**
 * Test to see a key code represents a printable key or not
 * 
 * @param keyCode the keyCode to test
 */
Key.isPrintableKey = function(keyCode)
{
	return (keyCode >= 32 && keyCode <= 126) ||
		   (keyCode >= 128 && keyCode <= 255)
		   ? true : false;
}

/**
 * Test to determine whether, or not, a key will cause a scrollable div
 * to scroll.
 *
 * @param keyCode The key code to test.
 *
 * @return Returns "true" if the key will cause a scrollable div to scroll or "false" if not.
 *
*/
Key.isScrollKey = function(keyCode)
{
    var scrollKey;
    
    switch( keyCode )
    {
        case Key.ArrowUp.m_keyCode:
        case Key.ArrowDown.m_keyCode:
        case Key.PageUp.m_keyCode:
        case Key.PageDown.m_keyCode:
        case Key.Home.m_keyCode:
        case Key.End.m_keyCode:
        case Key.Space.m_keyCode:
        {
            scrollKey = true;
            break;
        }
        
        default:
        {
            scrollKey = false;
            break;
        }
    }
    
    return scrollKey;
}
