/*
 * Created on 27-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.serversecret;

import java.util.Calendar;
import java.util.Random;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.security.ByteStreamEncoder;

/**
 * @author Imran Patel
 */
public class StandardSecretGenerationStrategy implements
		SecretGenerationStrategy {

	/**
	 * Constructor
	 */
	public StandardSecretGenerationStrategy(ByteStreamEncoder encoder, int expiryInterval, int expiryIntervalType) {
		super();
		
		this.encoder = encoder;
		this.expiryInterval = expiryInterval;
		this.expiryIntervalType = expiryIntervalType;
	}

	/**
	 * Generates a base 16 encoded, byte array of a random length
	 * 
	 * @return String containing the byte array encoded in base 16
	 * @throws SystemException
	 */
	public String generateSecret() throws SystemException {
		Random numGenerator = new Random();
		
		// generate a random number between 128 and 512 for the length of the byte array
		int length = numGenerator.nextInt(MAX_SECRET_LENGTH - MIN_SECRET_LENGTH) + MIN_SECRET_LENGTH;
		byte[] secretBytes = new byte[length];
			
		// now randomly generate the bytes
		numGenerator.nextBytes(secretBytes);
			
		// now encode the bytes as a String
		return encoder.encode(secretBytes);
	}
	
	/**
	 * @see uk.gov.dca.db.security.serversecret.SecretGenerationStrategy#getNewExpiryDate()
	 */
	public Calendar getNewExpiryDate() {
		Calendar now = Calendar.getInstance();
		now.add(expiryIntervalType, expiryInterval);
		
		return now;
	}

	private static final int MIN_SECRET_LENGTH = 128;
	private static final int MAX_SECRET_LENGTH = 512;

	private ByteStreamEncoder encoder = null;
	
	private int expiryInterval = 0;
	private int expiryIntervalType = 0;
}
