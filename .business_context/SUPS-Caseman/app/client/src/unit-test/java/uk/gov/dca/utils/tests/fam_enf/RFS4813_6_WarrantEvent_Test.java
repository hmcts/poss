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
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;
import uk.gov.dca.utils.screens.UC031ReissueWarrantUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the Case Transfer functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_WarrantEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 029 create home warrant utils. */
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 031 reissue warrant utils. */
    private UC031ReissueWarrantUtils myUC031ReissueWarrantUtils;

    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002";	// FAMILY ENF - REMO case with judgment and AE
    
    /** The cc case wnt 1. */
    private String ccCaseWnt1 = "3NN00031";		// County Court case
    
    /** The ch case. */
    private String chCase = "3NN00011";			// Chancery case (has judgment and AE)
    
    /** The ccbc case. */
    private String ccbcCase = "3NN00005";		// CCBC case with judgment
    
    /** The mcol case. */
    private String mcolCase = "3NN00012";		// MCOL case with judgment

    /**
	 * Constructor.
	 */
    public RFS4813_6_WarrantEvent_Test()
    {
        super(RFS4813_6_WarrantEvent_Test.class.getName());
        this.nav = new Navigator(this);
        myUC002CaseEventUtils = new UC002CaseEventUtils(this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils(this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils(this);
        myUC031ReissueWarrantUtils = new UC031ReissueWarrantUtils(this);
    }

    /**
	 * Tests the BMS allocated to automatic warrant case events on a family
	 * enforcement case.
	 */
    public void testWarrantEvents_1()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, famEnfCase2);

            // Create the Home CONTROL warrant
            final String warrantNumber1 = createControlWarrant();
            
            // Create the Home COMMITTAL warrant
            createCommittalWarrant(famEnfCase2);
            
            // Exit screen and navigate to the Warrant Returns screen
            navigateToWarrantReturns();
            
            // Load the CONTROL warrant and create an interim and a foreign return
            createWarrantReturns(warrantNumber1);
            
            // Exit screen and navigate to the Reissue Warrant screen
            navigateToReissueWarrant();

            // Reissue the warrant
            reissueWarrant(famEnfCase2, warrantNumber1);
            
            // Exit screen and navigate to the Case Events screen
            navigateToCaseEvents(famEnfCase2);
            
            // Check the BMS associated with the automatic case events
            myUC002CaseEventUtils.selectCaseEventByEventId("380");
            assertEquals("MA014", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("458");
            assertEquals("MA021", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("MA031", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("MA035", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("630");
            assertEquals("MA036", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to automatic warrant case events on a county
	 * court case.
	 */
    public void testWarrantEvents_2()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, ccCaseWnt1);

            // Create the Home CONTROL warrant
            final String warrantNumber1 = createControlWarrant();
            
            // Create the Home COMMITTAL warrant
            createCommittalWarrant(ccCaseWnt1);
            
            // Exit screen and navigate to the Warrant Returns screen
            navigateToWarrantReturns();
            
            // Load the CONTROL warrant and create an interim and a foreign return
            createWarrantReturns(warrantNumber1);
            
            // Exit screen and navigate to the Reissue Warrant screen
            navigateToReissueWarrant();

            // Reissue the warrant
            reissueWarrant(ccCaseWnt1, warrantNumber1);
            
            // Exit screen and navigate to the Case Events screen
            navigateToCaseEvents(ccCaseWnt1);
            
            // Check the BMS associated with the automatic case events
            myUC002CaseEventUtils.selectCaseEventByEventId("380");
            assertEquals("EN1", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("458");
            assertEquals("EN15", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("EN61", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("EN26", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("630");
            assertEquals("EN2", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to automatic warrant case events on a district
	 * registry case.
	 */
    public void testWarrantEvents_3()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, chCase);

            // Create the Home CONTROL warrant
            final String warrantNumber1 = createControlWarrant();
            
            // Create the Home COMMITTAL warrant
            createCommittalWarrant(chCase);
            
            // Exit screen and navigate to the Warrant Returns screen
            navigateToWarrantReturns();
            
            // Load the CONTROL warrant and create an interim and a foreign return
            createWarrantReturns(warrantNumber1);
            
            // Exit screen and navigate to the Reissue Warrant screen
            navigateToReissueWarrant();

            // Reissue the warrant
            reissueWarrant(chCase, warrantNumber1);
            
            // Exit screen and navigate to the Case Events screen
            navigateToCaseEvents(chCase);
            
            // Check the BMS associated with the automatic case events
            myUC002CaseEventUtils.selectCaseEventByEventId("380");
            assertEquals("EN1", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("458");
            assertEquals("EN15", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("EN61", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("EN26", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("630");
            assertEquals("EN2", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to automatic warrant case events on a CCBC case.
	 */
    public void testWarrantEvents_4()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, ccbcCase);

            // Create the Home CONTROL warrant
            createControlWarrant();
            
            // Create the Home COMMITTAL warrant
            final String warrantNumber2 = createCommittalWarrant(ccbcCase);
            
            // Exit screen and navigate to the Warrant Returns screen
            navigateToWarrantReturns();
            
            // Load the CONTROL warrant and create an interim and a foreign return
            createWarrantReturns(warrantNumber2);
            
            // Exit screen and navigate to the Reissue Warrant screen
            navigateToReissueWarrant();

            // Reissue the warrant
            reissueWarrant(ccbcCase, warrantNumber2);
            
            // Exit screen and navigate to the Case Events screen
            navigateToCaseEvents(ccbcCase);
            
            // Check the BMS associated with the automatic case events
            myUC002CaseEventUtils.selectCaseEventByEventId("380");
            assertEquals("BC009", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("458");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("BC028", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("630");
            assertEquals("BC011", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to automatic warrant case events on a MCOL case.
	 */
    public void testWarrantEvents_5()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, mcolCase);

            // Create the Home CONTROL warrant
            createControlWarrant();
            
            // Create the Home COMMITTAL warrant
            final String warrantNumber2 = createCommittalWarrant(mcolCase);
            
            // Exit screen and navigate to the Warrant Returns screen
            navigateToWarrantReturns();
            
            // Load the CONTROL warrant and create an interim and a foreign return
            createWarrantReturns(warrantNumber2);
            
            // Exit screen and navigate to the Reissue Warrant screen
            navigateToReissueWarrant();

            // Reissue the warrant
            reissueWarrant(mcolCase, warrantNumber2);
            
            // Exit screen and navigate to the Case Events screen
            navigateToCaseEvents(mcolCase);
            
            // Check the BMS associated with the automatic case events
            myUC002CaseEventUtils.selectCaseEventByEventId("380");
            assertEquals("BC009", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("458");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("BC028", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("630");
            assertEquals("BC063", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Assuming that a case has been loaded and party for/against selected,
	 * completes the details for a CONTROL warrant and saves returning the new
	 * warrant number.
	 *
	 * @return The new warrant number
	 */
    private String createControlWarrant()
    {
    	myUC029CreateHomeWarrantUtils.setExecutingCourtCode("282");
    	myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton(); // Raise popup
        myUC029CreateHomeWarrantUtils.setBalanceOfDebt("500.00");
        myUC029CreateHomeWarrantUtils.setAmountOfWarrant("450.00");
        myUC029CreateHomeWarrantUtils.setWarrantFee("50.00");
        myUC029CreateHomeWarrantUtils.setSolicitorsCosts("100.00");
        myUC029CreateHomeWarrantUtils.setLandRegistryFee("25.00");
        myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk();    // Close popup
        final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber();
        return warrantNumber;
    }
    
    /**
	 * Creates a COMMITTAL warrant and saves returning the new warrant number.
	 *
	 * @param pCaseNumber
	 *            the case number
	 * @return The new warrant number
	 */
    private String createCommittalWarrant(final String pCaseNumber)
    {
    	myUC029CreateHomeWarrantUtils.setCaseNumber(pCaseNumber);
        myUC029CreateHomeWarrantUtils.setWarrantType(UC029CreateHomeWarrantUtils.WARRANT_TYPE_COMMITTAL);
        myUC029CreateHomeWarrantUtils.clickPartyForGridRow("CLAIMANT NAME");
        myUC029CreateHomeWarrantUtils.clickPartyAgainstGridRow("DEFENDANT NAME");
        myUC029CreateHomeWarrantUtils.setExecutingCourtCode("282");
        final String warrantNumber = myUC029CreateHomeWarrantUtils.saveAndReturnWarrantNumber();
        return warrantNumber;
    }
    
    /**
	 * Loads the warrant record in the Warrant Returns screen and creates an
	 * interim and a final return.
	 *
	 * @param warrantNumber
	 *            Warrant Number
	 * @throws Exception
	 *             Exception could be thrown
	 */
    private void createWarrantReturns(final String warrantNumber) throws Exception
    {
    	// Load the warrant record
    	myUC045WarrantReturnsUtils.setWarrantNumber(warrantNumber);
        myUC045WarrantReturnsUtils.clickSearchButton();
        
        // If a warrant return already exists then error it off
        if ( myUC045WarrantReturnsUtils.isErrorFlagEnabled() )
        {
        	myUC045WarrantReturnsUtils.setEventErrorFlag(true);
        }
    	
    	// Add an interim warrant return
        final NewStandardEvent testEventAD = new NewStandardEvent("WarrantReturn-AD");
        testEventAD.setSubjectParty("DEFENDANT NAME");
        myUC045WarrantReturnsUtils.addNewEvent(testEventAD, null);
        
        // Add a final return
        final NewStandardEvent testEvent121 = new NewStandardEvent("WarrantReturn-121");
        testEvent121.setSubjectParty("DEFENDANT NAME");
        myUC045WarrantReturnsUtils.addNewEvent(testEvent121, null);
    }
    
    /**
	 * Loads a warrant in the Reissue Warrants screen and reissues the warrant.
	 *
	 * @param caseNumber
	 *            Case Number
	 * @param warrantNumber
	 *            Warrant Number
	 */
    private void reissueWarrant(final String caseNumber, final String warrantNumber)
    {
    	// Set the Header fields and load warrant record
        myUC031ReissueWarrantUtils.setCaseNumber(caseNumber);
        myUC031ReissueWarrantUtils.setWarrantNumber(warrantNumber);
        myUC031ReissueWarrantUtils.clickSearchButton();
        
        // Reissue the warrant
        myUC031ReissueWarrantUtils.setBalanceOfDebt("1.00");
        myUC031ReissueWarrantUtils.setAmountOfWarrant("1.00");
        myUC031ReissueWarrantUtils.clickSaveButton();
    }

    /**
	 * Logs in and loads the case events screen.
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

        // Navigate to the Home Warrants screen
        this.nav.navigateFromMainMenu( MAINMENU_HOME_WARRANTS_PATH );

        // Check in correct screen
        mCheckPageTitle(myUC029CreateHomeWarrantUtils.getScreenTitle());

        // Load the case
        myUC029CreateHomeWarrantUtils.setCaseNumber(pCaseNumber);
    }
    
    /**
	 * Navigates from the Create Home Warrants screen to the Warrant Returns
	 * screen.
	 */
    private void navigateToWarrantReturns()
    {
    	myUC029CreateHomeWarrantUtils.closeScreen();
        this.nav.navigateFromMainMenu( MAINMENU_RESET );
        this.nav.navigateFromMainMenu( MAINMENU_WARRANT_RETURNS_PATH );
        mCheckPageTitle(myUC045WarrantReturnsUtils.getScreenTitle());
    }
    
    /**
	 * Navigates from the Warrant Returns screen to the Reissue Warrants screen.
	 */
    private void navigateToReissueWarrant()
    {
    	myUC045WarrantReturnsUtils.closeScreen();
        this.nav.navigateFromMainMenu( MAINMENU_RESET );
        this.nav.navigateFromMainMenu( MAINMENU_REISSUE_WARRANTS_PATH );
        mCheckPageTitle(myUC031ReissueWarrantUtils.getScreenTitle());
    }
    
    /**
	 * Navigates from the Reissue Warrants screen to the Case Events screen and
	 * loads a case number.
	 *
	 * @param caseNumber
	 *            the case number
	 */
    private void navigateToCaseEvents(final String caseNumber)
    {
    	myUC031ReissueWarrantUtils.closeScreen();
        this.nav.navigateFromMainMenu( MAINMENU_RESET );
        this.nav.navigateFromMainMenu( MAINMENU_CASE_EVENTS_PATH );
        mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
        
        myUC002CaseEventUtils.loadCaseByCaseNumber(caseNumber);
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