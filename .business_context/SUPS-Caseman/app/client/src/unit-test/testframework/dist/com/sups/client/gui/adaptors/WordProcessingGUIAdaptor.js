/**
 * WordProcessingGUIAdaptor
 *
 * Implementation based on FCKEditor (version 2.0) and JSpell.
 *
 * Integrated witht the framework and implements the Focus,Active,Enablement
 * and DataBindingProtocols.
 *
 * General Comments / Explanations:
 *
 * Onload handlers and initialisation:
 * The FCKEditor consists of two iframes which are initialised asyncronousy.
 * This leads to problems with the framework interacting with it as it
 * is highly possible that the editor has either a) not loaded the script
 * required into the iframe or b) The script has loaded, but the FCKEditor's
 * internal state is not ready, and runtime errors occur. Two strategies
 * are employed.
 * The first in onload handlers placed on the two iframes -
 * these are used for configuring the FCKEditor at the appropriate time as
 * well as starting the required event handlers.  See .setupFCKEditor() and
 * .setupFCKEditor2().
 * The second is in used for when other parts of the
 * framework look to interact with the adaptor, which may not be ready yet.
 * The two methods in question are renderstate() and focus() - which may
 * be called as part of general initiasation - but then require items
 * which may not yet be ready.  To counter this  the function
 * checkFCKEditorReady() checks whether the script is loaded and the function
 * exists, if it is not ready then a timeout is set before checking again
 * and finally calling the function when everything is loaded. Note - this is
 * not 100% bulletproof as there is no way that we know of to check if the
 * internal state of the FCKEditor is actually ready yet - however in testing
 * a runtime error has not been seen using this method.
 *
 * RWW 4/01/06. FCKeditor actually provides for a callback function,
 * FCKeditor_OnComplete, which the editor invokes when it believes
 * it is fully loaded. To solve initial loading problems (defect 838)
 * I have implemented this method. The FormController stores a list
 * of WordProcessingGUIAdaptors. Initially, the adaptors are flagged
 * as not being loaded. When the FCKeditor_OnComplete function is
 * invoked the associated adaptor is modified to indicate the load
 * is complete. I have also modified the FormController such that
 * when a form contains instances of the class WordProcessingGUIAdaptor
 * the second stage of initialisation is not allowed to start until
 * all instances of FCKeditor have been loaded. This should allow
 * the adaptor state initialisation to set the default contents
 * of the editor document.
 *
 * Rendering problems:
 * IE has problems rendering "paste" operations in iframes - this exists on all
 * platforms but is much more pronounced on slower and/or SP1 machines.  Basically
 * doing multiple pastes causes the screen to freeze, and the effect of the
 * pastes is not seen sometimes for up to 10 seconds later and/or when the mouse
 * is moved.  To counter this an handler has been placed on "onpaste" and "ondrop"
 * operations and it bascially just adds a blank space to the current text. This
 * has been found to solve the rendering problems in 98% of scenarios.
 *
 * Focusing issues:
 * IE does not remember the focus location within an editable iframe.  To be
 * able to remember when the focus was last if the user clicks off then tabs
 * back on a "onkeydown" handler has been implemented which basically just remembers
 * the focus for each keypress.  An important point is that obviously the
 * focus is destroyed if the databinding for the FCKEditor changes AND the value
 * that is changes to is different to that currently held. If for some reason
 * you are losing this focussing information it is almost definately that the
 * comparison between the two values(performed in renderstate) is returning false
 * when it should be true (changes in transformToX can cause these type of issues).
 *
 */
function WordProcessingGUIAdaptor()
{
}

WordProcessingGUIAdaptor.m_logger = new Category("WordProcessingGUIAdaptor");
WordProcessingGUIAdaptor.CSS_CLASS_NAME = "wordProcessing" ;
WordProcessingGUIAdaptor.TRANSPORT_TAG = "p" ;
WordProcessingGUIAdaptor.m_initialHTML = "";
WordProcessingGUIAdaptor.m_setHTMLCounter = 0;
WordProcessingGUIAdaptor.replacingContent = false;

/**
* Subclass of HTMLElementGUIAdaptor
*/
WordProcessingGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
WordProcessingGUIAdaptor.prototype.constructor = WordProcessingGUIAdaptor;


