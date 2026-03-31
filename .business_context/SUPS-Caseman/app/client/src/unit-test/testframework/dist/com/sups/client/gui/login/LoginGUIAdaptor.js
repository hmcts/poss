//==================================================================
//
// LoginGUIAdaptor.js
//
// Class for adapting a text style input element for use in the
// framework
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 */
function LoginGUIAdaptor()
{
	//this.m_keys = new Array();
	//this.retrieveOn = new Array();
	this.successForm = null ;
	this.failureForm = null ;
}

LoginGUIAdaptor.m_logger = new Category("LoginGUIAdaptor");

/**
 * Username and password input boxes data bindings
 */
LoginGUIAdaptor.USERNAME_DATA_BINDING = "/ds/private/username";
LoginGUIAdaptor.PASSWORD_DATA_BINDING = "/ds/private/password";

LoginGUIAdaptor.LOGIN_ERROR_MSG = "Invalid Username or Password";

/**
 * LoginGUIAdaptor is a sub class of InputElementGUIAdaptor
 */                             
LoginGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
LoginGUIAdaptor.prototype.constructor = LoginGUIAdaptor;

/**
 * Add the required protocols to the CheckboxInputElementGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
 
GUIAdaptor._setUpProtocols('LoginGUIAdaptor'); 

/**
 * Clean up after the component
 */
LoginGUIAdaptor.prototype._dispose = function()
{
	if(LoginGUIAdaptor.m_logger.isInfo()) LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor.dispose()");

	// Break circular reference in HTML
	this.m_element.__renderer = null;
}

/**
 * Create a new LoginGUIAdaptor
 *
 * @param e the text input element to manage
 * @return the new LoginGUIAdaptor
 * @type LoginGUIAdaptor
 */
LoginGUIAdaptor.create = function(e)
{
	if(LoginGUIAdaptor.m_logger.isInfo()) LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor.create()");
	var a = new LoginGUIAdaptor();
	a._initLoginGUIAdaptor(e);
	
	return a;
}


/**
 * Initialise the LoginGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
LoginGUIAdaptor.prototype._initLoginGUIAdaptor = function(e)
{
	if(LoginGUIAdaptor.m_logger.isInfo()) LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor._initLoginGUIAdaptor");
	this.m_element = e;
}

LoginGUIAdaptor.DEFAULT_MAX_LENGTH = 10;

/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 */
LoginGUIAdaptor.prototype._configure = function(cs)
{
	if(LoginGUIAdaptor.m_logger.isInfo()) LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor._configure()");

	var thisObj = this ;
	var id = this.m_element.id;
    	
	var ctor1 = function() {};
	window[id+"_username"] = ctor1;
	ctor1.dataBinding = LoginGUIAdaptor.USERNAME_DATA_BINDING;
	ctor1.isMandatory = function () {return true;} ;
	
	var ctor2 = function() {} ;
	window[id+"_password"] = ctor2;
	ctor2.dataBinding = LoginGUIAdaptor.PASSWORD_DATA_BINDING;
	ctor2.isMandatory = function () {return true;} ;
	
	for(var i=0; i<cs.length; i++)
	{
		var c = cs[i];
		if(this.m_successForm == null && c.successForm != null)
		{
			this.m_successForm = c.successForm;
		}
	}
	
	if(this.m_successForm == null)
	{
		throw new ConfigurationException("the successForm configuration is mandatory for Login adaptor");
	}
	
	var ctor = function() {};
	window[id + "_button"] = ctor;
	ctor.actionBinding = function() 
	{
		var ue = document.getElementById(id + "_username");
		var pe = document.getElementById(id + "_password");
		var username = ue.value;
		var password = pe.value;
	    
		if (null == username || "" == username)
		{
			thisObj._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG, id + "_username");
		}
		else if (null == password || "" == password)
		{
			thisObj._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG, id + "_password");
		}
		else
		{		
			var callback = new Object() ;
			callback.controller = thisObj ;
			callback.method = thisObj.loginCallBack ;
	
			Services.login(callback, username.toLowerCase(), password);
		}
	};
	// configure key binding for return key in username or password field
	ctor.additionalBindings = {
		eventBinding: {
			keys: [ { key: Key.Return, element: id + "_username" },
					{ key: Key.Return, element: id + "_password" } ]
		}
	};
	
	// configure max length on username
	var ue = document.getElementById(id + "_username");
	ue.maxLength = LoginGUIAdaptor.DEFAULT_MAX_LENGTH;
}

/**
* Receives call back from the login
* @param SecurityContext
* @authenticationResult, result returned from the Security.login call
*/
LoginGUIAdaptor.prototype.loginCallBack = function(SecurityContext,authenticationResult)
{
	var id = this.getId() + "_password";

	// If we have successfully logged in or there is an error then remove the
	// password from the data model because it is stored as clear text
	Services.setValue(LoginGUIAdaptor.PASSWORD_DATA_BINDING, "");
	
	if ( null != authenticationResult)
	{
		if (true == authenticationResult.error)
		{
			this._showAlert(
				"An Error occurred calling the Login Service: " + authenticationResult.detail,
				id
			);
		}
		else
		{
			if ( null != authenticationResult.value && authenticationResult.value.length > 0)
			{
				var ac = Services.getAppController();
				ac._showUser() ;
				
				// We don't navigate to the successForm until we have loaded the ref data needed by security
				var securityService = ac.getSecurityServiceByName("getHomeCourt");
				var serviceParams = LoginGUIAdaptor.getSecurityServiceParams("getHomeCourt");
				var username = Services.getValue(LoginGUIAdaptor.USERNAME_DATA_BINDING).toLowerCase();
				
				serviceParams.addSimpleParameter("userId", username);
				serviceParams.addSimpleParameter("getHomeCourt", "true");

				// This is a bit filthy because callService does not allow you to pass in a object to be used
				// as the context object for the callback, i.e. this instance of the login gui adaptor, but there
				// should only be one instance of a login adaptor active at any one time so this should work.
				LoginGUIAdaptor.m_successForm = this.m_successForm;
				var callback = new Object() ;
				callback.onSuccess = LoginGUIAdaptor.getCourtIdCallback;
				callback.onError = LoginGUIAdaptor.onGetCourtIdError;
				Services.callService(securityService.getName(), serviceParams, callback, true);
			}
			else
			{
			    this._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG, id);
			}
		}
	}
	else
	{
		this._showAlert("Error in calling Login Service", id);
	}
}

