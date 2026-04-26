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

import java.io.FileOutputStream;
import java.sql.Connection;

import org.dbunit.database.DatabaseConfig;
import org.dbunit.database.DatabaseConnection;
import org.dbunit.database.IDatabaseConnection;
import org.dbunit.database.QueryDataSet;
import org.dbunit.dataset.xml.FlatXmlDataSet;
import org.dbunit.ext.oracle.OracleDataTypeFactory;

import uk.gov.dca.utils.velo.db.DBConnection;

/**
 * Created by David Turner. User: Administrator Date: 13-Feb-2009 Time: 09:53:56
 * Used to export tables in a specified database to a single flatfile
 */
public class DatabaseExport
{
    
    /**
     * The main method.
     *
     * @param args the arguments
     * @throws Exception the exception
     */
    public static void main (final String[] args) throws Exception
    {
        // database connection
        final Connection jdbcConnection = DBConnection.createConnection ();
        final IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "RIDOUTP_CM");
       
        connection.getConfig ().setProperty (DatabaseConfig.PROPERTY_FETCH_SIZE, 500);
        connection.getConfig ().setProperty (DatabaseConfig.PROPERTY_DATATYPE_FACTORY, new OracleDataTypeFactory());
        
        System.out.println ("Unload Starts.....");
        // IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "MGROEN_CMAN");

        // Amended by M.Scullion  - partial database export Reference Tables Only
        final QueryDataSet partialDataSet = new QueryDataSet (connection);
        
        partialDataSet.addTable ("ACTION_TASK_XREF");
        partialDataSet.addTable ("ADDRESS_TYPES");
        
