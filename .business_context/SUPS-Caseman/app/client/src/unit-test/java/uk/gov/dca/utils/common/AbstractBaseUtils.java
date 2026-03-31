/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.utils.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AbstractAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FilteredGridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FrameworkDialogAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by David Turenr. User: Administrator Date: 30-Jan-2009 Time: 09:42:04 Abstract class to standardise IoC The
 * test class must be injected to make the <session> object visible - the session provides the adaptors upon which each
 * test occurs but in the context of these utility classes they also provide common functionality that will not always
 * be tested such as navigation or loading adaptor data. The session is a protected member of the test class (not
 * available therefore to the utility classes directly) and so the test is wrapped in CMTestBase to expose the business
 * functionality to these utility classes.
 */
public abstract class AbstractBaseUtils implements ITestProperties
{
    
    /** The c MB. */
    // The CaseMan test base object with access to the session
    public AbstractCmTestBase cMB;

    /** The Constant DATE_FORMAT_NOW. */
    // Static variable representing the String date format used on Date Pickers
    public static final String DATE_FORMAT_NOW = "dd-MMM-yyyy";

    /** The Constant DATE_FORMAT_SYSDATA. */
    // Static variable representing the String date format used in the system data table
    public static final String DATE_FORMAT_SYSDATA = "yyyyMMdd";

    /** The Constant DATE_FORMAT_DISPLAY. */
    // Static variable representing the String date format used in display format
    public static final String DATE_FORMAT_DISPLAY = "yyyy-MM-dd";

    /** The raised LOV. */
    // Private variables used by some of the class functions
    private FilteredGridAdaptor raisedLOV;
    
    /** The highlighted grid. */
    private GridAdaptor highlightedGrid;
    
    /** The framework dialog adaptor. */
    private FrameworkDialogAdaptor frameworkDialogAdaptor;

    /**
     * Constructor.
     *
     * @param theCMTestBase CaseMan Test Base object
     */
    public AbstractBaseUtils (final AbstractCmTestBase theCMTestBase)
    {
        this.cMB = theCMTestBase;
    }

    /**
     * Returns the text for a specified adaptor's tooltip.
     *
     * @param theAdaptor The adaptor to focus on
     * @return the text for a specified adaptor's tooltip
     */
    public String getFormPopUpHelpText (final AbstractAdaptor theAdaptor)
    {
        theAdaptor.focus ();
        return cMB.getTopForm ().getPopupHelpText ();
    }

    /**
     * Returns the text for a specified adaptor's tooltip. The adaptor is on a
     * subform poup.
     *
     * @param theAdaptor The adaptor to focus on
     * @param subFormAdaptor The subform the adaptor sits on
     * @return the text for a specified adaptor's tooltip
     */
    public String getSubformPopUpHelpText (final AbstractAdaptor theAdaptor, final String subFormAdaptor)
    {
        theAdaptor.focus ();
        return cMB.getSubFormAdaptor (subFormAdaptor).getPopupHelpText ();
    }

    /**
     * Returns the tooltip text for the adaptor on a subform currently in focus.
     *
     * @param subFormAdaptor The subform the adaptor sits on
     * @return the text for the adaptor in focus' tooltip
     */
    public String getFocusedSubformPopUpHelpText (final String subFormAdaptor)
    {
        return cMB.getSubFormAdaptor (subFormAdaptor).getPopupHelpText ();
    }

    /**
     * Gets the form status bar text.
     *
     * @return the form status bar text
     */
    public String getFormStatusBarText ()
    {
        return cMB.getTopForm ().getStatusBarText ();
    }

    /**
     * Returns the text currently displayed in the subform's status bar.
     *
     * @param subFormAdaptor Identifier of the subform
     * @return the text currently displayed in the subform's status bar
     */
    public String getSubformStatusBarText (final String subFormAdaptor)
    {
        return cMB.getSubFormAdaptor (subFormAdaptor).getStatusBarText ();
    }

    /**
     * stops the processing of event queues.
     */
    public void startTransaction ()
    {
        cMB.startTransaction ();
    }

    /**
     * starts the processing of event queues.
     */
    public void endTransaction ()
    {
        cMB.endTransaction ();
    }

    /**
     * Function clicks a button in a Framework Dialog popup based upon a specified
     * button value.
     *
     * @param buttonValue The desired button value to click e.g. 'Yes', 'No' etc.
     */
    public void clickFrameworkDialogButton (final String buttonValue)
    {
        cMB.getFrameworkDialogAdaptor ("fw_standard_dialog_0").clickButton (buttonValue);
        cMB.waitForPageToLoad ();
    }

