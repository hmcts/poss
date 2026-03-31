<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fn="http://www.w3.org/2006/xpath-functions">
<xsl:output method='html' version='1.0' encoding="ISO-8859-1" indent='yes'/>
<xsl:param name="pSrcRoot"></xsl:param>	

<!-- ApplicationConfig.xsl
     Purpose: To produce a document containing details of all services identified in
              applicationconfig.xml.
     Calling procedure: From the command line, use (depending on Xalan installation)
                        java -cp c:\xalan-j_2_7_0\xalan.jar org.apache.xalan.xslt.Process
                             -IN applicationconfig.xml
                             -XSL ApplicationConfig.xsl
                             -OUT ServiceCatalogue.html
     A more recent version of the Xalan parser was required due to the one contained
     within j2sdk1.4.2_05 having a feature that prevented files containing a Byte
     Order Mark (three non-printing characters) being processed.
     Author: DJWright

     File History
     29/09/2006 - Added acceptance of a paramater to represent PROJECT.BASE 
                  to enable XSL to pick up appropriate files. DJWright
-->

  <!-- Global variables -->
  <xsl:variable name="srcRoot"><xsl:value-of select="$pSrcRoot"/>\src\</xsl:variable>
  <xsl:variable name="casemanExt" select='"uk/gov/dca/caseman/"'/>
  <xsl:variable name="debug" select='"false"'/>

  <xsl:template match="/">
    <html>
    <body>
    <h2>Service List</h2>
      <table border="1">
        <tr bgcolor="#aaaaaa">
          <th align="left">Form name</th>
          <th align="left">Service</th>
          <th align="left">Method</th>
          <th align="left">Parameters</th>
          <th align="left">Query Def</th>
          <th align="left">Map</th>
          <th align="left">Author</th>
          <th align="left">Description</th>
        </tr>
        <xsl:for-each select="application-config/forms/form">
        <xsl:sort select="@name"/>
          <xsl:for-each select="./service">
          <xsl:sort select="@url"/>
          <xsl:sort select="@method"/>
          <tr>
            <td><xsl:value-of select="../@name"/></td>
            <td><xsl:value-of select="@url"/></td>
            <td><xsl:value-of select="@method"/></td>
            <xsl:choose>
              <xsl:when test="count(param) != 0">
                <td>
                  <xsl:for-each select="param">
                    <xsl:value-of select="@name"/>
                       <xsl:if test="position() != last()">
                          <xsl:text>, </xsl:text>
                       </xsl:if>
                  </xsl:for-each>
                </td>
              </xsl:when>
              <xsl:otherwise>
                <td>None</td>
              </xsl:otherwise>
            </xsl:choose>

            <xsl:apply-templates select="."/>

          </tr>
          </xsl:for-each>
        </xsl:for-each>
      </table>

      <p>
      <h4>Notes:</h4>
      <ul>
        <li>For automatically generated forms, the services listed are those called by that form
            and <em>all</em> other similar forms (i.e. Oracle Reports and Word Processing).</li>
      </ul>
      </p>

    </body>
    </html>
  </xsl:template>


  <!-- Open the method file for a service -->
  <xsl:template match="service">
      <!-- Check to see if the name of the method file is listed in the non-compliant
           services file -->
      <xsl:variable name="nonCompliantMethodFilePath">
      <xsl:if test="count(document('NonCompliantServices.xml')/*) != 0">
        <xsl:variable name="serviceName" select="@url"/>
        <xsl:variable name="methodName" select="@method"/>
        <xsl:variable name="nonCompliantServiceDoc" select="document('NonCompliantServices.xml')"/>

        <!-- Set the value of $methodFilePath based on values from NonCompliantServices.xml -->
        <xsl:for-each select="$nonCompliantServiceDoc/NonCompliantServices/Service">
          <xsl:if test="Name = $serviceName and Method = $methodName">
              <xsl:value-of select="$srcRoot"/><xsl:value-of select="$casemanExt"/><xsl:value-of select="Directory"/>/methods/<xsl:value-of select="Filename"/>
          </xsl:if>
        </xsl:for-each>
      </xsl:if> <!-- there are nodes in NonCompliantServices.xml i.e. file exists -->
      </xsl:variable> <!-- nonCompliantMethodFilePath -->

      <!-- Set the variable $methodFilePath from either the non compliant file, standard
           underscored naming convention, non-standard naming convention, or leave blank 
           if these fail to produce the valid file name -->
      <xsl:variable name="methodFilePath">
      <xsl:choose>
        <xsl:when test="$nonCompliantMethodFilePath != ''">
          <!-- *** SITUATION 1 - The service is in the non compliant file *** -->
          <xsl:value-of select="$nonCompliantMethodFilePath"/>
        </xsl:when> <!-- the service is in the non compliant file -->
        <xsl:otherwise>

          <!-- Replace Uppercase characters with _<lower case>
               e.g. getJudgesName -> get_judges_name for method directory and file name -->
          <xsl:variable name="underscoredMethodDirectory">
            <xsl:call-template name="caps-to-underscore-lc">
                <xsl:with-param name="string" select="@url"/>
                <xsl:with-param name="startPos" select="2"/>
            </xsl:call-template>
          </xsl:variable>

          <xsl:variable name="underscoredMethodName">
            <xsl:call-template name="caps-to-underscore-lc">
                <xsl:with-param name="string" select="@method"/>
                <xsl:with-param name="startPos" select="1"/>
            </xsl:call-template>
          </xsl:variable>

          <!-- Work out the name of the server config -->
          <xsl:variable name="underscoredMethodFilePath">
              <xsl:value-of select="$srcRoot"/><xsl:value-of select="$casemanExt"/><xsl:value-of select="$underscoredMethodDirectory"/>_service/methods/<xsl:value-of select="$underscoredMethodName"/>.xml
          </xsl:variable>

          <!-- Check whether the method file exists first as naming convention
               hasn't always been followed -->
          <xsl:choose>
            <xsl:when test="count(document($underscoredMethodFilePath)/*) != 0">
              <!-- *** SITUATION 2 - The service is not in the non compliant file, and the underscored
                                     naming convention has worked *** -->
              <xsl:value-of select="$underscoredMethodFilePath"/>
            </xsl:when> <!-- there are nodes in $underscoredMethodFilePath i.e. file exists -->
            <xsl:otherwise>

              <xsl:variable name="nonUnderscoredMethodFilePath">
                  <xsl:value-of select="$srcRoot"/><xsl:value-of select="$casemanExt"/><xsl:value-of select="$underscoredMethodDirectory"/>_service/methods/<xsl:value-of select="@method"/>.xml
              </xsl:variable>
        
              <xsl:choose>
                <xsl:when test="count(document($nonUnderscoredMethodFilePath)/*) != 0">
                  <xsl:value-of select="$nonUnderscoredMethodFilePath"/>
                  <!-- *** SITUATION 3 - The service is not in the non compliant file, and the underscored
                                         naming convention has not worked *** -->
                </xsl:when> <!-- there are nodes in $nonUnderscoredMethodFilePath i.e. file exists -->
                <xsl:otherwise>
                  <!-- *** SITUATION 4 - The service is not in the non compliant file, and neither
                                         naming convention has worked *** -->
                  <xsl:value-of select="''"/> <!-- Implicit anyway, for completeness -->
                </xsl:otherwise> <!-- there aren't nodes in $nonUnderscoredMethodFilePath -->
              </xsl:choose>
            </xsl:otherwise> <!-- there aren't nodes in $underscoredMethodFilePath -->
          </xsl:choose>

        </xsl:otherwise> <!-- service not in the non compliant file -->
      </xsl:choose>
      </xsl:variable> <!-- methodFilePath -->


      <!-- Apply templates to work out where the queryDef is -->
      <xsl:choose>
        <xsl:when test="$methodFilePath != ''">
          <xsl:choose>
            <xsl:when test="count(document($methodFilePath)/*/*/*/QueryDef) != 0">
              <xsl:apply-templates select="document($methodFilePath)/*/pipeline"/>
            </xsl:when> <!-- there are query def nodes in $methodFilePath -->
            <xsl:otherwise>
              <td>None</td>
              <td>None</td>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
            <xsl:otherwise>
              <td>File Not Found</td>
              <td>File Not Found</td>
            </xsl:otherwise>
      </xsl:choose>

      <xsl:if test="count(document('Artefacts.xml')/*) != 0">
        <xsl:call-template name="processArtefacts">
          <xsl:with-param name="methodPath" select="normalize-space($methodFilePath)"/>
        </xsl:call-template>
      </xsl:if>
      
      <xsl:if test="$methodFilePath != ''">
        <td>
          <xsl:apply-templates select="document($methodFilePath)/comment()"/>
        </td>
      </xsl:if>

  </xsl:template> <!-- match="service" -->


  <!-- Obtain the name of the query def file from the service method file.  
       Then apply a template to the query def file.  -->
  <xsl:template match="pipeline"> <!-- From the service method file -->

    <!-- It is possible for there to be more than one query def file per
         service.  To cope with this, loop over the query defs twice: once
         to print the name out, with a comma after if necessary, then again
         to actually look at the map file. -->

    <td>
    <xsl:for-each select="//QueryDef">

      <!-- Add the full path for the query def file -->
      <xsl:variable name="queryDefFilePath">
        <xsl:value-of select="$srcRoot"/><xsl:value-of select="@location"/>
      </xsl:variable>

      <!-- Extract the file name from the file path -->
      <xsl:variable name="slashPos">
        <xsl:value-of select="fn:lastIndexOf(string($queryDefFilePath), '/')"/>
      </xsl:variable>
      <xsl:variable name="queryDefString">
        <xsl:value-of select="substring(string($queryDefFilePath), $slashPos+2)"/>
      </xsl:variable>

      <xsl:variable name="possiblecomma">
        <xsl:if test="position() != last()">
          <xsl:value-of select="', '"/>
        </xsl:if>
      </xsl:variable>

      <xsl:value-of select="$queryDefString"/><xsl:value-of select="$possiblecomma"/>

    </xsl:for-each> <!-- End of first loop to print query def name -->
    </td>

    <td>
    <xsl:for-each select="//QueryDef">

      <!-- Add the full path for the query def file -->
      <xsl:variable name="queryDefFilePath">
        <xsl:value-of select="$srcRoot"/><xsl:value-of select="@location"/>
      </xsl:variable>

      <xsl:variable name="possiblecomma">
        <xsl:if test="position() != last()">
          <xsl:value-of select="', '"/>
        </xsl:if>
      </xsl:variable>

      <xsl:apply-templates select="document($queryDefFilePath)/QueryDef/DBMapDef"/><xsl:value-of select="$possiblecomma"/>

    </xsl:for-each> <!-- End of second loop to open query def -->
    </td>

  </xsl:template> <!-- match="QueryDef" -->


  <!-- Obtain the name of the map file from the query def file -->
  <xsl:template match="//DBMapDef"> <!-- From the query def file -->

      <!-- Extract the file name from the file path -->
      <xsl:variable name="slashPos">
          <xsl:value-of select="fn:lastIndexOf(string(@location) , '/')"/>
      </xsl:variable>
      <xsl:variable name="mapString">
         <xsl:value-of select="substring(string(@location), $slashPos+2)"/>
      </xsl:variable>
      <xsl:value-of select="$mapString"/>

  </xsl:template> <!-- match="DBMapDef" -->

  <!-- Convert each instance of an upper class letter in a string to lower case
       and precede with an underscore character e.g. getUserAlias becomes
       get_user_alias
       Params: string - the string to parse
               startPos - the position of the first character to parse
  -->
  <xsl:template name="caps-to-underscore-lc">
    <xsl:param name="string"/>
    <xsl:param name="startPos"/>
    
      <xsl:if test="$debug='true'">
        <xsl:message>TEMPLATE:"caps-to-underscore-lc" PARAM:"string"=<xsl:value-of select="$string"/></xsl:message>
      </xsl:if>

      <xsl:variable name = "retVal">
        <xsl:call-template name="loop01">
          <xsl:with-param name="string" select="$string"/>
          <xsl:with-param name="pos" select="$startPos"/>
          <xsl:with-param name="len" select="string-length($string)"/>
        </xsl:call-template>
      </xsl:variable>

      <xsl:value-of select="$retVal"/>
      <xsl:if test="$debug='true'">
        <xsl:message>TEMPLATE:"caps-to-underscore-lc" RETVAL=<xsl:value-of select="$retVal"/></xsl:message>
      </xsl:if>

  </xsl:template> <!-- name="caps-to-underscore-lc" -->


  <!-- To get round the lack of while loops in XSL, this loop is called recursively so
       that each character in the string is parsed
       Params: string - the string to parse
               pos = the position of the character to parse
               len = the length of the string
  -->
  <xsl:template name="loop01">
    <xsl:param name="string"/>
    <xsl:param name="pos"/>
    <xsl:param name="len"/>
    
      <xsl:if test="$debug='true'">
        <xsl:message>TEMPLATE:"loop01" PARAM:"string"=<xsl:value-of select="$string"/></xsl:message>
        <xsl:message>TEMPLATE:"loop01" PARAM:"pos"=<xsl:value-of select="$pos"/></xsl:message>
        <xsl:message>TEMPLATE:"loop01" PARAM:"len"=<xsl:value-of select="$len"/></xsl:message>
      </xsl:if>

      <xsl:if test="$pos &lt; $len+1">
        <xsl:if test="$debug='true'">
          <xsl:message>Char pos <xsl:value-of select="$pos"/> is <xsl:value-of select="substring($string, $pos, 1)"/></xsl:message>
        </xsl:if>

        <!-- Test for capital letter -->
        <xsl:variable name="upperCase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
        <xsl:choose>
          <xsl:when test="contains($upperCase, substring($string, $pos, 1))">
            <xsl:variable name="newStr"><xsl:value-of select="substring($string, 0, $pos)"/>_<xsl:value-of select = "fn:to-lower-case(substring($string, $pos, 1))"/><xsl:value-of select="substring($string, $pos+1, $len)"/>
            </xsl:variable>

            <!-- Call loop recursively with the updated name as the string parameter -->
            <xsl:call-template name="loop01">
              <xsl:with-param name="string" select="$newStr"/>
              <xsl:with-param name="pos" select="$pos+2"/>
              <xsl:with-param name="len" select="string-length($newStr)"/>
            </xsl:call-template>
          </xsl:when> <!-- End when character at current position is upper case -->
          <xsl:otherwise>
            <!-- Call loop recursively with the unchanged name as the string parameter -->
            <xsl:call-template name="loop01">
              <xsl:with-param name="string" select="$string"/>
              <xsl:with-param name="pos" select="$pos+1"/>
              <xsl:with-param name="len" select="string-length($string)"/>
            </xsl:call-template>
          </xsl:otherwise> <!-- End character at current position is lower case -->
        </xsl:choose>
      </xsl:if>

      <!-- Set the value of this template to be the parsed string only if it's
           the last time that the loop is called -->
      <xsl:if test="$pos = $len">
        <xsl:value-of select="$string"/>
        <xsl:if test="$debug='true'">
          <xsl:message>TEMPLATE:"loop01" RETVAL=<xsl:value-of select="$string"/></xsl:message>
        </xsl:if>
      </xsl:if>

  </xsl:template> <!-- name="loop01" -->


  <xsl:template match="comment()">

      <xsl:variable name="descriptionPos">
          <xsl:value-of select="fn:indexOf(string(.) , 'Description')"/>
      </xsl:variable>

      <xsl:if test="$descriptionPos != -1">
        <xsl:value-of select="substring(string(.), $descriptionPos+13)"/>
      </xsl:if>

  </xsl:template>

  <!-- Used to read Artefacts.xml -->
  <xsl:template name="processArtefacts">
    <xsl:param name="methodPath"/>

      <xsl:if test="$debug='processArtefacts'">
        <xsl:message>TEMPLATE:"processArtefacts" PARAM: methodPath=<xsl:value-of select="$methodPath"/></xsl:message>
      </xsl:if>

      <xsl:variable name="artefactsDoc" select="document('Artefacts.xml')"/>

      <!-- Set the value of $methodFilePath based on values from NonCompliantServices.xml -->
      <xsl:for-each select="$artefactsDoc/*/artefact">

        <xsl:variable name="namePath">
           <xsl:value-of select="$srcRoot"/><xsl:value-of select="$casemanExt"/><xsl:value-of select="name"/>
        </xsl:variable>

        <xsl:if test="fn:to-lower-case(string($namePath)) = fn:to-lower-case($methodPath)">
          <td><xsl:value-of select="author"/></td>
          <!--td><xsl:value-of select="description"/></td-->
        </xsl:if>
      </xsl:for-each>

  </xsl:template> <!-- name="processArtefacts" -->

</xsl:stylesheet>



