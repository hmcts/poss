//==================================================================
//
// LOVSubformGUIAdaptor.js
//
// Launches a LOV in a popup subform
//
//==================================================================


/**
 * Subform in a popup
 *
 * @constructor
 * @private
 */
function LOVSubformGUIAdaptor() {}

LOVSubformGUIAdaptor.m_logger = new Category("LOVSubformGUIAdaptor");

/**
 * LOVSubformGUIAdaptor is a sub class of PopupSubformGUIAdaptor
 */
LOVSubformGUIAdaptor.prototype = new PopupSubformGUIAdaptor();

/**
 * Add the required protocols to the LOVSubformGUIAdaptor
 */
GUIAdaptor._setUpProtocols('LOVSubformGUIAdaptor');
GUIAdaptor._addProtocol('LOVSubformGUIAdaptor', 'LOVProtocol');				 // This is an LOV


// Set constructor so instanceOf works properly
LOVSubformGUIAdaptor.prototype.constructor = LOVSubformGUIAdaptor;


LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT = "/ds/lovSubFormModel";
LOVSubformGUIAdaptor.LOV_SUBFORM_VIEW_URL = "/com/sups/client/gui/lov_subform/LOVSubform.html";
LOVSubformGUIAdaptor.LOV_FILTERS_DATABINDING_ROOT = DataModel.DEFAULT_FORM_BINDING_ROOT + "/tmp/filtering";

LOVSubformGUIAdaptor.SUBMIT_ENABLED = LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT + "/submit";
LOVSubformGUIAdaptor.CANCEL_ENABLED = LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT + "/cancel";


/**
 * Create a new LOVSubformGUIAdaptor
 *
 * @param e the div element which represents the popup subform on the parent form
 * @return the new LOVSubformGUIAdaptor
 * @type LOVSubformGUIAdaptor
 */
LOVSubformGUIAdaptor.create = function(e)
{
	if(LOVSubformGUIAdaptor.m_logger.isTrace()) LOVSubformGUIAdaptor.m_logger.trace("create()");
	var a = new LOVSubformGUIAdaptor();
	a._initialiseAdaptor(e);

	return a;
}


/**
 * Initialise the LOVSubformGUIAdaptor
 *
 * @param e the HTMLElement for the div element to be managed
 * @private
 */
LOVSubformGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
    // Call parent class initialisation
    PopupSubformGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
    
	// copy across normal LOV popup params passed to the LOVPopupRenderer.createInline()
	var r = this.m_renderer;
	this.m_label = r.m_label;
	this.m_headerColumns = r.m_columns;
	this.m_rows = r.m_rows;
	this.m_groupSize = r.m_groupSize;
	this.m_isFiltered = r.m_isFiltered;
	
	this.m_enableLifeCyclesTimeout = null;
}


/**
 * Perform any GUIAdaptor specific configuration
 *
 * @param cs an array of objects containing configuration properties
 */
LOVSubformGUIAdaptor.prototype._configure = function(cs)
{
	// ToDo:
	// 1) default the copying of data backwards from the normal LOV configuration
	// 2) pass across ref data configuration
	// 3) refactor to re-use existing subform popup adaptor rather than duplicating code
	
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
        if(c.subformName != null && this.subformName == null)
        {
            this.subformName = c.subformName;
        }
        
		if(c.refDataServices != null)
		{
			this.refDataServices = c.refDataServices;
		}
		
		if(c.styleURL != null)
		{
			// Transform the url for the CSS file as the relative path will be wrong
			// because we are loading the CSS file from the framework LOV subform page
			c.styleURL = this._convertURLForSubForm(c.styleURL);
		}
	}
	
	if (this.dataBinding != null)
	{
		// Setup replaceTargetNode configuration for subform. This will be interpretted by
		// the PopupSubformGUIAdaptor._configure() below.
		this.replaceTargetNode = [{sourceNodeIndex: "0", dataBinding: this.dataBinding}];	
	}
	else
	{
		throw new ConfigurationException("LOVSubformGUIAdaptor, no dataBinding specified for adaptor id = " + this.getId() + ", this is a mandatory configuration property!");
	}
	
	// If subform name is not explicitly declared, then use the same name as our
	// parent form. This means that we don't need to define each different type 
	// of subform in the application config file, however reference data services
	// for the subform need to be defined on the parent form.
	if(null == this.subformName)
	{
		var ac = Services.getAppController();
		this.subformName = ac.getCurrentForm().getName();
	}

	// Filtered grids use /ds/var/page/tmp/filtering as the root data binding for
	// column filter XPaths. This will not work with LOV subforms so setup default
	// column filter XPaths in /ds/var/form/tmp/filtering for filtered LOV subform
	if(this.m_isFiltered && this.columns != null)
	{
		var db = LOVSubformGUIAdaptor.LOV_FILTERS_DATABINDING_ROOT +
									"/" + this.getId() + "_grid_column_filter_col";
		
		for(var i = 0, l = this.columns.length; i < l; i++)
		{
			var col = this.columns[i];
			
			if(null == col.filterXPath)
			{
				// Only add default XPath if not already defined
				col.filterXPath = db + i;
			}
		}
	}

	// Call super class _configure
	PopupSubformGUIAdaptor.prototype._configure.call(this, cs);	
}


