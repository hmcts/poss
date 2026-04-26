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
import uk.gov.dca.utils.screens.UC108CreateCOUtils;
import uk.gov.dca.utils.screens.UC108MaintainDebtUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to the Maintain CO screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_MaintainCO_Test extends AbstractCmTestBase
{
    
    /** The my UC 108 maintain debt utils. */
    // Private member variables for the screen utils
    private UC108MaintainDebtUtils myUC108MaintainDebtUtils;
    
    /** The my UC 108 create CO utils. */
    private UC108CreateCOUtils myUC108CreateCOUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_MaintainCO_Test ()
    {
        super (CaseManNumbering_MaintainCO_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC108MaintainDebtUtils = new UC108MaintainDebtUtils (this);
        myUC108CreateCOUtils = new UC108CreateCOUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain CO screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Maintain CO screen
            mLoginAndNavigateToScreen ();

            // Load CO record (CAEO)
            myUC108CreateCOUtils.setCONumber ("130002NN");

            // Navigate to Maintain Debts screen
            myUC108CreateCOUtils.clickMaintainDebtButton ();
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            // Open Add Debt popup to gain access to Case Number field
            myUC108MaintainDebtUtils.clickAddDebtButton ();
            myUC108MaintainDebtUtils.setAddDebtAmount ("1000");

            // Enter a 7 digit case number to ensure it is rejected
            myUC108MaintainDebtUtils.setAddDebtCaseNumber ("3NN0001", "CLAIMANT ONE NAME");
            assertFalse ("Case Number is valid when should be invalid", myUC108MaintainDebtUtils.isCaseNumberValid ());
            myUC108MaintainDebtUtils.setCaseNumberFocus ();
            assertEquals (UC108MaintainDebtUtils.ERR_MSG_INVALID_CASE_NUMBER,
                    myUC108MaintainDebtUtils.getAddDebtStatusBarText ());

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC108MaintainDebtUtils.setAddDebtCaseNumber (caseArray[i], "CLAIMANT ONE NAME");
                assertTrue ("Case Number is invalid when should be valid",
                        myUC108MaintainDebtUtils.isCaseNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Maintain CO screen
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the past
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Maintain CO screen
            mLoginAndNavigateToScreen ();

            // Load CO record (CAEO)
            myUC108CreateCOUtils.setCONumber ("130002NN");

            // Navigate to Maintain Debts screen
            myUC108CreateCOUtils.clickMaintainDebtButton ();
            mCheckPageTitle (myUC108MaintainDebtUtils.getScreenTitle ());

            // Open Add Debt popup to gain access to Case Number field
            myUC108MaintainDebtUtils.clickAddDebtButton ();
            myUC108MaintainDebtUtils.setAddDebtAmount ("1000");

            // Enter a 7 digit case number to ensure it is rejected
            myUC108MaintainDebtUtils.setAddDebtCaseNumber ("3NN0001", "CLAIMANT ONE NAME");
            assertFalse ("Case Number is valid when should be invalid", myUC108MaintainDebtUtils.isCaseNumberValid ());
            myUC108MaintainDebtUtils.setCaseNumberFocus ();
            assertEquals (UC108MaintainDebtUtils.ERR_MSG_INVALID_CASE_NUMBER,
                    myUC108MaintainDebtUtils.getAddDebtStatusBarText ());

            // Load existing cases to ensure they can be loaded
            final String[] caseArray =
                    {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0", "NN/00001"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC108MaintainDebtUtils.setAddDebtCaseNumber (caseArray[i], "CLAIMANT ONE NAME");
                assertTrue ("Case Number is invalid when should be valid",
                        myUC108MaintainDebtUtils.isCaseNumberValid ());
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
     * Private function that logs the user into CaseMan and navigates to the Maintain CO screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Maintain CO screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CO_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC108CreateCOUtils.getScreenTitle ());
    }

}