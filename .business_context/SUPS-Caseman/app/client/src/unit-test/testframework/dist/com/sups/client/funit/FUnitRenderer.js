function FUnitRenderer(){};
FUnitRenderer.createInline = function()
{

	document.write("<DIV id='_funit-PleaseIgnore'></DIV>");
	var wrapper = document.getElementById("_funit-PleaseIgnore");
		
	var buttonElem = document.createElement('INPUT');
	buttonElem.type = 'BUTTON';
	wrapper.appendChild(buttonElem);
	buttonElem.value = "Run automated tests";
	
	var selectElem = document.createElement('SELECT');
	wrapper.appendChild(selectElem);
	
	// Insert empty option
	var blank = document.createElement('OPTION');
	selectElem.appendChild(blank);

	if(null != tests)
	{
		// Get the list of tests and set options
		for(var i = 0 ; i < tests.length ; i++)
		{
			var optionElem = document.createElement('OPTION');
			selectElem.appendChild(optionElem);
			optionElem._funitTest = tests[i];
			optionElem.innerHTML = tests[i].substr(4);
		}
		
		// Set the event handlers (only if there are tests to run)
		selectElem.onchange = function(){SingleInteractiveTest.begin(selectElem);};
		buttonElem.onclick = InteractivePageTest.begin;
	}
	else
	{
		// No tests to call
		buttonElem.onclick = function() {alert("There are no tests defined");};
	}
}

