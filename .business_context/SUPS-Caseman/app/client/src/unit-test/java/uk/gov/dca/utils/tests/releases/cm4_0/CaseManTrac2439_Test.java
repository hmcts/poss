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
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 2439. This includes a change to the Instigator
 * configuration for Case Event 31.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2439_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The test case number. */
    // Case Number to use
    private String testCaseNumber = "0NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac2439_Test ()
    {
        super (CaseManTrac2439_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests the Instigator configuration of Case Event 31 including the
     * Instigator label and the multi select configuration.
     */
    public void testCaseEvent31Instigator ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            // Add the event
            myUC002CaseEventUtils.openAddEventPopup ("31");

            // Set the Subject field to enable the Instigator grid
            myUC002CaseEventUtils.setEventSubject ("Claimant 1 - CLAIMANT ONE NAME");

            // Check instigator label
            assertTrue ("Case Event 31 Instigator label incorrect", myUC002CaseEventUtils.getEventInstigatorLabel ()
                    .equals ("Select the party who requires a copy of the notice"));

            // Enter the first Instigator (should be ok)
            myUC002CaseEventUtils.selectInstigatorParty ("DEFENDANT ONE NAME");

            // Enter the second Instigator (should display JavaScript alert)
            myUC002CaseEventUtils.selectInstigatorParty ("DEFENDANT TWO NAME");
            assertTrue ("No error message displayed when multiple Instigators selected", this.isAlertPresent ());

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