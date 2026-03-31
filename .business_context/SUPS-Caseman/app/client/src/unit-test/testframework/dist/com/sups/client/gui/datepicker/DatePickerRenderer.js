//==================================================================
//
// DatePickerRenderer.js
//
// Class for rendering a DatePicker
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @constructor
 * @private
 */
function DatePickerRenderer()
{
}

/**
 * DatePickerRenderer is a sub class of Renderer
 */
DatePickerRenderer.prototype = new Renderer();
DatePickerRenderer.prototype.constructor = DatePickerRenderer;


DatePickerRenderer.m_logger = new Category("DatePickerRenderer");

/**
 * The month currently displayed in the drop down
 *
 * @private
 */
DatePickerRenderer.prototype.m_currentMonth = null;


/**
 * The year currently displayed in the drop down
 *
 * @private
 */
DatePickerRenderer.prototype.m_currentYear = null;


/**
 * Day of the week on which each row starts
 *
 * @private
 */
DatePickerRenderer.prototype.m_startDay = 1;


/**
 * The currently selected date
 *
 * @private
 */
DatePickerRenderer.prototype.m_selectedDate = null;


/**
 * The position of selected date in the date cell array.
 * May be null if the selected date is not one of the
 * dates displayed in the currently displayed month
 */
DatePickerRenderer.prototype.m_selectedDatePosition = 0;

/*
 * The position of today's date in the date cell array.
 * May be null if the today's date is not one of the
 * dates displayed in the currently displayed month
 */
DatePickerRenderer.prototype.m_todayDatePosition = 0;


/**
 * The dropdown field which implements this DatePicker.
 */
DatePickerRenderer.prototype.m_dropDownField = null;



/**
 * The actual text value of date - may not be a valid date
 */
DatePickerRenderer.prototype.m_value = null;

/*
 * CSS class name for the main div for the date picker
 */
DatePickerRenderer.CSS_CLASS_NAME = "datepicker";

DatePickerRenderer.LOSE_FOCUS_MODE = "loseFocusMode";
DatePickerRenderer.CLICK_CELL_MODE = "clickCellMode";

/**
 * Create a date picker at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the date picker being created
 */
DatePickerRenderer.createInline = function(id)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the date picker being created
		false		// The date picker has an internal input element which can accept focus, so the div should not accept focus
	);

	return DatePickerRenderer._create(e);
}

/**
 * Create a date picker in the document relative to the supplied element
 *
 * @param refElement the element relative to which the date picker should be rendered
 * @param relativePos the relative position of the date picker to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the date picker being created
 */
DatePickerRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the date picker being created
		false			// The date picker has an internal input element which can accept focus, so the div should not accept focus
	);
	
	return DatePickerRenderer._create(e);
}

/**
 * Create a date picker as a child of another element
 *
 * @param p the parent element to add the date picker to
 * @param id the id to give the newly created date picker component
 */
DatePickerRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the date picker's outer div to it's parent element
	p.appendChild(e);	
	
	return DatePickerRenderer._create(e);
}

