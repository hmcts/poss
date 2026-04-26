/*
 * Created on 29-Jan-2005
 *
 */
package uk.gov.dca.db.util;

import java.io.StringReader;

import org.xml.sax.EntityResolver;
import org.xml.sax.InputSource;

/**
 * @author Michael Barker
 *
 */
public class NoOpEntityResolver implements EntityResolver 
{
    public InputSource resolveEntity(String publicId, String systemId)
    {
        return new InputSource(new StringReader(""));
    }
} 
