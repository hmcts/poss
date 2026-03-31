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
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;

/**
 * Automated tests for the Coded Party range changes on the Resolve overpayments screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_ResolveOverpayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 063 resolve overpayment utils. */
    // Private member variables for the screen utils
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_ResolveOverpayments_Test ()
    {
        super (CaseMan_NCP_ResolveOverpayments_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
    }

    /**
     * Tests that the Resolve Overpayments screen handles updating of payments on Foreign Warrants
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
            myUC063ResolveOverpaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            for (int i = 0, l = warrantNos.length; i < l; i++)
            {
                System.out.println ("Resolve Overpayments Test - FW No: " + warrantNos[i]);

                // Load Foreign Warrant Payment with an overpaymentb recorded
                myUC063ResolveOverpaymentUtils.loadEnforcement (warrantNos[i],
                        AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

                // Save to resolve overpayment
                myUC063ResolveOverpaymentUtils.saveScreen ();
            }

            // Exit Resolve Overpayments screen
            myUC063ResolveOverpaymentUtils.closeScreen ();
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