    /**
     * Returns a FrameworkDialogAdaptor (Framework Dialog popup object) displayed on a
     * specified subform popup.
     *
     * @param theSubform Identifier of the subform adaptor
     * @return The FrameworkDialogAdaptor object displayed in the subform
     * @throws Exception Thrown if incorrect adaptor id passed or dialog not present
     */
    public FrameworkDialogAdaptor getSubformFrameworkDialog (final String theSubform) throws Exception
    {
        return (FrameworkDialogAdaptor) cMB.getSubFormAdaptor (theSubform).getAdaptor ("fw_standard_dialog_0");
    }

    /**
     * Function clicks a button in a Framework Dialog popup displayed in a subform based upon
     * a specified button value.
     *
     * @param theSubform Identifier of the subform the dialog popup is on
     * @param option Option to select on the dialog popup e.g. 'Yes', 'No' etc.
     * @throws Exception Thrown if incorrect subform identifier or option supplied
     */
    public void clickSubformFrameworkDialogButton (final String theSubform, final String option) throws Exception
    {
        getSubformFrameworkDialog (theSubform).clickButton (option);
        cMB.waitForPageToLoad ();
    }

    /**
     * Select a row in a grid by clicking it.
     *
     * @param grid The grid to get a value from
     * @param row The row index to select from the grid (start from 1)
     */
    public void selectValueFromGrid (final String grid, final int row)
    {
        cMB.getGridAdaptor (grid).clickRow (row);
    }

    /**
     * Searches for a value in the grid specified, starting from the first column.
     *
     * @param grid The string identifier for the grid
     * @param value The value to search for in the grid
     */
    public void selectValueFromGrid (final String grid, final String value)
    {
        highlightedGrid = cMB.getGridAdaptor (grid);
        clickGridValueRow (value, 1);
    }

    /**
     * Searches for a value in the grid specified, starting from a specified column.
     *
     * @param grid The string identifier for the grid
     * @param value The value to search for in the grid
     * @param startCol The column index to start searching from (start from 1)
     */
    public void selectValueFromGrid (final String grid, final String value, final int startCol)
    {
        highlightedGrid = cMB.getGridAdaptor (grid);
        clickGridValueRow (value, startCol);
    }

    /**
     * Searches for a value in the grid specified, starting from the first column
     * and double clicks on it.
     *
     * @param grid The string identifier for the grid
     * @param value The value to search for in the grid
     */
    public void doubleClickValueFromGrid (final String grid, final String value)
    {
        highlightedGrid = cMB.getGridAdaptor (grid);
        doubleClickGridValueRow (value, 1);
    }

    /**
     * Searches for a value in the grid specified, starting from a specified column
     * and double clicks on it.
     *
     * @param grid The string identifier for the grid
     * @param value The value to search for in the grid
     * @param startCol The column index to start searching from (start from 1)
     */
    public void doubleClickValueFromGrid (final String grid, final String value, final int startCol)
    {
        highlightedGrid = cMB.getGridAdaptor (grid);
        doubleClickGridValueRow (value, startCol);
    }

    /**
     * Searches for a value in the subform grid specified, starting from a specified column.
     *
     * @param subform Subform adaptor object
     * @param grid The string identifier for the grid
     * @param value The value to search for in the grid
     * @param startCol The column index to start searching from (start from 1)
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void selectValueFromSubformGrid (final SubFormAdaptor subform, final String grid, final String value,
                                            final int startCol)
        throws FrameworkException
    {
        highlightedGrid = (GridAdaptor) subform.getAdaptor (grid);
        clickGridValueRow (value, startCol);
    }

    /**
     * Retrieves a value from a cell in a grid.
     *
     * @param grid Identifier of the grid
     * @param rowId Row index (start from 1)
     * @param colId Column index (start from 1)
     * @return The value in the grid cell specified
     */
    public String getValueFromGrid (final String grid, final int rowId, final int colId)
    {
        final GridAdaptor gridAdaptor = cMB.getGridAdaptor (grid);
        return getValueFromGrid (gridAdaptor, rowId, colId);
    }

