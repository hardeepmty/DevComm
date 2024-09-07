import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PopularArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://dev.to/api/articles', {
          params: {
            per_page: 10, // Number of articles to fetch
            tag: 'popular', // Tag to filter by
            // You can use other query parameters to refine your search
          },
        });

        setArticles(response.data);
      } catch (error) {
        setError('Failed to fetch popular articles');
        console.error('Error fetching popular articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Popular Dev.to Articles</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {articles.map(article => (
          <li key={article.id} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontSize: '18px' }}>
                {article.title}
              </a>
            </h2>
            <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>{article.description || 'No description available'}</p>
            <p style={{ margin: '5px 0' }}>
              <strong>Author:</strong> {article.user.name}
            </p>
            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={article.title}
                style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '8px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularArticles;
