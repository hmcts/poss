//==================================================================
//
// StateChangeEventProtocol.js
//
// Class which provides the other protocols with the ability to receive 
// and send state change events, used for data visibility
//
//==================================================================


/*
 * StateChangeEventProtocol constructor
 *
 * @constructor
 */
function StateChangeEventProtocol()
{
}

StateChangeEventProtocol.m_logger = new Category("StateChangeEventProtocol");

StateChangeEventProtocol.prototype.m_parents = null;
StateChangeEventProtocol.prototype.m_children = null;
StateChangeEventProtocol.prototype.m_aggregateState = null;
StateChangeEventProtocol.prototype.m_dataDependencyOn = null;
StateChangeEventProtocol.prototype.includeInValidation = true;
StateChangeEventProtocol.prototype.m_disableChildStateChangeEvents = false;

/**
 * Perform cleanup required by the MandatoryProtocol before
 * it is destroyed
 */
StateChangeEventProtocol.prototype.disposeStateChangeEventProtocol = function()
{
	if(this.m_dataDependencyOn != null)
	{
		this.m_dataDependencyOn.length = 0;
		delete this.m_dataDependencyOn;
	}
	
	if(this.m_aggregateState != null)
	{
		this.m_aggregateState.dispose();
		this.m_aggregateState = null;
	}
}

StateChangeEventProtocol._isContainerAdaptor = function(a)
{
	return (a instanceof GridGUIAdaptor || 
	        a instanceof SelectElementGUIAdaptor || 
	        a instanceof TabSelectorGUIAdaptor || 
	        a instanceof AutocompletionGUIAdaptor || 
	        a instanceof FwSelectElementGUIAdaptor);
}

StateChangeEventProtocol._isKeyAdaptor = function(a)
{
	return (a instanceof GridGUIAdaptor || 
	        a instanceof SelectElementGUIAdaptor || 
	        a instanceof AutocompletionGUIAdaptor ||
	        a instanceof FwSelectElementGUIAdaptor);
}

StateChangeEventProtocol.prototype.getAggregateState = function()
{
	if(this.m_aggregateState == null) this.m_aggregateState = SubmissibleState.create(this);
	return this.m_aggregateState;
}

StateChangeEventProtocol.prototype.getParents = function()
{
	if(this.m_parents == null) this.m_parents = new Array();
	return this.m_parents;
}

StateChangeEventProtocol.prototype.getParentsDebug = function()
{
	var parents = this.getParents();
	
	var debugString = "[parents, length=" + parents.length + ": ";
	
	for(var i in parents)
	{
		debugString = debugString + parents[0].getId() + ", ";
	}
	
	debugString = debugString + "]";

	return debugString;
}

StateChangeEventProtocol.prototype.getChildren = function()
{
	if(this.m_children == null) this.m_children = new Array();
	return this.m_children;
}

/*
 * Debug toString method to print out detailed information on the current aggregate state. Very slow!
 */
StateChangeEventProtocol.prototype.stateToString = function()
{
	var msg = "{id:" + this.getId() + ", parents=[";
	var parents = this.getParents();
	var children = this.getChildren();
	var state = this.getAggregateState();
	var keyStates = state.getKeyStates();

	for(var l in parents)
	{
		msg += parents[l].getId() + ", ";
	}
	
	msg += "], aggregateState=";
	msg += state.toString();
	msg += "], keyStates:[";
	for(var j in keyStates)
	{
		var keyState = keyStates[j];
		msg += "key=" + j;
		for(var k in keyState)
		{
			msg += " childAdaptorId=" + k + " state=" + keyState[k] + ",";
		}
	}
	
	msg += "} isSubmissible=" + this.isSubmissible();
	
	return msg;
}

/**
 * Get additional databindings that trigger a refresh of the
 * field's mandatory state.
 */
StateChangeEventProtocol.prototype.getDataDependencyOn = function()
{
	return this.m_dataDependencyOn;
}

/**
 * Initialisation method for StateChangeEvent protocol
 *
 * @param cs the configuration objects to apply to the implementing adaptor
 * @type void
 */
