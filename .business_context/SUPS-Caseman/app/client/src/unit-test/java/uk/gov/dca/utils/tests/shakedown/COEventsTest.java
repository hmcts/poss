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

package uk.gov.dca.utils.tests.shakedown;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC116COEventUtils;

/**
 * Automated tests for the CO events screen.
 *
 * @author Chris Vincent
 */
public class COEventsTest extends AbstractCmTestBase
{
    
    /** The my UC 116 CO event utils. */
    // Private member variables for the screen utils
    private UC116COEventUtils myUC116COEventUtils;

    /** The ao consolidated order. */
    private String aoConsolidatedOrder = "090001NN";
    
    /** The caeo consolidated order. */
    private String caeoConsolidatedOrder = "090002NN";

    /**
     * Constructor.
     */
    public COEventsTest ()
    {
        super (COEventsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Test to create different CO events with different configurations.
     */
    public void testCreateCOEvents1 ()
    {
        try
        {
            // Get to CO Events screen and load CO
            mLoginAndLoadCO (aoConsolidatedOrder);

            /**
             * Create Event 105 (AO & CAEO)
             * No Issue Stage / Service Status
             * No Creditor
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final NewStandardEvent testEvent105 = new NewStandardEvent ("105");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event105Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event105Questions.add (vdQ1);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent105, event105Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different CO events with different configurations.
     */
    public void testCreateCOEvents2 ()
    {
        try
        {
            // Get to CO Events screen and load CO
            mLoginAndLoadCO (aoConsolidatedOrder);

            /**
             * Create Event 936 (AO only)
             * No Issue Stage / Service Status
             * Select Creditor from list (must be debt of status PENDING)
             * Variable Data Screen (Oracle Report Output)
             */
            final NewStandardEvent testEvent936 = new NewStandardEvent ("936");
            testEvent936.setCreditor ("Debt 3 - AO CREDITOR THREE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event936Questions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent936, event936Questions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different CO events with different configurations.
     */
    public void testCreateCOEvents3 ()
    {
        try
        {
            // Get to CO Events screen and load CO
            mLoginAndLoadCO (caeoConsolidatedOrder);

            /**
             * Create Event 999 (AO & CAEO)
             * No Issue Stage / Service Status
             * Mandatory Details field
             * No Creditor
             * No Variable Data Screen / FCK Editor
             */
            final NewStandardEvent testEvent999 = new NewStandardEvent ("999");

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent999, null);

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
     * Private function that logs the user into CaseMan, navigates to CO Events and loads a CO Number.
     *
     * @param pCONumber The CO Number to load
     */
    private void mLoginAndLoadCO (final String pCONumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

        // Load Consolidated Order
        myUC116COEventUtils.loadCOByCONumber (pCONumber);
    }
}