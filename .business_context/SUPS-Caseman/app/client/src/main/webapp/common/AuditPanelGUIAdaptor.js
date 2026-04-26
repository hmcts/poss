//==================================================================
//
// AuditPanelGUIAdaptor.js
//
// Class for implementing a generic audit panel adaptor used to configure
// panels for data history audit.
//
//==================================================================

/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 * @author rzxd7g
 * 
 */
function AuditPanelGUIAdaptor(){};

/**
 * AuditPanelGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
AuditPanelGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
AuditPanelGUIAdaptor.prototype.constructor = AuditPanelGUIAdaptor;

/**
 * AuditPanelGUIAdaptor css class
 */
AuditPanelGUIAdaptor.CSS_CLASS_NAME = "auditPanel";

/**
 * Add the required protocols to the AuditPanelGUIAdaptor
 */
GUIAdaptor._setUpProtocols('AuditPanelGUIAdaptor'); 
GUIAdaptor._addProtocol('AuditPanelGUIAdaptor', 'EnablementProtocol');          // Supports enablement/Disablement


/**
 * The initial CSS class of the panel. Need to keep this as divs
 * with different CSS classes result in a AuditPanelGUIAdaptor being
 * created
 */
AuditPanelGUIAdaptor.prototype.m_cssClass = null;


/**
 * The panel name to be displayed in the Audit Panel dropdown
 */
AuditPanelGUIAdaptor.prototype.panelName = null;


/**
 * Configuration property for the Audit Panel Adaptor, allowing 
 * the user to specify the table names and keys for each audit panel.
 * The property is an array of objects containing the
 * properties tableName of type String and keys which is an array of xpaths.
 *
 * e.g.
 *  [
 *    {tableName: "tableOne", keys: [ { xpath: "/ds/Data/KeyOne" }, { xpath: "/ds/Data/KeyTwo" } ] },
 *    {tableName: "tableTwo", keys: [ { xpath: "/ds/Data/KeyThree" } ] }
 *  ];
 *
 * @type Array[Object{tableName, keys}]
 * @configuration
 */
AuditPanelGUIAdaptor.prototype.auditTables = null;


/**
 * Constructs the node to be passed to the audit service at the xpath specified
 * with audit table and key data.
 * @param xp XPath where audit table and key data should be written.
 * Example DOM created is:
 * <Tables>
 *		<Table>
 *			<TableName>PARTIES</TableName>
 *			<Key>
 *				<Column>CPV00001</Column>
 *				<Column>DEFENDANT</Column>	
 *				<Column>1</Column>
 *			</Key>
 *		</Table>
 *		<Table>
 *			<TableName>CASES</TableName>
 *			<Key>
 *				<Column>CPV00001</Column>
 *			</Key>
 *		</Table>
 * </Tables>
 * @author rzxd7g
 * @return null 
 */
AuditPanelGUIAdaptor.prototype.getAuditPanelData = function(xp)
{
	if ( null == xp )
	{
		// User must pass an xpath to place the Audit Panel Data
		return;
	}
	
	Services.startTransaction();
	Services.removeNode(xp);	// Clear the DOM first
	for ( var i=0; i<this.auditTables.length; i++ )
	{
		var tableRow = this.auditTables[i];
		var tableRoot = xp + "/Tables/Table[" + (i + 1) + "]";

		// Set the table name
		Services.setValue( tableRoot + "/TableName", tableRow.tableName );
		
		// Set the key(s) for the table
		for ( var j=0; j<tableRow.keys.length; j++ )
		{
			var keyRow = tableRow.keys[j];
			var keyRoot = tableRoot + "/Key/Column[" + (j + 1) + "]";
			var keyValue = Services.getValue( keyRow.xpath );
			Services.setValue( keyRoot, keyValue );
		}
	}
	Services.endTransaction();
}


/**
 * Create a new AuditPanelGUIAdaptor
 *
 * @param e the audit panel div element to manage
 * @return the new AuditPanelGUIAdaptor
 * @type AuditPanelGUIAdaptor
 * @author rzxd7g
 */
AuditPanelGUIAdaptor.create = function(element)
{
	Logging.logMessage("AuditPanelGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);

	var a = new AuditPanelGUIAdaptor();
	a._initAuditPanelGUIAdaptor(element);
	return a;
}


/**
 * Helper method for the create method
 * @param element
 * @author rzxd7g
 * 
 */
AuditPanelGUIAdaptor.prototype._initAuditPanelGUIAdaptor = function(element)
{
	// Store the original CSS class
	this.m_cssClass = element.className;
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, element);
}


/**
 * Configuration method for each panel
 * @param cs
 * @author rzxd7g
 * 
 */
AuditPanelGUIAdaptor.prototype._configure = function(cs)
{
	for ( var i=0, l=cs.length-1; i<l; i++ )
	{
		// Make sure user has configured a panel name
		if ( null != cs[i].panelName )
		{	
			this.panelName = cs[i].panelName;
		}
		else
		{
			throw new ConfigurationException("Must define a Panel Name for the Audit Panel");
		}
		
		// Make sure user has correctly configured the tables and keys
		if ( null != cs[i].auditTables )
		{
			this.auditTables = cs[i].auditTables;
			for ( var j=0; j<this.auditTables.length; j++ )
			{
				// Check each table defined has a table name and at least one key defined
				var tableRow = this.auditTables[j];
				if ( null == tableRow.tableName )
				{
					throw new ConfigurationException("Must define a table name for the Audit Panel");
				}
				
				if ( tableRow.keys.length == 0 )
				{
					throw new ConfigurationException("Must define at least one key for the table defined");
				}
				else
				{
					for ( var k=0; k<tableRow.keys.length; k++ )
					{
						if ( null == tableRow.keys[k].xpath )
						{
							throw new ConfigurationException("Audit Table Key cannot be blank");
						}
					}
				}
			}
		}
		else
		{
			throw new ConfigurationException("Must define Audit Table configuration for the Audit Panel");
		}
	}
}


/**
 * Dispose method for each panel
 * @author rzxd7g
 * 
 */
AuditPanelGUIAdaptor.prototype._dispose = function()
{
	this.m_element = null;
}


/**
 * Render State method for each panel
 * @author rzxd7g
 * 
 */
AuditPanelGUIAdaptor.prototype.renderState = function()
{
}
