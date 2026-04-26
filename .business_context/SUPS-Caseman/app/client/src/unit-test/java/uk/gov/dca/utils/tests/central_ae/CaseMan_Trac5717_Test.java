/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11768 $
 * $Author: vincentcp $
 * $Date: 2015-03-12 09:21:53 +0000 (Thu, 12 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.central_ae;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests the Electronic Seal and Bulk Printing changes in the BIF release.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5717_Test extends AbstractCmTestBase
{
    
    /** The my UC 091 create update AE utils. */
    // Private member variables for the screen utils
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The case number 1. */
    // Test cases
    private String caseNumber1 = "9NN00011";

    /**
     * Constructor.
     */
    public CaseMan_Trac5717_Test ()
    {
        super (CaseMan_Trac5717_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Test that when an AE is created, the AE issuing court and AE Fee court are set to
     * the user court rather than the case owning court.
     */
    public void testCreateAE ()
    {
        try
        {
            // Log into SUPS CaseMan as a Coventry user
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details to a Northampton owned caseand Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber1);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase (caseNumber1);

            assertTrue ("AE Issuing court not as expected", checkAEIssuingCourt (tmpAeNumber, "180"));

            assertTrue ("AE Fee court not as expected", checkAEFeeCourt (tmpAeNumber, "180"));

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

    /**
     * Checks that the AE Issuing court is set to the expected value (user court).
     *
     * @param pAENumber The AE number to check
     * @param userCourt The user court code
     * @return True if the issuing court is as expected, else false
     */
    private boolean checkAEIssuingCourt (final String pAENumber, final String userCourt)
    {
        final String query = "SELECT DECODE(issuing_crt_code, " + userCourt +
                ", 'true', 'false') FROM ae_applications " + "WHERE ae_number = '" + pAENumber + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

    /**
     * Checks that the AE Fee court is set to the expected value (user court).
     *
     * @param pAENumber The AE number to check
     * @param userCourt The user court code
     * @return True if the issuing court is as expected, else false
     */
    private boolean checkAEFeeCourt (final String pAENumber, final String userCourt)
    {
        final String query = "SELECT DECODE(issuing_court, " + userCourt + ", 'true', 'false') FROM fees_paid " +
                "WHERE process_number = '" + pAENumber + "' AND process_type = 'A'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}