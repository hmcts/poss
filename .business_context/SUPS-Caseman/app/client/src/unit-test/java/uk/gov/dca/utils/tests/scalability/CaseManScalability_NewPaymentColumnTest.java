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

package uk.gov.dca.utils.tests.scalability;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC110ViewPaymentsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the scalabililty change around adding a new column to the
 * Payments table.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_NewPaymentColumnTest extends AbstractCmTestBase
{

    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The my UC 110 view payments utils. */
    private UC110ViewPaymentsUtils myUC110ViewPaymentsUtils;

    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The my UC 059 postal payment utils. */
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;

    /** The my UC 059 bailiff payment utils. */
    private UC059BailiffPaymentUtils myUC059BailiffPaymentUtils;

    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;

    /** The my UC 059 passthrough payment utils. */
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;

    /** The my UC 061 maintain payment utils. */
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;

    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;

    /** The outstanding warrant error message. */
    // Error messages displayed in the status bar
    private String outstandingWarrantErrorMessage = "Cannot transfer, warrant is outstanding.";

    /** The no payments error message. */
    private String noPaymentsErrorMessage = "Payments do not exist for this Case.";

    /**
     * Case record with an AE attached but has no live warrants and no outstanding
     * payment records.
     */
    private String caseNoWarrantsNoPayments = "9NN00002";

    /**
     * Case record with an AE attached, with payments records attached. This case
     * will also be used to add new payments using the Suitor's Cash screens.
     */
    private String caseWithPayments = "9NN00003";

    /**
     * Case record with an AE attached, with no live warrants, but does have outstanding
     * payment records.
     */
    private String casePaymentOutstanding = "9NN00003";

    /**
     * Case record with an AE attached and also live warrants attached, but no outstanding
     * payment records.
     */
    private String caseWarrantOutstanding = "9NN00001";

    /**
     * Attachment of Earnings record that will be used to add payments. The total of the AE must
     * be less than £10,000 which is the sum used to overpay the record. Enforcement parent is
     * 9NN00001.
     */
    private String aeForNewPayments = "282X0001";

    /**
     * Consolidated Order record that will be used to add payments. The total of the CO must
     * be less than £10,000 which is the sum used to overpay the record
     */
    private String coForNewPayments = "090001NN";

    /**
     * Home Warrant record attached to a Case that will be used to add payments. The total of the Warrant must
     * be less than £10,000 which is the sum used to overpay the record. Enforcement parent is 9NN00001.
     */
    private String hwForNewPayments = "X0000001";

    /**
     * Foreign Warrant record attached to a Case that will be used to add payments. The total of the Warrant must
     * be less than £10,000 which is the sum used to overpay the record. Enforcement parent is 9CH00001.
     */
    private String fwForNewPayments = "FWX00001";

    /**
     * Home Warrant record attached to a CO that will be used to add payments. The total of the Warrant must
     * be less than £10,000 which is the sum used to overpay the record. Enforcement parent is 090001NN.
     */
    private String coHWForNewPayments = "X0000002";

    /**
     * Foreign Warrant record attached to a CO that will be used to add payments. The total of the Warrant must
     * be less than £10,000 which is the sum used to overpay the record. Enforcement parent is 090001CV.
     */
    private String coFWForNewPayments = "FWX00002";

    /**
     * Constructor.
     */
    public CaseManScalability_NewPaymentColumnTest ()
    {
        super (CaseManScalability_NewPaymentColumnTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        this.myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
        this.myUC110ViewPaymentsUtils = new UC110ViewPaymentsUtils (this);
        this.myUC092AEEventUtils = new UC092AEEventUtils (this);
        this.myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        this.myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        this.myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        this.myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
        this.myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
        this.myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
    }

    /**
     * Checks that a user can navigate from the Case Events screen to the Transfer Cases screen
     * and the View Payments screen.
     */
    public void testCaseEventsNavigation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNoWarrantsNoPayments);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Case Events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Attempt to navigate to the View Payments screen with a case that has no Payments
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that still on the Case Events screen (i.e. no navigation)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (noPaymentsErrorMessage);

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has payments
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseWithPayments);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Close the View Payments screen to return to the Case Events screen
            myUC110ViewPaymentsUtils.closeScreen ();

            // Check are back in Case Events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has payments outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (casePaymentOutstanding);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding payments
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Outstanding Payment validation check now removed (TRAC 1155), user should now be
            // in Transfer Cases screen.
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Case Events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has warrants outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseWarrantOutstanding);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check that still on the Case Events screen (i.e. no navigation)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (outstandingWarrantErrorMessage);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a user can navigate from the AE Events screen to the Transfer Cases screen
     * and the View Payments screen.
     */
    public void testAEEventsNavigation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load a record which can navigate to the Transfer Cases screen
            myUC092AEEventUtils.loadAEByCaseNumber (caseNoWarrantsNoPayments);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to AE Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in AE Events screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Clear the AE Events screen
            myUC092AEEventUtils.clearScreen ();

            // Load a record which has payments
            myUC092AEEventUtils.loadAEByCaseNumber (caseWithPayments);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Close the View Payments screen to return to the AE Events screen
            myUC110ViewPaymentsUtils.closeScreen ();

            // Check are back in AE Events screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Clear the AE Events screen
            myUC092AEEventUtils.clearScreen ();

            // Load a record which has payments outstanding
            myUC092AEEventUtils.loadAEByCaseNumber (casePaymentOutstanding);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding payments
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_TRANSFER_CASE);

            // Outstanding Payment validation check now removed (TRAC 1155), user should now be
            // in Transfer Cases screen.
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to AE Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in AE Events screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Clear the AE Events screen
            myUC092AEEventUtils.clearScreen ();

            // Load a record which has warrants outstanding
            myUC092AEEventUtils.loadAEByCaseNumber (caseWarrantOutstanding);

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check that still on the AE Events screen (i.e. no navigation)
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (outstandingWarrantErrorMessage);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a user can navigate from the Judgments screen to the Transfer Cases screen.
     */
    public void testJudgmentsNavigation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNoWarrantsNoPayments);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Navigate to the Transfer Cases screen
            myUC004MaintainJudgmentUtils.navigateTransferCaseScreen ();

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Case Events screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Return to the Case Events screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check have returned to the case events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has payments outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (casePaymentOutstanding);

            // Navigate back to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check are in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding payments
            myUC004MaintainJudgmentUtils.navigateTransferCaseScreen ();

            // Outstanding Payment validation check now removed (TRAC 1155), user should now be
            // in Transfer Cases screen.
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            // Close the Transfer Cases screen to return to Case Events
            myUC003TransferCaseUtils.closeScreen ();

            // Check are in Case Events screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Return to the Case Events screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check have returned to the case events screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Clear the Case Events screen
            myUC002CaseEventUtils.clearScreen ();

            // Enter a Case which has warrants outstanding
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseWarrantOutstanding);

            // Navigate back to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check are in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Attempt to navigate to the Transfer Cases screen with a case that has outstanding warrants
            myUC004MaintainJudgmentUtils.navigateTransferCaseScreen ();

            // Check that still on the Judgments screen (i.e. no navigation)
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Check the status bar shows the correct error message
            mCheckStatusBarText (outstandingWarrantErrorMessage);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that a user can create payments on the Create Payments Screens (Postal Payments,
     * Counter Payments, Bailiff Payments and Passthrough Payments). Passthrough payments
     * are also updated in this test as the screen allows creation and update. Following the creation
     * of payments, the payments are updated, overpaid and then resolved.
     */
    public void testCreateUpdatePayments ()
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

            String transactionNumber;
            String enforcementParent;

            // Add a new payment to a case record
            myUC059PostalPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + caseWithPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (caseWithPayments));

            // Add a new payment to an AE record
            myUC059PostalPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + aeForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a CO record
            myUC059PostalPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + coForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (coForNewPayments));

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059PostalPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + fwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9CH00001"));

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059PostalPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + hwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059PostalPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coFWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001CV"));

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059PostalPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059PostalPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coHWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001NN"));

            // Exit Create Postal Payments screen
            myUC059PostalPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059BailiffPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + caseWithPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (caseWithPayments));

            // Add a new payment to an AE record
            myUC059BailiffPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + aeForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a CO record
            myUC059BailiffPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + coForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (coForNewPayments));

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059BailiffPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + fwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9CH00001"));

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059BailiffPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + hwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059BailiffPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coFWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001CV"));

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059BailiffPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059BailiffPaymentUtils.setPaymentAmount ("0.01");
            myUC059BailiffPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059BailiffPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059BailiffPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coHWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001NN"));

            // Exit Create Bailiff Payments screen
            myUC059BailiffPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059CounterPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + caseWithPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (caseWithPayments));

            // Add a new payment to an AE record
            myUC059CounterPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + aeForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a CO record
            myUC059CounterPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + coForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (coForNewPayments));

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059CounterPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + fwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9CH00001"));

            // Add a new payment to a Home Warrant record linked to a Case
            myUC059CounterPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + hwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

            // Add a new payment to a Foreign Warrant record linked to a CO
            myUC059CounterPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT, "282");
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coFWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001CV"));

            // Add a new payment to a Home Warrant record linked to a CO
            myUC059CounterPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("0.01");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coHWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001NN"));

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Create Passthrough Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());

            // Add a new payment to a case record
            myUC059PassthroughPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CAPS);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + caseWithPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals (caseWithPayments));

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
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + aeForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

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
            myUC059PassthroughPaymentUtils.loadEnforcement ("090001CV",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01", "CLAIMANT ONE NAME");
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + "090001CV" + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001CV"));

            // Reload the CO enforcement and mark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("090001CV",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PassthroughPaymentUtils.setErrorFlag (true);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Reload the CO enforcement and unmark the passthrough in error
            myUC059PassthroughPaymentUtils.loadEnforcement ("090001CV",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC059PassthroughPaymentUtils.setErrorFlag (false);
            myUC059PassthroughPaymentUtils.saveScreen ();

            // Add a new payment to a Foreign Warrant record linked to a Case
            myUC059PassthroughPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CLAIMANT);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + fwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9CH00001"));

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
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CAPS);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue ("Enforcement parent for " + hwForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("9NN00001"));

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
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_JUDGMENT);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coFWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001CV"));

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
            transactionNumber = myUC059PassthroughPaymentUtils.addPassthroughPayment ("0.01",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CLAIMANT);
            enforcementParent = DBUtil.getEnforcementParent (transactionNumber, "282");
            assertTrue (
                    "Enforcement parent for " + coHWForNewPayments + " incorrect (actual: " + enforcementParent + ")",
                    enforcementParent.equals ("090001NN"));

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
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Update a payment to a case record
            myUC061MaintainPaymentUtils.loadEnforcement (caseWithPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.02");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to an AE record
            myUC061MaintainPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_CHEQUE);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a CO record
            myUC061MaintainPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Foreign Warrant record linked to a Case
            myUC061MaintainPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Home Warrant record linked to a Case
            myUC061MaintainPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Foreign Warrant record linked to a CO
            myUC061MaintainPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_RET);
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_MISC);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Home Warrant record linked to a CO
            myUC061MaintainPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("10000.00");
            myUC061MaintainPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CHQ_NOT_RET);
            myUC061MaintainPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            myUC061MaintainPaymentUtils.saveScreen ();

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Resolve the overpayment on an AE record
            myUC063ResolveOverpaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Resolve the overpayment on a CO record
            myUC063ResolveOverpaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Resolve the overpayment on a Foreign Warrant record linked to a Case
            myUC063ResolveOverpaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Resolve the overpayment on a Home Warrant record linked to a Case
            myUC063ResolveOverpaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Resolve the overpayment on a Foreign Warrant record linked to a CO
            myUC063ResolveOverpaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Resolve the overpayment on a Home Warrant record linked to a CO
            myUC063ResolveOverpaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC063ResolveOverpaymentUtils.saveScreen ();

            // Exit Resolve Overpayments screen
            myUC063ResolveOverpaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

            // Navigate to the Maintain Payments screen to get rid of the overpayments
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Don't bother checking for Start of Day as this would have been triggered above
            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Update a payment to an AE record
            myUC061MaintainPaymentUtils.loadEnforcement (aeForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a CO record
            myUC061MaintainPaymentUtils.loadEnforcement (coForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Foreign Warrant record linked to a Case
            myUC061MaintainPaymentUtils.loadEnforcement (fwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Home Warrant record linked to a Case
            myUC061MaintainPaymentUtils.loadEnforcement (hwForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Foreign Warrant record linked to a CO
            myUC061MaintainPaymentUtils.loadEnforcement (coFWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Update a payment to a Home Warrant record linked to a CO
            myUC061MaintainPaymentUtils.loadEnforcement (coHWForNewPayments,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.01");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
            session.waitForPageToLoad ();

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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}