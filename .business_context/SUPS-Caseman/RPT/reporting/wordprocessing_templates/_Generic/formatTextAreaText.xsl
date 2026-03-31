<?xml version="1.0" encoding="UTF-8"?>
<!-- 
Change Hisstory
Oct 23, 2009 Chris Vincent - removed <fo:inline> node from formatTextAreaText as cuasing problems.
in FCK Editor.  Trac 2094.
-->

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:xalan="http://xml.apache.org/xalan" 
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan"
 >


<xsl:template match="/">
	<xsl:variable name="vdTestVar" select="."/>
	<xsl:call-template name="formatTextAreaText">
		<xsl:with-param name="text"><xsl:copy-of select="$vdTestVar"/></xsl:with-param>
	</xsl:call-template>
</xsl:template>


<xsl:template name="formatTextAreaText">
	<xsl:param name="text"/>

	<xsl:choose>
         <xsl:when test="count(xalan:nodeset($text)//line) = 0">
                <xsl:value-of select="$text"/>
         </xsl:when>
        <xsl:when test="count(xalan:nodeset($text)//line) = 1">
			<xsl:value-of select="$text"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:for-each select="xalan:nodeset($text)//line">
				<fo:block><xsl:value-of select="text()"/> </fo:block>
			</xsl:for-each>	
   	    </xsl:otherwise>
	</xsl:choose>

</xsl:template>

</xsl:stylesheet>
