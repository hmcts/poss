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
import uk.gov.dca.utils.screens.UC009MaintainObligationsUtils;

/**
 * Automated tests for the CaseMan BIF Item #8.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem8_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 009 maintain obligations utils. */
    private UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem8_Test ()
    {
        super (CM_BIFItem8_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
    }

    /**
     * Checks that case event 770 can be created and that the event description for older 770's
     * is different to the new description.
     */
    public void testCaseEvent770 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            loginAndLoadCase ("3NN00001");

            // Check the description of an existing event
            myUC002CaseEventUtils.selectCaseEventByEventId ("770");
            assertEquals ("N173 NOTICE TO PAY DQ/LQ FEE", myUC002CaseEventUtils.getEventDescription ());
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Create new event 770
            final NewStandardEvent testEvent770 = new NewStandardEvent ("770");
            testEvent770.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent770.setObligationNotes ("LISTING OF YOUR CLAIM");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event770Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("UnpaidAmnt", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100.00", this);
            event770Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("ListedDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event770Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent770, event770Questions);

            // Check the new event description
            myUC002CaseEventUtils.selectCaseEventByEventId ("770");
            assertEquals ("N173 NOTICE TO PAY LQ FEE", myUC002CaseEventUtils.getEventDescription ());

            // Navigate to the Obligations screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_OBLIGATIONS);

            // Check in correct screen
            mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
            assertEquals ("TIME EXPIRED FOR PAYMENT OF LQ FEES",
                    myUC009MaintainObligationsUtils.getExistingObligationDescription ());

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

}