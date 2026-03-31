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

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class WarrantReturnData.
 *
 * @author Christopher Vincent
 */
public class WarrantReturnData
{
    /**
     * Warrant returns service name.
     */
    public static final String WARRANT_RETURNS_SERVICE = "ejb/WarrantReturnsServiceLocal";
    /**
     * Get warrant returns method name.
     */
    public static final String GET_WARRANT_RETURNS = "getWarrantReturnsLocal";

    /**
     * Returns the warrant return.
     *
     * @param warrantid The warrant id.
     * @param warrantReturnsId the warrant returns id
     * @param proxy The sups proxy
     * @return The warrant return element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static Element getWarrantReturn (final String warrantid, final String warrantReturnsId,
                                            final AbstractSupsServiceProxy proxy)
        throws SystemException, BusinessException, JDOMException
    {

        final String params = "<params><param name='warrantID'>" + warrantid + "</param></params>";
        final Element warrantReturnsRoot =
                proxy.getJDOM (WARRANT_RETURNS_SERVICE, GET_WARRANT_RETURNS, params).getRootElement ();
        return (Element) XPath.selectSingleNode (warrantReturnsRoot,
                "//WarrantEvent[./WarrantReturnsID=" + warrantReturnsId + "]");

    }

}