/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 11604 $
 * $Author: vincentcp $
 * $Date: 2015-02-11 15:22:12 +0000 (Wed, 11 Feb 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm16_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC022DMSReportUtils;
import uk.gov.dca.utils.screens.UC023DiaryMonitoringReportsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the RFS 3719 changes to the DMS Report screen covered by Trac 4767.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4767_Test extends AbstractCmTestBase
{

    /** The my UC 022 DMS report utils. */
    // Private member variables for the screen utils
    private UC022DMSReportUtils myUC022DMSReportUtils;

    /** The my UC 023 diary monitoring reports utils. */
    private UC023DiaryMonitoringReportsUtils myUC023DiaryMonitoringReportsUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4767_Test ()
    {
        super (CaseManTrac4767_Test.class.getName ());
        this.nav = new Navigator (this);
        this.myUC022DMSReportUtils = new UC022DMSReportUtils (this);
        this.myUC023DiaryMonitoringReportsUtils = new UC023DiaryMonitoringReportsUtils (this);
    }

    /**
     * Tests the validation, enablement, mandatory and read only rules for the new DMS Report
     * parameters. Viewing the obligations and Deleting Obligations is also tested.
     */
    public void testDMSReportParameters ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the DMS Report screen
            this.nav.navigateFromMainMenu (MAINMENU_DMS_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC022DMSReportUtils.getScreenTitle ());

            // Check all parameters initially blank
            assertEquals ("", myUC022DMSReportUtils.getStartDate ());
            assertEquals ("", myUC022DMSReportUtils.getEndDate ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeCode ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeName ());

            // Check fields are all optional and editable initially
            assertFalse ("Start Date Read Only when should be editable", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertFalse ("End Date Read Only when should be editable", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertFalse ("Obligation Type Code Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertFalse ("Obligation Type Name Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertTrue ("Obligation Type LOV Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Start Date mandatory when should be optional", myUC022DMSReportUtils.isStartDateMandatory ());
            assertFalse ("End Date mandatory when should be optional", myUC022DMSReportUtils.isEndDateMandatory ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertFalse ("Delete Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Test the Start and End Date parameter validation
            myUC022DMSReportUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertTrue ("End Date optional when should be mandatory", myUC022DMSReportUtils.isEndDateMandatory ());
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.runDMSReport (false);
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_PRINT_INVALID_DATES);

            myUC022DMSReportUtils.setStartDate ("");
            myUC022DMSReportUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertTrue ("Start Date optional when should be mandatory", myUC022DMSReportUtils.isStartDateMandatory ());
            myUC022DMSReportUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils.setStartDate ("");
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.runDMSReport (false);
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_PRINT_INVALID_DATES);
            myUC022DMSReportUtils.setEndDate ("");
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils.setStartDate (AbstractBaseUtils.now ());
            myUC022DMSReportUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertFalse ("Start Date valid when should be invalid", myUC022DMSReportUtils.isStartDateValid ());
            myUC022DMSReportUtils.setStartDateFocus ();
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_DATE_NOT_IN_PAST);
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils
                    .setStartDate (AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.setEndDate (AbstractBaseUtils.now ());
            assertFalse ("End Date valid when should be invalid", myUC022DMSReportUtils.isEndDateValid ());
            myUC022DMSReportUtils.setEndDateFocus ();
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_DATE_NOT_IN_PAST);
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils
                    .setEndDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            assertTrue ("End Date invalid when should be valid", myUC022DMSReportUtils.isEndDateValid ());
            assertFalse ("Start Date valid when should be invalid", myUC022DMSReportUtils.isStartDateValid ());
            myUC022DMSReportUtils.setStartDateFocus ();
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_END_BEFORE_START);
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.runDMSReport (false);
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_INVALID_DATES);

            myUC022DMSReportUtils.setStartDate ("");
            myUC022DMSReportUtils.setEndDate ("");
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            // Test Obligation Type parameter fields
            myUC022DMSReportUtils.selectObligationTypeFromLOV ("32");
            assertEquals ("32", myUC022DMSReportUtils.getObligationTypeCode ());
            assertEquals ("DQ DUE - SCT", myUC022DMSReportUtils.getObligationTypeName ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils.setObligationTypeCode ("33");
            assertEquals ("DQ DUE - FT/MT", myUC022DMSReportUtils.getObligationTypeName ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils.setObligationTypeName ("TIME EXPIRED FOR PAYMENT OF LQ FEES");
            assertEquals ("21", myUC022DMSReportUtils.getObligationTypeCode ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());

            myUC022DMSReportUtils.setObligationTypeCode ("AA");
            assertFalse ("Obligation Type Code valid when should be invalid",
                    myUC022DMSReportUtils.isObligationTypeCodeValid ());
            myUC022DMSReportUtils.setObligationTypeCodeFocus ();
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_INVALID_OBLIGATION);
            assertFalse ("Display Obligations Button Enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.runDMSReport (false);
            mCheckStatusBarText (UC022DMSReportUtils.ERR_MSG_INVALID_OBLIGATION);

            // Load overdue obligations
            myUC022DMSReportUtils.setObligationTypeCode ("");
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            myUC022DMSReportUtils.displayOverdueObligations ();

            // Check parameter fields are read only after a search
            assertTrue ("Start Date editable when should be read only", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertTrue ("End Date editable when should be read only", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertTrue ("Obligation Type Code editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertTrue ("Obligation Type Name editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertFalse ("Obligation Type LOV Button enabled when should be disabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Display Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertTrue ("Delete Obligations Button disabled when should be enabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Click Next Button (test paging)
            myUC022DMSReportUtils.clickNextButton ();

            assertTrue ("Start Date editable when should be read only", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertTrue ("End Date editable when should be read only", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertTrue ("Obligation Type Code editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertTrue ("Obligation Type Name editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertFalse ("Obligation Type LOV Button enabled when should be disabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Display Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertTrue ("Delete Obligations Button disabled when should be enabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Click Previous Button (test paging)
            myUC022DMSReportUtils.clickPreviousButton ();

            assertTrue ("Start Date editable when should be read only", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertTrue ("End Date editable when should be read only", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertTrue ("Obligation Type Code editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertTrue ("Obligation Type Name editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertFalse ("Obligation Type LOV Button enabled when should be disabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Display Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertTrue ("Delete Obligations Button disabled when should be enabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Run the report
            myUC022DMSReportUtils.runDMSReport (true);

            // Clear
            myUC022DMSReportUtils.clickClearButton ();

            assertEquals ("", myUC022DMSReportUtils.getStartDate ());
            assertEquals ("", myUC022DMSReportUtils.getEndDate ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeCode ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeName ());

            // Check fields are all optional and editable initially
            assertFalse ("Start Date Read Only when should be editable", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertFalse ("End Date Read Only when should be editable", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertFalse ("Obligation Type Code Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertFalse ("Obligation Type Name Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertTrue ("Obligation Type LOV Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Start Date mandatory when should be optional", myUC022DMSReportUtils.isStartDateMandatory ());
            assertFalse ("End Date mandatory when should be optional", myUC022DMSReportUtils.isEndDateMandatory ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertFalse ("Delete Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Display again and check counts are as expected
            myUC022DMSReportUtils.setObligationTypeCode ("2");
            myUC022DMSReportUtils.displayOverdueObligations ();
            assertEquals (2, DBUtil.getNumberActiveObligations ("2"));
            assertEquals (52, DBUtil.getNumberActiveObligations ("%"));

            // Run the report with parameters
            myUC022DMSReportUtils.runDMSReport (true);

            // Delete (No)
            myUC022DMSReportUtils.deleteObligations (false);

            assertTrue ("Start Date editable when should be read only", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertTrue ("End Date editable when should be read only", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertTrue ("Obligation Type Code editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertTrue ("Obligation Type Name editable when should be read only",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertFalse ("Obligation Type LOV Button enabled when should be disabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Display Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertTrue ("Delete Obligations Button disabled when should be enabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Delete (Yes)
            myUC022DMSReportUtils.deleteObligations (true);

            assertEquals ("", myUC022DMSReportUtils.getStartDate ());
            assertEquals ("", myUC022DMSReportUtils.getEndDate ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeCode ());
            assertEquals ("", myUC022DMSReportUtils.getObligationTypeName ());

            // Check fields are all optional and editable initially
            assertFalse ("Start Date Read Only when should be editable", myUC022DMSReportUtils.isStartDateReadOnly ());
            assertFalse ("End Date Read Only when should be editable", myUC022DMSReportUtils.isEndDateReadOnly ());
            assertFalse ("Obligation Type Code Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeCodeReadOnly ());
            assertFalse ("Obligation Type Name Read Only when should be editable",
                    myUC022DMSReportUtils.isObligationTypeNameReadOnly ());
            assertTrue ("Obligation Type LOV Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isObligationTypeLOVEnabled ());
            assertFalse ("Start Date mandatory when should be optional", myUC022DMSReportUtils.isStartDateMandatory ());
            assertFalse ("End Date mandatory when should be optional", myUC022DMSReportUtils.isEndDateMandatory ());
            assertTrue ("Display Obligations Button Disabled when should be enabled",
                    myUC022DMSReportUtils.isDisplayObligationsButtonEnabled ());
            assertFalse ("Delete Obligations Button enabled when should be disabled",
                    myUC022DMSReportUtils.isDeleteObligationsButtonEnabled ());

            // Check the correct number of records have been logically deleted
            assertEquals (0, DBUtil.getNumberActiveObligations ("2"));
            assertEquals (50, DBUtil.getNumberActiveObligations ("%"));

            // Exit screen
            myUC022DMSReportUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the report can be run with no parameters from the Diary Monitoring Reports screen.
     */
    public void testDiaryMonitoringReport ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Diary Monitoring Report screen
            this.nav.navigateFromMainMenu (MAINMENU_DAILY_MONITORING_REPORT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC023DiaryMonitoringReportsUtils.getScreenTitle ());

            // Run the report
            myUC023DiaryMonitoringReportsUtils.printOverdueObligations ();

            // Exit the screen
            myUC023DiaryMonitoringReportsUtils.closeScreen ();
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

}