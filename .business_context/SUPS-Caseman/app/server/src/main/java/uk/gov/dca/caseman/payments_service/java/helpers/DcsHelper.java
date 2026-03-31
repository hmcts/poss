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
package uk.gov.dca.caseman.payments_service.java.helpers;

import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Collection of common functions for logging DCS data.
 * 
 * @author Steve Blair
 */
public final class DcsHelper
{

    /**
     * Instantiates a new dcs helper.
     */
    // Disallow instantiation and inheritance.
    private DcsHelper ()
    {
    }

    /**
     * Updates the DCS table with payment info.
     *
     * @param dcsDom DOM matching map_dcs_record.xml structure
     * @param forceInsert if true then new record will be created. If false then
     *            new record will be created only if record does not exist, else
     *            current record will be updated.
     * @param services the services
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static void logDcsData (final Element dcsDom, final boolean forceInsert, final ServiceAdaptor services)
        throws BusinessException, SystemException
    {
        final Element dcsParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (dcsParams, "dcsData", (Element) dcsDom.clone ());

        final String serviceName;
        if (forceInsert)
        {
            serviceName = "insertDcsRecordLocal2";
        }
        else
        {
            serviceName = "logDcsRecordLocal2";
        }

        services.callService ("ejb/PaymentsServiceLocal", serviceName, dcsParams);
    }

}