//==================================================================
//
// StyleManager.js
//
// Class which manages stylesheets in documents controlled by the
// Framework
//
//==================================================================


/**
 * StyleManager constructor
 *
 * @constructor
 */
function StyleManager()
{
}

StyleManager.m_logger = new Category("StyleManager");
StyleManager.FRAMEWORK_STYLESHEET_TITLE = "Default";
StyleManager.FRAMEWORK_STYLESHEET_ID = "FW_StyleSheet";


StyleManager.prototype.m_config = null;

StyleManager.prototype.m_currentStyle = "default";

StyleManager.prototype.m_documents = null;


/**
 * For IE scrollbars must register functions with style manager
 * that are invoked once the associated stylesheet has loaded.
*/
StyleManager.prototype.m_onLoadCallbackLists = null;


StyleManager.prototype.setConfiguration = function(config)
{
	this.m_config = config;
	
	this.m_currentStyle = config.getDefaultStyleSheetName();
	
	this.m_documents = new Array();
	
	this.m_onLoadCallbackLists = [];
}


StyleManager.prototype.dispose = function()
{
	// Dispose of all the callback lists.
	for(var i = 0; i < this.m_onLoadCallbackLists.length; i++)
	{
		var callBackListEntry = this.m_onLoadCallbackLists[i];
		callBackListEntry.document = null;
		callBackListEntry.callbackList.dispose();
		callBackListEntry.callbackList = null;
	}
    this.m_onLoadCallbackLists = null;


	// Dispose of all documents
	for(var i = 0; i < this.m_documents.length; i++)
	{
		this.m_documents[i].dispose();
	}
    this.m_documents = null;
}


StyleManager.prototype.registerOnLoadHandler = function(callbackListMethod, doc)
{
	// Check to see if there is a callback for the supplied document already
	var cbListEntry = null;
	for(var i = 0, l = this.m_onLoadCallbackLists.length; i < l; i++)
	{
		var cble = this.m_onLoadCallbackLists[i];
		
		if(cble.document == doc)
		{
			cbListEntry = cble;
			break;
		}
	}
	
	// If not then create a new entry for the document in the list of callbacks
	if(null == cbListEntry)
	{
		var cbListEntry = {
			document: doc,
			callbackList: new CallbackList()
		};
		
		this.m_onLoadCallbackLists.push(cbListEntry);
	}

	// Add a callback to list for the specified document
    cbListEntry.callbackList.addCallback(callbackListMethod);
}


StyleManager.prototype.unregisterOnLoadHandler = function(callbackListMethod, doc)
{
	// Check to see if there is a callback for the supplied document already
	var cbListEntry = null;
	for(var i = 0, l = this.m_onLoadCallbackLists.length; i < l; i++)
	{
		var cble = this.m_onLoadCallbackLists[i];
		
		if(cble.document == doc)
		{
			cbListEntry = cble;
			break;
		}
	}

	// If entry found for the specified document then remove the callback from the list	
	if(null != cbListEntry)
	{
		cbListEntry.callbackList.removeCallback(callbackListMethod);
	}
}


StyleManager.prototype._handleCSSLoaded = function(docEntry)
{
	var doc = docEntry.m_document;

	// Check to see if there is a callback for the supplied document
	for(var i = 0, l = this.m_onLoadCallbackLists.length; i < l; i++)
	{
		var cble = this.m_onLoadCallbackLists[i];
		
		if(cble.document == doc)
		{
			// Document found, so notify listeners interested in
			// hearing about stylesheet changes to this document.
			cble.callbackList.invoke();
			break;
		}
	}
}

	
StyleManager.prototype.setStyle = function(name)
{
	// If no name specified use "default"
	if(name == null)
	{
		name = "default";
	}
	
	var found = true;
	if(this.m_currentStyle != name)
	{
		this.m_currentStyle = name;
		
		found = false;
		var availableStyles = this.getAvailableStyles();
		for(var i = 0, l = availableStyles.length; i < l; i++)
		{
			if(availableStyles[i].getName() == name)
			{
				found = true;
				break;
			}
		}
		
		if(found)
		{
			for(var i = 0, l = this.m_documents.length; i < l; i++)
			{
				this.m_documents[i].applyStyleSheets(this.m_currentStyle);
			}
		}
	}
	
	return found;
}


StyleManager.prototype.getCurrentStyle = function()
{
	return this.m_currentStyle;
}


StyleManager.prototype.getAvailableStyles = function()
{
	return this.m_config.getAvailableStyleSheets();
}


