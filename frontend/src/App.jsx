import React, { useState } from 'react';

export default function App(){
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkJob = async () =>{
    if(!text.trim()) return;
    setLoading(true);
    try{
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    }catch(e){
      alert('Request failed');
    }finally{setLoading(false)}
  }

  const colorForProb = (p) => {
    if(p >= 0.7) return '#ff6b6b';
    if(p >= 0.4) return '#ffb74d';
    return '#5cd65c';
  }

  return (
    <div style={{maxWidth:800, margin:'40px auto', fontFamily:'Inter, Arial'}}>
      <h2>Fake Job Posting Detector</h2>
      <textarea
        rows={10}
        style={{width:'100%', padding:12, fontSize:14}}
        placeholder='Paste job description here...'
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <div style={{marginTop:12}}>
        <button onClick={checkJob} disabled={loading} style={{padding:'8px 16px'}}>
          {loading? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {result && (
        <div style={{marginTop:20, padding:12, borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:72, height:72, borderRadius:8, background:colorForProb(result.fraud_prob), display:'flex', alignItems:'center', justifyContent:'center', color:'#111', fontWeight:700}}>
              {(result.fraud_prob*100).toFixed(0)}%
            </div>
            <div>
              <div>Label: <strong>{result.label === 1 ? 'Fraudulent' : 'Legit'}</strong></div>
              <div>Probability: <strong>{result.fraud_prob.toFixed(3)}</strong></div>
              <div>Risky keywords: {result.risky_keywords.length? result.risky_keywords.join(', '): 'None found'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}