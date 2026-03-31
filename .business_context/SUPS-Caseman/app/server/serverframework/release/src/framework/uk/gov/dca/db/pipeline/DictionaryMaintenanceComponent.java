package uk.gov.dca.db.pipeline;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Map;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

//import com.wallstreetwise.app.jspell.domain.JSpellDictionaryAccessor;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryEngineException;
import uk.gov.dca.db.spellchecker.DictionaryMaintainer;
import uk.gov.dca.db.util.DBUtil;

/**
 * TODO: Delete this. nickl.
 * @author ImranP
 */
public class DictionaryMaintenanceComponent extends AbstractComponent2 implements IGenerator {

		private static final String DICTIONARY_REQUEST = "DictionaryRequest";
		private static final String METHOD_ELEMENT = "Method";
		private static final String WORDS_ELEMENT = "Words";
		private static final String DICTIONARY_ID_ELEMENT = "DictionaryId";
		
		private static final String ADD_WORDS = "addWords";
		private static final String REMOVE_WORDS = "removeWords";
		private static final String CREATE_DICTIONARY = "createDictionary";
		private static final String REBUILD_DICTIONARY = "rebuildDictionary";
		
		private static final String SOURCE_FILE = "SourceFile";
		private static final String LANGUAGE = "Language";
		private static final String COUNTRY = "Country";
		private static final String VERSION = "Version";
		
		private static final String DATASOURCE_ELEMENT = "DictionaryStore";
		private static final String DIR_ELEMENT = "DictionaryDirectory";
		private static final String LANG_ELEMENT = "DictionaryLanguage";
		private static final String COUNTRY_ELEMENT = "DictionaryCountry";
		private static final String ID_ATTR = "id";
		
		private static final String ADD_STATEMENT = "INSERT INTO DICTIONARY (COURT_CODE, WORD) VALUES (?,?)";
		private static final String REMOVE_STATEMENT = "DELETE FROM DICTIONARY WHERE COURT_CODE = ? AND WORD = ?";
		
		private static final String XPATH_ATTR = "xpath";

		private String m_inputXPath = "/params/param[@name='MaintainDictionary']";
		
		private static final String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";

		private String method;
		private DataSource dictionaryStore;
		private String dictionaryDir;
		private String dictionaryLang;
		private String dictionaryCountry;
		
		/* (non-Javadoc)
		 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
		 */
		protected void process() throws BusinessException, SystemException {
			Document parameters = (Document)this.m_inputData.getData(Document.class);
	        		
			Element dictRequest = null;
			try {
				Element dictParam = (Element)XPath.selectSingleNode(parameters, m_inputXPath);
	            if (dictParam.getChildren().size() > 0) {
	            	dictRequest = dictParam;
	            }	          
			}
			catch(JDOMException e) {
				throw new BusinessException("Unable to find dictionary maintenance request using XPath '"+m_inputXPath+"'");
			}
			
			if ( dictRequest == null ) {
				throw new BusinessException("Unable to find dictionary maintenance request using XPath '"+m_inputXPath+"'");
			}
            
            handleRequest(dictRequest);

		}
		
		private void handleRequest(Element dictionaryReq) throws SystemException, BusinessException{
			
            Element methodEl = dictionaryReq.getChild(METHOD_ELEMENT);
            if(methodEl == null){
            	throw new BusinessException("No Method element was passed in the dictionary maintenance request");
            }
            
            method = methodEl.getAttributeValue("name");
            if(method == null || method.equals("")){
            	throw new BusinessException("No value was found for the Method element in the dictionary maintenance request");
            }
			
			if(method.equalsIgnoreCase(ADD_WORDS)){
				updateDictionary(true, methodEl);
			}
			else if(method.equalsIgnoreCase(REMOVE_WORDS)){
				updateDictionary(false, methodEl);
			}
			else if(method.equalsIgnoreCase(CREATE_DICTIONARY)){
				
				String sourceFile = methodEl.getChildText(SOURCE_FILE);
				String language = methodEl.getChildText(LANGUAGE);;
				String country = methodEl.getChildText(COUNTRY);;
				String version = methodEl.getChildText(VERSION);;
				
				DictionaryMaintainer spellChecker = new DictionaryMaintainer();
				spellChecker.createDictionary(sourceFile, language, country, version);
				
			}
			else {
				throw new BusinessException("Unsupported method type for dictionary maintenance: "+method);
			}
		}
		
