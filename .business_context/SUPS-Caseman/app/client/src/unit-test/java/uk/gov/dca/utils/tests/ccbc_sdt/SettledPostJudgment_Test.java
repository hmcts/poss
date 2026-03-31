/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11370 $
 * $Author: vincentcp $
 * $Date: 2014-09-30 11:45:23 +0100 (Tue, 30 Sep 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Settled Post Judgment functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class SettledPostJudgment_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00001"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00002"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00003"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00004"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00005"; // CCBC owned CCBC case
    
    /** The event 76. */
    private String EVENT_76 = "76";
    
    /** The mcol code1. */
    private String MCOL_CODE1 = "WD";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "H0"; // Case status reset from SETTLED to NULL

    /**
     * Constructor.
     */
    public SettledPostJudgment_Test ()
    {
        super (SettledPostJudgment_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests that when Case Event 76 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent76_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 76
            createCaseEvent76 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Reset case status from SETTLED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));

            // Error off the Case Event 76
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
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
     * Tests that when Case Event 76 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent76_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 76
            createCaseEvent76 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Reset case status from SETTLED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Error off the Case Event 76
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 76 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent76_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 76
            createCaseEvent76 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Reset case status from SETTLED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));

            // Error off the Case Event 76
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
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
     * Tests that when Case Event 76 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent76_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 76
            createCaseEvent76 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Reset case status from SETTLED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));

            // Error off the Case Event 76
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
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
     * Tests that when Case Event 76 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent76_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 76
            createCaseEvent76 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Reset case status from SETTLED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

            // Error off the Case Event 76
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the changes to case event 76 including description and the case status it sets.
     */
    public void testCaseEvent76_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Check the existing event 74 description is still the old one
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
            assertEquals ("CASE SETTLED WITHDRAWN (POST-JGMT)", myUC002CaseEventUtils.getEventDescription ());

            // Create case event 76
            createCaseEvent76 ();

            // Check event description is correct (is new description)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_76);
            assertEquals ("CASE SETTLED (POST-JGMT)", myUC002CaseEventUtils.getEventDescription ());

            // Navigate to Case creation screen to check the case status
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check case status set correctly
            assertEquals ("SETTLED", myUC001CreateUpdateCaseUtils.getCaseStatus ());
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
     */
    private void loginAndLoadCase (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the creation of case event 76.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent76 () throws Exception
    {
        /**
         * Create Event 76
         * No Subject
         * Variable Data Screen (Word Processing Output)
         * FCK Editor
         */
        final NewStandardEvent testEvent76 = new NewStandardEvent (EVENT_76);
        testEvent76.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent76, null);
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