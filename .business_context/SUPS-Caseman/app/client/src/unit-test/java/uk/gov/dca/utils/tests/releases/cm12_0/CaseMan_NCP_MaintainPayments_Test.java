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
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;

/**
 * Automated tests for the Coded Party range changes on the Maintain Payments screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_MaintainPayments_Test extends AbstractCmTestBase
{
    
    /** The my UC 061 maintain payment utils. */
    // Private member variables for the screen utils
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_MaintainPayments_Test ()
    {
        super (CaseMan_NCP_MaintainPayments_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
    }

    /**
     * Tests that the Maintain Payments screen handles updating of payments on Foreign Warrants
     * linked to National Coded Parties.
     */
    public void testMaintainPayments ()
    {
        try
        {
            final String[] warrantNos = {"FWZ00001", "FWZ00002", "FWZ00003", "FWZ00004", "FWZ00005", "FWZ00006",
                    "FWZ00007", "FWZ00008", "FWZ00009", "FWZ00010", "FWZ00011", "FWZ00012", "FWZ00013", "FWZ00014",
                    "FWZ00015", "FWZ00016", "FWZ00017", "FWZ00018", "FWZ00019", "FWZ00020", "FWZ00021"};

            final String[] replacementCodes = {"7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250", "8360",
                    "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "7000", "8500", "1500"};

            final String[] replacementAmounts = {"650", "600", "650", "600", "650", "600", "650", "600", "650", "600",
                    "650", "600", "650", "600", "650", "600", "650", "600", "650", "600", "650"};

            final String[] replacementNames = {"CCBC NCP 7355 NAME", "CCBC NCP 7586 NAME", "CCBC NCP 7600 NAME",
                    "CCBC NCP 7770 NAME", "CCBC NCP 7800 NAME", "CCBC NCP 7850 NAME", "CCBC NCP 7975 NAME",
                    "CCBC NCP 8250 NAME", "CCBC NCP 8360 NAME", "CCBC NCP 8675 NAME", "CCBC NCP 8677 NAME",
                    "CCBC NCP 8850 NAME", "CCBC NCP 8950 NAME", "CCBC NCP 9600 NAME", "CCBC NCP 9650 NAME",
                    "CCBC NCP 9750 NAME", "CCBC NCP 9800 NAME", "CCBC NCP 9950 NAME", "NON CPC CODED PARTY 7000 NAME",
                    "NON CPC CODED PARTY 8500 NAME", "CCBC NCP 1500 NAME"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            for (int i = 0, l = warrantNos.length; i < l; i++)
            {
                System.out.println ("Maintain Payment Test - FW No: " + warrantNos[i]);

                // Load Foreign Warrant Payment
                myUC061MaintainPaymentUtils.loadEnforcement (warrantNos[i],
                        AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

                myUC061MaintainPaymentUtils.setPaymentAmount (replacementAmounts[i]);
                myUC061MaintainPaymentUtils.setPayeeCode (replacementCodes[i]);

                assertEquals (myUC061MaintainPaymentUtils.getPayeeName (), replacementNames[i]);

                myUC061MaintainPaymentUtils.saveScreen ();
            }

            // Exit Maintain Payments screen
            myUC061MaintainPaymentUtils.closeScreen ();
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