import * as UI from "@bridge/ui"

const columns = [{ id: "name", label: "Proposal", render: (item: { name: string }) => item.name }]

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <UI.DataList
        status={UI.DataListStatus.loading}
        columns={columns}
        rows={[]}
        title="Long copy loading"
        skeletonRow={3}
      />
      <UI.DataList
        status={UI.DataListStatus.error}
        columns={columns}
        rows={[]}
        errorTitle="Unable to load your proposals"
        errorDescription="A medium-length explanation helps explain the problem and what to do next."
        onRetry={() => {}}
        retryLabel="Try loading again"
      />
      <UI.DataList
        status={UI.DataListStatus.empty}
        columns={columns}
        rows={[]}
        emptyTitle="No proposals"
        emptyDescription="Start with a proposal."
        emptyAction={<UI.Button>Create proposal</UI.Button>}
      />
      <UI.DataList status={UI.DataListStatus.ready} columns={columns} rows={[]} title="Zero rows" />
      <UI.DataList
        status={UI.DataListStatus.ready}
        variants={UI.DataListVariant.card}
        columns={columns}
        rows={[{ name: "One row" }]}
      />
      <UI.DataList
        status={UI.DataListStatus.ready}
        variants={UI.DataListVariant.table}
        columns={columns}
        rows={Array.from({ length: 50 }, (_, index) => ({ name: `Proposal ${index + 1}` }))}
        title="50 rows"
      />
      <UI.DataList status={UI.DataListStatus.empty} columns={columns} rows={[]} emptyTitle="No items." />
    </div>
  )
}
