/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 9615 $
 * $Author: vincentcp $
 * $Date: 2012-08-06 15:13:43 +0100 (Mon, 06 Aug 2012) $
 *
 * Change history
 * 29/07/2009 - Chris Vincent: Outstanding Payment validation checks removed (TRAC 1155)
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm24_7;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Coded Party Cascaded Update on Warrants.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4704_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4704_Test ()
    {
        super (CaseManTrac4704_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
    }

    /**
     * Warrant associated with Northampton's Local Coded Party 100 which has been updated.
     * Check that the Home Warrant and any Foreign Warrants have been updated correctly.
     */
    public void testCascadedWarrantUpdate1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load first Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NN LCP100 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00001");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NN LCP100 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load second Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00002");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NN LCP100 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00002");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00002");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NN LCP100 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the second Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00002");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA01001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NN LCP100 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Warrant associated with Northampton's Local Coded Party 101 and sent to Coventry
     * where the Coventry LCP 101 has been updated.
     * Check that the Home Warrant and any Foreign Warrants have not been updated.
     */
    public void testCascadedWarrantUpdate2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load first Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00003");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00003");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00003");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have not been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load second Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00004");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details not have been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00004");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00004");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have not been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the second Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00004");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA01002");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have not been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Warrant associated with Non CPC National Coded Party 7000 which has been updated.
     * Check that the Home Warrant and any Foreign Warrants have been updated correctly.
     */
    public void testCascadedWarrantUpdate3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load first Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00005");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NCPC CP7000 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
            assertEquals ("NCPC CP7000 NEW ADLINE4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 ());
            assertEquals ("NCPC CP7000 NEW ADLINE5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00005");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00005");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NCPC CP7000 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
            assertEquals ("NCPC CP7000 NEW ADLINE4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 ());
            assertEquals ("NCPC CP7000 NEW ADLINE5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load second Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00006");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NCPC CP7000 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
            assertEquals ("NCPC CP7000 NEW ADLINE4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 ());
            assertEquals ("NCPC CP7000 NEW ADLINE5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00006");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00006");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NCPC CP7000 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
            assertEquals ("NCPC CP7000 NEW ADLINE4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 ());
            assertEquals ("NCPC CP7000 NEW ADLINE5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the second Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2NN00006");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA01003");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
            assertEquals ("NCPC CP7000 NEW ADLINE3", myUC039MaintainWarrantUtils.getPartyForSolAdline3 ());
            assertEquals ("NCPC CP7000 NEW ADLINE4", myUC039MaintainWarrantUtils.getPartyForSolAdline4 ());
            assertEquals ("NCPC CP7000 NEW ADLINE5", myUC039MaintainWarrantUtils.getPartyForSolAdline5 ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Warrant associated with CCBC National Coded Party 1700 which has been updated.
     * Check that the Home Warrant and any Foreign Warrants have been updated correctly.
     */
    public void testCascadedWarrantUpdate4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load first Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00001");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00101");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load second Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00002");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00002");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00102");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the second Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00002");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00007");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Warrant associated with CCBC National Coded Party 7355 which has been updated.
     * Check that the Home Warrant and any Foreign Warrants have been updated correctly.
     */
    public void testCascadedWarrantUpdate5 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Load first Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00003");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00003");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00103");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load second Home Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00004");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00004");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00104");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Load the second Foreign Warrant
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("");
            myUC039MaintainWarrantUtils.setIssuingCourtCode ("335");
            myUC039MaintainWarrantUtils.setCaseNumber ("2QA00004");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber ("FWA00008");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks manually created Foreign Warrants to ensure they are created successfully.
     */
    public void testCascadedWarrantUpdate6 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Run cascaded update script
            DBUtil.runCascadedCodedPartyUpdateScript ();

            // Navigate to the Maintain Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Manually created foreign warrant linked to National Coded Party that has changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00003");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 1700 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP1700 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP1700 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to a Northampton LCP that has changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00001");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 100 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP100 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP100 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to a Non-CPC National Coded Party that has changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00006");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 7000 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP7000 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP7000 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to National Coded Party that has changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00004");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7355 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7355 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7355 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to Coventry LCP that has changed
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00008");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CV LCP 101 NEW NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CV LCP101 NEW ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CV LCP101 NEW ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to Coventry LCP that has NOT changed
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("180");
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00009");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CV LCP 100 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CV LCP100 ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CV LCP100 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to Northampton LCP that has NOT changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00002");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NN LCP 101 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NN LCP101 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to a Non-CPC National Coded Party that has NOT changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00007");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("NON CPC NCP 8500 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("NCPC CP8500 ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("NCPC CP8500 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

            // Manually created foreign warrant linked to a CCBC National Coded Party that has NOT changed
            myUC039MaintainWarrantUtils.setCaseNumber ("0NN00005");
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Check party for solicitor details have been updated
            assertEquals ("CCBC NCP 7600 NAME", myUC039MaintainWarrantUtils.getPartyForSolName ());
            assertEquals ("CCBC NCP7600 ADLINE1", myUC039MaintainWarrantUtils.getPartyForSolAdline1 ());
            assertEquals ("CCBC NCP7600 ADLINE2", myUC039MaintainWarrantUtils.getPartyForSolAdline2 ());

            // Clear Warrants screen
            myUC039MaintainWarrantUtils.clickClearButton ();

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