import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { CareersPage } from "./pages/CareersPage";
import { ContactPage } from "./pages/ContactPage";
import { APP_PATHS } from "@/shared/routes/paths";

export const router = createBrowserRouter([
  {
    path: APP_PATHS.home,
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: APP_PATHS.about.slice(1), Component: AboutPage },
      { path: APP_PATHS.portfolio.slice(1), Component: PortfolioPage },
      // Keep legacy path temporarily for compatibility during migration.
      { path: APP_PATHS.legacyCareers.slice(1), loader: () => redirect(APP_PATHS.recruit) },
      { path: APP_PATHS.recruit.slice(1), Component: CareersPage },
      { path: APP_PATHS.contact.slice(1), Component: ContactPage },
    ],
  },
]);
