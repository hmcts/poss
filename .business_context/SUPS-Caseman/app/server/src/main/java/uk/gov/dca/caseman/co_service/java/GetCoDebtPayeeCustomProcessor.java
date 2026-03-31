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
package uk.gov.dca.caseman.co_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Co
 * Method: getCoDebtCreditorAndPayee()
 * Class: GetCoDebtPayeeCustomProcessor.java
 * 
 * @author Phil Haferer
 *         Created: 06 September 2005
 *         Description:
 *         This class forms part of the method which retrieves a Creditor and Payee from a Case,
 *         for association with a Consolidated Order Allowed Debt.
 *         The Creditor is retrieved prior to this class being called.
 *         This retrieval will include a flag which indicates that the Creditor's Solicitor should
 *         act as their Payee, together with the Priamry Key of the Solicitor.
 *         This class inspects this Payee flag, and only attempts to retrieve the Solicitor if they
 *         are to act as the Payee (thereby avoiding an unnecessary database call, when appropriate).
 * 
 *         Change History:
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class GetCoDebtPayeeCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant GET_CO_DEBT_PAYEE_METHOD. */
    private static final String GET_CO_DEBT_PAYEE_METHOD = "getCoDebtPayeeLocal";

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        Element dsElement = null;
        Element debtElement = null;
        Element creditorElement = null;
        String solicitorPayeeFlag = null;
        String caseNumber = null;
        String partyRoleCode = null;
        String casePartyNo = null;
        String solicitorRef = null;
        Element payeeElement = null;

        dsElement = pDocParams.getRootElement ();

        debtElement = dsElement.getChild ("Debt");
        creditorElement = debtElement.getChild ("Creditor");
        if (creditorElement != null)
        {
            solicitorPayeeFlag = creditorElement.getChild ("SolicitorPayeeFlag").getValue ();
            if (solicitorPayeeFlag.equals ("Y"))
            {
                // Extract the first part of the Primary Key.
                // (Although the flag may be Y, if the primary is not present, there
                // will be no Payee to retrieve).
                caseNumber = creditorElement.getChild ("PayeeCaseNumber").getValue ();
                if ( !caseNumber.equals (""))
                {
                    // Extract the other Primary Key values.
                    partyRoleCode = creditorElement.getChild ("PayeePartyRoleCode").getValue ();
                    casePartyNo = creditorElement.getChild ("PayeeCasePartyNo").getValue ();
                    solicitorRef = creditorElement.getChild ("SolicitorReference").getValue ();
                    // Call the retrieval service.
                    payeeElement = mGetCoDebtPayee (caseNumber, partyRoleCode, casePartyNo, solicitorRef);

                    // Incorporate the result into the XML document.
                    debtElement.addContent (payeeElement);
                }
            }
        } // if (creditorElement != null)

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to get co debt payee details.
     *
     * @param pCaseNumber the case number
     * @param pPartyRoleCode the party role code
     * @param pCasePartyNo the case party no
     * @param solicitorRef the solicitor ref
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetCoDebtPayee (final String pCaseNumber, final String pPartyRoleCode, final String pCasePartyNo,
                                     final String solicitorRef)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element debtElement = null;
        Element payeeElement = null;
        Element paramsElement = null;
        Element dsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
            XMLBuilder.addParam (paramsElement, "partyRoleCode", pPartyRoleCode);
            XMLBuilder.addParam (paramsElement, "casePartyNo", pCasePartyNo);
            XMLBuilder.addParam (paramsElement, "solicitorRef", solicitorRef);

            // Call the service.
            dsElement = invokeLocalServiceProxy (CO_SERVICE, GET_CO_DEBT_PAYEE_METHOD, inputDoc).getRootElement ();
            debtElement = dsElement.getChild ("Debt");
            payeeElement = debtElement.getChild ("Payee");
            payeeElement = (Element) payeeElement.detach ();
        }
        finally
        {
            debtElement = null;
            paramsElement = null;
            dsElement = null;
        }

        return payeeElement;
    } // mGetCoDebtPayee()

} // class GetCoDebtPayeeCustomProcessor
