//==================================================================
//
// EditPanelGUIAdaptor.js
//
// Class for integrating a panel to edit users security roles with
// the Framework.
//
//==================================================================


/**
 * @constructor
 * @private
 */
function EditPanelGUIAdaptor() {}

/**
 * Logging category for the EditPanelGUIAdaptor
 *
 * @type Category
 * @private
 */
EditPanelGUIAdaptor.m_logger = new Category("EditPanelGUIAdaptor");

/**
 *  EditPanelGUIAdaptor components identifiers
 */
EditPanelGUIAdaptor.LEFT_ARROW = "_LeftArrow";
EditPanelGUIAdaptor.RIGHT_ARROW = "_RightArrow";
EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW = "_DoubleLeftArrow";
EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW = "_DoubleRightArrow";
EditPanelGUIAdaptor.ASSIGNED_ROLES = "AssignedRoles";
EditPanelGUIAdaptor.AVAILABLE_ROLES = "AvailableRoles";
EditPanelGUIAdaptor.ALL_ROLES = "AllRoles";

/**
 * Assigned Roles modified flag
 */
EditPanelGUIAdaptor.MODIFIED_FLAG = "modified";

/**
 * EditPanelGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
EditPanelGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Set the constructor property so we can identify the type
 */
EditPanelGUIAdaptor.prototype.constructor = EditPanelGUIAdaptor;

/**
 * Add the required protocols to the EditPanelGUIAdaptor
 */
GUIAdaptor._setUpProtocols('EditPanelGUIAdaptor');
GUIAdaptor._addProtocol('EditPanelGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('EditPanelGUIAdaptor', 'EnablementProtocol');
GUIAdaptor._addProtocol('EditPanelGUIAdaptor', 'ReadOnlyProtocol');

/**
 * Create a new EditPanelGUIAdaptor
 *
 * @param e the outer DIV element of the form to manage
 * @return the new EditPanelGUIAdaptor
 * @type EditPanelGUIAdaptor
 */
EditPanelGUIAdaptor.create = function(e)
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("create()");

	var a = new EditPanelGUIAdaptor();
	a._initialiseAdaptor(e);
	
	return a;
}

/**
 * Initialise the EditPanelGUIAdaptor
 *
 * @param e the HTMLElement for the DIV element to be managed
 * @private
 */
EditPanelGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_initialiseAdaptor()");
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
}

/**
 * Clean up after the component
 */
EditPanelGUIAdaptor.prototype._dispose = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("dispose()");

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
EditPanelGUIAdaptor.prototype._configure = function(cs)
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_configure()");

	var fc = FormController.getInstance();
	var cm = fc.getFormView().getConfigManager();
	var epId = this.getId();

	// Assigned roles modified flag
	this._setModified(false);

	// Configure the Assigned Roles grid
	var gSrcData = this.dataBinding + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES;
	var gDataBinding = gSrcData + "Selected";

	var thisObj = this;

	cm.setConfig(
		epId + "_" + EditPanelGUIAdaptor.ASSIGNED_ROLES,
		{
			dataBinding: gDataBinding,
			srcData: gSrcData,
			rowXPath: "role",
			keyXPath: "id",
			columns: [{xpath: "."}],
			multipleSelection: true
		}
	);

	// On page load enable the button panel only if user has the required role(s)
	cm.setConfig(
		epId + EditPanelRenderer.BUTTON_PANEL,
		{
			enableOn: ["/"],		
			isEnabled: function() { return (thisObj._isButtonPanelEnabled()); }
		}
	);

	// Configure the action binding for the Right Arrow button
	cm.setConfig(
		epId + EditPanelGUIAdaptor.RIGHT_ARROW,
		{
			actionBinding: function() { thisObj._handleRightArrow(); },
			enableOn: [gDataBinding  + "//*"],
			isEnabled: function() { return (thisObj._isRightArrowEnabled()); }
		}
	);

	// Configure the action binding for the Double Right Arrow button
	cm.setConfig(
		epId + EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW,
		{
			actionBinding: function() { thisObj._handleDoubleRightArrow(); },
			enableOn: [gSrcData + "//*"],
			isEnabled: function() { return (thisObj._isDoubleRightArrowEnabled()); }
		}
	);

	gSrcData = this.dataBinding + "/" + EditPanelGUIAdaptor.AVAILABLE_ROLES;
	gDataBinding = gSrcData + "Selected";

	// Configure the action binding for the Left Arrow button
	cm.setConfig(
		epId + EditPanelGUIAdaptor.LEFT_ARROW,
		{
			actionBinding: function() { thisObj._handleLeftArrow(); },
			enableOn: [gDataBinding + "//*"],
			isEnabled: function() { return (thisObj._isLeftArrowEnabled()); }
		}
	);

	// Configure the action binding for the Double Left Arrow button
	cm.setConfig(
		epId + EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW,
		{
			actionBinding: function() { thisObj._handleDoubleLeftArrow(); },
			enableOn: [gSrcData + "//*"],
			isEnabled: function() { return (thisObj._isDoubleLeftArrowEnabled()); }
		}
	);

	// Configure the Available Roles grid
	cm.setConfig(
		epId + "_" + EditPanelGUIAdaptor.AVAILABLE_ROLES,
		{
			dataBinding: gDataBinding,
			srcData: gSrcData,
			rowXPath: "role",
			keyXPath: "id",
			columns: [{xpath: "."}],
			multipleSelection: true
		}
	);

	// Get the available roles from Application Controller, format them, add
	// default values and then copy them into the adaptor's data binding
	var availableRoles = Services.getAppController().getAppRoles().getRolesNode();

	// Create all roles node
	var dom = XML.createDOM(null, null, null);
	var allRolesNode = dom.createElement(EditPanelGUIAdaptor.ALL_ROLES);

	// Copy <Role> nodes to all roles node
	var roleNodes = availableRoles.selectNodes("/Roles/Role");

	// Change each available role into the required format and add Date From/To
	// default values
	for (var i = 0, l = roleNodes.length; i < l; i++)
	{
		// Get <Role> node
		var node = roleNodes[i].selectSingleNode(".");

		// Create a <role> node with the name attribute as it's text
		var roleNode = dom.createElement("role");
		var textNode = dom.createTextNode(node.getAttribute("name"));
		roleNode.appendChild(textNode);

		// Copy the id attribute if it exists
		var text = node.getAttribute("id");
		if (text != null) {
			roleNode.setAttribute("id", text);
		}

		// Copy the parent attribute if it exists
		text = node.getAttribute("parent");
		if (text != null) {
			roleNode.setAttribute("parent", text);
		}

		// Add the <role> node to the all roles node
		allRolesNode.appendChild(roleNode);
	}

	// Set all roles node in the adaptor's data binding
	Services.replaceNode(this.dataBinding + "/" + EditPanelGUIAdaptor.ALL_ROLES, allRolesNode);
}

