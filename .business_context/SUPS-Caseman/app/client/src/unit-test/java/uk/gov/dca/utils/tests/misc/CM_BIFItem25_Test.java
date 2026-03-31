/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.misc;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC068PrintPrePayoutListUtils;
import uk.gov.dca.utils.screens.UC074PrintPayoutReportsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 4198 which concerns the availability of
 * certain reports in the reprint reports screen.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem25_Test extends AbstractCmTestBase
{
    
    /** The my UC 068 print pre payout list utils. */
    // Private member variables for the screen utils
    private UC068PrintPrePayoutListUtils myUC068PrintPrePayoutListUtils;
    
    /** The my UC 074 print payout reports utils. */
    private UC074PrintPayoutReportsUtils myUC074PrintPayoutReportsUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem25_Test ()
    {
        super (CM_BIFItem25_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC068PrintPrePayoutListUtils = new UC068PrintPrePayoutListUtils (this);
        myUC074PrintPayoutReportsUtils = new UC074PrintPayoutReportsUtils (this);
    }

    /**
     * Tests that the dividend payout lock from a previous date triggers a standard dialog popup.
     */
    public void testDividendPayoutLock ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_WOLVERHAMPTON, AbstractCmTestBase.ROLE_ADMIN);

            // Bypass Suitors Cash Start of Day
            myUC068PrintPrePayoutListUtils.bypassStartOfDay ("378");

            // Navigate to the Print Pre-Payout List screen
            this.nav.navigateFromMainMenu (MAINMENU_PRE_PAYOUT_LIST_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC068PrintPrePayoutListUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC068PrintPrePayoutListUtils.isStandardPopupVisible ());

            System.out.println (myUC068PrintPrePayoutListUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC068PrintPrePayoutListUtils.getStandardPopupMessage ()
                    .indexOf ("A Dividend Payout lock is currently in place from a previous date") != -1);

            myUC068PrintPrePayoutListUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();

            // Upon closing, should return us to the main menu
            // Navigate to the Print Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC074PrintPayoutReportsUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC074PrintPayoutReportsUtils.isStandardPopupVisible ());

            System.out.println (myUC074PrintPayoutReportsUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC074PrintPayoutReportsUtils.getStandardPopupMessage ()
                    .indexOf ("A Dividend Payout lock is currently in place from a previous date") != -1);

            myUC074PrintPayoutReportsUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the payout lock from a previous date triggers a standard dialog popup.
     */
    public void testPreviousPayoutLock ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC068PrintPrePayoutListUtils.bypassStartOfDay ("180");

            // Navigate to the Print Pre-Payout List screen
            this.nav.navigateFromMainMenu (MAINMENU_PRE_PAYOUT_LIST_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC068PrintPrePayoutListUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC068PrintPrePayoutListUtils.isStandardPopupVisible ());

            System.out.println (myUC068PrintPrePayoutListUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC068PrintPrePayoutListUtils.getStandardPopupMessage ()
                    .indexOf ("A Payout lock is currently in place from a previous date") != -1);

            myUC068PrintPrePayoutListUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();

            // Upon closing, should return us to the main menu
            // Navigate to the Print Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC074PrintPayoutReportsUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC074PrintPayoutReportsUtils.isStandardPopupVisible ());

            System.out.println (myUC074PrintPayoutReportsUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC074PrintPayoutReportsUtils.getStandardPopupMessage ()
                    .indexOf ("A Payout lock is currently in place from a previous date") != -1);

            myUC074PrintPayoutReportsUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the payout lock from today's date triggers a standard dialog popup.
     */
    public void testCurrentPayoutLock ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC068PrintPrePayoutListUtils.bypassStartOfDay ("282");

            // Insert payout lock for today's date
            DBUtil.insertScreenLock ("azwnn1", "PAY", "1", "282");

            // Navigate to the Print Pre-Payout List screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRE_PAYOUT_LIST_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC068PrintPrePayoutListUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC068PrintPrePayoutListUtils.isStandardPopupVisible ());

            System.out.println (myUC068PrintPrePayoutListUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC068PrintPrePayoutListUtils.getStandardPopupMessage ()
                    .indexOf ("The Payout is currently being run by another user") != -1);

            myUC068PrintPrePayoutListUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();

            // Upon closing, should return us to the main menu
            // Navigate to the Print Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC074PrintPayoutReportsUtils.getScreenTitle ());

            assertTrue ("Standard popup is not visible", myUC074PrintPayoutReportsUtils.isStandardPopupVisible ());

            System.out.println (myUC074PrintPayoutReportsUtils.getStandardPopupMessage ());

            assertTrue ("Dialog message is not as expected", myUC074PrintPayoutReportsUtils.getStandardPopupMessage ()
                    .indexOf ("The Payout is currently being run by another user") != -1);

            myUC074PrintPayoutReportsUtils.clickStandardPopupOK ();
            session.waitForPageToLoad ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the payout screens work ok when there is no lock in place.
     */
    public void testNoPayoutLock ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC068PrintPrePayoutListUtils.bypassStartOfDay ("282");

            // Navigate to the Print Pre-Payout List screen
            this.nav.navigateFromMainMenu (MAINMENU_PRE_PAYOUT_LIST_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC068PrintPrePayoutListUtils.getScreenTitle ());

            // With no lock in place, check can access the screen ok
            myUC068PrintPrePayoutListUtils.runReport ();

            session.waitForPageToLoad ();
            session.waitForPageToLoad ();
            session.waitForPageToLoad ();
            session.waitForPageToLoad ();
            session.waitForPageToLoad ();

            // Navigate to the Print Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC074PrintPayoutReportsUtils.getScreenTitle ());

            // With no lock in place, check can access the screen ok
            myUC074PrintPayoutReportsUtils.runPayableOrders ("100000");
            myUC074PrintPayoutReportsUtils.completePayout ();
            session.waitForPageToLoad ();
            myUC074PrintPayoutReportsUtils.closeScreen ();

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

}