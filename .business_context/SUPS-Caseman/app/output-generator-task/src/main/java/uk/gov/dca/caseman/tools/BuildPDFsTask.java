package uk.gov.dca.caseman.tools;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.FOPException;
import org.apache.fop.apps.MimeConstants;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class BuildPDFsTask extends Task
{
	private String outputsXML;
	private String destDir;
	private HashMap errors;
	private String xslHome;
	private String logFile;
	private String fopConfDir;
	
	private FopFactory fopFact;
	FileOutputStream fos = null;
	
	public void execute() throws BuildException
	{   System.out.println("execute");
		if( outputsXML == null) throw new BuildException("outputsXML paramater must be defined");
		if( destDir == null) throw new BuildException("destDir paramater must be defined");
		if( fopConfDir == null ) throw new BuildException("fopConfDir parameter must be defined");
		if( logFile == null ) throw new BuildException("logfile for pdf logging validation must be defined");
		System.out.println("xslHome: " + xslHome );
		
		errors = new HashMap();
		try 
		{	 fos = new FileOutputStream( new File(logFile), true);						
		} 
		catch (FileNotFoundException e1) 
		{
			//continue without log file
			e1.printStackTrace();
		}
		
		// Initialise the FOP factory
		initialiseFopFact();
		
		try 
		{
			//read the outputs file
			FileInputStream fis = new FileInputStream(outputsXML);
			DocumentBuilderFactory docBuilderFact = DocumentBuilderFactory.newInstance();
			try 
			{
				DocumentBuilder docBuilder = docBuilderFact.newDocumentBuilder();
				Document doc = docBuilder.parse(fis);
				NodeList list = doc.getElementsByTagName("Output");
				int len = list.getLength();				
				
				for( int i=0; i < len; i++)
				{	Element item = (Element)list.item(i); 
					Node id = item.getElementsByTagName("Id").item(0);				
					String outputName = id.getFirstChild().getNodeValue();			
					System.out.println("Creating "+outputName+"-FO-XSL.fo.\n");
					generatePdf( outputName );
				}
				
			} 
			catch (ParserConfigurationException e1) 
			{ 	
				e1.printStackTrace();
				throw new BuildException(e1);
				
			} catch (SAXException e) 
			{	
				e.printStackTrace();
				throw new BuildException(e);
				
			} catch (IOException e) 
			{
				e.printStackTrace();
				throw new BuildException(e);			
			}			
		} 
		catch (FileNotFoundException e) 
		{			
			e.printStackTrace();
			throw new BuildException(e);
		}
		
		if( !errors.isEmpty() )
		{
			reportErrors();
		}
	}
	
	
	public void setOutputsXML(String file )
	{
		this.outputsXML = file;
	}
	
	public void setDestDir(String fileLoc )
	{
		this.destDir = fileLoc;
	}
	
	/**
	 * Set the fopConfDir attribute
	 * @param fopConfDir The directory that contains the Apache FOP config file
	 */
	public void setFopConfDir(String fopConfDir)
	{
		this.fopConfDir = fopConfDir;
	}
	
	public void setLogFile( String file )
	{
		this.logFile = file;
	}
	
	private void generatePdf(String output )
	{	
		String xslFile = destDir + "/xsl/"+ output + "-FO.xsl";
		String xmlFile = destDir + "/xml/"+output+"-VAR.xml";
		String resFile = destDir + "/fo/"+output+"-FO-XSL.fo";
		StreamSource xslSrc = new StreamSource(xslFile);
		StreamSource xmlSrc = new StreamSource(xmlFile);
		try 
		{
			StreamResult foRes = new StreamResult(new FileOutputStream(resFile));
			TransformerFactory transFact = TransformerFactory.newInstance();
			Transformer trans = transFact.newTransformer(xslSrc);
			trans.setParameter("xslHome", xslHome);
			trans.transform(xmlSrc, foRes);
		} 
		catch (FileNotFoundException e) 
		{	errors.put( output, e);
		} 
		catch (TransformerConfigurationException e) 
		{
			errors.put( output, e);
		} 
		catch (TransformerException e) 
		{
			errors.put( output, e);
		}	
		
		apacheFop(output);
	}
	
	private void reportErrors()
	{
		System.out.println( "BuildPDFxTask Completed with errors "+errors.size() +":\n");		
		Iterator it  = errors.keySet().iterator();
		
		
		
		
		while( it.hasNext())
		{	String key = (String)it.next();
			Exception e = (Exception)errors.get(key);
			System.out.println("Ouput "+key+" failed with Exception: " + e);
			
			if( fos != null )
			{
				try 
				{
					fos.write( ("\nOutput: "+key+": "+e ).getBytes() );
					/*fos.write("\nCAUSE: ".getBytes());
					StackTraceElement[] cause = e.getStackTrace();
					for( int i = cause.length - 1; i >= 0; i-- )
					{
						fos.write(("\n\t"+cause[i]).getBytes());
					}*/
					
				} catch (IOException e2) {
					// TODO Auto-generated catch block
					e2.printStackTrace();
				}
			}
			
		}	
		
		errors = new HashMap();
		
	}
	
	/**
	 * @param xslHome The xslHome to set.
	 */
	public void setXslHome(String xslHome) {
		this.xslHome = xslHome;
	}	
	
	/**
	 * Initialise FOP factory and set configuration from config file
	 */
	private void initialiseFopFact()
	{
		fopFact = FopFactory.newInstance();
		
		try
		{
			fopFact.setUserConfig(new File(fopConfDir + "/fop-conf.xml"));
		}
		catch(Exception e)
		{
			throw new BuildException("Failed to set FOP config: " + e.getMessage());
		}
	}
	
	/**
	 * Generate a PDF from the output Formatting Objects (FO) file using Apache FOP
	 * @param output A String containing the name of the output for which a PDF will be generated
	 */
	private void apacheFop(String output)
	{
		System.out.println("Apache FOP: " + output);
		
		String inFile = destDir + "/fo/" + output + "-FO-XSL.fo";
		String outFile = destDir + "/pdf/" + output + ".pdf";
		
		String errKey = "AF-" + output;
		
		try
		{
			// Create output file for PDF to be written to
			OutputStream out = new BufferedOutputStream(new FileOutputStream(new File(outFile)));
			
			try
			{	
				// Construct FO processor with required output format
				Fop fop = fopFact.newFop(MimeConstants.MIME_PDF, out);
				
				// Create transformer
				TransformerFactory transFact = TransformerFactory.newInstance();
				Transformer trans = transFact.newTransformer();
				
				// Input for PDF transformation
				Source src = new StreamSource(new File(inFile));
				
				// Output for PDF transformation
				Result res = new SAXResult(fop.getDefaultHandler());
				
				// Use transformer to Generate PDF
				trans.transform(src, res);
			}
			catch(FOPException fe)
			{
				errors.put(errKey, fe);
			}
			catch(TransformerConfigurationException tce)
			{
				errors.put(errKey, tce);
			}
			catch(TransformerException te)
			{
				errors.put(errKey, te);
			}
			finally
			{
				try
				{
					// Close output file
					out.close();
				}
				catch(IOException ie)
				{
					throw new BuildException("Could not close output file: " + ie.getMessage());
				}
			}
			
		}
		catch(FileNotFoundException fe)
		{
			throw new BuildException("Could not create output file: " + fe.getMessage());
		}
		
	}
}