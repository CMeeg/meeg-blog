export interface ArticleStoryblok {
  title: string;
  summary: any;
  series?: string;
  body: any;
  metadata?: {
    _uid?: string;
    title?: string;
    plugin?: string;
    og_image?: string;
    og_title?: string;
    description?: string;
    twitter_image?: string;
    twitter_title?: string;
    og_description?: string;
    twitter_description?: string;
    [k: string]: any;
  };
  _uid: string;
  component: "article";
  [k: string]: any;
}

export interface ArticleListingStoryblok {
  starts_with?: string;
  with_tag?: string;
  per_page: number;
  _uid: string;
  component: "article_listing";
  [k: string]: any;
}

export interface ArticleSeriesStoryblok {
  title: string;
  summary: any;
  wip?: boolean;
  _uid: string;
  component: "article_series";
  [k: string]: any;
}

export interface AuthorStoryblok {
  title?: string;
  intro?: any;
  first_name: string;
  last_name: string;
  bio?: any;
  metadata?: {
    _uid?: string;
    title?: string;
    plugin?: string;
    og_image?: string;
    og_title?: string;
    description?: string;
    twitter_image?: string;
    twitter_title?: string;
    og_description?: string;
    twitter_description?: string;
    [k: string]: any;
  };
  _uid: string;
  component: "author";
  [k: string]: any;
}

export interface AssetStoryblok {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  [k: string]: any;
}

export interface GlobalStoryblok {
  copyright?: string;
  github_username?: string;
  twitter_username?: string;
  logo: AssetStoryblok;
  site_title?: string;
  main_nav: NavItemStoryblok[];
  metadata?: {
    _uid?: string;
    title?: string;
    plugin?: string;
    og_image?: string;
    og_title?: string;
    description?: string;
    twitter_image?: string;
    twitter_title?: string;
    og_description?: string;
    twitter_description?: string;
    [k: string]: any;
  };
  _uid: string;
  component: "global";
  uuid?: string;
  [k: string]: any;
}

export interface MessageBoxStoryblok {
  type: "" | "info";
  message: any;
  _uid: string;
  component: "message_box";
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      cached_url?: string;
      linktype?: string;
      [k: string]: any;
    }
  | {
      id?: string;
      cached_url?: string;
      linktype?: "story";
      [k: string]: any;
    }
  | {
      url?: string;
      cached_url?: string;
      linktype?: "asset" | "url";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      [k: string]: any;
    };

export interface NavItemStoryblok {
  name: string;
  link: MultilinkStoryblok;
  _uid: string;
  component: "nav_item";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (ArticleListingStoryblok | MessageBoxStoryblok | PageHeadingStoryblok)[];
  metadata?: {
    _uid?: string;
    title?: string;
    plugin?: string;
    og_image?: string;
    og_title?: string;
    description?: string;
    twitter_image?: string;
    twitter_title?: string;
    og_description?: string;
    twitter_description?: string;
    [k: string]: any;
  };
  _uid: string;
  component: "page";
  uuid?: string;
  [k: string]: any;
}

export interface PageHeadingStoryblok {
  title: string;
  intro?: any;
  _uid: string;
  component: "page_heading";
  [k: string]: any;
}

export interface SitemapOptionsStoryblok {
  show?: boolean;
  _uid: string;
  component: "sitemap_options";
  [k: string]: any;
}
