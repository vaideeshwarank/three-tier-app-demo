import React, { useState } from 'react';

function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedback = { name, email, message };

    try {
      const response = await fetch('http://backend-service:8080/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <section>
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <textarea placeholder="Your Feedback" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default FeedbackForm;
