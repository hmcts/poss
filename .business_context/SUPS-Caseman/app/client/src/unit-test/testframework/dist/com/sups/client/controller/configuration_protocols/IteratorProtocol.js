//==================================================================
//
// IteratorProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support iteration.
//
//==================================================================


/*
 * IteratorProtocol constructor
 *
 * @constructor
 */
function IteratorProtocol()
{
	this.m_keys = new Array();
	this.retrieveOn = new Array();
}

IteratorProtocol.m_logger = new Category("IteratorProtocol");

/**
 * XPath indicating the location where the current selected key of the collection is stored
 * e.g. /ds/var/page/myIterator1/selectedKey
 *
 * @configuration
 */
IteratorProtocol.prototype.m_selectedKeyDataBinding = null;


/**
 * The XPath indicating where the root of the collection data is stored.
 *
 * @configuration
 */
IteratorProtocol.prototype.m_srcData = null;


/**
 * The XPath relative to srcData which contains the data for an
 * individual row. May be null which equivelent to "".
 *
 * @configuration
 */
IteratorProtocol.prototype.m_rowXPath = null;


/**
 * XPath relative to srcData + row which uniquely identifies the
 * row. This is the value written to the m_selectedKeyDataBinding 
 * location.
 *
 * @configuration
 */
IteratorProtocol.prototype.m_keyXPath = null;


/**
 * Collection of all keys held in array to impose an order for iterating.
 *
 * @private
 */
IteratorProtocol.prototype.m_keys = null;


/* ToDo
	// listens to srcData and refreshes the view - what happens if the 
	// current selected key is no longer in the collection
	private void handleSrcDataChange();
*/


IteratorProtocol.prototype.reset = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.reset()");
	this.m_keys.length = 0;
	var nodes = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this.getPath());
	for(var i=0; i<nodes.length; i++)
	{
		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.reset() adding node value = " + XML.selectNodeGetTextContent(nodes[i], this.m_keyXPath) + " at m_keys[" + i + "]");
		this.m_keys[i] = XML.selectNodeGetTextContent(nodes[i], this.m_keyXPath);
	}
	// If we reset do we assume that we point to the initial item in the collection?
	if(this.m_keys.length>0)
	{
		this.setSelectedKey(this.m_keys[0]);
	}
	else
	{
		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.reset() m_keys[] array is empty, therefore cannot set the initial selected key for this iterator");
	}
}

/**
 * Set the selected key using the xpath data binding specified in m_selectedKeyDataBinding.
 *
 * @param key the new selected key
 * @return void
 */
IteratorProtocol.prototype.setSelectedKey = function(key)
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.setSelectedKey(" + key + ")");
	FormController.getInstance().getDataModel().setValue(this.m_selectedKeyDataBinding, key);
}
/**
 * Get the current selected key.
 *
 * @return the selected key from the datamodel as specified by xpath m_selectedKeyDataBinding
 */
IteratorProtocol.prototype.getSelectedKey = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.getSelectedKey() from location " + this.m_selectedKeyDataBinding);
	return FormController.getInstance().getDataModel().getValue(this.m_selectedKeyDataBinding);
}

/**
 * Select the previous key in the collection as ordered in m_keys. 
 *
 * @return void
 */
IteratorProtocol.prototype.previous = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.previous() this.m_keys.length = " + this.m_keys.length);
	var currentIndex = this.getPosition(this.getSelectedKey());
	if(this.hasPrevious())
	{
		if(null == currentIndex)
		{
			var previousKey = this.m_keys[0];
			this.setSelectedKey(previousKey);
			if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.previous(), currentIndex = null, resetting new key = " + previousKey);
		}
		else
		{
			var previousKey = this.m_keys[currentIndex-1];
			this.setSelectedKey(previousKey);
			if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.previous(), currentIndex = " + currentIndex + ", old key = " + this.m_keys[currentIndex] + ", new key = " + this.m_keys[currentIndex-1]);
		}
	}
	else
	{
		if(IteratorProtocol.m_logger.isWarn()) IteratorProtocol.m_logger.warn("IteratorProtocol.previous(), this.hasPrevious() returned false, not changing current selected key = " + this.m_keys[currentIndex]);
	}
}

/**
 * Select the next key in the collection as ordered in m_keys. 
 *
 * @return void
 */
