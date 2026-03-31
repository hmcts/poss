/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.caseman.common.java.printers;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.printers.PrinterDetails;
import uk.gov.dca.db.security.printers.PrinterDetailsDAO;

/**
 * Created on 05-Oct-2005.
 *
 * @author fzzjsd
 * 
 *         Change History
 *         19feb07 Chris Hutt defect 754 always set the description to null, descriptions may have
 *         unparsable XML characters in. Will be replaced by framework 9.0.32
 */
public class CasemanPrinterDetailsDAO implements PrinterDetailsDAO
{

    /** The Constant log. */
    private static final Log log = LogFactory.getLog (CasemanPrinterDetailsDAO.class);

    /** The ad unavailable. */
    private static String AD_UNAVAILABLE =
            "The server cannot connect to Active Directory at the moment. Please try again later.";
    
    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant GET_FAP_METHOD. */
    private static final String GET_FAP_METHOD = "getCourtFapLocal";
    
    /** The no fap server. */
    private static String NO_FAP_SERVER =
            "Cannot get printers because no File and Print Server has been specified for the court";

    /** The Constant PRINTER_NAME. */
    private static final String PRINTER_NAME = "printerName";
    
    /** The Constant DESCRIPTION. */
    private static final String DESCRIPTION = "description";
    
    /** The Constant DRIVER. */
    private static final String DRIVER = "driverName";
    
    /** The Constant UNC_NAME. */
    private static final String UNC_NAME = "uNCName";
    
    /** The Constant LOCATION. */
    private static final String LOCATION = "location";
    
    /** The Constant MEDIA_READY. */
    private static final String MEDIA_READY = "printMediaReady";
    
    /** The Constant MEDIA_SUPPORTED. */
    private static final String MEDIA_SUPPORTED = "printMediaSupported";
    
    /** The Constant SHORT_NAME. */
    private static final String SHORT_NAME = "serverName";
    
    /** The Constant SHARE_NAME. */
    private static final String SHARE_NAME = "printShareName";
    
    /** The Constant SEARCHBASE_KEY. */
    private static final String SEARCHBASE_KEY = "printerbase";
    /**
     * Printer query environment string.
     */
    public static final String QUERY_KEY = "printerquery";
    
    /** The Constant RETURN_ATTRIBUTES. */
    private static final String[] RETURN_ATTRIBUTES = new String[] {PRINTER_NAME, DESCRIPTION, DRIVER, LOCATION,
            MEDIA_READY, MEDIA_SUPPORTED, SHORT_NAME, SHARE_NAME, UNC_NAME, "objectclass"};

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /** The ad env. */
    private Hashtable<String, String> adEnv;
    
    /** The printer search base. */
    private String printerSearchBase;
    
    /** The filter. */
    private String filter;

