function InteractivePageTest(){};

InteractivePageTest.i = null;
InteractivePageTest.begin = function()
{
	InteractivePageTest.i = new InteractivePageTest();
	InteractivePageTest.i._begin();
}

InteractivePageTest.prototype._begin = function()
{
	this.resultsWindow = window.open("", "Results", "height=600,width=400,scrollbars=yes,resizable=yes");
	
	var thisObj = this;
	this.resultsWindow.onload = function() {thisObj._initiateTests();};	
	this._initiateTests();
}

InteractivePageTest.prototype._initiateTests = function()
{
	// TODO - check whether the window is open for IE
	var funit = new FUnitAsynch();
	funit.startTests(this, window.tests);
}

InteractivePageTest.prototype.processResults = function(tests)
{
	this._renderBlankResults(this.resultsWindow);
	
	var display = this.resultsWindow.document.getElementById("theTestResults");
	
	// Remove any existing test results
	//display.removeChild
	
	var passes = 0;
	var fails = 0;
	for(var i = 0 ; i < tests.length ; i++)
	{
		var result = this.resultsWindow.document.createElement('DIV');
		display.appendChild(result);
		
		// Create new DIV element
		if(tests[i].status == AsynchTest.PASSED)
		{
			passes++;
			result.className = 'FUnitPass';
			result.innerHTML = tests[i].testName + ' has passed in ' + tests[i].duration + "ms";
		}
		else
		{
			fails++;
			result.className = 'FUnitFail';
			result.innerHTML = tests[i].testName + ' has failed with error ' + tests[i].exception.message;
		}
	}
	
	var summary = this.resultsWindow.document.getElementById("theTestSummary");
	summary.innerHTML = 'Tests passed: ' + passes.toString() + '<br/>Tests failed: ' 
	 					+ fails.toString() + '<br/> Total tests: ' + (passes + fails).toString();
}

InteractivePageTest.prototype._renderBlankResults = function(resultsWindow)
{
	// Needs content or does not work in IE
	resultsWindow.document.write("<DIV id='wrapper'>.</DIV>");
	var wrapper = resultsWindow.document.getElementById('wrapper');

	var testPanel = resultsWindow.document.createElement('DIV');
	testPanel.className = "testPanel";
	wrapper.appendChild(testPanel);
	
	var testTitle = resultsWindow.document.createElement('DIV');
	testPanel.appendChild(testTitle);	
	testTitle.innerHTML = "Automated test results";
	
	var testResults = resultsWindow.document.createElement('DIV');
	testResults.id = "theTestResults";
	testPanel.appendChild(testResults);
	
	var testSummary = resultsWindow.document.createElement('DIV')
	testSummary.className = "testResult";
	testSummary.id = "theTestSummary";
	testPanel.appendChild(testSummary);	
}