/**
 * Add the required protocols to the adaptor
 */
GUIAdaptor._setUpProtocols('WordProcessingGUIAdaptor');
GUIAdaptor._addProtocol('WordProcessingGUIAdaptor', 'BusinessLifeCycleProtocol');
GUIAdaptor._addProtocol('WordProcessingGUIAdaptor', 'FocusProtocol');
GUIAdaptor._addProtocol('WordProcessingGUIAdaptor', 'ActiveProtocol');
GUIAdaptor._addProtocol('WordProcessingGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('WordProcessingGUIAdaptor', 'EnablementProtocol');


/**
 * References to the FCKeditor's iframes.
 */
WordProcessingGUIAdaptor.prototype.m_mainIframe = null;
WordProcessingGUIAdaptor.prototype.m_editableIframe = null;

/**
 * Flag recording whether or not FCKeditor has indicated
 * that loading is complete.
 *
*/
WordProcessingGUIAdaptor.prototype.m_FCKeditorLoadComplete = false;



/*
 *  Invokes the wordprocessor's creation method (wrapping the
 *  output in a div)
 */
WordProcessingGUIAdaptor.createInline = function(id)
{
	document.write("<div id='" + id + "' class='" + WordProcessingGUIAdaptor.CSS_CLASS_NAME + "' tabindex='1' hideFocus='true'>");
//	document.write("<img id=\"wp_image" + id +"\" GALLERYIMG=\"no\" class=\"wordProcessing\" src=\"./images/inactive.gif\">");
	var inactiveGifURL = Services.getAppController().m_config.getAppBaseURL() +
	    "/images/inactive.gif";
	document.write("<img id=\"wp_image" + id +"\" GALLERYIMG=\"no\" class=\"wordProcessing\" src="+inactiveGifURL+">");

	var wpId = id + "_wordprocessor";
	document.write("<textarea id=\"" + wpId + "\"></textarea>");

	document.write("</div>");

};

/**
 * Create a new WordProcessingGUIAdaptor
 * @param e the logic element to manage
 * @return the new WordProcessingGUIAdaptor
 * @type WordProcessingGUIAdaptor
 */
WordProcessingGUIAdaptor.create = function(e)
{
	var a = new WordProcessingGUIAdaptor();
	a._initWordProcessingGUIAdaptor(e);
	return a;
};

/**
 * Get the element to set focus on. For the wordprocessor this
 * is the content window of the editableIframe.
 */
WordProcessingGUIAdaptor.prototype.getFocusElement = function()
{
	// First time this is invoked the editableIframe may
	// not be fully setup yet.
	if (this.m_editableIframe)
	{
		return this.m_editableIframe.contentWindow.document.body;
	}
	return this.m_element;
};

/**
 * Initialise the WordProcessingGUIAdaptor.  Creates
 * an empty array to hold the eventHandlerKeys
 *
 * @param e the HTMLElement for the select element to be managed
 */
WordProcessingGUIAdaptor.prototype._initWordProcessingGUIAdaptor = function(e)
{
	if(WordProcessingGUIAdaptor.m_logger.isInfo()) WordProcessingGUIAdaptor.m_logger.info(e.id + ":WordProcessingGUIAdaptor._initWordProcessingGUIAdaptor");

	this.m_element = e;
	var a = this;

	// Setup the array of event handling keys.
	a.m_eventHandlerKeys = new Array();

	// Add adaptor to FormController array containing references
	// to instances of class WordProcessingGUIAdaptor
	FormController.getInstance().addWordProcessingGUIAdaptor(a);

	return a;
};

/**
 * Configure the WordProcessingGUIAdaptor. It is possible to have a select with a set of options hardcoded
 * into the HTML in which case the only JS configuration required would be dataBinding from
 * the DataBindingProtocol.
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
WordProcessingGUIAdaptor.prototype._configure = function(cs)
{
	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];

		if(c.toolBarSet && this.m_toolBarSet == null)
		{
			this.m_toolBarSet = c.toolBarSet;
		}
/*
		if(c.toolBar && this.m_toolBar == null)
		{
			this.m_toolBar = c.toolBar;
		}
*/
		if(c.width && this.m_width == null)
		{
			this.m_width = c.width;
		}

		if(c.height && this.m_height == null)
		{
			this.m_height = c.height;
		}

		if(c.saveAction && this.m_saveAction == null)
		{
			this.m_saveAction = c.saveAction;
		}

		if(c.printAction && this.m_printAction == null)
		{
			this.m_printAction = c.printAction;
		}

		if(c.previewAction && this.m_previewAction == null)
		{
			this.m_previewAction = c.previewAction;
		}
	}

	// Use the default ToolBar set if one is not defined
	if (this.m_toolBarSet == null)
	{
		this.m_toolBarSet = "SUPSDefault";
	}

	// Set up default methods on user definable functions.
	if (this.m_saveAction == null)
	{
		this.m_saveAction = function()
		{
			Services.showAlert("In default save action");
		};
	}
	if (this.m_printAction == null)
	{
		this.m_printAction = function()
		{
			Services.showAlert("In default print action");
		};
	}
	if (this.m_previewAction == null)
	{
		this.m_previewAction = function()
		{
			Services.showAlert("In default preview action");
		};
	}

	// Now actually start up the wordprocessor
	var wpId = this.getId() + "_wordprocessor";
	var oFCKeditor = new FCKeditor(wpId, this.m_width, this.m_height, this.m_toolBarSet) ;

	// Set up the URL for the custom configuration file
	var ac = Services.getAppController();
	var baseURL = ac.m_config.getAppBaseURL() + "/com/sups/client/gui/wordProcessing/fckeditor";
	oFCKeditor.Config["CustomConfigurationsPath"] = baseURL + "/WordProcessingConfig.js";

	oFCKeditor.ReplaceTextarea();

	// Find the main iframe of the fckeditor and remember it.
	this.m_mainIframe = document.getElementById(wpId + "___Frame");


	// Add onload event for the editor iframe so we can start up all the required
	// handlers etc.
	var thisObj = this;

	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_mainIframe,
	                             "load",
	                             function() {thisObj._setupFCKEditor();},
	                             false));

	// Create a link to the "enablement" image
    this.m_inactiveImage = document.getElementById("wp_image" + this.getId());

 	// Start the mousedown event handler to cater for when IE decides to take ages
 	// to fire the above onload event.
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_inactiveImage,
                                      "mousedown",
                                      function(evt) { thisObj.stopPropagationHandler(evt); },
                                      false));

	// Get the correct size of the wordprocessor
    var div = document.getElementById(this.getId());
    this.m_inactiveImage.style.width = div.offsetWidth;
    this.m_inactiveImage.style.height = div.offsetHeight;

};

