/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 *****************************************/

package uk.gov.dca.utils.tests.scalability;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC022DMSReportUtils;

/**
 * Automated tests for the scalabililty change to the DMS Report screen.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_DMSReportTest extends AbstractCmTestBase
{

    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 022 DMS report utils. */
    private UC022DMSReportUtils myUC022DMSReportUtils;

    /**
     * Constructor.
     */
    public CaseManScalability_DMSReportTest ()
    {
        super (CaseManScalability_DMSReportTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        this.myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        this.myUC022DMSReportUtils = new UC022DMSReportUtils (this);
    }

    /**
     * Basic test that the screen loads overdue obligations, clicks Next and Previous
     * to trigger the pagination, runs the Oracle Report, Navigates to Cases and
     * Case Events.
     */
    public void testDMSReportFunctionality ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the DMS Report screen
            this.nav.navigateFromMainMenu (MAINMENU_DMS_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());

            // Try to navigate to Cases and Case Events screen when Obligations not loaded
            // which should result in error message in status bar
            myUC022DMSReportUtils.navigateCasesScreen ();
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_NAV_NO_CASE);

            myUC022DMSReportUtils.navigateEventsScreen ();
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_NAV_NO_CASE);

            // Load overdue obligations
            myUC022DMSReportUtils.displayOverdueObligations ();

            // Click Next Button (test paging)
            myUC022DMSReportUtils.clickNextButton ();

            // Click Previous Button (test paging)
            myUC022DMSReportUtils.clickPreviousButton ();

            // Run the report
            myUC022DMSReportUtils.runDMSReport (true);

            // Select a specific case number row
            myUC022DMSReportUtils.selectObligationByCaseNumber ("9NN00003");

            // Navigate to Cases screen and back again, checking that right case is loaded
            myUC022DMSReportUtils.navigateCasesScreen ();
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());
            assertTrue ("Incorrect Case Number Loaded",
                    myUC001CreateUpdateCaseUtils.getCaseNumber ().indexOf ("9NN00003") != -1);
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Return to DMS Screen and click Next button to prove have returned to page 1 (check enablement)
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());
            assertTrue ("Returned to incorrect page", myUC022DMSReportUtils.isNextButtonEnabled ());
            myUC022DMSReportUtils.clickNextButton ();

            // Select a specific case number row
            myUC022DMSReportUtils.selectObligationByCaseNumber ("9NN00004");

            // Navigate to Case Events screen and back again, checking that right case is loaded
            myUC022DMSReportUtils.navigateEventsScreen ();
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
            assertTrue ("Incorrect Case Number Loaded",
                    myUC002CaseEventUtils.getCaseNumber ().indexOf ("9NN00004") != -1);
            myUC002CaseEventUtils.closeScreen ();

            // Return to DMS Screen and click Previous button to prove have returned to page 2 (check enablement)
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());
            assertTrue ("Returned to incorrect page", myUC022DMSReportUtils.isPreviousButtonEnabled ());
            myUC022DMSReportUtils.clickPreviousButton ();

            // Check that /ds/var/app xpath is cleared correctly on other screens
            myUC022DMSReportUtils.navigateEventsScreen ();
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.closeScreen ();

            // Should now be on Main Menu instead of back in the DMS Report screen
            mCheckPageTitle (MAIN_MENU_TITLE);

            // Navigate back into the DMS Report screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_DMS_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());

            // Check that data hasn't been loaded yet by attempting to navigate
            // This proves that the /ds/var/app xpath has been cleared
            myUC022DMSReportUtils.navigateCasesScreen ();
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_NAV_NO_CASE);

            // Exit screen
            myUC022DMSReportUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test screen sort order.
     */
    public void testScreenSortOrder ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the DMS Report screen
            this.nav.navigateFromMainMenu (MAINMENU_DMS_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());

            // Load overdue obligations
            myUC022DMSReportUtils.displayOverdueObligations ();

            // Check the expected values for the first row
            String testString = myUC022DMSReportUtils.getValueFromObligationsGrid (1, 1);
            assertTrue ("Incorrect Sort Order, row 1, column 1, expected 2, actual: " + testString,
                    testString.equals ("2"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (1, 2);
            assertTrue ("Incorrect Sort Order, row 1, column 2, expected 9NN00003, actual: " + testString,
                    testString.equals ("9NN00003"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (1, 3);
            assertTrue ("Incorrect Sort Order, row 1, column 3, expected 08-SEP-2008, actual: " + testString,
                    testString.equals ("08-SEP-2008"));

            // Check the expected values for the second row
            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (2, 1);
            assertTrue ("Incorrect Sort Order, row 1, column 1, expected 2, actual: " + testString,
                    testString.equals ("2"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (2, 2);
            assertTrue ("Incorrect Sort Order, row 1, column 2, expected 9NN00004, actual: " + testString,
                    testString.equals ("9NN00004"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (2, 3);
            assertTrue ("Incorrect Sort Order, row 1, column 3, expected 13-NOV-2008, actual: " + testString,
                    testString.equals ("13-NOV-2008"));

            // Check the expected values for the 20th row
            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (20, 1);
            assertTrue ("Incorrect Sort Order, row 1, column 1, expected 6, actual: " + testString,
                    testString.equals ("6"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (20, 2);
            assertTrue ("Incorrect Sort Order, row 1, column 2, expected 9NN00001, actual: " + testString,
                    testString.equals ("9NN00001"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (20, 3);
            assertTrue ("Incorrect Sort Order, row 1, column 3, expected 29-JAN-2009, actual: " + testString,
                    testString.equals ("29-JAN-2009"));

            // Check the expected values for the 21st row
            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (21, 1);
            assertTrue ("Incorrect Sort Order, row 1, column 1, expected 6, actual: " + testString,
                    testString.equals ("6"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (21, 2);
            assertTrue ("Incorrect Sort Order, row 1, column 2, expected 9NN00004, actual: " + testString,
                    testString.equals ("9NN00004"));

            testString = myUC022DMSReportUtils.getValueFromObligationsGrid (21, 3);
            assertTrue ("Incorrect Sort Order, row 1, column 3, expected 29-JAN-2009, actual: " + testString,
                    testString.equals ("29-JAN-2009"));

            // Exit screen
            myUC022DMSReportUtils.closeScreen ();

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