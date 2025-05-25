import {
  Bird,
  DollarSign,
  Egg,
  FileText,
  Flame,
  Home,
  LineChart,
  Pill,
  Scale,
  Settings,
  Sprout,
  Users,
  Wheat,
} from "lucide-react";

export type NavItem = {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  children?: NavItem[];
};

export const navigationConfig: NavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: LineChart,
    children: [
      {
        title: "Egg Production",
        path: "/reports/egg-production",
        icon: Egg,
      },
      {
        title: "Mortality",
        path: "/reports/mortality",
        icon: Scale,
      },
      {
        title: "Finances",
        path: "/reports/finances",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Manage",
    path: "/manage",
    icon: Settings,
    children: [
      {
        title: "Flocks",
        path: "/manage/flocks",
        icon: Users,
      },
      {
        title: "Feed Formulas",
        path: "/manage/feed-formulas",
        icon: Wheat,
      },
      {
        title: "Materials",
        path: "/manage/materials",
        icon: Sprout,
      },
    ],
  },
  {
    title: "Birds",
    path: "/birds",
    icon: Bird,
  },
  {
    title: "Eggs",
    path: "/eggs",
    icon: Egg,
    children: [
      {
        title: "Overview",
        path: "/eggs",
        icon: Egg,
      },
      {
        title: "Production",
        path: "/eggs/production",
        icon: Egg,
      },
      {
        title: "Sales",
        path: "/eggs/sales",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Customers",
    path: "/eggs/customers",
    icon: Users,
  },
  {
    title: "Feed",
    path: "/feed",
    icon: Wheat,
  },
  {
    title: "Vaccines",
    path: "/vaccines",
    icon: Pill,
  },
  {
    title: "Manure",
    path: "/manure",
    icon: Flame,
  },
  {
    title: "Other",
    path: "/other",
    icon: FileText,
  },
];

// Helper function to generate breadcrumb paths from a URL
export const getBreadcrumbItems = (path: string) => {
  const segments = path.split("/").filter(Boolean);

  // Always start with home
  const breadcrumbs = [{ label: "Home", path: "/" }];

  // Build the breadcrumb items based on path segments
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format the label (capitalize first letter, replace hyphens with spaces)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({ label, path: currentPath });
  });

  return breadcrumbs;
};
