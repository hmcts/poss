<?xml version="1.0" encoding="UTF-8"?>
<!-- ==================================================================== -->
<!-- This stylesheet transforms the Output Templates (e.g. CJR010-FO.xml) -->
<!-- to their XHTML XSL template for runtime use in Caseman               -->
<!-- ==================================================================== -->
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:supsfo="http://eds.com/supsfo" 
	xmlns:ora="http://www.oracle.com/XSL/Transform/java"
	exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan">

	<xsl:param name="editable-font-config"/>
		
	<xsl:template match="/">
		<xsl:apply-templates select="supsfo:root"/>
	</xsl:template>
	
	<!-- ================================================================= -->
	<!-- What doesn't get specifically transformed, gets copied by default -->
	<!-- ================================================================= -->
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>
	
	<!-- ================================================== -->
	<!-- Processing the Output Template supsfo:root element -->
	<!-- ================================================== -->
	<xsl:template match="supsfo:root">
		<xsl:element name="xsl:stylesheet">
			<xsl:attribute name="version">1.0</xsl:attribute>
			<xsl:attribute name="xsl" namespace="xmlns">http://www.w3.org/1999/XSL/Transform</xsl:attribute>
			
			<xsl:element name="xsl:import">
				<xsl:attribute name="href">@word.processing.url.xsl2@supsfo.xsl</xsl:attribute>
			</xsl:element>
			
			<xsl:element name="xsl:strip-space">
				<xsl:attribute name="elements">*</xsl:attribute>
			</xsl:element>
			
			<xsl:element name="xsl:output">
				<xsl:attribute name="method">xml</xsl:attribute>
			</xsl:element>

			<xsl:element name="xsl:template">
				<xsl:attribute name="match">/</xsl:attribute>
				<editableSections>
					<xsl:apply-templates select="supsfo:body"/>
					<xsl:apply-templates select="supsfo:sections/supsfo:section/supsfo:body"/>
				</editableSections>
			</xsl:element>
			
			<xsl:element name="xsl:template">
				<xsl:attribute name="name">pagesequence</xsl:attribute>
				<xsl:element name="xsl:param">
					<xsl:attribute name="name">addressee</xsl:attribute>					
				</xsl:element> 
			</xsl:element>
			
			<xsl:apply-templates select=".//supsfo:numbered-list" mode="createnumberedlists"/>
		</xsl:element>
	</xsl:template>
		
	<xsl:template match="supsfo:body">
		<xsl:variable name="condition"><xsl:value-of select="./ancestor::supsfo:section/@condition"/></xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($condition) > 0 ">
				<xsl:element name="xsl:if">
					<xsl:attribute name="test"><xsl:value-of select="$condition"/></xsl:attribute>		
					<xsl:apply-templates select="supsfo:editable"/>  <!-- select="supsfo:editable"/ -->
				</xsl:element>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="supsfo:editable"/>  <!-- select="supsfo:editable"/ -->
			</xsl:otherwise>	
		</xsl:choose>	
	</xsl:template>
	
	
	<xsl:template match="supsfo:editable">
		<xsl:element name="div">
			<xsl:attribute name="class">EDITME</xsl:attribute>
			<xsl:attribute name="id">
				<xsl:choose>
					<xsl:when test="@useid != ''">
						<xsl:value-of select="@useid"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="generate-id()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<xsl:element name="div">
				<xsl:element name="font">
					<xsl:variable name="layout">
						<xsl:choose>
							<xsl:when test="/supsfo:root/supsfo:layout = 'general'">
								<xsl:value-of select="../../supsfo:layout"/>
							</xsl:when>
							<xsl:when test="/supsfo:root/supsfo:layout != ''">
								<xsl:value-of select="/supsfo:root/supsfo:layout"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>notice</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:attribute name="size">
						<xsl:variable name="size" select="document($editable-font-config)/layouts/layout[@type=$layout]/size"/>
						<xsl:choose>
							<xsl:when test="$size != ''">
								<xsl:value-of select="$size"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>3</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:attribute name="face">
						<xsl:variable name="face" select="document($editable-font-config)/layouts/layout[@type=$layout]/face"/>
						<xsl:choose>
							<xsl:when test="$face != ''">
								<xsl:value-of select="$face"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>Times New Roman</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>			
		</xsl:element>
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
		<xsl:element name="span">
			<xsl:attribute name="class">SupsFoCursor</xsl:attribute>
			<xsl:attribute name="id">SupsFoCursor</xsl:attribute>
			<xsl:value-of select="$cursorText"/>
		</xsl:element><br/>
		
	</xsl:template>
	
	
