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
package uk.gov.dca.caseman.reports_service.classes;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import org.jdom.Element;

/**
 * General static builder utilities.
 * <p>
 * 
 * @author Alex Peterson
 */
public class BuilderUtils
{
    /**
     * Parses a "group" Element extracting both "CommonParameters" and "Parameters" into a List of "row" Elements.
     * <p>
     * The Elements in each "row" are made up as follows:
     * <ul>
     * <li>Elements named according to the value of the Column "name" attributes in the "CommonParameters" Element.
     * <li>Elements named according to the value of the Column "name" attributes in a single "Parameters" Element.
     * </ul>
     * 
     * @param groupEl The group element.
     * @return The row elements.
     */
    public static List<Element> parameterRowsFromGroup (final Element groupEl)
    {
        final List<Element> rowEls = new ArrayList<Element> ();

        // Parse the CommonParameters element into a new template row element
        final Element rowTemplate = commonRowFromGroup (groupEl);

        // Get input Parameters elements
        final List<Element> paramEls = groupEl.getChildren ("Parameter");

        // Parse each Parameter
        final ListIterator<Element> paramElsIter = paramEls.listIterator ();
        while (paramElsIter.hasNext ())
        {
            final Element paramEl = (Element) paramElsIter.next ();
            // Get input Columns
            final List<Element> columnEls = paramEl.getChildren ("Column");

            // Parse each Column into a new copy of the template row
            final Element row = (Element) rowTemplate.clone ();
            final List<Element> newEls = elementsFromAttributes (columnEls);
            row.addContent (newEls);

            // Add the new complete row to the output
            rowEls.add (row);
        }

        return rowEls;
    }

    /**
     * Parses the parameters element into a new template row element.
     * 
     * @param groupEl The group parameters element
     * @return The row elements.
     */
    public static List<Element> parameterRowsFromGroupForDelete (final Element groupEl)
    {
        final List<Element> rowEls = new ArrayList<Element>();

        // Parse the CommonParameters element into a new template row element
        final Element rowTemplate = commonRowFromGroup (groupEl);

        // Add the new complete row to the output
        rowEls.add (rowTemplate);

        return rowEls;
    }

    /**
     * Parses the parameters element into a new template row element for text items.
     * 
     * @param groupEl The group parameters element
     * @return The row elements.
     */
    public static List<Element> parameterRowsFromGroupForTextItems (final Element groupEl)
    {
        final List<Element> rowEls = new ArrayList<Element>();

        // Parse the TextItemCommonParameters element into a new template row element
        final Element rowTemplate = TextItemRowFromGroup (groupEl);

        // Get input Parameters elements
        final Element commonParamEl = groupEl.getChild ("TextItemCommonParameters");
        if (commonParamEl != null)
        {
            final List<Element> paramEls = commonParamEl.getChildren ("Parameter");

            // Parse each Parameter
            final ListIterator<Element> paramElsIter = paramEls.listIterator ();
            while (paramElsIter.hasNext ())
            {
                final Element paramEl = (Element) paramElsIter.next ();
                // Get input Columns
                final List<Element> columnEls = paramEl.getChildren ("Column");

                // Parse each Column into a new copy of the template row
                final Element row = (Element) rowTemplate.clone ();
                final List<Element> newEls = elementsFromAttributes (columnEls);
                row.addContent (newEls);

                // Add the new complete row to the output
                rowEls.add (row);
            }
        }
        return rowEls;
    }

    /**
     * Parses the parameters element into a new template row element for text items delete.
     * 
     * @param groupEl The group parameters element
     * @return The row elements.
     */
    public static List<Element> parameterRowsFromGroupForTextItemsDelete (final Element groupEl)
    {
        List<Element> rowEls = null;

        // Parse the TextItemCommonParameters element into a new template row element
        final Element rowTemplate = TextItemRowFromGroup (groupEl);
        if (rowTemplate != null)
        {
            rowEls = new ArrayList<Element> ();
            rowEls.add (rowTemplate);
        }
        return rowEls;
    }

