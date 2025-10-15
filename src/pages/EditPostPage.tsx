import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!id) return
      const ref = doc(db, 'posts', id)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        navigate('/')
        return
      }
      const data = snap.data() as any
      setTitle(data.title ?? '')
      setContent(data.content ?? '')
      setLoading(false)
    }
    load()
  }, [id, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id || !user) return
    const ref = doc(db, 'posts', id)
    await updateDoc(ref, { title, content, updatedAt: serverTimestamp() })
    navigate('/')
  }

  if (loading) return <div className="p-4 text-center">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Post</h1>
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
          Save
        </button>
      </form>
    </div>
  )
}