StateChangeEventProtocol.prototype.configStateChangeEventProtocol = function(cs)
{
	var cs = this.getConfigs();
	
	for(var i = 0, l = cs.length; i < l; i++)
	{
		c = cs[i];
		if(null != c.dataDependencyOn)
		{
			this.m_dataDependencyOn = c.dataDependencyOn;
			break;
		}
		
		if(null != c.includeInValidation)
		{
			this.includeInValidation = c.includeInValidation;
		}

		if(null != c.disableChildStateChangeEvents)
		{
			this.m_disableChildStateChangeEvents = c.disableChildStateChangeEvents;
		}
	}
	this.keyAdaptor = StateChangeEventProtocol._isKeyAdaptor(this);
}

/*
 * Add a dependency on a parent - this will be used to bubble events up the tree
 */
StateChangeEventProtocol.prototype.addDataDependency = function(container)
{
	// ToDo: make sure we only add the same parent the once
	var parents = this.getParents();
	// store a boolean flag to determine key adaptors only once
	container.keyAdaptor = StateChangeEventProtocol._isKeyAdaptor(container);
	parents[container.getId()] = container;
}

/*
 * Remove a dependency on a parent
 */
StateChangeEventProtocol.prototype.removeDataDependency = function(container)
{
	// ToDo: make sure we only add the same parent the once
	var parents = this.getParents();
	
	for(var i in parents)
	{
		var parent = parents[i];
		if(parent.getId() == container.getId())
		{
			// can we have multiple parents for the same adaptor?
			delete parent[i];
			break;
		}
	}
}

/*
 * Also maintain the list of children for each adaptor
 */
StateChangeEventProtocol.prototype.addChild = function(childAdaptor)
{
	// ToDo: make sure we only add the same child the once
	var children = this.getChildren();
	children[children.length] = childAdaptor;
}

StateChangeEventProtocol.prototype.changeAdaptorState = function(event)
{
	this.m_stateChangeListener.invoke(event);
}

StateChangeEventProtocol.prototype.showNonSubmissibleParents = function()
{
	//if(StateChangeEventProtocol._isKeyAdaptor(this))
	if(this.keyAdaptor == true)
	{
		var key = this.getAggregateState().getFirstNonSubmissibleKey();
		if(null != key)
		{
			Services.setValue(this.dataBinding, key);
		}
	}
	var parents = this.getParents();
	for(var i in parents)
	{
		if(parents[i] != null) parents[i].showNonSubmissibleParents();
	}
	return;
}

StateChangeEventProtocol.prototype.bubbleStateChangeEventToParents = function(event, allParents)
{
	// We now bubble all events up to key adaptors even if there was no change to the child,
	// but this can result in infinite loops if 2 key adaptors depend upon on each other, so 
	// add a guard condition so we stop the bubbling if there was no change and the current adaptor
	// is a key adaptor
	/*if(allParents == false && this.keyAdaptor == true)
	{
		return;
	}*/
	
	var parents = this.getParents();
	for(var i in parents)
	{
		var parent = parents[i];
		//if(parent != null && (allParents == true || parent.keyAdaptor == true)) parent.invokeUpdateAdaptorState(event, true);
		if(parent != null && (allParents == true || parent.keyAdaptor == true)) parent.changeAdaptorState(event);
	}
	return;
}

StateChangeEventProtocol.prototype.propogateStateChangeEventToContainedChildren = function(event)
{
	var children = this.getContainedChildren();
	for(var i=children.length-1;i>=0;i--)
	{
		var child = children[i];
		//if(StateChangeEventProtocol.m_logger.isInfo()) StateChangeEventProtocol.m_logger.info("StateChangeEventProtocol.invokeUpdateAdaptorState() adaptorId=" + this.getId() + ", propogating parent event to child adaptor id=" + child.getId());
		child.changeAdaptorState(event);
	}
	return;
}

