/**
 * Class to represent a User
 */


function User(userName, sessionKey)
{
	this.m_userName = userName;
	this.m_sessionKey = sessionKey ;
}

User.prototype.getUserName = function()
{
	return this.m_userName;
}

User.prototype.getSessionKey = function()
{
	return this.m_sessionKey;
}

