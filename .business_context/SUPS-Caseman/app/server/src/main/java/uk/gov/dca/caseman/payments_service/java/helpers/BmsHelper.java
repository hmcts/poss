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

import java.util.Date;

import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Collection of common functions for logging BMS tasks.
 * 
 * @author Steve Blair
 */
public final class BmsHelper
{

    /**
     * Instantiates a new bms helper.
     */
    // Disallow instantiation and inheritance.
    private BmsHelper ()
    {
    }

    /**
     * Updates TASK_COUNTS table with BMS info.
     *
     * @param payment payment DOM matching map_payment.xml structure
     * @param services ServiceAdaptor to contact database
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static void logBms (final Payment payment, final ServiceAdaptor services)
        throws SystemException, BusinessException
    {
        final Element bmsParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (bmsParams, "section", "PAYMENT");
        XMLBuilder.addParam (bmsParams, "courtCode", payment.getAdminCourt ());
        XMLBuilder.addParam (bmsParams, "receiptDate", Payment.getSupsDateFormat ().format (new Date ()));
        XMLBuilder.addParam (bmsParams, "processingDate", Payment.getSupsDateFormat ().format (new Date ()));
        XMLBuilder.addParam (bmsParams, "taskType", "B");
        XMLBuilder.addParam (bmsParams, "userId", payment.getCreatedBy ());

        // Order of conditional important, e.g. CO passthroughs should be
        // PASSTHROUGH and not AO/CAEO PAYMENT.
        final boolean hasRelatedTransactionNumber = payment.getRelatedTransactionNumber ().length () > 0;
        if (payment.getRdDate () != null)
        {
            XMLBuilder.addParam (bmsParams, "paymentType", "RD CHQ");
        }
        else if (payment.isPassthrough () && !hasRelatedTransactionNumber)
        {
            XMLBuilder.addParam (bmsParams, "paymentType", "PASSTHROUGH");
        }
        else if (payment.isCoPayment ())
        {
            XMLBuilder.addParam (bmsParams, "paymentType", "AO/CAEO PAYMENT");
        }
        else
        {
            XMLBuilder.addParam (bmsParams, "paymentType", "PAYMENT");
        }

        services.callService ("ejb/BmsServiceLocal", "addBmsRuleNonEventLocal2", bmsParams);
    }

}