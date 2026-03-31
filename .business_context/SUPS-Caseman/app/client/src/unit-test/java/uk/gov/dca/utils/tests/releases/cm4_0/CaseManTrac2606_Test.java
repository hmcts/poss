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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;

/**
 * Automated tests for the CaseMan Defect 2606. This covers a change to the way in which
 * Payments are queried in the Maintain Payments screen. Previously, if the user queried
 * on a Case, only payments added to the Case would be returned, but the change now means
 * that Payments related to the Case are now returned.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2606_Test extends AbstractCmTestBase
{
    
    /** The my UC 061 maintain payment utils. */
    // Private member variables for the screen utils
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;

    /** The test case number. */
    // Enforcement number private variables
    private String testCaseNumber = "9NN00001";
    
    /** The test ae number. */
    private String testAeNumber = "282X0001";
    
    /** The test HW number. */
    private String testHWNumber = "X0000001";
    
    /** The test FW number. */
    private String testFWNumber = "FWY00003";
    
    /** The test CO number. */
    private String testCONumber = "090001NN";
    
    /** The test case tran no. */
    private String testCaseTranNo = "10000";

    /**
     * Constructor.
     */
    public CaseManTrac2606_Test ()
    {
        super (CaseManTrac2606_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
    }

    /**
     * Tests that when a Case Number is queried on the Maintain Payments screen, all
     * Payments are retrieved that are linked to the Case including AE payments, Home
     * and Foreign Warrant payments and even CO Payments. Specifically this test checks
     * a Case record can be loaded correctly.
     */
    public void testLoadCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            /********** QUERY FOR CASE BY ENFORCEMENT NUMBER + ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Click Search button (should open the Select Payment popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Select a specific payment and load record
            myUC061MaintainPaymentUtils.selectEnforcementByNumber (testCaseNumber);

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testCaseNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE));

            // Clear the details on the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR CASE BY ENFORCEMENT NUMBER + ENFORCEMENT TYPE + TRANSACTION NUMBER *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);
            myUC061MaintainPaymentUtils.setTransactionNumber (testCaseTranNo);

            // Click Search button (should just return one Payment record)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testCaseNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE));
            assertTrue ("Transaction Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getTransactionNumber ().equals (testCaseTranNo));

            // Clear the details on the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR CASE BY TRANSACTION NUMBER *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setTransactionNumber (testCaseTranNo);

            // Click Search button (should just return one Payment record)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testCaseNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE));
            assertTrue ("Transaction Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getTransactionNumber ().equals (testCaseTranNo));

            // Clear the details on the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            // Exit the screen
            myUC061MaintainPaymentUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Case Number is queried on the Maintain Payments screen, all
     * Payments are retrieved that are linked to the Case including AE payments, Home
     * and Foreign Warrant payments and even CO Payments. Specifically this test checks
     * an AE record can be loaded correctly.
     */
    public void testLoadAE ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            /********** QUERY FOR AE BY CASE ENFORCEMENT NUMBER + CASE ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Click Search button (should open the Select Payment popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Select a specific payment and load record
            myUC061MaintainPaymentUtils.selectEnforcementByNumber (testAeNumber);

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testAeNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR AE BY AE ENFORCEMENT NUMBER + AE ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testAeNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Click Search button (should be only one match so will not open popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testAeNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            // Exit the screen
            myUC061MaintainPaymentUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Case Number is queried on the Maintain Payments screen, all
     * Payments are retrieved that are linked to the Case including AE payments, Home
     * and Foreign Warrant payments and even CO Payments. Specifically this test checks
     * a Home Warrant record can be loaded correctly.
     */
    public void testLoadHomeWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            /********** QUERY FOR HOME WARRANT BY CASE ENFORCEMENT NUMBER + CASE ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Click Search button (should open the Select Payment popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Select a specific payment and load record
            myUC061MaintainPaymentUtils.selectEnforcementByNumber (testHWNumber);

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testHWNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR HOME WARRANT BY HW ENFORCEMENT NUMBER + HW ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testHWNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT);

            // Click Search button (should be only one match so will not open popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testHWNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_HOMEWARRANT));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            // Exit the screen
            myUC061MaintainPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Case Number is queried on the Maintain Payments screen, all
     * Payments are retrieved that are linked to the Case including AE payments, Home
     * and Foreign Warrant payments and even CO Payments. Specifically this test checks
     * a Foreign Warrant record can be loaded correctly.
     */
    public void testLoadForeignWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            /********** QUERY FOR FOREIGN WARRANT BY CASE ENFORCEMENT NUMBER + CASE ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Click Search button (should open the Select Payment popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Select a specific payment and load record
            myUC061MaintainPaymentUtils.selectEnforcementByNumber (testFWNumber);

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testFWNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR FOREIGN WARRANT BY FW ENFORCEMENT NUMBER + FW ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testFWNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT);

            // Click Search button (should be only one match so will not open popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testFWNumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_FOREIGNWARRANT));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            // Exit the screen
            myUC061MaintainPaymentUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Case Number is queried on the Maintain Payments screen, all
     * Payments are retrieved that are linked to the Case including AE payments, Home
     * and Foreign Warrant payments and even CO Payments. Specifically this test checks
     * a CO record can be loaded correctly.
     */
    public void testLoadCO ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.handleStartOfDayProcess ();

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            /********** QUERY FOR CO BY CASE ENFORCEMENT NUMBER + CASE ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCaseNumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CASE);

            // Click Search button (should open the Select Payment popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Select a specific payment and load record
            myUC061MaintainPaymentUtils.selectEnforcementByNumber (testCONumber);

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testCONumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            /********** QUERY FOR CO BY CO ENFORCEMENT NUMBER + CO ENFORCEMENT TYPE *********/

            // Set the Header fields
            myUC061MaintainPaymentUtils.setEnforcementNumber (testCONumber);
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO);

            // Click Search button (should be only one match so will not open popup)
            myUC061MaintainPaymentUtils.clickSearchButton ();

            // Check values in fields
            assertTrue ("Enforcement Number loaded is not the expected value",
                    myUC061MaintainPaymentUtils.getEnforcementNumber ().equals (testCONumber));
            assertTrue ("Enforcement Number loaded is not the expected value", myUC061MaintainPaymentUtils
                    .getEnforcementType ().equals (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_CO));

            // Clear the screen
            myUC061MaintainPaymentUtils.clearScreen ();

            // Exit the screen
            myUC061MaintainPaymentUtils.closeScreen ();
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