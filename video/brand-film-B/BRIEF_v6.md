# SeeTime 品牌视频 B《让世界训练智能》项目简报（2026-10-15）

新会话先读这一页。项目源文件包：`SeeTime视频B_项目源文件_v6.tar.gz`（放在用户 Mac 的 ~/Documents/SeeTime视频/）。

## 1. 目标与已交付
- 用途：给投资人、官网、展厅、客户看的技术品牌片，内容来自 2026 BP。
- 时长 158 秒，1920×1080，25fps。
- 已交付 v5：`SeeTime_视频B_让世界训练智能_v5.mp4`，在用户 Mac 的 ~/Documents/SeeTime视频/。
- 解说词定稿：Claude Docs 2df28c61-e29b-4872-b3d6-6307e07bcfa7。
- 分镜表：Claude Docs 0edfc72d-f412-435d-9e23-61f0ccab9af5。

## 2. 用户硬性要求（必须遵守）
- **画面服务意义。** 画面要饱满：不要小物体，不要大片黑。要有空间感，要发光；不要用简单的线、圈、点。能用视觉表达的不用文字，多做抽象↔具体的转换，单个镜头不能久不变化。
- **城市限制。** 只出现公司业务城市（北京、南京，或已讨论过的城市），不出现香港、芬兰，模拟的也不行。长安街敏感，不点名、不突出。
- **3 秒留白。** 开头留 3 秒再进解说。解说不用"第一、第二"式的列表措辞。
- **配色。** 整体去蓝、降饱和（石墨灰、冷白），每页最重要的元素用 logo 橙（#FFA626 / #FFD460）。
- **Logo。** 用正式 logo：`assets/logo_seetime_white.png`，白字，"i" 上方一个橙球。
- **渲染预算。** 约 15–20 分钟。不做景深、雾、运动模糊、胶片颗粒。
- **省 token。** 先给 2–3 个方向的小缩略图让用户选，再精做。自检用低分辨率拼图，少看图。只做局部修补，不整段重写。回复简短。

## 3. 技术架构
- **渲染方式。** HTML canvas 2D，场景函数为 `render(T)`。Playwright 逐帧截图，经管道送进 ffmpeg（libx264，crf 17）。
- **本地服务。** `cd filmD && python3 -m http.server 8768`。
- **整片页面。**
  - `film_v6.html`：v5 的脚本加上 `v6_base / v6_city / v6_time / v6_experts / v6_digital / v6_end.js`。
  - 后处理链：glow 光晕 → grade 去蓝调色 → endCard 片尾卡。
- **常用脚本。**
  - 时间点静帧：`python3 snapf6.py 7.6,57,...`，输出到 s6/。
  - 整片渲染：`python3 renderV5.py out.mp4`，先把里面的 film_v5 改成 film_v6；约 25 分钟。
  - 合音：`ffmpeg -i video.mp4 -i mixV5.flac -c:v copy -c:a aac -b:a 256k -shortest out.mp4`。时间线没变，混音可直接复用。
- **数据。**
  - `data.json`：陆地点、全球感知点。
  - `ws.json`：CelesTrak 卫星。
  - `dc.json`：东城 14k 栋楼加摄像头，1 单位 = 0.4 km。
  - `block.json`：东城 2108 栋楼的街区加街道行人路径。
  - `nj.json`：南京玄武区，含钟山坐标 scenic。
  - `cities275.json`：275 座城市坐标。
  - `frame_dc.jpg`：东城路口画面。
- **已知坑。**
  - glow 会把中灰色的大面积提亮约 1.8 倍，大面积的面要给很暗的底色。
  - additive 粒子叠多了会发白。
  - 别在 `-x**2` 写法上犯错，要写成 `-(x**2)`。

## 4. 时间线（秒）
| 镜头 | 起–止 |
|---|---|
| shotDigital | 0–13.3 |
| shotTaishan | 13.3–19.0 |
| shotParking | 19.0–25.9 |
| shotPeel | 25.9–29.1 |
| shotWake | 29.1–37.9 |
| shotShells | 37.9–46.1 |
| shotSats | 46.1–53.1 |
| shotPoints | 53.1–56.0 |
| shotEyes | 56.0–58.1 |
| shotEvents | 58.1–63.4 |
| shotCoord | 63.4–69.6 |
| shotExperts | 69.6–82.3 |
| sceneDescend | 82.3–87.6 |
| sceneVCloud | 87.6–97.1 |
| shotPredict | 97.1–106.0 |
| shotMatch | 106.0–108.9 |
| shotTimeWorlds | 108.9–115.8 |
| shotConverge | 115.8–122.5 |
| shotFlywheel | 122.5–125.8 |
| shotChina5 | 125.8–129.0 |
| shotDCDay | 129.0–138.4 |
| shotNanjing | 138.4–143.8 |
| shotAGI | 143.8–158.0 |

"让世界训练智能"字幕从 151.2 秒出，logo 从约 153.4 秒出。

## 5. v6 现状（用户评价：大调压缩后很多效果不理想）
- **站得住的：**
  - 调色和橙色强调。
  - 摄像头改为柔和光斑（`camPool`）。
  - 东城 7×24 去掉昼夜罩色。
  - 新 logo 片尾。
  - 预测、验证、时间世界改用东城真实街区。
- **不到位、待重做（按优先级）：**
  1. **结尾 shotAGI（v6_end.js）**
     - 现状：街区建筑是素灰体块；机器人、无人机、车是太小的线框；地球"呼吸"像划痕。
     - 用户方向：引入机器人、无人机、宏观世界，不要像互联网或航班的连线。
  2. **一基多专 shotExperts（v6_experts.js）**
     - 现状：像流程图，画面空。
     - 用户方向：左侧四组海量粒子源源不断流入 SeeMind，右侧输出多组结论；不标具体名称，粒子不要每组一种颜色。
  3. **数字地球 shotDigital（v6_digital.js）**
     - 现状：卡片铺满成了灰墙，失去地球的空间感。
     - 用户方向：用几个局部网页被筛选、重组来表现搜索、推荐、大模型，网页要一直变换。
  4. **南京 shotNanjing（v6_city.js）**
     - 现状：山体发白。
     - 用户方向：选建筑明显的角度，渲染参考东城；没有楼的地方把山体建起来，避免主体一片黑。
  5. **汇合 shotConverge：** 城市光点叠白，地球切得太满。
- **建议做法：**
  - 一次只攻一个镜头：先出 2–3 个方向的缩略图，用户选定后再精修，满意后再并入整片。
  - 结尾或一基多专可以评估用 three.js（WebGL）做真 3D 打样。

## 6. 其他
- 音乐用的是 Pixabay 的 "Wonders of the Earth"，许可需要用户确认。
- v5 的代码在 archive/v5_code。
