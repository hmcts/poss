//==================================================================
//
// GUIAdaptorFactory.js
//
// Class responsible for parsing the view (HTML Document) and 
// producing the controller components to manage the user interface
// components on the view.
//
//==================================================================


/**
 * GUIAdaptorFactory is responsible for parsing the view (HTML
 * Document) and creating the controller components to manage the
 * user interface components on the view.
 *
 * @constructor
 */
function GUIAdaptorFactory()
{
	this._initGUIAdaptorFactory();
}

GUIAdaptorFactory.m_logger = new Category("GUIAdaptorFactory");

/**
 * Array containing the list of adaptors for a particular 
 * bindView operation.
 *
 * @type Array[GUIAdaptor]
 * @private
 */
GUIAdaptorFactory.prototype.m_adaptors = null;

 

/**
 * Array containing external component factories.
 *
 * @type Map[GUIAdaptorRegistration]
 * @private
 */
GUIAdaptorFactory.prototype.m_externalComponents = null;


/**
 * Private initialisation function
 *
 * @private
 */
GUIAdaptorFactory.prototype._initGUIAdaptorFactory = function()
{
	this.m_externalComponents = new Array();
	this.m_adaptors = null;
}

/**
 * Bind a configuration to a view
 * @param htmlDoc the HTML Document to parse
 * @return an array of GUIAdaptors representing the managed
 *    components in the view (HTML Document)
 * @type Array[GUIAdaptor]
 */
GUIAdaptorFactory.prototype.bindView = function(htmlDoc)
{
	// Parse the whole document below the body tag.
	return this._parseElement(htmlDoc.body, null, false);	
}


GUIAdaptorFactory.prototype.parseElement = function(e, initialContainer)
{
	// Parse the supplied element and it's children
	return this._parseElement(e, initialContainer, true);
}


GUIAdaptorFactory.prototype._parseElement = function(e, initialContainer, parseSelf)
{
	// Create list of adaptors created during this parse
	this.m_adaptors = new Array();
	
	// Container stack used during this parse
	this.m_containerStack = new Array();

	// If there is an initial container
	if(null != initialContainer)
	{
		this.m_containerStack.push(initialContainer);
	}
	
	
	if(parseSelf)
	{
		// Parse supplied element and its children
		this._handleElement(e);
	}
	else
	{
		// Just parse the supplied element's children
		this.parseChildren(e);
	}
	
	var adaptors = this.m_adaptors;
	
	// Reset member variables used during recursion
	this.m_adaptors = null;
	this.m_containerStack = null;
	
	// Return list of adaptors
	return adaptors;
}


/**
 * Register an external GUIAdaptor to the GUIAdaptorFactory
 * allowing external components to integrated with the Framework
 *
 * @param registration the GUIAdaptorRegistration which binds the
 *   external adaptor to the framework.
 */
GUIAdaptorFactory.prototype.register = function(registration)
{
	if(GUIAdaptorFactory.m_logger.isInfo()) GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory.register(" + registration + ")");
	var className = "" +  registration.getClassName();
	this.m_externalComponents[className] = registration;
}


/**
 * Parse the child of an element and create any adaptors required.
 *
 * @param p the parent element who's children to parse.
 */
GUIAdaptorFactory.prototype.parseChildren = function(p)
{
	// Look over each of the child nodes, recursing down through the tree as necessary
	var cNs = p.childNodes;
	for(var i = 0, l = cNs.length; i < l; i++)
	{
		// Record the current container for comparison at end of process
		var containerAtStart = this.m_containerStack[this.m_containerStack.length - 1];	
		
		var n = cNs[i];
		
		// Only care about element nodes - ignore the rest
		if(1 == n.nodeType)
		{
			this._handleElement(n);
		}
		var containerAtEnd = this.m_containerStack[this.m_containerStack.length - 1];
		if(containerAtStart != containerAtEnd)
		{
			/*
		 	 * This iteration of parseChildren has added an adaptor the container stack
		 	 * This must now be removed
		 	 */
			this.m_containerStack.pop(); 
		}
	}
}


