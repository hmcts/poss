/**
 * Class ProcessPerformanceMonitor
 *
 * This class is designed to monitor a series of business processes
 * executing as part of a Javascript application. For the purpose
 * of this class a business process may be defined as a section of
 * Javascript code, which may or may not include invocations of
 * other methods, enclosed within invocations of the methods
 * "startProcess( processName )" and stopProcess( processName )" of
 * this class. The arguments "processName" must refer to the same unique
 * process name to fully define the business process.
 *
 * During the analysis of a Javascript application a business process may be executed
 * just once or numerous times. Further, business processes may be nested within other
 * business processes.
 *
*/

/**
 * Define class constants
 *
*/
 
 ProcessPerformanceMonitor.NOT_AVAILABLE = "N/A";
 ProcessPerformanceMonitor.COMMA = ",";

/**
 * Constructor function creates an instance of the class
 *
 * @constructor
 * @public
 *
*/

function ProcessPerformanceMonitor()
{
    this.m_processes = new Array();
    this.m_date = new Date();
}

// Define instance variables

/**
 * Array used to store array of ProcessTimer instances for each business process
 *
*/

ProcessPerformanceMonitor.prototype.m_processes = null;

/**
 * Array used to store sorted array of ProcessTimer instances
 * for display
 *
*/

ProcessPerformanceMonitor.prototype.m_sortedArray = null;

/**
 * Date storing start of current analysis. Used for display.
 *
*/

ProcessPerformanceMonitor.prototype.m_date = null;

/**
 * Instance member records whether or not the performance
 * monitor window header division has been displayed
 *
*/

ProcessPerformanceMonitor.prototype.m_headerDisplayed = null;

/**
 * Reference to browser window used to display performance
 * monitor results.
 *
*/

ProcessPerformanceMonitor.prototype.m_window = null;

/**
 * Instance member records whether or not the individual business process
 * execution times should be displayed. This output can be useful
 * when tracing execution flow, but it may produce unnecessarily
 * long log files. Therefore, the option can be disabled.
 *
*/

ProcessPerformanceMonitor.prototype.m_displaySortedProcessInvocationDetails = null;

/**
 * Reference to optional browser window used to store results
 * in a comma separated values (CSV) list. Such a list may be
 * copied and entered into a spreadsheet such as Excel for
 * further processing.
 *
*/

ProcessPerformanceMonitor.prototype.m_windowCsv = null;

/**
 * Instance member records whether or not the results are required
 * in the form of a comma separated list of values.
 *
*/

ProcessPerformanceMonitor.prototype.m_displayResultsAsCsv = null;

/**
 * Method startProcess creates and stores a ProcessTimer instance associated
 * with a specific business process.
 *
 * @param processName A string containing the process name assigned to the business process.
 *                    The business process name must be unique.
 * @public
 *
*/

ProcessPerformanceMonitor.prototype.startProcess = function( processName )
{
    
    // Retrieve array entry for business process
    
    var processArray = this.m_processes[ processName ];
    
    if(processArray == null)
    {
    	processArray = new Array();
    	
    	this.m_processes[ processName ] = processArray;
    	
    }
    
    // Add new ProcessTimer instance to array
    
    processArray[processArray.length] = new ProcessTimer( processName, new Date() );
    
}

/**
 * Method stopProcess updates an active TimerProcess instance associated
 * with the named business process. The update defines the stop time for the
 * longest running ProcessTimer instance associated with the business process.
 *
 * @param processName A string containing the process name assigned to the business process.
 * @public
 *
*/

