<?xml version="1.0" encoding="UTF-8"?>
<!-- $Id: supsfo.xsl,v 1.67 2006/06/30 12:42:48 jay Exp $
   This Stylesheet converts a sups Notice xml (based on Notice-FO.xsd-created by the convertDsToWpData.xsl) 
	to a FO stylesheet, ready to transform data.
	Main Transformation:
	#################
	root
		variables
		header
		courtcase
			court
			courtinfo
			caseparameters
				parameter
					name
					value
		address
		bodyintroleft
		bodyintroright
		body
		footer suppress=false[|true]
			docNRef
			docCJRRef

	Other Transformation Features:
	#########################

	getFooter

	Lists: Lists can be defined as follows. type can be checkbox or bullet.

	<supsfo:list type="checkbox">
	  <supsfo:list-item><fo:block>Item 1</fo:block></supsfo:list-item>
	  <supsfo:list-item>Item 2</supsfo:list-item>
	</supsfo:list>
	
	Change History:
	21 Oct 2009, Chris Vincent - Changes to letter and welshletter so handles Welsg letter
	header functionality.  Trac 1640.	
	07 Apr 2010, Chris Vincent - Welsh changes:
	Change to margins in welshletterpage (Trac 2969)
	Removed Reference from welshpagesequence for the Welsh Translation Cover Letter (Trac 2969)
	Updated welshpagesequence template to use welshCoverLogo instead of logo (Trac 2969)
	Updated welshpagesequence template to use $vdTransWelshCourt as parameter in call to templates (Trac 2969)
	Updated welshpagesequence template to use $vdCoverLetterHeadDate (Trac 2969)
	Added template welshCoverLogo which will always display the English Court logo (Trac 2969)
	Updated layout of letterpagesequence to cater for Court addresses with Welsh characters (Trac 2662)
	Added template addressImage to display the Welsh Court address image (Trac 2662)
	Ensured that type variable (param) was present for all templates that called the Welsh Translation Cover
	Letter so code could determine if addressee was an employer (Trac 2969)
	18 Aug 2010 Mark Groen TRAC 1936
	Added the debtSequence variable to the display-creditor-name-and-reference-template template.
	10 Jan 2011, Chris Vincent. Trac 4134. Changed HER MAJESTY'S COURTS SERVICE to HM COURTS & TRIBUNALS SERVICE 
	and the Welsh equivalent GWASANAETH LLYSOEDD EI MAWRHYDI to GWASANAETH LLYSOEDD A THRIBIWNLYSOEDD EM.
	12 Dec 2011, Chris Vincent.  Added new Portait layout for the CFO outputs.  See Trac 4621.
	27 Jan 2012, Chris Vincent.  Add defendant parameter to noticepagesequence for Trac 4589.
	30 Aug 2012, Chris Vincent.  Updated footerFO template so that opening hours come from the database instead
	of being hard coded.  Trac 4714
	07 Sep 2012, Chris Vincent.  Minor change to wording in footerFO to cater for further opening hours changes.
	Trac 4718.
    08 Nov 2016, Paul Ridout.  Changes for RenderX replacement (Trac 6110)
	
	  ======================================================================= -->

