/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
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
package uk.gov.dca.utils.common;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by David Turner. User: Administrator Date: 13-Feb-2009 Time: 09:53:56
 * Used to export tables in a specified database to a single flatfile
 */
public class DataGenerator
{
    
    /** The Constant NUMBER_CASES. */
    public static final int NUMBER_CASES = 10000;
    
    /** The Constant CREDITORS_ARRAY. */
    public static final String[] CREDITORS_ARRAY =
            {"1700", "1701", "1702", "1703", "1704", "1705", "1706", "1707", "1708", "1709"};
    
    /** The Constant CREDITORS_PARTYID_ARRAY. */
    public static final String[] CREDITORS_PARTYID_ARRAY = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"};
    
    /** The Constant YEARS_ARRAY. */
    public static final int[] YEARS_ARRAY = {2012, 2011, 2010, 2009, 2008};
    
    /** The Constant CCBC_COURT. */
    public static final String CCBC_COURT = "335";
    
    /** The Constant CASE_ALPHA_ARRAY. */
    public static final String[] CASE_ALPHA_ARRAY =
            {"QA", "QB", "QC", "QD", "QE", "QF", "QG", "QH", "QI", "QJ", "QK", "QL", "QM", "QN", "QO"};
    
    /** The Constant COURT_ARRAY. */
    public static final String[] COURT_ARRAY =
            {"335", "335", "335", "282", "335", "335", "335", "282", "335", "335", "335", "282", "335", "335", "335"};
    
    /** The Constant CASE_EVENT_ARRAY. */
    public static final String[] CASE_EVENT_ARRAY = {"30", "36", "38", "45", "49", "50", "52", "57", "60", "72", "73",
            "74", "76", "78", "79", "100", "132", "140", "150", "155", "160", "170", "174", "332", "555", "620", "999"};
    
    /** The Constant DECISION_ARRAY. */
    public static final String[] DECISION_ARRAY =
            {"YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO"};
    
    /** The Constant PARTY_TYPE_DEFENDANT. */
    public static final String PARTY_TYPE_DEFENDANT = "DEFENDANT";
    
    /** The Constant PARTY_TYPE_CLAIMANT. */
    public static final String PARTY_TYPE_CLAIMANT = "CLAIMANT";
    
    /** The Constant PARTY_TYPE_SOLICITOR. */
    public static final String PARTY_TYPE_SOLICITOR = "SOLICITOR";
    
    /** The case event sequence. */
    private static int case_event_sequence = 100000;
    
    /** The judgment sequence. */
    private static int judgment_sequence = 100000;
    
    /** The warrant sequence. */
    private static int warrant_sequence = 100000;
    
    /** The warrant number index. */
    private static int warrant_number_index = 1;
    
    /** The warrant return sequence. */
    private static int warrant_return_sequence = 100000;
    
    /** The variation sequence. */
    private static int variation_sequence = 100000;

