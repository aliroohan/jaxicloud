/**
 * Generates unique per-slug solution layouts with distinct compositions.
 * Run: npx tsx scripts/generate-solution-layouts.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "components", "solutions");

type Archetype =
  | "editorialSplit"
  | "darkCommand"
  | "bentoFeatures"
  | "mediaCascade"
  | "processRail"
  | "challengeSplit"
  | "galleryCinema"
  | "sensorStory"
  | "compactChecklist"
  | "platformWall"
  | "pastoralGrid"
  | "numberedCascade"
  | "timelineVertical"
  | "scorecard"
  | "miniBleed"
  | "hubSpokes"
  | "inspectionDark"
  | "dualPanel"
  | "formFeature"
  | "tagWall"
  | "threeAct"
  | "mosaicSensors"
  | "bookFeatures"
  | "stackedDarkCards";

const SLUGS: { slug: string; component: string; archetype: Archetype }[] = [
  { slug: "constractor", component: "ConstractorLayout", archetype: "editorialSplit" },
  { slug: "lorry", component: "LorryLayout", archetype: "numberedCascade" },
  { slug: "leasing-control", component: "LeasingControlLayout", archetype: "bentoFeatures" },
  { slug: "nimbus", component: "NimbusLayout", archetype: "darkCommand" },
  { slug: "hecterra-agriculture", component: "HecterraLayout", archetype: "pastoralGrid" },
  { slug: "cooling-monitoring", component: "CoolingMonitoringLayout", archetype: "mosaicSensors" },
  { slug: "logistics-delivery-system", component: "LogisticsLayout", archetype: "timelineVertical" },
  { slug: "eco-drive", component: "EcoDriveLayout", archetype: "scorecard" },
  { slug: "fleetrun-fleet-volunteer", component: "FleetrunLayout", archetype: "compactChecklist" },
  { slug: "wia-tag", component: "WiaTagLayout", archetype: "tagWall" },
  { slug: "tpms-ebs-cooling-fuel-monitoring", component: "TpmsEbsLayout", archetype: "stackedDarkCards" },
  { slug: "dashcam", component: "DashcamLayout", archetype: "galleryCinema" },
  { slug: "dashcam-bus-truck", component: "DashcamBusLayout", archetype: "challengeSplit" },
  { slug: "registration-of-truck-door-opening", component: "DoorOpeningLayout", archetype: "sensorStory" },
  { slug: "tpms-solutions", component: "TpmsSolutionsLayout", archetype: "miniBleed" },
  { slug: "temperature-monitoring-work", component: "TemperatureLayout", archetype: "dualPanel" },
  { slug: "geolocation-of-construction-tools", component: "GeolocationToolsLayout", archetype: "processRail" },
  { slug: "opening-detection-of-truck-side-panels", component: "SidePanelsLayout", archetype: "threeAct" },
  { slug: "e-drivers-book", component: "EDriversBookLayout", archetype: "bookFeatures" },
  { slug: "click-connect", component: "ClickConnectLayout", archetype: "formFeature" },
  { slug: "safe-start", component: "SafeStartLayout", archetype: "inspectionDark" },
  { slug: "tacho-live", component: "TachoLiveLayout", archetype: "dualPanel" },
  { slug: "transport-telematics", component: "TransportTelematicsLayout", archetype: "hubSpokes" },
  { slug: "jaxicloud-platform", component: "JaxicloudPlatformLayout", archetype: "platformWall" },
];

const ACCENTS: Record<Archetype, { bg: string; accent: string; dark: boolean }> = {
  editorialSplit: { bg: "#f4f6f8", accent: "#0f766e", dark: false },
  darkCommand: { bg: "#0b1220", accent: "#14b8a6", dark: true },
  bentoFeatures: { bg: "#ffffff", accent: "#0e7490", dark: false },
  mediaCascade: { bg: "#fafaf9", accent: "#0f766e", dark: false },
  processRail: { bg: "#f8fafc", accent: "#0369a1", dark: false },
  challengeSplit: { bg: "#fff", accent: "#b45309", dark: false },
  galleryCinema: { bg: "#0a0a0a", accent: "#14b8a6", dark: true },
  sensorStory: { bg: "#f1f5f9", accent: "#0f766e", dark: false },
  compactChecklist: { bg: "#fff", accent: "#115e59", dark: false },
  platformWall: { bg: "#0f172a", accent: "#2dd4bf", dark: true },
  pastoralGrid: { bg: "#f7f6f1", accent: "#3f6212", dark: false },
  numberedCascade: { bg: "#fff", accent: "#1e3a5f", dark: false },
  timelineVertical: { bg: "#f8fafc", accent: "#0f766e", dark: false },
  scorecard: { bg: "#ecfdf5", accent: "#047857", dark: false },
  miniBleed: { bg: "#fff", accent: "#0f766e", dark: false },
  hubSpokes: { bg: "#f8fafc", accent: "#0f766e", dark: false },
  inspectionDark: { bg: "#111827", accent: "#fbbf24", dark: true },
  dualPanel: { bg: "#fff", accent: "#0e7490", dark: false },
  formFeature: { bg: "#f8fafc", accent: "#0f766e", dark: false },
  tagWall: { bg: "#fff", accent: "#7c2d12", dark: false },
  threeAct: { bg: "#fafafa", accent: "#334155", dark: false },
  mosaicSensors: { bg: "#eff6ff", accent: "#1d4ed8", dark: false },
  bookFeatures: { bg: "#fffbeb", accent: "#92400e", dark: false },
  stackedDarkCards: { bg: "#0f172a", accent: "#38bdf8", dark: true },
};

function cssModule(archetype: Archetype): string {
  const a = ACCENTS[archetype];
  const ink = a.dark ? "#f8fafc" : "#0f172a";
  const muted = a.dark ? "rgba(248,250,252,0.68)" : "#64748b";

  const layouts: Record<Archetype, string> = {
    editorialSplit: `
.hero{display:grid;gap:2rem;padding:clamp(3rem,8vw,6rem) 0;align-items:end}
@media(min-width:900px){.hero{grid-template-columns:1.1fr .9fr}}
.title{font-size:clamp(2.8rem,6vw,4.75rem);max-width:10ch;color:${ink}}
.media{aspect-ratio:4/5;border-radius:0 2rem 2rem 0;margin-right:calc(-50vw + 50%)}
.band{padding:clamp(3rem,7vw,5.5rem) 0}
.videoRow{display:grid;gap:1rem}@media(min-width:800px){.videoRow{grid-template-columns:1fr 1fr}}
.featureRail{display:grid;gap:2rem;border-top:1px solid #e2e8f0;padding-top:2.5rem}
`,
    darkCommand: `
.page{background:${a.bg};color:${ink}}
.hero{padding:clamp(4rem,10vw,7rem) 0 2rem;max-width:40rem}
.title{font-size:clamp(2.5rem,5.5vw,4.25rem);color:${ink}}
.panel{margin:2rem 0;padding:clamp(2rem,4vw,3rem);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:1.25rem}
.listWrap{display:grid;gap:2rem}@media(min-width:900px){.listWrap{grid-template-columns:1fr 1.2fr}}
.mediaStrip{display:grid;gap:1rem;margin-top:2rem}@media(min-width:700px){.mediaStrip{grid-template-columns:repeat(3,1fr)}}
.shot{aspect-ratio:16/11;border-radius:.75rem}
.section{padding:clamp(2.5rem,6vw,4.5rem) 0;border-top:1px solid rgba(255,255,255,0.08)}
`,
    bentoFeatures: `
.hero{padding:clamp(3rem,7vw,5rem) 0;display:grid;gap:1.5rem}
@media(min-width:900px){.hero{grid-template-columns:.85fr 1.15fr;align-items:center}}
.title{font-size:clamp(2.4rem,5vw,3.75rem);max-width:14ch}
.heroMedia{aspect-ratio:16/11;border-radius:1.5rem}
.bento{display:grid;gap:1rem;padding:clamp(2rem,5vw,4rem) 0 5rem}
@media(min-width:800px){.bento{grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(140px,auto)}}
.tile{padding:1.5rem;background:#f8fafc;border-radius:1.25rem}
.tileWide{grid-column:span 3}.tileTall{grid-column:span 2;grid-row:span 2}.tileSm{grid-column:span 2}
@media(max-width:799px){.tileWide,.tileTall,.tileSm{grid-column:span 1;grid-row:span 1}}
`,
    mediaCascade: `
.hero{padding:clamp(3rem,8vw,6rem) 0 2rem}.title{font-size:clamp(2.5rem,5vw,4rem);max-width:12ch}
.cascade{display:flex;flex-direction:column;gap:clamp(2.5rem,6vw,4rem);padding-bottom:5rem}
.row{display:grid;gap:1.5rem}@media(min-width:900px){.row{grid-template-columns:1fr 1fr;align-items:center}}
.shot{aspect-ratio:16/10;border-radius:1rem}
`,
    processRail: `
.hero{padding:clamp(3rem,7vw,5rem) 0}.title{font-size:clamp(2.4rem,5vw,3.8rem);max-width:16ch}
.rail{display:grid;gap:0;padding:2rem 0 5rem}
.step{display:grid;gap:1rem;padding:2rem 0;border-top:1px solid #e2e8f0}
@media(min-width:800px){.step{grid-template-columns:5rem 1fr 1fr;align-items:start}}
.num{font-size:2rem;color:${a.accent};font-family:var(--font-outfit),sans-serif;font-weight:600}
.features{display:grid;gap:1.25rem;padding:2rem 0 4rem}@media(min-width:800px){.features{grid-template-columns:repeat(2,1fr)}}
.feat{padding:1.25rem 0;border-top:1px solid #e2e8f0}
`,
    challengeSplit: `
.hero{background:#0f172a;color:#fff;padding:clamp(4rem,9vw,7rem) 0}
.title{font-size:clamp(2.5rem,5.5vw,4rem);max-width:14ch;color:#fff}
.split{display:grid;gap:0}@media(min-width:900px){.split{grid-template-columns:1fr 1fr}}
.chal{background:#fff7ed;padding:clamp(2.5rem,5vw,4rem)}.sol{background:#ecfdf5;padding:clamp(2.5rem,5vw,4rem)}
.featGrid{display:grid;gap:1.5rem;padding:clamp(3rem,6vw,5rem) 0}@media(min-width:800px){.featGrid{grid-template-columns:repeat(3,1fr)}}
.shot{aspect-ratio:16/10;border-radius:1rem;margin:1rem 0}
`,
    galleryCinema: `
.page{background:${a.bg};color:${ink}}
.hero{padding:clamp(4rem,10vw,7rem) 0 2rem;text-align:center;max-width:48rem;margin-inline:auto}
.title{font-size:clamp(2.5rem,6vw,4.5rem);color:${ink}}
.reel{display:grid;gap:.75rem;padding:2rem 0 4rem}@media(min-width:700px){.reel{grid-template-columns:repeat(4,1fr)}}
.shot{aspect-ratio:3/4;border-radius:.5rem}.shot:nth-child(even){margin-top:2rem}
@media(max-width:699px){.shot:nth-child(even){margin-top:0}}
.section{padding:clamp(2.5rem,6vw,4rem) 0;border-top:1px solid rgba(255,255,255,0.08)}
.videoGrid{display:grid;gap:1rem}@media(min-width:800px){.videoGrid{grid-template-columns:1fr 1fr}}
`,
    sensorStory: `
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:40rem}.title{font-size:clamp(2.3rem,5vw,3.6rem);max-width:16ch}
.story{display:grid;gap:clamp(2.5rem,6vw,4rem);padding-bottom:5rem}
.block{display:grid;gap:1.5rem}@media(min-width:900px){.block{grid-template-columns:1fr 1fr;align-items:center}}
.blockAlt @media(min-width:900px){}
.shot{aspect-ratio:16/11;border-radius:1rem}
.product{padding:2rem;background:#fff;border-radius:1.25rem;box-shadow:0 20px 50px rgba(15,23,42,.06)}
`,
    compactChecklist: `
.hero{display:grid;gap:2rem;padding:clamp(3rem,7vw,5rem) 0}@media(min-width:900px){.hero{grid-template-columns:1fr 1fr;align-items:center}}
.title{font-size:clamp(2.2rem,4.5vw,3.4rem);max-width:14ch}
.shot{aspect-ratio:4/3;border-radius:1.25rem}
.check{padding:clamp(2rem,5vw,4rem) 0 5rem;max-width:42rem}
`,
    platformWall: `
.page{background:${a.bg};color:${ink}}
.hero{padding:clamp(4rem,9vw,7rem) 0;max-width:44rem}.title{font-size:clamp(2.6rem,5.5vw,4.25rem);color:${ink}}
.wall{display:grid;gap:1px;background:rgba(255,255,255,0.08);margin:2rem 0 4rem;border-radius:1rem;overflow:hidden}
@media(min-width:800px){.wall{grid-template-columns:repeat(3,1fr)}}
.cell{background:#0f172a;padding:1.75rem;min-height:160px}
.mediaRow{display:grid;gap:1rem;padding-bottom:4rem}@media(min-width:800px){.mediaRow{grid-template-columns:repeat(3,1fr)}}
.shot{aspect-ratio:16/11;border-radius:.75rem}
`,
    pastoralGrid: `
.page{background:${a.bg}}
.hero{padding:clamp(3.5rem,8vw,6rem) 0;display:grid;gap:2rem}@media(min-width:900px){.hero{grid-template-columns:1fr 1fr;align-items:end}}
.title{font-size:clamp(2.4rem,5vw,3.8rem);max-width:12ch;color:#1a2e05}
.shot{aspect-ratio:5/4;border-radius:1.5rem 0 1.5rem 0}
.grid{display:grid;gap:1.5rem;padding:2rem 0 4rem}@media(min-width:800px){.grid{grid-template-columns:repeat(2,1fr)}}
.card{padding:1.5rem;background:rgba(255,255,255,.7);border-radius:1rem}
.list{padding:0 0 5rem;max-width:40rem}
`,
    numberedCascade: `
.hero{padding:clamp(3rem,8vw,6rem) 0 1rem}.title{font-size:clamp(2.6rem,6vw,4.5rem);max-width:10ch}
.chapters{display:flex;flex-direction:column;gap:0;padding-bottom:4rem}
.chapter{display:grid;gap:1.5rem;padding:clamp(2.5rem,5vw,4rem) 0;border-top:1px solid #e2e8f0}
@media(min-width:900px){.chapter{grid-template-columns:4rem 1.2fr .8fr}}
.idx{font-size:1.25rem;font-weight:600;color:${a.accent};font-family:var(--font-outfit),sans-serif}
.shot{aspect-ratio:16/11;border-radius:1rem}
.highlights{padding:2rem 0 5rem}
`,
    timelineVertical: `
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:42rem}.title{font-size:clamp(2.3rem,5vw,3.6rem)}
.timeline{position:relative;padding:1rem 0 4rem;margin-left:0}
@media(min-width:800px){.timeline{margin-left:1.5rem;padding-left:2rem;border-left:2px solid #ccfbf1}}
.item{padding:1.5rem 0 1.5rem 0;position:relative}
@media(min-width:800px){.item::before{content:"";position:absolute;left:-2.45rem;top:1.85rem;width:.75rem;height:.75rem;border-radius:999px;background:${a.accent}}}
.featRow{display:grid;gap:1rem;padding:1rem 0 3rem}@media(min-width:700px){.featRow{grid-template-columns:repeat(3,1fr)}}
.mediaRow{display:grid;gap:1rem;padding-bottom:4rem}@media(min-width:800px){.mediaRow{grid-template-columns:repeat(4,1fr)}}
.shot{aspect-ratio:1;border-radius:.75rem}
`,
    scorecard: `
.page{background:${a.bg}}
.hero{padding:clamp(3rem,7vw,5rem) 0;display:grid;gap:2rem}@media(min-width:900px){.hero{grid-template-columns:1.1fr .9fr}}
.title{font-size:clamp(2.4rem,5vw,3.75rem);max-width:12ch}
.shot{aspect-ratio:16/11;border-radius:1.25rem}
.scores{display:grid;gap:1px;background:#a7f3d0;margin:2rem 0;border-radius:1rem;overflow:hidden}
@media(min-width:700px){.scores{grid-template-columns:repeat(3,1fr)}}
.score{background:#ecfdf5;padding:1.5rem;min-height:140px}
.more{padding:2rem 0 5rem}
`,
    miniBleed: `
.hero{position:relative;min-height:52dvh;display:grid;align-items:end;color:#fff;overflow:hidden;background:#0f172a}
.heroInner{position:relative;z-index:1;padding:clamp(3rem,8vw,5rem) 0}
.title{font-size:clamp(2.4rem,5.5vw,3.8rem);max-width:14ch;color:#fff}
.body{max-width:42ch;color:rgba(255,255,255,.75);margin-top:1rem}
.content{padding:clamp(3rem,7vw,5rem) 0 5rem;display:grid;gap:2rem}
@media(min-width:900px){.content{grid-template-columns:1fr 1fr}}
.shot{aspect-ratio:4/3;border-radius:1rem}
`,
    hubSpokes: `
.hero{padding:clamp(3.5rem,8vw,6rem) 0;text-align:center;max-width:44rem;margin-inline:auto}
.title{font-size:clamp(2.5rem,5.5vw,4rem)}
.hub{display:grid;gap:1.5rem;padding:2rem 0 5rem}
.spoke{display:grid;gap:1rem;padding:1.75rem;background:#fff;border-radius:1.25rem;box-shadow:0 10px 40px rgba(15,23,42,.05)}
@media(min-width:800px){.spoke{grid-template-columns:1.2fr .8fr;align-items:center}}
.shot{aspect-ratio:16/11;border-radius:.75rem}
`,
    inspectionDark: `
.page{background:${a.bg};color:${ink}}
.hero{padding:clamp(4rem,9vw,7rem) 0;display:grid;gap:2rem}@media(min-width:900px){.hero{grid-template-columns:1fr 1fr;align-items:center}}
.title{font-size:clamp(2.4rem,5vw,3.8rem);color:${ink}}
.shot{aspect-ratio:4/3;border-radius:1rem}
.benefits{display:grid;gap:1rem;padding:2rem 0 4rem}@media(min-width:800px){.benefits{grid-template-columns:1fr 1fr}}
.benefit{padding:1.5rem;border:1px solid rgba(255,255,255,.1);border-radius:1rem}
.list{padding:0 0 5rem;max-width:40rem}
`,
    dualPanel: `
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:40rem}.title{font-size:clamp(2.3rem,5vw,3.5rem)}
.panels{display:grid;gap:1.5rem;padding:1rem 0 4rem}@media(min-width:900px){.panels{grid-template-columns:1fr 1fr}}
.panel{padding:clamp(1.75rem,3vw,2.5rem);background:#f8fafc;border-radius:1.25rem;display:grid;gap:1rem}
.shot{aspect-ratio:16/11;border-radius:.75rem}
.ctaRow{padding:0 0 5rem}
`,
    formFeature: `
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:36rem}.title{font-size:clamp(2.4rem,5vw,3.6rem)}
.features{display:grid;gap:1.25rem;padding:1rem 0 3rem}@media(min-width:800px){.features{grid-template-columns:repeat(3,1fr)}}
.feat{padding:1.5rem;background:#fff;border-radius:1rem;box-shadow:0 8px 30px rgba(15,23,42,.04)}
.formBand{background:#0f172a;color:#fff;padding:clamp(3rem,7vw,5rem) 0;margin-bottom:0}
.formTitle{font-size:clamp(1.75rem,3vw,2.5rem);color:#fff;max-width:16ch}
`,
    tagWall: `
.hero{padding:clamp(3rem,7vw,5rem) 0;display:grid;gap:2rem}@media(min-width:900px){.hero{grid-template-columns:1fr 1fr;align-items:center}}
.title{font-size:clamp(2.3rem,5vw,3.5rem);max-width:14ch}
.shot{aspect-ratio:4/3;border-radius:1.25rem}
.wall{display:grid;gap:1px;background:#e7e5e4;margin:2rem 0 5rem}
@media(min-width:700px){.wall{grid-template-columns:repeat(3,1fr)}}
.cell{background:#fff;padding:1.5rem;min-height:150px}
`,
    threeAct: `
.act{padding:clamp(3rem,7vw,5.5rem) 0;border-bottom:1px solid #e5e5e5}
.act:last-child{border-bottom:0}
.kicker{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:${a.accent};font-weight:600}
.title{font-size:clamp(2rem,4.5vw,3.2rem);max-width:16ch;margin-top:.75rem}
.layout{display:grid;gap:2rem;margin-top:2rem}@media(min-width:900px){.layout{grid-template-columns:1fr 1fr;align-items:center}}
.shot{aspect-ratio:16/11;border-radius:1rem}
`,
    mosaicSensors: `
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:40rem}.title{font-size:clamp(2.4rem,5vw,3.7rem)}
.mosaic{display:grid;gap:.75rem;padding:1rem 0 3rem}
@media(min-width:800px){.mosaic{grid-template-columns:repeat(6,1fr);grid-auto-rows:120px}}
.m1{grid-column:span 4;grid-row:span 2}.m2{grid-column:span 2;grid-row:span 2}.m3{grid-column:span 2}.m4{grid-column:span 2}.m5{grid-column:span 2}
@media(max-width:799px){.m1,.m2,.m3,.m4,.m5{grid-column:span 1;grid-row:span 1}}
.shot{width:100%;height:100%;border-radius:.75rem;min-height:140px}
.sections{display:grid;gap:clamp(2rem,5vw,3.5rem);padding:2rem 0 5rem}
`,
    bookFeatures: `
.page{background:${a.bg}}
.hero{padding:clamp(3rem,7vw,5rem) 0;max-width:38rem}.title{font-size:clamp(2.4rem,5vw,3.6rem);color:#451a03}
.spread{display:grid;gap:1.5rem;padding:1rem 0 3rem}@media(min-width:900px){.spread{grid-template-columns:1.1fr .9fr}}
.shot{aspect-ratio:3/4;border-radius:1rem .25rem 1rem .25rem}
.features{display:grid;gap:1rem;padding:0 0 4rem}@media(min-width:700px){.features{grid-template-columns:repeat(2,1fr)}}
.feat{padding:1.5rem;background:#fff;border-radius:1rem}
.gallery{display:grid;gap:.75rem;padding-bottom:5rem}@media(min-width:700px){.gallery{grid-template-columns:repeat(4,1fr)}}
.gshot{aspect-ratio:1;border-radius:.5rem}
`,
    stackedDarkCards: `
.page{background:${a.bg};color:${ink}}
.hero{padding:clamp(4rem,9vw,6rem) 0 2rem}.title{font-size:clamp(2.2rem,5vw,3.5rem);color:${ink};max-width:18ch}
.stack{display:flex;flex-direction:column;gap:1rem;padding:1rem 0 4rem}
.card{padding:clamp(1.75rem,3vw,2.5rem);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:1.25rem}
.bodyBand{padding:2rem 0 5rem;max-width:48rem;color:${muted}}
`,
  };

  return `/* archetype: ${archetype} */
