// This contains the objects required for doing the precompile
//
// It also overrrides several methods not required by the precompile

AppController.origInit =  AppController.initialise;

// Start up the appControler and start running through all of the pages.
AppController.initialise = function(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight)
{
	AppController.origInit(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight);
	    
	var precomp = PrecompileForm.getInstance();  
	precomp.init(); 
	precomp.runBatch(); 
	
}

PrecompileForm.m_instance =  null;

/*
 * Object containing all of the precompile methods.
 */
function PrecompileForm(){
	PrecompileForm.m_instance = this;
};

PrecompileForm.prototype.init = function()
{
    this.appC = AppController.getInstance();
    this.fso = new ActiveXObject("Scripting.FileSystemObject");
	// where must the files be written to
    this.destinationDir = "@PRECOMPILE_DESTINATION_DIR@";   
    // specify wheter we use the server to write the js files or the FileSystemObject ActiveX Control
    this.useClientBuildService = "@USE_CLIENTBUILD_SERVICE@";     
    this.alertPrecompileComplete = "@ALERT_PRECOMPILE_COMPLETE@";
    this.precompileLog = "";
}

/* 
 * Start running the precompile
 * 
 * Loads all the forms to be used from applicationconfig.xml
 *
 * Sets up a listener to call this.formLoaded when the page loading is complete
 * before invoking form load.
 * 
 * Ignores files with the attribute precompile="no" in the applicationconfig.xml
 */
PrecompileForm.prototype.runBatch = function()
{
    // Register with the formReadyListener.
    var thisObj = this;
    this.appC.m_mainFormView.registerFormReadyListener(function(){thisObj.formLoaded()});   
   
    // Get an array of all forms to be loaded
    this.formNodeArray = this.appC.m_config.m_config.selectNodes("/" + "/form/@name");    
    
    if (this.formNodeArray.length == 0)
    {
        //alert("No forms found? Possible Error?"); 
        return;
    }
   
    this.currentFormIndex = 0;
   
    // This function will be invoked after sending the precompile to the server. 
    var thisObj = this;
    this.callBack = function(){thisObj.continueBatchRun()};
    
    this.formToLoad = XML.getNodeTextContent(this.formNodeArray[this.currentFormIndex]);
    
    var precompile = this.appC.m_config.getForm(this.formToLoad).m_precompile; 
    if (precompile != null && precompile == "no") 
    {
	    PrecompileForm.getInstance().log("\n[Form " + this.formToLoad + "] precompiile set to no");
        this.continueBatchRun();
        return; 
    } 
    
    this.loadForm(this.formToLoad);
}   

PrecompileForm.prototype.loadForm = function()
{
	
	//alert("Loading form: " + this.formToLoad + "\n" + PrecompileForm.getLog());
	try{
	    this.appC.navigate(this.formToLoad);
	}
	catch(navException){
		PrecompileForm.getInstance().log("\n[Form " + this.formToLoad + "] Form failed to load");
		this.continueBatchRun();
	}	
    // Let the formloading start and then wait for it to load
    // The listener will notify us when this has happened.
} 

/*
 *  Once the form has loaded calculate the precompile invoke the function 
 *  "ClientBuild" which will save it on the server.
 *
 *  Will callback after service call to continueBatchRun
 */
PrecompileForm.prototype.formLoaded = function()
{	
    var cw = this.appC.m_mainFormView.m_frame.m_frame.contentWindow;
    
    var precomp = null;
    try{
    	precomp = cw.SerialisationUtils.getPrecompile();
    	this.writePrecomp(this.formToLoad, this.destinationDir, precomp, this.useClientBuildService, true);
    }
    catch(serializeException){
    	PrecompileForm.getInstance().log("\n[Form " + this.formToLoad + "] Failed serialisation and saving of precompilation of file");
    	this.continueBatchRun();
    	return;
    }
    PrecompileForm.getInstance().log("\n[Form " + this.formToLoad + "] Precompile successfull");    	
}

PrecompileForm.prototype.writePrecomp = function(theFormName, theDestination, precomp, callClientBuildService, continueBatchRun){
    if(callClientBuildService === "true"){
	    var params = new ServiceParams();
	    params.addSimpleParameter("data", precomp);             
	    params.addSimpleParameter("formName", theFormName); 
	    params.addSimpleParameter("destinationDir", theDestination);            
	    
	    var handler = new Object(); 
	    var thisObj = this;
	    handler.onSuccess = function(){thisObj.callBack();}; // this.continueBatchRun unless precompiling single form
	                                                         // see PrecompileForm.prototype.preCompileSingleForm
	    var async = true;
	    var showProgress = true;
	    var mappingName = "ClientBuild";
	    
	    this.appC.m_config.setServiceBaseURL("/clientbuild"); // change the baseurl to the ClientBuild application's

	    var ds = cw.fwServiceCallDataLoader.create(this.mappingName,params,handler,async,showProgress);        
    	ds.load(); 
    	precomp = null;
    	
    }
    else{		
		var newPath = this.fso.BuildPath(this.destinationDir, theFormName + ".js");
		try{
			this.fso.DeleteFile(newPath, true);
		}
		catch(fsoException){
			// it does not really matter if the file was not there as the build script probably removed it in the first place
		}
		try{
			var testStream = this.fso.CreateTextFile(newPath, true);
			testStream.write(precomp);
			testStream.close();
			testStream = null;
		}
		catch(fsoException){
			// it does not really matter if the file was not there as the build script probably removed it in the first place
			//alert("Unable to write precompilation file: " + newPath);
		}
		newPath=null;
		if(continueBatchRun){
			this.continueBatchRun();
		}
    }
}



