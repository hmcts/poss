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

package uk.gov.dca.utils.tests.releases.cm3_5;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;

/**
 * Automated tests for the CaseMan Defect 2780. This covers a change to the way in which
 * foreign warrants are loaded on the Create Payments screens. If the representative on the
 * Warrant is a local coded party, then code should not be returned otherwise will load the
 * local coded party details of the executing court instead of the issuing court.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2780_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;
    
    /** The my UC 059 bailiff payment utils. */
    private UC059BailiffPaymentUtils myUC059BailiffPaymentUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;

    /** The test warrant one. */
    // Test Cases
    private String testWarrantOne = "FWY00001";
    
    /** The test warrant two. */
    private String testWarrantTwo = "FWY00002";
    
    /** The test warrant three. */
    private String testWarrantThree = "FWY00003";
    
    /** The test warrant four. */
    private String testWarrantFour = "FWY00004";
    
    /** The test warrant five. */
    private String testWarrantFive = "FWY00005";
    
    /** The test warrant six. */
    private String testWarrantSix = "FWY00006";

    /**
     * Constructor.
     */
    public CaseManTrac2780_Test ()
    {
        super (CaseManTrac2780_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the National Coded Party details are returned to the screen.
     */
    public void testCreateFWPayment1 ()
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

            myUC059PostalPaymentUtils.loadEnforcement (testWarrantOne,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is not the expected value 1700",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals ("1700"));
            assertTrue ("Payee Name is not the expected value BRITISH GAS",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("BRITISH GAS"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the Non CPC National Coded Party details are returned to the screen.
     */
    public void testCreateFWPayment2 ()
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

            myUC059BailiffPaymentUtils.loadEnforcement (testWarrantTwo,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is not the expected value 7000",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals ("7000"));
            assertTrue ("Payee Name is not the expected value NON CPC CODED PARTY 7000 NAME",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the Northampton Local Coded Party details are returned to the screen and the
     * Payee Code field is blank. Coventry have a Local Coded Party with the same
     * code.
     */
    public void testCreateFWPayment3 ()
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

            myUC059CounterPaymentUtils.loadEnforcement (testWarrantThree,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is set when should be blank",
                    myUC059CounterPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC059CounterPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the Northampton Local Coded Party details are returned to the screen and the
     * Payee Code field is blank. Coventry do not have a Local Coded Party with the
     * same code.
     */
    public void testCreateFWPayment4 ()
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

            myUC059PostalPaymentUtils.loadEnforcement (testWarrantFour,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is set when should be blank",
                    myUC059PostalPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NN LOCAL CODED PARTY 100 NAME",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("NN LOCAL CODED PARTY 101 NAME"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the Non Coded Party Representative details are returned to the screen.
     * The Claimant is a Northampton Local Coded Party, but the Representative
     * is a non coded party.
     */
    public void testCreateFWPayment5 ()
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

            myUC059BailiffPaymentUtils.loadEnforcement (testWarrantFive,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is set when should be blank",
                    myUC059BailiffPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value NON CODED PARTY SOLICITOR",
                    myUC059BailiffPaymentUtils.getPayeeName ().equals ("NON CODED PARTY SOLICITOR"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant is loaded on the Create Payments screen,
     * the Non Coded Party Representative details are returned to the screen.
     * The Claimant is a non coded party and is representing themselves.
     */
    public void testCreateFWPayment6 ()
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

            myUC059CounterPaymentUtils.loadEnforcement (testWarrantSix,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            assertTrue ("Payee Code is set when should be blank",
                    myUC059CounterPaymentUtils.getPayeeCode ().equals (""));
            assertTrue ("Payee Name is not the expected value CLAIMANT ONE NAME",
                    myUC059CounterPaymentUtils.getPayeeName ().equals ("CLAIMANT ONE NAME"));

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