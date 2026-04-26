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

package uk.gov.dca.utils.tests.shakedown;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class CaseEventsTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseEventsTest ()
    {
        super (CaseEventsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 100
             * Enter Subject
             * BMS Related LOV on Save
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent100 = new NewStandardEvent ("100");
            testEvent100.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent100.setNavigateObligations (true);
            testEvent100.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event100Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event100Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent100, event100Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 332
             * No Subject
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent332 = new NewStandardEvent ("332");
            testEvent332.setNavigateObligations (true);
            testEvent332.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event332Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event332Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event332Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent332, event332Questions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents3 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 9
             * No Subject
             * Variable Data Screen (Oracle Report Output)
             */
            final NewStandardEvent testEvent9 = new NewStandardEvent ("9");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event9Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ReturnedDocument",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Copy of the Times", this);
            event9Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent9, event9Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 999
             * No Subject
             * Navigation to the Obligations screen
             * No Word Processing
             */
            final NewStandardEvent testEvent999 = new NewStandardEvent ("999");
            testEvent999.setNavigateObligations (true);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent999, null);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 111
             * Enter Subject
             * BMS Related LOV on Save
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent111 = new NewStandardEvent ("111");
            testEvent111.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent111.setNavigateObligations (true);
            testEvent111.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event111Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event111Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent111, event111Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 114
             * Enter Subject
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent114 = new NewStandardEvent ("114");
            testEvent114.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent114.setNavigateObligations (true);
            testEvent114.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event114Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectLetter",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Acknowledge receipt detailed assessment", this);
            event114Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event114Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("BillNumber", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "123456", this);
            event114Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent114, event114Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents7 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 772
             * Enter Subject
             * Mandatory Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent772 = new NewStandardEvent ("772");
            testEvent772.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent772.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event772Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event772Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("CCFee", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event772Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent772, event772Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents8 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 222
             * Mandatory Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             */
            final NewStandardEvent testEvent222 = new NewStandardEvent ("222");
            testEvent222.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event222Questions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent222, event222Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents9 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 205
             * Set Instigator grid
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent205 = new NewStandardEvent ("205");
            testEvent205.setProduceOutputFlag (true);
            testEvent205.setNavigateObligations (true);
            testEvent205.setInstigatorParty ("CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event205Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "Random Text", this);
            event205Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event205Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event205Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent205, event205Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents10 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 53
             * No Subject or Instigator
             * Mandatory Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent53 = new NewStandardEvent ("53");
            testEvent53.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event53Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "copy defence already sent - time elapsed", this);
            event53Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent53, event53Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            /**
             * Create Event 106
             * Subject
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent106 = new NewStandardEvent ("106");
            testEvent106.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent106.setNavigateObligations (true);
            testEvent106.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event106Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vd1 = new VariableDataQuestion ("SelectLetter3",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Request for bank details for CFO", this);
            event106Questions.add (vd1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event106Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent106, event106Questions);

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
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     */
    private void mLoginAndLoadCase ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber ("9NN00001");
    }

}