//===========================================================================
//
// JSUnit style testing utilities for use within the SUPS framework which
// support asynchronous tests
//
//===========================================================================

function AsynchTest(testFunctionName)
{
	this.testName = testFunctionName.substr(4);
	this.testFunction = testFunctionName;
	this.validateFunction = "asynchValidate" + this.testName;
	this.status = AsynchTest.NOT_RUN;
}
AsynchTest.PASSED = 0;
AsynchTest.FAILED = 1;
AsynchTest.RUNNING = 2;
AsynchTest.NOT_RUN = 3;

AsynchTest.DELAY = 1000;

FUnitAsynch.asynchSetup = false;
AsynchTest._testUnderSetup = null;


AsynchTest.prototype.runTest = function()
{
	// TODO - Add test specific asynchronous setup

	// Have to set this first in case the
	// setup is actually synchronus even tho
	// the developer has asked for an asynch setup
	if(FUnitAsynch.asynchSetup)
	{
		AsynchTest._testUnderSetup = this;
	}

	if(window.setup != undefined)
	{
		window.setup.call(window);	
	}
	
	if(!FUnitAsynch.asynchSetup)
	{
		AsynchTest._testUnderSetup = null;
		this.executeTest();
	}
}

AsynchTest.setupComplete = function()
{
	AsynchTest._testUnderSetup.executeTest();
}

AsynchTest.prototype.executeTest = function()
{
	try
	{
		this.startTime = new Date();
		window[this.testFunction].call(window);

		this.status = AsynchTest.RUNNING;
	}
	catch(e)
	{
		// An exception has occured durung test execution
		this.status = AsynchTest.FAILED;
		this.exception = e;
	}
}

AsynchTest.prototype.validateTest = function()
{
	var endTime = new Date();
	this.duration = (endTime.getTime() - this.startTime.getTime()) - AsynchTest.DELAY;
	
	try
	{
		if(window[this.validateFunction] != undefined)
		{
			window[this.validateFunction].call(window);	
		}
		this.status = AsynchTest.PASSED;
	}
	catch(e)
	{
		// An exception has occured durung test execution
		this.status = AsynchTest.FAILED;
		this.exception = e;
	}
	
	if(window.teardown != undefined)
	{
		window.teardown.call(window);	
	}
}


/**
 * Mark a test as failed 
 *
 * @param exception the exception which caused the failure
 */
AsynchTest.prototype.fail = function(exception)
{
	this.status = AsynchTest.FAILED;
	this.exception = exception;
}


function FUnitAsynch()
{
	this.tests = [];
}

FUnitAsynch.prototype.startTests = function(resultsHandler, testNames)
{

	this.resultsHandler = resultsHandler;

	// Find all the tests in this page to run asynchronusly
	
	// Create the test array
	for(var i = 0 ; i < testNames.length ; i++)
	{
		this.tests.push(new AsynchTest(testNames[i]));
	}
	
	this.runNextTest();
}


FUnitAsynch.prototype.failAllTests = function(resultsHandler, exception, testNames)
{
	this.resultsHandler = resultsHandler;

	for(var i = 0; i < testNames.length; i++)
	{
		var test = new AsynchTest(testNames[i]);
		test.fail(exception);
		this.tests.push(test);
	}
		
	this._invokeResultsHandler();
}


FUnitAsynch.prototype.runNextTest = function()
{
	var currentTest = null;
	for(var i = 0 ; i < this.tests.length ; i++)
	{
		if(this.tests[i].status == AsynchTest.NOT_RUN)
		{
			currentTest = this.tests[i];
			currentTest.runTest();		
			break;
		}
	}
	
	if(currentTest)
	{
		var thisObj = this;
		setTimeout(function() {thisObj.checkTestResult(currentTest);}, AsynchTest.DELAY);	
	}
	else
	{
		this._invokeResultsHandler();
	}
}


FUnitAsynch.prototype._invokeResultsHandler = function()
{
	// Finished test run
	this.resultsHandler.processResults.call(this.resultsHandler, this.tests);
}


FUnitAsynch.prototype.checkTestResult = function(targetTest)
{
	if(targetTest.status == AsynchTest.RUNNING)
	{
		// The test is still running, i.e. it hasnt already failed
		targetTest.validateTest();
	}
	this.runNextTest();
}	


