
<body>

  <h1>Todoz</h1>
  <p><strong>Todoz</strong> is a simple yet powerful to-do application that allows users to manage tasks efficiently. The application offers CRUD functionality, authentication, and a clean user interface.</p>

  <div class="section">
    <h2>Features</h2>
    <ul>
      <li><strong>User Registration and Login</strong>: Secure authentication system with session management.</li>
      <li><strong>Task Management</strong>: Create, read, update, and delete tasks.</li>
      <li><strong>Prioritization</strong>: Organize tasks by priority as needed.</li>
      <li><strong>Due Dates</strong>: Set due dates</li>
    </ul>
  </div>

  <div class="section">
    <h2>Tech Stack</h2>
    <ul>
      <li><strong>Frontend</strong>: React.js, Tailwind CSS</li>
      <li><strong>Backend</strong>: Go (Golang)</li>
      <li><strong>Database</strong>: MongoDB</li>
      <li><strong>Hosting</strong>: Backend is hosted on Render, so pages may take up to 2 minutes to load initially.</li>
    </ul>
  </div>

  <div class="section">
    <h2>Installation</h2>
    <h3>Prerequisites</h3>
    <ul>
      <li>Go version >= 1.17</li>
      <li>Node.js and npm</li>
      <li>MongoDB</li>
    </ul>
    <h3>Setup</h3>
    <h4>1. Clone the repository:</h4>
    <pre><code>git clone https://github.com/utkarshagrrawal/todoz.git</code></pre>
    <h4>2. Navigate to the project directory:</h4>
    <pre><code>cd todoz</code></pre>
  </div>

  <div class="section">
    <h3>Backend Setup</h3>
    <ol>
      <li>Navigate to the backend folder and set up environment variables:
        <pre><code>cd backend</code></pre>
        Create a <code>.env</code> file:
        <pre><code>MONGODB_URI=&lt;Your MongoDB URI&gt;
JWT_SECRET=&lt;Your Secret Key&gt;
ENV=&lt;Enviornment name from dev or prod&gt;
PORT=&lt;Any port number&gt;</code></pre>
      </li>
      <li>Run the server:
        <pre><code>go run main.go</code></pre>
      </li>
    </ol>
  </div>

  <div class="section">
    <h3>Frontend Setup</h3>
    <ol>
      <li>Navigate to the frontend folder:
        <pre><code>cd frontend</code></pre>
      </li>
      <li>Install dependencies:
        <pre><code>npm install</code></pre>
      </li>
      <li>Run the application:
        <pre><code>npm start</code></pre>
      </li>
    </ol>
  </div>

  <div class="section">
    <h2>Usage</h2>
    <p>After logging in, navigate to the task dashboard to add or manage tasks. Use the categories and due dates to keep track of priorities and deadlines.</p>
  </div>

  <div class="section">
    <h2>Attributions</h2>
    <p>Logo: <a href="https://www.flaticon.com/free-icons/todo" title="todo icons">Todo icons created by Freepik - Flaticon</a></p>
  </div>

  <div class="section">
    <h2>License</h2>
    <p>This project is licensed under the MIT License. See <code>LICENSE</code> for more information.</p>
  </div>

</body>
