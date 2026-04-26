/**
 * MenuBarGUIAdaptor.js
 *
 * MenuBarGUIAdaptor provides the necessary configuration for the
 * MenuBarRenderer and relays events between the renderer and
 * the associated data model class MenuModel.
 *
*/
function MenuBarGUIAdaptor() {};

/**
 * MenuBarGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 *
*/
MenuBarGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
MenuBarGUIAdaptor.prototype.constructor = MenuBarGUIAdaptor;

/**
 * Add required prototcols
 *
 */
GUIAdaptor._setUpProtocols( 'MenuBarGUIAdaptor' );

/**
 * Class variable indicating current browser
 *
*/
MenuBarGUIAdaptor.isIE = (document.attachEvent != null);


/**
 * Instance variable storing information on quick links
 *
 */
MenuBarGUIAdaptor.prototype.m_quickLinksConfig = null;


/**
 * Instance variable storing information on quick link buttons
 *
 */
MenuBarGUIAdaptor.prototype.m_quickLinkButtons = null;

/**
 * Instance variable storing information on quick link menu items
 *
 */
MenuBarGUIAdaptor.prototype.m_quickLinksMenuItems = null;


/**
 * Create an instance of MenuBarGUIAdaptor
 *
 * @param element The HTML div element encompassing the menu bar
 * @return An instance of the class MenuBarGUIAdaptor
 *
 */
MenuBarGUIAdaptor.create = function(element)
{   
    var a = new MenuBarGUIAdaptor();
    
    // Initialise adaptor
    a._initialiseAdaptor(element);
    return a;
}

/**
 * Initialise instance of MenuBarGUIAdaptor
 *
 *  @param element The HTML div element encompassing the menu bar
 *
*/

MenuBarGUIAdaptor.prototype._initialiseAdaptor = function(element)
{
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, element);
	                                                          
	// Retrieve reference to form configuration manager
	var cm = FormController.getInstance().getFormView().getConfigManager();

	// Get the configuration for the navigation menu button
	var navigationButtonConfig = this._getNavigationButtonConfig(cm);
	var navigationButtonLabel = null;
		
	if(navigationButtonConfig != null)
	{
		// Get the label for the navigation menu button
		navigationButtonLabel = navigationButtonConfig.label;
	}
		
	// Render the navigation menu button
    this.m_renderer.renderNavigationMenuButton(navigationButtonLabel);
    
	// Retrieve menu bar configuration data from form configuration
	this.m_quickLinksConfig = this._getQuickLinksConfig(cm);
    
	if(null != this.m_quickLinksConfig)
	{
		// Process configuration items
		var length = this.m_quickLinksConfig.length;
        
		if(length > 0)
		{
			var i;
			var quickLinkConfig;
            
            for(i = 0; i < length; i++)
            {
                quickLinkConfig = this.m_quickLinksConfig[i];
                
                if(null == quickLinkConfig.id)
                {
 	               throw new ConfigurationException("Quicklink " + (i + 1) + " does not have mandatory id configuration specified");
                }
                if(null == quickLinkConfig.formName && null == quickLinkConfig.subformId)
                {
                	throw new ConfigurationException("Quicklink " + (i + 1) + " does not have mandatory formName or subformId configuration specified");
                }
            }
            
            // Separate buttons from menu items       
            this.m_quickLinkButtons = new Array();
            this.m_quickLinkMenuItems = new Array();

			// Produce configs for buttons
            for(i = 0; i < length; i++)
            {
                quickLinkConfig = this.m_quickLinksConfig[i];
                
                if(true == quickLinkConfig.onMenuBar)
                {
                    this.m_quickLinkButtons[this.m_quickLinkButtons.length] = quickLinkConfig;

	                // Need to do this in it's own function inorder to get a correct closure in
	                // the created configuration's actionbinding.
	                this._createQuickLinkConfig(cm, quickLinkConfig);
                }
                else
                {
                    this.m_quickLinkMenuItems[this.m_quickLinkMenuItems.length] = quickLinkConfig;
                }
                
            }
            
            var quickLinksMenuButtonLabel = null;
            
            if(this.m_quickLinkMenuItems.length > 0)
            {
				// Get the configuration for the quick links menu button
            	var quickLinksMenuButtonConfig = this._getQuickLinksMenuButtonConfig(cm);
            	
            	if(quickLinksMenuButtonConfig != null && quickLinksMenuButtonConfig.label != null)
            	{
            		// Get the label for the quick links menu button
					quickLinksMenuButtonLabel = quickLinksMenuButtonConfig.label;
				}
			}
			            
			// Render quick links
			this.m_renderer.renderQuickLinks(
				this.m_quickLinkButtons,
				this.m_quickLinkMenuItems,
				quickLinksMenuButtonLabel
			);
        }
    }
}


/**
 * Create configuration for a quick link on the menu bar
 *
 * @param cm the configuration manager
 * @param config the configuration object to write
 * @private
 */
MenuBarGUIAdaptor.prototype._createQuickLinkConfig = function(cm, config)
{
	var thisObj = this;
	
	cm.setConfig(
		config.id,
		{
			actionBinding: function() { thisObj._handleQuickLinkClick(config); },
			enableOn: config.enableOn,
			isEnabled: config.isEnabled,
			additionalBindings: {
				eventBinding: config.eventBinding
			}
		}
	);    
}


