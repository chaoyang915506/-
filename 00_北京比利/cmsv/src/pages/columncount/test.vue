<template>
  <div>

    <!-- 栏目ID -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">栏目ID</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.itemId"
            disabled
            class="form-control forbid"
            id="focusedInput"
            type="text"
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 control-label col-md-4 ">Item Id</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            disabled
            v-model="form.itemId1"
            class="form-control forbid"
            id="focusedInput"
            type="text"
          >
        </div>
      </div>
    </div>
    <!-- 内容名称 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">内容名称</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miName"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="请输入内容名称(必填)"
            required
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">Content Name</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miName1"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="Please input content name(Required)"
            required
          >
        </div>
      </div>
    </div>
    <!-- 媒咨内容类型 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">媒咨内容类型</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miType"
          >
            <option
              selected
              disabled
              value=""
            >请选媒咨内容类型(必选)</option>
            <option value="0">图片</option>
            <option value="1">视频</option>
            <option value="2">图片+视频</option>
          </select>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 control-label col-md-4 ">Content Type</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miType1"
          >
            <option
              selected
              disabled
              value=""
            >Please select a type(Required)</option>
            <option value="0">picture</option>
            <option value="1">video</option>
            <option value="2">picture+video</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 内容排序 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">内容排序</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            class="form-control"
            id="focusedInput"
            type="text"
            v-model="form.sort"
            placeholder="请输入排序值"
            required
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">Content Sort</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            class="form-control"
            id="focusedInput"
            type="text"
            v-model="form.sort1"
            placeholder="Please input sort value"
            required
          >
        </div>
      </div>
    </div>
    <!-- 视频文件类型 -->
    <div class="form-inline row m-3">
      <div
        class="form-group col-lg-6 col-md-6"
        v-show="form.miType!=='0'"
      >
        <label class="col-lg-4 col-md-4  control-label">视频文件类型</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miVideoType"
          >
            <option
              disabled
              selected
              value=""
            >请选择视频文件类型</option>
            <option value="0">电影</option>
            <option value="1">电视剧</option>
            <option value="2">短视频</option>
            <option value="3">预告片</option>
            <option value="4">花絮</option>
            <option value="5">其他</option>
          </select>
        </div>
      </div>
      <!-- 英文 -->
      <div
        class="form-group col-lg-6 col-md-6"
        v-show="form.miType1!=='0'"
      >
        <label class="col-lg-4 control-label col-md-4 ">Video File Type</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miVideoType1"
          >
            <option
              disabled
              selected
              value=""
            >Please select a video file type</option>
            <option value="0">movie</option>
            <option value="1">TV play</option>
            <option value="2">A short video</option>
            <option value="3">prevue</option>
            <option value="4">feature</option>
            <option value="5">other</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 影片分类 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">影片分类</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miMovieType"
          >
            <option
              disabled
              selected
              value=""
            >请选择影片分类</option>
            <option value="0">爱情</option>
            <option value="1">动作</option>
            <option value="2">犯罪</option>
            <option value="3">剧情</option>
            <option value="4">记录</option>
            <option value="5">其他</option>
          </select>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 control-label col-md-4 ">Film Classification</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miMovieType1"
          >
            <option
              disabled
              selected
              value=""
            >Please select the film classification</option>
            <option value="0">love</option>
            <option value="1">action</option>
            <option value="2">crime</option>
            <option value="3">plot</option>
            <option value="4">record</option>
            <option value="5">other</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 是否缺省数据 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">是否缺省数据</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miDefault"
          >
            <option
              value="0"
              selected
            >否</option>
            <option value="1">是</option>
          </select>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 control-label col-md-4 ">Is Default Data</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miDefault1"
          >
            <option
              value="0"
              selected
            >No</option>
            <option value="1">Is</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 状态 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">状态</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miStatus"
          >
            <option
              value="0"
              selected
            >待审核</option>
            <option value="1">上线</option>
            <option value="2">下线</option>
          </select>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 control-label col-md-4 ">Status</label>
        <div class="col-lg-8 col-md-8 ">
          <select
            class="form-control"
            v-model="form.miStatus1"
          >
            <option
              value="0"
              selected
            >To audit</option>
            <option value="1">Online</option>
            <option value="2">Offline</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 国家地区 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">国家地区</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            class="form-control"
            id="focusedInput"
            type="text"
            v-model="form.miArea"
            placeholder="输入国家地区"
            required
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">Countries Regions</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            class="form-control"
            id="focusedInput"
            type="text"
            v-model="form.miArea1"
            placeholder="Please enter the countries and regions"
            required
          >
        </div>
      </div>
    </div>
    <!-- 出票机构 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">出票机构</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miCompany"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="请输入出票机构"
            required
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">Ticket Agency</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miCompany"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="Please enter the ticket agency"
            required
          >
        </div>
      </div>
    </div>
    <!-- 出品年代 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">出品年代</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miYear"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="请输入出品年代"
            required
          >
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  control-label">Produce Time</label>
        <div class="col-lg-8 col-md-8 ">
          <input
            v-model="form.miYear1"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="Please enter the produce time"
            required
          >
        </div>
      </div>
    </div>

    <!-- 是否启用 中英文不联动 -->
    <!-- <div class="form-inline row m-3">
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  control-label">是否启用</label>
              <div class="col-lg-8 col-md-8 ">
                <div class="form-check-inline col-sm-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="1"
                    checked
                  >
                  <label
                    class="form-check-label"
                    for="inlineRadio1"
                  >启用</label>
                </div>
                <div class="form-check-inline col-sm-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="2"
                  >
                  <label
                    class="form-check-label"
                    for="inlineRadio2"
                  >禁用</label>
                </div>
              </div>
            </div>
             英文 
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  control-label">Enable</label>
              <div class="col-lg-8 col-md-8 ">
                <div class="form-check-inline col-sm-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="11"
                    checked
                  >
                  <label
                    class="form-check-label"
                    for="inlineRadio1"
                  >Enable</label>
                </div>
                <div class="form-check-inline col-sm-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="22"
                  >
                  <label
                    class="form-check-label"
                    for="inlineRadio2"
                  >DisEnable</label>
                </div>
              </div>
            </div>
          </div> -->
    <!-- 栏目描述 -->
    <!-- <div class="form-inline row m-3">
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  ">栏目描述</label>
              <div class="col-lg-8 col-md-8 ">
                <textarea
                  placeholder="请出入栏目描述信息(可选)"
                  class="form-control"
                  rows="5"
                  cols="25"
                >
               </textarea>
              </div>
            </div>
            <!-- 英文 
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  control-label">Description</label>
              <div class="col-lg-8 col-md-8 ">
                <textarea
                  placeholder="please input description value (choosable)"
                  class="form-control"
                  rows="5"
                  cols="25"
                >
               </textarea>
              </div>
            </div>
          </div> -->
    <!-- 栏目内容图片A -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容图片A</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage"
            :uploadUrl="miImageA"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content ImagesA</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            v-model="form.miImageEn"
            style="width:75%"
            fileType="image"
            :uploadUrl="miImageAen"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <!-- 栏目内容图片B -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容图片B</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage1"
            :uploadUrl="miImageB"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content ImagesB</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage1En"
            :uploadUrl="miImageBen"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <!-- <div class="form-inline row m-3">
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  ">栏目内容图片B</label>
              <div class="col-lg-8 col-md-8 ">
                <div
                  style="width:75%"
                  class="input-group"
                >
                  <input
                    type="text"
                    class="form-control"
                  >
                  <div class="input-group-btn input-group-append">
                    <button class="btn btn-primary">
                      <i class="glyphicon glyphicon-folder-open"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6 col-md-6 ">
              <label class="col-lg-4 col-md-4  ">Item Content ImagesB</label>
              <div class="col-lg-8 col-md-8 ">
                <div
                  style="width:75%"
                  class="input-group"
                >
                  <input
                    type="text"
                    class="form-control"
                  >
                  <div class="input-group-btn input-group-append">
                    <button class="btn btn-primary">
                      <i class="glyphicon glyphicon-folder-open"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
    <!-- 栏目内容图片C -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容图片C</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage2"
            :uploadUrl="miImageC"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content ImagesC</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage2En"
            :uploadUrl="miImageCen"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <!-- 栏目内容图片D -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容图片D</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage3"
            :uploadUrl="miImageD"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content ImagesD</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage3En"
            :uploadUrl="miImageDen"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <!-- 栏目内容图片E -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容图片E</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage4"
            :uploadUrl="miImageE"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content ImagesE</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.miImage4En"
            :uploadUrl="miImageEen"
            fileType="image"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <!-- 栏目内容视频 -->
    <div class="form-inline row m-3">
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">栏目内容视频</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.videoPlayUrl"
            :uploadUrl="videoUrl"
            fileType="video"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
      <!-- 英文 -->
      <div class="form-group col-lg-6 col-md-6 ">
        <label class="col-lg-4 col-md-4  ">Item Content Video</label>
        <div class="col-lg-8 col-md-8 ">
          <cool-file-input
            style="width:75%"
            v-model="form.videoPlayUrlEn"
            :uploadUrl="videoUrlen"
            fileType="video"
            :extensions="extensions"
          ></cool-file-input>
        </div>
      </div>
    </div>
    <div class="form-inline row m-12">

      <div class="form-group col-lg-9 col-md-9 "></div>
      <div class="form-group col-lg-3 col-md-3">
        <button
          style="margin-left:23%"
          type="submit"
          class="btn btn-primary mr-1"
        >确定</button>
        <button
          class="btn btn-primary"
          @click="count='home'"
        >返回</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>