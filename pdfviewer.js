<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PDF Viewer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body, #viewer { margin:0; padding:0; height:100%; }
  </style>
</head>
<body>
  <iframe id="viewer" width="100%" height="100%" frameborder="0"></iframe>

  <script type="module">
    import { API_BASE } from './config.js';

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      document.body.textContent = 'Missing PDF id.';
    } else {
      const url = `${API_BASE}?action=pdf&id=${encodeURIComponent(id)}`;
      document.getElementById('viewer').src = url;
    }
  </script>
</body>
</html>
