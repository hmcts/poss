<?xml version="1.0"?>
<!--
	Service: Per
	Method:  getPerAllowanceCodes()
	File:    get_per_allowance_codes.xsl
	Author:  Phil Haferer (EDS), Ian Stainer (Valtech)
	Created: 01 June 2005
	Description: 
		An XML translation applied to the 'Standard Allowance' reference data retrieved for 
		Calculating the Protected Earnings Rate.
		This extracts each Category into a separate group to facilitate ease of use by the client code.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<xsl:template match="/">
		<xsl:element name="StandardAllowances">

		   <xsl:element name="PersonalAllowances">
			   <xsl:for-each select="/PerDetailList/PerDetail[./Category = 'A']">
				   <xsl:element name="Allowance">
					   <xsl:for-each select="node()">
							<xsl:if test="name() != 'Category'">					   		
								<xsl:copy-of select="current()"/>
							</xsl:if>
					   </xsl:for-each>		   
				   </xsl:element>		
			   </xsl:for-each>		   
		   </xsl:element>		

		   <xsl:element name="Premiums">
			   <xsl:for-each select="/PerDetailList/PerDetail[./Category = 'B']">
				   <xsl:element name="Premium">
					   <xsl:for-each select="node()">
							<xsl:if test="name() != 'Category'">					   		
								<xsl:copy-of select="current()"/>
							</xsl:if>
					   </xsl:for-each>		   
				   </xsl:element>		
			   </xsl:for-each>		   
		   </xsl:element>		

		   <xsl:element name="OtherLiabilities">
			   <xsl:for-each select="/PerDetailList/PerDetail[./Category = 'C']">
				   <xsl:element name="Liability">
					   <xsl:for-each select="node()">
							<xsl:if test="name() != 'Category'">					   		
								<xsl:copy-of select="current()"/>
							</xsl:if>
					   </xsl:for-each>		   
				   </xsl:element>		
			   </xsl:for-each>		   
		   </xsl:element>		

		   <xsl:element name="OtherResources">
			   <xsl:for-each select="/PerDetailList/PerDetail[./Category = 'D']">
				   <xsl:element name="Resource">
					   <xsl:for-each select="node()">
							<xsl:if test="name() != 'Category'">					   		
								<xsl:copy-of select="current()"/>
							</xsl:if>
					   </xsl:for-each>		   
				   </xsl:element>		
			   </xsl:for-each>		   
		   </xsl:element>		

		</xsl:element>		
	</xsl:template>

</xsl:stylesheet>
