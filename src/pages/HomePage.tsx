import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

export type Post = {
  id: string
  title: string
  content: string
  author: string
  uid: string
  createdAt: Timestamp
}

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      const items: Post[] = []
      snap.forEach(d => {
        const data = d.data() as Omit<Post, 'id'>
        items.push({ id: d.id, ...data })
      })
      setPosts(items)
    })
    return () => unsub()
  }, [])

  async function handleDelete(id: string, ownerUid: string) {
    if (!user || user.uid !== ownerUid) return
    await deleteDoc(doc(db, 'posts', id))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Feed</h1>
        <nav className="space-x-2">
          {user ? (
            <>
              <Link to="/new" className="px-3 py-1 bg-blue-600 text-white rounded">New Post</Link>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-gray-200 rounded">Login</Link>
          )}
        </nav>
      </header>

      <div className="space-y-3">
        {posts.map(p => (
          <article key={p.id} className="border rounded p-3 bg-white">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <div className="text-sm text-gray-500">{p.author} | {p.createdAt.toDate().toLocaleString()}</div>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{p.content}</p>
            {user?.uid === p.uid && (
              <div className="mt-3 flex gap-2">
                <Link to={`/edit/${p.id}`} className="px-2 py-1 bg-gray-100 rounded">Edit</Link>
                <button onClick={() => handleDelete(p.id, p.uid)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            )}
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-600">No posts yet.</p>
        )}
      </div>
    </div>
  )
}


