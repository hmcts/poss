/*
 * Created on Aug 5, 2005
 *
 */
package uk.gov.dca.db.security.printers;

/**
 * @author GrantM
 *
 */
public class PrinterDetails {
	private String m_printerName = null;
	private String m_serverName = null;
	private String m_shortServerName = null;
	private String m_uncName = null;
	private String m_printShareName = null;
	private String m_location = null;
	private String m_description = null;
	private String m_driverName = null;
	private String m_printMediaReady = null;
	private String m_printMediaSupported = null;
	
	public PrinterDetails() {
		super();
	}
	
	/**
	 * Sets the printer name
	 * @param printerName
	 */
	public void setPrinterName(String printerName) {
		m_printerName = printerName;
	}
	
	/**
	 * Returns the printer name
	 * @return
	 */
	public String getPrinterName() {
		return m_printerName;
	}
	
	/**
	 * Sets the server name
	 * @param serverName
	 */
	public void setServerName(String serverName) {
		m_serverName = serverName;
	}
	
	/**
	 * Returns the server name
	 * @return
	 */
	public String getServerName() {
		return m_serverName;
	}
	
	
	/**
	 * Sets the short Server Name
	 * @param shortServerName
	 */
	public void setShortServerName(String shortServerName) {
		m_shortServerName = shortServerName;
	}
	
	/**
	 * Returns the short Server Name
	 * @return
	 */
	public String getShortServerName() {
		return m_shortServerName;
	}

	/**
	 * Sets the UNC name
	 * @param uncName
	 */
	public void setUNCName(String uncName) {
		m_uncName = uncName;
	}
	
	/**
	 * Returns the UNC name
	 * @return
	 */
	public String getUNCName() {
		return m_uncName;
	}
	
	/**
	 * Sets the print share name
	 * @param printShareName
	 */
	public void setPrintShareName(String printShareName) {
		m_printShareName = printShareName;
	}
	
	/**
	 * Returns the print share name
	 * @return
	 */
	public String getPrintShareName() {
		return m_printShareName;
	}
	
	
	/**
	 * Sets the location
	 * @param location
	 */
	public void setLocation(String location) {
		m_location = location;
	}
	
	/**
	 * Returns the location
	 * @return
	 */
	public String getLocation() {
		return m_location;
	}
	
	/**
	 * Sets the description
	 * @param description
	 */
	public void setDescription (String description) {
		m_description = description;
	}
	
	/**
	 * Returns the description
	 * @return
	 */
	public String getDescription() {
		return m_description;
	}
	
	/**
	 * Sets the driver name
	 * @param driverName
	 */
	public void setDriverName (String driverName) {
		m_driverName = driverName;
	}
	
	/**
	 * Returns the driver name
	 * @return
	 */
	public String getDriverName() {
		return m_driverName;
	}
	
	/**
	 * Sets the print media ready
	 * @param printMediaReady
	 */
	public void setPrintMediaReady(String printMediaReady) {
		m_printMediaReady = printMediaReady;
	}
	
	/**
	 * Returns the print media ready
	 * @return
	 */
	public String getPrintMediaReady() {
		return m_printMediaReady;
	}
	
	/**
	 * Sets the print media supported
	 * @param printMediaSupported
	 */
	public void setPrintMediaSupported(String printMediaSupported) {
		m_printMediaSupported = printMediaSupported;
	}
	
	/**
	 * Returns the print media supported
	 * @return
	 */
	public String getPrintMediaSupported() {
		return m_printMediaSupported;
	}	
}