/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm18_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Case Numbering changes to Manage Case Events screen.
 *
 * @author Chris Vincent
 */
public class CaseManNumbering_CaseEvents_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManNumbering_CaseEvents_Test ()
    {
        super (CaseManNumbering_CaseEvents_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Checks that Case Number field validation is as expected on the Case Events screen
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Case Events screen and load Case
            final String caseNumber = "NN/00001";
            mLoginAndLoadCase (caseNumber);

            assertFalse ("Case Number is valid when should be invalid", myUC002CaseEventUtils.isCaseNumberValid ());
            myUC002CaseEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_MAGS_CASE_ENTERED);

            myUC002CaseEventUtils.clearScreen ();
            final String[] caseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC002CaseEventUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid", myUC002CaseEventUtils.isCaseNumberValid ());

                myUC002CaseEventUtils.clearScreen ();
            }

            myUC002CaseEventUtils.setCaseNumber ("1234567");
            assertFalse ("Case Number is valid when should be invalid", myUC002CaseEventUtils.isCaseNumberValid ());
            myUC002CaseEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_INVALID_CASENUMBER);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 484 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseEvent484WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 484
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent484 = new NewStandardEvent ("484");
            testEvent484.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent484.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent484.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event484Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event484Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event484Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event484Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event484Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event484Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79ADate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("N79AServiceDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("N79AComptemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend", this);
            event484Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ11);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent484, event484Questions);

            // Retrieve the last 8 characters of the 484 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("484");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseEvent485WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 485
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent485 = new NewStandardEvent ("485");
            testEvent485.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent485.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent485.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event485Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event485Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("ArrestDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("N39ComtemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79AContemptDetails2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event485Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event485Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("N40BJudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ11);
            final VariableDataQuestion vdQ12 = new VariableDataQuestion ("N40BJudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ12);
            final VariableDataQuestion vdQ13 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ13);
            final VariableDataQuestion vdQ14 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ14);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent485, event485Questions);

            // Retrieve the last 8 characters of the 485 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("485");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 uses the current numbering generation
     * BEFORE the new numbering scheme comes into place.
     */
    public void testCaseEvent490WarrantCreationPreChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20200101");

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 490
             * Subject only
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screen
             * FCK Editor
             */
            final NewStandardEvent testEvent490 = new NewStandardEvent ("490");
            testEvent490.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent490.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent490.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event490Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event490Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event490Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("InjunctionDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event490Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent490, event490Questions);

            // Retrieve the last 8 characters of the 490 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("490");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the Northampton HOME
            // SYSTEM_DATA item
            final String enforcementLetter = DBUtil.getEnforcementLetter ();
            assertEquals (enforcementLetter + "0000094", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that Case Number field validation is as expected on the Case Events screen
     * POST the new numbering scheme comes into place.
     */
    public void testCaseNumberValidationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Get to Case Events screen and load Case
            final String caseNumber = "NN/00001";
            mLoginAndLoadCase (caseNumber);

            assertFalse ("Case Number is valid when should be invalid", myUC002CaseEventUtils.isCaseNumberValid ());
            myUC002CaseEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_MAGS_CASE_ENTERED);

            myUC002CaseEventUtils.clearScreen ();
            final String[] caseArray = {"3NN00001", "NN000001", "A01NN001", "001NN001", "A1AB1A1B", "A01B01A0"};
            for (int i = 0, l = caseArray.length; i < l; i++)
            {
                myUC002CaseEventUtils.setCaseNumber (caseArray[i]);
                assertTrue ("Case Number is invalid when should be valid", myUC002CaseEventUtils.isCaseNumberValid ());

                myUC002CaseEventUtils.clearScreen ();
            }

            myUC002CaseEventUtils.setCaseNumber ("1234567");
            assertFalse ("Case Number is valid when should be invalid", myUC002CaseEventUtils.isCaseNumberValid ());
            myUC002CaseEventUtils.setCaseNumberFocus ();
            mCheckStatusBarText (UC002CaseEventUtils.ERR_INVALID_CASENUMBER);

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 484 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseEvent484WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (5);

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 484
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent484 = new NewStandardEvent ("484");
            testEvent484.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent484.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent484.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event484Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event484Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event484Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event484Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event484Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event484Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79ADate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 = new VariableDataQuestion ("N79AServiceDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 = new VariableDataQuestion ("N79AComptemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Failed to attend", this);
            event484Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event484Questions.add (vdQ11);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent484, event484Questions);

            // Retrieve the last 8 characters of the 484 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("484");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the NEXT_WARRANT_NUMBER
            // database sequence
            assertEquals ("1A000005", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseEvent485WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (999999);

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 485
             * Subject + Instigator
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screenS
             * FCK Editor
             */
            final NewStandardEvent testEvent485 = new NewStandardEvent ("485");
            testEvent485.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent485.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent485.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event485Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("HearingDate2",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event485Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("ArrestDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ5);
            final VariableDataQuestion vdQ6 = new VariableDataQuestion ("N39Date",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ6);
            final VariableDataQuestion vdQ7 = new VariableDataQuestion ("N39ComtemptDtls",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ7);
            final VariableDataQuestion vdQ8 = new VariableDataQuestion ("N79AContemptDetails2",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Did not attend", this);
            event485Questions.add (vdQ8);
            final VariableDataQuestion vdQ9 =
                    new VariableDataQuestion ("PrisonName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Telford", this);
            event485Questions.add (vdQ9);
            final VariableDataQuestion vdQ10 =
                    new VariableDataQuestion ("CommitalDuration", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "1", this);
            event485Questions.add (vdQ10);
            final VariableDataQuestion vdQ11 = new VariableDataQuestion ("N40BJudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event485Questions.add (vdQ11);
            final VariableDataQuestion vdQ12 = new VariableDataQuestion ("N40BJudgeName",
                    VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event485Questions.add (vdQ12);
            final VariableDataQuestion vdQ13 = new VariableDataQuestion ("HearingDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ13);
            final VariableDataQuestion vdQ14 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event485Questions.add (vdQ14);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent485, event485Questions);

            // Retrieve the last 8 characters of the 485 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("485");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the NEXT_WARRANT_NUMBER
            // database sequence
            assertEquals ("1A999999", warrantNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Warrant creation with Case Event 485 uses the current numbering generation
     * AFTER the new numbering scheme comes into place.
     */
    public void testCaseEvent490WarrantCreationPostChange ()
    {
        try
        {
            // Set the date that the new numbering system comes into place to a date in the future
            DBUtil.setSystemDataItem ("NEW_NUMBERING_LIVE_DATE", "0", "20130101");

            // Set the next warrant number database sequence to a specific value
            DBUtil.setNextWarrantNumberSequenceNextVal (1000000);

            // Get to Case Events screen and load Case
            final String caseNumber = "3NN00001";
            mLoginAndLoadCase (caseNumber);

            /**
             * Create Event 490
             * Subject only
             * No Obligations
             * Variable Data Screen (WP Output)
             * Warrant created on Variable Data screen
             * FCK Editor
             */
            final NewStandardEvent testEvent490 = new NewStandardEvent ("490");
            testEvent490.setSubjectParty ("Defendant 1 - DEFENDANT ONE NAME");
            testEvent490.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));
            testEvent490.setEventDate (AbstractBaseUtils.getFutureDate ( -10, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event490Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("JudgeTitle",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Circuit Judge", this);
            event490Questions.add (vdQ1);
            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("JudgeName", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "Bob McBob", this);
            event490Questions.add (vdQ2);
            final VariableDataQuestion vdQ3 = new VariableDataQuestion ("InjunctionDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ3);
            final VariableDataQuestion vdQ4 =
                    new VariableDataQuestion ("MorFDebtor", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Male", this);
            event490Questions.add (vdQ4);
            final VariableDataQuestion vdQ5 = new VariableDataQuestion ("WarrantOrderDate",
                    VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER, AbstractBaseUtils.now (), this);
            event490Questions.add (vdQ5);

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent490, event490Questions);

            // Retrieve the last 8 characters of the 490 Details field which will be the Warrant Number
            myUC002CaseEventUtils.selectCaseEventByEventId ("490");
            final String eventDetails = myUC002CaseEventUtils.getEventDetails ();
            final String warrantNumber = eventDetails.substring (eventDetails.length () - 8);

            // Check that the Warrant number is the expected next number from the NEXT_WARRANT_NUMBER
            // database sequence
            assertEquals ("1C000000", warrantNumber);
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
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Private function that logs the user into CaseMan, navigates to Case Events and loads a Case Number.
     *
     * @param pCaseNumber Case number to load
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