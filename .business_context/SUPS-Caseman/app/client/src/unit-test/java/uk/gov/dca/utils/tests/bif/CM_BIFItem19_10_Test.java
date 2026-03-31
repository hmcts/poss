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
public class CM_BIFItem19_10_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case CC. */
    private String caseCC = "3NN00001";
    
    /** The case HC. */
    private String caseHC = "3NN00003";
    
    /** The case CCBC. */
    private String caseCCBC = "3NN00005";
    
    /** The case insolv. */
    private String caseInsolv = "A15NN001";

    /**
     * Constructor.
     */
    public CM_BIFItem19_10_Test ()
    {
        super (CM_BIFItem19_10_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests the BMS code associated with case events 28, 29, 37, 137, 344, 603 and 631 on a County Court case.
     */
    public void testCaseEvent28_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseCC);

            final NewStandardEvent testEvent28 = new NewStandardEvent ("28");
            testEvent28.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            testEvent28.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent28, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("28");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent29 = new NewStandardEvent ("29");
            testEvent29.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent29, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("29");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent37 = new NewStandardEvent ("37");
            testEvent37.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent37, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("37");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent137 = new NewStandardEvent ("137");
            testEvent137.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent137, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("137");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent344 = new NewStandardEvent ("344");
            myUC002CaseEventUtils.addNewEvent (testEvent344, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("344");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent603 = new NewStandardEvent ("603");
            testEvent603.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent603, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("603");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent631 = new NewStandardEvent ("631");
            myUC002CaseEventUtils.addNewEvent (testEvent631, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("631");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case events 28, 29, 37, 137, 344, 603 and 631 on a High Court case.
     */
    public void testCaseEvent28_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseHC);

            final NewStandardEvent testEvent28 = new NewStandardEvent ("28");
            testEvent28.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            testEvent28.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent28, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("28");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent29 = new NewStandardEvent ("29");
            testEvent29.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent29, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("29");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent37 = new NewStandardEvent ("37");
            testEvent37.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent37, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("37");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent137 = new NewStandardEvent ("137");
            testEvent137.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent137, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("137");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent344 = new NewStandardEvent ("344");
            myUC002CaseEventUtils.addNewEvent (testEvent344, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("344");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent603 = new NewStandardEvent ("603");
            testEvent603.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent603, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("603");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent631 = new NewStandardEvent ("631");
            myUC002CaseEventUtils.addNewEvent (testEvent631, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("631");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case events 28, 29, 37, 137, 344, 603 and 631 on an insolvency case.
     */
    public void testCaseEvent28_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseInsolv);

            final NewStandardEvent testEvent344 = new NewStandardEvent ("344");
            myUC002CaseEventUtils.addNewEvent (testEvent344, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("344");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent631 = new NewStandardEvent ("631");
            myUC002CaseEventUtils.addNewEvent (testEvent631, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("631");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the BMS code associated with case events 28, 29, 37, 137, 344, 603 and 631 on a CCBC case.
     */
    public void testCaseEvent28_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseCCBC);

            final NewStandardEvent testEvent28 = new NewStandardEvent ("28");
            testEvent28.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            testEvent28.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent28, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("28");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent29 = new NewStandardEvent ("29");
            testEvent29.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent29, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("29");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent37 = new NewStandardEvent ("37");
            testEvent37.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent37, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("37");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent137 = new NewStandardEvent ("137");
            testEvent137.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent137, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("137");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent344 = new NewStandardEvent ("344");
            myUC002CaseEventUtils.addNewEvent (testEvent344, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("344");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent603 = new NewStandardEvent ("603");
            testEvent603.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent (testEvent603, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("603");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());

            final NewStandardEvent testEvent631 = new NewStandardEvent ("631");
            myUC002CaseEventUtils.addNewEvent (testEvent631, null);

            // Check BMS Task
            myUC002CaseEventUtils.selectCaseEventByEventId ("631");
            assertEquals ("BC056", myUC002CaseEventUtils.getEventBMSTask ());
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