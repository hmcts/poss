//==================================================================
//
// AuditSelectorGUIAdaptor.js
//
// Class for implementing a generic audit selector panel adaptor used to
// display panels for data history audit.
//
//==================================================================

/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 * @author rzxd7g
 * 
 */
function AuditSelectorGUIAdaptor(){};

/**
 * AuditSelectorGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
AuditSelectorGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
AuditSelectorGUIAdaptor.prototype.constructor = AuditSelectorGUIAdaptor;

AuditSelectorGUIAdaptor.EVENT_RAISE = 'raise';
AuditSelectorGUIAdaptor.EVENT_LOWER = 'lower';


/**
 * Add the required protocols to the AuditSelectorGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('AuditSelectorGUIAdaptor'); 
GUIAdaptor._addProtocol('AuditSelectorGUIAdaptor', 'FocusProtocol');                // Supports focusing
GUIAdaptor._addProtocol('AuditSelectorGUIAdaptor', 'FocusProtocolHTMLImpl');        // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('AuditSelectorGUIAdaptor', 'BusinessLifeCycleProtocol');	// Supports BusinessLifeCycle (for raising & lowering)
GUIAdaptor._addProtocol('AuditSelectorGUIAdaptor', 'MouseWheelBindingProtocol');	// Supports mouse wheel scrolling


/**
 * AuditSelectorRenderer member variables
 */
AuditSelectorGUIAdaptor.prototype.m_renderer = null;

AuditSelectorGUIAdaptor.prototype.auditButtonId = null;


/**
 * Create a new AuditSelectorGUIAdaptor
 *
 * @param element the audit panel div element to manage
 * @return the new AuditSelectorGUIAdaptor
 * @type AuditSelectorGUIAdaptor
 * @author rzxd7g
 */
AuditSelectorGUIAdaptor.create = function(element)
{
	Logging.logMessage("AuditSelectorGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);

	var a = new AuditSelectorGUIAdaptor();
	a._initAuditSelectorGUIAdaptor(element);
	return a;
}

/**
 * Helper method for the create method
 * @param element
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype._initAuditSelectorGUIAdaptor = function(element)
{
	this.m_element = element;
	
	// Get a handle to the renderer instance
	this.m_renderer = element.__renderer;

	// Break circular reference in HTML
	this.m_element.__renderer = null;
	this.m_renderer.m_guiAdaptor = this;
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, element);
}


/**
 * Configuration method, sets audit button id whereby the Audit can be invoked
 * off.  Also configures the raise business lifecycle to raise the dropdown.
 * @param cs
 * @author rzxd7g
 * @return Services.hasAccessToForm("auditSubform"); } 
 */
AuditSelectorGUIAdaptor.prototype._configure = function(cs) 
{
	for ( var i=0, l=cs.length-1; i<l; i++ )
	{
		// Make sure user has configured an auditButtonId
		var auditButtonId = cs[i].auditButtonId
		if ( null != auditButtonId )
		{	
			this.auditButtonId = auditButtonId;
			this.m_quickLinkMenu = false;
		}
		else
		{
			throw new ConfigurationException("Must define an Audit Button Id to link the Selection Panel to");
		}
		
		if ( null == document.getElementById(auditButtonId) )
		{
			// Button does not exist on the navigation bar, test if in the quick links menu
			var qlm = Services.getAdaptorById("menubar_quicklinksmenu");
			var inQuickLinkMenu = false;
			for(i=0, l=qlm.m_quickLinksConfig.length; i < l; i++)
			{
				if ( qlm.m_quickLinksConfig[i].id == auditButtonId )
				{
					inQuickLinkMenu = true;
					break;
				}
			}
			
			if ( inQuickLinkMenu )
			{
				// The adaptor is actually the quick links menu, not the button itself
				throw new ConfigurationException("The Audit Button Id cannot be in the quick links menu");
			}
			else
			{
				throw new ConfigurationException("The Audit Button Id provided does not exist on the form");
			}
		}

		// Add raise business lifecycle	
		var raiseBusinessLifeCycle = new AuditSelectorRaiseBusinessLifeCycle();
		raiseBusinessLifeCycle.initialise(this);
		this.addBusinessLifeCycle(raiseBusinessLifeCycle);
		
		// Get the form element so can use the id to link to a key binding
		var formElement = this.m_renderer.m_container.parentNode;
		while ( formElement.tagName != "FORM" )
		{
			formElement = formElement.parentNode;
		}

		// Configure the raising of the popup to be linked to the audit button configured		
		// or the ALT+A keybinding
		cs[i].raise = {
			eventBinding: {
				keys: [ { key: Key.CHAR_A, element: formElement.id, alt: true } ],
				singleClicks: [ { element: this.auditButtonId } ],
				isEnabled: function() { return Services.hasAccessToForm("auditSubform"); }
			}
		};
		
		raiseBusinessLifeCycle.configure( cs[i].raise );
		
		// Start event bindings
		var raiseEventBinding = raiseBusinessLifeCycle.getEventBinding();
		if( null != raiseEventBinding ) raiseEventBinding.start();
	}
}


/**
 * Dispose method for each panel
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype._dispose = function()
{
	// Clean up the code
	this.m_renderer.dispose();
	this.m_renderer = null;
	this.m_element.__renderer = null;	
	this.m_element = null;
}


/**
 * Mandatory Render State method for each panel
 * Not really needed as this function is called when the state of the renderer needs to change
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype.renderState = function() {}


/**
 * Accessor method to return the auditButtonId property.
 * @returns {String} the id of the parent Audit Button
 * @author rzxd7g
 */
AuditSelectorGUIAdaptor.prototype.getAuditButtonId = function()
{
	return this.auditButtonId;
}


/**
 * handleSelection method used to control what happens when the user
 * clicks on an enabled row in the Audit Panel Selection List
 * @param panelId
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype.handleSelection = function(panelId)
{
	// Remove the '_auditPanel' from the end of the id to get the real Audit Panel's id
	var id = panelId.replace(/_auditPanel/, "");
	
	/* Call the getAuditPanelData method on the Audit Panel selected to transfer Table 
	 * and Key data to the xpath passed in.  Example DOM created by getAuditPanelData() is:
	 * <Tables>
	 *		<Table>
	 *			<TableName>PARTIES</TableName>
	 *			<Key>
	 *				<Column>CPV00001</Column>
	 *				<Column>DEFENDANT</Column>	
	 *				<Column>1</Column>
	 *			</Key>
	 *		</Table>
	 * </Tables>
	 * see AuditPanelGUIAdaptor.prototype.getAuditPanelData() for more information
	 */
	Services.getAdaptorById( id ).getAuditPanelData("/ds/var/form/AuditData");
	
	// Lower the audit selector dropdown panel
	this.m_renderer._hidePanel();
	
	// Launch the Audit Subform
	Services.dispatchEvent("audit_subform", PopupGUIAdaptor.EVENT_RAISE);
}