/**
 * This method is called from the FormController and handles the state change event, updating the
 * adaptor's aggregate state. If there is a change in the state then we bubble the event up the 
 * parent tree informing them of the change of child adaptor status. The repainting of the
 * initial adaptor is handled inside the formcontroller.processEvents, but this doesn't invoke
 * the repainting of any parents so we have to handle that ourselves. If the status doesn't change
 * we still need to inform any parents that are key adaptors because of defect ...
 */
StateChangeEventProtocol.prototype.invokeUpdateAdaptorState = function(event)
{
	////if(StateChangeEventProtocol.m_logger.isError()) StateChangeEventProtocol.m_logger.error("StateChangeEventProtocol.invokeUpdateAdaptorState() id = " + this.getId() + ", event = " + event.toString());
	var changed = false;
	var key = null;
	if(this.dataBinding) 
	{
		key = Services.getValue(this.dataBinding);
	}
	
	// if setting the state changes the aggregate state then bubble events upwards
	var state = this.getAggregateState();
	changed = state.setState(event, key);
	var e = StateChangeEvent.create(StateChangeEvent.CHILD_TYPE, this.isSubmissible(), this);
	this.bubbleStateChangeEventToParents(e, changed);
	
	// If this adaptor supports the ComponentContainerProtocol then we want to force the state change
	// down to it's children
	if(this.isAContainer == true && this.isContainerProtocolPropogationSupported(event.getType()))
	{
		var e = StateChangeEvent.create(StateChangeEvent.PARENT_TYPE, event.getType(), this);
		this.propogateStateChangeEventToContainedChildren(e, changed);
	}
	
	//if(StateChangeEventProtocol.m_logger.isTrace()) StateChangeEventProtocol.m_logger.trace("StateChangeEventProtocol.invokeUpdateAdaptorState() adaptorId=" + this.getId() + ", this.isSubmissible()=" + this.isSubmissible() + ", changed=" + changed);
	return changed;
}

StateChangeEventProtocol.prototype.isContainerProtocolPropogationSupported = function(type)
{
	var result = false;
	switch(type)
	{
		case StateChangeEvent.ENABLED_TYPE:
			result = true;
			break;
		case StateChangeEvent.READONLY_TYPE:
			result = true;
			break;
		default:
			break;
	}
	return result;
}

/**
 * Determines if the field can be submitted to the server based on an aggregate of the various states resulting
 * from the field lifecycles
 *
 * @returns boolean 
 * @type ErrorCode
 * @configuration
 */ 
StateChangeEventProtocol.prototype.isSubmissible = function()
{
	return this.getAggregateState().isSubmissible();
}

/*
 * SubmissibleState constructor
 *
 * @constructor
 */
function StateChangeEvent(type, state, adaptor)
{
	this.m_type = type;
	this.m_state = state;
	this.m_adaptor = adaptor;
}

StateChangeEvent.ENABLED_TYPE 	= 0;
StateChangeEvent.VALID_TYPE 	= 1;
StateChangeEvent.READONLY_TYPE 	= 2;
StateChangeEvent.MANDATORY_TYPE = 3;
StateChangeEvent.TEMPORARY_TYPE = 4;
StateChangeEvent.CHILD_TYPE 	= 5;
StateChangeEvent.VALUE_TYPE 	= 6;
StateChangeEvent.SRCDATA_TYPE 	= 7;
StateChangeEvent.PARENT_TYPE 	= 8;
StateChangeEvent.REMOVED_ADAPTOR_TYPE 	= 9;

StateChangeEvent.create = function(type, state, adaptor)
{
	var event = new StateChangeEvent(type, state, adaptor);
	return event;
}

StateChangeEvent.prototype.dispose = function()
{
	this.m_adaptor = null;
}

