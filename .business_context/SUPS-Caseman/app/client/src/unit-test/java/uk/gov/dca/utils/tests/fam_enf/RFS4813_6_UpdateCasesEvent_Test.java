/* Copyrights and Licenses
 * 
 * Copyright (c) 2017 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */

package uk.gov.dca.utils.tests.fam_enf;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.selenium.FrameworkException;

/**
 * Automated tests for the Application to Set Aside functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_UpdateCasesEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The fam enf case 2. */
    // Test cases
    private String famEnfCase2 = "3NN00002";	// FAMILY ENF - REMO case with judgment, AE, Home and Foreign Warrant
    
    /** The cc case wnt 1. */
    private String ccCaseWnt1 = "3NN00031";		// County Court case with Home Warrantt
    
    /** The ch case. */
    private String chCase = "3NN00011";			// Chancery case (has judgment, AE and Home & Foreign Warrant)
    
    /** The mcol case. */
    private String mcolCase = "3NN00012";		// MCOL case (has judgment and warrant (Home and Foreign))

    /**
	 * Constructor.
	 */
    public RFS4813_6_UpdateCasesEvent_Test()
    {
        super(RFS4813_6_UpdateCasesEvent_Test.class.getName());
        this.nav = new Navigator(this);
        myUC002CaseEventUtils = new UC002CaseEventUtils(this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils(this);
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Create & Update Case Details screen
     * on a Family Enforcement case.
     */
    public void testAutoUpdateCaseEvents_1()
    {
        try
        {
        	// Log in and load case
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, famEnfCase2);
            
            // Select Claimant and add new solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            addNewSolicitor();
            
            // Select Defendant and add new solicitor as well as new address
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            addNewAddress();
            addNewSolicitor();
            
            // Save Case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Select Claimant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            deselectSolicitor();
            
            // Select Defendant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            deselectSolicitor();
            
            // Save case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Navigate to the Case Events screen
            myUC001CreateUpdateCaseUtils.navigateCaseEvents();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("132");
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("34");
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("35");
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("65");
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Create & Update Case Details screen
     * on a County Court case.
     */
    public void testAutoUpdateCaseEvents_2()
    {
        try
        {
        	// Log in and load case
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, ccCaseWnt1);
            
            // Select Claimant and add new solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            addNewSolicitor();
            
            // Select Defendant and add new solicitor as well as new address
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            addNewAddress();
            addNewSolicitor();
            
            // Save Case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Select Claimant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            deselectSolicitor();
            
            // Select Defendant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            deselectSolicitor();
            
            // Save case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Navigate to the Case Events screen
            myUC001CreateUpdateCaseUtils.navigateCaseEvents();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("132");
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("34");
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("35");
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("65");
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Create & Update Case Details screen
     * on a District Registry case.
     */
    public void testAutoUpdateCaseEvents_3()
    {
        try
        {
        	// Log in and load case
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, chCase);
            
            // Select Claimant and add new solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            addNewSolicitor();
            
            // Select Defendant and add new solicitor as well as new address
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            addNewAddress();
            addNewSolicitor();
            
            // Save Case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Select Claimant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            deselectSolicitor();
            
            // Select Defendant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            deselectSolicitor();
            
            // Save case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Navigate to the Case Events screen
            myUC001CreateUpdateCaseUtils.navigateCaseEvents();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("132");
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("34");
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("35");
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("65");
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Create & Update Case Details screen
     * on a MCOL case.
     */
    public void testAutoUpdateCaseEvents_4()
    {
        try
        {
        	// Log in and load case
        	loginAndLoadCase(AbstractCmTestBase.ROLE_CCBC_MANAGER, AbstractCmTestBase.COURT_CCBC, mcolCase);
            
            // Select Claimant and add new solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            addNewSolicitor();
            
            // Select Defendant and add new solicitor as well as new address
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            addNewAddress();
            addNewSolicitor();
            
            // Save Case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Select Claimant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("CLAIMANT NAME");
            deselectSolicitor();
            
            // Select Defendant and deselect the Solicitor
            myUC001CreateUpdateCaseUtils.selectPartyByName("DEFENDANT NAME");
            deselectSolicitor();
            
            // Save case to create automatic events
            myUC001CreateUpdateCaseUtils.saveCase();
            
            // Navigate to the Case Events screen
            myUC001CreateUpdateCaseUtils.navigateCaseEvents();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("132");
            assertEquals("BC054", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("34");
            assertEquals("BC054", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("35");
            assertEquals("BC054", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("65");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
	 * Logs in and loads the cases screen.
	 *
	 * @param pUserRole
	 *            The role of the user logging in
	 * @param pUserCourt
	 *            The court of the user logging in
	 * @param pCaseNumber
	 *            The case number to load
	 */
    private void loginAndLoadCase(final String pUserRole, final int pUserCourt, final String pCaseNumber)
    {
    	// Log into SUPS CaseMan
        logOn(pUserCourt, pUserRole);

        // Navigate to the Create/Update Cases screen
        this.nav.navigateFromMainMenu( MAINMENU_CREATE_CASE_PATH );

        // Check in correct screen
        mCheckPageTitle(myUC001CreateUpdateCaseUtils.getScreenTitle());

        // Load the case
        myUC001CreateUpdateCaseUtils.setCaseNumber(pCaseNumber);
    }
    
    /**
	 * Helper function to add a new solicitor.
	 *
	 * @throws FrameworkException
	 *             Exception thrown when adding a solicitor
	 */
    private void addNewSolicitor() throws FrameworkException
    {
    	myUC001CreateUpdateCaseUtils.addNewSolicitor();
        myUC001CreateUpdateCaseUtils.setNewSolicitorName("SOLICITOR NAME");
        myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine1("SOLICITOR ADLINE1");
        myUC001CreateUpdateCaseUtils.setNewSolicitorAddrLine2("SOLICITOR ADLINE2");
        myUC001CreateUpdateCaseUtils.newSolicitorClickOk();
        myUC001CreateUpdateCaseUtils.clickNotificationPopupClose();
    }
    
    /**
	 * Helper function to add a new address.
	 *
	 * @throws FrameworkException
	 *             Exception thrown when adding address
	 */
    private void addNewAddress() throws FrameworkException
    {
    	myUC001CreateUpdateCaseUtils.addNewNonSolAddress();
        myUC001CreateUpdateCaseUtils.setNewNonSolAddrLine1("NEW ADLINE1");
        myUC001CreateUpdateCaseUtils.setNewNonSolAddrLine2("NEW ADLINE2");
        myUC001CreateUpdateCaseUtils.newNonSolAddressClickOk();
        myUC001CreateUpdateCaseUtils.clickNotificationPopupClose();
    }
    
    /**
	 * Helper function to deselect a solicitor.
	 *
	 * @throws FrameworkException
	 *             Exception thrown when deselecting a solicitor
	 */
    private void deselectSolicitor() throws FrameworkException
    {
    	myUC001CreateUpdateCaseUtils.selectTabbedPage(UC001CreateUpdateCaseUtils.TABBED_PAGE_CLAIMANT);
        myUC001CreateUpdateCaseUtils.setSelectSolicitor("No Solicitor");
        myUC001CreateUpdateCaseUtils.clickNotificationPopupClose();
    }

    /**
	 * Private function which checks the current screen title against the
	 * expected screen title.
	 *
	 * @param control
	 *            The expected screen title
	 */
    private void mCheckPageTitle(final String control)
    {
        assertTrue( "Page title does not contain pattern '" + control + "'", ( session.getPageTitle().indexOf(control) != -1 ) );
    }

}