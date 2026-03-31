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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class WarrantReturnOutputTest extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /**
     * Constructor.
     */
    public WarrantReturnOutputTest ()
    {
        super (WarrantReturnOutputTest.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Generates L_BLANK_AX (Warrant Return AX).
     */
    public void testL_Blank_AX ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AX");
            testEvent.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK_AY (Warrant Return AY).
     */
    public void testL_Blank_AY ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AY");
            testEvent.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_13_1 (Warrant Return FN).
     */
    public void testL_13_1 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-FN");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffName", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_13_3 (Warrant Return NP).
     */
    public void testL_13_3 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-NP");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PaymentDueDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffName", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_13_2 (Warrant Return NV).
     */
    public void testL_13_2 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-NV");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffVisitDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffName", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates EX96 (Warrant Return AI).
     */
    public void testEX96 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return AI (Home & Foreign Warrants, type POSESSION or DELIVERY only)
             * Notice field editable (defaults to not checked)
             * Appointment fields editable and mandatory
             * Word Processing Output is generated but no variable data screen or FCK Editor
             */

            // Load Foreign Possession Warrant
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AI");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (false);
            testEvent.setAppointmentDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false));
            testEvent.setAppointmentTime ("13:15");

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N246A (Warrant Return AE).
     */
    public void testN246A ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AE");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N54 (Warrant Return NE).
     */
    public void testN54 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            // Load Foreign Posession Warrant
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-NE");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);
            testEvent.setAppointmentDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false));
            testEvent.setAppointmentTime ("13:15");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffName", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_1_3_4 (Warrant Return 159).
     */
    public void testO_1_3_4 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            // Load warrant
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-159");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderSuspend", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationBy",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Debtor", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfPayment", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDate", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR065_DO (Warrant Return DO).
     */
    public void testCJR065_DO ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            // Load Foreign Posession Warrant
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-DO");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the Warrant Returns screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());
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