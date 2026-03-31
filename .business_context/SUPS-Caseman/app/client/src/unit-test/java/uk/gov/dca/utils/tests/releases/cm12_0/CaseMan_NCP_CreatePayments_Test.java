/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 * Change history
 * 29/07/2009 - Chris Vincent: Outstanding Payment validation checks removed (TRAC 1155)
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm12_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;

/**
 * Automated tests for the Coded Party range changes on the Create Payments screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_CreatePayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;
    
    /** The my UC 059 bailiff payment utils. */
    private UC059BailiffPaymentUtils myUC059BailiffPaymentUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;
    
    /** The my UC 059 passthrough payment utils. */
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_CreatePayments_Test ()
    {
        super (CaseMan_NCP_CreatePayments_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        this.myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
    }

    /**
     * Tests that Counter Payments can be created on Foreign Warrants linked to National
     * Coded Parties.
     */
    public void testCreateCounterPayments ()
    {
        try
        {
            final String[] ccbcNCPCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] nonCCBCNCPCodes = {"7000", "8500"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059CounterPaymentUtils.loadEnforcement ("FWZ00001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);

            // Payee CCBC NCP Tests
            for (int i = 0, l = ccbcNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee CCBC NCP Test - Coded Party Code: " + ccbcNCPCodes[i]);
                myUC059CounterPaymentUtils.setPayeeCode (ccbcNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059CounterPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059CounterPaymentUtils.getPayeeName (), "CCBC NCP " + ccbcNCPCodes[i] + " NAME");
            }

            // Payee Non-CCBC NCP Tests
            for (int i = 0, l = nonCCBCNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee Non-CCBC NCP Test - Coded Party Code: " + nonCCBCNCPCodes[i]);
                myUC059CounterPaymentUtils.setPayeeCode (nonCCBCNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059CounterPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059CounterPaymentUtils.getPayeeName (),
                        "NON CPC CODED PARTY " + nonCCBCNCPCodes[i] + " NAME");
            }

            myUC059CounterPaymentUtils.saveScreen ();

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Bailiff Payments can be created on Foreign Warrants linked to National
     * Coded Parties.
     */
    public void testCreateBailiffPayments ()
    {
        try
        {
            final String[] ccbcNCPCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] nonCCBCNCPCodes = {"7000", "8500"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059BailiffPaymentUtils.loadEnforcement ("FWZ00002",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);

            // Payee CCBC NCP Tests
            for (int i = 0, l = ccbcNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee CCBC NCP Test - Coded Party Code: " + ccbcNCPCodes[i]);
                myUC059BailiffPaymentUtils.setPayeeCode (ccbcNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059BailiffPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059BailiffPaymentUtils.getPayeeName (), "CCBC NCP " + ccbcNCPCodes[i] + " NAME");
            }

            // Payee Non-CCBC NCP Tests
            for (int i = 0, l = nonCCBCNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee Non-CCBC NCP Test - Coded Party Code: " + nonCCBCNCPCodes[i]);
                myUC059BailiffPaymentUtils.setPayeeCode (nonCCBCNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059BailiffPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059BailiffPaymentUtils.getPayeeName (),
                        "NON CPC CODED PARTY " + nonCCBCNCPCodes[i] + " NAME");
            }

            myUC059BailiffPaymentUtils.saveScreen ();

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Postal Payments can be created on Foreign Warrants linked to National
     * Coded Parties.
     */
    public void testCreatePostalPayments ()
    {
        try
        {
            final String[] ccbcNCPCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] nonCCBCNCPCodes = {"7000", "8500"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059PostalPaymentUtils.loadEnforcement ("FWZ00021",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);

            // Payee CCBC NCP Tests
            for (int i = 0, l = ccbcNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee CCBC NCP Test - Coded Party Code: " + ccbcNCPCodes[i]);
                myUC059PostalPaymentUtils.setPayeeCode (ccbcNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059PostalPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059PostalPaymentUtils.getPayeeName (), "CCBC NCP " + ccbcNCPCodes[i] + " NAME");
            }

            // Payee Non-CCBC NCP Tests
            for (int i = 0, l = nonCCBCNCPCodes.length; i < l; i++)
            {
                System.out.println ("Payee Non-CCBC NCP Test - Coded Party Code: " + nonCCBCNCPCodes[i]);
                myUC059PostalPaymentUtils.setPayeeCode (nonCCBCNCPCodes[i]);
                assertTrue ("Payee Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC059PostalPaymentUtils.isPayeeCodeValid ());
                assertEquals (myUC059PostalPaymentUtils.getPayeeName (),
                        "NON CPC CODED PARTY " + nonCCBCNCPCodes[i] + " NAME");
            }

            myUC059PostalPaymentUtils.saveScreen ();

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that passthrough payments can be created and amended on Foreign Warrants linked to National
     * Coded Parties.
     */
    public void testCreatePassthroughPayments ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059PassthroughPaymentUtils.bypassStartOfDay ("282");

            this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());

            // Add a new payment to a Foreign Warrant record linked to a CCBC NCP
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00005",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the Foreign Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00005",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Foreign Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00005",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Non-CCBC NCP
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00020",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the Foreign Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00020",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Foreign Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWZ00020",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Exit Create Passthrough Payments screen
            myUC059PassthroughPaymentUtils.closeScreen ();
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

}