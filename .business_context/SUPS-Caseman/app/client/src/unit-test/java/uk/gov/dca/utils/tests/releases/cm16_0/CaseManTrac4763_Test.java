/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11604 $
 * $Author: vincentcp $
 * $Date: 2015-02-11 15:22:12 +0000 (Wed, 11 Feb 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm16_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC009MaintainObligationsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan change Trac 4763.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4763_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 009 maintain obligations utils. */
    private UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4763_Test ()
    {
        super (CaseManTrac4763_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
    }

    /**
     * Checks enablement rules and saving the Track on two different screens
     * and navigating between them.
     */
    public void testNewFields ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to Case Creation screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check enablement of new Track field before and after loading case
            assertFalse ("Track field enabled when should be disabled", myUC001CreateUpdateCaseUtils.isTrackEnabled ());
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber);
            assertTrue ("Track field disabled when should be enabled", myUC001CreateUpdateCaseUtils.isTrackEnabled ());
            assertFalse ("Track field mandatory when should be optional",
                    myUC001CreateUpdateCaseUtils.isTrackMandatory ());

            // Set the value in the Track field and the Amount Claimed field and Save
            myUC001CreateUpdateCaseUtils.setTrack ("FAST TRACK");
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.setAmountClaimed ("123.45");
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();
            myUC001CreateUpdateCaseUtils.saveCase ();

            // Navigate to the case events screen
            myUC001CreateUpdateCaseUtils.navigateCaseEvents ();
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check enablement rules
            assertTrue ("Track field disabled when should be enabled", myUC002CaseEventUtils.isTrackEnabled ());
            assertTrue ("Amount Claimed disabled when should be enabled",
                    myUC002CaseEventUtils.isAmountClaimedEnabled ());
            assertTrue ("Amount Claimed editable when should be read only",
                    myUC002CaseEventUtils.isAmountClaimedReadOnly ());

            // Check values of fields
            assertEquals ("FAST TRACK", myUC002CaseEventUtils.getTrack ());
            assertEquals ("123.45", myUC002CaseEventUtils.getAmountClaimed ());

            // Change the Track field and save then clear
            myUC002CaseEventUtils.setTrack ("MULTI TRACK");
            myUC002CaseEventUtils.clickSaveButton ();
            myUC002CaseEventUtils.clearScreen ();

            // Check the fields are now disabled
            assertFalse ("Track field enabled when should be disabled", myUC002CaseEventUtils.isTrackEnabled ());
            assertFalse ("Amount Claimed enabled when should be disabled",
                    myUC002CaseEventUtils.isAmountClaimedEnabled ());

            // Load the case again and navigate to the Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check value on the Cases screen is as expected
            assertEquals ("MULTI TRACK", myUC001CreateUpdateCaseUtils.getTrack ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 214 can no longer be created, but existing events can be viewed and updated.
     */
    public void testCaseEvent214 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00003";
            mLoginAndLoadCase (caseNumber);

            // Check that the existing case event 214 is visible
            myUC002CaseEventUtils.selectCaseEventByEventId ("214");
            assertEquals ("N160 ALLOCATION SMALL CLAIM TRACK CONSENT", myUC002CaseEventUtils.getEventDescription ());
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that new case event 214 records cannot be created
            myUC002CaseEventUtils.setNewEventId ("214");
            myUC002CaseEventUtils.setNewCaseEventIdFocus ();
            assertFalse ("New Event id field is valid when should be invalid",
                    myUC002CaseEventUtils.isNewEventIdFieldValid ());
            mCheckStatusBarText (UC002CaseEventUtils.ERR_INVALID_EVENT_ID);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 51 can be created and that the event description for older 51's
     * is different to the new description.
     */
    public void testCaseEvent51 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00003";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "51";

            final NewStandardEvent testEvent51 = new NewStandardEvent (eventId);
            testEvent51.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event51Questions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent51, event51Questions);

            assertEquals ("N* NOTICE OF DELAY IN SENDING DQ", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 770 can be created and that the event description for older 770's
     * is different to the new description.
     */
    public void testCaseEvent770 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00003";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "770";

            final NewStandardEvent testEvent770 = new NewStandardEvent (eventId);
            testEvent770.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent770.setObligationNotes ("LISTING OF YOUR CLAIM");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event770Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("UnpaidAmnt", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event770Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("ListedDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event770Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent770, event770Questions);

            assertEquals ("N173 NOTICE TO PAY LQ FEE", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the new case event 197 can be created and it creates the correct BMS depending on case type.
     */
    public void testCaseEvent197 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "197";
            final NewStandardEvent testEvent197 = new NewStandardEvent (eventId);
            testEvent197.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            // Add the event on a County Court Case then check BMS & Description
            myUC002CaseEventUtils.addNewEvent (testEvent197, null);
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("JH59", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("DIRECTIONS QUESTIONNAIRE FILED", myUC002CaseEventUtils.getEventDescription ());

            // Add the event on a High Court/District Registry case then check BMS
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber ("3NN00002");
            myUC002CaseEventUtils.addNewEvent (testEvent197, null);
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("DR41", myUC002CaseEventUtils.getEventBMSTask ());

            // Add the event on a CCBC case then check BMS
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber ("3QX00001");
            myUC002CaseEventUtils.addNewEvent (testEvent197, null);
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("BC068", myUC002CaseEventUtils.getEventBMSTask ());

            // Add the event on a MCOL case then check BMS
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.loadCaseByCaseNumber ("3QX00002");
            myUC002CaseEventUtils.addNewEvent (testEvent197, null);
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("BC068", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 53 can still be created and that it creates Obligation Type 2.
     */
    public void testCaseEvent53 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "53";
            final NewStandardEvent testEvent53 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event53Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "copy defence already sent - time elapsed", this);
            event53Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent53, event53Questions);

            // Check that the Obligation Type 2 has been created
            assertTrue ("Obligation Type 2 not created", checkObligationCreatedOnCase (caseNumber, "2"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 210 can be created successfully.
     */
    public void testCaseEvent210 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "210";
            final NewStandardEvent testEvent210 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event210Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event210Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event210Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Allocation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event210Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event210Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event210Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("HearingTimeAllowed", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "2", this);
            event210Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("HearingTimeAllowedUnits",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Hours", this);
            event210Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("HearingFee", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event210Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("PayableByDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event210Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("DirectionsTypeReqd",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Holiday and wedding claims", this);
            event210Questions.add (vdQ10);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent210, event210Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 212 can be created successfully.
     */
    public void testCaseEvent212 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "212";
            final NewStandardEvent testEvent212 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event212Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event212Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event212Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Allocation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event212Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent212, event212Questions);

            // Check that the Obligation Type 15 has been created
            assertTrue ("Obligation Type 15 not created", checkObligationCreatedOnCase (caseNumber, "15"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 216 can be created successfully.
     */
    public void testCaseEvent216 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "216";
            final NewStandardEvent testEvent216 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event216Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event216Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event216Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Allocation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event216Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event216Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event216Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("PreliminaryHearingReason",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Special directions are needed", this);
            event216Questions.add (vdQ6);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent216, event216Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 218 can be created successfully.
     */
    public void testCaseEvent218 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "218";
            final NewStandardEvent testEvent218 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event218Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event218Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event218Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Allocation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event218Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent218, event218Questions);

            // Check that the Obligation Type 4 has been created
            assertTrue ("Obligation Type 4 not created", checkObligationCreatedOnCase (caseNumber, "4"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 220 can be created successfully.
     */
    public void testCaseEvent220 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "220";
            final NewStandardEvent testEvent220 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event220Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event220Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event220Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("ConsiderAllocQA",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event220Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("ClaimTransferTo",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "has not been transferred", this);
            event220Questions.add (vdQ4);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent220, event220Questions);

            // Check that the Obligation Type 4 has been created
            assertTrue ("Obligation Type 4 not created", checkObligationCreatedOnCase (caseNumber, "4"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 63 can be created successfully.
     */
    public void testCaseEvent63 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "63";
            final NewStandardEvent testEvent63 = new NewStandardEvent (eventId);
            testEvent63.setNavigateObligations (true);
            testEvent63.setInstigatorParty ("CLAIMANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event63Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event63Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event63Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("DocDetails",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "It's pink", this);
            event63Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent63, event63Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 103 can be created successfully.
     */
    public void testCaseEvent103 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "103";
            final NewStandardEvent testEvent103 = new NewStandardEvent (eventId);
            testEvent103.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event103Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event103Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event103Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Stayed", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event103Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent103, event103Questions);

            // Check that the Obligation Type 6 has been created
            assertTrue ("Obligation Type 6 not created", checkObligationCreatedOnCase (caseNumber, "6"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 104 can be created successfully.
     */
    public void testCaseEvent104 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "104";
            final NewStandardEvent testEvent104 = new NewStandardEvent (eventId);
            testEvent104.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event104Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event104Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event104Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Stayed", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event104Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("StayDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event104Questions.add (vdQ4);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent104, event104Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 228 can be created successfully.
     */
    public void testCaseEvent228 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "228";
            final NewStandardEvent testEvent228 = new NewStandardEvent (eventId);
            testEvent228.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event228Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event228Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event228Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingIsFor",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Notice of Allocation", this);
            event228Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("QASubmittedIRO",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event228Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event228Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event228Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("InfoReqdFrom",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Neither", this);
            event228Questions.add (vdQ7);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent228, event228Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 756 can be created successfully.
     */
    public void testCaseEvent756 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00003";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "756";
            final NewStandardEvent testEvent756 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event756Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event756Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event756Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("Stayed", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            event756Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("AqFiledByDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event756Questions.add (vdQ4);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent756, event756Questions);

            // Check that the Obligation Type 2 has NOT been created
            assertFalse ("Obligation Type 2 created", checkObligationCreatedOnCase (caseNumber, "2"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 56 can be created successfully.
     */
    public void testCaseEvent56 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "56";
            final NewStandardEvent testEvent56 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event56Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("NamesOfPartiesWhoHaveNotFiledAQs",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BOB", this);
            event56Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent56, event56Questions);

            // Check that the Obligation Type 5 has NOT been created
            assertTrue ("Obligation Type 5 not created", checkObligationCreatedOnCase (caseNumber, "5"));

            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 226 can be created successfully.
     */
    public void testCaseEvent226 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "226";
            final NewStandardEvent testEvent226 = new NewStandardEvent (eventId);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event226Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event226Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeWhoSawAllocationQuestionnaire",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BOB", this);
            event226Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("ReasonForReferral", VariableDataQuestion.VD_FIELD_TYPE_TEXT,
                            "ALL LISTING QUESTIONNAIRES HAVE BEEN FILED AND ARE ATTACHED", this);
            event226Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent226, event226Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 179 (JREF19) can be created successfully.
     */
    public void testCaseEvent179REF19 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "179-JREF19";
            final NewStandardEvent testEvent179 = new NewStandardEvent (eventId);
            testEvent179.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent179.setEventDetails ("JREF19: PUBLIC INTEREST IMMUNITY APPLICATION");
            testEvent179.setProduceOutputFlag (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event179Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event179Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeWhoSawAllocationQuestionnaires",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BOB", this);
            event179Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("PartyMakingTheApplication",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "CLAIMANT", this);
            event179Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent179, event179Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 179 (JREF20) can be created successfully.
     */
    public void testCaseEvent179REF20 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "179-JREF20";
            final NewStandardEvent testEvent179 = new NewStandardEvent (eventId);
            testEvent179.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent179.setEventDetails ("JREF20: APPLICATION FOR PERMISSION TO SERVE A WITNESS SUMMARY");
            testEvent179.setProduceOutputFlag (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event179Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event179Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeWhoSawAllocationQuestionnaires",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BOB", this);
            event179Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("PartyMakingTheApplication",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "CLAIMANT", this);
            event179Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent179, event179Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that case event 179 (JREF21) can be created successfully.
     */
    public void testCaseEvent179REF21 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "179-JREF21";
            final NewStandardEvent testEvent179 = new NewStandardEvent (eventId);
            testEvent179.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent179.setEventDetails ("JREF21: APPLICATION FOR LATE WITNESS SUMMONS");
            testEvent179.setProduceOutputFlag (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event179Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event179Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeWhoSawAllocationQuestionnaires",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BOB", this);
            event179Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("PartyMakingTheApplication",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "CLAIMANT", this);
            event179Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent179, event179Questions);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 196 is created as expected on a County Court Case with a Track set to
     * SMALL CLAIM TRACK.
     */
    public void testCaseEvent196_CC ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            // Set the Track to SMALL CLAIM
            myUC002CaseEventUtils.setTrack ("SMALL CLAIM TRACK");
            myUC002CaseEventUtils.clickSaveButton ();

            // Add Case Event 196
            myUC002CaseEventUtils.openAddEventPopup ("196");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            // Navigate to the Maintain Obligations screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            if (this.isConfirmationPresent ())
            {
                this.getConfirmation ();
            }

            // Check the default days and the Obligation Typoe being created
            assertEquals ("17", myUC009MaintainObligationsUtils.getNewObligationDays ());
            assertEquals ("32", myUC009MaintainObligationsUtils.getObligationType ());
            assertEquals ("DQ DUE - SCT", myUC009MaintainObligationsUtils.getObligationTypeDescription ());
            final String expiryDate = myUC009MaintainObligationsUtils.getExpiryDate ();
            myUC009MaintainObligationsUtils.clickAddObligationSaveButton ();

            // Navigate to the variable data screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals ("Enter Variable Data CJR032A"))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("SelectItemLsB", VariableDataQuestion.VD_FIELD_TYPE_SELECT,
                            "A copy of the defence has already been sent to you by the defendant", this);
            vdQ1.setQuestionValue ();

            // Check this field has the same value as the Obligation Expiry Date
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("QuestReturnDate", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, this);
            assertEquals (expiryDate, vdQ2.getQuestionValue ());

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("AllocationPayable",
                    VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
            vdQ3.setQuestionValue ();

            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("AQFilingFee", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
            vdQ4.setQuestionValue ();

            // Click Save and loop until have returned to the Case Events screen
            vdQ4.clickVariableDataSaveButton ();
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                if (session.isConfirmationPresent ())
                {
                    session.getConfirmation ();
                }
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check BMS and event decsription + check Obligation has been created
            myUC002CaseEventUtils.selectCaseEventByEventId ("196");
            assertEquals ("JH77", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N149 DIRECTIONS QUESTIONNAIRE SENT", myUC002CaseEventUtils.getEventDescription ());
            assertTrue ("Obligation Type 32 not created", checkObligationCreatedOnCase (caseNumber, "32"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 196 is created as expected on a District Registry Case with a Track set to
     * FAST TRACK.
     */
    public void testCaseEvent196_DR ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00002";
            mLoginAndLoadCase (caseNumber);

            // Set the Track to SMALL CLAIM
            myUC002CaseEventUtils.setTrack ("FAST TRACK");
            myUC002CaseEventUtils.clickSaveButton ();

            // Add Case Event 196
            myUC002CaseEventUtils.openAddEventPopup ("196");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            // Navigate to the Maintain Obligations screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            if (this.isConfirmationPresent ())
            {
                this.getConfirmation ();
            }

            // Check the default days and the Obligation Typoe being created
            assertEquals ("31", myUC009MaintainObligationsUtils.getNewObligationDays ());
            assertEquals ("33", myUC009MaintainObligationsUtils.getObligationType ());
            assertEquals ("DQ DUE - FT/MT", myUC009MaintainObligationsUtils.getObligationTypeDescription ());
            final String expiryDate = myUC009MaintainObligationsUtils.getExpiryDate ();
            myUC009MaintainObligationsUtils.clickAddObligationSaveButton ();

            // Navigate to the variable data screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals ("Enter Variable Data CJR032B"))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "The states paid defence was not accepted", this);
            vdQ1.setQuestionValue ();

            // Check this field has the same value as the Obligation Expiry Date
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("QuestReturnDate", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, this);
            assertEquals (expiryDate, vdQ2.getQuestionValue ());

            // Click Save and loop until have returned to the Case Events screen
            vdQ2.clickVariableDataSaveButton ();
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                if (session.isConfirmationPresent ())
                {
                    session.getConfirmation ();
                }
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check BMS and event decsription + check Obligation has been created
            myUC002CaseEventUtils.selectCaseEventByEventId ("196");
            assertEquals ("DR56", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N149 DIRECTIONS QUESTIONNAIRE SENT", myUC002CaseEventUtils.getEventDescription ());
            assertTrue ("Obligation Type 33 not created", checkObligationCreatedOnCase (caseNumber, "33"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 196 is created as expected on a CCBC Case with a Track set to
     * MULTI TRACK.
     */
    public void testCaseEvent196_CCBC ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3QX00001";
            mLoginAndLoadCase (caseNumber);

            // Set the Track to SMALL CLAIM
            myUC002CaseEventUtils.setTrack ("MULTI TRACK");
            myUC002CaseEventUtils.clickSaveButton ();

            // Add Case Event 196
            myUC002CaseEventUtils.openAddEventPopup ("196");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            // Navigate to the Maintain Obligations screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            if (this.isConfirmationPresent ())
            {
                this.getConfirmation ();
            }

            // Check the default days and the Obligation Typoe being created
            assertEquals ("31", myUC009MaintainObligationsUtils.getNewObligationDays ());
            assertEquals ("33", myUC009MaintainObligationsUtils.getObligationType ());
            assertEquals ("DQ DUE - FT/MT", myUC009MaintainObligationsUtils.getObligationTypeDescription ());
            final String expiryDate = myUC009MaintainObligationsUtils.getExpiryDate ();
            myUC009MaintainObligationsUtils.clickAddObligationSaveButton ();

            // Navigate to the variable data screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals ("Enter Variable Data CJR032C"))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "The part admission was not accepted", this);
            vdQ1.setQuestionValue ();

            // Check this field has the same value as the Obligation Expiry Date
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("QuestReturnDate", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, this);
            assertEquals (expiryDate, vdQ2.getQuestionValue ());

            // Click Save and loop until have returned to the Case Events screen
            vdQ2.clickVariableDataSaveButton ();
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                if (session.isConfirmationPresent ())
                {
                    session.getConfirmation ();
                }
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check BMS and event decsription + check Obligation has been created
            myUC002CaseEventUtils.selectCaseEventByEventId ("196");
            assertEquals ("BC040", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N149 DIRECTIONS QUESTIONNAIRE SENT", myUC002CaseEventUtils.getEventDescription ());
            assertTrue ("Obligation Type 33 not created", checkObligationCreatedOnCase (caseNumber, "33"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Case Event 196 is created as expected on a MCOL Case with a Track set to
     * FAST TRACK.
     */
    public void testCaseEvent196_MCOL ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3QX00002";
            mLoginAndLoadCase (caseNumber);

            // Check event cannot be created if the Track has not set
            myUC002CaseEventUtils.openAddEventPopup ("196");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_NO_TRACK_SET);

            // Set the Track to FAST TRACK
            myUC002CaseEventUtils.setTrack ("FAST TRACK");
            myUC002CaseEventUtils.clickSaveButton ();

            // Add Case Event 196
            myUC002CaseEventUtils.openAddEventPopup ("196");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            // Navigate to the Maintain Obligations screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            if (this.isConfirmationPresent ())
            {
                this.getConfirmation ();
            }

            // Check the default days and the Obligation Typoe being created
            assertEquals ("31", myUC009MaintainObligationsUtils.getNewObligationDays ());
            assertEquals ("33", myUC009MaintainObligationsUtils.getObligationType ());
            assertEquals ("DQ DUE - FT/MT", myUC009MaintainObligationsUtils.getObligationTypeDescription ());
            final String expiryDate = myUC009MaintainObligationsUtils.getExpiryDate ();
            myUC009MaintainObligationsUtils.clickAddObligationSaveButton ();

            // Navigate to the variable data screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals ("Enter Variable Data CJR032B"))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "The part admission was not accepted", this);
            vdQ1.setQuestionValue ();

            // Check this field has the same value as the Obligation Expiry Date
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("QuestReturnDate", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, this);
            assertEquals (expiryDate, vdQ2.getQuestionValue ());

            // Click Save and loop until have returned to the Case Events screen
            vdQ2.clickVariableDataSaveButton ();
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                if (session.isConfirmationPresent ())
                {
                    session.getConfirmation ();
                }
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check BMS and event decsription + check Obligation has been created
            myUC002CaseEventUtils.selectCaseEventByEventId ("196");
            assertEquals ("BC040", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N149 DIRECTIONS QUESTIONNAIRE SENT", myUC002CaseEventUtils.getEventDescription ());
            assertTrue ("Obligation Type 33 not created", checkObligationCreatedOnCase (caseNumber, "33"));

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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     *
     * @param pCaseNumber Case number to load
     */
    private void mLoginAndLoadCase (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber (pCaseNumber);
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

}