<!-- =============================================================== -->
<!-- fo:block                                                        -->
<!-- =============================================================== -->

<xsl:template match="fo:block">
  <xsl:apply-templates select='@id' /><div><xsl:call-template name='add-style-attribute' /><xsl:apply-templates mode="check-for-pre"/></div>
</xsl:template>

<!-- =============================================================== -->
<!-- fo:inline-sequence                                              -->
<!-- =============================================================== -->

<xsl:template match="fo:inline-sequence">
  <xsl:apply-templates select='@id' /><span><xsl:call-template name='add-style-attribute' /><xsl:apply-templates/></span>
</xsl:template>

<!-- =============================================================== -->
<!-- fo:list-block                                                   -->
<!-- =============================================================== -->

<xsl:template match="fo:list-block">
  <xsl:variable name="label-separation">
    <xsl:choose>
      <xsl:when test="@provisional-label-separation">
        <xsl:apply-templates select="@provisional-label-separation" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>8</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>  

  <xsl:variable name="body-offset">
    <xsl:choose>
      <xsl:when test="@provisional-distance-between-starts">
        <xsl:apply-templates select="@provisional-distance-between-starts" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>32</xsl:otherwise>
    </xsl:choose>
  </xsl:variable> 

  <div><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select='@id' /> 
    <table width="100%">
      <xsl:apply-templates select="fo:list-item | fo:list-item-label">
        <xsl:with-param name="label-width" 
                        select="$body-offset - $label-separation"/>
        <xsl:with-param name="gap-width" 
                        select="$label-separation"/>
      </xsl:apply-templates>
    </table>
  </div>

</xsl:template>

<!-- =============================================================== -->
<!-- supsfo:list-block                                               -->
<!-- =============================================================== -->
<xsl:template match="supsfo:list">
  <xsl:variable name="label-separation">
    <xsl:choose>
      <xsl:when test="@provisional-label-separation">
        <xsl:apply-templates select="@provisional-label-separation" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>12</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>  

  <xsl:variable name="body-offset">
    <xsl:choose>
      <xsl:when test="@provisional-distance-between-starts">
        <xsl:apply-templates select="@provisional-distance-between-starts" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>32</xsl:otherwise>
    </xsl:choose>
  </xsl:variable> 

  <div><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select='@id' /> 
    <table width="100%">
    	<colgroup>
    	<col>
    		<xsl:attribute name="width"><xsl:value-of select="$body-offset - $label-separation"/></xsl:attribute>
    		<xsl:attribute name="align">center</xsl:attribute>
    		<xsl:attribute name="valign">top</xsl:attribute>
    	</col>
    	<col />
    	</colgroup>
      <xsl:apply-templates select="supsfo:list-item | supsfo:list-item-label">
        <xsl:with-param name="label-width" 
                        select="$body-offset - $label-separation"/>
        <xsl:with-param name="gap-width" 
                        select="$label-separation"/>
      </xsl:apply-templates>
    </table>
  </div>

</xsl:template>
<xsl:template match="supsfo:list-block">
  <xsl:variable name="label-separation">
    <xsl:choose>
      <xsl:when test="@provisional-label-separation">
        <xsl:apply-templates select="@provisional-label-separation" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>8</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>  

  <xsl:variable name="body-offset">
    <xsl:choose>
      <xsl:when test="@provisional-distance-between-starts">
        <xsl:apply-templates select="@provisional-distance-between-starts" 
                             mode="convert-to-pixels"/>
      </xsl:when>
      <xsl:otherwise>32</xsl:otherwise>
    </xsl:choose>
  </xsl:variable> 

  <div><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select='@id' /> 
    <table width="100%">
      <xsl:apply-templates select="supsfo:list-item | supsfo:list-item-label">
        <xsl:with-param name="label-width" 
                        select="$body-offset - $label-separation"/>
        <xsl:with-param name="gap-width" 
                        select="$label-separation"/>
      </xsl:apply-templates>
    </table>
  </div>

