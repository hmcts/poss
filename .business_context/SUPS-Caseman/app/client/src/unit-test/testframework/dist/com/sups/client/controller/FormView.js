//==================================================================
//
// FormView.js
//
// Abstract class which represents a form view.
//
//==================================================================


/**
 * FormView Constructor
 *
 * @constructor
 */
function FormView()
{
}


/**
 * GUIAdaptorFactory which creates GUIAdaptors that are approriate
 * for the view.
 *
 * @private
 * @type GUIAdaptorFactory 
 */
FormView.prototype.m_guiAdaptorFactory = null;


/**
 * ConfigManager which is used to find configurations for GUIAdaptors
 *
 * @private
 * @type ConfigManger
 */
FormView.prototype.m_configManager = null;


/**
 * Get the GUIAdaptorFactory approriate for this view
 *
 * @return the GUIAdaptorFactory for the view
 * @type GUIAdaptorFactory
 */
FormView.prototype.getGUIAdaptorFactory = function()
{
	return this.m_guiAdaptorFactory;
}


/**
 * Get the ConfigManger for this view
 * 
 * @return the ConfigManager for the view
 * @type ConfigManager
 */
FormView.prototype.getConfigManager = function()
{
	return this.m_configManager;
}


/**
 * Cleanup the formview
 */
FormView.prototype.dispose = function()
{
}
