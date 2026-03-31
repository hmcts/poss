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

package uk.gov.dca.utils.tests.releases.cm9_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC108CreateCOUtils;
import uk.gov.dca.utils.screens.UC108MaintainDebtUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TRAC 2209 SET A NEW DEBT STATUS TO DEFAULT TO LIVE.
 *
 * @author Mark Groen
 */
public class CaseMan_COTransfer_Test extends AbstractCmTestBase
{
    
    /** The my UC 108 create CO utils. */
    // Private member variables for the screen utils
    private UC108CreateCOUtils myUC108CreateCOUtils;
    
    /** The my UC 108 maintain debt utils. */
    private UC108MaintainDebtUtils myUC108MaintainDebtUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;

    /** The test AO no money. */
    // Private enforcement numbers
    private String testAONoMoney = "100001NN";
    
    /** The test AOO money in court. */
    private String testAOOMoneyInCourt = "100002NN";
    
    /** The test CAEO no money. */
    private String testCAEONoMoney = "100003NN";

    /**
     * Constructor.
     */
    public CaseMan_COTransfer_Test ()
    {
        super (CaseMan_COTransfer_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC108MaintainDebtUtils = new UC108MaintainDebtUtils (this);
        myUC108CreateCOUtils = new UC108CreateCOUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Tests the screen validation around the Transfer Consolidated Order popup
     * User should not be allowed in popup if there is money in court
     * User cannot transfer to themselves
     * User cannot transfer to CCBC.
     */
    public void testValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Load CO that has money in court
            myUC108CreateCOUtils.setCONumber (testAOOMoneyInCourt);

            // Attempt to navigate to Transfer CO Popup
            this.nav.selectQuicklinksMenuItem (UC108CreateCOUtils.QUICKLINK_TRANSFER);

            // Test Money in Court validation
            mCheckStatusBarText (UC108CreateCOUtils.ERROR_TRANS_MONEY_IN_COURT);

            // Clear screen
            myUC108CreateCOUtils.clickClearButton ();

            // Load CO that has no money in court to get into the popup
            myUC108CreateCOUtils.setCONumber (testCAEONoMoney);

            // Attempt to navigate to Transfer CO Popup
            this.nav.selectQuicklinksMenuItem (UC108CreateCOUtils.QUICKLINK_TRANSFER);

            // Test cannot transfer to self
            myUC108CreateCOUtils.setTransferCOCourtCode ("282");
            myUC108CreateCOUtils.setTransferCOCourtCodeFocus ();

            assertTrue ("Error message expected but non displayed", myUC108CreateCOUtils.getTransferCOStatusBarText ()
                    .equals (UC108CreateCOUtils.ERROR_TRANSCO_TRANS_TO_SELF));

            // Test cannot transfer to CCBC
            myUC108CreateCOUtils.setTransferCOCourtCode ("335");
            myUC108CreateCOUtils.setTransferCOCourtCodeFocus ();

            assertTrue ("Error message expected but non displayed", myUC108CreateCOUtils.getTransferCOStatusBarText ()
                    .equals (UC108CreateCOUtils.ERROR_TRANSCO_TRANS_TO_CCBC));

            // Enter a valid Court Code and Transfer
            myUC108CreateCOUtils.setTransferCOCourtCode ("180");
            myUC108CreateCOUtils.clickTransferCOButton ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the transfer of an AO Consolidated Order from one court to another.
     * Should change the Owning Court, keep the same status, convert any Local Coded
     * Parties and create an automatic CO Event 980.
     */
    public void testAOTransfer ()
    {
        final String originalStatus;

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Load CO that has no money in court to get into the popup
            myUC108CreateCOUtils.setCONumber (testAONoMoney);

            // Retrieve the current status
            originalStatus = myUC108CreateCOUtils.getCOStatus ();

            // Attempt to navigate to Transfer CO Popup
            this.nav.selectQuicklinksMenuItem (UC108CreateCOUtils.QUICKLINK_TRANSFER);

            // Enter a valid Court Code and Transfer
            myUC108CreateCOUtils.setTransferCOCourtCode ("180");
            myUC108CreateCOUtils.clickTransferCOButton ();

            // Clear screen and reload CO
            myUC108CreateCOUtils.clickClearButton ();
            myUC108CreateCOUtils.setCONumber (testAONoMoney);

            // Perform checks on Status and Owning Court
            assertTrue ("Error - CO Status has changed", myUC108CreateCOUtils.getCOStatus ().equals (originalStatus));
            assertTrue ("Error - Owning Court is not expected value",
                    myUC108CreateCOUtils.getOwningCourt ().equals ("180"));

            // Navigate to Maintain Debts screen
            myUC108CreateCOUtils.clickMaintainDebtButton ();
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            /************ Test coded party mapping *****************/

            /**
             * Local Coded Party Payee, should have changed from 105 to 199
             */
            myUC108MaintainDebtUtils.selectRecordByRowNumber (2);
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtPayeeCode ().equals ("199"));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtPayeeName ().equals ("NN LOCAL CODED PARTY 105 NAME"));

            /**
             * Local Coded Party Payee, should have changed from 100 to 1000
             */
            myUC108MaintainDebtUtils.selectRecordByRowNumber (3);
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtPayeeCode ().equals ("1000"));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtPayeeName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

