<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	

	<xsl:output method="xml" indent="yes"/>
	
	<xsl:param name="templateDir"/>
	<xsl:param name="webfileDir"/>
	

	<xsl:variable name="wpCfgXmlDocLoc">
		<xsl:value-of select="$webfileDir"/>
		<xsl:text>WordProcessingConfig.xml</xsl:text>
	</xsl:variable>

	<xsl:variable name="wpCfgXmlDoc" select="document($wpCfgXmlDocLoc)"/>


	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>


	<xsl:template match="oracleReportsFormGeneration">
		<xsl:text>&lt;!--</xsl:text>   config: <xsl:value-of select="$wpCfgXmlDocLoc"/> <xsl:text> --&gt;</xsl:text>
		
		<xsl:for-each select="$wpCfgXmlDoc/configuration/Outputs/Output[QA = 'true']">
			<xsl:element name="form">
				<xsl:variable name="outputId"><xsl:value-of select="Id"/></xsl:variable>
				
				<xsl:variable name="screenXMLDocLoc">
					<xsl:value-of select="$templateDir"/>
					<xsl:text>Screens/</xsl:text>
					<xsl:value-of select="$outputId"/>
					<xsl:text>.xml</xsl:text>
				</xsl:variable>				
				
				<xsl:variable name="screenXMLDoc" select="document($screenXMLDocLoc)"/>
				
				
				<xsl:variable name="description"><xsl:value-of select="Description"/></xsl:variable>
				<xsl:variable name="menu"><xsl:value-of select="Menu"/></xsl:variable>
				<xsl:attribute name="name">Oracle_Reports_<xsl:value-of select="$outputId"/></xsl:attribute>
				<xsl:attribute name="pageURL">caseman_oracle_reports/generated/<xsl:value-of select="$outputId"/>.html</xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="$description"/></xsl:attribute>
				<xsl:attribute name="screen"><xsl:value-of select="$menu"/></xsl:attribute>
				<xsl:attribute name="precompile">no</xsl:attribute>

					<mapping name="requestReport" serviceName="requestReport"/>
		            <service name="requestReport" cache="none" url="Reports" method="requestReport"/>
		            
					<mapping name="runReport" serviceName="runReport"/>
		            <service name="runReport" cache="none" url="Reports" method="runReport"/>
					
		            <mapping name="getSystemDate" serviceName="getSystemDate"/>
					<service name="getSystemDate" cache="GET" url="SystemDate" method="getSystemDate"/>
					
					<mapping name="getCase" serviceName="getCase"/>
					<service name="getCase" cache="none" url="Case" method="getCase">
						<param name="caseNumber"/>
					</service>		
								
					<mapping name="getWarrantTypes" serviceName="getWarrantTypes"/>
					<service name="getWarrantTypes" cache="GET" url="Warranttype" method="getWarrantTypes"/>			

					<mapping name="searchWarrants" serviceName="searchWarrants"/>
					<service name="searchWarrants" cache="none" url="Warrant" method="searchWarrants"/>
					
					<mapping name="searchWarrantsForReissue" serviceName="searchWarrantsForReissue"/>
					<service name="searchWarrantsForReissue" cache="none" url="Warrant" method="searchWarrantsForReissue"/>

					<mapping name="getWarrantReturnCodes" serviceName="getWarrantReturnCodes"/>
					<service name="getWarrantReturnCodes" cache="GET" url="WarrantReturnCodes" method="getWarrantReturnCodes"/>

					<mapping name="checkBailiffIdExists" serviceName="checkBailiffIdExists"/>
					<service name="checkBailiffIdExists" cache="none" url="Bailiff" method="checkBailiffIdExists">
						<param name="bailiffId"/>
					</service>
					
					<mapping name="checkExecutedWarrantsExist" serviceName="checkExecutedWarrantsExist"/>
					<service name="checkExecutedWarrantsExist" cache="none" url="Warrant" method="checkExecutedWarrantsExist">
						<param name="issueDate"/>
					</service>
					
					<mapping name="getPartyIds" serviceName="getPartyIds"/>
					<service name="getPartyIds" cache="none" url="Parties" method="getPartyIds">
						<param name="caseNumber"/>
					</service>
					
					<mapping name="getCourts" serviceName="getCourts"/>
					<service name="getCourts" cache="GET" url="Court" method="getCourts">
					</service>		
					
					<mapping name="getCourt" serviceName="getCourt"/>
					<service name="getCourt" cache="none" url="Court" method="getCourt">
						<param name="courtId"/>						
					</service>		
					
					<mapping name="getHearing" serviceName="getHearing"/>
					<service name="getHearing" cache="none" url="Hearing" method="getHearing">
						<param name="caseNumber"/>
					</service>										
					
					<mapping name="getPastHearing" serviceName="getPastHearing"/>
					<service name="getPastHearing" cache="none" url="Hearing" method="getPastHearing">
						<param name="caseNumber"/>
					</service>
					
					<mapping name="getCurrentCurrency" serviceName="getCurrentCurrency"/>
					<service name="getCurrentCurrency" cache="GET" url="Currency" method="getCurrentCurrency">		
					</service>	
					
					<mapping name="getCourtsShort" serviceName="getCourtsShort"/>
					<service name="getCourtsShort" cache="GET" url="Court" method="getCourtsShort">
					</service>								
					
					<xsl:copy-of select="$screenXMLDoc/Screen/Security/*"/>				
					<mapping name="getCounterPaymentsByUserStatus" serviceName="getCounterPaymentsByUserStatus"/>
					<service name="getCounterPaymentsByUserStatus" cache="none" url="CounterVerification" method="getCounterPaymentsByUserStatus">
						<param name="inputBy"/>
					</service>		

					<mapping name="getReport" serviceName="getReport"/>
		            <service name="getReport" cache="none" url="Reports" method="getReport"/>		

					<mapping name="getCoExists" serviceName="getCoExists"/>
					<service name="getCoExists" cache="none" url="Co" method="getCoExists">
						<param name="coNumber"/>
					</service>	

					<mapping name="getDebtsCount" serviceName="getDebtsCount"/>
					<service name="getDebtsCount" cache="none" url="Co" method="getDebtsCount">
						<param name="coNumber"/>
					</service>
				
					<mapping name="getWarrantsOfExecutionToReprinted" serviceName="getWarrantsOfExecutionToReprinted"/>
					<service name="getWarrantsOfExecutionToReprinted" cache="none" url="Warrant" method="getWarrantsOfExecutionToReprinted">
						<param name="fromWarrantNumber"/>
						<param name="toWarrantNumber"/>
					</service>
				
					<mapping name="getForeignWarrantsOfExecutionToReprinted" serviceName="getForeignWarrantsOfExecutionToReprinted"/>
					<service name="getForeignWarrantsOfExecutionToReprinted" cache="none" url="Warrant" method="getForeignWarrantsOfExecutionToReprinted">
						<param name="fromWarrantNumber"/>
						<param name="toWarrantNumber"/>
					</service>
				
					<mapping name="getBmsLiveDate" serviceName="getBmsLiveDate"/>
					<service name="getBmsLiveDate" cache="none" url="SystemData" method="getBmsLiveDate">
						<param name="courtCode"/>
					</service>
											
			</xsl:element>			
		</xsl:for-each>

	</xsl:template>

</xsl:stylesheet>
