/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 12205 $
 * $Author: grewalg $
 * $Date: 2016-01-07 15:34:20 +0000 (Thu, 07 Jan 2016) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.central_ae;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC102AECalculatePERUtils;
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.screens.UC126MaintainPERDetailsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests to test the amount allowed editable flag and how it should
 * allow certain codes to be amount editable.
 *
 * @author Guy Grewal
 */
public class CaseMan_Trac5721_Test extends AbstractCmTestBase
{
    
    /** The my UC 102 AE calculate PER utils. */
    // Private member variables for the screen utils
    private UC102AECalculatePERUtils myUC102AECalculatePERUtils;
    
    /** The my UC 116 CO event utils. */
    private UC116COEventUtils myUC116COEventUtils;
    
    /** The my UC 126 maintain PER details utils. */
    private UC126MaintainPERDetailsUtils myUC126MaintainPERDetailsUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "9NN00001";
    
    /** The CO number 1. */
    private String CONumber1 = "150001NN";

    /**
     * Constructor.
     */
    public CaseMan_Trac5721_Test ()
    {
        super (CaseMan_Trac5721_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC102AECalculatePERUtils = new UC102AECalculatePERUtils (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
        myUC126MaintainPERDetailsUtils = new UC126MaintainPERDetailsUtils (this);
    }

    /**
     * Tests that the amount corresponding to the code with the amount allowed
     * editable flag set to 'N' is displayed as read-only for the AE screen.
     */
    public void testNonEditableAmountAllowedAE ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            loginAndLoadCase (caseNumber1);

            // navigate to PER Calculator screen
            myUC102AECalculatePERUtils.selectPERCalculator ();

            // Go through each tabs - starting with default Personal Allowances
            // page

            // Personal Allowances
            String code;
            // Click on the 'Add' button
            code = "ACOMM";
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PERSONAL_ALLOWANCES ());
            // Search for code 'ACOMM' in the popup grid and select it
            myUC102AECalculatePERUtils.selectCodeFromLOV (code,
                    myUC102AECalculatePERUtils.getPOPUP_LOV_PERSONAL_ALLOWANCE ());
            // Assert the amount allowed field is read-only
            assertFalse ("Amount Allowed should not be read-only",
                    myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // Press Add button.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PERSONAL_ALLOWANCES ());
            // Search for code 'ALO18' in the popup grid and select it
            code = "ALO18";
            myUC102AECalculatePERUtils.selectCodeFromLOV (code,
                    myUC102AECalculatePERUtils.getPOPUP_LOV_PERSONAL_ALLOWANCE ());
            // Assert the amount allowed field is not read-only
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // Re-visit the two added codes
            myUC102AECalculatePERUtils
                    .openPopUpFromGrid (myUC102AECalculatePERUtils.getCALCULATE_PER_PERSONAL_ALLOWANCE_GRID (), code);
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());
            code = "ACOMM";
            myUC102AECalculatePERUtils
                    .openPopUpFromGrid (myUC102AECalculatePERUtils.getCALCULATE_PER_PERSONAL_ALLOWANCE_GRID (), code);
            assertFalse ("Amount Allowed shouldn't be read-only",
                    myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // select Premiums Page (default tab is Personal Allowances)
            myUC102AECalculatePERUtils.selectTabbedPage (UC102AECalculatePERUtils.TABBED_PAGE_PREMIUMS);
            // Click on the 'Add' button
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PREMIUMS ());
            // Search for code 'BBSEV' in the popup grid and select it
            myUC102AECalculatePERUtils.selectCodeFromLOV ("BBSEV", myUC102AECalculatePERUtils.getPOPUP_LOV_PREMIUMS ());
            // Assert the amount allowed field is not read-only
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_CANCEL ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the amount corresponding to the code with the amount allowed
     * editable flag set to 'N' is displayed as read-only for the CO screen.
     */
    public void testNonEditableAmountAllowedCO ()
    {
        try
        {
            // Log into SUPS CaseMan and load CO on CO Events screen
            loginAndLoadCO (CONumber1);

            // Navigate to the PER Calculator screen
            this.nav.selectQuicklinksMenuItem (UC116COEventUtils.QUICKLINK_PER_CALCULATOR);

            // Go through each tabs - starting with default Personal Allowances
            // page

            // Personal Allowances
            String code;
            // Click on the 'Add' button
            code = "ACOMM";
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PERSONAL_ALLOWANCES ());
            // Search for code 'ACOMM' in the popup grid and select it
            myUC102AECalculatePERUtils.selectCodeFromLOV (code,
                    myUC102AECalculatePERUtils.getPOPUP_LOV_PERSONAL_ALLOWANCE ());
            // Assert the amount allowed field is read-only
            assertFalse ("Amount Allowed should not be read-only",
                    myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // Press Add button.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PERSONAL_ALLOWANCES ());
            // Search for code 'ALO18' in the popup grid and select it
            code = "ALO18";
            myUC102AECalculatePERUtils.selectCodeFromLOV (code,
                    myUC102AECalculatePERUtils.getPOPUP_LOV_PERSONAL_ALLOWANCE ());
            // Assert the amount allowed field is not read-only
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // Re-visit the two added codes
            myUC102AECalculatePERUtils
                    .openPopUpFromGrid (myUC102AECalculatePERUtils.getCALCULATE_PER_PERSONAL_ALLOWANCE_GRID (), code);
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());
            code = "ACOMM";
            myUC102AECalculatePERUtils
                    .openPopUpFromGrid (myUC102AECalculatePERUtils.getCALCULATE_PER_PERSONAL_ALLOWANCE_GRID (), code);
            assertFalse ("Amount Allowed shouldn't be read-only",
                    myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_OK ());

            // select Premiums Page (default tab is Personal Allowances)
            myUC102AECalculatePERUtils.selectTabbedPage (UC102AECalculatePERUtils.TABBED_PAGE_PREMIUMS);
            // Click on the 'Add' button
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_ADD_PREMIUMS ());
            // Search for code 'BBSEV' in the popup grid and select it
            myUC102AECalculatePERUtils.selectCodeFromLOV ("BBSEV", myUC102AECalculatePERUtils.getPOPUP_LOV_PREMIUMS ());
            // Assert the amount allowed field is not read-only
            assertTrue ("Amount Allowed should be read-only", myUC102AECalculatePERUtils.isAmountAllowedReadOnly ());
            // Exit pop-up.
            myUC102AECalculatePERUtils.pressButton (myUC102AECalculatePERUtils.getBTN_CANCEL ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }

    }

