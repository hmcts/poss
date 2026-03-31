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

package uk.gov.dca.utils.tests.central_ae;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests checking final return creation on a warrant associated
 * with a case that does not exist in the CaseMan database.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5744_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 031 reissue warrant utils. */
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /**
     * Constructor.
     */
    public CaseMan_Trac5744_Test ()
    {
        super (CaseMan_Trac5744_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Tests that when a final return is created on a warrant linked to a case
     * that does not exist in the CaseMan database, the application does not
     * crash.
     */
    public void testCreateFinalWarrantReturn ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Warrant Returns screen
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load Warrant not linked to a case
            myUC045WarrantReturnsUtils.setWarrantNumber ("3A000001");
            myUC045WarrantReturnsUtils.setCaseNumber ("A16PB001");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent140 = new NewStandardEvent ("WarrantReturn-140");

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent140, null);

            // Check Task Counts table
            assertEquals (1, DBUtil.getBMSTaskCount ("EN52", "282"));

            // Error off the final return and unerror it
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("140");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);

            // Navigate to the Reissue Warrants screen
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_REISSUE_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC031ReissueWarrantUtils.getScreenTitle ());

            // Reissue the warrant
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100");
            myUC031ReissueWarrantUtils.setWarrantFee ("100");
            myUC031ReissueWarrantUtils.setLandRegistryFee ("100");
            myUC031ReissueWarrantUtils.clickSaveButton ();

            myUC031ReissueWarrantUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a final return is created on a warrant linked to a case
     * that does not exist in the CaseMan database, the application does not
     * crash.
     */
    public void testForwardWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Enter search criteria and load warrant
            myUC039MaintainWarrantUtils.setWarrantNumber ("3A000001");
            myUC039MaintainWarrantUtils.setCaseNumber ("A16PB001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Transfer the warrant to another court which will generate a final return 147
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Navigate to Warrant Returns screen
            myUC039MaintainWarrantUtils
                    .clickNavigationButton (UC039MaintainWarrantUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Error final return 147
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

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