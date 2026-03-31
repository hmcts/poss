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

package uk.gov.dca.utils.tests.outputs;

import java.util.Iterator;
import java.util.LinkedList;

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
public class CaseTransferNoticeTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /**
     * Constructor.
     */
    public CaseTransferNoticeTest ()
    {
        super (CaseTransferNoticeTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Generates CJR018A (Transfer Notice).
     */
    public void testCJR018A ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Counterclaim", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_DEFENCE_FILED);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018A", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018B (Transfer Notice).
     */
    public void testCJR018B ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Deal with the claimant's application", this);
            eventQuestions.add (vdQ1);

            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationFor", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_ADMISSION);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018B", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018C (Transfer Notice).
     */
    public void testCJR018C ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CaseTransferedTo", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_SPECIALIST);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018C", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018D (Transfer Notice).
     */
    public void testCJR018D ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CaseProceedingOn", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_FIXING_TRIAL);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018D", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018E (Transfer Notice).
     */
    public void testCJR018E ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationFor", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_HIGH_CRT_ENF);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018E", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018F (Transfer Notice).
     */
    public void testCJR018F ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AllocationToTrack", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_ALLOCATION);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018F", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018G (Transfer Notice).
     */
    public void testCJR018G ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TransferOrderDate", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_DJ_ORD);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018G", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018H (Transfer Notice).
     */
    public void testCJR018H ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TransferOrderDate", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_DIRCTNS_AFTER_ALLOC);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018H", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018I (Transfer Notice).
     */
    public void testCJR018I ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("Wording",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Deal with the claimant's application", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationFor", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_APP_SET_ASIDE);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018I", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018J (Transfer Notice).
     */
    public void testCJR018J ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen (null, eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018K (Transfer Notice).
     */
    public void testCJR018K ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AllocationToTrack", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_CLAIM_REFUSE);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen ("Enter Variable Data CJR018K", eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018L (Transfer Notice).
     */
    public void testCJR018L ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_APP_LIFT_STAY);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen (null, eventQuestions, true);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR018M (Transfer Notice).
     */
    public void testCJR018M ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer ("3NN00015");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_INTERLOC_JUDGE);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Deal with word processing screens
            handleVDScreen (null, eventQuestions, true);
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
     * Login load case transfer.
     *
     * @param caseNumber the case number
     */
    private void loginLoadCaseTransfer (final String caseNumber)
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
    }

    /**
     * Private function to handle the navigation to the variable data screen.
     *
     * @param vdTitle Title of the variale data screen
     * @param pQuestionList the question list
     * @param fckEditor the fck editor
     * @paran pQuestionList Linked list of variable data screen questions
     */
    private void handleVDScreen (final String vdTitle, final LinkedList<VariableDataQuestion> pQuestionList, final boolean fckEditor)
    {
        String pageTitle = "";
        if (null != vdTitle)
        {
            // Loop until have arrived on the variable data screen
            pageTitle = this.getPageTitle ();
            while (pageTitle.indexOf (vdTitle) == -1)
            {
                this.waitForPageToLoad ();
                pageTitle = this.getPageTitle ();
            }

            // When on variable data screen, deal with the question list passed in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = pQuestionList.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            this.getButtonAdaptor (VARIABLE_DATA_SAVE_BUTTON).click ();
            this.waitForPageToLoad ();
            if (this.isAlertPresent ())
            {
                this.getAlert ();
                this.waitForPageToLoad ();
            }
        }

        if (fckEditor)
        {
            // Event wants to navigate to the WP FCK Editor screen
            pageTitle = this.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                this.waitForPageToLoad ();
                pageTitle = this.getPageTitle ();
            }

            // Tick the final checkbox
            this.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL).click ();

            // Click Ok/Cancel on FCK Editor screen
            this.getButtonAdaptor (FCK_EDITOR_OK_BUTTON).click ();
        }

        // Loop until are back in Transfer Cases screen
        pageTitle = this.getPageTitle ();
        while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
        {
            if (this.isConfirmationPresent ())
            {
                this.getConfirmation ();
            }

            this.waitForPageToLoad ();
            pageTitle = this.getPageTitle ();
        }
    }

}