.page{background:${a.bg};color:${ink}}
.muted{color:${muted}}
.accent{color:${a.accent}}
${layouts[archetype]}
`;
}

function tsxFor(
  slug: string,
  component: string,
  archetype: Archetype,
): string {
  const a = ACCENTS[archetype];
  const dark = a.dark;

  // Each archetype gets a distinct JSX composition
  const bodies: Record<Archetype, string> = {
    editorialSplit: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow${dark ? " light" : ""}>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={\`\${p.body} \${styles.muted}\`} style={{marginTop:"1.25rem"}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.75rem"}}><DemoCta href={contactHref} label={requestDemoLabel} ${dark ? 'variant="onDark"' : ""} /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.media} priority /> : null}
        </section>
      </Wrap>
      {sections.slice(1).map((sec, i) => (
        <Wrap key={sec.heading?.block.id || i}>
          <section className={styles.band}>
            {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.75rem,3vw,2.5rem)",maxWidth:"18ch"}}>{headingText(sec.heading)}</h2> : null}
            {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
            {sec.videos.length > 0 ? (
              <div className={styles.videoRow} style={{marginTop:"1.5rem"}}>
                {sec.videos.map((v) => (
                  <div key={v.block.id} className={p.media} style={{aspectRatio:"16/9",borderRadius:"1rem"}}>
                    {v.block.videos[0]?.src ? (
                      <video src={v.block.videos[0].src} controls playsInline style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {sec.images.map((img) => <div key={img.block.id} style={{marginTop:"1.25rem"}}><BlockMedia block={img} className={styles.media} /></div>)}
          </section>
        </Wrap>
      ))}
`,
    darkCommand: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={styles.muted} style={{marginTop:"1.25rem",lineHeight:1.7}}>{heroBody}</p> : null}
          <div style={{marginTop:"1.75rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
        </section>
        {lists[0] ? <div className={styles.panel}><IconList block={lists[0]} /></div> : null}
        <div className={styles.mediaStrip}>
          {images.slice(0,3).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
        {sections.slice(1).map((sec, i) => (
          <section key={sec.heading?.block.id || i} className={styles.section}>
            {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.6rem,3vw,2.25rem)",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
            {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
            {sec.images.map((img) => <div key={img.block.id} style={{marginTop:"1.25rem"}}><BlockMedia block={img} className={styles.shot} /></div>)}
          </section>
        ))}
      </Wrap>
`,
    bentoFeatures: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.heroMedia} priority /> : null}
        </section>
        {sections[1]?.bodies[0] ? <div style={{paddingBottom:"1rem"}}><BlockProse block={sections[1].bodies[0]} /></div> : null}
        <div className={styles.bento}>
          {features.map((f, i) => (
            <div key={f.block.id} className={\`\${styles.tile} \${i % 5 === 0 ? styles.tileTall : i % 3 === 0 ? styles.tileWide : styles.tileSm}\`}>
              <FeatureTile block={f} />
            </div>
          ))}
        </div>
      </Wrap>
`,
    mediaCascade: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem",maxWidth:"48ch"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.cascade}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.row} style={i % 2 ? {direction:"rtl"} as React.CSSProperties : undefined}>
              <div style={{direction:"ltr"}}>
                {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.6rem,3vw,2.25rem)"}}>{headingText(sec.heading)}</h2> : null}
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
              </div>
              {sec.images[0] ? <BlockMedia block={sec.images[0]} className={styles.shot} /> : images[i] ? <BlockMedia block={images[i]} className={styles.shot} /> : <div />}
            </div>
          ))}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    processRail: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          {images[0] ? <div style={{marginTop:"2rem"}}><BlockMedia block={images[0]} className={styles.shot} /></div> : null}
        </section>
        <div className={styles.rail}>
          {sections.slice(1).filter(s => headingText(s.heading) || s.bodies.length).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.step}>
              <div className={styles.num}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.5rem"}}>{headingText(sec.heading)}</h2> : null}
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              </div>
              <div>{sec.images[0] ? <BlockMedia block={sec.images[0]} className={styles.shot} /> : null}</div>
            </div>
          ))}
        </div>
        {features.length > 0 ? (
          <div className={styles.features}>
            {features.map((f) => <div key={f.block.id} className={styles.feat}><FeatureTile block={f} /></div>)}
          </div>
        ) : null}
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    challengeSplit: `
      <section className={styles.hero}>
        <Wrap>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p style={{marginTop:"1.1rem",color:"rgba(255,255,255,.75)",maxWidth:"48ch",lineHeight:1.7}}>{heroBody}</p> : null}
        </Wrap>
      </section>
      <div className={styles.split}>
        <div className={styles.chal}>
          <Wrap>
            {sections[1] ? (
              <>
                {headingText(sections[1].heading) ? <h2 className={p.display} style={{fontSize:"1.75rem"}}>{headingText(sections[1].heading)}</h2> : null}
                {sections[1].bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
                {sections[1].images[0] ? <BlockMedia block={sections[1].images[0]} className={styles.shot} /> : null}
              </>
            ) : null}
          </Wrap>
        </div>
        <div className={styles.sol}>
          <Wrap>
            {sections[2] ? (
              <>
                {headingText(sections[2].heading) ? <h2 className={p.display} style={{fontSize:"1.75rem"}}>{headingText(sections[2].heading)}</h2> : null}
                {sections[2].bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
                {sections[2].images[0] ? <BlockMedia block={sections[2].images[0]} className={styles.shot} /> : null}
              </>
            ) : null}
          </Wrap>
        </div>
      </div>
      <Wrap>
        <div className={styles.featGrid}>
          {features.map((f) => <FeatureTile key={f.block.id} block={f} />)}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    galleryCinema: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.reel}>
          {images.slice(0,8).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
        {sections.slice(1).map((sec, i) => (
          <section key={sec.heading?.block.id || i} className={styles.section}>
            {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.5rem,3vw,2.1rem)",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
            {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:"1rem",maxWidth:"60ch"}}><BlockProse block={b} /></div>)}
            {sec.list ? <div style={{marginTop:"1.25rem"}}><IconList block={sec.list} /></div> : null}
            {sec.videos.length > 0 ? (
              <div className={styles.videoGrid} style={{marginTop:"1.5rem"}}>
                {sec.videos.slice(0,4).map((v) => (
                  <div key={v.block.id} style={{aspectRatio:"16/9",borderRadius:".75rem",overflow:"hidden",background:"#111"}}>
                    {v.block.videos[0]?.src ? <video src={v.block.videos[0].src} controls playsInline style={{width:"100%",height:"100%"}} /> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
        <div style={{padding:"2rem 0 4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
      </Wrap>
`,
    sensorStory: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.story}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.block} style={i % 2 === 1 ? {direction:"rtl"} as React.CSSProperties : undefined}>
              <div style={{direction:"ltr"}}>
                {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.5rem,3vw,2.1rem)"}}>{headingText(sec.heading)}</h2> : null}
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:"1rem"}}><BlockProse block={b} /></div>)}
              </div>
              {sec.images[0] ? <BlockMedia block={sec.images[0]} className={styles.shot} /> : images[i] ? <div className={styles.product}><BlockMedia block={images[i]} className={styles.shot} /></div> : <div />}
            </div>
          ))}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    compactChecklist: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.check}>
          {sections[1]?.heading ? <h2 className={p.display} style={{fontSize:"1.75rem",marginBottom:"1.25rem"}}>{headingText(sections[1].heading)}</h2> : null}
          {lists[0] ? <IconList block={lists[0]} /> : null}
          {sections.slice(1).flatMap(s => s.bodies).map((b) => <div key={b.block.id} style={{marginTop:"1.25rem"}}><BlockProse block={b} /></div>)}
        </div>
      </Wrap>
