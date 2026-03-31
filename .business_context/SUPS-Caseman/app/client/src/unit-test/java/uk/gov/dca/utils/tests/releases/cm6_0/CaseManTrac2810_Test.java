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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.NavigationProperties;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;

/**
 * Automated tests for the CaseMan Defect 2810. This covers navigation from the Case Events screen
 * to the Transfer Cases screen using the F8 function key.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2810_Test extends AbstractCmTestBase
{

    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The outstanding warrant error message. */
    // Error messages displayed in the status bar
    private String outstandingWarrantErrorMessage = "Cannot transfer, warrant is outstanding.";

    /** Northampton Case has a Judgment, AE and Home Warrant which is Live. */
    private String testCaseNumberLiveWarrant = "9NN00001";

    /**
     * Northampton Case has a Judgment, AE and Home Warrant which is Not Live
     * but a Foreign Warrant executed by Coventry which is Live.
     */
    private String testCaseNumberNonLiveWarrant = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac2810_Test ()
    {
        super (CaseManTrac2810_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);

    }

    /**
     * Checks that a user can navigate from the Case Events screen to the Transfer Cases screen
     * with using the F8 key.
     */
    public void testCaseEventsF8Navigation1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumberNonLiveWarrant);

            // Navigate to the Transfer Cases screen via F8 key
            this.nav.pressKey (NavigationProperties.KEY_F8);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen via F4 key to return to Case Events
            this.nav.pressKey (NavigationProperties.KEY_F4);

            // Check are in Case Events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that the validation in place to prevent navigating from Case Events to
     * the Transfer Case screen when there is an outstanding Warrant still works when
     * the user attempts to navigate using the F8 key.
     */
    public void testCaseEventsF8Navigation2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which has warrants outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumberLiveWarrant);

            // Attempt to navigate to the Transfer Cases screen via F8 key with a case that has outstanding warrants
            this.nav.pressKey (NavigationProperties.KEY_F8);

            // Check that still on the Case Events screen (i.e. no navigation)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (outstandingWarrantErrorMessage);

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