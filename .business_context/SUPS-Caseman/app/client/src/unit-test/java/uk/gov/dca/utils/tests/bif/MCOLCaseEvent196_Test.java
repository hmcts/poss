/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11367 $
 * $Author: vincentcp $
 * $Date: 2014-09-29 14:25:57 +0100 (Mon, 29 Sep 2014) $
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
 * Automated tests for the Case Event 196 MCOL Message functionality in the BIF release.
 *
 * @author Chris Vincent
 */
public class MCOLCaseEvent196_Test extends AbstractCmTestBase
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
    private String EVENT_CODE = "196";
    
    /** The mcol code1. */
    private String MCOL_CODE1 = "LD";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "L4";

    /**
     * Constructor.
     */
    public MCOLCaseEvent196_Test ()
    {
        super (MCOLCaseEvent196_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
    }

    /**
     * Tests that when Case Event 196 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent196_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create Case Event 196
            createCaseEvent196 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Error off the Case Event 196 (will navigate to Maintain Obligations screen)
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
     * Tests that when Case Event 196 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent196_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create Case Event 196
            createCaseEvent196 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Error off the Case Event 196 (will navigate to Maintain Obligations screen)
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
     * Tests that when Case Event 196 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent196_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create Case Event 196
            createCaseEvent196 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Error off the Case Event 196 (will navigate to Maintain Obligations screen)
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
     * Tests that when Case Event 196 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent196_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create Case Event 196
            createCaseEvent196 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Error off the Case Event 196 (will navigate to Maintain Obligations screen)
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
     * Tests that when Case Event 196 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent196_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create Case Event 196
            createCaseEvent196 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Error off the Case Event 196 (will navigate to Maintain Obligations screen)
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
     * Private method to handle the creation of Case Event 196.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent196 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT_CODE);
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