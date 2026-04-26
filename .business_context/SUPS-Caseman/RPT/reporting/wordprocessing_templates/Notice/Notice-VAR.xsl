<?xml version="1.0" encoding="UTF-8"?>
<!-- 
	WP-1.13
Transforms the Notice-VAR.xsd into a human readable html document.


 $Id: Notice-VAR.xsl,v 1.1 2006/01/16 15:39:28 f_vdd Exp $
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xsl:import href="../_Generic/formatEntities.xsl"/>
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html>
			<head>
				<title>SUPS - CaseMAN - Notice - Notice-VAR.xsd schema details</title>
				<style type="text/css">
				.variableTable { width: 800px; }
				.cell-docVar {width: 100%; background-color: lightblue; color: brown; col-span: 3;}
				.cell-docVarOld { width: 200px; }
				.cell-source { width: 200px; }
				.cell-documentation { width: 400px; }
				.empty { align: center;}
				
				.docVar { font-weight: bold; }
				.docVarOld { }
				.source {}
				.documentation
				</style>
			</head>
			<body>
				<xsl:call-template name="indexTypes"/>
				<hr width="100%"/>
				<xsl:call-template name="indexElements"/>
				<hr width="100%"/>
				<table>
					<tbody>
						<tr>
							<td>
								<table class="variableTable" border="1">
									<tbody>
										<tr>
											<th colspan="3">Document Variables</th>
										</tr>
										<tr>
											<th class="cell-docVar" colspan="3">
												<div class="docVar">Name</div>
											</th>
										</tr>
										<tr>
											<th class="cell-docVarOld">
												<div class="docVarOld">Old Document Variable Name</div>
											</th>
											<th class="cell-source">
												<div class="source">(New System) Source</div>
											</th>
											<th class="cell-documentation">
												<div class="documentation">Documentation</div>
											</th>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<xsl:apply-templates select="//xs:element">
							<xsl:sort select="@name"/>
						</xsl:apply-templates>
					</tbody>
				</table>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="xs:element">
		<tr>
			<td>
				<table class="variableTable" border="1">
					<tbody>
						<tr>
							<td class="cell-docVar" colspan="3">
								<div class="docVar">
									<font size="1">
										<a href="#index">[ index ]</a>
									</font>
									<xsl:element name="a">
										<xsl:attribute name="name"><xsl:text>#var_</xsl:text><xsl:value-of select="@name"/></xsl:attribute>
										<xsl:value-of select="@name"/>
									</xsl:element>
								</div>
							</td>
						</tr>
						<tr>
							<td class="cell-docVarOld">
								<div class="docVarOld">
									<xsl:choose>
										<xsl:when test="./xs:annotation/xs:appinfo/xs:attribute[@name='oldvariablename'] != ''">
											<xsl:value-of select="./xs:annotation/xs:appinfo/xs:attribute[@name='oldvariablename']"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>-</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<td class="cell-source">
								<div class="source">
									<xsl:choose>
										<xsl:when test="./xs:annotation/xs:appinfo/xs:attribute[@name='source'] != ''">
											<xsl:value-of select="./xs:annotation/xs:appinfo/xs:attribute[@name='source']"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>-</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<td class="cell-documentation">
								<div class="documentation">
									<xsl:choose>
										<xsl:when test="./xs:annotation/xs:documentation != ''">
											<xsl:value-of select="./xs:annotation/xs:documentation"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>-</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template name="indexTypes">
		<table rules="rows">
			<tbody>
				<tr>
					<th colspan="2">
						<a name="index">Index of Types</a>
					</th>
				</tr>
				<xsl:for-each select="//xs:complexType[@name != '']">
					<xsl:sort select="@name"/>
					<tr>
						<td valign="top">
							<xsl:element name="a">
								<xsl:attribute name="href"><xsl:text>#var_</xsl:text><xsl:value-of select="@name"/></xsl:attribute>
								<xsl:value-of select="@name"/>
							</xsl:element>
							</td>
							<td>
							<xsl:choose>
								<xsl:when test="./xs:annotation/xs:documentation != ''">
									<xsl:value-of select="./xs:annotation/xs:documentation"/>
								</xsl:when>
								<xsl:otherwise>
									<font size="1">
										<i>no documentation available</i>
									</font>
								</xsl:otherwise>
							</xsl:choose>


						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
	
	<xsl:template name="indexElements">
		<table rules="rows">
			<tbody>
				<tr>
					<th colspan="2">
						<a name="index">Index of Elements</a>
					</th>
				</tr>
				<xsl:for-each select="//xs:element">
					<xsl:sort select="@name"/>
					<tr>
						<td valign="top">
							<xsl:element name="a">
								<xsl:attribute name="href"><xsl:text>#var_</xsl:text><xsl:value-of select="@name"/></xsl:attribute>
								<xsl:value-of select="@name"/>
							</xsl:element>
							</td>
							<td>
							<xsl:choose>
								<xsl:when test="./xs:annotation/xs:documentation != ''">
									<xsl:value-of select="./xs:annotation/xs:documentation"/>
								</xsl:when>
								<xsl:otherwise>
									<font size="1">
										<i>no documentation available</i>
									</font>
								</xsl:otherwise>
							</xsl:choose>
						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>

