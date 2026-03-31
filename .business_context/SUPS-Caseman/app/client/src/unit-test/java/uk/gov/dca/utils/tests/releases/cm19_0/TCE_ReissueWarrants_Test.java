/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Reissue Warrants screen.
 *
 * @author Chris Vincent
 */
public class TCE_ReissueWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 031 reissue warrant utils. */
    // Private member variables for the screen utils
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;

    /** The execution case. */
    private String executionCase = "A04NN002";
    
    /** The control case. */
    private String controlCase = "A04NN004";

    /**
     * Constructor.
     */
    public TCE_ReissueWarrants_Test ()
    {
        super (TCE_ReissueWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils (this);
    }

    /**
     * Test the behaviour of the Reissue Warrants screen for an EXECUTION warrant following
     * TCE changes.
     */
    public void testReissueExecutionWarrant ()
    {
        try
        {
            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC031ReissueWarrantUtils.setCaseNumber (executionCase);
            myUC031ReissueWarrantUtils.clickSearchButton ();

            assertEquals ("EXECUTION", myUC031ReissueWarrantUtils.getWarrantType ());

            // Test that the Balance of Debt and Amount of Warrant fields are mandatory for EXECUTION warrants
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC031ReissueWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC031ReissueWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for EXECUTION warrants
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("0");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("0");

            assertFalse ("Balance of Debt field is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isBalanceOfDebtValid ());
            assertFalse ("Amount of Warrant field is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isAmountOfWarrantValid ());

            // Set valid fields and click save
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100");
            final String alertString = myUC031ReissueWarrantUtils.saveAndReturnAlertString ();
            final String warrantNumber = alertString.substring (alertString.length () - 9, alertString.length () - 1);

            // Check that the EXECUTION warrant is now a CONTROL warrant
            assertTrue ("Error: Warrant type has not changed to CONTROL", checkWarrantTypeChanges (warrantNumber));

            // Tests that a case event 630 has been created for the EXECUTION warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (executionCase, "630"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test the behaviour of the Reissue Warrants screen for an CONTROL warrant following
     * TCE changes.
     */
    public void testReissueControlWarrant ()
    {
        try
        {
            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC031ReissueWarrantUtils.setCaseNumber (controlCase);
            myUC031ReissueWarrantUtils.clickSearchButton ();

            assertEquals ("CONTROL", myUC031ReissueWarrantUtils.getWarrantType ());

            // Test that the Balance of Debt and Amount of Warrant fields are mandatory for CONTROL warrants
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC031ReissueWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC031ReissueWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for CONTROL warrants
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("0");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("0");

            assertFalse ("Balance of Debt field is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isBalanceOfDebtValid ());
            assertFalse ("Amount of Warrant field is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isAmountOfWarrantValid ());

            // Set valid fields and click save
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100");
            myUC031ReissueWarrantUtils.clickSaveButton ();

            // Tests that a case event 630 has been created for the CONTROL warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (controlCase, "630"));
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

    /**
     * Private function that logs the user into CaseMan and navigates to the Reissue Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Reissue Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_REISSUE_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC031ReissueWarrantUtils.getScreenTitle ());
    }

    /**
     * Determines whether or not a reissued EXECUTION warrant is correctly converted to a CONTROL warrant.
     *
     * @param pWarrantNumber The warrant number to check
     * @return True if the warrant type is CONTROL, else false
     */
    private boolean checkWarrantTypeChanges (final String pWarrantNumber)
    {
        final String query = "SELECT DECODE(warrant_type, 'CONTROL', 'true', 'false') FROM warrants WHERE " +
                "warrant_number = '" + pWarrantNumber + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}