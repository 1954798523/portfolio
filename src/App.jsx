import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import GlassIcons from "./components/GlassIcons";
import BorderGlow from "./components/BorderGlow/BorderGlow";

// ====== DATA ======
const PROJECTS = [
  {
    id: "flux",
    name: "FLUX AI 生图工具链",
    badge: "AI 基础设施",
    desc: "从零搭建 GPU 推理工作站，部署 ComfyUI 管线并开发 Prompt 工程工具，让没有 AI 经验的设计师也能稳定产出高质量图像。",
    tags: ["ComfyUI", "FLUX.1", "Real-ESRGAN", "Potrace", "Streamlit"],
    color: "#a78bfa",
    metrics: [
      { big: "4 个", lbl: "AI 服务持续在线" },
      { big: "7×24", lbl: "GPU 工作站无人值守" },
      { big: "90%+", lbl: "生图可用率" },
    ],
    pain: "公司需要一个 AI 生图能力来支持设计团队，但面临三个障碍：第一，FLUX 等开源模型需要 GPU 硬件和专业部署，公司没有现成基础设施；第二，设计师不熟悉 prompt 语法，输入\"好看的杯子\"这类口语描述，出图可用率不到 10%；第三，生图、超分、矢量化等服务各自独立，没有统一的操作界面。",
    solution: [
      "从零自建 GPU 推理工作站，完成环境配置与生图管线部署，产线正式投入使用",
      "提炼 Prompt 工程方法论：5 条规则 + 禁用词表 + 姿势字典，封装为 HTML 交互界面，员工输入中文需求自动输出专业 prompt",
      "搭建统一操作界面，一套界面完成生图→超分→矢量化全流程，设计师无需切换工具",
      "配置自动启动与远程守护，实现无人值守，4 个 AI 服务持续稳定运行",
    ],
    img: "FLUX 工具箱界面截图",
  },
  {
    id: "carton",
    name: "外箱尺寸查询系统",
    badge: "LLM Agent",
    desc: "将散落在 101 个 Excel 中的产品外箱数据提取、去重整合为知识库，通过 LLM Agent 实现自然语言查询，员工在 QQ 群即可秒查尺寸。",
    tags: ["Hermes", "DeepSeek", "QQ Bot", "Obsidian"],
    color: "#f472b6",
    metrics: [
      { big: "353 条", lbl: "产品外箱数据" },
      { big: "101 个", lbl: "Excel 全量解析" },
      { big: "秒级", lbl: "自然语言查询" },
    ],
    pain: "公司产品的外箱尺寸信息分散在各部门的 101 个 Excel 文件中，格式五花八门——有的用标签页分类，有的用正则匹配，有的固定列布局。员工查一个 SKU 的尺寸要翻几个文件找几分钟，业务高峰期严重拖慢出货节奏。更麻烦的是，这些 Excel 持续更新，没有人知道\"那个圆的圣诞挂件\"对应哪个产品编号。",
    solution: [
      "逐文件解析 101 个 Excel，针对不同格式定制提取逻辑，每个文件单独验证通过",
      "去重后汇总为统一 JSON 数据集（111KB / 353 条），作为 LLM 的知识底座",
      "核心决策：放弃传统数据库查询方案，选择 LLM 原生方案——大模型天然理解模糊描述和口语化表达",
      "搭建 QQ 群机器人，建立五级反馈闭环（赞/踩/纠错/补充/标注），数据持续沉淀至知识库，越用越准",
    ],
    decision: '不用搜索引擎，直接 LLM。LLM 能理解"那个圆的圣诞挂件"指哪个 SKU，传统数据库做不到。',
    img: "QQ 群对话截图",
  },
  {
    id: "ocr",
    name: "报价单 OCR 自动匹配",
    badge: "桌面工具",
    desc: "离线 OCR 桌面工具，自动识别报价单中的产品编号与价格，与内部数据库匹配核对，将 1-2 小时的手工核对压缩到 1.5 分钟。",
    tags: ["EasyOCR", "tkinter", "PyInstaller", "DeepSeek"],
    color: "#34d399",
    metrics: [
      { big: "60×+", lbl: "效率提升" },
      { big: "133", lbl: "内部产品数" },
      { big: "离线", lbl: "无需网络" },
    ],
    pain: "外贸业务中，供应商发来的报价单格式千奇百怪——有人拍照发微信、有人截图 Excel、有人发 PDF 扫描件。每份报价单约 200 行产品，业务员需要手动把报价单上的型号和价格跟内部 133 个产品逐一核对。一份报价单核对下来约 1-2 小时，眼疲劳出错率高，且业务高峰期同时来五六份报价单根本应付不过来。",
    solution: [
      "EasyOCR 离线引擎提取文字，适配拍照、截图、PDF 扫描等多种输入格式，不依赖网络",
      "DeepSeek API 做结构化信息抽取——从 OCR 的脏文本中精准提取产品编号和价格，容错率远超正则匹配",
      "构建图形界面，打包为免安装单文件（内置完整 OCR 模型），业务员双击即用",
      "跨机器部署，解决多页报价单处理、离线模型加载等实际问题，全程无需网络",
    ],
    img: "OCR 工具 GUI 界面截图",
  },
  {
    id: "translator",
    name: "AI 提示词翻译官",
    badge: "内部工具",
    desc: "三模型 AI 管道：视觉分析参考图 → 口语转专业 prompt → 一键抠图。单 HTML 文件，零部署成本，同事收到即可使用。",
    tags: ["Qwen-VL", "DeepSeek", "RMBG-2.0", "SPA"],
    color: "#fbbf24",
    metrics: [
      { big: "3 模型", lbl: "管道协同" },
      { big: "5 维度", lbl: "结构化输出" },
      { big: "1 文件", lbl: "零部署成本" },
    ],
    pain: "团队此前采购的商用 AI 图像平台操作门槛高，非技术同事输入\"好看的杯子\"这类口语描述，生成结果完全不可用——因为 FLUX 这类模型需要 'minimalist ceramic mug, soft studio lighting, 8K, product photography' 这样的专业 prompt。高价采购的平台利用率极低，核心瓶颈在于提示词门槛。",
    solution: [
      "第一环视觉大模型分析：上传参考图 → 自动分析构图、光影、色调、景深、材质、风格、角度、背景 8 个维度",
      "第二环 DeepSeek 语言转换：口语化中文需求 + 视觉分析结果 → 五维英文 prompt（主体+风格+构图+光影+细节）",
      "第三环 RMBG-2.0 智能抠图：侧边栏一键移除背景，直接用于电商白底图",
      "单 HTML 文件架构，无需服务器，同事收到即可使用；内置反馈系统，优质 prompt 模板自动沉淀",
    ],
    img: "ayw-translator.html 界面",
  },
  {
    id: "diamond",
    name: "钻石画施工模板生成",
    badge: "算法+插件",
    desc: "面向钻石画行业，用 K-Means 聚类算法替代设计师手工分色，将图片自动转为带色号编码的 SVG 施工模板，半日工作压缩到分钟级。",
    tags: ["K-Means", "Lab色彩", "SVG", "ComfyUI插件"],
    color: "#60a5fa",
    metrics: [
      { big: "半日→分", lbl: "效率质变" },
      { big: "Lab", lbl: "感知色彩空间" },
      { big: "ComfyUI", lbl: "自定义节点" },
    ],
    pain: "钻石画行业的核心工序是将客户图片转为施工模板——每张图上每个颜色区域都要标注对应色号。传统做法是设计师在 Photoshop 中手工取色、分区域、标色号，一张复杂图片需要半天。不同设计师的分色结果不一致，客户返工率高，产能瓶颈严重。",
    solution: [
      "选用与人眼视觉感知一致的色彩空间做自动聚类分色，结果更接近人工效果",
      "K-Means 聚类算法自动将图片颜色归并为指定数量色块，每个色块独立编码色号",
      "输出 SVG 矢量格式：每个颜色区域一个 path，无损缩放，直接对接生产设备",
      "无缝嵌入团队现有生图工作流，一键完成图片→施工模板全流程",
    ],
    img: "原图 vs 施工模板对比",
  },
  {
    id: "dotmaker",
    name: "圆点点阵生成工具",
    badge: "图像处理",
    desc: "装饰画行业定制：任意图片→等距彩色圆点点阵，原色直出无压缩。从 K-Means 聚类方案迭代至区域平均采样，花叶轮廓清晰可辨。",
    tags: ["PIL/Pillow", "PyInstaller", "NumPy", "超采样"],
    color: "#38bdf8",
    metrics: [
      { big: "32761", lbl: "圆点 (181×181)" },
      { big: "1.4mm", lbl: "圆点直径" },
      { big: "4×", lbl: "细节密度提升" },
    ],
    pain: "钻石画 ComfyUI 节点能生成 SVG 施工模板，但 K-Means 聚类把颜色压到 16 色后丢失了大量细节——花辨不清花瓣、叶看不出叶脉。客户要的不是几种颜色的色块，而是能看清原图内容的点阵效果。91×91 个点根本不够，放大后就是模糊的马赛克。",
    solution: [
      "推翻 K-Means 聚类，改用区域平均直接采样：每个圆点取原图对应网格区域的平均 RGB，不做任何颜色压缩",
      "点径从 2.8mm 降至 1.4mm，格数从 91×91 翻到 181×181（32761 个点），细节是原来的 4 倍",
      "参数可调：画布尺寸、圆点直径、DPI、背景色，改一行适配不同规格",
      "超采样渲染消除锯齿，打包为单文件 EXE，拖拽即用",
    ],
    img: "原图 vs 点阵效果对比",
  },
  {
    id: "pdf",
    name: "PDF 说明书多语言翻译",
    badge: "批处理管线",
    desc: "DeepSeek API 驱动的批处理翻译管线，术语表锁定品牌词，一次运行将产品说明书同时输出 15 种语言，替代昂贵的人工翻译。",
    tags: ["DeepSeek API", "PDF解析", "术语表"],
    color: "#a78bfa",
    metrics: [
      { big: "15 种", lbl: "语言同时输出" },
      { big: "术语表", lbl: "专有词锁定" },
      { big: "批处理", lbl: "无人值守运行" },
    ],
    pain: "跨境电商产品销往 15 个国家，每款产品说明书需翻译为 15 种语言。传统翻译公司单语种收费 2000-5000 元，一款产品翻译费轻松过万。更头疼的是，翻译公司不了解产品术语，同一品牌名在不同语言版本中译法不一致，客户投诉频繁。",
    solution: [
      "PDF 文本提取引擎保留原文档的章节结构、表格和段落，避免翻译后排版错乱",
      "建立品牌术语表（产品名、技术参数、材质描述），翻译过程中锁定专有词汇，确保术语一致性",
      "DeepSeek API 分批处理：长文档自动切段，每段携带上下文窗口，避免语义断裂",
      "单次运行自动输出 15 份格式统一的译文，支持增量更新——原文修改后只需重译变更部分",
    ],
    img: "原文 vs 多语言翻译对照",
  },
  {
    id: "lora",
    name: "LoRA 风格模型训练",
    badge: "模型微调",
    desc: "用 530 张训练样本在消费级 RTX 5060 8GB 显卡上微调 SDXL LoRA，实现特定风格的批量生图，证明小显存也能跑通完整训练流程。",
    tags: ["OneTrainer", "SDXL", "FLUX.1", "RTX5060"],
    color: "#f472b6",
    metrics: [
      { big: "530 张", lbl: "高质量训练集" },
      { big: "2 套", lbl: "线稿 + 彩色" },
      { big: "8GB", lbl: "消费级显卡" },
    ],
    pain: "FLUX 模型的默认出图风格泛化但不可控。业务需要特定风格（如黑白线稿风、水彩风）批量产出，市面上的公开 LoRA 与需求不匹配。业界普遍认为 LoRA 训练需要 24GB 以上显存，但手头只有一张 RTX 5060 8GB 消费级显卡，能不能跑？",
    solution: [
      "数据集构建：收集 530 张目标风格图片，逐一清洗、统一裁剪、人工标注标签，划分为训练集和验证集",
      "选型 SDXL 而非 FLUX 直接训练——SDXL 对低显存更友好，LoRA 权重可桥接至 FLUX 推理",
      "针对 8GB 小显存优化训练配置（梯度检查点、混合精度、小批量），极限硬件下完成训练",
      "建立训练前 5 项检查清单（磁盘空间、缓存清理、ComfyUI 关闭、工作区覆盖、日志重置），防止中途失败浪费算力",
    ],
    img: "训练前后 LoRA 生图对比",
  },
];

