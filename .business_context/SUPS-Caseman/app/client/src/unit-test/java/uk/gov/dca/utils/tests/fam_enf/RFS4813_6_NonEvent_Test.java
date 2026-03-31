/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11768 $
 * $Author: vincentcp $
 * $Date: 2015-03-12 09:21:53 +0000 (Thu, 12 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.fam_enf;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests the BMS Changes in the Family Enforcement Changes.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_NonEvent_Test extends AbstractCmTestBase
{
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // FAMILY ENF - FAMILY COURT case with AE and Home Warrant
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // FAMILY ENF - REMO case with judgment, AE, Home and Foreign Warrant
    
    /** The cc case wnt 1. */
    private String ccCaseWnt1 = "3NN00031"; // County Court case with Home Warrant
    
    /** The cc case wnt 2. */
    private String ccCaseWnt2 = "3NN00032"; // County Court case with Home and Foreign Warrant
    

    /**
     * Constructor.
     */
    public RFS4813_6_NonEvent_Test ()
    {
        super (RFS4813_6_NonEvent_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Checks BMS allocated to Warrant Return AE on a Family Enforcement Case
     * and a County Court Case.
     */
    public void testWarrantReturnAE ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Check Task Counts table. Both family and civil task counts should be 0
            assertEquals (0, DBUtil.getBMSTaskCount ("EN50", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("MA030", "282"));

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber (famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AE");

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Family task should go up, civil task should not change
            assertEquals (0, DBUtil.getBMSTaskCount ("EN50", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA030", "282"));

            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen ();
            myUC045WarrantReturnsUtils.setCaseNumber (ccCaseWnt1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals (1, DBUtil.getBMSTaskCount ("EN50", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA030", "282"));

            myUC045WarrantReturnsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }
    
    /**
     * Checks BMS allocated to Warrant Return AJ on a Family Enforcement Case
     * and a County Court Case
     */
    public void testWarrantReturnAJ()
    {
        try
        {
        	// Get to the Warrant Returns screen
            mLoginAndNavigateToScreen();
            
            // Check Task Counts table.  Both family and civil task counts should be 0
            assertEquals(0, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(0, DBUtil.getBMSTaskCount("MA030","282"));

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber(famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent("WarrantReturn-AJ");

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent(testEvent, null);

            // Check Task Counts table.  Family task should go up, civil task should not change
            assertEquals(0, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(1, DBUtil.getBMSTaskCount("MA030","282"));
            
            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen();
            myUC045WarrantReturnsUtils.setCaseNumber(ccCaseWnt1);
            myUC045WarrantReturnsUtils.clickSearchButton();
            
            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent(testEvent, null);
            
            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals(1, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(1, DBUtil.getBMSTaskCount("MA030","282"));
            
            myUC045WarrantReturnsUtils.closeScreen();
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Warrant Return AK on a Family Enforcement Case
     * and a County Court Case
     */
    public void testWarrantReturnAK()
    {
        try
        {
        	// Get to the Warrant Returns screen
            mLoginAndNavigateToScreen();
            
            // Check Task Counts table.  Both family and civil task counts should be 0
            assertEquals(0, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(0, DBUtil.getBMSTaskCount("MA030","282"));

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber(famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent("WarrantReturn-AK");

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent(testEvent, null);

            // Check Task Counts table.  Family task should go up, civil task should not change
            assertEquals(0, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(1, DBUtil.getBMSTaskCount("MA030","282"));
            
            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen();
            myUC045WarrantReturnsUtils.setCaseNumber(ccCaseWnt1);
            myUC045WarrantReturnsUtils.clickSearchButton();
            
            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent(testEvent, null);
            
            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals(1, DBUtil.getBMSTaskCount("EN50","282"));
            assertEquals(1, DBUtil.getBMSTaskCount("MA030","282"));
            
            myUC045WarrantReturnsUtils.closeScreen();
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Author: BP 13/12/2016
     * Checks BMS allocated to Warrant Final Return 141 on a Family Enforcement Case
     * and a County Court Case.
     */
    public void testWarrantFinalReturn141 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Check Task Counts table. Both family and civil task counts should be 0
            assertEquals (0, DBUtil.getBMSTaskCount ("EN51", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("MA033", "282"));

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber (famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-141");
            // testEvent.setSubjectParty("DEFENDANT NAME");
            // testEvent.setCheckNotice(true);

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Family task should go up, civil task should not change
            assertEquals (0, DBUtil.getBMSTaskCount ("EN51", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA033", "282"));

            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen ();
            myUC045WarrantReturnsUtils.setCaseNumber (ccCaseWnt1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant final return 141
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals (1, DBUtil.getBMSTaskCount ("EN51", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA033", "282"));

            myUC045WarrantReturnsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Author: BP 13/10/2016
     * Checks BMS allocated to Warrant Final Return 140 on a Family Enforcement Case
     * and a County Court Case.
     */
    public void testWarrantFinalReturn140 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Check Task Counts table. Both family and civil task counts should be 0
            assertEquals (0, DBUtil.getBMSTaskCount ("EN52", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("MA034", "282"));

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber (famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-140");
            // testEvent.setSubjectParty("DEFENDANT NAME");
            // testEvent.setCheckNotice(true);

            // Add the warrant return AE
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Family task should go up, civil task should not change
            assertEquals (0, DBUtil.getBMSTaskCount ("EN52", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA034", "282"));

            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen ();
            myUC045WarrantReturnsUtils.setCaseNumber (ccCaseWnt1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant final return 140
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals (1, DBUtil.getBMSTaskCount ("EN52", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA034", "282"));

            myUC045WarrantReturnsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Author: BP 13/10/2016
     * Checks BMS allocated to Foreign Warrant Interim Return AB on a Family Enforcement Case
     * and a County Court Case.
     */
    public void testForeignWarrantReturn ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Check Task Counts table. Both family and civil task counts should be 0
            assertEquals (0, DBUtil.getBMSTaskCount ("EN53", "282"));
            assertEquals (0, DBUtil.getBMSTaskCount ("MA032", "282"));

            // Load a Foreign Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber (famEnfCase2);
            myUC045WarrantReturnsUtils.setExecutingCourtCode ("180");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000024");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("WarrantReturn-AB");

            // Add the warrant return AB
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Family task should go up, civil task should not change
            assertEquals (0, DBUtil.getBMSTaskCount ("EN53", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA032", "282"));

            // Clear screen and load a Foreign Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen ();
            myUC045WarrantReturnsUtils.setCaseNumber (ccCaseWnt2);
            myUC045WarrantReturnsUtils.setExecutingCourtCode("180");
            myUC045WarrantReturnsUtils.setLocalNumber("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant return AB
            myUC045WarrantReturnsUtils.addNewEvent (testEvent, null);

            // Check Task Counts table. Civil task should now go up, and family task should not change
            assertEquals (1, DBUtil.getBMSTaskCount ("EN53", "282"));
            assertEquals (1, DBUtil.getBMSTaskCount ("MA032", "282"));

            myUC045WarrantReturnsUtils.closeScreen ();
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

}