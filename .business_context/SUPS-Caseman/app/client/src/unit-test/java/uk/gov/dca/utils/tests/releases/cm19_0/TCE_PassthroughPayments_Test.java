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
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Create Passthrough Payments screen.
 *
 * @author Chris Vincent
 */
public class TCE_PassthroughPayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 passthrough payment utils. */
    // Private member variables for the screen utils
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;

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
    public TCE_PassthroughPayments_Test ()
    {
        super (TCE_PassthroughPayments_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
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
            myUC059PassthroughPaymentUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check popup is still open
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which pays off the full amount and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.00");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            // Load Execution Foreign Warrant
            myUC059PassthroughPaymentUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check popup is still open
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which pays off the full amount and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.00");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist",
                    checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059PassthroughPaymentUtils.closeScreen ();
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
            myUC059PassthroughPaymentUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check popup is still open
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which pays off the full amount and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.00");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            // Load Control Foreign Warrant
            myUC059PassthroughPaymentUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check popup is still open
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which pays off the full amount and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.00");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has been created
            assertTrue ("Final return 101 does not exist", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059PassthroughPaymentUtils.closeScreen ();
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
            myUC059PassthroughPaymentUtils.loadEnforcement (possessionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (possessionWarrant, "282"));

            // Load Delivery Warrant
            myUC059PassthroughPaymentUtils.loadEnforcement (deliveryWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (deliveryWarrant, "282"));

            // Load Committal Warrant
            myUC059PassthroughPaymentUtils.loadEnforcement (committalWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Open the Add Popup
            myUC059PassthroughPaymentUtils.clickAddPassthroughButton ();
            assertTrue ("Popup is not open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Enter an amount which results in an overpayment of 0.01 and click Save (popup should remain open)
            myUC059PassthroughPaymentUtils.setAddAmount ("190.01");
            myUC059PassthroughPaymentUtils.setAddPaidTo ("THE CLAIMANT");
            myUC059PassthroughPaymentUtils.clickAddPassthroughSave ();

            // Check that the payment has been accepted and the popup has closed
            assertFalse ("Popup is still open", myUC059PassthroughPaymentUtils.isAddPaymentPopupVisible ());

            // Check that a final return 101 (warrant paid in full) has NOT been created
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (committalWarrant, "282"));

            // Exit Create Postal Payments screen
            myUC059PassthroughPaymentUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan and navigates to the Create Passthrough Payments screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Bypass the Start of Day process
        myUC059PassthroughPaymentUtils.bypassStartOfDay ("282");

        // Navigate to the Create Passthrough Payments screen
        this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());
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