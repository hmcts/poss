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
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Maintain Payments screen.
 *
 * @author Chris Vincent
 */
public class TCE_MaintainPayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 061 maintain payment utils. */
    // Private member variables for the screen utils
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;

    /** The home execution warrant. */
    private String homeExecutionWarrant = "1A000012";
    
    /** The hw execution payment. */
    private String hwExecutionPayment = "10000";
    
    /** The foreign execution warrant. */
    private String foreignExecutionWarrant = "1A000013";
    
    /** The fw execution payment. */
    private String fwExecutionPayment = "10001";
    
    /** The home control warrant. */
    private String homeControlWarrant = "1A000014";
    
    /** The hw control payment. */
    private String hwControlPayment = "10002";
    
    /** The foreign control warrant. */
    private String foreignControlWarrant = "1A000015";
    
    /** The fw control payment. */
    private String fwControlPayment = "10003";

    /**
     * Constructor.
     */
    public TCE_MaintainPayments_Test ()
    {
        super (TCE_MaintainPayments_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
    }

    /**
     * Tests that the maintenance of a Home Execution Warrant payment behaves as expected.
     */
    public void testMaintainHomeExecutionWarrant ()
    {
        try
        {
            // Get to the Maintain Payments screen
            mLoginAndNavigateToScreen ();

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by £1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (hwExecutionPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            myUC061MaintainPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by £1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has been marked as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (hwExecutionPayment, "282"));

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, so no longer overpaid
            myUC061MaintainPaymentUtils.setPaymentAmount ("189.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (hwExecutionPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            myUC061MaintainPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the maintenance of a Home Control Warrant payment behaves as expected.
     */
    public void testMaintainHomeControlWarrant ()
    {
        try
        {
            // Get to the Maintain Payments screen
            mLoginAndNavigateToScreen ();

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by £1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (hwControlPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            myUC061MaintainPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by £1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has been marked as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (hwControlPayment, "282"));

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, so no longer overpaid
            myUC061MaintainPaymentUtils.setPaymentAmount ("189.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (hwControlPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            myUC061MaintainPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the maintenance of a Foreign Execution Warrant payment behaves as expected.
     */
    public void testMaintainForeignExecutionWarrant ()
    {
        try
        {
            // Get to the Maintain Payments screen
            mLoginAndNavigateToScreen ();

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by £1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (fwExecutionPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist",
                    checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            myUC061MaintainPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by £1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has been marked as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (fwExecutionPayment, "282"));

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, so no longer overpaid
            myUC061MaintainPaymentUtils.setPaymentAmount ("189.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (fwExecutionPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            myUC061MaintainPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the maintenance of a Foreign Control Warrant payment behaves as expected.
     */
    public void testMaintainForeignControlWarrant ()
    {
        try
        {
            // Get to the Maintain Payments screen
            mLoginAndNavigateToScreen ();

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by £1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (fwControlPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            myUC061MaintainPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by £1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("191.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has been marked as an overpayment
            assertTrue ("Error, payment is not an overpayment.",
                    checkOverpaymentExistsOnPayment (fwControlPayment, "282"));

            // Load execution home warrant
            myUC061MaintainPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, so no longer overpaid
            myUC061MaintainPaymentUtils.setPaymentAmount ("189.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Check that the payment has not been marked as an overpayment
            assertFalse ("Error, payment is an overpayment.",
                    checkOverpaymentExistsOnPayment (fwControlPayment, "282"));

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            myUC061MaintainPaymentUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan and navigates to the Maintain Payments screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Bypass the Start of Day process
        myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

        // Navigate to the Maintain Payments screen
        this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());
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
                "wr.warrant_id = w.warrant_id AND " + "wr.return_code = '101' AND " + "wr.error_indicator = 'N'";

        return DBUtil.runDecodeTrueFalseQuery (query);
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

}