</xsl:template>


	<xsl:template match="supsfo:numbered-list">
		<xsl:if test="supsfo:list-item">
			<ol>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="@name"/>1</xsl:attribute>
				</xsl:element>
			</ol>
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
							<li>
									<xsl:apply-templates select="./*"/>
							</li>		<xsl:if test="last() > position()">
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
							<li>
									<xsl:apply-templates select="./*"/>
							</li>			<xsl:if test="last() > position()">
								<xsl:element name="xsl:call-template">
									<xsl:attribute name="name"><xsl:value-of select="../@name"/><xsl:value-of select="position() + 1"/></xsl:attribute>
									<xsl:element name="xsl:with-param"><xsl:attribute name="name">number</xsl:attribute><xsl:element name="xsl:value-of"><xsl:attribute name="select">$number + 1</xsl:attribute></xsl:element></xsl:element>
								</xsl:element>
							</xsl:if>					
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>
	


<!-- =============================================================== -->
<!-- fo:list-item                                                    -->
<!-- =============================================================== -->

<xsl:template match="fo:list-item">
  <xsl:param name="label-width"/> 
  <xsl:param name="gap-width"/>

  <tr><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select="fo:list-item-label" mode="draw-cell">
       <xsl:with-param name="width" select="$label-width"/>
    </xsl:apply-templates>
    <xsl:if test="$gap-width &gt; 0">
      <td width="{$gap-width}">&#8226;</td>
    </xsl:if>

    <xsl:apply-templates select="fo:list-item-body" mode="draw-cell"/>
  </tr>
</xsl:template>

<!-- =============================================================== -->
<!-- supsfo:list-item                                                -->
<!-- =============================================================== -->

<xsl:template match="supsfo:list-item">
  <xsl:param name="label-width"/> 
  <xsl:param name="gap-width"/>

  <tr><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select="supsfo:list-item-label" mode="draw-cell">
       <xsl:with-param name="width" select="$label-width"/>
    </xsl:apply-templates>
    <xsl:if test="$gap-width &gt; 0">
      <td style="width: {$gap-width};">&#8226;</td>
    </xsl:if>

    <td><xsl:apply-templates select="./*"/></td>
  </tr>
</xsl:template>

<!-- =============================================================== -->
<!-- fo:list-item-label - itemless lists                             -->
<!-- =============================================================== -->

<xsl:template match="fo:list-block/fo:list-item-label">
  <xsl:param name="label-width"/> 
  <xsl:param name="gap-width"/>

  <tr>
    <xsl:apply-templates select="." mode="draw-cell">
       <xsl:with-param name="width" select="$label-width"/>
    </xsl:apply-templates>
    <xsl:if test="$gap-width &gt; 0">
      <td width="{$gap-width}">&#8226;</td>
    </xsl:if>

    <xsl:apply-templates select="following-sibling::fo:list-item-body[1]" mode="draw-cell"/>
  </tr>
</xsl:template>

<!-- =============================================================== -->
<!-- supsfo:list-item-label - itemless lists                         -->
<!-- =============================================================== -->

<xsl:template match="supsfo:list-block/supsfo:list-item-label">
  <xsl:param name="label-width"/> 
  <xsl:param name="gap-width"/>

  <tr>
    <xsl:apply-templates select="." mode="draw-cell">
       <xsl:with-param name="width" select="$label-width"/>
    </xsl:apply-templates>
    <xsl:if test="$gap-width &gt; 0">
      <td width="{$gap-width}">&#8226;</td>
    </xsl:if>

    <xsl:apply-templates select="following-sibling::supsfo:list-item-body[1]" mode="draw-cell"/>
  </tr>
</xsl:template>
<xsl:template match="supsfo:list/supsfo:list-item-label">
  <xsl:param name="label-width"/> 
  <xsl:param name="gap-width"/>

  <tr>
    <xsl:apply-templates select="." mode="draw-cell">
       <xsl:with-param name="width" select="$label-width"/>
    </xsl:apply-templates>
    <xsl:if test="$gap-width &gt; 0">
      <td width="{$gap-width}">&#8226;</td>
    </xsl:if>

    <xsl:apply-templates select="following-sibling::supsfo:list-item-body[1]" mode="draw-cell"/>
  </tr>
</xsl:template>
<!-- =============================================================== -->
<!-- fo:list-item-body - itemless lists                              -->
<!-- =============================================================== -->

