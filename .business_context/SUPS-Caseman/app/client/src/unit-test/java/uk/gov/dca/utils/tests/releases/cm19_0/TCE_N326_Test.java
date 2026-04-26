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
import uk.gov.dca.utils.screens.UC034WarrantsN326Utils;

/**
 * Automated tests for the Case Numbering changes to the Warrants Notice of Issue N326 screen.
 *
 * @author Chris Vincent
 */
public class TCE_N326_Test extends AbstractCmTestBase
{
    
    /** The my UC 034 warrants N 326 utils. */
    // Private member variables for the screen utils
    private UC034WarrantsN326Utils myUC034WarrantsN326Utils;

    /**
     * Constructor.
     */
    public TCE_N326_Test ()
    {
        super (TCE_N326_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC034WarrantsN326Utils = new UC034WarrantsN326Utils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Warrants Notice of Issue N326 screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testN326ScreenTitle ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Warrants Notice of Issue N326 screen
            this.nav.navigateFromMainMenu (MAINMENU_N326_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC034WarrantsN326Utils.getScreenTitle ());
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