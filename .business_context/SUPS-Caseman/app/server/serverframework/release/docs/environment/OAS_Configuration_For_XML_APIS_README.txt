To resolve ediary/framework/product dependencies on Xalan, Xerces when running on OAS the following 
configuratioin settings are required using the Oracle Admin console or through editing the opmn.xml file

retrieve the following files from XMLQuery2 release/lib/xalan and carry out the following steps

1) 	upload xalan.jar (no xsltc packaged), xml-apis.jar and xercesImpl.jar to 
	/home/oracle/xalan/lib (or any other appropriate directory)

2)	cd to $ORACLE_HOME/opmn/conf

3)	a. vi opmn.xml
	b. Find your oc4j_instance java-options (home is default)
	c. 
		Unix Deployments:
		After -server add the following lines: -Xbootclasspath/a:/home/oracle/xalan/lib/xercesImpl.jar:/home/oracle/xalan/lib/xalan.jar:/home/oracle/xalan/lib/xml-apis.jar

		Windows Deployments: for windows machines
		After -server add the following lines: -Xbootclasspath^/a:D:/xalan/xercesImpl.jar;D:/xalan/xalan.jar;D:/xalan/xml-apis.jar
			Note the ^ and the ; separators between jars

4) if making these changes by manually editing OPMN.XML, 
   remember that it will be necessary to run 
   "dcmctl updateConfig -ct opmn -v -d" and either restart OPMN 
   and all OPMN processes or run "opmnctl reload". 

	
If you want to build xalan without the xsltc packaged in it.
check out xalan-j_2_6_0-src.jar from tools/java CVS repository or Apache site 
and run ant xalan-interpretive.jar which will result in a Jar of everything in Xalan interpretive (without XSLTC)

ant targets used were as specified by the Xalan project
    xalan-interpretive.jar      Jar up everything in Xalan interpretive (without XSLTC)
    xsltc.unbundledjar          Jar just the xsltc.jar file


Managing Thread Pools
	In server.xml add global-thread-pool
	<global-thread-pool min="300" max="1000000" queue="100" keepAlive="1000"/>