import React from "react";
import {AbsoluteFill, Composition, Series} from "remotion";
import {
  AnimatedChecklist,
  Badge,
  CircularGauge,
  CodeBlock,
  CounterAnimation,
  Divider,
  GlassCard,
  GlitchText,
  GlowText,
  HudPanel,
  ListCard,
  LoadingDots,
  LowerThird,
  MacBrowser,
  MacCodeEditor,
  MacNotification,
  MacTerminal,
  MetricCard,
  NotificationToast,
  PhoneFrame,
  ProgressBar,
  StatusIndicator,
  StepIndicator,
  SubtitleOverlay,
  Tag,
  TechBackground,
  TypewriterText,
  Waveform,
} from "./components";

const shell: React.CSSProperties = {
  background: "#07090F",
  color: "#F4F7FB",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
};

const Header: React.FC<{title: string; index: string}> = ({title, index}) => (
  <div style={{position: "absolute", left: 54, top: 40, zIndex: 200}}>
    <div style={{fontSize: 12, letterSpacing: 4, color: "#7DD3FC"}}>VISUAL SYSTEM / {index}</div>
    <div style={{fontSize: 34, fontWeight: 750, marginTop: 8}}>{title}</div>
  </div>
);

const CardsPage: React.FC = () => (
  <AbsoluteFill style={shell}>
    <TechBackground />
    <Header title="Glass Cards and Information Hierarchy" index="01" />
    <Tag text="COMPONENT SYSTEM V5" icon="◆" enterFrame={0} exitFrame={100} />
    <ListCard
      title="MODE1 PIPELINE"
      icon="01"
      side="left"
      items={[
        {text: "Whisper alignment", sub: "Timestamp precision", icon: "A"},
        {text: "Smart composition", sub: "Person-first layout", icon: "B"},
        {text: "Bilingual subtitles", sub: "Always topmost", icon: "C"},
      ]}
      enterFrame={0}
      exitFrame={100}
    />
    <GlassCard side="right" enterFrame={0} exitFrame={100}>
      <div style={{fontSize: 13, letterSpacing: 3, color: "#C4B5FD"}}>QUALITY GATE</div>
      <div style={{fontSize: 32, fontWeight: 750, marginTop: 16}}>统一材质，不牺牲功能</div>
      <div style={{fontSize: 19, lineHeight: 1.7, color: "rgba(232,238,248,0.62)", marginTop: 12}}>
        深色玻璃、精细边框、环境阴影和清晰的信息层级。
      </div>
      <div style={{marginTop: 24}}><ProgressBar value={92} label="Visual consistency" enterFrame={0} exitFrame={100} /></div>
      <div style={{display: "flex", gap: 10, marginTop: 22}}>
        <Badge text="GLASS" icon="●" enterFrame={0} exitFrame={100} />
        <Badge text="MOTION" icon="●" color="#C4B5FD" enterFrame={0} exitFrame={100} />
      </div>
    </GlassCard>
    <SubtitleOverlay text="卡片组件需要统一，但不能千篇一律" en="Consistency without making every component look identical." startFrame={0} endFrame={100} />
  </AbsoluteFill>
);

const DataPage: React.FC = () => (
  <AbsoluteFill style={shell}>
    <TechBackground />
    <Header title="Data, Status and Motion Feedback" index="02" />
    <HudPanel
      side="left"
      metrics={[
        {label: "ACCURACY", value: 94, unit: "%", color: "#86EFAC"},
        {label: "READABILITY", value: 91, unit: "%", color: "#7DD3FC"},
        {label: "CONSISTENCY", value: 89, unit: "%", color: "#C4B5FD"},
      ]}
      enterFrame={0}
      exitFrame={100}
    />
    <MetricCard icon="↗" label="RENDER SCORE" value="9.2" trend={{direction: "up", value: "+1.1"}} side="right" enterFrame={0} exitFrame={100} />
    <div style={{position: "absolute", right: 70, top: 360, width: 560}}>
      <GlassCard side="right" width={560} enterFrame={0} exitFrame={100}>
        <div style={{display: "flex", alignItems: "center", gap: 32}}>
          <CircularGauge value={94} size={180} label="QUALITY" enterFrame={0} exitFrame={100} />
          <div style={{flex: 1}}>
            <CounterAnimation from={0} to={12847} suffix="+" label="RENDERED FRAMES" fontSize={54} enterFrame={0} exitFrame={100} />
            <Divider width="100%" enterFrame={0} exitFrame={100} />
            <Waveform bars={34} height={54} enterFrame={0} exitFrame={100} />
          </div>
        </div>
        <div style={{marginTop: 22}}>
          <StatusIndicator
            items={[
              {label: "VIDEO", status: "active", value: "READY"},
              {label: "AUDIO", status: "active", value: "SYNC"},
              {label: "SUBTITLE", status: "active", value: "TOP"},
            ]}
            enterFrame={0}
            exitFrame={100}
          />
        </div>
      </GlassCard>
    </div>
  </AbsoluteFill>
);

