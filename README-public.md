# Muse Usage

Muse 免费周额度 iPhone 桌面小组件，用 Scriptable 显示。

## 样子

主屏幕中号小组件：显示周额度剩余百分比、进度条和重置时间。剩余低于 25% 变黄，低于 10% 变红。深色模式跟随系统。

锁屏小组件：同一份脚本，圆形只显剩余百分比，矩形显 Muse 与剩余百分比加进度条，行内显一行文字。

## 安装

1. iPhone 装免费应用 [Scriptable](https://apps.apple.com/app/scriptable/id1405459180)
2. 打开 `MuseUsageWidget.js`，复制全文
3. 打开 Scriptable，点右上角 `+` 新建脚本，粘贴进去
4. 改脚本最上面两个值：
   - `WEEKLY_LEFT_PERCENT`：周额度剩余百分比，去 Muse 里看 Usage 写多少就填多少
   - `WEEKLY_RESET`：周额度重置时间，ISO 格式，例如 `"2026-11-20T09:16:00+08:00"`
5. 点左上角 Done 保存
6. 回主屏幕，长按空白处，点左上角加号，搜 Scriptable，选个中号的，加完长按它点 Edit Widget 选这个脚本
7. 锁屏：长按锁屏点自定，加小组件选 Scriptable，挑圆形那个，选这个脚本

## 更新数据

额度变了就打开脚本改 `WEEKLY_LEFT_PERCENT` 那个数字，保存就行。重置时间到了就改 `WEEKLY_RESET`。

不用建仓库，不用 Token，不用服务器。
