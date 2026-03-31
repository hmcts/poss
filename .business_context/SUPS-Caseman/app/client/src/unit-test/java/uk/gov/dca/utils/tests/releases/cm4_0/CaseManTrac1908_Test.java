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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the AE Events screen.
 *
 * @author Troy Baines
 */
public class CaseManTrac1908_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManTrac1908_Test ()
    {
        super (CaseManTrac1908_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Test to create different AE Events with different configurations.
     */
    public void testCreateAEEvents ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC092AEEventUtils.loadAEByCaseNumber ("9NN00001");

            // Change Service to NOT SERVED
            myUC092AEEventUtils.markEventAsNotServed ();

            // Go to Case Events screen
            myUC092AEEventUtils.clickCaseEventsButton ();

            // Select Event 645
            myUC002CaseEventUtils.selectCaseEventByEventId ("645");

            // Check values in fields
            final String eventDate = myUC002CaseEventUtils.getEventDate ();

            final String receiptDate = myUC002CaseEventUtils.getEventReceiptDate ();

            assertTrue ("Date loaded is not the expected value",
                    eventDate.equals (AbstractBaseUtils.now ().toUpperCase ()));

            assertTrue ("Receipt Date loaded is not the expected value",
                    receiptDate.equals (AbstractBaseUtils.now ().toUpperCase ()));

            assertTrue ("Created By loaded is not the expected value",
                    myUC002CaseEventUtils.getCreatedBy ().equals ("Robbie Fowler"));

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