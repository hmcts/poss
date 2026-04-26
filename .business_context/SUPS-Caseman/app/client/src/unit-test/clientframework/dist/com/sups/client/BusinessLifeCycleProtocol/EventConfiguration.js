//==================================================================
//
// EventConfiguration.js
//
//==================================================================


/**
 * This class should not normally be instantiated, although legacy
 * code may still create instances. It is here to serve as a
 * template for the configuration which should be written directly
 * in the form coinfiguration as a plain object with the properties
 * described below.
 */
function EventConfiguration()
{
	EventConfiguration.m_logger.error("EventConfiguration objects should never be instantiated");
}


EventConfiguration.m_logger = new Category("EventConfiguration");


/**
 * Array of id's of components that trigger an event when they are clicked on.
 *
 * @type Array[Object{element: String}]
 */
EventConfiguration.prototype.singleClicks = null;


/**
 * Array of id's of components that trigger an event when they are double clicked on.
 *
 * @type Array[Object{element: String}]
 */
EventConfiguration.prototype.doubleClicks = null;


/**
 * Array of objects which define a keybinding on a component
 *
 * @type Array[Object{element: String, key: Key}]
 */
EventConfiguration.prototype.keys = null;
