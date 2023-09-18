#!/usr/bin/env bash
wd=`pwd`
project=accountv

mkdir -pv /opt/soft/${project}/

cd /opt/soft

tar zcvf ${project}.tar.gz ${project}
mv -f ${project}.tar.gz /data/temp

cd $wd
rm -rf /opt/soft/${project}/*

cp -r ./* /opt/soft/${project}/

rm -rf /opt/soft/${project}/install.sh