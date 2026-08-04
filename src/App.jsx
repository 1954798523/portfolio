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
    desc: "基于 RTX 5090 自建 GPU 工作站，部署 ComfyUI + FLUX.1-dev 推理管线，配套 Prompt 工程工具与超分服务，解决非技术人员生图效率问题。",
    tags: ["ComfyUI", "FLUX.1", "Real-ESRGAN", "Potrace", "Streamlit"],
    color: "#a78bfa",
    metrics: [
      { big: "4 服务", lbl: "7×24 稳定运行" },
      { big: "RTX 5090D", lbl: "自建 GPU 算力" },
      { big: "2 LoRA", lbl: "自训练风格模型" },
    ],
    pain: "设计师不熟悉 prompt 语法，生图成功率不足 10%。多个服务（生图、超分、矢量化）分散在不同端口，缺乏统一操作入口，非技术人员使用门槛高。",
    solution: [
      "采购 RTX 5090D 工作站，部署 ComfyUI + FLUX.1-dev 推理环境",
      "开发 Prompt 工程化 HTML 工具，内置 5 条规则、禁用词表、姿势字典",
      "搭建统一入口（8080 端口）+ 超分后端服务（8765 端口）",
      "配置开机自启脚本 + 计划任务 + MWB 远程守护，实现无人值守",
    ],
    img: "FLUX 工具箱界面截图",
  },
  {
    id: "carton",
    name: "外箱尺寸查询系统",
    badge: "LLM Agent",
    desc: "将 101 个分散 Excel 文件中的 353 条产品外箱数据，通过 LLM Agent 实现自然语言查询，集成 QQ Bot 即问即答。",
    tags: ["Hermes", "DeepSeek", "QQ Bot", "Obsidian"],
    color: "#f472b6",
    metrics: [
      { big: "353 条", lbl: "产品尺寸数据" },
      { big: "101 份", lbl: "Excel 源文件" },
      { big: "5 级", lbl: "反馈校准机制" },
    ],
    pain: "产品外箱尺寸数据分散在 101 个 Excel 文件中，格式不统一。员工查询一个产品需要手动翻阅多个文件，平均耗时数分钟，且容易遗漏。",
    solution: [
      "逐一解析 101 个 Excel 文件，适配标签、正则、CBM、固定列等多种格式",
      "输出统一 JSON 数据集（111KB，353 条）作为 LLM 知识注入",
      "采用 LLM 原生方案替代传统搜索引擎，支持模糊匹配与口语化查询",
      "编写 199 行 SOUL.md 行为规范 + 5 级用户反馈闭环 + Obsidian 知识沉淀",
    ],
    decision: '放弃传统搜索引擎方案，采用 LLM 原生理解——"那个圆的圣诞挂件"可直接匹配到对应 SKU。',
    img: "QQ 群对话截图",
  },
  {
    id: "ocr",
    name: "报价单 OCR 自动匹配",
    badge: "桌面工具",
    desc: "针对外贸行业报价单核对场景，开发离线 OCR 桌面工具，将人工 3 小时的核对流程缩短至 30 秒。",
    tags: ["EasyOCR", "tkinter", "PyInstaller", "DeepSeek"],
    color: "#34d399",
    metrics: [
      { big: "3h→30s", lbl: "效率提升 360 倍" },
      { big: "133+29", lbl: "产品 × 报价单" },
      { big: "316MB", lbl: "离线可运行" },
    ],
    pain: "报价单来源多样（拍照、截图、PDF 扫描件），格式不统一。每份报价单约 200 行，人工逐条核对耗时约 3 小时，错误率高。",
    solution: [
      "EasyOCR 离线文字提取，兼容多种图片格式与扫描质量",
      "DeepSeek 结构化信息抽取，比正则表达式容错率更高",
      "tkinter 构建 GUI 界面，PyInstaller 打包为单文件 exe",
      "内置 OCR 模型实现完全离线运行，无需网络依赖",
    ],
    img: "OCR 工具 GUI 界面截图",
  },
  {
    id: "translator",
    name: "AI 提示词翻译官",
    badge: "内部工具",
    desc: "面向非技术同事的 AI 图像生成辅助工具，将口语化中文描述自动转化为专业英文 prompt，降低生图工具使用门槛。",
    tags: ["Qwen-VL", "DeepSeek", "RMBG-2.0", "SPA"],
    color: "#fbbf24",
    metrics: [
      { big: "3 模型", lbl: "视觉+语言+分割" },
      { big: "5 维度", lbl: "结构化 prompt" },
      { big: "单文件", lbl: "无需安装部署" },
    ],
    pain: "公司采购的 AI 平台需要专业 prompt 才能产出可用图像。同事输入口语化描述（如\"好看的杯子\"），生图成功率极低，平台投入未能充分利用。",
    solution: [
      "Qwen-VL 多维度视觉分析参考图（构图、光影、色调等 8 维）",
      "DeepSeek 将口语中文转化为五维英文 prompt（主体、风格、构图、光影、细节）",
      "RMBG-2.0 侧边栏一键抠图，简化产品图处理流程",
      "单 HTML 文件部署，微信发送即可使用，内置反馈系统持续优化",
    ],
    img: "ayw-translator.html 界面",
  },
  {
    id: "diamond",
    name: "钻石画施工模板生成",
    badge: "算法+插件",
    desc: "将图片自动转换为钻石画行业施工色号模板，通过 K-Means 聚类算法替代人工逐色标注，生成 SVG 矢量施工图。",
    tags: ["K-Means", "Lab色彩", "SVG", "ComfyUI插件"],
    color: "#60a5fa",
    metrics: [
      { big: "半日→分钟", lbl: "效率提升" },
      { big: "Lab", lbl: "人眼感知色彩空间" },
      { big: "SVG", lbl: "矢量无损输出" },
    ],
    pain: "钻石画行业需将客户图片转为带色号的施工模板。传统流程由设计师在 Photoshop 中手工分色标注，一张图耗时半天，且不同设计师结果不一致。",
    solution: [
      "采用 CIE Lab 色彩空间 K-Means 聚类，相比 RGB 更接近人眼色彩感知",
      "输出 SVG 矢量格式，每个色块独立 path 并编码色号",
      "封装为 ComfyUI 自定义节点，融入现有生图工作流",
    ],
    img: "原图 vs 施工模板对比",
  },
  {
    id: "pdf",
    name: "PDF 说明书多语言翻译",
    badge: "批处理管线",
    desc: "面向跨境电商产品说明书翻译需求，基于 DeepSeek API 构建批处理翻译管线，单次运行输出 15 种语言译文。",
    tags: ["DeepSeek API", "PDF解析", "术语表"],
    color: "#a78bfa",
    metrics: [
      { big: "15 语言", lbl: "单次批处理输出" },
      { big: "术语表", lbl: "品牌词锁定" },
      { big: "批量", lbl: "自动分段处理" },
    ],
    pain: "产品销往 15 个国家，每份说明书需翻译为 15 种语言。传统翻译公司单语种收费数千元，多语种术语一致性难以保证，且周期长。",
    solution: [
      "PDF 文本提取并保留原文档结构",
      "建立品牌术语表，锁定产品名、技术参数等专有词汇",
      "DeepSeek API 长文档自动切段翻译，避免上下文丢失",
      "一次运行输出 15 份格式一致的译文文档",
    ],
    img: "原文 vs 多语言翻译对照",
  },
  {
    id: "lora",
    name: "LoRA 风格模型训练",
    badge: "模型微调",
    desc: "针对特定风格生图需求，使用 530 张训练数据在消费级显卡上完成 SDXL LoRA 微调，实现风格可控的批量生图。",
    tags: ["OneTrainer", "SDXL", "FLUX.1", "RTX5060"],
    color: "#f472b6",
    metrics: [
      { big: "530 张", lbl: "训练数据集" },
      { big: "2 套", lbl: "线稿+彩色 LoRA" },
      { big: "8GB", lbl: "消费级显卡跑通" },
    ],
    pain: "FLUX 默认出图风格不可控，市面现有 LoRA 无法满足特定风格需求。需在消费级硬件（RTX 5060 8GB）上完成训练，显存限制是主要约束。",
    solution: [
      "收集清洗 530 张风格样本，统一裁剪并人工标注",
      "使用 OneTrainer 框架在 RTX 5060 8GB 显存条件下训练 SDXL LoRA",
      "制定 5 项训练前检查流程（磁盘空间、缓存清理、进程冲突等）",
      "通过 safetensors 元数据记录完整训练参数，确保可复现",
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
    text: "RTX 5090 GPU 工作站搭建，CUDA 环境配置，模型部署与训练硬件平台，7×24 稳定运行。",
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

// ====== PROJECT CARD ======
function ProjectCard({ project, index, onClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * -10, y: cx * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const borderColors = [
    "rgba(167,139,250,0.4),rgba(96,165,250,0.2)",
    "rgba(244,114,182,0.4),rgba(167,139,250,0.2)",
    "rgba(52,211,153,0.4),rgba(96,165,250,0.2)",
    "rgba(251,191,36,0.4),rgba(244,114,182,0.2)",
    "rgba(96,165,250,0.4),rgba(52,211,153,0.2)",
    "rgba(167,139,250,0.4),rgba(251,191,36,0.2)",
    "rgba(244,114,182,0.4),rgba(52,211,153,0.2)",
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      viewport={{ once: true, margin: "-40px" }}
      onClick={() => onClick(project.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out, box-shadow 0.3s",
      }}
    >
      <BorderGlow
        borderRadius={16}
        glowRadius={36}
        backgroundColor="#111118"
        colors={[borderColors[index % borderColors.length].split(",")[0], "#c084fc", "#38bdf8"]}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            cursor: "pointer",
          }}
        >
          {/* Image placeholder */}
          <div
            style={{
              background: `linear-gradient(135deg, #151525, #1c1c32)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px 0 0 16px",
            }}
          >
            <div style={{ fontSize: "0.8em", color: "#888", textAlign: "center", padding: 20, position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: "2.4em", display: "block", marginBottom: 10 }}>{project.badge === "AI 基础设施" ? "🎨" : project.badge === "LLM Agent" ? "🤖" : project.badge === "桌面工具" ? "📋" : project.badge === "内部工具" ? "🌐" : project.badge === "算法+插件" ? "💎" : project.badge === "批处理管线" ? "📄" : "🖼️"}</span>
              {project.img}
              <br />
              <span style={{ fontSize: "0.8em", opacity: 0.5 }}>[截图待替换]</span>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.03), transparent)",
                animation: "shimmer 3s infinite",
              }}
            />
          </div>
          {/* Info */}
          <div style={{ padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.18em", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{project.name}</span>
              <span
                style={{
                  fontSize: "0.68em",
                  fontWeight: 600,
                  color: "#a78bfa",
                  background: "rgba(167,139,250,0.12)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
              >
                {project.badge}
              </span>
            </div>
            <p style={{ color: "#888", fontSize: "0.86em", marginBottom: 12, lineHeight: 1.6 }}>{project.desc}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {project.tags.map((t) => (
                <span key={t} style={{ fontSize: "0.66em", background: "#1a1a2a", color: "#888", padding: "3px 10px", borderRadius: 5, fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
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
        <p style={{ fontSize: "0.72em", color: "#888", marginTop: 18 }}>7 个 AI 项目 · 从需求到交付全流程覆盖</p>
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
                不等资源 · 不限技术栈 · 快速交付。7 个 AI 项目已投产，自建 RTX 5090 GPU 算力平台。
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
                  { end: 7, suffix: "", lbl: "已交付项目" },
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
                    icon: "🎨🤖📋🌐💎📄🖼️"[i] || "🔹",
                    label: p.name,
                    color: p.color,
                  }))}
                />
              </div>

              {/* Capabilities highlight */}
              <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                {[
                  { t: "7 个项目", d: "全部闭环交付\n已在生产环境运行" },
                  { t: "2 个月", d: "平均交付周期\n从需求确认到上线" },
                  { t: "4 个 AI 服务", d: "自建 GPU 服务器 7×24\nComfyUI + ESRGAN + SVG + 工具箱" },
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
