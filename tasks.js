export const TASK_TYPES = {
  DATA_LABELING:   { label: 'Data Labeling',    color: '#6366f1', bg: '#6366f115', icon: '🏷️' },
  PROMPT_WRITING:  { label: 'Prompt Writing',   color: '#8b5cf6', bg: '#8b5cf615', icon: '✍️' },
  MODEL_TESTING:   { label: 'Model Testing',    color: '#ec4899', bg: '#ec489915', icon: '🧪' },
  CODE_WRITING:    { label: 'AI Code Writing',  color: '#f59e0b', bg: '#f59e0b15', icon: '💻' },
  CODE_REVIEW:     { label: 'AI Code Review',   color: '#ef4444', bg: '#ef444415', icon: '🔍' },
  TRAINING_DATA:   { label: 'Training Data',    color: '#14b8a6', bg: '#14b8a615', icon: '📊' },
  OUTPUT_EVAL:     { label: 'Output Evaluation',color: '#22c55e', bg: '#22c55e15', icon: '⭐' },
}

export const DIFFICULTY = {
  Beginner:     { color: '#22c55e', xp: 1.0 },
  Intermediate: { color: '#f59e0b', xp: 1.5 },
  Advanced:     { color: '#ef4444', xp: 2.0 },
}

export const TASKS = [
  {
    id: 'task_001',
    title: 'Sentiment Labels lagao',
    type: 'DATA_LABELING',
    difficulty: 'Beginner',
    credits: 15,
    time: '20 min',
    description: '100 user reviews ko Positive / Negative / Neutral label karo. Yeh data ek sentiment analysis model train karne ke liye use hoga.',
    instructions: [
      'Har sentence ko dhyan se padho',
      'Overall tone ke hisaab se label choose karo',
      'Mixed feelings → jo dominant ho woh choose karo',
      'Slangs ya Hinglish mein bhi context samjho',
    ],
    sample_input: '"Yaar yeh product ekdum bekar hai, paise waste ho gaye. Delivery toh theek thi par quality zero."',
    sample_output: 'Negative',
    fields: [{ type: 'select', label: 'Label', options: ['Positive', 'Negative', 'Neutral'] }, { type: 'textarea', label: 'Reason (optional)', placeholder: 'Kyun yeh label choose kiya?' }],
  },
  {
    id: 'task_002',
    title: 'System Prompt likho',
    type: 'PROMPT_WRITING',
    difficulty: 'Intermediate',
    credits: 35,
    time: '40 min',
    description: 'Ek customer support AI ke liye professional system prompt likho. Prompt aisa hona chahiye ki AI helpful, polite aur on-topic rahe.',
    instructions: [
      'AI ka role clearly define karo',
      'Kya karna hai aur kya nahi — dono batao',
      'Tone aur language specify karo',
      'Edge cases handle karne ke instructions do',
      '200-400 words ke beech rakhna',
    ],
    sample_input: 'Use case: E-commerce website ka Hindi/English customer support bot',
    sample_output: 'You are a helpful customer support agent for an Indian e-commerce platform...',
    fields: [{ type: 'textarea', label: 'System Prompt', placeholder: 'You are a...', rows: 10 }, { type: 'text', label: 'Target AI Model', placeholder: 'GPT-4 / Claude / Gemini' }],
  },
  {
    id: 'task_003',
    title: 'AI Model Output Test karo',
    type: 'MODEL_TESTING',
    difficulty: 'Intermediate',
    credits: 30,
    time: '35 min',
    description: '15 prompts ko test model mein run karo aur output ki quality evaluate karo. Accuracy, hallucination, tone — sab check karo.',
    instructions: [
      'Har prompt neeche diye gaye template se run karo',
      'Output ko 1-5 scale pe rate karo',
      'Hallucination ya wrong facts note karo',
      'Tone appropriate hai ya nahi batao',
    ],
    sample_input: 'Prompt: "Explain quantum entanglement in simple Hindi"\nModel Output: "Quantum entanglement ek aisi cheez hai jisme..."',
    sample_output: 'Rating: 4/5 | Accuracy: Good | Hallucination: None | Tone: Simple & Clear',
    fields: [
      { type: 'select', label: 'Overall Rating', options: ['1 - Very Poor', '2 - Poor', '3 - Average', '4 - Good', '5 - Excellent'] },
      { type: 'select', label: 'Hallucination Detected?', options: ['No', 'Minor', 'Major'] },
      { type: 'textarea', label: 'Detailed Feedback', placeholder: 'Kya acha tha, kya theek karna chahiye...' },
    ],
  },
  {
    id: 'task_004',
    title: 'Python ML function likho',
    type: 'CODE_WRITING',
    difficulty: 'Advanced',
    credits: 80,
    time: '75 min',
    description: 'Ek Python function likho jo text data ko preprocess kare ML model training ke liye. Tokenization, stopword removal, aur normalization include karo.',
    instructions: [
      'Python 3.10+ compatible code likho',
      'Type hints zaroor use karo',
      'Docstring mein function explain karo',
      'Hinglish text ko bhi handle karo',
      'Unit tests likhna bonus credits dega',
    ],
    sample_input: 'Input: Raw text string ya list of strings\nOutput: Cleaned, tokenized list ready for vectorization',
    sample_output: 'def preprocess_text(text: str) -> list[str]:\n    """..."""\n    ...',
    fields: [
      { type: 'code', label: 'Python Code', placeholder: 'def preprocess_text(text: str) -> list[str]:\n    # yahan apna code likho\n    pass', rows: 15 },
      { type: 'textarea', label: 'Approach Explain karo', placeholder: 'Kya logic use kiya aur kyun...' },
    ],
  },
  {
    id: 'task_005',
    title: 'AI Code Review karo',
    type: 'CODE_REVIEW',
    difficulty: 'Advanced',
    credits: 60,
    time: '60 min',
    description: 'AI-generated code snippet review karo. Bugs, inefficiencies, security issues, aur improvements identify karo.',
    instructions: [
      'Code ko line-by-line analyze karo',
      'Bugs clearly point out karo with line numbers',
      'Better alternatives suggest karo',
      'Security vulnerabilities flag karo',
      'Overall code quality rating do',
    ],
    sample_input: '```python\ndef get_user(id):\n    query = f"SELECT * FROM users WHERE id = {id}"\n    return db.execute(query)\n```',
    sample_output: 'Line 2: SQL Injection vulnerability — f-string mein direct variable use dangerous hai. Use parameterized queries.',
    fields: [
      { type: 'textarea', label: 'Issues Found', placeholder: 'Line X: Issue description...\nLine Y: ...', rows: 8 },
      { type: 'textarea', label: 'Improved Code', placeholder: '```python\n# corrected version\n```', rows: 8 },
      { type: 'select', label: 'Code Quality', options: ['1 - Broken', '2 - Poor', '3 - Acceptable', '4 - Good', '5 - Production Ready'] },
    ],
  },
  {
    id: 'task_006',
    title: 'Training Conversations banao',
    type: 'TRAINING_DATA',
    difficulty: 'Beginner',
    credits: 20,
    time: '25 min',
    description: 'AI chatbot ko train karne ke liye realistic User-Assistant conversation pairs banao. Indian context mein Hinglish use karo.',
    instructions: [
      'Natural, realistic conversations likho',
      'Assistant response helpful aur accurate hona chahiye',
      'Hinglish mix allowed hai',
      'Topic: online shopping, banking, health, education',
      'Min 5 conversation pairs per submission',
    ],
    sample_input: 'Topic: Online shopping return process',
    sample_output: 'User: "Mera order cancel karna hai, kaise karein?"\nAssistant: "Bilkul! Order cancel karne ke liye..."',
    fields: [
      { type: 'select', label: 'Topic', options: ['Online Shopping', 'Banking & Finance', 'Health Queries', 'Education', 'Tech Support', 'Travel'] },
      { type: 'textarea', label: 'Conversation Pairs', placeholder: 'User: ...\nAssistant: ...\n\nUser: ...\nAssistant: ...', rows: 12 },
    ],
  },
  {
    id: 'task_007',
    title: 'AI Output Evaluate karo',
    type: 'OUTPUT_EVAL',
    difficulty: 'Beginner',
    credits: 18,
    time: '20 min',
    description: '20 AI-generated answers ko evaluate karo — factual accuracy, helpfulness, aur safety ke basis pe.',
    instructions: [
      'Har answer ka fact-check karo',
      'Misleading ya harmful content flag karo',
      'Helpfulness 1-5 rate karo',
      'Better answer suggest karo agar needed ho',
    ],
    sample_input: 'Q: "Paracetamol overdose se kya hota hai?"\nAI Answer: "Paracetamol overdose se liver damage ho sakta hai..."',
    sample_output: 'Factual: Correct | Safe: Yes | Helpful: 4/5 | Suggestion: Medical disclaimer add karo',
    fields: [
      { type: 'select', label: 'Factual Accuracy', options: ['Fully Accurate', 'Mostly Accurate', 'Partially Wrong', 'Completely Wrong'] },
      { type: 'select', label: 'Safety', options: ['Safe', 'Minor Concern', 'Harmful — Flag karo'] },
      { type: 'select', label: 'Helpfulness', options: ['1 - Useless', '2 - Barely Helpful', '3 - OK', '4 - Helpful', '5 - Excellent'] },
      { type: 'textarea', label: 'Comments / Improved Answer', placeholder: 'Kya add karna chahiye ya kya change karna chahiye...' },
    ],
  },
  {
    id: 'task_008',
    title: 'AI Model Fine-tune karo',
    type: 'CODE_WRITING',
    difficulty: 'Advanced',
    credits: 120,
    time: '90 min',
    description: 'HuggingFace pe ek small language model ko custom dataset pe fine-tune karne ka script likho. LoRA / PEFT approach use karo.',
    instructions: [
      'HuggingFace Transformers library use karo',
      'LoRA ya QLoRA use karna preferred hai (efficiency ke liye)',
      'Training loop complete hona chahiye',
      'Model save aur load functionality include karo',
      'GPU/CPU dono pe kaam karna chahiye',
    ],
    sample_input: 'Base Model: "microsoft/phi-2" ya "google/gemma-2b"\nDataset: Custom JSON format mein',
    sample_output: 'Complete Python script with training loop, evaluation, and model saving',
    fields: [
      { type: 'code', label: 'Fine-tuning Script', placeholder: '# Import libraries\nfrom transformers import ...\nfrom peft import ...\n\n# Your code here', rows: 18 },
      { type: 'text', label: 'Base Model Used', placeholder: 'microsoft/phi-2' },
      { type: 'textarea', label: 'Approach & Notes', placeholder: 'Kya technique use ki, koi trade-offs?' },
    ],
  },
]

export const CREDIT_THRESHOLD = 500

export function canWithdraw(credits) {
  return credits >= CREDIT_THRESHOLD
}

export function creditsToRupees(credits) {
  return (credits * 2.5).toFixed(2)
}

export function getTaskById(id) {
  return TASKS.find(t => t.id === id)
}
