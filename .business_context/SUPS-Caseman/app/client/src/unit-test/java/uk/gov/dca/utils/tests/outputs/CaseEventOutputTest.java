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

package uk.gov.dca.utils.tests.outputs;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the case events screen.
 *
 * @author Chris Vincent
 */
public class CaseEventOutputTest extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseEventOutputTest ()
    {
        super (CaseEventOutputTest.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Generates CJR009 (Case Event 18).
     */
    public void testCJR009 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("18");
            testEvent.setProduceOutputFlag (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateServed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocumentServed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PersonServed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceMethod", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DXNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyAddressType", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR010 (Case Event 10).
     */
    public void testCJR010 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("10");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ProcessEnvelopeMark", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR011 (Case Event 38).
     */
    public void testCJR011 ()
    {
        try
        {
            // Log into SUPS CaseMan and load case on Case Events screen
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("38");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefendantsIntention", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NewAddressForService", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR012 (Case Event 49).
     */
    public void testCJR012 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("49");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (true);
            testEvent.setForceObligationExit (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FormReturnDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR013 (Case Event 60).
     */
    public void testCJR013 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("60");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FormReturnDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR014 (Case Event 42).
     */
    public void testCJR014 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("42");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setProduceOutputFlag (true);
            testEvent.setForceObligationExit (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FormReturnDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR016 (Case Event 51).
     */
    public void testCJR016 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("51");
            testEvent.setProduceOutputFlag (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR019 (Case Event 228).
     */
    public void testCJR019 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("228");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingIsFor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("QASubmittedIRO", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InfoReqdFrom", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR020 (Case Event 218).
     */
    public void testCJR020 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("218");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Allocation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR021 (Case Event 220).
     */
    public void testCJR021 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("220");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ConsiderAllocQA", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClaimTransferTo", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR022 (Case Event 63).
     */
    public void testCJR022 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("63");
            testEvent.setNavigateObligations (true);
            testEvent.setInstigatorParty ("CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocDetails", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR023A (Case Event 210).
     */
    public void testCJR023A ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("210");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Allocation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTimeAllowed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTimeAllowedUnits", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingFee", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayableByDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DirectionsTypeReqd", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR023B (Case Event 212).
     */
    public void testCJR023B ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("212");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Allocation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR023D (Case Event 216).
     */
    public void testCJR023D ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("216");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Allocation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PreliminaryHearingReason", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR024 (Case Event 202).
     */
    public void testCJR024 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("202");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NoticeType2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingType2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Wording", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR027 (Case Event 205).
     */
    public void testCJR027 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("205");
            testEvent.setProduceOutputFlag (true);
            testEvent.setNavigateObligations (true);
            testEvent.setInstigatorParty ("CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationFor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR028 (Case Event 208).
     */
    public void testCJR028 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("208");
            testEvent.setForceObligationExit (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TrialRespective", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingType", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Listing", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR030 (Case Event 95).
     */
    public void testCJR030 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("95");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessAddLn2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WDaysRequired", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ConductMoneyAmt", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR031 (Case Event 53).
     */
    public void testCJR031 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("53");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("SelectItemLsB",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "copy defence already sent - time elapsed", this);
            eventQuestions.add (vdQ1);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR032A (Case Event 196).
     */
    public void testCJR032A ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00003");
            final NewStandardEvent testEvent = new NewStandardEvent ("196");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectItemLsB", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR032B (Case Event 196).
     */
    public void testCJR032B ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("196");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectItemLsB", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR032C (Case Event 196).
     */
    public void testCJR032C ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00002");
            final NewStandardEvent testEvent = new NewStandardEvent ("196");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectItemLsB", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR034 (Case Event 395).
     */
    public void testCJR034 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("395");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR035 (Case Event 396).
     */
    public void testCJR035 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("396");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ProvisionalAssessmentCosts", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR036 (Case Event 389).
     */
    public void testCJR036 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("389");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SumPayable", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhenSumPayable", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR037 (Case Event 394).
     */
    public void testCJR037 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("394");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TotalAssessedCost", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhenSumPayable", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR038 (Case Event 392).
     */
    public void testCJR038 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("392");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ApplicationFor",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "A detailed assessment hearing", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SumToPay", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SumPayableWithin", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR039 (Case Event 391).
     */
    public void testCJR039 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("391");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR040 (Case Event 230).
     */
    public void testCJR040 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("230");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentForthwith", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR041 (Case Event 240).
     */
    public void testCJR041 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("240");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentForthwith", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR042 (Case Event 250).
     */
    public void testCJR042 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("250");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentForthwith", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR043 (Case Event 253).
     */
    public void testCJR043 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00031");
            final NewStandardEvent testEvent = new NewStandardEvent ("253");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR046 (Case Event 252).
     */
    public void testCJR046 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("252");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefLiability", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR049 (Case Event 254).
     */
    public void testCJR049 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("254");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PaymentDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR050 (Case Event 260).
     */
    public void testCJR050 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("260");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PossessionDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR051 (Case Event 262).
     */
    public void testCJR051 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("262");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PossessionDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR051 (Case Event 295).
     */
    public void testCJR052 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("295");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PossessionDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AmountOrdered", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SumRepresents", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DailyPaymentAmt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DailyPaymentStartDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentPeriod", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderCeaseDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR053 (Case Event 270).
     */
    public void testCJR053 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("270");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PossessionDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IntalmentAmount2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentPeriod2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR054 (Case Event 290).
     */
    public void testCJR054 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("290");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PossessionDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ArrearsAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IntalmentAmount2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentPeriod2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR055 (Case Event 272).
     */
    public void testCJR055 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("272");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AmountOrdered", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("IntalmentAmount2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentPeriod2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR060 (Case Event 69).
     */
    public void testCJR060 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("69");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TrialDateFixed", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR061 (Case Event 328).
     */
    public void testCJR061 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("328");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SubjectSex", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ActivityProhibited", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR065 (Case Event 57).
     */
    public void testCJR065 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("57");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR065A (Case Event 251).
     */
    public void testCJR065A ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("251");
            testEvent.setProduceOutputFlag (true);
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentForthwith", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR065B (Case Event 181).
     */
    public void testCJR065B ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("181");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Article", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Protocol", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfApplication", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationOutcome", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR065C (Case Event 332).
     */
    public void testCJR065C ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("332");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR069 (Case Event 103).
     */
    public void testCJR069 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("103");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Stayed", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR070 (Case Event 104).
     */
    public void testCJR070 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("103");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Stayed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("StayDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR071 (Case Event 756).
     */
    public void testCJR071 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00005");
            final NewStandardEvent testEvent = new NewStandardEvent ("756");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Stayed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AqFiledByDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR072 (Case Event 227).
     */
    public void testCJR072 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("227");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartiesFailedToFile", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetails2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("StruckOut", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LqFiledByDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR073 (Case Event 15).
     */
    public void testCJR073 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("15");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhosEvidenceRead", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EvidenceReadDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Doc2BServed", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HowDocServed", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR080 (Case Event 450).
     */
    public void testCJR080 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("450");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhoConsidApp", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentOrderType", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OutstandingAmt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("QuestionWho", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BeforeWhom", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppFee", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhoServesN39", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR081 (Case Event 484).
     */
    public void testCJR081 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("484");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39Date", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MorFDebtor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrisonName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CommitalDuration", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79ADate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79AServiceDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79AComptemptDtls", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WarrantOrderDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR082 (Case Event 485).
     */
    public void testCJR082 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("485");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MorFDebtor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ArrestDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39Date", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39ComtemptDtls", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79AContemptDetails2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrisonName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CommitalDuration", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N40BJudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N40BJudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WarrantOrderDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR083 (Case Event 451).
     */
    public void testCJR083 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("451");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39Date", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39ServedBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitExpensesBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitExpensesDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CertificateDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39ServiceDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79aReason", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrisonName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CommitalDuration", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N79AServedBy", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR090 (Case Event 475).
     */
    public void testCJR090 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("475");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N84Total", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PaymentReceiveBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalPeriod2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentMonth", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR091 (Case Event 471).
     */
    public void testCJR091 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("471");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OutstandingAmt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppFee", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR092 (Case Event 472).
     */
    public void testCJR092 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("472");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ThirdPartyAddress2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TPAmntToPay", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayMoneyDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostAmount2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR093 (Case Event 440).
     */
    public void testCJR093 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("440");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OutstandingAmt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecurityDtls", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR094 (Case Event 442).
     */
    public void testCJR094 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("442");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgementOrOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AmntOfCharge", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostAmount2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstnHoldingSecurity", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecurityDtls", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR100 (Case Event 294).
     */
    public void testCJR100 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("294");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BreachDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HousingActSect", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HasMedicalEvidence", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FirstMedPract", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecondMedPract", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefDisability", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CouncilName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR101 (Case Event 293).
     */
    public void testCJR101 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("293");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BreachDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HousingActSect", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HasMedicalEvidence", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FirstMedPract", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SecondMedPract", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefDisability", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HospitalName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HospitalAdd1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HospitalAdd2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DetentionPeriod", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DetentionPeriodUnits", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ConveysDefendant", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR102 (Case Event 490).
     */
    public void testCJR102 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("490");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InjunctionDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MorFDebtor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WarrantOrderDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR103 (Case Event 296).
     */
    public void testCJR103 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("296");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InjunctionDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR104 (Case Event 297).
     */
    public void testCJR104 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("297");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InjunctionDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefRemandorDetnd", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HospitalName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ConveysDefendant", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR105 (Case Event 191).
     */
    public void testCJR105 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("191");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderToProduce", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppConsideredDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR1424 (Case Event 43).
     */
    public void testCJR1424 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("43");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR170 (Case Event 98).
     */
    public void testCJR170 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("98");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DeponentName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DeponentAddL1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DeponentAddL2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OfferConductMoney", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR175 (Case Event 17).
     */
    public void testCJR175 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("17");
            testEvent.setInstigatorParty ("CLAIMANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Document", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR176 (Case Event 222).
     */
    public void testCJR176 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("222");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR177 (Case Event 766).
     */
    public void testCJR177 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("766");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfApplication", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppForClaimantBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClaimFor", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR178 (Case Event 768).
     */
    public void testCJR178 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("768");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessAddLn2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessDid", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WitnessTo", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR184 (Case Event 770).
     */
    public void testCJR184 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("770");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");
            testEvent.setObligationNotes ("LISTING OF YOUR CLAIM");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("UnpaidAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ListedDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR186 (Case Event 84).
     */
    public void testCJR186 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("84");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyServingClaim", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR186A (Case Event 87).
     */
    public void testCJR186A ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00003");
            final NewStandardEvent testEvent = new NewStandardEvent ("87");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyServingClaim", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR199 (Case Event 221).
     */
    public void testCJR199 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00003");
            final NewStandardEvent testEvent = new NewStandardEvent ("221");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClmtsOralEvidenceBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClmntsWrittenEvidencdeBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefdtsOralEvidenceBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefdtsWrittenEvidenceBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClmEvidenceTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ClmEvidenceTimeUnits", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefEvidenceTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DefEvidenceTimeUnits", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartySubmissionTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartySubmissionTimeUnits", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TimeRemaining", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TimeRemainingUnits", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR202 (Case Event 708).
     */
    public void testCJR202 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("708");
            testEvent.setInstigatorParty ("CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CFOAccNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CourtFunds", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TotalInvestAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LitigationFriend", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LitFriendAddL1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LitFriendAdd2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfBirth", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR351 (Case Event 315).
     */
    public void testCJR351 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("315");
            testEvent.setInstigatorParty ("CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AgreementWas", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HirePurchaseAgreementDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetained", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostsAre", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostToBePaid", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CJR352 (Case Event 318).
     */
    public void testCJR352 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("318");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OriginalOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ChangedCondition", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Modifications", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostsAre", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostToBePaid", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_1_2 (Case Event 20).
     */
    public void testL_1_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("20");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LetterProcessTypes", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderProcess", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_1_3 (Case Event 772).
     */
    public void testL_1_3 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("772");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CCFee", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_1_6 (Case Event 91).
     */
    public void testL_1_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("91");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReplyType", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_10_1_2_15_16 (Case Event 114).
     */
    public void testL_10_1_2_15_16 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("114");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectLetter", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BillNumber", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_13_12 (Case Event 23).
     */
    public void testL_13_12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("23");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ProcessType", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SubServiceDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BailiffVisitReason", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_14_1 (Case Event 115).
     */
    public void testL_14_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("115");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_3_9 (Case Event 505).
     */
    public void testL_3_9 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00032");
            final NewStandardEvent testEvent = new NewStandardEvent ("505");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OutstandingAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DetailsOfClaim", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AnnualInterestPercentage", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_4_1 (Case Event 179).
     */
    public void testL_4_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");

            myUC002CaseEventUtils.openAddEventPopup ("179");
            myUC002CaseEventUtils.setEventSubject ("Defendant 1 - DEFENDANT NAME");
            myUC002CaseEventUtils.setNewEventDetails ("JREF2: ON COMING THE END OF STAY FOR MEDIATION");
            myUC002CaseEventUtils.setNewEventProduceOutput (true);
            myUC002CaseEventUtils.clickAddEventSaveButton ();

            // Wait until get into the WP Variable Data screen
            String pageTitle = this.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data L_4_1") == -1)
            {
                this.waitForPageToLoad ();
                pageTitle = this.getPageTitle ();
            }

            // When on variable data screen, deal with the question list passed in
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocType", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CorrespondanceDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = eventQuestions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            this.getButtonAdaptor (VARIABLE_DATA_SAVE_BUTTON).click ();
            if (this.isAlertPresent ())
            {
                this.getAlert ();
                this.waitForPageToLoad ();
            }

            // Loop until in FCK Editor screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

            // Mark output as final and exit
            final VariableDataQuestion vdFCK = new VariableDataQuestion ("", 0, this);
            vdFCK.clickFCKEditorFinalCheckbox ();
            vdFCK.clickFCKEditorOkButton ();

            // Loop until get into the OR Variable Data screen
            pageTitle = this.getPageTitle ();
            while (pageTitle.indexOf ("On Coming The End Of Stay For Mediation") == -1)
            {
                this.waitForPageToLoad ();
                pageTitle = this.getPageTitle ();
            }

            // Click Save on the Variable Data screen
            this.getButtonAdaptor (VARIABLE_DATA_SAVE_BUTTON).click ();
            if (this.isAlertPresent ())
            {
                this.getAlert ();
                this.waitForPageToLoad ();
            }

            // Loop until in Case Events screen
            pageTitle = session.getPageTitle ();
            while ( !pageTitle.equals (myUC002CaseEventUtils.getScreenTitle ()))
            {
                session.waitForPageToLoad ();
                pageTitle = session.getPageTitle ();
            }

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_4_11 (Case Event 760).
     */
    public void testL_4_11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("760");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CorrespondanceDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_4_4 (Case Event 182).
     */
    public void testL_4_4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("182");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppealNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AppealDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_5_1 (Case Event 117).
     */
    public void testL_5_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("117");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RequestFor", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Fee", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_6_1_2_3_4_7 (Case Event 106).
     */
    public void testL_6_1_2_3_4_7 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("106");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectLetter3", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_9_1_2_3_4_9_10 (Case Event 109).
     */
    public void testL_9_1_2_3_4_9_10 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("109");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SelectLetter2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ExamNumber", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK (Case Event 100).
     */
    public void testL_BLANK ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("100");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates L_BLANK_MED (Case Event 546).
     */
    public void testL_BLANK_MED ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("546");
            testEvent.setEventDetails ("2: COMPANY -V- LIP");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N32 (Case Event 300).
     */
    public void testN32 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("300");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetained", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetainedValue", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DamagesAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostPaymentDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N32_2 (Case Event 310).
     */
    public void testN32_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("310");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HirePurchaseAgreementDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetained", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("UnpaidBalance", this));//
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MonthlyInstalment", this));//
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N32_5 (Case Event 320).
     */
    public void testN32_5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("320");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReturnOfGoodsDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BalanceOfTotalPrice", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfPayment", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates N33 (Case Event 322).
     */
    public void testN33 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("322");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetained", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetainedValue", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ArrearsAmnt", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InstalmentDate2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_1 (Case Event 650).
     */
    public void testO_10_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("650");
            testEvent.setSubjectParty ("The Company 1 - COMPANY NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_2 (Case Event 651).
     */
    public void testO_10_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("651");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReportDeliveredDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderReasons", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_3 (Case Event 652).
     */
    public void testO_10_3 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("652");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_4 (Case Event 653).
     */
    public void testO_10_4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("653");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FilingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterimExtendDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MeetingAddLn2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_5(Case Event 654).
     */
    public void testO_10_5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("654");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Affidavit", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitAddL1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitAddL2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrepaidPost", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AddressedTo", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceAddress1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceAddress2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PublishedIn", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServedonDay", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_6(Case Event 655).
     */
    public void testO_10_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("655");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PetitionInstructions", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RegistrationDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LRReference", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_7(Case Event 656).
     */
    public void testO_10_7 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("656");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_8(Case Event 657).
     */
    public void testO_10_8 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("657");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderSubPetReason", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OriginalPetitioner",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_9 (Case Event 658).
     */
    public void testO_10_9 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("658");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DaysServedby", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("OriginalPetitioner",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_10 (Case Event 659).
     */
    public void testO_10_10 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("659");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Description", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_11 (Case Event 660).
     */
    public void testO_10_11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("660");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReportDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_12 (Case Event 661).
     */
    public void testO_10_12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("661");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Description", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_13 (Case Event 662).
     */
    public void testO_10_13 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("662");
            testEvent.setSubjectParty ("Applicant 1 - APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("StatutoryDemandDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AffidavitSupportDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfApplication", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_14 (Case Event 663).
     */
    public void testO_10_14 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("663");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("PMApp",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR NAME", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_15 (Case Event 664).
     */
    public void testO_10_15 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("664");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DescriptionApplicant", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyOption", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RegistrationDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("LRReference", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NotificationInDays", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_16 (Case Event 665).
     */
    public void testO_10_16 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");

            // Pre-requisite event
            final NewStandardEvent testEvent661 = new NewStandardEvent ("661");
            testEvent661.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent661.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent661, null);

            final NewStandardEvent testEvent = new NewStandardEvent ("665");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankruptcyDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_17 (Case Event 667).
     */
    public void testO_10_17 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("667");
            testEvent.setSubjectParty ("Applicant 1 - APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DemandIssued", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_18 (Case Event 668).
     */
    public void testO_10_18 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("668");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_19 (Case Event 669).
     */
    public void testO_10_19 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("669");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N39HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicationPresentedDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_10_20 (Case Event 670).
     */
    public void testO_10_20 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("670");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_11_1_2_3_4 (Case Event 690).
     */
    public void testO_11_1_2_3_4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("A15NN001");
            final NewStandardEvent testEvent = new NewStandardEvent ("690");
            testEvent.setSubjectParty ("Debtor 1 - DEBTOR NAME");
            testEvent.setInstigatorParty ("APPLICANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AdjournedDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PetitionAdjournedTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostInstructions", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_2_6 (Case Event 491).
     */
    public void testO_2_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("491");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PowerOfArrestExpiryDate", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("HousingActSect",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "153A (3) and (4)", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CourtSatisfied", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicantPhone", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ProvisionInjunction", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_5_5 (Case Event 233).
     */
    public void testO_5_5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("233");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostType2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayBy", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentAmount", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_5_6 (Case Event 323).
     */
    public void testO_5_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("323");
            testEvent.setSubjectParty ("Claimant 1 - CLAIMANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateofAward", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NameofBody", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AwardRef", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AwardAmountUnpaid", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CourtFee", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SolicitorCost", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_7_12_6 (Case Event 48).
     */
    public void testO_7_12_6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("48");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CertificatePurpose", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ProceedingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CauseOfAction", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DebtAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CostAmount2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterestToDateAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SubsequentCosts", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("InterestFromDateAmount", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_7_8 (Case Event 305).
     */
    public void testO_7_8 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("305");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HPA", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HirePurchaseAgreementDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsDetained", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("GoodsReturnDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_8_12 (Case Event 331).
     */
    public void testO_8_12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("331");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OrderDetailse", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_8_5 (Case Event 351).
     */
    public void testO_8_5 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("351");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SDNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_9_1 (Case Event 707).
     */
    public void testO_9_1 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00021");
            final NewStandardEvent testEvent = new NewStandardEvent ("707");
            testEvent.setInstigatorParty ("CLAIMANT NAME");
            testEvent.setNavigateObligations (true);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CFOAccNumber", this));

            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("PayeePopupBtn", VariableDataQuestion.VD_FIELD_TYPE_BUTTON, this); // Button
            eventQuestions.add (vdQ1);

            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayeeDetail", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayeeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayeeAdd1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayeeAdd2", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PayeeRef", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankAdd1", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("BankAdd2", this));

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("PayeeAddBtn", VariableDataQuestion.VD_FIELD_TYPE_BUTTON, this); // Button
            eventQuestions.add (vdQ2);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates O_9_2 (Case Event 715).
     */
    public void testO_9_2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00003");
            final NewStandardEvent testEvent = new NewStandardEvent ("715");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FundNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CFOAccNumber", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AmountHeld", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReceivingCourtCode", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("OriginatingCourtCode", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF12 (Case Event 56).
     */
    public void testJREF12 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("56");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NamesOfPartiesWhoHaveNotFiledAQs", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF24 (Case Event 258).
     */
    public void testJREF24 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("258");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF29 (Case Event 88).
     */
    public void testJREF29 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("88");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplication2LOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF31 (Case Event 83).
     */
    public void testJREF31 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("83");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReferralReasonLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF32 (Case Event 9).
     */
    public void testJREF32 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("9");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReturnedDocument", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF34 (Case Event 14).
     */
    public void testJREF34 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("14");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplication3LOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocumentToBeServed2", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF35 (Case Event 16).
     */
    public void testJREF35 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("16");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplication4LOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ServiceToBeDispensedOnLOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocumentToWhichApplicationRelates", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("SupportingEvidence", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF6 (Case Event 226).
     */
    public void testJREF6 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("226");

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoSawAllocationQuestionnaire", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReasonForReferralLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF10 (Case Event 179).
     */
    public void testJREF10 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF10");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF10: SMALL CLAIM DISPOSAL WITHOUT HEARING");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoMadeOriginalTheOrder", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF11 (Case Event 179).
     */
    public void testJREF11 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF11");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF11: SPECIAL DIRECTIONS");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoMadeOriginalTheOrder", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateWhenSpecialDirectionsWereGiven", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF13 (Case Event 179).
     */
    public void testJREF13 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF13");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF13: CASE TRANSFERRED IN");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CourtWhereCaseWasTransferredFrom", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("TransferReasonLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF14 (Case Event 179).
     */
    public void testJREF14 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF14");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF14: APPLICATION TO SUBSTITUTE PARTY WHOSE INTEREST HAS PASSED");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NewPartyToBeSubstitutedLOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EvidenceAttached", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF15A (Case Event 179).
     */
    public void testJREF15A ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF15A");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF15A: APP TO ISSUE NEW PROC AFTER DISCONTINUANCE - NO REPRESENT");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("PartyWhoHasDiscontinuedAClaimLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF15B (Case Event 179).
     */
    public void testJREF15B ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF15B");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF15B: APP TO ISSUE NEW PROC AFTER DISCONTINUANCE - REPRESENTATI");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("PartyWhoHasDiscontinuedAClaimLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF16 (Case Event 179).
     */
    public void testJREF16 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF16");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF16: APPLICATION TO EXTEND LIFE OF CLAIM FORM");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhatEvidenceIsAttached", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF18 (Case Event 179).
     */
    public void testJREF18 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF18");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF18: ADMISSION ON CLAIM FOR UNSPECIFIED SUM OVER 50");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReasonThatClaimIsReferredLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF19 (Case Event 179).
     */
    public void testJREF19 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF19");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF19: PUBLIC INTEREST IMMUNITY APPLICATION");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoSawAllocationQuestionnaires", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF2 (Case Event 179).
     */
    public void testJREF2 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF2");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF2: ON COMING THE END OF STAY FOR MEDIATION");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF20 (Case Event 179).
     */
    public void testJREF20 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF20");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF20: APPLICATION FOR PERMISSION TO SERVE A WITNESS SUMMARY");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoSawAllocationQuestionnaires", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF21 (Case Event 179).
     */
    public void testJREF21 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF21");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF21: APPLICATION FOR LATE WITNESS SUMMONS");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoSawAllocationQuestionnaires", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF22 (Case Event 179).
     */
    public void testJREF22 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF22");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF22: FOR MANAGEMENT DIRECTIONS - JDGMT ENTERED - OFFER IN SAT");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF25 (Case Event 179).
     */
    public void testJREF25 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF25");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF25: APPLICATION FOR DEFAULT JUDGMENT AGAINST A STATE");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF27 (Case Event 179).
     */
    public void testJREF27 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF27");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF27: APP BY CHILD TO CONDUCT LITIGATION WITHOUT A LITIGATION F");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF28 (Case Event 179).
     */
    public void testJREF28 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF28");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF28: FOR JUDGE TO GIVE INVESTMENT DIRECTIONS ON MONIES PAID IN");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF30 (Case Event 179).
     */
    public void testJREF30 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF30");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF30: APPLICATION FOR PERMISSION TO MAKE PART 20 CLAIM");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF33 (Case Event 179).
     */
    public void testJREF33 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF33");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF33: APP TO SERVE DOCUMENT ON AGENT WHERE DEFENDANT OUT OF JUR");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("AttachedEvidenceToSupportApplication", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF36 (Case Event 179).
     */
    public void testJREF36 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF36");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF36: APPLICATION TO SERVE ON CHILD OR PATIENT OR OTHER THAN R6");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PartyMakingTheApplicationLOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DocumentToBeServed", this));
            eventQuestions
                    .add (VariableDataQuestion.getDefaultVDQuestion ("WhoIsTheDocumentToBeServedOnLOVButton", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhoIsToBeServedLOVButton", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF37 (Case Event 179).
     */
    public void testJREF37 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF37");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF37: TO SET ASIDE JUDGMENT ON FAILURE OF POSTAL SERVICE BY THE");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ReasonForEnvelopeBeingReturned", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgmentDate", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF4 (Case Event 179).
     */
    public void testJREF4 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF4");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF4: FAILURE TO SUBMIT ORDER");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoMadeOriginalTheOrder", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateThePartiesOrderedToSubmitDraft", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF8 (Case Event 179).
     */
    public void testJREF8 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF8");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF8: FOR REVIEW");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeWhoMadeOriginalTheOrder", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfOriginalOrder", this));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates JREF9 (Case Event 179).
     */
    public void testJREF9 ()
    {
        try
        {
            // Get to Case Events screen and load Case
            mLoginAndLoadCase ("3NN00001");
            final NewStandardEvent testEvent = new NewStandardEvent ("179-JREF9");
            testEvent.setSubjectParty ("Defendant 1 - DEFENDANT NAME");
            testEvent.setEventDetails ("JREF9: AGREED DIRECTIONS");
            testEvent.setProduceOutputFlag (false);

            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent, eventQuestions);
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

}