    /**
     * Constructor.
     */
    public CasemanPrinterDetailsDAO ()
    {
        super ();
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * {@inheritDoc}
     */
    public void setEnvironment (final Hashtable env)
    {
        adEnv = (Hashtable<String, String>) env.clone ();
        printerSearchBase = (String) adEnv.get (SEARCHBASE_KEY);
        filter = (String) adEnv.get (QUERY_KEY);
        adEnv.remove (SEARCHBASE_KEY);
        adEnv.remove (QUERY_KEY);
        adEnv.remove ("searchbase");
        adEnv.remove ("query");
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the printer details
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.security.printers.PrinterDetailsDAO#getPrinterDetails(org.jdom.Document)
     */
    public List<PrinterDetails> getPrinterDetails (final Document doc) throws SystemException
    {
        final ArrayList<PrinterDetails> printers = new ArrayList<>();

        // obtain an LDAP connection to Active Directory
        LdapContext con = null;
        try
        {
            con = new InitialLdapContext (adEnv, null);
        }
        catch (final NamingException e)
        {
            throw new SystemException (AD_UNAVAILABLE);
        }

        try
        {
            // The following lines of code are just a work around until the framework fixes the security bean properly
            final Element root = doc.getRootElement ();
            // Get the common parameters out of the xml
            final String userId = XMLBuilder.getXPathValue (root, "/params/param[@name='userId']");
            final String courtId = XMLBuilder.getXPathValue (root, "/params/param[@name='courtId']");
            final String businessProcessId =
                    XMLBuilder.getXPathValue (root, "/params/param[@name='businessProcessId']");

            final uk.gov.dca.db.pipeline.CallStack cs = uk.gov.dca.db.pipeline.CallStack.getInstance ();
            cs.push ("Security", "getPrintersList", "");
            final ComponentContext ctx = cs.peek ();
            // Store the common parameters in the context
            ctx.putSystemItem (IComponentContext.USER_ID_KEY, userId);
            ctx.putSystemItem (IComponentContext.COURT_ID_KEY, courtId);
            ctx.putSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY, businessProcessId);
            // Up to here

            // get the server name for the user's current court
            final XMLOutputter out = new XMLOutputter (Format.getPrettyFormat ());
            final String paramString = out.outputString (doc);
            log.debug ("XML Passed into CasemanPrinterDetailsDAO.getPrinterDetails() : " + paramString);
            final String serverName = getServerNameForCourt (paramString);

            // Set up LDAP search params
            final SearchControls constraints = new SearchControls ();
            constraints.setSearchScope (SearchControls.ONELEVEL_SCOPE);
            constraints.setReturningAttributes (RETURN_ATTRIBUTES);

            final String searchBase = MessageFormat.format (printerSearchBase, new String[] {serverName});
            // do the search on AD and extract the displayname from the results
            final NamingEnumeration<SearchResult> results = con.search (searchBase, filter, constraints);

            PrinterDetails printer;
            SearchResult sr;
            Attributes attrs;
            Attribute printerName, description, driver, locn, mediaReady, mediaAvail, shareName, uncName, shortName;
            while (results.hasMore ())
            {

                sr = (SearchResult) results.next ();
                attrs = sr.getAttributes ();

                printer = new PrinterDetails ();
                printer.setServerName (serverName);

                shortName = attrs.get (SHORT_NAME);
                if (shortName == null)
                {
                    printer.setShortServerName ("");
                }
                else
                {
                    printer.setShortServerName ((String) shortName.get (0));
                }

                printerName = attrs.get (PRINTER_NAME);
                if (printerName == null)
                {
                    printer.setPrinterName ("");
                }
                else
                {
                    printer.setPrinterName ((String) printerName.get (0));
                }

                // printer.setUNCName("\\\\" + serverName + "\\" + printer.getPrinterName());
                uncName = attrs.get (UNC_NAME);
                if (uncName == null)
                {
                    printer.setUNCName ("");
                }
                else
                {
                    printer.setUNCName ((String) uncName.get (0));
                }

                description = attrs.get (DESCRIPTION);
                if (description == null)
                {
                    printer.setDescription ("");
                }
                else
                {
                    // defect 754 always set the description to null, descriptions may have
                    // unparsable XML characters in. Will be replaced by framework 9.0.32
                    // printer.setDescription((String)description.get(0));
                    log.warn ("Caseman framework override to exclude printer descripton");
                    printer.setDescription ("");
                }

                driver = attrs.get (DRIVER);
                if (driver == null)
                {
                    printer.setDriverName ("");
                }
                else
                {
                    printer.setDriverName ((String) driver.get (0));
                }

                locn = attrs.get (LOCATION);
                if (locn == null)
                {
                    printer.setLocation ("");
                }
                else
                {
                    printer.setLocation ((String) locn.get (0));
                }

                mediaReady = attrs.get (MEDIA_READY);
                if (mediaReady == null)
                {
                    printer.setPrintMediaReady ("");
                }
                else
                {
                    printer.setPrintMediaReady ((String) mediaReady.get (0));
                }

                mediaAvail = attrs.get (MEDIA_SUPPORTED);
                if (mediaAvail == null)
                {
                    printer.setPrintMediaSupported ("");
                }
                else
                {
                    final StringBuffer availStr = new StringBuffer ();
                    for (int i = 0; i < mediaAvail.size (); i++)
                    {
                        if (i > 0)
                        {
                            availStr.append ("; ");
                        }
                        availStr.append ((String) mediaAvail.get (i));
                    }
                    printer.setPrintMediaSupported (availStr.toString ());
                }

                shareName = attrs.get (SHARE_NAME);
                if (shareName == null)
                {
                    printer.setPrintShareName ("");
                }
                else
                {
                    printer.setPrintShareName ((String) shareName.get ());
                }

                printers.add (printer);
            }
        }
        catch (final NamingException ne)
        {
            throw new SystemException (ne);
        }
        catch (final JDOMException je)
        {
            throw new SystemException (je);
        }

        return printers;
    }

    /**
     * (non-Javadoc)
     * Get the fap id for the court.
     *
     * @param paramString the param string
     * @return the server name for court
     * @throws SystemException the system exception
     */
    private String getServerNameForCourt (final String paramString) throws SystemException
    {

        String serverName = null;
        try
        {
            final Document fapDoc = proxy.getJDOM (COURT_SERVICE, GET_FAP_METHOD, paramString);
            final XPath fapIdXP = XPath.newInstance ("/Court/CourtDetails/FAPId");
            final Element fapId = (Element) fapIdXP.selectSingleNode (fapDoc.getRootElement ());
            if (fapId == null || fapId.getText ().equals (""))
            {
                throw new SystemException (NO_FAP_SERVER);
            }
            serverName = fapId.getText ();
        }
        catch (final BusinessException be)
        {
            throw new SystemException (be);
        }
        catch (final JDOMException je)
        {
            throw new SystemException (je);
        }

        return serverName;
    }
}