    /**
     * Tests that the Amount Allowed Editable field in the Maintain PER Details screen is
     * displayed as read-only.
     */
    public void testMaintainPerDetails ()
    {
        try
        {
            // First delete any previous records which may have been created from a previous run
            DBUtil.deletePerDetail ("AC999");
            DBUtil.deletePerDetail ("ZM999");
            DBUtil.deleteSystemData ("AC999");
            DBUtil.deleteSystemData ("ZM999");

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, ROLE_HELPDESK);

            // Navigate to the Maintain PER Details screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PER_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC126MaintainPERDetailsUtils.getScreenTitle ());

            // Load up PER Details for codes beginning with 'A'
            myUC126MaintainPERDetailsUtils.loadPERDetails ("A");

            // Check that the Amount Allowed Editable field is read-only
            assertTrue ("Amount Allowed should be read-only",
                    myUC126MaintainPERDetailsUtils.isAmountAllowedEditableReadOnly (false));

            myUC126MaintainPERDetailsUtils.clearScreen ();

            // Load the Add PER Detail Pop up
            myUC126MaintainPERDetailsUtils.clickAddPerDetailButton ();
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailDetailCode ("AC999");

            // In the Add PER Detail pop up, ensure the Amount Allowed Editable field
            // is editable once a detail code is entered
            assertFalse ("Amount Allowed should not be read-only",
                    myUC126MaintainPERDetailsUtils.isAmountAllowedEditableReadOnly (true));
            // Set values in fields and save
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailPerGroup ("A");
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailPrompt ("This is test 1");
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailAmountAllowedEditable (true);
            myUC126MaintainPERDetailsUtils.clickPopupSaveButton ();
            myUC126MaintainPERDetailsUtils.clickSaveButton ();
            myUC126MaintainPERDetailsUtils.clearScreen ();

            // Add another PER_DETAIL
            myUC126MaintainPERDetailsUtils.clickAddPerDetailButton ();
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailDetailCode ("ZM999");

            // Set values in fields and save
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailPerGroup ("A");
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailPrompt ("This is test 2");
            myUC126MaintainPERDetailsUtils.setPopupAddNewPerDetailAmountAllowedEditable (false);
            myUC126MaintainPERDetailsUtils.clickPopupSaveButton ();
            myUC126MaintainPERDetailsUtils.clickSaveButton ();
            myUC126MaintainPERDetailsUtils.clearScreen ();
            myUC126MaintainPERDetailsUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber            The case number to load
     */
    private void loginAndLoadCase (final String caseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC102AECalculatePERUtils.getScreenTitle ());

        // Search by Case Number
        myUC102AECalculatePERUtils.loadCaseByCaseNumber (caseNumber);
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param CONumber the CO number
     */
    private void loginAndLoadCO (final String CONumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

        // Search by Case Number
        myUC116COEventUtils.loadCOByCONumber (CONumber);
    }

    /**
     * Private function which checks the current screen title against the
     * expected screen title.
     *
     * @param control            The expected screen title
     */
    private void mCheckPageTitle (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getPageTitle ().indexOf (control) != -1);
    }

}