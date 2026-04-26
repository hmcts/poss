<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan">
	<xsl:output method="xml"/>
	<xsl:strip-space elements="*"/>
	<xsl:template match="Questions">
		<mappings>
			<xsl:for-each select="Question/@id">
				<xsl:variable name="thisQuestionId">
					<xsl:value-of select="."/>
				</xsl:variable>
				<xsl:variable name="thisQuestionFile">
					<xsl:text>../../../client/caseman/screens/caseman_wp/EnterVariableData/_Generic/Questions/</xsl:text>
					<xsl:value-of select="$thisQuestionId"/>
					<xsl:text>.xml</xsl:text>
				</xsl:variable>
				<xsl:variable name="thisQuestionDoc" select="document($thisQuestionFile)"/>
				<map>
					<id>
						<xsl:value-of select="$thisQuestionId"/>
					</id>
					<xpath>
						<xsl:text>/params/param</xsl:text><xsl:value-of select="$thisQuestionDoc/Question/Javascript/XPath"/>
					</xpath>
				</map>
			</xsl:for-each>
		</mappings>
	</xsl:template>
</xsl:stylesheet>
