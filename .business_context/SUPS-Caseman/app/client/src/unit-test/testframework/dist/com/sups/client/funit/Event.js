function FUnitEvent() 
{
	this._events = new Array();
	this._overrideSUPSEvent();
}

FUnitEvent.prototype.addEventHandlerWrapper = function(thisObj, element, eventName, action, capture)
{
	// Current version cannot handle if the element is null or the ID is not specified
	if(null != element && null != element.id)
	{
		if(null == thisObj._events[element.id + eventName])
		{
			thisObj._events[element.id + eventName] = new Array();
		}
		thisObj._events[element.id + eventName].push(action);
	}
	
	return thisObj._addEventHandler.call(null, element, eventName, action, capture);
}


FUnitEvent.prototype.removeEventHandlerKeyWrapper = function(key)
{
	this._removeHandler(key.m_element.id, key.m_eventName, key.m_action);
	this._removeEventHandlerKey.call(null, key);
}

FUnitEvent.prototype.removeEventHandlerWrapper = function(element, eventName, action, capture)
{
	this._removeHandler(element.id, eventName, action);
	this._removeEventHandler.call(null, element, eventName, action, capture);
}

FUnitEvent.prototype._removeHandler = function(elementId, eventName, action)
{
	if(this._events[elementId + eventName] != null)
	{
		for(var i = 0 ; i < this._events[elementId + eventName].length ; i++)
		{
			if(this._events[elementId + eventName][i] == action)
			{
				// Remove the action
				var actionArray = this._events[elementId + eventName];
				for(var j = i ; j < actionArray.length - 1; j++)
				{
					actionArray[j] = actionArray[j+1];
				}
				actionArray.pop();
			}
		}
	}
}

FUnitEvent.prototype._overrideSUPSEvent = function()
{
	var thisObj = this;
	
	// Add an aspect to adding an event
	this._addEventHandler = SUPSEvent.addEventHandler;	
	SUPSEvent.addEventHandler = 
		function(element, eventName, action, capture) 
		{	
			return thisObj.addEventHandlerWrapper(thisObj, element, eventName, action, capture);
		};
	
	// Add an aspect to removing an event via a key 	
	this._removeEventHandlerKey = SUPSEvent.removeEventHandlerKey;	
	SUPSEvent.removeEventHandlerKey = 
		function(key)
		{
			thisObj.removeEventHandlerKeyWrapper(key);
		};
		
	// Add an aspect to removing an event 	
	this._removeEventHandler = SUPSEvent.removeEventHandler;	
	SUPSEvent.removeEventHandler = 
		function(element, eventName, action, capture)
		{
			thisObj.removeEventHandlerWrapper(element, eventName, action, capture);
		};
}

FUnitEvent.prototype._fireEvent = function(elementId, eventName, event)
{
	// TODO - should create an event object, globally and as param to satisfy API
	supsAssert(this._events[elementId + eventName], "No handlers for this event");
	
	for(var i = 0 ; i < this._events[elementId + eventName].length ; i++)
	{
		this._events[elementId + eventName][i].call(null, event);
	}
	
}

FUnitEvent.prototype.fireEvent = function(elementId, eventName)
{
	this._fireEvent(elementId, eventName);
}

FUnitEvent.prototype.fireKeyEvent = function(elementId, eventName, keycode)
{
	var event = new Object();
	event.keyCode = keycode.m_keyCode;

	this._fireEvent(elementId, eventName, event);
}