/**
 * Sets the data binding for this adaptor.
 *
 * @param db the data binding for this adaptor 
 * @private
 */
EditPanelGUIAdaptor.prototype._setAdaptorDataBinding = function(db)
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_setAdaptorDataBinding()");

	this.dataBinding = db;
}

/**
 * Set the Assigned Roles grid modified flag.
 *
 * @param flag the value to set  
 * @private
 */
EditPanelGUIAdaptor.prototype._setModified = function(flag)
{
	Services.setValue(this.dataBinding + "/" + EditPanelGUIAdaptor.MODIFIED_FLAG, flag.toString());
}

/**
 * Handle a click on the Right Arrow button.
 * Move Assigned Roles grid selected item into Available Roles grid.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._handleRightArrow = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_handleRightArrow()");

	// Move Assigned Roles grid selected value(s) to Available Roles grid
	this._moveGridValues(EditPanelGUIAdaptor.ASSIGNED_ROLES, EditPanelGUIAdaptor.AVAILABLE_ROLES);
}

/**
 * Handle a click on the Left Arrow button.
 * Move Available Roles grid selected item into Assigned Roles grid.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._handleLeftArrow = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_handleLeftArrow()");

	// Move Available Roles grid selected value(s) to Assigned Roles grid
	this._moveGridValues(EditPanelGUIAdaptor.AVAILABLE_ROLES, EditPanelGUIAdaptor.ASSIGNED_ROLES);
}

/**
 * Handle a click on the Double Right Arrow button.
 * Move all Assigned Roles grid items into Available Roles grid.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._handleDoubleRightArrow = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_handleDoubleRightArrow()");

	// Move all Assigned Roles grid values to Available Roles grid
	this._moveAllGridValues(EditPanelGUIAdaptor.ASSIGNED_ROLES, EditPanelGUIAdaptor.AVAILABLE_ROLES);
}

/**
 * Handle a click on the Double Left Arrow button.
 * Move all Available Roles grid items into Assigned Roles grid.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._handleDoubleLeftArrow = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_handleDoubleLeftArrow()");

	// Move all Available Roles grid values to Assigned Roles grid
	this._moveAllGridValues(EditPanelGUIAdaptor.AVAILABLE_ROLES, EditPanelGUIAdaptor.ASSIGNED_ROLES);	
}

/**
 * Determines whether or not the Button Panel is enabled.
 *
 * @returns true if the user has the required role(s). Otherwise false.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._isButtonPanelEnabled = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_isButtonPanelEnabled()");

	var cm = FormController.getInstance().getFormView().getConfigManager();
	var ar = cm.getConfig(this.getId())[0].adminRoles;

	if (ar != null) {
		// Roles configured so check user has access
		return (Services.hasAccessToRoles(ar));
	}
	else {
		// No roles configured so always enabled
		return (true);
	}
}

/**
 * Determines whether or not the Right Arrow button is enabled.
 *
 * @returns true if one or more rows are selected in the Assigned Roles grid.
 * Otherwise false.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._isRightArrowEnabled = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_isRightArrowEnabled()");

	var n = Services.countNodes(this.dataBinding + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES + "Selected/id");

	return (n > 0);
}

/**
 * Determines whether or not the Left Arrow button is enabled.
 *
 * @returns true if one or more rows are selected in the Availables Roles grid.
 * Otherwise false.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._isLeftArrowEnabled = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_isLeftArrowEnabled()");

	var n = Services.countNodes(this.dataBinding + "/" + EditPanelGUIAdaptor.AVAILABLE_ROLES + "Selected/id");

	return (n > 0);
}

/**
 * Determines whether or not the Double Right Arrow button is enabled.
 *
 * @returns true if the Assigned Roles grid is not empty. Otherwise false.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._isDoubleRightArrowEnabled = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_isDoubleRightArrowEnabled()");

	var n = Services.countNodes(this.dataBinding + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES + "/role");

	return (n > 0);
}

/**
 * Determines whether or not the Double Left Arrow button is enabled.
 *
 * @returns true if the Available Roles grid is not empty. Otherwise false.
 *
 * @private
 */
