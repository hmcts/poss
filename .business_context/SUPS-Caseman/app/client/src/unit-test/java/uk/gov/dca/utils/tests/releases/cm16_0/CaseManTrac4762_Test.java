/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9770 $
 * $Author: vincentcp $
 * $Date: 2013-02-19 15:16:15 +0000 (Tue, 19 Feb 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm16_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan change Trac 4762.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4762_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4762_Test ()
    {
        super (CaseManTrac4762_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Checks that new case event 395 can be created on a County Court case, the correct
     * BMS is created and a hearing is created.
     */
    public void testCreateCaseEvent395_CC ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "395";
            final NewStandardEvent testEvent395 = new NewStandardEvent (eventId);
            testEvent395.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent395.setInstigatorParty ("DEFENDANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event395Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event395Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event395Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event395Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event395Questions.add (vdQ4);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent395, event395Questions);

            // Check the correct BMS Task has been written and the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("JH75", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REQUEST FOR PROVISIONAL ASSESSMENT", myUC002CaseEventUtils.getEventDescription ());

            // Check that the TAXATION hearing has been created
            assertTrue ("Taxation hearing not created", checkTaxationHearingCreatedonCase (caseNumber));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that new case event 395 can be created on a District Registry case, the correct
     * BMS is created and a hearing is created.
     */
    public void testCreateCaseEvent395_DR ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00002";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "395";
            final NewStandardEvent testEvent395 = new NewStandardEvent (eventId);
            testEvent395.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent395.setInstigatorParty ("PART 20 DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event395Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event395Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event395Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event395Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("HearingTime", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event395Questions.add (vdQ4);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent395, event395Questions);

            // Check the correct BMS Task has been written and the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("JH75", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REQUEST FOR PROVISIONAL ASSESSMENT", myUC002CaseEventUtils.getEventDescription ());

            // Check that the TAXATION hearing has been created
            assertTrue ("Taxation hearing not created", checkTaxationHearingCreatedonCase (caseNumber));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that new case event 396 can be created on a County Court case and the correct
     * BMS is created.
     */
    public void testCreateCaseEvent396_CC ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "396";
            final NewStandardEvent testEvent396 = new NewStandardEvent (eventId);
            testEvent396.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent396.setInstigatorParty ("DEFENDANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event396Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ProvisionalAssessmentCosts",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "5000.00", this);
            event396Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent396, event396Questions);

            // Check the correct BMS Task has been written and the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("JH74", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N253A NOTICE OF PROVISIONAL ASSESSMENT", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that new case event 396 can be created on a District Registry case and the correct
     * BMS is created.
     */
    public void testCreateCaseEvent396_DR ()
    {
        try
        {
            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00002";
            mLoginAndLoadCase (caseNumber);

            final String eventId = "396";
            final NewStandardEvent testEvent396 = new NewStandardEvent (eventId);
            testEvent396.setSubjectParty ("Part 20 Claimant 1 - PART 20 CLAIMANT NAME");
            testEvent396.setInstigatorParty ("CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event396Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ProvisionalAssessmentCosts",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event396Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent396, event396Questions);

            // Check the correct BMS Task has been written and the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            assertEquals ("JH74", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("N253A NOTICE OF PROVISIONAL ASSESSMENT", myUC002CaseEventUtils.getEventDescription ());
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
     * Checks that the TAXATION hearing has been created on a given case.
     *
     * @param pCaseNumber The case number to check
     * @return True if a hearing has been created, else false
     */
    private boolean checkTaxationHearingCreatedonCase (final String pCaseNumber)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM hearings WHERE " + "case_number = '" +
                pCaseNumber + "' AND hrg_type = 'TAXATION'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}