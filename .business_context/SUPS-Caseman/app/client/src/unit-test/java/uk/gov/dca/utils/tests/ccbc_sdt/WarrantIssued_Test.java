/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11082 $
 * $Author: vincentcp $
 * $Date: 2014-05-01 14:04:55 +0100 (Thu, 01 May 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Warrant Issued functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class WarrantIssued_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 029 create home warrant utils. */
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00011"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00012"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00013"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00014"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00015"; // CCBC owned CCBC case
    
    /** The event 380. */
    private String EVENT_380 = "380";
    
    /** The mcol code1. */
    private String MCOL_CODE1 = "WI";

    /**
     * Constructor.
     */
    public WarrantIssued_Test ()
    {
        super (WarrantIssued_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Tests that when Case Event 380 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent38_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to Create Home Warrants screen
            loginAndLoadHomeWarrants ();

            // Create Warrant
            createWarrant (caseNumber1);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Exit Home Warrants and navigate to Case Events screen
            exitWarrantsNavigateToCaseEvents (caseNumber1);

            // Select the case event 380 created automatically
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_380);

            // Check that the event subject has not been populated
            assertEquals ("", myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("", myUC002CaseEventUtils.getSubjectType ());

            // Error off the event
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 380 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent38_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to Create Home Warrants screen
            loginAndLoadHomeWarrants ();

            // Create Warrant
            createWarrant (caseNumber2);

            // Check that the MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Exit Home Warrants and navigate to Case Events screen
            exitWarrantsNavigateToCaseEvents (caseNumber2);

            // Select the case event 380 created automatically
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_380);

            // Check that the event subject has been populated
            assertEquals ("1", myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Defendant", myUC002CaseEventUtils.getSubjectType ());

            // Error off the event
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 380 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent38_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to Create Home Warrants screen
            loginAndLoadHomeWarrants ();

            // Create Warrant
            createWarrant (caseNumber3);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Exit Home Warrants and navigate to Case Events screen
            exitWarrantsNavigateToCaseEvents (caseNumber3);

            // Select the case event 380 created automatically
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_380);

            // Check that the event subject has not been populated
            assertEquals ("", myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("", myUC002CaseEventUtils.getSubjectType ());

            // Error off the event
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 380 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent38_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to Create Home Warrants screen
            loginAndLoadHomeWarrants ();

            // Create Warrant
            createWarrant (caseNumber4);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Exit Home Warrants and navigate to Case Events screen
            exitWarrantsNavigateToCaseEvents (caseNumber4);

            // Select the case event 380 created automatically
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_380);

            // Check that the event subject has not been populated
            assertEquals ("", myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("", myUC002CaseEventUtils.getSubjectType ());

            // Error off the event
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 380 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testCaseEvent38_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to Create Home Warrants screen
            loginAndLoadHomeWarrants ();

            // Create Warrant
            createWarrant (caseNumber5);

            // Check that the MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Exit Home Warrants and navigate to Case Events screen
            exitWarrantsNavigateToCaseEvents (caseNumber5);

            // Select the case event 380 created automatically
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_380);

            // Check that the event subject has been populated
            assertEquals ("1", myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Defendant", myUC002CaseEventUtils.getSubjectType ());

            // Error off the event
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Unerror and error again to check the event errored MCOL_DATA notification
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
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
     */
    private void loginAndLoadHomeWarrants ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create Home Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());
    }

    /**
     * Creates a warrant record on the Create Home Warrants screen.
     *
     * @param caseNumber Case Number to create Warrant against
     */
    private void createWarrant (final String caseNumber)
    {
        // Enter a Case
        myUC029CreateHomeWarrantUtils.setCaseNumber (caseNumber);

        // Set Warrant details
        myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEFENDANT ONE NAME");
        myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("282");
        myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton ();
        myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
        myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
        myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk ();

        // Click Save
        myUC029CreateHomeWarrantUtils.clickSaveButton ();
    }

    /**
     * Function exits from the Create Home Warrants screen and navigates to the
     * Case Events screen then loads a case.
     *
     * @param caseNumber Case Number to load
     */
    private void exitWarrantsNavigateToCaseEvents (final String caseNumber)
    {
        // Exit the Create Home Warrants screen and navigate to the Case Events screen
        myUC029CreateHomeWarrantUtils.closeScreen ();
        this.nav.navigateFromMainMenu (MAINMENU_RESET);
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