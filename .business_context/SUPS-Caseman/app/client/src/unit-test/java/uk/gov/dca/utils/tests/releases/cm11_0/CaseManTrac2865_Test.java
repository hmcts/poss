/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mistryn $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm11_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;

/**
 * Automated tests for the CaseMan Defect 2865.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2865_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case with coded party. */
    // Northampton Case
    private String caseWithCodedParty = "9NN00004";
    
    /** The case without coded party. */
    private String caseWithoutCodedParty = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac2865_Test ()
    {
        super (CaseManTrac2865_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);

    }

    /**
     * Tests that a Judgment Against a Coded Party can be set aside without an error message
     * being thrown.
     */
    public void testSetAsideJudgmentAgainstCodedParty ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which has a Judgment Against a Coded Party
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseWithCodedParty);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Raise the Application to Set Aside Popup and click Add to launch another popup
            myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
            myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();

            // Set the Applicant field on the Add Application to Set Aside Popup and Click Ok to close
            myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_CONSENT);
            myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();

            // Set the Result and Result Date fields on the Application to Set Aside Popup and Click Ok to Close
            myUC004MaintainJudgmentUtils.setSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);
            myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

            // Click the Save button
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted (false);

            // Exit the Maintain Judgments screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check in correct screen (now in Case Events)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // On the Case Events screen, ensure the Case Events have been created in the correct order and with correct
            // details
            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);
            assertEquals ("Row 1: Event Id is not the expected value", "600", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 1: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 1: Subject Type is not the expected value", "Claimant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 1: Subject Name is not the expected value", "NN LOCAL CODED PARTY 100 NAME",
                    myUC002CaseEventUtils.getSubjectName ());

            myUC002CaseEventUtils.selectCaseEventByRowNumber (2);
            assertEquals ("Row 2: Event Id is not the expected value", "170", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 2: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 2: Subject Type is not the expected value", "Claimant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 2: Subject Name is not the expected value", "NN LOCAL CODED PARTY 100 NAME",
                    myUC002CaseEventUtils.getSubjectName ());
            assertEquals ("Row 2: Applicant is not the expected value", "BY CONSENT",
                    myUC002CaseEventUtils.getApplicant ());
            assertEquals ("Row 2: Result is not the expected value", "GRANTED", myUC002CaseEventUtils.getResult ());

            myUC002CaseEventUtils.selectCaseEventByRowNumber (3);
            assertEquals ("Row 3: Event Id is not the expected value", "160", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 3: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 3: Subject Type is not the expected value", "Claimant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 3: Subject Name is not the expected value", "NN LOCAL CODED PARTY 100 NAME",
                    myUC002CaseEventUtils.getSubjectName ());
            assertEquals ("Row 3: Applicant is not the expected value", "BY CONSENT",
                    myUC002CaseEventUtils.getApplicant ());
            assertEquals ("Row 3: Result is not the expected value", "GRANTED", myUC002CaseEventUtils.getResult ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a Judgment Against a Coded Party can be set aside without an error message
     * being thrown.
     */
    public void testSetAsideJudgmentAgainstNonCodedParty ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which has a Judgment Against a Coded Party
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseWithoutCodedParty);

            // Navigate to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);

            // Check in Judgments screen
            mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

            // Raise the Application to Set Aside Popup and click Add to launch another popup
            myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
            myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();

            // Set the Applicant field on the Add Application to Set Aside Popup and Click Ok to close
            myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_CONSENT);
            myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();

            // Set the Result and Result Date fields on the Application to Set Aside Popup and Click Ok to Close
            myUC004MaintainJudgmentUtils.setSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);
            myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
            myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

            // Click the Save button
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted (false);

            // Exit the Maintain Judgments screen
            myUC004MaintainJudgmentUtils.closeScreen ();

            // Check in correct screen (now in Case Events)
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // On the Case Events screen, ensure the Case Events have been created in the correct order and with correct
            // details
            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);
            assertEquals ("Row 1: Event Id is not the expected value", "600", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 1: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 1: Subject Type is not the expected value", "Defendant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 1: Subject Name is not the expected value", "DEFENDANT ONE NAME",
                    myUC002CaseEventUtils.getSubjectName ());

            myUC002CaseEventUtils.selectCaseEventByRowNumber (2);
            assertEquals ("Row 2: Event Id is not the expected value", "170", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 2: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 2: Subject Type is not the expected value", "Defendant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 2: Subject Name is not the expected value", "DEFENDANT ONE NAME",
                    myUC002CaseEventUtils.getSubjectName ());
            assertEquals ("Row 2: Applicant is not the expected value", "BY CONSENT",
                    myUC002CaseEventUtils.getApplicant ());
            assertEquals ("Row 2: Result is not the expected value", "GRANTED", myUC002CaseEventUtils.getResult ());

            myUC002CaseEventUtils.selectCaseEventByRowNumber (3);
            assertEquals ("Row 3: Event Id is not the expected value", "160", myUC002CaseEventUtils.getEventId ());
            assertEquals ("Row 3: Subject No. is not the expected value", "1",
                    myUC002CaseEventUtils.getSubjectNumber ());
            assertEquals ("Row 3: Subject Type is not the expected value", "Defendant",
                    myUC002CaseEventUtils.getSubjectType ());
            assertEquals ("Row 3: Subject Name is not the expected value", "DEFENDANT ONE NAME",
                    myUC002CaseEventUtils.getSubjectName ());
            assertEquals ("Row 3: Applicant is not the expected value", "BY CONSENT",
                    myUC002CaseEventUtils.getApplicant ());
            assertEquals ("Row 3: Result is not the expected value", "GRANTED", myUC002CaseEventUtils.getResult ());
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

}