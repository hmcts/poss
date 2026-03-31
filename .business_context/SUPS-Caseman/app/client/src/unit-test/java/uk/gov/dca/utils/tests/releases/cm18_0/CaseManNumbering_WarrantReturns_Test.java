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
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Warrant Returns screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_WarrantReturns_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_WarrantReturns_Test ()
    {
        super (CaseManNumbering_WarrantReturns_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Warrant Returns screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC045WarrantReturnsUtils.isCaseNumberValid ());
            myUC045WarrantReturnsUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Warrant Returns screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC045WarrantReturnsUtils.isCaseNumberValid ());
            myUC045WarrantReturnsUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Warrant Returns screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC045WarrantReturnsUtils.isWarrantNumberValid ());
                myUC045WarrantReturnsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC045WarrantReturnsUtils.clearScreen ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isWarrantNumberValid ());
                myUC045WarrantReturnsUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Warrant Returns screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC045WarrantReturnsUtils.isWarrantNumberValid ());
                myUC045WarrantReturnsUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_WARRANT_NUMBER);
                myUC045WarrantReturnsUtils.clearScreen ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isWarrantNumberValid ());
                myUC045WarrantReturnsUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Warrant Returns screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setLocalNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC045WarrantReturnsUtils.isLocalNumberValid ());
                myUC045WarrantReturnsUtils.setLocalNumberFocus ();
                mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
                myUC045WarrantReturnsUtils.clearScreen ();
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001", "FWA00001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setLocalNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isLocalNumberValid ());
                myUC045WarrantReturnsUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Local Warrant Number field validation is as expected on the Warrant Returns screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testLocalWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Enter invalid local warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setLocalNumber (invalidWarrantArray[i]);
                assertFalse ("Local Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC045WarrantReturnsUtils.isLocalNumberValid ());
                myUC045WarrantReturnsUtils.setLocalNumberFocus ();
                mCheckStatusBarText (UC045WarrantReturnsUtils.ERR_MSG_INVALID_LCL_WARRANT_NUMBER);
                myUC045WarrantReturnsUtils.clearScreen ();
            }

            // Enter valid local warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001", "FWA00001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC045WarrantReturnsUtils.setLocalNumber (validWarrantArray[i]);
                assertTrue ("Local Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC045WarrantReturnsUtils.isLocalNumberValid ());
                myUC045WarrantReturnsUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a warrant return on an MCOL warrant before the new numbering
     * scheme comes into effect. Also checks that MCOL_DATA row written
     */
    public void testCreateWarrantReturnPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00003");
            myUC045WarrantReturnsUtils.setLocalNumber ("FWB00010");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

            assertTrue ("MCOL_DATA row not written", checkMCOLDATARowWritten ("3NN00003", "QA00001", "101"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a warrant return on an MCOL warrant after the new numbering
     * scheme comes into effect. Also checks that MCOL_DATA row written
     */
    public void testCreateWarrantReturnPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("A01B01A0");
            myUC045WarrantReturnsUtils.setLocalNumber ("0A000002");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

            assertTrue ("MCOL_DATA row not written", checkMCOLDATARowWritten ("A01B01A0", "0A000002", "101"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a warrant return on a Reissued MCOL warrant after the new numbering
     * scheme comes into effect. Also checks that MCOL_DATA row is NOT written
     */
    public void testReissueWarrantReturnPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber ("3NN00004");
            myUC045WarrantReturnsUtils.setWarrantNumber ("00001/13");
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

            assertFalse ("MCOL_DATA row written", checkMCOLDATARowWritten ("3NN00004", "00001/13", "101"));
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
     * Private function that logs the user into CaseMan and navigates to the Warrant Returns screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());
    }

    /**
     * Checks that an MCOL_DATA row has been written.
     *
     * @param pCaseNumber The case number to check
     * @param pWarrantNumber The warrant number to check
     * @param pReturnCode The return code to check
     * @return True if the MCOL_DATA row exists, else false
     */
    private boolean checkMCOLDATARowWritten (final String pCaseNumber, final String pWarrantNumber,
                                             final String pReturnCode)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM mcol_data WHERE " + "claim_number = '" +
                pCaseNumber + "' AND type = 'FR' AND warrant_number = '" + pWarrantNumber + "' AND return_code = '" +
                pReturnCode + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}