/*
 * This function is called when the first (of 2) iframes is created
 * by the FCKeditor.
 *
 * Invoked at the end of _config when the adaptor is setup.
 *
 * It sets up the next onload handler to be called when the second
 * iframe is initialised.
 */
WordProcessingGUIAdaptor.prototype._setupFCKEditor = function()
{
    var editorIframe = this.m_mainIframe.contentWindow.document.getElementById("xEditingArea");

    // Pass in GUI adaptor reference to iframe
    this.m_mainIframe.contentWindow.GUIAdaptorRef = this;

    if(editorIframe.firstChild != null)
    {
        var thisObj = this;
        this.m_editableIframe = editorIframe.firstChild;

        // Add in any configuration required for the FCKEditor before the editor examines
        // its configuration.
        //this.addFCKConfig();



        this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(editorIframe.firstChild,
                                     "load",
                                     function() {thisObj._setupFCKEditor2();},
                                     false));
    }
};

/* Called when the editor iframe is initialised (and again if the formcontroller is
 * not available).  Responsible for setting up the event handlers and sizing the
 * "inactive" gif.
 */
WordProcessingGUIAdaptor.prototype._setupFCKEditor2 = function()
{
    this.checkEditableIFrame();
    
    this.addCSSToDocument();

	// Stop all event handlers (some may have been started already due to IE's ropey handling of
	// the "onload" meaning that we needed them before getting here - best to clear down
	// just to be sure)
	this.stopEventHandlers();

	// Start all event handlers up.
	this.startEventHandlers();
};

/*
 * Attach the wordprocessing.css to the editor document.
 */
