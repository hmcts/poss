/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9357 $
 * $Author: vincentcp $
 * $Date: 2012-01-05 10:09:53 +0000 (Thu, 05 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 1900. This covers a change to the Enter/Query Details of Case Events screen to
 * only display the current Solicitor for the Claimant in the Parties grid.
 *
 * @author Des Johnston
 */
public class CaseManTrac1900_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case number A. */
    private String caseNumberA = "0QX00001";
    
    /** The sol party A. */
    private String solPartyA = "1500";

    /**
     * Constructor.
     */
    public CaseManTrac1900_Test ()
    {
        super (CaseManTrac1900_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when the Claimant on a CCBC Case adds a new solicitor, only the details of
     * the new solicitor are displayed in the parties header grid on the Case Events screen.
     */
    public void testSolicitorInHeaderGrid ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case owned by the CCBC
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberA);

            // Test Solicitor One is displayed in the header grid
            assertEquals ("1", myUC002CaseEventUtils.getPartiesHeaderGridValue (2, 3));

            // Navigate to the Cases screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            myUC001CreateUpdateCaseUtils.selectTabbedPage (UC001CreateUpdateCaseUtils.TABBED_PAGE_CLAIMANT);

            // Click the Add Solicitor Button
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Add a Solicitor Code
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode (solPartyA);

            // Click OK in add solicitor popup
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            // Click close for notification date
            myUC001CreateUpdateCaseUtils.clickNotificationPopupClose ();

            // Save the record and exit back to the Case Events screen
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Test Solicitor Two is displayed in the header grid
            assertEquals ("2", myUC002CaseEventUtils.getPartiesHeaderGridValue (2, 3));

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
