/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 1064 $
 * $Author: mullangisa $
 * $Date: 2008-11-11 17:53:02 +0000 (Tue, 11 Nov 2008) $
 * $Id: GetUserCustomProcessor.java 1064 2008-11-11 17:53:02Z mullangisa $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 10-Sept-2008.
 *
 * @author Nilesh Mistry Added as part of RFC 521 (TRAC ticket #11)
 */
public class GetUserCustomProcessor extends AbstractCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant GET_USER_ADMIN_METHOD. */
    private static final String GET_USER_ADMIN_METHOD = "getUserAdminLocal";

    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (GetUserCustomProcessor.class);
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (GetUserCustomProcessor.class);

    /**
     * Constructor.
     */
    public GetUserCustomProcessor ()
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
            final XMLOutputter myOutputter = new XMLOutputter (Format.getCompactFormat ());

            // First retrieve the document from the getUser service and then
            // call the getUserAdmin service
            final Element dsNode = document.getRootElement ();
            final Element maintainUserNode = dsNode.getChild ("MaintainUser");
            if (maintainUserNode != null)
            {

                final String userId = maintainUserNode.getChild ("UserId").getText ();
                final String courtId = maintainUserNode.getChild ("CourtCode").getText ();

                final Element paramElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (paramElement, "userId", userId);
                XMLBuilder.addParam (paramElement, "courtId", courtId);
                final Document resultDoc = getUserAdminRole (myOutputter.outputString (paramElement));
                final Element adminNode = maintainUserNode.getChild ("AdminRole");

                /* OrigAdminRole is used so that it can be checked whether a
                 * user's details have been updated or not */
                if (resultDoc == null)
                {
                    adminNode.setText ("N");
                }
                else
                {
                    adminNode.setText ("Y");
                }
                // maintainUserNode.addContent(adminNode);

            }

            writer.write (myOutputter.outputString (dsNode));

        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Returns whether the user is an admin.
     *
     * @param paramString the param string
     * @return The users details.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getUserAdminRole (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, GET_USER_ADMIN_METHOD, paramString);
    }
}