GUIAdaptorFactory.prototype._handleElement = function(e)
{
	// Do not process elements without an ID set but examine children of those elements
	if(e.id.length == 0)
	{
		this.parseChildren(e);
	}
	else
	{
		switch(e.nodeName)
		{
			case 'FORM':
			{   
			    if (e.className != SubformElementGUIAdaptor.CSS_CLASS)
			    {
				   this._addAdaptor(FormElementGUIAdaptor.create(e));
				}
				else
				{
				   this._addAdaptor(SubformElementGUIAdaptor.create(e));
				}
				
				// Forms will generally have children so look for them...
				// The form is set as the container in order to catch
				// those adapters which do not support component containers
				// (i.e. externally registered components)
				this.parseChildren(e);
				break;
			}
			case 'INPUT':
			{
				this._handleInput(e);
				
				// INPUT elements don't have children, so don't look for them
				break;
			}
			
			case 'TEXTAREA':
			{
				// Re-use the Text Input Adaptor - at the moment these inputs are
				// handled identically.
				// E316 Enforce text area maximum length. Create new adaptor
				// for text area rather than use TextInputElementGUIAdaptor.
				this._addAdaptor(TextAreaElementGUIAdaptor.create(e));
		
				// Doesn't have children so don't look for them
				break;
			}
			
			case 'SELECT':
			{
				this._addAdaptor(SelectElementGUIAdaptor.create(e));

				// Doesn't have children so don't look for them
				break;
			}
			
			case 'DIV':
			{
				// ALL COMPONENTS MUST BE DIVs
				//
				// If DIV was not part of a component, then process it's children.
				// If the DIV has children that need handling, it must explicitly call
				// parseChildren
				this._handleDiv(e);
				break;
			}
			
			default:
			{
				// If no external GUIAdaptor is registered to handle this element,
				// then just parse it's children.
				// If the element is a component that is handled, then if the component
				// has children that need handling, it must explicitly call parseChildren
				this.parseChildren(e);
			}
		}
	}
}


GUIAdaptorFactory.prototype._handleInput = function(e)
{
	// Switch on the input element's type attribute
	switch(e.type)
	{
		case 'button':
		{
			this._addAdaptor(ButtonInputElementGUIAdaptor.create(e));
			break;
		}
		
		case 'checkbox':
		{
			this._addAdaptor(CheckboxInputElementGUIAdaptor.create(e));
			break;
		}
		
		case 'text':
		{
			if(e.className == "datetext")
			{
				this._addAdaptor(DateTextInputElementGUIAdaptor.create(e));
			}
			else
			{
				this._addAdaptor(TextInputElementGUIAdaptor.create(e));
			}
			break;
		}
		
		case 'password':
		{
			this._addAdaptor(TextInputElementGUIAdaptor.create(e));
			break;
		}
		
		case 'radio':
		{
			this._addAdaptor(RadioInputElementGUIAdaptor.create(e));
			break;
		}
		
		// Explicitly disallow reset and submit button types - they'll break the framework.
		case 'reset':
		case 'submit':
		{
			fc_assertAlways("Input element of type " + e.type + " not allowed on forms");
			break;
		}
		
		default:
		{
			// Don't handle the following input types by default in the framework at this
			// time:
			//     - file
			//     - hidden
			//     - image
			//
			// Will check to see if there is an external adaptor that matches...
			fc_assertAlways("Input element of type " + e.type + " not supported");
			break;
		}
	}
}


