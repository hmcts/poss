//==================================================================
//
// LogicProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support naming of components. Logic's are used to enable actions
// to be implemented when the databinding changes
//
//==================================================================


/*
 * LogicProtocol constructor
 *
 * @constructor
 */
function LogicProtocol()
{
}

/**
* Array of xpaths which determine the when the logic function is to be
* executed.
*/
LogicProtocol.prototype.logicOn = null ;

/**
 * Logic function invoked when one of the logicOn XPaths is modified
 */
LogicProtocol.prototype.logic = null;


/*
 * Sets up the protocol. 
 */
LogicProtocol.prototype.initialiseLogicProtocol = function(e)
{
	this.initialiseLogicState(e);	
}



LogicProtocol.prototype.getLogicOn = function ()
{
	return this.logicOn ;
}


LogicProtocol.prototype.hasLogic = function ()
{
	return this.hasConfiguredProperty("logic");
}

LogicProtocol.prototype.initialiseLogicState = function(e)
{
	if(this.hasLogic())
	{
		var on = this.getLogicOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
				if(on[i] == "/")
				{
					this.invokeLogic(e);
				}
			}
		}
	}
}

/** 
* Invoke the logic method(s) of the GUI Element
*
* @param mV the model value to validate
*/

LogicProtocol.prototype.invokeLogic = function (event)
{
	var cs = this.getConfigs();
	if (null != this.logic )
	{
		this.logic.call(this, event);
	}
}

LogicProtocol.prototype.configLogicProtocol = function(cs)
{
	// Need to determine how to merge logicOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].logicOn)
		{
			this.logicOn = cs[i].logicOn;
			this.logic = cs[i].logic ;
			break;
		}
	}
}

/**
 * Perform cleanup required by the NameProtocol before
 * it is destroyed
 */
LogicProtocol.prototype.disposeLogicProtocol = function()
{
}



/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
LogicProtocol.prototype.getListenersForLogicProtocol = function()
{
    var listenerArray = new Array();
    var listener = FormControllerListener.create(this, FormController.LOGIC);
    
	var on = this.getLogicOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: listener});
		}
	}
    return listenerArray;
}

