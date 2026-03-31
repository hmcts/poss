/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mistryn $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC120MaintainCourtDataUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 4591. This covers a change to the Maintain Court
 * Data screen to include a Default Printer field and a popup to allow a helpdesk user to
 * alter the Court Name
 *
 * @author Chris Vincent
 */
public class CaseManTrac4591_Test extends AbstractCmTestBase
{
    
    /** The my UC 120 maintain court data utils. */
    // Private member variables for the screen utils
    private UC120MaintainCourtDataUtils myUC120MaintainCourtDataUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4591_Test ()
    {
        super (CaseManTrac4591_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC120MaintainCourtDataUtils = new UC120MaintainCourtDataUtils (this);
    }

    /**
     * Tests enablement rules of the Default Printer and LOV Button when first
     * enter the screen before a Court is loaded and then following a Court creation
     * when the FAP Id will be null.
     */
    public void testCourtDefaultPrinter1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Physically delete court 888 as about to be created
            DBUtil.deleteCourtData ("888");

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check Default Printer fields are disabled when first enter the screen
            assertFalse ("Default Printer enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterEnabled ());
            assertFalse ("Default Printer LOV Button enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterLOVEnabled ());

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");
            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Check Default Printer fields are disabled as newly created Court will have no FAP
            assertFalse ("Default Printer enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterEnabled ());
            assertFalse ("Default Printer LOV Button enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterLOVEnabled ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests enablement of the Default Printer and LOV Button when a court with a FAP is loaded.
     * Also tests setting the field via the LOV Subform and typing directly into field, tests
     * the commit saves the changes and also validation rules on the Default Printer field.
     */
    public void testCourtDefaultPrinter2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Load a Court
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Check Default Printer fields are disabled when first enter the screen
            assertTrue ("Default Printer disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterEnabled ());
            assertTrue ("Default Printer LOV Button disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterLOVEnabled ());

            // Test setting the field via the LOV Subform works
            myUC120MaintainCourtDataUtils.setDefaultPrinterUsingLOV ("CSP00PDF");
            assertEquals (myUC120MaintainCourtDataUtils.getDefaultPrinter (), "CSP00PDF");

            // Save changes, reload and check value has been updated
            myUC120MaintainCourtDataUtils.clickSaveButton ();
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();
            assertEquals (myUC120MaintainCourtDataUtils.getDefaultPrinter (), "CSP00PDF");

            // Enter an invalid value
            myUC120MaintainCourtDataUtils.setDefaultPrinter ("TEST");
            assertFalse ("Default Printer is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterValid ());

            // Set field via autocomplete field directly
            myUC120MaintainCourtDataUtils.setDefaultPrinter ("CSPXEROX");
            assertTrue ("Default Printer is invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isDefaultPrinterValid ());

            // Save changes, reload and check value has been updated
            myUC120MaintainCourtDataUtils.clickSaveButton ();
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();
            assertEquals (myUC120MaintainCourtDataUtils.getDefaultPrinter (), "CSPXEROX");

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a non helpdesk user cannot access the Change Court Name Subform.
     */
    public void testChangeCourtNameNonHelpdeskUser ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check Change Court Name button is disabled
            assertFalse ("Change Court Name button is enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameButtonEnabled ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the validation around entry into the Change Court Name subform.
     */
    public void testChangeCourtNameValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check Change Court Name button is enabled
            assertTrue ("Change Court Name button is disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameButtonEnabled ());

            // Click the Change Court Name button when no court loaded
            myUC120MaintainCourtDataUtils.clickChangeCourtNameButton ();

            // Check subform is not visible and the appropriate error message is displayed in the status bar
            assertFalse ("Change Court Name popup is visible when should be hidden",
                    myUC120MaintainCourtDataUtils.isChangeCourtNamePopupVisible ());
            mCheckStatusBarText ("A court must be retrieved the name can be changed.");

            // Load a court
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Make a change to a field and attempt to get into the popup again
            myUC120MaintainCourtDataUtils.setOpenFrom ("00:01");
            myUC120MaintainCourtDataUtils.clickChangeCourtNameButton ();
            final String alertMessage = this.getAlertString ();
            assertEquals (alertMessage, "Please save changes before proceeding.");
            assertFalse ("Change Court Name popup is visible when should be hidden",
                    myUC120MaintainCourtDataUtils.isChangeCourtNamePopupVisible ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the validation within the Change Court Name subform.
     */
    public void testChangeCourtNameSubform ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Load a court and open popup
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();
            myUC120MaintainCourtDataUtils.clickChangeCourtNameButton ();
            assertTrue ("Change Court Name popup is hidden when should be visible",
                    myUC120MaintainCourtDataUtils.isChangeCourtNamePopupVisible ());

            // Check field is mandatory
            assertTrue ("New Name field is optional when should be mandatory",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameMandatory ());

            // Check New Name cannot be equal to the current name
            myUC120MaintainCourtDataUtils.setChangeNameCourtName ("NORTHAMPTON");
            myUC120MaintainCourtDataUtils.setFocusOnChangeNameCourtName ();
            assertFalse ("New Name field is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameValid ());
            assertEquals (myUC120MaintainCourtDataUtils.getChangeCourtNameStatusBarText (),
                    "The court name must be different to the previous value.");

            // Check New Name cannot be the same as another court name
            myUC120MaintainCourtDataUtils.setChangeNameCourtName ("BIRMINGHAM");
            myUC120MaintainCourtDataUtils.setFocusOnChangeNameCourtName ();
            assertFalse ("New Name field is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameValid ());
            assertEquals (myUC120MaintainCourtDataUtils.getChangeCourtNameStatusBarText (),
                    "The court name entered is already in use.");

            // Set the New Name to a new unique value
            myUC120MaintainCourtDataUtils.setChangeNameCourtName ("BERLIN");
            assertTrue ("New Name field is invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isChangeNameCourtNameValid ());

            // Click ok in the subform to commit changes
            myUC120MaintainCourtDataUtils.changeNameSubformClickOk ();
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("282");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Check court name has been updated
            assertEquals (myUC120MaintainCourtDataUtils.getCourtName (), "BERLIN");

            // Change grouping court and check that has been updated as well (proof that refdata has been reloaded)
            myUC120MaintainCourtDataUtils.setGroupingCourtCode ("282");
            assertEquals (myUC120MaintainCourtDataUtils.getGroupingCourtName (), "BERLIN");

            // Finally set the Court Name back to the original value
            myUC120MaintainCourtDataUtils.clickSaveButton ();
            myUC120MaintainCourtDataUtils.clickChangeCourtNameButton ();
            myUC120MaintainCourtDataUtils.setChangeNameCourtName ("NORTHAMPTON");
            myUC120MaintainCourtDataUtils.changeNameSubformClickOk ();
            myUC120MaintainCourtDataUtils.clickClearButton ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
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
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }
}