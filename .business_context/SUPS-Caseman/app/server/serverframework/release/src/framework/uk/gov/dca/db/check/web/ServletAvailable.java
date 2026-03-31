package uk.gov.dca.db.check.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.util.SUPSLogFactory;

public class ServletAvailable {
	static Log log = SUPSLogFactory.getLogger(ServletAvailable.class);

	/**
	 * @return int the http get response code
	 */
	public static synchronized String getServletStatus(String url)
			throws SystemException {

		//connect to the url
		try {
			URL destUrl = new URL(url);

			HttpURLConnection con = (HttpURLConnection) destUrl
					.openConnection();

			con.setAllowUserInteraction(false);
			con.setDoInput(true);
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setRequestMethod("GET");
			con.connect();

			String errorString = null;
			try {
                if(con.getResponseCode() == HttpURLConnection.HTTP_OK){
                    // this has to be done to force the errorStream to be generated
                    con.getInputStream();				
                }
                else{
                    con.getErrorStream();
                    errorString = readErrorStream(con, errorString, null);
                }
			} catch (IOException e) {
				errorString = readErrorStream(con, errorString, e);
			}
			finally{
				con.disconnect();
			}

			String result = "<Status><Message>" + con.getResponseMessage()
					+ "</Message><Code>" + con.getResponseCode()
					+ "</Code></Status>";
			if (errorString != null
					&& con.getResponseCode() != HttpURLConnection.HTTP_OK) {
				result = result + "<Content>" + con.getResponseCode() + "</Content>";
			}

			return result;
		} catch (Exception e) {
			log.error("Unable to connect to url: " + url, e);
		}
		return "could not locate url: " + url;

	}

    private static String readErrorStream(HttpURLConnection con, String errorString, IOException e) throws UnsupportedEncodingException, IOException {
        final InputStream errorStream = con.getErrorStream();
        if (errorStream != null) {
        	errorString = Util.readInputStream(1024, errorStream, "UTF-8");
        }
        log.info("read ErrorStream ", e);
        return errorString;
    }

}
