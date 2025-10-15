import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function NewPostPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    await addDoc(collection(db, 'posts'), {
      title,
      content,
      author: user.email ?? 'Anonymous',
      uid: user.uid,
      createdAt: serverTimestamp(),
    })
    navigate('/')
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">New Post</h1>
        <Link to="/" className="px-3 py-1 bg-gray-200 rounded">Back</Link>
      </header>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded px-3 py-2 h-40"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!user}>
          Publish
        </button>
      </form>
    </div>
  )
}