const DIFFS = [
  {
    icon: "🔗",
    title: "端到端交付",
    text: "需求分析到上线运维全流程覆盖。不依赖外部资源，项目不因跨团队协调而卡顿，交付周期缩短 70%。",
    color: "#a78bfa",
  },
  {
    icon: "🔧",
    title: "技术栈灵活",
    text: "Python、React、ComfyUI、QQ Bot、桌面应用——根据业务场景选择最优方案，不为技术栈设限。",
    color: "#60a5fa",
  },
  {
    icon: "🖥️",
    title: "自建 AI 基础设施",
    text: "自建 GPU 工作站，模型部署与训练硬件平台，7×24 稳定运行，全流程独立可控。",
    color: "#34d399",
  },
  {
    icon: "⚡",
    title: "快速验证迭代",
    text: "发现问题当日出原型，用实际反馈驱动迭代，而非文档驱动开发。平均 2 天交付可用工具。",
    color: "#fbbf24",
  },
];

const SKILLS = [
  { label: "AI 应用落地", w: "92%", note: "LLM Agent · RAG · OCR · 视觉", colors: ["#a78bfa", "#f472b6"] },
  { label: "计算机视觉", w: "80%", note: "超分 · 矢量化 · LoRA 训练", colors: ["#60a5fa", "#a78bfa"] },
  { label: "全栈开发", w: "85%", note: "Python · HTML/JS · 桌面 GUI", colors: ["#34d399", "#60a5fa"] },
  { label: "服务器运维", w: "78%", note: "WinServer · SSH · GPU裸机", colors: ["#fbbf24", "#f472b6"] },
  { label: "项目管理", w: "95%", note: "需求→设计→开发→部署→交付", colors: ["#a78bfa", "#34d399"] },
];

