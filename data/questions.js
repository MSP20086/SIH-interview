// data/questions.js
export const questions = [
  {
    id: 1,
    question: "What is Next.js?",
    answer:
      "Next.js is a React framework for building server-side rendered and statically generated web applications.",
  },
  {
    id: 2,
    question: "How do you use React hooks?",
    answer:
      "React hooks allow you to use state and other React features without writing a class. Common hooks include useState and useEffect.",
  },
  {
    id: 3,
    question: "What is a REST API?",
    answer:
      "A REST API (Representational State Transfer Application Programming Interface) is an architectural style for designing networked applications using HTTP requests to perform CRUD operations.",
  },
  {
    id: 4,
    question: "What are some common HTTP methods?",
    answer: "Common HTTP methods include GET, POST, PUT, DELETE, PATCH.",
  },
  {
    id: 5,
    question: "What is TypeScript?",
    answer:
      "TypeScript is a superset of JavaScript that adds static typing to the language, which can help catch errors during development.",
  },
  {
    id: 6,
    question: "What is server-side rendering?",
    answer:
      "Server-side rendering (SSR) is the process of rendering a client-side JavaScript application on the server rather than in the browser. This can improve performance and SEO.",
  },
  {
    id: 7,
    question: "What is static site generation?",
    answer:
      "Static site generation (SSG) is a method of generating HTML pages at build time, rather than on each request. This can lead to faster load times and better performance.",
  },
  {
    id: 8,
    question:
      "What is the difference between client-side and server-side rendering?",
    answer:
      "Client-side rendering (CSR) occurs in the browser, while server-side rendering (SSR) happens on the server. SSR can provide faster initial page loads and better SEO, while CSR can result in a more dynamic user experience.",
  },
  {
    id: 9,
    question: "What are Next.js API routes?",
    answer:
      "Next.js API routes provide a way to build API endpoints within the Next.js application, allowing you to handle server-side logic and data fetching without needing a separate backend.",
  },
  {
    id: 10,
    question: "How does Next.js handle routing?",
    answer:
      "Next.js handles routing based on the file system. Each file in the `pages` directory automatically becomes a route, and dynamic routes can be created using file and folder naming conventions.",
  },
  {
    id: 11,
    question: "What are environment variables in Next.js?",
    answer:
      "Environment variables in Next.js are used to configure settings for different environments (development, production). They can be defined in `.env` files and accessed using `process.env.<VARIABLE_NAME>`.",
  },
  {
    id: 12,
    question: "What is the purpose of `getServerSideProps` in Next.js?",
    answer:
      "`getServerSideProps` is a Next.js function that runs on the server-side before rendering a page. It allows you to fetch data and pass it as props to your page component, which can be useful for server-side rendering.",
  },
  {
    id: 13,
    question: "How do you manage global state in a Next.js application?",
    answer:
      "Global state in a Next.js application can be managed using context API, React hooks like `useReducer`, or state management libraries like Redux or Zustand.",
  },
  {
    id: 14,
    question: "What is Incremental Static Regeneration (ISR) in Next.js?",
    answer:
      "Incremental Static Regeneration (ISR) allows you to update static content after the site has been built, without needing to rebuild the entire site. This is useful for sites with dynamic content.",
  },
  {
    id: 15,
    question: "What is the purpose of `getStaticProps` in Next.js?",
    answer:
      "`getStaticProps` is a Next.js function used for static site generation. It allows you to fetch data at build time and pass it as props to your page component, enabling the generation of static HTML pages.",
  },
];
