const README_URL = `https://raw.githubusercontent.com/codebrewlimited/mono.codebrew.cc/main/README.md`;

async function loadReadme() {
  const root = document.getElementById('root');

  root.innerHTML = `<p class="text-gray-500">Loading README...</p>`;

  try {
    const res = await fetch(README_URL);
    const markdown = await res.text();

    const converter = new showdown.Converter({
      tables: true,
      ghCompatibleHeaderId: true,
      simplifiedAutoLink: true,
      openLinksInNewWindow: true
    });

    const html = converter.makeHtml(markdown);
    root.innerHTML = html;

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } catch (err) {
    root.innerHTML = `
      <div class="text-red-600">
        <strong>Error loading README:</strong> ${err}
      </div>
    `;
  }
}

loadReadme();
