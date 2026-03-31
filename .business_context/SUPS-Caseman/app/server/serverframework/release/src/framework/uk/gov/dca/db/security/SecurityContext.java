/*
 * Created on 08-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.serversecret.SecretServer;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SecurityContext {
	
	/**
	 * Constructor
	 * 
	 * @param encoder
	 * @param byteStreamEncoder
	 * @param secretServer
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public SecurityContext(IMessageEncoder encoder, ByteStreamEncoder byteStreamEncoder, SecretServer secretServer) throws BusinessException, SystemException {
		super();
		this.encoder = encoder;
		this.byteStreamEncoder = byteStreamEncoder;
		this.secretServer = secretServer;
	}
		
	/**
	 * Returns the session key for the current session of the specified user.
	 * 
	 * @param userId
	 * @return String representing the encoded session key for the specified user's session
	 * @throws SystemException
	 * @throws BusinessException
	 */
	public String getSessionKey(String userId) throws BusinessException, SystemException {	
		StringBuffer buffer = new StringBuffer(userId);
		buffer.append(secretServer.getSecret());
		
		byte[] keyBytes = encoder.encode(buffer.toString());
		String key = byteStreamEncoder.encode(keyBytes);
			
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
	 * @throws SystemException
	 * @throws BusinessException
	 */
	public String getMac(String userId, String params) throws BusinessException, SystemException {
		
		StringBuffer buffer = new StringBuffer();
		if(params !=null && !params.equals(""))
			buffer.append(params);
		
		buffer.append(userId);
		String sessionKey = getSessionKey(userId);
		buffer.append(sessionKey);
		byte[] result = encoder.encode(buffer.toString());
		
		return byteStreamEncoder.encode(result);
	}
    
	private Map sessionKeyCache = new HashMap();
	private Calendar cacheDate = Calendar.getInstance();
	private SecretServer secretServer = null;
	private IMessageEncoder encoder = null;
	private ByteStreamEncoder byteStreamEncoder = null;
}
