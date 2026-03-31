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

package uk.gov.dca.utils.tests.releases.cm5_1;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;

/**
 * Automated tests for the CaseMan Defect 2898. This covers a change to the way in which
 * Cases, AEs and Home Warrants are loaded on the Create Payments and Maintain Payments screens by users
 * who belong to Courts that do not own the record being loaded. The Coded Party details should be those
 * of the record's owning court instead of the user's owning court.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2898_Test extends AbstractCmTestBase
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

    /** The test case no one. */
    // Test Cases
    private String testCaseNoOne = "0NN00001";
    
    /** The test case no two. */
    private String testCaseNoTwo = "0NN00002";
    
    /** The test case no three. */
    private String testCaseNoThree = "0NN00003";
    
    /** The test case no four. */
    private String testCaseNoFour = "0NN00004";
    
    /** The test case no five. */
    private String testCaseNoFive = "0QX00001";

    /** The test home warrant one. */
    // Test Home Warrants
    private String testHomeWarrantOne = "Y0000001";
    
    /** The test home warrant two. */
    private String testHomeWarrantTwo = "Y0000002";
    
    /** The test home warrant three. */
    private String testHomeWarrantThree = "Y0000003";
    
    /** The test home warrant four. */
    private String testHomeWarrantFour = "Y0000004";
    
    /** The test home warrant five. */
    private String testHomeWarrantFive = "Y0000005";

    /** The test AE no one. */
    // Test AEs
    private String testAENoOne = "282Y0001";
    
    /** The test AE no two. */
    private String testAENoTwo = "282Y0002";
    
    /** The test AE no three. */
    private String testAENoThree = "282Y0003";

    /**
     * Constructor.
     */
    public CaseManTrac2898_Test ()
    {
        super (CaseManTrac2898_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        this.myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a CCBC Case with
     * a National Coded Party Solicitor is loaded. The test is that the payee details should be
     * the National Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateCasePayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (testCaseNoFive, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Coded Party Code and Payee Name values
            assertEquals ("1700", myUC059PostalPaymentUtils.getPayeeCode ());
            assertEquals ("BRITISH GAS", myUC059PostalPaymentUtils.getPayeeName ());

            // Create the payment
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertEquals ("1700", myUC059PostalPaymentUtils.getPayeeCode ());
            assertEquals ("BRITISH GAS", myUC059PostalPaymentUtils.getPayeeName ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Case with
     * a Non CPC National Coded Party Claimant is loaded. The test is that the payee details should be
     * the Non CPC National Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateCasePayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (testCaseNoOne, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Case with
     * a Northampton Local Coded Party Solicitor is loaded. The test is that the payee details should be
     * the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateCasePayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (testCaseNoTwo, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 100",
                    myUC059CounterPaymentUtils.getPayeeCode ().equals ("100"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC059CounterPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 100",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("100"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Case with
     * a Northampton Local Coded Party Claimant is loaded. The test is that the payee details should be
     * the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateCasePayment4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (testCaseNoThree, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Case with
     * a Non Coded Party is loaded. The test is that the payee details should be
     * the Non Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateCasePayment5 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (testCaseNoFour, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NON CODED PARTY SOLICITOR",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CODED PARTY SOLICITOR"));

            // Create the payment
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NON CODED PARTY SOLICITOR",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NON CODED PARTY SOLICITOR"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a CCBC Home Warrant with
     * a National Coded Party Representative is loaded. The test is that the payee details should be
     * the National Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateHWPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (testHomeWarrantOne,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 1700",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals ("1700"));
            assertTrue ("Payee Name is not the expected value BRITISH GAS",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("BRITISH GAS"));

            // Create the payment
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 1700",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("1700"));
            assertTrue ("Payee Name is not the expected value BRITISH GAS",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("BRITISH GAS"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Home Warrant with
     * a Non CPC National Coded Party Representative is loaded. The test is that the payee details should be
     * the Non CPC National Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateHWPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (testHomeWarrantTwo,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Home Warrant with
     * a Northampton Local Coded Party Representative is loaded. The test is that the payee details should be
     * the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateHWPayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (testHomeWarrantThree,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 100",
                    myUC059CounterPaymentUtils.getPayeeCode ().equals ("100"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC059CounterPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 100",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("100"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Home Warrant with
     * a Northampton Local Coded Party Representative is loaded. The test is that the payee details should be
     * the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateHWPayment4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (testHomeWarrantFour,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton Home Warrant with
     * a Non Coded Party Representative is loaded. The test is that the payee details should be
     * the Non Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateHWPayment5 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (testHomeWarrantFive,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NON CODED PARTY SOLICITOR",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CODED PARTY SOLICITOR"));

            // Create the payment
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NON CODED PARTY SOLICITOR",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NON CODED PARTY SOLICITOR"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton AE with
     * a Non CPC National Coded Party Judgment Creditor is loaded. The test is that the payee details should be
     * the Non CPC National Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateAEPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            myUC059BailiffPaymentUtils.loadEnforcement (testAENoOne, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is not the expected value 7000",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton AE with
     * a Judgment Creditor represented by a Northampton Local Coded Party Solicitor is loaded.
     * The test is that the payee details should be the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateAEPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (testAENoTwo, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC059CounterPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value CLAIMANT ONE NAME",
                    myUC059CounterPaymentUtils.getPayeeName ().equals ("CLAIMANT ONE NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is set when should be blank",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value CLAIMANT ONE NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("CLAIMANT ONE NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Logs into Create Payments screen as a Coventry user and a Northampton AE with
     * a Northampton Local Coded Party Judgment Creditor is loaded. The test is that the payee details should be
     * the Northampton Local Coded Party details.
     *
     * The same check is then made on the Maintain Payments screen
     */
    public void testCreateAEPayment3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            myUC059PostalPaymentUtils.loadEnforcement (testAENoThree, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

            // Create the payment
            final String transactionNumber;
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load the newly created payment
            myUC061MaintainPaymentUtils.setTransactionNumber (transactionNumber);
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Test the Payee Coded Party Code and Payee Name values
            assertTrue ("Payee Code is blank when should be 101",
                    myUC061MaintainPaymentUtils.getPayeeCode ().equals ("101"));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 101 NAME",
                    myUC061MaintainPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

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