<xsl:template match="fo:list-item-label | fo:list-item-body" mode="draw-cell">
  <xsl:param name="width" select="'auto'"/> 
  <td valign="top"><xsl:call-template name='add-style-attribute' /><xsl:apply-templates select='@id' />
    <xsl:if test="$width != 'auto'">
      <xsl:attribute name="width">
        <xsl:value-of select="$width"/>
      </xsl:attribute>
    </xsl:if>

    <xsl:apply-templates mode="check-for-pre"/>
  </td>
</xsl:template>

<!-- =============================================================== -->
<!-- supsfo:list-item-body - itemless lists                          -->
<!-- =============================================================== -->

<xsl:template match="supsfo:list-item-label | supsfo:list-item-body" mode="draw-cell">
  <xsl:param name="width" select="'auto'"/> 
  <td valign="top"><xsl:call-template name='add-style-attribute' /><xsl:apply-templates select='@id' />
    <xsl:if test="$width != 'auto'">
      <xsl:attribute name="width">
        <xsl:value-of select="$width"/>
      </xsl:attribute>
    </xsl:if>

    <xsl:apply-templates mode="check-for-pre"/>
  </td>
</xsl:template>


<!-- =============================================================== -->
<!-- fo:table and its components                                     -->
<!-- =============================================================== -->

<xsl:template match="fo:table">
  <xsl:apply-templates select='@id' />
  <table><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates/>
  </table>
</xsl:template>

<xsl:template match="fo:table-header">
  <thead><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates/>
  </thead>
</xsl:template>

<xsl:template match="fo:table-footer">
  <tfoot><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates/>
  </tfoot>
</xsl:template>

<xsl:template match="fo:table-body">
  <tbody><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates/>
  </tbody>
</xsl:template>

<xsl:template match="fo:table-row">
  <tr><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates mode="display"/>
  </tr>
</xsl:template>

<xsl:template match="fo:table-cell" mode="display">
  <td><xsl:call-template name='add-style-attribute' />
    <xsl:apply-templates select="@*" mode="get-table-attributes"/>
    <xsl:apply-templates mode="check-for-pre"/>
  </td>
</xsl:template>

<xsl:template match="fo:table-column">
	<xsl:element name="col">
		<xsl:attribute name="width">
			<xsl:apply-templates select="@column-width" mode="convert-to-pixels"/>
		</xsl:attribute>
	</xsl:element>
</xsl:template>

<xsl:template match="fo:table-cell" priority="-1"/>

<!-- This template accounts for "rowless" tables -->
<xsl:template priority="1" 
              match="fo:table-cell[not(parent::fo:table-row)]
              [not(preceding-sibling::fo:table-cell) or @starts-row='yes' 
               or preceding-sibling::fo:table-cell[1][@ends-row]]">
  <tr>
    <xsl:call-template name="enumerate-rowless-cells"/>
  </tr>
</xsl:template>

<xsl:template name="enumerate-rowless-cells">
  <xsl:apply-templates select="." mode="display"/>
  <xsl:if test="not(@ends-row='yes')">
    <xsl:for-each select="following-sibling::fo:table-cell[1]
                          [not(@starts-row='yes')]">
      <xsl:call-template name="enumerate-rowless-cells"/>
    </xsl:for-each>
  </xsl:if>
</xsl:template>


<!-- =============================================================== -->
<!-- fo:inline-graphic                                               -->
<!-- =============================================================== -->

<xsl:template match="fo:inline-graphic">
  <xsl:variable name="cleaned-url">
    <xsl:apply-templates select="@href" mode="unbracket-url"/>
  </xsl:variable>
  <xsl:apply-templates select='@id' /><img src="{$cleaned-url}"><xsl:apply-templates select="@height|@width|@*[starts-with(name(),'border')]"/></img>
</xsl:template>

<xsl:template match="fo:inline">
	<xsl:apply-templates select='@id' /><span><xsl:call-template name='add-style-attribute' /><xsl:apply-templates mode="check-for-pre"/></span>
</xsl:template>
<!-- =============================================================== -->
<!-- fo:display-graphic                                              -->
<!-- =============================================================== -->

<xsl:template match="fo:display-graphic">
  <xsl:variable name="cleaned-url">
    <xsl:apply-templates select="@href" mode="unbracket-url"/>
  </xsl:variable>

  <div><xsl:call-template name='add-style-attribute' /><xsl:apply-templates select='@id' /><img src="{$cleaned-url}"><xsl:apply-templates select="@height|@width"/></img></div>
</xsl:template>

<!-- =============================================================== -->
<!-- fo:simple-link                                                  -->
<!-- =============================================================== -->

