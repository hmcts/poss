/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9980 $
 * $Author: vincentcp $
 * $Date: 2013-10-18 10:47:34 +0100 (Fri, 18 Oct 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case ownership functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class OwnershipChange_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00021"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00022"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00023"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00004"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00005"; // CCBC owned CCBC case
    
    /** The mcol code. */
    private String MCOL_CODE = "OC";

    /**
     * Constructor.
     */
    public OwnershipChange_Test ()
    {
        super (OwnershipChange_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests that when the claimant solicitor changes on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testSolicitorOwnershipChange_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber1);

            // Change the solicitor ownership of the case
            changeSolicitorCode ("CLAIMANT SOLICITOR NAME", "500");

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE, "1700", "1500"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the claimant solicitor changes on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testSolicitorOwnershipChange_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber2);

            // Change the solicitor ownership of the case
            changeSolicitorCode ("CLAIMANT SOLICITOR NAME", "500");

            // Check that an MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the claimant solicitor changes on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testSolicitorOwnershipChange_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber3);

            // Change the solicitor ownership of the case
            changeSolicitorCode ("CLAIMANT SOLICITOR NAME", "500");

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the claimant solicitor changes on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testSolicitorOwnershipChange_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber4);

            // Change the solicitor ownership of the case
            changeSolicitorCode ("CCBC NCP 1700 NAME", "500");

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the claimant solicitor changes on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testSolicitorOwnershipChange_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber5);

            // Change the solicitor ownership of the case
            changeSolicitorCode ("CCBC NCP 1700 NAME", "1500");

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE, "1700", "1500"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Create/Update Case Details screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     */
    private void loginAndLoadCase (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Create Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

        // Enter a Case
        myUC001CreateUpdateCaseUtils.setCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the change of claimant solicitor.
     *
     * @param solicitorName Current Solicitor name
     * @param pNewCode New code to change solicitor to
     */
    private void changeSolicitorCode (final String solicitorName, final String pNewCode)
    {
        myUC001CreateUpdateCaseUtils.selectPartyByName (solicitorName);
        myUC001CreateUpdateCaseUtils.setSolicitorCode (pNewCode);
        myUC001CreateUpdateCaseUtils.saveCase ();
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