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

package uk.gov.dca.utils.tests.releases.cm19_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Create Home Warrants screen.
 *
 * @author Chris Vincent
 */
public class TCE_HomeWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The case control. */
    // Case numbers to use
    private String caseControl = "A04NN009";
    
    /** The case possession. */
    private String casePossession = "A04NN010";
    
    /** The case delivery. */
    private String caseDelivery = "A04NN011";
    
    /** The case committal. */
    private String caseCommittal = "A04NN012";

    /**
     * Constructor.
     */
    public TCE_HomeWarrants_Test ()
    {
        super (TCE_HomeWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a CONTROL warrant
     * following the TCE changes.
     */
    public void testControlHomeWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to CONTROL
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseControl);
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup

            // Test that the Balance of Debt and Amount of Warrant fields are mandatory for CONTROL warrants
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for CONTROL warrants
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("0");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("0");

            assertFalse ("Balance of Debt field is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtValid ());
            assertFalse ("Amount of Warrant field is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantValid ());

            // SEt valid fields and click save
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");

            // Tests that for CONTROL warrants, the Solicitors Costs defaults to 2.25
            assertEquals ("2.25", myUC029CreateHomeWarrantUtils.getSolicitorsCosts ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Tests that a case event 380 has been created for the CONTROL warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseControl, "380"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a POSSESSION warrant
     * following the TCE changes.
     */
    public void testPossessionHomeWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to POSSESSION
            myUC029CreateHomeWarrantUtils.setCaseNumber (casePossession);
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup

            // Test that the Balance of Debt and Amount of Warrant fields are optional for POSSESSION warrants
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for POSSESSION warrants
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("0");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("0");

            assertTrue ("Balance of Debt field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtValid ());
            assertTrue ("Amount of Warrant field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantValid ());

            // SEt valid fields and click save
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");

            // Tests that for POSSESSION warrants, the Solicitors Costs does not default to a value
            assertEquals ("", myUC029CreateHomeWarrantUtils.getSolicitorsCosts ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Tests that a case event 380 has been created for the POSSESSION warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (casePossession, "454"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a DELIVERY warrant
     * following the TCE changes.
     */
    public void testDeliveryHomeWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to DELIVERY
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseDelivery);
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup

            // Test that the Balance of Debt and Amount of Warrant fields are optional for DELIVERY warrants
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for DELIVERY warrants
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("0");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("0");

            assertTrue ("Balance of Debt field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtValid ());
            assertTrue ("Amount of Warrant field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantValid ());

            // SEt valid fields and click save
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");

            // Tests that for DELIVERY warrants, the Solicitors Costs does not default to a value
            assertEquals ("", myUC029CreateHomeWarrantUtils.getSolicitorsCosts ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Tests that a case event 380 has been created for the DELIVERY warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseDelivery, "456"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a COMMITTAL warrant
     * following the TCE changes.
     */
    public void testCommittalHomeWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to COMMITTAL
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseCommittal);
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set the Warrant party for and party against fields
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CLAIMANT NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEFENDANT NAME");

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup

            // Test that the Balance of Debt and Amount of Warrant fields are optional for COMMITTAL warrants
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantMandatory ());

            // Test that a value of 0 cannot be entered in these fields for COMMITTAL warrants
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("0");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("0");

            assertTrue ("Balance of Debt field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isBalanceOfDebtValid ());
            assertTrue ("Amount of Warrant field is invalid when should be valid",
                    myUC029CreateHomeWarrantUtils.isAmountOfWarrantValid ());

            // SEt valid fields and click save
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");

            // Tests that for COMMITTAL warrants, the Solicitors Costs does not default to a value
            assertEquals ("", myUC029CreateHomeWarrantUtils.getSolicitorsCosts ());

            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Tests that a case event 380 has been created for the COMMITTAL warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseCommittal, "458"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a CONTROL warrant
     * following the TCE changes and the home warrant is to be executed at a foreign court.
     */
    public void testControlForeignWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to CONTROL
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseControl);
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180"); // Set executing court to foriegn court

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();

            // Test that a foreign warrant record has been automatically created
            assertTrue ("No foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (caseControl, warrantNumber, "282", "180"));

            // Tests that a case event 380 has been created for the CONTROL warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseControl, "380"));

            // Tests that a case event 620 has been created for the CONTROL warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseControl, "620"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a POSSESSION warrant
     * following the TCE changes and the home warrant is to be executed at a foreign court.
     */
    public void testPossessionForeignWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to POSSESSION
            myUC029CreateHomeWarrantUtils.setCaseNumber (casePossession);
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180"); // Set executing court to foriegn court

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();

            // Test that a foreign warrant record has NOT been automatically created
            assertFalse ("Error - Foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (casePossession, warrantNumber, "282", "180"));

            // Tests that a case event 380 has been created for the POSSESSION warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (casePossession, "454"));

            // Tests that a case event 620 has been created for the POSSESSION warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (casePossession, "620"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a DELIVERY warrant
     * following the TCE changes and the home warrant is to be executed at a foreign court.
     */
    public void testDeliveryForeignWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to DELIVERY
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseDelivery);
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180"); // Set executing court to foriegn court

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();

            // Test that a foreign warrant record has NOT been automatically created
            assertFalse ("Error - Foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (caseDelivery, warrantNumber, "282", "180"));

            // Tests that a case event 380 has been created for the DELIVERY warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseDelivery, "456"));

            // Tests that a case event 620 has been created for the DELIVERY warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseDelivery, "620"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the behaviour of the Create Home Warrants screen when creating a COMMITTAL warrant
     * following the TCE changes and the home warrant is to be executed at a foreign court.
     */
    public void testCommittalForeignWarrantCreation ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            mLoginAndNavigateToScreen ();

            // Enter a case number with a case type that should default the warrant type to COMMITTAL
            myUC029CreateHomeWarrantUtils.setCaseNumber (caseCommittal);
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CLAIMANT NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEFENDANT NAME");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("100");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("100");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180"); // Set executing court to foriegn court

            final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber ();

            // Test that a foreign warrant record has NOT been automatically created
            assertFalse ("Error - Foreign warrant record automatically created",
                    DBUtil.checkAutomaticForeignWarrantExists (caseCommittal, warrantNumber, "282", "180"));

            // Tests that a case event 380 has been created for the COMMITTAL warrant
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseCommittal, "458"));

            // Tests that a case event 620 has been created for the COMMITTAL warrant from the transfer process
            assertEquals (1, DBUtil.getCountCaseEventsForCase (caseCommittal, "620"));
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