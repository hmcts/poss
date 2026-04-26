<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v5 rel. 3 U (http://www.xmlspy.com) by Fred (Electronic Data Systems LTD) -->
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns="http://eds.com/supsfo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="templateDir"/>
	<xsl:variable name="xmlDocQA" select="document('QuestionsQA.xml')"/>
	<xsl:variable name="xmlDocWP" select="document('QuestionsEditor.xml')"/>
	<xsl:template match="Outputs">
		<xsl:variable name="eventDOCLoc">
			<xsl:value-of select="$templateDir"/>Outputs_Events.xml</xsl:variable>
		<Configuration>
			<Outputs>
				<xsl:for-each select="Output">
					<xsl:variable name="thisId" select="Id"/>

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
						<xsl:otherwise><Reload>false</Reload></xsl:otherwise>
						</xsl:choose>
						
						<xsl:element name="WP">
							<xsl:value-of select="count($xmlDocWP/Outputs/Output[Id=$thisId]/editable) > 0"/>
						</xsl:element>
					</xsl:element>
				</xsl:for-each>
			</Outputs>
			<xsl:copy-of select="document($eventDOCLoc)"/>
		</Configuration>
	</xsl:template>
</xsl:stylesheet>