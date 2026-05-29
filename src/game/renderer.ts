import { Bird, Pipe } from './types';
import * as C from './constants';

export function drawSky(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, C.CANVAS_HEIGHT - C.GROUND_HEIGHT);
  gradient.addColorStop(0, C.SKY_COLOR_TOP);
  gradient.addColorStop(1, C.SKY_COLOR_BOTTOM);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT - C.GROUND_HEIGHT);
}

// Clouds (decorative)
const cloudPositions = [
  { x: 50, y: 60, w: 80, h: 30 },
  { x: 220, y: 100, w: 100, h: 35 },
  { x: 340, y: 45, w: 70, h: 25 },
  { x: 140, y: 150, w: 60, h: 22 },
];

export function drawClouds(ctx: CanvasRenderingContext2D, offset: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  cloudPositions.forEach(c => {
    const x = ((c.x - offset * 0.3) % (C.CANVAS_WIDTH + c.w) + C.CANVAS_WIDTH + c.w) % (C.CANVAS_WIDTH + c.w) - c.w;
    ctx.beginPath();
    ctx.ellipse(x + c.w / 2, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + c.w * 0.3, c.y + 5, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + c.w * 0.7, c.y + 3, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawGround(ctx: CanvasRenderingContext2D, offset: number) {
  const groundY = C.CANVAS_HEIGHT - C.GROUND_HEIGHT;

  // Dirt
  ctx.fillStyle = C.GROUND_COLOR;
  ctx.fillRect(0, groundY, C.CANVAS_WIDTH, C.GROUND_HEIGHT);

  // Top stripe
  ctx.fillStyle = C.GROUND_STRIPE;
  ctx.fillRect(0, groundY, C.CANVAS_WIDTH, 3);

  // Green grass
  ctx.fillStyle = '#6abf26';
  ctx.fillRect(0, groundY + 3, C.CANVAS_WIDTH, 12);

  // Scrolling pattern
  ctx.fillStyle = C.GROUND_DARK;
  const patternWidth = 24;
  const startX = -(offset % patternWidth);
  for (let x = startX; x < C.CANVAS_WIDTH; x += patternWidth) {
    ctx.fillRect(x, groundY + 15, patternWidth / 2, 2);
  }
}

export function drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe) {
  const bottomY = pipe.topHeight + C.PIPE_GAP;
  const bottomHeight = C.CANVAS_HEIGHT - C.GROUND_HEIGHT - bottomY;

  // Top pipe body
  ctx.fillStyle = C.PIPE_COLOR;
  ctx.fillRect(pipe.x, 0, C.PIPE_WIDTH, pipe.topHeight);
  // Top pipe dark edge
  ctx.fillStyle = C.PIPE_COLOR_DARK;
  ctx.fillRect(pipe.x, 0, 4, pipe.topHeight);
  ctx.fillRect(pipe.x + C.PIPE_WIDTH - 4, 0, 4, pipe.topHeight);
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(pipe.x + 8, 0, 10, pipe.topHeight);

  // Top pipe cap
  const capX = pipe.x - C.PIPE_CAP_OVERHANG;
  const capW = C.PIPE_WIDTH + C.PIPE_CAP_OVERHANG * 2;
  ctx.fillStyle = C.PIPE_CAP_COLOR;
  ctx.fillRect(capX, pipe.topHeight - C.PIPE_CAP_HEIGHT, capW, C.PIPE_CAP_HEIGHT);
  ctx.strokeStyle = C.PIPE_CAP_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, pipe.topHeight - C.PIPE_CAP_HEIGHT, capW, C.PIPE_CAP_HEIGHT);
  // Cap highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(capX + 4, pipe.topHeight - C.PIPE_CAP_HEIGHT + 2, 10, C.PIPE_CAP_HEIGHT - 4);

  // Bottom pipe body
  ctx.fillStyle = C.PIPE_COLOR;
  ctx.fillRect(pipe.x, bottomY, C.PIPE_WIDTH, bottomHeight);
  ctx.fillStyle = C.PIPE_COLOR_DARK;
  ctx.fillRect(pipe.x, bottomY, 4, bottomHeight);
  ctx.fillRect(pipe.x + C.PIPE_WIDTH - 4, bottomY, 4, bottomHeight);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(pipe.x + 8, bottomY, 10, bottomHeight);

  // Bottom pipe cap
  ctx.fillStyle = C.PIPE_CAP_COLOR;
  ctx.fillRect(capX, bottomY, capW, C.PIPE_CAP_HEIGHT);
  ctx.strokeStyle = C.PIPE_CAP_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, bottomY, capW, C.PIPE_CAP_HEIGHT);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(capX + 4, bottomY + 2, 10, C.PIPE_CAP_HEIGHT - 4);
}

export function drawBird(ctx: CanvasRenderingContext2D, bird: Bird) {
  ctx.save();
  ctx.translate(bird.x + C.BIRD_WIDTH / 2, bird.y + C.BIRD_HEIGHT / 2);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  const bx = -C.BIRD_WIDTH / 2;
  const by = -C.BIRD_HEIGHT / 2;

  // Body shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(1, 2, C.BIRD_WIDTH / 2, C.BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = C.BIRD_BODY;
  ctx.beginPath();
  ctx.ellipse(0, 0, C.BIRD_WIDTH / 2, C.BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c8960f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Belly
  ctx.fillStyle = '#fce885';
  ctx.beginPath();
  ctx.ellipse(2, 4, C.BIRD_WIDTH / 3, C.BIRD_HEIGHT / 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  const wingFlap = Math.sin(bird.wingPhase) * 5;
  ctx.fillStyle = C.BIRD_WING;
  ctx.beginPath();
  ctx.ellipse(bx + 12, by + 16 + wingFlap, 10, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c06b1a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Eye white
  ctx.fillStyle = C.BIRD_EYE_WHITE;
  ctx.beginPath();
  ctx.ellipse(bx + 28, by + 8, 6, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Eye pupil
  ctx.fillStyle = C.BIRD_EYE_BLACK;
  ctx.beginPath();
  ctx.ellipse(bx + 30, by + 9, 3, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(bx + 29, by + 7, 1.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = C.BIRD_BEAK;
  ctx.beginPath();
  ctx.moveTo(bx + 32, by + 13);
  ctx.lineTo(bx + 44, by + 15);
  ctx.lineTo(bx + 32, by + 19);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b8421e';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Beak line
  ctx.strokeStyle = '#b8421e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx + 32, by + 16);
  ctx.lineTo(bx + 42, by + 15.5);
  ctx.stroke();

  ctx.restore();
}

export function drawScore(ctx: CanvasRenderingContext2D, score: number) {
  const text = score.toString();
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#fff';
  ctx.strokeText(text, C.CANVAS_WIDTH / 2, 70);
  ctx.fillText(text, C.CANVAS_WIDTH / 2, 70);
}

export function drawFlash(ctx: CanvasRenderingContext2D, alpha: number) {
  if (alpha <= 0) return;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
}

export function drawIdleScreen(ctx: CanvasRenderingContext2D) {
  // Title
  ctx.font = 'bold 44px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#543800';
  ctx.fillStyle = '#fff';
  ctx.strokeText('Flappy Bird', C.CANVAS_WIDTH / 2, 160);
  ctx.fillText('Flappy Bird', C.CANVAS_WIDTH / 2, 160);

  // Subtitle
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#543800';
  ctx.fillStyle = '#fce885';
  ctx.strokeText('Tap or Press Space to Play', C.CANVAS_WIDTH / 2, 380);
  ctx.fillText('Tap or Press Space to Play', C.CANVAS_WIDTH / 2, 380);
}

export function drawGameOver(ctx: CanvasRenderingContext2D, score: number, bestScore: number) {
  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);

  // Game Over panel
  const panelW = 260;
  const panelH = 200;
  const px = (C.CANVAS_WIDTH - panelW) / 2;
  const py = 150;

  // Panel background
  ctx.fillStyle = '#dec06c';
  ctx.strokeStyle = '#543800';
  ctx.lineWidth = 4;
  roundRect(ctx, px, py, panelW, panelH, 12);
  ctx.fill();
  ctx.stroke();

  // Inner panel
  ctx.fillStyle = '#c1923a';
  roundRect(ctx, px + 12, py + 50, panelW - 24, panelH - 100, 6);
  ctx.fill();

  // "Game Over" text
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#543800';
  ctx.fillStyle = '#fff';
  ctx.strokeText('Game Over', C.CANVAS_WIDTH / 2, py + 36);
  ctx.fillText('Game Over', C.CANVAS_WIDTH / 2, py + 36);

  // Score
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText('Score:', px + 28, py + 82);
  ctx.textAlign = 'right';
  ctx.fillText(score.toString(), px + panelW - 28, py + 82);

  // Best
  ctx.textAlign = 'left';
  ctx.fillText('Best:', px + 28, py + 118);
  ctx.textAlign = 'right';
  ctx.fillText(bestScore.toString(), px + panelW - 28, py + 118);

  // Medal
  if (score >= 10) {
    const medalColor = score >= 40 ? '#ffd700' : score >= 20 ? '#c0c0c0' : '#cd7f32';
    ctx.fillStyle = medalColor;
    ctx.beginPath();
    ctx.arc(px + 56, py + 96, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#543800';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#543800';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('★', px + 56, py + 101);
  }

  // Restart
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fce885';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#543800';
  ctx.strokeText('Tap or Space to Restart', C.CANVAS_WIDTH / 2, py + panelH + 40);
  ctx.fillText('Tap or Space to Restart', C.CANVAS_WIDTH / 2, py + panelH + 40);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
