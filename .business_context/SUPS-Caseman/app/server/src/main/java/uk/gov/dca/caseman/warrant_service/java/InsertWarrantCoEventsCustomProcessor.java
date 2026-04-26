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
package uk.gov.dca.caseman.warrant_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.co_event_service.java.CoEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Inserts a CO Event 969 for re-issued CO warrants.
 * 
 * @author Steve Blair
 */
public class InsertWarrantCoEventsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant NOT_ERRORED_FLAG. */
    private static final String NOT_ERRORED_FLAG = "N";
    
    /** The Constant CO_WARRANT_REISSUED_EVENT_ID. */
    private static final String CO_WARRANT_REISSUED_EVENT_ID = "969";

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor
     *      #process(org.jdom.Document, org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws SystemException, BusinessException
    {
        try
        {
            final Element warrant = (Element) XPath.selectSingleNode (params, "/ds/Warrant");

            final String originalWarrantNumber = warrant.getChildText ("OriginalWarrantNumber");

            final boolean isReissuedWarrant = originalWarrantNumber != null && originalWarrantNumber.length () > 0;

            if (isReissuedWarrant)
            {
                fireCoWarrantReissuedEvent (warrant);
            }

            return params;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Insert a CO Warrant Re-Issued event for the warrant CO.
     *
     * @param warrant the CO warrant
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void fireCoWarrantReissuedEvent (final Element warrant) throws BusinessException, SystemException
    {
        final String coNumber = warrant.getChildText ("CONumber");
        final String warrantNumber = warrant.getChildText ("WarrantNumber");
        final String warrantId = warrant.getChildText ("WarrantID");
        final String dateReceived = warrant.getChildText ("DateRequestReceived");
        final String userId = getUserId ();
        final String systemDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        final CoEventXMLBuilder builder = new CoEventXMLBuilder (coNumber, CO_WARRANT_REISSUED_EVENT_ID, systemDate,
                dateReceived, userId, NOT_ERRORED_FLAG);
        builder.setEventDetails ("WARRANT NUMBER : " + warrantNumber);
        builder.setWarrantId (warrantId);

        final Element coEvent = builder.getXMLElement ("COEvent");
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coEvent", coEvent);

        invokeLocalServiceProxy ("ejb/CoEventServiceLocal", "insertCoEventAutoExtLocal", new Document (paramsElement));
    }

    /**
     * Gets the user id.
     *
     * @return the user id
     */
    private String getUserId ()
    {
        final ComponentContext ctx = (ComponentContext) m_context;
        return ctx.getSystemItem (IComponentContext.USER_ID_KEY).toString ();
    }

}