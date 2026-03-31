/*
 * Created on Aug 5, 2005
 *
 */
package uk.gov.dca.db.security.printers;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

/**
 * A simple class to serialize the printer details.
 * (Too simple - xml not escaped, defect 1156)
 * 
 * @author GrantM
 * @author Nick Lawson
 */
public class PrinterDetailsSerializer {

	public static void outputXML(StringBuffer xmlSink, PrinterDetails printerDetails) 
	{
		if ( printerDetails != null && xmlSink != null) {
    		Document doc = new Document();
            Element printer = new Element("Printer");
            doc.setRootElement(printer);
            printer.addContent(makeElement("PrinterName", printerDetails.getPrinterName()));
            printer.addContent(makeElement("ServerName", printerDetails.getServerName()));
            printer.addContent(makeElement("DriverName", printerDetails.getDriverName()));
            printer.addContent(makeElement("Description", printerDetails.getDescription()));
            printer.addContent(makeElement("PrintMediaReady", printerDetails.getPrintMediaReady()));
            printer.addContent(makeElement("PrintMediaSupported", printerDetails.getPrintMediaSupported()));
            printer.addContent(makeElement("PrintShareName", printerDetails.getPrintShareName()));
            printer.addContent(makeElement("ShortServerName", printerDetails.getShortServerName()));
            printer.addContent(makeElement("UNCName", printerDetails.getUNCName()));
            printer.addContent(makeElement("Location", printerDetails.getLocation()));
            xmlSink.append(new XMLOutputter().outputString(printer));
        }
	}
    
    private static Element makeElement(String elementName, String value) {
        Element el = new Element(elementName);
        el.setText(value);
        return el;
    }
}