MenuBarGUIAdaptor.prototype._handleQuickLinkClick = function(config)
{
	// If there is a guard function configured, then invoke it.
	// If no guard function configured, then we always execute the action.
	var guardResult = true;
	if (null != config.guard)
	{
		guardResult = config.guard.call(this);
	}
	
	if (true == guardResult)
	{
		// If a prepare function is configured, then invoke it.
		if (null != config.prepare)
		{
			config.prepare.call(this);
		}
		
		if (null != config.formName)
		{
			// Navigate to the configured form
			Services.navigate(config.formName);
		}
		else if (null != config.subformId)
		{
			// Dispatch a raise event to the subform
			Services.dispatchEvent(config.subformId, BusinessLifeCycleEvents.EVENT_RAISE);
		}
		else
		{
        	throw new ConfigurationException("Quicklink " + (i + 1) + " does not have mandatory formName or subformId configuration specified");
		}
	}
}


MenuBarGUIAdaptor.prototype._dispose = function()
{
	this.m_renderer._dispose();
}


MenuBarGUIAdaptor.prototype._configure = function(cs)
{
	var fc = FormController.getInstance();
	var cm = fc.getFormView().getConfigManager();
	var eventBindingConfig = null;
	var buttonConfig;
	var keyObj;
		
	// Get the configuration for the navigation menu button
	buttonConfig = this._getNavigationButtonConfig(cm);
	
	if(buttonConfig != null)
	{
		// Get the event binding configuration for the navigation menu button
		eventBindingConfig = buttonConfig.eventBinding;			
	}
	
	if(null == eventBindingConfig)
	{
		keyObj = (MenuBarGUIAdaptor.isIE) ? Key.CHAR_M : Key.CHAR_m;
		
		// Key bound to form element by default
		eventBindingConfig = { keys: [{ key: keyObj, alt: true }] };
	}
	
	// Set the event binding configuration for the navigation menu button
	cm.setConfig(
		this.getId() + MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX,
		{
			eventBinding: eventBindingConfig
		}
	);
	
	if(this.m_quickLinkMenuItems != null && this.m_quickLinkMenuItems.length > 0)
	{
		eventBindingConfig = null;
		
		// Get the configuration for the quick links menu button
    	buttonConfig = this._getQuickLinksMenuButtonConfig(cm);
    	
		if(buttonConfig != null)
		{
			// Get the event binding configuration for the quick links menu button
			eventBindingConfig = buttonConfig.eventBinding;			
		}
		
		if(null == eventBindingConfig)
		{
			keyObj = (MenuBarGUIAdaptor.isIE) ? Key.CHAR_Q : Key.CHAR_q;
			
			// Key bound to form element by default
			eventBindingConfig = { keys: [{ key: keyObj, alt: true }] };
		}
		
		// Set the configuration for the quick links menu items and the
		// event binding for the quick links menu button
		cm.setConfig(
			this.getId() + MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX,
			{
            	quickLinks: this.m_quickLinkMenuItems,
				eventBinding: eventBindingConfig
			}
		);
	}
	
	// E348 - Disable the hidden quick link button
	cm.setConfig(
		this.getId() + MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON,
		{
			isEnabled: function() { return false; }
		}
	);
}


MenuBarGUIAdaptor.prototype.renderState = function()
{
}


MenuBarGUIAdaptor.prototype._getQuickLinksConfig = function(cm)
{
	var quickLinks = null;

	// Get configuration for the menubar
	var cs = cm.getConfig(this.getId());
	
	for(var i = 0, l = cs.length;  i < l; i++)
	{
		var c = cs[i];
		
		// Locate quicklinks configuration
		if(null != c.quickLinks)
		{
			quickLinks = c.quickLinks;
			break;
		}
	}
    
	return quickLinks;        
}

MenuBarGUIAdaptor.prototype._getNavigationButtonConfig = function(cm)
{
    var navigationButtonConfig = null;
    
	// Get configuration for the menubar
    var cs = cm.getConfig(this.getId());
    
    for(var i = 0, l = cs.length; i < l; i++)
    {
        var c = cs[i];
        
        // Locate main navigation menu button configuration
        if(null != c.navigationMenuButton)
        {
        	navigationButtonConfig = c.navigationMenuButton;
        	break;
        }
    }
    
    return navigationButtonConfig;
}

MenuBarGUIAdaptor.prototype._getQuickLinksMenuButtonConfig = function(cm)
{
    var quickLinksMenuButtonConfig = null;

	// Get configuration for the menubar    
    var cs = cm.getConfig(this.getId());
   
    for(var i = 0, l = cs.length; i < l; i++)
    {
        var c = cs[i];
        
        // Locate quick links menu button configuration
        if(null != c.quickLinksMenuButton)
        {
        	quickLinksMenuButtonConfig = c.quickLinksMenuButton;
        	break;
        }
    }
    
    return quickLinksMenuButtonConfig;
}

MenuBarGUIAdaptor.prototype.getQuickLinksButtonContainer = function()
{
	return this.m_renderer.m_quickLinksContainer;
}
