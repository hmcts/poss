/**
 * Class to represent security information concerning the current user session
 */

/**
 * This constructor now takes a piece of xml to configure the security context that contains information about
 * the user and the roles for the court they have logged into.
 */
function SecurityContext(sessionKey, user, appController)
{
	this.sessionKey = sessionKey;
	this.user = user;
	this.m_appController = appController;
}

/**
 * Takes the list of access roles for a form and checks to see if any exist in the list of user's roles, taking into
 * account the hierarchical roles.
 */
SecurityContext.prototype.hasAccess = function(formRequiredRoles)
{
	// If the list of roles for a page is null then by default everyone has access to them
	if(formRequiredRoles == null || formRequiredRoles.length == 0)
	{
		return true;
	}
	var appRoles = this.m_appController.getAppRoles();
	var getRolesService = this.m_appController.getSecurityServiceByName("getRoles");
	if(getRolesService == null)
	{
		throw new AppConfigError("No Service found for getRoles security service - can't verify user roles for form access");
	}
	// First get the list of all users roles from the DOM. This will also get the parents
	// of those roles concatenated into 1 array.
	var fc = this.m_appController.getFormController();
	var userRolesNode = fc.getDataModel().getNode(getRolesService.getDataBinding());
	var usersRoles = new Array();
	if(userRolesNode != null)
	{
		var userRoleNodes = userRolesNode.selectNodes("//role");
		for(var j=0; j<userRoleNodes.length; j++)
		{
			var userRole = XML.getNodeTextContent(userRoleNodes[j]);
			usersRoles[usersRoles.length] = userRole;
			var parents = appRoles.getParentsOfRole(userRole);
			usersRoles = usersRoles.concat(parents);
		}
	}
	// Compare the list of user's roles including parents against the
	// list of required roles for the form to see if there is a match
	var foundRole = false;
	for(var i=0; i<formRequiredRoles.length; i++)
	{
		for(var k=0; k<usersRoles.length; k++)	
		{
			if(formRequiredRoles[i] == usersRoles[k])
			{
				foundRole = true;
				break;
			}
		}
		if(foundRole == true)
		{
			break;
		}
	}
	return foundRole;
}

SecurityContext.prototype.getCurrentUser = function()
{
	return this.user;
}

SecurityContext.prototype.getSessionKey = function()
{
	return this.sessionKey;
}

/**
 * Generates a Message Authentication Code (MAC) for the message and the current user session
 * 
 * @param params XML representation of the parameters to be passed in the message
 * @return String containing the encoded MAC
 */
SecurityContext.prototype.generateMac = function(params)
{
	var macString = params + this.user.getUserName() + this.sessionKey;
	return hex_md5(macString);
}