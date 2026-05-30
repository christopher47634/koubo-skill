# 常见问题与踩坑记录

## 渲染相关

### TMPDIR 问题
**症状**：`ENOENT: no such file or directory, open 'C:\Users\...\Temp/remotion-webpack-bundle-xxx/bundle.js'`
**原因**：WSL 的 TMPDIR 指向 Windows temp 路径，webpack bundle 写到 Windows 侧但 Remotion 从 Linux 侧读
**解决**：渲染时设 `TMPDIR=/tmp`

### Composition ID 错误
**症状**：`Could not find composition with ID MainComposition`
**原因**：Root.tsx 中 id 是 `"main"` 不是 `"MainComposition"`
**解决**：`npx remotion render src/index.ts main ...`

### H.265 不兼容
**症状**：视频无法播放或渲染报错
**原因**：Remotion/浏览器不支持 H.265 编码
**解决**：`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 128k public/input-video.mp4`

### Video muted 属性
**症状**：口播视频在预览中不播放
**原因**：浏览器自动播放策略要求视频 muted
**解决**：`<Video src={...} muted />`

## 字体相关

### 中文字体不显示
**症状**：字幕显示方块或空白
**原因**：字体文件未正确加载或路径错误
**解决**：用 @font-face + staticFile() 注册字体，确认 public/fonts/ 下有 LXGWWenKai-Regular.ttf

### @remotion/google-fonts 不可用
**症状**：中文字体加载失败
**原因**：@remotion/google-fonts 不支持 LXGW WenKai
**解决**：手动用 @font-face 注册本地字体文件

## 字幕相关

### subtitles.json 不同步
**症状**：渲染的字幕内容和预期不同
**原因**：修改了根目录 subtitles.json 但没复制到 src/
**解决**：`cp subtitles.json src/subtitles.json`

### 字幕时间戳重叠
**症状**：字幕闪烁或切换异常
**原因**：两条字幕的 start/end 时间重叠
**解决**：对齐脚本中自动修复重叠（midpoint 分割）

### SCHEDULE subIdx 偏移
**症状**：图片在错误的字幕出现
**原因**：字幕增删后 SCHEDULE 的 subIdx 没同步更新
**解决**：每次修改字幕后，检查所有 SCHEDULE 的 subIdx 是否对应

## 下载相关

### WSL SSL 不通
**症状**：requests/urllib 报 SSL: UNEXPECTED_EOF_WHIER_READING
**原因**：WSL 网络层 SSL 握手问题
**解决**：绕道 PowerShell `Invoke-WebRequest`，再 cp 到 WSL

### npm 安装慢
**症状**：npm install 卡住
**原因**：默认 registry 连接慢
**解决**：`npm install --registry=https://registry.npmmirror.com`

### 删 node_modules
**症状**：WSL 下 rm -rf node_modules 报 ENOTEMPTY
**原因**：Windows 文件系统残留
**解决**：从 Windows 侧删除 `powershell Remove-Item -Recurse -Force node_modules`

## 视频叠加相关

### 视频素材不播放
**症状**：弹入的视频素材是静止的
**原因**：Video 组件需要 muted 属性
**解决**：`<Video src={...} muted loop />`

### 视频 H.265 素材
**症状**：视频叠加无法渲染
**原因**：public/videos/ 中的视频也是 H.265
**解决**：同样需要 ffmpeg 转 H.264
