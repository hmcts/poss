

/**
 * Class to represent an event queue
 */
function EventQueue()
{
}

EventQueue.m_logger = new Category("EventQueue");
EventQueue.prototype.m_queue = null;
EventQueue.prototype.m_processingQueue = null;


/*
 * @param queueName : The name of the queue, e.g. Validation
 */
EventQueue.prototype._initEventQueue = function()
{
	this.m_queue = new Array();
}


/**
 * Add event to queue
 *
 * @param a the affected GUIAdaptor
 * @param e the DataModelEvent
 * @param d additional detail associated with the event
 */
EventQueue.prototype.addEventToQueue = function(a, e, d)
{
	if(EventQueue.m_logger.isDebug()) EventQueue.m_logger.debug(this.getName() + " check queued for GUIAdaptor: " + a.getId());
	
	this.m_queue.push({adaptor: a, event: e, detail: d});
}


EventQueue.prototype.hasEvents = function()
{
	return this.m_queue.length > 0;
}

/**
 * Process event queue
 * recheckQueue = true;
 * @return the repaint queue
 */
EventQueue.prototype.processEvents = function(repaintQueue)
{
	var name = this.getName() + "_EventQueue_processEvents";
	/*(name)*/

	// Swap out current queue so that new events generated while
	// processing this queue are added to a new queue.
	var q = this.m_queue;
	this.m_queue = new Array();

	if(EventQueue.m_logger.isInfo())
	{
		EventQueue.m_logger.info(this.getName() + ".processEvents() number of events = " + q.length);
	}

	// Actually process the events in the queue
	repaintQueue = this._processEvents(q, repaintQueue);
	
	/*(name)*/

	return repaintQueue;
}


/**
 * Process the events in the supplied array. This method must be
 * recursively re-entrant.
 *
 * @param q the array containing the events to process
 * @param repaintQueue the list of items to repaint
 * @return the updated list of items to repaint
 * @type Array[GUIAdaptors]
 * @protected
 */
EventQueue.prototype._processEvents = function(q, repaintQueue)
{
	for(var i = 0, l = q.length; i < l; i++)
	{
		this._processEvent(q[i], repaintQueue);
	}
	
	return repaintQueue;
}


EventQueue.prototype._processEvent = function(queuedItem, repaintQueue)
{
	var adaptor = queuedItem.adaptor;
	var event = queuedItem.event;
	var detail = queuedItem.detail;
	
	// Retrieve adaptor id for registration in repaint queue
	var id = adaptor.getId();
	
	var debug = EventQueue.m_logger.isDebug();
	if(debug) EventQueue.m_logger.debug(this.getName() + " event not previously processed for field: " + id);
	
	if(this.processEvent(adaptor, event, detail))
	{
		if(debug) EventQueue.m_logger.debug(this.getName() + " requires repaint for field: " + id);
		repaintQueue[id] = adaptor;
	}
	else
	{
		if(debug) EventQueue.m_logger.debug(this.getName() + " no repaint required for field: " + id);
	}
}


/**
 * Handle the event for this particular queue type.
 *
 * Default implementation has no effect.
 *
 * @param adaptor the GUIAdaptor affected by the event
 * @param event the DataModelEvent which caused the adaptor to be on the queue
 * @return true if the field needs to be repainted due to the event
 * @type boolean
 */
EventQueue.prototype.processEvent = function(adaptor, event, detail)
{
	return false;
}

EventQueue.prototype.getName = function()
{
	return null;
}


EventQueue.prototype.removeEventsForAdaptor = function(a)
{
	// Run the the queue, removing events for the supplied adaptor
	var nq = [];
	for(var i = 0, q = this.m_queue, l = q.length; i < l; i++)
	{
		// If the event is not for the removed adaptor,
		// then add the adaptor back into the queue.
		var qi = q[i];
		if(qi.adaptor != a)
		{
			nq.push(qi);
		}
	}
	
	this.m_queue = nq;
}


function CompressedEventQueue()
{
}

CompressedEventQueue.prototype = new EventQueue();
CompressedEventQueue.prototype.constructor = CompressedEventQueue;


CompressedEventQueue.prototype._processEvents = function(q, repaintQueue)
{
	// Map containing the eventIds of processed events. If the queue contains
	// multiple events with duplicate eventIds, only the first event will be
	// processed with subsequent events being discarded.
	var processedEvents = new Object();
	
	for(var i = 0, l = q.length; i < l; i++)
	{
		var qi = q[i];
		var eventId = this._createEventId(qi);
		
		if(null == processedEvents[eventId])
		{
			// Record the fact that we've processed events for this eventId
			processedEvents[eventId] = true;

			if(EventQueue.m_logger.isDebug()) EventQueue.m_logger.debug(this.getName() + " event not previously processed for field: " + qi.adaptor.getId());
			
			this._processEvent(qi, repaintQueue);
		}
		else
		{
			if(EventQueue.m_logger.isDebug()) EventQueue.m_logger.debug(this.getName() + " event already processed for field: " + qi.adaptor.getId());
		}
	}
	
	return repaintQueue;
}


