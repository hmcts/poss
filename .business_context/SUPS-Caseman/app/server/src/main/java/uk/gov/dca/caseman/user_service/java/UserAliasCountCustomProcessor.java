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
package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 08-Mar-2006
 *
 * Change History:
 * 16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author kznwpr
 */
public class UserAliasCountCustomProcessor implements ICustomProcessor
{

    /** The Constant ALIAS_IN_USE_ERROR_CODE. */
    private static final String ALIAS_IN_USE_ERROR_CODE = "CaseMan_AliasInUse";
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (UserAliasCountCustomProcessor.class);

    /**
     * Constructor.
     */
    public UserAliasCountCustomProcessor ()
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param pLog the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log pLog) throws SystemException
    {
        try
        {
            // Get the root element of the sql lite query that has already run.
            final Element sqlLiteRoot = document.getRootElement ();

            String errorCode = null;

            // If the root element has a child then this means that the alias that was searched for
            // is already in use by another user and so we need to return a document that contains an error.
            if (sqlLiteRoot.getChildren ().size () == 0)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug (
                            "Empty result set so the alias is not found to be in use so no error code returned to client.");
                }
            }
            else
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Non empty result so alias already in use and so error code returned to client.");
                }
                errorCode = ALIAS_IN_USE_ERROR_CODE;
            }

            final Element root = buildErrorCodeDocument (log, errorCode);

            // Write the resulting xml which contains the entire dom to be sent to the client
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String xmlString = xmlOutputter.outputString (root);
            writer.write (xmlString);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * Build the document that will be returned to the client. Depending on whether the alias is
     * already in use the document will either contain an error code or that element will be empty
     *
     * @param log the log
     * @param errorCodeText the error code text
     * @return The error code element.
     */
    public Element buildErrorCodeDocument (final Log log, final String errorCodeText)
    {
        final Element root = new Element ("Root");
        final Element errorCode = new Element ("ErrorCode");
        errorCode.setText (errorCodeText);
        root.addContent (errorCode);

        if (log.isDebugEnabled ())
        {
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String xmlString = xmlOutputter.outputString (root);
            log.debug (xmlString);
        }
        return root;
    }
}
