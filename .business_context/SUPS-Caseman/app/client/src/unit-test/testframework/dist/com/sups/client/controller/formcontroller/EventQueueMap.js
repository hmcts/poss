


/**
 * Class to represent a event queue
 */
function EventQueueMap()
{
	this.m_queues = new Array();
}

/**
 * Add a new event queue to the map
 *
 */
EventQueueMap.prototype.addEventQueue = function(q, qName)
{
	this.m_queues[qName] = q;
}

/**
 * Add event to queue
 * @param queueName : the name of the queue to add the event to
 * @param field : the affected field
 */
EventQueueMap.prototype.addEventToNamedQueue = function(queueName, field, event, detail)
{
	this.m_queues[queueName].addEventToQueue(field, event, detail);
}

/**
 * Process event queue
 * @param queueName : the name of the queue to process events upon
 * @param repaintQueue : the repaintQueue object
 *
 * @return - the amended repaint queue
 */
EventQueueMap.prototype.processEventsForQueue = function(queueName, repaintQueue)
{
	repaintQueue = this.m_queues[queueName].processEvents(repaintQueue);
	return repaintQueue;
}

/**
 * Check all queues for unprocessed data events
 * @param queues Array containing names of queues
 *
 * @return Returns "true" if any of the queues contain unprocessed events, otherwise returns "false".
*/
EventQueueMap.prototype.queuesHaveEvents = function( queues )
{
    var queueEventsExist = false;
    
    for(var i = 0, l = queues.length; i < l; i++)
    {
        if(this.queueHasEvents( queues[i] ))
        {
            queueEventsExist = true;
            break;
        }
    }
    
    return queueEventsExist;
}

EventQueueMap.prototype.queueHasEvents = function(queueName)
{
	return this.m_queues[queueName].hasEvents();
}

/**
 * Private utility method to get the named queue from the map. The array
 * of queues now uses associative arrays to avoid looping through them to find the named queue.
 *
 * @return - the named queue
 * @private
 */
EventQueueMap.prototype.getNamedQueue = function(queueName)
{
	return this.m_queues[queueName];
}


EventQueueMap.prototype.removeEventsForAdaptor = function(adaptor)
{
	for(var i in this.m_queues)
	{
		this.m_queues[i].removeEventsForAdaptor(adaptor);
	}
}
