<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="templateDir"/>
	<xsl:variable name="xmlDocQA" select="document('../generated/QuestionsQA.xml')"/>
	<xsl:template match="Outputs">
		<xsl:variable name="eventDOCLoc">
			<xsl:value-of select="$templateDir"/>OracleOutputs_Events.xml</xsl:variable>
		<configuration>
<processes>
		<process>
			<name>Create</name>
			<steps>
				<step>LoadQA</step>
				<step>CleanUp</step>
			</steps>
		</process>
		<process>
			<name>Open</name>
			<steps>
				<step>OpenOutput</step>
				<step>CleanUp</step>
			</steps>
		</process>
	</processes>
			<Outputs>
				<xsl:for-each select="Output">
					<xsl:variable name="thisId" select="Id"/>
					<!-- for now, we don't need the actual output file(s)
					<xsl:variable name="outputTemplateLocation">
						<xsl:value-of select="$templateDir"/>
						<xsl:value-of select="Location"/>
					</xsl:variable>
					<xsl:variable name="outputTemplateXMLDOC" select="document($outputTemplateLocation)"/>
					-->
					<xsl:element name="Output">
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
						<xsl:element name="Menu">
							<xsl:value-of select="Menu"/>
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
						<xsl:otherwise><Reload>false</Reload></xsl:otherwise>
						</xsl:choose>
						
					</xsl:element>
				</xsl:for-each>
			</Outputs>
			<xsl:copy-of select="document($eventDOCLoc)"/>
		</configuration>
	</xsl:template>
</xsl:stylesheet>