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

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.system_data_service.java.SequenceNumberHelper;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * Service: Ae
 * Method: addAE()
 * Class: CreateAENumberCustomProcessor.java
 * Author: Tony White
 * Created: 14-Sept-2005
 * Description:
 * AE Numbers are of the format: XXXYNNNN
 * Where 'XXX' = Court Code (eg 111).
 * Y = Enforcement Letter
 * NNNN = Next sequence for the current Court..
 * This class then prefixes the Sequence Number with XXX and Y.
 * 
 * Change History:
 * 14-Mar-2006 Phil Haferer: Introduced a call to SequenceNumberHelper.getNextValue(), having removed the
 * use of a Oracle Sequence Number generator from get_next_ae_id.xml, as this won't generate
 * sequential numbers in the live environment.
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 
 * @author Tony White
 */
public class CreateAENumberCustomProcessor extends AbstractCustomProcessor
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public CreateAENumberCustomProcessor ()
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
     * @see uk.gov.dca.db.pipeline.AbstractCustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element dsElement = null;
        String enforcementLetter = null;
        String sequenceNumber = null;
        String courtCode = null;
        StringBuffer formattingBuffer = null;
        String formatedSequenceNumber = null;
        StringBuffer aeNumber = null;
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {
            dsElement = pDocParams.getRootElement ();

            // Get the Court Id (XXX).
            courtCode = XMLBuilder.getXPathValue (dsElement,
                    "/params/param[@name='newAeNumber']/ds/GenerateAeNumber/OwningCourtCode");

            // Get the current enforcement letter (Y).
            enforcementLetter = getEnforcementLetter ();

            // Get the generated AE Sequence Number (NNNN).
            sequenceNumber = SequenceNumberHelper.getNextValueCommitted (/* String pAdminCourtCode */courtCode,
                    /* String pItem */"AE", /* IComponentContext pContext */this.m_context);

            // Pad the Sequence Number with 0's.
            formattingBuffer = new StringBuffer ();
            formattingBuffer.append ("0000");
            formattingBuffer.append (sequenceNumber);
            formatedSequenceNumber = formattingBuffer.substring (formattingBuffer.length () - 4);

            // Concatentate all the elements of the CO Number (YY + nnnn + XX).
            aeNumber = new StringBuffer ();
            aeNumber.append (courtCode);
            aeNumber.append (enforcementLetter);
            aeNumber.append (formatedSequenceNumber);

            final Document newAeNumber = new Document (new Element ("AeNumber").setText (aeNumber.toString ()));
            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (newAeNumber);
            pWriter.write (sXml);
            pWriter.flush ();
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return;
    } // process()

    /**
     * Gets the enforcement letter.
     *
     * @return the enforcement letter
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public String getEnforcementLetter () throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element dsElement = null;
        String enforcementLetter = null;
        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            dsElement = localServiceProxy.getJDOM ("ejb/AeServiceLocal", "getEnforcementLetterLocal", sXmlParams)
                    .getRootElement ();
            enforcementLetter = dsElement.getChild ("EnforcementLetter").getText ();

        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }
        return enforcementLetter;
    } // getEnforcementLetter()
} // class CreateAENumberCustomProcessor