function FormControllerListener()

{

	//this._setAdaptor(adaptor);

	//this._setEventType(eventType);

}

FormControllerListener.create = function (adaptor,eventType,detail)
{
	var l = new FormControllerListener();
	l.m_adaptor = adaptor;

	l.m_eventType = eventType;

	l.m_detail = detail;

	l.m_uniqueRef = l.m_adaptor.getId() + ":" + l.m_eventType;

	return l
}
// FormControllerListener is a sub class of DataModelListener
FormControllerListener.prototype = new DataModelListener();
FormControllerListener.prototype.constructor = FormControllerListener;

/**
 * The adaptor to notify when the listener is called
 */
FormControllerListener.prototype.m_adaptor;
FormControllerListener.prototype.m_eventType;

FormControllerListener.prototype.dispose = function()
{
	this.m_adaptor = null;
}

FormControllerListener.prototype._getUniqueRef = function()
{
	//if(this.m_uniqueRef == null) this.m_uniqueRef = this.m_adaptor.getId() + ":" + this.m_eventType;
	return this.m_uniqueRef;
}

FormControllerListener.prototype.toString = function()
{
	if(null == this._getXPath())
		return "[" + this._getUniqueRef() + "]";
	else
		return "[" + this._getUniqueRef() + " bound to " + this._getXPath() + "]";
}

FormControllerListener.prototype._setAdaptor = function(a)
{
	this.m_adaptor = a;
}

FormControllerListener.prototype._setEventType = function(e)
{
	this.m_eventType = e;
}

FormControllerListener.prototype._queueEvent = function(n, e)
{
	if(this.m_eventType == FormController.DEFAULT)
	{
		// Only add setDefault events if we are adding a node, we only generate default
		// values for fields when adding them, not updating or removing
		if(e.getType() == DataModelEvent.ADD)
		{
			FormController.getInstance().queueEvent(n, this.m_adaptor, e, this);
		}
	}
	else
	{
		FormController.getInstance().queueEvent(n, this.m_adaptor, e, this);
	}
}


FormControllerListener.prototype.invoke = function(e)
{
	this._queueEvent(this.m_eventType,e) ;
}

FormControllerListener.prototype._setXPath = function(xp)
{
	this.m_xp = xp;
}
FormControllerListener.prototype._getXPath = function()
{
	return this.m_xp;
}


/**
 * Utility comparator function to help sort an array of FormControllerListeners, this is
 * used to order the nodes so we can test for and remove duplicates.
 * @param a FormControllerListener
 * @param b FormControllerListener
 */
 
FormControllerListener._sortFormControllerListeners = function(a, b)
{
	// what about the event type?
	if(a._getUniqueRef() > b._getUniqueRef())
	{
		return 1;
	}
	else if(a._getUniqueRef() == b._getUniqueRef())
	{
		return 0;
	}
	return -1;
}

FormControllerListener.prototype.serialise = function()
{   
    var str = "";
    
    str += "FormControllerListener.deserialise('" + this.m_adaptor.getId()  
                                          + "','" + this.m_eventType  
                                          + "','" + this.m_uniqueRef;
    if(null != this.m_detail)
    {
        str += "','" + this.m_detail;
    }
    
    str += "')\n";
    
    return str;        
}


FormControllerListener.deserialise = function(adaptorId,eventType,uniqueRef,detailStr)
{
    var list = new FormControllerListener();
    list.m_adaptorId = adaptorId;
    list.m_eventType = eventType;
    list.m_uniqueRef = uniqueRef;

    if(null != detailStr)
    {
        list.m_detail = detailStr;
    }
    
    return list;
}

