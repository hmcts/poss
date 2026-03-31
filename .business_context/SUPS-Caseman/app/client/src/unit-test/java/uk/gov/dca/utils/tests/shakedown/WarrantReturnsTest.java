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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the Warrant Returns screen.
 *
 * @author Chris Vincent
 */
public class WarrantReturnsTest extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The home warrant number. */
    private String homeWarrantNumber = "X0000001";
    
    /** The home CO warrant number. */
    private String homeCOWarrantNumber = "X0000002";
    
    /** The home warrant case number. */
    private String homeWarrantCaseNumber = "9NN00001";
    
    /** The home CO warrant CO number. */
    private String homeCOWarrantCONumber = "090001NN";
    
    /** The foreign local number. */
    private String foreignLocalNumber = "FWX00001";
    
    /** The foreign CO local number. */
    private String foreignCOLocalNumber = "FWX00002";
    
    /** The possession foreign local number. */
    private String possessionForeignLocalNumber = "FWX00003";

    /**
     * Constructor.
     */
    public WarrantReturnsTest ()
    {
        super (WarrantReturnsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns1 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 159 (Home & Foreign)
             * Optional Details field
             * Notice field editable (defaults to unchecked)
             * Appointment fields read only
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */

            // Load Foreign Warrant linked to CO
            myUC045WarrantReturnsUtils.setLocalNumber (foreignCOLocalNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent159 = new NewStandardEvent ("WarrantReturn-159");
            testEvent159.setSubjectParty ("DEBTOR EMP NAME");
            testEvent159.setCheckNotice (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event159Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OrderSuspend",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Previous judgment", this);
            event159Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("ApplicationBy",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Judgment Debtor", this);
            event159Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("DateOfPayment", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false), this);
            event159Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("OrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event159Questions.add (vdQ4);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent159, event159Questions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns2 ()
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
            myUC045WarrantReturnsUtils.setLocalNumber (possessionForeignLocalNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAI = new NewStandardEvent ("WarrantReturn-AI");
            testEventAI.setSubjectParty ("OLE BEETROOT NOSE");
            testEventAI.setCheckNotice (false);
            testEventAI.setAppointmentDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false));
            testEventAI.setAppointmentTime ("13:15");

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAI, null);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns3 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return AX (Home & Foreign)
             * Mandatory Details field
             * Notice field read only
             * Appointment fields read only
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */

            // Load Home Warrant linked to a Case
            myUC045WarrantReturnsUtils.setWarrantNumber (homeWarrantNumber);
            myUC045WarrantReturnsUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAX = new NewStandardEvent ("WarrantReturn-AX");
            testEventAX.setSubjectParty ("DEFENDANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAXQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAXQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAX, eventAXQuestions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns4 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return FE (Foreign Warrants only)
             * Notice field editable (defaults to not checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Foreign Warrant linked to a Case
            myUC045WarrantReturnsUtils.setLocalNumber (foreignLocalNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventFE = new NewStandardEvent ("WarrantReturn-FE");
            testEventFE.setSubjectParty ("DEFENDANT NAME");
            testEventFE.setCheckNotice (false);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventFE, null);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns5 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 101 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Home Warrant linked to a Case
            myUC045WarrantReturnsUtils.setWarrantNumber (homeWarrantNumber);
            myUC045WarrantReturnsUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns6 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 121 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Home Warrant
            myUC045WarrantReturnsUtils.setWarrantNumber (homeWarrantNumber);
            myUC045WarrantReturnsUtils.setCaseNumber (homeWarrantCaseNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent121 = new NewStandardEvent ("WarrantReturn-121");
            testEvent121.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent121.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent121, null);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns7 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return NE (Foreign Warrants type POSESSION only)
             * Notice field editable (defaults to not checked)
             * Appointment fields editable and mandatory
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */

            // Load Foreign Posession Warrant
            myUC045WarrantReturnsUtils.setLocalNumber (possessionForeignLocalNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNE = new NewStandardEvent ("WarrantReturn-NE");
            testEventNE.setSubjectParty ("OLE BEETROOT NOSE");
            testEventNE.setCheckNotice (true);
            testEventNE.setAppointmentDate (AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false));
            testEventNE.setAppointmentTime ("13:15");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNEQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("BailiffName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "MUSTAFA THE HARD", this);
            eventNEQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNE, eventNEQuestions);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create different Warrant Returns with different configurations.
     */
    public void testCreateWarrantReturns8 ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return AY (Home & Foreign)
             * Mandatory Details field
             * Notice field read only
             * Appointment fields read only
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */

            // Load Home Warrant linked to CO
            myUC045WarrantReturnsUtils.setWarrantNumber (homeCOWarrantNumber);
            myUC045WarrantReturnsUtils.setCONumber (homeCOWarrantCONumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAY = new NewStandardEvent ("WarrantReturn-AY");
            testEventAY.setSubjectParty ("DEBTOR EMP NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAYQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAYQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAY, eventAYQuestions);

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
     * Private function that logs the user into CaseMan and navigates to Warrant Returns screen.
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

}