/*
 * Is the callback function after the precompile is sent to the server
 * Gets the next form to be processed and loads it
 */
PrecompileForm.prototype.continueBatchRun = function()
{

    this.currentFormIndex++;    
    if (this.currentFormIndex ==  this.formNodeArray.length)
    {
        // Finished processing forms
        this.precompileComplete();
        return; 
    }
    
    this.formToLoad = XML.getNodeTextContent(this.formNodeArray[this.currentFormIndex]);
    var precompile = this.appC.m_config.getForm(this.formToLoad).m_precompile; 

    PrecompileForm.getInstance().log("\n[Form " + this.formToLoad + "] precompiile set to " + precompile);
    if (precompile != null && precompile == "no")
    {
    	        
        this.continueBatchRun();
        return; 
    } 
    
    this.loadForm(this.formToLoad);
}

/*
 * Finished doing the precompile so save a file called ____precompilationComplete
 * so that the server knows everything has finished.
 */
PrecompileForm.prototype.precompileComplete = function()
{
            
	this.writePrecomp("precompileLog.txt", this.destinationDir, PrecompileForm.getInstance().getLog(), this.useClientBuildService, false); 
	this.writePrecomp("____precompilationComplete", this.destinationDir, "", this.useClientBuildService, false); 
 
    if(this.alertPrecompileComplete === "true"){
        alert("Form precompilation complete");
        this.appC.shutdown();
    }

}

/* 
 * Precompiles a single form instead of all of them
 */
PrecompileForm.prototype.preCompileSingleForm = function(form)
{
    this.formToLoad = form;
    var thisObj = this;
    this.callBack = function(){thisObj.singleFormLoaded();};
    this.loadForm(this.formToLoad);
}

PrecompileForm.prototype.singleFormLoaded = function(formName)
{
    if(this.alertPrecompileComplete == "true"){   
        alert("Form precompilation complete");
    }
}

PrecompileForm.prototype.log = function(theMsg){
	this.precompileLog = this.precompileLog + theMsg;
}

PrecompileForm.prototype.getLog = function(){
	return this.precompileLog;
}

PrecompileForm.getInstance = function()
{
	if(PrecompileForm.m_instance == null){
		PrecompileForm.m_instance = new PrecompileForm();		
	}
	return PrecompileForm.m_instance;
}

FormController.handleFatalException = function(exception)
{
	top["PrecompileForm"].m_instance.log(fwException.getErrorMessage("\n" + exception));   
	top["PrecompileForm"].m_instance.continueBatchRun();
}

/**
we want to append the exception to the log file
*/
fwException.invokeFatalExceptionHandler = function(exception)
{
	top["PrecompileForm"].m_instance.log(fwException.getErrorMessage("\n" + exception));   
	top["PrecompileForm"].m_instance.continueBatchRun();
}

/**
 we are the fatal exception handler for 
 fwException.invokeFatalExceptionHandler and FormController.handleFatalException
 */
fwException.setFatalExceptionHandler = function(handler)
{	
}

/**
 we are the fatal exception handler for 
 fwException.invokeFatalExceptionHandler and FormController.handleFatalException
 */
FormController.setFatalExceptionHandler = function(handler)
{
}


// Not loading referencedata
FormElementGUIAdaptor.prototype._loadReferenceData = function(withEvents)
{
}

// Not loading modeldata
FormElementGUIAdaptor.prototype._loadInitialModelData = function(withEvents)
{
}

// Not running initialiseLifecycles
FormController.prototype.runInitialiseLifecycle = function()
{
}

// We always want access 
SecurityContext.prototype.hasAccess = function(formRequiredRoles)
{
    return true;
}

// Not loading dynamic pages

// The presence of dynamic pages may generate additional serialised data which will
// cause problems when the serialised data is interpreted by the running application.
PagedAreaGUIAdaptor.prototype._findAndLoadDynamicPage = function(pageId)
{
    return null;
}

// Some setDefault on subforms methods fail because normally the parent form has
// any required data setup before a subform is raised. With precompile this is not
// the case.
GUIAdaptor.prototype.initialiseStates = function(e)
{
	// Override Data Binding Protocol method with an empty function
	this.invokeSetDefault = function(e) {};
	
	Services.startTransaction();
    	for (var i = 0, l = this.m_initialiseList.length; i < l; i++)
	{
		this[this.m_initialiseList[i]].call(this,e);
	}
	Services.endTransaction();
}

// Not calling services
Services.callService = function(mappingName, parameters, handler, async, showProgress)
{
}

// Not really required because of initialiseStates override but Family Man want it in
DataBindingProtocol.prototype.invokeSetDefault = function(e)
{
}

