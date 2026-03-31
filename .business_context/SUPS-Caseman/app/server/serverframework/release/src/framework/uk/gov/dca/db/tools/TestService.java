/*
 * Created on 30-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.rmi.RemoteException;
import java.sql.SQLException;

import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.jdom.JDOMException;

import uk.gov.dca.db.XMLService;
import uk.gov.dca.db.XMLServiceFactory;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.pipeline.component_input.ConverterFactory;
import uk.gov.dca.db.security.Base16;
import uk.gov.dca.db.security.EncodingException;
import uk.gov.dca.db.security.MD5MessageEncoder;

/**
 * This class can be used to test services in the SUPS framework.  This class can either be used to run services directly from the 
 * command line or can be usedto invoke services from other applications such as the TestServiceGUI application.  Services can be 
 * tested locally or remotely by calling the performQueryTest and invokeServiceMethod methods respectively.
 * 
 * @author JamesB
 */
public class TestService {

	/**
	 * default constructor
	 */
	public TestService() {
		super();
	}

	/**
	 * Main method
	 * 
	 * @param args command line parameters passed to this class when it is invoked from the command line
	 */
	public static void main(String[] args) {
		TestService service = new TestService();
		String serviceType = null;
		
		if(args.length > SERVICE_TYPE && args[SERVICE_TYPE] != null) {
			serviceType = args[SERVICE_TYPE].toUpperCase();
		}
		else {
			printUsage();
		}
			
		if(serviceType.equals(LOCAL)) {
			if(args.length != NUM_PARAMS_FOR_LOCAL) {
				printUsage();
			}
		}
		else if(serviceType.equals(REMOTE)) {
			if(args.length != NUM_PARAMS_FOR_REMOTE) {
				printUsage();
			}
		}
		else {
			printUsage();
		}
		
		String serviceName = args[SERVICE_NAME];
		String method = args[METHOD_NAME];
		
		String paramsPath = args[PARAMETERS];		

		String result = null;
		
		try {
			File file = new File(paramsPath);
			String params = service.getSampleData(file);

			if(serviceType.equals(LOCAL)) {
				String methodDescriptor = args[METHOD_DESCRIPTOR];
				result = service.performQueryTest(serviceName, method, params, methodDescriptor);
			} 
			else if(serviceType.equals(REMOTE)) {
				result = service.invokeServiceMethod(serviceName, method, params);
			}
		}
		catch(Exception e) {
			System.out.println("Exception occurred whilst executing query: " + e.getMessage());
			e.printStackTrace();
		} 	
			
		System.out.println("Results:");
		System.out.println(result);
	}
	
	/**
	 * Prints usage instructions to std out.
	 */
	private static void printUsage() {
		System.out.println("Usage instructions:");
		System.out.println("TestService <service type> <service name> <method name> <parameter file name> [<method descriptor file name>]");
		System.out.println("\nWhere <service type> = LOCAL or REMOTE");
		System.out.println("If <service name> = LOCAL then <method descriptor file name> must be specified.");
		
		System.exit(1);
	}
	
	/**
	 * Executes the specified service locally
	 * 
	 * @param serviceName the name of the service
	 * @param method the name of the method
	 * @param inputParameters the XML containing the input parameters for the service
	 * @param methodDescriptor the XML descriptor for the method
	 * @return the XML string resulting from the call
	 * @throws XMLServiceException
	 * @throws SQLException
	 * @throws JDOMException
	 * @throws IOException
	 */
	public String performQueryTest(String serviceName, String method,
            String inputParameters, String methodDescriptor) throws BusinessException, SystemException
    {
        
		StringWriter writer = new StringWriter();
		StringBuffer projectConfig = null;
		
		try {
			// calculate the path for the corresponding project config file for the specified method descriptor
			projectConfig = new StringBuffer(TestServiceProperties.getInstance().getProperty(TestServiceProperties.LOCAL_PROJECT_PACKAGE));
			projectConfig.append(PROJECT_CONFIG_FILE_NAME);
		}
		catch(IOException e) {
			throw new SystemException("Failed to test service tool properties", e);
		}
		
		// get an instance of an XML service
        XMLService service = XMLServiceFactory.getInstance(serviceName, new String [] {methodDescriptor}, 
        		"uk/gov/dca/db/sups_config.xml", projectConfig.toString());
        
        if (service == null) {
            throw new RuntimeException("No Service implementation available");
        }
        
        // prepare the input/output
        ConverterFactory inputConverterFactory = new ConverterFactory();
        ComponentInput inputHolder = new ComponentInput(inputConverterFactory);
        inputHolder.setData(inputParameters, String.class);
        ComponentInput outputHolder = new ComponentInput(inputConverterFactory);
        
        // execute the service
        service.initialise();
        service.executeTemplate(method, inputHolder, outputHolder);
        
        return (String)outputHolder.getData(String.class);
    } 
	
