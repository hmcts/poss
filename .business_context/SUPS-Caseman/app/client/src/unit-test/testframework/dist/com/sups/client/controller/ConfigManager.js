//==================================================================
//
// ConfigManager.js
//
// Class responsible for locating the configuration for a particular
// client side GUI component
//
//==================================================================

/**
 * ConfigManager is responsible for locating the configuration for a
 * particular client side GUI component
 *
 * @constructor
 */
function ConfigManager()
{
}

ConfigManager.m_logger = new Category("ConfigManager");

/**
 * Get the configuration for a particular GUI Element based on its
 * id.
 * 
 * @param id the id of the component whose configuration to retrieve
 * @return an array containing the configuration Objects which apply
 *    to the component based on it's id. The array may be empty if
 *    no applicable configuration objects exist for the item.
 * @type Array[Object]
 */
ConfigManager.prototype.getConfig = function(id)
{
	var co = window[id];
	var cs = null == co ? [] : [co]; 
	if(ConfigManager.m_logger.isInfo()) ConfigManager.m_logger.info("ConfigManager.getConfig(" + id + ") cs = " + cs);
	return cs;
}


/**
 * Set the configuration for a particular GUI Element
 *
 * @param id the id of the component whose configuration to set
 * @param config the Object that contains the components configuration
 */
ConfigManager.prototype.setConfig = function(id, config)
{
	window[id] = config;
}


/**
 * Remove the configuration for a particular GUI Element based on it's id.
 * 
 * @param id the id of the component whose configuration to remove
 */
ConfigManager.prototype.removeConfig = function(id)
{
	var config = window[id];

	if(null != config)
	{
		for(var i in config)
        {
        	delete config[i];
        }
        config = null;
	}
}
