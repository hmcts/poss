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
package uk.gov.dca.caseman.wp_output_service.classes;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.content.ContentProxy;
import uk.gov.dca.db.content.ContentProxyFactory;
import uk.gov.dca.db.content.Document;
import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent2;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryEngineException;

/**
 * Returns a document from the store.
 * Configuration:
 *
 * <DocumentService get="/params/param[@name='document-id']"
 * save="/params/param[@name='xml-document']">
 * <DocumentManager> doc manager id </DocumentManager>
 * <ContentStore> content store id </ContentStore>
 * </DocumentService>
 *
 * Created on Aug 11, 2005
 *
 * @author GrantM
 */
public class DocumentService extends AbstractComponent2 implements IGenerator
{

    /** The m get X path. */
    private String m_getXPath = null;
    
    /** The m save X path. */
    private String m_saveXPath = null;
    
    /** The m doc manager. */
    private uk.gov.dca.db.content.DocumentManager m_docManager = null;
    
    /** The m content store. */
    private ContentProxyFactory m_contentStore = null;
    
    /** The m doc manager id. */
    private String m_docManagerId = null;
    
    /** The m content store id. */
    private String m_contentStoreId = null;
    
    /** The Constant XML_HEADER. */
    private static final String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";

    /**
     * {@inheritDoc}
     */
    protected void process () throws BusinessException, SystemException
    {
        final org.jdom.Document parameters = (org.jdom.Document) this.m_inputData.getData (org.jdom.Document.class);

        try
        {
            final Element getElement =
                    (Element) XPath.selectSingleNode (parameters, "/params/param[@name='document-id']"); // m_getXPath);
            if (getElement != null)
            {
                final String documentId = getElement.getText ();
                // get document
                getDocument (Long.parseLong (documentId));
            }
            else
            {
                final Element saveElement =
                        (Element) XPath.selectSingleNode (parameters, "/params/param[@name='xml-document']"); // m_saveXPath);
                if (saveElement != null)
                {
                    saveDocument ((Element) saveElement.getContent ().get (0));
                }
                else
                {
                    throw new BusinessException ("Neither a get nor save document requested");
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Error processing input: " + e.getMessage (), e);
        }
    }

    /**
     * (non-Javadoc).
     *
     * @param methodId the method id
     * @param handler the handler
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String,
     *      uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate (final String methodId, final QueryEngineErrorHandler handler,
                          final Element processingInstructions, final Map<String, Object> preloadCache)
        throws SystemException
    {
        readProcessingInstructions (processingInstructions, preloadCache);
        validateConfig (methodId + ": ", handler);
    }

    /**
     * (non-Javadoc).
     *
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache (final Element processingInstructions, final Map<String, Object> preloadCache)
    {
        // nothing to preload
    }

    /**
     * (non-Javadoc).   
     *
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare (final Element processingInstructions, final Map<String, Object> preloadCache) throws SystemException
    {
        readProcessingInstructions (processingInstructions, preloadCache);
        validateConfig ("", null);

        m_docManager = (DocumentManager) preloadCache.get (m_docManagerId);
        m_contentStore = (ContentProxyFactory) preloadCache.get (m_contentStoreId);

        if (m_docManager == null)
        {
            throw new SystemException ("Unable to find document manager with id: " + m_docManagerId);
        }

        if (m_contentStore == null)
        {
            throw new SystemException ("Unable to find content store with id: " + m_contentStore);
        }
    }

    /**
     * Method to initialise the class from the processing instructions.
     *
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     */
    private void readProcessingInstructions (final Element processingInstructions, final Map<String, Object> preloadCache)
    {
        // read in config
        m_getXPath = processingInstructions.getAttributeValue ("get");
        m_saveXPath = processingInstructions.getAttributeValue ("save");
        m_docManagerId = processingInstructions.getChildText ("DocumentManager");
        m_contentStoreId = processingInstructions.getChildText ("ContentStore");
    }

    /**
     * Validates the config of the object.
     *
     * @param msgPreface the msg preface
     * @param handler the handler
     * @throws ConfigurationException the configuration exception
     * @throws QueryEngineException the query engine exception
     */
    private void validateConfig (final String msgPreface, final QueryEngineErrorHandler handler)
        throws ConfigurationException, QueryEngineException
    {
        if (m_getXPath == null || m_getXPath.length () == 0)
        {
            raiseError ("No 'get' xpath for document id configured", handler);
        }
        if (m_getXPath == null || m_getXPath.length () == 0)
        {
            raiseError ("No 'save' xpath for xml document configured", handler);
        }
        if (m_docManagerId == null || m_docManagerId.length () == 0)
        {
            raiseError ("No document manager id configured", handler);
        }
        if (m_contentStoreId == null || m_contentStoreId.length () == 0)
        {
            raiseError ("No content store id configured", handler);
        }
    }

    /**
     * Raise error as exeption or via validation error handler, as appropriate.
     *
     * @param msg the msg
     * @param handler the handler
     * @throws ConfigurationException the configuration exception
     * @throws QueryEngineException the query engine exception
     */
    private void raiseError (final String msg, final QueryEngineErrorHandler handler)
        throws ConfigurationException, QueryEngineException
    {
        if (handler == null)
        {
            throw new ConfigurationException (msg);
        }
        handler.raiseError (msg);
    }

    /**
     * Gets the document (no it doesn't).
     *
     * @param documentId the document id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void getDocument (final long documentId) throws BusinessException, SystemException
    {
        // try to fetch the document
        final Document doc = m_docManager.load (documentId);
        if (doc == null)
        {
            throw new BusinessException ("Unable to create document with id '" + documentId + "'");
        }

        // now get the documents' content
        final ContentProxy content = m_contentStore.load (doc.getContentStoreId ());
        if (content == null)
        {
            throw new BusinessException ("Unable to load content for document with id '" + documentId + "'");
        }

        // output doc
        final ByteArrayOutputStream os = new ByteArrayOutputStream ();
        content.read (os);

        final Writer writer = new StringWriter ();
        try
        {
            writer.write (XML_HEADER);
            writer.write (os.toString ("UTF-8"));
        }
        catch (final IOException e)
        {
            throw new SystemException ("Failed to write output: " + e.getMessage (), e);
        }
        this.m_outputData.setData (writer, Writer.class);
    }

    /**
     * Save document.
     *
     * @param document the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void saveDocument (final Element document) throws BusinessException, SystemException
    {
        if (document == null)
        {
            throw new BusinessException ("No input document");
        }

        final ContentProxy proxy = m_contentStore.create ();
        proxy.open (ContentProxy.READ_WRITE_MODE);
        final OutputStream out = proxy.getOutput ();

        final XMLOutputter outputter = new XMLOutputter ();
        try
        {
            outputter.output (document, out);
            out.flush ();
            out.close ();
        }
        catch (final IOException e)
        {
            throw new SystemException ("Failed to write to content store: " + e.getMessage (), e);
        }

        final Document doc = m_docManager.create ((String) m_context.getSystemItem (IComponentContext.USER_ID_KEY),
                (String) m_context.getSystemItem (IComponentContext.COURT_ID_KEY), "XML", "text/xml", false, true, 0,
                String.valueOf (proxy.getId ()));

        final Writer writer = new StringWriter ();
        try
        {
            writer.write (XML_HEADER);
            writer.write ("<Document>" + doc.getId () + "</Document>");
        }
        catch (final IOException e)
        {
            throw new SystemException ("Failed to write to output: " + e.getMessage (), e);
        }
        this.m_outputData.setData (writer, Writer.class);
    }
}
