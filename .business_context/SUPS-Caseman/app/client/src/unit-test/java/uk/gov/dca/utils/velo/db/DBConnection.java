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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Class handles connection to the Database using properties
 * from the test properties file.
 */
public class DBConnection
{
    
    /** The connection. */
    // Private static member for the connection
    private static Connection connection = null;

    /**
     * Static function which returns the connection to the database.
     *
     * @return Connection to the database
     */
    public static Connection createConnection ()
    {
        final Properties testProperties = new Properties ();
        final File file;

        if (connection == null)
        {
            try
            {
                // Load the database properties from the test properties file
                // file = new File ("./test/config/test.properties");
                file = new File ("../build/local.properties");
                testProperties.load (new FileInputStream (file));
                final String driverName = testProperties.getProperty ("my.cm.db.driver");
                Class.forName (driverName);
                final Properties p = new Properties ();
                p.put ("user", testProperties.getProperty ("my.cm.db.user"));
                p.put ("password", testProperties.getProperty ("my.cm.db.pass"));
                p.put ("schema", testProperties.getProperty ("my.cm.db.user"));

                // Connect
                connection = DriverManager.getConnection (testProperties.getProperty ("my.cm.db.url"), p);
            }
            catch (final ClassNotFoundException e)
            {
                e.printStackTrace ();
            }
            catch (final SQLException e)
            {
                e.printStackTrace ();
            }
            catch (final IOException e)
            {
                e.printStackTrace ();
            }
        }
        return connection;
    }
}
