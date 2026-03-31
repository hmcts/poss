/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9770 $
 * $Author: vincentcp $
 * $Date: 2013-02-19 15:16:15 +0000 (Tue, 19 Feb 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm16_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Trac 4768.
 *
 * Tests the enablement, validation and commital of a new Case Events screen field - DOcketed/Res Judge
 *
 * @author Chris Vincent
 */
public class CaseManTrac4768_Test extends AbstractCmTestBase
{
    // Private member variables for the screen utils

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The case number. */
    private String caseNumber = "3NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac4768_Test ()
    {
        super (CaseManTrac4768_Test.class.getName ());
        this.nav = new Navigator (this);

        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests the functionality around the new Docketed/Res Judge field.
     */
    public void testDocketedResJudgeField ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check field is initially disabled
            assertFalse ("Docketed/Res Judge enabled when should be disabled", myUC002CaseEventUtils.isJudgeEnabled ());

            // Load a Case
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

            assertTrue ("Docketed/Res Judge disabled when should be enabled", myUC002CaseEventUtils.isJudgeEnabled ());
            assertEquals ("", myUC002CaseEventUtils.getJudge ());

            // Set a value equal to the maximum and test validity
            myUC002CaseEventUtils.setJudge ("1234567890123456789012345678901234567890123456789012345678901234567890");
            assertTrue ("Docketed/Res Judge invalid when should be valid", myUC002CaseEventUtils.isJudgeValid ());

            // Set a sensible value and save then clear screen down
            myUC002CaseEventUtils.setJudge ("JUDGE NAME");
            myUC002CaseEventUtils.clickSaveButton ();
            myUC002CaseEventUtils.clearScreen ();

            // Load case again and check value has been retrieved
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);
            assertEquals ("JUDGE NAME", myUC002CaseEventUtils.getJudge ());

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