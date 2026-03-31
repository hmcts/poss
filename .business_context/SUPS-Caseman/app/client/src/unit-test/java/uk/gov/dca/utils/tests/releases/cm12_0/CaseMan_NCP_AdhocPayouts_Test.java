/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 * Change history
 * 29/07/2009 - Chris Vincent: Outstanding Payment validation checks removed (TRAC 1155)
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm12_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC067AdhocPayoutsUtils;

/**
 * Automated tests for the Coded Party range changes on the Adhoc Payouts screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_AdhocPayouts_Test extends AbstractCmTestBase
{
    
    /** The my UC 067 adhoc payouts utils. */
    // Private member variables for the screen utils
    private UC067AdhocPayoutsUtils myUC067AdhocPayoutsUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_AdhocPayouts_Test ()
    {
        super (CaseMan_NCP_AdhocPayouts_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC067AdhocPayoutsUtils = new UC067AdhocPayoutsUtils (this);
    }

    /**
     * Tests that the Adhoc Payouts screen handles updating of payments on Foreign Warrants
     * linked to National Coded Parties.
     */
    public void testResolveOverpayments ()
    {
        try
        {
            final String[] warrantNos = {"FWZ00001", "FWZ00002", "FWZ00003", "FWZ00004", "FWZ00005", "FWZ00006",
                    "FWZ00007", "FWZ00008", "FWZ00009", "FWZ00010", "FWZ00011", "FWZ00012", "FWZ00013", "FWZ00014",
                    "FWZ00015", "FWZ00016", "FWZ00017", "FWZ00018", "FWZ00019", "FWZ00020", "FWZ00021"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC067AdhocPayoutsUtils.bypassStartOfDay ("282");

            // Navigate to the Adhoc Payouts screen
            this.nav.navigateFromMainMenu (MAINMENU_ADHOC_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());

            for (int i = 0, l = warrantNos.length; i < l; i++)
            {
                System.out.println ("Adhoc Payouts Test - FW No: " + warrantNos[i]);

                // Load Foreign Warrant Payment
                myUC067AdhocPayoutsUtils.loadEnforcement (warrantNos[i],
                        AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

                // Adhoc Payout
                myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_PAYOUT);

                // Save
                myUC067AdhocPayoutsUtils.saveScreen ();
            }

            // Exit Resolve Overpayments screen
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

}