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
function LOVPopupGUIAdaptor() {};

/**
 * LOVPopupGUIAdaptor is a sub-class of PopupGUIAdaptor
 *
*/
LOVPopupGUIAdaptor.prototype = new PopupGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("LOVPopupGUIAdaptor");
GUIAdaptor._addProtocol('LOVPopupGUIAdaptor', 'LOVProtocol');				 // This is an LOV


// Set constructor so instanceOf works properly
LOVPopupGUIAdaptor.prototype.constructor = LOVPopupGUIAdaptor;



LOVPopupGUIAdaptor.m_logger = new Category("LOVPopupGUIAdaptor");


/**
 * Business Life Cycle Event to accept the selection in the LOV
 *
 * @type String
 */
LOVPopupGUIAdaptor.EVENT_OK = 'ok';


/**
 * Business Life Cycle Event to cancel the selection in the LOV
 *
 * @type String
 */
LOVPopupGUIAdaptor.EVENT_CANCEL = 'cancel';


/**
 * Data bindings
 *
 * @type String
 */
LOVPopupGUIAdaptor.TMP_DATA_BINDING = '/ds/var/popup_temporary';
LOVPopupGUIAdaptor.OK_ENABLED = LOVPopupGUIAdaptor.TMP_DATA_BINDING + '/ok';
LOVPopupGUIAdaptor.CANCEL_ENABLED = LOVPopupGUIAdaptor.TMP_DATA_BINDING + '/cancel';


/**
 * Static method to create an instance of a LOVPopupGUIAdaptor
 *
 * @param e The component HTML element being represented by the adaptor
 * @param factory A reference to the GUIAdaptorFactory instance used to parse the HTML element
 *
*/
LOVPopupGUIAdaptor.create = function(e)
{
	var a = new LOVPopupGUIAdaptor();
	a._initialiseAdaptor( e );

	return a; 
}


/**
 * Initialise the LOVPopupGUIAdaptor
 *
 * @param e the HTMLElement for the div element to be managed
 * @private
 */
LOVPopupGUIAdaptor.prototype._initialiseAdaptor = function(e)
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
LOVPopupGUIAdaptor.prototype._dispose = function()
{
	// Remove the lov's grid and buttons configuration
	var cm = FormController.getInstance().getFormView().getConfigManager();
	var lovId = this.getId();

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
LOVPopupGUIAdaptor.prototype._configure = function(cs)
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
		this.tmpDataBinding = LOVPopupGUIAdaptor.TMP_DATA_BINDING + '/' + lovId;
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
		keyXPath: this.keyXPath
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
		
	// Dynamically configue LOVPopup's Cancel button
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
	var okBusinessLifeCycle = new LOVPopupOKBusinessLifeCycle();
	okBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(okBusinessLifeCycle);
	
	var thisObj = this;
		
	// Configure ok service bindings
	okBusinessLifeCycle.configure(
		{
			eventBinding:
			{
				singleClicks: [{element: okButtonId}],
				doubleClicks: [{element: gridId}],
				enableOn: [LOVPopupGUIAdaptor.OK_ENABLED + "/" + lovId],
				isEnabled:  function() { return thisObj._isOkLifeCycleEnabled(); }
			}
		}
	);

	
	// Create Cancel Business LifeCycle
	var cancelBusinessLifeCycle = new LOVPopupCancelBusinessLifeCycle();
	cancelBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(cancelBusinessLifeCycle);
	
	// Configure cancel service bindings
	cancelBusinessLifeCycle.configure(
		{
			eventBinding:
			{
				singleClicks: [{element: cancelButtonId}],
				keys: [{key: Key.F4, element: lovId}],
				enableOn: [LOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + lovId],
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


LOVPopupGUIAdaptor.prototype._onOk = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();

	// Set disable cancel business lifecycle flag
	dm.setValue(LOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId(), 'false');
	
	// Copy the grid selection back to the adaptor's data binding
	var db = this.dataBinding;
	var tmpDb = this.tmpDataBinding;
	var value = dm.getValue(tmpDb);
	dm.setValue(db, value);

	// Dispatch the popup lower event on a timeout so that any submit
	// processing doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchLowerEvent(); }, 0);
}


LOVPopupGUIAdaptor.prototype._onCancel = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	
	// Set disable OK business lifecycle flag
	dm.setValue(LOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId(), 'false');

	// Dispatch the popup lower event on a timeout so that any cancel
	// processing doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchLowerEvent(); }, 0);
}


LOVPopupGUIAdaptor.prototype._dispatchLowerEvent = function()
{
	var fc = FormController.getInstance();
	fc.dispatchBusinessLifeCycleEvent(this.getId(), PopupGUIAdaptor.EVENT_LOWER);	
}


/**
 * Enablement rule for the OK business lifecycle
 */
LOVPopupGUIAdaptor.prototype._isOkLifeCycleEnabled = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	var v = dm.getValue(LOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId());
	
	return (v == null || v == 'true') ? true : false;
}


/**
 * Enablement rule for the cancel business lifecycle
 */
LOVPopupGUIAdaptor.prototype._isCancelLifeCycleEnabled = function()
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	var v = dm.getValue(LOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId());
	
	return (v == null || v == 'true') ? true : false;
}


/**
 * Override of PopupGUIAdaptor method. Purpose is to enable the OK and cancel
 * business lifecycles.  One of these will have been disabled when the other
 * is invoked.
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
LOVPopupGUIAdaptor.prototype._show = function(showMe, currentFocussedAdaptorId)
{
	if(showMe)
	{
		var fc = FormController.getInstance();
		var dm = fc.getDataModel();
		
		// Enable the OK and cancel business lifecycles
		dm.setValue(LOVPopupGUIAdaptor.OK_ENABLED + "/" + this.getId(), 'true');
		dm.setValue(LOVPopupGUIAdaptor.CANCEL_ENABLED + "/" + this.getId(), 'true');
	}
	
	// Invoke parent _show()
	PopupGUIAdaptor.prototype._show.call(this, showMe, currentFocussedAdaptorId);
}




/**
 * BusinessLifeCycle to perform a LOV's "OK" action.
 */
function LOVPopupOKBusinessLifeCycle() {}

// LOVPopupOKBusinessLifeCycle is a sub class of BusinessLifeCycle
LOVPopupOKBusinessLifeCycle.prototype = new BusinessLifeCycle();
LOVPopupOKBusinessLifeCycle.prototype.constructor = LOVPopupOKBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
LOVPopupOKBusinessLifeCycle.prototype.getName = function()
{
	return LOVPopupGUIAdaptor.EVENT_OK;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be hidden
 *
 * @param e the BusinessLifeCycleEvent
 */
LOVPopupOKBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	this.m_adaptor._onOk();
}




/**
 * BusinessLifeCycle to perform a LOV's "Cancel" action.
 */
function LOVPopupCancelBusinessLifeCycle() {}

// LOVPopupCancelBusinessLifeCycle is a sub class of BusinessLifeCycle
LOVPopupCancelBusinessLifeCycle.prototype = new BusinessLifeCycle();
LOVPopupCancelBusinessLifeCycle.prototype.constructor = LOVPopupCancelBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
LOVPopupCancelBusinessLifeCycle.prototype.getName = function()
{
	return LOVPopupGUIAdaptor.EVENT_CANCEL;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be hidden
 *
 * @param e the BusinessLifeCycleEvent
 */
LOVPopupCancelBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	this.m_adaptor._onCancel();
}
