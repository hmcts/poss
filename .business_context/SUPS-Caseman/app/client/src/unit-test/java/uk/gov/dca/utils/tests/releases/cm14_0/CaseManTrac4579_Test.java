/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9408 $
 * $Author: johnstond $
 * $Date: 2012-01-26 11:58:30 +0000 (Thu, 26 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm14_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC116COEventUtils;

/**
 * Automated test for the CaseMan Defect 4579. This covers a change to the CO11 (853) output so that the output can be
 * printed for long court names from the Create and Maintain CO Events screen, and displayed as an output for reprint
 * when clicking
 * on the 853 event PDF.
 *
 * @author Des Johnston
 */
public class CaseManTrac4579_Test extends AbstractCmTestBase
{
    
    /** The my UC 116 CO event utils. */
    // Private member variables for the screen utils
    private UC116COEventUtils myUC116COEventUtils;

    /** The co number. */
    private String coNumber = "100001AA";
    
    /** The court code. */
    private String courtCode = "240";

    /**
     * Constructor.
     */
    public CaseManTrac4579_Test ()
    {
        super (CaseManTrac4579_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC116COEventUtils = new UC116COEventUtils (this);

    }

    /**
     * Tests the CO belongs to court code 240 and checks that 901 and 852 events exist for the CO.
     */
    public void testConsolidatedOrderWith853Event ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Consolidated Orders Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            // Load a CO owned by court with a long court name (Kingston-Upon-Thames)
            myUC116COEventUtils.loadCOByCONumberAndCourt (coNumber, courtCode);

            // Create a 853 event to generate a CO11 (N63 NOTICE TO SHOW CAUSE) output
            final NewStandardEvent testEvent853 = new NewStandardEvent ("853");

            testEvent853.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event853Questions = new LinkedList<VariableDataQuestion> ();

            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("DateOfHearing", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (1, AbstractBaseUtils.DATE_FORMAT_NOW, false), this);
            event853Questions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("TimeOfHearing", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10:00", this);
            event853Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingAtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "NO", this);
            event853Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("SelectVenue_OKBtn", VariableDataQuestion.VD_FIELD_TYPE_BUTTON, this);
            event853Questions.add (vdQ4);

            // Add the event
            myUC116COEventUtils.addNewEvent (testEvent853, event853Questions);

            // Check the 853 was successfully created
            assertEquals ("853", myUC116COEventUtils.getValueFromGrid ("Master_COEventGrid", 2, 3));

            // myUC116COEventUtils.closeScreen();
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
