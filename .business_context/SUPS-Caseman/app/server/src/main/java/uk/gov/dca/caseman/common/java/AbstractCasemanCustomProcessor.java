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
package uk.gov.dca.caseman.common.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor2;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Class: CasemanAbstractCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 04-Nov-2005
 *         Description:
 *         Subclass of the framework class with additional methods, to simply calling local services.
 *
 *         Change History:
 *         25-Apr-2006 Phil Haferer:
 *         Made class attribute "localServiceProxy" into local variable
 *         (As per TD 3050 - "CasemanAbstractCustomProcessor.java (701c) - localProxy should be method not instance
 *         variable").
 *         Removed the try/finally null construct from all methods.
 *         (As per TD 3054 - "InsertManageCaseCaseEventsCustomProcessor.java (701c) - try/finally").
 */
public abstract class AbstractCasemanCustomProcessor extends AbstractCustomProcessor2
{
    
    /**
     * (non-Javadoc).
     *
     * @param pInput the input
     * @param pOutput the output
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.AbstractCustomProcessor2#process(uk.gov.dca.db.pipeline.component_input.ComponentInput,
     *      uk.gov.dca.db.pipeline.component_input.ComponentInput, org.apache.commons.logging.Log)
     */
    public void process (final ComponentInput pInput, final ComponentInput pOutput, final Log pLog)
        throws BusinessException, SystemException
    {
        Document inputDoc = null;
        Document outputDoc = null;

        inputDoc = (Document) pInput.getData (Document.class);
        outputDoc = process (inputDoc, pLog);
        pOutput.setData (outputDoc, Document.class);

        return;
    } // process()

    /**
     * You need to override this method in the sub class.
     *
     * @param pDocParams The parameters document.
     * @param pLog The log object.
     * @return The processed parameters document.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public abstract Document process (Document pDocParams, Log pLog) throws SystemException, BusinessException;

    /**
     * (non-Javadoc)
     * Invokes a service.
     *
     * @param pJndiName the jndi name
     * @param pMethodName the method name
     * @param pInputDoc the input doc
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected Document invokeLocalServiceProxy (final String pJndiName, final String pMethodName,
                                                final Document pInputDoc)
        throws BusinessException, SystemException
    {
        Document outputDoc = null;
        ComponentInput inputHolder = null;
        ComponentInput outputHolder = null;
        SupsLocalServiceProxy2 localServiceProxy = null;

        inputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());
        inputHolder.setData (pInputDoc, Document.class);
        outputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());

        localServiceProxy = new SupsLocalServiceProxy2 ();
        localServiceProxy.invoke (pJndiName, pMethodName + "2", this.m_context, inputHolder, outputHolder);

        outputDoc = (Document) outputHolder.getData (Document.class);

        return outputDoc;
    } // invokeLocalServiceProxy()

} // class CasemanAbstractCustomProcessor
