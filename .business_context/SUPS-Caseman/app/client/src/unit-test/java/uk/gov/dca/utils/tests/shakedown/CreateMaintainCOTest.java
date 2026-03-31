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

package uk.gov.dca.utils.tests.shakedown;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC108CreateCOUtils;
import uk.gov.dca.utils.screens.UC108MaintainDebtUtils;

/**
 * Automated tests for the TRAC 2209 SET A NEW DEBT STATUS TO DEFAULT TO LIVE.
 *
 * @author Mark Groen
 */
public class CreateMaintainCOTest extends AbstractCmTestBase
{
    
    /** The my UC 108 create CO utils. */
    // Private member variables for the screen utils
    private UC108CreateCOUtils myUC108CreateCOUtils;
    
    /** The my UC 108 maintain debt utils. */
    private UC108MaintainDebtUtils myUC108MaintainDebtUtils;

    /** The existing CO number. */
    // Private enforcement numbers
    private String existingCONumber = "100001NN";

    /**
     * Constructor.
     */
    public CreateMaintainCOTest ()
    {
        super (CreateMaintainCOTest.class.getName ());
        this.nav = new Navigator (this);
        myUC108MaintainDebtUtils = new UC108MaintainDebtUtils (this);
        myUC108CreateCOUtils = new UC108CreateCOUtils (this);

    }