const TypePage: React.FC = () => (
  <AbsoluteFill style={shell}>
    <TechBackground />
    <Header title="Typography, Steps and Notifications" index="03" />
    <div style={{position: "absolute", left: 70, top: 190, width: 850}}>
      <GlowText text="MODE ONE / VISUAL LANGUAGE" fontSize={48} enterFrame={0} exitFrame={100} />
      <div style={{marginTop: 26}}><GlitchText text="TECH WITHOUT NOISE" fontSize={58} enterFrame={0} exitFrame={100} /></div>
      <div style={{marginTop: 28}}><TypewriterText text="Research → Compose → Render → Review" fontSize={25} enterFrame={0} exitFrame={100} /></div>
      <div style={{marginTop: 30}}>
        <StepIndicator steps={[{label: "Research", done: true}, {label: "Layout", done: true}, {label: "Render", active: true}, {label: "Review"}]} enterFrame={0} exitFrame={100} />
      </div>
      <div style={{marginTop: 30, width: 620}}>
        <AnimatedChecklist items={[{text: "Glass depth", checked: true}, {text: "Readable hierarchy", checked: true}, {text: "Subtitle safety", checked: true}]} enterFrame={0} exitFrame={100} />
      </div>
      <div style={{marginTop: 24}}><LoadingDots text="Visual QA" enterFrame={0} exitFrame={100} /></div>
    </div>
    <NotificationToast icon="✦" app="MODE1" title="Visual audit passed" body="Shared surfaces and title treatments are now consistent." enterFrame={0} exitFrame={100} />
    <MacNotification app="REMOTION" icon="R" title="Render complete" body="All critical layers compiled successfully." enterFrame={0} exitFrame={100} />
    <LowerThird name="Christopher" title="Mode1 Visual System" position="right" enterFrame={0} exitFrame={100} />
  </AbsoluteFill>
);

const DevicePage: React.FC = () => (
  <AbsoluteFill style={shell}>
    <TechBackground />
    <MacTerminal
      title="Mode1 Pipeline"
      side="left"
      width={570}
      height={360}
      lines={[
        {prompt: "$", text: "npm run render", type: "input"},
        {text: "✓ components compiled", type: "success"},
        {text: "✓ subtitles topmost", type: "success"},
        {text: "✓ audio synchronized", type: "success"},
      ]}
      enterFrame={0}
      exitFrame={100}
    />
    <MacCodeEditor
      filename="SubtitleOverlay.tsx"
      language="TypeScript"
      side="right"
      width={680}
      height={360}
      code={[
        {text: "export const SUBTITLE_Z_INDEX = 1000;", color: "#7DD3FC", highlight: true},
        {text: "const bilingual = Boolean(en);", color: "#C4B5FD"},
        {text: "return <GlassSubtitle />;", color: "#86EFAC"},
      ]}
      enterFrame={0}
      exitFrame={100}
    />
    <div style={{position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center"}}>
      <div style={{fontSize: 12, letterSpacing: 4, color: "#7DD3FC"}}>VISUAL SYSTEM / 04</div>
      <div style={{fontSize: 30, fontWeight: 750, marginTop: 8}}>macOS Workspaces</div>
    </div>
  </AbsoluteFill>
);

const FramesPage: React.FC = () => (
  <AbsoluteFill style={shell}>
    <TechBackground />
    <div style={{position: "absolute", left: 620, top: 45}}>
      <div style={{fontSize: 12, letterSpacing: 4, color: "#7DD3FC"}}>VISUAL SYSTEM / 05</div>
      <div style={{fontSize: 30, fontWeight: 750, marginTop: 8}}>Browser and Mobile Frames</div>
    </div>
    <PhoneFrame side="left" enterFrame={0} exitFrame={100}>
      <div style={{height: "100%", background: "linear-gradient(160deg,#111827,#020617)", padding: 28}}>
        <div style={{fontSize: 13, color: "#7DD3FC", letterSpacing: 2}}>MOBILE PREVIEW</div>
        <div style={{fontSize: 28, fontWeight: 700, marginTop: 22}}>Mode1</div>
      </div>
    </PhoneFrame>
    <MacBrowser url="mode1.local/preview" title="Mode1 Preview" side="right" width={780} height={500} enterFrame={0} exitFrame={100}>
      <div style={{height: "100%", display: "grid", placeItems: "center", background: "linear-gradient(145deg,#EEF2FF,#F8FAFC)", color: "#111827"}}>
        <div style={{textAlign: "center"}}>
          <div style={{fontSize: 40, fontWeight: 750}}>Clean browser framing</div>
          <div style={{fontSize: 18, color: "#64748B", marginTop: 10}}>No duplicated traffic lights</div>
        </div>
      </div>
    </MacBrowser>
  </AbsoluteFill>
);

const AuditShowcase: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={90}><CardsPage /></Series.Sequence>
    <Series.Sequence durationInFrames={90}><DataPage /></Series.Sequence>
    <Series.Sequence durationInFrames={90}><TypePage /></Series.Sequence>
    <Series.Sequence durationInFrames={90}><DevicePage /></Series.Sequence>
    <Series.Sequence durationInFrames={90}><FramesPage /></Series.Sequence>
  </Series>
);

export const VisualAuditRoot: React.FC = () => (
  <>
    <Composition id="AuditCards" component={CardsPage} durationInFrames={101} fps={30} width={1920} height={1080} />
    <Composition id="AuditData" component={DataPage} durationInFrames={101} fps={30} width={1920} height={1080} />
    <Composition id="AuditType" component={TypePage} durationInFrames={101} fps={30} width={1920} height={1080} />
    <Composition id="AuditDevices" component={DevicePage} durationInFrames={101} fps={30} width={1920} height={1080} />
    <Composition id="AuditFrames" component={FramesPage} durationInFrames={101} fps={30} width={1920} height={1080} />
    <Composition id="VisualAuditShowcase" component={AuditShowcase} durationInFrames={450} fps={30} width={1920} height={1080} />
  </>
);
