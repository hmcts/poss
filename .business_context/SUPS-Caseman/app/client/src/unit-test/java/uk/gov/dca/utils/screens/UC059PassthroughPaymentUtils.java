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
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Create Passthrough Payments screen.
 *
 * Date: 26-Jun-2009
 */
public class UC059PassthroughPaymentUtils extends AbstractSuitorsCashScreenUtils
{
    
    /** The m BT N SEARC H ENF. */
    // Button fields
    private String mBTN_SEARCH_ENF = "Header_SearchBtn";
    
    /** The m BT N AD D PASSTHROUGH. */
    private String mBTN_ADD_PASSTHROUGH = "Payment_AddPaymentBtn";
    
    /** The m BT N SAV E SCREEN. */
    private String mBTN_SAVE_SCREEN = "Status_SaveBtn";
    
    /** The m BT N CLEA R SCREEN. */
    private String mBTN_CLEAR_SCREEN = "Status_ClearBtn";
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";
    
    /** The m BT N POPU P SAVE. */
    private String mBTN_POPUP_SAVE = "Add_Payment_OkBtn";

    /** The m TEX T AMOUNT. */
    // Text fields
    private String mTEXT_AMOUNT = "Add_Payment_Amount";
    
    /** The m SE L PAI D TO. */
    private String mSEL_PAID_TO = "Add_Payment_PaidTo";
    
    /** The m CH K ERRO R FLAG. */
    private String mCHK_ERROR_FLAG = "Payment_Error";

    /** The m POPU P LO V SEARCH. */
    // Popup Components
    private String mPOPUP_LOV_SEARCH = "Lov_SearchResults";
    
    /** The pop add payment. */
    private String POP_ADD_PAYMENT = "Add_Payment";

    /** The m GRI D LO V SEARCH. */
    // Grid fields
    private String mGRID_LOV_SEARCH = "Lov_SearchResults_grid";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC059PassthroughPaymentUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create Update Passthrough";
    }

    /**
     * Gets the enforcement number.
     *
     * @return the enforcement number
     */
    public String getEnforcementNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_ENF_NUMBER);
        return tA.getValue ();
    }

    /**
     * Clicks the Add Passthrough button.
     */
    public void clickAddPassthroughButton ()
    {
        mClickButton (mBTN_ADD_PASSTHROUGH);
    }

    /**
     * Sets the adds the amount.
     *
     * @param pAmount the new adds the amount
     */
    public void setAddAmount (final String pAmount)
    {
        if (isAddPaymentPopupVisible ())
        {
            setTextFieldValue (mTEXT_AMOUNT, pAmount);
        }
    }

    /**
     * Sets the adds the paid to.
     *
     * @param pPaidTo the new adds the paid to
     */
    public void setAddPaidTo (final String pPaidTo)
    {
        if (isAddPaymentPopupVisible ())
        {
            setSelectFieldValue (mSEL_PAID_TO, pPaidTo);
        }
    }

    /**
     * Clicks the Save button on the Add Passthrough popup.
     */
    public void clickAddPassthroughSave ()
    {
        cMB.getButtonAdaptor (mBTN_POPUP_SAVE).click ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        cMB.waitForPageToLoad ();
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
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
            // Multiple enforcements returned and displayed in a popup, select the enforcement number requested
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
     * Enters an enforcement number, enforcement type and executing court code then loads
     * the record on the screen. Assumes initial focus is set in the Enforcement number field.
     *
     * @param enfNumber The enforcement number
     * @param enfType The enforcement type
     * @param exCourtCode The executing court code of the warrant
     */
    public void loadEnforcement (final String enfNumber, final String enfType, final String exCourtCode)
    {
        // Enter the enforcement number and enforcement type
        setTextFieldValue (mTEXT_ENF_NUMBER, enfNumber);
        setSelectFieldValue (mSEL_ENF_TYPE, enfType);
        setTextFieldValue (mTEXT_EX_COURT_CODE, exCourtCode);

        mClickButton (mBTN_SEARCH_ENF);
        cMB.waitForPageToLoad ();

        // Handle the search results popup if multiple results
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (mPOPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            // Multiple enforcements returned and displayed in a popup, select the enforcement number requested
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
     * Opens the Add Passthrough Payment popup and adds a new passthrough payment
     * and then returns the transaction number.
     *
     * @param pAmount The amount for the passthrough payment
     * @return The transaction number
     */
    public String addPassthroughPayment (final String pAmount)
    {
        // Click the Add Button to raise the popup
        mClickButton (mBTN_ADD_PASSTHROUGH);

        // Wait for popup to load
        cMB.waitForPageToLoad ();

        // Set the amount
        setTextFieldValue (mTEXT_AMOUNT, pAmount);

        // Handle any alerts
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        // Click Save in popup and wait for popup to close
        mClickButton (mBTN_POPUP_SAVE);
        cMB.waitForPageToLoad ();

        String transNo = "";
        String tempString;
        // Handle the alert popup for the new transaction number
        while (cMB.isAlertPresent ())
        {
            tempString = cMB.getAlertString ();
            if (tempString.indexOf ("Transaction number ") != -1)
            {
                // Found the alert informing user of new transaction number, assign
                // return value the third word in the alert message.
                transNo = tempString.split (" ")[2];
            }
            cMB.waitForPageToLoad ();
        }
        return transNo;
    }

    /**
     * Opens the Add Passthrough Payment popup and adds a new passthrough payment
     * and then returns the transaction number.
     *
     * @param pAmount The amount for the passthrough payment
     * @param pPaidTo The value to set the Paid To field
     * @return The transaction number
     */
    public String addPassthroughPayment (final String pAmount, final String pPaidTo)
    {
        // Click the Add Button to raise the popup
        mClickButton (mBTN_ADD_PASSTHROUGH);

        // Wait for popup to load
        cMB.waitForPageToLoad ();

        // Set the amount
        cMB.type (mTEXT_AMOUNT, pAmount);
        setSelectFieldValue (mSEL_PAID_TO, pPaidTo);

        // Handle any alerts
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }

        // Click Save in popup and wait for popup to close
        mClickButton (mBTN_POPUP_SAVE);
        cMB.waitForPageToLoad ();

        String transNo = "";
        String tempString;
        // Handle the alert popup for the new transaction number
        while (cMB.isAlertPresent ())
        {
            tempString = cMB.getAlertString ();
            if (tempString.indexOf ("Transaction number ") != -1)
            {
                // Found the alert informing user of new transaction number, assign
                // return value the third word in the alert message.
                transNo = tempString.split (" ")[2];
            }
            cMB.waitForPageToLoad ();
        }
        return transNo;
    }

    /**
     * Sets the error flag.
     *
     * @param inError the new error flag
     */
    public void setErrorFlag (final boolean inError)
    {
        // If parameter set to true, the checkbox must be set to checked
        setCheckboxFieldValue (mCHK_ERROR_FLAG, inError);
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

    /**
     * Checks if is adds the payment popup visible.
     *
     * @return true, if is adds the payment popup visible
     */
    public boolean isAddPaymentPopupVisible ()
    {
        final PopupAdaptor popup = cMB.getPopupAdaptor (POP_ADD_PAYMENT);
        return popup.isVisible ();
    }
}