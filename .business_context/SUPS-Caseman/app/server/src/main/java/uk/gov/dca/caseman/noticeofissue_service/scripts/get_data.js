// This script demonstrates the use of the RemoteService object 
// for invoking EJB services.

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


// Example 1: call service and immediately output returned string.
// The final 'false' parameter to RemoteService.getString makes sure that the  
// xml header is removed so that we do not get a nested XML header in the output.

var sCaseNumber = getCaseNumber( parameters );
out.write("<Root>");
out.write( LocalService.getString("ejb/CaseService","getCase","<params><param name='caseNumber'>" + sCaseNumber + "</param></params>", false) );
outputJDOM( parameters )
out.write("</Root>");