// ====== PARTICLES CANVAS ======
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let w, h, ps = [], anim;
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 50; i++)
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.1,
      });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.a})`;
        ctx.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j],
            dx = p.x - q.x,
            dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(167,139,250,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      anim = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ====== CURSOR GLOW ======
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    let ticking = false;
    const onMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ref.current.style.left = e.clientX + "px";
          ref.current.style.top = e.clientY + "px";
          ticking = false;
        });
        ticking = true;
      }
    };
    const onLeave = () => (ref.current.style.opacity = "0");
    const onEnter = () => (ref.current.style.opacity = "1");
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        width: 300,
        height: 300,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 0,
        background: "radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%)",
        transform: "translate(-50%,-50%)",
        transition: "opacity 0.3s",
      }}
    />
  );
}

// ====== SCROLL PROGRESS ======
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setW(scrollH > 0 ? (scrollTop / scrollH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 2,
        zIndex: 2000,
        pointerEvents: "none",
        background: "linear-gradient(90deg, #a78bfa, #f472b6, #60a5fa, #34d399)",
        width: `${w}%`,
        transition: "width 0.15s linear",
        borderRadius: "0 2px 2px 0",
      }}
    />
  );
}

// ====== VIDEO BACKGROUND ======
function VideoBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.85,
        }}
        src="./bg.mp4"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,6,12,0.5) 0%, rgba(6,6,12,0.3) 50%, rgba(6,6,12,0.6) 100%)",
        }}
      />
    </div>
  );
}

// ====== AURORA BACKGROUND ======
function AuroraBackground() {
  return (
    <div style={{ position: "absolute", pointerEvents: "none", zIndex: 0, inset: 0, overflow: "hidden" }}>
      {[
        { size: "60vw", color: "hsla(268,100%,76%,0.18)", x: "60%", y: "30%", dur: 28, dx: -80, dy: 60 },
        { size: "45vw", color: "hsla(349,100%,74%,0.15)", x: "20%", y: "50%", dur: 32, dx: 100, dy: -50 },
        { size: "50vw", color: "hsla(192,100%,64%,0.12)", x: "70%", y: "70%", dur: 36, dx: -60, dy: -70 },
        { size: "35vw", color: "hsla(283,100%,70%,0.10)", x: "40%", y: "20%", dur: 24, dx: 70, dy: 40 },
      ].map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            filter: "blur(80px)",
            left: b.x,
            top: b.y,
            transform: "translate(-50%, -50%)",
          }}
          animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * -7 }}
        />
      ))}
    </div>
  );
}

// ====== ROTATING RING ======
function RotatingRing() {
  return (
    <motion.div
      style={{
        position: "absolute",
        pointerEvents: "none",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(70vw, 500px)",
        height: "min(70vw, 500px)",
        zIndex: 0,
        opacity: 0.45,
      }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        style={{ width: "100%", height: "100%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="30%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="url(#ringGrad)" strokeWidth="2.5" />
      </motion.svg>
      <motion.svg
        viewBox="0 0 200 200"
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="84" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5" />
      </motion.svg>
    </motion.div>
  );
}

// ====== FLOATING EMBERS ======
function FloatingEmbers() {
  const embers = useRef([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const rect = c.parentElement.getBoundingClientRect();
    c.width = rect.width;
    c.height = rect.height;

    const count = 30;
    for (let i = 0; i < count; i++) {
      embers.current.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.5 + 0.5,
        vy: -(Math.random() * 0.3 + 0.1),
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.2,
        hue: [268, 349, 192][Math.floor(Math.random() * 3)],
      });
    }

    let anim;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const e of embers.current) {
        e.y += e.vy;
        e.x += e.vx;
        if (e.y < -10) { e.y = c.height + 10; e.x = Math.random() * c.width; }
        if (e.x < -10) e.x = c.width + 10;
        if (e.x > c.width + 10) e.x = -10;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 76%, ${e.alpha})`;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 76%, ${e.alpha})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      anim = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} />;
}

