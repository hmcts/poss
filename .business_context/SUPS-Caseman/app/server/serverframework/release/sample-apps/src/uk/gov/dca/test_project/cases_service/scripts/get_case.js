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
		log.info(">>>>> get_cases.js: oElem was not null, setting sCaseNumber to " + sCaseNumber);
	}
	else{
		log.error(">>>>> get_cases.js: oElem was null, setting caseNumber to 4WB00001");
		sCaseNumber = "4WB00001";
	}
	
	return sCaseNumber;
}

// utility function to traverse JDOM, outputting as string.
function outputJDOM( oElement )
{

	

	// first output current element	
	out.write( "<" + oElement.getName() );
	var oAttributes = oElement.getAttributes();
		
	var n = 0;
	for ( n = 0; n < oAttributes.size(); n++ )
	{
		var oAttribute = oAttributes.get(n);
		out.write( " " + oAttribute.getName() + "='" + oAttribute.getValue() + "'"); 
	}
		
	out.write( ">" );
			
	// now output children
	var oChildren = oElement.getChildren();
	var iNumChildren = oChildren.size();
	if ( iNumChildren > 0 )
	{
		out.write("\r\n");
		
		var i = 0;
		for ( i = 0; i < iNumChildren; i++ )
		{
			outputJDOM( oChildren.get(i) );	
		}
	}
	else
	{
		out.write( oElement.getText() );
	}
	
	out.write( "</" + oElement.getName() + ">\r\n");
}

// Example 1: call service and immediately output returned string.
// The final 'false' parameter to RemoteService.getString makes sure that the  
// xml header is removed so that we do not get a nested XML header in the output.

var sCaseNumber = getCaseNumber( parameters );

log.info(">>>>> get_cases.js: sCaseNumber: " + sCaseNumber);

out.write("<Cases>");
out.write( LocalService.getString("ejb/CasesServiceLocal","getCaseLocal","<params><param name='courtId'>1</param><param name='businessProcessId'>processABC</param><param name='caseNumber'>" + sCaseNumber + "</param></params>", false) );


// Example 2: call service and get case returned in a JDOM.
// Traverse JDOM and write out as string.

var oDoc = LocalService.getJDOM("ejb/CasesServiceLocal","getCaseLocal","<params><param name='courtId'>1</param><param name='businessProcessId'>processABC</param><param name='caseNumber'>" + sCaseNumber + "</param></params>");
if(oDoc == null){
	log.error(">>>>> get_cases.js: oDoc was null after trying to retrieve case: " + sCaseNumber);
}
else{
	log.info(">>>>> get_cases.js: oDoc retrieved case: " + sCaseNumber);
	outputJDOM( oDoc.getRootElement() );
}

out.write("</Cases>");