DatePickerRenderer._create = function(e)
{
	e.className = DatePickerRenderer.CSS_CLASS_NAME;

	var dp = new DatePickerRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	dp._initRenderer(e);	
	
	// Initialise the DropDownField part of the renderer
	dp.m_dropDownField = DropDownFieldRenderer.createAsChild(e);
		
	// Create new callback list for value change listeners
	//ac.m_callbackList = new CallbackList();
	
	var dropdown = dp.m_dropDownField._getDropDownElement();
	
	// Create container to hold both the tables
	var container = document.createElement("div");
	container.className = "calendar_container";
	dropdown.appendChild(container);

	// Prevent selection of content
	preventSelection(dropdown);
	
	// Create the table that contains the navigation elements
	var navTable = document.createElement("table");
	navTable.className = "navtable";
	container.appendChild(navTable);
	
	var navTableBody = document.createElement("tbody");
	navTable.appendChild(navTableBody);
	
	var navRow = document.createElement("tr");
	navTableBody.appendChild(navRow);

	// Cell to select previous month	
	var prevMonth = document.createElement("td");
	prevMonth.className = "calendar_prevmonth";
	//prevMonth.onclick = function() { dp._handlePrevMonthClick(); return true; };
	dp.m_prevMonthClickHandler = SUPSEvent.addEventHandler(prevMonth, "click", function() { dp._handlePrevMonthClick(); return true; });
	navRow.appendChild(prevMonth);
	
	// Cell which contains Month and Year
	dp.m_currentMonthCell = document.createElement("td");
	dp.m_currentMonthCell.className = "calendar_controls";
	dp.m_currentMonthCell.innerHTML = "&nbsp;";
	navRow.appendChild(dp.m_currentMonthCell);

	// Controls for month and year in the drop down have been
	// commented out, as including then will involve the 
	// date picker changing size.
/*	
	// Create the month dropdown with options
	var monthSelect = document.createElement("select");
	dp.m_currentMonthCell.appendChild(monthSelect);
	for(var i = 0, l = FWDateUtil.months.length; i < l; i++)
	{
		var monthOption = document.createElement("option");
		monthOption.innerHTML = FWDateUtil.months[i];
		monthSelect.appendChild(monthOption);
	}
	
	// Create the year text field - limited to 4 characters
	var yearField = document.createElement("input");
	yearField.setAttribute("maxLength", "4");
	dp.m_currentMonthCell.appendChild(yearField);
*/
	
	// Cell to select next month
	var nextMonth = document.createElement("td");
	nextMonth.className = "calendar_nextmonth";
	//nextMonth.onclick = function() { dp._handleNextMonthClick(); return true; };
	dp.m_nextMonthClickHandler = SUPSEvent.addEventHandler(nextMonth, "click", function() { dp._handleNextMonthClick(); return true; });
	navRow.appendChild(nextMonth);


	// Create the table which contains the days for the
	// currently selected month.	
	var calTable = document.createElement("table");
	calTable.className = "caltable";
	container.appendChild(calTable);
	
	var calTableBody = document.createElement("tbody");
	calTable.appendChild(calTableBody);
	
	var dayRow = document.createElement("tr");
	calTableBody.appendChild(dayRow);
	
	// Render the days
	for(var i = 0, l = FWDateUtil.shortDays.length; i < l ; i++)
	{
		var dayCell = document.createElement("th");
		dayCell.innerHTML = FWDateUtil.shortDays[(i + dp.m_startDay)%l];
		dayRow.appendChild(dayCell);
	}
	
	var noOfDayRows = 6;
	var noOfCalendarDays = noOfDayRows * FWDateUtil.NO_OF_WEEKDAYS;
	
	// Create the day days
	dp.m_dayCells = new Array(noOfCalendarDays);
	
	var position = 0;
	
	// Click event handler function
	dp.m_cellClickEventHandler = SUPSEvent.addEventHandler(calTable, "click", function(BALLS) { dp._handleCellClick(BALLS); return true; });
	
	for(var i = 0; i < noOfDayRows ; i++)
	{
		// Create the day row.
		var dayRow = document.createElement("tr");
		calTableBody.appendChild(dayRow);
		
		for(var j = 0; j < FWDateUtil.NO_OF_WEEKDAYS; j++)
		{
			var dayCell = document.createElement("td");
			dayCell.innerHTML = "&nbsp;";
			
			// Record position of cell in Cell array on the HTML Element
			dayCell.__position = position;
			
			// Set the click handler for the cell
			//dayCell.onclick = handleCellClick;

			dayRow.appendChild(dayCell);
			
			// Keep array of cells
			dp.m_dayCells[position++] = dayCell;
		}
	}
	
	// Show current date
	dp._showDateInDropDown(null);
	
	// Handle key events on the input field
	//dp.m_dropDownField._getInputFieldElement().onkeyup = function() { dp._handleInputFieldKeyUp(); return true; };
	dp.m_keyEventUpHandlerKey = SUPSEvent.addEventHandler(dp.m_dropDownField._getInputFieldElement(), "keyup", function() { dp._handleInputFieldKeyUp(); return true; }, false);
	
	return dp;
}


