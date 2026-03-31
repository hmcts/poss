/*
 * Created on Aug 5, 2005
 *
 */
package uk.gov.dca.db.security.printers;

import java.util.Hashtable;
import java.util.List;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException; 

/**
 * @author GrantM
 *
 */
public interface PrinterDetailsDAO {
	/**
	 * Sets the environment properties that should be used to access the directory server
	 * 
	 * @param env A Hashtable containing environment properties used to connect to the directory server
	 */
	public void setEnvironment(Hashtable env);
	
	
	/**
	 * Returns a list of available printers and their details.
	 * 
	 * @return
	 * @throws SystemException
	 */
	public List getPrinterDetails(Document parameters) throws SystemException;
}