ProcessPerformanceMonitor.prototype.stopProcess = function( processName )
{
	
    // Record current time
    
    var endTime = new Date();
    
    // Retrieve array entry for business process
    
    var processArray = this.m_processes[ processName ];
    
    if(processArray == null)
    {
    	// stopProcess method does not have a corresponding startProcess
    	// method with the same process name
    	
    	throw new ProcessPerformanceMonitorError( "Business process " + processName + " not recognised by method ProcessPerformanceMonitor.stopProcess()" );
    	
    }
    
    // Search array of ProcessTimer instances for currently active processes
    
    var activeProcesses = 0;
    
    var currentActiveProcess;
    
    var processTimer;
    
    var arrayLength = processArray.length;
    
    for( i = 0; i < arrayLength; i++ )
    {
    	
    	processTimer = processArray[i];
    	
    	if(processTimer.isActive())
    	{
    	    activeProcesses++;
    	    
    	    currentActiveProcess = i;
    	}
    	
    }
    
    if(activeProcesses != 1)
    {
    	
    	// Unexpected result. In most cases there should only be one active instance
    	// of a business process as Javascript is single threaded.
    	
    	if(activeProcesses == 0)
    	{
    		
    	    throw new ProcessPerformanceMonitorError( "Performance monitor cannot find an active instance of business process " + processName );
    	    
    	}
    	else
    	{
    		
    	    // In this case there must be more than one active ProcessTimer instance for
    	    // the business process. In this case we will set end time for the instance
    	    // which has been running longest. However, we also flag each active instance
    	    // with an identityConflict such that we know that this problem occurred.
    	    
    	    var first = true;
    	    
    	    var minStartTime;
    	    
    	    var startTime;
    	    
    	    var longestRunningProcessTimerInstance;
    	    
    	    for( i = 0; i < arrayLength; i++ )
    	    {
    	    	
    	    	processTimer = processArray[ i ];
    	    	
    	    	if(processTimer.isActive())
    	    	{
    	    	
    	    	    if(first)
    	    	    {
    	    	    	first = false;
    	    	    	
    	    	    	minStartTime = processTimer.getStartTime().getTime();
    	    	    	
    	    	    	longestRunningProcessTimerInstance = i;
    	    	    	
    	    	    }
    	    	    else
    	    	    {
    	    	    	
    	    	    	// Check process start time
    	    	    	
    	    	    	startTime = processTimer.getStartTime().getTime();
    	    	    	
    	    	    	if(startTime < minStartTime)
    	    	    	{
    	    	    	    minStartTime = startTime;
    	    	    	    
    	    	    	    longestRunningProcessTimerInstance = i;
    	    	    	}
    	    	    	
    	    	    }
    	    	    
    	    	    // Set identity conflict to indicate more than active process
    	    	    
    	    	    processTimer.setIdentityConflict( true );
    	    	    
    	    	}
    	    	
    	    }
    	    
    	    processTimer = processArray[ longestRunningProcessTimerInstance ];
    	    
    	}
    	
    }
    else
    {
    	// Only one active process
    	
    	processTimer = processArray[ currentActiveProcess ];
    	
    }
    
    // Set end time for selected processTimer
    
    processTimer.setEndTime( endTime );
    
}

/**
 * Method displays results of performance monitoring in
 * one, or more, console windows.
 *
 * @param displayResultsAsCsv Boolean flag indicating whether performance results should be displayed as comma separated list
 *                            for input into spreadsheets. Default value is false.
 * @param displaySortedProcessInvocationDetails Boolean flag indicating whether performance results should be displayed for
 *                                              each individual invocation of a business process. Default value is false.
 * @public
*/

ProcessPerformanceMonitor.prototype.displayResults = function( displayResultsAsCsv, displaySortedProcessInvocationDetails )
{

    // Initialise window required variables
    
    var newWindowRequired = false;
    var newCsvWindowRequired = false;

    // Store whether or not a comma separated list of values is required
    // and whether or not the sorted business process invocation details
    // should be displayed
    
    if(arguments.length >= 2)
    {
       
       this.m_displayResultsAsCsv = displayResultsAsCsv;
       this.m_displaySortedProcessInvocationDetails = displaySortedProcessInvocationDetails;
        
    }
    else if(arguments.length == 1)
    {
    
        this.m_displayResultsAsCsv = displayResultsAsCsv;
        this.m_displaySortedProcessInvocationDetails = false;
        
    }
    else
    {
        this.m_displayResultsAsCsv = false;
        this.m_displaySortedProcessInvocationDetails = false;
    }

    // Create an array of ProcessTimer instances
    // sorted by the process start time
    
    this.m_sortedArray = this._sortProcessesByStartTime();
    
    // Create windows used to store results
    
    if(!this.m_window || this.m_window.closed)
    {

        newWindowRequired = true;
    
        this.m_window = window.open( "", "PerformanceMonitorWindow", "" );
        
        this.m_headerDisplayed = false;
        
    }
    
    if(this.m_displayResultsAsCsv)
    {
    
        if(!this.m_windowCsv || this.m_windowCsv.closed)
        {
        
            newCsvWindowRequired = true;
    
            this.m_windowCsv = window.open( "", "PerformanceMonitorWindowCsv", "" );
            
        }
        
    }
    
    if(newWindowRequired || newCsvWindowRequired)
    {
    
        // Delay output of results to enable browser to create window(s)
    
        setTimeout( "ServicesInternal.getPerformanceMonitor().displayResultsInWindows()", 100 );
        
    }
    else
    {
        // Invoke display methods
        
        this.displayResultsInWindows();
        
    }
    
}