DatePickerRenderer.prototype.dispose = function()
{
	// Remove selection prevention event handler from drop down
	unPreventSelection(this.m_dropDownField._getDropDownElement());

	for(var i = 0, l = this.m_dayCells.length; i < l; i++)
	{
		delete this.m_dayCells[i];
	}
	delete this.m_dayCells;

	SUPSEvent.removeEventHandlerKey(this.m_prevMonthClickHandler);
	this.m_prevMonthClickHandler = null;
	
	SUPSEvent.removeEventHandlerKey(this.m_nextMonthClickHandler);
	this.m_nextMonthClickHandler = null;
	
	SUPSEvent.removeEventHandlerKey(this.m_cellClickEventHandler);
	this.m_cellClickEventHandler = null;
	
	SUPSEvent.removeEventHandlerKey(this.m_keyEventUpHandlerKey);
	this.m_keyEventUpHandlerKey = null;
	
	this.m_dropDownField.dispose();

	this.m_guiAdaptor = null;
}


DatePickerRenderer.prototype._setCellClass = function(cellPosition)
{
	// Make the day correspond to the Array of Days in FWDateUtil.
	var mappedDay = (cellPosition + this.m_startDay)%7;	

	// Set CSS class of date cell approriately
	if(cellPosition >= this.m_dayCells.length)
	{
		if (DatePickerRenderer.m_logger.isWarn()) DatePickerRenderer.m_logger.warn("DatePickerRenderer._setCellClass() warning, cellPosition >= this.m_dayCells.length");
	}
	else
	{
		this.m_dayCells[cellPosition].className = 
			(this.m_selectedDatePosition == cellPosition ? "selected " : "") +	// If this cell is the selected date set class appropriately
			(this.m_todayDatePosition  == cellPosition ? "today " : "") +		// If this cell is the today set the class appropriately
			((0 == mappedDay || 6 == mappedDay) ? "weekend" : "");				// Sunday (0) and Saturday(6) are considered weekend days
	}
}


DatePickerRenderer.prototype._handleInputFieldKeyUp = function()
{
	var value = this.m_dropDownField._getInputFieldElement().value;
	var date = FWDateUtil.parseDate(value);

	if(!FWDateUtil.compareDates(date, this.m_selectedDate))
	{
		this._selectDate(date);
	}
}



DatePickerRenderer.prototype._selectDate = function(date)
{
	// Set the selected date
	this.m_selectedDate = date;

	var refreshed = this._showDateInDropDown(date);

	// If show did not perform a refresh, then just refresh
	// the selected date now.		
	if(!refreshed)
	{
		// Unselect the currently selected date
		this._renderCurrentlySelectedDateUnselected();

		// Update the cell which is currenly selected
		this._updateSelectedDatePosition();

		// Render the newly selected cell as selected
		if(this.m_selectedDatePosition != null)
		{
			this._setCellClass(this.m_selectedDatePosition);
		}
	}
}


DatePickerRenderer.prototype._showDateInField = function()
{
	var date = this.m_selectedDate;
	
	if(null != date)
	{
		// Convert date to string, padding single digit dates
		var day = date.getDate();
		day = (day < 10) ? "0" + day : day;

		// Show the date in the input field
		this.m_dropDownField._getInputFieldElement().value = 
			day + "-" +
			FWDateUtil.shortMonths[date.getMonth()] + "-" +
			date.getFullYear();
	}
	else
	{
		// Set the value of the input field to the string value - make sure
		// that null value doesn't get displayed as 'null' on IE
		this.m_dropDownField._getInputFieldElement().value = (null == this.m_value ? '' : this.m_value) ;
	}
}

