// Facade containing all services available to client side code


function Services()
{
}


Services.getAppController = function()
{
	return top.AppController.getInstance();
}

/**
 * Check to see if the user has access to the named form.
 * @param formName the form name as specified in appconfig.xml
 * @return boolean true meaning the user does have permissions to access this form.
 */
Services.hasAccessToForm = function(formName)
{
	var form = Services.getAppController().m_config.getForm(formName);
	return Services.getAppController().m_securityContext.hasAccess(form.getRoles());
}

/**
 * Check to see if the user has access to an array of specified roles. This can be used
 * in user-defined isReadOnly methods to take into account role hierarchies.
 * @param formName the form name as specified in appconfig.xml
 * @return boolean true meaning the user does have permissions to access this form.
 */
Services.hasAccessToRoles = function(requiredRoles)
{
	return Services.getAppController().m_securityContext.hasAccess(requiredRoles);
}

/**
 * Call Server Side service
 * The handler is an object which is called to process callbacks resulting
 * from this service call. The onSuccess method is called when the service
 * returns without error. This method must be implemented. The handler
 * object may also implement a number of exception handlers, onXXX where XXX
 * is the name of the exception being handled. The most specific exception 
 * handler implemented will be called. If no method exists for the specific
 * exception being thrown, the exception class hierarchy is traversed with the
 * most specialist exception handler that is implemented being called.
 * Exception handlers are optional. When none are defined, the framework
 * default handler will be executed.
 * This method will only throw an exception if the handler object passed in
 * cannot be used for communication (i.e. it does not implement onSuccess)
 * @param mappingName name of the mapping of the service within this form
 * @param parameters the parameters required by the service
 * @param handler Object which implements onSuccess and onXXX where XXX is an exception methods
 * @param async boolean flag whether or not services are asyncronous
 * @param showProgress boolean flag whether or not to show the progress bar
 */
Services.callService = function(mappingName, parameters, handler, async, showProgress)
{
	var _async = (null == async) ? true : async;
	var _showProgress = (null == showProgress) ? true : showProgress;
    var ds = fwServiceCallDataLoader.create(mappingName, parameters, handler, _async, _showProgress);    
    ds.load(); 
}


/**
 * Login to the application.
 * This method must be called before any server side services may be used.
 */
Services.login = function(handler, username, password)
{	
    var config = new Object();
    config.handler = handler;
    config.username = username;
    config.password = password;
    config.async = true;
    var ds = fwLoginDataLoader.create(config);
    
    ds.load(); 
}


/**
 * Logoff - Logs the current user off and clears the securityContext. The form
 * parameter is an optional parameter to determine which form should be navigated to
 * after logging off.
 *
 */
Services.logoff = function(formName, raiseWarningIfDOMDirty)
{
	Services.getAppController().logoff(formName, raiseWarningIfDOMDirty) ;
}


/**
 * Sets the focus to the specified adaptor. If null is supplied or
 * the adaptor id is not found in the form, then the first field is
 * focussed. If the adaptor is not capable of accepting focus then
 * the next available adaptor will receive focus.
 *
 * @param adaptorId the id of the adaptor to attempt to set focus on
 */
Services.setFocus = function(adaptorId)
{
	var fc = FormController.getInstance();
	var adaptor = null;

	if(adaptorId != null)
	{
		adaptor = fc.getAdaptorById(adaptorId);
	}
	
	var tm = fc.getTabbingManager();
	tm.setFocusOnAdaptor(adaptor) ;
}


/**
 * Navigate to a new page
 *
 * @param formName name of the form to load, as defined in the application
 *  configuration xml file.
 * @param raiseWarningIfDOMDirty Optional Boolean flag indicating whether, or not,
 *                               a warning dialog should be raised if the client side DOM
 *                               is dirty.
 */
Services.navigate = function( formName, raiseWarningIfDOMDirty )
{
    // By default raise warning if DOM is dirty
    if(false != raiseWarningIfDOMDirty)
    {
        raiseWarningIfDOMDirty = true;
    }
    
    // Dispatch navigate event
	var fc = FormController.getInstance();
	var adaptor = fc.getFormAdaptor();
	
	// Define event details
	var details = new Object();
	
	details[ "formName" ] = formName;
	details[ "raiseWarningIfDOMDirty" ] = raiseWarningIfDOMDirty;

	Services.dispatchEvent(adaptor.getId(),
                           BusinessLifeCycleEvents.EVENT_NAVIGATE, 
                           details);
}


/**
 * Set the value of a node in the Data Model
 *
 * @param xp the path of the node whose value to set
 * @param v the value
 */
