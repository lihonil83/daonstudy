// 버전을 올리면 구 캐시가 자동으로 지워집니다
const CACHE_NAME = 'daon-study-v2';
const SHELL = './index.html';

// 설치: 앱 껍데기(index.html)와 아이콘 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([SHELL, './manifest.json', './logo192.png', './logo512.png'])
    )
  );
  self.skipWaiting();
});

// 활성화: 이전 버전 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 요청 처리: 캐시 우선, 없으면 네트워크에서 가져와 저장
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      // 페이지 이동 요청은 항상 shell로 응답 (HashRouter 지원)
      if (event.request.mode === 'navigate') {
        return caches.match(SHELL);
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
        return response;
      });
    })
  );
});
