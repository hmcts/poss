/*
 * Created on 21-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Simple servlet to allow external agents to check the
 * version and connectivity for eDiary.
 * 
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 *	the version files are read in from the config.jar
 *  framework.version.properties
 *	version.properties  
 *	
 *
 */
public class CheckServlet extends HttpServlet
{
    List checks;
    
    public CheckServlet()
    {
        checks = new ArrayList();
        checks.add(new ServerFrameworkReleaseBuildEnvironmentCheck());
        checks.add(new ClientFrameworkReleaseBuildEnvironmentCheck());
        checks.add(new ServletsAvailabilityCheck());
        checks.add(new VersionCheck());
        checks.add(new BaseLineCheck());
        checks.add(new LinkedFrameworkBaseLineCheck());
        checks.add(new StreamCheck());
        checks.add(new ViewCheck());
        checks.add(new DBCheck());        
        checks.add(new BuildEnvironmentCheck());                
        checks.add(new FullConfigCheck());
    }
    
    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
            throws ServletException, IOException
    {
        doPost(req, rsp);
    }
    
    /**
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
            throws ServletException, IOException
    {
    	CheckContext checkContext = new CheckContext(req.getParameter("user"), req.getParameter("pass"));
    	checkContext.setRequestedURL(new URL(req.getRequestURL().toString()));
    			
        rsp.setContentType("text/xml");
        PrintWriter out = rsp.getWriter();
        out.println("<configuration>");        
        for (Iterator i = checks.iterator(); i.hasNext();)
        {
            Check check = (Check) i.next();
            check.setCheckContext(checkContext);
            check.execute();
            out.println("<config name=\"" + check.getName() + "\">" + check.execute()+ "</config>");
        }
        out.println("</configuration>");
        
        HttpSession session = req.getSession(false); // do not create the session if it does not already exist remove the session if it did exist
        if (session != null) {
        	session.invalidate();
        }

    }
}
