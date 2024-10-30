import React from 'react';
import Header from './components/Header';
import ProfileOverview from './components/ProfileOverview';
import FeedbackForm from './components/FeedbackForm';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Header />
      <ProfileOverview />
      <FeedbackForm />
    </div>
  );
}

export default App;