/*
 * D760 - IFrame height sizing moved to super class.
 * All subforms that aren't fullscreen will autosize if a height isn't specified.
 *
LOVSubformGUIAdaptor.prototype._formReadyHandler = function()
{
	// Get the actual HTMLIFrameElement
	var iframe = this.m_subformView.m_frame.getFrame();
	
	// Get the view's document
	var iframeDoc = this.m_subformView._getDocument();
	
	if(LOVSubformGUIAdaptor.m_logger.isDebug()) LOVSubformGUIAdaptor.m_logger.debug("height: " + iframeDoc.body.clientHeight);

	// auto resize iframe based on height of content
	iframe.style.height = iframeDoc.body.clientHeight + "px";
	
	// Invoke super class
	PopupSubformGUIAdaptor.prototype._formReadyHandler.call(this);
}
*/


/*
 * D1149 - Precompile not handling LOV subforms.
 * Override of the PopupSubformGUIAdaptor method to prevent precompilation data
 * being loaded.
 *
 * LOV subforms cannot be precompiled because:
 *
 * 1) Generally the subform name is the same as the parent form's name. This is so
 *    that each LOV subform doesn't have to be defined in the applicationconfig.xml.
 *    This means that if precompile is enabled for the parent form then the parent
 *    form's precompilation data is used for the LOV subform and we get an error.
 * 2) The precompilation utility loads a form by calling a Services.navigate. This
 *    doesn't work for LOV subforms because the URLs don't get transformed and the
 *    precompilation falls over with an access denied error.
 */
LOVSubformGUIAdaptor.prototype._viewLoaded = function()
{
    // Load the page specific stylesheet
    if(this.m_styleURL != null)
    {
        var headElement = GUIUtils.getDocumentHeadElement(this.m_subformView._getDocument());
        GUIUtils.createStyleLinkElement(headElement, this.m_styleURL, null);
    }

	// Initialise the form controller in the subform
	this._initialiseSubForm();
}


LOVSubformGUIAdaptor.prototype._initialiseSubForm = function()
{
	// Write the config for the LOV Subform to the new frame if
	// the subform is not already initialised
	if(!this.m_subformInitialised)
	{
		this._copyConfigToSubForm();
	}
	
	// Invoke superclass to initialise
	PopupSubformGUIAdaptor.prototype._initialiseSubForm.call(this);
	
	// Enable the submit and cancel lifecycles if subform is not destroyed when closed
	// otherwise one of them will be disabled
	if(!this.destroyOnClose)
	{
		var iframeWindow = this.m_subformView._getWindow();
		var thisObj = this;
		// Form Controller is initialised on a timeout, so this has to be also on a
		// timeout otherwise the Form Controller is null
		this.m_enableLifeCyclesTimeout = iframeWindow.setTimeout(function() { thisObj._enableLifeCycles(); }, 0);
	}
}


LOVSubformGUIAdaptor.prototype._getSubformURL = function()
{
	// Construct the url for the LOVSubform
    var ac = Services.getAppController();

	return subformURL =
		ac.getURLForFrameworkSubForm(LOVSubformGUIAdaptor.LOV_SUBFORM_VIEW_URL) +
		"?cols=" + this._convertColumnConfigToEvalString() +
		"&label=" + this.m_label +
		"&rows=" + this.m_rows +
		"&groupSize=" + this.m_groupSize +
		"&isFiltered=" + this.m_isFiltered;
}


