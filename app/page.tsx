'use client';

import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [editedResume, setEditedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setStatus('Resume uploaded successfully!');
    }
  };

  const handleEditResume = async () => {
    if (!resume || !jobDescription) {
      setStatus('Please upload resume and enter job description');
      return;
    }

    setLoading(true);
    setStatus('Analyzing job description and tailoring your resume...');

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/edit-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setEditedResume(data.editedResume);
        setStatus('Resume tailored successfully!');
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (error) {
      setStatus('Error editing resume. Please try again.');
    }

    setLoading(false);
  };

  const handleApplyJob = async () => {
    if (!editedResume) {
      setStatus('Please edit resume first before applying');
      return;
    }

    setLoading(true);
    setStatus('Applying to job...');

    try {
      const response = await fetch('/api/apply-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: editedResume,
          jobDescription: jobDescription,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('Application submitted successfully!');
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (error) {
      setStatus('Error applying to job. Please try again.');
    }

    setLoading(false);
  };

  const downloadResume = () => {
    const blob = new Blob([editedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailored-resume.txt';
    a.click();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#1a1a1a' }}>
        Job Application Automation
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '40px' }}>
        Upload your resume, paste job description, and let AI tailor it for you
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Left Column - Input */}
        <div>
          <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1a1a1a' }}>📄 Upload Resume</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeUpload}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            />
            {resume && (
              <p style={{ marginTop: '10px', color: '#28a745', fontSize: '0.9rem' }}>
                ✓ {resume.name}
              </p>
            )}
          </div>

          <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1a1a1a' }}>💼 Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <button
              onClick={handleEditResume}
              disabled={loading}
              style={{
                flex: 1,
                padding: '15px 30px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? '⏳ Processing...' : '✨ Tailor Resume'}
            </button>
            <button
              onClick={handleApplyJob}
              disabled={loading || !editedResume}
              style={{
                flex: 1,
                padding: '15px 30px',
                backgroundColor: loading || !editedResume ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading || !editedResume ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? '⏳ Applying...' : '🚀 Apply to Job'}
            </button>
          </div>
        </div>

        {/* Right Column - Output */}
        <div>
          <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#1a1a1a' }}>📝 Tailored Resume</h2>
              {editedResume && (
                <button
                  onClick={downloadResume}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  ⬇️ Download
                </button>
              )}
            </div>
            {editedResume ? (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                {editedResume}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: '#999',
                fontSize: '1rem'
              }}>
                Your tailored resume will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div style={{
          padding: '15px 20px',
          backgroundColor: status.includes('Error') ? '#f8d7da' : '#d4edda',
          color: status.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '0.95rem'
        }}>
          {status}
        </div>
      )}

      {/* Features */}
      <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Smart Matching</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>AI analyzes job requirements and tailors your resume</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚡</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Quick Apply</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Apply to multiple jobs with customized resumes</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>ATS Optimized</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Formatted to pass Applicant Tracking Systems</p>
        </div>
      </div>
    </div>
  );
}