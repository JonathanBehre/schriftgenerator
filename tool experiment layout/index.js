
//---------//  

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('typehere');
  const preview = document.getElementById('preview');
  const exportPng = document.getElementById('export-png');
  const exportSvg = document.getElementById('export-svg');
  const exportScaleSelect = document.getElementById('export-scale');
  const enableOptionsCheckbox = document.getElementById('enable-options');
  const pageGrid = document.querySelector('.page-grid');
  const dropdown = document.getElementById('dropdown');
  if (!input || !dropdown) return;

  // Handle enable options checkbox
  if (enableOptionsCheckbox && pageGrid) {
    enableOptionsCheckbox.addEventListener('change', () => {
      if (enableOptionsCheckbox.checked) {
        pageGrid.classList.add('visible');
      } else {
        pageGrid.classList.remove('visible');
      }
    });
  }

  // Handle randomize button
  const randomizeButton = document.getElementById('randomizer');
  if (randomizeButton) {
    randomizeButton.addEventListener('click', () => {
      // baseFontSize stays fixed at initial value — no reset needed

      // Randomize font
      if (fontSelect) {
        const options = fontSelect.options;
        fontSelect.selectedIndex = Math.floor(Math.random() * options.length);
        fontSelect.dispatchEvent(new Event('change'));
      }

      // Randomize color
      if (dropdown) {
        const colorOptions = dropdown.options;
        dropdown.selectedIndex = Math.floor(Math.random() * colorOptions.length);
        dropdown.dispatchEvent(new Event('change'));
      }

      // Randomize neon glow color
      if (neonglowColorSelect) {
        const glowOptions = neonglowColorSelect.options;
        neonglowColorSelect.selectedIndex = Math.floor(Math.random() * glowOptions.length);
        neonglowColorSelect.dispatchEvent(new Event('change'));
      }

      // Randomize sliders
      const randomizeSlider = (slider, min, max) => {
        if (slider) {
          const sliderMin = parseFloat(slider.min);
          const sliderMax = parseFloat(slider.max);
          slider.value = sliderMin + Math.random() * (sliderMax - sliderMin);
          slider.dispatchEvent(new Event('input'));
        }
      };

      randomizeSlider(weightSlider, 10, 900);
      randomizeSlider(widthSlider, 80, 150);
      randomizeSlider(heightSlider, 80, 150);
      randomizeSlider(letterspaceSlider, -100, 350);
      randomizeSlider(italicSlider, -60, 60);
      randomizeSlider(neonglowSlider, 0, 3000);
      randomizeSlider(splitSlider, 0, 3000);

      // Randomize border checkbox (50% chance)
      if (textborderCheckbox) {
        textborderCheckbox.checked = Math.random() > 0.5;
        textborderCheckbox.dispatchEvent(new Event('change'));
      }

      // Randomize border color
      if (borderColorSelect) {
        const borderOptions = borderColorSelect.options;
        borderColorSelect.selectedIndex = Math.floor(Math.random() * borderOptions.length);
        borderColorSelect.dispatchEvent(new Event('change'));
      }

      // Randomize border radius
      randomizeSlider(borderRadiusSlider, 0, 100);
    });
  }

  const applyColor = () => {
    const color = dropdown.value;
    input.style.color = color;
    if (preview) preview.style.color = color;
  };

  dropdown.addEventListener('change', applyColor);

  // apply initial color on load
  applyColor();
//---------//  
  // Font dropdown: apply selected font-family to the input
  const fontSelect = document.getElementById('Font');
  if (fontSelect) {
    const applyFont = () => {
      // use the option value as the font-family string
      const ff = fontSelect.value;
      if (ff) input.style.fontFamily = ff;
    };

    fontSelect.addEventListener('change', applyFont);
    // apply initial selection
    applyFont();
  }
