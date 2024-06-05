// 1.任意线模块
let flag = false;
import { handleRulerAround, handleRulerLineStart } from "./handleRulerLine";
import { paintLineStart, paintLineMove, paintLineEnd } from "../utils/paintLine";
import { checkOnRuler } from './handleMoveRuler'

export function handleNormalLineStart(e, isShowRuler, ctx, paintCurrentPathHistory, linePath, rulerPosition, paintType) {
  if (isShowRuler.value && handleRulerAround(e, rulerPosition, paintType)) {
    handleRulerLineStart(e, ctx, rulerPosition, paintCurrentPathHistory, linePath);
    return;
  }

  flag = true;
  paintLineStart(ctx, e.offsetX, e.offsetY, paintCurrentPathHistory.value, linePath);
}

export function handleNormalLineMove(e, ctx, rulerPosition, paintCurrentPathHistory, linePath) {
  if (flag && !checkOnRuler(e, rulerPosition)) {
    paintLineMove(ctx, e.offsetX, e.offsetY, paintCurrentPathHistory.value, linePath);
  }
}

export function handleNormalLineEnd(ctx, paintCurrentPathHistory, linePath) {
  paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
  linePath.length = 0;
  flag = false;
}
