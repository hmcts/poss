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
package uk.gov.dca.caseman.obligation_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 03-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 25-Jul-2006 Paul Roberts: Logging. Remove unused variables.
 *
 * @author Amjad Khan
 */
public class ObligationSequenceHelperCustomProcessor extends AbstractCasemanCustomProcessor
{
    /**
     * Obligation service name.
     */
    public static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * Get obligation sequence method name.
     */
    public static final String GET_OBLIGATION_SEQUENCE = "determineObligationLocal";

    /** The case number path. */
    private final XPath caseNumberPath;
    
    /** The obligation path. */
    private final XPath obligationPath;
    
    /** The obligation seq path. */
    private final XPath obligationSeqPath;
    
    /** The obligation param sequence path. */
    private final XPath obligationParamSequencePath;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ObligationSequenceHelperCustomProcessor.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public ObligationSequenceHelperCustomProcessor () throws JDOMException
    {

        caseNumberPath = XPath.newInstance (
                "params/param[@name='caseNumber']/ds/MaintainObligations/Obligations/Obligation/CaseNumber");
        obligationParamSequencePath = XPath.newInstance ("/ds/ObligationSequence");
        obligationPath =
                XPath.newInstance ("params/param[@name='caseNumber']/ds/MaintainObligations/Obligations/Obligation");
        obligationSeqPath = XPath.newInstance (
                "params/param[@name='caseNumber']/ds/MaintainObligations/Obligations/Obligation/ObligationSeq");
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        try
        {
            final Object input = caseNumberPath.selectSingleNode (params);
            log.debug ("Input class type = " + input.getClass ());
            final String caseNumber = ((Element) input).getText ();
            Element obligationResult = null;

            if ( !isEmpty (caseNumber))
            {
                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);

                obligationResult = invokeLocalServiceProxy (OBLIGATION_SERVICE, GET_OBLIGATION_SEQUENCE,
                        paramsElement.getDocument ()).getRootElement ();

                final Element obligationSequenceElement =
                        (Element) obligationParamSequencePath.selectSingleNode (obligationResult);

                final String objSeq;

                if (isEmpty (obligationSequenceElement.getText ()))
                {
                    objSeq = "1";
                }
                else
                {
                    objSeq = obligationSequenceElement.getText ();
                }

                final Element obligationObjSequenceElement = (Element) obligationPath.selectSingleNode (params);
                Element obligationSeqElement = (Element) obligationSeqPath.selectSingleNode (params);
                if (obligationSeqElement == null)
                {
                    // If we don't find the node then create a new one and add it to the document
                    obligationSeqElement = new Element ("ObligationSeq");
                    obligationObjSequenceElement.addContent (obligationSeqElement);
                }
                obligationSeqElement.setText (objSeq);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }

        return params;
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }
}
