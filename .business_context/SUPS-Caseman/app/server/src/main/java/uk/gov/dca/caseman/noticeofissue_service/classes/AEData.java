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
package uk.gov.dca.caseman.noticeofissue_service.classes;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class AEData.
 *
 * @author Christopher Vincent
 */
public class AEData
{
    /**
     * Ae service name.
     */
    public static final String AE_SERVICE = "ejb/AeServiceLocal";
    /**
     * Ae event service name.
     */
    public static final String AE_EVENT_SERVICE = "ejb/AeEventServiceLocal";
    /**
     * Get ae details method name.
     */
    public static final String GET_AE_DETAILS = "getAeDetailsLocal";
    /**
     * Get ae events method name.
     */
    public static final String GET_AE_EVENT = "getAeEventLocal";
    
    /** SUPS Application Logger. */
    private static Log log = SUPSLogFactory.getLogger (DataProcessor.class);

    /**
     * Returns the ae element for the given ae number.
     *
     * @param AENumber The ae number.
     * @param caseNumber The case number.
     * @param proxy The sups service proxy.
     * @return The ae element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static Element getAE (final String AENumber, final String caseNumber, final AbstractSupsServiceProxy proxy)
        throws SystemException, BusinessException, JDOMException
    {
        final String params = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";
        final Element aEAppRoot = proxy.getJDOM (AE_SERVICE, GET_AE_DETAILS, params).getRootElement ();
        return (Element) XPath.selectSingleNode (aEAppRoot, "//AEApplication[./AENumber='" + AENumber + "']");
    }

    /**
     * Returns the ae event element for the given case event sequence number.
     *
     * @param AENumber The ae number.
     * @param eventPK The case event sequence number.
     * @param proxy The sups service proxy.
     * @return The ae event element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static Element getAEEvent (final String AENumber, final String eventPK, final AbstractSupsServiceProxy proxy)
        throws SystemException, BusinessException, JDOMException
    {
        log.debug ("enter method getAEEvent()");

        final XMLOutputter out = new XMLOutputter ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();

        XMLBuilder.addParam (paramsElement, "aeNumber", AENumber);
        XMLBuilder.addParam (paramsElement, "caseEventSeq", eventPK);

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String param = xmlOutputter.outputString (paramsElement);

        final Element aEEventRoot = proxy.getJDOM (AE_EVENT_SERVICE, GET_AE_EVENT, param).getRootElement ();

        log.debug ("aEEventRoot \n" + out.outputString (aEEventRoot));
        log.debug ("exit method getAEEvent()");
        return (Element) XPath.selectSingleNode (aEEventRoot, "//AEEvent[./CaseEventSeq='" + eventPK + "']");
    }

}