/**
*	WP_DatePickerGUIAdaptor
* 	subclasses DatePickerGUIAdaptor
*	Addresses a defect in superclass to enable framework evaluation of enalbement of subsequent fields and
* 	therefore tabbing order based on enablement/disablement. This class allows such evaluation to occur on either
*	selecting a date (clicking a date cell) or keyup in date field, rather than waiting for focus to be lost as is
*	the case in the superclass. This fix should be considered for refactoring into the framework superclass, rather than 
* 	maintianing this subclass.
*
*	@author: kevin buckthorpe
*	@date: 22 Feb 2006
 */

function WP_DatePickerRenderer(){}

WP_DatePickerRenderer.prototype = new DatePickerRenderer();
WP_DatePickerRenderer.prototype.constructor = WP_DatePickerRenderer;

/**
 * @param id
 * @author nz5zpz
 * @return WP_DatePickerRenderer._create(e)  
 */
WP_DatePickerRenderer.createInline = function(id) 
{
	//alert('WP_DatePickerRenderer.createInline');
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the date picker being created
		false		// The date picker has an internal input element which can accept focus, so the div should not accept focus
	);

	return WP_DatePickerRenderer._create(e);
}

/**
* @TODO refactor this mess
 * @param e
 * @author nz5zpz
 * @return dp  
 */
WP_DatePickerRenderer._create = function(e)
{	//alert('WP_DatePickerRenderer._create');
	var dp = new WP_DatePickerRenderer();
	dp.initialise(e, dp);
	return dp;
}

/**
 * @param e
 * @param dp
 * @author nz5zpz
 * @return boolean, dp  
 */
WP_DatePickerRenderer.prototype.initialise = function(e, dp)
{	//alert('WP_DatePickerRenderer.prototype.initialise');

	e.className = DatePickerRenderer.CSS_CLASS_NAME;	

	// Initialise sets main element and the reference to the renderer in the dom
	dp._initRenderer(e);	
	
	// Initialise the DropDownField part of the renderer
	dp.m_dropDownField = WP_DropDownFieldRenderer.createAsChild(e);
	
		
	// Create new callback list for value change listeners
	
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

	dp.m_prevMonthClickHandler = SUPSEvent.addEventHandler(prevMonth, "click", function() { dp._handlePrevMonthClick(); return true; });
	navRow.appendChild(prevMonth);
	
	// Cell which contains Month and Year
	dp.m_currentMonthCell = document.createElement("td");
	dp.m_currentMonthCell.className = "calendar_controls";
	dp.m_currentMonthCell.innerHTML = "&nbsp;";
	navRow.appendChild(dp.m_currentMonthCell);
	
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
	dp.m_cellClickEventHandler = SUPSEvent.addEventHandler(calTable, "click", function(evt) { dp.WP_handleCellClick(evt); return true; });
	
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

			dayRow.appendChild(dayCell);
			
			// Keep array of cells
			dp.m_dayCells[position++] = dayCell;
		}
	}
	
	// Show current date
	dp._showDateInDropDown(null);
	
	// Handle key events on the input field
	// Just call super class implementation
	dp.m_keyEventUpHandlerKey = SUPSEvent.addEventHandler(dp.m_dropDownField._getInputFieldElement(), "keyup", function() { dp._handleInputFieldKeyUp(); return true; }, false);

	// Also handle Keydown event so that we can now capture Tab key.
	dp.m_keyEventUpHandlerKey = SUPSEvent.addEventHandler(dp.m_dropDownField._getInputFieldElement(), "keydown", function() { dp._wp_handleInputFieldKeyDown(); return true; }, false);
	
	return dp;
}


/**
 * @param evt
 * @author nz5zpz
 * 
 */
WP_DatePickerRenderer.prototype.WP_handleCellClick = function(evt)
{	
	this._handleCellClick(evt);
	this.m_guiAdaptor._handleValueChange();	
}

/* 
 * Commented as we are now calling SuperClass handle function
 *   
WP_DatePickerRenderer.prototype._wp_handleInputFieldKeyUp = function()
{  
	this._handleInputFieldKeyUp();
	this.m_guiAdaptor._handleValueChange();
}

 */

/**
 * @param e
 * @author nz5zpz
 * 
 */
WP_DatePickerRenderer.prototype._wp_handleInputFieldKeyDown = function(e)
{
	if(null == e) e = window.event;
	
	switch(e.keyCode)
	{
		case Key.Tab.m_keyCode:
		{
			this.m_guiAdaptor._handleValueChange();
		}
	}
}