		private void updateDictionary(boolean add, Element methodEl) throws BusinessException, SystemException{

			Connection con = null;
			PreparedStatement ps = null;
			
			try{
				try {
					con = dictionaryStore.getConnection();
					
				} catch (SQLException e) {
					throw new SystemException("Failed to retrieved connection to database for dictionary maintenance");
				}
				
				Element wordsEl = methodEl.getChild(WORDS_ELEMENT);
				if(wordsEl == null || wordsEl.getChildren().size() == 0){
					throw new BusinessException("No Words have been sent in the dictionary maintenance request");
				}
				
				String dictVersion = methodEl.getChildText("DictionaryVersion");
				if(dictVersion == null || dictVersion.equals("")){
					throw new BusinessException("No DictionaryVersion has been sent in the dictioanry maintenance request");
				}
				
				Iterator wordsItr = wordsEl.getChildren().iterator();
				
				while(wordsItr.hasNext()){
					Element wordEl = (Element) wordsItr.next();
					String word = wordEl.getValue();
					DictionaryMaintainer spellChecker = new DictionaryMaintainer(dictionaryDir, dictionaryLang, dictionaryCountry, dictVersion);
					
					if(add)
					{
						if(con != null){
							try{
								ps = con.prepareStatement(ADD_STATEMENT);
								ps.setString(1, dictVersion);
								ps.setString(2, word);
								ps.execute();
							}catch(SQLException e){
								DBUtil.quietClose(ps);
								throw new SystemException("Unable to prepare the statement to add words to the dictionary table", e);
							}
							DBUtil.quietClose(ps);
						}
	
						spellChecker.addWord(word);
					}
					else {
						if(con != null){
							try{
								ps = con.prepareStatement(REMOVE_STATEMENT);
								ps.setString(1, dictVersion);
								ps.setString(2, word);
								ps.execute();
							}catch(SQLException e){
								
								DBUtil.quietClose(ps);
								throw new SystemException("Unable to prepare the statement to remove words to the dictionary table", e);
							}
							
							DBUtil.quietClose(ps);
						}
	
						spellChecker.removeWord(word);
					}
				}
			}finally{
				DBUtil.quietClose(con);
			}
			this.m_outputData.setData( XML_HEADER, String.class);
		}

		public void validate(String methodId, QueryEngineErrorHandler handler,
				Element processingInstructions, Map preloadCache)
				throws SystemException 
		{
			readProcessingInstructions(processingInstructions, preloadCache);
			validateConfig(methodId+": ", handler);
		}

		/* (non-Javadoc)
		 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
		 */
		public void preloadCache(Element processingInstructions, Map preloadCache)
				throws SystemException {
			// Nothing to preload
		}

		/* (non-Javadoc)
		 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
		 */
		public void prepare(Element processingInstructions, Map preloadCache)
				throws SystemException 
		{
			readProcessingInstructions(processingInstructions, preloadCache);
			validateConfig(null,null);
		}
		
		/**
		 * Method to initialise the class from the processing instructions.
		 *  
		 * @param processingInstructions
		 * @throws SystemException
		 */
		private void readProcessingInstructions(Element processingInstructions, Map preloadCache)
			throws SystemException
		{
			// read in XML cfg
			if (processingInstructions == null) {
				throw new SystemException("No processing instructions passed to '"+this.getName()+"'");
			}
	        
			m_inputXPath = processingInstructions.getAttributeValue(XPATH_ATTR);
			
			Element dataSrcElement = processingInstructions.getChild(DATASOURCE_ELEMENT);
			if ( dataSrcElement != null ) 
			{
				String dsId = dataSrcElement.getAttributeValue(ID_ATTR);
				if ( dsId != null && dsId.length() > 0)
				{
					dictionaryStore = (DataSource)preloadCache.get(dsId);
				}
			}
			
			String dictionaryDirVariable = processingInstructions.getChildText(DIR_ELEMENT);
			
			dictionaryDir = (String)preloadCache.get(dictionaryDirVariable);
			
			dictionaryLang = processingInstructions.getChildText(LANG_ELEMENT);
			dictionaryCountry = processingInstructions.getChildText(COUNTRY_ELEMENT);
		}
		
		
		/**
		 * Raise error as exeption or via validation error handler, as appropriate
		 * @param msg
		 * @param handler
		 * @throws ConfigurationException
		 * @throws QueryEngineException
		 */
		private void raiseError(String msg, QueryEngineErrorHandler handler) 
			throws ConfigurationException, QueryEngineException
		{
			if ( handler == null) 
			{
				throw new ConfigurationException(msg);
			}
			else
			{
				handler.raiseError(msg);
			}
		}
		
		private void validateConfig(String msgPreface, QueryEngineErrorHandler handler) throws ConfigurationException, QueryEngineException
		{
			String preface = "";
			if ( msgPreface != null )
			{
				preface = msgPreface;
			}
			
			if ( m_inputXPath == null || m_inputXPath.length() == 0) {
				raiseError(preface+"'"+XPATH_ATTR+"' attribute required by '"+this.getName()+"'", handler);
			}
			
			if ( dictionaryStore == null ) {
				raiseError(preface+"'"+DATASOURCE_ELEMENT+"' element required by '"+this.getName()+"'", handler);
			}
			
			if ( dictionaryDir == null || dictionaryDir.equals("")) {
				raiseError(preface+"'"+DIR_ELEMENT+"' element required by '"+this.getName()+"'", handler);
			}
			
			if ( dictionaryLang == null  || dictionaryLang.equals("")) {
				raiseError(preface+"'"+LANG_ELEMENT+"' element required by '"+this.getName()+"'", handler);
			}
			
			if ( dictionaryCountry == null  || dictionaryCountry.equals("")) {
				raiseError(preface+"'"+COUNTRY_ELEMENT+"' element required by '"+this.getName()+"'", handler);
			}
		}
}

