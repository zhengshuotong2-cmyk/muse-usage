// Muse Usage 小组件 (Scriptable, iOS)
// 显示 Muse 免费周额度剩余百分比、进度条和重置时间
// 深色模式跟随系统，浅色白底深字，深色深底浅字
// 锁屏小组件：同一份脚本，圆形只显剩余百分比，矩形显 Muse 与剩余百分比加进度条，行内显一行文字
// 颜色：剩余 >= 25% 蓝色；< 25% 黄色；< 10% 红色

// ============ 配置（下载后改这里） ============
// 只改下面两个值，不用建仓库，不用 Token
// WEEKLY_LEFT_PERCENT：周额度剩余百分比，去 Muse 里看 Usage 写多少就填多少
// WEEKLY_RESET：周额度重置时间，ISO 格式，例如 "2026-11-20T09:16:00+08:00"
const WEEKLY_LEFT_PERCENT = 40;
const WEEKLY_RESET = "2026-11-20T09:16:00+08:00";
// =============================================

function fmtResetIn(resetISO) {
  if (!resetISO) return "";
  const reset = new Date(resetISO);
  const now = new Date();
  let diffMs = reset - now;
  if (diffMs < 0) return "已重置";
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  if (days >= 1) return `Resets in ${days}天`;
  if (hours >= 1) return `Resets in ${hours}小时`;
  const mins = Math.floor((diffMs % 3600000) / 60000);
  return `Resets in ${mins}分钟`;
}

// 画进度条：返回一个已加到父 stack 的背景条
function addProgressBar(parent, pct, color, totalW, trackColor) {
  const bg = parent.addStack();
  bg.backgroundColor = trackColor;
  bg.cornerRadius = 3;
  bg.size = new Size(totalW, 6);
  const fillW = Math.max(6, Math.round(totalW * Math.max(0, Math.min(100, pct)) / 100));
  const fill = bg.addStack();
  fill.backgroundColor = color;
  fill.cornerRadius = 3;
  fill.size = new Size(fillW, 6);
  // 占满剩余宽度，保证圆角与对齐
  const rest = bg.addStack();
  rest.size = new Size(Math.max(0, totalW - fillW), 6);
  return bg;
}

async function main() {
  // 深色模式跟随系统
  const isDark = Device.isUsingDarkAppearance();
  const C = {
    bg: new Color(isDark ? "#1C1C1E" : "#FFFFFF"),
    text: new Color(isDark ? "#FFFFFF" : "#111111"),
    sub: new Color(isDark ? "#98989D" : "#8E8E93"),
    foot: new Color(isDark ? "#636366" : "#AEAEB2"),
    track: new Color(isDark ? "#3A3A3C" : "#E5E5EA"),
  };

  const left = Math.max(0, Math.min(100, WEEKLY_LEFT_PERCENT));
  const used = 100 - left;
  const color = left < 10 ? new Color("#FF3B30") : (left < 25 ? new Color("#FFCC00") : new Color("#007AFF"));

  // 锁屏小组件：根据 widgetFamily 渲染紧凑版
  const family = config.widgetFamily;
  if (family === "accessoryCircular" || family === "accessoryRectangular" || family === "accessoryInline") {
    const w = new ListWidget();
    if (family === "accessoryInline") {
      const t = w.addText(`Muse ${left}% left`);
      t.font = Font.systemFont(14);
    } else if (family === "accessoryCircular") {
      w.addSpacer();
      const pct = w.addText(`${left}%`);
      pct.font = Font.boldSystemFont(22);
      pct.centerAlignText();
      w.addSpacer();
    } else {
      // accessoryRectangular
      w.setPadding(8, 12, 8, 12);
      const lab = w.addText("Muse · Weekly");
      lab.font = Font.systemFont(12);
      lab.textColor = C.sub;
      w.addSpacer(2);
      const pct = w.addText(`${left}% left`);
      pct.font = Font.boldSystemFont(20);
      pct.textColor = C.text;
      w.addSpacer(4);
      addProgressBar(w, left, color, 130, C.track);
    }
    Script.setWidget(w);
    Script.complete();
    return;
  }

  const w = new ListWidget();
  w.backgroundColor = C.bg;
  w.setPadding(16, 18, 14, 18);

  // 标题行：Muse | Usage limits
  const header = w.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();
  const title = header.addText("Muse");
  title.font = Font.boldSystemFont(19);
  title.textColor = C.text;
  header.addSpacer();
  const sub = header.addText("Usage limits");
  sub.font = Font.systemFont(14);
  sub.textColor = C.sub;
  w.addSpacer(12);

  // 周额度
  const lab = w.addText("Weekly");
  lab.font = Font.systemFont(14);
  lab.textColor = C.sub;
  w.addSpacer(4);
  const pct = w.addText(`${left}% left`);
  pct.font = Font.boldSystemFont(28);
  pct.textColor = C.text;
  w.addSpacer(8);
  addProgressBar(w, left, color, 310, C.track);
  w.addSpacer(8);
  const reset = w.addText(fmtResetIn(WEEKLY_RESET));
  reset.font = Font.systemFont(13);
  reset.textColor = C.sub;

  w.addSpacer();
  const foot = w.addText(`已用 ${used}%`);
  foot.font = Font.systemFont(11);
  foot.textColor = C.foot;

  Script.setWidget(w);
  Script.complete();
}

await main();
