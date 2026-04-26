
/* Created on 07-Jun-2006 */
package uk.gov.dca.caseman.dictionary_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import com.wallstreetwise.app.jspell.domain.JSpellDictionaryLocal;
import com.wallstreetwise.app.jspell.domain.JSpellDictionaryManager;
import com.wallstreetwise.app.jspell.domain.JSpellException;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;

/**
 * The Class UpdateDictionary.
 *
 * @author Tim Grant
 */
public class UpdateDictionary implements ICustomProcessor
{

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext ctx)
    {
    }

    /**
     * {@inheritDoc}
     */
    public void process (final Document inputParameters, final Writer output, final Log log) throws SystemException
    {
        final ConfigUtil config = ConfigUtil.create (FrameworkConfigParam.PROJECT_CONFIG.getValue ());

        final String dictionaryPath = (String) config.get ("uk.gov.dca.caseman.jspell.dictionary.path");
        final String lang = (String) config.get ("uk.gov.dca.caseman.jspell.language");
        final String country = (String) config.get ("uk.gov.dca.caseman.jspell.country");

        String courtId = null;
        String operation = null;
        String word = null;
        try
        {
            courtId = ((Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='courtShortName']"))
                    .getTextTrim ();
            operation = ((Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='operation']"))
                    .getTextTrim ();
            word = ((Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='word']")).getTextTrim ();
        }
        catch (final JDOMException je)
        {
            throw new SystemException (je.toString ());
        }

        final JSpellDictionaryManager dictManager = JSpellDictionaryManager.getJSpellDictionaryManager ();
        final boolean isSet = dictManager.setDictionaryDirectory (dictionaryPath);

        if ( !isSet)
        {
            throw new SystemException ("Unable to set JSpell dictionary.");
        }

        final String label = lang + " (" + country + ") " + courtId;
        final JSpellDictionaryLocal dict = dictManager.getJSpellDictionaryLocal (label);
        if (dict == null)
        {
            throw new SystemException ("Unable to find dictionary: " + label);
        }

        if ("add".equals (operation))
        {
            try
            {
                addWord (dict, word);
            }
            catch (final JSpellException jse)
            {
                throw new SystemException (jse.toString ());
            }
        }
        else if ("remove".equals (operation))
        {
            try
            {
                removeWord (dict, word);
            }
            catch (final JSpellException jse)
            {
                throw new SystemException (jse.toString ());
            }
        }
        else
        {
            throw new SystemException ("Unknown dictionary operation: " + operation);
        }

        try
        {
            final XMLOutputter outputter = new XMLOutputter ();
            outputter.output (inputParameters.getRootElement (), output);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Adds the word.
     *
     * @param dict the dict
     * @param word the word
     * @throws JSpellException the j spell exception
     */
    private void addWord (final JSpellDictionaryLocal dict, final String word) throws JSpellException
    {
        dict.open ();
        dict.learnWord (word);
        dict.close ();
    }

    /**
     * Removes the word.
     *
     * @param dict the dict
     * @param word the word
     * @throws JSpellException the j spell exception
     */
    private void removeWord (final JSpellDictionaryLocal dict, final String word) throws JSpellException
    {
        dict.open ();
        dict.removeWord (word);
        dict.close ();
    }
}
