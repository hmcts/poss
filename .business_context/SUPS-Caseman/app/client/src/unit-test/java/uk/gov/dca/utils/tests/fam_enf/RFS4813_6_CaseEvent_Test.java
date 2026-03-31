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

package uk.gov.dca.utils.tests.fam_enf;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests the BMS Changes in the Family Enforcement Changes.
 *
 * @author Chris Vincent
 */
public class RFS4813_6_CaseEvent_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The fam enf case 1. */
    // Test cases
    private String famEnfCase1 = "3NN00001"; // FAMILY ENF - FAMILY COURT case with AE and Home Warrant
    
    /** The fam enf case 2. */
    private String famEnfCase2 = "3NN00002"; // FAMILY ENF - REMO case with judgment, AE, Home and Foreign Warrant
    
    /** The cc case. */
    private String ccCase = "3NN00003"; // County Court case with AE
    
    /** The cc case wnt 1. */
    private String ccCaseWnt1 = "3NN00031"; // County Court case with Home Warrant
    
    /** The ch case. */
    private String chCase = "3NN00011"; // Chancery case (has judgment, AE and Home & Foreign Warrant)
    
    /** The qb case. */
    private String qbCase = "3NN00021"; // Queens Bench case (has AE and Home Warrant)
    
    /** The ccbc case. */
    private String ccbcCase = "3NN00005"; // CCBC case
    
    /** The mcol case. */
    private String mcolCase = "3NN00012"; // MCOL case (has judgment and warrant (Home and Foreign))
    
    /** The insolv case. */
    private String insolvCase = "A15NN001"; // Insolvency case

    /**
     * Constructor.
     */
    public RFS4813_6_CaseEvent_Test ()
    {
        super (RFS4813_6_CaseEvent_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }
    
    /**
     * Checks BMS allocated to Case Event 11 - Bhavesh Parmar 20/10/2016.
     */
    public void testCaseEvent11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent ("11");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("WhatEvidenceIsAttached", this));

            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("MA004", myUC002CaseEventUtils.getEventBMSTask ());

            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (ccCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("JH11", myUC002CaseEventUtils.getEventBMSTask ());

            // Load High Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (chCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("DR18", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks BMS allocated to Case Event 12.
     */
    public void testCaseEvent12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent ("12");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (false);

            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("MA005", myUC002CaseEventUtils.getEventBMSTask ());

            // Load County Court Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber (ccCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("IS15", myUC002CaseEventUtils.getEventBMSTask ());

            // Load High Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (chCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("IS15", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks BMS allocated to Case Event 14 - Bhavesh Parmar 09/11/2016.
     */
    public void testCaseEvent14 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent ("14");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PartyMakingTheApplication3LOVButton", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DocumentToBeServed2", this));

            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("MA004", myUC002CaseEventUtils.getEventBMSTask ());

            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (ccCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("JH11", myUC002CaseEventUtils.getEventBMSTask ());

            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (chCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
            assertEquals ("DR18", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks BMS allocated to Case Event 15.
     */
    public void testCaseEvent15()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("15");
            testEvent.setProduceOutputFlag(false);         
            testEvent.setNavigateObligations(true);
                        
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 16.
     */
    public void testCaseEvent16()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("16");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion>();
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("PartyMakingTheApplication4LOVButton", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("ServiceToBeDispensedOnLOVButton", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("DocumentToWhichApplicationRelates", this));
            eventQuestions.add(VariableDataQuestion.getDefaultVDQuestion("SupportingEvidence", this));
            
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("MA004", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, eventQuestions);
            assertEquals("DR18", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 17.
     */
    public void testCaseEvent17()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("17");
            testEvent.setInstigatorParty("CLAIMANT NAME");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
            
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 18.
     */
    public void testCaseEvent18 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase (famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent ("18");
            testEvent.setProduceOutputFlag (false);

            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("MA007", myUC002CaseEventUtils.getEventBMSTask ());

            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (ccCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("JH32", myUC002CaseEventUtils.getEventBMSTask ());

            // Load High Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber (chCase);
            myUC002CaseEventUtils.addNewEvent (testEvent, null);
            assertEquals ("DR34", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 19.
     */
    public void testCaseEvent19()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("19");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                     
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
    
    /**
     * Checks BMS allocated to Case Event 20.
     */
    public void testCaseEvent20()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("20");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                     
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA008", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS6", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR17", myUC002CaseEventUtils.getEventBMSTask());
          }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
    
    /**
     * Checks BMS allocated to Case Event 23.
     */
    public void testCaseEvent23()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("23");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
            
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
    
    /**
     * Checks BMS allocated to Case Event 30.
     */
    public void testCaseEvent30()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("30");
            testEvent.setProduceOutputFlag(false);
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                                 
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA009", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
          }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
    
    /**
     * Checks BMS allocated to Case Event 31.
     */
    public void testCaseEvent31()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("31");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
                                 
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA009", myUC002CaseEventUtils.getEventBMSTask());

            // Load County Court Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
   
    /**
     * Checks BMS allocated to Case Event 32.
     */
    public void testCaseEvent32()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("32");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
                                 
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA009", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IS8", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }  
    
    /**
     * Checks BMS allocated to Case Event 62.
     */
    public void testCaseEvent62()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("62");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                    
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 68.
     */
    public void testCaseEvent68()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("68");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                    
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load Insolvency Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(insolvCase);
            testEvent.setSubjectParty("Debtor 1 - DEBTOR NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IN22", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 74.
     */
    public void testCaseEvent74()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("74");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                    
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(qbCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 80.
     */
    public void testCaseEvent80()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("80");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                    
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA007", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH32", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR34", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 97.
     */
    public void testCaseEvent97()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("97");
                                
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA010", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH91", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH91", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 109.
     */
    public void testCaseEvent109()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("109");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
                                
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA011", myUC002CaseEventUtils.getEventBMSTask());

            // Load County Court Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN72", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR37", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 

    /**
     * Checks BMS allocated to Case Event 117.
     */
    public void testCaseEvent117()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("117");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
            
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA011", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH56", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR37", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 136.
     */
    public void testCaseEvent136()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("136");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA004", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR18", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load Insolvency Case, create event and check BMS
            myUC002CaseEventUtils.loadCaseByCaseNumber(insolvCase);
            testEvent.setSubjectParty("Debtor 1 - DEBTOR NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("IN19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 185.
     */
    public void testCaseEvent185()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("185");
            testEvent.setEventDetails("TEST");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
                                
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 205.
     */
    public void testCaseEvent205()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("205");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
            testEvent.setInstigatorParty("CLAIMANT NAME");
                                
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA004", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR18", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 256.
     */
    public void testCaseEvent256()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("256");
            testEvent.setProduceOutputFlag(false);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA052", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH69", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR50", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 332.
     */
    public void testCaseEvent332()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("332");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    } 
    
    /**
     * Checks BMS allocated to Case Event 333.
     */
    public void testCaseEvent333()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("333");
            testEvent.setProduceOutputFlag(false);
            testEvent.setNavigateObligations(true);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 439.
     */
    public void testCaseEvent439()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("439");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA015", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN42", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN42", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 440.
     */
    public void testCaseEvent440()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("440");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN43", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN43", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 441.
     */
    public void testCaseEvent441()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("441");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA017", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN68", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN68", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 442.
     */
    public void testCaseEvent442()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("442");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                                         
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA018", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN9", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN9", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 450.
     */
    public void testCaseEvent450()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("450");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA019", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN7", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN7", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 451.
     */
    public void testCaseEvent451()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("451");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA020", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN73", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR65", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 470.
     */
    public void testCaseEvent470()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("470");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA022", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN44", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN44", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 471.
     */
    public void testCaseEvent471()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("471");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations(true);
            testEvent.setProduceOutputFlag(false);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA023", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN45", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN45", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 472.
     */
    public void testCaseEvent472()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("472");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA024", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN11", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN11", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 473.
     */
    public void testCaseEvent473()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("473");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA025", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN69", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN69", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 474.
     */
    public void testCaseEvent474()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("474");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
                                       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA004", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH11", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR18", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 475.
     */
    public void testCaseEvent475()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("475");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag(false);
                           
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR19", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 480.
     */
    public void testCaseEvent480()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("480");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
                                   
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA026", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN12", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 481.
     */
    public void testCaseEvent481()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("481");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
                                   
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA027", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN13", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN13", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 482.
     */
    public void testCaseEvent482()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("482");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent.setProduceOutputFlag(false);
                                   
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA028", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 483.
     */
    public void testCaseEvent483()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase2);
            final NewStandardEvent testEvent = new NewStandardEvent("483");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
                                   
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA021", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN15", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN15", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 484.
     */
    public void testCaseEvent484()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("484");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent.setProduceOutputFlag(false);
                                   
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA029", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN74", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR66", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 485.
     */
    public void testCaseEvent485()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("485");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent.setProduceOutputFlag(false);
       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA029", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN74", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            testEvent.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("DR66", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 486.
     */
    public void testCaseEvent486()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("486");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 487.
     */
    public void testCaseEvent487()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("487");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME");
       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA028", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 488.
     */
    public void testCaseEvent488()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("488");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA006", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("JH12", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Checks BMS allocated to Case Event 489.
     */
    public void testCaseEvent489()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase(famEnfCase1);
            final NewStandardEvent testEvent = new NewStandardEvent("489");
            testEvent.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
       
            // Add the event and check BMS
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("MA028", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load County Court Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(ccCaseWnt1);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
            
            // Load High Court/District Registry Case, create event and check BMS
            myUC002CaseEventUtils.setCaseNumber(chCase);
            myUC002CaseEventUtils.addNewEvent(testEvent, null);
            assertEquals("EN14", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(final Exception e)
        {
            fail(e.getMessage());
        }
    }
    
    /**
     * Generic test for CCBC case events due to issues with warning message when load
     * a foreign case

    public void testCCBCCaseEvents()
    {
        try
        {
            // Get to Case Events screen and load CCBC Case
            mLoginAndLoadCCBCCase(ccbcCase);
            
            // Test Case Event 11
            NewStandardEvent testEvent11 = new NewStandardEvent("11");
            LinkedList event11Questions = new LinkedList();
            event11Questions.add(VariableDataQuestion.getDefaultVDQuestion("WhatEvidenceIsAttached", this));
            testEvent11.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent11, event11Questions);
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 12
            NewStandardEvent testEvent12 = new NewStandardEvent("12");
            testEvent12.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent12.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent12, null);
            assertEquals("BC042", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 14
            NewStandardEvent testEvent14 = new NewStandardEvent("14");
            testEvent14.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            LinkedList event14Questions = new LinkedList();
            event14Questions.add(VariableDataQuestion.getDefaultVDQuestion("PartyMakingTheApplication3LOVButton", this));
            event14Questions.add(VariableDataQuestion.getDefaultVDQuestion("DocumentToBeServed2", this));
            myUC002CaseEventUtils.addNewEvent(testEvent14, event14Questions);
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 15
            NewStandardEvent testEvent15 = new NewStandardEvent("15");
            testEvent15.setProduceOutputFlag(false);         
            testEvent15.setNavigateObligations(false);
            myUC002CaseEventUtils.addNewEvent(testEvent15, null);
            assertEquals("BC012", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 16
            NewStandardEvent testEvent16 = new NewStandardEvent("16");
            testEvent16.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            LinkedList event16Questions = new LinkedList();
            event16Questions.add(VariableDataQuestion.getDefaultVDQuestion("PartyMakingTheApplication4LOVButton", this));
            event16Questions.add(VariableDataQuestion.getDefaultVDQuestion("ServiceToBeDispensedOnLOVButton", this));
            event16Questions.add(VariableDataQuestion.getDefaultVDQuestion("DocumentToWhichApplicationRelates", this));
            event16Questions.add(VariableDataQuestion.getDefaultVDQuestion("SupportingEvidence", this));
            myUC002CaseEventUtils.addNewEvent(testEvent16, event16Questions);
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 17
            NewStandardEvent testEvent17 = new NewStandardEvent("17");
            testEvent17.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent17.setProduceOutputFlag(false);
            testEvent17.setNavigateObligations(false);
            myUC002CaseEventUtils.addNewEvent(testEvent17, null);
            assertEquals("BC012", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 19
            NewStandardEvent testEvent19 = new NewStandardEvent("19");
            testEvent19.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent19, null);
            assertEquals("BC036", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 30
            NewStandardEvent testEvent30 = new NewStandardEvent("30");
            testEvent30.setProduceOutputFlag(false);
            testEvent30.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent30, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 32
            NewStandardEvent testEvent32 = new NewStandardEvent("32");
            testEvent32.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent32.setProduceOutputFlag(false);
            testEvent32.setNavigateObligations(true);
            myUC002CaseEventUtils.addNewEvent(testEvent32, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 62
            NewStandardEvent testEvent62 = new NewStandardEvent("62");
            testEvent62.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent62, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 68
            NewStandardEvent testEvent68 = new NewStandardEvent("68");
            testEvent68.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent68, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 74
            NewStandardEvent testEvent74 = new NewStandardEvent("74");
            testEvent74.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent74, null);
            assertEquals("BC032", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 80
            NewStandardEvent testEvent80 = new NewStandardEvent("80");
            testEvent80.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent80, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 97
            NewStandardEvent testEvent97 = new NewStandardEvent("97");
            myUC002CaseEventUtils.addNewEvent(testEvent97, null);
            assertEquals("BC072", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 109
            NewStandardEvent testEvent109 = new NewStandardEvent("109");
            testEvent109.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent109.setNavigateObligations(true);
            testEvent109.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent109, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 117
            NewStandardEvent testEvent117 = new NewStandardEvent("117");
            testEvent117.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent117.setNavigateObligations(true);
            testEvent117.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent117, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 136
            NewStandardEvent testEvent136 = new NewStandardEvent("136");
            testEvent136.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent136, null);
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 185
            NewStandardEvent testEvent185 = new NewStandardEvent("185");
            testEvent185.setEventDetails("TEST");
            testEvent185.setProduceOutputFlag(false);
            testEvent185.setNavigateObligations(true);
            myUC002CaseEventUtils.addNewEvent(testEvent185, null);
            assertEquals("BC012", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 205
            NewStandardEvent testEvent205 = new NewStandardEvent("205");
            testEvent205.setProduceOutputFlag(false);
            testEvent205.setNavigateObligations(true);
            testEvent205.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent205, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 256
            NewStandardEvent testEvent256 = new NewStandardEvent("256");
            testEvent256.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent256, null);
            assertEquals("BC039", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 332
            NewStandardEvent testEvent332 = new NewStandardEvent("332");
            testEvent332.setProduceOutputFlag(false);
            testEvent332.setNavigateObligations(true);
            myUC002CaseEventUtils.addNewEvent(testEvent332, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 333
            NewStandardEvent testEvent333 = new NewStandardEvent("333");
            testEvent333.setProduceOutputFlag(false);
            testEvent333.setNavigateObligations(true);
            myUC002CaseEventUtils.addNewEvent(testEvent333, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 450
            NewStandardEvent testEvent450 = new NewStandardEvent("450");
            testEvent450.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent450.setNavigateObligations(true);
            testEvent450.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent450, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 451
            NewStandardEvent testEvent451 = new NewStandardEvent("451");
            testEvent451.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent451.setNavigateObligations(true);
            testEvent451.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent451, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());

        }
        catch(Exception e)
        {
            fail(e.getMessage());
        }
    }     */
    
    /**
     * Generic test for MCOL case events due to issues with warning message when load
     * a foreign case

    public void testMCOLCaseEvents()
    {
        try
        {
            // Get to Case Events screen and load MCOL Case
            mLoginAndLoadCCBCCase(mcolCase);
            
            // Test Case Event 12
            NewStandardEvent testEvent12 = new NewStandardEvent("12");
            testEvent12.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent12.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent12, null);
            assertEquals("BC066", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 74
            NewStandardEvent testEvent74 = new NewStandardEvent("74");
            testEvent74.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent74, null);
            assertEquals("BC054", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 97
            NewStandardEvent testEvent97 = new NewStandardEvent("97");
            myUC002CaseEventUtils.addNewEvent(testEvent97, null);
            assertEquals("BC072", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 136
            NewStandardEvent testEvent136 = new NewStandardEvent("136");
            testEvent136.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent136, null);
            assertEquals("BC016", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 439
            NewStandardEvent testEvent439 = new NewStandardEvent("439");
            testEvent439.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent439, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 440
            NewStandardEvent testEvent440 = new NewStandardEvent("440");
            testEvent440.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent440.setNavigateObligations(true);
            testEvent440.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent440, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 441
            NewStandardEvent testEvent441 = new NewStandardEvent("441");
            testEvent441.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent441.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent441, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 442
            NewStandardEvent testEvent442 = new NewStandardEvent("442");
            testEvent442.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent442.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent442, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 470
            NewStandardEvent testEvent470 = new NewStandardEvent("470");
            testEvent470.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent470.setNavigateObligations(true);
            myUC002CaseEventUtils.addNewEvent(testEvent470, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 471
            NewStandardEvent testEvent471 = new NewStandardEvent("471");
            testEvent471.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent471.setNavigateObligations(true);
            testEvent471.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent471, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 472
            NewStandardEvent testEvent472 = new NewStandardEvent("472");
            testEvent472.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent472.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent472, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 473
            NewStandardEvent testEvent473 = new NewStandardEvent("473");
            testEvent473.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent473.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent473, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 474
            NewStandardEvent testEvent474 = new NewStandardEvent("474");
            testEvent474.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent474, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 475
            NewStandardEvent testEvent475 = new NewStandardEvent("475");
            testEvent475.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            testEvent475.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent475, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 480
            NewStandardEvent testEvent480 = new NewStandardEvent("480");
            testEvent480.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent480, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 481
            NewStandardEvent testEvent481 = new NewStandardEvent("481");
            testEvent481.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent481, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 482
            NewStandardEvent testEvent482 = new NewStandardEvent("482");
            testEvent482.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent482.setProduceOutputFlag(false);
            myUC002CaseEventUtils.addNewEvent(testEvent482, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 483
            NewStandardEvent testEvent483 = new NewStandardEvent("483");
            testEvent483.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent483, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 484
            NewStandardEvent testEvent484 = new NewStandardEvent("484");
            testEvent484.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent484.setProduceOutputFlag(false);
            testEvent484.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent484, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 485
            NewStandardEvent testEvent485 = new NewStandardEvent("485");
            testEvent485.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            testEvent485.setProduceOutputFlag(false);
            testEvent485.setInstigatorParty("CLAIMANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent485, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 486
            NewStandardEvent testEvent486 = new NewStandardEvent("486");
            testEvent486.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent486, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 487
            NewStandardEvent testEvent487 = new NewStandardEvent("487");
            testEvent487.setSubjectParty("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.addNewEvent(testEvent487, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 488
            NewStandardEvent testEvent488 = new NewStandardEvent("488");
            testEvent488.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent488, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
            
            // Test Case Event 489
            NewStandardEvent testEvent489 = new NewStandardEvent("489");
            testEvent489.setSubjectParty("Defendant 1 - DEFENDANT NAME"); 
            myUC002CaseEventUtils.addNewEvent(testEvent489, null);
            assertEquals("", myUC002CaseEventUtils.getEventBMSTask());
        }
        catch(Exception e)
        {
            fail(e.getMessage());
        }
    }
    */
    
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
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     *
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndLoadCase (final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber (pCaseNumber);
    }
    
    /**
     * Private function that logs a CCBC user into CaseMan, navigates to Case Events and loads a Case Number
     * @param pCaseNumber Case Number to load
     */
    private void mLoginAndLoadCCBCCase(final String pCaseNumber)
    {
        // Log into SUPS CaseMan
        logOn(AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu( MAINMENU_CASE_EVENTS_PATH );

        // Check in correct screen
        mCheckPageTitle(myUC002CaseEventUtils.getScreenTitle());

        // Enter a valid case number
        myUC002CaseEventUtils.loadCaseByCaseNumber(pCaseNumber);
    }

}