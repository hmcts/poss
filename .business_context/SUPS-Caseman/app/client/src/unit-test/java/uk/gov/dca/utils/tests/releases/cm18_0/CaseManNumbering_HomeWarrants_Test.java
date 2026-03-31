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
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Create Home Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_HomeWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_HomeWarrants_Test ()
    {
        super (CaseManNumbering_HomeWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Create Home Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC029CreateHomeWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            myUC029CreateHomeWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC029CreateHomeWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Enter a MAGS ORDER case number to ensure it is rejected
            myUC029CreateHomeWarrantUtils.setCaseNumber ("NN/00001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            myUC029CreateHomeWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC029CreateHomeWarrantUtils.ERR_MSG_MAGS_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC029CreateHomeWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Create Home Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC029CreateHomeWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            myUC029CreateHomeWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC029CreateHomeWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Enter a MAGS ORDER case number to ensure it is rejected
            myUC029CreateHomeWarrantUtils.setCaseNumber ("NN/00001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            myUC029CreateHomeWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC029CreateHomeWarrantUtils.ERR_MSG_MAGS_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC029CreateHomeWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC029CreateHomeWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record of type EXECUTION before the new numbering scheme
     * comes into effect.
     */
    public void testCreateExecutionHomeWarrantPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber ("3NN00001");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new foreign warrant record of type EXECUTION before the new numbering scheme
     * comes into effect.
     */
    public void testCreateExecutionForeignWarrantPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber ("3NN00001");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Set Executing Court to Coventry (180) to create a foreign warrant
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180");

            // Retrieve warrant number and check that the Warrant number is the expected next number from the
            // Northampton HOME SYSTEM_DATA item
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);

            // Retrieve local warrant number and check that the local warrant number is the expected next number from
            // the
            // Coventry FOREIGN SYSTEM_DATA item
            final String localNumber = DBUtil.getWarrantLocalNumber ("3NN00001", enforcementLetter + "0000094", "180");
            assertEquals ("FW" + enforcementLetter + "00045", localNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record of type EXECUTION after the new numbering scheme
     * comes into effect.
     */
    public void testCreateExecutionHomeWarrantPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (1999999);

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber ("A01NN001");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            // Check that the Warrant number is the expected next number from the Database sequence
            assertEquals ("1C999999", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new foreign warrant record of type EXECUTION after the new numbering scheme
     * comes into effect.
     */
    public void testCreateExecutionForeignWarrantPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (2000000);

            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber ("A01NN001");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Set Executing Court to Coventry (180) to create a foreign warrant
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180");

            // Retrieve warrant number and check that it is the expected next number from the Database sequence
            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();
            assertEquals ("1D000000", warrantNumber);

            // Retrieve local warrant number and check that the local warrant number is the same value as the warrant
            // number
            final String localNumber = DBUtil.getWarrantLocalNumber ("A01NN001", "1D000000", "180");
            assertEquals ("1D000000", localNumber);
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
     * Private function that logs the user into CaseMan and navigates to the Create Home Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create Home Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());
    }

}