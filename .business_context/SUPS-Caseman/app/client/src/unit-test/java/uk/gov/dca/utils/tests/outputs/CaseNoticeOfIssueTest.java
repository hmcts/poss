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

package uk.gov.dca.utils.tests.outputs;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;

/**
 * Automated tests for the CaseMan shakedown suite. These tests
 * concentrate on the Create Cases screen.
 *
 * @author Chris Vincent
 */
public class CaseNoticeOfIssueTest extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /**
     * Constructor.
     */
    public CaseNoticeOfIssueTest ()
    {
        super (CaseNoticeOfIssueTest.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Generates CJR002 (Notice of Issue N205A).
     */
    public void testCJR002 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N205A
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY, false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR003 (Notice of Issue N205B).
     */
    public void testCJR003 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N205B
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_UNSPEC_ONLY, false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * ***************************************************************.
     */

    /**
     * Generates CJR179 (Notice of Issue N205C)
     */
    public void testCJR179 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClaimServedBy", this));

            // Create Case that will produce the output N205C
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_MULTI_OTHER, false);

            handleVDScreen ("Enter Variable Data CJR179", eventQuestions, false);

            myUC001CreateUpdateCaseUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR183 (Notice of Issue N205D).
     */
    public void testCJR183 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DeceasedEstateName", this));

            // Create Case that will produce the output N205D
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CH_CLAIM_PROBATE, false);

            handleVDScreen ("Enter Variable Data CJR183", eventQuestions, false);

            myUC001CreateUpdateCaseUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR185 (Notice of Issue N209).
     */
    public void testCJR185 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClaimServedBy", this));

            // Create Case that will produce the output N209
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_PART_8_CLAIM, false);

            handleVDScreen ("Enter Variable Data CJR185", eventQuestions, false);

            myUC001CreateUpdateCaseUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR187 (Notice of Issue N205B).
     */
    public void testCJR187 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N205B
            myUC001CreateUpdateCaseUtils.createDefaultCaseWithHearing ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CH_ORIG_APPLN, false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR188 (Notice of Issue N206A).
     */
    public void testCJR188 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N206A
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CH_ACC_POSSN, false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR189 (Notice of Issue N206B).
     */
    public void testCJR189 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N206B
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A15NN100", UC001CreateUpdateCaseUtils.CASE_TYPE_MORT_POSSN,
                    false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR190 (Notice of Issue N206D).
     */
    public void testCJR190 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            // Create Case that will produce the output N206D
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A15NN100",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_DEMOTION_CLAIM, false);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_14_8 (Insolvency Output).
     */
    public void testL_14_8 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterScreen ();

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A15NN100");

            // Set Case Type
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_APP_STAT_DEMD);

            myUC001CreateUpdateCaseUtils.setInsolvencyNumber ("1234");
            myUC001CreateUpdateCaseUtils.setInsolvencyYear ("2015");

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_APPLICANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("APPLICANT NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("APPLICANT ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("APPLICANT ADLINE2");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CREDITOR);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CREDITOR NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("CREDITOR ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("CREDITOR ADLINE2");

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and handle WP processing
            myUC001CreateUpdateCaseUtils.saveCase ();

            handleVDScreen ("Enter Variable Data L_14_8", eventQuestions, true);

            myUC001CreateUpdateCaseUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function that logs the user into CaseMan, navigates to Create/Update Case Details screen.
     */
    private void mLoginAndEnterScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());
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
     * Private function to handle the navigation to the variable data screen.
     *
     * @param vdTitle Title of the variale data screen
     * @param pQuestionList the question list
     * @param fckEditor the fck editor
     * @paran pQuestionList Linked list of variable data screen questions
     */
    private void handleVDScreen (final String vdTitle, final LinkedList<VariableDataQuestion> pQuestionList, final boolean fckEditor)
    {
        // Loop until have arrived on the variable data screen
        String pageTitle = this.getPageTitle ();
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

        // Loop until are back in Case Creation screen
        pageTitle = this.getPageTitle ();
        while ( !pageTitle.equals (myUC001CreateUpdateCaseUtils.getScreenTitle ()))
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