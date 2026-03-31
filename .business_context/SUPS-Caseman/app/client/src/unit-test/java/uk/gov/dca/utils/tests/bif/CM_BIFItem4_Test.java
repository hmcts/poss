/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11483 $
 * $Author: vincentcp $
 * $Date: 2015-01-07 09:55:26 +0000 (Wed, 07 Jan 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.screens.UC048EX77ReportUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated teststhe Bulk Printing of EX77 and EX98 outputs.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem4_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 048 EX 77 report utils. */
    private UC048EX77ReportUtils myUC048EX77ReportUtils;

    /** The outputex98. */
    private String OUTPUTEX98 = "EX98";
    
    /** The outputex77. */
    private String OUTPUTEX77 = "EX77";

    /**
     * Constructor.
     */
    public CM_BIFItem4_Test ()
    {
        super (CM_BIFItem4_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
        myUC048EX77ReportUtils = new UC048EX77ReportUtils (this);
    }

    /**
     * Tests that when Interim Warrant Return NP is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCreateWarrantReturnNPOnHomeWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0,
                    DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));

            // Create another warrant return to add to the warrant
            final NewStandardEvent testEventLC = new NewStandardEvent ("WarrantReturn-LC");
            testEventLC.setSubjectParty ("DEFENDANT NAME");
            testEventLC.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventLC, null);

            // Error off the other warrant return and ensure that the original REPORT_MAP row remains
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("LC");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Now error off the warrant return NP and check the REPORT_MAP row is removed
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("NP");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that a REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Interim Warrant Return NP is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCreateWarrantReturnNPOnForeignWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00032");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000020");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000020", "1C000020", "335",
                    "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000020", "1C000020", "335", "282", "282"));

            // Create another warrant return to add to the warrant
            final NewStandardEvent testEventLC = new NewStandardEvent ("WarrantReturn-LC");
            testEventLC.setSubjectParty ("DEFENDANT NAME");
            testEventLC.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventLC, null);

            // Error off the other warrant return and ensure that the original REPORT_MAP row remains
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("LC");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Now error off the warrant return NP and check the REPORT_MAP row is removed
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("NP");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that a REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when interim warrant return NP is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCreateWarrantReturnNPWelshParty ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00033");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000021");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000021", "1C000021", "335",
                    "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000021", "1C000021", "335", "282", "282"));

            // Now error off the warrant return NP and check the REPORT_MAP row is removed
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("NP");
            myUC045WarrantReturnsUtils.setEventErrorFlag (true);

            // Check that a REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when interim warrant return NP is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCreateWarrantReturnNPEditable ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);
            testEventNP.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Double click on the warrant return to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode ("NP");

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdFCK = new VariableDataQuestion ("", 0, this);
            vdFCK.clickFCKEditorFinalCheckbox ();
            vdFCK.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0,
                    DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when interim warrant return NP is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPORT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCreateWarrantReturnNPCancelFCK ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00031");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);
            testEventNP.setCancelFCK (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Double click on the warrant return to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode ("NP");

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdFCK = new VariableDataQuestion ("", 0, this);
            vdFCK.clickFCKEditorFinalCheckbox ();
            vdFCK.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0,
                    DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000019", null, "282", "282", "282"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when interim warrant return NP is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCreateWarrantReturnNPWelshEditable ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00033");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000021");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);
            testEventNP.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Double click on the warrant return to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode ("NP");

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdFCK = new VariableDataQuestion ("", 0, this);
            vdFCK.clickFCKEditorFinalCheckbox ();
            vdFCK.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has not been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForWarrantReturn ("NP", "1C000021", "1C000021", "335",
                    "282", "282"));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y",
                    DBUtil.getWPOutputPrintedFlagForWarrantReturn ("NP", "1C000021", "1C000021", "335", "282", "282"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when interim warrant return NP is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCreateWarrantReturnNPWelshCancelFCK ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToWarrantReturns ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00033");
            myUC045WarrantReturnsUtils.setLocalNumber ("1C000021");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventNP = new NewStandardEvent ("WarrantReturn-NP");
            testEventNP.setSubjectParty ("DEFENDANT NAME");
            testEventNP.setCheckNotice (true);
            testEventNP.setCancelFCK (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventNPQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PaymentDueDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            eventNPQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("BailiffName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "BIG DAVE", this);
            eventNPQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventNP, eventNPQuestions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Double click on the warrant return to return to the FCK Editor screen
            myUC045WarrantReturnsUtils.doubleClickWarrantReturnByCode ("NP");

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdFCK = new VariableDataQuestion ("", 0, this);
            vdFCK.clickFCKEditorFinalCheckbox ();
            vdFCK.clickFCKEditorOkButton ();

            // Loop until in Warrant Returns screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC045WarrantReturnsUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that a REPORT_MAP row has not been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX98));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            // assertEquals( 2, DBUtil.getReportQueuePrintStatusForWarrantReturn("NP", "1C000021", "1C000021", "335",
            // "282", "282") );

            // Check that the WP_OUTPUT row shows the output has been printed
            // assertEquals( "Y", DBUtil.getWPOutputPrintedFlagForWarrantReturn("NP", "1C000021", "1C000021", "335",
            // "282", "282") );
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the Interim Report on Warrant (EX77) is run, the output is sent for bulk print
     * accordingly.
     */
    public void testEX77_1 ()
    {
        try
        {
            // 09-Feb-2015 - Both Welsh and Non-Welsh returns
            // 10-Feb-2015 - Only Non-Welsh returns
            // 11-Feb-2015 - Only Welsh returns

            // Get to the Interim Report On Warrant - EX77 screen
            mLoginAndNavigateToEX77Screen ();

            // Try to run the report for a date where there are no interim returns
            myUC048EX77ReportUtils.setReturnDate ("12-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("12-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("12-Feb-2015");
            assertEquals (UC048EX77ReportUtils.WARNING_NO_RETURNS,
                    myUC048EX77ReportUtils.runReportReturnAlertString ());

            // Check that a REPORT_MAP row has not been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX77));

            myUC048EX77ReportUtils.setReturnDate ("10-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("10-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("10-Feb-2015");
            myUC048EX77ReportUtils.runReport ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX77));

            // Check status of reports generated
            assertTrue ("Invalid number of reports generated", checkNumberReportsGenerated ("1"));
            assertTrue ("Invalid number of reports printed", checkNumberReportsPrinted ("0"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when the Interim Report on Warrant (EX77) is run, the output is sent for bulk print
     * accordingly especially when a Welsh translation is required.
     */
    public void testEX77_2 ()
    {
        try
        {
            // 09-Feb-2015 - Both Welsh and Non-Welsh returns
            // 10-Feb-2015 - Only Non-Welsh returns
            // 11-Feb-2015 - Only Welsh returns

            // Get to the Interim Report On Warrant - EX77 screen
            mLoginAndNavigateToEX77Screen ();

            // Try to run the report for a date where only returns that require a Welsh translation exist
            myUC048EX77ReportUtils.setReturnDate ("11-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("11-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("11-Feb-2015");
            assertEquals (UC048EX77ReportUtils.WARNING_WELSH_PARTIES,
                    myUC048EX77ReportUtils.runReportReturnAlertString ());

            // Check that a REPORT_MAP row has not been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX77));

            this.waitForPageToLoad ();
            this.waitForPageToLoad ();

            // Check status of reports generated
            assertTrue ("Invalid number of reports generated", checkNumberReportsGenerated ("1"));
            assertTrue ("Invalid number of reports printed", checkNumberReportsPrinted ("1"));

            myUC048EX77ReportUtils.setReturnDate ("09-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("09-Feb-2015");
            myUC048EX77ReportUtils.setReturnDate ("09-Feb-2015");
            assertEquals (UC048EX77ReportUtils.WARNING_WELSH_PARTIES,
                    myUC048EX77ReportUtils.runReportReturnAlertString ());

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTEX77));

            this.waitForPageToLoad ();
            this.waitForPageToLoad ();

            // Check status of reports generated
            assertTrue ("Invalid number of reports generated", checkNumberReportsGenerated ("3"));
            assertTrue ("Invalid number of reports printed", checkNumberReportsPrinted ("2"));

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the Warrant Returns screen.
     */
    private void mLoginAndNavigateToWarrantReturns ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the Interim Report On Warrant - EX77 screen.
     */
    private void mLoginAndNavigateToEX77Screen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Interim Report On Warrant - EX77 screen
        this.nav.navigateFromMainMenu (MAINMENU_INTERIM_REPORT_ON_WARRANT_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC048EX77ReportUtils.getScreenTitle ());
        this.waitForPageToLoad ();
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
     * Checks the number of rows in the REPORT_QUEUE table are as expected.
     *
     * @param pExpectedRows Expected number of rows
     * @return True if the number of rows are as expected, else false
     */
    private boolean checkNumberReportsGenerated (final String pExpectedRows)
    {
        final String query = "SELECT DECODE(COUNT(*), " + pExpectedRows + ", 'true', 'false') FROM report_queue";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Checks the number of rows in the REPORT_QUEUE table that have been printed are as expected.
     *
     * @param pExpectedRows Expected number of rows
     * @return True if the number of rows are as expected, else false
     */
    private boolean checkNumberReportsPrinted (final String pExpectedRows)
    {
        final String query = "SELECT DECODE(COUNT(*), " + pExpectedRows +
                ", 'true', 'false') FROM report_queue WHERE " + "print_status = 2";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}