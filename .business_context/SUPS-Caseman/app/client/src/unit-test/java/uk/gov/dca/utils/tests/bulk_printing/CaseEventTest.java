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

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Transfer functionality following the bulk printing release.
 *
 * @author Chris Vincent
 */
public class CaseEventTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "2NN00001";
    
    /** The case number 2. */
    private String caseNumber2 = "2NN00002";
    
    /** The case number 3. */
    private String caseNumber3 = "2NN00003";

    /**
     * Constructor.
     */
    public CaseEventTest ()
    {
        super (CaseEventTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that when Case Event 38 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent38_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (eventId, caseNumber1));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests that when case event 38 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent38_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber3));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests that when Case Event 38 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent38_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);
            testEvent38.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Double click on the Case Event 38 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
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
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (eventId, caseNumber1));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests that when case event 38 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent38_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);
            testEvent38.setCancelFCK (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Double click on the Case Event 38 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
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
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (eventId, caseNumber1));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests that when Case Event 38 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent38_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);
            testEvent38.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Double click on the Case Event 38 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
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
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber3));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests that when case event 38 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent38_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber3);

            /**
             * Create Event 38
             * Enter Subject
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "38";
            final NewStandardEvent testEvent38 = new NewStandardEvent (eventId);
            testEvent38.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent38.setProduceOutputFlag (true);
            testEvent38.setCancelFCK (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event38Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("DefendantsIntention",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Defend all of the claim", this);
            event38Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("NewAddressForService",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "No new address for service given", this);
            event38Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent38, event38Questions);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Double click on the Case Event 38 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
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
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber3));

            // Error off the Case Event 38
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput ("N10"));

            // Unerror the Event 1 and then error it again
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
     * Tests case event 100 can be created and errored without issue and that no
     * REPORT_MAP rows are written.
     */
    public void testCaseEvent100 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            /**
             * Create Event 100
             * Enter Subject
             * BMS Related LOV on Save
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "100";
            final NewStandardEvent testEvent100 = new NewStandardEvent (eventId);
            testEvent100.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent100.setNavigateObligations (true);
            testEvent100.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event100Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event100Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent100, event100Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber2));

            // Error off the Case Event 100, unerror it and then error again
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 332 can be created and errored without issue and that no
     * REPORT_MAP rows are written.
     */
    public void testCaseEvent332 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            /**
             * Create Event 332
             * No Subject
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "332";
            final NewStandardEvent testEvent332 = new NewStandardEvent (eventId);
            testEvent332.setNavigateObligations (true);
            testEvent332.setProduceOutputFlag (true);
            testEvent332.setOutputFinal (false);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event332Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event332Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event332Questions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent332, event332Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Double click on the Case Event 332 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (eventId);

            // Loop until in FCK Editor screen
            String pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            vdQ1.clickFCKEditorFinalCheckbox ();
            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber2));

            // Error off the Case Event 332, unerror it and then error again
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 111 can be created and errored without issue and that no
     * REPORT_MAP rows are written.
     */
    public void testCaseEvent111 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            /**
             * Create Event 111
             * Enter Subject
             * BMS Related LOV on Save
             * Navigation to Obligations Screen
             * Variable Data Screen (Word Processing Output)
             * FCK Editor
             */
            final String eventId = "111";
            final NewStandardEvent testEvent111 = new NewStandardEvent (eventId);
            testEvent111.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent111.setNavigateObligations (true);
            testEvent111.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event111Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event111Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent111, event111Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber2));

            // Error off the Case Event 111, unerror it and then error again
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 51 can be created and errored without issue and that no
     * REPORT_MAP rows are written.
     */
    public void testCaseEvent51 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            /**
             * Create Event 51
             * Enter Subject (don't set so uses defaults)
             * Mandatory navigation to Obligations screen to create Obligation
             * No Variable Data screen or FCK Editor
             */
            final String eventId = "51";
            final NewStandardEvent testEvent51 = new NewStandardEvent (eventId);
            testEvent51.setProduceOutputFlag (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event51Questions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent51, event51Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (eventId, caseNumber2));

            // Error off the Case Event 51, unerror it and then error again
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 9 can be created and errored without issue and that no
     * REPORT_MAP rows are written.
     */
    public void testCaseEvent9 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            /**
             * Create Event 9
             * No Subject
             * Variable Data Screen (Oracle Report Output)
             */
            final String eventId = "9";
            final NewStandardEvent testEvent9 = new NewStandardEvent (eventId);
            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event9Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ReturnedDocument",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Copy of the Times", this);
            event9Questions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent9, event9Questions);

            // Check that no REPORT_MAP rows have been written
            assertEquals (0, DBUtil.getCountReportMapRows ());

            // Error off the Case Event 9, unerror it and then error again
            myUC002CaseEventUtils.selectCaseEventByEventId (eventId);
            myUC002CaseEventUtils.setEventErrorFlag (true);
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
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
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
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