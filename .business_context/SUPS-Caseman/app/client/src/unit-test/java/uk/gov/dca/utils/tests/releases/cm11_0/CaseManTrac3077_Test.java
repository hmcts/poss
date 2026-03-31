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

package uk.gov.dca.utils.tests.releases.cm11_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect TRAC 3077. This concerns the creation
 * of FEES_PAID records when a Home Warrant is created with no fees.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3077_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;

    /** The home warrant case number. */
    // Case numbers to use in the tests
    private String homeWarrantCaseNumber = "9NN00001";
    
    /** The case event case 1. */
    private String caseEventCase1 = "9NN00001";
    
    /** The case event case 2. */
    private String caseEventCase2 = "9NN00003";
    
    /** The ae event case 1. */
    private String aeEventCase1 = "9NN00001";
    
    /** The co number. */
    private String coNumber = "100001NN";

    /**
     * Constructor.
     */
    public CaseManTrac3077_Test ()
    {
        super (CaseManTrac3077_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Tests that a Warrant is created with no fee, a FEES_PAID record is created with a value of 0.00.
     * The the Warrant is updated and checks the same FEES_PAID record remains at 0.00
     */
    public void testWarrantFee1 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (homeWarrantCaseNumber);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            myUC039MaintainWarrantUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC039MaintainWarrantUtils.setLandRegistryFee ("10.00");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC039MaintainWarrantUtils.clickSaveButton ();

            // TEST THAT FEES_PAID RECORD REMAINS AT 0.00
            numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a Warrant is created with a fee, a FEES_PAID record is created with a value of 50.00.
     * The the Warrant is updated to change the fee to NULL and checks the same FEES_PAID record is
     * updated to 0.00.
     */
    public void testWarrantFee2 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (homeWarrantCaseNumber);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 50.00
            int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("50"));

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            myUC039MaintainWarrantUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC039MaintainWarrantUtils.setWarrantFee ("");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC039MaintainWarrantUtils.clickSaveButton ();

            // TEST THAT FEES_PAID RECORD UPDATED TO 0.00
            numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a Warrant is created with no fee, a FEES_PAID record is created with a value of 0.00.
     * The the Warrant is updated to change the fee to 50.00 and checks the same FEES_PAID record is
     * updated.
     */
    public void testWarrantFee3 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (homeWarrantCaseNumber);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            myUC039MaintainWarrantUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC039MaintainWarrantUtils.setWarrantFee ("50");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC039MaintainWarrantUtils.clickSaveButton ();

            // TEST THAT FEES_PAID RECORD UPDATED TO BE 50.00
            numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("50"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 484 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCaseEvent484WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseEventCase1);

            /**
             * Create Event 484
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent484 = new NewStandardEvent ("484");
            testEvent484.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent484.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent484.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event484Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event484Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event484Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event484Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event484Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event484Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79ADate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("N79AServiceDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("N79AComptemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend", this);
            event484Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ11);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent484, event484Questions);

            // Retrieve the last 8 characters of the 484 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("484");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCaseEvent485WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseEventCase2);

            /**
             * Create Event 485
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent485 = new NewStandardEvent ("485");
            testEvent485.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent485.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent485.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event485Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event485Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("ArrestDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("N39ComtemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79AContemptDetails2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event485Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event485Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("N40BJudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ11);
            final VariableDataQuestion vdQ12 = new VariableDataQuestion ("N40BJudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ12);
            final VariableDataQuestion vdQ13 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ13);
            final VariableDataQuestion vdQ14 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ14);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent485, event485Questions);

            // Retrieve the last 8 characters of the 485 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("485");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 490 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCaseEvent490WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load Case Number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseEventCase2);

            /**
             * Create Event 490
             * Subject only
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screen
             * FCK Editor
             */
            final NewStandardEvent testEvent490 = new NewStandardEvent ("490");
            testEvent490.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent490.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent490.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event490Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event490Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event490Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("InjunctionDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event490Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent490, event490Questions);

            // Retrieve the last 8 characters of the 490 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("490");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 856 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testAeEvent856WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load AE Details
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (aeEventCase1);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("EnterTheLengthOfCommittal",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("ItemDetails", VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "DETAILS", this);
            event856Questions.add (vdQ8);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("856");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 876 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testAeEvent876WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load AE Details
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (aeEventCase1);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("876");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with CO Event 856 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCOEvent856WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            // Load CO Details
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("CO-856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("EnterItemDetails",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend adjourned hearing", this);
            event856Questions.add (vdQ6);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent856, event856Questions);

            // Retrieve the last 8 characters of the 856 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("856");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with AE Event 876 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCOEvent876WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            // Load CO Details
            myUC116COEventUtils.loadCOByCONumber (coNumber);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("CO-876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("876");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

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

}