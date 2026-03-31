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

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC086ReprintReportsUtils;
import uk.gov.dca.utils.screens.UC090AESODUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the BIF Item 24.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem24_Test extends AbstractCmTestBase
{
    
    /** The my UC 090 AESOD utils. */
    private UC090AESODUtils myUC090AESODUtils;
    
    /** The my UC 086 reprint reports utils. */
    private UC086ReprintReportsUtils myUC086ReprintReportsUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem24_Test ()
    {
        super (CM_BIFItem24_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC090AESODUtils = new UC090AESODUtils (this);
        myUC086ReprintReportsUtils = new UC086ReprintReportsUtils (this);
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

            // Navigate to the AE Start of Day screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_SOD_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC090AESODUtils.getScreenTitle ());

            // Run report
            myUC090AESODUtils.runReport ();

            // Exit Screen
            myUC090AESODUtils.closeScreen ();

            // Navigate to the Reprint Reports screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_REPRINT_REPORTS_PATH);

            assertTrue ("Unexpected number of AE Events created in SOD", checkNumberAEEventsForAESOD ("75"));

            // Check in correct screen
            mCheckPageTitle (myUC086ReprintReportsUtils.getScreenTitle ());

            // First select Cancel which will just close the popup without reprinting
            myUC086ReprintReportsUtils.reprintAuthorisationList (UC086ReprintReportsUtils.AUTH_LST_DIALOG_CANCEL);

            // Now select Yes which will just reprint the Authorisation List
            myUC086ReprintReportsUtils.reprintAuthorisationList (UC086ReprintReportsUtils.AUTH_LST_DIALOG_NO);

            // Now select No which will reprint everything
            myUC086ReprintReportsUtils.reprintAuthorisationList (UC086ReprintReportsUtils.AUTH_LST_DIALOG_YES);

            myUC086ReprintReportsUtils.closeScreen ();
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
     * Checks the number of rows in the AE_EVENTS table that have been created by AE SOD.
     *
     * @param pExpectedRows Expected number of rows
     * @return True if the number of rows are as expected, else false
     */
    private boolean checkNumberAEEventsForAESOD (final String pExpectedRows)
    {
        final String query = "SELECT DECODE(COUNT(*), " + pExpectedRows +
                ", 'true', 'false') FROM ae_events WHERE sod_reference IS NOT NULL";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }
}