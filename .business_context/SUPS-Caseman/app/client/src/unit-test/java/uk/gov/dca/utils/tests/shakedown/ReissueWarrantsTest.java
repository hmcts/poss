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
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;

/**
 * Automated tests for the Reissue Warrants screen.
 *
 * @author Chris Vincent
 */
public class ReissueWarrantsTest extends AbstractCmTestBase
{
    
    /** The my UC 031 reissue warrant utils. */
    // Private member variables for the screen utils
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;

    /** The execution case number. */
    // Case numbers to use in the tests
    private String executionCaseNumber = "9NN00001";
    
    /** The execution warrant number. */
    private String executionWarrantNumber = "X0000001";

    /**
     * Constructor.
     */
    public ReissueWarrantsTest ()
    {
        super (ReissueWarrantsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils (this);
    }

    /**
     * Test to reissue a warrant.
     */
    public void testReissueWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_REISSUE_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC031ReissueWarrantUtils.getScreenTitle ());

            // Set the Header fields and load warrant record
            myUC031ReissueWarrantUtils.setCaseNumber (executionCaseNumber);
            myUC031ReissueWarrantUtils.setWarrantNumber (executionWarrantNumber);
            myUC031ReissueWarrantUtils.clickSearchButton ();

            // Set the footer fields
            myUC031ReissueWarrantUtils.setBailiffAreaNumber ("1");
            myUC031ReissueWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Amount fields
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("1.00");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("1.00");
            myUC031ReissueWarrantUtils.setWarrantFee ("1.00");
            myUC031ReissueWarrantUtils.setLandRegistryFee ("1.00");

            // Save
            myUC031ReissueWarrantUtils.clickSaveButton ();
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