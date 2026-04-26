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
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;

/**
 * Automated tests for the shakedown on the AE screen.
 *
 * @author Mark Groen
 */
public class CreateMaintainAETest extends AbstractCmTestBase
{
    
    /** The my UC 091 create update AE utils. */
    // Private member variables for the screen utils
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The case number with AE. */
    // Private enforcement numbers
    private String caseNumberWithAE = "9NN00001";
    
    /** The case number judg no AE. */
    private String caseNumberJudgNoAE = "9NN00002";
    
    /** The case number no judg no AE. */
    private String caseNumberNoJudgNoAE = "9NN00003";

    /**
     * Constructor.
     */
    public CreateMaintainAETest ()
    {
        super (CreateMaintainAETest.class.getName ());
        this.nav = new Navigator (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Tests the creation of a new AE record of type Judgment Debt.
     */
    public void testCreateAE1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumberJudgNoAE);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addServiceAddress ("SERV ADLINE1", "SERV ADLINE2", "SERV ADLINE3",
                    "SERV ADLINE4", "SERV ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addSubServiceAddress ("SUB ADLINE1", "SUB ADLINE2", "SUB ADLINE3", "SUB ADLINE4",
                    "SUB ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.addWorkplaceAddress ("WORK ADLINE1", "WORK ADLINE2", "WORK ADLINE3",
                    "WORK ADLINE4", "WORK ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a new AE record of type Maintenance Arrears.
     */
    public void testCreateAE2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumberNoJudgNoAE);
            myUC091CreateUpdateAEUtils.setJudgmentCreditor ("CLAIMANT ONE NAME");
            myUC091CreateUpdateAEUtils.setAEType (UC091CreateUpdateAEUtils.AE_TYPE_MN);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addServiceAddress ("SERV ADLINE1", "SERV ADLINE2", "SERV ADLINE3",
                    "SERV ADLINE4", "SERV ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addSubServiceAddress ("SUB ADLINE1", "SUB ADLINE2", "SUB ADLINE3", "SUB ADLINE4",
                    "SUB ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.addWorkplaceAddress ("WORK ADLINE1", "WORK ADLINE2", "WORK ADLINE3",
                    "WORK ADLINE4", "WORK ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a new AE record of type Priority Maintenance.
     */
    public void testCreateAE3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumberNoJudgNoAE);
            myUC091CreateUpdateAEUtils.setJudgmentCreditor ("CLAIMANT ONE NAME");
            myUC091CreateUpdateAEUtils.setAEType (UC091CreateUpdateAEUtils.AE_TYPE_PM);
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addServiceAddress ("SERV ADLINE1", "SERV ADLINE2", "SERV ADLINE3",
                    "SERV ADLINE4", "SERV ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addSubServiceAddress ("SUB ADLINE1", "SUB ADLINE2", "SUB ADLINE3", "SUB ADLINE4",
                    "SUB ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.addWorkplaceAddress ("WORK ADLINE1", "WORK ADLINE2", "WORK ADLINE3",
                    "WORK ADLINE4", "WORK ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that an existing AE can be updated.
     */
    public void testUpdateAE ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Load existing AE record
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumberWithAE);
            myUC091CreateUpdateAEUtils.loadExistingAE ();

            // Update AE Details
            myUC091CreateUpdateAEUtils.setOccupation ("PROFESSIONAL BUM");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("789456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NEW NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addSubServiceAddress ("NEW SUB ADLINE1", "NEW SUB ADLINE2", "NEW SUB ADLINE3",
                    "NEW SUB ADLINE4", "NEW SUB ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("NEW EMP ADLINE1", "NEW EMP ADLINE2", "NEW EMP ADLINE3",
                    "NEW EMP ADLINE4", "NEW EMP ADLINE5", "TF3 4NT", "NEW EMP REFERENCE");
            myUC091CreateUpdateAEUtils.addWorkplaceAddress ("NEW WORK ADLINE1", "NEW WORK ADLINE2", "NEW WORK ADLINE3",
                    "NEW WORK ADLINE4", "NEW WORK ADLINE5", "TF3 4NT");
            myUC091CreateUpdateAEUtils.setEmployerName ("NEW EMPLOYER NAME");

            // Save details
            myUC091CreateUpdateAEUtils.saveScreen ();
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