GUIAdaptorFactory.prototype._handleDiv = function(e)
{
	var cN = e.className
	if(cN != "")
	{
		// the css class is used to differentiate between different types of complex components
		// - remember that css classes in older browsers are case sensitive, therefore we assume
		//   that they are case sensitive here!
		// - remember that a element can have multiple css classes. Framework policy for internal
		//   components is that they should always have an external div with a single class for
		//   the purposes of recognising the component.
		switch(cN)
		{
			case PanelGUIAdaptor.CSS_NO_MARGIN_CLASS_NAME:
			case PanelGUIAdaptor.CSS_CLASS_NAME:
			{
				this._addAdaptor(PanelGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}
			case FilteredGrid.CSS_CLASS_NAME:
			{
				this._addAdaptor(FilteredGridGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}
			case GridRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(GridGUIAdaptor.create(e));
				break;
			}
			case TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME:
			{
				this._addAdaptor(TabSelectorGUIAdaptor.create(e));
				break;
			}
			case PagedAreaGUIAdaptor.CSS_CLASS_NAME:
			{
				this._addAdaptor(PagedAreaGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}		
			case PageGUIAdaptor.CSS_CLASS_NAME:
			{
				this._addAdaptor(PageGUIAdaptor.create(e));		
				this.parseChildren(e);
				break;
			}
			case DynamicPageGUIAdaptor.CSS_CLASS_NAME:
			{
				this._addAdaptor(DynamicPageGUIAdaptor.create(e));
				// DynamicPage GUIAdaptor will never have any children when it is first created
				break;
			}
			case LOVPopupRenderer.LOV_POPUP_CSS_CLASS:
			{
			    this._addAdaptor(LOVPopupGUIAdaptor.create(e));
				this.parseChildren(e);
			    break;
			}
			case DatePickerRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(DatePickerGUIAdaptor.create(e));
				break;
			}
			case LogicGUIAdaptor.LOGIC_CSS_CLASS_NAME:
			{
				this._addAdaptor(LogicGUIAdaptor.create(e));
				break ;
			}
			case AutoCompletionRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(AutocompletionGUIAdaptor.create(e));
				break;
			}
			case FwSelectElementRenderer.CSS_CLASS_NAME:
			{
			    this._addAdaptor(FwSelectElementGUIAdaptor.create(e));
			    break;
			}
			case PopupRenderer.CSS_CLASS_NAME:
			case PopupRenderer.CSS_CLASS_NAME_FULLPAGE:
			{
				// TODO - this is not really right, the popup has no container
				this._addAdaptor(PopupGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}		
			case LoginRenderer.CSS_LOGIN_CLASS_NAME:		
			{
				this._addAdaptor(LoginGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}
			case ZoomFieldRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(ZoomFieldGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}
			case WordProcessingGUIAdaptor.CSS_CLASS_NAME:
			{
				this._addAdaptor(WordProcessingGUIAdaptor.create(e));
				break;
			}
			case PopupSubformGUIAdaptor.CSS_CLASS_NAME:
			case PopupSubformGUIAdaptor.CSS_CLASS_NAME_FULLPAGE:
			{
				this._addAdaptor(PopupSubformGUIAdaptor.create(e));
				break;
			}
			case LOVSubformRenderer.LOV_SUBFORM_CSS_CLASS:
			case LOVSubformGUIAdaptor.LOV_SUBFORM_CSS_CLASS_NAME_FULLPAGE:
			{
				this._addAdaptor(LOVSubformGUIAdaptor.create(e));
				break;
			}
			case ManageUsersRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(ManageUsersGUIAdaptor.create(e));
				this.parseChildren(e);				
				break;
			}
			case EditPanelRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(EditPanelGUIAdaptor.create(e));
				this.parseChildren(e);				
				break;
			}
			case SearchPanelRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(SearchPanelGUIAdaptor.create(e));
				this.parseChildren(e);				
				break;
			}
			// Handle some classnames used in the framework explicitly so that we
			// don't go looking for external adaptors to match. These div's don't
			// have corresponding adaptors to be created so we simply parse their
			// children.
			case TabSelector.TABBED_AREA_CSS_CLASS_NAME:
			case ActionBarRenderer.CSS_CLASS_NAME:
			{
				this.parseChildren(e);
				break;
			}
			
			case AsyncMonitorRenderer.CSS_CLASS_NAME:
			{
				this._addAdaptor(AsyncMonitorGUIAdaptor.create(e));
				this.parseChildren(e);
				break;
			}
			
		    case MenuBarRenderer.MENU_BASE_DIV:
			{
				var a = MenuBarGUIAdaptor.create(e);
			    this._addAdaptor(a);
			    
			    // Parse the quicklinks buttons
			    //this.parseChildren(a.getQuickLinksButtonContainer());
			    this.parseChildren(e);
			    break;
			}
			
			case MenuRenderer.MENU_BAR_BUTTON:
			{
			    var a = MenuGUIAdaptor.create(e);
			    this._addAdaptor(a);
			    break;
			}
			
			default:
			{
				// If this is a DIV which a registered external adaptor, then create an
				// adaptor instance now, otherwise simply continue parsing chilren.
				// NOTE: extenal adaptors cannot currently support child adaptors
				// This is enforced by the external adaptor interface
				var ret = this._handleExternalAdaptor(e);
				if(!ret)
				{
					this.parseChildren(e);
				}
				break;
			}
		}
	}
	else
	{
		this.parseChildren(e);
	}
}


