/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.outputs;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class JudgmentOutputTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /**
     * Constructor.
     */
    public JudgmentOutputTest ()
    {
        super (JudgmentOutputTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Generates CJR040A.
     */
    public void testCJR040A ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00033");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (false);
            myUC004MaintainJudgmentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR041A.
     */
    public void testCJR041A ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00034");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (false);
            myUC004MaintainJudgmentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR042A.
     */
    public void testCJR042A ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00035");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());
            myUC004MaintainJudgmentUtils.clickProduceJudgmentOrders (true);
            myUC004MaintainJudgmentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N35 (application to vary granted).
     */
    public void testN35 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00033");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Create application vary and exit Judgments screen
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, false);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N35A (application to vary determined).
     */
    public void testN35A ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00033");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Create application vary and exit Judgments screen
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, false);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_7_12_5.
     */
    public void testO_7_12_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00031");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Create application vary
            createApplicationToVary (false);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_3_1_2_5_1 and the N441A (Set Aside Granted).
     */
    public void testO_3_1_2_5_1_N441A ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00032");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Create application vary
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, false);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates the CCBC N441A (Certificate of Satisfaction).
     */
    public void testN441A_CCBC ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase ("3NN00011");

            // Navigate to the Judgments screen and create the judgment order from there
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Set Judgment to paid in full
            myUC004MaintainJudgmentUtils.setDatePaidInFull (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.setNotificationReceiptDate (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.clickSaveButton ();
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            final NewStandardEvent testEvent = new NewStandardEvent ("600");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<>();
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
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
     * Private method to set the result field on an existing application to vary. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     *
     * @param result The result to set
     * @param ccbcCase True if a CCBC case, else false
     */
    private void setExistingApplicationToVaryResult (final String result, final boolean ccbcCase)
    {
        final String response;
        // Set the Response value accordingly based on the result
        if (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED))
        {
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_ACCEPTED;
        }
        else
        {
            // Result = Referred to Judge, Determined or Refused
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_REFUSED;
        }

        // Set application to vary result and result date
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup ();
        myUC004MaintainJudgmentUtils.setAppVaryResult (result);
        myUC004MaintainJudgmentUtils.setAppVaryResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.setAppVaryResponse (response);
        myUC004MaintainJudgmentUtils.setAppVaryResponseDate (AbstractBaseUtils.now ());

        if (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED))
        {
            // Set Amount and Frequency fields too
            myUC004MaintainJudgmentUtils.setAppVaryAmount ("5");
            myUC004MaintainJudgmentUtils.setAppVaryFrequency (UC004MaintainJudgmentUtils.FREQUENCY_FORTNIGHTLY);
        }

        myUC004MaintainJudgmentUtils.clickAppVaryOkButton ();

        // Save and handle word processing then exit
        if ( !ccbcCase && (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED) ||
                result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED)))
        {
            // Non CCBC cases with result of GRANTED or IN ERROR so word processing screens to handle
            final boolean determined = result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED);
            myUC004MaintainJudgmentUtils.saveFollowingAppVaryResultSet (determined);
        }
        else
        {
            // No word processing screens to handle
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to handle the creation of can application to vary. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     * 
     * @param ccbcCase True if a CCBC case, else false
     */
    private void createApplicationToVary (final boolean ccbcCase)
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup ();
        myUC004MaintainJudgmentUtils.raiseAddNewAppVaryPopup ();
        myUC004MaintainJudgmentUtils.setAddAppVaryApplicant (UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST);
        myUC004MaintainJudgmentUtils.setAddAppVaryAmountOffered ("10");
        myUC004MaintainJudgmentUtils.setAddAppVaryFrequency (UC004MaintainJudgmentUtils.FREQUENCY_WEEKLY);
        myUC004MaintainJudgmentUtils.clickAddAppVaryPopupOkButton ();
        myUC004MaintainJudgmentUtils.clickAppVaryOkButton ();

        // Save and exit
        if (ccbcCase)
        {
            // No special behaviour for CCBC owned cases
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        else
        {
            // Handle word processing screens for non-CCBC cases
            myUC004MaintainJudgmentUtils.saveFollowingAppVary ();
        }
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to set the result field on an existing application to set aside. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     *
     * @param result The result to set
     * @param ccbcCase True if a CCBC case, else false
     */
    private void setExistingApplicationToSetAsideResult (final String result, final boolean ccbcCase)
    {
        // Set application to set aside result and result date
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideResult (result);
        myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

        // Save and handle word processing/obligations then exit
        if ( !ccbcCase && (result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED) ||
                result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR)))
        {
            // Non CCBC cases with result of GRANTED or IN ERROR so word processing screens to handle
            final boolean inerror = result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR);
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted (inerror);
        }
        else
        {
            // No word processing screens to handle
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
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