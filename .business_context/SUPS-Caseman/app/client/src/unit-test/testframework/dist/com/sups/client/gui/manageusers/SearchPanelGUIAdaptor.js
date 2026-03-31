//==================================================================
//
// SearchPanelGUIAdaptor.js
//
// Class for integrating a panel to search for users security roles
// with the Framework.
//
//==================================================================


/**
 * @constructor
 * @private
 */
function SearchPanelGUIAdaptor() {}

/**
 * Logging category for the SearchPanelGUIAdaptor
 *
 * @type Category
 * @private
 */
SearchPanelGUIAdaptor.m_logger = new Category("SearchPanelGUIAdaptor");

/**
 *  SearchPanelGUIAdaptor components identifiers
 */
SearchPanelGUIAdaptor.USER_ID = "UserId";
SearchPanelGUIAdaptor.COURT_CODE = "CourtCode";
SearchPanelGUIAdaptor.SEARCH = "_Search";

/**
 * SearchPanelGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
SearchPanelGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Set the constructor property so we can identify the type
 */
SearchPanelGUIAdaptor.prototype.constructor = SearchPanelGUIAdaptor;

/**
 * Add the required protocols to the SearchPanelGUIAdaptor
 */
GUIAdaptor._setUpProtocols('SearchPanelGUIAdaptor');
GUIAdaptor._addProtocol('SearchPanelGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('SearchPanelGUIAdaptor', 'EnablementProtocol');
GUIAdaptor._addProtocol('SearchPanelGUIAdaptor', 'ReadOnlyProtocol');

/**
 * Create a new SearchPanelGUIAdaptor
 *
 * @param e the outer DIV element of the form to manage
 * @return the new SearchPanelGUIAdaptor
 * @type SearchPanelGUIAdaptor
 */
SearchPanelGUIAdaptor.create = function(e)
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("create()");

	var a = new SearchPanelGUIAdaptor();
	a._initialiseAdaptor(e);
	
	return a;
}

/**
 * Initialise the SearchPanelGUIAdaptor
 *
 * @param e the HTMLElement for the Search Panel element to be managed
 * @private
 */
SearchPanelGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_initialiseAdaptor()");
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);

	this.m_rolesAdaptorId = null;
}

/**
 * Clean up after the component
 */
SearchPanelGUIAdaptor.prototype._dispose = function()
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("dispose()");

	// Dispose of the renderer
	this.m_renderer.dispose();
	this.m_renderer = null;
}

/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 *
 * @param cs an array of the the adaptor's configuration items
 */
SearchPanelGUIAdaptor.prototype._configure = function(cs)
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_configure()");

	var cm = FormController.getInstance().getFormView().getConfigManager();
	var spId = this.getId();

	// Configure the User ID input box
	var userId = spId + "_" + SearchPanelGUIAdaptor.USER_ID;
	var userIdDataBinding = this.dataBinding + "/" + SearchPanelGUIAdaptor.USER_ID;

	cm.setConfig(
		userId,
		{
			dataBinding: userIdDataBinding,
			validateOn: [userIdDataBinding],
			validate: function() { return (thisObj._isUserIdValid()); }
		}
	);

	// Configure the Court Code input box
	cm.setConfig(
		spId + "_" + SearchPanelGUIAdaptor.COURT_CODE,
		{
			dataBinding: this.dataBinding + "/" + SearchPanelGUIAdaptor.COURT_CODE
		}
	);

	// Configure the action binding for the Search button
	var thisObj = this;

	cm.setConfig(
		spId + SearchPanelGUIAdaptor.SEARCH,
		{
			actionBinding: function() { thisObj._handleSearch(); },
			enableOn: [userIdDataBinding],
			isEnabled: function() { return (thisObj._isSearchEnabled()); }
		}
	);

	// Get the logged in user's home court code
	var ac = Services.getAppController();
	var securityService = ac.getSecurityServiceByName("getHomeCourt");
	var homeCourt = Services.getValue(securityService.getDataBinding());

	// Set the home court as the default court code
	Services.setValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.COURT_CODE, homeCourt);
}

/**
 * Sets the data binding for this adaptor.
 *
 * @param db the data binding for this adaptor
 * @private
 */
SearchPanelGUIAdaptor.prototype._setAdaptorDataBinding = function(db)
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_setAdaptorDataBinding()");

	this.dataBinding = db;
}

/**
 * Determines whether or not the Search button is enabled.
 *
 * @returns true if the User ID is valid. Otherwise false.
 *
 * @private
 */
SearchPanelGUIAdaptor.prototype._isSearchEnabled = function()
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_isSearchEnabled()");

	var v = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.USER_ID);

	return ((v == null || v.length == 0 || this._isUserIdValid() != null) ? false : true);
}

/**
 * Determines whether or not the User ID is valid.
 *
 * @returns true if the User ID is valid. Otherwise false.
 *
 * @private
 */
SearchPanelGUIAdaptor.prototype._isUserIdValid = function()
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_isUserIdValid()");

	var v = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.USER_ID);
	var ec = null;
/*
	TODO!! - Implement some user ID validation?
	
	if (v.length > 8)
	{
		ec = ErrorCode.getErrorCode('FW_MANAGEUSERS_InvalidUserId');
    }
*/
	return ec;
}

/**
 * Handle a click on the Search button.
 *
 * @private
 */
SearchPanelGUIAdaptor.prototype._handleSearch = function()
{
	if (SearchPanelGUIAdaptor.m_logger.isTrace()) SearchPanelGUIAdaptor.m_logger.trace("_handleSearch()");

	var userId = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.USER_ID);
	var courtCode = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.COURT_CODE);

	// Get the Edit Panel to retrieve the roles for the given user ID and court code
	EditPanelGUIAdaptor.getRoles(userId, courtCode, this.dataBinding);
}


