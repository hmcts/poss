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
import uk.gov.dca.utils.screens.UC034WarrantsN326Utils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Warrants Notice of Issue N326 screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_WarrantsN326_Test extends AbstractCmTestBase
{
    
    /** The my UC 034 warrants N 326 utils. */
    // Private member variables for the screen utils
    private UC034WarrantsN326Utils myUC034WarrantsN326Utils;

    /**
     * Constructor.
     */
    public CaseManNumbering_WarrantsN326_Test ()
    {
        super (CaseManNumbering_WarrantsN326_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC034WarrantsN326Utils = new UC034WarrantsN326Utils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Warrants Notice of Issue N326 screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Warrants Notice of Issue N326 screen
            mLoginAndNavigateToScreen ();

            // Uncheck the All Warrants checkbox to enable the Case Number field
            myUC034WarrantsN326Utils.setAllWarrants (false);

            // Enter a 7 digit case number to ensure it is rejected
            myUC034WarrantsN326Utils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid", myUC034WarrantsN326Utils.isCaseNumberValid ());
            myUC034WarrantsN326Utils.setCaseNumberFocus ();
            mCheckStatusBarText (UC034WarrantsN326Utils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC034WarrantsN326Utils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC034WarrantsN326Utils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Warrants Notice of Issue N326 screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Warrants Notice of Issue N326 screen
            mLoginAndNavigateToScreen ();

            // Uncheck the All Warrants checkbox to enable the Case Number field
            myUC034WarrantsN326Utils.setAllWarrants (false);

            // Enter a 7 digit case number to ensure it is rejected
            myUC034WarrantsN326Utils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid", myUC034WarrantsN326Utils.isCaseNumberValid ());
            myUC034WarrantsN326Utils.setCaseNumberFocus ();
            mCheckStatusBarText (UC034WarrantsN326Utils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC034WarrantsN326Utils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC034WarrantsN326Utils.isCaseNumberValid ());
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
     * Private function that logs the user into CaseMan and navigates to the Warrants Notice of Issue N326 screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrants Notice of Issue N326 screen
        this.nav.navigateFromMainMenu (MAINMENU_N326_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC034WarrantsN326Utils.getScreenTitle ());
    }

}