document.addEventListener('DOMContentLoaded', () => {
  const appsContainer = document.getElementById('apps-container');

  // دالة لجلب قائمة التطبيقات وعرضها
  const fetchApps = async () => {
    try {
      const response = await fetch('/apps');
      const apps = await response.json();

      apps.forEach(app => {
        const appItem = document.createElement('div');
        appItem.classList.add('app-item');
        appItem.innerHTML = `
          <h3>${app.name}</h3>
          <a href="${app.filePath}" download>Download</a>
        `;
        appsContainer.appendChild(appItem);
      });
    } catch (error) {
      console.error('خطأ في جلب التطبيقات:', error);
      appsContainer.innerHTML = '<p>حدث خطأ أثناء جلب التطبيقات.</p>';
    }
  };

  fetchApps();
});
