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
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC003TransferCaseUtils;

/**
 * Automated tests for the Case Transfer functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_TransferEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 003 transfer case utils. */
    private UC003TransferCaseUtils myUC003TransferCaseUtils;

    /** The fam enf case 1. */
    private String famEnfCase1 = "3NN00001";	// FAMILY ENF - FAMILY COURT case with AE
    
    /** The cc case. */
    private String ccCase = "3NN00003";			// County Court case with AE
    
    /** The qb case. */
    private String qbCase = "3NN00021";			// Queens Bench case
    
    /** The ccbc case. */
    private String ccbcCase = "3NN00005";		// CCBC case
    
    /** The mcol case. */
    private String mcolCase = "3NN00012";		// MCOL case

    /**
	 * Constructor.
	 */
    public RFS4813_6_TransferEvent_Test()
    {
        super(RFS4813_6_TransferEvent_Test.class.getName());
        this.nav = new Navigator(this);
        myUC002CaseEventUtils = new UC002CaseEventUtils(this);
        myUC003TransferCaseUtils = new UC003TransferCaseUtils(this);
    }

    /**
	 * Tests the BMS allocated to case event 350 on a family enforcement case.
	 */
    public void testCaseTransfer_1()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, famEnfCase1);

            // Transfer Case and return to the case events screen
            transferCase(UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);

            // Check the BMS associated with case event 350
            myUC002CaseEventUtils.selectCaseEventByEventId("350");
            assertEquals("MA013", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to case event 350 on a county court case.
	 */
    public void testCaseTransfer_2()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, ccCase);

            // Transfer Case and return to the case events screen
            transferCase(UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);

            // Check the BMS associated with case event 350
            myUC002CaseEventUtils.selectCaseEventByEventId("350");
            assertEquals("JH29", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to case event 350 on a district registry case.
	 */
    public void testCaseTransfer_3()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_WARRANT, AbstractCmTestBase.COURT_NORTHAMPTON, qbCase);

            // Transfer Case and return to the case events screen
            transferCase(UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);

            // Check the BMS associated with case event 350
            myUC002CaseEventUtils.selectCaseEventByEventId("350");
            assertEquals("DR24", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to case event 350 on a CCBC case.
	 */
    public void testCaseTransfer_4()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_CCBC_MANAGER, AbstractCmTestBase.COURT_CCBC, ccbcCase);

            // Transfer Case and return to the case events screen
            transferCase(UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);

            // Check the BMS associated with case event 350
            myUC002CaseEventUtils.selectCaseEventByEventId("350");
            assertEquals("BC029", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
    
    /**
	 * Tests the BMS allocated to case event 350 on a MCOL case.
	 */
    public void testCaseTransfer_5()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
        	loginAndLoadCase(AbstractCmTestBase.ROLE_CCBC_MANAGER, AbstractCmTestBase.COURT_CCBC, mcolCase);

            // Transfer Case and return to the case events screen
            transferCase(UC003TransferCaseUtils.TRANSREASON_CHARGING_ORD);

            // Check the BMS associated with case event 350
            myUC002CaseEventUtils.selectCaseEventByEventId("350");
            assertEquals("BC053", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            e.printStackTrace();
            fail(e.getMessage());
        }
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

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu( MAINMENU_CASE_EVENTS_PATH );

        // Check in correct screen
        mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

        // Load the case
        myUC002CaseEventUtils.loadCaseByCaseNumber(pCaseNumber);
    }
    
    /**
	 * Private method to handle the transfer of the case.
	 *
	 * @param pTransferReason
	 *            The transfer reason to use
	 * @throws Exception
	 *             Exception thrown creating event
	 */
    private void transferCase(final String pTransferReason) throws Exception
    {
        // Navigate to the Transfer Cases screen
        this.nav.selectQuicklinksMenuItem(UC002CaseEventUtils.QUICKLINK_TRANSFER_CASE);

        // Check in Transfer Cases screen
        mCheckPageTitle(myUC003TransferCaseUtils.getScreenTitle());

        myUC003TransferCaseUtils.setTransferCourtCode("180");
        myUC003TransferCaseUtils.setTransferReason( pTransferReason );
        myUC003TransferCaseUtils.setProduceNoticeCheckbox(false);
        myUC003TransferCaseUtils.clickSaveButton();
        myUC003TransferCaseUtils.closeScreen();

        // Check in Case Events screen
        mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());
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