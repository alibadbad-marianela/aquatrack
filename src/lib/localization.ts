export interface GreetingDefinition {
  code: string;
  language: string;
  template: string; // contains {name}
  nativeName: string;
  isRtl?: boolean;
}

export const GREETING_LANGUAGES: GreetingDefinition[] = [
  {
    code: 'en',
    language: 'English',
    nativeName: 'English',
    template: 'Hello, {name}!',
    isRtl: false,
  },
  {
    code: 'fil',
    language: 'Filipino',
    nativeName: 'Tagalog',
    template: 'Kumusta, {name}!',
    isRtl: false,
  },
  {
    code: 'ceb',
    language: 'Cebuano',
    nativeName: 'Bisaya',
    template: 'Kumusta, {name}!',
    isRtl: false,
  },
  {
    code: 'es',
    language: 'Spanish',
    nativeName: 'Español',
    template: '¡Hola, {name}!',
    isRtl: false,
  },
  {
    code: 'fr',
    language: 'French',
    nativeName: 'Français',
    template: 'Bonjour, {name}!',
    isRtl: false,
  },
  {
    code: 'de',
    language: 'German',
    nativeName: 'Deutsch',
    template: 'Hallo, {name}!',
    isRtl: false,
  },
  {
    code: 'ja',
    language: 'Japanese',
    nativeName: '日本語',
    template: 'こんにちは、{name}！',
    isRtl: false,
  },
  {
    code: 'ko',
    language: 'Korean',
    nativeName: '한국어',
    template: '안녕하세요, {name}!',
    isRtl: false,
  },
  {
    code: 'zh',
    language: 'Mandarin Chinese',
    nativeName: '中文',
    template: '你好，{name}！',
    isRtl: false,
  },
  {
    code: 'pt',
    language: 'Portuguese',
    nativeName: 'Português',
    template: 'Olá, {name}!',
    isRtl: false,
  },
  {
    code: 'id',
    language: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    template: 'Halo, {name}!',
    isRtl: false,
  },
  {
    code: 'th',
    language: 'Thai',
    nativeName: 'ไทย',
    template: 'สวัสดี {name}!',
    isRtl: false,
  },
  {
    code: 'vi',
    language: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    template: 'Xin chào, {name}!',
    isRtl: false,
  },
  {
    code: 'ar',
    language: 'Arabic',
    nativeName: 'العربية',
    template: 'مرحبًا، {name}!',
    isRtl: true,
  },
];

export function formatGreeting(langCode: string, nickname: string): { text: string; isRtl: boolean; language: string } {
  const lang = GREETING_LANGUAGES.find((l) => l.code === langCode) || GREETING_LANGUAGES[0];
  const safeName = nickname && nickname.trim() ? nickname.trim() : 'Friend';
  const text = lang.template.replace('{name}', safeName);
  return {
    text,
    isRtl: !!lang.isRtl,
    language: lang.language,
  };
}
