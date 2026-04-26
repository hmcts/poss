//==================================================================
//
// TextAreaElementGUIAdaptor.js
//
// Class for adapting a text area style element for use in the
// framework
//
//==================================================================

/**
 * Base class for adapting html elements for use in the
 * framework.
 *
 * @constructor
 * @private
 */
function TextAreaElementGUIAdaptor()
{
}
 
TextAreaElementGUIAdaptor.m_logger = new Category( "TextAreaElementGUIAdaptor" );
 
/**
 * TextAreaElementGUIAdaptor is a sub class of TextInputElementGUIAdaptor
 *
*/
TextAreaElementGUIAdaptor.prototype = new TextInputElementGUIAdaptor();
TextAreaElementGUIAdaptor.prototype.constructor = TextAreaElementGUIAdaptor;

/**
 * Define instance members
 *
 * Reference to key press event handler used for both IE and Mozilla
 *
*/
TextAreaElementGUIAdaptor.prototype.m_keyPressEventKey = null;

/**
 * Create a new TextAreaElementGUIAdaptor
 *
 * @param e the text area element to manage
 * @return the new TextAreaElementGUIAdaptor
 * @type TextAreaElementGUIAdaptor
 */
TextAreaElementGUIAdaptor.create = function(e)
{
    var a = new TextAreaElementGUIAdaptor();
    
    // Use initialization method inherited from text input adaptor
    a._initTextInputElementGUIAdaptor(e);
    
    return a;
}

/**
 * Clean up memory used by adaptor
 *
*/
TextAreaElementGUIAdaptor.prototype._dispose = function()
{

    if(null != this.maxLength)
    {
        // Remove event handlers created to maintain maximum length
        SUPSEvent.removeEventHandlerKey(this.m_keyPressEventKey);
        this.m_keyPressEventKey = null;
        
        if(HTMLView.isIE)
        {
            // Remove IE specific event handlers for paste and drop
            SUPSEvent.removeEventHandlerKey(this.m_beforePasteEventKey);
            this.m_beforePasteEventKey = null;
            
            SUPSEvent.removeEventHandlerKey(this.m_pasteEventKey);
            this.m_pasteEventKey = null;        
        }
    }
    
    // Invoke dispose on parent adaptor
    TextInputElementGUIAdaptor.prototype._dispose.call(this);
    
}

/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
TextAreaElementGUIAdaptor.prototype._configure = function(cs)
{
    // Invoke configure method on parent adaptor
    TextInputElementGUIAdaptor.prototype._configure.call(this, cs);
    
    if(null != this.maxLength)
    {
    
        // Add event handlers required to maintain maximum length
        var thisObj = this;
        
        this.m_keyPressEventKey = SUPSEvent.addEventHandler( this.m_element,
                                                             "keypress",
                                                             function(evt){return thisObj._handleKeyPress(evt);} );
                                                             
        if(HTMLView.isIE)
        {
            // Add IE specific event handlers to cope with paste and drop
            this.m_beforePasteEventKey = SUPSEvent.addEventHandler( this.m_element,
                                                                    "beforepaste",
                                                                    function(){return thisObj._handleBeforePaste();} );
                                                                    
            this.m_pasteEventKey = SUPSEvent.addEventHandler( this.m_element,
                                                              "paste",
                                                              function(){return thisObj._handlePaste();} );
        }
        
    }
    
}

/**
 * Method handles key press events. Key press events are allowed to flow freely
 * until the length of the contents of the text area is equal to the maximum
 * allowed length (if set). Subsequently, only function key presses will be
 * passed on for processing.
 *
 * @param evt When using Mozilla the associated event
 *
*/
TextAreaElementGUIAdaptor.prototype._handleKeyPress = function(evt)
{
    evt = (evt) ? evt : ((event) ? event : null );
    
    if(null != evt)
    {
    	// Create text range object corresponding to current document selection in text area
   	 	var currentSelection = document.selection.createRange();

        // Retrieve current length of text in text area, subtracting the length of
        // the selected text because this will be replaced by the key press
        var currentLength = this.m_element.value.length - currentSelection.text.length;	

        var maxLength = this.maxLength;
        
        if(currentLength >= maxLength)
        {
            // Text length maintainance is browser specific
            if(HTMLView.isIE)
            {
                // In IE function keys and keys qualified with
                // ctrl and alt are not passed to the key press event.
                // Therefore, key press indicates attempted addition
                // of a new character.
                
                // Stop event
                evt.returnValue = false;
            }
            else
            {
                // In Mozilla all key presses are routed to the key press event.
                // However, the value of charCode can be used to distinguish
                // between function and character keys.
                
                if(evt.charCode == 0)
                {
                    // Allow all function keys to continue except "return"
                    if(evt.keyCode == Key.Return)
                    {
                        evt.preventDefault();
                    }
                }
                else
                {
                    // Stop all characters unless they are qualified
                    // with either "ctrl" or "alt"
                    var qualifier = evt.ctrlKey || evt.altKey;
                    
                    if(!qualifier)
                    {
                        evt.preventDefault();
                    }
                }
                    
            }
            
        } // if(currentLength >= maxLength)
        
    } // if(null != evt)
    
}

/**
 * IE specific event handler method cancels "beforePaste" event
 * allowing custom "paste" event handler to replace default
 * event action.
 *
*/
TextAreaElementGUIAdaptor.prototype._handleBeforePaste = function()
{
    var event = window.event;
    
    if(null != event)
    {
        event.returnValue = false;
    }
    
}

/**
 * IE specific event handler method replaces default "onpaste"
 * event processing.
 *
*/
TextAreaElementGUIAdaptor.prototype._handlePaste = function()
{
    var event = window.event;
    
    if(null != event)
    {
        // Prevent default event processing
        event.returnValue = false;
        
        // Retrieve text to be pasted in from clipboard
        var clipboardText = window.clipboardData.getData( "Text" );
        
        // Insert text into text area
        this._insertText( clipboardText );
    }
    
}

/**
 * IE specific method inserts text from clipboard or drag data transfer object
 * into text area ensuring that the maximum length set for the text area is
 * not exceeded.
 *
 * @param insertionText String containing text to be inserted into text area
 *
*/
TextAreaElementGUIAdaptor.prototype._insertText = function(insertionText)
{
    var maxLength = this.maxLength;
    
    // Determine length of current text area contents
    var currentLength = this.m_element.value.length;
    
    // Create text range object corresponding to current document selection in text area
    var currentSelection = document.selection.createRange();
    
    // Determine length of currently selected text in text area
    var currentSelectionLength = currentSelection.text.length;
    
    // Determine length of text to be inserted into text area
    var insertionTextLength = insertionText.length;
    
    // Calculate change in text area owing to text insertion
    var lengthChange = insertionTextLength - currentSelectionLength;
    
    if(lengthChange > 0)
    {
        // Check if new length exceeds maximum length
        if(currentLength + lengthChange > maxLength)
        {
            var modifiedInsertionTextLength = insertionTextLength - (currentLength + lengthChange - maxLength);
            
            if(modifiedInsertionTextLength > 0)
            {
                currentSelection.text = insertionText.substr(0, modifiedInsertionTextLength);
            }
            
        }
        else
        {
            currentSelection.text = insertionText;
        }
        
    }
    else
    {
        currentSelection.text = insertionText;
    }
    
}
