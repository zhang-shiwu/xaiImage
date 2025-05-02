# xAI Image Generator

A Next.js application that generates images using the xAI API (Grok-2-image model). This application allows you to:

- Generate images from text prompts
- Create multiple images at once (1-10)
- Choose between URL and Base64 JSON response formats
- View and download generated images
- See the revised prompt used by the AI

## Demo

You can see a live demo of this application [here](#) (deploy your own version to get a demo link).

## Deploy Your Own

Deploy your own version of this application to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzhang-shiwu%2Fxaiimage&env=XAI_API_KEY&envDescription=xAI%20API%20Key%20required%20for%20image%20generation&envLink=https%3A%2F%2Fx.ai)

## Features

- 🖼️ Generate images from text prompts
- 🔄 Create multiple images at once
- 📥 Download generated images
- 🔍 Preview images in full-screen modal
- 📚 View and manage generation history
- 🔒 Secure API key handling (server-side)
- 📱 Responsive design for all devices
- 🌓 Light and dark mode support


## Getting Started

### Prerequisites

- Node.js 18.x or later
- An xAI API key (get it from [x.ai](https://x.ai))

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/xai-image-generator.git
   cd xai-image-generator
   ```

2. Install dependencies:
   ```bash
   # Choose one of the following package managers:
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Copy the example environment file and add your xAI API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your xAI API key.

4. Run the development server:
   ```bash
   # Choose one of the following commands:
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## How It Works

1. The user enters a prompt and selects options (number of images, response format).
2. The client sends a request to the Next.js API route.
3. The API route securely forwards the request to the xAI API using the server-side API key.
4. The generated images are returned to the client and displayed.
5. Users can download the generated images.

---

## API Reference

The application uses the xAI API for image generation. The endpoint is:
```http
POST https://api.x.ai/v1/images/generations
```

### Parameters

| Parameter       | Type     | Description                                                                 |
|-----------------|----------|-----------------------------------------------------------------------------|
| `model`         | `string` | **Required**: Must be `"grok-2-image"` (the xAI image generation model).     |
| `prompt`        | `string` | The text prompt for image generation.                                       |
| `n`             | `number` | Number of images to generate (range: **1–10**).                             |
| `response_format`| `string`| Format of the response: `"url"` (image URLs) or `"b64_json"` (base64 data). |

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [xAI](https://x.ai) - For the image generation API