<xsl:template match="fo:simple-link[@external-destination]">

  <xsl:variable name="cleaned-url">
    <xsl:apply-templates select="@external-destination" mode="unbracket-url"/>
  </xsl:variable>

  <xsl:apply-templates select='@id' /><a href="{$cleaned-url}"><xsl:call-template name='add-style-attribute' /><xsl:apply-templates/></a>
</xsl:template>

<xsl:template match="fo:simple-link[@internal-destination]">
  <xsl:apply-templates select='@id' /><a href="#{@internal-destination}"><xsl:call-template name='add-style-attribute' /><xsl:apply-templates/></a>
</xsl:template>


<!-- *************************************************************** -->
<!-- Treatment of attributes that are either identical to their CSS1 -->
<!-- counterparts, of find an equivalent expression there            -->

<!-- =============================================================== -->
<!-- Default rule: copy CSS1 attributes and suppress all other       -->
<!-- =============================================================== -->

<xsl:template match="@*" priority="-2" mode="collect-style-attributes"/>

<xsl:template match="@color |
                     @padding |
                     @margin |
                     @border |
                     @border-width |
                     @border-color |
                     @border-style |
                     @background |
                     @background-color |
                     @background-image |
                     @background-position |
                     @background-repeat |
                     @letter-spacing |
                     @word-spacing |
                     @line-height |
                     @font |
                     @font-family |
                     @font-size |
                     @font-weight |
                     @font-style |
                     @font-variant |
                     @vertical-align |
                     @text-decoration |
                     @text-indent |                     
                     @text-transform"
                     mode="collect-style-attributes">
  <xsl:value-of select="name()"/>
  <xsl:text>: </xsl:text>
  <xsl:value-of select="."/>
  <xsl:text>; </xsl:text>
</xsl:template>

<!-- =============================================================== -->
<!-- Some attributes deserve special treatment -->


<xsl:template match="@text-align"
                     mode="collect-style-attributes">
  <xsl:text>text-align: </xsl:text>
  <xsl:choose>
    <xsl:when test=".='centered'">center</xsl:when>
    <xsl:when test=".='center'">center</xsl:when>
    <xsl:when test=".='end'">right</xsl:when>
    <xsl:when test=".='justified'">justify</xsl:when>
    <xsl:when test=".='right'">right</xsl:when>    
    <xsl:otherwise>left</xsl:otherwise>
  </xsl:choose>
  <xsl:text>; </xsl:text>
</xsl:template>

<xsl:template match="@space-before |
					 @space-before.optimum |
                     @space-before.minimum [not (../@space-before.optimum)] |
                     @space-before.maximum [not (../@space-before.optimum) and not (../@space-before.minimum)]"
                     mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-spaces">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-top'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template match="@space-after |
					 @space-after.optimum |
                     @space-after.minimum [not (../@space-after.optimum)] |
                     @space-after.maximum [not (../@space-after.optimum) and not (../@space-after.minimum)]"
                     mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-spaces">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-bottom'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template match="@start-indent"
                     mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-spaces">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-left'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template match="@end-indent"
                     mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-spaces">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-right'"/>
  </xsl:call-template>
</xsl:template>


<xsl:template name="process-spaces">
  <xsl:param name="orientation"/>
  <xsl:param name="side"/>

  <xsl:text>margin</xsl:text>
  <xsl:call-template name="get-rotated-direction">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="$side"/>
  </xsl:call-template>
  <xsl:text>: </xsl:text>
  <xsl:value-of select="."/>
  <xsl:text>; </xsl:text>
</xsl:template>

<!-- =============================================================== -->
<!-- A bunch of stuff for handling reference orientation; a mess ;-) -->

