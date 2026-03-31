//==================================================================
//
// RecordsProtocol.js
//
// Class which provides the members required by a GUIAdaptor to support
// definitions of records in the DOM. This allows the form to only
// submit dirty records for performance improvements.
//
//==================================================================


/*
 * RecordsProtocol constructor
 *
 * @constructor
 */
function RecordsProtocol()
{
}

RecordsProtocol.m_logger = new Category("RecordsProtocol");

/**
 * Current enablement state of the adaptor - defaults to enabled.
 */
RecordsProtocol.prototype.m_records = null;
RecordsProtocol.prototype.m_isRecord = false;
RecordsProtocol.prototype.m_recordName = null;

RecordsProtocol.RECORD_DIRTY_ELEMENT = "RecordDirty";

/**
 * Initialise the protocol
 *
 * @param e the DataModelEvent for initialisation
 */
RecordsProtocol.prototype.initialiseRecordsProtocol = function(e)
{
}

RecordsProtocol.prototype.getMarkDirtyRecordOn = function()
{
	return this.m_markDirtyRecordOn;
}

RecordsProtocol.prototype.getLazyFetchRecordOn = function()
{
	return this.m_lazyFetchRecordOn;
}

RecordsProtocol.prototype.hasRecordsForStripping = function()
{
	if(this.m_hasRecordsForStripping == null)
	{
		this.m_hasRecordsForStripping = false;
		for(var i=0, l=this.m_records.length; i<l; i++)
		{
			if(this.m_records[i].getStripCleanRecords() == true)
			{
				this.m_hasRecordsForStripping = true;
				break;
			}
		}
	}
	return this.m_hasRecordsForStripping;
}

RecordsProtocol.prototype.hasRecords = function()
{
	return (this.m_records.length > 0);
}

/**
 * form.records = [
 * 		{ 	xpath: "/ds/model/records/record",
 			keyXPath: "id",				// only required for lazy fetching, defaults for grids etc.
 *			stripCleanRecords: false	// defaults to true, unless only specify lazy fetching config???
 *			displayName: ""				// optional, used when displaying any error messages
 *			lazyFetchXPath: "/ds/var/page/selectedRecord"	// defaults to the adaptors dataBinding for grids etc.
 *			lazyFetchs {
 *				[
 *					{	
 *						nodeXPath: "address",
 *						resultTargetXPath: "/Cases/Case/Addresses/Address",
 *						service: {...}
 *						displayName: ""				// optional, used when displaying any error messages when fetching the data
 *					},
 *					...
 *				]
 * 			}
 *		}
 * ]
 *
 *	example for a grid lazy fetching config without clean record stripping. Note that the changeRecordXPath is not required
 * as it defaults to the grid's dataBinding. Note that you do not require the myGrid.isRecord = true config if you declare 
 * a lazyFetch config, and the record xpath defaults to the grid's rowXPath as for normal dirty record behaviour.
 *
 *	myGrid.lazyFetchs = {
 *		[ { nodeXPath: "address", resultTargetXPath: "/Cases/Case/Addresses/Address", service: {...} }
 *		]
 *	}
 *	myGrid.isRecord = true;
 */

/**
 * This is used when configuring an adaptor that supports the ListSrcDataProtocol without bothering
 * to configure the isRecord for clean record stripping
 */
RecordsProtocol.prototype.configLazyFetchs = function(c)
{
    if(c.lazyFetchs && this.getSrcData && this.getSrcData() != null)
    {
    	c.isRecord = true;
    	c.stripCleanRecords = false;
    	
    	this.configIsRecord(c);
	}
}

RecordsProtocol.prototype.configIsRecord = function(c)
{
    // We have a special quick-config for adaptors that support the ListSrcDataProtocol
    // that allows the row configuration to be applied as a record if applicable
	if(c.isRecord && c.isRecord == true && this.getSrcData && this.getSrcData() != null)
	{
		this.m_isRecord = true;
		var xpath = this._getRowXPath();
		var keyXPath = (c.keyXPath == null) ? this.keyXPath : c.keyXPath;
		var displayName = (c.displayName == null) ? this.getDisplayName() : c.displayName;
		var stripCleanRecords = (c.stripCleanRecords == null) ? true : c.stripCleanRecords;
		var lazyFetchXPath = (c.lazyFetchXPath == null) ? this.dataBinding : c.lazyFetchXPath;
		var lazyFetchs = c.lazyFetchs;

		this.m_records[this.m_records.length] = this.createRecord(xpath, keyXPath, stripCleanRecords, lazyFetchXPath, lazyFetchs, displayName);
	}
} 
 
