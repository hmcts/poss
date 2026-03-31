function SingleInteractiveTest(){};

SingleInteractiveTest.s = null;
SingleInteractiveTest.begin = function(selectElem)
{
	SingleInteractiveTest.s = new SingleInteractiveTest();
	SingleInteractiveTest.s._begin(selectElem);
}

SingleInteractiveTest.prototype._begin = function(selectElem)
{
	var testName = selectElem.options[selectElem.selectedIndex].innerHTML;
	if("" != testName && null != testName)
	{
		var testToRun = "test" + testName;
		
		this.funit = new FUnitAsynch();
		this.funit.startTests(this, [testToRun]);
	}
}

SingleInteractiveTest.prototype.processResults = function(tests)
{
	if(tests[0].status == AsynchTest.PASSED)
	{
		alert(tests[0].testName + " has passed without exception");
	}
	else
	{
		alert("Exception thrown: " + tests[0].exception.message);
	}

}

