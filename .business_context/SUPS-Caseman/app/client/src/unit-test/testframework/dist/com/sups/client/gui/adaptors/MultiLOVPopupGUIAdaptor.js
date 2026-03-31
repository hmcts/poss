/**
 * Class defines adaptor for List of Values (LOV) Popup
 * which comprises a grid plus two action buttons.
 *
 * Basically is just a PopupGUIAdaptor with extra configuration
 * items.
*/


/**
 * Constructor method
 *
*/
function MultiLOVPopupGUIAdaptor() {};

/**
 * MultiLOVPopupGUIAdaptor is a sub-class of PopupGUIAdaptor
 *
*/
MultiLOVPopupGUIAdaptor.prototype = new PopupGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("MultiLOVPopupGUIAdaptor");
GUIAdaptor._addProtocol('MultiLOVPopupGUIAdaptor', 'LOVProtocol');				 // This is an LOV


// Set constructor so instanceOf works properly
MultiLOVPopupGUIAdaptor.prototype.constructor = MultiLOVPopupGUIAdaptor;

/**
 * Business Life Cycle Event to accept the selection in the LOV
 *
 * @type String
 */
MultiLOVPopupGUIAdaptor.EVENT_OK = 'ok';


/**
 * Business Life Cycle Event to cancel the selection in the LOV
 *
 * @type String
 */
MultiLOVPopupGUIAdaptor.EVENT_CANCEL = 'cancel';


/**
 * Data bindings
 *
 * @type String
 */
MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING = '/ds/var/popup_temporary';
MultiLOVPopupGUIAdaptor.OK_ENABLED = MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING + '/ok';
MultiLOVPopupGUIAdaptor.CANCEL_ENABLED = MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING + '/cancel';


/**
 * Static method to create an instance of a MultiLOVPopupGUIAdaptor
 *
 * @param e The component HTML element being represented by the adaptor
 * @param factory A reference to the GUIAdaptorFactory instance used to parse the HTML element
 *
*/
MultiLOVPopupGUIAdaptor.create = function(e, factory)
{
	var a = new MultiLOVPopupGUIAdaptor();
	a._initialiseAdaptor( e );
	
	factory.parseChildren(e);

	return a; 
}


/**
 * Initialise the MultiLOVPopupGUIAdaptor
 *
 * @param e the HTMLElement for the div element to be managed
 * @private
 */
MultiLOVPopupGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
    // Call parent class initialisation
    PopupGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
    
	this.m_isFiltered = this.m_renderer.m_isFiltered;
}


/**
 *  Clean up after the component
 *
 * @private
 */
MultiLOVPopupGUIAdaptor.prototype._dispose = function()
{
	// Remove the lov's configuration
	var cm = FormController.getInstance().getFormView().getConfigManager();
	var lovId = this.getId();

	cm.removeConfig(lovId);
	cm.removeConfig(lovId + "_grid");
	cm.removeConfig(lovId + "_okButton");
	cm.removeConfig(lovId + "_cancelButton");

    // Invoke parent class' dispose method
    PopupGUIAdaptor.prototype._dispose.call(this);
}


/**
 * Method configures the grid and button components within the LOV Popup.
 * Some configuration details are taken from the associated Javascript
 * configuration file, but others are assigned dynamically.
 * 
 * @param cs Array of configuration parameters passed in from form's configuration file
 *
 */
MultiLOVPopupGUIAdaptor.prototype._configure = function(cs)
{
	// Invoke parent class' _configure method.
	PopupGUIAdaptor.prototype._configure.call(this, cs);	

    // Run through configuration data searching for
    // grid configuration data
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		// Temporary data binding used for grid selection
		if(c.tmpDataBinding && this.tmpDataBinding == null)
		{
		    this.tmpDataBinding = c.tmpDataBinding;
		}

		// Business service actions configuration
		if(c.ok && this.ok == null)
		{
		    this.ok = c.ok;
		}
		
		if(c.cancel && this.cancel == null)
		{
		    this.cancel = c.cancel;
		}
	}
	
	var lovId = this.getId();
	
	// Generate a temporary databinding if one has not been defined
	if(this.tmpDataBinding == null)
	{
		this.tmpDataBinding = MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING + '/' + lovId;
	}
	
	// Map grid configuration onto grid property in main window
	// (i.e. make it accessible to grid component)
	var gridId = lovId + "_grid";
	
	// Create function object and define as property on main window
	window[ gridId ] = {
		srcData: this.srcData,
		srcDataOn: this.srcDataOn,
		dataBinding: this.tmpDataBinding,
		rowXPath: this.rowXPath,
		columns: this.columns,
		keyXPath: this.keyXPath,
		multipleSelection: true
	};

