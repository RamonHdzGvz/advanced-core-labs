export async function fetchImageAsBuffer(url: string): Promise<Uint8Array | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch image", response.status);
      return null;
    }

    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.error("Error fetching image", error);
    return null;
  }
}
