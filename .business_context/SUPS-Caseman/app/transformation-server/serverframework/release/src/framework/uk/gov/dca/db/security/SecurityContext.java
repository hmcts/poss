/*
 * Created on 08-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SecurityContext {

	/**
	 * constructor
	 * 
	 * @param encoder a message encoder implementation to construct keys and codes
	 * @param byteStreamEncoder a byte stream encoder to encode an array of bytes within a String
	 * @param sessionKeySecret a secret piece of information known only to the server used to generate session keys
	 */
	public SecurityContext(IMessageEncoder encoder, ByteStreamEncoder byteStreamEncoder, String sessionKeySecret) {
		super();
		this.encoder = encoder;
		this.byteStreamEncoder = byteStreamEncoder;
		this.secret = sessionKeySecret;
	}
		
	/**
	 * Returns the session key for the current session of the specified user.
	 * 
	 * @param userId
	 * @return String representing the encoded session key for the specified user's session
	 * @throws EncodingException if an error occurrs whilst creating the session key
	 */
	public String getSessionKey(String userId) throws EncodingException, SystemException {
		
		if(isCacheStale()) {
			// invalidate the cache if it is stale i.e. if items in the cache could have expired.
			invalidateCache();
		}
		
		String key = (String) sessionKeyCache.get(userId);
		if(key == null) {
			
			StringBuffer buffer = new StringBuffer(userId);
			
			// append today's date
			Date today = new Date();
			DateFormat formatter = DateFormat.getDateInstance();
			buffer.append(formatter.format(today));
			
			// append a secret piece of information known only to the server
			buffer.append(secret);
					
			byte[] keyBytes = encoder.encode(buffer.toString());
			key = byteStreamEncoder.encode(keyBytes);
			sessionKeyCache.put(userId, key);
		}
	
		return key;
	}
	
	/**
	 * Returns the message authentication code for the message sent by the user specified.  The message authentication code can be compared
	 * against the message authentication code generated on the client to check that the message was sent by a valid user with a valid, 
	 * active session.
	 * 
	 * @param userId
	 * @param params
	 * @return String representing the encoded message authentication code for the specified message and user.
	 * @throws EncodingException if an error occurrs whilst constructing the MAC
	 */
	public String getMac(String userId, String params) throws EncodingException, SystemException {
		
		StringBuffer buffer = new StringBuffer(params);
		buffer.append(userId);
		buffer.append(getSessionKey(userId));

		byte[] result = encoder.encode(buffer.toString());
		
		return byteStreamEncoder.encode(result);
	}

	/**
	 * Determines whether the cache is stale i.e. if the session keys stored in the cache may have expired.
	 * 
	 * @return true if the cache is stale
	 */
	private boolean isCacheStale() {
		Calendar today = Calendar.getInstance();
		
		return (!(today.get(Calendar.DAY_OF_YEAR) == cacheDate.get(Calendar.DAY_OF_YEAR)
				&& today.get(Calendar.YEAR) == cacheDate.get(Calendar.YEAR)));
	}
	
	/**
	 * Invalidates the cache to force requested session keys to be freshly generated.
	 *
	 */
	private void invalidateCache() {
		sessionKeyCache.clear();
		cacheDate = Calendar.getInstance();
	}
	
	private String secret = null;
	
	private Map sessionKeyCache = new HashMap();
	private Calendar cacheDate = Calendar.getInstance();
	
	private IMessageEncoder encoder = null;
	private ByteStreamEncoder byteStreamEncoder = null;
}
