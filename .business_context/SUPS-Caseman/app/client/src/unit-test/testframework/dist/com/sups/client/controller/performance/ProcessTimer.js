/**
 * Class ProcessTimer is designed to store details about the time
 * a business process takes to execute.
 *
*/

/**
 * Constructor function
 *
 * @param processName  The name given to the business process. Note that this name should be unique.
 * @param startTime    A date object which stores the time when the business process was started.
 * @constructor
 *
*/

function ProcessTimer( processName, startTime )
{

    this.m_processName = processName;
    this.m_startTime = startTime;
    
    // Set process identity conflict flag to false
    
    this.m_identityConflict = false;
    
}

/**
 * Instance variable storing name of business process
 *
*/

ProcessTimer.prototype.m_processName = null;

/**
 * Instance variable of type Date storing time business process started
 *
*/

ProcessTimer.prototype.m_startTime = null;

/**
 * Instance variable of type Date storing time business process stopped
 *
*/

ProcessTimer.prototype.m_endTime = null;

/**
 * Instance variable of type boolean. This variable is used to flag process
 * identity conflicts. That is, if when the performance monitor method "stopProcess"
 * is invoked for a particular business process there is more than one active
 * ProcessTimer instance for the business process all active instances for the
 * business process will have this flag set to "true". This is because we know that
 * an instance of the business process stopped, but we cannot be sure which instance
 * stopped.
 *
*/

ProcessTimer.prototype.m_identityConflict = null;

/**
 * Method returns name of business process
 *
 * @return String containing name of business process
 * @public
 *
*/

ProcessTimer.prototype.getProcessName = function()
{
    return this.m_processName;
}

/**
 * Method returns time business process started
 *
 * @return Date object storing time process started
 * @public
 *
*/

ProcessTimer.prototype.getStartTime = function()
{
    return this.m_startTime;
}

/**
 * Method returns time business process ended
 *
 * @return Date object storing time process ended
 * @public
 *
*/

ProcessTimer.prototype.getEndTime = function()
{
    return this.m_endTime;
}

/**
 * Method returns identity conflict flag associated with business process
 *
 * @return boolean flag indicating whether or not an identity conflict occurred
 * @public
 *
*/

ProcessTimer.prototype.getIdentityConflict = function()
{
    return this.m_identityConflict;
}

/**
 * Method sets process end time
 *
 * @param endTime A object of type Date storing the time the business process ended
 * @public
 *
*/

ProcessTimer.prototype.setEndTime = function( endTime )
{
    this.m_endTime = endTime;
}

/**
 * Method sets the identity conflict flag
 *
 * @param identityConflict Boolean value indicating whether or not an identity conflict has occurred
 *
*/

ProcessTimer.prototype.setIdentityConflict = function( identityConflict )
{
    this.m_identityConflict = identityConflict;
}

/**
 * Method determines whether business process is currently active or not
 *
 * @return Returns "true" if business process currently active, otherwise "false"
 *
*/

ProcessTimer.prototype.isActive = function()
{
    var isActive = false;
    
    if(this.m_startTime != null && this.m_endTime == null)
    {
    	isActive = true;
    }
    
    return isActive;
    
}

/**
 * Method returns business process execution time in milliseconds
 *
 * @return If business process has completed method returns process execution time in milliseconds otherwise returns null
 *
*/

ProcessTimer.prototype.getProcessExecutionTime = function()
{
    var executionTime = null;
    
    if(this.m_startTime != null && this.m_endTime != null)
    {
    	executionTime = this.m_endTime.getTime() - this.m_startTime.getTime();
    }
    
    return executionTime;
    
} 