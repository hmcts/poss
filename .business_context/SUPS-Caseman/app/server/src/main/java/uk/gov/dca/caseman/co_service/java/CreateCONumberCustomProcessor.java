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

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.CourtHelper;
import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.system_data_service.java.SequenceNumberHelper;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Co
 * Method: addCo()
 * Class: CreateCONumberCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 16-Aug-2005
 *         Description:
 *         CO Numbers are of the format: YYnnnnXX
 *         Where YY = Current year (eg 05).
 *         nnnn = Next sequence for the current Court.
 *         XX = Court Id.
 *         The addCo()'s XML document is passed into this Custom Processor
 *         with a new Sequence Number already inserted into at the location,
 *         /ds/MaintainCO/CONumber
 *         This class them adds the YY and the XX to either end of this Sequence Number.
 * 
 *         Change History:
 *         17-Nov-2005 Phil Haferer: Added call to mUpdateCoEventEventsCoNumbers() in response to
 *         TD 1803: MAINTAIN CO: No automatic Case Event 705 created for selected Case/Creditor during CO creation.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class CreateCONumberCustomProcessor extends AbstractCasemanCustomProcessor
{
    
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
        String systemDate = null;
        String yearPrefix = null;
        String adminCourtCode = null;
        String sequenceNumber = null;
        StringBuffer formattingBuffer = null;
        String formatedSequenceNumber = null;
        String courtCode = null;
        String courtIdSuffix = null;
        StringBuffer coNumber = null;

        try
        {
            dsElement = pDocParams.getRootElement ();

            // Get the Year (YY).
            systemDate = SystemDateHelper.getSystemDate ();
            yearPrefix = systemDate.substring (2, 4);

            // Get the generated CO Sequence Number (nnnn).
            adminCourtCode =
                    XMLBuilder.getXPathValue (dsElement, "/params/param[@name='co']/ds/MaintainCO/OwningCourtCode");
            sequenceNumber = SequenceNumberHelper.getNextValueCommitted (/* String pAdminCourtCode */adminCourtCode,
                    /* String pItem */"CO", /* IComponentContext pContext */this.m_context);

            // Pad the Sequence Number with 0's.
            formattingBuffer = new StringBuffer ();
            formattingBuffer.append ("0000");
            formattingBuffer.append (sequenceNumber);
            formatedSequenceNumber = formattingBuffer.substring (formattingBuffer.length () - 4);

            // Get the Court Id (XX).
            courtCode = XMLBuilder.getXPathValue (dsElement, "/params/param[@name='co']/ds/MaintainCO/OwningCourtCode");
            courtIdSuffix = CourtHelper.GetCourtId (courtCode);

            // Concatentate all the elements of the CO Number (YY + nnnn + XX).
            coNumber = new StringBuffer ();
            coNumber.append (yearPrefix);
            coNumber.append (formatedSequenceNumber);
            coNumber.append (courtIdSuffix);

            // Insert the new CO Number into the XML document.
            XMLBuilder.setXPathValue (dsElement, "/params/param[@name='co']/ds/MaintainCO/CONumber",
                    coNumber.toString ());

            // Update any CoCaseEvents with the CO Number.
            mUpdateCoEventEventsCoNumbers (dsElement, coNumber.toString ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Iterate through co case event list, assigning co numbers.
     *
     * @param pDsElement the ds element
     * @param pCoNumber the co number
     * @throws JDOMException the JDOM exception
     */
    private void mUpdateCoEventEventsCoNumbers (final Element pDsElement, final String pCoNumber) throws JDOMException
    {
        Element coCaseEventsElement = null;
        List<Element> coCaseEventsElementList = null;
        Element coCaseEventElement = null;

        try
        {
            coCaseEventsElement = (Element) XPath.selectSingleNode (pDsElement, "//CoCaseEvents");
            if (null != coCaseEventsElement)
            {
                coCaseEventsElementList = coCaseEventsElement.getChildren ();

                // Iterate through the list, assigning a value to the CoNumber for each node.
                for (Iterator<Element> i = coCaseEventsElementList.iterator (); i.hasNext ();)
                {
                    coCaseEventElement = (Element) i.next ();
                    coCaseEventElement.getChild ("CoNumber").setText (pCoNumber);
                } // for(Iterator i = ...
            } // if (null != coCaseEventsElement)
        }
        finally
        {
            coCaseEventsElement = null;
            coCaseEventsElementList = null;
            coCaseEventElement = null;
        }
    } // mUpdateCoEventEventsCoNumbers()

} // class CreateCONumberCustomProcessor
