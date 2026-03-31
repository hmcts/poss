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
package uk.gov.dca.caseman.payments_service.java;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Run two services and amalgamate results.
 * 
 * @author Steve Blair
 * 
 *         Change History
 *         27/06/2007 - Chris Vincent: Added courtId param to the call to getEnforcement CaseMan Defect 6334.
 */
public class GetPaymentWithEnforcementCustomProcessor implements ICustomProcessor
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public GetPaymentWithEnforcementCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        try
        {
            // Setup parameters.
            final String transactionNumber =
                    ((Element) XPath.selectSingleNode (params, "/params/param[@name='transactionNumber']")).getText ();
            final String owningCourt =
                    ((Element) XPath.selectSingleNode (params, "/params/param[@name='courtId']")).getText ();

            // Setup parameters for getPayment service.
            Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "transactionNumber", transactionNumber);
            XMLBuilder.addParam (paramsElement, "courtCode", owningCourt);

            // Call getPayment service.
            XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final Document paymentDom = localServiceProxy.getJDOM ("ejb/PaymentsServiceLocal", "getPaymentLocal",
                    xmlOutputter.outputString (paramsElement));

            if (paymentDom != null)
            {
                // Setup parameters for getEnforcement service.
                final Element payment = paymentDom.getRootElement ();
                paramsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (paramsElement, "enforcementNumber", payment.getChildText ("EnforcementNumber"));
                XMLBuilder.addParam (paramsElement, "enforcementType", payment.getChildText ("EnforcementType"));
                XMLBuilder.addParam (paramsElement, "issuingCourt", payment.getChildText ("EnforcementCourt"));
                XMLBuilder.addParam (paramsElement, "owningCourt", payment.getChildText ("EnforcementCourt"));
                XMLBuilder.addParam (paramsElement, "courtId", owningCourt);

                // Call getEnforcement service.
                xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
                final Document enforcementDom = localServiceProxy.getJDOM ("ejb/PaymentsServiceLocal",
                        "getEnforcementLocal", xmlOutputter.outputString (paramsElement));

                // Output results.
                if (enforcementDom != null)
                {
                    writer.write ("<PaymentData>" + xmlOutputter.outputString (enforcementDom.getRootElement ()) +
                            xmlOutputter.outputString (paymentDom.getRootElement ()) + "</PaymentData>");
                    return;
                }
            }

            // No enforcements found.
            writer.write ("<blank></blank>");
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
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
        // No op.
    }
}