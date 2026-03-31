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

package uk.gov.dca.utils.tests.releases.cm25_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.common.ITestProperties;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC016ViewCourtDataUtils;
import uk.gov.dca.utils.screens.UC120MaintainCourtDataUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the changes to the Viwe Court Data and Maintain Court
 * Data screens as part of the WIndow for Trial PolarLake replacement.
 *
 * @author Chris Vincent
 */
public class CaseManTrac5887_Test extends AbstractCmTestBase
{
    
    /** The my UC 120 maintain court data utils. */
    // Private member variables for the screen utils
    private UC120MaintainCourtDataUtils myUC120MaintainCourtDataUtils;
    
    /** The my UC 016 view court data utils. */
    private UC016ViewCourtDataUtils myUC016ViewCourtDataUtils;

    /**
     * Constructor.
     */
    public CaseManTrac5887_Test ()
    {
        super (CaseManTrac5887_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC120MaintainCourtDataUtils = new UC120MaintainCourtDataUtils (this);
        myUC016ViewCourtDataUtils = new UC016ViewCourtDataUtils (this);
    }

    /**
     * Tests the changes to the View Court Data screen. Because the fields
     * on the screen are read only, can only really check the enablement and
     * read only rules.
     */
    public void testViewCourtData ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_VIEW_COURT_DATA_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC016ViewCourtDataUtils.getScreenTitle ());

            // Check fields are disabled when enter the screen
            assertFalse ("Diary Manager Court is enabled when should be disabled",
                    myUC016ViewCourtDataUtils.checkDMCourtStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Load a Court
            myUC016ViewCourtDataUtils.setCourtCode ("244");
            myUC016ViewCourtDataUtils.clickSearchButton ();

            // Check fields are enabled now court is loaded
            assertTrue ("Diary Manager Court is disabled when should be enabled",
                    myUC016ViewCourtDataUtils.checkDMCourtStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Check fields are read only when court is loaded
            assertTrue ("Diary Manager Court is editable when should be read only",
                    myUC016ViewCourtDataUtils.checkDMCourtStatus (ITestProperties.FIELD_STATUS_READONLY));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the changes to the Maintain Court Data screen. Specifically, this
     * tests the mandatory, enablement and read only rules of the new fields
     * as well as the tab order.
     */
    public void testMaintainCourtData ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Delete Court 888 just in case
            DBUtil.deleteCourtData ("888");

            // Navigate to the Maintain Court Data screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check fields are disabled
            assertFalse ("Diary Manager Court Code is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Diary Manager Court Name is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();

            // Populate the mandatory details of the new court and submit the details to add the Court
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");
            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Check fields are disabled as no grouping court set
            assertFalse ("Diary Manager Court Code is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Diary Manager Court Name is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Set the Grouping Court Code
            myUC120MaintainCourtDataUtils.setGroupingCourtCode ("888");

            // Check status and tab order of fields on Main Screen
            assertTrue ("Diary Manager Court Code is disabled when should be enabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertTrue ("Diary Manager Court Name is disabled when should be enabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Diary Manager Court Code is read only when should be editable",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Diary Manager Court Name is read only when should be editable",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Diary Manager Court Code is mandatory when should be optional",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Diary Manager Court Name is mandatory when should be optional",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            // Set the Diary Manager Court Code to an invalid value
            myUC120MaintainCourtDataUtils.setDMCourtCode ("a");
            assertFalse ("Diary Manager Court Code is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_VALID));

            // Set the Diary Manager Court Code to a valid value
            myUC120MaintainCourtDataUtils.setDMCourtCode ("282");
            assertTrue ("Diary Manager Court Code is invalid when should be valid",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_VALID));

            // Save, clear screen and load court again
            myUC120MaintainCourtDataUtils.clickSaveButton ();
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("888");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Check Diary Manager Court Code has expected value
            assertEquals ("282", myUC120MaintainCourtDataUtils.getDMCourtCode ());

            // Blank the Grouping Court Code
            myUC120MaintainCourtDataUtils.setGroupingCourtCode ("");

            // Check fields are disabled as no grouping court set
            assertFalse ("Diary Manager Court Code is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtCodeStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Diary Manager Court Name is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkDMCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Check DM Court Code is blank
            assertEquals ("", myUC120MaintainCourtDataUtils.getDMCourtCode ());

            // Physically delete the newly added court
            DBUtil.deleteCourtData ("888");
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

}