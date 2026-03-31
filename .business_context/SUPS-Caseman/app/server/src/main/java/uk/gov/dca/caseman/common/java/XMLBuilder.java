/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: $
 * $Author: $
 * $Date: $
 * $Id: $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.common.java;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

/**
 * Class: XMLBuilder.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 17-Feb-2005
 *         Description:
 *         Helper class which takes some of the repeation out of creating XML Document objects.
 * 
 *         Change History:
 *         29-Jul-2005 Phil Haferer (EDS): Added the signature - "add(Element, String, Element)".
 */

/**
 * Change History:
 * 18-Sep-2008 Sandeep Mullangi (Logica): Added removeParam method
 */
public class XMLBuilder
{
    
    /** The Constant TAG_PARAMS. */
    private static final String TAG_PARAMS = "params";
    
    /** The Constant TAG_PARAM. */
    private static final String TAG_PARAM = "param";

    /**
     * Returns a new parameters element attached to the passed empty document.
     * 
     * @param pDocument The empty parameters document.
     * @return The document containing the new parameters element.
     */
    public static Element getNewParamsElement (final Document pDocument)
    {
        final Element paramsElement = new Element (TAG_PARAMS);
        pDocument.setRootElement (paramsElement);
        return paramsElement;
    } // getNewParamsElement()

    /**
     * Gets the new params element.
     *
     * @return the new params element
     */
    public static Element getNewParamsElement ()
    {
        return new Element (TAG_PARAMS);
    } // getNewParamsElement()

    /**
     * Adds a new parameters element to the passed parent element and attaches
     * the passed child element to it.
     * 
     * @param pParamsElement The parent parameters element.
     * @param pChildElement The child element.
     */
    public static void addParam (final Element pParamsElement, final Element pChildElement)
    {
        Element paramElement = null;
        Element childElement = null;

        paramElement = new Element (TAG_PARAM);
        childElement = (Element) pChildElement.clone ();
        childElement = (Element) childElement.detach ();
        paramElement.addContent (pChildElement);
        pParamsElement.addContent (paramElement);

    } // addParam()

    /**
     * Adds a new parameters element to the passed parent element and attaches
     * the passed parameter content string to it.
     * 
     * @param pParamsElement The parent parameters element.
     * @param pParamName The parameter name.
     * @param pParamContent The parameter content string.
     */
    public static void addParam (final Element pParamsElement, final String pParamName, final String pParamContent)
    {
        Element paramElement = null;

        paramElement = new Element (TAG_PARAM);
        paramElement.setAttribute ("name", pParamName);
        paramElement.addContent (pParamContent);
        pParamsElement.addContent (paramElement);
    } // addParam()

    /**
     * Adds a new parameters element to the passed parent element and attaches
     * the passed parameter content element to it.
     * 
     * @param pParamsElement The parent parameters element.
     * @param pParamName The parameter name.
     * @param pParamContent The parameter content element.
     */
    public static void addParam (final Element pParamsElement, final String pParamName, final Element pParamContent)
    {
        Element paramElement = null;

        paramElement = new Element (TAG_PARAM);
        paramElement.setAttribute ("name", pParamName);
        paramElement.addContent (pParamContent);
        pParamsElement.addContent (paramElement);

    } // addParam()

    /**
     * Adds a new element to the passed parent element and attaches
     * the passed element content string to it.
     * 
     * @param pParentElement The parent element.
     * @param pElementName The element name.
     * @param pElementContent The element content.
     * @return The newly added element.
     */
    public static Element add (final Element pParentElement, final String pElementName, final String pElementContent)
    {
        final Element newElement = new Element (pElementName);
        newElement.addContent (pElementContent);
        pParentElement.addContent (newElement);

        return newElement;
    } // add()

    /**
     * Adds a new element to the passed parent element.
     * 
     * @param pParentElement The parent element.
     * @param pElementName The element name.
     * @return The newly added element.
     */
    public static Element add (final Element pParentElement, final String pElementName)
    {
        final Element newElement = new Element (pElementName);
        pParentElement.addContent (newElement);

        return newElement;
    } // add()

    /**
     * Adds a new element to the passed parent element and attaches
     * the passed element content to it.
     * 
     * @param pParentElement The parent element.
     * @param pElementName The element name.
     * @param pElementContent The element content.
     * @return The newly added element.
     */
    public static Element add (final Element pParentElement, final String pElementName, final Element pElementContent)
    {
        final Element newElement = new Element (pElementName);
        newElement.addContent (pElementContent);
        pParentElement.addContent (newElement);

        return newElement;
    } // add()

    /**
     * Returns the element value for the passed xpath and element.
     *
     * @param pSourceElement The source element.
     * @param pXPath The xpath.
     * @return The element value.
     * @throws JDOMException the JDOM exception
     */
    public static String getXPathValue (final Element pSourceElement, final String pXPath) throws JDOMException
    {
        String sValue = null;
        Element element = null;

        element = (Element) XPath.selectSingleNode (pSourceElement, pXPath);
        if (null != element)
        {
            sValue = element.getText ();
        }

        return sValue;
    } // getXPathValue()

    /**
     * Sets the element value for the passed xpath, element and value to set.
     *
     * @param pSourceElement The source element.
     * @param pXPath The xpath.
     * @param pValue The value to set.
     * @throws JDOMException the JDOM exception
     */
    public static void setXPathValue (final Element pSourceElement, final String pXPath, final String pValue)
        throws JDOMException
    {
        Element element = null;

        element = (Element) XPath.selectSingleNode (pSourceElement, pXPath);
        // element.addContent(pValue);
        element.setText (pValue);
    } // setXPathValue()

    /**
     * Removes the param from the passed parent element.
     *
     * @param pParamsElement the params element
     * @param pParamName the param name
     */

    public static void removeParam (final Element pParamsElement, final String pParamName)
    {

        final Iterator<Element> itr = pParamsElement.getChildren (TAG_PARAM).iterator ();

        final List<Element> param_list = new ArrayList<>();
        Element element = null;
        Attribute attribute = null;
        while (itr.hasNext ())
        {
            element = (Element) itr.next ();
            attribute = element.getAttribute ("name");
            if (attribute != null)
            {
                if ( !pParamName.equals (attribute.getValue ()))
                {
                    param_list.add (element);
                }
            }
        }

        if (pParamsElement.removeChildren (TAG_PARAM))
        {
            // add the new list to the params parent element
            pParamsElement.addContent (param_list);
        }

    }

} // class XMLBuilder
