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
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the CO Events screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_COEvents_Test extends AbstractCmTestBase
{
    
    /** The my UC 116 CO event utils. */
    // Private member variables for the screen utils
    private UC116COEventUtils myUC116COEventUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_COEvents_Test ()
    {
        super (CaseManNumbering_COEvents_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Tests Warrant creation with CO Event 856 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCOEvent856WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("CO-856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("EnterItemDetails",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend adjourned hearing", this);
            event856Questions.add (vdQ6);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("856");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Tests Warrant creation with CO Event 876 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCOEvent876WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("CO-876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("876");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Tests Warrant creation with CO Event 856 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCOEvent856WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (5);

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("CO-856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("EnterItemDetails",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend adjourned hearing", this);
            event856Questions.add (vdQ6);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("856");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Tests Warrant creation with CO Event 876 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCOEvent876WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (999999);

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("CO-876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("876");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Tests Warrant creation with CO Event 968 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCOEvent968WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 968
            final NewStandardEvent testEvent968 = new NewStandardEvent ("968");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event968Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("WarrantAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event968Questions.add (vdQ1);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent968, event968Questions);

            // Retrieve the last 8 characters of the 968 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("968");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Tests Warrant creation with CO Event 968 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCOEvent968WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (5);

            // Get to CO Events screen and load Case
            mLoginAndNavigateToScreen ();
            final String coNumber = "130001NN";
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 968
            final NewStandardEvent testEvent968 = new NewStandardEvent ("968");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event968Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("WarrantAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event968Questions.add (vdQ1);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent968, event968Questions);

            // Retrieve the last 8 characters of the 968 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("968");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
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
     * Private function that logs the user into CaseMan and navigates to the CO Events screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the CO Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());
    }

}