/**
 * Method creates an array containing ProcessTimer instances gathered
 * by performance monitor sorted by the values of the process start times.
 *
 * @return Array of process timer instances sorted by start time
 * @private
 *
*/

ProcessPerformanceMonitor.prototype._sortProcessesByStartTime = function()
{

    // Create new array and set references to ProcessTimer instances
    
    var sortedArray = new Array();
    
    var processArray;
    
    var index = 0;
    
    for( var process in this.m_processes )
    {
    
        processArray = this.m_processes[ process ];
        
        for( i = 0; i < processArray.length; i++ )
        {
        
            // For present just set references to existing ProcessTimer instances
            
            sortedArray[ index++ ] = processArray[ i ];
            
        }
        
    }
    
    // Sort array by start time values
    
    sortedArray.sort( function( a, b ) { return a.getStartTime().getTime() -
                                                b.getStartTime().getTime(); } );
    
    return sortedArray;
    
}

/**
 * Method controls display of results in windows. After display the
 * monitor is reset.
 *
 * @private
 *
*/

ProcessPerformanceMonitor.prototype.displayResultsInWindows = function()
{

    this.displayResultsInWindow();
    
    if(this.m_displayResultsAsCsv)
    {
        this.displayResultsInWindowAsCsv();
    }
    
    // Reset data for next performance monitor display
    
    this.m_processes = new Array();
    
    this.m_date = new Date();
    
}

/**
 * Method displays performance monitor results within an HTML
 * division element on the performance monitor browser window
 *
 * @private
*/

