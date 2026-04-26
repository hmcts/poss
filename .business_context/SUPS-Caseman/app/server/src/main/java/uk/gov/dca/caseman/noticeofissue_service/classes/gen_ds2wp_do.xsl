<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">

<xsl:output method="xml" indent="yes"/>

<xsl:template match="/">
	<xsl:apply-templates/>
</xsl:template>

<xsl:template match = "node()|@*"> 
	<xsl:copy> 
		<xsl:apply-templates select = "node()|@*" /> 
	</xsl:copy> 
</xsl:template> 

<xsl:template match="*/@*[. = '/params/param/ds/EnterVariableData/EnterText' or
						  . = '/params/param/ds/EnterVariableData/applicationfor' or
						  . = '/params/param/ds/EnterVariableData/DetailsOfAllegedOffence' or
						  . = '/params/param/ds/EnterVariableData/Order/goodsdetained' or
						  . = '/params/param/ds/EnterVariableData/ArrestWarrent/breachDtls' or
						  . = '/params/param/ds/EnterVariableData/OtherDoc' or
						  . = '/params/param/ds/EnterVariableData/Allocation/reasons' or
						  . = '/params/param/ds/EnterVariableData/Service/produceDocs' or
						  . = '/params/param/ds/EnterVariableData/Documents/filedDetails' or
						  . = '/params/param/ds/EnterVariableData/Interlocutory/orderDetailse' or
						  . = '/params/param/ds/EnterVariableData/Service/otherDocument' ]">
	<xsl:call-template name="subversion">
		<xsl:with-param name="xpath" select="."/>
	</xsl:call-template>
</xsl:template>

<xsl:template match="@*">
	<xsl:attribute name="{name(.)}">
		<xsl:value-of select="." disable-output-escaping="yes"/>
	</xsl:attribute>
</xsl:template>

<xsl:template name="subversion">
	<xsl:param name="xpath"/>
	
		<xsl:choose>
			<xsl:when test="name(.) = 'select'">
				<xsl:attribute name="{name(.)}">
					<xsl:copy-of select="concat($xpath,'/xmlversion/*')"/>
				</xsl:attribute>			
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="{name(.)}">
					<xsl:value-of select="$xpath"/>
				</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
</xsl:template>

</xsl:stylesheet>
