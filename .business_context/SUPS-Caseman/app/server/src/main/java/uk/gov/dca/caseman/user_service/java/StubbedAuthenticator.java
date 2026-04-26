/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 3700 $
 * $Author: bonnettp $
 * $Date: 2009-08-24 13:08:37 +0100 (Mon, 24 Aug 2009) $
 * $Id: StubbedAuthenticator.java 3700 2009-08-24 12:08:37Z bonnettp $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.AuthenticationException;
import uk.gov.dca.db.security.IAuthenticator;

/**
 * Temporary implementation of IAuthentictor interface.
 * 
 * @author GrantM
 */
public class StubbedAuthenticator implements IAuthenticator
{

    /** The m user info. */
    private Map<String, String> m_userInfo;

    /**
     * Constructor.
     *
     * @throws SystemException - what happens when we fail to parse the data
     */
    public StubbedAuthenticator () throws SystemException
    {
        super ();
        if (m_userInfo == null)
        {
            try
            {
                final InputStream is =
                        getClass ().getResourceAsStream ("/uk/gov/dca/caseman/user_service/xml/StubbedUsers.xml");

                final Document doc = new SAXBuilder ().build (is);
                final List<Element> l = doc.getRootElement ().getChildren ();
                m_userInfo = new TreeMap<String, String>();

                for (int i = 0; i < l.size (); i++)
                {
                    final String username = ((Element) l.get (i)).getChild ("Username").getText ();
                    final String password = ((Element) l.get (i)).getChild ("Password").getText ();
                    m_userInfo.put (username, password);
                }
            }
            catch (final IOException ioe)
            {
                throw new SystemException ("Unable to load stubbed user data", ioe);
            }
            catch (final JDOMException jde)
            {
                throw new SystemException ("Unable to parse stubbed user data", jde);
            }
        }
    }

    /**
     * {@inheritDoc}
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
