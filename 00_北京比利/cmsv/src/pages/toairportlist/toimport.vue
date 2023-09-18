<template>
  <input
    id="file"
    type="file"
    style="display: none"
    ref="file"
    @click.stop
    accept=".xls,.xlsx"
    @change="importDevices"
  />
</template>

<script>
import xlsx from "xlsx";
import { excelData } from "./airportlist.js";
import toAirportListApi from "@/api/toAirportListApi";
import env from "@/env";
export default {
  props: {
    includelist: {
      type: Array,
      default: () => [],
    },
    airlineList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    importd() {
      document.getElementById("file").click();
    },
    importDevices(ev0) {
      if (ev0.target.files.length !== 1) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async (ev) => {
        const wb = xlsx.read(ev.target.result, {
          type: "binary",
        });

        let dataSheet;
        for (let sheet in wb.Sheets) {
          if (!wb.Sheets.hasOwnProperty(sheet)) {
            continue;
          }

          dataSheet = wb.Sheets[sheet];
          break;
        }

        let payload = [];
        const range = xlsx.utils.decode_range(dataSheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          let excel = new excelData();
          for (let col = range.s.c; col <= range.e.c; col++) {
            let cell = dataSheet[xlsx.utils.encode_cell({ r: row, c: col })];
            let text = cell ? cell.w : null;
            switch (col) {
              case 0:
                if (text == null || text.trim() == "") {
                  this.$message.error(
                    "导入机场列表第" + (row + 1) + "行" + "\n酒店不能为空!请输入" + env.hotelId
                  );
                  document.querySelector("#file").value = "";
                  return;
                } else if (text != env.hotelId) {
                  this.$message.error(
                    "导入机场列表第" + (row + 1) + "行" + "\n酒店输入错误!请输入" + env.hotelId
                  );
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.hotelId = env.hotelId;
                break;
              case 1:
                let data = this.includelist.find((idx) => idx.id == text);
                if (text == null || text.trim() == "") {
                  this.$message.error("导入机场列表第" + (row + 1) + "行" + "\n机场不能为空");
                  document.querySelector("#file").value = "";
                  return;
                } else if (!data) {
                  this.$message.error("当前机场id不存在");
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.airportId = text;
                break;
              case 3:
                console.log(text, "text");
                if (text == null || text.trim() == "") {
                  this.$message.error("导入机场列表第" + (row + 1) + "行" + "\n航空公司不能为空");
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.airlineId = text;
                break;
              case 5:
                if (text == null || text.trim() == "") {
                  this.$message.error("导入机场列表第" + (row + 1) + "行" + "\n语言不能为空");
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.langId = text;
                break;
              case 6:
                if (text == null || text.trim() == "") {
                  this.$message.error("导入机场列表第" + (row + 1) + "行" + "\n图标不能为空");
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.icon = text;
                break;
              case 7:
                if (text == null || text.trim() == "") {
                  this.$message.error("第" + (row + 1) + "行" + "\n sort不能为空");
                  document.querySelector("#file").value = "";
                  return;
                }
                excel.sort = text;
                break;
              default:
                console.log("Unknown Cell: ", cell);
            }
          }
          payload.push(excel);
        }
        try {
          await toAirportListApi.batchDelAndSave(payload);
          // console.log(this.$parent, "all");
          await this.$emit("close", "refresh");
          await this.$message.success(this.$t("toAirport.importlistsuccess"));
          document.querySelector("#file").value = "";
        } catch (error) {
          console.error(error);
          this.$message.error(this.$t("toAirport.importlisterror"));
        }
      };
      reader.readAsBinaryString(ev0.target.files[0]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