<xsl:template match="@padding-top |
                     @margin-top |
                     @border-top |
                     @border-top-width |
                     @border-top-color |
                     @border-top-style"
              mode="collect-style-attributes"
              priority="-1">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-top'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-bottom |
                     @margin-bottom |
                     @border-bottom |
                     @border-bottom-width |
                     @border-bottom-color |
                     @border-bottom-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-bottom'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-right |
                     @margin-right |
                     @border-right |
                     @border-right-width |
                     @border-right-color |
                     @border-right-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-right'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-left |
                     @margin-left |
                     @border-left |
                     @border-left-width |
                     @border-left-color |
                     @border-left-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-left'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-before |
                     @margin-before |
                     @border-before |
                     @border-before-width |
                     @border-before-color |
                     @border-before-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-before'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-after |
                     @margin-after |
                     @border-after |
                     @border-after-width |
                     @border-after-color |
                     @border-after-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-after'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-start |
                     @margin-start |
                     @border-start |
                     @border-start-width |
                     @border-start-color |
                     @border-start-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-start'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template match="@padding-end |
                     @margin-end |
                     @border-end |
                     @border-end-width |
                     @border-end-color |
                     @border-end-style"
              mode="collect-style-attributes">
  <xsl:param name="orientation"/>
  <xsl:call-template name="process-side-attributes">
    <xsl:with-param name="orientation" select="$orientation"/>
    <xsl:with-param name="side" select="'-end'"/>
  </xsl:call-template> 
</xsl:template>

<xsl:template name="process-side-attributes">
  <xsl:param name="orientation"/>
  <xsl:param name="side"/>
  
  <xsl:call-template name="rotate-side">
    <xsl:with-param name="from-side" select="$side"/>
    <xsl:with-param name="to-side">
      <xsl:call-template name="get-rotated-direction">
        <xsl:with-param name="orientation" select="$orientation"/>
        <xsl:with-param name="side">
          <xsl:choose>
            <xsl:when test="$side='-start'">-left</xsl:when>
            <xsl:when test="$side='-end'">-right</xsl:when>
            <xsl:when test="$side='-before'">-top</xsl:when>
            <xsl:when test="$side='-after'">-bottom</xsl:when>
            <xsl:otherwise><xsl:value-of select="$side"/></xsl:otherwise>
          </xsl:choose>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:with-param>
  </xsl:call-template>

</xsl:template>


<xsl:template name="rotate-side">
  <xsl:param name="from-side"/>
  <xsl:param name="to-side"/>

  <xsl:value-of select="concat ( substring-before(name(), $from-side),
                                 $to-side,
                                 substring-after(name(),$from-side))"/>
  <xsl:text>: </xsl:text>
  <xsl:value-of select="."/>
  <xsl:text>; </xsl:text>
</xsl:template>


<xsl:template name="get-rotated-direction">
  <xsl:param name="orientation"/>
  <xsl:param name="side"/>

  <xsl:choose>
    <xsl:when test="$orientation='90' and $side='-top'">-left</xsl:when>
    <xsl:when test="$orientation='90' and $side='-left'">-bottom</xsl:when>
    <xsl:when test="$orientation='90' and $side='-bottom'">-right</xsl:when>
    <xsl:when test="$orientation='90' and $side='-right'">-top</xsl:when>
    <xsl:when test="$orientation='-270' and $side='-top'">-left</xsl:when>
    <xsl:when test="$orientation='-270' and $side='-left'">-bottom</xsl:when>
    <xsl:when test="$orientation='-270' and $side='-bottom'">-right</xsl:when>
    <xsl:when test="$orientation='-270' and $side='-right'">-top</xsl:when>
    <xsl:when test="$orientation='180' and $side='-top'">-bottom</xsl:when>
    <xsl:when test="$orientation='180' and $side='-left'">-right</xsl:when>
    <xsl:when test="$orientation='180' and $side='-bottom'">-top</xsl:when>
    <xsl:when test="$orientation='180' and $side='-right'">-left</xsl:when>
    <xsl:when test="$orientation='-180' and $side='-top'">-bottom</xsl:when>
    <xsl:when test="$orientation='-180' and $side='-left'">-right</xsl:when>
    <xsl:when test="$orientation='-180' and $side='-bottom'">-top</xsl:when>
    <xsl:when test="$orientation='-180' and $side='-right'">-left</xsl:when>
    <xsl:when test="$orientation='270' and $side='-top'">-right</xsl:when>
    <xsl:when test="$orientation='270' and $side='-left'">-top</xsl:when>
    <xsl:when test="$orientation='270' and $side='-bottom'">-left</xsl:when>
    <xsl:when test="$orientation='270' and $side='-right'">-bottom</xsl:when>
    <xsl:when test="$orientation='-90' and $side='-top'">-right</xsl:when>
    <xsl:when test="$orientation='-90' and $side='-left'">-top</xsl:when>
    <xsl:when test="$orientation='-90' and $side='-bottom'">-left</xsl:when>
    <xsl:when test="$orientation='-90' and $side='-right'">-bottom</xsl:when>
    <xsl:otherwise><xsl:value-of select="$side"/></xsl:otherwise>
  </xsl:choose>

