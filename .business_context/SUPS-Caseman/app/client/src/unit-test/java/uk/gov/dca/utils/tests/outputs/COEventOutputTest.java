/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.outputs;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC116COEventUtils;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class COEventOutputTest extends AbstractCmTestBase
{
    
    /** The my UC 116 CO event utils. */
    // Private member variables for the screen utils
    private UC116COEventUtils myUC116COEventUtils;

    /**
     * Constructor.
     */
    public COEventOutputTest ()
    {
        super (COEventOutputTest.class.getName ());
        this.nav = new Navigator (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Generates L_BLANK_CO (CO Event 966).
     */
    public void testL_BLANK_CO ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("966");
            testEvent.setCreditor ("Debt 1 - CREDITOR ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Salutation", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO02 (CO Event 971).
     */
    public void testCO02 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("971");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NoticeType2Ent", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Wording", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO03 (CO Event 332).
     */
    public void testCO03 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("CO-332");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterText", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO05 (CO Event 856).
     */
    public void testCO05 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("CO-856");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("PrisonName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("CommitalDuration", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterItemDetails", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO09 (CO Event 864).
     */
    public void testCO09 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("CO-864");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MaximumFine", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfAEOrder", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DetailsOfAllegedOffence", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO10 (CO Event 873).
     */
    public void testCO10 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("CO-873");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MaximumFine", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateOfAEOrder", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DetailsOfAllegedOffence", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO13 (CO Event 941).
     */
    public void testCO13 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("941");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO14 (CO Event 940).
     */
    public void testCO14 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("940");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("Applicant", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO15 (CO Event 944).
     */
    public void testCO15 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("944");
            testEvent.setCreditor ("Debt 2 - CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO16 (CO Event 955).
     */
    public void testCO16 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("955");
            testEvent.setCreditor ("Debt 2 - CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO17 (CO Event 956).
     */
    public void testCO17 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("956");
            testEvent.setCreditor ("Debt 1 - CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO18 (CO Event 943).
     */
    public void testCO18 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("943");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhatIsVaried", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO19 (CO Event 958).
     */
    public void testCO19 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("958");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DateSuspendedUntil", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO20 (CO Event 946).
     */
    public void testCO20 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("946");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO21 (CO Event 942).
     */
    public void testCO21 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("942");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO22 (CO Event 954).
     */
    public void testCO22 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("954");
            testEvent.setCreditor ("Debt 2 - CLAIMANT ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("ApplicantAddCase", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO23 (CO Event 951).
     */
    public void testCO23 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("951");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DisStrAdj", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO24 (CO Events 865, 877).
     */
    public void testCO24 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("877");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("FineOrPrison", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterOUPText", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterOffenceDetails", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterFineAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterFineDate", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO25 (CO Event 920).
     */
    public void testCO25 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("920");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO26 (CO Event 928).
     */
    public void testCO26 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("928");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("RevokedDischarged", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AllocationReason", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO27 (CO Events 926, 927).
     */
    public void testCO27 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("926");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("AllocationReason", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO28 (CO Event 929).
     */
    public void testCO28 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("929");
            testEvent.setCreditor ("Debt 1 - CREDITOR ONE NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO29 (CO Event 924).
     */
    public void testCO29 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("924");
            testEvent.setCreditor ("Debt 2 - CREDITOR TWO NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO30 (CO Event 937).
     */
    public void testCO30 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("937");
            testEvent.setCreditor ("Debt 2 - CREDITOR TWO NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO31 (CO Event 938).
     */
    public void testCO31 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("938");
            testEvent.setCreditor ("Debt 2 - CREDITOR TWO NAME");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO32 (CO Event 921).
     */
    public void testCO32 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("921");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NamePartyObjecting", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO33 (CO Event 916).
     */
    public void testCO33 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("916");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ObjectingCreditor",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR ONE NAME", this);
            eventQuestions.add (vdQ1);

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO34 (CO Event 923).
     */
    public void testCO34 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("923");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("DisStrAdj", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO35 (CO Event 917).
     */
    public void testCO35 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("917");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ObjectingCreditor",
                    VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE, "CREDITOR ONE NAME", this);
            eventQuestions.add (vdQ1);
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO36 (CO Event 855).
     */
    public void testCO36 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("855");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("MorFDebtor", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO37 (CO Event 860).
     */
    public void testCO37 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("860");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO41 (CO Event 896).
     */
    public void testCO41 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100001NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("896");
            testEvent.setIssueStage (UC116COEventUtils.ISSUE_STAGE_ISSUE);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("N61AOrderDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterFineAmount", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("EnterFineDate", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO43 (CO Event 931).
     */
    public void testCO43 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("931");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("WhoReqRev", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingDate", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("HearingTime", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO44 (CO Event 930).
     */
    public void testCO44 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("930");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("NoInstOutstanding", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates CO52 (CO Event 947).
     */
    public void testCO52 ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100003NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("947");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeTitle", this));
            eventQuestions.add (VariableDataQuestion.getDefaultVDQuestion ("JudgeName", this));

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Generates COLET (CO Event 965).
     */
    public void testCOLET ()
    {
        try
        {
            // Get to the CO Events screen and load CO
            mLoginAndLoadCO ("100002NN");

            // Configure the event
            final NewStandardEvent testEvent = new NewStandardEvent ("965");

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> eventQuestions = new LinkedList<VariableDataQuestion> ();

            // Add the event and clear screen down afterwards
            myUC116COEventUtils.addNewEvent (testEvent, eventQuestions);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function that logs the user into CaseMan, navigates to CO Events and loads a CO Number.
     *
     * @param pCONumber The CO Number to load
     */
    private void mLoginAndLoadCO (final String pCONumber)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

        // Load Consolidated Order
        myUC116COEventUtils.loadCOByCONumber (pCONumber);
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