WordProcessingGUIAdaptor.prototype.addCSSToDocument = function()
{
    var ac = top.AppController.getInstance();
    var cssLoc = ac.m_config.getAppBaseURL() + "/fw_IE.css";
    this.checkEditableIFrame();
	this.m_editableIframe.contentWindow.document.createStyleSheet(cssLoc);
};

/*
 *  Checks whether the editableIframe has been initialised successfully.
 */
WordProcessingGUIAdaptor.prototype.checkEditableIFrame = function()
{
    if(this.m_editableIframe == null)
    {
        this.m_editableIframe = this.m_mainIframe.contentWindow.document.getElementById("xEditingArea").firstChild;
    }
};

/**
 * Invoked from _setupFCKEditor - this method adds all of the
 * configuration required to the FCKEditor.
 * It dynamically adds to the FCKConfig object used by the FCKEditor
 */
WordProcessingGUIAdaptor.prototype.addFCKConfig = function()
{
	var configObj = this.m_mainIframe.contentWindow.FCKConfig;

	// Add the custom toolbarset to the object in the mainIframe before the editor needs it.
	if (this.m_toolBarSet == "custom")
	{
		configObj.ToolbarSets["custom"] = this.m_toolBar;
	}

	// Add in each of the plugins.
	var plugins = WordProcessingPlugins.plugins;
    var i;
	if (plugins)
	{
		for (i = 0; i < plugins.length; i++)
		{
			configObj.Plugins.Add(plugins[i],'en');
		}
	}

	// Add in each of the default toolbar types.
	var toolBarSets = WordProcessingToolBarSets.toolBarSets;
	if (toolBarSets)
	{
		for (i = 0; i < toolBarSets.length; i++)
		{
			configObj.ToolbarSets[toolBarSets[i][0]] = toolBarSets[i][1];
		}
	}
    configObj.FullPage = true;
};

/*
 *  Sets up all eventHandlers for the object - adding them to m_eventHandlerKeys.
 */
WordProcessingGUIAdaptor.prototype.startEventHandlers = function()
{
	var tm = FormController.getInstance().getTabbingManager();
	var thisObj = this;


	// Add handler to parent document.
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_mainIframe.contentWindow.document,
                                      "mousedown",
                                      function(evt) { tm._handleComponentClick(thisObj,evt); },
                                      false));

	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_inactiveImage,
                                      "mousedown",
                                      function(evt) { thisObj.stopPropagationHandler(evt); },
                                      false));

	// And now the rest for the current document
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,
                                      "keydown",
                                      function(evt) {thisObj.processKeyDown(evt); },
                                      false));

    this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,
                                      "keyup",
                                      function(evt) {thisObj.processKeyUp(evt); },
                                      false));

	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,
									  "click",
									  function(evt) {thisObj.processClick(evt); },
									  false));

	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,
                                      "mousedown",
                                      function(evt) { tm._handleComponentClick(thisObj,evt); },
                                      false));

    // Paste and Drop handlers - only required for SP1 versions of XP
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document.body,
                                      "paste",
                                      function(evt) { thisObj.processPaste(evt); },
                                      false));
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document.body,
                                      "drop",
                                      function(evt) { thisObj.processPaste(evt); },
                                      false));

	// Prevent F1 key press activating browser help
	this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,
                                      "help",
                                      function() { return false; },
                                      false));
};

/*
 *  Sets in initial HTML which has been loaded by the user (the template).
 */
WordProcessingGUIAdaptor.prototype.setInitialState = function ()
{
    try
    {
        var fckEd = this.getFCKEditor();
        this.m_initialHTML = fckEd.GetData();
        this.m_setHTMLCounter = 0;
    }
    catch(exception)
    {
        //Every so often you get a permission denied error
        this.m_setHTMLCounter++;
        if(this.m_setHTMLCounter <= 5)
        {
            var thisObj = this;
            setTimeout(function() {thisObj.setInitialState();}, 100);
        }
    }
};

/*
 *  Checks whether the user has edited the HT
 */
WordProcessingGUIAdaptor.prototype.hasContentChanged = function ()
{
    return (this.m_initialHTML != this.getHTML());
};

/*
 *  Stops the propagation of the current event
 */
