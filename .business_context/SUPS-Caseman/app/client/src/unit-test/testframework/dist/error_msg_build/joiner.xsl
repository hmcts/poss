<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <xsl:output method="xml" indent="yes"/> 
 <xsl:template match="data_files">
 <xsl:element name="{@element}">
  <xsl:apply-templates /> 
  </xsl:element>
  </xsl:template>
<xsl:template match="file">
  <xsl:param name="el" select="@element" /> 
  <xsl:param name="doc" select="document(@location)" /> 
  <xsl:copy-of select="$doc/*[local-name()=$el]/*" /> 
  </xsl:template>
</xsl:stylesheet>
