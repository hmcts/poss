//==================================================================
//
// Category.js
//
// This class is used to implement logging for a category.
//
//==================================================================

/**
 * Constructor
 */
function Category(name)
{
	this.m_name = name;
	
	Logging._registerCategory(this);
}

Category.prototype.m_name;

/**
 * Logs a message for this category at the named level.
 *
 * @param message: The message to log
 * @param level: Logging level of message
 */
Category.prototype.logMessage = function(message, level)
{
  Logging.logMessage(message, level, this.m_name);
}

/**
 * Logs a LOGGING_LEVEL_ERROR message for this category.
 *
 * @param message: The message to log
 */
Category.prototype.error = function(message)
{
  Logging.logMessage(message, Logging.LOGGING_LEVEL_ERROR, this.m_name);
}

/**
 * Logs a LOGGING_LEVEL_WARNING message for this category.
 *
 * @param message: The message to log
 */
Category.prototype.warn = function(message)
{
  Logging.logMessage(message, Logging.LOGGING_LEVEL_WARN, this.m_name);
}

/**
 * Logs a LOGGING_LEVEL_INFO message for this category.
 *
 * @param message: The message to log
 */
Category.prototype.info = function(message)
{
  Logging.logMessage(message, Logging.LOGGING_LEVEL_INFO, this.m_name);
}

/**
 * Logs a LOGGING_LEVEL_DEBUG message for this category.
 *
 * @param message: The message to log
 */
Category.prototype.debug = function(message)
{
  Logging.logMessage(message, Logging.LOGGING_LEVEL_DEBUG, this.m_name);
}

/**
 * Logs a LOGGING_LEVEL_TRACE message for this category.
 *
 * @param message: The message to log
 */
Category.prototype.trace = function(message)
{
  Logging.logMessage(message, Logging.LOGGING_LEVEL_TRACE, this.m_name);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_ERROR or greater for
 * this category.
 * Otherwise returns false. 
 */
Category.prototype.isError = function()
{
	return Logging.isCategoryLoggingAtLevel(this.m_name, Logging.LOGGING_LEVEL_ERROR);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_WARN or greater for
 * this category.
 * Otherwise returns false.
 */
Category.prototype.isWarn = function()
{
	return Logging.isCategoryLoggingAtLevel(this.m_name, Logging.LOGGING_LEVEL_WARN);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_INFO or greater for
 * this category.
 * Otherwise returns false.
 */ 
Category.prototype.isInfo = function()
{
	return Logging.isCategoryLoggingAtLevel(this.m_name, Logging.LOGGING_LEVEL_INFO);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_DEBUG or greater for
 * this category.
 * Otherwise returns false.
 */
Category.prototype.isDebug = function()
{
	return Logging.isCategoryLoggingAtLevel(this.m_name, Logging.LOGGING_LEVEL_DEBUG);
}

/**
 * Returns true if the logging level is LOGGING_LEVEL_TRACE or greater for
 * this category.
 * Otherwise returns false.
 */
Category.prototype.isTrace = function()
{
	return Logging.isCategoryLoggingAtLevel(this.m_name, Logging.LOGGING_LEVEL_TRACE);
}