WordProcessingGUIAdaptor.prototype.stopPropagationHandler = function(e)
{
		SUPSEvent.stopPropagation(e);		// Prevent the event from propograting any further up the DOM
        return false;
};

/*
 * Removes all event handlers defined in m_eventHandlerKeys
 * then reinitialises that array.
 */
WordProcessingGUIAdaptor.prototype.stopEventHandlers = function()
{
	for(var i=0; i < this.m_eventHandlerKeys.length; i++)
	{
		SUPSEvent.removeEventHandlerKey(this.m_eventHandlerKeys[i]);
	}

	this.m_eventHandlerKeys = new Array();
};

/*
 * Intercepts a keydown event so as to remember the current selection
 * (hitting tab appears to disturb the selection, so the selection must
 *  be remembered before a tab key is hit)
 * If the key is a tab then insert 4 spaces and move the focus back to
 * this element.
 */
WordProcessingGUIAdaptor.prototype.processKeyDown = function(e)
{
	if(null == e)
	{
		e = window.event;
	}

    // Due to bug in IE - need to stop key events hitting the
    // span in question (even though they should be ignored
    // due to contenteditable="false"
    if (e.srcElement.className == "SUPSVAR" || e.srcElement.className == "SUPSVAR_NONEDITABLE")
    {
        WordProcessingGUIAdaptor.m_logger.info("className is: " + e.srcElement.className);
        SUPSEvent.stopPropagation(e);
        return false;
    }

	if(e.keyCode == Key.Tab.m_keyCode)
	{
		// If a tab character just insert 4 spaces.
		var fckEd = this.getFCKEditor();
		this.focus();
		fckEd.InsertHtml("&nbsp;&nbsp;&nbsp;&nbsp;");

		// Get the new range
        this.setRange();

		// Move the focus back to the element (the tab key may move it off at some point)
		var thisObj = this;
		setTimeout(function(){thisObj.focus(); }, 5);
	}
    else
	{
		// If normal key press then get the range just after the key
		// has been pressed.
		// Comment out as testing key up replacement
		//var thisObj = this;
		//setTimeout(function(){thisObj.setRange()}, 200);
	}

	// Backspace key is usually blocked if the HTML element cannot absorb the backspace key.
	// In the FCK Editor's case it can but the HTMLView._canAcceptBackspaceKeyEvents blocks
	// it because the node name is BODY
	if(e.keyCode != Key.Backspace.m_keyCode)
	{
	    // If Alt key is pressed in W3C use 'keyCode' property otherwise 'which'
	    var keyCode = (HTMLView.isIE || e.altKey) ? e.keyCode : e.which;

		// Prevent default keybindings actions in the editor document
    	if(e.altKey ||
    	   HTMLView._isFunctionKey(keyCode) ||
    	   e.ctrlKey && (Key.CHAR_F.m_keyCode == keyCode || Key.CHAR_f.m_keyCode == keyCode ||
				  		 Key.CHAR_R.m_keyCode == keyCode || Key.CHAR_r.m_keyCode == keyCode ||
						 Key.CHAR_O.m_keyCode == keyCode || Key.CHAR_o.m_keyCode == keyCode ||
						 Key.CHAR_L.m_keyCode == keyCode || Key.CHAR_l.m_keyCode == keyCode ||
						 Key.CHAR_N.m_keyCode == keyCode || Key.CHAR_n.m_keyCode == keyCode ||
						 Key.CHAR_W.m_keyCode == keyCode || Key.CHAR_w.m_keyCode == keyCode ||
						 Key.CHAR_P.m_keyCode == keyCode || Key.CHAR_p.m_keyCode == keyCode ||
						 Key.CHAR_E.m_keyCode == keyCode || Key.CHAR_e.m_keyCode == keyCode ||
						 Key.CHAR_H.m_keyCode == keyCode || Key.CHAR_h.m_keyCode == keyCode))
    	{
    		return HTMLView._cancelKeyPress(e);
    	}
    }

	// Prevent the event from propograting any further up the DOM
	SUPSEvent.stopPropagation(e);
};

