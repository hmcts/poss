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
 * Automated tests for output changes required for family enforcement.
 *
 * @author Chris Vincent
 */
public class RFS4813_8_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // Family enforcement case with Maintenance AE
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // Family enforcement case with Priority Maintenance AE
    
    /** The cc case. */
    private String ccCase = "3NN00003"; // Civil case with Priority Maintenance AE
    
    /** The ch case. */
    private String chCase = "3NN00011"; // Civil case with Judgment Debt AE
    
    /** The qb case. */
    private String qbCase = "3NN00021"; // Civil case with Maintenance AE

    /** The fam enf case 1 AE. */
    // AE Numbers associated with the cases above
    private String famEnfCase1_AE = "AA000001";
    
    /** The fam enf case 2 AE. */
    private String famEnfCase2_AE = "AA000003";
    
    /** The cc case AE. */
    private String ccCase_AE = "AA000004";
    
    /** The qb case AE. */
    private String qbCase_AE = "AA000006";

    /**
     * Constructor.
     */
    public RFS4813_8_Test ()
    {
        super (RFS4813_8_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
    }

    /**
     * Tests that when AE Event 841 is created on a Family Enforcement Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent841_Family ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (famEnfCase1);

            // Create AE Event 841
            final NewStandardEvent testEvent = new NewStandardEvent ("841");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("MA049", DBUtil.getBMSForAEEvent (famEnfCase1_AE, "841"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 841 is created on a Civil Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent841_Civil ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (qbCase);

            // Create AE Event 841
            final NewStandardEvent testEvent = new NewStandardEvent ("841");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("EN38", DBUtil.getBMSForAEEvent (qbCase_AE, "841"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 842 is created on a Family Enforcement Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent842_Family ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (famEnfCase2);

            // Create AE Event 841
            final NewStandardEvent testEvent = new NewStandardEvent ("842");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("MA049", DBUtil.getBMSForAEEvent (famEnfCase2_AE, "842"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 842 is created on a Civil Case, the correct BMS
     * is allocated to the automatic case event.
     */
    public void testAEEvent842_Civil ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (ccCase);

            // Create AE Event 842
            final NewStandardEvent testEvent = new NewStandardEvent ("842");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            myUC092AEEventUtils.addNewEvent (testEvent, eventQuestions);

            // Check case event BMS
            assertEquals ("EN38", DBUtil.getBMSForAEEvent (ccCase_AE, "842"));
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when AE Event 841 and 842 are created on a Judgment Debt AE, the correct
     * error message is displayed.
     */
    public void testAEEventValidation ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on AE Events screen
            mLoginAndLoadAE (chCase);

            // Check that 841 cannot be created and has the correct error message
            myUC092AEEventUtils.openAddEventPopup ("841");
            mCheckStatusBarText (UC092AEEventUtils.ERR_MSG_MN_EVENT_ONLY);

            // Check that 842 cannot be created and has the correct error message
            myUC092AEEventUtils.openAddEventPopup ("842");
            mCheckStatusBarText (UC092AEEventUtils.ERR_MSG_PM_EVENT_ONLY);
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

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status bar message is not equal to '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
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