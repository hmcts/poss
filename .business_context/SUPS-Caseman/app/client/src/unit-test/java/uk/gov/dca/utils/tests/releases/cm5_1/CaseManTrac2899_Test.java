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

package uk.gov.dca.utils.tests.releases.cm5_1;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;

/**
 * Automated tests for the CaseMan Trac 2899. This defect was raised because obsolete
 * solicitor details were being returned as payee details on the Create Payments screen
 * instead of the current solicitor details.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2899_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;

    /**
     * Constructor.
     */
    public CaseManTrac2899_Test ()
    {
        super (CaseManTrac2899_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
    }

    /**
     * Logs into the Create Payments screen and checks that the payee details returned
     * are those of the current solicitor instead of the old one.
     */
    public void testLoadCaseEnforcement ()
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

            // Load Case
            myUC059PostalPaymentUtils.loadEnforcement ("0NN00001", AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Test the Payee Name is the current Solicitor and not the old one
            assertTrue ("Payee Name is not the expected value SOLICITOR TWO NAME",
                    myUC059PostalPaymentUtils.getPayeeName ().equals ("SOLICITOR TWO NAME"));

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