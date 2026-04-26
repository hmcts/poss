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

package uk.gov.dca.utils.tests.releases.cm6_0;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 1947. This covers the creation of Case event 38
 * after the creation of Oracle Report Case events on other Cases.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1947_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case number A. */
    private String caseNumberA = "0NN00001";
    
    /** The case number B. */
    private String caseNumberB = "0NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac1947_Test ()
    {
        super (CaseManTrac1947_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);

    }

    /**
     * Scenario One
     * User loads Case A and creates Case Event 9 (Oracle Report event)
     * User clears details
     * User loads Case B and creates Case Event 38 (Word Processing event)
     * Variable data screen displays details of party on Case B.
     */
    public void testCaseEvent38PartyDetails1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number A
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberA);

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

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Load Case Number B
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberB);

            // Add Case Event 38
            myUC002CaseEventUtils.openAddEventPopup ("38");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            this.waitForPageToLoad ();

            // Check in correct Variable Data screen
            mCheckPageTitle ("Enter Variable Data CJR011");

            // Set the appropriate fields and check the Solicitor details
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("NewAddressForService", VariableDataQuestion.VD_FIELD_TYPE_SELECT,
                            "Acknowledgment filed by solicitors giving a new address", this);
            event38Questions.add (vdQ3);

            // When on variable data screen, deal with the question list passed in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = event38Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Get the Name and First 2 address lines from the variable data screen
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("SolName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("NewAddL1", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("NewAddL2", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);

            // Ensure the details are those of Case B
            assertTrue ("Solicitor name does not match expected value",
                    vdQ4.getQuestionValue ().equals ("CASE B SOLICITOR NAME"));
            assertTrue ("Solicitor Address Line 1 does not match expected value",
                    vdQ5.getQuestionValue ().equals ("CASE B SOLICITOR ADLINE1"));
            assertTrue ("Solicitor Address Line 2 does not match expected value",
                    vdQ6.getQuestionValue ().equals ("CASE B SOLICITOR ADLINE2"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Scenario Two
     * User loads Case A and creates Case Event 9 (Oracle Report event)
     * User closes Case Events screen and then re-enters screen
     * User loads Case B and creates Case Event 38 (Word Processing event)
     * Variable data screen displays details of party on Case B.
     */
    public void testCaseEvent38PartyDetails2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number A
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberA);

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

            // Exit the Case Events screen
            myUC002CaseEventUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number B
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberB);

            // Add Case Event 38
            myUC002CaseEventUtils.openAddEventPopup ("38");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            this.waitForPageToLoad ();

            // Check in correct Variable Data screen
            mCheckPageTitle ("Enter Variable Data CJR011");

            // Set the appropriate fields and check the Solicitor details
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defendant has a new address for service", this);
            event38Questions.add (vdQ3);

            // When on variable data screen, deal with the question list passed in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = event38Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Get the First 2 address lines from the variable data screen
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("NewAddL1", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("NewAddL2", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);

            // Ensure the details are those of Case B
            assertTrue ("Defendant Address Line 1 does not match expected value",
                    vdQ4.getQuestionValue ().equals ("CASE B DEFENDANT ADLINE1"));
            assertTrue ("Defendant Address Line 2 does not match expected value",
                    vdQ5.getQuestionValue ().equals ("CASE B DEFENDANT ADLINE2"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Scenario Three
     * User loads Case A and creates Case Event 9 (Oracle Report event)
     * User loads Case B by entering new Case Number in Case Number field (without clearing details)
     * User creates Case Event 38 (Word Processing event)
     * Variable data screen displays details of party on Case B.
     */
    public void testCaseEvent38PartyDetails3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number A
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberA);

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

            // Load Case Number B without clearing or closing screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberB);

            // Add Case Event 38
            myUC002CaseEventUtils.openAddEventPopup ("38");
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            this.waitForPageToLoad ();

            // Check in correct Variable Data screen
            mCheckPageTitle ("Enter Variable Data CJR011");

            // Set the appropriate fields and check the Solicitor details
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("NewAddressForService", VariableDataQuestion.VD_FIELD_TYPE_SELECT,
                            "Acknowledgment filed by solicitors giving a new address", this);
            event38Questions.add (vdQ3);

            // When on variable data screen, deal with the question list passed in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = event38Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Get the Name and First 2 address lines from the variable data screen
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("SolName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("NewAddL1", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("NewAddL2", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this);

            // Ensure the details are those of Case B
            assertTrue ("Solicitor name does not match expected value",
                    vdQ4.getQuestionValue ().equals ("CASE B SOLICITOR NAME"));
            assertTrue ("Solicitor Address Line 1 does not match expected value",
                    vdQ5.getQuestionValue ().equals ("CASE B SOLICITOR ADLINE1"));
            assertTrue ("Solicitor Address Line 2 does not match expected value",
                    vdQ6.getQuestionValue ().equals ("CASE B SOLICITOR ADLINE2"));

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

}