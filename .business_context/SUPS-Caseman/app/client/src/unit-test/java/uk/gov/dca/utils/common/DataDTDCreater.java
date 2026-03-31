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
import java.io.FileOutputStream;
import java.sql.Connection;

import org.apache.log4j.Logger;
import org.dbunit.database.DatabaseConnection;
import org.dbunit.database.IDatabaseConnection;
import org.dbunit.dataset.xml.FlatDtdDataSet;

import uk.gov.dca.utils.velo.db.DBConnection;

/**
 * Created by David Turner. User: Administrator Date: 16-Feb-2009 Time: 12:03:45
 * Used to create a DTD for a specified database.
 */
public class DataDTDCreater
{
    
    /** The Constant LOG. */
    private static final Logger LOG = Logger.getLogger (AbstractCmTestBase.class); // Private loggger

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
        final File theFile = new File ("client/test/java/uk/gov/dca/utils/common/VINCENTC_CMAN.dtd");
        final boolean result = theFile.createNewFile ();
        LOG.info ("New file created: " + result);
        // write DTD file
        FlatDtdDataSet.write (connection.createDataSet (), new FileOutputStream (theFile));
    }
}