Services.setValue = function(xp, v)
{
	/*("Services_setValue")*/
	var dm = FormController.getInstance().getDataModel();
	var changed = dm.setValue(xp, v);
	/*("Services_setValue")*/
	
	return changed ;
}


/**
 * Get the value of a node in the Data Model
 *
 * @param xp the path of the node whose value to get
 */
Services.getValue = function(xp)
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm.getValue(xp);
}


/**
 * Removes a node in the Data Model
 *
 * @param xp the path of the node whose value to remove
 */
Services.removeNode = function(xp)
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm.removeNode(xp);
}


/**
 * Adds a node set into the Data Model
 *
 * @param toXPath the xpath to copy the nodes to
 * @param fromDom the dom to copy the nodeset from
 */
Services.addNode = function(fromDom,toXPath)
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm.addNodeSet(fromDom, toXPath);
}


/**
 * Replaces a node in the Data Model
 *
 * @param xp the xpath in the dom to overwrite the existing nodes
 * @param node the dom to copy the nodeset from
 */
Services.replaceNode = function(xp, node)
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm.replaceNode(xp, node);
}


/**
 * Starts a transaction in the Data Model
 *
 * @param xp the xpath in the dom to overwrite the existing nodes
 * @param node the dom to copy the nodeset from
 */
Services.startTransaction = function()
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm._startTransaction();
}


/**
 * Ends a transaction in the Data Model
 *
 * @param xp the xpath in the dom to overwrite the existing nodes
 * @param node the dom to copy the nodeset from
 */
Services.endTransaction = function()
{
	var dm = FormController.getInstance().getDataModel();
	
	return dm._endTransaction();
}


/**
 * Check if a node exists
 *
 * @param xp the xpath of the node to check for existance
 */
Services.exists = function(xp)
{
	var dm = FormController.getInstance().getDataModel();
	return dm.exists(xp);
}


/**
 * Returns the number of nodes selected by the XPath
 *
 * @param xp the xpath of the nodes to count
 * @return the number of nodes selected by the XPath
 * @type Integer
 */
Services.countNodes = function(xp)
{
	var dm = FormController.getInstance().getDataModel();
	return dm.countNodes(xp);
}


/**
 * Returns a cloned node from selected by the XPath
 */
Services.getNode = function(xp)
{
	var dm = FormController.getInstance().getDataModel() ;
	return dm.getNode(xp);
}


/**
 * Returns a cloned set of nodes from selected by the XPath
 */
Services.getNodes = function(xp)
{
	var dm = FormController.getInstance().getDataModel() ;
	return dm.getNodes(xp);
}


/**
 * Check if a node has a value or not
 */
Services.hasValue = function(xpath)
{
	var dm = FormController.getInstance().getDataModel();
	return dm.hasValue(xpath);	
}


/**
 * Dispatch a Business Life Cycle Event to a GUI Adaptor
 *
 * @param id the id of the GUIAdaptor to send the event to
 * @param type the type of event to dispatch
 * @param detail additional detail object required by the particular event type. May be null.
 */
Services.dispatchEvent = function(id, type, detail)
{
	FormController.getInstance().dispatchBusinessLifeCycleEvent(id, type, detail);
}

/**
 * Set a transient message in the status bar.
 */
Services.setTransientStatusBarMessage = function(message)
{
	var fc = FormController.getInstance() ;
	var formAdaptor = fc.getFormAdaptor();
	formAdaptor.setTransientMessage(message);
}


/**
 * Gets the adaptor given it's id. Will return null if no such adaptor is found
 *
 * @param id the adaptor of the adaptor to retrieve
 * @return the adaptor corresponding to the id
 */
Services.getAdaptorById = function(id)
{
	return FormController.getInstance().getAdaptorById(id);
}


/**
 * Displays one of the framework standard dialogs
 *
 * @param type the type of dialog to display, based on one of the values
 * in ServicesContants.js
 * @param callback the function to invoke to handle the user response to
 * the dialog. Function must accept a single argument which indicates which
 * option the user selected. This is dependant on the type of dialog which
 * was raised.
 * @param message the text message to display in the dialog
 * @param title the text to place in the title bar of the popup
 * @param width the width of the popup (optional, default = 500px)
 * @param top the popup's top left y position (optional, default = center in the forms's iframe)
 * @param left the popup's top left x position (optional, default = center in the forms's iframe)
 */
Services.showDialog = function(type, callback, message, title, width, top, left)
{
	StandardDialogManager.showDialog(type, callback, message, title, width, top, left);
}

