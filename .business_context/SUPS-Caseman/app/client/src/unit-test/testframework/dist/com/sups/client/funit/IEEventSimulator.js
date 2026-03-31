/**
 * Class IEEventSimulator
 *
 * This class is designed to provide support to the FUnit testing. It will enable a
 * number of interactive IE events to be simulated in FUnit tests.
 *
*/

function IEEventSimulator()
{
}

/**
 * Method simulates mouse click on adaptor. Note, however, method will work
 * correctly for the simpler adaptors only. For example, clicks on grid rows
 * will have to be simulated in a more complex manner.
 *
 * @param adaptorId The id of the adaptor that is to receive the simulated click
 *
*/
IEEventSimulator.simulateClickOnAdaptor = function( adaptorId )
{
    var adaptor = Services.getAdaptorById( adaptorId );
    
    if(null != adaptor)
    {
        // First determine focusable element
        var element = null;
        
        if(adaptor.getFocusElement)
        {
            element = adaptor.getFocusElement();
        }
        else
        {
            element = adaptor.getElement();
        }
        
        if(null != element)
        {
            // First fire mouse down event
            IEEventSimulator.fireMouseDownEvent(element);
            
            // Second fire mouse click event
            IEEventSimulator.fireMouseClickEvent(element);
        }
    }
    
}

/**
 * Method simulates mouse click on Html label for adaptor.
 *
 * @param adaptorId The id for the adaptor whose label is to receive a click event
 *
*/
IEEventSimulator.simulateClickOnAdaptorLabel = function( adaptorId )
{
    // Retrieve list of labels on document
    var labels = document.getElementsByTagName( "LABEL" );
    
    // Search for reference to label associated with adaptor
    var adaptorLabel = null;
    
    for(var i = 0, l = labels.length; i < l; i++)
    {
        var label = labels[i];
        
        if(label.htmlFor == adaptorId ||
           label.htmlFor == adaptorId + TabbingManager.NON_NATIVE_FOCUS_ID)
        {
            adaptorLabel = label;
            break;
        }
    }
    
    if(null != adaptorLabel)
    {
        IEEventSimulator.fireMouseDownEvent( adaptorLabel );
        
        IEEventSimulator.fireMouseClickEvent( adaptorLabel );
    }
}

/**
 * Method simulates mouse click on screen background. In practice the event
 * may bubble up from a number of non-adaptor components, but it will always
 * pass through body element on passage to event handler on document.
 *
*/
IEEventSimulator.simulateClickOnBackground = function()
{
    // Create reference to body element
    var body = document.body;
    
    if(null != body)
    {
        IEEventSimulator.fireMouseDownEvent( body );
    }
}

/**
 * Method simulates mouse down event on HTML element.
 *
 * @param element The HTML element to receive the mouse down event.
 *
*/
IEEventSimulator.fireMouseDownEvent = function(element)
{
    if(element.attachEvent)
    {
        // Method will work with IE only.
        var mouseDownEvent = document.createEventObject();
        
        element.fireEvent( "onmousedown", mouseDownEvent );
    }
}

/**
 * Method simulates mouse click event on HTML element.
 *
 * @param element The HTML element to receive the mouse click event.
 *
*/
IEEventSimulator.fireMouseClickEvent = function(element)
{
    if(element.attachEvent)
    {
        var mouseClickEvent = document.createEventObject();
        
        element.fireEvent( "onclick", mouseClickEvent );
    }
}