<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:supsfo="http://eds.com/supsfo" 
	xmlns:xalan="http://xml.apache.org/xalan"
	exclude-result-prefixes="ora w v w10 sl aml wx o dt st1 xalan"
	>

	<xsl:import href="@word.processing.url.xsl@TopLevel.xsl"/>
	
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	
	<xsl:param name="xslHome"/>
	
	<xsl:variable name="outputsXmlDoc" select="document('@word.processing.url.xml@Outputs.xml')"/>
	
	<xsl:variable name="addressee"/>
	
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="supsfo:root">
		<xsl:element name="xsl:stylesheet">
			<xsl:attribute name="version">1.0</xsl:attribute>
			<xsl:attribute name="xsl" namespace="xmlns">http://www.w3.org/1999/XSL/Transform</xsl:attribute>
			<xsl:attribute name="ora" namespace="xmlns">http://www.oracle.com/XSL/Transform/java</xsl:attribute>
			<xsl:attribute name="fo"  namespace="xmlns">http://www.w3.org/1999/XSL/Format</xsl:attribute>
			<xsl:attribute name="supsfo" namespace="xmlns">http://eds.com/supsfo</xsl:attribute>		
			<xsl:element name="xsl:import">
				<xsl:attribute name="href">@word.processing.url.xsl2@supsfo.xsl</xsl:attribute>
			</xsl:element>
			<xsl:element name="xsl:import">
				<xsl:attribute name="href">@word.processing.url.xsl2@xhtml2fo.xsl</xsl:attribute>
			</xsl:element>
			<xsl:element name="xsl:param">
				<xsl:attribute name="name">xslHome</xsl:attribute>
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
						<!-- The page layout for page 1 of the document. 'extentvar' specifies the space for the footnote -->
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
						
						<fo:simple-page-master master-name="portraitpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="0.5cm" margin-right="0.5cm">
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

						<fo:simple-page-master master-name="letterpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="0.5cm" margin-right="0.5cm">
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
						
						<!-- 
							RenderX Replacement: Moved addressheader region-name from region-body back to region-before and
							set region-body margin-top to 29cm.  This is a bit of a hack but ensures that only address box
							is displayed on addressboxpage.
						-->
						<fo:simple-page-master master-name="addressboxpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="margin-top">29cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">0cm</xsl:attribute>
							</xsl:element>											
							<xsl:element name="fo:region-before">
								<xsl:attribute name="region-name">addressheader</xsl:attribute>
								<xsl:attribute name="extent">0cm</xsl:attribute>
							</xsl:element>
							<fo:region-after extent="0cm"/>
							<fo:region-start extent="0cm"/>
							<fo:region-end extent="0cm"/>
						</fo:simple-page-master>

						<fo:simple-page-master master-name="welshletterpage" page-height="297mm" page-width="210mm" margin-top="0.7cm" margin-bottom="0cm" margin-left="1cm" margin-right="1cm">
							<xsl:element name="fo:region-body">
								<xsl:attribute name="margin-top">10cm</xsl:attribute>
								<xsl:attribute name="margin-left">0cm</xsl:attribute>
								<xsl:attribute name="margin-right">0cm</xsl:attribute>
								<xsl:attribute name="margin-bottom">1cm</xsl:attribute>
							</xsl:element>
							<xsl:element name="fo:region-before">
								<xsl:attribute name="region-name">header</xsl:attribute>
								<xsl:attribute name="extent">10cm</xsl:attribute>
							</xsl:element>
							<xsl:element name="fo:region-after">
								<xsl:attribute name="region-name">footer</xsl:attribute>
								<xsl:attribute name="extent">1cm</xsl:attribute>
							</xsl:element>
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
						
						<fo:page-sequence-master master-name="portrait">
							<fo:repeatable-page-master-reference master-reference="portraitpage"/>
						</fo:page-sequence-master>

						<fo:page-sequence-master master-name="order">
							<fo:single-page-master-reference master-reference="firstpage"/>
							<fo:single-page-master-reference master-reference="addressboxpage"/>
							<fo:repeatable-page-master-reference master-reference="otherpages"/>
						</fo:page-sequence-master>

						<fo:page-sequence-master master-name="welshletters">
							<fo:single-page-master-reference master-reference="welshletterpage"/>
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
			<xsl:apply-templates select=".//supsfo:numbered-list" mode="createnumberedlists"/>
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="createsequences">
		<xsl:param name="condition">1 = 1</xsl:param>
		<xsl:choose>
			<xsl:when test="supsfo:layout = 'letter'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">doletterpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="letterpagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'order'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">doorderpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="orderpagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'landscape'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">dolandscapepagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="landscapepagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'portrait'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">doportraitpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="portraitpagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'warrant'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">dowarrantpagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="warrantpagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:when test="supsfo:layout = 'titleonly'">
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">dotitleonlypagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="titleonlypagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="xsl:template">
					<xsl:attribute name="name">donoticepagesequence<xsl:if test="string-length(@name) > 0">-<xsl:value-of select="@name"/></xsl:if></xsl:attribute>
					<xsl:call-template name="noticepagesequence">
						<xsl:with-param name="condition"><xsl:value-of select="$condition"/></xsl:with-param>
					</xsl:call-template>
				</xsl:element>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="noticepagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">type</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">isaoeoinforce</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">istelephonenumber</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">isnoticeofeviction</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">defendant</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">$isaoeoinforce != 'true'</xsl:attribute>
			<xsl:call-template name="welshpagesequence">
				<xsl:with-param name="type">$type</xsl:with-param>
			</xsl:call-template>	
			<xsl:element name="fo:page-sequence">
				<xsl:attribute name="master-reference">document</xsl:attribute>
				<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:attribute name="force-page-count"><xsl:choose><xsl:when test="./supsfo:duplex">end-on-even</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
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
													<fo:table-cell height="3.2cm">
														<xsl:apply-templates select="supsfo:header"/>
													</fo:table-cell>
												</fo:table-row>
												<fo:table-row>
													<fo:table-cell text-align="left">
														<fo:block height="3.2cm" space-before="0.5cm">
															<fo:table table-layout="fixed">
																<fo:table-column column-width="0.5cm"/>
																<fo:table-column column-width="9.3cm"/>
																<fo:table-body>
																	<fo:table-row>
																		<fo:table-cell height="3.4cm"/>
																		<xsl:choose>
																			<xsl:when test="supsfo:suppressaddress">
																			</xsl:when>
																			<xsl:otherwise>
																				<fo:table-cell height="3.4cm" font-size="10pt" border-style="solid" border-width="0.02cm" padding="0.3cm" overflow="hidden">
																				<xsl:element name="xsl:if">
																					<xsl:attribute name="test">$type = 'true'</xsl:attribute>
																				<xsl:element name="fo:block">STAFF IN CONFIDENCE</xsl:element>
																				</xsl:element>

																					<xsl:element name="xsl:call-template">
																						<xsl:attribute name="name">format-address-multi-line</xsl:attribute>
																						<xsl:element name="xsl:with-param">
																							<xsl:attribute name="name">party</xsl:attribute>
																							<xsl:element name="xsl:copy-of">
																								<xsl:attribute name="select">$addressee</xsl:attribute>
																							</xsl:element>
																						</xsl:element>
																						<xsl:element name="xsl:with-param">
																							<xsl:attribute name="name">isNoticeOfEviction</xsl:attribute>
																							<xsl:element name="xsl:copy-of">
																								<xsl:attribute name="select">$isnoticeofeviction</xsl:attribute>
																							</xsl:element>
																						</xsl:element>																						
																					</xsl:element>
																					
                                                                                    <xsl:element name="xsl:if">
																					<xsl:attribute name="test">$istelephonenumber='true'</xsl:attribute>
																				<xsl:element name="fo:block">Phone Number: <xsl:element name="xsl:value-of"><xsl:attribute name="select">$vdApplicantTelephone</xsl:attribute></xsl:element></xsl:element>
																				</xsl:element>																			
																				</fo:table-cell>
																			</xsl:otherwise>
																		</xsl:choose>
																	</fo:table-row>
																</fo:table-body>
															</fo:table>
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
									<fo:table-cell font-family="Times" font-size="10pt" padding-top="1.0cm">
										<xsl:apply-templates select="supsfo:body"/>
									</fo:table-cell>
								</fo:table-row>
							</fo:table-body>
						</fo:table>
					</fo:block>
				</fo:flow>
			</xsl:element>
			</xsl:element>
			
		
		</xsl:element>
	</xsl:template>
	<xsl:template name="warrantpagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">type</xsl:attribute>
			<xsl:attribute name="select">false()</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:call-template name="welshpagesequence"/>
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
									<fo:table-cell font-family="Times" font-size="10pt" padding-top="1.0cm">
										<xsl:apply-templates select="supsfo:body"/>
									</fo:table-cell>
								</fo:table-row>
							</fo:table-body>
						</fo:table>
					</fo:block>
				</fo:flow>
			</xsl:element>
		</xsl:element>
	</xsl:template>
	<xsl:template name="letterpagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">type</xsl:attribute>
		</xsl:element>				
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:call-template name="welshpagesequence">
				<xsl:with-param name="type">$type</xsl:with-param>
			</xsl:call-template>
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
				<fo:flow flow-name="xsl-region-body" font-family="Arial" font-size="12pt">
					<!-- ************* -->
					<!-- PAGE ONE -->
					<!-- ************* -->
					<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
					<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
					<fo:table table-layout="fixed" font-size="10pt">
						<fo:table-column column-width="13cm"></fo:table-column>
						<fo:table-column column-width="7cm"></fo:table-column>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell>
									<xsl:call-template name="logo"/>
								</fo:table-cell>
								<fo:table-cell number-rows-spanned="2">
									<fo:block font-weight="bold">HM Courts &amp; Tribunals Service</fo:block>
									
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name">format-address-letter-address-only</xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">party</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">$vdCourtDetails</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
									
									<xsl:element name="xsl:if">
  										<xsl:attribute name="test">$vdWelshCourt = 'Y'</xsl:attribute>
    									<xsl:element name="fo:block">
											<xsl:attribute name="space-before">0.3cm</xsl:attribute>
											<xsl:attribute name="font-weight">bold</xsl:attribute>
											Gwasanaeth Llysoedd A
										</xsl:element>
    									<xsl:element name="fo:block">
											<xsl:attribute name="font-weight">bold</xsl:attribute>
											Thribiwnlysoedd EM
										</xsl:element>
										
										<xsl:element name="xsl:choose">
											<xsl:element name="xsl:when">
												<xsl:attribute name="test">$vdLetterCourtCode = '280' or $vdLetterCourtCode = '344'</xsl:attribute>
												<xsl:element name="fo:block">
													<xsl:call-template name="addressImage"/>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:otherwise">
												<xsl:element name="xsl:call-template">
													<xsl:attribute name="name">format-address-letter-welsh-address</xsl:attribute>
													<xsl:element name="xsl:with-param">
														<xsl:attribute name="name">party</xsl:attribute>
														<xsl:element name="xsl:copy-of">
															<xsl:attribute name="select">$vdCourtDetails</xsl:attribute>
														</xsl:element>
													</xsl:element>
												</xsl:element>	
											</xsl:element>
										</xsl:element>
									</xsl:element>

									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name">format-address-letter-other-details</xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">party</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">$vdCourtDetails</xsl:attribute>
											</xsl:element>
										</xsl:element>
                                        <xsl:element name="xsl:with-param">
                                            <xsl:attribute name="name">welshAddress</xsl:attribute>
                                            <xsl:element name="xsl:copy-of">
                                                <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                            </xsl:element>
                                        </xsl:element>
									</xsl:element>									
									
									<fo:block font-weight="bold" space-before="0.5cm">www.gov.uk</fo:block>
					
									<xsl:if test="supsfo:layout/@yourRef = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdSubjectReference</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefAx = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdPartyForOrSolicitorReference</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefAe = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdAEReference</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>	
									<xsl:if test="supsfo:layout/@yourRefCo = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdCOReference</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>																										
									<xsl:if test="supsfo:layout/@yourRefInst = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdInstigatorReference</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>											
									<xsl:if test="supsfo:layout/@yourRefaejudgmentcreditor = 'true'">
										<fo:block space-before="0.5cm">
                                            <xsl:element name="xsl:call-template">
                                                <xsl:attribute name="name">letterReferenceText</xsl:attribute>
                                                <xsl:element name="xsl:with-param">
                                                    <xsl:attribute name="name">welshAddress</xsl:attribute>
                                                    <xsl:element name="xsl:copy-of">
                                                        <xsl:attribute name="select">$vdWelshCourt</xsl:attribute>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:element>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdAEJudgmentCreditorRef</xsl:attribute>
											</xsl:element>
										</fo:block>
									</xsl:if>																			
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell padding-left="2.00cm" padding-right="1.30cm" padding-top="2.00cm" text-align="left">
									<xsl:element name="xsl:if">
  										<xsl:attribute name="test">$type = 'true'</xsl:attribute>
    									<xsl:element name="fo:block">STAFF IN CONFIDENCE</xsl:element>
									</xsl:element>									
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name">format-address-multi-line</xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">party</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">$addressee</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</fo:table-cell>
							</fo:table-row>
							<fo:table-row>
								<fo:table-cell padding-top="0.8cm"><fo:block></fo:block>
								</fo:table-cell>
								<fo:table-cell padding-top="0.8cm">
									<fo:block space-after="1.0cm">
										<xsl:element name="xsl:value-of"><xsl:attribute name="select">$vdLetterHeadDate</xsl:attribute></xsl:element>
									</fo:block>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
					<fo:table table-layout="fixed">
						<fo:table-column column-width="19cm"></fo:table-column>
						<fo:table-body>
							<fo:table-row>
								<fo:table-cell padding-left="0.50cm">
									<xsl:apply-templates select="supsfo:body"/>
								</fo:table-cell>
							</fo:table-row>
						</fo:table-body>
					</fo:table>
				</fo:flow>
			</xsl:element>
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="landscapepagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
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
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="portraitpagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:element name="fo:page-sequence">
				<xsl:attribute name="master-reference">portrait</xsl:attribute>
				<!-- ************ -->
				<!-- MAIN DOC-->
				<!-- ************ -->
				<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
					<fo:block font-family="Times" font-size="10pt">
						<xsl:apply-templates select="supsfo:body"/>
					</fo:block>
				</fo:flow>
			</xsl:element>
		</xsl:element>
	</xsl:template>

	<xsl:template name="orderpagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
        <xsl:element name="xsl:param">
            <xsl:attribute name="name">prefixaddressee</xsl:attribute>
        </xsl:element>
        <xsl:element name="xsl:param">
            <xsl:attribute name="name">suffixaddressee</xsl:attribute>
        </xsl:element>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">type</xsl:attribute>
			<xsl:attribute name="select">false()</xsl:attribute>
		</xsl:element>	
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:call-template name="welshpagesequence"/>
			<xsl:element name="fo:page-sequence">
				<xsl:attribute name="master-reference">order</xsl:attribute>
				<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:attribute name="force-page-count"><xsl:choose><xsl:when test="./supsfo:duplex">end-on-even</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
	
				<fo:static-content flow-name="addressheader">
					<fo:block>
						<fo:table table-layout="fixed">
							<fo:table-column column-width="0.5cm"/>
							<fo:table-column column-width="9.3cm"/>
							<fo:table-body>
								<!-- RenderX Replacement: Added empty table-cells to first table-row as cannot be empty -->
								<fo:table-row height="3.3cm">
									<fo:table-cell/>
									<fo:table-cell/>
								</fo:table-row>
								
								<fo:table-row>
									<fo:table-cell/>
									<fo:table-cell height="3.4cm" font-size="10pt" margin-top="4cm" border-style="solid" border-width="0.02cm" padding="0.3cm" text-align="left" overflow="hidden">
                                            <fo:block text-align="left">
                                                <xsl:element name="xsl:value-of">
                                                    <xsl:attribute name="select">$prefixaddressee</xsl:attribute>
                                                </xsl:element>                                    
                                            </fo:block>
                                    		<xsl:element name="xsl:call-template">
												<xsl:attribute name="name">format-address-multi-line</xsl:attribute>
												<xsl:element name="xsl:with-param">
													<xsl:attribute name="name">party</xsl:attribute>
													<xsl:element name="xsl:copy-of">
														<xsl:attribute name="select">$addressee</xsl:attribute>
													</xsl:element>
												</xsl:element>
											</xsl:element>
                                    <fo:block>
                                        <xsl:element name="xsl:value-of">
                                            <xsl:attribute name="select">$suffixaddressee</xsl:attribute>
                                        </xsl:element>                                    
                                    </fo:block>
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
								<fo:table-row>
									<fo:table-cell>
									</fo:table-cell>
									<fo:table-cell>
										<fo:block/>
									</fo:table-cell>
									<fo:table-cell>
										<xsl:apply-templates select="supsfo:bodyintroright"/>
									</fo:table-cell>
								</fo:table-row>
							</fo:table-body>
						</fo:table>
				<xsl:element name="xsl:if">
					<xsl:attribute name="test">string-length(/variabledata/claim/claimant) > 0</xsl:attribute>
						<fo:block space-after="0.5cm"/>
						<fo:table table-layout="fixed">
							<fo:table-column column-width="14.55cm"/>
							<fo:table-column column-width="4.73cm"/>
							<fo:table-body>
							<xsl:choose>
								<xsl:when test="supsfo:layout/@type= 'event'">
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/event/subjects/subject</xsl:attribute>
									<fo:table-row keep-together="always">
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold">
											
												<xsl:element name="xsl:call-template">
													<xsl:attribute name="name">numberpostfix</xsl:attribute>
														<xsl:element name="xsl:with-param">
															<xsl:attribute name="name">number</xsl:attribute>
														<xsl:element name="xsl:value-of">
															<xsl:attribute name="select">number</xsl:attribute>
														</xsl:element>
													</xsl:element>
												</xsl:element>
												
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">partyrole</xsl:attribute>
												</xsl:element>												
												</fo:block>
	
												<fo:block>
													<fo:inline font-weight="bold">Ref </fo:inline>
														<xsl:element name="xsl:value-of">
															<xsl:attribute name="select">reference</xsl:attribute>
														</xsl:element>
												</fo:block>

										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/event/instigators/instigator</xsl:attribute>
									<fo:table-row keep-together="always">
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold">
											
												<xsl:element name="xsl:call-template">
													<xsl:attribute name="name">numberpostfix</xsl:attribute>
														<xsl:element name="xsl:with-param">
															<xsl:attribute name="name">number</xsl:attribute>
														<xsl:element name="xsl:value-of">
															<xsl:attribute name="select">number</xsl:attribute>
														</xsl:element>
													</xsl:element>
												</xsl:element>
												
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">partyrole</xsl:attribute>
												</xsl:element>												
												</fo:block>
	
												<fo:block>
													<fo:inline font-weight="bold">Ref </fo:inline>
														<xsl:element name="xsl:value-of">
															<xsl:attribute name="select">reference</xsl:attribute>
														</xsl:element>
												</fo:block>

										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								</xsl:when>
								<xsl:when test="supsfo:layout/@famenf= 'true'">
									<xsl:element name="xsl:for-each">
										<xsl:attribute name="select">/variabledata/claim/claimant</xsl:attribute>
										<fo:table-row keep-together="always">
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
												<fo:block space-before="0.5em">
													<xsl:element name="xsl:value-of">
														<xsl:attribute name="select">name</xsl:attribute>
													</xsl:element>
												</fo:block>
											</fo:table-cell>
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
												<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element><xsl:element name="xsl:call-template"><xsl:attribute name="name">variableRoleCredDebt</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">role</xsl:attribute>claimant</xsl:element></xsl:element></fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referenceclm</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">clmref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclm</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclmrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclmsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>
												<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referenceclm)</xsl:attribute></xsl:element></fo:block>
											</fo:table-cell>
										</fo:table-row>
									</xsl:element>
									<xsl:element name="xsl:for-each">
										<xsl:attribute name="select">/variabledata/claim/defendant</xsl:attribute>
										<fo:table-row keep-together="always">
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
												<fo:block space-before="0.5em">
													<xsl:element name="xsl:value-of">
														<xsl:attribute name="select">name</xsl:attribute>
													</xsl:element>
												</fo:block>
											</fo:table-cell>
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
												<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element><xsl:element name="xsl:call-template"><xsl:attribute name="name">variableRoleCredDebt</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">role</xsl:attribute>defendant</xsl:element></xsl:element></fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencedef</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">defref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdef</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdefrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdefsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>												
												<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencedef)</xsl:attribute></xsl:element></fo:block>
											</fo:table-cell>
										</fo:table-row>
									</xsl:element>
									<xsl:element name="xsl:for-each">
										<xsl:attribute name="select">/variabledata/claim/part20claimant</xsl:attribute>
										<fo:table-row>
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
												<fo:block space-before="0.5em">
													<xsl:element name="xsl:value-of">
														<xsl:attribute name="select">name</xsl:attribute>
													</xsl:element>
												</fo:block>
											</fo:table-cell>
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
												<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Part 20 Claimant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencepartclm</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">partclmref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclm</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclmrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclmsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>
												<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencepartclm)</xsl:attribute></xsl:element></fo:block>
											</fo:table-cell>
										</fo:table-row>
									</xsl:element>
									<xsl:element name="xsl:for-each">
										<xsl:attribute name="select">/variabledata/claim/part20defendant</xsl:attribute>
										<fo:table-row keep-together="always">
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
												<fo:block space-before="0.5em">
													<xsl:element name="xsl:value-of">
														<xsl:attribute name="select">name</xsl:attribute>
													</xsl:element>
												</fo:block>
											</fo:table-cell>
											<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
												<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Part 20 Defendant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencepartdef</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">partdefref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdef</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdefrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdefsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>												
												<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencepartdef)</xsl:attribute></xsl:element></fo:block>
											</fo:table-cell>
										</fo:table-row>
									</xsl:element>
								</xsl:when>
								<xsl:otherwise>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/claim/claimant</xsl:attribute>
									<fo:table-row keep-together="always">
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Claimant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referenceclm</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">clmref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclm</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclmrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterclmsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>
											<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referenceclm)</xsl:attribute></xsl:element></fo:block>
										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/claim/defendant</xsl:attribute>
									<fo:table-row keep-together="always">
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Defendant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencedef</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">defref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdef</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdefrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterdefsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>												
											<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencedef)</xsl:attribute></xsl:element></fo:block>
										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/claim/part20claimant</xsl:attribute>
									<fo:table-row>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Part 20 Claimant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencepartclm</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">partclmref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclm</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclmrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartclmsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>
											<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencepartclm)</xsl:attribute></xsl:element></fo:block>
										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/variabledata/claim/part20defendant</xsl:attribute>
									<fo:table-row keep-together="always">
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="center">
											<fo:block space-before="0.5em">
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">name</xsl:attribute>
												</xsl:element>
											</fo:block>
										</fo:table-cell>
										<fo:table-cell border-style="solid" border-width="0.02cm" text-align="left">
											<fo:block font-weight="bold"><xsl:element name="xsl:call-template"><xsl:attribute name="name">numberpostfix</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">number</xsl:attribute></xsl:element></xsl:element></xsl:element>Part 20 Defendant</fo:block><xsl:element name="xsl:variable"><xsl:attribute name="name">referencepartdef</xsl:attribute><xsl:element name="xsl:call-template"><xsl:attribute name="name">partdefref</xsl:attribute><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdef</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">reference</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdefrep</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">representativeid</xsl:attribute></xsl:element></xsl:element><xsl:element name="xsl:with-param"><xsl:attribute name="name">parameterpartdefsol</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">solicitorreference</xsl:attribute></xsl:element></xsl:element></xsl:element></xsl:element>												
											<fo:block><fo:inline font-weight="bold">Ref </fo:inline><xsl:element name="xsl:value-of"><xsl:attribute name="select">normalize-space($referencepartdef)</xsl:attribute></xsl:element></fo:block>
										</fo:table-cell>
									</fo:table-row>
								</xsl:element>
								</xsl:otherwise>
								</xsl:choose>
							</fo:table-body>
						</fo:table>
				</xsl:element>						
						<fo:block space-after="0.5cm"/>
						<xsl:apply-templates select="supsfo:body"/>
					</fo:block>
				</fo:flow>
			</xsl:element>
		</xsl:element>
	</xsl:template>

	<xsl:template name="titleonlypagesequence">
		<xsl:param name="condition"/>
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">mode</xsl:attribute>
		</xsl:element>		
		<xsl:element name="xsl:param">
			<xsl:attribute name="name">addressee</xsl:attribute>
		</xsl:element>
		<xsl:element name="xsl:if">
			<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>
			<xsl:element name="fo:page-sequence">
				<xsl:attribute name="master-reference">document</xsl:attribute>
				<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:attribute name="force-page-count"><xsl:choose><xsl:when test="./supsfo:duplex">end-on-even</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
	
				<xsl:apply-templates select="supsfo:footer"/>
				<xsl:apply-templates select="supsfo:defaultFooter"/>
				<!-- ************ -->
				<!-- MAIN DOC-->
				<!-- ************ -->
				<fo:flow flow-name="xsl-region-body" font-family="Times" font-size="12pt">
					<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
					<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
					<fo:block><xsl:apply-templates select="supsfo:header"/></fo:block>
					<fo:block space-after="1cm"/>
					<fo:block><xsl:apply-templates select="supsfo:body"/></fo:block>
				</fo:flow>
			</xsl:element>
		</xsl:element>
	</xsl:template>

	<!--
		RenderX Replacement: New template with logic from EnterVariableText welshtranslation template.
		Returns 'Y' if Welsh translation is required for the specified addressee.
	-->
	<xsl:template name="addresseeRequiresWelshTranslation">
		<xsl:param name="addressee"/>
		
		<xsl:choose>
			<xsl:when 
				test="xalan:nodeset($addressee)/type = 'representative'">
				<xsl:variable name="tempSurrogateId">
					<xsl:value-of 
						select="xalan:nodeset($addressee)/surrogateid"/>
				</xsl:variable>
				<!-- there can be more than one party the solicitor is representing -->
				<xsl:variable name="tempWelsh">
					<xsl:for-each 
						select="//claim//*[representativeid = $tempSurrogateId]/welsh">
						<xsl:if test=" . = 'Y'">Y</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:value-of select="substring($tempWelsh,0,2)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="xalan:nodeset($addressee)/welsh"/>
			</xsl:otherwise>
		</xsl:choose>
		
	</xsl:template>
	
	<xsl:template name="welshpagesequence">
		<xsl:param name="type" select="false()"/>
		
		<!--
			RenderX Replacement: Determine whether current addressee requires translation to welsh letter.
			If Welsh translation required then include welshletters definition in page-sequence set.  This
			prevents "blank" Welsh letter from being displayed if translation is not required.
		-->
		<xsl:element name="xsl:variable">
			<xsl:attribute name="name">welshTransReq</xsl:attribute>
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name">addresseeRequiresWelshTranslation</xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">$addressee</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:element>
		
		<xsl:element name="xsl:if">
			<xsl:attribute name="test">$welshTransReq = 'Y'</xsl:attribute>
			
			<xsl:element name="fo:page-sequence">
				<xsl:attribute name="master-reference">welshletters</xsl:attribute>
				<xsl:attribute name="initial-page-number"><xsl:choose><xsl:when test="./supsfo:duplex">auto-odd</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:attribute name="force-page-count"><xsl:choose><xsl:when test="./supsfo:duplex">end-on-even</xsl:when><xsl:otherwise>auto</xsl:otherwise></xsl:choose></xsl:attribute>
				<!-- ************ -->
				<!-- MAIN DOC-->
				<!-- ************ -->
						
				<fo:static-content flow-name="header">
					<fo:block>
						<fo:block-container position="fixed" top="9.3cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
						<fo:block-container position="fixed" top="19.9cm" left="0.2cm" right="0cm" bottom="0cm"><fo:block font-size="16pt">-</fo:block></fo:block-container>
						
						<fo:table table-layout="fixed" font-size="10pt">
							<fo:table-column column-width="13cm"></fo:table-column>
							<fo:table-column column-width="7cm"></fo:table-column>
							<fo:table-body>
								<fo:table-row>
									<fo:table-cell>
										<xsl:call-template name="welshCoverLogo"/>
									</fo:table-cell>
									<fo:table-cell number-rows-spanned="3">
										
										<fo:block font-weight="bold">HM Courts &amp; Tribunals Service</fo:block>
										<xsl:element name="xsl:call-template">
											<xsl:attribute name="name">format-address-letter-address-only</xsl:attribute>
											<xsl:element name="xsl:with-param">
												<xsl:attribute name="name">party</xsl:attribute>
												<xsl:element name="xsl:copy-of">
													<xsl:attribute name="select">$vdCourtDetails</xsl:attribute>
												</xsl:element>
											</xsl:element>
										</xsl:element>
										
										<xsl:element name="xsl:call-template">
											<xsl:attribute name="name">format-address-letter-other-details</xsl:attribute>
											<xsl:element name="xsl:with-param">
												<xsl:attribute name="name">party</xsl:attribute>
												<xsl:element name="xsl:copy-of">
													<xsl:attribute name="select">$vdCourtDetails</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:with-param">
												<xsl:attribute name="name">welshAddress</xsl:attribute>
												<xsl:element name="xsl:copy-of">
													<xsl:attribute name="select">$vdTransWelshCourt</xsl:attribute>
												</xsl:element>
											</xsl:element>
										</xsl:element>
										
										<fo:block font-weight="bold" space-before="0.5cm">www.gov.uk</fo:block>

									</fo:table-cell>
								</fo:table-row>
								<fo:table-row>
									<fo:table-cell padding-left="1.50cm" padding-top="2.50cm">
										<fo:block>Welsh Language Unit</fo:block>
										<fo:block>Caernarfon Criminal Justice Centre</fo:block>
										<fo:block>Llanberis Road</fo:block>
										<fo:block>Caernarfon</fo:block>
										<fo:block>Gwynedd</fo:block>
										<fo:block>LL55 2DF</fo:block>							
									</fo:table-cell>
								</fo:table-row>
								<fo:table-row>
									<fo:table-cell padding-left="1.50cm" padding-top="1.30cm">
										<fo:block space-before="1cm">
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">$vdCoverLetterHeadDate</xsl:attribute>
											</xsl:element>
										</fo:block>
									</fo:table-cell>
								</fo:table-row>
							</fo:table-body>
						</fo:table>			
					</fo:block>
				</fo:static-content>
				
				<!-- begin computation for addressee -->
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name">welshtranslation</xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">$addressee</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">type</xsl:attribute>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">$type</xsl:attribute>
							</xsl:element>
						</xsl:element>
				</xsl:element>
				<!-- end computation for addressee -->		
			</xsl:element>
			
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="supsfo:section" mode="address">
		<xsl:choose>
			<xsl:when test="supsfo:addressee/@copies">
				<xsl:call-template name="multiplesectioncopies">
					<xsl:with-param name="copies"><xsl:value-of select="supsfo:addressee/@copies"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="multiplesectioncopies">
					<xsl:with-param name="copies">1</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="multiplesectioncopies">
		<xsl:param name="copies"/>
		<xsl:call-template name="call-multiaddress">
			<xsl:with-param name="section"><xsl:value-of select="@name"/></xsl:with-param>
		</xsl:call-template>
		<xsl:if test="$copies > 1">
			<xsl:call-template name="multiplesectioncopies">
				<xsl:with-param name="copies"><xsl:value-of select="$copies - 1"/></xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="supsfo:section" mode="createsequences">
		<xsl:choose>
			<xsl:when test="@condition">
				<xsl:call-template name="createsequences">
					<xsl:with-param name="condition"><xsl:value-of select="@condition"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="createsequences"/>
			</xsl:otherwise>
		</xsl:choose>
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
					<xsl:when test="supsfo:layout = 'titleonly'">dotitleonlypagesequence</xsl:when>
					<xsl:when test="supsfo:layout = 'portrait'">doportraitpagesequence</xsl:when>
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

	<xsl:template match="supsfo:loweraddress">

		<fo:block-container position="absolute" top="23.5cm" left="0.5cm" right="10.1cm" bottom="28.4cm">
			<fo:block font-size="10pt">
				<fo:table table-layout="fixed">
					<fo:table-column column-width="10cm"></fo:table-column>
					<fo:table-body>
						<fo:table-row keep-with-next="always">
							<fo:table-cell>
								<fo:block text-align="center">
									<fo:inline font-weight="bold">Address for Payment</fo:inline>
								</fo:block>
							</fo:table-cell>
						</fo:table-row>
						<fo:table-row keep-with-next="always">
							<fo:table-cell border-top-style="solid" border-top-width="0.02cm"  border-left-style="solid" border-left-width="0.02cm"
								border-right-style="solid" border-right-width="0.02cm" border-bottom-style="solid" border-bottom-width="0.02cm" height="4.7cm">
								<xsl:apply-templates/>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>	
			</fo:block>
		</fo:block-container>
	</xsl:template>


	<xsl:template match="supsfo:courtcase">


		<fo:table table-layout="fixed" space-after="0.2cm">
			<fo:table-column column-width="3.39cm"/>
			<fo:table-column column-width="4.73cm"/>
			<fo:table-body>
				<xsl:for-each select="supsfo:court">
					<fo:table-row>
						<fo:table-cell number-columns-spanned="2" border-width="0.01in" border-style="solid" padding="0.2cm">
							<xsl:copy-of select="*"/>
						</fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
				<xsl:if test="count(supsfo:courtinfo) > 0">
					<fo:table-row>
						<fo:table-cell number-columns-spanned="2" border-width="0.01in" border-style="solid" padding="0.1cm">
							<xsl:for-each select="supsfo:courtinfo">
								<xsl:copy-of select="*"/>
							</xsl:for-each>
						</fo:table-cell>
					</fo:table-row>
				</xsl:if>

				<xsl:for-each select="supsfo:caseparameters/supsfo:parameter">
					<xsl:element name="xsl:if">
						<xsl:attribute name="test"><xsl:choose><xsl:when test="@condition"><xsl:value-of select="@condition"/></xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
						<fo:table-row>
							<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
								<xsl:for-each select="supsfo:name">
									<xsl:copy-of select="*"/>
								</xsl:for-each>
							</fo:table-cell>
							<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
								<xsl:for-each select="supsfo:value">
									<xsl:copy-of select="*"/>
								</xsl:for-each>
							</fo:table-cell>
						</fo:table-row>
					</xsl:element>
				</xsl:for-each>
				<!-- Block Starts for Showing Date of Birth id caseparameter/dobparameter is defined in *-FO.xml -->
				<fo:table-row>
					<!--
						RenderX Replacement: Replaced if element with choose element 
						to ensure that table-row always contains table-cells
					-->
					<xsl:choose>
						<xsl:when test="count(supsfo:caseparameters/supsfo:dobparameter) > 0">
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
						</xsl:when>
						<xsl:otherwise>
							<fo:table-cell/>
							<fo:table-cell/>
						</xsl:otherwise>
					</xsl:choose>
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
				<xsl:choose>
					<xsl:when test="@suppressborder='true'">
						<fo:block height="3.9cm" font-size="10pt" margin="0.2cm">																
							<xsl:apply-templates/>
						</fo:block>
					</xsl:when>
					<xsl:otherwise>
						<fo:block height="3.9cm" font-size="10pt" border-width="0.02cm" border-style="solid" overflow="hidden">
							<fo:block margin="0.2cm">
								<xsl:apply-templates/>
							</fo:block>
						</fo:block>
					</xsl:otherwise>
				</xsl:choose>
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
		<xsl:if test="supsfo:list-item">
			<fo:list-block provisional-distance-between-starts="1.0cm" provisional-label-separation="1.0cm">
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="@name"/>1</xsl:attribute>
				</xsl:element>
			</fo:list-block>
		</xsl:if>
	</xsl:template>

	<xsl:template match="supsfo:numbered-list" mode="createnumberedlists">
		<xsl:apply-templates select="supsfo:list-item" mode="createnumberedlists"/>
	</xsl:template>
	
	<xsl:template match="supsfo:list-item" mode="createnumberedlists">
		<xsl:call-template name="create-numbered-list"/>
	</xsl:template>
	
	<xsl:template name="create-numbered-list">
		<xsl:element name="xsl:template">
			<xsl:attribute name="name"><xsl:value-of select="../@name"/><xsl:value-of select="position()"/></xsl:attribute>
			<xsl:element name="xsl:param"><xsl:attribute name="name">number</xsl:attribute>1</xsl:element>
			<xsl:choose>
				<xsl:when test="@condition">
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test"><xsl:value-of select="@condition"/></xsl:attribute>
							<fo:list-item>
								<fo:list-item-label  start-indent="0.05cm" end-indent="label-end()">
									<fo:block><xsl:element name="xsl:value-of"><xsl:attribute name="select">$number</xsl:attribute></xsl:element>. </fo:block>
								</fo:list-item-label>
								<fo:list-item-body start-indent="body-start()">
									<xsl:copy-of select="./*"/>
								</fo:list-item-body>
							</fo:list-item>
							<xsl:if test="last() > position()">
								<xsl:element name="xsl:call-template">
									<xsl:attribute name="name"><xsl:value-of select="../@name"/><xsl:value-of select="position() + 1"/></xsl:attribute>
									<xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">$number + 1</xsl:attribute></xsl:element></xsl:element>
								</xsl:element>
							</xsl:if>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<xsl:if test="last() > position()">
								<xsl:element name="xsl:call-template">
									<xsl:attribute name="name"><xsl:value-of select="../@name"/><xsl:value-of select="position() + 1"/></xsl:attribute>
									<xsl:element name="xsl:with-param">
										<xsl:attribute name="name">number</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">$number</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:if>
						</xsl:element>
					</xsl:element>
				</xsl:when>
				<xsl:otherwise>
					<fo:list-item>
						<fo:list-item-label  start-indent="0.05cm" end-indent="label-end()">
							<fo:block><xsl:element name="xsl:value-of"><xsl:attribute name="select">$number</xsl:attribute></xsl:element>. </fo:block>
						</fo:list-item-label>
						<fo:list-item-body start-indent="body-start()">
							<xsl:copy-of select="./*"/>
						</fo:list-item-body>
					</fo:list-item>
					<xsl:if test="last() > position()">
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="../@name"/><xsl:value-of select="position() + 1"/></xsl:attribute>
							<xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">$number + 1</xsl:attribute></xsl:element></xsl:element>
						</xsl:element>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
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
						<xsl:with-param name="referenceF">
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$OutputId]/FReference"/>
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
				<!-- RenderX Replacement: Removed basicfooter static-content as it is no longer used and presence causes a rendering error -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getDefaultFooter" match="supsfo:footer">
		<xsl:choose>
			<xsl:when test="@suppress = 'true'">
		</xsl:when>
			<xsl:otherwise>
				<fo:static-content flow-name="footer">
					<xsl:call-template name="getDefaultFooterContent"/>
				</fo:static-content>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="supsfo:letterfooter">
		<fo:static-content flow-name="footer">
			<fo:block font-family="Times" font-size="8pt" text-align="right"><xsl:value-of select="@id"/></fo:block>
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
		
		<xsl:with-param name="referenceF">
			<xsl:choose>
				<xsl:when test="name(.) = 'getFooter'">
					<xsl:choose>
						<xsl:when test="/supsfo:root/supsfo:defaultFooter" >
							<xsl:variable name="tmpId"><xsl:value-of select="/supsfo:root/supsfo:defaultFooter/@id"/></xsl:variable>
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/FReference"/>
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
							<xsl:value-of select="$outputsXmlDoc/Outputs/Output[Id=$tmpId]/FReference"/>
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
		<xsl:param name="referenceF"/>
		<xsl:param name="type"/>

		<fo:block font-family="Times" font-size="8pt" text-align="justify" border-top-width="0.02in" border-top-style="solid">
			<fo:block space-before="4pt">
				<xsl:choose>
					<xsl:when test="$type = 'bailiff'">
					The bailiff, <xsl:element name="xsl:value-of"><xsl:attribute name="select">$vdBailiffName</xsl:attribute></xsl:element>, can be contacted on telephone <xsl:element name="xsl:value-of"><xsl:attribute name="select">$vdBailiffTelephone</xsl:attribute></xsl:element>.
					</xsl:when>
				</xsl:choose>
				<xsl:text>The court office at </xsl:text>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">$vdFooterCourtNameDescription</xsl:attribute>
				</xsl:element>,<xsl:text> </xsl:text>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name">format-address-single-line</xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">theAddress</xsl:attribute>
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">$vdCourtUserAddress</xsl:attribute>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:text>. </xsl:text>
	
				<xsl:choose>
					<xsl:when test="string-length($type) = 0 or $type != 'bailiff'">				
						<xsl:text> When corresponding with the court, please address forms or letters to the </xsl:text>
						<xsl:text>Court Manager</xsl:text>
						<xsl:text> and quote the</xsl:text>
						<xsl:choose>
							<xsl:when test="@CO='true'"><xsl:text> AO/CAEO number. </xsl:text></xsl:when>
							<xsl:otherwise><xsl:text> claim number. </xsl:text></xsl:otherwise>
						</xsl:choose>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">$vdFooterCourtTelephoneFax</xsl:attribute>
						</xsl:element>
					</xsl:when>
					<xsl:when test="$type = 'bailiff'">
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">$vdFooterCourtTelephoneFax</xsl:attribute>
						</xsl:element>
					</xsl:when>
				</xsl:choose>
				
				<fo:inline font-weight="bold">
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">$vdFooterStrapline</xsl:attribute>
				</xsl:element>
				</fo:inline>
			</fo:block>
			<fo:block text-align="right">
				<xsl:text>Produced by:</xsl:text>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">$vdProducedBy</xsl:attribute>
				</xsl:element>
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
										<xsl:element name="xsl:choose">
											<xsl:element name="xsl:when">
												<xsl:attribute name="test">$vdDistrictRegistry = 'F'</xsl:attribute>
												<xsl:value-of select="$referenceF"/>
											</xsl:element>
											<xsl:element name="xsl:otherwise">
												<xsl:value-of select="$referenceN"/>
											</xsl:element>
										</xsl:element>
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
									<fo:block font-size="8pt">(If signing on behalf of firm or company)</fo:block>
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
									<fo:block font-size="8pt">(If signing on behalf of firm or company)</fo:block>
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
	
	<xsl:template match="supsfo:logo">
	  <xsl:element name="xsl:call-template">
		  <xsl:attribute name="name">logo</xsl:attribute>
		  <xsl:element name="with-param"><xsl:value-of select="$xslHome"/></xsl:element>
	  </xsl:element>
	</xsl:template>
	
	<xsl:template name="logo">
		<xsl:param name="xslHome"/>
		<fo:table table-layout="fixed">
			<fo:table-column column-width="6.5cm"/>
			<fo:table-body>
				<fo:table-row>
					<fo:table-cell>
						<fo:block>
							<fo:external-graphic content-height="1.5cm" content-width="5.8cm">
								<xsl:element name="xsl:attribute">
									<xsl:attribute name= "name">src</xsl:attribute>url(<xsl:element name="xsl:value-of"><xsl:attribute name="select">concat($xslHome,$vdLogoName)</xsl:attribute></xsl:element>)</xsl:element>
							</fo:external-graphic>
						</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</xsl:template>
	
	<xsl:template match="supsfo:welshCoverLogo">
	  <xsl:element name="xsl:call-template">
		  <xsl:attribute name="name">welshCoverLogo</xsl:attribute>
		  <xsl:element name="with-param"><xsl:value-of select="$xslHome"/></xsl:element>
	  </xsl:element>
	</xsl:template>
	
	<xsl:template name="welshCoverLogo">
		<xsl:param name="xslHome"/>
		<fo:table table-layout="fixed">
			<fo:table-column column-width="6.5cm"/>
			<fo:table-body>
				<fo:table-row>
					<fo:table-cell>
						<fo:block>
							<fo:external-graphic content-height="1.5cm" content-width="5.8cm">
								<xsl:element name="xsl:attribute">
									<xsl:attribute name= "name">src</xsl:attribute>url(<xsl:element name="xsl:value-of"><xsl:attribute name="select">concat($xslHome,$vdWelshCoverLogoName)</xsl:attribute></xsl:element>)</xsl:element>
							</fo:external-graphic>
						</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</xsl:template>

	<xsl:template match="supsfo:ccbcSeal">
	 <xsl:param name="xslHome"/>
		<fo:table table-layout="fixed">
			<fo:table-column column-width="7cm"/>
			<fo:table-body>
				<fo:table-row>
					<fo:table-cell>
						<fo:block>
							<fo:external-graphic content-height="2.7cm" content-width="2.7cm">
								<xsl:element name="xsl:attribute">
									<xsl:attribute name= "name">src</xsl:attribute>url(<xsl:element name="xsl:value-of"><xsl:attribute name="select">concat($xslHome,'/HMCTS_County_Court_Seal.png')</xsl:attribute></xsl:element>)</xsl:element>
							</fo:external-graphic>
						</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</fo:table-body>
		</fo:table>
	</xsl:template>
	
	<xsl:template match="supsfo:electronicSeal">
		<xsl:param name="xslHome"/>
		<xsl:element name="xsl:choose">
			<xsl:element name="xsl:when">
				<xsl:attribute name="test">string-length(/variabledata/division) > 0 and /variabledata/division != 'F'</xsl:attribute>
				<fo:block color="#888888" font-size="10pt" font-style="italic" start-indent="3cm" padding-before="1cm" padding-after="0.4cm" text-align="center">Seal</fo:block>
			</xsl:element>
			<xsl:element name="xsl:otherwise">
				<fo:table table-layout="fixed">
					<fo:table-column column-width="7cm"/>
					<fo:table-body>
						<fo:table-row>
							<fo:table-cell>
								<fo:block text-align="right">
									<fo:external-graphic content-height="2.7cm" content-width="2.7cm">
										<xsl:element name="xsl:attribute">
											<xsl:attribute name= "name">src</xsl:attribute>url(<xsl:element name="xsl:value-of"><xsl:attribute name="select">concat($xslHome,$vdSealImage)</xsl:attribute></xsl:element>)</xsl:element>
									</fo:external-graphic>
								</fo:block>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>	
			</xsl:element>
		</xsl:element>
	</xsl:template>
	
	<xsl:template name="addressImage">
	 <xsl:param name="xslHome"/>
		<fo:table table-layout="fixed">
			<fo:table-column column-width="7cm"/>
			<fo:table-body>
				<fo:table-row>
					<fo:table-cell>
						<fo:block>
							<fo:external-graphic>
								<xsl:element name="xsl:attribute">
									<xsl:attribute name= "name">src</xsl:attribute>url(<xsl:element name="xsl:value-of"><xsl:attribute name="select">concat($xslHome,$vdWelshAddressImage)</xsl:attribute></xsl:element>)</xsl:element>
							</fo:external-graphic>
						</fo:block>
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
			<xsl:when test="@useid != ''">
				<xsl:element name="xsl:apply-templates">
					<xsl:attribute name="select">//*[name() = 'DIV' or name() = 'div'][@class='EDITME'][@id='<xsl:value-of select="@useid"/>']/*  </xsl:attribute>
				</xsl:element>
			</xsl:when>
			<xsl:otherwise>
				<xsl:element name="xsl:apply-templates">
					<xsl:attribute name="select">//*[name() = 'DIV' or name() = 'div'][@class='EDITME'][@id='<xsl:value-of select="generate-id()" />']/*  </xsl:attribute>
				</xsl:element>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="minutehourday">
		<xsl:param name="units"/>
		<xsl:param name="quantity"/>
		<xsl:variable name="unitswording">
		<xsl:choose>
			<xsl:when test="$quantity > 1">
				<xsl:choose>
					<xsl:when test="$units = 'DAYS'">days</xsl:when>
					<xsl:when test="$units = 'HR'">hours</xsl:when>
					<xsl:when test="$units = 'D'">days</xsl:when>
					<xsl:when test="$units = 'M'">months</xsl:when>					
					<xsl:when test="$units = 'Y'">years</xsl:when>										
					<xsl:otherwise>minutes</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$units = 'DAYS'">day</xsl:when>
					<xsl:when test="$units = 'HR'">hour</xsl:when>
					<xsl:when test="$units = 'D'">day</xsl:when>
					<xsl:when test="$units = 'M'">month</xsl:when>					
					<xsl:when test="$units = 'Y'">year</xsl:when>										
					<xsl:otherwise>minute</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$quantity"/>&#xA0;<xsl:value-of select="$unitswording"/>
	</xsl:template>

	<xsl:template name="clmref">
		<xsl:param name="parameterclm"/>
		<xsl:param name="parameterclmrep"/>
		<xsl:param name="parameterclmsol"/>
				<xsl:choose>
					<xsl:when test="string-length($parameterclmrep) > 0">
						<xsl:value-of select="$parameterclmsol"/>
					</xsl:when>
					<xsl:otherwise>
							<xsl:value-of select="$parameterclm"/>
					</xsl:otherwise>
				</xsl:choose>		
	</xsl:template>

	<xsl:template name="defref">
		<xsl:param name="parameterdef"/>
		<xsl:param name="parameterdefrep"/>
		<xsl:param name="parameterdefsol"/>
				<xsl:choose>
					<xsl:when test="string-length($parameterdefrep) > 0">
						<xsl:value-of select="$parameterdefsol"/>
					</xsl:when>
					<xsl:otherwise>
							<xsl:value-of select="$parameterdef"/>
					</xsl:otherwise>
				</xsl:choose>		
	</xsl:template>

	<xsl:template name="partclmref">
		<xsl:param name="parameterpartclm"/>
		<xsl:param name="parameterpartclmrep"/>
		<xsl:param name="parameterpartclmsol"/>
				<xsl:choose>
					<xsl:when test="string-length($parameterpartclmrep) > 0">
						<xsl:value-of select="$parameterpartclmsol"/>
					</xsl:when>
					<xsl:otherwise>
							<xsl:value-of select="$parameterpartclm"/>
					</xsl:otherwise>
				</xsl:choose>		
	</xsl:template>	

	<xsl:template name="partdefref">
		<xsl:param name="parameterpartdef"/>
		<xsl:param name="parameterpartdefrep"/>
		<xsl:param name="parameterpartdefsol"/>
				<xsl:choose>
					<xsl:when test="string-length($parameterpartdefrep) > 0">
						<xsl:value-of select="$parameterpartdefsol"/>
					</xsl:when>
					<xsl:otherwise>
							<xsl:value-of select="$parameterpartdef"/>
					</xsl:otherwise>
				</xsl:choose>		
	</xsl:template>	
	
	<!-- Template to display the creditor's name and reference -->
	<!-- The requirement here is to display the creditor's name and reference when the output is addressed -->
	<!-- to that creditor. If the output is not addressed to the creditor then display the first creditor's -->
	<!-- name and reference. The first creditor is the creditor who belongs to the first debt. If a debt has -->
	<!-- a payee as well as a creditor then the output is addressed to the payee and not to the creditor. In -->
	<!-- this case we display the creditor's name with the payee's reference. -->
	<xsl:template name="display-creditor-name-and-reference-template">	
		<!-- Param : addressee      : Current addressee whose output is being generated. 
									  Could be debtor, creditor, blank (for court's output) etc.-->
		<!-- Param : printReference : Set to 'false' by the caller to stop the creditor's reference being printed.
			                          By default the reference is printed. -->
			
		<xsl:param name="addressee"/>
		<xsl:param name="printReference">true</xsl:param>
		
		<xsl:variable name="partyTypePassed">
			<xsl:value-of select="xalan:nodeset($addressee)/type"/>
		</xsl:variable>

		<xsl:variable name="partyIdPassed">
			<xsl:value-of select="xalan:nodeset($addressee)/id"/>
		</xsl:variable>				
		<xsl:variable name="debtSequence">
			<xsl:value-of select="xalan:nodeset($addressee)/debtseq"/>
		</xsl:variable>
		
		<xsl:choose>
			<!-- If the current output is for a creditor then display that creditor's name and reference -->
			<xsl:when test="$partyTypePassed = 'creditor'">				
				<fo:block hyphenate="true">
					<!-- Display the name with the appropriate capitalisation -->
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of select="xalan:nodeset($addressee)/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</fo:block>
				<!-- Print the reference unless the caller of this template has specified not to -->
				<!-- TRAC 1936 - old value <xsl:value-of select="/variabledata/order/coorder/debts/debt[creditor/id=$partyIdPassed]/creditorreference"/> -->
				<xsl:if test="$printReference = 'true'">
					<fo:block font-size="9pt" hyphenate="true">
						<xsl:value-of select="/variabledata/order/coorder/debts/debt[debtseq=$debtSequence]/creditorreference"/>
					</fo:block>				
				</xsl:if>				
			</xsl:when>
			<!-- Otherwise if the current output is for any other party type then display --> 
			<!-- the first creditor's name and reference unless we are dealing with a payee -->			
			<xsl:otherwise>
				<!-- The output is being addressed to a payee so we need to display that payee's reference -->
				<!-- along with the creditor name who belongs to that particular debt -->
				<xsl:choose>
					<xsl:when test="$partyTypePassed = 'payee'">								
						<fo:block hyphenate="true">
							<!-- Display the name with the appropriate capitalisation -->
							<!-- TRAC 1936 - old value <xsl:value-of select="/variabledata/order/coorder/debts/debt[payee/id=$partyIdPassed]/creditor/name"/> -->
							<xsl:call-template name="convertcase">
								<xsl:with-param name="toconvert">
									<xsl:value-of select="/variabledata/order/coorder/debts/debt[debtseq=$debtSequence]/creditor/name"/>
								</xsl:with-param>
								<xsl:with-param name="conversion">proper</xsl:with-param>
							</xsl:call-template>							
						</fo:block>	
						<!-- Print the reference unless the caller of this template has specified not to -->
						<!-- TRAC 1936 - old value <xsl:value-of select="/variabledata/order/coorder/debts/debt[payee/id=$partyIdPassed]/payeereference"/> -->
						<xsl:if test="$printReference = 'true'">						
							<fo:block font-size="9pt" hyphenate="true">
								<xsl:value-of select="/variabledata/order/coorder/debts/debt[debtseq=$debtSequence]/payeereference"/>
							</fo:block>													
						</xsl:if>
					</xsl:when>
					<!-- Just display the first creditor's name and reference ie. the one from the first debt -->
					<xsl:otherwise>
						<fo:block hyphenate="true">
							<xsl:value-of select="$vdCOCreditorName"/>
						</fo:block>
						<!-- Print the reference unless the caller of this template has specified not to -->
						<xsl:if test="$printReference = 'true'">							
							<fo:block font-size="9pt" hyphenate="true">
								<xsl:value-of select="$vdCOCreditorReference"/>
							</fo:block>																											
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>						
		</xsl:choose>	
	</xsl:template>

	<xsl:template name="letterReferenceText">
		<xsl:param name="welshAddress"/>
        <xsl:choose>
            <xsl:when test="$welshAddress = 'Y'">
                Your ref/Eich cyf: 
            </xsl:when>
            <xsl:otherwise>
                Your ref: 
            </xsl:otherwise>
        </xsl:choose>
	</xsl:template>

</xsl:stylesheet>