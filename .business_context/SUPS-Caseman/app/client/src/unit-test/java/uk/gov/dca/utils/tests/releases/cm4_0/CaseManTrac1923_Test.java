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

package uk.gov.dca.utils.tests.releases.cm4_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 1923. This covers a change to the Variable Data
 * Screens for CJR023A (Event 210) and CJR023C (Event 214). A new field has been introduced
 * to allow the automatic case event 200 to have the BMS Code LS2.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1923_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The test case number. */
    // Case Number to use
    private String testCaseNumber = "0NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac1923_Test ()
    {
        super (CaseManTrac1923_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests case event 210 generates an automatic event 200 with a BMS of
     * LS2.
     */
    public void testCJR023A ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            /**
             * Create Event 210
             * No Subject
             * Mandatory Navigation to the Obligations screen
             * Word Processing Variable Data + FCK Editor
             */
            final NewStandardEvent testEvent210 = new NewStandardEvent ("210");

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

            // Have now returned to Case Events, select the new event 200 and check the BMS
            myUC002CaseEventUtils.selectCaseEventByEventId ("200");
            assertTrue ("Case Event Age Category is not equal to LS2",
                    myUC002CaseEventUtils.getEventBMSTask ().equals ("LS2"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 214 generates an automatic event 200 with a BMS of
     * LS2
     * 12/02/2013 - As part of CaseMan release 16, Case Event 214 is now obsolete
     * public void testCJR023C()
     * {
     * try
     * {
     * // Log into SUPS CaseMan
     * logOn(CMTestBase.COURT_NORTHAMPTON, CMTestBase.ROLE_WARRANT);
     * 
     * // Navigate to the Case Events screen
     * this.nav.navigateFromMainMenu( MAINMENU_CASE_EVENTS_PATH );
     * 
     * // Check in correct screen
     * mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
     * 
     * // Enter a valid case number
     * myUC002CaseEventUtils.loadCaseByCaseNumber(testCaseNumber);
     * 
     * /**
     * Create Event 214
     * No Subject
     * No Navigation to the Obligations screen
     * Word Processing Variable Data + FCK Editor
     * 
     * NewStandardEvent testEvent214 = new NewStandardEvent("214");
     * 
     * // Setup any variable data screen questions
     * LinkedList event214Questions = new LinkedList();
     * VariableDataQuestion vdQ1 = new VariableDataQuestion("JudgeTitle",
     * VariableDataQuestion.VD_FIELD_TYPE_SELECT,
     * "Circuit Judge",
     * this);
     * event214Questions.add(vdQ1);
     * VariableDataQuestion vdQ2 = new VariableDataQuestion("JudgeName",
     * VariableDataQuestion.VD_FIELD_TYPE_TEXT,
     * "Bob McBob",
     * this);
     * event214Questions.add(vdQ2);
     * VariableDataQuestion vdQ3 = new VariableDataQuestion("Allocation",
     * VariableDataQuestion.VD_FIELD_TYPE_SELECT,
     * "Claim",
     * this);
     * event214Questions.add(vdQ3);
     * VariableDataQuestion vdQ4 = new VariableDataQuestion("HearingDateReqd",
     * VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX,
     * "Y",
     * this);
     * event214Questions.add(vdQ4);
     * VariableDataQuestion vdQ5 = new VariableDataQuestion("HearingDate",
     * VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
     * AbstractBaseUtils.now(),
     * this);
     * event214Questions.add(vdQ5);
     * VariableDataQuestion vdQ6 = new VariableDataQuestion("HearingTime",
     * VariableDataQuestion.VD_FIELD_TYPE_TEXT,
     * "12:00",
     * this);
     * event214Questions.add(vdQ6);
     * VariableDataQuestion vdQ7 = new VariableDataQuestion("HearingTimeAllowed",
     * VariableDataQuestion.VD_FIELD_TYPE_TEXT,
     * "2",
     * this);
     * event214Questions.add(vdQ7);
     * VariableDataQuestion vdQ8 = new VariableDataQuestion("HearingTimeAllowedUnits",
     * VariableDataQuestion.VD_FIELD_TYPE_SELECT,
     * "Hours",
     * this);
     * event214Questions.add(vdQ8);
     * VariableDataQuestion vdQ9 = new VariableDataQuestion("HearingFee",
     * VariableDataQuestion.VD_FIELD_TYPE_TEXT,
     * "100.00",
     * this);
     * event214Questions.add(vdQ9);
     * VariableDataQuestion vdQ10 = new VariableDataQuestion("PayableByDate",
     * VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
     * AbstractBaseUtils.now(),
     * this);
     * event214Questions.add(vdQ10);
     * VariableDataQuestion vdQ11 = new VariableDataQuestion("DirectionsTypeReqd",
     * VariableDataQuestion.VD_FIELD_TYPE_SELECT,
     * "Holiday and wedding claims",
     * this);
     * event214Questions.add(vdQ11);
     * 
     * // Add the event
     * myUC002CaseEventUtils.addNewEvent(testEvent214, event214Questions);
     * 
     * // Have now returned to Case Events, select the new event 200 and check the BMS
     * myUC002CaseEventUtils.selectCaseEventByEventId("200");
     * assertTrue( "Case Event Age Category is not equal to LS2",
     * ( myUC002CaseEventUtils.getEventBMSTask().equals("LS2") ) );
     * 
     * }
     * catch(Exception e)
     * {
     * e.printStackTrace();
     * fail(e.getMessage());
     * }
     * }
     *
     * @param control the control
     */

    /**
     * Private function which checks the current screen title against the expected screen title
     *
     * @param control The expected screen title
     */
    private void mCheckPageTitle (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getPageTitle ().indexOf (control) != -1);
    }

}