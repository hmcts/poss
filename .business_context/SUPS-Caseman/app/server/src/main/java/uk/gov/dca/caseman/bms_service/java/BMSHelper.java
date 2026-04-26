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
package uk.gov.dca.caseman.bms_service.java;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.CalendarHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: BMSHelper.java
 * Created: Phil Haferer (EDS) 26-Apr-2005
 * Description:
 * Provides helper functions relating to BMS.
 * 
 * @author Phil Haferer
 *
 *         Change History:
 *         01/02/2010 - Chris Vincent, Trac 2651. Changed the GET_NON_WORKING_DAYS_COUNT_METHOD constant
 *         to a new method which returns a list of non working days in a date range rather than a count
 *         of the number of non working days in the range.
 */
public class BMSHelper
{

    /** The Constant NON_WORKING_DAYS_SERVICE. */
    // Service.
    private static final String NON_WORKING_DAYS_SERVICE = "ejb/NonWorkingDayServiceLocal";
    
    /** The Constant GET_NON_WORKING_DAYS_COUNT_METHOD. */
    // Methods.
    private static final String GET_NON_WORKING_DAYS_COUNT_METHOD = "getNonWorkingDaysInRangeLocal";

    /** The Constant BMS_SERVICE. */
    // Service.
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";
    
    /** The Constant GET_AGE_CATEGORY_METHOD. */
    // Methods.
    private static final String GET_AGE_CATEGORY_METHOD = "getAgeCategoryLocal";

    /**
     * Determines the task age.
     *
     * @param pReceiptDate The receipt date
     * @param pProcessingDate The processing date
     * @return The task age
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static String determineTaskAge (final Calendar pReceiptDate, final Calendar pProcessingDate)
        throws SystemException, BusinessException, JDOMException
    {
        String ageCategory = null;
        Calendar currentDate = null;
        Element dsElement = null;
        List<Element> dayElementList = null;
        long taskAge = 0;

        try
        {
            taskAge = CalendarHelper.differenceDays (pReceiptDate, pProcessingDate);
            if (taskAge >= 0)
            {
                currentDate = new GregorianCalendar ();
                currentDate.setTime (pReceiptDate.getTime ());

                // Remove Weekend days from the task age count.
                while ( !currentDate.equals (pProcessingDate))
                {
                    if (mIsWeekend (currentDate))
                    {
                        taskAge--;
                    }
                    currentDate.add (Calendar.DATE, 1);
                }

                // ...and remove non-working days.
                dsElement = mGetNonWorkingDays (pReceiptDate, pProcessingDate);
                dayElementList = XPath.selectNodes (dsElement, "//Day");
                taskAge = taskAge - dayElementList.size ();

                // Add one if the processing date is on a bank holiday.
                if (mIsNonWorkingDay (pProcessingDate, dayElementList))
                {
                    taskAge++;
                }

                ageCategory = mGetAgeCategory (taskAge);
            } // if (taskAge >= 0)
        }
        finally
        {
            currentDate = null;
        }

        return ageCategory;
    } // mDetermineTaskAge()

    /**
     * (non-Javadoc)
     * Determine if day is Sat or Sunday.
     *
     * @param pCalendar the calendar
     * @return true, if successful
     */
    private static boolean mIsWeekend (final Calendar pCalendar)
    {
        boolean isWeekend = false;
        int dayOfWeek = 0;

        dayOfWeek = pCalendar.get (Calendar.DAY_OF_WEEK);
        switch (dayOfWeek)
        {
            case Calendar.SATURDAY:
                isWeekend = true;
                break;
            case Calendar.SUNDAY:
                isWeekend = true;
                break;
        }

        return isWeekend;
    } // mIsWeekend()

    /**
     * (non-Javadoc)
     * Retrieve non working days via a service call and return them as XML.
     *
     * @param pReceiptDate the receipt date
     * @param pProcessingDate the processing date
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element mGetNonWorkingDays (final Calendar pReceiptDate, final Calendar pProcessingDate)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        AbstractSupsServiceProxy localServiceProxy = null;
        Element dsElement = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "receiptDate", CalendarHelper.toString (pReceiptDate));
            XMLBuilder.addParam (paramsElement, "processingDate", CalendarHelper.toString (pProcessingDate));

            // Turn the XML into a string, and call the service.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            localServiceProxy = new SupsLocalServiceProxy ();
            dsElement =
                    localServiceProxy.getJDOM (NON_WORKING_DAYS_SERVICE, GET_NON_WORKING_DAYS_COUNT_METHOD, sXmlParams)
                            .getRootElement ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            localServiceProxy = null;
        }

        return dsElement;
    } // mGetNonWorkingDays()

    /**
     * (non-Javadoc)
     * Determine if a date is a non-working day.
     *
     * @param pDate the date
     * @param pDayElementList the day element list
     * @return true, if successful
     */
    private static boolean mIsNonWorkingDay (final Calendar pDate, final List<Element> pDayElementList)
    {
        boolean bankHoliday = false;
        String sDate = null;
        Element dayElement = null;

        sDate = CalendarHelper.toString (pDate);
        for (Iterator<Element> iterator = pDayElementList.iterator (); iterator.hasNext ();)
        {
            dayElement = (Element) iterator.next ();
            if (sDate.equals (dayElement.getText ()))
            {
                bankHoliday = true;
                break;
            }
        }

        return bankHoliday;
    } // mIsNonWorkingDay()

    /**
     * (non-Javadoc)
     * Get BMS age category via a service call.
     *
     * @param pTaskAge the task age
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private static String mGetAgeCategory (final long pTaskAge) throws SystemException, BusinessException, JDOMException
    {
        String ageCategory = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        AbstractSupsServiceProxy localServiceProxy = null;
        Element dsElement = null;
        Element ageCategoryElement = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "taskAge", Long.toString (pTaskAge));

            // Turn the XML into a string, and call the service.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            localServiceProxy = new SupsLocalServiceProxy ();
            dsElement = localServiceProxy.getJDOM (BMS_SERVICE, GET_AGE_CATEGORY_METHOD, sXmlParams).getRootElement ();
            if (null != dsElement)
            {
                ageCategoryElement = (Element) XPath.selectSingleNode (dsElement, "/ds/AgeCategory");
                if (null != ageCategoryElement)
                {
                    ageCategory = ageCategoryElement.getText ();
                }
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            localServiceProxy = null;
            dsElement = null;
            ageCategoryElement = null;
        }

        return ageCategory;
    } // mGetAgeCategory()

} // class BMSHelper
