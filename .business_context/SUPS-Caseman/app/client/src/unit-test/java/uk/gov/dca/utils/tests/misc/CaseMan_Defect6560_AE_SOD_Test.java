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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC090AESODUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the AE Start of Day Screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_Defect6560_AE_SOD_Test extends AbstractCmTestBase
{
    
    /** The my UC 090 AESOD utils. */
    private UC090AESODUtils myUC090AESODUtils;

    /**
     * Constructor.
     */
    public CaseMan_Defect6560_AE_SOD_Test ()
    {
        super (CaseMan_Defect6560_AE_SOD_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC090AESODUtils = new UC090AESODUtils (this);
    }

    /**
     * Tests the AE Start of Day report runs correctly.
     */
    public void testAEStartOfDay ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Reset the AE Start of Day last run date system data item to the previous day
            DBUtil.setSystemDataItem ("AE RUNDATE", "282",
                    AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_SYSDATA, false));

            // Navigate to the Accumulative AE Fees screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_SOD_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC090AESODUtils.getScreenTitle ());

            // Run report
            myUC090AESODUtils.runReport ();

            // Exit Screen
            myUC090AESODUtils.closeScreen ();
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