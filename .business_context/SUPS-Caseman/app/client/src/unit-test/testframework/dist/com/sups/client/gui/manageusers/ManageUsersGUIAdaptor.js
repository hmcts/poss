//==================================================================
//
// ManageUsersGUIAdaptor.js
//
// Class for integrating a form to manage users security roles with
// the Framework.
//
//==================================================================


/**
 * @constructor
 * @private
 */
function ManageUsersGUIAdaptor() {}

/**
 * Logging category for the ManageUsersGUIAdaptor
 *
 * @type Category
 * @private
 */
ManageUsersGUIAdaptor.m_logger = new Category("ManageUsersGUIAdaptor");

/**
 *  ManageUsersGUIAdaptor components identifiers
 */
ManageUsersGUIAdaptor.SAVE = "_Save";
ManageUsersGUIAdaptor.CLOSE = "_Close";

/**
 * ManageUsersGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
ManageUsersGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Set the constructor property so we can identify the type
 */
ManageUsersGUIAdaptor.prototype.constructor = ManageUsersGUIAdaptor;

/**
 * Add the required protocols to the ZoomFieldGUIAdaptor
 */
GUIAdaptor._setUpProtocols('ManageUsersGUIAdaptor');
GUIAdaptor._addProtocol('ManageUsersGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('ManageUsersGUIAdaptor', 'EnablementProtocol');
GUIAdaptor._addProtocol('ManageUsersGUIAdaptor', 'ReadOnlyProtocol');

/**
 * Create a new ManageUsersGUIAdaptor
 *
 * @param e the outer DIV element of the form to manage
 * @return the new ManageUsersGUIAdaptor
 * @type ManageUsersGUIAdaptor
 */
ManageUsersGUIAdaptor.create = function(e)
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("create()");

	var a = new ManageUsersGUIAdaptor();
	a._initialiseAdaptor(e);
	
	return a;
}

/**
 * Initialise the ManageUsersGUIAdaptor
 *
 * @param e the HTMLElement for the Manage Users element to be managed
 * @private
 */
ManageUsersGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_initialiseAdaptor()");
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	this.m_adminRoles = null;
	this.m_closeForm = null;
}

/**
 * Clean up after the component
 */
ManageUsersGUIAdaptor.prototype._dispose = function()
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("dispose()");

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
ManageUsersGUIAdaptor.prototype._configure = function(cs)
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_configure()");

	var fc = FormController.getInstance();
	var cm = fc.getFormView().getConfigManager();

	var muId = this.getId();
	var epId = muId + ManageUsersRenderer.EP_ADAPTOR;

	var thisObj = this;

	// Set the data binding for the Search Panel
	var a = fc.getAdaptorById(muId + ManageUsersRenderer.SP_ADAPTOR);
	a._setAdaptorDataBinding(this.dataBinding);

	// Set the data binding for the Edit Panel
	a = fc.getAdaptorById(epId);
	a._setAdaptorDataBinding(this.dataBinding);

	this.m_adminRoles = cm.getConfig(muId)[0].adminRoles;

	// Check administrator role(s) is/are defined
	if (null == this.m_adminRoles)
	{
		throw new ConfigurationException("No administrator role(s) specified for: " + muId);
	}

	// On page load set the Edit Panel's containing panel read only if user doesn't
	// have required role(s)
	a = fc.getAdaptorById(muId + ManageUsersRenderer.EDIT_PANEL);

	cm.setConfig(
		a.getId(),
		{
			readOnlyOn: ["/"],		
			isReadOnly: function() { return (thisObj._isEditPanelReadOnly()); }
		}
	);

	// Propagate the administrator role(s) to the Edit Panel. (Used by the button
	// panel for enable/disabling grid move buttons.)
	cm.setConfig(
		epId,
		{
			adminRoles: this.m_adminRoles
		}
	);

	// Configure the action binding for the Save button
	cm.setConfig(
		muId + ManageUsersGUIAdaptor.SAVE,
		{
			actionBinding: function() { thisObj._handleSave(); },
			enableOn: [this.dataBinding + "/" + EditPanelGUIAdaptor.MODIFIED_FLAG],
			isEnabled: function() { return (thisObj._isSaveEnabled()); }
		}
	);

	this.m_closeForm = cm.getConfig(muId)[0].closeForm;
	
	// Check Close button navigation is defined
	if (null == this.m_closeForm)
	{
		throw new ConfigurationException("No form specified for Close button navigation: " + muId);
	}

	// Configure the action binding for the Close button
	cm.setConfig(
		muId + ManageUsersGUIAdaptor.CLOSE,
		{
			actionBinding: function() { thisObj._handleClose(); }
		}
	);
}

/**
 * Determines whether or not the Edit Panel is read only.
 *
 * @returns true if the user has the required role(s). Otherwise false.
 *
 * @private
 */
ManageUsersGUIAdaptor.prototype._isEditPanelReadOnly = function()
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_isEditPanelReadOnly()");

	return (!Services.hasAccessToRoles(this.m_adminRoles));
}

/**
 * Handle a click on the Close button.
 *
 * @private
 */
ManageUsersGUIAdaptor.prototype._handleClose = function()
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_handleClose()");

	var v = Services.getValue(this.dataBinding + "/" + EditPanelGUIAdaptor.MODIFIED_FLAG);

	if (v == "true")
	{
		var thisObj = this;
		var msg = "Changes have been made but not saved. Do you wish to continue?";
		Services.showDialog(StandardDialogTypes.YES_NO, function(b) { thisObj._handleContinue(b) }, msg, "Information");	
	}
	else
	{
		Services.navigate(this.m_closeForm, false);
	}
}

/**
 * Handle the Save Changes Yes/No button clicks.
 *
 * @private
 */
ManageUsersGUIAdaptor.prototype._handleContinue = function(b)
{
	switch(b)
	{
		case StandardDialogButtonTypes.YES: {
			// Navigate away from form
			Services.navigate(this.m_closeForm, false);
			break;
		}
		case StandardDialogButtonTypes.NO: {
			// Don't navigate away from form
			break;
		}
	}
}

/**
 * Determines whether or not the Save button is enabled.
 *
 * @returns true if the Assigned Roles grid has not been changed. Otherwise false.
 *
 * @private
 */
ManageUsersGUIAdaptor.prototype._isSaveEnabled = function()
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_isSaveEnabled()");

	var v = Services.getValue(this.dataBinding + "/" + EditPanelGUIAdaptor.MODIFIED_FLAG);

	return (v == "false" || v == null ? false : true);
}

/**
 * Handle a click on the Save button.
 *
 * @private
 */
ManageUsersGUIAdaptor.prototype._handleSave = function()
{
	if (ManageUsersGUIAdaptor.m_logger.isTrace()) ManageUsersGUIAdaptor.m_logger.trace("_handleSave()");

	var userId = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.USER_ID);
	var courtCode = Services.getValue(this.dataBinding + "/" + SearchPanelGUIAdaptor.COURT_CODE);

	EditPanelGUIAdaptor.updateRoles(userId, courtCode, this.dataBinding);
}

