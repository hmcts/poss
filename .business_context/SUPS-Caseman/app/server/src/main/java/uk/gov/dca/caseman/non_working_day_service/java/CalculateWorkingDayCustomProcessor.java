/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 1.0$
 * $Author: Saneep Mullangi$
 * $Date: $
 * $Id: $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.non_working_day_service.java;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class CalculateWorkingDayCustomProcessor.
 *
 * @author Sandeep Mullangi
 * 
 *         This service calculates a working day in future or in past by accounting
 *         for nonWorkingDays and the weekends
 */
public class CalculateWorkingDayCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /** The date format in. */
    private SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

    /** The Constant NON_WORKING_DAYS_SERVICE. */
    public static final String NON_WORKING_DAYS_SERVICE = "ejb/NonWorkingDayServiceLocal";
    
    /** The Constant GET_NON_WORKING_DAYS_METHOD. */
    public static final String GET_NON_WORKING_DAYS_METHOD = "getNonWorkingDaysLocal";
    
    /** The non working days. */
    private Element nonWorkingDays = null;

    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (CalculateWorkingDayCustomProcessor.class);
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (CalculateWorkingDayCustomProcessor.class);

    /**
     * Constructor.
     */
    public CalculateWorkingDayCustomProcessor ()
    {
        proxy = new SupsLocalServiceProxy ();

    }

    /**
     * {@inheritDoc}
     */
    public Document process (final Document inputParameters, final Log pLog) throws SystemException, BusinessException
    {

        try
        {

            final String SERVICE_DATE_PARAM = "/params/param[@name='serviceDate']";
            final String REQ_WORKING_DAYS_PARAM = "/params/param[@name='reqWorkingDays']";
            final String IN_FUTURE_PARAM = "/params/param[@name='inFuture']";
            final String NON_WORKING_DAYS = "/NonWorkingDays";
            final XMLOutputter myOutputter = new XMLOutputter ();

            Element myElement = (Element) XPath.selectSingleNode (inputParameters, SERVICE_DATE_PARAM);
            final String strServiceDate = myElement.getTextTrim ();
            myElement = (Element) XPath.selectSingleNode (inputParameters, REQ_WORKING_DAYS_PARAM);
            final int reqWorkingDays = Integer.parseInt (myElement.getTextTrim ());
            myElement = (Element) XPath.selectSingleNode (inputParameters, IN_FUTURE_PARAM);
            final boolean inFuture = "true".equalsIgnoreCase (myElement.getTextTrim ()) ? true : false;

            // get all the non-working days; since they can be updated by the system admin,
            // they are not made static .
            Document response = null;
            response = invokeLocalServiceProxy (NON_WORKING_DAYS_SERVICE, GET_NON_WORKING_DAYS_METHOD, inputParameters);
            nonWorkingDays = (Element) XPath.selectSingleNode (response, NON_WORKING_DAYS);

            // converting string to date
            final GregorianCalendar serviceDate = new GregorianCalendar ();
            serviceDate.setTime (dateFormatIn.parse (strServiceDate));

            // algorithm for calculations
            boolean stopFlag = false;
            int numOfWorkingDays = 0, numOfDaysChecked = 0;

            if (inFuture)
            {
                serviceDate.add (Calendar.DAY_OF_MONTH, 1);
            }
            else
            {
                serviceDate.add (Calendar.DAY_OF_MONTH, -1);
            }

            while (numOfWorkingDays != reqWorkingDays && !stopFlag)
            {
                if ( !isWeekendDate (serviceDate) && !isNonWorkingDay (serviceDate))
                {
                    numOfWorkingDays++;
                }

                if (numOfWorkingDays < reqWorkingDays)
                {
                    if (inFuture)
                    {
                        serviceDate.add (Calendar.DAY_OF_MONTH, 1);
                    }
                    else
                    {
                        serviceDate.add (Calendar.DAY_OF_MONTH, -1);
                    }
                }

                numOfDaysChecked++;

                if (numOfDaysChecked >= 14)
                {
                    stopFlag = true;
                }
            }

            final Element node = new Element ("workingDay");
            node.setText (dateFormatIn.format (serviceDate.getTime ()));
            final Element root = new Element ("ds");
            root.addContent (node);
            response = new Document (root);
            return response;

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final NumberFormatException nfe)
        {
            throw new SystemException (nfe);
        }
        catch (final ParseException pe)
        {
            throw new SystemException (pe);
        }

    }

    /**
     * Returns true if the date is a weekend.
     *
     * @param checkDate the check date
     * @return true, if is weekend date
     */
    public boolean isWeekendDate (final GregorianCalendar checkDate)
    {

        if (checkDate.get (Calendar.DAY_OF_WEEK) == Calendar.SUNDAY ||
                checkDate.get (Calendar.DAY_OF_WEEK) == Calendar.SATURDAY)
        {
            return true;
        }
        return false;
    }

    /**
     * checks the nonWorkingDays xml list if the input date is present.
     *
     * @param checkDate the check date
     * @return true, if is non working day
     * @throws JDOMException the JDOM exception
     */
    public boolean isNonWorkingDay (final GregorianCalendar checkDate) throws JDOMException
    {

        final String dateToSearch = dateFormatIn.format (checkDate.getTime ());

        final XPath xpath = XPath.newInstance ("/NonWorkingDays/NonWorkingDay[Date=\"" + dateToSearch + "\"");
        final Element element = (Element) xpath.selectSingleNode (nonWorkingDays);

        if (element == null)
        {
            return false;
        }
        return true;
    }

}
