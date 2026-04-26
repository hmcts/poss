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

/**
 * Automated tests for the Coded Party range changes on the View Payments screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_ViewPayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 110 view payments utils. */
    private UC110ViewPaymentsUtils myUC110ViewPaymentsUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_ViewPayments_Test ()
    {
        super (CaseMan_NCP_ViewPayments_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        this.myUC110ViewPaymentsUtils = new UC110ViewPaymentsUtils (this);
    }

    /**
     * Tests that the View Payments screen handles updating of payments on Foreign Warrants
     * linked to National Coded Parties.
     */
    public void testViewPayments ()
    {
        try
        {
            final String[] warrantNos = {"FWZ00001", "FWZ00002", "FWZ00003", "FWZ00004", "FWZ00005", "FWZ00006",
                    "FWZ00007", "FWZ00008", "FWZ00009", "FWZ00010", "FWZ00011", "FWZ00012", "FWZ00013", "FWZ00014",
                    "FWZ00015", "FWZ00016", "FWZ00017", "FWZ00018", "FWZ00019", "FWZ00020", "FWZ00021"};

            final String[] codedPartyCodes = {"1700", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "7000", "8500"};

            final String[] codedPartyNames = {"CCBC NCP 1700 NAME", "CCBC NCP 7355 NAME", "CCBC NCP 7586 NAME",
                    "CCBC NCP 7600 NAME", "CCBC NCP 7770 NAME", "CCBC NCP 7800 NAME", "CCBC NCP 7850 NAME",
                    "CCBC NCP 7975 NAME", "CCBC NCP 8250 NAME", "CCBC NCP 8360 NAME", "CCBC NCP 8675 NAME",
                    "CCBC NCP 8677 NAME", "CCBC NCP 8850 NAME", "CCBC NCP 8950 NAME", "CCBC NCP 9600 NAME",
                    "CCBC NCP 9650 NAME", "CCBC NCP 9750 NAME", "CCBC NCP 9800 NAME", "CCBC NCP 9950 NAME",
                    "NON CPC CODED PARTY 7000 NAME", "NON CPC CODED PARTY 8500 NAME"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            for (int i = 0, l = warrantNos.length; i < l; i++)
            {
                System.out.println ("View Payments Test - FW No: " + warrantNos[i]);

                // Load Foreign Warrant Payment
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (warrantNos[i]);
                myUC039MaintainWarrantUtils.clickSearchButton ();

                // Navigate to the View Payments screen
                this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

                // Check in correct screen
                mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

                myUC110ViewPaymentsUtils.clickViewDetailsButton ();

                // Check values loaded
                assertEquals (codedPartyCodes[i], myUC110ViewPaymentsUtils.getPayeeCode ());
                assertEquals (codedPartyNames[i], myUC110ViewPaymentsUtils.getPayeeName ());

                // Exit view payments screen
                myUC110ViewPaymentsUtils.clickViewPaymentCloseButton ();
                myUC110ViewPaymentsUtils.clickCloseButton ();

                // Check in correct screen
                mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

                // Clear Warrants screen
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

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