/**
 * Default method to create an id for the event being processed. Generally,
 * the id is simply the adaptor id as returned here. However, for some
 * queues a more complex identifier is required.
 *
 */
CompressedEventQueue.prototype._createEventId = function(queuedItem)
{
    return queuedItem.adaptor.getId();
}


function ValidationEventQueue()
{
	this._initEventQueue();
}


// ValidationEventQueue is a sub class of EventQueue
ValidationEventQueue.prototype = new CompressedEventQueue();
ValidationEventQueue.prototype.constructor = ValidationEventQueue;


ValidationEventQueue.prototype.getName = function()
{
	return FormController.VALIDATION;
}


ValidationEventQueue.prototype.processEvent = function(a, e)
{
    var  error = a.invokeValidate(e);
    a.setLastError(error);
    // Tell the adaptor whether the field is valid or not, and return a boolean
    // indicating whether or not the field needs repainting to reflect a state change.
    return a.setValid(error == null);
}

function ServerValidationEventQueue()
{
	this._initEventQueue();
}


// ValidationEventQueue is a sub class of EventQueue
ServerValidationEventQueue.prototype = new CompressedEventQueue();
ServerValidationEventQueue.prototype.constructor = ServerValidationEventQueue;


ServerValidationEventQueue.prototype.getName = function()
{
	return FormController.SERVER_VALIDATION;
}


ServerValidationEventQueue.prototype.processEvent = function(a, e)
{
	var repaint = a.invokeServerValidate(e);
	if(repaint == false)
	{
		// Server validation not invoked
		if(a.m_valid)
		{
			// Not invalid so clear any error
			a.setLastError(null);
		}
		a.setServerValid(true);
	}
	return repaint;
}


function ReadOnlyEventQueue()
{
	this._initEventQueue();
}


// ReadOnlyEventQueue is a sub class of EventQueue
ReadOnlyEventQueue.prototype = new CompressedEventQueue();
ReadOnlyEventQueue.prototype.constructor = ReadOnlyEventQueue;


ReadOnlyEventQueue.prototype.getName = function()
{
	return FormController.READONLY;
}


ReadOnlyEventQueue.prototype.processEvent = function(a, e)
{
	// Determine whether or not the field is readOnly.
	// Return a boolean that indicates whether the field needs
	// repainting to reflect a state change.
	return a.setReadOnly(a.invokeIsReadOnly(e));
}


function SrcDataEventQueue()
{
	this._initEventQueue();
}


// SrcDataEventQueue is a sub class of EventQueue
SrcDataEventQueue.prototype = new CompressedEventQueue();
SrcDataEventQueue.prototype.constructor = SrcDataEventQueue;


SrcDataEventQueue.prototype.getName = function()
{
	return FormController.SRCDATA;
}


SrcDataEventQueue.prototype.processEvent = function(a, e)
{
	return a.invokeRetrieveSrcData(e);
}

function SrcDataFilterEventQueue()
{
	this._initEventQueue();
}


// SrcDataEventQueue is a sub class of EventQueue
SrcDataFilterEventQueue.prototype = new CompressedEventQueue();
SrcDataFilterEventQueue.prototype.constructor = SrcDataFilterEventQueue;


SrcDataFilterEventQueue.prototype.getName = function()
{
	return FormController.FILTER;
}


SrcDataFilterEventQueue.prototype.processEvent = function(a, e)
{
	return a.invokeFilterSrcData(e);
}


function LogicEventQueue()
{
	this._initEventQueue() ;
}

//Logic EventQueue is a sub class of EventQueue	
LogicEventQueue.prototype = new CompressedEventQueue() ;
LogicEventQueue.prototype.constructor = LogicEventQueue ;

LogicEventQueue.prototype.getName = function()
{
	return FormController.LOGIC
}

LogicEventQueue.prototype.processEvent = function(a,e)
{
	//Invoke the Logic
	a.invokeLogic(e) ;
	
	// LogicValues never cause the field to be added to the repaint queue.
	return false ;
}

function MandatoryEventQueue()
{
	this._initEventQueue();
}


// MandatoryEventQueue is a sub class of EventQueue
MandatoryEventQueue.prototype = new CompressedEventQueue();
MandatoryEventQueue.prototype.constructor = MandatoryEventQueue;