    /**
     * The main method.
     *
     * @param args the arguments
     * @throws Exception the exception
     */
    public static void main (final String[] args) throws Exception
    {
        String caseNumber;
        String credCode;
        String dateOfIssue;
        String partyId;
        String creditorPartyId;
        String warrantId;
        String judgmentId;
        String courtCode;
        int year;
        int case_number_index = 1;
        int party_id_index = 1;
        int case_alpha_index = 0;
        boolean createJudgment = false;
        boolean createWarrant = false;
        int randomIndex;

        // Create Coded Party Details
        writeCodedCreditors ();

        for (int i = 0; i < NUMBER_CASES; i++)
        {
            randomIndex = (int) (Math.random () * (DECISION_ARRAY.length - 1));
            createJudgment = DECISION_ARRAY[randomIndex].equals ("YES") ? true : false;
            if (createJudgment)
            {
                // Only try and create a Warrant if a Judgment has been created
                randomIndex = (int) (Math.random () * (DECISION_ARRAY.length - 1));
                createWarrant = DECISION_ARRAY[randomIndex].equals ("YES") ? true : false;
            }

            randomIndex = (int) (Math.random () * (YEARS_ARRAY.length - 1));
            year = YEARS_ARRAY[randomIndex];
            caseNumber = new Integer (year).toString ().substring (3) + CASE_ALPHA_ARRAY[case_alpha_index] +
                    padCharacter ("0", 5, new Integer (case_number_index).toString ());

            randomIndex = (int) (Math.random () * (CREDITORS_ARRAY.length - 1));
            credCode = CREDITORS_ARRAY[randomIndex];
            creditorPartyId = CREDITORS_PARTYID_ARRAY[randomIndex];
            dateOfIssue = generateDateByYear (year);

            randomIndex = (int) (Math.random () * (COURT_ARRAY.length - 1));
            courtCode = COURT_ARRAY[randomIndex];

            // Create Case
            writeCaseRecord (caseNumber, courtCode, credCode, dateOfIssue);

            // Create Claimant #1
            partyId = writePartiesRecord (PARTY_TYPE_CLAIMANT, "1", party_id_index++);
            writeCasePartyRolesRecord (caseNumber, partyId, PARTY_TYPE_CLAIMANT, "1");
            writeGivenAddressesRecord (caseNumber, partyId, PARTY_TYPE_CLAIMANT, "1", dateOfIssue);
            writeCPRRelationshipRecord (caseNumber, PARTY_TYPE_CLAIMANT, "1");

            // Create Claimant Solicitor
            writeCasePartyRolesRecord (caseNumber, creditorPartyId, PARTY_TYPE_SOLICITOR, "1");

            // Create Defendant #1
            partyId = writePartiesRecord (PARTY_TYPE_DEFENDANT, "1", party_id_index++);
            writeCasePartyRolesRecord (caseNumber, partyId, PARTY_TYPE_DEFENDANT, "1");
            writeGivenAddressesRecord (caseNumber, partyId, PARTY_TYPE_DEFENDANT, "1", dateOfIssue);

            // Judgment Records
            judgmentId = "";
            if (createJudgment)
            {
                judgmentId = writeJudgmentRecord (caseNumber, "1", getFormattedDate (dateOfIssue, 14), courtCode);
            }

            // Write Warrant Record
            warrantId = "";
            if (createWarrant)
            {
                warrantId =
                        writeWarrantRecord (caseNumber, "1", getFormattedDate (dateOfIssue, 28), courtCode, credCode);
            }

            // Add 5 randomly selected events for each case
            String eventCode;
            for (int j = 0; j < 5; j++)
            {
                randomIndex = (int) (Math.random () * (CASE_EVENT_ARRAY.length - 1));
                eventCode = CASE_EVENT_ARRAY[randomIndex];
                final String eventDate = getFormattedDate (dateOfIssue, 32 + j);

                if (eventCode.equals ("620"))
                {
                    // Final Return
                    if (createWarrant)
                    {
                        writeWarrantReturnRecord (caseNumber, "1", eventDate, courtCode, "101", warrantId);
                    }
                }
                else if (eventCode.equals ("79") || eventCode.equals ("140") || eventCode.equals ("150") ||
                        eventCode.equals ("155") || eventCode.equals ("160") || eventCode.equals ("170"))
                {
                    // Judgment Event
                    if (createJudgment)
                    {
                        if (eventCode.equals ("79") || eventCode.equals ("160"))
                        {
                            writeCaseEventRecord (caseNumber, eventCode, eventDate, "N", courtCode, judgmentId,
                                    PARTY_TYPE_DEFENDANT, "1", null, null);
                        }
                        else if (eventCode.equals ("170"))
                        {
                            writeCaseEventRecord (caseNumber, "160", eventDate, "N", courtCode, judgmentId,
                                    PARTY_TYPE_DEFENDANT, "1", null, "GRANTED");
                            writeCaseEventRecord (caseNumber, eventCode, eventDate, "N", courtCode, judgmentId,
                                    PARTY_TYPE_DEFENDANT, "1", null, "GRANTED");
                        }
                        else
                        {
                            String result = null;
                            if (eventCode.equals ("150"))
                            {
                                result = "GRANTED";
                            }
                            else if (eventCode.equals ("155"))
                            {
                                result = "DETERMINED";
                            }
                            writeVariationRecord (judgmentId, eventDate, result, courtCode, caseNumber, "1");
                        }
                    }
                }
                else if (eventCode.equals ("36") || eventCode.equals ("555") || eventCode.equals ("57") ||
                        eventCode.equals ("72") || eventCode.equals ("999"))
                {
                    // Events with no subject
                    writeCaseEventRecord (caseNumber, eventCode, eventDate, "N", courtCode, null, null, null, null,
                            null);
                }
                else
                {
                    // Events with a subject
                    writeCaseEventRecord (caseNumber, eventCode, eventDate, "N", courtCode, null, PARTY_TYPE_DEFENDANT,
                            "1", null, null);
                }
            }

            // Checks required if creating 100,000 cases or more
            case_number_index++;
            if (case_number_index == 100000)
            {
                // Reset to 1 and use the next letter combination
                case_alpha_index++;
                case_number_index = 1;
            }
        }
    }