// ====== PROJECT CARD (Poster Style) ======
function ProjectCard({ project, index, onClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * -6, y: cx * 6 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const hero = project.metrics[0];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      viewport={{ once: true, margin: "-40px" }}
      onClick={() => onClick(project.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <BorderGlow
        borderRadius={20}
        glowRadius={40}
        backgroundColor="#0d0d16"
        colors={[project.color, "#c084fc", "#38bdf8"]}
      >
        <motion.div
          whileHover="hover"
          style={{
            padding: "clamp(32px, 5vw, 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
            minHeight: 160,
          }}
        >
          {/* Background gradient blobs */}
          <div style={{
            position: "absolute", top: -60, right: -40,
            width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, ${project.color}22, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: "30%",
            width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${project.color}15, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Left: info */}
          <div style={{ position: "relative", zIndex: 1, flex: "1 1 300px" }}>
            <span style={{
              fontSize: "0.64em", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: project.color, marginBottom: 10,
              background: `${project.color}18`, padding: "4px 10px", borderRadius: 6,
              display: "inline-block",
            }}>
              {project.badge}
            </span>
            <h3 style={{
              fontSize: "clamp(1.3em, 2.5vw, 1.6em)", fontWeight: 800,
              color: "#fff", letterSpacing: "-0.04em", margin: "12px 0 6px",
              lineHeight: 1.2,
            }}>
              {project.name}
            </h3>
            <p style={{
              color: "#777", fontSize: "0.82em", lineHeight: 1.5,
              maxWidth: 420, margin: 0,
            }}>
              {project.desc}
            </p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 14 }}>
              {project.tags.slice(0, 4).map((t, i) => (
                <span key={t} style={{
                  fontSize: "0.64em", fontWeight: 500,
                  color: `color-mix(in srgb, ${project.color} 80%, white)`,
                  background: `${project.color}10`,
                  padding: "3px 10px", borderRadius: 12,
                }}>
                  {t}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span style={{ fontSize: "0.64em", color: "#555", padding: "3px 8px" }}>
                  +{project.tags.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Right: hero metric — poster style */}
          <motion.div
            variants={{ hover: { scale: 1.06 } }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative", zIndex: 1,
              flex: "0 0 auto",
              textAlign: "right",
            }}
          >
            <div style={{
              fontSize: "clamp(3.5em, 8vw, 6em)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              background: `linear-gradient(135deg, ${project.color}, ${(function() {
                const p = project.color;
                if (p === "#a78bfa") return "#c084fc";
                if (p === "#f472b6") return "#f9a8d4";
                if (p === "#34d399") return "#6ee7b7";
                if (p === "#60a5fa") return "#93c5fd";
                if (p === "#fbbf24") return "#fcd34d";
                return "#c084fc";
              })()})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(167,139,250,0.15))",
            }}>
              {hero.big}
            </div>
            <div style={{
              fontSize: "0.72em", color: "#666", fontWeight: 500,
              marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              {hero.lbl}
            </div>
          </motion.div>
        </motion.div>
      </BorderGlow>
    </motion.div>
  );
}

