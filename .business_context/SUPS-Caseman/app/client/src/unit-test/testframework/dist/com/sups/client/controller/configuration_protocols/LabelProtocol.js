//==================================================================
//
// LabelProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support a change of label based on change to bound data.
//
// If the Label protocol is added to a GUIAdaptor, then the
// FormController will call the Adaptor's invokeLabel() method 
// to call any configured label methods when any of the xpaths
// in the labelOn array are modified.
// The FormController will then notify the adaptor of it's new
// enablement state by calling the setLabel() method supplied by
// this protocol. This sets the internal m_label flag.
//
// It is the responsibility of the adaptor to handle the
// m_label value and render itself appropriately in its renderState() method.
//
//==================================================================


/*
 * LabelProtocol constructor
 *
 * @constructor
 */
function LabelProtocol()
{
}


/**
 * Holds the XPath containing the label for this adaptor
 *
 * @configuration
 * @merge-rule
 * @type String
 */
LabelProtocol.prototype.m_labelXPath = null;


/**
 * Convenience property defining whether label has changed
 *
 * @type Boolean
 */
LabelProtocol.prototype.m_labelChanged = false;


/**
 * Holds the label for this adaptor
 *
 * @type String
 */
LabelProtocol.prototype.m_label = null;

/**
 * Array of XPaths, a change to one of these XPaths 
 * means the label function is re-run
 * is re-written.
 *
 * @configuration
 * @merge-rule
 * @type Array[String]
 */
LabelProtocol.prototype.labelOn = null;

/**
 * Contains the current label() implementation
 * This can be either the _defaultLabelImpl (defined below)
 * or an application configured definition
 * 
 *
 * @configuration
 * @merge-rule
 * @type Script
 */
LabelProtocol.prototype.label = null;

/**
 * Initialisation method for LabelProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
LabelProtocol.prototype.configLabelProtocol = function(cs)
{
	
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(this.label==null)
			this.label = cs[i].label;
		if(this.labelOn==null)
			this.labelOn = cs[i].labelOn;
		if(this.m_labelXPath==null)
			this.m_labelXPath = cs[i].labelXPath; 
	}
	
	if(this.label == null && this.m_labelXPath!=null)
	{
		// Use default label function implementation
		this.label = this._defaultLabelImpl;
	}
}



/*
 * Sets up the protocol. 
 */
LabelProtocol.prototype.initialiseLabelProtocol = function(e)
{
	this.setLabel(this.invokeLabel(e));	
}


LabelProtocol.prototype._defaultLabelImpl = function()
{
	return Services.getValue(this.m_labelXPath);
}

/**
 * Perform cleanup required by the LabelProtocol before
 * it is destroyed
 */
LabelProtocol.prototype.disposeLabelProtocol = function()
{
}

/**
* Get XPath for label
*/

LabelProtocol.prototype.getLabelXPath = function()
{
	return this.m_labelXPath;
}

/**
* Check whether an XPath has been set for holding the adaptor label
*/
LabelProtocol.prototype.hasLabelXPath = function()
{
	return this.hasConfiguredProperty("labelXPath");
}

/**
 * Get additional databindings that trigger a refresh of the
 * field's label.
 */
LabelProtocol.prototype.getLabelOn = function()
{
	return this.labelOn;
}

/**
*Check whether an array of XPaths has been set which will trigger
*a change of label for this adaptor
**/
LabelProtocol.prototype.hasLabelOn = function()
{
	return this.hasConfiguredProperty("labelOn");
}

/**
*Check whether a label function has been defined.
*Confidence test really since we should be ensuring
* that there always is one.
**/ 
LabelProtocol.prototype.hasLabel = function()
{
	if(null==this.label)
	{
		return false;
	}
	else
	{
		return true;
	}
}
/**
 * Invoke the label method(s) of the GUI Element
 *
 * @return the name of the GUI Element.
 * @type String
 */
LabelProtocol.prototype.invokeLabel = function()
{		
    if (this.hasLabel())
    {
	   return this.label.call(this);
    }
}


/**
 * Set whether or not the label for this element has changed
 *
 * @param e new label value
 * @return true if the state of adaptor changed
 * @type boolean
 */
LabelProtocol.prototype.setLabel = function(e)
{
	var r = false;
	if(e != this.m_label)
	{
		this.m_label = e;
		this.m_labelChanged = true;
		r = true;
	}
	return r;
}


/**
 * Get the label value.
 *
 * @return the label value
 * @type boolean
 */
LabelProtocol.prototype.getLabel = function()
{
	return this.m_label;
}

/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
LabelProtocol.prototype.getListenersForLabelProtocol = function()
{
    var listenerArray = new Array();
    var listener = FormControllerListener.create(this, FormController.LABEL);
    
	if(null != this.hasLabelXPath && this.hasLabelXPath())
	{
		labelXP = this.getLabelXPath();
		if(null != labelXP) 
        {
            listenerArray.push({xpath: labelXP, listener: listener});
        }
	}
	var on = this.getLabelOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: listener});
		}
	}
    return listenerArray;
}

