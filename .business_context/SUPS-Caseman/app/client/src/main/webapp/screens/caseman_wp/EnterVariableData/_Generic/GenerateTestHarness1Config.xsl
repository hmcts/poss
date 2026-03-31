<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v5 rel. 3 U (http://www.xmlspy.com) by Fred (Electronic Data Systems LTD) -->
<!--This stylesheet generates TestHarness_1_config.xml.-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	<xsl:output method="xml" indent="yes"/>
	
	<xsl:template match="/">
		
	<application-config baseURL="." initialForm="Menu">

		<forms baseURL="/">

			<form name="WP" pageURL="caseman_wp/WordProcessor/WordProcessor.html" title="CaseMan Word Processor" >
				<mapping name="getXhtml" serviceName="getXhtml"/>
				<service name="getXhtml" cache="none" url="/Wordprocessing" method="getXhtml">
					<param name="output"/>
				</service>
			</form>

			<form name="Menu" pageURL="TestHarness_1_Index.html" title="TestHarness 1 Main Menu">
				<mapping name="getWordProcessingOutputTypes" serviceName="WordProcessing_getOutputTypes"/>
				<service name="WordProcessing_getOutputTypes" cache="none" url="/Wordprocessing" method="getOrderTypes">
				</service>
			</form>

			<xsl:apply-templates select="supsfo:Outputs/supsfo:Output"/>

		</forms>
		<error_msg_files>
			<file path="../../xml/allErrors.xml"/>
		</error_msg_files>
		<services baseURL="/jboss-net/services">
			<!-- service name=&quot;getCourt&quot; cache=&quot;cache&quot; url=&quot;/MaintainCourt&quot; method=&quot;getCourt&quot; / -->
		</services>
			<externalComponents>
				<externalComponent cssClassName="address" className="AddressGUIAdaptor" factoryMethod="create">
  			</externalComponent>
		</externalComponents>
	</application-config>
	</xsl:template>

	<xsl:template match="supsfo:Output">
		<xsl:if test="supsfo:QA = 'true'">
			<xsl:variable name="id" select="supsfo:Id"/>
			<xsl:element name="form">
				<xsl:attribute name="name"><xsl:value-of select="$id" /></xsl:attribute>
				<xsl:attribute name="pageURL"><xsl:value-of select="$id" /><xsl:text>.html</xsl:text></xsl:attribute>
				<xsl:attribute name="title"><xsl:text>Enter Variable Text </xsl:text><xsl:value-of select="$id" /></xsl:attribute>
			</xsl:element>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
<!-- 
	$Header: /CVSRepository/clientoas/caseman/screens/caseman_wp/EnterVariableData/_Generic/GenerateTestHarness1Config.xsl,v 1.2 2006/03/01 15:40:59 conganer Exp $
  -->


<!--

<application-config baseURL="." initialForm="Menu">

	<forms baseURL="/">

		<form name="WP" pageURL="caseman_wp/WordProcessor/WordProcessor.html" title="CaseMan Word Processor" >

			<mapping name="getXhtml" serviceName="getXhtml"/>
			<service name="getXhtml" cache="none" url="/Wordprocessing" method="getXhtml">
				<param name="output"/>
			</service>
		</form>

		<form name="Menu" pageURL="TestHarness_1_Index.html" title="TestHarness 1 Main Menu">
			<mapping name="getWordProcessingOutputTypes" serviceName="WordProcessing_getOutputTypes"/>
			<service name="WordProcessing_getOutputTypes" cache="none" url="/Wordprocessing" method="getOrderTypes">
			</service>
		</form>
		


<table border="1">
			<caption>Overview of Questions and their XPaths</caption>
			<thead>
				<tr bgcolor="lightblue">
					<th>Question</th>
					<th>Label</th>
					<th>JS Object</th>
					<th>XPath</th>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="Question/@id">
					<xsl:variable name="thisQuestionId">
						<xsl:value-of select="."/>
					</xsl:variable>
					<xsl:variable name="thisQuestionFile">
						<xsl:text>./Questions/</xsl:text>
						<xsl:value-of select="$thisQuestionId"/>
						<xsl:text>.xml</xsl:text>
					</xsl:variable>
					<xsl:variable name="thisQuestionDoc" select="document($thisQuestionFile)"/>
					<tr>
						<td>
							<xsl:value-of select="$thisQuestionId"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/Label"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/ObjectName"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/Javascript/XPath"/>
						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>

		-->