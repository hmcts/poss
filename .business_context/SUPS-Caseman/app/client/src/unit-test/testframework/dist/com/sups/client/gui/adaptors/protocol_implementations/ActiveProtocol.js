//==============================================================
//  
//  ActiveProtocol
//
//  Indicates whether or not the input element can currently be
//  modified.  This is not the same as being enabled.  For 
//  example, a field may be inactive for the duration of a LOV,
//  however it is not disabled(not enabled). 
//
//  This allows us to separate the concept of a fields 
//  enablement status from its use within a screen. A field
//  may well be enabled when a popup is raised, then disabled
//  while the popup is still up.  On closing the popup the
//  field should still be disabled.
//
//  Is not user definable and does not contain configuration 
//  information.
//
//  It is the responsibility of the renderer to display the 
//  adaptor in the appropriate form when not active.
//
//==============================================================

/*
 * ActiveProtocol constructor
 *
 * @constructor
 */
function ActiveProtocol()
{
}


/**
 * Current activity state of the adaptor - defaults to active.
 */
ActiveProtocol.prototype.m_active = true;


/**
 *  Set method for active state indicator.
 */
ActiveProtocol.prototype.setActive = function(elementActive)
{
  this.m_active = elementActive;
}


/**
 *  Retrieve method for active state indicator.
 */
ActiveProtocol.prototype.isActive = function()
{
  return this.m_active;
}


/**
 * Perform cleanup required by the ActiveProtocol before
 * it is destroyed
 */
ActiveProtocol.prototype.disposeActiveProtocol = function()
{
}

/**
 * Initialisation method for ActiveProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ActiveProtocol.prototype.configActiveProtocol = function(cs)
{
}




