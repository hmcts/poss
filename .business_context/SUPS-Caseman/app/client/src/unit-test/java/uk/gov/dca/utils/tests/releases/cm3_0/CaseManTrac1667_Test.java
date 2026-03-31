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

package uk.gov.dca.utils.tests.releases.cm3_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC090AESODUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC096AEFeesRefundsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 1667. This covers the changes to the AE Owning Court
 * Problems.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1667_Test extends AbstractCmTestBase
{
    
    /** The my UC 096 AE fees refunds utils. */
    // Private member variables for the screen utils
    private UC096AEFeesRefundsUtils myUC096AEFeesRefundsUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 090 AESOD utils. */
    private UC090AESODUtils myUC090AESODUtils;

    /** The nn case CVAE. */
    // Northampton Cases with Coventry Issued AE
    private String nnCaseCVAE = "9NN00001";
    
    /** The nn case CVAE 2. */
    private String nnCaseCVAE2 = "9NN00002";

    /** The cv AENN case. */
    private String cvAENNCase = "180X0001";
    
    /** The cv AENN case 2. */
    private String cvAENNCase2 = "180X0002";

    /**
     * Constructor.
     */
    public CaseManTrac1667_Test ()
    {
        super (CaseManTrac1667_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC096AEFeesRefundsUtils = new UC096AEFeesRefundsUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC090AESODUtils = new UC090AESODUtils (this);

    }

    /**
     * Test will navigate to the AE Events screen and make sure that the Owning
     * Court field refers to the Case's Owning Court when querying and also when
     * viewing the AE Details. Then navigates to the AE Fees screen where the
     * AE Issuing Court is displayed.
     */
    public void testCorrectCourtDisplayed ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Ensure the Court Code field is set to Northampton and load
            // a Case owned by Northampton, but the AE is Issued by Coventry.
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (nnCaseCVAE);

            // Check the Owning Court field is set to the owning court of the case (282)
            assertTrue ("Owning Court is not Northampton (282)",
                    myUC092AEEventUtils.getOwningCourtFieldValue ().indexOf ("282") != -1);

            // Try navigating to the Fees and Refunds screen
            this.nav.selectQuicklinksMenuItem (UC092AEEventUtils.QUICKLINK_AE_FEES);

            // Check in correct screen
            mCheckPageTitle (myUC096AEFeesRefundsUtils.getScreenTitle ());

            // Check the Issuing Court field is set to the Issuing Court of the AE (180)
            assertTrue ("Issuing Court is not Coventry (180)",
                    myUC096AEFeesRefundsUtils.getIssuingCourtFieldValue ().indexOf ("180") != -1);

            // Exit AE Fees screen
            myUC096AEFeesRefundsUtils.closeScreen ();

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Exit the AE Events screen
            myUC092AEEventUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test will automatically create Warrants via AE Events 856 and 876 and check
     * that the Issuing Court of the AE's generated will be Issued by the Owning
     * Court of the case instead of the Issuing Court of the AE.
     */
    public void testAEWarrantCreation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Ensure the Court Code field is set to Northampton and load
            // a Case owned by Northampton, but the AE is Issued by Coventry.
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (nnCaseCVAE);

            // Create Event 856
            final NewStandardEvent testEvent856 = new NewStandardEvent ("856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event856Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event856Questions.add (vdQ2);

            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("JudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Ronald McDonald", this);
            event856Questions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("Hearing2AtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event856Questions.add (vdQ4);

            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("HearingAttendees",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "HEARING BOTH PARTIES IN PERSON", this);
            event856Questions.add (vdQ5);

            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("PrisonName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "HMP WANDSWORTH", this);
            event856Questions.add (vdQ6);

            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("EnterTheLengthOfCommittal",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "14", this);
            event856Questions.add (vdQ7);

            final VariableDataQuestion vdQ8 =
                    new VariableDataQuestion ("ItemDetails", VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "DETAILS", this);
            event856Questions.add (vdQ8);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent856, event856Questions);

            // Check the Issuing Court of the Warrant generated is Northampton (282)
            assertTrue ("Warrant Issuing Court is not Northampton (282)",
                    DBUtil.getAEWarrantIssuingCourt (cvAENNCase, "856").equals ("282"));

            myUC092AEEventUtils.clearScreen ();
            myUC092AEEventUtils.setCourtCode ("282");
            myUC092AEEventUtils.loadAEByCaseNumber (nnCaseCVAE2);

            // Create Event 876
            final NewStandardEvent testEvent876 = new NewStandardEvent ("876");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event876Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("ThisCourtToExecute",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", this);
            event876Questions.add (vdQ9);

            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("AmountOfFineToRecover",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "10.00", this);
            event876Questions.add (vdQ10);

            // Add the event
            myUC092AEEventUtils.addNewEvent (testEvent876, event876Questions);

            // Check the Issuing Court of the Warrant generated is Northampton (282)
            assertTrue ("Warrant Issuing Court is not Northampton (282)",
                    DBUtil.getAEWarrantIssuingCourt (cvAENNCase2, "876").equals ("282"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Test will run the AE Start of Day report and check that Oracle Report outputs are
     * generated for the AE Events associated with the AE's issued by a court different
     * to the Case's owning court.
     */
    public void testAEStartOfDayEvents ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Reset the AE Start of Day last run date system data item to the previous day
            DBUtil.setSystemDataItem ("AE RUNDATE", "282",
                    AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_SYSDATA, false));

            // Navigate to the Accumulative AE Fees screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_SOD_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC090AESODUtils.getScreenTitle ());

            // Run report
            myUC090AESODUtils.runReport ();

            assertTrue ("No outputs generated for AE " + cvAENNCase2,
                    DBUtil.getNumberOutputsGeneratedForAE (cvAENNCase2) > 0);

            // Exit Screen
            myUC090AESODUtils.closeScreen ();

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