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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 1909. This covers a change to the BMS Tasks
 * created when Foreign Warrants are created via the online screens. Foreign Warrants
 * created on the Create Foreign Warrants screen should only record EN67, while all others
 * should create BMS Task EN3.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1909_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 030 create foreign warrant utils. */
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;
    
    /** The my UC 039 maintain warrant utils. */
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /** The test case number warrant. */
    // Case Number to use
    private String testCaseNumberWarrant = "9NN00001";
    
    /** The test case number no warrant. */
    private String testCaseNumberNoWarrant = "9NN00002";

    /**
     * Constructor.
     */
    public CaseManTrac1909_Test ()
    {
        super (CaseManTrac1909_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
        myUC030CreateForeignWarrantUtils = new UC030CreateForeignWarrantUtils (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Tests that when a Foreign Warrant is created via the Create Foreign Warrants screen, only
     * the BMS Task EN67 is counted for the Executing Court.
     */
    public void testforeignWarrantBMS1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Foreign Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("170");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("9CH00001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("X0000009");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline3 ("Party For Rep Adline3");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline4 ("Party For Rep Adline4");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline5 ("Party For Rep Adline5");
            myUC030CreateForeignWarrantUtils.setPartyForRepPostcode ("TF3 4NT");
            myUC030CreateForeignWarrantUtils.setPartyForRepDX ("Party For Rep DX");
            myUC030CreateForeignWarrantUtils.setPartyForRepTelephone ("11111 111111");
            myUC030CreateForeignWarrantUtils.setPartyForRepFax ("22222 222222");
            myUC030CreateForeignWarrantUtils.setPartyForRepEmail ("partyforrep@email.com");
            myUC030CreateForeignWarrantUtils.setPartyForRepReference ("Party For Rep Reference");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline3 ("Party Against One Adline3");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline4 ("Party Against One Adline4");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline5 ("Party Against One Adline5");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOnePostcode ("TF3 5NT");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoName ("Party Against Two Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline1 ("Party Against Two Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline2 ("Party Against Two Adline2");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline3 ("Party Against Two Adline3");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline4 ("Party Against Two Adline4");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline5 ("Party Against Two Adline5");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoPostcode ("TF3 6NT");

            // Set the footer fields
            myUC030CreateForeignWarrantUtils.setBailiffAreaNumber ("1");
            myUC030CreateForeignWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC030CreateForeignWarrantUtils.clickSaveButton ();

            // Check the BMS Task Counts
            assertTrue ("BMS Task EN67 for Northampton expected but not created",
                    DBUtil.getBMSTaskCount ("EN67", "282") == 1);
            assertTrue ("BMS Task EN67 for Coventry created but not expected",
                    DBUtil.getBMSTaskCount ("EN67", "180") == 0);
            assertTrue ("BMS Task EN3 for Northampton created but not expected",
                    DBUtil.getBMSTaskCount ("EN3", "282") == 0);
            assertTrue ("BMS Task EN3 for Coventry created but not expected",
                    DBUtil.getBMSTaskCount ("EN3", "180") == 0);

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant is created via the Create Home Warrants screen and the
     * Executing court is set to another SUPS Court (thus automatically creating a Foreign Warrant),
     * only the BMS Task EN3 is counted for the Executing Court.
     */
    public void testforeignWarrantBMS2 ()
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
            myUC029CreateHomeWarrantUtils.setCaseNumber (testCaseNumberNoWarrant);

            // Set the footer fields
            myUC029CreateHomeWarrantUtils.setBailiffAreaNumber ("1");
            myUC029CreateHomeWarrantUtils.setAdditionalDetails ("Additional Details");
            myUC029CreateHomeWarrantUtils.setExecutingCourtCode ("180");

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.setWarrantFee ("50.00");
            myUC029CreateHomeWarrantUtils.setSolicitorsCosts ("100.00");
            myUC029CreateHomeWarrantUtils.setLandRegistryFee ("25.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC029CreateHomeWarrantUtils.clickSaveButton ();

            // Check the BMS Task Counts
            assertTrue ("BMS Task EN67 for Northampton created but not expected",
                    DBUtil.getBMSTaskCount ("EN67", "282") == 0);
            assertTrue ("BMS Task EN67 for Coventry created but not expected",
                    DBUtil.getBMSTaskCount ("EN67", "180") == 0);
            assertTrue ("BMS Task EN3 for Northampton created but not expected",
                    DBUtil.getBMSTaskCount ("EN3", "282") == 0);
            assertTrue ("BMS Task EN3 for Coventry expected but not created",
                    DBUtil.getBMSTaskCount ("EN3", "180") == 1);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Warrant is forwarded to another SUPS Court via the Maintain/Query Warrants screen
     * (thus automatically creating a Foreign Warrant), only the BMS Task EN3 is counted for the Executing Court.
     */
    public void testforeignWarrantBMS3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC039MaintainWarrantUtils.setCaseNumber (testCaseNumberWarrant);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            myUC039MaintainWarrantUtils.setExecutingCourtCode ("180");

            myUC039MaintainWarrantUtils.clickSaveButton ();

            // Check the BMS Task Counts
            assertTrue ("BMS Task EN67 for Northampton created but not expected",
                    DBUtil.getBMSTaskCount ("EN67", "282") == 0);
            assertTrue ("BMS Task EN67 for Coventry created but not expected",
                    DBUtil.getBMSTaskCount ("EN67", "180") == 0);
            assertTrue ("BMS Task EN3 for Northampton created but not expected",
                    DBUtil.getBMSTaskCount ("EN3", "282") == 0);
            assertTrue ("BMS Task EN3 for Coventry expected but not created",
                    DBUtil.getBMSTaskCount ("EN3", "180") == 1);

            myUC039MaintainWarrantUtils.closeScreen ();
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