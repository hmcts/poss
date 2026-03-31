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
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;

/**
 * Automated tests for the CaseMan Defect 3392. This covers the validation of the AE Number field
 * on the Create/Maintain AE screen for existing records. When creating new records, the AE Number
 * field should validate that the Court Code part of the number should belong to an open Court (in service).
 * Existing AE records should not validate against this rule.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3392_Test extends AbstractCmTestBase
{
    
    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 091 create update AE utils. */
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The case number. */
    // Private enforcement numbers
    private String caseNumber = "9NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac3392_Test ()
    {
        super (CaseManTrac3392_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Tests that AE Number validation still works when creating a new AE record, i.e.
     * the first three characters of the AE Number must be the code of a Court that is
     * in service.
     */
    public void testCreateAE ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Load the Case for creation of new AE and set the AE Number to a value referencing
            // a Court no longer in service which will render the field invalid
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber);
            myUC091CreateUpdateAEUtils.setJudgmentCreditor ("CLAIMANT TWO NAME");
            myUC091CreateUpdateAEUtils.setJudgmentDebtor ("DEFENDANT TWO NAME");
            myUC091CreateUpdateAEUtils.setExistingCaseCheckbox (true);
            myUC091CreateUpdateAEUtils.setAENumber ("206X0001");

            // Set focus on AE Number field, check field is invalid and check the status bar text
            myUC091CreateUpdateAEUtils.setFocusInAENumber ();
            assertFalse ("AE Number is valid when should be invalid.", myUC091CreateUpdateAEUtils.isAENumberValid ());
            mCheckStatusBarText ("The court referred to in AE Number is not in service");

            // Set the AE Number field to a valid value (referencing Court in service) and check
            // field is valid.
            myUC091CreateUpdateAEUtils.setAENumber ("282X0001");
            assertTrue ("AE Number is not valid.", myUC091CreateUpdateAEUtils.isAENumberValid ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an existing AE is loaded on the Create/Maintain AE screen with an AE Number
     * linked to a Court not in service, the AE Number field will not be rendered invalid.
     */
    public void testUpdateExistingAE ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Load an existing AE with an AE Number referencing a Court that is no
            // longer in service.
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber);
            myUC091CreateUpdateAEUtils.loadExistingAE ();

            // Check that AE Number field is valid and set to expected value
            assertTrue ("AE Number is not valid.", myUC091CreateUpdateAEUtils.isAENumberValid ());
            assertTrue ("AE Number is not expected value.",
                    myUC091CreateUpdateAEUtils.getAENumber ().equals ("206T0001"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that user can navigate from AE Events screen to Create/Maintain AE screen
     * to load an existing AE record with an AE Number referencing a closed Court and
     * the AE Number field will NOT be rendered invalid.
     */
    public void testLoadExistingAE ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Enter a valid case number to load AE details
            myUC092AEEventUtils.loadAEByCaseNumber (caseNumber);

            // Navigate to Create/Maintain AE screen
            myUC092AEEventUtils.clickNavigationButton (UC092AEEventUtils.BTN_NAV_AE_SCREEN);

            // Check that AE Number field is valid and set to expected value
            assertTrue ("AE Number is not valid.", myUC091CreateUpdateAEUtils.isAENumberValid ());
            assertTrue ("AE Number is not expected value.",
                    myUC091CreateUpdateAEUtils.getAENumber ().equals ("206T0001"));

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
        assertTrue ("Status bar message is not equal to '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }
}