package uk.gov.dca.db.log4j.filter;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.apache.log4j.Priority;
import org.apache.log4j.spi.Filter;
import org.apache.log4j.spi.LoggingEvent;

/**
 * This Filter is only to change the password logged by some projects to asteriks ****** : 
 * @author Peter Neil
 *
 */
public class RegExReplace extends Filter {

	private static final String DEFAULT_SEARCH_FOR = "Login Failed for user: 'fzzjsd', pass: 'Password01'. Reason: Logon failure: unknown user name or bad password.";
	private static final String DEFAULT_SEARCH_REG_EX = "(.*)\\b(pass)\\b:\\W'(.*)'(.*)";
	private static final Pattern DEFAULT_SEARCH_REG_EX_PATTERN = Pattern.compile(DEFAULT_SEARCH_REG_EX, Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
	
	private String searchFor = "";
	private String searchRegEx = "";
	private Pattern searchPattern = null;
	private boolean acceptOnMatch = true;
	
	private String filterIndexes = "2"; // comma separated list of matches to be "filtered" 
	private String filterString = "'filtered'"; // comma seperated list of strings to use to filter out the matches
	
	public RegExReplace() {
		super();
		searchFor = DEFAULT_SEARCH_FOR;
		searchRegEx = DEFAULT_SEARCH_REG_EX;
		searchPattern = DEFAULT_SEARCH_REG_EX_PATTERN;
	}

	public int decide(LoggingEvent logEvent) {
		switch(logEvent.getLevel().toInt()){
			case Priority.ERROR_INT:
				boolean found = doFilter(logEvent);
				if(found && getAcceptOnMatch()){
					return Filter.ACCEPT;
				}
				if(found && !getAcceptOnMatch()){
					return Filter.DENY;
				}
			default:
				// we are always going to accept
				return Filter.ACCEPT;
		}
	}

	private boolean doFilter(LoggingEvent logEvent){
		// split the filter string and filterIndexes
		Matcher matches = searchPattern.matcher(logEvent.getMessage().toString());
		if(matches.find()){
			return true;
		}		
		return false;
	}

	
	/**
	 */
	public static void main(String[] args) {
		RegExReplace spf = new RegExReplace();
		/**
		 * LoggingEvent(String fqnOfCategoryClass, Category category, Priority priority, Object message, Throwable throwable)
		 */ 
		LoggingEvent logEvent = 
			new 
		   LoggingEvent("fqnOfCategoryClass", Logger.getInstance(RegExReplace.class),Priority.ERROR,spf.searchFor,new Exception("The Exception")); 
		System.out.println("Result: " + spf.doReplace(logEvent));
		
		System.out.println("accept: " + Filter.ACCEPT + ", deny: " + Filter.DENY);
		System.out.println("Decision: " + spf.decide(logEvent));
		
		
		
	}

	private String doReplace(LoggingEvent logEvent){

		// split the filter string and filterIndexes
		HashMap missMap = new HashMap();
		String[] newStrings = filterString.split(",");
		String[] misses = filterIndexes.split(",");
		for(int i=0;i<misses.length;i++){
			// you can use a single replace string or there must be one for every filtered match
			if(newStrings.length>0){
				missMap.put(misses[i],newStrings[i]);
			}
			else{
				missMap.put(misses[i],newStrings[0]);
			}
		}
		String result = "";
		System.out.println("Looking in: " + searchFor);
		Matcher matches = searchPattern.matcher(logEvent.getMessage().toString());
		if(matches.find()){
			
			System.out.println("matches.group(1): " + matches.group(1));
			System.out.println("matches.groupCount(2): " + matches.group(2));
			System.out.println("matches.groupCount(3): " + matches.group(3));
			
			System.out.println("matches.groupCount(): " + matches.groupCount());
			for(int f=1;f<=matches.groupCount();f++){
				String replaceWith = (String)missMap.get(f-1+"");
				System.out.println("key: " + f + " replaceWith: " + replaceWith);
				if(replaceWith!=null){
					result += replaceWith;
				}
				else{
					result += matches.group(f);
				}			
			}
		}
		return result;
	}

	
	public String getFilterIndexes() {
		return filterIndexes;
	}

	public void setFilterIndexes(String filterIndexes) {
		this.filterIndexes = filterIndexes;
	}

	public String getFilterString() {
		return filterString;
	}

	public void setFilterString(String filterString) {
		this.filterString = filterString;
	}

	public String getSearchRegEx() {
		return searchRegEx;
	}

	public void setSearchRegEx(String searchRegEx) {
		this.searchRegEx = searchRegEx;
	}

	public boolean getAcceptOnMatch() {
		return acceptOnMatch;
	}

	public void setAcceptOnMatch(boolean acceptOnMatch) {
		this.acceptOnMatch = acceptOnMatch;
	}

}

