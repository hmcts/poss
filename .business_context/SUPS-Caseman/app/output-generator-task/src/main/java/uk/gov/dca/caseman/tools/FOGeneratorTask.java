package uk.gov.dca.caseman.tools;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

public class FOGeneratorTask extends Task {

	private String xslFile;

	private String xmlFile;

	private String outFile;

	public void execute() throws BuildException {
		if (xslFile == null)
			throw new BuildException(
					"xslFile must be defined as an input parameter");
		if (xmlFile == null)
			throw new BuildException(
					"xmlFile must be defined as an input parameter");
		if (outFile == null)
			throw new BuildException(
					"outFile must be defined as an input parameter");

		StreamSource xslSource = new StreamSource(xslFile);
		StreamSource xmlSource = new StreamSource(xmlFile);
		StreamResult foResult = null;
		
		try {
			foResult = new StreamResult(new FileOutputStream(
					outFile));
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
			throw new BuildException(e1);
		}

		TransformerFactory transformerFactory = TransformerFactory
				.newInstance();
		try {
			Transformer transformer = transformerFactory
					.newTransformer(xslSource);
			transformer.transform(xmlSource, foResult);
		} catch (TransformerConfigurationException e) {
			e.printStackTrace();
			throw new BuildException(e);
		} catch (TransformerException e) {
			e.printStackTrace();
			throw new BuildException( e );			
		}

	}
	
	public void setXslFile(String filename)
	{
		this.xslFile = filename;
	}
	
	public void setXmlFile(String filename)
	{
		this.xmlFile = filename;
	}
	
	public void setOutFile(String filename)
	{
		this.outFile = filename;
	}

}