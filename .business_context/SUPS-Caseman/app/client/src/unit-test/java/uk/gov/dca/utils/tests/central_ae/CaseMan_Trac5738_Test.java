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

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5738_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 029 create home warrant utils. */
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The case number 1. */
    private String caseNumber1 = "A15NN001"; // APP INT ORD (INSOLV) case
    
    /** The case number 2. */
    private String caseNumber2 = "A15NN002"; // APP TO SET STAT DEMD case
    
    /** The case number 3. */
    private String caseNumber3 = "A15NN003"; // COMPANY ADMIN ORDER case
    
    /** The case number 4. */
    private String caseNumber4 = "A15NN004"; // CREDITORS PETITION case
    
    /** The case number 5. */
    private String caseNumber5 = "A15NN005"; // DEBTORS PETITION case
    
    /** The case number 6. */
    private String caseNumber6 = "A15NN006"; // WINDING UP PETITION case
    
    /** The case number 7. */
    private String caseNumber7 = "A15NN007"; // APP ON DEBT PETITION case
    
    /** The case number 8. */
    private String caseNumber8 = "A15NN008"; // APP ON DEBT PETITION case with all insolvency party types
    
    /** The case number 9. */
    private String caseNumber9 = "A15NN009"; // APP ON DEBT PETITION case with minimum no insolvency party types

    /**
     * Constructor.
     */
    public CaseMan_Trac5738_Test ()
    {
        super (CaseMan_Trac5738_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Tests that the Trustee party type cannot be created on an APP TO SET STAT DEMD case.
     */
    public void testTrusteeCreation_1 ()
    {
        try
        {
            // Get to Case Update screen and load Case
            mLoginAndEnterUpdateCase (caseNumber2);

            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());
        }
        catch (final Exception e)
        {
            if (e.getMessage ().indexOf ("Option with value 'TRUSTEE' not found") == -1)
            {
                fail (e.getMessage ());
            }
        }
    }

    /**
     * Tests that the Trustee party type can be created on the other insolvency case types.
     */
    public void testTrusteeCreation_2 ()
    {
        try
        {
            // Get to Case Update screen and load Case
            mLoginAndEnterUpdateCase (caseNumber1);

            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());

            myUC001CreateUpdateCaseUtils.clickClearButton ();
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber3);
            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());

            myUC001CreateUpdateCaseUtils.clickClearButton ();
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber4);
            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());

            myUC001CreateUpdateCaseUtils.clickClearButton ();
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber5);
            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());

            myUC001CreateUpdateCaseUtils.clickClearButton ();
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber6);
            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());

            myUC001CreateUpdateCaseUtils.clickClearButton ();
            myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber7);
            myUC001CreateUpdateCaseUtils.setNewPartyType (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertTrue ("Party type field is invalid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isNewPartyTypeValid ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Trustee party type attributes.
     */
    public void testTrusteeCreation_3 ()
    {
        try
        {
            // Get to Case Update screen and load Case
            mLoginAndEnterUpdateCase (caseNumber8);

            // Check that a maximum of 2 Trustees are allowed on the case
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_TRUSTEE);
            assertEquals ("You can only have a maximum of 2 of this party type", this.getAlertString ());

            // Select a Trustee party
            myUC001CreateUpdateCaseUtils.selectPartyByName ("TRUSTEE ONE NAME");

            // Check that for a Trustee, the coded party code field is enabled
            assertTrue ("Code field is disabled when should be enabled",
                    myUC001CreateUpdateCaseUtils.isNonSolPartyCodeFieldEnabled ());

            // Check for a Trustee, the date of birth field is disabled
            assertFalse ("DoB field is enabled when should be disabled",
                    myUC001CreateUpdateCaseUtils.isNonSolPartyDoBFieldEnabled ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record using the Trustee parties.
     */
    public void testCreateWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseNumber9);

            // Set the party for and party against rows accordingly
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("TRUSTEE ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("TRUSTEE TWO NAME");

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
     * Generates O_10_1 (Case Event 650).
     */
    public void testO_10_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("650");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("TRUSTEE TWO NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_2 (Case Event 651).
     */
    public void testO_10_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("651");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReportDeliveredDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderReasons", this));
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
     * Generates O_10_3 (Case Event 652).
     */
    public void testO_10_3 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("652");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn2", this));
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
     * Generates O_10_4 (Case Event 653).
     */
    public void testO_10_4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("653");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FilingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimExtendDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn2", this));
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
     * Generates O_10_5(Case Event 654).
     */
    public void testO_10_5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("654");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Affidavit", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitAddL1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitAddL2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrepaidPost", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AddressedTo", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceAddress1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceAddress2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PublishedIn", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServedonDay", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_6(Case Event 655).
     */
    public void testO_10_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("655");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PetitionInstructions", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RegistrationDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LRReference", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_7(Case Event 656).
     */
    public void testO_10_7 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("656");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
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
     * Generates O_10_8(Case Event 657).
     */
    public void testO_10_8 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("657");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderSubPetReason", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OriginalPetitioner",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
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
     * Generates O_10_9 (Case Event 658).
     */
    public void testO_10_9 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("658");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DaysServedby", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OriginalPetitioner",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
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
     * Generates O_10_10 (Case Event 659).
     */
    public void testO_10_10 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("659");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("TRUSTEE TWO NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Description", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_11 (Case Event 660).
     */
    public void testO_10_11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("660");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReportDate", this));
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
     * Generates O_10_12 (Case Event 661).
     */
    public void testO_10_12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("661");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Description", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
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
     * Generates O_10_13 (Case Event 662).
     */
    public void testO_10_13 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("662");
            testEvent.setSubjectParty ("Applicant 1 - APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("StatutoryDemandDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitSupportDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfApplication", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_14 (Case Event 663).
     */
    public void testO_10_14 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("663");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("TRUSTEE TWO NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PMApp",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_15 (Case Event 664).
     */
    public void testO_10_15 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("664");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyOption", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RegistrationDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LRReference", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NotificationInDays", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_16 (Case Event 665).
     */
    public void testO_10_16 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);

            // Pre-requisite event
            final NewStandardEvent testEvent661 = new NewStandardEvent ("661");
            testEvent661.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent661.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent661, null);

            final NewStandardEvent testEvent = new NewStandardEvent ("665");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_17 (Case Event 667).
     */
    public void testO_10_17 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("667");
            testEvent.setSubjectParty ("Applicant 1 - APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DemandIssued", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_18 (Case Event 668).
     */
    public void testO_10_18 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("668");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_19 (Case Event 669).
     */
    public void testO_10_19 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("669");
            testEvent.setSubjectParty ("Trustee 1 - TRUSTEE ONE NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationPresentedDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_20 (Case Event 670).
     */
    public void testO_10_20 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("670");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_11_1_2_3_4 (Case Event 690).
     */
    public void testO_11_1_2_3_4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumber8);
            final NewStandardEvent testEvent = new NewStandardEvent ("690");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AdjournedDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PetitionAdjournedTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostInstructions", this));

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
    private void mLoginAndLoadCase (final String pCaseNumber)
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
     * Private function that logs the user into CaseMan, navigates to the Update Cases and loads a Case Number.
     *
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndEnterUpdateCase (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

        // Load case
        myUC001CreateUpdateCaseUtils.setCaseNumber (pCaseNumber);
    }

}