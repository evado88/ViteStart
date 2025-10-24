///Represents the configuration for a page
class PageConfig {
  Title: string;
  Url: string;
  DeleteUrl: string;
  Single: string;
  id: number;
  updateUrl: string;
  /**
   * Creates a new page onfiguration
   * @param title
   * @param url
   * @param deleteUrl
   * @param single
   * @param plural
   */
  constructor(title: string, url: string, deleteUrl: string, single: string, updateUrl: string) {
    this.Title = title;
    this.Url = url;
    this.DeleteUrl = deleteUrl;
    this.Single = single;
    this.id = 0;
    this.updateUrl = updateUrl
  }

  verb() {
    return this.id == 0 ? 'Add' : 'Update';
  }
}

export default PageConfig;
