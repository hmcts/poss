//LogicGUIAdaptor



function LogicGUIAdaptor()
{
}

LogicGUIAdaptor.m_logger = new Category("LogicGUIAdaptor");
LogicGUIAdaptor.LOGIC_CSS_CLASS_NAME = "logic" ;

/**
* Subclass of HTMLElementGUIAdaptor
*/

LogicGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
LogicGUIAdaptor.prototype.constructor = LogicGUIAdaptor;

/**
 * Add the required protocols to the adaptors
 */
 
GUIAdaptor._setUpProtocols('LogicGUIAdaptor');

/**
 * Create a new LogicGUIAdaptor
 
 * @param e the logic element to manage
 * @return the new LogicGUIAdaptor
 * @type LogicGUIAdaptor
 */
LogicGUIAdaptor.create = function(e)
{
	var a = new LogicGUIAdaptor();
	a._initLogicGUIAdaptor(e);
	return a;
}


/**
 * Initialise the LogicGUIAdaptor, and adds an event handler to
 * the HTML element to callback when a 'change' event is received.
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
LogicGUIAdaptor.prototype._initLogicGUIAdaptor = function(e)
{
	if(LogicGUIAdaptor.m_logger.isInfo()) LogicGUIAdaptor.m_logger.info(e.id + ":LogicGUIAdaptor._initLogicGUIAdaptor");
	
	this.m_element = e;
	var a = this;	
}