EditPanelGUIAdaptor.prototype._isDoubleLeftArrowEnabled = function()
{
	if (EditPanelGUIAdaptor.m_logger.isTrace()) EditPanelGUIAdaptor.m_logger.trace("_isDoubleLeftArrowEnabled()");

	var n = Services.countNodes(this.dataBinding + "/" + EditPanelGUIAdaptor.AVAILABLE_ROLES + "/role");

	return (n > 0);
}

/**
 * Move value(s) from one grid to another.
 *
 * @param from the name of the grid to move a value from
 * @param to the name of the grid to move a value to
 * @private
 */
EditPanelGUIAdaptor.prototype._moveGridValues = function(from, to)
{
	var dataBinding = this.dataBinding + "/" + from + "Selected" + "//*";
	var selectedNodes = Services.getNodes(dataBinding);

	Services.startTransaction();
			
	for (var i = 0, l = selectedNodes.length; i < l ; i++)
	{
		// Get the selected row's key
		var roleId = selectedNodes[i].text;

		// Get the value for the selected row
		dataBinding = this.dataBinding + "/" + from + "/role[./id=" + roleId + "]";
		var value = Services.getValue(dataBinding);

		if (value != null)
		{
			// Get selected role node
			var roleNode = Services.getNode(dataBinding);
			
			// To prevent duplicate IDs remove the id node from the role node
			var id = roleNode.selectSingleNode("id");
			roleNode.removeChild(id);

			// Remove selected row
			Services.removeNode(dataBinding);
		
			// Add selected role node to the 'to' grid
			Services.addNode(roleNode, this.dataBinding + "/" + to);
		}
	}

	Services.endTransaction();

	// Clear out the 'from' grid selection data binding		
	Services.replaceNode(this.dataBinding + "/" + from + "Selected", null);

	// Flag change to roles
	this._setModified(true);
}

/**
 * Move all rows in a grid.
 *
 * @param from the name of the grid to move all values from
 * @param to the name of the grid to move all values to
 * @private
 */
EditPanelGUIAdaptor.prototype._moveAllGridValues = function(from, to)
{
	// Get all the <id> nodes for the grid
	var nodes = Services.getNodes(this.dataBinding + "/" + from + "/*/id");

	for (var i = 0, l = nodes.length; i < l ; i++)
	{
		// Add key to grid selection data binding
		Services.setValue(this.dataBinding + "/" + from + "Selected/id[position()=" + (i + 1) + "]", nodes[i].text);
	}

	// All rows selected, now move them
	this._moveGridValues(from, to);
}

/**
 * Get the roles assigned to a user and court
 *
 * @param userId the user id to get the assigned roles for
 * @param courtCode the court code to get the assigned roles for
 * @param db the data binding where the assigned roles returned are stored in the DOM
 */
EditPanelGUIAdaptor.getRoles = function(userId, courtCode, db)
{
	var params = new ServiceParams();
	params.addSimpleParameter("userId", userId);
	params.addSimpleParameter("courtId", courtCode);

	var callback = new Object();
	callback.userId = userId;
	callback.dataBinding = db;
	callback.onSuccess = EditPanelGUIAdaptor.ongetRolesSuccess;
	callback.onError = EditPanelGUIAdaptor.ongetRolesError;

	Services.callService("getRoles", params, callback, true);	
}

