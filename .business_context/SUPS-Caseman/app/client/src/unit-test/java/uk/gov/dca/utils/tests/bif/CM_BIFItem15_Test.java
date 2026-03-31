/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 12832 $
 * $Author: vincentcp $
 * $Date: 2017-01-17 15:21:13 +0000 (Tue, 17 Jan 2017) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.screens.UC009MaintainObligationsUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests the Electronic Seal and Bulk Printing changes in the BIF release.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem15_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 009 maintain obligations utils. */
    private UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "2NN00001"; // Northampton owned case, no Welsh translation
    
    /** The case number 2. */
    private String caseNumber2 = "2QX00001"; // CCBC owned case, no Welsh translation
    
    /** The case number 3. */
    private String caseNumber3 = "2NN00003"; // Northampton owned case with Welsh translation
    
    /** The case number 4. */
    private String caseNumber4 = "2MC00001"; // CCMCC (390) owned case, no Welsh translation
    
    /** The case number 5. */
    private String caseNumber5 = "2MC00002"; // CCMCC (391) owned case, no Welsh translation

    /** The ae number 1. */
    private String aeNumber1 = "282X0001"; // Northampton owned case, no Welsh translation
    
    /** The ae number 2. */
    private String aeNumber2 = "282X0002"; // Northampton owned case with Welsh translation
    
    /** The ae number 3. */
    private String aeNumber3 = "335X0001"; // CCBC owned case, no Welsh translation
    
    /** The ae number 4. */
    private String aeNumber4 = "390X0001"; // CCMCC (390) owned case, no Welsh translation
    
    /** The ae number 5. */
    private String aeNumber5 = "391X0001"; // CCMCC (391) owned case, no Welsh translation

    /** The event103. */
    private String EVENT103 = "103";
    
    /** The event104. */
    private String EVENT104 = "104";
    
    /** The event230. */
    private String EVENT230 = "230";
    
    /** The event240. */
    private String EVENT240 = "240";
    
    /** The event250. */
    private String EVENT250 = "250";
    
    /** The event251. */
    private String EVENT251 = "251";
    
    /** The event260. */
    private String EVENT260 = "260";
    
    /** The event262. */
    private String EVENT262 = "262";
    
    /** The event323. */
    private String EVENT323 = "323";
    
    /** The event332. */
    private String EVENT332 = "332";
    
    /** The event333. */
    private String EVENT333 = "333";

    /** The outputn24 65. */
    private String OUTPUTN24_65 = "N24_65";
    
    /** The outputn24 65 ccbc. */
    private String OUTPUTN24_65_CCBC = "N24_65_CC";
    
    /** The outputn24 65 ccmcc. */
    private String OUTPUTN24_65_CCMCC = "N24_65_MC";
    
    /** The outputn24 69. */
    private String OUTPUTN24_69 = "N24_69";
    
    /** The outputn24 69 ccbc. */
    private String OUTPUTN24_69_CCBC = "N24_69_CC";
    
    /** The outputn24 69 ccmcc. */
    private String OUTPUTN24_69_CCMCC = "N24_69_MC";
    
    /** The outputn24 70. */
    private String OUTPUTN24_70 = "N24_70";
    
    /** The outputn24 70 ccmcc. */
    private String OUTPUTN24_70_CCMCC = "N24_70_MC";
    
    /** The outputn26. */
    private String OUTPUTN26 = "N26";
    
    /** The outputn26a. */
    private String OUTPUTN26A = "N26A";
    
    /** The outputn30. */
    private String OUTPUTN30 = "N30";
    
    /** The outputn30 1. */
    private String OUTPUTN30_1 = "N30";
    
    /** The outputn30 ccmcc. */
    private String OUTPUTN30_CCMCC = "N30_MC";
    
    /** The outputn30 2. */
    private String OUTPUTN30_2 = "N30_2";
    
    /** The outputn30 2 ccbc. */
    private String OUTPUTN30_2_CCBC = "N30_2_CC";
    
    /** The outputn30 2 ccmcc. */
    private String OUTPUTN30_2_CCMCC = "N30_2_MC";
    
    /** The outputn322. */
    private String OUTPUTN322 = "N322";

    /**
     * Constructor.
     */
    public CM_BIFItem15_Test ()
    {
        super (CM_BIFItem15_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that when Case Event 103 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent103_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 103 and finalise output
            createCaseEvent103 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT103, caseNumber1));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 103 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent103_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 103 and finalise output
            createCaseEvent103 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber3));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 103 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent103_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2, true);

            // Create Case Event 103 and do not finalise output
            createCaseEvent103 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCBC));

            // Double click on the Case Event 103 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT103);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCBC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber2));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT103, caseNumber2));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCBC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 103 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPORT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent103_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 103 and finalise output
            createCaseEvent103 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCMCC));

            // Double click on the Case Event 103 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT103);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT103, caseNumber4));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 103 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent103_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 103 and finalise output
            createCaseEvent103 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Double click on the Case Event 103 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT103);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber3));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 103 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent103_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 103 and cancel the output
            createCaseEvent103 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Double click on the Case Event 103 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT103);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber3));

            // Error off the Case Event 103
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT103);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 103 is created on a CCMCC (391) case, the REPORT_MAP row is created.
     */
    public void testCaseEvent103_7 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 103 and finalise output
            createCaseEvent103 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_69_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT103, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT103, caseNumber5));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 104 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent104_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 104 and finalise output
            createCaseEvent104 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT104, caseNumber1));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 104 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent104_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 104 and finalise output
            createCaseEvent104 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber3));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 104 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent104_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 104 and do not finalise output
            createCaseEvent104 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Double click on the Case Event 104 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT104);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT104, caseNumber4));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 104 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPORT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent104_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 104 and finalise output
            createCaseEvent104 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Double click on the Case Event 104 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT104);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT104, caseNumber5));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 104 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent104_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 104 and finalise output
            createCaseEvent104 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Double click on the Case Event 104 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT104);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber3));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 104 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent104_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 104 and cancel the output
            createCaseEvent104 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Double click on the Case Event 104 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT104);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT104, caseNumber3));

            // Error off the Case Event 104
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_70));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT104);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent230_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 230 and finalise output
            createCaseEvent230 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT230, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT230, caseNumber1));

            // Error off the Case Event 230
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT230);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT230);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 230 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent230_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 230 and finalise output
            createCaseEvent230 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT230, caseNumber3));

            // Error off the Case Event 230
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT230);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT230);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created, the REPORT_MAP row is created and when
     * printed again via the Print Judgment Orders button on Maintain Judgments, the output
     * is not bulk printed.
     */
    public void testCaseEvent230_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 230 and finalise output
            createCaseEvent230 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (false);
            myUC004MaintainJudgmentUtils.closeScreen ();

            // No new REPORT_MAP row should have been created
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a CCMCC (390) case, the REPORT_MAP row is created.
     */
    public void testCaseEvent230_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 230 and finalise output
            createCaseEvent230 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT230, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT230, caseNumber4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 230 is created on a CCMCC (391) case, the REPORT_MAP row is created.
     */
    public void testCaseEvent230_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 230 and finalise output
            createCaseEvent230 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT230, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT230, caseNumber5));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent240_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 240 and finalise output
            createCaseEvent240 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT240, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT240, caseNumber1));

            // Error off the Case Event 240
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT240);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT240);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 240 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent240_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 240 and finalise output
            createCaseEvent240 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT240, caseNumber3));

            // Error off the Case Event 240
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT240);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT240);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created, the REPORT_MAP row is created and when
     * printed again via the Print Judgment Orders button on Maintain Judgments, the output
     * is not bulk printed.
     */
    public void testCaseEvent240_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 240 and finalise output
            createCaseEvent240 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (false);
            myUC004MaintainJudgmentUtils.closeScreen ();

            // No new REPORT_MAP row should have been created
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_1));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a CCMCC (390) case, the REPORT_MAP row is created.
     */
    public void testCaseEvent240_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 240 and finalise output
            createCaseEvent240 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT240, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT240, caseNumber4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 240 is created on a CCMCC (391) case, the REPORT_MAP row is created.
     */
    public void testCaseEvent240_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 240 and finalise output
            createCaseEvent240 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT240, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT240, caseNumber5));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent250_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 250 and finalise output
            createCaseEvent250 (true, false, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT250, caseNumber1));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 250 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent250_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 250 and finalise output
            createCaseEvent250 (true, false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber3));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent250_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 250 and do not finalise output
            createCaseEvent250 (false, false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Double click on the Case Event 250 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT250);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT250, caseNumber5));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 250 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPORT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent250_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 250 and finalise output
            createCaseEvent250 (false, true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Double click on the Case Event 250 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT250);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT250, caseNumber4));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent250_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 250 and finalise output
            createCaseEvent250 (false, false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Double click on the Case Event 250 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT250);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber3));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 250 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent250_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 250 and cancel the output
            createCaseEvent250 (false, true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Double click on the Case Event 250 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT250);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT250, caseNumber3));

            // Error off the Case Event 250
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT250);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 250 is created, the REPORT_MAP row is created and when
     * printed again via the Print Judgment Orders button on Maintain Judgments, the output
     * is not bulk printed.
     */
    public void testCaseEvent250_7 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2, false);

            // Create Case Event 250 and finalise output
            createCaseEvent250 (true, false, true);

            // Check that no REPORT_MAP row has been written (this output is suppressed on CCBC cases)
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCBC));

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (true);
            myUC004MaintainJudgmentUtils.closeScreen ();

            // No new REPORT_MAP row should have been created
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN30_2_CCBC));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent251_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 251 and finalise output
            createCaseEvent251 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT251, caseNumber1));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 251 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent251_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 251 and finalise output
            createCaseEvent251 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber3));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent251_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2, true);

            // Create Case Event 251 and do not finalise output
            createCaseEvent251 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Double click on the Case Event 251 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT251);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber2));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT251, caseNumber2));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 251 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent251_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber4, false);

            // Create Case Event 251 and finalise output
            createCaseEvent251 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Double click on the Case Event 251 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT251);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT251, caseNumber4));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 251 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent251_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 251 and finalise output
            createCaseEvent251 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the Case Event 251 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT251);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber3));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 251 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent251_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 251 and cancel the output
            createCaseEvent251 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the Case Event 251 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT251);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT251, caseNumber3));

            // Error off the Case Event 251
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT251);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 260 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent260_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 260 and finalise output
            createCaseEvent260 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT260, caseNumber1));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 260 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent260_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 260 and finalise output
            createCaseEvent260 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber3));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 260 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent260_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 260 and do not finalise output
            createCaseEvent260 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Double click on the Case Event 260 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT260);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT260, caseNumber1));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 260 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent260_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 260 and finalise output
            createCaseEvent260 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Double click on the Case Event 260 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT260);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT260, caseNumber1));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 260 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent260_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 260 and finalise output
            createCaseEvent260 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Double click on the Case Event 260 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT260);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber3));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 260 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent260_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 260 and cancel the output
            createCaseEvent260 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Double click on the Case Event 260 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT260);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT260, caseNumber3));

            // Error off the Case Event 260
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT260);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 262 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent262_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 262 and finalise output
            createCaseEvent262 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT262, caseNumber1));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 262 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent262_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 262 and finalise output
            createCaseEvent262 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber3));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 262 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent262_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 262 and do not finalise output
            createCaseEvent262 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Double click on the Case Event 262 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT262);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT262, caseNumber1));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 262 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent262_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 262 and finalise output
            createCaseEvent262 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Double click on the Case Event 262 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT262);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT262, caseNumber1));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 262 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent262_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 262 and finalise output
            createCaseEvent262 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Double click on the Case Event 262 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT262);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber3));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 262 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent262_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 262 and cancel the output
            createCaseEvent262 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Double click on the Case Event 262 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT262);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT262, caseNumber3));

            // Error off the Case Event 262
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN26A));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT262);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 323 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent323_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 323 and finalise output
            createCaseEvent323 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT323, caseNumber1));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 323 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent323_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 323 and finalise output
            createCaseEvent323 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber3));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 323 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent323_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 323 and do not finalise output
            createCaseEvent323 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Double click on the Case Event 323 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT323);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT323, caseNumber1));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 323 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent323_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 323 and finalise output
            createCaseEvent323 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Double click on the Case Event 323 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT323);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT323, caseNumber1));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 323 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent323_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 323 and finalise output
            createCaseEvent323 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Double click on the Case Event 323 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT323);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber3));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 323 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent323_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 323 and cancel the output
            createCaseEvent323 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Double click on the Case Event 323 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT323);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT323, caseNumber3));

            // Error off the Case Event 323
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN322));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT323);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent333_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber5, false);

            // Create Case Event 333 and finalise output
            createCaseEvent333 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT333, caseNumber5));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 333 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent333_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 333 and finalise output
            createCaseEvent333 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber3));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent333_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2, true);

            // Create Case Event 333 and do not finalise output
            createCaseEvent333 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Double click on the Case Event 333 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT333);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber2));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT333, caseNumber2));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 333 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent333_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 333 and finalise output
            createCaseEvent333 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the Case Event 333 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT333);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT333, caseNumber1));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 333 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent333_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 333 and finalise output
            createCaseEvent333 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the Case Event 333 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT333);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber3));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 333 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent333_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3, false);

            // Create Case Event 333 and cancel the output
            createCaseEvent333 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the Case Event 333 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT333);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT333, caseNumber3));

            // Error off the Case Event 333
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            handleObligationsOnError ();

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT333);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testAEEvent332_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber1);

            // Create AE Avent 332 and finalise output
            createAEEvent332 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForAEEvent (EVENT332, aeNumber1));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testAEEvent332_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber3);

            // Create AE Avent 332 and finalise output
            createAEEvent332 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber2));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testAEEvent332_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber2);

            // Create AE Avent 332 and do not finalise output
            createAEEvent332 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Double click on the AE Avent 332 to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (EVENT332);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Avents screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber3));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForAEEvent (EVENT332, aeNumber3));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCBC));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testAEEvent332_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber4);

            // Create AE Avent 332 and finalise output
            createAEEvent332 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Double click on the AE Avent 332 to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (EVENT332);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Avents screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber4));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForAEEvent (EVENT332, aeNumber4));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testAEEvent332_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber3);

            // Create AE Avent 332 and finalise output
            createAEEvent332 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the AE Avent 332 to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (EVENT332);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Avents screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber2));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testAEEvent332_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber3);

            // Create AE Avent 332 and cancel the output
            createAEEvent332 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Double click on the AE Avent 332 to return to the FCK Editor screen
            myUC092AEEventUtils.doubleClickAEEventByEventId (EVENT332);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("", 0, this);
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in AE Avents screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC092AEEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber2));

            // Error off the AE Avent 332
            myUC092AEEventUtils.selectGridRowByEventId (EVENT332);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Avent 332 is created on a CCMCC (391) AE, the REPORT_MAP row is created.
     */
    public void testAEEvent332_7 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber5);

            // Create AE Avent 332 and finalise output
            createAEEvent332 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65_CCMCC));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForAEEvent (EVENT332, aeNumber5));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForAEEvent (EVENT332, aeNumber5));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 332 is created, the REPORT_MAP row is NOT created.
     */
    public void testCaseEvent332_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1, false);

            // Create Case Event 332 and finalise output
            createCaseEvent332 (true, false);

            // Check that a REPORT_MAP row has not been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN24_65));
            assertEquals (0, DBUtil.getCountReportMapRows ());

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
     * @param ccbc True if user needs to be a CCBC user otherwise false
     */
    private void loginAndLoadCase (final String caseNumber, final boolean ccbc)
    {
        final int userCourt;
        final String userRole;
        if ( ccbc )
        {
            userCourt = AbstractCmTestBase.COURT_CCBC;
            userRole = AbstractCmTestBase.ROLE_CCBC_MANAGER;
        }
        else
        {
            userCourt = AbstractCmTestBase.COURT_NORTHAMPTON;
            userRole = AbstractCmTestBase.ROLE_SUITORS;
        }
        
        // Log into SUPS CaseMan
        logOn(userCourt, userRole);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to AE Events and loads an AE record.
     *
     * @param caseNumber The case number to load
     */
    private void mLoginAndLoadAE (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);
    }

    /**
     * Private method to handle the creation of Case Event 103.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent103 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT103);
        testEvent.setProduceOutputFlag (true);
        testEvent.setNavigateObligations (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);
        final VariableDataQuestion vdQ3 =
                new VariableDataQuestion ("Stayed", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
        eventQuestions.add (vdQ3);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 104.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent104 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT104);
        testEvent.setProduceOutputFlag (true);
        testEvent.setNavigateObligations (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);
        final VariableDataQuestion vdQ3 =
                new VariableDataQuestion ("Stayed", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
        eventQuestions.add (vdQ3);
        final VariableDataQuestion vdQ4 = new VariableDataQuestion ("StayDate",
                VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
        eventQuestions.add (vdQ4);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of case event 230.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent230 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT230);
        testEvent.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        eventQuestions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of case event 240.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent240 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT240);
        testEvent.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        eventQuestions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of case event 250.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @param pCCBCCase True if case is owned by 335 (CCBC)
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent250 (final boolean pOutputFinal, final boolean pCancelFCK, final boolean pCCBCCase)
        throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT250);
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);
        testEvent.setCCBCCase (pCCBCCase);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        eventQuestions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of case event 251.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent251 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT251);
        testEvent.setProduceOutputFlag (true);
        testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        eventQuestions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 260.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent260 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT260);
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);
        final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
        eventQuestions.add (vdQ3);
        final VariableDataQuestion vdQ4 = new VariableDataQuestion ("PossessionDate",
                VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
        eventQuestions.add (vdQ4);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 262.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent262 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT262);
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);
        final VariableDataQuestion vdQ3 = new VariableDataQuestion ("PossessionDate",
                VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
        eventQuestions.add (vdQ3);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 323.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent323 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT323);
        testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);
        final VariableDataQuestion vdQ3 = new VariableDataQuestion ("DateofAward",
                VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
        eventQuestions.add (vdQ3);
        final VariableDataQuestion vdQ4 = new VariableDataQuestion ("NameofBody",
                VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Institute for Mediocrity", this);
        eventQuestions.add (vdQ4);
        final VariableDataQuestion vdQ5 =
                new VariableDataQuestion ("AwardRef", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "555-XXX", this);
        eventQuestions.add (vdQ5);
        final VariableDataQuestion vdQ6 =
                new VariableDataQuestion ("AwardAmountUnpaid", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
        eventQuestions.add (vdQ6);
        final VariableDataQuestion vdQ7 =
                new VariableDataQuestion ("CourtFee", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
        eventQuestions.add (vdQ7);
        final VariableDataQuestion vdQ8 =
                new VariableDataQuestion ("SolicitorCost", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
        eventQuestions.add (vdQ8);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 333.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent333 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT333);
        testEvent.setProduceOutputFlag (true);
        testEvent.setNavigateObligations (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of AE Event 332.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createAEEvent332 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT332 + "-AE");
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of Case Event 332.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent332 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT332);
        testEvent.setProduceOutputFlag (true);
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);
        testEvent.setNavigateObligations (true);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
        eventQuestions.add (vdQ1);
        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
        eventQuestions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Method handles the automatic navigation from the case events screen to the obligations screen
     * when an event is errored. The offending obligation is deleted and user navigates back to
     * the case event screen.
     */
    private void handleObligationsOnError ()
    {
        this.waitForPageToLoad ();

        // Delete the obligation and exit back to the Case Events screen
        mCheckPageTitle (myUC009MaintainObligationsUtils.getScreenTitle ());
        myUC009MaintainObligationsUtils.clickRemoveObligationButton ();
        myUC009MaintainObligationsUtils.clickSave ();
        myUC009MaintainObligationsUtils.closeScreen ();

        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
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