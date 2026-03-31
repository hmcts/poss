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
 * Screen utility class representing the Run Order Printing screen.
 *
 * Date: 08-Jul-2009
 */
public class UC012RunOrderPrintingUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";

    /** The text case number. */
    // Private text field identifiers
    private String TEXT_CASE_NUMBER = "Main_CaseNumber";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close";

    /** The btn clear screen. */
    // Private button identifiers
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn popup print. */
    private String BTN_POPUP_PRINT = "Outputs_Popup_PrintButton";
    
    /** The btn popup printall. */
    private String BTN_POPUP_PRINTALL = "Outputs_Popup_PrintAllButton";
    
    /** The btn popup close. */
    private String BTN_POPUP_CLOSE = "Outputs_Popup_CloseButton";

    /** The grid popup cases. */
    // Private grid identifiers
    private String GRID_POPUP_CASES = "PrintableOutputs_Grid";

    /** The popup printable outputs. */
    // Private popup identifiers
    private String POPUP_PRINTABLE_OUTPUTS = "Outputs_Popup";

    /** The outputs popup. */
    // Private popup adaptor object
    private PopupAdaptor outputsPopup = null;

    /** The alert no printer. */
    // String representing the alert message displayed when user does not have a printer allocated
    private String ALERT_NO_PRINTER = "Cannot print.  User does not have a default printer allocated.";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC012RunOrderPrintingUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Run Order Printing";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        // Enter Case Number value
        cMB.type (TEXT_CASE_NUMBER, pCaseNumber);

        // Call search service
        cMB.waitForPageToLoad ();

        // Handle any alerts that may appear
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
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
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR_SCREEN);
    }

    /**
     * Clicks the Close Button on the Outputs popup.
     */
    public void closeOutputsPopup ()
    {
        // Check if popup is visible
        if (isPopupVisible ())
        {
            // Click the Close button and wait until the popup has closed
            mClickButton (BTN_POPUP_CLOSE);
            while (isPopupVisible ())
            {
                cMB.waitForPageToLoad ();
            }
        }
    }

    /**
     * Clicks the Print Button on the Outputs popup which prints the currently
     * selected output in the outputs grid.
     *
     * @throws RuntimeException Thrown if user does not have a default printer setup
     */
    public void printSelectedOutput () throws RuntimeException
    {
        // Check if popup is visible
        if (isPopupVisible ())
        {
            // Click the Print Button
            cMB.getButtonAdaptor (BTN_POPUP_PRINT).click ();

            // Handle scenario where user does not have a printer
            if (cMB.isAlertPresent () && cMB.getAlertString ().equals (ALERT_NO_PRINTER))
            {
                throw new RuntimeException (ALERT_NO_PRINTER);
            }
            else
            {
                // Wait while print service is called
                cMB.waitForPageToLoad ();

                // After printing will get an alert stating print complete, then will call the
                // search service again, which if no outputs remaining, could result in another
                // alert popup
                while (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                    cMB.waitForPageToLoad ();
                }
            }
        }
    }

    /**
     * Clicks the Print All button on the Outputs popup which prints every output
     * listed in the grid on the Outputs popup.
     *
     * @throws RuntimeException Thrown if user does not have a default printer setup
     */
    public void printAllOutputs () throws RuntimeException
    {
        // Check if popup is visible
        if (isPopupVisible ())
        {
            // Click the Print Button
            cMB.getButtonAdaptor (BTN_POPUP_PRINTALL).click ();

            // Handle scenario where user does not have a printer
            if (cMB.isAlertPresent () && cMB.getAlertString ().equals (ALERT_NO_PRINTER))
            {
                throw new RuntimeException (ALERT_NO_PRINTER);
            }
            else
            {
                // Wait while print service is called
                cMB.waitForPageToLoad ();

                // After printing will get an alert stating print complete, then will call the
                // search service again, which will result in no outputs remaining and another
                // alert popup stating no outputs remaining and the popup closing
                while (isPopupVisible ())
                {
                    if (cMB.isAlertPresent ())
                    {
                        cMB.getAlert ();
                    }
                    cMB.waitForPageToLoad ();
                }
            }
        }
    }

    /**
     * Selects a row in the outputs grid based upon a Case Number specified.
     *
     * @param pCaseNumber The case number to look for
     */
    public void selectOutputByCaseNumber (final String pCaseNumber)
    {
        // Check if the popup is visible
        if (isPopupVisible ())
        {
            selectValueFromGrid (GRID_POPUP_CASES, pCaseNumber);
        }
    }

    /**
     * Selects a row in the outputs grid based upon a Row Number specified.
     *
     * @param rowNumber The row number to click
     */
    public void selectOutputByRowNumber (final int rowNumber)
    {
        if (isPopupVisible ())
        {
            final GridAdaptor outputsGrid = cMB.getGridAdaptor (GRID_POPUP_CASES);
            outputsGrid.clickRow (rowNumber);
        }
    }

    /**
     * Checks if is popup visible.
     *
     * @return true, if is popup visible
     */
    public boolean isPopupVisible ()
    {
        if (null == outputsPopup)
        {
            outputsPopup = cMB.getPopupAdaptor (POPUP_PRINTABLE_OUTPUTS);
        }

        return outputsPopup.isVisible ();
    }
}