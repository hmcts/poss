/*
 * Created on 28-Nov-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.spellchecker;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.util.SUPSLogFactory;

//import com.wallstreetwise.app.jspell.console.IndexBuild;
import com.wallstreetwise.app.jspell.domain.JSpellDictionaryLocal;
import com.wallstreetwise.app.jspell.domain.JSpellErrorInfo;
import com.wallstreetwise.app.jspell.domain.JSpellParser;

/**
 * TODO: Delete this class. nickl.
 * @author ImranP
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class DictionaryMaintainer {
	
	Log log = SUPSLogFactory.getLogger(this.getClass().getName());
    JSpellDictionaryLocal jdl;
    
    public DictionaryMaintainer(){
    }
    
    public DictionaryMaintainer(String dictDirectory, String language, String country, String version) {
    	jdl=new JSpellDictionaryLocal(dictDirectory, language, country, version);
    }
    
    public void setDictionary(String dictDirectory, String language, String country, String version) {
	 	jdl=new JSpellDictionaryLocal(dictDirectory, language, country, version);
    }
    
    public void searchWord(String word){
    	
        JSpellParser jsp=null;
        JSpellErrorInfo jError;
        jdl.setIgnoreFirstCaps(true); // because we are checking a single word do not worry about case
        
        if(jdl!=null) {
        	
		  	try {
		  	    jdl.open();
		  	    jsp=new JSpellParser(jdl);
		  	} catch (Exception e) {
		  	    e.printStackTrace();
		  	}
		  	
		  	log.debug("JSpell Dictionary: "+jdl);
		  	log.debug("Searching for word: "+word);
		  	 
		  	jsp.reset();
		  	jsp.setTextString(word); // for this example the text string is a single word from the command line
		  	
		  	try {
		  	  
		  		jError=jsp.getError();
		  	  
		  		if(jError!=null){
		  	  
		  			log.debug("Misspelled Word: "+jError.getWord());
		  			log.debug("At Position: "+jError.getPosition());
		  			log.debug( "Suggestions: ");
		  			
		  			if(jError.getSuggestions()[0]==null){
		  				log.debug("None");
		  			}
		  			else 
		  			{
		  				for(int i=0;i<10 && jError.getSuggestions()[i]!=null;i++){
		  					log.debug(jError.getSuggestions()[i]+" ");
		  				}
		  			}
		  	    }
		  		else
		  	    {
		  	    	log.debug(word + "Successfully spell checked");
		  	    }
		  	 } catch (Exception e){
		  	 	log.debug("Exception encountered: "+e);
		  	    e.printStackTrace();
		  	 } 
        } 
        else 
        {
	       	log.debug("Unable to open dictionary, check parameters.");
	    }
    }
    
    public void addWord(String word){
    	
	      if(jdl!=null) {
			 try {
			    jdl.open();
			 } catch (Exception e) {
			    e.printStackTrace();
			 }
			 log.debug("JSpell Dictionary: "+jdl);
			 log.debug("Adding word: "+word);
			 // Add a word to the JSpell dictionary file
		 	jdl.learnWord(word);
	      } 
	      else {
	      	log.debug("Unable to open dictionary, check parameters.");
	      }
    	
    }
    
    public void removeWord(String word){
        if(jdl!=null) {
       	 try {
       	    jdl.open();
       	 } catch (Exception e) {
       	    e.printStackTrace();
       	 }
       	 log.debug("JSpell Dictionary: "+jdl);
       	 log.debug("Removing word: "+word);
       	 
       	 // Remove a word from the JSpell dictionary file
       	 jdl.removeWord(word);
             } else {
       	 log.debug("Unable to open dictionary, check parameters.");
             }
    }
    
    public void createDictionary(String sourceFile, String language, String country, String version){
// No requirement to create dictionaries, and IndexBuild class is elsewhere:    	
//        IndexBuild ib=new IndexBuild();
//        ib.setDict(sourceFile);
//        ib.setIndexLanguage(language);
//        ib.setIndexCountry(country);
//        ib.setVersion(version);
//        ib.build();
    }
}
