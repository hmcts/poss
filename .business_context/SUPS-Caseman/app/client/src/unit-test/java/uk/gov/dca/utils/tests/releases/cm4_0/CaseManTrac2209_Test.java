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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC108CreateCOUtils;
import uk.gov.dca.utils.screens.UC108MaintainDebtUtils;

/**
 * Automated tests for the TRAC 2209 SET A NEW DEBT STATUS TO DEFAULT TO LIVE.
 *
 * @author Mark Groen
 */
public class CaseManTrac2209_Test extends AbstractCmTestBase
{
    
    /** The my UC 108 create CO utils. */
    // Private member variables for the screen utils
    private UC108CreateCOUtils myUC108CreateCOUtils;
    
    /** The my UC 108 maintain debt utils. */
    private UC108MaintainDebtUtils myUC108MaintainDebtUtils;

    /**
     * Constructor.
     */
    public CaseManTrac2209_Test ()
    {
        super (CaseManTrac2209_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC108MaintainDebtUtils = new UC108MaintainDebtUtils (this);
        myUC108CreateCOUtils = new UC108CreateCOUtils (this);

    }

    /**
     * Tests that the default status when adding a debt to a co is LIVE.
     */
    public void testaddDebtCheckDefaultStatus ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Foreign Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());

            myUC108CreateCOUtils.clickCreateCOButton ();
            myUC108CreateCOUtils.clickMaintainDebtButton ();

            // Check in correct screen
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            myUC108MaintainDebtUtils.clickAddDebtButton ();

            // Check Welsh Names are still populated when submitted
            assertTrue ("Debt Status is not the expected default value of LIVE",
                    myUC108MaintainDebtUtils.getDebtStatus ().equals (UC108MaintainDebtUtils.DEBT_STATUS_LIVE));

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