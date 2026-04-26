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
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC110ViewPaymentsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 2804. This covers the bahaviour of the
 * cascaded coded party update script when dealing with CCBC Local Coded Party updates
 *
 * @author Chris Vincent
 */
public class CaseManTrac2804_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 110 view payments utils. */
    private UC110ViewPaymentsUtils myUC110ViewPaymentsUtils;

    /** The nn case number. */
    private String nnCaseNumber = "0NN00001";
    
    /** The ccbc case number. */
    private String ccbcCaseNumber = "0XX00001";
    
    /** The nn local warrant number. */
    private String nnLocalWarrantNumber = "FWZ00001";

    /**
     * Constructor.
     */
    public CaseManTrac2804_Test ()
    {
        super (CaseManTrac2804_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        myUC110ViewPaymentsUtils = new UC110ViewPaymentsUtils (this);
    }

    /**
     * Tests that when a CCBC Local Coded Party is updated, the Cascaded Coded Party Update
     * does not update other Local Coded Parties with the same number, but associated with other Courts.
     */
    public void testLocalCodedPartyCascadeUpdate ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load Warrant with a Northampton Local Coded Party
            myUC039MaintainWarrantUtils.setCaseNumber (nnCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check Party For Sol details are as expected
            assertEquals ("Incorrect Party For Sol Name", myUC039MaintainWarrantUtils.getPartyForSolName (),
                    "NN LOCAL CODED PARTY 100 NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 (),
                    "NN LCP100 ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 (),
                    "NN LCP100 ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 (),
                    "NN LCP100 ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC039MaintainWarrantUtils.getPartyForSolPostcode (),
                    "NW3 2HQ");

            // Navigate to View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in correct screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Load the Payment details subform
            myUC110ViewPaymentsUtils.clickViewDetailsButton ();

            // Check Payee details are as expected
            assertEquals ("Incorrect Party For Sol Name", myUC110ViewPaymentsUtils.getPayeeName (),
                    "NN LOCAL CODED PARTY 100 NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC110ViewPaymentsUtils.getPayeeAddressLine1 (),
                    "NN LCP100 ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC110ViewPaymentsUtils.getPayeeAddressLine2 (),
                    "NN LCP100 ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC110ViewPaymentsUtils.getPayeeAddressLine3 (),
                    "NN LCP100 ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC110ViewPaymentsUtils.getPayeeAddressLine4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC110ViewPaymentsUtils.getPayeeAddressLine5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC110ViewPaymentsUtils.getPayeePostcode (), "NW3 2HQ");

            // Exit subform and View Payments screen to return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.clickViewPaymentCloseButton ();
            myUC110ViewPaymentsUtils.clickCloseButton ();

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Clear Warrant details
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Run Cascaded Coded Party update
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Load Warrant with a Northampton Local Coded Party
            myUC039MaintainWarrantUtils.setCaseNumber (nnCaseNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check Party For Sol details are as expected (i.e. have not changed since Cascaded Coded Party Update
            assertEquals ("Incorrect Party For Sol Name", myUC039MaintainWarrantUtils.getPartyForSolName (),
                    "NN LOCAL CODED PARTY 100 NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 (),
                    "NN LCP100 ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 (),
                    "NN LCP100 ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 (),
                    "NN LCP100 ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC039MaintainWarrantUtils.getPartyForSolPostcode (),
                    "NW3 2HQ");

            // Navigate to View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in correct screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Load the Payment details subform
            myUC110ViewPaymentsUtils.clickViewDetailsButton ();

            // Check Payee details are as expected
            assertEquals ("Incorrect Party For Sol Name", myUC110ViewPaymentsUtils.getPayeeName (),
                    "NN LOCAL CODED PARTY 100 NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC110ViewPaymentsUtils.getPayeeAddressLine1 (),
                    "NN LCP100 ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC110ViewPaymentsUtils.getPayeeAddressLine2 (),
                    "NN LCP100 ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC110ViewPaymentsUtils.getPayeeAddressLine3 (),
                    "NN LCP100 ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC110ViewPaymentsUtils.getPayeeAddressLine4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC110ViewPaymentsUtils.getPayeeAddressLine5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC110ViewPaymentsUtils.getPayeePostcode (), "NW3 2HQ");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a National Coded Party is updated, the Cascaded Coded Party Update
     * does update Warrant and Payments with the new information.
     */
    public void testNationalCodedPartyCascadeUpdate ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load Warrant with a CCBC National Coded Party
            myUC039MaintainWarrantUtils.setCaseNumber (ccbcCaseNumber);
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (nnLocalWarrantNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check Party For Sol details are as expected
            assertEquals ("Incorrect Party For Sol Name", myUC039MaintainWarrantUtils.getPartyForSolName (),
                    "OLD CODED PARTY NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 (),
                    "OLD ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 (),
                    "OLD ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 (),
                    "OLD ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC039MaintainWarrantUtils.getPartyForSolPostcode (),
                    "TF3 4NT");

            // Navigate to View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in correct screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Load the Payment details subform
            myUC110ViewPaymentsUtils.clickViewDetailsButton ();

            // Check Payee details are as expected
            assertEquals ("Incorrect Party For Sol Name", myUC110ViewPaymentsUtils.getPayeeName (),
                    "OLD CODED PARTY NAME");
            assertEquals ("Incorrect Party For Sol Adline1", myUC110ViewPaymentsUtils.getPayeeAddressLine1 (),
                    "OLD ADLINE1");
            assertEquals ("Incorrect Party For Sol Adline2", myUC110ViewPaymentsUtils.getPayeeAddressLine2 (),
                    "OLD ADLINE2");
            assertEquals ("Incorrect Party For Sol Adline3", myUC110ViewPaymentsUtils.getPayeeAddressLine3 (),
                    "OLD ADLINE3");
            assertEquals ("Incorrect Party For Sol Adline4", myUC110ViewPaymentsUtils.getPayeeAddressLine4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC110ViewPaymentsUtils.getPayeeAddressLine5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC110ViewPaymentsUtils.getPayeePostcode (), "TF3 4NT");

            // Exit subform and View Payments screen to return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.clickViewPaymentCloseButton ();
            myUC110ViewPaymentsUtils.clickCloseButton ();

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Clear Warrant details
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Run Cascaded Coded Party update
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Load Warrant with a CCBC National Coded Party
            myUC039MaintainWarrantUtils.setCaseNumber (ccbcCaseNumber);
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (nnLocalWarrantNumber);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check Party For Sol details are as expected (i.e. HAVE changed since Cascaded Coded Party Update)
            assertEquals ("Incorrect Party For Sol Name", myUC039MaintainWarrantUtils.getPartyForSolName (),
                    "BRITISH GAS");
            assertEquals ("Incorrect Party For Sol Adline1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 (),
                    "TRINITY PARK");
            assertEquals ("Incorrect Party For Sol Adline2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 (),
                    "BIRMINGHAM");
            assertEquals ("Incorrect Party For Sol Adline3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 (), "");
            assertEquals ("Incorrect Party For Sol Adline4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC039MaintainWarrantUtils.getPartyForSolPostcode (),
                    "B37 7ES");

            // Navigate to View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in correct screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Load the Payment details subform
            myUC110ViewPaymentsUtils.clickViewDetailsButton ();

            // Check Payee details are as expected (i.e. HAVE changed since Cascaded Coded Party Update)
            assertEquals ("Incorrect Party For Sol Name", myUC110ViewPaymentsUtils.getPayeeName (), "BRITISH GAS");
            assertEquals ("Incorrect Party For Sol Adline1", myUC110ViewPaymentsUtils.getPayeeAddressLine1 (),
                    "TRINITY PARK");
            assertEquals ("Incorrect Party For Sol Adline2", myUC110ViewPaymentsUtils.getPayeeAddressLine2 (),
                    "BIRMINGHAM");
            assertEquals ("Incorrect Party For Sol Adline3", myUC110ViewPaymentsUtils.getPayeeAddressLine3 (), "");
            assertEquals ("Incorrect Party For Sol Adline4", myUC110ViewPaymentsUtils.getPayeeAddressLine4 (), "");
            assertEquals ("Incorrect Party For Sol Adline5", myUC110ViewPaymentsUtils.getPayeeAddressLine5 (), "");
            assertEquals ("Incorrect Party For Sol Postcode", myUC110ViewPaymentsUtils.getPayeePostcode (), "B37 7ES");
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