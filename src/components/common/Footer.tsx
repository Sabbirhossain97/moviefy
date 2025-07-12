import { Video } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-movie-primary" />
          <span className="font-bold text-xl bg-gradient-to-r whitespace-nowrap from-movie-primary to-yellow-500 bg-clip-text text-transparent">
            Moviefy <sup className="bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">AI</sup>
          </span>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-4 md:mt-0">
          © {new Date().getFullYear()} Moviefy. All Rights Reserved. Data by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-movie-primary hover:underline"
          >
            The Movie Database (TMDb)
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
