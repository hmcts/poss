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
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC110ViewPaymentsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Coded Party range changes on the View Payments screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_CascadedUpdate_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 110 view payments utils. */
    private UC110ViewPaymentsUtils myUC110ViewPaymentsUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_CascadedUpdate_Test ()
    {
        super (CaseMan_NCP_CascadedUpdate_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        this.myUC110ViewPaymentsUtils = new UC110ViewPaymentsUtils (this);
    }

    /**
     * Tests that the cascaded coded party update script correctly updates CCBC National Coded Parties
     * in the new ranges on Warrants and Payments.
     */
    public void testCascadedUpdateScript ()
    {
        try
        {
            final String[] fwWarrantNos = {"FWZ00001", "FWZ00002", "FWZ00003", "FWZ00004", "FWZ00005", "FWZ00006",
                    "FWZ00007", "FWZ00008", "FWZ00009", "FWZ00010", "FWZ00011", "FWZ00012", "FWZ00013", "FWZ00014",
                    "FWZ00015", "FWZ00016", "FWZ00017", "FWZ00018", "FWZ00019", "FWZ00020", "FWZ00021"};

            final String[] codedPartyCodes = {"1700", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "7000", "8500"};

            final String[] codedPartyNames =
                    {"CCBC NCP 1700 NEW NAME", "CCBC NCP 7355 NEW NAME", "CCBC NCP 7586 NEW NAME",
                            "CCBC NCP 7600 NEW NAME", "CCBC NCP 7770 NEW NAME", "CCBC NCP 7800 NEW NAME",
                            "CCBC NCP 7850 NEW NAME", "CCBC NCP 7975 NEW NAME", "CCBC NCP 8250 NEW NAME",
                            "CCBC NCP 8360 NEW NAME", "CCBC NCP 8675 NEW NAME", "CCBC NCP 8677 NEW NAME",
                            "CCBC NCP 8850 NEW NAME", "CCBC NCP 8950 NEW NAME", "CCBC NCP 9600 NEW NAME",
                            "CCBC NCP 9650 NEW NAME", "CCBC NCP 9750 NEW NAME", "CCBC NCP 9800 NEW NAME",
                            "CCBC NCP 9950 NEW NAME", "NON CPC NCP 7000 NEW NAME", "NON CPC NCP 8500 NEW NAME"};

            final String[] cpAddressLine1s =
                    {"CCBC NCP1700 NEW ADLINE1", "CCBC NCP7355 NEW ADLINE1", "CCBC NCP7586 NEW ADLINE1",
                            "CCBC NCP7600 NEW ADLINE1", "CCBC NCP7770 NEW ADLINE1", "CCBC NCP7800 NEW ADLINE1",
                            "CCBC NCP7850 NEW ADLINE1", "CCBC NCP7975 NEW ADLINE1", "CCBC NCP8250 NEW ADLINE1",
                            "CCBC NCP8360 NEW ADLINE1", "CCBC NCP8675 NEW ADLINE1", "CCBC NCP8677 NEW ADLINE1",
                            "CCBC NCP8850 NEW ADLINE1", "CCBC NCP8950 NEW ADLINE1", "CCBC NCP9600 NEW ADLINE1",
                            "CCBC NCP9650 NEW ADLINE1", "CCBC NCP9750 NEW ADLINE1", "CCBC NCP9800 NEW ADLINE1",
                            "CCBC NCP9950 NEW ADLINE1", "NCPC CP7000 NEW ADLINE1", "NCPC CP8500 NEW ADLINE1"};

            final String[] cpAddressLine2s =
                    {"CCBC NCP1700 NEW ADLINE2", "CCBC NCP7355 NEW ADLINE2", "CCBC NCP7586 NEW ADLINE2",
                            "CCBC NCP7600 NEW ADLINE2", "CCBC NCP7770 NEW ADLINE2", "CCBC NCP7800 NEW ADLINE2",
                            "CCBC NCP7850 NEW ADLINE2", "CCBC NCP7975 NEW ADLINE2", "CCBC NCP8250 NEW ADLINE2",
                            "CCBC NCP8360 NEW ADLINE2", "CCBC NCP8675 NEW ADLINE2", "CCBC NCP8677 NEW ADLINE2",
                            "CCBC NCP8850 NEW ADLINE2", "CCBC NCP8950 NEW ADLINE2", "CCBC NCP9600 NEW ADLINE2",
                            "CCBC NCP9650 NEW ADLINE2", "CCBC NCP9750 NEW ADLINE2", "CCBC NCP9800 NEW ADLINE2",
                            "CCBC NCP9950 NEW ADLINE2", "NCPC CP7000 NEW ADLINE2", "NCPC CP8500 NEW ADLINE2"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Foreign Warrants linked to National Coded Parties Check
            for (int i = 0, l = fwWarrantNos.length; i < l; i++)
            {
                System.out.println ("Cascaded Update Test - FW No: " + fwWarrantNos[i]);

                // Load Foreign Warrant Record
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (fwWarrantNos[i]);
                myUC039MaintainWarrantUtils.clickSearchButton ();

                // Check party for solicitor details have been updated
                assertEquals (codedPartyNames[i], myUC039MaintainWarrantUtils.getPartyForSolName ());
                assertEquals (cpAddressLine1s[i], myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
                assertEquals (cpAddressLine2s[i], myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

                // Navigate to the View Payments screen
                this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

                // Check in correct screen
                mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

                myUC110ViewPaymentsUtils.clickViewDetailsButton ();

                // Check payee details have been updated
                assertEquals (codedPartyCodes[i], myUC110ViewPaymentsUtils.getPayeeCode ());
                assertEquals (codedPartyNames[i], myUC110ViewPaymentsUtils.getPayeeName ());
                assertEquals (cpAddressLine1s[i], myUC110ViewPaymentsUtils.getPayeeAddressLine1 ());
                assertEquals (cpAddressLine2s[i], myUC110ViewPaymentsUtils.getPayeeAddressLine2 ());

                // Exit view payments screen
                myUC110ViewPaymentsUtils.clickViewPaymentCloseButton ();
                myUC110ViewPaymentsUtils.clickCloseButton ();

                // Check in correct screen
                mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

                // Clear Warrants screen
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

            // Home Warrants linked to Local Coded Parties Check
            System.out.println ("Cascaded Update Test - HW No: Z0000001");

            // Load Home Warrant Record
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setWarrantNumber ("Z0000001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check in correct screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            myUC110ViewPaymentsUtils.clickViewDetailsButton ();

            // Check payee details have been updated
            assertEquals ("100", myUC110ViewPaymentsUtils.getPayeeCode ());
            assertEquals ("NN LCP 100 NEW NAME", myUC110ViewPaymentsUtils.getPayeeName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC110ViewPaymentsUtils.getPayeeAddressLine1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC110ViewPaymentsUtils.getPayeeAddressLine2 ());

            // Exit view payments screen
            myUC110ViewPaymentsUtils.clickViewPaymentCloseButton ();
            myUC110ViewPaymentsUtils.clickCloseButton ();

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Exit Maintain/Query Warrants screen
            myUC039MaintainWarrantUtils.closeScreen ();
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