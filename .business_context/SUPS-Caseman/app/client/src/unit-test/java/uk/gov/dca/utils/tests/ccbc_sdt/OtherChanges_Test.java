/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11053 $
 * $Author: vincentcp $
 * $Date: 2014-04-29 14:22:14 +0100 (Tue, 29 Apr 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Other changes in the CCBC SDT release.
 * Resetting status from STAYED to NULL
 * Case Event 75 now obsolete
 * Resetting statuses WITHDRAWN, WRITTEN OFF, DISCONTINUED or SETTLED/WDRN to NULL
 * CaseMan Event 10 will no longer set the bar against judgment to ‘Y’ on creation
 *
 * @author Chris Vincent
 */
public class OtherChanges_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00002"; // STAYED CCBC-owned case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00005"; // WITHDRAWN CCBC-owned case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00012"; // WRITTEN OFF CCBC-owned case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00015"; // DISCONTINUED CCBC-owned case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00022"; // SETTLED/WDRN CCBC-owned case
    
    /** The case number 6. */
    private String caseNumber6 = "3NN00001"; // Non-CCBC owned case
    
    /** The case number 7. */
    private String caseNumber7 = "3NN00032"; // CCBC owned case

    /** The event 75. */
    // Case Events
    private String EVENT_75 = "75";
    
    /** The event 10. */
    private String EVENT_10 = "10";

    /** The mcol code1. */
    // MCOL messages
    private String MCOL_CODE1 = "H0"; // Case status changed from SETTLED to NULL
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "B0"; // Case status changed from DISCONTINUED to NULL

    /**
     * Constructor.
     */
    public OtherChanges_Test ()
    {
        super (OtherChanges_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when a CCBC owned case with a status of STAYED has it's case status reset
     * that no MCOL rows are written.
     */
    public void testCaseStatusReset_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Reset case status from STAYED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC owned case with a status of WITHDRAWN has it's case status reset
     * that MCOL rows are written.
     */
    public void testCaseStatusReset_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Reset case status from WITHDRAWN to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC owned case with a status of WRITTEN OFF has it's case status reset
     * that MCOL rows are written.
     */
    public void testCaseStatusReset_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Reset case status from WRITTEN OFF to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber3));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC owned case with a status of DISCONTINUED has it's case status reset
     * that MCOL rows are written.
     */
    public void testCaseStatusReset_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Reset case status from DISCONTINUED to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber4));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC owned case with a status of SETTLED/WDRN has it's case status reset
     * that MCOL rows are written.
     */
    public void testCaseStatusReset_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Reset case status from SETTLED/WDRN to NULL and check MCOL_DATA rows
            myUC002CaseEventUtils.resetCaseStatus ();
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that case event 75 can no longer be created in CaseMan, but existing event 75s can still be seen.
     */
    public void testCaseEvent75 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber6);

            // Check that the existing case event 75 is visible
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_75);
            assertEquals ("WITHDRAWN PRE JUDGMENT", myUC002CaseEventUtils.getEventDescription ());
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that new case event 214 records cannot be created
            myUC002CaseEventUtils.setNewEventId (EVENT_75);
            myUC002CaseEventUtils.setNewCaseEventIdFocus ();
            assertFalse ("New Event id field is valid when should be invalid",
                    myUC002CaseEventUtils.isNewEventIdFieldValid ());
            mCheckStatusBarText (UC002CaseEventUtils.ERR_INVALID_EVENT_ID);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that case event 10 when created on a non-CCBC owned case does not set the bar on judgment
     * for the event subject.
     */
    public void testCaseEvent10_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber6);

            // Create Case Event 10
            createCaseEvent10 ();

            final String query =
                    "SELECT DECODE(NVL(DEFT_BAR_JUDGMENT,'N'), 'Y', 'true', 'false') " + "FROM CASE_PARTY_ROLES " +
                            "WHERE PARTY_ROLE_CODE = 'DEFENDANT' AND CASE_NUMBER = '" + caseNumber6 + "'";

            assertFalse ("Bar on Judgment has been set", DBUtil.runDecodeTrueFalseQuery (query));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that case event 10 when created on a CCBC owned case does not set the bar on judgment
     * for the event subject.
     */
    public void testCaseEvent10_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber7);

            // Create Case Event 10
            createCaseEvent10 ();

            final String query =
                    "SELECT DECODE(NVL(DEFT_BAR_JUDGMENT,'N'), 'Y', 'true', 'false') " + "FROM CASE_PARTY_ROLES " +
                            "WHERE PARTY_ROLE_CODE = 'DEFENDANT' AND CASE_NUMBER = '" + caseNumber7 + "'";

            assertFalse ("Bar on Judgment has been set", DBUtil.runDecodeTrueFalseQuery (query));
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
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the creation of case event 10.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent10 () throws Exception
    {
        /**
         * Create Event 10
         * Enter Subject
         * Opt not to produce output
         */
        final NewStandardEvent testEvent10 = new NewStandardEvent (EVENT_10);
        testEvent10.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
        testEvent10.setProduceOutputFlag (false);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent10, null);
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
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}