/****************************** FOCUS CODE ****************************************/

/**
 * Returns the element to have focus wheninvoke the Audit Dropdown
 * Doesn't really work that well, so have to call a Services.setFocus on
 * AuditSelectorRaiseBusinessLifeCycle.prototype.invokeBusinessLifeCycle()
 * @author rzxd7g
 * @return this.m_renderer.m_container  
 */
AuditSelectorGUIAdaptor.prototype.getFocusElement = function()
{
	return this.m_renderer.m_container;
}


/**
 * Hides the panel when lose focus
 * @param f
 * @param wasClick
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype.setFocus = function( f, wasClick )
{
	if(f == false)
	{
		this.m_renderer._hidePanel();
	}
}

/**
 * Method called when the mouse wheel is 'rotated' that triggers scrolling of the data up or down.
 * @param evt
 * @author rzxd7g
 * 
 */
AuditSelectorGUIAdaptor.prototype.handleScrollMouse = function(evt)
{
	if(evt.wheelDelta > 0)
	{
		this.m_renderer._selectPreviousPanel();
	}
	else
	{
		this.m_renderer._selectNextPanel();
	}
}

/******************** BUSINESS LIFE CYCLES (RAISE & LOWER) ************************/

/**
 * BusinessLifeCycle to raise a popup
 * @author rzxd7g
 * 
 */
function AuditSelectorRaiseBusinessLifeCycle() {}

// AuditSelectorRaiseBusinessLifeCycle is a sub class of BusinessLifeCycle
AuditSelectorRaiseBusinessLifeCycle.prototype = new BusinessLifeCycle();
AuditSelectorRaiseBusinessLifeCycle.prototype.constructor = AuditSelectorRaiseBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 * @author rzxd7g
 */
AuditSelectorRaiseBusinessLifeCycle.prototype.getName = function()
{
	return AuditSelectorGUIAdaptor.EVENT_RAISE;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be shown
 *
 * @param e the BusinessLifeCycleEvent
 * @author rzxd7g
 * 
 */
AuditSelectorRaiseBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	// Set focus in the Audit Selector Panel
	Services.setFocus( this.m_adaptor.getId() );

	// Show the Audit Selector Panel
	this.m_adaptor.m_renderer._showPanelList();
}
