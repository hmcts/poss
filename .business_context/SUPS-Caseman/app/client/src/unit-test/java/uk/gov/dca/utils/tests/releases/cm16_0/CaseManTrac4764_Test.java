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

package uk.gov.dca.utils.tests.releases.cm16_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Trac 4768.
 *
 * Tests the enablement, validation and commital of a new Case Events screen field - DOcketed/Res Judge
 *
 * @author Chris Vincent
 */
public class CaseManTrac4764_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4764_Test ()
    {
        super (CaseManTrac4764_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests the functionality around the new Docketed/Res Judge field.
     */
    public void testCreateCasePreferredCourt ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to Case Creation screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Check preferred court fields disabled
            assertFalse ("Preferred Court Code enabled when should be disabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeEnabled ());
            assertFalse ("Preferred Court Name enabled when should be disabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtNameEnabled ());
            assertFalse ("Preferred Court LOV enabled when should be disabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtLOVEnabled ());

            // Enter Case Number for new Case
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A14CV001");

            // Ensure the Owning Court LOV works correctly
            myUC001CreateUpdateCaseUtils.selectOwningCourtFromLOV ("coventry");
            assertEquals ("180", myUC001CreateUpdateCaseUtils.getOwningCourtCode ()); // Owning Court should be set
            assertEquals ("", myUC001CreateUpdateCaseUtils.getPreferredCourtCode ()); // Preferred Court should stay as
                                                                                      // is
            assertTrue ("Owning Court Code invalid when should be valid",
                    myUC001CreateUpdateCaseUtils.isOwningCourtCodeValid ());

            // Enter case type
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);

            // Check the preferred court fields now enabled
            assertTrue ("Preferred Court Code disabled when should be enabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeEnabled ());
            assertTrue ("Preferred Court Name disabled when should be enabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtNameEnabled ());
            assertTrue ("Preferred Court LOV disabled when should be enabled",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtLOVEnabled ());

            // Check the Preferred Court LOV works correctly
            myUC001CreateUpdateCaseUtils.selectPreferredCourtFromLOV ("birmingham");
            assertEquals ("127", myUC001CreateUpdateCaseUtils.getPreferredCourtCode ()); // Preferred Court should be
                                                                                         // updated
            assertEquals ("180", myUC001CreateUpdateCaseUtils.getOwningCourtCode ()); // Owning Court should stay as is
            assertEquals ("BIRMINGHAM", myUC001CreateUpdateCaseUtils.getPreferredCourtName ());
            assertTrue ("Preferred Court Code invalid when should be valid",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeValid ());

            // Check the Preferred Court Code field works correctly
            myUC001CreateUpdateCaseUtils.setPreferredCourtCode ("282");
            assertEquals ("NORTHAMPTON", myUC001CreateUpdateCaseUtils.getPreferredCourtName ());
            assertTrue ("Preferred Court Code invalid when should be valid",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeValid ());
            myUC001CreateUpdateCaseUtils.setPreferredCourtCode ("AAA");
            assertFalse ("Preferred Court Code valid when should be invalid",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeValid ());

            // Check the Preferred Court Name field works correctly
            myUC001CreateUpdateCaseUtils.setPreferredCourtName ("WOLVERHAMPTON");
            assertEquals ("378", myUC001CreateUpdateCaseUtils.getPreferredCourtCode ());
            assertTrue ("Preferred Court Code invalid when should be valid",
                    myUC001CreateUpdateCaseUtils.isPreferredCourtCodeValid ());

            // Add Claimant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Solicitor to Claimant
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();
            myUC001CreateUpdateCaseUtils.setNewSolicitorName ("CLAIMANT1 SOLICITOR NAME");
            myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            // Add Defendant
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and handle WP processing
            myUC001CreateUpdateCaseUtils.saveCase (true);

            myUC001CreateUpdateCaseUtils.closeScreen ();
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Load case again and check that the Preferred Court Code has been saved
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A14CV001");
            assertEquals ("378", myUC001CreateUpdateCaseUtils.getPreferredCourtCode ());

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test case event preferred court.
     */
    public void testCaseEventPreferredCourt ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to Case Creation screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            myUC001CreateUpdateCaseUtils.createDefaultCase ("A14NN002");

            myUC001CreateUpdateCaseUtils.closeScreen ();
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check field is initially disabled
            assertFalse ("Preferred Court Code enabled when should be disabled",
                    myUC002CaseEventUtils.isPreferredCourtCodeEnabled ());
            assertFalse ("Preferred Court Name enabled when should be disabled",
                    myUC002CaseEventUtils.isPreferredCourtNameEnabled ());

            // Load a Case
            myUC002CaseEventUtils.loadCaseByCaseNumber ("A14NN002");

            assertTrue ("Preferred Court Code disabled when should be disabled",
                    myUC002CaseEventUtils.isPreferredCourtCodeEnabled ());
            assertTrue ("Preferred Court Name disabled when should be disabled",
                    myUC002CaseEventUtils.isPreferredCourtNameEnabled ());
            assertEquals ("", myUC002CaseEventUtils.getPreferredCourtCode ());
            assertTrue ("Preferred Court Code editable when should be read only",
                    myUC002CaseEventUtils.isPreferredCourtCodeReadOnly ());
            assertTrue ("Preferred Court Name editable when should be read only",
                    myUC002CaseEventUtils.isPreferredCourtNameReadOnly ());

            myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_CASES_SCREEN);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            myUC001CreateUpdateCaseUtils.setPreferredCourtCode ("282");
            myUC001CreateUpdateCaseUtils.saveCase ();
            myUC001CreateUpdateCaseUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            assertEquals ("282", myUC002CaseEventUtils.getPreferredCourtCode ());

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