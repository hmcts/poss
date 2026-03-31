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
import uk.gov.dca.utils.screens.CCBCUC025RejectedWarrantsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the View Rejected Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_RejectedWarrants_Test extends AbstractCmTestBase
{
    
    /** The my CCBCUC 025 rejected warrants utils. */
    // Private member variables for the screen utils
    private CCBCUC025RejectedWarrantsUtils myCCBCUC025RejectedWarrantsUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_RejectedWarrants_Test ()
    {
        super (CaseManNumbering_RejectedWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myCCBCUC025RejectedWarrantsUtils = new CCBCUC025RejectedWarrantsUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the View Rejected Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to View Rejected Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid case numbers to ensure the screen rejects them
            final String[] invalidCaseArray = {"NN/00001", "@"};
            for (int i = 0, l = invalidCaseArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (invalidCaseArray[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_CASE_NUMBER);
            }

            // Enter invalid case numbers (wrong length) to ensure the screen rejects them
            final String[] invalidCaseArray2 = {"3NN0001", "1"};
            for (int i = 0, l = invalidCaseArray2.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (invalidCaseArray2[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_CASE_LENGTH);
            }

            // Enter valid case numbers to ensure the screen accepts them
            final String[] validCaseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = validCaseArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (validCaseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
            }

            // Close Screen
            myCCBCUC025RejectedWarrantsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the View Rejected Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to View Rejected Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid case numbers to ensure the screen rejects them
            final String[] invalidCaseArray = {"NN/00001", "@"};
            for (int i = 0, l = invalidCaseArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (invalidCaseArray[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_CASE_NUMBER);
            }

            // Enter invalid case numbers (wrong length) to ensure the screen rejects them
            final String[] invalidCaseArray2 = {"3NN0001", "1"};
            for (int i = 0, l = invalidCaseArray2.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (invalidCaseArray2[i]);
                assertFalse ("Case Number is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setCaseNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_CASE_LENGTH);
            }

            // Enter valid case numbers to ensure the screen accepts them
            final String[] validCaseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = validCaseArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setCaseNumber (validCaseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myCCBCUC025RejectedWarrantsUtils.isCaseNumberValid ());
            }

            // Close Screen
            myCCBCUC025RejectedWarrantsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the View Rejected Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to View Rejected Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid Warrant numbers to ensure the screen rejects them
            final String[] invalidWarrantArray = {"00001/13", "@"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
            }

            // Enter invalid warrant numbers (wrong length) to ensure the screen rejects them
            final String[] invalidWarrantArray2 = {"A", "12345"};
            for (int i = 0, l = invalidWarrantArray2.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (invalidWarrantArray2[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray2[i] + " is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_WARRANT_LENGTH);
            }

            // Enter valid warrant numbers to ensure the screen accepts them
            final String[] validWarrantArray = {"B0000001", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + "is invalid when should be valid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
            }

            // Close Screen
            myCCBCUC025RejectedWarrantsUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the View Rejected Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to View Rejected Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid Warrant numbers to ensure the screen rejects them
            final String[] invalidWarrantArray = {"00001/13", "@"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
            }

            // Enter invalid warrant numbers (wrong length) to ensure the screen rejects them
            final String[] invalidWarrantArray2 = {"A", "12345"};
            for (int i = 0, l = invalidWarrantArray2.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (invalidWarrantArray2[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray2[i] + " is valid when should be invalid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (CCBCUC025RejectedWarrantsUtils.ERR_MSG_INVALID_WARRANT_LENGTH);
            }

            // Enter valid warrant numbers to ensure the screen accepts them
            final String[] validWarrantArray = {"B0000001", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myCCBCUC025RejectedWarrantsUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myCCBCUC025RejectedWarrantsUtils.isWarrantNumberValid ());
            }

            // Close Screen
            myCCBCUC025RejectedWarrantsUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan and navigates to the View Rejected Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

        // Navigate to the View Rejected Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_REJECTED_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myCCBCUC025RejectedWarrantsUtils.getScreenTitle ());
    }

}