/**
 * Method handles a mouse click whilst cursor over data picker
 * date selection table.
 *
 * @param evt Details of mouse click event
 *
*/
DatePickerRenderer.prototype._handleCellClick = function(evt)
{
	// Get the clicked cell, depending on which browser we're using
	evt = (null == evt) ? window.event : evt;
	var clickCell = SUPSEvent.getTargetElement(evt);
		
	// Get the position of the clicked cell in the array of cells.
	var position = clickCell.__position;
	if(null != position)
	{
		if(this.m_selectedDatePosition != position)
		{
			this._renderCurrentlySelectedDateUnselected();
	
			// Calculate the clicked date
			var clickedDate = new Date(this.m_firstDate);				// Get the first date displayed in the drop down
			clickedDate.setDate(clickedDate.getDate() + position);		// Add the position to the date to add the appropriate number of days
	
			// Unselect the currently selected date
			this._renderCurrentlySelectedDateUnselected();
	
			// Set the selected date
			this.m_selectedDate = clickedDate;
	
			// Render the newly selected cell as selected	
			this.m_selectedDatePosition = position;
			this._setCellClass(position);
	
			// Show the date in the input field
			this._showDateInField();
		}
		
		// Hide the dropdown
		this.m_dropDownField.hideDropDown();
		
		// Defect 1051. Move this block of code inside section of code
		// executed following click on date cell only. We do not want
		// to update adaptor for a click on a date cell border.
		if(this.m_guiAdaptor.getUpdateMode() == DatePickerRenderer.CLICK_CELL_MODE)
	    {
	        // Update adaptor value.
		    this.m_guiAdaptor._handleValueChange();
	    }
	}

}


DatePickerRenderer.prototype._renderCurrentlySelectedDateUnselected = function()
{
	// Render the previously selected cell as not selected
	var prevSelectedCell = this.m_selectedDatePosition;
	if(null != prevSelectedCell)
	{
		this.m_selectedDatePosition = null;
		this._setCellClass(prevSelectedCell);
	}
}


DatePickerRenderer.prototype._handleNextMonthClick = function()
{
	this._changeMonth(1);
}


DatePickerRenderer.prototype._handlePrevMonthClick = function()
{
	this._changeMonth(-1);
}


DatePickerRenderer.prototype._changeMonth = function(delta)
{
	var month = new Date(this.m_currentYear, this.m_currentMonth, 1);
	month.setMonth(month.getMonth() + delta);
	
	this._showDateInDropDown(month);
}


DatePickerRenderer.prototype._showDateInDropDown = function(d)
{
	// Has dropdown been refreshed?
	var refreshed = false;

	var today = new Date();  // Get current time
	
	// Only want date components...
	today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	// If null date, the default to showing today's date
	if(null == d) d = new Date(today);

	var month = d.getMonth();
	var year = d.getFullYear();

	// Check to see if the date has changed
	if(this.m_currentMonth != month || this.m_currentYear != year)
	{
		this.m_currentMonth = month;
		this.m_currentYear = year;

		// Calculate the first date displayed on the popup calendar
		this.m_firstDate = new Date(d);
		this.m_firstDate.setDate(1);
		this.m_firstDate.setDate(1 - (7 + this.m_firstDate.getDay() - this.m_startDay) % 7);

		// Get absolute time of the day after the last date displayed on the calendar
		this.m_lastDate = new Date(this.m_firstDate);
		this.m_lastDate.setDate(this.m_lastDate.getDate() + this.m_dayCells.length);
		
		// Get absolute time of the first date	
		firstDateTime = this.m_firstDate.getTime();

		// Calculate absolute time of the start of the day after the last date displayed on the calendar
		var lastDateTime = this.m_lastDate.getTime() + FWDateUtil.MILLISECONDS_PER_DAY;
	
		// Get absolute time of today's date
		var todayTime = today.getTime();
	
		// Set the position of today's date in the date cell array
		this.m_todayDatePosition = 
			(todayTime >= firstDateTime && todayTime < lastDateTime)	// Is today one of the displayed dates on the drop down
			? FWDateUtil.getDaysDifference(today, this.m_firstDate)		// Yes - get it's position in the cell array
			: null;														// No - set today's date position to null

		// Update the selected date position
		this._updateSelectedDatePosition();

		// Show the current month on the drop down
		this.m_currentMonthCell.innerHTML = FWDateUtil.months[month] + " " + year;
	
		// Start at the first date
		var currentDay = new Date(this.m_firstDate);
		
		for(var i = 0, l = this.m_dayCells.length; i < l; i++)
		{
			var cell = this.m_dayCells[i];
			var date = currentDay.getDate();
			cell.innerHTML = date;

			// Set the style of the cell
			this._setCellClass(i);

			cell.style.color = (currentDay.getMonth() == month) ? "black" : "gray";

			currentDay.setDate(date + 1);
		}
		
		refreshed = true;
	}
	
	return refreshed;
}


