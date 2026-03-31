package uk.gov.dca.caseman.tools;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

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

import org.apache.avalon.framework.logger.ConsoleLogger;
import org.apache.avalon.framework.logger.Logger;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FOPException;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.MimeConstants;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class OutputTemplateGeneratorTask extends Task {

	private static Logger log = new ConsoleLogger();

	private String outputs;
	private String src;
	private String fopConfDir;
	
	private FopFactory fopFact;


	public void execute() throws BuildException
	{
		log.debug("execute()");
		
		initialiseFopFact();
		
		Document doc = loadOutputsXML();
		NodeList outputNodes = doc.getElementsByTagName("Output");
		int len = outputNodes.getLength();
		String id = new String();
		for (int i = 0; i < len; i++) 
		{
			try {
			Element outputNode = (Element) outputNodes.item(i);
			Element idNode = (Element) outputNode.getElementsByTagName("Id").item(0);
			id = getNodeValue(idNode);
			Element locNode = (Element) outputNode.getElementsByTagName("Location").item(0);
			buildTemplate(getNodeValue(locNode));
			log.info("PDF Built");
			log.info("Built Output " +(i+1)+"/"+len + " " + id);
			} catch(NullPointerException e) {
				log.error("Invalid Output Id or Location for " + id + " " + e.getLocalizedMessage());
			}
		}
	}

	public void setOutputs(String outputfile) 
	{
		this.outputs = outputfile;
	}

	private Document loadOutputsXML() throws BuildException 
	{
		log.debug("loadOutputsXML()");
		log.info("loadoutputs from " + outputs);
		log.info("source directory: " + src);
		if (outputs == null) throw new BuildException("'outputs' attribute has not been defined.");
		if (src == null) {throw new BuildException("source directory attribute 'src' has not been set.");}
		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
		try 
		{
			DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
			FileInputStream fis = new FileInputStream(outputs);
			return docBuilder.parse(fis);
		} 
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
			throw new BuildException(e);
		} 
		catch (ParserConfigurationException e) 
		{
			e.printStackTrace();
			throw new BuildException(e);
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
			throw new BuildException(e);
		} 
		catch (SAXException e) 
		{
			e.printStackTrace();
			throw new BuildException(e);
		}
	}

	public void setSrc(String srcDir) 
	{
		this.src = srcDir;
	}
	
	public void setFopConfDir(String fileLoc)
	{
		this.fopConfDir = fileLoc;
	}
	
	private String getNodeValue(Node node) 
	{
		return node.getFirstChild().getNodeValue();
	}

	private void buildTemplate(String xmllocation) throws BuildException 
	{
		log.debug("buildTemplate(" + src + xmllocation  + ")");		
		int indx = xmllocation.indexOf("FO.xml");
		String substg = xmllocation.substring(0, indx);
		
		String xslOut = src + substg + "FO.xsl";	
		String xslLocation = src + "_Generic/supsfo_templatedocumentation.xsl";
		executeTransform(src + xmllocation, xslLocation, xslOut);
		
		String xmlVar = src + substg + "VAR.xml";	
		
		int indx1 = xmllocation.indexOf("-FO.xml");
		String substg1 = xmllocation.substring(0, indx1);
		
		String foFile = src + substg1 + "_doc.fo";
		executeFOTransform(xmlVar, xslOut, foFile);
		

		String pdfFile = src + substg1 + "_doc.pdf";
		executePDFTransform(foFile, pdfFile);
	}
	
	private void executeTransform( String xmlLocation, String xslLocation, String xslOutputlocation)
	{	
		try {			
			FileInputStream xmlfis = new FileInputStream( xmlLocation);
			log.debug("loaded: " + xmlLocation);			
			FileInputStream xslfis = new FileInputStream( xslLocation);
			log.debug("loaded: " + xslLocation);
			FileOutputStream xslfos = new FileOutputStream( xslOutputlocation);
			log.debug("loaded: " +  xslOutputlocation);
			StreamSource xmlSource = new StreamSource(xmlfis);
			StreamSource xslSource = new StreamSource(xslfis);
			StreamResult res = new StreamResult(xslfos);
			TransformerFactory transFact = TransformerFactory.newInstance();
			Transformer trans = transFact.newTransformer(xslSource);
			trans.transform(xmlSource, res);
			xmlfis.close();
			xslfis.close();
			xslfos.close();
		} 
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException("Unable to load file from location:" + xmlLocation, e);
		} 
		catch (IOException e) 
		{
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			e.printStackTrace();
		} 
		catch (TransformerConfigurationException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException(e);
		} 
		catch (TransformerException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException(e);
		}
	}

	private void executeFOTransform( String xmlLocation, String xslLocation, String xslOutputlocation)
	{	
		try {			
			FileInputStream xmlfis = new FileInputStream( xmlLocation);
			log.debug("loaded: " + xmlLocation);			
			FileInputStream xslfis = new FileInputStream( xslLocation);
			log.debug("loaded: " + xslLocation);
			FileOutputStream xslfos = new FileOutputStream( xslOutputlocation);
			log.debug("loaded: " +  xslOutputlocation);
			StreamSource xmlSource = new StreamSource(xmlfis);
			StreamSource xslSource = new StreamSource(xslfis);
			StreamResult res = new StreamResult(xslfos);
			TransformerFactory transFact = TransformerFactory.newInstance();
			Transformer trans = transFact.newTransformer(xslSource);
			trans.transform(xmlSource, res);
			xmlfis.close();
			xslfis.close();
			xslfos.close();
		} 
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException("Unable to load file from location:" + xmlLocation, e);
		} 
		catch (IOException e) 
		{
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			e.printStackTrace();
		} 
		catch (TransformerConfigurationException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException(e);
		} 
		catch (TransformerException e) 
		{
			e.printStackTrace();
			log.error("excuteTransform( /n" + xmlLocation+ ",/n "+xslLocation+" , /n" + xslOutputlocation+")");
			throw new BuildException(e);
		}
	}
	
	private void executePDFTransform( String input, String output)
	{	
		try {			
			// Input for PDF transformation
			Source inSrc = new StreamSource(new File(input));
			log.debug("loaded: " + input);			

			// Create output file for PDF to be written to
			OutputStream outFile = new BufferedOutputStream(new FileOutputStream(new File(output)));
			log.debug("loaded: " +  output);
			
			//	XSL FO Transformation BEGIN 
		    
		    try 
		    {   
		    	// Construct FO processor with required output format
				Fop fop = fopFact.newFop(MimeConstants.MIME_PDF, outFile);
				
				// Create transformer
				TransformerFactory transFact = TransformerFactory.newInstance();
				Transformer trans = transFact.newTransformer();
				
				// Output for PDF transformation
				Result res = new SAXResult(fop.getDefaultHandler());
				
				// Use transformer to Generate PDF
				trans.transform(inSrc, res);
				
			} 
		    catch (FOPException fe)
		    {
		    	log.error(fe.getMessage());
		    }
		    catch (TransformerConfigurationException tce)
		    {
		    	log.error(tce.getMessage());
		    }
		    catch (TransformerException te)
		    {
		    	log.error(te.getMessage());
		    }
			finally
			{
				try
				{
					outFile.close();
				}
				catch (IOException ie)
				{
					log.error(ie.getMessage());
				}
			}
			
			//	XSL FO Transformation END

		} 
		catch (FileNotFoundException e) 
		{
			e.printStackTrace();
			log.error("executePDFTransform()");
			throw new BuildException("Unable to load file from location");
		} 
	}
	
	/**
	 * Initialise FOP factory and set configuration from config file
	 */
	private void initialiseFopFact()
	{
		log.debug("initialiseFopFact()");
		log.debug("fop config file location: " + fopConfDir);
		
		if (fopConfDir == null) throw new BuildException("'fopConfDir' attribute has not been defined.");
		
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

}
