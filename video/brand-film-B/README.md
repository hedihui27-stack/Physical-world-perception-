# 品牌视频 B《让世界训练智能》

158 秒，1920×1080，25fps。画面全部由 HTML canvas 代码逐帧绘制，用 Playwright 截图后交给 ffmpeg 编码。

## 目录

| 路径 | 内容 |
|---|---|
| `src/` | 当前版本（v8）的全部代码和数据，可直接运行 |
| `src/film_v7.html` | 整片页面，按顺序加载所有脚本；`render(T)` 画出第 T 秒的画面 |
| `renders/` | 已渲染的成片：v8 发送版（约 28MB） |
| `archive/v5_code/` | v5 及更早的代码，仅作参考，单独打开会缺数据文件 |
| `experiments/` | 结尾镜头早期的三个方向试验（未采用） |
| `BRIEF_v6.md` | v6 时的项目简报：时间线、用户要求、技术架构 |

## 运行

需要 Python 3、Playwright（Chromium）和 ffmpeg。

```bash
cd src
python3 -m http.server 8768          # 另开一个终端，保持运行
python3 snapf7.py 47.5,76,148        # 截取指定秒数的静帧，输出到 s6/
python3 renderV7.py out.mp4          # 渲染整片（无声，约 30 分钟）
ffmpeg -i out.mp4 -i mixV5.flac -c:v copy -c:a aac -b:a 256k -shortest final.mp4   # 合入配乐与配音
```

`snapf7.py` 需要先建好 `s6/` 文件夹。

## 代码结构

脚本按加载顺序层层覆盖：后加载的文件重新定义前面的镜头函数。

- `helpers_film.js` 到 `v5_*.js`：基础绘图函数和 v5 的镜头。
- `v6_*.js`：v6 的调色、街区、logo 片尾。
- `v7_*.js`：v7 和 v8 的改动，主要包括：
  - `v7_color.js`：全片调色，橙色线条统一变细。
  - `v7_seemind.js`：一基多专，SeeMind 方块矩阵。
  - `v7_look.js`：城市新视觉，包括地表延续、屋顶配色和圆弧地平线。
  - `v7_tech*.js`、`v7_vary.js`、`v7_close.js`、`v7_fix5.js`：各镜头按技术逻辑重做，以及景别与颜色的多样化。
  - `v7_park.js`：预测与验证呼应开头的停车场。
  - `v7_end.js`：结尾点云，预测被现实逐点校正。

## 数据

| 文件 | 内容 |
|---|---|
| `data.json` | 陆地点、全球 75,570 个感知点 |
| `ws.json` | CelesTrak 卫星轨道根数 |
| `dc.json`、`block.json` | 北京东城区建筑与街道 |
| `nj.json` | 南京玄武区建筑，含钟山景区坐标 |
| `cities275.json` | 275 座城市坐标 |
| `land.png` | 全球陆地轮廓（0.2°） |
| `frame_dc.jpg` | 东城路口的一帧画面 |
| `mixV5.flac` | 配乐加配音的混音 |

## 注意

- 配乐用的是 Pixabay 上的 "Wonders of the Earth"，商用许可尚待确认。
- 画面中的部分数字和地名是示意值，正式对外前要替换或确认，比如停车场的"把握 87%"、"预测命中 93%"，以及东四路口的人流数。
