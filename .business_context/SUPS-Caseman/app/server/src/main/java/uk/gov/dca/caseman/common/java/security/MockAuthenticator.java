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

import java.util.Map;
import java.util.TreeMap;

import uk.gov.dca.db.security.AuthenticationException;
import uk.gov.dca.db.security.IAuthenticator;

/**
 * Temporary implementation of IAuthentictor interface.
 * 
 * Created on 31-Aug-2005
 * 
 * @author Ian Stainer
 */
public class MockAuthenticator implements IAuthenticator
{

    /** The m user info. */
    private Map<String, String> m_userInfo = new TreeMap<>();

    /**
     * Constructor.
     */
    public MockAuthenticator ()
    {
        super ();

        // Populate the users and passwords.
        m_userInfo.put ("vouser", "pwd"); // View only user
        m_userInfo.put ("muser", "pwd"); // Medium user
        m_userInfo.put ("huser", "pwd"); // High user
        m_userInfo.put ("wcsuser", "pwd"); // Warrant control supervisor user
        m_userInfo.put ("scsuser", "pwd"); // Suitors cash supervisor user
        m_userInfo.put ("bmsuser", "pwd"); // BMS supervisor user
        m_userInfo.put ("aesuser", "pwd"); // Attachment of earnings user
        m_userInfo.put ("dmsuser", "pwd"); // Diary management supervisor user
        m_userInfo.put ("edsuser", "pwd"); // EDS admin user

        // 282 Northampton
        m_userInfo.put ("vouser282", "pwd"); // View only user
        m_userInfo.put ("muser282", "pwd"); // Medium user
        m_userInfo.put ("huser282", "pwd"); // High user
        m_userInfo.put ("wcsuser282", "pwd"); // Warrant control supervisor user
        m_userInfo.put ("scsuser282", "pwd"); // Suitors cash supervisor user
        m_userInfo.put ("bmsuser282", "pwd"); // BMS supervisor user
        m_userInfo.put ("aesuser282", "pwd"); // Attachment of earnings user
        m_userInfo.put ("dmsuser282", "pwd"); // Diary management supervisor user
        m_userInfo.put ("edsuser282", "pwd"); // EDS admin user

        // 180 Coventry
        m_userInfo.put ("vouser180", "pwd"); // View only user
        m_userInfo.put ("muser180", "pwd"); // Medium user
        m_userInfo.put ("huser180", "pwd"); // High user
        m_userInfo.put ("wcsuser180", "pwd"); // Warrant control supervisor user
        m_userInfo.put ("scsuser180", "pwd"); // Suitors cash supervisor user
        m_userInfo.put ("bmsuser180", "pwd"); // BMS supervisor user
        m_userInfo.put ("aesuser180", "pwd"); // Attachment of earnings user
        m_userInfo.put ("dmsuser180", "pwd"); // Diary management supervisor user
        m_userInfo.put ("edsuser180", "pwd"); // EDS admin user

        // 111 Telford
        m_userInfo.put ("vouser111", "pwd"); // View only user
        m_userInfo.put ("muser111", "pwd"); // Medium user
        m_userInfo.put ("huser111", "pwd"); // High user
        m_userInfo.put ("wcsuser111", "pwd"); // Warrant control supervisor user
        m_userInfo.put ("scsuser111", "pwd"); // Suitors cash supervisor user
        m_userInfo.put ("bmsuser111", "pwd"); // BMS supervisor user
        m_userInfo.put ("aesuser111", "pwd"); // Attachment of earnings user
        m_userInfo.put ("dmsuser111", "pwd"); // Diary management supervisor user
        m_userInfo.put ("edsuser111", "pwd"); // EDS admin user
    }

    /**
     * (non-Javadoc).
     *
     * @param userId the user id
     * @param password the password
     * @return true, if successful
     * @throws AuthenticationException the authentication exception
     * @see uk.gov.dca.db.security.IAuthenticator#authenticate(java.lang.String, java.lang.String)
     */
    public boolean authenticate (final String userId, final String password) throws AuthenticationException
    {
        boolean bValid = false;

        if (userId == null)
        {
            throw new AuthenticationException ("No userId provided");
        }

        if (password == null)
        {
            throw new AuthenticationException ("No password provided");
        }

        final String correctPassword = (String) m_userInfo.get (userId);
        if (correctPassword != null)
        {
            bValid = correctPassword.compareTo (password) == 0;
        }

        return bValid;
    }

}
