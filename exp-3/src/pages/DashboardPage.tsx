import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeHeader } from '../lib/jwt';
import type { JWTPayload } from '../types/auth';

interface TokenState {
  raw: string | null;
  header: { alg: string; typ: string } | null;
  payload: JWTPayload | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
}

const defaultPosts: Post[] = [
  { id: '1', title: 'Introduction to JWT', content: 'JSON Web Tokens are an open standard for stateless session handling.', authorId: 'usr_admin', authorName: 'Admin User' },
  { id: '2', title: 'Stateless Architecture', content: 'Stateless backends scale easily because they do not track session databases.', authorId: 'usr_admin', authorName: 'Admin User' }
];

export const DashboardPage = () => {
  const { user, logout, getDecodedToken, getRawToken } = useAuth();
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState<TokenState>({
    raw: null,
    header: null,
    payload: null,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const raw = getRawToken();
    const payload = getDecodedToken();
    const header = raw ? decodeHeader(raw) : null;
    setTokenState({ raw, header, payload });

    const stored = localStorage.getItem('exp3_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      localStorage.setItem('exp3_posts', JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
  }, [getRawToken, getDecodedToken]);

  const savePosts = (newPosts: Post[]) => {
    localStorage.setItem('exp3_posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      authorId: user?.id || 'unknown',
      authorName: user?.name || user?.username || 'Anonymous',
    };

    savePosts([...posts, newPost]);
    setNewTitle('');
    setNewContent('');
  };

  const handleStartEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSaveEdit = (postId: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, title: editTitle.trim(), content: editContent.trim() };
      }
      return p;
    });
    savePosts(updated);
    setEditingId(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const filtered = posts.filter(p => p.id !== postId);
      savePosts(filtered);
    }
  };

  const tokenParts = tokenState.raw ? tokenState.raw.split('.') : [];

  const canAdd = user?.role === 'poster';
  const canEdit = (post: Post) => user?.role === 'admin' || (user?.role === 'poster' && post.authorId === user?.id);
  const canDelete = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <span className="font-semibold text-slate-800">{user?.name}</span> ({user?.email}) • <span className="uppercase font-bold text-indigo-600 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded">{user?.role}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs py-2 px-4 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4 ${canAdd ? '' : 'hidden'}`}>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Create New Post
            </h2>
            <hr className="border-slate-100" />
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label htmlFor="new-title" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Post Title
                </label>
                <input
                  id="new-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-content" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Post Content
                </label>
                <textarea
                  id="new-content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter content description"
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded transition-colors"
              >
                Add Post
              </button>
            </form>
          </div>

          <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4 ${canAdd ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Platform Posts
            </h2>
            <hr className="border-slate-100" />
            {posts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No posts available</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {posts.map((post, idx) => (
                  <div key={post.id} className={`pt-4 ${idx === 0 ? '!pt-0' : ''} space-y-2`}>
                    {editingId === post.id ? (
                      <div className="space-y-2.5 bg-slate-50 p-3.5 rounded border border-slate-200">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-[10px] font-semibold px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-bold text-slate-800">{post.title}</h3>
                          <div className="flex gap-1.5">
                            {canEdit(post) && (
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed">{post.content}</p>
                        <div className="text-[9px] text-slate-400 font-medium">
                          Author: <span className="font-semibold text-slate-500">{post.authorName}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Decoded Claims
            </h2>
            <hr className="border-slate-100" />
            <pre className="bg-slate-50 border border-slate-100 p-3 rounded-md text-[10px] font-mono text-cyan-700 overflow-x-auto">
              {JSON.stringify(tokenState.payload, null, 2)}
            </pre>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Raw Encoded JWT
            </h2>
            <hr className="border-slate-100" />
            <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-4 rounded-md break-all leading-relaxed select-all">
              {tokenParts.length === 3 ? (
                <>
                  <span className="text-purple-400">{tokenParts[0]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-cyan-400">{tokenParts[1]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-rose-400">{tokenParts[2]}</span>
                </>
              ) : (
                <span className="text-slate-400">No token active</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-[9px] text-center font-semibold">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 py-0.5 rounded">Header</span>
              <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 py-0.5 rounded">Payload</span>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 py-0.5 rounded">Signature</span>
            </div>
          </div>
        </div>

        <footer className="text-center pt-4">
          <p className="text-slate-400 text-[10px]">
            Experiment 3 • Secure Session Management with JSON Web Tokens
          </p>
        </footer>
      </div>
    </div>
  );
};
