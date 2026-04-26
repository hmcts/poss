function FormBusinessLifeCycleDelegate() {};

/**
 * Used when confirmWhenDataModelDirty method is using framework standard dialog
 * rather than browser continue dialog
 */
FormBusinessLifeCycleDelegate.confirmMethod = null;

/**
 * Checks for a dirty datamodel, if the datamodel is NOT dirty then confirm
 * with the user before running method, otherwise just run the method.
 * Ignores blank forms.
 *
 * @param lifecycle the FormLifeCycle which invoked this method.
 * @param - msg - the confirmation message to be presented to the user.
 * @param - method - the method to invoke if required.
 */
FormBusinessLifeCycleDelegate.confirmWhenDataModelDirty = function(lifecycle, confirmMessage, method)
{
    var doMethod = null;
    var a = lifecycle.m_adaptor;

    if(a._isDirty() && a._getState() != FormElementGUIAdaptor.FORM_BLANK)
    {
    	var ac = FormController.getInstance().getAppController();
    	
    	if(ac.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
    	{
    		FormBusinessLifeCycleDelegate.confirmMethod = method;
	        var callbackFunction = function(userResponse)
	        {
	            switch(userResponse)
	            {
	                case StandardDialogButtonTypes.OK:
						FormBusinessLifeCycleDelegate.invokeMethod(FormBusinessLifeCycleDelegate.confirmMethod);
	                    break;
	                default:
	                    break;
	            }
			}
    		Services.showDialog(StandardDialogTypes.OK_CANCEL, callbackFunction, confirmMessage);
    	}
    	else
    	{
	        if(confirm(confirmMessage))
	        {
	            doMethod = true;
	        }
	        else
	        {
	            doMethod = false;
	        }
        }
    }
    else
    {
        doMethod = true;
    }
    
    if(doMethod)
    {
    	FormBusinessLifeCycleDelegate.invokeMethod(method);
    }       
}


/*
 *  Returns all of data in /ds/var/app and /ds/var/form to the "parent"
 *  of this subform.
 */
FormBusinessLifeCycleDelegate.returnDOMToParent = function()
{
    // Get Nodes
    var nodes = new Array();
	nodes["app"] = Services.getNode("/ds/var/app");	
	nodes["form"] = Services.getNode("/ds/var/form");	

	// Get invoking adaptor 
	var invokingAdaptor = FormController.getInstance().getInvokingAdaptor();
	
	// Return nodes to invoking adaptor
	invokingAdaptor.setReturnedDOM(nodes);	
}

        
/*
 *  Invokes a predefined function if it exists and is a function 
 */
FormBusinessLifeCycleDelegate.invokeMethod = function(method)
{
    if(null != method)
    {
        if( typeof method == "function" )
        {
            method.call(this);
        }
        else
        {
            throw new ConfigurationException( 'Error with method configuration (is not a function)' );
        }       
    }
}

/**
 * Method prompts user for required action before a life cycle event
 * when data model is dirty. If dirty user may opt to save data 
 * and then continue with requested life cycle event. Alternatively, 
 * the data may not be saved, but the life cycle event will be 
 * processed. Lastly, the event may be cancelled.
 *
 * If the form is in the state "blank" the life cycle will be executed
 * immediately. Also if the data model is clean the life cycle will
 * be executed without prompting the user.
 *
 * @param lifeCycleObj The associated form business life cycle instance
 * @param msg          The message to be displayed on the standard dialog box
 * @param title        The title to be displayed on the dialog box
 * @param postSubmitEventDetails Details of the life cycle event to be
 *                               dispatched after a successful save
 * @param lifeCycleActionMethod  A function which when invoked performs
 *                               the required actions for the life cycle 
 *
*/
FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty = function(
	lifeCycleObj,
	msg,
	title,
	postSubmitEventDetails,
	lifeCycleActionMethod
)
{
	var adaptor = lifeCycleObj.getAdaptor();
    
    if(adaptor._isDirty() && adaptor._getState() != FormElementGUIAdaptor.FORM_BLANK)
    {
    	// Get application controller to determine dialog style
    	var ac = FormController.getInstance().getAppController();

        // Define callback function to be used by either dialog style
        var callbackFunction = function(userResponse)
        {
            switch (userResponse)
            {
                case StandardDialogButtonTypes.YES:
                
                    FormBusinessLifeCycleDelegate.submitWithDynamicPostSubmitAction(adaptor, postSubmitEventDetails);
                    break;
                    
                case StandardDialogButtonTypes.NO:
                
                    FormBusinessLifeCycleDelegate.invokeMethod(lifeCycleActionMethod);
                    break;
                    
                default:
                    break;
            }
        }
    	
    	if(ac.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
    	{
	        // Use standard dialog to request user for response
	        
	        // Raise standard dialog box
	        Services.showDialog(StandardDialogTypes.YES_NO_CANCEL,
	                            callbackFunction,
	                            msg,
	                            title);
        }
        else
        {
        	// Use Framework defined web dialog to request user for response
        	
        	// First set up URL of web dialog
        	var url = ac.m_config.getAppBaseURL() + "/com/sups/client/gui/form/lifecycles/YesNoCancelDialog.html";
        	
        	if(null == title)
        	{
        		// No title defined, so default to project name
        		title = ac.getProjectName();
        	}
        	
        	// Raise Framework defined web dialog
        	var userResponse = window.showModalDialog(
        		url + "?title=" + title + "&message=" + msg,
        		null,
        		"dialogWidth:500px; dialogHeight:130px; help:no; scroll:no; status:no");
        	
			if(userResponse != null)
			{
				// Dialog not closed using upper right cross
				callbackFunction.call(null, userResponse);
        	}
        }
     }
     else
     {
         // Data model is clean and/or form state blank
         FormBusinessLifeCycleDelegate.invokeMethod(lifeCycleActionMethod);
     }
}

/**
 * Method invokes a submit business life cycle event to save form
 * data. In addition, the method attaches the details of another
 * life cycle event in the submit life cycle details parameter.
 * The submit life cycle will then dispatch the attached event after
 * a successful save operation.
 *
 * @param formAdaptor The form adaptor to dispatch the event to
 * @param businessLifeCycleEvent The business life cycle event to be
 *                               invoked following a successful submit
 *
*/

FormBusinessLifeCycleDelegate.submitWithDynamicPostSubmitAction = function(formAdaptor, businessLifeCycleEvent )
{
	// D814 - If submitting from the subform cancel lifecycle, businessLifeCycleEvent will be null.
	// This is because we don't want to perform the cancel lifecycle again after submitting data
	// because any changes made to the nodes in the returnDOMToParent method by the submit subform
	// lifecycle, by processReturnedData for example, would be overwritten when the cancel lifecycle
	// itself calls returnDOMToParent.
	var detail = null;

	if(businessLifeCycleEvent != null)
	{
    	// Create detail object for submit life cycle
    	detail = new Object();
    	detail[ "postSubmitEventDetails" ] = businessLifeCycleEvent;
    }

    // Dispatch submit life cycle event
    Services.dispatchEvent( formAdaptor.getId(), 
                            BusinessLifeCycleEvents.EVENT_SUBMIT,
                            detail );
}


        

