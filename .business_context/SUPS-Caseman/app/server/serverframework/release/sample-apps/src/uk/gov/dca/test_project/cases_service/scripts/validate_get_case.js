// This script demonstrates javascript validation using the global scope objects:
// 'valid'   	- boolean return value, indicating validity (default is false)
// 'error'		- output stream for providing details if input is invalid
// 'parameters'	- jdom of input XML to validate
// 'log'        - for logging events/info from the script

// utility function to extract case number from params
function getCaseNumber( oRoot )
{
	var sCaseNumber = null;
	var oElem = oRoot.getRootElement();
	oElem = oElem.getChild("param");
	if (oElem != null)
	{
		var oParamName = oElem.getAttributeValue("name");
		if ( oParamName == "caseNumber" )
		{
			sCaseNumber = oElem.getText();
		} 
	}
	
	return sCaseNumber;
}


// simple validity check. Tests to see whether a case number has been provided.
var strCaseNumber = new String(getCaseNumber( parameters ));

if ( strCaseNumber.length == 0 ) 
{
	error.write("No case number provided");
	valid.setFalse();
}
else
{
	valid.setTrue();
}

