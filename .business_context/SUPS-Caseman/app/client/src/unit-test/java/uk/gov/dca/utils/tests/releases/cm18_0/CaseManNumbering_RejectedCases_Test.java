/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9911 $
 * $Author: vincentcp $
 * $Date: 2013-07-04 08:26:54 +0100 (Thu, 04 Jul 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.CCBCUC008RejectedCasesUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the View Rejected Cases screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_RejectedCases_Test extends AbstractCmTestBase
{
    
    /** The my CCBCUC 008 rejected cases utils. */
    // Private member variables for the screen utils
    private CCBCUC008RejectedCasesUtils myCCBCUC008RejectedCasesUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_RejectedCases_Test ()
    {
        super (CaseManNumbering_RejectedCases_Test.class.getName ());
        this.nav = new Navigator (this);
        myCCBCUC008RejectedCasesUtils = new CCBCUC008RejectedCasesUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the View Rejected Cases screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to View Rejected Cases screen
            mLoginAndNavigateToScreen ();

            // Enter invalid case numbers to ensure the screen rejects them
            final String[] invalidCaseArray = {"NN/00001", "@"};
            for (int i = 0, l = invalidCaseArray.length; i < l; i++)
            {
                myCCBCUC008RejectedCasesUtils.setCaseNumber (invalidCaseArray[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC008RejectedCasesUtils.isCaseNumberValid ());
                myCCBCUC008RejectedCasesUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC008RejectedCasesUtils.ERR_MSG_INVALID_CASE_NUMBER);
            }

            // Enter valid case numbers to ensure the screen accepts them
            final String[] validCaseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "3NN0001"};
            for (int i = 0, l = validCaseArray.length; i < l; i++)
            {
                myCCBCUC008RejectedCasesUtils.setCaseNumber (validCaseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myCCBCUC008RejectedCasesUtils.isCaseNumberValid ());
            }

            // Close Screen
            myCCBCUC008RejectedCasesUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the View Rejected Cases screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to View Rejected Cases screen
            mLoginAndNavigateToScreen ();

            // Enter invalid case numbers to ensure the screen rejects them
            final String[] invalidCaseArray = {"NN/00001", "@"};
            for (int i = 0, l = invalidCaseArray.length; i < l; i++)
            {
                myCCBCUC008RejectedCasesUtils.setCaseNumber (invalidCaseArray[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC008RejectedCasesUtils.isCaseNumberValid ());
                myCCBCUC008RejectedCasesUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC008RejectedCasesUtils.ERR_MSG_INVALID_CASE_NUMBER);
            }

            // Enter valid case numbers to ensure the screen accepts them
            final String[] validCaseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "3NN0001"};
            for (int i = 0, l = validCaseArray.length; i < l; i++)
            {
                myCCBCUC008RejectedCasesUtils.setCaseNumber (validCaseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myCCBCUC008RejectedCasesUtils.isCaseNumberValid ());
            }

            // Close Screen
            myCCBCUC008RejectedCasesUtils.closeScreen ();
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

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the View Rejected Cases screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

        // Navigate to the View Rejected Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_REJECTED_CASES_PATH);

        // Check in correct screen
        mCheckPageTitle (myCCBCUC008RejectedCasesUtils.getScreenTitle ());
    }

}