StyleManager.prototype.registerDocument = function(doc, styleSheets)
{
	var docEntry = this.getDocumentEntry(doc);
	
	if(null != docEntry)
	{
		// Already in list
		if(StyleManager.m_logger.isWarn()) StyleManager.m_logger.warn("StyleManager.registerDocument(): Adding duplicate document with url: " + doc.URL);
	}
	else
	{
		if(StyleManager.m_logger.isDebug()) StyleManager.m_logger.debug("StyleManager.registerDocument(): Adding document with url: " + doc.URL);
		
		// Create a new StyleManagerDocEntry to maintain information about the document
		// and the stylesheets loaded on it.
		
		// Add the framework stylesheet to the list of stylesheets applied to a document
		var ac = Services.getAppController();
		var rootURL = ac.m_config.m_appBaseURL;
		
		var ss = [AppCSS.create(rootURL + "/fw_", true, true)];
		if(null != styleSheets)
		{
			ss = ss.concat(styleSheets);
		}
		var docEntry = new StyleManagerDocEntry(this, doc, ss);

		// Add document to list.
		this.m_documents.push(docEntry);
	
		// Set the current sheet on the newly registered document
		docEntry.applyStyleSheets(this.m_currentStyle);
	}

	if(StyleManager.m_logger.isDebug())
	{
		this._logRegisteredDocuments();
	}
}


StyleManager.prototype.unregisterDocument = function(doc)
{   
    var isIE = (navigator.appName == "Microsoft Internet Explorer");
    
	var newArray = new Array();
	var count = 0;

	// Can't simply delete an item from an array to remove it,
	// as this leaves the array length unchanged (!). Instead
	// we need to create a new array, and copy all elements from
	// the old array to the new one, ignoring the entry to be
	// ignored.
	for(var i = 0, l = this.m_documents.length; i < l; i++)
	{
		if(this.m_documents[i].m_document != doc)
		{
			newArray[count++] = this.m_documents[i];
		}
		else
		{
			// Dispose of the document when we find it in the list
			this.m_documents[i].dispose();
		}
	}
	
	// Copy the new array over the old one.
	this.m_documents = newArray;

	if(StyleManager.m_logger.isDebug())
	{
		this._logRegisteredDocuments();
	}
}


StyleManager.prototype._logRegisteredDocuments = function()
{
	for(var i = 0, l = this.m_documents.length; i < l; i++)
	{
		var d = this.m_documents[i].m_document;
		StyleManager.m_logger.debug("StyleManager._logRegisteredDocuments(): Have document: " + (i + 1) + " of " + l);
		StyleManager.m_logger.debug("StyleManager._logRegisteredDocuments(): Have registered document with URL: " + null == d.URL ? "null" : d.URL);
	}
}


StyleManager.prototype.getDocumentEntry = function(document)
{
    var docEntry = null;
    
    for(var i = 0, l = this.m_documents.length; i < l; i++)
    {
        if(this.m_documents[i].m_document == document)
        {
            docEntry = this.m_documents[i];
            break;
        }
    }
    
    return docEntry;
}   




/**
 * Class StyleManagerDocEntry enables style sheet on load handlers
 * to be associated with documents managed by the StyleManager.
 *
 * @param manager reference to the StyleManager which created this
 *   StyleManagerDocEntry
 * @param doc the HTMLDocument registered with the StyleManager
 * @param styleSheets array of base URLs to additional stylesheets to be
 *    managed by the StyleManager (those which are colourscheme sensative)
 * @constructor
 */
function StyleManagerDocEntry(manager, doc, cssDefs)
{
	this.m_manager = manager;
	
    this.m_document = doc;
    
    this.m_styleSheets = new Array(cssDefs.length);

	for(var i = 0; i < cssDefs.length; i++)
	{
		var cssDef = cssDefs[i];
		this.m_styleSheets[i] = StyleManagerCSSEntry.create(
			this,
			cssDef.getBaseURL(),
			cssDef.getBrowserDependant(),
			cssDef.getColourSchemeDependant()
		);
	}
}


StyleManagerDocEntry.prototype.dispose = function()
{
	for(var i = 0, l = this.m_styleSheets.length; i < l; i++)
	{
		this.m_styleSheets[i].dispose();
	}
}


StyleManagerDocEntry.prototype.handleStyleSheetLoaded = function(cssEntry)
{
	var allLoaded = true;
	
	// Expect at most 2 or 3 stylesheets so this loop
	// isn't too expensive.
	for(var i = 0, l = this.m_styleSheets.length; i < l; i++)
	{
		var ss = this.m_styleSheets[i];
		if(ss == cssEntry)
		{
			ss.loaded = true;
		}
		
		if(true !== ss.loaded)
		{
			allLoaded = false;
		}	
	}
	
	if(allLoaded)
	{
		this.m_manager._handleCSSLoaded(this);
	}
}


