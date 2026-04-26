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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 2207. This covers a change to the way in which overpayments
 * are handled on the Suitors Cash Payment screens. Previously an overpayment of 1 pence would count as
 * an overpayment which caused a problem on the Resolve Overpayments screen which cannot resolve overpayments
 * of 1 pound or less. This validation has now been removed and overpayments of 1 pound or less are now
 * no longer counted as overpayments on AEs and Execution Warrants only.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2207_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;
    
    /** The my UC 059 bailiff payment utils. */
    private UC059BailiffPaymentUtils myUC059BailiffPaymentUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;
    
    /** The my UC 061 maintain payment utils. */
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;
    
    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;
    
    /** The my UC 091 create update AE utils. */
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The ae number 1. */
    // Test Data
    private String aeNumber1 = "282Y0001";
    
    /** The ae number 2. */
    private String aeNumber2 = "282Y0002";
    
    /** The ae number 3. */
    private String aeNumber3 = "282Y0003";
    
    /** The ae number 4. */
    private String aeNumber4 = "282Y0004";
    
    /** The ae trans number 1. */
    private String aeTransNumber1 = "10000";
    
    /** The ae trans number 2. */
    private String aeTransNumber2 = "10001";
    
    /** The ae case number 1. */
    private String aeCaseNumber1 = "0NN00002";

    /** The hw number 1. */
    private String hwNumber1 = "Y0000001";
    
    /** The hw number 2. */
    private String hwNumber2 = "Y0000002";
    
    /** The hw number 3. */
    private String hwNumber3 = "Y0000003";
    
    /** The hw number 4. */
    private String hwNumber4 = "Y0000004";
    
    /** The hw trans number 1. */
    private String hwTransNumber1 = "10002";
    
    /** The hw trans number 2. */
    private String hwTransNumber2 = "10003";

    /** The fw number 1. */
    private String fwNumber1 = "FWY00001";
    
    /** The fw number 2. */
    private String fwNumber2 = "FWY00002";
    
    /** The fw number 3. */
    private String fwNumber3 = "FWY00003";
    
    /** The fw number 4. */
    private String fwNumber4 = "FWY00004";
    
    /** The fw trans number 1. */
    private String fwTransNumber1 = "10004";
    
    /** The fw trans number 2. */
    private String fwTransNumber2 = "10005";

    /** The co number 1. */
    private String coNumber1 = "100001NN";
    
    /** The co number 2. */
    private String coNumber2 = "100002NN";
    
    /** The co trans number 1. */
    private String coTransNumber1 = "10006";

    /**
     * Constructor.
     */
    public CaseManTrac2207_Test ()
    {
        super (CaseManTrac2207_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        this.myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
        this.myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
        this.myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Checks that a new overpayment of 1.01 on an Attachment of Earnings does register
     * as an overpayment.
     */
    public void testCreateAEPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (aeNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Create the payment, overpaying by 1.01
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("1066.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 1.00 on an Attachment of Earnings does NOT register
     * as an overpayment. Also checks that Create/Update AE screen does not render amount
     * fields as invalid if overpaid by 1.00.
     */
    public void testCreateAEPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059BailiffPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (aeNumber2, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Create the payment, overpaying by 1.00
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("1066.00");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeNumber2, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

            myUC063ResolveOverpaymentUtils.closeScreen ();

            // Navigate to the Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Load existing AE record
            myUC091CreateUpdateAEUtils.setCaseNumber (aeCaseNumber1);
            myUC091CreateUpdateAEUtils.loadExistingAE ();

            // Check the values and valid states of the Amount fields
            assertTrue ("Amount of AE field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getAmountOfAE ().equals ("1000.00"));
            assertTrue ("Amount of AE is invalid", myUC091CreateUpdateAEUtils.isAmountOfAEValid ());
            assertTrue ("Fee field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getAEFee ().equals ("65.00"));
            assertTrue ("Fee is invalid", myUC091CreateUpdateAEUtils.isAEFeeValid ());
            assertTrue ("Total field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getAEBalanceTotal ().equals ("1065.00"));
            assertTrue ("Total is invalid", myUC091CreateUpdateAEUtils.isAEBalanceValid ());
            assertTrue ("Other Fees field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getOtherFees ().equals ("0.00"));
            assertTrue ("Other Fees is invalid", myUC091CreateUpdateAEUtils.isOtherFeesValid ());
            assertTrue ("Payments to Date field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getPaymentsToDate ().equals ("1066.00"));
            assertTrue ("Payments to Date is invalid", myUC091CreateUpdateAEUtils.isPaymentsToDateValid ());
            assertTrue ("Total Remaining field does not contain the expected amount.",
                    myUC091CreateUpdateAEUtils.getTotalRemaining ().equals ("-1.00"));
            assertTrue ("Total Remaining is invalid", myUC091CreateUpdateAEUtils.isTotalRemainingValid ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.01 on an
     * Attachment of Earnings it does register as an overpayment
     */
    public void testCreateAEPayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (aeNumber3, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Update the payment, overpaying by 1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("1066.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (aeTransNumber1, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeNumber3, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.00 on an
     * Attachment of Earnings it does NOT register as an overpayment
     */
    public void testCreateAEPayment4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (aeNumber4, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Update the payment, overpaying by 1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("1066.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (aeTransNumber2, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeNumber4, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 0.01 on a Consolidated Order does register
     * as an overpayment.
     */
    public void testCreateCOPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059CounterPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (coNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);

            // Create the payment, overpaying by 0.01
            final String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("1100.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (coNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount.",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("0.01"));
            assertTrue ("Overpayment Amount field is not read only.",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());
            assertTrue ("Overpayment Amount field is not valid.",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountValid ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 0.01 on an
     * Consolidated Order it does register as an overpayment
     */
    public void testCreateCOPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (coNumber2, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);

            // Update the payment, overpaying by 0.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("1100.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (coTransNumber1, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (coNumber2, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount.",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("0.01"));
            assertTrue ("Overpayment Amount field is not read only.",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());
            assertTrue ("Overpayment Amount field is not valid.",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountValid ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 1.01 on a Home Warrant does register
     * as an overpayment.
     */
    public void testCreateHomeWarrantPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (hwNumber1, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.01
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("112.11");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (hwNumber1,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 1.00 on a Home Warrant does NOT register
     * as an overpayment.
     */
    public void testCreateHomeWarrantPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059BailiffPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (hwNumber2, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Create the payment, overpaying by 1.00
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("112.10");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (hwNumber2,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.01 on a
     * Home Warrant it does register as an overpayment
     */
    public void testCreateHomeWarrantPayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (hwNumber3,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by 1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("112.11");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (hwTransNumber1, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (hwNumber3,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.00 on an
     * Home Warrants it does NOT register as an overpayment
     */
    public void testCreateHomeWarrantPayment4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (hwNumber4,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Update the payment, overpaying by 1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("112.10");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (hwTransNumber2, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (hwNumber4,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 1.01 on a Foreign Warrant does register
     * as an overpayment.
     */
    public void testCreateForeignWarrantPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (fwNumber1,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.01
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("112.11");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (fwNumber1,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a new overpayment of 1.00 on a Foreign Warrant does NOT register
     * as an overpayment.
     */
    public void testCreateForeignWarrantPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059BailiffPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (fwNumber2,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Create the payment, overpaying by 1.00
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("112.10");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (transactionNumber, "282"));

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (fwNumber2,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.01 on a
     * Foreign Warrant it does register as an overpayment
     */
    public void testCreateForeignWarrantPayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (fwNumber3,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by 1.01
            myUC061MaintainPaymentUtils.setPaymentAmount ("112.11");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertTrue ("Payment does not have an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (fwTransNumber1, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (fwNumber3,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals ("1.01"));
            assertFalse ("Overpayment Amount field is read only when should be editable",
                    myUC063ResolveOverpaymentUtils.isOverpaymentAmountReadOnly ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that when an existing payment is updated to have an overpayment of 1.00 on a
     * Foreign Warrant it does NOT register as an overpayment
     */
    public void testCreateForeignWarrantPayment4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            myUC061MaintainPaymentUtils.loadEnforcement (fwNumber4,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Update the payment, overpaying by 1.00
            myUC061MaintainPaymentUtils.setPaymentAmount ("112.10");
            myUC061MaintainPaymentUtils.saveScreen ();

            assertFalse ("Payment has an overpayment recorded.",
                    checkOverpaymentExistsOnPayment (fwTransNumber2, "282"));

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load the updated payment
            myUC063ResolveOverpaymentUtils.loadEnforcement (fwNumber4,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Test value and read only status of the overpayment amount field
            assertTrue ("Overpayment Amount does not match the expected amount",
                    myUC063ResolveOverpaymentUtils.getOverpaymentAmount ().equals (""));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to generate a query to check if an overpayment exists on a payment.
     *
     * @param pTransNo Transaction number
     * @param pCourtCode Court code
     * @return true if an overpayment exists, else false
     */
    private boolean checkOverpaymentExistsOnPayment (final String pTransNo, final String pCourtCode)
    {
        // Generate the query and run in the database
        final String query = "SELECT DECODE(P.Overpayment_Amount, null, 'false', 'true') FROM payments p WHERE " +
                "p.transaction_number = " + pTransNo + " AND " + "p.admin_court_code = " + pCourtCode;

        return DBUtil.runDecodeTrueFalseQuery (query);
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