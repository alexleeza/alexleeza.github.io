/* Original 160 × 176 pixel sprite. No textures, libraries, or network requests. */
function createPortalPainter(canvas) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return null;
  const stone = document.createElement('canvas');
  stone.width = 160;
  stone.height = 176;
  const ink = stone.getContext('2d');
  if (!ink) return null;
  const rect = (x, y, width, height, color) => {
    ink.fillStyle = color;
    ink.fillRect(Math.round(x), Math.round(y), width, height);
  };
  const pixelLine = (x0, y0, x1, y1, color, size = 1) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let step = 0; step <= steps; step++) {
      const mix = steps ? step / steps : 0;
      rect(x0 + (x1 - x0) * mix, y0 + (y1 - y0) * mix, size, size, color);
    }
  };
  const archWidth = (y, radius) => y < 67 ? Math.floor(Math.sqrt(Math.max(0, radius * radius - (67 - y) ** 2))) : radius;
  const inside = (x, y) => y >= 35 && y <= 145 && Math.abs(x - 80) <= archWidth(y, 32);
  for (let y = 18; y <= 146; y++) {
    const outer = archWidth(y, 49);
    for (let x = 80 - outer; x <= 80 + outer; x++) {
      const dx = x - 80;
      const distance = y < 67 ? Math.hypot(dx, y - 67) : Math.abs(dx);
      if (inside(x, y)) continue;
      let color = '#718575';
      if (distance > 47) color = '#253b31';
      else if (distance > 44) color = dx < 5 ? '#c4c9a5' : '#7d917d';
      else if (distance > 42) color = '#435e4b';
      else if (distance < 35) color = '#233e33';
      else if (distance < 37) color = '#a3b591';
      else {
        const grain = (x * 17 + y * 31 + (x * y) % 13) % 37;
        if (grain < 2) color = '#a4b293';
        else if (grain > 33) color = '#5b735e';
        else if (dx > 22) color = '#607860';
      }
      rect(x, y, 1, 1, color);
    }
  }
  // Mortar joints and individual bevels make the arch read as carved blocks.
  for (let angle = -Math.PI; angle <= 0.01; angle += Math.PI / 8) {
    const ax = Math.cos(angle), ay = Math.sin(angle);
    pixelLine(80 + ax * 35, 67 + ay * 35, 80 + ax * 46, 67 + ay * 46, '#344c3c', 2);
    pixelLine(80 + ax * 37 + 2, 67 + ay * 37 - 1, 80 + ax * 44 + 2, 67 + ay * 44 - 1, '#c3c9a6');
  }
  for (const y of [68, 91, 115, 139]) {
    rect(33, y, 14, 2, '#354e3c'); rect(114, y, 14, 2, '#354e3c');
    rect(34, y + 2, 11, 1, '#bec6a2'); rect(115, y + 2, 11, 1, '#9aaa87');
  }
  // Bronze rails catch the energy light along their inner edge.
  for (let y = 33; y <= 143; y++) {
    const width = archWidth(y, 34);
    for (const direction of [-1, 1]) {
      rect(80 + direction * width, y, 1, 1, '#d0b878');
      rect(80 + direction * (width - 1), y, 1, 1, '#e1e8aa');
    }
  }
  const bolt = (x, y) => {
    rect(x - 1, y, 4, 4, '#273f31'); rect(x, y, 2, 2, '#d0b878'); rect(x, y, 1, 1, '#f5e6ac');
  };
  for (const y of [78, 103, 128]) { bolt(36, y); bolt(122, y); }
  const rune = (x, y, mirror) => {
    const sign = mirror ? -1 : 1;
    pixelLine(x, y, x + sign * 4, y + 4, '#b9cfa0');
    pixelLine(x + sign * 4, y + 4, x, y + 8, '#b9cfa0');
    rect(x, y + 2, 1, 5, '#def0b4');
  };
  rune(39, 81, false); rune(121, 81, true);
  rune(38, 106, false); rune(122, 106, true);
  pixelLine(56, 34, 60, 39, '#d6e0b1'); pixelLine(60, 39, 61, 32, '#d6e0b1');
  pixelLine(103, 34, 98, 39, '#b3c89b'); pixelLine(98, 39, 98, 32, '#b3c89b');
  // Keystone and faceted luminous jewel.
  rect(72, 12, 17, 4, '#334c39'); rect(69, 16, 23, 13, '#344b37');
  rect(70, 16, 21, 2, '#e1cb8b'); rect(70, 18, 3, 9, '#bfa063');
  rect(73, 18, 15, 13, '#8c8455'); rect(76, 16, 9, 17, '#253f31');
  rect(78, 17, 5, 13, '#a7d9a2'); rect(76, 21, 9, 5, '#81b983');
  rect(79, 18, 3, 10, '#e3f3bd'); rect(78, 20, 1, 4, '#ffffff');
  rect(83, 22, 1, 5, '#477d58'); rect(76, 31, 9, 2, '#dbc27f');
  // Moss stays attached to the silhouette; there are no surrounding props.
  const moss = [[39,42,7],[34,49,8],[31,58,7],[31,70,4],[43,36,6],[108,30,7],[116,39,7],[123,47,6],[125,59,4],[30,133,8],[119,132,9]];
  for (const [x, y, w] of moss) {
    rect(x, y + 2, w, 3, '#365d3a'); rect(x + 1, y, w - 2, 3, '#719355');
    rect(x + 1, y, 2, 1, '#bcc783'); rect(x + w - 3, y + 3, 2, 4, '#477447');
  }
  pixelLine(33, 73, 34, 86, '#537d49'); rect(31, 79, 3, 2, '#749a56'); rect(34, 83, 3, 2, '#456b40');
  pixelLine(127, 60, 126, 77, '#456b40'); rect(127, 67, 3, 2, '#749a56');
  // Integrated footing, worn edges, and bronze threshold.
  rect(26, 143, 108, 8, '#263c31'); rect(24, 151, 112, 7, '#263c31');
  rect(29, 141, 102, 3, '#bcc5a0'); rect(28, 144, 104, 5, '#73876c');
  rect(27, 150, 106, 2, '#a4b18c'); rect(26, 152, 108, 3, '#5b735a');
  rect(31, 155, 98, 2, '#3b5742'); rect(49, 141, 62, 3, '#d8c784');
  rect(51, 142, 58, 1, '#edf0b7'); rect(34, 145, 17, 1, '#c9cfaa');
  rect(66, 145, 12, 1, '#a7b692'); rect(106, 150, 18, 1, '#d1d6b1');
  for (const x of [48, 76, 106]) { rect(x, 152, 1, 3, '#344d39'); rect(x + 1, 153, 1, 2, '#8b9e7b'); }
  rect(30, 141, 8, 2, '#719355'); rect(120, 143, 9, 2, '#719355');
  rect(29, 142, 3, 1, '#bfcc89'); rect(124, 142, 3, 1, '#bfcc89');
  const energy = context.createImageData(160, 176);
  const points = [];
  for (let y = 35; y <= 143; y++) {
    for (let x = 48; x <= 112; x++) {
      if (!inside(x, y)) continue;
      const nx = (x - 80) / 32, ny = (y - 90) / 54;
      points.push({index: (y * 160 + x) * 4, x, y, radius: Math.hypot(nx, ny), angle: Math.atan2(ny, nx)});
    }
  }
  const colors = ['#162f2b','#1e4436','#285b41','#397851','#579363','#7bb27a','#add599','#e0efb6'].map(hex => [1,3,5].map(start => parseInt(hex.slice(start,start+2),16)));
  const livePixel = (x, y, width, height, color) => {
    context.fillStyle = color;
    context.fillRect(Math.round(x), Math.round(y), width, height);
  };
  const liveLine = (x0, y0, x1, y1, color) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let step = 0; step <= steps; step++) {
      const mix = steps ? step / steps : 0;
      livePixel(x0 + (x1 - x0) * mix, y0 + (y1 - y0) * mix, 1, 1, color);
    }
  };
  const rupture = (y, opening) => {
    const reach = 9 + 47 * Math.min(1, opening * 2.1);
    const position = (y - 89) / reach;
    if (Math.abs(position) >= 1) return -1;
    const jaggedEdge = (((Math.floor(y / 4) * 7) % 5) - 2) * (1 - opening);
    return Math.max(.5, 32 * opening * Math.sqrt(1 - position * position) + jaggedEdge);
  };
  context.imageSmoothingEnabled = false;
  return function paint(time, charge = 0, burst = 0, opening = 0) {
    charge = Math.max(0, Math.min(1, charge));
    opening = Math.max(0, Math.min(1, opening));
    const power = Math.min(1, Math.max(charge, burst, opening * 1.8));
    const tunnelWidth = Math.max(1, 32 * opening);
    const tunnelHeight = 9 + 47 * Math.min(1, opening * 2.1);
    for (const point of points) {
      const { index, x, y, radius, angle } = point;
      const spiral = Math.sin(radius * 15.5 - angle * 2 - time * (1.1 + charge * 1.9) + opening * 6);
      const strand = Math.sin(radius * 24 + angle * 3 + time * (.55 + charge * .8));
      const edge = Math.max(0, 1 - Math.abs(radius - .94) * 14);
      const dither = ((x + y) % 2) * .24;
      let level = Math.max(0, Math.min(7, Math.floor(1.3 + spiral * 1.5 + strand * .6 + edge * (3 + power * 2) + power * 2.2 + dither)));
      if (radius < .13) level = Math.min(level, 1);
      let rgb = colors[level];
      if (opening > .01) {
        const boundary = rupture(y, opening);
        const fromSeam = Math.abs(x - 80);
        if (boundary >= 0 && fromSeam < boundary - 1.8) {
          // Log-spaced bands contract toward the vanishing point as time advances.
          // Angular offsets twist them into a tunnel that stays alive when fully open.
          const tx = (x - 80) / tunnelWidth;
          const ty = (y - 89) / tunnelHeight;
          const tunnelRadius = Math.hypot(tx, ty);
          const depth = -Math.log(Math.max(.065, tunnelRadius));
          const turn = Math.atan2(ty, tx);
          const bands = Math.sin(depth * 10 - time * 7 + turn * 2);
          const ribs = Math.sin(turn * 3 + depth * 3.4 + time * 2.9);
          const tunnelLevel = Math.max(0, Math.min(6, Math.floor(
            tunnelRadius * (2.1 + Math.max(0, bands) * 3.6 + Math.max(0, ribs) * 1.4) + dither
          )));
          rgb = colors[tunnelLevel];
          if (bands < -.55) rgb = [13, 35, 28];
          if (tunnelRadius < .13) rgb = [8, 21, 19];
          else if (tunnelRadius < .25 && tunnelLevel < 2) rgb = [13, 31, 25];
          if (fromSeam > boundary - 4) rgb = [65, 113, 69];
        } else if (boundary >= 0 && Math.abs(fromSeam - boundary) < 1.8) {
          rgb = ((x + y) % 3) ? [239, 255, 199] : [160, 222, 142];
        } else if (boundary >= 0 && Math.abs(fromSeam - boundary) < 4) {
          rgb = [101, 164, 102];
        }
      }
      energy.data[index] = rgb[0]; energy.data[index + 1] = rgb[1]; energy.data[index + 2] = rgb[2]; energy.data[index + 3] = 255;
    }
    context.clearRect(0, 0, 160, 176);
    context.putImageData(energy, 0, 0);
    for (let i = 0; i < 15; i++) {
      const angle = i * 2.4 + time * (.17 + (i % 3) * .035);
      const radius = .22 + ((i * 7) % 12) / 18;
      const x = Math.round(80 + Math.cos(angle) * radius * 29);
      const y = Math.round(90 + Math.sin(angle) * radius * 49);
      if (!inside(x, y)) continue;
      if (opening > .01 && Math.abs(x - 80) < rupture(y, opening)) continue;
      context.fillStyle = i % 4 === 0 ? '#eef2c7' : '#96c38b';
      context.fillRect(x, y, 1, i % 5 === 0 ? 2 : 1);
    }
    // Charged arcs stay within the aperture and travel faster than the membrane.
    if (power > .12) {
      const orbit = .78 + power * .1;
      for (let arm = 0; arm < 3; arm++) {
        const start = time * (1.2 + power * 1.7) + arm * Math.PI * 2 / 3;
        for (let step = 0; step < 21; step++) {
          const angle = start + step * .038;
          const x = Math.round(80 + Math.cos(angle) * 30 * orbit);
          const y = Math.round(90 + Math.sin(angle) * 51 * orbit);
          if (!inside(x, y)) continue;
          if (opening > .01 && Math.abs(x - 80) < rupture(y, opening) + 2) continue;
          livePixel(x, y, 1, step > 16 ? 2 : 1, step > 13 ? '#efffc7' : '#aedb96');
        }
      }
    }
    if (opening > .12) {
      // Small bright fragments visibly spiral down the tunnel, then vanish at depth.
      for (let i = 0; i < 12; i++) {
        const journey = (time * .48 + i / 12) % 1;
        const radius = .08 + Math.pow(1 - journey, 1.5) * .81;
        const angle = i * 2.4 - time * 3.2 - journey * 5;
        const x = Math.round(80 + Math.cos(angle) * tunnelWidth * radius);
        const y = Math.round(89 + Math.sin(angle) * tunnelHeight * radius);
        if (!inside(x, y) || Math.abs(x - 80) >= rupture(y, opening) - 2) continue;
        const size = radius > .65 ? 2 : 1;
        const color = radius > .5 ? '#cee7a7' : radius > .25 ? '#8dbd7c' : '#416e49';
        livePixel(x, y, size, size, color);
      }
    }
    context.drawImage(stone, 0, 0);
    if (power > .12) {
      const glow = power > .6 ? '#f2ffd0' : '#c4e9a3';
      const rim = power > .6 ? '#c9efa5' : '#8fc27c';
      // One-pixel light on the rail, with no blur, halo, or cast shadow.
      for (let y = 34; y <= 141; y++) {
        const width = archWidth(y, 33);
        livePixel(80 - width, y, 1, 1, rim);
        livePixel(80 + width, y, 1, 1, rim);
      }
      for (const [x, y, sign] of [[39,81,1],[121,81,-1],[38,106,1],[122,106,-1]]) {
        liveLine(x, y, x + sign * 4, y + 4, glow);
        liveLine(x + sign * 4, y + 4, x, y + 8, glow);
        livePixel(x, y + 2, 1, 5, '#f5ffd7');
      }
      liveLine(56, 34, 60, 39, glow); liveLine(60, 39, 61, 32, glow);
      liveLine(103, 34, 98, 39, glow); liveLine(98, 39, 98, 32, glow);
      livePixel(78, 17, 5, 13, rim); livePixel(76, 21, 9, 5, glow);
      livePixel(79, 17, 3, 12, '#faffdf'); livePixel(78, 19, 1, 6, '#ffffff');
      livePixel(50, 141, 60, 1, glow);
      // Tiny contained sparks crawl along the rim, keeping one clear silhouette.
      for (let i = 0; i < 7; i++) {
        const y = 40 + ((Math.floor(time * (17 + power * 15)) + i * 15) % 98);
        const width = Math.max(1, archWidth(y, 32) - 1);
        const x = 80 + (i % 2 ? -1 : 1) * width;
        livePixel(x, y, 2, 2, '#f5ffd7');
        if (power > .6) livePixel(x, y - 2, 1, 1, '#bddb99');
      }
    }
  };
}