/**
 * Shows a message in an OK dialog and then sets focus on the supplied field
 *
 * @param msg the text message to display in the dialog
 * @param fieldId the identifier of the field to focus on
*/
LoginGUIAdaptor.prototype._showAlert = function(msg, fieldId)
{
	var ac = Services.getAppController();
	var thisObj = this;
    var callbackFunction = function(userResponse)
    {
		setTimeout(function() { thisObj._setFocus(fieldId); }, 0);
    }
    
	if (ac.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
	{
		Services.showAlert(msg, callbackFunction);
	}
	else
	{
		alert(msg);
		setTimeout(function() { thisObj._setFocus(fieldId); }, 0);
	}
}

/**
 * Set focus on the supplied field
 *
 * @param fieldId the identifier of the field to focus on
*/
LoginGUIAdaptor.prototype._setFocus = function(fieldId)
{
	// Clear out tabbing events queue first to prevent the focus jumping
	// from the user name field to the password field
	TabbingManager._processTabbingEvents();
	Services.setFocus(fieldId);
}

LoginGUIAdaptor.onGetCourtIdError = function(ex)
{
	Services.showAlert("Error loading home court for user");
}

/**
 *
 <UserPersonalDetails>
	<HomeCourt/>
	<UserId/>
	<Forenames/>
	<Surname/>
	<Title/>
	<UserShortName/>
	<JobTitle/>
	<Extension/>
	<IsActive/>
	<StyleProfile/>
	<DefaultPrinter/>
</UserPersonalDetails>
 
 */
LoginGUIAdaptor.getCourtIdCallback = function(resultDom)
{
	var ac = Services.getAppController();
	var securityService = ac.getSecurityServiceByName("getHomeCourt");
	Services.setValue(securityService.getDataBinding(), XML.selectNodeGetTextContent(resultDom, "//HomeCourt"));
	Services.setValue("/ds/var/app/StyleProfile", XML.selectNodeGetTextContent(resultDom, "//StyleProfile"));
	Services.setValue("/ds/var/app/DefaultPrinter", XML.selectNodeGetTextContent(resultDom, "//DefaultPrinter"));

	var styleName = Services.getValue("/ds/var/app/StyleProfile");
	if(null != styleName && "" != styleName)
	{
		// Would use exception to report unrecognised style name,
		// but we're dealing with a different frame here and 
		// exceptions don't propogate well across frames so we
		// use simple return value to indicate success or failure
		var result = ac.getStyleManager().setStyle(styleName);
		if(!result)
		{
			// Unrecognised style, so tell the stylemanager to use the default
			Services.showAlert("Unrecognised style name '" + styleName + "' in user profile. Using default style instead.");
			ac.getStyleManager().setStyle(null);
		}
	}

	var getRolesSecurityService = ac.getSecurityServiceByName("getRoles");
	var serviceParams = LoginGUIAdaptor.getSecurityServiceParams("getRoles");
	// The getRoles method now requires the userId because it can be called from the maintain users page so
	// we can't assume it always for the current user, even though it is in this instance
	serviceParams.addSimpleParameter("userId", ac.getSecurityContext().getCurrentUser().getUserName());

	var callback = new Object() ;
	callback.onSuccess = LoginGUIAdaptor.getRolesCallback ;
	callback.onError = LoginGUIAdaptor.onGetRolesError ;
	Services.callService(getRolesSecurityService.getName(), serviceParams, callback, true);
}

LoginGUIAdaptor.getRolesCallback = function(resultDom)
{
	var securityService = Services.getAppController().getSecurityServiceByName("getRoles");
	
	var db = securityService.getDataBinding();
	// Remove any existing roles in case we are logging in for a second time
	Services.removeNode(db);
	// We want to remove the trailing 'roles' node because the xml that is returned contains
	// a top node that is also 'roles'.
	db = XPathUtils.removeTrailingNode(db);
	Services.addNode(resultDom, db);

	Services.navigate(LoginGUIAdaptor.m_successForm, false);
}

LoginGUIAdaptor.onGetRolesError = function(ex)
{
	Services.showAlert("Error loading roles for user");
}

LoginGUIAdaptor.getSecurityServiceParams = function(name)
{
	var service = Services.getAppController().getSecurityServiceByName(name);
	var params = new ServiceParams();
	var value = null;
	var serviceParams = service.getParameters();
	for(var i=0; i<serviceParams.length; i++)
	{
		var serviceParam = serviceParams[i];
		value = Services.getValue(serviceParam.value);
		params.addSimpleParameter(serviceParam.name, value);
	}
	return params;
}

