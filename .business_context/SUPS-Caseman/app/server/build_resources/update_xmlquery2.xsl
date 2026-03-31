<!-- The purpose of this stylesheet is to update the ejb-jar.xml file in the server framework's -->
<!-- xmlquery2.jar file. We need to do this in order to allow the framework's security bean to  -->
<!-- call Caseman specific services. -->
<!-- Author: Ian Stainer -->
<!-- 30 January 2006 -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output indent="yes"/>

	<!-- Match the SecurityService session EJB-->
	<xsl:template match="ejb-jar/enterprise-beans/session[ejb-name='SecurityService']">
		<!-- Copy the <session> node to the output document --> 
		<xsl:copy>
			<!-- Now just copy the contents of the session node to the output document -->
			<xsl:apply-templates/>	

			<!-- After copying the content add the following to the output document -->		
			<!-- This will allow the framework security bean to call the Caseman service -->
			<xsl:element name="ejb-local-ref">
				<xsl:element name="ejb-ref-name">
					<xsl:text>ejb/CourtServiceLocal</xsl:text>
				</xsl:element>
				<xsl:element name="ejb-ref-type">
					<xsl:text>Session</xsl:text>
				</xsl:element>
				<xsl:element name="local-home">
					<xsl:text>uk.gov.dca.caseman.CourtServiceLocalHome</xsl:text>
				</xsl:element>
				<xsl:element name="local">
					<xsl:text>uk.gov.dca.caseman.CourtService</xsl:text>
				</xsl:element>
				<xsl:element name="ejb-link">
					<xsl:text>CourtService</xsl:text>
				</xsl:element>
			</xsl:element>			
		</xsl:copy> <!-- Close the <session> node -->
	</xsl:template>

	<xsl:template match="@*|node()">
		<xsl:copy>
		<xsl:apply-templates select="@*"/>		
		<xsl:apply-templates/>				
		</xsl:copy>		
	</xsl:template>
	
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>

</xsl:stylesheet>
