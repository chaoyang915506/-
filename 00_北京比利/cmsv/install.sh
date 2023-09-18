#!/usr/bin/env bash
wd=`pwd`

mkdir -pv /opt/soft/cmsv/

cd /opt/soft

tar zcvf cmsv.tar.gz cmsv
mv -f cmsv.tar.gz /data/temp

cd $wd
rm -rf /opt/soft/cmsv/*

cp -r ./* /opt/soft/cmsv/

rm -rf /opt/soft/cmsv/install.sh