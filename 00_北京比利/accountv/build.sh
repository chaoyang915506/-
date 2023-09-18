#!/usr/bin/env bash
wd=$(pwd)
name=`cat package.json | jq '.name' | sed 's/\"//g'`
version=v`cat package.json | jq '.version' | sed 's/\"//g'`
pAndv=${name}-${version}
commitId=`git rev-parse --short HEAD`

yarn install

rm -rf build

envs="test stable demo"
if [ $# != 0 ];then
    envs=$@
fi
for env in $envs
do
    target=${wd}/target/${env}
    if [ -d ${target} ]
    then
        rm -rf ${target}
    fi
    mkdir -pv ${target}/${pAndv}

    yarn run build:${env}

    cp -r ${wd}/dist/* ${target}/${pAndv}
    cp ${wd}/install.sh ${target}/${pAndv}

    README=${target}/${pAndv}/README.md
    echo 项目: ${pAndv} > ${README}
    echo GIT: ${commitId} >> ${README}
    echo 打包日期: $(date) >> ${README}

    mkdir -pv ${wd}/build/${env}

    cd ${target}
    zip -r ${wd}/build/${env}/${pAndv}-${env}.zip ${pAndv}
    cd ${wd}
done

rm -rf target

$wd/ftp-push.sh
