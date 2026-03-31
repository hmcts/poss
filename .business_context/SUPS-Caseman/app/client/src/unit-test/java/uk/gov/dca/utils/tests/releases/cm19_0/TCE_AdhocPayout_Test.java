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
import uk.gov.dca.utils.screens.UC067AdhocPayoutsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Record Adhoc Payouts screen.
 *
 * @author Chris Vincent
 */
public class TCE_AdhocPayout_Test extends AbstractCmTestBase
{
    
    /** The my UC 067 adhoc payouts utils. */
    // Private member variables for the screen utils
    private UC067AdhocPayoutsUtils myUC067AdhocPayoutsUtils;

    /** The home execution warrant. */
    private String homeExecutionWarrant = "1A000016";
    
    /** The foreign execution warrant. */
    private String foreignExecutionWarrant = "1A000017";
    
    /** The home control warrant. */
    private String homeControlWarrant = "1A000018";
    
    /** The foreign control warrant. */
    private String foreignControlWarrant = "1A000019";

    /**
     * Constructor.
     */
    public TCE_AdhocPayout_Test ()
    {
        super (TCE_AdhocPayout_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC067AdhocPayoutsUtils = new UC067AdhocPayoutsUtils (this);
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
            myUC067AdhocPayoutsUtils.loadEnforcement (homeExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Error off the payment
            myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_ERROR);
            myUC067AdhocPayoutsUtils.saveScreen ();

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (homeExecutionWarrant, "282"));

            // Load Control home warrant
            myUC067AdhocPayoutsUtils.loadEnforcement (homeControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Error off the payment
            myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_ERROR);
            myUC067AdhocPayoutsUtils.saveScreen ();

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (homeControlWarrant, "282"));

            // Load execution foreign warrant
            myUC067AdhocPayoutsUtils.loadEnforcement (foreignExecutionWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Error off the payment
            myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_ERROR);
            myUC067AdhocPayoutsUtils.saveScreen ();

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (foreignExecutionWarrant, "282"));

            // Load control foreign warrant
            myUC067AdhocPayoutsUtils.loadEnforcement (foreignControlWarrant,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Error off the payment
            myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_ERROR);
            myUC067AdhocPayoutsUtils.saveScreen ();

            // Check that a final return 101 (warrant paid in full) has been errored
            assertFalse ("Final return 101 exists", checkPaidInFullReturnExists (foreignControlWarrant, "282"));

            myUC067AdhocPayoutsUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan and navigates to the Record Adhoc Payouts screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Bypass the Start of Day process
        myUC067AdhocPayoutsUtils.bypassStartOfDay ("282");

        // Navigate to the Record Adhoc Payouts screen
        this.nav.navigateFromMainMenu (MAINMENU_ADHOC_PAYOUT_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());
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

}