    /**
     * Sets up the National Coded Party Data.
     */
    private static void writeCodedCreditors ()
    {
        String party;
        for (int i = 0, l = CREDITORS_ARRAY.length; i < l; i++)
        {
            party = "CCBC NCP " + CREDITORS_ARRAY[i];
            writePartiesRecordCP (CREDITORS_PARTYID_ARRAY[i], party + " NAME");
            writeGivenAddressesRecordCP (CREDITORS_PARTYID_ARRAY[i], party);
            writeCodedPartiesRecord (CREDITORS_PARTYID_ARRAY[i], CREDITORS_ARRAY[i]);
            writeNationalCodedPartiesRecord (CREDITORS_ARRAY[i]);
        }
    }

    /**
     * Write case record.
     *
     * @param pCaseNumber the case number
     * @param pCourtCode the court code
     * @param pCredCode the cred code
     * @param pDateOfIssue the date of issue
     */
    private static void writeCaseRecord (final String pCaseNumber, final String pCourtCode, final String pCredCode,
                                         final String pDateOfIssue)
    {

        final String str = "<CASES CASE_NUMBER=\"" + pCaseNumber +
                "\" CASE_TYPE=\"CLAIM - SPEC ONLY\" ADMIN_CRT_CODE=\"" + pCourtCode + "\" " +
                "AMOUNT_CLAIMED=\"100\" COURT_FEE=\"100\" SOLICITORS_COSTS=\"100\" TOTAL=\"300\" DATE_OF_ISSUE=\"" +
                pDateOfIssue + "\" " + "RECEIPT_DATE=\"" + pDateOfIssue +
                "\" AMOUNT_CLAIMED_CURRENCY=\"GBP\" COURT_FEE_CURRENCY=\"GBP\" SOLICITORS_COSTS_CURRENCY=\"GBP\" " +
                "TOTAL_CURRENCY=\"GBP\" CRED_CODE=\"" + pCredCode + "\"/>";
        final String path = "C:/Cases.txt";
        PrintWriter pw = null;
        final String eventDate;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
            writeCaseEventRecord (pCaseNumber, "1", pDateOfIssue, "N", pCourtCode, null, null, null, null, null);
            if ( !pCourtCode.equals (CCBC_COURT))
            {
                // case has been transferred, create transfer out events
                eventDate = getFormattedDate (pDateOfIssue, 2);
                writeCaseEventRecord (pCaseNumber, "340", eventDate, "N", CCBC_COURT, null, null, null, null, null);
                writeCaseEventRecord (pCaseNumber, "360", eventDate, "N", pCourtCode, null, null, null, null, null);
            }
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write parties record.
     *
     * @param pPartyTypeCode the party type code
     * @param pCasePartyNo the case party no
     * @param partiesIndex the parties index
     * @return the string
     */
    private static String writePartiesRecord (final String pPartyTypeCode, final String pCasePartyNo,
                                              final int partiesIndex)
    {
        final String partyId = "1" + padCharacter ("0", 5, new Integer (partiesIndex).toString ());
        final String partyName = pPartyTypeCode + " " + pCasePartyNo + " NAME";
        final String str = "<PARTIES PARTY_ID=\"" + partyId + "\" PARTY_TYPE_CODE=\"" + pPartyTypeCode + "\" " +
                "PERSON_REQUESTED_NAME=\"" + partyName + "\"/>";
        final String path = "C:/Parties.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
        return partyId;
    }

    /**
     * Write parties record CP.
     *
     * @param pPartyId the party id
     * @param pPartyName the party name
     */
    private static void writePartiesRecordCP (final String pPartyId, final String pPartyName)
    {
        final String str = "<PARTIES PARTY_ID=\"" + pPartyId + "\" PARTY_TYPE_CODE=\"SOLICITOR\" " +
                "PERSON_REQUESTED_NAME=\"" + pPartyName + "\"/>";
        final String path = "C:/Parties.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write case party roles record.
     *
     * @param pCaseNumber the case number
     * @param pPartyId the party id
     * @param pPartyTypeCode the party type code
     * @param pCasePartyNo the case party no
     */
    private static void writeCasePartyRolesRecord (final String pCaseNumber, final String pPartyId,
                                                   final String pPartyTypeCode, final String pCasePartyNo)
    {
        final String str = "<CASE_PARTY_ROLES CASE_NUMBER=\"" + pCaseNumber + "\" PARTY_ID=\"" + pPartyId +
                "\" PARTY_ROLE_CODE=\"" + pPartyTypeCode + "\" " + "CASE_PARTY_NO=\"" + pCasePartyNo +
                "\" PAYEE_FLAG=\"N\" WELSH_INDICATOR=\"N\" PREFERRED_COMMUNICATION_METHOD=\"LE\"/>";
        final String path = "C:/CasePartyRoles.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write given addresses record.
     *
     * @param pCaseNumber the case number
     * @param pPartyId the party id
     * @param pPartyTypeCode the party type code
     * @param pCasePartyNo the case party no
     * @param pDate the date
     */
    private static void writeGivenAddressesRecord (final String pCaseNumber, final String pPartyId,
                                                   final String pPartyTypeCode, final String pCasePartyNo,
                                                   final String pDate)
    {
        final String addressLine = pPartyTypeCode + " " + pCasePartyNo + " ";
        final String str = "<GIVEN_ADDRESSES ADDRESS_ID=\"" + pPartyId + "\" ADDRESS_LINE1=\"" + addressLine +
                "ADLINE1\" " + "ADDRESS_LINE2=\"" + addressLine + "ADLINE2\" VALID_FROM=\"" + pDate + "\" PARTY_ID=\"" +
                pPartyId + "\" " + "CASE_NUMBER=\"" + pCaseNumber + "\" PARTY_ROLE_CODE=\"" + pPartyTypeCode +
                "\" ADDRESS_TYPE_CODE=\"SERVICE\" " + "UPDATED_BY=\"azwnn1\" CASE_PARTY_NO=\"" + pCasePartyNo + "\"/>";
        final String path = "C:/GivenAddresses.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write given addresses record CP.
     *
     * @param pPartyId the party id
     * @param pParty the party
     */
    private static void writeGivenAddressesRecordCP (final String pPartyId, final String pParty)
    {
        final String addressId = "1" + padCharacter ("0", 4, new Integer (pPartyId).toString ());
        final String str = "<GIVEN_ADDRESSES ADDRESS_ID=\"" + addressId + "\" ADDRESS_LINE1=\"" + pParty +
                " ADLINE1\" ADDRESS_LINE2=\"" + pParty + " ADLINE2\" " + "POSTCODE=\"B37 7ES\" PARTY_ID=\"" + pPartyId +
                "\" ADDRESS_TYPE_CODE=\"CODED PARTY\" UPDATED_BY=\"azxxx1\"/>";
        final String path = "C:/GivenAddresses.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write CPR relationship record.
     *
     * @param pCaseNumber the case number
     * @param pPartyTypeCode the party type code
     * @param pCasePartyNo the case party no
     */
    private static void writeCPRRelationshipRecord (final String pCaseNumber, final String pPartyTypeCode,
                                                    final String pCasePartyNo)
    {
        final String str = "<CPR_TO_CPR_RELATIONSHIP CPR_A_CASE_NUMBER=\"" + pCaseNumber +
                "\" CPR_A_PARTY_ROLE_CODE=\"" + pPartyTypeCode + "\" " +
                "CPR_B_PARTY_ROLE_CODE=\"SOLICITOR\" CPR_B_CASE_NUMBER=\"" + pCaseNumber +
                "\" CPR_B_CASE_PARTY_NO=\"1\" " + "CPR_A_CASE_PARTY_NO=\"" + pCasePartyNo + "\" DELETED_FLAG=\"N\"/>";
        final String path = "C:/CPRToCPRRelationship.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write coded parties record.
     *
     * @param pPartyId the party id
     * @param pCredCode the cred code
     */
    private static void writeCodedPartiesRecord (final String pPartyId, final String pCredCode)
    {
        final String str = "<CODED_PARTIES PARTY_ID=\"" + pPartyId + "\" CODE=\"" + pCredCode +
                "\" ADMIN_COURT_CODE=\"335\" " + "PERSON_REQUESTED_NAME=\"CCBC NCP " + pCredCode +
                " NAME\" ADDRESS_LINE1=\"CCBC NCP " + pCredCode + " ADLINE1\" " + "ADDRESS_LINE2=\"CCBC NCP " +
                pCredCode + " ADLINE2\" POSTCODE=\"B37 7ES\"/>";
        final String path = "C:/CodedParties.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write national coded parties record.
     *
     * @param pCredCode the cred code
     */
    private static void writeNationalCodedPartiesRecord (final String pCredCode)
    {
        final String str =
                "<NATIONAL_CODED_PARTIES CODE=\"" + pCredCode + "\" GIRO_JUDGMENTS=\"N\" ADMIN_COURT_CODE=\"335\" " +
                        "LAST_JG_SEQ=\"0\" LAST_PD_SEQ=\"0\" LAST_WT_SEQ=\"0\" LAST_DEF_SEQ=\"0\" LAST_ADM_SEQ=\"0\" " +
                        "DUPLEX=\"N\" PRINT_JUDGMENTS=\"N\"/>";
        final String path = "C:/NationalCodedParties.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write case event record.
     *
     * @param pCaseNumber the case number
     * @param pEventId the event id
     * @param pEventDate the event date
     * @param pDeleted the deleted
     * @param pCourtCode the court code
     * @param pJudgSeq the judg seq
     * @param pSubjectRole the subject role
     * @param pSubjectNo the subject no
     * @param pWarrantId the warrant id
     * @param pResult the result
     */
    private static void writeCaseEventRecord (final String pCaseNumber, final String pEventId, final String pEventDate,
                                              final String pDeleted, final String pCourtCode, final String pJudgSeq,
                                              final String pSubjectRole, final String pSubjectNo,
                                              final String pWarrantId, final String pResult)
    {
        final String event_seq = new Integer (case_event_sequence++).toString ();
        String judg_seq_text = "";
        if (null != pJudgSeq)
        {
            judg_seq_text = "JUDG_SEQ=\"" + pJudgSeq + "\" ";
        }

        String warrant_text = "";
        if (null != pWarrantId)
        {
            warrant_text = "WARRANT_ID=\"" + pWarrantId + "\" ";
        }

        String subject_text = "";
        if (null != pSubjectRole && null != pSubjectNo)
        {
            subject_text = "PARTY_ROLE_CODE=\"" + pSubjectRole + "\" CASE_PARTY_NO=\"" + pSubjectNo + "\" ";
        }

        String result_text = "";
        if (null != pResult)
        {
            result_text = "RESULT=\"" + pResult + "\" ";
        }

        final String str = "<CASE_EVENTS EVENT_SEQ=\"" + event_seq + "\" CASE_NUMBER=\"" + pCaseNumber +
                "\" STD_EVENT_ID=\"" + pEventId + "\" " + "EVENT_DATE=\"" + pEventDate + "\" " + result_text +
                judg_seq_text + "DELETED_FLAG=\"" + pDeleted + "\" USERNAME=\"azwnn1\" RECEIPT_DATE=\"" + pEventDate +
                "\" " + "CRT_CODE=\"" + pCourtCode + "\" " + warrant_text + subject_text + "/>";
        final String path = "C:/CaseEvents.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write judgment record.
     *
     * @param pCaseNumber the case number
     * @param pDefendantId the defendant id
     * @param pJudgDate the judg date
     * @param pCourtCode the court code
     * @return the string
     */
    private static String writeJudgmentRecord (final String pCaseNumber, final String pDefendantId,
                                               final String pJudgDate, final String pCourtCode)
    {
        final String judg_seq = new Integer (judgment_sequence++).toString ();
        final String str = "<JUDGMENTS JUDG_SEQ=\"" + judg_seq + "\" JUDGMENT_TYPE=\"DEFAULT\" JOINT_JUDGMENT=\"N\" " +
                "JUDGMENT_DATE=\"" + pJudgDate + "\" SENT_TO_RTL=\"" + pJudgDate +
                "\" JUDGMENT_AMOUNT=\"100\" TOTAL_COSTS=\"0\" " +
                "TOTAL=\"100\" INSTALMENT_PERIOD=\"FW\" JUDGMENT_COURT_CODE=\"" + pCourtCode +
                "\" JUDGMENT_AMOUNT_CURRENCY=\"GBP\" " +
                "TOTAL_COSTS_CURRENCY=\"GBP\" PAID_BEFORE_JUDGMENT_CURRENCY=\"GBP\" TOTAL_CURRENCY=\"GBP\" " +
                "INSTALMENT_AMOUNT_CURRENCY=\"GBP\" CASE_NUMBER=\"" + pCaseNumber +
                "\" AGAINST_PARTY_ROLE_CODE=\"DEFENDANT\" " + "AGAINST_CASE_PARTY_NO=\"" + pDefendantId + "\"/>";
        final String path = "C:/Judgments.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
            writeCaseEventRecord (pCaseNumber, "230", pJudgDate, "N", pCourtCode, judg_seq, PARTY_TYPE_DEFENDANT,
                    pDefendantId, null, null);
            writeInFavourPartiesRecord (pCaseNumber, judg_seq);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
        return judg_seq;
    }

    /**
     * Write in favour parties record.
     *
     * @param pCaseNumber the case number
     * @param pJudgSeq the judg seq
     */
    private static void writeInFavourPartiesRecord (final String pCaseNumber, final String pJudgSeq)
    {
        final String str = "<INFAVOUR_PARTIES JUDG_SEQ=\"" + pJudgSeq + "\" CASE_NUMBER=\"" + pCaseNumber +
                "\" CASE_PARTY_NO=\"1\" " + "PARTY_ROLE_CODE=\"CLAIMANT\"/>";
        final String path = "C:/InfavourParties.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write warrant record.
     *
     * @param pCaseNumber the case number
     * @param pDefendantId the defendant id
     * @param pWarrantDate the warrant date
     * @param pCourtCode the court code
     * @param pCredCode the cred code
     * @return the string
     */
    private static String writeWarrantRecord (final String pCaseNumber, final String pDefendantId,
                                              final String pWarrantDate, final String pCourtCode,
                                              final String pCredCode)
    {
        final String hw_warrant_seq = new Integer (warrant_sequence++).toString ();
        final String fw_warrant_seq = new Integer (warrant_sequence++).toString ();
        final String warrantNumber = "1A" + padCharacter ("0", 6, new Integer (warrant_number_index++).toString ());

        final String hw_str = "<WARRANTS WARRANT_ID=\"" + hw_warrant_seq + "\" WARRANT_NUMBER=\"" + warrantNumber +
                "\" ISSUED_BY=\"" + CCBC_COURT + "\" " +
                "BALANCE_AFTER_PAID=\"0\" WARRANT_AMOUNT=\"100\" WARRANT_ISSUE_DATE=\"" + pWarrantDate +
                "\" WARRANT_TYPE=\"EXECUTION\" " +
                "EXECUTED_BY=\"282\" PLAINTIFF_NAME=\"CLAIMANT 1 NAME\" DEFENDANT1=\"DEFENDANT " + pDefendantId +
                " NAME\" " + "DEF1_ADDR_1=\"DEFENDANT " + pDefendantId + " ADLINE1\" DEF1_ADDR_2=\"DEFENDANT " +
                pDefendantId + " ADLINE2\" " +
                "BAILIFF_IDENTIFIER=\"99\" WARRANT_FEE=\"90\" SOLICITOR_COSTS=\"2.25\" PREISSUE_BALANCE=\"100\" CCBC_WARRANT=\"Y\" TO_TRANSFER=\"2\" " +
                "TRANSFER_DATE=\"" + pWarrantDate + "\" RECEIPT_DATE=\"" + pWarrantDate + "\" CURRENTLY_OWNED_BY=\"" +
                CCBC_COURT + "\" " + "CASE_NUMBER=\"" + pCaseNumber +
                "\" DEF1_PARTY_ROLE_CODE=\"DEFENDANT\" REP_PARTY_ROLE_CODE=\"SOLICITOR\" " +
                "REP_CASE_PARTY_NO=\"1\" DEF1_CASE_PARTY_NO=\"1\" REP_NAME=\"CCBC NCP " + pCredCode + " NAME\" " +
                "REP_ADDR_1=\"CCBC NCP " + pCredCode + " ADLINE2\" REP_ADDR_2=\"CCBC NCP " + pCredCode + " ADLINE2\" " +
                "REP_POSTCODE=\"B37 7ES\" CODED_PARTY_REP_CODE=\"" + pCredCode + "\"/>";

        final String fw_str = "<WARRANTS WARRANT_ID=\"" + fw_warrant_seq + "\" LOCAL_WARRANT_NUMBER=\"" +
                warrantNumber + "\" " + "WARRANT_NUMBER=\"" + warrantNumber + "\" ISSUED_BY=\"" + CCBC_COURT +
                "\" BALANCE_AFTER_PAID=\"0\" WARRANT_AMOUNT=\"100\" " + "WARRANT_ISSUE_DATE=\"" + pWarrantDate +
                "\" WARRANT_TYPE=\"EXECUTION\" EXECUTED_BY=\"282\" PLAINTIFF_NAME=\"CLAIMANT 1 NAME\" " +
                "DEFENDANT1=\"DEFENDANT " + pDefendantId + " NAME\" DEF1_ADDR_1=\"DEFENDANT " + pDefendantId +
                " ADLINE1\" " + "DEF1_ADDR_2=\"DEFENDANT " + pDefendantId + " ADLINE2\" HOME_COURT_ISSUE_DATE=\"" +
                pWarrantDate + "\" WARRANT_FEE=\"90\" " +
                "SOLICITOR_COSTS=\"2.25\" PREISSUE_BALANCE=\"100\" CCBC_WARRANT=\"Y\" TO_TRANSFER=\"0\" RECEIPT_DATE=\"" +
                pWarrantDate + "\" " + "CURRENTLY_OWNED_BY=\"282\" CASE_NUMBER=\"" + pCaseNumber +
                "\" DEF1_PARTY_ROLE_CODE=\"DEFENDANT\" REP_PARTY_ROLE_CODE=\"SOLICITOR\" " +
                "REP_CASE_PARTY_NO=\"1\" DEF1_CASE_PARTY_NO=\"1\" REP_NAME=\"CCBC NCP " + pCredCode + " NAME\" " +
                "REP_ADDR_1=\"CCBC NCP " + pCredCode + " ADLINE1\" REP_ADDR_2=\"CCBC NCP " + pCredCode +
                " ADLINE2\" REP_POSTCODE=\"B37 7ES\" " + "CODED_PARTY_REP_CODE=\"" + pCredCode + "\"/>";

        final String path = "C:/Warrants.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (hw_str);
            pw.println (fw_str);
            writeCaseEventRecord (pCaseNumber, "380", pWarrantDate, "N", pCourtCode, null, null, null, hw_warrant_seq,
                    null);
            writeWarrantReturnRecord (pCaseNumber, pDefendantId, pWarrantDate, pCourtCode, "147", hw_warrant_seq);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
        return hw_warrant_seq;
    }

    /**
     * Write warrant return record.
     *
     * @param pCaseNumber the case number
     * @param pDefendantId the defendant id
     * @param pWarrantDate the warrant date
     * @param pCourtCode the court code
     * @param pReturnCode the return code
     * @param pWarrantId the warrant id
     */
    private static void writeWarrantReturnRecord (final String pCaseNumber, final String pDefendantId,
                                                  final String pWarrantDate, final String pCourtCode,
                                                  final String pReturnCode, final String pWarrantId)
    {
        final String return_seq = new Integer (warrant_return_sequence++).toString ();
        final String next_event_seq = new Integer (case_event_sequence).toString ();
        final String str = "<WARRANT_RETURNS WARRANT_RETURNS_ID=\"" + return_seq + "\" WARRANT_RETURN_DATE=\"" +
                pWarrantDate + "\" " + "ERROR_INDICATOR=\"N\" NOTICE_REQUIRED=\"Y\" DEFENDANT_ID=\"" + pDefendantId +
                "\" ADDITIONAL_INFORMATION=\"NORTHAMPTON\" " + "TO_TRANSFER=\"0\" RECEIPT_DATE=\"" + pWarrantDate +
                "\" RETURN_CODE=\"" + pReturnCode + "\" WARRANT_ID=\"" + pWarrantId + "\" " +
                "RETURN_CODE_COURT_CODE=\"0\" CREATED_BY=\"azhnn1\" ADMIN_COURT_CODE=\"" + pCourtCode +
                "\" EVENT_SEQ=\"" + next_event_seq + "\"/>";
        final String path = "C:/WarrantReturns.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
            writeCaseEventRecord (pCaseNumber, "620", pWarrantDate, "N", pCourtCode, null, PARTY_TYPE_DEFENDANT,
                    pDefendantId, pWarrantId, null);
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Write variation record.
     *
     * @param pJudgmentId the judgment id
     * @param pDate the date
     * @param pResult the result
     * @param pCourtCode the court code
     * @param pCaseNumber the case number
     * @param pDefendantId the defendant id
     */
    private static void writeVariationRecord (final String pJudgmentId, final String pDate, final String pResult,
                                              final String pCourtCode, final String pCaseNumber,
                                              final String pDefendantId)
    {
        final String vary_seq = new Integer (variation_sequence++).toString ();

        String result_text = "";
        if (null != pResult)
        {
            result_text = "FIRST_PAYMENT_DATE = \"" + pDate + "\" RESULT=\"" + pResult + "\" RESULT_DATE=\"" + pDate +
                    "\" " + "DETERMINATION_AMOUNT=\"10\" DETERMINATION_PERIOD=\"MTH\" ";
        }

        final String str =
                "<VARIATIONS VARY_SEQ=\"" + vary_seq + "\" JUDG_SEQ=\"" + pJudgmentId + "\" APPLICATION_DATE=\"" +
                        pDate + "\" " + "REQUESTER=\"PARTY AGAINST\" OFFER_AMOUNT=\"10\" OFFER_PERIOD=\"MTH\" " +
                        result_text + "OFFER_AMOUNT_CURRENCY=\"GBP\" " + "DETERMINATION_AMOUNT_CURRENCY=\"GBP\"/>";
        final String path = "C:/Variations.txt";
        PrintWriter pw = null;

        try
        {
            pw = new PrintWriter (new FileWriter (path, true));
            pw.println (str);
            writeCaseEventRecord (pCaseNumber, "140", pDate, "N", pCourtCode, pJudgmentId, PARTY_TYPE_DEFENDANT,
                    pDefendantId, null, pResult);
            if (null != pResult)
            {
                if (pResult.equals ("GRANTED"))
                {
                    writeCaseEventRecord (pCaseNumber, "150", pDate, "N", pCourtCode, pJudgmentId, PARTY_TYPE_DEFENDANT,
                            pDefendantId, null, pResult);
                }
                else if (pResult.equals ("DETERMINED"))
                {
                    writeCaseEventRecord (pCaseNumber, "155", pDate, "N", pCourtCode, pJudgmentId, PARTY_TYPE_DEFENDANT,
                            pDefendantId, null, pResult);
                }
            }
        }
        catch (final Exception e)
        {
            // oh noes!
        }
        finally
        {
            if (null != pw)
            {
                pw.close ();
            }
        }
    }

    /**
     * Pads a String out with a character passed in.
     *
     * @param c The character to pad with
     * @param num The length of the desired string
     * @param str The current content to be included
     * @return The padded String
     */
    private static String padCharacter (final String c, final int num, final String str)
    {
        String temp = "";
        for (int i = 0; i <= num - str.length () - 1; i++)
        {
            temp += c;
        }
        temp += str;
        return temp;
    }

    /**
     * Randomly generates a date within a supplied year.
     *
     * @param year The year to use
     * @return A randomly generated date in the format YYYY-MM-DD
     */
    private static String generateDateByYear (final int year)
    {
        final String startYear = new Integer (year).toString ();
        final String endYear = new Integer (year + 1).toString ();
        final long offset = Timestamp.valueOf (startYear + "-01-01 00:00:00").getTime ();
        final long end = Timestamp.valueOf (endYear + "-01-01 00:00:00").getTime ();
        final long diff = end - offset + 1;
        final Timestamp rand = new Timestamp (offset + (long) (Math.random () * diff));
        return rand.toString ().substring (0, 10);
    }

    /**
     * Takes a date string in the format YYYY-MM-DD, adds a defined number of days
     * and returns a new date string back in the same format.
     * 
     * @param date The date string to start with
     * @param daysToAdd Number of days to add
     * @return New date string
     */
    private static String getFormattedDate (final String date, final int daysToAdd)
    {
        final SimpleDateFormat format = new SimpleDateFormat ("yyyy-MM-dd");
        String returnDate = date;

        try
        {
            final Date dateObject = format.parse (date);
            final Calendar calendar = new GregorianCalendar ();
            calendar.setTime (dateObject);
            calendar.add (Calendar.DAY_OF_MONTH, daysToAdd);
            returnDate = format.format (calendar.getTime ());
        }
        catch (final Exception e)
        {
            // Do nothing
        }
        return returnDate;
    }
}