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

package uk.gov.dca.utils.tests.central_ae;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC090AESODUtils;
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC104COSODUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests the Electronic Seal and Bulk Printing changes in the BIF release.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5725_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;
    
    /** The my UC 091 create update AE utils. */
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;
    
    /** The my UC 090 AESOD utils. */
    private UC090AESODUtils myUC090AESODUtils;
    
    /** The my UC 104 COSOD utils. */
    private UC104COSODUtils myUC104COSODUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "9NN00011";
    
    /** The case number 2. */
    private String caseNumber2 = "9NN00012";
    
    /** The case number 3. */
    private String caseNumber3 = "9NN00001";
    
    /** The case number 4. */
    private String caseNumber4 = "9NN00002";
    
    /** The case number 5. */
    private String caseNumber5 = "9NN00008";
    
    /** The case number 6. */
    private String caseNumber6 = "9NN00010";

    /** The ae number 1. */
    private String aeNumber1 = "282X0001";
    
    /** The ae number 2. */
    private String aeNumber2 = "282X0002";
    
    /** The ae number 3. */
    private String aeNumber3 = "282X0008";
    
    /** The ae number 4. */
    private String aeNumber4 = "282X0010";

    /** The co number 1. */
    private String coNumber1 = "150001NN";

    /** The event442. */
    private String EVENT442 = "442";
    
    /** The event851. */
    private String EVENT851 = "851";
    
    /** The event871. */
    private String EVENT871 = "871";
    
    /** The event880. */
    private String EVENT880 = "880";
    
    /** The event883. */
    private String EVENT883 = "883";
    
    /** The event332. */
    private String EVENT332 = "332";
    
    /** The event903. */
    private String EVENT903 = "903";

    /** The outputn87. */
    private String OUTPUTN87 = "N87";
    
    /** The outputn24 65. */
    private String OUTPUTN24_65 = "N24_65";
    
    /** The outputp851. */
    private String OUTPUTP851 = "P851";
    
    /** The outputp871. */
    private String OUTPUTP871 = "P871";
    
    /** The outputp880. */
    private String OUTPUTP880 = "P880";
    
    /** The outputp883. */
    private String OUTPUTP883 = "P883";
    
    /** The outputpn64. */
    private String OUTPUTPN64 = "N64";

    /**
     * Constructor.
     */
    public CaseMan_Trac5725_Test ()
    {
        super (CaseMan_Trac5725_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
        myUC090AESODUtils = new UC090AESODUtils (this);
        myUC104COSODUtils = new UC104COSODUtils (this);
    }

    /**
     * Tests that when Case Event 442 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testCaseEvent442_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create Case Event 442 and finalise output
            createCaseEvent442 (true, false);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT442, caseNumber1));

            // Error off the Case Event 442
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT442);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT442);
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
     * Tests that when case event 442 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testCaseEvent442_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create Case Event 442 and finalise output
            createCaseEvent442 (true, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber2));

            // Error off the Case Event 442
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT442);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Unerror the Event and then error it again
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT442);
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
     * Tests that when Case Event 442 is created, but the output is not marked as final, the
     * REPORT_MAP row is NOT created but it is when the user returns to the FCK Editor and marks
     * it as final.
     */
    public void testCaseEvent442_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create Case Event 442 and do not finalise output
            createCaseEvent442 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Double click on the Case Event 442 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT442);

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
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT442, caseNumber1));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 442 is created, but the user clicks the Cancel button
     * on the FCK Editor, the REPOT_MAP row is not created and when the user double
     * clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will create the REPORT_MAP row.
     */
    public void testCaseEvent442_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create Case Event 442 and finalise output
            createCaseEvent442 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Double click on the Case Event 442 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT442);

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
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber1));

            // Check that the WP_OUTPUT row shows the output has been printed
            assertEquals ("Y", DBUtil.getWPOutputPrintedFlagForCaseEvent (EVENT442, caseNumber1));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 442 is created on a case with a party that has requested translation
     * to Welsh and the output is not marked as final, the REPORT_MAP row is NOT created and when the
     * user returns to the FCK Editor and marks it as final, it is still not created.
     */
    public void testCaseEvent442_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create Case Event 442 and finalise output
            createCaseEvent442 (false, false);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Double click on the Case Event 442 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT442);

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
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber2));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when case event 442 is created on a case with a party that has requested translation
     * to Welsh and the user clicks the Cancel button on the FCK Editor, the REPORT_MAP row is not created
     * and when the user double clicks the broken output icon, they are taken to the FCK Editor and if finalised,
     * the output will still not create the REPORT_MAP row.
     */
    public void testCaseEvent442_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber2);

            // Create Case Event 442 and cancel the output
            createCaseEvent442 (false, true);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Double click on the Case Event 442 to return to the FCK Editor screen
            myUC002CaseEventUtils.doubleClickCaseEventByEventId (EVENT442);

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
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTN87));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (2, DBUtil.getReportQueuePrintStatusForCaseEvent (EVENT442, caseNumber2));

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
    public void testAEEvent332 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Avents screen
            mLoginAndLoadAE (caseNumber3);

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
     * Tests that when CO Event 332 is created, no REPORT_MAP row is created.
     */
    public void testCOEvent332 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO (coNumber1);

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("CO-332");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterText", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRows ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when CO Event 903 is created, no REPORT_MAP row is created.
     */
    public void testCOEvent903 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO (coNumber1);

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent (EVENT903);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRows ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 851 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testAEEvent851_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber4);

            // Create AE Event 851
            createAEEvent851 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber2, "P851-I"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber2, "N55"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber2, "N56"));

            // Error off the AE Event 851
            myUC092AEEventUtils.selectGridRowByEventId (EVENT851);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 851 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testAEEvent851_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber5);

            // Create AE Event 851
            createAEEvent851 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber3, "P851-I"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber3, "N55"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, aeNumber3, "N56"));

            // Error off the AE Event 851
            myUC092AEEventUtils.selectGridRowByEventId (EVENT851);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test the creation of an AE (which produces AE Event 851) creates a REPORT_MAP row for P851.
     */
    public void testAEEvent851_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to the Create/Maintain AE screen
            mLoginAndNavigateAE ();

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber1);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase (caseNumber1);

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "P851-I"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N55"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N56"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test the creation of an AE (which produces AE Event 851) with a case party that has requested
     * translation to Welsh. No REPORT_MAP row should be created.
     */
    public void testAEEvent851_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to the Create/Maintain AE screen
            mLoginAndNavigateAE ();

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber2);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase (caseNumber2);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "P851-I"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N55"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N56"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test the creation of an AE (which produces AE Event 851) with an employer that has requested
     * translation to Welsh. No REPORT_MAP row should be created
     */
    public void testAEEvent851_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and navigate to the Create/Maintain AE screen
            mLoginAndNavigateAE ();

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber1);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.setEmployerTransWelsh (true);
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase (caseNumber1);

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP851));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "P851-I"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N55"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT851, tmpAeNumber, "N56"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 871 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testAEEvent871_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber4);

            // Create AE Event 871
            createAEEvent871 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTP871));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT871, aeNumber2, "P871"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT871, aeNumber2, "N338"));

            // Error off the AE Event 851
            myUC092AEEventUtils.selectGridRowByEventId (EVENT871);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP871));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 871 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testAEEvent871_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber5);

            // Create AE Event 871
            createAEEvent871 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP871));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT871, aeNumber3, "P871"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT871, aeNumber3, "N338"));

            // Error off the AE Event 851
            myUC092AEEventUtils.selectGridRowByEventId (EVENT871);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP871));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 880 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testAEEvent880_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber4);

            // Create AE Event 880
            createAEEvent880 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTP880));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT880, aeNumber2, "P880"));

            // Error off the AE Event 880
            myUC092AEEventUtils.selectGridRowByEventId (EVENT880);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP880));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 880 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testAEEvent880_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber6);

            // Create AE Event 880
            createAEEvent880 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP880));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT880, aeNumber4, "P880"));

            // Error off the AE Event 880
            myUC092AEEventUtils.selectGridRowByEventId (EVENT880);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP880));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 883 is created, the REPORT_MAP row is created and when
     * errored, the REPORT_MAP row is removed.
     */
    public void testAEEvent883_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber4);

            // Create AE Event 883
            createAEEvent883 ();

            // Check that a REPORT_MAP row has been written
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTP883));
            assertEquals (1, DBUtil.getCountReportMapRowsForOutput (OUTPUTPN64));

            // Check that the REPORT_QUEUE row shows the output has not been printed locally
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT883, aeNumber2, "P883"));
            assertEquals (0, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT883, aeNumber2, "N64"));

            // Error off the AE Event 883
            myUC092AEEventUtils.selectGridRowByEventId (EVENT883);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP883));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTPN64));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 883 is created on a case with a party that has requested
     * translation to Welsh, the REPORT_MAP row is not written and the output is printed
     * locally instead.
     */
    public void testAEEvent883_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (caseNumber6);

            // Create AE Event 883
            createAEEvent883 ();

            // Check that a REPORT_MAP row has NOT been written
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP883));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTPN64));

            // Check that the REPORT_QUEUE row shows the output has been printed locally
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT883, aeNumber4, "P883"));
            assertEquals (2, DBUtil.getReportQueueORPrintStatusForAEEvent (EVENT883, aeNumber4, "N64"));

            // Error off the AE Event 883
            myUC092AEEventUtils.selectGridRowByEventId (EVENT883);
            myUC092AEEventUtils.setEventErrorFlag (true);

            // Check that the REPORT_MAP row has been removed
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTP883));
            assertEquals (0, DBUtil.getCountReportMapRowsForOutput (OUTPUTPN64));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the AE Start of Day report runs correctly.
     */
    public void testAEStartOfDay ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Start of Day screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_SOD_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC090AESODUtils.getScreenTitle ());

            // Run report
            myUC090AESODUtils.runReport ();

            // Exit Screen
            myUC090AESODUtils.closeScreen ();

            assertEquals (3, DBUtil.getCountReportMapRows ());
            assertEquals (3, DBUtil.getCountReportMapRowsForOutput (OUTPUTP871));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the CO Start of Day report runs correctly.
     */
    public void testCOStartOfDay ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the CO Start of Day screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_SOD_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC104COSODUtils.getScreenTitle ());

            // Run report
            myUC104COSODUtils.runReport ();

            // Exit Screen
            myUC104COSODUtils.closeScreen ();

            assertEquals (0, DBUtil.getCountReportMapRows ());
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
     * Private function that logs the user into CaseMan, navigates to CO Events and loads a CO Number.
     *
     * @param pCONumber The CO Number to load
     */
    private void mLoginAndLoadCO (final String pCONumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

        // Load Consolidated Order
        myUC116COEventUtils.loadCOByCONumber (pCONumber);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to Create AE screen.
     */
    private void mLoginAndNavigateAE ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

        // Navigate to the Create/Maintain AE screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());
    }

    /**
     * Private method to handle the creation of Case Event 442.
     *
     * @param pOutputFinal true if output is to be marked as final, else false
     * @param pCancelFCK true if output is to be cancelled, else false
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent442 (final boolean pOutputFinal, final boolean pCancelFCK) throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT442);
        testEvent.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
        testEvent.setOutputFinal (pOutputFinal);
        testEvent.setCancelFCK (pCancelFCK);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderDate", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrderDate", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AmntOfCharge", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostAmount2", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstnHoldingSecurity", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecurityDtls", this));

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
     * Private method to handle the creation of AE Event 851.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createAEEvent851 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT851);
        testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IsDebtorMaleOrFemale", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrder", this));

        // Add the event
        myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of AE Event 871.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createAEEvent871 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT871);
        testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IsEmployeeMaleOrFemale", this));

        // Add the event
        myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of AE Event 880.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createAEEvent880 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT880);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

        // Add the event
        myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
    }

    /**
     * Private method to handle the creation of AE Event 883.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createAEEvent883 () throws Exception
    {
        final NewStandardEvent testEvent = new NewStandardEvent (EVENT883);

        final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentAmount", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PaymentPeriod", this));
        eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfFirstPayment", this));

        // Add the event
        myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);
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