    /**
     * Tests the creation of a new CO record.
     */
    public void testCreateCO ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Create CO
            myUC108CreateCOUtils.clickCreateCOButton ();
            myUC108CreateCOUtils.setCOType (UC108CreateCOUtils.CO_TYPE_AO);
            myUC108CreateCOUtils.setDebtorName ("DEBTOR NAME");
            myUC108CreateCOUtils.setTargetDividend ("10");
            myUC108CreateCOUtils.addDebtorAddress ("DEBTOR ADLINE1", "DEBTOR ADLINE2", "DEBTOR ADLINE3",
                    "DEBTOR ADLINE4", "DEBTOR ADLINE5", "TF3 4NT");
            myUC108CreateCOUtils.setEmployerName ("EMPLOYER NAME");
            myUC108CreateCOUtils.setEmployerNamedPerson ("NAMED PERSON NAME");
            myUC108CreateCOUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC108CreateCOUtils.setPayRef ("123456");
            myUC108CreateCOUtils.addEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3", "EMP ADLINE4",
                    "EMP ADLINE5", "TF3 4NT");
            myUC108CreateCOUtils.addWorkplaceAddress ("WORK ADLINE1", "WORK ADLINE2", "WORK ADLINE3", "WORK ADLINE4",
                    "WORK ADLINE5", "TF3 4NT");

            // Navigate to Maintain Debts screen
            myUC108CreateCOUtils.clickMaintainDebtButton ();
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            // Add Debt
            myUC108MaintainDebtUtils.clickAddDebtButton ();
            myUC108MaintainDebtUtils.setAddDebtAmount ("1000");
            myUC108MaintainDebtUtils.setAddDebtCreditorName ("CREDITOR ONE NAME");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine1 ("CRED1 ADLINE1");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine2 ("CRED1 ADLINE2");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine3 ("CRED1 ADLINE3");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine4 ("CRED1 ADLINE4");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine5 ("CRED1 ADLINE5");
            myUC108MaintainDebtUtils.setAddDebtCreditorPostcode ("TF3 4NT");
            myUC108MaintainDebtUtils.setAddDebtPayeeName ("CRED1 PAYEE NAME");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine1 ("CRED1 PAYEE ADLINE1");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine2 ("CRED1 PAYEE ADLINE2");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine3 ("CRED1 PAYEE ADLINE3");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine4 ("CRED1 PAYEE ADLINE4");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine5 ("CRED1 PAYEE ADLINE5");
            myUC108MaintainDebtUtils.setAddDebtPayeePostcode ("TF3 4NT");
            myUC108MaintainDebtUtils.clickAddDebtOkButton ();

            // Add Debt
            myUC108MaintainDebtUtils.clickAddDebtButton ();
            myUC108MaintainDebtUtils.setAddDebtAmount ("1500");
            myUC108MaintainDebtUtils.setAddDebtCreditorName ("CREDITOR TWO NAME");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine1 ("CRED2 ADLINE1");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine2 ("CRED2 ADLINE2");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine3 ("CRED2 ADLINE3");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine4 ("CRED2 ADLINE4");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine5 ("CRED2 ADLINE5");
            myUC108MaintainDebtUtils.setAddDebtCreditorPostcode ("TF3 4NT");
            myUC108MaintainDebtUtils.clickAddDebtOkButton ();

            // Click Ok to return to the Create/Maintain CO screen
            myUC108MaintainDebtUtils.clickOkMaintainDebtButton ();
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Save to create the CO and output the CO Number created
            final String coNumber = myUC108CreateCOUtils.saveAndReturnCONumber ();
            System.out.println ("CO Created Successfully: " + coNumber);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that an existing CO can be updated.
     */
    public void testUpdateCO ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Load CO record
            myUC108CreateCOUtils.setCONumber (existingCONumber);

            // Update CO record
            myUC108CreateCOUtils.setDebtorName ("NEW DEBTOR NAME");
            myUC108CreateCOUtils.addDebtorAddress ("NEW DEBTOR ADLINE1", "NEW DEBTOR ADLINE2", "NEW DEBTOR ADLINE3",
                    "NEW DEBTOR ADLINE4", "NEW DEBTOR ADLINE5", "TF3 4NT");
            myUC108CreateCOUtils.addEmployerAddress ("NEW EMP ADLINE1", "NEW EMP ADLINE2", "NEW EMP ADLINE3",
                    "NEW EMP ADLINE4", "NEW EMP ADLINE5", "TF3 4NT");
            myUC108CreateCOUtils.addWorkplaceAddress ("NEW WORK ADLINE1", "NEW WORK ADLINE2", "NEW WORK ADLINE3",
                    "NEW WORK ADLINE4", "NEW WORK ADLINE5", "TF3 4NT");

            // Navigate to Maintain Debts screen
            myUC108CreateCOUtils.clickMaintainDebtButton ();
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            // Add New Debt
            myUC108MaintainDebtUtils.clickAddDebtButton ();
            myUC108MaintainDebtUtils.setAddDebtAmount ("1000");
            myUC108MaintainDebtUtils.setAddDebtCreditorName ("CREDITOR THREE NAME");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine1 ("CRED3 ADLINE1");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine2 ("CRED3 ADLINE2");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine3 ("CRED3 ADLINE3");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine4 ("CRED3 ADLINE4");
            myUC108MaintainDebtUtils.setAddDebtCreditorAddLine5 ("CRED3 ADLINE5");
            myUC108MaintainDebtUtils.setAddDebtCreditorPostcode ("TF3 4NT");
            myUC108MaintainDebtUtils.setAddDebtPayeeName ("CRED3 PAYEE NAME");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine1 ("CRED3 PAYEE ADLINE1");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine2 ("CRED3 PAYEE ADLINE2");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine3 ("CRED3 PAYEE ADLINE3");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine4 ("CRED3 PAYEE ADLINE4");
            myUC108MaintainDebtUtils.setAddDebtPayeeAddLine5 ("CRED3 PAYEE ADLINE5");
            myUC108MaintainDebtUtils.setAddDebtPayeePostcode ("TF3 4NT");
            myUC108MaintainDebtUtils.clickAddDebtOkButton ();

            // Update Existing Debt
            myUC108MaintainDebtUtils.selectRecordByCreditorName ("CREDITOR TWO NAME");
            myUC108MaintainDebtUtils.setDebtAmountAllowed ("1500");
            myUC108MaintainDebtUtils.setDebtStatus (UC108MaintainDebtUtils.DEBT_STATUS_PENDING);
            myUC108MaintainDebtUtils.setDebtCreditorName ("NEW CREDITOR NAME");
            myUC108MaintainDebtUtils.addCreditorAddress ("NEW CREDITOR ADLINE1", "NEW CREDITOR ADLINE2",
                    "NEW CREDITOR ADLINE3", "NEW CREDITOR ADLINE4", "NEW CREDITOR ADLINE5", "TF3 4NT");
            myUC108MaintainDebtUtils.setDebtPayeeName ("NEW PAYEE NAME");
            myUC108MaintainDebtUtils.addPayeeAddress ("NEW PAYEE ADLINE1", "NEW PAYEE ADLINE2", "NEW PAYEE ADLINE3",
                    "NEW PAYEE ADLINE4", "NEW PAYEE ADLINE5", "TF3 4NT");

            // Click Ok to return to the Create/Maintain CO screen
            myUC108MaintainDebtUtils.clickOkMaintainDebtButton ();
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Save the CO Details
            myUC108CreateCOUtils.clickSaveButton ();
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