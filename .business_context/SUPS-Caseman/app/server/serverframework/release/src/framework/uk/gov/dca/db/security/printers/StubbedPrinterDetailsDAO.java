/*
 * Created on Aug 5, 2005
 *
 */
package uk.gov.dca.db.security.printers;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author GrantM
 *
 */
public class StubbedPrinterDetailsDAO implements PrinterDetailsDAO {

	private final Log log = SUPSLogFactory.getLogger(StubbedPrinterDetailsDAO.class);
	   
	public StubbedPrinterDetailsDAO() {
		super();
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.printers.PrinterDetailsDAO#setEnvironment(java.util.Hashtable)
	 */
	public void setEnvironment(Hashtable env) {
		// nothing to do in the stubbed version
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.printers.PrinterDetailsDAO#getPrinterDetails()
	 */
	public List getPrinterDetails(Document parameters) throws SystemException {
		if ( log.isDebugEnabled() )
		{
			XMLOutputter outputter = new XMLOutputter();
			log.debug( outputter.outputString(parameters) );
		}
		
		List printers = new ArrayList();
		
		PrinterDetails printer = new PrinterDetails();
		printer.setServerName("uktps550");
		printer.setPrinterName("Xerox");
		printer.setDescription("Court Room 1");
		printer.setDriverName("Xerox Phaser 4500DT");
		printer.setLocation("Office");
		printer.setPrintMediaReady("Letter");
		printer.setPrintMediaSupported("C5 Envelope 162 x 229 mm;B5 Envelope 176 x 250mm");
		printer.setShortServerName("uktps550");
		printer.setUNCName("\\\\uktps550\\Xerox");
		printer.setPrintShareName("Xerox");
		printers.add(printer);
		
		printer = new PrinterDetails();
		printer.setServerName("uktps550");
		printer.setPrinterName("Xerox2");
		printer.setDescription("Court Room 2");
		printer.setDriverName("Xerox Phaser 4500DT");
		printer.setLocation("Office");
		printer.setPrintMediaReady("B5");
		printer.setPrintMediaSupported("C5 Envelope 162 x 229 mm;B5 Envelope 176 x 250mm");
		printer.setShortServerName("uktps550");
		printer.setUNCName("\\\\uktps550\\Xerox2");
		printer.setPrintShareName("Xerox2");
		printers.add(printer);
		
		return printers;
	}

}