//---------//
  // Link existing slider with id="weight" to font-weight of the input
  const weightSlider = document.getElementById('weight');
  if (weightSlider) {
    const applyWeight = () => {
      const w = weightSlider.value;
      // set font-weight (CSS accepts numeric values like "400")
      input.style.fontWeight = w;
      if (preview) preview.style.fontWeight = w;
    };

    // update while sliding
    weightSlider.addEventListener('input', applyWeight);

    // apply initial weight
    applyWeight();
  }

  // Controls for width/height and additional visual effects
  const widthSlider = document.getElementById('width');
  const heightSlider = document.getElementById('height');

  const textborderCheckbox = document.getElementById('checkbox');
  const borderColorSelect = document.getElementById('bordercolor');
  const borderRadiusSlider = document.getElementById('borderradius');

  const letterspaceSlider = document.getElementById('letterspace');
  const italicSlider = document.getElementById('italicstrength');
  const neonglowSlider = document.getElementById('neonglow');
  const neonglowColorSelect = document.getElementById('neonglow-color');
  const splitSlider = document.getElementById('split');

  // base font-size in pixels (read from computed style so it matches CSS)
  // Store the INITIAL font size and never change it
  const initialFontSize = parseFloat(getComputedStyle(input).fontSize) || 40;
  let baseFontSize = initialFontSize;

  const updateStyles = () => {
    // --- size & transform ---
    const w = widthSlider ? parseFloat(widthSlider.value) : 100; // 50..200
    const h = heightSlider ? parseFloat(heightSlider.value) : 100; // 50..200

    const scaleX = (w / 100).toFixed(3);
    const fontSizePx = (baseFontSize * (h / 100)).toFixed(1);

    // italic as skewX (degrees)
    const italic = italicSlider ? parseFloat(italicSlider.value) : 0; // 0..20
    const skewDeg = -italic; // negative for right-leaning

    // compose transforms: scaleX then skewX
    input.style.transform = `scaleX(${scaleX}) skewX(${skewDeg}deg)`;
    input.style.fontSize = `${fontSizePx}px`;
    if (preview) {
      preview.style.transform = input.style.transform;
      preview.style.fontSize = input.style.fontSize;
    }

    // --- letter spacing ---
    if (letterspaceSlider) {
      // map 0..200 -> 0..20px
      input.style.letterSpacing = `${(parseFloat(letterspaceSlider.value) / 10).toFixed(2)}px`;
      if (preview) preview.style.letterSpacing = input.style.letterSpacing;
    }

    // --- text border / stroke ---
    const borderEnabled = textborderCheckbox && textborderCheckbox.checked;
    const borderColor = borderColorSelect ? borderColorSelect.value : 'black';
    const borderThickness = borderRadiusSlider ? (parseFloat(borderRadiusSlider.value) / 10) : 0; // map 0..100 -> 0..10px

    if (borderEnabled && borderThickness > 0) {
      input.style.webkitTextStroke = `${borderThickness}px ${borderColor}`;
      input.style.textShadow = input.style.textShadow || '';
      if (preview) preview.style.webkitTextStroke = input.style.webkitTextStroke;
    } else {
      input.style.webkitTextStroke = `0px transparent`;
      if (preview) preview.style.webkitTextStroke = input.style.webkitTextStroke;
    }

    // --- neon glow & split & other shadows ---
    // Create shadows exactly matching SVG export logic for perfect preview match
    const shadows = [];

    // neon glow: use neon glow color selector or fallback to main color
    const neonColor = neonglowColorSelect ? neonglowColorSelect.value : 'white';
    const neonBlur = neonglowSlider ? (parseFloat(neonglowSlider.value) / 100) : 0;
    
    // Neon glow: add multiple offset copies with decreasing opacity to match SVG
    if (neonBlur > 0) {
      const glowSteps = Math.max(3, Math.ceil(neonBlur / 5)); // more blur = more copies
      for (let i = glowSteps; i >= 1; i--) {
        const offset = (neonBlur / glowSteps) * i;
        const opacity = 0.4 * (1 - (i / (glowSteps + 1))); // decreasing opacity
        // Create shadow copies in all 4 directions (matching SVG offset approach)
        shadows.push(`${offset * 0.5}px 0 0 rgba(${hexToRgb(neonColor).join(',')}, ${opacity})`);
        shadows.push(`-${offset * 0.5}px 0 0 rgba(${hexToRgb(neonColor).join(',')}, ${opacity})`);
        shadows.push(`0 ${offset * 0.5}px 0 rgba(${hexToRgb(neonColor).join(',')}, ${opacity})`);
        shadows.push(`0 -${offset * 0.5}px 0 rgba(${hexToRgb(neonColor).join(',')}, ${opacity})`);
      }
    }

    // split: create two offset shadow copies above and below
    const splitOffset = splitSlider ? (parseFloat(splitSlider.value) / 100) : 0;
    if (splitOffset > 0) {
      const splitColor = dropdown ? dropdown.value : 'white';
      shadows.push(`0 -${splitOffset}px 0 ${splitColor}`);
      shadows.push(`0 ${splitOffset}px 0 ${splitColor}`);
    }

    // preserve existing textShadow if any (but we overwrite with constructed list)
    input.style.textShadow = shadows.join(', ');
    if (preview) preview.style.textShadow = input.style.textShadow;

    // blur removed — no JS handling for blur (filter) per request
  };

  // Helper function: convert hex color to rgb(r,g,b) for rgba shadows
  const hexToRgb = (hex) => {
    // Handle named colors by converting to hex first
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = hex;
    const computedColor = ctx.fillStyle;
    // computedColor is now in #RRGGBB format
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(computedColor);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
  };

  // wire events for everything
  const controls = [widthSlider, heightSlider, textborderCheckbox, borderColorSelect, borderRadiusSlider, letterspaceSlider, italicSlider, neonglowSlider, splitSlider];
  controls.forEach(c => {
    if (!c) return;
    const ev = c.type === 'checkbox' ? 'change' : 'input';
    c.addEventListener(ev, updateStyles);
  });

  // Handle neon glow color selection
  if (neonglowColorSelect) {
    neonglowColorSelect.addEventListener('change', updateStyles);
  }

  // when font changes, don't recalc baseFontSize — keep it fixed to initial value
  if (fontSelect) {
    fontSelect.addEventListener('change', () => {
      // allow browser to apply font then update styles
      requestAnimationFrame(() => {
        updateStyles();
      });
    });
  }

  // initial apply
  updateStyles();

  // mirror content to hidden preview for export
  const syncPreviewContent = () => {
    if (!preview) return;
    const txt = input.value || input.placeholder || '';
    preview.textContent = txt;
    // copy ALL computed styles from the visible input into the preview
    const cs = window.getComputedStyle(input);
    const props = ['font-family','font-weight','font-size','letter-spacing','color','text-shadow','-webkit-text-stroke','transform','text-align','padding','background-color','white-space','display','box-sizing','transform-origin'];
    props.forEach(k => {
      try {
        const v = cs.getPropertyValue(k);
        if (v) preview.style.setProperty(k, v);
      } catch (e) {}
    });
    // ensure preview is inline-block so size equals text content
    preview.style.display = 'inline-block';
  };

  // sync on input/change
  input.addEventListener('input', () => {
    syncPreviewContent();
  });

  // initial sync
  syncPreviewContent();

  // --- Export functions ---
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const createSvgStringFromPreview = () => {
    if (!preview) return null;
    // ensure preview has content and inline styles
    syncPreviewContent();

    // measure preview size (temporarily ensure measurable)
    const prevStyle = {
      position: preview.style.position || '',
      left: preview.style.left || '',
      top: preview.style.top || '',
      visibility: preview.style.visibility || ''
    };
    preview.style.position = 'absolute';
    preview.style.left = '0px';
    preview.style.top = '0px';
    preview.style.visibility = 'hidden';
    const rect = preview.getBoundingClientRect();
    const width = Math.max(10, Math.ceil(rect.width));
    const height = Math.max(10, Math.ceil(rect.height));
    preview.style.position = prevStyle.position;
    preview.style.left = prevStyle.left;
    preview.style.top = prevStyle.top;
    preview.style.visibility = prevStyle.visibility;

    // pull computed styles we need for a proper SVG <text> element
    const cs = window.getComputedStyle(preview);
    const fontFamily = cs.getPropertyValue('font-family') || 'sans-serif';
    const fontWeight = parseInt(cs.getPropertyValue('font-weight')) || 400;
    const fill = cs.getPropertyValue('color') || '#000';
    // IMPORTANT: Use exact letter-spacing from computed style to match preview
    const letterSpacing = cs.getPropertyValue('letter-spacing') || '0px';
    const textStrokeStr = cs.getPropertyValue('-webkit-text-stroke') || 'none';

    // use the same logical transforms as the UI: scaleX from width slider, font-size from height slider, skew from italic
    const w = widthSlider ? parseFloat(widthSlider.value) : 100;
    const h = heightSlider ? parseFloat(heightSlider.value) : 100;
    const scaleX = (w / 100);
    const fontSizePx = (baseFontSize * (h / 100));
    const italic = italicSlider ? parseFloat(italicSlider.value) : 0;
    const skewDeg = -italic;

    // --- Extract all effects from the current state ---
    // For SVG, use COMPUTED styles from preview to match exactly what user sees
    // Parse stroke from -webkit-text-stroke (e.g., "2px #FF0000", "2px rgb(255, 0, 0)", "2px red")
    let strokeAttr = '';
    if (textStrokeStr && textStrokeStr !== 'none' && textStrokeStr !== '0px') {
      // Parse format: "2px #FF0000" or "2px rgb(255, 0, 0)" or "2px red"
      // Match: number + 'px' + color (which can be hex, rgb, or name)
      const strokeMatch = textStrokeStr.match(/^([\d.]+)px\s+(.+)$/);
      if (strokeMatch) {
        const strokeWidth = parseFloat(strokeMatch[1]);
        const strokeColor = strokeMatch[2].trim();
        if (strokeWidth > 0) {
          strokeAttr = `stroke="${strokeColor}" stroke-width="${strokeWidth}" paint-order="stroke fill"`;
        }
      }
    }
    
    // FALLBACK: If parsing failed, recalculate from UI controls (for compatibility)
    if (!strokeAttr) {
      const borderEnabled = textborderCheckbox && textborderCheckbox.checked;
      if (borderEnabled) {
        const borderColor = borderColorSelect ? borderColorSelect.value : 'black';
        const borderThickness = borderRadiusSlider ? (parseFloat(borderRadiusSlider.value) / 10) : 0; // map 0..100 -> 0..10px
        if (borderThickness > 0) {
          strokeAttr = `stroke="${borderColor}" stroke-width="${borderThickness}" paint-order="stroke fill"`;
        }
      }
    }

    // neon glow effect (from slider)
    const neonColor = neonglowColorSelect ? neonglowColorSelect.value : 'white';
    const neonBlur = neonglowSlider ? (parseFloat(neonglowSlider.value) / 100) : 0;

    // split effect (from slider)
    const splitOffset = splitSlider ? (parseFloat(splitSlider.value) / 100) : 0;

    const text = (input.value || input.placeholder || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    // Sanitize font family for SVG attributes (remove quotes, escape problematic chars)
    const sanitizedFontFamily = fontFamily.replace(/['"`]/g, '').trim() || 'sans-serif';

    // center text horizontally and vertically
    const x = width / 2;
    const y = height / 2;

    // build transform: translate to center, then scale and skew
    const transform = `translate(${x}, ${y}) scale(${scaleX}, 1) skewX(${skewDeg})`;

    // Build defs section with filters if needed
    let defs = '';

    // Build shadow elements for glow and split
    let shadowElements = '';

    // Neon glow: add multiple offset copies with decreasing opacity to create glow effect
    if (neonBlur > 0) {
      const glowSteps = Math.max(3, Math.ceil(neonBlur / 5)); // more blur = more copies
      for (let i = glowSteps; i >= 1; i--) {
        const offset = (neonBlur / glowSteps) * i;
        const opacity = 0.4 * (1 - (i / (glowSteps + 1))); // decreasing opacity
        shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${neonColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle; opacity: ${opacity};" transform="${transform} translate(${offset * 0.5}, 0)">${text}</text>\n`;
        shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${neonColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle; opacity: ${opacity};" transform="${transform} translate(-${offset * 0.5}, 0)">${text}</text>\n`;
        shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${neonColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle; opacity: ${opacity};" transform="${transform} translate(0, ${offset * 0.5})">${text}</text>\n`;
        shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${neonColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle; opacity: ${opacity};" transform="${transform} translate(0, -${offset * 0.5})">${text}</text>\n`;
      }
    }

    // Split effect: offset copies above and below
    if (splitOffset > 0) {
      const splitColor = dropdown ? dropdown.value : 'black';
      const transformAbove = `translate(${x}, ${y - splitOffset}) scale(${scaleX}, 1) skewX(${skewDeg})`;
      const transformBelow = `translate(${x}, ${y + splitOffset}) scale(${scaleX}, 1) skewX(${skewDeg})`;
      shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${splitColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle;" transform="${transformAbove}">${text}</text>\n`;
      shadowElements += `<text x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${splitColor}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle;" transform="${transformBelow}">${text}</text>\n`;
    }

    // Main text with border (stroke) if enabled
    const mainText = `<text ${strokeAttr} x="0" y="0" style="font-family: ${sanitizedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSizePx}px; fill: ${fill}; letter-spacing: ${letterSpacing}; text-anchor: middle; dominant-baseline: middle;" transform="${transform}">${text}</text>`;

    // Build SVG with proper defs section
    let defsSection = '';
    if (defs) {
      defsSection = `  <defs>${defs}</defs>\n`;
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
      `${defsSection}  <g>\n` +
      `${shadowElements}    ${mainText}\n` +
      `  </g>\n` +
      `</svg>`;

    return {svg, width, height};
  };

  const exportPNG = async () => {
    const data = createSvgStringFromPreview();
    if (!data) return;
    const {svg, width, height} = data;
    
    // read export scale from select
    const scaleValue = exportScaleSelect ? parseFloat(exportScaleSelect.value) : 1;
    const scaledWidth = width * scaleValue;
    const scaledHeight = height * scaleValue;
    
    // wait for fonts to be ready so text renders into the image
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    const img = new Image();
    // Use data URL for SVG to improve Safari compatibility
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    await new Promise((res, rej) => {
      img.onload = () => res();
      img.onerror = (e) => rej(new Error('Image load error: ' + e));
      // try anonymous CORS just in case external fonts/images are used
      try { img.crossOrigin = 'anonymous'; } catch (e) {}
      img.src = svgDataUrl;
    });

    // create canvas at scaled size and device pixel ratio for crisper output
    const ratio = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(scaledWidth * ratio));
    canvas.height = Math.max(1, Math.round(scaledHeight * ratio));
    canvas.style.width = scaledWidth + 'px';
    canvas.style.height = scaledHeight + 'px';
    const ctx = canvas.getContext('2d');
    if (ratio !== 1) ctx.scale(ratio, ratio);

    // draw the rasterized SVG onto canvas
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // prefer toBlob, fallback to dataURL for older Safari versions
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        downloadBlob(blob, 'schriftzug.png');
      }, 'image/png');
    } else {
      // fallback: data URL -> convert to blob
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
        const blob = new Blob([u8], {type: 'image/png'});
        downloadBlob(blob, 'schriftzug.png');
      } catch (e) {
        console.error('PNG export failed', e);
        alert('PNG export ist fehlgeschlagen. Bitte versuche den SVG-Export oder einen anderen Browser.');
      }
    }
  };

  const exportSVG = () => {
    const data = createSvgStringFromPreview();
    if (!data) return;
    const {svg} = data;
    const blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
    downloadBlob(blob, 'schriftzug.svg');
  };

  if (exportPng) exportPng.addEventListener('click', exportPNG);
  if (exportSvg) exportSvg.addEventListener('click', exportSVG);
});