GUIAdaptorFactory.prototype._handleExternalAdaptor = function(e)
{
	if(GUIAdaptorFactory.m_logger.isInfo()) GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor(id: " + e.id + ") looking for externally registered component " + e.className);
	fc_assert(e.nodeName == 'DIV', "Can only handle external adaptors of type DIV");
	
	var cN = e.className;
	if(null != cN)
	{
		var a = null;
	
		// See if we've got an externally registered adaptor
		var r = this.m_externalComponents[cN];
		
		if(null != r)
		{
			var f = r.getFactory();
			if(GUIAdaptorFactory.m_logger.isInfo()) GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor() found externally registered component, factory = " + f);
			
			var index = this._reserveAdaptorPosition(function(){});
	
			// Invoke the factory method passing the HTML element as an argument.
			var a = f.call(null, e, this);
			if(GUIAdaptorFactory.m_logger.isInfo()) GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor() factory created the following adaptor = " + a);
			
			this._addAdaptor(a, index);
		}
	}	
	// Return true if we created an adaptor
	return a != null;
}

// put an empty placeholder to reserve the position in the array
// this is in case the adaptor.create() calls this back to parse it's
// children which should appear after the controlling adaptor, in case
// the controlling component has to dynamically create configuration
// for the adaptor.configure method.
GUIAdaptorFactory.prototype._reserveAdaptorPosition = function(f)
{
	var index = this.m_adaptors.length;
	this.m_adaptors[this.m_adaptors.length] = f;
	return index;
}


GUIAdaptorFactory.prototype._addAdaptor = function(a, index)
{
	// Assign the adaptor to a parent container
	a.setParentContainer(this.m_containerStack[this.m_containerStack.length - 1]);
		
	if(null==index || index<0 || index >this.m_adaptors.length)
	{
		this.m_adaptors[this.m_adaptors.length] = a;
	}
	else
	{
		this.m_adaptors[index] = a;
	}

	var id = a.getId();
	// Add property to array storing reference to adaptor
	// Used for fast lookup of adaptors
	this.m_adaptors[ id ] = a;
	
	// If this new adapter is a container return it.
	if(a.isAContainer)
	{
		this.m_containerStack.push(a);
	}
}

/**
 * Dispose method cleans up external component references when
 * adaptor factory no longer required.
 *
*/
GUIAdaptorFactory.prototype.dispose = function()
{
    for( var i in this.m_externalComponents )
    {
        this.m_externalComponents[i].dispose();
        
        this.m_externalComponents[i] = null;
    }
    
    delete this.m_externalComponents;
}


