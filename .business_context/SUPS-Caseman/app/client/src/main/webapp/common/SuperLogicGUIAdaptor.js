//==================================================================
//
// SuperLogicGUIAdaptor.js
//
// Class for implementing a logic adaptor which can be linked not only
// to a change in an xpath listener, but also event bindings.
//
//==================================================================

/**
 * @author rzxd7g
 * 
 */
function SuperLogicGUIAdaptor()
{
}


SuperLogicGUIAdaptor.m_logger = new Category("SuperLogicGUIAdaptor");
SuperLogicGUIAdaptor.CSS_CLASS_NAME = "superLogic" ;
SuperLogicGUIAdaptor.EVENT_ACTION = "action";

/**
* Subclass of HTMLElementGUIAdaptor
 */
SuperLogicGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
SuperLogicGUIAdaptor.prototype.constructor = SuperLogicGUIAdaptor;


SuperLogicGUIAdaptor.prototype.m_element = null;


/**
 * Add the required protocols to the adaptors
 */
GUIAdaptor._setUpProtocols("SuperLogicGUIAdaptor");
GUIAdaptor._addProtocol('SuperLogicGUIAdaptor', 'BusinessLifeCycleProtocol');


/**
 * Create a new SuperLogicGUIAdaptor
 
 * @param e the logic element to manage
 * @return the new SuperLogicGUIAdaptor
 * @type SuperLogicGUIAdaptor
 * @author rzxd7g
 */
SuperLogicGUIAdaptor.create = function(e)
{
	var a = new SuperLogicGUIAdaptor();
	a._initSuperLogicGUIAdaptor(e);
	return a;
}


/**
 * Initialise the SuperLogicGUIAdaptor, and adds an event handler to
 * the HTML element to callback when a 'change' event is received.
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 * @author rzxd7g
 * 
 */
SuperLogicGUIAdaptor.prototype._initSuperLogicGUIAdaptor = function(e)
{
	if(SuperLogicGUIAdaptor.m_logger.isInfo()) SuperLogicGUIAdaptor.m_logger.info(e.id + ":SuperLogicGUIAdaptor._initSuperLogicGUIAdaptor");
	
	this.m_element = e;
	var a = this;	
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 * @author rzxd7g
 * 
 */
SuperLogicGUIAdaptor.prototype._configure = function(cs)
{
	var actionBusinessLifeCycle = new SuperLogicBusinessLifeCycle();
	actionBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(actionBusinessLifeCycle);

	// Additional event bindings for logic
	var actionEventBinding = null;

	// Run through configuration specific to this element
	for( var i = 0, l = cs.length; i < l; i++ )
	{
		var c = cs[i];
		
		// Get the event configuration objects additional bindings
		if( c.additionalBindings && null == actionEventBinding )
		{
			actionBusinessLifeCycle.configure(c.additionalBindings);
			actionEventBinding = actionBusinessLifeCycle.getEventBinding();			
		}
		
		// Normally, the logic isn't configured if there is no logicOn defined, but the
		// SuperLogicGUIAdaptor has event bindings so the logic can exist without a logicOn
		if( null == c.logicOn && null != c.logic ) this.logic = c.logic;
	}

	// Start addtional event bindings
	if( null != actionEventBinding ) actionEventBinding.start();
}


/**
 * Dispose method
 * @author rzxd7g
 * 
 */
SuperLogicGUIAdaptor.prototype._dispose = function()
{
	this.m_element = null;
}


/**
 * BusinessLifeCycle to activate a buttons action
 * @author rzxd7g
 * 
 */
function SuperLogicBusinessLifeCycle() {}

// SuperLogicBusinessLifeCycle is a sub class of BusinessLifeCycle
SuperLogicBusinessLifeCycle.prototype = new BusinessLifeCycle();
SuperLogicBusinessLifeCycle.prototype.constructor = SuperLogicBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 * @author rzxd7g
 */
SuperLogicBusinessLifeCycle.prototype.getName = function()
{
	return SuperLogicGUIAdaptor.EVENT_ACTION;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the button's actionBinding function to be invoked
 *
 * @param e the BusinessLifeCycleEvent
 * @author rzxd7g
 * @return null; } 
 */
SuperLogicBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	var logicId = e.getComponentId();
	var logicObj = Services.getAdaptorById(logicId);
	
	if( null != logicObj )
	{
		e.getXPath = function() { return null; }
		logicObj.logic.call(logicObj, e);
	}
}
