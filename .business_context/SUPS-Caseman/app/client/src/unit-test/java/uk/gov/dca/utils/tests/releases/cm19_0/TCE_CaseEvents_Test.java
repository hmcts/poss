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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the TCE to Manage Case Events screen.
 *
 * @author Chris Vincent
 */
public class TCE_CaseEvents_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 029 create home warrant utils. */
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The case number no warrant. */
    private String caseNumberNoWarrant = "A04NN009";
    
    /** The case number warrant. */
    private String caseNumberWarrant = "A04NN001";

    /**
     * Constructor.
     */
    public TCE_CaseEvents_Test ()
    {
        super (TCE_CaseEvents_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Tests the creation of case event 380 (Via Warrant Creation) and that the correct event description is used.
     */
    public void testCaseEvent380 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Enter a case number with a case type that should default the warrant type to CONTROL
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseNumberNoWarrant);
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton ();
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk ();
            myUC029CreateHomeWarrantUtils.clickSaveButton ();
            myUC029CreateHomeWarrantUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberNoWarrant);

            // Check that the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId ("380");
            assertEquals ("WARRANT OF CONTROL ISSUED", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of case event 560 and that the correct event description is used.
     */
    public void testCaseEvent560 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumberNoWarrant);

            // Create Case Event 560
            final NewStandardEvent testEvent560 = new NewStandardEvent ("560");
            testEvent560.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent560, null);

            // Check that the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId ("560");
            assertEquals ("ISSUE WRIT OF CONTROL", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of case event 562 and that the correct event description is used.
     */
    public void testCaseEvent562 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumberNoWarrant);

            // Create Case Event 562
            final NewStandardEvent testEvent562 = new NewStandardEvent ("562");

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent562, null);

            // Check that the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId ("562");
            assertEquals ("WRIT OF CONTROL RENEWED", myUC002CaseEventUtils.getEventDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of case event 629 and that the correct event description is used.
     */
    public void testCaseEvent629 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (caseNumberWarrant);

            // Create Case Event 629
            final NewStandardEvent testEvent629 = new NewStandardEvent ("629");
            testEvent629.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent629, null);

            // Check that the event description is correct
            myUC002CaseEventUtils.selectCaseEventByEventId ("629");
            assertEquals ("EXTEND WARRANT OF CONTROL", myUC002CaseEventUtils.getEventDescription ());
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
     *
     * @param pCaseNumber Case number to load
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