/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 12832 $
 * $Author: vincentcp $
 * $Date: 2017-01-17 15:21:13 +0000 (Tue, 17 Jan 2017) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC009MaintainObligationsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Event 333 MCOL Message functionality in the BIF release.
 *
 * @author Chris Vincent
 */
public class MCOLCaseEvent333_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 009 maintain obligations utils. */
    private UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

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
    
    /** The event code. */
    private String EVENT_CODE = "333";
    
    /** The mcol code1. */
    private String MCOL_CODE1 = "LF";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "L6";

    /**
     * Constructor.
     */
    public MCOLCaseEvent333_Test ()
    {
        super (MCOLCaseEvent333_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
    }

    /**
     * Tests that when Case Event 333 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent333_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 333
            createCaseEvent333 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Error off the Case Event 333 (will navigate to Maintain Obligations screen)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            this.waitForPageToLoad ();

            // Delete the obligation and exit back to the Case Events screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
            myUC009MaintainObligationsUtils.clickSave ();
            myUC009MaintainObligationsUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent333_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2, true);

            // Create Case Event 333
            createCaseEvent333 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Error off the Case Event 333 (will navigate to Maintain Obligations screen)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            this.waitForPageToLoad ();

            // Delete the obligation and exit back to the Case Events screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
            myUC009MaintainObligationsUtils.clickSave ();
            myUC009MaintainObligationsUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent333_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 333
            createCaseEvent333 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Error off the Case Event 333 (will navigate to Maintain Obligations screen)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            this.waitForPageToLoad ();

            // Delete the obligation and exit back to the Case Events screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
            myUC009MaintainObligationsUtils.clickSave ();
            myUC009MaintainObligationsUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent333_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 333
            createCaseEvent333 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Error off the Case Event 333 (will navigate to Maintain Obligations screen)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            this.waitForPageToLoad ();

            // Delete the obligation and exit back to the Case Events screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
            myUC009MaintainObligationsUtils.clickSave ();
            myUC009MaintainObligationsUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent333_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 333
            createCaseEvent333 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Error off the Case Event 333 (will navigate to Maintain Obligations screen)
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            this.waitForPageToLoad ();

            // Delete the obligation and exit back to the Case Events screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
            myUC009MaintainObligationsUtils.clickSave ();
            myUC009MaintainObligationsUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_CODE);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
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
     * @param ccbc True if user needs to be a CCBC user otherwise false
     */
    private void loginAndLoadCase (final String caseNumber, final boolean ccbc)
    {
        final int userCourt;
        final String userRole;
        if ( ccbc )
        {
            userCourt = AbstractCmTestBase.COURT_CCBC;
            userRole = AbstractCmTestBase.ROLE_CCBC_MANAGER;
        }
        else
        {
            userCourt = AbstractCmTestBase.COURT_NORTHAMPTON;
            userRole = AbstractCmTestBase.ROLE_SUITORS;
        }
        
        // Log into SUPS CaseMan
        logOn(userCourt, userRole);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the creation of Case Event 333.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent333 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT_CODE);
        testEvent.setNavigateObligations (true);
        testEvent.setProduceOutputFlag (false);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, null);
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