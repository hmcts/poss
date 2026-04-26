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

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Class: InsertWarrantReturn158CustomProcessor.java
 * Service: Warrant
 * Method: addWarrant
 * 
 * Created: 04-May-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 */
public class InsertWarrantReturn158CustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public InsertWarrantReturn158CustomProcessor ()
    {
        super ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException, BusinessException
    {
        try
        {
            // Retrieve the input parameters
            final String warrantID =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='warrantID']")).getText ();
            final String courtCode =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='courtCode']")).getText ();
            final String newWarrantNumber =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='newWarrantNumber']"))
                            .getText ();
            final String receiptDate =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='receiptDate']")).getText ();
            final String caseNumber =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='caseNumber']")).getText ();
            final String defendant2Name =
                    ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='defendant2']")).getText ();
            final String userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);
            final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

            final WarrantReturnsXMLBuilder builder = new WarrantReturnsXMLBuilder (warrantID, "158", todaysDate);
            builder.setCourtCode ("0"); // 158 is a National return code, so set to '0'
            builder.setAdditionalDetails (newWarrantNumber);
            builder.setReceiptDate (receiptDate);
            builder.setExecutedBy (courtCode);
            builder.setCaseNumber (caseNumber);
            builder.setDefendantID ("1");
            builder.setCreatedBy (userName);

            Element warrantReturnsElement = builder.getXMLElement ();

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

            // Call the service.
            invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                    paramsElement.getDocument ());

            if ( !WarrantUtils.isEmpty (defendant2Name))
            {
                // There is a second defendant, so insert a second warrant return
                builder.setDefendantID ("2");
                warrantReturnsElement = builder.getXMLElement ();

                // Wrap the 'CaseEvent' XML in the 'params/param' structure.
                paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

                // Call the service.
                invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                        paramsElement.getDocument ());

            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    }
}