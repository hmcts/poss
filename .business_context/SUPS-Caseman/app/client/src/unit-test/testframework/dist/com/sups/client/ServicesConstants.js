// Facade containing all constants available to client side code



/**
 * Enumerated values for types of standard dialogs
 */
StandardDialogTypes = 
{
	OK:				0,
	OK_CANCEL:		1,
	YES_NO:			2,
	YES_NO_CANCEL:	3
};


/**
 * Enumerated values for types of button supported on standard dialogs
 */
StandardDialogButtonTypes = 
{
	OK:				0,
	CANCEL:			1,
	YES:			2,
	NO:				3
};


/**
 * Types of Business Life Cycle events that are supported
 */
BusinessLifeCycleEvents = 
{
	EVENT_RAISE:		"raise",
	EVENT_LOWER:		"lower",
	EVENT_CANCEL:		"cancel",
	EVENT_NAVIGATE:		"navigate",
	EVENT_MODIFY:		"modify",
	EVENT_SUBMIT:		"submit",
	EVENT_CREATE:		"create",
	EVENT_CLEAR:		"clear",
	EVENT_ACTION:		"action"
};


/**
 * States that a form may be in
 */
FormLifeCycleStates =
{
	FORM_BLANK:		"blank",
	FORM_CREATE:	"create",
	FORM_MODIFY:	"modify"
};

FormDatabindings =
{
	DEFAULT_FORM_DATABINDING_ROOT:  "/ds/var/form",
	DEFAULT_SUBFORM_DATABINDING_ROOT:  "/ds/var/subform"
}

	