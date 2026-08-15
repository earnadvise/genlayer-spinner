/* ==========================================================================
   GENLAYER SPINNER SHOWCASE - CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-text');
  
  const sizeSlider = document.getElementById('size-slider');
  const sizeValLabel = document.getElementById('size-val');
  const sizePresetBtns = document.querySelectorAll('[data-size]');
  
  const speedSlider = document.getElementById('speed-slider');
  const speedValLabel = document.getElementById('speed-val');
  const speedPresetBtns = document.querySelectorAll('[data-speed]');
  
  const colorDots = document.querySelectorAll('.color-dot');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const inspectCodeBtns = document.querySelectorAll('.select-spinner-btn');
  const currentTabLabel = document.getElementById('current-tab-label');
  const codePreview = document.getElementById('code-preview');
  
  const copyCodeBtn = document.getElementById('btn-copy-code');
  const downloadFileBtn = document.getElementById('btn-download-file');
  const toast = document.getElementById('toast-message');
  
  const spinnerWrappers = document.querySelectorAll('.spinner-wrapper');
  const appContainer = document.querySelector('.app-container');

  // --- State Variables ---
  let currentTheme = 'dark'; // 'dark' | 'light'
  let currentSize = 80;      // px (16 to 128)
  let currentSpeed = 1.0;    // multiplier (0.2 to 2.5)
  let currentColor = '#110FFF'; // hex
  let activeTab = 'kinetic';   // 'kinetic' | 'orbit' | 'adjudication'

  // --- SVG Templates Generator ---
  // Generates clean, standalone SVG source code based on configuration
  const getSVGSource = (concept, color, speedMult) => {
    // Escape helper to prevent regex issues
    const col = color;
    
    if (concept === 'kinetic') {
      const traceDuration = (2.5 * speedMult).toFixed(2);
      const diamondDuration = (2.0 * speedMult).toFixed(2);
      const spinDuration = (1.8 * speedMult).toFixed(2);
      const traceDelay = (-1.25 * speedMult).toFixed(2);

      return `<svg id="genlayer-spinner-kinetic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <!-- Glow Filter for Neon Effect -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Linear Gradient for Rotating Ring -->
    <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col}" stop-opacity="1"/>
      <stop offset="60%" stop-color="${col}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient>

    <style>
      .bg-shard {
        fill: ${col};
        fill-opacity: 0.08;
        stroke: ${col};
        stroke-width: 1.5;
        stroke-opacity: 0.2;
      }
      .trace-path {
        fill: none;
        stroke: ${col};
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 80 160;
        animation: trace-flow ${traceDuration}s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
        filter: url(#neon-glow);
      }
      .trace-path-right {
        animation-delay: ${traceDelay}s;
      }
      .center-diamond {
        fill: ${col};
        transform-origin: 60px 68.5px;
        animation: diamond-pulse ${diamondDuration}s ease-in-out infinite;
        filter: url(#neon-glow);
      }
      .outer-ring {
        transform-origin: 60px 60px;
        animation: spin-clockwise ${spinDuration}s linear infinite;
        stroke-dasharray: 240 74;
      }
      @keyframes spin-clockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes trace-flow {
        0% { stroke-dashoffset: 240; }
        50% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -240; }
      }
      @keyframes diamond-pulse {
        0%, 100% {
          transform: scale(0.85);
          fill-opacity: 0.6;
          filter: drop-shadow(0 0 1px ${col});
        }
        50% {
          transform: scale(1.15);
          fill-opacity: 1;
          filter: drop-shadow(0 0 6px ${col});
        }
      }
    </style>
  </defs>

  <!-- Outer Spinning Track -->
  <circle class="outer-ring" cx="60" cy="60" r="50" fill="none" stroke="url(#ring-grad)" stroke-width="3" stroke-linecap="round" />

  <!-- Center GenLayer Emblem Group -->
  <g transform="translate(60, 60) scale(0.62) translate(-48.88, -45.965)">
    <!-- Left Shard Background & Trace -->
    <path class="bg-shard" d="M 44.26,32.35 L 27.72,67.12 L 43.29,74.9 L 0,91.93 L 44.26,0 Z" />
    <path class="trace-path" d="M 44.26,32.35 L 27.72,67.12 L 43.29,74.9 L 0,91.93 L 44.26,0 Z" />

    <!-- Right Shard Background & Trace -->
    <path class="bg-shard" d="M 53.5,32.35 L 70.04,67.12 L 54.47,74.9 L 97.76,91.93 L 53.5,0 Z" />
    <path class="trace-path trace-path-right" d="M 53.5,32.35 L 70.04,67.12 L 54.47,74.9 L 97.76,91.93 L 53.5,0 Z" />
  </g>

  <!-- Central Diamond -->
  <path class="center-diamond" d="M 59.85,58.62 L 65.85,70.50 L 59.85,73.45 L 54.16,70.49 Z" />
</svg>`;
    }

    if (concept === 'orbit') {
      const innerDuration = (1.4 * speedMult).toFixed(2);
      const middleDuration = (2.2 * speedMult).toFixed(2);
      const outerDuration = (3.0 * speedMult).toFixed(2);
      const pulseDuration = (1.8 * speedMult).toFixed(2);
      
      const successColor = '#00FF66';

      return `<svg id="genlayer-spinner-orbit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <!-- Neon Glow Filter -->
    <filter id="comet-glow" x="-20%" y="-25%" width="140%" height="150%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- userSpaceOnUse Gradients for the fading comet tails -->
    <linearGradient id="comet-grad-1" x1="60" y1="34" x2="86" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${col}" stop-opacity="0" />
      <stop offset="30%" stop-color="${col}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${col}" stop-opacity="1" />
    </linearGradient>

    <linearGradient id="comet-grad-2" x1="60" y1="22" x2="98" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${col}" stop-opacity="0" />
      <stop offset="30%" stop-color="${col}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${col}" stop-opacity="1" />
    </linearGradient>

    <linearGradient id="comet-grad-3" x1="60" y1="10" x2="110" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${col}" stop-opacity="0" />
      <stop offset="30%" stop-color="${col}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${col}" stop-opacity="1" />
    </linearGradient>

    <style>
      .orbit-track {
        fill: none;
        stroke: ${col};
        stroke-opacity: 0.08;
        stroke-width: 1;
      }
      .comet-group-inner {
        transform-origin: 60px 60px;
        animation: spin-clockwise ${innerDuration}s linear infinite;
      }
      .comet-group-middle {
        transform-origin: 60px 60px;
        animation: spin-counter-clockwise ${middleDuration}s linear infinite;
      }
      .comet-group-outer {
        transform-origin: 60px 60px;
        animation: spin-clockwise ${outerDuration}s linear infinite;
      }
      .center-diamond {
        fill: ${col};
        transform-origin: 60px 66px;
        animation: consensus-heartbeat ${pulseDuration}s ease-in-out infinite;
        filter: url(#comet-glow);
      }
      @keyframes spin-clockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spin-counter-clockwise {
        0% { transform: rotate(360deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes consensus-heartbeat {
        0%, 100% {
          transform: scale(0.8);
          fill: ${col};
          fill-opacity: 0.6;
          filter: drop-shadow(0 0 1px ${col});
        }
        50% {
          transform: scale(1.15);
          fill: ${successColor};
          fill-opacity: 1;
          filter: drop-shadow(0 0 8px ${successColor});
        }
      }
    </style>
  </defs>

  <!-- Static Orbit Tracks -->
  <circle class="orbit-track" cx="60" cy="60" r="26" />
  <circle class="orbit-track" cx="60" cy="60" r="38" />
  <circle class="orbit-track" cx="60" cy="60" r="50" />

  <!-- Inner Orbit Comet (Clockwise) -->
  <g class="comet-group-inner">
    <path d="M 60 34 A 26 26 0 0 1 86 60" fill="none" stroke="url(#comet-grad-1)" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="86" cy="60" r="3" fill="${col}" filter="url(#comet-glow)" />
  </g>

  <!-- Middle Orbit Comet (Counter-Clockwise) -->
  <g class="comet-group-middle">
    <path d="M 60 22 A 38 38 0 0 1 98 60" fill="none" stroke="url(#comet-grad-2)" stroke-width="3" stroke-linecap="round" />
    <circle cx="98" cy="60" r="3.5" fill="${col}" filter="url(#comet-glow)" />
  </g>

  <!-- Outer Orbit Comet (Clockwise) -->
  <g class="comet-group-outer">
    <path d="M 60 10 A 50 50 0 0 1 110 60" fill="none" stroke="url(#comet-grad-3)" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="110" cy="60" r="4" fill="${col}" filter="url(#comet-glow)" />
  </g>

  <!-- Pulsing Consensus Diamond in Center -->
  <path class="center-diamond" d="M 60.00,58.62 L 66.00,70.50 L 60.00,73.45 L 54.31,70.49 Z" />
</svg>`;
    }

    if (concept === 'adjudication') {
      const scanPeriod = (1.6 * speedMult).toFixed(2);

      return `<svg id="genlayer-spinner-adjudication" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <!-- Glow Filter -->
    <filter id="scan-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Scan Line Gradient -->
    <linearGradient id="scan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${col}" stop-opacity="1"/>
      <stop offset="70%" stop-color="${col}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient>

    <style>
      .shard-base {
        fill: ${col};
        stroke: ${col};
        stroke-width: 2;
        transition: fill-opacity 0.2s, stroke-opacity 0.2s;
      }
      .right-wing {
        animation: right-wing-scan ${scanPeriod}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .center-node {
        animation: center-node-scan ${scanPeriod}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .left-wing {
        animation: left-wing-scan ${scanPeriod}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .scan-arc {
        transform-origin: 60px 60px;
        animation: spin-scan ${scanPeriod}s linear infinite;
        stroke-dasharray: 120 194;
        filter: url(#scan-glow);
      }
      @keyframes spin-scan {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes right-wing-scan {
        0%, 100%, 35% { fill-opacity: 0.1; stroke-opacity: 0.2; filter: none; }
        12% { fill-opacity: 0.9; stroke-opacity: 1; filter: drop-shadow(0 0 4px ${col}); }
      }
      @keyframes center-node-scan {
        0%, 100%, 25%, 68% { fill-opacity: 0.1; stroke-opacity: 0.2; filter: none; }
        48% { fill-opacity: 1; stroke-opacity: 1; filter: drop-shadow(0 0 6px ${col}); }
      }
      @keyframes left-wing-scan {
        0%, 100%, 58% { fill-opacity: 0.1; stroke-opacity: 0.2; filter: none; }
        80% { fill-opacity: 0.9; stroke-opacity: 1; filter: drop-shadow(0 0 4px ${col}); }
      }
    </style>
  </defs>

  <!-- Outer Scanning Laser Ring -->
  <circle class="scan-arc" cx="60" cy="60" r="50" fill="none" stroke="url(#scan-grad)" stroke-width="3" stroke-linecap="round" />

  <!-- Background Track Ring for Depth -->
  <circle cx="60" cy="60" r="50" fill="none" stroke="${col}" stroke-opacity="0.05" stroke-width="3" />

  <!-- Logo Group -->
  <g transform="translate(60, 60) scale(0.58) translate(-48.88, -45.965)">
    <path class="shard-base left-wing" d="M 44.26,32.35 L 27.72,67.12 L 43.29,74.9 L 0,91.93 L 44.26,0 Z" />
    <path class="shard-base right-wing" d="M 53.5,32.35 L 70.04,67.12 L 54.47,74.9 L 97.76,91.93 L 53.5,0 Z" />
  </g>

  <!-- Center Diamond Node -->
  <path class="shard-base center-node" d="M 60.00,59.20 L 65.50,70.20 L 60.00,72.90 L 54.70,70.19 Z" />
</svg>`;
    }
    
    return '';
  };

  // --- Action Functions ---

  // Update sizes of the preview containers
  const updateSize = (newSize) => {
    currentSize = newSize;
    sizeSlider.value = newSize;
    sizeValLabel.innerText = `${newSize}px`;

    // Highlight size presets
    sizePresetBtns.forEach(btn => {
      if (parseInt(btn.getAttribute('data-size')) === newSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Apply width/height to all wrappers
    spinnerWrappers.forEach(wrap => {
      wrap.style.width = `${newSize}px`;
      wrap.style.height = `${newSize}px`;
    });
  };

  // Update speed multipliers on CSS variables
  const updateSpeed = (newSpeed) => {
    currentSpeed = newSpeed;
    speedSlider.value = newSpeed;
    speedValLabel.innerText = `${newSpeed.toFixed(1)}x`;

    // Highlight speed presets
    speedPresetBtns.forEach(btn => {
      const btnSpeed = parseFloat(btn.getAttribute('data-speed'));
      if (btnSpeed && btnSpeed === newSpeed) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update CSS variables on app container.
    // E.g., animation speed is inverted since speed scale represents frequency.
    // Double speed multiplier means half the animation duration!
    const speedScale = (1 / newSpeed).toFixed(2);
    appContainer.style.setProperty('--speed-scale', speedScale);

    // Update code exporter
    updateCodePreview();
  };

  // Update colorway variables
  const updateColor = (newColor) => {
    currentColor = newColor;

    // Highlight active dot
    colorDots.forEach(dot => {
      if (dot.getAttribute('data-color') === newColor) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Set variable on container for inline previews
    appContainer.style.setProperty('--gen-cobalt', newColor);

    // Update code exporter
    updateCodePreview();
  };

  // Render syntax highlight code in preview pane
  const updateCodePreview = () => {
    const rawSVG = getSVGSource(activeTab, currentColor, 1 / currentSpeed);
    
    // Simple HTML escaping for display
    const escapedSVG = rawSVG
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    
    // Inject syntax-highlight spans
    const highlightedCode = escapedSVG
      // Elements & tag names
      .replace(/(&lt;\/?[a-z1-9:-]+)/g, '<span class="code-tag">$1</span>')
      .replace(/(\/?&gt;)/g, '<span class="code-tag">$1</span>')
      // Attributes
      .replace(/(\s[a-z1-9:A-Z-]+)=/g, ' <span class="code-attr">$1</span>=')
      // Values
      .replace(/(&quot;[^&]+&quot;)/g, '<span class="code-val">$1</span>')
      // Style blocks helper
      .replace(/(&lt;style&gt;[\s\S]+&lt;\/style&gt;)/g, '<span class="code-style">$1</span>');

    codePreview.innerHTML = highlightedCode;
    currentTabLabel.innerText = `spinner-${activeTab}-${currentColor.replace('#', '')}.svg`;
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    if (currentTheme === 'dark') {
      document.body.setAttribute('data-theme', 'light');
      currentTheme = 'light';
      themeText.innerText = 'Dark Mode';
      // Switch to sun icon
      themeToggle.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    } else {
      document.body.removeAttribute('data-theme');
      currentTheme = 'dark';
      themeText.innerText = 'Light Mode';
      // Switch to moon icon
      themeToggle.querySelector('svg').innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    }
  };

  // Show Toast Alert
  const showToast = (message) => {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  };

  // --- Event Listeners ---

  // Theme button
  themeToggle.addEventListener('click', toggleTheme);

  // Size inputs
  sizeSlider.addEventListener('input', (e) => {
    updateSize(parseInt(e.target.value));
  });

  sizePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-size'));
      if (val) updateSize(val);
    });
  });

  // Speed inputs
  speedSlider.addEventListener('input', (e) => {
    updateSpeed(parseFloat(e.target.value));
  });

  speedPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-speed'));
      if (val) updateSpeed(val);
    });
  });

  // Color inputs
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const col = dot.getAttribute('data-color');
      if (col) updateColor(col);
    });
  });

  // Code inspect action
  inspectCodeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-target');
      if (targetTab) {
        activeTab = targetTab;
        
        // Highlight active tab
        tabBtns.forEach(tBtn => {
          if (tBtn.getAttribute('data-tab') === targetTab) {
            tBtn.classList.add('active');
          } else {
            tBtn.classList.remove('active');
          }
        });

        updateCodePreview();
        
        // Smooth scroll to code preview
        document.getElementById('code-export-panel').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Tab switching in code preview
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        activeTab = tab;
        
        // Reset active state classes
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updateCodePreview();
      }
    });
  });

  // Copy code button action
  copyCodeBtn.addEventListener('click', () => {
    const rawSVG = getSVGSource(activeTab, currentColor, 1 / currentSpeed);
    
    navigator.clipboard.writeText(rawSVG)
      .then(() => {
        showToast('SVG source code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy. Please select and copy manually.');
      });
  });

  // Download SVG file button action
  downloadFileBtn.addEventListener('click', () => {
    const rawSVG = getSVGSource(activeTab, currentColor, 1 / currentSpeed);
    const fileName = `spinner-${activeTab}-${currentColor.replace('#', '')}.svg`;
    
    const blob = new Blob([rawSVG], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    showToast(`Downloaded ${fileName}!`);
  });

  // --- Initialization ---
  updateSize(80);
  updateSpeed(1.0);
  updateColor('#110FFF');
  updateCodePreview();
});