// ====== DETAIL PAGE ======
function DetailPage({ project, onBack }) {
  const accentColors = ["#a78bfa", "#f472b6", "#34d399", "#60a5fa"];
  const statusWidths = ["100%", "97%", "92%", "88%", "84%"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 960, margin: "0 auto", padding: "120px 32px 80px" }}
    >
      <button
        onClick={onBack}
        style={{
          color: "#a78bfa", background: "none", border: "none",
          fontSize: "0.86em", fontWeight: 500, cursor: "pointer",
          marginBottom: 28, display: "inline-flex", alignItems: "center",
          gap: 6, padding: 0,
        }}
      >
        ← 返回
      </button>

      <div style={{ marginBottom: 32 }}>
        <span style={{
          fontSize: "0.68em", fontWeight: 600, color: "#a78bfa",
          background: "rgba(167,139,250,0.12)", padding: "4px 12px",
          borderRadius: 20, marginBottom: 16, display: "inline-block",
        }}>{project.badge}</span>
        <h1 style={{ fontSize: "2.6em", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", margin: "14px 0 10px" }}>{project.name}</h1>
        <p style={{ color: "#888", fontSize: "1em", maxWidth: 600, lineHeight: 1.7 }}>{project.desc}</p>
      </div>

      {/* B — Metrics visualization */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
        {project.metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            style={{
              background: "#0d0d14", border: "1px solid #1e1e30", borderRadius: 14,
              padding: "24px 22px", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${accentColors[i % 4]}, transparent)`,
            }} />
            <div style={{
              fontSize: "clamp(2.2em, 5vw, 2.8em)", fontWeight: 900,
              background: `linear-gradient(135deg, ${accentColors[i % 4]}, ${accentColors[(i + 1) % 4]})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 4,
            }}>
              {m.big}
            </div>
            <div style={{ fontSize: "0.8em", color: "#777", fontWeight: 500 }}>{m.lbl}</div>
            <div style={{
              marginTop: 12, height: 3, background: "#1a1a2a", borderRadius: 2, overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: statusWidths[i % 5] }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  height: "100%", borderRadius: 2,
                  background: `linear-gradient(90deg, ${accentColors[i % 4]}, ${accentColors[(i + 1) % 4]})`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* C — Pain vs Solution comparison */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontSize: "0.74em", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "#666", marginBottom: 16,
        }}>
          问题 → 方案
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              background: "rgba(244,114,182,0.04)", border: "1px solid rgba(244,114,182,0.15)",
              borderRadius: 16, padding: 28, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #f472b6, rgba(244,114,182,0.2))",
            }} />
            <div style={{ fontSize: "0.72em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f472b6", marginBottom: 14 }}>
              ⚠ 痛点
            </div>
            <p style={{ color: "#999", fontSize: "0.88em", lineHeight: 1.8 }}>{project.pain}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)",
              borderRadius: 16, padding: 28, position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #34d399, rgba(52,211,153,0.2))",
            }} />
            <div style={{ fontSize: "0.72em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399", marginBottom: 14 }}>
              ✓ 方案
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {project.solution.map((s, i) => (
                <li key={i} style={{
                  color: "#aaa", fontSize: "0.84em", lineHeight: 1.8,
                  paddingLeft: 20, position: "relative",
                }}>
                  <span style={{
                    position: "absolute", left: 0, top: "0.55em",
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#34d399", opacity: 0.6,
                  }} />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* D — Key decision quote block */}
      {project.decision && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginBottom: 36, padding: "24px 28px",
            background: "rgba(96,165,250,0.04)", borderRadius: 14,
            borderLeft: "3px solid #60a5fa",
          }}
        >
          <div style={{
            fontSize: "0.7em", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "#60a5fa", marginBottom: 10,
          }}>
            关键决策
          </div>
          <p style={{
            color: "#ccc", fontSize: "0.92em", lineHeight: 1.8,
            fontStyle: "italic", margin: 0,
          }}>
            "{project.decision}"
          </p>
        </motion.div>
      )}

      <div>
        <div style={{
          fontSize: "0.7em", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "#666", marginBottom: 12,
        }}>
          技术栈
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tags.map((t, i) => (
            <span key={t} style={{
              fontSize: "0.7em", fontWeight: 500, letterSpacing: "0.02em",
              color: accentColors[i % 4],
              background: `${accentColors[i % 4]}12`,
              padding: "5px 14px", borderRadius: 20,
              border: `1px solid ${accentColors[i % 4]}20`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ====== SKILLS PAGE ======
function SkillsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      style={{ maxWidth: 960, margin: "0 auto", padding: "120px 32px 80px" }}
    >
      <div style={{ fontSize: "0.74em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a78bfa", marginBottom: 10 }}>SKILLS</div>
      <h2 style={{ fontSize: "2em", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8 }}>技术能力分布</h2>
      <p style={{ color: "#888", marginBottom: 40, fontSize: "0.94em" }}>每项能力均有生产环境项目验证。</p>

      {SKILLS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 16 }}
        >
          <span style={{ width: 150, fontSize: "0.86em", fontWeight: 500, color: "#e4e4ee", flexShrink: 0 }}>{s.label}</span>
          <div style={{ flex: 1, height: 5, background: "#1e1e30", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: s.w }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
              style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${s.colors[0]}, ${s.colors[1]})` }}
            />
          </div>
          <span style={{ fontSize: "0.72em", color: "#888", width: 170, flexShrink: 0 }}>{s.note}</span>
        </motion.div>
      ))}

      <h2 style={{ marginTop: 60, fontSize: "1.3em", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>工程方法论</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
        {DIFFS.map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            style={{
              background: "#111118",
              border: "1px solid #1e1e30",
              borderRadius: 14,
              padding: 24,
              cursor: "default",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${d.color}, transparent)`,
                opacity: 0,
                transition: "opacity 0.35s",
              }}
            />
            <div style={{ fontSize: "1.5em", marginBottom: 10 }}>{d.icon}</div>
            <h3 style={{ fontSize: "0.95em", color: "#fff", marginBottom: 8 }}>{d.title}</h3>
            <p style={{ fontSize: "0.82em", color: "#888", lineHeight: 1.65 }}>{d.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ====== CONTACT PAGE ======
function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      style={{ maxWidth: 960, margin: "0 auto", padding: "120px 32px 80px", textAlign: "center" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "inline-block",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <BorderGlow
          borderRadius={18}
          glowRadius={40}
          backgroundColor="#111118"
          animated
          colors={["#c084fc", "#f472b6", "#38bdf8"]}
        >
          <div style={{ padding: 48 }}>
            <h2 style={{ fontSize: "1.4em", color: "#fff", marginBottom: 8 }}>商务合作</h2>
        <p style={{ color: "#888", marginBottom: 4, fontSize: "0.9em" }}>所有项目均可提供演示与技术支持</p>
        <p style={{ fontSize: "0.84em", marginTop: 12, color: "#888" }}>欢迎沟通技术需求与合作意向</p>
        <p style={{ fontSize: "0.8em", marginTop: 8, color: "#888" }}>远程 / 深圳</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: 24,
            padding: "14px 36px",
            borderRadius: 12,
            fontSize: "0.9em",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            color: "#fff",
            background: "linear-gradient(135deg, #a78bfa, #f472b6)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>获取项目介绍</span>
        </motion.button>
        <p style={{ fontSize: "0.72em", color: "#888", marginTop: 18 }}>8 个 AI 项目 · 从需求到交付全流程覆盖</p>
          </div>
        </BorderGlow>
      </motion.div>
    </motion.div>
  );
}

// ====== ANIMATED NUMBER ======
function AnimatedNumber({ end, suffix = "", lbl, delay = 0 }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startAt = performance.now() + delay * 1000;
    const duration = 1200;
    function tick() {
      const elapsed = performance.now() - startAt;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(tick);
      else setVal(end);
    }
    requestAnimationFrame(tick);
  }, [end, delay]);

  return (
    <div style={{
      padding: "0 40px",
      borderLeft: "1px solid #1e1e30",
    }}>
      <div style={{
        fontSize: "clamp(2.4em, 5vw, 3.5em)",
        fontWeight: 900,
        color: "#fff",
        letterSpacing: "-0.05em",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: "0.78em", color: "#888", marginTop: 6 }}>{lbl}</div>
    </div>
  );
}