    /**
     * Parses a "group" Element extracting only the "CommonParameters" into a "row" Element.
     * <p>
     * Each Element in the result row contains elements named according to the value of the source Column "name"
     * attributes.
     * 
     * @param groupEl The group element.
     * @return The row element.
     */
    public static Element commonRowFromGroup (final Element groupEl)
    {
        // Get input CommonParameters element
        final Element commonParamEl = groupEl.getChild ("CommonParameters");
        // Get input Columns
        final List<Element> columnEls = commonParamEl.getChildren ("Column");

        // Parse each Column into a new row element
        final Element row = new Element ("row");
        final List<Element> newEls = elementsFromAttributes (columnEls);
        row.addContent (newEls);

        return row;
    }

    /**
     * Parses a "group" Element extracting only the "CommonParameters" into a "row" Element.
     * <p>
     * Each Element in the result row contains elements named according to the value of the source Column "name"
     * attributes.
     * 
     * @param groupEl The group element.
     * @param elementType The element type.
     * @return The row element.
     */
    public static Element commonRowFromGroup (final Element groupEl, final String elementType)
    {
        // Get input CommonParameters element
        Element commonParamEl = null;
        if (elementType.equals ("update_ae_events"))
        {
            commonParamEl = groupEl.getChild ("CommonParameters");
        }
        if (elementType.equals ("insert_co_text_items"))
        {
            commonParamEl = groupEl.getChild ("CommonParameters");
        }
        else if (elementType.equals ("insert_hearing"))
        {
            commonParamEl = groupEl.getChild ("HearingCommonParameters");
        }
        else if (elementType.equals ("update_co_events"))
        {
            commonParamEl = groupEl.getChild ("CommonParameters");
        }
        // Get input Columns
        List<Element> columnEls = null;
        Element row = null;
        List<Element> newEls = null;
        if (commonParamEl != null)
        {
            columnEls = commonParamEl.getChildren ("Column");
            row = new Element ("row");
            newEls = elementsFromAttributes (columnEls);
            row.addContent (newEls);
        }

        // Parse each Column into a new row element
        return row;
    }

    /**
     * Returns text item row from the passed group element.
     * 
     * @param groupEl The group element.
     * @return The text item row element.
     */
    public static Element TextItemRowFromGroup (final Element groupEl)
    {
        // Get input CommonParameters element
        final Element commonParamEl = groupEl.getChild ("TextItemCommonParameters");
        // Get input Columns
        if (commonParamEl == null)
        {
            return null;
        }
        final List<Element> columnEls = commonParamEl.getChildren ("Column");

        // Parse each Column into a new row element
        final Element row = new Element ("row");
        final List<Element> newEls = elementsFromAttributes (columnEls);
        row.addContent (newEls);

        return row;
    }

    /**
     * Returns hearings row from the passed group element.
     * 
     * @param groupEl The group element.
     * @return The hearings row.
     */
    public static Element hearingsRowFromGroup (final Element groupEl)
    {
        // Get input CommonParameters element
        final Element commonParamEl = groupEl.getChild ("HearingCommonParameters");
        // Get input Columns
        if (commonParamEl == null)
        {
            return null;
        }
        final List<Element> columnEls = commonParamEl.getChildren ("Column");

        // Parse each Column into a new row element
        final Element row = new Element ("row");
        final List<Element> newEls = elementsFromAttributes (columnEls);
        row.addContent (newEls);

        return row;
    }

    /**
     * Parses a List promoting the value of a "name" attribute to the actual name of an element.
     * <p>
     * 
     * @param sourceEls a List of Elements looking like
     *            <AnySourceName name="SOURCE_ATTR_VALUE">SOURCE_EL_VALUE</AnySourceName>
     * @return an ArrayList of new Elements each looking like <SOURCE_ATTR_VALUE>SOURCE_EL_VALUE</SOURCE_ATTR_VALUE>
     */
    public static List<Element> elementsFromAttributes (final List<Element> sourceEls)
    {
        final ArrayList<Element> newEls = new ArrayList<>();

        // Parse each Column into a new Element: value of Column's "name" attribute becomes the new Element's name
        final ListIterator<Element> sourceElsIter = sourceEls.listIterator ();
        while (sourceElsIter.hasNext ())
        {
            final Element sourceEl = (Element) sourceElsIter.next ();
            final String sourceName = sourceEl.getAttributeValue ("name");
            final String sourceValue = sourceEl.getTextTrim ();
            newEls.add (new Element (sourceName).setText (sourceValue));
        }

        return newEls;
    }
}
