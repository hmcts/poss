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

package uk.gov.dca.utils.tests.releases.cm12_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC108CreateCOUtils;
import uk.gov.dca.utils.screens.UC108MaintainDebtUtils;

/**
 * Automated tests for the Coded Party range changes on the Maintain COs screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_MaintainCOs_Test extends AbstractCmTestBase
{
    
    /** The my UC 108 create CO utils. */
    // Private member variables for the screen utils
    private UC108CreateCOUtils myUC108CreateCOUtils;
    
    /** The my UC 108 maintain debt utils. */
    private UC108MaintainDebtUtils myUC108MaintainDebtUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_MaintainCOs_Test ()
    {
        super (CaseMan_NCP_MaintainCOs_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC108MaintainDebtUtils = new UC108MaintainDebtUtils (this);
        myUC108CreateCOUtils = new UC108CreateCOUtils (this);

    }

    /**
     * Tests the creation of a new CAEO Consolidated Order record.
     */
    public void testCreateCAEO ()
    {
        try
        {
            final String[] caseNos = {"1QX00001", "1QX00002", "1QX00003", "1QX00004", "1QX00005", "1QX00006",
                    "1QX00007", "1QX00008", "1QX00009", "1QX00010", "1QX00011", "1QX00012", "1QX00013", "1QX00014",
                    "1QX00015", "1QX00016", "1QX00017", "1QX00018", "1QX00019", "1NN00001", "1NN00002", "1NN00003",
                    "1NN00004"};

            final String[] creditors = {"CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME",
                    "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME",
                    "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME",
                    "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME",
                    "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME", "CLAIMANT ONE NAME",
                    "NON CPC CODED PARTY 7000 NAME", "CLAIMANT ONE NAME", "NN LOCAL CODED PARTY 100 NAME",
                    "CLAIMANT ONE NAME"};

            final String[] payeeCodes = {"1700", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250", "8360",
                    "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "", "8500", "", "101"};

            final String[] creditorCodes =
                    {"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "7000", "", "100", ""};

            final String[] payeeNames = {"CCBC NCP 1700 NAME", "CCBC NCP 7355 NAME", "CCBC NCP 7586 NAME",
                    "CCBC NCP 7600 NAME", "CCBC NCP 7770 NAME", "CCBC NCP 7800 NAME", "CCBC NCP 7850 NAME",
                    "CCBC NCP 7975 NAME", "CCBC NCP 8250 NAME", "CCBC NCP 8360 NAME", "CCBC NCP 8675 NAME",
                    "CCBC NCP 8677 NAME", "CCBC NCP 8850 NAME", "CCBC NCP 8950 NAME", "CCBC NCP 9600 NAME",
                    "CCBC NCP 9650 NAME", "CCBC NCP 9750 NAME", "CCBC NCP 9800 NAME", "CCBC NCP 9950 NAME",
                    "CLAIMANT SOLICITOR NAME", "NON CPC CODED PARTY 8500 NAME", "CLAIMANT SOLICITOR NAME",
                    "NN LOCAL CODED PARTY 101 NAME"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Create CO
            myUC108CreateCOUtils.clickCreateCOButton ();
            myUC108CreateCOUtils.setOwningCourt ("282");
            myUC108CreateCOUtils.setCOType (UC108CreateCOUtils.CO_TYPE_CAEO);
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

            for (int i = 0, l = caseNos.length; i < l; i++)
            {
                System.out.println ("Add CAEO Debt Test - Case No: " + caseNos[i]);

                // Add Debt
                myUC108MaintainDebtUtils.clickAddDebtButton ();
                myUC108MaintainDebtUtils.setAddDebtAmount ("1000");
                myUC108MaintainDebtUtils.setAddDebtCaseNumber (caseNos[i], creditors[i]);
                myUC108MaintainDebtUtils.clickAddDebtOkButton ();

                // Check values returned
                assertEquals (payeeCodes[i], myUC108MaintainDebtUtils.getDebtPayeeCode ());
                assertEquals (payeeNames[i], myUC108MaintainDebtUtils.getDebtPayeeName ());
                assertEquals (creditorCodes[i], myUC108MaintainDebtUtils.getDebtCreditorCode ());
                assertEquals (creditors[i], myUC108MaintainDebtUtils.getDebtCreditorName ());
            }

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
     * Tests the creation of a new AO Consolidated Order record.
     */
    public void testCreateAO ()
    {
        try
        {
            final String[] validCodes = {"7000", "8500", "100", "101"};
            final String[] invalidCodes = {"1700", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] validNames = {"NON CPC CODED PARTY 7000 NAME", "NON CPC CODED PARTY 8500 NAME",
                    "NN LOCAL CODED PARTY 100 NAME", "NN LOCAL CODED PARTY 101 NAME"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create/Maintain CO screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            // Create CO
            myUC108CreateCOUtils.clickCreateCOButton ();
            myUC108CreateCOUtils.setOwningCourt ("282");
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

            // Validation - Positive Codes
            for (int i = 0, l = validCodes.length; i < l; i++)
            {
                System.out.println ("Add AO Debt Creditor Test - Code: " + validCodes[i]);

                // Add Debt
                myUC108MaintainDebtUtils.clickAddDebtButton ();
                myUC108MaintainDebtUtils.setAddDebtAmount ("1000");
                myUC108MaintainDebtUtils.setAddDebtCreditorCode (validCodes[i]);
                assertTrue ("Add Debt Creditor Code is invalid",
                        myUC108MaintainDebtUtils.isAddDebtCreditorCodeValid ());
                assertEquals (validNames[i], myUC108MaintainDebtUtils.getAddDebtCreditorName ());

                myUC108MaintainDebtUtils.setAddDebtCreditorCode ("");
                myUC108MaintainDebtUtils.setAddDebtCreditorName ("CREDITOR NAME");
                myUC108MaintainDebtUtils.setAddDebtCreditorAddLine1 ("CRED ADLINE1");
                myUC108MaintainDebtUtils.setAddDebtCreditorAddLine2 ("CRED ADLINE2");

                myUC108MaintainDebtUtils.setAddDebtPayeeCode (validCodes[i]);
                assertTrue ("Add Debt Payee Code is invalid", myUC108MaintainDebtUtils.isAddDebtPayeeCodeValid ());
                assertEquals (validNames[i], myUC108MaintainDebtUtils.getAddDebtPayeeName ());

                myUC108MaintainDebtUtils.setAddDebtPayeeCode ("");
                myUC108MaintainDebtUtils.setAddDebtPayeeName ("PAYEE NAME");
                myUC108MaintainDebtUtils.setAddDebtPayeeAddLine1 ("PAYEE ADLINE1");
                myUC108MaintainDebtUtils.setAddDebtPayeeAddLine2 ("PAYEE ADLINE2");
                myUC108MaintainDebtUtils.clickAddDebtOkButton ();

                myUC108MaintainDebtUtils.setDebtCreditorCode (validCodes[i]);
                assertTrue ("Debt Creditor Code is invalid", myUC108MaintainDebtUtils.isDebtCreditorCodeValid ());
                assertEquals (validNames[i], myUC108MaintainDebtUtils.getDebtCreditorName ());

                myUC108MaintainDebtUtils.setDebtCreditorCode ("");
                myUC108MaintainDebtUtils.setDebtCreditorName ("CREDITOR NAME");
                myUC108MaintainDebtUtils.addCreditorAddress ("CRED ADLINE1", "CRED ADLINE2", "CRED ADLINE3",
                        "CRED ADLINE4", "CRED ADLINE5", "");

                myUC108MaintainDebtUtils.setDebtPayeeCode (validCodes[i]);
                assertTrue ("Debt Payee Code is invalid", myUC108MaintainDebtUtils.isDebtPayeeCodeValid ());
                assertEquals (validNames[i], myUC108MaintainDebtUtils.getDebtPayeeName ());
            }

            // Validation - Negative Codes
            for (int i = 0, l = invalidCodes.length; i < l; i++)
            {
                System.out.println ("Add AO Debt Creditor Test - Code: " + invalidCodes[i]);

                // Add Debt
                myUC108MaintainDebtUtils.clickAddDebtButton ();
                myUC108MaintainDebtUtils.setAddDebtAmount ("1000");
                myUC108MaintainDebtUtils.setAddDebtCreditorCode (invalidCodes[i]);
                assertFalse ("Add Debt Creditor Code is valid", myUC108MaintainDebtUtils.isAddDebtCreditorCodeValid ());
                myUC108MaintainDebtUtils.setAddDebtCreditorCodeFocus ();
                assertEquals ("Invalid local party code.", myUC108MaintainDebtUtils.getAddDebtStatusBarText ());

                myUC108MaintainDebtUtils.setAddDebtCreditorCode ("");
                myUC108MaintainDebtUtils.setAddDebtCreditorName ("CREDITOR NAME");
                myUC108MaintainDebtUtils.setAddDebtCreditorAddLine1 ("CRED ADLINE1");
                myUC108MaintainDebtUtils.setAddDebtCreditorAddLine2 ("CRED ADLINE2");

                myUC108MaintainDebtUtils.setAddDebtPayeeCode (invalidCodes[i]);
                assertFalse ("Add Debt Payee Code is valid", myUC108MaintainDebtUtils.isAddDebtPayeeCodeValid ());
                myUC108MaintainDebtUtils.setAddDebtPayeeCodeFocus ();
                assertEquals ("Invalid local party code.", myUC108MaintainDebtUtils.getAddDebtStatusBarText ());

                myUC108MaintainDebtUtils.setAddDebtPayeeCode ("");
                myUC108MaintainDebtUtils.setAddDebtPayeeName ("PAYEE NAME");
                myUC108MaintainDebtUtils.setAddDebtPayeeAddLine1 ("PAYEE ADLINE1");
                myUC108MaintainDebtUtils.setAddDebtPayeeAddLine2 ("PAYEE ADLINE2");
                myUC108MaintainDebtUtils.clickAddDebtOkButton ();

                myUC108MaintainDebtUtils.setDebtCreditorCode (invalidCodes[i]);
                assertFalse ("Debt Creditor Code is valid", myUC108MaintainDebtUtils.isDebtCreditorCodeValid ());
                myUC108MaintainDebtUtils.setDebtCreditorCodeFocus ();
                mCheckStatusBarText ("Invalid local party code.");

                myUC108MaintainDebtUtils.setDebtCreditorCode ("");
                myUC108MaintainDebtUtils.setDebtCreditorName ("CREDITOR NAME");
                myUC108MaintainDebtUtils.addCreditorAddress ("CRED ADLINE1", "CRED ADLINE2", "CRED ADLINE3",
                        "CRED ADLINE4", "CRED ADLINE5", "");

                myUC108MaintainDebtUtils.setDebtPayeeCode (invalidCodes[i]);
                assertFalse ("Debt Payee Code is valid", myUC108MaintainDebtUtils.isDebtPayeeCodeValid ());
                myUC108MaintainDebtUtils.setDebtPayeeCodeFocus ();
                mCheckStatusBarText ("Invalid local party code.");

                myUC108MaintainDebtUtils.setDebtPayeeCode ("");
                myUC108MaintainDebtUtils.setDebtPayeeName ("PAYEE NAME");
                myUC108MaintainDebtUtils.addPayeeAddress ("PAYEE ADLINE1", "PAYEE ADLINE2", "PAYEE ADLINE3",
                        "PAYEE ADLINE4", "PAYEE ADLINE5", "");
            }

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
        assertTrue ("Status bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}