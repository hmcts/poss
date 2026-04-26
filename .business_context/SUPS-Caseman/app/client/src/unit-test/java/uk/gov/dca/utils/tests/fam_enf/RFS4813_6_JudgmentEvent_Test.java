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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;

/**
 * Automated tests for the Application to Set Aside functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_JudgmentEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

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
    public RFS4813_6_JudgmentEvent_Test()
    {
        super(RFS4813_6_JudgmentEvent_Test.class.getName());
        this.nav = new Navigator(this);
        myUC002CaseEventUtils = new UC002CaseEventUtils(this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils(this);
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Maintain Judgments screen
     * on a Family Enforcement case.
     */
    public void testAutoJudgEvents_1()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment(famEnfCase2, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR, false, false);
            
            // Exit Judgments screen to check event 140 BMS
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

            // Check 140 BMS on case and then error the event off
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            myUC002CaseEventUtils.setEventErrorFlag(true);
            
            // Return to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton(UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle(myUC004MaintainJudgmentUtils.getScreenTitle());
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName("DEFENDANT NAME");
            
            // Set the application to vary as DETERMINED which will create case event 155
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, 
            								   UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR,
            								   false);
            
            // Create another application vary to create another event 140
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST, false, true);
            
            // Set the application to vary as GRANTED which will create case event 150
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, 
											   UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST,
											   false);
            
            // Create application set aside and grant it which will create case events 160 and 170
            createApplicationToSetAside(false, false);
            
            // Exit the Judgments screen to check the BMS of the case events
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("150");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("155");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("160");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("170");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("MA031", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("MA035", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Maintain Judgments screen
     * on a County Court case.
     */
    public void testAutoJudgEvents_2()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment(ccCaseWnt1, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR, false, false);
            
            // Exit Judgments screen to check event 140 BMS
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

            // Check 140 BMS on case and then error the event off
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("JH17", myUC002CaseEventUtils.getEventBMSTask());
            myUC002CaseEventUtils.setEventErrorFlag(true);
            
            // Return to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton(UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle(myUC004MaintainJudgmentUtils.getScreenTitle());
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName("DEFENDANT NAME");
            
            // Set the application to vary as DETERMINED which will create case event 155
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, 
            								   UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR,
            								   false);
            
            // Create another application vary to create another event 140
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST, false, true);
            
            // Set the application to vary as GRANTED which will create case event 150
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, 
											   UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST,
											   false);
            
            // Create application set aside and grant it which will create case events 160 and 170
            createApplicationToSetAside(false, true);
            
            // Exit the Judgments screen to check the BMS of the case events
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("JH13", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("150");
            assertEquals("JH14", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("155");
            assertEquals("JH15", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("160");
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("170");
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("EN61", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("EN26", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Maintain Judgments screen
     * on a High Court case.
     */
    public void testAutoJudgEvents_3()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment(chCase, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR, false, false);
            
            // Exit Judgments screen to check event 140 BMS
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

            // Check 140 BMS on case and then error the event off
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("JH17", myUC002CaseEventUtils.getEventBMSTask());
            myUC002CaseEventUtils.setEventErrorFlag(true);
            
            // Return to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton(UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle(myUC004MaintainJudgmentUtils.getScreenTitle());
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName("DEFENDANT NAME");
            
            // Set the application to vary as DETERMINED which will create case event 155
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, 
            								   UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR,
            								   false);
            
            // Create another application vary to create another event 140
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST, false, true);
            
            // Set the application to vary as GRANTED which will create case event 150
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, 
											   UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST,
											   false);
            
            // Create application set aside and grant it which will create case events 160 and 170
            createApplicationToSetAside(false, true);
            
            // Exit the Judgments screen to check the BMS of the case events
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("JH13", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("150");
            assertEquals("JH14", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("155");
            assertEquals("JH15", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("160");
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("170");
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("EN61", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("EN26", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
     * Tests the BMS of the automatic case events created from the Maintain Judgments screen
     * on a CCBC case.
     */
    public void testAutoJudgEvents_4()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment(mcolCase, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR, true, false);
            
            // Exit Judgments screen to check event 140 BMS
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

            // Check 140 BMS on case and then error the event off
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("BC017", myUC002CaseEventUtils.getEventBMSTask());
            myUC002CaseEventUtils.setEventErrorFlag(true);
            
            // Return to the Judgments screen
            myUC002CaseEventUtils.clickNavigationButton(UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
            mCheckPageTitle(myUC004MaintainJudgmentUtils.getScreenTitle());
            myUC004MaintainJudgmentUtils.selectPartyAgainstByName("DEFENDANT NAME");
            
            // Set the application to vary as DETERMINED which will create case event 155
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, 
            								   UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR,
            								   true);
            
            // Create another application vary to create another event 140
            createApplicationToVary(UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST, true, true);
            
            // Set the application to vary as GRANTED which will create case event 150
            setExistingApplicationToVaryResult(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, 
											   UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST,
											   true);
            
            // Create application set aside and grant it which will create case events 160 and 170
            createApplicationToSetAside(true, true);
            
            // Exit the Judgments screen to check the BMS of the case events
            myUC004MaintainJudgmentUtils.closeScreen();
            mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("140");
            assertEquals("BC013", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("150");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("155");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("160");
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("170");
            assertEquals("BC012", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("610");
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            myUC002CaseEventUtils.selectCaseEventByEventId("620");
            assertEquals("BC028", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    
    /**
	 * Private method to handle the creation of can application to vary. After
	 * clicking Save, exits the Maintain Judgments screen and returns to the
	 * Case Events screen
	 *
	 * @param applicant
	 *            the applicant
	 * @param ccbcCase
	 *            True if a CCBC case, else false
	 * @param expectOutput
	 *            the expect output
	 */
    private void createApplicationToVary(final String applicant, final boolean ccbcCase, final boolean expectOutput)
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup();
        myUC004MaintainJudgmentUtils.raiseAddNewAppVaryPopup();
        myUC004MaintainJudgmentUtils.setAddAppVaryApplicant(applicant);
        myUC004MaintainJudgmentUtils.setAddAppVaryAmountOffered("10");
        myUC004MaintainJudgmentUtils.setAddAppVaryFrequency(UC004MaintainJudgmentUtils.FREQUENCY_WEEKLY);
        myUC004MaintainJudgmentUtils.clickAddAppVaryPopupOkButton();
        myUC004MaintainJudgmentUtils.clickAppVaryOkButton();

        // Save and exit
        if ( ccbcCase || !expectOutput )
        {
            // No special behaviour for CCBC owned cases
            myUC004MaintainJudgmentUtils.clickSaveButton();
        }
        else
        {
            // Handle word processing screens for non-CCBC cases
            myUC004MaintainJudgmentUtils.saveFollowingAppVary();
        }
    }
    
    /**
	 * Private method to set the result field on an existing application to
	 * vary. After clicking Save, exits the Maintain Judgments screen and
	 * returns to the Case Events screen
	 *
	 * @param result
	 *            The result to set
	 * @param applicant
	 *            the applicant
	 * @param ccbcCase
	 *            True if a CCBC case, else false
	 */
    private void setExistingApplicationToVaryResult(final String result, final String applicant, final boolean ccbcCase)
    {
        final String response;
        // Set the Response value accordingly based on the result
        if ( result.equals(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED) )
        {
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_ACCEPTED;
        }
        else
        {
            // Result = Referred to Judge, Determined or Refused
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_REFUSED;
        }

        // Set application to vary result and result date
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup();
        myUC004MaintainJudgmentUtils.selectAppToVaryByApplicant(applicant);
        myUC004MaintainJudgmentUtils.setAppVaryResult(result);
        myUC004MaintainJudgmentUtils.setAppVaryResultDate( AbstractBaseUtils.now() );
        myUC004MaintainJudgmentUtils.setAppVaryResponse(response);
        myUC004MaintainJudgmentUtils.setAppVaryResponseDate( AbstractBaseUtils.now() );

        if ( result.equals(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED) )
        {
            // Set Amount and Frequency fields too
            myUC004MaintainJudgmentUtils.setAppVaryAmount("5");
            myUC004MaintainJudgmentUtils.setAppVaryFrequency(UC004MaintainJudgmentUtils.FREQUENCY_FORTNIGHTLY);
        }

        myUC004MaintainJudgmentUtils.clickAppVaryOkButton();

        // Save and handle word processing then exit
        if ( !ccbcCase && ( result.equals(UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED) ||
                            result.equals(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED)))
        {
            // Non CCBC cases with result of GRANTED or IN ERROR so word processing screens to handle
            final boolean determined = result.equals(UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED);
            myUC004MaintainJudgmentUtils.saveFollowingAppVaryResultSet(determined);
        }
        else
        {
            // No word processing screens to handle
            myUC004MaintainJudgmentUtils.clickSaveButton();
        }
    }

    /**
	 * Private method to log into CaseMan, navigate to the Case Events screen
	 * and load a case.
	 *
	 * @param caseNumber
	 *            The case number to load
	 * @param judgmentAgainstPartyName
	 *            The judgment against party name
	 */
    private void loginAndLoadCaseJudgment(final String caseNumber, final String judgmentAgainstPartyName)
    {
        // Log into SUPS CaseMan
        logOn(AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu( MAINMENU_CASE_EVENTS_PATH );

        // Check in correct screen
        mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber(caseNumber);

        // Navigate to the Judgments screen
        myUC002CaseEventUtils.clickNavigationButton(UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
        mCheckPageTitle(myUC004MaintainJudgmentUtils.getScreenTitle());

        // Select appropriate judgment
        myUC004MaintainJudgmentUtils.selectPartyAgainstByName(judgmentAgainstPartyName);
    }

    /**
	 * Private method to handle the creation of can application to set aside.
	 * After clicking Save, exits the Maintain Judgments screen and returns to
	 * the Case Events screen
	 *
	 * @param ccbcCase
	 *            the ccbc case
	 * @param registered
	 *            the registered
	 */
    private void createApplicationToSetAside(final boolean ccbcCase, final boolean registered)
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup();
        myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup();
        myUC004MaintainJudgmentUtils.setSetAsideApplicant(
                UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR);
        myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton();
        
        myUC004MaintainJudgmentUtils.setSetAsideResult(UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED);
        myUC004MaintainJudgmentUtils.setSetAsideResultDate( AbstractBaseUtils.now() );
        
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton();

        // Save and handle word processing/obligations then exit
        if ( !ccbcCase && registered )
        {
            // Non CCBC cases with result of GRANTED so word processing screens to handle
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted(false);
        }
        else if ( !ccbcCase && !registered )
        {
        	myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGrantedNotRegistered();
        }
        else
        {
            // No word processing screens to handle
            myUC004MaintainJudgmentUtils.clickSaveButton();
        }
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