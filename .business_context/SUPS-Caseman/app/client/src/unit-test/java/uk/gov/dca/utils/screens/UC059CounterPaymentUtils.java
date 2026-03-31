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
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Create Counter Payments screen.
 *
 * Date: 26-Jun-2009
 */
public class UC059CounterPaymentUtils extends AbstractSuitorsCashScreenUtils
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

    /** The m TEX T AMOUNT. */
    // Text fields
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
    public UC059CounterPaymentUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create Counter Payments";
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
     * Checks if is payee code valid.
     *
     * @return true, if is payee code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPayeeCodeValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_PAYEE_CODE);
        return tA.isValid ();
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
     * Checks if is payee name read only.
     *
     * @return true, if is payee name read only
     * @throws FrameworkException the framework exception
     */
    public boolean isPayeeNameReadOnly () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_PAYEE_NAME);
        return tA.isReadOnly ();
    }

    /**
     * Clicks the Save Button to create a new payment. The new transaction number
     * is then returned.
     *
     * @return The transaction number
     */
    public String saveScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (mBTN_SAVE_SCREEN);

        // Wait for screen to clear
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