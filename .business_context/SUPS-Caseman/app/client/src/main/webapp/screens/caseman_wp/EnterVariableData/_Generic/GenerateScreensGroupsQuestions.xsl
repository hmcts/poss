<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2004/07/xpath-functions" xmlns:xdt="http://www.w3.org/2004/07/xpath-datatypes"  xmlns:file="java.io.File">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="templateDir"/>
	<xsl:param name="webfileDir"/>
	
	<xsl:template match="/Screens">
		<Screens>
			
			<xsl:for-each select="./Screen">
			
			
			<xsl:variable name="thisScreenId"><xsl:value-of select="@id"/></xsl:variable>
			<xsl:variable name="thisScreenLocation" select="string(concat($webfileDir, 'EnterVariableData\_Generic\Screens\', $thisScreenId, '.xml'))"/>
			<xsl:variable name="thisScreenDOC" select="document($thisScreenLocation)"/>	
			<xsl:element name="screen">
				<xsl:attribute name="id"><xsl:value-of select="$thisScreenId"/></xsl:attribute>
				
														
				<xsl:for-each select="$thisScreenDOC/Screen/GroupId">
					<xsl:variable name="thisGroupId"><xsl:value-of select="."/></xsl:variable>
						
					<xsl:variable name="thisGroupFile"     select="string(concat($webfileDir, 'EnterVariableData\_Generic\Grouping.xml'))"/>
					<xsl:variable name="groupFileLocation" select="string(concat($webfileDir, 'EnterVariableData\_Generic\Groups\', $thisGroupId, '.xml'))"/>
					<xsl:variable name="groupFileExists"   select="boolean(document($groupFileLocation))"/>			
					<xsl:element name="group">
						<xsl:attribute name="id"><xsl:value-of select="$thisGroupId"/></xsl:attribute>
														
						<xsl:choose>
							<xsl:when test="$groupFileExists">	
								<xsl:attribute name="file">true</xsl:attribute>
								<xsl:variable name="groupFileDOC" select="document($groupFileLocation)"/>
									<xsl:if test="$groupFileDOC/Group/Protocols/OnSave">
										<xsl:attribute name="save">true</xsl:attribute>
									</xsl:if>	
							</xsl:when>
							<xsl:otherwise>
									<xsl:attribute name="file">false</xsl:attribute>
							</xsl:otherwise>		
						</xsl:choose>
	
						<xsl:for-each select="document($thisGroupFile)/Groups/Group[@GroupId=$thisGroupId]/QuestionId">
							<xsl:element name="question">
								<xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
							</xsl:element>
						</xsl:for-each>
							
					</xsl:element>
				
				</xsl:for-each>
				
			</xsl:element>
			</xsl:for-each>
		</Screens>
	</xsl:template>
	
</xsl:stylesheet>
