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
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 2236.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2236_Test extends AbstractCmTestBase
{
    
    /** The my UC 091 create update AE utils. */
    // Private member variables for the screen utils
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The nn case number. */
    // Northampton Case
    private String nnCaseNumber = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac2236_Test ()
    {
        super (CaseManTrac2236_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);

    }

    /**
     * Test will involve logging in as a Coventry user and creating an AE on a Case owned
     * by Northampton. The AE and the AE Fee created should be issued by Northampton.
     */
    public void testCreateAEOnForeignCase ()
    {
        try
        {
            final String aeIssuingCourt;
            final String aeFeeIssuingCourt;

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (nnCaseNumber);
            // myUC091CreateUpdateAEUtils.setJudgmentCreditor("CLAIMANT ONE NAME");
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            // Check AE Issuing Court Code
            aeIssuingCourt = DBUtil.getAEIssuingCourt (nnCaseNumber);
            assertEquals ("AE Issuing Court is not expected value", "180", aeIssuingCourt);

            // Check AE Fee Issuing Court Code
            aeFeeIssuingCourt = DBUtil.getAEFeeIssuingCourt (nnCaseNumber);
            assertEquals ("AE Fee Issuing Court is not expected value", "180", aeFeeIssuingCourt);
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