        //partialDataSet.addTable ("AE_APPLICATIONS");
        //partialDataSet.addTable ("AE_EVENTS");
        ////partialDataSet.addTable ("AE_PER_ITEMS");
        partialDataSet.addTable ("AGE_CATEGORY");
        //partialDataSet.addTable ("ALLOWED_DEBTS");
        // partialDataSet.addTable ("AMR_REPORTS");
        // partialDataSet.addTable ("AO_CAEO");
        // partialDataSet.addTable ("AO_CAEO_DIVIDEND");
        // partialDataSet.addTable ("ASYNC_COMMAND");
        partialDataSet.addTable ("AUDIT_CONFIG");
        // partialDataSet.addTable ("CANDIDATE_DIVIDEND_PAYMENTS");
        // partialDataSet.addTable ("CAPS_PAYMENTS");
        // partialDataSet.addTable ("CASES");
        // partialDataSet.addTable ("CASE_EVENTS");
        // partialDataSet.addTable ("CASE_EVENT_INSTIGATORS");
        // partialDataSet.addTable ("CASE_PARTY_ROLES");
        // partialDataSet.addTable ("CCBC_MEDIA_FILE_TYPE");
        partialDataSet.addTable ("CCBC_REF_CODES");
        partialDataSet.addTable ("CDR_MCOL_EVENT_MAPPING");
        partialDataSet.addTable ("CDR_MCOL_STATUS_MAPPING");
        
        
        // partialDataSet.addTable ("CCBC_REPORTS");
        // partialDataSet.addTable ("CCB_MESSAGES");
        partialDataSet.addTable ("CHANGED_EVENTS");
        // partialDataSet.addTable ("CMCS_AE_EVENTS");
        // partialDataSet.addTable ("CMCS_CAPS_ORDERS");
        // partialDataSet.addTable ("CMCS_CAPS_PAYMENTS");
        // partialDataSet.addTable ("CMCS_CASES");
        // partialDataSet.addTable ("CMCS_DEFENDANTS");
        // partialDataSet.addTable ("CMCS_DEFENDANT_ADDRESSES");
        // partialDataSet.addTable ("CMCS_TRANSFER_CONTROL");
        // partialDataSet.addTable ("CMCS_TRANSFER_ERROR_LOG");
        // partialDataSet.addTable ("CMCS_TRANSFER_STATUS");
        partialDataSet.addTable ("CODED_PARTIES");
        // partialDataSet.addTable ("CONSOLIDATED_ORDERS");
        // partialDataSet.addTable ("CONTENT_STORE");
        // partialDataSet.addTable ("COPS_MERGE_FIELDS");
        partialDataSet.addTable ("COSTS");
        partialDataSet.addTable ("COURTS");
        // partialDataSet.addTable ("CO_CASE_EVENTS");
        // partialDataSet.addTable ("CO_EVENTS");
        partialDataSet.addTable ("CO_EVENT_VALIDATIONS");
        // partialDataSet.addTable ("CO_PER_ITEMS");
        // partialDataSet.addTable ("CO_REPRINTS");
        partialDataSet.addTable ("CO_TEXT_ITEMS");
        // partialDataSet.addTable ("CPR_TO_CPR_RELATIONSHIP");
        partialDataSet.addTable ("CURRENCY");
        // partialDataSet.addTable ("DCA_USER");
        // partialDataSet.addTable ("DCS");
        // partialDataSet.addTable ("DCS_DATA");
        //partialDataSet.addTable ("DEBT_DIVIDENDS");
        partialDataSet.addTable ("DFJ_AREAS");        
        // partialDataSet.addTable ("DIVIDENDS");
        // partialDataSet.addTable ("DJPRINT_TEMP");
        // partialDataSet.addTable ("DOCUMENT_STORE");
        partialDataSet.addTable ("DOCUMENT_VARIABLES");
        //partialDataSet.addTable ("ECHR_ARTICLE_PROTOCOL");
        //partialDataSet.addTable ("ECHR_DETAILS");
        partialDataSet.addTable ("ENFORCEMENT_LETTERS");
        // partialDataSet.addTable ("ETHNIC_ORIGIN");
        partialDataSet.addTable ("EVENT_OUTPUTS");
        // partialDataSet.addTable ("EVENT_TASK_XREF");
        //partialDataSet.addTable ("FEES_PAID");
        // partialDataSet.addTable ("FILE_SEQUENCES");
        // partialDataSet.addTable ("FTP_QUEUE");
        partialDataSet.addTable ("GIVEN_ADDRESSES");
        //partialDataSet.addTable ("HEARINGS");
        //partialDataSet.addTable ("INFAVOUR_PARTIES");
        partialDataSet.addTable ("ITEM_DETAILS");
        partialDataSet.addTable ("JUDGES");
        //partialDataSet.addTable ("JUDGMENTS");
        partialDataSet.addTable ("LOCAL_AUTHORITY_CODES");
        // partialDataSet.addTable ("LOCKING_TABLE");
        // partialDataSet.addTable ("MCOL_DATA");
        // partialDataSet.addTable ("MCOL_UPDATE_LOG");
        // partialDataSet.addTable ("MENU_ITEM");
        // partialDataSet.addTable ("MENU_ITEM_GROUP");
        // partialDataSet.addTable ("MLOG$_COURTS");
        partialDataSet.addTable ("NATIONAL_CODED_PARTIES");
        // partialDataSet.addTable ("NEW_CASE_DATA");
        partialDataSet.addTable ("NON_WORKING_DAYS");
        partialDataSet.addTable ("NON_WORKING_DAYS_EXCEPTIONS");
        // partialDataSet.addTable ("OBLIGATIONS");
        partialDataSet.addTable ("OBLIGATION_EVENTS");
        partialDataSet.addTable ("OBLIGATION_RULES");
        partialDataSet.addTable ("OBLIGATION_TYPES");
        // partialDataSet.addTable ("OLD_AE");
        // partialDataSet.addTable ("ORDERS");
        partialDataSet.addTable ("ORDER_TYPES");
        // partialDataSet.addTable ("OSW");
        partialDataSet.addTable ("OUTPUT_DETAILS");
        //partialDataSet.addTable ("PARTIES");
        partialDataSet.addTable ("PARTY_ROLES");
        // partialDataSet.addTable ("PARTY_TO_PARTY_RELATIONSHIP");
        // partialDataSet.addTable ("PARTY_TYPES");
        // partialDataSet.addTable ("PAYABLE_ORDERS");
        // partialDataSet.addTable ("PAYABLE_ORDER_HEADER");
        // partialDataSet.addTable ("PAYABLE_ORDER_ITEMS");
        partialDataSet.addTable ("PAYEES");
        // partialDataSet.addTable ("PAYMENTS");
        // partialDataSet.addTable ("PAYMENT_SUMMARY");
        partialDataSet.addTable ("PERSONALISE");
        partialDataSet.addTable ("PER_DETAILS");
        // partialDataSet.addTable ("PL_FILELEVEL_PREVAL_STATUS");
        // partialDataSet.addTable ("PL_JOB_QUEUE");
        // partialDataSet.addTable ("PL_RECORDLEVEL_PREVAL_STATUS");
        // partialDataSet.addTable ("PL_XML_STATUS");
        partialDataSet.addTable ("PRE_REQ_EVENTS");
        // partialDataSet.addTable ("PRINTERS");
        // partialDataSet.addTable ("PRINTER_TYPES");
        // partialDataSet.addTable ("PRINT_JOB");
        // partialDataSet.addTable ("PRINT_JOB");
        // partialDataSet.addTable ("PRINT_JUDGMENTS");
        // partialDataSet.addTable ("PRINT_RECORD_CARDS");
        // partialDataSet.addTable ("REJECT_CASES");
        // partialDataSet.addTable ("REJECT_JUDGMENTS");
        // partialDataSet.addTable ("REJECT_PAID_WO_DETAILS");
        // partialDataSet.addTable ("REJECT_REASONS");
        // partialDataSet.addTable ("REJECT_WARRANTS");
        // partialDataSet.addTable ("REPORTS");
        // partialDataSet.addTable ("REPORT_DATA");
        // partialDataSet.addTable ("REPORT_MAP");
        // partialDataSet.addTable ("REPORT_OUTPUT");
        // partialDataSet.addTable ("REPORT_PARAMETERS");
        // partialDataSet.addTable ("REPORT_QUEUE");
        // partialDataSet.addTable ("REPORT_REPRINTS");
        // partialDataSet.addTable ("REPORT_REPRINTS_XREF");
        // partialDataSet.addTable ("REPORT_SEQUENCES");
        // partialDataSet.addTable ("REPRINTS");
        // partialDataSet.addTable ("REPRINT_TEXT_ITEMS");
        partialDataSet.addTable ("RETURN_CODES");
        // partialDataSet.addTable ("RUPD$_COURTS");
        partialDataSet.addTable ("SECTIONS");
        // partialDataSet.addTable ("SERVER_SECRET");
        // partialDataSet.addTable ("SOD_LOCK");
        partialDataSet.addTable ("STANDARD_EVENTS");
        partialDataSet.addTable ("SUB_DETAIL_VARIABLES");
        // partialDataSet.addTable ("SUPS_AMENDMENTS");
        partialDataSet.addTable ("SYSTEM_DATA");
        // partialDataSet.addTable ("TAPES");
        // partialDataSet.addTable ("TAPE_FILES");
        partialDataSet.addTable ("TASKS");
        // partialDataSet.addTable ("TASK_ALLOCATIONS");
        // partialDataSet.addTable ("TASK_COUNTS");
        partialDataSet.addTable ("TASK_TYPES");
        
        
        // partialDataSet.addTable ("TEMP");
        // partialDataSet.addTable ("TEMP_PRINTERS");
        // partialDataSet.addTable ("TEMP_PRINTER_TYPES");
        // partialDataSet.addTable ("TEMP_USERS_PRINTERS");
        // partialDataSet.addTable ("TEXT_ITEMS");
        // partialDataSet.addTable ("TMP_REP");
        partialDataSet.addTable ("TMP_RTL_CHARACTER_MAP");
        // partialDataSet.addTable ("TRANSACTION_LIST");
        // partialDataSet.addTable ("TRANSFER_AUDIT");
        // partialDataSet.addTable ("TRANSFER_ERROR_LOG");
        // partialDataSet.addTable ("TRAN_ADDRESS");
        // partialDataSet.addTable ("TRAN_CODED_PARTIES");
        // partialDataSet.addTable ("TRAN_COURTS");
        // partialDataSet.addTable ("TRAN_PER_DETAILS");
        // partialDataSet.addTable ("TRAN_SYSTEM_DATA");
        // partialDataSet.addTable ("UNIX_OUTPUT");
        // partialDataSet.addTable ("USERS");
        // partialDataSet.addTable ("USERS_PRINTERS");
        partialDataSet.addTable ("USER_COURT");
        // partialDataSet.addTable ("USER_INFO_CASE_EVENTS");
        partialDataSet.addTable ("USER_ROLE");
        // partialDataSet.addTable ("VALIDATE_ERRORS");
        partialDataSet.addTable ("VALID_VALUES");
        //partialDataSet.addTable ("VARIATIONS");
        //partialDataSet.addTable ("WARRANTS");
        //partialDataSet.addTable ("WARRANT_RETURNS");
        // partialDataSet.addTable ("WFT_DM_TEMP");
        //partialDataSet.addTable ("WFT_EXCLUSIONS");
        // partialDataSet.addTable ("WFT_EXCLUSIONS_TEMP");
        //partialDataSet.addTable ("WINDOW_FOR_TRIAL");
        // partialDataSet.addTable ("WORK_WF");
        // partialDataSet.addTable ("WP_OUTPUT");
        // partialDataSet.addTable ("WP_TRANSFORMATIONS");
        //partialDataSet.addTable ("LOAD_JUDGMENTS");
        //partialDataSet.addTable ("LOAD_WARRANTS");
        FlatXmlDataSet.write (partialDataSet, new FileOutputStream ("C:/caseman_db_scripts/refdata.xml"));
        System.out.println ("Unload Ends");

    }
}