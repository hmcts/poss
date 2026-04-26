/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11874 $
 * $Author: vincentcp $
 * $Date: 2015-04-22 14:56:28 +0100 (Wed, 22 Apr 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Paid Post Judgment functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class PaidPostJudgment_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00011"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00012"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00013"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00014"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00015"; // CCBC owned CCBC case
    
    /** The case number 6. */
    private String caseNumber6 = "3NN00016"; // CCBC owned case with judgments against claimant
    
    /** The event 79. */
    private String EVENT_79 = "79";
    
    /** The mcol code1. */
    private String MCOL_CODE1 = "MP";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "M0";

    /**
     * Constructor.
     */
    public PaidPostJudgment_Test ()
    {
        super (PaidPostJudgment_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Tests that when Case Event 79 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgment (caseNumber1, "DEFENDANT ONE NAME");

            // Mark Judgment Paid In Full
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Mark the other judgment as paid in full
            navigateAndSelectJudgment ("DEFENDANT TWO NAME");
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));

            // Error off the Case Event 79
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 79 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT ONE NAME");

            // Mark Judgment Paid In Full
            String paidDate = markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1)); // 1 on Case
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "1")); // 1 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "2")); // 0 against Def 2
            assertEquals (paidDate,
                    DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "TO_CHAR(PAID_DATE,'DD-Mon-YYYY')")); // Check
                                                                                                                  // correct
                                                                                                                  // PAID_DATE
                                                                                                                  // written

            // Mark the other judgment as paid in full
            navigateAndSelectJudgment ("DEFENDANT TWO NAME");
            paidDate = markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1)); // 2 on Case
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "1")); // 1 against Def 1
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "2")); // 1 against Def 2
            assertEquals (paidDate,
                    DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "TO_CHAR(PAID_DATE,'DD-Mon-YYYY')")); // Check
                                                                                                                  // correct
                                                                                                                  // PAID_DATE
                                                                                                                  // written

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Error off the Case Event 79s
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1)); // 0 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "1")); // 0 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1, "2")); // 0 against Def 2
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 79 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgment (caseNumber3, "DEFENDANT TWO NAME");

            // Mark Judgment Paid In Full
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Mark the other judgment as paid in full
            navigateAndSelectJudgment ("DEFENDANT ONE NAME");
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));

            // Error off the Case Event 79
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 79 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgment (caseNumber4, "DEFENDANT ONE NAME");

            // Mark Judgment Paid In Full
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Mark the other judgment as paid in full
            navigateAndSelectJudgment ("DEFENDANT TWO NAME");
            markJudgmentPaidInFull (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));

            // Error off the Case Event 79
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 79 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgment (caseNumber5, "DEFENDANT TWO NAME");

            // Mark Judgment Paid In Full
            String paidDate = markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1)); // 1 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "1")); // 0 against Def 1
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "2")); // 1 against Def 2
            assertEquals (paidDate,
                    DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE1, "TO_CHAR(PAID_DATE,'DD-Mon-YYYY')")); // Check
                                                                                                                  // correct
                                                                                                                  // PAID_DATE
                                                                                                                  // written

            // Mark the other judgment as paid in full
            navigateAndSelectJudgment ("DEFENDANT ONE NAME");
            paidDate = markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1)); // 2 on Case
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "1")); // 1 against Def 1
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "2")); // 1 against Def 2
            assertEquals (paidDate,
                    DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE1, "TO_CHAR(PAID_DATE,'DD-Mon-YYYY')")); // Check
                                                                                                                  // correct
                                                                                                                  // PAID_DATE
                                                                                                                  // written

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

            // Error off the Case Event 79s
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1)); // 0 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "1")); // 0 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1, "2")); // 0 against Def 2
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 79 is created on a CCBC owned case, with judgments against the claimant that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent79_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Maintain Judgments screen
            loginAndLoadCaseJudgmentByDate (caseNumber6, "16-OCT-2013");

            // Mark Judgment Paid In Full
            markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1)); // 1 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "1")); // 0 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "2")); // 1 against Def 2

            // Mark the other judgment as paid in full
            navigateAndSelectJudgmentDate ("17-OCT-2013");
            markJudgmentPaidInFull (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1)); // 2 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "1")); // 1 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "2")); // 1 against Def 2

            // Reset Case Status from PAID to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Error off the Case Event 79s
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_79);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1)); // 0 on Case
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "1")); // 0 against Def 1
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1, "2")); // 0 against Def 2
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     * @param judgmentAgainstPartyName The judgment against party name
     */
    private void loginAndLoadCaseJudgment (final String caseNumber, final String judgmentAgainstPartyName)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

        // Load Judgment
        navigateAndSelectJudgment (judgmentAgainstPartyName);
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen, load a case
     * and then load a Judgment by Judgment date.
     *
     * @param caseNumber The case number to load
     * @param judgmentDate The Judgment Date e.g. 17-OCT-2013
     */
    private void loginAndLoadCaseJudgmentByDate (final String caseNumber, final String judgmentDate)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

        // Load Judgment
        navigateAndSelectJudgmentDate (judgmentDate);
    }

    /**
     * Handles navigation to the Judgments screen and selection of a particular judgment.
     *
     * @param judgmentAgainstPartyName The judgment against party name
     */
    private void navigateAndSelectJudgment (final String judgmentAgainstPartyName)
    {
        // Navigate to the Judgments screen
        myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
        mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

        // Select appropriate judgment
        myUC004MaintainJudgmentUtils.selectPartyAgainstByName (judgmentAgainstPartyName);
    }

    /**
     * Handles navigation to the Judgments screen and selection of a particular judgment.
     *
     * @param judgmentDate The Judgment Date e.g. 17-OCT-2013
     */
    private void navigateAndSelectJudgmentDate (final String judgmentDate)
    {
        // Navigate to the Judgments screen
        myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
        mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

        // Select appropriate judgment
        myUC004MaintainJudgmentUtils.selectPartyAgainstByDate (judgmentDate);
    }

    /**
     * Private method to handle the paying of a judgment in full which automatically creates event 79.
     *
     * @param ccbcCase True if case is owned by 335 else false
     * @return The Date Paid in Full so can be referenced on the MCOL_DATA table
     */
    private String markJudgmentPaidInFull (final boolean ccbcCase)
    {
        final String paidDate = AbstractBaseUtils.getFutureDate ( -7, AbstractBaseUtils.DATE_FORMAT_NOW, true);

        // Set date paid in full to generate the event 79
        myUC004MaintainJudgmentUtils.setDatePaidInFull (paidDate);
        myUC004MaintainJudgmentUtils.setNotificationReceiptDate (paidDate);

        if (ccbcCase)
        {
            // No word processing for CCBC cases
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        else
        {
            // Non-CCBC cases must complete word processing screens
            myUC004MaintainJudgmentUtils.saveFollowingPaidInFull ();
        }
        // Exit Judgments screen
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        return paidDate;
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