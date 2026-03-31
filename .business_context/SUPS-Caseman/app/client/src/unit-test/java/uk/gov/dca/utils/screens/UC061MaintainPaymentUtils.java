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
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain Payments screen.
 *
 * Date: 26-Jun-2009
 */
public class UC061MaintainPaymentUtils extends AbstractSuitorsCashScreenUtils
{
    
    /** The m BT N SEARC H ENF. */
    // Button fields
    private String mBTN_SEARCH_ENF = "Header_SearchBtn";
    
    /** The m BT N SAV E SCREEN. */
    private String mBTN_SAVE_SCREEN = "Status_SaveBtn";
    
    /** The m POPU P LO V OK. */
    private String mPOPUP_LOV_OK = "Lov_SearchResults_okButton";
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";
    
    /** The m BT N CLEA R SCREEN. */
    private String mBTN_CLEAR_SCREEN = "Status_ClearBtn";

    /** The m TEX T TRAN S NUMBER. */
    // Text fields
    private String mTEXT_TRANS_NUMBER = "Header_TransactionNumber";
    
    /** The m TEX T AMOUNT. */
    private String mTEXT_AMOUNT = "Payment_Amount";
    
    /** The m SE L PAYMEN T TYPE. */
    private String mSEL_PAYMENT_TYPE = "Payment_Type";
    
    /** The m SE L RETENTIO N TYPE. */
    private String mSEL_RETENTION_TYPE = "Payment_RetentionType";
    
    /** The m TEX T PAYE E CODE. */
    private String mTEXT_PAYEE_CODE = "Payee_PartyCode";
    
    /** The m TEX T PAYE E NAME. */
    private String mTEXT_PAYEE_NAME = "Payee_Name";

    /** The m POPU P LO V SEARCH. */
    // Popup Components
    private String mPOPUP_LOV_SEARCH = "Lov_SearchResults";

    /** The m GRI D LO V SEARCH. */
    // Grid fields
    private String mGRID_LOV_SEARCH = "Lov_SearchResults_grid";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC061MaintainPaymentUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Payments";
    }

    /**
     * {@inheritDoc}
     */
    public void setEnforcementNumber (final String enfNumber)
    {
        setTextFieldValue (mTEXT_ENF_NUMBER, enfNumber);
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
     * {@inheritDoc}
     */
    public void setEnforcementType (final String enfType)
    {
        setSelectFieldValue (mSEL_ENF_TYPE, enfType);
    }

    /**
     * Gets the enforcement type.
     *
     * @return the enforcement type
     */
    public String getEnforcementType ()
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (mSEL_ENF_TYPE);
        return sA.getSelectedLabel ();
    }

    /**
     * Sets the transaction number.
     *
     * @param transNumber the new transaction number
     */
    public void setTransactionNumber (final String transNumber)
    {
        setTextFieldValue (mTEXT_TRANS_NUMBER, transNumber);
    }

    /**
     * Gets the transaction number.
     *
     * @return the transaction number
     */
    public String getTransactionNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_TRANS_NUMBER);
        return tA.getValue ();
    }

    /**
     * Clicks the Search button.
     */
    public void clickSearchButton ()
    {
        mClickButton (mBTN_SEARCH_ENF);
        cMB.waitForPageToLoad ();
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
     * Sets the payment amount.
     *
     * @param pAmount the new payment amount
     */
    public void setPaymentAmount (final String pAmount)
    {
        cMB.type (mTEXT_AMOUNT, pAmount);

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Sets the payment type.
     *
     * @param pPaymentType the new payment type
     */
    public void setPaymentType (final String pPaymentType)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (mSEL_PAYMENT_TYPE);
        sA.clickValue (pPaymentType);
    }

    /**
     * Sets the retention type.
     *
     * @param pRetentionType the new retention type
     */
    public void setRetentionType (final String pRetentionType)
    {
        setSelectFieldValue (mSEL_RETENTION_TYPE, pRetentionType);
    }

    /**
     * Sets the payee code.
     *
     * @param pCode the new payee code
     */
    public void setPayeeCode (final String pCode)
    {
        setTextFieldValue (mTEXT_PAYEE_CODE, pCode);
    }

    /**
     * Gets the payee code.
     *
     * @return the payee code
     */
    public String getPayeeCode ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_PAYEE_CODE);
        return tA.getValue ();
    }

    /**
     * Gets the payee name.
     *
     * @return the payee name
     */
    public String getPayeeName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_PAYEE_NAME);
        return tA.getValue ();
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
     * Selects the row in the search payments popup grid that matches the Enforcement Type specified
     * and clicks the Ok button to Close the popup.
     *
     * @param pEnforcementType The Enforcement Type to search for
     */
    public void selectEnforcementByType (final String pEnforcementType)
    {
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (mPOPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            selectValueFromGrid (mGRID_LOV_SEARCH, pEnforcementType, 1);
            mClickButton (mPOPUP_LOV_OK);
            cMB.waitForPageToLoad ();

            // Handle any alerts that may appear
            while (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
                cMB.waitForPageToLoad ();
            }
        }
    }

    /**
     * Selects the row in the search payments popup grid that matches the Transaction Number specified
     * and clicks the Ok button to Close the popup.
     *
     * @param pTransactionNo The Transaction Number to search for
     */
    public void selectEnforcementByTransNo (final String pTransactionNo)
    {
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (mPOPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            selectValueFromGrid (mGRID_LOV_SEARCH, pTransactionNo, 2);
            mClickButton (mPOPUP_LOV_OK);
            cMB.waitForPageToLoad ();

            // Handle any alerts that may appear
            while (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
                cMB.waitForPageToLoad ();
            }
        }
    }

    /**
     * Selects the row in the search payments popup grid that matches the Enforcement Number specified
     * and clicks the Ok button to Close the popup.
     *
     * @param pEnforcementNo The Enforcement Number to search for
     */
    public void selectEnforcementByNumber (final String pEnforcementNo)
    {
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (mPOPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            selectValueFromGrid (mGRID_LOV_SEARCH, pEnforcementNo, 3);
            mClickButton (mPOPUP_LOV_OK);
            cMB.waitForPageToLoad ();

            // Handle any alerts that may appear
            while (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
                cMB.waitForPageToLoad ();
            }
        }
    }
}