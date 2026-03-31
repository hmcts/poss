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
import uk.gov.dca.utils.screens.UC033PrintWarrantsExecutionUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Print Warrants of Control screen.
 *
 * @author Chris Vincent
 */
public class TCE_PrintWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 033 print warrants execution utils. */
    // Private member variables for the screen utils
    private UC033PrintWarrantsExecutionUtils myUC033PrintWarrantsExecutionUtils;

    /**
     * Constructor.
     */
    public TCE_PrintWarrants_Test ()
    {
        super (TCE_PrintWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC033PrintWarrantsExecutionUtils = new UC033PrintWarrantsExecutionUtils (this);
    }

    /**
     * Tests that the Print Warrants of Execution screen still works ok.
     */
    public void testPrintWarrantsExecution ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Print Warrants of Execution screen
            this.nav.navigateFromMainMenu (MAINMENU_PRINT_WARRANTS_EXECUTION_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC033PrintWarrantsExecutionUtils.getScreenTitle ());

            // Set correct date of issue
            myUC033PrintWarrantsExecutionUtils.setDateOfIssue ("09-JAN-2014");

            // Run report and check that the correct number of warrants have been printed
            myUC033PrintWarrantsExecutionUtils.runReport ();
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
     * Determines whether or not the expected number of warrants have been printed.
     *
     * @param pOwnedBy Owning court
     * @return True if 16 warrants have been printed, else false
     */
    private boolean checkWarrantsPrinted (final String pOwnedBy)
    {
        final String query = "SELECT DECODE(COUNT(*), 16, 'true', 'false') FROM warrants WHERE " +
                "currently_owned_by = " + pOwnedBy + " AND TRUNC(date_printed) = TRUNC(SYSDATE)";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}