RecordsProtocol.prototype.configRecords = function(c)
{
	if(c.records)
	{
		this.m_isRecord = false;
		for(var i=0, l=c.records.length; i<l; i++)
		{
			var record = c.records[i];
			record.displayName = (record.displayName == null) ? this.getDisplayName() : record.displayName;
			record.stripCleanRecords = (record.stripCleanRecords == null) ? true : record.stripCleanRecords;
			this.m_records[this.m_records.length] = this.createRecord(record.xpath, record.keyXPath, record.stripCleanRecords, record.lazyFetchXPath, record.lazyFetchs, record.displayName);
		}
	}
} 
 
/**
 * Configure the Protocol
 *
 * @param cs the configuration objects to inspect for protocol configuration properties
 * @type void
 */
RecordsProtocol.prototype.configRecordsProtocol = function(cs)
{
	if(RecordsProtocol.m_logger.isTrace()) RecordsProtocol.m_logger.trace(this.getDisplayName() + ": configRecordsProtocol()");
	// Need to determine how to merge enableOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	if(this.m_records == null)
	{
		this.m_records = new Array();
	}
	if(this.m_markDirtyRecordOn == null)
	{
		this.m_markDirtyRecordOn = new Array();
	}
	if(this.m_lazyFetchRecordOn == null)
	{
		this.m_lazyFetchRecordOn = new Array();
	}

	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
	    if(c.records)
	    {
	    	this.configRecords(c);
	    }
	    else if(c.isRecord)
	    {
	    	this.configIsRecord(c);
	    }
	    else if(c.lazyFetches)
	    {
	    	this.configLazyFetchs(c);
	    }
	}
	// if this not a form adaptor then register the records with the form adaptor
	// because it needs to know about all records for cleaning up the data before
	// calling a service
	var formAdaptor = FormController.getInstance().getFormAdaptor();
	if(this.getId() != formAdaptor.getId() && this.m_records.length>0)
	{
		formAdaptor.addRecords(this.m_records);
	}
}

RecordsProtocol.prototype.addRecords = function(recordOn)
{
	if(RecordsProtocol.m_logger.isTrace()) RecordsProtocol.m_logger.trace(this.getDisplayName() + ": addRecords() this.m_records length = " + this.m_records.length + ", adding " + recordOn.length + " records");
	this.m_records = this.m_records.concat(recordOn);
}

/**
 * Perform cleanup required by the protocol before it is destroyed
 */
RecordsProtocol.prototype.disposeRecordsProtocol = function()
{
}

RecordsProtocol.stripCleanRecords = function(stripNode, recordOffset, targetXPath)
{
	var formAdaptor = FormController.getInstance().getFormAdaptor();
	if(formAdaptor.hasRecordsForStripping())
	{
		stripNode = formAdaptor.stripCleanRecords(stripNode, recordOffset, targetXPath);
	}
	return stripNode;
}

RecordsProtocol.prototype.stripCleanRecords = function(stripNode, recordOffset, targetXPath)
{
	if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": stripCleanRecords() recordOffset = " + recordOffset + ", targetXPath = " + targetXPath);

	// ToDo: complete
	// search for nodes containing the dirty flag, if there is none then return an empty node
	// but if there are then remove all clean records - find dirty elements, navigate up a node
	// then remove all other child nodes that don't contain a dirty flag. But also need to look
	// for records that have no dirty flags set at all by comparing against this.m_records.
	for(var i=0, rl=this.m_records.length; i<rl; i++)
	{
		// If we have a recordOffset then remove this from the beginning of the record xpaths - this
		// is used when people are adding a subNode from the main node and we need to alter the record
		// xpath to be able to determine xpaths
		var record = this.m_records[i];
		var recordXPath = record.getXPath();
		if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": stripCleanRecords() recordXPath = " + recordXPath);
		if(recordOffset != null && recordOffset != "")
		{
			var index = recordXPath.indexOf(recordOffset);
			// If the recordOffset does not equal the beginning of the string then the record in not
			// contained in the xml fragment
			if(index != 0)
			{
				recordXPath = null;
			}
			else
			{
				recordXPath = recordXPath.substring(recordOffset.length);
			}
			if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": stripCleanRecords() recordXPath after taking into account recordOffset = " + recordXPath);
		}
		// This is only used from the form lifecycle code as you can construct a node, and then construct a new
		// xml structure to put the node into
		if(targetXPath != null && targetXPath != "")
		{
			recordXPath = XPathUtils.concatXPaths(targetXPath, recordXPath);
			if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": stripCleanRecords() added targetXPath, recordXPath = " + recordXPath);
		}
		if(recordXPath != null)
		{
			var nodes = stripNode.selectNodes(recordXPath);
			for(var j=0, nl=nodes.length; j<nl; j++)
			{
				var node = nodes[j];
				var dirtyNode = node.selectSingleNode("./" + RecordsProtocol.RECORD_DIRTY_ELEMENT);
				if(dirtyNode == null || XML.getNodeTextContent(dirtyNode) != "true")
				{
					// remove this child from the parent because the record is clean
					var parent = node.parentNode;
					parent.removeChild(node) ;	
				}
				else
				{
					// strip out the dirty flag so as not to affect server-side schema validation
					var parent = dirtyNode.parentNode;
					parent.removeChild(dirtyNode) ;	
				}
			}
		}
	}
	
	return stripNode;
}

