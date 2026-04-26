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

package uk.gov.dca.utils.tests.releases.cm3_1;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC096AEFeesRefundsUtils;

/**
 * Automated tests for the CaseMan Defect 2437. This is a defect where the AE Issuing Court
 * Code was blanked when an update occurred on the AE Events screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2437_Test extends AbstractCmTestBase
{
    
    /** The my UC 096 AE fees refunds utils. */
    // Private member variables for the screen utils
    private UC096AEFeesRefundsUtils myUC096AEFeesRefundsUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The nn case CVAE. */
    // Northampton Cases with Coventry Issued AE
    private String nnCaseCVAE = "9NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac2437_Test ()
    {
        super (CaseManTrac2437_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC096AEFeesRefundsUtils = new UC096AEFeesRefundsUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that updates to the AE Events screen do not result in the blanking
     * of the AE Issuing Court Code column.
     */
    public void testUpdateAEEvents ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Ensure the Court Code field is set to Northampton and load
            // a Case owned by Northampton, but the AE is Issued by Coventry.
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (nnCaseCVAE);

            // Update an existing AE Events and navigate to Fees/Refunds to check if issuing
            // court has been blanked.
            myUC092AEEventUtils.setExistingEventDetails ("NEW DETAILS");
            myUC092AEEventUtils.saveScreen ();

            // Try navigating to the Fees and Refunds screen
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_AE_FEES);

            // Check in correct screen
            mCheckPageTitle (myUC096AEFeesRefundsUtils.getScreenTitle ());

            // Check the Issuing Court field is set to the Issuing Court of the AE (180)
            assertTrue ("Issuing Court is not Coventry (180)",
                    myUC096AEFeesRefundsUtils.getIssuingCourtFieldValue ().indexOf ("180") != -1);

            // Exit AE Fees screen
            myUC096AEFeesRefundsUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Exit the AE Events screen
            myUC092AEEventUtils.closeScreen ();
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