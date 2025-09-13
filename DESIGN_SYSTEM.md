# نظام التصميم الجديد - Dark Soft Night Gradient Style

## نظرة عامة
تم تحويل التطبيق بالكامل إلى نظام تصميم داكن ناعم مع تدرج ليلي، بطاقات زجاجية، وأزرار بنفسجية متوهجة - متوافق تماماً مع الصور المرسلة.

## المكونات الجديدة

### 1. نظام الألوان (theme.ts)
```typescript
export const theme = {
  colors: {
    // الخلفية والتدرجات الليلية
    bgTop: '#0C1626',        // أغمق - أعلى الشاشة
    bgBottom: '#0F2236',     // أفتح قليلاً - أسفل الشاشة
    noise: 'rgba(255,255,255,0.015)', // ضجيج خفيف لمنع banding

    // البطاقات والأسطح الزجاجية
    surface: 'rgba(18, 30, 46, 0.72)',     // طبقة زجاجية شبه شفافة
    surfaceSolid: '#142235',               // بديل بدون blur للأندرويد
    surfaceBorder: 'rgba(255,255,255,0.06)', // حدود رقيقة فاتحة

    // الألوان الأساسية - البنفسجي المتوهج
    primary: '#6D5EF0',       // بنفسجي أساسي
    primary2: '#7A86FF',      // بنفسجي ثانوي للتدرج
    primaryGlow: 'rgba(109,94,240,0.35)', // توهج البنفسجي

    // النصوص
    text: '#E9EDF7',          // نص أساسي أبيض فاتح
    textDim: '#A7B0C0',       // نص ثانوي رمادي فاتح
    textMuted: '#7B8798',     // نص خافت رمادي
  }
}
```

### 2. مكونات UI الجديدة

#### AppBackground
خلفية التطبيق مع التدرج الليلي والضجيج:
```tsx
<AppBackground>
  {/* محتوى التطبيق */}
</AppBackground>
```

#### GlassCard
بطاقة زجاجية شبه شفافة:
```tsx
<GlassCard style={styles.card}>
  <Text>محتوى البطاقة</Text>
</GlassCard>
```

#### PrimaryButton
زر أساسي بنفسجي متوهج:
```tsx
<PrimaryButton
  title="حفظ"
  onPress={handleSave}
  icon={<Ionicons name="save" size={20} color="#FFFFFF" />}
/>
```

#### GhostButton
زر ثانوي شفاف:
```tsx
<GhostButton
  title="تخطي"
  onPress={handleSkip}
  variant="outline"
/>
```

#### ProgressRing
حلقة التقدم المتحركة:
```tsx
<ProgressRing
  size={180}
  strokeWidth={12}
  progress={75}
  animated={true}
/>
```

### 3. مكونات الأنيميشن

#### FadeInView
أنيميشن الظهور التدريجي:
```tsx
<FadeInView delay={200} direction="up">
  <Text>نص يظهر تدريجياً</Text>
</FadeInView>
```

#### StaggeredList
قائمة بالأنيميشن المتسلسل:
```tsx
<StaggeredList delay={300} direction="up">
  {items.map(item => <Item key={item.id} />)}
</StaggeredList>
```

#### AnimatedCard
بطاقة مع أنيميشن الضغط:
```tsx
<AnimatedCard onPress={handlePress} scale={0.95}>
  <Text>بطاقة متحركة</Text>
</AnimatedCard>
```

## الميزات المطبقة

### ✅ نظام التصميم الموحد
- ألوان متسقة عبر التطبيق
- نظام مسافات 8pt
- خطوط عربية (Cairo)
- نصف أقطار موحدة

### ✅ الخلفية الليلية
- تدرج أزرق ليلي من `bgTop` إلى `bgBottom`
- ضجيج خفيف لمنع banding
- تطبيق على جميع الشاشات

### ✅ البطاقات الزجاجية
- تأثير blur على iOS
- لون شبه شفاف على Android
- حدود رقيقة فاتحة
- ظلال ناعمة

### ✅ الأزرار البنفسجية المتوهجة
- تدرج بنفسجي من `primary` إلى `primary2`
- توهج خلفي بـ `primaryGlow`
- تأثير اهتزاز عند الضغط
- أحجام متعددة (sm, md, lg)

### ✅ الشريط السفلي المحدث
- تصميم زجاجي
- فتحة وسط للزر العائم
- زر عائم بنفسجي متوهج
- توزيع متوازن للأيقونات

### ✅ دعم RTL والخطوط العربية
- خط Cairo للعربية
- دعم RTL تلقائي
- خطوط متدرجة (Regular, Medium, SemiBold, Bold)

### ✅ الأنيميشن الناعمة
- ظهور تدريجي للعناصر
- أنيميشن متسلسل للقوائم
- تأثيرات ضغط ناعمة
- توقيتات محسوبة (150-300ms)

## كيفية الاستخدام

### 1. تطبيق الخلفية
```tsx
import { AppBackground } from './src/components/ui';

export default function App() {
  return (
    <AppBackground>
      {/* محتوى التطبيق */}
    </AppBackground>
  );
}
```

### 2. استخدام البطاقات الزجاجية
```tsx
import { GlassCard } from './src/components/ui';

<GlassCard style={styles.card}>
  <Text style={styles.title}>عنوان البطاقة</Text>
  <Text style={styles.content}>محتوى البطاقة</Text>
</GlassCard>
```

### 3. استخدام الأزرار
```tsx
import { PrimaryButton, GhostButton } from './src/components/ui';

<PrimaryButton
  title="إجراء أساسي"
  onPress={handlePrimary}
  size="lg"
/>

<GhostButton
  title="إجراء ثانوي"
  onPress={handleSecondary}
  variant="outline"
/>
```

### 4. تطبيق الأنيميشن
```tsx
import { FadeInView, StaggeredList } from './src/components/ui';

<FadeInView delay={200} direction="up">
  <Text>عنوان يظهر تدريجياً</Text>
</FadeInView>

<StaggeredList delay={300} direction="up">
  {items.map(item => <Item key={item.id} />)}
</StaggeredList>
```

## الملفات المحدثة

### مكونات جديدة
- `src/components/ui/AppBackground.tsx`
- `src/components/ui/GlassCard.tsx`
- `src/components/ui/PrimaryButton.tsx`
- `src/components/ui/GhostButton.tsx`
- `src/components/ui/ProgressRing.tsx`
- `src/components/ui/AnimatedCard.tsx`
- `src/components/ui/FadeInView.tsx`
- `src/components/ui/StaggeredList.tsx`

### ملفات محدثة
- `src/constants/design.ts` - نظام التصميم الجديد
- `App.tsx` - تطبيق الخلفية الجديدة
- `src/screens/auth/WelcomeScreen.tsx` - تطبيق النظام الجديد
- `src/screens/home/HomeScreen.tsx` - تطبيق النظام الجديد مع الأنيميشن
- `src/navigation/TabNavigator.tsx` - شريط سفلي محدث

## النتيجة النهائية

التطبيق الآن يتمتع بـ:
- مظهر داكن ناعم مع تدرج ليلي جميل
- بطاقات زجاجية شفافة مع تأثير blur
- أزرار بنفسجية متوهجة مع تأثيرات ناعمة
- شريط سفلي مع فتحة وسط للزر العائم
- أنيميشن ناعمة ومتسلسلة
- دعم كامل للعربية و RTL
- تجربة مستخدم سلسة ومتسقة

النظام متوافق تماماً مع الصور المرسلة ويوفر تجربة مستخدم حديثة وجذابة! 🎨✨