LOVSubformGUIAdaptor.prototype._copyConfigToSubForm = function()
{
	var iframeWindow = this.m_subformView._getWindow();
	var thisObj = this;
	
	// construct the grid's dataBinding using the same node as the dataBinding of the LOV so when we
	// copy the node back the node matches, because we replace node rather than setValue
	var gridDataBinding = LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT + "/" + XPathUtils.getTrailingNode(this.dataBinding);
	
	// Copy across any ref data services
	var subFormConfig = {
	
		// create the cancel lifecycle config
		cancelLifeCycle: {
			eventBinding: {
				keys: [{key: Key.F4, element: "subform"}],
				enableOn: [LOVSubformGUIAdaptor.CANCEL_ENABLED],
				isEnabled: function() { return thisObj._isCancelLifeCycleEnabled(); }
			},
			raiseWarningIfDOMDirty: false
		},
		
		// create the submit lifecycle config	
		submitLifeCycle: {
			eventBinding: {
				doubleClicks: [{element: "frameworkLOVSubFormGrid"}],
				enableOn: [LOVSubformGUIAdaptor.SUBMIT_ENABLED],
				isEnabled:  function() { return thisObj._isSubmitLifeCycleEnabled(); }
			},
			returnSourceNodes: [gridDataBinding],
			postSubmitAction: {close:{}}
		},
		
		// create the modify lifecycle config, this copies the 'model' i.e. the selected row for the LOV into the subform
		// so that we can modify it and return it
		// ToDo: the srcXPath needs to copied from the config
		modifyLifeCycle: {
			dataBinding: LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT,
			srcXPath: this.dataBinding,
			initialise: {
				dataBinding: LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT,
				srcXPath: this.dataBinding,
				markAsDirty: true
			}
		},

		// Start in the modify state - not strictly necessary, but prefer to be explicit
		startupState: {
			mode: FormLifeCycleStates.FORM_MODIFY
		}
		
	};
	
	// Optional configuration, so check if it exists
	if (this.refDataServices != null)
	{
		var refDataServices = new Array(this.refDataServices.length);
		// transform the url for the any ref data loaded using xml files because the relative path 
		// will be wrong because we are executing the loading from the framework LOV subform page
		for(var i=0, l=this.refDataServices.length; i<l; i++)
		{
			refDataServices[i] = this.refDataServices[i];
			var fileName = refDataServices[i].fileName;
			if(fileName != null)
			{
				refDataServices[i].fileName = this._convertURLForSubForm(fileName);
			}
		}
		subFormConfig.refDataServices = refDataServices;
	}
	

	// Set the configuration
	iframeWindow["subform"] = subFormConfig;

	// Copy across grid config
	iframeWindow["frameworkLOVSubFormGrid"] = {
		dataBinding: gridDataBinding,
		srcData: this.srcData,
		srcDataOn: this.srcDataOn,
		rowXPath: this.rowXPath,
		keyXPath: this.keyXPath,
		columns: this.columns,
		multipleSelection: this.multipleSelection
	};
	
	// Copy across action bar submit (OK) button click handler
	iframeWindow["submit_button"] = {
		inactiveWhilstHandlingEvent: false,
		actionBinding: function() { thisObj._handleSubmit(); }
	}

	// Copy across action bar cancel button click handler
	iframeWindow["cancel_button"] = {
		inactiveWhilstHandlingEvent: false,
		actionBinding: function() { thisObj._handleCancel(); }
	}
}


/**
 * Enablement rule for the submit lifecycle
 */
LOVSubformGUIAdaptor.prototype._isSubmitLifeCycleEnabled = function()
{
	var fc = this.m_subformView.getFormController();
	var dm = fc.getDataModel();
	var v = dm.getValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED);
	
	return (v == null || v == "true") ? true : false;
}


/**
 * Enablement rule for the cancel lifecycle
 */
LOVSubformGUIAdaptor.prototype._isCancelLifeCycleEnabled = function()
{
	var fc = this.m_subformView.getFormController();
	var dm = fc.getDataModel();
	var v = dm.getValue(LOVSubformGUIAdaptor.CANCEL_ENABLED);
	
	return (v == null || v == "true") ? true : false;
}


