/**
 * GUIAdaptor which creates a second "form within a form" - containing
 * a full FormController, DataModel etc (but no AppController)
 */
function SubformElementGUIAdaptor() {};


/**
 * Subforms derived from FormElementGUIAdaptor
 */ 
SubformElementGUIAdaptor.prototype = new FormElementGUIAdaptor();


/**
 * Set the constructor property so we can identify the type
 */
SubformElementGUIAdaptor.prototype.constructor = SubformElementGUIAdaptor;


SubformElementGUIAdaptor.CSS_CLASS = "subform";


/**
 * Subform required databinding is different to forms
 */
SubformElementGUIAdaptor.prototype.FORM_REQUIRED_DATABINDING_ROOT = FormDatabindings.DEFAULT_SUBFORM_DATABINDING_ROOT;

/**
 * Initialise the FormElementGUIAdaptor
 *
 * @param e the input element to manage
 */
SubformElementGUIAdaptor.create = function(e)
{
	var a = new SubformElementGUIAdaptor();
	
	a._initialiseAdaptor(e);	
	
	return a;
}

/*
 * Configures cancel and submit business lifecycles 
 * before invoking the parent and passing up the remaining configurations.
 */
SubformElementGUIAdaptor.prototype._configure = function(cs)
{
	this.includeInValidation = false;
	
	var cancelBusinessLifeCycle = new CancelSubformBusinessLifeCycle();
	cancelBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(cancelBusinessLifeCycle);
	
	var submitSubformBusinessLifeCycle = new SubmitSubformBusinessLifeCycle();
	submitSubformBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(submitSubformBusinessLifeCycle);
	
	var cancel = null;
	var submit = null;
	
	var newCs = new Array();

	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		// Get the event configuration objects for CANCEL
		if(c.cancelLifeCycle && cancel == null)
		{
			cancelBusinessLifeCycle.configure(c.cancelLifeCycle);
			cs[i].cancelLifeCycle = null;
		}
		
		// Get the event configuration objects for SUBMIT
		if(c.submitLifeCycle && submit == null)
		{
			submitSubformBusinessLifeCycle.configure(c.submitLifeCycle);
			cs[i].submitLifeCycle = null;
		}
	}

	
	// Start form life cycle event handlers 
	cancelBusinessLifeCycle.start();
	submitSubformBusinessLifeCycle.start();

	// Call parent and process remaining configuration items. 
    FormElementGUIAdaptor.prototype._configure.call(this,cs);
    
}


SubformElementGUIAdaptor.prototype.renderState = function()
{
	this._renderForm(SubformElementGUIAdaptor.CSS_CLASS);
}


/**
 * Stores an array of nodes (relative to /ds/var) which will 
 * not be cleared when clearDataModel is invoked.
 */
SubformElementGUIAdaptor.prototype.m_dmClearExclusionNodes = new Array("app","form","subform");



