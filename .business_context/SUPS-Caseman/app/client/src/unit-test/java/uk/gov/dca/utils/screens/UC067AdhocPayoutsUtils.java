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
 * Screen utility class representing the Record Adhoc Payout screen.
 *
 * Date: 19-May-2011
 */
public class UC067AdhocPayoutsUtils extends AbstractSuitorsCashScreenUtils
{
    
    /** The m BT N SEARC H ENF. */
    // Button fields
    private String mBTN_SEARCH_ENF = "Header_SearchBtn";
    
    /** The m BT N SAV E SCREEN. */
    private String mBTN_SAVE_SCREEN = "Status_SaveBtn";
    
    /** The m BT N CLEA R SCREEN. */
    private String mBTN_CLEAR_SCREEN = "Status_ClearBtn";
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The m SE L PAYOU T REASON. */
    // Text fields
    private String mSEL_PAYOUT_REASON = "Payout_Reason";

    /** The m POPU P LO V SEARCH. */
    // Popup Components
    private String mPOPUP_LOV_SEARCH = "Lov_SearchResults";

    /** The m GRI D LO V SEARCH. */
    // Grid fields
    private String mGRID_LOV_SEARCH = "Lov_SearchResults_grid";

    /** The Constant ADHOC_REASON_ERROR. */
    // Adhoc Payout Reasons
    public static final String ADHOC_REASON_ERROR = "PAID IN ERROR";
    
    /** The Constant ADHOC_REASON_PAYOUT. */
    public static final String ADHOC_REASON_PAYOUT = "ADHOC PAYOUT";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC067AdhocPayoutsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Record Adhoc Payout";
    }

    /**
     * Enters an enforcement number and enforcement type then loads the record on the screen.
     * Assumes initial focus is set in the Enforcement number field.
     *
     * @param enfNumber The enforcement number
     * @param enfType The enforcement type
     */
    public void loadEnforcement (final String enfNumber, final String enfType)
    {
        // Enter the enforcement number and enforcement type
        setTextFieldValue (mTEXT_ENF_NUMBER, enfNumber);
        setSelectFieldValue (mSEL_ENF_TYPE, enfType);
        mClickButton (mBTN_SEARCH_ENF);
        cMB.waitForPageToLoad ();

        // Handle the search results popup if multiple results
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (mPOPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            // Multiple payment records returned and displayed in a popup, select the first payment in the list
            final GridAdaptor resultsGrid = cMB.getGridAdaptor (mGRID_LOV_SEARCH);
            resultsGrid.doubleClickRow (1);
            cMB.waitForPageToLoad ();
        }

        // Handle any alerts that may appear
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Sets the payout reason.
     *
     * @param pReason the new payout reason
     */
    public void setPayoutReason (final String pReason)
    {
        setSelectFieldValue (mSEL_PAYOUT_REASON, pReason);
    }

    /**
     * Clicks the Save button.
     */
    public void saveScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (mBTN_SAVE_SCREEN);

        // Wait for screen to clear
        cMB.waitForPageToLoad ();

        // Handle the alert popup for the new transaction number
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
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

    /**
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        // mClickButton (mBTN_CLEAR_SCREEN);
        cMB.getButtonAdaptor (mBTN_CLEAR_SCREEN).click ();
        cMB.chooseCancelOnNextConfirmation ();
        cMB.waitForPageToLoad ();
    }
}