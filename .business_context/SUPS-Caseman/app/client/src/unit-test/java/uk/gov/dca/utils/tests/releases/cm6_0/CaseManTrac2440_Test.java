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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the CaseMan Defect 2440. This covers automatic AE Events
 * 822, 824, 825, 826, 832, 835 and 850 which should not be created manually on the AE Events
 * screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2440_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The invalid AE event id message. */
    // Error messages displayed in the status bar
    private String invalidAEEventIdMessage = "You have entered an invalid value - please re-enter.";

    /**
     * Constructor.
     */
    public CaseManTrac2440_Test ()
    {
        super (CaseManTrac2440_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that user is unable to manually add AE Events 822, 824, 825, 826, 832, 835 and 850.
     */
    public void testCreateCAPSAEEvents ()
    {
        try
        {
            // Login and Load AE record
            mLoginAndLoadAE ();

            final String[] aeEventList = {"822", "824", "825", "826", "832", "835", "850"};
            for (int i = 0, l = aeEventList.length; i < l; i++)
            {
                // Enter AE Event Id
                myUC092AEEventUtils.setMasterEventId (aeEventList[i]);

                // Set focus in the Event Id field to display the error message in the status bar
                myUC092AEEventUtils.setFocusInMasterEventId ();

                // Check the status bar shows the correct error message
                mCheckStatusBarText (invalidAEEventIdMessage);

                // Clear the Event Id field
                myUC092AEEventUtils.setMasterEventId ("");
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that existing AE Events 822, 824, 825, 826, 832, 835 and 850 can still be viewed
     * on the AE Events screen.
     */
    public void testExistingCAPSAEEvents ()
    {
        try
        {
            // Login and Load AE record
            mLoginAndLoadAE ();

            final String[] aeEventList = {"822", "824", "825", "826", "832", "835", "850"};
            for (int i = 0, l = aeEventList.length; i < l; i++)
            {
                // Select the specified Event Id in the grid
                myUC092AEEventUtils.selectGridRowByEventId (aeEventList[i]);

                // Check Event Id field contains the correct value
                assertTrue ("Existing AE Event " + aeEventList[i] + " is not visible.",
                        myUC092AEEventUtils.getEventIdFieldValue ().equals (aeEventList[i]));
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

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status bar message is not equal to '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to AE Events and loads an AE record.
     */
    private void mLoginAndLoadAE ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC092AEEventUtils.loadAEByCaseNumber ("9NN00001");
    }

}