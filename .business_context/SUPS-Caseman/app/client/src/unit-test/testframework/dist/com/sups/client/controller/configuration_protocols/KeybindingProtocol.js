//==================================================================
//
// KeybindingProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support keybindings.
//
//==================================================================


/*
 * KeybindingProtocol constructor
 *
 * @constructor
 */
function KeybindingProtocol()
{
}


/**
 * The key bindings for this GUIAdaptor
 */
KeybindingProtocol.prototype.m_keys = null;


/**
 * Configuration property for GUI Element for it to support key
 * bindings. The property is an array of objects containing the
 * properties key of type Key and callback of type Function.
 *
 * e.g.
 *  [
 *    {key: Key.F5, callback: function() { alert("F5"); }},
 *    {key: Key.F6, callback: my_function}
 *  ];
 *
 * @type Array[Object{key, callback}]
 * @configuration
 */
KeybindingProtocol.prototype.keyBindings = null;


/**
 * Initialisation method for Keybinding protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
KeybindingProtocol.prototype.configKeybindingProtocol = function(cs)
{
	// Array containing combined key bindings
	var kbs = [];
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		var c = cs[i];		     // Current configuration object
		var ckbs = c.keyBindings; // Current configuration key bindings
		
		if(null != ckbs)
		{
			// Join the keybinding arrays
			kbs = kbs.concat(ckbs);
		}
	}
	
	// Configure specified keys
	
	// Enhancement 366. Allow key binding protocol to
	// support key qualifiers (i.e. Ctrl, Alt and Shift).
	
	var kb = null;
	var qualifiers = null;
	var propagate;
	
	for(var i = 0, l = kbs.length; i < l; i++)
	{
		kb = kbs[i];
		
		if(kb.ctrl == true ||
		   kb.alt == true ||
		   kb.shift == true)
		{
		    // Key binding includes qualifier
		    qualifiers = new Object();
		    
		    qualifiers.ctrl = kb.ctrl;
		    qualifiers.alt = kb.alt;
		    qualifiers.shift = kb.shift;
		}
		
		propagate = (kb.propagate == true) ? true : false;
		
		this.bindKey(kb.key, kb.action, qualifiers, propagate);
		
		if(null != qualifiers)
		{
		    qualifiers = null;
		}
		
	} // End of loop
}


KeybindingProtocol.prototype.disposeKeybindingProtocol = function()
{
	if(null != this.m_keys) this.m_keys.dispose();
}


/**
 * Bind the key to the form element.
 *
 * @param k the key to be bound
 * @param a the action to called when the key is pressed.
 * @param q the key binding qualifiers (Ctrl, Alt and Shift).
 * @param p the flag that determines whether or not to propagate the event
 * @return void
 * @type void
 */
KeybindingProtocol.prototype.bindKey = function(k, a, q, p)
{
	var keys = this.getKeyBindings();
	
	keys.bindKey(k, a, q, p);
}


/**
 * Get the key bindings object. This is really a bit of a hack - key event
 * binding should really take place in the view object which doesn't currently
 * exist. The method is used internally by the EventBinding object which 
 * also binds to key events.
 *
 * @return the ElementKeyBindings object which binds keys to HTML Elements
 * @type ElementKeyBindings
 * @private
 * @todo This binding really needs to be abstracted out into the view
 */
KeybindingProtocol.prototype.getKeyBindings = function()
{
	if(null == this.m_keys) this.m_keys = new ElementKeyBindings(this);
	return this.m_keys;
}
