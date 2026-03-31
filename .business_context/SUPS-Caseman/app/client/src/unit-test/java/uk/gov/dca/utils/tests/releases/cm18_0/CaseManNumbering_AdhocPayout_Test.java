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
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC067AdhocPayoutsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Record Adhoc Payouts screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_AdhocPayout_Test extends AbstractCmTestBase
{
    
    /** The my UC 067 adhoc payouts utils. */
    // Private member variables for the screen utils
    private UC067AdhocPayoutsUtils myUC067AdhocPayoutsUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_AdhocPayout_Test ()
    {
        super (CaseManNumbering_AdhocPayout_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC067AdhocPayoutsUtils = new UC067AdhocPayoutsUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Record Adhoc Payouts screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to CASE
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Enter a 7 digit case number to ensure it is rejected
            myUC067AdhocPayoutsUtils.setEnforcementNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
            mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001", "3NN00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Record Adhoc Payouts screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to CASE
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Enter a 7 digit case number to ensure it is rejected
            myUC067AdhocPayoutsUtils.setEnforcementNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
            mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001", "3NN00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Record Adhoc Payouts screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to HOME WARRANT
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA", "Q123456", "QZ12345"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
                myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Record Adhoc Payouts screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to HOME WARRANT
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA", "Q123456", "QZ12345"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
                myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Record Adhoc Payouts screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to FOREIGN WARRANT
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
                myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "FWA00001", "1A000002"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Record Adhoc Payouts screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Record Adhoc Payouts screen
            mLoginAndNavigateToScreen ();

            // Set Enforcement Type to FOREIGN WARRANT
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
                myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "FWA00001", "1A000002"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
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
     * Private function that logs the user into CaseMan and navigates to the Record Adhoc Payouts screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Record Adhoc Payouts screen
        this.nav.navigateFromMainMenu (MAINMENU_ADHOC_PAYOUT_PATH);

        // Handle Suitor's Cash Start of Day
        myUC067AdhocPayoutsUtils.handleStartOfDayProcess ();

        // Check in correct screen
        mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());

        // Check in correct screen
        mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());
    }

}