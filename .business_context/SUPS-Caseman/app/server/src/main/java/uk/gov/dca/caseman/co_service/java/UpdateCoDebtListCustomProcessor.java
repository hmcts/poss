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
 * Method: addCo()/updateCo()/updateCoDebtList()
 * Class: UpdateCoDebtListCustomProcessor.java
 * Created: 19-Aug-2005
 * Description:
 * Calls the updateCoDebtList() service as an "add-on" update on the end of another service.
 * 
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Phil Haferer
 */
public class UpdateCoDebtListCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant UPDATE_CO_DEBT_LIST_METHOD. */
    private static final String UPDATE_CO_DEBT_LIST_METHOD = "updateCoDebtListLocal";

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

        dsElement = pDocParams.getRootElement ();

        // Call the service to update the list of Debts.
        dsElement = mUpdateCoDebtList ((Element) dsElement.detach ());

        pDocParams.setRootElement (dsElement);

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to update the co debt list.
     *
     * @param pDsElement the ds element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mUpdateCoDebtList (final Element pDsElement) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "co", pDsElement);

            // Call the service.
            dsElement = invokeLocalServiceProxy (CO_SERVICE, UPDATE_CO_DEBT_LIST_METHOD, inputDoc).getRootElement ();
            dsElement.detach ();
        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return dsElement;
    } // mGetCoDebtList()

} // class UpdateCoDebtListCustomProcessor
