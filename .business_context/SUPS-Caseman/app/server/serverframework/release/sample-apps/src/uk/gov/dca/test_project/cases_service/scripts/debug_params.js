// This script demonstrates the use of the global scope objects:
// 'out'        - output stream
// 'parameters'	- jdom of parameters to service request
// 'log'        - for logging events/info from the script


// simple JDOM traversal function. Outputs JDOM as XML string.
function outputParams( oElement )
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
	out.write( oElement.getText() );
			
	// now output children
	var oChildren = oElement.getChildren();
	var iNumChildren = oChildren.size();
	
	var i = 0;
	for ( i = 0; i < iNumChildren; i++ )
	{
		outputParams( oChildren.get(i) );
	}
	
	out.write( "</" + oElement.getName() + ">");
}

log.info("Starting debugParams Javascript");

out.write("<DebugParams service='" + context.getSystemItem("service_name") + "' method='" + context.getSystemItem("method_name") + "'>");
outputParams(parameters.getRootElement());
out.write("</DebugParams>");

log.info("Finished debugParams Javascript");