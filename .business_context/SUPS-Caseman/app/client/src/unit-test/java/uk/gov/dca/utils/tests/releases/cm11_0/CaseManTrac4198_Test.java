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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;
import uk.gov.dca.utils.screens.UC066PrintRetentionSummaryUtils;
import uk.gov.dca.utils.screens.UC067AdhocPayoutsUtils;
import uk.gov.dca.utils.screens.UC068PrintPrePayoutListUtils;
import uk.gov.dca.utils.screens.UC074PrintPayoutReportsUtils;
import uk.gov.dca.utils.screens.UC086ReprintReportsUtils;

/**
 * Automated tests for the CaseMan Defect 4198 which concerns the availability of
 * certain reports in the reprint reports screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4198_Test extends AbstractCmTestBase
{
    
    /** The my UC 068 print pre payout list utils. */
    // Private member variables for the screen utils
    private UC068PrintPrePayoutListUtils myUC068PrintPrePayoutListUtils;
    
    /** The my UC 074 print payout reports utils. */
    private UC074PrintPayoutReportsUtils myUC074PrintPayoutReportsUtils;
    
    /** The my UC 086 reprint reports utils. */
    private UC086ReprintReportsUtils myUC086ReprintReportsUtils;
    
    /** The my UC 061 maintain payment utils. */
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;
    
    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;
    
    /** The my UC 066 print retention summary utils. */
    private UC066PrintRetentionSummaryUtils myUC066PrintRetentionSummaryUtils;
    
    /** The my UC 067 adhoc payouts utils. */
    private UC067AdhocPayoutsUtils myUC067AdhocPayoutsUtils;
    
    /** The my UC 059 passthrough payment utils. */
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4198_Test ()
    {
        super (CaseManTrac4198_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC068PrintPrePayoutListUtils = new UC068PrintPrePayoutListUtils (this);
        myUC074PrintPayoutReportsUtils = new UC074PrintPayoutReportsUtils (this);
        myUC086ReprintReportsUtils = new UC086ReprintReportsUtils (this);
        myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
        myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
        myUC066PrintRetentionSummaryUtils = new UC066PrintRetentionSummaryUtils (this);
        myUC067AdhocPayoutsUtils = new UC067AdhocPayoutsUtils (this);
        myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
    }

    /**
     * Tests that the Payable Order schedules and the Payout Notification Schedules
     * appear in the Reprint Reports list.
     */
    public void testPayoutReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC068PrintPrePayoutListUtils.bypassStartOfDay ("282");

            // Navigate to the Print Pre-Payout List screen
            this.nav.navigateFromMainMenu (MAINMENU_PRE_PAYOUT_LIST_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC068PrintPrePayoutListUtils.getScreenTitle ());

            // Run Pre-Payout List - NOTE, user will return to Main Menu
            myUC068PrintPrePayoutListUtils.runReport ();
            session.waitForPageToLoad ();

            // Navigate to the Print Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_PAYOUT_PATH);

            // Run Payout
            myUC074PrintPayoutReportsUtils.runPayableOrders ("100000");
            myUC074PrintPayoutReportsUtils.completePayout ();
            myUC074PrintPayoutReportsUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check Payout reports are present in the grid
            assertTrue ("Payout Notification Schedules not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Payout Notification Schedules", 4));
            assertTrue ("Payable Order Schedules not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Payable Order Schedules", 4));
            assertTrue ("CO Address Unknown Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("CO Address Unknown Report", 4));
            assertTrue ("CO Dividend Fee List Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("CO Dividend Fee List Report", 4));
            assertTrue ("Print Prepayout List not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Print Prepayout List", 4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Amendment Verification Report (CM_AMR) appears in the Reprint Reports list.
     */
    public void testAMRReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Load record
            myUC061MaintainPaymentUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Maintain details and exit screen
            myUC061MaintainPaymentUtils.setPaymentAmount ("0.02");
            myUC061MaintainPaymentUtils.saveScreen ();
            myUC061MaintainPaymentUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check AMR report is present in the grid
            assertTrue ("Amendment Verification Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Amendment Verification Report", 4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Overpayment Resolution Report (CM_OVP) appears in the Reprint Reports list.
     */
    public void testOVPReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC063ResolveOverpaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Load record
            myUC063ResolveOverpaymentUtils.loadEnforcement ("Y0000002",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Resolve Overpayment and exit screen
            myUC063ResolveOverpaymentUtils.saveScreen ();
            myUC063ResolveOverpaymentUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check OVP report is present in the grid
            assertTrue ("Overpayment Resolution Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Overpayment Resolution Report", 4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Retention Summary Report (CM_RET) appears in the Reprint Reports list.
     */
    public void testRETReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC066PrintRetentionSummaryUtils.bypassStartOfDay ("282");

            // Navigate to the retention summary screen
            this.nav.navigateFromMainMenu (MAINMENU_RETENTION_SUMMARY_REP_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC066PrintRetentionSummaryUtils.getScreenTitle ());

            // Run Retention Summary Report - NOTE, user will return to Main Menu
            myUC066PrintRetentionSummaryUtils.runReport ();
            session.waitForPageToLoad ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check report is present in the grid
            assertTrue ("Retention Summary Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Retention Summary Report", 4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Ad-Hoc Payout Report (CM_ADH) appears in the Reprint Reports list.
     */
    public void testADHReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC067AdhocPayoutsUtils.bypassStartOfDay ("282");

            // Navigate to the Adhoc Payout screen
            this.nav.navigateFromMainMenu (MAINMENU_ADHOC_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());

            // Load record
            myUC067AdhocPayoutsUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Update Payment and exit screen
            myUC067AdhocPayoutsUtils.setPayoutReason (UC067AdhocPayoutsUtils.ADHOC_REASON_ERROR);
            myUC067AdhocPayoutsUtils.saveScreen ();
            myUC067AdhocPayoutsUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check report is present in the grid
            assertTrue ("Ad-Hoc Payout Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("Ad-Hoc Payout Report", 4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Passthrough Verification Report (CM_PVER) appears in the Reprint Reports list.
     */
    public void testPVERReportReprints ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Bypass Suitors Cash Start of Day
            myUC059PassthroughPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create/Update Passthrough Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());

            // Load record
            myUC059PassthroughPaymentUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Add Passthrough Payment and exit screen
            myUC059PassthroughPaymentUtils.addPassthroughPayment ("1",
                    AbstractSuitorsCashScreenUtils.PASSRETENTION_TYPE_CLAIMANT);
            myUC059PassthroughPaymentUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // Check report is present in the grid
            assertTrue ("Passthrough Verification Report not in grid",
                    myUC086ReprintReportsUtils.isValueInResultsGrid ("P'through Verification Report", 4));
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