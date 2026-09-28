import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadPanel } from "devextreme-react/load-panel";
import { Titlebar } from "./titlebar";
import { Card } from "./card";
import { Row } from "./row";
import { Col } from "./column";
import Assist from "../classes/assist";
import AppInfo from "../classes/app-info";
import PageConfig from "../classes/page-config";
import { useAuth } from "../context/AuthContext";

//read-only pages for published announcements and knowledge base articles,
//open to every signed-in user (members and administrators)

export interface ReadingKind {
  title: string; //"Announcements"
  single: string; //"Announcement"
  listUrl: string; //API: published items
  itemUrl: string; //API: one item, id appended
  listPath: string; //app route of the list
  viewPath: string; //app route of one item, id appended
  empty: string;
}

export const ANNOUNCEMENTS: ReadingKind = {
  title: "Announcements",
  single: "Announcement",
  listUrl: "announcements/published",
  itemUrl: "announcements/id/",
  listPath: "/announcements",
  viewPath: "/announcements/view/id/",
  empty: "There are no announcements yet",
};

export const KNOWLEDGE_BASE: ReadingKind = {
  title: "Knowledge Base",
  single: "Article",
  listUrl: "knowledge-base-articles/published",
  itemUrl: "knowledge-base-articles/id/",
  listPath: "/knowledge-base",
  viewPath: "/knowledge-base/article/view/id/",
  empty: "There are no knowledge base articles yet",
};

const ALL_USERS = [Assist.ROLE_MEMBER, Assist.ROLE_ADMIN];

//content comes from the rich-text editor: keep the formatting, drop anything
//that could run code
const safeHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,form").forEach((e) => e.remove());
  doc.querySelectorAll("*").forEach((e) => {
    for (const attr of Array.from(e.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith("on") || ((name === "href" || name === "src") && value.startsWith("javascript:"))) {
        e.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
};

//text for the list preview: keep a space where paragraphs, lines and list items end
const plainText = (html: string) => {
  const spaced = (html || "").replace(/<\/(p|div|li|h[1-6]|tr)>|<br\s*\/?>/gi, " $&");
  const text = new DOMParser().parseFromString(spaced, "text/html").body.textContent || "";
  return text.replace(/\s+/g, " ").trim();
};

const dateText = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

const usePageAccess = (pageConfig: PageConfig) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const checked = useRef(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
    } else {
      setAllowed(true);
    }
  }, []);
  return allowed;
};

export const ReadingList = ({ kind }: { kind: ReadingKind }) => {
  const [items, setItems] = useState<any[] | null>(null);
  const pageConfig = new PageConfig(kind.title, kind.listUrl, "", kind.single, "", ALL_USERS);
  const allowed = usePageAccess(pageConfig);

  useEffect(() => {
    if (!allowed) return;
    Assist.loadData(kind.title, kind.listUrl)
      .then((data: any) => setItems(data))
      .catch((message) => {
        setItems([]);
        Assist.showMessage(message, "error");
      });
  }, [allowed]);

  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel position={{ of: "#pageRoot" }} visible={items == null} showIndicator={true} shading={false} />
      <Titlebar title={kind.title} section="" icon="" url="" />
      <Row>
        <Col sz={12} sm={12} lg={9}>
          {items != null && items.length == 0 && (
            <Card showHeader={false}>
              <p className="text-muted mb-0">{kind.empty}</p>
            </Card>
          )}
          {(items ?? []).map((item) => {
            const text = plainText(item.content);
            return (
              <Card key={item.id} showHeader={false}>
                <div className="reading-item">
                  <Link to={`${kind.viewPath}${item.id}`} className="reading-item-title">
                    {item.title}
                  </Link>
                  <div className="reading-meta">
                    {dateText(item.created_at)}
                    {item.category?.cat_name ? ` · ${item.category.cat_name}` : ""}
                    {item.attachment ? " · has an attachment" : ""}
                  </div>
                  <p className="reading-excerpt">
                    {text.length > 260 ? `${text.slice(0, 260).trimEnd()}…` : text}
                  </p>
                  <Link to={`${kind.viewPath}${item.id}`}>Read more</Link>
                </div>
              </Card>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export const ReadingView = ({ kind }: { kind: ReadingKind }) => {
  const { eId } = useParams();
  const [item, setItem] = useState<any | null>(null);
  const [missing, setMissing] = useState(false);
  const pageConfig = new PageConfig(`View ${kind.single}`, `${kind.itemUrl}${eId}`, "", kind.single, "", ALL_USERS);
  const allowed = usePageAccess(pageConfig);

  useEffect(() => {
    if (!allowed) return;
    Assist.loadData(kind.single, `${kind.itemUrl}${eId}`)
      .then((data: any) => setItem(data))
      .catch(() => setMissing(true));
  }, [allowed, eId]);

  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel position={{ of: "#pageRoot" }} visible={item == null && !missing} showIndicator={true} shading={false} />
      <Titlebar title={item?.title ?? kind.single} section="" icon="" url="" />
      <Row>
        <Col sz={12} sm={12} lg={9}>
          <Card showHeader={false}>
            {missing && (
              <p className="text-muted mb-0">
                This {kind.single.toLowerCase()} could not be found. It may have been removed.
              </p>
            )}
            {item != null && (
              <article className="reading-article">
                <div className="reading-meta">
                  {dateText(item.created_at)}
                  {item.category?.cat_name ? ` · ${item.category.cat_name}` : ""}
                  {item.user ? ` · ${item.user.fname} ${item.user.lname}` : ""}
                </div>
                <div
                  className="reading-content"
                  dangerouslySetInnerHTML={{ __html: safeHtml(item.content) }}
                />
                {item.attachment && (
                  <p className="reading-attachment">
                    <i className="fa fa-paperclip"></i>{" "}
                    <a
                      href={encodeURI(`${AppInfo.apiUrl}static/${item.attachment.path}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.attachment.name}
                    </a>
                  </p>
                )}
              </article>
            )}
            <p className="mb-0 mt-3">
              <Link to={kind.listPath}>
                <i className="fa fa-angle-left"></i> All {kind.title.toLowerCase()}
              </Link>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const AnnouncementsPage = () => <ReadingList kind={ANNOUNCEMENTS} />;
export const AnnouncementViewPage = () => <ReadingView kind={ANNOUNCEMENTS} />;
export const KnowledgeBasePage = () => <ReadingList kind={KNOWLEDGE_BASE} />;
export const ArticleViewPage = () => <ReadingView kind={KNOWLEDGE_BASE} />;
