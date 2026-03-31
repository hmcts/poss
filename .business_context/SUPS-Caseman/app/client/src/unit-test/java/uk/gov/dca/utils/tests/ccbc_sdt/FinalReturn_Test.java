/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11858 $
 * $Author: vincentcp $
 * $Date: 2015-04-16 11:19:54 +0100 (Thu, 16 Apr 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Acknowledgement of Service functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class FinalReturn_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "3NN00031"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00032"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00033"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00034"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00035"; // CCBC owned CCBC case
    
    /** The case number 6. */
    private String caseNumber6 = "3NN00036"; // CCBC owned CCBC case

    /** The warrant number 1. */
    private String warrantNumber1 = "1C000019"; // HW on case number 1
    
    /** The warrant number 2. */
    private String warrantNumber2 = "1C000020"; // FW on case number 2
    
    /** The warrant number 3. */
    private String warrantNumber3 = "1C000021"; // FW on case number 3
    
    /** The warrant number 4. */
    private String warrantNumber4 = "1C000022"; // FW on case number 4
    
    /** The warrant number 5. */
    private String warrantNumber5 = "1C000023"; // FW on case number 5
    
    /** The warrant number 6. */
    private String warrantNumber6 = "1C000024"; // FW on case number 6
    
    /** The warrant number 7. */
    private String warrantNumber7 = "00001/13"; // RW on case number 6

    /** The event 620. */
    private String EVENT_620 = "620";

    /** The mcol code1. */
    private String MCOL_CODE1 = "FR";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "F0";

    /**
     * Constructor.
     */
    public FinalReturn_Test ()
    {
        super (FinalReturn_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
    }

    /**
     * Tests that when Final Return 101 is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber1, warrantNumber1, false);

            // Create final return 101
            createFinalReturn101 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Error final return 101
            // myUC045WarrantReturnsUtils.selectGridRowByEventId(RETURN_101);
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check still no MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check still no MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Final Return 101 is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber2, warrantNumber2, true);

            // Create final return 101
            createFinalReturn101 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the second row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (2);

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Final Return 101 is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber3, warrantNumber3, true);

            // Create final return 101
            createFinalReturn101 ();

            // Check that an MCOL_DATA row has not been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the first row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (1);

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Final Return 101 is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber4, warrantNumber4, true);

            // Create final return 101
            createFinalReturn101 ();

            // Check that an MCOL_DATA row has not been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the first row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (1);

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Final Return 101 is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber5, warrantNumber5, true);

            // Create final return 101
            createFinalReturn101 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the first row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (1);

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
            assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an existing final return is errored on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testFinalReturn101_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5);

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

            // Unerror the case event 620
            myUC002CaseEventUtils.setEventErrorFlag (false);

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the first row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (1);

            String localNumber = myUC045WarrantReturnsUtils.getLocalNumber ();
            if (localNumber.equals (""))
            {
                // Home Warrant
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows written
                assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("147");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows NOT written
                assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("147");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);

                assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
            }
            else
            {
                // Foreign Warrant
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows written
                assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);

                assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
            }

            // Exit Warrant Returns screen and return to Case Events screen
            myUC045WarrantReturnsUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Navigate to the Warrant Returns screen again, this time for the foreign warrant
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the foreign warrant which should be the second row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (2);

            localNumber = myUC045WarrantReturnsUtils.getLocalNumber ();
            if (localNumber.equals (""))
            {
                // Home Warrant
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows written
                assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("147");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows NOT written
                assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("147");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);

                assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
            }
            else
            {
                // Foreign Warrant
                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (true);

                // Check that MCOL_DATA rows written
                assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));

                myUC045WarrantReturnsUtils.selectGridRowByEventId ("121");
                myUC045WarrantReturnsUtils.setEventErrorFlag (false);

                assertEquals (3, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
            }

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when final return 101 is created on a reissued CCBC warrant on a CCBC owned case
     * that no MCOL_DATA notifications are created.
     */
    public void testFinalReturn101_7 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber6, warrantNumber7, false);

            // Create final return 101
            createFinalReturn101 ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that no MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that no MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that actions on warrant return 147 do not generate an MCOL_DATA row.
     */
    public void testFinalReturn147 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Maintain/Query Warrants screen
            loginAndLoadMaintainWarrant (caseNumber2, warrantNumber2, true);

            // Transfer the foreign warrant to another court which will generate more final return 147s
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Navigate to Warrant Returns screen
            myUC039MaintainWarrantUtils
                    .clickNavigationButton (UC039MaintainWarrantUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Error final return 147
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the second row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (2);

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that actions on warrant return 156 do not generate an MCOL_DATA row.
     */
    public void testFinalReturn156 ()
    {
        try
        {
            // Log into SUPS CaseMan and load warrant on Warrant Returns screen
            loginAndLoadWarrant (caseNumber6, warrantNumber6, true);

            // Error final return 156
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Unerror the event and navigate to the Case Events screen
            myUC045WarrantReturnsUtils.setEventErrorFlag (false);
            myUC045WarrantReturnsUtils.clickNavigationButton (UC045WarrantReturnsUtils.BTN_NAV_CASE_EVENTS_SCREEN);
            if (this.isAlertPresent ())
            {
                this.getAlert ();
            }

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Error off the Case Event 620
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_620);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Navigate to the Warrant Returns screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_WARRANT_RETURNS_SCREEN);
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load the home warrant which should be the first row
            myUC045WarrantReturnsUtils.doubleClickSearchPopupRow (1);

            myUC045WarrantReturnsUtils.selectGridRowByEventId ("156");

            // Error final return 101
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that MCOL_DATA rows written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE1));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a foreign warrant issued by CCBC and executed by Northampton is
     * paid in full that the final return 101 is automatically created and as the case
     * is still owned by CCBC, the MCOL_DATA row FR is created.
     */
    public void testCreateFWPayment1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (warrantNumber5,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            myUC059CounterPaymentUtils.setPaymentAmount ("192.25");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            final String transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            System.out.println ("Transaction Number " + transactionNumber + " created.");

            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a foreign warrant issued by CCBC and executed by Northampton is
     * paid in full that the final return 101 is automatically created and as the case
     * is no longer owned by CCBC, the MCOL_DATA row FR is not created.
     */
    public void testCreateFWPayment2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            myUC059CounterPaymentUtils.loadEnforcement (warrantNumber4,
                    AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            myUC059CounterPaymentUtils.setPaymentAmount ("192.25");
            myUC059CounterPaymentUtils.setPaymentType (AbstractSuitorsCashScreenUtils.PAYMENT_TYPE_CASH);
            myUC059CounterPaymentUtils.setRetentionType (AbstractSuitorsCashScreenUtils.RETENTION_TYPE_ORDINARY);
            final String transactionNumber = myUC059CounterPaymentUtils.saveScreen ();
            System.out.println ("Transaction Number " + transactionNumber + " created.");

            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Warrant Returns screen
     * and load a warrant.
     *
     * @param caseNumber The case number to load
     * @param warrantNumber The warrant number
     * @param foreignWarrant True if foreign warrant, else false
     */
    private void loginAndLoadWarrant (final String caseNumber, final String warrantNumber, final boolean foreignWarrant)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

        // Enter search criteria and load warrant
        myUC045WarrantReturnsUtils.setCaseNumber (caseNumber);
        if (foreignWarrant)
        {
            // Foreign Warrant, set local warrant number
            myUC045WarrantReturnsUtils.setLocalNumber (warrantNumber);
        }
        else
        {
            // Home warrant, set warrant number
            myUC045WarrantReturnsUtils.setWarrantNumber (warrantNumber);
        }
        myUC045WarrantReturnsUtils.clickSearchButton ();
    }

    /**
     * Private method to log into CaseMan, navigate to the Maintain/Query Warrants screen
     * and load a warrant.
     *
     * @param caseNumber The case number to load
     * @param warrantNumber The warrant number
     * @param foreignWarrant True if foreign warrant, else false
     */
    private void loginAndLoadMaintainWarrant (final String caseNumber, final String warrantNumber,
                                              final boolean foreignWarrant)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Maintain/Query Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

        // Enter search criteria and load warrant
        myUC039MaintainWarrantUtils.setCaseNumber (caseNumber);
        if (foreignWarrant)
        {
            // Foreign Warrant, set local warrant number
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (warrantNumber);
        }
        else
        {
            // Home warrant, set warrant number
            myUC039MaintainWarrantUtils.setWarrantNumber (warrantNumber);
        }
        myUC039MaintainWarrantUtils.clickSearchButton ();
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
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the creation of warrant return 101.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createFinalReturn101 () throws Exception
    {
        final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
        testEvent101.setSubjectParty ("DEFENDANT NAME");
        testEvent101.setCheckNotice (true);

        // Add the event and clear screen down afterwards
        myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

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