/*	
	var grid_ctor = function(){};
	window[ gridId ] = grid_ctor;
	
	// Map adaptor properties onto grid property
	if( null != this.srcData )
	{
	    grid_ctor.srcData = this.srcData;
	    // Defect 236. RetrieveOn no longer required
	    //grid_ctor.retrieveOn = this.retrieveOn;
	}
	
	if(null != this.srcDataOn)
	{
	    grid_ctor.srcDataOn = this.srcDataOn;
	}
	
	// Map grid selected item to temporary data binding
	if( null != this.tmpDataBinding ) 
	{
	    grid_ctor.dataBinding = this.tmpDataBinding;
	}
	
	if( null != this.rowXPath )
	{
	    grid_ctor.rowXPath = this.rowXPath;
	}
	
	if( null != this.columns )
	{
	    grid_ctor.columns = this.columns;
	}
	
	if( null != this.keyXPath )
	{
	    grid_ctor.keyXPath = this.keyXPath;
	}
*/
	// Dynamically configure LOVPopup's OK button
	var okButtonId = lovId + "_okButton";
	window[ okButtonId ] =
	{
		inactiveWhilstHandlingEvent: false
	};
	
	// Dynamically configure LOVPopup's Cancel button
	var cancelButtonId = lovId + "_cancelButton";
	window[ cancelButtonId ] =
	{
		inactiveWhilstHandlingEvent: false
	};
		
	// Additional section adding business services configuration
	if(this.m_isFiltered == true)
	{
		gridId += "_filtered_grid";
	}
	
	// Create OK Business LifeCycle
	var okBusinessLifeCycle = new MultiLOVPopupOKBusinessLifeCycle();
	okBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(okBusinessLifeCycle);
	
	var thisObj = this;
	
	// Configure ok service bindings
	okBusinessLifeCycle.configure(
		{
			eventBinding:
			{
				singleClicks: [{element: okButtonId}],
				enableOn: [MultiLOVPopupGUIAdaptor.OK_ENABLED + "/" + lovId],
				isEnabled:  function() { return thisObj._isOkLifeCycleEnabled(); }
			}
		}
	);

	
	// Create Cancel Business LifeCycle
	var cancelBusinessLifeCycle = new MultiLOVPopupCancelBusinessLifeCycle();
	cancelBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(cancelBusinessLifeCycle);
	
	// Configure cancel service bindings
	cancelBusinessLifeCycle.configure(
		{
			eventBinding:
			{
				singleClicks: [{element: cancelButtonId}],
				keys: [{key: Key.F4, element: lovId}],
				enableOn: [MultiLOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + lovId],
				isEnabled: function() { return thisObj._isCancelLifeCycleEnabled(); }
			}
		}
	);
	
	// Start ok and cancel event bindings
	var okEventBinding = okBusinessLifeCycle.getEventBinding();
	var cancelEventBinding = cancelBusinessLifeCycle.getEventBinding();

	if(null != okEventBinding) okEventBinding.start();
	if(null != cancelEventBinding) cancelEventBinding.start();
}


MultiLOVPopupGUIAdaptor.prototype._onOk = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();

	// Set disable cancel business lifecycle flag
	dm.setValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId(), 'false');

	// Copy the grid selection(s) back to the adaptor's data binding
	var db = this.dataBinding;
	var tmpDb = this.tmpDataBinding;
	var value = dm.getNode(tmpDb);
	dm.replaceNode(db, value);

	// Dispatch the popup lower event on a timeout so that any submit
	// processing doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchLowerEvent(); }, 0);
}


MultiLOVPopupGUIAdaptor.prototype._onCancel = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	
	// Set disable OK business lifecycle flag
	dm.setValue(MultiLOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId(), 'false');

	// Dispatch the popup lower event on a timeout so that any cancel
	// processing doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchLowerEvent(); }, 0);
}


MultiLOVPopupGUIAdaptor.prototype._dispatchLowerEvent = function()
{
	var fc = FormController.getInstance();
	fc.dispatchBusinessLifeCycleEvent(this.getId(), PopupGUIAdaptor.EVENT_LOWER);	
}


/**
 * Enablement rule for the OK business lifecycle
 */
MultiLOVPopupGUIAdaptor.prototype._isOkLifeCycleEnabled = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	var v = dm.getValue(MultiLOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId());
	
	return (v == null || v == 'true') ? true : false;
}


/**
 * Enablement rule for the cancel business lifecycle
 */
MultiLOVPopupGUIAdaptor.prototype._isCancelLifeCycleEnabled = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	var v = dm.getValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId());
	
	return (v == null || v == 'true') ? true : false;
}


/**
 * Override of PopupGUIAdaptor method. Purpose is to enable the OK and cancel
 * business lifecycles.  One of these will have been disabled when the other
 * other is invoked.
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
MultiLOVPopupGUIAdaptor.prototype._show = function(showMe, currentFocussedAdaptorId)
{
	if(showMe)
	{
		var fc = FormController.getInstance();
		var dm = fc.getDataModel();
		
		// Enable OK and cancel business lifecycles
		dm.setValue(MultiLOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId(), 'true');
		dm.setValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId(), 'true');
	}
	
	// Invoke parent _show()
	PopupGUIAdaptor.prototype._show.call(this, showMe, currentFocussedAdaptorId);
}




/**
 * BusinessLifeCycle to perform a LOV's "OK" action.
 */
function MultiLOVPopupOKBusinessLifeCycle() {}

// MultiLOVPopupOKBusinessLifeCycle is a sub class of BusinessLifeCycle
MultiLOVPopupOKBusinessLifeCycle.prototype = new BusinessLifeCycle();
MultiLOVPopupOKBusinessLifeCycle.prototype.constructor = MultiLOVPopupOKBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
MultiLOVPopupOKBusinessLifeCycle.prototype.getName = function()
{
	return MultiLOVPopupGUIAdaptor.EVENT_OK;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be hidden
 *
 * @param e the BusinessLifeCycleEvent
 */
MultiLOVPopupOKBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	this.m_adaptor._onOk();
}




/**
 * BusinessLifeCycle to perform a LOV's "Cancel" action.
 */
function MultiLOVPopupCancelBusinessLifeCycle() {}

// MultiLOVPopupCancelBusinessLifeCycle is a sub class of BusinessLifeCycle
MultiLOVPopupCancelBusinessLifeCycle.prototype = new BusinessLifeCycle();
MultiLOVPopupCancelBusinessLifeCycle.prototype.constructor = MultiLOVPopupCancelBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
MultiLOVPopupCancelBusinessLifeCycle.prototype.getName = function()
{
	return MultiLOVPopupGUIAdaptor.EVENT_CANCEL;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be hidden
 *
 * @param e the BusinessLifeCycleEvent
 */
MultiLOVPopupCancelBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	this.m_adaptor._onCancel();
}
