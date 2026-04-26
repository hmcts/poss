/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mistryn $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm11_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;

/**
 * Automated tests for the CaseMan Defect 3627.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3627_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;
    
    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;

    /** The ae number 1. */
    // Test Data
    private String aeNumber1 = "282Y0001";

    /**
     * Constructor.
     */
    public CaseManTrac3627_Test ()
    {
        super (CaseManTrac3627_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
    }

    /**
     * Checks that when attempting to resolve an overpayment on an AE, the user is unable to
     * change the Overpayee Name to the same value as the Payee Name.
     */
    public void testOverpayeeNameValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (aeNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Create the payment, overpaying by 1.01
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("1066.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            System.out.println ("Transaction Number " + transactionNumber + " created.");

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            myUC063ResolveOverpaymentUtils.setOverpayeeName ("CLAIMANT ONE NAME");
            assertFalse ("Overpayee Name is valid when should be invalid",
                    myUC063ResolveOverpaymentUtils.isOverpayeeNameValid ());
            myUC063ResolveOverpaymentUtils.setOverpayeeNameFocus ();
            mCheckStatusBarText (UC063ResolveOverpaymentUtils.ERROR_INVALID_OVERPAY_NAME);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private function which checks the current screen title against the expected screen title.
     *
     * @param control The expected screen title
     */
    private void mCheckPageTitle (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getPageTitle ().indexOf (control) != -1);
    }

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status bar text does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}