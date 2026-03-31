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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;

/**
 * Automated tests for the CaseMan Defect 2049. This defect causes the Payments to Date and
 * Total Remaining fields in the Maintain/Query Warrants screen to incorrectly include Payments
 * that have been referred to drawer when they should be ignored.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2049_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /** The test home warrant no 1. */
    // Test Case/Warrant Numbers
    private String testHomeWarrantNo1 = "X0000001";
    
    /** The test home warrant case no 1. */
    private String testHomeWarrantCaseNo1 = "9NN00001";
    
    /** The test home warrant no 2. */
    private String testHomeWarrantNo2 = "X0000002";
    
    /** The test home warrant case no 2. */
    private String testHomeWarrantCaseNo2 = "9NN00002";
    
    /** The test foreign warrant no 1. */
    private String testForeignWarrantNo1 = "FWY00001";
    
    /** The test foreign warrant case no 1. */
    private String testForeignWarrantCaseNo1 = "9CH00001";
    
    /** The test foreign warrant no 2. */
    private String testForeignWarrantNo2 = "FWY00002";
    
    /** The test foreign warrant case no 2. */
    private String testForeignWarrantCaseNo2 = "9CH00002";

    /**
     * Constructor.
     */
    public CaseManTrac2049_Test ()
    {
        super (CaseManTrac2049_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Tests that when a Home Warrant with a Payment referred to drawer is loaded in the
     * Maintain/Query Warrants screen, the Payments to Date and Total Remaining fields
     * ignore any payments referred to drawer.
     */
    public void testHomeWarrantWithRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Retrieve the Warrant record
            myUC039MaintainWarrantUtils.setWarrantNumber (testHomeWarrantNo1);
            myUC039MaintainWarrantUtils.setCaseNumber (testHomeWarrantCaseNo1);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Open the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();

            // Check the amount fields are correct
            assertTrue ("Payments to date is not the expected value",
                    myUC039MaintainWarrantUtils.getPaymentsToDate ().equals ("100.00"));
            assertTrue ("Total Remaining is not the expected value",
                    myUC039MaintainWarrantUtils.getTotalRemaining ().equals ("1050.00"));

            // Exit the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant without any Payments referred to drawer is loaded in the
     * Maintain/Query Warrants screen, the Payments to Date and Total Remaining fields are correct.
     */
    public void testHomeWarrantWithoutRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Retrieve the Warrant record
            myUC039MaintainWarrantUtils.setWarrantNumber (testHomeWarrantNo2);
            myUC039MaintainWarrantUtils.setCaseNumber (testHomeWarrantCaseNo2);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Open the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();

            // Check the amount fields are correct
            assertTrue ("Payments to date is not the expected value",
                    myUC039MaintainWarrantUtils.getPaymentsToDate ().equals ("100.00"));
            assertTrue ("Total Remaining is not the expected value",
                    myUC039MaintainWarrantUtils.getTotalRemaining ().equals ("1050.00"));

            // Exit the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant with a Payment referred to drawer is loaded in the
     * Maintain/Query Warrants screen, the Payments to Date and Total Remaining fields
     * ignore any payments referred to drawer.
     */
    public void testForeignWarrantWithRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Retrieve the Warrant record
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (testForeignWarrantNo1);
            myUC039MaintainWarrantUtils.setCaseNumber (testForeignWarrantCaseNo1);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Open the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();

            // Check the amount fields are correct
            assertTrue ("Payments to date is not the expected value",
                    myUC039MaintainWarrantUtils.getPaymentsToDate ().equals ("100.00"));
            assertTrue ("Total Remaining is not the expected value",
                    myUC039MaintainWarrantUtils.getTotalRemaining ().equals ("1050.00"));

            // Exit the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant without any Payments referred to drawer is loaded in the
     * Maintain/Query Warrants screen, the Payments to Date and Total Remaining fields are correct.
     */
    public void testForeignWarrantWithoutRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Retrieve the Warrant record
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (testForeignWarrantNo2);
            myUC039MaintainWarrantUtils.setCaseNumber (testForeignWarrantCaseNo2);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Open the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantButton ();

            // Check the amount fields are correct
            assertTrue ("Payments to date is not the expected value",
                    myUC039MaintainWarrantUtils.getPaymentsToDate ().equals ("100.00"));
            assertTrue ("Total Remaining is not the expected value",
                    myUC039MaintainWarrantUtils.getTotalRemaining ().equals ("1050.00"));

            // Exit the Details of Warrant popup
            myUC039MaintainWarrantUtils.clickDetailsOfWarrantPopupOk ();

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

}