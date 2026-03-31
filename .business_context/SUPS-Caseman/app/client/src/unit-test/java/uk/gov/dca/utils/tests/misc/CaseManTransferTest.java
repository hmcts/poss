/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11766 $
 * $Author: vincentcp $
 * $Date: 2015-03-11 11:44:53 +0000 (Wed, 11 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.misc;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;

/**
 * Automated tests for the Case Transfer functionality following the bulk printing release.
 *
 * @author Chris Vincent
 */
public class CaseManTransferTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The case number. */
    // Test cases
    private String caseNumber = "0NN00001";

    /**
     * Constructor.
     */
    public CaseManTransferTest ()
    {
        super (CaseManTransferTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Tests that a non CCBC Case produces a REPORT_MAP row when transferred with
     * a transfer reason of For High Court Enforcement (CJR018E) and that REPORT_MAP
     * row is removed when the event 350 is errored.
     */
    public void testTransferCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            String pageTitle = null;
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, "The man in the red coat", this);

            for (int i = 0; i < 100; i++)
            {

                // Enter a Case which can navigate to the Transfer Cases screen
                myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

                // Navigate to the Transfer Cases screen
                this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

                // Check in Transfer Cases screen
                mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

                myUC003TransferCaseUtils.setTransferCourtCode ("180");
                myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_INTERLOC_JUDGE);
                myUC003TransferCaseUtils.clickSaveButton ();

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

                // Exit Transfer Case screen
                myUC003TransferCaseUtils.closeScreen ();

                // Check in correct screen
                mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

                myUC002CaseEventUtils.clearScreen ();

                // Enter a Case which can navigate to the Transfer Cases screen
                myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

                // Navigate to the Transfer Cases screen
                this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

                // Check in Transfer Cases screen
                mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

                myUC003TransferCaseUtils.setTransferCourtCode ("282");
                myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_HIGH_CRT_ENF);
                myUC003TransferCaseUtils.clickSaveButton ();

                // Loop until are in Variable Data screen
                pageTitle = session.getPageTitle ();
                while (pageTitle.indexOf ("Enter Variable Data CJR018E") == -1)
                {
                    session.waitForPageToLoad ();
                    pageTitle = session.getPageTitle ();
                }

                // Set variabale data screen question
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

                // Exit Transfer Case screen
                myUC003TransferCaseUtils.closeScreen ();

                // Check in correct screen
                mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

                myUC002CaseEventUtils.clearScreen ();

            }

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