<template>
  <div class="cardcontainer">
    <div class="cardtitle">
      <b>*中文</b>
    </div>
    <div class="cardbody">
      <el-row>
        <el-col :span="4">视频描述</el-col>
        <el-col :span="16">
          <el-input :rows="4" type="textarea"></el-input>
        </el-col>
      </el-row>

      <!-- <h4>Coolioo版式</h4>
      <el-row>
        <el-col :span="4">起播图</el-col>
        <el-col :span="20">
          <el-upload>
            <el-button>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*PNG、JPG/JPGE格式，1920 <b>X</b> 1080，不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>

      <h4>九宫格版式</h4>
      <el-row>
        <el-col :span="4">九宫格图标</el-col>
        <el-col :span="20">
          <el-upload>
            <el-button>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*PNG、JPG/JPEG格式，384 <b>X</b> 344，不超过100kb</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">背景海报</el-col>
        <el-col :span="20">
          <el-upload>
            <el-button>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*PNG、JPG/JPGE格式，1920 <b>X</b> 1080，不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row>

      <h4>横版电影版式</h4>
      <el-row>
        <el-col :span="4">小图标</el-col>
        <el-col :span="20">
          <el-upload>
            <el-button>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*PNG、JPG/JPEG格式，280 <b>X</b> 168，不超过100kb</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">背景海报</el-col>
        <el-col :span="20">
          <el-upload>
            <el-button>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*PNG、JPG/JPGE格式，1920 <b>X</b> 1080，不超过500kb</div>
          </el-upload>
        </el-col>
      </el-row> -->


    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageCard"
};
</script>

<style scoped lang="scss">
.cardcontainer {
  width: 560px;
  // height: 770px;
  height: 260px;
  margin-top: 40px;
  margin-right: 30px;
  background-color: #FFFFFF;
  overflow: hidden;
}
.cardtitle {
  width: 100%;
  height: 36px;
  line-height: 36px;
  
}
.cardbody {
  width: 540px;
//   height: 100%;
  background-color: #f7f9fc;
  padding: 30px 10px 30px 10px;
}
h4 {
  border-bottom: solid 1px #e6e9f0;
  padding-bottom: 15px;
}
.el-row {
    margin-top: 10px;
}
</style>
