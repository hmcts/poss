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

package uk.gov.dca.utils.tests.shakedown;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;

/**
 * Automated tests for the shakedown of Payment creation screens.
 *
 * @author Chris Vincent
 */
public class CreatePaymentsTest extends AbstractCmTestBase
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
     * Case record with an AE attached, with payments records attached.
     */
    private String caseWithPayments = "9NN00003";

    /**
     * Attachment of Earnings record that will be used to add payments.
     */
    private String aeForNewPayments = "282X0001";

    /**
     * Consolidated Order record that will be used to add payments.
     */
    private String coForNewPayments = "090001NN";

    /**
     * Home Warrant record attached to a Case that will be used to add payments.
     */
    private String hwForNewPayments = "X0000001";

    /**
     * Foreign Warrant record attached to a Case that will be used to add payments.
     */
    private String fwForNewPayments = "FWX00001";

    /**
     * Home Warrant record attached to a CO that will be used to add payments.
     */
    private String coHWForNewPayments = "X0000002";

    /**
     * Foreign Warrant record attached to a CO that will be used to add payments.
     */
    private String coFWForNewPayments = "FWX00002";

    /**
     * Constructor.
     */
    public CreatePaymentsTest ()
    {
        super (CreatePaymentsTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        this.myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
    }

    /**
     * Tests that Counter Payments can be created.
     */
    public void testCreateCounterPayments ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059CounterPaymentUtils.loadEnforcement (caseWithPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to an AE record
            myUC059CounterPaymentUtils.loadEnforcement (aeForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to a CO record
            myUC059CounterPaymentUtils.loadEnforcement (coForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059CounterPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059CounterPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059CounterPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059CounterPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059CounterPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
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
     * Tests that Bailiff Payments can be created.
     */
    public void testCreateBailiffPayments ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059BailiffPaymentUtils.loadEnforcement (caseWithPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to an AE record
            myUC059BailiffPaymentUtils.loadEnforcement (aeForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to a CO record
            myUC059BailiffPaymentUtils.loadEnforcement (coForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059BailiffPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059BailiffPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059BailiffPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059BailiffPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059BailiffPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
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
     * Tests that Postal Payments can be created.
     */
    public void testCreatePostalPayments ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059PostalPaymentUtils.loadEnforcement (caseWithPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to an AE record
            myUC059PostalPaymentUtils.loadEnforcement (aeForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to a CO record
            myUC059PostalPaymentUtils.loadEnforcement (coForNewPayments, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059PostalPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059PostalPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059PostalPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059PostalPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059PostalPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
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
     * Tests that passthrough payments can be created and amended.
     */
    public void testCreatePassthroughPayments ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059PassthroughPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059PassthroughPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CAPS);

            // Reload the case enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the case enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to an AE record
            myUC059PassthroughPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the AE enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the AE enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a CO record
            myUC059PassthroughPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01", "CLAIMANT ONE NAME");

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the CO enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059PassthroughPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CLAIMANT);

            // Reload the Foriegn Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Foriegn Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059PassthroughPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CAPS);

            // Reload the Home Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Home Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059PassthroughPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);

            // Reload the Foreign Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Foreign Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059PassthroughPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CLAIMANT);

            // Reload the Home Warrant enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the Home Warrant enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
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