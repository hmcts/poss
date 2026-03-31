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

package uk.gov.dca.utils.tests.central_ae;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5722_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "9NN00001"; // Case with no active judgment
    
    /** The case number 2. */
    private String caseNumber2 = "9NN00002"; // Case without the pre-requisite event 440
    
    /** The case number 3. */
    private String caseNumber3 = "9NN00020"; // Case with status of PAID
    
    /** The case number 4. */
    private String caseNumber4 = "9NN00021"; // Case with status of SETTLED
    
    /** The case number 5. */
    private String caseNumber5 = "9NN00022"; // Case with status of STRUCK OUT
    
    /** The case number 6. */
    private String caseNumber6 = "9NN00039"; // Normal case for event 445
    
    /** The case number 7. */
    private String caseNumber7 = "9NN00040"; // CCBC case for event 445
    
    /** The case number 8. */
    private String caseNumber8 = "9NN00023"; // Case with status of STAYED

    /** The event445. */
    private String EVENT445 = "445";
    
    /** The event440. */
    private String EVENT440 = "440";
    
    /** The obligation type. */
    private String OBLIGATION_TYPE = "14";

    /**
     * Constructor.
     */
    public CaseMan_Trac5722_Test ()
    {
        super (CaseMan_Trac5722_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that case event 445 can be created successfully on a non-CCBC case.
     */
    public void testCaseEvent445_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber6);

            final NewStandardEvent testEvent = new NewStandardEvent (EVENT445);
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent.setEventDetails ("TEST");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT445);
            assertEquals ("EN71", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("PARTY CONTESTS INTERIM CHARGING ORDER", myUC002CaseEventUtils.getEventDescription ());

            // Check that the Obligation has not been created
            assertFalse ("Obligation has been created", checkObligationCreatedOnCase (caseNumber6, OBLIGATION_TYPE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that case event 445 can be created successfully on a CCBC case.
     */
    public void testCaseEvent445_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber7);

            final NewStandardEvent testEvent = new NewStandardEvent (EVENT445);
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent.setEventDetails ("TEST");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT445);
            assertEquals ("EN71", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("PARTY CONTESTS INTERIM CHARGING ORDER", myUC002CaseEventUtils.getEventDescription ());

            // Check that the Obligation has not been created
            assertFalse ("Obligation has been created", checkObligationCreatedOnCase (caseNumber7, OBLIGATION_TYPE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the active judgment and pre-requisite event validation on case event 445.
     * Also checks the Details field is mandatory.
     */
    public void testCaseEvent445_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Test Active Judgment Validation
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            myUC002CaseEventUtils.setEventSubject ("Defendant 1 - DEFENDANT ONE NAME");
            assertFalse ("Subject field is valid when should be invalid",
                    myUC002CaseEventUtils.isNewEventSubjectValid ());
            myUC002CaseEventUtils.setNewCaseSubjectFocus ();
            mCheckStatusBarText ("Valid judgment must exist.");

            // Check Details field is mandatory
            assertTrue ("Details field is optional when should be mandatory",
                    myUC002CaseEventUtils.isNewEventDetailsMandatory ());

            // Exit popup and load new case
            myUC002CaseEventUtils.clickAddEventCancelButton ();
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber2);

            // Test pre-requisite event validation
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            myUC002CaseEventUtils.setEventSubject ("Defendant 1 - DEFENDANT ONE NAME");
            assertFalse ("Subject field is valid when should be invalid",
                    myUC002CaseEventUtils.isNewEventSubjectValid ());
            myUC002CaseEventUtils.setNewCaseSubjectFocus ();
            mCheckStatusBarText ("Event 440 must exist for the subject.");
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the case status validation on case event 445.
     */
    public void testCaseEvent445_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            // Test a case with a status of PAID
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            assertFalse ("Add event popup is open when should be closed",
                    myUC002CaseEventUtils.isAddEventPopupVisible ());
            mCheckStatusBarText ("Case is PAID. This Event cannot now be entered.");

            // Test a case with a status of SETTLED
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber4);
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            assertFalse ("Add event popup is open when should be closed",
                    myUC002CaseEventUtils.isAddEventPopupVisible ());
            mCheckStatusBarText ("Case is SETTLED. This Event cannot now be entered.");

            // Test a case with a status of STRUCK OUT
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber5);
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            assertFalse ("Add event popup is open when should be closed",
                    myUC002CaseEventUtils.isAddEventPopupVisible ());
            mCheckStatusBarText ("Case is STRUCK OUT. This Event cannot now be entered.");

            // Test a case with a status of STAYED
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber8);
            myUC002CaseEventUtils.openAddEventPopup (EVENT445);
            assertFalse ("Add event popup is open when should be closed",
                    myUC002CaseEventUtils.isAddEventPopupVisible ());
            mCheckStatusBarText ("Case is STAYED. This Event cannot now be entered.");
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that case event 440 can be created successfully and creates an obligation.
     */
    public void testCaseEvent440_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber6);

            final NewStandardEvent testEvent = new NewStandardEvent (EVENT440);
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhoConsidApp2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OutstandingAmt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecurityDtls", this));

            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check that the Obligation has been created
            assertTrue ("Obligation has been created", checkObligationCreatedOnCase (caseNumber6, OBLIGATION_TYPE));
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
     * Checks that an Obligation has been created on a given case with a specified obligation type.
     *
     * @param pCaseNumber The case number to check
     * @param obligationType The Obligation Type to search for on the case
     * @return True if the obligation exists, else false
     */
    private boolean checkObligationCreatedOnCase (final String pCaseNumber, final String obligationType)
    {
        final String query =
                "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM obligations WHERE delete_flag = 'N' AND " +
                        "case_number = '" + pCaseNumber + "' AND obligation_type = " + obligationType;
        return DBUtil.runDecodeTrueFalseQuery (query);
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