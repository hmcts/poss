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
package uk.gov.dca.caseman.transfer_case_service.java;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: TransferCase
 * Class: TransferReasonHelper.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 01-Aug-2005
 *         Description:
 *         Common methods relating to Transfer Reasons.
 * 
 *         Change History:
 */
public class TransferReasonHelper
{
    // Enumeration of values for the parameter pTransferType of GetTransferReasonEventId().
    /**
     * Transfer type in.
     */
    public static final String TRANSFER_TYPE_IN = "IN";
    /**
     * Transfer type out.
     */
    public static final String TRANSFER_TYPE_OUT = "OUT";

    /** The Constant TRANSFER_CASE_SERVICE. */
    // Service call constants.
    private static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    
    /** The Constant GET_TRANSFER_REASON. */
    private static final String GET_TRANSFER_REASON = "getTransferReasonLocal";

    /**
     * Returns the transfer reason event id.
     *
     * @param pTransferReasonCode Transfer reason code.
     * @param pTransferType Transfer type.
     * @return The transfer reason event id.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static String GetTransferReasonEventId (final String pTransferReasonCode, final String pTransferType)
        throws SystemException, BusinessException, JDOMException
    {
        String transferredOutEventId = null;
        Element transferReasonElement = null;
        String judgmentType = null;

        try
        {
            transferReasonElement = GetTransferReason (pTransferReasonCode);
            judgmentType = XMLBuilder.getXPathValue (transferReasonElement, "/ds/TransferReason/JudgmentType");
            if (pTransferType.equals (TRANSFER_TYPE_OUT))
            {
                if (judgmentType.equals ("PRE"))
                {
                    transferredOutEventId = "340";
                }
                else
                {
                    transferredOutEventId = "350";
                }
            }
            else
            {
                if (judgmentType.equals ("PRE"))
                {
                    transferredOutEventId = "360";
                }
                else
                {
                    transferredOutEventId = "370";
                }
            }
        }
        finally
        {
            transferReasonElement = null;
            judgmentType = null;
        }

        return transferredOutEventId;
    } // GetTransferReasonEventId()

    /**
     * Gets the transfer reason.
     *
     * @param pTransferReasonCode the transfer reason code
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static Element GetTransferReason (final String pTransferReasonCode) throws SystemException, BusinessException
    {
        Element transferReasonElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        AbstractSupsServiceProxy localServiceProxy = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "transferReasonCode", pTransferReasonCode);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy = new SupsLocalServiceProxy ();
            transferReasonElement = localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, GET_TRANSFER_REASON, sXmlParams)
                    .getRootElement ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            localServiceProxy = null;
        }

        return transferReasonElement;
    } // GetTransferReason()

} // class TransferReasonHelper
