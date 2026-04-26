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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the CaseMan Defect 2607. This covers a change to the Transfer Cases
 * Outstanding Warrant validation on the Case Events, AE Events and Maintain Judgments. The
 * new validation will only check for outstanding Warrants owned by the Case's owning court.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2607_Test extends AbstractCmTestBase
{

    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;

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
    public CaseManTrac2607_Test ()
    {
        super (CaseManTrac2607_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        this.myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
        this.myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
        this.myUC092AEEventUtils = new UC092AEEventUtils (this);

    }

    /**
     * Checks that a user can navigate from the Case Events screen to the Transfer Cases screen
     * with the Outstanding Warrant validation in place.
     */
    public void testCaseEventsNavigation ()
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

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Case Events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has warrants outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumberLiveWarrant);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

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
     * Checks that a user can navigate from the AE Events screen to the Transfer Cases screen
     * with the Outstanding Warrant validation in place.
     */
    public void testAEEventsNavigation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load a record which can navigate to the Transfer Cases screen
            myUC092AEEventUtils.loadAEByCaseNumber (testCaseNumberNonLiveWarrant);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to AE Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in AE Events screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Clear the AE Events screen
            myUC092AEEventUtils.clearScreen ();

            // Load a record which has warrants outstanding
            myUC092AEEventUtils.loadAEByCaseNumber (testCaseNumberLiveWarrant);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check that still on the AE Events screen (i.e. no navigation)
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (outstandingWarrantErrorMessage);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a user can navigate from the Judgments screen to the Transfer Cases screen
     * with the Outstanding Warrant validation in place.
     */
    public void testJudgmentsNavigation ()
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

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Navigate to the Transfer Cases screen
            myUC004MaintainJudgmentUtils.navigateTransferCaseScreen ();

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Return to the Case Events screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check have returned to the case events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has warrants outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumberLiveWarrant);

            // Navigate back to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check are in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            myUC004MaintainJudgmentUtils.navigateTransferCaseScreen ();

            // Check that still on the Judgments screen (i.e. no navigation)
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

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