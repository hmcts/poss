//==================================================================
//
// LoggingImpl.js
//
// This class is used to implement logging.
//
//==================================================================

/**
 * Constructor
 */
function LoggingImpl()
{
}

LoggingImpl.m_reservedCategory = "Default";

LoggingImpl.m_initialised = false;
LoggingImpl.m_loggingLevel = new Array();
LoggingImpl.m_logQueue = new Array();
LoggingImpl.m_logCounter = 0;
LoggingImpl.m_timeout = null;
LoggingImpl.m_levels = ["OFF", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

/**
 * Initialise the logging framework and configure categories.
 *
 * The logging framework looks for a parameter 'logging' as part of an URL.
 * The value of the logging parameter determines the level of logging enabled,
 * as defined by the Logging.LOGGING_LEVEL_* values in the Logging class.
 *
 * Categories are configured via an XML document, the URL of which is passed
 * to this function.
 *
 * @param logconfigURL: URL of the category configuration file
 */
LoggingImpl.initialise = function(logconfigURL)
{
  // If already initialised then don't bother
  if (false == LoggingImpl.m_initialised) {
    var params = getURLParameters();
	var loggingLevel = parseInt(params['logging']);
    
    // Check for logging parameter exists and is a number
    if (loggingLevel != null && !isNaN(loggingLevel)) {
        // Make sure logging parameter falls within the defined values 
        if (loggingLevel < Logging.LOGGING_LEVEL_OFF) {
          loggingLevel = Logging.LOGGING_LEVEL_OFF;
        }
        else if (loggingLevel > Logging.LOGGING_LEVEL_TRACE) {
          loggingLevel = Logging.LOGGING_LEVEL_TRACE;
        }
    }
    else {
        // Logging parameter doesn't exist or not a number, so set logging off
    	loggingLevel = Logging.LOGGING_LEVEL_OFF;
    }

  	LoggingImpl.m_loggingLevel[LoggingImpl.m_reservedCategory] = loggingLevel; 	
	LoggingImpl.m_initialised = true;
    
    LoggingImpl.logMessage("Logging initialised to level: " +
    			LoggingImpl.m_levels[loggingLevel], Logging.LOGGING_LEVEL_INFO,
    						LoggingImpl.m_reservedCategory);

	if (logconfigURL != null) {
		LoggingImpl.configureCategories(logconfigURL);
	}   									
  }
}


LoggingImpl._registerCategory = function(name)
{
	// If category not already registered through configuration, then default
	// its level to OFF.
	if(null == LoggingImpl.m_loggingLevel[name])
	{
		LoggingImpl.m_loggingLevel[name] = LoggingImpl.LEVEL_OFF;
	}
}


/**
 * Load the logging category configuration XML document.
 * Add an element to the Log Level array and set the level 
 * for each category in the configuration document.
 *
 * @param logconfigURL: URL of the category configuration file
 */
LoggingImpl.configureCategories = function(logconfigURL)
{
	var callBack = {
		onSuccess: function(dom)
		{
			// Logging category configuration XML loaded OK, so configure
			// categories
			LoggingImpl.configure(dom);
		},
		onError: function(ex)
		{
			// Logging category configuration XML missing or parse error
			LoggingImpl.logMessage(
			  "Error loading category configuration XML (" + logconfigURL +
			    "): " + ex.message,
				  Logging.LOGGING_LEVEL_ERROR, LoggingImpl.m_reservedCategory);			
		}
	}
	
    // Load logging category configuration XML file. Note: 1) Synchronous call,
    // prevents a call to logging before categories are initialised. 2) Progress
    // bar turned off as Application Controller is not initialised
	var dom = Services.loadDOMFromURL(logconfigURL, callBack, false, false);
}

LoggingImpl.configure = function(dom)
{
	var categoryNodes = dom.getElementsByTagName("category");
	var noOfNodes = categoryNodes.length;
	
	if (0 == noOfNodes) {
		LoggingImpl.logMessage("No category nodes in category configuration XML",
			Logging.LOGGING_LEVEL_ERROR, LoggingImpl.m_reservedCategory);
		return;
	}

	for (i = 0; i < noOfNodes; i++) {
		var nameNode = categoryNodes[i].selectSingleNode("name");
		var levelNode = categoryNodes[i].selectSingleNode("level");	

		if (nameNode != null && levelNode != null) {
			var categoryName = XML.getNodeTextContent(nameNode);
			var categoryLevel = XML.getNodeTextContent(levelNode);
			
			if (categoryName != null && categoryLevel != null) {
				categoryLevel = eval('Logging.LOGGING_LEVEL_' + categoryLevel);

				if (categoryLevel != null) {					
					// Valid logging level, so set for category
					LoggingImpl.m_loggingLevel[categoryName] = categoryLevel;
					LoggingImpl.logMessage("Logging for category set to level: " +
							LoggingImpl.m_levels[categoryLevel],
								Logging.LOGGING_LEVEL_INFO, categoryName);
				}
				else {
					// Invalid logging level, so turn off for category
					LoggingImpl.m_loggingLevel[categoryName] = LoggingImpl.LEVEL_OFF;
					LoggingImpl.logMessage("Invalid logging level, " + XML.getNodeTextContent(levelNode) +
							", for category: " + categoryName,
								Logging.LOGGING_LEVEL_ERROR, LoggingImpl.m_reservedCategory);
				}
			}
			else {
				LoggingImpl.logMessage("Missing value for category node: " +
					((null == categoryName) ? "<name>" : "<level> category: " + categoryName),
						Logging.LOGGING_LEVEL_ERROR, LoggingImpl.m_reservedCategory);
			}
		}
		else {
			LoggingImpl.logMessage("Missing category node: " +
				((null == nameNode) ? "<name>" : "<level>"),
					Logging.LOGGING_LEVEL_ERROR, LoggingImpl.m_reservedCategory);
		}
	}
}


LoggingImpl.getConfig = function()
{
	var str = "<categories>";
	
	var levels = LoggingImpl.m_loggingLevel;
	// Iterate through all categories
	for(i in levels)
	{
		var levelStr = "OFF";
		switch(levels[i])
		{
			case Logging.LOGGING_LEVEL_ERROR:
			{
				levelStr = "ERROR";
				break;
			}
			
			case Logging.LOGGING_LEVEL_WARN:
			{
				levelStr = "WARN";
				break;
			}
			
			case Logging.LOGGING_LEVEL_INFO:
			{
				levelStr = "INFO";
				break;
			}
			
			case Logging.LOGGING_LEVEL_DEBUG:
			{
				levelStr = "DEBUG";
				break;
			}
			
			case Logging.LOGGING_LEVEL_TRACE:
			{
				levelStr = "TRACE";
				break;
			}
			
			default:
			{
				// Do nothing - use default "OFF" set above...
			}
		}
		
		// Add XML definition of each category
		str += ("<category><name>" + i + "</name><level>" + levelStr + "</level></category>");
	}
	
	str += "</categories>";
	
	return str;
}


/**
 * Logs a message for category and level.
 *
 * If category is null then the LoggingImpl class's reserved category name is used.
 *
 * Checks if the the level of the message being logged is less than or equal to the
 * level set for the category. If so, then adds a message to the queue and sets a
 * timeout for delayedLogMessage function to be called after 100 msecs.
 *
 * @param message: The message to log
 * @param level: Logging level of message
 * @param category: Category that is logging message
 */
LoggingImpl.logMessage = function(message, level, category)
{
	if (LoggingImpl.isCategoryLoggingAtLevel(category, level)) {
		if (null == category) {
			// Category not defined so use reserved category name
			category = LoggingImpl.m_reservedCategory;
		}

		LoggingImpl.m_logCounter++;

		message = encodeXML(message);
		
		LoggingImpl.m_logQueue.push(LoggingImpl.m_logCounter +
			" (" + category + " - " + LoggingImpl.m_levels[level] + "): " +
				new Date() + ": " + message);
	
		if (LoggingImpl.m_timeout != null) {
			clearTimeout(LoggingImpl.m_timeout);
		}

		LoggingImpl.m_timeout = setTimeout("LoggingImpl.delayedLogMessage()", 100);
	}
}

/**
 * Checks whether or not a category is logging at a certain level.
 *
 * The reserved category is in overall control of logging, individual category
 * logging levels do not override it. For example, if the reserved category's
 * logging level is INFO and a category's logging level is DEBUG then any of the
 * category's DEBUG log messages will not be output.
 *
 * Returns true if the logging level for the category is greater than or equal
 * to the level being checked.
 * Otherwise false.
 *
 * @param category: Which Category to check logging level for
 * @param level: Logging level to check
 */
LoggingImpl.isCategoryLoggingAtLevel = function(category, level)
{
	var isCategoryLogging = false;

	if (null == category) {
		// Category not defined so use reserved category name
		category = LoggingImpl.m_reservedCategory;
	}

	if (level <= LoggingImpl.m_loggingLevel[LoggingImpl.m_reservedCategory] &&
			LoggingImpl.m_loggingLevel[category] != null &&
					level <= LoggingImpl.m_loggingLevel[category])
	{
		isCategoryLogging = true;	
	}

	return isCategoryLogging;
}


/**
 * If the log message queue is not empty then open a window and output all the
 * messages in the log message queue in reverse order to the window.
 */
LoggingImpl.delayedLogMessage = function()
{
	if (this.m_logQueue.length > 0) {
		var w = LoggingImpl.w;
		if((null == LoggingImpl.w) || LoggingImpl.w.closed)
		{
			LoggingImpl.w = window.open("", "logging", "scrollbars,resizable");
			
			w = null;
		}
		
		
		if (null == w || null == w.document || null == w.document.body) {
			LoggingImpl.m_timeout = setTimeout("LoggingImpl.delayedLogMessage()", 100);		
		}
		else {
			// Comment out the .reverse() and .insertBefore, and uncomment the .appendChild 
			// to display the logging in natural order rather than reversed
			var d = w.document;
			var b = d.body;
		    var l = d.createElement("div");
		    b.insertBefore(l, b.firstChild);
		    this.m_logQueue.reverse();
		    l.innerHTML = this.m_logQueue.join("<br>");
//		    b.appendChild(l);
		    
			this.m_logQueue = new Array();
		}
	}
}

/**
 * Output all the messages in the log message queue.
 */
LoggingImpl.flush = function()
{
	LoggingImpl.delayedLogMessage();
}
