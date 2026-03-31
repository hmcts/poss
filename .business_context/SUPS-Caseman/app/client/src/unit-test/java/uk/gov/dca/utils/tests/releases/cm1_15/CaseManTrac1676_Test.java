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

package uk.gov.dca.utils.tests.releases.cm1_15;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect TRAC 1676. This concerns the incorrect creation
 * of FEES_PAID records when a foreign warrant is updated. This happens when the FEES_PAID record
 * associated with the home warrant is not present in the database.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1676_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /** The home warrant case number. */
    // Case numbers to use in the tests
    private String homeWarrantCaseNumber = "9NN00001";
    
    /** The foreign warrant local number. */
    private String foreignWarrantLocalNumber = "FWX00001";
    
    /** The foreign warrant home number. */
    private String foreignWarrantHomeNumber = "X0000001";

    /**
     * Constructor.
     */
    public CaseManTrac1676_Test ()
    {
        super (CaseManTrac1676_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
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
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 50.00
            int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("50"));

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            myUC039MaintainWarrantUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC039MaintainWarrantUtils.setWarrantFee ("60.00");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC039MaintainWarrantUtils.clickSaveButton ();

            // TEST THAT FEES_PAID RECORD IS UPDATED TO 60.00
            numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("60"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to update a foreign warrant where the fees_paid record associated
     * with the Home Warrant does not exist (tests that fees_paid record is not
     * created as a consequence of update).
     */
    public void testForeignWarrantUpdate ()
    {
        try
        {
            // Log into SUPS CaseMan as Coventry user so can update the foreign warrant from Northampton
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to Maintain/Query Warrants
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Check that no fees_paid records exist in the database for the warrant
            int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", foreignWarrantHomeNumber, "282");
            assertTrue ("Number FEES_PAID records is not 0 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 0);

            // Load the foreign warrant
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantLocalNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Update the foreign warrant bailiff id
            myUC039MaintainWarrantUtils.setBailiffAreaNumber ("1");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Check that the update has not created a fees_paid record in error
            numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", foreignWarrantHomeNumber, "282");
            assertTrue ("Number FEES_PAID records is not 0 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 0);
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