MandatoryEventQueue.prototype.getName = function()
{
	return FormController.MANDATORY;
}


MandatoryEventQueue.prototype.processEvent = function(a, e)
{
    var  mandatory = a.invokeIsMandatory(e);
    return a.setMandatory(mandatory);
}


function RefreshEventQueue()
{
	this._initEventQueue();
}


// RefreshEventQueue is a sub class of EventQueue
RefreshEventQueue.prototype = new CompressedEventQueue();
RefreshEventQueue.prototype.constructor = RefreshEventQueue;


RefreshEventQueue.prototype.getName = function()
{
	return FormController.REFRESH;
}


RefreshEventQueue.prototype.processEvent = function(a, e)
{
	return a.invokeRetrieve(e);
}


function EnablementEventQueue()
{
	this._initEventQueue();
}


// EnablementEventQueue is a sub class of EventQueue
EnablementEventQueue.prototype = new CompressedEventQueue();
EnablementEventQueue.prototype.constructor = EnablementEventQueue;


EnablementEventQueue.prototype.getName = function()
{
	return FormController.ENABLEMENT;
}


EnablementEventQueue.prototype.processEvent = function(a, e, detail)
{
	// Determine whether or not the field is enabled.
	// Return a boolean that indicates whether the field needs
	// repainting to reflect a state change.
	return a.setEnabled(a.invokeIsEnabled(e), detail);
}

/**
 * This method returns an identifier for an event being processed in the queue.
 * Some adaptors, such as the MenuGUIAdaptor, have multiple components on
 * the adaptor which may be enabled. In such cases the event id must also
 * contain the identifier of the menu item component.
 *
*/
EnablementEventQueue.prototype._createEventId = function(queuedItem)
{
	var id = queuedItem.adaptor.getId();

    // Check for detail in associated form controller listener
    var enablementSubComponentId = queuedItem.detail.m_detail;

    if(null != enablementSubComponentId)
    {
        id += "_" + enablementSubComponentId;
    }
    
    return id;
}

function LabelEventQueue()
{
	this._initEventQueue();
}


// LabelEventQueue is a sub class of EventQueue
LabelEventQueue.prototype = new CompressedEventQueue();
LabelEventQueue.prototype.constructor = LabelEventQueue;


LabelEventQueue.prototype.getName = function()
{
	return FormController.LABEL;
}


LabelEventQueue.prototype.processEvent = function(a, e)
{
	// Return a boolean that indicates whether the field needs
	// repainting to reflect a label change.
	return a.setLabel(a.invokeLabel(e));
}

function DefaultEventQueue()
{
	this._initEventQueue();
}

// EnablementEventQueue is a sub class of EventQueue
DefaultEventQueue.prototype = new CompressedEventQueue();
DefaultEventQueue.prototype.constructor = DefaultEventQueue;


DefaultEventQueue.prototype.getName = function()
{
	return FormController.DEFAULT;
}


DefaultEventQueue.prototype.processEvent = function(a, e)
{
	a.invokeSetDefault(e);
	
	// Defaulting itself will never cause a repaint, however
	// the setDefault method itself may perform mutator operations
	// on the DataModel which will cause other DataModelEvents
	// which do cause updates.
	return false;
}


function StateChangeEventQueue()
{
	this._initEventQueue();
}


// SrcDataEventQueue is a sub class of EventQueue
StateChangeEventQueue.prototype = new EventQueue();
StateChangeEventQueue.prototype.constructor = StateChangeEventQueue;


StateChangeEventQueue.prototype.getName = function()
{
	return FormController.STATECHANGE;
}


StateChangeEventQueue.prototype.processEvent = function(a, e)
{
	return a.invokeUpdateAdaptorState(e);
}



function FormDirtyEventQueue()
{
	this._initEventQueue();
}


// FormDirtyEventQueue is a sub class of EventQueue
FormDirtyEventQueue.prototype = new CompressedEventQueue();
FormDirtyEventQueue.prototype.constructor = FormDirtyEventQueue;


FormDirtyEventQueue.prototype.getName = function()
{
	return FormController.FORMDIRTY;
}


FormDirtyEventQueue.prototype.processEvent = function(a, e)
{
	return a.formDirtyUpdate(e);
}


/**
 * Add event to FormDirtyEventQueue. Events are not queued
 * if the form's dirty checking is suspended.
 *
 * @param a the affected GUIAdaptor
 * @param e the DataModelEvent
 * @param d additional detail associated with the event
 */
FormDirtyEventQueue.prototype.addEventToQueue = function(a, e, d)
{
	if(EventQueue.m_logger.isDebug()) EventQueue.m_logger.debug(this.getName() + " check queued for GUIAdaptor: " + a.getId());
	
	// Only queue events if dirty event checking has not been suspended
	if(!a.dirtyEventsSuspended())
	{
		this.m_queue.push({adaptor: a, event: e, detail: d});
	}
}


