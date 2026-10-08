const http = require('http');

let tasks = [
  { id: 1, title: 'Complete Experiment 6 Documentation', completed: true, comments: [{ id: 1, text: 'Initial draft done' }] },
  { id: 2, title: 'Implement Spring Data JPA Pagination & Sorting', completed: true, comments: [{ id: 2, text: 'Using Pageable and Sort' }] },
  { id: 3, title: 'Configure Spring Cache for heavy queries', completed: false, comments: [] },
  { id: 4, title: 'Fix N+1 query problem using JOIN FETCH', completed: false, comments: [] },
  { id: 5, title: 'Build React UI with glassmorphism theme', completed: true, comments: [] },
  { id: 6, title: 'Integrate Vite frontend with REST API', completed: false, comments: [] }
];

let nextId = 7;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/api/tasks' && req.method === 'GET') {
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '5', 10);
    const sort = url.searchParams.get('sort') || 'id,desc';

    let sorted = [...tasks];
    if (sort.includes('desc')) {
      sorted.sort((a, b) => b.id - a.id);
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }

    const start = page * size;
    const paginated = sorted.slice(start, start + size);
    const totalPages = Math.ceil(sorted.length / size) || 1;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      content: paginated,
      totalPages: totalPages,
      totalElements: sorted.length,
      size: size,
      number: page
    }));
    return;
  }

  if (pathname === '/api/tasks/with-comments' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
    return;
  }

  if (pathname === '/api/tasks/top' && req.method === 'GET') {
    const top = tasks.slice(0, 5);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(top));
    return;
  }

  if (pathname === '/api/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const newTask = {
        id: nextId++,
        title: data.title || 'Untitled',
        completed: Boolean(data.completed),
        comments: []
      };
      tasks.push(newTask);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newTask));
    });
    return;
  }

  const toggleMatch = pathname.match(/^\/api\/tasks\/(\d+)\/toggle$/);
  if (toggleMatch && req.method === 'PUT') {
    const id = parseInt(toggleMatch[1], 10);
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(task));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Task not found' }));
    }
    return;
  }

  const deleteMatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = parseInt(deleteMatch[1], 10);
    tasks = tasks.filter(t => t.id !== id);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Task with ID ${id} has been deleted!`);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
