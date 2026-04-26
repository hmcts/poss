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

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.EventConfig;
import uk.gov.dca.utils.eventconfig.EventManager;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the CaseMan Defect 2431. This covers the variable data screen for AE Event 874.
 * The popup should allow user to select Hearings in the future as well as Hearings in the past.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2431_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /**
     * Constructor.
     */
    public CaseManTrac2431_Test ()
    {
        super (CaseManTrac2431_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that the Variable Data screen for AE Event 874 allows the user to select Hearings
     * in the future as well as the past. A Hearing in the past is loaded with the data flat file
     * and a future Hearing is added as part of AE Event 873 before testing AE Event 874.
     */
    public void testAEEvent874 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC092AEEventUtils.loadAEByCaseNumber ("9NN00001");

            /**
             * Create Event 873 to generate a future AE Hearing
             * Issue Stage
             * No Obligations
             * Variable Data Screen (Oracle Report Output)
             */
            final NewStandardEvent testEvent873 = new NewStandardEvent ("873");
            testEvent873.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event873Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event873Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event873Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event873Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event873Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("IsDebtorMaleOrFemale",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "MALE", this);
            event873Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("DateOfHearing", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (1, AbstractBaseUtils.DATE_FORMAT_NOW, false), this);
            event873Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("TimeOfHearing", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", this);
            event873Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("HearingAtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event873Questions.add (vdQ8);

            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("MaximumFine", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event873Questions.add (vdQ9);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent873, event873Questions);

            // Add AE Event 874
            myUC092AEEventUtils.setMasterEventId ("874");
            myUC092AEEventUtils.clickAddEventButton ();
            myUC092AEEventUtils.clickSaveNewEventButton ();

            // Loop until have arrived on the variable data screen
            final NewStandardEvent testEvent874 = new NewStandardEvent ("874");
            final EventManager eventConfigManager = EventManager.getInstance ();
            final EventConfig eventConfig = eventConfigManager.getEventConfig (testEvent874.getEventId ());
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf (eventConfig.getVariableDataScreenTitle ()) == -1)
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            final String futureDateModel = AbstractBaseUtils.getFutureDate (1, AbstractBaseUtils.DATE_FORMAT_NOW, false);
            final String futureDateDisplay = AbstractBaseUtils.getFutureDate (1, AbstractBaseUtils.DATE_FORMAT_DISPLAY, false);

            // On Variable Data screen, open popup, select hearing in past and click Ok to close popup
            // Check text in text field has correct value
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("SelectHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON, this); // LOV Button

            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, "09-JUL-2010", 4, this); // Select Hearing Grid configured
                                                                                      // to select 09-JUL-2010 in column
                                                                                      // 4 (Date)

            final VariableDataQuestion vdQ12 =
                    new VariableDataQuestion ("SelectHearing_OKBtn", VariableDataQuestion.VD_FIELD_TYPE_BUTTON, this); // Ok
                                                                                                                       // button
                                                                                                                       // on
                                                                                                                       // Select
                                                                                                                       // Hearing
                                                                                                                       // Popup

            final VariableDataQuestion vdQ13 =
                    new VariableDataQuestion ("SelectHearingUsingLOV", VariableDataQuestion.VD_FIELD_TYPE_TEXT, this); // Text
                                                                                                                       // field
                                                                                                                       // displaying
                                                                                                                       // details
                                                                                                                       // of
                                                                                                                       // Hearing
                                                                                                                       // selected,
                                                                                                                       // not
                                                                                                                       // configured
                                                                                                                       // with
                                                                                                                       // value

            final VariableDataQuestion vdQ14 = new VariableDataQuestion ("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID, futureDateModel.toUpperCase (), 4, this); // Select Hearing
                                                                                                       // Grid
                                                                                                       // configured to
                                                                                                       // select
                                                                                                       // SYSDATE+1 in
                                                                                                       // column 4
                                                                                                       // (Date)

            // Click the LOV Button to open popup with Grid on it
            vdQ10.setQuestionValue ();

            // Select the correct value in the Grid
            vdQ11.setQuestionValue ();

            // Click the Ok on the popup to close it
            vdQ12.setQuestionValue ();

            // Check correct value is displayed in the text field
            assertEquals ("N62E 2010-07-09 12:00 NORTHAMPTON", vdQ13.getQuestionValue ());
            /**
             * assertTrue("Hearing field details are not as expected. (Actual: " + vdQ13.getQuestionValue() + ")",
             * vdQ13.getQuestionValue().equals("N62E 2010-07-09 12:00 NORTHAMPTON"));
             **/

            // Now open popup again, select hearing in future and click Ok to close popup
            // Check text in text field has correct value

            // Click the LOV Button to open popup with Grid on it
            vdQ10.setQuestionValue ();

            // Select the correct value in the Grid
            vdQ14.setQuestionValue ();

            // Click the Ok on the popup to close it
            vdQ12.setQuestionValue ();

            // Check correct value is displayed in the text field
            assertEquals ("N62E " + futureDateDisplay + " 12:00 NORTHAMPTON", vdQ13.getQuestionValue ());
            /**
             * assertTrue("Hearing field details are not as expected. (Actual: " + vdQ14.getQuestionValue() + ")",
             * vdQ14.getQuestionValue().equals("N62E " + futureDateDisplay + " 12:00 NORTHAMPTON"));
             **/

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