import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import heroLight from "./hero-light.jpg";

const EASE = [0.16, 1, 0.3, 1];

const SERIF = "'Playfair Display','Noto Serif SC','Source Han Serif SC','Songti SC','SimSun',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC',sans-serif";
const LIME = "#d4ff00";
const INK = "#f4f4f2";
const SUB = "#a3a3a3";
const FAINT = "#666";
const LINE = "#1f1f1f";

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
    desc: "将散落在 101 个 Excel 中的产品外箱数据提取、去重整合为知识库，基于 RAG 架构通过 LLM Agent 实现自然语言查询，员工在钉钉私聊机器人即可秒查尺寸。",
    tags: ["Hermes", "RAG", "DeepSeek", "DingTalk Bot", "Obsidian"],
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
      "搭建钉钉企业机器人，建立五级反馈闭环（赞/踩/纠错/补充/标注），数据持续沉淀至知识库，越用越准",
    ],
    decision: '不用搜索引擎，直接 LLM。LLM 能理解"那个圆的圣诞挂件"指哪个 SKU，传统数据库做不到。',
    img: "钉钉对话截图",
  },
  {
    id: "rag",
    name: "保险客服 LLM 全链路",
    badge: "RAG + 模型微调",
    desc: "为保险集团客服机器人构建 RAG+SFT+RLHF 完整技术链路：BGE-M3 双向量检索支撑 6 大客服场景，高频问题响应提速 40%。",
    tags: ["RAG", "BGE-M3", "LoRA", "RLHF", "Qwen"],
    color: "#f97316",
    metrics: [
      { big: "40%", lbl: "高频问题响应提速" },
      { big: "7 万条", lbl: "RLHF 数据对" },
      { big: "6 大", lbl: "客服场景覆盖" },
    ],
    pain: "保险客服面对的是保单查询、条款解读、理赔指引等高专业度问题，回答必须准确、完整、分步骤，还要安抚客户情绪——更不能出现幻觉式承诺。客服日志与保单条款格式各异、非结构化数据量大，传统检索方案召回不准，人工客服压力巨大。",
    solution: [
      "搭建双层向量知识库（保单条款+客服日志），BGE-M3 双向量架构实现 sparse 全库关键词检索 + dense 精排，问答闭环切分策略替代固定窗口切分",
      "自定义 Prompt 模板内置四场景约束（准确性/完整性/步骤化/情绪接纳），防止幻觉与越权承诺",
      "SFT 微调全流程：真实客服日志按完整性/准确性/情绪安抚三维度质量分层筛选，LoRA 2-3 轮迭代，累计 10,000+ 条训练语料",
      "深度参与 10 个标注项目共 70,000 条数据对的 RLHF 强化训练，基于用户点击反馈与会话终止率动态调整回答优先级",
      "\"OCR 图像抽取→RAG 检索整合\"多模态链路：图像类咨询响应从 45 秒降至 36 秒；\"OCR+关键词兜底\"使手写单据提取成功率从 62% 提升至 78%，投诉率下降 8%",
    ],
    decision: "RAG 不是把文档塞进提示词。BGE-M3 双向量 sparse 全库检索 + dense 精排，让保单条款和客服日志各归其位——检索质量决定回答质量。",
    img: "保险客服对话界面截图",
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
    icon: "01",
    en: "END-TO-END",
    title: "端到端交付",
    text: "需求分析到上线运维全流程覆盖。不依赖外部资源，项目不因跨团队协调而卡顿，交付周期缩短 70%。",
  },
  {
    icon: "02",
    en: "FLEXIBLE",
    title: "技术栈灵活",
    text: "Python、React、ComfyUI、DingTalk Bot、桌面应用——根据业务场景选择最优方案，不为技术栈设限。",
  },
  {
    icon: "03",
    en: "SELF-BUILT",
    title: "自建 AI 基础设施",
    text: "自建 GPU 工作站，模型部署与训练硬件平台，7×24 稳定运行，全流程独立可控。",
  },
  {
    icon: "04",
    en: "ITERATE",
    title: "快速验证迭代",
    text: "发现问题当日出原型，用实际反馈驱动迭代，而非文档驱动开发。原型平均 2 天，完整交付约 2 个月。",
  },
];

const SKILLS = [
  { label: "AI 应用落地", w: "92%", note: "LLM Agent · RAG · OCR · 视觉" },
  { label: "计算机视觉", w: "80%", note: "超分 · 矢量化 · LoRA 训练" },
  { label: "全栈开发", w: "85%", note: "Python · HTML/JS · 桌面 GUI" },
  { label: "服务器运维", w: "78%", note: "WinServer · SSH · GPU裸机" },
  { label: "项目管理", w: "95%", note: "需求→设计→开发→部署→交付" },
];

// ====== STARFIELD (twinkling stars + rising lime dust) ======
function FloatingEmbers() {
  const canvasRef = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLit(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = [];
    const starCount = Math.min(120, Math.floor((c.width * c.height) / 17000));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.1 + 0.3,
        base: Math.random() * 0.5 + 0.12,
        speed: Math.random() * 1.1 + 0.25,
        phase: Math.random() * Math.PI * 2,
        lime: Math.random() < 0.08,
      });
    }

    const dust = [];
    for (let i = 0; i < 12; i++) {
      dust.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.2 + 0.5,
        vy: -(Math.random() * 0.22 + 0.06),
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.25 + 0.08,
      });
    }

    let t = 0;
    let anim;
    function draw() {
      t += 0.02;
      ctx.clearRect(0, 0, c.width, c.height);
      // twinkling stars
      for (const s of stars) {
        const a = s.base * (0.45 + 0.55 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.lime ? "#d4ff00" : "#f4f4f2";
        ctx.globalAlpha = Math.max(0, a);
        ctx.fill();
      }
      // rising lime dust
      for (const e of dust) {
        e.y += e.vy;
        e.x += e.vx;
        if (e.y < -10) { e.y = c.height + 10; e.x = Math.random() * c.width; }
        if (e.x < -10) e.x = c.width + 10;
        if (e.x > c.width + 10) e.x = -10;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = "#d4ff00";
        ctx.globalAlpha = e.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      anim = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: lit ? 1 : 0, transition: "opacity 2.6s ease" }} />;
}

