//===========================================================================
//
// Run all the tests in a page then place the results in the data model
//
//===========================================================================

function BatchTestRun(){};

BatchTestRun.FIRST_FORM_NAME = 'FUnitStartForm';
BatchTestRun.FINAL_FORM_NAME = 'FUnitEndForm';


/**
 * Interval between polling the FormController's ready state in milliseconds
 *
 * @private
 * @type Integer
 */
BatchTestRun.POLL_INTERVAL = 100;


/**
 * Number of polls per minute
 *
 * @private
 * @type Integer
 */
BatchTestRun.NUMBER_OF_POLLS_PER_MINUTE = 60 * 1000 / BatchTestRun.POLL_INTERVAL;


/**
 * Number of times the FormController's ready state has been polled.
 *
 * @private
 * @type Integer
 */
BatchTestRun.prototype.m_numberOfPolls = 0;


BatchTestRun.b = null;
BatchTestRun.begin = function()
{
	BatchTestRun.b = new BatchTestRun();
	BatchTestRun.b._begin();
}

BatchTestRun.prototype._begin = function()
{
    if (FormController.getInstance() == null)
    {
    	try
    	{
	   		FormController.initialise();
	   	}
	   	catch (e)
	   	{
	   		var funit = new FUnitAsynch();
	   		funit.failAllTests(this, e, window.tests);
	   	}
    }
	if(Services.getValue('/ds/var/app/funit/running') == 'true')
	{
//		var thisObj = this;
//		setTimeout(function() {thisObj._beginAfterPause();}, 1000);	
		this._waitForFormControllerInitialisation();
	}
}


BatchTestRun.prototype._waitForFormControllerInitialisation = function()
{
	if(FormController.getInstance().m_ready != true)
	{
		try
		{
			this.m_numberOfPolls++;
			if(this.m_numberOfPolls > BatchTestRun.NUMBER_OF_POLLS_PER_MINUTE)
			{
				var ex = new Error();
				ex.message = "FormController failed to initialise after 1 minute";
				throw ex;
			}
		
			var thisObj = this;
			setTimeout(function() {thisObj._waitForFormControllerInitialisation();}, 100);
		}
		catch (e)
		{
	   		var funit = new FUnitAsynch();
	   		funit.failAllTests(this, e, window.tests);
		}
	}
	else
	{
		var funit = new FUnitAsynch();
		funit.startTests(this, window.tests);
	}
}

/*
BatchTestRun.prototype._beginAfterPause = function()
{
	var funit = new FUnitAsynch();
	funit.startTests(this, window.tests);
}
*/

BatchTestRun.prototype.processResults = function(tests)
{
	// Find this forms node in the test suite
	var fc = FormController.getInstance(); 
	var dom = fc.getDataModel().getInternalDOM();
	var thisFormName = Services.getAppController().m_currentForm.getName();
	var thisSuite = dom.selectSingleNode("/ds/var/app/funit/test-suite[./form-name = '" + thisFormName + "']");
	
	if(thisSuite)
	{
		try
		{				
			for(var i = 0 ; i < tests.length ; i++)
			{
				var testNode = this.addNewNode(thisSuite, 'test');
				
				passNode = this.addNewNode(testNode, 'pass');
				this.addNewNode(testNode, 'test-name', tests[i].testName);
				
				if(tests[i].status == AsynchTest.PASSED)
				{
					XML.replaceNodeTextContent(passNode, "true");
					this.addNewNode(testNode, 'duration', tests[i].duration.toString());
				}
				else
				{
					XML.replaceNodeTextContent(passNode, "false");
					this.addNewNode(testNode, 'error-msg', tests[i].exception.message);
				}
			}
			XML.setElementTextContent(thisSuite, './state', 'complete');
		}
		catch(e)
		{
			XML.setElementTextContent(thisSuite, './state', 'failed-to-run');
		}
		
		this.runNextTestSuite();
	}
}

BatchTestRun.prototype.runNextTestSuite = function()
{
	// Find the next test suite / form to run
	var dom = FormController.getInstance().getDataModel().getInternalDOM();
	var testNodes = dom.selectNodes("/ds/var/app/funit/test-suite[./state = 'not-run']");
	
	if(testNodes.length > 0)
	{
		var formName = XML.selectNodeGetTextContent(testNodes[0], './form-name');
		Services.navigate(formName, false);
	}
	else
	{
		// This is the end of the test run
		Services.navigate(BatchTestRun.FINAL_FORM_NAME, false);
	}
}

BatchTestRun.prototype.addNewNode = function(parent, name, value)
{
	var node = XML.createElement(parent, name);
	if(value) XML.replaceNodeTextContent(node, value);
	parent.appendChild(node);
	return node;
}

BatchTestRun.prototype.getTestSuites = function(appConfigURL)
{
	//var dom = XML.createDOM(null, null, null);
	// Use new DOM loading mechanism
	var dom = Services.loadDOMFromURL(appConfigURL);
	
	var xpath = "//form[@funit = 'true']";
   	var forms = dom.selectNodes(xpath);
   	
   	var formNames = [];
   	for(var i = 0 ; i < forms.length ; i++)
   	{
   		formNames.push(forms[i].getAttribute('name'));
   	}
   	return formNames;
}

BatchTestRun.prototype.initiateBatchRun = function(appConfigURL, resultsXslURL)
{
   	var testSuites = this.getTestSuites(appConfigURL);			
   				
	// Create a list of forms to run
	fc_assert(testSuites.length > 0);
	
	// Remove the node which stores the state of the test run
	Services.removeNode('/ds/var/app/funit');
	var dom = XML.createDOM();
	funitNode = XML.createElement(dom, 'funit');
	
	this.addNewNode(funitNode, 'running', 'true');

	for(var i = 0 ; i < testSuites.length ; i++)
	{
		var testNode = this.addNewNode(funitNode, 'test-suite');
		this.addNewNode(testNode, 'form-name', testSuites[i]);
		this.addNewNode(testNode, 'state', 'not-run');
	}
	
	// Record the start time
	var date = new Date();	
	this.addNewNode(funitNode, 'start-time', date.toString());
		
	// Put the list into the DOM under the persistent area
	Services.addNode(funitNode, '/ds/var/app');

	// Start the navigation process
	this.runNextTestSuite();
}
