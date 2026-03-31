//==================================================================
//
// FCTransactionListener.js
//
//
//==================================================================


/**
 * DataModelTransactionListener which notifies the FormController
 * about DataModel transactions
 *
 * @constructor
 * @private
 */
function FCTransactionListener()
{
}


// FCTransactionListener is a sub class of DataModelTransactionListener
FCTransactionListener.prototype = new DataModelTransactionListener();
FCTransactionListener.prototype.constructor = FCTransactionListener;

FCTransactionListener.m_logger = new Category( "FCTransactionListener" );


/**
 * Flag to indicated whether there is a nested transaction
 *
 * @type boolean
 */
FCTransactionListener.prototype.m_nested = false;


/**
 * Method invoked when the DataModel starts a transaction
 */
FCTransactionListener.prototype.start = function()
{
	// the following line only exists to allow me to breakpoint on it
	var i = 0;
}


/**
 * Method invoked when the DataModel completes a transaction
 */
FCTransactionListener.prototype.end = function()
{   
	if(false == this.m_nested)
	{
		this.m_nested = true;
		FormController.getInstance().processEvents();
		this.m_nested = false;
	}
}

