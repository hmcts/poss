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
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC210MediationStatisticsUtils;

/**
 * Automated tests the Mediation changes in the BIF release.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem5_Test extends AbstractCmTestBase
{

    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 210 mediation statistics utils. */
    private UC210MediationStatisticsUtils myUC210MediationStatisticsUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem5_Test ()
    {
        super (CM_BIFItem5_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC210MediationStatisticsUtils = new UC210MediationStatisticsUtils (this);
    }

    /**
     * Tests the functionality around the mediation fields on the screen.
     */
    public void testCreateUpdateCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A04CV001");

            // Set Case Type
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");
            assertTrue ("Mediation tabbed page disabled when should be enabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Add Solicitor to Claimant
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();
            myUC001CreateUpdateCaseUtils.setNewSolicitorName ("CLAIMANT1 SOLICITOR NAME");
            myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            myUC001CreateUpdateCaseUtils.selectPartyByName ("CLAIMANT1 SOLICITOR NAME");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Add Defendant with mediation details
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");
            myUC001CreateUpdateCaseUtils.setMediationContactName ("MEDIATION NAME");
            myUC001CreateUpdateCaseUtils.setMediationTelNo ("0891 505050");
            myUC001CreateUpdateCaseUtils.setMediationEmail ("EEYOR@DONKEYDUNGEON.COM");
            myUC001CreateUpdateCaseUtils.setMediationNotes ("SOME NOTES");
            myUC001CreateUpdateCaseUtils.setMediationAvailability ("CAN ONLY DO TUESDAYS");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT TWO NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D2 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D2 ADLINE2");
            assertTrue ("Mediation tabbed page disabled when should be enabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and handle WP processing
            myUC001CreateUpdateCaseUtils.saveCase (true);
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Load the case just created and check values
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A04CV001");
            myUC001CreateUpdateCaseUtils.selectPartyByName ("DEFENDANT ONE NAME");
            assertEquals ("MEDIATION NAME", myUC001CreateUpdateCaseUtils.getMediationContactName ());
            assertEquals ("0891 505050", myUC001CreateUpdateCaseUtils.getMediationTelNo ());
            assertEquals ("EEYOR@DONKEYDUNGEON.COM", myUC001CreateUpdateCaseUtils.getMediationEmail ());
            assertEquals ("SOME NOTES", myUC001CreateUpdateCaseUtils.getMediationNotes ());
            assertEquals ("CAN ONLY DO TUESDAYS", myUC001CreateUpdateCaseUtils.getMediationAvailability ());

            // Update some details
            myUC001CreateUpdateCaseUtils.setMediationTelNo ("");
            myUC001CreateUpdateCaseUtils.setMediationEmail ("");
            myUC001CreateUpdateCaseUtils.selectPartyByName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setMediationContactName ("MEDIATION NAME");
            myUC001CreateUpdateCaseUtils.setMediationNotes ("SOME NOTES");
            myUC001CreateUpdateCaseUtils.setMediationAvailability ("CAN ONLY DO WEDNESDAYS");

            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Load the case just created and check values
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A04CV001");
            myUC001CreateUpdateCaseUtils.selectPartyByName ("DEFENDANT ONE NAME");
            assertEquals ("MEDIATION NAME", myUC001CreateUpdateCaseUtils.getMediationContactName ());
            assertEquals ("", myUC001CreateUpdateCaseUtils.getMediationTelNo ());
            assertEquals ("", myUC001CreateUpdateCaseUtils.getMediationEmail ());
            assertEquals ("SOME NOTES", myUC001CreateUpdateCaseUtils.getMediationNotes ());

            myUC001CreateUpdateCaseUtils.selectPartyByName ("CLAIMANT ONE NAME");
            assertEquals ("MEDIATION NAME", myUC001CreateUpdateCaseUtils.getMediationContactName ());
            assertEquals ("", myUC001CreateUpdateCaseUtils.getMediationTelNo ());
            assertEquals ("", myUC001CreateUpdateCaseUtils.getMediationEmail ());
            assertEquals ("SOME NOTES", myUC001CreateUpdateCaseUtils.getMediationNotes ());
            assertEquals ("CAN ONLY DO WEDNESDAYS", myUC001CreateUpdateCaseUtils.getMediationAvailability ());

            // Check email field validation
            myUC001CreateUpdateCaseUtils.setMediationEmail ("ARSEHOLE");
            assertFalse ("Mediation email valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isMediationEmailFieldValid ());
            myUC001CreateUpdateCaseUtils.setMediationEmail ("bigbadbarry@littlekingdom.com");
            assertTrue ("Mediation email invalid when should be valid",
                    myUC001CreateUpdateCaseUtils.isMediationEmailFieldValid ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Mediation fields are not available fr insolvency cases.
     */
    public void testInsolvencyCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a new COMPANY ADMIN ORDER case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A11CV051");

            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_COMPANY_ADMIN_ORDER);

            myUC001CreateUpdateCaseUtils.setInsolvencyNumber ("0001");

            myUC001CreateUpdateCaseUtils.setInsolvencyYear ("2014");

            // Create Company party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_COMPANY);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("COMPANY NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("COMPANY ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("COMPANY ADLINE2");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Create Creditor party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CREDITOR);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CREDITOR NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("CRED ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("CRED ADLINE2");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Create Insolvency Practitioner party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_INSOLV_PRACT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("INS PRAC NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("INS PRAC ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("INS PRAC ADLINE2");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Create Petitioner party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_PETITIONER);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("PETITIONER NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("PETITIONER ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("PETITIONER ADLINE2");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Create Official Receiver party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_OFF_REC);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("OFF REC NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("OFF REC ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("OFF REC ADLINE2");
            assertFalse ("Mediation tabbed page enabled when should be disabled", myUC001CreateUpdateCaseUtils
                    .isTabbedPageEnabled (UC001CreateUpdateCaseUtils.TABBED_PAGE_MEDIATION));

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            myUC001CreateUpdateCaseUtils.setAmountClaimed ("1000");

            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and handle WP processing
            myUC001CreateUpdateCaseUtils.saveCase (false);
            session.waitForPageToLoad ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of the new mediation events 541-549 on a County Court case.
     */
    public void testMediationEvents_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            /******************** Event 541 ****************************/

            final NewStandardEvent testEvent541 = new NewStandardEvent ("541");
            myUC002CaseEventUtils.addNewEvent (testEvent541, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("541");
            assertEquals ("MC1", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REFERRED TO MEDIATION (PRE ALLOCATION)", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 542 ****************************/

            final NewStandardEvent testEvent542 = new NewStandardEvent ("542");
            myUC002CaseEventUtils.addNewEvent (testEvent542, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("542");
            assertEquals ("MC2", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REFERRED TO MEDIATION (POST ALLOCATION)", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 543 ****************************/

            final NewStandardEvent testEvent543 = new NewStandardEvent ("543");
            testEvent543.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            // testEvent543.setInstigatorParty("DEFENDANT NAME");
            testEvent543.setEventDetails ("Event 543 Details");

            myUC002CaseEventUtils.addNewEvent (testEvent543, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("543");
            assertEquals ("MC3", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION TELEPHONE CALL OUT", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 544 ****************************/

            final NewStandardEvent testEvent544 = new NewStandardEvent ("544");
            testEvent544.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            // testEvent544.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent544, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("544");
            assertEquals ("MC4", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION TELEPHONE CALL IN", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 545 ****************************/

            final NewStandardEvent testEvent545 = new NewStandardEvent ("545");
            testEvent545.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            // testEvent545.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent545, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("545");
            assertEquals ("MC5", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION EMAIL RECEIVED", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 546 ****************************/

            final NewStandardEvent testEvent546 = new NewStandardEvent ("546");
            testEvent546.setEventDetails ("2: COMPANY -V- LIP");

            final LinkedList<VariableDataQuestion> lBlankMedQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            lBlankMedQuestions.add (vdQ1);

            myUC002CaseEventUtils.addNewEvent (testEvent546, lBlankMedQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("546");
            assertEquals ("MC6", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION APPOINTMENT BOOKED", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 547 ****************************/

            final NewStandardEvent testEvent547 = new NewStandardEvent ("547");
            testEvent547.setEventDetails ("4: LIP -V- LIP");
            myUC002CaseEventUtils.addNewEvent (testEvent547, lBlankMedQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("547");
            assertEquals ("MC7", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("SETTLED AT MEDIATION", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 548 ****************************/

            final NewStandardEvent testEvent548 = new NewStandardEvent ("548");
            testEvent548.setEventDetails ("4: FURTHER EVIDENCE REQUIRED");
            myUC002CaseEventUtils.addNewEvent (testEvent548, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("548");
            assertEquals ("MC8", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("NOT SETTLED AT MEDIATION", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 549 ****************************/

            final NewStandardEvent testEvent549 = new NewStandardEvent ("549");
            testEvent549.setEventDetails ("1: NOT ATTENDED - PARTY/IES NOT CONTACTABLE");
            myUC002CaseEventUtils.addNewEvent (testEvent549, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("549");
            assertEquals ("MC9", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION NOT CONDUCTED", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of the new mediation events 541-549 on a CCBC case.
     */
    public void testMediationEvents_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00005");

            /******************** Event 541 ****************************/

            final NewStandardEvent testEvent541 = new NewStandardEvent ("541");
            myUC002CaseEventUtils.addNewEvent (testEvent541, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("541");
            assertEquals ("ME1", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REFERRED TO MEDIATION (PRE ALLOCATION)", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 542 ****************************/

            final NewStandardEvent testEvent542 = new NewStandardEvent ("542");
            myUC002CaseEventUtils.addNewEvent (testEvent542, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("542");
            assertEquals ("ME2", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("REFERRED TO MEDIATION (POST ALLOCATION)", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 543 ****************************/

            final NewStandardEvent testEvent543 = new NewStandardEvent ("543");
            testEvent543.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            // testEvent543.setInstigatorParty("DEFENDANT NAME");
            testEvent543.setEventDetails ("Event 543 Details");

            myUC002CaseEventUtils.addNewEvent (testEvent543, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("543");
            assertEquals ("ME3", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION TELEPHONE CALL OUT", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 544 ****************************/

            final NewStandardEvent testEvent544 = new NewStandardEvent ("544");
            testEvent544.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            // testEvent544.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent544, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("544");
            assertEquals ("ME4", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION TELEPHONE CALL IN", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 545 ****************************/

            final NewStandardEvent testEvent545 = new NewStandardEvent ("545");
            testEvent545.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            // testEvent545.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent545, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("545");
            assertEquals ("ME5", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION EMAIL RECEIVED", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 546 ****************************/

            final NewStandardEvent testEvent546 = new NewStandardEvent ("546");
            testEvent546.setEventDetails ("1: COMPANY -V- COMPANY");

            final LinkedList<VariableDataQuestion> lBlankMedQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            lBlankMedQuestions.add (vdQ1);

            myUC002CaseEventUtils.addNewEvent (testEvent546, lBlankMedQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("546");
            assertEquals ("ME6", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION APPOINTMENT BOOKED", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 547 ****************************/

            final NewStandardEvent testEvent547 = new NewStandardEvent ("547");
            testEvent547.setEventDetails ("3: LIP -V- COMPANY");
            myUC002CaseEventUtils.addNewEvent (testEvent547, lBlankMedQuestions);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("547");
            assertEquals ("ME7", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("SETTLED AT MEDIATION", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 548 ****************************/

            final NewStandardEvent testEvent548 = new NewStandardEvent ("548");
            testEvent548.setEventDetails ("7: INAPPROPRIATE CASE");
            myUC002CaseEventUtils.addNewEvent (testEvent548, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("548");
            assertEquals ("ME8", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("NOT SETTLED AT MEDIATION", myUC002CaseEventUtils.getEventDescription ());

            /******************** Event 549 ****************************/

            final NewStandardEvent testEvent549 = new NewStandardEvent ("549");
            testEvent549.setEventDetails ("12: ABANDONED - PARTY/IES DO NOT ACCEPT TERMS");
            myUC002CaseEventUtils.addNewEvent (testEvent549, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("549");
            assertEquals ("ME9", myUC002CaseEventUtils.getEventBMSTask ());
            assertEquals ("MEDIATION NOT CONDUCTED", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the validation on new mediation event 547.
     */
    public void testMediationEvents_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00031");

            myUC002CaseEventUtils.openAddEventPopup ("547");

            // Check event is invalid and correct message displayed
            assertFalse ("Error, new event popup is open", myUC002CaseEventUtils.isAddEventPopupVisible ());
            mCheckStatusBarText ("Cannot add event, judgment exists.");

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the validation, and mandatory rules of the Mediation Statistics screen.
     */
    public void testMediationStatisticsParameters ()
    {
        String alertMessage = null;

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Mediation Statistics screen
            this.nav.navigateFromMainMenu (MAINMENU_MEDIATION_STATS_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC210MediationStatisticsUtils.getScreenTitle ());

            // Check all parameters initially blank
            assertEquals ("", myUC210MediationStatisticsUtils.getStartDate ());
            assertEquals ("", myUC210MediationStatisticsUtils.getEndDate ());

            // Check fields are all mandatory
            assertTrue ("Start Date optional when should be mandatory",
                    myUC210MediationStatisticsUtils.isStartDateMandatory ());
            assertTrue ("End Date optional when should be mandatory",
                    myUC210MediationStatisticsUtils.isEndDateMandatory ());

            // Test the Start and End Date parameter validation
            myUC210MediationStatisticsUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            alertMessage = myUC210MediationStatisticsUtils.runReportReturnAlertString ();
            assertEquals (UC210MediationStatisticsUtils.WARNING_INVALID_DATA, alertMessage);
            myUC210MediationStatisticsUtils.setStartDate ("");
            myUC210MediationStatisticsUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            alertMessage = myUC210MediationStatisticsUtils.runReportReturnAlertString ();
            assertEquals (UC210MediationStatisticsUtils.WARNING_INVALID_DATA, alertMessage);

            // Start Date must be before End Date validation
            myUC210MediationStatisticsUtils.setStartDate ("");
            myUC210MediationStatisticsUtils.setEndDate ("");
            myUC210MediationStatisticsUtils.setStartDate (AbstractBaseUtils.now ());
            myUC210MediationStatisticsUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertFalse ("Start Date valid when should be invalid",
                    myUC210MediationStatisticsUtils.isStartDateValid ());
            myUC210MediationStatisticsUtils.setStartDateFocus ();
            mCheckStatusBarText (UC210MediationStatisticsUtils.ERR_MSG_END_BEFORE_START);

            // Future Date validation
            myUC210MediationStatisticsUtils.setStartDate ("");
            myUC210MediationStatisticsUtils.setEndDate ("");
            myUC210MediationStatisticsUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertFalse ("Start Date valid when should be invalid",
                    myUC210MediationStatisticsUtils.isStartDateValid ());
            myUC210MediationStatisticsUtils.setStartDateFocus ();
            mCheckStatusBarText (UC210MediationStatisticsUtils.ERR_MSG_FUTURE_DATE);
            myUC210MediationStatisticsUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertFalse ("Start Date valid when should be invalid", myUC210MediationStatisticsUtils.isEndDateValid ());
            myUC210MediationStatisticsUtils.setEndDateFocus ();
            mCheckStatusBarText (UC210MediationStatisticsUtils.ERR_MSG_FUTURE_DATE);
            alertMessage = myUC210MediationStatisticsUtils.runReportReturnAlertString ();
            assertEquals (UC210MediationStatisticsUtils.WARNING_INVALID_DATA, alertMessage);

            // Enter valid values
            myUC210MediationStatisticsUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate ( -14, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            myUC210MediationStatisticsUtils.setEndDate (AbstractBaseUtils.now ());
            alertMessage = myUC210MediationStatisticsUtils.runReportReturnAlertString ();
            assertEquals ("", alertMessage);

            // Exit screen
            myUC210MediationStatisticsUtils.closeScreen ();
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
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}