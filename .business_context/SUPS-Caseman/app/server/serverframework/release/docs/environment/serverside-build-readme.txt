Added Property
# set the directory where oc4j standalone is installed
-Doc4j.home.dir=c:/oc4j-9.0.4

################################################################################################
#
#	Required Properties/Parameters used to call the build
# 	NOTE: application.base or the environment variable PROJECT_BASE MUST be set from the start
# 	
#	You can set all the other properties in the Eclipse Ant External Task main text area. 
# 	In a properties file named sups_antuser.properties placed in the path specified by your 
#	java user.home or java user.dir system properties.
#   When using Eclipse user.dir your workspace root d:\eclipse\workspaces
#	on Windows your user.home System property is d:\Documents and Settings\[net*ID]
#
# 	so it is possible to have a file in either or both of d:\Documents and Settings\[net*ID]\sups_antuser.properties
#	and d:\eclipse\workspace\sups_antuser.properties
#
################################################################################################

-Dapplication.base="server base directory" - this used to be the PROJECT_BASE environment variable which is still supported

-Dservice.config.directory=C:/Projects/sups/XMLQuery2/test/java/testProjectConfig= the path to the directory which will contain your service configuration

-Dapplication.name=[crest|caseman|ediary|....]
-Dtarget.platform=[OAS|JBOSS] - currently default to JBOSS
-Doas.deploy.dir=[directory where you might want the ear to be copied to if the target.platform=OAS]
-Dapplication.dist=[optional property where the ear must be stored by the build; default application.base/dist]
-Dapplication.service.uri.prefix=[optional] property to specify how this applications resources and services should be requested. 
				  The same as the <services baseURL="/????" in the applicationconfig.xml in the client application. 
				  [Default: is the application.name]

-Djboss.server.dir=[if the target.platform is JBOSS]
-Doas.server.dir=[if the target.platform is OAS this must have your webservices jars are]
-Dusing.async=[true|false] where there MDB pfd async.jar must be generated
-Dapplication.lib=where your project specific archives are

################################################################################################
#	The files in application.lib are appended to the resources/META-INF/jar/MANIFEST.MF 
#	Class-Path attribute
################################################################################################

-Dapplication.conf=where your project specific configuration files are located, these will override the 
					 files provided in resource/default_conf and will be used to generate conf.jar

-Dapplication.dist=[where must the ear be copied to]
-Dapplication.bin=[where do you want the source to be compiled to]

-Dcustom.path=[extra jars other than application.lib jars which you may need in the compilation]

-Dcustom.ant.build.file=[is there a build file you need executed during this process]

-Dcustom.ant.build.dir=[the directory you want the build file to use as it's build directory defaults to serverframework/release]

-Doas.deploy.dir=where you may want the EAR copied to after the build


################################################################################################


To provide an incremental building environment for both JBOASS and OC4J/OAS the resources for these too
enviroments have been seperated.

New directories and files.

release/lib/SUPS-JBOSS
			|
			|_Authentication.jar	
			|
			|_xmlquery2.jar
			
release/lib/SUPS-OAS
			|
			|_Authentication.jar	
			|
			|_xmlquery2.jar

			
Eclipse and the new Build environment
The bean source is generated in ${basedir}/build/${target.platform}, so 
if you are developing and testing/debugging on JBOSS you need to include build/JBOSS/generated_source in your project
if you are developing and testing/debugging on OAS/OC4J you need to include build/OAS/generated_source in your project


