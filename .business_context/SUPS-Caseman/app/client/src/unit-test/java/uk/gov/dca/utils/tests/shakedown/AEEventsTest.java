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
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the AE Events screen.
 *
 * @author Chris Vincent
 */
public class AEEventsTest extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /**
     * Constructor.
     */
    public AEEventsTest ()
    {
        super (AEEventsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Test to create different AE Events with different configurations.
     */
    public void testCreateAEEvents1 ()
    {
        try
        {
            // Login and Load AE record
            mLoginAndLoadAE ();

            /**
             * Create Event 105
             * No Issue Stage
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent105 = new NewStandardEvent ("105");
            testEvent105.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event105Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event105Questions.add (vdQ1);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent105, event105Questions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different AE Events with different configurations.
     */
    public void testCreateAEEvents2 ()
    {
        try
        {
            // Login and Load AE record
            mLoginAndLoadAE ();

            /**
             * Create Event 864
             * Issue Stage
             * No Obligations
             * Variable Data Screen (Oracle Report Output)
             */
            final NewStandardEvent testEvent864 = new NewStandardEvent ("864");
            testEvent864.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event864Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event864Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event864Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event864Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event864Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("IsDebtorMaleOrFemale",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "MALE", this);
            event864Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("DateOfHearing", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (70, AbstractBaseUtils.DATE_FORMAT_NOW, false), this);
            event864Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("TimeOfHearing", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event864Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("HearingAtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event864Questions.add (vdQ8);

            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("MaximumFine", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event864Questions.add (vdQ9);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent864, event864Questions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to update different AE Events with different configurations.
     */
    public void testUpdateAEEvents ()
    {
        try
        {
            // Login and Load AE record
            mLoginAndLoadAE ();

            // Mark the currently selected AE Event as not served
            myUC092AEEventUtils.markEventAsNotServed ();

            // Exit screen
            myUC092AEEventUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan, navigates to AE Events and loads an AE record.
     */
    private void mLoginAndLoadAE ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC092AEEventUtils.loadAEByCaseNumber ("9NN00001");
    }

}