/**
 * FrameworkOverrides.js
 *
 * This file contains framework updates that postdate framework release 9.0.33.
 *
 * Individual SUPS projects may apply these overrides at their own
 * discretion.
 *
 * If any of these updates are incorporated into further releases of the framework
 * they should be removed from this file.
 *
*/

/*
 * Override to fix defect 1177 - Defect in method update of class FormElementGUIAdaptor.
 *
 * Override fixes defect in named method. Override of method _filterDuplicateActionBusinessLifeCycleEvents
 * of class FormController removes duplicate action and clear business life cycle events from
 * business life cycle queue.
*/

FormElementGUIAdaptor.prototype.update = function() {
if(FormElementGUIAdaptor.m_logger.isDebug()) FormElementGUIAdaptor.m_logger.debug("FormElementGUIAdaptor.update(): " + this.getId());
var db = this.dataBinding;
if(null != db)
{
var fc = FormController.getInstance();
var dm = fc.getDataModel();
fc.startDataTransaction(this);
var state = this.m_value.state;
var stateXPath = db + FormElementGUIAdaptor.FORM_STATE_XPATH;
var origState = dm.getValue(stateXPath);
var stateChanged = Services.compareStringValues(state, origState);
var stateUpdated = false;
if(!stateChanged)
{
stateUpdated = dm.setValue(stateXPath, state);
}
var dirty = this.m_value.dirty.toString();
var dirtyXPath = db + FormElementGUIAdaptor.FORM_DIRTY_XPATH;
var origDirty = dm.getValue(dirtyXPath);
var dirtyChanged = Services.compareStringValues(dirty, origDirty);
var dirtyUpdated = false;

// Override change. Use !dirtyChanged rather than !dirtyUpdated

if(!dirtyChanged)
{
dirtyUpdated = dm.setValue(dirtyXPath, dirty);
}
fc.endDataTransaction(this);
return stateUpdated || dirtyUpdated;
}
else
{
throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = " + this.getId());
}
}

FormController.prototype._filterDuplicateActionBusinessLifeCycleEvents = function( originalQueue )
{
var refStore = new Object();
var filteredQueue = new Array();
for(var i = 0, l = originalQueue.length; i < l; i++)
{
var event = originalQueue[i];

// Override change. Filter duplicate clear events in addition to action events.

if(event.getType() == BusinessLifeCycleEvents.EVENT_ACTION ||
   event.getType() == BusinessLifeCycleEvents.EVENT_CLEAR)
{
var uniqueEventRef = event.getComponentId() +
"_" +
event.getType();
if(null == refStore[ uniqueEventRef ])
{
refStore[ uniqueEventRef ] = true;
filteredQueue[ filteredQueue.length ] = event;
}
}
else
{
filteredQueue[ filteredQueue.length ] = event;
}
}
if(filteredQueue.length != originalQueue.length)
{
if(FormController.m_logger.isDebug())
{
FormController.m_logger.debug( "Duplicate business life cycle events removed by queue processing" );
}
}
refStore = null;
return filteredQueue
}


/* 
 * Overrides to fix defect 1183 - Problems with key board navigation on filtered,
 * multiselection grids. RWW 29/06/07.
 *
*/

GridGUIAdaptor.prototype.renderState = function()
{
    // First store state of focus change
    var focusChanged = false;

    if(this.m_focusChanged)
    {
        this.m_focusChanged = false;

        focusChanged = true;
    }

    // Process standard grid events
    var model = this.m_model;

    model.processRenderEvents();

    // Check rendering of cursor if grid is a multiselection, filtered grid
    // that has just received focus.
    if(focusChanged && this.m_focus)
    {
        if(this.multipleSelection && 
           this.getId().indexOf(FilteredGrid.GRID_ID_SUFFIX) != -1)
        {
            // Check consistency of cursor row
            var cursorRow = model.m_cursorRow;
            var dataRow = model.m_data[cursorRow];

            if(null != dataRow && dataRow.cursor)
            {
                // Grid has a cursor row
                if(model.m_rowRange.isRowVisible(cursorRow))
                {
                    var viewRowNumber = model.getViewRowNumberFromDataRowNumber(cursorRow);

                    var viewRow = this.m_renderer.m_rows[ viewRowNumber ];

                    if(viewRow.m_element.className.indexOf( "grid_row cursor" ) == -1)
                    {
                        // Cursor style not set
                        var event = new RowRenderEvent( cursorRow, dataRow.key, "setCursorRow" );
                        // Publish row render event
                        model.publishRowRenderEvent( event );
                        // Process row render event
                        model.processRenderEvents();                              
                    }

                    // Clear reference to row
                    viewRow = null;
                }
            } 
        } // End of if(this.multipleSelection ...
    } // End of if(focusChanged && this.m_focus)
}

