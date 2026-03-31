/**
 * WordProcessingGUIAdaptorOverride - Override the frameworks WordPRocessingGUIAdaptor to 
 * configure Undo and Redo buttons
 *
 * @author: vz8bdy
 * 
 * @version 1.0
 *
 * 16/10/2006	ADB	First Version
 **/
 
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

	// ** ADB Move the configuration so we can refer to it in oderr to override  the
	// ** framework config
	var baseURL = ac.m_config.getAppBaseURL();
	baseURL = baseURL + "/screens/caseman_wp/WordProcessor/fwk";
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
	
}
 