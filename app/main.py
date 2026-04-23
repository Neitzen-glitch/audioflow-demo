from fastapi import FastAPI
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import httpx
import os

app = FastAPI()

# Get the absolute path of the directory where main.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")


# Mount the static directory to serve CSS and JS
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def serve_frontend():
    """Serves the main HTML interface."""
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

@app.get("/stream")
async def stream_music(url: str):
    """Streams the audio directly to the browser for previewing."""
    async def generate():
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                async with client.stream("GET", url) as response:
                    if response.status_code != 200:
                        return 
                    async for chunk in response.aiter_bytes():
                            yield chunk
            except Exception:
                return
    return StreamingResponse(generate(), media_type="audio/mpeg")

@app.get("/download")
async def download_music(url: str, filename: str = "AudioFlow_Download.mp3"):
    async def generate():
        # Added follow_redirects=True for reliability
        async with httpx.AsyncClient(follow_redirects=True) as client:
            async with client.stream("GET", url) as response:
                async for chunk in response.aiter_bytes():
                    yield chunk
                    
    return StreamingResponse(
        generate(), 
        media_type="audio/mpeg",
        # The spacing in this header is very important!
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )