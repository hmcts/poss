package uk.gov.dca.db.invoke.server.service;


public interface ServiceMetaData 
{
	String[] getServices();
	
	String[] getServiceMethods(String serviceName);
	
}
