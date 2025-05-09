import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createCanvas, loadImage, GlobalFonts } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';
import { encode as encodeBase64 } from "https://deno.land/std@0.177.0/encoding/base64.ts";

// Register fonts (add actual font files to your project and reference them here)
try {
  await Deno.mkdir('./fonts', { recursive: true });
  // You'd need to add these fonts to your project, or use web fonts
  // GlobalFonts.registerFromPath("./fonts/Inter-Bold.ttf", "Inter-Bold");
  // GlobalFonts.registerFromPath("./fonts/Inter-Regular.ttf", "Inter-Regular");
} catch (e) {
  console.error("Error loading fonts:", e);
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
    
    // Set background - gold gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#854d0e');
    gradient.addColorStop(0.25, '#a16207');
    gradient.addColorStop(0.5, '#ca8a04');
    gradient.addColorStop(0.75, '#eab308');
    gradient.addColorStop(1, '#facc15');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height * 0.65);
    
    // Set bottom section background
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, height * 0.65, width, height * 0.35);
    
    // Draw card for invitation section
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(width * 0.1, height * 0.1, width * 0.8, height * 0.45, 20);
    ctx.fill();
    
    // Add border to card
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add text - title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Meeting Invitation', width / 2, height * 0.25);
    
    // Add subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '24px sans-serif';
    ctx.fillText("You've been invited to join a meeting", width / 2, height * 0.32);
    
    // Add call to action
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px sans-serif';
    ctx.fillText('Click to join on Codavra', width / 2, height * 0.38);
    
    // Draw meeting details in bottom section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'left';
    
    // Need to handle text wrapping for longer titles
    const inviterText = `${decodeURIComponent(organizer)} has invited you to ${decodeURIComponent(title)}`;
    wrapText(ctx, inviterText, 40, height * 0.75, width - 80, 36);
    
    // Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '20px sans-serif';
    wrapText(ctx, decodeURIComponent(description), 40, height * 0.85, width - 80, 24);
    
    // Website
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px sans-serif';
    ctx.fillText('www.codavra.com', 40, height - 40);
    
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

// Helper function to wrap text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      lineCount++;
      
      if (lineCount >= 2) {
        // Add ellipsis if we have more than 2 lines
        if (n < words.length - 1) {
          // Remove last word and add ellipsis
          const lastSpaceIndex = line.lastIndexOf(' ');
          if (lastSpaceIndex > 0) {
            line = line.substring(0, lastSpaceIndex) + '...';
          } else {
            line = line.substring(0, line.length - 1) + '...';
          }
          ctx.fillText(line, x, y);
        } else {
          ctx.fillText(line, x, y);
        }
        break;
      }
    } else {
      line = testLine;
    }
  }
  
  // If we haven't reached max lines, print the last line
  if (lineCount < 2) {
    ctx.fillText(line, x, y);
  }
} 