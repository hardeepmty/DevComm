import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../styles/Orion.css';

const Orion = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [tabValue, setTabValue] = useState(0);

  const cardData = [
    {
      label: 'Code Editor',
      description: 'A social development environment for front-end designers and developers. ',
      link: '/codeeditor',
      bgColor: '#E91E63',
      animationClass: 'matrix-animation',
    },
    {
      label: 'Compiler',
      description: 'Compile and run your code effortlessly.',
      link: '/compiler',
      bgColor: '#00C853',
      animationClass: 'cube-animation',
    },
    {
      label: 'Coding Assistant',
      description: 'Get real-time help with your code.',
      link: '/codeass',
      bgColor: '#FFD600',
      animationClass: 'hologram-animation',
    },
  ];

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px' }}>
      <div style={{
        marginTop: "20px",
        marginBottom: "60px",
        fontFamily: "Montserrat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div>
          <h1 style={{ color: "white", textAlign: "center" }}>About Orion</h1>
        </div>
        <div style={{ width: isMobile ? "90%" : "800px" }}>
          <h2
            style={{
              color: "gray",
              textAlign: "center",
              marginTop: "20px",
              fontSize: isMobile ? "10px" : "18px",
              lineHeight: isMobile ? "1.4" : "1.6"
            }}
          >
Welcome to Orion, your ultimate developer toolkit! Orion is a powerful collection of tools designed to elevate your coding experience, featuring a seamless code editor for real-time previews and customizable themes, an effortless compiler for running and testing your code, and an AI assistant that helps troubleshoot issues and offers suggestions. Transform your coding journey with Orion—where innovation meets convenience for every developer!

</h2>
        </div>
      </div>

      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Link to={card.link} style={{ textDecoration: 'none' }}>
              <Card
                className={`card ${card.label.toLowerCase().replace(/\s/g, '-')}`}
                style={{
                  backgroundColor: card.bgColor,
                  borderRadius: '12px',
                  color: 'white',
                  padding: '20px',
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative', // Ensure the card is positioned correctly
                }}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {card.label}
                  </Typography>
                  <Typography variant="body1">{card.description}</Typography>
                </CardContent>

                {/* Add the relevant animation */}
                <div className={card.animationClass}>
                  {card.label === 'Code Editor' && (
                    <div className="matrix-animation">
                      <span>0101</span><span>1010</span><span>1110</span>
                      {/* Additional matrix animation for bottom right */}
                      <div className="bottom-right-matrix">
                        <span>1010</span><span>0101</span><span>0011</span>
                      </div>
                    </div>
                  )}
                  {card.label === 'Compiler' && (
                    <div className="cube-animation">
                      <div className="cube">
                        <div></div><div></div><div></div><div></div><div></div><div></div>
                      </div>
                    </div>
                  )}
                  {card.label === 'Coding Assistant' && (
                    <div className="hologram-animation"></div>
                  )}
                </div>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Orion;
