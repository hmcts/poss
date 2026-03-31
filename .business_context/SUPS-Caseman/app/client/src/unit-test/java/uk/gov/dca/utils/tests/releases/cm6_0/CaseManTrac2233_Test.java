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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.screens.UC009MaintainObligationsUtils;

/**
 * Automated tests for the CaseMan Defect 2233. This covers the creation of the Certificate of
 * Satisfaction (N441A), and the variable data screen question asking which Judgment to address
 * the output to.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2233_Test extends AbstractCmTestBase
{

    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The my UC 009 maintain obligations utils. */
    private UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

    /** Northampton Case with two Defendants, both of which have Judgments against them. */
    private String testNonCCBCCase = "0NN00001";

    /** CCBC Case with one Defendant who has a Judgment against them. */
    private String testCCBCCase = "0QX00001";

    /** Northampton Case with one Defendant, who has a Satisfied Judgment against them. */
    private String testCaseWithSatisfiedJgmt = "0NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac2233_Test ()
    {
        super (CaseManTrac2233_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
    }

    /**
     * Tests the creation of the Certificate of Satisfaction (N441A) on a non CCBC Case and that
     * the variable data screen Judgments grid question is enabled and has the correct Judgment
     * selected.
     */
    public void testNonCCBCN441A ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case record
            myUC002CaseEventUtils.loadCaseByCaseNumber (testNonCCBCCase);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Select Judgment against first Defendant
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName ("DEFENDANT ONE NAME");

            // Set Date Paid in Full and Notification Receipt Date to today's date
            myUC004MaintainJudgmentUtils.setDatePaidInFull (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.setNotificationReceiptDate (AbstractBaseUtils.now ());

            // Click Save and loop until are in the Variable Data screen
            myUC004MaintainJudgmentUtils.clickSaveButton ();
            String screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals ("Enter Variable Data N441A"))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Check Judgment grid is enabled and correct Judgment is selected in grid
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgmentSelection",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "DEFENDANT ONE NAME", 2, this);

            String partyAgainst = vdQ1.getQuestionValue ();
            boolean isQuestionEnabled = vdQ1.isQuestionEnabled ();

            assertTrue ("Selected party against is not expected value", partyAgainst.equals ("DEFENDANT ONE NAME"));
            assertTrue ("Select Judgment grid is disabled when should be enabled", isQuestionEnabled);

            // Click Save on Variable data screen to return to the Maintain Judgments screen
            session.click (VARIABLE_DATA_SAVE_BUTTON);
            screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals (myUC004MaintainJudgmentUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Select Judgment against second Defendant
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName ("DEFENDANT TWO NAME");

            // Set Date Paid in Full and Notification Receipt Date to today's date
            myUC004MaintainJudgmentUtils.setDatePaidInFull (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.setNotificationReceiptDate (AbstractBaseUtils.now ());

            // Click Save and loop until are in the Variable Data screen
            myUC004MaintainJudgmentUtils.clickSaveButton ();
            screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals ("Enter Variable Data N441A"))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Check Judgment grid is enabled and correct Judgment is selected in grid
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgmentSelection",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "DEFENDANT TWO NAME", 2, this);

            partyAgainst = vdQ2.getQuestionValue ();
            isQuestionEnabled = vdQ2.isQuestionEnabled ();

            assertTrue ("Selected party against is not expected value", partyAgainst.equals ("DEFENDANT TWO NAME"));
            assertTrue ("Select Judgment grid is disabled when should be enabled", isQuestionEnabled);

            // Click Save on Variable data screen to return to the Maintain Judgments screen
            session.click (VARIABLE_DATA_SAVE_BUTTON);
            screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals (myUC004MaintainJudgmentUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of the Certificate of Satisfaction (N441A) on a CCBC Case and that
     * the variable data screen Judgments grid question is enabled and has the correct Judgment
     * selected.
     */
    public void testCCBCN441A ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case record
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCCBCCase);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Select Judgment against first Defendant
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName ("DEFENDANT ONE NAME");

            // Set Date Paid in Full and Notification Receipt Date to today's date
            myUC004MaintainJudgmentUtils.setDatePaidInFull (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.setNotificationReceiptDate (AbstractBaseUtils.now ());

            // Click Save (NO navigation to Variable data screen)
            myUC004MaintainJudgmentUtils.clickSaveButton ();

            // Close Judgments screen to return to Case Events screen
            myUC004MaintainJudgmentUtils.closeScreen ();
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Add Case Event 600 (navigates to variable data screen)
            myUC002CaseEventUtils.openAddEventPopup ("600");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            String screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals ("Enter Variable Data N441A"))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Check Judgment grid is enabled and correct Judgment is selected in grid
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgmentSelection",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "DEFENDANT ONE NAME", 2, this);

            final String partyAgainst = vdQ2.getQuestionValue ();
            final boolean isQuestionEnabled = vdQ2.isQuestionEnabled ();

            assertTrue ("Selected party against is not expected value", partyAgainst.equals ("DEFENDANT ONE NAME"));
            assertTrue ("Select Judgment grid is disabled when should be enabled", isQuestionEnabled);

            // Click Save on Variable data screen to return to the Case Events screen
            session.click (VARIABLE_DATA_SAVE_BUTTON);
            screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * The same question that has been fixed is aslo used by the output O_7_12_6 (Case Event 48)
     * so need to check the question still behaves for this event.
     */
    public void testCaseEventO_7_12_6 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case record
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseWithSatisfiedJgmt);

            // Create Case Event 48
            myUC002CaseEventUtils.openAddEventPopup ("48");
            myUC002CaseEventUtils.setEventSubject ("Defendant 1 - DEFENDANT ONE NAME");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            String screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals ("Enter Variable Data O_7_12_6"))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Check Judgment grid is enabled
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgmentSelection",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "DEFENDANT ONE NAME", 2, this);

            final boolean isQuestionEnabled = vdQ2.isQuestionEnabled ();
            assertTrue ("Select Judgment grid is disabled when should be enabled", isQuestionEnabled);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * The same question that has been fixed is aslo used by the output L_3_9 (Case Event 505)
     * so need to check the question still behaves for this event.
     */
    public void testCaseEventL_3_9 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case record
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseWithSatisfiedJgmt);

            // Create Case Event 505 (No subject/instigator)
            myUC002CaseEventUtils.openAddEventPopup ("505");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            while (session.isConfirmationPresent ())
            {
                session.getConfirmation ();
            }

            // Handle trip to Obligations screen
            String screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Click Close to go to Variable data screen
            myUC009MaintainObligationsUtils.closeScreen ();
            screenTitle = session.getPageTitle ();
            while ( !screenTitle.equals ("Enter Variable Data L_3_9"))
            {
                session.waitForPageToLoad ();
                screenTitle = session.getPageTitle ();
            }

            // Check Judgment grid is enabled
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgmentSelection",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "DEFENDANT ONE NAME", 2, this);

            final boolean isQuestionEnabled = vdQ2.isQuestionEnabled ();
            assertTrue ("Select Judgment grid is disabled when should be enabled", isQuestionEnabled);
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