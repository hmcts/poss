/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9850 $
 * $Author: vincentcp $
 * $Date: 2013-04-18 12:44:16 +0100 (Thu, 18 Apr 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bulk_printing;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Transfer functionality following the bulk printing release.
 *
 * @author Chris Vincent
 */
public class CaseTransferTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "2NN00001";
    
    /** The case number 2. */
    private String caseNumber2 = "2NN00002";
    
    /** The case number 3. */
    private String caseNumber3 = "2NN00003";
    
    /** The ccbc case. */
    private String ccbcCase = "2QX00001";

    /**
     * Constructor.
     */
    public CaseTransferTest ()
    {
        super (CaseTransferTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Tests that a non CCBC Case produces a REPORT_MAP row when transferred with
     * a transfer reason of For High Court Enforcement (CJR018E) and that REPORT_MAP
     * row is removed when the event 350 is errored.
     */
    public void testTransferCase1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber1);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_HIGH_CRT_ENF);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Loop until are in Variable Data screen
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data CJR018E") == -1)
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Continue with Transfer
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);
            vdQ1.setQuestionValue ();

            // Click Save on the Variable Data screen
            vdQ1.clickVariableDataSaveButton ();

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("350", caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("350", caseNumber1));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("350");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a non CCBC Case produces a REPORT_MAP row when transferred with
     * a transfer reason of Charging Order (CJR018J) and that REPORT_MAP
     * row is removed when the event 350 is errored.
     */
    public void testTransferCase2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber1);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Setup a dummy VariableDataQuestion (to access FCK Editor components)
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);

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

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("350", caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("350", caseNumber1));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("350");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a CCBC Case produces a REPORT_MAP row when transferred with
     * a transfer reason of CCBC SOLICITOR NO LONGER ACTING (CJR018J) and that REPORT_MAP
     * row is removed when the event 340 is errored.
     */
    public void testTransferCase3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (ccbcCase);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_SOL_NOT_ACT);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Setup a dummy VariableDataQuestion (to access FCK Editor components)
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);

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

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N271_CC"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("340", ccbcCase));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("340", ccbcCase));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("340");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CC"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a non CCBC Case DOES NOT produce a REPORT_MAP row when transferred with
     * a transfer reason of Application to set Judgment Aside (CJR018I) and that no errors
     * occur when the event 350 is errored and unerrored.
     */
    public void testTransferCase4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber2);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_APP_SET_ASIDE);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Loop until are in Variable Data screen
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data CJR018I") == -1)
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Continue with Transfer
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Deal with the claimant's application", this);
            vdQ1.setQuestionValue ();

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);
            vdQ2.setQuestionValue ();

            // Click Save on the Variable Data screen
            vdQ1.clickVariableDataSaveButton ();

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent ("350", caseNumber2));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("350");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a non CCBC Case with parties requesting translation to Welsh DOES NOT
     * produce a REPORT_MAP row when transferred with a transfer reason of For High Court Enforcement (CJR018E).
     */
    public void testTransferCase5 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber3);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_HIGH_CRT_ENF);
            myUC003TransferCaseUtils.clickSaveButton ();

            if (session.isAlertPresent ())
            {
                session.getAlert ();
            }

            // Loop until are in Variable Data screen
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data CJR018E") == -1)
            {
                session.waitForPageToLoad ();
                if (session.isAlertPresent ())
                {
                    session.getAlert ();
                }
                pageTitle = session.getPageTitle ();
            }

            // Continue with Transfer
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);
            vdQ1.setQuestionValue ();

            // Click Save on the Variable Data screen
            vdQ1.clickVariableDataSaveButton ();

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent ("350", caseNumber3));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("350");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a non CCBC Case DOES NOT produce a REPORT_MAP row when transferred with
     * a transfer reason of For High Court Enforcement (CJR018E) and the output is not marked
     * as final. When the user returns to the FCK Editor screen and finalises the output, tests
     * that the REPORT_MAP row is created..
     */
    public void testTransferCase6 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber1);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_HIGH_CRT_ENF);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Loop until are in Variable Data screen
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data CJR018E") == -1)
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Continue with Transfer
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);
            vdQ1.setQuestionValue ();

            // Click Save on the Variable Data screen
            vdQ1.clickVariableDataSaveButton ();

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as NOT final and exit
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Exit Transfer Case screen
            myUC003TransferCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Double click on the Case Event 350 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId ("350");

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N271_CM"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("350", caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("350", caseNumber1));

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

}