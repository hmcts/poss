/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mullangisa $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.misc;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC099AccumAEFeesUtils;

/**
 * Automated tests for the Accumulative AE Fees Screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac870_CM_AAEF_Test extends AbstractCmTestBase
{
    
    /** The my UC 099 accum AE fees utils. */
    private UC099AccumAEFeesUtils myUC099AccumAEFeesUtils;

    /**
     * Constructor.
     */
    public CaseMan_Trac870_CM_AAEF_Test ()
    {
        super (CaseMan_Trac870_CM_AAEF_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC099AccumAEFeesUtils = new UC099AccumAEFeesUtils (this);
    }

    /**
     * Tests the generation of the Accumulative AE Fees Report multiple times
     * to ensure the same values are printed each time.
     */
    public void testMultipleReportGeneration ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            for (int i = 0; i < 50; i++)
            {
                // Navigate to the Accumulative AE Fees screen
                this.nav.navigateFromMainMenu (MAINMENU_RESET);
                this.nav.navigateFromMainMenu (MAINMENU_ACCUMULATIVE_AE_FEES_PATH);

                // Check in correct screen
                mCheckPageTitle (myUC099AccumAEFeesUtils.getScreenTitle ());

                // Set Start and End Dates
                myUC099AccumAEFeesUtils.setStartDate ("01-Aug-2009");
                myUC099AccumAEFeesUtils.setEndDate ("20-Aug-2009");

                // Run report
                myUC099AccumAEFeesUtils.runReport ();

                // Exit Screen
                myUC099AccumAEFeesUtils.closeScreen ();
            }

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