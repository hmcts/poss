/**
 * Base class for Popup rendering implementations
 */
function PopupLayer()
{
}


/**
 * Number of popups currently displayed.
 *
 * @private
 * @type Integer
 */
PopupLayer.m_popupCount = 0;


/**
 * Array of all the select elements in the document.
 *
 * @type Array[Elements]
 * @private
 */
PopupLayer.m_allSelects = document.getElementsByTagName("SELECT");


/**
 * The element which contains the popup
 *
 * @type HTMLElement
 * @private
 */
PopupLayer.prototype.m_popup = null;


/**
 * Array containing visibility states of <select> elements
 * on IE. This is needed because <select> elements show through
 * other elements on IE.
 *
 * @type Array[Object]
 * @private
 */
PopupLayer.prototype.m_hiddenSelects = new Array();


/**
 * Factory method to create a PopupLayer
 *
 * @param element the element which represents the popup
 * @return a new PopupLayer
 * @type PopupLayer
 */
PopupLayer.create = function(element)
{
	var pl = new PopupLayer();
	pl.m_popup = element;
	
	return pl;
}


/**
 * Dispose of the popup layer
 */
PopupLayer.prototype._dispose = function()
{
	if(this.m_hiddenSelects != null)
	{
		for(var i = this.m_hiddenSelects.length - 1; i >= 0; i--)
		{
			delete this.m_hiddenSelects[i];
		}
		this.m_hiddenSelects = null;
	}
}


/**
 * Show the popup.
 */
PopupLayer.prototype.show = function(hideSelects)
{
	if(hideSelects == null) hideSelects = true;
	// If this is IE we need to hide <select> elements because they
	// show through elements which are layered on top of them
	if(HTMLView.isIE && hideSelects == true)
	{
		this._hideSelectElements();
	}
	
	// Make the popup properly visible.
	this.m_popup.style.visibility = "visible";

	PopupLayer.m_popupCount++;

	// Fix for defect. Popups must appear over menu bar which has
	// a zIndex of 2 such that drop down menus appear above
	// tabbed dialog pages. Therefore, the minimum zIndex
	// for a popup should be 3.
	this.m_popup.style.zIndex = PopupLayer.m_popupCount + 2;
}


PopupLayer.prototype._hideSelectElements = function()
{
	// Array of all the select elements in the document
	var selects = PopupLayer.m_allSelects;

	// Array to contain selects hidden by the element e
	var hiddenSelects = new Array();
	
	// The popup element
	var e = this.m_popup;
	
	for(var i = selects.length - 1; i >= 0; i--)
	{
		var s = selects[i];

		// Create an object to record the current visibility and disabled
		// state of the select
    	var selectState = new Object();
    	selectState.element = s;
    	selectState.prevState = s.style.visibility;
        selectState.prevDisabled = s.disabled;
    	
    	// Keep the current state of this select
    	hiddenSelects.push(selectState);

		// If the select is a child of the popup
        if(e.contains(s))
        {
			// If select was previously hidden
			if(s.style.visibility == "hidden")
			{
				// Make it visible now.
				s.style.visibility = "visible";
			}
			else
			{
				// Leave visibility as is...
			}
		}
		else
		{
	        // Hide select controls which are overlapped by the popup.
        	if(isContained(s, e))
			{
				// Disable the hidden select otherwise it can cause the adaptor
				// that is hiding it to lose the focus when tabbing
                s.disabled = true;
                
				// Hide the hidden select
	        	s.style.visibility = "hidden";
			}
		}
		
		selectState = null;
	}

	// Hang on to the select states
	this.m_hiddenSelects[PopupLayer.m_popupCount] = hiddenSelects;
}


/**
 * Hide the popup.
 */
PopupLayer.prototype.hide = function(showSelects)
{  
	if(showSelects == null) showSelects = true;

	this.m_popup.style.visibility = "hidden";

	// Defect 769. When subforms with tables are hidden with
	// destroyOnClose set to "false" the tables still catch
	// onClick events even though they are invisible. Therefore,
	// place popup beneath main form items.
	this.m_popup.style.zIndex = -1;

	PopupLayer.m_popupCount--;

	// If this is IE we need to restore the visibility state of
	// <select> elements hidden during show.
	if(HTMLView.isIE && showSelects == true)
	{
		this._showSelectElements();
	}	
}


PopupLayer.prototype._showSelectElements = function()
{
	var restoreSelects = this.m_hiddenSelects[PopupLayer.m_popupCount];

	for(var i = restoreSelects.length - 1; i >= 0; i--)
	{
		var selectState = restoreSelects[i];
		selectState.element.style.visibility = selectState.prevState;
		selectState.element.disabled = selectState.prevDisabled;

		// Dispose of the hidden selects for this popup layer
		delete restoreSelects[i];
	}
}
