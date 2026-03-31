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

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Interim Report On Warrant - EX77 screen.
 *
 * Date: 09-Feb-2015
 */
public class UC048EX77ReportUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant WARNING_NO_RETURNS. */
    public static final String WARNING_NO_RETURNS =
            "Warning - there are no EX77 - interim reports to print for this return date.";
    
    /** The Constant WARNING_WELSH_PARTIES. */
    public static final String WARNING_WELSH_PARTIES =
            "Warning - at least one EX77 requires a translation to Welsh and cannot be bulk printed.\nPlease check your printer for copies that do require translation.";

    /** The m BT N RU N REPORT. */
    // Button fields
    private String mBTN_RUN_REPORT = "Status_RunReportButton";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The m CA L RETUR N DATE. */
    private String mCAL_RETURN_DATE = "Params_StartDate_Txt";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC048EX77ReportUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Interim Report On Warrant - EX77";
    }

    /**
     * Sets the return date.
     *
     * @param pDate the new return date
     */
    public void setReturnDate (final String pDate)
    {
        cMB.getDatePickerAdaptor (mCAL_RETURN_DATE).setDate (pDate);
    }

    /**
     * Clicks the Save button.
     */
    public void runReport ()
    {
        // Click the close button to exit the screen
        mClickButton (mBTN_RUN_REPORT);
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save button and returns the text from the alert popup.
     *
     * @return the string
     */
    public String runReportReturnAlertString ()
    {
        // Click the close button to exit the screen
        String returnValue = "";
        mClickButton (mBTN_RUN_REPORT);
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            returnValue = cMB.getAlertString ();
        }
        return returnValue;
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard and exiting the Payment screens can cause reports to be run
     * and locks to be removed from the database so need to wait for Main Menu to appear.
     */
    public void closeScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (this.mBTN_CLOSE_SCREEN);

        // Handle exit of screen
        String pageTitle = cMB.getPageTitle ();
        while ( !pageTitle.equals (MAIN_MENU_TITLE))
        {
            // Continue to wait while exit screen reports are run and locks removed until
            // have returned to the main menu
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }
    }
}