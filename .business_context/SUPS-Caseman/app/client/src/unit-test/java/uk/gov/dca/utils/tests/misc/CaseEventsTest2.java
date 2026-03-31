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

package uk.gov.dca.utils.tests.misc;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class CaseEventsTest2 extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseEventsTest2 ()
    {
        super (CaseEventsTest2.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Test to create different case events with different configurations.
     */
    public void testCreateCaseEvents1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ();

            final NewStandardEvent testEvent5 = new NewStandardEvent ("5");

            final NewStandardEvent testEvent20 = new NewStandardEvent ("20");
            testEvent20.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent20.setProduceOutputFlag (false);

            final NewStandardEvent testEvent40 = new NewStandardEvent ("40");
            testEvent40.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");

            final NewStandardEvent testEvent50 = new NewStandardEvent ("50");
            testEvent50.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");

            final NewStandardEvent testEvent71 = new NewStandardEvent ("71");
            testEvent71.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");

            final NewStandardEvent testEvent136 = new NewStandardEvent ("136");
            testEvent136.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");

            final NewStandardEvent testEvent233 = new NewStandardEvent ("233");
            testEvent233.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent233.setInstigatorParty ("DEFENDANT ONE NAME");
            testEvent233.setProduceOutputFlag (false);

            final NewStandardEvent testEvent323 = new NewStandardEvent ("323");
            testEvent323.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent323.setInstigatorParty ("DEFENDANT ONE NAME");
            testEvent323.setProduceOutputFlag (false);

            final NewStandardEvent testEvent439 = new NewStandardEvent ("439");
            testEvent439.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");

            final NewStandardEvent testEvent555 = new NewStandardEvent ("555");

            // Add the events
            for (int i = 0; i < 10; i++)
            {
                myUC002CaseEventUtils.addNewEvent (testEvent5, null);
                myUC002CaseEventUtils.addNewEvent (testEvent20, null);
                myUC002CaseEventUtils.addNewEvent (testEvent40, null);
                myUC002CaseEventUtils.addNewEvent (testEvent50, null);
                myUC002CaseEventUtils.addNewEvent (testEvent71, null);
                myUC002CaseEventUtils.addNewEvent (testEvent136, null);
                myUC002CaseEventUtils.addNewEvent (testEvent233, null);
                myUC002CaseEventUtils.addNewEvent (testEvent555, null);
                myUC002CaseEventUtils.addNewEvent (testEvent555, null);
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
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     */
    private void mLoginAndLoadCase ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");
    }

}