/**
 * Modification method for all keys except Tab record selection
 * on key up event. Attempt to remove dependency on time out
 * associated with key down event handler.
 *
*/
WordProcessingGUIAdaptor.prototype.processKeyUp = function(e)
{
    if(null == e)
    {
        e = window.event;
    }

    // Stop events hitting special span
    if (e.srcElement.className == "SUPSVAR" || e.srcElement.className == "SUPSVAR_NONEDITABLE")
    {
        WordProcessingGUIAdaptor.m_logger.info("className is: " + e.srcElement.className);
        SUPSEvent.stopPropagation(e);
        return false;
    }

    if(e.keyCode != Key.Tab.m_keyCode)
    {
        // Define current selection
        this.setRange();
    }

    SUPSEvent.stopPropagation(e);
};

/*
 * Sets the range of the currently selected text in the WordProcessingGUIAdaptor
 *
 */
WordProcessingGUIAdaptor.prototype.setRange = function()
{
    this.checkEditableIFrame();
	var selection = this.m_editableIframe.contentWindow.document.selection;
	this.m_textSelectRange = selection.createRange();
};


/*
 * Handler for a click, simply need to remember the current selection
 */
WordProcessingGUIAdaptor.prototype.processClick = function(e)
{
	if(null == e)
	{
		e = window.event;
	}
    // Another hack to get around flaky IE functionality where it sometimes
    // seems to ignore the onkeydown handler when the user repeatedly
    // clicks on the element - leading to characters being inserted
    // into the span.
    if (e.srcElement.className == "SUPSVAR_NONEDITABLE")
    {
        Services.showAlert("This variable type cannot be edited.");
        this.focus();
    }
    else
    {
	   this.setRange();
    }
};

/*
 * This function (hack) is required by SP1 version of XP - where IE
 * doesn't refresh properly after a paste event. Adding
 * an empty string to the page forces a refresh under most
 * conditions.
 *
 * Only needed when the object is a textrange. (the collapse
 * is there to stop the InsertHtml deleting the newly
 * pasted item.
 */
WordProcessingGUIAdaptor.prototype.processPaste = function()
{
	var fckEd = this.getFCKEditor();
	var thisObj = this;
	setTimeout(function(){
                          var selection = fckEd.EditorDocument.selection;
                          if (selection.type == "Control")
                          {
                              return;
                          }
                          thisObj.m_textSelectRange = selection.createRange();
                          thisObj.m_textSelectRange.collapse(false);
                          thisObj.focus();
                          fckEd.InsertHtml("");},
               10);
};

WordProcessingGUIAdaptor.prototype._dispose = function()
{
	if(null != this.m_invoke)
	{
		this.m_invoke.dispose();
		this.m_invoke = null;
	}

	this.stopEventHandlers();
	delete this.m_eventHandlerKeys;
	this.m_eventHandlerKeys = null;

	// Remove main iframe content window configuration
	var configObj = this.m_mainIframe.contentWindow.FCKConfig;
	var i, j, l;

	// Remove plugins
	for(i = 0, l = configObj.Plugins.Items.length; i < l; i++)
	{
		delete configObj.Plugins.Items[i];
	}
	configObj.Plugins.Items = null;

	// Remove toolbar sets
	for(i in configObj.ToolbarSets)
	{
		for(j = 0, l = configObj.ToolbarSets[i].length; j < l; j++)
		{
			delete configObj.ToolbarSets[i][j];
		}
		configObj.ToolbarSets[i] = null;
	}
	configObj.ToolbarSets = null;

	// Remove the rest of the configuration from the main iframe content window
	for(i in configObj)
	{
		delete configObj[i];
	}
	configObj = null;

	// Remove the FCK editor object
	var fckEd = this.getFCKEditor();

	for(i in fckEd)
	{
		delete fckEd[i];
	}
	fckEd = null;

	// Remove tool bar set
	delete this.m_toolBarSet;
	this.m_toolBarSet = null;

	// Remove GUI adaptor reference in iframe
	this.m_mainIframe.contentWindow.GUIAdaptorRef = null;

	// Remove main iframe
	this.m_mainIframe = null;

	// Remove editable iframe
	this.m_editableIframe = null;

	// Remove "enablement" image reference
	delete this.m_inactiveImage;
	this.m_inactiveImage = null;

	// Remove text select range
	delete this.m_textSelectRange;
	this.m_textSelectRange = null;
};