GridMultipleSelectionStrategy.prototype.resetRowStatesAfterSrcDataRefresh = function()
{
    if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridModel.resetRowStatesAfterSrcDataRefresh() this.m_multipleSelection = " + this.m_multipleSelection + ", this.m_currentSelectedDataRowNumber = " + this.m_currentSelectedDataRowNumber);

    var model = this.m_model;
    var length = this.m_model.m_data.length;

    if(length > 0)
    {
        this.refreshSelectionsFromDataBinding();

        // As grid data has been changed previous cursor row is not of much use.
        // Therefore, use a selection or first row. Use Mr Hayes' technique to
        // determine selection so that selection agrees with scrollSelectedRowIntoView
        var dataRowNumber = null;
        var keyNodes = this.getKeyNodes();

        if(null != keyNodes)
        {
            var numberOfNodes = keyNodes.length;

            if(numberOfNodes > 0)
            {
                dataRowNumber = length;

                for(var i = numberOfNodes - 1; i >= 0; i--)
                {
                    // Define data row number
                    var key = keyNodes[i];
                    var keyText = XML.getNodeTextContent(key);
                    var selectedDataRowNumber = model.getDataRowNumberByKey(keyText);

                    if(null != selectedDataRowNumber && selectedDataRowNumber < dataRowNumber)
                    {
                        dataRowNumber = selectedDataRowNumber;
                    }
                }
            }
        }

        if(null != dataRowNumber && dataRowNumber < length)
        {
            model.setCursorRow(dataRowNumber);
        }
        else
        {
            // Set cursor to first row
		model.setCursorRow(0);
        }
  
	}
	else
	{
		// If there is no data then clear down any value(s) in the databinding
		Services.removeNode(this.m_dataBinding);
	}
}

/**
 * Override to fix defect 1184 - Conditional submission of life cycle after execution 
 * of preDynamicPostSubmitEventProcess.
 *
*/

/**
 * Method performs dynamic post submit action defined by detail
 * included in submit life cycle dispatch method call. Override lets
 * custom function return boolean value indicating whether, or not,
 * the pending life cycle should be dispatched.
 *
 * @param dom XML structure returned from server after service call
 *			  (can be null as submit may not have involved a service call)
 *
*/
SubmitFormBusinessLifeCycle.prototype._dynamicPostSubmitAction = function(dom)
{
    // Retrieve post submit life cycle event type
    var postSubmitEvent = this.m_dynamicPostSubmitEvent;
    
    // Set flag indicating post submit life cycle will be dispatched
    var dispatchPostSubmitEvent = true;
    
    // If required apply pre-dynamic post submit event
    // custom processing
    var preDynamicPostSubmitEventProcess = this.m_submitConfig.preDynamicPostSubmitEventProcess;
    
    if(null != preDynamicPostSubmitEventProcess)
    {
        var dispatchEvent = preDynamicPostSubmitEventProcess.call(this, 
                                                                  postSubmitEvent.getType(),
                                                                  dom);
                                                                  
        // Only prevent dispatch of pending life cycle event if custom function
        // returned "false"
        if(dispatchEvent == false)
        {
            dispatchPostSubmitEvent = false;
        }
    }
    
    // As submit successful set data model flag clean
    this.m_adaptor._setDirty(false);
    this.m_adaptor.update();
    
    if(dispatchPostSubmitEvent)
    {
        // Populate submit dispatch with details from post submit event
        Services.dispatchEvent( postSubmitEvent.getComponentId(),
                                postSubmitEvent.getType(),
                                postSubmitEvent.getDetail() );
    }
                            
}

