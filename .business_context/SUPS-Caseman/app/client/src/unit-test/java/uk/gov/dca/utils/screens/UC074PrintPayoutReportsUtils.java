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
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Print Payout Reports screen.
 *
 * Date: 18-May-2011
 */
public class UC074PrintPayoutReportsUtils extends AbstractSuitorsCashScreenUtils
{
    
    /** The btn payable orders. */
    // Button fields
    private String BTN_PAYABLE_ORDERS = "PayableOrder_Button";
    
    /** The btn payable order sub ok. */
    private String BTN_PAYABLE_ORDER_SUB_OK = "PayableOrder_OkButton";
    
    /** The btn complete payout. */
    private String BTN_COMPLETE_PAYOUT = "PayableOrderSchedule_Button";
    
    /** The btn complete payout ok. */
    private String BTN_COMPLETE_PAYOUT_OK = "PayableOrderSchedule_OkButton";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The txt po number. */
    private String TXT_PO_NUMBER = "PayableOrder_PONumber";

    /** The sub payable orders. */
    // Private subform identifiers
    private String SUB_PAYABLE_ORDERS = "payableOrderSubform";
    
    /** The sub complete payout. */
    private String SUB_COMPLETE_PAYOUT = "payableOrderScheduleSubform";

    /** The new payable order subform. */
    private SubFormAdaptor newPayableOrderSubform = null;
    
    /** The new complete payout subform. */
    private SubFormAdaptor newCompletePayoutSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC074PrintPayoutReportsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Print Payout Reports";
    }

    /**
     * Runs the Payable Orders by loading the subform and clicking Ok.
     *
     * @param poNumber The initial Payable Order Number to use
     * @throws FrameworkException Exception thrown if unable to load Subform object
     */
    public void runPayableOrders (final String poNumber) throws FrameworkException
    {
        // Retrieve the Subform Object
        if (null == newPayableOrderSubform)
        {
            newPayableOrderSubform = cMB.getSubFormAdaptor (SUB_PAYABLE_ORDERS);
        }

        // Raise the Subform by clicking the button
        mClickButton (BTN_PAYABLE_ORDERS);
        cMB.waitForPageToLoad ();

        // Providing the Subform is visible, set the PO Number and Close the Subform
        if (null != newPayableOrderSubform && newPayableOrderSubform.isVisible ())
        {
            ((TextInputAdaptor) newPayableOrderSubform.getAdaptor (TXT_PO_NUMBER)).type (poNumber);

            ((ButtonAdaptor) newPayableOrderSubform.getAdaptor (BTN_PAYABLE_ORDER_SUB_OK)).click ();
        }

        // Loop until subform is no longer visible
        while (newPayableOrderSubform.isVisible ())
        {
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Completes the Payout by running the notification schedules.
     *
     * @throws FrameworkException Exception thrown if unable to load Subform object
     */
    public void completePayout () throws FrameworkException
    {
        // Retrieve the Subform Object
        if (null == newCompletePayoutSubform)
        {
            newCompletePayoutSubform = cMB.getSubFormAdaptor (SUB_COMPLETE_PAYOUT);
        }

        // Raise the Subform by clicking the button
        mClickButton (BTN_COMPLETE_PAYOUT);
        cMB.waitForPageToLoad ();

        // Providing the Subform is visible, confirm the payout completion
        if (null != newCompletePayoutSubform && newCompletePayoutSubform.isVisible ())
        {
            ((ButtonAdaptor) newCompletePayoutSubform.getAdaptor (BTN_COMPLETE_PAYOUT_OK)).click ();
        }

        // Loop until subform is no longer visible
        while (newCompletePayoutSubform.isVisible ())
        {
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
}