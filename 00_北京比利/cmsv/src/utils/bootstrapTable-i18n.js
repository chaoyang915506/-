export const optionsUS = {
  // 搜索
  formatSearch: () => {
    return "Search";
  },
  //加载数据时提示
  formatLoadingMessage: () => {
    return "Data loading...";
  },
  //每页显示
  formatRecordsPerPage: function(pageNumber) {
    return pageNumber + " rows per page";
  },
  //页码
  formatShowingRows: function(pageFrom, pageTo, totalRows) {
    return "Showing " + pageFrom + " to " + pageTo + " of " + totalRows + " rows";
  },
  formatNoMatches: function() {
    return "No relevant records found";
  }
};

