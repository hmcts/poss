/*
 * Assertion functions
 */

/*
 * SUPS exception class thrown by the assert functiuons
 */
function SupsTestException(msg)
{
	this.message = msg;
}
SupsTestException.prototype = new Error()
SupsTestException.prototype.constructor = SupsTestException;

function SupsNonApplicableTestException(msg)
{
	this.message = msg;
}
SupsNonApplicableTestException.prototype = new Error()
SupsNonApplicableTestException.prototype.constructor = SupsNonApplicableTestException;

function supsAssert(expression, msg)
{
	if(!expression)
	{
		throw new SupsTestException(msg);
	}
}
 
/*
 * Tests whether the HTML element / adaptor with fieldId has focus
 * @param fieldId The id of the element which should have focus
 */ 
function assertFocused(fieldId)
{
	var fc = FormController.getInstance(); 
	// Had to comment out this test because the focus property had to be unset to allow IE to work
	supsAssert((fc.getAdaptorById(fieldId)).hasFocus(), "Field " + fieldId + " did not get focus");
	/*
	 * In IE we can go further and check focus through the browser
	 */	 
	if(null != document.activeElement)
	{
		supsAssert(document.getElementById(fieldId) == document.activeElement, "Browser belives " + fieldId + " does not have focus");
	}				
}



/*
 * When FUnit is running in interactive mode prompts tester to visually inspect
 * the form and make a selection.
 * Does not run when all tests are being run
 */
function manualAssert(condition)
{
	if(FUnit.interactiveMode())
	{
		var ok = confirm("Please visually confirm:\n" + condition);
		if(!ok)
		{
			throw new SupsTestException("Visual inspection failed for " + condition);
		}
	}
	else
	{
		// Throw unable to test exception becuase the test results of this test are not 
		// conclusive if we havent run all the asserts specified
		throw new SupsNonApplicableTestException("Manual test run in non-interactive mode");
	}
}