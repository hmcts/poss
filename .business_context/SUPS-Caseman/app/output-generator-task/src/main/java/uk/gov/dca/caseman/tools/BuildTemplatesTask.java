package uk.gov.dca.caseman.tools;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.avalon.framework.logger.ConsoleLogger;
import org.apache.avalon.framework.logger.Logger;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class BuildTemplatesTask extends Task 
{

	private static Logger log;
	private String outputs;
	private String src;
	private String xhtmlStyle;

	static 
	{
		log = new ConsoleLogger(ConsoleLogger.LEVEL_INFO);
	}

	public void execute() throws BuildException 
	{
		log.debug("execute()");
		Document doc = loadOutputsXML();
		NodeList outputNodes = doc.getElementsByTagName("Output");
		int len = outputNodes.getLength();
		for (int i = 0; i < len; i++) 
		{
			Element outputNode = (Element) outputNodes.item(i);            
			Element idNode = (Element) outputNode.getElementsByTagName("Id").item(0);
			String id = getNodeValue(idNode);
            log.debug("**** id = " + id);            
			Element locNode = (Element) outputNode.getElementsByTagName("Location").item(0);
			Element finalLocNode = (Element) outputNode.getElementsByTagName("FinalLocation").item(0);
            log.debug("*** locNode = " + locNode);
            log.debug("*** getNodeValue(locNode) = " + getNodeValue(locNode));
			buildTemplate(getNodeValue(locNode));
			log.info("PDF Built");
			
			if ( getNodeValue(locNode) != getNodeValue(finalLocNode) )
			{
				buildTemplate(getNodeValue(finalLocNode));
				log.info("Final PDF Built");
			}
			
			if(isOutputEditable(getNodeValue(idNode)))
			{
				buildXHTMLtemplate(getNodeValue(locNode));
				log.info("XHTML Built");
			}
			else
			{
				log.info("No XHTML Template to build");
			}
			log.info("Built Output " +(i+1)+"/"+len + " " + id);
		}
	}

	public void setOutputs(String outputfile) 
	{
		this.outputs = outputfile;
	}
	
	public void setXhtmlStyle(String xhtmlStyle)
	{
		this.xhtmlStyle = xhtmlStyle;
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

	private String getNodeValue(Node node) 
	{
        Node n1 = node.getFirstChild();
        if( n1 == null ) return null;
		return node.getFirstChild().getNodeValue();
	}

	private void buildTemplate(String xmllocation) throws BuildException 
	{
        //xmllocation may be null if there is no output eg. x01
        if( xmllocation != null)
        {	log.debug("buildTemplate(" + src + xmllocation  + ")");		
    		int indx = xmllocation.indexOf("FO.xml");
    		String substg = xmllocation.substring(0, indx);
    		String xslOut = substg + "FO.xsl";	
    		String xslLocaction = src + "_Generic/supsfo.xsl";
    		executeTransform(src + xmllocation, xslLocaction, src + xslOut);
        }
	}
	
	private void buildXHTMLtemplate( String xmlLocation )
	{
		log.debug("build XHTML for " + xmlLocation);
		log.debug("xhtmlStyle: " + xhtmlStyle);
		int indx = xmlLocation.indexOf("FO.xml");
		String substg = xmlLocation.substring(0, indx);		
		String xslOut = substg + "XHTML.xsl";
		HashMap parameters = new HashMap();
		parameters.put("editable-font-config", src + "_Generic/editableFontConfig.xml");
		executeTransform( src + xmlLocation, xhtmlStyle, src + xslOut, parameters);		
	}
	
	private void executeTransform( String xmlLocation, String xslLocation, String xslOutputlocation)
	{
		executeTransform(xmlLocation, xslLocation, xslOutputlocation, null);
	}
	
	private void executeTransform( String xmlLocation, String xslLocation, String xslOutputlocation, HashMap parameters)
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
			if (parameters != null)
			{
				for (Iterator i=parameters.keySet().iterator(); i.hasNext(); )
				{
					String key = (String)i.next();
					trans.setParameter(key, parameters.get(key));
				}
				
			}
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
	
	private boolean isOutputEditable(String id) 
	{
		boolean result = false;
		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = null;
		try 
		{
			docBuilder = docBuilderFactory.newDocumentBuilder();
		} 
		catch (ParserConfigurationException e) 
		{
			log.error("DocumentBuilder NOT Initialised");
			e.printStackTrace();
		}
		FileInputStream fis = null;
		try 
		{
			fis = new FileInputStream(src + "Notice" + "/" + id + "/"+ id + "-FO.xml");
		} 
		catch (FileNotFoundException e) 
		{
			log.error("FileInputStream NOT Initialised");
			e.printStackTrace();
            return false;
		}
		Document doc = null;
		try 
		{
			doc = docBuilder.parse(fis);
		} 
		catch (SAXException e) 
		{
			e.printStackTrace();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		NodeList outputNodes = doc.getElementsByTagName("editable");
		if(outputNodes.getLength() > 0) 
		{
			result = true;
		}
		return result;
	}
}