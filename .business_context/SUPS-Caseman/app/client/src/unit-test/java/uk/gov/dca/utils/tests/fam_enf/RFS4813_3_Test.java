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

package uk.gov.dca.utils.tests.fam_enf;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class RFS4813_3_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // FAMILY ENF - FAMILY COURT case
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // FAMILY ENF - REMO case (has judgment)
    
    /** The cc case. */
    private String ccCase = "3NN00003"; // County Court case
    
    /** The ch case. */
    private String chCase = "3NN00011"; // Chancery case (has judgment)
    
    /** The qb case. */
    private String qbCase = "3NN00021"; // Queens Bench case
    
    /** The insolv case. */
    private String insolvCase = "A15NN001"; // Insolvency case

    /**
     * Constructor.
     */
    public RFS4813_3_Test ()
    {
        super (RFS4813_3_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Checks new case event 430 can be created ok.
     */
    public void testCaseEvent430Creation ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent ("430");
            testEvent.setProduceOutputFlag (false);
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("MA003", myUC002CaseEventUtils.getEventBMSTask ());

            // Try and error off the event, unerror the event and then exit screen
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks new case event 430 validation.
     */
    public void testCaseEvent430Validation ()
    {
        try
        {
            // Get to Case Events screen and load County Court Case
            mLoginAndLoadCase (ccCase);

            // Check event cannot be created on non-Family Enforcement cases
            myUC002CaseEventUtils.openAddEventPopup ("430");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_NOT_FAMILY_CASE);

            // Load Chancery Case and check event cannot be created
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.setCaseNumber (chCase);
            myUC002CaseEventUtils.openAddEventPopup ("430");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_NOT_FAMILY_CASE);

            // Load Queen's Bench Case and check event cannot be created
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.setCaseNumber (qbCase);
            myUC002CaseEventUtils.openAddEventPopup ("430");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_NOT_FAMILY_CASE);

            // Load Insolvency Case and check event cannot be created
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.setCaseNumber (insolvCase);
            myUC002CaseEventUtils.openAddEventPopup ("430");
            myUC002CaseEventUtils.clickAddEventSaveButton ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_NOT_FAMILY_CASE);

            // Check Family Enforcement case can create event
            myUC002CaseEventUtils.clearScreen ();
            myUC002CaseEventUtils.setCaseNumber (famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent ("430");
            testEvent.setProduceOutputFlag (false);
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            // Add the event and exit screen
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            myUC002CaseEventUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     *
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndLoadCase (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber (pCaseNumber);
    }

}