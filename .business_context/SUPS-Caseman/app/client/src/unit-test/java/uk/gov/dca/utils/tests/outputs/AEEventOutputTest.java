/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.outputs;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class AEEventOutputTest extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /**
     * Constructor.
     */
    public AEEventOutputTest ()
    {
        super (AEEventOutputTest.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Generates L_8_6 (AE Event 892).
     */
    public void testL_8_6 ()
    {
        try
        {
            // Get to the AE Events screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC092AEEventUtils.loadAEByCaseNumber ("2NN00001");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("892");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39HearingDate", this));

            // Add the event and clear screen down afterwards
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK_AE (AE Event 100).
     */
    public void testL_BLANK_AE ()
    {
        try
        {
            // Get to the AE Events screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC092AEEventUtils.loadAEByCaseNumber ("2NN00001");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("100-AE");
            testEvent.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event and clear screen down afterwards
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK_AE_CAPS (AE Event 126).
     */
    public void testL_BLANK_AE_CAPS ()
    {
        try
        {
            // Get to the AE Events screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC092AEEventUtils.loadAEByCaseNumber ("2NN00001");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("126");
            testEvent.setNavigateObligations (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event and clear screen down afterwards
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the AE Events screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the AE Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());
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