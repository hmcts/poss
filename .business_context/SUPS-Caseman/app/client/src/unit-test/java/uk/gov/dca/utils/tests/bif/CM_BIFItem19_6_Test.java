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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem19_6_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem19_6_Test ()
    {
        super (CM_BIFItem19_6_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests the BMS code associated with case event 136 on a non-CCBC County Court case.
     */
    public void testCaseEvent136_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00001");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("JH11", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on a non-CCBC High Court case.
     */
    public void testCaseEvent136_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00003");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("DR18", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on a CCBC case.
     */
    public void testCaseEvent136_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00005");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("BC016", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN001");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN002");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Applicant 1 - APPLICANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN003");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("The Company 1 - COMPANY NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_7 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN004");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Creditor 1 - CREDITOR NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_8 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN005");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Insolvency Practitioner 1 - INSOLVENCY PRACTITIONER NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case event 136 on an Insolvency case.
     */
    public void testCaseEvent136_9 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("A15NN006");

            final NewStandardEvent testEvent = new NewStandardEvent ("136");
            testEvent.setSubjectParty ("Petitioner 1 - PETITIONER NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("136");
            assertEquals ("IN19", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     */
    private void loginAndLoadCase (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
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