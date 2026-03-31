/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the AE Events screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_AEEvents_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_AEEvents_Test ()
    {
        super (CaseManNumbering_AEEvents_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the AE Events screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to AE Events screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC092AEEventUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid", myUC092AEEventUtils.isCaseNumberValid ());
            myUC092AEEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC092AEEventUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC092AEEventUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid", myUC092AEEventUtils.isCaseNumberValid ());

                myUC092AEEventUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the AE Events screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to AE Events screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC092AEEventUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid", myUC092AEEventUtils.isCaseNumberValid ());
            myUC092AEEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC092AEEventUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC092AEEventUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid", myUC092AEEventUtils.isCaseNumberValid ());

                myUC092AEEventUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 856 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testAEEvent856WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to AE Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String caseNumber = "A01NN001";
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("EnterTheLengthOfCommittal",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("ItemDetails", VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "DETAILS", this);
            event856Questions.add (vdQ8);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("856");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 876 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testAEEvent876WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to AE Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String caseNumber = "A01NN001";
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("876");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 856 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testAEEvent856WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (5);

            // Get to AE Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String caseNumber = "A01NN001";
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("EnterTheLengthOfCommittal",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("ItemDetails", VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "DETAILS", this);
            event856Questions.add (vdQ8);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("856");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the NEXT_WARRANT_NUMBER
            // database sequence
            assertEquals ("1A000005", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 876 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testAEEvent876WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (999999);

            // Get to AE Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String caseNumber = "A01NN001";
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("876");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the NEXT_WARRANT_NUMBER
            // database sequence
            assertEquals ("1A999999", warrantNumber);
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
     * Private function that logs the user into CaseMan and navigates to the AE Events screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the AE Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());
    }

}