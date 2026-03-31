/*
 * Created on 10-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;


/**
 * Implementation of the ByteStreamEncoder interface to encode arrays of bytes in a String.  This particular implementation encodes each
 * byte as a hexadecimal (Base16) number.
 * 
 * @author JamesB
 */
public class Base16 implements ByteStreamEncoder {

	/**
	 * Constructor
	 */
	public Base16() {
		super();
	}
	
	/**
	 * Encodes a byte array into a String containing a sequence hex numbers representing the elements in the byte array.
	 * 
	 * @param bytes the byte array to encode
	 * @return a String containing a sequence of hex numbers representing the elements of the byte array
	 */
	public String encode(byte[] bytes) {
		StringBuffer hexStream = new StringBuffer(STREAM_INITIATOR);
		
		for(int i = 0; i < bytes.length; i++) {
			if(i > 0) {
				hexStream.append(BYTE_SEPERATOR);
			}
			hexStream.append(BASE_INDICATOR_PREFIX);
			String hexByte = Integer.toHexString(0xFF & bytes[i]);
			if(hexByte.length() < 2) {
				hexStream.append('0');
			}
			hexStream.append(hexByte);
		}
		
		hexStream.append(STREAM_TERMINATOR);
		
		return hexStream.toString();
	}
	
	/**
	 * Decodes a previously encoded byte stream into a byte array
	 * 
	 * @param stream a String containing a sequence of base encoded numbers representing the elements of the byte array
	 * @return a byte array containing the bytes from the stream
	 */
	public byte[] decode(String stream) throws EncodingException {
		
		int startIndex = stream.indexOf(STREAM_INITIATOR);
		int endIndex = stream.indexOf(STREAM_TERMINATOR);
		
		if(startIndex == -1 || endIndex == -1) {
			throw new EncodingException(MALFORMED_STREAM_ERROR_MSG);
		}
		
		String byteStream = stream.substring(startIndex + 1, endIndex);
		String[] tokens = byteStream.split(BYTE_SEPERATOR);
		byte[] bytes = new byte[tokens.length];
		
		for(int i = 0; i < tokens.length; i++) {
			bytes[i] = Integer.decode(tokens[i]).byteValue();
		}
		
		return bytes;
	}
	
	private static final String STREAM_INITIATOR = "{";
	private static final String STREAM_TERMINATOR = "}";
	private static final String BYTE_SEPERATOR = ":";
	private static final String BASE_INDICATOR_PREFIX = "0x";
	
	private static final String MALFORMED_STREAM_ERROR_MSG = "Malformed byte stream.  Stream should start with '" + STREAM_INITIATOR + "' and end with '" + STREAM_TERMINATOR + "'";
}