Services.getEditorURL = function(){
    return Services.getAppController().m_config.getEditorURL();
}
Services.getSpellCheckURL = function(){
    return Services.getAppController().m_config.getSpellCheckURL();
}
Services.getSpellCheckPopup = function(){
    return Services.getAppController().m_config.getSpellCheckPopup();
}

/**
 * Displays a document from the Content Servlet with the specified Id.
 *
 * @param reportName The name of the report.
 * @param id The document id.
 * @param screenX The x co-ordinate of the report window (optional, default = 100)
 * @param screenY The y co-ordinate of the report window (optional, default = 60)
 * @param width   The width of the report window (optional, default = 800)
 * @param height  The height of the report window (optional, default = 600)
 */
Services.showDocument = function(reportName, id, screenX, screenY, width, height)
{
	var ac = Services.getAppController();

	var screenX = screenX != null ? screenX : 100;
	var screenY = screenY != null ? screenY : 60;
	var width = width != null ? width : 800;
	var height = height != null ? height : 600;

	//var SERVLET = "/sups/ContentServlet";
	var SERVLET = ac.m_config.getServiceBaseURL() + "_invoker/InvokerServlet";
	var USER_PARAM = "?user=";
	var MAC_PARAM = "&mac=";
	var DOCUMENTID_PARAM = "&DocumentId=";
	var CONTENT_REQUEST = "&content=document";
	
	var securityContext = ac.m_securityContext;
	var username = securityContext.getCurrentUser().getUserName();
	var mac = securityContext.generateMac(id);

	var urlArr = new Array();
	urlArr.push(SERVLET);
	urlArr.push(USER_PARAM);
	urlArr.push(username);
	urlArr.push(CONTENT_REQUEST);
	urlArr.push(MAC_PARAM);
	urlArr.push(mac);
	urlArr.push(DOCUMENTID_PARAM);
	urlArr.push(id);

	var url = urlArr.join("");
	
	var featureArr = new Array();
	featureArr.push("left="+screenX);
	featureArr.push("top="+screenY);
	featureArr.push("screenX="+screenX);
	featureArr.push("screenY="+screenY);
	featureArr.push("width="+width);
	featureArr.push("height="+height);
	featureArr.push("resizable=yes");
	
	var feature = featureArr.join(",");

	window.open(url, reportName, feature);

}

/**
 * Get the linkId of the user that is currently logged in.
 *
 * @return The link id of the user.
 */
Services.getCurrentUser = function()
{
	return Services.getAppController().m_securityContext.getCurrentUser().getUserName();
}

/*
 * Work around for XPath parsing issues with ' and " together.
 * String is parsed and built into an XPath concat function call.
 * i.e. string a" is converted to concat("a",'"').
 * Example usage:
 * "/ds/var/app/grid/row[id=" + Services.xPathToConcat("a\"") + "]"
 *
 * @return Concatenated string
 */
Services.xPathToConcat = function(s)
{
    if (s == null || s == "")
    {
 		return "\"\"";
    }

    var c;
    var cs = "concat(\"\"";
    var ci = 0;

	for (var i = 0, l = s.length; i < l; i++)
	{
		c = s.charAt(i);

		if (c == '"')
		{
			cs = cs.concat(",'" + s.substring(ci, i + 1) + "'");
			ci = i + 1;
		}
		else if (c == "'")
		{
			cs = cs.concat(',"' + s.substring(ci, i + 1) + '"');
			ci = i + 1;
		}
	}

	return cs.concat(',"' + s.substring(ci) + '")');
}

/**
 * Compares two string values to determine whether they are 
 * equivelent or not. null and the empty string are treated as being
 * equivelent.
 *
 * @param a the first value to compare
 * @param b the second value to compare
 * @return true if the values are equal and false otherwise
 */
Services.compareStringValues = function(a, b)
{
	return ((a == null || a == "") && (b == null || b == "")) ? true :  a == b;
}

/**
 * Define global variable used to store DOM objects (usually
 * files) retrieved from server.
 *
 * Note that for forms in the application iframe this variable
 * will be refreshed for each new form. However, the main 
 * application window will hold a copy of this
 * array throughout it's execution. This should not be
 * a problem though as few files are downloaded in this
 * context.
*/

var XMLDOMRequestQueue = new Array();