`,
    platformWall: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem",lineHeight:1.7}}>{heroBody}</p> : null}
          <div style={{marginTop:"1.75rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
        </section>
        {images[0] ? <div style={{marginBottom:"2rem"}}><BlockMedia block={images[0]} className={styles.shot} /></div> : null}
        <div className={styles.wall}>
          {features.map((f) => (
            <div key={f.block.id} className={styles.cell}><FeatureTile block={f} /></div>
          ))}
        </div>
        {lists[0] ? <div style={{paddingBottom:"2rem"}}><h2 className={p.display} style={{color:"#fff",fontSize:"1.75rem",marginBottom:"1rem"}}>{headingText(sections[sections.length-1]?.heading)}</h2><IconList block={lists[0]} /></div> : null}
        <div className={styles.mediaRow}>
          {images.slice(1,4).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
      </Wrap>
`,
    pastoralGrid: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.grid}>
          {features.map((f) => <div key={f.block.id} className={styles.card}><FeatureTile block={f} /></div>)}
        </div>
        <div className={styles.list}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginBottom:"2rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.list ? <div style={{marginTop:"1rem"}}><IconList block={sec.list} /></div> : null}
            </div>
          ))}
          <DemoCta href={contactHref} label={requestDemoLabel} />
        </div>
      </Wrap>
