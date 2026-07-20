import { useCallback, useEffect, useState } from 'react'
import { getPosts } from '../api/postApi'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 5

function PostListPage({
  navigate,
  showMessage,
  requireLogin,
  currentPage,
  setCurrentPage,
  setCurrentPostId,
}) {
  const { isLoggedIn } = useAuth()
  const [posts, setPosts] = useState([])
  const [pageData, setPageData] = useState(null)
  const [sortType, setSortType] = useState('latest')
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = useCallback(async (page = 0) => {
    setIsLoading(true)

    try {
      const result = await getPosts(page, PAGE_SIZE)
      const data = result?.data ?? {}
      setPosts(data.content ?? [])
      setPageData(data)
      setCurrentPage(data.number ?? page)
      navigate('list', { page: data.number ?? page })
    } catch (error) {
      showMessage(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, setCurrentPage, showMessage])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts(currentPage)
  }, [currentPage, loadPosts])

  const current = (pageData?.number ?? currentPage) + 1
  const total = pageData?.totalPages === 0 ? 1 : (pageData?.totalPages ?? 1)

  return (
    <section id="post-list-section" className="section">
      <div className="post-list-intro">
        <p>
          개발자들을 위한 익명 대나무숲 게시판
          <br />
          게시글을 클릭하여 다양한 코드리뷰를 남겨보세요!
        </p>
        <div className="post-list-actions">
          <button
            id="show-list-login-button"
            className={`list-login-button${isLoggedIn ? ' hidden' : ''}`}
            type="button"
            onClick={() => navigate('login')}
          >
            Login
          </button>
          <button
            id="show-create-button"
            type="button"
            onClick={() => {
              if (requireLogin()) {
                navigate('create')
              }
            }}
          >
            Commit
          </button>
        </div>
      </div>

      <div className="post-list-toolbar">
        <div className="sort-toggle" aria-label="Feed sort">
          <button
            id="sort-latest-button"
            className={`sort-button${sortType === 'latest' ? ' active' : ''}`}
            type="button"
            onClick={() => {
              setSortType('latest')
              loadPosts(0)
            }}
          >
            Latest
          </button>
          <button
            id="sort-popular-button"
            className={`sort-button${sortType === 'popular' ? ' active' : ''}`}
            type="button"
            onClick={() => setSortType('popular')}
          >
            Hot
          </button>
        </div>
      </div>

      <button
        id="refresh-posts-button"
        className="hidden"
        type="button"
        onClick={() => loadPosts(currentPage)}
      >
        Refresh
      </button>
      <div id="post-list" className="post-list">
        {isLoading && <p className="post-empty">Loading feed...</p>}
        {!isLoading && posts.length === 0 && (
          <p className="post-empty">No logs yet. Push the first anonymous commit.</p>
        )}
        {!isLoading &&
          posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onClick={() => {
                setCurrentPostId(post.postId)
                navigate('detail', { postId: post.postId })
              }}
            />
          ))}
      </div>

      <div className="pagination">
        <button
          id="prev-page-button"
          type="button"
          disabled={pageData?.first ?? true}
          onClick={() => {
            if (currentPage > 0) {
              loadPosts(currentPage - 1)
            }
          }}
        >
          이전
        </button>
        <span id="page-info">
          {current} / {total}
        </span>
        <button
          id="next-page-button"
          type="button"
          disabled={pageData?.last ?? true}
          onClick={() => loadPosts(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </section>
  )
}

export default PostListPage
