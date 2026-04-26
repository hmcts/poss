// This is a very basic implementation just to provide a stub to establish the mechanism.
// The value returned can be any object. It returns 'null' if validation succeeded.
// The Java FormValidator currently converts the returned object to a string and throws
// it in a Java exception. 
function validateForm( formId, formInputElement )
{
	var result = null;
	
	if ( formInputElement == null )
	{
		result = "No XML provided to validateForm";
	}
	
	return result;
}