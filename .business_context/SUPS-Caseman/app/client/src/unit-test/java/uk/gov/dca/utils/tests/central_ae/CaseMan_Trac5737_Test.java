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

package uk.gov.dca.utils.tests.central_ae;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
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
public class CaseMan_Trac5737_Test extends AbstractCmTestBase
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

    /** The case number 1. */
    private String caseNumber1 = "A15NN005"; // DEBTORS PETITION case
    
    /** The case number 2. */
    private String caseNumber2 = "A15NN009"; // APP ON DEBT PETITION case with minimum no insolvency party types

    /**
     * Constructor.
     */
    public CaseMan_Trac5737_Test ()
    {
        super (CaseMan_Trac5737_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Tests case creation with the DEBTORS PETITION and APP ON DEBT PETITION
     * case types.
     */
    public void testCaseCreation ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterUpdateCase ();

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A16NN001");

            // Set Case Type to DEBTORS PETITION and ensure the Case Type field is invalid
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_DEBT_PETITION);
            assertFalse ("Case Type valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseTypeFieldValid ());

            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_APP_ON_DEBT_PETITION);
            assertTrue ("Case Type invalid when should be valid", myUC001CreateUpdateCaseUtils.isCaseTypeFieldValid ());

            myUC001CreateUpdateCaseUtils.setInsolvencyNumber ("0001");
            myUC001CreateUpdateCaseUtils.setInsolvencyYear ("2016");

            // Add Debtor
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEBTOR);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEBTOR NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("DEBTOR ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("DEBTOR ADLINE2");

            // Add Creditor
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CREDITOR);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CREDITOR NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("CREDITOR ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("CREDITOR ADLINE2");

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
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
            assertEquals ("IN29", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the transfer of a DEBTORS PETITION case.
     */
    public void testTransferCase_1 ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer (caseNumber1);

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
     * Tests the transfer of a APP ON DEBT PETITION case.
     */
    public void testTransferCase_2 ()
    {
        try
        {
            // Login and load case
            loginLoadCaseTransfer (caseNumber2);

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
     * Tests the changing of the case type on a DEBTORS PETITION case.
     */
    public void testChangeCaseType_1 ()
    {
        try
        {
            // Login and load case
            mLoginAndLoadCaseEvents (caseNumber1);

            // Change the case type
            myUC002CaseEventUtils.resetCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_APP_ON_DEBT_PETITION);

            // Navigate to the Create Cases screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check the case type has been changed
            assertEquals (UC001CreateUpdateCaseUtils.CASE_TYPE_APP_ON_DEBT_PETITION,
                    myUC001CreateUpdateCaseUtils.getCaseType ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the changing of the case type on a APP ON DEBT PETITION case.
     */
    public void testChangeCaseType_2 ()
    {
        try
        {
            // Login and load case
            mLoginAndLoadCaseEvents (caseNumber2);

            // Change the case type
            myUC002CaseEventUtils.resetCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CRED_PETITION);

            // Navigate to the Create Cases screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check the case type has been changed
            assertEquals (UC001CreateUpdateCaseUtils.CASE_TYPE_CRED_PETITION,
                    myUC001CreateUpdateCaseUtils.getCaseType ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a Home Warrant on a APP ON DEBT PETITION case.
     */
    public void testCreateHomeWarrant_1 ()
    {
        try
        {
            // Get into the Create Home Warrants screen and load a case
            mLoginAndLoadHomeWarrants (caseNumber2);

            // Set the party for and party against rows accordingly
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CREDITOR NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR NAME");

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
     * Test to create a Home Warrant on a DEBTORS PETITION case.
     */
    public void testCreateHomeWarrant_2 ()
    {
        try
        {
            // Get into the Create Home Warrants screen and load a case
            mLoginAndLoadHomeWarrants (caseNumber1);

            // Set the party for and party against rows accordingly
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CREDITOR NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR NAME");

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
     * Generates L_BLANK (Case Event 100).
     */
    public void testL_BLANK_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber1);
            final NewStandardEvent testEvent = new NewStandardEvent ("100");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check the BMS recorded
            myUC002CaseEventUtils.selectCaseEventByEventId ("100");
            assertEquals ("IN25", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_6_1_2_3_4_7 (Case Event 106).
     */
    public void testL_6_1_2_3_4_7_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber1);
            final NewStandardEvent testEvent = new NewStandardEvent ("106");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectLetter3", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_14_1 (Case Event 115).
     */
    public void testL_14_1_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber1);
            final NewStandardEvent testEvent = new NewStandardEvent ("115");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK (Case Event 100).
     */
    public void testL_BLANK_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber2);
            final NewStandardEvent testEvent = new NewStandardEvent ("100");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check the BMS recorded
            myUC002CaseEventUtils.selectCaseEventByEventId ("100");
            assertEquals ("IN25", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_6_1_2_3_4_7 (Case Event 106).
     */
    public void testL_6_1_2_3_4_7_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber2);
            final NewStandardEvent testEvent = new NewStandardEvent ("106");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectLetter3", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_14_1 (Case Event 115).
     */
    public void testL_14_1_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCaseEvents (caseNumber2);
            final NewStandardEvent testEvent = new NewStandardEvent ("115");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
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