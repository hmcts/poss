/*
 * Servlet to render a PDF from a given xml input for a specified CJR form.
 */
package uk.gov.cs.sups.caseman.wp;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.ErrorListener;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.avalon.framework.logger.Logger;
import org.apache.fop.apps.Driver;

/**
 * @author sz2n4g
 */
public class FopServletPerformanceTest extends HttpServlet implements ErrorListener, Logger {
	/**
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);
	}
	private String stylesheetLocation = "D:\\sups\\development\\ServerFramework\\servertest\\WEB-INF\\templates\\fullfo\\Notice\\";

	/**
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);
	}
	
	private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
		String xml = request.getParameter("xml");
		String type = request.getParameter("type");
        response.setContentType("application/pdf");
		Driver driver = new Driver();
		driver.setLogger(this);
		driver.setRenderer(Driver.RENDER_PDF);
		driver.setOutputStream(out);
		Result res = new SAXResult(driver.getContentHandler());
		Source src = new StreamSource(new StringReader(xml));
		String xslFile = stylesheetLocation + type + "\\" + type + ".xsl";
		System.out.println(xslFile);
		Source xsltSrc = new StreamSource(new File(xslFile));
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		try {
			Transformer transformer = transformerFactory.newTransformer(xsltSrc);
			transformer.setErrorListener(this);
			transformer.transform(src, res);
            byte[] content = out.toByteArray();
            response.setContentLength(content.length);
            response.getOutputStream().write(content);
            response.getOutputStream().flush();
		} catch (TransformerConfigurationException e) {
			e.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see javax.xml.transform.ErrorListener#error(javax.xml.transform.TransformerException)
	 */
	public void error(TransformerException e) throws TransformerException {
		System.out.println(e.getMessage());
	}

	/**
	 * @see javax.xml.transform.ErrorListener#fatalError(javax.xml.transform.TransformerException)
	 */
	public void fatalError(TransformerException e) throws TransformerException {
		System.out.println(e.getMessage());
	}

	/**
	 * @see javax.xml.transform.ErrorListener#warning(javax.xml.transform.TransformerException)
	 */
	public void warning(TransformerException e) throws TransformerException {
		System.out.println(e.getMessage());
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#debug(java.lang.String)
	 */
	public void debug(String message) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#debug(java.lang.String, java.lang.Throwable)
	 */
	public void debug(String message, Throwable e) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#isDebugEnabled()
	 */
	public boolean isDebugEnabled() {
		return false;
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#info(java.lang.String)
	 */
	public void info(String message) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#info(java.lang.String, java.lang.Throwable)
	 */
	public void info(String message, Throwable arg1) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#isInfoEnabled()
	 */
	public boolean isInfoEnabled() {
		return true;
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#warn(java.lang.String)
	 */
	public void warn(String message) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#warn(java.lang.String, java.lang.Throwable)
	 */
	public void warn(String message, Throwable arg1) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#isWarnEnabled()
	 */
	public boolean isWarnEnabled() {
		return true;
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#error(java.lang.String)
	 */
	public void error(String message) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#error(java.lang.String, java.lang.Throwable)
	 */
	public void error(String message, Throwable arg1) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#isErrorEnabled()
	 */
	public boolean isErrorEnabled() {
		return true;
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#fatalError(java.lang.String)
	 */
	public void fatalError(String message) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#fatalError(java.lang.String, java.lang.Throwable)
	 */
	public void fatalError(String message, Throwable arg1) {
		System.out.println(message);
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#isFatalErrorEnabled()
	 */
	public boolean isFatalErrorEnabled() {
		return true;
	}

	/**
	 * @see org.apache.avalon.framework.logger.Logger#getChildLogger(java.lang.String)
	 */
	public Logger getChildLogger(String child) {
		return null;
	}
}
