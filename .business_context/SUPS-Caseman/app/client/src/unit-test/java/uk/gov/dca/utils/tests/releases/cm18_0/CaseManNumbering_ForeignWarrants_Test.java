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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_ForeignWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 030 create foreign warrant utils. */
    // Private member variables for the screen utils
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_ForeignWarrants_Test ()
    {
        super (CaseManNumbering_ForeignWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC030CreateForeignWarrantUtils = new UC030CreateForeignWarrantUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Create Foreign Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC030CreateForeignWarrantUtils.isCaseNumberValid ());
            myUC030CreateForeignWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC030CreateForeignWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Create Foreign Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC030CreateForeignWarrantUtils.isCaseNumberValid ());
            myUC030CreateForeignWarrantUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC030CreateForeignWarrantUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Create Foreign Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA", "1A000001"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
                myUC030CreateForeignWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER1);
                myUC030CreateForeignWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
                myUC030CreateForeignWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number field validation is as expected on the Create Foreign Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter invalid warrant number values to ensure they are rejected
            final String[] invalidWarrantArray = {"123456", "FWA00001", "12345678", "AAAAAAAA"};
            for (int i = 0, l = invalidWarrantArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setWarrantNumber (invalidWarrantArray[i]);
                assertFalse ("Warrant Number " + invalidWarrantArray[i] + " is valid when should be invalid",
                        myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
                myUC030CreateForeignWarrantUtils.setWarrantNumberFocus ();
                mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_INVALID_WARRANT_NUMBER2);
                myUC030CreateForeignWarrantUtils.clickClearButton ();
            }

            // Enter valid warrant number values to ensure they are accepted
            final String[] validWarrantArray = {"B0000001", "00001/13", "Q123456", "QZ12345", "1A000001"};
            for (int i = 0, l = validWarrantArray.length; i < l; i++)
            {
                myUC030CreateForeignWarrantUtils.setWarrantNumber (validWarrantArray[i]);
                assertTrue ("Warrant Number " + validWarrantArray[i] + " is invalid when should be valid",
                        myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
                myUC030CreateForeignWarrantUtils.clickClearButton ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number exists validation is as expected on the Create Foreign Warrants screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testWarrantExistsValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter existing warrant number
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("QA00001");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Now add matching case number
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN00003");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Enter Case Number first this time
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN00004");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change warrant number to matching value
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("QA00002");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Warrant Number exists validation is as expected on the Create Foreign Warrants screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testWarrantExistsValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter existing warrant number
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("0A000002");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Now add matching case number
            myUC030CreateForeignWarrantUtils.setCaseNumber ("A01B01A0");

            // Warrant number field should now be invalid
            assertFalse ("Warrant Number is valid when should be invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
            myUC030CreateForeignWarrantUtils.setWarrantNumberFocus ();
            mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_WARRANT_EXISTS);

            // Enter Case Number first this time
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN00003");

            // Check warrant number accepted
            assertTrue ("Warrant Number is invalid when should be valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change warrant number to matching value
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("QA00001");

            // Warrant number field should now be invalid
            assertFalse ("Warrant Number is valid when should be invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());
            myUC030CreateForeignWarrantUtils.setWarrantNumberFocus ();
            mCheckStatusBarText (UC030CreateForeignWarrantUtils.ERR_MSG_WARRANT_EXISTS);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a foreign warrant before the new numbering scheme comes into effect.
     */
    public void testCreateForeignWarrantPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("127");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3BM00001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("B0000001");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create new Foreign Warrant and check the correct warrant number is generated
            final String warrantNumber = myUC030CreateForeignWarrantUtils.saveAndReturnWarrantNumber ();
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals ("FW" + enforcementLetter + "00038", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a foreign warrant after the new numbering scheme comes into effect.
     */
    public void testCreateForeignWarrantPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("127");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("A01BM001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("1H001234");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create new Foreign Warrant and check the correct warrant number is generated
            final String warrantNumber = myUC030CreateForeignWarrantUtils.saveAndReturnWarrantNumber ();
            assertEquals ("1H001234", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a foreign warrant after the new numbering scheme comes into effect with a 7 digit
     * warrant number.
     */
    public void testCreateForeignWarrantPostChange2 ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("335");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("A01BM001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("QZ12345");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create new Foreign Warrant and check the correct warrant number is generated
            final String warrantNumber = myUC030CreateForeignWarrantUtils.saveAndReturnWarrantNumber ();
            assertEquals ("QZ12345", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a foreign warrant after the new numbering scheme comes into effect with a reissued
     * warrant number.
     */
    public void testCreateForeignWarrantPostChange3 ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("127");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("A01BM001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("00001/12");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create new Foreign Warrant and check the correct warrant number is generated
            final String warrantNumber = myUC030CreateForeignWarrantUtils.saveAndReturnWarrantNumber ();
            assertEquals ("00001/12", warrantNumber);
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
     * Private function that logs the user into CaseMan and navigates to the Create Foreign Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create Foreign Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());
    }

}