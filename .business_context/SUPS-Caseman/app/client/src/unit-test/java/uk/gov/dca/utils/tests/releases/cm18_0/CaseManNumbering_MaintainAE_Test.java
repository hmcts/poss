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
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Maintain AE screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_MaintainAE_Test extends AbstractCmTestBase
{
    
    /** The my UC 091 create update AE utils. */
    // Private member variables for the screen utils
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_MaintainAE_Test ()
    {
        super (CaseManNumbering_MaintainAE_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain AE screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Maintain AE screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC091CreateUpdateAEUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC091CreateUpdateAEUtils.isCaseNumberValid ());
            myUC091CreateUpdateAEUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC091CreateUpdateAEUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC091CreateUpdateAEUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC091CreateUpdateAEUtils.isCaseNumberValid ());

                myUC091CreateUpdateAEUtils.clearScreen ();
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain AE screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Maintain AE screen
            mLoginAndNavigateToScreen ();

            // Enter a 7 digit case number to ensure it is rejected
            myUC091CreateUpdateAEUtils.setCaseNumber ("3NN0001");
            assertFalse ("Case Number is valid when should be invalid",
                    myUC091CreateUpdateAEUtils.isCaseNumberValid ());
            myUC091CreateUpdateAEUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC091CreateUpdateAEUtils.ERR_MSG_INVALID_CASE_NUMBER);

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC091CreateUpdateAEUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid",
                        myUC091CreateUpdateAEUtils.isCaseNumberValid ());

                myUC091CreateUpdateAEUtils.clearScreen ();
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
     * Private function that logs the user into CaseMan and navigates to the Maintain AE screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Maintain AE screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());
    }

}