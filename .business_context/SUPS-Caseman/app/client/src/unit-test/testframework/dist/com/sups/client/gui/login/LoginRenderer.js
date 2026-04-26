//==================================================================
//
// LoginRenderer.js
//
// Class for rendering a login box comprising a username, password and Login button
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @constructor
 * @private
 */																																							
function LoginRenderer()
{
	this.m_successForm = null ;
}

/**
 * LoginRenderer is a sub class of Renderer
 */
LoginRenderer.prototype = new Renderer();
LoginRenderer.prototype.constructor = LoginRenderer;

LoginRenderer.m_logger = new Category("LoginRenderer");
LoginRenderer.CSS_LOGIN_CLASS_NAME = "login";


/**
 * Create a login component at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the login being created
 */
LoginRenderer.createInline = function(id)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the login being created
		false		// The login has an internal input element which can accept focus, so the div should not accept focus
	);

	return LoginRenderer._create(e);
}

/**
 * Create a login component in the document relative to the supplied element
 *
 * @param refElement the element relative to which the login should be rendered
 * @param relativePos the relative position of the login to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the login being created
 */
LoginRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the login being created
		false			// The login has an internal input element which can accept focus, so the div should not accept focus
	);

	return LoginRenderer._create(e);
}

/**
 * Create a login component as a child of another element
 *
 * @param p the parent element to which the login should be added
 * @param id the id of the login being created
 */
LoginRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the login's outer div to it's parent element
	p.appendChild(e);	
	
	return LoginRenderer._create(e);
}

LoginRenderer._create = function(e)
{
	e.className = LoginRenderer.CSS_LOGIN_CLASS_NAME;

	var lr = new LoginRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	lr._initRenderer(e);

	var id = e.id;

	var userNameLabel = document.createElement("label");
	userNameLabel.innerHTML = "Username ";
	userNameLabel.setAttribute("for", id+"_username");
	e.appendChild(userNameLabel);

	var userNameInput = document.createElement("input");
	userNameInput.id = id+"_username";
	userNameInput.setAttribute("type", "text");
	userNameInput.setAttribute("size", "8");
	e.appendChild(userNameInput);
	this.m_userNameInput = userNameInput;

	var break1 = document.createElement("br");
	e.appendChild(break1);

	var passwordLabel = document.createElement("label");
	passwordLabel.innerHTML = "Password ";
	passwordLabel.setAttribute("for", id+"_password");
	e.appendChild(passwordLabel);

	var passwordInput = document.createElement("input");
	passwordInput.id = id+"_password";
	passwordInput.setAttribute("type", "password");
	passwordInput.setAttribute("size", "8");
	e.appendChild(passwordInput);
	this.m_passwordInput = passwordInput;

	var break2 = document.createElement("br");
	e.appendChild(break2);

	var loginButton = document.createElement("input");
	loginButton.value = "Login";
	loginButton.id = id+"_button";
	loginButton.setAttribute("type", "button");
	loginButton.setAttribute("size", "8");
	e.appendChild(loginButton);
	this.m_loginButton = loginButton;

	return lr;
}
