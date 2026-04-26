/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the AE Events and CO Events screens.
 *
 * @author Chris Vincent
 */
public class TCE_EventWarrantCreation_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;

    /**
     * Constructor.
     */
    public TCE_EventWarrantCreation_Test ()
    {
        super (TCE_EventWarrantCreation_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Tests Warrant creation with AE Event 876 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testAeEvent876WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load AE Details
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber ("A04NN024");

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC092AEEventUtils.selectGridRowByEventId ("876");
            final String eventDetails = myUC092AEEventUtils.getExistingEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

            // Test that the warrant type is CONTROL
            assertTrue ("Error: Control Warrant not created", checkControlWarrantCreated (warrantNumber, "282"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with CO Event 876 and that a FEES_PAID record
     * with a value of 0 has been created.
     */
    public void testCOEvent876WarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            // Load CO Details
            myUC116COEventUtils.loadCOByCONumber ("140001NN");

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("CO-876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ThisCourtToExecute_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("AmountOfFineToRecover_CO",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ2);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent876, event876Questions);

            // Retrieve the last 8 characters of the 876 Details field which will be the Warrant Number
            myUC116COEventUtils.selectRecordByEventId ("876");
            final String eventDetails = myUC116COEventUtils.getCOEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // TEST THAT FEES_PAID RECORD IS CREATED AND SET TO 0.00
            final int numFeesPaidRecords = DBUtil.getNumberFeesPaidRecords ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID records is not 1 (" + numFeesPaidRecords + " instead)",
                    numFeesPaidRecords == 1);

            final String amount = DBUtil.getFeesPaidAmount ("W", warrantNumber, "282");
            assertTrue ("Number FEES_PAID record has wrong amount (is " + amount + ")", amount.equals ("0"));

            // Test that the warrant type is CONTROL
            assertTrue ("Error: Control Warrant not created", checkControlWarrantCreated (warrantNumber, "282"));

            // Try and create another CO Event 876/Warrant and check validation prevents it
            myUC116COEventUtils.openAddEventPopup ("876");

            // Check event is invalid and correct message displayed
            assertFalse ("Error, new event popup is open", myUC116COEventUtils.isAddEventPopupOpen ());
            mCheckStatusBarText ("Live CONTROL warrant already exists.");
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

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Checks that the automatic warrant created has the correct warrant type of CONTROL.
     *
     * @param pWarrantNumber Warrant number to search for
     * @param pCourtCode Court code to search for
     * @return True if warrant is a CONTROL warrant, else false
     */
    private boolean checkControlWarrantCreated (final String pWarrantNumber, final String pCourtCode)
    {
        // Generate the query and run in the database
        final String query = "SELECT DECODE(w.warrant_type, 'CONTROL', 'true', 'false') FROM warrants w WHERE " +
                "w.warrant_number = '" + pWarrantNumber + "' AND " + "w.currently_owned_by = " + pCourtCode;

        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}