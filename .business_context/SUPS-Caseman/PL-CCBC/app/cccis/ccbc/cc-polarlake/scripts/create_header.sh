hdrfilename=`date '+N%d%m%y.H'`
datfilename=`date '+N%d%m%y'`

mv data $datfilename
recno=`cat $datfilename | wc -l`
date "+`echo $recno | awk '{ printf "%-10s", $0 }'`%d%m%y" > $hdrfilename