IteratorProtocol.prototype.next = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.next() this.m_keys.length = " + this.m_keys.length);
	var currentIndex = this.getPosition(this.getSelectedKey());
	if(this.hasNext())
	{
		if(null == currentIndex)
		{
			var nextKey = this.m_keys[0];
			this.setSelectedKey(nextKey);
			if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.next(), currentIndex = null, resetting new key = " + nextKey);
		}
		else
		{
			var nextKey = this.m_keys[currentIndex+1];
			this.setSelectedKey(nextKey);
			if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.next(), currentIndex = " + currentIndex + ", old key = " + this.m_keys[currentIndex] + ", new key = " + this.m_keys[currentIndex+1]);
		}
	}
	else
	{
		if(IteratorProtocol.m_logger.isWarn()) IteratorProtocol.m_logger.warn("IteratorProtocol.next(), this.hasNext() returned false, not changing current selected key = " + this.m_keys[currentIndex]);
	}
}

/**
 * Can we iterate to the previous element in the collection
 *
 * @return boolean
 */
IteratorProtocol.prototype.hasPrevious = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.hasPrevious()");
	return this.getPosition(this.getSelectedKey()) == 0 ? false : true;
}

/**
 * Can we iterate to the next element in the collection
 *
 * @return boolean
 */
IteratorProtocol.prototype.hasNext = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.hasNext()");
	return this.getPosition(this.getSelectedKey()) == (this.m_keys.length-1) ? false : true;
}

/**
 * Are we at the start of the collection?
 *
 * @return boolean
 */
IteratorProtocol.prototype.atStart = function()
{
	return this.hasPrevious() ? false : true;
}

/**
 * Are we at the end of the collection?
 *
 * @return boolean
 */
IteratorProtocol.prototype.atEnd = function()
{
	return this.hasNext() ? false : true;
}


/**
 * Initialisation method for IteratorProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
IteratorProtocol.prototype.configIteratorProtocol = function(cs)
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol()");
	// Use the most specific configuration available - there's
	// no chaining of these methods, so simply assign the most
	// specific configuration to this GUI Adaptors own
	// configuration variables.
	for(var i = cs.length - 1; i >= 0; i--)
	{
		var c = cs[i];
		
		if(null != c.srcData) 
		{
			this.m_srcData = c.srcData;
			// set the refreshOn to be the on the srcData xpath downwards
			this.retrieveOn[0] = c.srcData + "//*";
		}
		if(null != c.rowXPath) this.m_rowXPath = c.rowXPath;
		if(null != c.keyXPath) this.m_keyXPath = c.keyXPath;
		if(null != c.selectedKeyDataBinding) this.m_selectedKeyDataBinding = c.selectedKeyDataBinding;

		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_srcData = " + this.m_srcData);
		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_rowXPath = " + this.m_rowXPath);
		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_keyXPath = " + this.m_keyXPath);
		if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_selectedKeyDataBinding = " + this.m_selectedKeyDataBinding);
		//if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_retrieveOn[0] = " + this.m_retrieveOn[0]);

		//ToDo - add support for filtering of the Collection
	}
}


/**
 * Perform cleanup required by the IteratorProtocol before
 * it is destroyed
 */
IteratorProtocol.prototype.disposeIteratorProtocol = function()
{
}

/**
 * @private
 */
IteratorProtocol.prototype.getPath = function()
{
	if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.getPath() returning " + this.m_srcData + this.m_rowXPath);
	return this.m_srcData + this.m_rowXPath;
}

/** Returns the position for the given key
 *
 * @param key the key to lookup it's position in m_keys
 * @private
 */
IteratorProtocol.prototype.getPosition = function(key)
{
	var position = null;
	if(key)
	{
		for(var i=0; i<this.m_keys.length; i++)
		{
			if(this.m_keys[i] == key)
			{
				position = i;
				if(IteratorProtocol.m_logger.isInfo()) IteratorProtocol.m_logger.info("IteratorProtocol.getPosition() position found for key (" + key + ") = " + position);
				break;
			}
		}
	}
	else
	{
		if(IteratorProtocol.m_logger.isWarn()) IteratorProtocol.m_logger.warn("IteratorProtocol.getPosition() no position found, key = " + key);
	}
	return position;
}
