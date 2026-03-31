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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.common.ITestProperties;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC016ViewCourtDataUtils;
import uk.gov.dca.utils.screens.UC120MaintainCourtDataUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 2629. This covers a change to include the Welsh
 * Court Name on the letter outputs with Welsh bilingual header. New fields have been added
 * to the Maintain Court screen and View Court Data screen
 *
 * @author Chris Vincent
 */
public class CaseManTrac2629_Test extends AbstractCmTestBase
{
    
    /** The my UC 120 maintain court data utils. */
    // Private member variables for the screen utils
    private UC120MaintainCourtDataUtils myUC120MaintainCourtDataUtils;
    
    /** The my UC 016 view court data utils. */
    private UC016ViewCourtDataUtils myUC016ViewCourtDataUtils;

    /**
     * Constructor.
     */
    public CaseManTrac2629_Test ()
    {
        super (CaseManTrac2629_Test.class.getName ());
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
            assertFalse ("Welsh High Court Name is enabled when should be disabled",
                    myUC016ViewCourtDataUtils.checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Welsh County Court Name is enabled when should be disabled",
                    myUC016ViewCourtDataUtils.checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Load a Court
            myUC016ViewCourtDataUtils.setCourtCode ("101");
            myUC016ViewCourtDataUtils.clickSearchButton ();

            // Check fields are enabled now court is loaded
            assertTrue ("Welsh High Court Name is disabled when should be enabled",
                    myUC016ViewCourtDataUtils.checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertTrue ("Welsh County Court Name is disabled when should be enabled",
                    myUC016ViewCourtDataUtils.checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Check fields are read only when court is loaded
            assertTrue ("Welsh High Court Name is editable when should be read only",
                    myUC016ViewCourtDataUtils.checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertTrue ("Welsh County Court Name is editable when should be read only",
                    myUC016ViewCourtDataUtils.checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));

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
    public void testMaintainCourtData1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Delete Court 888 just in case
            DBUtil.deleteCourtData ("888");

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check fields are disabled
            assertFalse ("Welsh High Court Name is enabled when should be disabled",
                    myUC120MaintainCourtDataUtils.checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Welsh County Court Name is enabled when should be disabled", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();

            // Check status and tab order of fields on New Court Subform
            // Fields should be initially disabled
            assertFalse ("Welsh High Court Name is enabled when should be disabled", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Welsh County Court Name is enabled when should be disabled", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));

            // Set the Code field to enable the other fields
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");

            // Check enablement, mandatory and read only rules
            assertTrue ("Welsh High Court Name is disabled when should be enabled", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertTrue ("Welsh County Court Name is disabled when should be enabled", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Welsh High Court Name is read only when should be editable", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Welsh County Court Name is read only when should be editable", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Welsh High Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Welsh County Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            // Set focus on the New Court Name field prior to testing tab order
            /**
             * TABBING TEST COMMENTED OUT AS PROBLEM WITH SESSION METHOD
             * myUC120MaintainCourtDataUtils.setFocusOnNewCourtName();
             * session.tabKey();
             * assertTrue( "Current field in focus is not Welsh High Court Name",
             * myUC120MaintainCourtDataUtils.getNewWelshHighCourtNameId().equalsIgnoreCase(session.getCurrentFocusId())
             * );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Welsh County Court Name",
             * myUC120MaintainCourtDataUtils.getNewWelshCountyCourtNameId().equalsIgnoreCase(session.getCurrentFocusId())
             * );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Court Id",
             * myUC120MaintainCourtDataUtils.getNewCourtIdId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not District Registry",
             * myUC120MaintainCourtDataUtils.getNewDistrictRegistryId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not In Service",
             * myUC120MaintainCourtDataUtils.getNewInServiceId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court Code",
             * myUC120MaintainCourtDataUtils.getNewGroupingCourtCodeId().equalsIgnoreCase(session.getCurrentFocusId())
             * );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court Name",
             * myUC120MaintainCourtDataUtils.getNewGroupingCourtNameId().equalsIgnoreCase(session.getCurrentFocusId())
             * );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court LOV Button",
             * myUC120MaintainCourtDataUtils.getNewGroupingCourtLOVId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Diary Managers Email",
             * myUC120MaintainCourtDataUtils.getNewDMEmailAddressId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not DX Number",
             * myUC120MaintainCourtDataUtils.getNewCourtDXId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Telephone Number",
             * myUC120MaintainCourtDataUtils.getNewCourtTelephoneId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Fax Number",
             * myUC120MaintainCourtDataUtils.getNewCourtFaxId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Open From",
             * myUC120MaintainCourtDataUtils.getNewOpenFromId().equalsIgnoreCase(session.getCurrentFocusId()) );
             */

            // Test mandatory rules of fields
            myUC120MaintainCourtDataUtils.setNewWelshHighCourtName ("Test");
            assertTrue ("Welsh County Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            myUC120MaintainCourtDataUtils.setNewWelshHighCourtName ("");
            myUC120MaintainCourtDataUtils.setNewWelshCountyCourtName ("Test");
            assertTrue ("Welsh High Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            myUC120MaintainCourtDataUtils.setNewWelshCountyCourtName ("");
            assertFalse ("Welsh High Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkNewWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Welsh County Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkNewWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            // Populate the mandatory details of the new court and submit the details to add the Court
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");
            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Check status and tab order of fields on Main Screen
            assertTrue ("Welsh High Court Name is disabled when should be enabled",
                    myUC120MaintainCourtDataUtils.checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertTrue ("Welsh County Court Name is disabled when should be enabled", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_ENABLED));
            assertFalse ("Welsh High Court Name is read only when should be editable", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Welsh County Court Name is read only when should be editable", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_READONLY));
            assertFalse ("Welsh High Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Welsh County Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            // Set focus on the New Court Name field prior to testing tab order
            /**
             * TABBING TEST COMMENTED OUT AS PROBLEM WITH SESSION METHOD
             * myUC120MaintainCourtDataUtils.setFocusOnNewCourtName();
             * session.tabKey();
             * assertTrue( "Current field in focus is not Welsh High Court Name",
             * myUC120MaintainCourtDataUtils.getWelshHighCourtNameId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Welsh County Court Name",
             * myUC120MaintainCourtDataUtils.getWelshCountyCourtNameId().equalsIgnoreCase(session.getCurrentFocusId())
             * );
             * session.tabKey();
             * assertTrue( "Current field in focus is not In Service",
             * myUC120MaintainCourtDataUtils.getInServiceId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court Code",
             * myUC120MaintainCourtDataUtils.getGroupingCourtCodeId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court Name",
             * myUC120MaintainCourtDataUtils.getGroupingCourtNameId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Grouping Court LOV Button",
             * myUC120MaintainCourtDataUtils.getGroupingCourtLOVId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Diary Managers Email",
             * myUC120MaintainCourtDataUtils.getDMEmailAddressId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not DX Number",
             * myUC120MaintainCourtDataUtils.getDXNumberId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Telephone Number",
             * myUC120MaintainCourtDataUtils.getTelephoneNumberId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Fax Number",
             * myUC120MaintainCourtDataUtils.getFaxNumberId().equalsIgnoreCase(session.getCurrentFocusId()) );
             * session.tabKey();
             * assertTrue( "Current field in focus is not Open From",
             * myUC120MaintainCourtDataUtils.getOpenFromId().equalsIgnoreCase(session.getCurrentFocusId()) );
             **/

            // Test mandatory rules of fields
            myUC120MaintainCourtDataUtils.setWelshHighCourtName ("Test");
            assertTrue ("Welsh County Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            myUC120MaintainCourtDataUtils.setWelshHighCourtName ("");
            myUC120MaintainCourtDataUtils.setWelshCountyCourtName ("Test");
            assertTrue ("Welsh High Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            myUC120MaintainCourtDataUtils.setWelshCountyCourtName ("");
            assertFalse ("Welsh High Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Welsh County Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            // Check adding Welsh Office address and Welsh name field's mandatory status
            myUC120MaintainCourtDataUtils.addCourtAddress (UC120MaintainCourtDataUtils.ADDR_TYPE_WELSH_OFFICE,
                    "Adline1", "Adline2", "Adline3", "Adline4", "Adline5", "TF3 4NT");
            assertTrue ("Welsh High Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertTrue ("Welsh County Court Name is optional when should be mandatory", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

            myUC120MaintainCourtDataUtils
                    .selectAddressByAddressType (UC120MaintainCourtDataUtils.ADDR_TYPE_WELSH_OFFICE);
            myUC120MaintainCourtDataUtils.clickRemoveAddressButton ();
            assertFalse ("Welsh High Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshHighCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));
            assertFalse ("Welsh County Court Name is mandatory when should be optional", myUC120MaintainCourtDataUtils
                    .checkWelshCountyCourtNameStatus (ITestProperties.FIELD_STATUS_MANDATORY));

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
     * Tests the changes to the Maintain Court Data screen. Specifically, this
     * tests the services and the add/update/retrieval methods
     */
    public void testMaintainCourtData2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Delete Court 888 just in case
            DBUtil.deleteCourtData ("888");

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();

            // Submit subform with Welsh Names populated
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewWelshCountyCourtName ("WELSH COUNTY COURT NAME");
            myUC120MaintainCourtDataUtils.setNewWelshHighCourtName ("WELSH HIGH COURT NAME");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");
            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Check Welsh Names are still populated when submitted
            assertTrue ("Welsh County Court Name is not the expected value",
                    myUC120MaintainCourtDataUtils.getWelshCountyCourtName ().equals ("WELSH COUNTY COURT NAME"));
            assertTrue ("Welsh High Court Name is not the expected value",
                    myUC120MaintainCourtDataUtils.getWelshHighCourtName ().equals ("WELSH HIGH COURT NAME"));

            // Update Welsh Names and Save
            myUC120MaintainCourtDataUtils.setWelshHighCourtName ("NEW HIGH COURT NAME");
            myUC120MaintainCourtDataUtils.setWelshCountyCourtName ("NEW COUNTY COURT NAME");
            myUC120MaintainCourtDataUtils.clickSaveButton ();

            // Clear the details, load the Court again and check the updated values
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("888");
            myUC120MaintainCourtDataUtils.clickSearchButton ();
            assertTrue ("Welsh County Court Name is not the expected value",
                    myUC120MaintainCourtDataUtils.getWelshCountyCourtName ().equals ("NEW COUNTY COURT NAME"));
            assertTrue ("Welsh High Court Name is not the expected value",
                    myUC120MaintainCourtDataUtils.getWelshHighCourtName ().equals ("NEW HIGH COURT NAME"));

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