</xsl:template>


<xsl:template match="*" mode="check-for-pre" priority="-1">
  <xsl:apply-templates select="."/>
</xsl:template>

<xsl:template match="*[@whitespace-treatment='preserve' or @wrap-option='no-wrap']"
                     mode="check-for-pre">
  <pre><xsl:apply-templates select="."/></pre>
</xsl:template>

<!-- =============================================================== -->
<!-- Recalculate a length to pixels. 1 in = 96 px, 1 em = 1 pc;      -->
<!-- this gives reasonable results for 800x600 and 1024x768 screens  -->
<!-- =============================================================== -->

<xsl:template match="@*" mode="convert-to-pixels">
  <xsl:variable name="scaling-factor">
    <xsl:choose>
      <xsl:when test="contains (., 'pt')">1.33</xsl:when>
      <xsl:when test="contains (., 'px')">1</xsl:when>
      <xsl:when test="contains (., 'pc')">16</xsl:when>
      <xsl:when test="contains (., 'in')">96</xsl:when>
      <xsl:when test="contains (., 'cm')">37.8</xsl:when>
      <xsl:when test="contains (., 'mm')">3.78</xsl:when>
      <xsl:when test="contains (., 'em')">16</xsl:when> <!-- best try -->
      <xsl:otherwise>1</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <xsl:variable name="numeric-value" 
       select="translate (., '-0123456789.ptxcinme', '-0123456789.')"/>
  <xsl:value-of select="$numeric-value * $scaling-factor"/>
</xsl:template>

<!-- =============================================================== -->
<!-- Remove brackets & quotes around URLs                            -->
<!-- =============================================================== -->

<xsl:template match="@*" mode="unbracket-url">
  <xsl:choose>
    <xsl:when test="starts-with(., 'url(')">
      <xsl:variable name="url-text" select="normalize-space(.)"/>
      <xsl:value-of select="substring(substring($url-text, 1, string-length ($url-text) - 2 ), 6)"/>
    </xsl:when>
    <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
  </xsl:choose>
</xsl:template>

<!-- =============================================================== -->
<!-- Page number - always 1                                          -->
<!-- =============================================================== -->

<xsl:template match="fo:page-number | fo:page-number-citation">
<!--  <span><xsl:call-template name='add-style-attribute' />1</span> --> <!-- suppressed -->
</xsl:template>

<!-- =============================================================== -->
<!-- Static content - add a <hr/> before or after it                 -->
<!-- =============================================================== -->

<xsl:template match="fo:flow |fo:static-content">
  <div><xsl:call-template name='add-style-attribute' /><xsl:apply-templates select='@id' /><xsl:apply-templates/></div>
</xsl:template>

<!-- =============================================================== -->
<!-- Footnotes                                                       -->
<!-- =============================================================== -->

<xsl:template match="fo:footnote">
  <xsl:apply-templates select="fo:footnote-citation"/>
</xsl:template>

<xsl:template match="fo:footnote" mode="after-text">
  <div><xsl:call-template name='add-style-attribute' /><xsl:apply-templates select='@id' />
    <xsl:apply-templates select="*[not(self::fo:footnote-citation)]"/>
  </div>
</xsl:template>

<xsl:template match="fo:footnote-citation">
  <span><xsl:call-template name='add-style-attribute' /><xsl:apply-templates/></span>
</xsl:template>

<!-- =============================================================== -->
<!-- Copy all CSS1-compatible attributes to "style" property         -->
<!-- =============================================================== -->

<xsl:template name="add-style-attribute">
  <xsl:param name="orientation" select="0"/>
  <xsl:variable name="style">
    <xsl:apply-templates select="@*" mode="collect-style-attributes">
      <xsl:with-param name="orientation" select="$orientation"/>
    </xsl:apply-templates>
  </xsl:variable>  

  <xsl:if test="string-length($style) &gt; 0">
    <xsl:attribute name="style"><xsl:value-of select="normalize-space($style)"/></xsl:attribute>
  </xsl:if>
</xsl:template>

<!-- =============================================================== -->
<!-- Create an anchor                                                -->
<!-- =============================================================== -->

<xsl:template match="@id"><a name="{.}"/></xsl:template>

<!-- =============================================================== -->
<!-- Table cell geometry                                             -->
<!-- =============================================================== -->

