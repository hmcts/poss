package uk.gov.dca.db.invoke.server;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.cache.ApplicationCache;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.invoke.server.service.EJBServiceDelegate;
import uk.gov.dca.db.invoke.server.service.request.RequestServiceDelegate;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;
import uk.gov.dca.db.util.SUPSLogFactory;
import edu.emory.mathcs.backport.java.util.concurrent.ConcurrentHashMap;

/**
 * @author Imran Patel
 * 
 */
public class RequestDispatcher extends HttpServlet {
    private static final String PING_PARAMETER = "ping";

    //     custom response code which will be recognised by the client
    public static final int FRWK_EXCEPTION_RETURN_CODE = 999; 
    private static final long serialVersionUID = -6484387791367230656L;
    private static final XMLOutputter xmlOutputter = new XMLOutputter();
    private Log log = SUPSLogFactory.getLogger(RequestDispatcher.class);
    private ConcurrentHashMap cache = new ConcurrentHashMap();

    public void init(ServletConfig config) throws ServletException {
        String serviceConfigLocation = config.getInitParameter("serviceConfigLocation");
        log.info("init : entry");

        try {
            ConfigUtil cfg = new ConfigUtil(FrameworkConfigParam.PROJECT_CONFIG.getValue());
            cache.put(ConfigUtil.APPLICATION_CONFIG_CONFIG_KEY, cfg);
        } catch (Exception e) {
            throw new ServletException("Unable to locate Project Configuration file: "
                    + FrameworkConfigParam.PROJECT_CONFIG.getValue(), e);
        }

        try {
            if (serviceConfigLocation != null && !serviceConfigLocation.equals("")) {
                RequestServiceDelegate.loadServiceConfig(serviceConfigLocation);
            }
            EJBServiceDelegate.loadCaches();
        } catch (SystemException ex) {
            throw new ServletException(ex);
        }

        try {
            Properties p = new Properties();
            InputStream propStream = Util.getInputStream("framework.config.properties", new Object());
            p.load(propStream);
            String appName = p.getProperty("sups.project.name");
            SUPSLogFactory.setApplicationName(appName);
        } catch (Exception e) {
            log.error("Unable to load framework.config.properties", e);
        }

        log.info("init: exit");
        super.init(config);
    }

    public void destroy() {
        super.destroy();
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        
        long startTime = 0;
        if (log.isDebugEnabled()) {
            startTime = System.currentTimeMillis();
        }

        ApplicationCache appCache = ApplicationCache.getInstance();
        if (log.isDebugEnabled()) {
            log.debug("Encoding: " + request.getCharacterEncoding());
        }
        try {
            appCache.init(cache);
            RequestServiceDelegate.handleRequest(request, response);
        } catch (BusinessException ex) {
            handleException(response, ex);
        } catch (SystemException se) {
            handleException(response, se);
        } finally {
            appCache.clear();
            // do not create the session if it does not already exist remove the session if it did exist
            HttpSession session = request.getSession(false); 
            if (session != null) {
                session.invalidate();
            }
            if (log.isDebugEnabled()) {
                long timeElapsed = System.currentTimeMillis() - startTime;
                log.debug(Thread.currentThread().getName() + ", RequestDispatcher.doPost() took " + timeElapsed
                        + " milli secs");
            }
        }

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException {

        if (null != request.getParameter(PING_PARAMETER) && !"".equals(request.getParameter(PING_PARAMETER))) {
            ping(request, response);
            return;
        }

        long startTime = 0;
        if (log.isDebugEnabled()) {
            startTime = System.currentTimeMillis();
        }

        ApplicationCache appCache = ApplicationCache.getInstance();

        try {
            appCache.init(cache);
            RequestServiceDelegate.handleRequest(request, response);
        } catch (BusinessException ex) {
            handleException(response, ex);
        } catch (SystemException se) {
            handleException(response, se);
        } finally {
            appCache.clear();
            // do not create the session if it does not already exist remove the session if it did exist
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            if (log.isDebugEnabled()) {
                long timeElapsed = System.currentTimeMillis() - startTime;
                log.debug(Thread.currentThread().getName() + ", RequestDispatcher.doGet() took " + timeElapsed
                        + " milli secs");
            }
        }
    }

    /**
     * @throws ServletException
     * 
     */
    private void handleException(HttpServletResponse response, Exception ex) throws ServletException {

        log.error("Exception Processing Request", ex);
        response.setHeader(RequestServiceDelegate.SUPS_EXCEPTION, "true");
        response.setHeader("Cache-Control", "no-store");
        response.setStatus(FRWK_EXCEPTION_RETURN_CODE);
        try {
            writeResult(response, createErrorResult(ex.getMessage()));
        } catch (IOException e) {
            try {
                e.printStackTrace(response.getWriter());
            } catch (IOException ioe) {
                throw new ServletException(ioe);
            }
        }
    }

    /**
     * @param response
     * @param serviceResult
     * @throws IOException
     */
    private void writeResult(HttpServletResponse response, String result) throws IOException {
        if (result != null) {
            final OutputStream out = response.getOutputStream();
            final byte[] content = result.getBytes("UTF-8");
            response.setContentType("text/xml");
            response.setContentLength(content.length);
            out.write(content);
            out.flush();

        } else {
            log.warn("Service Result is empty");
        }
    }

    private String createErrorResult(String msg) {
        Element xmlDocument = new Element("SupsServiceException");
        xmlDocument.setText(msg);
        return xmlOutputter.outputString(xmlDocument);
    }

    private void ping(HttpServletRequest request, HttpServletResponse response) throws ServletException {

        assert request != null;
        assert response != null;

        if ("ccs".equalsIgnoreCase(request.getParameter(PING_PARAMETER))) {
            response.setContentType("text/plain");

            try {
                PrintWriter out = response.getWriter();
                out.print((new Date()) + " - keepalive response");
            } catch (IOException e) {
                throw new ServletException("Unable to write to response");
            }
            // do not create the session if it does not already exist
            HttpSession session = request.getSession(false);
            // remove the session if it did exist
            if (session != null) {
                session.invalidate();
            }
        }
    }
}