/**
 * Invoke the isEnabled method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
RecordsProtocol.prototype.invokeMarkRecordDirty = function(event)
{
	if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": invokeMarkRecordDirty() data model event = " + event.toString());
	
	if(event.getType() != DataModelEvent.REMOVE)
	{
	    // Defect 912.
	    // No need to process delete operations because the node will
	    // be removed from the DOM. Therefore, setting the record
	    // dirty node is pointless.
	    
	    var dirtyRecordXPath = "/" + RecordsProtocol.RECORD_DIRTY_ELEMENT;
	
	    var dm = FormController.getInstance().getDataModel();
	    var eventXPath = event.getXPath();
	    
	    // Ignore changing of dirty record nodes for marking records as dirty, otherwise
	    // we can't clean a record by removing the dirty record node
	    if(eventXPath.lastIndexOf("/RecordDirty") != (eventXPath.length - dirtyRecordXPath.length))
	    {
		    for(var i=0, rl=this.m_records.length; i<rl; i++)
		    {
			    var recordXPath = this.m_records[i].getXPath();
			    
			    // Defect 934. The xpath below does not always
			    // work correctly.
			    //var xpath = recordXPath + "[descendant-or-self::node() = " + eventXPath + "]";
			    
			    // Use this definition instead. Defect 977. Use method getNameOfLastNode
			    // rather than getLastNodeName.
			    var finalNode = XPathUtils.getNameOfLastNode(eventXPath);
			    var xpath = recordXPath + "[descendant-or-self::" + finalNode + " = " + eventXPath + "]";
			    
			    var nodes = dm.getNodes(xpath);
			    
			    if(nodes.length > 0)
			    {
				    var rowToMarkDirtyXPath = RecordsProtocol.getRowXPathFromEventXPath(eventXPath, recordXPath);
				    
				    // D1017 - It is possible to have retrieved nodes using the combination of the event XPath
				    // and the current record XPath but there is not a match with the current record XPath.
				    // For example:
				    //   eventXPath: "/ds/Case/Prosecutor[position()=1]/PrivateRepresentation/CPFId"
				    //   recordXPath: "/ds/Case/Defendants/Defendant"
				    // The following DOM fragment has the same Private Representation set up for both
				    // Defendant and Prosecutor. This will retrieve the Defendant node but the event
				    // XPath will not match the record XPath.
				    //   <Case>
					//	   <Defendants>
					//	     <Defendant>
					//		   <PrivateRepresentation>
					//		     <CPFId>123456</CPFId>
					//		   </PrivateRepresentation>
					//		 </Defendant>
					//	   </Defendants>
					//	   <Prosecutor>
					//	     <PrivateRepresentation>
					//		   <CPFId>123456</CPFId>
					//	     </PrivateRepresentation>
					//	   </Prosecutor>
					//   </Case>
				    if(rowToMarkDirtyXPath != null)
				    {
				    	dm.setValue(rowToMarkDirtyXPath + dirtyRecordXPath, "true");
				    }
			    }
		    }
	    }
	}
	
	// Marking records dirty does not require a repaint of the adaptor
	return false;
}

// eventXPath =  "/ds/Cases/Case[id = 1]/Addresses/Address[id = 1]/AddressLine1"
// recordXPath = "/ds/Cases/Case/Addresses/Address"

RecordsProtocol.getRowXPathFromEventXPath = function(eventXPath, recordXPath)
{
	var originalXPath = eventXPath;
	var eventIndex = 0;
	var slashIndex = 0;

	while(slashIndex != -1)
	{
		recordXPath = recordXPath.substring(slashIndex + 1);
		slashIndex = recordXPath.indexOf("/");
		
		if(slashIndex != -1)
		{
			// Multiple nodes in record XPath
			var nextElement = recordXPath.substring(0, slashIndex);
			var index = eventXPath.indexOf(nextElement);
			
			if(index != -1)
			{
				// Matched node of record XPath in event XPath
				eventIndex = eventIndex + index + nextElement.length;
				eventXPath = eventXPath.substring(index + nextElement.length);
				
				// Iterate to the end of the predicate(s) for the matched
				// node in the event XPath
				while(eventXPath.charAt(0) == "[")
				{
					index = eventXPath.indexOf("]");
					eventIndex = eventIndex + index + 1;
					eventXPath = eventXPath.substring(index + 1);
				}
			}
			else
			{
				// No match for record XPath node in event XPath
				return null;
			}
		}
		else
		{
			// Only one node in record XPath
			var nextElement = recordXPath;
			var index = eventXPath.indexOf(nextElement);

			if(index != -1)
			{
				// Matched node of record XPath in event XPath
				eventIndex = eventIndex + index + nextElement.length;
				eventXPath = eventXPath.substring(index + nextElement.length);

				// Iterate to the end of the predicate(s) for the matched
				// node in the event XPath				
				while(eventXPath.charAt(0) == "[")
				{
					index = eventXPath.indexOf("]");
					eventIndex = eventIndex + index + 1;
					eventXPath = eventXPath.substring(index + 1);
				}
			}
			else
			{
				// No match for record XPath node in event XPath
				return null;
			}
		}
	}
	
	// Event XPath up to last record XPath node plus any predicates
	return originalXPath.substring(0, eventIndex);
}

/**
 * Invoke the isEnabled method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
RecordsProtocol.prototype.invokeLazyFetchRecord = function(event)
{
	if(RecordsProtocol.m_logger.isDebug()) RecordsProtocol.m_logger.debug(this.getDisplayName() + ": invokeLazyFetchRecord() data model event = " + event.toString());

	var dm = FormController.getInstance().getDataModel() ;
	var eventXPath = event.getXPath();
	for(var i=0, rl=this.m_records.length; i<rl; i++)
	{
		var record = this.m_records[i];
		var lazyFetchXPath = record.getLazyFetchXPath();
		if(lazyFetchXPath == eventXPath)
		{
			var lazyFetchs = record.getLazyFetchs();
			var key = Services.getValue(lazyFetchXPath);
			if(key == null || key == "")
			{
				// don't bother to lazily fetch if there is no row
			}
			else
			{
				var rowXPath = record.getXPath();
				rowXPath = rowXPath + "[" + record.getKeyXPath() + " = \'" + key + "\']";
				for(var i=0, l=lazyFetchs.length; i<l; i++)
				{
					var lazyFetch = lazyFetchs[i];
					var nodeExistsCheckXPath = rowXPath + "/" + lazyFetch.getNodeXPath();
					if(!Services.exists(nodeExistsCheckXPath))
					{
						this.invokeLazyFetchingService(rowXPath, lazyFetch);
					}
				}
			}
		}
	}
	// lazy fetching of records does not require a repaint of the adaptor
	return false;
}

RecordsProtocol.prototype.invokeLazyFetchingService = function(rowXPath, lazyFetch)
{
	var serviceConfig = lazyFetch.getService();
	var resultTargetXPath = lazyFetch.getResultTargetXPath();
	var dL = RecordsProtocolLazyLoadingDataLoader.create(serviceConfig, this, rowXPath, resultTargetXPath);
	dL.load();
}

// The success function calls a static method on a timeout because for synchronous computed service calls
// the call to this happens inside of a processEvents() loop which invalidates the suspension of dirty record events.
// By putting this on a timeout then we are guaranteed that it will not happen inside a processEvents loop.
RecordsProtocol.prototype.onLazyFetchingServerSuccess = function(dom, rowXPath, resultTargetXPath)
{
	var fc = FormController.getInstance();
//	var dm = fc.getDataModel();
	//alert("it worked, received dom = " + dom.xml);

	var formAdaptor = fc.getFormAdaptor();
	
	// If adaptor supports FormDirtyProtocol and dirty event monitoring is not suspended,
	// then suspend dirty event monitoring. This way a form's dirty state won't be
	// affected by data being lazy loaded into the model.
	var restartDirtyEventChecking = false
	if(formAdaptor.supportsProtocol("FormDirtyProtocol") && !formAdaptor.dirtyEventsSuspended())
	{
		restartDirtyEventChecking = true;
		formAdaptor.suspendDirtyEvents(true);
	}
		
	try
	{
	if(resultTargetXPath != null)
	{
		var nodesToAdd = dom.selectNodes(resultTargetXPath);
		for(var i=0, l=nodesToAdd.length; i<l; i++)
		{
			Services.addNode(nodesToAdd[i], rowXPath);
		}
	}
	else
	{
		Services.addNode(dom, rowXPath);
	}
	}
	catch(e)
	{
		if(RecordsProtocol.m_logger.isError()) RecordsProtocol.m_logger.error(this.getDisplayName() + ": RecordsProtocol.onLazyFetchingServerSuccess() caught exception attempting to add the lazy fetch data to the record, e = " + e);
	}
	
	// If FormDirtyProtocol dirty event monitoring was suspended, then restart it now
	if(restartDirtyEventChecking)
	{
		formAdaptor.suspendDirtyEvents(false);
    }
}

/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
RecordsProtocol.prototype.getListenersForRecordsProtocol = function()
{
    var listenerArray = new Array();
    var dirtyRecordListener = FormControllerListener.create(this, FormController.DIRTY_RECORD);
    var lazyFetchListener = FormControllerListener.create(this, FormController.LAZY_FETCH_RECORD);
    
	var on = this.getMarkDirtyRecordOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i] + "//*", listener: dirtyRecordListener});
		}
	}

	var on = this.getLazyFetchRecordOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: lazyFetchListener});
		}
	}
    
    return listenerArray;
}

RecordsProtocol.prototype.createRecord = function(xpath, keyXPath, stripCleanRecords, lazyFetchXPath, lazyFetchs, displayName)
{
	var record = Record._create(xpath, keyXPath, stripCleanRecords, lazyFetchXPath, lazyFetchs, displayName);
	if(stripCleanRecords == true)
	{
		this.m_markDirtyRecordOn[this.m_markDirtyRecordOn.length] = xpath;
	}
	if(lazyFetchs != null && lazyFetchs.length > 0)
	{
		this.m_lazyFetchRecordOn[this.m_lazyFetchRecordOn.length] = lazyFetchXPath;
	}
	return record;
}

function Record()
{
	this.m_xpath = null;
	this.m_stripCleanRecords = null;
	this.m_lazyFetchXPath = null;
	this.m_lazyFetchs = null;
	this.m_displayName = null;
}

Record._create = function(xpath, keyXPath, stripCleanRecords, lazyFetchXPath, lazyFetchs, displayName)
{
	var record = new Record();
	record.m_xpath = xpath;
	record.m_keyXPath = keyXPath;
	record.m_stripCleanRecords = stripCleanRecords;
	record.m_lazyFetchXPath = lazyFetchXPath;
	record.m_lazyFetchs = new Array();
	if(lazyFetchs != null)
	{
		for(var i=0, l=lazyFetchs.length; i<l; i++)
		{
			var lazyFetchConfig = lazyFetchs[i];
			record.m_lazyFetchs[record.m_lazyFetchs.length] = new LazyFetch(lazyFetchConfig);
		}
	}
	// optional, only used for displaying logging and error messages
	record.m_displayName = displayName;
	
	return record;
}

Record.prototype.getXPath = function()
{
	return this.m_xpath;
}

Record.prototype.getKeyXPath = function()
{
	return this.m_keyXPath;
}

Record.prototype.getLazyFetchXPath = function()
{
	return this.m_lazyFetchXPath;
}

Record.prototype.getStripCleanRecords = function()
{
	return this.m_stripCleanRecords;
}

Record.prototype.getLazyFetchs = function()
{
	return this.m_lazyFetchs;
}

Record.prototype.getDisplayName = function()
{
	return this.m_displayName;
}

function LazyFetch(lazyFetchConfig)
{
	this.m_nodeXPath = lazyFetchConfig.nodeXPath;
	this.m_resultTargetXPath = lazyFetchConfig.resultTargetXPath;
	this.m_service = lazyFetchConfig.service;
	this.m_displayName = (lazyFetchConfig.displayName == null) ? XPathUtils.getLastNodeName(this.m_nodeXPath) : lazyFetchConfig.displayName;
}

LazyFetch.prototype.getNodeXPath = function()
{
	return this.m_nodeXPath;
}

LazyFetch.prototype.getResultTargetXPath = function()
{
	return this.m_resultTargetXPath;
}

LazyFetch.prototype.getService = function()
{
	return this.m_service;
}

LazyFetch.prototype.getDisplayName = function()
{
	return this.m_displayName;
}