/**
 * Override to control return of nodes /ds/var/app and /ds/var/form from
 * LOV subforms. This should help the performance of certain pages of
 * FamilyMan III.
 *
*/

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
		},

        records: [ { xpath: "/ds/var/app" },
                   { xpath: "/ds/var/form" } ]
		
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
	
	if(null != this.logicOn && null != this.logic)
    {
        subFormConfig.logicOn = this.logicOn;
        subFormConfig.logic = this.logic
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

LOVSubformGUIAdaptor.prototype.setReturnedDOM = function(nodes)
{
    // Upgrade method such that the nodes are only returned if they
    // have changed.
    var returnDsVarApp = true;
    var returnDsVarForm = true;

    this.m_returnedDOM = nodes;

    if (this.m_returnedDOM != null)
    {
        // Retrieve reference to form controller of subform
        var subformController = this.m_subformView.getFormController();

        if(null != subformController)
        {
            // Retrieve reference to subform adaptor
            var subformAdaptor = subformController.getFormAdaptor();

            if(null != subformAdaptor)
            {
                if(subformAdaptor.hasRecords())
                {
                    var records = subformAdaptor.m_records;

                    var xPath = null;
                    var record = null;

                    for(var i = 0, l = records.length; i < l; i++)
                    {
                        record = records[i];
                        xPath = record.getXPath();

                        if(xPath == "/ds/var/app")
                        {
                            returnDsVarApp = this._checkNodeDirty( this.m_returnedDOM["app"] );
                        }
                        else if(xPath == "/ds/var/form")
                        {
                            returnDsVarForm = this._checkNodeDirty( this.m_returnedDOM["form"] );
                        }
                    }

                    // Clean up all references as they refer to objects in a different window
                    xPath = null;
                    record = null;

                    records = null;
                }
                subformAdaptor = null;
            }
            subformController = null;
        }

        if(returnDsVarApp)
        {
            Services.replaceNode("/ds/var/app", this.m_returnedDOM["app"]);
        }

        if(returnDsVarForm)
        {
            Services.replaceNode("/ds/var/form", this.m_returnedDOM["form"]);
        }

    }
}

LOVSubformGUIAdaptor.prototype._checkNodeDirty = function(returnNode)
{
    var nodeDirty = false;
 
    if(null != returnNode)
    {

        var dirtyNodes = returnNode.selectNodes( RecordsProtocol.RECORD_DIRTY_ELEMENT );

        if(dirtyNodes.length > 0)
        {
            var child = null;
            var parent = null;

            for(var i = 0, l = dirtyNodes.length; i < l; i++)
            {
                child = dirtyNodes[i];

                if(XML.getNodeTextContent(child) == "true")
                {
                    nodeDirty = true;
                }

                parent = child.parentNode;
                parent.removeChild(child);
            }

            child = null;
            parent = null;
        }

    dirtyNodes = null;

    }
            
    return nodeDirty;
}

/**
 * Override to fix defect 1180 - Problem with Validation Protocol initialisation.
 *
 * As yet not implemented in application code.
 *
*/

ValidationProtocol.prototype.initialiseValidationProtocol = function(e)
{
    var error = this.invokeValidate(e);
    this.setLastError(error);
    this.setValid(error == null);
}

/**
 * Overrides to fix defect 1181 - Backspace key in text field causes browser back navigation.
 *
*/

FormController.prototype.endDataTransaction = function(a)
{
	if(FormController.m_logger.isError()  && a!=this.m_dataTransactionAdaptor)
	{
		FormController.m_logger.error("FormController.endDataTransaction(): previous transaction did not complete before this transaction completed."
		 + " Current transaction adaptor: " + ((this.m_dataTransactionAdaptor == null) ? "null" : this.m_dataTransactionAdaptor.getId())
		 + " new transaction adaptor: " + ((a == null) ? "null" : a.getId()));
	}
	if(a.supportsProtocol("ValidationProtocol") && (a.hasValidate() || a.hasServerValidate()))
	{		
		if(!a.isServerValidationActive())
		{
			var validStateChanged = false;
			var valueChanged = false;
			var validState = a.getValid();
			var value = Services.getValue(a.dataBinding);
			if(validState == false && this.m_dataTransactionAdaptorValidState == true) validStateChanged = true;
			if(this.m_dataTransactionAdaptorValue != value) valueChanged = true;

			if(validStateChanged == true || (validStateChanged == false && valueChanged == true && validState == false))
			{
				if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Value of invalid field changed so resetting focus to invalid field.");
				this.m_tabbingManager.setValidationFailedAdaptor(a);
			}
			else
			{
				if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Value of invalid field has not changed - not resetting focus.");
			}
		}
	}
	else
	{
		if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Updated field does not support validation - not resetting focus.");
	}
	this.m_dataTransactionAdaptor = null;
}

ValidationProtocol.prototype.handleServerValidationSuccess = function(dom)
{
	var errorCodeId = XML.selectNodeGetTextContent(dom, "//ErrorCode");
	var fc = FormController.getInstance();
	
	if(errorCodeId == "" || errorCodeId == null)
	{
		//alert("Server validation for adaptor " + this.getDisplayName() + " succeeded");
		this.m_serverValid = true;
		this.setLastError(null);
	}
	else
	{
		var errorCode = null;
		var paramNodes = dom.selectNodes("//ErrorCode/Parameters/Parameter");
		if(paramNodes == null || paramNodes.length == 0)
		{
			errorCode = ErrorCode.getErrorCode(errorCodeId);
		}
		else
		{
			var params = new Array();
			params[0] =  "ErrorCode.getErrorCode(\"";
			params[1] =  errorCodeId;
			params[2] =  "\"";
			for(var i=0, l=paramNodes.length; i<l; i++)
			{
				params[params.length] = ", \"";
				params[params.length] = XML.getNodeTextContent(paramNodes[i]);
				params[params.length] = "\"";
			}
			params[params.length] = ");";
			var evalString = params.join("");
			errorCode = eval(evalString);
		}
	
		this.setLastError(errorCode);
		//alert("Server validation for adaptor " + this.getDisplayName() + " failed with error " + errorCode.getMessage());
		
		// Reset focus to invalid field
		var tm = fc.getTabbingManager();
		tm.setValidationFailedAdaptor(this);
	}
	
	this.triggerStateChangeEvent();
	fc.processEvents();
	
	// Set server validation active flag to inactive
	this.m_serverValidationActive = false;
}

TabbingManager.prototype._focusAdaptor = function(a, wasClick, acceptFocusOnClick)
{
    // Set default value
    var focusSetOnAdaptor = true;
    
	if(this.m_currentFocussedAdaptor != a)
	{
		// Clear all selections on the screen (some text fields may still have selected text)
		// Basically just select a TextRange of zero size at the next element.
        
        if(window.attachEvent 
           && a != null
           && wasClick != true) // if IE and adaptor exists and focus not set by mouse click (Defect 773)
        {
          
          var range = document.body.createTextRange();
          range.moveToElementText(a.m_element); 
		  range.moveStart("textedit",1); // Move start of range to end of text
		  range.select(); 
		}
		
		// If unfocus moved the focus programmatically...
		if(null != this.m_servicesSetFocusAdaptor)
		{
			a = this.m_servicesSetFocusAdaptor;
			this.m_servicesSetFocusAdaptor = null;
		}
	
		if(null != a)
		{
		    // Attempt to move focus to new adaptor
		    focusSetOnAdaptor = this._moveFocusToAdaptor( a, wasClick, acceptFocusOnClick );
		}
		else
		{
		    // Adaptor is null
		}
	}
	else
	{
		// Need this else condition for the case where we are setting the focus back on the same
		// adaptor if the adaptor fails validation
		if(this._canAcceptFocusNatively(this.m_currentFocussedAdaptor))
		{
			// TODO: Doing this check here doesn't seem to make sense to me!!! Shouldn't we:
			//   a) apply this to non-native adaptors as well and
			//   b) Know that the adaptor is enabled and visisble before we try and set focus on it?
			if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
			{
				// If focus was set by click, then focus will be set automatically
				if(!wasClick)
				{
					var cfa = this.m_currentFocussedAdaptor;
					
					// Accept keyboard focus natively using focus() method on element
					cfa.getFocusElement().focus();
					
				    // Defect 1174. If text box, or derivative, highlight invalid text
				    if((cfa instanceof TextInputElementGUIAdaptor) ||
				       (cfa instanceof TextAreaElementGUIAdaptor) ||
				       (cfa instanceof DateTextInputElementGUIAdaptor))
				    {
				        cfa.getFocusElement().select();
				    }
				}
			}
		}
		else
		{
			// Intercept keyboard events on the window and re-route them to
			// the adaptor which the TabbingManager has focussed.
			this.m_hiddenField.focus();
			this.m_captureSet = true;
		}
		// need to force a change in the adaptor so that dropdowns refresh themselves, this
		// means we need to force the focus to change, and call render state each time
		// @TODO This definately!!! should be actually performed by the FormController
		if(!wasClick)
		{
			if(null != this.m_currentFocussedAdaptor.onBlur) this.m_currentFocussedAdaptor.onBlur();
			if(null != this.m_currentFocussedAdaptor.onFocus) this.m_currentFocussedAdaptor.onFocus();
		}

	}
	
	this.m_formElementGUIAdaptor._setCurrentFocusedField(this.m_currentFocussedAdaptor);
	
	// Return both flag indicating whether, or not, focus has been put on
	// adaptor and adaptor itself as this may not be the same as the adaptor
	// passed in.
	var returnProperties = new Object();
	
	returnProperties["focusSetOnAdaptor"] = focusSetOnAdaptor;
	returnProperties["focusAdaptor"] = a;

    return returnProperties;
}

var overrideMethod = window["ValidationProtocol"].prototype["handleServerValidationSuccess"];
window["AutocompletionGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["CheckboxInputElementGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["FwSelectElementGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["InputElementGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["SelectElementGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["DatePickerGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["GridGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
window["ZoomFieldGUIAdaptor"].prototype["handleServerValidationSuccess"] = overrideMethod;
overrideMethod = null;

/**
 * Override to fix defect 1182 - LOV button clicking causes Runtime Error.
 *
 * As yet not implemented in application code.
*/

TabbingManager.prototype._determineBackgroundFocus = function()
{
	if(this.m_currentFocussedAdaptor != null)
	{
	    var parentContainer = this.m_currentFocussedAdaptor.getParentContainer();
	    
	    if(parentContainer != null)
	    {
	    	// We have a parent container, so get it's focus element
			var focusElement = parentContainer.supportsProtocol("FocusProtocolHTMLImpl") ?
							   parentContainer.getFocusElement() :
							   parentContainer.getElement();
			
		    if(focusElement.tagName == 'FORM')
		    {
		        // Replace form element with parent body if possible because form
		        // elements cannot accept the focus
		        var parent = focusElement.parentNode;
		        
		        while(parent != null)
		        {
		            if(parent.tagName == 'BODY')
		            {
		                focusElement = parent;
		                break;
		            }
		            
		            parent = parent.parentNode;
		        }
		    }
		    
		    if(!focusElement.disabled && isElementVisible(focusElement) && focusElement.focus)
		    {
				try
				{
					// Focus element is enabled, visible and should accept focus, so attempt to
					// focus on it
					focusElement.focus();
				}
				catch(e)
				{
					// Browser has thrown an error: "Can't move focus to the control because it
					// is invisible, not enabled, or of a type that does not accept the focus".
					// So the only thing we can do is focus on the window.
	    			window.focus();
				}
			}
			else
			{
		    	// Focus element is disabled or hidden or can't accept focus, so focus on the window
	    		window.focus();
			}
	    }
	    else
	    {
	    	// No parent container for the current focussed adaptor, so focus on the window
	    	window.focus();
	    }
    }
    else
    {
    	// No current focussed adaptor, so focus on the window
    	window.focus();
    }
}

/**
 * Overrides to fix Family Man problem with intermittent showing of table borders in FCK Editor.
 *
*/

WordProcessingGUIAdaptor.prototype.setHTML = function(html)
{ 
	this.stopEventHandlers();	
    
	// De-select text range as old selection is no longer valid.
	this.m_textSelectRange = null;
    
	var fckEd = this.getFCKEditor();
    fckEd.SetHTML(html,true);
    
    // Reproduce the FCK Editor show table borders IE behaviour functionality.
    // Notes:
    // The configuration item, FCKConfig.ShowBorders, is set to false in the
    // WordProcessingConfig.js file to turn off the FCK Editor behaviour.
	// The FCK Editor class name is not added to the table <TR> elements
	// because they are not in the fck_internal.css.    
	var tables = this.m_editableIframe.contentWindow.document.getElementsByTagName("TABLE");
	
	for(var i = tables.length - 1; i >= 0; i--)
	{
		var table = tables[i];
		this._showTableBorders(table);
		
		var cells = table.getElementsByTagName("TD");
		
		for(var j = cells.length - 1; j >= 0; j--)
		{
			this._showTableBorders(cells[j]);
		}
	}
	
    // Re-apply framework style sheet
    this.addCSSToDocument();

	this.startEventHandlers();	
}

/* 
 * Word Processing GUI adaptor implementation of the FCK Editor show table
 * borders behaviour file (showtableborders.htc).
 */
WordProcessingGUIAdaptor.prototype._showTableBorders = function(element)
{
	var regex = /\s*FCK__ShowTableBorders/;
	
	if(element.border == 0)
	{
		if(!regex.test(element.className))
			element.className += ' FCK__ShowTableBorders';
	}
	else
	{
		if(regex.test(element.className))
		{
			element.className = element.className.replace(regex, '');
			
			if(element.className.length == 0)
				element.removeAttribute('className', 0);
		}
	}
}

/*
 * Add to Framework FCK Editor custom configurations file for Family Man show table borders problem.
 */

FCKConfig.ShowBorders = false;

/*
 * Add to Framework FCK Editor custom configurations file for Family Man character set problem.
 */

FCKConfig.IncludeLatinEntities = false;
FCKConfig.IncludeGreekEntities = false;


/**
 * Note that this override has been added to this file for completeness. It is
 * likely, but not yet certain, that this override will be used to improve the
 * performance of the FamilyMan application.
 *
 **/

SubmissibleState.prototype.setState = function(stateChangeEvent, adaptorValue)
{
    var key = null;

    if(this.m_adaptor.keyAdaptor == true)
    {
        key = adaptorValue;
    }
    this.m_key = key;

    var originalAggregateState = this.isSubmissible(key);

    this.getAdaptorState(adaptorValue);

    switch(stateChangeEvent.getType())
    {
        case StateChangeEvent.SRCDATA_TYPE:
        var result = this.handleSrcDataEvent();
        if(result == true) return result;
        break;
        case StateChangeEvent.CHILD_TYPE:
        this.handleChildEvent(stateChangeEvent, key);
        break;
        case StateChangeEvent.PARENT_TYPE:
        return this.handleParentEvent(stateChangeEvent, key);
        break;
        case StateChangeEvent.REMOVED_ADAPTOR_TYPE:
        return this.handleRemovedAdaptorEvent(stateChangeEvent, key);
        break;
        default:
        break;
    }
    var newAggregateState = this.isSubmissible(key);
    return (originalAggregateState != newAggregateState);
}

GridSubmissibleState.prototype.setState = function(stateChangeEvent, key)
{
    var changed = false;
    this.m_key = key;
    var originalAggregateState = this.isSubmissible(key, false);

    var originalValidState = this.m_valid;

    this.getAdaptorState(key);
 
    switch(stateChangeEvent.getType())
    {
        case StateChangeEvent.SRCDATA_TYPE:
            changed = this.handleSrcDataEvent();
            break;
        case StateChangeEvent.CHILD_TYPE:
            this.handleChildEvent(stateChangeEvent, key);
            break;
        case StateChangeEvent.PARENT_TYPE:
            changed = this.handleParentEvent(stateChangeEvent, key);
            break;
        case StateChangeEvent.REMOVED_ADAPTOR_TYPE:
            changed = this.handleRemovedAdaptorEvent(stateChangeEvent);
            break;
        default:
            break;
    }
    if(changed == false)
    {
        var newAggregateState = this.isSubmissible(key, false);
        var newValidState = this.m_valid;
        changed = (originalAggregateState != newAggregateState);
        if(changed == false) changed = (originalValidState != newValidState);
    }
    return(changed);
}

SubmissibleState.prototype.getAdaptorState = function(adaptorValue)
{
    var adaptor = this.m_adaptor;

    if(adaptor.dataBinding)
    {
        // Set value to adaptor value retrieved earlier by method "invokeUpdateAdaptorState"
        this.m_value = adaptorValue;
    }

    if(adaptor.getEnabled)
    {
        this.m_enabled = adaptor.getEnabled();
    }
    else
    {
        this.m_enabled = true;
    }
    if(adaptor.getValid)
    {
        this.m_valid = adaptor.getValid();
    }
    else
    {
        this.m_valid = true;
    }
    if(adaptor.getReadOnly)
    {
        this.m_readOnly = adaptor.getReadOnly();
    }
    else
    {
        this.m_readOnly = false;
    }
    if(adaptor.getMandatory)
    {
        this.m_mandatory = adaptor.getMandatory();
    }
    else
    {
        this.m_mandatory = false;
    }
    if(adaptor.hasTemporary && adaptor.hasTemporary())
    {
        this.m_temporary = adaptor.invokeIsTemporary();
    }
    else
    {
        this.m_temporary = false;
    }
}