`,
    numberedCascade: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem",maxWidth:"48ch"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.chapters}>
          {sections.slice(1).filter(s => headingText(s.heading) || s.bodies.length || s.images.length).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.chapter}>
              <div className={styles.idx}>{String(i + 1).padStart(2,"0")}</div>
              <div>
                {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.4rem,2.5vw,1.9rem)"}}>{headingText(sec.heading)}</h2> : null}
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
                {sec.ctas[0]?.text.ctaLabel ? (
                  <div style={{marginTop:"1rem"}}>
                    <DemoCta href={sec.ctas[0].text.ctaUrl || contactHref} label={sec.ctas[0].text.ctaLabel} />
                  </div>
                ) : null}
                {sec.list ? <div style={{marginTop:"1rem"}}><IconList block={sec.list} /></div> : null}
              </div>
              <div>{sec.images[0] ? <BlockMedia block={sec.images[0]} className={styles.shot} /> : null}</div>
            </div>
          ))}
        </div>
        {images.length > 3 ? (
          <div className={styles.highlights} style={{display:"grid",gap:"1rem",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))"}}>
            {images.slice(1,6).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
          </div>
        ) : null}
      </Wrap>
`,
    timelineVertical: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          {images[0] ? <div style={{marginTop:"2rem"}}><BlockMedia block={images[0]} className={styles.shot} /></div> : null}
        </section>
        {features.length > 0 ? (
          <div className={styles.featRow}>
            {features.map((f) => <FeatureTile key={f.block.id} block={f} />)}
          </div>
        ) : null}
        <div className={styles.mediaRow}>
          {images.slice(1,5).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.shot} />)}
        </div>
        <div className={styles.timeline}>
          {sections.slice(2).filter(s => headingText(s.heading)).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.item}>
              <h2 className={p.display} style={{fontSize:"1.35rem"}}>{headingText(sec.heading)}</h2>
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    scorecard: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.scores}>
          {features.slice(0,6).map((f) => <div key={f.block.id} className={styles.score}><FeatureTile block={f} /></div>)}
        </div>
        <div className={styles.more}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginBottom:"2rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.images[0] ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.images[0]} className={styles.shot} /></div> : null}
            </div>
          ))}
          {features.slice(6).length > 0 ? (
            <div className={styles.scores} style={{marginTop:"1rem"}}>
              {features.slice(6).map((f) => <div key={f.block.id} className={styles.score}><FeatureTile block={f} /></div>)}
            </div>
          ) : null}
          <div style={{marginTop:"2rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
        </div>
      </Wrap>
`,
    miniBleed: `
      <section className={styles.hero}>
        {images[0] ? (
          <div style={{position:"absolute",inset:0}}>
            <BlockMedia block={images[0]} className={styles.shot} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(15,23,42,.88),rgba(15,23,42,.35))"}} />
          </div>
        ) : null}
        <Wrap>
          <div className={styles.heroInner}>
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={styles.body}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
          </div>
        </Wrap>
      </section>
      <Wrap>
        <div className={styles.content}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.6rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.gallery ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.gallery} className={styles.shot} /></div> : null}
            </div>
          ))}
        </div>
      </Wrap>