    /**
     * Retrieves a value from a cell in a grid.
     *
     * @param grid The GridAdaptor object representing the grid
     * @param row Row index (start from 1)
     * @param col colId Column index (start from 1)
     * @return The value in the grid cell specified
     */
    private String getValueFromGrid (final GridAdaptor grid, final int row, final int col)
    {
        return grid.getText (row, col);
    }

    /**
     * Private grid search utility. Starts by searching every row in the first column
     * for a specified string, before moving onto the next column and so on, using a
     * maximum of 20 rows and 6 columns. Can start from a column other than the first.
     *
     * @param value The value to search for in the grid
     * @param startCol The column index to start from (start from 1)
     */
    private void clickGridValueRow (final String value, final int startCol)
    {
        boolean keepChecking = true;
        int rowCount = 1;
        int columnCount = startCol;

        search: while (keepChecking)
        {
            if (columnCount <= 6)
            {
                while (rowCount < 21)
                {
                    if (value.equals (highlightedGrid.getText (rowCount, columnCount)))
                    {
                        highlightedGrid.clickRow (rowCount);
                        break search;
                    }
                    rowCount++;
                }
                rowCount = 1;
                columnCount++;
            }
            else
            {
                keepChecking = false;
            }
        }
    }

    /**
     * Searches for a grid row and double clicks it. Starts by searching every row in the first column
     * for a specified string, before moving onto the next column and so on, using a
     * maximum of 20 rows and 6 columns. Can start from a column other than the first.
     *
     * @param value The value to search for in the grid
     * @param startCol The column index to start from (start from 1)
     */
    private void doubleClickGridValueRow (final String value, final int startCol)
    {
        boolean keepChecking = true;
        int rowCount = 1;
        int columnCount = startCol;

        search: while (keepChecking)
        {
            if (columnCount <= 6)
            {
                while (rowCount < 21)
                {
                    if (value.equals (highlightedGrid.getText (rowCount, columnCount)))
                    {
                        highlightedGrid.doubleClickRow (rowCount);
                        break search;
                    }
                    rowCount++;
                }
                rowCount = 1;
                columnCount++;
            }
            else
            {
                keepChecking = false;
            }
        }
    }

    /**
     * Indicates whether or not a specified value exists in a specified column
     * in a grid.
     *
     * @param grid String identifier of the grid to be searched
     * @param value Search string to look for
     * @param column Column to look in (index starting from 1)
     * @return True if the search string exists in the column specified else false.
     */
    public boolean isValueInGridColumn (final String grid, final String value, final int column)
    {
        // Initialise the grid and the return value
        highlightedGrid = cMB.getGridAdaptor (grid);
        boolean blnFound = false;

        try
        {
            // Loop through rows 1 to 100 (max number of grid rows in CaseMan) and check the column specified
            // for the search string.
            for (int i = 1; i <= 100; i++)
            {
                if (value.equals (highlightedGrid.getText (i, column)))
                {
                    blnFound = true;
                    break;
                }
            }
        }
        catch (final Exception e)
        {
            // If try to access a grid row that dosn't exist, will throw exception
            // Ignore exception and return false.
            blnFound = false;
        }

        return blnFound;
    }

    /**
     * Indicates whether or not a specified value exists in a specified column
     * in a grid.
     *
     * @param subform Subform adaptor object
     * @param grid String identifier of the grid to be searched
     * @param value Search string to look for
     * @param column Column to look in (index starting from 1)
     * @return True if the search string exists in the column specified else false.
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public boolean isValueInSubformGridColumn (final SubFormAdaptor subform, final String grid, final String value,
                                               final int column)
        throws FrameworkException
    {
        // Initialise the grid and the return value
        highlightedGrid = (GridAdaptor) subform.getAdaptor (grid);
        boolean blnFound = false;

        try
        {
            // Loop through rows 1 to 100 (max number of grid rows in CaseMan) and check the column specified
            // for the search string.
            for (int i = 1; i <= 100; i++)
            {
                if (value.equals (highlightedGrid.getText (i, column)))
                {
                    blnFound = true;
                    break;
                }
            }
        }
        catch (final Exception e)
        {
            // If try to access a grid row that dosn't exist, will throw exception
            // Ignore exception and return false.
            blnFound = false;
        }

        return blnFound;
    }

    /**
     * Gets the highlighted grid row index.
     *
     * @param grid the grid
     * @return the highlighted grid row index
     */
    public int getHighlightedGridRowIndex (final String grid)
    {
        // Initialise the grid and the return value
        highlightedGrid = cMB.getGridAdaptor (grid);
        int selectedRowIndex = -1;
        try
        {
            // Loop through rows 1 to 100 (max number of grid rows in CaseMan) and check the column specified
            // for the search string.
            for (int i = 1; i <= 100; i++)
            {
                if (highlightedGrid.isRowSelected (i))
                {
                    selectedRowIndex = i;
                    break;
                }
            }
        }
        catch (final Exception e)
        {
            // If try to access a grid row that dosn't exist, will throw exception
            // Ignore exception and return -1.
            selectedRowIndex = -1;
        }

        return selectedRowIndex;
    }