ProcessPerformanceMonitor.prototype.displayResultsInWindow = function()
{
    
        // Retrieve references to components of window
    
        var document = this.m_window.document;
    
        var body = document.body;
    
        if(!this.m_headerDisplayed)
        {
    
            // Display header for performance monitor results
        
            var headerDivision = document.createElement( "div" );
        
            headerDivision.innerHTML = "<b>Performance Monitor Results</b>";
        
            body.appendChild( headerDivision );
        
            this.m_headerDisplayed = true;
        
        }
    
        // Display title for current results
    
        var titleDivision = document.createElement( "div" );
    
        var title = "<br><br><b>Results of performance analysis started on ";
    
        title = title + ProcessPerformanceMonitor.formatDate( this.m_date );
    
        title = title + " at ";
    
        title = title + ProcessPerformanceMonitor.formatTime( this.m_date );
    
        title = title + "</b>";
        
        if(this.m_displaySortedProcessInvocationDetails)
        {
        
            title = title + "<br><br>";
    
            title = title + "Business process results ordered by process start time";
    
            title = title + "<br><br>";
            
        }
    
        titleDivision.innerHTML = title;
    
        body.appendChild( titleDivision );
        
        if(this.m_displaySortedProcessInvocationDetails)
        {
    
            // Display results in table
    
            var resultsDivision = document.createElement( "div" );
    
            var resultsTable = document.createElement( "table" );
    
            resultsDivision.appendChild( resultsTable );
    
            var resultsTableBody = document.createElement( "tbody" );
    
            resultsTable.appendChild( resultsTableBody );
    
            // Define header row
    
            var resultsTableHeaderRow = document.createElement( "tr" );
    
            resultsTableBody.appendChild( resultsTableHeaderRow );
    
            // Process Name cell
    
            var resultsTableHeaderProcessNameCell = document.createElement( "td" );
    
            resultsTableHeaderProcessNameCell.innerHTML = "<b>Process Name</b>";
    
            resultsTableHeaderRow.appendChild( resultsTableHeaderProcessNameCell );
    
            // Start time cell
    
            var resultsTableHeaderStartTimeCell = document.createElement( "td" );
    
            resultsTableHeaderStartTimeCell.innerHTML = "<b>Start Time</b>";
    
            resultsTableHeaderRow.appendChild( resultsTableHeaderStartTimeCell );
    
            // End time cell
    
            var resultsTableHeaderEndTimeCell = document.createElement( "td" );
    
            resultsTableHeaderEndTimeCell.innerHTML = "<b>End Time</b>";
    
            resultsTableHeaderRow.appendChild( resultsTableHeaderEndTimeCell );
    
            // Process duration cell
    
            var resultsTableHeaderProcessDurationCell = document.createElement( "td" );
    
            resultsTableHeaderProcessDurationCell.innerHTML = "<b>Process duration (ms)</b>";
    
            resultsTableHeaderRow.appendChild( resultsTableHeaderProcessDurationCell );
    
            // Define body of results table
    
            for( i = 0; i < this.m_sortedArray.length; i++ )
            {
    
                var resultsTableRow = document.createElement( "tr" );
        
                resultsTableBody.appendChild( resultsTableRow );
        
                var resultsTableProcessNameCell = document.createElement( "td" );
        
                // Define process name
        
                var processName;
        
                if(this.m_sortedArray[i].getIdentityConflict())
                {
        
                    // Flag identity conflict
            
                    processName = this.m_sortedArray[i].getProcessName() + "*";
                }
                else
                {
                    processName = this.m_sortedArray[i].getProcessName();
                }
        
                resultsTableProcessNameCell.innerHTML = processName;
        
                resultsTableRow.appendChild( resultsTableProcessNameCell );
        
                // Define process start time
        
                var resultsTableStartTimeCell = document.createElement( "td" );
        
                var startTime = "";
        
                if(this.m_sortedArray[i].getStartTime() != null)
                {
        
                    startTime = ProcessPerformanceMonitor.formatTimeWithMilliseconds( this.m_sortedArray[i].getStartTime() );
            
                }
        
                resultsTableStartTimeCell.innerHTML = startTime;
        
                resultsTableRow.appendChild( resultsTableStartTimeCell );
        
                // Define process end time
        
                var resultsTableEndTimeCell = document.createElement( "td" );
        
                var endTime = "";
        
                if(this.m_sortedArray[i].getEndTime() != null)
                {
                    endTime = ProcessPerformanceMonitor.formatTimeWithMilliseconds( this.m_sortedArray[i].getEndTime() );
                }
        
                resultsTableEndTimeCell.innerHTML = endTime;
        
                resultsTableRow.appendChild( resultsTableEndTimeCell );
        
                // Define process execution time
        
                var resultsTableProcessDurationCell = document.createElement( "td" );
        
                var processDuration = this.m_sortedArray[i].getProcessExecutionTime();
        
                if( processDuration != null )
                {
                    resultsTableProcessDurationCell.innerHTML = processDuration;
                }
                else
                {
                    resultsTableProcessDurationCell.innerHTML = "";
                }
        
                resultsTableRow.appendChild( resultsTableProcessDurationCell );
            
            } // End of loop through sortedArray
    
            // Append results to document body
    
            body.appendChild( resultsDivision );
            
        }
    
        // Display results by business process
    
        var titleDivision1 = document.createElement( "div" );
    
        titleDivision1.innerHTML = "<br><br>Analysis by business process<br><br>";
    
        body.appendChild( titleDivision1 );
    
        var resultsDivision1 = document.createElement( "div" );
    
        var resultsTable1 = document.createElement( "table" );
    
        resultsDivision1.appendChild( resultsTable1 );
    
        var resultsTableBody1 = document.createElement( "tbody" );
    
        resultsTable1.appendChild( resultsTableBody1 );
    
        // Define header row
    
        var resultsTableHeaderRow1 = document.createElement( "tr" );
    
        resultsTableBody1.appendChild( resultsTableHeaderRow1 );
    
        // Process name cell
    
        var resultsTableHeaderProcessNameCell1 = document.createElement( "td" );
    
        resultsTableHeaderProcessNameCell1.innerHTML = "<b>Process name</b>";
    
        resultsTableHeaderRow1.appendChild( resultsTableHeaderProcessNameCell1 );
    
        // Invocation count cell
    
        var resultsTableHeaderInvocationCountCell = document.createElement( "td" );
    
        resultsTableHeaderInvocationCountCell.innerHTML = "<b>Number of invocations of business process</b>";
    
        resultsTableHeaderRow1.appendChild( resultsTableHeaderInvocationCountCell );
    
        // Total execution time cell
    
        var resultsTableHeaderTotalExecutionTimeCell = document.createElement( "td" );
    
        resultsTableHeaderTotalExecutionTimeCell.innerHTML = "<b>Total time taken executing business process (ms)</b>";
    
        resultsTableHeaderRow1.appendChild( resultsTableHeaderTotalExecutionTimeCell );
    
        // Define body of results table
    
        var processArray;
    
        for( var process in this.m_processes )
        {
    
            // Create table row to store results
        
            var resultsTableRow1 = document.createElement( "tr" );
        
            resultsTableBody1.appendChild( resultsTableRow1 );
        
            // Process name cell
        
            var resultsTableProcessNameCell1 = document.createElement( "td" );
        
            resultsTableProcessNameCell1.innerHTML = process;
        
            resultsTableRow1.appendChild( resultsTableProcessNameCell1 );
        
            // Calculate number of complete business process invocations
            // and total time spent executing process
        
            var executionTime;
        
            var noOfInvocations = 0;
            var totalExecutionTime = 0;
        
            processArray = this.m_processes[ process ];
        
            var processArrayLength = processArray.length;
        
            for( j = 0; j < processArrayLength; j++ )
            {
        
                executionTime = processArray[j].getProcessExecutionTime();
            
                if(executionTime != null)
                {
                    totalExecutionTime = totalExecutionTime + executionTime;
                
                    noOfInvocations++;
                }
            
            }
        
            // Number of invocations of business process cell
        
            var resultsTableInvocationCountCell = document.createElement( "td" );
        
            resultsTableInvocationCountCell.style.align = "right";
        
            // Check number of complete invocations matches number of recorded invocations
        
            if( noOfInvocations == processArrayLength )
            {
                resultsTableInvocationCountCell.innerHTML = noOfInvocations;   
            }
            else
            {
                resultsTableInvocationCountCell.innerHTML = noOfInvocations + "*";
            }
        
            resultsTableRow1.appendChild( resultsTableInvocationCountCell );
        
            // Total execution time of business process cell
        
            var resultsTableTotalExecutionTimeCell = document.createElement( "td" );
        
            resultsTableTotalExecutionTimeCell.style.align = "right";
        
            resultsTableTotalExecutionTimeCell.innerHTML = totalExecutionTime;
        
            resultsTableRow1.appendChild( resultsTableTotalExecutionTimeCell );
        
        }
    
        // Append results to document body
    
        body.appendChild( resultsDivision1 );
        
        // Create final spacer division
        
        var spacerDivision = document.createElement( "div" );
        
        spacerDivision.innerHTML = "<br><hr>";
        
        body.appendChild( spacerDivision );
    
}

