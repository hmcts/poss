/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9357 $
 * $Author: vincentcp $
 * $Date: 2012-01-05 10:09:53 +0000 (Thu, 05 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC007BarUnbarJudgmentUtils;

/**
 * Automated tests for the CaseMan Defect 4592. This covers a change to the Maintain Bar on
 * Judgment/Enforcement screen to include Claimant, Part 20 Claimants and Part 20 Defendants parties
 *
 * @author Des Johnston
 */
public class CaseManTrac4592_Test extends AbstractCmTestBase
{
    
    /** The my UC 007 bar unbar judgment utils. */
    // Private member variables for the screen utils
    private UC007BarUnbarJudgmentUtils myUC007BarUnbarJudgmentUtils;
    
    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The case number A. */
    private String caseNumberA = "0NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac4592_Test ()
    {
        super (CaseManTrac4592_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC007BarUnbarJudgmentUtils = new UC007BarUnbarJudgmentUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests that Defendants, Claimants and Part 20 Parties are visible in the
     * Bar Judgment screen grid.
     */
    public void testValidParties ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a Case
            myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumberA);

            // Navigate to the BarUnBar Judgment screen via quick links menu
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_BAR_JUDG);

            // Check in correct screen
            mCheckPageTitle (myUC007BarUnbarJudgmentUtils.getScreenTitle ());

            // Check Claimant is in the grid, select it and click bar button
            assertTrue ("Claimant party not present in grid",
                    myUC007BarUnbarJudgmentUtils.isPartyNameInGrid ("CLAIMANT NAME"));
            myUC007BarUnbarJudgmentUtils.selectPartyInGrid ("CLAIMANT NAME");
            myUC007BarUnbarJudgmentUtils.clickAlterBarButton ();

            // Check Defendant is in the grid, select it and click bar button
            assertTrue ("Defendant party not present in grid",
                    myUC007BarUnbarJudgmentUtils.isPartyNameInGrid ("DEFENDANT NAME"));
            myUC007BarUnbarJudgmentUtils.selectPartyInGrid ("DEFENDANT NAME");
            myUC007BarUnbarJudgmentUtils.clickAlterBarButton ();

            // Check Part 20 Claimant is in the grid, select it and click bar button
            assertTrue ("Part 20 Claimant party not present in grid",
                    myUC007BarUnbarJudgmentUtils.isPartyNameInGrid ("PART20 CLAIMANT NAME"));
            myUC007BarUnbarJudgmentUtils.selectPartyInGrid ("PART20 CLAIMANT NAME");
            myUC007BarUnbarJudgmentUtils.clickAlterBarButton ();

            // Check Part 20 Defendant is in the grid, select it and click bar button
            assertTrue ("Part 20 Defendant party not present in grid",
                    myUC007BarUnbarJudgmentUtils.isPartyNameInGrid ("PART20 DEFENDANT NAME"));
            myUC007BarUnbarJudgmentUtils.selectPartyInGrid ("PART20 DEFENDANT NAME");
            myUC007BarUnbarJudgmentUtils.clickAlterBarButton ();

            // Save the changes
            myUC007BarUnbarJudgmentUtils.clickSaveButton ();

            // Close the Maintain bar judg/enf screen
            myUC007BarUnbarJudgmentUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
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