/*
 *  Retrieve the XHTML document fragment.
 */
WordProcessingGUIAdaptor.prototype.getHTML = function()
{
	var fckEd = this.getFCKEditor();

    return fckEd.GetData();
};

/*
 *  Set the XHTML document fragment to be edited.
 */
WordProcessingGUIAdaptor.prototype.setHTML = function(html)
{
	this.stopEventHandlers();

	// De-select text range as old selection is no longer valid.
	this.m_textSelectRange = null;

	var fckEd = this.getFCKEditor();
    fckEd.SetData(html, true);
    if(html != "")
    {
        var thisObj = this;
        if(!this.replacingContent)
        {
            setTimeout(function() {thisObj.setInitialState();}, 300);
            // Re-apply framework style sheet
            this.replacingContent = true;
        }
        this.m_editableIframe = null;
        
        this.checkEditableIFrame();
        
        this.addCSSToDocument();

        this.startEventHandlers();
    }
};

/*
 * Used by the databinding protocol to find out the displayValue.
 */
WordProcessingGUIAdaptor.prototype._getValueFromView = function()
{
	return this.getHTML();
};

/*
 * Render the wordprocessor - including set the focus if
 * required.
 * If the focus has changed the datamodel will be informed
 * via update().
 */
WordProcessingGUIAdaptor.prototype.renderState = function()
{
    // Another ugly "need to check if FCKEditor is ready"
    // part of the code. (renderstate is called during
    // initialisation - sometimes before the editor is
    // loaded / setup.  The issue is with the call to
    // getHTML - which then calls GetData
    if (!this.checkFCKEditorReady("GetData", "renderState"))
    {
        return;
    }

	if (this.m_valueChanged)
	{
		this.m_valueChanged = false;

		// If nothing has changed don't set the value as this
		// destroys our focus information.(value changed is
		// in the context of the datamodel - whereas the m_value
		// of the wordprocessor may already be up to date)
		if (this.getHTML() != this.m_value)
		{
			this.setHTML(this.m_value);
		}
	}

	// Actions to take if fields focus state changes.
	if(this.m_focusChanged)
	{
		// Reset this immediately so that we don't end up recursing through this again
		this.m_focusChanged = false;

		if(this.m_focus)
		{
			this.focus();
		}
		else
		{
			this.update();
		}
	}

	// Render for enablement and activity as appropriate.
	if((this.supportsProtocol("EnablementProtocol") && !this.getEnabled())
	    || (this.supportsProtocol("ActiveProtocol") && !this.isActive()))
	{
		this.m_inactiveImage.style.visibility = "visible";
	}
	else
	{
		this.m_inactiveImage.style.visibility = "hidden";
	}
};

/*
 * Sets the focus to the previous selection (if there
 * was one - otherwise just focuses the element
 */
WordProcessingGUIAdaptor.prototype.focus = function()
{
	// If there was a previous selection select it again.
	if (this.m_textSelectRange)
	{
		this.m_textSelectRange.select();
	}
	else
	{
        // This is a bit tricky as the editor may not be
        // initialised yet - and sometimes the code for it
        // is not even loaded - best to check, and if it
        // is not try again a while later.
        if (this.checkFCKEditorReady("Focus", "focus")){
    		this.getFCKEditor().Focus();
        }
	}
};

/**
 * This method is checks whether the code for the FCKEditor has been loaded
 * by the browser, and then also checks to see if the method in question
 * exists.
 * If not ready, then the method defined in the callback will be called again
 * using a timeout
 *
 * @param method - is a string with the name of the method on the FCKEditor to be called.
 * @param callbackMethod - is a string of the name of the method on the WordProcessingGUIAdaptor
 *                         to be called if the editor is not yet ready.
 */
WordProcessingGUIAdaptor.prototype.checkFCKEditorReady = function(method, callbackMethod)
{
    if (window.FCKeditorAPI !== undefined && this.getFCKEditor()[method]){
        return true;
    }
    else
    {
        var thisObj = this;
        // Wait a decent chunk of time to let the FCKEditor load itself.
        // Waiting less is a bit dangerous as the function may exist, but
        // other internal variables have not been set up yet.
        setTimeout(function(){thisObj[callbackMethod]();},1500);
        return false;
    }
};

