/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 3700 $
 * $Author: bonnettp $
 * $Date: 2009-08-24 13:08:37 +0100 (Mon, 24 Aug 2009) $
 * $Id: StubbedUserDirectoryDAO.java 3700 2009-08-24 12:08:37Z bonnettp $
 *
 ******************************************************************************/
package uk.gov.dca.caseman.user_service.java;

import java.util.Hashtable;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import uk.gov.dca.db.security.user.UserDirectoryDAO;

/**
 * An implementation of the UserDirectoryDAO.
 *
 * @author Chris Byrom
 */
public class StubbedUserDirectoryDAO implements UserDirectoryDAO
{

    /** Seaarch base AD environment variable. */
    private static final String SEARCHBASE_KEY = "searchbase";

    /** query AD environment variable. */
    public static final String QUERY_KEY = "query";

    /**
     * Call the super constructor.
     */
    public StubbedUserDirectoryDAO ()
    {

        super ();
    }

    /**
     * {@inheritDoc}
     */
    public void setEnvironment (final Hashtable env)
    {

        final Hashtable<String, String> connectionEnv = (Hashtable<String, String>) env.clone ();
        final String searchBase = (String) connectionEnv.get (SEARCHBASE_KEY);
        final String query = (String) connectionEnv.get (QUERY_KEY);
        connectionEnv.remove (SEARCHBASE_KEY);
        connectionEnv.remove (QUERY_KEY);
    }

    /**
     * Create a dummy ADUser.
     *
     * @param userId The userId of the current user
     * @return ADUserPersonalDetails
     * @throws SystemException the system exception
     */
    public ADUserPersonalDetails getPersonalDetailsForUser (final String userId) throws SystemException
    {

        final ADUserPersonalDetails details = new ADUserPersonalDetails ();
        details.setForenames ("Stub");
        details.setSurname (userId);
        details.setDeedPak ("STUBBED");
        details.setUserId (userId);

        return details;
    }
}
