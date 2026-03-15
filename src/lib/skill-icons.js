import {
  BotMessageSquare,
  ChartColumnIncreasing,
  ChartNetwork,
  ChartScatter,
  Code2,
  GitBranchPlus,
  Network,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';
import {
  SiAngular,
  SiApachespark,
  SiAstro,
  SiBootstrap,
  SiChartdotjs,
  SiCloudflare,
  SiCplusplus,
  SiCss,
  SiDart,
  SiDigitalocean,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiFramer,
  SiGit,
  SiGithub,
  SiGo,
  SiGooglecloud,
  SiGraphql,
  SiHtml5,
  SiHuggingface,
  SiJavascript,
  SiJsonwebtokens,
  SiJupyter,
  SiKeras,
  SiKotlin,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNotebooklm,
  SiNpm,
  SiNuxt,
  SiNumpy,
  SiOpenai,
  SiPandas,
  SiPhp,
  SiPnpm,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiRedux,
  SiRemix,
  SiScikitlearn,
  SiShopify,
  SiSocketdotio,
  SiStripe,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiUbuntu,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWordpress,
  SiYarn,
} from 'react-icons/si';

export const techIconLibrary = [
  { value: 'javascript', label: 'JavaScript', category: 'Frontend', icon: SiJavascript, color: '#F7DF1E', aliases: ['js'] },
  { value: 'typescript', label: 'TypeScript', category: 'Frontend', icon: SiTypescript, color: '#3178C6', aliases: ['ts'] },
  { value: 'html5', label: 'HTML5', category: 'Frontend', icon: SiHtml5, color: '#E34F26', aliases: ['html'] },
  { value: 'css', label: 'CSS3', category: 'Frontend', icon: SiCss, color: '#1572B6', aliases: ['css3'] },
  { value: 'react', label: 'React', category: 'Frontend', icon: SiReact, color: '#61DAFB' },
  { value: 'nextjs', label: 'Next.js', category: 'Frontend', icon: SiNextdotjs, color: '#FFFFFF', aliases: ['next', 'nextdotjs'] },
  { value: 'vite', label: 'Vite', category: 'Frontend', icon: SiVite, color: '#646CFF' },
  { value: 'nuxt', label: 'Nuxt', category: 'Frontend', icon: SiNuxt, color: '#00DC82', aliases: ['nuxtjs'] },
  { value: 'vue', label: 'Vue.js', category: 'Frontend', icon: SiVuedotjs, color: '#4FC08D', aliases: ['vuejs'] },
  { value: 'angular', label: 'Angular', category: 'Frontend', icon: SiAngular, color: '#DD0031' },
  { value: 'svelte', label: 'Svelte', category: 'Frontend', icon: SiSvelte, color: '#FF3E00' },
  { value: 'tailwindcss', label: 'Tailwind CSS', category: 'Frontend', icon: SiTailwindcss, color: '#06B6D4', aliases: ['tailwind'] },
  { value: 'bootstrap', label: 'Bootstrap', category: 'Frontend', icon: SiBootstrap, color: '#7952B3' },
  { value: 'astro', label: 'Astro', category: 'Frontend', icon: SiAstro, color: '#BC52EE' },
  { value: 'remix', label: 'Remix', category: 'Frontend', icon: SiRemix, color: '#FFFFFF' },
  { value: 'framer', label: 'Framer Motion', category: 'Frontend', icon: SiFramer, color: '#FFFFFF', aliases: ['framermotion', 'motion'] },
  { value: 'nodejs', label: 'Node.js', category: 'Backend', icon: SiNodedotjs, color: '#5FA04E', aliases: ['node', 'nodedotjs'] },
  { value: 'express', label: 'Express', category: 'Backend', icon: SiExpress, color: '#FFFFFF', aliases: ['expressjs'] },
  { value: 'laravel', label: 'Laravel', category: 'Backend', icon: SiLaravel, color: '#FF2D20' },
  { value: 'php', label: 'PHP', category: 'Backend', icon: SiPhp, color: '#777BB4' },
  { value: 'python', label: 'Python', category: 'Backend', icon: SiPython, color: '#3776AB' },
  { value: 'django', label: 'Django', category: 'Backend', icon: SiDjango, color: '#092E20' },
  { value: 'flask', label: 'Flask', category: 'Backend', icon: SiFlask, color: '#FFFFFF' },
  { value: 'graphql', label: 'GraphQL', category: 'Backend', icon: SiGraphql, color: '#E10098' },
  { value: 'socketio', label: 'Socket.IO', category: 'Backend', icon: SiSocketdotio, color: '#FFFFFF', aliases: ['socket.io'] },
  { value: 'jwt', label: 'JWT', category: 'Backend', icon: SiJsonwebtokens, color: '#FFFFFF', aliases: ['jsonwebtokens'] },
  { value: 'mysql', label: 'MySQL', category: 'Database', icon: SiMysql, color: '#4479A1' },
  { value: 'postgresql', label: 'PostgreSQL', category: 'Database', icon: SiPostgresql, color: '#4169E1', aliases: ['postgres'] },
  { value: 'mongodb', label: 'MongoDB', category: 'Database', icon: SiMongodb, color: '#47A248', aliases: ['mongo'] },
  { value: 'redis', label: 'Redis', category: 'Database', icon: SiRedis, color: '#FF4438' },
  { value: 'prisma', label: 'Prisma', category: 'Database', icon: SiPrisma, color: '#2D3748' },
  { value: 'firebase', label: 'Firebase', category: 'Database', icon: SiFirebase, color: '#DD2C00' },
  { value: 'supabase', label: 'Supabase', category: 'Database', icon: SiSupabase, color: '#3ECF8E' },
  { value: 'docker', label: 'Docker', category: 'DevOps', icon: SiDocker, color: '#2496ED' },
  { value: 'nginx', label: 'Nginx', category: 'DevOps', icon: SiNginx, color: '#009639' },
  { value: 'vercel', label: 'Vercel', category: 'DevOps', icon: SiVercel, color: '#FFFFFF' },
  { value: 'netlify', label: 'Netlify', category: 'DevOps', icon: SiNetlify, color: '#00C7B7' },
  { value: 'cloudflare', label: 'Cloudflare', category: 'DevOps', icon: SiCloudflare, color: '#F38020' },
  { value: 'googlecloud', label: 'Google Cloud', category: 'DevOps', icon: SiGooglecloud, color: '#4285F4', aliases: ['gcp'] },
  { value: 'digitalocean', label: 'DigitalOcean', category: 'DevOps', icon: SiDigitalocean, color: '#0080FF' },
  { value: 'git', label: 'Git', category: 'Tools', icon: SiGit, color: '#F05032' },
  { value: 'github', label: 'GitHub', category: 'Tools', icon: SiGithub, color: '#FFFFFF' },
  { value: 'npm', label: 'npm', category: 'Tools', icon: SiNpm, color: '#CB3837' },
  { value: 'yarn', label: 'Yarn', category: 'Tools', icon: SiYarn, color: '#2C8EBB' },
  { value: 'pnpm', label: 'pnpm', category: 'Tools', icon: SiPnpm, color: '#F69220' },
  { value: 'postman', label: 'Postman', category: 'Tools', icon: SiPostman, color: '#FF6C37' },
  { value: 'figma', label: 'Figma', category: 'Tools', icon: SiFigma, color: '#F24E1E' },
  { value: 'openai', label: 'OpenAI', category: 'Tools', icon: SiOpenai, color: '#FFFFFF', aliases: ['chatgpt'] },
  { value: 'redux', label: 'Redux', category: 'Tools', icon: SiRedux, color: '#764ABC' },
  { value: 'linux', label: 'Linux', category: 'Tools', icon: SiLinux, color: '#FCC624' },
  { value: 'ubuntu', label: 'Ubuntu', category: 'Tools', icon: SiUbuntu, color: '#E95420' },
  { value: 'jupyter', label: 'Jupyter Notebook', category: 'AI & Data', icon: SiJupyter, color: '#F37626', aliases: ['notebook', 'jupyternotebook'] },
  { value: 'notebooklm', label: 'NotebookLM', category: 'AI & Data', icon: SiNotebooklm, color: '#8AB4F8', aliases: ['notebook llm', 'google notebooklm'] },
  { value: 'llm', label: 'LLM', category: 'AI & Data', icon: BotMessageSquare, color: '#A78BFA', aliases: ['largelanguagemodel', 'large language model'] },
  { value: 'machinelearning', label: 'Machine Learning', category: 'AI & Data', icon: Network, color: '#22C55E', aliases: ['ml'] },
  { value: 'deeplearning', label: 'Deep Learning', category: 'AI & Data', icon: ChartNetwork, color: '#38BDF8', aliases: ['deep learning'] },
  { value: 'cnn', label: 'CNN', category: 'AI & Data', icon: ChartNetwork, color: '#0EA5E9', aliases: ['convolutionalneuralnetwork', 'convolutional neural network'] },
  { value: 'svm', label: 'SVM', category: 'AI & Data', icon: ChartScatter, color: '#F97316', aliases: ['sv', 'supportvectormachine', 'support vector machine'] },
  { value: 'xgboost', label: 'XGBoost', category: 'AI & Data', icon: ChartColumnIncreasing, color: '#EF4444', aliases: ['gradientboosting'] },
  { value: 'yolo', label: 'YOLO', category: 'AI & Data', icon: ScanSearch, color: '#EAB308', aliases: ['youonlylookonce', 'computer vision'] },
  { value: 'forwardchaining', label: 'Forward Chaining', category: 'AI & Data', icon: GitBranchPlus, color: '#14B8A6', aliases: ['forward chaining'] },
  { value: 'certaintyfactor', label: 'Certainty Factor', category: 'AI & Data', icon: ShieldCheck, color: '#F59E0B', aliases: ['certainy factor', 'certainty factor'] },
  { value: 'tensorflow', label: 'TensorFlow', category: 'AI & Data', icon: SiTensorflow, color: '#FF6F00' },
  { value: 'pytorch', label: 'PyTorch', category: 'AI & Data', icon: SiPytorch, color: '#EE4C2C' },
  { value: 'keras', label: 'Keras', category: 'AI & Data', icon: SiKeras, color: '#D00000' },
  { value: 'scikitlearn', label: 'Scikit-learn', category: 'AI & Data', icon: SiScikitlearn, color: '#F7931E', aliases: ['sklearn'] },
  { value: 'huggingface', label: 'Hugging Face', category: 'AI & Data', icon: SiHuggingface, color: '#FFD21E' },
  { value: 'numpy', label: 'NumPy', category: 'AI & Data', icon: SiNumpy, color: '#4D77CF' },
  { value: 'pandas', label: 'Pandas', category: 'AI & Data', icon: SiPandas, color: '#150458' },
  { value: 'apachespark', label: 'Apache Spark', category: 'AI & Data', icon: SiApachespark, color: '#E25A1C', aliases: ['spark'] },
  { value: 'wordpress', label: 'WordPress', category: 'CMS', icon: SiWordpress, color: '#21759B' },
  { value: 'shopify', label: 'Shopify', category: 'CMS', icon: SiShopify, color: '#7AB55C' },
  { value: 'flutter', label: 'Flutter', category: 'Mobile', icon: SiFlutter, color: '#02569B' },
  { value: 'dart', label: 'Dart', category: 'Mobile', icon: SiDart, color: '#0175C2' },
  { value: 'kotlin', label: 'Kotlin', category: 'Mobile', icon: SiKotlin, color: '#7F52FF' },
  { value: 'cplusplus', label: 'C++', category: 'Language', icon: SiCplusplus, color: '#00599C', aliases: ['cpp', 'c++'] },
  { value: 'go', label: 'Go', category: 'Language', icon: SiGo, color: '#00ADD8', aliases: ['golang'] },
  { value: 'stripe', label: 'Stripe', category: 'Tools', icon: SiStripe, color: '#635BFF' },
  { value: 'chartjs', label: 'Chart.js', category: 'Tools', icon: SiChartdotjs, color: '#FF6384', aliases: ['chart.js'] },
];

export const skillIconLibrary = techIconLibrary;

export const normalizeTechIconKey = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const iconLookup = new Map();

techIconLibrary.forEach((item) => {
  const keys = [item.value, item.label, ...(item.aliases || [])];

  keys.forEach((key) => {
    iconLookup.set(normalizeTechIconKey(key), item);
  });
});

export const normalizeSkillIconKey = normalizeTechIconKey;

export function resolveTechIcon(value) {
  return iconLookup.get(normalizeTechIconKey(value)) || null;
}

export function resolveTechIconFromValue(value) {
  return resolveTechIcon(value);
}

export function resolveTechIconFromSkill(skill) {
  return resolveTechIcon(skill?.icon) || resolveTechIcon(skill?.name);
}

export function resolveSkillIcon(value) {
  return resolveTechIcon(value);
}

export function resolveSkillIconFromSkill(skill) {
  return resolveTechIconFromSkill(skill);
}

export function getSkillIconComponent(value) {
  return resolveTechIcon(value)?.icon || Code2;
}