/**
 * Retrieve XML file from server using XMLHttpServiceRequest. This method
 * may be invoked in one of two ways. In the simple case the method takes
 * one argument only, the url of the file to be downloaded from the server.
 * In this case the DOM containing the file's contents is returned by the
 * method. For example,
 *
 * var dom = Services.loadDOMFromURL( "Data.xml" );
 *
 * In the complex case the method requires at least two arguments; the url of the file
 * and a handler object with at least the onSuccess handler defined. The method
 * call may also indicate whether to use an asynchronous or synchronous HTTP
 * GET method call and whether or not the progress bar should be displayed. 
 * The onSuccess handler method should have two arguments, namely "dom" and
 * "name". The argument "dom" will contain the XML document downloaded from
 * the server. The handler method should load this dom into the client side data model.
 * The second parameter is a name associated with the url retrieval, probably,
 * the URL itself. This is more commonly required by the error handling methods.
 * The onSuccess handler may safely ignore this argument.
 * 
 * In the case of the simple method call a synchronous GET method call is used and
 * the progress bar is not displayed.
 *
 * Definition of all method arguments
 *
 * @param url             The URL of the file to be downloaded. URL may be relative.
 * @param callbackHandler Javascript object with at least onSuccess method
 *                        as property. Generally, the onSuccess method will
 *                        populate the client side data model as in the example 
 *                        below:
 *
 *                        var handler = new Object();
 *                         
 *                        handler.onSuccess = function( dom, name )
 *                                            {
 *                                                var node = Services.getNode( "/ds/model" );
 *
 *                                                if(null == node)
 *                                                {
 *                                                    Services.addNode( dom, "/ds/model" );
 *                                                }
 *                                                else
 *                                                {
 *                                                    Services.replaceNode( "/ds/model/data", dom );
 *                                                }
 *                                                          
 *                                                dom = null;
 *                                            }
 *
 *
 *                         Additional methods may be defined to handle general error conditions
 *                         and explicit exceptions.
 * 
 * @param async            Specifies whether or not Http "Get" method call to retrieve file is asynchronous.
 *                         If parameter value "true" or not defined an asynchronous "Get" will be used.
 * @param showProgress     Specifies whether or not progress bar is displayed during retrieval
 *                         of file. If parameter value "true" or not defined the progress bar will be
 *                         displayed.
*/
Services.loadDOMFromURL = function( url, callbackHandler, async, showProgress )
{
    var _async;
    var _showProgress;
    
    if(arguments.length == 1)
    {
        // Method called with url argument defined only
        
        // Make download synchronous
        _async = false;
        _showProgress = false;
        
        // Create object to store returned DOM
        var index;
        var domInfo = new Object();
        
        index = XMLDOMRequestQueue.length;
        XMLDOMRequestQueue.push(domInfo);
        
        // Define onSuccess handler for url retrieval
        var defaultHandler = new Object();
        
        defaultHandler.onSuccess = function( dom, name )
        {
            // onSuccess method creates closure on variable index
            if(null != XMLDOMRequestQueue[index])
            {
                XMLDOMRequestQueue[index]["DOM"] = dom;
            }
        }
        
        // Re-invoke method using full argument list
        Services.loadDOMFromURL( url, defaultHandler, _async, _showProgress );
        
        // Retrieve dom from queue. Note that this code will not
        // execute until the method call and onSuccess handler
        // have been invoked.
        var dom = null;
        
        if(null != XMLDOMRequestQueue[index])
        {
            dom = XMLDOMRequestQueue[index]["DOM"];
        
            // Clear reference to DOM object in closure object
            XMLDOMRequestQueue[index]["DOM"] = null;
            XMLDOMRequestQueue[index] = null;
        }
        
        domInfo = null;
        
        return dom;
        
    }
    else if(arguments.length > 1)
    {
        // Set optional parameters
        _async = (null == async) ? false : async;
	    _showProgress = (null == showProgress) ? false : showProgress;
	
        var fdl = fwFileDataLoader.create( url, callbackHandler, _async, _showProgress );
        fdl.load();
    }
    
}

/**
 * Displays Framework or browser OK dialog dependent on the 'dialog-style' attribute
 * of the <project/> tag in the applicationconfig.xml file. Valid values for this
 * attribute are 'framework' and 'browser'. This attribute is not case sensitive.
 *
 * @param message the text message to display in the dialog
 * @param callback - function to call when OK button is clicked. If not defined then
 * a default function that does nothing is used.
 */
Services.showAlert = function(message, callback)
{
	var fc = FormController.getInstance();
	if(fc != null) fc.showAlert(message, callback);
}

/**
 * Get the forms node from the Application Controller's configuration DOM.
 *
 * @return the forms node
 */
Services.getFormsNode = function()
{
    return Services.getAppController().m_config.getFormsNode();
}

Services.frameworkLoaded = true;