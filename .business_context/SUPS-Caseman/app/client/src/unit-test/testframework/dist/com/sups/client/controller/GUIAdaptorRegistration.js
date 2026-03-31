//==================================================================
//
// GUIAdaptorRegistration.js
//
// Class which maintains the registration information for an
// external GUI Adpator.
//
//==================================================================


/**
 * Class which maintains the registration information for an
 * external GUI Adpator.
 *
 * @constructor
 */
function GUIAdaptorRegistration()
{
}

GUIAdaptorRegistration.m_logger = new Category("GUIAdaptorRegistration");

/*
 * CSS classname of the div which identifies the external adaptor
 *
 * type String
 */
GUIAdaptorRegistration.prototype.m_className = null;


/*
 * Function which creates instances of the adaptor being registered.
 *
 * type Function
 */
GUIAdaptorRegistration.prototype.m_factory


/**
 * Factory method to create instances of GUIAdaptorRegistration
 *
 * @param className CSS classname of the div which identifies the
 *   adaptor type to create, represented as a String.
 * @param factory Function which creates instances of the adaptor.
 * @return an instance of GUIAdaptorRegistration
 * @type GUIAdaptorRegistration
 */
GUIAdaptorRegistration.create = function(className, factory)
{
	if(GUIAdaptorRegistration.m_logger.isInfo()) GUIAdaptorRegistration.m_logger.info("GUIAdaptorRegistration.create(className: " + className + ", factory: " + factory + ")");
	var r = new GUIAdaptorRegistration();
	
	r.m_className = className;
	r.m_factory = factory;
	
	return r;
}


/**
 * Get the CSS class name for this registration
 *
 * @return the CSS class name for this registation
 * @type String
 */
GUIAdaptorRegistration.prototype.getClassName = function()
{
	return this.m_className;
}


/**
 * Get the factory function to create instances of the adaptor
 * which has been registered.
 *
 * @return the factory function
 * @type Function
 */
GUIAdaptorRegistration.prototype.getFactory = function()
{
	return this.m_factory;
}

GUIAdaptorRegistration.prototype.toString = function()
{
	return "[GUIAdaptorRegistration className: " + this.m_className + ", factory: " + this.m_factory + "]";
}

/**
 * Method clears up instance member references. As the class name may come
 * from the top most browser window the registration object may reference
 * variables in more than one window space.
 *
*/
GUIAdaptorRegistration.prototype.dispose = function()
{
    this.m_className = null;
    this.m_factory = null;
}