// ====== MAIN APP ======
export default function App() {
  const [page, setPage] = useState("home");
  const [detailId, setDetailId] = useState(null);
  const detailProject = detailId ? PROJECTS.find((p) => p.id === detailId) : null;

  const goDetail = useCallback((id) => {
    setDetailId(id);
    setPage("detail");
  }, []);

  const goBack = useCallback(() => {
    setDetailId(null);
    setPage("projects");
  }, []);

  const navItems = [
    { id: "projects", label: "项目" },
    { id: "skills", label: "能力" },
    { id: "contact", label: "联系" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#06060c", color: "#e4e4ee", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC',sans-serif", lineHeight: 1.7, overflowX: "hidden" }}>
      <VideoBackground />
      <Particles />
      <CursorGlow />
      <ScrollProgress />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(6,6,12,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #1e1e30",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
          <button
            onClick={() => { setDetailId(null); setPage("home"); }}
            style={{
              fontWeight: 800,
              fontSize: "1em",
              background: "linear-gradient(135deg, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Portfolio
          </button>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => { setDetailId(null); setPage(n.id); }}
                style={{
                  color: page === n.id && !detailId ? "#fff" : "#888",
                  background: "none",
                  border: "none",
                  fontSize: "0.84em",
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: "4px 0",
                  position: "relative",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) => (e.target.style.color = page === n.id && !detailId ? "#fff" : "#888")}
              >
                {n.label}
                {(page === n.id || (page === "detail" && n.id === "projects")) && (
                  <motion.div
                    layoutId="navUnderline"
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 2,
                      borderRadius: 1,
                      background: "linear-gradient(90deg, #a78bfa, #f472b6)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(160px, 22vh, 240px) 32px 80px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}
          >
            <AuroraBackground />

            <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
              <RotatingRing />
              <FloatingEmbers />
            </div>

            <div style={{ position: "relative", zIndex: 3 }}>
              {/* Act 1 — subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ delay: 0.3, duration: 0.7 }}
                style={{
                  fontSize: "clamp(0.72em, 1.5vw, 0.85em)",
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  color: "#666",
                  marginBottom: 24,
                  textTransform: "uppercase",
                }}
              >
                AI 应用 · 工具开发 · 模型工程
              </motion.div>

              {/* Act 2 — role */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  fontSize: "clamp(1em, 2.5vw, 1.3em)",
                  fontWeight: 300,
                  color: "#ccc",
                  letterSpacing: "0.04em",
                  marginBottom: 32,
                }}
              >
                AI 全栈开发
              </motion.div>

              {/* Act 3 — mega headline */}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)", scale: 1 }}
                transition={{ delay: 1.0, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: 32 }}
              >
                <h1
                  style={{
                    fontSize: "clamp(4em, 10vw, 8em)",
                    fontWeight: 900,
                    letterSpacing: "-0.07em",
                    lineHeight: 0.9,
                    margin: 0,
                    background: "linear-gradient(135deg, #f472b6 0%, #a78bfa 35%, #60a5fa 70%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradientShift 4s ease infinite",
                    filter: "drop-shadow(0 0 30px rgba(167,139,250,0.3))",
                  }}
                >
                  从需求
                  <br />
                  到交付
                </h1>
              </motion.div>

              {/* Act 4 — tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.7 }}
                style={{
                  fontSize: "clamp(0.9em, 1.5vw, 1.05em)",
                  color: "#888",
                  maxWidth: 520,
                  lineHeight: 1.7,
                  marginBottom: 48,
                }}
              >
                不等资源 · 不限技术栈 · 快速交付。8 个 AI 项目落地使用，自建 GPU 算力平台。
              </motion.p>

              {/* Act 5 — stats with count-up */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.7 }}
                style={{
                  display: "flex",
                  gap: "clamp(32px, 6vw, 72px)",
                  flexWrap: "wrap",
                  marginBottom: 64,
                }}
              >
                {[
                  { end: 8, suffix: "", lbl: "已交付项目" },
                  { end: 2, suffix: " 月", lbl: "平均交付周期" },
                ].map((stat, i) => (
                  <AnimatedNumber key={i} delay={2.2 + i * 0.2} {...stat} />
                ))}
              </motion.div>

              {/* Act 6 — scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.0, duration: 0.8 }}
                style={{
                  textAlign: "center",
                  paddingBottom: 40,
                }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    fontSize: "0.7em",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#555",
                  }}
                >
                  ↓ 向下探索
                </motion.div>
              </motion.div>

              {/* Tech stack marquee */}
              <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", marginBottom: 64 }}>
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={{ display: "flex", gap: 32, width: "max-content" }}
                >
                  {[...Array(2)].map((_, round) =>
                    [
                      "ComfyUI", "FLUX.1-dev", "Real-ESRGAN", "Potrace", "Streamlit",
                      "DeepSeek API", "Qwen-VL", "EasyOCR", "PyInstaller", "OneTrainer",
                      "Hermes Gateway", "K-Means", "SVG", "Waitress", "Obsidian",
                      "HuggingFace", "SDXL", "LoRA", "tkinter", "RMBG-2.0",
                      "PIL/Pillow", "NumPy", "LANCZOS",
                    ].map((tech, i) => (
                      <span
                        key={`${round}-${i}`}
                        style={{
                          fontSize: "0.9em",
                          fontWeight: 600,
                          color: i % 4 === 0 ? "#a78bfa" : i % 4 === 1 ? "#f472b6" : i % 4 === 2 ? "#60a5fa" : "#34d399",
                          whiteSpace: "nowrap",
                          opacity: 0.7,
                        }}
                      >
                        {tech}
                      </span>
                    ))
                  )}
                </motion.div>
              </div>

              {/* About section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ maxWidth: 720, margin: "0 auto", marginTop: 80 }}
              >
                <div style={{ fontSize: "0.74em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a78bfa", marginBottom: 10 }}>ABOUT</div>
                <h2 style={{ fontSize: "1.4em", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 20 }}>关于我</h2>
                <div style={{ background: "#111118", border: "1px solid #1e1e30", borderRadius: 16, padding: "28px 32px", lineHeight: 1.9, color: "#aaa", fontSize: "0.92em" }}>
                  <p style={{ margin: "0 0 12px" }}>
                    我是 <span style={{ color: "#fff", fontWeight: 600 }}>王梓宇</span>,AI 应用工程师,干的事一句话:<span style={{ color: "#a78bfa" }}>让大模型真的去干活,而不是只会聊天</span>。
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    保险公司的客服机器人是我从研发一路带到上线的——检索、微调、7 万条数据的强化训练都亲手跑过,高频问题响应快了 40%。这个数字我一直记着,因为它说明我做的事真的有用。现在这家公司的 AI 工具也是我一个个攒起来的:从装 GPU 工作站开始,8 个工具全部上线,同事天天在用——外箱尺寸 QQ 群秒查,报价单核对从一两个小时压到 1 分半。
                  </p>
                  <p style={{ margin: 0 }}>
                    我的工作习惯:从业务痛点出发选技术,不追名词,每个项目算得清账;需求、开发、部署、教同事用,一条龙自己走完。
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
                  {["务实", "学得快", "交付完整"].map((k) => (
                    <span key={k} style={{ fontSize: "0.8em", fontWeight: 600, color: "#e4e4ee", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", padding: "6px 16px", borderRadius: 20 }}>{k}</span>
                  ))}
                </div>
              </motion.div>

              {/* GlassIcons - Project navigation */}
              <div
                style={{ marginTop: 60 }}
                onClick={(e) => {
                  const btn = e.target.closest(".icon-btn");
                  if (!btn) return;
                  const idx = Array.from(btn.parentElement.children).indexOf(btn);
                  if (idx >= 0 && idx < PROJECTS.length) goDetail(PROJECTS[idx].id);
                }}
              >
                <GlassIcons
                  items={PROJECTS.map((p, i) => ({
                    icon: "🎨🤖📋🌐💎📄🖼️🔵"[i] || "🔹",
                    label: p.name,
                    color: p.color,
                  }))}
                />
              </div>

              {/* Capabilities highlight */}
              <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                {[
                  { t: "8 个项目", d: "全部闭环交付\n已投入实际使用" },
                  { t: "2 个月", d: "平均交付周期\n从需求确认到上线" },
                  { t: "4 个 AI 服务", d: "自建 GPU 服务器 7×24\n无人值守稳定运行" },
                  { t: "5 项能力", d: "AI 应用 · 计算机视觉\n全栈开发 · 运维 · 项目管理" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    style={{
                      background: "linear-gradient(135deg, rgba(167,139,250,0.04), rgba(244,114,182,0.04))",
                      border: "1px solid #1e1e30",
                      borderRadius: 16,
                      padding: "28px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.3em", fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
                      {item.t}
                    </div>
                    <div style={{ color: "#888", fontSize: "0.84em", lineHeight: 1.7, whiteSpace: "pre-line" }}>{item.d}</div>
                  </motion.div>
                ))}
              </div>

              {/* Differentiators */}
              <h2 style={{ marginTop: 80, fontSize: "1.4em", fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.03em" }}>
                <span style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>全栈工程</span>核心能力
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28, maxWidth: 760, margin: "28px auto 0" }}>
                {DIFFS.map((d, i) => (
                  <motion.div
                    key={d.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, borderColor: "rgba(167,139,250,0.4)" }}
                    style={{
                      background: "#111118",
                      border: "1px solid #1e1e30",
                      borderRadius: 14,
                      padding: 22,
                      cursor: "default",
                      transition: "all 0.3s",
                    }}
                  >
                    <div style={{ fontSize: "1.3em", marginBottom: 8 }}>{d.icon}</div>
                    <h3 style={{ fontSize: "0.92em", color: "#fff", marginBottom: 6 }}>{d.title}</h3>
                    <p style={{ fontSize: "0.8em", color: "#888", lineHeight: 1.6 }}>{d.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ marginTop: 64, textAlign: "center" }}
              >
                <button
                  onClick={() => setPage("contact")}
                  style={{
                    padding: "14px 36px",
                    borderRadius: 12,
                    fontSize: "0.95em",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    color: "#fff",
                    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(167,139,250,0.35)"; }}
                  onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
                >
                  获取项目介绍
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {page === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 32px 80px" }}
          >
            <div style={{ fontSize: "0.74em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a78bfa", marginBottom: 10 }}>PROJECTS</div>
            <h2 style={{ fontSize: "2em", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8 }}>每个项目解决一个真实痛点</h2>
            <p style={{ color: "#888", marginBottom: 40, fontSize: "0.94em" }}>没有玩具项目。每个都在生产环境有人用，每个都有量化结果。</p>

            <div style={{ display: "grid", gap: 18 }}>
              {PROJECTS.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onClick={goDetail} />
              ))}
            </div>
          </motion.div>
        )}

        {page === "detail" && detailProject && (
          <DetailPage key={`detail-${detailId}`} project={detailProject} onBack={goBack} />
        )}

        {page === "skills" && <SkillsPage key="skills" />}

        {page === "contact" && <ContactPage key="contact" />}
      </AnimatePresence>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        button:focus { outline: none; }
        button:focus-visible { outline: 2px solid #a78bfa; outline-offset: 2px; border-radius: 4px; }
      `}</style>
    </div>
  );
}
