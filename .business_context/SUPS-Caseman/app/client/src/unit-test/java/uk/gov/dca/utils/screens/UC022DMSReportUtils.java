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
package uk.gov.dca.utils.screens;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the DMS Report screen.
 *
 * Date: 08-Jul-2009
 */
public class UC022DMSReportUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_NAV_NO_CASE. */
    // Public Error Messages
    public static final String ERR_MSG_NAV_NO_CASE = "Please select a case row before navigating.";
    
    /** The Constant ERR_MSG_PRINT_INVALID_DATES. */
    public static final String ERR_MSG_PRINT_INVALID_DATES = "Both a start and end date are required.";
    
    /** The Constant ERR_MSG_DATE_NOT_IN_PAST. */
    public static final String ERR_MSG_DATE_NOT_IN_PAST = "This date can only be in the past.";
    
    /** The Constant ERR_MSG_END_BEFORE_START. */
    public static final String ERR_MSG_END_BEFORE_START = "The Start Date cannot be later than the End Date.";
    
    /** The Constant ERR_MSG_INVALID_DATES. */
    public static final String ERR_MSG_INVALID_DATES = "Please enter a valid start and end date.";
    
    /** The Constant ERR_MSG_INVALID_OBLIGATION. */
    public static final String ERR_MSG_INVALID_OBLIGATION = "This obligation does not exist.";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The cal start date. */
    // Parameter fields
    private String CAL_START_DATE = "DMS_Query_StartDate";
    
    /** The cal end date. */
    private String CAL_END_DATE = "DMS_Query_EndDate";
    
    /** The text obligationtype code. */
    private String TEXT_OBLIGATIONTYPE_CODE = "DMS_Query_ObligationTypeCode";
    
    /** The auto obligationtype name. */
    private String AUTO_OBLIGATIONTYPE_NAME = "DMS_Query_ObligationTypeName";
    
    /** The lov obligationtype. */
    private String LOV_OBLIGATIONTYPE = "DMS_Query_ObligationTypeLOV";
    
    /** The btn obligationtype lov. */
    private String BTN_OBLIGATIONTYPE_LOV = "DMS_Query_ObligationTypeLOVBtn";

    /** The btn display obligations. */
    // Private button identifiers
    private String BTN_DISPLAY_OBLIGATIONS = "Header_DisplayOverdueObligationsBtn";
    
    /** The btn delete obligations. */
    private String BTN_DELETE_OBLIGATIONS = "Header_DeleteObligationsBtn";
    
    /** The btn previous page. */
    private String BTN_PREVIOUS_PAGE = "Results_PreviousButton";
    
    /** The btn next page. */
    private String BTN_NEXT_PAGE = "Results_NextButton";
    
    /** The btn navigation cases. */
    private String BTN_NAVIGATION_CASES = "NavBar_CasesButton";
    
    /** The btn navigation events. */
    private String BTN_NAVIGATION_EVENTS = "NavBar_EventsButton";
    
    /** The btn nav run report. */
    private String BTN_NAV_RUN_REPORT = "NavBar_PrintDMSDailyReportButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearBtn";

    /** The grid overdue obligations. */
    // Private grid identifiers
    private String GRID_OVERDUE_OBLIGATIONS = "Results_ResultsGrid";

    /** The popup progress bar. */
    // Private popup identifiers
    private String POPUP_PROGRESS_BAR = "ProgressIndicator_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC022DMSReportUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "DMS Report";
    }

    /**
     * Gets the start date.
     *
     * @return the start date
     */
    public String getStartDate ()
    {
        return cMB.getDatePickerAdaptor (CAL_START_DATE).getDate ();
    }

    /**
     * Sets the start date.
     *
     * @param pDate the new start date
     */
    public void setStartDate (final String pDate)
    {
        cMB.getDatePickerAdaptor (CAL_START_DATE).setDate (pDate);
    }

    /**
     * Sets the cursor focus in the Start Date field.
     *
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public void setStartDateFocus () throws FrameworkException
    {
        cMB.getDatePickerAdaptor (CAL_START_DATE).focus ();
    }

    /**
     * Checks if is start date read only.
     *
     * @return true, if is start date read only
     * @throws FrameworkException the framework exception
     */
    public boolean isStartDateReadOnly () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_START_DATE).isReadOnly ();
    }

    /**
     * Checks if is start date valid.
     *
     * @return true, if is start date valid
     * @throws FrameworkException the framework exception
     */
    public boolean isStartDateValid () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_START_DATE).isValid ();
    }

    /**
     * Checks if is start date mandatory.
     *
     * @return true, if is start date mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isStartDateMandatory () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_START_DATE).isMandatory ();
    }

    /**
     * Gets the end date.
     *
     * @return the end date
     */
    public String getEndDate ()
    {
        return cMB.getDatePickerAdaptor (CAL_END_DATE).getDate ();
    }

    /**
     * Sets the end date.
     *
     * @param pDate the new end date
     */
    public void setEndDate (final String pDate)
    {
        cMB.getDatePickerAdaptor (CAL_END_DATE).setDate (pDate);
    }

    /**
     * Sets the cursor focus in the End Date field.
     *
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public void setEndDateFocus () throws FrameworkException
    {
        cMB.getDatePickerAdaptor (CAL_END_DATE).focus ();
    }

    /**
     * Checks if is end date read only.
     *
     * @return true, if is end date read only
     * @throws FrameworkException the framework exception
     */
    public boolean isEndDateReadOnly () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_END_DATE).isReadOnly ();
    }

    /**
     * Checks if is end date valid.
     *
     * @return true, if is end date valid
     * @throws FrameworkException the framework exception
     */
    public boolean isEndDateValid () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_END_DATE).isValid ();
    }

    /**
     * Checks if is end date mandatory.
     *
     * @return true, if is end date mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isEndDateMandatory () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (CAL_END_DATE).isMandatory ();
    }

    /**
     * Gets the obligation type code.
     *
     * @return the obligation type code
     */
    public String getObligationTypeCode ()
    {
        return cMB.getTextInputAdaptor (TEXT_OBLIGATIONTYPE_CODE).getValue ();
    }

    /**
     * Sets the obligation type code.
     *
     * @param pCode the new obligation type code
     */
    public void setObligationTypeCode (final String pCode)
    {
        setTextFieldValue (TEXT_OBLIGATIONTYPE_CODE, pCode);
    }

    /**
     * Sets the cursor focus in the Obligation Type Code field.
     *
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public void setObligationTypeCodeFocus () throws FrameworkException
    {
        cMB.getTextInputAdaptor (TEXT_OBLIGATIONTYPE_CODE).focus ();
    }

    /**
     * Checks if is obligation type code read only.
     *
     * @return true, if is obligation type code read only
     * @throws FrameworkException the framework exception
     */
    public boolean isObligationTypeCodeReadOnly () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_OBLIGATIONTYPE_CODE).isReadOnly ();
    }

    /**
     * Checks if is obligation type code valid.
     *
     * @return true, if is obligation type code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isObligationTypeCodeValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_OBLIGATIONTYPE_CODE).isValid ();
    }

    /**
     * Gets the obligation type name.
     *
     * @return the obligation type name
     */
    public String getObligationTypeName ()
    {
        return cMB.getAutoCompleteAdaptor (AUTO_OBLIGATIONTYPE_NAME).getText ();
    }

    /**
     * Sets the obligation type name.
     *
     * @param pName the new obligation type name
     */
    public void setObligationTypeName (final String pName)
    {
        cMB.getAutoCompleteAdaptor (AUTO_OBLIGATIONTYPE_NAME).setText (pName);
    }

    /**
     * Checks if is obligation type name read only.
     *
     * @return true, if is obligation type name read only
     * @throws FrameworkException the framework exception
     */
    public boolean isObligationTypeNameReadOnly () throws FrameworkException
    {
        return cMB.getAutoCompleteAdaptor (AUTO_OBLIGATIONTYPE_NAME).isReadOnly ();
    }

    /**
     * Checks if is obligation type name valid.
     *
     * @return true, if is obligation type name valid
     * @throws FrameworkException the framework exception
     */
    public boolean isObligationTypeNameValid () throws FrameworkException
    {
        return cMB.getAutoCompleteAdaptor (AUTO_OBLIGATIONTYPE_NAME).isValid ();
    }

    /**
     * Checks if is obligation type LOV enabled.
     *
     * @return true, if is obligation type LOV enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isObligationTypeLOVEnabled () throws FrameworkException
    {
        return cMB.getButtonAdaptor (BTN_OBLIGATIONTYPE_LOV).isEnabled ();
    }

    /**
     * Selects the Obligation Type via the LOV subform.
     *
     * @param pCode Obligation Type Code to filter on
     */
    public void selectObligationTypeFromLOV (final String pCode)
    {
        clickLOVSelect (BTN_OBLIGATIONTYPE_LOV, LOV_OBLIGATIONTYPE, "Type", pCode);
    }

    /**
     * Checks if is display obligations button enabled.
     *
     * @return true, if is display obligations button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDisplayObligationsButtonEnabled () throws FrameworkException
    {
        return cMB.getButtonAdaptor (BTN_DISPLAY_OBLIGATIONS).isEnabled ();
    }

    /**
     * Checks if is delete obligations button enabled.
     *
     * @return true, if is delete obligations button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDeleteObligationsButtonEnabled () throws FrameworkException
    {
        return cMB.getButtonAdaptor (BTN_DELETE_OBLIGATIONS).isEnabled ();
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Clicks the 'Cases' navigation button to navigate to the Create Cases Screen.
     */
    public void navigateCasesScreen ()
    {
        mClickButton (BTN_NAVIGATION_CASES);
    }

    /**
     * Clicks the 'Events' navigation button to navigate to the Case Events Screen.
     */
    public void navigateEventsScreen ()
    {
        mClickButton (BTN_NAVIGATION_EVENTS);
    }

    /**
     * Clicks the display overdue obligations button.
     *
     * @throws FrameworkException Thrown if problem determining enablement of button
     */
    public void displayOverdueObligations () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_DISPLAY_OBLIGATIONS);
        if (bA.isEnabled ())
        {
            // Click the button if enabled
            bA.click ();
            cMB.waitForPageToLoad ();

            // Handle alert displayed when no overdue obligations
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Clicks the Delete Overdue Obligations button.
     *
     * @param pConfirm User will be asked to confirm delete (true or false)
     * @throws FrameworkException Thrown if problem determining enablement of button
     */
    public void deleteObligations (final boolean pConfirm) throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_DELETE_OBLIGATIONS);
        if (bA.isEnabled ())
        {
            // Click the button if enabled
            bA.click ();

            final String dialogOption = pConfirm ? "Yes" : "No";
            clickFrameworkDialogButton (dialogOption);
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Clicks the Previous button to see the previous page of overdue obligations.
     */
    public void clickPreviousButton ()
    {
        try
        {
            final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_PREVIOUS_PAGE);
            if (bA.isEnabled ())
            {
                // Click the button if enabled
                bA.click ();
                cMB.waitForPageToLoad ();
            }
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Checks if is previous button enabled.
     *
     * @return true, if is previous button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreviousButtonEnabled () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_PREVIOUS_PAGE);
        return bA.isEnabled ();
    }

    /**
     * Clicks the Next button to see the next page of overdue obligations.
     */
    public void clickNextButton ()
    {
        try
        {
            final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_NEXT_PAGE);
            if (bA.isEnabled ())
            {
                // Click the button if enabled
                bA.click ();
                cMB.waitForPageToLoad ();
            }
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Checks if is next button enabled.
     *
     * @return true, if is next button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isNextButtonEnabled () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_NEXT_PAGE);
        return bA.isEnabled ();
    }

    /**
     * Click the Clear button.
     */
    public void clickClearButton ()
    {
        cMB.getButtonAdaptor (BTN_CLEAR_SCREEN).click ();
        cMB.waitForPageToLoad ();
    }

    /**
     * Runs the DMS Oracle Report CM_OBL_R1.rdf by clicking the button in the navigation bar
     * 
     * @param expectOutput true if expect the output to be produced, else false
     */
    public void runDMSReport (final boolean expectOutput)
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (BTN_NAV_RUN_REPORT).click ();

        if (expectOutput)
        {
            // Handle the progress bar popup
            final PopupAdaptor progressPopup = cMB.getPopupAdaptor (POPUP_PROGRESS_BAR);

            // Loop until popup loads
            boolean popupVisible = progressPopup.isVisible ();
            while ( !popupVisible)
            {
                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
            }

            // Loop until popup has closed
            popupVisible = progressPopup.isVisible ();
            while (popupVisible)
            {
                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
            }
        }

        cMB.waitForPageToLoad ();
    }

    /**
     * Selects a row in the obligations grid based upon a Case Number specified.
     *
     * @param pCaseNumber The case number to look for
     */
    public void selectObligationByCaseNumber (final String pCaseNumber)
    {
        selectValueFromGrid (GRID_OVERDUE_OBLIGATIONS, pCaseNumber);
    }

    /**
     * Selects a row in the obligations grid based upon a Row Number specified.
     *
     * @param rowNumber The row number to click
     */
    public void selectObligationByRowNumber (final int rowNumber)
    {
        final GridAdaptor outputsGrid = cMB.getGridAdaptor (GRID_OVERDUE_OBLIGATIONS);
        outputsGrid.clickRow (rowNumber);
    }

    /**
     * Retrieves a value from a cell in the Obligations grid.
     *
     * @param rowId Row index (start from 1)
     * @param colId Column index (start from 1)
     * @return The value in the grid cell specified
     */
    public String getValueFromObligationsGrid (final int rowId, final int colId)
    {
        return getValueFromGrid (GRID_OVERDUE_OBLIGATIONS, rowId, colId);
    }

}