StateChangeEvent.prototype.toString = function()
{
	var msg = "[StateChangeEvent: type=";
	switch(this.m_type)
	{
		case StateChangeEvent.ENABLED_TYPE:
			msg += "ENABLED";
			break;
		case StateChangeEvent.VALID_TYPE:
			msg += "VALID";
			break;
		case StateChangeEvent.READONLY_TYPE:
			msg += "READONLY";
			break;
		case StateChangeEvent.MANDATORY_TYPE:
			msg += "MANDATORY";
			break;
		case StateChangeEvent.TEMPORARY_TYPE:
			msg += "TEMPORARY";
			break;
		case StateChangeEvent.CHILD_TYPE:
			msg += "CHILD";
			break;
		case StateChangeEvent.VALUE_TYPE:
			msg += "VALUE";
			break;
		case StateChangeEvent.SRCDATA_TYPE:
			msg += "SRCDATA";
			break;
		case StateChangeEvent.PARENT_TYPE:
			msg += "PARENT";
			break;
		case StateChangeEvent.REMOVED_ADAPTOR_TYPE:
			msg += "REMOVED_ADAPTOR";
			break;
		default: 
			msg += "UNKNOWN";
			break;
	}
	msg += ", state=" + this.m_state;
	msg += ", adaptorId=" + this.m_adaptor.getId() + "]";
	
	return msg;
}

StateChangeEvent.prototype.getType = function()
{
	return this.m_type;
}

StateChangeEvent.prototype.getState = function()
{
	return this.m_state;
}

StateChangeEvent.prototype.getAdaptor = function()
{
	return this.m_adaptor;
}

/*
 * SubmissibleState constructor, initialises all states from the adaptor internal state
 *
 * @constructor
 */
function SubmissibleState(adaptor)
{
	this.m_adaptor = adaptor;
	this.m_value = null;
	this.m_keyStates = new Array();
	this.m_key = null;

	this.m_temporary = false;
	this.m_enabled = true;
	this.m_valid = true;
	this.m_readOnly = false;
	this.m_mandatory = false;
}

SubmissibleState.m_logger = new Category("SubmissibleState");

SubmissibleState.prototype.m_enabled = null;
SubmissibleState.prototype.m_valid = null;
SubmissibleState.prototype.m_readOnly = null;
SubmissibleState.prototype.m_mandatory = null;
SubmissibleState.prototype.m_temporary = null;
SubmissibleState.prototype.m_value = null;
SubmissibleState.prototype.m_childrenSubmissible = null;
SubmissibleState.prototype.m_keyStates = null;

SubmissibleState.prototype.dispose = function()
{
	this.m_adaptor = null;
	this.m_keyStates = null;
}

SubmissibleState.prototype.toString = function()
{
	var msg = "[SubmissibleState: id=" + this.m_adaptor.getId() +", key=" + this.m_key + ", enabled=" + this.m_enabled + ", valid=" + this.m_valid + ", value = " + this.m_value + ", mandatory=" + this.m_mandatory;
	//msg += ", temporary=" + this.m_temporary;
	return msg;
}

SubmissibleState.prototype.getKey = function()
{
	return this.m_key;
}
SubmissibleState.prototype.getKeyStates = function()
{
	return this.m_keyStates;
}


SubmissibleState.create = function(adaptor)
{
	var state = new SubmissibleState(adaptor);
	return state;
}

SubmissibleState.prototype.isChildAdaptorSubmissible = function(childAdaptorId)
{
	var result = true;
	var keyStates = this.m_keyStates;
	for(var i in keyStates)
	{
		var keyChildStates = keyStates[i];
		if(keyChildStates.deleted != true)
		{
			var childState = keyChildStates[childAdaptorId];
			if(childState!=null && childState==false)
			{
				result = false;
				break;
			}
		}
	}
	return result;
}

/**
 * This is only used for FUnit tests and is non-public facing
 */
SubmissibleState.prototype._isChildOfNonKeyAdaptorSubmissible = function(childAdaptorId)
{
	var result = true;
	var keyChildStates = this.m_keyStates["<framework_dummy_key>"];
	if(keyChildStates != null && keyChildStates[childAdaptorId] != null && keyChildStates.deleted != true)
	{
		result = keyChildStates[childAdaptorId];
	}
	
	return result;
}

SubmissibleState.prototype.isKeySubmissible = function(key)
{
	var result = true;
	var keyChildStates = this.m_keyStates[key];
	//if(keyChildStates != null && keyChildStates.deleted != true)
	if(keyChildStates != null)
	{
		for(var i in keyChildStates)
		{
			if(keyChildStates[i] == false && i != "deleted")
			{
				result = false;
				break;
			}
		}
	}
	
	return result;
}

