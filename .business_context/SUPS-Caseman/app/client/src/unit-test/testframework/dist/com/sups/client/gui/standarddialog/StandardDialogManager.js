//==================================================================
//
// StandardDialogManager.js
//
// Implements Standard Prompt Dialogs that display a message and
// allow the user to select between available options by clicking
// on one of the buttons on the Popup's ActionBar.
//
//==================================================================


function StandardDialogManager()
{
}


StandardDialogManager.m_instances = new Array();

StandardDialogManager.m_allocatedCount = 0;

StandardDialogManager.DIALOG_ID_PREFIX = "fw_standard_dialog_";

StandardDialogManager._getInstance = function()
{
	// Create new instances if all existing instances are allocated.
	if(StandardDialogManager.m_instances.length <= StandardDialogManager.m_allocatedCount)
	{
		StandardDialogManager.m_instances[StandardDialogManager.m_instances.length] = StandardDialogManager._createInstance()
	}
	
	// Get the first available StandardDialogManager
	var d = StandardDialogManager.m_instances[StandardDialogManager.m_allocatedCount++];
	
	return d;
}


StandardDialogManager._createInstance = function()
{
	var fc = FormController.getInstance();

	var form = fc.getFormAdaptor();
	
	var formElement = form.getElement();

	// Create HTML View 
	var d = StandardDialogRenderer.createAsChild(formElement, StandardDialogManager.DIALOG_ID_PREFIX + StandardDialogManager.m_instances.length);
	
	var view = fc.getFormView();
	var cm = view.getConfigManager();
	
	var buttons = d.getButtons();
	// Create configuration for popup and buttons
	for(var i = 0, l = buttons.length; i < l; i++)
	{
		// Do this in its own method so that we get a closure for each button
		StandardDialogManager._createActionBinding(cm, d, buttons[i]);
	}
	
	// Call GUIAdaptorFactory to produce set of adaptors for the popup
	var factory = view.getGUIAdaptorFactory();
	var popupAdaptors = factory.parseElement(d.getElement(), form)
	
	// Add adaptors to FormController
	fc.addAdaptors(popupAdaptors);
	
	return d;
}


StandardDialogManager._createActionBinding = function(cm, sd, b)
{
	cm.setConfig(b.id, { actionBinding: function() { StandardDialogManager._handleButtonClick(sd, b); } });
}


StandardDialogManager.showDialog = function(type, callback, message, title, width, top, left)
{
	// Get an instance of a StandardDialog - they are reused for the life time of a form
	var sd = StandardDialogManager._getInstance();

	// Do we need to provide a default title based on dialog type?
	
	// If the input argument "title" is null use name of project
	if(null == title)
	{
	    title = StandardDialogManager._getProjectName();
	}
	sd.setTitle(title);
	
	// Set message.
	sd.setMessage(message);
	
	// Set type
	sd.setType(type);

	// Delete the callback here rather than in _handleButtonClick because
	// with standard dialogs called in sequence:
	// 1) A button is clicked on a standard dialog
	// 2) The callback function is called
	// 3) The callback function shows another standard dialog, setting up a
	//    callback in the process
	// 4) _handleButtonClick() for the button clicked in 1) is called
	//    This would delete the callback function we have just setup in 3)
	// 5) Clicking a button on the dialog shown in 3) would result in a callback
	//    is null error
	delete sd.callback;

	// Hack!
	sd.callback = callback;

	sd.setWidth(width);

	// Position the popup in the iframe
	sd.positionPopup(top, left);

	// Show the popup	
	Services.dispatchEvent(sd.getElement().id, PopupGUIAdaptor.EVENT_RAISE);
}


StandardDialogManager._handleButtonClick = function(sd, button)
{
	// Free up the dialog for re-use
	StandardDialogManager.m_allocatedCount--;

	// Hide the popup
	Services.dispatchEvent(sd.getElement().id, PopupGUIAdaptor.EVENT_LOWER);

	// Get the button which was clicked.
	var buttonClicked = sd.getButtonClicked(button);
	
	// Call the callback
	sd.callback.call(null, buttonClicked);

	//delete sd.callback;
}

/**
 * Method returns name of project as defined in the application
 * configuration XML file. If no project name is defined an empty
 * string will be returned.
 *
*/
StandardDialogManager._getProjectName = function()
{
    var ac = Services.getAppController();
    
    return ac.getProjectName();
}
