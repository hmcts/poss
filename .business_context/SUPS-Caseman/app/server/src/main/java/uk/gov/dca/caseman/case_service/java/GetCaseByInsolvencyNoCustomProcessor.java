/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 708 $
 * $Author: mullangisa $
 * $Date: 2008-10-02 11:02:08 +0100 (Thu, 02 Oct 2008) $
 * $Id: GetCaseByInsolvencyNoCustomProcessor.java 708 2008-10-02 10:02:08Z mullangisa $
 *
 ******************************************************************************/

/**
 * @change Initial version of service to chain getCaseNumberFromInsolvancy and getCase
 * @author Struan Kerr-Liddell
 * @version 0.1 July 16, 2008
 */
package uk.gov.dca.caseman.case_service.java;

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
 * The Class GetCaseByInsolvencyNoCustomProcessor.
 */
public class GetCaseByInsolvencyNoCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * {@inheritDoc}
     */
    public Document process (final Document docParams, final Log log) throws SystemException, BusinessException
    {

        final Document caseNumberDoc =
                invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_NO_FROM_INSOLVENCY_NO, docParams);

        Element caseNumberElement = null;
        try
        {
            if (caseNumberDoc != null)
            {
                caseNumberElement =
                        (Element) XPath.selectSingleNode (caseNumberDoc, "/InsolvencyNumber/Case/CASENUMBER");
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        if (caseNumberElement == null)
        {
            return new Document (new Element ("ds"));
        }

        final String caseNumber = caseNumberElement.getText ();

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);

        return invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE, inputDoc);
    }

}
