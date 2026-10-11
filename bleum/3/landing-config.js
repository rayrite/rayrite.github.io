/* ============================================================================
   DUKR ChronoSync — central config
   ----------------------------------------------------------------------------
   Everything you are likely to change lives in THIS file.

   RENAMED A TIMELINE FILE?  Edit that subject's  file:  value below. Nothing
   else needs to change; every landing page reads from here.

   ADDING A SUBJECT?  Copy one block in subjects[], give it a unique id, point
   file: at the new HTML file and portrait: at its image.

   Paths are relative to the project root (the folder holding this file).
   ============================================================================ */
window.CHRONOSYNC = (function () {
  var script = document.currentScript;
  var cfg = {

    /* ---- Brand text ------------------------------------------------------ */
    brand: {
      title:   'DUKR ChronoSync',
      tagline: 'Pick a life. Scrub through time.',
      footer:  '© 2026. Coolyvison Inc. All rights reserved.'
    },

    /* ---- Where the timeline HTML files live ------------------------------ */
    timelinesDir: 'subjects/',
    openInNewTab: true,          // true = timelines open in a new tab

    /* ---- Background presets (used by index-orbit-random.html) ------------
       mode         'random'  = pick a new background on every page load/reload
                    or an id from the list below (e.g. 'aurora') to lock one;
                    a locked id ignores the on/off switches.
       avoidRepeat  true = random mode never repeats the previous pick
       showLabel    true = show a small "Background: ..." tag (handy for reviewing)
       presets      true = may be chosen, false = never chosen. If every one is
                    false the page falls back to 'starfield'.
       Preview any preset without editing this file by adding  ?bg=aurora  to the URL
       (and  ?label  to show its name).                                         */
    background: {
      mode:        'random',
      avoidRepeat: true,
      showLabel:   false,
      presets: {
        'starfield':     true,    // drifting stars, shooting star       (dark)
        'film-grain':    true,    // film grain + warm light leaks       (dark)
        'ocean-swell':   true,    // layered rolling waves               (dark)
        'aurora':        true,    // slow drifting colour clouds         (dark)
        'brass-rings':   true,    // turning concentric brass rings      (dark)
        'time-stream':   true,    // particles flowing down a line       (dark)
        'constellation': true,    // twinkling star-map with links       (dark)
        'deep-glow':     true,    // rising glowing motes                (dark)
        'pastel-shapes': true,    // confetti shapes drifting up         (LIGHT)
        'radar':         true,    // radar sweep with blips              (dark)
        'bokeh':         true,    // soft out-of-focus lights            (dusk)
        'clouds':        true     // clouds drifting past a sun          (LIGHT)
      }
    },

    /* ---- Subjects (menu order = array order) ----------------------------- */
    subjects: [
      {
        id:       'beyonce',
        name:     'Beyoncé',
        fullName: 'Beyoncé Giselle Knowles-Carter',
        file:     'chronosync-beyonce-timeline-v2.0.1.html',     // <-- filename
        portrait: 'assets/portraits/beyonce.jpg',
        focus:    '50% 22%',                                     // crop focus (object-position)
        accent:   '#f472b6',
        tagline:  'Singer, songwriter and performer',
        credit:   { author: 'Raph_PH', license: 'CC BY 2.0',
                    source: 'https://commons.wikimedia.org/wiki/File:Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_(10_of_118)_(52946364598)_(best_crop).jpg' }
      },
      {
        id:       'drake',
        name:     'Drake',
        fullName: 'Aubrey Drake Graham',
        file:     'chronosync-drake-timeline-v1.3.1.html',       // <-- filename
        portrait: 'assets/portraits/drake.jpg',
        focus:    '45% 20%',
        accent:   '#fb923c',
        tagline:  'Rapper, singer and producer',
        credit:   { author: 'GabboT (crop by UCinternational)', license: 'CC BY-SA 2.0',
                    source: 'https://commons.wikimedia.org/wiki/File:Drake,_2017_Toronto_International_Film_Festival.jpg' }
      },
      {
        id:       'elon-musk',
        name:     'Elon Musk',
        fullName: 'Elon Musk',
        file:     'chronosync-elon-musk-timeline-v1.3.1.html',   // <-- filename
        portrait: 'assets/portraits/elon-musk.jpg',
        focus:    '50% 28%',
        accent:   '#38bdf8',
        tagline:  'Engineer and entrepreneur',
        credit:   { author: 'Gage Skidmore', license: 'CC BY-SA 4.0',
                    source: 'https://commons.wikimedia.org/wiki/File:Elon_Musk_(54816836217)_(cropped_2)_(b).jpg' }
      },
      {
        id:       'kendrick-lamar',
        name:     'Kendrick Lamar',
        fullName: 'Kendrick Lamar Duckworth',
        file:     'chronosync-kendrick-lamar-timeline-v1.6.3.html', // <-- filename
        portrait: 'assets/portraits/kendrick-lamar.jpg',
        focus:    '50% 30%',
        accent:   '#eab308',
        tagline:  'Rapper, songwriter and Pulitzer winner',
        credit:   { author: 'Fuzheado', license: 'CC BY-SA 4.0',
                    source: 'https://commons.wikimedia.org/wiki/File:Pulitzer2018-portraits-kendrick-lamar_(cropped).jpg' }
      }
    ]
  };

  /* ---- Do not edit below: folder this config lives in -------------------- */
  cfg.root = script && script.src ? script.src.replace(/[^\/]*$/, '') : '';
  return cfg;
})();
