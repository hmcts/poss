/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11372 $
 * $Author: vincentcp $
 * $Date: 2014-09-30 15:12:19 +0100 (Tue, 30 Sep 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the MCOL BIF Item 30 changes in the BIF release.
 *
 * @author Chris Vincent
 */
public class MCOLBIFItem30_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

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

    /** The event 73. */
    private String EVENT_73 = "73";
    
    /** The event 74. */
    private String EVENT_74 = "74";
    
    /** The event 76. */
    private String EVENT_76 = "76";
    
    /** The mcol code 73 76. */
    private String MCOL_CODE_73_76 = "WD";
    
    /** The mcol code 74. */
    private String MCOL_CODE_74 = "DI";

    /**
     * Constructor.
     */
    public MCOLBIFItem30_Test ()
    {
        super (MCOLBIFItem30_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when Case Events 73, 74 and 76 are created against the case on a Northampton owned non-MCOL,
     * non-CCBC case, that no notification is written to the MCOL_DATA table.
     */
    public void testCaseEvents_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case events
            createCaseEvent (EVENT_73);
            createCaseEvent (EVENT_74);
            createCaseEvent (EVENT_76);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE_73_76));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE_74));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Events 73, 74 and 76 are created against the case on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvents_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case events
            createCaseEvent (EVENT_73);
            createCaseEvent (EVENT_74);
            createCaseEvent (EVENT_76);

            // Check that an MCOL_DATA row has been written
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE_73_76));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE_74));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Events 73, 74 and 76 are created against the case on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvents_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case events
            createCaseEvent (EVENT_73);
            createCaseEvent (EVENT_74);
            createCaseEvent (EVENT_76);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE_73_76));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE_74));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Events 73, 74 and 76 are created against the case on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvents_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case events
            createCaseEvent (EVENT_73);
            createCaseEvent (EVENT_74);
            createCaseEvent (EVENT_76);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE_73_76));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE_74));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Events 73, 74 and 76 are created against the case on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvents_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case events
            createCaseEvent (EVENT_73);
            createCaseEvent (EVENT_74);
            createCaseEvent (EVENT_76);

            // Check that an MCOL_DATA row has been written
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE_73_76));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE_74));
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
     * Private method to handle the creation of a case event.
     *
     * @param pEventId Event Id to create
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent (final String pEventId) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (pEventId);
        testEvent.setSubjectParty ("CASE");
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