/**
 * Method displays results of performance monitoring in a browser window as a
 * list of comma separated values. These results can subsequently be copied
 * and entered into a spreadsheet for analysis.
 *
 * @private
 *
*/

ProcessPerformanceMonitor.prototype.displayResultsInWindowAsCsv = function()
{
    
    // Create text to be displayed
    
    var results = "";
    
    var processTimerStr;
    
    for(i = 0; i < this.m_sortedArray.length; i++)
    {
        // Convert process timer information into csv list in string
        
        processTimerStr = ProcessPerformanceMonitor.displayProcessTimerAsCsvList( this.m_sortedArray[i] );
        
        if(processTimerStr != null)
        {
            // Add list to results
            
            results = results + processTimerStr + "<br>";
            
        }
        
    }
    
    if( results != "" )
    {
    
        // Display results in browser window
        
        var document = this.m_windowCsv.document;
        
        var resultsDivision = document.createElement( "div" );
        
        resultsDivision.innerHTML = results;
        
        document.body.appendChild( resultsDivision );
        
    }
    
}

/**
 * Class method designed to create a formatted 
 * date string from a variable of type Date.
 *
*/

ProcessPerformanceMonitor.formatDate = function( date )
{

    // Get day in month

    var dateStr = ProcessPerformanceMonitor.pad( date.getDate() );
    
    dateStr = dateStr + "/";
    
    // Month value ranges from 0 to 11
    
    dateStr = dateStr + ProcessPerformanceMonitor.pad( date.getMonth() + 1 );
    
    dateStr = dateStr + "/";
    
    // Get full year
    
    dateStr = dateStr + date.getFullYear();
    
    return dateStr;
    
}

/**
 * Class method designed to create a formatted
 * time string from a variable of type Date.
 *
*/

