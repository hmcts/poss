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
package uk.gov.dca.utils.velo.db;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Suite of Database utilities for directly accessing the database tables.
 */
public class DBUtil
{
    
    /**
     * Sets the court printers.
     *
     * @param print the new court printers
     */
    public static void setCourtPrinters (final boolean print)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;
        final String fap = print ? "psc0001" : "csf20069";
        final String printer = print ? "DOM0001" : "CSP00PDF";

        try
        {
            // Execute the update query
            final String query = "UPDATE courts SET default_printer = '" + printer + "', fap_id = '" + fap + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final int result = ps.executeUpdate (query);
            System.out.println (result + " COURT rows updated.");
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Function updates all WP_OUTPUT records to have a PRINTED value of
     * 'N', which will allow the outputs to be displayed in the Run Order
     * Printing screen.
     */
    public static void setWPOutputRowsNotPrinted ()
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the update query
            final String query = "UPDATE wp_output SET printed = 'N'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final int result = ps.executeUpdate (query);
            System.out.println (result + " WP_OUTPUT rows updated.");
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Function updates a specified SYSTEM_DATA item value.
     *
     * @param pItem The SYSTEM_DATA item name
     * @param pCourtCode The court code the item belongs to
     * @param pValue The new value for the SYSTEM_DATA item
     */
    public static void setSystemDataItem (final String pItem, final String pCourtCode, final String pValue)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the update query
            final String query = "UPDATE system_data SET item_value = " + pValue + " WHERE item = '" + pItem +
                    "' AND admin_court_code = " + pCourtCode;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final int result = ps.executeUpdate (query);
            System.out
                    .println (pItem + " SYSTEM_DATA item for court " + pCourtCode + " set to " + pValue + " " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Gets the enforcement letter.
     *
     * @return the enforcement letter
     */
    public static String getEnforcementLetter ()
    {
        String enforcementLetter = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the enforcement letter
            final String query =
                    "SELECT E.LETTER FROM ENFORCEMENT_LETTERS E WHERE E.YEAR_VALUE = TO_CHAR(SYSDATE, 'YYYY')";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                enforcementLetter = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return enforcementLetter;
    }

    /**
     * Gets the two digit year.
     *
     * @return the two digit year
     */
    public static String getTwoDigitYear ()
    {
        String year = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the year
            final String query = "SELECT TO_CHAR(SYSDATE, 'YY') FROM DUAL";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                year = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return year;
    }

    /**
     * Returns the ENFORCEMENT_PARENT of a PAYMENT record.
     *
     * @param transactionNo Transaction number of the payment
     * @param courtCode Court code of the payment
     * @return The enforcement parent of the payment
     */
    public static String getEnforcementParent (final String transactionNo, final String courtCode)
    {
        String enforcementParent = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the enforcement parent
            final String query = "SELECT enforcement_parent FROM payments WHERE " + "transaction_number = " +
                    transactionNo + " AND " + "admin_court_code = " + courtCode;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                enforcementParent = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return enforcementParent;
    }

    /**
     * Returns a count of the number of records on the Fees_Paid table matching the criteria
     * passed in.
     *
     * @param processType The process type - will be W for warrants and A for AEs
     * @param processNumber The process number - either a warrant number or AE number
     * @param issuingCourt The issuing court of the warrant or AE
     * @return A count of the number of records associated with the specified warrant/AE
     */
    public static int getNumberFeesPaidRecords (final String processType, final String processNumber,
                                                final String issuingCourt)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM fees_paid WHERE " + "process_type = '" + processType + "' AND " +
                    "process_number = '" + processNumber + "' AND " + "issuing_court = " + issuingCourt + "";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the number of active obligations in the database. Can be constrained by
     * Obligation Type, or all Obligations if value passed in is a wildcard (%)
     *
     * @param obligationType The Obligation Type to look for, is % for all Obligation types
     * @return Count
     */
    public static int getNumberActiveObligations (final String obligationType)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            String oblTypeConstraint = "";
            if ( !obligationType.equals ("%"))
            {
                oblTypeConstraint = " AND obligation_type = " + obligationType + "";
            }

            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM obligations WHERE " + "delete_flag = 'N' AND " +
                    "trunc(expiry_date) < trunc(sysdate)" + oblTypeConstraint;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns a count of the number of REPORT_MAP rows that exist for the outputType
     * (e.g. N10) provided
     *
     * @param outputType Output type e.g. N10
     * @return Number of matching rows
     */
    public static int getCountReportMapRowsForOutput (final String outputType)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM report_map WHERE " + "report_name = '" + outputType + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Gets the count report map rows.
     *
     * @return the count report map rows
     */
    public static int getCountReportMapRows ()
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM report_map";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns a count of the number of MCOL_DATA rows for a given case.
     *
     * @param caseNumber Case Number
     * @return Number of matching rows
     */
    public static int getCountMCOLDataRowsForCase (final String caseNumber)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM mcol_data WHERE " + "claim_number = '" + caseNumber + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns a count of the number of MCOL_DATA rows for a given case and a specific
     * code.
     *
     * @param caseNumber Case Number
     * @param typeCode Type Code
     * @return Number of matching rows
     */
    public static int getCountMCOLDataRowsForCase (final String caseNumber, final String typeCode)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM mcol_data WHERE " + "claim_number = '" + caseNumber + "' AND " +
                    "type = '" + typeCode + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns a count of the number of MCOL_DATA rows for a given case and a specific
     * code and specific creditor codes (new and old) meant for Ownership changes.
     *
     * @param caseNumber Case Number
     * @param typeCode Type Code
     * @param prevCredCode Previous Creditor Code
     * @param newCredCode New Creditor Code
     * @return Number of matching rows
     */
    public static int getCountMCOLDataRowsForCase (final String caseNumber, final String typeCode,
                                                   final String prevCredCode, final String newCredCode)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM mcol_data WHERE " + "claim_number = '" + caseNumber + "' AND " +
                    "type = '" + typeCode + "' AND " + "previous_creditor = " + prevCredCode + " AND " +
                    "new_creditor = " + newCredCode;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns a count of the number of MCOL_DATA rows for a given case and a specific
     * defendant id.
     *
     * @param caseNumber Case Number
     * @param typeCode Type Code
     * @param defendantId Defendant Id
     * @return Number of matching rows
     */
    public static int getCountMCOLDataRowsForCase (final String caseNumber, final String typeCode,
                                                   final String defendantId)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;
        final String defClause;
        if (defendantId == null || defendantId.equals (""))
        {
            defClause = "deft_id IS NULL";
        }
        else
        {
            defClause = "deft_id = " + defendantId;
        }

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM mcol_data WHERE " + "claim_number = '" + caseNumber + "' AND " +
                    "type = '" + typeCode + "' AND " + defClause;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the PRINT_STATUS column of the REPORT_QUEUE row linked to a finalised output
     * on a Case Event.
     *
     * @param stdEventId The Event id (e.g. 1)
     * @param caseNumber The Case Number the event is on
     * @return The output print status (2 if successful, 0 if not printed)
     */
    public static int getReportQueuePrintStatusForCaseEvent (final String stdEventId, final String caseNumber)
    {
        int printStatus = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the print status
            final String query = "SELECT rq.print_status FROM report_queue rq, wp_output wo, case_events ce WHERE " +
                    "ce.std_event_id = " + stdEventId + " AND ce.case_number = '" + caseNumber + "' AND " +
                    "wo.event_seq = ce.event_seq AND wo.final_ind = 'Y' AND rq.document_id = wo.xmlsource";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printStatus = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printStatus;
    }

    /**
     * Returns the PRINT_STATUS column of the REPORT_QUEUE row linked to a finalised output
     * on a AE Event.
     *
     * @param stdEventId The Event id (e.g. 1)
     * @param aeNumber The AE Number the event is on
     * @return The output print status (2 if successful, 0 if not printed)
     */
    public static int getReportQueuePrintStatusForAEEvent (final String stdEventId, final String aeNumber)
    {
        int printStatus = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the print status
            final String query = "SELECT rq.print_status FROM report_queue rq, wp_output wo, ae_events ae WHERE " +
                    "ae.std_event_id = " + stdEventId + " AND ae.ae_number = '" + aeNumber + "' AND " +
                    "wo.ae_event_seq = ae.ae_event_seq AND wo.final_ind = 'Y' AND rq.document_id = wo.xmlsource";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printStatus = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printStatus;
    }

    /**
     * Returns the PRINT_STATUS column of the REPORT_QUEUE row linked to an Oracle Report output
     * on a AE Event.
     *
     * @param stdEventId The Event id (e.g. 1)
     * @param aeNumber The AE Number the event is on
     * @param orderId the order id
     * @return The output print status (2 if successful, 0 if not printed)
     */
    public static int getReportQueueORPrintStatusForAEEvent (final String stdEventId, final String aeNumber,
                                                             final String orderId)
    {
        int printStatus = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the print status
            final String query = "SELECT rq.print_status FROM report_queue rq, report_output ro, ae_events ae WHERE " +
                    "ae.std_event_id = " + stdEventId + " AND ae.ae_number = '" + aeNumber + "' AND " +
                    "ro.ae_event_seq = ae.ae_event_seq AND ro.order_id = '" + orderId + "' AND rq.id = ro.report_id";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printStatus = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printStatus;
    }

    /**
     * Returns the PRINT_STATUS column of the REPORT_QUEUE row linked to a finalised output
     * on a Warrant Return.
     *
     * @param returnCode The Return Code
     * @param warrantNumber The Warrant Number
     * @param localNumber The Local Warrant Number
     * @param issuedBy The issuing court
     * @param executedBy The executing court
     * @param ownedBy The owning court
     * @return The output print status (2 if successful, 0 if not printed)
     */
    public static int getReportQueuePrintStatusForWarrantReturn (final String returnCode, final String warrantNumber,
                                                                 final String localNumber, final String issuedBy,
                                                                 final String executedBy, final String ownedBy)
    {
        int printStatus = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            String localNumberQuery = "";
            if (localNumber == null || localNumber.equals (""))
            {
                localNumberQuery = "AND local_warrant_number IS NULL ";
            }
            else
            {
                localNumberQuery = "AND local_warrant_number = '" + localNumber + "' ";
            }

            // Generate the query string and return the print status
            final String query =
                    "SELECT rq.print_status FROM report_queue rq, wp_output wo, warrants w, warrant_returns wr WHERE " +
                            "w.warrant_number = '" + warrantNumber + "' AND w.issued_by = " + issuedBy +
                            " AND w.executed_by = " + executedBy + " AND w.currently_owned_by = " + ownedBy + " " +
                            localNumberQuery + "AND wr.warrant_id = w.warrant_id" + " AND wr.return_code = '" +
                            returnCode + "'" +
                            " AND wo.warrant_returns_id = wr.warrant_returns_id AND wo.final_ind = 'Y' AND rq.document_id = wo.xmlsource";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printStatus = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printStatus;
    }

    /**
     * Returns the PRINTED column from the WP_OUTPUT table for a given case event.
     *
     * @param stdEventId The Event id (e.g. 1)
     * @param caseNumber The Case Number the event is on
     * @return The printed flag value which will be either Y or N
     */
    public static String getWPOutputPrintedFlagForCaseEvent (final String stdEventId, final String caseNumber)
    {
        String printedFlag = null;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT wo.printed FROM wp_output wo, case_events ce WHERE " + "ce.std_event_id = '" +
                    stdEventId + "' AND ce.case_number = '" + caseNumber + "' " + "AND wo.event_seq = ce.event_seq";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printedFlag = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printedFlag;
    }

    /**
     * Returns the PRINTED column from the WP_OUTPUT table for a given AE event.
     *
     * @param stdEventId The Event id (e.g. 1)
     * @param aeNumber The AE Number the event is on
     * @return The printed flag value which will be either Y or N
     */
    public static String getWPOutputPrintedFlagForAEEvent (final String stdEventId, final String aeNumber)
    {
        String printedFlag = null;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT wo.printed FROM wp_output wo, ae_events ae WHERE " + "ae.std_event_id = " +
                    stdEventId + " AND ae.ae_number = '" + aeNumber + "' " + "AND wo.ae_event_seq = ae.ae_event_seq";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printedFlag = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printedFlag;
    }

    /**
     * Returns the PRINTED column from the WP_OUTPUT table for a given Warrant Return.
     *
     * @param returnCode the return code
     * @param warrantNumber the warrant number
     * @param localNumber the local number
     * @param issuedBy the issued by
     * @param executedBy the executed by
     * @param ownedBy the owned by
     * @return The printed flag value which will be either Y or N
     */
    public static String getWPOutputPrintedFlagForWarrantReturn (final String returnCode, final String warrantNumber,
                                                                 final String localNumber, final String issuedBy,
                                                                 final String executedBy, final String ownedBy)
    {
        String printedFlag = null;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            String localNumberQuery = "";
            if (localNumber == null || localNumber.equals (""))
            {
                localNumberQuery = "AND local_warrant_number IS NULL ";
            }
            else
            {
                localNumberQuery = "AND local_warrant_number = '" + localNumber + "' ";
            }

            // Generate the query string and return the print status
            final String query = "SELECT wo.printed FROM wp_output wo, warrants w, warrant_returns wr WHERE " +
                    "w.warrant_number = '" + warrantNumber + "' AND w.issued_by = " + issuedBy +
                    " AND w.executed_by = " + executedBy + " AND w.currently_owned_by = " + ownedBy + " " +
                    localNumberQuery + "AND wr.warrant_id = w.warrant_id" + " AND wr.return_code = '" + returnCode +
                    "' AND wo.warrant_returns_id = wr.warrant_returns_id";

            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                printedFlag = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return printedFlag;
    }

    /**
     * Returns a count of the number of BMS Tasks with the criteria specified.
     *
     * @param taskNumber The BMS Task Number e.g. EN67
     * @param courtCode The court code the BMS Task will be associated with
     * @return A count of the number of BMS Tasks with the criteria specified
     */
    public static int getBMSTaskCount (final String taskNumber, final String courtCode)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM task_counts WHERE " + "task_number = '" + taskNumber + "' AND " +
                    "admin_court_code = " + courtCode;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the fees_paid amount associated with a specific record.
     *
     * @param processType The process type - will be W for warrants and A for AEs
     * @param processNumber The process number - either a warrant number or AE number
     * @param issuingCourt The issuing court of the warrant or AE
     * @return the fees_paid amount associated with a specific warrant/AE
     */
    public static String getFeesPaidAmount (final String processType, final String processNumber,
                                            final String issuingCourt)
    {
        String amount = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the enforcement parent
            final String query = "SELECT amount FROM fees_paid WHERE " + "process_type = '" + processType + "' AND " +
                    "process_number = '" + processNumber + "' AND " + "issuing_court = " + issuingCourt + "";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                amount = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return amount;
    }

    /**
     * Returns the Issuing Court of the Warrant generated via and AE Event.
     *
     * @param aeNumber AE Number of the AE event
     * @param eventId Standard Event Id associated with the AE Event
     * @return The Issuing Court of the Warrant
     */
    public static String getAEWarrantIssuingCourt (final String aeNumber, final String eventId)
    {
        String issuingCourt = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the issuing court of the warrant generated
            final String query = "SELECT w.issued_by FROM warrants w, ae_events ae WHERE " + "ae.ae_number = '" +
                    aeNumber + "' AND " + "ae.std_event_id = " + eventId + " AND " + "ae.warrant_id = w.warrant_id";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                issuingCourt = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return issuingCourt;
    }

    /**
     * Returns the number of Oracle Report outputs currently associated with
     * AE Events on a specified Attachment of Earnings record. Used typically
     * when performing the AE Start of Day and checking that outputs are
     * generated against an AE.
     *
     * @param aeNumber The AE Number to query on
     * @return A count of number of Oracle Report outputs
     */
    public static int getNumberOutputsGeneratedForAE (final String aeNumber)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM report_output WHERE " +
                    "ae_event_seq IN (SELECT ae_event_seq FROM ae_events WHERE " + "ae_number = '" + aeNumber +
                    "' AND " + "process_stage = 'REP')";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the BMS Age Category for a Case Event.
     *
     * @param caseNumber Case Number for the event
     * @param eventId Standard Event Id associated with the Case Event
     * @return The CASE_EVENTS.AGE_CATEGORY value
     */
    public static String getCaseEventBMSAgeCategory (final String caseNumber, final String eventId)
    {
        String ageCategory = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the age category
            final String query = "SELECT age_category FROM case_events WHERE " + "case_number = '" + caseNumber +
                    "' AND " + "std_event_id = " + eventId;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                ageCategory = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return ageCategory;
    }
    
    /**
     * Returns the BMS Age Category for a Case Event
     *
     * @param caseNumber  Case Number for the event
     * @param eventId     Standard Event Id associated with the Case Event
     * @return            The CASE_EVENTS.AGE_CATEGORY value
     */
    public static String getCaseEventBMS(final String caseNumber, final String eventId)
    {
        String ageCategory = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the age category
            final String query = "SELECT NVL(ce.bms_task_number,'') FROM case_events ce WHERE "
                + "ce.case_number = '" + caseNumber + "' AND "
                + "ce.std_event_id = " + eventId + " AND "
                + "ce.event_seq = (SELECT MAX(ce2.event_seq) FROM case_events ce2 WHERE "
                + "ce2.case_number = ce.case_number AND ce2.std_event_id = " + eventId + ")";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                ageCategory = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return ageCategory;
    }
    
    /**
     * Returns the number of Case Events with a specific event id on a specific
     * Case Number.
     *
     * @param caseNumber The Case Number to query on
     * @param eventId The Event Id to query on
     * @return A count of number of Events found
     */
    public static int getCountCaseEventsForCase (final String caseNumber, final String eventId)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query = "SELECT count(*) FROM case_events WHERE " + "std_event_id = " + eventId + " AND " +
                    "case_number = '" + caseNumber + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the Issuing Court of the Attachment of Earnings record linked
     * to the Case passed in. This assumes there is only one AE on the Case.
     *
     * @param caseNumber Case Number linked to the AE
     * @return The Issuing Court of the AE
     */
    public static String getAEIssuingCourt (final String caseNumber)
    {
        String issuingCourt = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the issuing court of the AE
            final String query = "SELECT ae.issuing_crt_code FROM ae_applications ae WHERE " + "ae.case_number = '" +
                    caseNumber + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                issuingCourt = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return issuingCourt;
    }

    /**
     * Returns the Issuing Court of the Fee on the Attachment of Earnings record linked
     * to the Case passed in. This assumes there is only one AE on the Case.
     *
     * @param caseNumber Case Number linked to the AE
     * @return The Issuing Court of the fee on the AE
     */
    public static String getAEFeeIssuingCourt (final String caseNumber)
    {
        String issuingCourt = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the issuing court of the AE
            final String query = "SELECT fp.issuing_court FROM fees_paid fp, ae_applications ae WHERE " +
                    "ae.case_number = '" + caseNumber + "' AND " + "fp.process_number = ae.ae_number";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                issuingCourt = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return issuingCourt;
    }

    /**
     * Returns the CRED_CODE of a CASES record.
     *
     * @param caseNo Case Number
     * @return The creditor code of the case
     */
    public static String getCaseCredCode (final String caseNo)
    {
        String credCode = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the enforcement parent
            final String query = "SELECT nvl(cred_code,0) FROM cases WHERE " + "case_number = '" + caseNo + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                credCode = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return credCode;
    }

    /**
     * Returns the Local Warrant Number of a foreign warrant.
     *
     * @param caseNo Case Number
     * @param warrantNumber Warrant Number
     * @param owningCourt Owning Court
     * @return The Local Warrant Number
     */
    public static String getWarrantLocalNumber (final String caseNo, final String warrantNumber,
                                                final String owningCourt)
    {
        String credCode = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the local warrant number
            final String query = "SELECT local_warrant_number FROM warrants WHERE " + "case_number = '" + caseNo +
                    "' " + "AND warrant_number = '" + warrantNumber + "' " + "AND currently_owned_by = " + owningCourt;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                credCode = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return credCode;
    }

    /**
     * Returns a specified column value from the MCOL_DATA table.
     *
     * @param caseNo Case Number
     * @param type MCOL_DATA type
     * @param columnName Column name to return
     * @return The column value
     */
    public static String getMCOLDATAColumnValue (final String caseNo, final String type, final String columnName)
    {
        String credCode = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the local warrant number
            final String query = "SELECT " + columnName + " FROM mcol_data md WHERE " + "md.claim_number = '" + caseNo +
                    "' " + "AND md.type = '" + type + "' " + "AND md.time_stamp = (SELECT MAX(md2.time_stamp) " +
                    "FROM mcol_data md2 " + "WHERE md2.claim_number = md.claim_number " + "AND md2.type = md.type)";

            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                credCode = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return credCode;
    }

    /**
     * Returns the BMS task associated with the automatic case event associated with
     * a specified AE Event.
     *
     * @param aeNumber AE Number
     * @param eventId Event Id
     * @return The BMS Task
     */
    public static String getBMSForAEEvent (final String aeNumber, final String eventId)
    {
        String bms = "";
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the local warrant number
            final String query = "SELECT NVL(ce.bms_task_number, 'NONE') FROM case_events ce WHERE " +
                    "ce.event_seq = (SELECT ae.case_event_seq " + "FROM ae_events ae " + "WHERE ae.std_event_id = " +
                    eventId + " " + "AND ae.ae_number = '" + aeNumber + "' " +
                    "AND ae.ae_event_seq = (SELECT MAX(ae2.ae_event_seq) FROM ae_events ae2 WHERE ae2.ae_number = ae.ae_number))";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                bms = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return bms;
    }

    /**
     * Runs a decode query that will return either true or false.
     *
     * @param query The query to be run (must be a decode true or false)
     * @return boolean result true or false
     */
    public static boolean runDecodeTrueFalseQuery (final String query)
    {
        boolean blnResult = false;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            if (query != null && !query.equals (""))
            {
                con = DBConnection.createConnection ();
                ps = con.prepareStatement (query);
                result = ps.executeQuery ();
                if (result.next ())
                {
                    if (result.getString (1).equals ("true"))
                    {
                        blnResult = true;
                    }
                }
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return blnResult;
    }

    /**
     * Returns the number of Local Coded Parties on a specific Case record.
     *
     * @param caseNumber The Case Number to query on
     * @return A count of number of Local Coded Parties found
     */
    public static int getCountLocalCodedPartiesOnCase (final String caseNumber)
    {
        int count = 0;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query =
                    "SELECT count(*) FROM case_party_roles cpr, coded_parties cp " + "WHERE case_number = '" +
                            caseNumber + "' " + "AND cp.party_id = cpr.party_id " + "AND cp.code NOT IN (0,335)";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                count = result.getInt (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return count;
    }

    /**
     * Returns the AE Number on a specific Case record.
     *
     * @param caseNumber The Case Number to query on
     * @return The AE Number
     */
    public static String getAENumberOnCase (final String caseNumber)
    {
        String aeNumber = null;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string and return the count
            final String query =
                    "SELECT ae_number FROM ae_applications ae " + "WHERE case_number = '" + caseNumber + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                aeNumber = result.getString (1);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return aeNumber;
    }

    /**
     * Returns true or false depending upon whether or not a Foreign Warrant has been created
     * for the Warrant with the Case Number, Warrant Number, Issued By and Executed By specified.
     *
     * @param caseNumber The Case Number to search for
     * @param warrantNumber The Warrant Number to search for
     * @param issuingCourt The Issuing Court Code to search for
     * @param executingCourt The Executing Court Code to search for
     * @return True if a foreign warrant has been created for this Warrant, else false
     */
    public static boolean checkAutomaticForeignWarrantExists (final String caseNumber, final String warrantNumber,
                                                              final String issuingCourt, final String executingCourt)
    {
        boolean fw_exists = false;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string
            final String query = "SELECT count(*) FROM warrants WHERE " + "local_warrant_number IS NOT NULL AND " +
                    "warrant_number = '" + warrantNumber + "' AND " + "case_number = '" + caseNumber + "' AND " +
                    "issued_by = " + issuingCourt + " AND " + "currently_owned_by = " + executingCourt + " AND " +
                    "executed_by = " + executingCourt + "";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                if (result.getInt (1) > 0)
                {
                    fw_exists = true;
                }
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return fw_exists;
    }

    /**
     * Returns true or false depending upon whether or not a Final Warrant Return 147 (Warrants
     * Forwarded) has been added automatically to the Warrant with the Case Number, Warrant Number,
     * Issued By, Currently Owned By and Executed By specified.
     *
     * @param caseNumber The Case Number to search for
     * @param warrantNumber The Warrant Number to search for
     * @param issuingCourt The Issuing Court Code to search for
     * @param executingCourt The Executing Court Code to search for
     * @param owningCourt The Owning Court Code to search for
     * @return True if a final return 147 has been created for this Warrant, else false
     */
    public static boolean checkWarrantForwardedReturnCreated (final String caseNumber, final String warrantNumber,
                                                              final String issuingCourt, final String executingCourt,
                                                              final String owningCourt)
    {
        boolean wr147_exists = false;
        final Connection con;
        PreparedStatement ps = null;
        ResultSet result = null;

        try
        {
            // Generate the query string
            final String query = "SELECT count(*) FROM warrant_returns WHERE " + "return_code = '147' AND " +
                    "TRUNC(warrant_return_date) = TRUNC(SYSDATE) AND " + "warrant_id IN " +
                    "(SELECT warrant_id FROM warrants WHERE " + "warrant_number = '" + warrantNumber + "' AND " +
                    "case_number = '" + caseNumber + "' AND " + "issued_by = " + issuingCourt + " AND " +
                    "currently_owned_by = " + owningCourt + " AND " + "executed_by = " + executingCourt + ")";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            result = ps.executeQuery ();
            if (result.next ())
            {
                if (result.getInt (1) > 0)
                {
                    wr147_exists = true;
                }
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
            quietClose (result);
        }
        return wr147_exists;
    }

    /**
     * Inserts a new row in the NON_WORKING_DAYS table.
     *
     * @param pDate The date to add in String format DD-Mon-YYYY
     */
    public static void insertNonWorkingDay (final String pDate)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the insert statement
            final String query =
                    "INSERT INTO non_working_days (non_wd_seq, non_working_date, username, creation_date, error_indicator) " +
                            "VALUES ( non_working_days_sequence.nextval, TO_DATE('" + pDate + "','DD-Mon-YYYY'), " +
                            "'DEFAULT_USER', TO_DATE('" + pDate + "','DD-Mon-YYYY'), 'N')";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final boolean result = ps.execute (query);
            System.out.println ("New NON_WORKING_DAY added: " + pDate + " " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Deletes an existing row from the NON_WORKING_DAYS table.
     *
     * @param pDate The date to remove in String format DD-Mon-YYYY
     */
    public static void deleteNonWorkingDay (final String pDate)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the delete statement
            final String query =
                    "DELETE FROM non_working_days " + "WHERE non_working_date = TO_DATE('" + pDate + "','DD-Mon-YYYY')";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final boolean result = ps.execute (query);
            System.out.println ("NON_WORKING_DAY removed: " + pDate + " " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Deletes an existing row from the PER_DETAILS table.
     *
     * @param detailCode The detail code to remove
     */
    public static void deletePerDetail (final String detailCode)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the delete statement
            final String query = "DELETE FROM per_Details " + "WHERE detail_code = '" + detailCode + "'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final boolean result = ps.execute (query);
            System.out.println ("PER_DETAIL removed: " + detailCode + " " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Deletes an existing row from the SYSTEM_DATA table.
     *
     * @param item The item to remove - contains two rows for _M and _W
     */
    public static void deleteSystemData (final String item)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the delete statement
            final String query = "DELETE FROM system_data " + "WHERE item LIKE '" + item + "_%'";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final boolean result = ps.execute (query);
            System.out.println ("SYSTEM_DATA removed: " + item + " " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Inserts a new row in the REPORT_DATA table for a screen lock.
     *
     * @param pUserId User Id
     * @param pReportType Report Type
     * @param pReportNo Report Number
     * @param pCourtCode Court Code
     */
    public static void insertScreenLock (final String pUserId, final String pReportType, final String pReportNo,
                                         final String pCourtCode)
    {
        // Local variables
        final Connection con;
        PreparedStatement ps = null;

        try
        {
            // Execute the insert statement
            final String query =
                    "INSERT INTO report_data (user_id, report_type, report_number, report_date, admin_court_code) " +
                            "VALUES ( '" + pUserId + "', '" + pReportType + "', " + pReportNo + ", TRUNC(SYSDATE), " +
                            pCourtCode + ")";
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            final boolean result = ps.execute (query);
            System.out.println ("Screen lock added " + result);
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            quietClose (ps);
        }
    }

    /**
     * Deletes an existing row from the COURTS and PERSONALISE tables for
     * a Court record. This assumes that the Court has no given_addresses
     * records.
     *
     * @param pCourtCode The court code of the Court to Delete
     * @throws SQLException the SQL exception
     */
    public static void deleteCourtData (final String pCourtCode) throws SQLException
    {
        // Local variables
        Connection con;
        PreparedStatement ps = null;
        Statement s = null;

        try
        {
            con = DBConnection.createConnection ();
            s = con.createStatement ();
            // Disable the triggers
            s.executeUpdate ("ALTER TRIGGER AUD_COURTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PERSONALISE DISABLE");

            // Execute the delete statement
            String query = "DELETE FROM personalise WHERE crt_code =  " + pCourtCode;
            con = DBConnection.createConnection ();
            ps = con.prepareStatement (query);
            boolean result = ps.execute (query);
            System.out.println ("PERSONALISE record removed: " + pCourtCode + " " + result);

            query = "DELETE FROM courts WHERE code =  " + pCourtCode;
            ps = con.prepareStatement (query);
            result = ps.execute (query);
            System.out.println ("COURTS record removed: " + pCourtCode + " " + result);

            // Enable the triggers
            s.executeUpdate ("ALTER TRIGGER AUD_COURTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PERSONALISE ENABLE");
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            if (s != null)
            {
                s.close ();
            }
            quietClose (ps);
        }
    }

    /**
     * Runs the Cascaded Coded Party Update Script.
     *
     * @throws Exception Exception
     */
    public static void runCascadedCodedPartyUpdateScript () throws Exception
    {
        // Local variables
        final Connection con;
        final String storedProcCmd = "call sups_coded_party_cascade_pack.p_coded_party_cascade_update()";
        ResultSet rs = null;

        try
        {
            con = DBConnection.createConnection ();
            final CallableStatement cs = con.prepareCall (storedProcCmd);
            rs = cs.executeQuery ();
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            if (rs != null)
            {
                rs.close ();
            }
        }
    }

    /**
     * Sets the next warrant number sequence next val.
     *
     * @param nextVal the new next warrant number sequence next val
     * @throws Exception the exception
     */
    public static void setNextWarrantNumberSequenceNextVal (final int nextVal) throws Exception
    {
        final Connection con;
        Statement s = null;

        try
        {
            if (nextVal > 0)
            {
                con = DBConnection.createConnection ();
                s = con.createStatement ();
                s.executeUpdate ("DROP SEQUENCE WARRANT_NUMBER_SEQUENCE");

                final String createSequence = "CREATE SEQUENCE WARRANT_NUMBER_SEQUENCE " + "MINVALUE 1 " +
                        "MAXVALUE 999999999999999999999999999 " + "START WITH " + Integer.toString (nextVal) + " " +
                        "INCREMENT BY 1 " + "NOCACHE";
                s.executeUpdate (createSequence);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            if (s != null)
            {
                s.close ();
            }
        }
    }

    /**
     * Sets the next AE number sequence next val.
     *
     * @param nextVal the new next AE number sequence next val
     * @throws Exception the exception
     */
    public static void setNextAENumberSequenceNextVal (final int nextVal) throws Exception
    {
        final Connection con;
        Statement s = null;

        try
        {
            if (nextVal > 0)
            {
                con = DBConnection.createConnection ();
                s = con.createStatement ();
                s.executeUpdate ("DROP SEQUENCE AE_NUMBER_SEQUENCE");

                final String createSequence = "CREATE SEQUENCE AE_NUMBER_SEQUENCE " + "MINVALUE 1 " +
                        "MAXVALUE 999999999999999999999999999 " + "START WITH " + Integer.toString (nextVal) + " " +
                        "INCREMENT BY 1 " + "NOCACHE";
                s.executeUpdate (createSequence);
            }
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
        }
        finally
        {
            if (s != null)
            {
                s.close ();
            }
        }
    }

    /**
     * Quietly closes a database connection.
     *
     * @param c Database connection
     */
    public static void quietClose (final Connection c)
    {
        try
        {
            if (c != null && !c.isClosed ())
            {
                c.close ();
            }
        }
        catch (final Exception e)
        {
            // Do nothing.
        }
    }

    /**
     * Quietly closes a database statement.
     *
     * @param s database statement
     */
    public static void quietClose (final Statement s)
    {
        try
        {
            if (s != null)
            {
                s.close ();
            }
        }
        catch (final Exception e)
        {
            // Do nothing.
        }
    }

    /**
     * Quietly closes a database result set.
     *
     * @param r database result set
     */
    public static void quietClose (final ResultSet r)
    {
        try
        {
            if (r != null)
            {
                r.close ();
            }
        }
        catch (final Exception e)
        {
            // Do nothing.
        }
    }
}
