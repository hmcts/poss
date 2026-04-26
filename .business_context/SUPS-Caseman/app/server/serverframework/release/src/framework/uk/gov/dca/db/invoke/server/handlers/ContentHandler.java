/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.invoke.server.handlers;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.cache.ApplicationCache;
import uk.gov.dca.db.content.ContentProxy;
import uk.gov.dca.db.content.ContentProxyFactory;
import uk.gov.dca.db.content.Document;
import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;
import uk.gov.dca.db.security.InvalidUserSessionException;
import uk.gov.dca.db.security.SecurityService;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * A Servlet used for rendering content from the content store.
 * 
 * @author Michael Barker
 * 
 */
public class ContentHandler extends DefaultHttpGetRequestHandler {

    private static final long serialVersionUID = -2392441133062931706L;

    private final static String CONTENT_ID_PARAM = "DocumentId";

    private final static Log log = SUPSLogFactory.getLogger(ContentHandler.class);
    private ContentProxyFactory factory;
    private DocumentManager dMgr;

    private long getLong(HttpServletRequest req, String name) throws SystemException {
        String itemValue = req.getParameter(name);
        if (itemValue != null) {
            try {
                return Long.parseLong(itemValue);
            } catch (NumberFormatException e) {
                throw new SystemException(name + " is not a valid number: " + itemValue);
            }
        } else {
            throw new SystemException(name + " is not specified");
        }
    }

    /*
     * 
     * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateResponse()
     */
    public void decorateResponse(RequestContext ctx, boolean satisfiedRequest) throws SystemException, BusinessException {

        ContentProxy content = null;
        try {
            
            if(log.isDebugEnabled()){
                log.debug("Loading ConfigUtil from ApplicationCache");
            }
            ConfigUtil config = (ConfigUtil)ApplicationCache.getInstance().get(ConfigUtil.APPLICATION_CONFIG_CONFIG_KEY);
            String securityStatus = (String) config
            .get(SupsConstants.SECURITY_STATUS_ID);
            boolean isSecurityActive = (securityStatus == null || !"INACTIVE"
                    .equals(securityStatus.toUpperCase()));
            if (isSecurityActive){
                authenticate(ctx);
            }

            factory = (ContentProxyFactory) config.get(SupsConstants.CONTENT_STORE_ID);
            dMgr = (DocumentManager) config.get(SupsConstants.DOCUMENT_MANAGER_ID);
            
            long documentId = getLong(ctx.getRequest(), ContentHandler.CONTENT_ID_PARAM);
            Document doc = dMgr.load(documentId);
            
            String contentId = doc.getContentStoreId();
            String mimeType = doc.getMimeType();
            String metaData = doc.getMetadata();

            content = factory.load(contentId);

            ctx.setResponseMimeType(mimeType);
            ctx.setContentLength(1024);
            
            if ( null != metaData && metaData.length() > 0 )
            {
            	org.w3c.dom.Document dom = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new InputSource(new StringReader(metaData)));
                NodeList headerNodes = dom.getElementsByTagName("document-header");
                for ( int i=0; i<headerNodes.getLength(); i++ )
                {
                	Node headerNode = headerNodes.item(i);
                	if ( headerNode.getNodeType() == Node.ELEMENT_NODE )
                	{
                		Element headerElement = (Element)headerNode;
                		
                		NodeList typeList = headerElement.getElementsByTagName("type");
                		Element headerTypeElement = (Element)typeList.item(0);
                		NodeList textTypeList = headerTypeElement.getChildNodes();
                		String headerType = ((Node)textTypeList.item(0)).getNodeValue();
                		
                		NodeList valueList = headerElement.getElementsByTagName("value");
                		Element headerValueElement = (Element)valueList.item(0);
                		NodeList textValueList = headerValueElement.getChildNodes();
                		String headerValue = ((Node)textValueList.item(0)).getNodeValue();
                		
                		ctx.setResponseHeader(headerType,headerValue);
                	}
                }
            }
            
			OutputStream out = ctx.getOutputStream();
            content.read(out);
            out.flush();
            
            doc.setViewed(true);
            dMgr.save(doc);

        } catch (IOException e) {
            throw new SystemException("Unable to process output");
        } catch (ParserConfigurationException e) {
            throw new SystemException("Unable to process output");
        } catch (SAXException e) {
            throw new SystemException("Unable to process output");
        } finally {
            if (content != null) {
                content.close();
            }
             // do not create the session if it does not already exist remove the session if it did exist            
            HttpSession session = ctx.getRequest().getSession(false); 
            if (session != null) {
                session.invalidate();
            }
        }
    }

    /*
     * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateRequest()
     */
    public void decorateRequest(RequestContext ctx) {

    }
    
    /**
     * Checks wheter the user is authenticated.
     * 
     * @param req
     * @throws SystemException
     * @throws BusinessException
     */
    private void authenticate(RequestContext ctx)
            throws SystemException, BusinessException {
            String user = getString(ctx.getRequest(), "user");
            String mac = getString(ctx.getRequest(), "mac");
            String contentIdStr = getString(ctx.getRequest(), CONTENT_ID_PARAM);
            log.debug("Looking up security service");
            SecurityService security = (SecurityService) ServiceLocator
                    .getInstance().getService("ejb/SecurityServiceLocal");
            if (!security.validateMAC(user, mac, contentIdStr)) {
                throw new InvalidUserSessionException(
                        "Failed validation of message authentication code", mac);
            }
    }
    
    /**
     * Gets a string from the supplied request and throws an exception if
     * it is not specified.
     * 
     * @param req
     * @param name
     * @return
     * @throws SystemException
     */
    private String getString(HttpServletRequest req, String name)
            throws SystemException {
        String value = req.getParameter(name);
        if (value != null) {
            return value;
        } else {
            throw new SystemException(name + " is not specified");
        }
    }
}
