import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public", // Specify where to output the service worker file
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
});

export default withPWA({
  // Other Next.js configuration options can go here
});