<xsl:template match="@*" mode="get-table-attributes" priority="-1"/>

<xsl:template match="@n-columns-spanned"
                     mode="get-table-attributes">
  <xsl:attribute name="colspan"><xsl:value-of select="."/></xsl:attribute>
</xsl:template>

<xsl:template match="@n-rows-spanned"
                     mode="get-table-attributes">
  <xsl:attribute name="rowspan"><xsl:value-of select="."/></xsl:attribute>
</xsl:template>




<!-- =============================================================== -->
<!-- Page layout                                                     -->
<!-- =============================================================== -->

<xsl:template match="@extent">
  <xsl:attribute name="width"><xsl:apply-templates select="." mode="convert-to-pixels"/></xsl:attribute>
</xsl:template>

<xsl:template match="@width|@height">
  <xsl:attribute name="{name()}"><xsl:apply-templates select="." mode="convert-to-pixels"/></xsl:attribute>
</xsl:template>

<xsl:template match="fo:sequence-specifier-single">
  <xsl:value-of select="@page-master-name"/>
</xsl:template>

<xsl:template match="fo:sequence-specifier-repeating">
  <xsl:value-of select="@page-master-first"/>
</xsl:template>

<xsl:template match="fo:sequence-specifier-alternating">
  <xsl:value-of select="@page-master-first"/>
</xsl:template>

<xsl:template match="fo:region-before">
  <xsl:call-template name="add-style-attribute">
    <xsl:with-param name="orientation" select="@reference-orientation"/>
  </xsl:call-template>  
  <xsl:call-template name="get-area-attributes"/>
  <xsl:apply-templates select="/fo:root/fo:page-sequence[1]/fo:static-content[@flow-name='xsl-before']"/>
</xsl:template>

<xsl:template match="fo:region-after">
  <xsl:call-template name="add-style-attribute">
    <xsl:with-param name="orientation" select="@reference-orientation"/>
  </xsl:call-template>  
  <xsl:call-template name="get-area-attributes"/>
  <xsl:apply-templates select="/fo:root/fo:page-sequence[1]/fo:static-content[@flow-name='xsl-after']"/>
</xsl:template>

<xsl:template match="fo:region-body">
  <xsl:call-template name="get-area-attributes"/>

  <xsl:variable name="style">
    <xsl:apply-templates 
          select="@*[not (starts-with (name(), 'margin') 
                          or starts-with (name(), 'space'))]" 
          mode="collect-style-attributes">
      <xsl:with-param name="orientation" select="@reference-orientation"/>
    </xsl:apply-templates>

  </xsl:variable>  

  <xsl:if test="string-length($style) &gt; 0">
    <xsl:attribute name="style"><xsl:value-of select="normalize-space($style)"/></xsl:attribute>
  </xsl:if>

  <xsl:apply-templates select="/fo:root/fo:page-sequence/fo:flow"/>
  <xsl:if test="//fo:footnote">
    <br/><hr/>
    <xsl:apply-templates select="//fo:footnote" mode="after-text"/>
  </xsl:if>
</xsl:template>

<xsl:template match="fo:region-start">
  <xsl:call-template name="add-style-attribute">
    <xsl:with-param name="orientation" select="@reference-orientation"/>
  </xsl:call-template>  
  <xsl:apply-templates select="@extent"/>
  <xsl:call-template name="get-area-attributes"/>
  <xsl:apply-templates select="/fo:root/fo:page-sequence[1]/fo:static-content[@flow-name='xsl-start']"/>
</xsl:template>

<xsl:template match="fo:region-end">
  <xsl:call-template name="add-style-attribute">
    <xsl:with-param name="orientation" select="@reference-orientation"/>
  </xsl:call-template>  
  <xsl:apply-templates select="@extent"/>
  <xsl:call-template name="get-area-attributes"/>
  <xsl:apply-templates select="/fo:root/fo:page-sequence[1]/fo:static-content[@flow-name='xsl-end']"/>
</xsl:template>

<xsl:template name="get-area-attributes">
  <xsl:attribute name="valign">
    <xsl:choose>
      <xsl:when test="@vertical-align='middle'">center</xsl:when>
      <xsl:when test="@vertical-align"><xsl:value-of select="@vertical-align"/></xsl:when>
      <xsl:otherwise>top</xsl:otherwise>
    </xsl:choose>
  </xsl:attribute>
</xsl:template>

</xsl:stylesheet>