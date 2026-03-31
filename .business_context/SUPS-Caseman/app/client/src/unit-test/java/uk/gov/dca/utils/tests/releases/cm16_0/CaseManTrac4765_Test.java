/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm16_0;

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
public class CaseManTrac4765_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The case number. */
    // Test cases
    private String caseNumber = "3NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac4765_Test ()
    {
        super (CaseManTrac4765_Test.class.getName ());
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
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Blank", VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA, this);
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

            // Error off the Case Event 350
            myUC002CaseEventUtils.selectCaseEventByEventId ("350");
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Error off the Case Event 370
            myUC002CaseEventUtils.selectCaseEventByEventId ("370");
            myUC002CaseEventUtils.setEventErrorFlag (true);

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