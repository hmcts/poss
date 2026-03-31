#######################################################################################
# File               : move_files.sh                                                  #
# Desc               : ftp files used by ccbc_load_customer_media_data PL circuit     #
# Product history                                                            	      #
# Date      Ver   Who   Desc                                                          #
# ----      ---   ---   ----                                                          #
# 15/06/06  1.0   WK    New File					              #
# 										      #
#######################################################################################
if [ "$1" = "pass" ]
then
ftp   -ni $4 >/dev/null 2>&1   << endftp
user $5 $6
rename $2/$3  $7/$3
endftp
else
ftp   -ni $4   >/dev/null 2>&1    << endftp
user $5 $6
rename $2/$3 $8/$3
endftp
fi
