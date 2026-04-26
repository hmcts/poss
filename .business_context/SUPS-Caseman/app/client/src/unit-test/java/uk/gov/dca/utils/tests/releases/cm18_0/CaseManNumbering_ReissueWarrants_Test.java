/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Reissue Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_ReissueWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 031 reissue warrant utils. */
    // Private member variables for the screen utils
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_ReissueWarrants_Test ()
    {
        super (CaseManNumbering_ReissueWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Reissue Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC031ReissueWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isCaseNumberValid ());
            myUC031ReissueWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC031ReissueWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC031ReissueWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Reissue Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC031ReissueWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC031ReissueWarrantUtils.isCaseNumberValid ());
            myUC031ReissueWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC031ReissueWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC031ReissueWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Reissue Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC031ReissueWarrantUtils.isWarrantNumberValid ());
                myUC031ReissueWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC031ReissueWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC031ReissueWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC031ReissueWarrantUtils.isWarrantNumberValid ());
                myUC031ReissueWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Reissue Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC031ReissueWarrantUtils.isWarrantNumberValid ());
                myUC031ReissueWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC031ReissueWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC031ReissueWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC031ReissueWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC031ReissueWarrantUtils.isWarrantNumberValid ());
                myUC031ReissueWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to reissue a warrant before the new numbering scheme comes into effect.
     */
    public void testReissueWarrantPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC031ReissueWarrantUtils.setCaseNumber ("3NN00002");
            myUC031ReissueWarrantUtils.clickSearchButton ();

            // Set the Warrant Details fields
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100.00");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100.00");

            final String alertString = myUC031ReissueWarrantUtils.saveAndReturnAlertString ();
            final String warrantNumber = alertString.substring (alertString.length () - 9, alertString.length () - 1);

            final String year = DBUtil.getTwoDigitYear ();
            assertEquals ("00012/" + year, warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to reissue a warrant after the new numbering scheme comes into effect.
     */
    public void testReissueWarrantPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Reissue Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC031ReissueWarrantUtils.setCaseNumber ("3NN00002");
            myUC031ReissueWarrantUtils.clickSearchButton ();

            // Set the Warrant Details fields
            myUC031ReissueWarrantUtils.setBalanceOfDebt ("100.00");
            myUC031ReissueWarrantUtils.setAmountOfWarrant ("100.00");

            final String alertString = myUC031ReissueWarrantUtils.saveAndReturnAlertString ();
            final String warrantNumber = alertString.substring (alertString.length () - 9, alertString.length () - 1);

            final String year = DBUtil.getTwoDigitYear ();
            assertEquals ("00001/" + year, warrantNumber);
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
     * Private function that logs the user into CaseMan and navigates to the Reissue Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Reissue Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_REISSUE_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC031ReissueWarrantUtils.getScreenTitle ());
    }

}