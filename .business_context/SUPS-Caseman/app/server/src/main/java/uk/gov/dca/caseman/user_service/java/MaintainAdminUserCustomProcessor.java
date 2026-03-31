/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: $
 * $Author: $
 * $Date: $
 * $Id: $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * This custom processor is responsible for maintaining the admin user roles
 * 
 * Created on 23 July 2014.
 *
 * @author Chris Vincent
 */
public class MaintainAdminUserCustomProcessor extends AbstractCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant INSERT_USER_ROLE_METHOD. */
    private static final String INSERT_USER_ROLE_METHOD = "insertUserAdminRoleLocal";
    
    /** The Constant DELETE_USER_ROLE_METHOD. */
    private static final String DELETE_USER_ROLE_METHOD = "deleteUserAdminRolesLocal";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (MaintainAdminUserCustomProcessor.class);

    /**
     * Constructor.
     */
    public MaintainAdminUserCustomProcessor ()
    {
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {
            final String MAINTAIN_USER_PARAM = "/params/param[@name='maintainUser']";
            final XPath myUserParam = XPath.newInstance (MAINTAIN_USER_PARAM);
            final Element myElement = (Element) myUserParam.selectSingleNode (document);

            // Retrieve user details
            final Element maintainUserElement = myElement.getChild ("ds").getChild ("User");
            final String userId = maintainUserElement.getChildText ("UserId");
            final String courtCode = maintainUserElement.getChildText ("OwningCourtCode");
            final String adminRole = maintainUserElement.getChildText ("AdminRole");

            // Setup parameters
            final XMLOutputter myOutputter = new XMLOutputter ();
            final Element paramElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramElement, "userId", userId);
            XMLBuilder.addParam (paramElement, "courtCode", courtCode);

            // Delete admin roles
            deleteUserRole (myOutputter.outputString (paramElement));

            if (adminRole.length () > 0)
            {
                // Add admin role
                XMLBuilder.addParam (paramElement, "roleId", adminRole);
                insertUserRole (myOutputter.outputString (paramElement));
            }
            // Write the return document for the client
            writer.write (myOutputter.outputString (document));
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Inserts a record into the USER_ROLE table.
     * 
     * @param paramString Parameters for service call
     * @return The updated user role document.
     * @throws BusinessException Business Exception
     * @throws SystemException System Exception
     */
    private Document insertUserRole (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> Inserting a record in the USER_ROLE table..." + paramString);
        }
        return proxy.getJDOM (USER_SERVICE, INSERT_USER_ROLE_METHOD, paramString);
    }

    /**
     * Deletes the admin roles from the USER_ROLE table for the user.
     *
     * @param paramString Parameters for service call
     * @return The updated user role document.
     * @throws BusinessException Business Exception
     * @throws SystemException System Exception
     */
    private Document deleteUserRole (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, DELETE_USER_ROLE_METHOD, paramString);
    }
}
