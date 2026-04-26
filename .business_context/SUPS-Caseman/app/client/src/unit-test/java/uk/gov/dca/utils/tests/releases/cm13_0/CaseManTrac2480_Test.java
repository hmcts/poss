/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9357 $
 * $Author: vincentcp $
 * $Date: 2012-01-05 10:09:53 +0000 (Thu, 05 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC096AEFeesRefundsUtils;

/**
 * Automated tests for the CaseMan Defect 2480. This covers a change to the Manage AE Events screen to
 * test users belonging to and not to the AE Issuing Court
 *
 * @author Des Johnston
 */
public class CaseManTrac2480_Test extends AbstractCmTestBase
{
    
    /** The my UC 096 AE fees refunds utils. */
    // Private member variables for the screen utils
    private UC096AEFeesRefundsUtils myUC096AEFeesRefundsUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The case number A. */
    private String caseNumberA = "0NN00001";
    
    /** The case number B. */
    private String caseNumberB = "0AB00001";

    /** The wrong issuing court error message. */
    // Error messages displayed in the status bar
    private String wrongIssuingCourtErrorMessage =
            "You can only maintain fees for an Attachment of Earnings issued at your court.";

    /**
     * Constructor.
     */
    public CaseManTrac2480_Test ()
    {
        super (CaseManTrac2480_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC096AEFeesRefundsUtils = new UC096AEFeesRefundsUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that a Northampton user can navigate to the AE Fees and Refunds screen with
     * an AE that was issued by Northampton.
     */
    public void testAECourt ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load an AE record issued by Northampton
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumberA);

            // Navigate to the Fees/Refunds screen via quick links menu
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_AE_FEES);

            // Check in Fees/Refunds screen
            mCheckPageTitle (myUC096AEFeesRefundsUtils.getScreenTitle ());

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a Northampton user cannot navigate to the AE Fees and Refunds screen with
     * an AE that was not issued by Northampton.
     */
    public void testNonAECourt ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Clear the Court Code field
            myUC092AEEventUtils.setCourtCode ("");

            // Load an AE record NOT issued by Northampton
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumberB);

            // Navigate to the Fees/Refunds screen via quick links menu
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_AE_FEES);

            // Check that still on the AE Events screen (i.e. no navigation)
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (wrongIssuingCourtErrorMessage);

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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}
