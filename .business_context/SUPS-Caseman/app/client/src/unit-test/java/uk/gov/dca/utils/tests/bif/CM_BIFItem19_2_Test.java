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

package uk.gov.dca.utils.tests.bif;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem19_2_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem19_2_Test ()
    {
        super (CM_BIFItem19_2_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Tests the BMS counting for Interim Warrant Return LC on a Home Warrant.
     */
    public void testCreateWarrantReturnLCOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-LC");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return LC on a Foreign Warrant.
     */
    public void testCreateWarrantReturnLCOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-LC");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN72", "282"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return LD on a Home Warrant.
     */
    public void testCreateWarrantReturnLDOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-LD");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return LD on a Foreign Warrant.
     */
    public void testCreateWarrantReturnLDOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-LD");
            testEvent.setSubjectParty ("DEFENDANT NAME");
            testEvent.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN72", "282"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return AX on a Home Warrant.
     */
    public void testCreateWarrantReturnAXOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAX = new NewStandardEvent ("WarrantReturn-AX");
            testEventAX.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAXQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAXQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAX, eventAXQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return AX on a Foreign Warrant.
     */
    public void testCreateWarrantReturnAXOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAX = new NewStandardEvent ("WarrantReturn-AX");
            testEventAX.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAXQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAXQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAX, eventAXQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return AY on a Home Warrant.
     */
    public void testCreateWarrantReturnAYOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAY = new NewStandardEvent ("WarrantReturn-AY");
            testEventAY.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAYQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAYQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAY, eventAYQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return AY on a Foreign Warrant.
     */
    public void testCreateWarrantReturnAYOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAY = new NewStandardEvent ("WarrantReturn-AY");
            testEventAY.setSubjectParty ("DEFENDANT NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventAYQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventAYQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAY, eventAYQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return FN on a Home Warrant.
     */
    public void testCreateWarrantReturnFNOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventFN = new NewStandardEvent ("WarrantReturn-FN");
            testEventFN.setSubjectParty ("DEFENDANT NAME");
            testEventFN.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventFNQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventFNQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventFNQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventFN, eventFNQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return FN on a Foreign Warrant.
     */
    public void testCreateWarrantReturnFNOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventFN = new NewStandardEvent ("WarrantReturn-FN");
            testEventFN.setSubjectParty ("DEFENDANT NAME");
            testEventFN.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventFNQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventFNQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventFNQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventFN, eventFNQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return NP on a Home Warrant.
     */
    public void testCreateWarrantReturnNPOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return NP on a Foreign Warrant.
     */
    public void testCreateWarrantReturnNPOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return NV on a Home Warrant.
     */
    public void testCreateWarrantReturnNVOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNV = new NewStandardEvent ("WarrantReturn-NV");
            testEventNV.setSubjectParty ("DEFENDANT NAME");
            testEventNV.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNVQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("BailiffVisitDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNVQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNVQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNV, eventNVQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));

            // Check Case Events screen (event 610)
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            myUC002CaseEventUtils.selectCaseEventByEventId ("610");
            assertEquals ("", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS counting for Interim Warrant Return NV on a Foreign Warrant.
     */
    public void testCreateWarrantReturnNVOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNV = new NewStandardEvent ("WarrantReturn-NV");
            testEventNV.setSubjectParty ("DEFENDANT NAME");
            testEventNV.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNVQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("BailiffVisitDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNVQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNVQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNV, eventNVQuestions);

            // Check Task Counts table
            assertEquals (0, DBUtil.getBMSTaskCount ("EN61", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN62", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("EN71", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("EN72", "282"));
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