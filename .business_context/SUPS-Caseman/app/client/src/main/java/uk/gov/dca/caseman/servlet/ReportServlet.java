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
package uk.gov.dca.caseman.servlet;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
// import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Submits a request to the Oracle RWServlet Reports interface.
 * <p>
 * There are two modes of operation:
 * <ul>
 * <li>If jobId is present in the request parameters, a pre-generated report is retrieved from the oracle cache.
 * <li>If jobId is not present, a new report is requested using the request parameters
 * and the newly generated report is retrieved.
 * </ul>
 * 
 * @author Doug Satchwell, Alex Peterson
 */
public class ReportServlet extends HttpServlet
{
    
    /** The oracle servlet URL. */
    private String oracleServletURL;
    
    /** The oracle report server. */
    private String oracleReportServer;
    
    /** The output type. */
    private String outputType;
    
    /** The des type. */
    private String desType;
    
    /** The userid. */
    private String userid;

    /**
     * {@inheritDoc}
     */
    public void init () throws ServletException
    {
        this.oracleServletURL = getInitParameter ("oracleServletURL");
        this.oracleReportServer = getInitParameter ("oracleReportServer");
        this.outputType = getInitParameter ("outputType");
        this.desType = getInitParameter ("desType");
        this.userid = getInitParameter ("userid");
    }

    /**
     * {@inheritDoc}
     */
    protected void doGet (final HttpServletRequest arg0, final HttpServletResponse arg1)
        throws ServletException, IOException
    {
        handleRequest (arg0, arg1);
    }

    /**
     * {@inheritDoc}
     */
    protected void doPost (final HttpServletRequest arg0, final HttpServletResponse arg1)
        throws ServletException, IOException
    {
        handleRequest (arg0, arg1);
    }

    /**
     * Handle request.
     *
     * @param request the request
     * @param response the response
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private void handleRequest (final HttpServletRequest request, final HttpServletResponse response)
        throws ServletException, IOException
    {
        final String jobId = request.getParameter ("jobId");
        String urlString = oracleServletURL;
        String filename = null;

        if (jobId == null || jobId.trim ().equals (""))
        {
            // generate a new report
            urlString += "?server=" + oracleReportServer + "&" + request.getQueryString () + "&desformat=" +
                    outputType + "&destype=" + desType + "&userid=" + userid;

            // use just the report module name:
            filename = request.getParameter ("report");
            filename = filename.substring (0, filename.lastIndexOf (".rdf"));
        }
        else
        {
            // retrieve an existing report by jobId
            urlString += "/getjobid" + jobId.trim () + "?server=" + oracleReportServer;

            // use the retrieved desname:
            filename = request.getParameter ("reportName");
        }

        response.setContentType ("application/pdf");
        response.setHeader ("Content-disposition", "attachment; filename=" + filename + ".pdf");

        
        
        try
        {
            final URL url = new URL (urlString);

            // Use Buffered Stream for reading/writing.
            try (final OutputStream out = new BufferedOutputStream (response.getOutputStream ());
                 final InputStream in = new BufferedInputStream (url.openStream ()) ){
            

            final byte[] buff = new byte[2048];
            int bytesRead;

            while ((bytesRead = in.read (buff, 0, buff.length)) != -1)
            {
                out.write (buff, 0, bytesRead);
            }
            }
        }
        catch (final IOException e)
        {
            throw e;
        }
        
    }
}
