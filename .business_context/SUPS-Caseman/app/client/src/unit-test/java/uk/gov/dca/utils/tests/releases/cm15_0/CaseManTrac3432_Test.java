/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9357 $
 * $Author: vincentcp $
 * $Date: 2012-01-05 10:09:53 +0000 (Thu, 05 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm15_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 3432.
 * 
 * Test to show a Solicitor's name in the variable paragraph screen for a Solicitor having a '&' character
 * in the Solicitor's name.
 *
 * @author Des Johnston
 */
public class CaseManTrac3432_Test extends AbstractCmTestBase
{
    // Private member variables for the screen utils

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The case number B. */
    private String caseNumberB = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac3432_Test ()
    {
        super (CaseManTrac3432_Test.class.getName ());
        this.nav = new Navigator (this);

        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests a 708 event with a '&' character in the Solicitor's name.
     */
    public void test708Event ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberB);

            /**
             * Create Event 708
             * Set Instigator grid
             * Variable Data Screen (Word Processing Output)
             */
            final NewStandardEvent testEvent708 = new NewStandardEvent ("708");
            testEvent708.setInstigatorParty ("CLAIMANT & NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event708Questions = new LinkedList<VariableDataQuestion> ();

            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("CFOAccNumber", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "123456", this);
            event708Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("CourtFunds", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
            event708Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("TotalInvestAmnt", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1000", this);
            event708Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("LitigationFriend",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Litigation Name", this);
            event708Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("LitFriendAddL1",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Litigation ADD1", this);
            event708Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("LitFriendAdd2",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Litigation ADD2", this);
            event708Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("DateOfBirth",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "13-AUG-1970", this);
            event708Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("Solicitor", VariableDataQuestion.VD_FIELD_TYPE_GRID,
                            "Solicitor 1 (CLAIMANT ONE & SOLICITORS) for Claimant 1 (CLAIMANT & NAME)", 1, this);
            event708Questions.add (vdQ8);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent708, event708Questions);

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
