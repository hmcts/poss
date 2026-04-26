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

package uk.gov.dca.utils.tests.fam_enf;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class RFS4813_1_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 029 create home warrant utils. */
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // FAMILY ENF - FAMILY COURT case
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // FAMILY ENF - REMO case (has judgment)

    /**
     * Constructor.
     */
    public RFS4813_1_Test ()
    {
        super (RFS4813_1_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Tests case creation with the new case type FAMILY ENF - FAMILY COURT.
     */
    public void testCaseCreation1 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterUpdateCase ();

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A16NN001");

            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_FAMILY);
            assertTrue ("Case Type invalid when should be valid", myUC001CreateUpdateCaseUtils.isCaseTypeFieldValid ());

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup and then close it
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and exit screen
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load the new case
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A16NN001");

            myUC002CaseEventUtils.selectCaseEventByEventId ("1");
            assertEquals ("MA001", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case creation with the new case type FAMILY ENF - REMO.
     */
    public void testCaseCreation2 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterUpdateCase ();

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A16NN001");

            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_REMO);
            assertTrue ("Case Type invalid when should be valid", myUC001CreateUpdateCaseUtils.isCaseTypeFieldValid ());

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup and then close it
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and exit screen
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load the new case
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A16NN001");

            myUC002CaseEventUtils.selectCaseEventByEventId ("1");
            assertEquals ("MA002", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the transfer of a FAMILY ENF - FAMILY COURT case.
     */
    public void testTransferCase_1 ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer (famEnfCase1);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Counterclaim", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_DEFENCE_FILED);
            assertFalse ("New Case Type field enabled when should be disabled",
                    myUC003TransferCaseUtils.isNewCaseTypeEnabled ());

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
     * Tests the transfer of a FAMILY ENF - REMO case.
     */
    public void testTransferCase_2 ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer (famEnfCase2);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Counterclaim", this));

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_DEFENCE_FILED);
            assertFalse ("New Case Type field enabled when should be disabled",
                    myUC003TransferCaseUtils.isNewCaseTypeEnabled ());
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
     * Tests the changing of the case type on a FAMILY ENF - FAMILY COURT case.
     */
    public void testChangeCaseType_1 ()
    {
        try
        {
            // Login and load case
            mLoginAndLoadCaseEvents (famEnfCase1);

            // Change the case type
            myUC002CaseEventUtils.resetCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_REMO);

            // Navigate to the Create Cases screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check the case type has been changed
            assertEquals (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_REMO,
                    myUC001CreateUpdateCaseUtils.getCaseType ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the changing of the case type on a FAMILY ENF - REMO case.
     */
    public void testChangeCaseType_2 ()
    {
        try
        {
            // Login and load case
            mLoginAndLoadCaseEvents (famEnfCase2);

            // Change the case type
            myUC002CaseEventUtils.resetCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_FAMILY);

            // Navigate to the Create Cases screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check the case type has been changed
            assertEquals (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_FAMILY,
                    myUC001CreateUpdateCaseUtils.getCaseType ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a Home Warrant on a FAMILY ENF - FAMILY COURT case.
     */
    public void testCreateHomeWarrant_1 ()
    {
        try
        {
            // Get into the Create Home Warrants screen and load a case
            mLoginAndLoadHomeWarrants (famEnfCase1);

            // Check the correct default warrant type
            assertEquals ("CONTROL", myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a Home Warrant on a FAMILY ENF - REMO case.
     */
    public void testCreateHomeWarrant_2 ()
    {
        try
        {
            // Get into the Create Home Warrants screen and load a case
            mLoginAndLoadHomeWarrants (famEnfCase2);

            // Check the correct default warrant type
            assertEquals ("CONTROL", myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
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

    /**
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     *
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndLoadCaseEvents (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber (pCaseNumber);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to the Update Cases screen.
     */
    private void mLoginAndEnterUpdateCase ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());
    }

    /**
     * Private function that logs the user into CaseMan, navigates to the Create Home Warrants screen
     * and loads a case record.
     *
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndLoadHomeWarrants (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create Home Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

        // Set the Header fields
        myUC029CreateHomeWarrantUtils.setCaseNumber (pCaseNumber);
    }

    /**
     * Logs the user in, navigates to case events, loads a case and enters the transfer cases
     * screen.
     *
     * @param caseNumber The case number to load
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