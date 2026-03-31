<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan">
	<xsl:output method="xml"/>
	<xsl:strip-space elements="*"/>
	<xsl:variable name="xpathToDsFile">C:/SUPS/build/wp/mappings/XpathToDsMapping.xml</xsl:variable>
	<xsl:variable name="xpathToDsDoc" select="document($xpathToDsFile)"/>
	<xsl:variable name="xpathToDs"><xsl:copy-of select="$xpathToDsDoc"/></xsl:variable>
	<xsl:variable name="dsToQuestionFile">C://SUPS/build/wp/mappings/DsToQuestionMapping.xml</xsl:variable>
	<xsl:variable name="dsToQuestionDoc" select="document($dsToQuestionFile)"/>
	<xsl:variable name="dsToQuestion"><xsl:copy-of select="$dsToQuestionDoc"/></xsl:variable>
	<xsl:template match="mappings">
		<mappings>
			<xsl:apply-templates/>
		</mappings>
	</xsl:template>
	<xsl:template match="variable">
		<map>
			<name><xsl:value-of select="@name"/></name>
			<xsl:apply-templates select="xpath"/>
		</map>
	</xsl:template>
	<xsl:template match="xpath">
		<xsl:variable name="path"><xsl:value-of select="."/></xsl:variable>
		<xsl:if test="count(preceding-sibling::xpath[.=$path]) = 0">
			<question>
				<xsl:call-template name="getvalue">
					<xsl:with-param name="node"><xsl:copy-of select="$xpathToDs"/></xsl:with-param>
					<xsl:with-param name="path"><xsl:value-of select="$path"/></xsl:with-param>
				</xsl:call-template>
				<xpath><xsl:value-of select="$path"/></xpath>
			</question>
		</xsl:if>
	</xsl:template>
	<xsl:template name="getvalue">
		<xsl:param name="node"/>
		<xsl:param name="path"/>
		<xsl:choose>
			<xsl:when test="starts-with($path, '$')">
				<variable><xsl:value-of select="$path"/></variable>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="contains($path, '/')">
						<xsl:variable name="element"><xsl:value-of select="substring-before($path, '/')"/></xsl:variable>
						<xsl:call-template name="getvalue">
							<xsl:with-param name="node"><xsl:copy-of select="xalan:nodeset($node)/*[name()=$element]/*"/></xsl:with-param>
							<xsl:with-param name="path"><xsl:value-of select="substring-after($path, '/')"/></xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:variable name="dspath"><xsl:value-of select="normalize-space(xalan:nodeset($node)/*[name()=$path][1])"/></xsl:variable>
						<xsl:variable name="question"><xsl:value-of select="xalan:nodeset($dsToQuestion)/mappings/map[xpath=$dspath]/id"/></xsl:variable>
						<id><xsl:value-of select="$question"/></id>
						<ds><xsl:value-of select="$dspath"/></ds>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
