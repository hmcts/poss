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

package uk.gov.dca.utils.tests.shakedown;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class HomeWarrantsTest extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The execution case number. */
    // Case numbers to use in the tests
    private String executionCaseNumber = "9NN00001";
    
    /** The possession case number. */
    private String possessionCaseNumber = "9NN00002";
    
    /** The committal case number. */
    private String committalCaseNumber = "9NN00004";
    
    /** The delivery case number. */
    private String deliveryCaseNumber = "9NN00003";

    /**
     * Constructor.
     */
    public HomeWarrantsTest ()
    {
        super (HomeWarrantsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Test to create a new home warrant record of type EXECUTION.
     */
    public void testCreateExecutionHomeWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (executionCaseNumber);

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record of type POSSESSION.
     */
    public void testCreatePossessionHomeWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (possessionCaseNumber);

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record of type COMMITTAL.
     */
    public void testCreateCommittalHomeWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (committalCaseNumber);

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("IGNACIO MILAM TANG");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("TEODORO OBIANG NGUEMA MBASOGO");

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new home warrant record of type DELIVERY.
     */
    public void testCreateDeliveryHomeWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (deliveryCaseNumber);

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();
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

}