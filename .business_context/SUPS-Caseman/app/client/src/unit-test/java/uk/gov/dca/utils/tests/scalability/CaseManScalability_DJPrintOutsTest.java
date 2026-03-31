/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 *****************************************/

package uk.gov.dca.utils.tests.scalability;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC119DJPrintOutsUtils;

/**
 * Automated tests for the scalabililty change to the District Judges Print Outs report.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_DJPrintOutsTest extends AbstractCmTestBase
{

    /** The my UC 119 DJ print outs utils. */
    // Private member variables for the screen utils
    private UC119DJPrintOutsUtils myUC119DJPrintOutsUtils;

    /**
     * Complex case including: Non coded Claimant 1 with no solicitor Coded party Claimant 2 linked to non coded
     * solicitor 1 Defendant 1 with no solicitor Defendant 2 linked to coded party solicitor Defendant 3 linked to non
     * coded solicitor 2 Defendant 4 with no solicitor Defendant 5 linked to non coded solicitor 2 Coded party Part 20
     * Claimant 1 with no solicitor Non coded Part 20 Claimant 2 with no solicitor Non coded Part 20 Defendant 1 with no
     * solicitor Non coded Part 20 Defendant 2 with no solicitor.
     */
    private String complexCase = "9NN00001";

    /**
     * Insolvency case including: Non coded Applicant 1 with no solicitor Non coded Creditor 1 linked to coded party
     * solicitor 1 Non coded Creditor 2 linked to coded party solicitor 1 Non coded Debtor 1 with no solicitor Coded
     * party Insolvency Practitioner 1 with no solicitor Non coded Insolvency Practitioner 2 with no solicitor Non coded
     * Official Receiver 1 linked to non coded solicitor 1 Coded party Petitioner 1 linked to non coded solicitor 1 Non
     * coded Company 1 with no solicitor.
     */
    private String insolvencyCase = "9NN00002";

    /**
     * CCBC Case including: Non coded Claimant 1 linked to national coded party solicitor Defendant 1 with no solicitor.
     */
    private String ccbcCase = "9QX00001";

    /**
     * Constructor.
     */
    public CaseManScalability_DJPrintOutsTest ()
    {
        super (CaseManScalability_DJPrintOutsTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC119DJPrintOutsUtils = new UC119DJPrintOutsUtils (this);
    }

    /**
     * Basic test that enters a Case Number and clicks the Run Report button
     * to generate the output.
     */
    public void testDPAInitialEnquiryFunctionality ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the DPA Initial Enquiry screen
            this.nav.navigateFromMainMenu (MAINMENU_DJ_PRINTOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC119DJPrintOutsUtils.getScreenTitle ());

            // Run report against a complex case
            myUC119DJPrintOutsUtils.setCaseNumber (complexCase);
            assertTrue ("Case Number is invalid", myUC119DJPrintOutsUtils.isCaseNumberFieldValid ());

            // Run report
            myUC119DJPrintOutsUtils.runReport ();

            // Run report against an insolvency case
            myUC119DJPrintOutsUtils.setCaseNumber (insolvencyCase);
            assertTrue ("Case Number is invalid", myUC119DJPrintOutsUtils.isCaseNumberFieldValid ());

            // Run report
            myUC119DJPrintOutsUtils.runReport ();

            // Run report against a CCBC case
            myUC119DJPrintOutsUtils.setCaseNumber (ccbcCase);
            assertTrue ("Case Number is invalid", myUC119DJPrintOutsUtils.isCaseNumberFieldValid ());

            // Run report
            myUC119DJPrintOutsUtils.runReport ();

            // Exit screen
            myUC119DJPrintOutsUtils.closeScreen ();

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