package uk.gov.dca.db.impl.check;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.util.SUPSLogFactory;

public class CheckServlet extends HttpServlet {

	private static final long serialVersionUID = 123456789L;

	private final static Log log = SUPSLogFactory.getLogger(CheckServlet.class);

	public void init() throws ServletException {
		// TODO Auto-generated method stub
		super.init();
	}

	protected void doHead(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Head called");
		process(req, rsp);
	}

	/**
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Get called");
		process(req, rsp);
	}

	/**
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		log.info("Do Post Called");
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {

		log.info("Processing request: " + req.getMethod());
		PrintWriter out = rsp.getWriter();
		out.println("Content-Type: text/xml");
		
		out.println("<CheckServletResult>");		
		out.println("<Message>5555 Edited file - Result from CheckBean goes here</Message>");				
		out.println("</CheckServletResult>");
		
		
		out.flush();
		
	}
}