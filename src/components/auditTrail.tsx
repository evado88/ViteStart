import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataGrid, {
  Column,
  MasterDetail,
  Pager,
  Paging,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import CheckBox from "devextreme-react/check-box";
import Button from "devextreme-react/button";
import { Titlebar } from "./titlebar";
import { Card } from "./card";
import { Row } from "./row";
import { Col } from "./column";
import Assist from "../classes/assist";
import PageConfig from "../classes/page-config";
import { useAuth } from "../context/AuthContext";

//the audit trail for administrators: changes made through the system and
//sign-ins are recorded by the server; page views and exports by the browser

const SOURCES = [
  { value: "server", text: "Changes and sign-ins" },
  { value: "browser", text: "Page views and exports" },
  { value: "", text: "Everything" },
];

//the local calendar day (not UTC)
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

//browser session records in plain words
const SESSION_ACTIONS: Record<string, string> = {
  Start: "Signed in",
  "End - Logout": "Signed out",
  "End - Expired": "Session expired",
};

const actionText = (row: any) =>
  row.feature == "Session" ? SESSION_ACTIONS[row.action] ?? row.action : row.action;

const outcome = (row: any) => {
  const text = `${row.action ?? ""}`;
  if (row.status_code >= 400 || /failed|denied|unauthori/i.test(text)) return "failed";
  return "ok";
};

//the details submitted with a change (secrets were blanked by the server)
const Details = ({ data }: { data: any }) => {
  const row = data.data;
  const facts: [string, any][] = [
    ["Address", row.method ? `${row.method} ${row.model ?? ""}` : row.model],
    ["Result", row.status_code ? `${row.status_code}` : null],
    ["Took", row.duration_ms != null ? `${row.duration_ms} ms` : null],
    ["IP address", row.ip_address],
    ["Browser", row.user_agent],
    ["Session", row.token],
  ].filter(([, v]) => v) as [string, any][];
  return (
    <div className="audit-detail">
      <table className="audit-facts">
        <tbody>
          {facts.map(([k, v]) => (
            <tr key={k}>
              <th>{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {row.after && (
        <>
          <div className="audit-detail-title">Details submitted</div>
          <pre className="audit-json">{JSON.stringify(row.after, null, 2)}</pre>
        </>
      )}
      {row.before && (
        <>
          <div className="audit-detail-title">Before</div>
          <pre className="audit-json">{JSON.stringify(row.before, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export const AuditTrail = ({ signIns }: { signIns: boolean }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const grid = useRef<DataGrid>(null);
  const checked = useRef(false);

  const title = signIns ? "Sign-ins" : "Audit Events";
  const pageConfig = new PageConfig(title, "audits/search", "", "Audit", "", [Assist.ROLE_ADMIN]);

  const today = new Date();
  const weekAgo = new Date(today.getTime() - 6 * 86400000);
  const [dateFrom, setDateFrom] = useState<Date>(weekAgo);
  const [dateTo, setDateTo] = useState<Date>(today);
  const [person, setPerson] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState(signIns ? "" : "server");
  const [failedOnly, setFailedOnly] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    const params = new URLSearchParams({
      date_from: iso(dateFrom),
      date_to: iso(dateTo),
      limit: "2000",
    });
    if (person.trim()) params.set("user", person.trim());
    if (text.trim()) params.set("text", text.trim());
    if (source) params.set("source", source);
    if (signIns) params.set("sign_ins", "true");
    if (failedOnly) params.set("failed_only", "true");

    setLoading(true);
    Assist.loadData(title, `audits/search?${params.toString()}`)
      .then((data: any) => {
        setRows(data);
        setLoading(false);
      })
      .catch((message) => {
        setLoading(false);
        Assist.showMessage(message, "error");
      });
  };

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }
    load();
  }, []);

  const failures = rows.filter((r) => outcome(r) == "failed").length;

  return (
    <div className="page-content">
      <Titlebar title={title} section={"Administration"} icon={"cubes"} url="/" />
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card showHeader={false}>
            <p className="text-muted">
              {signIns
                ? "Every attempt to sign in, including failed ones with the email that was tried, and every sign-out."
                : "Changes made through the system are recorded by the server with the signed-in person, what they did, and the details they submitted (passwords and codes are never stored). Expand a row to see the details."}
            </p>
            <div className="audit-filters">
              <div>
                <label>From</label>
                <DateBox value={dateFrom} type="date" displayFormat="dd MMM yyyy"
                  onValueChange={(v) => setDateFrom(v)} />
              </div>
              <div>
                <label>To</label>
                <DateBox value={dateTo} type="date" displayFormat="dd MMM yyyy"
                  onValueChange={(v) => setDateTo(v)} />
              </div>
              <div>
                <label>Person (email)</label>
                <TextBox value={person} placeholder="e.g. member-010" showClearButton={true}
                  onValueChange={(v) => setPerson(v)} onEnterKey={load} />
              </div>
              {!signIns && (
                <div>
                  <label>Area or action</label>
                  <TextBox value={text} placeholder="e.g. Monthly postings, Approve" showClearButton={true}
                    onValueChange={(v) => setText(v)} onEnterKey={load} />
                </div>
              )}
              {!signIns && (
                <div>
                  <label>Show</label>
                  <SelectBox dataSource={SOURCES} valueExpr="value" displayExpr="text" value={source}
                    onValueChange={(v) => setSource(v)} />
                </div>
              )}
              <div className="audit-filter-check">
                <CheckBox value={failedOnly} text="Failed or refused only"
                  onValueChange={(v) => setFailedOnly(v)} />
              </div>
              <div className="audit-filter-button">
                <Button text="Search" type="default" icon="search" onClick={load} disabled={loading} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card showHeader={false}>
            <DataGrid
              ref={grid}
              className="dx-card wide-card"
              dataSource={rows}
              keyExpr="id"
              noDataText={loading ? "Loading..." : "Nothing recorded for these filters"}
              showBorders={false}
              columnAutoWidth={true}
              wordWrapEnabled={true}
              rowAlternationEnabled={true}
            >
              <Paging defaultPageSize={25} />
              <Pager showPageSizeSelector={true} allowedPageSizes={[25, 50, 100]} showInfo={true} />
              <Toolbar>
                <Item location="before">
                  <span className="text-muted">
                    {rows.length} record{rows.length == 1 ? "" : "s"}
                    {failures ? `, ${failures} failed or refused` : ""}
                    {rows.length >= 2000 ? " (first 2,000 - narrow the dates to see more)" : ""}
                  </span>
                </Item>
                <Item
                  location="after"
                  widget="dxButton"
                  options={{
                    icon: "save",
                    text: "Excel Export",
                    onClick: () =>
                      Assist.downloadExcel(title, rows, grid.current?.instance.getVisibleColumns()),
                  }}
                />
              </Toolbar>
              <Column dataField="date" caption="When" dataType="datetime" format="dd MMM yyyy HH:mm:ss" width={165} />
              <Column dataField="user_email" caption="Person" />
              {!signIns && (
                <Column
                  dataField="source"
                  caption="Recorded by"
                  width={110}
                  calculateCellValue={(r: any) => (r.source == "server" ? "Server" : "Browser")}
                />
              )}
              {!signIns && <Column dataField="feature" caption="Area" />}
              <Column
                dataField="action"
                caption={signIns ? "Result" : "Action"}
                calculateCellValue={actionText}
                cellRender={(c) => (
                  <span className={outcome(c.data) == "failed" ? "audit-failed" : ""}>{c.value}</span>
                )}
              />
              {!signIns && <Column dataField="object_id" caption="Record" width={90} />}
              <Column dataField="ip_address" caption="IP address" width={130} />
              <MasterDetail enabled={true} render={(d) => <Details data={d} />} />
            </DataGrid>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

