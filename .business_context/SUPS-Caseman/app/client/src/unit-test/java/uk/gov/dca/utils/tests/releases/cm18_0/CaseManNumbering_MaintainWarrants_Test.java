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
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Maintain/Query Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_MaintainWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_MaintainWarrants_Test ()
    {
        super (CaseManNumbering_MaintainWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain/Query Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC039MaintainWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isCaseNumberValid ());
            myUC039MaintainWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain/Query Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC039MaintainWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC039MaintainWarrantUtils.isCaseNumberValid ());
            myUC039MaintainWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Maintain/Query Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC039MaintainWarrantUtils.isWarrantNumberValid ());
                myUC039MaintainWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isWarrantNumberValid ());
                myUC039MaintainWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Maintain/Query Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC039MaintainWarrantUtils.isWarrantNumberValid ());
                myUC039MaintainWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isWarrantNumberValid ());
                myUC039MaintainWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Maintain/Query Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC039MaintainWarrantUtils.isLocalWarrantNumberValid ());
                myUC039MaintainWarrantUtils.setLocalWarrantNumberFocus ();
                mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001", "FWA00001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isLocalWarrantNumberValid ());
                myUC039MaintainWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Maintain/Query Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC039MaintainWarrantUtils.isLocalWarrantNumberValid ());
                myUC039MaintainWarrantUtils.setLocalWarrantNumberFocus ();
                mCheckStatusBarText (UC039MaintainWarrantUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
                myUC039MaintainWarrantUtils.clickClearButton ();
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001", "FWA00001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC039MaintainWarrantUtils.setLocalWarrantNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC039MaintainWarrantUtils.isLocalWarrantNumberValid ());
                myUC039MaintainWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to forward a warrant to a new court (creating a foreign warrant) before the new numbering
     * scheme comes into effect.
     */
    public void testForwardWarrantPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC039MaintainWarrantUtils.setCaseNumber ("001NN001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Change the executing court to forward the warrant and create a new foreign warrant
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Retrieve local warrant number and check that the local warrant number is the expected next number from
            // the
            // Coventry FOREIGN SYSTEM_DATA item
            final String localNumber = DBUtil.getWarrantLocalNumber ("001NN001", "1A000001", "180");
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals ("FW" + enforcementLetter + "00045", localNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to forward a warrant to a new court (creating a foreign warrant) after the new numbering
     * scheme comes into effect.
     */
    public void testForwardWarrantPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Maintain/Query Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC039MaintainWarrantUtils.setCaseNumber ("001NN001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Change the executing court to forward the warrant and create a new foreign warrant
            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Retrieve local warrant number and check that the local warrant number is the expected next number from
            // the
            // Coventry FOREIGN SYSTEM_DATA item
            final String localNumber = DBUtil.getWarrantLocalNumber ("001NN001", "1A000001", "180");
            assertEquals ("1A000001", localNumber);
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
     * Private function that logs the user into CaseMan and navigates to the Maintain/Query Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Maintain/Query Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());
    }

}