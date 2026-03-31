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
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 08-Mar-2006
 *
 * Change History:
 * 16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 21-Jun-2006 Phil Haferer (EDS): Addition of Audit Event Logging.
 * 
 * @author kznwpr
 */

/**
 * Change History:
 * 21-Sep-2008 Sandeep Mullangi (Logica): RFC 521: Deleting admin role when deactivating the user
 */
public class DeactivateUserCustomProcessor extends AbstractCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant UPDATE_USER_METHOD. */
    private static final String UPDATE_USER_METHOD = "updateUserLocal";
    
    /** The Constant DELETE_USER_ROLE_METHOD. */
    private static final String DELETE_USER_ROLE_METHOD = "deleteUserRoleLocal";
    
    /** The Constant DELETE_USER_COURT_METHOD. */
    private static final String DELETE_USER_COURT_METHOD = "deleteUserCourtLocal";

    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (DeactivateUserCustomProcessor.class);
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DeactivateUserCustomProcessor.class);

    /**
     * Constructor.
     */
    public DeactivateUserCustomProcessor ()
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
            final String PARAM = "/params/param[@name='maintainUser']";
            final XPath myUserParam = XPath.newInstance (PARAM);
            final Element myElement = (Element) myUserParam.selectSingleNode (document);

            final String userIdToDelete =
                    myElement.getChild ("ds").getChild ("MaintainUser").getChild ("UserId").getText ();
            final String courtIdToDelete =
                    myElement.getChild ("ds").getChild ("MaintainUser").getChild ("CourtCode").getText ();
            final String roleToDelete =
                    myElement.getChild ("ds").getChild ("MaintainUser").getChild ("Role").getText ();
            ;

            // Output the xml
            final Element dsElement = myElement.getChild ("ds");
            final XMLOutputter myOutputter = new XMLOutputter ();
            final String txt = myOutputter.outputString (dsElement);

            if (log.isDebugEnabled ())
            {

                log.debug ("This is the text>>>>>>>" + txt);
                log.debug ("This is the user who will be deactivated>>>>>>>" + userIdToDelete);
                log.debug ("This is the input document>>>>>" + myOutputter.outputString (document));
            }

            // Save any changes made to the user before he/she was deactivated
            Document resultsDoc = updateUser (myOutputter.outputString (document));

            // Delete the user_role record for the user
            Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "userIdToDelete", userIdToDelete);
            XMLBuilder.addParam (paramsElement, "roleId", roleToDelete);
            XMLBuilder.addParam (paramsElement, "courtCode", courtIdToDelete);
            resultsDoc = deleteUserRole (myOutputter.outputString (paramsElement));
            // deleting admin role from the user_role table
            XMLBuilder.removeParam (paramsElement, "roleId");
            XMLBuilder.addParam (paramsElement, "roleId", "admin");
            resultsDoc = deleteUserRole (myOutputter.outputString (paramsElement));

            // Delete the user_court record for the user
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "userIdToDelete", userIdToDelete);
            XMLBuilder.addParam (paramsElement, "courtCode", courtIdToDelete);
            resultsDoc = deleteUserCourt (myOutputter.outputString (paramsElement));

            // Log an Audit Event to record the reactivation.
            final String loggedInUserId = (String) this.m_context.getSystemItem (IComponentContext.USER_ID_KEY);
            final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                    /* String sourceDetails */"Save User Profile", /* String auditType */"USER PROFILE",
                    /* String userId */loggedInUserId, /* String eventStatus */"Success",
                    /* String statusDetails */"User Profile for user " + userIdToDelete +
                            " has been successful deactivated.");
            auditLog.info (auditEvent);

            // Write the return document for the client
            writer.write (myOutputter.outputString (resultsDoc));
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
     * Saves any changes the client may have made to the profile before deactivating it.
     *
     * @param paramString the param string
     * @return The updated user document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document updateUser (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, UPDATE_USER_METHOD, paramString);
    }

    /**
     * Removes the user_role record.
     *
     * @param paramString the param string
     * @return The updated user document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document deleteUserRole (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("deleteUserRole parameters>>>" + paramString);
        }
        return proxy.getJDOM (USER_SERVICE, DELETE_USER_ROLE_METHOD, paramString);
    }

    /**
     * Removes the user_court record.
     *
     * @param paramString the param string
     * @return The updated user court document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document deleteUserCourt (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("deleteUserCourt parameters>>>" + paramString);
        }
        return proxy.getJDOM (USER_SERVICE, DELETE_USER_COURT_METHOD, paramString);
    }
}
