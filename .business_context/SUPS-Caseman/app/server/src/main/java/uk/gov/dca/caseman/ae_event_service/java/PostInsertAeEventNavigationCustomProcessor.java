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
package uk.gov.dca.caseman.ae_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.sql.SQLException;

import javax.naming.NamingException;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Service: AeEvent
 * Class: PostInsertAeEventNavigationCustomProcessor.java
 * Created: chris hutt 22 july 2005
 * Description:
 * Java class to support navigation form the "Manage Ae Events" screen post Ae Event insert.
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 
 * @author cjh
 */
public class PostInsertAeEventNavigationCustomProcessor implements ICustomProcessor
{
    /**
     * Constructor.
     */
    public PostInsertAeEventNavigationCustomProcessor ()
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param pInsertAeEventDoc the insert ae event doc
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pInsertAeEventDoc, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element aeEventNavigationListElement = null;
        XMLOutputter xmlOutputter = null;
        String sXml = null;
        AeEventNavigationHelper aeEventNavigationHelper = null;

        try
        {

            // Build a Navigation XML Document for the Client.
            aeEventNavigationHelper = new AeEventNavigationHelper ();
            aeEventNavigationListElement =
                    aeEventNavigationHelper.mBuildNavigationXMLElement (pInsertAeEventDoc.getRootElement ());

            // Insert the WP_OUTPUT record if appropriate
            final Element userIdElement = (Element) XPath.selectSingleNode (pInsertAeEventDoc, "/AEEvent/UserName");
            if (null != userIdElement)
            {
                final String userId = userIdElement.getText ();
                aeEventNavigationHelper.mInsertWpOutputRow (aeEventNavigationListElement, userId);
            }

            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (aeEventNavigationListElement);
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
        catch (final SQLException e)
        {
            throw new SystemException (e);
        }
        catch (final NamingException e)
        {
            throw new SystemException (e);
        }

        return;
    } // process()

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
} // class PostInsertAeEventNavigationCustomProcessor
