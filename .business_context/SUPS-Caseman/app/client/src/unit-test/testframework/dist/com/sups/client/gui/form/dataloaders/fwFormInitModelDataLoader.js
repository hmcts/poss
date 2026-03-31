function fwFormInitModelDataLoader()
{
}

fwFormInitModelDataLoader.prototype = new fwFormInitDataLoader()
fwFormInitModelDataLoader.prototype.constructor = fwFormInitModelDataLoader;


fwFormInitModelDataLoader.m_logger = new Category("fwFormInitModelDataLoader");

fwFormInitModelDataLoader.create = function(config, form, generateEvents)
{
	var mdl = new fwFormInitModelDataLoader();
	
	mdl._setGenerateDMEvents(generateEvents);
	
	if(null == config.name)
	{
		config.name = "Model data for form " + form.getId();
		if(fwFormInitModelDataLoader.m_logger.isWarn()) fwFormInitModelDataLoader.m_logger.warn("Missing name for model data in form " + form.getId() + ", defaulting to " + config.name);
	}
	
	// Default dataBinding to form's modelXPath configuration if dataBinding not explicitly declared

	if(null == config.dataBinding)
	{
		config.dataBinding = form.getModelParentXPath();
		if(fwFormInitModelDataLoader.m_logger.isWarn()) fwFormInitModelDataLoader.m_logger.warn("Missing dataBinding for model data " + this.m_name + " for form " + form.getId() + ", defaulting to " + config.dataBinding);
	}

	mdl._initialise(config);
	
	return mdl;
}


fwFormInitModelDataLoader.prototype._createDataService = function(resultHandler)
{
	return fwDataService.create(
		null == this.m_config.initialise ? this.m_config : this.m_config.initialise,	// If an initialise configuration is specified, then this is used in preferance to normal lifecycle configuration
		resultHandler,
		true
	);
}


/**
 * Get a name associated with this type of service
 *
 * @return a string containing the name of this type of service
 * @type String
 * @protected
 */
fwFormInitModelDataLoader.prototype._getServiceTypeName = function()
{
	return "Initial form data loading service";
}

/**
 * Handle a successful load of a dom into this Model initialisation.
 *
 * @dom The model data
 * @name The name of...somtehing. 
 */
fwFormInitModelDataLoader.prototype._successHandler = function(dom, name)
{
    // If present invoke custom post business life cycle processing
    if(null != this.m_config.postBusinessLifeCycleAction)
    {
        this.m_config.postBusinessLifeCycleAction.call(null, dom);
    }
	
	fwFormInitDataLoader.prototype._successHandler.call(this, dom, name)	
}

