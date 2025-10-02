///Represents the configuration for a page
class PageConfig {
  Title: string;
  Url: string;
  DeleteUrl?: string;
  Single: string;

  /**
   * Creates a new page onfiguration
   * @param title 
   * @param url 
   * @param deleteUrl 
   * @param single 
   * @param plural 
   */
  constructor(
    title: string,
    url: string,
    deleteUrl: string,
    single: string,
  ) {
    this.Title = title;
    this.Url = url;
    this.DeleteUrl = deleteUrl;
    this.Single = single;
  }
}

export default PageConfig;
