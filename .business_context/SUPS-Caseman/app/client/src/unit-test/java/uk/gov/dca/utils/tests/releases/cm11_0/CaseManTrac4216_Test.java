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

package uk.gov.dca.utils.tests.releases.cm11_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 4216.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4216_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The nn case number. */
    // Northampton Case
    private String nnCaseNumber = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac4216_Test ()
    {
        super (CaseManTrac4216_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils (this);
    }

    /**
     * Tests a Case can be transferred over two transactions when the user opts to produce a Transfer
     * Notice. The Transfer is initiated before the Transfer Notice is produced, and then the transfer is
     * completed.
     */
    public void testTransferCaseWithNotice ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (nnCaseNumber);

            // Check there is a Local Coded Party on the Case
            assertEquals ("The number of Local Coded Parties does not equal 1",
                    DBUtil.getCountLocalCodedPartiesOnCase (nnCaseNumber), 1);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_ALLOCATION);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Loop until are in Variable Data screen
            String pageTitle = session.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data CJR018F") == -1)
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check the Case is in the correct state
            assertEquals ("Transfer Out Event not created.", DBUtil.getCountCaseEventsForCase (nnCaseNumber, "340"), 1);
            assertTrue ("Case WFT data transfer has completed.",
                    isCaseWFTTransferComplete (nnCaseNumber, "282", "180"));
            assertFalse ("Case transfer has completed.", isCaseTransferComplete (nnCaseNumber, "282", "180"));
            assertEquals ("Transfer In Event has been created.", DBUtil.getCountCaseEventsForCase (nnCaseNumber, "360"),
                    0);

            // Check there are no longer any Local Coded Parties on the Case
            assertEquals ("Local Coded Parties do not exist on Case.",
                    DBUtil.getCountLocalCodedPartiesOnCase (nnCaseNumber), 1);

            // Continue with Transfer
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("AllocationToTrack",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Claim", this);
            vdQ1.setQuestionValue ();

            // Click Save on the Variable Data screen
            vdQ1.clickVariableDataSaveButton ();

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            vdQ1.clickFCKEditorOkButton ();

            // Loop until in Transfer Cases screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Check the Case is in the correct state
            assertTrue ("Case transfer has completed.", isCaseTransferComplete (nnCaseNumber, "282", "180"));
            assertEquals ("Transfer In Event has been created.", DBUtil.getCountCaseEventsForCase (nnCaseNumber, "360"),
                    1);

            // Check there are no longer any Local Coded Parties on the Case
            assertEquals ("Local Coded Parties exist when none should do.",
                    DBUtil.getCountLocalCodedPartiesOnCase (nnCaseNumber), 0);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests a Case can be transferred and all Case updates are performed in one transaction
     * when the user opts to not produce a Transfer Notice.
     */
    public void testTransferCaseWithoutNotice ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a Case which can navigate to the Transfer Cases screen
            myUC002CaseEventUtils.loadCaseByCaseNumber (nnCaseNumber);

            // Check there is a Local Coded Party on the Case
            assertEquals ("The number of Local Coded Parties does not equal 1",
                    DBUtil.getCountLocalCodedPartiesOnCase (nnCaseNumber), 1);

            // Navigate to the Transfer Cases screen
            this.nav.selectQuicklinksMenuItem (UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());

            myUC003TransferCaseUtils.setTransferCourtCode ("180");
            myUC003TransferCaseUtils.setTransferReason (UC003TransferCaseUtils.TRANSREASON_ALLOCATION);

            // Uncheck Produce Output Checkbox
            myUC003TransferCaseUtils.setProduceNoticeCheckbox (false);
            myUC003TransferCaseUtils.clickSaveButton ();

            // Check the Case is in the correct state
            assertEquals ("Transfer Out Event not created.", DBUtil.getCountCaseEventsForCase (nnCaseNumber, "340"), 1);
            assertTrue ("Case WFT data transfer has not completed.",
                    isCaseWFTTransferComplete (nnCaseNumber, "282", "180"));
            assertTrue ("Case transfer has not completed.", isCaseTransferComplete (nnCaseNumber, "282", "180"));
            assertEquals ("Transfer In Event not created.", DBUtil.getCountCaseEventsForCase (nnCaseNumber, "360"), 1);

            // Check there are no longer any Local Coded Parties on the Case
            assertEquals ("Local Coded Parties exist when none should do.",
                    DBUtil.getCountLocalCodedPartiesOnCase (nnCaseNumber), 0);

            // Check in Transfer Cases screen
            mCheckPageTitle (myUC003TransferCaseUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Indicates whether or not a Case has completed a transfer based upon the column values of the Case.
     *
     * @param caseNumber The identifier of the Case to check
     * @param previousCourt The previous owning court of the Case
     * @param newCourt The new owning court of the case
     * @return True if the Case has completed a transfer, else False
     */
    private boolean isCaseTransferComplete (final String caseNumber, final String previousCourt, final String newCourt)
    {
        final String query = "SELECT DECODE( COUNT(*), 0, 'false', 'true') " + "FROM CASES " +
                "WHERE CASE_NUMBER  = '" + caseNumber + "' " + "AND PREVIOUS_COURT = " + previousCourt + " " +
                "AND ADMIN_CRT_CODE = " + newCourt + " " + "AND TRANS_CRT_CODE IS NULL " +
                "AND TRANS_CASE_TYPE IS NULL " + "AND STATUS IS NULL " + "AND TRANSFER_REASON IS NULL " +
                "AND TRUNC(DATE_TRANSFERRED_IN) = TRUNC(SYSDATE) " + "AND TRANSFER_STATUS IS NULL " +
                "AND XFER_RECEIPT_DATE IS NULL " + "AND INSOLVENCY_NUMBER IS NULL";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Indicates whether or not Window for Trial has completed a transfer following Case transfer
     * based upon the column values.
     *
     * @param caseNumber The identifier of the Case to check
     * @param previousCourt The previous owning court of the Case
     * @param newCourt The new owning court of the case
     * @return True if the Case WFT data has completed a transfer, else False
     */
    private boolean isCaseWFTTransferComplete (final String caseNumber, final String previousCourt,
                                               final String newCourt)
    {
        final String query = "SELECT DECODE( COUNT(*), 0, 'false', 'true') " + "FROM WINDOW_FOR_TRIAL " +
                "WHERE WFT_CASE_NUMBER  = '" + caseNumber + "' " + "AND WFT_PREVIOUS_COURT = " + previousCourt + " " +
                "AND WFT_CURRENT_COURT = " + newCourt + " " + "AND WFT_EXTRACTED_FOR_DM IS NULL";
        return DBUtil.runDecodeTrueFalseQuery (query);
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