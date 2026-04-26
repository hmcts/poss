/*
 * Created on 12-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.ArrayList;
import java.util.List;

/**
 * Simple representation of an XML Element.
 * 
 * @author Michael Barker
 *
 */
public class MapElement {

    private List attributes;
    private List texts;
    private List elements;
    private String name;
    
    public MapElement(String name) {
        this.name = name;
        attributes = new ArrayList();
        texts = new ArrayList();
        elements = new ArrayList();
    }
    
    public String getName() {
        return name;
    }
    
    public void addText(MapNode node) {
        texts.add(node);
    }
    
    public void addElement(MapElement element) {
        elements.add(element);
    }
    
    public void addAttribute(MapNode node) {
        attributes.add(node);
    }
    
    public List getAttributes() {
        return attributes;
    }
    
    public List getTexts() {
        return texts;
    }
    
    public List getElements() {
        return elements;
    }
    
    public String toString() {
        return getName();
    }
    
}
