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

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests the BMS Changes in the Family Enforcement Changes.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_AeEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // Family Enforcement Case with MN AE
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // Family Enforcement Case with JD AE
    
    private String famEnfCase3 = "3NN00031";	// Family Enforcement Case with PM AE
    
    private String ccCase = "3NN00003";			// County Court case with MN AE
    private String chCase = "3NN00011";			// Chancery case with JD AE
    private String qbCase = "3NN00021";			// Queens Bench case with PM AE

    /** The fam enf case 1 AE. */
    // AE Numbers associated with the cases above
    private String famEnfCase1_AE = "AA000001";
    
    /** The fam enf case 2 AE. */
    private String famEnfCase2_AE = "AA000003";
    
    private String famEnfCase3_AE = "AA000007";
    
    /** The cc case AE. */
    private String ccCase_AE = "AA000004";
    
    /** The ch case AE. */
    private String chCase_AE = "AA000005";
    
    /** The qb case AE. */
    private String qbCase_AE = "AA000006";

    /**
     * Constructor.
     */
    public RFS4813_6_AeEvent_Test ()
    {
        super (RFS4813_6_AeEvent_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }
    
    /**
     * Tests the BMS generated from AE Event 100 on Family and Civil cases
     */
    public void testAEEvent100()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 100 
            final NewStandardEvent testEvent = new NewStandardEvent("100-AE");
            testEvent.setNavigateObligations(true);
            testEvent.setEventDetails("JUDGMENT CREDITOR");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Salutation", this));

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA011", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "100"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN72", DBUtil.getBMSForAEEvent(ccCase_AE, "100"));
            myUC092AEEventUtils.closeScreen();    
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }

    /**
     * Tests the BMS generated from AE Event 105 on Family and Civil cases
     */
    public void testAEEvent105()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 105
            final NewStandardEvent testEvent = new NewStandardEvent("105-AE");
            testEvent.setNavigateObligations(true);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Salutation", this));

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA011", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "105"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN72", DBUtil.getBMSForAEEvent(ccCase_AE, "105"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 120 on Family and Civil cases
     */
    public void testAEEvent120()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 120
            final NewStandardEvent testEvent = new NewStandardEvent("120-AE");

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA012", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"120"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN71", DBUtil.getBMSForAEEvent(ccCase_AE, "120"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 122 on Family and Civil cases
     */
    public void testAEEvent122()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 122
            final NewStandardEvent testEvent = new NewStandardEvent("122");

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA012", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "122"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN71", DBUtil.getBMSForAEEvent(ccCase_AE, "122"));
            myUC092AEEventUtils.closeScreen(); 
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }

    /**
     * Tests the BMS generated from AE Event 125 on Family and Civil cases
     */
    public void testAEEvent125()
    {
        try
        {          
            // Log into SUPS CaseMan and load a civil case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("125");
            
            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA012", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "125"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN71", DBUtil.getBMSForAEEvent(ccCase_AE, "125"));
            myUC092AEEventUtils.closeScreen(); 
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 126 on Family and Civil cases
     */
    public void testAEEvent126()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 126
            final NewStandardEvent testEvent = new NewStandardEvent("126");
            testEvent.setNavigateObligations(true);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Salutation", this));

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA011", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "126"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN72", DBUtil.getBMSForAEEvent(ccCase_AE, "126"));
            myUC092AEEventUtils.closeScreen();      
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }

    /**
     * Tests the BMS generated from AE Event 332 on Family and Civil cases
     */
    public void testAEEvent332()
    {
        try
        {
            // Log into SUPS CaseMan and load a family case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 332
            final NewStandardEvent testEvent = new NewStandardEvent("332-AE");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));

            // Add the event and check BMS before closing
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA006", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "332"));

            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH12", DBUtil.getBMSForAEEvent(ccCase_AE, "332"));
            myUC092AEEventUtils.closeScreen();     
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 851 is created on a Family Enforcement Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent851_Family ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (famEnfCase1);

            // Create AE Event 851 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent ("851");
            testEvent.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IsDebtorMaleOrFemale", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrder", this));
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("MA038", DBUtil.getBMSForAEEvent (famEnfCase1_AE, "851"));

            // Create AE Event 851 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent ("851");
            testEvent2.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent (testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals ("MA008", DBUtil.getBMSForAEEvent (famEnfCase1_AE, "851"));

            // Create AE Event 851 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent ("851");
            testEvent3.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails ("Test");
            myUC092AEEventUtils.addNewEvent (testEvent3, eventQuestions);

            // Check case event BMS
            assertEquals ("MA008", DBUtil.getBMSForAEEvent (famEnfCase1_AE, "851"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 851 is created on a Civil Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent851_Civil ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (ccCase);

            // Create AE Event 851 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent ("851");
            testEvent.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IsDebtorMaleOrFemale", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrder", this));
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("EN30", DBUtil.getBMSForAEEvent (ccCase_AE, "851"));

            // Create AE Event 851 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent ("851");
            testEvent2.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent (testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals ("IS6", DBUtil.getBMSForAEEvent (ccCase_AE, "851"));

            // Create AE Event 851 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent ("851");
            testEvent3.setIssueStage (UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus (UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails ("Test");
            myUC092AEEventUtils.addNewEvent (testEvent3, eventQuestions);

            // Check case event BMS
            assertEquals ("IS6", DBUtil.getBMSForAEEvent (ccCase_AE, "851"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }
    
    /**
     * Tests that when AE Event 852 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent852_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 851 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("852");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA039", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"852"));
            
            // Create AE Event 851 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("852");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"852"));
            
            // Create AE Event 851 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("852");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"852"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 852 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent852_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 851 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("852");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN32", DBUtil.getBMSForAEEvent(ccCase_AE,"852"));
            
            // Create AE Event 851 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("852");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"852"));
            
            // Create AE Event 851 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("852");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("EN32", DBUtil.getBMSForAEEvent(ccCase_AE,"852"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 853 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent853_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 851 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("853-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA040", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"853"));
            
            // Create AE Event 851 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("853-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"853"));
            
            // Create AE Event 851 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("853-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"853"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 853 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent853_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 853 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("853-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN36", DBUtil.getBMSForAEEvent(ccCase_AE,"853"));
            
            // Create AE Event 853 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("853-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"853"));
            
            // Create AE Event 853 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("853-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE,"853"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 854 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent854_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 854 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("854");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA039", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"854"));
            
            // Create AE Event 854 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("854");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"854"));
            
            // Create AE Event 854 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("854");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"854"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 854 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent854_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 854 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("854");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN32", DBUtil.getBMSForAEEvent(ccCase_AE,"854"));
            
            // Create AE Event 854 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("854");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"854"));
            
            // Create AE Event 854 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("854");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"854"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 855 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
	 */
    public void testAEEvent855_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 855 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("855-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
			final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);

            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA041", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"855"));
            
            // Create AE Event 855 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("855-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"855"));
            
            // Create AE Event 855 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("855-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"855"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 855 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
	 */
    public void testAEEvent855_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 855 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("855-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
			final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);

            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN35", DBUtil.getBMSForAEEvent(ccCase_AE,"855"));
            
            // Create AE Event 855 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("855-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"855"));
            
            // Create AE Event 855 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("855-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"855"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 856 on Family and Civil cases
     */
    public void testAEEvent856()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 856
            final NewStandardEvent testEvent = new NewStandardEvent("856");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PrisonName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("EnterTheLengthOfCommittal", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("ItemDetails", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "856"));
            assertEquals("MA021", DBUtil.getCaseEventBMS(famEnfCase1, "458"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE, "856"));
            assertEquals("EN15", DBUtil.getCaseEventBMS(ccCase, "458"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 857 on Family and Civil cases
     */
    public void testAEEvent857()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 857
            final NewStandardEvent testEvent = new NewStandardEvent("857");

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA042", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "857"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN56", DBUtil.getBMSForAEEvent(ccCase_AE, "857"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 860 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent860_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 860 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("860-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("EnterTheLengthOfCommittal", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("EnterTheResponsePeriodAllowed", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA041", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"860"));
            
            // Create AE Event 860 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("860-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"860"));
            
            // Create AE Event 860 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("860-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"860"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 860 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent860_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 860 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("860-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("EnterTheLengthOfCommittal", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("EnterTheResponsePeriodAllowed", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN35", DBUtil.getBMSForAEEvent(ccCase_AE,"860"));
            
            // Create AE Event 860 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("860-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"860"));
            
            // Create AE Event 860 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("860-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE,"860"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 861 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent861_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 861 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("861");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA043", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"861"));
            
            // Create AE Event 861 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("861");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"861"));
            
            // Create AE Event 861 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("861");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"861"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 861 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent861_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 861 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("861");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN31", DBUtil.getBMSForAEEvent(ccCase_AE,"861"));
            
            // Create AE Event 861 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("861");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"861"));
            
            // Create AE Event 861 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("861");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"861"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 862 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent862_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 862 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("862");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
            final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);
            
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA044", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"862"));
            
            // Create AE Event 862 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("862");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"862"));
            
            // Create AE Event 862 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("862");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"862"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 862 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent862_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 862 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("862");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
            final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);
            
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN34", DBUtil.getBMSForAEEvent(ccCase_AE,"862"));
            
            // Create AE Event 862 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("862");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"862"));
            
            // Create AE Event 862 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("862");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"862"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 863 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent863_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 863 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("863");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
            final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);
            
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA041", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"863"));
            
            // Create AE Event 863 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("863");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"863"));
            
            // Create AE Event 863 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("863");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA009", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"863"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 863 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent863_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 863 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("863");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
            final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);
            
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN35", DBUtil.getBMSForAEEvent(ccCase_AE,"863"));
            
            // Create AE Event 863 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("863");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"863"));
            
            // Create AE Event 863 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("863");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"863"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 864 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent864_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 863 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("864");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("MaximumFine", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA045", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"864"));
            
            // Create AE Event 864 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("864");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"864"));
            
            // Create AE Event 864 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("864");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"864"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 864 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent864_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 864 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("864");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("MaximumFine", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN58", DBUtil.getBMSForAEEvent(ccCase_AE,"864"));
            
            // Create AE Event 864 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("864");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"864"));
            
            // Create AE Event 864 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("864");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE,"864"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 865 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent865_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 865 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("865");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PrisonName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOffenceDetails", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOrderDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA046", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"865"));
            
            // Create AE Event 865 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("865");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"865"));
            
            // Create AE Event 865 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("865");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"865"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 865 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent865_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 865 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("865");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PrisonName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOffenceDetails", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOrderDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN59", DBUtil.getBMSForAEEvent(ccCase_AE,"865"));
            
            // Create AE Event 865 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("865");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"865"));
            
            // Create AE Event 865 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("865");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE,"865"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 872 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent872_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 872 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("872");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsEmployeeMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA047", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"872"));
            
            // Create AE Event 872 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("872");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"872"));
            
            // Create AE Event 872 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("872");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"872"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 872 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent872_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 872 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("872");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsEmployeeMaleOrFemale", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN37", DBUtil.getBMSForAEEvent(ccCase_AE,"872"));
            
            // Create AE Event 872 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("872");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"872"));
            
            // Create AE Event 872 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("872");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(ccCase_AE,"872"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 873 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent873_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 873 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("873");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("MaximumFine", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA045", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"873"));
            
            // Create AE Event 873 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("873");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"873"));
            
            // Create AE Event 873 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("873");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("NONE", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"873"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 873 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent873_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 873 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("873");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("IsDebtorMaleOrFemale", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("MaximumFine", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN58", DBUtil.getBMSForAEEvent(ccCase_AE,"873"));
            
            // Create AE Event 873 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("873");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"873"));
            
            // Create AE Event 873 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("873");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS8", DBUtil.getBMSForAEEvent(ccCase_AE,"873"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 876 on Family and Civil cases
     */
    public void testAEEvent876()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 876
            final NewStandardEvent testEvent = new NewStandardEvent("876");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("ThisCourtToExecute", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("AmountOfFineToRecover", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA014", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "876"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN1", DBUtil.getBMSForAEEvent(ccCase_AE, "876"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 877 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent877_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 877 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("877-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PrisonName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOffenceDetails", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOrderDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA046", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"877"));
            
            // Create AE Event 877 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("877-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"877"));
            
            // Create AE Event 877 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("877-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"877"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 877 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent877_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 877 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("877-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PrisonName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOffenceDetails", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SelectOrderDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA046", DBUtil.getBMSForAEEvent(ccCase_AE,"877"));
            
            // Create AE Event 877 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("877-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(ccCase_AE,"877"));
            
            // Create AE Event 877 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("877-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(ccCase_AE,"877"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 880 on Family and Civil cases
     */
    public void testAEEvent880()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase2);

            // Create AE Event 880
            final NewStandardEvent testEvent = new NewStandardEvent("880");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA048", DBUtil.getBMSForAEEvent(famEnfCase2_AE, "880"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(chCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN57", DBUtil.getBMSForAEEvent(chCase_AE, "880"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 881 on Family and Civil cases
     */
    public void testAEEvent881()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 881
            final NewStandardEvent testEvent = new NewStandardEvent("881");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA049", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "881"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN38", DBUtil.getBMSForAEEvent(ccCase_AE, "881"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 882 on Family and Civil cases
     */
    public void testAEEvent882()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase3);

            // Create AE Event 882
            final NewStandardEvent testEvent = new NewStandardEvent("882");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA049", DBUtil.getBMSForAEEvent(famEnfCase3_AE, "882"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(qbCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN38", DBUtil.getBMSForAEEvent(qbCase_AE, "882"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 883 on Family and Civil cases
     */
    public void testAEEvent883()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 883
            final NewStandardEvent testEvent = new NewStandardEvent("883");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("InstalmentAmount", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PaymentPeriod", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfFirstPayment", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA050", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "883"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN63", DBUtil.getBMSForAEEvent(ccCase_AE, "883"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 884 on Family and Civil cases
     */
    public void testAEEvent884()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 884
            final NewStandardEvent testEvent = new NewStandardEvent("884");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("InstalmentAmount", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PaymentPeriod", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfFirstPayment", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA051", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "884"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN64", DBUtil.getBMSForAEEvent(ccCase_AE, "884"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 889 on Family and Civil cases
     */
    public void testAEEvent889()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 889
            final NewStandardEvent testEvent = new NewStandardEvent("889");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA007", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "889"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH32", DBUtil.getBMSForAEEvent(ccCase_AE, "889"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 890 on Family and Civil cases
     */
    public void testAEEvent890()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 890
            final NewStandardEvent testEvent = new NewStandardEvent("890");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA007", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "890"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH32", DBUtil.getBMSForAEEvent(ccCase_AE, "890"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 892 on Family and Civil cases
     */
    public void testAEEvent892()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 890
            final NewStandardEvent testEvent = new NewStandardEvent("892");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Salutation", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("N39HearingDate", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA004", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "892"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH11", DBUtil.getBMSForAEEvent(ccCase_AE, "892"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 893 on Family and Civil cases
     */
    public void testAEEvent893()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 893
            final NewStandardEvent testEvent = new NewStandardEvent("893");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PersonSwearingAffidavit", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateSworn", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("OrderText", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA006", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "893"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH12", DBUtil.getBMSForAEEvent(ccCase_AE, "893"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 894 on Family and Civil cases
     */
    public void testAEEvent894()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 894
            final NewStandardEvent testEvent = new NewStandardEvent("894");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA006", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "894"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH12", DBUtil.getBMSForAEEvent(ccCase_AE, "894"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 895 on Family and Civil cases
	 */
    public void testAEEvent895()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 895
            final NewStandardEvent testEvent = new NewStandardEvent("895");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            
			final VariableDataQuestion vdQ1 = new VariableDataQuestion("SelectTheLastHearingUsingLOVButton",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ1);
            final VariableDataQuestion vdQ2 = new VariableDataQuestion("SelectHearingGrid",
                    VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    "282",
                    1,
                    this);	// Grid
            eventQuestions.add(vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion("SelectHearing_OKBtn",
                    VariableDataQuestion.VD_FIELD_TYPE_BUTTON,
                    this);  // Button
            eventQuestions.add(vdQ3);

            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("TimeOfHearing", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAtThisOfficeAddress", this));

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA006", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "895"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH12", DBUtil.getBMSForAEEvent(ccCase_AE, "895"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 896 is created on a Family Enforcement Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent896_Family()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 896 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("896-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfOrder", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("AmountOfFine", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PaymentDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("MA041", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"896"));
            
            // Create AE Event 896 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("896-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"896"));
            
            // Create AE Event 896 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("896-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("MA008", DBUtil.getBMSForAEEvent(famEnfCase1_AE,"896"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests that when AE Event 896 is created on a Civil Case, the correct BMS 
     * is allocated to the automatic case event
     */
    public void testAEEvent896_Civil()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(ccCase);

            // Create AE Event 896 with status of ISSUED
            final NewStandardEvent testEvent = new NewStandardEvent("896-AE");
            testEvent.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_ISSUE);
            testEvent.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeTitle", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("JudgeName", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("Hearing2AtThisOfficeAddress", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("HearingAttendees", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DateOfOrder", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("AmountOfFine", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PaymentDetails", this));
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);

            // Check case event BMS
            assertEquals("EN35", DBUtil.getBMSForAEEvent(ccCase_AE,"896"));
            
            // Create AE Event 896 with status of REISSUED
            final NewStandardEvent testEvent2 = new NewStandardEvent("896-AE");
            testEvent2.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_REISSUE);
            testEvent2.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            myUC092AEEventUtils.addNewEvent(testEvent2, eventQuestions);

            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"896"));
            
            // Create AE Event 896 with status of SUBSTITUTED SERVICE
            final NewStandardEvent testEvent3 = new NewStandardEvent("896-AE");
            testEvent3.setIssueStage(UC092AEEventUtils.ISSUE_STAGE_SUBSERVICE);
            testEvent3.setServiceStatus(UC092AEEventUtils.SERVICE_STATUS_BAILIFF);
            testEvent3.setEventDetails("Test");
            myUC092AEEventUtils.addNewEvent(testEvent3, eventQuestions);
            
            // Check case event BMS
            assertEquals("IS6", DBUtil.getBMSForAEEvent(ccCase_AE,"896"));
            myUC092AEEventUtils.closeScreen();
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 897 on Family and Civil cases
     */
    public void testAEEvent897()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase2);

            // Create AE Event 897
            final NewStandardEvent testEvent = new NewStandardEvent("897");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA048", DBUtil.getBMSForAEEvent(famEnfCase2_AE, "897"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(chCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN57", DBUtil.getBMSForAEEvent(chCase_AE, "897"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 898 on Family and Civil cases
     */
    public void testAEEvent898()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase1);

            // Create AE Event 898
            final NewStandardEvent testEvent = new NewStandardEvent("898");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA049", DBUtil.getBMSForAEEvent(famEnfCase1_AE, "898"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(ccCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN38", DBUtil.getBMSForAEEvent(ccCase_AE, "898"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS generated from AE Event 899 on Family and Civil cases
     */
    public void testAEEvent899()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE(famEnfCase3);

            // Create AE Event 899
            final NewStandardEvent testEvent = new NewStandardEvent("899");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();

            // Add the event and check the BMS
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA049", DBUtil.getBMSForAEEvent(famEnfCase3_AE, "899"));
            
            // Clear the screen down and recreate the AE Event on a civil case then check BMS
            myUC092AEEventUtils.clearScreen();
            myUC092AEEventUtils.loadAEByCaseNumber(qbCase);
            myUC092AEEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("EN38", DBUtil.getBMSForAEEvent(qbCase_AE, "899"));
            myUC092AEEventUtils.closeScreen();  
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
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

}