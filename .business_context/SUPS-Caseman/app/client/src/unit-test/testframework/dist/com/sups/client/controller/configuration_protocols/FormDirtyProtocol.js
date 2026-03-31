//==================================================================
//
// FormDirtyProtocol.js
//
// Protocol implemented on Forms which allows them to detect when
// they are dirty.
//
//==================================================================


/*
 * FormDirtyProtocol constructor
 *
 * @constructor
 */
function FormDirtyProtocol()
{
}

FormDirtyProtocol.m_logger = new Category("FormDirtyProtocol");


FormDirtyProtocol.DEFAULT_MODEL_XPATH = DataModel.DEFAULT_ROOT;


/**
 * Property to keep track of the dirty state of the form
 *
 * @type boolean
 * @private
 */
FormDirtyProtocol.prototype.m_dirty = false;


/**
 * Flag to indicate whether or not the protocol is currently
 * accepting dirty events or not
 *
 * @type boolean
 * @private
 */
FormDirtyProtocol.prototype.m_suspend = false;


/**
 * Initialisation method for FormDirty protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 * @private
 */
FormDirtyProtocol.prototype.configFormDirtyProtocol = function(cs)
{
}


/**
 * Dispose of the FormDirty Protocol
 *
 * @private
 */
FormDirtyProtocol.prototype.disposeFormDirtyProtocol = function()
{
}


/**
 * Get the XPath of the node that contains the model
 *
 * @return a string containing the XPath of the node that contains the model
 * @type String
 */
FormDirtyProtocol.prototype.getModelXPath = function()
{
	fc_assertAlways("FormDirtyProtocol.getModelXPath(): must be overridden in implmeneting adaptor");
}


FormDirtyProtocol.prototype.formDirtyUpdate = function(e)
{
	if (this._getState() != FormElementGUIAdaptor.FORM_BLANK)
	{
		// If we are using the default databinding of /ds then we need to ignore updates to /ds/var
		if (!((this.getModelXPath() == FormDirtyProtocol.DEFAULT_MODEL_XPATH && (e.getXPath().indexOf(DataModel.VARIABLES_ROOT) == 0)) || e.getXPath() == "/"))
		{
			if(FormDirtyProtocol.m_logger.isDebug()) FormDirtyProtocol.m_logger.debug("set form to dirty - change to xpath: " + e.getXPath());
	
			// Set this form to dirty
			this._setDirty(true);
	
			// Update the data model
			this.update();
		}
		else
		{
			if(FormDirtyProtocol.m_logger.isDebug()) FormDirtyProtocol.m_logger.debug("Not setting form dirty because xpath is outside Form Model Xpath. Change to xpath: " + e.getXPath());
		}
	}
	else
	{
		if(FormDirtyProtocol.m_logger.isDebug()) FormDirtyProtocol.m_logger.debug("Not setting form dirty because form is in blank state. Change to xpath: " + e.getXPath());
	}
}


/**
 *  Returns all of the listeners for this adaptor for this protocol 
 */
FormDirtyProtocol.prototype.getListenersForFormDirtyProtocol = function()
{
    var listenerArray = new Array();
    var listener = FormControllerListener.create(this, FormController.FORMDIRTY);
    
    listenerArray.push({xpath: this.getModelXPath() + "//*", listener: listener});
    
    return listenerArray;
}


/**
 * Should dirty events from the DataModel be ignored?
 *
 * @return true if dirty events should be ignore or false otherwise
 */
FormDirtyProtocol.prototype.dirtyEventsSuspended = function()
{
	return this.m_suspend;
}


/**
 * Suspend or re-instate dirty event propogation from the DataModel
 * 
 * @param suspend true to suspend dirty event propogation or false to
 *   allow dirty event propogation.
 */
FormDirtyProtocol.prototype.suspendDirtyEvents = function(suspend)
{
	this.m_suspend = suspend;
}
