<?xml version="1.0" encoding="UTF-8"?>
<!-- $Id: supsfo_templatedocumentation.xsl,v 1.16 2006/05/30 14:36:44 conganer Exp $ -->
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:supsfo="http://eds.com/supsfo" 
	xmlns:ora="http://www.oracle.com/XSL/Transform/java"
exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan"
>

	<xsl:import href="@word.processing.url.xsl@/TopLevel.xsl"/>
	
	<xsl:output method="xml"/>

	<xsl:variable name="outputsXmlDoc" select="document('@word.processing.url.xml@/Outputs.xml')"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="supsfo:addressee" name="showAddress">
		<xsl:for-each select="supsfo:addressee/*">
			{Addressee:<xsl:value-of select="local-name()"/>}
		</xsl:for-each>
	</xsl:template>
		
	<xsl:template match="xsl:value-of" >
		<xsl:choose>
			<xsl:when test="contains(@select,'Table')">
				<fo:table-row>
				<fo:table-cell>
				<fo:block>
					{Variable:<xsl:value-of select="@select"/>}
				</fo:block>
				</fo:table-cell>
				</fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				{Variable:<xsl:value-of select="@select"/>}
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

		
	<xsl:template match="xsl:copy-of" >
		<xsl:choose>
			<xsl:when test="contains(@select,'Table')">
				<fo:table-row>
				<fo:table-cell>
				<fo:block>
					{Variable:<xsl:value-of select="@select"/>}
				</fo:block>
				</fo:table-cell>
				</fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				{Variable:<xsl:value-of select="@select"/>}
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="xsl:choose" >
		<xsl:choose>
			<xsl:when test="name(..) = 'fo:block'">
				{Condition: <xsl:apply-templates/>}
			</xsl:when>
			<xsl:when test="name(..) = 'fo:table-body'">
				<fo:table-row><fo:table-cell><fo:block>{Condition: </fo:block></fo:table-cell></fo:table-row>
				<xsl:apply-templates/>
				<fo:table-row><fo:table-cell><fo:block>}</fo:block></fo:table-cell></fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{Condition: <xsl:apply-templates/>}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="supsfo:cursor">
		<xsl:choose>
			<xsl:when test="@text">
				<xsl:call-template name="xhtmlcursor">
					<xsl:with-param name="cursorText"><xsl:value-of select="@text"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="xhtmlcursor">
					<xsl:with-param name="cursorText">Start adding text here.</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>	
	<xsl:template name="xhtmlcursor">
		<xsl:param name="cursorText"/>
		[CURSOR, text: <xsl:value-of select="$cursorText"/>]
	</xsl:template>	
	<xsl:template match="xsl:if" >
		<xsl:choose>
			<xsl:when test="name(..) = 'fo:block'">
				{if: (<xsl:value-of select="@test"/>) <xsl:apply-templates/>}
			</xsl:when>
			<xsl:when test="name(..) = 'fo:table-body'">
				<fo:table-row><fo:table-cell><fo:block>{if: (<xsl:value-of select="@test"/>)</fo:block></fo:table-cell></fo:table-row>
				<xsl:apply-templates/>
				<fo:table-row><fo:table-cell><fo:block>}</fo:block></fo:table-cell></fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{if: (<xsl:value-of select="@test"/>) <xsl:apply-templates/>}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="xsl:when" >
		<xsl:choose>
			<xsl:when test="name(../..) = 'fo:block'">
				{if: (<xsl:value-of select="@test"/>) <xsl:apply-templates/>}
			</xsl:when>
			<xsl:when test="name(../..) = 'fo:table-body'">
				<fo:table-row><fo:table-cell><fo:block>{if: (<xsl:value-of select="@test"/>)</fo:block></fo:table-cell></fo:table-row>
				<xsl:apply-templates/>
				<fo:table-row><fo:table-cell><fo:block>}</fo:block></fo:table-cell></fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{if: (<xsl:value-of select="@test"/>) <xsl:apply-templates/>}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="xsl:otherwise" >
		<xsl:choose>
			<xsl:when test="name(../..) = 'fo:block'">
				{otherwise: <xsl:apply-templates/>}
			</xsl:when>
			<xsl:when test="name(../..) = 'fo:table-body'">
				<fo:table-row><fo:table-cell><fo:block>{otherwise: </fo:block></fo:table-cell></fo:table-row>
				<xsl:apply-templates/>
				<fo:table-row><fo:table-cell><fo:block>}</fo:block></fo:table-cell></fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{otherwise: <xsl:apply-templates/>}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="xsl:call-template" >
		<xsl:choose>
			<xsl:when test="name(..) = 'fo:block'">
				{Template: <xsl:value-of select="@name"/><xsl:call-template name="add-parameters"/>}
			</xsl:when>
			<xsl:when test="name(..) = 'fo:table-body'">
				<fo:table-row><fo:table-cell><fo:block>{Template: <xsl:value-of select="@name"/><xsl:call-template name="add-parameters"/>}</fo:block></fo:table-cell></fo:table-row>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{Template: <xsl:value-of select="@name"/><xsl:call-template name="add-parameters"/>}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="add-parameters">
		<xsl:if test="xsl:with-param">
			(<xsl:for-each select="xsl:with-param">
				<xsl:if test="position() != 1">, </xsl:if>
				<xsl:value-of select="@name"/>=
				<xsl:choose>
					<xsl:when test="xsl:copy-of">
						<xsl:apply-templates/>
					</xsl:when>
					<xsl:when test="xsl:value-of">
						<xsl:apply-templates/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="text()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>)
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="supsfo:root">
		<xsl:element name="xsl:stylesheet">
			<xsl:attribute name="version">1.0</xsl:attribute>
			<xsl:attribute name="xsl" namespace="xmlns">http://www.w3.org/1999/XSL/Transform</xsl:attribute>
			<xsl:attribute name="ora" namespace="xmlns">http://www.oracle.com/XSL/Transform/java</xsl:attribute>
			<xsl:attribute name="fo" namespace="xmlns">http://www.w3.org/1999/XSL/Format</xsl:attribute>
			<xsl:attribute name="supsfo" namespace="xmlns">http://eds.com/supsfo</xsl:attribute>

			<xsl:element name="xsl:import">
				<xsl:attribute name="href">@word.processing.url.deploy@/_Generic/supsfo.xsl</xsl:attribute>
			</xsl:element>
			
			<xsl:element name="xsl:import">
				<xsl:attribute name="href">@word.processing.url.deploy@/_Generic/xhtml2fo.xsl</xsl:attribute>
			</xsl:element>
			
			<xsl:element name="xsl:strip-space">
				<xsl:attribute name="elements">*</xsl:attribute>
			</xsl:element>
			<xsl:element name="xsl:output">
				<xsl:attribute name="method">xml</xsl:attribute>
			</xsl:element>
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">copycount</xsl:attribute>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">additionalcopies</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">/variabledata/print/additionalcopies</xsl:attribute>
							<xsl:element name="xsl:value-of">
								<xsl:attribute name="select">/variabledata/print/additionalcopies</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">0</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">/variabledata/print/numberofcopies</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/print/numberofcopies + $additionalcopies</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:otherwise">
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select"><xsl:choose><xsl:when test="./supsfo:addressee/@copies"><xsl:value-of select="./supsfo:addressee/@copies "/></xsl:when><xsl:otherwise>1</xsl:otherwise></xsl:choose> + $additionalcopies</xsl:attribute>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			<xsl:element name="xsl:template">
				<xsl:attribute name="match">/</xsl:attribute>
				<fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
					<!-- ************* -->
					<!-- master set -->
					<!-- ************* -->
					<fo:layout-master-set>
						<fo:simple-page-master master-name="firstpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:variable name="extentvar"><xsl:value-of select="2.5"/></xsl:variable>							
							<xsl:choose>
								<xsl:when test="./supsfo:footer/@suppress = 'true' or ./supsfo:defaultFooter/@suppress = 'true'">
									<fo:region-body margin-top="0in" margin-left="0in" margin-right="0in" margin-bottom="0cm"/>
									<fo:region-before extent="0in"/>
									<fo:region-after region-name="footer" extent="0in"/>
									<fo:region-start extent="0in"/>
									<fo:region-end extent="0in"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:choose>
										<xsl:when test="./supsfo:footer/supsfo:address and /supsfo:root/supsfo:footnote/@noteextent">
											<xsl:variable name="footnoteextent"><xsl:value-of select="/supsfo:root/supsfo:footnote/@noteextent"/></xsl:variable>
											<xsl:variable name="footersize"><xsl:value-of select="$footnoteextent + 4.5 + $extentvar"/>cm</xsl:variable>
											<xsl:element name="fo:region-body">
												<xsl:attribute name="margin-top">0cm</xsl:attribute>
												<xsl:attribute name="margin-left">0cm</xsl:attribute>
												<xsl:attribute name="margin-right">0cm</xsl:attribute>
												<xsl:attribute name="margin-bottom"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>
											<fo:region-before extent="0cm"/>											
											<xsl:element name="fo:region-after">
												<xsl:attribute name="region-name">footer</xsl:attribute>
												<xsl:attribute name="extent"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>											
										</xsl:when>
										<xsl:when test="./supsfo:footer/supsfo:address">
											<xsl:variable name="footersize"><xsl:value-of select="4.5 + $extentvar"/>cm</xsl:variable>
											<xsl:element name="fo:region-body">
												<xsl:attribute name="margin-top">0cm</xsl:attribute>
												<xsl:attribute name="margin-left">0cm</xsl:attribute>
												<xsl:attribute name="margin-right">0cm</xsl:attribute>
												<xsl:attribute name="margin-bottom"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>
											<fo:region-before extent="0cm"/>											
											<xsl:element name="fo:region-after">
												<xsl:attribute name="region-name">footer</xsl:attribute>
												<xsl:attribute name="extent"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>											
										</xsl:when>
										<xsl:when test="/supsfo:root/supsfo:footnote/@noteextent">
											<xsl:variable name="footnoteextent"><xsl:value-of select="/supsfo:root/supsfo:footnote/@noteextent"/></xsl:variable>
											<xsl:variable name="footersize"><xsl:value-of select="$footnoteextent + $extentvar"/>cm</xsl:variable>
											<xsl:element name="fo:region-body">
												<xsl:attribute name="margin-top">0cm</xsl:attribute>
												<xsl:attribute name="margin-left">0cm</xsl:attribute>
												<xsl:attribute name="margin-right">0cm</xsl:attribute>
												<xsl:attribute name="margin-bottom"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>
											<fo:region-before extent="0cm"/>											
											<xsl:element name="fo:region-after">
												<xsl:attribute name="region-name">footer</xsl:attribute>
												<xsl:attribute name="extent"><xsl:value-of select="$footersize"/></xsl:attribute>
											</xsl:element>										
										</xsl:when>									
										<xsl:otherwise>
											<xsl:element name="fo:region-body">
												<xsl:attribute name="margin-top">0cm</xsl:attribute>
												<xsl:attribute name="margin-left">0cm</xsl:attribute>
												<xsl:attribute name="margin-right">0cm</xsl:attribute>
												<xsl:attribute name="margin-bottom"><xsl:value-of select="$extentvar"/>cm</xsl:attribute>
											</xsl:element>
											<fo:region-before extent="0cm"/>											
											<xsl:element name="fo:region-after">
												<xsl:attribute name="region-name">footer</xsl:attribute>
												<xsl:attribute name="extent"><xsl:value-of select="$extentvar"/>cm</xsl:attribute>
											</xsl:element>
										</xsl:otherwise>
									</xsl:choose>
									<fo:region-start extent="0cm"/>
									<fo:region-end extent="0cm"/>
								</xsl:otherwise>
							</xsl:choose>
						</fo:simple-page-master>

						<fo:simple-page-master master-name="otherpages" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="margin-top">0cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">1.8cm</xsl:attribute>
							</xsl:element>					
							<fo:region-before extent="0cm"/>						
							<fo:region-after extent="1.8cm"/>
							<fo:region-start extent="0cm"/>
							<fo:region-end extent="0cm"/>
						</fo:simple-page-master>

						<fo:simple-page-master master-name="landscapepage" page-height="210mm" page-width="297mm" margin-top="0.5cm" margin-bottom="0cm" margin-left="0.5cm" margin-right="0.5cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="margin-top">0cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">1cm</xsl:attribute>
							</xsl:element>											
							<fo:region-before extent="0cm"/>
							<fo:region-start extent="0cm"/>
							<fo:region-end extent="0cm"/>
						</fo:simple-page-master>

						<fo:simple-page-master master-name="letterpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="margin-top">0cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">1cm</xsl:attribute>
							</xsl:element>
							<fo:region-before extent="0cm"/>											
							<xsl:element name="fo:region-after">
								<xsl:attribute name="region-name">footer</xsl:attribute>
								<xsl:attribute name="extent">1cm</xsl:attribute>
							</xsl:element>
							<fo:region-start extent="0cm"/>
							<fo:region-end extent="0cm"/>
						</fo:simple-page-master>

						<fo:simple-page-master master-name="addressboxpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="region-name">addressheader</xsl:attribute>
								<xsl:attribute name="margin-top">0cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">0cm</xsl:attribute>
							</xsl:element>											
							<xsl:element name="fo:region-before">
								<!--<xsl:attribute name="region-name">addressheader</xsl:attribute>-->
								<xsl:attribute name="extent">0cm</xsl:attribute>
							</xsl:element>
							<fo:region-after extent="0cm"/>
							<fo:region-start extent="0cm"/>
							<fo:region-end extent="0cm"/>
						</fo:simple-page-master>

						<fo:page-sequence-master master-name="document">
							<fo:single-page-master-reference master-reference="firstpage"/>
							<fo:repeatable-page-master-reference master-reference="otherpages"/>
						</fo:page-sequence-master>
						
						<fo:page-sequence-master master-name="letter">
							<fo:repeatable-page-master-reference master-reference="letterpage"/>
						</fo:page-sequence-master>

						<fo:page-sequence-master master-name="landscape">
							<fo:repeatable-page-master-reference master-reference="landscapepage"/>
						</fo:page-sequence-master>

						<fo:page-sequence-master master-name="order">
							<fo:single-page-master-reference master-reference="firstpage"/>
							<fo:single-page-master-reference master-reference="addressboxpage"/>
							<fo:repeatable-page-master-reference master-reference="otherpages"/>
						</fo:page-sequence-master>
					
					</fo:layout-master-set>
					<!-- ************ -->
					<!-- page seq  -->
					<!-- ************ -->
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name">multiplecopies</xsl:attribute>
						<xsl:element name="xsl:with-param"><xsl:attribute name="name">copies</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">$copycount</xsl:attribute></xsl:element></xsl:element>
					</xsl:element>
				</fo:root>
			</xsl:element>
			<xsl:element name="xsl:template">
				<xsl:attribute name="name">multiplecopies</xsl:attribute>
				<xsl:element name="xsl:param">
					<xsl:attribute name="name">copies</xsl:attribute>
				</xsl:element>
				<xsl:choose>
					<xsl:when test="supsfo:layout = 'general'">
						<xsl:apply-templates select="supsfo:sections/supsfo:section" mode="address"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="call-multiaddress"/>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:element name="xsl:if">
					<xsl:attribute name="test">$copies > 1</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name">multiplecopies</xsl:attribute>
						<xsl:element name="xsl:with-param"><xsl:attribute name="name">copies</xsl:attribute><xsl:attribute name="select">$copies - 1</xsl:attribute></xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			<xsl:choose>
				<xsl:when test="supsfo:layout = 'general'">
					<xsl:apply-templates select="supsfo:sections/supsfo:section" mode="createsequences"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="createsequences"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>
	<xsl:template name="createsequences">
		<xsl:choose>
			<xsl:when test="supsfo:layout = 'letter'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">doletterpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="letterpagesequence"/>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'order'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">doorderpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="orderpagesequence"/>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'landscape'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">dolandscapepagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="landscapepagesequence"/>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'warrant'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">dowarrantpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="warrantpagesequence"/>
				</xsl:element>
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">donoticepagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="noticepagesequence"/>
				</xsl:element>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
			
	<xsl:template name="noticepagesequence">
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>	
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">type</xsl:attribute>
		</xsl:element>		
		<xsl:element name="fo:page-sequence">
			<xsl:attribute name="master-reference">document</xsl:attribute>
			<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
			<!-- ************ -->
			<!-- FOOTER -->
			<!-- ************ -->
			<xsl:apply-templates select="supsfo:footer"/>
			<xsl:apply-templates select="supsfo:defaultFooter"/>

			<!-- ************ -->
			<!-- MAIN DOC-->
			<!-- ************ -->
			<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
				<!-- ************* -->
				<!-- PAGE ONE -->
				<!-- ************* -->
				<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<xsl:apply-templates select="supsfo:loweraddress"/>
				<fo:block text-align="justify">
					<fo:table table-layout="fixed">
						<fo:table-column column-width="10.16cm"/>
						<fo:table-column column-width="1cm"/>
						<fo:table-column column-width="8.12cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell>
									<fo:table table-layout="fixed">
										<fo:table-column column-width="10.16cm"/>
										<fo:table-body>
											<fo:table-row>
												<fo:table-cell height="2cm">
													<xsl:apply-templates select="supsfo:header"/>
												</fo:table-cell>
											</fo:table-row>
											<fo:table-row>
												<fo:table-cell>
													<fo:block space-after="1.2cm"/>
													<fo:block height="3.9cm" space-before="0.5cm">
														<xsl:choose>
															<xsl:when test="supsfo:suppressaddress">
															</xsl:when>
															<xsl:otherwise>
																<fo:table table-layout="fixed" height="3.9cm">
																	<fo:table-column column-width="0.5cm"/>
																	<fo:table-column column-width="9.3cm"/>
																	<fo:table-body height="3.9cm">
																		<fo:table-row height="3.9cm">
																			<fo:table-cell height="3.9cm"/>
																			<fo:table-cell height="3.9cm" font-size="10pt" border-style="solid" border-width="0.02cm" padding="0.3cm" overflow="hidden">
																						<xsl:element name="xsl:if">
																							<xsl:attribute name="test">$type='true'</xsl:attribute>
																							<xsl:element name="fo:block">
																								STAFF IN CONFIDENCE
																							</xsl:element>
																						</xsl:element>
																				<fo:block>
																				{Template: format-address-multi-line (party=$addressee)}
																				<xsl:call-template name="showAddress"/>
																				</fo:block>
																			</fo:table-cell>
																		</fo:table-row>
																	</fo:table-body>
																</fo:table>
															</xsl:otherwise>
														</xsl:choose>															
													</fo:block>
													<fo:block space-after="0.4cm"/>
												</fo:table-cell>
											</fo:table-row>
											<fo:table-row>
												<fo:table-cell>
													<xsl:apply-templates select="supsfo:bodyintroleft"/>
												</fo:table-cell>
											</fo:table-row>
										</fo:table-body>
									</fo:table>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block/>
								</fo:table-cell>
								<fo:table-cell>
									<xsl:apply-templates select="supsfo:courtcase"/>
									<xsl:apply-templates select="supsfo:bodyintroright"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:block>
				<fo:block text-align="justify">
					<fo:table table-layout="fixed">
						<fo:table-column column-width="19.28cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell font-family="Times" font-size="10pt">
									<xsl:apply-templates select="supsfo:body"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:block>
			</fo:flow>
		</xsl:element>
	</xsl:template>
	<xsl:template name="warrantpagesequence">
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="fo:page-sequence">
			<xsl:attribute name="master-reference">document</xsl:attribute>
			<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
			<!-- ************ -->
			<!-- FOOTER -->
			<!-- ************ -->
			<xsl:apply-templates select="supsfo:footer"/>
			<xsl:apply-templates select="supsfo:defaultFooter"/>

			<!-- ************ -->
			<!-- MAIN DOC-->
			<!-- ************ -->
			<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
				<!-- ************* -->
				<!-- PAGE ONE -->
				<!-- ************* -->
				<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<xsl:apply-templates select="supsfo:loweraddress"/>
				<fo:block text-align="justify">
					<fo:table table-layout="fixed">
						<fo:table-column column-width="10.16cm"/>
						<fo:table-column column-width="1cm"/>
						<fo:table-column column-width="8.12cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell>
									<fo:table table-layout="fixed">
										<fo:table-column column-width="10.16cm"/>
										<fo:table-body>
											<fo:table-row>
												<fo:table-cell height="2cm">
													<xsl:apply-templates select="supsfo:header"/>
												</fo:table-cell>
											</fo:table-row>
											<fo:table-row>
												<fo:table-cell>
													<xsl:apply-templates select="supsfo:bodyintroleft"/>
												</fo:table-cell>
											</fo:table-row>
										</fo:table-body>
									</fo:table>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block/>
								</fo:table-cell>
								<fo:table-cell>
									<xsl:apply-templates select="supsfo:courtcase"/>
									<xsl:apply-templates select="supsfo:bodyintroright"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:block>
				<fo:block text-align="justify">
					<fo:table table-layout="fixed">
						<fo:table-column column-width="19.28cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell font-family="Times" font-size="10pt">
									<xsl:apply-templates select="supsfo:body"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:block>
			</fo:flow>
		</xsl:element>
	</xsl:template>
	<xsl:template name="letterpagesequence">
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="fo:page-sequence">
			<xsl:attribute name="master-reference">letter</xsl:attribute>
			<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
			<!-- ************ -->
			<!-- FOOTER -->
			<!-- ************ -->
			<xsl:apply-templates select="supsfo:letterfooter"/>

			<!-- ************ -->
			<!-- MAIN DOC-->
			<!-- ************ -->
			<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
				<!-- ************* -->
				<!-- PAGE ONE -->
				<!-- ************* -->
				<fo:block-container position="absolute" top="9.3cm" left="-0.8cm" right="2cm" bottom="12cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:block-container position="absolute" top="19.9cm" left="-0.8cm" right="2cm" bottom="22cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:table table-layout="fixed" font-size="10pt">
					<fo:table-column column-width="13cm"></fo:table-column>
					<fo:table-column column-width="6cm"></fo:table-column>
					<fo:table-body>
						<fo:table-row>
							<fo:table-cell>
								<xsl:call-template name="logo"/>
							</fo:table-cell>
							<fo:table-cell number-rows-spanned="3">
								<fo:block font-weight="bold">HM COURTS &amp; TRIBUNALS SERVICE</fo:block>
								<fo:block>{Template: format-address-multi-line (party=$vdCourt)}</fo:block>
								<fo:block><fo:inline font-weight="bold">Minicom VII</fo:inline> (Gateshead) 0191 4781476</fo:block>
								<fo:block>(Helpline for the deaf and hard of hearing)</fo:block>
								<fo:block font-weight="bold" space-before="0.5cm">www.hmcourts-service.gov.uk</fo:block>
									<xsl:if test="supsfo:layout/@yourRef = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdSubjectReference}
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefAe = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdAEReference}
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefCo = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdCOReference}
										</fo:block>
									</xsl:if>		
									<xsl:if test="supsfo:layout/@yourRefAx = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdPartyForOrSolicitorReference}
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefInst = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdInstigatorReference}
										</fo:block>
									</xsl:if>											
									<xsl:if test="supsfo:layout/@yourRefaejudgmentcreditor = 'true'">
										<fo:block space-before="0.5cm">
											Your ref: {Variable:$vdAEJudgmentCreditorRef}
										</fo:block>
									</xsl:if>																									
							</fo:table-cell>
						</fo:table-row>
						<fo:table-row>
							<fo:table-cell padding-left="2.75cm">
							<fo:block>
							{Template: format-address-multi-line (party=$addressee)}
							<xsl:call-template name="showAddress"/>
							</fo:block>
						</fo:table-cell>
						</fo:table-row>
						<fo:table-row>
							<fo:table-cell padding-left="2.75cm">
								<fo:block space-before="1cm">{$vdEventDate}</fo:block>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>
				<fo:table table-layout="fixed">
					<fo:table-column column-width="19cm"></fo:table-column>
					<fo:table-body>
						<fo:table-row>
							<fo:table-cell padding-left="2.75cm">
								<xsl:apply-templates select="supsfo:body"/>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>
			</fo:flow>
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="landscapepagesequence">
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="fo:page-sequence">
			<xsl:attribute name="master-reference">landscape</xsl:attribute>
			<!-- ************ -->
			<!-- MAIN DOC-->
			<!-- ************ -->
			<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
				<fo:block font-family="Times" font-size="10pt">
					<xsl:apply-templates select="supsfo:body"/>
				</fo:block>
			</fo:flow>
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="orderpagesequence">
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="fo:page-sequence">
			<xsl:attribute name="master-reference">order</xsl:attribute>
			<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
			<xsl:attribute name="force-page-count"><xsl:choose><xsl:when test="./supsfo:duplex">end-on-even</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>

			<fo:static-content flow-name="addressheader">
				<fo:block space-after="1.2cm"/>
				<fo:block height="3.9cm" space-before="0.5cm">
					<fo:table table-layout="fixed" height="3.9cm">
						<fo:table-column column-width="0.5cm"/>
						<fo:table-column column-width="9.3cm"/>
						<fo:table-body height="3.9cm">
							<fo:table-row height="3.9cm">
								<fo:table-cell height="3.9cm"/>
								<fo:table-cell height="3.9cm" font-size="10pt" border-style="solid" border-width="0.02cm" padding="0.3cm" overflow="hidden">
									<fo:block>{Template: format-address-multi-line (party=$addressee)}</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:block>
			</fo:static-content>
			<xsl:apply-templates select="supsfo:footer"/>
			<xsl:apply-templates select="supsfo:defaultFooter"/>
			<!-- ************ -->
			<!-- MAIN DOC-->
			<!-- ************ -->
			<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
				<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
				<fo:block text-align="justify">
					<fo:table table-layout="fixed">
						<fo:table-column column-width="10.16cm"/>
						<fo:table-column column-width="1cm"/>
						<fo:table-column column-width="8.12cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell height="2cm">
									<xsl:apply-templates select="supsfo:header"/>
								</fo:table-cell>
								<fo:table-cell>
									<fo:block/>
								</fo:table-cell>
								<fo:table-cell>
									<xsl:apply-templates select="supsfo:courtcase"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				<xsl:element name="xsl:if">
					<xsl:attribute name="test">string-length(/variabledata/claim/claimant) > 0</xsl:attribute>					
					<fo:block space-after="0.5cm"/>
					<fo:block>{for-each (claimant) {</fo:block>
					<fo:table table-layout="fixed">
						<fo:table-column column-width="14.55cm"/>
						<fo:table-column column-width="4.73cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
									<fo:block>{name}</fo:block>
								</fo:table-cell>
								<fo:table-cell border-style="solid" border-width="0.02cm">
									<fo:block font-weight="bold">{number}{st/nd/rd/th} Claimant</fo:block>
									<fo:block><fo:inline font-weight="bold">Ref </fo:inline>{reference}</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
					<fo:block>}</fo:block>
					<fo:block>{for-each (defendant) {</fo:block>
					<fo:table table-layout="fixed">
						<fo:table-column column-width="14.55cm"/>
						<fo:table-column column-width="4.73cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
									<fo:block>{name}</fo:block>
								</fo:table-cell>
								<fo:table-cell border-style="solid" border-width="0.02cm">
									<fo:block font-weight="bold">{number}{st/nd/rd/th} Defendant</fo:block>
									<fo:block><fo:inline font-weight="bold">Ref </fo:inline>{reference}</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
					<fo:block>}</fo:block>
					<fo:block space-after="0.5cm"/>
					</xsl:element>					
					<xsl:apply-templates select="supsfo:body"/>
				</fo:block>
			</fo:flow>
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="supsfo:section" mode="address">
		<xsl:call-template name="call-multiaddress">
			<xsl:with-param name="section"><xsl:value-of select="@name"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="supsfo:section" mode="createsequences">
		<xsl:call-template name="createsequences"/>
	</xsl:template>

	<xsl:template name="call-multiaddress">
		<xsl:param name="section"/>
		<xsl:call-template name="multiaddress">
			<xsl:with-param name="pagelayout">
				<xsl:choose>
					<xsl:when test="supsfo:layout = 'letter'">doletterpagesequence</xsl:when>
					<xsl:when test="supsfo:layout = 'landscape'">dolandscapepagesequence</xsl:when>
					<xsl:when test="supsfo:layout = 'order'">doorderpagesequence</xsl:when>
					<xsl:when test="supsfo:layout = 'warrant'">dowarrantpagesequence</xsl:when>
					<xsl:otherwise>donoticepagesequence</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="section"><xsl:value-of select="$section"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="supsfo:single">
		<xsl:element name="fo:single-page-master-reference">
			<xsl:attribute name="master-reference">@name</xsl:attribute>
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="supsfo:repeatable">
		<xsl:element name="fo:repeatable-page-master-reference">
			<xsl:attribute name="master-reference">@name</xsl:attribute>
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="supsfo:header">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="supsfo:courtcase">
		<fo:table table-layout="fixed" space-after="0.2cm">
			<fo:table-column column-width="3.39cm"/>
			<fo:table-column column-width="4.73cm"/>
			<fo:table-body>
				<xsl:for-each select="supsfo:court">
					<fo:table-row>
						<fo:table-cell number-columns-spanned="2" border-width="0.01in" border-style="solid" padding="0.2cm">
							<!--<xsl:copy-of select="*"/>-->
							<xsl:apply-templates/>
						</fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
				<xsl:if test="count(supsfo:courtinfo) > 0">
					<fo:table-row>
						<fo:table-cell number-columns-spanned="2" border-width="0.01in" border-style="solid" padding="0.1cm">
							<!-- old hardcoded: <fo:block font-size="8pt">The court office at FIELD(20) is open between 10am and 4pm Monday to Friday Tel: FIELD(21)</fo:block>-->
							<xsl:for-each select="supsfo:courtinfo">
							<!--<xsl:copy-of select="*"/>-->
							<xsl:apply-templates/>
							</xsl:for-each>
						</fo:table-cell>
					</fo:table-row>
				</xsl:if>

				<xsl:for-each select="supsfo:caseparameters/supsfo:parameter">
					<fo:table-row>
						<fo:table-cell border-width="0.01in" border-style="solid" padding="0.1cm">
							<xsl:for-each select="supsfo:name">
								<!--xsl:copy-of select="*"/-->
								<xsl:apply-templates/>
								
							</xsl:for-each>
						</fo:table-cell>
						<fo:table-cell border-width="0.01in" border-style="solid" padding="0.1cm">
							<xsl:for-each select="supsfo:value">
								<!--xsl:copy-of select="*"/-->
								
									<xsl:apply-templates/>
								
							</xsl:for-each>
						</fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
				<!-- Block Starts for Showing Date of Birth id caseparameter/dobparameter is defined in *-FO.xml -->
				<fo:table-row>
					<xsl:if test="count(supsfo:caseparameters/supsfo:dobparameter) > 0">
					<fo:table-cell number-columns-spanned="2">
					<fo:block>
					{Template: format-date-of-birth-template (partyType=<xsl:value-of select="supsfo:caseparameters/supsfo:dobparameter/@partyType"/>)}
						<!--
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name">format-date-of-birth-template</xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">$mode</xsl:attribute>
								</xsl:element>
							</xsl:element>							
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">party</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">$addressee</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">partyType</xsl:attribute>
								<xsl:value-of select="supsfo:caseparameters/supsfo:dobparameter/@partyType"/>
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">referenceCJR</xsl:attribute>
								<xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/>
							</xsl:element>
						</xsl:element>
-->
						</fo:block>
					</fo:table-cell>
					</xsl:if>
				</fo:table-row>
				<!-- Block Ends for Showing Date of Birth id caseparameter/dobparameter is defined in *-FO.xml -->				
			</fo:table-body>
		</fo:table>
	</xsl:template>
	<xsl:template match="supsfo:address">
		<xsl:call-template name="supsfo:addressbox"/>
	</xsl:template>
	<xsl:template match="supsfo:address2">
		<xsl:call-template name="supsfo:addressbox"/>
	</xsl:template>
	<xsl:template name="supsfo:addressbox">
		<fo:block height="3.9cm" space-before="0.5cm">
			<fo:table table-layout="fixed" height="3.9cm">
				<fo:table-column column-width="0.5cm"/>
				<fo:table-column column-width="9.3cm"/>
				<fo:table-body height="3.9cm">
					<fo:table-row height="3.9cm">
						<fo:table-cell height="3.9cm"/>
						<fo:table-cell height="3.9cm">
										
							<xsl:choose>
								<xsl:when test="@suppressborder='true'">
									<fo:block font-size="10pt" height="3.9cm" border-width="0.02cm" padding="0.3cm" overflow="hidden">
										<!--xsl:apply-templates/-->
										<xsl:apply-templates/>
									</fo:block>
								</xsl:when>
								<xsl:otherwise>
									<fo:block font-size="10pt" height="3.9cm" border-width="0.02cm" border-style="solid" padding="0.3cm" overflow="hidden">
										<!--xsl:apply-templates/-->
										<xsl:apply-templates/>
									</fo:block>
								</xsl:otherwise>
							</xsl:choose>
						
						</fo:table-cell>
					</fo:table-row>
				</fo:table-body>
			</fo:table>
		</fo:block>
	</xsl:template>
	<xsl:template match="supsfo:bodyintroleft">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="supsfo:bodyintroright">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="supsfo:body">
		<xsl:choose>
			<xsl:when test="@font-size">
					<xsl:element name="xsl:element">
						<xsl:attribute name="name">fo:block</xsl:attribute>
						<xsl:element name="xsl:attribute">
							<xsl:attribute name="name">font-size</xsl:attribute>
							<xsl:value-of select="@font-size"/>
						</xsl:element>
						<xsl:apply-templates/>
					</xsl:element>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="supsfo:numbered-list">
		<fo:block>{Numbered List: (<xsl:value-of select="@name"/>)</fo:block>
			<xsl:apply-templates select="supsfo:list-item" mode="numbered"/>
		<fo:block>}</fo:block>
	</xsl:template>
	
	<xsl:template match="supsfo:list-item" mode="numbered">
		<fo:block>{List Item: <xsl:if test="@condition">(<xsl:value-of select="@condition"/>)</xsl:if></fo:block>
			<xsl:apply-templates/>
		<fo:block>}</fo:block>
	</xsl:template>
	
	<xsl:template match="supsfo:list">
		<xsl:choose>
			<xsl:when test="@type ='checkBoxWithLabel'">
				<fo:list-block provisional-distance-between-starts="1.0cm" provisional-label-separation="1.0cm">
					<xsl:apply-templates>
						<xsl:with-param name="listType">
							<xsl:value-of select="@type"/>
						</xsl:with-param>
					</xsl:apply-templates>
				</fo:list-block>
			</xsl:when>
			<xsl:otherwise>
				<fo:list-block provisional-distance-between-starts="0.5cm" provisional-label-separation="0.5cm">
					<xsl:apply-templates>
						<xsl:with-param name="listType">
							<xsl:value-of select="@type"/>
						</xsl:with-param>
					</xsl:apply-templates>
				</fo:list-block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="supsfo:list-item">
		<xsl:param name="listType">bullet</xsl:param>
		<fo:list-item>
			<xsl:choose>
				<xsl:when test="$listType='checkbox'">
					<fo:list-item-label start-indent="0.05cm" end-indent="label-end()">
						<xsl:call-template name="supsfo:checkbox"/>
					</fo:list-item-label>
				</xsl:when>
				<xsl:when test="$listType='checkBoxWithLabel'">
					<fo:list-item-label start-indent="0.05cm" end-indent="label-end()">
						<xsl:call-template name="supsfo:checkBoxWithLabel"/>
					</fo:list-item-label>
				</xsl:when>
				<xsl:otherwise>
					<fo:list-item-label start-indent="0.05cm" end-indent="label-end()">
						<xsl:call-template name="supsfo:bullet"/>
					</fo:list-item-label>
				</xsl:otherwise>
			</xsl:choose>
			<fo:list-item-body start-indent="body-start()">
				<xsl:apply-templates/>
			</fo:list-item-body>
		</fo:list-item>
	</xsl:template>
	<xsl:template name="supsfo:checkbox">
		<fo:block>
			<fo:table table-layout="fixed">
				<fo:table-column column-width="0.3cm"/>
				<fo:table-body>
					<fo:table-row>
						<fo:table-cell border-style="solid" border-width="0.01cm">
							<fo:block font-size="8pt">&#xA0;</fo:block>
						</fo:table-cell>
					</fo:table-row>
				</fo:table-body>
			</fo:table>
		</fo:block>
	</xsl:template>
	<xsl:template name="supsfo:checkBoxWithLabel">
		<fo:block>
			<fo:table table-layout="fixed">
				<fo:table-column column-width="0.4cm"/>
				<fo:table-column column-width="0.4cm"/>
				<fo:table-body>
					<fo:table-row>
						<fo:table-cell>
							<fo:block font-size="10pt" font-weight="bold">
								<xsl:value-of select="./supsfo:bulletText"/>
							</fo:block>
						</fo:table-cell>
						<fo:table-cell border-style="solid" border-width="0.01cm">
							<fo:block font-size="8pt">&#xA0;</fo:block>
						</fo:table-cell>
					</fo:table-row>
				</fo:table-body>
			</fo:table>
		</fo:block>
	</xsl:template>
	<xsl:template name="supsfo:bullet">
		<fo:block font-size="8pt">&#x2022;</fo:block>
	</xsl:template>
	<xsl:template match="supsfo:leader">
		<xsl:element name="xsl:call-template">
			<xsl:attribute name="name">insertleader</xsl:attribute>
		</xsl:element>
	</xsl:template>
	<xsl:template name="insertleader">
		<fo:block-container reference-orientation="0">
		<fo:block margin-left="-0.9cm" margin-right="-0.9cm" text-align="left">
			<fo:inline font-family="ZapfDingbats">&#9986;</fo:inline>
			<fo:leader leader-length="20.1cm" leader-pattern="rule" rule-style="dotted" leader-pattern-width= "3pt" alignment-baseline="middle" rule-thickness="1pt" color="black"/>			
		</fo:block>
		</fo:block-container>
	</xsl:template>
	<xsl:template match="supsfo:seal">
		<fo:block color="#888888" font-size="10pt" font-style="italic" start-indent="3cm" padding-before="1cm" padding-after="0.4cm">Seal</fo:block>
	</xsl:template>
	

	<!-- footnote template -->
	<!-- -->	
	<xsl:template match="supsfo:footnote">
			<xsl:apply-templates/>
	</xsl:template>	
	

	<xsl:template name="getDefaultFooterXML" match="supsfo:defaultFooter">
		<xsl:param name="OutputId"><xsl:value-of select="@id"/></xsl:param>
		<xsl:param name="Type"><xsl:value-of select="@type"/></xsl:param>		
		<xsl:choose>
			<xsl:when test="@suppress = 'true'">
			
			</xsl:when>
			<xsl:otherwise>
				<fo:static-content flow-name="footer">
					<xsl:if test="/supsfo:root/supsfo:footnote">
						<xsl:apply-templates select="/supsfo:root/supsfo:footnote"/>
					</xsl:if>
					<xsl:call-template name="footerFO">
						<xsl:with-param name="referenceN">
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$OutputId]/NReference"/>
							<xsl:text> </xsl:text>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$OutputId]/Description"/>
						</xsl:with-param>
						<xsl:with-param name="referenceCJR">
							<xsl:value-of select="$OutputId"/>
						</xsl:with-param>
						<xsl:with-param name="type">
							<xsl:value-of select="$Type"/>
						</xsl:with-param>							
					</xsl:call-template>
				</fo:static-content>
				<fo:static-content flow-name="basicfooter">
				<fo:block background-color="#cccccc">
					<xsl:call-template name="footerFO">
						<xsl:with-param name="referenceN">
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$OutputId]/NReference"/>
							<xsl:text> </xsl:text>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$OutputId]/Description"/>
						</xsl:with-param>
						<xsl:with-param name="referenceCJR">
							<xsl:value-of select="$OutputId"/>
						</xsl:with-param>
						<xsl:with-param name="type">
							<xsl:value-of select="$Type"/>
						</xsl:with-param>						
					</xsl:call-template>
					</fo:block>
				</fo:static-content>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template name="getDefaultFooter" match="supsfo:footer">
		<xsl:choose>
			<xsl:when test="@suppress = 'true'">
		</xsl:when>
			<xsl:otherwise>
				<fo:static-content flow-name="footer">
					<fo:block background-color="#cccccc">
					<xsl:call-template name="getDefaultFooterContent"/>
					</fo:block>
				</fo:static-content>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="supsfo:letterfooter">
		<fo:static-content flow-name="footer">
			<fo:block font-family="Times" font-size="8pt" text-align="right" background-color="#cccccc"><xsl:value-of select="@id"/></fo:block>
		</fo:static-content>
	</xsl:template>
	
	
	
	<xsl:template name="getDefaultFooterContent" match="supsfo:getFooter">
		<xsl:param name="OutputId" />
		
		<xsl:call-template name="footerFO">
		
		<xsl:with-param name="referenceN">
			<xsl:choose>
				<xsl:when test="name(.) = 'getFooter'">
					<xsl:choose>
						<xsl:when test="/supsfo:root/supsfo:defaultFooter" >
							<xsl:variable name="tmpId"><xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/></xsl:variable>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/NReference"/>
							<xsl:text> </xsl:text>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/Description"/>
						</xsl:when>
						<xsl:otherwise><xsl:value-of select="/supsfo:root/supsfo:footer/supsfo:docNRef"/></xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="/supsfo:root/supsfo:defaultFooter" >
							<xsl:variable name="tmpId"><xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/></xsl:variable>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/NReference"/>
							<xsl:text> </xsl:text>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/Description"/>
						</xsl:when>
						<xsl:otherwise><xsl:value-of select="supsfo:docNRef"/></xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:with-param>
		
		<xsl:with-param name="referenceCJR">
				<xsl:choose>
				<xsl:when test="name(.) = 'getFooter'">
					<xsl:choose>
						<xsl:when test="/supsfo:root/supsfo:defaultFooter" >
							<xsl:variable name="tmpId"><xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/></xsl:variable>
							<xsl:value-of select="$tmpId"/>
						</xsl:when>
						<xsl:otherwise><xsl:value-of select="/supsfo:root/supsfo:footer/supsfo:docCJRRef"/></xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="/supsfo:root/supsfo:defaultFooter" >
							<xsl:variable name="tmpId"><xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/></xsl:variable>
							<xsl:value-of select="$tmpId"/>							
						</xsl:when>
						<xsl:otherwise><xsl:value-of select="supsfo:docCJRRef"/></xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:with-param>
		
		<xsl:with-param name="type">
			<xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@type"/>
		</xsl:with-param>
		
		</xsl:call-template>

	</xsl:template>
	
	<xsl:template name="footerFO">
		<xsl:param name="referenceCJR"/>
		<xsl:param name="referenceN"/>
		<xsl:param name="type"/>
		
		<fo:block font-family="Times" font-size="8pt" text-align="justify" border-top-width="0.02in" border-top-style="solid">
			<fo:block space-before="4pt">
			<xsl:choose>
				<xsl:when test="$type = 'bailiff'">
				The bailiff, {Variable:$vdBailiffName}, can be contacted between {Variable:$vdBailiffAvailability} on telephone {Variable:$vdBailiffTelephone}.
				</xsl:when>
			</xsl:choose>
				<xsl:text>The court office at {Variable:$vdCourtName}</xsl:text>
				<xsl:text>&#xa0; {Variable:$vdHearingAtCourtOrDistrict}</xsl:text>
					,<xsl:text> </xsl:text>
				{Template:format-address-single-line($vdCourtAddress)}
				<xsl:text> is open between 10 a.m. and 4 p.m. Monday to Friday.</xsl:text>

		<xsl:choose>
			<xsl:when test="string-length($type) = 0 or $type != 'bailiff'">				
				<xsl:text> When corresponding with the court, please address forms or letters to the </xsl:text>
				<xsl:text>Court Manager</xsl:text>
				<xsl:text> and quote the</xsl:text>
				<xsl:choose>
					<xsl:when test="@CO='true'"><xsl:text> AO/CAEO number.</xsl:text></xsl:when>
					<xsl:otherwise><xsl:text> claim number.</xsl:text></xsl:otherwise>
				</xsl:choose>
				<xsl:text>{if: (string-length($vdCourtTelephoneNumber) > 0) {Variable:$vdCourtTelephoneNumber}}</xsl:text>
				<xsl:text>{if: (string-length($vdCourtFaxNumber) > 0) {Variable:$vdCourtFaxNumber}}</xsl:text>
				</xsl:when>
			<xsl:when test="$type = 'bailiff'">
				<xsl:text>{if: (string-length($vdCourtTelephoneNumber) > 0) {Variable:$vdCourtTelephoneNumber}}</xsl:text>
				<xsl:text>{if: (string-length($vdCourtFaxNumber) > 0) {Variable:$vdCourtFaxNumber}}</xsl:text>						
			</xsl:when>
		</xsl:choose>
			</fo:block>
			<fo:block text-align="right">
				<xsl:text>Produced by:</xsl:text>
				<xsl:text>{Variable:$vdProducedBy}</xsl:text>
			</fo:block>
			<fo:table table-layout="fixed" width="100%">
				<fo:table-column column-width="proportional-column-width(3)"/>
				<fo:table-column column-width="proportional-column-width(1)"/>
				<fo:table-body>
					<fo:table-row>
						<fo:table-cell text-align="left">
							<xsl:choose>
								<xsl:when test="supsfo:description">
									<xsl:copy-of select="supsfo:description/*"/>
								</xsl:when>
								<xsl:otherwise>
									<fo:block>
										<xsl:value-of select="$referenceN"/>
									</fo:block>
								</xsl:otherwise>
							</xsl:choose>
						</fo:table-cell>
						<fo:table-cell text-align="right">
							<fo:block>
								<xsl:value-of select="$referenceCJR"/>
							</fo:block>
						</fo:table-cell>
					</fo:table-row>
				</fo:table-body>
			</fo:table>
		</fo:block>
		<xsl:apply-templates select="supsfo:address"/>
	</xsl:template>



	<xsl:template match="supsfo:signature">
		<fo:block>
			<fo:table table-layout="fixed">
				<xsl:choose>
					<xsl:when test="@signaturetype = 'signature'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="8.0cm"/>
						<fo:table-column column-width="2.03cm"/>
						<fo:table-column column-width="5.00cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Date </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<xsl:if test="@showguardiantext = 'true'">
								<fo:table-row>
									<fo:table-cell number-columns-spanned="3" text-align="center">
										<fo:block font-size="9pt" space-before="0.2cm">Claimant('s Solicitor)(Litigation friend (<fo:inline font-style="italic">where the claimant is a child or a patient</fo:inline>))</fo:block>
									</fo:table-cell>
								</fo:table-row>
							</xsl:if>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'signature2'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="8.0cm"/>
						<fo:table-column column-width="2.03cm"/>
						<fo:table-column column-width="5.00cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Date </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<xsl:if test="@showguardiantext = 'true'">
								<fo:table-row>
									<fo:table-cell number-columns-spanned="3" text-align="center">
										<fo:block font-size="9pt" space-before="0.2cm">Claimant('s Solicitor)(Litigation friend (<fo:inline font-style="italic">where the claimant is a child or a patient</fo:inline>))</fo:block>
									</fo:table-cell>
								</fo:table-row>
							</xsl:if>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'signaturedate'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="8.0cm"/>
						<fo:table-column column-width="2.03cm"/>
						<fo:table-column column-width="5.00cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Date VARIABLE(DATE)</fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<xsl:if test="@showguardiantext = 'true'">
								<fo:table-row>
									<fo:table-cell number-columns-spanned="3" text-align="center">
										<fo:block font-size="9pt" space-before="0.2cm">Claimant('s Solicitor)(Litigation friend (<fo:inline font-style="italic">where the claimant is a child or a patient</fo:inline>))</fo:block>
									</fo:table-cell>
								</fo:table-row>
							</xsl:if>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'small'">
						<fo:table-column column-width="1.14cm"/>
						<fo:table-column column-width="4.23cm"/>
						<fo:table-column column-width="1.51cm"/>
						<fo:table-column column-width="2.90cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Date </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell number-columns-spanned="4" text-align="center">
									<fo:block font-size="8pt" space-before="0.2cm">Claimant('s Solicitor)/(Litigation friend (<fo:inline font-style="italic">where the claimant is a child or a patient</fo:inline>))</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'date'">
						<fo:table-column column-width="1.14cm"/>
						<fo:table-column column-width="6.23cm"/>
						<fo:table-column column-width="4.51cm"/>
						<fo:table-column column-width="5.90cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.5cm" >Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.5cm">Position or office held </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell number-columns-spanned="2" text-align="right">
									<fo:block font-size="8pt">(Claimant)(defendant)('s Solicitor)('s Litigation friend)</fo:block>
								</fo:table-cell>
								<fo:table-cell> </fo:table-cell>
								<fo:table-cell text-align="center">
									<fo:block font-size="8pt">(If signing on behalf or firm or company)</fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="1.0cm">Date </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'claimant'">
						<fo:table-column column-width="1.14cm"/>
						<fo:table-column column-width="6.23cm"/>
						<fo:table-column column-width="4.51cm"/>
						<fo:table-column column-width="5.90cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.5cm" >Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.5cm">Position or office held </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell number-columns-spanned="2" text-align="right">
									<fo:block font-size="8pt">(Claimant)('s Solicitor)('s Litigation friend)</fo:block>
								</fo:table-cell>
								<fo:table-cell> </fo:table-cell>
								<fo:table-cell text-align="center">
									<fo:block font-size="8pt">(If signing on behalf or firm or company)</fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="1.0cm">Date </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'COsignature'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="5.0cm"/>
						<fo:table-column column-width="4.0cm"/>
						<fo:table-column column-width="2.03cm"/>
						<fo:table-column column-width="5.00cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
								<fo:table-cell height="0.8cm">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Creditor/Debtor</fo:block>
								</fo:table-cell>
								<fo:table-cell text-align="right">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Dated </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'COdetailssignature'">
						<fo:table-column column-width="5.0cm"/>
						<fo:table-column column-width="1.5cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Debtor/Creditor in case no. </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'signatureonly'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="8.0cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
					<xsl:when test="@signaturetype = 'warrantsignaturedate'">
						<fo:table-column column-width="2.00cm"/>
						<fo:table-column column-width="8.0cm"/>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="12pt" font-weight="bold" space-before="0.2cm">Signed </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.8cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell number-columns-spanned="2" text-align="right">
									<fo:block font-size="8pt"> Claimant (or his authorised representative)</fo:block>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell text-align="left">
									<fo:block font-size="10pt" font-weight="bold" space-before="1.0cm">Dated </fo:block>
								</fo:table-cell>
								<fo:table-cell border-width="0.02cm" border-bottom-style="solid" height="0.6cm">
									<fo:block> </fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</xsl:when>
				</xsl:choose>
			</fo:table>
		</fo:block>
	</xsl:template>
	
	<xsl:template match="supsfo:logo" name="logo">
		<fo:table table-layout="fixed">
			<fo:table-column column-width="6.5cm"/>
			<fo:table-body>
				<fo:table-row>
					<fo:table-cell padding="0.75cm">
						<fo:block>{Logo:images/HMCS_BLK.eps}</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</xsl:template>
	
	<xsl:template match="supsfo:duplicate">
		<xsl:element name="xsl:if">
			<xsl:attribute name="test">variabledata/duplicate</xsl:attribute>
			<xsl:text>Duplicate</xsl:text>
		</xsl:element>
	</xsl:template>
	<xsl:template match="supsfo:editable">
		<xsl:choose>
			<xsl:when test="name(..) = 'fo:block'">
				{Editable: [<xsl:apply-templates/>]}
			</xsl:when>
			<xsl:otherwise>
				<fo:block>{Editable: [<xsl:apply-templates/>]}</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