/**
 * Handles a click on the submit (OK) button. Disables the cancel lifecycle to prevent
 * the user invoking the cancel lifecycle as well as the submit lifecycle.
*/
LOVSubformGUIAdaptor.prototype._handleSubmit = function()
{
	var fc = this.m_subformView.getFormController();
	var dm = fc.getDataModel();
	
	// Set disable cancel lifecycle flag
	dm.setValue(LOVSubformGUIAdaptor.CANCEL_ENABLED, "false");

	// Invoke the submit lifecycle on a timeout so that any submit processing
	// doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchSubmitEvent(); }, 0);	
}


LOVSubformGUIAdaptor.prototype._dispatchSubmitEvent = function()
{
	if(this.m_subformView != null)
	{
		var fc = this.m_subformView.getFormController();
		fc.dispatchBusinessLifeCycleEvent("subform", BusinessLifeCycleEvents.EVENT_SUBMIT);
	}
}


/**
 * Handles a click on the cancel button. Disables the submit lifecycle to prevent
 * the user invoking the submit lifecycle as well as the cancel lifecycle.
*/
LOVSubformGUIAdaptor.prototype._handleCancel = function()
{
	var fc = this.m_subformView.getFormController();
	var dm = fc.getDataModel();
	
	// Set disable submit lifecycle flag
	dm.setValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED, "false");

	// Invoke the cancel lifecycle on a timeout so that any cancel processing
	// doesn't prevent the disable event
	var thisObj = this;
    setTimeout(function() { thisObj._dispatchCancelEvent(); }, 0);	
}


LOVSubformGUIAdaptor.prototype._dispatchCancelEvent = function()
{
	if(this.m_subformView != null)
	{
		var fc = this.m_subformView.getFormController();
		fc.dispatchBusinessLifeCycleEvent("subform", BusinessLifeCycleEvents.EVENT_CANCEL);
	}
}


/**
 * Enables the submit (OK) and cancel lifecycles. One of these will have been
 * disabled when the other is invoked.
*/
LOVSubformGUIAdaptor.prototype._enableLifeCycles = function()
{
	var iframeWindow = this.m_subformView._getWindow();
	var fc = this.m_subformView.getFormController();

	if(this.m_enableLifeCyclesTimeout != null)
	{
		iframeWindow.clearTimeout(this.m_enableLifeCyclesTimeout);
		this.m_enableLifeCyclesTimeout = null;
	}
	
	if(fc != null)
	{
		// Enable the submit and cancel lifecycles
		var dm = fc.getDataModel();
		dm.setValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED, "true");
		dm.setValue(LOVSubformGUIAdaptor.CANCEL_ENABLED, "true");
	}
	else
	{
		// Form Controller not yet initialised, keep trying until it is
		var thisObj = this;
		this.m_enableLifeCyclesTimeout = iframeWindow.setTimeout(function() { thisObj._enableLifeCycles(); }, 0);
	}
}


LOVSubformGUIAdaptor.prototype._getColumnHeaderTitle = function(column, columnNumber)
{
	if(column && column != "")
	{
	    if(column.indexOf( "&nbsp;") == -1)
	    {
	        return column;
	    }
	    else
	    {
	        // Defect 768. Filter out any explicit non-breaking space characters
	        // as these will confuse parsing of query parameters
		    return column.replace( /&nbsp;/g, " " );
		}
	}
	else
	{
		return "col" + columnNumber;
	}
}


LOVSubformGUIAdaptor.prototype._convertColumnConfigToEvalString = function()
{
	var evalString = "new Array(";
	for (var i=0, l=this.m_headerColumns.length; i<l; i++)
	{
		evalString += "\"" + this._getColumnHeaderTitle(this.m_headerColumns[i], i) + "\"";
		if(i+1 < l)
		{
			evalString += ", ";
		}
	}
	evalString += ")";
	return evalString;
}


