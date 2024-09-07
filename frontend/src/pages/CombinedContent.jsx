import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CombinedContent.css';

const CombinedContent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombinedContent = async () => {
      setLoading(true);
      try {
        
        const reposResponse = await axios.get('https://api.github.com/search/repositories', {
          params: {
            q: 'stars:>10000',
            sort: 'stars',
            order: 'desc',
            per_page: 5, 
          },
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        const articlesResponse = await axios.get('https://dev.to/api/articles', {
          params: {
            per_page: 5,
            tag: 'popular',
          },
        });

        
        const combinedItems = [
          ...reposResponse.data.items.map(repo => ({ type: 'repo', ...repo })),
          ...articlesResponse.data.map(article => ({ type: 'article', ...article }))
        ];

        
        for (let i = combinedItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combinedItems[i], combinedItems[j]] = [combinedItems[j], combinedItems[i]];
        }

        setItems(combinedItems);
      } catch (error) {
        setError('Failed to fetch content');
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedContent();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="combined-content">
      <h1 className="title">Trending Content</h1>
      <ul className="content-list">
        {items.map(item => (
          <li key={item.id} className="content-item">
            {item.type === 'repo' ? (
              <div className="repo-card">
                <div className="repo-header">
                  <img
                    src={item.owner.avatar_url}
                    alt={`${item.owner.login} avatar`}
                    className="repo-avatar"
                  />
                  <div className="repo-info">
                    <h2 className="repo-title">
                      <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                        {item.full_name}
                      </a>
                    </h2>
                    <p className="repo-description">{item.description}</p>
                    <div className="repo-meta">
                      {item.language && (
                        <span className="repo-meta-item">
                          <strong>Language:</strong> {item.language}
                        </span>
                      )}
                      <span className="repo-meta-item">
                        <strong>Stars:</strong> {item.stargazers_count}
                      </span>
                      <span className="repo-meta-item">
                        <strong>Forks:</strong> {item.forks_count}
                      </span>
                      <span className="repo-meta-item">
                        <strong>Open Issues:</strong> {item.open_issues_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="article-card">
                <h2 className="article-title">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h2>
                <p className="article-description">{item.description || 'No description available'}</p>
                <p className="article-author">
                  <strong>Author:</strong> {item.user.name}
                </p>
                {item.cover_image && (
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="article-image"
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CombinedContent;
