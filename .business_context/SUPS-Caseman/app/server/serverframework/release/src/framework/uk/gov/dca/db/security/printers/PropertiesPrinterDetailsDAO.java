package uk.gov.dca.db.security.printers;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Properties;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Simple stubbed printer list using properties file to configure the printers.
 * 
 * @author Michael Barker
 *
 */
public class PropertiesPrinterDetailsDAO implements PrinterDetailsDAO {

    private final static String PROPERTIES_FILE = "printer_details.properties";
    
    public void setEnvironment(Hashtable env) {
        // TODO Auto-generated method stub

    }

    public List getPrinterDetails(Document parameters) throws SystemException {
        
        List printers = new ArrayList();

        Properties props = new Properties();
        InputStream in = Util.getInputStream(PROPERTIES_FILE, this);
        try {
            props.load(in);
            String printerNames = props.getProperty("printers");
            if (printerNames != null) {
                String[] printerNameList = printerNames.split(",");
                for (int i = 0; i < printerNameList.length; i++) {
                    String printerName = printerNameList[i];
                    PrinterDetails printer = new PrinterDetails();
                    printer.setServerName(props.getProperty(printerName + ".serverName"));
                    printer.setPrinterName(props.getProperty(printerName + ".printerName"));
                    printer.setDescription(props.getProperty(printerName + ".description"));
                    printer.setDriverName(props.getProperty(printerName + ".driverName"));
                    printer.setLocation(props.getProperty(printerName + ".location"));
                    printer.setPrintMediaReady(props.getProperty(printerName + ".printMediaReady"));
                    printer.setPrintMediaSupported(props.getProperty(printerName + ".printMediaSupported"));
                    printer.setShortServerName(props.getProperty(printerName + ".shortServerName"));
                    printer.setUNCName(props.getProperty(printerName + ".uNCName"));
                    printer.setPrintShareName(props.getProperty(printerName + ".printShareName"));
                    
                    printers.add(printer);
                }
            }
            else {
                throw new SystemException("No printers specified");
            }
                
            
        }
        catch (IOException e) {
            throw new SystemException(e);
        }
        
        return printers;
    }
    

}
