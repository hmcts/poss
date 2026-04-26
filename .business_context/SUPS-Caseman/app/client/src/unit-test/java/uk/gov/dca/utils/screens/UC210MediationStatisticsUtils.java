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
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Accumulative AE Fees screen.
 *
 * Date: 20-Aug-2009
 */
public class UC210MediationStatisticsUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant WARNING_INVALID_DATA. */
    public static final String WARNING_INVALID_DATA = "There are invalid or incomplete fields on the popup.";
    
    /** The Constant ERR_MSG_FUTURE_DATE. */
    public static final String ERR_MSG_FUTURE_DATE = "This date cannot be in the future.";
    
    /** The Constant ERR_MSG_INVALID_FORMAT. */
    public static final String ERR_MSG_INVALID_FORMAT =
            "The value does not conform to a valid date format of DD-MMM-YYYY, or is an invalid date";
    
    /** The Constant ERR_MSG_END_BEFORE_START. */
    public static final String ERR_MSG_END_BEFORE_START = "The Start Date cannot be later than the End Date.";

    /** The date start date. */
    // Private text field identifiers
    private String DATE_START_DATE = "Params_StartDate_Txt";
    
    /** The date end date. */
    private String DATE_END_DATE = "Params_EndDate_Txt";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The btn run report. */
    // Private button identifiers
    private String BTN_RUN_REPORT = "Status_RunReportButton";

    /** The popup progress ind. */
    // Private popup identifiers
    private String POPUP_PROGRESS_IND = "CaseMan_AsyncMonitorPopup";

    /**
     * Constructor.
     *
     * @param theCMTestBase CaseMan Test Base Object
     */
    public UC210MediationStatisticsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Mediation Statistics Report";
    }

    /**
     * Gets the start date.
     *
     * @return the start date
     */
    public String getStartDate ()
    {
        return cMB.getDatePickerAdaptor (DATE_START_DATE).getDate ();
    }

    /**
     * Sets the start date.
     *
     * @param pStartDate the new start date
     */
    public void setStartDate (final String pStartDate)
    {
        // Enter Start Date value
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_START_DATE);
        dA.setDate (pStartDate);
    }

    /**
     * Sets the cursor focus in the Start Date field.
     *
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public void setStartDateFocus () throws FrameworkException
    {
        cMB.getDatePickerAdaptor (DATE_START_DATE).focus ();
    }

    /**
     * Checks if is start date valid.
     *
     * @return true, if is start date valid
     * @throws FrameworkException the framework exception
     */
    public boolean isStartDateValid () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (DATE_START_DATE).isValid ();
    }

    /**
     * Checks if is start date mandatory.
     *
     * @return true, if is start date mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isStartDateMandatory () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (DATE_START_DATE).isMandatory ();
    }

    /**
     * Gets the end date.
     *
     * @return the end date
     */
    public String getEndDate ()
    {
        return cMB.getDatePickerAdaptor (DATE_END_DATE).getDate ();
    }

    /**
     * Sets the end date.
     *
     * @param pEndDate the new end date
     */
    public void setEndDate (final String pEndDate)
    {
        // Enter End Date value
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_END_DATE);
        dA.setDate (pEndDate);
    }

    /**
     * Sets the cursor focus in the End Date field.
     *
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public void setEndDateFocus () throws FrameworkException
    {
        cMB.getDatePickerAdaptor (DATE_END_DATE).focus ();
    }

    /**
     * Checks if is end date valid.
     *
     * @return true, if is end date valid
     * @throws FrameworkException the framework exception
     */
    public boolean isEndDateValid () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (DATE_END_DATE).isValid ();
    }

    /**
     * Checks if is end date mandatory.
     *
     * @return true, if is end date mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isEndDateMandatory () throws FrameworkException
    {
        return cMB.getDatePickerAdaptor (DATE_END_DATE).isMandatory ();
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
     * Clicks the Run Report button which will launch the oracle report
     * progress bar popup, generate the report, then close the popup.
     */
    public void runReport ()
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (BTN_RUN_REPORT).click ();
        if (cMB.isAlertPresent ())
        {
            // Handle form invalid alert
            cMB.getAlert ();
        }
        else
        {
            // Handle the progress bar popup
            final PopupAdaptor progressPopup = cMB.getPopupAdaptor (POPUP_PROGRESS_IND);

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
    }

    /**
     * Clicks the Run Report button which will launch the oracle report
     * progress bar popup, generate the report, then close the popup. If a JavaScript
     * Alert popup appears, the message is returned.
     *
     * @return the string
     */
    public String runReportReturnAlertString ()
    {
        String returnValue = "";

        // Click the Run Report Button
        cMB.getButtonAdaptor (BTN_RUN_REPORT).click ();
        if (cMB.isAlertPresent ())
        {
            // Handle form invalid alert
            returnValue = cMB.getAlertString ();
        }
        else
        {
            // Handle the progress bar popup
            final PopupAdaptor progressPopup = cMB.getPopupAdaptor (POPUP_PROGRESS_IND);

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

        return returnValue;
    }
}