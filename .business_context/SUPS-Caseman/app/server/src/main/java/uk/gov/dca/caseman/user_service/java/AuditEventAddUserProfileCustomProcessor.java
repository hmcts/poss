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
package uk.gov.dca.caseman.user_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.JDOMException;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: User
 * Method: addUser
 * Class: AuditEventAddUserProfileCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 21-Jun-2006
 *         Description:
 *         Adds an event to the Audit Logger to indicate that a User Profile has been added.
 *
 *         Change History:
 *         30/09/08 - Nilesh Mistry (Logica) added auditing for admin privileges as part of RFC 521 (TRAC Ticket #11)
 */
public class AuditEventAddUserProfileCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (AuditEventAddUserProfileCustomProcessor.class);

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException
    {
        try
        {
            final String dataUserId =
                    XMLBuilder.getXPathValue (pDocParams.getRootElement (), "/ds/MaintainUser/UserId");
            final String loggedInUserId = (String) this.m_context.getSystemItem (IComponentContext.USER_ID_KEY);
            final String adminRole =
                    XMLBuilder.getXPathValue (pDocParams.getRootElement (), "/ds/MaintainUser/AdminRole");

            final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                    /* String sourceDetails */"Save User Profile", /* String auditType */"USER PROFILE",
                    /* String userId */loggedInUserId, /* String eventStatus */"Success",
                    /* String statusDetails */"User Profile for user " + dataUserId + " has been successful created.");
            auditLog.info (auditEvent);

            if ("Y".equalsIgnoreCase (adminRole))
            {
                final SUPSLogEvent adminAuditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                        /* String sourceDetails */"Save User Profile", /* String auditType */"USER PROFILE",
                        /* String userId */loggedInUserId, /* String eventStatus */"Success",
                        /* String statusDetails */"User Profile for user " + dataUserId +
                                " has been successfully granted administrator privileges.");
                auditLog.info (adminAuditEvent);
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

} // class AuditEventAddUserProfileCustomProcessor