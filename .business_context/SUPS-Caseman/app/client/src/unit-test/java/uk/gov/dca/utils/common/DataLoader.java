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

import java.io.File;
import java.io.FileReader;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;

import org.dbunit.database.DatabaseConnection;
import org.dbunit.database.IDatabaseConnection;
import org.dbunit.dataset.xml.FlatXmlDataSet;
import org.dbunit.operation.DatabaseOperation;

import uk.gov.dca.utils.velo.db.DBConnection;

/**
 * Created by David Turner. User: Administrator Date: 13-Feb-2009 Time: 09:53:56
 * Used to test the test xml flatfiles by running them in isolation and allowing the
 * user to debug if necessary.
 */
public class DataLoader
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
        final IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "VINCENT_CMAN");
        // IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "MGROEN_CMAN");
        // IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "MISTRYN_CM");
        // IDatabaseConnection connection = new DatabaseConnection (jdbcConnection, "RIDOUTP_CM");

        final File cleanFile =
                new File ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/common/Cleansing.xml"); // never
                                                                                                              // alter
                                                                                                              // this
        final File theDTD = new File ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/BASE_CM.dtd"); // or
                                                                                                                       // this!
        final File refData = new File ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/common/RefData.xml"); // or
                                                                                                                         // this!

        // change following file
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/CaseManDelete_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/CaseMan_RTLTestData.xml");
        final File theFile = new File (
                "C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/CaseMan_WFTTestData.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/ccbc_sdt/CaseDiscontinued_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/ClearBusinessData.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/CaseMan_WelshTranslation_Data.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/misc/CaseMan_Defect6560_AE_SOD_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/central_ae/CaseMan_Trac5737_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/bif/CM_BIFItem24_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/releases/cm4_0/CaseManTrac1909_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/scalability/CaseManScalability_DMSReportTest.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/releases/cm6_0/CaseManTrac3055_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/releases/cm19_0/TCE_Test.xml");
        // File theFile = new File
        // ("C:/SUPS/Caseman-CCBC/APP/client/test/java/uk/gov/dca/utils/tests/bulk_printing/WiderAreaTest.xml");

        final FlatXmlDataSet fDS = new FlatXmlDataSet (new FileReader (theFile), new FileReader (theDTD));
        final FlatXmlDataSet clean = new FlatXmlDataSet (new FileReader (cleanFile), new FileReader (theDTD));
        final FlatXmlDataSet ref = new FlatXmlDataSet (new FileReader (refData), new FileReader (theDTD));
        final String storedProcCmd = "call set_sups_app_ctx('azhnn1','NN','0001')";
        ResultSet rs = null;
        try
        {
            final CallableStatement cs = jdbcConnection.prepareCall (storedProcCmd);
            rs = cs.executeQuery ();
            try
            {
                DatabaseOperation.DELETE_ALL.execute (connection, clean);
                jdbcConnection.commit ();
            }
            catch (final Exception e)
            {
                throw new Exception ("Fell over cleaning", e);
            }
            try
            {
                DatabaseOperation.CLEAN_INSERT.execute (connection, fDS);
            }
            catch (final Exception e)
            {
                throw new Exception ("Fell over inserting", e);
            }
            try
            {
                DatabaseOperation.INSERT.execute (connection, ref);
            }
            catch (final Exception e)
            {
                throw new Exception ("Fell over inserting ref data", e);
            }
        }
        finally
        {
            if (rs != null)
            {
                rs.close ();
            }

            // Connection is never null so close without checking
            connection.close ();

            if (jdbcConnection != null)
            {
                jdbcConnection.close ();
            }
        }
    }
}
