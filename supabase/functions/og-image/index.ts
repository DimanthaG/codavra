import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createCanvas, loadImage } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

// Register fonts (add actual font files to your project and reference them here)
try {
  await Deno.mkdir('./fonts', { recursive: true });
  // You'd need to add these fonts to your project, or use web fonts
  // GlobalFonts.registerFromPath("./fonts/Inter-Bold.ttf", "Inter-Bold");
  // GlobalFonts.registerFromPath("./fonts/Inter-Regular.ttf", "Inter-Regular");
} catch (e) {
  console.error("Error loading fonts:", e);
}

// Helper function to draw rounded rectangle (since roundRect isn't universally supported)
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper function for drawing centered text
function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, centerX: number, y: number, maxWidth?: number) {
  // Measure the text
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  
  // Don't render if it's too wide
  if (maxWidth && textWidth > maxWidth) {
    return false;
  }
  
  // Calculate starting X position to center text
  const x = centerX - (textWidth / 2);
  
  // Draw text
  ctx.fillText(text, x, y);
  return true;
}

// Break text into lines that fit a width and draw them centered
function drawCenteredParagraph(ctx: CanvasRenderingContext2D, text: string, centerX: number, startY: number, lineHeight: number, maxWidth: number, maxLines = 3) {
  const words = text.split(' ');
  let currentLine = '';
  let lines = [];
  
  // Build lines that fit
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = words[i];
      
      // Stop if we hit the max lines
      if (lines.length >= maxLines - 1) {
        // Check if we can fit the rest
        const restOfText = words.slice(i).join(' ');
        const restMetrics = ctx.measureText(restOfText);
        
        if (restMetrics.width <= maxWidth) {
          lines.push(restOfText);
        } else {
          // Add the current word plus ellipsis
          lines.push(words[i] + '...');
        }
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  
  // Add the last line if we haven't hit max and there's text left
  if (currentLine !== '' && lines.length < maxLines) {
    lines.push(currentLine);
  }
  
  // Calculate total height of text
  const totalHeight = lines.length * lineHeight;
  
  // Draw each line
  let y = startY - (totalHeight / 2) + (lineHeight / 2);
  
  for (let i = 0; i < lines.length; i++) {
    const x = centerX - (ctx.measureText(lines[i]).width / 2);
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
  
  return startY + (totalHeight / 2);
}

serve(async (req) => {
  const url = new URL(req.url);
  
  // Extract parameters from the URL
  const title = url.searchParams.get('title') || 'Meeting Invitation';
  const organizer = url.searchParams.get('organizer') || 'Someone';
  const description = url.searchParams.get('description') || 'Join this meeting';
  const meetingId = url.searchParams.get('id') || '';

  try {
    // Create a canvas with the dimensions of the OG image
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    
    // Load and draw background image
    try {
      const backgroundImage = await loadImage('https://www.codavra.com/image.png');
      ctx.drawImage(backgroundImage, 0, 0, width, height);
    } catch (imgError) {
      console.error("Error loading background image, using fallback gradient:", imgError);
      
      // Fallback to gradient if image loading fails
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#854d0e');
      gradient.addColorStop(0.25, '#a16207');
      gradient.addColorStop(0.5, '#ca8a04');
      gradient.addColorStop(0.75, '#eab308');
      gradient.addColorStop(1, '#facc15');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Card dimensions with a small margin
    const cardMargin = 20;
    const cardX = cardMargin;
    const cardY = cardMargin;
    const cardWidth = width - (cardMargin * 2);
    const cardHeight = height - (cardMargin * 2);
    
    // Draw card for invitation section
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 20);
    ctx.fill();
    
    // Add border to card
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Decoded text
    const formattedTitle = decodeURIComponent(title);
    const formattedOrganizer = decodeURIComponent(organizer);
    const formattedDescription = decodeURIComponent(description);
    
    // The true center point
    const centerX = width / 2;
    
    // Reference point for vertical positioning
    let currentY = height * 0.3; // Start at 30% down
    
    // Main invitation text
    const inviterText = `${formattedOrganizer} invited you to ${formattedTitle}`;
    
    // Draw invitation - use our helper functions
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px sans-serif';
    currentY = drawCenteredParagraph(ctx, inviterText, centerX, currentY, 52, width * 0.7, 3);
    
    // Add spacing
    currentY += 40;
    
    // Draw description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '24px sans-serif';
    currentY = drawCenteredParagraph(ctx, formattedDescription, centerX, currentY, 30, width * 0.7, 3);
    
    // Add call to action (centered by our helper)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px sans-serif';
    const ctaY = height * 0.8;
    drawCenteredText(ctx, 'Click to join on Codavra', centerX, ctaY);
    
    // Website URL (centered by our helper)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px sans-serif';
    drawCenteredText(ctx, 'www.codavra.com', centerX, ctaY + 30);
    
    // Convert canvas to PNG
    const pngData = canvas.toBuffer("image/png");
    
    // Return the PNG as the response
    return new Response(pngData, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(`Error generating image: ${error.message}`, { status: 500 });
  }
}); 