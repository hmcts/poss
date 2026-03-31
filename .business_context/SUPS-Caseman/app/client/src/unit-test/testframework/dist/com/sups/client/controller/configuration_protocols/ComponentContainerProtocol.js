//==================================================================
//
// ComponentContainerProtocol.js
//
//
//==================================================================


/*
 * ComponentContainerProtocol constructor
 *
 * @constructor
 */
function ComponentContainerProtocol()
{
}

ComponentContainerProtocol.m_logger = new Category("ComponentContainerProtocol");

/**
 * Initialisation method for ComponentContainer protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ComponentContainerProtocol.prototype.configComponentContainerProtocol = function(cs)
{
  for(var i = cs.length - 1; i >= 0; i--)
  {
    var c = cs[i];
    if(null != c.firstFocusedAdaptorId) this.firstFocusedAdaptorId = c.firstFocusedAdaptorId;
  }
  if(this.m_containedChildren == null) this.m_containedChildren = new Array();
}


/**
 * Perform cleanup required by the ComponentContainerProtocol before
 * it is destroyed
 */
ComponentContainerProtocol.prototype.disposeComponentContainerProtocol = function()
{
}

/*
 * When a GUIAdapter adds this protocol will automatically get this
 * property. This identifies the component as a container which may have child adapters
 */
ComponentContainerProtocol.prototype.isAContainer = true;

/*
 *  Wrapper to invoke firstFocusedAdaptorId function.
 */
ComponentContainerProtocol.prototype.invokeFirstFocusedAdaptorId = function()
{
  return (this.firstFocusedAdaptorId !=null) ?  this.firstFocusedAdaptorId.call(this) : null;
}

/*
 *  Default implementation of firstFocusedAdaptorId which should return the
 *  id of the first adaptor to recieve the focus upon the container itself
 *  gaining focus.
 */
ComponentContainerProtocol.prototype.firstFocusedAdaptorId = null;


ComponentContainerProtocol.prototype.m_containedChildren = null;
ComponentContainerProtocol.prototype.getContainedChildren = function()
{
	return this.m_containedChildren;
}
ComponentContainerProtocol.prototype.addContainedChild = function(childAdaptor)
{
	if(this.m_containedChildren == null) this.m_containedChildren = new Array();
	if(ComponentContainerProtocol.m_logger.isDebug()) ComponentContainerProtocol.m_logger.debug(this.getId() + ":ComponentContainerProtocol.addContainedChild() added child adaptor id=" + childAdaptor.getId());
	this.m_containedChildren[this.m_containedChildren.length] = childAdaptor;
	if(ComponentContainerProtocol.m_logger.isTrace()) ComponentContainerProtocol.m_logger.trace(this.getId() + ":ComponentContainerProtocol.addContainedChild() this.m_containedChildren.length=" + this.m_containedChildren.length);
}





