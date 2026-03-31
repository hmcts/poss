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
package uk.gov.dca.caseman.case_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.ccbc_service.java.CCBCHelper;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * Processes each Judgment record sent to see if CCBC MCOL updates required.
 */
public class UpdateCaseEvent160ResultRefusedCustomProcessor extends AbstractCustomProcessor
{
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public UpdateCaseEvent160ResultRefusedCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element dataElement = null;
        List<Element> judgmentElementList = null;
        XMLOutputter xmlOutputter = null;
        Element judgmentElement = null;
        String caseNumber = "";

        try
        {
            dataElement = pDocParams.getRootElement ();
            caseNumber = ((Element) XPath.selectSingleNode (dataElement, "//CaseNumber")).getText ();

            judgmentElementList = XPath.selectNodes (dataElement, "//Judgment");

            for (Iterator<Element> x = judgmentElementList.iterator (); x.hasNext ();)
            {
                judgmentElement = (Element) x.next ();

                /* Check to see if the Event 160 needs an update */
                if (mCheckIfEventNeedsUpdate (judgmentElement))
                {
                    // Handle CCBC/MCOL updates
                    mCCBCUpdates (judgmentElement, caseNumber);

                } // if(mCheckIfEventNeedsUpdate(judgmentElement)){
            } // for
            /* Output the original XML. */
            xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (dataElement);
            pWriter.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Check to see if need to update the event 160.
     *
     * @param pSetAsideResult Result of application to set aside
     * @return True if the result was refused, else false
     */
    private boolean mCheckIfEventNeedsUpdate (final Element pSetAsideResult)
    {
        Element resultFlagElement = null;
        String elementText = null;
        boolean updateRequired = false;

        resultFlagElement = pSetAsideResult.getChild ("UpdateEvent160");

        if (resultFlagElement != null)
        {
            elementText = resultFlagElement.getText ();
            if (elementText != null && elementText.equals ("Y"))
            {
                updateRequired = true;
            }

        }
        return updateRequired;

    } // mCheckIfEventNeedsUpdate()

    /**
     * Handles the creation of MCOL_DATA notifications for the application to set aside result
     * being set to REFUSED.
     * 
     * @param pJudgmentElement Judgment element
     * @param pCaseNumber Case number
     * @throws BusinessException Business Exception
     * @throws SystemException System Exception
     * @throws JDOMException JDOMException
     */
    private void mCCBCUpdates (final Element pJudgmentElement, final String pCaseNumber)
        throws BusinessException, SystemException, JDOMException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.appToSetAsideResultRefusedMCOLProcessing (pJudgmentElement, pCaseNumber);
    }

} // class InsertCaseEventRow
