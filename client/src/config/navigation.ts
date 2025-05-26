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
  Sprout,
  Store,
  Users,
  Wheat,
} from "lucide-react";

export type NavItem = {
  title: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  children?: NavItem[];
};

export const navigationConfig: NavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  // Daily Operations
  {
    title: "Birds",
    path: "/birds",
    icon: Bird,
    children: [
      {
        title: "Inventory",
        path: "/birds/inventory",
        icon: Store,
      },
      {
        title: "Purchases",
        path: "/birds/buy",
        icon: DollarSign,
      },
      {
        title: "Sales",
        path: "/birds/sell",
        icon: DollarSign,
      },
      {
        title: "Mortality",
        path: "/birds/mortality",
        icon: Scale,
      },
    ],
  },
  {
    title: "Eggs",
    path: "/eggs",
    icon: Egg,
    children: [
      {
        title: "Inventory",
        path: "/eggs/inventory",
        icon: Store,
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
    title: "Feed",
    path: "/feed",
    icon: Wheat,
    children: [
      {
        title: "Inventory",
        path: "/feed/inventory",
        icon: Sprout,
      },
      {
        title: "Batch Production",
        path: "/feed/production",
        icon: Wheat,
      },
      {
        title: "Buy Raw Materials",
        path: "/feed/expenses",
        icon: DollarSign,
      },
      {
        title: "Manage Feed Formulas",
        path: "/manage/feed-formulas",
        icon: Wheat,
      },
      {
        title: "Manage Raw Materials",
        path: "/manage/materials",
        icon: Sprout,
      },
    ],
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
  // Customers
  {
    title: "Customers",
    path: "/eggs/customers",
    icon: Users,
  },
  // Setup/Config as top-level
  {
    title: "Flocks",
    path: "/manage/flocks",
    icon: Users,
  },

  // Reports
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
  // Other
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

  segments.forEach((segment) => {
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
