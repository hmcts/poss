/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11766 $
 * $Author: vincentcp $
 * $Date: 2015-03-11 11:44:53 +0000 (Wed, 11 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC038ReprintWarrantsExecutionUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Reprint Warrants of Control screen.
 *
 * @author Chris Vincent
 */
public class TCE_ReprintWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 038 reprint warrants execution utils. */
    // Private member variables for the screen utils
    private UC038ReprintWarrantsExecutionUtils myUC038ReprintWarrantsExecutionUtils;

    /**
     * Constructor.
     */
    public TCE_ReprintWarrants_Test ()
    {
        super (TCE_ReprintWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC038ReprintWarrantsExecutionUtils = new UC038ReprintWarrantsExecutionUtils (this);
    }

    /**
     * Tests the reprinting of Home Warrants.
     */
    public void testHomeWarrants ()
    {
        try
        {
            // Get to Reprint Warrants of Execution screen
            mLoginAndNavigateToScreen ();

            final String executionHW = "1A000005";
            final String controlHW = "1A000007";

            // Set the dropdown field to HOME to reprint a home warrant
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Home");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (executionHW);

            assertTrue ("Warrant Number " + executionHW + " is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkHomeWarrantReprinted (executionHW, "282");

            // Get back to the Reprint Warrants of Execution screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_WARRANTS_EXECUTION_PATH);
            mCheckPageTitle (myUC038ReprintWarrantsExecutionUtils.getScreenTitle ());

            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Home");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (controlHW);

            assertTrue ("Warrant Number " + controlHW + " is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkHomeWarrantReprinted (controlHW, "282");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the reprinting of foreign warrants.
     */
    public void testForeignWarrants ()
    {
        try
        {
            // Get to Reprint Warrants of Execution screen
            mLoginAndNavigateToScreen ();

            final String executionFW = "1A000006";
            final String controlFW = "1A000008";

            // Set the dropdown field to HOME to reprint a home warrant
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Foreign");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (executionFW);

            assertTrue ("Warrant Number " + executionFW + " is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkForeignWarrantReprinted (executionFW, "282");

            // Get back to the Reprint Warrants of Execution screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_WARRANTS_EXECUTION_PATH);
            mCheckPageTitle (myUC038ReprintWarrantsExecutionUtils.getScreenTitle ());

            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Foreign");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (controlFW);

            assertTrue ("Warrant Number " + controlFW + " is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkForeignWarrantReprinted (controlFW, "282");
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
     * Private function that logs the user into CaseMan and navigates to the Reprint Warrants of Execution screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Reprint Warrants of Execution screen
        this.nav.navigateFromMainMenu (MAINMENU_REPRINT_WARRANTS_EXECUTION_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC038ReprintWarrantsExecutionUtils.getScreenTitle ());
    }

    /**
     * Determines whether or not a home warrant has been reprinted.
     *
     * @param pWarrantNumber The warrant number to check
     * @param pOwnedBy Warrant owning court
     * @return True if the warrant has been reprinted, else false
     */
    private boolean checkHomeWarrantReprinted (final String pWarrantNumber, final String pOwnedBy)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM warrants WHERE " + "warrant_number = '" +
                pWarrantNumber + "' AND local_warrant_number IS NULL AND currently_owned_by = " + pOwnedBy +
                " AND TRUNC(date_reprinted) = TRUNC(SYSDATE)";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Determines whether or not a foreign warrant has been reprinted.
     *
     * @param pWarrantNumber The warrant number to check
     * @param pOwnedBy Warrant owning court
     * @return True if the warrant has been reprinted, else false
     */
    private boolean checkForeignWarrantReprinted (final String pWarrantNumber, final String pOwnedBy)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM warrants WHERE " +
                "local_warrant_number = '" + pWarrantNumber + "' AND currently_owned_by = " + pOwnedBy +
                " AND TRUNC(date_reprinted) = TRUNC(SYSDATE)";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}