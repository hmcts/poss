/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 *****************************************/

package uk.gov.dca.utils.tests.scalability;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC012RunOrderPrintingUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the scalabililty change to the Run Order Printing
 * screen.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_RunOrderPrintingTest extends AbstractCmTestBase
{

    /** The my UC 012 run order printing utils. */
    // Private member variables for the screen utils
    private UC012RunOrderPrintingUtils myUC012RunOrderPrintingUtils;

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManScalability_RunOrderPrintingTest ()
    {
        super (CaseManScalability_RunOrderPrintingTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC012RunOrderPrintingUtils = new UC012RunOrderPrintingUtils (this);
        this.myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Basic test that the screen returns some outputs based on a wildcard search
     * and the print selected output functionality works.
     */
    public void testRunOrderPrintingFunctionality ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Generate Pre Req Case Event Outputs
            mGeneratePreReqData ();

            // Navigate to the Run Order Printing screen
            this.nav.navigateFromMainMenu (MAINMENU_RUN_ORDER_PRINTING_PATH);

            // Check in correct screen
            mCheckPageTitle (this.myUC012RunOrderPrintingUtils.getScreenTitle ());

            // check error messages are correct
            this.myUC012RunOrderPrintingUtils.setCaseNumber ("%%");
            assertFalse ("Case Number not rendered invalid", myUC012RunOrderPrintingUtils.isCaseNumberValid ());
            mCheckStatusBarText (UC012RunOrderPrintingUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // check error messages are correct
            this.myUC012RunOrderPrintingUtils.setCaseNumber ("123456");
            assertFalse ("Case Number not rendered invalid", myUC012RunOrderPrintingUtils.isCaseNumberValid ());
            mCheckStatusBarText (UC012RunOrderPrintingUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // check error messages are correct
            this.myUC012RunOrderPrintingUtils.setCaseNumber ("9NN");
            assertFalse ("Case Number not rendered invalid", myUC012RunOrderPrintingUtils.isCaseNumberValid ());
            mCheckStatusBarText (UC012RunOrderPrintingUtils.ERR_MSG_INVALID_CASE_NUMBER);

            this.myUC012RunOrderPrintingUtils.setCaseNumber ("%");

            this.myUC012RunOrderPrintingUtils.closeOutputsPopup ();

            this.myUC012RunOrderPrintingUtils.clearScreen ();

            this.myUC012RunOrderPrintingUtils.setCaseNumber ("9NN00001");

            this.myUC012RunOrderPrintingUtils.closeOutputsPopup ();

            this.myUC012RunOrderPrintingUtils.clearScreen ();

            this.myUC012RunOrderPrintingUtils.setCaseNumber ("%");

            this.myUC012RunOrderPrintingUtils.selectOutputByRowNumber (3);

            this.myUC012RunOrderPrintingUtils.printSelectedOutput ();

            this.myUC012RunOrderPrintingUtils.closeOutputsPopup ();

            this.myUC012RunOrderPrintingUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Handles the creation of sample data for the run order printing tests.
     * Case events are adding to different cases and outputs should be generated.
     *
     * @throws Exception Thrown if problem adding the case events.
     */
    private void mGeneratePreReqData () throws Exception
    {
        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Add the necessary case events to test against
        mCreateCaseEvent100 ("9NN00001");
        mCreateCaseEvent100 ("9NN00002");
        mCreateCaseEvent100 ("9NN00003");
        mCreateCaseEvent100 ("9NN00004");

        // Sets the WP Output rows generated to not printed so will appear
        // in Run Order Printing table.
        DBUtil.setWPOutputRowsNotPrinted ();

        // Exit Case Events screen
        myUC002CaseEventUtils.closeScreen ();

        // Reset Main Menu
        this.nav.navigateFromMainMenu (MAINMENU_RESET);
    }

    /**
     * Private method handles the loading of a case number on the Manage
     * Case Events screen, then the creation of case event 100.
     *
     * @param pCaseNumber Case number of the case to create the new event
     * @throws Exception Thrown if problem adding the new event.
     */
    private void mCreateCaseEvent100 (final String pCaseNumber) throws Exception
    {
        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (pCaseNumber);

        final NewStandardEvent testEvent100 = new NewStandardEvent ("100");
        testEvent100.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
        testEvent100.setNavigateObligations (true);
        testEvent100.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event100Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
        event100Questions.add (vdQ1);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent100, event100Questions);
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
     * Private method which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}