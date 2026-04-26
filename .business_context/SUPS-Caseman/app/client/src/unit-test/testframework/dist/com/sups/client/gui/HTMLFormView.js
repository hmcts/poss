//==================================================================
//
// HTMLFormView.js
//
// FormView for HTML Form Views.
//
//==================================================================


/**
 * HTMLFormView Constructor
 *
 * @constructor
 */
function HTMLFormView()
{
}

HTMLFormView.m_logger = new Category("HTMLFormView");


/**
 * HTMLFormView is a sub class of FormView
 */
HTMLFormView.prototype = new FormView();
HTMLFormView.prototype.constructor = HTMLFormView;


/**
 * Factory method to create HTMLFormViews
 */
HTMLFormView.create = function()
{
	var fv = new HTMLFormView();
	
	fv._initialise();
	
	return fv;
}


HTMLFormView.prototype._initialise = function()
{
	// Prevent context menus and default keybindings
	HTMLView.blockEventsForDocument(document);

	this.m_guiAdaptorFactory = new GUIAdaptorFactory();
	this.m_configManager = new ConfigManager();
	
}


HTMLFormView.prototype.dispose = function()
{
	// Remove blocking event handlers
	HTMLView.unblockEventsForDocument(document);
	
	// Invoke dispose on GUIAdaptorFactory instance
	this.m_guiAdaptorFactory.dispose();

	// Invoke our super class dispose method
	FormView.prototype.dispose.call(this);

	// Detect memory leaks if we are in debug build
	/*
	HTMLView.checkForEventHandlers();
	*/
}
