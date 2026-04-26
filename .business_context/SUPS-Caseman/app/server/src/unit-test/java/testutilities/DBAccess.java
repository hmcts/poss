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
package testutilities;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Facilities to enable database connection and retrieval.
 */

public final class DBAccess
{
    
    /** The Constant DRIVER_NAME. */
    private static final String DRIVER_NAME = "oracle.jdbc.OracleDriver";
    
    /** The Constant URL. */
    private static final String URL = "jdbc:oracle:thin:@168.185.39.19:1521:casemdev";
    
    /** The Constant USER_NAME. */
    private static final String USER_NAME = "dev03";
    
    /** The Constant PASSWORD. */
    private static final String PASSWORD = "dev03";
    
    /** The dbconn. */
    private static Connection DBCONN;

    /**
     * This method will retrieve a database connection
     * and a default case with a supplied date modification.
     */
    private static void getConnection ()
    {
        if (DBCONN == null)
        {
            ;
        }
        {
            try
            {
                Class.forName (DRIVER_NAME).newInstance ();
            }
            catch (final Exception ex)
            {
                System.err.println ("Check classpath. Cannot load db driver: " + DRIVER_NAME);
            }
            try
            {
                DBCONN = DriverManager.getConnection (URL, USER_NAME, PASSWORD);
            }
            catch (final SQLException e)
            {
                System.err.println ("Driver loaded, but cannot connect to db: " + URL);
            }
        }
    }

    /**
     * This method will load an sql statement.
     *
     * @param sql a String of sql to load
     * 
     * @return boolean indicates success or failure of data load
     */
    public static boolean loadSQL (final String sql)
    {
        getConnection ();
        try
        {
            final Statement theStat = buildStatement ();
            theStat.execute (sql);
            theStat.close ();
            DBCONN.close ();
            return true;
        }
        catch (final SQLException e)
        {
            e.printStackTrace ();
            return false;
        }
    }

    /**
     * This method will build a statement.
     *
     * @return Statement
     * @throws SQLException the SQL exception
     */
    private static Statement buildStatement () throws SQLException
    {
        getConnection ();
        return DBCONN.createStatement ();
    }

    /**
     * Method to remove a Case from the database (attached judgments / obligations etc also removed).
     *
     * @param caseNumber a String containing the case number of the case to be deleted
     */
    public static void deleteAll (final String caseNumber)
    {
        if (caseNumber == null)
        {
            System.out.println ("DBAccess.deleteAll - Failure - casenumber null");
        }
        else
        {
            try
            {
                final Statement theStat = buildStatement ();
                theStat.executeUpdate ("delete from given_addresses where case_number = '" + caseNumber + "'");
                theStat.executeUpdate ("delete from obligations where case_number = '" + caseNumber + "'");
                theStat.executeUpdate ("delete from case_events where case_number = '" + caseNumber + "'");
                theStat.executeUpdate ("delete from case_party_roles where case_number = '" + caseNumber + "'");
                theStat.executeUpdate ("delete from cases where case_number = '" + caseNumber + "'");
                theStat.close ();
                DBCONN.close ();
                System.out.println ("DBAccess.deleteAll - Successful");
            }
            catch (final SQLException e)
            {
                e.printStackTrace ();
                System.out.println ("DBAccess.deleteAll - Failed - please investigate and clean up the database");
            }
        }
    }
}
