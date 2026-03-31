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
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Full Enquiry on Home Case screen.
 *
 * Date: 19-Jun-2013
 */
public class UC021DPAFullCaseUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";

    /** The text case number. */
    // Text fields
    private String TEXT_CASE_NUMBER = "CaseNumber";

    /** The m BT N RU N REPORT. */
    // Button fields
    private String mBTN_RUN_REPORT = "Status_RunReportButton";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The popup progress ind. */
    // Private popup identifiers
    private String POPUP_PROGRESS_IND = "ProgressIndicator_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC021DPAFullCaseUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Full Enquiry on Home Case";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        setTextFieldValue (TEXT_CASE_NUMBER, pCaseNumber);
        cMB.waitForPageToLoad ();
    }

    /**
     * Checks if is case number valid.
     *
     * @return true, if is case number valid
     * @throws Exception the exception
     */
    public boolean isCaseNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Case Number field.
     */
    public void setCaseNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).focus ();
    }

    /**
     * Clicks the Run Report Button.
     */
    public void runReport ()
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (mBTN_RUN_REPORT).click ();
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