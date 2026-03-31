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
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Maintain/Query Warrants screen.
 *
 * @author Chris Vincent
 */
public class TCE_MaintainWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /** The execution case. */
    private String executionCase = "A04NN001";
    
    /** The control case. */
    private String controlCase = "A04NN003";
    
    /** The execution warrant. */
    private String executionWarrant = "1A000001";
    
    /** The control warrant. */
    private String controlWarrant = "1A000003";

    /**
     * Constructor.
     */
    public TCE_MaintainWarrants_Test ()
    {
        super (TCE_MaintainWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Test to forward an existing EXECUTION warrant to a new court (creating a foreign warrant) after the TCE changes.
     */
    public void testMaintainExecutionWarrant ()
    {
        try
        {
            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC039MaintainWarrantUtils.setCaseNumber (executionCase);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check warrant type is as expected
            assertEquals ("EXECUTION", myUC039MaintainWarrantUtils.getWarrantType ());

            // Clear the Balance of Debt and Amount of Warrant fields to ensure are mandatory
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("");

            // Test that the Balance of Debt and Amount of Warrant fields are mandatory for EXECUTION warrants
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC039MaintainWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC039MaintainWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for EXECUTION warrants
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("0");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("0");

            assertFalse ("Balance of Debt field is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isBalanceOfDebtValid ());
            assertFalse ("Amount of Warrant field is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isAmountOfWarrantValid ());

            // Set valie values and exit popup
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("100");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("100");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

            // Change the executing court to forward the warrant and create a new foreign warrant
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Test that a foreign warrant record has been automatically created
            assertTrue ("No foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (executionCase, executionWarrant, "282", "180"));

            // Tests that a case event 620 has been created for the EXECUTION warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (executionCase, "620"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to forward an existing CONTROL warrant to a new court (creating a foreign warrant) after the TCE changes.
     */
    public void testMaintainControlWarrant ()
    {
        try
        {
            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC039MaintainWarrantUtils.setCaseNumber (controlCase);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check warrant type is as expected
            assertEquals ("CONTROL", myUC039MaintainWarrantUtils.getWarrantType ());

            // Clear the Balance of Debt and Amount of Warrant fields to ensure are mandatory
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("");

            // Test that the Balance of Debt and Amount of Warrant fields are mandatory for CONTROL warrants
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC039MaintainWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC039MaintainWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for CONTROL warrants
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("0");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("0");

            assertFalse ("Balance of Debt field is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isBalanceOfDebtValid ());
            assertFalse ("Amount of Warrant field is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isAmountOfWarrantValid ());

            // Set valie values and exit popup
            myUC039MaintainWarrantUtils.setBalanceOfDebt ("100");
            myUC039MaintainWarrantUtils.setAmountOfWarrant ("100");
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

            // Change the executing court to forward the warrant and create a new foreign warrant
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Test that a foreign warrant record has been automatically created
            assertTrue ("No foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (controlCase, controlWarrant, "282", "180"));

            // Tests that a case event 620 has been created for the CONTROL warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (controlCase, "620"));
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
     * Private function that logs the user into CaseMan and navigates to the Maintain/Query Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Maintain/Query Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());
    }

}