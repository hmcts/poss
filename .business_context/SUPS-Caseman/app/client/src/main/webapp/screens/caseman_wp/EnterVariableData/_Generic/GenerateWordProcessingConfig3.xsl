<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v5 rel. 3 U (http://www.xmlspy.com) by Fred (Electronic Data Systems LTD) -->
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">

	<xsl:strip-space elements="configuration context WordProcessing" />
	<!--<xsl:preserve-space elements="configuration context WordProcessing" />-->
	
	<xsl:output method="xml" indent="no" />
	<xsl:param name="templateDir"/>
	<xsl:variable name="xmlDocQA" select="document('generated/QuestionsQA.xml')"/>
	<xsl:variable name="xmlDocWP" select="document('generated/QuestionsEditor.xml')"/>
	<xsl:variable name="xmlDocJS" select="document('../../generated/wpctrl.xml')"/>
	<xsl:variable name="evtDocLoc" select="concat($templateDir, '/Outputs_Events.xml')"/>
	<xsl:variable name="eventDOC" select="document($evtDocLoc)"/>

	<xsl:template match="Outputs">

		<configuration>
			<outputs>
				<xsl:for-each select="Output">
					<xsl:variable name="thisId" select="Id"/>
					<!-- for now, we don't need the actual output file(s)
					<xsl:variable name="outputTemplateLocation">
						<xsl:value-of select="$templateDir"/>
						<xsl:value-of select="Location"/>
					</xsl:variable>
					<xsl:variable name="outputTemplateXMLDOC" select="document($outputTemplateLocation)"/>
					-->
					<xsl:element name="output">
						<xsl:element name="Id">
							<xsl:value-of select="$thisId"/>
						</xsl:element>
						<xsl:element name="Description">
							<xsl:value-of select="Description"/>
						</xsl:element>
						<xsl:element name="NReference">
							<xsl:value-of select="NReference"/>
						</xsl:element>
						<xsl:element name="QA">
							<xsl:value-of select="count($xmlDocQA/Outputs/Output[Id=$thisId]/question) > 0"/>
						</xsl:element>
						<xsl:element name="AltProcess">
							<xsl:value-of select="AltProcess" />
						</xsl:element>
						<xsl:element name="Location">
							<xsl:value-of select="Location" />
						</xsl:element>
						<xsl:element name="FinalLocation">
							<xsl:value-of select="FinalLocation" />
						</xsl:element>
						
						<!-- make this dynamic -->
						<!-- <Reload> element triggers wpctrl to reload the data and retransform it after the qa save(s) took place. -->
						<xsl:choose>
							<xsl:when test="$thisId = 'CJR011'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR023D'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR027'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR040'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR041'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR042'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR043'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR046'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR049'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR065'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR065A'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR065B'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR065C'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR070'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR175'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'N32_2'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'N32_5'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'N35'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CO05'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CO17'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CO18'"><Reload>true</Reload></xsl:when> 
							<xsl:when test="$thisId = 'CO28'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CO29'"><Reload>true</Reload></xsl:when>
							<xsl:when test="$thisId = 'CJR018A'"><Reload>true</Reload></xsl:when> 
							<xsl:when test="$thisId = 'CJR102'"><Reload>true</Reload></xsl:when> 
							<xsl:when test="$thisId = 'CJR081'"><Reload>true</Reload></xsl:when> 
							<xsl:when test="$thisId = 'CJR082'"><Reload>true</Reload></xsl:when> 
							
						<xsl:otherwise><Reload>false</Reload></xsl:otherwise>
						</xsl:choose>
						
						<xsl:element name="WP">
							<xsl:value-of select="count($xmlDocWP/Outputs/Output[Id=$thisId]/editable) > 0"/>
						</xsl:element>
						
						<!--  Default Duplex behaviour of outputs no longer in config file, which was overriding the WPFramework.js supsreporting integration -->
						<xsl:if test="count($xmlDocWP/Outputs/Output[Id=$thisId]/duplex) > 0">
							<xsl:element name="printDuplex">true</xsl:element>
						</xsl:if>
						
						<!--  Default Tray behaviour of outputs no longer in config file, which was overriding the WPFramework.js supsreporting integration -->
						<xsl:if test="count($xmlDocWP/Outputs/Output[Id=$thisId]/tray) > 0">
								<xsl:element name="printTray"><xsl:value-of select="$xmlDocWP/Outputs/Output[Id=$thisId]/tray"/></xsl:element>
						</xsl:if>
						
						<!--  Default Copies (number of) behaviour of outputs no longer in config file, which was overriding the WPFramework.js supsreporting integration -->
						<xsl:if test="count($xmlDocWP/Outputs/Output[Id=$thisId]/copies) > 0">
							<xsl:element name="printCopies"><xsl:value-of select="$xmlDocWP/Outputs/Output[Id=$thisId]/copies"/></xsl:element>
						</xsl:if>

					</xsl:element>
				</xsl:for-each>
			</outputs>
			
			<events>
				<xsl:for-each select="$eventDOC/Events/Event">
					<xsl:element name="event">
						<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
						<xsl:attribute name="code"><xsl:value-of select="@code"/></xsl:attribute> 
						<xsl:attribute name="ccbc"><xsl:value-of select="@ccbc"/></xsl:attribute> 
						<xsl:attribute name="bulkprint"><xsl:value-of select="@bulkprint"/></xsl:attribute> 
						<xsl:if test="@condition">
							<xsl:attribute name="condition"><xsl:value-of select="@condition"/></xsl:attribute> 
						</xsl:if>
						<xsl:copy-of select="./*"/>
					</xsl:element>
				</xsl:for-each>
			</events>
		
			<xsl:copy-of select="$xmlDocJS/configuration/*"/>
			
		</configuration>
	</xsl:template>
</xsl:stylesheet>