ProcessPerformanceMonitor.formatTime = function( date )
{

    var timeStr = ProcessPerformanceMonitor.pad( date.getHours() );
    
    timeStr = timeStr + ":";
    
    timeStr = timeStr + ProcessPerformanceMonitor.pad( date.getMinutes() );
    
    timeStr = timeStr + ":";
    
    timeStr = timeStr + ProcessPerformanceMonitor.pad( date.getSeconds() );
    
    return timeStr;
    
}

/**
 * Class creates formatted time string with milliseconds
 * component from a variable of type Date.
 *
*/

ProcessPerformanceMonitor.formatTimeWithMilliseconds = function( date )
{

    var timeStr = ProcessPerformanceMonitor.formatTime( date );
    
    timeStr = timeStr + ".";
    
    timeStr = timeStr + date.getMilliseconds()
    
    return timeStr;
    
}

/**
 * Method converts a number to a string left padding
 * the string with one zero if the number is less
 * than 10.
 *
 * @param value The number which is to be converted into a string.
 *
*/

ProcessPerformanceMonitor.pad = function( value )
{

    var str = String( value );
    
    if( value < 10 )
    {
        str = "0" + str;
    }
    
    return str;
    
}

/**
 * Class method represents an instance of the ProcessTimer
 * class as a comma separated list.
 *
 * @param processTimer A reference to an instance of the class ProcessTimer
 * @return Returns a string representation of input ProcessTimer instance. If
 *         input is null returns null.
 * @private
 *
*/

ProcessPerformanceMonitor.displayProcessTimerAsCsvList = function( processTimer )
{

    var csvList;
    var startTimeAvailable;
    var endTimeAvailable;
    var executionTime;
    
    if(processTimer != null)
    {
    
        // Extract business process name
        
        if(processTimer.getProcessName() != null)
        {
            csvList = processTimer.getProcessName();
        }
        else
        {
            csvList = "Process name not specified";
        }
        
        csvList = csvList + ProcessPerformanceMonitor.COMMA;
        
        // Extract start time in milliseconds
        
        if(processTimer.getStartTime() != null)
        {
            startTimeAvailable = true;
        }
        else
        {
            startTimeAvailable = false;
        }
        
        if(startTimeAvailable)
        {
            csvList = csvList + processTimer.getStartTime().getTime();
        }
        else
        {
            csvList = csvList + ProcessPerformanceMonitor.NOT_AVAILABLE;
        }
        
        csvList = csvList + ProcessPerformanceMonitor.COMMA;
        
        // Extract end time in milliseconds
        
        if(processTimer.getEndTime() != null)
        {
            endTimeAvailable = true;
        }
        else
        {
            endTimeAvailable = false;
        }
        
        if(endTimeAvailable)
        {
            csvList = csvList + processTimer.getEndTime().getTime();
        }
        else
        {
            csvList = csvList + ProcessPerformanceMonitor.NOT_AVAILABLE;
        }
        
        csvList = csvList + ProcessPerformanceMonitor.COMMA;
        
        // Extract start time as hours, minutes and seconds with milliseconds
        
        if(startTimeAvailable)
        {
            csvList = csvList + ProcessPerformanceMonitor.formatTimeWithMilliseconds( processTimer.getStartTime() );
        }
        else
        {
            csvList = csvList + ProcessPerformanceMonitor.NOT_AVAILABLE;
        }
        
        csvList = csvList + ProcessPerformanceMonitor.COMMA;
        
        // Extract end time as hours, minutes and seconds with milliseconds
        
        if(endTimeAvailable)
        {
            csvList = csvList + ProcessPerformanceMonitor.formatTimeWithMilliseconds( processTimer.getEndTime() );
        }
        else
        {
            csvList = csvList + ProcessPerformanceMonitor.NOT_AVAILABLE;
        }
        
        csvList = csvList + ProcessPerformanceMonitor.COMMA;
        
        // Extract process execution time
        
        executionTime = processTimer.getProcessExecutionTime();
        
        if(executionTime != null)
        {
            csvList = csvList + executionTime;
        }
        else
        {
            csvList = csvList + ProcessPerformanceMonitor.NOT_AVAILABLE;
        }
        
    }
        
    // Return string representation of process timer
        
    return csvList;
    
} 

/**
 * Define error class used to report errors in Performance monitor
 *
*/

function ProcessPerformanceMonitorError( message, ex )
{

    this.message = message;
    this.exception = ex;
    
}

ProcessPerformanceMonitorError.prototype = new Error();
ProcessPerformanceMonitorError.prototype.constructor = ProcessPerformanceMonitorError;
    	    	    	
    	    	    	