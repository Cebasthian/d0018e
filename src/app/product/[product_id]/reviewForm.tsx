// src/components/ReviewForm.tsx
'use client';

import { useState } from 'react';

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerSSN, setCustomerSSN] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating < 1 || rating > 5 || !comment.trim() || !customerSSN.trim()) {
      setError('Please fill in all fields correctly.');
      return;
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment, customer_ssn: customerSSN }),
    });

    if (res.ok) {
      setSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      setCustomerSSN('');
      // Optionally, you could trigger a re-fetch of the reviews (for example, using SWR or React Query)
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h3>Submit a Review</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <div>
        <label>Rating: </label>
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={num} style={{ marginRight: '0.5rem' }}>
            <input
              type="radio"
              name="rating"
              value={num}
              checked={rating === num}
              onChange={() => setRating(num)}
            />
            {num}
          </label>
        ))}
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Comment:</label><br />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          cols={50}
        />
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Your SSN:</label><br />
        <input
          type="text"
          value={customerSSN}
          onChange={(e) => setCustomerSSN(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" style={{ marginTop: '1rem' }}>Submit Review</button>
    </form>
  );
}