/**
 * This method creates an identifier for the processing of
 * a FormDirty event. Like enablement there may be several
 * events for the same adaptor in the queue, but these
 * event are characterised by different xpaths.
 *
*/
FormDirtyEventQueue.prototype._createEventId = function(queuedItem)
{
    var id = queuedItem.adaptor.getId();
    
    // Retrieve xpath associated with change in value
    var eventXPath = queuedItem.event.getXPath();
    
    if(null != eventXPath)
    {
        id += "_" + eventXPath;
    }
    
    return id;
} 



function LoadEventQueue()
{
	this._initEventQueue();
}


// LoadEventQueue is a sub class of EventQueue
LoadEventQueue.prototype = new CompressedEventQueue();
LoadEventQueue.prototype.constructor = LoadEventQueue;


LoadEventQueue.prototype.getName = function()
{
	return FormController.LOAD;
}

/**
 * This method returns an identifier for an event being processed in the queue.
 * Some components like PagedAreas with Dynamic pages use the id of page which
 * the event is for.
 *
 */
LoadEventQueue.prototype._createEventId = function(queuedItem)
{
	var id = queuedItem.adaptor.getId();

    // Check for detail in associated form controller listener
    var loadSubComponentId = queuedItem.detail.m_detail;

    if(null != loadSubComponentId)
    {
        id += "_" + loadSubComponentId;
    }
    
    return id;
}


LoadEventQueue.prototype.processEvent = function(a, e, d)
{
	a.invokeLoad(e, d);
	
	return false;
}



function UnloadEventQueue()
{
	this._initEventQueue();
}


// UnloadEventQueue is a sub class of EventQueue
UnloadEventQueue.prototype = new CompressedEventQueue();
UnloadEventQueue.prototype.constructor = UnloadEventQueue;


UnloadEventQueue.prototype.getName = function()
{
	return FormController.UNLOAD;
}

/**
 * This method returns an identifier for an event being processed in the queue.
 * Some components like PagedAreas with Dynamic pages use the id of page which
 * the event is for.
 *
 */
UnloadEventQueue.prototype._createEventId = function(queuedItem)
{
	var id = queuedItem.adaptor.getId();

    // Check for detail in associated form controller listener
    var unloadSubComponentId = queuedItem.detail.m_detail;

    if(null != unloadSubComponentId)
    {
        id += "_" + unloadSubComponentId;
    }
    
    return id;
}


UnloadEventQueue.prototype.processEvent = function(a, e, d)
{
	a.invokeUnload(e, d);
	
	return false;
}

function DirtyRecordsEventQueue()
{
	this._initEventQueue();
}


// DirtyRecordsEventQueue is a sub class of EventQueue
DirtyRecordsEventQueue.prototype = new CompressedEventQueue();
DirtyRecordsEventQueue.prototype.constructor = DirtyRecordsEventQueue;


DirtyRecordsEventQueue.prototype.getName = function()
{
	return FormController.DIRTY_RECORD;
}

/**
 * Add event to DirtyRecordsEventQueue. Events are not queued
 * if the form's dirty checking is suspended.
 *
 * @param a the affected GUIAdaptor
 * @param e the DataModelEvent
 * @param d additional detail associated with the event
 */
DirtyRecordsEventQueue.prototype.addEventToQueue = function(a, e, d)
{
	if(EventQueue.m_logger.isDebug()) EventQueue.m_logger.debug(this.getName() + " check queued for GUIAdaptor: " + a.getId());

	if(this.m_formAdaptor == null)	
	{
		this.m_formAdaptor = FormController.getInstance().getFormAdaptor();
	}
	// Only queue events if dirty event checking has not been suspended
	if(!this.m_formAdaptor.dirtyEventsSuspended())
	{
		this.m_queue.push({adaptor: a, event: e, detail: d});
	}
}

DirtyRecordsEventQueue.prototype.processEvent = function(a, e, d)
{
	return a.invokeMarkRecordDirty(e, d);
}

function LazyFetchEventQueue()
{
	this._initEventQueue();
}


// DirtyRecordsEventQueue is a sub class of EventQueue
LazyFetchEventQueue.prototype = new CompressedEventQueue();
LazyFetchEventQueue.prototype.constructor = LazyFetchEventQueue;


LazyFetchEventQueue.prototype.getName = function()
{
	return FormController.LAZY_FETCH_RECORD;
}


LazyFetchEventQueue.prototype.processEvent = function(a, e, d)
{
	return a.invokeLazyFetchRecord(e, d);
}
