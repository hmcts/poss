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

package uk.gov.dca.utils.tests.bulk_printing;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Transfer functionality following the bulk printing release.
 *
 * @author Chris Vincent
 */
public class WiderAreaTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case number. */
    // Test cases
    private String caseNumber = "2NN00001";
    
    /** The co number. */
    private String coNumber = "120001NN";

    /**
     * Constructor.
     */
    public WiderAreaTest ()
    {
        super (WiderAreaTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Creates the AE Event 100 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testAEEvent100 ()
    {
        try
        {
            // Log into SUPS CaseMan and load AE on AE Events screen
            mLoginAndLoadAE (caseNumber);

            /**
             * Create Event 100
             * No Issue Stage
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "100";
            final NewStandardEvent testEvent100 = new NewStandardEvent (eventId + "-AE");
            testEvent100.setNavigateObligations (true);
            testEvent100.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event100Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event100Questions.add (vdQ1);

            // Add the AE event
            myUC092AEEventUtils.addNewEvent (testEvent100, event100Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC092AEEventUtils.selectGridRowByEventId (eventId);
            myUC092AEEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the AE Event 105 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testAEEvent105 ()
    {
        try
        {
            // Log into SUPS CaseMan and load AE on AE Events screen
            mLoginAndLoadAE (caseNumber);

            /**
             * Create Event 105
             * No Issue Stage
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "105";
            final NewStandardEvent testEvent105 = new NewStandardEvent (eventId);
            testEvent105.setNavigateObligations (true);
            testEvent105.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event105Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event105Questions.add (vdQ1);

            // Add the AE event
            myUC092AEEventUtils.addNewEvent (testEvent105, event105Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC092AEEventUtils.selectGridRowByEventId (eventId);
            myUC092AEEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the CO Event 105 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testCOEvent105 ()
    {
        try
        {
            // Log into SUPS CaseMan and load CO on CO Events screen
            mLoginAndLoadCO (coNumber);

            /**
             * Create Event 105 (AO & CAEO)
             * No Issue Stage / Service Status
             * No Creditor
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "105";
            final NewStandardEvent testEvent105 = new NewStandardEvent (eventId);
            testEvent105.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event105Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event105Questions.add (vdQ1);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent105, event105Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC116COEventUtils.doubleClickCOEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in CO Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC116COEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC116COEventUtils.selectGridRowByEventId (eventId);
            myUC116COEventUtils.setEventErrorFlag (true);
            myUC116COEventUtils.setEventErrorFlag (false);
            myUC116COEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the CO Event 332 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testCOEvent332 ()
    {
        try
        {
            // Log into SUPS CaseMan and load CO on CO Events screen
            mLoginAndLoadCO (coNumber);

            /**
             * Create Event 332
             * No Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "332";
            final NewStandardEvent testEvent332 = new NewStandardEvent ("CO-" + eventId);
            testEvent332.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event332Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event332Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event332Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("EnterText",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "Donkey Dungeons are wrong", this);
            event332Questions.add (vdQ3);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent332, event332Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC116COEventUtils.doubleClickCOEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in CO Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC116COEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC116COEventUtils.selectGridRowByEventId (eventId);
            myUC116COEventUtils.setEventErrorFlag (true);
            myUC116COEventUtils.setEventErrorFlag (false);
            myUC116COEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the CO Event 966 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testCOEvent966 ()
    {
        try
        {
            // Log into SUPS CaseMan and load CO on CO Events screen
            mLoginAndLoadCO (coNumber);

            /**
             * Create Event 966
             * Select Creditor from list
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "966";
            final NewStandardEvent testEvent966 = new NewStandardEvent (eventId);
            testEvent966.setCreditor ("Debt 1 - CREDITOR ONE NAME");
            testEvent966.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event966Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event966Questions.add (vdQ1);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent966, event966Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC116COEventUtils.doubleClickCOEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in CO Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC116COEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC116COEventUtils.selectGridRowByEventId (eventId);
            myUC116COEventUtils.setEventErrorFlag (true);
            myUC116COEventUtils.setEventErrorFlag (false);
            myUC116COEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the Warrant Return 159 and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testWarrantReturn159 ()
    {
        try
        {
            // Log into SUPS CaseMan and load Warrant on Warrant Returns screen
            mLoginAndLoadWarrant (caseNumber);

            /**
             * Create Warrant Return 159 (Home & Foreign)
             * Optional Details field
             * Notice field editable (defaults to unchecked)
             * Appointment fields read only
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "159";
            final NewStandardEvent testEvent159 = new NewStandardEvent ("WarrantReturn-" + eventId);
            testEvent159.setSubjectParty ("DEBTOR EMP NAME");
            testEvent159.setCheckNotice (false);
            testEvent159.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event159Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OrderSuspend",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Previous judgment", this);
            event159Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("ApplicationBy",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Debtor", this);
            event159Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("DateOfPayment", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false), this);
            event159Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("OrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event159Questions.add (vdQ4);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent159, event159Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the AE Event
            myUC045WarrantReturnsUtils.selectGridRowByEventId (eventId);
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Creates the Warrant Return AX and the output associated with it. The test then
     * checks that a REPORT_MAP row has not been created. The output is initially not
     * marked as final and the test returns to the FCK Editor to complete the output
     * before finally checking the erroring off of the event.
     */
    public void testWarrantReturnAX ()
    {
        try
        {
            // Log into SUPS CaseMan and load Warrant on Warrant Returns screen
            mLoginAndLoadWarrant (caseNumber);

            // Configure the event
            final String eventId = "AX";
            final NewStandardEvent testEventAX = new NewStandardEvent ("WarrantReturn-" + eventId);
            testEventAX.setSubjectParty ("DEFENDANT ONE NAME");
            testEventAX.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAXQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAXQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAX, eventAXQuestions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click the event to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the Warrant Return
            myUC045WarrantReturnsUtils.selectGridRowByEventId (eventId);
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test performs updates to a Judgment on the Maintain Judgments screen to generate automatic
     * case events (and warrant returns), together with some word processing outputs. After the updates
     * checks that no REPORT_MAP rows have been created.
     */
    public void testJudgmentAutomaticEvents ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load case
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Raise the Application to Set Aside Popup and click Add to launch another popup
            myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
            myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();

            // Set the Applicant field on the Add Application to Set Aside Popup and Click Ok to close
            myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_CONSENT);
            myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();

            // Set the Result and Result Date fields on the Application to Set Aside Popup and Click Ok to Close
            myUC004MaintainJudgmentUtils.setSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);
            myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

            // Click the Save button
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted (false);

            // Exit the Maintain Judgments screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check in correct screen (now in Case Events)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
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
     *
     * @param caseNumber The Case number to load
     */
    private void mLoginAndLoadAE (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to CO Events and loads a CO Number.
     *
     * @param pCONumber The CO Number to load
     */
    private void mLoginAndLoadCO (final String pCONumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

        // Load Consolidated Order
        myUC116COEventUtils.loadCOByCONumber (pCONumber);
    }

    /**
     * Private function that logs the user into CaseMan and navigates to Warrant Returns screen
     * to load a Warrant record.
     *
     * @param caseNumber The Case number to load
     */
    private void mLoginAndLoadWarrant (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

        myUC045WarrantReturnsUtils.setCaseNumber (caseNumber);
        myUC045WarrantReturnsUtils.clickSearchButton ();
    }

}