    /**
     * Returns the number of rows in a specified grid.
     *
     * @param grid The string identifier of the grid
     * @return The number of rows in the grid
     */
    public int countGridRows (final String grid)
    {
        // Initialise the grid and the return value
        highlightedGrid = cMB.getGridAdaptor (grid);
        int rows = 0;

        try
        {
            // Loop through rows 1 to 100 (max number of grid rows in CaseMan) and check the column specified
            // for the search string.
            for (int i = 1; i <= 100; i++)
            {
                if (highlightedGrid.getText (i).equals (""))
                {
                    // Have reached a blank grid cell indicating there is no data in this row
                    break;
                }
                rows++;
            }
        }
        catch (final Exception e)
        {
            // If try to access a grid row that dosn't exist, will throw exception
            // Ignore exception and return current value of rows variable.
        }

        return rows;
    }

    /**
     * Function launches an LOV Subform popup with a filtered grid.
     *
     * @param lovButton String identifier of the button that launches the LOV
     * @param subformAdaptor String identifier of the subform
     */
    public void raiseLOVSubform (final String lovButton, final String subformAdaptor)
    {
        cMB.clickButton (lovButton);
        cMB.waitForPageToLoad ();
        final SubFormAdaptor lovAdaptor = cMB.getSubFormAdaptor (subformAdaptor);
        try
        {
            raisedLOV = (FilteredGridAdaptor) lovAdaptor.getAdaptor (FRAMEWORK_LOV_SUBFORM_GRID);
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Function selects a value from an LOV Subform popup with a filtered grid
     * by filtering the data in the grid and double clicking on the first row.
     * Before calling, the function raiseLOVSubform() should be invoked.
     *
     * @param column String identifier of the grid column to filter on
     * @param value Value to filter the grid by
     */
    public void selectValueFromLOVSubform (final String column, final String value)
    {
        try
        {
            raisedLOV.filterColumn (column, value);
            raisedLOV.doubleClickRow (1);
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Function launches an LOV Subform popup with a filtered grid, then filters the
     * grid and double clicks the first row left in the grid.
     *
     * @param lovButton String identifier of the button which launches the LOV
     * @param subformAdaptor String identifier of the LOV subform
     * @param Column String identifier of the grid column to filter on
     * @param Value Value to filter the grid by
     */
    public void clickLOVSelect (final String lovButton, final String subformAdaptor, final String Column,
                                final String Value)
    {
        raiseLOVSubform (lovButton, subformAdaptor);
        selectValueFromLOVSubform (Column, Value);
    }

    /**
     * Function launches a popup by clicking a specific button.
     *
     * @param Popup_Button_Name String identifier of the button which launches the popup
     */
    public void raisePopUp (final String Popup_Button_Name)
    {
        cMB.clickButton (Popup_Button_Name);
        cMB.waitForPageToLoad ();
    }

    /**
     * Static function which returns the current system date in the String
     * format required for use in Date Picker fields.
     *
     * @return The current system date in String format dd-MMM-yyyy
     */
    public static String now ()
    {
        final Date now = new Date ();
        final SimpleDateFormat sdf = new SimpleDateFormat (DATE_FORMAT_NOW);
        return sdf.format (now);
    }

    /**
     * Static function which returns the current system date plus a number of days in the String
     * format required for use in Date Picker fields.
     *
     * @param daysInFuture The number of days in the future, can be negative for historical dates
     * @param dateFormat The date format the date should be returned in.
     * @param validateWeekend True if date cannot fall on weekend, else false
     * @return The current system date in the String date format specified
     */
    public static String getFutureDate (final int daysInFuture, final String dateFormat, final boolean validateWeekend)
    {
        final Date now = new Date ();
        final Calendar c = Calendar.getInstance ();
        c.setTime (now);
        c.add (Calendar.DAY_OF_MONTH, daysInFuture);

        if (validateWeekend)
        {
            // Date requested cannot be a weekend
            while (mIsWeekend (c))
            {
                // Loop while current Calendar object points to a weekend
                if (daysInFuture < 0)
                {
                    // User requesting date in the past so go back another day
                    c.add (Calendar.DAY_OF_MONTH, -1);
                }
                else
                {
                    // User requested a future date so go forward another day
                    c.add (Calendar.DAY_OF_MONTH, 1);
                }
            }
        }

        final SimpleDateFormat sdf = new SimpleDateFormat (dateFormat);
        return sdf.format (c.getTime ());
    }

    /**
     * (non-Javadoc)
     * Determine if day is Sat or Sunday.
     * 
     * @param pCalendar A Calendar object to interrogate
     * @return boolean True if the Calendar points to a Saturday or Sunday, else false
     */
    private static boolean mIsWeekend (final Calendar pCalendar)
    {
        boolean isWeekend = false;

        final int dayOfWeek = pCalendar.get (Calendar.DAY_OF_WEEK);
        switch (dayOfWeek)
        {
            case Calendar.SATURDAY:
                isWeekend = true;
                break;
            case Calendar.SUNDAY:
                isWeekend = true;
                break;
        }

        return isWeekend;
    }

    /**
     * Put the focus on the adaptor specified.
     *
     * @param theAdaptor Adaptor object to focus on
     */
    public void focus (final AbstractAdaptor theAdaptor)
    {
        theAdaptor.focus ();
    }

    /**
     * Checks if is standard popup visible.
     *
     * @return true, if is standard popup visible
     */
    public boolean isStandardPopupVisible ()
    {
        return getStandardDialogAdaptor ().isVisible ();
    }

    /**
     * Gets the standard popup title.
     *
     * @return the standard popup title
     */
    public String getStandardPopupTitle ()
    {
        return getStandardDialogAdaptor ().getDialogTitle ();
    }

    /**
     * Gets the standard popup message.
     *
     * @return the standard popup message
     */
    public String getStandardPopupMessage ()
    {
        return getStandardDialogAdaptor ().getDialogMessage ();
    }

    /**
     * Clicks the Yes button in the standard framework dialog popup displayed on the screen.
     */
    public void clickStandardPopupYes ()
    {
        getStandardDialogAdaptor ().clickButton ("Yes");
    }

    /**
     * Clicks the No button in the standard framework dialog popup displayed on the screen.
     */
    public void clickStandardPopupNo ()
    {
        getStandardDialogAdaptor ().clickButton ("No");
    }

    /**
     * Clicks the OK button in the standard framework dialog popup displayed on the screen.
     */
    public void clickStandardPopupOK ()
    {
        getStandardDialogAdaptor ().clickButton ("OK");
    }

    /**
     * Sets the value in a specific text adaptor field.
     *
     * @param fieldId String identifier of the text field adaptor
     * @param fieldValue String value to enter in the field
     */
    public void setTextFieldValue (final String fieldId, final String fieldValue)
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (fieldId);
        tA.type (fieldValue);
    }

    /**
     * Clicks the specified select list option (displayed value).
     *
     * @param fieldId String identifier of the select field
     * @param fieldValue Display option to select in the dropdown
     */
    public void setSelectFieldValue (final String fieldId, final String fieldValue)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (fieldId);
        sA.clickLabel (fieldValue);
    }

    /**
     * Sets the value in a checkbox field to checked or not checked.
     *
     * @param fieldId String identifier of the checkbox field
     * @param toChecked True if the checkbox needs to be checked or false if unchecked
     */
    public void setCheckboxFieldValue (final String fieldId, final boolean toChecked)
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (fieldId);
        if (toChecked && !cA.isChecked ())
        {
            // Checkbox needs to be checked and currently is not checked
            cA.click ();
        }
        else if ( !toChecked && cA.isChecked ())
        {
            // Checkbox needs to be unchecked and is currently checked
            cA.click ();
        }
    }

    /**
     * Gets the standard dialog adaptor.
     *
     * @return the standard dialog adaptor
     */
    private FrameworkDialogAdaptor getStandardDialogAdaptor ()
    {
        if (frameworkDialogAdaptor == null)
        {
            frameworkDialogAdaptor = cMB.getFrameworkDialogAdaptor (STANDARD_DIALOG_POPUP);
        }
        return frameworkDialogAdaptor;
    }
}
