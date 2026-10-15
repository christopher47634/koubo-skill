// 渲染前时间轴 lint：纯函数，返回问题列表，不读文件
const EPS = 1e-6;

/**
 * @param {object} o
 * @param {{index?:number,text?:string,start:number,end:number}[]} o.subtitles
 * @param {number} [o.durationSeconds] 视频总时长（秒）
 * @param {{subIdx:number,type?:string,delay?:number}[]} [o.schedule] 素材排期（场景）
 * @returns {{level:"error"|"warn",msg:string}[]}
 */
export function lintTimeline({ subtitles, durationSeconds, schedule = [] }) {
  const out = [];
  const err = (msg) => out.push({ level: "error", msg });
  const warn = (msg) => out.push({ level: "warn", msg });

  if (!Array.isArray(subtitles)) {
    err("subtitles 必须是数组");
    return out;
  }
  if (durationSeconds !== undefined && !(durationSeconds > 0)) err(`视频时长必须 > 0，当前 ${durationSeconds}`);

  subtitles.forEach((s, i) => {
    const tag = `字幕[${i}]`;
    if (!Number.isFinite(s.start) || !Number.isFinite(s.end)) return err(`${tag} start/end 必须是有限数字`);
    if (s.start < 0) err(`${tag} start 为负 (${s.start})`);
    if (!(s.end > s.start)) err(`${tag} end(${s.end}) 必须大于 start(${s.start})`);
    if (typeof s.text !== "string" || s.text.trim() === "") err(`${tag} text 为空`);
    if (s.index !== undefined && s.index !== i) warn(`${tag} index=${s.index} 与数组下标不一致（排期 subIdx 按下标取）`);
    if (durationSeconds > 0 && s.end > durationSeconds + EPS) err(`${tag} end(${s.end}) 超出视频时长 ${durationSeconds}s`);
    const prev = subtitles[i - 1];
    if (prev && Number.isFinite(prev.start)) {
      if (s.start < prev.start - EPS) err(`${tag} start(${s.start}) 早于上一条 start(${prev.start})，时间戳不单调`);
      else if (Number.isFinite(prev.end) && s.start < prev.end - EPS) err(`${tag} 与上一条重叠 (${s.start} < ${prev.end})`);
    }
  });

  schedule.forEach((it, i) => {
    const tag = `场景[${i}]`;
    const sub = subtitles[it.subIdx];
    if (!Number.isInteger(it.subIdx) || !sub) {
      err(`${tag} subIdx=${it.subIdx} 指向不存在的字幕`);
      return;
    }
    if (it.delay !== undefined && !(it.delay >= 0)) err(`${tag} delay 不能为负`);
    if (!(sub.end - sub.start > 0)) err(`${tag} 所挂字幕[${it.subIdx}] 时长 <= 0，场景 duration 无效`);
    else if (it.delay && sub.start + it.delay >= sub.end) warn(`${tag} delay(${it.delay}) 晚于字幕结束，图片出现时字幕已结束`);
    if (durationSeconds > 0 && sub.start >= durationSeconds) err(`${tag} 起点 ${sub.start}s 不在视频时长内`);
  });

  return out;
}
