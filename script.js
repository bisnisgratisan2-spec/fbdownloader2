document.getElementById('getBtn').addEventListener('click', async () => {
  const url = document.getElementById('urlInput').value;
  const result = document.getElementById('result');
  const error = document.getElementById('error');

  result.classList.add('hidden');
  error.classList.add('hidden');

  if (!url) {
    error.textContent = "Masukkan URL!";
    error.classList.remove('hidden');
    return;
  }

  const res = await fetch(`/api/getVideo?url=${encodeURIComponent(url)}`);
  const data = await res.json();

  if (data.error) {
    error.textContent = data.error;
    error.classList.remove('hidden');
  } else {
    document.getElementById('videoLink').href = data.videoUrl;
    document.getElementById('videoLink').textContent = data.videoUrl;
    document.getElementById('preview').src = data.videoUrl;
    result.classList.remove('hidden');
  }
});
