//==================================================================
//
// PopupLowerBusinessLifeCycle.js
//
// Business Life Cycle class for lowering popups. This is along with
// PopupRaiseBusinessLifeCycle are essentially BusinessLifeCycle
// adaptors for the ComponentVisibilityProtocol, and therefore can
// generally be re-used for all components supporting the
// ComponentVisibilityProtocol.
//
//==================================================================


/**
 * BusinessLifeCycle to lower a popup
 */
function PopupLowerBusinessLifeCycle() {}

// PopupLowerBusinessLifeCycle is a sub class of BusinessLifeCycle
PopupLowerBusinessLifeCycle.prototype = new BusinessLifeCycle();
PopupLowerBusinessLifeCycle.prototype.constructor = PopupLowerBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
PopupLowerBusinessLifeCycle.prototype.getName = function()
{
	return BusinessLifeCycleEvents.EVENT_LOWER;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be hidden
 *
 * @param e the BusinessLifeCycleEvent
 */
PopupLowerBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	this.m_adaptor.show(false);
}