/**
 * getRoles service call success callback handler.
 *
 * @param dom the DOM object returned from the server
 */
EditPanelGUIAdaptor.ongetRolesSuccess = function(dom)
{
	// Create assigned roles node
	var assignedNode = dom.createElement(EditPanelGUIAdaptor.ASSIGNED_ROLES);

	// Copy role nodes to assigned roles node
	var roleNodes = dom.selectNodes("/roles/role");

	for (var i = 0, l = roleNodes.length; i < l; i++)
	{
		var node = roleNodes[i].selectSingleNode(".");
		assignedNode.appendChild(node);
	}

	// Set the assigned roles in the grid
	Services.replaceNode(this.dataBinding + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES, assignedNode);

	// Create available roles node
	var availableNode = dom.createElement(EditPanelGUIAdaptor.AVAILABLE_ROLES);

	// Copy unassigned role nodes from all roles to available roles in grid
	var roleNodes = Services.getNodes(this.dataBinding + "/" + EditPanelGUIAdaptor.ALL_ROLES + "/role");

	for (var i = 0, l = roleNodes.length; i < l; i++)
	{
		// Get role node
		var node = roleNodes[i].selectSingleNode(".");
		
		// Attempt to match this role node text with an assigned role because we
		// don't want to make a role available if the user already has it assigned
		var value = Services.getValue(this.dataBinding + "/" +
						EditPanelGUIAdaptor.ASSIGNED_ROLES +
							"/role[text()=\"" + node.childNodes(0).text + "\"]");

		// Check if we matched an assigned node
		if (null == value)
		{
			// No match, so add this role node as an available role
			availableNode.appendChild(node);
		}
	}

	// Set the available roles in the grid
	Services.replaceNode(this.dataBinding + "/" + EditPanelGUIAdaptor.AVAILABLE_ROLES, availableNode);
}

/**
 * getRoles service call error callback handler.
 *
 * @param ex the exception object 
 */
EditPanelGUIAdaptor.ongetRolesError = function(ex)
{
	Services.showDialog(StandardDialogTypes.OK, function(b) {}, "Error getting assigned roles from server: " + ex.message, "Error");
}

/**
 * Update the roles assigned to a user and court
 *
 * @param userId the user id to update the assigned roles for
 * @param courtCode the court code to update the assigned roles for
 * @param db the data binding where the assigned roles are stored in the DOM
 */
EditPanelGUIAdaptor.updateRoles = function(userId, courtCode, db)
{
	// Get number of assigned roles to update
	var noOfRoles = Services.countNodes(db + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES + "/role");

	if (0 == noOfRoles)
	{
		throw new ConfigurationException("No assigned roles to update, check data binding");
	}

	// Create and populate a DOM with the assigned roles
	var dom = XML.createDOM(null, null, null);

	// Create <Roles> node
	var rolesNode = dom.createElement("roles");

	for (var i = 0; i < noOfRoles; i++)
	{
		// Create <role> node
		var roleNode = dom.createElement("role");

		// Get assigned role value
		var value = Services.getValue(db + "/" + EditPanelGUIAdaptor.ASSIGNED_ROLES +
						"/role[position()=" + (i + 1) + "]");

		// Add assigned role value to <role> node
		var roleText = dom.createTextNode(value);
		roleNode.appendChild(roleText);

		// Add <role> node to <roles> node
		rolesNode.appendChild(roleNode);
	}

	// Add Roles XML to DOM
	dom.appendChild(rolesNode);

	var params = new ServiceParams();
	params.addSimpleParameter("userId", userId);
	params.addSimpleParameter("courtId", courtCode);
	params.addDOMParameter("roles", dom);

	var callback = new Object();
	callback.dataBinding = db;
	callback.onSuccess = EditPanelGUIAdaptor.onupdateUserRolesSuccess;
	callback.onError = EditPanelGUIAdaptor.onupdateUserRolesError;

	Services.callService("updateUserRoles", params, callback, true);	
}

/**
 * updateUserRoles service call success callback handler.
 *
 * @param dom the DOM object returned from the server 
 */
EditPanelGUIAdaptor.onupdateUserRolesSuccess = function(dom)
{
	// Reset assigned roles changed flag
	Services.setValue(this.dataBinding + "/" + EditPanelGUIAdaptor.MODIFIED_FLAG, "false");
}

/**
 * updateUserRoles service call error callback handler.
 *
 * @param ex the exception object
 */
EditPanelGUIAdaptor.onupdateUserRolesError = function(ex)
{
	Services.showDialog(StandardDialogTypes.OK, function(b) {}, "Error saving assigned roles: " + ex.message, "Error");
}


