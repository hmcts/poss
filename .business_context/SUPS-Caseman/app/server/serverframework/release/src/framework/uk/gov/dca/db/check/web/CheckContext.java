package uk.gov.dca.db.check.web;

import java.net.URL;

public class CheckContext {

	private String userName;
	private String password;
	private URL requestedURL;
	
	public CheckContext(String userName, String password){
		this.userName = userName;
		this.password = password;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getBaseURL() {
    	String port = "";
    	if((requestedURL.getPort()>-1)){
    		port = ":" + requestedURL.getPort();
    	}
    	String baseUrl =  requestedURL.getProtocol()+ "://" + requestedURL.getHost() + port;
		return baseUrl;
	}
    
    public String getLocalhostURL() {
        String port = "";
        if((requestedURL.getPort()>-1)){
            port = ":" + requestedURL.getPort();
        }
        String baseUrl =  requestedURL.getProtocol()+ "://localhost" + port;
        return baseUrl;
    }

	public void setRequestedURL(URL requestedURL) {
		this.requestedURL = requestedURL;
	}

}
