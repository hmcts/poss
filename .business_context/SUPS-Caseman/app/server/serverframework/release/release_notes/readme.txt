Building and Deploying the Sample Project Using the Server Framework
--------------------------------------------------------------------

The following assumes that the "tools" directory and the released server framework "release" 
directory have been installed as sibling directories.


To build the server framework example service, from the command line:

1)	Add ant home to the path. Enter:

		set ant_home=<path of ant home directory>
	
	then
	
		set path=%ant_home%\bin;%path%
		
2)	Move to the server framework directory i.e. "release".
		
3)	Edit the template build file so that it uses the special test project framework configuration file.
	This is done manually so that it is clear that the default is not being used. In a real project
	you do not need to use your own framework configuration file unless writing your own custom pipeline
	components.
	
	Change the "gen-beans" Ant task from the default
	
		frameworkConfig="uk/gov/dca/db/sups_config.xml"
		
	to
		
		frameworkConfig="uk/gov/dca/test_project/sups_config.xml"
	

4)	To build the example application ear:

		ant -lib ".\lib;.\lib\xdoclet;.\lib\commons;.\lib\jdom;.\lib\jboss" build-ear
		
	The build is output in the "release/dist" directory.
	
	Note: Make sure that the file "uk\gov\dca\test_project\project_config.xml" has been configured to use a
	JNDI data source.
	
5)	A separate build script is used for deployment. This is because in the real deployment environment the 
	administrator will be given the contents of the "release/dist" directory. Any deployment specific configuration
	should be performed by updating the contents of the files in the "release/dist/conf" directory. These will be 
	added to the prebuilt ear archive (from step 3) as part of the deploymant process.
	
	To deploy, move to the "release/dist" directory. Type:
	
		ant deploy
		
	and, provided the contents of the file "deploy.properties" are correct, the updated ear will be deployed 
	to the application server.
	
JBoss Configuration
-------------------
	
JBoss has to be configured appropriately before the deployed service can be run:

1)	If using JBoss 4.0 DR4 then update the shipped library in JBoss "lib\dom4j.jar" from version 1.3 
	to version 1.4. To do this replace the existing file with "tools\extracted\dom4j-1.4\dom4j.jar".

2)	Configure the JBoss security settings in the "server\default\conf" directory as follows:

		"users.properties" file: nobody=test
		"roles.properties" file: nobody=user

3)	The JNDI property “java.naming.provider.url” needs to be set in the JBoss file "server\default\conf\jndi.properties".
	For example:
	
		java.naming.provider.url=jnp://localhost:1099 

If the deployed application does not work after having made the above changes then it may be caused by the
JBoss install path being too long. To see if this is the cause of the problem, try moving JBoss to a
top level directory. 

	
Using the Validation Tool
-------------------------

A tool is provided which validates the configuration files used to create a service.
To run the service configuration validation tool on the provided example service:

	ant -lib ".\src\application;.\lib;.\lib\commons;.\lib\jdom;.\lib\javascript;.\lib\oracle" validate-server_example
		
For validation against the database to work the file "uk\gov\dca\test_project\project_config.xml" 
has to be configured to point to a JDBC data source.


Using the Service Test UI
-------------------------

The file "release\tools\testservicetool.jar" provides a GUI for testing service calls. First configure the jar
file to be executable:

1)	In Windows Explorer open the menu "Tools->Folder Options...".

2)	Select the tab "File Types".

3)	Click "New" and enter the file extension as "JAR". Click "OK".

4)	Now select JAR from the list and click the "Advanced" button.

5)	Create a new action called "open", then browse to and select the Java runtime executable.
	Then modify the selected "Application used to perform action" to take the form:
	
		"<java runtime executable>" -jar "%1" %*
	
	For example:
	
		"C:\Program Files\Java\j2re1.4.2_04\bin\java.exe" -jar "%1" %*

6)	Click "OK" until back in Explorer.

7)	Modify the properties in the file "release\tools\TestService.properties" to use settings appropriate
	to your application server and installation.

Double clicking on the jar should now bring up the UI. Note: when using ClearCase this can take about 30 seconds.

Security Configuration
----------------------

Functionality exists to support authentication of users and the integrity of data reaching the server. 

1) Activating security. Whether security is to be used is determined by the file 'project_config.xml'. The following
entry activates security:

 	<item id="security:status" class="uk.gov.dca.db.impl.StringConfigurationItem">active</item>
 
To deactivate it use:

 	<item id="security:status" class="uk.gov.dca.db.impl.StringConfigurationItem">inactive</item>
     
If the configuration item 'security:status' is not provided then behaviour defaults to active.

Important: if security is active then the client will have to call the 'login' service method in order
to get a session key. Subsequent service calls will then have to include a MAC, formed using the key,
in order to be successfully validated and executed by the server.

2) Authentication configuration. Ultimately, this will use Windows Active Directory. However, it 
has not been possible to test using this environment. By default a hardcoded authenticator is used.
This allows a user 'nobody' with the password 'test' to be authenticated. To try using the active
directory authenticator:

	- update the file "conf/security.properties" to contain only the entry:
	
		security.authenticator.class=uk.gov.dca.db.security.ActiveDirectoryAuthenticator
		
	- update "conf/active_directory_security.properties" to specify the desired domain.

3) Transactional demarcation.  Service methods may now optionally be marked with a transaction type.  If the transaction element 
is missing from a service method file, the transaction type for the service method will default to 'Required'.  This setting 
will be adequate for most scenarios but under some circumstances, other settings such as 'RequiresNew' may be needed.  For 
further information on using this functionality, please refer to the associated design document.