`,
    hubSpokes: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
        </section>
        <div className={styles.hub}>
          {sections.slice(1).filter(s => headingText(s.heading)).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.spoke}>
              <div>
                <h2 className={p.display} style={{fontSize:"1.45rem"}}>{headingText(sec.heading)}</h2>
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
                {sec.ctas[0]?.text.ctaLabel ? (
                  <div style={{marginTop:"1rem"}}>
                    <DemoCta href={sec.ctas[0].text.ctaUrl || contactHref} label={sec.ctas[0].text.ctaLabel} variant="ghost" />
                  </div>
                ) : null}
              </div>
              {sec.images[0] || images[i] ? <BlockMedia block={sec.images[0] || images[i]} className={styles.shot} /> : null}
            </div>
          ))}
        </div>
      </Wrap>
`,
    inspectionDark: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={styles.muted} style={{marginTop:"1.1rem",lineHeight:1.7}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        <div className={styles.benefits}>
          {sections.slice(1,5).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.benefit}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.35rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
              {sec.images[0] ? <div style={{marginTop:"1rem"}}><BlockMedia block={sec.images[0]} className={styles.shot} /></div> : null}
            </div>
          ))}
        </div>
        <div className={styles.list}>
          {lists[0] ? <IconList block={lists[0]} /> : null}
          {sections.slice(5).map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginTop:"1.5rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.4rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} className={styles.muted} style={{marginTop:".65rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
        </div>
      </Wrap>
`,
    dualPanel: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.panels}>
          {sections.slice(1,3).map((sec, i) => (
            <div key={sec.heading?.block.id || i} className={styles.panel}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.5rem"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <BlockProse key={b.block.id} block={b} />)}
              {(sec.images[0] || images[i]) ? <BlockMedia block={sec.images[0] || images[i]} className={styles.shot} /> : null}
              {sec.ctas[0]?.text.ctaLabel ? (
                <DemoCta href={sec.ctas[0].text.ctaUrl || contactHref} label={sec.ctas[0].text.ctaLabel} />
              ) : null}
            </div>
          ))}
        </div>
        {sections.slice(3).map((sec, i) => (
          <div key={sec.heading?.block.id || i} style={{marginBottom:"2rem"}}>
            {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.5rem"}}>{headingText(sec.heading)}</h2> : null}
            {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
            {sec.images.map((img) => <div key={img.block.id} style={{marginTop:"1rem"}}><BlockMedia block={img} className={styles.shot} /></div>)}
          </div>
        ))}
        <div className={styles.ctaRow}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    formFeature: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.features}>
          {features.map((f) => <div key={f.block.id} className={styles.feat}><FeatureTile block={f} /></div>)}
        </div>
      </Wrap>
      <section className={styles.formBand}>
        <Wrap>
          {sections[sections.length-1]?.heading ? (
            <h2 className={\`\${p.display} \${styles.formTitle}\`}>{headingText(sections[sections.length-1].heading)}</h2>
          ) : null}
          <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" /></div>
        </Wrap>
      </section>
`,
    tagWall: `
      <Wrap>
        <section className={styles.hero}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
            {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
            <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
          </div>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
        </section>
        {sections[1]?.bodies[0] ? <div style={{marginBottom:"1.5rem"}}><BlockProse block={sections[1].bodies[0]} /></div> : null}
        <div className={styles.wall}>
          {features.map((f) => <div key={f.block.id} className={styles.cell}><FeatureTile block={f} /></div>)}
        </div>
      </Wrap>
`,
    threeAct: `
      <Wrap>
        {sections.slice(0,3).map((sec, i) => (
          <section key={sec.heading?.block.id || i} className={styles.act}>
            <p className={styles.kicker}>{String(i + 1).padStart(2,"0")} / 03</p>
            <h2 className={\`\${p.display} \${styles.title}\`}>{headingText(sec.heading) || heroTitle}</h2>
            <div className={styles.layout}>
              <div>
                {sec.bodies.map((b) => <div key={b.block.id} style={{marginBottom:"1rem"}}><BlockProse block={b} /></div>)}
                {i === 0 ? <DemoCta href={contactHref} label={requestDemoLabel} /> : null}
              </div>
              {(sec.images[0] || images[i]) ? <BlockMedia block={sec.images[0] || images[i]} className={styles.shot} /> : null}
            </div>
          </section>
        ))}
      </Wrap>
`,
    mosaicSensors: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
          <div style={{marginTop:"1.5rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
        </section>
        <div className={styles.mosaic}>
          {images.slice(0,5).map((img, i) => (
            <BlockMedia key={img.block.id} block={img} className={\`\${styles.shot} \${styles["m"+(i+1)]}\`} />
          ))}
        </div>
        <div className={styles.sections}>
          {sections.slice(1).map((sec, i) => (
            <div key={sec.heading?.block.id || i}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"clamp(1.5rem,3vw,2.1rem)"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
              {sec.ctas[0]?.text.ctaLabel ? (
                <div style={{marginTop:"1rem"}}>
                  <DemoCta href={sec.ctas[0].text.ctaUrl || contactHref} label={sec.ctas[0].text.ctaLabel} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Wrap>
`,
    bookFeatures: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
          {heroBody ? <p className={p.body} style={{marginTop:"1.1rem"}}>{heroBody}</p> : null}
        </section>
        <div className={styles.spread}>
          {images[0] ? <BlockMedia block={images[0]} className={styles.shot} priority /> : null}
          <div className={styles.features}>
            {features.map((f) => <div key={f.block.id} className={styles.feat}><FeatureTile block={f} /></div>)}
          </div>
        </div>
        <div className={styles.gallery}>
          {images.slice(1).map((img) => <BlockMedia key={img.block.id} block={img} className={styles.gshot} />)}
        </div>
        <div style={{paddingBottom:"4rem"}}><DemoCta href={contactHref} label={requestDemoLabel} /></div>
      </Wrap>
`,
    stackedDarkCards: `
      <Wrap>
        <section className={styles.hero}>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className={\`\${p.display} \${styles.title}\`}>{heroTitle}</h1>
        </section>
        <div className={styles.stack}>
          {features.map((f) => (
            <div key={f.block.id} className={styles.card}><FeatureTile block={f} /></div>
          ))}
        </div>
        <div className={styles.bodyBand}>
          {sections.map((sec, i) => (
            <div key={sec.heading?.block.id || i} style={{marginBottom:"1.5rem"}}>
              {headingText(sec.heading) ? <h2 className={p.display} style={{fontSize:"1.5rem",color:"#fff"}}>{headingText(sec.heading)}</h2> : null}
              {sec.bodies.map((b) => <div key={b.block.id} style={{marginTop:".75rem"}}><BlockProse block={b} /></div>)}
            </div>
          ))}
          <DemoCta href={contactHref} label={requestDemoLabel} variant="onDark" />
        </div>
      </Wrap>
`,
  };

  return `import {
  bodyText,
  headingText,
  resolveAll,
  sectionize,
} from "@/components/solutions/shared/content";
import {
  BlockMedia,
  BlockProse,
  Breadcrumb,
  DemoCta,
  Eyebrow,
  FeatureTile,
  IconList,
  SolutionShell,
  Wrap,
  primitiveStyles as p,
} from "@/components/solutions/shared/primitives";
import type { SolutionLayoutProps } from "@/components/solutions/shared/types";
import { withLocale } from "@/lib/i18n/config";
import styles from "./${component}.module.css";

export function ${component}({
  page,
  locale,
  eyebrow,
  requestDemoLabel,
  contactHref,
}: SolutionLayoutProps) {
  const title = page.titles[locale] || page.titles.en || page.slug;
  const sections = sectionize(page.blocks, locale);
  const images = resolveAll(page.blocks.filter((b) => b.type === "image" || b.type === "gallery"), locale);
  const features = resolveAll(page.blocks.filter((b) => b.type === "featureCard"), locale);
  const lists = resolveAll(page.blocks.filter((b) => b.type === "iconList"), locale);
  const heroTitle = headingText(sections[0]?.heading) || title;
  const heroBody = bodyText(sections[0]?.bodies[0]) || bodyText(sections[1]?.bodies[0]) || "";

  return (
    <SolutionShell className={styles.page}>
      <Wrap>
        <Breadcrumb
          localeHref={withLocale(locale, "/solutions")}
          label={eyebrow}
          title={title}
        />
      </Wrap>
${bodies[archetype]}
    </SolutionShell>
  );
}
`;
}

for (const item of SLUGS) {
  const dir = path.join(ROOT, item.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${item.component}.module.css`),
    cssModule(item.archetype),
  );
  fs.writeFileSync(
    path.join(dir, `${item.component}.tsx`),
    tsxFor(item.slug, item.component, item.archetype),
  );
  console.log("wrote", item.slug, item.archetype);
}

console.log("done", SLUGS.length);
