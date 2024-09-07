import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrendingRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingRepositories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://api.github.com/search/repositories',
          {
            params: {
              q: 'stars:>10000',
              sort: 'stars',
              order: 'desc',
              per_page: 10,
            },
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        setRepositories(response.data.items);
      } catch (error) {
        setError('Failed to fetch trending repositories');
        console.error('Error fetching trending repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepositories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Trending GitHub Repositories</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {repositories.map(repo => (
          <li key={repo.id} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login} avatar`}
                style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '15px' }}
              />
              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0366d6', fontSize: '18px' }}>
                    {repo.full_name}
                  </a>
                </h2>
                <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>{repo.description}</p>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              {repo.language && (
                <span style={{ display: 'inline-block', padding: '5px', borderRadius: '4px', backgroundColor: '#f1f1f1', marginRight: '10px' }}>
                  <strong>Language:</strong> {repo.language}
                </span>
              )}
              <span style={{ display: 'inline-block', padding: '5px', borderRadius: '4px', backgroundColor: '#f1f1f1', marginRight: '10px' }}>
                <strong>Stars:</strong> {repo.stargazers_count}
              </span>
              <span style={{ display: 'inline-block', padding: '5px', borderRadius: '4px', backgroundColor: '#f1f1f1', marginRight: '10px' }}>
                <strong>Forks:</strong> {repo.forks_count}
              </span>
              <span style={{ display: 'inline-block', padding: '5px', borderRadius: '4px', backgroundColor: '#f1f1f1' }}>
                <strong>Open Issues:</strong> {repo.open_issues_count}
              </span>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingRepositories;
