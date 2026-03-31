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
import uk.gov.dca.utils.screens.UC207RemovePaymentsLockUtils;

/**
 * Automated tests for the CaseMan Defect 2236.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3313_Test extends AbstractCmTestBase
{
    
    /** The my UC 207 remove payments lock utils. */
    // Private member variables for the screen utils
    private UC207RemovePaymentsLockUtils myUC207RemovePaymentsLockUtils;

    /**
     * Constructor.
     */
    public CaseManTrac3313_Test ()
    {
        super (CaseManTrac3313_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC207RemovePaymentsLockUtils = new UC207RemovePaymentsLockUtils (this);

    }

    /**
     * Test will involve logging in as a Coventry user and creating an AE on a Case owned
     * by Northampton. The AE and the AE Fee created should be issued by Northampton.
     */
    public void testPaymentsLock ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Remove Payments Lock screen
            this.nav.navigateFromMainMenu (MAINMENU_REMOVE_PAYMENT_LOCK_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC207RemovePaymentsLockUtils.getScreenTitle ());

            // Check the number of rows returned is the expected number
            assertEquals ("Number of locks displayed is not the expected value", 2,
                    myUC207RemovePaymentsLockUtils.getNumberLockRecords ());

            // Check that no Coventry locks appear for the Northampton user
            assertFalse ("Coventry locks appearing for Northampton user",
                    myUC207RemovePaymentsLockUtils.isValueInResultsGrid ("180", 5));

            // Remove one of the locks
            myUC207RemovePaymentsLockUtils.clickRemoveButton ();

            // Check the number of rows returned is the expected number
            assertEquals ("Number of locks displayed is not the expected value", 1,
                    myUC207RemovePaymentsLockUtils.getNumberLockRecords ());

            // Check that no Coventry locks appear for the Northampton user
            assertFalse ("Coventry locks appearing for Northampton user",
                    myUC207RemovePaymentsLockUtils.isValueInResultsGrid ("180", 5));

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