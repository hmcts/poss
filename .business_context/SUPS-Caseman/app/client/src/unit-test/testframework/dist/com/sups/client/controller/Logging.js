//==================================================================
//
// Logging.js
//
// This class is used to delegate logging to the LoggingImpl class.
//
//==================================================================

/**
 * Constructor
 */
function Logging()
{
}

Logging.LOGGING_LEVEL_OFF = 0;
Logging.LOGGING_LEVEL_ERROR = 1;
Logging.LOGGING_LEVEL_WARN = 2;
Logging.LOGGING_LEVEL_INFO = 3;
Logging.LOGGING_LEVEL_DEBUG = 4;
Logging.LOGGING_LEVEL_TRACE = 5;

Logging.m_implWindow = null;
Logging.m_logQueue = new Array();
Logging.m_registerQueue = new Array();

/**
 * Initialise logging.
 * 1) Set the window object where the Logging implementation class is instantiated.
 * 2) Replace temporary implementations.
 * 3) Output log messages from local queue.
 *
 * @param implWindow: LoggingImpl class's window object
 */
Logging.initialise = function(implWindow)
{
	if (implWindow != null) {
		Logging.m_implWindow = implWindow;

		Logging.isCategoryLoggingAtLevel = Logging._isCategoryLoggingAtLevel;
		Logging.logMessage = Logging._logMessage;
		Logging._registerCategory = Logging.__registerCategory;

		var i;
		for(i = 0; i < Logging.m_registerQueue.length; i++)
		{
			Logging._registerCategory(Logging.m_registerQueue[i]);
		}
		Logging.m_registerQueue = null;
		
		for (i = 0; i < Logging.m_logQueue.length; i++) {
			var msgObj = Logging.m_logQueue.pop();
			Logging.logMessage(msgObj.message, msgObj.level, msgObj.category);
		}
		Logging.m_logQueue = null;
	}
}

/**
 * Clean up logging internal variables.
 */
Logging.destroy = function()
{
	if(Logging.m_implWindow != null)
	{
		Logging.m_implWindow.LoggingImpl.flush();
		Logging.m_implWindow = null;
	}
	
	if(Logging.m_logQueue != null)
	{
		for(var i = Logging.m_logQueue.length - 1; i >= 0; i--)
		{
			Logging.m_logQueue[i] = null;
		}
		
		Logging.m_logQueue = null;
	}
	
	if(Logging.m_registerQueue != null)
	{
		for(var i = Logging.m_registerQueue.length - 1; i >= 0; i--)
		{
			Logging.m_registerQueue[i] = null;
		}
		
		Logging.m_registerQueue = null;
	}
}

/**
 * It is possible that messages may be logged before Logging.initialise()
 * is called. In this case log messages will be placed into a local queue.
 * When logging is initialised the _logMessage() function is assigned to
 * this function before the log messages in the local queue are output.
 *
 * @param message: The message to log
 * @param level: Logging level of message
 * @param category: Category that is logging message
 */
Logging.logMessage = function(message, level, category)
{
	var msgObj = new Object();

	msgObj.message = message;
	msgObj.level = level;
	msgObj.category = category;

	Logging.m_logQueue.push(msgObj);
}


/**
 * Delegates logging a message for the named category and level to the
 * LoggingImpl class.
 *
 * @param message: The message to log
 * @param level: Logging level of message
 * @param category: Category that is logging message
 */
Logging._logMessage = function(message, level, category)
{
	Logging.m_implWindow.LoggingImpl.logMessage(message, level, category);
}


Logging._registerCategory = function(category)
{
	Logging.m_registerQueue.push(category);
}


Logging.__registerCategory = function(category)
{
	Logging.m_implWindow.LoggingImpl._registerCategory(category.m_name);
}


/**
 * It is possible that this function may be called before Logging.initialise()
 * is called. In this case logging for the category and level is assumed to be
 * set. When logging is initialised _isCategoryLoggingAtLevel() function is
 * assigned to this function.
 *
 * Always returns true. 
 *
 * @param category: Which Category to check logging level for
 * @param level: Logging level to check
 */
Logging.isCategoryLoggingAtLevel = function(category, level)
{
	return true;
}

/**
 * Delegates checking whether or not the named category is logging at the named
 * level to the LoggingImpl class.
 *
 * Returns true if the logging level for the category is greater than or equal
 * to the level being checked.
 * Otherwise returns false.
 *
 * @param category: Which Category to check logging level for
 * @param level: Logging level to check
 */
Logging._isCategoryLoggingAtLevel = function(category, level)
{
	return Logging.m_implWindow.LoggingImpl.isCategoryLoggingAtLevel(category, level);
}


/**
 * FUNCTIONS FROM HERE TO THE EOF ARE ONLY PROVIDED FOR BACKWARDS COMPATIBILITY.
 * THEY SHOULD BE REMOVED WHEN LOGGING CATEGORIES HAVE BEEN IMPLEMENTED IN THE
 * CLIENT FRAMEWORK SOURCE FILES.
 */
 
/**
 * Log an error message.
 *
 * @param message: The message to log
 * @param category: Category that is logging message
 */
Logging.error = function(message)
{
	Logging.logMessage(message, Logging.LOGGING_LEVEL_ERROR, null);
}

/**
 * Log a warning message.
 *
 * @param message: The message to log
 * @param category: Category that is logging message 
 */
Logging.warn = function(message)
{
	Logging.logMessage(message, Logging.LOGGING_LEVEL_WARN, null);
}

/**
 * Log a information message.
 *
 * @param message: The message to log
 * @param category: Category that is logging message 
 */
Logging.info = function(message, category)
{
	Logging.logMessage(message, Logging.LOGGING_LEVEL_INFO, null);
}

/**
 * Log a debug message.
 *
 * @param message: The message to log
 * @param category: Category that is logging message 
 */
Logging.debug = function(message, category)
{
	Logging.logMessage(message, Logging.LOGGING_LEVEL_DEBUG, null);
}

/**
 * Log a trace message.
 *
 * @param message: The message to log
 * @param category: Category that is logging message
 */
Logging.trace = function(message, category)
{
	Logging.logMessage(message, Logging.LOGGING_LEVEL_TRACE, null);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_ERROR or greater.
 * Otherwise returns false. 
 */
Logging.isError = function()
{
	return Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_ERROR);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_WARN or greater.
 * Otherwise returns false. 
 */
Logging.isWarn = function()
{
	return Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_WARN);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_INFO or greater.
 * Otherwise returns false.
 */
Logging.isInfo = function()
{
	return Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_INFO);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_DEBUG or greater.
 * Otherwise returns false.
 */
Logging.isDebug = function()
{
	return Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_DEBUG);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_TRACE or greater.
 * Otherwise returns false. 
 */
Logging.isTrace = function()
{
	return Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_TRACE);
}
