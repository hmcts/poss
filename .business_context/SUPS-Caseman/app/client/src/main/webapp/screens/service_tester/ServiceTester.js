var REF_DATA_XPATH = "/ds/var/form/ReferenceData";
var SERVICES_XPATH = "/ds/Services";

function ServiceTester() {}
/**
 * @author rzxd7g
 * 
 */
ServiceTester.initialise = function() 
{
	// Load the contents of applicationconfig.xml from the framework Services function
    var appConfigNodes = Services.getFormsNode();
    Services.replaceNode(REF_DATA_XPATH + "/application-config/forms", appConfigNodes);

    var appConfigServices = Services.getNodes(REF_DATA_XPATH + "/application-config/forms/form/service[not(./url = '' or ./method = '')]");
    var serviceNodeTemplate = Services.loadDOMFromURL("Service.xml");
    var methodNodeTemplate = Services.loadDOMFromURL("Method.xml");
    var serviceNode = null;
    var methodNode = null;
    
    var found = new Array();
    for ( var i=0, l=appConfigServices.length; i<l; i++ )
    {
        var serviceName = appConfigServices[i].getAttribute("url");
        var methodName = appConfigServices[i].getAttribute("method");
        if ( null != methodName && null == found[serviceName + methodName] )
        {
	        serviceNode = Services.getNode(SERVICES_XPATH + "/Service[./Name = '" + serviceName + "']");
	        if ( null == serviceNode ) 
	        {
	        	serviceNode = serviceNodeTemplate.cloneNode(true);
	        	serviceNode.selectSingleNode("/Service/Name").text = serviceName;
	        	Services.addNode(serviceNode, SERVICES_XPATH);
	        }
	        
	        methodNode = Services.getNode(SERVICES_XPATH + "/Service[./Name = '" + serviceName + "']/Methods/Method[./Name = '" + methodName + "']");
	        if ( null == methodNode )
	        {
	            methodNode = methodNodeTemplate.cloneNode(true);
	            methodNode.selectSingleNode("/Method/Name").text = methodName;
	        	
	            // Check if the method has any params
	            var params = appConfigServices[i].selectNodes("param");
	            for ( var j=0, pl=params.length; j<pl; j++ )
	            {
	                methodNode.selectSingleNode("/Method/Params").appendChild(params[j]);
	            }
	            
	        	Services.addNode(methodNode, SERVICES_XPATH + "/Service[./Name = '" + serviceName + "']/Methods");
	        	found[serviceName + methodName] = "Y";
	        }
        }
        
        // Reset the nodes
	    serviceNode = null;
	    methodNode = null;
    }
}

function Service_Name() {};
Service_Name.dataBinding = "/ds/ServiceName";
Service_Name.srcData = SERVICES_XPATH;
Service_Name.rowXPath = "Service";
Service_Name.keyXPath = "Name";
Service_Name.displayXPath = "Name";
Service_Name.sortMode = "alphabeticalLowToHigh";
Service_Name.logicOn = [Service_Name.dataBinding];
Service_Name.logic = function() 
{
    Services.setValue(Method_Name.dataBinding, "");
}

function Method_Name() {};
Method_Name.dataBinding = "/ds/MethodName";
Method_Name.srcData = SERVICES_XPATH + "/Service[./Name = " + Service_Name.dataBinding + "]/Methods";
Method_Name.rowXPath = "Method";
Method_Name.keyXPath = "Name";
Method_Name.displayXPath = "Name";
Method_Name.sortMode = "alphabeticalLowToHigh";
Method_Name.srcDataOn = [Service_Name.dataBinding];
Method_Name.retrieveOn = [Service_Name.dataBinding];
Method_Name.logicOn = [Method_Name.dataBinding];
Method_Name.logic = function() 
{
    Services.setValue(Param1Name.dataBinding, "");
    Services.setValue(Param2Name.dataBinding, "");
    Services.setValue(Param3Name.dataBinding, "");
    Services.setValue(Param4Name.dataBinding, "");
    Services.setValue(Param5Name.dataBinding, "");
    Services.setValue(Param1.dataBinding, "");
    Services.setValue(Param2.dataBinding, "");
    Services.setValue(Param3.dataBinding, "");
    Services.setValue(Param4.dataBinding, "");
    Services.setValue(Param5.dataBinding, "");
    
    var nodes = Services.getNodes(SERVICES_XPATH + "/Service[./Name = " + Service_Name.dataBinding + "]/Methods/Method[./Name = " + Method_Name.dataBinding + "]/Params/param");
    for ( var i=1, l=nodes.length; i<=l; i++ )
    {
        Services.setValue("/ds/Param" + i + "Name", nodes[i-1].getAttribute("name"));
    }
}

function Param1Name() {};
Param1Name.dataBinding = "/ds/Param1Name";

function Param2Name() {};
Param2Name.dataBinding = "/ds/Param2Name";

function Param3Name() {};
Param3Name.dataBinding = "/ds/Param3Name";

function Param4Name() {};
Param4Name.dataBinding = "/ds/Param4Name";

function Param5Name() {};
Param5Name.dataBinding = "/ds/Param5Name";

function Param1() {};
Param1.dataBinding = "/ds/Param1";

function Param2() {};
Param2.dataBinding = "/ds/Param2";

function Param3() {};
Param3.dataBinding = "/ds/Param3";

function Param4() {};
Param4.dataBinding = "/ds/Param4";

function Param5() {};
Param5.dataBinding = "/ds/Param5";

function Output_XML() {};
Output_XML.dataBinding = "/ds/OutputXML";

function ExecuteButton() {}
ExecuteButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "ServiceTester" } ]
	}
};
/**
 * @author rzxd7g
 * 
 */
ExecuteButton.actionBinding = function() 
{
    var serviceName = Services.getValue(Service_Name.dataBinding);
    var methodName = Services.getValue(Method_Name.dataBinding);
    
    // SNEAKY HACK.  HEE HEE HEE
    var servicesNode = FormController.getInstance().getAppController().m_config.m_servicesNode;
    if ( servicesNode.selectSingleNode("./service[@url = '" + serviceName + "' and @method = '" + methodName + "']") == null ) 
    {
        var serviceNode = XML.createElement(servicesNode, "service");
        serviceNode.setAttribute("name", methodName);
        serviceNode.setAttribute("url", serviceName);
        serviceNode.setAttribute("method", methodName);
        serviceNode.setAttribute("cache", "none");
        servicesNode.appendChild(serviceNode);
    }
    
	var params = new ServiceParams();
	for ( var i=1; i<6; i++ ) 
	{
	    var paramName = Services.getValue("/ds/Param" + i + "Name");
	    if ( paramName != null && paramName != "" )
	    {
	        var param = Services.getValue("/ds/Param" + i);
	        params.addSimpleParameter(paramName, param);
	    }
	}	
    Services.callService(methodName, params, ExecuteButton, true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
ExecuteButton.onSuccess = function(dom) 
{
    Services.setValue(Output_XML.dataBinding, dom.xml);
}
/**
 * @param exception
 * @author rzxd7g
 * 
 */
ExecuteButton.onSystemException = function(exception) 
{
    Services.setValue(Output_XML.dataBinding, exception.message);
}
/**
 * @param exception
 * @author rzxd7g
 * 
 */
ExecuteButton.onBusinessException = function(exception) 
{
    Services.setValue(Output_XML.dataBinding, exception.message);
}

function CloseButton() {}
CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ServiceTester" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
CloseButton.actionBinding = function() 
{
    Services.navigate(NavigationController.MAIN_MENU);
}