	/** 
	 * Calls the specified service method via SOAP RPC call.
	 * 
	 * @param serviceName the name of the service
	 * @param sMethod the name of the method to invoke
	 * @param sParams the XML containing the input parameters for the call
	 * @return the XML string resulting from the call
	 * @throws ServiceException
	 * @throws MalformedURLException
	 * @throws RemoteException
	 * @throws SystemException
	 * @throws BusinessException
	 */	
	public String invokeServiceMethod(String serviceName, String sMethod, String sParams)
	throws ServiceException, MalformedURLException, RemoteException, IOException, BusinessException, SystemException, Exception
{
	String sResponse = "";
	QName operation = null;
	QName login =  null;
	
	String user = TestServiceProperties.getInstance().getProperty(TestServiceProperties.REMOTE_SERVICE_USER);
	String password = TestServiceProperties.getInstance().getProperty(TestServiceProperties.REMOTE_SERVICE_PASSWORD);
	String serviceEndpoint = TestServiceProperties.getInstance().getProperty(TestServiceProperties.REMOTE_SERVICE_ENDPOINT);
	String serviceNamespace = TestServiceProperties.getInstance().getProperty(TestServiceProperties.REMOTE_SERVICE_NAMESPACE);
	
	// construct url and namespace for service
	if(serviceNamespace != null) {
		// replace underscore characters ('_') with hyphens
		serviceNamespace = serviceNamespace.replace('_', '-');
		
		String expandedServiceNamespace = expandServiceName(serviceNamespace, serviceName);
		operation = new QName(expandedServiceNamespace, sMethod);
		
		String loginServiceNamespace = expandServiceName(serviceNamespace, "Authentication");
		login = new QName(loginServiceNamespace, "login");
	}
	else {
		operation = new QName(sMethod);
		login = new QName("login");
	}
	
	String serviceUrl = expandServiceName(serviceEndpoint, serviceName);
	String loginUrl = expandServiceName(serviceEndpoint, "Authentication");
	
	Service  service = new Service();
	Call  call = (Call) service.createCall();

	URL encodedURL = new URL(serviceUrl);
	System.out.println("URL: " + encodedURL);
	call.setTargetEndpointAddress(encodedURL);
	System.out.println("Operation: " + operation);
	call.setOperationName(operation);
	call.setUsername(user);
	call.setPassword(password);
	
	Service  loginService = new Service();
	Call  loginCall = (Call) loginService.createCall();

	URL encodedLoginURL = new URL(loginUrl);
	System.out.println("URL: " + encodedLoginURL);
	loginCall.setTargetEndpointAddress(encodedLoginURL);
	System.out.println("Operation: " + login);
	loginCall.setOperationName(login);
	loginCall.setUsername(user);
	loginCall.setPassword(password);
	
	String sessionKey = null;
	
	try {
		sessionKey = (String) loginCall.invoke( new Object[] { user, password} );
	} catch(Exception e) {
		System.out.print("Exception during login attempt");
		throw e;
	}
	
	if(sessionKey == null || sessionKey.equals(""))
		throw new BusinessException("No session key returned from login");
	
	System.out.println("TestService : invokeServiceMethod() - params equals: "+ sParams);
	System.out.println("TestService : invokeServiceMethod() - Session key is : "+sessionKey);
	// parameters for all SUPS calls are:
	// 1) user name
	// 2) mac
	// 3) parameters xml
	sResponse = (String) call.invoke( new Object[] { user, generateMac(user, sParams, sessionKey), sParams } );
	
	return sResponse;
}
	
	public String generateMac(String user, String params, String sessionKey) throws EncodingException, SystemException {
//		 use session key to generate MAC
		StringBuffer buffer = new StringBuffer(params);
		buffer.append(user);
		buffer.append(sessionKey);

		MD5MessageEncoder hash = new MD5MessageEncoder();
		byte[] result = hash.encode(buffer.toString());
		
		Base16 byteStreamEncoder = new Base16();
		return byteStreamEncoder.encode(result);

	}
	
	/**
	 * Loads the contents of a parameter file to be passed to a service
	 * 
	 * @param file the File to be loaded
	 * @return the loaded XML containing the parameters
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public String getSampleData(File file) throws FileNotFoundException, IOException{
        StringWriter out = null;
        if (file.exists() && file.isFile() && file.canRead()) {
        	FileInputStream fileInputStream = new FileInputStream(file);
            out = new StringWriter(fileInputStream.available());
            while (fileInputStream.available() != 0) {
                out.write(fileInputStream.read());
            }
        } else {
            throw new FileNotFoundException("The specified file is invalid or could not be found: " + file.getAbsoluteFile());
        }
        return out.toString();
    }
	
	/**
	 * 
	 * @param property
	 * @param serviceName
	 * @return
	 */
	private String expandServiceName(String property, String serviceName) {
		int index = 0;
		int match = 0;
		StringBuffer buffer = new StringBuffer();
		
		while(match != -1) {
			match = property.indexOf(SERVICE_NAME_VARIABLE_NAME, index);
			if(match != -1) {
				buffer.append(property.substring(index, match));
				buffer.append(serviceName);
				index = match + SERVICE_NAME_VARIABLE_NAME.length();
			}
			else {
				buffer.append(property.substring(index));
			}
		}
		return buffer.toString();
	}

	/**
	 * Represents a local service invocation
	 */
	public static final String LOCAL = "LOCAL";
	/**
	 * Represents a remote service invocation
	 */
	public static final String REMOTE = "REMOTE";

	// constants used to parse the command line parameters
	private static final int SERVICE_TYPE = 0;
	private static final int SERVICE_NAME = 1;
	private static final int METHOD_NAME = 2;
	private static final int PARAMETERS = 3;
	private static final int METHOD_DESCRIPTOR = 4;
	
	private static final int NUM_PARAMS_FOR_LOCAL = 5;
	private static final int NUM_PARAMS_FOR_REMOTE = 4;
	
	// constants used to specify service descriptors and project configurations
	private final static String PROJECT_CONFIG_FILE_NAME = "/project_config.xml";
	private final static String SERVICE_NAME_VARIABLE_NAME = "${service.name}";
}
