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
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to Create & Update Case Details screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_ManageCase_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_ManageCase_Test ()
    {
        super (CaseManNumbering_ManageCase_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Case Creation screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            // Enter new case number in new format which should be rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A01NN003");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE1);

            // Try other new formats to ensure they are rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("001NN002");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE1);

            myUC001CreateUpdateCaseUtils.setCaseNumber ("A01B01A1");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE1);

            // Enter a 7 digit case number to ensure it is rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_EXISTINGCASE);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC001CreateUpdateCaseUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC001CreateUpdateCaseUtils.isCaseNumberValid ());

                myUC001CreateUpdateCaseUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Case Creation screen
     * POST the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            // Enter new case number in old format which should be rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("3NN00005");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE2);

            // Try the other old format to ensure they are rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("NN000002");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE2);

            // Enter new case number in new format, but using invalid first character which should be rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("I01NN003");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE2);

            // Enter new case number in new format, but using invalid first character which should be rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("O01NN003");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE2);

            // Enter new case number in new PCOL/MCOL format which should be rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A01B01A1");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_NEWCASE2);

            // Enter a 7 digit case number to ensure it is rejected
            myUC001CreateUpdateCaseUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isCaseNumberValid ());
            myUC001CreateUpdateCaseUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC001CreateUpdateCaseUtils.ERR_INVALID_EXISTINGCASE);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC001CreateUpdateCaseUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC001CreateUpdateCaseUtils.isCaseNumberValid ());

                myUC001CreateUpdateCaseUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that MAGS ORDER Cases can be created prior to the new numbering scheme coming into place.
     */
    public void testCreateMAGSCasePreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            // Create a default MAGS ORDER case
            myUC001CreateUpdateCaseUtils.createMAGSCase ("NN/00002");

            // Check it exists in the database
            assertTrue ("Case has not been created", checkCaseCreated ("NN/00002"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Cases can be created using the correct formats prior to the new numbering scheme.
     */
    public void testCreateNewCasePreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            final String[] caseArray = {"3NN00005", "NN000002"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                // Create Case
                myUC001CreateUpdateCaseUtils.createDefaultCase (caseArray[i]);

                // Check it exists in the database
                assertTrue ("Case " + caseArray[i] + " has not been created", checkCaseCreated (caseArray[i]));
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that MAGS ORDER Cases can be created after the new numbering scheme coming into place.
     */
    public void testCreateMAGSCasePostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            // Create a default MAGS ORDER case
            myUC001CreateUpdateCaseUtils.createMAGSCase ("NN/00002");

            // Check it exists in the database
            assertTrue ("Case has not been created", checkCaseCreated ("NN/00002"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that Cases can be created using the correct formats after the new numbering scheme.
     */
    public void testCreateNewCasePostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Cases screen
            mLoginAndNavigateToCasesScreen ();

            final String[] caseArray = {"B01NN001", "001NN100"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                // Create Case
                myUC001CreateUpdateCaseUtils.createDefaultCase (caseArray[i]);

                // Check it exists in the database
                assertTrue ("Case " + caseArray[i] + " has not been created", checkCaseCreated (caseArray[i]));
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
     * Private function that logs the user into CaseMan and navigates to the Case Creation screen.
     */
    private void mLoginAndNavigateToCasesScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());
    }

    /**
     * Checks that the new case record has been created on the database.
     *
     * @param pCaseNumber The case number to check
     * @return True if a case has been created, else false
     */
    private boolean checkCaseCreated (final String pCaseNumber)
    {
        final String query =
                "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM cases WHERE " + "case_number = '" + pCaseNumber + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}