DatePickerRenderer.prototype._updateSelectedDatePosition = function()
{
	// Calculate the position of selected date in the date cell array
	if(null == this.m_selectedDate)
	{
		// No selected date, so set position to null
		this.m_selectedDatePosition = null;
	}
	else
	{
		// Get absolute time of the selected date
		var selTime = this.m_selectedDate.getTime();
	
		// Get absolute time of the first date	
		firstDateTime = this.m_firstDate.getTime();

		// Calculate absolute time of the start of the day after the last date displayed on the calendar
		var lastDateTime = this.m_lastDate.getTime() + FWDateUtil.MILLISECONDS_PER_DAY;

		if(DatePickerRenderer.m_logger.isTrace()) DatePickerRenderer.m_logger.trace("DatePickerRenderer._updateSelectedDatePosition() this.m_firstDate=" + this.m_firstDate.toString() + ", this.m_selectedDate=" + this.m_selectedDate.toString() + ", days difference=" + FWDateUtil.getDaysDifference(this.m_selectedDate, this.m_firstDate));

		// Set the position of the selected date in the date cell array
		this.m_selectedDatePosition = 
			(selTime >= firstDateTime && selTime < lastDateTime)				// Is selected date one of the displayed dates on the drop down
			? FWDateUtil.getDaysDifference(this.m_selectedDate, this.m_firstDate)	// Yes - get it's position in the cell array
			: null;																// No - set selected date's position to null
	}
}

DatePickerRenderer.prototype._calculateFirstDisplayedDate = function(d)
{
	// Calculate the first date to show in the calendar if
	// the month and year of the supplied date were used.
	var firstDay = new Date(d);
	firstDay.setDate(1);
	firstDay.setDate(1 - (7 + firstDay.getDay() - this.m_startDay) % 7);
	
	return firstDay;
}


/**
 * Get the date selected by the date picker
 *
 * @return the date selected by the date picker - may be null if no valid date picked
 * @type Date
 */
DatePickerRenderer.prototype.getSelectedDate = function()
{
	return this.m_selectedDate;
}


DatePickerRenderer.prototype.getValue = function()
{
	return this.m_dropDownField._getInputFieldElement().value;
}


/**
 * Set the date selected by the date picker
 *
 * @param the Date object which represents the date to be selected
 */
DatePickerRenderer.prototype.setValue = function(value)
{
	this.m_value = value;
	
	var date = FWDateUtil.parseXSDDate(value);

	if(!FWDateUtil.compareDates(date, this.m_selectedDate))
	{
		// Select the date 
		this._selectDate(date);
	}
	// Show the date in the field
	this._showDateInField();
}



DatePickerRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive)
{
	this.m_dropDownField.render(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, null, isServerValidationActive);
}
