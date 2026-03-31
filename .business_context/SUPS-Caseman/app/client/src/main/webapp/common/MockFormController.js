/*
 * This class provides a means to replace the standard AppController
 * that the FormController uses with a mock version that is suitable
 * for testing purposes
 */
MockAppController.MY_DUMMY_ERROR_MESSAGE = "myDummyErrorMessage";

/**
 * @author kznwpr
 * 
 */
function MockAppController() 
{
	LoggingImpl.initialise("");
	Logging.initialise(window);
}

/**
 * @param errorId
 * @author kznwpr
 * @return MockAppController.MY_DUMMY_ERROR_MESSAGE  
 */
MockAppController.prototype.getErrorMsgForCode = function(errorId)
{
	return MockAppController.MY_DUMMY_ERROR_MESSAGE;
}

/**
 * @param fc
 * @author kznwpr
 * 
 */
MockAppController.prototype.setFormController = function(fc)
{
	this._fc = fc;
}

/**
 * @author kznwpr
 * @return null  
 */
MockAppController.prototype.getSessionDataFromPreviousForm = function()
{
	return null;
}

/**
 * @author kznwpr
 * @return new Array()  
 */
MockAppController.prototype.getExternalComponents= function()
{
	return new Array();
}

/**
 * @author kznwpr
 * @return top.AppController  
 */
FormController.prototype.getAppController = function()
{
//	if(top.AppController == null)
//	{
		top.AppController = new MockAppController();
//	}
	return top.AppController;
}
