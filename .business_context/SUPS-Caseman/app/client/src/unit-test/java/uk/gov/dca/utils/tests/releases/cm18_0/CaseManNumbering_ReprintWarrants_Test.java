/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9911 $
 * $Author: vincentcp $
 * $Date: 2013-07-04 08:26:54 +0100 (Thu, 04 Jul 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC033PrintWarrantsExecutionUtils;
import uk.gov.dca.utils.screens.UC038ReprintWarrantsExecutionUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Reprint Warrants of Execution screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_ReprintWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 038 reprint warrants execution utils. */
    // Private member variables for the screen utils
    private UC038ReprintWarrantsExecutionUtils myUC038ReprintWarrantsExecutionUtils;
    
    /** The my UC 033 print warrants execution utils. */
    private UC033PrintWarrantsExecutionUtils myUC033PrintWarrantsExecutionUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_ReprintWarrants_Test ()
    {
        super (CaseManNumbering_ReprintWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC038ReprintWarrantsExecutionUtils = new UC038ReprintWarrantsExecutionUtils (this);
        myUC033PrintWarrantsExecutionUtils = new UC033PrintWarrantsExecutionUtils (this);
    }

    /**
     * Tests the reprinting of Home Warrants.
     */
    public void testHomeWarrants ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Reprint Warrants of Execution screen
            mLoginAndNavigateToScreen ();

            // Set the dropdown field to HOME to reprint a home warrant
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Home");

            // Enter invalid warrant number values to ensure they are not accepted
            final String[] invalidWarrantArray =
                    {"B0000002", "1A000002", "1A000001", "00001/13", "NONSENSE", "11111111"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
                assertFalse ("Run Report button enabled when should be disabled",
                        myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC038ReprintWarrantsExecutionUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumber ("");
            }

            // Change dropdown to Foreign and ensure field is still invalid
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Foreign");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber ("B0000001");
            assertFalse ("Foreign Warrant Number B0000001 is valid when should be invalid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertFalse ("Run Report button enabled when should be disabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumberFocus ();
            mCheckStatusBarText (UC038ReprintWarrantsExecutionUtils.ERR_MSG_INVALID_WARRANT_NUMBER);

            // Enter a valid value by changing dropdown to Home
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Home");
            assertTrue ("Warrant Number B0000001 is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkHomeWarrantReprinted ("B0000001", "282");

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
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Reprint Warrants of Execution screen
            mLoginAndNavigateToScreen ();

            // Set the dropdown field to HOME to reprint a home warrant
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Foreign");

            // Enter invalid warrant number values to ensure they are not accepted
            final String[] invalidWarrantArray =
                    {"0A000002", "FWB00011", "1A000001", "00001/13", "NONSENSE", "11111111"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
                assertFalse ("Run Report button enabled when should be disabled",
                        myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC038ReprintWarrantsExecutionUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC038ReprintWarrantsExecutionUtils.setWarrantNumber ("");
            }

            // Change dropdown to Foreign and ensure field is still invalid
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Home");
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumber ("0A000001");
            assertFalse ("Home Warrant Number 0A000001 is valid when should be invalid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertFalse ("Run Report button enabled when should be disabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());
            myUC038ReprintWarrantsExecutionUtils.setWarrantNumberFocus ();
            mCheckStatusBarText (UC038ReprintWarrantsExecutionUtils.ERR_MSG_INVALID_WARRANT_NUMBER);

            // Enter a valid value by changing dropdown to Home
            myUC038ReprintWarrantsExecutionUtils.setHomeForeign ("Foreign");
            assertTrue ("Warrant Number 0A000001 is invalid when should be valid",
                    myUC038ReprintWarrantsExecutionUtils.isWarrantNumberValid ());
            assertTrue ("Run Report button disabled when should be enabled",
                    myUC038ReprintWarrantsExecutionUtils.isRunReportButtonEnabled ());

            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkForeignWarrantReprinted ("0A000001", "282");

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Print Warrants of Execution screen still works ok.
     */
    public void testPrintWarrantsExecution ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Print Warrants of Execution screen
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_WARRANTS_EXECUTION_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC033PrintWarrantsExecutionUtils.getScreenTitle ());

            // Set correct date of issue
            myUC033PrintWarrantsExecutionUtils.setDateOfIssue ("14-JUN-2013");

            // Run report and check that the correct number of warrants have been printed
            myUC038ReprintWarrantsExecutionUtils.runReport ();
            checkWarrantsPrinted ("282");

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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
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

    /**
     * Determines whether or not the expected number of warrants have been printed.
     *
     * @param pOwnedBy Owning court
     * @return True if 2 warrants have been printed, else false
     */
    private boolean checkWarrantsPrinted (final String pOwnedBy)
    {
        final String query = "SELECT DECODE(COUNT(*), 2, 'true', 'false') FROM warrants WHERE " +
                "currently_owned_by = " + pOwnedBy + " AND TRUNC(date_printed) = TRUNC(SYSDATE)";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}