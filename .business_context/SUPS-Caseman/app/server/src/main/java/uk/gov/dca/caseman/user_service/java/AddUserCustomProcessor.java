/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 655 $
 * $Author: mistryn $
 * $Date: 2008-09-26 09:35:29 +0100 (Thu, 25 Sep 2008) $
 * $Id: AddUserCustomProcessor.java 655 2008-09-25 15:18:29Z mistryn $
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
 * Created on 26-Sept-2008.
 *
 * @author Nilesh Mistry Added as part of RFC 521 (TRAC ticket #11)
 */
public class AddUserCustomProcessor extends AbstractCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant ADD_USER_BUSINESS_ROLE_METHOD. */
    private static final String ADD_USER_BUSINESS_ROLE_METHOD = "addUserBusinessRoleLocal";
    
    /** The Constant INSERT_USER_ROLE_METHOD. */
    private static final String INSERT_USER_ROLE_METHOD = "insertUserRoleLocal";

    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (GetUserCustomProcessor.class);
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (GetUserCustomProcessor.class);

    /**
     * Constructor.
     */
    public AddUserCustomProcessor ()
    {
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc)ct.
     *
     * @param document the document
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {

            final String MAINTAIN_USER_PARAM = "/params/param[@name='maintainUser']";
            final XPath myUserParam = XPath.newInstance (MAINTAIN_USER_PARAM);
            final Element myElement = (Element) myUserParam.selectSingleNode (document);

            final Element maintainUserElement = myElement.getChild ("ds").getChild ("MaintainUser");

            // store whether the user needs to be an admin or not
            final String adminRole = maintainUserElement.getChild ("AdminRole").getText ();

            final XMLOutputter myOutputter = new XMLOutputter ();

            final Document resultDoc = addUserBusinessRole (myOutputter.outputString (document));

            // if the user needs to have admin access
            if (adminRole.equalsIgnoreCase ("Y"))
            {
                // getting the params element and adding the "admin" element
                final Element paramsElement = (Element) XPath.selectSingleNode (document, "/params");
                XMLBuilder.removeParam (paramsElement, "roleToInsert");
                XMLBuilder.addParam (paramsElement, "roleToInsert", "admin");
                insertUserRole (myOutputter.outputString (document));
            }

            writer.write (myOutputter.outputString (resultDoc));
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
     * Adds all of the users details including their business role.
     *
     * @param paramString the param string
     * @return The users details.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document addUserBusinessRole (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, ADD_USER_BUSINESS_ROLE_METHOD, paramString);
    }

    /**
     * Inserts a record into the USER_ROLE table. This is done for inserting an
     * admin role for a user
     *
     * @param paramString the param string
     * @return The updated user role document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document insertUserRole (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> Inserting a record in the USER_ROLE table..." + paramString);
        }
        return proxy.getJDOM (USER_SERVICE, INSERT_USER_ROLE_METHOD, paramString);
    }
}