// ====== WATCHFUL EYE (pupil follows cursor) ======
function WatchfulEye() {
  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);
  const sx = useSpring(pupilX, { stiffness: 50, damping: 14 });
  const sy = useSpring(pupilY, { stiffness: 50, damping: 14 });
  const wrapRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const max = Math.min(r.width, r.height) * 0.22;
      const dist = Math.hypot(dx, dy) || 1;
      const mag = Math.min(dist / 260, 1) * max;
      pupilX.set((dx / dist) * mag);
      pupilY.set((dy / dist) * mag);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [pupilX, pupilY]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed", right: "4vw", bottom: "6vh",
        width: "clamp(120px, 16vw, 200px)", opacity: 0.5, pointerEvents: "none", zIndex: 1,
      }}
    >
      <svg viewBox="0 0 220 140" style={{ width: "100%", height: "auto", display: "block" }}>
        {/* 眼白 */}
        <ellipse cx={110} cy={70} rx={100} ry={62} fill="none" stroke={INK} strokeWidth={1.4} />
        {/* 虹膜 + 瞳孔（跟随鼠标） */}
        <motion.g style={{ x: sx, y: sy }}>
          <circle cx={110} cy={70} r={34} fill="none" stroke={INK} strokeWidth={1} />
          <circle cx={110} cy={70} r={14} fill="#000" stroke={INK} strokeWidth={1} />
          <circle cx={116} cy={64} r={4} fill={INK} />
        </motion.g>
      </svg>
    </div>
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
        background: LIME,
        width: `${w}%`,
        transition: "width 0.15s linear",
      }}
    />
  );
}

