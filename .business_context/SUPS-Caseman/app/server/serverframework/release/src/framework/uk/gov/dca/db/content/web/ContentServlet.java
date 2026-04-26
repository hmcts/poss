/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.content.web;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.content.ContentProxy;
import uk.gov.dca.db.content.ContentProxyFactory;
import uk.gov.dca.db.content.Document;
import uk.gov.dca.db.content.DocumentManager;
import uk.gov.dca.db.ejb.ExceptionRewriter;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.InvalidUserSessionException;
import uk.gov.dca.db.security.SecurityService;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * A Servlet used for rendering content from the content store.
 * 
 * @author Michael Barker
 *
 */
public class ContentServlet extends HttpServlet {

	private static final long serialVersionUID = -2392441133062931706L;

	private final static String CONTENT_ID_PARAM = "DocumentId";

	private final static Log log = SUPSLogFactory.getLogger(ContentServlet.class);

	private ContentProxyFactory factory;

	private DocumentManager dMgr;

	private ConfigUtil config;

	private boolean isSecurityActive = false;

	private ExceptionRewriter exceptionRewriter = new ExceptionRewriter();

	/**
	 * @see javax.servlet.GenericServlet#init()
	 */
	public void init() throws ServletException {
		super.init();
		String configName = getServletConfig().getInitParameter(
				SupsConstants.SUPS_CONFIG_PARAM);
		try {
			config = ConfigUtil.create(configName);
			factory = (ContentProxyFactory) config
					.get(SupsConstants.CONTENT_STORE_ID);
			dMgr = (DocumentManager) config
					.get(SupsConstants.DOCUMENT_MANAGER_ID);
			String securityStatus = (String) config
					.get(SupsConstants.SECURITY_STATUS_ID);
			isSecurityActive = (securityStatus == null || !"INACTIVE"
					.equals(securityStatus.toUpperCase()));
		} catch (SystemException e) {
			// TODO: Route to an error page.
			log.error("Error initialising ContentServlet: ", e);
			throw new ServletException(e);
		}

	}

	protected void doHead(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Head called");
		process(req, rsp);
	}

	/**     
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Get called");
		process(req, rsp);
	}

	/**
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Post Called");
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Rendering Document");
		ContentProxy content = null;
		try {
			long documentId = getLong(req, "DocumentId");
			Document doc = dMgr.load(documentId);

			// TODO Add authorisation.
			authenticate(req, doc.getUserId());

			String contentId = doc.getContentStoreId();
			String mimeType = doc.getMimeType();

			content = factory.load(contentId);

			rsp.setContentType(mimeType);
			OutputStream out = rsp.getOutputStream();
			content.read(out);
			out.flush();

			doc.setViewed(true);
			dMgr.save(doc);

		} catch (SystemException e) {
			try {
				writeSupsErrorMessage(rsp, e);
			} catch (SystemException se) {
				throw new ServletException(e);
			}
		} catch (BusinessException e) {
			try {
				writeSupsErrorMessage(rsp, e);
			} catch (SystemException se) {
				throw new ServletException(e);
			}
		} finally {
			if (content != null) {
				content.close();
			}
	        HttpSession session = req.getSession(false); // do not create the session if it does not already exist remove the session if it did exist
	        if (session != null) {
	        	session.invalidate();
	        }
		}
	}

	private void writeSupsErrorMessage(HttpServletResponse rsp, Exception e) throws SystemException, UnsupportedEncodingException, IOException {
		final String error = exceptionRewriter.rewrite(e).getMessage();
		final byte[] errorBytes = error.getBytes("UTF-8");
		rsp.setContentType("text/xml");
		rsp.setContentLength(errorBytes.length);
		rsp.getOutputStream().write(errorBytes);
		rsp.getOutputStream().flush();
	}

	/**
	 * Checks wheter the user is authenticated.
	 * 
	 * @param req
	 * @throws SystemException
	 * @throws BusinessException
	 */
	private void authenticate(HttpServletRequest req, String userId)
			throws SystemException, BusinessException {
		log.debug("Security: " + isSecurityActive);
		if (isSecurityActive) {
			String user = getString(req, "user");
			String mac = getString(req, "mac");
			String contentIdStr = getString(req, CONTENT_ID_PARAM);
			log.debug("Looking up security service");
			SecurityService security = (SecurityService) ServiceLocator
					.getInstance().getService("ejb/SecurityServiceLocal");
			if (!security.validateMAC(user, mac, contentIdStr)) {
				throw new InvalidUserSessionException(
						"Failed validation of message authentication code", mac);
			}
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
		String contentIdStr = req.getParameter(name);
		if (contentIdStr != null) {
			return contentIdStr;
		} else {
			// TODO: Route to an error page.            
			throw new SystemException(name + " is not specified");
		}
	}

	private long getLong(HttpServletRequest req, String name)
			throws SystemException {
		String contentIdStr = req.getParameter(name);
		if (contentIdStr != null) {
			try {
				return Long.parseLong(contentIdStr);
			} catch (NumberFormatException e) {
				throw new SystemException(name + " is not a valid number: "
						+ contentIdStr);
			}
		} else {
			// TODO: Route to an error page.            
			throw new SystemException(name + " is not specified");
		}
	}

}
