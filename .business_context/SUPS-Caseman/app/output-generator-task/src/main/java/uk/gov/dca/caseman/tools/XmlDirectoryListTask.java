package uk.gov.dca.caseman.tools;

import org.apache.tools.ant.*;
import org.w3c.dom.*;
import java.io.*;
import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;
import java.util.*;

public class XmlDirectoryListTask extends Task {

	private String sourceDirectory;

	private String destinationDirectory;

	private String filename;

	private String root;

	private String element;

	private String attribute;

	private String fileExtension;

	private File targetDir;

	public void execute() throws BuildException {

		validate();

		String[] list = targetDir.list();
		TreeMap sorter = new TreeMap(); // natural sort
		boolean isNumber = true;
		HashMap elems = new HashMap();

		try {
			DocumentBuilder db = DocumentBuilderFactory.newInstance()
					.newDocumentBuilder();
			Document doc = db.newDocument();
			doc.appendChild(doc.createElement(root));
			Node root = doc.getFirstChild();

			for (int i = 0; i < list.length; i++) {
				String fName = list[i];
				int len = fName.length();

				if (fName.endsWith(fileExtension)) {
					String qid = fName.substring(0, len
							- fileExtension.length());
					Element qElem = doc.createElement(element);
					qElem.setAttribute(attribute, qid);
					elems.put(qid, qElem);

					try {
						new Integer(qid);
					} catch (NumberFormatException nfe) {
						isNumber = false;
					}
				}
			}

			Iterator it = elems.keySet().iterator();
			while (it.hasNext()) {
				String key = (String) it.next();
				if (isNumber) {
					sorter.put(new Integer(key), elems.get(key));
				} else {
					sorter.put(key, elems.get(key));
				}
			}

			it = sorter.keySet().iterator();
			while (it.hasNext()) {
				root.appendChild((Node) sorter.get(it.next()));
			}

			File f = new File(destinationDirectory + "/" + filename);
			Source source = new DOMSource(doc);
			Result result = new StreamResult(f);
			Transformer tform = TransformerFactory.newInstance()
					.newTransformer();
			tform.transform(source, result);

		} catch (ParserConfigurationException e) {
			throw new BuildException(e);
		} catch (TransformerConfigurationException tex) {
			throw new BuildException(tex);
		} catch (TransformerException tfex) {
			throw new BuildException(tfex);
		}
	}

	public void setSourceDirectory(String dir) {
		this.sourceDirectory = dir;
	}

	public void setDestinationDirectory(String dir) {
		this.destinationDirectory = dir;
	}

	public void setFilename(String file) {
		this.filename = file;
	}

	public void setRoot(String rootName) {
		this.root = rootName;
	}

	public void setElement(String elementName) {
		this.element = elementName;
	}

	public void setAttribute(String attributeName) {
		this.attribute = attributeName;
	}

	public void setFileExtension(String fileExtensionName) {
		this.fileExtension = fileExtensionName;
	}

	private void validate() throws BuildException {
		String msg = null;
		if (sourceDirectory == null) {
			msg = "sourceDirectory is null";
		} else if (destinationDirectory == null) {
			msg = "destinationDirectory is null";
		} else if (filename == null) {
			msg = "filename is null";
		} else if (root == null) {
			msg = "root is null";
		} else if (element == null) {
			msg = "element is null";
		} else if (attribute == null) {
			msg = "attribute is null";
		} else if (fileExtension == null) {
			msg = "fileExtension is null";
		} else {
			if (!fileExtension.startsWith(".")) {
				fileExtension = "." + fileExtension;
			}
			this.targetDir = new File(sourceDirectory);
			if (!targetDir.isDirectory()) {
				msg = "The directory " + sourceDirectory + " does not exist";
			}
			File test = new File(destinationDirectory);
			if (!test.isDirectory()) {
				test.mkdir();
			}
		}

		if (msg != null) {
			throw new BuildException(msg);
		}
	}
}