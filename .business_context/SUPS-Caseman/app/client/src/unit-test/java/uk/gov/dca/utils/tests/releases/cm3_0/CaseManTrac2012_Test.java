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

package uk.gov.dca.utils.tests.releases.cm3_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;

/**
 * Automated tests for the Warrant Returns screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2012_Test extends AbstractCmTestBase
{
    
    /** The my UC 059 postal payment utils. */
    // Private member variables for the screen utils
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;

    /** The live CO number. */
    private String liveCONumber = "090001NN";
    
    /** The debtr payng CO number. */
    private String debtrPayngCONumber = "090002NN";
    
    /** The dismissed CO number. */
    private String dismissedCONumber = "090003NN";
    
    /** The set aside CO number. */
    private String setAsideCONumber = "090004NN";
    
    /** The revoked CO number. */
    private String revokedCONumber = "090005NN";
    
    /** The transferred CO number. */
    private String transferredCONumber = "090006NN";
    
    /** The struck out CO number. */
    private String struckOutCONumber = "090007NN";
    
    /** The paid CO number. */
    private String paidCONumber = "090008NN";
    
    /** The appln CO number. */
    private String applnCONumber = "090009NN";
    
    /** The discharged CO number. */
    private String dischargedCONumber = "090010NN";
    
    /** The suspended CO number. */
    private String suspendedCONumber = "090011NN";

    /**
     * Constructor.
     */
    public CaseManTrac2012_Test ()
    {
        super (CaseManTrac2012_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
    }

    /**
     * Tests that payments can be added to Consolidated Orders with a status of 'LIVE'
     * and 'DEBTR PAYNG' only.
     */
    public void testCreateCOPayments ()
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
            String transactionNumber;

            // Add a new payment to a LIVE CO record
            myUC059PostalPaymentUtils.loadEnforcement (liveCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertTrue ("Error - Cannot create payment on LIVE CO.", myUC059PostalPaymentUtils.isAmountFieldEnabled ());
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            System.out.println ("Payment created successfully, transaction number: " + transactionNumber);

            // Add a new payment to a DEBTR PAYNG CO record
            myUC059PostalPaymentUtils.loadEnforcement (debtrPayngCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertTrue ("Error - Cannot create payment on DEBTR PAYNG CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());
            myUC059PostalPaymentUtils.setPaymentAmount ("0.01");
            myUC059PostalPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            transactionNumber = myUC059PostalPaymentUtils.saveScreen ();
            System.out.println ("Payment created successfully, transaction number: " + transactionNumber);

            // Check cannot add payment to DISMISSED CO record
            myUC059PostalPaymentUtils.loadEnforcement (dismissedCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on DISMISSED CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to SET ASIDE CO record
            myUC059PostalPaymentUtils.loadEnforcement (setAsideCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on SET ASIDE CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to REVOKED CO record
            myUC059PostalPaymentUtils.loadEnforcement (revokedCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on REVOKED CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to TRANSFERRED CO record
            myUC059PostalPaymentUtils.loadEnforcement (transferredCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on TRANSFERRED CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to STRUCK OUT CO record
            myUC059PostalPaymentUtils.loadEnforcement (struckOutCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on STRUCK OUT CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to PAID CO record
            myUC059PostalPaymentUtils.loadEnforcement (paidCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on PAID CO.", myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to APPLN CO record
            myUC059PostalPaymentUtils.loadEnforcement (applnCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on APPLN CO.", myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to DISCHARGED CO record
            myUC059PostalPaymentUtils.loadEnforcement (dischargedCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on DISCHARGED CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

            // Check cannot add payment to SUSPENDED CO record
            myUC059PostalPaymentUtils.loadEnforcement (suspendedCONumber, AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);
            assertFalse ("Error - Can create payment on SUSPENDED CO.",
                    myUC059PostalPaymentUtils.isAmountFieldEnabled ());

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