/*
 * Returns an instance of the FCKEditor object
 */
WordProcessingGUIAdaptor.prototype.getFCKEditor = function()
{
	return FCKeditorAPI.GetInstance(this.getId() + "_wordprocessor");
};

WordProcessingGUIAdaptor.prototype.setConfig = function(configItem, newValue)
{
	oFCKeditor.Config[ configItem ] = newValue;
};

/**
 * Method sets value of flag indicating whether, or not,
 * the associated instance of FCKeditor has loaded completely.
 *
*/
WordProcessingGUIAdaptor.prototype.setFCKeditorLoadComplete = function(value)
{
    this.m_FCKeditorLoadComplete = value;
};

/**
 * Method returns value of flag indicating whether, or not, the
 * associated instance of FCKeditor has loaded completely.
 *
*/
WordProcessingGUIAdaptor.prototype.getFCKeditorLoadComplete = function()
{
    return this.m_FCKeditorLoadComplete;
};

// Callback functions invoked from the plugins on the
// wordprocessor.

/*
 * Invoke JSpellcheck
 */
WordProcessingGUIAdaptor.prototype.doSpellCheck = function()
{
	// process config to get the label for the JSpell dictionary:
    var ac = Services.getAppController();
    var appConfig = ac.m_config;
    var courtXPath = appConfig.getSpellCheckCourtXPath();
    var dictionaryLabel = appConfig.getSpellCheckDictionaryLabel();
    var actualLabel = dictionaryLabel;
    if (dictionaryLabel != null && courtXPath != null)
    {
        if (Services.hasValue(courtXPath))
        {
            var courtId = Services.getValue(courtXPath);
            if (courtId != null)
            {
                actualLabel = dictionaryLabel.replace("${court}", courtId);
            }
        }
    }
    if (actualLabel == null)
    {
        actualLabel = "English (US)"; // dont have a UK dictionary yet ...
    }

    this.checkEditableIFrame();
	parent.ActionSpellCheck(this.m_editableIframe.contentWindow, actualLabel);
};

/*
 * Invoke custom save action
 */
WordProcessingGUIAdaptor.prototype.doSave = function()
{
	this.m_saveAction();
};

/*
 * Invoke preview action
 */
WordProcessingGUIAdaptor.prototype.doPreview = function()
{
	this.m_previewAction();
};

/*
 * Invoke print action
 */
WordProcessingGUIAdaptor.prototype.doPrint = function()
{
	this.m_printAction();
};

/*
 * Add in "contenteditable=false" to all spans of class SUPSVAR
 */
WordProcessingGUIAdaptor.prototype.transformToDisplay = function(modelValue)
{
    if (modelValue == null)
    {
        return null;
    }

    var regexStr = "< *span *class *= *\"SUPSVAR([^\"]*)\"";
    var regex = new RegExp(regexStr,"g");
    return modelValue.replace(regex, "<span class=\"SUPSVAR$1\" contenteditable=\"false\"" );
};

/*
 * Strip all "contenteditable=false" string.
 */
WordProcessingGUIAdaptor.prototype.transformToModel = function(displayValue)
{
    if (displayValue == null)
    {
        return null;
    }

    var regexStr = " contenteditable=\"?false\"?";
    var regex = new RegExp(regexStr,"g");
    return displayValue.replace(regex, "");
};

/**
 * General function invoked by FCKeditor when loading of
 * an instance of the word processor is complete.
 *
*/
function FCKeditor_OnComplete( editorInstance )
{

    var wordProcessingGUIAdaptorEditorInstanceName = null;

    var instanceName = editorInstance.Name;

    // Retrieve array of word processing GUI adaptors
    // from FormController.
    var wordProcessingGUIAdaptors = FormController.getInstance().getWordProcessingGUIAdaptors();

    for(var i = 0, l = wordProcessingGUIAdaptors.length; i < l; i++)
    {
        wordProcessingGUIAdaptorEditorInstanceName = wordProcessingGUIAdaptors[i].getId() + "_wordprocessor";

        if(wordProcessingGUIAdaptorEditorInstanceName == instanceName)
        {
            wordProcessingGUIAdaptors[i].setFCKeditorLoadComplete(true);
            break;
        }
    }
}