SubmissibleState.prototype.areChildrenSubmissible = function()
{
	var result = true;
	var keyStates = this.m_keyStates;
	for(var i in keyStates)
	{
		var keyChildStates = keyStates[i];
		if(keyChildStates.deleted != true)
		{
			for(var j in keyChildStates)
			{
				if(keyChildStates[j] == false && j != "deleted")
				{
					result = false;
					break;
				}
			}
		}
	}
	return result;
}

SubmissibleState.prototype.getFirstNonSubmissibleKey = function()
{
	var result = null;
	var keyStates = this.m_keyStates;
	for(var key in keyStates)
	{
		var keyChildStates = keyStates[key];
		if(keyChildStates != null && keyChildStates.deleted != true)
		{
			for(var i in keyChildStates)
			{
				if(keyChildStates[i] == false && i != "deleted")
				{
					result = key;
					break;
				}
			}
		}
		if(null != null) break;
	}
	////if(SubmissibleState.m_logger.isError()) SubmissibleState.m_logger.error("SubmissibleState.getFirstNonSubmissibleKey() returning " + result);
	return result;
}

/**
 * This is used to determine the aggregate state in conjunction with the valid state, and for the grid we are not 
 * concerned with whether or not the grid actually has a value because it can be associated with the grid's srcdata
 * rather that the value at the databinding.
 */
SubmissibleState.prototype.hasValue = function()
{
	if(this.m_adaptor instanceof GridGUIAdaptor)
		return true;
	else
		return !(this.m_value == null || this.m_value == "");
}

SubmissibleState.prototype.isSubmissible = function(key)
{
	var result = true;
	var a = this.m_adaptor;
	if(!this.m_enabled || this.m_temporary)
	{
		// if disabled or temporary then the field is submissible regardless of other states
	}
	else
	{
		if(key != null)
		{
			result = this.isKeySubmissible(key);
		}
		else
		{
			result = this.areChildrenSubmissible();
		}
		if(result == true)
		{
			if(a.getDataBinding)
			{
				if(this.hasValue())
				{
					if(this.m_valid == false)
					{
						result = false;
					}
				}
				else
				{
					if(this.m_mandatory)
					{
						result = false;
					}
				}
			}
		}
	}
	
	////if(SubmissibleState.m_logger.isError()) SubmissibleState.m_logger.error("SubmissibleState.isSubmissible() this = " + this.toString() + ", returning " + result);
	return result;
}


SubmissibleState.prototype.getAdaptorState = function()
{
	var adaptor = this.m_adaptor;
	if(adaptor.dataBinding)
	{
		this.m_value = Services.getValue(adaptor.dataBinding);
	}
	if(adaptor.getEnabled)
	{
		this.m_enabled = adaptor.getEnabled();
	}
	else
	{
		this.m_enabled = true;
	}
	if(adaptor.getValid)
	{
		this.m_valid = adaptor.getValid();
	}
	else
	{
		this.m_valid = true;
	}
	if(adaptor.getReadOnly)
	{
		this.m_readOnly = adaptor.getReadOnly();
	}
	else
	{
		this.m_readOnly = false;
	}
	if(adaptor.getMandatory)
	{
		this.m_mandatory = adaptor.getMandatory();
	}
	else
	{
		this.m_mandatory = false;
	}
	if(adaptor.hasTemporary && adaptor.hasTemporary())
	{
		this.m_temporary = adaptor.invokeIsTemporary();
	}
	else
	{
		this.m_temporary = false;
	}
}

SubmissibleState.prototype.isKeyInSrcData = function(key)
{
	var result = false;
	var adaptor = this.m_adaptor;
	
	var isEmpty = (key == null || key == "");
	
	if(adaptor.getSrcData && isEmpty == false)
	{
		result = adaptor.checkForKeyExistence(key);
	}
	return result;
}

/** 
 * @param stateChangeEvent StateChangeEvent
 */
