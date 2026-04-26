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
package uk.gov.dca.caseman.payout_service.classes;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Payout Method: cancelDividendPayout
 * Class: CancelDividendPayoutCustomProcessor.java @author Mark Hallam
 * Created: 13-Dec-2005
 * 
 * Description:
 * Clear down data for payout (reset)
 * Clear payout control flag
 * 
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 02-Jul-2006 Steve Blair:
 * Added ability to override default code code as this need not necessarily be the same as the user's
 * when called from Remove Payments Lock screen.
 */
public class CancelDividendPayoutCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Payout service name.
     */
    public static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";
    /**
     * Delete report data method name.
     */
    public static final String DELETE_REPORT_DATA = "deleteReportDataLocal";
    /**
     * Delete dividend data method name.
     */
    public static final String DELETE_DIVIDEND_DATA = "dividendDeclarationDeletesLocal";

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws BusinessException, SystemException
    {
        final Document dom = new Document ();
        final Element ds = new Element ("ds");
        String adminCourtCode = null;

        try
        {
            // Use default user court code if court not specifically provided.
            final Element courtElement =
                    (Element) XPath.selectSingleNode (params, "params/param[@name='reportData']/ReportData/CourtCode");
            if (courtElement != null)
            {
                adminCourtCode = courtElement.getText ();
            }
            else
            {
                adminCourtCode =
                        ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId']")).getText ();
            }
            mDeleteDividendData (adminCourtCode);
            mDeletePayoutStatusLock (adminCourtCode);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        /* Framework dictates that something must be returned to the client */
        return params;
    }

    /**
     * (non-Javadoc)
     * Delete data from PAYABLE_ORDER_ITEMS, PAYABLE_ORDERS, CANDIDATE_DIVIDEND_PAYMENTS
     * DEBT_DIVIDENDS (where created = 'N' and DIVIDENDS (where created = 'N').
     *
     * @param adminCourtCode the admin court code
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteDividendData (final String adminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "courtId", adminCourtCode);

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, DELETE_DIVIDEND_DATA, inputDoc).getRootElement ();
        }
        finally
        {
        }
    }

    /**
     * (non-Javadoc)
     * Remove the Lock from the REPORT_DATA table.
     *
     * @param adminCourtCode the admin court code
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeletePayoutStatusLock (final String adminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "courtId", adminCourtCode);
            XMLBuilder.addParam (paramsElement, "reportType", "DIV");

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, DELETE_REPORT_DATA, inputDoc).getRootElement ();
        }
        finally
        {
        }
    }
}