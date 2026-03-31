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
import uk.gov.dca.utils.screens.UC020DPInitialEnquiryUtils;

/**
 * Automated tests for the scalabililty change to the DPA Initial Enquiry screen
 * and report.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_DPAInitialEnquiryTest extends AbstractCmTestBase
{

    /** The my UC 020 DP initial enquiry utils. */
    // Private member variables for the screen utils
    private UC020DPInitialEnquiryUtils myUC020DPInitialEnquiryUtils;

    /**
     * Constructor.
     */
    public CaseManScalability_DPAInitialEnquiryTest ()
    {
        super (CaseManScalability_DPAInitialEnquiryTest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC020DPInitialEnquiryUtils = new UC020DPInitialEnquiryUtils (this);
    }

    /**
     * Basic test that enters a wildcard party name and clicks the Run Report button
     * to generate the output. Also tests for valid search strings.
     */
    public void testDPAInitialEnquiryFunctionality ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the DPA Initial Enquiry screen
            this.nav.navigateFromMainMenu (MAINMENU_INITIAL_ENQUIRY_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC020DPInitialEnquiryUtils.getScreenTitle ());

            // Single alphabetic character should be invalid
            myUC020DPInitialEnquiryUtils.setPartyName ("A");
            assertFalse ("Party Name not rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());
            mCheckStatusBarText (UC020DPInitialEnquiryUtils.ERR_MSG_TWO_ALPHA_CHARS);

            // Two alphabetic characters should be valid
            myUC020DPInitialEnquiryUtils.setPartyName ("CL");
            assertTrue ("Party Name rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());

            // Two alphabetic characters & one wildcard should be valid
            myUC020DPInitialEnquiryUtils.setPartyName ("%CL");
            assertTrue ("Party Name rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());

            // Two alphabetic characters & two wildcards should be valid
            myUC020DPInitialEnquiryUtils.setPartyName ("%CL%");
            assertTrue ("Party Name rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());

            // Two alphabetic characters & three wildcards should be invalid
            myUC020DPInitialEnquiryUtils.setPartyName ("%C%A%");
            assertFalse ("Party Name not rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());
            mCheckStatusBarText (UC020DPInitialEnquiryUtils.ERR_MSG_TWO_WILDCARD_CHARS);

            // One alphabetic character and a non wildcard, non alphabetic character should be invalid
            myUC020DPInitialEnquiryUtils.setPartyName ("A'");
            assertFalse ("Party Name not rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());
            mCheckStatusBarText (UC020DPInitialEnquiryUtils.ERR_MSG_TWO_ALPHA_CHARS);

            // One alphabetic character and a non wildcard, non alphabetic character should be invalid
            myUC020DPInitialEnquiryUtils.setPartyName ("!B");
            assertFalse ("Party Name not rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());
            mCheckStatusBarText (UC020DPInitialEnquiryUtils.ERR_MSG_TWO_ALPHA_CHARS);

            // One alphabetic character and a non wildcard, non alphabetic character should be invalid
            myUC020DPInitialEnquiryUtils.setPartyName ("-C");
            assertFalse ("Party Name not rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());
            mCheckStatusBarText (UC020DPInitialEnquiryUtils.ERR_MSG_TWO_ALPHA_CHARS);

            // Enter valid search query for the report
            myUC020DPInitialEnquiryUtils.setPartyName ("%CLAIMANT%");
            assertTrue ("Party Name rendered invalid", myUC020DPInitialEnquiryUtils.isPartyNameValid ());

            // Run report
            myUC020DPInitialEnquiryUtils.runReport ();

            // Exit screen
            myUC020DPInitialEnquiryUtils.closeScreen ();

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
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

}