// ====== PROJECT LIST ROW ======
function ProjectRow({ project, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-40px" }}
      onClick={() => onClick(project.id)}
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "clamp(16px, 3vw, 40px)",
        width: "100%",
        padding: "clamp(20px, 3vw, 30px) 8px",
        background: "none",
        border: "none",
        borderTop: `1px solid ${LINE}`,
        cursor: "pointer",
        textAlign: "left",
        color: INK,
        transition: "background 0.25s, padding 0.25s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#0c0c0c"; e.currentTarget.style.paddingLeft = "24px"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "8px"; }}
    >
      <span style={{ fontFamily: SERIF, fontSize: "0.85em", color: FAINT, fontStyle: "italic", flexShrink: 0, width: 40 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ fontFamily: SERIF, fontSize: "clamp(1.3em, 3vw, 1.9em)", fontWeight: 700, letterSpacing: "-0.01em", flex: "1 1 auto", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {project.name}
      </span>
      <span style={{ color: SUB, fontSize: "0.78em", flex: "0 1 34%", minWidth: 0, display: "none" }}>
      </span>
      <span style={{ color: FAINT, fontSize: "0.7em", textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0, display: "none" }}>
        {project.badge}
      </span>
      <span style={{ color: LIME, fontSize: "1.1em", flexShrink: 0, transform: "translateX(0)", transition: "transform 0.25s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(6px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
      >→</span>
    </motion.button>
  );
}

// ====== DIFF STATEMENT (staggered manifesto rows) ======
function DiffStatement({ d, index }) {
  const offset = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
      style={{
        display: "flex",
        gap: "clamp(20px, 4vw, 56px)",
        alignItems: "flex-start",
        padding: "clamp(32px, 5vw, 56px) 8px",
        borderBottom: `1px solid ${LINE}`,
        marginLeft: offset ? "clamp(0px, 8vw, 96px)" : 0,
        marginRight: offset ? 0 : "clamp(0px, 8vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.querySelector(".ds-num").style.color = LIME; }}
      onMouseLeave={(e) => { e.currentTarget.querySelector(".ds-num").style.color = ""; }}
    >
      {/* Giant serif number, bleeding into the title */}
      <span
        className="ds-num"
        style={{
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: "clamp(3em, 7vw, 5em)", fontWeight: 800,
          color: INK, lineHeight: 1, flexShrink: 0,
          position: "relative", zIndex: 0,
          marginRight: -14,
          transition: "color 0.3s",
        }}
      >
        {d.icon}
      </span>

      <div style={{ position: "relative", zIndex: 2, flex: 1, maxWidth: 560 }}>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1.4em, 3.2vw, 2em)", fontWeight: 800, color: INK, letterSpacing: "-0.01em", margin: "6px 0 12px" }}>
          {d.title}
        </h3>
        <p style={{ color: SUB, fontSize: "0.86em", lineHeight: 1.85, margin: 0 }}>{d.text}</p>
      </div>

      {/* Watermark bleeding out of the row */}
      <span
        aria-hidden
        style={{
          position: "absolute", right: offset ? -24 : -48, bottom: -42,
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: "clamp(8em, 20vw, 15em)", fontWeight: 800,
          color: "rgba(244,244,242,0.05)", lineHeight: 1,
          letterSpacing: "-0.04em", pointerEvents: "none",
        }}
      >
        {d.icon}
      </span>
    </motion.div>
  );
}

// ====== KNOWLEDGE GRAPH (force-directed · Obsidian-style, 持续运动) ======
const KG_NODES = [
  { label: "全栈开发", type: "center" },
  { label: "AI 应用", type: "core" },
  { label: "计算机视觉", type: "core" },
  { label: "DeepSeek", type: "tech" },
  { label: "RAG", type: "tech" },
  { label: "Python", type: "tech" },
  { label: "React", type: "tech" },
  { label: "ComfyUI", type: "tech" },
  { label: "OCR", type: "tech" },
  { label: "GPU", type: "tech" },
  { label: "DingTalk", type: "core" },
  { label: "知识库", type: "core" },
  { label: "端到端", type: "core" },
  { label: "自建AI", type: "core" },
  { label: "运维", type: "core" },
  { label: "项目管理", type: "core" },
  { label: "需求分析", type: "core" },
  { label: "迭代交付", type: "core" },
];

const KG_EDGES = [
  [0, 1], [0, 2], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17],
  [1, 3], [1, 4], [1, 5], [1, 6],
  [2, 7], [2, 8], [2, 9],
  [3, 4], [4, 5], [6, 5], [8, 9],
  [10, 11], [10, 4], [11, 3], [11, 13],
  [13, 9], [13, 14], [12, 16], [12, 17], [14, 15], [16, 17],
];

const KG_W = 1000, KG_H = 640;

function kgInit() {
  return KG_NODES.map((n, i) => {
    const angle = (i / KG_NODES.length) * Math.PI * 2;
    const rad = 170 + (i % 3) * 70;
    return {
      ...n,
      x: KG_W / 2 + Math.cos(angle) * rad,
      y: KG_H / 2 + Math.sin(angle) * rad * 0.78,
      vx: 0,
      vy: 0,
    };
  });
}

function kgSimulate(nodes, edges, t) {
  const cx = KG_W / 2, cy = KG_H / 2;
  const repulsion = 5200, spring = 0.01, restLen = 260, gravity = 0.003, damping = 0.9;
  const fx = new Array(nodes.length).fill(0);
  const fy = new Array(nodes.length).fill(0);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = repulsion / (d * d);
      const ux = dx / d, uy = dy / d;
      fx[i] -= ux * f; fy[i] -= uy * f;
      fx[j] += ux * f; fy[j] += uy * f;
    }
  }
  for (let k = 0; k < edges.length; k++) {
    const a = edges[k][0], b = edges[k][1];
    const dx = nodes[b].x - nodes[a].x;
    const dy = nodes[b].y - nodes[a].y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = (d - restLen) * spring;
    const ux = dx / d, uy = dy / d;
    fx[a] += ux * f; fy[a] += uy * f;
    fx[b] -= ux * f; fy[b] -= uy * f;
  }

  return nodes.map((n, i) => {
    let vx = (n.vx + fx[i]) * damping;
    let vy = (n.vy + fy[i]) * damping;
    vx += (cx - n.x) * gravity;
    vy += (cy - n.y) * gravity;
    vx += Math.sin(t * 0.012 + i * 1.7) * 0.06;
    vy += Math.cos(t * 0.012 + i * 2.3) * 0.06;
    let x = n.x + vx;
    let y = n.y + vy;
    x = Math.max(20, Math.min(KG_W - 20, x));
    y = Math.max(30, Math.min(KG_H - 30, y));
    return { ...n, x, y, vx, vy };
  });
}

