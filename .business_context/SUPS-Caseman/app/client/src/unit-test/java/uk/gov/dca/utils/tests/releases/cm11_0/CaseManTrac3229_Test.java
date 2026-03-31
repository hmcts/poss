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

package uk.gov.dca.utils.tests.releases.cm11_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;

/**
 * Automated tests for the CaseMan Defect 3229. This covers the creation of Warrants
 * with Case Events 484, 485 and 490 to ensure the Warrant Issue Date is set to the
 * Case Event Event Date.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3229_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /** The case number 1. */
    private String caseNumber1 = "9NN00001";
    
    /** The case number 2. */
    private String caseNumber2 = "9NN00002";
    
    /** The case number 3. */
    private String caseNumber3 = "9NN00003";

    /**
     * Constructor.
     */
    public CaseManTrac3229_Test ()
    {
        super (CaseManTrac3229_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);

    }

    /**
     * Tests Warrant creation with Case Event 484 and the Warrant Issue Date
     * is set to the 484 Event Date.
     */
    public void testCaseEvent484WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber1);

            /**
             * Create Event 484
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent484 = new NewStandardEvent ("484");
            testEvent484.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent484.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent484.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event484Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event484Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event484Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event484Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event484Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event484Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79ADate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("N79AServiceDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("N79AComptemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend", this);
            event484Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ11);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent484, event484Questions);

            // Navigate to Maintain/Query Warrants
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Check the Warrant Issue Date is the same as the Case Event Event Date
            assertEquals ("Warrant Issue Date not correct set",
                    myUC039MaintainWarrantUtils.getIssueDate ().toUpperCase (),
                    AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true).toUpperCase ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 and the Warrant Issue Date
     * is set to the 485 Event Date.
     */
    public void testCaseEvent485WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber2);

            /**
             * Create Event 485
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent485 = new NewStandardEvent ("485");
            testEvent485.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent485.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent485.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event485Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event485Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("ArrestDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("N39ComtemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79AContemptDetails2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event485Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event485Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("N40BJudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ11);
            final VariableDataQuestion vdQ12 = new VariableDataQuestion ("N40BJudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ12);
            final VariableDataQuestion vdQ13 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ13);
            final VariableDataQuestion vdQ14 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ14);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent485, event485Questions);

            // Navigate to Maintain/Query Warrants
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Check the Warrant Issue Date is the same as the Case Event Event Date
            assertEquals ("Warrant Issue Date not correct set",
                    myUC039MaintainWarrantUtils.getIssueDate ().toUpperCase (),
                    AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true).toUpperCase ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 490 and the Warrant Issue Date
     * is set to the 490 Event Date.
     */
    public void testCaseEvent490WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber3);

            /**
             * Create Event 490
             * Subject only
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screen
             * FCK Editor
             */
            final NewStandardEvent testEvent490 = new NewStandardEvent ("490");
            testEvent490.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent490.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent490.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event490Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event490Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event490Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("InjunctionDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event490Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent490, event490Questions);

            // Navigate to Maintain/Query Warrants
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Check the Warrant Issue Date is the same as the Case Event Event Date
            assertEquals ("Warrant Issue Date not correct set",
                    myUC039MaintainWarrantUtils.getIssueDate ().toUpperCase (),
                    AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true).toUpperCase ());
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