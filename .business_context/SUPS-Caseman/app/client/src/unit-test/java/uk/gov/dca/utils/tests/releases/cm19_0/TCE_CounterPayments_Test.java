/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Create Counter Payments screen.
 *
 * @author Chris Vincent
 */
public class TCE_CounterPayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 counter payment utils. */
    // Private member variables for the screen utils
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;

    /** The home execution warrant. */
    private String homeExecutionWarrant = "1A000001";
    
    /** The home control warrant. */
    private String homeControlWarrant = "1A000003";
    
    /** The foreign execution warrant. */
    private String foreignExecutionWarrant = "1A000002";
    
    /** The foreign control warrant. */
    private String foreignControlWarrant = "1A000004";
    
    /** The possession warrant. */
    private String possessionWarrant = "1A000009";
    
    /** The delivery warrant. */
    private String deliveryWarrant = "1A000010";
    
    /** The committal warrant. */
    private String committalWarrant = "1A000011";

    /**
     * Constructor.
     */
    public TCE_CounterPayments_Test ()
    {
        super (TCE_CounterPayments_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
    }

    /**
     * Tests that when an EXECUTION Warrant receives a new payment which overpays by £1 that the
     * payment is not recorded as an overpayment. Home and Foreign Warrants are tested.
     */
    public void testExecutionWarrantNonOverpayment ()
    {
        try
        {
            // Get to the Create Bailiff Payments screen
            mLoginAndNavigateToScreen ();

            // Load Execution Home Warrant
            myUC059CounterPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.00
            String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("191.00");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            // Load Execution Foreign Warrant
            myUC059CounterPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.00
            myUC059CounterPaymentUtils.setPaymentAmount ("191.00");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist",
                    checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an CONTROL Warrant receives a new payment which overpays by £1 that the
     * payment is not recorded as an overpayment. Home and Foreign Warrants are tested.
     */
    public void testControlHomeWarrantNonOverpayment ()
    {
        try
        {
            // Get to the Create Bailiff Payments screen
            mLoginAndNavigateToScreen ();

            // Load Control Home Warrant
            myUC059CounterPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.00
            String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("191.00");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            // Load Control Foreign Warrant
            myUC059CounterPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.00
            myUC059CounterPaymentUtils.setPaymentAmount ("191.00");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an EXECUTION Warrant receives a new payment which overpays by £1.01 that the
     * payment is recorded as an overpayment. Home and Foreign Warrants are tested.
     */
    public void testExecutionWarrantOverpayment ()
    {
        try
        {
            // Get to the Create Bailiff Payments screen
            mLoginAndNavigateToScreen ();

            // Load Execution Home Warrant
            myUC059CounterPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has been recorded as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            // Load Execution Foreign Warrant
            myUC059CounterPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.01
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has been recorded as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist",
                    checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an CONTROL Warrant receives a new payment which overpays by £1.01 that the
     * payment is recorded as an overpayment. Home and Foreign Warrants are tested.
     */
    public void testControlWarrantOverpayment ()
    {
        try
        {
            // Get to the Create Bailiff Payments screen
            mLoginAndNavigateToScreen ();

            // Load Control Home Warrant
            myUC059CounterPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has been recorded as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            // Load Control Foreign Warrant
            myUC059CounterPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.01
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has been recorded as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when POSSESSION, DELIVERY and COMMITTAL payments are overpaid by £1.01 that no overpayment
     * is recorded and no final return 101 is created.
     */
    public void testOtherWarrantOverpayments ()
    {
        try
        {
            // Get to the Create Bailiff Payments screen
            mLoginAndNavigateToScreen ();

            // Load Possession Warrant
            myUC059CounterPaymentUtils.loadEnforcement (possessionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (possessionWarrant, "282"));

            // Load Delivery Warrant
            myUC059CounterPaymentUtils.loadEnforcement (deliveryWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (deliveryWarrant, "282"));

            // Load Committal Warrant
            myUC059CounterPaymentUtils.loadEnforcement (committalWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            myUC059CounterPaymentUtils.setPaymentAmount ("191.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Check the payment has not been recorded as an overpayment
            assertFalse ("Error, payment has an overpayment.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (committalWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
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
     * Private function that logs the user into CaseMan and navigates to the Create Counter Payments screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Bypass the Start of Day process
        myUC059CounterPaymentUtils.bypassStartOfDay ("282");

        // Navigate to the Create Counter Payments screen
        this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());
    }

    /**
     * Private method to generate a query to check if an overpayment exists on a payment.
     *
     * @param pTransNo Transaction number
     * @param pCourtCode Court code
     * @return true if an overpayment exists, else false
     */
    private boolean checkOverpaymentExistsOnPayment (final String pTransNo, final String pCourtCode)
    {
        // Generate the query and run in the database
        final String query = "SELECT DECODE(P.Overpayment_Amount, null, 'false', 'true') FROM payments p WHERE " +
                "p.transaction_number = " + pTransNo + " AND " + "p.admin_court_code = " + pCourtCode;

        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Check that a final return 101 (paid in full) exists on a given warrant for a court.
     *
     * @param pWarrantNumber Warrant number to search for
     * @param pCourtCode Court code to search for
     * @return True if a final return 101 exists else false
     */
    private boolean checkPaidInFullReturnExists (final String pWarrantNumber, final String pCourtCode)
    {
        // Generate the query and run in the database
        final String query = "SELECT DECODE(COUNT(*), 0, 'false', 'true') FROM warrant_returns wr, warrants w WHERE " +
                "w.warrant_number = '" + pWarrantNumber + "' AND " + "w.currently_owned_by = " + pCourtCode + " AND " +
                "wr.warrant_id = w.warrant_id AND " + "wr.return_code = '101'";

        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}