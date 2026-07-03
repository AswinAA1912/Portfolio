import React, { useEffect } from 'react';
import Portfolio from './Aswin_AA_Portfolio';

function App() {
  useEffect(() => {
    document.title = 'Aswin A A - Full-Stack Developer Portfolio';
  }, []);

  return (
    <div className="App">
      <Portfolio />
    </div>
  );
}

export default App;