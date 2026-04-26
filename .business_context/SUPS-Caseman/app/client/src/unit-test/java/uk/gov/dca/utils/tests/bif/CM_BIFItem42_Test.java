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

package uk.gov.dca.utils.tests.bif;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan BIF Item #8.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem42_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem42_Test ()
    {
        super (CM_BIFItem42_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Checks that case event 182 can be created and that the event description for older 182's
     * is different to the new description.
     */
    public void testCaseEvent182 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            loginAndLoadCase ("3NN00001");

            // Create new event 182
            final NewStandardEvent testEvent182 = new NewStandardEvent ("182");
            testEvent182.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event182Questions = new LinkedList<VariableDataQuestion> ();

            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event182Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AppealNumber",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1111111111", this);
            event182Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("AppealDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event182Questions.add (vdQ3);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent182, event182Questions);

            assertTrue ("Unexpected number of REPORT_QUEUE rows", checkNumberReportQueueRows ("2"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     */
    private void loginAndLoadCase (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUPERADMIN);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
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
     * Checks the number of rows in the REPORT_QUEUE table.
     *
     * @param pExpectedRows Expected number of rows
     * @return True if the number of rows are as expected, else false
     */
    private boolean checkNumberReportQueueRows (final String pExpectedRows)
    {
        final String query = "SELECT DECODE(COUNT(*), " + pExpectedRows + ", 'true', 'false') FROM report_queue";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}