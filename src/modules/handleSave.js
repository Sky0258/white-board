// 4. 暂存模块
import { getPathStore, setLocalStorageValue } from "../state/index";
import { paintLineStart, paintLineMove, paintLineEnd } from "../utils/paintLine";

export function paintPathLine(storeName, ctx, paintCurrentPathHistory, linePath) {
  // ctx.lineWidth = 5;
  // ctx.strokeStyle = "blue";
  const oldPath = getPathStore(storeName);
  oldPath &&
    oldPath.forEach((item) => {
      paintLineStart(ctx, item[0].offsetX, item[0].offsetY, paintCurrentPathHistory.value, linePath);
      for (let i = 0; i < item.length; i++) {
        paintLineMove(ctx, item[i].offsetX, item[i].offsetY, paintCurrentPathHistory.value, linePath);
      }
      paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
      linePath.length = 0;
    });
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = "black";
}

export function paintHistoryLine(ctx, paintCurrentPathHistory, linePath) {
  // 开启线条推入
  paintCurrentPathHistory.value = false;
  paintPathLine("historyPathStore", ctx, paintCurrentPathHistory, linePath);
}

// 刷新前缓存
export function saveHistoryPath() {
  const currentPath = getPathStore("currentPathStore");
  currentPath && setLocalStorageValue("historyPathStore", JSON.stringify(currentPath));
  setLocalStorageValue("currentPathStore", null);
}
