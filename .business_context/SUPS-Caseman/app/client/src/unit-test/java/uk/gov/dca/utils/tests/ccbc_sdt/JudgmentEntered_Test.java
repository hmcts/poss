/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9980 $
 * $Author: vincentcp $
 * $Date: 2013-10-18 10:47:34 +0100 (Fri, 18 Oct 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Judgment Entered functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class JudgmentEntered_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

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
    
    /** The event 230. */
    private String EVENT_230 = "230";
    
    /** The event 240. */
    private String EVENT_240 = "240";
    
    /** The event 250. */
    private String EVENT_250 = "250";
    
    /** The event 251. */
    private String EVENT_251 = "251";
    
    /** The event 256. */
    private String EVENT_256 = "256";
    
    /** The mcol code. */
    private String MCOL_CODE = "JE";

    /**
     * Constructor.
     */
    public JudgmentEntered_Test ()
    {
        super (JudgmentEntered_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when Case Event 230 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent230_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 230
            createCaseEvent230 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent230_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 230
            createCaseEvent230 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent230_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 230
            createCaseEvent230 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent230_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 230
            createCaseEvent230 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent230_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 230
            createCaseEvent230 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent240_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 240
            createCaseEvent240 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent240_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 240
            createCaseEvent240 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent240_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 240
            createCaseEvent240 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent240_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 240
            createCaseEvent240 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent240_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 240
            createCaseEvent240 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent250_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 250
            createCaseEvent250 (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent250_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 250
            createCaseEvent250 (true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent250_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 250
            createCaseEvent250 (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent250_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 250
            createCaseEvent250 (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent250_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 250
            createCaseEvent250 (true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent251_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 251
            createCaseEvent251 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent251_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 251
            createCaseEvent251 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent251_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 251
            createCaseEvent251 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent251_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 251
            createCaseEvent251 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent251_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 251
            createCaseEvent251 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 256 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent256_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 256
            createCaseEvent256 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 256 is created on a CCBC owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent256_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create case event 256
            createCaseEvent256 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 256 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent256_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Create case event 256
            createCaseEvent256 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 256 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent256_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4);

            // Create case event 256
            createCaseEvent256 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 256 is created on a CCBC owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent256_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Create case event 256
            createCaseEvent256 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE));
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
     * Private method to handle the creation of case event 230.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent230 () throws Exception
    {
        /**
         * Create Event 230
         * Enter Subject & Instigator (don't set so uses defaults)
         * Variable Data Screen (Word Processing Output)
         * No FCK Editor
         */
        final NewStandardEvent testEvent230 = new NewStandardEvent (EVENT_230);
        testEvent230.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event230Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        event230Questions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        event230Questions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent230, event230Questions);
    }

    /**
     * Private method to handle the creation of case event 240.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent240 () throws Exception
    {
        /**
         * Create Event 240
         * Enter Subject & Instigator (don't set so uses defaults)
         * Variable Data Screen (Word Processing Output)
         * No FCK Editor
         */
        final NewStandardEvent testEvent240 = new NewStandardEvent (EVENT_240);
        testEvent240.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event240Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        event240Questions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        event240Questions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent240, event240Questions);
    }

    /**
     * Private method to handle the creation of case event 250.
     *
     * @param pCCBCCase True if case is owned by 335 (CCBC)
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent250 (final boolean pCCBCCase) throws Exception
    {
        /**
         * Create Event 250
         * Enter Subject & Instigator (don't set so uses defaults)
         * Variable Data Screen (Word Processing Output)
         * No FCK Editor
         */
        final NewStandardEvent testEvent250 = new NewStandardEvent (EVENT_250);
        testEvent250.setProduceOutputFlag (true);
        testEvent250.setCCBCCase (pCCBCCase);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event250Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        event250Questions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        event250Questions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent250, event250Questions);
    }

    /**
     * Private method to handle the creation of case event 251.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent251 () throws Exception
    {
        /**
         * Create Event 251
         * Enter Subject & Instigator (don't set so uses defaults)
         * Variable Data Screen (Word Processing Output)
         * FCK Editor
         */
        final NewStandardEvent testEvent251 = new NewStandardEvent (EVENT_251);
        testEvent251.setProduceOutputFlag (true);
        testEvent251.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event251Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        event251Questions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        event251Questions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent251, event251Questions);
    }

    /**
     * Private method to handle the creation of case event 256.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent256 () throws Exception
    {
        /**
         * Create Event 256
         * No Subject/Instigator
         * Variable Data Screen (Word Processing Output)
         * No FCK Editor
         */
        final NewStandardEvent testEvent256 = new NewStandardEvent (EVENT_256);
        testEvent256.setProduceOutputFlag (false);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent256, null);
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