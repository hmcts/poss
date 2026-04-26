/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11618 $
 * $Author: vincentcp $
 * $Date: 2015-02-12 15:31:32 +0000 (Thu, 12 Feb 2015) $
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
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the BIF Item 27 regarding applications to set aside and the setting
 * of JUDGMENT_REFERENCE and MCOL_REFERENCE on the MCOL_DATA table.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem27_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case number 1. */
    // Test cases with no judgments
    private String caseNumber1 = "3NN00002"; // CCBC owned MCOL case

    /** The case number 2. */
    // Test cases with no applications to set aside
    private String caseNumber2 = "3NN00032"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00035"; // CCBC owned CCBC case

    /** The case number 4. */
    // Test cases with applications to set aside to be completed
    private String caseNumber4 = "3NN00012"; // CCBC owned MCOL case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00015"; // CCBC owned CCBC case

    /** The event 160. */
    // Event codes
    private String EVENT_160 = "160";
    
    /** The event 170. */
    private String EVENT_170 = "170";
    
    /** The event 230. */
    private String EVENT_230 = "230";

    /** The mcol code1. */
    // MCOL codes
    private String MCOL_CODE1 = "X1";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "X0";
    
    /** The mcol code3. */
    private String MCOL_CODE3 = "XG";
    
    /** The mcol code4. */
    private String MCOL_CODE4 = "XR";
    
    /** The mcol code5. */
    private String MCOL_CODE5 = "JE";

    /**
     * Constructor.
     */
    public CM_BIFItem27_Test ()
    {
        super (CM_BIFItem27_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Tests that when an application to set aside is created on a Judgment created by CaseMan that the
     * JUDGMENT_REFERENCE and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAside_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE2, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE2, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a Judgment sent by MCOL that the JUDGMENT_REFERENCE
     * and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAside_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber3, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
            assertEquals ("MC100000001", DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE1, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE1, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
            assertEquals ("MC100000001", DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE2, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE2, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside created by CaseMan is set to GRANTED that the JUDGMENT_REFERENCE
     * and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAsideResultGranted_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber4, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE3));
            assertEquals ("CJ100008", DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE3, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE3, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE4));
            assertEquals ("CJ100008", DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE4, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE4, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside sent by MCOL is set to GRANTED that the JUDGMENT_REFERENCE and
     * MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAsideResultGranted_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber5, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE3));
            assertEquals ("MC100000003", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE3, "JUDGMENT_REFERENCE"));
            assertEquals ("MC500000001", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE3, "MCOL_REFERENCE"));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE4));
            assertEquals ("MC100000003", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE4, "JUDGMENT_REFERENCE"));
            assertEquals ("MC500000001", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE4, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside on a Judgment created by CaseMan is created in CaseMan and
     * immediately
     * granted that the JUDGMENT_REFERENCE and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAside_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT NAME");

            // Create application set aside and set result immediately
            createApplicationToSetAsideWithResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE3, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE3, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside on a Judgment sent by MCOL is created in CaseMan and immediately
     * granted that the JUDGMENT_REFERENCE and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAside_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber3, "DEFENDANT NAME");

            // Create application set aside and set result immediately
            createApplicationToSetAsideWithResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));
            assertEquals ("MC100000001", DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE1, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE1, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);
            assertEquals ("MC100000001", DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE3, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber3, MCOL_CODE3, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside created by CaseMan is set to REFUSED that the JUDGMENT_REFERENCE
     * and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAsideResultRefused_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber4, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
            assertEquals ("CJ100008", DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE2, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber4, MCOL_CODE2, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside sent from MCOL is set to REFUSED that the JUDGMENT_REFERENCE
     * and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAsideResultRefused_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber5, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
            assertEquals ("MC100000003", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE2, "JUDGMENT_REFERENCE"));
            assertEquals ("MC500000001", DBUtil.getMCOLDATAColumnValue (caseNumber5, MCOL_CODE2, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created and immediately set to REFUSED that the JUDGMENT_REFERENCE
     * and MCOL_REFERENCE MCOL_DATA columns are populated correctly.
     */
    public void testNewAppSetAsideResultRefused_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT NAME");

            // Create application set aside and set result immediately
            createApplicationToSetAsideWithResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "JUDGMENT_REFERENCE"));
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE1, "MCOL_REFERENCE");
            assertEquals ("CE", mcolReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);
            assertEquals ("CJ100001", DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE2, "JUDGMENT_REFERENCE"));
            assertEquals (mcolReference, DBUtil.getMCOLDATAColumnValue (caseNumber2, MCOL_CODE2, "MCOL_REFERENCE"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a new judgment is entered in CaseMan that the JE MCOL_DATA event has a valid JUDGMENT_REFERENCE
     * and MCOL_REFERENCE.
     */
    public void testCreateJudgmentEvent_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // Create case event 230
            createCaseEvent230 ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE5));
            final String judgReference = DBUtil.getMCOLDATAColumnValue (caseNumber1, MCOL_CODE5, "JUDGMENT_REFERENCE");
            final String mcolReference = DBUtil.getMCOLDATAColumnValue (caseNumber1, MCOL_CODE5, "MCOL_REFERENCE");
            assertTrue ("Invalid Judgment Reference (" + judgReference + ")", judgReference.length () > 3);
            assertEquals ("CJ", judgReference.substring (0, 2));
            assertTrue ("Invalid MCOL Reference (" + mcolReference + ")", mcolReference.length () > 3);
            assertTrue ("Judgment Reference and MCOL Reference are not the same", judgReference.equals (mcolReference));
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
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     * @param judgmentAgainstPartyName The judgment against party name
     */
    private void loginAndLoadCaseJudgment (final String caseNumber, final String judgmentAgainstPartyName)
    {
        // Login and load Case
        loginAndLoadCase (caseNumber);

        // Navigate to the Judgments screen
        myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
        mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

        // Select appropriate judgment
        myUC004MaintainJudgmentUtils.selectPartyAgainstByName (judgmentAgainstPartyName);
    }

    /**
     * Private method to handle the creation of can application to set aside. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     */
    private void createApplicationToSetAside ()
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR);
        myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

        // Save and exit
        myUC004MaintainJudgmentUtils.clickSaveButton ();
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to handle the creation of can application to set aside and setting the result immediately.
     * After clicking Save, exits the Maintain Judgments screen and returns to the Case Events screen
     * 
     * @param result The result to set
     */
    private void createApplicationToSetAsideWithResult (final String result)
    {
        // Create new Application to Set Aside and set the result immediately
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR);
        myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();
        myUC004MaintainJudgmentUtils.setSetAsideResult (result);
        myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

        // Save and exit
        myUC004MaintainJudgmentUtils.clickSaveButton ();
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Sets the existing application to set aside result.
     *
     * @param result the new existing application to set aside result
     */
    private void setExistingApplicationToSetAsideResult (final String result)
    {
        // Set application to set aside result and result date
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideResult (result);
        myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();
        myUC004MaintainJudgmentUtils.clickSaveButton ();
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to handle the creation of case event 230.
     *
     * @throws Exception Exception thrown creating event
     */
    private void createCaseEvent230 () throws Exception
    {
        /**
         * Create Event 230
         * Enter Subject & Instigator (don't set so uses defaults)
         * Variable Data Screen (Word Processing Output)
         * No FCK Editor
         */
        final NewStandardEvent testEvent230 = new NewStandardEvent (EVENT_230);
        testEvent230.setProduceOutputFlag (true);

        // Setup any variable data screen questions
        final LinkedList<VariableDataQuestion> event230Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 =
                new VariableDataQuestion ("JudgmentAmount", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "100", this);
        event230Questions.add (vdQ1);

        final VariableDataQuestion vdQ2 =
                new VariableDataQuestion ("JudgmentForthwith", VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX, "Y", this);
        event230Questions.add (vdQ2);

        // Add the event
        myUC002CaseEventUtils.addNewEvent (testEvent230, event230Questions);
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