SubmissibleState.prototype.setState = function(stateChangeEvent, key)
{
	//if(SubmissibleState.m_logger.isDebug()) SubmissibleState.m_logger.debug("SubmissibleState.setState() key=\'" + key + "\', stateChangeEvent=" + stateChangeEvent.toString());
	
	// Only certain adaptors are interested in storing their keys
	//var isKeyAdaptor = StateChangeEventProtocol._isKeyAdaptor(this.m_adaptor);
	if(this.m_adaptor.keyAdaptor == false)
	{
		key = null;
	}
	this.m_key = key;

	var originalAggregateState = this.isSubmissible(key);

	// get the latest state information from the adaptor
	this.getAdaptorState();

	switch(stateChangeEvent.getType())
	{
		case StateChangeEvent.SRCDATA_TYPE:
			// If the src data has changed then return true for change to aggregate state
			// otherwise continue and see if the aggregate state has changed as a result by
			// comparing the old and new state values
			var result = this.handleSrcDataEvent();
			if(result == true) return result;
			break;
		case StateChangeEvent.CHILD_TYPE:
			this.handleChildEvent(stateChangeEvent, key);
			break;
		case StateChangeEvent.PARENT_TYPE:
			// For parent events we want to return true if the state has changed to force a repaint
			// rather than if the aggregate state has changed because it won't necessarily if we change 
			// the readonly status for example.
			return this.handleParentEvent(stateChangeEvent, key);
			break;
		case StateChangeEvent.REMOVED_ADAPTOR_TYPE:
			return this.handleRemovedAdaptorEvent(stateChangeEvent, key);
			break;
		default:
			break;
	}
	var newAggregateState = this.isSubmissible(key);
	
	return (originalAggregateState != newAggregateState);
}

/**
 * The parent's event type (e.g. MANDATORY) is passed down in the state field on the event
 */
SubmissibleState.prototype.handleParentEvent = function(stateChangeEvent)
{
	var changed = false;
	var adaptor = this.m_adaptor;
	var parent = stateChangeEvent.getAdaptor();
	switch(stateChangeEvent.getState())
	{
		case StateChangeEvent.ENABLED_TYPE:
			if(adaptor.getEnabled)
			{
				var enabled = parent.getEnabled();
				//if(SubmissibleState.m_logger.isInfo()) SubmissibleState.m_logger.info("SubmissibleState.handleParentEvent() setting enabled to " + enabled + " on adaptor " + adaptor.getId() + " from parent " + parent.getId());
				changed = adaptor.setContainerEnabled(enabled);
			}
			break;
		case StateChangeEvent.READONLY_TYPE:
			if(adaptor.getReadOnly)
			{
				var readOnly = parent.getReadOnly();
				//if(SubmissibleState.m_logger.isInfo()) SubmissibleState.m_logger.info("SubmissibleState.handleParentEvent() setting readOnly to " + readOnly + " on adaptor " + adaptor.getId() + " from parent " + parent.getId());
				changed = adaptor.setContainerReadOnly(readOnly);
			}
			break;
		default:
			break;
	}
	return changed;
}

/**
 * This method handles a src data event which we use to remove any invalid states regarding rows 
 * that are no longer in the src data. We need to modify this for 
 */
SubmissibleState.prototype.handleSrcDataEvent = function()
{
	// If the source data has been refreshed then we need to clear down any existing states
	// only if the key is no longer in the src data
	var changed = false;
	var keyStates = this.m_keyStates;
	for(var i in keyStates)
	{
		var isKeyInSrcData = this.isKeyInSrcData(i);
		if(!isKeyInSrcData && keyStates[i] != null)
		{
			//if(SubmissibleState.m_logger.isDebug()) SubmissibleState.m_logger.debug("SubmissibleState.setState() removing keyState " + i + " because it is no longer in the src data");
			keyStates[i].length = 0;
			//delete keyStates[i];
			keyStates[i].deleted = true;
			changed = true;
		}
		else
		{
			if(keyStates[i].deleted == true)
			{
				keyStates[i].deleted = false;
				changed = true;
			}
		}
	}
	return changed;
}

