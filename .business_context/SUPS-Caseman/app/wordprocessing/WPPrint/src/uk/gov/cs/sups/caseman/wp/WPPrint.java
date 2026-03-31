package uk.gov.cs.sups.caseman.wp;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.print.event.PrintJobEvent;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.xml.transform.Result;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.avalon.framework.logger.ConsoleLogger;
import org.apache.avalon.framework.logger.Logger;
import org.apache.fop.apps.Driver;
import org.apache.fop.messaging.MessageHandler;

/**
 * @author sz2n4g
 */
public class WPPrint extends HttpServlet {
    private Logger log = null;

    /**
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (log == null)
        {
            log = new ConsoleLogger(ConsoleLogger.LEVEL_DEBUG);
            MessageHandler.setScreenLogger(log);
        }
        byte[] buffer = new byte[1024];
       
        String jobId = request.getParameter("jobId");
    	String jobXsl = request.getParameter("jobXsl");
        int jobStatus = 0;
        try {
            jobStatus = Integer.parseInt(request.getParameter("jobStatus"));
        } catch (NumberFormatException e) {
        }
        
        if (jobXsl != null && jobXsl.length() != 0) {
            generatePostscript(request, response, jobId, jobXsl);
        } else if (jobStatus != 0) {
            if (jobStatus == PrintJobEvent.JOB_COMPLETE || jobStatus == PrintJobEvent.NO_MORE_EVENTS) {
                setJobComplete(jobId);
            }
        }
    }
    /**
     * @param jobId
     */
    private void setJobComplete(String jobId) {
        Connection conn = null;
        try
        {
            Context ctx = new InitialContext();
            if(ctx == null) throw new Exception("Boom - No Context");
            DataSource ds = (DataSource)ctx.lookup("java:/OracleDS");
            if (ds != null)
            {
                conn = ds.getConnection();
                if(conn != null)
                {
                     Statement stmnt = conn.createStatement();
                     stmnt.execute("UPDATE WP_OUTPUT SET PRINTED='Y' WHERE OUTPUT_ID='" + jobId +"'");
                     stmnt.close();
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e1) {
                    log.error("Print servlet can't close database connection");
                }
            }
        }
    }
    /**
     * @param response
     * @param jobId
     * @param jobXsl
     * @throws TransformerFactoryConfigurationError
     */
    private void generatePostscript(HttpServletRequest request, HttpServletResponse response, String jobId, String jobXsl) {
        Connection conn = null;
        try
		{
        	Context ctx = new InitialContext();
		    if(ctx == null) throw new Exception("Boom - No Context");
		    DataSource ds = (DataSource)ctx.lookup("java:/OracleDS");
		    if (ds != null)
		    {
		    	conn = ds.getConnection();
		        if(conn != null)
		        {
                     PreparedStatement stmnt = conn.prepareStatement("SELECT PDF_SOURCE FROM WP_OUTPUT WHERE OUTPUT_ID='" + jobId +"'");
		        	 ResultSet rs = stmnt.executeQuery();
		        	 if(rs.next())
		             {
                        Blob blob = rs.getBlob(1);
                        InputStream blobStream = blob.getBinaryStream();
		                
		                StreamSource xmlDataSource = new StreamSource(blobStream);
		                
		                OutputStream output = response.getOutputStream();
                        //GZIPOutputStream gzipOutput = new GZIPOutputStream(output);
		                
		                try {
                            TemplatesFactory.getInstance().setHost(request.getLocalAddr());
                        	 Templates templates = TemplatesFactory.getInstance().getTemplates(jobXsl);
                             Transformer fopTransformer = templates.newTransformer();
                            
		                    //Transformer fopTransformer = transformerFactory.newTransformer(xslFoSource);

		                    PostscriptControlPipe pipe = new PostscriptControlPipe(output);//gzipOutput
		                    pipe.setDuplexEnabled(isDuplex(jobXsl));
		                    pipe.setTumbleEnabled(false);

		                    Driver driver = new Driver();
		                    driver.setLogger(this.log);
		                    driver.setRenderer(Driver.RENDER_PS);
		                    driver.setOutputStream(pipe);
		                    
		                    Result res = new SAXResult(driver.getContentHandler());
		                    fopTransformer.transform(xmlDataSource, res);
                           // gzipOutput.finish();
		                } catch (TransformerConfigurationException e) {
		                    e.printStackTrace();
		                } catch (TransformerException e) {
		                    e.printStackTrace();
		                }
                        rs.close();
                        stmnt.close();
		             }
		        }
		    }
		} catch(Exception e) {
    		e.printStackTrace();
		} finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e1) {
                    log.error("Print servlet can't close database connection");
                }
            }
        }
    }
    /**
     * @param jobXsl
     * @return
     */
    private boolean isDuplex(String jobXsl) {
        boolean duplex = false;
        // TODO: Look duplex jobs up properly somewhere.
        if (jobXsl.indexOf("CJR002") != -1) {
            duplex = true;
        }
        return duplex;
    }
    /**
     * Comment for <code>serialVersionUID</code>
     */
    private static final long serialVersionUID = 1L;

}
