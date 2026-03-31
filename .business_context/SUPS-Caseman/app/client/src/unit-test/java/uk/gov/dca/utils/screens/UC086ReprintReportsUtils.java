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
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Reprint Reports screen.
 *
 * Date: 18-May-2011
 */
public class UC086ReprintReportsUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant AUTH_LST_DIALOG_YES. */
    public static final String AUTH_LST_DIALOG_YES = "Yes";
    
    /** The Constant AUTH_LST_DIALOG_NO. */
    public static final String AUTH_LST_DIALOG_NO = "No";
    
    /** The Constant AUTH_LST_DIALOG_CANCEL. */
    public static final String AUTH_LST_DIALOG_CANCEL = "Cancel";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button (is Cancel button in this screen)
    private String mBTN_CLOSE_SCREEN = "Status_CloseButton";

    /** The btn reprint report. */
    // Private button identifiers
    private String BTN_REPRINT_REPORT = "Reports_RunReportButton";

    /** The grid reports. */
    // Private grid identifiers
    private String GRID_REPORTS = "ReportsGrid";

    /** The popup progress ind. */
    private String POPUP_PROGRESS_IND = "CaseMan_AsyncMonitorPopup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC086ReprintReportsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Reprint Reports";
    }

    /**
     * Clicks the Reprint button which reprints the currently selected report.
     */
    public void clickReprintButton ()
    {
        mClickButton (BTN_REPRINT_REPORT);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the Close Button in the status bar to return to the main menu
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Gets the number reports for reprint.
     *
     * @return the number reports for reprint
     */
    public int getNumberReportsForReprint ()
    {
        return countGridRows (GRID_REPORTS);
    }

    /**
     * Indicates whether or not a specified value exists in a specified column
     * in the reports grid.
     *
     * @param pValue The String to search for in the grid
     * @param pCol The column number to search
     * @return True if the value is in the grid column, else false
     */
    public boolean isValueInResultsGrid (final String pValue, final int pCol)
    {
        return isValueInGridColumn (GRID_REPORTS, pValue, pCol);
    }

    /**
     * Selects the row in the reports grid that matches the Report Name specified.
     *
     * @param pReportName The name of the Report to search for
     */
    public void selectRecordByReportName (final String pReportName)
    {
        selectValueFromGrid (GRID_REPORTS, pReportName, 4);
    }

    /**
     * Selects a row in the reports grid by row number specified.
     *
     * @param rowNumber The row number to select (starts from 1)
     */
    public void selectRecordByRowNumber (final int rowNumber)
    {
        final GridAdaptor reportsGrid = cMB.getGridAdaptor (GRID_REPORTS);
        reportsGrid.clickRow (rowNumber);
    }

    /**
     * Double clicks on the Authorisation List row and responds to the framework
     * dialog popup accordingly.
     * 
     * @param response The response for the popup (Yes, No or Cancel)
     */
    public void reprintAuthorisationList (final String response)
    {
        selectRecordByReportName ("Authorisation List");
        clickReprintButton ();
        clickFrameworkDialogButton (response);
        if (UC086ReprintReportsUtils.AUTH_LST_DIALOG_YES.equals (response))
        {
            // User has opted to reprint all AE Start of Day Items, wait for the Async Monitor to close
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
                // Might get alerts after checks have been made
                while (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                    cMB.waitForPageToLoad ();
                }

                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
            }
        }
    }

}