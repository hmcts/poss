//==================================================================
//
// fwDataServiceException.js
//
// Exceptions thrown by DataServices
//
//==================================================================


/**
 * Constructor for exceptions thrown by DataServices
 *
 * @ctor
 * @param msg the exception message
 * @param rootCause the Exception which caused this Exception to be thrown
 */
function fwDataServiceException(msg, rootCause)
{
	// Call parent class constructor
	fwException.call(this, msg, rootCause);
    this.exceptionHierarchy = new Array('Error','BusinessException','fwDataServiceException');
}

fwDataServiceException.prototype = new fwException();
fwDataServiceException.prototype.constructor = fwDataServiceException;



/**
 * Constructor for exceptions thrown by ComputedDataServices
 *
 * @ctor
 * @param msg the exception message
 * @param rootCause the Exception which caused this Exception to be thrown
 */
function fwComputedDataServiceException(msg, rootCause)
{
	// Call parent class constructor
	fwException.call(this, msg, rootCause);
    this.exceptionHierarchy = new Array('Error','BusinessException','fwComputedDataServiceException');
}

fwComputedDataServiceException.prototype = new fwException();
fwComputedDataServiceException.prototype.constructor = fwDataServiceException;

fwComputedDataServiceException.prototype.addDetail = function(detail)
{
    this.m_detail = detail;
}

fwComputedDataServiceException.prototype.getDetail = function()
{
    return this.m_detail;
}

