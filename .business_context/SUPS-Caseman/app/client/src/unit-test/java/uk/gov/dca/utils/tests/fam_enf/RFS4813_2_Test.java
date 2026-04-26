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

package uk.gov.dca.utils.tests.fam_enf;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class RFS4813_2_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // FAMILY ENF - FAMILY COURT case with party requested confidential
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // FAMILY ENF - REMO case
    
    /** The civil case. */
    private String civilCase = "3NN00031"; // Civil Case

    /**
     * Constructor.
     */
    public RFS4813_2_Test ()
    {
        super (RFS4813_2_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Tests case creation of a family enforcement case, that the confidential flag is enabled
     * tick the confidential flag, save and then load the case in the events screen and test
     * that the warning message appears.
     */
    public void testCaseCreation1 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterUpdateCase ();

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A16NN001");
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_FAMENF_FAMILY);

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup and then close it
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Check the new confidential flag is enabled and then set it
            assertTrue ("Confidential flag is disabled when should be enabled",
                    myUC001CreateUpdateCaseUtils.isNonSolConfidentialFieldEnabled ());
            myUC001CreateUpdateCaseUtils.setNonSolConfidential (true);

            // Click Save and exit screen
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load the new case
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A16NN001");

            // Check the new confidential popup appears
            myUC002CaseEventUtils.openAddEventPopup ("999");
            assertEquals ("Warning - a party on this case has requested confidentiality.", this.getAlertString ());

            myUC002CaseEventUtils.clickAddEventCancelButton ();
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case creation of a civil enforcement case, that the confidential flag is disabled
     * save and then load the case in the events screen and test that the warning message doesn't appear.
     */
    public void testCaseCreation2 ()
    {
        try
        {
            // Login and Navigate to Create Cases screen
            mLoginAndEnterUpdateCase ();

            // Enter Case Number which does not already exist
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A16NN001");
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup and then close it
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Check the new confidential flag is enabled and then set it
            assertFalse ("Confidential flag is enabled when should be disabled",
                    myUC001CreateUpdateCaseUtils.isNonSolConfidentialFieldEnabled ());

            // Click Save and exit screen
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load the new case
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A16NN001");

            // Check the new confidential popup appears
            myUC002CaseEventUtils.openAddEventPopup ("999");
            // Should fall over here if a warning message appears

            myUC002CaseEventUtils.clickAddEventCancelButton ();
            myUC002CaseEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an AE Event is created on the AE events screen on a case that has requested
     * confidentiality that a warning message appears. Also tests that no warning appears on a case
     * that has not requested confidentiality.
     */
    public void testAEEventWarning ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Load an AE on a case that has requested confidentiality and check alert appears
            myUC092AEEventUtils.loadAEByCaseNumber (famEnfCase1);
            myUC092AEEventUtils.openAddEventPopup ("332");
            assertEquals ("Warning - a party on this case has requested confidentiality.", this.getAlertString ());
            myUC092AEEventUtils.clickAddEventCancelButton ();

            // Now clear the screen, load an AE linked to a case that has not requested confidentiality
            myUC092AEEventUtils.clearScreen ();
            myUC092AEEventUtils.loadAEByCaseNumber (famEnfCase2);
            myUC092AEEventUtils.openAddEventPopup ("332");
            // There will be an error message here if the alert appears
            myUC092AEEventUtils.clickAddEventCancelButton ();
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Warrant Return is created on the Warrant Returns screen on a case that has requested
     * confidentiality that a warning message appears. Also tests that no warning appears on a case
     * that has not requested confidentiality.
     */
    public void testWarrantReturnWarning ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Warrant Returns screen
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load a Home Warrant on a Family Enforcement case
            myUC045WarrantReturnsUtils.setCaseNumber (famEnfCase1);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant return AE and check warning popup appears
            myUC045WarrantReturnsUtils.openAddEventPopup ("AE");
            assertEquals ("Warning - a party on this case has requested confidentiality.", this.getAlertString ());
            myUC045WarrantReturnsUtils.clickAddEventCancelButton ();

            // Clear screen and load a Home Warrant on a Civil case
            myUC045WarrantReturnsUtils.clearScreen ();
            myUC045WarrantReturnsUtils.setCaseNumber (civilCase);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Add the warrant return AE and check warning popup appears
            myUC045WarrantReturnsUtils.openAddEventPopup ("AE");
            // Will fail here if a warning message appears
            myUC045WarrantReturnsUtils.clickAddEventCancelButton ();

            myUC045WarrantReturnsUtils.closeScreen ();
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
     * Private function that logs the user into CaseMan, navigates to the Update Cases screen.
     */
    private void mLoginAndEnterUpdateCase ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());
    }

}