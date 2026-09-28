import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Summary,
  TotalItem,
  GroupItem,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
import { LoadPanel } from "devextreme-react/load-panel";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Assist from "../../../classes/assist";
import AppInfo from "../../../classes/app-info";
import PageConfig from "../../../classes/page-config";
import { useAuth } from "../../../context/AuthContext";

//where each of the other queues is worked through
const QUEUE_PAGES: Record<string, string> = {
  "Member registrations": "/admin/members/submitted",
  "Payment methods": "/admin/payment-methods/list",
  "Member queries": "/admin/member-queries/list",
  "Announcements": "/admin/announcements/list",
};

//one inbox for everything waiting for this administrator: postings can be
//approved in bulk here; rejections (which need a reason) open the posting
const Approvals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const grid = useRef<DataGrid>(null);
  const hasRun = useRef(false);

  const [postings, setPostings] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const pageConfig = new PageConfig(
    "Approvals",
    "monthly-posting/awaiting-me",
    "",
    "Approval",
    "",
    [Assist.ROLE_ADMIN],
  );

  const load = () => {
    setLoading(true);
    Promise.all([
      Assist.loadData("Approvals", "monthly-posting/awaiting-me"),
      Assist.loadData("Pending", "emails/pending"),
    ])
      .then(([rows, pending]: any[]) => {
        setPostings(rows);
        setQueues(pending.filter((q: any) => QUEUE_PAGES[q.label]));
        setSelected([]);
        grid.current?.instance.clearSelection();
        setLoading(false);
      })
      .catch((message) => {
        setLoading(false);
        Assist.showMessage(message, "error");
      });
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }
    load();
  }, []);

  const approveSelected = async () => {
    const ok = await confirm(
      `Approve the ${selected.length} selected posting(s)? Each moves to its next step, and approved proofs of payment are added to the members' accounts.`,
      "Approve selected",
    );
    if (!ok) return;

    setLoading(true);
    const failures: string[] = [];
    let done = 0;
    for (const id of selected) {
      setProgress(`Approving ${done + 1} of ${selected.length}...`);
      const row = postings.find((p) => p.id === id);
      try {
        await Assist.postPutData(
          "Approve",
          `monthly-posting/review-update/${id}`,
          {
            user_id: user.userid,
            review_action: Assist.REVIEW_ACTION_APPROVE,
            comments: "Approved",
            penalize: Assist.RESPONSE_NO,
          },
          id,
        );
        done++;
      } catch (message) {
        failures.push(`${row?.member} (${row?.period}): ${message}`);
      }
    }
    setProgress("");
    setLoading(false);

    if (failures.length === 0) {
      Assist.showMessage(`${done} posting(s) approved`, "success");
    } else {
      Assist.showMessage(
        `${done} approved, ${failures.length} not approved: ${failures.join("; ")}`,
        "warning",
      );
    }
    load();
  };

  const money = (value: number) =>
    value ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "-";

  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel
        position={{ of: "#pageRoot" }}
        visible={loading}
        message={progress || "Loading..."}
        showIndicator={true}
        shading={true}
      />
      <Titlebar
        title="Approvals"
        section="Administration"
        icon="check-square-o"
        url="/"
      ></Titlebar>

      {queues.length > 0 && (
        <Row>
          {queues.map((q) => (
            <Col key={q.label} sz={12} sm={6} lg={3}>
              <Card title={q.label} showHeader={false}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">{q.label}</div>
                    <h3 className="mb-0">{q.count}</h3>
                  </div>
                  <Link to={QUEUE_PAGES[q.label]} className="btn btn-sm btn-outline-primary">
                    Review
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card title="Monthly postings waiting for you" showHeader={true}>
            <p className="text-muted">
              Tick the postings to approve and press <strong>Approve selected</strong>. To reject a
              posting, open it with <strong>Review</strong> and give a reason. Postings you
              reviewed at an earlier step are not shown - another administrator takes the next
              step.
            </p>
            <DataGrid
              ref={grid}
              className="dx-card wide-card"
              dataSource={postings}
              keyExpr="id"
              noDataText="Nothing is waiting for you"
              showBorders={false}
              columnAutoWidth={false}
              wordWrapEnabled={true}
              rowAlternationEnabled={true}
              onSelectionChanged={(e) => setSelected(e.selectedRowKeys)}
            >
              <Selection mode="multiple" showCheckBoxesMode="always" />
              <SearchPanel visible={true} placeholder="Search member..." />
              <GroupPanel visible={false} />
              <Grouping autoExpandAll={true} />
              <Paging defaultPageSize={25} />
              <Pager showPageSizeSelector={true} allowedPageSizes={[25, 50, 100]} showInfo={true} />
              <Toolbar>
                <Item location="before">
                  <Button
                    text={`Approve selected (${selected.length})`}
                    type="success"
                    icon="check"
                    disabled={selected.length === 0 || loading}
                    onClick={approveSelected}
                  />
                </Item>
                <Item location="before">
                  <Button text="Refresh" icon="refresh" onClick={load} />
                </Item>
                <Item name="searchPanel" />
              </Toolbar>
              <Column dataField="stage" caption="Step" groupIndex={0} />
              <Column dataField="member" caption="Member" width={170} />
              <Column dataField="period" caption="Period" />
              <Column dataField="saving" caption="Savings" format=",##0.##" />
              <Column dataField="shares" caption="Shares" format=",##0.##" />
              <Column
                dataField="penalty"
                caption="Penalties & fees"
                cellRender={(c) => money(c.value)}
              />
              <Column
                dataField="loan_repayment"
                caption="Loan repay + interest"
                cellRender={(c) => money(c.value)}
              />
              <Column
                dataField="loan_application"
                caption="New loan"
                cellRender={(c) => (
                  <span>
                    {money(c.value)}
                    {c.data.guarantor_required && (
                      <span className="badge badge-warning ml-1" title="Needs guarantor approval">
                        guarantor
                      </span>
                    )}
                  </span>
                )}
              />
              <Column dataField="deposit_total" caption="Member pays" cellRender={(c) => money(c.value)} />
              <Column dataField="receive_total" caption="Member receives" cellRender={(c) => money(c.value)} />
              <Column
                caption="Proof of payment"
                cellRender={(c) =>
                  c.data.pop_path ? (
                    <a
                      href={encodeURI(`${AppInfo.apiUrl}static/${c.data.pop_path}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <Column
                caption=""
                width={100}
                cellRender={(c) => (
                  <Button
                    text="Review"
                    stylingMode="outlined"
                    onClick={() => navigate(`/admin/monthly-postings/view/${c.data.id}`)}
                  />
                )}
              />
              <Summary>
                <GroupItem column="member" summaryType="count" displayFormat="{0} posting(s)" />
                <TotalItem column="deposit_total" summaryType="sum" valueFormat=",##0.##" />
                <TotalItem column="receive_total" summaryType="sum" valueFormat=",##0.##" />
              </Summary>
            </DataGrid>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Approvals;
