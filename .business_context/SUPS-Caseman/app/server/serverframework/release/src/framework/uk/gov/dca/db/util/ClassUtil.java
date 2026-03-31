package uk.gov.dca.db.util;

public class ClassUtil {

	public final static Class loadClass(String name) throws ClassNotFoundException {
		return Thread.currentThread().getContextClassLoader().loadClass(name);
	}
	
}
