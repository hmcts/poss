/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem19_1_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem19_1_Test ()
    {
        super (CM_BIFItem19_1_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when Case Event 202 is created and a hearing created, the correct BMS is allocated
     * to event 200.
     */
    public void testCaseEvent202_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            final NewStandardEvent testEvent = new NewStandardEvent ("202");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("NoticeType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Hearing", this);
            eventQuestions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("HearingType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "General application", this);
            eventQuestions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Will take place on", this);
            eventQuestions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventQuestions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            eventQuestions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("200");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 202 is created and a hearing created, the correct BMS is allocated
     * to event 200.
     */
    public void testCaseEvent202_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            final NewStandardEvent testEvent = new NewStandardEvent ("202");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("NoticeType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Hearing", this);
            eventQuestions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("HearingType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Application to lift stay", this);
            eventQuestions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Will take place on", this);
            eventQuestions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventQuestions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            eventQuestions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("200");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 202 is created and a hearing created, the correct BMS is allocated
     * to event 200.
     */
    public void testCaseEvent202_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            final NewStandardEvent testEvent = new NewStandardEvent ("202");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("NoticeType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Hearing", this);
            eventQuestions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("HearingType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Application to dispute jurisdiction", this);
            eventQuestions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Will take place on", this);
            eventQuestions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventQuestions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            eventQuestions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("200");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 202 is created and a hearing created, the correct BMS is allocated
     * to event 200.
     */
    public void testCaseEvent202_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            final NewStandardEvent testEvent = new NewStandardEvent ("202");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("NoticeType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Hearing", this);
            eventQuestions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("HearingType2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Fast track hearing", this);
            eventQuestions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Listing", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Re-listing", this);
            eventQuestions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Will take place on", this);
            eventQuestions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventQuestions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            eventQuestions.add (vdQ6);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("200");
            assertEquals ("LS4", myUC002CaseEventUtils.getEventBMSTask ());
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