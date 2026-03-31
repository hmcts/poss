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

package uk.gov.dca.utils.tests.releases.cm15_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC040WarrantFeesRefundsUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;

/**
 * Automated tests for the CaseMan Defect TRAC 4523.
 * 
 * @author Des Johnston
 */

public class CaseManTrac4523_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 040 warrant fees refunds utils. */
    private UC040WarrantFeesRefundsUtils myUC040WarrantFeesRefundsUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;
    
    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;
    
    /** The my UC 061 maintain payment utils. */
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;

    /** The home warrant case number. */
    // Case numbers to use in the tests
    private String homeWarrantCaseNumber = "9NN10000";

    /**
     * Constructor.
     */
    public CaseManTrac4523_Test ()
    {
        super (CaseManTrac4523_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        myUC040WarrantFeesRefundsUtils = new UC040WarrantFeesRefundsUtils (this);
        myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
        myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
        myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
    }

    /**
     * Test to create a new home warrant record with a fee and then attempt
     * to update the fee via the Maintain Fees and Refunds screen.
     */
    public void testHomeWarrantFeeUpdate ()
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
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("1000.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("1000.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("95.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            myUC029CreateHomeWarrantUtils.clickSaveButton ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Query the warrant
            myUC039MaintainWarrantUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the Fees/Refunds screen via quick links menu
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_FEES);

            // Check in correct screen
            mCheckPageTitle (myUC040WarrantFeesRefundsUtils.getScreenTitle ());

            // Remove the warrant fee
            myUC040WarrantFeesRefundsUtils.removeFee ();

            // Save the warrant refund record - note this will automatically exit the Warrant Fees and Refunds screen
            myUC040WarrantFeesRefundsUtils.saveScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Check details of warrant
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();

            // Check Additional Fees field is blank and Fee field is 0.00
            assertEquals ("0.00", myUC039MaintainWarrantUtils.getWarrantFee ());
            assertEquals ("", myUC039MaintainWarrantUtils.getAdditionalFees ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when payments are added to Home Warrants, only fees that are not marked in error are counted
     * towards the outstanding balance.
     */
    public void testPaymentOutstandingBalance ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            // Create a payment to a warrant that constitutes an overpayment, even if the errored fee was included
            // (will be £5 overpayment if errored fee included or £100 overpayment if errored fee ignored)
            myUC059CounterPaymentUtils.loadEnforcement ("A0000001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);
            myUC059CounterPaymentUtils.setPaymentAmount ("210.00");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_POSTAL);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_JGMT1000);
            myUC059CounterPaymentUtils.saveScreen ();

            // Exit Create Counter Payments screen
            myUC059CounterPaymentUtils.closeScreen ();

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Update the payment on the Warrant to increase the overpayment amount, even if the errored fee was
            // included
            // (will be £10 overpayment if errored fee included or £105 overpayment if errored fee ignored)
            myUC061MaintainPaymentUtils.loadEnforcement ("A0000001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            myUC061MaintainPaymentUtils.setPaymentAmount ("215.00");
            myUC061MaintainPaymentUtils.saveScreen ();

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            myUC063ResolveOverpaymentUtils.loadEnforcement ("A0000001",
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Check that the overpayment amount is as expected (i.e. does not include the errored fee)
            assertEquals ("105.00", myUC063ResolveOverpaymentUtils.getOverpaymentAmount ());
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