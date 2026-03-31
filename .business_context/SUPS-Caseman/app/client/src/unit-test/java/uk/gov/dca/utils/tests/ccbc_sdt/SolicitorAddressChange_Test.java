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
 * Automated tests for the Solicitor Address functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class SolicitorAddressChange_Test extends AbstractCmTestBase
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
    
    /** The mcol code. */
    private String MCOL_CODE = "RA";

    /**
     * Constructor.
     */
    public SolicitorAddressChange_Test ()
    {
        super (SolicitorAddressChange_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests that when a solicitor address change occurs on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testClaimantAddressChange_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage screen
            loginAndLoadCase (caseNumber1);

            // Change the solicitor address
            changeSolicitorAddress ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a solicitor address change occurs on a CCBC owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testClaimantAddressChange_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber2);

            // Change the solicitor address
            changeSolicitorAddress ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a solicitor address change occurs on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testClaimantAddressChange_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Manage Case screen
            loginAndLoadCase (caseNumber3);

            // Change the solicitor address
            changeSolicitorAddress ();

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
     * Private method to handle the transfer of the case.
     */
    private void changeSolicitorAddress ()
    {
        myUC001CreateUpdateCaseUtils.selectPartyByName ("CLAIMANT SOLICITOR NAME");
        myUC001CreateUpdateCaseUtils.setSolAddrLine1 ("NEW SOLICITOR ADDRESS LINE 1");
        myUC001CreateUpdateCaseUtils.setSolAddrLine2 ("NEW SOLICITOR ADDRESS LINE 2");
        myUC001CreateUpdateCaseUtils.setSolAddrLine3 ("NEW SOLICITOR ADDRESS LINE 3");
        myUC001CreateUpdateCaseUtils.setSolAddrLine4 ("NEW SOLICITOR ADDRESS LINE 4");
        myUC001CreateUpdateCaseUtils.setSolAddrLine5 ("NEW SOLICITOR ADDRESS LINE 5");
        myUC001CreateUpdateCaseUtils.setSolPostcode ("TF3 4NT");
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