SubmissibleState.prototype.handleChildEvent = function(stateChangeEvent, key)
{
	//var isKeyAdaptor = StateChangeEventProtocol._isKeyAdaptor(this.m_adaptor);
	if(this.m_adaptor.keyAdaptor == true)
	{
		if(!this.canAcceptChildEvents())
		{
			return;
		}
		var isKeyInSrcData = this.isKeyInSrcData(key);
		var isKeyEmpty = (key == null || key == "");
		if(isKeyEmpty == true || isKeyInSrcData == false)
		{
			if(isKeyInSrcData == false && isKeyEmpty == false && this.m_keyStates[key] != null)
			{
				this.m_keyStates[key].deleted = true;
			}
			//if(SubmissibleState.m_logger.isDebug()) SubmissibleState.m_logger.debug("SubmissibleState.setState() we are discarding this event because the key is null or not in the src data");
			return;
		}
	}
	var childAdaptorId = stateChangeEvent.getAdaptor().getId();
	if(key == null || key == "")
	{
		key = "<framework_dummy_key>";
	}
	else
	{
		childAdaptorId += ":" + key;
	}
	
	// Also store the state of all children against keys so we can quickly determine
	// if a key / row is valid or not - need to default the key to "null" if it actually null
	var keyStates = this.m_keyStates;
	if(keyStates[key] == null) keyStates[key] = new Array();
	keyStates[key][childAdaptorId] = stateChangeEvent.getState();
	//if(SubmissibleState.m_logger.isDebug()) SubmissibleState.m_logger.debug("SubmissibleState.setState() setting keyState[" + key + "][" + childAdaptorId + "] to " + stateChangeEvent.getState());
	////if(SubmissibleState.m_logger.isError()) SubmissibleState.m_logger.error("SubmissibleState.setState() setting childStates[" + childAdaptorId + "] = " + stateChangeEvent.getState());
	// set it back again so we do the same check at the to see if the state has changed to
	// bubble the events up the dependency chain
	if(key == "<framework_dummy_key>") key = null;
}

/**
 * The parent's event type (e.g. MANDATORY) is passed down in the state field on the event
 */
SubmissibleState.prototype.handleRemovedAdaptorEvent = function(stateChangeEvent)
{
	var changed = false;

	if(this.canAcceptChildEvents())
	{
		// The list of removed adaptor IDs are held in the event's state attribute
		var childAdaptorIds = stateChangeEvent.getState();
		var keyStates = this.m_keyStates;
		var keyAdaptor = this.m_adaptor.keyAdaptor;
		
		for(var i in keyStates)
		{
			var keyChildStates = keyStates[i];
			
			for(var j=0; j<childAdaptorIds.length; j++)
			{
				var childAdaptorId = childAdaptorIds[j];
				
				if(keyAdaptor == true)
				{
					// Key adaptors store the key state with a key suffix
					childAdaptorId += ":" + i;
				}
				
				if(keyChildStates[childAdaptorId] != null)
				{
					//delete keyChildStates[childAdaptorId];
					keyChildStates[childAdaptorId].deleted = true;
					changed = true;
				}
			}
		}
	}
	
	return changed;
}


SubmissibleState.prototype.canAcceptChildEvents = function()
{
	if(this.m_canAcceptChildEvents == null)
	{
		this.m_canAcceptChildEvents = true;
		var adaptor = this.m_adaptor;
		if( 	(adaptor.m_disableChildStateChangeEvents == true)
			 || (adaptor instanceof GridGUIAdaptor && adaptor.getMultipleSelection()==true) 
			 || (adaptor instanceof AutocompletionGUIAdaptor && adaptor.strictValidation==false)
			 || (adaptor instanceof SelectElementGUIAdaptor && adaptor.areOptionsHardcoded()==true)
			 || (adaptor instanceof FwSelectElementGUIAdaptor && adaptor.areOptionsHardcoded()==true)
			)
		{
			this.m_canAcceptChildEvents = false;
		}
	}
	return this.m_canAcceptChildEvents;
}
