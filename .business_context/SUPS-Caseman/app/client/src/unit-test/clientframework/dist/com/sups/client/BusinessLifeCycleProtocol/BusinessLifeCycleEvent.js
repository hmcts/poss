//==================================================================
//
// BusinessLifeCycleEvent.js
//
//
//==================================================================


/**
 * BusinessLifeCycleEvent constructor - use BusinessLifeCycleEvent.create()
 * to actually create instances.
 *
 * @constructor
 */
function BusinessLifeCycleEvent()
{
}


/**
 * The id of the component which is to receive the event
 *
 * @type String
 */
BusinessLifeCycleEvent.prototype.m_id = null;


/**
 * The type of event
 *
 * @type String
 */
BusinessLifeCycleEvent.prototype.m_type = null;


/**
 * Additional detail required by the event
 *
 * @type Object
 */
BusinessLifeCycleEvent.prototype.m_detail = null;


/**
 * Create a new BusinessLifeCycleEvent
 *
 * @param id the string Id component which is to receive the event
 * @param type the type of event as a string.
 * @param detail additional detail object required by the particular event type. May be null.
 * @return a new BusinessLifeCycleEvent
 * @type BusinessLifeCycleEvent
 */
BusinessLifeCycleEvent.create = function(id, type, detail)
{
	var e = new BusinessLifeCycleEvent();
	e.m_id = id;
	e.m_type = type;
	e.m_detail = detail;
	return e;
}


/**
 * Get the id of the component which is to receive the event
 *
 * @return the id of the component which is to receive the event
 * @type String
 */
BusinessLifeCycleEvent.prototype.getComponentId = function()
{
	return this.m_id;
}


/**
 * Get the type of the event
 *
 * @return the type of the event
 * @type String
 */
BusinessLifeCycleEvent.prototype.getType = function()
{
	return this.m_type;
}


/**
 * Get the detail object of the event
 *
 * @return the detail object associated with the event
 * @type Object
 */
BusinessLifeCycleEvent.prototype.getDetail = function()
{
	return this.m_detail;
}
