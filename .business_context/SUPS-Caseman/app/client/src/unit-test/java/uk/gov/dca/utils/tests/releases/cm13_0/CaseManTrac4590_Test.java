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

package uk.gov.dca.utils.tests.releases.cm13_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4590_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The cred petition case. */
    // Case numbers to use in the tests
    private String credPetitionCase = "1NN00001";
    
    /** The debt petition case. */
    private String debtPetitionCase = "1NN00002";
    
    /** The winding petition case. */
    private String windingPetitionCase = "1NN00003";
    
    /** The app int order case. */
    private String appIntOrderCase = "1NN00004";
    
    /** The app set stat demd case. */
    private String appSetStatDemdCase = "1NN00005";
    
    /** The company admin order case. */
    private String companyAdminOrderCase = "1NN00006";

    /**
     * Constructor.
     */
    public CaseManTrac4590_Test ()
    {
        super (CaseManTrac4590_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests Warrant creation on Insolvency Case Type CREDITORS PETITION.
     */
    public void testCreditorsPetitionCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (credPetitionCase);

            // Check default Warrant Type is POSSESSION
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CREDITOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Try creating a COMMITTAL Warrant on the same Case

            myUC029CreateHomeWarrantUtils.setCaseNumber (credPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);

            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CREDITOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("INSOLVENCY PRACTITIONER ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());
            assertEquals ("INSOLVENCY PRACTITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst2Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (credPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation on Insolvency Case Type DEBTORS PETITION.
     */
    public void testDebtorsPetitionCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (debtPetitionCase);

            // Check default Warrant Type is POSSESSION
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("OFFICIAL RECEIVER ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("OFFICIAL RECEIVER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("OFFICIAL RECEIVER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Try creating a COMMITTAL Warrant on the same Case

            myUC029CreateHomeWarrantUtils.setCaseNumber (debtPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);

            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("DEBTOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("CREDITIOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("OFFICIAL RECEIVER ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("CREDITIOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());
            assertEquals ("OFFICIAL RECEIVER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst2Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (debtPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation on Insolvency Case Type WINDING UP PETITION.
     */
    public void testWindingUpPetitionCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (windingPetitionCase);

            // Check default Warrant Type is POSSESSION
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("PETITIONER ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("COMPANY ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("PETITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("PETITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("COMPANY ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Try creating a COMMITTAL Warrant on the same Case

            myUC029CreateHomeWarrantUtils.setCaseNumber (windingPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);

            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("COMPANY ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("CREDITOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("PETITIONER ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("COMPANY ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("COMPANY ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());
            assertEquals ("PETITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst2Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (windingPetitionCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation on Insolvency Case Type APP INT ORD (INSOLV).
     */
    public void testAppIntOrdInsolvCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (appIntOrderCase);

            // Check default Warrant Type is POSSESSION
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("INSOLVENCY PRACTITIONER ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("INSOLVENCY PRACTITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("INSOLVENCY PRACTITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Try creating a COMMITTAL Warrant on the same Case

            myUC029CreateHomeWarrantUtils.setCaseNumber (appIntOrderCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);

            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("OFFICIAL RECEIVER ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("DEBTOR ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("OFFICIAL RECEIVER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("OFFICIAL RECEIVER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("DEBTOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (appIntOrderCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation on Insolvency Case Type APP TO SET STAT DEMD.
     */
    public void testApptoSetStatDemdCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (appSetStatDemdCase);

            // Check default Warrant Type is COMMITTAL
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("APPLICANT ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("CREDITOR ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("APPLICANT ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("APPLICANT ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (appSetStatDemdCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation on Insolvency Case Type COMPANY ADMIN ORDER.
     */
    public void testCompanyAdminOrderCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (companyAdminOrderCase);

            // Check default Warrant Type is POSSESSION
            assertEquals (UC029CreateHomeWarrantUtils.WARRANT_TYPE_POSSESSION,
                    myUC029CreateHomeWarrantUtils.getWarrantType ());

            // Set Party For and Party Against grids
            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("CREDITOR ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("COMPANY ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("CREDITOR ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("COMPANY ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Try creating a COMMITTAL Warrant on the same Case

            myUC029CreateHomeWarrantUtils.setCaseNumber (companyAdminOrderCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);

            myUC029CreateHomeWarrantUtils.clickPartyForGridRow ("PETITIONER ONE NAME");
            myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow ("COMPANY ONE NAME");

            // Check Warrant Party For and Party Against Names
            assertEquals ("PETITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForName ());
            assertEquals ("PETITIONER ONE NAME", myUC029CreateHomeWarrantUtils.getPartyForRepName ());
            assertEquals ("COMPANY ONE NAME", myUC029CreateHomeWarrantUtils.getPartyAgainst1Name ());

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check validation preventing creation of DELIVERY and EXECUTION Warrants on Insolvency Cases

            myUC029CreateHomeWarrantUtils.setCaseNumber (companyAdminOrderCase);
            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_DELIVERY);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");

            myUC029CreateHomeWarrantUtils.setWarrantType (UC029CreateHomeWarrantUtils.WARRANT_TYPE_CONTROL);

            // Check field is invalid
            assertFalse ("Warrant Type is valid when should be invalid",
                    myUC029CreateHomeWarrantUtils.isWarrantTypeValid ());
            myUC029CreateHomeWarrantUtils.setFocusOnWarrantType ();
            mCheckStatusBarText ("Only COMMITTAL or POSSESSION Warrants can be created on insolvency cases.");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Other Possession Address button is enabled for the insolvency case types.
     */
    public void testOtherPossessionAddressEnablement ()
    {
        try
        {
            final String[] caseTypes = {UC001CreateUpdateCaseUtils.CASE_TYPE_APP_INT_ORD,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_APP_STAT_DEMD,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CRED_PETITION,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_DEBT_PETITION,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_WINDING_PETITION,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_COMPANY_ADMIN_ORDER};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start to create a case (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A14NN001");

            for (int i = 0, l = caseTypes.length; i < l; i++)
            {
                myUC001CreateUpdateCaseUtils.setCaseType (caseTypes[i]);

                assertTrue ("Other Possession Address button is disabled when should be enabled",
                        myUC001CreateUpdateCaseUtils.isOtherPossnAddressButtonEnabled ());
            }
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