const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// إعداد multer لتخزين الملفات المرفوعة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // مجلد لتخزين الملفات المرفوعة
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// لتمكين الوصول إلى الملفات الثابتة (مثل CSS و JavaScript)
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // لتمكين الوصول إلى الملفات المرفوعة

// لتمكين استقبال البيانات من النموذج (form)
app.use(express.urlencoded({ extended: true }));

// مسار لرفع التطبيقات
app.post('/upload', upload.single('appFile'), (req, res) => {
  const appName = req.body.appName;
  const appFile = req.file;

  if (!appName || !appFile) {
    return res.status(400).send('الرجاء إدخال اسم التطبيق واختيار ملف.');
  }

  // قراءة بيانات التطبيقات الحالية من ملف JSON
  const appsFilePath = path.join(__dirname, 'data/apps.json');
  let apps = [];
  try {
    const appsData = fs.readFileSync(appsFilePath, 'utf8');
    apps = JSON.parse(appsData);
  } catch (error) {
    console.error('خطأ في قراءة ملف التطبيقات:', error);
  }

  // إضافة التطبيق الجديد إلى قائمة التطبيقات
  const newApp = {
    id: Date.now(),
    name: appName,
    filePath: `/uploads/${appFile.originalname}` // رابط الملف المرفوع
  };
  apps.push(newApp);

  // حفظ قائمة التطبيقات المحدثة في ملف JSON
  fs.writeFile(appsFilePath, JSON.stringify(apps, null, 2), (err) => {
    if (err) {
      console.error('خطأ في كتابة ملف التطبيقات:', err);
      return res.status(500).send('حدث خطأ أثناء حفظ التطبيق.');
    }
    res.redirect('/'); // إعادة توجيه المستخدم إلى الصفحة الرئيسية
  });
});

// مسار للحصول على قائمة التطبيقات
app.get('/apps', (req, res) => {
  const appsFilePath = path.join(__dirname, 'data/apps.json');
  fs.readFile(appsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('خطأ في قراءة ملف التطبيقات:', err);
      return res.status(500).send('حدث خطأ أثناء جلب التطبيقات.');
    }
    res.json(JSON.parse(data));
  });
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`الخادم يستمع على المنفذ ${port}`);
});
