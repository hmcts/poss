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
 * Class: UpdateJudgmentsCustomProcessor.java
 * Description: If the newly added warrant is an execution warrant, set the warrantID on
 * the associated judgments
 * Service: Warrant
 * Method: addWarrant
 * 
 * Created: 27-July-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         23-Jun-2006 Defect 3693 - should not call updateJudgment for a foreign warrant
 *         as there is no Judgment to update
 *         11-Dec-2013 Chris Vincent: Included CONTROL warrants in if statement. Trac 5025
 *
 */
public class UpdateJudgmentsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public UpdateJudgmentsCustomProcessor ()
    {
        super ();
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
            final Element warrantElement = (Element) XPath.selectSingleNode (params, "/ds/Warrant");

            final String warrantType = warrantElement.getChildText ("WarrantType");

            if (warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL"))
            {
                final String warrantID = warrantElement.getChildText ("WarrantID");

                String judgmentID1 = null;
                Element e = (Element) XPath.selectSingleNode (params, "/ds/Warrant/Defendant1/JudgmentID");
                if (e != null)
                {
                    judgmentID1 = e.getText ();
                }

                String judgmentID2 = null;
                e = (Element) XPath.selectSingleNode (params, "/ds/Warrant/Defendant2/JudgmentID");
                if (e != null)
                {
                    judgmentID2 = e.getText ();
                }

                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "warrantID", warrantID);
                XMLBuilder.addParam (paramsElement, "judgmentID1", judgmentID1);
                XMLBuilder.addParam (paramsElement, "judgmentID2", judgmentID2);

                // decide at this point whether to call the service
                // if there are no judgments there is nothing to update
                if ( !(judgmentID1.equals ("") && judgmentID2.equals ("")))
                {
                    this.invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "addWarrantUpdateJudgmentsLocal",
                            paramsElement.getDocument ());
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }
}