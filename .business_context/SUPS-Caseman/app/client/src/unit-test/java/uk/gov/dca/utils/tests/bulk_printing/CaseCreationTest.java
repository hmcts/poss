/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11399 $
 * $Author: vincentcp $
 * $Date: 2014-10-24 14:59:33 +0100 (Fri, 24 Oct 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bulk_printing;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Bulk Printing release. These tests look at the bulk printing
 * functionality on the Create Cases screen.
 *
 * @author Chris Vincent
 */
public class CaseCreationTest extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseCreationTest ()
    {
        super (CaseCreationTest.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that the N205A output is sent to bulk printing via a REPORT_MAP
     * row being written. In addition, checks that when the event is errored,
     * the REPORT_MAP row is deleted.
     */
    public void testCreateCase1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create Case that will produce the bulk printed output N205A
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A14NN001",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N205A"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("1", "A14NN001"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("1", "A14NN001"));

            // Navigate to the Case Events screen and double click on the Case Event 1
            myUC001CreateUpdateCaseUtils.closeScreen ();
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A14NN001");

            // Check that only one REPORT_MAP row still exists
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N205A"));

            // Error off the Case Event 1
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205A"));

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the N205B output is sent to bulk printing via a REPORT_MAP
     * row being written. In addition, checks that when a Duplicate Notice is,
     * produced, no additional REPORT_MAP rows are written.
     */
    public void testCreateCase2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create Case that will produce the bulk printed output N205B
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A14NN001",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_UNSPEC_ONLY, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N205B"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent ("1", "A14NN001"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent ("1", "A14NN001"));

            // Load the case again
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A14NN001");

            // Run the duplicate notice
            myUC001CreateUpdateCaseUtils.produceDuplicateNotice ();

            // Check that only one REPORT_MAP row still exists
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N205B"));

            myUC001CreateUpdateCaseUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a case is created that doesn't produce an output that needs to be sent
     * to bulk printing, the REPOT_MAP row is not written and is printed locally. The erroring/
     * unerroring of the case event 1 is also tested as well as the Duplicate Notice functionality.
     */
    public void testCreateCase3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create Case that will not produce a bulk printed output
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A14NN001",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CH_ACC_POSSN, false);

            // Check that no REPORT_MAP row exists
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205A"));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205B"));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent ("1", "A14NN001"));

            // Navigate to the Case Events screen and double click on the Case Event 1
            myUC001CreateUpdateCaseUtils.closeScreen ();
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A14NN001");

            // Check that no REPORT_MAP row exists
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205A"));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205B"));

            // Error off the Case Event 1
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Unerror the Event 1 and then error it again
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Load the Case in the Case Creation screen
            myUC002CaseEventUtils.closeScreen ();
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Load the case again
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A14NN001");

            // Run the duplicate notice
            myUC001CreateUpdateCaseUtils.produceDuplicateNotice ();

            // Check that no REPORT_MAP row exists
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205A"));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205B"));

            myUC001CreateUpdateCaseUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a case is created which produces an output that goes to bulk printing, if
     * there are any parties requesting translation to Welsh, the output is printed locally
     * instead.
     */
    public void testCreateCase4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create Case that normally produces an output for bulk printing but has a
            // party requesting translation to Welsh.
            myUC001CreateUpdateCaseUtils.createDefaultCase ("A14NN001",
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY, true);

            // Check that the REPORT_MAP row exists
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N205A"));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent ("1", "A14NN001"));

            // Navigate to the Case Events screen and double click on the Case Event 1
            myUC001CreateUpdateCaseUtils.closeScreen ();

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

}