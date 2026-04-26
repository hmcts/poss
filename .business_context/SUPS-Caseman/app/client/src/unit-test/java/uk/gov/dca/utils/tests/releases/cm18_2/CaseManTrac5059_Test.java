/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_2;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Trac 5059. This checks that a FEES_PAID record is created
 * against all home warrants, but not against Reissued warrants
 *
 * @author Chris Vincent
 */
public class CaseManTrac5059_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 031 reissue warrant utils. */
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;

    /** The case no warrant. */
    // Case numbers to use in the tests
    private String caseNoWarrant = "A04NN009";
    
    /** The reissue warrant no. */
    private String reissueWarrantNo = "1A000019";
    
    /** The reissue case no. */
    private String reissueCaseNo = "A04NN023";

    /**
     * Constructor.
     */
    public CaseManTrac5059_Test ()
    {
        super (CaseManTrac5059_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils (this);
    }

    /**
     * Tests that a Warrant is created with no fee, a FEES_PAID record is created with a value of 0.00.
     */
    public void testWarrantFee1 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseNoWarrant);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // Test warrant fee created as expected
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a Warrant is created with a fee, a FEES_PAID record is created with a value of 90.00.
     */
    public void testWarrantFee2 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseNoWarrant);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("90");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // Test warrant fee created as expected
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("90"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Reissued Warrant is created, that no FEES_PAID record is created for it.
     */
    public void testWarrantFee3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Reissue Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_REISSUE_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC031ReissueWarrantUtils.getScreenTitle ());

            // Set the Header fields and load warrant record
            myUC031ReissueWarrantUtils.setCaseNumber (reissueCaseNo);
            myUC031ReissueWarrantUtils.setWarrantNumber (reissueWarrantNo);
            myUC031ReissueWarrantUtils.clickSearchButton ();

            // Set the footer fields
            myUC031ReissueWarrantUtils.setExecutingCourtCode ("282");
            myUC031ReissueWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Amount fields
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100.00");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100.00");
            myUC031ReissueWarrantUtils.setWarrantFee ("90.00");

            // Save
            final String alertString = myUC031ReissueWarrantUtils.saveAndReturnAlertString ();
            final String searchString = "Re-issued warrant number is ";
            final int startIndex = alertString.indexOf (searchString) + searchString.length ();
            final String warrantNumber = alertString.substring (startIndex, startIndex + 8);

            myUC031ReissueWarrantUtils.closeScreen ();

            // Test that no warrant fee has been created for the Reissued Warrant
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "180");
            assertTrue ("Number FEES_PAID records is not 0 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 0);
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