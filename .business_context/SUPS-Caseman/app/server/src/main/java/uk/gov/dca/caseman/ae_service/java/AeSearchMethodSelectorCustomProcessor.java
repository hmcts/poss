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
package uk.gov.dca.caseman.ae_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 25-Feb-2005
 * 
 * 4 sept 07 Chris Hutt (EDS):.
 *
 * @author gzyysf
 */
public class AeSearchMethodSelectorCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant AE_SERVICE. */
    private static final String AE_SERVICE = "ejb/AeServiceLocal";

    /** The Constant SEARCH_AE_BY_CT. */
    public static final String SEARCH_AE_BY_CT = "searchAeByCtLocal";
    
    /** The Constant SEARCH_AE_BY_CT_CASE_AE. */
    public static final String SEARCH_AE_BY_CT_CASE_AE = "searchAeByCtCaseAeLocal";
    
    /** The Constant SEARCH_AE_BY_CT_CASE. */
    public static final String SEARCH_AE_BY_CT_CASE = "searchAeByCtCaseLocal";
    
    /** The Constant SEARCH_AE_BY_CT_AE. */
    public static final String SEARCH_AE_BY_CT_AE = "searchAeByCtAeLocal";
    
    /** The Constant SEARCH_AE_BY_CASE. */
    public static final String SEARCH_AE_BY_CASE = "searchAeByCaseLocal";
    
    /** The Constant SEARCH_AE_BY_CASE_AE. */
    public static final String SEARCH_AE_BY_CASE_AE = "searchAeByCaseAeLocal";
    
    /** The Constant SEARCH_AE_BY_AE. */
    public static final String SEARCH_AE_BY_AE = "searchAeByAeLocal";

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
        Element crdResultRootElement = null;
        Document resultDoc = null;

        try
        {

            final Element dsElement = pDocParams.getRootElement ();

            final String owningCourtCode =
                    XMLBuilder.getXPathValue (dsElement, "/params/param[@name='owningCourtCode']");
            final String caseNumber = XMLBuilder.getXPathValue (dsElement, "/params/param[@name='caseNumber']");
            final String aeNumber = XMLBuilder.getXPathValue (dsElement, "/params/param[@name='aeNumber']");

            String mthd = "";

            if ( !owningCourtCode.equals ("") && caseNumber.equals ("") && aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_CT;
            }

            if ( !owningCourtCode.equals ("") && !caseNumber.equals ("") && !aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_CT_CASE_AE;
            }

            if ( !owningCourtCode.equals ("") && !caseNumber.equals ("") && aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_CT_CASE;
            }

            if ( !owningCourtCode.equals ("") && caseNumber.equals ("") && !aeNumber.equals (""))
            {

                mthd = SEARCH_AE_BY_CT_AE;

            }
            if (owningCourtCode.equals ("") && !caseNumber.equals ("") && !aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_CASE_AE;
            }

            if (owningCourtCode.equals ("") && caseNumber.equals ("") && !aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_AE;
            }

            if (owningCourtCode.equals ("") && !caseNumber.equals ("") && aeNumber.equals (""))
            {
                mthd = SEARCH_AE_BY_CASE;
            }

            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
            XMLBuilder.addParam (paramsElement, "owningCourtCode", owningCourtCode);
            XMLBuilder.addParam (paramsElement, "aeNumber", aeNumber);

            crdResultRootElement =
                    invokeLocalServiceProxy (AE_SERVICE, mthd, paramsElement.getDocument ()).getRootElement ();

            resultDoc = new Document ();

            resultDoc.addContent (((Element) crdResultRootElement.clone ()).detach ());

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return resultDoc;
    } // process()

} // class AeSearchMethodSelectorCustomProcessor