            /**
             * Local Coded Party Creditor, should have changed from 100 to 1000
             */
            myUC108MaintainDebtUtils.selectRecordByRowNumber (5);
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtCreditorCode ().equals ("1000"));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtCreditorName ().equals ("NN LOCAL CODED PARTY 100 NAME"));

            /**
             * Local Coded Party Creditor, should have changed from 100 to 1000
             * Local Coded Party Payee, should be converted to a non coded party
             */
            myUC108MaintainDebtUtils.selectRecordByRowNumber (6);
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtCreditorCode ().equals ("1000"));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtCreditorName ().equals ("NN LOCAL CODED PARTY 100 NAME"));
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtPayeeCode ().equals (""));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtPayeeName ().equals ("NN LOCAL CODED PARTY 106 NAME"));

            /**
             * Local Coded Party Creditor, should be converted to a non coded party
             * Non CPC National Coded Party Payee, should be left as is
             */
            myUC108MaintainDebtUtils.selectRecordByRowNumber (7);
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtCreditorCode ().equals (""));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtCreditorName ().equals ("NN LOCAL CODED PARTY 101 NAME"));
            assertTrue ("Error - Payee incorrect", myUC108MaintainDebtUtils.getDebtPayeeCode ().equals ("7000"));
            assertTrue ("Error - Payee incorrect",
                    myUC108MaintainDebtUtils.getDebtPayeeName ().equals ("NON CPC CODED PARTY 7000 NAME"));

            // Exit Maintain Debts and navigate back to Create/Maintain CO
            myUC108MaintainDebtUtils.clickCancelMaintainDebtButton ();
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Exit Create/Maintain CO screen
            myUC108CreateCOUtils.closeScreen ();

            /************ Test Automatic CO Event Creation *****************/

            // Navigate to the CO Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);
            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            // Load Consolidated Order
            myUC116COEventUtils.loadCOByCONumberAndCourt (testAONoMoney, "180");

            // Select the automatically created CO Event 980
            myUC116COEventUtils.selectRecordByEventId ("980");
            assertTrue ("Error - Event 980 Details Incorrect",
                    myUC116COEventUtils.getCOEventDetails ().equals ("TRANSFERRED FROM NORTHAMPTON"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the transfer of a CAEO Consolidated Order from one court to another.
     * Should change the Owning Court, keep the same status, convert any Local Coded
     * Parties and create an automatic CO Event 980. Automatic Case Events should
     * no longer be created.
     */
    public void testCAEOTransfer ()
    {
        final String originalStatus;

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Load CO that has no money in court to get into the popup
            myUC108CreateCOUtils.setCONumber (testCAEONoMoney);

            // Retrieve the current status
            originalStatus = myUC108CreateCOUtils.getCOStatus ();

            // Attempt to navigate to Transfer CO Popup
            this.nav.selectQuicklinksMenuItem (UC108CreateCOUtils.QUICKLINK_TRANSFER);

            // Enter a valid Court Code and Transfer
            myUC108CreateCOUtils.setTransferCOCourtCode ("180");
            myUC108CreateCOUtils.clickTransferCOButton ();

            // Perform checks on Status and Owning Court
            assertTrue ("Error - CO Status has changed", myUC108CreateCOUtils.getCOStatus ().equals (originalStatus));
            assertTrue ("Error - Owning Court is not expected value",
                    myUC108CreateCOUtils.getOwningCourt ().equals ("180"));

            // Exit Create/Maintain CO screen
            myUC108CreateCOUtils.closeScreen ();

            /************ Test Automatic Case Event Creation *****************/

            // No Automatic Case Event 777s should have been created on these Cases
            assertTrue ("Error - Automatic Case Event created",
                    DBUtil.getCountCaseEventsForCase ("0NN00001", "777") == 0);
            assertTrue ("Error - Automatic Case Event created",
                    DBUtil.getCountCaseEventsForCase ("0NN00003", "777") == 0);

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