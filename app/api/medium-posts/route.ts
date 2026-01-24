import { NextResponse } from "next/server"
// No utilizando por el momento util para usar data de Medium
export async function GET() {
  try {
    console.log("[v0] Fetching Medium RSS feed...")

    // Fetch RSS feed from Medium
    const response = await fetch("", {
      next: { revalidate: 900 }, // Cache for 15 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Medium RSS feed")
    }

    const rssText = await response.text()

    console.log("[v0] RSS feed length:", rssText.length)
    const itemMatches = rssText.match(/<item>(.*?)<\/item>/gs) || []
    console.log("[v0] Number of items found in RSS:", itemMatches.length)

    // Parse RSS XML to extract posts
    const posts = parseRSSFeed(rssText)

    console.log("[v0] Number of posts parsed:", posts.length)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching Medium posts:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}

function parseRSSFeed(rssText: string) {
  const posts: any[] = []

  // Extract items using regex (simple parsing)
  const itemRegex = /<item>(.*?)<\/item>/gs
  const items = rssText.match(itemRegex) || []

  items.forEach((item) => {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
    const linkMatch = item.match(/<link>(.*?)<\/link>/)
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)
    const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)
    const contentMatch = item.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/)

    if (titleMatch && linkMatch) {
      let imageUrl = null

      // Method 1: Look for images in content:encoded field (most reliable)
      if (contentMatch?.[1]) {
        const contentImageMatch = contentMatch[1].match(/<img[^>]+src="([^">]+)"[^>]*>/)
        if (contentImageMatch?.[1]) {
          imageUrl = contentImageMatch[1]
        }
      }

      // Method 2: Look for images in description field
      if (!imageUrl && descriptionMatch?.[1]) {
        const descImageMatch = descriptionMatch[1].match(/<img[^>]+src="([^">]+)"[^>]*>/)
        if (descImageMatch?.[1]) {
          imageUrl = descImageMatch[1]
        }
      }

      // Method 3: Look for Medium's thumbnail pattern
      if (!imageUrl) {
        const thumbnailMatch = item.match(/<media:thumbnail[^>]+url="([^">]+)"/)
        if (thumbnailMatch?.[1]) {
          imageUrl = thumbnailMatch[1]
        }
      }

      // Method 4: Look for media:content
      if (!imageUrl) {
        const mediaMatch = item.match(/<media:content[^>]+url="([^">]+)"/)
        if (mediaMatch?.[1]) {
          imageUrl = mediaMatch[1]
        }
      }

      let cleanDescription = ""
      if (descriptionMatch?.[1]) {
        cleanDescription = descriptionMatch[1]
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/&[^;]+;/g, " ") // Replace HTML entities with space
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .trim()

        // Only add ellipsis if we actually have content and it's longer than 150 chars
        if (cleanDescription.length > 150) {
          cleanDescription = cleanDescription.substring(0, 150) + "..."
        }
      }

      // If no description found, use a default
      if (!cleanDescription) {
        cleanDescription = "Read this article on Medium to learn more."
      }

      posts.push({
        title: titleMatch[1] || "Untitled Article",
        link: linkMatch[1],
        pubDate: pubDateMatch?.[1] || "",
        description: cleanDescription,
        image: imageUrl,
      })
    }
  })

  return posts
}
