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
package uk.gov.dca.caseman.common.java.security;

import java.text.MessageFormat;
import java.util.Hashtable;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import uk.gov.dca.db.security.user.UserDirectoryDAO;

/**
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 18-Oct-2006 Paul Roberts : Change to UserDirectoryDAO to allow the training application to work
 */
public class CasemanUserDirectoryDAO implements UserDirectoryDAO //java 8 - waits for a change in uk.gov.dca.db.security.user.UserDirectoryDAO
{

    /** The ad unavailable. */
    private static String AD_UNAVAILABLE =
            "The server cannot connect to Active Directory at the moment. Please try again later.";
    
    /** The user not found. */
    private static String USER_NOT_FOUND = "User does not exist in Active Directory";
    
    /** The Constant FORENAME. */
    private static final String FORENAME = "givenname";
    
    /** The Constant SURNAME. */
    private static final String SURNAME = "sn";
    
    /** The Constant DN. */
    private static final String DN = "distinguishedname";
    
    /** The Constant SEARCHBASE_KEY. */
    private static final String SEARCHBASE_KEY = "searchbase";
    
    /** The Constant TRAINING_OU_KEY. */
    private static final String TRAINING_OU_KEY = "trainingou";
    /**
     * Query environment string.
     */
    public static final String QUERY_KEY = "query";
    
    /** The Constant RETURN_ATTRIBUTES. */
    private static final String[] RETURN_ATTRIBUTES = new String[] {FORENAME, SURNAME, DN};

    /** The connection env. */
    private Hashtable<String, String> connectionEnv = null;
    
    /** The search base. */
    private String searchBase = null;
    
    /** The query. */
    private String query = null;
    
    /** The training OU. */
    private String trainingOU = null;

    /**
     * Constructor.
     */
    public CasemanUserDirectoryDAO ()
    {
        super ();
    }

    /**
     * {@inheritDoc}
     */
    public void setEnvironment (final Hashtable env)
    {
        connectionEnv = (Hashtable<String, String>) env.clone ();
        searchBase = (String) connectionEnv.get (SEARCHBASE_KEY);
        query = (String) connectionEnv.get (QUERY_KEY);
        trainingOU = (String) connectionEnv.get (TRAINING_OU_KEY);
        connectionEnv.remove (SEARCHBASE_KEY);
        connectionEnv.remove (QUERY_KEY);
    }

    /**
     * (non-Javadoc).
     *
     * @param userId the user id
     * @return the personal details for user
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.security.user.UserDirectoryDAO#getPersonalDetailsForUser(java.lang.String)
     */
    public ADUserPersonalDetails getPersonalDetailsForUser (final String userId) throws SystemException
    {
        // obtain an LDAP connection to Active Directory
        LdapContext con = null;
        try
        {
            con = new InitialLdapContext (connectionEnv, null);
        }
        catch (final NamingException e)
        {
            throw new SystemException (AD_UNAVAILABLE);
        }

        // use the connection to retrieve the user from AD
        final ADUserPersonalDetails details = new ADUserPersonalDetails ();

        try
        {
            // Set up LDAP search params
            final SearchControls constraints = new SearchControls ();
            constraints.setSearchScope (SearchControls.SUBTREE_SCOPE);
            constraints.setReturningAttributes (RETURN_ATTRIBUTES);

            final String filter = MessageFormat.format (query, new String[] {userId});

            // do the search on AD and extract the displayname from the results
            final NamingEnumeration<SearchResult> results = con.search (searchBase, filter, constraints);
            if (results != null && results.hasMore ())
            {
                // there should only be one result so use the first one
                final SearchResult sr = (SearchResult) results.next ();
                final Attributes attrs = sr.getAttributes ();
                final Attribute forenameAttr = attrs.get (FORENAME);
                details.setForenames ((String) forenameAttr.get ());
                final Attribute surnameAttr = attrs.get (SURNAME);
                details.setSurname ((String) surnameAttr.get ());
                final Attribute dnAttr = attrs.get (DN);
                final String dnStr = (String) dnAttr.get ();
                String deedPack = getDeedPackFromDN (dnStr);
                // If deedpack matches the trainingou parameter in the properties file, this is a training user
                // and their deedpack number is encoded in their userid - characters 3 - 8 inclusive
                if (deedPack.equals (trainingOU))
                {
                    deedPack = userId.substring (2, 8);
                }

                details.setDeedPak (deedPack);
            }
            else
            {
                throw new SystemException (USER_NOT_FOUND);
            }

            details.setUserId (userId);

            return details;
        }
        catch (final NamingException ne)
        {
            throw new SystemException (ne.getMessage ());
        }
        finally
        {
            if (con != null)
            {
                try
                {
                    con.close ();
                }
                catch (final NamingException ne)
                {
                }
            }
        }
    }

    /**
     * Gets the deed pack from DN.
     *
     * @param dn the dn
     * @return the deed pack from DN
     */
    private String getDeedPackFromDN (final String dn)
    {
        int commaIndex = dn.indexOf (",");
        final String subStr1 = dn.substring (commaIndex + 1);
        commaIndex = subStr1.indexOf (",");
        final String subStr2 = subStr1.substring (commaIndex + 1);
        commaIndex = subStr2.indexOf (",");
        final int eqIndex = subStr2.indexOf ("=");
        return subStr2.substring (eqIndex + 1, commaIndex);
    }
}