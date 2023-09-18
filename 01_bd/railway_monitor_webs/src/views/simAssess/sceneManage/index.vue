<template>
	<div class="fz-container">
		<el-row :gutter="10" class="mb8">
			<el-col :span="20">
				<el-form
					:model="queryParams"
					ref="queryRef"
					:inline="true"
					label-width="68px"
				>
					<!-- <el-form-item prop="searchType">
						<el-select
							v-model="searchType"
							placeholder="请选择搜索类型"
							size="small"
							@change="handleSelect"
						>
							<el-option
								v-for="(item, index) in searchTypeOpt"
								:key="index"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item> -->
					<!-- <el-form-item
						prop="monitoringPointGrade"
						v-if="searchType == 'monitoringPointGrade'"
					>
						<el-select
							v-model="queryParams.monitoringPointGrade"
							placeholder="请选择监测点等级"
							clearable
							size="small"
						>
							<el-option
								v-for="dict in formatter(monitoring_point_grade)"
								:key="dict.value"
								:label="dict.label"
								:value="dict.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item prop="addTime" v-if="searchType == 'addTime'">
						<el-date-picker
							v-model="timePicker"
							type="datetimerange"
							@change="getDate"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 350px"
							size="small"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						/>
					</el-form-item> -->
					<el-form-item>
						<el-input
							v-model="queryParams.simulationName"
							placeholder="请输入名称"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							plain
							round
							class="common_style"
							icon="Search"
							@click="handleQuery"
							>搜索</el-button
						>
						<el-button
							icon="Refresh"
							type="primary"
							plain
							round
							class="common_style"
							@click="resetQuery"
							>重置</el-button
						>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					round
					class="common_style"
					icon="Delete"
					@click="handleDelete"
					v-hasPermi="['system:config:remove']"
					>删除</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					round
					class="common_style"
					icon="Plus"
					@click="handleAdd"
					v-hasPermi="['system:config:add']"
				>
					新增仿真</el-button
				>
			</el-col>
		</el-row>
		<!-- 表格数据 -->
		<el-table
			v-loading="loading"
			:data="tableData"
			style="width: 100%"
			@selection-change="handleSelectionChange"
		>
			{{ tableData }}
			<el-table-column type="selection" width="55" />
			<el-table-column type="index" label="序号" width="55" align="center" />
			<el-table-column
				prop="simulationName"
				align="center"
				label="仿真名称"
			></el-table-column>
			<el-table-column
				prop="combinationTime"
				label="组合算法运行总耗时"
				align="center"
			/>

			<!-- <el-table-column
				prop="relativeHumidity"
				label="采用应急预案"
				align="center"
			/> -->
			<el-table-column
				prop="synRisk"
				label="情景综合风险值"
				align="center"
			/>
			<el-table-column
				prop="simulationDescribe"
				label="情景仿真描述"
				align="center"
			/>
			<el-table-column
				label="操作"
				align="center"
				width="150"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-button
						size="mini"
						type="text"
						icon="View"
						@click="handleCheck(scope.row)"
						>查看</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
		<!-- 添加 -->
		<el-dialog :title="title" v-model="open" width="76%" @close="addSceneCloce">
			<template #default>
				<div class="my-tab-class">
					<div
						:class="activeIndex == 1 ? 'Manuals' : ''"
						class="Manual"
						@click="handleTabClick(1)"
					>
						手动配置
					</div>
					<div
						:class="activeIndex == 2 ? 'Manuals' : 'Manual'"
						class="Manual"
						@click="handleTabClick(2)"
						style="margin-left: 20px"
					>
						情景导入
					</div>
				</div>
				<!-- 图片列表 -->
				<imgList
					v-if="isShowImgList"
					@changePicId="changePicId"
					:picList="picList"
				></imgList>

				<!-- 内容 -->
				<el-form
					ref="formRef"
					:model="form"
					:rules="rules"
					label-width="120px"
					v-if="!isShowImgList"
				>
					<div class="content-dialog">
						<div class="left-content">
							<el-row>
								<el-col :span="20">
									<el-form-item label="仿真名称" prop="simulationName">
										<el-input
											v-model="data.modelParams.simulationName"
											placeholder="请输入仿真名称"
										></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="20">
									<el-form-item
										label="模型绑定监测点"
										class="my-defined-form-label"
									>
										<el-select
											style="width: 100%"
											v-model="data.modelParams.monitorId"
											placeholder="请选择监测点"
											clearable
										>
											<el-option
												v-for="dict in data.modelMonitorList"
												:key="dict.id"
												:label="dict.monitoringPointName"
												:value="dict.id"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-divider content-position="left" class="defined-divider"
								>选择图片</el-divider
							>
							<div style="text-align: center">
								<el-radio-group v-model="picRadio" v-if="activeIndex == 1">
									<el-radio :label="3" style="color: #cfcfcf">情景库</el-radio>
									<el-radio style="margin-left: 60px; color: #cfcfcf" :label="6"
										>组态库</el-radio
									>
								</el-radio-group>
								<!-- 情景库                      -->
								<div
									style="
										width: 300px;
										height: 120px;
										margin: 10px auto;
										position: relative;
									"
									v-show="picRadio == 3 || activeIndex == 2"
									@click="handleClickImg()"
								>
									<el-image
										style="width: 100%; height: 100%"
										:src="qj_library[0].image"
										fit="fill"
										:lazy="true"
									>
									</el-image>
									<span class="masking">{{ "请选择情景" }}</span>
								</div>
								<!-- 组态库                      -->
								<div
									style="width: 100%; height: 120px; display: flex"
									v-show="picRadio == 6 && activeIndex != 2"
								>
									<div
										class="library"
										style="width: 100%; height: 100%; margin: 0 5px"
										v-for="(item, index) in zt_library"
										:key="index"
										@click="handleClickImg(index)"
									>
										<el-image
											style="width: 100%; height: 100%"
											:src="item.image"
											fit="fill"
											:lazy="true"
										>
										</el-image>
										<span class="masking" v-if="!item.image">{{
											index == 1
												? "请选择异物库"
												: index == 2
												? "请选择场景库"
												: "请选择环境库"
										}}</span>
									</div>
								</div>
							</div>
							<el-divider content-position="left" class="defined-divider"
								>选择策略组件</el-divider
							>
							<div style="text-align: center">
								<el-radio-group v-model="strategyRadio">
									<el-radio :label="1" style="color: #cfcfcf">模型库</el-radio>
									<el-radio style="margin-left: 60px; color: #cfcfcf" :label="2"
										>策略库</el-radio
									>
								</el-radio-group>
							</div>
							<!-- 模型库                      -->
							<el-form-item
								v-for="(item, i) in data.modelParams.imageEnhanceId"
								:key="i"
								v-show="strategyRadio == 1"
								:label="`图像增强模型 ` + (i == 0 ? '' : i + 1)"
								:prop="'imageEnhanceId.' + i"
								:rules="[
									{
										required: true,
										message: '请选择图像增强模型',
										trigger: 'change',
									},
								]"
							>
								<el-select
									v-model="data.modelParams.imageEnhanceId[i]"
									style="width: 70%; margin-right: 10px"
									:disabled="isCheck"
								>
									<el-option
										v-for="item in getModelValue('图像增强模型')"
										:key="item.id"
										:label="item.modelName"
										:value="item.id"
									/>
								</el-select>
								<el-button
									circle
									icon="Plus"
									@click="
										addList(
											'imageEnhanceId',
											getModelValue('图像增强模型').length,
											data.modelParams.imageEnhanceId.length
										)
									"
								></el-button>
								<el-button
									circle
									icon="SemiSelect"
									@click="subList('imageEnhanceId', i)"
									v-if="i > 0"
								></el-button>
							</el-form-item>
							<el-form-item
								v-for="(item, i) in data.modelParams.sceneAnalysisId"
								:key="i"
								:prop="'sceneAnalysisId.' + i"
								:rules="[
									{
										required: true,
										message: '请选择场景识别模型',
										trigger: 'change',
									},
								]"
								:label="`场景识别模型 ` + (i == 0 ? '' : i + 1)"
								v-show="strategyRadio == 1"
							>
								<el-select
									v-model="data.modelParams.sceneAnalysisId[i]"
									style="width: 70%; margin-right: 10px"
									:disabled="isCheck"
								>
									<el-option
										v-for="item in getModelValue('场景识别')"
										:key="item.id"
										:label="item.modelName"
										:value="item.id"
									/>
								</el-select>
								<!-- <el-button
									circle
									icon="Plus"
									@click="
										addList(
											'sceneAnalysisId',
											getModelValue('场景识别').length,
											data.modelParams.sceneAnalysisId.length
										)
									"
								></el-button> -->
								<!-- <el-button
									circle
									icon="SemiSelect"
									@click="subList('sceneAnalysisId', i)"
									v-if="i > 0"
								></el-button> -->
							</el-form-item>
							<el-form-item
								v-for="(item, i) in data.modelParams.sceneDivisionId"
								:key="i"
								:prop="'sceneDivisionId.' + i"
								:rules="[
									{
										required: true,
										message: '请选择场景分割模型',
										trigger: 'change',
									},
								]"
								:label="`场景分割模型 ` + (i == 0 ? '' : i + 1)"
								v-show="strategyRadio == 1"
							>
								<el-select
									v-model="data.modelParams.sceneDivisionId[i]"
									style="width: 70%; margin-right: 10px"
								>
									<el-option
										v-for="item in getModelValue('场景分割')"
										:key="item.id"
										:label="item.modelName"
										:value="item.id"
									/>
								</el-select>
								<!-- <el-button
									circle
									icon="Plus"
									@click="
										addList(
											'sceneDivisionId',
											getModelValue('场景分割').length,
											data.modelParams.sceneDivisionId.length
										)
									"
								></el-button> -->
								<!-- <el-button
									circle
									icon="SemiSelect"
									@click="subList('sceneDivisionId', i)"
									v-if="i > 0"
								></el-button> -->
							</el-form-item>
							<el-form-item
								v-for="(item, i) in data.modelParams.materialQualityId"
								:key="i"
								:prop="'materialQualityId.' + i"
								:rules="[
									{
										required: true,
										message: '请选择材质识别模型',
										trigger: 'change',
									},
								]"
								:label="`材质识别模型 ` + (i == 0 ? '' : i + 1)"
								v-show="strategyRadio == 1"
							>
								<el-select
									v-model="data.modelParams.materialQualityId[i]"
									style="width: 70%; margin-right: 10px"
								>
									<el-option
										v-for="item in getModelValue('材质识别')"
										:key="item.id"
										:label="item.modelName"
										:value="item.id"
									/>
								</el-select>
								<!-- <el-button
									circle
									icon="Plus"
									@click="
										addList(
											'materialQualityId',
											getModelValue('材质识别').length,
											data.modelParams.materialQualityId.length
										)
									"
								></el-button>
								<el-button
									circle
									icon="SemiSelect"
									@click="subList('materialQualityId', i)"
									v-if="i > 0"
								></el-button> -->
							</el-form-item>
							<!-- 策略库                      -->
							<el-row v-show="strategyRadio == 2">
								<el-col :span="20">
									<el-form-item label="策略库">
										<el-select
											style="width: 100%"
											v-model="data.modelParams.policyId"
											placeholder="请选择策略库"
											clearable
											size="small"
										>
											<el-option
												v-for="dict in data.strategyList"
												:key="dict.id"
												:label="dict.policyName"
												:value="dict.id"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-divider content-position="left" class="defined-divider"
								>选择图片</el-divider
							>
							<el-form-item label="添加图片">
								<el-upload
									class="upload-demo"
									:auto-upload="false"
									:on-change="imageHandleChange"
									:on-remove="imageHandleRemove"
									:file-list="imageFileList"
									list-type="picture"
								>
									<el-button size="small" icon="Upload" type="primary"
										>上传图片</el-button
									>
								</el-upload>
							</el-form-item>
							<div style="text-align: center; margin-top: 20px">
								<el-button
									size="small"
									type="primary"
									style="width: 80px"
									@click="modelInfo"
									>确 定</el-button
								>
							</div>
						</div>
						<div class="right-content">
							<div class="content-right-class">
								<div class="img1">
									<el-image
										style="width: 100%; height: 100%"
										:src="form.beforeImage"
										fit="fill"
										:lazy="true"
									>
									</el-image>
								</div>
								<div class="img2" style="position: relative">
									<div
										style="
											background: rgba(255, 255, 255, 0.4);
											position: absolute;
											width: 100%;
											height: 100%;
											z-index: 10;
										"
										v-if="form.enhanceImage"
									></div>
									{{}}
									<el-image
										style="width: 100%; height: 100%"
										:src="form.enhanceImage"
										fit="fill"
										:lazy="true"
									></el-image>
								</div>
							</div>
							<p style="text-align: center">前后对比图</p>
							<el-row>
								<!-- <el-col :span="12">
									<el-form-item
										label="单个算法运行耗时"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.singleTime
												? data.ariResult.singleTime
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col> -->
								<el-col :span="12">
									<el-form-item
										label="组合算法运行总耗时"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.combinationTime
												? data.ariResult.combinationTime
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<!-- <el-col :span="12">
									<el-form-item
										label="情景风险真值"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.synRisk
												? data.ariResult.synRisk
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item
										label="情景仿真描述"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.simulationDescribe
												? data.ariResult.simulationDescribe
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col> -->
								<el-col :span="12">
									<el-form-item
										label="气象风险值"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.weatherRisk
												? data.ariResult.weatherRisk
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item
										label="地质风险值"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.geologyRisk
												? data.ariResult.geologyRisk
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item
										label="异物风险值"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.formattRisk
												? data.ariResult.formattRisk
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item
										label="情景综合风险值"
										class="my-defined-form-label defined-form-label-font"
										label-width="140px"
									>
										<span>{{
											data.ariResult.synRisk
												? data.ariResult.synRisk
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="defined-row-class">
								<el-col :span="4">
									<el-form-item
										label="图像增强算法"
										class="my-defined-form-label"
									></el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="结构相似度"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.ssim ? data.ariResult.ssim : "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="峰值信噪比"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.psnr ? data.ariResult.psnr : "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="耗时"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.imageTime
												? data.ariResult.imageTime
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="defined-row-class">
								<el-col :span="4">
									<el-form-item
										label="场景分类算法"
										class="my-defined-form-label"
									>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="名称"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.sceneName
												? data.ariResult.sceneName
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="概率"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.clsProb
												? data.ariResult.clsProb
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										label-width="80px"
										label="耗时"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.sceneTime
												? data.ariResult.sceneTime
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="defined-row-class">
								<el-col :span="4">
									<el-form-item
										label="异物识别算法"
										class="my-defined-form-label"
									></el-form-item>
								</el-col>
								<el-col :span="20">
									<el-form-item
										label-width="80px"
										label="耗时"
										class="my-defined-form-label defined-form-label-font"
									>
										<span>{{
											data.ariResult.foreignTime
												? data.ariResult.foreignTime
												: "暂无数据"
										}}</span>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item
										label="模型组合方法"
										class="my-defined-form-label"
									>
										<el-button
											size="small"
											type="primary"
											@click="addStrategyHandel"
											>添加至策略库</el-button
										>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<!-- <el-divider content-position="left" class="defined-divider"
								>选择评价组件</el-divider
							> -->
								<el-col :span="24">
									<el-form-item label="评价组件" class="my-defined-form-label">
										<el-select
											style="width: 100%"
											v-model="sceneQueryParams.evaluationId"
											placeholder="请选择评价组件"
											clearable
											size="small"
										>
											<el-option
												v-for="dict in evaluationList"
												:key="dict.id"
												:label="dict.evaluationName"
												:value="dict.id"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item
										label="选择应急预案"
										class="my-defined-form-label"
									>
										<el-select
											style="width: 100%"
											v-model="sceneQueryParams.planId"
											placeholder="请选择选择应急预案"
											clearable
											size="small"
										>
											<el-option
												v-for="dict in planList"
												:key="dict.id"
												:label="dict.planName"
												:value="dict.id"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item
										label="情景组合评价"
										class="my-defined-form-label"
									>
										<el-input
											v-model="sceneQueryParams.scenarioEvaluation"
											placeholder="请输入情景组合评价"
										></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item
										label="算法运行评价"
										class="my-defined-form-label"
									>
										<el-input
											v-model="sceneQueryParams.algorithmEvaluation"
											placeholder="请输入算法运行评价"
										></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="描述" class="my-defined-form-label">
										<el-input
											v-model="sceneQueryParams.simulationDescribe"
											type="textarea"
											style="width: 100%"
											:autosize="{ minRows: 4 }"
										></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<div style="text-align: center">
								<el-button
									size="small"
									type="primary"
									@click="saveInfo('保存情景')"
									>保存情景</el-button
								>
							</div>
						</div>
					</div>
				</el-form>
				<el-dialog
					title="新增策略"
					v-model="strategy_open"
					width="35%"
					append-to-body
				>
					<el-form ref="formRef" :model="strategyParams" label-width="110px">
						<el-form-item label="策略库名称">
							<el-input
								v-model="strategyParams.policyName"
								placeholder="请输入路线名称"
							/>
						</el-form-item>
						<el-form-item label="策略库编号">
							<el-input
								v-model="strategyParams.policyCode"
								placeholder="请输入策略库编号"
							/>
						</el-form-item>
						<el-form-item label="策略库描述">
							<el-input
								v-model="strategyParams.algDescribe"
								placeholder="请输入策略库描述"
							/>
						</el-form-item>
					</el-form>
					<template #footer>
						<div class="dialog-footer">
							<el-button type="primary" @click="strategyHandel"
								>确 定</el-button
							>
							<el-button @click="strategyCatch">取 消</el-button>
						</div>
					</template>
				</el-dialog>
			</template>
			<template #footer>
				<div class="dialog-footer" v-if="isShowImgList">
					<el-button type="primary" @click="confirm">确 定</el-button>
					<el-button @click="isShowImgList = false">取 消</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 详情 -->
		<el-dialog title="详情" v-model="detailsOpen" width="35%" append-to-body>
			<el-form ref="formRef" :model="detailList" label-width="150px">
				<el-form-item label="仿真名称">
					<span class="detail_style">{{ detailList.simulationName }}</span>
				</el-form-item>
				<!-- <el-form-item label="单个算法运行耗时">
					<span class="detail_style">{{ detailList.singleTime }}</span>
				</el-form-item> -->
				<el-form-item label="组合算法运行总耗时">
					<span class="detail_style">{{ detailList.combinationTime }}</span>
				</el-form-item>
				<el-form-item label="情景风险真值">
					<span class="detail_style">{{ detailList.synRisk }}</span>
				</el-form-item>
				<el-form-item label="情景仿真描述">
					<span class="detail_style">{{ detailList.simulationDescribe }}</span>
				</el-form-item>
				<el-form-item label="气象风险值">
					<span class="detail_style">{{ detailList.weatherRisk }}</span>
				</el-form-item>
				<el-form-item label="异物风险值">
					<span class="detail_style">{{ detailList.formattRisk }}</span>
				</el-form-item>
				<el-form-item label="地质风险值">
					<span class="detail_style">{{ detailList.geologyRisk }}</span>
				</el-form-item>
				<!-- <el-form-item label="情景综合风险值">
					<span class="detail_style">{{ detailList.synRisk }}</span>
				</el-form-item> -->
				<el-form-item label="峰值信噪比">
					<span class="detail_style">{{ detailList.psnr }}</span>
				</el-form-item>
				<el-form-item label="检出率">
					<span class="detail_style">{{ detailList.detectionRate }}</span>
				</el-form-item>
				<el-form-item label="结构相似度">
					<span class="detail_style">{{ detailList.ssim }}</span>
				</el-form-item>
				<!-- <el-form-item label="分类准确度">
					<span class="detail_style">{{ detailList.accuracy }}</span>
				</el-form-item>
				<el-form-item label="识别准确度">
					<span class="detail_style">{{ detailList.acc }}</span>
				</el-form-item> -->
			</el-form>
		</el-dialog>
	</div>
</template>
<script setup>
import { getModel } from "@/api/simulation/compManage/strategy/PolicyLibrary.js";
import {
	getSce,
	getPicList,
	addPic,
	getMonitor,
	getPolicyLibrary,
	getEvaluationList,
	getContingencyPlanList,
	deleteSce,
	updateSce,
	addPolicy,
	getSceById,
} from "@/api/simulation/sceneManage/index.js";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import imgList from "./imgList.vue";
const { proxy } = getCurrentInstance();
const picRadio = ref(3); //策略组件选择
const strategyRadio = ref(1); //策略组件选择
const tableData = ref([]);
let activeIndex = ref(1);
let deleteScene = ref(null); //删除
let isShowImgList = ref(false);
const open = ref(false);
let detailsOpen = ref(false);
const planList = ref([]);
const evaluationList = ref([]);
const strategy_open = ref(false);
const innerVisible = ref(false);
const isCheck = ref(false);
const loading = ref(true);
const total = ref(0);
const title = ref("");
let zt_library = ref([{ image: null }, { image: null }, { image: null }]); //组态
let qj_library = ref([{ image: null }]);
let selectPic = ref({});
const { monitoring_point_grade } = proxy.useDict("monitoring_point_grade");
// const searchTypeOpt = ref([
// 	{
// 		label: "按添加时间",
// 		value: "addTime",
// 	},
// 	{
// 		label: "按成功率",
// 		value: "monitoringPointGrade",
// 	},
// 	{
// 		label: "按名称",
// 		value: "monitoringPointName",
// 	},
// ]);
const data = reactive({
	form: {
		radio: 3,
	},
	detailList: [],
	modelMonitorList: [], //监测点模型列表
	strategyList: [], //策略库
	// 算法模型后的结果
	modelParams: {
		imageEnhanceId: [null],
		sceneAnalysisId: [null],
		sceneDivisionId: [null],
		materialQualityId: [null],
	},
	imageFileList: [],
	ariResult: {},
	modalList: [],
	searchType: "monitoringPointGrade",
	queryParams: {
		pageNum: 1,
		pageSize: 10,
	},
	sceneQueryParams: {},
	strategyParams: {}, //策略字段
	rules: {
		simulationName: [
			{ required: true, message: "请输入仿真名称", trigger: "blur" },
		],
	},
});
const {
	queryParams,
	searchType,
	form,
	rules,
	sceneQueryParams,
	strategyParams,
	detailList,
} = toRefs(data);
const picList = ref([]);
onMounted(() => {
	getList();
	getModelData();
});
const handleTabClick = (val) => {
	activeIndex.value = val;
	isShowImgList.value = false;
};
function getModelData() {
	// 新增所需字段
	getModel().then((res) => {
		if (res.code === 200) {
			data.modalList = res.rows;
		}
	});
	getMonitor().then((res) => {
		data.modelMonitorList = res.rows;
	});
	getPolicyLibrary().then((res) => {
		data.strategyList = res.rows;
	});
	// 获取评价组件列表
	getEvaluationList().then((res) => {
		evaluationList.value = res.rows;
	});
	// 获取应急预案列表
	getContingencyPlanList().then((res) => {
		planList.value = res.rows;
	});
}
let clickLibrary = ref(null);
// 点击图片
function handleClickImg(item) {
	clickLibrary.value = item;
	if (picRadio.value == 3) {
		getPicList({ pageNum: 1, pageSize: 10, type: "0" }).then((res) => {
			picList.value = res.data;
		});
	} else if (item === 0) {
		// 异物
		getPicList({ pageNum: 1, pageSize: 10, type: "1" }).then((res) => {
			picList.value = res.data;
		});
	} else if (item === 1) {
		// 场景
		getPicList({ pageNum: 1, pageSize: 10, type: "2" }).then((res) => {
			picList.value = res.data;
		});
	} else if (item === 2) {
		// 环境
		getPicList({ pageNum: 1, pageSize: 10, type: "3" }).then((res) => {
			picList.value = res.data;
		});
	}
	isShowImgList.value = true;
}
// 确定图片
function confirm() {
	if (picRadio.value == 3) {
		qj_library.value[0] = selectPic.value;
	} else if (clickLibrary.value === 0) {
		// 异物
		zt_library.value[0] = selectPic.value;
		// console.log(zt_library.value,'zt_library.value')
	} else if (clickLibrary.value === 1) {
		// 场景
		zt_library.value[1] = selectPic.value;
	} else if (clickLibrary.value === 2) {
		// 环境
		zt_library.value[2] = selectPic.value;
	}
	isShowImgList.value = false;
	selectPic.value = null;
}
// 获取对应算法列表
const getModelValue = (modelName) => {
	let res = data.modalList.filter((item) => {
		if (modelName === item.modelTypeName) return item;
	});
	return res[0].smodel;
};
// 初始化数据
const getList = () => {
	getSce(data.queryParams).then((res) => {
		tableData.value = res.rows;
		total.value = res.total;
	});
	loading.value = false;
};
// 查看
const handleCheck = (row) => {
	getSceById(row.id).then((res) => {
		data.detailList = res.data;
	});
	detailsOpen.value = true;
};
// 新增仿真
const handleAdd = () => {
	reset();
	open.value = true;
	title.value = "添加";
};
// 删除
const handleDelete = () => {
	let ids = deleteScene.value.join(",");
	deleteSce(ids).then((res) => {
		if (res.code === 200) {
			getList();
			return proxy.$modal.msgSuccess("删除成功");
		} else {
			return proxy.$modal.msgError("删除失败");
		}
	});
};
// 重置表单
function reset() {
	form.value = {
		imageEnhanceId: [null],
		sceneAnalysisId: [null],
		sceneDivisionId: [null],
		materialQualityId: [null],
	};
	proxy.resetForm("formRef");
}
// 新增一行选项
const addList = (modelType, optionLength, formDataLength) => {
	if (optionLength == formDataLength) {
		return proxy.$modal.msgError("添加数据不能大于选项值长度");
	}
	data.modelParams[modelType].push(null);
};
const subList = (modelType, index) => {
	data.modelParams[modelType].splice(index, 1);
};
// 保存情景
const saveInfo = (val) => {
	if (val === "保存情景") {
		updateSce(data.sceneQueryParams).then((res) => {
			console.log("保存情景", res);
			getList()
		});
		open.value = false;
		innerVisible.value = true;
	}
};
// 左侧模型提交
const modelInfo = async (val) => {
	data.modelParams.environmentId = zt_library.value[0].id;
	data.modelParams.foreignId = zt_library.value[1].id;
	data.modelParams.sceneId = zt_library.value[2].id;
	data.modelParams.scenarioId = qj_library.value[0].id
		? qj_library.value[0].id
		: undefined;

	await addModelInfo(data.imageFileList);
};
const addModelInfo = (file) => {
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => {
		data.modelParams.backaroundImage = reader.result;
		addPic(data.modelParams).then((res) => {
			data.ariResult = res.data;
			data.strategyParams.id = res.data.id;
			data.sceneQueryParams.id = res.data.id;
			data.form.afterImage = res.data.backaroundImage;
			data.form.beforeImage = res.data.backaroundImage;
			if (res.code == 200) {
				return proxy.$modal.msgSuccess("情景集新增成功");
			}
		});
	};
	// reader.onerror = function (error) {
	// 	console.log("Error: ", error);
	// };
};

const handleSelect = () => {
	queryParams.value = [];
};
/** 搜索按钮操作 */
function handleQuery() {
	queryParams.value.pageNum = 1;
	getList();
}
// 策略库点击
function addStrategyHandel() {
	strategy_open.value = true;
}
// 策略库取消
function strategyCatch() {
	zt_library.value =[{ image: null }, { image: null }, { image: null }]
	qj_library.value =[{ image: null }]
	strategy_open.value = false;
	data.strategyParams = {};
	data.imageFileList = []
}
// 策略
function strategyHandel() {
	addPolicy(data.strategyParams).then((res) => {
		if (res.code === 200) {
			strategy_open.value = false;
			data.strategyParams = {};
			return proxy.$modal.msgSuccess("添加至策略库成功");
		} else {
			strategy_open.value = false;
			return proxy.$modal.msgError("添加至策略库失败");
		}
	});
}
/** 重置按钮操作 */
function resetQuery() {
	data.queryParams = {
		pageNum: 1,
		pageSize: 10,
		monitoringPointGrade: undefined,
		addTime: [],
		route: undefined,
		monitoringPointName: undefined,
	};
	proxy.resetForm("queryRef");
	handleQuery();
}
function changePicId(val) {
	selectPic.value = val;
	console.log(val.id, "选择图片的id");
	// 情景库 3
	// 组态库 6
	// 组态库 6  || activeIndex.value === 2 (情景导入)
	console.log(activeIndex.value);
}
function formatter(data, key) {
	let res = data.find((i) => i.value == key);
	return res ? res.label : "空";
}
// 文件上传回调 -图片
const imageHandleChange = async (file, filelist) => {
	data.imageFileList = file.raw;
};
const imageHandleRemove = (file, filelist) => {
	data.imageFileList = file.raw;
};
const handleSelectionChange = (val) => {
	deleteScene.value = val.map((item) => {
		return item.id;
	});
};
const addSceneCloce = () => {
	data.modelParams = {};
	data.sceneQueryParams = {};
	open.value = false;
};
</script>
<style scoped>
.my-tab-class {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}
.Manual {
	color: aliceblue;
	line-height: 35px;
	text-align: center;
	width: 120px;
	cursor: pointer;
	background-color: #363636;
	height: 35px;
	-webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
	box-shadow: 2px 0 6px rgba(234, 237, 240, 0.35);
}
.Manuals {
	background-color: #058e8a;
}

.content-dialog {
	width: 100%;
	display: flex;
	color: #cfcfcf;
}

.left-content {
	flex: 1;
	margin-right: 90px;
}

.right-content {
	margin-left: 10px;
	flex: 1.2;
}

.content-right-class {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.content-right-class .img1,
.content-right-class .img2 {
	width: 300px;
	height: 200px;
}

.my-defined-form-label :deep(.el-form-item__label) {
	text-align: left;
}

.defined-form-label-font :deep(.el-form-item__label) {
	color: #cfcfcf !important;
	font-size: 13px !important;
}

.defined-row-class {
	border-left: 5px solid #058e8a;
	padding-left: 10px;
	margin-bottom: 20px;
}

.defined-row-class :deep(.el-form-item) {
	margin-bottom: 0px;
}

.defined-divider :deep(.el-divider__text) {
	color: #058e8a !important;
	background: #363636 !important;
	font-size: 16px;
	padding: 0 10px;
}
.library {
	position: relative;
}
.masking {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #363636;
}
::v-deep .el-image__error {
	color: #f5f7fa;
}
.common_style {
	color: #fff;
	background-color: #3d5a5d !important;
}
.common_style:hover {
	background-color: #57d0d8 !important;
	font-weight: 500 !important;
	opacity: 1;
	border-color: #57d0d8;
}
::v-deep .el-form-item__content{
	color: #f5f7fa;
}
</style>
