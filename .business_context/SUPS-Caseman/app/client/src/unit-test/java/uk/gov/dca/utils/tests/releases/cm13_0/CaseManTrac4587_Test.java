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

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;

/**
 * Automated tests for the Coded Party range changes on the Create Payments screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4587_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 passthrough payment utils. */
    // Private member variables for the screen utils
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4587_Test ()
    {
        super (CaseManTrac4587_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
    }

    /**
     * Tests that the Passthrough screen allows a CO record to be loaded when the CO has money paid out
     * but no money currently in court.
     */
    public void testCreatePassthroughPayments1 ()
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

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement ("100001NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");

            // Check the record is loaded
            assertEquals ("100001NN", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10", "CREDITOR ONE NAME");

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("100001NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
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
     * Tests that the Passthrough screen does not allow a CO record to be loaded when the CO has money in
     * court.
     */
    public void testCreatePassthroughPayments2 ()
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

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement ("100002NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");

            // Check the record is NOT loaded
            assertEquals ("", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            // Exit Create Passthrough Payments screen
            myUC059PassthroughPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Passthrough screen allows a CO record to be loaded when the CO has only one payment
     * which has been referred to drawer.
     */
    public void testCreatePassthroughPayments3 ()
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

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement ("100004NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");

            // Check the record is loaded
            assertEquals ("100004NN", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10", "CLAIMANT ONE NAME");

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("100004NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
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
     * Tests that the Passthrough screen allows a CO record to be loaded when the CO has a single payment
     * which has been errored.
     */
    public void testCreatePassthroughPayments4 ()
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

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement ("100003NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");

            // Check the record is loaded
            assertEquals ("100003NN", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10", "CLAIMANT ONE NAME");

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("100003NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
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
     * Tests that the Passthrough screen allows a CO record to be loaded when the CO has only passthrough
     * payments on it.
     */
    public void testCreatePassthroughPayments5 ()
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

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement ("100005NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");

            // Check the record is loaded
            assertEquals ("100005NN", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10", "CREDITOR ONE NAME");

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("100005NN", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
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
     * Check that passthrough payments can be added to Non CO Enforcements.
     */
    public void testCreateNonCOPassthroughPayments ()
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

            // Add a new payment to a Case record
            myUC059PassthroughPaymentUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE,
                    "282");

            // Check the record is loaded
            assertEquals ("0NN00001", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the Case enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a AE record
            myUC059PassthroughPaymentUtils.loadEnforcement ("282Y0001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE,
                    "282");

            // Check the record is loaded
            assertEquals ("282Y0001", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the AE enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("282Y0001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE,
                    "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a HW record
            myUC059PassthroughPaymentUtils.loadEnforcement ("Y0000012",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");

            // Check the record is loaded
            assertEquals ("Y0000012", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the HW enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("Y0000012",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a FW record
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWY00001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");

            // Check the record is loaded
            assertEquals ("FWY00001", myUC059PassthroughPaymentUtils.getEnforcementNumber ());

            myUC059PassthroughPaymentUtils.addPassthroughPayment ("10",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the FW enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("FWY00001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
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