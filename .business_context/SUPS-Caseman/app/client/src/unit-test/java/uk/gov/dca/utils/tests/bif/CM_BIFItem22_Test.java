/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11720 $
 * $Author: vincentcp $
 * $Date: 2015-03-04 21:15:55 +0000 (Wed, 04 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC202MaintainUserProfilesUtils;

/**
 * Automated tests for the CaseMan BIF Item #22.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem22_Test extends AbstractCmTestBase
{
    
    /** The my UC 202 maintain user profiles utils. */
    // Private member variables for the screen utils
    private UC202MaintainUserProfilesUtils myUC202MaintainUserProfilesUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem22_Test ()
    {
        super (CM_BIFItem22_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC202MaintainUserProfilesUtils = new UC202MaintainUserProfilesUtils (this);
    }

    /**
     * Tests the Court User Report.
     */
    public void testCourtUserReport ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to the Maintain User Profile screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_USER_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC202MaintainUserProfilesUtils.getScreenTitle ());

            myUC202MaintainUserProfilesUtils.printUserReport ();
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