function GraphView() {
  const nodesRef = useRef(kgInit());
  const timeRef = useRef(0);
  const [, setTick] = useState(0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let raf;
    const step = () => {
      timeRef.current += 1;
      nodesRef.current = kgSimulate(nodesRef.current, KG_EDGES, timeRef.current);
      setTick((t) => t + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nodes = nodesRef.current;
  const hoverSet = hover
    ? new Set([hover, ...KG_EDGES.filter(([a, b]) => a === hover || b === hover).flatMap(([a, b]) => [a, b])])
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ margin: "8px 0 8px" }}
    >
      <svg viewBox={`0 0 ${KG_W} ${KG_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* edges */}
        {KG_EDGES.map(([a, b], i) => {
          const na = nodes[a], nb = nodes[b];
          const active = hoverSet && (hoverSet.has(a) || hoverSet.has(b));
          const dim = hoverSet && !active;
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={active ? LIME : LINE}
              strokeWidth={active ? 1.6 : 1}
              opacity={dim ? 0.05 : active ? 0.95 : 0.45}
              style={{ transition: "opacity 0.3s, stroke 0.3s" }}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n, i) => {
          const dim = hoverSet && !hoverSet.has(i);
          const isHover = hover === i;
          const r = n.type === "center" ? 15 : n.type === "core" ? 10 : 6;
          const fill = n.type === "center" ? LIME : n.type === "core" ? "#000" : "#151515";
          const stroke = n.type === "center" ? LIME : n.type === "core" ? INK : FAINT;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", opacity: dim ? 0.15 : 1, transition: "opacity 0.3s" }}
            >
              {n.type === "center" && (
                <circle cx={n.x} cy={n.y} r={r + 10} fill="none" stroke={LIME} strokeWidth={1} opacity={0.3} />
              )}
              <circle
                cx={n.x} cy={n.y} r={isHover ? r * 1.4 : r}
                fill={fill} stroke={stroke} strokeWidth={n.type === "center" ? 0 : 1.5}
                style={{ transition: "r 0.2s" }}
              />
              {n.type === "center" && (
                <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#000" fontSize={10} fontWeight={700} fontFamily={SANS}>{n.label}</text>
              )}
              {n.type === "core" && (
                <text x={n.x + r + 6} y={n.y + 3} textAnchor="start" fill={INK} fontSize={11} fontFamily={SANS}>{n.label}</text>
              )}
              {n.type === "tech" && (
                <text x={n.x + r + 5} y={n.y + 3} textAnchor="start" fill={SUB} fontSize={9} fontFamily={SANS}>{n.label}</text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ textAlign: "center", color: FAINT, fontSize: "0.72em", letterSpacing: "0.08em", marginTop: 4 }}>
        持续演化的工程知识图谱 · 悬停查看关联
      </div>
    </motion.div>
  );
}

// ====== PROJECT SHOWCASE (staggered split layout) ======
const RATIOS = ["4/3", "1/1", "3/4", "4/3", "1/1", "3/4", "4/3", "1/1"];
const X_OFFSETS = ["0%", "-13%", "9%", "-7%", "11%", "-15%", "6%", "-10%", "4%"];
// 图文排序变体：side 左右 / stack 上下 / vertical 竖排文字
const LAYOUTS = [
  { dir: "row", mode: "side" },
  { dir: "row-reverse", mode: "side" },
  { dir: "column", mode: "stack" },
  { dir: "column-reverse", mode: "stack" },
  { dir: "row", mode: "vertical" },
  { dir: "row-reverse", mode: "vertical" },
  { dir: "row", mode: "side" },
  { dir: "column", mode: "stack" },
  { dir: "row-reverse", mode: "side" },
];

const showcaseContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const textSlide = (reversed) => ({
  hidden: { opacity: 0, x: reversed ? 48 : -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
});
const blockSlide = (reversed) => ({
  hidden: { opacity: 0, x: reversed ? -48 : 48, scale: 0.97, rotate: 0 },
  show: { opacity: 1, x: 0, scale: 1, rotate: reversed ? -1.6 : 1.6, transition: { duration: 0.85, ease: EASE } },
});

function ProjectShowcase({ project, index, onClick }) {
  const layout = LAYOUTS[index % LAYOUTS.length];
  const reversed = layout.dir === "row-reverse";
  const ratio = RATIOS[index % RATIOS.length];
  const [hover, setHover] = useState(false);
  const isStack = layout.mode === "stack";
  const isVertical = layout.mode === "vertical";

  return (
    <motion.div
      variants={showcaseContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      onClick={() => onClick(project.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", marginBottom: "clamp(64px, 10vw, 110px)", marginLeft: X_OFFSETS[index % X_OFFSETS.length] }}
    >
      <div
        style={{
          display: "flex",
          gap: "clamp(24px, 4vw, 64px)",
          flexDirection: layout.dir,
          alignItems: isStack ? "stretch" : "center",
          flexWrap: "wrap",
        }}
      >
        {/* Text side */}
        <motion.div
          variants={textSlide(reversed)}
          style={
            isVertical
              ? { flex: "0 0 auto", width: "auto", maxWidth: 200, maxHeight: 480, writingMode: "vertical-rl", textOrientation: "mixed" }
              : { flex: "1 1 300px", maxWidth: isStack ? 640 : 440, marginRight: reversed ? "auto" : 0, marginLeft: reversed ? 0 : "auto" }
          }
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1em", color: LIME }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.66em", letterSpacing: "0.22em", textTransform: "uppercase", color: FAINT }}>
              {project.badge}
            </span>
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1.6em, 3.5vw, 2.2em)", fontWeight: 800, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 14px" }}>
            {project.name}
          </h3>
          <p style={{ color: SUB, fontSize: "0.9em", lineHeight: 1.8, margin: "0 0 20px" }}>{project.desc}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            {project.tags.slice(0, 4).map((t) => (
              <span key={t} style={{ fontSize: "0.66em", color: SUB, border: `1px solid ${LINE}`, borderRadius: 999, padding: "4px 12px", letterSpacing: "0.04em" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ color: LIME, fontSize: "0.76em", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            查看详情 <span style={{ display: "inline-block", transition: "transform 0.25s", transform: hover ? "translateX(6px)" : "translateX(0)" }}>→</span>
          </div>
        </motion.div>

        {/* Color block (image placeholder) */}
        <motion.div
          variants={blockSlide(reversed)}
          style={{
            flex: isStack ? "1 1 auto" : "1 1 340px",
            maxWidth: isStack ? "100%" : "clamp(420px, 44vw, 760px)",
            aspectRatio: ratio,
            borderRadius: 4,
            background: `linear-gradient(160deg, ${project.color}30, ${project.color}12)`,
            border: `1px solid ${project.color}45`,
            position: "relative",
            overflow: "hidden",
            marginTop: reversed ? "clamp(0px, 4vw, 44px)" : 0,
            marginBottom: reversed ? 0 : "clamp(0px, 4vw, 44px)",
          }}
        >
          {/* eerie concentric ring texture */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          >
            {[...Array(14)].map((_, i) => (
              <circle
                key={i}
                cx={reversed ? 26 : 74}
                cy={reversed ? 74 : 26}
                r={4 + i * 5.2}
                fill="none"
                stroke={project.color}
                strokeOpacity={0.16 - i * 0.01}
                strokeWidth={i % 3 === 0 ? 0.8 : 0.4}
              />
            ))}
          </svg>

          <motion.div
            animate={hover ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "flex-end", justifyContent: "flex-start", padding: "0 0 0 6%",
            }}
          >
            <span
              style={{
                fontFamily: SERIF, fontStyle: "italic",
                fontSize: "clamp(7em, 22vw, 16em)", fontWeight: 800,
                color: `${project.color}40`, letterSpacing: "-0.05em", lineHeight: 0.75,
                transform: "translateY(30%)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </motion.div>
          <div style={{ position: "absolute", bottom: 16, right: 20, color: `${project.color}66`, fontSize: "0.66em", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {project.metrics[0].big} — {project.metrics[0].lbl}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ====== DETAIL PAGE ======
function DetailPage({ project, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: 1080, margin: "0 auto", padding: "140px 32px 80px" }}
    >
      <button
        onClick={onBack}
        style={{
          color: SUB, background: "none", border: "none",
          fontSize: "0.8em", letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: "pointer", marginBottom: 48, padding: 0,
        }}
      >
        ← 返回
      </button>

      <div style={{ marginBottom: 56 }}>
        <div style={{ color: LIME, fontSize: "0.7em", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
          {project.badge} · {String(PROJECTS.findIndex((p) => p.id === project.id) + 1).padStart(2, "0")}
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(2.2em, 6vw, 3.6em)", fontWeight: 800, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>{project.name}</h1>
        <p style={{ color: SUB, fontSize: "1em", maxWidth: 620, lineHeight: 1.8 }}>{project.desc}</p>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: LINE, border: `1px solid ${LINE}`, marginBottom: 56 }}>
        {project.metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            style={{ background: "#000", padding: "26px 24px" }}
          >
            <div style={{ fontFamily: SERIF, fontSize: "clamp(1.8em, 4vw, 2.4em)", fontWeight: 700, color: INK, lineHeight: 1.1, marginBottom: 8 }}>{m.big}</div>
            <div style={{ fontSize: "0.72em", color: FAINT, letterSpacing: "0.06em" }}>{m.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Pain vs Solution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ border: `1px solid ${LINE}`, borderRadius: 4, padding: 28 }}
        >
          <div style={{ fontSize: "0.68em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: LIME, marginBottom: 14 }}>痛点</div>
          <p style={{ color: SUB, fontSize: "0.88em", lineHeight: 1.85 }}>{project.pain}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          viewport={{ once: true }}
          style={{ border: `1px solid ${LINE}`, borderRadius: 4, padding: 28 }}
        >
          <div style={{ fontSize: "0.68em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: INK, marginBottom: 14 }}>方案</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {project.solution.map((s, i) => (
              <li key={i} style={{ color: "#cfcfcb", fontSize: "0.84em", lineHeight: 1.85, paddingLeft: 20, position: "relative", marginBottom: 6 }}>
                <span style={{ position: "absolute", left: 0, top: "0.6em", width: 5, height: 5, borderRadius: "50%", background: LIME }} />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Key decision */}
      {project.decision && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48, padding: "24px 28px", borderLeft: `3px solid ${LIME}`, background: "#0a0a0a" }}
        >
          <div style={{ fontSize: "0.66em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: FAINT, marginBottom: 10 }}>关键决策</div>
          <p style={{ fontFamily: SERIF, color: INK, fontSize: "0.98em", lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>"{project.decision}"</p>
        </motion.div>
      )}

      {/* Tech stack */}
      <div>
        <div style={{ fontSize: "0.66em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: FAINT, marginBottom: 14 }}>技术栈</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {project.tags.map((t) => (
            <span key={t} style={{ fontSize: "0.72em", color: SUB, border: `1px solid ${LINE}`, borderRadius: 999, padding: "5px 14px", letterSpacing: "0.04em" }}>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      style={{ maxWidth: 1080, margin: "0 auto", padding: "140px 32px 80px" }}
    >
      <div style={{ color: LIME, fontSize: "0.7em", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Skills</div>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8em, 4vw, 2.4em)", fontWeight: 800, color: INK, letterSpacing: "-0.02em", marginBottom: 12 }}>技术能力分布</h2>
      <p style={{ color: SUB, marginBottom: 48, fontSize: "0.9em" }}>每项能力均有生产环境项目验证。</p>

      {SKILLS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 20 }}
        >
          <span style={{ width: 140, fontSize: "0.9em", fontWeight: 600, color: INK, flexShrink: 0 }}>{s.label}</span>
          <div style={{ flex: 1, height: 3, background: "#1c1c1c" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: s.w }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
              viewport={{ once: true }}
              style={{ height: "100%", background: LIME }}
            />
          </div>
          <span style={{ fontSize: "0.72em", color: FAINT, width: 190, flexShrink: 0, textAlign: "right" }}>{s.note}</span>
        </motion.div>
      ))}

      <div style={{ marginTop: 80 }}>
        <div style={{ color: LIME, fontSize: "0.66em", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 10 }}>Method</div>
        <h2 style={{ fontFamily: SERIF, fontSize: "1.8em", fontWeight: 800, color: INK, letterSpacing: "-0.01em", marginBottom: 24 }}>工程方法论</h2>
        <div>
          {DIFFS.map((d, i) => (
            <DiffStatement key={d.title} d={d} index={i} />
          ))}
        </div>
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
      style={{ maxWidth: 1080, margin: "0 auto", padding: "140px 32px 80px" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto 64px" }}>
        <div style={{ color: LIME, fontSize: "0.7em", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>About</div>
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8em, 4vw, 2.4em)", fontWeight: 800, color: INK, marginBottom: 32 }}>关于我</h2>

        <div style={{ border: `1px solid ${LINE}`, borderRadius: 4, padding: "40px 36px", background: "#0a0a0a" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(2.4em, 6vw, 3.4em)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              王梓宇
            </div>
            <div style={{ marginTop: 14, fontSize: "0.95em", color: SUB }}>
              AI 应用工程师 · <span style={{ color: LIME }}>让大模型真的去干活，而不是只会聊天</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, background: LINE, border: `1px solid ${LINE}`, marginBottom: 32 }}>
            {[
              { big: "40%", lbl: "高频问题响应提速" },
              { big: "7 万条", lbl: "强化训练数据" },
              { big: "8 个", lbl: "AI 工具上线使用" },
              { big: "1 分半", lbl: "报价单核对耗时" },
            ].map((m, i) => (
              <motion.div
                key={m.lbl}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                style={{ background: "#0a0a0a", padding: "18px 14px" }}
              >
                <div style={{ fontFamily: SERIF, fontSize: "1.5em", fontWeight: 700, color: INK, lineHeight: 1.1, marginBottom: 6 }}>{m.big}</div>
                <div style={{ fontSize: "0.72em", color: FAINT }}>{m.lbl}</div>
              </motion.div>
            ))}
          </div>

          <p style={{ margin: 0, color: "#cfcfcb", fontSize: "0.92em", lineHeight: 1.9 }}>
            保险公司的客服机器人是我从研发一路带到上线的——检索、微调、强化训练都亲手跑过；现在这家公司的 AI 工具也是我一个个攒起来的：从装 GPU 工作站开始，8 个工具全部上线，同事天天在用，外箱尺寸钉钉秒查，报价单核对从一两个小时压到 1 分半。我的习惯：从业务痛点出发选技术，不追名词，每个项目算得清账，需求、开发、部署、教同事用一条龙走完。
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            {["务实", "学得快", "交付完整"].map((k) => (
              <span key={k} style={{ fontSize: "0.78em", fontWeight: 600, color: INK, border: `1px solid ${LINE}`, padding: "6px 18px", borderRadius: 999, letterSpacing: "0.04em" }}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 4, padding: 48, textAlign: "center", background: "#0a0a0a" }}>
          <div style={{ fontFamily: SERIF, fontSize: "1.5em", color: INK, marginBottom: 12, fontWeight: 700 }}>商务合作</div>
          <p style={{ color: SUB, marginBottom: 4, fontSize: "0.9em" }}>所有项目均可提供演示与技术支持</p>
          <p style={{ fontSize: "0.84em", marginTop: 12, color: SUB }}>欢迎沟通技术需求与合作意向</p>
          <p style={{ fontSize: "0.78em", marginTop: 8, color: FAINT }}>远程 / 深圳</p>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="mailto:1954798523@qq.com" style={{ color: LIME, fontSize: "0.95em", fontWeight: 600, textDecoration: "none" }}>
              ✉ 1954798523@qq.com
            </a>
            <span style={{ color: SUB, fontSize: "0.95em" }}>💬 微信：18368283282</span>
          </div>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:1954798523@qq.com"
            style={{
              marginTop: 28, display: "inline-block",
              padding: "14px 40px", borderRadius: 2,
              fontSize: "0.9em", fontWeight: 700, letterSpacing: "0.06em",
              cursor: "pointer", border: "none",
              color: "#000", background: INK,
              textDecoration: "none",
            }}
          >
            获取项目介绍
          </motion.a>
          <p style={{ fontSize: "0.72em", color: FAINT, marginTop: 20 }}>9 个 AI 项目 · 从需求到交付全流程覆盖</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ====== HASH ROUTING ======
function parseHash() {
  const h = window.location.hash;
  if (!h || h === "#" || h === "#/") return { page: "home", detailId: null };
  if (h.startsWith("#/project/")) {
    const id = h.slice("#/project/".length);
    if (PROJECTS.some((p) => p.id === id)) return { page: "detail", detailId: id };
    return { page: "projects", detailId: null };
  }
  const map = { "#/projects": "projects", "#/skills": "skills", "#/contact": "contact" };
  return { page: map[h] || "home", detailId: null };
}

// ====== MAIN APP ======
export default function App() {
  const initial = parseHash();
  const [page, setPage] = useState(initial.page);
  const [detailId, setDetailId] = useState(initial.detailId);
  const [fromPage, setFromPage] = useState("projects");
  const detailProject = detailId ? PROJECTS.find((p) => p.id === detailId) : null;

  useEffect(() => {
    const target = detailId ? `#/project/${detailId}` : page === "home" ? "#/" : `#/${page}`;
    if (window.location.hash !== target) history.replaceState(null, "", target);
  }, [page, detailId]);

  useEffect(() => {
    const onHash = () => {
      const s = parseHash();
      setPage(s.page);
      setDetailId(s.detailId);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const { scrollY } = useScroll();
  const heroShift = useTransform(scrollY, [0, 480], [0, -90]);
  const heroFade = useTransform(scrollY, [0, 420], [1, 0]);

  const goDetail = useCallback((id) => {
    setFromPage(page);
    setDetailId(id);
    setPage("detail");
  }, [page]);

  const goBack = useCallback(() => {
    setDetailId(null);
    setPage(fromPage);
  }, [fromPage]);

  const navItems = [
    { id: "projects", label: "项目" },
    { id: "skills", label: "能力" },
    { id: "contact", label: "联系" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: INK, fontFamily: SANS, lineHeight: 1.7, overflowX: "hidden" }}>
      <FloatingEmbers />
      <WatchfulEye />
      <ScrollProgress />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px clamp(20px, 4.5vw, 72px)" }}>
          <button
            onClick={() => { setDetailId(null); setPage("home"); }}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.28em",
              color: INK, textTransform: "uppercase",
            }}
          >
            王梓宇<span style={{ color: LIME }}>.</span>
          </button>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => { setDetailId(null); setPage(n.id); }}
                style={{
                  color: page === n.id && !detailId ? INK : FAINT,
                  background: "none", border: "none",
                  fontSize: "0.72em", fontWeight: 600, letterSpacing: "0.2em",
                  cursor: "pointer", padding: "4px 0",
                  textTransform: "uppercase",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) => (e.target.style.color = INK)}
                onMouseLeave={(e) => (e.target.style.color = page === n.id && !detailId ? INK : FAINT)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            style={{ padding: "clamp(140px, 20vh, 200px) clamp(20px, 4.5vw, 72px) 80px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}
          >
            {/* 首屏光影人像背景 */}
            <div
              style={{
                position: "absolute", inset: 0, zIndex: 0,
                backgroundImage: `url(${heroLight})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* 暗色遮罩，保证标题可读 */}
            <div
              style={{
                position: "absolute", inset: 0, zIndex: 1,
                background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute", right: "-3vw", top: "50%",
                transform: "translateY(-50%)",
                writingMode: "vertical-rl",
                fontSize: "0.7em", letterSpacing: "0.5em",
                color: FAINT, textTransform: "uppercase",
                opacity: 0.7, pointerEvents: "none", zIndex: 1,
              }}
            >
              王梓宇 · AI 应用工程师
            </span>

            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Act 1-4 — parallax group */}
              <motion.div style={{ y: heroShift, opacity: heroFade }}>
                {/* Act 1 — name line */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
                  style={{ fontSize: "0.72em", letterSpacing: "0.3em", textTransform: "uppercase", color: FAINT, marginBottom: 44, textAlign: "center" }}
                >
                  王梓宇 — <span style={{ color: LIME }}>AI 应用工程师</span>
                </motion.div>

                {/* Act 2 — mega headline, asymmetric editorial + bleeding */}
                <div style={{ marginBottom: 48, position: "relative" }}>
                  {/* Opening lime line */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                    transition={{
                      scaleY: { delay: 0.05, duration: 0.5, ease: "easeInOut" },
                      opacity: { delay: 0.05, duration: 0.55, times: [0, 0.45, 1] },
                    }}
                    style={{
                      position: "absolute", left: "calc(50% - 1px)", top: "-0.2em", bottom: "0.2em",
                      width: 2, background: LIME, transformOrigin: "center top", zIndex: 0,
                    }}
                  />
                  {/* Watermark number bleeding out top-right */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute", right: "-7vw", top: "-0.34em",
                      fontFamily: SERIF, fontStyle: "italic",
                      fontSize: "clamp(9em, 28vw, 24em)", fontWeight: 800,
                      color: "rgba(244,244,242,0.05)", lineHeight: 1,
                      letterSpacing: "-0.05em", pointerEvents: "none", zIndex: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    09
                  </span>

                  <h1
                    style={{
                      fontFamily: SERIF, fontSize: "clamp(3.6em, 16vw, 14em)",
                      fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.86,
                      margin: 0, whiteSpace: "nowrap", position: "relative", zIndex: 1,
                      textAlign: "center",
                    }}
                  >
                    {"THEREFORE".split("").map((ch, i) => (
                      <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                        <motion.span
                          initial={{ y: "1.1em" }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.6 + i * 0.05, duration: 0.75, ease: EASE }}
                          style={{ display: "inline-block" }}
                        >
                          {ch}
                        </motion.span>
                      </span>
                    ))}
                  </h1>

                  <h1
                    style={{
                      fontFamily: SERIF, fontStyle: "italic",
                      fontSize: "clamp(2.6em, 11vw, 9.5em)",
                      fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.9,
                      margin: "0.06em 0 0", whiteSpace: "nowrap", position: "relative", zIndex: 1,
                      textAlign: "center",
                    }}
                  >
                    {"I CREATE".split("").map((ch, i) => (
                        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                          <motion.span
                            initial={{ y: "1.1em" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 1.1 + i * 0.05, duration: 0.7, ease: EASE }}
                            style={{ display: "inline-block" }}
                          >
                            {ch === " " ? " " : ch}
                          </motion.span>
                        </span>
                    ))}
                  </h1>

                  <motion.div
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                    style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1em, 2vw, 1.3em)", color: FAINT, marginTop: 26, position: "relative", zIndex: 1, textAlign: "center" }}
                  >
                    从需求，到交付 —{" "}
                    <span style={{ color: LIME }}>9 tools in production.</span>
                  </motion.div>
                </div>

                {/* Act 3 — tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
                  style={{ fontSize: "clamp(0.92em, 1.4vw, 1.02em)", color: SUB, maxWidth: 760, lineHeight: 1.8, margin: "0 auto 56px", textAlign: "center" }}
                >
                  不等资源 · 不限技术栈 · 快速交付。9 个 AI 项目交付落地，自建 GPU 算力平台。
                </motion.p>

              </motion.div>

              {/* Act 5 — scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.7 }}
                style={{ textAlign: "center", paddingBottom: 40 }}
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: "0.66em", letterSpacing: "0.24em", textTransform: "uppercase", color: FAINT }}
                >
                  ↓ 向下探索
                </motion.div>
              </motion.div>

              {/* Tech stack marquee */}
              <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", marginBottom: 72 }}>
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={{ display: "flex", gap: 40, width: "max-content" }}
                >
                  {[...Array(2)].map((_, round) =>
                    [
                      "ComfyUI", "FLUX.1-dev", "Real-ESRGAN", "Potrace", "Streamlit",
                      "DeepSeek API", "Qwen-VL", "EasyOCR", "PyInstaller", "OneTrainer",
                      "Hermes Gateway", "RAG", "K-Means", "SVG", "Waitress", "Obsidian",
                      "HuggingFace", "SDXL", "LoRA", "tkinter", "RMBG-2.0",
                      "PIL/Pillow", "NumPy", "LANCZOS",
                    ].map((tech, i) => (
                      <span
                        key={`${round}-${i}`}
                        style={{
                          fontFamily: SERIF, fontStyle: "italic",
                          fontSize: "1.05em", fontWeight: 600, color: i % 5 === 0 ? LIME : FAINT,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tech}
                      </span>
                    ))
                  )}
                </motion.div>
              </div>

              {/* Manifesto repeat */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-80px" }}
                style={{ margin: "96px 0 72px", textAlign: "center" }}
              >
                <div style={{ fontFamily: SERIF, fontSize: "clamp(2em, 6vw, 4em)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, color: INK }}>
                  THEREFORE
                  <br />
                  I&nbsp;CREATE<span style={{ color: LIME }}>;</span>
                </div>
              </motion.div>

              {/* Projects showcase */}
              <div style={{ marginTop: 40 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48 }}>
                  <span style={{ color: LIME, fontSize: "0.66em", letterSpacing: "0.24em", textTransform: "uppercase" }}>Selected Work</span>
                  <button
                    onClick={() => setPage("projects")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: FAINT, fontSize: "0.72em", letterSpacing: "0.12em", textTransform: "uppercase", padding: 0 }}
                    onMouseEnter={(e) => (e.target.style.color = INK)}
                    onMouseLeave={(e) => (e.target.style.color = FAINT)}
                  >
                    全部项目 →
                  </button>
                </div>
                {PROJECTS.map((p, i) => (
                  <ProjectShowcase key={p.id} project={p} index={i} onClick={goDetail} />
                ))}
              </div>

              {/* Capabilities highlight */}
              <div style={{ marginTop: 88, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: LINE, border: `1px solid ${LINE}` }}>
                {[
                  { t: "9 个项目", d: "全部闭环交付\n已投入实际使用" },
                  { t: "2 个月", d: "平均交付周期\n从需求确认到上线" },
                  { t: "4 个 AI 服务", d: "自建 GPU 服务器 7×24\n无人值守稳定运行" },
                  { t: "5 项能力", d: "AI 应用 · 计算机视觉\n全栈开发 · 运维 · 项目管理" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    viewport={{ once: true }}
                    style={{ background: "#000", padding: "30px 26px" }}
                  >
                    <div style={{ fontFamily: SERIF, fontSize: "1.15em", fontWeight: 700, color: INK, marginBottom: 10 }}>{item.t}</div>
                    <div style={{ color: SUB, fontSize: "0.82em", lineHeight: 1.75, whiteSpace: "pre-line" }}>{item.d}</div>
                  </motion.div>
                ))}
              </div>

              {/* Differentiators — CoT → ToT → GoT graph */}
              <div style={{ marginTop: 96 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                  <span style={{ width: 44, height: 2, background: LIME, display: "inline-block" }} />
                  <span style={{ color: LIME, fontSize: "0.66em", letterSpacing: "0.24em", textTransform: "uppercase" }}>Core Strengths</span>
                </div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.9em, 3.6vw, 2.6em)", fontWeight: 800, color: INK, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                  全栈工程核心能力
                  <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.5em", color: FAINT, marginLeft: "0.6em" }}>Full-Stack Engineering</span>
                </h2>
                <GraphView />
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ marginTop: 72, textAlign: "center" }}
              >
                <button
                  onClick={() => setPage("contact")}
                  style={{
                    padding: "14px 44px", borderRadius: 2,
                    fontSize: "0.9em", fontWeight: 700, letterSpacing: "0.06em",
                    cursor: "pointer", border: "none",
                    color: "#000", background: INK,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = LIME; }}
                  onMouseLeave={(e) => { e.target.style.background = INK; }}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            style={{ padding: "140px clamp(20px, 4.5vw, 72px) 80px" }}
          >
            <div style={{ color: LIME, fontSize: "0.7em", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Projects</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(1.8em, 4vw, 2.4em)", fontWeight: 800, color: INK, letterSpacing: "-0.02em", marginBottom: 12 }}>每个项目解决一个真实痛点</h2>
            <p style={{ color: SUB, marginBottom: 48, fontSize: "0.9em" }}>没有玩具项目。每个都在生产环境有人用，每个都有量化结果。</p>

            <div>
              {PROJECTS.map((p, i) => (
                <ProjectRow key={p.id} project={p} index={i} onClick={goDetail} />
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

      <footer style={{ borderTop: `1px solid ${LINE}`, padding: "36px 24px", textAlign: "center", color: FAINT, fontSize: "0.76em", letterSpacing: "0.04em" }}>
        © 2026 王梓宇 · AI 应用工程师 ·{" "}
        <a href="mailto:1954798523@qq.com" style={{ color: LIME, textDecoration: "none" }}>1954798523@qq.com</a>
        {" · "}微信 18368283282
      </footer>

      <style>{`
        button:focus { outline: none; }
        button:focus-visible { outline: 2px solid ${LIME}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
