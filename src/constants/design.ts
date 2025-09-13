// نظام التصميم الموحد - Dark Soft Night Gradient Style
// متوافق مع الصور المرسلة: بطاقات زجاجية، أزرار بنفسجية متوهجة، تدرج ليلي

export const theme = {
  colors: {
    // الخلفية والتدرجات - Light Mode
    bgTop: '#F8FAFC',         // خلفية فاتحة نظيفة
    bgBottom: '#F1F5F9',      // خلفية أسفل الشاشة
    background: '#F8F9FA',    // خلفية عامة
    noise: 'rgba(0,0,0,0.01)', // ضجيج خفيف

    // البطاقات والأسطح
    surface: '#FFFFFF',       // سطح البطاقات أبيض
    surfaceSolid: '#FFFFFF',  // بديل بدون blur للأندرويد
    surfaceBorder: '#E5E7EB', // حدود رمادية فاتحة
    surfaceShadow: 'rgba(0,0,0,0.05)', // ظل خفيف

    // الألوان الأساسية - البنفسجي الحيوي
    primary: '#8B5CF6',       // بنفسجي حيوي
    primary2: '#A78BFA',      // بنفسجي فاتح للتدرج
    primaryGlow: 'rgba(139,92,246,0.2)', // توهج البنفسجي
    primaryDark: '#7C3AED',   // بنفسجي غامق

    // ألوان إضافية حيوية
    secondary: '#06B6D4',     // سماوي
    accent: '#F59E0B',        // برتقالي ذهبي
    purple: '#8B5CF6',        // بنفسجي
    blue: '#3B82F6',          // أزرق
    green: '#10B981',         // أخضر
    pink: '#EC4899',          // وردي

    // النصوص
    text: '#1F2937',          // نص أساسي غامق
    textDim: '#6B7280',       // نص ثانوي رمادي
    textMuted: '#9CA3AF',     // نص خافت رمادي
    textLight: '#FFFFFF',     // نص أبيض

    // حالات النظام
    success: '#10B981',       // أخضر للنجاح
    danger: '#EF4444',        // أحمر للخطر
    warning: '#F59E0B',       // برتقالي للتحذير
    info: '#3B82F6',          // أزرق للمعلومات

    // ألوان خاصة
    shadow: '#000000',        // لون الظلال
    border: '#E5E7EB',        // لون الحدود
    card: '#FFFFFF',          // لون البطاقات
  },

  // نصف الأقطار
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },

  // المسافات - نظام 8pt
  spacing: (n: number) => n * 8,

  // الظلال
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    button: {
      shadowColor: '#6D5EF0',
      shadowOpacity: 0.35,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 4 },
      elevation: 12,
    },
  },

  // الخطوط
  typography: {
    // الخطوط العربية
    fontFamily: {
      arabic: 'Cairo-Regular',
      arabicMedium: 'Cairo-Medium',
      arabicSemiBold: 'Cairo-SemiBold',
      arabicBold: 'Cairo-Bold',
      english: 'System',
    },
    // أحجام الخطوط
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
    },
    // أوزان الخطوط
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    // المسافات بين الأحرف
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
    // ارتفاع السطر
    lineHeight: {
      tight: 16,
      normal: 20,
      relaxed: 24,
      loose: 28,
    },
  },

  // أحجام المكونات
  components: {
    button: {
      height: {
        sm: 40,
        md: 48,
        lg: 56,
      },
      padding: {
        horizontal: 20,
        vertical: 14,
      },
    },
    input: {
      height: 56,
      padding: {
        horizontal: 20,
        vertical: 16,
      },
    },
    card: {
      padding: 16,
      borderRadius: 20,
    },
    fab: {
      size: 64,
      borderRadius: 32,
    },
  },

  // الأنيميشن
  animation: {
    duration: {
      fast: 150,
      normal: 200,
      slow: 300,
    },
    easing: {
      easeOut: 'ease-out',
      easeIn: 'ease-in',
      easeInOut: 'ease-in-out',
    },
  },
};

// دوال مساعدة للتصميم المتسق
export const createShadow = (type: keyof typeof theme.shadow) => {
  return theme.shadow[type];
};

export const createTypography = ({
  size,
  weight,
  letterSpacing,
  lineHeight,
  isArabic = true,
}: {
  size: keyof typeof theme.typography.fontSize;
  weight?: keyof typeof theme.typography.fontWeight;
  letterSpacing?: keyof typeof theme.typography.letterSpacing;
  lineHeight?: keyof typeof theme.typography.lineHeight;
  isArabic?: boolean;
}) => {
  const fontFamily = isArabic 
    ? (weight === 'bold' ? theme.typography.fontFamily.arabicBold :
       weight === 'semibold' ? theme.typography.fontFamily.arabicSemiBold :
       weight === 'medium' ? theme.typography.fontFamily.arabicMedium :
       theme.typography.fontFamily.arabic)
    : theme.typography.fontFamily.english;

  return {
    fontSize: theme.typography.fontSize[size],
    fontFamily,
    fontWeight: weight ? theme.typography.fontWeight[weight] : theme.typography.fontWeight.normal,
    letterSpacing: letterSpacing ? theme.typography.letterSpacing[letterSpacing] : theme.typography.letterSpacing.normal,
    lineHeight: lineHeight ? theme.typography.lineHeight[lineHeight] : undefined,
  };
};

// دالة للحصول على الألوان مع الشفافية
export const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// تصدير للتوافق مع الكود القديم
export const DESIGN_TOKENS = theme;