/**
 * Converts a file URL into the full application and file name URL
 *
 * @param  a string containing the file URL
 * @return a string containing the full application and file name URL
*/
LOVSubformGUIAdaptor.prototype._convertURLForSubForm = function(fileURL)
{
	var ac = Services.getAppController();
		
	if(this.m_formURL == null)
	{
		var formURL = ac.getURLForForm(ac.getCurrentForm().getName());
		// The form URL contains the HTML filename which we need to remove
		this.m_formURL = formURL.substring(0, formURL.lastIndexOf('/'));
	}

	// If file URL is not a full path. (_copyConfigToSubForm is called each
	// time the LOV is opened if destroying the sub form when it is closed.
	// So, it is possible form URL may already have been added to file URL.)
	if(fileURL.indexOf(this.m_formURL) == -1)
	{
		// If the URL only has one / at the start then it is an absolute
		// path to a file in the page's folder
		if(fileURL.indexOf('/') == 0)
		{
			fileURL = this.m_formURL + fileURL;
		}
		// If the URL starts with ./ then it is a relative path to a file
		// in the page's folder or sub folder of the page
		else if(fileURL.indexOf('./') == 0)
		{
			fileURL = this.m_formURL + fileURL.substring(1, fileURL.length);
		}
		// URL is a relative path to a folder above form's folder
		else if(fileURL.indexOf('../') == 0)
		{
			// Split the form URL into folder names
			var formURLFolders = this.m_formURL.split('/');

			// Count the number of ../ in the file URL
			var re = /(\.\.\/)/gm;
			var fileURLMatches = fileURL.match(re);

			// Calculate how many folders to use from form URL (Subtract one
			// because first element is empty as form URL starts with /)
			var count = formURLFolders.length - fileURLMatches.length - 1;
			
			if(count > 1)
			{
				// File URL has less ../ than folders in form URL so construct
				// base URL by getting the required number of folders from the
				// form URL
				baseURL = '/';
				
				for(var i = 1; i <= count; i++)
				{
					baseURL += (formURLFolders[i] + "/");
				}
			}
			else
			{
				// File URL has more ../ than folders in form URL so base URL
				// is application name
				baseURL = ac.m_config.getAppBaseURL() + '/';
			}

			// Construct full application and file name URL
			var index = fileURL.lastIndexOf('../');
			fileURL = baseURL + fileURL.slice(index + 3);
		}
		// URL is just the file name or an absolute sub folder path
		else
		{
			fileURL = this.m_formURL + '/' + fileURL;
		}
	}

	return fileURL;
}

/**
 * Dispose of adaptor
 *
*/
LOVSubformGUIAdaptor.prototype._dispose = function()
{
    // Clear reference to renderer
    this.m_renderer = null;
    
    // Call superclass dispose
    PopupSubformGUIAdaptor.prototype._dispose.call(this);
}

/**
 * Override PopupSubformGUIAdaptor method _destroySubForm
 * such that properties copied onto the popup iframe
 * window may be removed. The removal of these properties
 * prevents memory leaks.
 *
*/
LOVSubformGUIAdaptor.prototype._destroySubForm = function()
{
    // Remove subform configuration properties
    // copied to window
    this._removeConfigFromSubForm();
    
    // Invoke _destroySubForm method on superclass
    PopupSubformGUIAdaptor.prototype._destroySubForm.call(this);
}

/**
 * Remove configuration properties copied onto subform
 * iframe.
 *
*/
LOVSubformGUIAdaptor.prototype._removeConfigFromSubForm = function()
{
     // Note, when used with property destroyOnClose set to "true"
     // _destroySubForm is invoked when the popup is closed and
     // when the adaptor is disposed. On the second invocation 
     // the view manager will be null.
      
     if(null != this.m_subformView)
     {
         var iframeWindow = this.m_subformView._getWindow();
        
         var subformConfig = iframeWindow["subform"];
     
         if(null != subformConfig)
         {
             for(var i in subformConfig)
             {
                 subformConfig[i] = null;
             }
             
             subformConfig = null;
             iframeWindow["subform"] = null;
         }
         
         var gridConfig = iframeWindow["frameworkLOVSubFormGrid"];
         
         if(null != gridConfig)
         {
             for(var j in gridConfig)
             {
                 gridConfig[j] = null;
             }
             
             gridConfig = null;
             iframeWindow["frameworkLOVSubFormGrid"] = null;
         }

		 var submitConfig = iframeWindow["submit_button"];

         if(null != submitConfig)
         {
             for(var j in submitConfig)
             {
                 submitConfig[j] = null;
             }
             
             submitConfig = null;
             iframeWindow["submit_button"] = null;
         }

		 var cancelConfig = iframeWindow["cancel_button"];

         if(null != cancelConfig)
         {
             for(var j in cancelConfig)
             {
                 cancelConfig[j] = null;
             }
             
             cancelConfig = null;
             iframeWindow["cancel_button"] = null;
         }
		 
         iframeWindow = null;
     }
}
    
