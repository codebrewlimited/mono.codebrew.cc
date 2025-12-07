const root = document.getElementById('root');

// Define workspaces (update paths if needed)
const workspaces = [
  { name: 'v1 API', link: '/v1', description: 'Backend API workspace' },
  {
    name: 'Client App',
    link: '/client',
    description: 'Frontend client workspace'
  }
];

// Build HTML
root.innerHTML = `
  <div class="max-w-4xl mx-auto p-6 space-y-8">

    <!-- Welcome Card -->
    <div class="bg-blue-50 p-6 rounded-lg shadow-md text-center">
      <h2 class="text-3xl font-bold text-blue-600 mb-2">Welcome to the Client App!</h2>
      <p class="text-gray-700 mb-4">
        This is a starter frontend scaffold for your monorepo.
      </p>
      <button id="magicBtn" class="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition">
        Click Me for Magic ✨
      </button>
      <p id="message" class="mt-4 text-gray-700 font-medium"></p>
    </div>

    <!-- Workspaces List -->
    <div>
      <h3 class="text-2xl font-semibold mb-4 text-gray-800">Monorepo Workspaces</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${workspaces
          .map(
            (ws) => `
          <div class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h4 class="text-lg font-semibold mb-1 text-gray-900">${ws.name}</h4>
            <p class="text-gray-600 mb-2">${ws.description}</p>
            <a href="${ws.link}" class="text-blue-600 underline hover:text-blue-500" target="_blank">
              Open Workspace
            </a>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- Repo Link -->
    <div class="text-center mt-8">
      <a href="https://github.com/codebrewlimited/mono.codebrew.cc?tab=readme-ov-file"
         target="_blank"
         class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition">
        View Mono Repo 📦
      </a>
    </div>

  </div>
`;

// Add button interaction
document.getElementById('magicBtn').addEventListener('click', () => {
  const message = document.getElementById('message');
  message.textContent = '🎉 You just interacted with the client app!';
  message.classList.add('text-green-700', 'font-bold');
});