StyleManagerDocEntry.prototype.applyStyleSheets = function(colourScheme)
{
	// Reset flag on stylesheet entries to indicate that they
	// are not loaded.
	for(var i = 0, l = this.m_styleSheets.length; i < l; i++)
	{
		var ss = this.m_styleSheets[i];
		ss.loaded = false;
	}
	
	// Start loading each stylesheet in turn
	for(var i = 0, l = this.m_styleSheets.length; i < l; i++)
	{
		var ss = this.m_styleSheets[i];
		ss.applyStyleSheet(colourScheme);
	}
}










function StyleManagerCSSEntry()
{
}


StyleManagerCSSEntry.m_logger = new Category("StyleManagerCSSEntry");

StyleManagerCSSEntry.prototype.m_baseURL = null;

StyleManagerCSSEntry.prototype.m_browserDependant = false;

StyleManagerCSSEntry.prototype.m_colourSchemeDependant = true;

StyleManagerCSSEntry.prototype.m_linkElement = null;

StyleManagerCSSEntry.prototype.m_onLoadHandlerKey = null;


StyleManagerCSSEntry.create = function(docEntry, baseURL, browserDependant, colourSchemeDependant)
{
	var css = new StyleManagerCSSEntry();
	
	css.m_docEntry = docEntry;
	css.m_baseURL = baseURL;
	css.m_browserDependant = browserDependant;
	css.m_colourSchemeDependant = colourSchemeDependant;
	
	return css;
}


StyleManagerCSSEntry.prototype.dispose = function()
{
	if(null != this.m_onLoadHandlerKey)
	{
		SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);
		this.m_onLoadHandlerKey = null;
	}
}


StyleManagerCSSEntry.prototype._getURL = function(colourScheme)
{
	var styleSheetURL = this.m_baseURL;
	
	if(this.m_browserDependant)
	{
		var isIE = (navigator.appName == "Microsoft Internet Explorer");
		var styleSheetURL = styleSheetURL + (isIE ? "IE" : "Moz");
	}
	
	if(this.m_colourSchemeDependant && colourScheme != null)
	{
		// If no stylesheet name supplied, then default to old stylesheet name for backwards compatibility
		styleSheetURL += ("_" + colourScheme);
	}

	// Complete the stylesheet url
	styleSheetURL += ".css";
	
	return styleSheetURL;
}


StyleManagerCSSEntry.prototype.isColourSchemeDependant = function()
{
	return this.m_colourSchemeDependant;
}


StyleManagerCSSEntry.prototype.applyStyleSheet = function(colourScheme)
{
	var d = this.m_docEntry.m_document;

	var headElement = GUIUtils.getDocumentHeadElement(d);

	var url = this._getURL(colourScheme);

	if(null == this.m_linkElement)
	{
		// Document doesn't contain stylesheet so create the link element to include it
		if(StyleManagerCSSEntry.m_logger.isDebug()) StyleManagerCSSEntry.m_logger.debug("StyleManager.applyStyleSheet(): Creating new stylesheet link for document with URL: '" + d.URL + "' with href: '"  + url + "'");

		this.m_linkElement = GUIUtils.createStyleLinkElement(headElement, url, null);

		// If we are running in IE, then add an onload handler to the link element,
		// so we can notify the StyleManagerDocEntry when all the stylesheet has loaded.
		// On other browsers that don't support onload handlers on link elements,
		// the _handleOnLoadEvent is simply invoked as soon as the link element's
		// src attribute has been set.
		if(HTMLView.isIE)
		{
		    // Add event hanlder to link element
		    var thisObj = this;
		    this.m_onLoadHandlerKey = SUPSEvent.addEventHandler(this.m_linkElement, "load", function() {thisObj._handleOnLoadEvent();} );
		}
	}
	else
	{
		if(StyleManagerCSSEntry.m_logger.isDebug()) StyleManagerCSSEntry.m_logger.debug("StyleManagerCSSEntry.applyStyleSheet(): Updating stylesheet link for document with URL: '" + d.URL + "' with href: '" + url + "'");
		// Document already contains the LINK element to the framework stylesheet, so just update
		// href attribute of the LINK element to load the new stylesheet.
		this.m_linkElement.setAttribute("href", url);
	}

	// Invoke handleOnLoadEvent immediately on none IE browsers,
	// as only IE supports onload handlers 
	if(!HTMLView.isIE)
	{
		this._handleOnLoadEvent();
	}
}


StyleManagerCSSEntry.prototype._handleOnLoadEvent = function()
{
	// Notify the parent StyleManagerDocEntry that loading of the stylesheet has completed.
	this.m_docEntry.handleStyleSheetLoaded(this);
}
