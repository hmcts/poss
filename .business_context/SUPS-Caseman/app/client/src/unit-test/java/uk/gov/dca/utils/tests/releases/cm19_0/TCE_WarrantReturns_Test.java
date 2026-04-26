/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11917 $
 * $Author: vincentcp $
 * $Date: 2015-05-12 11:53:24 +0100 (Tue, 12 May 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Warrant Returns screen.
 *
 * @author Chris Vincent
 */
public class TCE_WarrantReturns_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The ccbc execution warrant. */
    private String ccbcExecutionWarrant = "0A000001";
    
    /** The ccbc control warrant. */
    private String ccbcControlWarrant = "0A000002";
    
    /** The home execution warrant. */
    private String homeExecutionWarrant = "1A000001";
    
    /** The home control warrant. */
    private String homeControlWarrant = "1A000003";
    
    /** The ccbc execution case. */
    private String ccbcExecutionCase = "3QX00001";
    
    /** The ccbc control case. */
    private String ccbcControlCase = "3QX00002";
    
    /** The home execution case. */
    private String homeExecutionCase = "A04NN001";
    
    /** The home control case. */
    private String homeControlCase = "A04NN003";

    /**
     * Constructor.
     */
    public TCE_WarrantReturns_Test ()
    {
        super (TCE_WarrantReturns_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Test to create a warrant return on a foreign EXECUTION warrant for a CCBC/MCOL case
     * and ensure that the warrant return is transferred and an MCOL_DATA row is still
     * written.
     */
    public void testCCBCFinalReturnTransfer1 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (ccbcExecutionCase);
            myUC045WarrantReturnsUtils.setLocalNumber (ccbcExecutionWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Check that no final return 101 currently exists on the home CCBC warrant
            assertFalse ("Final return exists", checkCCBCFinalReturnTransferred (ccbcExecutionWarrant, "101"));

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

            // Check that a final return has now been transferred to the CCBC Home Warrant
            assertTrue ("Final return not transferred", checkCCBCFinalReturnTransferred (ccbcExecutionWarrant, "101"));

            // Check that MCOL_DATA row written
            assertTrue ("MCOL_DATA row not written",
                    checkMCOLDATARowWritten (ccbcExecutionCase, ccbcExecutionWarrant, "101"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a warrant return on a foreign CONTROL warrant for a CCBC/MCOL case
     * and ensure that the warrant return is transferred and an MCOL_DATA row is still
     * written.
     */
    public void testCCBCFinalReturnTransfer2 ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (ccbcControlCase);
            myUC045WarrantReturnsUtils.setLocalNumber (ccbcControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Check that no final return 101 currently exists on the home CCBC warrant
            assertFalse ("Final return exists", checkCCBCFinalReturnTransferred (ccbcControlWarrant, "101"));

            // Configure the event
            final NewStandardEvent testEvent101 = new NewStandardEvent ("WarrantReturn-101");
            testEvent101.setSubjectParty ("DEFENDANT NAME");
            testEvent101.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent101, null);

            // Check that a final return has now been transferred to the CCBC Home Warrant
            assertTrue ("Final return not transferred", checkCCBCFinalReturnTransferred (ccbcControlWarrant, "101"));

            // Check that MCOL_DATA row written
            assertTrue ("MCOL_DATA row not written",
                    checkMCOLDATARowWritten (ccbcControlCase, ccbcControlWarrant, "101"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return FN can be created on an EXECUTION warrant.
     */
    public void testFNReturnOnExecutionWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeExecutionCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeExecutionWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventFN = new NewStandardEvent ("WarrantReturn-FN");
            testEventFN.setSubjectParty ("DEFENDANT NAME");
            testEventFN.setCheckNotice (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventFNQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            eventFNQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("BailiffName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "MUSTAFA THE HARD", this);
            eventFNQuestions.add (vdQ2);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventFN, eventFNQuestions);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("FN");
            assertEquals ("FINAL NOTICE - CONTROL WARRANT", myUC045WarrantReturnsUtils.getReturnCodeDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return AD can be created on a CONTROL warrant.
     */
    public void testADReturnOnControlWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAD = new NewStandardEvent ("WarrantReturn-AD");
            testEventAD.setSubjectParty ("DEFENDANT NAME");
            testEventAD.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAD, null);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AD");
            assertEquals ("TAKING CONTROL/APPLICATION TO SET ASIDE JUDGMENT: CONTROL WARRANT",
                    myUC045WarrantReturnsUtils.getReturnCodeDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return AE can be created on a CONTROL warrant.
     */
    public void testAEReturnOnControlWarrant ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAE = new NewStandardEvent ("WarrantReturn-AE");
            testEventAE.setSubjectParty ("DEFENDANT NAME");
            testEventAE.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAE, null);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AE");
            assertEquals ("LEVY/APPLICATION TO SUSPEND OR VARY: CONTROL WARRANT",
                    myUC045WarrantReturnsUtils.getReturnCodeDescription ());
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
     * Private function that logs the user into CaseMan and navigates to the Warrant Returns screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());
    }

    /**
     * Determines whether or not a final warrant return has been transferred from the foreign warrant to the home
     * warrant owned by CCBC.
     *
     * @param pWarrantNumber The warrant number to check
     * @param pReturnCode The return code to check
     * @return True if the final return has been transferred, else false
     */
    private boolean checkCCBCFinalReturnTransferred (final String pWarrantNumber, final String pReturnCode)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM warrant_returns wr, warrants w WHERE " +
                "w.warrant_number = '" + pWarrantNumber +
                "' AND w.local_warrant_number IS NULL AND w.currently_owned_by = 335 " +
                "AND w.issued_by = 335 AND wr.warrant_id = w.warrant_id AND wr.return_code = '" + pReturnCode + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Checks that an MCOL_DATA row has been written.
     *
     * @param pCaseNumber The case number to check
     * @param pWarrantNumber The warrant number to check
     * @param pReturnCode The return code to check
     * @return True if the MCOL_DATA row exists, else false
     */
    private boolean checkMCOLDATARowWritten (final String pCaseNumber, final String pWarrantNumber,
                                             final String pReturnCode)
    {
        final String query = "SELECT DECODE(COUNT(*), 1, 'true', 'false') FROM mcol_data WHERE " + "claim_number = '" +
                pCaseNumber + "' AND type = 'FR' AND warrant_number = '" + pWarrantNumber + "' AND return_code = '" +
                pReturnCode + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}